<template>
  <div class="btc-form">
    <div class="btc-form-account btc-container-block">
      <basic-table style="margin-top:0px" :SpinnerSize='150' :loading='loading' :len='xhrData.length' :captionTitle='captionTitle' :item='getRecord'>
        <div slot='remark' @keyup.esc="search = ''" class="btc-account-search btc-fr btc-b">
          <input v-model="search" class="btc-search" :placeholder='$t("homepage.search")' />
          <i v-if='!search' class="account-search"></i>
          <i v-else class="account-delete" @click="search = ''" ></i>
        </div>
        <template slot="href"
          slot-scope="props">
          <span class="btc-pointer btc-link" @click="OpenWindow(props.data.url)">
            {{ props.data.context }}
          </span>
        </template>
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
      :click-handler="(num) => { paging(num, search) }"
      :disabled-class='"disabled"'
      :prev-text="`${$t('form.previous')}`"
      :next-text="`${$t('form.next')}`"
      :page-class="'page-item'">
    </paginate>
  </div>
</template>

<script>
const _debounce = require('lodash.debounce')
export default {
  name: 'FormDeposit',
  created () {
    if (this.$route.query.currency) {
      this.search = this.$route.query.currency
      return
    }
    this.paging(1)
  },
  data () {
    return {
      captionTitle: 'title.form_deposit',
      xhrData: [],
      pagination: 0,
      disabled: false,
      loading: true,
      search: ''
    }
  },
  methods: {
    OpenWindow (url) {
      window.open(url)
    },
    paging (num, currency) {
      if (this.disabled) return
      this.GetList(num, currency)
    },
    GetList (num, currency) {
      this.disabled = true
      this.xhrData = []
      this.loading = true
      this._get({
        url: `/deposits.json`,
        data: {
          page: num,
          currency: currency,
          per_page: 20,
          fuzzy_search: true
        }
      }, (d) => {
        this.loading = false
        this.disabled = false
        this.xhrData = d.data.success.deposits
        this.pagination = d.data.success.total_pages
      })
    },
    ToFixed (num) {
      return this.$store.getters.ToFixed(num)
    }
  },
  computed: {
    getRecord () {
      return [{content: [
        this.$t('deposit_currency.deposit_date'),
        this.$t('currency'),
        this.$t('deposit_currency.trading_hash'),
        this.$t('deposit_currency.recharge_amount'),
        this.$t('deposit_currency.confirmation_number'),
        this.$t('withdraw_currency.statu_and_operation')
      ]}].concat(this.xhrData.map(data => {
        return {
          content: [
            this.$moment(data.created_at).format('YYYY-MM-DD H:mm:ss'),
            data.currency.toUpperCase(),
            data.txid === null ? 'N/A' : {hover: true, context: data.txid, url: data.blockchain_url},
            this.ToFixed(data.amount),
            this.ToFixed(data.confirmations),
            this.$t(`withdraw_currency.${data.aasm_state}`)
          ]
        }
      }))
    }
  },
  watch: {
    'search': _debounce(function (a) {
      this.pagination = 0
      this.$refs['pagination'] && (this.$refs['pagination'].selected = 0)
      this.paging(1, a)
    }, 500)
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

<style lang="scss" scoped>
i{
  display: inline-block;
  position: relative;
  top: 3px;
  cursor: pointer;
  margin-right: 3px;
}

.account-search{
  @include sprite($home-search)
}

.account-delete{
  @include sprite($search-delete)
}

</style>
