<template>
  <div id="orders">
    <ul class="order_hd clearfix">
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
        <li class="list" v-for="item in oldData" :key="item.quote_currency" @click="goPath(item.quote_currency,item.base_currency)">
          <div class="list_top">
            <div class="cancel">{{$t('cancel')}}</div>
            <div class="list_lt">
              <div class="list_type">
                <img src="~Img/buy.png">
                <img src="~Img/sell.png">
              </div>
              <!-- <div class="market">{{(market.quote_currency+'/'+market.base_currency) | upper}}</div> -->
              <div class="market">ETH/BTC</div>
              <div class="time">201-03-08 12:34:26</div>
            </div>
          </div>
          <div class="list_bottom">
            <div class="list-price">
              <div class="num">0.03324647</span></div>
              <div class="des">{{$t("orders.price")}}</div>
            </div>
            <div class="list-volume">
              <div class="num">0.01324647</div>
              <div class="des">{{$t("orders.volume")}}</div>
            </div>
            <div class="list-percent">
              <div class="num">30%</div>
              <div class="des">{{$t("orders.ordered")}}</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'orders',
  data () {
    return {
      hds: [this.$t('markets.quotes'), this.$t('markets.trade'), this.$t('markets.currency')],
      currencyindex: 2,
      marketData: null,
      curData: []
    }
  },
  mounted: function () {
    var self = this
    this.fetchData()
    // var channel = pusher.subscribe('market-global')
    // channel.bind('tickers', (data) => {
    //   if (JSON.stringify(data) !== '{}') {
    //     for (var i in data) {
    //       var key = data[i]['base_currency']
    //       var Arr = self.marketData[key]
    //       var len = Arr.length
    //       var target = null
    //       for (var j = 0; j < len; j++) {
    //         var arrKey = Object.keys(Arr[j])
    //         if (arrKey[0] === i) {
    //           target = Arr[j]
    //           target[arrKey].last = data[i]['last']
    //           target[arrKey].percent = data[i]['percent']
    //           target[arrKey].volume = data[i]['volume']
    //           target[arrKey].legal_worth = data[i]['legal_worth']
    //         }
    //       }
    //       this.getCurData(self.marketData)
    //     }
    //   }
    // })
  },
  methods: {
    fetchData: function () {
      var self = this
      this._get({
        url: '/pending.json',
        data: {}
      }, function (data) {
        var getdata = JSON.parse(data.request.response)
        console.log(getdata)
        self.getCurData(getdata.success)
        self.marketData = getdata.success
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
  @import './orders.scss'
</style>
