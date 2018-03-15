<template>
  <div class="btc-boot btc-paddingT80 btc-paddingB80">
    <div class="text-center btc-marginT100">
      <img src="~Img/bootvaildate.png" alt="" class="btc-marginB20">
      <div v-if="!loginData.activated">
        <p class="">{{ $t("prompt.email_not_certified") }}</p>
        <p class="btc-marginB50">{{ $t("prompt.not_certified_prompt") }}</p>
      </div>
      <div v-else-if="!loginData.sms_activated">
        <p class="">{{ $t("prompt.phone_not_certified") }}</p>
        <p class="btc-marginB50">{{ $t("prompt.not_certified_prompt") }}</p>
      </div>
      <div v-else-if="!loginData.id_document.aasm_state === 'verified'">
        <p class="">{{ $t("prompt.google_not_certified") }}</p>
        <p class="btc-marginB50">{{ $t("prompt.not_certified_prompt") }}</p>
      </div>
      <basic-button @click.native="goPath('/member_center')" style="width:26%" class="btc-button" :text='$t("prompt.go_validate")'></basic-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Prompt',
  data () {
    return {
      ROUTER_VERSION: process.env.ROUTER_VERSION
    }
  },
  methods: {
    goPath (path, status, href) {
      if (status) {
        return
      }
      if (href) {
        location.href = `${this.HOST_URL}${this.ROUTER_VERSION}${path}`
      }
      this.$router.push({
        path: `${this.ROUTER_VERSION}${path}`
      })
    }
  },
  computed: {
    ...mapGetters(['loginData'])
  }
}
</script>
<style scoped lang="scss">
@import "./Prompt.scss"
</style>
