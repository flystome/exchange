<template>
  <div class="navbar-Home" :class="{'navbar-from-home': FROM}">
    <nav class="container navbar navbar-default">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <router-link class="navbar-brand" to="/">
            <i v-if="FROM" class='header-hlog'/>
            <img v-else src="@/common/svg/logo.svg">
          </router-link>
          <div class="header-sideslip" @click="SideSlipMenuDisplay(true)">
            <a></a>
          </div>
        </div>
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1" style="z-index:100">
          <ul class="nav navbar-nav">
            <li class="link">
                <router-link to="/">
                  {{$t('nav.home')}}
                  <span class="sr-only">(current)</span>
                </router-link>
            </li>
            <li role="presentation" class="dropdown country market img-position">
              <a class="dropdown-toggle paddingL0" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                <span style="font-size: 14px;">{{$t('nav.transaction')}}</span><span class="caret">
                </span>
              </a>
              <ul class="dropdown-menu text-center">
                <li v-for="d in markList" :key="Object.keys(d)[0]">
                  <a :href="`${ROUTER_VERSION}/exchange/${Object.keys(d)[0]}`">
                    {{ d[Object.keys(d)[0]].name }}
                  </a>
                </li>
              </ul>
            </li>
            <li class="link"><a @click="validateEmail">{{$t('nav.wallet')}}</a></li>
            <li class="link"><a :href="CmsUrl.announcement">{{$t('nav.announcement')}}</a></li>
            <li class="link"><a :href="CmsUrl.helper_center">{{$t('nav.qa')}}</a></li>
          </ul>
          <ul class="nav navbar-nav navbar-right header-signin marginT15" v-if="loginData === 'none' || loginData.errors">
            {{$t('nav.please')}}<router-link :to="`${ROUTER_VERSION}/login`">{{$t('nav.login')}}</router-link>{{$t('nav.or')}}<router-link :to="`${ROUTER_VERSION}/register`">{{$t('nav.register')}}</router-link>
          </ul>
          <ul class="nav navbar-nav navbar-right" v-else>
            <li class="marginL15">
              <router-link :to="`${ROUTER_VERSION}/ticket/open`" class="header-letter">
                <span :class="{'nav-unread': loginData.has_unread_tickets}">
                  <i v-if="FROM" class='header-hticket' style="top: 4px;"/>
                  <i v-else class='header-ticket' style="top: 4px;"/>
                </span>
                <span class="message">{{ $t("nav.message") }}</span>
              </router-link>
            </li>
            <li class="marginL15">
              <router-link :to="`${ROUTER_VERSION}/form/news`" class="header-letter">
                <span :class="{'nav-unread': loginData.has_unread_conversations}">
                  <i v-if="FROM" class='header-hletterlog' style="top: 4px;"/>
                  <i v-else class='header-letterlog' style="top: 4px;"/>
                </span>
                <span class="message">{{ $t("nav.message") }}</span>
              </router-link>
            </li>
            <li class="img-position dropdown ifo" style="cursor: pointer">
              <!-- <img src="~Img/avatarlog.png" class="header-avatar">
              {{ this.loginData.email }} -->
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                <!-- <img src="~Img/header-avatarlog.png" class="header-avatar"> -->
                <i v-if="FROM" class='header-havatarlog'/>
                <i v-else class='header-avatarlog'/>
                {{ this.loginData.show_name }}
                <span class="caret"></span></a>
              <ul class="dropdown-menu">
                 <!-- <a><a :href="`${HOST_URL}/`">{{$t('nav.settings')}}</a></li> -->
                <li><a @click="goPath('/my_account')">{{$t('nav.my_account')}}</a></li>
                <li class="divider" role="separator"></li>
                <li><a @click="goPath('/form/order')">{{$t("title.form_order")}}</a></li>
                <li><a @click="goPath('/form/trade')">{{$t("title.form_trade")}}</a></li>
                <li><a @click="goPath('/form/deposit')">{{$t("title.form_deposit")}}</a></li>
                <li><a @click="goPath('/form/withdraw')">{{$t("title.form_withdraw")}}</a></li>
                <li class="divider" role="separator"></li>
                <!-- <li><a @click="goPath('/api')">{{$t("my_account.api")}}</a></li> -->
                <li><a @click="goPath('/ticket')">{{$t("title.ticket")}}</a></li>
                <li class="divider" role="separator"></li>
                <li><a :href="`${HOST_URL}/signout`">{{$t('nav.exit')}}</a></li>
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
  name: 'Header',
  // created () {
  //   this.$store.dispatch('getData')
  // },
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
    ...mapMutations(['PopupBoxDisplay', 'SideSlipMenuDisplay']),
    validateEmail () {
      if ((this.$route.name === 'HomePage' || this.$route.name === 'home') && this.loginData === 'none') {
        this.PopupBoxDisplay({message: this.$t('prompt.log_and_operate')})
        return
      }
      if (!this.loginData.activated) {
        this.PopupBoxDisplay({message: this.$t('prompt.email_not_certified')})
      } else {
        this.goPath('/funds/deposit')
      }
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
  // watch: {
  //   marketData () {
  //     if (this.marketData) {
  //       this.markList = this.marketData
  //     }
  //   }
  // },
  computed: {
    markList () {
      return this.marketData
    },
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
    ...mapGetters(['loginData', 'marketData']),
    ...mapState(['language', 'CmsUrl'])
  }
}
</script>

<style lang='scss' scoped>
@import "./Header.scss";
</style>
