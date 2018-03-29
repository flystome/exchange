<template>
  <transition name='SideSlipMenu'>
    <div class='btc-SideSlipMenu' v-if='SideSlipMenu' @click='SideSlipMenuDisplay(false)'>
      <div>
        <ul @click.stop>
          <li class='btc-marginL30 btc-marginT30'>
            {{ loginData.show_name }}
          </li>
          <li>
            <span @click="validateEmail">
              <img src='~Img/sideslip-assets.png'>
              {{ $t('side_slip_menu.asset_management') }}
            </span>
          </li>
          <li class="marketlist">
            <div @click="market = !market">
              <img src='~Img/sideslip-market.png'> {{$t('nav.transaction')}}
              <span class="btc-fr btc-marginR20">
                <img v-if="market" src="~Img/triangle-down.png">
                <img v-else src="~Img/triangle-up.png">
              </span>
            </div>
            <ul v-if="market" class="btc-marginT60 btc-marginL30">
               <li v-for="d in marketData" :key="Object.keys(d)[0]">
                  <a @click="gomarket(`/markets/${Object.keys(d)[0]}`)">
                    {{ d[Object.keys(d)[0]].name }}
                  </a>
                </li>
            </ul>
          </li>
          <li class='btc-paddingB0'>
            <div @click="Consulting = !Consulting">
              <img src='~Img/sideslip-consulting.png'> {{ $t('side_slip_menu.consulting_center') }}
              <span class="btc-fr btc-marginR20">
                <img v-if="Consulting" src="~Img/triangle-down.png">
                <img v-else src="~Img/triangle-up.png">
              </span>
            </div>
            <ul v-if="Consulting">
              <li class='btc-paddingT60 btc-marginL30'>
                <a :href="`${HOST_URL}/xchg`">
                  {{ $t('side_slip_menu.announcement') }}
                </a>
              </li>
              <li class='btc-marginL30'>
                <a :href="`${HOST_URL}/`">FAQ</a>
              </li>
              <li class='btc-marginL30'>
                <a :href="`${HOST_URL}/conversations`">{{ $t('side_slip_menu.news') }}</a>
              </li>
            </ul>
          </li>
          <li @click="validate()">
            <img src='~Img/sideslip-myaccount.png'>
            {{ $t('side_slip_menu.my_account') }}
          </li>
          <li>
            <div @click="Lang = !Lang">
              <img src='~Img/sideslip-lang.png'> {{ $t('side_slip_menu.language') }}
              <span class="btc-fr btc-marginR20">
                <img v-if="Lang" src="~Img/triangle-down.png">
                <img v-else src="~Img/triangle-up.png">
              </span>
            </div>
            <ul v-if="Lang" class="btc-marginT60">
              <li v-for="data in locale" @click="changeLang(data.language)" :key="data.name" class='btc-marginL30'>
                {{ data.name }}
              </li>
            </ul>
          </li>
          <li>

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
    validate () {
      if ((this.$route.name === 'HomePage' || this.$route.name === 'home') && this.loginData === 'none') {
        this.PopupBoxDisplay({message: this.$t('prompt.log_and_operate')})
      } else {
        this.goPath('/my_account')
      }
    },
    validateEmail () {
      if ((this.$route.name === 'HomePage' || this.$route.name === 'home') && this.loginData === 'none') {
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
    ...mapMutations(['SideSlipMenuDisplay', 'ChangeLanguage', 'PopupBoxDisplay'])
  },
  computed: {
    ...mapState(['SideSlipMenu', 'loginData']),
    ...mapGetters(['marketData'])
  }
}
</script>
<style lang='scss' scoped>
  @import './SideSlipMenu.scss'
</style>
