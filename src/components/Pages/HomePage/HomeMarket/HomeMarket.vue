<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th>{{ $t('homepage.currency') }}</th>
          <th v-for="(item, index) in heads" :key="item" @click="sortList(index)">
            {{$t(`homepage.${item}`)}}{{index === 1 || index === 2 ? `(${currency})` : "" | toUpperCase}}
            <img v-if="times == 0 && currencyIndex == index" src="~Img/both.png" alt="">
            <img v-else-if="times == 1 && currencyIndex == index" src="~Img/up.png" alt="">
            <img v-else-if="times == 2 && currencyIndex == index" src="~Img/down.png" alt="">
          </th>
          <th>{{ $t('homepage.price_trend') }}</th>
        </tr>
      </thead>
      <tbody ref="a">
        <tr v-for='(item , index) in oldData' :key='index' v-if="matchName(item.name, index)">
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
          <td class="btc-percent" style="color:#fff">
            <div v-if="item.percent>0"><span style="background:#fd4041">+{{ item.percent.toFixed(2) }}%</span></div>
            <div v-else-if="item.percent<0"><span style="background:#00c4a2">{{ item.percent.toFixed(2) }}%</span></div>
            <div v-else><span style="background:#999999">+{{ item.percent.toFixed(2) }}</span></div>
          </td>
          <td style="max-width: 165px;">
            <trend
              viewBox="0 0 420 75"
              :data="[0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0]"
              :gradient="['black']"
              auto-draw
              smooth>
            </trend>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="btc-currency-none text-center btc-marginT150" v-if="itemLength === 0">
      {{ $t('homepage.no_matching_currency') }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'home-market',
  props: ['curData', 'currency', 'search'],
  data () {
    return {
      oldData: null,
      heads: ['price', `volume`, 'turnover', 'day_highs_and_lows'],
      coins: ['last', 'volume', 'total', 'percent'],
      times: 0,
      currencyIndex: 0,
      itemLength: false
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
    },
    async search () {
      await this.$nextTick()
      this.itemLength = this.$refs['a'].children.length
    },
    async oldData () {
      await this.$nextTick()
      this.itemLength = this.$refs['a'].children.length
    }
  },
  filters: {
    toUpperCase (str) {
      return str.toUpperCase()
    }
  },
  methods: {
    matchName (name, index) {
      var reg = new RegExp(`${this.search}`, 'i')
      return reg.test(name.match(/[A-Z]+/ig)[0])
    },
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
            return a['last'] * a['volume'] - b['last'] * b['volume']
          }
          if (index === 3) {
            return a[order] - b[order]
          } else {
            return a[order].localeCompare(b[order])
          }
        })
        this.times = 1
      } else if (this.times === 1) {
        this.oldData.sort(function (a, b) {
          if (index === 2) {
            return b['last'] * b['volume'] - a['last'] * a['volume']
          }
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
