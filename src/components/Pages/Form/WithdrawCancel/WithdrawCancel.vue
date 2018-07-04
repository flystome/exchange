<template>
  <div class="form">
    <div class="container-block">
      <basic-table style="margin-top:0px" :SpinnerSize='150' :loading='loading' :len='xhrData.length' :captionTitle='captionTitle' :item='getRecord'>
        <template slot="cancel"
          slot-scope="props">
          <a>
            / <span style="position: relative;top: -1px;padding: 0;font-size: 12px;" :disabled='disabled' @click="cancelWithdraw(props.id, props.data)" class="link btn">{{$t(`withdraw_currency.cancel`)}}</span>
          </a>
        </template>
      </basic-table>
    </div>
    <paginate
      ref="paginate"
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
import { mapMutations } from 'vuex'
export default {
  name: 'CancelWithdraw',
  created () {
    this.paging(1)
  },
  data () {
    return {
      captionTitle: 'withdraw_currency.cancel_withdraw',
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
    cancelWithdraw (id, data) {
      this.disabled = true
      this._delete({
        url: `/funds/${id}/cancel_withdraw`
      }, (d) => {
        this.disabled = false
        if (d.data.success) {
          this.PopupBoxDisplay({message: this.$t('api_server.withdraw_currency.Withdraw_canceled_200'), type: 'success'})
          if (this.xhrData.length === 1) {
            if (this.$refs.paginate.selected !== 0) this.$refs.paginate.selected--
            this.paging(this.$refs.paginate.selected + 1)
          } else {
            this.paging(this.$refs.paginate.selected + 1)
          }
        } else {
          this.PopupBoxDisplay({message: this.$t('api_server.withdraw_currency.Withdraw_canceled_1001'), type: 'error'})
        }
      })
    },
    GetList (num) {
      this.xhrData = []
      this.disabled = true
      this.loading = true
      this._get({
        url: `/withdraws.json`,
        data: {
          cancelable: true,
          page: num,
          per_page: 20
        }
      }, (d) => {
        this.loading = false
        this.disabled = false
        this.xhrData = d.data.success.withdraws
        this.pagination = d.data.success.total_pages
      })
    },
    ToFixed (num) {
      return this.$store.getters.ToFixed(num)
    },
    ...mapMutations(['PopupBoxDisplay'])
  },
  computed: {
    getRecord () {
      return [{content: [
        this.$t('withdraw_currency.number'),
        this.$t('withdraw_currency.withdraw_time'),
        this.$t('currency'),
        this.$t('withdraw_currency.withdraw_address'),
        this.$t('withdraw_currency.actual_account'),
        this.$t('withdraw_currency.absenteeism_expenses'),
        this.$t('withdraw_currency.statu_and_operation')
      ]}].concat(this.xhrData.map(d => {
        return {
          content: [
            d.id,
            this.$moment(d.created_at).format('YYYY-MM-DD H:mm:ss'),
            d.currency.toUpperCase(),
            d.fund_uid,
            d.amount,
            d.fee,
            { type: d, context: this.$t(`withdraw_currency.${d.aasm_state}`), id: d.id }
          ]
        }
      }))
    }
  },
  watch: {
    $route (to, form) {
      if (to.name === 'WithdrawCancel') {
        this.$refs.paginate.selected = 0
        this.paging(1)
      }
    }
  }
}
</script>
