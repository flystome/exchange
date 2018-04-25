<template>
  <section id="exchange">
    <header class="clearfix">
      <router-link class="logo" to="/">
        <img src="@/common/svg/logo.svg">
      </router-link>
      <lastPrice :market="market"></lastPrice>
      <div class="header_rt">
        <account :totalAssets='total_assets' :accounts='accounts' :market='market'></account>
        <setting :loginData='loginData' @controlSound='controlSound'></setting>
        <language></language>
      </div>
    </header>

    <section class="content">
      <div class="top_content clearfix">
        <div class="market w240">
          <marketList :markets="markets" @reFreshFav='reFreshFav'></marketList>
        </div>
        <div class="chart">
          <chart></chart>
        </div>
      </div>
      <div class="my_order">
        <audio id="order_cancel" src="/static/media/cancel.mp3"></audio>
        <myOrder :myOrders='my_orders' :market="market" @getMyOrder='getMyOrder'></myOrder>
      </div>
    </section>
    <section class="list">
      <audio id="order_audio" src="/static/media/order.mp3"></audio>
      <audio id="order_ok" src="/static/media/settle.mp3"></audio>
      <div class="list_lt w240">
        <div class="list_box trades">
          <trades :depthData='depth_data' :market='market'></trades>
        </div>
        <div class="order buy">
          <order :market='market' :type='"buy"' :accounts='accounts' @play='play'></order>
        </div>
      </div>
      <div class="list_rt w240">
        <div class="list_box history">
          <allOrder :tradesData="all_trades" :market='market'></allOrder>
        </div>
        <div class="order sell">
          <order :market='market' :type='"sell"' :accounts='accounts' @play='play'></order>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import pusher from '@/common/js/pusher'
