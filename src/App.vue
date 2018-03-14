<template>
  <div id="app">
    <section class="btc-main">
      <header is='Header' />
      <div class="btc-container container" v-cloak>
        <keep-alive>
          <router-view/>
        </keep-alive>
      </div>
    </section>
    <footer is='Footer' />
    <wrapper></wrapper>
    <popup-box></popup-box>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Header from '@/components/Pages/Header/Header'
import Footer from '@/components/Pages/Footer/Footer'
import Wrapper from '@/components/PublicComponents/Wrapper/Wrapper'
import PopupBox from '@/components/PublicComponents/PopupBox/PopupBox'

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    Wrapper,
    PopupBox
  },
  computed: {
    ...mapGetters(['loginData'])
  }
}
</script>

<style>
#app{
  height: 100%;
}
.btc-main{
  min-height: 100%;
  padding-bottom: 217px;
}

.input.is-danger, .textarea.is-danger {
    border-color: #ff3860;
    background: white;
}

.help {
    display: block;
    font-size: 11px;
    margin-top: 5px;
}

.help.is-danger {
    color: #ff3860;
}

[v-cloak] {
  display: none;
}

html, body {
  height: 100%;
}

body{
  font-family: '微软雅黑';
}

.btc-white-btn{
  border: 1px solid #4382f7;
  color: #4382f7;
  background: white;
}

.btc-container{
  background: #f2f2f2;
  padding-bottom: 13px;
  min-height: 70vh;
}

.btc-container-block{
  background: white;
  margin-top: 10px;
  overflow: hidden;
}

.btn{
  border-radius: 0
}

.btn:active{
 box-shadow: none;
}

.btn:hover{
  color: white
}

.btc-link{
  color: #4382f7!important;
  cursor: pointer;
}

.btc-link:hover{
  text-decoration: none!important;
  color: #4382f7!important;
}

.btc-white-btn:hover,.btc-white-btn:focus{
  color: #4382f7;
}

.btc-basic-button:hover,.btc-basic-button:focus{
  color: white;
}

#app .btn[disabled=true]{
  cursor: not-allowed
}

.btc-poniter{
  cursor: pointer;
}

.btc-pointer{
  cursor: pointer;
}

.btc-b-def{
  border: 1px solid #dfe0e1;
}

.btc-b{
  border: 1px solid #f2f2f2;
}

.btc-b-r{
  border-right:1px solid #f2f2f2;
}

.btc-b-l{
  border-left:1px solid #f2f2f2;
}

.btc-b-t{
  border-top:1px solid #f2f2f2;
}

.btc-b-b{
  border-bottom:1px solid #f2f2f2;
}

.btc-fr{
  float: right;
}

.btc-fl{
  float: left;
}

.btc-font12{
  font-size: 12px;
}

.btc-color333{
  color: #333333;
}

.btc-color666{
  color: #666666;
}

.btc-color999{
  color: #999999;
}

</style>

<style lang="scss">
@for $len from 0 through 100 {
  @if $len%5 == 0{
  .btc-marginT#{$len}{
    margin-top: #{$len}px
  }
  .btc-marginL#{$len}{
    margin-left: #{$len}px
  }
  .btc-marginR#{$len}{
    margin-right: #{$len}px
  }
  .btc-marginB#{$len}{
    margin-bottom: #{$len}px
  }

  .btc-paddingT#{$len}{
    padding-top: #{$len}px
  }
  .btc-paddingB#{$len}{
    padding-bottom: #{$len}px
  }
  .btc-paddingL#{$len}{
    padding-left: #{$len}px
  }
  .btc-paddingR#{$len}{
    padding-right: #{$len}px
  }
  }
}
</style>
