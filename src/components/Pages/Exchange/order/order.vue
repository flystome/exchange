<template>
  <section id="order">
    <div class="buy handleOrder" v-if='type==="buy"'>
      <div class="price put">
        <input type="text" step="0.00000001" v-model="price" :placeholder="$t('markets.price')">
        <span>{{market.base_currency | upper}}</span>
      </div>
      <div class="volume put">
        <input type="text" step="0.00000001" v-model="volume" :placeholder="$t('markets.volume')">
        <span>{{market.quote_currency | upper}}</span>
      </div>
      <div class="total put">
        <input type="text" step="0.00000001" v-model="total" :placeholder="$t('markets.total')">
        <span>{{market.base_currency | upper}}</span>
      </div>
      <div class="percent">
        <span>1/4</span>
        <span>1/3</span>
        <span>1/2</span>
        <span>All</span>
      </div>
      <div class="tip"></div>
      <a class="buy_btn btn">{{$t('markets.buy')}}{{market.quote_currency | upper}}</a>
    </div>
    <div class="sell handleOrder" v-if='type==="sell"'>
      <div class="price put">
        <input type="text" step="0.00000001" v-model="price" :placeholder="$t('markets.price')">
        <span>{{market.base_currency | upper}}</span>
      </div>
      <div class="volume put">
        <input type="text" step="0.00000001" v-model="volume" :placeholder="$t('markets.volume')">
        <span>{{market.quote_currency | upper}}</span>
      </div>
      <div class="total put">
        <input type="text" step="0.00000001" v-model="total" :placeholder="$t('markets.total')">
        <span>{{market.base_currency | upper}}</span>
      </div>
      <div class="percent">
        <span>1/4</span>
        <span>1/3</span>
        <span>1/2</span>
        <span>All</span>
      </div>
      <div class="tip"></div>
      <a class="sell_btn btn">{{$t('markets.sell')}}{{market.base_currency | upper}}</a>
    </div>
  </section>

</template>

<script>
export default {
  name: 'order',
  props: ['market', 'type'],
  data () {
    return {
      price: '',
      volume: '',
      total: ''
    }
  }
}
</script>

<style lang="scss">
  @import './order.scss'
</style>
