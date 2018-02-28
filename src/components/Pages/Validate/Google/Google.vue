<template>
  <div class="btc-validateGoogle  btc-container-block">
    <div class="row btc-color666">
      <span class="btc-color333">
        <span :class="{'btc-link': step === 1 }">
          {{$t('validate_google.Download_Google_Verified_App')}}
        </span>
        >
        <span :class="{'btc-link': step === 2 }">
          {{$t('validate_google.Scan_qrcode_and_enter_code')}}
        </span>
      </span>
    </div>
    <template v-if="step === 1">
      <div class="row btc-validate-gpt btc-marginB60" style="margin-bottom: 105px;">
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
            {{$t('validate_google.download_Authenticator_at_store')}}
          </div>
          <div class="row btc-marginT20">
            <div class="col-xs-6">
              <img src="~Img/validate-iosapp.png" class="btc-marginR5 googleImg">
            </div>
            <div class="col-xs-6">
              <img src="~Img/validate-gplay.png" class="googleImg img-margin">
            </div>
          </div>
        </div>
      </div>
      <div class="text-right btc-marginT40">
        <span class="btc-color999 btc-marginR20 btc-marginT25 alreadyApp" style="display:inline-block">
          {{$t('validate_google.app_already_installed')}}
        </span>
          <basic-button class="col-xs-12 col-md-1 pull-right" @click.native="addStep" :text='$t("validate_google.next")'></basic-button>
      </div>
    </template>
    <template v-if="step === 2">
      <div class="row btc-validate-gpt">
        <div class="col-md-6">
          <div class="col-md-6 text-center">
            <div class='row'>
              <qr-code :length='"120px"' :dateUrl="qrcode(loginData.google_uri)"></qr-code>
            </div>
            <div class="row btc-marginT15 btc-margin-left useGoogle">
              {{$t('validate_google.using_Google_to_verify_App')}}
            </div>
            <div class="row btc-marginT5 useGoogle">
              {{$t('validate_google.Scan_qrcode')}}
            </div>
            <!-- <div class="btc-marginT5 btc-margin-left">
              <basic-button @click.native="RenovateQrcode" :text='"刷新二维码"'></basic-button>
            </div> -->
          </div>
          <div class="col-md-6 btc-validate-textCenter btc-validate-googlekey">
              <div class="row btc-marginT10">
                <strong class="btc-link ">
                  {{ loginData.google_otp_secret }}
                </strong>
              </div>
              <div class="row btc-marginT20">
              <span>
                {{$t('validate_google.cant_scan_enter_keys')}}
              </span>
              <div class="refreshqrcode btc-marginT15" @click="RenovateQrcode">
                <img src="~Img/RefreshQrcode.png" alt="">
                {{$t('validate_google.Refresh_qrcode')}}
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6 text-center">
          <form class="btc-b-l">
            <div class="col-md-12 btc-validate-prompt">
              <news-prompt :text='prompt'></news-prompt>
            </div>
            <div class='row'>
              <basic-input @focus.native="promptEmpty()" type="password" class="col-md-offset-2 col-md-9 col-xs-12" :placeholder='$t("validate_google.Login_password")' v-model="password"></basic-input>
            </div>
            <div class="row">
              <basic-input  @focus.native="promptEmpty()" class="col-md-offset-2 col-md-9 col-xs-12" :placeholder='$t("validate_google.Google_verification_code")' v-model="otp"></basic-input>
            </div>
          </form>
        </div>
      </div>
      <div class="text-right btc-marginT80 minusStep">
        <span @click="minusStep" class="col-xs-12 col-md-1 btc-link btc-fl btc-marginT25 btc-poniter" style="display:inline-block">{{$t('validate_google.prve')}}</span>
        <span class="btc-color999 btc-marginR20 btc-marginT25" style="display:inline-block">
          {{$t('validate_google.All_steps_completed')}}
        </span>
        <basic-button class="col-xs-12 col-md-2 pull-right" :text='$t("validate_google.Google_verification")' @click.native='gValidate'></basic-button>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
var QRCode = require('qrcode')
export default {
  name: 'ValidateGoogle',
  data () {
    return {
      HOST_URL: process.env.HOST_URL,
      google: '',
      step: 1,
      otp: '',
      password: '',
      prompt: '',
      google_hint: '谷歌验证已经成功'
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
      this._post({
        url: '/verify/refresh_auth.json',
        data: {
          refresh: true
        },
        headers: {
          'DataType': 'application/json;charset=utf-8'
        }
      }, d => {
        d = d.data
        this.loginData.google_otp_secret = d.google_otp_secret
        this.loginData.google_uri = d.google_otp_secret
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
    gValidate () {
      if (!this.password) {
        this.prompt = '请输入登录密码'
        return
      }
      if (!this.otp) {
        this.prompt = '请输入谷歌验证码'
        return
      }
      this._post({
        url: `/verify/authentication_info.json`,
        data: {
          password: this.password,
          google_auth: {
            otp: this.otp,
            otp_secret: this.loginData.google_otp_secret
          }
        },
        headers: {
          'DataType': 'application/json;charset=utf-8'
        }
      }, (d) => {
        if (d.data.status_code === '0') {
          this.prompt = d.data.errors
        } else {
          this.PopupBoxDisplay(this.google_hint)
        }
      })
    },
    ...mapMutations(['PopupBoxDisplay'])
  },
  computed: {
    ...mapGetters(['loginData'])
  },
  watch: {
    loginData (d) {
      console.log(d)
    }
  }
}
</script>

<style lang='scss' scoped>
@import 'Google.scss'
</style>
