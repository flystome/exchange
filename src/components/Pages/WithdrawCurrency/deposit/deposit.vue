<template>
  <div class="container-block">
    <div class="coin-list clearfix">
      <a v-for="(coin, index) in home.currencies" :disabled='disabled' class="b"
        :class="{'is-chioce': index === curIndex, 'is-enabled': !coin.node_enabled, 'indent': !(requireImg(`market/market-${coin.code}`))}"
        @click='ChoiceCoin(index, coin.node_enabled)'
        :key="coin.code">
        <img v-if="requireImg(`market/market-${coin.code}.svg`)" :src="requireImg(`market/market-${coin.code}.svg`)">
        <span :class='{"withoutimg": !requireImg(`market/market-${coin.code}.svg`)}'>
          {{ coin.code | upper }}
        </span>
      </a>
    </div>
    <div class="deposit-currency paddingT40 b">
      <div v-if="deposit_address !== ''" class="w-per-60 clearfix">
        <div class="deposit-qrcode marginT5">
          <qr-code v-if="deposit_address_display" :length='"230"' :dateUrl="qrcode(deposit_address)"></qr-code>
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
      <ul class="marginT80">
        <strong class="withdraw-remind">{{ $t('withdraw_currency.reminder') }}</strong>
        <li>{{ $t('deposit_currency.use_wallet_service') }}</li>
        <li>{{ $t('deposit_currency.font_descripe') }}</li>
        <li>{{ $t('deposit_currency.operation_done') }}</li>
      </ul>
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
// import pusher from '@/common/js/pusher'

var QRCode = require('qrcode')
const timeLine = 20000

export default {
  name: 'Desposit',
  props: ['home'],
  data () {
    return {
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      deposit_loading: true,
      disabled: false,
      deposit_address_display: false,
      deposit_address: this.$t('deposit_currency.deposit_address'),
      depositRecord: {
        captionTitle: 'deposit_currency.deposit_record',
        item: []
      },
      coins: this.home.currencies,
      curIndex: 0,
      curCoin: 'btc',
      prompt: '',
      confirm_num: ''
    }
  },
  created () {
    this.disabled = true
    this.GetCoin()
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
        this.$t('funds.status_and_operation')
      ]
      }].concat(this.depositRecord.item)
    },
    ...mapMutations(['PopupBoxDisplay', 'ChangePopupBox'])
  },
  methods: {
    ChoiceCoin (index, allow) {
      console.log(this.coins)
      if (!allow) return
      if (this.disabled) return
      if (this.coins[index].code === this.curCoin) return
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
    GetCoin (c, funds, sn) {
      var obj = this.depositRecord
      var coin = c || 'btc'
      this.deposit_loading = true
      obj.item = []
      this.disabled = true
      this.deposit_address = false
      this.deposit_address_display = false
      this.loading = true
      this._get({
        url: `/funds/${coin}/account_info.json`
      }, (res) => {
        var d = res.data.success
        this.disabled = false
        this.loading = false

        if (d.code === 201 && !this.pusherCurreny.includes(`${coin}`)) {
          if (this.curCoin === `${coin}` && this.deposit_address) return
          this.pusherCurreny.push(`${coin}`)
          if (/deposit/.test(this.$route.path)) {
            this.Generating()
          }
        }

        this.account_id = d.account.account_id
        this.confirm_num = d.deposit_max_confirmation
        var deposits = d.deposits
        if (d.address) {
          this.deposit_address_display = true
          this.deposit_address = d.address
        } else {
          if (this.curCoin === `${coin}` && this.deposit_address) return
          this.deposit_address_display = false
          this.deposit_address = ''
        }
        d.account && (this.Balance = d.account.balance)
        obj.item = []
        // this.depositId = []
        deposits.length === 0 ? obj.item = [] : obj.item = obj.item.concat(deposits.map(d => {
          // this.depositId.push(d.id)
          return {
            content: [
              this.$moment(d.created_at).format('YYYY-MM-DD H:mm:ss'),
              {hover: 'true', context: d.txid, url: d.blockchain_url},
              d.amount,
              d.confirmations === null ? '0' : `${d.confirmations} / ${this.confirm_num}`,
              this.$t(`withdraw_currency.${d.aasm_state}`)
            ]
          }
        }))
        obj.captionTitle = 'deposit_currency.deposit_record'

        this.$nextTick(() => {
          this.deposit_loading = false
        })

        // if (funds && Object.keys(funds).length > 0) {
        //   funds['btc'].forEach((d) => {
        //     if (d.is_default) {
        //       this.Address = d.uid
        //     }
        //   })
        // } else {
        //   if (!this.FundSources[coin]) return
        //   this.FundSources[coin].forEach((d) => {
        //     if (d.is_default) {
        //       this.Address = d.uid
        //     }
        //   })
        // }
      })
    },
    Generating () {
      this.deposit_address_display = false
      this.deposit_address = ''
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
        // return require(`../../../../../static/img/${img}`)
        return require(`Static/img/${img}`)
      } catch (error) {
        try {
          return require(`Static/img/${img.replace('.svg', '.png')}`)
          // return require(`../../../../../static/img/${img.replace('.svg', '.png')}`)
        } catch (error) {
          return false
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .w-per-80 {
    width: 80%;
    margin: 0 auto;
  }
  .w-per-60 {
    width: 60%;
    margin: 0 auto;
  }
  .coin-list {
    width: 100%;
    a {
      display: inline-block;
      float: left;
      width: 111px;
      border-radius: 0;
      height: 40px;
      line-height: 38px;
      text-align: center;
      cursor: pointer;
      &.is-chioce {
        border-color: #4382f7;
      }
      &.is-enabled {
        cursor: not-allowed;
        opacity: 0.4;
      }
      img {
        width: 18px;
        height: 18px;
        margin-right: 4px;
      }
      span {
        vertical-align: middle;
      }
    }
  }
  .deposit-qrcode {
    width: 36%;
    float: left;
    .qrcode {
      margin-top: -25px;
      margin-left: -20px;
    }
  }
  .deposit-address {
    width: 64%;
    float: right;
    #copy {
      padding: 10px;
      height: 96px;
      word-wrap: break-word;
      overflow: auto;
      font-weight: bold;
    }
    .address-warn {
      font-size: 14px;
      color: #ff7f18;
      // word-wrap: break-word;
    }
  }
</style>
