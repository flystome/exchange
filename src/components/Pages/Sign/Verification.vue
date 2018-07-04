<template>
  <div class="verfication" @keyup.enter="Verfiy">
    <div class="container-block">
      <div>
        <a>{{ $t('sign.ip_change') }}</a>
        <news-prompt :Time='3000' v-on:bind='prompt = $event' :text='prompt'></news-prompt>
        <!-- <div class="sms-code" v-if="sms_activated">
          <basic-input style="min-height:62px" :validate='"required|sms_verification_code"' ref="verifiycode" :placeholder='$t("validate_sms.verification_code")' v-model="SmsData.verifyCode">
          </basic-input>
          <span :disabled="disabled" class="white-btn" @click="SendSms">
            {{ timer }}
          </span>
        </div> -->
        <div class="verify">
          <select class="select-option" ref='select'
          v-model="validate"
          :disabled="disabled">
            <option v-if="app_activated" value="google">{{ this.$t('withdraw_currency.google_validate') }}</option>
            <option v-if="sms_activated" value="sms">{{ this.$t('withdraw_currency.sms') }}</option>
          </select>
          <basic-input :danger='true' ref="verify_code" style="min-height:66px" :validate='"required|verify_code"' v-model="verifycode">
          </basic-input>
          <span v-if="validate === 'sms'" :disabled="disabled" class="white-btn" @click="SendSms">
            {{ timer }}
          </span>
        </div>
        <basic-button :disabled="disabled" @click.native="Verfiy" class="btn" :text='$t("confirm")'></basic-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'LoginVerfication',
  data () {
    return {
      disabled: false,
      second: -1,
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      resend: false,
      verifycode: '',
      validate: '',
      prompt: ''
    }
  },
  beforeCreate () {
    if (!this.$store.state.two_factors) {
      this.$router.push(`${process.env.ROUTER_VERSION}`)
    }
  },
  methods: {
    SendSms () {
      if (this.second > 0) {
        return
      }
      if (this.disabled) return
      this.disabled = true
      this._post({
        url: '/funds/send_sms'
      }, (d) => {
        this.disabled = false
        if (d.data.error) {
          this.PopupBoxDisplay({message: this.$t('api_server.withdraw_currency.send_phone_error_1001'), type: 'error'})
        } else {
          this.CountDown()
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
    async Verfiy () {
      if (this.disabled) return
      const verify_code = this.$refs['verify_code']
      var verify_valid = await verify_code.$validator.validateAll()
      if (!verify_valid) {
        this.prompt = `${this.$t(`validation.${this.validate === 'sms' ? 'cellphone' : 'google_verify_code'}`)}${this.$t('validation.no_empty')}`
        return
      }
      this.disabled = true
      this._request({
        method: 'patch',
        url: '/two_factors/two_factor_auth.json',
        data: {
          two_factor: {
            type: this.validate === 'sms' ? 'sms' : 'app',
            otp: this.verifycode
          }
        }
      }, (d) => {
        this.disabled = false
        if (d.data.error) {
          if (d.data.error.code === 1102) {
            this.$router.replace(`${this.ROUTER_VERSION}/login`)
            return
          }
          this.PopupBoxDisplay({message: `${this.$t(`withdraw_currency.${this.$refs['select'].value.match(/\w+/g)[0].toLowerCase()}`)}${this.$t('api_server.withdraw_currency.create_withdraw_1002')}`, type: 'error'})
        } else {
          Object.assign(this.$store.state, {
            two_factors: ''
          })
          this.$router.push(`${this.ROUTER_VERSION}`)
        }
      })
    },
    ...mapMutations(['PopupBoxDisplay'])
  },
  mounted () {
    if (this.app_activated) {
      this.validate = 'google'
    } else if (this.sms_activated) {
      this.validate = 'sms'
    }
  },
  computed: {
    timer () {
      return this.resend ? (this.second < 0
        ? this.$t('withdraw_currency.resend')
        : `${this.$t('withdraw_currency.resend')} ${this.second}s`) : this.$t('auth.send_code')
    },
    app_activated () {
      return this.$store.state.app_activated
    },
    sms_activated () {
      return this.$store.state.sms_activated
    }
  }
}
</script>

<style lang="scss" scoped>
.container-block{
  min-height: 70vh;
  > div{
    padding: 130px 31% 195px 31%;
    > a{
      display: inline-block;
    }
  }
}
.sms-code{
  display: flex;
  > div{
    flex: 1;
  }
}

.verify{
  display: flex;
  > div {
    flex: 1
  }
}

.basic-button{
  width: 100%
}

.white-btn{
  height: 32px;
  margin-left: 10px;
  line-height: 29px;
  padding: 0 8px;
  cursor: pointer;
}

select{
  height: 32px;
  background: none;
  border-right: none;
  appearance: menulist;
  border-color: #dfe0e1;
}

@media (max-width: 992px){
  .container-block > div{
    padding: 130px 150px 195px 150px!important;
  }
}

@media (max-width: 768px){
  .container-block > div{
    padding: 63px 15px 195px 15px!important;
  }
}
</style>
