<template>
  <section id="lastPrice">
    <ul>
      <li>
        <span class="name">{{$t('exchange.lastPrice')}}</span>
        <span class="value">{{lastPriceData.last}}</span>
      </li>
      <li>
        <span class="name">{{$t('exchange.change_24')}}</span>
        <span class="value">{{lastPriceData.last - lastPriceData.open}}</span>
      </li>
      <li>
        <span class="name">{{$t('exchange.high_price')}}</span>
        <span class="value">{{lastPriceData.high}}</span>
      </li>
      <li>
        <span class="name">{{$t('exchange.low_price')}}</span>
        <span class="value">{{lastPriceData.low}}</span>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'lastPrice',
  props: ['lastPriceData'],
  data () {
    return {

    }
  }
}
</script>

<style lang="scss">
  @import './lastPrice.scss'
</style>
