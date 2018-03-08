<template>
  <div class="btc-member-center" @click="ChoiceStatus(false)">
    <div class="btc-container-block">
      <div class="btc-currency-withdraw">
          <div class="btc-fl">
            <span>
              <img src="~Img/asset-total.png">
              {{$t('withdraw_currency.total_assets')}} <span>{{ TotalAssets }}</span> USDT
            </span>
            <img class="btc-marginL45 btc-marginR5" src="~Img/asset-freeze.png">
            <a class='btc-color999'>
              {{$t('withdraw_currency.frozen_assets')}} {{ Locked }} USDT
            </a>
          </div>
          <div class="btc-fr">
          <router-link to="/currency/deposit" class="btc-poniter" :class="{'btc-link':route === 'deposit'}">
            <strong>
              {{ $t('withdraw_currency.deposit') }}
            </strong>
          </router-link>
          <span>|</span>
          <router-link to="/currency/withdraw" class="btc-poniter" :class="{'btc-link':route === 'withdraw'}">
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
        :class="{'is-chioce':index === length, 'is-enabled': !coin.node_enabled}"
        @click='ChoiceCoin(index, coin.node_enabled)'
        class="btc-b"
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
              <basic-input class="btc-withdraw-all" v-model="WithdrawData.remark" :placeholder='$t("withdraw_currency.remark_label")'>
              </basic-input>
              <basic-input class="btc-withdraw-all" v-model="WithdrawData.newAddress" :placeholder='$t("withdraw_currency.withdraw_currency_address")'>
              </basic-input>
            </div>
            <div class="btc-withdraw-explain">
              <span>{{ $t('withdraw_currency.available_balance') }}</span> {{ Balance }} USDT <span class="btc-marginL15">{{ $t('withdraw_currency.remaining_withdraw') }}</span> {{ Remain }} USDT
            </div>
              <basic-input ref='WithdrawAll' v-model="WithdrawData.amount" class="btc-withdraw-all" style="display: flex;" :placeholder="this.$t('withdraw_currency.Amount_to_withdraw')">
                <basic-button @click.native="WithdrawAll" class="btc-link" slot="button" :text="$t('withdraw_currency.withdraw_all')"></basic-button>
              </basic-input>
            <div class="btc-withdraw-explain"><span>{{ $t('withdraw_currency.minimum_withdraw_amount_of_money') }}</span> 0.001 <span class="btc-fr btc-link"><img src="~Img/tariff-description.png">{{$t('withdraw_currency.tariff_description')}}</span></div>
            <div class="btc-choice-validate">
              <basic-select key="'choice_verfiy'" :data="[this.$t('withdraw_currency.google_validate'),this.$t('withdraw_currency.sms')]"
              :value="validate"
              v-on:selected="validate = arguments[0]">>
              </basic-select>
              <basic-input v-model="WithdrawData.otp" :key="validate" class="btc-marginB10">
              </basic-input>
              <button @click="SendSms" v-if="validate === 'SMS'" class="btc-white-btn">{{ timer }}</button>
            </div>
            <div v-if="Rucaptcha">
              <basic-input :placeholder="$t('deposit_currency.identifying_code')" v-model="WithdrawData.rucaptcha"  class="btc-marginT10">
              </basic-input>
              <img @click="ChangeRucaptcha" class="btc-pointer btc-marginB10" :key="'rucaptcha'" :src="`${HOST_URL}${Rucaptcha}`">
            </div>
            <basic-button :class="{'btc-marginT30': !Rucaptcha}" @click.native="Withdraw" style="width:100%" :text="$t('withdraw_currency.withdraw')">
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
            <basic-button  data-clipboard-target="#copy" class="btc-marginT30 btn-copy" :text='$t("deposit_currency.copy_address")'></basic-button>
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
    <basic-table :captionTitle='WithdrawRecord.captionTitle' :item='WithdrawRecord.item' v-if="route === 'withdraw'">
      <template slot="cancel"
      slot-scope="props">
      <a>
        / <span @click="cancelWithdraw(props.id, props.data)" class="btc-link">{{$t('withdraw_currency.cancel')}}</span>
      </a>
      </template>
      <div slot="more" class="text-center btc-b-t btc-table-more">
        <a class="btc-link ">{{$t('member_center.show_more')}}</a>
      </div>
    </basic-table>
    <basic-table :captionTitle='depositRecord.captionTitle' :item='depositRecord.item' v-else>
      <div slot="more" class="text-center btc-b-t btc-table-more">
        <a class="btc-link ">{{$t('member_center.show_more')}}</a>
      </div>
    </basic-table>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
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
    this._get({
      url: '/funds/home.json'
    }, (d) => {
      var channel = pusher.subscribe(`private-${d.data.sn}`)
        channel.bind('deposit_address', (data) => {
          // this.DepositAddress.forEach((data, index) => {
          //   if (!data.id === data) {
          //     this.DepositAddress.push({
          //       id: data.attributes.account_id,
          //       address: data.attributes.deposit_address
          //     })
          //   }
          // })
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
      this.Remain = d.data.today_withdraw_remain
      this.TotalAssets = Number(d.data.total_assets.btc_worth).toFixed(2)
      if (d.data.notice) {
        this.PopupBoxDisplay({message: d.data.notice.message, type: d.data.notice.type})
      }
      d.data.rucaptcha && (this.Rucaptcha = d.data.rucaptcha)
      d.data.currencies.forEach((a) => {
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
      this.FundSources = d.data.fund_sources
      this.GetCoin(false, d.data.fund_sources, d.data.sn)
    })
    this.route = this.$route.path.slice(this.$route.path.lastIndexOf('/') + 1)
  },
  data () {
    return {
      HOST_URL: process.env.HOST_URL,
      TotalAssets: 0,
      warn: {
        length: 0,
        message: '',
        type: 'success',
        point: '.'
      },
      length: 0,
      DepositAddress: '',
      currencies: [],
      route: '',
      deposit_address_display: false,
      deposit_address: this.$t('deposit_currency.deposit_address'),
      choice: false,
      second: -1,
      resend: false,
      withdrawAddress: false,
      CurrencyType: 'btc',
      Balance: '',
      Remain: '',
      Locked: '',
      Address: this.$t('withdraw_currency.withdraw_currency_address'),
      Rucaptcha: false,
      Time: '',
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
    }
  },
  methods: {
    ChangeRucaptcha () {
      this.Rucaptcha += `?${Math.random()}`
    },
    WithdrawAll () {
      this.WithdrawData.amount = this.Remain
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
      this.$nextTick(() => {
        this._get({
          url: `/funds/${c || 'btc'}/account_info`
        }, (d) => {
          if (d.data.status === 2) {
            this.PopupBoxDisplay({message: '123', type: 'warn'})
            this.ChangePopupBox({
              buttondisplay: false,
              type: 'warn',
              message: 'wait',
            })
            this.Time = setTimeout(() => {
              this.ChangePopupBox({
                message: '失败',
                type: 'error',
              })
              setTimeout(() => {
                this.PopupBoxDisplay()
              }, 1000)
            }, 10000)
          }
          this.Locked = d.data.account.locked
          var obj = this.WithdrawRecord
          var objd = this.depositRecord
          var withdraws = d.data.withdraws
          var deposits = d.data.deposits
          if (d.data.address) {
            this.deposit_address_display = true
            this.deposit_address = d.data.address
          } else {
            this.deposit_address_display = false
            this.deposit_address = ''
          }
          d.data.account && (this.Balance = d.data.account.balance)
          withdraws.length === 0 ? obj.item = [] : obj.item = [{content: [
            this.$t('withdraw_currency.number'),
            this.$t('withdraw_currency.withdraw_time'),
            this.$t('withdraw_currency.withdraw_address'),
            this.$t('withdraw_currency.actual_account'),
            this.$t('withdraw_currency.absenteeism_expenses'),
            this.$t('withdraw_currency.statu_and_operation')
          ]
          }].concat(withdraws.map(d => {
            var title = `${d.aasm_state_title}`
            var id = d.id
            return {
              content: [
                id,
                this.$moment(d.created_at).format('L H:mm:ss'),
                d.fund_uid,
                d.amount,
                d.fee,
                { type: d, context: title, id: id }
                // ${d.aasm_state === ('submitting' || 'submitted' || 'accepted') ? ` / <span class='btc-cancel btc-link'>${this.$t('withdraw_currency.cancel')}</span>` : ''}
              ]
            }
          }))

          deposits.length === 0 ? objd.item = [] : objd.item = [{content: [
            this.$t('deposit_currency.deposit_date'),
            this.$t('deposit_currency.trading_hash'),
            this.$t('deposit_currency.recharge_amount'),
            this.$t('deposit_currency.confirmation_number'),
            this.$t('withdraw_currency.statu_and_operation')
          ]
          }].concat(deposits.map(d => {
            return {
              content: [
                this.$moment(d.created_at).format('L H:mm:ss'),
                {hover: true, context: d.txid},
                d.amount,
                d.confirmations,
                d.aasm_state_title
              ]
            }
          }))
          obj.captionTitle = `${(c || 'btc').toUpperCase()} ${this.$t('withdraw_currency.withdraw_currency_record')}`
          objd.captionTitle = `${(c || 'btc').toUpperCase()} ${this.$t('deposit_currency.deposit_record')}`

          if (funds) {
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
      this._delete({
        url: `/funds/${id}/delete_fund_source.json`
      }, (d) => {
        if (d.data.status === 0) {
          if (id === this.WithdrawData.Address_id) {
            this.Address = this.$t('withdraw_currency.withdraw_currency_address')
            this.WithdrawData.Address_id = ''
            this.ChoiceStatus(false)
          }
          this.PopupBoxDisplay({message: d.data.message, type: 'success'})
          funds.splice(index, 1)
        } else {
          this.PopupBoxDisplay({message: d.data.message, type: 'error'})
        }
      })
    },
    DefaultFunds (id) {
      this._post({
        url: `/funds/${id}/set_default_fund_source.json`
      }, (d) => {
        if (d.data.status === 0) {
          this.FundSources[this.CurrencyType].forEach((d) => {
            if (d.is_default) {
              d.is_default = false
            }
            if (d.id === id) {
              d.is_default = true
            }
          })
          this.PopupBoxDisplay({message: d.data.message, type: 'success'})
        } else {
          this.PopupBoxDisplay({message: d.data.message, type: 'error'})
        }
      })
    },
    SendSms () {
      if (this.second > 0) {
        return
      }
      this._post({
        url: '/funds/send_sms'
      }, (d) => {
        if (d.data.status === 1) {
          this.PopupBoxDisplay({message: d.data.error, type: 'error'})
        } else {
          this.CountDown()
        }
      })
    },
    Withdraw () {
      var validate = this.validate === this.$t('withdraw_currency.google_validate') ? {
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
      this._post({
        url: `/funds/${this.CurrencyType}/create_withdraw`,
        data: obj
      }, (d) => {
        if (d.data.rucaptcha) {
          this.Rucaptcha = d.data.rucaptcha
        }
        var prompt = d.data.message
        if (d.data.status === 0) {
          this.PopupBoxDisplay({message: prompt, type: 'success'})
        } else if (d.data.status === 2) {
          this.PopupBoxDisplay({message: d.data.message, type: 'success'})
        } else {
          this.PopupBoxDisplay({message: d.data.error, type: 'error'})
        }
      })
    },
    cancelWithdraw (id, data) {
      this._delete({
        url: `/funds/${id}/cancel_withdraw`
      }, (d) => {
        var prompt = d.data.message
        if (d.data.status === 0) {
          this.PopupBoxDisplay({message: prompt, type: 'success'})
          var type = data.type
          type.aasm_state_title = this.$t('funds.withdraw_history.canceled')
          data.context = this.$t('funds.withdraw_history.canceled')
          type.aasm_state = 'canceled'
        } else {
          this.PopupBoxDisplay({message: prompt, type: 'error'})
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
    }
  },
  mounted () {
    /* eslint-disable no-new */
    new Clipboard('.btn-copy')
  },
  watch: {
    $route (to) {
      this.route = to.path.slice(to.path.lastIndexOf('/') + 1)
    },
    DepositAddress (to, from) {
      if (Object.keys(to).length > Object.keys(from).length) {
        // this.ChangePopupBox({
        //   message: 'success',
        //   type: 'success'
        // })
        // this.ChangePopupBox({
        //   type: 'success'
        // })
        clearTimeout(this.Time)
        this.ChangePopupBox({
          type: 'success',
          message: 'success',
        })
        setTimeout(() => {
          this.PopupBoxDisplay()
          this.ChangePopupBox({
            buttondisplay: true,
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
