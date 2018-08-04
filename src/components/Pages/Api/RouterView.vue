<template>
  <div class="api">
    <keep-alive>
      <router-view>
      </router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'Api'
}
</script>

<style lang="scss" scoped>
.api{
  .container-block{
    padding: 13px 30px 0 30px
  }
  header{
    padding-bottom: 13px;
    margin-bottom: 18px;
    border-bottom: 1px solid #f2f2f2;
  }
}
</style>
