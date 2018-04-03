<template>
  <div class="btc-container-block">
    <basic-table ref="a" style="margin-top:0px" :len='xhrData.length' :captionTitle='captionTitle' :item='getRecord'>
    </basic-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
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
      var d = d.data
      this.xhrData = d.orders
    })
  },
  methods () {

  },
  computed: {
    ...mapState(['language']),
    getRecord () {
      return [{content:[
        'ID',
        this.$t('form.order.type'),
        this.$t('form.order.monetary_pair'),
        this.$t('form.order.state'),
        this.$t('form.order.entrustment_price'),
        this.$t('form.order.entrustment_number'),
        this.$t('form.order.average_transaction_price'),
        this.$t('form.order.number_of_transactions'),
        this.$t('form.order.entrustment_time'),
      ]}].concat(this.xhrData.map(data => {
        return {
          content: [
            data.id,
            data.kind === 'ask' ? this.$t('form.order.buy') : this.$t('form.order.sell'),
            data.market_name,
            data.state === 'done' ? this.$t('form.order.success') : this.$t('form.order.cancel'),
            Number(data.price).toFixed(Math.min(String(data.price).split('.')[1].length,8)),
            data.origin_volume,
            Number(data.avg_price).toFixed(Math.min(String(data.avg_price).split('.')[1].length,8))
          ]
        }
      }))
    }
  }
}
</script>
