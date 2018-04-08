<template>
  <div class="marketItem">
    <ul class="hd clearfix">
      <li class="text-center" :class="{'up': times == 1 && currencyIndex == index , 'down': times == 2 && currencyIndex == index}"  v-for="(head, index) in heads" :key="head" @click="sortList(index)">
        <span>{{$t(head)}}</span>
        <i class="caret"></i>
      </li>
    </ul>
    <ul class="bd">
      <li v-for="item in curData" :key="item.quote_currency">
        <div class="my_fav">
          <i class="fa fa-star"></i>
        </div>
        <div class="list-coin">
          <router-link :to="{path: `${ROUTER_VERSION}/markets/${item.quote_currency.toLowerCase()}${item.base_currency.toLowerCase()}`}">{{item.quote_currency | upper}}<span>/{{item.base_currency | upper}}</span></router-link>
        </div>
        <div class="list-price" :class="{'up': item.trend == 'up' , 'down': item.trend == 'down'}">{{item.last | fixedNum(item.price_fixed)}}</div>
        <div class="list-btn" :class="{'text-up': item.percent > 0, 'text-down': item.percent < 0}">{{item.percent | fixed2}}%</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'marketItem',
  props: ['curData'],
  data () {
    return {
      heads: ['markets.coinAndVolumn', 'markets.newPrice', 'markets.change'],
      times: 0,
      currencyIndex: 0
    }
  }
}
</script>

<style scoped lang="scss">
  @import './marketItem.scss'
</style>
