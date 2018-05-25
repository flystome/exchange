<template>
  <div @keyup.enter="register" class="btc-signUp btc-sign-block">
    <div class="btc-sign-form">
      <header class="text-center">
        <img src="~Img/large/sign-logo.png">
      </header>
      <div class="form">
        <div class="title btc-color333">
          {{ $t('sign.create_my_account') }}
          <span v-if="referrer" class="btc-fr btc-referrer" style="color:#999999;font-size:14px">
            <i class="sign-referrer" />
            {{ $t('sign.referrer') }} ID {{ referrer }}
          </span>
        </div>
        <news-prompt :Time='3000' v-on:bind='prompt = $event' :text="prompt"></news-prompt>
        <basic-input :danger='true' ref="email" :validate='"required|email"' class="email" v-model="SignUpData.email" :placeholder="$t('sign.email_address')"></basic-input>
        <basic-input :danger='true' type='password' ref="password" :validate='"required|password"' v-model="SignUpData.password" :placeholder="$t('sign.login_password')"></basic-input>
        <div class="btc-marginT15 btc-color999">
          {{ $t('validation.password_fail') }}
        </div>
        <basic-input :invalid="invalid" type='password' v-model="SignUpData.password_confirmation" :validate='`confirmed:${SignUpData.password}`' :placeholder="$t('sign.confirm_password')"></basic-input>
        <basic-input ref="verify_code" :danger='true' :validate='"required|verify_code"' v-model="SignUpData._rucaptcha" :placeholder="$t('validation.verify_code')"></basic-input>
        <img class="btc-pointer" :src="Rucaptcha" @click="changeCaptcha">
        <div class="btc-authentication btc-marginT10">
          <span @click="read = !read" :class="{'btc-authentication-right': read}"></span>{{ $t('market_apply.read_and_agree') }} <a :href="`${$store.state.CmsUrl.user_agreement}`" class="btc-link">{{ $t('footer.user_agreement') }}</a>
        </div>
        <basic-button  :disabled="disabled" @click.native='register' class="btn" :text='$t("nav.register")'></basic-button>
        <div class="form-footer">
          <span class="btc-fr">{{$t('sign.already_registered')}}<router-link :to='`${ROUTER_VERSION}/login`' class="btc-link">{{$t('sign.log_in')}}</router-link></span>
          <div class="clearfix"></div>
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
/* eslint-disable */
import Cookies from 'js-cookie'
export default {
  name: 'SignUp',
  data () {
    return {
      SignUpData: {
        referrer: '',
        password_confirmation: '',
        password: '',
        _rucaptcha: '',
        email: ''
      },
      read: false,
      referrer: '',
      invalid: false,
      prompt: '',
      random: '',
      disabled: false,
      HOST_URL: process.env.HOST_URL,
      ROUTER_VERSION: process.env.ROUTER_VERSION
    }
  },
  created () {
    this.initReferrer()
  },
  methods: {
    initReferrer () {
      if (!this.$route.query.r) {
        this.referrer = ''
      } else {
        this.referrer = this.$route.query.r
        this.SignUpData.referrer = this.referrer
      }
      Cookies.set('referrer', this.referrer)
    },
    changeCaptcha () {
      this.random = Math.random()
    },
    async register () {
      if (this.disabled) return
      const email = this.$refs['email']
      const password = this.$refs['password']
      const verify_code = this.$refs['verify_code']

      /*eslint camelcase: ["error", {properties: "never"}]*/
      const email_valid = await email.$validator.validateAll()
      if (!email_valid) {
        this.prompt = email.error
        return
      }

      const password_valid = await password.$validator.validateAll()
      if (!password_valid) {
        this.prompt = password.error
        return
      }

      if (this.SignUpData.password !== this.SignUpData.password_confirmation) {
        this.invalid = true
        this.prompt = this.$t('validation.inconsistency_of_password')
        return
      }

      const verify_code_valid = await verify_code.$validator.validateAll()
      if (!verify_code_valid) {
        this.prompt = verify_code.error
        return
      }

      if (!this.read) {
        this.prompt = this.$t('sign.check_agreement')
        return
      }

      this.disabled = true
      this._post({
        url: '/sessions/signup.json',
        data: this.SignUpData
      }, (d) => {
        this.disabled = false
        if (d.data.success) {
          this.$router.push(`/`)
          var loginData = JSON.parse(d.data.success.user_info)
          Object.assign(this.$store.state, {
            loginData: loginData,
            assets: loginData.assets
          })
          this.read = false
          this.$store.dispatch('GetMarketData')
          this.$store.commit('PopupBoxDisplay', {type: 'success', message: this.$t(`api_server.signup.success_200`)})
        } else {
          this.changeCaptcha()
          this.$store.commit('PopupBoxDisplay', {type: 'error', message: this.$t(`api_server.signup.error_${d.data.error.code}`)})
          if (d.data.error.code === 1002) {
            Object.assign(this.SignUpData, {
              _rucaptcha: '',
            })
          } else {
            Object.assign(this.SignUpData, {
              _rucaptcha: '',
              email: '',
            })
          }
        }
      })

    }
  },
  computed: {
    Rucaptcha () {
      return `${this.HOST_URL}/rucaptcha?${this.random}`
    }
  },
  watch: {
    'SignUpData.password_confirmation' () {
      if (this.SignUpData.password_confirmation !== this.SignUpData.password) {
        this.invalid = true
      } else {
        this.invalid = false
      }
    },
    'SignUpData.password' () {
      if (this.SignUpData.password_confirmation !== this.SignUpData.password) {
        this.invalid = true
      } else {
        this.invalid = false
      }
    },
    $route (to) {
      if (to.name === 'SignUp') {
        this.changeCaptcha()
        this.initReferrer()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './common.scss';
.form-footer{
  padding-top: 16px;
  padding-bottom: 27px;
}
.btc-basic-button{
  margin-top: 16px;
  outline: none!important;
}

i{
  display: inline-block;
}

.btc-choice{
  background: #d9d9d9!important;
  cursor: not-allowed;
}

.btc-authentication{
  .btc-authentication-right{
    border: none;
    &:after{
      content: '';
      @include sprite($-market-maker-right);
      display: block;
    }
  }
  span{
    display: inline-block;
    height: 14px;
    border: 1px solid #dfdfdf;
    width: 14px;
    position: relative;
    top: 2px;
    margin-right: 6px;
    cursor: pointer;
  }
}

.sign-referrer{
  @include sprite($sign-referrer);
  position: relative;
  top: 3px;
  margin-right: 5px;
}
</style>

<style>
.btc-sign-block .btc-basicInput{
  height:39px;
  font-size: 14px;
}

.btc-signUp .btc-basicInput{
  margin-top: 16px;
}

.btc-signUp .email input{
  margin-top: 5px;
}
</style>
