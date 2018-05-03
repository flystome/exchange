<template>
  <section id="chart">
    <ul class="chart_hd">
      <li v-for="(head, index) in heads"
          :key='head'
          :class="{'on': index === currencyIndex}"
          @click="currencyIndex=index"
      >{{$t("exchange." + head)}}</li>
    </ul>
    <div class="chart_bd">
      <div class="candle" v-show='currencyIndex === 0'>
        <candleStick :market="market"></candleStick>
      </div>
      <div class="depth" v-show='currencyIndex === 1'>
        <depths :market="market"></depths>
      </div>
    </div>
  </section>
</template>

<script>
import candleStick from './candleStick/candleStick'
import depths from './depths/depths'

export default {
  name: 'chart',
  props: ['market'],
  data () {
    return {
      heads: ['candle', 'depth'],
      currencyIndex: 1
    }
  },
  components: {
    candleStick,
    depths
  }
}
</script>

<style lang="scss">
  @import './chart.scss'
</style>
