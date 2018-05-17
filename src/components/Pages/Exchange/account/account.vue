<template>
  <div class="account" @mouseenter='show=true' @mouseleave='show=false'>
    <a class="dropdown-toggle account_btn" data-toggle="dropdown" href="###" role="button" aria-haspopup="true" aria-expanded="false">
      <i class="sideslipAssets"></i>
      <span>{{ totalAssets}} BTC</span>
    </a>
    <div class="dropdown text-center" v-show='show'>
      <table>
        <thead>
          <tr>
            <th width="22%">{{$t('exchange.coin')}}</th>
            <th width="39%">{{$t('exchange.total')}}</th>
            <th width="39%">{{$t('exchange.freeze')}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in accounts" :key='"coin"+item.currency'>
            <td>{{item.currency | upper}}</td>
            <td>{{item.balance | fixedNum(8)}}</td>
            <td>{{item.locked | fixedNum(8)}}</td>
          </tr>
        </tbody>
      </table>
      <a href="/currency/withdraw" class="viewAll">{{$t('exchange.allAccount')}}</a>
    </div>
  </div>
</template>
<script>

export default {
  name: 'account',
  props: ['totalAssets', 'accounts', 'market'],
  data () {
    return {
      show: false
    }
  }
}
</script>
<style lang="scss">
  @import './account.scss'
</style>
