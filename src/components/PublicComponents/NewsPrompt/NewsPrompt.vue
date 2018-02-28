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
  props: ['text']
}
</script>

<style lang='scss'>
  @import './NewsPrompt.scss'
</style>
