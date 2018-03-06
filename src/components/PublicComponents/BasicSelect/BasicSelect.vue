<template>
    <select class="btc-basic-option" @change="valuechange($event.target.value)">
      <option v-for="data of data"
      :key="data">
      {{data}}
      </option>
    </select>
</template>

<script>
export default {
  name: 'BasicSelect',
  props: ['data', 'value'],
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
