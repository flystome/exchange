<template>
  <div v-if="!loginData.app_activated && loginData.activated" class="btc-validateGoogle  btc-container-block">
    <div class="row btc-color666">
      <span class="btc-color333">
        <router-link :to="`${ROUTER_VERSION}/`" class="btc-link">
          {{$t('title.my_account')}}
        </router-link>
        >
        <span>
          {{$t('title.validate_google')}}
        </span>
      </span>
    </div>
    <template v-if="step === 1">
      <div class="row btc-validate-gpt btc-marginB60" style="margin-bottom: 140px;">
        <div class="col-md-4 col-xs-12 col-md-offset-2 text-center btc-b-r  btc-validate-googleApp">
            <img src="~Img/google-authentication.png">
          <div class="row btc-f btc-marginT10">
            <strong>
              Google Authenticator
            </strong>
          </div>
        </div>
        <div class="col-md-5 col-xs-12 col-md-offset-1  btc-marginT30 btc-validate-textCenter">
          <div class='row'>
            {{$t('validate_google.download_authenticator_at_store')}}
          </div>
          <div class="row btc-marginT20">
            <div class="col-xs-6">
              <a href="https://itunes.apple.com/cn/app/google-authent icator/id388497605?mt=8" target="_blank">
                <img src="~Img/validate-iosapp.png" class="btc-marginR5 googleImg">
              </a>
            </div>
            <div class="col-xs-6">
              <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank">
                <img src="~Img/validate-gplay.png" class="googleImg img-margin">
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="text-right btc-marginT40">
        <basic-button :disabled="disabled" class="btn col-xs-12 col-md-1 pull-right" @click.native="addStep" :text='$t("validate_google.next")'></basic-button>
      </div>
    </template>
    <template v-if="step === 2">
      <div class="row btc-validate-gpt" @keyup.enter='gValidate'>
        <div class="col-md-6">
          <div class="col-md-6 text-center">
            <div class='row'>
              <qr-code :length='"160px"' :dateUrl="qrcode(loginData.google_uri)"></qr-code>
            </div>
            <div class="row btc-marginT15 btc-margin-left useGoogle">
              {{$t('validate_google.using')}}
              <strong>{{$t('validate_google.google_to_verify_app')}}</strong>
            </div>
            <div class="row btc-marginT5 useGoogle">
              {{$t('validate_google.scan_qrcode')}}
            </div>
          </div>
          <div class="col-md-6 btc-validate-textCenter btc-validate-googlekey">
              <div class="row btc-marginT10">
                <strong class="btc-link ">
                  {{ loginData.google_otp_secret }}
                </strong>
              </div>
              <div class="row btc-marginT20">
              <span style="display: block;">
                {{$t('validate_google.cant_scan_enter_keys')}}
              </span>
              <div class="refreshqrcode btc-marginT15 btn" :disabled="disabled" @click="RenovateQrcode">
                <img src="~Img/RefreshQrcode.png" alt="">
                {{$t('validate_google.refresh_qrcode')}}
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <form class="btc-b-l">
            <div class="col-md-12 btc-validate-prompt">
              <news-prompt :text='prompt'></news-prompt>
            </div>
            <div class='row'>
              <basic-input style="min-height:66px"  @focus.native="promptEmpty()" type='password' ref="password" :validate="'password'" class="col-md-offset-2 col-md-9 col-xs-12" :placeholder='$t("validate_google.login_password")' v-model="password"></basic-input>
            </div>
            <div class="row">
              <basic-input style="min-height:66px"  @focus.native="promptEmpty()" ref="verfiycode" :validate='"verify_code"' class="col-md-offset-2 col-md-9 col-xs-12" :placeholder='$t("validate_google.google_verification_code")' v-model="otp"></basic-input>
            </div>
            <div class="row" v-if="loginData.sms_activated">
              <div class="col-md-offset-2 col-md-9 col-xs-12">
                <basic-input  style="min-height:66px" class="col-md-9 col-xs-9 btc-paddingL0" @focus.native="promptEmpty()" ref="smscode" :validate='"verify code"' :placeholder='$t("validate_sms.verification_code")' v-model="sms_code">
                </basic-input>
                <button class="btc-white-btn col-md-3 col-xs-3" :disabled="disabled" @click.prevent="SendSms">
                  {{ timer }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="text-right btc-marginT65 minusStep">
        <span @click="minusStep" class="col-xs-12 col-md-1 btc-link btc-fl btc-marginT10 btc-poniter" style="display:inline-block">{{$t('validate_google.prve')}}</span>
        <basic-button  @click.native='gValidate' :disabled="disabled" class="btn col-xs-12 col-md-2 pull-right btc-marginT10" :text='$t("validate_google.google_verification")'></basic-button>
      </div>
    </template>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
var QRCode = require('qrcode')
export default {
  name: 'ValidateGoogle',
  // updated () {
  //   if (this.redirectLock) return
  //   if (this.$store.state.loginData) {
  //     this.redirectLock = true
  //     this.$store.dispatch('redirect')
  //   }
  // },
  data () {
    return {
      redirectLock: false,
      disabled: false,
      HOST_URL: process.env.HOST_URL,
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      google: '',
      step: 1,
      otp: '',
      password: '',
      sms_code: '',
      prompt: '',
      second: -1,
      resend: false,
      isLocked: false,
      SmsData: {
        verifyCode: '',
        Time: ''
      }
    }
  },
  methods: {
    addStep () {
      this.step++
      this.promptEmpty()
    },
    minusStep () {
      this.step--
    },
    RenovateQrcode () {
      if (this.disabled) {
        return
      }
      this.disabled = true
      this._post({
        url: '/verify/refresh_auth.json',
        data: {
          refresh: true
        },
        headers: {
          'DataType': 'application/json;charset=utf-8'
        }
      }, d => {
        this.disabled = false
        this.loginData.google_otp_secret = d.data.google_otp_secret
        this.loginData.google_uri = d.data.google_uri
      })
    },
    qrcode (str) {
      var dateUrl = ''
      QRCode.toDataURL(str, {widht: 120, height: 120}, (err, string) => {
        if (err) console.log(err)
        dateUrl = string
      })
      return dateUrl
    },
    promptEmpty () {
      this.prompt = ''
    },
    async SendSms () {
      this._post({
        url: `/funds/send_activate_app_auth_sms.json`,
        headers: {
          'DataType': 'application/json;charset=utf-8'
        }
      }, (d) => {
        if (d.data.success) {
          if (this.second < 0) {
            this.CountDown()
          }
        } else {
          this.PopupBoxDisplay({message: this.$t('api_server.validate_sms.send_code_1001'), type: 'error'})
        }
      })
    },
    async gValidate () {
      const password = await this.$refs['password'].$validator.validateAll()
      const verfiycode = await this.$refs['verfiycode'].$validator.validateAll()
      if (!this.$refs['smscode']) {
        if (!password || !verfiycode) {
          return
        }
      } else {
        const smscode = await this.$refs['smscode'].$validator.validateAll()
        if (!password || !verfiycode || !smscode) {
          return
        }
      }
      this.disabled = true
      this._post({
        url: `/verify/authentication_info.json`,
        data: {
          password: this.password,
          google_auth: {
            otp: this.otp,
            otp_secret: this.loginData.google_otp_secret
          },
          sms_code: this.sms_code
        },
        headers: {
          'DataType': 'application/json;charset=utf-8'
        }
      }, (d) => {
        this.disabled = false
        if (d.data.error) {
          this.password = ''
          this.otp = ''
          this.PopupBoxDisplay({message: this.$t(`api_server.validate_google.error_${d.data.error.code}`), type: 'error'})
        } else {
          this.PopupBoxDisplay({message: this.$t(`api_server.validate_google.success_200`), type: 'success', url: '/my_account'})
          this.$store.dispatch('getData')
        }
      })
    },
    CountDown () {
      this.second = 60
      this.resend = true
      var timer = setInterval(() => {
        this.second--
        if (this.second < 0) {
          clearInterval(timer)
        }
      }, 1000)
    },
    ...mapMutations(['PopupBoxDisplay'])
  },
  computed: {
    timer () {
      return this.resend ? (this.second < 0
        ? this.$t('withdraw_currency.resend')
        : `${this.$t('withdraw_currency.resend')} ${this.second}s`) : this.$t('auth.send_code')
    },
    ...mapState(['loginData'])
  },
  watch: {
    // $route (to) {
    //   this.route = to.path.slice(to.path.lastIndexOf('/') + 1)
    //   if (this.route === 'google') {
    //     console.log(1)
    //     this.$store.dispatch('redirect')
    //   }
    // }
  }
}
</script>

<style lang='scss' scoped>
@import 'Google.scss'
</style>
