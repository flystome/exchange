<template>
  <div class="btc-login btc-container-block">
    <div class="title">
      <strong>
        注册新账户
      </strong>
    </div>
    <form class="form-signin">
      <label>{{ error }}</label>
      <basic-input placeholder='邮箱'></basic-input>
      <basic-input placeholder='登录密码'></basic-input>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      error: '',
      data: {
        emali: '',
        password: '',
        confirmPassword: ''
      }
    }
  }
}
</script>

<style lang="scss">
@import "./Login.scss"
</style>
