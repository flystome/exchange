<template>
  <div id="mining">
    <table>
      <thead>
        <tr>
          <th>{{$t('homepage.mining.deadline')}}</th>
          <th>{{$t('homepage.mining.rate')}}</th>
          <th>{{$t('homepage.mining.dayback')}}</th>
          <th>{{$t('homepage.mining.limit')}}</th>
          <th>{{$t('homepage.mining.remain')}}</th>
          <th>{{$t('homepage.mining.action')}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for='item in miningList' :key='item.currency+"-"+item.id'>
          <td>{{item.apply_begin_at | time | noSecond}} - {{item.apply_end_at | time | noSecond}}</td>
          <td>{{item.annual_rate}}%</td>
          <td>{{item.daily_interest_per_coin}} OET/{{item.currency | upper}}</td>
          <td>{{item.min_volume}}-{{item.max_volume}} {{item.currency | upper}}</td>
          <td>{{item.volume}} {{item.currency | upper}}</td>
          <td><span @click='participate(item)'>{{$t('homepage.mining.participate')}} &gt;</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'miningTab',
  props: ['miningList'],
  data () {
    return {

    }
  },
  methods: {
    participate (item) {
      this.$emit('participate', item)
    }
  },
  filters: {
    noSecond (time) {
      return time.split(':')[0] + ':' + time.split(':')[1]
    }
  }
}
</script>

<style scoped lang='scss'>
  @import './miningTab.scss'
</style>
