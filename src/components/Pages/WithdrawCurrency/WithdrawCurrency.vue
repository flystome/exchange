<template>
  <div class="btc-member-center" @click="ChoiceStatus(false)">
    <div class="btc-container-block">
      <div class="btc-currency-withdraw">
          <div class="btc-fl">
            <span>
              <img src="~Img/asset-total.png">
              {{$t('withdraw_currency.total_assets')}} <span>{{ TotalAssets }}</span> BTC
            </span>
            <img class="btc-marginL45 btc-marginR5" src="~Img/asset-freeze.png">
            <a class='btc-color999'>
              {{$t('withdraw_currency.frozen_assets')}} {{ Locked }} BTC
            </a>
          </div>
          <div class="btc-fr">
          <router-link :to="`${ROUTER_VERSION}/currency/deposit`" class="btc-poniter" :class="{'btc-link':route === 'deposit'}">
            <strong>
              {{ $t('withdraw_currency.deposit') }}
            </strong>
          </router-link>
          <span>|</span>
          <router-link :to="`${ROUTER_VERSION}/currency/withdraw`" class="btc-poniter" :class="{'btc-link':route === 'withdraw'}">
            <strong>
              {{ $t('withdraw_currency.withdraw') }}
          </strong>
          </router-link>
        </div>
      </div>
    </div>
    <div class="btc-container-block">
      <div class="btc-withdraw-coin">
        <a v-for="(coin,index) in this.currencies"
        :disabled='disabled'
        :class="{'is-chioce':index === length, 'is-enabled': !coin.node_enabled}"
        @click='ChoiceCoin(index, coin.node_enabled)'
        class="btc-b btn"
        :key="coin.code">
          <img :src="requireImg(`market-${coin.code}`)">
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
          <div @click.stop="ChoiceStatus(!choice)" class="btc-withdraw-address btc-b-l" :style="{background:`url('${requireImg('select')}') 100% 100%`}">
            {{ Address }}
          </div>
          <div v-show="choice" @click.stop="ChoiceStatus(true)" class='btc-b btc-address-contain'>
            <div class="btc-address-height">
              <div class="btc-pointer" v-for="(data, index) in FundSources[CurrencyType]" :key="index" @click.stop="ChoiceAddress(index, data.id)">
                  <div class="btc-fl">
                    <div class="btc-color999">
                      <strong>
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
                @click.stop="DefaultFunds(data.id)">{{$t('withdraw_currency.set_as_default')}}</span>丨<span
                @click.stop="DeleteFunds(data.id, FundSources[CurrencyType], index)">{{$t('withdraw_currency.delete')}}</span></div>
                </div>
            </div>
            <div class="btc-addnew btc-pointer text-center" @click.stop="AddAddress">
                <img src="~Img/withdraw-add.png">
                {{$t('withdraw_currency.use_a_new_address')}}
            </div>
          </div>
          <div v-show='!choice'>
            <div class="btc-marginT15 btc-withdraw-add" style="display: flex" v-if="withdrawAddress">
              <basic-input class="btc-withdraw-all" v-model="WithdrawData.remark" :hidden='"withdraw remark"' :placeholder='$t("withdraw_currency.remark_label")'>
              </basic-input>
              <basic-input class="btc-withdraw-all" v-model="WithdrawData.newAddress" :hidden='"withdraw address"' :placeholder='$t("withdraw_currency.withdraw_currency_address")'>
              </basic-input>
            </div>
            <div class="btc-withdraw-explain">
              <span>{{ $t('withdraw_currency.available_balance') }}</span> {{ Balance | toFixed }} {{ CurrencyType | toUpperCase }} <span class="btc-marginL15">{{ $t('withdraw_currency.remaining_withdraw') }}</span> {{ Remain | toFixed }} {{ CurrencyType | toUpperCase }}<span v-if="equivalence" style="color:black">≈{{ equivalence | toFixed }} BTC</span>
            </div>
              <basic-input ref='WithdrawAll' v-model="WithdrawData.amount" class="btc-withdraw-all" style="display: flex;" :hidden='"withdraw amount"' :placeholder="this.$t('withdraw_currency.Amount_to_withdraw')">
                <basic-button :disabled='disabled' @click.native="WithdrawAll" class="btc-link btn" slot="button" :text="$t('withdraw_currency.withdraw_all')"></basic-button>
              </basic-input>
            <div class="btc-withdraw-explain"><span>{{ $t('withdraw_currency.minimum_withdraw_amount_of_money') }}</span> 0.001
            <!-- <span class="btc-fr btc-link">
              <img src="~Img/tariff-description.png">{{$t('withdraw_currency.tariff_description')}}
            </span> -->
              </div>
            <div class="btc-choice-validate">
              <basic-select ref='select' :disabled="disabled" key="'choice_verfiy'" :data="[this.$t('withdraw_currency.google_validate'),this.$t('withdraw_currency.sms')]"
              :value="validate"
              :lang="['google', 'sms']"
              v-on:selected="validate = arguments[0]">
              </basic-select>
              <basic-input v-model="WithdrawData.otp"  :key="validate" :hidden='"verify code"' class="btc-marginB10">
              </basic-input>
              <button :disabled='disabled' @click="SendSms" v-if="validate === 'sms'" class="btc-white-btn btn">{{ timer }}</button>
            </div>
            <div v-if="Rucaptcha">
              <basic-input :placeholder="$t('deposit_currency.identifying_code')" :hidden='"withdraw amount"' v-model="WithdrawData.rucaptcha"  class="btc-marginT10">
              </basic-input>
              <img @click="ChangeRucaptcha" class="btc-pointer btc-marginB10" :key="'rucaptcha'" :src="`${HOST_URL}${Rucaptcha}`">
            </div>
            <basic-button class="btn" :disabled='disabled' :class="{'btc-marginT30': !Rucaptcha}" @click.native="Withdraw" style="width:100%" :text="$t('withdraw_currency.withdraw')">
            </basic-button>
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
              {{ $t('withdraw_currency.withdraw') }}
            </li>
          </ul>
        </div>
      </div>
      <div v-else class="btc-deposit-currency btc-paddingT40 btc-b">
        <template v-if='deposit_address'>
          <div v-if="deposit_address_display" class="text-right btc-deposit-qrcode col-md-5 btc-marginT5">
            <qr-code :length='"230"' :dateUrl="qrcode(deposit_address)"></qr-code>
          </div>
          <div class="btc-deposit-address col-md-5">
            <div>
              <div id="copy">
                {{ deposit_address }}
              </div>
            </div>
            <basic-button :disabled='disabled' data-clipboard-target="#copy" class="btc-marginT30 btn-copy btn" :text='$t("deposit_currency.copy_address")'></basic-button>
          </div>
        </template>
        <div v-else class='text-center'>
          {{ $t("deposit_currency.temporarily_unable_deposit") }}
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
    <basic-table :captionTitle='WithdrawRecord.captionTitle' :item='getWithdrawRecord' v-if="route === 'withdraw'">
      <template slot="cancel"
      slot-scope="props">
        <a>
          / <span :disabled='disabled' @click="cancelWithdraw(props.id, props.data)" class="btc-link btn">{{$t(`withdraw_currency.canceled`)}}</span>
        </a>
      </template>
      <div slot="more" class="text-center btc-b-t btc-table-more">
        <a class="btc-link ">{{$t('my_account.show_more')}}</a>
      </div>
    </basic-table>
    <basic-table :captionTitle='depositRecord.captionTitle' :item='getDepositRecord' v-else>
      <template slot="href"
      slot-scope="props">
        <span class="btc-pointer btc-link" @click="OpenWindow(props.data.url)">
          {{ props.data.context }}
        </span>
      </template>
      <div slot="more" class="text-center btc-b-t btc-table-more">
        <a class="btc-link ">{{$t('my_account.show_more')}}</a>
      </div>
    </basic-table>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import Clipboard from 'clipboard'
