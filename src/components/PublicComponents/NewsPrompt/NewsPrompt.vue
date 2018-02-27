<template>
    <transition name="prompt">
      <span class="btc-news-animation" v-if="text">
        <strong>
          {{ this.text }}
        </strong>
      </span>
    </transition>
</template>

<script>
export default {
  name: 'NewsPrompt',
  props: ['text']
}
</script>

<style>
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
