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
        var obj = {}
        val.map((ele, index) => {
          var key = Object.keys(ele)[0]
          obj[key] = ele[key]
        })
        this.listData = obj
        this.getCurData()
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
        if (JSON.stringify(data) !== '{}' && JSON.stringify(this.listData) !== '{}') {
          var obj = this.listData
          Object.keys(data).map((ele) => {
            obj[ele].last = data[ele].last
            obj[ele].percent = data[ele].percent
            obj[ele].volume = data[ele].volume
            obj[ele].legal_worth = data[ele].legal_worth
          })
          this.getCurData(this.listData)
        }
      })
    },
    getCurData: function () {
      this.curData = []
      this.curData.push(this.initDate())
      this.curData.push(this.getItem('btc'))
      this.curData.push(this.getItem('usdt'))
    },
    changemarket: function (index, item) {
      this.currencyindex = index
    },
    initDate: function () {
      var arr = []
      if (this.loginData === 'none') {
        arr = this.getLocal()
      } else {
        arr = this.getFavorite()
      }
      return arr
    },
    getItem: function (key) {
      var arr = []
      var reg = new RegExp(key+'$', 'i')
      for (var item in this.listData) {
        if (reg.test(item)) {
          arr.push(this.listData[item])
        }
      }
      return arr
    },
    getFavorite: function () {
      var arr = []
      var data = this.listData
      for (var key in data) {
        if (data[key]['is_portfolios']) {
          arr.push(data[key])
        }
      }
      return arr
    },
    getLocal: function () {
      var localList = localStorage.getItem('markets')
      if (!localList || localList.length === 0) {
        return ''
      }

      var data = this.listData
      var arr = []
      localList.split(',').map((ele) => {
        data[ele]['is_portfolios'] = true
        arr.push(data[ele])
      })
      return arr
    }
  }
}
</script>
<style scoped lang="scss">
  @import './mlist.scss'
</style>
