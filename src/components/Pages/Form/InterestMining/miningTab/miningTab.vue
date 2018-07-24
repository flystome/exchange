<template>
  <div id="mining">
    <table>
      <thead>
      <tr>
        <th>{{$t('form.mining.ownership_currency')}}</th>
        <th>{{$t('form.mining.currency')}}</th>
        <th>{{$t('form.mining.cycle')}}</th>
        <th>{{$t('form.mining.annualized_rate')}}</th>
        <th>{{$t('form.mining.own_quantity')}}</th>
        <th>{{$t('form.mining.date_expiry')}}</th>
        <th>{{$t('form.mining.allocated_interest')}}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for='item in miningList' :key='item.currency+"-"+item.id'>
        <td>{{item.product_name}}</td>
        <td>{{item.currency | upper}}</td>
        <td>{{item.day_limit}} {{$t('form.mining.day')}}</td>
        <td>{{totalRate(item)}}%</td>
        <td>{{item.volume}}</td>
        <td>{{item.expire_at | time | justDate}}</td>
        <td>{{item.received_interest.toFixed(2)}}</td>
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
    totalRate (item) {
      return (item.invite_rate + item.newbie_rate + item.total_rate).toFixed(2)
    }
  },
  filters: {
    justDate (time) {
      return time.split(' ')[0].replace(/-/g, '/')
    }
  }
}
</script>

<style scoped lang='scss'>
  @import './miningTab.scss'
</style>
