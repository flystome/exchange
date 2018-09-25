<template>
  <section id="exchange" @click="clearStatus">
    <header class="clearfix">
      <router-link to="/" class="logo">
        <img src="@/common/svg/logo.svg">
      </router-link>
      <lastPrice :market="market"></lastPrice>
      <div class="header_rt">
        <account v-if='loginData !== "none"' :totalAssets='TotalAssets' :accounts='accounts' :market='market'></account>
        <div v-if='loginData === "none"' class="loginTip">
          <p>{{$t('exchange.unlogin.please')}}<a :href="`${ROUTER_VERSION}/login?from=${ROUTER_VERSION}/exchange/${curMarket}`">{{$t('exchange.unlogin.login')}}</a>{{$t('exchange.unlogin.or')}}<a :href="`${ROUTER_VERSION}/register?from=${ROUTER_VERSION}/exchange/${curMarket}`">{{$t('exchange.unlogin.register')}}</a>{{$t('exchange.unlogin.operate')}}</p>
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
        <myOrder :myOrders='my_orders' :market="market" :markets='markets' @getMyOrder='getMyOrder' :loginData='loginData' :curMarket='curMarket'></myOrder>
      </div>
      <div class="list clearfix" :class="{'logined': loginData !== 'none'}">
        <audio id="order_audio" src="/static/media/order.mp3"></audio>
        <audio id="order_ok" src="/static/media/settle.mp3"></audio>
        <div class="w240">
          <div class="list_box trades">
            <trades :depthData='depth_data' :market='market'></trades>
          </div>
          <!-- <div class="order buy">
            <order :market='market' :type='"buy"' :accounts='accounts' @play='play' :loginData='loginData'
            :curMarket='curMarket'></order>
          </div> -->
        </div>
        <div class="order_box clearfix">
          <h3>{{$t('exchange.tradeH')}}</h3>
          <div class="box">
            <div class="order buy fl">
              <order :market='market' :type='"buy"' :accounts='accounts' @play='play' :loginData='loginData'
              :curMarket='curMarket'></order>
            </div>
            <div class="order sell fr">
              <order :market='market' :type='"sell"' :accounts='accounts' @play='play' :loginData='loginData'
              :curMarket='curMarket'></order>
            </div>
          </div>
        </div>
        <div class="w240">
          <div class="list_box history">
            <allOrder :tradesData="all_trades" :market='market'></allOrder>
          </div>
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
import trades from './trades/trades'
import order from './order/order'
import allOrder from './allOrder/allOrder'
import myOrder from './myOrder/myOrder'
// const _debounce = require('lodash.debounce')

