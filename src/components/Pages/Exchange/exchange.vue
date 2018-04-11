<template>
  <section id="exchange">
    <header class="clearfix">
      <router-link class="logo" to="/">
        <img src="@/common/svg/logo.svg">
      </router-link>
      <lastPrice :market="market"></lastPrice>
      <div class="header_rt">
        <account :totalAssets='total_assets' :accounts='accounts'></account>
        <setting :loginData='loginData'></setting>
        <language></language>
      </div>
    </header>

    <section class="content">
      <div class="top_content clearfix">
        <div class="market w240">
          <marketList :markets="markets"></marketList>
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
        <myOrder :myOrders='my_orders'></myOrder>
      </div>
    </section>
    <section class="list">
      <div class="list_lt w240">
        <div class="list_box trades">
          <trades :depthData='depth_data' :market='market'></trades>
        </div>
        <div class="order buy">
          <order :market='market' :type='"buy"'></order>
        </div>
      </div>
      <div class="list_rt w240">
        <div class="list_box history">
          <allOrder :tradesData="tradesData"></allOrder>
        </div>
        <div class="order sell">
          <order :market='market' :type='"sell"'></order>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

import lastPrice from './lastPrice/lastPrice'
import language from './language/language'
import setting from './setting/setting'
import account from './account/account'
import marketList from './marketList/marketList'
import chart from './chart/chart'
import orderBook from './orderBook/orderBook'
import trades from './trades/trades'
import order from './order/order'
import allOrder from './allOrder/allOrder'
import myOrder from './myOrder/myOrder'

export default {
  name: 'ExChange',
  data () {
    return {
      curMarket: '',
      lastPriceData: {},
      tradesData: [],
      market: {},
      markets: {},
      loginName: '',
      accounts: {},
      total_assets: {},
      my_orders: [],
      depth_data: []
    }
  },
  components: {
    lastPrice,
    language,
    setting,
    account,
    marketList,
    chart,
    orderBook,
    trades,
    order,
    allOrder,
    myOrder
  },
  created () {
    this.curMarket = this.$route.params.id
    this.init()
  },
  watch: {
    '$route' (to, from) {
      this.curMarket = to.params.id
      this.init()
    },
    loginData (val) {
      this.loginName = val.show_name
    }
  },
  computed: {
    ...mapGetters(['loginData'])
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
        // ticker: this.lastPriceData,
        trades: this.tradesData,
        market: this.market,
        markets: this.markets,
        accounts: this.accounts,
        total_assets: this.total_assets,
        my_orders: this.my_orders,
        depth_data: this.depth_data
      } = res.data)
    }
  }
}
</script>
<style lang="scss">
  @import './exchange.scss'
</style>
