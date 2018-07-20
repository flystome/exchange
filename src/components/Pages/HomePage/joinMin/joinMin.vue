<template>
  <div class="dia">
    <div class="join_min" @keyup.enter="joinMin">
      <h4>{{$t('homepage.mining.head')}}</h4>
      <ul class='clearfix'>
        <li><span class="fr">{{joinData.currency | upper}}</span>{{$t('homepage.currency')}}</li>
        <li><span class="fr">{{joinData.day_limit}} {{$t('homepage.mining.day')}}</span>{{$t('homepage.mining.deadline')}}</li>
        <li><span class="fr"><input type="number" placeholder='0' class='number' v-model='volume'></span>{{$t('homepage.mining.partNum')}}</li>
        <li><span class="fr">{{joinData.annual_rate}}%</span>{{$t('homepage.mining.annualized')}}</li>
        <li><span class="fr">{{joinData.invite_rate}}%</span>{{$t('homepage.mining.reward1')}}</li>
        <li><span class="fr">{{joinData.newbie_rate}}%</span>{{$t('homepage.mining.reward2')}}</li>
        <li><span class="fr">{{joinData.annual_rate + joinData.invite_rate + joinData.newbie_rate | fixed2}}%</span>{{$t('homepage.mining.income')}}</li>
      </ul>
      <news-prompt :Time='3000' v-on:bind='prompt = $event' :text="prompt"></news-prompt>
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
      <basic-button :disabled="disabled" @click.native='joinMin' class="btn marginB10" :text='$t("confirm")'></basic-button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'joinMin',
  props: ['joinData'],
  data () {
    return {
      google_auth: '',
      prompt: '',
      disabled: false,
      validate: '',
      verifycode: '',
      volume: 0,
      second: -1,
      resend: false
    }
  },
  mounted () {
    if (this.app_activated) {
      this.validate = 'google'
    } else if (this.sms_activated) {
      this.validate = 'sms'
    }
  },
  methods: {
    SendSms () {
      if (this.second > 0 || this.disabled) return
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
    async joinMin () {
      if (this.disabled || !this.volume) return
      const verify_code = this.$refs['verify_code']
      const verify_code_valid = await verify_code.$validator.validateAll()
      if (!verify_code_valid) {
        this.prompt = `${this.$t(`validation.${this.validate === 'sms' ? 'cellphone' : 'google_verify_code'}`)}${this.$t('validation.no_empty')}`
        return
      }
      this.disabled = true
      this._post({
        url: '/fixed_term_deposits/deposit.json',
        data: {
          product_id: this.joinData.id,
          volume: this.volume,
          two_factor: {
            type: this.validate === 'sms' ? 'sms' : 'app',
            otp: this.verifycode
          }
        }
      }, res => {
        this.disabled = false
        var data = res.data
        if (data.error) {
          this.PopupBoxDisplay({message: `${this.$t(`homepage.mining.err_${data.error.code}`)}`, type: 'error'})
          if (data.error.remain_volume) {
            this.$emit('modRemain', data.error.remain_volume, this.joinData.id)
          }
        } else {
          if (data.success.remain_volume) {
            this.$emit('modRemain', data.success.remain_volume, this.joinData.id)
          }
        }
      })
    },
    ...mapMutations(['PopupBoxDisplay'])
  },
  computed: {
    timer () {
      return this.resend ? (this.second < 0
        ? this.$t('withdraw_currency.resend')
        : `${this.$t('withdraw_currency.resend')} ${this.second}s`) : this.$t('auth.send_code')
    },
    app_activated () {
      return this.loginData.app_activated
    },
    sms_activated () {
      return this.loginData.sms_activated
    },
    ...mapGetters(['loginData'])
  }
}
</script>

<style scoped lang='scss'>
  @import './joinMin.scss';
</style>