import pusher from '@/common/js/pusher'
// var channel = pusher.subscribe(`private-${d.data.sn}`)
//   channel.bind('deposit_address', (data) => {
//   console.log(data)
// })
var QRCode = require('qrcode')
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
      channel.bind('deposit_address', (data) => {
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
              }, context: d.aasm_state, id: d.id }
            ]
          })
        }
      })
      channel.bind('account', (data) => {
        this.Locked = Number(data.total_assets.locked_btc_worth).toFixed(3)
        this.TotalAssets = Number(data.total_assets.btc_worth).toFixed(3)
        this.Remain = data.today_withdraw_remain
        this.equivalence = data.today_withdraw_remain_btc === data.today_withdraw_remain ? '' : data.today_withdraw_remain_btc
        this.Balance = data.balance
      })
      this.TotalAssets = Number(d.total_assets.btc_worth).toFixed(3)
      this.Locked = Number(d.total_assets.locked_btc_worth).toFixed(3)
      if (d.notice) {
        this.PopupBoxDisplay({message: d.notice.message, type: d.notice.type})
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
      TotalAssets: 0,
      warn: {
        length: 0,
        message: '',
        type: 'success',
        point: '.'
      },
      usdt_worth: '',
      length: 0,
      DepositAddress: '',
      disabled: !false,
      currencies: [],
      route: '',
      deposit_address_display: false,
      deposit_address: this.$t('deposit_currency.deposit_address'),
      choice: false,
      second: -1,
      equivalence: '',
      resend: false,
      withdrawAddress: false,
      CurrencyType: 'btc',
      Balance: '',
      Remain: '',
      Locked: '',
      Address: this.$t('withdraw_currency.withdraw_currency_address'),
      Rucaptcha: false,
      Time: '',
      WithdrAwable: false,
      newaa: [],
      WithdrawData: {
        Address_id: '',
        otp: '',
        rucaptcha: '',
        amount: '',
        remark: '',
        newAddress: ''
      },
      WithdrawRecord: {
        captionTitle: this.$t('withdraw_currency.withdraw_currency_record'),
        item: []
      },
      depositRecord: {
        captionTitle: this.$t('deposit_currency.deposit_record'),
        item: []
      },
      validate: this.$t('withdraw_currency.google_validate'),
      FundSources: ''
    }
  },
  filters: {
    toUpperCase (str) {
      return str.toUpperCase()
    },
    toFixed (str) {
      return Number(str).toFixed(3)
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
      this.WithdrawData.amount = Math.min(Number(this.Remain), Number(this.Balance)).toFixed(3)
    },
    AddAddress () {
      this.withdrawAddress = true
      this.ChoiceStatus(false)
      this.Address = this.$t('withdraw_currency.withdraw_currency_address')
      this.WithdrawData.Address_id = ''
    },
    requireImg (img) {
      return require(`../../../../static/img/${img}.png`)
    },
    ChoiceCoin (index, type) {
      if (!type) return
      this.length = index
      this.GetCoin(this.currencies[index].code)
      this.CurrencyType = this.currencies[index].code
      this.Address = this.$t('withdraw_currency.withdraw_currency_address')
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
    GetCoin (c, funds, sn) {
      this.disabled = true
      this.$nextTick(() => {
        this._get({
          url: `/funds/${c || 'btc'}/account_info.json`
        }, (d) => {
          this.disabled = false
          var d = d.data.success
          if (d.code === 201) {
            this.PopupBoxDisplay({message: '', type: 'warn'})
            this.ChangePopupBox({
              buttondisplay: false,
              type: 'warn',
              message: this.$t('hint.generating_address')
            })
            this.Time = setTimeout(() => {
              this.ChangePopupBox({
                message: this.$t('hint.server_exception'),
                type: 'error'
              })
              setTimeout(() => {
                this.PopupBoxDisplay()
                this.ChangePopupBox({
                  buttondisplay: true
                })
              }, 1000)
            }, 10000)
          }
          this.equivalence = d.today_withdraw_remain_btc === d.today_withdraw_remain ? '' : d.today_withdraw_remain_btc
          this.WithdrAwable = d.withdrawable
          this.Remain = d.today_withdraw_remain
          var obj = this.WithdrawRecord
          var objd = this.depositRecord
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
                { type: d, context: d.aasm_state, id: id }
              ]
            }
          }))

          deposits.length === 0 ? objd.item = [] : objd.item = objd.item.concat(deposits.map(d => {
            return {
              content: [
                this.$moment(d.created_at).format('L H:mm:ss'),
                {hover: true, context: d.txid, url: d.blockchain_url},
                d.amount,
                d.confirmations,
                this.$t(`withdraw_currency.${d.aasm_state}`)
              ]
            }
          }))
          obj.captionTitle = `${(c || 'btc').toUpperCase()} ${this.$t('withdraw_currency.withdraw_currency_record')}`
          objd.captionTitle = `${(c || 'btc').toUpperCase()} ${this.$t('deposit_currency.deposit_record')}`

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
            this.Address = this.$t('withdraw_currency.withdraw_currency_address')
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
    DefaultFunds (id) {
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
          this.PopupBoxDisplay({message: this.$t('api_server.withdraw_currency.create_withdraw_200'), type: 'success'})
          this.Rucaptcha = false
          this.WithdrawData.amount = ''
          this.WithdrawData.otp = ''
          this.WithdrawData.remark = ''
          this.WithdrawData.newAddress = ''
        } else {
          if (d.data.error.code === 1002) {
            this.Rucaptcha = d.data.error.rucaptcha
            this.PopupBoxDisplay({message: `${this.$t(`withdraw_currency.${this.$refs['select'].$el.value.match(/\w+/g)[0].toLowerCase()}`)}${this.$t('api_server.withdraw_currency.create_withdraw_1002')}`, type: 'error'})
            return
          }
          if (d.data.error.code === 1009) {
            this.WithdrawData.rucaptcha = ''
          }
          if (d.data.error.code === 1003) {
            this.PopupBoxDisplay({message: `${this.$t('api_server.withdraw_currency.create_withdraw_1003')} ${d.data.c}`, type: 'error'})
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
          data.context = 'canceled'
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
    timer () {
      return this.resend ? (this.second < 0
        ? this.$t('withdraw_currency.resend')
        : `${this.$t('withdraw_currency.resend')} ${this.second}s`) : this.$t('withdraw_currency.send_identify_code')
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
    ...mapGetters(['loginData'])
  },
  mounted () {
    /* eslint-disable no-new */
    new Clipboard('.btn-copy')
  },
  watch: {
    $route (to) {
      if (/withdraw/.test(to.path)) {
        this.route = 'withdraw'
        this.$store.commit('redirect')
      } else if (/deposit/.test(to.path)) {
        this.route = 'deposit'
        this.$store.commit('redirect')
      }
      // if (/WithdrawCurrency/.test(to.name)) {
      //   this.
      // }
    },
    DepositAddress (to, from) {
      if (Object.keys(to).length > Object.keys(from).length) {
        this.deposit_address = to[Object.keys(to)]
        this.deposit_address_display = true
        delete this.DepositAddress[Object.keys(to)]
        clearTimeout(this.Time)
        this.ChangePopupBox({
          type: 'success',
          message: this.$t('hint.completion')
        })
        setTimeout(() => {
          console.log(1)
          this.PopupBoxDisplay()
          this.ChangePopupBox({
            buttondisplay: true
          })
        }, 2000)
      }
    }
  }
}
</script>

<style scoped lang='scss'>
@import './WithdrawCurrency.scss'
</style>
