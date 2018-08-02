<template>
  <div>
    <div class="container-block">
      <div class="coin-list clearfix">
        <a v-for="(coin, index) in coins" :key="coin.code" :disabled='disabled' class="b"
          :class="{'is-chioce': index === curIndex, 'is-enabled': !coin.node_enabled, 'indent': !(requireImg(`market/market-${coin.code}`))}"
          @click='ChooseCoin(index, coin.node_enabled)'>
          <img v-if="requireImg(`market/market-${coin.code}.svg`)" :src="requireImg(`market/market-${coin.code}.svg`)">
          <span :class='{"withoutimg": !requireImg(`market/market-${coin.code}.svg`)}'>
            {{ coin.code | upper }}
          </span>
        </a>
      </div>
      <div class="deposit-currency paddingT40 b">
        <div v-if="deposit_address !== ''" class="w-per-60 clearfix">
          <div class="deposit-qrcode marginT5">
            <qr-code v-if="deposit_address" :length='"230"' :dateUrl="qrcode(deposit_address)"></qr-code>
            <vue-simple-spinner class="withdraw-loading" v-else size="185"></vue-simple-spinner>
          </div>
          <div class="deposit-address">
            <div class="address-div">
              <div id="copy" class="b color666">{{ deposit_address === false ? '' : deposit_address  }}</div>
              <div class="address-warn marginT10">
                {{ ReplaceCurrency }}
              </div>
            </div>
            <basic-button style="margin-top: 8px;" :disabled='disabled' data-clipboard-target="#copy" class="btn-copy btn" :text='$t("deposit_currency.copy_address")'></basic-button>
            <news-prompt :text='prompt'></news-prompt>
          </div>
        </div>
        <div v-else class='text-center'>
          {{ $t("deposit_currency.temporarily_unable_deposit") }}
        </div>
        <div class="deposit-confirNum w-per-60">
          {{$t('deposit_currency.confirm_num_descirbe')}}<span style="color: #ff7f18;">{{ ConfirmNum }}</span>{{$t('deposit_currency.about_time')}}<router-link class='link' :to="`${ROUTER_VERSION}/form/deposit?currency=${curCoin}`">{{$t('title.form_deposit')}}</router-link>{{ $t('deposit_currency.in_query') }}
        </div>
        <ul class="marginT80 remind">
          <strong class="withdraw-remind">{{ $t('withdraw_currency.reminder') }}</strong>
          <li>{{ $t('deposit_currency.use_wallet_service') }}</li>
          <li>{{ $t('deposit_currency.font_descripe') }}</li>
          <li>{{ $t('deposit_currency.operation_done') }}</li>
        </ul>
      </div>

    </div>
    <basic-table :loading='deposit_loading' :captionTitle='depositRecord.captionTitle' :perfix='curCoin.toUpperCase()' :item='getDepositRecord'>
      <template slot="href" slot-scope="props">
        <span class="pointer link" @click="OpenWindow(props.data.url)">
          {{ props.data.context }}
        </span>
      </template>
      <div slot="more" class="text-center b-t table-more">
        <router-link class="link" :to="`${ROUTER_VERSION}/form/deposit?currency=${curCoin}`">
          {{$t('my_account.show_more')}}
        </router-link>
      </div>
    </basic-table>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import pusher from '@/common/js/pusher'
import Clipboard from 'clipboard'
var QRCode = require('qrcode')
const _debounce = require('lodash.debounce')
const timeLine = 20000

