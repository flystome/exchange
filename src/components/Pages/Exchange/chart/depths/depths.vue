<template>
  <section id='depths'>
  </section>
</template>

<script>
import { bus } from '@/common/js/bus/index'
const echarts = require('echarts')

export default {
  name: 'depths',
  props: ['depthData', 'chartInit'],
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
      var mid = 0
      if (val) {
        var sell = JSON.parse(JSON.stringify(val.asks))
        if (sell.length) {
          this.sellList = sell.map((ele, index, arr) => {
            if (index !== 0) {
              ele[1] = +ele[1] + +arr[index - 1][1]
            }
            return ele
          })
          this.max = this.sellList[this.sellList.length - 1]
        } else {
          this.max = 0
        }
        var buy = JSON.parse(JSON.stringify(val.bids))
        if (buy.length) {
          this.buylist = buy.map((ele, index, arr) => {
            if (index !== 0) {
              ele[1] = +ele[1] + +arr[index - 1][1]
            }
            return ele
          })
          this.min = this.buyList[this.buyList.length - 1]
        } else {
          this.min = 0
        }
        if (!this.max && !this.min) {

        } else if (!this.max) {
          this.max = (this.buyList[0] - this.min) * 2 + this.min
        } else if (!this.min) {
          this.min = this.max - (this.max - this.sellList[0]) * 2
        } else {
          mid = (this.sellList[0] + this.buyList[this.buyList.length - 1]) / 2
          if (this.max - mid > mid - this.min) {
            this.min = this.max - (this.max - mid) * 2
          } else {
            this.max = this.min + (mid - this.min) * 2
          }
        }
        this.min = this.min < 0 ? 0 : this.min

        this.buylist.reverse()
        this.refreshChart()
      }
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
