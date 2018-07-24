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
        <p v-if='loginData === "none"' class="loginTip">{{$t('exchange.unlogin.please')}}<a :href="`${ROUTER_VERSION}/login?from=${ROUTER_VERSION}/exchange/${curMarket}`">{{$t('exchange.unlogin.login')}}</a>{{$t('exchange.unlogin.or')}}<a :href="`${ROUTER_VERSION}/register?from=${ROUTER_VERSION}/exchange/${curMarket}`">{{$t('exchange.unlogin.register')}}</a></p>
        <div v-if='loginData !== "none"' class="myTotal">{{buyAccount | fixedNum(market.price_fixed, market.volume_fixed)}} {{market.base_currency | upper}}</div>
      </div>
      <a class="buy_btn btn" href="###" @click.prevent="orderBid()">{{$t('exchange.buy')}}{{market.quote_currency | upper}}</a>
    </div>
    <div class="sell handleOrder" v-if='type==="sell"'>
      <div class="put">
        <div class="name">{{$t('markets.price')}}</div>
        <div class="price input_box">
          <input type="number" v-model='sellPrice' @change='handlePrice($event.target.value, "sell")' :placeholder="$t('markets.price')">
          <span>{{market.base_currency | upper}}</span>
          <transition name="fade">
            <div class="warning" v-if='sellwarning'>{{$t('exchange.priceWarn')}}</div>
          </transition>
        </div>
      </div>
      <div class="put">
        <div class="name">{{$t('exchange.volume')}}</div>
        <div class="volume input_box">
          <input type="number" v-model='sellVolume' @input='handleVol($event.target.value, "sell")' :placeholder="$t('exchange.volume')">
          <span>{{market.quote_currency | upper}}</span>
        </div>
      </div>
      <div class="put">
        <div class="name">{{$t('markets.total')}}</div>
        <div class="total input_box">
          <input type="number" v-model='sellTotal' @input='handleTotal($event.target.value, "sell")' :placeholder="$t('markets.total')">
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
        <p v-if='loginData === "none"' class="loginTip">{{$t('exchange.unlogin.please')}}<a :href="`${ROUTER_VERSION}/login?from=${ROUTER_VERSION}/exchange/${curMarket}`">{{$t('exchange.unlogin.login')}}</a>{{$t('exchange.unlogin.or')}}<a :href="`${ROUTER_VERSION}/register?from=${ROUTER_VERSION}/exchange/${curMarket}`">{{$t('exchange.unlogin.register')}}</a></p>
        <div v-if='loginData !== "none"' class="myTotal">{{sellAccount | fixedNum(market.volume_fixed)}} {{market.quote_currency | upper}}</div>
      </div>
      <a class="sell_btn btn" @click.prevent="orderAsk()">{{$t('exchange.sell')}}{{market.quote_currency | upper}}</a>
    </div>
  </section>

</template>

<script>
import { BigNumber } from 'bignumber.js'
import { bus } from '@/common/js/bus/index'
import { mapMutations } from 'vuex'

