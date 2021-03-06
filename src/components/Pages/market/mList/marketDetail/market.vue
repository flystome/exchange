<template>
  <div class="market_detail">
    <ul class="market_hd clearfix">
      <li v-for="(hd,index) in hds" :key='hd' :class="{'check': currencyindex == index}" @click="goPath(index)">{{$t(hd)}}</li>
    </ul>
    <vue-simple-spinner v-if='loading' size="66" class="loading"></vue-simple-spinner>
    <div class="detail">
      <div class="detail_top">
        <div class="add_favorite">
          <div class="favorite" :class = "{'favorited': favorite == true}" @click='addFavorite()'>
            <i class="fa fa-star"></i>
            {{$t("markets.favorite")}}
          </div>
        </div>
        <div class="coin_detail">
          <router-link class="cur_market" :to="{path: ROUTER_VERSION + '/markets'}">
            <span>{{(market.quote_currency+'/'+market.base_currency) | upper}}</span>
            <i class="caret"></i>
          </router-link>
          <div>
            <span class="price">{{ticker.last | fixedNum(market.price_fixed)}}</span>
            <span class="vol">${{ticker.legal_worth | fixedNum(market.price_fixed)}}</span>
          </div>
        </div>
      </div>
      <div class="detail_bottom clearfix">
        <div class="detail_lt">
          <p>
            <span class="change" :class="{'text-down': ticker.percent < 0,'text-up': ticker.percent > 0}">{{(ticker.last - ticker.open) | fixedNum(market.price_fixed)}}</span>
            <span class="percent" :class="{'text-down': ticker.percent < 0,'text-up': ticker.percent > 0}">{{ticker.percent | fixed2}}%</span>
          </p>
          <p>
            <span class="name">{{$t("markets.volume24")}}</span>
            <span class="volume">{{ticker.volume | fixedNum(market.volume_fixed)}} {{market.base_currency | upper}}</span>
          </p>
        </div>
        <div class="detail_rt">
          <p>
            <span class="name">{{$t("markets.high")}}</span>
            <span class="volume">{{ticker.high | fixedNum(market.price_fixed)}}</span>
          </p>
          <p>
            <span class="name">{{$t("markets.low")}}</span>
            <span class="volume">{{ticker.low | fixedNum(market.price_fixed)}}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="graph">
    </div>
    <div class="new_order">
      <h2>{{$t("markets.history")}}</h2>
      <ul class="order_hd">
        <li v-for="head in heads" :key="head">{{$t(head)}}</li>
      </ul>
      <ul class="order_list">
        <li v-for="item in trades" :key="item.tid">
          <div class="order_price" :class="{'text-up': item.type === 'buy', 'text-down': item.type === 'sell'}">{{item.price | fixedNum(market.price_fixed)}}</div>
          <div class="order_amount">{{item.amount | fixedNum(market.volume_fixed)}}</div>
          <div class="order_time">{{+item.date*1000 | dayTime}}</div>
        </li>
      </ul>
    </div>
    <div class="trade">
      <div class="btn">
        <router-link class="bid" :to="{path: ROUTER_VERSION + '/markets/' + curmarket + '/trades#buy'}">{{$t("markets.buy")}}</router-link>
      </div>
      <div class="btn">
        <router-link class="ask" :to="{path: ROUTER_VERSION + '/markets/' + curmarket + '/trades#sell'}">{{$t("markets.sell")}}</router-link>
      </div>
    </div>
  </div>
</template>
<script>
import pusher from '@/common/js/pusher'

export default {
  name: 'market-detail',
  data () {
    return {
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      currencyindex: 0,
      hds: ['markets.quotes', 'markets.trade', 'markets.pending'],
      heads: ['markets.price', 'markets.amount', 'markets.time'],
      curmarket: '',
      market: {},
      ticker: {},
      trades: [],
      logined: false,
      loading: true,
      favorite: false,
      localList: null
    }
  },
  mounted: function () {
    this.init()
  },
  watch: {
    '$route' (to, from) {
      if (to.path === '/markets') {
        return
      }
      this.init()
    }
  },
  methods: {
    init: function () {
      this.curmarket = this.$route.params.id
      this.fetchData(this.curmarket)
      this.getPusher()
      this.reload()
    },
    getLocal: function () {
      this.localList = localStorage.getItem('markets')
      if (this.localList && this.localList.length !== 0) {
        if (this.localList.split(',').indexOf(this.curmarket) !== -1) {
          this.favorite = true
        } else {
          this.favorite = false
        }
      }
    },
    getPusher: function () {
      var market = pusher.subscribe('market-' + this.curmarket + '-global')
      market.bind('trades', (data) => {
        if (this.trades.length > 15) {
          this.trades.pop()
        }
        this.trades.unshift(data['trades'][0])
      })
      var channel = pusher.subscribe('market-global')
      channel.bind('tickers', (data) => {
        if (JSON.stringify(data) !== '{}') {
          for (var key in data) {
            if (key === this.curmarket) {
              this.ticker.last = data[key].last
              this.ticker.legal_worth = data[key].legal_worth
              this.ticker.percent = data[key].percent
              this.ticker.volume = data[key].volume
              this.ticker.low = data[key].low
              this.ticker.high = data[key].high
            }
          }
          this.ticker = Object.assign({}, this.ticker)
        }
      })
    },
    reload: function () {
      window.onpageshow = function (e) {
        if (e.persisted) {
          window.location.reload()
        }
      }
    },
    fetchData: function (market) {
      this._get({
        url: '/markets/' + market + '.json',
        data: {}
      }, (data) => {
        this.loading = false
        var initdata = JSON.parse(data.request.response);
        ({
          ticker: this.ticker,
          market: this.market,
          current_user: this.logined,
          trades: this.trades
        } = initdata)
        if (this.trades && this.trades.length !== 0) {
          this.trades = initdata.trades.slice(0, 15)
        }
        if (this.logined) {
          this.favorite = initdata.market['is_portfolios']
        } else {
          this.getLocal()
        }
        document.title = `${this.market.quote_currency.toUpperCase()}/${this.market.base_currency.toUpperCase()} - ${this.$t('brand')}`
      })
    },
    goPath: function (index) {
      if (index === 0) {
        return ''
      } else if (index === 1) {
        this.$router.push({path: `${this.ROUTER_VERSION}/markets/${this.curmarket}/trades`})
      } else if (index === 2) {
        this.$router.push({path: `${this.ROUTER_VERSION}/markets/${this.curmarket}/orders`})
      }
    },
    addFavorite: function () {
      var self = this
      if (this.logined) {
        if (this.favorite) {
          this._delete({
            url: '/portfolios/' + self.curmarket + '.json'
          }, function (xhr) {
            if (xhr.status === 200) {
              self.favorite = false
            }
          })
        } else {
          this._post({
            url: '/portfolios.json',
            data: {
              market: self.curmarket
            }
          }, function (xhr) {
            if (xhr.status === 200) {
              self.favorite = true
            }
          })
        }
      } else {
        var arr = []
        var i = 0
        if (!this.localList) {
          arr.push(this.curmarket)
          this.favorite = true
        } else {
          arr = this.localList.split(',')
          i = arr.indexOf(this.curmarket)
          if (i !== -1) {
            arr.splice(i, 1)
            this.favorite = false
          } else {
            arr.push(this.curmarket)
            this.favorite = true
          }
        }
        localStorage.setItem('markets', arr)
        this.localList = localStorage.getItem('markets')
      }
    }
  }
}
</script>
<style scoped lang="scss">
   @import './market.scss'
</style>
