<template>
  <button class="btc-basic-button">
    {{ text }}
  </button>
</template>

<script>
export default {
  name: 'BasicButton',
  props: ['text']
}
</script>

<style scoped>
@import 'BasicButton.css'
</style>
