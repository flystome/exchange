<template>
  <div class="btc-verfication">
    <div class="btc-container-block">
      <div>
        <a>{{ $t('sign.ip_change') }}</a>
        <div class="btc-sms-code">
          <basic-input style="min-height:62px" :validate='"required|sms_verification_code"' ref="verifiycode" :placeholder='$t("validate_sms.verification_code")' v-model="SmsData.verifyCode">
          </basic-input>
          <span :disabled="disabled" class="btc-white-btn" @click="SendSms">
            {{ timer }}
          </span>
        </div>
        <div class="btc-sms-google">
          <basic-input  style="min-height:66px" :placeholder='$t("validate_sms.google_verification_code")' :validate='"required|google_verify_code"' ref="googlecode" v-model="SmsData.googlecode">
          </basic-input>
        </div>
        <basic-button :text='$t("confirm")'></basic-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginVerfication',
  data () {
    return {
      disabled: false,
      second: -1,
      resend: false,
      SmsData: {
        verifyCode: '',
        googlecode: ''
      }
    }
  },
  methods: {
    SendSms () {
      if (this.second < 0) {
        this.CountDown()
      }
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
  }
}
</script>

<style lang="scss" scoped>
.btc-container-block{
  min-height: 70vh;
  > div{
    padding: 130px 31% 195px 31%;
    > a{
      display: inline-block;
      margin-bottom: 15px;
    }
  }
}
.btc-sms-code{
  display: flex;
  > div{
    flex: 1;
  }
}

.btc-basic-button{
  width: 100%
}

.btc-white-btn{
  height: 32px;
  margin-left: 10px;
  line-height: 29px;
  padding: 0 8px;
  cursor: pointer;
}

@media (max-width: 992px){
  .btc-container-block > div{
    padding: 130px 150px 195px 150px!important;
  }
}


@media (max-width: 768px){
  .btc-container-block > div{
    padding: 63px 15px 195px 15px!important;
  }
}
</style>
