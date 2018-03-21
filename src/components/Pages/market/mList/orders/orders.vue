<template>
  <div id="orders">
    <ul class="marketsHd clearfix">
      <li v-for="(hd,index) in hds" :key="hd" :class="{'check': currencyindex == index}"
      @click="changemarket(index,hd)">{{hd}}</li>
    </ul>
    <div class="orderBd">
      <div class="operate">
        <div class="cancel_all">{{$t("orders.cancel_all")}}</div>
        <div class="choose">
          <div class="all selected"><i class="fa fa-check-circle-o"></i>{{$t("orders.all")}}</div>
          <div class="buy"><i class="fa fa-circle-thin"></i>{{$t("orders.buy")}}</div>
          <div class="sell"><i class="fa fa-circle-thin"></i>{{$t("orders.sell")}}</div>
        </div>
      </div>
      <ul class="order_list">
        <li class="list" v-for="item in curData" :key="item.id" @click="goPath(item.quote_currency,item.base_currency)">
          <div class="list_top">
            <div class="cancel">{{$t('cancel')}}</div>
            <div class="list_lt">
              <div class="list_type" :class="{'sell': item.kind === 'ask', 'buy': item.kind === 'bid'}">{{$t('orders.'+item.kind)}}</div>
              <div class="market">{{item.quote_currency | upper}}/{{item.base_currency | upper}}</div>
              <div class="time">201-03-08 12:34:26</div>
            </div>
          </div>
          <div class="list_bottom">
            <div class="list-price">
              <div class="num">{{item.price}}</div>
              <div class="des">{{$t("orders.price")}}</div>
            </div>
            <div class="list-volume">
              <div class="num">{{item.volume}}</div>
              <div class="des">{{$t("orders.volume")}}</div>
            </div>
            <div class="list-percent">
              <div class="num">{{item.close_rate}}</div>
              <div class="des">{{$t("orders.ordered")}}</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
// import { mapGetters, mapMutations } from 'vuex'


export default {
  name: 'markets',
  data () {
    return {
      hds: [this.$t('markets.favorite'), 'btc', 'usdt'],
      currencyindex: 0,
      marketData: null,
      curData: []
    }
  },
  components: {
    marketList
  },
  mounted: function () {
    var self = this
    this.fetchData()
    var channel = pusher.subscribe('market-global')
    channel.bind('tickers', (data) => {
      if (JSON.stringify(data) !== '{}') {
        for (var i in data) {
          var key = data[i]['base_currency']
          var Arr = self.marketData[key]
          var len = Arr.length
          var target = null
          for (var j = 0; j < len; j++) {
            var arrKey = Object.keys(Arr[j])
            if (arrKey[0] === i) {
              target = Arr[j]
              target[arrKey].last = data[i]['last']
              target[arrKey].percent = data[i]['percent']
              target[arrKey].volume = data[i]['volume']
              target[arrKey].legal_worth = data[i]['legal_worth']
            }
          }
          this.getCurData(self.marketData)
        }
      }
    })
  },
  filters: {
    upper: function (params) {
      if (!params || params === '/' || params === 'undefined/undefined') return '--'
      return params.toUpperCase()
    },
  },
  methods: {
    fetchData: function () {
      var self = this
      this._get({
<<<<<<< HEAD
        url: '/home.json',
        data: {}
      }, function (data) {
        var getdata = JSON.parse(data.request.response)
        self.getCurData(getdata.success)
        self.marketData = getdata.success
=======
        url: '/markets/pending_orders.json',
        data: {}
      }, function (data) {
        var initdata = JSON.parse(data.request.response)
        console.log(initdata.success.orders)
        self.curData = initdata.success.orders
        // self.getCurData(initdata.success)
        // self.marketData = initdata.success
>>>>>>> get data
      })
    },
    getCurData: function (data) {
      this.curData = []
      this.curData.push(this.initDate(data))
      this.curData.push(this.getItem(data['btc']))
      this.curData.push(this.getItem(data['usdt']))
    },
    changemarket: function (index, item) {
      this.currencyindex = index
    },
    initDate: function (data) {
      var arr = []
      if (data.current_user) {
        arr = this.getFavorite(data)
      } else {
        arr = this.getLocal(data)
      }
      return arr
    },
    getItem: function (data) {
      var arr = []
      for (var i in data) {
        for (var item in data[i]) {
          arr.push(data[i][item])
        }
      }
      return arr
    },
    getFavorite: function (data) {
      var arr = []
      for (var key in data) {
        if (key !== 'current_user' && key !== 'code') {
          var list = data[key]
          var len = list.length
          for (var i = 0; i < len; i++) {
            for (var item in list[i]) {
              if (list[i][item]['is_portfolios'] === true) {
                arr.push(list[i][item])
              }
            }
          }
        }
      }
      return arr
    },
    getLocal: function (data) {
      var localList = localStorage.getItem('markets')
      if (localList.length === 0) {
        return ''
      }
      var arr = []
      for (var key in data) {
        if (key !== 'current_user') {
          var list = data[key]
          var len = list.length
          for (var i = 0; i < len; i++) {
            for (var item in list[i]) {
              if (localList.indexOf(item) !== -1) {
                arr.push(list[i][item])
              }
            }
          }
        }
      }
      return arr
    }
  }
}
</script>
<style scoped lang="scss">
  @import './mlist.scss'
</style>
