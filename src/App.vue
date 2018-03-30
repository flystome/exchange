<template>
  <div id="app">
    <transition name='SideSlipMenu'>
      <section class="btc-main" :class="{'btc-background-white': this.$route.name === 'HomePage' ||  this.$route.name === 'home'}">
        <header is='Header' />
        <div v-if="loading" class="btc-container container" v-cloak>
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </div>
      <div style="margin-top: 15%;margin-bottom: 15%;" v-else>
        <vue-simple-spinner size="88"></vue-simple-spinner>
      </div>
      </section>
    </transition>
    <footer v-if='mobile' is='Footer' />
    <wrapper></wrapper>
    <popup-box></popup-box>
    <side-slip-menu></side-slip-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Header from '@/components/Pages/Header/Header'
import Footer from '@/components/Pages/Footer/Footer'
import SideSlipMenu from '@/components/Pages/SideSlipMenu/SideSlipMenu'
import Wrapper from '@/components/PublicComponents/Wrapper/Wrapper'
import PopupBox from '@/components/PublicComponents/PopupBox/PopupBox'

export default {
  name: 'App',
  data () {
    return {
      unLogin: ['HomePage', 'Markets', 'MarketDetail', 'Trades', 'home'],
      mobile: false
    }
  },
  components: {
    Header,
    Footer,
    SideSlipMenu,
    Wrapper,
    PopupBox
  },
  mounted: function () {
    this.mobile = !/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
  },
  computed: {
    loading () {
      if (this.unLogin.includes(this.$route.name)) {
        return true
      } else {
        if (this.loginData !== 'none') {
          return true
        }
      }
      return false
    },
    ...mapGetters(['loginData'])
  }
}
</script>

<style scoped lang='scss'>
.btc-main{
  background:#f2f2f2;
}
.btc-background-white{
  background: white;
  .btc-container{
  background: white;
  }
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
