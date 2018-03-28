<template>
  <div class="market">
    <ul class="hd clearfix">
      <li class="text-center" :class="{'up': times == 1 && currencyIndex == index , 'down': times == 2 && currencyIndex == index}"  v-for="(head, index) in heads" :key="head" @click="sortList(index)">
        <span>{{$t(head)}}</span>
        <i class="caret"></i>
      </li>
    </ul>
    <ul class="bd">
      <li class="list" v-for="item in oldData" :key="item.quote_currency" @click="goPath(item.quote_currency,item.base_currency)">
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
      heads: ['markets.coinAndVolumn', 'markets.newPrice', 'markets.change'],
      coins: ['quote_currency', 'last', 'percent'],
      times: 0,
      currencyIndex: 0,
      oldData: null
    }
  },
  mounted: function () {
    this.initData()
  },
  filters: {
    fixed2: function (params) {
      if (+params <= 0 || !params) return 0
      return (+params).toFixed(2)
    },
    upper: function (params) {
      if (!params) return '--'
      return params.toUpperCase()
    },
    fixedNum: function (params, num, num2) {
      if (+params <= 0 || !params) return 0
      if (!num) num = 6
      if (num2) {
        num = num > num2 ? num : num2
      }
      var value = (+Math.floor(params * Math.pow(10, num)) / Math.pow(10, num)).toFixed(num)
      if (value.length >= 14) value = (+value).toFixed(num - 2)
      return value
    }
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
      this.$router.push({path: `${this.ROUTER_VERSION}/markets/${quote.toLowerCase()}${base.toLowerCase()}`})
    },
    sortList: function (index) {
      var order = this.coins[index]
      if (this.currencyIndex !== index) {
        this.currencyIndex = index
        this.times = 0
      }
      if (this.times === 0) {
        this.oldData.sort(function (a, b) {
          if (index === 2) {
            return a[order] - b[order]
          } else {
            return a[order].localeCompare(b[order])
          }
        })
        this.times = 1
      } else if (this.times === 1) {
        this.oldData.sort(function (a, b) {
          if (index === 2) {
            return b[order] - a[order]
          } else {
            return b[order].localeCompare(a[order])
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
