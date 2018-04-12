<template>
  <section id="myOrder">
    <div class="head">
      <ul class="tab_filter tab_order_filter" v-show='isOrder'>
        <li @click='getBuy'>{{$t('exchange.myorder.buy')}}</li>
        <li @click='getSell'>{{$t('exchange.myorder.sell')}}</li>
        <li @click='getAll'>{{$t('exchange.myorder.all')}}</li>
        <li @click='cancelAll'>{{$t('exchange.myorder.cancel_all')}}</li>
      </ul>
      <ul class="tab_filter tab_history_filter" v-show='!isOrder'>
        <li>{{$t('exchange.myorder.last3')}}</li>
        <li>{{$t('exchange.myorder.last7')}}</li>
        <li>{{$t('exchange.myorder.more')}}</li>
      </ul>
      <ul class="tab_hd">
        <li v-for="(head, index) in heads" :key='$t(head)' :class="{'on': index === currencyIndex}" @click='changeTab(index)'>{{$t(head)}}</li>
      </ul>
    </div>
    <div class="tab_bd">
      <div class="noneData" v-show="curOrders.length === 0">{{$t('exchange.myorder.noData')}}</div>
      <orderList :myOrders='curOrders' :notPending='notPending' v-show="curOrders.length !== 0"></orderList>
    </div>
  </section>
</template>

<script>
import orderList from './orderList/orderList'

export default {
  name: 'myOrder',
  props: ['myOrders'],
  components: {
    orderList
  },
  data () {
    return {
      heads: ['exchange.myorder.pending', 'exchange.myorder.history', 'exchange.myorder.filling'],
      item1: ['exchange.myorder.buy', 'exchange.myorder.sell', 'exchange.myorder.all', 'exchange.myorder.cancel_all'],
      item2: ['exchange.myorder.last3', 'exchange.myorder.last7', 'exchange.myorder.more'],
      isOrder: true,
      currencyIndex: 0,
      curOrders: [],
      hisOrders: [],
      filling: [],
      notPending: false
    }
  },
  watch: {
    myOrders (val) {
      this.curOrders = val
    }
  },
  methods: {
    changeTab (index) {
      var self = this
      this.currencyIndex = index
      if (index === 0) {
        this.isOrder = true
        this.curOrders = this.myOrders
        this.notPending = false
      } else if (index === 1) {
        this.isOrder = false
        this.notPending = true
        this._get({
          url: '/history/all_orders.json'
        }, function (res) {
          if (res.status === 200) {
            console.log(res.data)
            self.hisOrders = res.data.orders
            self.curOrders = self.hisOrders
          }
        })
      } else if (index === 2) {
        this.isOrder = false
        this.notPending = true
        this._get({
          url: '/history/all_trades.json'
        }, function (res) {
          if (res.status === 200) {
            console.log(res.data)
            self.filling = res.data.trades
            self.curOrders = self.filling
          }
        })
      }
    },
    getBuy () {
      this.curOrders = this.myOrders.filter(ele => {
        return ele['kind'] === 'bid'
      })
    },
    getSell () {
      this.curOrders = this.myOrders.filter(ele => {
        return ele['kind'] === 'ask'
      })
    },
    getAll () {
      this.curOrders = this.myOrders
    },
    cancelAll () {

    },
    get3Day () {

    },
    get7Day () {

    }
  }
}
</script>

<style lang="scss">
  @import './myOrder.scss'
</style>
