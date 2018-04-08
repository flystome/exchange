<template>
  <section id="marketList">
    <ul class="marketsHd clearfix">
      <li v-for="(hd,index) in hds" :key="'market'+hd" :class="{'check': currencyIndex == index}"
      @click="changeMarket(index,hd)">{{$t(hd)}}</li>
    </ul>
    <div class="search_box">
      <span>{{$t('exchange.find')}}</span>
      <div class="search">
        <input id="serach_market" v-model="">
        <a class="search_del">
          <i class="fa fa-times-circle"></i>
        </a>
      </div>
    </div>
    <div class="marketBd">
      <marketItem :curData = "curData[currencyIndex]"></marketItem>
    </div>
  </section>
</template>

<script>
import marketItem from './marketItem/marketItem'

export default {
  name: 'marketList',
  props: ['markets'],
  data () {
    return {
      hds: ['BTC', 'ETH', 'USDT', 'markets.favorite'],
      currencyIndex: 0,
      curData: []
    }
  },
  components: {
    marketItem
  },
  watch: {
    markets (val, oldVal) {
      this.getData()
    }
  },
  methods: {
    changeMarket: function (index, item) {
      this.currencyIndex = index
    },
    getData (data) {
      this.curData = []
      this.curData[0] = this.singleData('btc')
      this.curData[1] = this.singleData('eth')
      this.curData[2] = this.singleData('usdt')
      this.curData[3] = this.getFavorite()
      console.log(this.singleData('btc'), this.markets)
    },
    singleData (type) {
      var data = this.markets
      var reg = new RegExp(`${type}$`, 'i')
      var arr = []
      for (var key in data) {
        if (reg.test(key)) {
          arr.push(data[key])
        }
      }
      return arr
    },
    getFavorite () {
      var data = this.markets
      var arr = []
      var key = ''
      for (key in data) {
        if (data[key] && data[key]['is_portfolios']) {
          arr.push(data[key])
        }
      }
      return arr
    }
  }
}
</script>

<style lang="scss">
  @import './marketList.scss'
</style>
