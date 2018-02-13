<template>
    <transition name="PopupBox">
      <component class="btc-popupBox" v-if="PopupBox" :is="component"></component>
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
    background: balck;
    transition: all 0.23s;
  }
  .PopupBox-enter, .PopupBox-leave-to {
    opacity: 0;
  }
</style>
