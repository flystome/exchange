<template>
  <div v-if="type" style="min-height: 66px;">
    <input v-validate="`required|${type}`" class="btc-basicInput btc-b"
    :class="{'input': true, 'is-danger': errors.has(type) }"
    :name="type"
    type="text"
    :value='value'
    :placeholder="placeholder"
     @input="$emit('input', $event.target.value)">
    <span v-show="errors.has(type)" class="help is-danger">{{ errors.first(type) }}</span>
  </div>
  <div v-else>
    <input class="btc-basicInput btc-b"
    :placeholder="placeholder"
    :value='value'
     @input="$emit('input', $event.target.value)">
     <slot name='button'></slot>
  </div>
</template>

<script>
export default {
  props: ['placeholder', 'type', 'value'],
  name: 'BasicInput'
}
</script>

<style lang='scss'>
@import './BasicInput'
</style>
