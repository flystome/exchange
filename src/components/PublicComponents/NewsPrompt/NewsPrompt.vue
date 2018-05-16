<template>
  <div class="btc-newsPrompt">
      <transition name="prompt">
        <span class="btc-news-animation" v-if="text">
          <strong>
            {{ this.text }}
          </strong>
        </span>
      </transition>
  </div>
</template>

<script>
export default {
  name: 'NewsPrompt',
  props: {
    text: {
      type: String
    },
    Time: {
      type: Number
    }
  },
  data () {
    return {
      Timer: ''
    }
  },
  watch: {
    text () {
      if (this.text && this.Time) {
        if (this.Timer) clearTimeout(this.Timer)
        this.Timer = setTimeout(() => {
          this.$emit('bind', '')
        }, this.Time)
      }
    }
  }
}
</script>

<style lang='scss'>
  @import './NewsPrompt.scss'
</style>
