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
  name: 'FormRegisteredReferral',
  created () {
    this.paging(1)
  },
  data () {
    return {
      captionTitle: 'my_account.recommended_users',
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
        url: `/settings/registered_referrals.json`,
        data: {
          page: num
        }
      }, (d) => {
        this.loading = false
        this.disabled = false
        this.xhrData = d.data.data
        this.pagination = d.data.total_pages
      })
    },
    bser (explorer) {
      if (explorer.indexOf('MSIE') >= 0) {
        return 'IE'
      } else if (explorer.indexOf('Firefox') >= 0) {
        return this.$t('browser.firefox')
      } else if (explorer.indexOf('Chrome') >= 0) {
        return this.$t('browser.chrome')
      } else if (explorer.indexOf('Opera') >= 0) {
        return this.$t('browser.opera')
      } else if (explorer.indexOf('Safari') >= 0) {
        return this.$t('browser.safari')
      } else if (explorer.indexOf('Netscape') >= 0) {
        return this.$t('browser.netscape')
      } else if (explorer.indexOf('rv:10')) {
        return 'IE 10'
      } else if (explorer.indexOf('rv:11')) {
        return 'IE 11'
      }
    }
  },
  computed: {
    getRecord () {
      return [{content: [
        this.$t('my_account.account'),
        this.$t('my_account.ip_adress'),
        this.$t('my_account.login_location'),
        this.$t('my_account.browser'),
        this.$t('my_account.login_time'),
        this.$t('my_account.activated')
      ]}].concat(this.xhrData.map(data => {
        return {
          content: [
            data.account_name,
            data.signup_history.ip,
            data.signup_history.location ? data.signup_history.location : 'N/A',
            this.bser(data.signup_history.ua),
            this.$moment(data.created_at).format('YYYY-MM-DD H:mm:ss'),
            data.activated ? this.$t('my_account.yes') : this.$t('my_account.no')
          ]
        }
      }))
    }
  },
  watch: {
    $route (to, form) {
      if (to.name === 'FormRegisteredReferral') {
        this.$refs.paginate.selected = 0
        this.paging(1)
      }
    }
  }
}
</script>
