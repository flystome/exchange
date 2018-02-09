<template>
  <div class="btc-validateGoogle container btc-container-block">
    <div class="row btc-color666">
      谷歌认证
      <span>
        <span :class="{'btc-link': step === 1 }">
          下载谷歌验证码
        </span>
        >
        <span :class="{'btc-link': step === 2 }">
          开启谷歌验证
        </span>
      </span>
    </div>
    <template v-if="step === 1">
      <div class="row btc-validate-gpt btc-marginB60" style="margin-bottom: 105px;">
        <div class="col-md-5 text-center btc-b-r  btc-validate-googleApp">
            <img src="~Img/validate-google.jpg">
          <div class="row btc-f btc-marginT10">
            <strong>
              Google Authenticator
            </strong>
          </div>
        </div>
        <div class="col-md-6 btc-marginT20">
          <div class="row">
            请于应用商店下载安装Google Authenticator（谷歌验证器）
          </div>
          <div class="row btc-marginT20">
            <img src="~Img/validate-iosapp.jpg" class="btc-marginR5">
            <img src="~Img/validate-gplay.png">
          </div>
        </div>
      </div>
      <div class="row text-right btc-marginT40">
        <span class="btc-color666 btc-marginR20">
          已经安装 App
        </span>
          <basic-button @click.native="addStep" :text='"下一步"'></basic-button>
      </div>
    </template>
    <template v-if="step === 2">
      <div class="row btc-validate-gpt">
        <div class="col-md-6 text-center btc-b-r">
          <div class="row">
            <qr-code :dateUrl="qrcode('123')"></qr-code>
          </div>
          <div class="row btc-marginT15">
            使用
            <strong>
              谷歌验证 App
            </strong>
          </div>
          <div class="row btc-marginT5 btc-marginR35">
            扫描二维码
          </div>
        </div>
        <div class="col-md-6 btc-marginL45 btc-validate-gmr">
          <div class="row btc-marginL45">
            <strong class="btc-link ">
              {{ google.google_otp_secret }}
            </strong>
          </div>
          <div class="row btc-marginT20 btc-marginL45">
            若无法扫描，请将该16位密匙手动输入到谷歌验证码APP里
          </div>
          <form>
            <div class="row">
              <span class="btc-marginR20">登录密码</span>
              <basic-input v-model="password"></basic-input>
            </div>
            <div class="row btc-marginT20">
              <span class="btc-marginR20">谷歌验证码</span>
              <basic-input v-model="otp"></basic-input>
            </div>
          </form>
        </div>
      </div>
      <div class="row text-right btc-marginT60">
        <span @click="minusStep" class="btc-link btc-fl btc-marginT30 btc-poniter">返回上一步</span>
        <span class="btc-color666 btc-marginR20">
          已经安装 App
        </span>
          <basic-button :text='"开启谷歌验证"' @click.native='gValidate'></basic-button>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
var QRCode = require('qrcode')
export default {
  name: 'ValidateGoogle',
  created () {
    this.$store.dispatch('getData')
  },
  data () {
    return {
      google: '',
      step: 1,
      otp: '',
      password: ''
    }
  },
  methods: {
    addStep () {
      this.step++
    },
    minusStep () {
      this.step--
    },
    qrcode (str) {
      var dateUrl = ''
      QRCode.toDataURL(str, {widht: 120, height: 120}, (err, string) => {
        if (err) console.log(err)
        dateUrl = string
      })
      return dateUrl
    },
    gValidate () {
      this._post({
        url: '/verify/authentication_info',
        data: {
          member_id: 336,
          password: this.password,
          google_auth: {
            otp: this.otp,
            otp_secret: this.google.google_otp_secret
          }
        }
      }, (d) => {
        console.log(d)
      })
    },
    computed: {
      ...mapGetters(['loginData'])
    }
  }
}
</script>

<style>
@import 'Google.css'
</style>
