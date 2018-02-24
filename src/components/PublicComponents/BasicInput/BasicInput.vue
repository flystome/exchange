<template>
  <div>
    <input v-validate="'required|email'" class="btc-basicInput btc-b" :class="{'input': true, 'is-danger': errors.has('email') }" name="email" type="text" placeholder="Email"  @input="$emit('input', $event.target.value)">
    <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
  </div>
</template>

<script>
export default {
  props: ['per'],
  name: 'BasicInput'
}
</script>

<style lang='scss'>
@import './BasicInput'
</style>
