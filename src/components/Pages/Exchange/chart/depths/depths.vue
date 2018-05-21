<template>
  <section id='depths'>
  </section>
</template>

<script>
import { bus } from '@/common/js/bus/index'
const echarts = require('echarts')

export default {
  name: 'depths',
  props: ['depthData', 'chartInit', 'market'],
  data () {
    return {
      depths: null,
      option: null,
      sellList: [],
      buyList: [],
      max: 0,
      min: 0
    }
  },
  mounted () {
    this.createDepths()
    bus.$on('slidelr', (bool) => {
      var timer = setTimeout(() => {
        this.depths.resize()
        clearTimeout(timer)
      }, 800)
    })
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
          trigger: 'axis',
          backgroundColor: '#37506e',
          formatter: function (params) {
            var p1 = (params[0].data && params[0].data[0]) || ""
            var p2 = (params[0].data && params[0].data[1]) || ""
            return `<p class='item1'><span>${_this.$t('markets.price')}:</span><span> ${p1}</span></p>
              <p class='item1'><span>${_this.$t('exchange.grand')}:</span><span> ${p2}</span></p>`
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
            show: true,
            splitLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            show: true,
            splitLine: {
              show: false
            }
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
      var mid = 0
      if (val) {
        var sell = JSON.parse(JSON.stringify(val.asks))
        if (sell.length) {
          this.sellList = sell.map((ele, index, arr) => {
            if (index !== 0) {
              ele[1] = (+ele[1] + +arr[index - 1][1]).toFixed(this.market.price_fixed)
            } else {
              ele[1] = (+ele[1]).toFixed(8)
            }
            return ele
          })
          this.max = +this.sellList[this.sellList.length - 1][0]
        } else {
          this.max = 0
        }
        var buy = JSON.parse(JSON.stringify(val.bids))
        if (buy.length) {
          this.buyList = buy.map((ele, index, arr) => {
            if (index !== 0) {
              ele[1] = (+ele[1] + +arr[index - 1][1]).toFixed(this.market.price_fixed)
            } else {
              ele[1] = (+ele[1]).toFixed(8)
            }
            return ele
          })
          this.min = +this.buyList[this.buyList.length - 1][0]
          this.buyList.reverse()
        } else {
          this.min = 0
        }
        if (!this.max && !this.min) {

        } else if (!this.max) {
          this.max = (+this.buyList[this.buyList.length - 1][0] - +this.min) * 2 + +this.min
        } else if (!this.min) {
          this.min = this.max - (this.max - +this.sellList[0][0]) * 2
          if (this.min <= 0) {
            this.min = 0
            this.max = +this.sellList[0][0] * 2
          }
        } else {
          mid = (+this.sellList[0][0] + +this.buyList[this.buyList.length - 1][0]) / 2
          if (this.max - mid > mid - this.min) {
            this.min = this.max - (this.max - mid) * 2
            if (this.min <= 0) {
              this.min = 0
              this.max = (mid - this.min) * 2
            }
          } else {
            this.max = this.min + (mid - this.min) * 2
          }
        }
        this.min = this.min < 0 ? 0 : this.min
        this.refreshChart()
      }
    },
    refreshChart () {
      this.depths.setOption({
        xAxis: [{
          min: this.min,
          max: this.max
        }],
        yAxis: [{
          min: 0,
          max: Math.max((this.sellList[this.sellList.length - 1] && this.sellList[this.sellList.length - 1][1]), (this.buyList[0] && this.buyList[0][1]))
        }],
        series: [{
          data: this.buyList
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
