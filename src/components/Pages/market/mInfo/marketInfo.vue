<template>
  <ul class="market_tab">
    <li><a href="/market"></a></li>
    <li><a href="/trade"></a></li>
    <li><a href="/pending"></a></li>
  </ul>
  <div class="detail">
    <div class="detail_top">
      <div class="coin_detail">
        <a href="/markets"></a>

      </div>
      <div class="add_favorite">

      </div>
    </div>
    <div class="detail_bottom">
      <div class="detail_lt">
        <p>
          <span class="change"></span>
          <span class="percent"></span>
        </p>
        <p>
          <span class="name">{{}}</span>
          <span class="volume">{{}}</span>
        </p>
      </div>
      <div class="detail_rt">
        <p>
          <span class="name"></span>
          <span class="volume"></span>
        </p>
        <p>
          <span class="name"></span>
          <span class="volume"></span>
        </p>
      </div>
    </div>
  </div>

  <div class="graph">

  </div>

  <div class="new_order">
    <h2></h2>
    <ul class="order_hd">
      <li v-for="hd in hds">{{hd}}</li>
    </ul>
    <!-- <orderList></orderList> -->
  </div>
  <div class="trade">
    <a class="bid">{{$t("buy")}}</a>
    <a class="ask">{{$t("sell")}}</a>
  </div>
</template>
<script>
export default {
  name: 'marketInfo'
  data () {
    return {
      heads: [this.$t('markets.detail'), this.$t('markets.newPrice'), this.$t('markets.change')],
    }
  }
}
</script>
<style scoped lang="scss">
   @import './marketInfo.scss'
</style>


