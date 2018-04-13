<template>
  <div class="orderList" :class="{'notPending': notPending}">
    <ul class="hd">
      <li>
        <div class="time">{{$t('exchange.myorder.time')}}</div>
        <div class="market">{{$t('exchange.myorder.market')}}</div>
        <div class="type">{{$t('exchange.myorder.type')}}</div>
        <div class="price">{{$t('exchange.myorder.price')}}</div>

        <div class="volume">{{$t('exchange.myorder.volume')}}</div>
        <div class="percent">{{$t('exchange.myorder.percent')}}</div>
        <div class="traded">{{$t('exchange.myorder.traded')}}</div>
        <div class="status">{{$t('exchange.myorder.status')}}</div>
        <div class="cancel"></div>
      </li>
    </ul>
    <ul class="bd">
      <li v-for="item in myOrders" :class='{"hoverBg": cancel && id === item.id}' :key="item.market+item.id" @mouseenter='addBg(item.id)' @mouseleave='cancel=false'>
        <div class="time">{{item.at * 1000 | time | timeNoYear}}</div>
        <div class="market">{{item.market_name}}</div>
        <div class="type" :class='{"up": item.kind==="bid", "down": item.kind==="ask"}'>{{$t('exchange.myorder.'+item.kind)}}</div>
        <div class="price">{{item.price}}</div>

        <div class="volume">{{item.origin_volume}}</div>
        <div class="percent">{{item.close_rate}}</div>
        <div class="traded">{{item.origin_volume - item.volume}}</div>
        <div class="status">{{$t('exchange.myorder.'+item.state)}}</div>
        <div class="cancel" v-show='cancel && id === item.id' @click="cancelOrder(item.id)">{{$t('exchange.myorder.cancel_one')}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'orderList',
  props: ['myOrders', 'notPending'],
  data () {
    return {
      cancel: false,
      id: 0
    }
  },
  computed: {
    ...mapState(['language'])
  },
  filters: {
    timeNoYear (params) {
      return params.substring(5)
    }
  },
  methods: {
    cancelOrder (id) {
      this.$emit('cancel', id)
    },
    addBg (id) {
      if (this.notPending) {
        return
      }
      this.id = id
      this.cancel = true
    }
  }
}
</script>

<style lang="scss">
  @import './orderList.scss'
</style>
