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
    <input :data-vv-delay="delay" v-validate="validate ? `${validate}` : ''"
    :class="{'input': true, 'is-danger':
    errors.has(`${validate}`) || invalid }"
    :value='value'
    :readonly='readonly'
    :type="type ? type : 'text'"
    :name="`${validate}`"
    class="btc-basicInput btc-b"
    :placeholder='placeholder'
    @input="$emit('input', $event.target.value)">
    <slot name='button'></slot>
    <span v-show="errors.has(`${validate}`) && !danger" class="help is-danger">{{ error }}</span>
  </div>
</template>

<script>
export default {
  props: ['placeholder', 'validate', 'value', 'type', 'hidden', 'readonly', 'delay', 'danger', 'invalid'],
  name: 'BasicInput',
  computed: {
    error () {
      var result = this.errors.first(this.validate)
      if (!result) return ''
      if (/\$/.test(result)) {
        var [field, empty] = result.split('$')
        return `${this.$t(`validation.field`).replace('%', this.$t(`validation.${field}`))}${this.$t(empty)}`
      } else {
        return this.$t(`validation.${result}`)
      }
    }
  }
}
</script>

<style lang='scss'>
@import './BasicInput'
</style>
