<template>
  <div id="app" :class="{'home-contain': this.$route.path === `${version}/funds/line` || this.$route.name === 'HomePage' ||  this.$route.name === 'home', 'backround-white': isWhiteBackground, 'lang-long': language !== 'zh-TW'}">
    <ul class="homepage-newCoin" v-if="FROM_HOME && new_coin.length !== 0">
      <div class="container bgNone">
        <li v-for="data in new_coin" :key='data.id'>
          <a :href="data.url">{{ data.the_title }}</a>
        </li>
      </div>
    </ul>
    <section class="main" :class="{'home-contain': this.$route.path === `${version}/funds/line` || this.$route.name === 'HomePage' ||  this.$route.name === 'home', 'exchange': this.$route.name === 'Exchange', 'backround-white': isWhiteBackground}">
      <header :FROM='FROM_HOME'  v-if="!fromApp && !exChange" is='Header' />
      <div style="position:relative;z-index:999;background:#f2f2f2" class="global-loading" v-if='!loading && !this.unLogin.includes(this.$route.name)'>
        <vue-simple-spinner size="88"></vue-simple-spinner>
      </div>
      <div v-else class="box-container container" :class="{'noPadding':noPadding}">
        <keep-alive :exclude="['LoginVerfication','Form', 'SignUp', 'ValidateSms', 'ForgotPassword', 'SignIn', 'ValidateIdentity', 'ValidateGoogle']">
          <router-view></router-view>
        </keep-alive>
      </div>
    </section>
    <footer :FROM='(FROM_HOME || this.$route.path === `${version}/funds/line`)' v-if='!fromApp && noMobile && !exChange' is='Footer' />
    <wrapper></wrapper>
    <popup-box></popup-box>
    <side-slip-menu></side-slip-menu>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { unLogin } from '@/common/js/bus/public'
import Header from '@/components/Pages/Header/Header'
import Footer from '@/components/Pages/Footer/Footer'
import SideSlipMenu from '@/components/Pages/SideSlipMenu/SideSlipMenu'
import Wrapper from '@/components/PublicComponents/Wrapper/Wrapper'
import PopupBox from '@/components/PublicComponents/PopupBox/PopupBox'
export default {
  name: 'App',
  data () {
    return {
      unLogin: unLogin,
      version: process.env.ROUTER_VERSION,
      noMobile: true,
      noPaddingList: ['MexchangeMarkets', 'MexchangeDetail', 'MexchangeTrades', 'MexchangeOrders'],
      noPadding: false,
      exChange: true,
      FROM_HOME: '',
      new_coin: ''
    }
  },
  beforeMount: function () {
    this.noMobile = !/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
  },
  methods: {
    GetNewCoin () {
      this._get({
        url: '/cms/api/announcements.json',
        data: {
          category: 'new-coin',
          locale: this.language
          // per_page: '3'
        }
      }, (d) => {
        this.new_coin = d.data
      })
    }
  },
  computed: {
    loading () {
      if (this.loginData !== 'none') {
        return true
      }
      return false
    },
    isWhiteBackground () {
      var route = ['MarketMaker', 'notFound', 'MarketApply', 'HomePage', 'home']
      return route.includes(this.$route.name)
    },
    ...mapState(['fromApp', 'language']),
    ...mapGetters(['loginData'])
  },
  components: {
    Header,
    Footer,
    SideSlipMenu,
    Wrapper,
    PopupBox
  },
  watch: {
    '$route' (to, from) {
      if (to.name === 'Exchange') {
        this.exChange = true
      } else {
        this.exChange = false
      }
      if (this.noPaddingList.indexOf(to.name) !== -1) {
        this.noPadding = true
      }
      if (to.name === 'HomePage' || to.name === 'home') {
        if (this.new_coin === '') this.GetNewCoin()
        this.FROM_HOME = true
      } else {
        this.FROM_HOME = false
      }
    },
    language () {
      this.GetNewCoin()
    }
  }
}
</script>

<style scoped lang='scss'>
.main{
  background:#f2f2f2;
}
.backround-white{
  background: white;
  .container{
    background: white;
    &.bgNone {
      background: none;
    }
  }
}
.exchange {
  background: #1b242e;
  width: 100%;
  min-width: 1200px;
  height: 100%;
  .container {
    width: 100%;
    height: 100%;
    background: none;
    padding: 0;
  }
}

.homepage-newCoin{
  min-width: 1200px;
  font-size: 12px;
  left: 0;
  width: 100%;
  background: #232731;
  margin: 0;
  padding: 0;
  ul,li {
    margin: 0;
    padding: 0;
  }
  li {
    display: inline-block;
    width: 33%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    text-align: center;
    padding: 10px 0;
    padding-bottom: 5px;
  }
  a {
    color: #3e81ff;
    &:focus,&:hover{
      text-decoration: none;
    }
  }
}
</style>

<style lang="scss">
@for $len from 0 through 100 {
  @if $len%5 == 0{
  .marginT#{$len}{
    margin-top: #{$len}px
  }
  .marginL#{$len}{
    margin-left: #{$len}px
  }
  .marginR#{$len}{
    margin-right: #{$len}px
  }
  .marginB#{$len}{
    margin-bottom: #{$len}px
  }

  .paddingT#{$len}{
    padding-top: #{$len}px
  }
  .paddingB#{$len}{
    padding-bottom: #{$len}px
  }
  .paddingL#{$len}{
    padding-left: #{$len}px
  }
  .paddingR#{$len}{
    padding-right: #{$len}px
  }
  }
}
</style>
