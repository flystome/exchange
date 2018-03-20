<template>
  <div id="orders">
    <ul class="marketsHd clearfix">
      <li v-for="(hd,index) in hds" :key="hd" :class="{'check': currencyindex == index}"
      @click="changemarket(index,hd)">{{hd}}</li>
    </ul>
    <div class="orderBd">
      <ul class="hd clearfix">
        <li class="text-center" :class="{'up': times == 1 && currencyIndex == index , 'down': times == 2 && currencyIndex == index}"  v-for="(head, index) in heads" :key="head" :data-time = '0'  @click="sortList(index)">
          <span>{{head}}</span>
          <i class="caret"></i>
        </li>
      </ul>
      <ul class="bd">
        <li class="list" v-for="item in oldData" :key="item.quote_currency" @click="goPath(item.quote_currency,item.base_currency)">
          <div class="list-coin">
            <div class="coin">{{item.quote_currency | upper}}<span>/{{item.base_currency | upper}}</span></div>
            <div class="vol"><span>{{$t('markets.volume')}}</span>{{item.volume | fixed4}}</div>
          </div>
          <div class="list-price">
            <div class="price">{{item.last | fixed4}}</div>
            <div class="val">${{item.legal_worth | fixed4}}</div>
          </div>
          <div class="list-btn">
            <div :class="{'text-up': item.percent > 0, 'text-down': item.percent < 0}">{{item.percent | fixed2}}%</div>
          </div>
          <div class="list-btn">
            <div :class="{'text-up': item.percent > 0, 'text-down': item.percent < 0}">{{item.percent | fixed2}}%</div>
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
  methods: {
    fetchData: function () {
      var self = this
      this._get({
        url: '/home.json',
        data: {}
      }, function (data) {
        var getdata = JSON.parse(data.request.response)
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
  @import './mlist.scss'
</style>
