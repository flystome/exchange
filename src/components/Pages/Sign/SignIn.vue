<template>
  <div @keyup.enter="login" class="btc-signIn btc-sign-block">
    <div class="btc-sign-form">
      <header class="text-center">
        <img src="~Img/large/sign-logo.png">
      </header>
      <div class="form">
        <div class="title btc-color333">
          {{ $t('sign.login_account') }}
        </div>
        <news-prompt :Time='3000' v-on:bind='prompt = $event' :text="prompt"></news-prompt>
        <basic-input :danger='true' ref="email" v-model="SignInData.email" :validate='"required|email"' :placeholder="$t('sign.email_address')"></basic-input>
        <basic-input :danger='true' type='password' ref="password" v-model="SignInData.password" :validate='"required|empty_password"' class="btc-marginT15" :placeholder="$t('sign.login_password')"></basic-input>
        <basic-input class="btc-marginT15" v-if="random" :validate='"required|verify_code"' :danger='true' ref="verify_code" v-model="SignInData.verifycode" :placeholder="$t('validation.verify_code')"></basic-input>
        <img v-if="random" class="btc-pointer" :src="Rucaptcha" @click="changeCaptcha">
        <basic-button :disabled="disabled" class="btn" @click.native='login' :text='$t("sign.login")'></basic-button>
        <div class="form-footer">
          <span class="btc-link">{{$t('homepage.forget_the_password')}}</span>
          <span :class="lang === 'en' ? 'btc-fl' : 'btc-fr'">{{$t('sign.no_account_number')}}<router-link :to='`${ROUTER_VERSION}/register`' class="btc-link">{{$t('sign.to_register')}}</router-link></span>
        </div>
      </div>
    </div>
    <footer class="btc-font12 btc-marginT30 text-center" style="color: #9b9b9b">
      <div>© 2018 hotex.com All Rights Reserved</div>
      <div class="btc-marginT5">{{$t('sign.official_website')}}：www.hotex.com {{$t('sign.official_email')}}：<a href="mailto:support@hotex.com">support@hotex.com</a></div>
    </footer>
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
        verifycode: '',
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
    initUrl() {
      if (!this.$route.query.from) {
        this.from = ''
      } else {
        this.prompt = this.$t('sign.login_failure')
        this.from = this.$route.query.from
      }

      if (this.$route.query.captcha) {
        this.changeCaptcha()
        this.prompt = this.$t('api_server.homepage.error_1002')
      }
    },
    async login () {
      if (this.disabled) return
      const email = await this.$refs['email'].$validator.validateAll()
      const password = await this.$refs['password'].$validator.validateAll()
      if (!email) {
        this.prompt = this.$refs['email'].error
        return
      }
      if (!password) {
        this.prompt = this.$refs['password'].error
        return
      }
      this.disabled = true
      this._post({
        url: '/sessions/log_in.json',
        data: {
          'auth_key': this.SignInData.email,
          'password': this.SignInData.password,
          '_rucaptcha': this.SignInData.verifycode
        }
      }, (d) => {
        this.disabled = false
        if (d.data.success) {
          var loginData = JSON.parse(d.data.success.user_info)
          Object.assign(this.$store.state, {
            loginData: loginData,
            assets: loginData.assets
          })
          this.$store.dispatch('GetMarketData')
          this.$router.push(`/`)
          this.random = false
        } else {
          if (d.data.error.code === 1002) {
            this.changeCaptcha()
            this.$store.commit('PopupBoxDisplay', {type: 'error', message: this.$t('api_server.homepage.error_1002')})
          } else {
            if (d.data.error.captcha_required) {
              this.changeCaptcha()
            }
            this.password = ''
            this.$store.commit('PopupBoxDisplay', {type: 'error', message: this.$t('api_server.homepage.error_1001')})
          }
          Object.assign(this.SignInData, {
            password: '',
            verifycode: '',
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
.btc-basic-button{
  margin-top: 24px;
}
.form-footer{
  padding-top: 42px;
  padding-bottom: 67px;
}
</style>

<style>
.btc-sign-block .btc-basicInput{
  height:39px;
  font-size: 14px;
}
</style>
