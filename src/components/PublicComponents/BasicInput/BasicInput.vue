<template>
  <!-- <div v-if="!hidden" style="min-height: 66px;">
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
  </div> -->
  <div>
    <input v-validate="validate ? `required|${validate}` : ''"
    :class="{'input': true, 'is-danger':
    errors.has(`${validate}`) }"
    :value='value'
    :readonly='readonly'
    :type="type ? type : 'text'"
    :name="`${validate}`"
    class="btc-basicInput btc-b"
    :placeholder='placeholder'
    @input="$emit('input', $event.target.value)">
    <slot name='button'></slot>
    <span v-show="errors.has(`${validate}`)" class="help is-danger">{{ errors.first(`${validate}`) | toUpperCase }}</span>
  </div>
</template>

<script>
export default {
  props: ['placeholder', 'validate', 'value', 'type', 'hidden', 'readonly'],
  name: 'BasicInput',
  filters: {
    toUpperCase (str) {
      return str && `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`
    }
  }
}
</script>

<style lang='scss'>
@import './BasicInput'
</style>
