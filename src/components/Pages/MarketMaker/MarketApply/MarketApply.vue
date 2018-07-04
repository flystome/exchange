<template>
  <div class="MarketApply text-center">
    <header>
      <div class="MarketApply-title">
        {{$t('market_apply.market_maker_apply')}}
      </div>
      <div class="color999">
        {{$t('market_apply.become_market_maker')}}
      </div>
    </header>
    <div class="MarketApply-section">
      <section>
        <i class="MarketMaker-free"></i>
        <span>{{$t('market_apply.zero_transaction_cost')}}</span>
        <div>{{$t('market_apply.free_fee')}}</div>
      </section>
      <section>
        <i class="MarketMaker-service"></i>
        <span>{{$t('market_apply.exclusive_customer_service')}}</span>
        <div>{{$t('market_apply.one_to_one_customer')}}</div>
      </section>
      <section>
        <i class="MarketMaker-activity"></i>
        <span>{{$t('market_apply.custom_activity')}}</span>
        <div>{{$t('market_apply.network_promotion')}}</div>
      </section>
      <div class="clearfix"></div>
    </div>
    <div class="MarketApply-authentication font12 color999">
      <span @click="read = !read" :class="{'marketApply-right': read}"></span>{{$t('market_apply.read_and_agree')}} <span class="link">{{$t('market_apply.authentication_protocol')}}</span>
    </div>
    <button class="marketApply-apply" :class="{'choice': !read}">
      {{ $t('market_apply.immediate_apply') }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'MarketApply',
  data () {
    return {
      read: false
    }
  },
  computed: {
    lang () {
      return this.$store.state.language
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./MarketApply.scss"
</style>
