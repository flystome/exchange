<template>
  <div class="marketItem">
    <ul class="hd clearfix">
      <li :class="{'text-up': times == 1 && currencyIndex == index , 'text-down': times == 2 && currencyIndex == index}"  v-for="(head, index) in heads" :key="head" @click="sortList(index)">
        <span>{{$t(head)}}</span>
        <i class="caret"></i>
      </li>
    </ul>
    <scrollBar classes='myScroll'>
      <ul class="bd">
        <li v-for="item in oldData" :key="'market-' +i+item.quote_currency">
          <div class="my_fav" :class='{"favorite": item.is_portfolios}' @click="toggleFav(item.quote_currency, item.base_currency, item.is_portfolios, item)">
            <i class="fa fa-star"></i>
          </div>
          <div class="list-coin">
            <router-link :to="{path: `${ROUTER_VERSION}/exchange/${item.quote_currency.toLowerCase()}${item.base_currency.toLowerCase()}`}">
              <span>{{item.quote_currency | upper}}/</span><span>{{item.base_currency | upper}}</span>
            </router-link>
          </div>
          <div class="list-price" :class="{'up': item.trend == 'up' , 'down': item.trend == 'down'}">{{item.last | fixedNum(item.price_fixed)}}</div>
          <div class="list-btn" :class="{'up': item.percent > 0, 'down': item.percent < 0}">{{item.percent | fixed2}}%</div>
        </li>
      </ul>
    </scrollBar>
  </div>
</template>

<script>
import scrollBar from 'vue2-scrollbar'

export default {
  name: 'marketItem',
  props: ['curData', 'i'],
  data () {
    return {
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      heads: ['exchange.coin', 'markets.newPrice', 'markets.change'],
      coins: ['quote_currency', 'last', 'percent'],
      times: 0,
      currencyIndex: 0,
      oldData: []
    }
  },
  components: { scrollBar },
  watch: {
    curData: function (val, oldVal) {
      if (!val) {
        this.oldData = []
      } else {
        for (var i in val) {
          for (var j in oldVal) {
            if (val[i]['name'] === this.oldData[j]['name']) {
              if (+val[i]['last'] > +this.oldData[j]['last']) {
                val[i]['trend'] = 'up'
              } else if (+val[i]['last'] < +this.oldData[j]['last']) {
                val[i]['trend'] = 'down'
              } else {
                val[i]['trend'] = ''
              }
            }
          }
        }
        this.oldData = JSON.parse(JSON.stringify(val))
      }
      this.times = 0
    }
  },
  methods: {
    sortList: function (index) {
      var order = this.coins[index]
      if (this.currencyIndex !== index) {
        this.currencyIndex = index
        this.times = 0
      }
      if (this.times === 0) {
        this.oldData.sort(function (a, b) {
          if (index === 0) {
            return a[order].localeCompare(b[order])
          } else {
            return a[order] - b[order]
          }
        })
        this.times = 1
      } else if (this.times === 1) {
        this.oldData.sort(function (a, b) {
          if (index === 0) {
            return b[order].localeCompare(a[order])
          } else {
            return b[order] - a[order]
          }
        })
        this.times = 2
      } else {
        this.times = 0
        this.oldData = JSON.parse(JSON.stringify(this.curData))
      }
    },
    toggleFav (quote, base, bool) {
      this.$emit('changeFav', quote, base, bool)
    }
  }
}
</script>

<style scoped lang="scss">
  @import './marketItem.scss'
</style>
