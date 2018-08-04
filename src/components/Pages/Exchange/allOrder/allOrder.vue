<template>
  <section id="allOrder">
    <ul class="hd clearfix">
      <li v-for="hd in hds" :key="'market'+hd">{{$t(hd)}}</li>
    </ul>
    <scrollBar classes='myScroll'>
      <ul class="order_bd">
        <transition-group name="slide-fade" mode='out-in'>
          <li v-for='item in tradesData' :key='"trade"+item.tid'>
            <div class="time">{{item.date | dayTime}}</div>
            <div class="my"><img src="~Img/ok.svg" v-show='item.isMine'></div>
            <div class="price" :class='{"up": item.trend === "up", "down": item.trend === "down"}'>{{item.price | fixedNum(market.price_fixed)}}</div>
            <div class="volume">{{item.amount | fixedNum(market.volume_fixed)}}</div>
          </li>
        </transition-group>
      </ul>
    </scrollBar>
    <!-- <div class="maker">
      <ul class="mk_hd clearfix">
        <li class="mk1">{{$t('exchange.maker')}}</li>
        <li class="mk2">{{$t('exchange.maker_24h')}}({{market.base_currency | upper}})</li>
      </ul>
      <scrollBar classes='myScroll1'>
        <ul class="mk_bd">
          <transition-group name="slide-fade">
            <li> -->
              <!-- <li v-for='item in tradesData' :key='"maker_"+item.date/1000'> -->
              <!-- div class="mk1">1</div>
              <div class="mk2">1</div>
            </li>
        </ul>
      </scrollBar>
    </div> -->
  </section>
</template>

<script>
import scrollBar from 'vue2-scrollbar'
export default {
  name: 'allOrder',
  props: ['tradesData', 'market'],
  data () {
    return {
      hds: ['exchange.trades.time', 'exchange.trades.price', 'exchange.trades.volume']
    }
  },
  components: { scrollBar }
}
</script>

<style lang="scss" scoped>
  @import './allOrder.scss';
</style>
