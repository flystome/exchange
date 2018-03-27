<template>
  <div class="trade" id="trade">
    <div class="dialog" v-show='showDialog'>
      <div class="mask"></div>
      <div class="dia_content">
        <div class="text">
          <h4>{{$t('markets.dialog.' + order_type)}}{{$t('markets.cancel')}}</h4>
          <ul>
            <li><div class="value"><span>{{market.quote_currency | upper}}</span></div>{{$t('markets.coin')}}</li>
            <li><div class="value">{{price | fixedNum(market.price_fixed)}}<span>{{market.base_currency | upper}}</span></div>{{$t('markets.price')}}</li>
            <li v-if="order_type === 'buy'"><div class="value">{{amount_buy | fixedNum(market.price_amount)}}<span>{{market.quote_currency | upper}}</span></div>{{$t('markets.volume')}}</li>
            <li v-if="order_type === 'sell'"><div class="value">{{amount_sell | fixedNum(market.price_amount)}}<span>{{market.quote_currency}}</span></div>{{$t('markets.volume')}}</li>
          </ul>
        </div>
        <div class="confirm_box">
          <span class="confirm" @click="confirmTrade(true)">{{$t('markets.confirm')}}</span>
          <span class="cancel" @click="confirmTrade(false)">{{$t('markets.cancel')}}</span>
        </div>
      </div>
    </div>
    <ul class="trade_hd clearfix">
      <li v-for="(hd,index) in hds" :key="hd" :class="{'check': currencyindex == index}" @click="goPath(index)"
      >{{hd}}</li>
    </ul>

    <div class="trades_main">
      <div class="trades_lt">
        <router-link class="cur_market" :to="{path: ROUTER_VERSION + '/markets'}">
          <span>{{(market.quote_currency+'/'+market.base_currency) | upper}}</span>
          <i class="caret"></i>
        </router-link>
        <div class="order_box">
          <div class="order_type">
            <a class="buy" :class="{'active': order_type === 'buy'}" @click="orderType('buy')">{{$t("markets.buy")}}</a>
            <a class="sell" :class="{'active': order_type === 'sell'}" @click="orderType('sell')">{{$t("markets.sell")}}</a>
          </div>
          <form action="#">
            <div class="order order_buy" v-if="order_type==='buy'">
              <div class="extra">
                <p>{{$t("markets.extra")}}</p>
                <p class="num"><span>{{extra_base | fixedNum(market.price_fixed, market.volume_fixed)}}</span><span class="base">{{market.base_currency | upper}}</span></p>
              </div>
              <div class="price inputs">
                <input type="number" step="0.00000001" v-model="price" :placeholder="$t('markets.price')">
                <span class="base">{{market.base_currency | upper}}</span>
              </div>
              <div class="price inputs">
                <input type="number" step="0.00000001" v-model="amount_buy" :placeholder="$t('markets.amount')">
                <span class="quote">{{market.quote_currency | upper}}</span>
              </div>
              <div class="total private">
                <span class="nums">{{price * amount_buy | fixedNum(market.price_fixed, market.volume_fixed)}} {{market.base_currency | upper}}</span>
                <span class="des">{{$t("markets.total")}}</span>
              </div>
              <div class="percent">
                <span v-for="per in percents" :key="per[1]" @click="setTrade(per[1])">{{per[0]}}</span>
              </div>
              <div class="maxNum private">
                <span class="nums">{{maxAmount | fixedNum(market.price_fixed, market.volume_fixed)}} {{market.quote_currency | upper}}</span>
                <span class="des">{{$t("markets.maxAmount")}}</span>
              </div>
              <div class="tips">
                <p class="success" v-if="status==='success'">
                  <i class="fa fa-check"> {{$t('markets.trade_success')}}</i>
                </p>
                <p class="fail" v-if="status==='fail'">
                  <i class="fa fa-times"> {{$t('markets.trade_fail')}}</i>
                </p>
              </div>
              <button class="buy" :disabled="isDisabled" @click.prevent="orderBid()">{{$t("markets.buy")}}</button>
            </div>
          </form>
          <form action="#">
            <div class="order order_sell" v-if="order_type==='sell'">
              <div class="extra">
                <p>{{$t("markets.extra")}}</p>
                <p class="num"><span>{{extra_quote | fixedNum(market.price_fixed, market.volume_fixed)}}</span><span class="base">{{market.quote_currency | upper}}</span></p>
              </div>
              <div class="price inputs">
                <input type="number" step="0.00000001" v-model="price" :placeholder="$t('markets.price')">
                <span class="base">{{market.base_currency | upper}}</span>
              </div>
              <div class="price inputs">
                <input type="number" step="0.00000001" v-model="amount_sell" :placeholder="$t('markets.amount')">
                <span class="quote">{{market.quote_currency | upper}}</span>
              </div>
              <div class="total private">
                <span class="nums">{{price * amount_sell | fixedNum(market.price_fixed, market.volume_fixed)}} {{market.base_currency | upper}}</span>
                <span class="des">{{$t("markets.total")}}</span>
              </div>
              <div class="percent">
                <span v-for="per in percents" :key="per[1]" @click="setTrade(per[1])">{{per[0]}}</span>
              </div>
              <div class="maxNum private">
                <span class="nums">{{extra_quote | fixedNum(market.price_fixed, market.volume_fixed)}} {{market.quote_currency | upper}}</span>
                <span class="des">{{$t("markets.maxAmount")}}</span>
              </div>
              <div class="tips">
                <p class="success" v-if="status==='success'">
                  <i class="fa fa-check"> {{$t('markets.trade_success')}}</i>
                </p>
                <p class="fail" v-if="status==='fail'">
                  <i class="fa fa-times"> {{$t('markets.trade_fail')}}</i>
                </p>
              </div>
              <button class="sell" :disabled="isDisabled" @click.prevent="orderAsk()">{{$t("markets.sell")}}</button>
            </div>
          </form>
        </div>
      </div>
      <div class="trades_rt">
        <div class="currency_price">
          <router-link class="back" :to="{path: ROUTER_VERSION + '/markets/' + curMarket}"><img src="~Img/candle.jpg"></router-link>
          <span :class="{'text-up': ticker.last > ticker.open, 'text-down': ticker.last< ticker.open}">{{ticker.last | fixedNum(market.price_fixed)}}</span>
        </div>
        <div class="trades_list">
          <div class="head clearfix">
            <div class="trade_price trade_lt">{{$t("markets.price")}}</div>
            <div class="trade_num trade_rt">{{$t("markets.amount")}}</div>
          </div>
          <div class=" trade_list">
            <ul class="sell_list clearfix">
              <li v-for="item in sellList" :key="item[0]">
                <div class="trade_price trade_lt" @click='addPrice(item[0])'>{{item[0] | fixedNum(market.price_fixed)}}</div>
                <div class="trade_num trade_rt">{{item[1] | fixedNum(market.volume_fixed)}}</div>
              </li>
            </ul>
          </div>
          <div class=" trade_list">
            <ul class="buy_list clearfix">
              <li v-for="item in buyList" :key="item[0]">
                <div class="trade_price trade_lt" @click='addPrice(item[0])'>{{item[0] | fixedNum(market.price_fixed)}}</div>
                <div class="trade_num trade_rt">{{item[1] | fixedNum(market.volume_fixed)}}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import pusher from '@/common/js/pusher'

