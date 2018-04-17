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
        <input type="checkbox" name="sound-checkbox" data-size='mini' data-on-color='success'>
      </li>
      <li>
        <input type="checkbox" name="notification-checkbox" data-size='mini' data-on-color='success'>
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
