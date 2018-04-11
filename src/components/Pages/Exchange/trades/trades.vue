<template>
  <section id="trades">
    <ul class="tab_hd">
      <li class="on">{{$t('exchange.tradeTitle')}}</li>
    </ul>
    <div class="bd">
      <div class="hd clearfix">
        <div class="pirce">{{$t("markets.newPrice")}}</div>
        <div class="volume">{{$t("exchange.myorder.volume")}}</div>
        <div class="total">{{$t("markets.amount")}}({{market.base_currency | upper}})</div>
      </div>
      <div class="sell lists">
        <ul class="listbox">
          <li v-for="item in sellList">
            <div class="pirce">{{item[0] | fixedNum(market.price_fixed)}}</div>
            <div class="volume">{{item[1] | fixedNum(market.volume_fixed)}}</div>
            <div class="total">{{item[0] * item[1] | fixedNum(market.price_fixed, market.volume_fixed)}}</div>
          </li>
        </ul>
      </div>
      <div class="newPirce">
        <div><span>{{market.last | fixedNum(market.price_fixed)}}</span> ({{market.base_currency | upper}})</div>
      </div>
      <div class="buy lists">
        <ul class="listbox">
          <li v-for="item in buyList">
            <div class="pirce">{{item[0] | fixedNum(market.price_fixed)}}</div>
            <div class="volume">{{item[1] | fixedNum(market.volume_fixed)}}</div>
            <div class="total">{{item[0] * item[1] | fixedNum(market.price_fixed, market.volume_fixed)}}</div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'trades',
  props: ['depthData', 'market'],
  data () {
    return {
      items: [],
      sellList: [],
      buyList: [],
      version: 0,
    }
  },
  watch: {
    depthData (val) {
      ({
        asks: this.sellList,
        bids: this.buyList,
        version: this.version
      } = val)
      this.sellList.reverse()
    }
  }
}
</script>

<style lang="scss">
  @import './trades.scss'
</style>
