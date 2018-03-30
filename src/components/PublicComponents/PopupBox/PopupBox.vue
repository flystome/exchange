<template>
    <transition name="PopupBox">
      <component :key="'hint'" class="btc-popupBox" v-if="PopupBox.status" :is="component"></component>
    </transition>
</template>

<script>
import Hint from './Hint/Hint'
import { mapState } from 'vuex'
export default {
  name: 'PopupBox',
  data () {
    return {
      component: 'Hint'
    }
  },
  computed: {
    ...mapState(['PopupBox'])
  },
  components: {
    Hint
  }
}
</script>

<style lang="scss" scoped>
  .btc-popupBox{
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    left: 0;
    background: black;
    transition: all 0.23s;
    z-index: 9999;
  }
  .PopupBox-enter, .PopupBox-leave-to {
    opacity: 0;
    .bb{
      color: red;
    }
  }
  .bb {
    transition: all 0.5s;
  }
</style>
