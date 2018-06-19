<template>
    <!-- <chart :options="line"></chart> -->
    <div>
      123
    </div>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'

export default {
  name: 'AssetLine',
  data () {
    return {
    }
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
