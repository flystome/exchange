<template>
  <div class="container-block" v-show='(route === "pie" || route === "line")'>
    <!-- <menu-underline
    :route="'AssetsDashboard'"
    v-model='step'
    :menu-index='step'
    :underline-margin="'9px'"
    :menu-margin="'64px'"
    :menu-list="[$t('dashboard.asset_distribution'), $t('dashboard.asset_curve')]">
    </menu-underline> -->
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
  props: ['route'],
  data () {
    return {
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      component: {
        pie: 'Pie',
        line: 'Line'
      },
      step: 0
    }
  },
  methods: {
    componentId () {
      if (this.$route.name !== 'WithdrawCurrency') return
      // var route = `Asset${[...this.$route.params.dashboard][0].toUpperCase()}${this.$route.params.dashboard.slice(1)}`
      // if (Object.keys(components).includes(route)) {
      //   this.step = Object.keys(components).indexOf(route)
      //   return route
      // } else {
      //   this.$router.replace(`${this.ROUTER_VERSION}/404`)
      // }
      if (!Object.keys(this.component).includes(this.route)) return ''
      return `Asset${[...this.route][0].toUpperCase()}${this.route.slice(1)}`
    }
  },
  components: components
  // watch: {
  //   step () {
  //     this.$router.push(`${this.ROUTER_VERSION}/dashboard/${this.component[this.step]}`)
  //   }
  // }
}
</script>

<style lang="scss" scoped>
.container-block{
  padding: 14px 30px 0 30px;
  min-height: 61vh;
  width: 100%;
  position: relative;
  margin-bottom: 10px;
  padding-top: 0!important;
  & /deep/ ul {
    border-bottom: 1px solid #f2f2f2
  }
}
</style>
