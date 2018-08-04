<template>
  <div class="form">
    <div class="container-block">
      <basic-table style="margin-top:0px" :SpinnerSize='150' :loading='loading' :len='xhrData.length' :captionTitle='captionTitle' :item='getRecord'>
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
  name: 'FormOrder',
  created () {
    this.paging(1)
  },
  data () {
    return {
      captionTitle: 'form.order.order_record',
      xhrData: [],
      pagination: 0,
      disabled: false,
      loading: true
    }
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
        url: `/history/all_orders.json`,
        data: {
          page: num
        }
      }, (d) => {
        this.loading = false
        this.disabled = false
        this.xhrData = d.data.orders
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
            {style: data.kind !== 'ask' ? { color: '#fd4041' } : { color: '#29c1a6' }, context: data.kind !== 'ask' ? this.$t('form.order.buy') : this.$t('form.order.sell')},
            data.market_name,
            {style: data.state === 'done' ? { color: '#fd4041' } : { color: '#29c1a6' }, context: data.state === 'done' ? this.$t('form.order.success') : this.$t('form.order.cancel')},
            this.ToFixed(data.price),
            this.ToFixed(data.origin_volume),
            this.ToFixed(data.avg_price),
            this.ToFixed(data.deal_volume),
            { style: { 'white-space': 'nowrap' }, context: this.$moment(data.at).format('YYYY-MM-DD H:mm:ss') }
          ]
        }
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
 @import "./Order.scss"
</style>
