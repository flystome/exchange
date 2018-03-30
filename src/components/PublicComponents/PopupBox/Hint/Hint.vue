<template>
  <div>
    <div class="btc-hint">
      <div class="text-center btc-hint-middle btc-paddingR30 btc-paddingL30">
       <div style="magin:auto 0">
          <img v-if="PopupBox.type === 'success' " src="~Img/Hint-success.png" class="btc-marginT55 btc-marginB35">
          <img v-else-if="PopupBox.type === 'warn'" src="~Img/Hint-warn.png" class="btc-marginT55 btc-marginB35">
          <self-building-square-spinner
          v-else-if="PopupBox.type === 'loading'"
          class="btc-marginT55 btc-marginB35 btc-hint-loading"
          :animation-duration="6000"
          :size="45"
          color="#3e81ff"
          />
          <img v-else src="~Img/Hint-error.png" class="btc-marginT55 btc-marginB35">
       </div>
       <div>
         {{this.PopupBox.message}}
       </div>
       <div class="btc-paddingB30">
        <span style="display:flex">
          <basic-button @click.native.stop="gopath(true)" style="margin-right: 28px;" v-if='PopupBox.confirm'  class="btn btc-marginT50"  :text='$t(`hint.yes`)' :class="{'btc-hint-hidden': !this.PopupBox.buttondisplay}">
          </basic-button>
          <basic-button @click.native.stop="gopath"  class="btn btc-marginT50"  :text='buttonText' :class="{'btc-hint-hidden': !this.PopupBox.buttondisplay}">
          </basic-button>
        </span>
       </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SelfBuildingSquareSpinner } from 'epic-spinners'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'Hint',
  data () {
    return {
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      HOST_URL: process.env.HOST_URL
    }
  },
  methods: {
    gopath (href) {
      if (this.PopupBox.confirm && href === true) location.href = `${this.HOST_URL}/tickets`
      this.ChangePopupBox({
        confirm: false,
        buttonText: '',
      })
      if (this.PopupBox.url) {
        this.$router.replace(`${this.ROUTER_VERSION}${this.PopupBox.url}`)
      }
      this.ChangePopupBox({
        status: false
      })
    },
    ...mapMutations(['PopupBoxDisplay', 'ChangePopupBox'])
  },
  computed: {
    buttonText () {
      return this.PopupBox.buttonText ? this.PopupBox.buttonText : this.$t('hint.confirm')
    },
    ...mapState(['PopupBox'])
  },
  components: {
    SelfBuildingSquareSpinner
  }
}
</script>

<style lang="scss" scoped>
.btc-hint{
  margin-top: 203px;
  z-index: 3;
  .btc-hint-middle{
    width: 360px;
    background: #ffffff;
    position: relative;
    margin: 0 auto;
    box-shadow:0 0 30px #bbbbbb;
    z-index: 99999;
  }
  .btc-hint-hidden{
    visibility: hidden;
  }
  button{
    width: 100%;
  }
  .btc-hint-loading{
    margin: 0 auto;
    margin-bottom: 78px;
    top: 45px!important;
    position: relative;
  }
}
</style>
