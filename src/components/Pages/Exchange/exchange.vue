<template>
  <section id="exchange">
    <header class="clearfix">
      <a class="logo" href="/">
        <img src="@/common/svg/logo.svg">
      </a>
      <lastPrice :market="market"></lastPrice>
      <div class="header_rt">
        <account v-if='loginData !== "none"' :totalAssets='TotalAssets' :accounts='accounts' :market='market'></account>
        <div v-if='loginData === "none"' class="loginTip">
          <p>{{$t('exchange.unlogin.please')}}<a :href="`${HOST_URL}/signin?from=${location}`">{{$t('exchange.unlogin.login')}}</a>{{$t('exchange.unlogin.or')}}<a :href="`${HOST_URL}/signup?from=${location}`">{{$t('exchange.unlogin.register')}}</a>{{$t('exchange.unlogin.operate')}}</p>
        </div>
        <setting v-if='loginData !== "none"' :loginData='loginData'
          @controlSound='controlSound'
          @notification='notification'>
        </setting>
        <div class="person_info" v-if='loginData !== "none"'>
          <a :href="`${ROUTER_VERSION}/form/news`" :class="{'unread': loginData.has_unread_conversations}"><i></i></a>
        </div>
        <language></language>
      </div>
    </header>

    <section class="content">
      <div class="top_content clearfix">
        <div class="market w240" :class="{'move-left': moveToLeft1, 'move-zero': moveToRight1}">
          <marketList :markets="markets" @reFreshFav='reFreshFav' @moveLeft='moveLeft' :loginData='loginData'></marketList>
        </div>
        <div class="chart" :class="{'move-right': moveToLeft2, 'move-zero': moveToRight2}">
          <chart :market="market" :depthData='depth_data'></chart>
        </div>
      </div>
      <div class="my_order">
        <audio id="order_cancel" src="/static/media/cancel.mp3"></audio>
        <myOrder :myOrders='my_orders' :market="market" :markets='markets' @getMyOrder='getMyOrder' :loginData='loginData'></myOrder>
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
          <order :market='market' :type='"buy"' :accounts='accounts' @play='play' :loginData='loginData'></order>
        </div>
      </div>
      <div class="list_rt w240">
        <div class="list_box history">
          <allOrder :tradesData="all_trades" :market='market'></allOrder>
        </div>
        <div class="order sell">
          <order :market='market' :type='"sell"' :accounts='accounts' @play='play' :loginData='loginData'></order>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
/* eslint-disable no-new */
import { mapGetters, mapState } from 'vuex'
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
const _debounce = require('lodash.debounce')