export default {
  name: 'ExChange',
  data () {
    return {
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
      my_orders_cache: [[], [], []],
      depth_data: [],
      sn: '',
      // my_trades: [],
      version: 0,
      soundAllow: true,
      noticeAllow: true,
      TotalAssets: 0,
      accounts: {},
      moveToLeft1: false,
      moveToLeft2: false,
      moveToRight1: false,
      moveToRight2: false,
      platform_coin: {}
    }
  },
  components: {
    lastPrice,
    language,
    setting,
    account,
    marketList,
    chart,
    trades,
    order,
    allOrder,
    myOrder
  },
  created () {
    this.curMarket = this.$route.params.id
    this.init()
    if (this.loginData && this.loginData.sn) {
      this.platform_coin = this.loginData.platform_coin
      this.privateRefresh(this.loginData.sn)
    }
  },
  watch: {
    '$route' (to, from) {
      this.curMarket = to.params.id
      if (from.params.id) {
        this.unBindChannel(from.params.id)
      }
      this.init()
    },
    loginData (val) {
      this.loginName = val.show_name
      this.platform_coin = val.platform_coin
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
        // my_trades: this.my_trades,
        trades: this.all_trades,
        market: this.market,
        markets: this.markets,
        accounts: this.accounts,
        depth_data: this.depth_data,
        total_assets: this.total_assets
      } = res.data)
      res.data.my_orders && res.data.my_orders.length !== 0 && this.$set(this.my_orders, 0, res.data.my_orders.reverse())
      this.TotalAssets = this.total_assets && (+this.total_assets.btc_worth).toFixed(8)
      this.version = this.depth_data && this.depth_data.version
      // this.all_trades_cache = JSON.parse(JSON.stringify(this.all_trades))
      this.my_orders_cache = JSON.parse(JSON.stringify(this.my_orders))
      this.initTrend()
      this.marketRefresh()
      this.globalRefresh()
      // this.initMine()
      document.title = `${this.market.last} ${this.market.quote_currency.toUpperCase()}/${this.market.base_currency.toUpperCase()} - ${this.$t('brand')}`
      this.interval()
    },
    interval () {
      var timer = null
      clearInterval(timer)
      timer = setInterval(() => {
        // this.all_trades = JSON.parse(JSON.stringify(this.all_trades_cache))
        // this.initTrend()
        this.my_orders = JSON.parse(JSON.stringify(this.my_orders_cache))
      }, 1000)
    },
    // initMine () {
    //   this.initTrend()
    //   if (this.my_trades) {
    //     this.my_trades.map((ele1) => {
    //       this.all_trades.map((ele2, i) => {
    //         if (ele1.id === ele2.tid) {
    //           ele2.isMine = true
    //           this.$set(this.all_trades, i, ele2)
    //         }
    //       })
    //     })
    //   }
    // },
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
      this.all_trades = this.all_trades.slice()
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
            self.$set(self.my_orders_cache, 1, res.data.orders)
          }
        })
      } else if (index === 2) {
        this._get({
          url: '/history/all_trades.json',
          data: {since_date: time}
        }, function (res) {
          if (res.status === 200) {
            self.$set(self.my_orders, 2, res.data.trades)
            self.$set(self.my_orders_cache, 2, res.data.trades)
          }
        })
      }
    },
    globalRefresh () {
      var channel = pusher.subscribe('market-global')
      channel.bind('tickers', (data) => {
        if (JSON.stringify(data) !== '{}') {
          var arr = Object.keys(this.markets)
          for (let key in data) {
            if (arr.includes(key)) {
              this.markets[key] = data[key]
              this.markets = Object.assign({}, this.markets)
            }
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
    unBindChannel (code) {
      pusher.unsubscribe('market-' + code + '-global')
    },
    marketRefresh () {
      var self = this
      var market = pusher.subscribe('market-' + this.market.code + '-global')
      var lost = {
        asks: [],
        bids: [],
        U: 0
      }
      var flag = true
      market.bind('depthUpdate', (res) => {
        var asks = this.addOrderList(res.asks, this.depth_data.asks)
        var bids = this.addOrderList(res.bids, this.depth_data.bids)
        this.version = res.u
        this.depth_data = Object.assign({}, this.depth_data, {'asks': asks.reverse(), 'bids': bids})
        if (res.U > this.version + 1) {
          this.addOrderList(res.asks, lost.asks)
          this.addOrderList(res.bids, lost.bids)
          if (lost.U === 0) lost.U = res.U
          lost.u = Math.max(lost.u, res.u)
          if (flag) {
            flag = false
            this._get({
              url: '/markets/' + self.market.code + '/get_depth_data.json'
            }, function (res) {
              var data = res.data.success.depth_data
              var res_asks = self.addOrderList(lost.asks, data.asks)
              var res_bids = self.addOrderList(lost.bids, data.bids)
              self.version = data.version
              self.depth_data = Object.assign({}, self.depth_data, {'asks': res_asks.reverse(), 'bids': res_bids})
              lost = {
                asks: [],
                bids: [],
                U: 0
              }
              flag = true
            })
          }
        }
      })
      market.bind('trade', (res) => {
        // this.isMine(res.trade, 'trades')
        if (this.all_trades.length === 0) {
          res.trade.trend = 'up'
        } else {
          if (res.trade.price >= (this.all_trades[0].price || 0)) {
            res.trade.trend = 'up'
          } else {
            res.trade.trend = 'down'
          }
        }
        // console.log(this.all_trades)
        this.all_trades.unshift(res.trade)
        var len = this.all_trades.length
        // this.all_trades_cache.unshift(res.trade)
        // var len = this.all_trades_cache.length
        if (len >= 150) {
          this.all_trades.pop()
          // this.all_trades_cache.pop()
        }
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
          var arr = this.my_orders_cache[0].map(function (ele) {
            return ele.id
          })
          var index = arr.indexOf(data.id)
          if (index !== -1) {
            this.$set(this.my_orders_cache[0], index, data)
          } else {
            this.my_orders_cache[0].unshift(data)
          }
        } else if (data.state === 'cancel') {
          this.play('order_cancel')
          this.my_orders_cache[0].map(function (ele, i, arr) {
            if (ele.id === data.id) {
              arr.splice(i, 1)
            }
          })
          this.my_orders_cache[1].unshift(data)
        } else if (data.state === 'done') {
          // this.showNotice(data.price, data.origin_volume - data.volume)
          this.my_orders_cache[0].map(function (ele, i, arr) {
            if (ele.id === data.id) {
              arr.splice(i, 1)
            }
          })
          this.my_orders_cache[1].unshift(data)
        }
        this.my_orders_cache.map((ele, i) => {
          var len = ele.length
          if (len > 30 && i !== 0) {
            ele.splice(30, len - 30)
          }
        })
      })
      privateAccount.bind('trade', (res) => {
        // this.my_trades.unshift(res)
        this.play('order_ok')
        res.state = 'done'
        res.origin_volume = res.volume
        console.log(res, res.origin_volume - res.volume)
        this.showNotice(res.price, res.volume)
        this.my_orders_cache[2].unshift(res)
        // this.isMine(res, 'trade')
      })
      privateAccount.bind('account', (res) => {
        if (!this.$store.state.assets[res.currency]) return
        this.accounts[res.currency].balance = res.balance
        this.accounts[res.currency].locked = res.locked
        this.$store.state.assets[res.currency].balance = Number(res.balance)
        this.$store.state.assets[res.currency].locked = Number(res.locked)
        this.accounts = Object.assign({}, this.accounts)
        this.accountsTotal()
      })
    },
    // isMine (data, from) {
    //   if (from === 'trade') {
    //     this.all_trades.map((ele, i) => {
    //       if (data.id === ele.tid) {
    //         ele.isMine = true
    //         this.$set(this.all_trades, i, ele)
    //       }
    //     })
    //   } else if (from === 'trades') {
    //     if (this.my_trades) {
    //       this.my_trades.map((ele) => {
    //         if (data.tid === ele.id) {
    //           data.isMine = true
    //         }
    //       })
    //     }
    //   }
    // },
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
      if (!this.noticeAllow) return null
      Notification.requestPermission((permit) => {
        if (permit === 'granted') {
          new Notification(`${this.$t('global.ordered')}`, {
            dir: 'auto',
            icon: '../../../../static/img/notification1.png',
            body: `${this.$t('markets.newPrice')}: ${price}\n${this.$t('markets.amount')}: ${volume}`,
            tag: 'trade',
            renotify: true
          })
        }
      })
    },
    clearStatus () {

    }
  }
}
</script>

<style lang="scss" scoped>
  @import './exchange.scss';
</style>
