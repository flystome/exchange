<template>
  <div class="member-center" @click="ChoiceStatus(false)" @keyup.enter="Withdraw" :class="{'currency-frommoblie': FromMoblie}">
    <div class="container-block">
      <div class="currency-withdraw">
          <div class="fl">
            <span>
              <i class="withdraw-asset"></i>
              {{$t('withdraw_currency.total_assets')}} <span>{{ TotalAssets | toLocaleString }}</span> BTC
            </span>
            <i class="withdraw-freeze marginL45 marginR5"></i>
            <a class='color999'>
              {{$t('withdraw_currency.frozen_assets')}} {{ LockAssets | toLocaleString }} BTC
            </a>
          </div>
        <div class="fr">
          <menu-underline
          ref="menu"
          :route="'WithdrawCurrency'"
          v-model='step'
          :menu-index='step'
          :underline-margin="'5px'"
          :menu-margin="'23px'"
          :menu-list="[$t('dashboard.asset_distribution'), $t('dashboard.asset_curve'), $t('withdraw_currency.deposit'), $t('withdraw_currency.withdraw')]">
          </menu-underline>
        </div>
      </div>
    </div>
    <template v-if='route === "deposit" || route === "withdraw"'>
      <div class="container-block">
        <div class="withdraw-coin">
          <a v-for="(coin,index) in this.currencies"
          :disabled='disabled'
          :class="{'is-chioce':index === length, 'is-enabled': !coin.node_enabled, 'indent': !(requireImg(`market/market-${coin.code}`))}"
          @click='ChoiceCoin(index, coin.node_enabled)'
          class="b btn"
          :key="coin.code">
            <img v-if="requireImg(`market/market-${coin.code}.svg`)" :src="requireImg(`market/market-${coin.code}.svg`)">
            <span :class='{"withoutimg": !requireImg(`market/market-${coin.code}.svg`)}'>
              {{ coin.code | upper }}
            </span>
          </a>
        </div>
        <div class="b withdraw-formContainer" v-if="route === 'withdraw'">
          <div class="withdraw-form">
            <news-prompt :Time='3000' v-on:bind='withdraw_prompt = $event' :text='withdraw_prompt'></news-prompt>
            <div @click.stop="ChoiceStatus(!choice)" class="withdraw-address b-l" :style="{background:`url('${requireImg('large/select.png')}') 100% 100% no-repeat`}">
              {{ Address !== 'withdraw_currency.withdraw_currency_address' ? Address : $t('withdraw_currency.withdraw_currency_address') }}
            </div>
            <div v-show="choice" @click.stop="ChoiceStatus(true)" class='b address-contain'>
              <div class="address-height">
                <div class="pointer" v-for="(data, index) in FundSources[CurrencyType]" :key="index" @click.stop="ChoiceAddress(index, data.id)">
                    <div class="fl">
                      <div class="color999">
                        <strong style="height: 16px;display: block;">
                          {{ data.extra }}
                        </strong>
                      </div>
                      <div>
                        <strong>
                          {{ data.uid }}
                        </strong>
                      </div>
                  </div>
                  <div class="fr">
                    <span @click.stop="DefaultFunds(data.id, index)">{{$t('withdraw_currency.set_as_default')}}</span>丨
                    <span @click.stop="DeleteFunds(data.id, FundSources[CurrencyType], index)">{{$t('withdraw_currency.delete')}}</span>
                  </div>
                </div>
              </div>
              <div class="addnew pointer text-center" @click.stop="AddAddress">
                  <i class="withdraw-add-icon"></i>
                  {{$t('withdraw_currency.use_a_new_address')}}
              </div>
            </div>
            <div v-show='!choice'>
              <div class="marginT15 withdraw-add" style="display: flex" v-if="withdrawAddress">
                <basic-input class="withdraw-all" v-model="WithdrawData.remark" :placeholder='$t("withdraw_currency.remark_label")'>
                </basic-input>
                <basic-input class="withdraw-all" :validate='"required|withdraw_address"' :danger='true' ref="withdraw_address" v-model="WithdrawData.newAddress" :placeholder='$t("withdraw_currency.withdraw_currency_address")'>
                </basic-input>
              </div>
              <div class="withdraw-explain">
                <span>{{ $t('withdraw_currency.available_balance') }}</span> {{ Balance | toFixed | toLocaleString }} {{ CurrencyType | upper }} <span class="marginL15">{{ $t('withdraw_currency.remaining_withdraw') }}</span> {{ Remain | toFixed | toLocaleString }} {{ CurrencyType | upper }}<span v-if="equivalence" style="color:black">≈{{ equivalence | toFixed | toLocaleString }} BTC</span>
              </div>
              <template v-if="Address !== 'withdraw_currency.withdraw_currency_address' || withdrawAddress">
                <basic-input :validate='"required|withdraw_amount"' :invalid='invalid' :danger='true' ref='withdraw_amount' v-model="WithdrawData.amount" class="withdraw-all" style="display: flex;" :placeholder="this.$t('withdraw_currency.Amount_to_withdraw')">
                    <basic-button :disabled='disabled' @click.native="WithdrawAll" class="link btn" slot="button" :text="$t('withdraw_currency.withdraw_all')"></basic-button>
                  </basic-input>
                <div class="withdraw-explain">
                  <span>{{ $t('withdraw_currency.minimum_withdraw_amount_of_money') }} {{ currency_precision }}</span>
                  <span class="fr">{{ $t('withdraw_currency.poundage') }} {{ withdraw_fee }}</span>
                  </div>
                <div class="choice-validate">
                  <select class="select-option" ref='select'
                  v-model="validate"
                  :disabled="disabled">
                    <option v-if="loginData.app_activated" value="google">{{ this.$t('withdraw_currency.google_validate') }}</option>
                    <option v-if="loginData.sms_activated" value="sms">{{ this.$t('withdraw_currency.sms') }}</option>
                  </select>
                  <basic-input :danger='true' ref='verify_code' :validate='"required|verify_code"'  v-model="WithdrawData.otp"  :key="validate" class="marginB10">
                  </basic-input>
                  <button :disabled='disabled' @click="SendSms" v-if="validate === 'sms'" class="white-btn btn">{{ timer }}</button>
                </div>
                <div v-if="Rucaptcha">
                  <basic-input :danger='true' ref='rucaptcha' :validate='"required|verify_code"' :placeholder="$t('deposit_currency.identifying_code')" v-model="WithdrawData.rucaptcha"  class="marginT10">
                  </basic-input>
                  <img @click="ChangeRucaptcha" class="pointer marginB10" :key="'rucaptcha'" :src="`${HOST_URL}${Rucaptcha}`">
                </div>
              <basic-button class="btn" :disabled='disabled' :class="{'marginT30': !Rucaptcha}" @click.native="Withdraw" style="width:100%" :text="$t('withdraw_currency.withdraw')">
              </basic-button>
              </template>
            </div>
          </div>
          <div class="withdraw-currency">
            <ul>
              <strong class="withdraw-remind">{{ $t('withdraw_currency.reminder') }}</strong>
              <li>
                {{ $t('withdraw_currency.min_currency') }}
              </li>
              <li>
                {{ $t('withdraw_currency.make_sure_safe') }}
              </li>
              <li>
                {{ $t('withdraw_currency.do_not_response') }}
              </li>
            </ul>
          </div>
        </div>
        <div v-if="route === 'deposit'" class="deposit-currency paddingT40 b">
          <template v-if="deposit_address !== ''">
            <div class="text-right deposit-qrcode  marginT5 col-md-5">
              <qr-code v-if="deposit_address_display" :length='"230"' :dateUrl="qrcode(deposit_address)"></qr-code>
              <vue-simple-spinner class="withdraw-loading" v-else size="185"></vue-simple-spinner>
            </div>
            <div class="deposit-address col-md-5">
              <div class="address-div">
                <div id="copy" class="b color666">{{ deposit_address === false ? '' : deposit_address  }}</div>
                <div class="address-warn marginT10">
                  {{ ReplaceCurrency }}
                </div>
              </div>
              <basic-button style="margin-top: 8px;" :disabled='disabled' data-clipboard-target="#copy" class="btn-copy btn" :text='$t("deposit_currency.copy_address")'></basic-button>
              <news-prompt :text='prompt'></news-prompt>
            </div>
          </template>
          <div v-else class='text-center'>
            {{ $t("deposit_currency.temporarily_unable_deposit") }}
          </div>
          <div class="clearfix">
          </div>
          <div class=" deposit-confirNum col-md-8">
            {{$t('deposit_currency.confirm_num_descirbe')}}<span style="color: #ff7f18;">{{ ConfirmNum }}</span>{{$t('deposit_currency.about_time')}}<router-link class='link' :to="`${ROUTER_VERSION}/form/deposit?currency=${CurrencyType}`">{{$t('title.form_deposit')}}</router-link>{{ $t('deposit_currency.in_query') }}
          </div>
          <ul class="marginT80">
              <strong class="withdraw-remind">{{ $t('withdraw_currency.reminder') }}</strong>
              <li>
                {{ $t('deposit_currency.use_wallet_service') }}
              </li>
              <li>
                {{ $t('deposit_currency.font_descripe') }}
              </li>
              <li>
                {{ operationDone }}
              </li>
            </ul>
        </div>
      </div>
      <basic-table :loading='withdraw_loading' :captionTitle='WithdrawRecord.captionTitle' :item='getWithdrawRecord' :perfix='CurrencyType.toUpperCase()' v-if="route === 'withdraw'">
        <div slot="more" class="text-center b-t table-more col-md-6">
          <!-- col-md-6 -->
          <router-link class="link" :to="`${ROUTER_VERSION}/form/withdraw?currency=${CurrencyType}`">
            {{$t('my_account.show_more')}}
          </router-link>
        </div>
        <div slot="more" class="b-t text-center table-more b-l col-md-6">
          <!-- col-md-6 -->
          <router-link :to="`${ROUTER_VERSION}/form/withdraw_cancel`" class='link '>
            {{$t('withdraw_currency.cancel_withdraw')}}
          </router-link>
        </div>
      </basic-table>
      <basic-table :loading='deposit_loading' :captionTitle='depositRecord.captionTitle' :perfix='CurrencyType.toUpperCase()' :item='getDepositRecord' v-else>
        <template slot="href"
        slot-scope="props">
          <span class="pointer link" @click="OpenWindow(props.data.url)">
            {{ props.data.context }}
          </span>
        </template>
        <div slot="more" class="text-center b-t table-more">
          <router-link class="link" :to="`${ROUTER_VERSION}/form/deposit?currency=${CurrencyType}`">
            {{$t('my_account.show_more')}}
          </router-link>
        </div>
      </basic-table>
    </template>
    <!-- <Desposit v-if='route === "deposit"' :home='home'></Desposit> -->
    <!-- <Withdraw v-if='route === "withdraw"' :home='home'></Withdraw> -->
    <template v-show='(route === "pie" || route === "line")'>
      <DashBoard :route="route"></DashBoard>
    </template>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import Clipboard from 'clipboard'
