<template>
  <button class="basic-button">
    <slot name="file" />
    {{ text }}
  </button>
</template>

<script>
export default {
  name: 'BasicButton',
  props: ['text']
}
</script>

<style lang='scss' scoped>
  .basic-button{
    background: #4382f7;
    border: none;
    padding: 6px 14px;
    color: white;
    position: relative;
    min-width: 120px;
    overflow: hidden
  }
</style>
