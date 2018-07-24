<template>
  <div id="interest_mining">
    <div class="home_mining">
      <div class="mining_h">
        <p>{{$t('form.mining.my_interest_mining')}}</p>
      </div>
      <div class="mining_list" v-if='miningList.length !== 0'>
        <miningTab :miningList='miningList'></miningTab>
      </div>
      <div v-else style="position: absolute;top: 50%;left: 50%;margin-left: -44px">
        <vue-simple-spinner size="88"></vue-simple-spinner>
      </div>
    </div>
  </div>
</template>
<script>
import miningTab from './miningTab/miningTab'

export default {
  name: 'InterestMining',
  data () {
    return {
      joinData: {},
      miningList: []
    }
  },
  created () {
    this.getMining()
  },
  components: {
    miningTab
  },
  methods: {
    async getMining () {
      this._get({
        url: '/fixed_term_deposits/my_plans.json',
        data: {
          page: 1
        }
      }, res => {
        var data = res.data.success.fixed_term_products
        this.miningList = data.slice(0, 5)
      })
    }
    // participate (item) {
    //   this.showDia = true
    //   this.joinData = item
    // }
  }
}
</script>

<style scoped lang="scss">
  @import "./InterestMining.scss";
</style>
