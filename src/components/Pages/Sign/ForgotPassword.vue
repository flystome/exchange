<template>
  <div @keyup.enter="keyEvent" class="btc-ForgotPassword btc-sign-block">
    <div class="btc-sign-form">
      <header class="text-center">
        <img src="~Img/large/sign-logo.png">
      </header>
      <div class="form">
        <div class="title btc-color333">
          {{ $t('sign.reset_password') }}
        </div>
        <news-prompt :Time='3000' v-on:bind='prompt = $event' :text="prompt"></news-prompt>
        <div v-show="step === 0">
          <basic-input :danger='true' ref="email" v-model="SendEmailData.email" :validate='"required|email"' :placeholder="$t('sign.email_address')"></basic-input>
          <input style="visibility: hidden;position:absolute;opacity: 0;" :danger='true' class="email"  :placeholder="$t('sign.email_address')" />
          <input  style="visibility: hidden;position:absolute;opacity: 0;" name="filed" :danger='true' type='password'  :placeholder="$t('sign.login_password')" />
          <basic-input class="btc-marginT15" :validate='"required|verify_code"' :danger='true' ref="verify_code" v-model="SendEmailData.verify_code" :placeholder="$t('validation.verify_code')"></basic-input>
          <img v-if="random !== 'loading'" class="btc-pointer btc-marginT5" :src="random" @click="getCaptch">
          <vue-simple-spinner v-else style="float: left;margin-top: 15px;" size="60"></vue-simple-spinner>
          <basic-button :disabled="disabled" class="btn btc-marginT15" @click.native='SendEmail' :text='$t("auth.send_email")'></basic-button>
        </div>
        <div v-show="step === 1">
          <basic-input :danger='true' type='password' ref="password" v-model="ChangePasswordData.password" :validate='"required|password"' :placeholder="$t('sign.new_password')"></basic-input>
          <basic-input :invalid='invalid' type='password' class="btc-marginT15" v-model="ChangePasswordData.password_confirmation" :placeholder="$t('sign.confirm_password')"></basic-input>
          <basic-input :danger='true' ref="verify_email_code" class="btc-marginT15" :validate='"required|verify_code"' v-model="ChangePasswordData.verify_code" :placeholder="$t('validation.email_verify_code')"></basic-input>
          <div class="btc-marginT15 btc-color999">
            {{ $t('validation.password_fail') }}
          </div>
          <basic-button :disabled="disabled" class="btn btc-marginT15" @click.native='ChangePassword' :text='$t("confirm")'></basic-button>
        </div>
        <div class="form-footer">
          <span class="btc-fr"><router-link :to='`${ROUTER_VERSION}/login`' class="btc-link">{{$t('sign.log_in')}}</router-link></span>
          <div class="clearfix"></div>
        </div>
      </div>
    </div>
    <!-- <footer class="btc-font12 btc-marginT30 text-center" style="color: #9b9b9b">
      <div>© 2018 hotex.com All Rights Reserved</div>
      <div class="btc-marginT5">{{$t('sign.official_website')}}：www.hotex.com {{$t('sign.official_email')}}：<a href="mailto:support@hotex.com">support@hotex.com</a></div>
    </footer> -->
  </div>
</template>

