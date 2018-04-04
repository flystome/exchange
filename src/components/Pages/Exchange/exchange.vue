<template>
  <section id="exchange">
    <header class="clearfix">
      <router-link class="logo" to="/">
        <img src="@/common/svg/logo.svg">
      </router-link>
      <lastPrice :lastPriceData="lastPriceData"></lastPrice>
      <!-- <account></account> -->
    </header>

    <section class="content">
      <div class="top_content clearfix">
        <div class="market w240">
          <marketList></marketList>
        </div>
        <div class="chart">
          <ul class="chart_hd">

          </ul>
          <div class="chart_bd">
            <div class="candle" id="candle">

            </div>
            <div class="depth">

            </div>
          </div>
        </div>
      </div>
      <div class="my_order">

      </div>
    </section>
    <section class="list">
      <div class="list_lt w240">
        <div class="list_box"></div>
        <div class="order "></div>
      </div>
      <div class="list_rt w240">
        <div class="list_box buy"></div>
        <div class="order sell"></div>
      </div>
    </section>
  </section>
</template>

<script>
import lastPrice from './lastPrice/lastPrice'
import marketList from './marketList/marketList'
import chart from './chart/chart'
import orderBook from './orderBook/orderBook'
import trades from './trades/trades'
import order from './order/order'
import allOrder from './allOrder/allOrder'

export default {
  name: 'ExChange',
  data () {
    return {
      curMarket: '',
      lastPriceData: {},
      tradesData: []
    }
  },
  components: {
    lastPrice,
    marketList,
    chart,
    orderBook,
    trades,
    order,
    allOrder
  },
  created () {
    this.curMarket = this.$route.params.id
    this.init()
  },
  watch: {
    '$route' (to, from) {
      this.curMarket = to.params.id
      this.init()
    }
  },
  methods: {
    init () {
      this.initData()
    },
    initData () {
      var self = this
      this._get({
        url: '/markets/' + self.curMarket + '.json',
        data: {}
      }, self.handleGlobal)
    },
    handleGlobal (res) {
      console.log(res.data);
      ({
        ticker: this.lastPriceData,
        trades: this.tradesData
      } = res.data)
    }
  }
}
</script>
<style lang="scss">
  @import './exchange.scss'
</style>
