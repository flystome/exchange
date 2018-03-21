<template>
  <div style="min-height: 200px;">
    <div class="btc-listfooter">
      <div class="text-center btc-bg" >
        <div class="btc-title" v-if="title">
          <h2>{{ title }}</h2>
        </div>
        <div class="btc-search btc-paddingT55" v-if="search">
          <h2>{{ search }}</h2>
          <div class="input-group col-sm-4 col-lg-3 col-xs-9">
            <input style="outline: none" type="text" class="form-control" placeholder="输入关键字搜索">
            <span class="input-group-btn">
              <button class="btn btn-default" type="button">搜索</button>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BasicInstructions',
  props: ['title', 'search']
}
</script>

<style lang="scss" scoped>
  @import './BasicInstructions.scss'
</style>
