<template>
  <div class="btc-news-prompt">
    <transition name="prompt">
      <span v-if="prompt.display" class="btc-news-animation">
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

<style>
  .btc-news-prompt{
    position: relative;
  }
  .btc-news-animation{
    color: #fc4a4a;
    position: absolute;
    transition: all 0.5s;
  }
  .prompt-enter, .prompt-leave-to {
    transform: translateX(30px);
    opacity: 0;
  }
</style>
