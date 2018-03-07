<template>
  <div id="markets">
    <ul class="marketsHd">
      <li v-for="(hd,index) in hds" :key="hd" :class="{'check': currencyindex == index}">{{$t(hd)}}</li>
    </ul>
    <ul class="marketBd">
      <marketList></marketList>
    </ul>
  </div>
</template>
<script>
import marketList from './marketList/marketList'

export default {
  name: 'markets',
  data () {
    return {
      hds: ['favorite', 'btc', 'eth'],
      currencyindex: 0
    }
  },
  components: {
    marketList
  }
}
</script>
<style scoped lang="scss">
  @import './mlist.scss'
</style>
