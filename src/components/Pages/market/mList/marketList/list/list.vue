<template>
  <div class="list">
    <div class="list-coin">
      <div class="coin"><span>/BTC</span></div>
      <div class="vol"><span>成交量</span>12816.96</div>
    </div>
    <div class="list-price">
      <div class="price">0.123654</div>
      <div class="val">$7.38666</div>
    </div>
    <div class="list-btn">
      <div class="text-up">+1.00%</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'list',
  props: ['list'],
  data () {
    return {
      lists: this.list
    }
  },
  mounted: function () {
    console.log(this.lists)
  }

}
</script>

<style scoped lang="scss">
  @import './list.scss'
</style>
