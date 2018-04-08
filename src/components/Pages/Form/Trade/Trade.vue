<template>
  <div class="btc-container-block">
    <basic-table style="margin-top:0px" :len='xhrData.length' :captionTitle='captionTitle' :item='getRecord'>
    </basic-table>
  </div>
</template>

<script>
export default {
  name: 'FormTrade',
  data () {
    return {
      HOST_URL: process.env.HOST_URL,
      captionTitle: 'form.trade.record_of_transaction',
      xhrData: []
    }
  },
  created () {
    this._get({
      url: `/history/all_trades.json`
    }, (d) => {
      this.xhrData = d.data.trades
    })
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
            {color: data.kind === 'ask' ? '#fd4041' : '#29c1a6', context: data.kind === 'ask' ? 'form.order.buy' : 'form.order.sell'},
            this.$moment(data.at).format('L H:mm:ss'),
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
