<template>
  <div class="market_detail">
    <ul class="market_hd clearfix">
      <li v-for="(hd,index) in hds" :key="hd" :class="{'check': currencyindex == index}" @click="goPath(index)">{{hd}}</li>
    </ul>
    <div class="detail">
      <div class="detail_top">
        <div class="add_favorite">
          <a class="favorite" :class = "{'favorited': favorite === true}" @click="addFavorite()">
            <i class="fa fa-star"></i>
            {{$t("markets.favorite")}}
          </a>
        </div>
        <div class="coin_detail">
          <a class="cur_market" href="/markets"><span>{{(market.quote_currency+'/'+market.base_currency) | upper}}</span><i class="caret"></i></a>
          <div>
            <span class="price">{{ticker.last | fixed4}}</span>
            <span class="vol">${{ticker.legal_worth | fixed2}}</span>
          </div>
        </div>
      </div>
      <div class="detail_bottom clearfix">
        <div class="detail_lt">
          <p>
            <span class="change">{{ticker.last - ticker.open | fixed4}}</span>
            <span class="percent">{{ticker.percent | fixed2}}%</span>
          </p>
          <p>
            <span class="name">{{$t("markets.volume24")}}</span>
            <span class="volume">{{ticker.volume | fixed4}} {{market.base_currency | upper}}</span>
          </p>
        </div>
        <div class="detail_rt">
          <p>
            <span class="name">{{$t("markets.low")}}</span>
            <span class="volume">{{ticker.low | fixed2}}</span>
          </p>
          <p>
            <span class="name">{{$t("markets.high")}}</span>
            <span class="volume">{{ticker.high | fixed2}}</span>
          </p>
        </div>
      </div>
    </div>

    <div class="graph">

    </div>

    <div class="new_order">
      <h2>{{$t("markets.history")}}</h2>
      <ul class="order_hd">
        <li v-for="head in heads" :key="head">{{head}}</li>
      </ul>
      <ul class="order_list">
        <li v-for="item in trades" :key="item.tid">
          <div class="order_price" :class="{'text-up': item.type === 'buy', 'text-down': item.type === 'sell'}">{{item.price | fixed4}}</div>
          <div class="order_amount">{{item.amount}}</div>
          <div class="order_time">{{+item.date*1000 | time}}</div>
        </li>
      </ul>
    </div>
    <div class="trade">
      <div class="btn">
        <router-link class="bid" :to="{path: ROUTER_VERSION + '/markets/' + curmarket + '/trades#buy', }">{{$t("markets.buy")}}</router-link>
      </div>
      <div class="btn">
        <router-link class="ask" :to="{path: ROUTER_VERSION + '/markets/' + curmarket + '/trades#sell', }">{{$t("markets.sell")}}</router-link>
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
      hds: [this.$t('markets.quotes'), this.$t('markets.trade'), this.$t('markets.currency')],
      heads: [this.$t('markets.newPrice'), this.$t('markets.amount'), this.$t('markets.time')],
      curmarket: '',
      market: {},
      ticker: {},
      trades: [],
      logined: false,
      favorite: false
    }
  },
  mounted: function () {
    var self = this
    this.curmarket = this.$route.params.id
    this.fetchData(this.$route.params.id)
    var market = pusher.subscribe('market-' + this.curmarket + '-global')
    market.bind('trades', (data) => {
      console.log(data, this.trades)
      self.trades.pop()
      self.trades.unshift(data['trades'][0])
    })
    var channel = pusher.subscribe('market-global')
    channel.bind('tickers', (data) => {
      if (JSON.stringify(data) !== '{}') {
        for (var key in data) {
          if (key === self.curmarket) {
            console.log(self.ticker, data)
            self.ticker.last = data[key].last
            self.ticker.legal_worth = data[key].legal_worth
            self.ticker.percent = data[key].percent
            self.ticker.volume = data[key].volume
            self.ticker.low = data[key].low
            self.ticker.high = data[key].high
          }
        }
      }
    })
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
        self.trades = initdata.trades.slice(0, 10)
        self.market = initdata.market
        self.logined = !!initdata.current_user
        console.log(initdata)
      })
    },
    goPath: function (index) {
      if (index === 0) {
        return ''
      } else if (index === 1) {
        this.$router.push({path: `${this.ROUTER_VERSION}/markets/${this.curmarket}/trades`})
      } else if (index === 2) {
        this.$router.push({path: `${this.ROUTER_VERSION}/orders`})
      }
    },
    addFavorite: function () {
      var self = this
      if (this.logined) {
        if (this.favorite) {
          this._delete({
            url: '/portfolios/' + self.curmarket,
            data: {}
          }, function (xhr) {
            if (xhr.status === 200) {
              self.favorite = false
            }
          })
        } else {
          this._post({
            url: '/portfolios/',
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
        var localList = localStorage.getItem('markets').split(',')
        var i = ('' + this.market).indexOf(localList)
        if (i !== -1) {
          localList.push(this.curmarket)
        } else {
          localList.splice(i, 1)
        }
        localStorage.setItem('markets', localList)
      }
    }
  }
}
</script>
<style scoped lang="scss">
   @import './market.scss'
</style>
