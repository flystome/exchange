<template>
  <section id='depths'>
  </section>
</template>

<script>
const echarts = require('echarts')

export default {
  name: 'depths',
  props: ['depthData', 'chartInit'],
  data () {
    return {
      depths: null,
      option: null,
      sellList: [],
      buylist: [],
      max: 0,
      min: 0
    }
  },
  mounted () {
    this.createDepths()
  },
  watch: {
    depthData (val, oldVal) {
      this.getChartData(val)
    }
  },
  methods: {
    createDepths () {
      var _this = this
      this.depths = echarts.init(document.getElementById('depths'))
      this.option = {
        tooltip: {
          trigger: 'item',
          backgroundColor: '#37506e',
          formatter: function (params) {
            return `<p class='item1'><span>${_this.$t('markets.price')}:</span><span> ${params.data[0]}</span></p>
              <p class='item1'><span>${_this.$t('exchange.grand')}:</span><span> ${params.data[1]}</span></p>`
          }
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          containLabel: false
        },
        xAxis: [
          {
            type: 'value',
            boundaryGap: false,
            show: false
          }
        ],
        yAxis: [
          {
            type: 'value',
            show: false
          }
        ],
        series: [
          {
            name: 'buy',
            type: 'line',
            symbolSize: 4,
            color: '#fff',
            lineStyle: {
              normal: {
                color: '#23464c'
              }
            },
            areaStyle: {normal: {
              color: '#23464c'
            }},
            data: []
          },
          {
            name: 'sell',
            type: 'line',
            symbolSize: 4,
            color: '#fff',
            lineStyle: {
              normal: {
                color: '#43323c'
              }
            },
            areaStyle: {normal: {color: '#43323c'}},
            data: []
          }
        ]
      }
      this.depths.setOption(this.option)
      this.resize()
    },
    getChartData (val) {
      var sell = JSON.parse(JSON.stringify(val.asks))
      this.sellList = sell.map((ele, index, arr) => {
        if (index !== 0) {
          ele[1] = +ele[1] + +arr[index - 1][1]
        }
        return ele
      })
      this.max = this.sellList[this.sellList.length - 1]
      var buy = JSON.parse(JSON.stringify(val.bids))
      this.buylist = buy.map((ele, index, arr) => {
        if (index !== 0) {
          ele[1] = +ele[1] + +arr[index - 1][1]
        }
        return ele
      })
      this.min = this.sellList[0]
      this.buylist.reverse()
      this.refreshChart()
    },
    refreshChart () {
      this.depths.setOption({
        xAxis: [{
          min: this.min,
          max: this.max
        }],
        series: [{
          data: this.buylist
        }, {
          data: this.sellList
        }]
      })
    },
    resize () {
      window.addEventListener('resize', () => {
        this.depths.resize()
      })
    }
  }
}
</script>

<style scoped lang="scss">
  @import './depths.scss';
</style>
