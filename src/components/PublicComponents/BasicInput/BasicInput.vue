<template>
  <input type="text"
    @input="$emit('input', $event.target.value)"
    class="btc-basicInput"/>
</template>

<script>
export default {
  name: 'BasicInput'
}
</script>

<style>
@import './BasicInput'
</style>
