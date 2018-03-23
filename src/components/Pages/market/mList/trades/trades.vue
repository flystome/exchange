<template>
  <div class="trade" id="trade">
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
                <p class="num"><span>{{extra_base}}</span><span class="base">{{market.base_currency | upper}}</span></p>
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
                <span class="nums">{{price * amount_buy | fixed8}} {{market.base_currency | upper}}</span>
                <span class="des">{{$t("markets.total")}}</span>
              </div>
              <div class="percent">
                <span v-for="per in percents" :key="per" @click="setTrade(per)">{{per}}%</span>
              </div>
              <div class="maxNum private">
                <span class="nums">{{maxAmount | fixed8}} {{market.quote_currency | upper}}</span>
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
                <p class="num"><span>{{extra_quote}}</span><span class="base">{{market.quote_currency | upper}}</span></p>
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
                <span class="nums">{{price * amount_sell | fixed8}} {{market.base_currency | upper}}</span>
                <span class="des">{{$t("markets.total")}}</span>
              </div>
              <div class="percent">
                <span v-for="per in percents" :key="per" @click="setTrade(per)">{{per}}%</span>
              </div>
              <div class="maxNum private">
                <span class="nums">{{extra_quote}} {{market.quote_currency | upper}}</span>
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
          <span>{{ticker.last | fixed8}}</span>
        </div>
        <div class="trades_list">
          <div class="head clearfix">
            <div class="trade_price trade_lt">{{$t("markets.price")}}</div>
            <div class="trade_num trade_rt">{{$t("markets.amount")}}</div>
          </div>
          <div class=" trade_list">
            <ul class="sell_list clearfix">
              <li v-for="item in sellList" :key="item[0]">
                <div class="trade_price trade_lt" @click='addPrice(item[0])'>{{item[0] | fixed8}}</div>
                <div class="trade_num trade_rt">{{item[1]}}</div>
              </li>
            </ul>
          </div>
          <div class=" trade_list">
            <ul class="buy_list clearfix">
              <li v-for="item in buyList" :key="item[0]">
                <div class="trade_price trade_lt" @click='addPrice(item[0])'>{{item[0] | fixed8}}</div>
                <div class="trade_num trade_rt">{{item[1]}}</div>
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
      percents: [25, 50, 75, 100],
      currencyindex: 1,
      order_type: 'buy',
      curMarket: '',
      ticker: {},
      market: {},
      sellList: [],
      buyList: [],
      isDisabled: false,
      status: false,
      sn: '',

      extra_base: 0,
      extra_quote: 0,
      price: '',
      amount_buy: '',
      amount_sell: ''
    }
  },
  mounted: function () {
    var self = this
    this.order_type = this.$route.hash.substr(1) || 'buy'
    this.curMarket = this.$route.params.id
    this.fetchData(this.curMarket)

    var marketPush = pusher.subscribe('market-' + this.curMarket + '-global')
    marketPush.bind('update', (data) => {
      if (data.asks.length !== 0) {
        self.sellList = data.asks.slice(-8, 8).reverse()
      }
      if (data.bids.length !== 0) {
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
        if (this.extra_base < val * this.price || this.amount_buy.length > 16) {
          val = this.extra_base / this.price
          this.amount_buy = Math.floor(Math.pow(10, 8) * val) / Math.pow(10, 8)
        }
      }
    },
    amount_sell: function (val, oldValue) {
      if (+val > this.extra_quote || this.amount_sell.length > 16) {
        val = this.extra_quote
        this.amount_sell = val
      }
    }
  },
  filters: {
    fixed2: function (params) {
      if (!params) return 0
      return (+params).toFixed(2)
    },
    upper: function (params) {
      if (!params || params === '/' || params === 'undefined/undefined') return '--'
      return params.toUpperCase()
    },
    fixed4: function (params) {
      if (+params === 0 || !params) return 0
      var len = +params.toString().split('.')[0].length
      if (len > 1) {
        return (+params).toFixed(2)
      } else {
        return (+params).toPrecision(4)
      }
    },
    fixed8: function (params) {
      if (+params <= 0 || !params) return 0
      var len = +params.toString().split('.')[0].length
      if (len >= 5) {
        return (+params).toFixed(4)
      } else if (len > 1) {
        return (+params).toFixed(6)
      } else {
        return (+params).toPrecision(8)
      }
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
        self.sellList = initdata.asks.slice(-8, 8)
        self.buyList = initdata.bids.slice(0, 8)
        self.market = initdata.market
        self.extra_base = initdata.accounts[self.market.base_currency].balance
        self.extra_quote = initdata.accounts[self.market.quote_currency].balance
        self.sellList = self.sellList.reverse()
        self.sn = initdata.current_user.sn
      })
    },
    getRefresh: function (sn) {
      var privateAccount = pusher.subscribe('private-' + sn)
      privateAccount.bind('account', (data) => {
        console.log(data)
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
          this.amount_buy = this.extra_base * per / (this.price * 100)
        }
        if (this.order_type === 'sell') {
          this.amount_sell = this.extra_base * per / 100
        }
      }
    },
    orderBid: function () {
      if (!this.price || this.price === 0) return ''
      if (!this.amount_buy || this.amount_buy === 0) return ''
      var self = this

      this.isDisabled = true
      this._post({
        url: '/markets/' + this.curMarket + '/order_bids',
        data: {
          order_bid: {
            ord_type: 'limit',
            price: self.price,
            origin_volume: self.amount_buy
          }
        }
      }, function (data) {
        if (data.status === 200) {
          self.isDisabled = false
          self.price = ''
          self.amount_buy = ''
          self.status = 'success'
        } else {
          self.isDisabled = false
          self.status = 'fail'
        }
      })
    },
    orderAsk: function () {
      if (!this.price || this.price === 0) return ''
      if (!this.amount_sell || this.amount_sell === 0) return ''
      var self = this

      this.isDisabled = false
      this._post({
        url: '/markets/' + this.curMarket + '/order_asks',
        data: {
          order_ask: {
            ord_type: 'limit',
            price: self.price,
            origin_volume: self.amount_sell
          }
        }
      }, function (data) {
        if (data.status === 200) {
          self.isDisabled = false
          self.price = ''
          self.amount_buy = ''
          self.status = 'success'
        } else {
          self.isDisabled = false
          self.status = 'fail'
        }
      })
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
