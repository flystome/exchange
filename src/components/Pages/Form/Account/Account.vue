<template>
  <div class="btc-form">
    <div class="btc-form-account btc-container-block">
      <basic-table style="margin-top:0px" :SpinnerSize='150' :loading='loading' :len='xhrData.length' :captionTitle='captionTitle' :item='getRecord'>
        <div slot='remark' @keyup.esc="search = ''" class="btc-account-search btc-fr btc-b">
          <input v-model="search" class="btc-search" :placeholder='$t("homepage.search")' />
          <img v-if='!search' src="~Img/search.png" >
          <img class="btc-pointer" v-else @click="search = ''" src="~Img/search-delete.png" >
        </div>
      </basic-table>
    </div>
    <paginate
      ref="pagination"
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
const _debounce = require('lodash/fp/debounce.js')
export default {
  name: 'FormAccount',
  created () {
    this.paging(1)
  },
  data () {
    return {
      captionTitle: 'title.form_account',
      xhrData: [],
      pagination: 0,
      disabled: false,
      loading: true,
      search: ''
    }
  },
  methods: {
    paging (num, currency) {
      if (this.disabled) return
      this.GetList(num, currency)
    },
    GetList (num, currency) {
      this.disabled = true
      this.xhrData = []
      this.loading = true
      this._get({
        url: `/history/account.json`,
        data: {
          page: num,
          currency: currency
        }
      }, (d) => {
        this.loading = false
        this.disabled = false
        this.xhrData = d.data.transactions
        this.pagination = d.data.total_pages
      })
    }
  },
  computed: {
    getRecord () {
      return [{content: [
        this.$t('form.order.type'),
        this.$t('my_account.date'),
        this.$t('currency'),
        this.$t('form.trade.amount'),
        this.$t('form.trade.poundage'),
        this.$t('deposit_currency.trading_hash'),
        this.$t('form.order.state')
      ]}].concat(this.xhrData.map(data => {
        return {
          content: [
            data.transaction_type,
            this.$moment(data.created_at).format('L H:mm:ss'),
            data.code_text,
            Number(data.amount).toFixed(Math.min(String(data.amount).split('.')[1].length, 8)),
            Number(data.fee).toFixed(Math.min(String(data.fee).split('.')[1].length, 8)),
            data.txid === null ? 'N/A' : data.txid,
            this.$t(`withdraw_currency.${data.aasm_state}`)
          ]
        }
      }))
    }
  },
  watch: {
    'search': _debounce(500, function (a) {
      this.pagination = 0
      this.$refs['pagination'] && (this.$refs['pagination'].selected = 0)
      this.paging(1, a)
    })
  }
}
</script>

<style lang="scss">
  .btc-account-search{
    background: #f2f2f2;
    padding: 5px 8px;
    margin-bottom: 4px;
    input{
      outline: none;
      border: none;
      background: #f2f2f2;
    }
  }

  .btc-form-account{
    caption{
      strong{
        line-height: 33px
      }
    }
  }
</style>
