<template>
  <div @keyup.enter="undoGooleVerify">
    <div class="sign-form">
      <div class="form">
        <div class="title color333">
          {{ $t('title.undo_google_verify') }}
        </div>
        <div class="input-box">
          <news-prompt :Time='3000' v-on:bind='prompt = $event' :text="prompt"></news-prompt>
          <basic-input type='password' :danger='true' ref="password" :validate='"required|password"' class="password marginB25" v-model="password" :placeholder="$t('sign.password')"></basic-input>
          <basic-input ref="verify_code" :danger='true' class='marginB25' :validate='"required|google_verify_code"' v-model="google_auth" :placeholder="$t('validate_google.google_verification_code')"></basic-input>
          <basic-button :disabled="disabled" @click.native='undoGooleVerify' class="btn marginB30" :text='$t("confirm")'></basic-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'undoGooleVerify',
  data () {
    return {
      password: '',
      google_auth: '',
      invalid: false,
      prompt: '',
      disabled: false,
      ROUTER_VERSION: process.env.ROUTER_VERSION
    }
  },
  methods: {
    async undoGooleVerify () {
      if (this.disabled) return
      /* eslint camelcase: "error" */
      const password = this.$refs['password']
      const verify_code = this.$refs['verify_code']

      const password_valid = await password.$validator.validateAll()
      if (!password_valid) {
        this.prompt = password.error
        return
      }

      const verify_code_valid = await verify_code.$validator.validateAll()
      if (!verify_code_valid) {
        this.prompt = verify_code.error
        return
      }

      this.disabled = true
      this._request({
        url: '/verify/unbind_google_auth.json',
        method: 'delete',
        data: {
          google_auth: {
            otp: this.google_auth,
          },
          password: this.password
        }
      }, (d) => {
        this.disabled = false
        if (d.data.success) {
          this.$router.push(`${this.ROUTER_VERSION}/my_account`)
          this.$store.commit('PopupBoxDisplay', {type: 'success', message: this.$t(`api_server.undo_google_verify.success_200`)})
          this.google_auth = ''
          this.password = ''
        } else {
          this.changeCaptcha()
          this.$store.commit('PopupBoxDisplay', {type: 'error', message: this.$t(`api_server.change_password.error_${d.data.error.code}`)})
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './common.scss';
.sign-form {
  .form {
    background: #ffffff;
    height: 450px;
    position: relative;
    .input-box {
      width: 360px;
      height: 180px;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -180px;
      margin-top: -90px;
    }
  }
}

.sign-block .basicInput{
  height:39px;
  font-size: 14px;
}
@media (max-width: 992px) {
  .sign-form {
    .form {
      height: 360px;
      padding: 20px 15px 0;
      .input-box {
        left: 15px;
        top: 50px;
        height: 180px;
        width: calc(100% - 30px);
        margin: 0;
      }
      .basicInput {

      }
    }
  }
}
</style>