export default {
  name: 'trades',
  data () {
    return {
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      hds: [this.$t('markets.quotes'), this.$t('markets.trade'), this.$t('markets.currency')],
      percents: [['1/4', 25], ['1/3', 33.3], ['1/2', 50], ['All', 100]],
      currencyindex: 1,
      order_type: 'buy',
      curMarket: '',
      ticker: {},
      market: {},
      sellList: [],
      buyList: [],
      isDisabled: true,
      status: false,
      sn: '',
      showDialog: false,

      extra_base: 0,
      extra_quote: 0,
      price: '',
      amount_buy: '',
      amount_sell: '',
      amount: ''
    }
  },
  mounted: function () {
    var self = this
    this.order_type = this.$route.hash.substr(1) || 'buy'
    this.curMarket = this.$route.params.id
    this.fetchData(this.curMarket)

    var marketPush = pusher.subscribe('market-' + this.curMarket + '-global')
    marketPush.bind('update', (data) => {
      if (data.asks || data.asks.length !== 0) {
        self.sellList = data.asks.slice(-8, 8).reverse()
      }
      if (data.bids || data.bids.length !== 0) {
        self.buyList = data.bids.slice(0, 8)
      }
    })
    var channel = pusher.subscribe('market-global')
    channel.bind('tickers', (data) => {
      if (JSON.stringify(data) !== '{}') {
        for (var key in data) {
          if (key === self.curMarket) {
            self.ticker.last = data[key].last
          }
        }
      }
    })
    window.onpageshow = function (e) {
      if (e.persisted) {
        window.location.reload()
      }
    }
  },
  computed: {
    maxAmount: function () {
      if (this.price && this.price !== 0) {
        return this.extra_base / this.price
      } else {
        return 0
      }
    },
    ...mapState(['loginData'])
  },
  watch: {
    loginData (val) {
      this.getRefresh(val.sn)
      return val
    },
    amount_buy: function (val, oldValue) {
      if (this.price && this.price !== 0) {
        var len = (this.amount_buy).toString().split('.')[1]
        if (this.extra_base < val * this.price || (len && len.length > 8)) {
          val = this.extra_base / this.price
          this.amount_buy = Math.floor(Math.pow(10, 8) * val) / Math.pow(10, 8)
        }
      }
    },
    amount_sell: function (val, oldValue) {
      if (+val > this.extra_quote || (this.amount_sell).toString().split('.')[1].length > 8) {
        val = this.extra_quote
        this.amount_sell = val
      }
    }
  },
  filters: {
    upper: function (params) {
      if (!params || params === '/' || params === 'undefined/undefined') return '--'
      return params.toUpperCase()
    },
    fixedNum: function (params, num, num2) {
      if (+params <= 0 || !params) return 0
      if (!num) num = 6
      if (num2) {
        num = num > num2 ? num : num2
      }
      var value = (+Math.floor(params * Math.pow(10, num)) / Math.pow(10, num)).toFixed(num)
      if (value.length >= 14) value = (+value).toFixed(num - 2)
      return value
    }
  },
  methods: {
    fetchData: function (market) {
      var self = this
      this._get({
        url: '/markets/' + market + '.json',
        data: {}
      }, function (data) {
        var initdata = JSON.parse(data.request.response)
        self.ticker = initdata.ticker
        if (initdata.asks) {
          self.sellList = initdata.asks.slice(-8, 0).reverse()
        }
        if (initdata.bids) {
          self.buyList = initdata.bids.slice(0, 8)
        }
        self.market = initdata.market
        if (initdata.accounts) {
          self.extra_base = initdata.accounts[self.market.base_currency] && initdata.accounts[self.market.base_currency].balance
          self.extra_quote = initdata.accounts[self.market.quote_currency] && initdata.accounts[self.market.quote_currency].balance
        }
        if (!initdata.current_user) {
          self.sn = 'unlogin'
        } else {
          self.sn = initdata.current_user.sn
        }
        self.isDisabled = false
      })
    },
    getRefresh: function (sn) {
      var self = this
      var privateAccount = pusher.subscribe('private-' + sn)
      privateAccount.bind('account', (data) => {
        if (data.currency === self.market.base_currency) {
          self.extra_base = data.balance
        } else if (data.currency === self.market.quote_currency) {
          self.extra_quote = data.balance
        }
      })
    },
    orderType: function (type) {
      this.order_type = type
      this.price = ''
      this.amount_buy = ''
      this.amount_sell = ''
      this.status = false
    },
    addPrice: function (price) {
      this.price = price
      if (this.order_type === 'buy') {
        if (this.price * this.amount_buy > this.extra_base) {
          this.amount_buy = this.extra_base / this.price
        }
      }
    },
    setTrade: function (per) {
      if (this.price && this.price !== 0) {
        if (this.order_type === 'buy') {
          var vaule = this.extra_base * per / (this.price * 100)
          if (vaule.toString().split('.')[1] > 8) {
            this.amount_buy = Math.floor(vaule * Math.pow(10, 8)) / Math.pow(10, 8)
          }
        }
        if (this.order_type === 'sell') {
          this.amount_sell = this.extra_base * per / 100
        }
      }
    },
    confirmTrade: function (bool) {
      this.showDialog = false
      if (bool) {
        if (this.order_type === 'buy') {
          this.confirmBuy()
        } else if (this.order_type === 'sell') {
          this.confirmSell()
        }
      } else {
        this.isDisabled = false
      }
    },
    confirmBuy: function (bool) {
      this._post({
        url: '/markets/' + this.curMarket + '/order_bids',
        data: {
          order_bid: {
            ord_type: 'limit',
            price: this.price,
            origin_volume: this.amount_buy
          }
        }
      }, this.orderCallback)
    },
    confirmSell: function (bool) {
      this._post({
        url: '/markets/' + this.curMarket + '/order_asks',
        data: {
          order_ask: {
            ord_type: 'limit',
            price: this.price,
            origin_volume: this.amount_sell
          }
        }
      }, this.orderCallback)
    },
    orderCallback: function (data) {
      if (data.status === 200) {
        this.isDisabled = false
        this.price = ''
        this['amount_' + this.order_type] = ''
        this.status = 'success'
      } else {
        this.isDisabled = false
        this.status = 'fail'
      }
    },
    loginCheck: function () {
      if (this.sn === 'unlogin') {
        location.href = `${process.env.HOST_URL}/signin?from=${location.href}`
      }
    },
    orderBid: function () {
      this.loginCheck()
      if (!this.price || this.price === 0 || this.price === '') return ''
      if (!this.amount_buy || this.amount_buy === 0 || this.amount_sell === '') return ''
      this.showDialog = true
      this.isDisabled = true
    },
    orderAsk: function () {
      this.loginCheck()
      if (!this.price || this.price === 0 || this.price === '') return ''
      if (!this.amount_sell || this.amount_sell === 0 || this.amount_sell === '') return ''
      this.showDialog = true
      this.isDisabled = false
    },
    goPath: function (index) {
      if (index === 0) {
        this.$router.push({path: `${this.ROUTER_VERSION}/markets/${this.curMarket}`})
      } else if (index === 1) {
        return ''
      } else if (index === 2) {
        this.$router.push({path: `${this.ROUTER_VERSION}/markets/${this.curMarket}/orders`})
      }
    }
  }
}
</script>
<style scoped lang="scss">
  @import './trades.scss'
</style>
