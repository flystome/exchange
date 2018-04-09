<template>
  <div class="btc-form">
    <div class="btc-container-block">
      <basic-table style="margin-top:0px" :len='xhrData.length' :captionTitle='captionTitle' :item='getRecord'>
      </basic-table>
    </div>
    <paginate
      class="btc-fr"
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
      disabled: false
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
      this.disabled = true
      this._get({
        url: `/history/all_trades.json`,
        data: {
          page: num
        }
      }, (d) => {
        this.disabled = false
        this.xhrData = d.data.trades
        this.pagination = d.data.total_pages
      })
    }
  },
  computed: {
    getRecord () {
      return [{content: [
        this.$t('form.order.type'),
        this.$t('form.order.entrustment_time'),
        this.$t('form.trade.benchmark_currency'),
        this.$t('form.trade.amount'),
        this.$t('form.trade.transaction_price'),
        this.$t('form.trade.quoted_currency'),
        this.$t('form.trade.money'),
        this.$t('form.trade.poundage')
      ]}].concat(this.xhrData.map(data => {
        return {
          content: [
            {style: data.kind === 'ask' ? { color: '#fd4041' } : { color: '#29c1a6' }, context: data.kind === 'ask' ? this.$t('form.order.buy') : this.$t('form.order.sell')},
            { style: { 'white-space': 'nowrap' }, context: this.$moment(data.at).format('L H:mm:ss') },
            data.base_currency.toUpperCase(),
            Number(data.origin_volume).toFixed(Math.min(String(data.origin_volume).split('.')[1].length, 8)),
            Number(data.price).toFixed(Math.min(String(data.price).split('.')[1].length, 8)),
            data.quote_currency.toUpperCase(),
            Number(data.amount).toFixed(Math.min(String(data.amount).split('.')[1].length, 8)),
            `${(data.kind === 'bid' ? data.quote_currency : data.base_currency).toUpperCase()} ${Number(data.origin_volume).toFixed(Math.min(String(data.origin_volume).split('.')[1].length, 8))}`
          ]
        }
      }))
    }
  }
}
</script>
