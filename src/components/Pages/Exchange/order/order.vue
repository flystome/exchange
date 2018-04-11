<template>
  <section id="order">
    <div class="buy handleOrder" v-if='type==="buy"'>
      <div class="price put">
        <input type="text" step="0.00000001" :value='buyPrice' @input='handlePrice($event.target.value, "buy")' :placeholder="$t('markets.price')">
        <span>{{market.base_currency | upper}}</span>
      </div>
      <div class="volume put">
        <input type="text" step="0.00000001" :value='buyVolume' @input='handleVol($event.target.value, "buy")' :placeholder="$t('exchange.volume')">
        <span>{{market.quote_currency | upper}}</span>
      </div>
      <div class="total put">
        <input type="text" step="0.00000001" :value='buyTotal' @input='handleTotal($event.target.value, "buy")' :placeholder="$t('markets.total')">
        <span>{{market.base_currency | upper}}</span>
      </div>
      <div class="percent">
        <span>1/4</span>
        <span>1/3</span>
        <span>1/2</span>
        <span>All</span>
      </div>
      <div class="tip">
        <div class="myTotal">{{buyAccount | fixedNum(market.price_fixed, market.volume_fixed)}} {{market.base_currency | upper}}</div>
      </div>
      <a class="buy_btn btn" href="###" @click.prevent="orderBid()">{{$t('markets.buy')}}{{market.quote_currency | upper}}</a>
    </div>
    <div class="sell handleOrder" v-if='type==="sell"'>
      <div class="price put">
        <input type="text" step="0.00000001" :value='sellPrice' @input='handlePrice($event.target.value, "sell")' :placeholder="$t('markets.price')">
        <span>{{market.base_currency | upper}}</span>
      </div>
      <div class="volume put">
        <input type="text" step="0.00000001" :value='sellVolume' @input='handleVol($event.target.value, "sell")' :placeholder="$t('exchange.volume')">
        <span>{{market.quote_currency | upper}}</span>
      </div>
      <div class="total put">
        <input type="text" step="0.00000001" :value='sellTotal' @input='handleTotal($event.target.value, "sell")' :placeholder="$t('markets.total')">
        <span>{{market.base_currency | upper}}</span>
      </div>
      <div class="percent">
        <span>1/4</span>
        <span>1/3</span>
        <span>1/2</span>
        <span>All</span>
      </div>
      <div class="tip">
        <div class="myTotal">{{sellAccount | fixedNum(market.price_fixed, market.volume_fixed)}} {{market.quote_currency | upper}}</div>
      </div>
      <a class="sell_btn btn" @click.prevent="orderAsk()">{{$t('markets.sell')}}{{market.quote_currency | upper}}</a>
    </div>
  </section>

</template>

<script>
import { bus } from '@/common/js/bus/index'
import {mapState} from 'vuex'

export default {
  name: 'order',
  props: ['market', 'type', 'accounts'],
  data () {
    return {
      buyPrice: '',
      buyVolume: '',
      buyTotal: '',
      sellPrice: '',
      sellVolume: '',
      sellTotal: '',
      buyAccount: 0,
      sellAccount: 0
    }
  },
  mounted () {
    bus.$on('addOrder', (type, price, val) => {
      var expand = Math.pow(10, this.market.price_fixed)
      this.buyPrice = price
      this.sellPrice = price
      if (type === 'sell') {
        this.buyVolume = val
        this.buyTotal = Math.floor(price * val * expand) / expand
        this.sellVolume = ''
        this.sellTotal = ''
      } else {
        this.sellVolume = val
        this.sellTotal = Math.floor(price * val * expand) / expand
        this.buyVolume = ''
        this.buyTotal = ''
      }
    })
  },
  computed: {
    ...mapState(['loginData'])
  },
  watch: {
    accounts (val) {
      this.buyAccount = val[this.market.base_currency].balance
      this.sellAccount = val[this.market.quote_currency].balance
    },
    loginData (val, oldValue) {
      this.sn = val.sn
    }
  },
  methods: {
    handleVol (value, type) {
      this[type + 'Volume'] = this.fixNum(value, this.market.volume_fixed)
      if (this[type + 'Price']) {
        var num = this[type + 'Price'] * value
        var account = this.fixNum(this[type + 'Account'], this.market.volume_fixed, this.market.price_fixed)
        if (num > account) {
          num = account
          this[type + 'Volume'] = this.fixNum(num / this[type + 'Price'], this.market.volume_fixed)
          console.log(this[type + 'Volume'])
          console.log(1)
        } else {
          this[type + 'Volume'] = this.fixNum(value, this.market.volume_fixed)
          console.log(2)
        }
        this[type + 'Total'] = this.fixNum(num, this.market.volume_fixed, this.market.price_fixed)
      }
    },
    handlePrice (value, type) {
      this[type + 'Price'] = this.fixNum(value, this.market.price_fixed)
      if (this[type + 'Volume']) {
        var num = this.fixNum(this[type + 'Volume'] * value, this.market.volume_fixed, this.market.price_fixed)
        // if (num > this[type + 'Account']) {
        //   num = this[type + 'Account']
        //   this[type + 'Volume'] = this.fixNum(num / this[type + 'Price'], this.market.volume_fixed)
        // }
        this[type + 'Total'] = num
      }
    },
    handleTotal (value, type) {
      if (this[type + 'Price']) {
        this[type + 'Volume'] = this.fixNum(value / this[type + 'Price'], this.market.volume_fixed)
      }
      this[type + 'Total'] = this.fixNum(value, this.market.volume_fixed, this.market.price_fixed)
    },
    fixNum (value, num, num1) {
      var nums = num1 ? (num > num1 ? num : num1) : num
      var e = Math.pow(10, nums)
      console.log(Math.floor(e * value) / e)
      return Math.floor(e * value) / e
    },
    loginCheck: function () {
      if (this.sn === 'unlogin') {
        location.href = `${process.env.HOST_URL}/signin?from=${location.href}`
      }
    },
    orderBid: function () {
      this.loginCheck()
      if (!this.buyPrice || !this.buyVolume) {
        // return
      }
      // this.showDialog = true
      // this.isDisabled = true
    },
    orderAsk: function () {
      this.loginCheck()
      if (!this.sellPrice || !this.sellVolume) {
        // return
      }
      // this.showDialog = true
      // this.isDisabled = false
    }
  }
}
</script>

<style lang="scss">
  @import './order.scss'
</style>
