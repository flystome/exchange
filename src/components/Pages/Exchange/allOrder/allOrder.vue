<template>
  <section id="allOrder">
    <ul class="hd clearfix">
      <li v-for="hd in hds" :key="'market'+hd">{{$t(hd)}}</li>
    </ul>
    <ul class="bd">
      <li v-for='item in tradesData' :key='"trade"+item.tid'>
        <div class="time">{{item.date * 1000 | dayTime}}</div>
        <div class="my"><img src="~Img/ok.svg" v-show='item.isMine'></div>
        <div class="price" :class='{"up": item.trend === "up", "down": item.trend === "down"}'>{{item.price | fixedNum(market.price_fixed)}}</div>
        <div class="volume">{{item.amount | fixedNum(market.volume_fixed)}}</div>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'allOrder',
  props: ['tradesData', 'market'],
  data () {
    return {
      hds: ['exchange.trades.time', 'exchange.trades.price', 'exchange.trades.volume']
    }
  }
}
</script>

<style lang="scss">
  @import './allOrder.scss'
</style>
