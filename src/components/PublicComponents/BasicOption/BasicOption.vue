<template>
    <select @input="$emit('input', $event.target.value)">
      <option></option>
      <option v-for="data in data" :key="data.name">{{data.name}}</option>
    </select>
</template>

<script>
export default {
  name: 'BasicOption',
  props: ['data']
}
</script>
