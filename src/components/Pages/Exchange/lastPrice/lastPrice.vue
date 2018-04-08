<template>
  <section id="lastPrice">
    <ul>
      <li>
        <span class="name">{{$t('exchange.header.last_price')}}</span>
        <span class="value">{{market.last}} {{market.base_currency}}</span>
      </li>
      <li>
        <span class="name">{{$t('exchange.header.change_24')}}</span>
        <span class="value">{{market.last - market.open}} {{market.base_currency}}</span>
      </li>
      <li>
        <span class="name">{{$t('exchange.header.high_price')}}</span>
        <span class="value">{{market.high}} {{market.base_currency}}</span>
      </li>
      <li>
        <span class="name">{{$t('exchange.header.low_price')}}</span>
        <span class="value">{{market.low}} {{market.base_currency}}</span>
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
