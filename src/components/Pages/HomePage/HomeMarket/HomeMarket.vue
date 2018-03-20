<template>
  <table class="table">
    <thead>
      <tr>
        <th>币种对</th>
        <th v-for="(item, index) in heads" :key="item" @click="sortList(index)">{{item}}
          <img v-if="times == 0 && currencyIndex == index" src="~Img/both.png" alt="">
          <img v-else-if="times == 1 && currencyIndex == index" src="~Img/up.png" alt="">
          <img v-else-if="times == 2 && currencyIndex == index" src="~Img/down.png" alt="">
        </th>
        <th>价格趋势</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for='(item , index) in oldData' :key='index'>
        <td>
          <a class="btc-homepage-currency" style="color: #333333;">
              {{ item.name }}
          </a>
        </td>
        <td>
          <span>{{ item.last }}<span style="color:#999">/${{ item.legal_worth }}</span></span>
        </td>
        <td>{{ item.volume }}</td>
        <td>{{ (item.volume * item.last).toFixed(2) }}</td>
        <td class="btc-percent">
          <div style="color:#fd4041" v-if="item.percent>0">+{{ item.percent.toFixed(2) }}%</div>
          <div style="color:#00c4a2" v-else-if="item.percent<0">{{ item.percent.toFixed(2) }}%</div>
          <div style="color:#999999" v-else>+{{ item.percent.toFixed(2) }}</div>
        </td>
        <td></td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'home-market',
  props: ['curData'],
  data () {
    return {
      oldData: null,
      heads: ['价格USDT', '交易量(USDT)', '总市值(USDT)', '日涨跌'],
      coins: ['last', 'volume', 'volume', 'percent'],
      times: 0,
      currencyIndex: 0,
      hide: true
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
        this.oldData = JSON.parse(JSON.stringify(val))
      }
      this.times = 0
    }
  },
  methods: {
    initData: function () {
      if (!this.curData) return ''
      this.oldData = JSON.parse(JSON.stringify(this.curData))
    },
    sortList: function (index) {
      this.hide = false
      var order = this.coins[index]
      if (this.currencyIndex !== index) {
        this.currencyIndex = index
        this.times = 0
      }
      if (this.times === 0) {
        this.oldData.sort(function (a, b) {
          if (index === 3) {
            return a[order] - b[order]
          } else {
            return a[order].localeCompare(b[order])
          }
        })
        this.times = 1
      } else if (this.times === 1) {
        this.oldData.sort(function (a, b) {
          if (index === 3) {
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
@import "./HomeMarket.scss"
</style>
