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
    <div class="b">
      <div class="withdraw-form">
        <news-prompt :Time='3000' v-on:bind='withdraw_prompt = $event' :text='withdraw_prompt'></news-prompt>
        <div @click.stop="ChoiceStatus(!choice)" class="withdraw-address b-l">
          {{ Address !== 'withdraw_currency.withdraw_currency_address' ? Address : $t('withdraw_currency.withdraw_currency_address') }}
        </div>
        <div v-show="choice" @click.stop="ChoiceStatus(true)" class='b address-contain'>
          <div class="address-height">
            <div class="pointer" v-for="(data, index) in FundSources[curCoin]" :key="index"
              @click.stop="ChoiceAddress(index, data.id)">
              <div class="fl">
                <div class="color999">
                  <strong style="height: 16px;display: block;">{{ data.extra }}</strong>
                </div>
                <div>
                  <strong>{{ data.uid }}</strong>
                </div>
              </div>
              <div class="fr">
                <span @click.stop="DefaultFunds(data.id, index)">{{$t('withdraw_currency.set_as_default')}}</span>丨
                <span @click.stop="DeleteFunds(data.id, FundSources[curCoin], index)">{{$t('withdraw_currency.delete')}}</span>
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
            <span>{{ $t('withdraw_currency.available_balance') }}</span> {{ Balance | toFixed | toLocaleString }} {{ curCoin | upper }} <span class="marginL15">{{ $t('withdraw_currency.remaining_withdraw') }}</span> {{ Remain | toFixed | toLocaleString }} {{ curCoin | upper }}<span v-if="equivalence" style="color:black">≈{{ equivalence | toFixed | toLocaleString }} BTC</span>
          </div>
          <template v-if="Address !== 'withdraw_currency.withdraw_currency_address' || withdrawAddress">
          <!-- <template> -->
            <basic-input :validate='"required|withdraw_amount"' :invalid='invalid' :danger='true' ref='withdraw_amount' v-model="WithdrawData.amount" class="withdraw-all" style="display: flex;" :placeholder="this.$t('withdraw_currency.Amount_to_withdraw')">
              <basic-button :disabled='disabled' @click.native="WithdrawAll" class="link btn" slot="button" :text="$t('withdraw_currency.withdraw_all')"></basic-button>
            </basic-input>
            <div class="withdraw-explain">
              <span>{{ $t('withdraw_currency.minimum_withdraw_amount_of_money') }} {{ currency_precision }}</span>
              <span class="fr">{{ $t('withdraw_currency.poundage') }} {{ withdraw_fee }}</span>
            </div>
            <div class="choice-validate">
              <select class="select-option" ref='select' v-model="validate" :disabled="disabled">
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
  </div>
  <!-- <basic-table :loading='withdraw_loading' :captionTitle='WithdrawRecord.captionTitle' :item='getWithdrawRecord' :perfix='curCoin.toUpperCase()' v-if="route === 'withdraw'">
    <div slot="more" class="text-center b-t table-more col-md-6">
      <router-link class="link" :to="`${ROUTER_VERSION}/form/withdraw?currency=${curCoin}`">
        {{$t('my_account.show_more')}}
      </router-link>
    </div>
    <div slot="more" class="b-t text-center table-more b-l col-md-6">
      <router-link :to="`${ROUTER_VERSION}/form/withdraw_cancel`" class='link '>
        {{$t('withdraw_currency.cancel_withdraw')}}
      </router-link>
    </div>
  </basic-table> -->
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'withdraw',
  props: ['home'],
  data () {
    return {
      Address: 'withdraw_currency.withdraw_currency_address',
      Balance: '',
      coins: this.home.currencies || [],
      curIndex: 0,
      curCoin: 'btc',
      choice: false,
      currency_precision: 0,
      disabled: true,
      equivalence: '',
      FundSources: this.home.fund_sources || {},
      invalid: false,
      Remain: '',
      Rucaptcha: false,
      validate: '',
      withdraw_prompt: '',
      withdrawAddress: true,
      WithdrawRecord: {},
      WithdrawData: {
        Address_id: '',
        otp: '',
        rucaptcha: '',
        amount: '',
        remark: '',
        newAddress: ''
      },
      withdraw_fee: ''
    }
  },
  created () {
    this.disabled = true
    this._get({
      url: '/funds/home.json'
    }, (res) => {
      console.log(res)
      this.disabled = false
      // var d = d.data.success
      // var channel = pusher.subscribe(`private-${d.sn}`)
      // var MarketChannel = pusher.subscribe(`market-global`)

      // channel.bind('pusher:subscription_succeeded', () => {
      //   this.GetCoin(false, d.fund_sources, d.sn)
      // })

      // if (pusher.connection.state === 'connected') {
      //   this.GetCoin(false, d.fund_sources, d.sn)
      // }

      // this.route = this.$route.path.slice(this.$route.path.lastIndexOf('/') + 1)
    })
  },
  computed: {
    ...mapGetters(['loginData'])
  },
  filters: {
    toFixed (str) {
      var reg = /.*\..*/
      return Number(str).toFixed(Math.min((!reg.test(str) ? 0 : String(str).split('.')[1].length), 8))
    },
    toLocaleString (n) {
      if (!n) return 0
      var re = /\d{1,3}(?=(\d{3})+$)/g
      var n1 = String(n).replace(/^(\d+)((\.\d+)?)$/, function (s, s1, s2) { return s1.replace(re, '$&,') + s2 })
      return n1
    }
  },
  methods: {
    ChoiceStatus (boolean) {
      this.choice = boolean
    },
    ChoiceAddress (index, id) {
      this.WithdrawData.Address_id = id
      this.withdrawAddress = false
      this.Address = this.FundSources[this.curCoin][index].uid
      this.ChoiceStatus(false)
    },
    GetCoin (c, funds, sn) {
      this.withdrawAddress = false
      var obj = this.WithdrawRecord
      var coin = c || 'btc'
      this.withdraw_loading = true
      obj.item = []
      this.disabled = true
      this.loading = true
      this._get({
        url: `/funds/${coin}/account_info.json`
      }, (res) => {
        var d = res.data.success
        this.GeneratAddress = false
        this.disabled = false
        this.loading = false
        this.account_id = d.account.account_id
        this.withdraw_fee = d.withdraw_fee
        this.currency_precision = Math.max(2 * d.withdraw_fee, 1 / Math.pow(10, d.currency_precision))
        this.equivalence = (coin) === 'btc' ? '' : (d.today_withdraw_remain_btc ? d.today_withdraw_remain_btc : 0)
        this.WithdrAwable = d.withdrawable
        this.Remain = d.today_withdraw_remain ? d.today_withdraw_remain : 0
        var withdraws = d.withdraws
        d.account && (this.Balance = d.account.balance)
        obj.item = []
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
        obj.captionTitle = 'withdraw_currency.withdraw_currency_record'

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
        if (d.data.success) {
          if (d.data.success.hasOwnProperty('fund_source')) {
            this.FundSources[d.data.success.fund_source.currency].push(d.data.success.fund_source)
          }
          this.PopupBoxDisplay({message: this.$t('api_server.withdraw_currency.create_withdraw_200'), type: 'success', url: '/form/withdraw_cancel'})
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
    DeleteFunds (id, funds, index) {
      this.disabled = true
      this._delete({
        url: `/funds/${id}/delete_fund_source.json`
      }, (res) => {
        this.disabled = false
        var d = res.data
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
      }, (res) => {
        this.disabled = false
        var d = res.data
        if (d.success) {
          this.FundSources[this.curCoin].forEach((d) => {
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
    }
  }
}
</script>

<style scoped lang="scss">
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
  .withdraw-form {
    padding: 40px 230px;
    border-top: none;
  }
  .withdraw-address {
    height: 32px;
    color: #757575;
    padding: 5px;
    position: relative;
    cursor: pointer;
    background: #f2f2f2;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 41px;
    background: url('~Img/large/select.png') 100% 100% no-repeat;
    background-size: cover !important;
  }
  .withdraw-explain {
    height: 33px;
    line-height: 33px;
    font-size: 12px;
  }
  .choice-validate {
    display: flex;
    .select-option {
      width: 138px;
      height: 32px;
      border-right: none;
      appearance: menulist;
    }
    &>div {
      flex: 1;
    }
  }
</style>
