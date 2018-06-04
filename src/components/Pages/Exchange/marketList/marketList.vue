<template>
  <section id="marketList">
    <a class="expand" @click='changePos'><i :class="{'mycaret': move, 'left_caret': !move}"></i></a>
    <ul class="marketsHd clearfix">
      <li v-for="(hd,index) in hds" :key="'market'+hd" :class="{'check': currencyIndex == index}"
      @click="changeMarket(index,hd)">{{$t(hd)}}</li>
    </ul>
    <div class="search_box">
      <span>{{$t('exchange.find')}}</span>
      <div class="search">
        <input id="serach_market" v-model="getMarket">
        <a class="search_del" v-show='searchDel' @click='delAllInput'>
          <i class="fa fa-times-circle"></i>
        </a>
      </div>
    </div>
    <div class="marketBd">
      <marketItem :curData = "curData[currencyIndex]" :i='currencyIndex' @changeFav='changeFav'></marketItem>
    </div>
  </section>
</template>

<script>
import marketItem from './marketItem/marketItem'
import { bus } from '@/common/js/bus/index'

export default {
  name: 'marketList',
  props: ['markets', 'loginData'],
  data () {
    return {
      hds: ['BTC', 'ETH', 'USDT', 'markets.favorite'],
      currencyIndex: 0,
      curData: [],
      pipeData: [],
      getMarket: '',
      searchDel: false,
      move: false
    }
  },
  components: {
    marketItem
  },
  watch: {
    markets (val, oldVal) {
      this.pipeData = val
      this.getData()
    },
    getMarket (val, oldVal) {
      if (val === '/') return
      if (!val) {
        this.searchDel = false
        this.getData()
      } else {
        this.searchDel = true
        this.getData()
        var reg = new RegExp(`${val}`, 'i')
        this.curData[this.currencyIndex] = this.curData[this.currencyIndex].filter(ele => {
          var key = '' + ele['quote_currency'] + ele['base_currency']
          return reg.test(key)
        })
      }
    }
  },
  methods: {
    changeMarket: function (index, item) {
      this.currencyIndex = index
    },
    getData () {
      this.curData = []
      this.curData[0] = this.singleData('btc')
      this.curData[1] = this.singleData('eth')
      this.curData[2] = this.singleData('usdt')
      this.curData[3] = this.loginData === 'none' ? this.getLocal() : this.getFavorite()
    },
    singleData (type) {
      var data = this.pipeData
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
      var data = this.pipeData
      var arr = []
      var key = ''
      for (key in data) {
        if (data[key] && data[key]['is_portfolios']) {
          arr.push(data[key])
        }
      }
      return arr
    },
    getLocal: function () {
      var localList = localStorage.getItem('markets')
      if (!localList || localList.length === 0) {
        return []
      }

      var data = this.pipeData
      var arr = []
      localList.split(',').map((ele) => {
        data[ele]['is_portfolios'] = true
        arr.push(data[ele])
      })
      return arr
    },
    delAllInput () {
      this.getMarket = ''
      this.searchDel = false
    },
    changeFav (quote, base, bool) {
      if (this.loginData === 'none') {
        var market = '' + quote + base
        var localList = localStorage.getItem('markets')
        var arr = []
        if (bool) {
          arr = localList.split(',')
          arr.splice(arr.indexOf(market), 1)
        } else {
          if (!localList) {
            arr.push(market)
          } else {
            arr = localList.split(',')
            arr.push(market)
          }
        }
        localStorage.setItem('markets', arr)
        this.pipeData[market]['is_portfolios'] = !bool
        this.pipeData = Object.assign({}, this.pipeData)
        this.getData()
      } else {
        this.$emit('reFreshFav', quote, base, bool)
      }
    },
    changePos () {
      this.move = !this.move
      this.$emit('moveLeft', this.move)
      bus.$emit('slidelr', this.move)
    }
  }
}
</script>

<style lang="scss">
  @import './marketList.scss'
</style>
