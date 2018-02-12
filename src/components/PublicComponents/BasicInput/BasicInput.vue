<template>
  <input  type="text"
    @input="$emit('input', $event.target.value)"
    class="btc-basicInput btc-b"/>
</template>

<script>
export default {
  name: 'BasicInput'
}
</script>

<style lang='scss'>
@import './BasicInput'
</style>
