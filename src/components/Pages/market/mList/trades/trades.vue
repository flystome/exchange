<template>
  <div class="trade" id="trade">
    <ul class="trade_hd clearfix">
      <li v-for="(hd,index) in hds" :key="hd" :class="{'check': currencyindex == index}"
      >{{hd}}</li>
    </ul>

    <div class="trades_main">
      <div class="trades_lt">
        <a class="cur_market" href="/markets"><span>{{(market.quote_currency+'/'+market.base_currency) | upper}}</span><i class="caret"></i></a>
        <div class="order_box">
          <form>
            <div class="order_type">
              <a class="buy active">{{$t("markets.buy")}}</a>
              <a class="sell">{{$t("markets.sell")}}</a>
            </div>
            <div class="order">
              <div class="extra">
                <p>{{$t("markets.extra")}}</p>
                <p class="num"><span>{{extra}}</span><span class="base">{{market.base_currency | upper}}</span></p>
              </div>
              <div class="price inputs">
                <input type="text">
                <span class="base"></span>
              </div>
              <div class="price inputs">
                <input type="text">
                <span class="quote"></span>
              </div>
              <div class="maxNum private">
                <span class="nums"></span>
                <span class="des">{{$t("markets.maxAmount")}}</span>
              </div>
              <div class="percent">
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
              <div class="total private">
                <span class="nums"></span>
                <span class="des">{{$t("markets.total")}}</span>
              </div>
              <button class="buy">{{$t("markets.buy")}}</button>
              <button class="sell">{{$t("markets.sell")}}</button>
            </div>
          </form>
        </div>
      </div>
      <div class="trades_rt">
        <div class="currency_price">
          <a class="back" href="###"><img src="~Img/candle.jpg"></a>
          <span>{{ticker.last}}000000</span>
        </div>
        <div class="trades_list">
          <div class="head clearfix">
            <div class="trade_price trade_lt">{{$t("markets.price")}}</div>
            <div class="trade_num trade_rt">{{$t("markets.amount")}}</div>
          </div>
          <ul class="sell_list trade_list clearfix">
            <li v-for="item in sellList">
              <div class="trade_price trade_lt">{{item.price}}</div>
              <div class="trade_num trade_rt">{{item.amount}}</div>
            </li>
          </ul>
          <ul class="buy_list trade_list clearfix">
            <li v-for="item in buyList">
              <div class="trade_price trade_lt">{{item.price}}</div>
              <div class="trade_num trade_rt">{{item.price}}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import pusher from '@/common/js/pusher'

export default {
  name: 'trades',
  data () {
    return {
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      hds: [this.$t('markets.quotes'), this.$t('markets.trade'), this.$t('markets.currency')],
      currencyindex: 1,
      order_type: 'buy',
      curMarket: '',
      ticker: {},
      market: {},
      sellList: [],
      buyList: [],
      extra: 0
    }
  },
  mounted: function () {
    this.order_type = this.$route.hash.substr(1)
    this.curMarket = this.$route.params.id
    this.fetchData(this.curMarket)
    console.log(this.curMarket)
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
    time: function (date) {
      var d = new Date(date).toString()
      return d.split(' ')[4]
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
        self.sellList = initdata.trades.slice(0, 8)
        self.buyList = initdata.trades.slice(0, 8)
        self.market = initdata.market
        self.extra = initdata.accounts[self.market.base_currency].balance
        console.log(self.buyList)
        console.log(initdata)
      })
    }
  }
}
</script>
<style scoped lang="scss">
  @import './trades.scss'
</style>
