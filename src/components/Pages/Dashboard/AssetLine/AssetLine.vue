<template>
  <div>
    <header>
      <div class="text-center">{{ $t('dashboard.historical_income') }}</div>
      <div>
        <div class="line-date">
          <span v-for="(date, index) in DateList" :key="date" @click="ChangeDate(index)" :class="{'active': index === DateIndex}">
            {{ $t(`${date}`) }}
          </span>
        </div>
        <div class="line-mark">
          <span>
            <a style="background: #2686ff"></a>
            BTC{{$t('dashboard.benchmark')}}
          </span>
          <span>
            <a style="background: #50b125"></a>
            USD{{$t('dashboard.benchmark')}}
          </span>
        </div>
      </div>
    </header>
    <chart :options="Option"></chart>
  </div>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/dataZoomInside'

export default {
  name: 'AssetLine',
  data () {
    return {
      DateIndex: 0,
      DateList: ['a_week', 'three_months', 'six_months', 'a_year'],
      DateAmount: [7, 90, 180, 365]
    }
  },
  methods: {
    ChangeDate (index) {
      this.DateIndex = index
    }
  },
  computed: {
    Option () {
      return {
        grid: {
          top: '20',
          left: '40',
          right: '40',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            animation: false
          }
        },
        axisPointer: {
          link: {
            xAxisIndex: 'all'
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.DayList
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: 'BTC',
          data: this.BtcData,
          type: 'line',
          smooth: true,
          itemStyle: {
            normal: {
              color: '#2686ff'
            }
          },
          areaStyle: {
            normal: {
              color: '#d0dffc',
              origin: 'start'
            }
          }
        },
        {
          name: 'USD',
          data: this.UsdData,
          type: 'line',
          smooth: true,
          z: 1,
          itemStyle: {
            normal: {
              color: '#50b125'
            }
          }
        }],
        dataZoom: [{
          start: 0,
          type: 'inside'
        }, {
          type: 'slider',
          realtime: true,
          left: 90,
          right: 90
        }]
      }
    },
    DayList () {
      return this.LineData && this.LineData.map((data) => {
        return this.$moment(data.timestamp).format('YYYY-MM-DD')
      }).concat(new Array(this.Index - this.LineData.length).fill('').map((data, index) => {
        return this.$moment(this.LineData[this.LineData.length - 1] ? this.LineData[this.LineData.length - 1].timestamp : (new Date().getTime() - 86400000) + ((index + 1) * 86400000)).format('YYYY-MM-DD')
      }))
    },
    BtcData () {
      return this.LineData && this.LineData.map((data) => {
        return data.btc_gains
      })
    },
    UsdData () {
      return this.LineData && this.LineData.map((data) => {
        return data.usdt_gains
      })
    },
    Profit () {
      return this.$store.state.loginData.profit
    },
    Index () {
      return this.DateAmount[this.DateIndex]
    },
    LengthJudge () {
      if (this.Profit) {
        return this.Profit && this.Profit.length <= this.Index
      }
    },
    LineData () {
      if (this.LengthJudge) {
        return this.Profit
      } else {
        return this.Profit && this.Profit.slice(this.Profit.length - this.Index, this.Profit.length)
      }
    }
  },
  components: {
    'chart': ECharts
  }
}
</script>

<style lang="scss" scoped>
  header{
    margin-bottom: 2px;
    & > .text-center{
      font-size: 20px;
      margin-top: 43px;
      margin-bottom: 43px;
    }
  }
  .echarts {
    width: inherit;
    min-height: 240px;
    min-height: 240px;
    // position: absolute;
    left: 0;
    right: 0;

  }
  .line-date{
    display: inline-block;
    span{
      font-size: 12px;
      border: 1px solid #999999;
      padding: 2px 3px;
      margin-right: 10px;
      text-align: center;
      min-width: 46px;
      display: inline-block;
      cursor: pointer;
    }
    .active{
      background: #2686ff;
      color: white;
      border: none;
      padding: 3px 4px;
    }
  }
  .line-mark{
    display: inline-block;
    &>:first-child{
      margin-left: 12px;
    }
    span{
      font-size: 12px;
      margin-left: 24px;
    }
    a{
      $len: 10px;
      display: inline-block;
      width: $len;
      height: $len;
    }
  }
</style>
