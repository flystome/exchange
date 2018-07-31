<template>
  <div v-if="!loginData.sms_activated && loginData.activated" @keyup.enter='Validate' class="validate-sms container-block" @click="ShowCallingcode(false);prompt = ''">
    <header class="color666">
      <router-link :to="`${ROUTER_VERSION}/my_account`" class="link">{{$t('title.my_account')}}</router-link> > <span>{{$t('title.validate_sms')}}</span>
    </header>
    <div class="sms-container">
      <news-prompt :text='prompt'></news-prompt>
      <div class="marginB5">
        <span class="color999">{{$t('validate_sms.area')}}:</span> {{ Country }}
      </div>
      <div class="sms-phone">
        <div class="code-list b-def" v-if="callDisplay">
          <ul>
            <!-- <li v-for='data in callingdata' :key="data.name">
              <div class="text-center" @click="PutCode(data.number, data.name, data.alpha)">
                <span class="code-number">{{ data.number }}</span>
                <span class="code-name">{{ data.name }}</span>
              </div>
            </li> -->
            <li>
              <div class="text-center" @click="PutCode(86, '中国', 'CN')">
                <span class="code-number">86</span>
                <span class="code-name">中国</span>
              </div>
            </li>
            <li>
              <div class="text-center" @click="PutCode(852, '香港', 'HK')">
                <span class="code-number">852</span>
                <span class="code-name">香港</span>
              </div>
            </li>
            <li>
              <div class="text-center" @click="PutCode(1, 'United States', 'US')">
                <span class="code-number">1</span>
                <span class="code-name">United States</span>
              </div>
            </li>
            <li>
              <div class="text-center" @click="PutCode(81, 'Japan', 'JP')">
                <span class="code-number">81</span>
                <span class="code-name">Japan</span>
              </div>
            </li>
            <li>
              <div class="text-center" @click="PutCode(1, 'Canada', 'CA')">
                <span class="code-number">1</span>
                <span class="code-name">Canada</span>
              </div>
            </li>
            <li>
              <div class="text-center" @click="PutCode(65, '新加坡', 'SG')">
                <span class="code-number">65</span>
                <span class="code-name">新加坡</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="sms-choice b-def">
          <span>+</span>
          <div-contenteditable @keyup.stop.native v-model="SmsData.CellPhonecode">
          </div-contenteditable>
          <i @click.stop="ShowCallingcode(true)" class="sms-triangle" />
        </div>
          <!-- <div-contenteditable @keyup.stop.native v-model="SmsData.CellPhonecode">
          </div-contenteditable> -->
        <basic-input style="min-height:66px" :validate='"required|cellphone"' ref="cellphone" :placeholder='$t("placeholder.cell_phone_number")' v-model="SmsData.CellPhone">
        </basic-input>
      </div>
      <div class="sms-code">
        <basic-input  style="min-height:66px" :validate='"required|sms_verification_code"' ref="verifiycode" :placeholder='$t("validate_sms.verification_code")' v-model="SmsData.verifyCode">
        </basic-input>
        <span :disabled="disabled" class="white-btn" @click="SendSms">
          {{ timer }}
        </span>
      </div>
      <div class="sms-google marginB30" v-if="loginData.app_activated">
        <basic-input  style="min-height:66px"  :placeholder='$t("validate_sms.google_verification_code")' :validate='"required|google_verify_code"' ref="googlecode" v-model="SmsData.googlecode">
        </basic-input>
      </div>
      <basic-button  @click.native.enter.stop="Validate" style='width:100%' :text='$t("validate_sms.confirm")'>
      </basic-button>
    </div>
  </div>
</template>

<script>
import { callingdata } from '@/common/js/countries'
import { mapMutations, mapState } from 'vuex'
const _debounce = require('lodash.debounce')
export default {
  name: 'ValidateSms',
  // updated () {
  //   if (this.redirectLock) return
  //   if (this.$store.state.loginData) {
  //     this.redirectLock = true
  //     this.$store.dispatch('redirect')
  //   }
  // },
  data () {
    return {
      prompt: '',
      redirectLock: false,
      disabled: false,
      HOST_URL: process.env.HOST_URL,
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      callDisplay: false,
      callingdata: callingdata,
      callingcode: '',
      second: -1,
      resend: false,
      Country: 'United States',
      SmsData: {
        CellPhone: '',
        CellPhonecode: '86',
        CountryName: 'China',
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
          this.PopupBoxDisplay({message: this.$t(`api_server.validate_sms.send_code_${d.data.error.code}`), type: 'error'})
        }
      })
    },
    async Validate () {
      if (this.disabled) return
      if (this.SmsData.CountryName === '') {
        this.prompt = this.$t('validate_sms.use_right_code')
      }
      const cellphone = await this.$refs['cellphone'].$validator.validateAll()
      const verifiycode = await this.$refs['verifiycode'].$validator.validateAll()
      if (!this.$refs['googlecode']) {
        if (!cellphone || !verifiycode || this.SmsData.CountryName === '') {
          return
        }
      } else {
        const googlecode = await this.$refs['googlecode'].$validator.validateAll()
        if (!cellphone || !verifiycode || !googlecode || this.SmsData.CountryName === '') {
          return
        }
      }
      this.disabled = true
      this._post({
        url: `/verify/auth_sms.json`,
        data: {
          'country': this.SmsData.CountryName,
          'phone_number': `${this.SmsData.CellPhone}`,
          'otp': this.SmsData.verifyCode,
          'google_code': this.SmsData.googlecode
        }
      }, (d) => {
        this.disabled = false
        if (d.data.success) {
          this.PopupBoxDisplay({message: this.$t('api_server.validate_sms.auth_sms_200'), type: 'success', url: '/my_account'})
          this.$store.dispatch('getData')
        } else {
          this.SmsData.verifyCode = ''
          this.SmsData.googlecode = ''
          this.PopupBoxDisplay({message: this.$t(`api_server.validate_sms.auth_sms_${d.data.error.code}`), type: 'error'})
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
    ...mapState(['loginData'])
  },
  filters: {
    maxlen (str) {
      return str.match(/.{8}/)
    }
  },
  watch: {
    'SmsData.CellPhonecode': _debounce(function (a) {
      var lock = false
      callingdata.forEach((d) => {
        if (d.number.slice(1) === this.SmsData.CellPhonecode.replace(/<\/div>/g, '').replace(/<br>/g, '')) {
          this.SmsData.CountryName = d.alpha
          this.Country = d.name
          lock = true
        }
      })
      if (!lock) {
        this.SmsData.CountryName = ''
        this.Country = ''
      }
    }, 500)
    // $route (to) {
    //   this.route = to.path.slice(to.path.lastIndexOf('/') + 1)
    //   if (this.route === 'sms') {
    //     this.$store.dispatch('redirect')
    //   }
    // }
  }
}
</script>

<style lang='scss'>
@import './Sms.scss'
</style>
