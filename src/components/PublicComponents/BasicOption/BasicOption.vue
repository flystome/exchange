<template>
    <select class="btc-basic-option" @input="$emit('selected', $event.target.value)">
      <option v-for="data of data"
      :value="data.name"
      :key="data.name">
      {{data.value}}
      </option>
    </select>
</template>

<script>
export default {
  name: 'BasicOption',
  props: ['data']
}
</script>

<style lang="scss" scoped>
@import './BasicOption'
</style>
