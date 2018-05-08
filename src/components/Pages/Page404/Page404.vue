<template>
  <div class="btc-404">
    <img src="~Img/large/404.png" >
    <div class="text-center btc-marginT30">
      {{ $t('page_not_found.lost') }}<span @click="$router.push('/')" class="btc-link btc-marginL5 btc-marginR5">{{ $t('page_not_found.click') }}</span>{{ $t('page_not_found.back') }}
    </div>
  </div>
</template>

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