export default {
  name: 'ExChange',
  data () {
    return {
      HOST_URL: process.env.HOST_URL,
      location: location.href,
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      curMarket: '',
      lastPriceData: {},
      all_trades: [],
      market: {},
      markets: {},
      loginName: '',
      total_assets: {},
      my_orders: [[], [], []],
      depth_data: [],
      sn: '',
      my_trades: [],
      version: 0,
      soundAllow: true,
      noticeAllow: true,
      TotalAssets: 0,
      accounts: {},
      moveToLeft1: false,
      moveToLeft2: false,
      moveToRight1: false,
      moveToRight2: false
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
    ...mapGetters(['loginData']),
    ...mapState(['marketData'])
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
      ({
        my_trades: this.my_trades,
        trades: this.all_trades,
        market: this.market,
        markets: this.markets,
        accounts: this.accounts,
        depth_data: this.depth_data,
        total_assets: this.total_assets
      } = res.data)
      res.data.my_orders && res.data.my_orders.length !== 0 && this.$set(this.my_orders, 0, res.data.my_orders.reverse())
      this.TotalAssets = this.total_assets && (+this.total_assets.btc_worth).toFixed(8)
      this.marketRefresh()
      this.globalRefresh()
      this.version = this.depth_data && this.depth_data.version
      this.initMine()
      document.title = `${this.market.last} ${this.market.quote_currency.toUpperCase()}/${this.market.base_currency.toUpperCase()} - ${this.$t('brand')}`
    },
    initMine () {
      this.initTrend()
      if (this.my_trades) {
        this.my_trades.map((ele1) => {
          this.all_trades.map((ele2, i) => {
            if (ele1.id === ele2.tid) {
              ele2.isMine = true
              this.$set(this.all_trades, i, ele2)
            }
          })
        })
      }
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
      channel.bind('tickers', _debounce((data) => {
        if (this.$store.state.marketData) {
          var BtcMarket = this.$store.state.marketData['btc'].reduce((a, b) => {
            return a.concat(Object.keys(b)[0])
          }, [])
        }
        Object.keys(data).forEach((key) => {
          if (this.$store.state.assets !== '') {
            if (data[key].base_currency === 'usdt') {
              if (key === 'btcusdt') {
                this.$store.state.assets['usdt'].price = 1 / Number(data[key].last)
              }
              return
            }
            if (data[key].base_currency === 'btc') {
              this.$store.state.assets[data[key].quote_currency].price = data[key].last
              return
            }
            if (data[key].base_currency === 'eth') {
              if (!BtcMarket.includes(`${data[key].quote_currency}/btc`)) {
                this.$store.state.assets[data[key].quote_currency].price = data[key].last * this.$store.state.assets['eth'].price
              }
            }
          }
        })
      }, 5000))

      channel.bind('tickers', (data) => {
        if (JSON.stringify(data) !== '{}') {
          for (let key in data) {
            // var fav = this.markets[key]['is_portfolios']
            this.markets[key] = data[key]
            this.markets = Object.assign({}, this.markets)
            // this.setPrice(key, data)
            // this.markets = Object.assign({}, this.markets, {'is_portfolios': fav})
            if (key === this.market.code) {
              this.market = Object.assign({}, data[key], {'code': key})
            }
          }
        }
        this.accountsTotal()
      })
    },
    accountsTotal () {
      var total = 0
      var markets = this.markets
      var accounts = this.accounts
      for (let key in accounts) {
        var val = accounts[key]
        if (key === 'usdt') {
          total += (+val.balance + +val.locked) / +markets['btcusdt'].last
        } else if (key === 'btc') {
          total += (+val.balance + +val.locked)
        } else {
          if (markets[key + 'btc']) {
            total += +markets[key + 'btc'].last * (+val.balance + +val.locked)
          } else if (markets[key + 'eth']) {
            total += +markets[key + 'eth'].last * +markets.ethbtc.last * (+val.balance + +val.locked)
          } else if (markets[key + 'usdt']) {
            total += +markets[key + 'usdt'].last * +markets.btcusdt.last * (+val.balance + +val.locked)
          } else {
            console.log('Cant get this Coin')
          }
        }
      }
      this.TotalAssets = total.toFixed(8)
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
        if (this.all_trades.length === 0) {
          res.trade.trend = 'up'
        } else {
          if (res.trade.price >= (this.all_trades[0].price || 0)) {
            res.trade.trend = 'up'
          } else {
            res.trade.trend = 'down'
          }
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
          this.showNotice(data.price, data.origin_volume - data.volume)
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
        this.$store.state.assets[res.currency].balance = Number(res.balance)
        this.$store.state.assets[res.currency].locked = Number(res.locked)
        this.accounts = Object.assign({}, this.accounts)
        this.accountsTotal()
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
        if (this.my_trades) {
          this.my_trades.map((ele) => {
            if (data.tid === ele.id) {
              data.isMine = true
            }
          })
        }
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
    },
    moveLeft (bool) {
      if (bool) {
        this.moveToLeft1 = true
        this.moveToLeft2 = false
        this.moveToRight1 = false
        this.moveToRight2 = true
      } else {
        this.moveToLeft1 = false
        this.moveToLeft2 = true
        this.moveToRight1 = true
        this.moveToRight2 = false
      }
    },
    notification (bool) {
      this.noticeAllow = bool
    },
    showNotice (price, volume) {
      if (!this.noticeAllow) return
      Notification.requestPermission((permit) => {
        if (permit === 'granted') {
          new Notification('Trade', {
            dir: 'auto',
            icon: '../../../../static/img/notification2.png',
            body: `Price: ${price}\nVoluume: ${volume}`,
            tag: 'trade',
            renotify: true
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
  @import './exchange.scss'
</style>