import DashBoard from 'Pages/Dashboard/DashboardIndex.vue'
import Desposit from './deposit/deposit.vue'
import Withdraw from './withdraw/withdraw.vue'
const _debounce = require('lodash.debounce')
import pusher from '@/common/js/pusher'
var QRCode = require('qrcode')
const timeLine = 20000
export default {
  name: 'withdrawCurrency',
  data () {
    return {
      HOST_URL: process.env.HOST_URL,
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      Address: 'withdraw_currency.withdraw_currency_address',
      account_id: '',
      Balance: '',
      currencies: [],
      choice: false,
      CurrencyType: 'btc',
      confirm_num: '',
      disabled: !false,
      deposit_address_display: false,
      deposit_address: this.$t('deposit_currency.deposit_address'),
      DepositAddress: '',
      depositId: [],
      deposit_loading: true,
      depositRecord: {
        captionTitle: 'deposit_currency.deposit_record',
        item: []
      },
      equivalence: '',
      FundSources: '',
      GeneratAddress: '',
      home: {},
      invalid: false,
      loading: false,
      length: 0,
      newaa: [],
      pusherCurreny: [],
      prompt:'',
      Remain: '',
      Rucaptcha: false,
      resend: false,
      redirectLock: false,
      route: '',
      step: 0,
      second: -1,
      TotalAssetsa: 0,
      Time: '',
      usdt_worth: '',
      validate: '',
      warn: {
        length: 0,
        message: '',
        type: 'success',
        point: '.'
      },
      withdraw_prompt: '',
      withdrawAddress: false,
      withdraw_fee: '',
      WithdrAwable: false,

      withdraw_loading: true,
      WithdrawData: {
        Address_id: '',
        otp: '',
        rucaptcha: '',
        amount: '',
        remark: '',
        newAddress: ''
      },
      WithdrawRecord: {
        captionTitle: 'withdraw_currency.withdraw_currency_record',
        item: []
      }
    }
  },
  created () {
    this.disabled = true
    this.route = this.$route.path.slice(this.$route.path.lastIndexOf('/') + 1)
    this._get({
      url: '/funds/home.json'
    }, (res) => {
      this.disabled = false
      var d = res.data.success
      this.home = d
      this.FundSources = d.fund_sources
      this.TotalAssetsa = Number(d.total_assets.btc_worth).toFixed(8)

      pusher.connection.state === "connected" && this.GetCoin(false, d.fund_sources, d.sn)
      d.rucaptcha && (this.Rucaptcha = d.rucaptcha)
      d.notice &&  this.PopupBoxDisplay({
        message: this.$t(`withdraw_currency.withdraw_confirm_${d.notice.type}`),
        type: d.notice.type
      })
      d.currencies.forEach((a) => {
        if (a.code === 'btc') {
          this.currencies.unshift({
            code: a.code,
            node_enabled: a.node_enabled
          })
        } else {
          this.currencies.push({
            code: a.code,
            node_enabled: a.node_enabled
          })
        }
      })

      this.privateChannel(d.sn, this.FundSources)
      this.MarketChannel()
    })
  },
  filters: {
    toFixed (str) {
      var reg = /.*\..*/
      return Number(str).toFixed(Math.min((!reg.test(str) ? 0 : String(str).split('.')[1].length), 8))
    },
    toLocaleString (n) {
      if (!n) return 0
  　　var re=/\d{1,3}(?=(\d{3})+$)/g;
  　　var n1=String(n).replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
  　　return n1;
    }
  },
  methods: {
    MarketChannel () {
      var MarketChannel = pusher.subscribe(`market-global`)
      MarketChannel.bind('tickers', _debounce((data) => {
        var state = this.$store.state
        if (!state.marketData) return
        if (Object.keys(state.assets).length === 0) return
        var BtcMarket = state.marketData["btc"].reduce((a, b) => {
          return a.concat(Object.keys(b)[0])
        }, [])
        Object.keys(data).forEach((key) => {
          if (data[key].base_currency === 'usdt') {
            if (key === 'btcusdt') {
              if (!state.assets['usdt']) return
              state.assets['usdt'].price = 1 / Number(data[key].last)
            }
            return
          }
          if (data[key].base_currency === 'btc') {
            if (!state.assets[data[key].quote_currency]) return
            state.assets[data[key].quote_currency].price = data[key].last
            return
          }
          if (data[key].base_currency === 'eth') {
            if (!BtcMarket.includes(`${data[key].quote_currency}/btc`)) {
              if (!state.assets[data[key].quote_currency] && state.assets['eth']) return
              state.assets[data[key].quote_currency].price = data[key].last * state.assets['eth'].price
            }
          }
        })
      }, 5000))
    },
    privateChannel (sn, fund_sources) {
      var channel = pusher.subscribe(`private-${sn}`)

      channel.bind('deposit_address', (data) => {
        console.log(data)
        if (data.attributes.account_id === this.account_id) {
        // if (data.attributes.currency === this.CurrencyType) {
          this.deposit_address = data.attributes.deposit_address
          this.deposit_address_display = true
        }
        if (typeof this.DepositAddress !== 'object') {
          this.DepositAddress = {
            [data.attributes.currency]: data.attributes.deposit_address
          }
        } else {
          if (!Object.keys(this.DepositAddress).includes((data.attributes.currency).toString())) {
            this.$set(this.DepositAddress, data.attributes.currency, data.attributes.deposit_address)
          }
        }
      })

      channel.bind('pusher:subscription_succeeded', () => {
        this.GetCoin(false, fund_sources, sn)
      })

      channel.bind('account', (data) => {
        var assets = this.$store.state.assets
        if (!assets[data.currency]) return
        assets[data.currency].balance && (assets[data.currency].balance = Number(data.balance))
        assets[data.currency].locked && (assets[data.currency].locked = Number(data.locked))
        if (data.currency !== this.CurrencyType) return
        this.Balance = data.balance
      }) //account pusher

      channel.bind('deposits', (data) => {
        var d = data.attributes
        if (d.currency !== this.CurrencyType) return
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
      }) //deposits pusher
    },
    OpenWindow (url) {
      window.open(url)
    },
    ChangeRucaptcha () {
      this.Rucaptcha = `${this.Rucaptcha.replace(/\?.+/, '')}?${Math.random()}`
    },
    WithdrawAll () {
      this.WithdrawData.amount = this.$store.getters.ToFixed(Math.min(Number(this.Remain), Number(this.Balance)))
      this.$nextTick(() => {
        this.$refs.withdraw_amount.$validator.validateAll()
      })
    },
    AddAddress () {
      this.withdrawAddress = true
      this.ChoiceStatus(false)
      this.Address = 'withdraw_currency.withdraw_currency_address'
      this.WithdrawData.Address_id = ''
    },
    requireImg (img) {
      try {
        return require(`Img/${img}`)
      } catch (error) {
        try {
          return require(`Img/${img.replace('.svg', '.png')}`)
        } catch (error) {
          return false
        }
      }
    },
    ChoiceCoin (index, type) {
      if (!type) return
      if (this.disabled) return
      if (this.currencies[index].code === this.CurrencyType) return
      this.length = index
      this.CurrencyType = this.currencies[index].code
      this.GetCoin(this.currencies[index].code)
      this.Address = 'withdraw_currency.withdraw_currency_address'
      this.WithdrawData.Address_id = ''
      this.WithdrawData.amount = ''
    },
    ChoiceStatus (boolean) {
      this.choice = boolean
    },
    ChoiceAddress (index, id) {
      this.WithdrawData.Address_id = id
      this.withdrawAddress = false
      this.Address = this.FundSources[this.CurrencyType][index].uid
      this.ChoiceStatus(false)
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
    GetCoin (c, funds, sn) {
      this.withdrawAddress = false
      this.disabled = true
      this.loading = true
      var coin = c || 'btc'

      var obj = this.WithdrawRecord
      this.withdraw_loading = true
      obj.item = []

      var objd = this.depositRecord
      this.deposit_loading = true
      objd.item = []
      this.deposit_address = false
      this.deposit_address_display = false

      this._get({
        url: `/funds/${coin}/account_info.json`
      }, (d) => {
        var d = d.data.success
        this.GeneratAddress = false
        this.disabled = false
        this.loading = false
        ;(() => {
          if (d.code === 201 && !this.pusherCurreny.includes(coin)) {
            if (this.CurrencyType === coin && this.deposit_address) return
            this.pusherCurreny.push(`${coin}`)
            this.GeneratAddress = true
            if (/deposit/.test(this.$route.path)) {
              this.Generating()
            }
          }
        })()
        this.account_id = d.account.account_id
        this.confirm_num = d.deposit_max_confirmation
        this.withdraw_fee = d.withdraw_fee
        this.currency_precision = Math.max(2 * d.withdraw_fee, 1 / Math.pow(10, d.currency_precision))
        this.equivalence = coin === 'btc' ? '' : (d.today_withdraw_remain_btc ? d.today_withdraw_remain_btc : 0)
        this.WithdrAwable = d.withdrawable
        this.Remain = d.today_withdraw_remain ? d.today_withdraw_remain : 0
        var withdraws = d.withdraws
        var deposits = d.deposits
        ;(() => {
          if (d.address) {
            this.deposit_address_display = true
            this.deposit_address = d.address
          } else {
            if (this.CurrencyType === coin && this.deposit_address) return
            this.deposit_address_display = false
            this.deposit_address = ''
          }
        })()
        d.account && (this.Balance = d.account.balance)
        obj.item = []
        objd.item = []
        withdraws.length === 0 ? obj.item = [] : obj.item = obj.item.concat(withdraws.map(d => {
          var id = d.id
          return {
            content: [
              id,
              this.$moment(d.created_at).format('YYYY-MM-DD H:mm:ss'),
              d.fund_uid,
              d.amount,
              d.fee,
              { type: d, context: this.$t(`withdraw_currency.${d.aasm_state}`), id: id }
            ]
          }
        }))
        this.depositId = []
        deposits.length === 0 ? objd.item = [] : objd.item = objd.item.concat(deposits.map(d => {
          this.depositId.push(d.id)
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
        obj.captionTitle = 'withdraw_currency.withdraw_currency_record'
        objd.captionTitle = 'deposit_currency.deposit_record'

        this.$nextTick(() => {
          this.deposit_loading = false
          this.withdraw_loading = false
        })

        if (funds && Object.keys(funds).length > 0) {
          funds['btc'].forEach((d) => {
            if (d.is_default) {
              this.Address = d.uid
              this.WithdrawData.Address_id = d.id
            }
          })
        } else {
          if (!this.FundSources[c]) return
          this.FundSources[c].forEach((d) => {
            if (d.is_default) {
              this.Address = d.uid
              this.WithdrawData.Address_id = d.id
            }
          })
        }
      })
    },
    DeleteFunds (id, funds, index) {
      this.disabled = true
      this._delete({
        url: `/funds/${id}/delete_fund_source.json`
      }, (d) => {
        this.disabled = false
        var d = d.data
        if (d.success) {
          if (id === this.WithdrawData.Address_id) {
            this.Address = 'withdraw_currency.withdraw_currency_address'
            this.WithdrawData.Address_id = ''
            this.ChoiceStatus(false)
          }
          this.PopupBoxDisplay({message: this.$t('api_server.withdraw_currency.delete_fund_source_200'), type: 'success'})
          funds.splice(index, 1)
        } else {
          this.PopupBoxDisplay({message: this.$t('api_server.withdraw_currency.delete_fund_source_1001'), type: 'error'})
        }
      })
    },
    DefaultFunds (id, index) {
      this.disabled = true
      this._post({
        url: `/funds/${id}/set_default_fund_source.json`
      }, (d) => {
        this.disabled = false
        var d = d.data
        if (d.success) {
          this.FundSources[this.CurrencyType].forEach((d) => {
            if (d.is_default) {
              d.is_default = false
            }
            if (d.id === id) {
              d.is_default = true
            }
          })
          this.ChoiceAddress(index, id)
          this.PopupBoxDisplay({message: this.$t('api_server.withdraw_currency.set_fund_source_200'), type: 'success'})
        } else {
          this.PopupBoxDisplay({message: this.$t('api_server.withdraw_currency.set_fund_source_1001'), type: 'error'})
        }
      })
    },
    SendSms () {
      if (this.second > 0) {
        return
      }
      this.disabled = true
      this._post({
        url: '/funds/send_sms'
      }, (d) => {
        this.disabled = false
        if (d.data.error) {
          this.PopupBoxDisplay({message: this.$t('api_server.withdraw_currency.send_phone_error_1001'), type: 'error'})
        } else {
          this.CountDown()
        }
      })
    },
    async Withdraw () {
      if (this.disabled) return
      if (!this.WithdrAwable) {
        this.PopupBoxDisplay({message: this.$t('withdraw_currency.temporarily_can_not_withdraw'), type: 'error'})
        return
      }

      if (this.withdrawAddress) {
        const withdraw_address = this.$refs['withdraw_address']
        var withdraw_valid = await withdraw_address.$validator.validateAll()
        if (!withdraw_valid) {
          this.withdraw_prompt = withdraw_address.error
          return
        }
      }

      const withdraw_amount = this.$refs['withdraw_amount']
      var amount_valid = await withdraw_amount.$validator.validateAll()
      if (!amount_valid) {
        this.withdraw_prompt = withdraw_amount.error
        return
      } else {
        if (this.WithdrawData.amount < this.currency_precision) {
          this.withdraw_prompt = `${this.$t('validation.less_then')} ${this.currency_precision} ${this.CurrencyType.toUpperCase()}`
          this.invalid = true
          return
        }
        if (this.WithdrawData.amount > Math.min(Number(this.Remain), Number(this.Balance))) {
          this.invalid = true
          this.withdraw_prompt = `${this.$t('validation.more_then')} ${Math.min(Number(this.Remain), Number(this.Balance))} ${this.CurrencyType.toUpperCase()}`
          return
        }
      }

      const verify_code = this.$refs['verify_code']
      var verify_valid = await verify_code.$validator.validateAll()
      if (!verify_valid) {
        this.withdraw_prompt = verify_code.error
        return
      }

      if (this.$refs['rucaptcha']) {
        const rucaptcha = this.$refs['rucaptcha']
        var rucaptcha_valid = await rucaptcha.$validator.validateAll()
        if (!rucaptcha_valid) {
          this.withdraw_prompt = rucaptcha.error
          return
        }
      }

      var validate = this.validate !== 'sms' ? {
        type: 'app',
        otp: this.WithdrawData.otp
      } : {
        type: 'sms',
        otp: this.WithdrawData.otp
      }

      var obj = this.withdrawAddress ? {
        withdraw: {
          type: 'new',
          sum: this.WithdrawData.amount,
          extra: this.WithdrawData.remark,
          uid: this.WithdrawData.newAddress
        },
        two_factor: validate
      } : {
        withdraw: {
          type: 'exist',
          sum: this.WithdrawData.amount,
          fund_source: this.WithdrawData.Address_id
        },
        two_factor: validate,
        _rucaptcha: this.WithdrawData.rucaptcha
      }
      this.disabled = true
      this._post({
        url: `/funds/${this.CurrencyType}/create_withdraw`,
        data: obj
      }, (d) => {
        this.disabled = false
        if (data) {
          var data = d.data.success
          if (data.hasOwnProperty('fund_source')) {
            this.FundSources[data.fund_source.currency].push(data.fund_source)
          }
          this.PopupBoxDisplay({message: this.$t('api_server.withdraw_currency.create_withdraw_200'), type: 'success', url: '/form/withdraw_cancel'})
          this.WithdrawData.otp = ''
          this.WithdrawData.amount = ''
          this.WithdrawData.remark = ''
          this.WithdrawData.newAddress = ''
          this.Rucaptcha = false
        } else {
          var err = d.data.error
          if (err.hasOwnProperty('fund_source')) {
            this.FundSources[err.fund_source.currency].push(err.fund_source)
          }
          if (err.code === 1002) {
            this.Rucaptcha = err.rucaptcha
            this.WithdrawData.otp = ''
            this.PopupBoxDisplay({message: `${this.$t(`withdraw_currency.${this.$refs['select'].value.match(/\w+/g)[0].toLowerCase()}`)}${this.$t('api_server.withdraw_currency.create_withdraw_1002')}`, type: 'error'})
            return
          }
          if (err.code === 1009) {
            this.WithdrawData.rucaptcha = ''
          }
          if (err.code === 1003) {
            this.PopupBoxDisplay({message: `${this.$t('api_server.withdraw_currency.create_withdraw_1003')} ${d.data.c} ${this.$t('time')}`, type: 'error'})
            return
          }
          this.Rucaptcha = this.Rucaptcha ? `${this.Rucaptcha}?${Math.random()}` : this.Rucaptcha
          this.PopupBoxDisplay({message: this.$t(`api_server.withdraw_currency.create_withdraw_${err.code}`), type: 'error'})
        }
      })
    },
    cancelWithdraw (id, data) {
      this.disabled = true
      this._delete({
        url: `/funds/${id}/cancel_withdraw`
      }, (d) => {
        this.disabled = false
        if (d.data.success) {
          this.PopupBoxDisplay({message: this.$t('api_server.withdraw_currency.Withdraw_canceled_200'), type: 'success'})
          var type = data.type
          type.aasm_state_title = 'canceled'
          data.context = this.$t('withdraw_currency.canceled')
          type.aasm_state = 'canceled'
        } else {
          this.PopupBoxDisplay({message: this.$t('api_server.withdraw_currency.Withdraw_canceled_1001'), type: 'error'})
        }
      })
    },
    CountDown () {
      this.second = 60
      this.resend = true
      var timer = setInterval(() => {
        this.second--
        if (this.second < 0) {
          clearInterval(timer)
        }
      }, 1000)
    },
    qrcode (str) {
      var dateUrl = ''
      QRCode.toDataURL(str, {widht: 120, height: 120}, (err, string) => {
        if (err) console.log(err)
        dateUrl = string
      })
      return dateUrl
    },
    ...mapMutations(['PopupBoxDisplay', 'ChangePopupBox'])
  },
  computed: {
    LockAssets () {
      return this.$store.getters.LockAssets()
    },
    FromMoblie () {
      var user = navigator.userAgent
      return user.toLowerCase().indexOf('android') !== -1 || user.toLowerCase().indexOf('iphone') !== -1
    },
    TotalAssets () {
      return this.$store.getters.TotalAssets()
    },
    timer () {
      return this.resend ? (this.second < 0
        ? this.$t('withdraw_currency.resend')
        : `${this.$t('withdraw_currency.resend')} ${this.second}s`) : this.$t('withdraw_currency.send_identify_code')
    },
    ReplaceCurrency () {
      return this.$t('deposit_currency.warn1').replace(/COIN/g, this.CurrencyType.toUpperCase())
    },
    operationDone () {
      return this.$t('deposit_currency.operation_done').replace(/1/, this.ConfirmNum)
    },
    ConfirmNum () {
      return this.$t('deposit_currency.confirm_num').replace(/NUM/g, this.confirm_num)
    },
    getWithdrawRecord () {
      return [{content: [
        this.$t('withdraw_currency.number'),
        this.$t('withdraw_currency.withdraw_time'),
        this.$t('withdraw_currency.withdraw_address'),
        this.$t('withdraw_currency.actual_account'),
        this.$t('withdraw_currency.absenteeism_expenses'),
        this.$t('withdraw_currency.statu_and_operation')
      ]
      }].concat(this.WithdrawRecord.item)
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
    },
    ...mapGetters(['loginData']),
  },
  mounted () {
    if (this.loginData.app_activated) {
      this.validate = 'google'
    } else if (this.loginData.sms_activated) {
      this.validate = 'sms'
    }
    /* eslint-disable no-new */
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

    if (/withdraw/.test(this.$route.path)) {
      this.step = 3
    } else if (/deposit/.test(this.$route.path)) {
      this.step = 2
      if (this.GeneratAddress !== '') {
        this.GeneratAddress && this.Generating()
      }
    } else if (/pie/.test(this.$route.path)) {
      this.step = 0
    } else {
      this.route = 'line'
      this.step = 1
    }
  },
  watch: {
    $route (to) {
      if (to.name !== 'WithdrawCurrency') return
      if (/withdraw/.test(to.path)) {
        this.route = 'withdraw'
        this.step = 3
        // this.$store.commit('redirect', to)
      } else if (/deposit/.test(to.path)) {
        this.step = 2
        this.route = 'deposit'
        // this.$store.commit('redirect', to)
        if (this.GeneratAddress !== '') {
          this.GeneratAddress && !this.deposit_address && this.Generating()
        }
      }  else if (/pie/.test(to.path)) {
        this.route = 'pie'
        this.step = 0
      } else {
        this.route = 'line'
        this.step = 1
      }
    },
    DepositAddress (to, from) {
      console.log(to, from)
      if (this.$route.name === 'WithdrawCurrency' && !/deposit/.test(this.$route.path)) return
      if (Object.keys(to).length > Object.keys(from).length) {
        if(Object.keys(to)[0] !== this.CurrencyType) {
          this.$set(this, 'DepositAddress', '')
          return
        }
        this.deposit_address = to[Object.keys(to)]
        this.deposit_address_display = true
        this.$set(this, 'DepositAddress', '')
        clearTimeout(this.Time)
        if (this.Time === false) return

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
      }
    },
    step () {
      if (this.step === 2) {
        this.$router.push(`${this.ROUTER_VERSION}/funds/deposit`)
      } else if (this.step === 3) {
        this.$router.push(`${this.ROUTER_VERSION}/funds/withdraw`)
      } else if (this.step === 0) {
        this.$router.push(`${this.ROUTER_VERSION}/funds/pie`)
      } else {
        this.$router.push(`${this.ROUTER_VERSION}/funds/line`)
      }
    },
    'WithdrawData.amount' () {
      this.invalid = false
    }
  },
  components: {
    DashBoard,
    Desposit,
    Withdraw
  }
}
</script>

<style scoped lang='scss'>
  @import './WithdrawCurrency.scss';
</style>

<style lang='css'>
  @media (max-width: 991px) {
    .deposit-address .newsPrompt .news-animation{
      width: 100%;
      left: 0;
    }
  }
</style>
