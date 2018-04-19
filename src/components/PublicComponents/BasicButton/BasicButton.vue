<template>
  <button class="btc-basic-button">
    {{ text }}
    <slot name="file" />
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
