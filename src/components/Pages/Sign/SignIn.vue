<template>
  <div @keyup.enter="login" class="signIn sign-block">
    <div class="sign-form">
      <header class="text-center">
        <router-link to="/"><img src="~Img/large/sign-logo.png"></router-link>
      </header>
      <div class="form">
        <div class="title color333">
          {{ $t('sign.login_account') }}
        </div>
        <news-prompt :Time='3000' v-on:bind='prompt = $event' :text="prompt"></news-prompt>
        <basic-input :danger='true' ref="email" v-model="SignInData.email" :validate='"required|email"' :placeholder="$t('sign.email_address')"></basic-input>
        <basic-input :danger='true' type='password' ref="password" v-model="SignInData.password" :validate='"required|empty_password"' class="marginT15" :placeholder="$t('sign.login_password')"></basic-input>
        <basic-input class="marginT15" v-if="random" :validate='"required|verify_code"' :danger='true' ref="verify_code" v-model="SignInData.verifycode" :placeholder="$t('validation.verify_code')"></basic-input>
        <img v-if="random" class="pointer" :src="Rucaptcha" @click="changeCaptcha">
        <basic-button :disabled="disabled" class="btn" @click.native='login' :text='$t("sign.login")'></basic-button>
        <div class="form-footer">
          <span><router-link class="link" :to="`${ROUTER_VERSION}/forgot_password`">{{$t('homepage.forget_the_password')}}</router-link></span>
          <span :class="lang === 'en' ? 'fl' : 'fr'">{{$t('sign.no_account_number')}}<router-link :to='`${ROUTER_VERSION}/register`' class="link">{{$t('sign.to_register')}}</router-link></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignIn',
  mounted () {
    this.initUrl()
  },
  data () {
    return {
      SignInData: {
        password: '',
        email: '',
        verifycode: ''
      },
      random: false,
      prompt: '',
      from: '',
      disabled: false,
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      HOST_URL: process.env.HOST_URL
    }
  },
  computed: {
    lang () {
      return this.$store.state.language
    },
    Rucaptcha () {
      return `${this.HOST_URL}/rucaptcha?${this.random}`
    }
  },
  methods: {
    initUrl () {
      if (!this.$route.query.from) {
        this.from = ''
      } else {
        this.prompt = this.$t('sign.login_failure')
        this.from = this.$route.query.from
      }
      if (this.$route.query.captcha) {
        this.changeCaptcha()
        this.prompt = this.$t('api_server.homepage.error_1002')
      } else if (this.$route.query.password) {
        this.changeCaptcha()
        this.prompt = this.$t('api_server.homepage.error_1003')
      }
    },
    async login () {
      if (this.disabled) return
      const email = await this.$refs['email'].$validator.validateAll()
      if (!email) {
        this.prompt = this.$refs['email'].error
        return
      }

      const password = await this.$refs['password'].$validator.validateAll()
      if (!password) {
        this.prompt = this.$refs['password'].error
        return
      }
      this.disabled = true
      this._post({
        url: '/sessions/log_in.json',
        data: {
          'auth_key': this.$store.getters.Trim(this.SignInData.email),
          'password': this.SignInData.password,
          '_rucaptcha': this.SignInData.verifycode
        }
      }, (d) => {
        this.disabled = false
        if (d.data.success) {
          // var loginData = JSON.parse(d.data.success.user_info)
          var loginData = d.data.success.user_info
          if (d.data.success.login_2fa_required) {
            Object.assign(this.$store.state, {
              app_activated: loginData.app_activated,
              sms_activated: loginData.sms_activated,
              two_factors: true,
              loginData: loginData,
              assets: loginData.assets
            })
            localStorage.setItem('UserInfo', JSON.stringify(loginData))
            this.$router.push(`${this.ROUTER_VERSION}/login/verify`)
            this.$store.dispatch('GetMarketData')
            return
          }
          Object.assign(this.$store.state, {
            loginData: loginData,
            assets: loginData.assets
          })
          this.$store.dispatch('GetMarketData')
          this.$router.push(`${this.from ? this.from : '/'}`)
          this.random = false
        } else {
          this.$store.commit('PopupBoxDisplay', {type: 'error', message: this.$t(`api_server.homepage.error_${d.data.error.code}`)})
          if (d.data.error.code === 1002) {
            this.changeCaptcha()
          } else {
            if (d.data.error.captcha_required) {
              this.changeCaptcha()
            }
            this.password = ''
          }
          Object.assign(this.SignInData, {
            password: '',
            verifycode: ''
          })
        }
      })
    },
    changeCaptcha () {
      this.random = Math.random()
    }
  },
  watch: {
    $route (to) {
      if (to.name === 'SignIn') {
        this.initUrl()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './common.scss';
.signIn {
  position: fixed;
  left: 50%;
  top: 50%;
  margin-left: -232px;
  margin-top: -226px;
  .sign-form {
    margin-top: 0;
  }
}
.basic-button{
  margin-top: 24px;
}
.form-footer{
  padding-top: 42px;
  padding-bottom: 67px;
}
.sign-block .basicInput{
  height:39px;
  font-size: 14px;
}
</style>
