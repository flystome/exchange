<template>
    <select class="btc-basic-option" @change="valuechange($event.target.value)">
      <option
      v-for="(data, index) of data"
      :value="lang ? lang[index] : data"
      :key="data">
      {{data}}
      </option>
    </select>
</template>

<script>
export default {
  name: 'BasicSelect',
  props: ['data', 'value', 'lang'],
  methods: {
    valuechange (value) {
      this.$emit('selected', value)
    }
  }
}
</script>

<style lang="scss" scoped>
@import './BasicSelect'
</style>
