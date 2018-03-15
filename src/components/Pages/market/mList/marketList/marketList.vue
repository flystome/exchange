<template>
  <div class="market">
    <ul class="hd clearfix">
      <li class="text-center" :class="{'up': times == 1 && currencyIndex == index , 'down': times == 2 && currencyIndex == index}"  v-for="(head, index) in heads" :key="head" :data-time = '0'  @click="sortList(index)">
        <span>{{head}}</span>
        <i class="caret"></i>
      </li>
    </ul>
    <ul class="bd">
      <li class="list" v-for="item in oldData" :key="item.quote_currency">
        <div class="list-coin">
          <div class="coin">{{item.quote_currency | upper}}<span>/{{item.base_currency | upper}}</span></div>
          <div class="vol"><span>{{$t('markets.volume')}}</span>{{item.volume | fixed3}}</div>
        </div>
        <div class="list-price">
          <div class="price">{{item.last | fixed3}}</div>
          <div class="val">${{item.legal_worth}}</div>
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
      heads: [this.$t('markets.coinAndVolumn'), this.$t('markets.newPrice'), this.$t('markets.change')],
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
      return params.toFixed(2)
    },
    upper: function (params) {
      return params.toUpperCase()
    },
    fixed3: function (params) {
      if (+params === 0) return 0
      var arr = +params.toString().split('.')
      var len = +params.toString().split('.')[0].length
      console.log(len)
      if (len > 1) {
        return (+params).toFixed(2)
      } else if (len === 1 && arr[0] === 0) {
        return (+params).toFixed(4)
      } else {
        return (+params).toFixed(3)
      }
    }
  },
  watch: {
    curData: function (val, oldVal) {
      if (!val) {
        this.oldData = []
      } else {
        this.oldData = JSON.parse(JSON.stringify(val))
      }
    }
  },
  methods: {
    initData: function () {
      if (!this.curData) return ''
      this.oldData = JSON.parse(JSON.stringify(this.curData))
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
