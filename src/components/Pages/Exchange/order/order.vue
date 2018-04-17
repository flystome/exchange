<template>
  <section id="order">
    <div class="dialog" v-show='showDialog'>
      <div class="mask"></div>
      <div class="dia_content">
        <div class="text">
          <h4>{{$t('markets.confirm')}}{{$t('markets.dialog.' + order_type)}}</h4>
          <ul v-if="order_type === 'buy'">
            <li><div class="value pair"><span>{{(market.quote_currency+'/'+market.base_currency)  | upper}}</span></div>{{$t('markets.pair')}}</li>
            <li><div class="value">{{ sellPrice | fixedNum(market.price_fixed)}}<span>{{market.base_currency | upper}}</span></div>{{$t('markets.price')}}</li>
            <li><div class="value">{{ buyVolume | fixedNum(market.volume_fixed)}}<span>{{market.quote_currency | upper}}</span></div>{{$t('markets.volume')}}</li>
            <li><div class="value">{{ buyTotal | fixedNum(market.volume_fixed, market.price_fixed)}}<span>{{market.base_currency | upper}}</span></div>{{$t('markets.total')}}</li>
          </ul>
          <ul v-if="order_type === 'sell'">
            <li><div class="value pair"><span>{{(market.quote_currency+'/'+market.base_currency)  | upper}}</span></div>{{$t('markets.pair')}}</li>
            <li><div class="value">{{ sellPrice | fixedNum(market.price_fixed)}}<span>{{market.base_currency | upper}}</span></div>{{$t('markets.price')}}</li>
            <li><div class="value">{{ sellVolume | fixedNum(market.volume_fixed)}}<span>{{market.quote_currency | upper}}</span></div>{{$t('markets.volume')}}</li>
            <li><div class="value">{{ sellTotal | fixedNum(market.volume_fixed, market.price_fixed)}}<span>{{market.base_currency | upper}}</span></div>{{$t('markets.total')}}</li>
          </ul>
        </div>
        <div class="confirm_box">
          <span class="confirm" @click="confirmTrade(true)">{{$t('markets.confirm')}}</span>
          <span class="cancel" @click="confirmTrade(false)">{{$t('markets.cancel')}}</span>
        </div>
      </div>
    </div>
    <div class="buy handleOrder" v-if='type==="buy"'>
      <div class="price put">
        <input type="text" ref='buyPrice' v-model='buyPrice' @change='handlePrice($event.target.value, "buy")' :placeholder="$t('markets.price')">
        <span>{{market.base_currency | upper}}</span>
      </div>
      <div class="volume put">
        <input type="text" ref="buyVolume" v-model='buyVolume' @change='handleVol($event.target.value, "buy")' :placeholder="$t('exchange.volume')">
        <span>{{market.quote_currency | upper}}</span>
      </div>
      <div class="total put">
        <input type="text" ref="buyTotal" v-model='buyTotal' @change='handleTotal($event.target.value, "buy")' :placeholder="$t('markets.total')">
        <span>{{market.base_currency | upper}}</span>
      </div>
      <div class="percent">
        <span v-for='item in percent' :key='"btn"+item[1]' @click="addInputs(item[1])">{{item[0]}}</span>
      </div>
      <div class="tip">
        <div class="myTotal">{{buyAccount | fixedNum(market.price_fixed, market.volume_fixed)}} {{market.base_currency | upper}}</div>
      </div>
      <a class="buy_btn btn" href="###" @click.prevent="orderBid()">{{$t('exchange.buy')}}{{market.quote_currency | upper}}</a>
    </div>
    <div class="sell handleOrder" v-if='type==="sell"'>
      <div class="price put">
        <input type="text" ref="sellPrice" step="0.00000001" v-model='sellPrice' @change='handlePrice($event.target.value, "sell")' :placeholder="$t('markets.price')">
        <span>{{market.base_currency | upper}}</span>
      </div>
      <div class="volume put">
        <input type="text" ref="sellVolume" step="0.00000001" v-model='sellVolume' @change='handleVol($event.target.value, "sell")' :placeholder="$t('exchange.volume')">
        <span>{{market.quote_currency | upper}}</span>
      </div>
      <div class="total put">
        <input type="text" ref="sellTotal" step="0.00000001" v-model='sellTotal' @change='handleTotal($event.target.value, "sell")' :placeholder="$t('markets.total')">
        <span>{{market.base_currency | upper}}</span>
      </div>
      <div class="percent">
        <span v-for='item in percent' :key='"btn"+item[1]' @click="addInputs(item[1])">{{item[0]}}</span>
      </div>
      <div class="tip">
        <div class="myTotal">{{sellAccount | fixedNum(market.volume_fixed)}} {{market.quote_currency | upper}}</div>
      </div>
      <a class="sell_btn btn" @click.prevent="orderAsk()">{{$t('exchange.sell')}}{{market.quote_currency | upper}}</a>
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
      sellAccount: 0,
      showDialog: false,
      order_type: 'buy',
      isDisabled: true,
      percent: [['1/4', 0.25], ['1/3', 0.333], ['1/2', 0.5], ['All', 1]]
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
      return val
    }
  },
  methods: {
    handleVol (value, type) {
      if (this[type + 'Price']) {
        var num = +this[type + 'Price'] * +value
        if (type === 'buy') {
          if (num > +this.buyAccount) {
            value = +this.buyAccount / this.buyPrice
          }
        } else if (type === 'sell') {
          if (value > +this.sellAccount) {
            value = this.sellAccount
            num = value * this.sellPrice
          }
        }
        this[type + 'Volume'] = this.fixNum(value, this.market.volume_fixed)
        this[type + 'Total'] = this.fixNum(+this[type + 'Volume'] * +this[type + 'Price'], this.market.volume_fixed, this.market.price_fixed)
      } else {
        this[type + 'Volume'] = this.fixNum(value, this.market.volume_fixed)
      }
    },
    handlePrice (value, type) {
      this[type + 'Price'] = this.fixNum(value, this.market.price_fixed)
      if (this[type + 'Volume']) {
        var num = this.fixNum(this[type + 'Volume'] * value, this.market.volume_fixed, this.market.price_fixed)
        this[type + 'Total'] = num
        if (type === 'buy') {
          if (num > this.buyAccount) {
            this.buyVolume = this.fixNum(this.buyAccount / value, this.market.volume_fixed)
            this.buyTotal = this.fixNum(this.buyVolume * value, this.market.volume_fixed, this.market.price_fixed)
          }
        }
      }
    },
    handleTotal (value, type) {
      if (type === 'buy') {
        if (value > +this.buyAccount) {
          value = this.fixNum(this.buyAccount, this.market.volume_fixed, this.market.price_fixed)
        }
      }
      if (this[type + 'Price']) {
        var num = value / this[type + 'Price']
        if (type === 'sell') {
          if (num > this.sellAccount) {
            num = this.sellAccount
          }
        }
        this[type + 'Volume'] = this.fixNum(num, this.market.volume_fixed)
        value = this.fixNum(this[type + 'Volume'] * this[type + 'Price'], this.market.volume_fixed, this.market.price_fixed)
      }
      this[type + 'Total'] = this.fixNum(value, this.market.volume_fixed, this.market.price_fixed)
    },
    fixNum (value, num, num1) {
      var nums = num1 ? (num > num1 ? num : num1) : num
      var e = Math.pow(10, nums)
      return Math.floor(e * +value) / e
    },
    confirmTrade: function (bool) {
      this.showDialog = false
      if (bool) {
        if (this.order_type === 'buy') {
          this.confirmBuy()
        } else if (this.order_type === 'sell') {
          this.confirmSell()
        }
      } else {
        this.isDisabled = false
      }
    },
    confirmBuy: function (bool) {
      this._post({
        url: '/markets/' + this.market.code + '/order_bids',
        data: {
          order_bid: {
            ord_type: 'limit',
            price: this.buyPrice,
            origin_volume: this.buyVolume
          }
        }
      }, this.orderCallback)
    },
    confirmSell: function (bool) {
      this._post({
        url: '/markets/' + this.market.code + '/order_asks',
        data: {
          order_ask: {
            ord_type: 'limit',
            price: this.sellPrice,
            origin_volume: this.sellVolume
          }
        }
      }, this.orderCallback)
    },
    orderCallback: function (data) {
      if (data.status === 200) {
        this.isDisabled = false
        this.resetForm()
        this.status = 'success'
      } else {
        this.isDisabled = false
        this.status = 'fail'
      }
    },
    loginCheck: function () {
      if (this.sn === 'unlogin') {
        location.href = `${process.env.HOST_URL}/signin?from=${location.href}`
      }
    },
    orderBid: function () {
      this.loginCheck()
      if (!this.buyPrice || !this.buyVolume) {
        return
      }
      this.order_type = 'buy'
      this.showDialog = true
      // this.isDisabled = true
    },
    orderAsk: function () {
      this.loginCheck()
      if (!this.sellPrice || !this.sellVolume) {
        return
      }
      this.order_type = 'sell'
      this.showDialog = true
      // this.isDisabled = false
    },
    resetForm () {
      [
        this.buyPrice,
        this.buyVolume,
        this.buyTotal,
        this.sellPrice,
        this.sellVolume,
        this.sellTotal
      ] = []
    },
    addInputs (percent) {
      var type = this.type
      if (!this[type + 'Price'] || this[type + 'Price'] === 0) {
        this[type + 'Price'] = this.market.last
      }
      if (type === 'buy') {
        this.buyTotal = this.accounts[this.market.base_currency].balance * percent
        this.handleTotal(this.buyTotal, 'buy')
      } else if (type === 'sell') {
        this.sellVolume = this.accounts[this.market.quote_currency].balance * percent
        this.handleVol(this.sellVolume, 'sell')
      }
    }
  }
}
</script>

<style lang="scss">
  @import './order.scss'
</style>