export default {
  name: 'order',
  props: ['market', 'type', 'accounts', 'loginData', 'curMarket'],
  data () {
    return {
      ROUTER_VERSION: process.env.ROUTER_VERSION,
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
      sellIndex: -1,
      times: 0
    }
  },
  mounted () {
    bus.$on('addOrder', (type, price, vol) => {
      this.buyPrice = price
      this.sellPrice = price
      if (type === 'sell') {
        this.handleVol(vol, 'buy')
        this.sellVolume = ''
        this.sellTotal = ''
      } else {
        this.handleVol(vol, 'sell')
        this.buyVolume = ''
        this.buyTotal = ''
      }
    })
  },
  watch: {
    accounts (val) {
      if (val) {
        this.buyAccount = (val[this.market.base_currency] && val[this.market.base_currency].balance) || 0
        this.sellAccount = (val[this.market.quote_currency] && val[this.market.quote_currency].balance) || 0
      }
    }
  },
  methods: {
    handlePrice (value, type) {
      if (this.loginData === 'none') {
        this[type + 'Price'] = ''
        return
      }
      if (value === '') return ''
      this[type + 'Price'] = this.fixNum(value, this.market.price_fixed)
      var distance = Math.abs(this[type + 'Price'] - this.market.last) / this.market.last
      if (distance > 0.1) {
        this[type + 'warning'] = true
        this.resetOrderStatus()
      }
      if (this[type + 'Volume']) {
        var Price = new BigNumber(this[type + 'Price'])
        var Volume = new BigNumber(this[type + 'Volume'])
        this.handleTotal(null, type, Price, Volume)
      }
    },
    handleVol (value, type, from) {
      if (this.loginData === 'none') {
        this[type + 'Volume'] = ''
        return
      }
      if (value === '') return ''
      if (value < 0) {
        value = Math.abs(value)
      }
      if (from === 'total') {
        value = +value.toString()
      }
      this[type + 'Volume'] = this.fixNum(value, this.market.volume_fixed)
      if (type === 'sell') {
        if (this.sellVolume > this.sellAccount) {
          this.sellVolume = this.fixNum(this.sellAccount, this.market.volume_fixed)
        }
      }
      if (this[type + 'Price']) {
        var Price = new BigNumber(this[type + 'Price'])
        var Volume = new BigNumber(this[type + 'Volume'])
        this.handleTotal(null, type, Price, Volume)
      }
    },
    handleTotal (value, type, price, volume) {
      if (this.loginData === 'none') {
        this[type + 'Total'] = ''
        return
      }
      if (value === ' ') return ''
      if (value < 0) {
        value = Math.abs(value)
      }
      if (!value) {
        var p = new BigNumber(price)
        var v = new BigNumber(volume)
        value = p.multipliedBy(v)
      }
      if (type === 'buy') {
        if (this.buyAccount && value > this.buyAccount) {
          value = new BigNumber(this.buyAccount)
          v = value.dividedBy(price)
          this.handleVol(v, 'buy', 'total')
          // value = this.fixNum(this.buyAccount, this.market.volume_fixed, this.market.price_fixed)
        }
      } else if (type === 'sell') {
        if (this.sellAccount && volume > this.sellAccount) {
          v = new BigNumber(this.sellAccount)
          value = volume.multipliedBy(p)
          // this.handleVol(v, 'sell', 'total')
        }
      }
      value = +value.toString()
      this[type + 'Total'] = this.fixNum(value, this.market.volume_fixed, this.market.price_fixed)
    },
    fixNum (value, num, num1) {
      if (value === ' ') return ''
      if ((/[0-9]+\.0*$/).test(value)) return value
      if (+value < 0) {
        value = Math.abs(value)
      }
      var nums = num1 ? (num > num1 ? num : num1) : num
      var arr = value.toString().split('.')
      if (arr.length > 2) {
        arr = arr.splice(1, arr.length - 2)
      }
      if (arr[1] && arr[1].length > nums) {
        arr[1] = arr[1].substring(0, nums)
      }
      return arr.join('.')
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
        // for (var i = 0; i < 100; i++) {
        //   this.testOrder(i)
        // }
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
        // console.log(data)
        this.orderCallback(data, 'sell')
      })
    },
    // testOrder (i) {
    //   this._post({
    //     url: '/markets/' + this.market.code + '/order_asks',
    //     data: {
    //       order_ask: {
    //         ord_type: 'limit',
    //         price: 0.5,
    //         origin_volume: 0.6
    //       }
    //     }
    //   }, (data) => {
    //     if (data.data.success) {
    //       this.times++
    //       console.log(this.times)
    //     }
    //     this.orderCallback(data, 'sell')
    //   })
    // },
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
        location.href = `${this.ROUTER_VERSION}/login?from=${this.location}`
      } else if (data.error.code === 1002) {
        this.showDialog = true
        this.ordering = false
        this.tips = true
      } else if (data.error.code === 1108) {
        var time = this.$moment(data.error.restraint_expire_at).format('YYYY-MM-DD H:mm:ss')
        this.PopupBoxDisplay({message: `${this.$t('global.err_1108')} ${time}`, type: 'error'})
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
    orderBid: function () {
      if (this.loginData === 'none') {
        location.href = `${this.ROUTER_VERSION}/login?from=${this.ROUTER_VERSION}/exchange/${this.curMarket}`
        return ''
      }
      if (!this.buyPrice || !this.buyVolume) {
        return
      }
      this.order_type = 'buy'
      this.showDialog = true
      this.ordering = true
      this.tips = false
    },
    orderAsk: function () {
      if (this.loginData === 'none') {
        location.href = `${this.ROUTER_VERSION}/login?from=${this.ROUTER_VERSION}/exchange/${this.curMarket}`
        return ''
      }
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
      this.sellIndex = -1
      this.buyIndex = -1
    },
    addInputs (percent, index) {
      var type = this.type
      var p = 0
      this[type + 'Index'] = index
      if (!this[type + 'Price'] || this[type + 'Price'] === 0) {
        p = new BigNumber(this.market.last)
        this.handleVol(0, 'buy')
        this.handlePrice(this.market.last, type)
      } else {
        p = new BigNumber(this[type + 'Price'])
      }
      if (type === 'buy') {
        var value = this.accounts[this.market.base_currency].balance * percent
        if (value.toString().length > 14) {
          value = value.toFixed(8)
        }
        var val = new BigNumber(value)
        var v = val.dividedBy(p)
        this.buyTotal = this.fixNum(+value, this.market.volume_fixed, this.market.price_fixed)
        this.handleVol(v, 'buy', 'from')
      } else if (type === 'sell') {
        this.sellVolume = this.fixNum(+this.accounts[this.market.quote_currency].balance * percent, this.market.volume_fixed)
        this.handleTotal(null, 'sell', p, this.sellVolume)
      }
    },
    ...mapMutations(['PopupBoxDisplay'])
  }
}
</script>

<style lang="scss">
  @import './order.scss'
</style>
