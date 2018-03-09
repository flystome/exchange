<template>
  <div class="btc-boot btc-paddingT80">
    <div class="text-center btc-marginT100">
      <img src="~Img/bootvaildate.png" alt="" class="btc-marginB20">
      <div v-if="!loginData.activated">
        <p class="">邮箱未验证</p>
        <p class="btc-marginB50">Help keep the bad guys out of your account by using both your phone</p>
      </div>
      <div v-else-if="!loginData.sms_activated">
        <p class="">手机号未验证</p>
        <p class="btc-marginB50">Help keep the bad guys out of your account by using both your phone</p>
      </div>
      <div v-else-if="!loginData.id_document.aasm_state === 'verified'">
        <p class="">未实名认证</p>
        <p class="btc-marginB50">Help keep the bad guys out of your account by using both your phone</p>
      </div>
      <basic-button @click.native="goPath('/member_center')" style="width:26%" class="btc-button" :text='"去验证"'></basic-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'BootValidate',
  methods: {
    goPath (path, status, href) {
      if (status) {
        return
      }
      if (href) {
        location.href = `${this.HOST_URL}${path}`
      }
      this.$router.push({
        path: path
      })
    }
  },
  computed: {
    ...mapGetters(['loginData'])
  }
}
</script>
<style scoped lang="scss">
@import "./BootValidate.scss"
</style>
