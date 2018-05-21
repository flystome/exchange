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
    position: relative;
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
  position: relative;
  span{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -21px;
    margin-top: -10px;
  }
}

.btc-form .btc-table-spinner{
  position: absolute;
  top: 50%;
  margin-top: -75px!important;
  left: 50%;
  margin-left: -75px!important;
}
.pagination {
  li {
    display: inline-block;
    margin-right: 6px;
    &:first-child {
      margin-right: 10px;
    }
    &:last-child {
      margin-right: 0;
      margin-left: 3px;
    }
    a {
      color: #666;
    }
    a:hover {
      border-color: #337ab7;
      color: #337ab7;
    }
  }
}
.pagination>.active>a, .pagination>.active>a:focus, .pagination>.active>a:hover, .pagination>.active>span, .pagination>.active>span:focus, .pagination>.active>span:hover {
  background: #2686ff;
  border-color: #337ab7;
}

.form-select{
  @include sprite($form-select);
  display: inline-block;
}
</style>
