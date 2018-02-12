<template>
  <div id="app">
    <header is='Header' />
    <div class="btc-container">
      <div class="container">
        <router-view/>
      </div>
    </div>
    <footer is='Footer' />
    <wrapper></wrapper>
    <popup-box></popup-box>
  </div>
</template>

<script>
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
  }
}
</script>

<style>
[v-cloak] {
  display: none;
}

html, body {
  height: 100%;
}

body{
  font-family: '微软雅黑';
}

.btc-container{
  background: #f2f2f2;
  padding-bottom: 13px;
  min-height: 70vh;
}

.btc-container-block{
  background: white;
  margin-top: 10px;
}

.btc-link{
  color: #4382f7;
}

.btc-link:hover{
  text-decoration: none;
  cursor: pointer;
  color: #4382f7;
}

.btc-poniter{
  cursor: pointer;
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
