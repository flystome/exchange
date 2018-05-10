<template>
  <section id="order">
    <div class="dialog" v-show='showDialog'>
      <div class="mask"></div>
      <div class="dia_content" v-if="ordering">
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
          <span class="confirm" @click="confirmTrade(true)">{{$t('markets.ok')}}</span>
          <span class="cancel" @click="confirmTrade(false)">{{$t('markets.cancel')}}</span>
        </div>
      </div>
      <div class="tip_info" v-if='tips'>
        <p class="market_close">{{$t('exchange.marketClose')}}</p>
      </div>
    </div>
    <div class="buy handleOrder" v-if='type==="buy"'>
      <div class="put">
        <div class="name">{{$t('markets.price')}}</div>
        <div class="price input_box">
          <input type="number" v-model='buyPrice' @change='handlePrice($event.target.value, "buy")' :placeholder="$t('markets.price')">
          <span>{{market.base_currency | upper}}</span>
          <transition name="fade">
            <div class="warning" v-if='buywarning'>{{$t('exchange.priceWarn')}}</div>
          </transition>
        </div>
      </div>
      <div class="put">
        <div class="name">{{$t('exchange.volume')}}</div>
        <div class="volume input_box">
          <input type="number" v-model='buyVolume' @input='handleVol($event.target.value, "buy")' :placeholder="$t('exchange.volume')">
          <span>{{market.quote_currency | upper}}</span>
        </div>
      </div>
      <div class="put">
        <div class="name">{{$t('markets.total')}}</div>
        <div class="total input_box">
          <input type="number" v-model='buyTotal' @input='handleTotal($event.target.value, "buy")' :placeholder="$t('markets.total')">
          <span>{{market.base_currency | upper}}</span>
        </div>
      </div>
      <div class="put">
        <div class="percent">
          <span v-for='(item, index) in percent' :class="{'on': buyIndex === index}" :key='"btn"+item[1]' @click="addInputs(item[1], index)">{{item[0]}}</span>
        </div>
      </div>
      <div class="tip">
        <div class="success" v-if='buySuccess'><i class="fa fa-check"></i>{{$t('exchange.success')}}</div>
        <div class="fail" v-if='buyFail'><i class="fa fa-close"></i>{{$t('exchange.fail')}}</div>
        <p v-if='loginData === "none"' class="loginTip">{{$t('exchange.unlogin.please')}}<a :href="`${HOST_URL}/signin?from=${location}`">{{$t('exchange.unlogin.login')}}</a>{{$t('exchange.unlogin.or')}}<a :href="`${HOST_URL}/signup?from=${location}`">{{$t('exchange.unlogin.register')}}</a></p>
        <div v-if='loginData !== "none"' class="myTotal">{{buyAccount | fixedNum(market.price_fixed, market.volume_fixed)}} {{market.base_currency | upper}}</div>
      </div>
      <a class="buy_btn btn" href="###" @click.prevent="orderBid()">{{$t('exchange.buy')}}{{market.quote_currency | upper}}</a>
    </div>
    <div class="sell handleOrder" v-if='type==="sell"'>
      <div class="put">
        <div class="name">{{$t('markets.price')}}</div>
        <div class="price input_box">
          <input type="number" step="0.00000001" v-model='sellPrice' @change='handlePrice($event.target.value, "sell")' :placeholder="$t('markets.price')">
          <span>{{market.base_currency | upper}}</span>
          <transition name="fade">
            <div class="warning" v-if='sellwarning'>{{$t('exchange.priceWarn')}}</div>
          </transition>
        </div>
      </div>
      <div class="put">
        <div class="name">{{$t('exchange.volume')}}</div>
        <div class="volume input_box">
          <input type="number" step="0.00000001" v-model='sellVolume' @input='handleVol($event.target.value, "sell")' :placeholder="$t('exchange.volume')">
          <span>{{market.quote_currency | upper}}</span>
        </div>
      </div>
      <div class="put">
        <div class="name">{{$t('markets.total')}}</div>
        <div class="total input_box">
          <input type="number" step="0.00000001" v-model='sellTotal' @input='handleTotal($event.target.value, "sell")' :placeholder="$t('markets.total')">
          <span>{{market.base_currency | upper}}</span>
        </div>
      </div>
      <div class="put">
        <div class="percent">
          <span v-for='(item, index) in percent' :class="{'on': sellIndex === index}" :key='"btn"+item[1]' @click="addInputs(item[1], index)">{{item[0]}}</span>
        </div>
      </div>
      <div class="tip">
        <div class="success" v-if='sellSuccess'><i class="fa fa-check"></i>{{$t('exchange.success')}}</div>
        <div class="fail" v-if='sellFail'><i class="fa fa-close"></i>{{$t('exchange.fail')}}</div>
        <p v-if='loginData === "none"' class="loginTip">{{$t('exchange.unlogin.please')}}<a :href="`${HOST_URL}/signin?from=${location}`">{{$t('exchange.unlogin.login')}}</a>{{$t('exchange.unlogin.or')}}<a :href="`${HOST_URL}/signup?from=${location}`">{{$t('exchange.unlogin.register')}}</a></p>
        <div v-if='loginData !== "none"' class="myTotal">{{sellAccount | fixedNum(market.volume_fixed)}} {{market.quote_currency | upper}}</div>
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
      HOST_URL: process.env.HOST_URL,
      location: location.href,
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
      percent: [['1/4', 0.25], ['1/3', 0.333], ['1/2', 0.5], ['All', 1]],
      sellSuccess: false,
      sellFail: false,
      buySuccess: false,
      buyFail: false,
      tips: false,
      ordering: false,
      buywarning: false,
      sellwarning: false,
      buyIndex: -1,
      sellIndex: -1
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
      this.buyAccount = (val[this.market.base_currency] && val[this.market.base_currency].balance) || 0
      this.sellAccount = (val[this.market.quote_currency] && val[this.market.quote_currency].balance) || 0
    },
    loginData (val, oldValue) {
      this.sn = val.sn
      return val
    }
  },
  methods: {
    handleVol (value, type) {
      if (value === ' ') return
      if (value < 0) {
        value = Math.abs(value)
      }
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
      if (value === ' ') return
      this[type + 'Price'] = this.fixNum(value, this.market.price_fixed)
      var distance = Math.abs(this[type + 'Price'] - this.market.last) / this.market.last
      if (distance > 0.1) {
        this[type + 'warning'] = true
        this.resetOrderStatus()
      }
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
      if (value === ' ') return
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
      if (value === ' ') return
      if ((/[0-9]+\.0*$/).test(value)) return value
      if (+value < 0) {
        value = Math.abs(value)
      }
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
      }, (data) => {
        this.orderCallback(data, 'buy')
      })
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
      }, (data) => {
        this.orderCallback(data, 'sell')
      })
    },
    orderCallback (res, type) {
      var data = res.data
      if (data.success) {
        this.isDisabled = false
        this.resetForm()
        this.status = 'success'
        this[type + 'Success'] = true
        this.resetOrderStatus()
        this.$emit('play', 'order_audio')
      } else if (data.error.code === 1102) {
        location.href = `${process.env.HOST_URL}/signin?from=${location.href}`
      } else if (data.error.code === 1002) {
        this.showDialog = true
        this.ordering = false
        this.tips = true
      } else {
        this[type + 'Fail'] = true
        this.isDisabled = false
        this.status = 'fail'
        this.resetOrderStatus()
      }
    },
    play (obj) {
      obj.play()
    },
    resetOrderStatus () {
      var time = setTimeout(() => {
        [this.buySuccess, this.buyFail, this.sellSuccess, this.sellFail, this.sellwarning, this.buywarning] = []
        clearTimeout(time)
      }, 5000)
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
      this.ordering = true
      this.tips = false
    },
    orderAsk: function () {
      this.loginCheck()
      if (!this.sellPrice || !this.sellVolume) {
        return
      }
      this.order_type = 'sell'
      this.showDialog = true
      this.ordering = true
      this.tips = false
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
    addInputs (percent, index) {
      var type = this.type
      this[type + 'Index'] = index
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
    },
    showNotice () {
      Notification.requestPermission((permit) => {
        if (permit === 'granted') {
          var notification = new Notification('This is a Notice', {
            dir: 'auto',
            icon: '/static/img/ok.svg',
            body: 'hahahah',
            renotify: true
          })
          console.log(notification)
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import './order.scss'
</style>
