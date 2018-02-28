<template>
  <div style="min-height: 66px;">
    <input v-validate="`required|${type}`" class="btc-basicInput btc-b"
    :class="{'input': true, 'is-danger': errors.has(type) }"
    :name="type"
    type="text"
    :placeholder="placeholder"
     @input="$emit('input', $event.target.value)">
    <span v-show="errors.has(type)" class="help is-danger">{{ errors.first(type) }}</span>
  </div>
</template>

<script>
export default {
  props: ['placeholder', 'type'],
  name: 'BasicInput'
}
</script>

<style lang='scss'>
@import './BasicInput'
</style>
