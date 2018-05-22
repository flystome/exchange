<template>
  <div class="btc-signIn btc-sign-block">
    <div class="btc-sign-form">
      <header class="text-center">
        <img src="~Img/large/sign-logo.png">
      </header>
      <div class="form">
        <div class="title btc-color333">
          {{ $t('sign.login_account') }}
        </div>
        <news-prompt :text="prompt"></news-prompt>
        <basic-input :danger='true' ref="email" v-model="SignInData.email" :validate='"required|email"' :placeholder="$t('sign.email_address')"></basic-input>
        <basic-input :danger='true' ref="password" v-model="SignInData.password" :validate='"required|password"' class="btc-marginT15" :placeholder="$t('sign.login_password')"></basic-input>
        <basic-button @click.native='login' :text='$t("sign.login")'></basic-button>
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
  data () {
    return {
      SignInData: {
        password: '',
        email: ''
      },
      prompt: '',
      ROUTER_VERSION: process.env.ROUTER_VERSION
    }
  },
  computed: {
    lang () {
      return this.$store.state.language
    }
  },
  methods: {
    async login () {
      // const email = await this.$refs['email'].$validator.validateAll()
      // const password = await this.$refs['password'].$validator.validateAll()
      // if (!email || !password) {
      //   return
      // }
      this.disabled = true
      this._post({
        url: '/sessions/log_in.json',
        data: {
          'auth_key': this.SignInData.email,
          'password': this.SignInData.password
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
        } else {
          if (d.data.error.code === 1002) {
            // console.log(d)
            // location.href = `${this.HOST_URL}/signin`
            // Cookies.set('status', 'captcha_error')
          } else {
            this.password = ''
            this.$store.commit('PopupBoxDisplay', {type: 'error', message: this.$t('api_server.homepage.error_1001')})
          }
        }
      })
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
