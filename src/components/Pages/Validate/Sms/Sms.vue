<template>
  <div class="btc-validate-sms btc-container-block">
    <header class="btc-color666">
      <router-link to='/' class="btc-link">{{$t('title.member_center')}}</router-link> > <span>{{$t('title.validate_sms')}}</span>
    </header>
    <div class="btc-sms-container">
      <news-prompt :text='prompt'></news-prompt>
      <div class="btc-sms-phone">
        <!-- <basic-select v-model="phoneNumber" :data='phoneData'></basic-select> -->
        <div class="btc-sms-choice btc-b-def">
          <span>+</span>
          <div class="" contenteditable="true" >
            {{ SmsData.CellPhonecode }}
          </div>
          <img @click="ShowCallingcode" src="~Img/triangle.png" >
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
        <button class="btc-white-btn" @click="SendSms">
          {{ timer }}
        </button>
      </div>
      <basic-button @click.native="Validate" style='width:100%' :text='$t("validate_sms.confirm")'>
      </basic-button>
    </div>
  </div>
</template>

<script>
import { callingdata } from '@/common/js/countries'
export default {
  name: 'ValidateSms',
  data () {
    return {
      HOST_URL: process.env.HOST_URL,
      prompt: '',
      callDisplay: false,
      callingdata: callingdata,
      callingcode: '',
      second: -1,
      resend: false,
      SmsData: {
        CellPhone: '',
        CellPhonecode: '86',
        CountryName: 'CN',
        verifyCode: '',
        Time: ''
      },
      phoneData: Array(7).fill('+86')
    }
  },
  methods: {
    async SendSms () {
      const cellphone = await this.$refs['cellphone'].$validator.validateAll()
      if (!cellphone) {
        return
      }
      this.CountDown()
      this._post({
        url: `/verify/send_code.json`,
        data: {
          phone_number: `${this.SmsData.CellPhone}`,
          country: this.SmsData.CountryName
        }
      }, (d) => {
        console.log(d.data)
      })
    },
    async Validate () {
      console.log(2)
      const cellphone = await this.$refs['cellphone'].$validator.validateAll()
      const verifiycode = await this.$refs['verifiycode'].$validator.validateAll()
      if (!cellphone || !verifiycode) {
        return
      }
      this._post({
        url: `/verify/auth_sms.json`,
        data: {
          'country': this.SmsData.CountryName,
          'phone_number': `${this.SmsData.CellPhone}`,
          'otp': this.SmsData.verifyCode
        }
      }, (d) => {
        console.log(d.data)
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
    }
  },
  computed: {
    timer () {
      return this.resend ? (this.second < 0
        ? this.$t('withdraw_currency.resend')
        : `${this.$t('withdraw_currency.resend')} ${this.second}s`) : this.$t('auth.send_code')
    }
  },
  filters: {
    maxlen (str) {
      return str.match(/.{8}/)
    }
  }
}
</script>

<style lang='scss'>
@import './Sms.scss'
</style>
