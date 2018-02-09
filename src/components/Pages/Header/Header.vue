<template>
  <div class="navbar-Home">
     <header class="container navbar navbar-static-top clearfix" role="navigation">
     <ul class="nav nav-pills navbar-header">
       <img src="~Img/logo.png" class="btc-fl btc-marginT5">
      <li role="presentation" class="btc-marginL30"><a href="#">主页</a></li>
      <li role="presentation"><a href="#">交易</a></li>
      <li role="presentation" class="dropdown">
        <a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
          IFO分叉 <span class="caret"></span>
        </a>
        <ul class="dropdown-menu">
          <li><a href="#">Action</a></li>
          <li><a href="#">Another action</a></li>
          <li><a href="#">Something else here</a></li>
          <li role="separator" class="divider"></li>
          <li><a href="#">Separated link</a></li>
        </ul>
      </li>
    </ul>
    <ul class="nav navbar-nav navbar-right nav-margin">
    请<router-link :to='"/login"'>登录</router-link>或<router-link :to='"/register"'>注册</router-link>后操作
    </ul>
    <!-- <ul class="hidden-xs nav login-active navbar-nav navbar-right nav-margin">
      <li class="btc-img-position">
        <img src="~Img/avatarlog.png">
        80834004@qq.com
      </li>
      <li class="btc-marginL15 btc-img-position">
        <img src="~Img/assetlog.png">
        0.95687320 BTC
      </li>
      <li class="btc-marginL15">
        <img src="~Img/letterlog.png">
      </li>
      <li role="presentation" class="dropdown">
        <a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
          <img src="~Img/countrylog.png" class="btc-marginL5 btc-marginR5">中国大陆 <span class="caret"></span>
        </a>
        <ul class="dropdown-menu">
          <li><a href="#">Action</a></li>
          <li><a href="#">Another action</a></li>
          <li><a href="#">Something else here</a></li>
          <li role="separator" class="divider"></li>
          <li><a href="#">Separated link</a></li>
        </ul>
      </li>
    </ul> -->
  </header>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  create () {
    this.$store.dispatch('getData')
  },
  computed: {
    ...mapGetters(['loginData'])
  }
}
</script>

<style lang='scss' scoped>
@import './Header.scss'
</style>
