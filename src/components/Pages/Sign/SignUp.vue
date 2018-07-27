<template>
  <div @keyup.enter="register" class="signUp sign-block">
    <div class="sign-form">
      <header class="text-center">
        <router-link to="/"><img src="~Img/large/sign-logo.png"></router-link>
      </header>
      <div class="form">
        <div class="title color333">
          {{ $t('sign.create_my_account') }}
          <span v-if="referrer" class="fr referrer" style="color:#999999;font-size:14px">
            <i class="sign-referrer" />
            {{ $t('sign.referrer') }} ID {{ referrer }}
          </span>
        </div>
        <news-prompt :Time='3000' v-on:bind='prompt = $event' :text="prompt"></news-prompt>
        <basic-input :danger='true' ref="email" :validate='"required|email"' class="email" v-model="SignUpData.email" :placeholder="$t('sign.email_address')"></basic-input>
        <input style="visibility: hidden;position:absolute;opacity: 0;" :danger='true' class="email"  :placeholder="$t('sign.email_address')" />
        <basic-input style="visibility: hidden;position:absolute;opacity: 0;" :danger='true' type='password' :validate='"required|password"' :placeholder="$t('sign.login_password')"></basic-input>
        <basic-input :danger='true' type='password' ref="password" :validate='"required|password"' v-model="SignUpData.password" :placeholder="$t('sign.login_password')"></basic-input>
        <div class="marginT15 color999">
          {{ $t('validation.password_fail') }}
        </div>
        <basic-input :invalid="invalid" type='password' v-model="SignUpData.password_confirmation" :validate='`confirmed:${SignUpData.password}`' :placeholder="$t('sign.confirm_password')"></basic-input>
        <basic-input ref="verify_code" :danger='true' :validate='"required|verify_code"' v-model="SignUpData._rucaptcha" :placeholder="$t('validation.verify_code')"></basic-input>
        <img class="pointer" :src="Rucaptcha" @click="changeCaptcha">
        <div class="authentication marginT10">
          <span @click="read = !read" :class="{'authentication-right': read}"></span><a class="pointer" @click="read = !read">{{ $t('market_apply.read_and_agree') }}</a> <a :href="`${$store.state.CmsUrl.user_agreement}`" class="link">{{ $t('footer.user_agreement') }}</a>
        </div>
        <basic-button  :disabled="disabled" @click.native='register' class="btn" :text='$t("nav.register")'></basic-button>
        <div class="form-footer">
          <span class="fr">{{$t('sign.already_registered')}}<router-link :to='`${ROUTER_VERSION}/login`' class="link">{{$t('sign.log_in')}}</router-link></span>
          <div class="clearfix"></div>
        </div>
      </div>
    </div>
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
    this.changeCaptcha()
  },
  async mounted () {
    await this.$nextTick()
      Object.assign(this.SignUpData, {
        password_confirmation: '',
        password: '',
        _rucaptcha: '',
        email: ''
      })
  },
  methods: {
    initReferrer () {
      if (Cookies.get('referrer')) {
        if (!this.$route.query.r) {
          this.referrer = Cookies.get('referrer')
        } else {
          this.referrer = this.$route.query.r
          this.SignUpData.referrer = this.referrer
          Cookies.set('referrer', this.referrer, { expires: 30 })
        }
      } else {
        if (!this.$route.query.r) {
          this.referrer = ''
        } else {
          this.referrer = this.$route.query.r
          this.SignUpData.referrer = this.referrer
          Cookies.set('referrer', this.referrer, { expires: 30 })
        }
      }
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
.signUp {
  position: fixed;
  left: 50%;
  top: 50%;
  margin-left: -232px;
  margin-top: -322px;
  .sign-form {
    margin-top: 0;
  }
}
.form-footer{
  padding-top: 16px;
  padding-bottom: 27px;
}
.basic-button{
  margin-top: 16px;
  outline: none!important;
}

i{
  display: inline-block;
}

.choice{
  background: #d9d9d9!important;
  cursor: not-allowed;
}

.authentication{
  .authentication-right{
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

.sign-block .basicInput{
  height:39px;
  font-size: 14px;
}

.signUp .basicInput{
  margin-top: 16px;
}

.signUp .email input{
  margin-top: 5px;
}

@media (max-width: 768px) {
  .signUp {
    position: static;
    margin-left: 0;
    margin-top: 0;
  }
  .sign-block {
      width: 96%;
      margin: 60px auto;
  }
}
</style>
