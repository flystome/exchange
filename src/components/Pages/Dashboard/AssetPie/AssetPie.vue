<template>
  <div>
    <chart :options='PieOption'></chart>
    <div class="btc-pie-legend">
      <div v-for="(data, index) in PieData" :key="data.value">
        <div class="legend-value">${{ data.value }}</div>
        <div>{{ ComputePercent(data.value) }}</div>
        <div class="legend-div" :style="`background:${Color[index]}`"></div>
        <div>{{ data.name }}</div>
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
      return `${Number(num).toFixed(2)}%`
    }
  },
  computed: {
    Data () {
      var data = []
      var asset = this.$store.state.assets
      Object.keys(asset).forEach((key) => {
        data.push({
          value: Number(this.$store.getters.ToFixed(asset[key].usdt_worth)),
          name: key.toUpperCase()
        })
      })
      data = data.filter((d) => {
        return d.value > 0
      }).sort((a, b) => {
        return a.value < b.value
      }).slice(0, 10)
      return data
    },
    PieData () {
      // var data = this.Data.map((d) => {
      //   return Object.assign(d, {
      //      label: {
      //       normal: {
      //         formatter: [
      //           `${this.$store.getters.ToFixed(d.value)}`,
      //           '{d}%'
      //         ].join('\n'),
      //       }
      //     }
      //   })
      // })
      return this.Data
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
          text: `${this.$t('my_account.total_assets')}  $${this.TotalAssets} USDT`,
          left: 'center',
          top: '70%',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: `{b} : \${c} ({d}%)`
        },
        // legend: {
        //   top: '58%',
        //   left: 'center',
        //   data: this.CoinRanking,
        //   textStyle: {
        //     padding: [0, 20, 0, 0],
        //   },
        //   shadowBlur: 50
        // },
        color: this.Color,
        series: [{
          type: 'pie',
          center: ['50%', '43%'],
          radius: ['12%', '40%'],
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
        return a + this.$store.state.assets[b].usdt_worth
      }, 0))
    },
    Color () {
      return ['#efae00', '#ffc600', '#38ada9', '#0a3d62', '#3c6382', '#0c2461', '#f58c26', '#079992', '#474787', '#82ccdd', '#6a89cc']
    }
  },
  components: {
    'chart': ECharts
  }
}
</script>

<style lang='scss' scoped>
.echarts{
  width: inherit;
  min-height: 400px;
}
.btc-pie-legend{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 771px;
  margin: auto;
  & > div {
    text-align: center;
    margin: 0px 14px;
    margin-bottom: 33px;
    flex-grow: 0;
    width: 100px;
    .legend-div{
      width: 36px;
      height: 16px;
      margin: auto;
    }
    .legend-value{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
