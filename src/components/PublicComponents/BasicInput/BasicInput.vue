<template>
  <div v-if="!hidden" style="min-height: 66px;">
    <input v-validate="`required|${validate}`" class="btc-basicInput btc-b"
    :class="{'input': true, 'is-danger': errors.has(validate) }"
    :name="validate"
    :type="type ? type : 'text'"
    :value='value'
    :placeholder="placeholder"
     @input="$emit('input', $event.target.value)">
    <span v-show="errors.has(validate)" class="help is-danger">{{ errors.first(validate) }}</span>
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
  props: ['placeholder', 'validate', 'value', 'type', 'hidden'],
  name: 'BasicInput'
}
</script>

<style lang='scss'>
@import './BasicInput'
</style>
