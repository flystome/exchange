<template>
  <div class="btc-container-block">
    <basic-table style="margin-top:0px" :len='xhrData.length' :captionTitle='captionTitle' :item='getRecord'>
    </basic-table>
  </div>
</template>

<script>
export default {
  name: 'FormOrder',
  data () {
    return {
      HOST_URL: process.env.HOST_URL,
      captionTitle: 'form.order.order_record',
      xhrData: []
    }
  },
  created () {
    this._get({
      url: `/history/all_orders.json`
    }, (d) => {
      d = d.data
      this.xhrData = d.orders
    })
  },
  computed: {
    getRecord () {
      return [{content: [
        'ID',
        this.$t('form.order.type'),
        this.$t('form.order.monetary_pair'),
        this.$t('form.order.state'),
        this.$t('form.order.entrustment_price'),
        this.$t('form.order.entrustment_number'),
        this.$t('form.order.average_transaction_price'),
        this.$t('form.order.number_of_transactions'),
        this.$t('form.order.entrustment_time')
      ]}].concat(this.xhrData.map(data => {
        return {
          content: [
            data.id,
            {color: data.kind === 'ask' ? '#fd4041' : '#29c1a6', context: data.kind === 'ask' ? 'form.order.buy' : 'form.order.sell'},
            data.market_name,
            {color: data.state === 'done' ? '#fd4041' : '#29c1a6', context: data.state === 'done' ? 'form.order.success' : 'form.order.cancel'},
            Number(data.price).toFixed(Math.min(String(data.price).split('.')[1].length, 8)),
            Number(data.origin_volume).toFixed(Math.min(String(data.origin_volume).split('.')[1].length, 8)),
            Number(data.avg_price).toFixed(Math.min(String(data.avg_price).split('.')[1].length, 8)),
            Number(data.volume) === 0 ? data.origin_volume : (data.origin_volume * (Math.max(String(data.origin_volume).split('.')[1].length, String(data.volume).split('.')[1].length)) - data.volume * (Math.max(String(data.origin_volume).split('.')[1].length, String(data.volume).split('.')[1].length))) / (Math.max(String(data.origin_volume).split('.')[1].length, String(data.volume).split('.')[1].length)),
            this.$moment(data.at).format('L H:mm:ss')
          ]
        }
      }))
    }
  }
}
</script>
