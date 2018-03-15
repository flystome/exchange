<template>
  <div class="navbar-Home">
    <nav class="container navbar navbar-default">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" :href="`${HOST_URL}`">
            <img src="~Img/logo.png">
          </a>
        </div>
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1" style="z-index:100">
          <ul class="nav navbar-nav">
            <li class="btc-link"><a :href="`${HOST_URL}/xchg`">{{$t('nav.home')}} <span class="sr-only">(current)</span></a></li>
            <li class="btc-link"><a :href="`${HOST_URL}/markets/ethbtc`">{{$t('nav.transaction')}}</a></li>
            <li class="btc-link"><a @click="validateEmail">{{$t('nav.wallet')}}</a></li>
            <li class="btc-link"><a :href="`${HOST_URL}/xchg`">{{$t('nav.announcement')}}</a></li>
            <li class="btc-link"><a :href="`${HOST_URL}/`">{{$t('nav.qa')}}</a></li>
          </ul>
          <ul class="nav navbar-nav navbar-right btc-header-signin btc-marginT15" v-if="loginData === '' || loginData.errors">
            {{$t('nav.please')}}<a :href="`${HOST_URL}/signin`">{{$t('nav.login')}}</a>{{$t('nav.or')}}<a :href="`${HOST_URL}/signup`">{{$t('nav.register')}}</a>
          </ul>
          <ul class="nav navbar-nav navbar-right" v-else>
            <li class="btc-marginL15">
              <a :href="`${HOST_URL}/conversations`" class="btc-header-letter">
                <img src="~Img/letterlog.png">
                <span class="message">{{ $t("nav.message") }}</span>
              </a>
            </li>
            <li class="btc-img-position dropdown btc-ifo" style="cursor: pointer">
              <!-- <img src="~Img/avatarlog.png" class="btc-header-avatar">
              {{ this.loginData.email }} -->
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                <img src="~Img/avatarlog.png" class="btc-header-avatar">
                {{ this.loginData.show_name }}
                <span class="caret"></span></a>
              <ul class="dropdown-menu">
                 <!-- <a><a :href="`${HOST_URL}/`">{{$t('nav.settings')}}</a></li> -->
                <li><a @click="goPath('/member_center')">{{$t('nav.member_center')}}</a></li>
                <li><a :href="`${HOST_URL}/signout`">{{$t('nav.exit')}}</a></li>
              </ul>
            </li>
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
        </div>
    </nav>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex'
export default {
  created () {
    this.$store.dispatch('getData')
  },
  data () {
    return {
      HOST_URL: process.env.HOST_URL,
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      locale: [{
        language: 'zh_TW',
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
      this.$i18n.locale = this.language
    },
    requireImg (img) {
      return require(`../../../../static/img/${img}.png`)
    },
    ...mapMutations(['PopupBoxDisplay']),
    validateEmail () {
      if (!this.loginData.activated) {
        this.PopupBoxDisplay({message: this.$t('prompt.email_not_certified')})
      } else {
        this.goPath('/currency/deposit')
      }
    },
    changeLang (str) {
      this.ChangeLanguage(str)
      this.$i18n.locale = str
      this._post({
        url: '/settings/get_language.json',
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
    goHome () {
      this.$router.push(`${this.ROUTER_VERSION}/`, () => {
        this.$store.dispatch('getData')
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
    ...mapGetters(['loginData']),
    ...mapState(['language'])
  }
}
</script>

<style lang='scss' scoped>
@import "./Header.scss";
</style>