<script>
export default {
  name: 'ForgotPassword',
  created () {
    this.init()
  },
  data () {
    return {
      SendEmailData: {
        email: '',
        verify_code: ''
      },
      auth_code: '',
      invalid: false,
      ChangePasswordData: {
        password: '',
        password_confirmation: '',
        verify_code: ''
      },
      step: 0,
      random: 'loading',
      prompt: '',
      token: '',
      disabled: false,
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      HOST_URL: process.env.HOST_URL
    }
  },
  methods: {
    async getCaptch () {
      this.random = 'loading'
      const data = await this.$store.dispatch('GetCaptcha')
      this.random = `data:image/jpeg;base64,${data.image}`
      this.auth_code = data.auth_code
    },
    keyEvent () {
      this.step === 0 ? this.SendEmail() : this.ChangePassword()
    },
    init () {
      this.getCaptch()
    },
    async SendEmail () {
      if (this.disabled) return
      const email = await this.$refs['email'].$validator.validateAll()
      if (!email) {
        this.prompt = this.$refs['email'].error
        return
      }
      const verify_code = await this.$refs['verify_code'].$validator.validateAll()
      if (!verify_code) {
        this.prompt = this.$refs['verify_code'].error
        return
      }
      this.disabled = true
      this._post({
        url: '/reset_passwords.json',
        data: {
          reset_password: {
            email: this.$store.getters.Trim(this.SendEmailData.email),
            origin: 'web'
          },
          _rucaptcha: this.SendEmailData.verify_code,
          auth_code: this.auth_code
        }
      }, (d) => {
        this.disabled = false
        if (d.data.success) {
          this.step = 1
          this.$store.commit('PopupBoxDisplay', {type: 'success', message: this.$t(`api_server.send_eamil.success_200`)})
        } else {
          this.getCaptch()
          this.$store.commit('PopupBoxDisplay', {type: 'error', message: this.$t(`api_server.send_eamil.error_${d.data.error.code}`)})
          Object.assign(this.SendEmailData, {
            verify_code: ''
          })
        }
      })
    },
    async ChangePassword () {
      if (this.disabled) return
      const password = await this.$refs['password'].$validator.validateAll()
      if (!password) {
        this.prompt = this.$refs['password'].error
        return
      }

      if (this.ChangePasswordData.password !== this.ChangePasswordData.password_confirmation) {
        this.invalid = true
        this.prompt = this.$t('validation.inconsistency_of_password')
        return
      }

      const verify_email_code = await this.$refs['verify_email_code'].$validator.validateAll()
      if (!verify_email_code) {
        this.prompt = this.$refs['verify_email_code'].error
        return
      }

      this._get({
        url: '/reset_passwords/verify_code.json',
        data: {
          email: this.SendEmailData.email,
          verify_code: this.ChangePasswordData.verify_code
        }
      }, (d) => {
        if (d.data.success) {
          this._request({
            url: `/reset_passwords/${d.data.success.token}.json`,
            method: 'PATCH',
            data: {
              token: d.data.success.token,
              reset_password: {
                password_confirmation: this.ChangePasswordData.password_confirmation,
                password: this.ChangePasswordData.password
              }
            }
          }, (data) => {
            if (data.data.success) {
              this.$router.push(`${this.ROUTER_VERSION}/login`)
              this.$store.commit('PopupBoxDisplay', {type: 'success', message: this.$t(`api_server.forgot_password.success_200`)})
            } else {
              this.$store.commit('PopupBoxDisplay', {type: 'error', message: this.$t(`api_server.forgot_password.error_${data.data.error.code}`)})
              Object.assign(this.ChangePasswordData, {
                password: '',
                password_confirmation: '',
                verify_code: ''
              })
            }
          })
        } else {
          this.$store.commit('PopupBoxDisplay', {type: 'error', message: this.$t(`api_server.validate_email.error_${d.data.error.code}`)})
          Object.assign(this.ChangePasswordData, {
            password: '',
            password_confirmation: '',
            verify_code: ''
          })
        }
      })
    }
  },
  watch: {
    'ChangePasswordData.password_confirmation' () {
      if (this.ChangePasswordData.password_confirmation !== this.ChangePasswordData.password) {
        this.invalid = true
      } else {
        this.invalid = false
      }
    },
    'ChangePasswordData.password' () {
      if (this.ChangePasswordData.password_confirmation !== this.ChangePasswordData.password) {
        this.invalid = true
      } else {
        this.invalid = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './common.scss';
.form-footer{
  padding-top: 10px;
  padding-bottom: 30px;
}
.btc-sign-block .btc-basicInput{
  height:39px;
  font-size: 14px;
}
</style>
