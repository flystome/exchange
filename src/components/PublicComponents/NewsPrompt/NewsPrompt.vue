<template>
  <div class="btc-news-prompt">
    <transition name="news-prompt">
      <span v-if="prompt.display">
        {{ prompt.text }}
      </span>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'NewsPrompt',
  props: ['prompt']
}
</script>

<style lang='scss' scoped>
  .btc-news-prompt{
    position: relative;
    transition: 1s all;
  }
  .news-prompt-enter,.news-prompt-leave-active{
    transform: translateX(-20px)
  }
</style>
