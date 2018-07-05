<template>
  <div @keyup.enter="ChangePassword" class="changePassword sign-block">
    <div class="sign-form">
      <header class="text-center">
        <img src="~Img/large/sign-logo.png">
      </header>
      <div class="form">
        <div class="title color333">
          {{ $t('title.change_password') }}
        </div>
        <news-prompt :Time='3000' v-on:bind='prompt = $event' :text="prompt"></news-prompt>
        <basic-input type='password' :danger='true' ref="old_password" :validate='"required|password"' class="old_password" v-model="ChangePasswordData.identity.old_password" :placeholder="$t('sign.old_password')"></basic-input>
        <basic-input :danger='true' type='password' ref="password" :validate='"required|password"' v-model="ChangePasswordData.identity.password" :placeholder="$t('sign.new_password')"></basic-input>
        <div class="marginT15 color999">
          {{ $t('validation.password_fail') }}
        </div>
        <basic-input  type='password' :invalid="invalid" v-model="ChangePasswordData.identity.password_confirmation" :validate='`confirmed:${ChangePasswordData.identity.password}`' :placeholder="$t('sign.confirm_password')"></basic-input>
        <basic-input ref="verify_code" :danger='true' :validate='"required|verify_code"' v-model="ChangePasswordData._rucaptcha" :placeholder="$t('validation.verify_code')"></basic-input>
        <img class="pointer marginT5" :src="Rucaptcha" @click="changeCaptcha">
        <basic-button :disabled="disabled" @click.native='ChangePassword' class="btn marginB30" :text='$t("confirm")'></basic-button>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'ChangePassword',
  data () {
    return {
      ChangePasswordData: {
        identity: {
          password_confirmation: '',
          password: '',
          old_password: ''
        },
        _rucaptcha: ''
      },
      invalid: false,
      prompt: '',
      random: '',
      disabled: false,
      HOST_URL: process.env.HOST_URL,
      ROUTER_VERSION: process.env.ROUTER_VERSION
    }
  },
  methods: {
    changeCaptcha () {
      this.random = Math.random()
    },
    async ChangePassword () {
      if (this.disabled) return
      /* eslint camelcase: "error" */
      const old_password = this.$refs['old_password']
      const password = this.$refs['password']
      const verify_code = this.$refs['verify_code']

      const old_password_valid = await old_password.$validator.validateAll()
      if (!old_password_valid) {
        this.prompt = old_password.error
        return
      }

      const password_valid = await password.$validator.validateAll()
      if (!password_valid) {
        this.prompt = password.error
        return
      }

      if (this.ChangePasswordData.identity.password !== this.ChangePasswordData.identity.password_confirmation) {
        this.invalid = true
        this.prompt = this.$t('validation.inconsistency_of_password')
        return
      }

      const verify_code_valid = await verify_code.$validator.validateAll()
      if (!verify_code_valid) {
        this.prompt = verify_code.error
        return
      }

      this.disabled = true
      this._request({
        url: '/identity.json',
        method: 'patch',
        data: this.ChangePasswordData
      }, (d) => {
        this.disabled = false
        if (d.data.success) {
          this.$router.push(`${this.ROUTER_VERSION}/my_account`)
          this.$store.commit('PopupBoxDisplay', {type: 'success', message: this.$t(`api_server.change_password.success_200`)})
          Object.assign(this.ChangePasswordData, {
            identity: {
              password_confirmation: '',
              password: '',
              old_password: ''
            },
            _rucaptcha: ''
          })
        } else {
          this.changeCaptcha()
          this.$store.commit('PopupBoxDisplay', {type: 'error', message: this.$t(`api_server.change_password.error_${d.data.error.code}`)})
        }

        this.ChangePasswordData._rucaptcha = ''
      })
    }
  },
  computed: {
    Rucaptcha () {
      return `${this.HOST_URL}/rucaptcha?${this.random}`
    }
  },
  watch: {
    'ChangePasswordData.identity.password_confirmation' () {
      if (this.ChangePasswordData.identity.password_confirmation !== this.ChangePasswordData.identity.password) {
        this.invalid = true
      } else {
        this.invalid = false
      }
    },
    'ChangePasswordData.identity.password' () {
      if (this.ChangePasswordData.identity.password_confirmation !== this.ChangePasswordData.identity.password) {
        this.invalid = true
      } else {
        this.invalid = false
      }
    },
    $route (to) {
      if (to.name === this.$route.name) {
        this.changeCaptcha()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './common.scss';
.basic-button{
  margin-top: 16px
}
.sign-block .basicInput{
  height:39px;
  font-size: 14px;
}

.changePassword .basicInput{
  margin-top: 16px;
}

.changePassword .old_password input{
  margin-top: 5px;
}
</style>
