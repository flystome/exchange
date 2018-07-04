<template>
    <select class="basic-option" @change="valuechange($event.target.value)">
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
  .basic-option{
    padding: 4px;
    width: 100%;
    background: #f2f2f2;
    border-color: #dfe0e1;
    cursor: pointer;
    appearance:none;
    background: url("~Img/selectoption.png") no-repeat right #f2f2f2;
  }
</style>
