<template>
  <div class="btc-api-new">
    <div class="btc-container-block">
      <header>
        <strong>
          {{ $t('api.api_key') }}
        </strong>
      </header>
      <div class="btc-api-newContain" v-if="setp === 0">
        <basic-input :placeholder="$t('api.label')" v-model="parme.label">
        </basic-input>
        <div class="btc-explain">
          {{ $t('api.label_describe') }}
        </div>
        <basic-input :placeholder="$t('api.google_verification_code')" v-model="parme.otp">
        </basic-input>
        <div class="btc-marginT30 btc-marginB40">
          <basic-button @click.native='NewKey' :text='$t("api.confirm")'></basic-button>
          <router-link :to="`${ROUTER_VERSION}/api`">
            <button class="btc-white-btn">{{ $t("api.cancel") }}</button>
          </router-link>
        </div>
      </div>
      <div v-else class="btc-api-show">
        <div class="btc-marginB20">
            <strong>
              {{ $t('api.secretkey_describe') }}
            </strong>
          </div>
          <div class="btc-marginT40 btc-color666">
            <div class="btc-marginB10">
              <strong>
                Access Key
              </strong>
            </div>
            <span class="btc-marginT10">
              1Bv9EYCrCKjtusatU1LiwcAnKRHVSsGjpr1Bv9EYCrCKjtusatU1LiwcAnKRHVS
            </span>
          </div>
          <div class="btc-marginT20 btc-color666">
            <div class="btc-marginB10">
              <strong>
                Access Key
              </strong>
            </div>
            <span>
              1Bv9EYCrCKjtusatU1LiwcAnKRHVSsGjpr1Bv9EYCrCKjtusatU1LiwcAnKRHVS
            </span>
          </div>
          <router-link :to="`${ROUTER_VERSION}/api`">
            <basic-button :text="$t('api.return')">
            </basic-button>
          </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ApiNew',
  data () {
    return {
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      parme: {
        label: '',
        access_key: '',
        ip: '',
        otp: ''
      },
      setp: 0
    }
  },
  methods: {
    NewKey () {
      this.setp = 1
    }
  }
}
</script>

<style lang="scss" scoped>
@media (max-width: 992px) {
  .btc-api-newContain{
    width: 96%!important
  }
}
.btc-api-newContain{
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
.btc-api-show{
  .btc-basic-button{
    width: 100%;
    margin: 75px 0;
  }
}
</style>
