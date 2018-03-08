<template>
  <div id="markets">
    <ul class="marketsHd clearfix">
      <li v-for="(hd,index) in hds" :key="hd" :class="{'check': currencyindex == index}"
      @click="changemarket(index,hd)">{{$t(hd)}}</li>
    </ul>
    <ul class="marketBd">
      <marketList :curData = "curData[currencyindex]"></marketList>
    </ul>
  </div>
</template>
<script>
// import { mapGetters, mapMutations } from 'vuex'
import marketList from './marketList/marketList'

export default {
  name: 'markets',
  data () {
    return {
      hds: ['favorite', 'btc', 'eth'],
      currencyindex: 0,
      marketData: null,
      curData: []
    }
  },
  components: {
    marketList
  },
  mounted: function () {
    this.fetchData()
  },
  methods: {
    // ...mapGetters(['loginData']),
    fetchData: function () {
      var self = this
      this._httpget({
        url: '/home.json',
        data: {}
      }, function (data) {
        console.log(data.request.response)
        var marketData = JSON.parse(data.request.response)
        self.curData = []
        self.curData.push(self.initDate(marketData))
        self.curData.push(marketData['btc'])
        self.curData.push(marketData['eth'])
      })
    },
    changemarket: function (index, item) {
      this.currencyindex = index
    },
    initDate: function (data) {
      if (data.current_user) {
        this.getFavorite(data)
      } else {
        this.getLocal(data)
      }
    },
    getFavorite: function (data) {
      var arr = []
      for (var key in data) {
        if (key !== 'current_user') {
          var list = data[key]
          var len = list.length
          for (var i = 0; i < len; i++) {
            for (var item in list[i]) {
              if (list[i][item]['is_portfolios'] === true) {
                arr.push(list[i])
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
                arr.push(list[i])
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
