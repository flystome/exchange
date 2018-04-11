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
          <li v-for="(item, index) in sellList" :key='"sell"+item[0]' @click='addOrder("sell", item[0], index)'>
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
          <li v-for="(item,index) in buyList" :key='"buy"+item[0]' @click='addOrder("buy", item[0], index)'>
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
import { bus } from '@/common/js/bus/index'

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
    }
  },
  methods: {
    addOrder (type, price, index) {
      var result = 0
      var expand = Math.pow(10, this.market.volume_fixed)
      if (type === 'sell') {
        var len = this.sellList.length
        for (let i = len - 1; i >= index; i--) {
          result += +this.sellList[i][1]
        }
      } else {
        for (let i = 0; i <= index; i++) {
          result += +this.buyList[i][1]
        }
      }
      result = Math.floor(expand * result) / expand
      bus.$emit('addOrder', type, price, result)
    }
  }
}
</script>

<style lang="scss">
  @import './trades.scss'
</style>
