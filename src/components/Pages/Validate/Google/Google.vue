<template>
  <div class="btc-validateGoogle  btc-container-block">
    <div class="row btc-color666">
      谷歌认证
      <span class="btc-color333">
        <span :class="{'btc-link': step === 1 }">
          下载谷歌验证 App
        </span>
        >
        <span :class="{'btc-link': step === 2 }">
          扫描二维码及输入验证码
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
        <div class="col-md-5 col-xs-12 col-md-offset-1  btc-marginT20 btc-validate-textCenter">
          <div class='row'>
            请于应用商店下载安装Google Authenticator（谷歌验证器）
          </div>
          <div class="row btc-marginT20">
            <img src="~Img/validate-iosapp.png" class="btc-marginR5 col-xs-24">
            <img src="~Img/validate-gplay.png" class="col-xs-24">
          </div>
        </div>
      </div>
      <div class=" text-right btc-marginT40">
        <span class="btc-color999 btc-marginR20">
          已经安装 App
        </span>
          <basic-button @click.native="addStep" :text='"下一步"'></basic-button>
      </div>
    </template>
    <template v-if="step === 2">
      <div class="row btc-validate-gpt">
        <div class="col-md-6">
          <div class="col-md-6 text-center">
            <div class='row'>
              <qr-code :length='"120px"' :dateUrl="qrcode(loginData.google_uri)"></qr-code>
            </div>
            <div class="row btc-marginT15 btc-margin-left">
              使用
              <strong>
                谷歌验证 App
              </strong>
            </div>
            <div class="row btc-marginT5 btc-marginR35 btc-margin-left">
              扫描二维码
            </div>
            <div class="btc-marginT5 btc-margin-left">
              <basic-button @click.native="RenovateQrcode" :text='"刷新二维码"'></basic-button>
            </div>
          </div>
          <div class="col-md-6 btc-validate-textCenter btc-validate-googlekey">
              <div class="row btc-marginT10">
                <strong class="btc-link ">
                  {{ loginData.google_otp_secret }}
                </strong>
              </div>
              <div class="row btc-marginT20">
              <span>
                若无法扫描，请将该16位密匙手动输入到谷歌验证码APP里
              </span>
            </div>
          </div>
        </div>
        <div class="col-md-6 text-center">
          <form class="btc-b-l">
            <div class="col-md-12 btc-validate-prompt">
              <news-prompt :text='prompt'></news-prompt>
            </div>
            <div class='row'>
              <span class="col-md-4 col-xs-4 text-right">登录密码</span>
              <basic-input @focus.native="promptEmpty()" type="password" class="col-md-7 col-xs-6" placeholder='请输入您在本站的账户登录密码' v-model="password"></basic-input>
            </div>
            <div class="row btc-marginT20">
              <span class="col-md-4 col-xs-4 text-right">谷歌验证码</span>
              <basic-input  @focus.native="promptEmpty()" class="col-md-7 col-xs-6" placeholder='请输入谷歌验证APP里的谷歌验证码' v-model="otp"></basic-input>
            </div>
          </form>
        </div>
      </div>
      <div class=" text-right btc-marginT90">
        <span @click="minusStep" class="btc-link btc-fl btc-marginT25 btc-poniter">返回上一步</span>
        <span class="btc-color999 btc-marginR20">
          已经完成上述所有步骤
        </span>
          <basic-button :text='"开启谷歌验证"' @click.native='gValidate'></basic-button>
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
