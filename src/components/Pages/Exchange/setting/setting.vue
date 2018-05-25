<template>
  <div id="setting" @mouseenter='show=true' @mouseleave='show=false'>
    <a class="dropdown-toggle setting_btn" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
      <span class="fa fa-user"></span><span>{{ loginData.show_name }}</span>
    </a>
    <ul class="dropdown text-center" :class="{'show': show}">
      <li>
        <div class="switch clearfix" :class="{'move-left': move1, 'move-zero': !move1}" @click.prevent='sound'>
          <a href="###" class="on">ON</a>
          <span>音效</span>
          <a href="###" class="off">OFF</a>
        </div>
      </li>
      <li>
        <div class="switch clearfix" :class="{'move-left': move2, 'move-zero': !move2}" @click.prevent='notification'>
          <a href="###" class="on">ON</a>
          <span>通知</span>
          <a href="###" class="off">OFF</a>
        </div>
      </li>
      <li><a :href="`${ROUTER_VERSION}/my_account`" target="_blank"><span class="fa fa-cogs"></span>{{$t('exchange.setting')}}</a></li>
      <li><a :href="`${ROUTER_VERSION}/form/order`" target="_blank"><span class="fa fa-history"></span>{{$t('exchange.history')}}</a></li>
      <li><a :href="`${HOST_URL}/signout`"><span class="fa fa-sign-out"></span>{{$t('exchange.signout')}}</a></li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'setting',
  props: ['loginData'],
  data () {
    return {
      HOST_URL: process.env.HOST_URL,
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      move1: false,
      move2: false,
      show: false
    }
  },
  methods: {
    sound () {
      this.move1 = !this.move1
      this.$emit('controlSound', !this.move1)
    },
    notification () {
      this.move2 = !this.move2
      this.$emit('notification', !this.move2)
    }
  }
}
</script>
<style lang="scss">
  @import './setting.scss'
</style>
