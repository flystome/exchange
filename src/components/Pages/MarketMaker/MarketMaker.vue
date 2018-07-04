<template>
  <div class="MarketMaker">
    <header>
      <a class="MarketMaker-title">
        {{ $t('market_maker.current_market') }}
      </a>
      <span class="marginL10 color999 font12">
        {{ $t('market_maker.preferential_describe') }}
      </span>
      <div>
        <a :href="`${HOST_URL}/documents/api_v2`">
          <basic-button class="marginR20" :text="$t('market_maker.market_maker_program_access')">
          </basic-button>
        </a>
        <basic-button :text="$t('market_maker.apply_for_market_making')">
        </basic-button>
      </div>
    </header>
    <template v-if="loading === false">
      <div v-if="MarketMakerList.length !== 0" style="overflow:auto">
        <table>
          <thead>
            <tr>
              <th class="color999 font12" v-for="(d, index) in MarketMakerTitle" :key="d" :class="`${index === MarketMakerTitle.length - 1 ? 'text-right' : ''}`">
                {{ d }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(d, index) in MarketMakerList" :key="index">
              <td v-for="(data, index) in d" :key="index" :class="`${index === 2 ? (/-/.test(data) ? 'color-green' : 'color-red') : ''} ${index === d.length - 1 ? 'text-right' : ''}`">
                {{ data }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="MarketMaker-norecord marginT65" v-else>
        {{ $t('my_account.no_record') }}
      </div>
    </template>
    <vue-simple-spinner size="88" v-else>
    </vue-simple-spinner>
  </div>
</template>

<script>
export default {
  name: 'MarketMaker',
  created () {
    setTimeout(() => {
      this.loading = false
    }, 1000)
  },
  data () {
    return {
      loading: true,
      HOST_URL: process.env.HOST_URL,
      MarketMakerList: [
        [
          'EOS/BTC',
          '0.00192146',
          '-5.27%',
          '13654452',
          '7.54687123 EOS',
          '0.30364784 BTC',
          '23.3157647 BTC'
        ], [
          'EOS/BTC',
          '0.00192146',
          '7.27%',
          '13654452',
          '7.54687123 EOS',
          '0.30364784 BTC',
          '23.3157647 BTC'
        ]
      ]
    }
  },
  computed: {
    MarketMakerTitle () {
      return [
        this.$t('form.order.monetary_pair'),
        this.$t('markets.newPrice'),
        this.$t('markets.change'),
        this.$t('market_maker.Yesterday_deal'),
        this.$t('market_maker.Volume_of_yesterday'),
        this.$t('market_maker.Yesterday_fee_income'),
        this.$t('market_maker.cumulative_fee_income')
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import './MarketMaker.scss'
</style>
