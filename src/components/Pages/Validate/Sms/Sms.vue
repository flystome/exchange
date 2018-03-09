<template>
  <div class="btc-validate-sms btc-container-block">
    <header class="btc-color666">
      <span>{{$t('title.member_center')}}</span> > <span class="btc-link">{{$t('title.validate_google')}}</span>
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
        <basic-input :type='"CellPhone"' :placeholder='$t("placeholder.cell_phone_number")' v-model="SmsData.CellPhone">
        </basic-input>
      </div>
      <div class="btc-sms-code">
        <basic-input :placeholder='$t("validate_sms.verification_code")' v-model="SmsData.verifyCode">
        </basic-input>
        <button class="btc-white-btn" @click="SendSms">
          {{$t('validate_sms.send_identify_code')}}
        </button>
      </div>
      <basic-button @click="ValidateSms" style='width:100%' :text='$t("validate_sms.confirm")'>
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
      SmsData: {
        CellPhone: '',
        CellPhonecode: '86',
        CountryName: '',
        verifyCode: ''
      },
      phoneData: Array(7).fill('+86')
    }
  },
  methods: {
    SendSms () {
      this._post({
        url: `/verify/send_code.json`,
        data: {
          phone_number: `+${this.SmsData.CellPhonecode}${this.SmsData.CellPhone}`
        }
      }, (d) => {
        console.log(d.data)
      })
    },
    ValidateSms () {
      this._post({
        url: `/auth_sms.json`,
        data: {
          'country': 'CN',
          'phone_number': `+${this.CellPhonecode}${this.CellPhone}`,
          'otp': this.verifyCode
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
