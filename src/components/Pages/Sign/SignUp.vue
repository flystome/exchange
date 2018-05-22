<template>
  <div class="btc-signUp btc-sign-block">
    <div class="btc-sign-form">
      <header class="text-center">
        <img src="~Img/large/sign-logo.png">
      </header>
      <div class="form">
        <div class="title btc-color333">
          {{ $t('sign.login_account') }}
        </div>
        <news-prompt :text="prompt"></news-prompt>
        <basic-input :placeholder="$t('sign.email_address')"></basic-input>
        <basic-input v-model="password" class="btc-marginT15" :placeholder="$t('sign.login_password')"></basic-input>
        <basic-input v-model="password1" :validate='`confirmed:${password}|password`' :placeholder="$t('sign.confirm_password')"></basic-input>
        <basic-input :placeholder="$t('validation.verify_code')"></basic-input>
        <basic-button :text='$t("nav.register")'></basic-button>
        <div class="form-footer">
          <span class="btc-fr">{{$t('sign.already_registered')}}<router-link :to='`${ROUTER_VERSION}/login`' class="btc-link">{{$t('sign.log_in')}}</router-link></span>
          <div class="clearfix"></div>
        </div>
      </div>
    </div>
    <footer class="btc-font12 btc-marginT30 text-center" style="color: #9b9b9b">
      <div>© 2018 hotex.com All Rights Reserved</div>
      <div class="btc-marginT5">{{$t('sign.official_website')}}：www.hotex.com {{$t('sign.official_email')}}：support@hotex.com</div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'SignUp',
  data () {
    return {
      password: '',
      password1: '',
      SignUpData: {

      },
      prompt: '',
      ROUTER_VERSION: process.env.ROUTER_VERSION
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
  margin-top: 16px
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
</style>
