<template>
  <footer class="footer hidden-xs" :class="{'footer-from-home': FROM}">
    <nav class="container">
      <div class="footer-logo col-md-5">
        <img src="@/common/svg/logo.svg" alt="">
        <p class="marginB15">{{ $t("footer.introduction") }}</p>
        <p>{{ $t("footer.copyright") }}</p>
      </div>
      <ul class="info col-md-1 col-sm-2 marginL40">
        <li class=""><strong>{{ $t("footer.support") }}</strong></li>
        <!-- <li>
          <a :href="`${HOST_URL}/documents/api_v2`">{{ $t("footer.api") }}</a>
        </li> -->
        <li>
          <a :href="CmsUrl.helper_center">{{ $t("footer.help") }}</a>
        </li>
        <li>
           <a :href="CmsUrl.announcement">{{ $t("footer.announcements") }}</a>
        </li>
      </ul>
      <ul class="info col-md-1 col-sm-2 marginL40">
        <li class=""><strong>{{ $t("footer.service") }}</strong></li>
        <li>
          <a :href="CmsUrl.application">{{ $t("footer.application") }}</a>
        </li>
        <li><a :href="CmsUrl.rate_details">{{ $t("footer.rate_details") }}</a></li>
      </ul>
      <ul class="info col-md-1 col-sm-2 marginL40">
        <li class=""><strong>{{ $t("footer.about") }}</strong></li>
        <li><a :href="`${CmsUrl.about_us}`">{{ $t("footer.about_us") }}</a></li>
        <li><a :href="`${CmsUrl.user_agreement}`">{{ $t("footer.user_agreement") }}</a></li>
        <li><a :href="CmsUrl.privacy_policy">{{ $t("footer.privacy_policy") }}</a></li>
      </ul>
      <ul class="info pull-right marginT30 marginR30 dropup">
        <li class="marginB30">
          <a style="cursor:initial"><strong>{{ $t('homepage.contact_us') }}</strong></a>
        </li>
        <li class="marginB15"><a href="mailto:support@hotex.com">support@hotex.com</a></li>
        <li role="presentation" class="dropdown country img-position">
          <a class="dropdown-toggle paddingL0" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
            <span>{{getLanguage.name}}</span>
            <span class="caret"></span>
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
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Footer',
  props: {
    FROM: {
      type: Boolean
    }
  },
  data () {
    return {
      HOST_URL: process.env.HOST_URL,
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      locale: [{
        language: 'zh-TW',
        name: '正體中文'
      },
      {
        language: 'zh-CN',
        name: '简体中文'
      },
      {
        language: 'en',
        name: 'English'
      }]
    }
  },
  methods: {
    // localed () {
    //   this.$i18n.locale = this.language
    // },
    changeLang (str, index) {
      this.ChangeLanguage(str)
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
    ...mapActions(['ChangeLanguage'])
  },
  computed: {
    getLanguage () {
      // this.localed()
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
@import './Footer.scss';
.footer-from-home{
  min-width: 1200px;
}
</style>
