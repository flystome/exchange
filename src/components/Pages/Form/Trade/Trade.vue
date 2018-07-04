<template>
  <div class="form">
    <div class="container-block">
      <basic-table style="margin-top:0px" :loading='loading' :SpinnerSize='150' :len='xhrData.length' :captionTitle='captionTitle' :item='getRecord'>
      </basic-table>
    </div>
    <paginate
      class="fr"
      :disabled="disabled"
      v-if="pagination !== 0"
      :page-count="pagination"
      :page-range="3"
      :margin-pages="1"
      :click-handler="paging"
      :disabled-class='"disabled"'
      :prev-text="`${$t('form.previous')}`"
      :next-text="`${$t('form.next')}`"
      :page-class="'page-item'">
    </paginate>
  </div>
</template>

<script>
export default {
  name: 'FormTrade',
  data () {
    return {
      HOST_URL: process.env.HOST_URL,
      captionTitle: 'form.trade.record_of_transaction',
      xhrData: [],
      pagination: 0,
      disabled: false,
      loading: true
    }
  },
  created () {
    this.paging(1)
  },
  methods: {
    paging (num) {
      if (this.disabled) return
      this.GetList(num)
    },
    GetList (num) {
      this.xhrData = []
      this.disabled = true
      this.loading = true
      this._get({
        url: `/history/all_trades.json`,
        data: {
          page: num
        }
      }, (d) => {
        this.loading = false
        this.disabled = false
        this.xhrData = d.data.trades
        this.pagination = d.data.total_pages
      })
    },
    ToFixed (num) {
      return this.$store.getters.ToFixed(num)
    }
  },
  computed: {
    getRecord () {
      return [{content: [
        this.$t('form.order.type'),
        this.$t('form.order.entrustment_time'),
        this.$t('form.order.monetary_pair'),
        // this.$t('form.trade.benchmark_currency'),
        this.$t('form.trade.amount'),
        this.$t('form.trade.transaction_price'),
        // this.$t('form.trade.quoted_currency'),
        this.$t('form.trade.money'),
        this.$t('form.trade.poundage')
      ]}].concat(this.xhrData.map(data => {
        var [first, lastName] = data.market_name.split('/')
        return {
          content: [
            {style: data.kind !== 'ask' ? { color: '#fd4041' } : { color: '#29c1a6' }, context: data.kind !== 'ask' ? this.$t('form.order.buy') : this.$t('form.order.sell')},
            { style: { 'white-space': 'nowrap' }, context: this.$moment(data.at).format('YYYY-MM-DD H:mm:ss') },
            data.market_name,
            `${this.ToFixed(data.origin_volume)} ${first}`,
            this.ToFixed(data.price),
            // data.quote_currency.toUpperCase(),
            `${this.ToFixed(data.amount)} ${lastName}`,
            `${data.fee_currency.toUpperCase()} ${this.ToFixed(data.fee)}`
            // `${(data.kind !== 'ask' ? data.quote_currency : data.base_currency).toUpperCase()} ${this.ToFixed(data.fee)}`
          ]
        }
      }))
    }
  }
}
</script>
