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
      <div class="candle" :class="{'zIndex': !currencyIndex}">
        <candleStick :market="market"></candleStick>
      </div>
      <div class="depths" :class="{'zIndex': currencyIndex}">
        <depths :depthData='depthData' :market="market" :chartInit='currencyIndex === 1'></depths>
      </div>
    </div>
  </section>
</template>

<script>
import candleStick from './candleStick/candleStick'
import depths from './depths/depths'

export default {
  name: 'chart',
  props: ['market', 'depthData'],
  data () {
    return {
      heads: ['candle', 'depth'],
      currencyIndex: 0
    }
  },
  components: {
    candleStick,
    depths
  }
}
</script>

<style lang="scss" scoped>
  @import './chart.scss'
</style>
