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
          <li v-for="item in sellList" :key='"sell"+item[0]' @click='addOrder("sell", item[0], item[1])'>
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
          <li v-for="item in buyList" :key='"buy"+item[0]' @click='addOrder("sell", item[0], item[1])'>
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
import tradeBus from '@/common/js/bus/tradeBus'
export default {
  name: 'trades',
  props: ['depthData', 'market'],
  data () {
    return {
      items: [],
      sellList: [],
      buyList: [],
      version: 0
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
    },
    addOrder (type, price, vol) {
      tradeBus.$emit('addOrder', type, price, val)
    }
  }
}
</script>

<style lang="scss">
  @import './trades.scss'
</style>
