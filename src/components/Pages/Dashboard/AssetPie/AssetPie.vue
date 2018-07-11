<template>
  <div>
    <div class="total">
      <p>{{$t('my_account.total_assets')}} &nbsp;&nbsp;{{this.ToLocaleString(this.BtcTotalAssets)}} BTC</p>
      <p>&asymp; {{this.ToLocaleString(this.TotalAssets)}} USDT</p>
    </div>
    <div class="chart">
      <chart :options='PieOption' :auto-resize='true'></chart>
    </div>
    <div class="pie-legend">
      <div v-for="(data, index) in PieData" :key="data.name">
        <!-- <div class="legend-value">{{ ToLocaleString(data.amount) }}</div>
        <div>{{ ComputePercent(data.value) }}</div> -->
        <span class="legend-box" :style="`background:${Color[index]}`"></span>
        <span>{{ data.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { BigNumber } from 'bignumber.js'
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

export default {
  name: 'AssetPie',
  methods: {
    ComputePercent (n) {
      var num = new BigNumber(n.toString()).dividedBy(this.TotalAssets.toString()).multipliedBy(100)
      return `${Number(num).toFixed(2) === '0.00' ? '0.01' : Number(num).toFixed(2)}%`
    },
    ToLocaleString (num) {
      return Number(Number(num).toFixed(2)).toLocaleString()
    }
  },
  computed: {
    Data () {
      var data = []
      var asset = this.$store.state.assets
      Object.keys(asset).forEach((key) => {
        data.push({
          value: Number(this.$store.getters.ToFixed(asset[key].usdt_worth)),
          amount: Number(this.$store.getters.ToFixed(asset[key].amount)),
          name: key.toUpperCase()
        })
      })
      data = data.filter((d) => {
        return d.value > 0
      }).sort((a, b) => {
        return b.value - a.value
      })
      return data
    },
    PieData () {
      return this.Data.slice(0, 10).concat(this.Others)
    },
    Others () {
      if (this.Data.length > 10) {
        var num = new BigNumber(this.TotalAssets.toString()).minus(this.Data.slice(0, 10).reduce((n, d) => {
          return n.plus(d.value.toString())
        }, new BigNumber(0)))
        return [{
          name: this.$t('dashboard.others'),
          value: Number(num)
        }]
      } else {
        return []
      }
    },
    CoinRanking () {
      var data = []
      this.Data.forEach((d) => {
        data.push({
          name: d.name
        })
      })
      return data
    },
    PieOption () {
      return {
        title: {
          text: `USDT \n ${this.ToLocaleString(this.TotalAssets)}`,
          left: 'center',
          top: '45%',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'item'
        },
        color: this.Color,
        series: [{
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['38%', '56%'],
          selectedMode: 'single',
          data: this.PieData,
          label: {
            show: false
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
    },
    TotalAssets () {
      return this.$store.getters.ToFixed(Object.keys(this.$store.state.assets).reduce((a, b) => {
        return a.plus(this.$store.state.assets[b].usdt_worth.toString())
      }, new BigNumber(0)))
    },
    BtcTotalAssets () {
      return this.$store.getters.ToFixed(Object.keys(this.$store.state.assets).reduce((a, b) => {
        return a.plus(this.$store.state.assets[b].btc_worth.toString())
      }, new BigNumber(0)))
    },
    Color () {
      return ['#efae00', '#ffc600', '#38ada9', '#474787', '#82ccdd', '#f58c26', '#0a3d62', '#3c6382', '#0c2461', '#079992', '#6a89cc']
    }
  },
  components: {
    'chart': ECharts
  }
}
</script>

<style lang='scss' scoped>
.total {
  width: 30%;
  float: left;
  padding-left: 6%;
  padding-top: 140px;
  p {
    font-size: 14px;
    color: #333333;
    &:first-child {
      font-weight: bold;
      line-height: 36px;
    }
  }
}
.chart {
  width: 40%;
  float: left;
}
.echarts{
  width: 100%;
  min-height: 400px;
}
.pie-legend{
  width: 30%;
  float: left;
  padding-top: 120px;
  padding-right: 6%;
  & > div {
    text-align: center;
    margin-bottom: 25px;
    width: 33.3%;
    float: left;
    height: 16px;
    line-height: 16px;
    font-size: 12px;
    text-align: left;
    .legend-box{
      display: inline-block;
      width: 24px;
      height: 16px;
      line-height: 16px;
      margin: auto;
      margin-right: 4px;
      vertical-align: -3px;
    }
    .legend-value{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
