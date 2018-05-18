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
              <i class="sideslip-assets"></i>
              {{ $t('side_slip_menu.asset_management') }}
            </span>
          </li>
          <li class="text-center">
            <div v-if="loginData === 'none'">
              <span style="margin-right: 23%;">
                <a :href="`${HOST_URL}/signin`">{{ $t('nav.login') }}</a>
              </span>
              <span>
                <a :href="`${HOST_URL}/signup`">{{ $t('nav.register') }}</a>
              </span>
            </div>
          </li>
          <li class="marketlist" :class="{'btc-sideslip-marignB0': market}">
            <div @click="market = !market">
              <i class="sideslip-market"></i> {{$t('nav.transaction')}}
              <span class="btc-fr btc-marginR20">
                <i v-if="!market" class="sideslip-triangle-down"></i>
                <i v-else class="sideslip-triangle-up"></i>
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
              <i class='sideslip-consulting'/> {{ $t('side_slip_menu.consulting_center') }}
              <span class="btc-fr btc-marginR20">
                <i v-if="!Consulting" class="sideslip-triangle-down"></i>
                <i v-else class="sideslip-triangle-up"></i>
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
            <i class='sideslip-myaccount' />
            {{ $t('side_slip_menu.my_account') }}
          </li>
          <li :class="{'btc-sideslip-marignB0': Lang}">
            <div @click="Lang = !Lang">
              <i class='sideslip-lang' /> {{ $t('side_slip_menu.language') }}
              <span class="btc-fr btc-marginR20">
                <i v-if="!Lang" class="sideslip-triangle-down"></i>
                <i v-else class="sideslip-triangle-up"></i>
              </span>
            </div>
            <ul v-if="Lang" class="btc-marginT60">
              <li v-for="data in locale" @click="changeLang(data.language)" :key="data.name" class='btc-marginL30'>
                {{ data.name }}
              </li>
            </ul>
          </li>
          <li class="">
            <i class='sideslip-pc' />
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
  mapGetters
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
    ...mapMutations(['SideSlipMenuDisplay', 'ChangeLanguage', 'PopupBoxDisplay', 'gotoPc'])
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
