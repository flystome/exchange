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
      <div class="candle">
        <candleStick :market="market"></candleStick>
      </div>
      <div class="depth">

      </div>
    </div>
  </section>
</template>

<script>
import candleStick from './candleStick/candleStick'

export default {
  name: 'chart',
  props: ['market'],
  data () {
    return {
      heads: ['candle', 'depth'],
      currencyIndex: 0
    }
  },
  components: {
    candleStick
  }
}
</script>

<style lang="scss">
  @import './chart.scss'
</style>
