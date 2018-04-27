<template>
  <section id="myOrder">
    <div class="dialog" v-show='showDialog'>
      <div class="mask"></div>
      <div class="dia_content">
        <div class="text">
          <p class="cancel_one" v-if="cancelNum === 'one'">{{$t('orders.dialog.cancel')}}</p>
          <p class="cancel_all" v-if="cancelNum === 'all'">{{$t('orders.dialog.cancel_all')}}</p>
        </div>
        <div class="confirm_box">
          <span class="confirm" @click="confirmOrder(true)">{{$t('markets.ok')}}</span>
          <span class="cancel" @click="confirmOrder(false)">{{$t('markets.cancel')}}</span>
        </div>
      </div>
    </div>
    <div class="head">
      <ul class="tab_filter tab_order_filter" v-show='isOrder'>
        <li :class="{on: filterIndex === 0}" @click='getBuy'>{{$t('exchange.myorder.buy')}}</li>
        <li :class="{on: filterIndex === 1}" @click='getSell'>{{$t('exchange.myorder.sell')}}</li>
        <li :class="{on: filterIndex === 2}" @click='getAll'>{{$t('exchange.myorder.all')}}</li>
        <li @click='cancelAll'>{{$t('exchange.myorder.cancel_all')}}</li>
      </ul>
      <ul class="tab_filter tab_history_filter" v-show='!isOrder'>
        <li @click='get3Day'>{{$t('exchange.myorder.last3')}}</li>
        <li @click='get7Day'>{{$t('exchange.myorder.last7')}}</li>
        <li @click="goMore">{{$t('exchange.myorder.more')}}</li>
      </ul>
      <ul class="tab_hd">
        <li v-for="(head, index) in heads" :key='"head"+index' :class="{'on': index === currencyIndex}" @click='changeTab(index)'>{{$t(head)}}</li>
      </ul>
    </div>
    <div class="tab_bd">
      <div class="noneData" v-show="curOrders && curOrders.length === 0">{{$t('exchange.myorder.noData')}}</div>
      <orderList :myOrders='curOrders' :market='market' :notPending='notPending' v-show="curOrders.length !== 0" @cancel="cancelOne"></orderList>
    </div>
  </section>
</template>

<script>
import orderList from './orderList/orderList'

export default {
  name: 'myOrder',
  props: ['myOrders', 'market'],
  components: {
    orderList
  },
  data () {
    return {
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      heads: ['exchange.myorder.pending', 'exchange.myorder.history', 'exchange.myorder.filling'],
      item1: ['exchange.myorder.buy', 'exchange.myorder.sell', 'exchange.myorder.all', 'exchange.myorder.cancel_all'],
      item2: ['exchange.myorder.last3', 'exchange.myorder.last7', 'exchange.myorder.more'],
      isOrder: true,
      currencyIndex: 0,
      curOrders: [],
      hisOrders: false,
      filling: false,
      notPending: false,
      showDialog: false,
      cancelNum: 'one',
      id: 0,
      hisOrFill: '',
      filterIndex: 2
    }
  },
  watch: {
    myOrders (val) {
      this.curOrders = val[this.currencyIndex]
    }
  },
  methods: {
    changeTab (index) {
      this.currencyIndex = index
      this.curOrders = this.myOrders[index]
      if (index === 0) {
        this.isOrder = true
        this.notPending = false
        this.hisOrFill = ''
      } else if (index === 1) {
        this.isOrder = false
        this.notPending = true
        this.hisOrFill = 'his'
        if (this.hisOrders) {
          return
        }
        this.hisOrders = true
        this.$emit('getMyOrder', 1)
      } else if (index === 2) {
        this.isOrder = false
        this.notPending = true
        this.hisOrFill = 'fill'
        if (this.filling) {
          return
        }
        this.filling = true
        this.$emit('getMyOrder', 2)
      }
    },
    getBuy () {
      this.filterIndex = 0
      this.curOrders = this.myOrders[this.currencyIndex].filter(ele => {
        return ele['kind'] === 'bid'
      })
    },
    getSell () {
      this.filterIndex = 1
      this.curOrders = this.myOrders[this.currencyIndex].filter(ele => {
        return ele['kind'] === 'ask'
      })
    },
    getAll () {
      this.filterIndex = 2
      this.curOrders = this.myOrders[this.currencyIndex]
    },
    confirmOrder: function (bool) {
      this.showDialog = false
      if (bool) {
        if (this.cancelNum === 'one') {
          this._delete({
            url: '/markets/' + this.market.code + '/orders/' + this.id
          })
        } else if (this.cancelNum === 'all') {
          this._delete({
            url: '/markets/' + this.market.code + '/orders/' + 0,
            data: {
              cancel_all: 'TRUE'
            }
          })
        }
      }
    },
    cancelAll () {
      if (this.myOrders[0] === this.myOrders[0].length === 0) {
        return ''
      }
      this.cancelNum = 'all'
      this.showDialog = true
    },
    cancelOne: function (id) {
      this.cancelNum = 'one'
      this.showDialog = true
      this.id = id
    },
    get3Day () {
      this.$emit('getMyOrder', this.currencyIndex, 3)
    },
    get7Day () {
      this.$emit('getMyOrder', this.currencyIndex, 7)
    },
    goMore () {
      var routeData = ''
      console.log(this.hisOrders, this.filling)
      if (this.hisOrFill === 'his') {
        routeData = this.$router.resolve({path: `${this.ROUTER_VERSION}/form/order`})
      } else if (this.hisOrFill === 'fill') {
        routeData = this.$router.resolve({path: `${this.ROUTER_VERSION}/form/trade`})
      }
      window.open(routeData.href, '_blank')
    }
  }
}
</script>

<style lang="scss">
  @import './myOrder.scss'
</style>
