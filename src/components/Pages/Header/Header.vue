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
            <li class="btc-link"><a :href="`${HOST_URL}`">主页 <span class="sr-only">(current)</span></a></li>
            <li class="btc-link"><a :href="`${HOST_URL}/xchg`">交易</a></li>
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">IFO分叉 <span class="caret"></span></a>
              <ul class="dropdown-menu">
                <li><a :href="`${HOST_URL}/ifo/btc`">BTC</a></li>
                <li><a :href="`${HOST_URL}/ifo/ltc`">LTC</a></li>
                <li><a :href="`${HOST_URL}/ifo/eth`">ETH</a></li>
              </ul>
            </li>
          </ul>
          <ul class="nav navbar-nav navbar-right btc-header-signin" v-if="loginData === '' || loginData.errors">
            请<a :href="`${HOST_URL}/signin`">登录</a>或<a :href="`${HOST_URL}/signup`">注册</a>后操作
          </ul>
          <ul class="nav navbar-nav navbar-right" v-else>
            <li class="btc-img-position" @click="goHome('/')" style="cursor: pointer">
              <img src="~Img/avatarlog.png" class="btc-header-avatar">
              {{ this.loginData.email }}
            </li>
            <li class="btc-marginL15 btc-img-position">
              <img src="~Img/assetlog.png"  class="btc-header-asset">
              0 BTC
            </li>
            <li class="btc-marginL15">
              <img src="~Img/letterlog.png">
            </li>
            <li role="presentation" class="dropdown btc-country">
              <a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                <img src="~Img/countrylog.png" class="btc-marginL5 btc-marginR5"><span @click="changeLang('zh')">简体中文</span> <span class="caret"></span>
              </a>
              <ul class="dropdown-menu">
                <li><a @click="changeLang('en')"><img src="~Img/us.png" class='btc-marginR5'>English</a></li>
              </ul>
            </li>
          </ul>
        </div>
    </nav>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  created () {
    this.$store.dispatch('getData')
  },
  data () {
    return {
      HOST_URL: process.env.HOST_URL
    }
  },
  methods: {
    changeLang (str) {
      this.$i18n.locale = str
    },
    goPath (path, status, href) {
      if (status) {
        return
      }
      if (href) {
        location.href = `${this.HOST_URL}${path}`
      }
      this.$router.push({
        path: path
      })
    },
    goHome () {
      this.$router.push('/', () => {
        this.$store.dispatch('getData')
      })
    }
  },
  computed: {
    ...mapGetters(['loginData'])
  }
}
</script>

<style lang='scss' scoped>
@import "./Header.scss";
</style>
