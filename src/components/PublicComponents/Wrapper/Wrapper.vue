<template>
  <div v-if="Wrapper" class="wrapper">
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Wrapper',
  computed: mapState(['Wrapper'])
}
</script>

<style lang="scss" scoped>
  .wrapper{
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    left: 0;
    background: grey;
  }
</style>
