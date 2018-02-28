<template>
  <div class="btc-member-center" @click="ChoiceStatus(false)">
    <div class="btc-container-block">
      <div class="btc-currency-withdraw">
          <div class="btc-fl">
            <span>
              <img src="~Img/asset-total.png">
              {{$t('withdraw_currency.total_assets')}} <span>0</span> BTC
            </span>
            <img class="btc-marginL45 btc-marginR5" src="~Img/asset-freeze.png">
            {{$t('withdraw_currency.frozen_assets')}} 0 BTC
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
        :class="{'is-chioce': index === length}"
        @click='ChoiceCoin(index)'
        class="btc-b"
        :key="coin">
          <img :src="requireImg(`market-${coin}`)">
          <span>
            {{ coin | toUpperCase }}
          </span>
        </a>
      </div>
      <div class="btc-b" v-if="route === 'withdraw'">
        <div class="btc-withdraw-form">
          <!-- <basic-option :data='[{
            name: "withdraw_currency_address",
            value: this.$t("withdraw_currency.withdraw_currency_address")
          }]' v-model="this.withdrawAddress"></basic-option> -->
          <div @click.stop="ChoiceStatus(!choice)" class="btc-withdraw-address btc-b-l" :style="{background:`url('${requireImg('select')}') 100% 100%`}">
            {{ $t('withdraw_currency.withdraw_currency_address') }}
          </div>
          <div v-if="choice" @click.stop="ChoiceStatus(true)" class='btc-b btc-address-contain '>
            <div class="btc-address-height">
              <div class="btc-pointer">
                  <div class="btc-fl">
                    <div class="btc-color999">
                      <strong>
                        bch钱包btc地址A
                      </strong>
                    </div>
                    <div>
                      <strong>
                        1Bv9EYCrCKjtusatU1LiwcAnKRHVSsGjpr1Bv9EYCrCKjtusatU1Liw......
                      </strong>
                    </div>
                </div>
                <div class="btc-fr"><span>{{$t('withdraw_currency.set_as_default')}}</span>丨<span>{{$t('withdraw_currency.delete')}}</span></div>
                </div>
            </div>
            <div class="btc-addnew btc-pointer text-center" @click.stop="AddAddress">
                <img src="~Img/withdraw-add.png">
                {{$t('withdraw_currency.use_a_new_address')}}
            </div>
          </div>
          <template v-else>
            <div class="btc-marginT15 btc-withdraw-add" style="display: flex" v-if="withdrawAddress">
              <basic-input class="btc-withdraw-all" v-model="RemarkLabel"  :placeholder='$t("withdraw_currency.remark_label")'>
              </basic-input>
              <basic-input class="btc-withdraw-all" v-model="WithdrawCurrencyAddress" :placeholder='$t("withdraw_currency.withdraw_currency_address")'>
              </basic-input>
            </div>
            <div class="btc-withdraw-explain">
              <span>{{ $t('withdraw_currency.available_balance') }}</span> 0 BTC <span class="btc-marginL15">{{ $t('withdraw_currency.remaining_withdraw') }}</span> 0 BTC
            </div>
              <basic-input class="btc-withdraw-all" style="display: flex;" :placeholder="$t('withdraw_currency.Amount_to_withdraw')">
                <basic-button class="btc-link" slot="button" :text="$t('withdraw_currency.withdraw_all')"></basic-button>
              </basic-input>
            <div class="btc-withdraw-explain"><span>{{ $t('withdraw_currency.minimum_withdraw_amount_of_money') }}</span> 0.001 <span class="btc-fr btc-link"><img src="~Img/tariff-description.png">{{$t('withdraw_currency.tariff_description')}}</span></div>
            <div class="btc-choice-validate">
              <basic-select :data="[this.$t('withdraw_currency.google_validate'),this.$t('withdraw_currency.sms')]" :value="validate"  v-on:selected="validate = arguments[0]">>
              </basic-select>
              <basic-input  class="btc-marginB30">
              </basic-input>
              <button v-if="validate === 'SMS'" class="btc-white-btn">{{$t('withdraw_currency.send_identify_code')}}</button>
            </div>
            <basic-button style="width:100%" :text="$t('withdraw_currency.withdraw')">
            </basic-button>
          </template>
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
        <div class="text-right btc-deposit-qrcode col-md-5">
          <img src="~Img/deposit-qrcode.png">
        </div>
        <div class="btc-deposit-address col-md-5">
          <div>
            <div contenteditable="true" id="copy">
              {{ $t('withdraw_currency.withdraw_address') }}
            </div>
            <img  class='btn-copy' data-clipboard-target="#copy" src="~Img/deposit-paste.png">
          </div>
          <basic-button class="btc-marginT15" :text='$t("deposit_currency.generating_address_qrcode")'></basic-button>
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
import Clipboard from 'clipboard'
export default {
  name: 'withdrawCurrency',
  created () {
    this._get({
      url: '/funds/home.json',
      headers: {
        'DataType': 'application/json;charset=utf-8'
      }
    }, (d) => {
      d.data.currencies.forEach((a) => {
        if (a.code === 'btc') {
          this.currencies.unshift(a.code)
        } else {
          this.currencies.push(a.code)
        }
      })
    })
    this.GetCoin()
    this.route = this.$route.path.slice(this.$route.path.lastIndexOf('/') + 1)
  },
  data () {
    return {
      length: 0,
      currencies: [],
      route: '',
      choice: false,
      withdrawAddress: false,
      WithdrawCurrencyAddress: '',
      RemarkLabel: '',
      WithdrawRecord: {
        captionTitle: this.$t('withdraw_currency.withdraw_currency_record'),
        item: []
      },
      depositRecord: {
        captionTitle: this.$t('deposit_currency.deposit_record'),
        item: []
      },
      validate: this.$t('withdraw_currency.google_validate')
    }
  },
  filters: {
    toUpperCase (str) {
      return str.toUpperCase()
    }
  },
  methods: {
    AddAddress () {
      this.withdrawAddress = true
      this.ChoiceStatus(false)
    },
    requireImg (img) {
      return require(`../../../../static/img/${img}.png`)
    },
    ChoiceCoin (index) {
      this.length = index
      this.GetCoin(this.currencies[index])
    },
    ChoiceStatus (boolean) {
      this.choice = boolean
    },
    ChoiceAddress (index) {
      this.RemarkLabel = m[index]
      this.WithdrawCurrencyAddress = m[index]
    },
    GetCoin (c) {
      this._get({
        url: `/funds/${c ? c : 'btc'}/account_info`,
        headers: {
          'DataType': 'application/json;charset=utf-8'
        }
      }, (d) => {
        var obj = this.WithdrawRecord
        var objd = this.depositRecord
        var withdraws = d.data.withdraws
        var deposits = d.data.deposits
        withdraws.length === 0 ? obj.item = [] : obj.item = [{content: [
          this.$t('withdraw_currency.number'),
          this.$t('withdraw_currency.withdraw_time'),
          this.$t('withdraw_currency.withdraw_currency_address'),
          this.$t('withdraw_currency.actual_account'),
          this.$t('withdraw_currency.absenteeism_expenses'),
          this.$t('withdraw_currency.statu_and_operation')
        ]
        }].concat(withdraws.map(d => {
          return {
            content: [
              d.id,
              this.$moment(d.created_at).format('L H:mm:ss'),
              d.fund_uid,
              d.amount,
              d.fee,
              `${d.aasm_state_title}${d.aaasm_state === ('submitting' || 'submitted' || 'accepted') ? ' / <span>取消<span>' : ''}`
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
              d.txid,
              d.amount,
              d.confirmations,
              `${d.aasm_state_title}${d.aaasm_state === ('submitting' || 'submitted' || 'accepted') ? ' / <span>取消<span>' : ''}`
            ]
          }
        }))
      })
    }
  },
  mounted () {
    /* eslint-disable no-new */
    new Clipboard('.btn-copy')
  },
  watch: {
    $route (to) {
      this.route = to.path.slice(to.path.lastIndexOf('/') + 1)
    }
  }
}
</script>

<style scoped lang='scss'>
@import './WithdrawCurrency.scss'
</style>