export default {
  name: 'Desposit',
  // props: ['home'],
  data () {
    return {
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      deposit_loading: true,
      disabled: false,
      deposit_address: this.$t('deposit_currency.deposit_address'),
      depositRecord: {
        captionTitle: 'deposit_currency.deposit_record',
        item: []
      },
      coins: '',
      curIndex: 0,
      curCoin: 'btc',
      prompt: '',
      confirm_num: '',
      sn: ''
    }
  },
  created () {
    this.disabled = true
    this.GetCoin()
    this.init()
  },
  mounted () {
    var clipboard = new Clipboard('.btn-copy')
    var time = () => {
      setTimeout(() => {
        this.prompt = ''
      }, 1500)
    }

    clipboard.on('success', () => {
      clearTimeout(time)
      this.prompt = this.$t('deposit_currency.copy_success')
    })
    clipboard.on('success', _debounce(time, 500))
  },
  computed: {
    ReplaceCurrency () {
      return this.$t('deposit_currency.warn1').replace(/COIN/g, this.curCoin.toUpperCase())
    },
    ConfirmNum () {
      return this.$t('deposit_currency.confirm_num').replace(/NUM/g, this.confirm_num)
    },
    getDepositRecord () {
      return [{content: [
        this.$t('deposit_currency.deposit_date'),
        this.$t('deposit_currency.trading_hash'),
        this.$t('deposit_currency.recharge_amount'),
        this.$t('deposit_currency.confirmation_number'),
        this.$t('withdraw_currency.statu_and_operation')
      ]
      }].concat(this.depositRecord.item)
    }
  },
  methods: {
    init () {
      this._get({
        url: '/funds/home.json'
      }, (res) => {
        var data = res.data.success
        this.coins = this.BtcFirst(data.currencies)
        this.sn = data.sn
        this.privateChannel(data.sn)
      })
    },
    BtcFirst (arr) {
      var index = -1
      var ele = null
      arr.filter((element, idx) => {
        if (element.code === 'btc') {
          ele = element
          index = idx
        }
      })
      if (index !== -1) {
        arr.splice(index, 1)
        arr.unshift(ele)
      }
      return arr
    },
    ChooseCoin (index, allow) {
      if (!allow || this.disabled || this.coins[index].code === this.curCoin) return
      this.curIndex = index
      this.curCoin = this.coins[index].code
      this.GetCoin(this.curCoin)
    },
    qrcode (str) {
      var dateUrl = ''
      QRCode.toDataURL(str, {widht: 120, height: 120}, (err, string) => {
        if (err) console.log(err)
        dateUrl = string
      })
      return dateUrl
    },
    completeDepositAddress () {
      clearTimeout(this.Time)
      this.ChangePopupBox({
        type: 'success',
        message: this.$t('hint.completion')
      })
      setTimeout(() => {
        if (!this.$store.state.PopupBox.status) return
        this.PopupBoxDisplay()
        this.ChangePopupBox({
          buttondisplay: true
        })
      }, 2000)
    },
    GetCoin (c, funds, sn) {
      var coin = c || 'btc'
      this.deposit_loading = true
      this.disabled = true
      this.deposit_address = ''
      this.loading = true
      this.account_id = ''
      this._get({
        url: `/funds/${coin}/account_info.json`
      }, (res) => {
        var d = res.data.success
        this.disabled = false
        this.loading = false
        if (d.code === 201) {
          if (this.curCoin === coin && this.deposit_address) return
          this.Generating()
        }
        if (d.address) {
          this.deposit_address = d.address
          this.completeDepositAddress()
        } else {
          if (this.account_id) {
            if (this.account_id === d.account.account_id) {
              this.completeDepositAddress()
            }
          } else {
            this.account_id = d.account.account_id
          }
        }
        this.confirm_num = d.deposit_max_confirmation
        this.Balance = d.account.balance
        this.handleDeposit(d.deposits)
      })
    },
    handleDeposit (arr) {
      var obj = this.depositRecord
      obj.item = []
      if (arr.length) {
        obj.item = arr.map(ele => {
          return {
            content: [
              this.$moment(ele.created_at).format('YYYY-MM-DD H:mm:ss'),
              {hover: 'true', context: ele.txid, url: ele.blockchain_url},
              ele.amount,
              ele.confirmations === null ? '0' : `${ele.confirmations} / ${this.confirm_num}`,
              this.$t(`withdraw_currency.${ele.aasm_state}`)
            ]
          }
        })
      }
      this.deposit_loading = false
    },
    privateChannel (sn) {
      var channel = pusher.subscribe(`private-${sn}`)
      channel.bind('deposit_address', (data) => {
        if (data.attributes.deposit_address) {
          this.deposit_address = data.attributes.deposit_address
          this.completeDepositAddress()
        } else {
          if (data.attributes.account_id) {
            if (this.account_id) {
              if (data.attributes.account_id === this.account_id) {
                this.completeDepositAddress()
              }
            } else {
              this.account_id = data.attributes.account_id
            }
          }
        }
      })

      channel.bind('deposits', (data) => {
        var d = data.attributes
        if (d.currency !== this.curCoin) return
        if (this.depositId.includes(d.id)) {
          this.$set(this.depositRecord.item, 0, 0)
          this.depositRecord.item[this.depositId.indexOf(d.id)] = {
            content: [
              this.$moment(d.created_at).format('YYYY-MM-DD H:mm:ss'),
              {hover: true, context: d.txid, url: d.blockchain_url},
              d.amount,
              `${d.confirmations} / ${this.confirm_num}`,
              this.$t(`withdraw_currency.${d.aasm_state}`)
            ]
          }
        } else {
          this.depositId.unshift(d.id)
          this.depositRecord.item.unshift({
            content: [
              this.$moment(d.created_at).format('YYYY-MM-DD H:mm:ss'),
              {hover: true, context: d.txid, url: d.blockchain_url},
              d.amount,
              `${d.confirmations} / ${this.confirm_num}`,
              this.$t(`withdraw_currency.${d.aasm_state}`)
            ]
          })
        }
      }) // deposits pusher
    },
    Generating () {
      this.PopupBoxDisplay({message: '', type: 'loading'})
      this.ChangePopupBox({
        buttondisplay: false,
        message: this.$t('hint.generating_address')
      })
      this.Time = setTimeout(() => {
        this.ChangePopupBox({
          message: this.$t('hint.go_tickets'),
          type: 'error',
          confirm: true,
          href: '/ticket/new',
          buttonText: this.$t('hint.no'),
          buttondisplay: true
        })
        this.Time = false
      }, timeLine)
    },
    requireImg (img) {
      try {
        return require(`Static/img/${img}`)
      } catch (error) {
        try {
          return require(`Static/img/${img.replace('.svg', '.png')}`)
        } catch (error) {
          return false
        }
      }
    },
    ...mapMutations(['PopupBoxDisplay', 'ChangePopupBox'])
  }
}
</script>

<style scoped lang="scss">
  @import './deposit.scss';
</style>
