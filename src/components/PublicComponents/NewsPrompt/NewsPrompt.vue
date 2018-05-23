<template>
  <div style="min-height: 22px;">
    <transition name="prompt">
      <div v-if="text" class="btc-newsPrompt">
        <span class="btc-news-animation">
          <strong>
            {{ this.text }}
          </strong>
        </span>
      </div>
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
