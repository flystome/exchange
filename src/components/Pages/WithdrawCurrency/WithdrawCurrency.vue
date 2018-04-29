<template>
  <div class="btc-member-center" @click="ChoiceStatus(false)" @keyup.enter="Withdraw">
    <div class="btc-container-block">
      <div class="btc-currency-withdraw">
          <div class="btc-fl">
            <span>
              <i class="withdraw-asset"></i>
              {{$t('withdraw_currency.total_assets')}} <span>{{ TotalAssets | toLocaleString }}</span> BTC
            </span>
            <i class="withdraw-freeze btc-marginL45 btc-marginR5"></i>
            <a class='btc-color999'>
              {{$t('withdraw_currency.frozen_assets')}} {{ LockAssets }} BTC
            </a>
          </div>
        <div class="btc-fr">
          <!-- <router-link :to="`${ROUTER_VERSION}/currency/deposit`" class="btc-poniter" :class="{'btc-link':route === 'deposit'}">
            <strong>
              {{ $t('withdraw_currency.deposit') }}
            </strong>
          </router-link>
          <span>|</span>
          <router-link :to="`${ROUTER_VERSION}/currency/withdraw`" class="btc-poniter" :class="{'btc-link':route === 'withdraw'}">
            <strong>
              {{ $t('withdraw_currency.withdraw') }}
          </strong>
          </router-link> -->
          <menu-underline
          ref="menu"
          :route="'WithdrawCurrency'"
          v-model='step'
          :menu-index='step'
          :underline-margin="'5px'"
          :menu-margin="'24px'"
          :menu-list="[$t('withdraw_currency.deposit'), $t('withdraw_currency.withdraw')]">
          </menu-underline>
        </div>
      </div>
    </div>
    <div class="btc-container-block">
      <div class="btc-withdraw-coin">
        <a v-for="(coin,index) in this.currencies"
        :disabled='disabled'
        :class="{'is-chioce':index === length, 'is-enabled': !coin.node_enabled, 'btc-indent': !(requireImg(`market/market-${coin.code}`))}"
        @click='ChoiceCoin(index, coin.node_enabled)'
        class="btc-b btn"
        :key="coin.code">
          <img v-if="requireImg(`market/market-${coin.code}`)" :src="requireImg(`market/market-${coin.code}`)">
          <span>
            {{ coin.code | toUpperCase }}
          </span>
        </a>
      </div>
      <div class="btc-b btc-withdraw-formContainer" v-if="route === 'withdraw'">
        <div class="btc-withdraw-form">
          <!-- <basic-option :data='[{
            name: "withdraw_currency_address",
            value: this.$t("withdraw_currency.withdraw_currency_address")
          }]' v-model="this.withdrawAddress"></basic-option> -->
          <div @click.stop="ChoiceStatus(!choice)" class="btc-withdraw-address btc-b-l" :style="{background:`url('${requireImg('large/select')}') 100% 100%`}">
            {{ Address !== 'withdraw_currency.withdraw_currency_address' ? Address : $t('withdraw_currency.withdraw_currency_address') }}
          </div>
          <div v-show="choice" @click.stop="ChoiceStatus(true)" class='btc-b btc-address-contain'>
            <div class="btc-address-height">
              <div class="btc-pointer" v-for="(data, index) in FundSources[CurrencyType]" :key="index" @click.stop="ChoiceAddress(index, data.id)">
                  <div class="btc-fl">
                    <div class="btc-color999">
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
                <div class="btc-fr"><span
                @click.stop="DefaultFunds(data.id, index)">{{$t('withdraw_currency.set_as_default')}}</span>丨<span
                @click.stop="DeleteFunds(data.id, FundSources[CurrencyType], index)">{{$t('withdraw_currency.delete')}}</span></div>
                </div>
            </div>
            <div class="btc-addnew btc-pointer text-center" @click.stop="AddAddress">
                <i class="withdraw-add"></i>
                {{$t('withdraw_currency.use_a_new_address')}}
            </div>
          </div>
          <div v-show='!choice'>
            <div class="btc-marginT15 btc-withdraw-add" style="display: flex" v-if="withdrawAddress">
              <basic-input class="btc-withdraw-all" v-model="WithdrawData.remark" :placeholder='$t("withdraw_currency.remark_label")'>
              </basic-input>
              <basic-input class="btc-withdraw-all" v-model="WithdrawData.newAddress" :placeholder='$t("withdraw_currency.withdraw_currency_address")'>
              </basic-input>
            </div>
            <div class="btc-withdraw-explain">
              <span>{{ $t('withdraw_currency.available_balance') }}</span> {{ Balance | toFixed }} {{ CurrencyType | toUpperCase }} <span class="btc-marginL15">{{ $t('withdraw_currency.remaining_withdraw') }}</span> {{ Remain | toFixed }} {{ CurrencyType | toUpperCase }}<span v-if="equivalence" style="color:black">≈{{ equivalence | toFixed }} BTC</span>
            </div>
            <template v-if="Address !== 'withdraw_currency.withdraw_currency_address' || withdrawAddress">
              <basic-input ref='WithdrawAll' v-model="WithdrawData.amount" class="btc-withdraw-all" style="display: flex;" :placeholder="this.$t('withdraw_currency.Amount_to_withdraw')">
                  <basic-button :disabled='disabled' @click.native="WithdrawAll" class="btc-link btn" slot="button" :text="$t('withdraw_currency.withdraw_all')"></basic-button>
                </basic-input>
              <div class="btc-withdraw-explain">
                <span>{{ $t('withdraw_currency.minimum_withdraw_amount_of_money') }} 0.001</span>
                <span class="btc-fr">{{ $t('withdraw_currency.poundage') }} {{ withdraw_fee }}</span>

              <!-- <span class="btc-fr btc-link">
                <img src="~Img/tariff-description.png">{{$t('withdraw_currency.tariff_description')}}
              </span> -->
                </div>
              <div class="btc-choice-validate">
                <select class="btc-select-option" ref='select'
                v-model="validate"
                :disabled="disabled">
                  <option v-if="loginData.app_activated" value="google">{{ this.$t('withdraw_currency.google_validate') }}</option>
                  <option v-if="loginData.sms_activated" value="sms">{{ this.$t('withdraw_currency.sms') }}</option>
                </select>
                <basic-input v-model="WithdrawData.otp"  :key="validate" class="btc-marginB10">
                </basic-input>
                <button :disabled='disabled' @click="SendSms" v-if="validate === 'sms'" class="btc-white-btn btn">{{ timer }}</button>
              </div>
              <div v-if="Rucaptcha">
                <basic-input :placeholder="$t('deposit_currency.identifying_code')" v-model="WithdrawData.rucaptcha"  class="btc-marginT10">
                </basic-input>
                <img @click="ChangeRucaptcha" class="btc-pointer btc-marginB10" :key="'rucaptcha'" :src="`${HOST_URL}${Rucaptcha}`">
              </div>
            <basic-button class="btn" :disabled='disabled' :class="{'btc-marginT30': !Rucaptcha}" @click.native="Withdraw" style="width:100%" :text="$t('withdraw_currency.withdraw')">
            </basic-button>
            </template>

          </div>
        </div>
        <div class="btc-withdraw-currency">
          <ul>
            <strong class="btc-withdraw-remind">{{ $t('withdraw_currency.reminder') }}</strong>
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
      <div v-else class="btc-deposit-currency btc-paddingT40 btc-b">
        <template v-if="deposit_address !== ''">
          <div class="text-right btc-deposit-qrcode col-md-5 btc-marginT5">
            <qr-code v-if="deposit_address_display" :length='"230"' :dateUrl="qrcode(deposit_address)"></qr-code>
            <vue-simple-spinner class="btc-withdraw-loading" v-else size="185"></vue-simple-spinner>
          </div>
          <div class="btc-deposit-address col-md-5">
            <div class="btc-address-div">
              <div id="copy" class="btc-b btc-color666">
                {{ deposit_address === false ? '' : deposit_address  }}
              </div>
              <div class="btc-address-warn btc-marginT10">
                {{ ReplaceCurrency }}
                <!-- {{ $t('deposit_currency.warn1') }}{{CurrencyType | toUpperCase}}{{ $t('deposit_currency.warn2') }}{{CurrencyType | toUpperCase}}{{ $t('deposit_currency.warn3') }}{{CurrencyType | toUpperCase}}{{ $t('deposit_currency.warn4') }}{{CurrencyType | toUpperCase}}{{ $t('deposit_currency.warn5') }} -->
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
        <div class="col-md-8 btc-deposit-confirNum">
          {{$t('deposit_currency.confirm_num_descirbe')}}<span style="color: #ff7f18;">{{ ConfirmNum }}</span>{{$t('deposit_currency.about_time')}}<router-link class='btc-link' :to="`${ROUTER_VERSION}/form/account`">{{$t('deposit_currency.form_account')}}</router-link>{{ $t('deposit_currency.in_query') }}
        </div>
        <ul class="btc-marginT80">
            <strong class="btc-withdraw-remind">{{ $t('withdraw_currency.reminder') }}</strong>
            <li>
              {{ $t('deposit_currency.use_wallet_service') }}
            </li>
            <li>
              {{ $t('deposit_currency.font_descripe') }}
            </li>
            <li>
              {{ $t('deposit_currency.operation_done') }}
            </li>
          </ul>
      </div>
    </div>
    <basic-table :loading='withdraw_loading' :captionTitle='WithdrawRecord.captionTitle' :item='getWithdrawRecord' :perfix='CurrencyType.toUpperCase()' v-if="route === 'withdraw'">
      <template slot="cancel"
      slot-scope="props">
        <a>
          / <span :disabled='disabled' @click="cancelWithdraw(props.id, props.data)" class="btc-link btn">{{$t(`withdraw_currency.cancel`)}}</span>
        </a>
      </template>
      <div slot="more" class="text-center btc-b-t btc-table-more">
        <router-link class="btc-link" :to="`${ROUTER_VERSION}/form/account`">
          {{$t('my_account.show_more')}}
        </router-link>
      </div>
    </basic-table>
    <basic-table :loading='deposit_loading' :captionTitle='depositRecord.captionTitle' :perfix='CurrencyType.toUpperCase()' :item='getDepositRecord' v-else>
      <template slot="href"
      slot-scope="props">
        <span class="btc-pointer btc-link" @click="OpenWindow(props.data.url)">
          {{ props.data.context }}
        </span>
      </template>
      <div slot="more" class="text-center btc-b-t btc-table-more">
        <router-link class="btc-link" :to="`${ROUTER_VERSION}/form/account`">
          {{$t('my_account.show_more')}}
        </router-link>
      </div>
    </basic-table>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import Clipboard from 'clipboard'
