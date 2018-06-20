<template>
  <div class="btc-container-block">
    <menu-underline
    :route="'AssetsDashboard'"
    v-model='step'
    :menu-index='step'
    :underline-margin="'9px'"
    :menu-margin="'64px'"
    :menu-list="[$t('dashboard.asset_distribution'), $t('dashboard.asset_curve')]">
    </menu-underline>
    <keep-alive>
      <component :is="componentId()"></component>
    </keep-alive>
  </div>
</template>

<script>
import AssetPie from './AssetPie/AssetPie'
import AssetLine from './AssetLine/AssetLine'
const components = {
  AssetPie,
  AssetLine
}
export default {
  name: 'AssetsDashboard',
  data () {
    return {
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      component: {
        0: 'pie',
        1: 'line'
      },
      step: 0
    }
  },
  methods: {
    componentId () {
      if (this.$route.name !== 'AssetsDashboard') return
      var route = `Asset${[...this.$route.params.dashboard][0].toUpperCase()}${this.$route.params.dashboard.slice(1)}`
      if (Object.keys(components).includes(route)) {
        this.step = Object.keys(components).indexOf(route)
        return route
      } else {
        this.$router.replace(`${this.ROUTER_VERSION}/404`)
      }
    }
  },
  components: components,
  watch: {
    step () {
      this.$router.push(`${this.ROUTER_VERSION}/dashboard/${this.component[this.step]}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.btc-container-block{
  padding: 14px 30px 0 30px;
  min-height: 70vh;
  position: relative;
  margin-bottom: 10px;
  & /deep/ ul {
    border-bottom: 1px solid #f2f2f2
  }
}
</style>
