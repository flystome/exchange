<template>
  <section id="order">
    <div class="price">
      <input type="number" step="0.00000001" v-model="price" :placeholder="$t('markets.price')">
    </div>
    <div class="volume">
      <input type="number" step="0.00000001" v-model="total" :placeholder="$t('markets.volume')">
    </div>
    <div class="total">
      <input type="number" step="0.00000001" v-model="price" :placeholder="$t('markets.total')">
    </div>
    <div class="tip"></div>
    <a class="order_btn"></a>
  </section>
</template>

<script>
export default {
  name: 'order',
  data () {
    return {

    }
  }
}
</script>

<style lang="scss">
  @import './order.scss'
</style>
