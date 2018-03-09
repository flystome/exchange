<template>
  <div class="market">
    <ul class="hd clearfix">
      <li class="text-center" v-for="(head, index) in heads" :key="head" :data-time = '0'  @click="sortList($event,index)">
        <span>{{head}}</span>
        <i class="caret caret-up"></i>
        <i class="caret caret-down"></i>
      </li>
    </ul>
    <ul class="bd">
      <li class="list" v-for="item in curData" :key="item.quote_currency">
        <div class="list-coin">
          <div class="icon"><i class="fa fa-star"></i></div>
          <div class="item">
            <div class="coin">{{item.quote_currency | upper}}<span>/{{item.base_currency | upper}}</span></div>
            <div class="vol"><span>{{$t('markets.volume')}}</span>{{item.volume | fixed3}}</div>
          </div>
        </div>
        <div class="list-price">
          <div class="price">{{item.last | fixed3}}</div>
          <div class="val">${{item.legal_worth}}</div>
        </div>
        <div class="list-btn">
          <div :class="[item.percent ? 'text-up':'text-down']">{{item.percent | fixed2}}%</div>
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
      oldData: this.curData
    }
  },
  mounted: function () {

  },
  filters: {
    fixed2: function (params) {
      return params.toFixed(2)
    },
    upper: function (params) {
      return params.toUpperCase()
    },
    fixed3: function (params) {
      return (+params).toPrecision(3)
    }
  },
  comouted: {
    this.updateData()
  },
  methods: {
    updateData: function () {
      this.$nextTick(function () {
        this.oldData = this.curData
        console.log(this.curData)
      })
    }
    sortList: function (e, index) {
      var order = this.coins[index]
      if (this.currencyIndex !== index) {
        this.currencyIndex = index
        this.times = 1
      }

      if (this.times === 1) {
        this.curData.sort(function (a, b) {
          if (index === 2) {
            return a[order] - b[order]
          } else {
            return a[order].localeCompare(b[order])
          }
        })
        this.time = 2
      } else if (this.times === 2) {
        this.curData.sort(function (a, b) {
          if (index === 2) {
            return b[order] - a[order]
          } else {
            return b[order].localeCompare(a[order])
          }
        })
        this.time = 0
      } else {
        this.time = 1
      }
      console.log(this.curData, this.oldData)
    }
  }
}
</script>

<style scoped lang="scss">
  @import './marketlist.scss'
</style>
