<template>
  <div class="404">
    <img v-if="status === 404" src="~Img/large/404.png" >
    <img v-if="status === 500" src="~Img/large/500.png" >
    <img v-if="status === 502" src="~Img/large/502.png" >
    <img v-if="status === 422" src="~Img/large/422.png" >
    <div class="text-center marginT30">
      {{ $t(`page_not_found.${status}`) }}<span @click="$router.push('/')" class="link marginL5 marginR5">{{$t('page_not_found.click')}}</span>{{ $t('page_not_found.back') }}
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
    this.status = Number(this.$route.path.match(/\d+/g)[this.$route.path.match(/\d+/g).length - 1])
  }
}
</script>

<style lang='scss'>
.404{
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
  .404{
    padding: 0 15px;
  }
}
</style>
