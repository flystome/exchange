<template>
  <transition name='SideSlipMenu'>
    <div class='btc-SideSlipMenu' v-if='SideSlipMenu' @click='SideSlipMenuDisplay(false)'>
      <div>
        <ul @click.stop>
          <li class='btc-marginL30 btc-marginT30'>
            {{ loginData.show_name }}
          </li>
          <li v-if="loginData !== 'none'">
            <span @click="validateEmail">
              <img src='@/common/svg/sideslip-assets.svg' />
              {{ $t('side_slip_menu.asset_management') }}
            </span>
          </li>
          <li class="text-center">
            <div v-if="loginData === 'none'">
              <span style="margin-right: 23%;">
                <a :href="`${ROUTER_VERSION}/login`">{{ $t('nav.login') }}</a>
              </span>
              <span>
                <router-link :to="`${ROUTER_VERSION}/register`">{{ $t('nav.register') }}</router-link>
              </span>
            </div>
          </li>
          <li class="marketlist" :class="{'btc-sideslip-marignB0': market}">
            <div @click="market = !market">
              <img src='@/common/svg/sideslip-market.svg' /> {{$t('nav.transaction')}}
              <span class="btc-fr btc-marginR20">
                <img src='@/common/svg/sideslip-dropdown.svg' class="sideslip-triangle" :class="`${!market ? 'sideslip-triangle-down' : 'sideslip-triangle-up'}`">
              </span>
            </div>
            <ul v-if="market" class="btc-marginT60 btc-marginL30">
               <li v-for="d in marketData" :key="Object.keys(d)[0]">
                  <a :href="`${ROUTER_VERSION}/exchange/${Object.keys(d)[0]}`">
                    {{ d[Object.keys(d)[0]].name }}
                  </a>
                </li>
            </ul>
          </li>
          <li class='btc-paddingB0' :class="{'btc-sideslip-marignB0': Consulting}">
            <div @click="Consulting = !Consulting">
              <img src='@/common/svg/sideslip-consulting.svg' /> {{ $t('side_slip_menu.consulting_center') }}
              <span class="btc-fr btc-marginR20">
                <img src='@/common/svg/sideslip-dropdown.svg' class="sideslip-triangle" :class="`${!Consulting ? 'sideslip-triangle-down' : 'sideslip-triangle-up'}`">
              </span>
            </div>
            <ul v-if="Consulting">
              <li class='btc-paddingT60 btc-marginL30'>
                <a :href="CmsUrl.announcement">
                  {{ $t('side_slip_menu.announcement') }}
                </a>
              </li>
              <li class='btc-marginL30'>
                <a :href="CmsUrl.helper_center">FAQ</a>
              </li>
              <li class='btc-marginL30 btc-marginB0'>
                <a @click="goPath('/form/news')">
                  {{ $t('side_slip_menu.news') }}
                </a>
              </li>
            </ul>
          </li>
          <li v-if="loginData !== 'none'" @click="validate()">
            <img src='@/common/svg/sideslip-myaccount.svg' />
            {{ $t('side_slip_menu.my_account') }}
          </li>
          <li :class="{'btc-sideslip-marignB0': Lang}">
            <div @click="Lang = !Lang">
              <img src='@/common/svg/sideslip-lang.svg' /> {{ $t('side_slip_menu.language') }}
              <span class="btc-fr btc-marginR20">
                <img src='@/common/svg/sideslip-dropdown.svg' class="sideslip-triangle" :class="`${!Lang ? 'sideslip-triangle-down' : 'sideslip-triangle-up'}`">
              </span>
            </div>
            <ul v-if="Lang" class="btc-marginT60">
              <li v-for="data in locale" @click="changeLang(data.language)" :key="data.name" class='btc-marginL30'>
                {{ data.name }}
              </li>
            </ul>
          </li>
          <li class="">
            <img src='@/common/svg/sideslip-pc.svg' />
            <span @click="goPc">
              {{$t('side_slip_menu.desktop_end')}}
            </span>
          </li>
          <li class="text-center">
            <div v-if="loginData !== 'none'">
              <a :href="`${HOST_URL}/signout`">{{ $t('nav.exit') }}</a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapGetters,
mapActions
} from 'vuex'
export default {
  name: 'SideSlipMenu',
  data () {
    return {
      HOST_URL: process.env.HOST_URL,
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      Consulting: false,
      Lang: false,
      unLogin: ['HomePage', 'Markets', 'MarketDetail', 'Trades', 'home', 'notFound'],
      market: false,
      markList: [],
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
    gomarket (route) {
      this.SideSlipMenuDisplay(false)
      this.market = false
      this.goPath(route)
    },
    changeLang (str) {
      this.SideSlipMenuDisplay(false)
      this.Lang = !this.Lang
      this.ChangeLanguage(str)
    },
    goPc () {
      this.SideSlipMenuDisplay(false)
      this.gotoPc()
      this.$router.push('/')
    },
    validate () {
      if (this.unLogin.includes(this.$route.name) && this.loginData === 'none') {
        this.PopupBoxDisplay({message: this.$t('prompt.log_and_operate')})
      } else {
        this.goPath('/my_account')
      }
    },
    validateEmail () {
      if (this.unLogin.includes(this.$route.name) && this.loginData === 'none') {
        this.PopupBoxDisplay({message: this.$t('prompt.log_and_operate')})
        return
      }
      if (!this.loginData.activated) {
        this.PopupBoxDisplay({message: this.$t('prompt.email_not_certified')})
      } else {
        this.goPath('/currency/deposit')
      }
    },
    goPath (path, status, href) {
      this.SideSlipMenuDisplay(false)
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
    ...mapActions(['ChangeLanguage']),
    ...mapMutations(['SideSlipMenuDisplay', 'PopupBoxDisplay', 'gotoPc'])
  },
  computed: {
    ...mapState(['SideSlipMenu', 'loginData', 'CmsUrl']),
    ...mapGetters(['marketData'])
  }
}
</script>
<style lang='scss' scoped>
  @import './SideSlipMenu.scss'
</style>