const _debounce = require('lodash.debounce')
import pusher from '@/common/js/pusher'
var QRCode = require('qrcode')
const timeLine = 20000
export default {
  name: 'withdrawCurrency',
  created () {
    this.disabled = true
    this._get({
      url: '/funds/home.json'
    }, (d) => {
      this.disabled = false
      var d = d.data.success
      var channel = pusher.subscribe(`private-${d.sn}`)
      var MarketChannel = pusher.subscribe(`market-global`)
      channel.bind('deposit_address', (data) => {
        if (data.attributes.account_id === this.account_id) {
          this.deposit_address = data.attributes.deposit_address
          this.deposit_address_display = true
        }
        if (typeof this.DepositAddress !== 'object') {
          this.DepositAddress = {
            [data.attributes.account_id]: data.attributes.deposit_address
          }
        } else {
          if (!Object.keys(this.DepositAddress).includes((data.attributes.account_id).toString())) {
            this.DepositAddress[data.attributes.account_id] = data.attributes.deposit_address
          }
        }
      })

      channel.bind('withdraws', (data) => {
        if (data.type === 'create') {
          var d = data.attributes
          var time = new Date(d.created_at).getTime()
          this.WithdrawRecord.item.unshift({
            content: [
              d.id,
              this.$moment(d.created_at).format('L H:mm:ss'),
              d.fund_uid,
              d.amount,
              d.fee,
              { type: {
                "id": d.id,
                "created_at": time,
                "amount": d.amount,
                "fee": d.fee,
                "aasm_state": d.aasm_state,
                "fund_uid": d.fund_uid
              }, context: this.$t(`withdraw_currency.${d.aasm_state}`), id: d.id }
            ]
          })
        }
      }) //withdraws pusher

      channel.bind('account', _debounce((data) => {
        this.$store.state.assets[data.currency].balance = Number(data.balance)
        this.$store.state.assets[data.currency].locked = Number(data.locked)
        // this.equivalence = this.CurrencyType === data.currency ? this.equivalence : data.today_withdraw_remain_btc
        if (this.CurrencyType === 'btc') {
          if (data.currency === 'btc') this.Remain = data.today_withdraw_remain_btc
        } else {
          if (data.currency !== 'btc') {
            this.Remain = data.today_withdraw_remain
            this.equivalence = data.today_withdraw_remain_btc
          }
        }
        this.Balance = data.balance
      }, 500)) //account pusher

      MarketChannel.bind('tickers', _debounce((data) => {
        Object.keys(data).forEach((key) => {
          this.$store.state.assets[data[key].base_currency].price = data[key].last
        })
      }, 5000)) //market pusher

      channel.bind('deposits', (data) => {
        var d = data.attributes
        if (this.depositId.includes(d.id)) {
          this.$set(this.depositRecord.item, 0, 0)
          this.depositRecord.item[this.depositId.indexOf(d.id)] = {
            content: [
              this.$moment(d.created_at).format('L H:mm:ss'),
              {hover: true, context: d.txid, url: d.blockchain_url},
              d.amount,
              d.confirmations,
              this.$t(`withdraw_currency.${d.aasm_state}`)
            ]
          }
        } else {
        this.depositId.unshift(d.id)
        this.depositRecord.item.unshift({
            content: [
              this.$moment(d.created_at).format('L H:mm:ss'),
              {hover: true, context: d.txid, url: d.blockchain_url},
              d.amount,
              d.confirmations,
              this.$t(`withdraw_currency.${d.aasm_state}`)
            ]
          })
        }
      }) //deposits pusher

      this.TotalAssetsa = Number(d.total_assets.btc_worth).toFixed(8)
      if (d.notice) {
        this.PopupBoxDisplay({message: this.$t('withdraw_currency.withdraw_confirm_completed'), type: d.notice.type})
      }
      d.rucaptcha && (this.Rucaptcha = d.rucaptcha)
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
      this.FundSources = d.fund_sources
      this.GetCoin(false, d.fund_sources, d.sn)
    })
    this.route = this.$route.path.slice(this.$route.path.lastIndexOf('/') + 1)
  },
  data () {
    return {
      HOST_URL: process.env.HOST_URL,
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      redirectLock: false,
      TotalAssetsa: 0,
      step: 0,
      warn: {
        length: 0,
        message: '',
        type: 'success',
        point: '.'
      },
      prompt:'',
      account_id: '',
      usdt_worth: '',
      length: 0,
      DepositAddress: '',
      disabled: !false,
      currencies: [],
      route: '',
      deposit_address_display: false,
      deposit_address: this.$t('deposit_currency.deposit_address'),
      choice: false,
      depositId: [],
      second: -1,
      equivalence: '',
      resend: false,
      withdrawAddress: false,
      CurrencyType: 'btc',
      Balance: '',
      Remain: '',
      withdraw_fee: '',
      Address: 'withdraw_currency.withdraw_currency_address',
      Rucaptcha: false,
      Time: '',
      GeneratAddress: '',
      WithdrAwable: false,
      loading: false,
      newaa: [],
      deposit_loading: true,
      withdraw_loading: true,
      confirm_num: '',
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
      },
      depositRecord: {
        captionTitle: 'deposit_currency.deposit_record',
        item: []
      },
      validate: '',
      FundSources: ''
    }
  },
  filters: {
    toUpperCase (str) {
      return str.toUpperCase()
    },
    toFixed (str) {
      var reg = /.*\..*/
      return Number(str).toFixed(Math.min((!reg.test(str) ? 0 : String(str).split('.')[1].length), 8))
    },
    toLocaleString (n) {
      if (!n) return
  　　var re=/\d{1,3}(?=(\d{3})+$)/g;
  　　var n1=String(n).replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
  　　return n1;
    }
  },
  methods: {
    OpenWindow (url) {
      window.open(url)
    },
    ChangeRucaptcha () {
      this.Rucaptcha += `?${Math.random()}`
    },
    WithdrawAll () {
      this.WithdrawData.amount = Math.min(Number(this.Remain), Number(this.Balance)).toFixed(8)
    },
    AddAddress () {
      this.withdrawAddress = true
      this.ChoiceStatus(false)
      this.Address = 'withdraw_currency.withdraw_currency_address'
      this.WithdrawData.Address_id = ''
    },
    requireImg (img) {
      try {
        return require(`../../../../static/img/${img}.png`)
      } catch (error) {
        return false
      }
    },
    ChoiceCoin (index, type) {
      if (!type) return
      if (this.disabled) return
      this.length = index
      this.GetCoin(this.currencies[index].code)
      this.CurrencyType = this.currencies[index].code
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
        type: 'loading',
        message: this.$t('hint.generating_address')
      })
      this.Time = setTimeout(() => {
         this.ChangePopupBox({
          message: this.$t('hint.go_tickets'),
          type: 'error',
          confirm: true,
          buttonText: this.$t('hint.no'),
          buttondisplay: true
        })
        this.Time = false
      }, timeLine)
    },
    GetCoin (c, funds, sn) {
      this.withdrawAddress = false
      var obj = this.WithdrawRecord
      var objd = this.depositRecord
      this.deposit_loading = true
      this.withdraw_loading = true
      obj.item = []
      objd.item = []
      this.disabled = true
      this.deposit_address = false
      this.deposit_address_display = false
      this.loading = true
        this._get({
          url: `/funds/${c || 'btc'}/account_info.json`
        }, (d) => {
        this.GeneratAddress = false
        this.disabled = false
        var d = d.data.success
        this.loading = false
        if (d.code === 201) {
          this.GeneratAddress = true
          if (/deposit/.test(this.$route.path)) {
            this.Generating()
          }
        }
        this.account_id = d.account.account_id
        this.confirm_num = d.deposit_max_confirmation
        this.withdraw_fee = d.withdraw_fee
        this.equivalence = (c || 'btc') === 'btc' ? '' : d.today_withdraw_remain_btc
        this.WithdrAwable = d.withdrawable
        this.Remain = d.today_withdraw_remain
        var withdraws = d.withdraws
        var deposits = d.deposits
        if (d.address) {
          this.deposit_address_display = true
          this.deposit_address = d.address
        } else {
          this.deposit_address_display = false
          this.deposit_address = ''
        }
        d.account && (this.Balance = d.account.balance)
        obj.item = []
        objd.item = []
        withdraws.length === 0 ? obj.item = [] : obj.item = obj.item.concat(withdraws.map(d => {
          var id = d.id
          return {
            content: [
              id,
              this.$moment(d.created_at).format('L H:mm:ss'),
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
              this.$moment(d.created_at).format('L H:mm:ss'),
              {hover: 'true', context: d.txid, url: d.blockchain_url},
              d.amount,
              d.confirmations === null ? '0' : d.confirmations,
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
    Withdraw () {
      if (!this.WithdrAwable) {
        this.PopupBoxDisplay({message: this.$t('withdraw_currency.temporarily_can_not_withdraw'), type: 'error'})
        return
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
        if (d.data.success) {
          if (d.data.success.hasOwnProperty('fund_source')) {
            this.FundSources[d.data.success.fund_source.currency].push(d.data.success.fund_source)
          }
          this.PopupBoxDisplay({message: this.$t('api_server.withdraw_currency.create_withdraw_200'), type: 'success', url: '/form/account'})
          this.WithdrawData.otp = ''
          this.WithdrawData.amount = ''
          this.WithdrawData.remark = ''
          this.WithdrawData.newAddress = ''
          this.Rucaptcha = false
        } else {
          if (d.data.error.hasOwnProperty('fund_source')) {
            this.FundSources[d.data.error.fund_source.currency].push(d.data.error.fund_source)
          }
          if (d.data.error.code === 1002) {
            this.Rucaptcha = d.data.error.rucaptcha
            this.WithdrawData.otp = ''
            this.PopupBoxDisplay({message: `${this.$t(`withdraw_currency.${this.$refs['select'].value.match(/\w+/g)[0].toLowerCase()}`)}${this.$t('api_server.withdraw_currency.create_withdraw_1002')}`, type: 'error'})
            return
          }
          this.WithdrawData.otp = ''
          this.WithdrawData.amount = ''
          this.WithdrawData.remark = ''
          this.WithdrawData.newAddress = ''
          if (d.data.error.code === 1009) {
            this.WithdrawData.rucaptcha = ''
          }
          if (d.data.error.code === 1003) {
            this.PopupBoxDisplay({message: `${this.$t('api_server.withdraw_currency.create_withdraw_1003')} ${d.data.c} ${this.$t('time')}`, type: 'error'})
            return
          }
          this.Rucaptcha = this.Rucaptcha ? `${this.Rucaptcha}?${Math.random()}` : this.Rucaptcha
          this.PopupBoxDisplay({message: this.$t(`api_server.withdraw_currency.create_withdraw_${d.data.error.code}`), type: 'error'})
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
      this.step = 1
    } else if (/deposit/.test(this.$route.path)) {
      this.step = 0
      if (this.GeneratAddress !== '') {
        this.GeneratAddress && this.Generating()
      }
    }
  },
  watch: {
    $route (to) {
      if (/withdraw/.test(to.path)) {
        this.route = 'withdraw'
        this.step = 1
        // this.$store.commit('redirect', to)
      } else if (/deposit/.test(to.path)) {
        this.step = 0
        this.route = 'deposit'
        // this.$store.commit('redirect', to)
        if (this.GeneratAddress !== '') {
          this.GeneratAddress && !this.deposit_address && this.Generating()
        }
      }
    },
    DepositAddress (to, from) {
      if (!/deposit/.test(this.$route.path)) return
      if (Object.keys(to).length > Object.keys(from).length) {
        this.deposit_address = to[Object.keys(to)]
        this.deposit_address_display = true
        delete this.DepositAddress[Object.keys(to)]
        clearTimeout(this.Time)
        if (this.Time === false) return
        this.ChangePopupBox({
          type: 'success',
          message: this.$t('hint.completion')
        })
        setTimeout(() => {
          this.PopupBoxDisplay()
          this.ChangePopupBox({
            buttondisplay: true
          })
        }, 2000)
      }
    },
    step () {
      if (this.step === 0) {
        this.$router.push(`${this.ROUTER_VERSION}/currency/deposit`)
      } else {
        this.$router.push(`${this.ROUTER_VERSION}/currency/withdraw`)
      }
    }
  }
}
</script>

<style scoped lang='scss'>
@import './WithdrawCurrency.scss'
</style>