import 'vue2-scrollbar/dist/style/vue2-scrollbar.css'

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
      all_trades: [],
      market: {},
      markets: {},
      loginName: '',
      accounts: {},
      total_assets: {},
      my_orders: [[], [], []],
      depth_data: [],
      sn: '',
      my_trades: [],
      version: 0,
      soundAllow: true
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
        my_trades: this.my_trades,
        trades: this.all_trades,
        market: this.market,
        markets: this.markets,
        accounts: this.accounts,
        total_assets: this.total_assets,
        depth_data: this.depth_data
      } = res.data)
      this.$set(this.my_orders, 0, res.data.my_orders.reverse())
      this.marketRefresh()
      this.globalRefresh()
      this.version = this.depth_data.version
      this.initMine()
      document.title = `${this.market.quote_currency.toUpperCase()}/${this.market.base_currency.toUpperCase()} - ${this.$t('brand')}`
    },
    initMine () {
      this.initTrend()
      this.my_trades.map((ele1) => {
        this.all_trades.map((ele2, i) => {
          if (ele1.id === ele2.tid) {
            ele2.isMine = true
            this.$set(this.all_trades, i, ele2)
          }
        })
      })
    },
    initTrend () {
      this.all_trades.map((ele, i, arr) => {
        var len = arr.length
        if (i === len - 1) {
          ele.trend = 'up'
        } else {
          if (+ele.price >= +arr[i + 1]['price']) {
            ele.trend = 'up'
          } else {
            ele.trend = 'down'
          }
        }
      })
    },
    getMyOrder (index, days) {
      var self = this
      var time = ''
      if (days) {
        var date = new Date()
        time = Math.floor(date.getTime() / 1000) - 3600 * 24 * days
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
      var self = this
      var market = pusher.subscribe('market-' + this.market.code + '-global')
      var lost = {
        asks: [],
        bids: [],
        U: 0
      }
      market.bind('depthUpdate', (res) => {
        if (res.U <= this.version + 1 && res.u >= this.version + 1) {
          var asks = this.addOrderList(res.asks, this.depth_data.asks)
          var bids = this.addOrderList(res.bids, this.depth_data.bids)
          this.version = res.u
          this.depth_data = Object.assign({}, this.depth_data, {'asks': asks.reverse(), 'bids': bids})
        } else if (res.U > this.version + 1) {
          this.addOrderList(res.asks, lost.asks)
          this.addOrderList(res.bids, lost.bids)
          if (lost.U === 0) lost.U = res.U
          lost.u = Math.max(lost.u, res.u)
          this._get({
            url: '/markets/' + self.market.code + '/get_depth_data.json'
          }, function (res) {
            var data = res.data.success.depth_data
            var asks = self.addOrderList(lost.asks, data.asks)
            var bids = self.addOrderList(lost.bids, data.bids)
            self.version = data.version
            self.depth_data = Object.assign({}, self.depth_data, {'asks': asks.reverse(), 'bids': bids})
            lost = {
              asks: [],
              bids: [],
              U: 0
            }
          })
        }
      })
      market.bind('trade', (res) => {
        this.isMine(res.trade, 'trades')
        if (res.trade.price >= this.all_trades[0].price) {
          res.trade.trend = 'up'
        } else {
          res.trade.trend = 'down'
        }
        this.all_trades.unshift(res.trade)
      })
    },
    addOrderList (origin, target) {
      if (origin && origin.length !== 0) {
        origin.map((ele1) => {
          var b = target.some((ele2) => ele1[0] === ele2[0])
          if (b) {
            target.map((ele3) => {
              if (ele1[0] === ele3[0]) {
                ele3[1] = ele1[1]
              }
            })
          } else {
            target.push(ele1)
          }
        })
        target = this.clearZero(target)
        target.sort((a, b) => b[0] - a[0])
      } else {
        if (target.length !== 0) {
          target = this.clearZero(target)
        }
        target.sort((a, b) => b[0] - a[0])
      }
      return target
    },
    clearZero (arr) {
      var len = arr.length
      var arr0 = []
      for (let i = 0; i < len; i++) {
        if (+arr[i][1] !== 0) {
          arr0.push(arr[i])
        }
      }
      return arr0
    },
    privateRefresh (sn) {
      var privateAccount = pusher.subscribe('private-' + sn)
      privateAccount.bind('order', (data) => {
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
          this.play('order_cancel')
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
      privateAccount.bind('trade', (res) => {
        this.my_trades.unshift(res)
        this.play('order_ok')
        this.isMine(res, 'trade')
      })
      privateAccount.bind('account', (res) => {
        this.accounts[res.currency].balance = res.balance
        this.accounts[res.currency].locked = res.locked
        this.accounts = Object.assign({}, this.accounts)
      })
    },
    isMine (data, from) {
      if (from === 'trade') {
        this.all_trades.map((ele, i) => {
          if (data.id === ele.tid) {
            ele.isMine = true
            this.$set(this.all_trades, i, ele)
          }
        })
      } else if (from === 'trades') {
        this.my_trades.map((ele) => {
          if (data.tid === ele.id) {
            data.isMine = true
          }
        })
      }
    },
    controlSound (bool) {
      this.soundAllow = bool
    },
    play (id) {
      if (this.soundAllow) {
        var order = document.getElementById(id)
        order.play()
      }
    },
    reFreshFav (quote, base, bool) {
      var market = '' + quote + base
      var self = this
      if (bool) {
        this._delete({
          url: '/portfolios/' + market + '.json'
        }, function (xhr) {
          if (xhr.status === 200) {
            self.markets[market]['is_portfolios'] = false
            self.markets = Object.assign({}, self.markets)
          }
        })
      } else {
        this._post({
          url: '/portfolios.json',
          data: {
            market: market
          }
        }, function (xhr) {
          if (xhr.status === 200) {
            self.markets[market]['is_portfolios'] = true
            self.markets = Object.assign({}, self.markets)
          }
        })
      }
    }
  }
}
</script>
<style lang="scss">
  @import './exchange.scss'
</style>
