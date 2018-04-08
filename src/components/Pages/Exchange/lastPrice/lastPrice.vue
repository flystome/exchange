<template>
  <section id="lastPrice">
    <ul>
      <li>
        <span class="name">{{$t('exchange.header.last_price')}}</span>
        <span class="value">{{market.last | fixedNum(market.price_fixed)}} {{market.base_currency | upper}}</span>
      </li>
      <li>
        <span class="name">{{$t('exchange.header.change_24')}}</span>
        <span class="value">{{market.last - market.open | fixedNum(market.price_fixed)}} {{market.base_currency | upper}}</span>
      </li>
      <li>
        <span class="name">{{$t('exchange.header.high_price')}}</span>
        <span class="value">{{market.high| fixedNum(market.price_fixed)}} {{market.base_currency | upper}}</span>
      </li>
      <li>
        <span class="name">{{$t('exchange.header.low_price')}}</span>
        <span class="value">{{market.low | fixedNum(market.price_fixed)}} {{market.base_currency | upper}}</span>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'lastPrice',
  props: ['market'],
  data () {
    return {

    }
  }
}
</script>

<style lang="scss">
  @import './lastPrice.scss'
</style>
