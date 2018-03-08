<template>
  <div class="market">
    <ul class="hd clearfix">
      <li v-for="head in heads" :key="head"><span>{{head}}</span><i class="caret caret-up"></i><i class="caret caret-down"></i></li>
    </ul>
    <div class="bd">
      <list v-for="listData in listDatas" :key="listData" :list = 'listData' ></list>
    </div>
  </div>
</template>

<script>
import list from './list/list'
export default {
  name: 'market-list',
  props: ['curData'],
  data () {
    return {
      heads: ['coinAndVolumn', 'newPrice', 'priceChange'],
      listDatas: this.curData
    }
  },
  components: {
    list
  }
}
</script>

<style scoped lang="scss">
  @import './marketlist.scss'
</style>
