<template>
  <div @keyup.enter="editApi" v-if="this.api.editId !== ''" class="btc-api-edit">
    <div class="btc-container-block">
      <header>
        <strong>
          {{ $t('api.api_key') }}
        </strong>
      </header>
      <div class="btc-api-editContain">
        <basic-input :placeholder="$t('api.label')" v-model="parme.label">
        </basic-input>
        <div class="btc-explain">
          {{ $t('api.label_describe') }}
        </div>
        <basic-input :placeholder="'ACCESS KEY'" v-model="this.api.editKey" readonly="readonly">
        </basic-input>
        <basic-input class="btc-marginT15" :placeholder="$t('api.ip_white_list')" v-model="parme.ip">
        </basic-input>
        <div class="btc-explain">
          {{ $t('api.ip_input') }}
        </div>
        <basic-input ref="gV" :validate='"Google Verify Code"' :placeholder="$t('api.google_verification_code')" v-model="parme.otp">
        </basic-input>
        <div class="btc-marginT30 btc-marginB40">
          <basic-button class="btn" :disabled="disabled" @click.native="editApi" :text='$t("api.confirm")'></basic-button>
          <router-link :disabled="disabled" :to="`${ROUTER_VERSION}/api`">
            <button class="btc-white-btn">{{ $t("api.cancel") }}</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'ApiEdit',
  created () {
    if (this.api.editId === '') {
      this.$router.replace(`${this.ROUTER_VERSION}/404`)
    }
  },
  data () {
    return {
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      parme: {
        label: '',
        ip: '',
        otp: ''
      },
      disabled: false
    }
  },
  mounted () {
    this.parme.label = this.api.editLabel
    this.parme.ip = this.api.editIp
  },
  methods: {
    async editApi () {
      const gV = await this.$refs['gV'].$validator.validateAll()
      if (!gV) return
      this.disabled = true
      this._put({
        url: `/api_tokens/${this.api.editId}.json`,
        data: {
          api_token: {
            label: this.parme.label,
            ip_whitelist: this.parme.ip
          },
          two_factor: {
            type: 'app',
            otp: this.parme.otp
          }
        }
      }, (d) => {
        this.disabled = false
        var label = this.parme.label
        var ip = this.parme.ip
        Object.assign(this.parme, {
          label: '',
          ip: '',
          otp: ''
        })
        if (d.data.success) {
          this.api.apiData[this.api.editIndex].label = label
          this.api.apiData[this.api.editIndex].ip_whitelist = ip
          this.PopupBoxDisplay({message: this.$t('api.amend_the_success'), type: 'success', url: '/api'})
        } else {
          this.PopupBoxDisplay({message: this.$t('api_server.validate_sms.auth_sms_1002'), type: 'error'})
        }
        this.$nextTick()
        this.$refs['gV'].$validator.errors.clear()
      })
    },
    ...mapMutations(['PopupBoxDisplay', 'ChangePopupBox'])
  },
  computed: {
    ...mapState(['api'])
  },
  watch: {
    $route (to, form) {
      if (form.name === 'ApiIndex') {
        this.parme.label = this.api.editLabel
        this.parme.ip = this.api.editIp
      }
      if (to.name === 'ApiIndex') {
        this.$refs['gV'].$validator.errors.clear()
        Object.assign(this.parme, {
          label: '',
          ip: '',
          otp: ''
        })
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

<style>
.btc-api-editContain .help{
  position: absolute;
}
</style>
