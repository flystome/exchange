<template>
  <div class="form">
    <div class="container-block">
      <basic-table style="margin-top:0px" :SpinnerSize='150' :loading='loading' :len='xhrData.length' :captionTitle='captionTitle' :item='getRecord'>
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
export default {
  name: 'FormReferral',
  created () {
    this.paging(1)
  },
  data () {
    return {
      captionTitle: 'my_account.recommended_statistics',
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
        url: `/settings/referral_datas.json`,
        data: {
          page: num
        }
      }, (d) => {
        this.loading = false
        this.disabled = false
        this.xhrData = d.data.data
        this.pagination = d.data.total_pages
      })
    }
  },
  computed: {
    getRecord () {
      return [{content: [
        this.$t('my_account.date'),
        this.$t('my_account.number_of_users'),
        this.$t('my_account.new_user'),
        this.$t('my_account.page_browsing'),
        this.$t('my_account.bounce_rate')]
      }].concat(this.xhrData.map(d => {
        return {
          content: [
            this.$moment(d.date).format('YYYY-MM-DD'),
            d.users,
            d.new_users,
            d.page_views,
            Number(d.bounce_rate).toFixed(1) + '%'
          ]
        }
      }))
    }
  },
  watch: {
    $route (to, form) {
      if (to.name === 'FormReferral') {
        this.$refs.paginate.selected = 0
        this.paging(1)
      }
    }
  }
}
</script>
