<template>
  <div class="btc-MarketMaker">
    <header>
      <a class="btc-MarketMaker-title">
        {{ $t('market_maker.current_market') }}
      </a>
      <span class="btc-color999 btc-font12">
        {{ $t('market_maker.preferential_describe') }}
      </span>
      <div>
        <basic-button :text="$t('market_maker.market_maker_program_access')">
        </basic-button>
        <basic-button :text="$t('market_maker.apply_for_market_making')">
        </basic-button>
      </div>
    </header>
  </div>
</template>

<script>
export default {
  name: 'MarketMaker',
  data () {
    return {
      MarketMakerList: []
    }
  }
}
</script>

<style lang="scss" scoped>
@import './MarketMaker.scss'
</style>
