<template>
  <div v-if="!loginData.sms_activated && loginData.activated" @keyup.enter='Validate' class="btc-validate-sms btc-container-block" @click="ShowCallingcode(false);prompt = ''">
    <header class="btc-color666">
      <router-link to='/' class="btc-link">{{$t('title.member_center')}}</router-link> > <span>{{$t('title.validate_sms')}}</span>
    </header>
    <div class="btc-sms-container">
      <news-prompt :text='prompt'></news-prompt>
      <div class="btc-sms-phone">
        <div class="btc-sms-choice btc-b-def">
          <span>+</span>
          <div-contenteditable v-model="SmsData.CellPhonecode">
          </div-contenteditable>
          <img @click.stop="ShowCallingcode(true)" src="~Img/triangle.png" >
        </div>
      <div class="btc-code-list btc-b-def" v-if="callDisplay">
        <ul>
          <li v-for='data in callingdata' :key="data.name">
            <div class="text-center" @click="PutCode(data.number, data.name, data.alpha)">
              <span class="btc-code-number">{{ data.number }}</span>
              <span class="btc-code-name">{{ data.name }}</span>
            </div>
          </li>
        </ul>
      </div>
        <basic-input :validate='"CellPhone"' ref="cellphone" :placeholder='$t("placeholder.cell_phone_number")' v-model="SmsData.CellPhone">
        </basic-input>
      </div>
      <div class="btc-sms-code">
        <basic-input :validate='"verify code"' ref="verifiycode" :placeholder='$t("validate_sms.verification_code")' v-model="SmsData.verifyCode">
        </basic-input>
        <button :disabled="disabled" class="btc-white-btn" @click="SendSms">
          {{ timer }}
        </button>
      </div>
      <div class="btc-sms-google btc-marginB30" v-if="loginData.app_activated">
        <basic-input :placeholder='$t("validate_sms.google_verification_code")'>
        </basic-input>
      </div>
      <basic-button @click.native.stop="Validate" style='width:100%' :text='$t("validate_sms.confirm")'>
      </basic-button>
    </div>
  </div>
</template>

<script>
import { callingdata } from '@/common/js/countries'
import { mapMutations, mapGetters } from 'vuex'
const _ = require('lodash')
export default {
  name: 'ValidateSms',
  data () {
    return {
      prompt: '',
      disabled: false,
      HOST_URL: process.env.HOST_URL,
      callDisplay: false,
      callingdata: callingdata,
      callingcode: '',
      second: -1,
      resend: false,
      isLocked: false,
      SmsData: {
        CellPhone: '',
        CellPhonecode: '86',
        CountryName: 'CN',
        verifyCode: '',
        Time: '',
        googlecode: ''
      }
    }
  },
  methods: {
    async SendSms () {
      const cellphone = await this.$refs['cellphone'].$validator.validateAll()
      if (!cellphone) {
        return
      }
      this.disabled = true
      this._post({
        url: `/verify/send_code.json`,
        data: {
          phone_number: `${this.SmsData.CellPhone}`,
          country: this.SmsData.CountryName
        }
      }, (d) => {
        this.disabled = false
        if (d.data.success) {
          if (this.second < 0) {
            this.CountDown()
          }
        } else {
          this.PopupBoxDisplay({message: this.$t('api_server.validate_sms.send_code_1001'), type: 'error'})
        }
      })
    },
    async Validate () {
      if (this.SmsData.CountryName === '') {
        this.prompt = this.$t('validate_sms.use_right_code')
      }
      const cellphone = await this.$refs['cellphone'].$validator.validateAll()
      const verifiycode = await this.$refs['verifiycode'].$validator.validateAll()
      if (!cellphone || !verifiycode || this.SmsData.CountryName === '') {
        return
      }
      this._post({
        url: `/verify/auth_sms.json`,
        data: {
          'country': this.SmsData.CountryName,
          'phone_number': `${this.SmsData.CellPhone}`,
          'otp': this.SmsData.verifyCode,
          'google_code': this.SmsData.googlecode
        }
      }, (d) => {
        if (d.data.success) {
          this.PopupBoxDisplay({message: this.$t('api_server.validate_sms.auth_sms_200'), type: 'success', url: '/member_center'})
        } else {
          this.SmsData.verifyCode = ''
          this.PopupBoxDisplay({message: this.$t('api_server.validate_sms.auth_sms_1001'), type: 'error'})
        }
      })
    },
    PutCode (number, name, alpha) {
      this.ShowCallingcode(false)
      this.SmsData.CellPhonecode = number.slice(1)
      this.SmsData.CountryName = alpha
    },
    ShowCallingcode (state) {
      this.callDisplay = state
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
    ...mapMutations(['PopupBoxDisplay', 'ChangePopupBox'])
  },
  computed: {
    timer () {
      return this.resend ? (this.second < 0
        ? this.$t('withdraw_currency.resend')
        : `${this.$t('withdraw_currency.resend')} ${this.second}s`) : this.$t('auth.send_code')
    },
    ...mapGetters(['loginData'])
  },
  filters: {
    maxlen (str) {
      return str.match(/.{8}/)
    }
  },
  watch: {
    'SmsData.CellPhonecode': _.debounce(function () {
      var lock = false
      callingdata.forEach((d) => {
        if (d.number.slice(1) === this.SmsData.CellPhonecode) {
          this.SmsData.CountryName = d.alpha
          lock = true
        }
      })
      if (!lock) {
        this.SmsData.CountryName = ''
      }
    }, 500),
    loginData (to, from) {
      if (!from) {
        if (/sms/.test(this.$route.path)) {
          if (!this.loginData.activated) {
            this.PopupBoxDisplay({message: this.$t('member_center.1001_hint'), type: 'warn', url: '/'})
          } else if (this.loginData.sms_activated) {
            this.$router.push({path: '/'})
          }
        }
      }
    },
    $route (to) {
      this.route = to.path.slice(to.path.lastIndexOf('/') + 1)
      if (this.route === 'sms') {
        if (!this.loginData.activated) {
          this.PopupBoxDisplay({message: this.$t('member_center.1001_hint'), type: 'warn', url: '/'})
        } else if (this.loginData.sms_activated) {
          this.$router.push({path: '/'})
        }
      }
    }
  }
}
</script>

<style lang='scss'>
@import './Sms.scss'
</style>
