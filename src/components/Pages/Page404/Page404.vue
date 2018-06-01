<template>
  <div class="btc-404">
    <img v-if="status === 404" src="~Img/large/404.png" >
    <img v-else src="~Img/large/500.png" >
    <div class="text-center btc-marginT30">
      {{ status === 404 ? $t('page_not_found.lost') : $t('page_not_found.server') }}<span @click="$router.push('/')" class="btc-link btc-marginL5 btc-marginR5">{{$t('page_not_found.click')}}</span>{{ $t('page_not_found.back') }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'notFound',
  data () {
    return {
      status: ''
    }
  },
  created () {
    if (/500/.test(this.$route.path)) {
      this.status = 500
    } else {
      this.status = 404
    }
  }
}
</script>

<style lang='scss'>
.btc-404{
  img{
    display: block;
    margin: auto;
    margin-top: 21%;
  }
}
@media (max-width: 430px) {
  img{
    width: 100%
  }
  .btc-404{
    padding: 0 15px;
  }
}
</style>
