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
        <myOrder :myOrders='my_orders' :market="market" @getMyOrder='getMyOrder'></myOrder>
      </div>
    </section>
    <section class="list">
      <div class="list_lt w240">
        <div class="list_box trades">
          <trades :depthData='depth_data' :market='market'></trades>
        </div>
        <div class="order buy">
          <order :market='market' :type='"buy"' :accounts='accounts'></order>
        </div>
      </div>
      <div class="list_rt w240">
        <div class="list_box history">
          <allOrder :tradesData="tradesData"></allOrder>
        </div>
        <div class="order sell">
          <order :market='market' :type='"sell"' :accounts='accounts'></order>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import pusher from '@/common/js/pusher'

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
      my_orders: [[], [], []],
      depth_data: [],
      sn: ''
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
    if (this.loginData && this.loginData.sn) {
      this.privateRefresh(this.loginData.sn)
    }
  },
  watch: {
    '$route' (to, from) {
      this.curMarket = to.params.id
      this.init()
    },
    loginData (val) {
      this.loginName = val.show_name
      this.sn = val.sn
      this.privateRefresh(this.sn)
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
        depth_data: this.depth_data
      } = res.data)
      this.$set(this.my_orders, 0, res.data.my_orders.reverse())
      this.marketRefresh()
      this.globalRefresh()
    },
    getMyOrder (index, days) {
      var self = this
      var time = ''
      if (days) {
        var date = new Date()
        time = Math.floor(date.getTime()/1000) - 3600 * 24 * days
      }
      if (index === 1) {
        this._get({
          url: '/history/all_orders.json',
          data: {since_date: time}
        }, function (res) {
          if (res.status === 200) {
            self.$set(self.my_orders, 1, res.data.orders)
          }
        })
      } else if (index === 2) {
        this._get({
          url: '/history/all_trades.json',
          data: {since_date: time}
        }, function (res) {
          if (res.status === 200) {
            self.$set(self.my_orders, 2, res.data.trades)
          }
        })
      }
    },
    globalRefresh () {
      var channel = pusher.subscribe('market-global')
      channel.bind('tickers', (data) => {
        if (JSON.stringify(data) !== '{}') {
          for (let key in data) {
            var fav = this.markets[key]['is_portfolios']
            this.markets[key] = data[key]
            this.markets = Object.assign({}, this.markets, {'is_portfolios': fav})
            if (key === this.market.code) {
              this.market = Object.assign({}, data[key], {'code': key})
            }
          }
        }
      })
    },
    marketRefresh () {
      var market = pusher.subscribe('market-' + this.market.code + '-global')
      market.bind('update', (data) => {

      })
    },
    privateRefresh (sn) {
      var privateAccount = pusher.subscribe('private-' + sn)
      privateAccount.bind('order', (data) => {
        console.log(data)
        if (data.state === 'wait') {
          var arr = this.my_orders[0].map(function (ele) {
            return ele.id
          })
          var index = arr.indexOf(data.id)
          if (index !== -1) {
            this.$set(this.my_orders[0], index, data)
          } else {
            this.my_orders[0].unshift(data)
          }
        } else if (data.state === 'cancel') {
          this.my_orders[0].map(function (ele, i, arr) {
            if (ele.id === data.id) {
              arr.splice(i, 1)
            }
          })
          this.my_orders[1].unshift(data)
        } else if (data.state === 'done') {
          this.my_orders[0].map(function (ele, i, arr) {
            if (ele.id === data.id) {
              arr.splice(i, 1)
            }
          })
          this.my_orders[1].unshift(data)
          this.my_orders[2].unshift(data)
        }
      })
    }
  }
}
</script>
<style lang="scss">
  @import './exchange.scss'
</style>
