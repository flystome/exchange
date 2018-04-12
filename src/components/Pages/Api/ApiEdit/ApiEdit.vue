<template>
  <div class="btc-api-edit">
    <div class="btc-container-block">
      <header>
        <strong>
          {{ $t('api.create_New_Key') }}
        </strong>
      </header>
      <div class="btc-api-editContain">
        <basic-input :placeholder="$t('api.label')" v-model="parme.label">
        </basic-input>
        <div class="btc-explain">
          {{ $t('api.label_describe') }}
        </div>
        <basic-input :placeholder="'ACCESS KEY'" v-model="parme.access_key">
        </basic-input>
        <basic-input class="btc-marginT15" :placeholder="$t('api.ip_white_list')" v-model="parme.ip">
        </basic-input>
        <div class="btc-explain">
          {{ $t('api.ip_input') }}
        </div>
        <basic-input :placeholder="$t('api.google_verification_code')" v-model="parme.otp">
        </basic-input>
        <div class="btc-marginT30 btc-marginB40">
          <basic-button :text='$t("api.confirm")'></basic-button>
          <router-link :to="`${ROUTER_VERSION}/api`">
            <button class="btc-white-btn">{{ $t("api.cancel") }}</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ApiEdit',
  data () {
    return {
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      parme: {
        label: '',
        access_key: '',
        ip: '',
        otp: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@media (max-width: 992px) {
  .btc-api-editContain{
    width: 96%!important
  }
}
.btc-api-editContain{
  width: 61.2%;
  margin: 0 auto;
  .btc-explain{
   margin: 10px 0;
   font-size: 12px;
   color: #999999;
  }
  .btc-basic-button{
    width: 48%;
  }
  .btc-white-btn{
    width: 48%;
    float: right;
    padding: 5px 0;
  }
}
</style>
