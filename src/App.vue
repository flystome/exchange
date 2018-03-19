<template>
  <div id="app">
    <section class="btc-main">
      <header is='Header' />
      <div class="btc-container container" v-cloak>
        <keep-alive>
          <router-view></router-view>
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
