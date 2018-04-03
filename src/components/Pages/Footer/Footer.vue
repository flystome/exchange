<template>
  <footer class="btc-footer hidden-xs">
    <nav class="container">
      <div class="btc-footer-logo col-md-5">
        <img src="@/common/svg/logo.svg" alt="">
        <p class="btc-marginB15">{{ $t("footer.introduction") }}</p>
        <p>{{ $t("footer.copyright") }}</p>
      </div>
      <ul class="btc-info col-md-1 col-sm-2 btc-marginL40">
        <li class="">{{ $t("footer.support") }}</li>
        <li>
          <a :href="`${HOST_URL}/documents/api_v2`">{{ $t("footer.api") }}</a>
        </li>
        <li>
          <a :href="CmsUrl.helper_center">{{ $t("footer.help") }}</a>
        </li>
        <li>
           <a :href="CmsUrl.announcement">{{ $t("footer.announcements") }}</a>
        </li>
      </ul>
      <ul class="btc-info col-md-1 col-sm-2 btc-marginL40">
        <li class="">{{ $t("footer.service") }}</li>
        <li>
          <a :href="CmsUrl.application">{{ $t("footer.application") }}</a>
        </li>
        <li><a :href="CmsUrl.rate_details">{{ $t("footer.rate_details") }}</a></li>
      </ul>
      <ul class="btc-info col-md-1 col-sm-2 btc-marginL40">
        <li class="">{{ $t("footer.about") }}</li>
        <li><a :href="`${CmsUrl.about_us}`">{{ $t("footer.about_us") }}</a></li>
        <li><a :href="`${CmsUrl.user_agreement}`">{{ $t("footer.user_agreement") }}</a></li>
        <li><a :href="CmsUrl.privacy_policy">{{ $t("footer.privacy_policy") }}</a></li>
      </ul>
      <ul class="btc-info pull-right btc-marginT30 btc-marginR30 dropup">
        <li class="btc-marginB30">
         <a style="cursor:initial">
            {{ $t('homepage.contact_us') }}
        </a>
        </li>
        <li class="btc-marginB15"><a href="mailto:support@hotex.com">support@hotex.com</a></li>
        <li role="presentation" class="dropdown btc-country btc-img-position">
          <a class="dropdown-toggle btc-paddingL0" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
            <span>{{getLanguage.name}}</span><span class="caret">
            </span>
          </a>
          <ul class="dropdown-menu text-center">
            <li v-for="(locale,index) in locale" :key="locale.language">
              <a @click="changeLang(locale.language, index + 1)">{{locale.name}}</a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </footer>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      HOST_URL: process.env.HOST_URL,
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      locale: [{
        language: 'zh-TW',
        name: '正體中文'
      },
      {
        language: 'en',
        name: 'English'
      }]
    }
  },
  methods: {
    localed () {
      // this.$i18n.locale = this.language
    },
    changeLang (str) {
      this.ChangeLanguage(str)
      this.$i18n.locale = str
      this._post({
        url: '/settings/language.json',
        headers: {
          'DataType': 'application/json;charset=utf-8'
        },
        data: {
          'content_language': str
        }
      })
    },
    goPath (path, status, href) {
      if (status) {
        return
      }
      if (href) {
        location.href = `${this.HOST_URL}${this.ROUTER_VERSION}${path}`
      }
      this.$router.push({
        path: `${this.ROUTER_VERSION}${path}`
      })
    },
    ...mapMutations(['ChangeLanguage'])
  },
  computed: {
    getLanguage () {
      this.localed()
      var lang = ''
      this.locale.map((d, index) => {
        if (d.language === this.language) {
          lang = d
        }
      })
      return lang
    },
    ...mapState(['language', 'CmsUrl'])
  }
}
</script>

<style scoped lang='scss'>
@import './Footer.scss'
</style>
