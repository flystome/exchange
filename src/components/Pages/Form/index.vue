<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'Form'
}
</script>

<style lang="scss">
.btc-form{
  .btc-container-block .btc-table-container{
    min-height: 70vh;
  }
  .pagination > li > a{
    outline: none
  }
  .pagination {
    margin: 14px 0;
    margin-bottom: 0;
  }
}
</style>
