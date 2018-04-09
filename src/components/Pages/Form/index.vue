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

.btc-no-record{
  min-height: 61vh;
  background: white;
  span{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -21px;
    margin-top: -10px;
  }
}
</style>
