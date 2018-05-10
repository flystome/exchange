<template>
  <div class="market">
    <ul class="hd clearfix">
      <li class="text-center" :class="{'up': times == 1 && currencyIndex == index , 'down': times == 2 && currencyIndex == index}"  v-for="(head, index) in heads" :key="head" @click="sortList(index)">
        <span>{{$t(head)}}</span>
        <i class="caret"></i>
      </li>
    </ul>
    <ul class="bd">
      <li class="list" v-for="item in oldData" :key="item.quote_currency">
        <router-link :to="{path: `${ROUTER_VERSION}/markets/${item.quote_currency.toLowerCase()}${item.base_currency.toLowerCase()}`}">
          <div class="list-coin">
            <div class="coin">{{item.quote_currency | upper}}<span>/{{item.base_currency | upper}}</span></div>
            <div class="vol"><span>{{$t('markets.volume')}}</span>{{item.volume | fixedNum(item.volume_fixed)}}</div>
          </div>
          <div class="list-price">
            <div class="price" :class="{'up': item.trend == 'up' , 'down': item.trend == 'down'}">{{item.last | fixedNum(item.price_fixed)}}</div>
            <div class="val">${{item.legal_worth | fixedNum(item.price_fixed)}}</div>
          </div>
          <div class="list-btn">
            <div :class="{'text-up': item.percent > 0, 'text-down': item.percent < 0}">{{item.percent | fixed2}}%</div>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'market-list',
  props: ['curData'],
  data () {
    return {
      HOST_URL: process.env.HOST_URL,
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      heads: ['markets.coinAndVolume', 'markets.newPrice', 'markets.change'],
      coins: ['quote_currency', 'last', 'percent'],
      times: 0,
      currencyIndex: 0,
      oldData: null
    }
  },
  mounted: function () {
    this.initData()
  },
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
    initData: function () {
      if (!this.curData) {
        this.oldData = []
      } else {
        this.oldData = JSON.parse(JSON.stringify(this.curData))
      }
    },
    goPath: function (quote, base) {
      var quotes = quote.toLowerCase()
      var bases = base.toLowerCase()
      this.$router.push({path: `${this.ROUTER_VERSION}/markets/${quotes}${bases}`})
    },
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
    }
  }
}
</script>

<style scoped lang="scss">
  @import './marketlist.scss'
</style>
