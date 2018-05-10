<template>
  <div id="markets">
    <ul class="marketsHd clearfix">
      <li v-for="(hd,index) in hds" :key="hd" :class="{'check': currencyindex == index}"
      @click="changemarket(index,hd)">{{$t(hd)}}</li>
    </ul>
    <div class="marketBd">
      <marketList :curData = "curData[currencyindex]"></marketList>
    </div>
    <vue-simple-spinner v-if='curData.length === 0' size="66" class="loading"></vue-simple-spinner>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import marketList from './marketList/marketList'
import pusher from '@/common/js/pusher'

export default {
  name: 'markets',
  data () {
    return {
      hds: ['markets.favorite', 'BTC', 'USDT'],
      currencyindex: 1,
      listData: {},
      curData: []
    }
  },
  components: {
    marketList
  },
  mounted: function () {
    this.init()
    window.onpageshow = function (e) {
      if (e.persisted) {
        window.location.reload()
      }
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.path === '/markets') {
        this.init()
      }
    },
    marketData (val) {
      if (val) {
        var obj = {
          eth: [],
          btc: [],
          usdt: []
        }
        val.map((ele, index) => {
          var key = Object.keys(ele)[0]
          if ((/eth$/i).test(key)) {
            obj.eth.push(ele)
          } else if ((/btc$/i).test(key)) {
            obj.btc.push(ele)
          } else if ((/usdt$/i).test(key)) {
            obj.usdt.push(ele)
          }
        })
        this.getCurData(obj)
        this.listData = obj
      }
    }
  },
  computed: {
    ...mapGetters(['marketData', 'loginData'])
  },
  methods: {
    init: function () {
      this.getRefresh()
      if (JSON.stringify(this.listData) !== '{}') {
        this.getCurData(this.listData)
      }
    },
    getRefresh: function () {
      var self = this
      var channel = pusher.subscribe('market-global')
      channel.bind('tickers', (data) => {
        if (JSON.stringify(data) !== '{}') {
          for (let i in data) {
            var obj = data[i]
            var key = obj.base_currency
            var Arr = self.listData[key]
            if (!Arr) return
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
            this.getCurData(self.listData)
          }
        }
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
      if (this.loginData) {
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
      return arr
    },
    getLocal: function (data) {
      var localList = localStorage.getItem('markets')
      if (!localList || localList.length === 0) {
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
