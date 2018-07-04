<template>
  <div @keyup.enter="NewKey" class="api-new">
    <div class="container-block">
      <header>
        <strong>
          {{ $t('api.create_New_Key') }}
        </strong>
      </header>
      <div class="api-newContain" v-if="setp === 0">
        <basic-input :placeholder="$t('api.label')" v-model="parme.label">
        </basic-input>
        <div class="explain">
          {{ $t('api.label_describe') }}
        </div>
        <basic-input ref="gV" :validate='"required|google_verify_code"' :placeholder="$t('api.google_verification_code')" v-model="parme.otp">
        </basic-input>
        <div class="marginT30 marginB40">
          <basic-button class="btn" :disabled="disabled" @click.native='NewKey' :text='$t("api.confirm")'></basic-button>
          <router-link :disabled="disabled" :to="`${ROUTER_VERSION}/api`">
            <button class="white-btn">{{ $t("api.cancel") }}</button>
          </router-link>
        </div>
      </div>
      <div v-else class="api-show">
        <div class="marginB20">
            <strong>
              {{ $t('api.secretkey_describe') }}
            </strong>
          </div>
          <div class="marginT40 color666">
            <div class="marginB10">
              <strong class="fl">
                Access Key
              </strong>
              <news-prompt class="fl marginL10" :text='prompt1'></news-prompt>
              <div class="clearfix"></div>
            </div>
            <span id="copy2">{{ access_key }}</span>
            <span class='btn-copy2 link fr' data-clipboard-target="#copy2">
              {{ $t('my_account.copy') }}
            </span>
          </div>
          <div class="marginT20 color666">
            <div class="marginB10">
              <strong class="fl">
                Secret Key
              </strong>
              <news-prompt class="fl marginL10" :text='prompt'></news-prompt>
              <div class="clearfix"></div>
            </div>
            <span id="copy1">{{ secret_key }}</span>
            <span class='btn-copy1 link fr' data-clipboard-target="#copy1">
              {{ $t('my_account.copy') }}
            </span>
          </div>
          <span @click="goApi">
            <basic-button :text="$t('api.return')">
            </basic-button>
          </span>
      </div>
    </div>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import { mapMutations, mapState } from 'vuex'
const _debounce = require('lodash.debounce')
export default {
  name: 'ApiNew',
  data () {
    return {
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      parme: {
        label: '',
        otp: ''
      },
      prompt: '',
      prompt1: '',
      access_key: '',
      secret_key: '',
      setp: 0,
      disabled: false
    }
  },
  mounted () {
    /* eslint-disable no-new */
    var clipboard = new Clipboard('.btn-copy1')
    var time = () => {
      setTimeout(() => {
        this.prompt = ''
      }, 1500)
    }

    clipboard.on('success', () => {
      clearTimeout(time)
      this.prompt = this.$t('deposit_currency.copy_success')
    })
    clipboard.on('success', _debounce(time, 500))

    var clipboard1 = new Clipboard('.btn-copy2')
    var time1 = () => {
      setTimeout(() => {
        this.prompt1 = ''
      }, 1500)
    }

    clipboard1.on('success', () => {
      clearTimeout(time1)
      this.prompt1 = this.$t('deposit_currency.copy_success')
    })
    clipboard1.on('success', _debounce(time1, 500))
  },
  methods: {
    goApi () {
      this.setp = 0
      this.$router.push(`${this.ROUTER_VERSION}/api`)
    },
    async NewKey () {
      const gV = await this.$refs['gV'].$validator.validateAll()
      if (!gV) return
      this.disabled = true
      this._post({
        url: '/api_tokens.json',
        data: {
          api_token: {
            label: this.parme.label
          },
          two_factor: {
            type: 'app',
            otp: this.parme.otp
          }
        }
      }, (d) => {
        this.disabled = false
        if (d.data.success) {
          d = d.data.success.api_token
          this.access_key = d.access_key
          this.secret_key = d.secret_key
          this.api.apiData.push({
            access_key: d.access_key,
            label: this.parme.label,
            id: d.id
          })
          this.setp = 1
          this.parme.otp = ''
          this.parme.label = ''
        } else {
          this.parme.otp = ''
          this.PopupBoxDisplay({type: 'error', message: this.$t('api_server.validate_sms.auth_sms_1002')})
        }
        this.$refs['gV'].$validator.errors.clear()
      })
      // this.setp = 1
    },
    ...mapMutations(['PopupBoxDisplay'])
  },
  computed: {
    ...mapState(['api'])
  },
  watch: {
    $route (to) {
      if (to.name === 'ApiIndex') {
        if (this.$route.name === to.name) return
        this.$refs['gV'].$validator.errors.clear()
        Object.assign(this.parme, {
          label: '',
          otp: ''
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@media (max-width: 992px) {
  .api-newContain{
    width: 96%!important
  }
}
.api-newContain{
  width: 61.2%;
  margin: 0 auto;
  .explain{
   margin: 10px 0;
   font-size: 12px;
   color: #999999;
  }
  .basic-button{
    width: 48%;
  }
  .white-btn{
    width: 48%;
    float: right;
    padding: 5px 0;
  }
}

#copy1,#copy2{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 85%;
    display: inline-block;
}

.newsPrompt{
  width: auto;
  margin-left: 10px;
}
.api-show{
  .basic-button{
    width: 100%;
    margin: 75px 0;
  }
}
</style>

<style>
.api-newContain .help{
  position: absolute;
}
</style>
