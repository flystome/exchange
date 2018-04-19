<template>
  <div id="setting">
    <a class="dropdown-toggle setting_btn" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
      <span class="fa fa-user"></span><span>{{ loginData.show_name }}</span>
    </a>
    <ul class="dropdown-menu text-center">
      <!-- <li v-for="locale in locale" :key="locale.language">
        <a @click="changeLang(locale.language)">{{locale.name}}</a>
      </li> -->
      <li>
        <!-- <transition name="move"> -->
        <div class="switch clearfix" :class="{'move-left': move1, 'move-zero': !move1}" @click.prevent='move1=!move1'>
          <a href="###" class="on">ON</a>
          <span>音效</span>
          <a href="###" class="off">OFF</a>
        </div>
        <!-- </transition> -->
      </li>
      <li>
        <div class="switch clearfix" :class="{'move-left': move2, 'move-zero': !move2}" @click.prevent='move2=!move2'>
          <a href="###" class="on">ON</a>
          <span>通知</span>
          <a href="###" class="off">OFF</a>
        </div>
      </li>
      <li><span class="fa fa-cogs"></span>{{$t('exchange.setting')}}</li>
      <li><span class="fa fa-history"></span>{{$t('exchange.history')}}</li>
      <li><span class="fa fa-sign-out"></span>{{$t('exchange.signout')}}</li>
    </ul>
  </div>
</template>
<script>
// import { mapGetters } from 'vuex'

export default {
  name: 'setting',
  props: ['loginData'],
  data () {
    return {
      move1: false,
      move2: false
    }
  },
  computed: {
    // ...mapGetters(['loginData']),
  }
}
</script>
<style lang="scss">
  @import './setting.scss'
</style>
