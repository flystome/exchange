<template>
  <div class="list">
    <div class="list-coin">
      <div class="coin"><span></span></div>
      <div class="vol">{{$t("volume")}}</div>
    </div>
    <div class="list-price">
      <div class="price"></div>
      <div class="val"></div>
    </div>
    <div class="list-btn">
      <span></span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'list',
  data () {
    return {

    }
  }

}
</script>

<style scoped lang="scss">
  @import './list.scss'
</style>
