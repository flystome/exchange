<template>
    <chart :options="pie"></chart>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'

export default {
  name: 'AssetPie',
  data () {
    return {
      pie: {
        title: {
          text: '天气情况统计dwdw',
          left: 'center',
          bottom: 40
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          bottom: 10,
          left: 'center',
          data: ['西凉', '益州', '兖州', '荆州', '幽州']
        },
        series: [{
          type: 'pie',
          radius: '65%',
          center: ['50%', '50%'],
          selectedMode: 'single',
          data: [{
            value: 1548,
            name: '幽州'
          },
          {
            value: 535,
            name: '荆州'
          },
          {
            value: 510,
            name: '兖州'
          },
          {
            value: 634,
            name: '益州'
          },
          {
            value: 735,
            name: '西凉'
          }],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
    }
  },
  mounted () {

  },
  components: {
    'chart': ECharts
  }
}
</script>

<style lang="scss" scoped>
.echarts{
  width: inherit;
  min-height: 70vh;
}
</style>
