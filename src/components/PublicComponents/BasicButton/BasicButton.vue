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

<style>
@import 'BasicButton.css'
</style>
