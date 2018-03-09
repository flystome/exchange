<template>
  <div>
    <div class="btc-hint">
      <div class="text-center btc-hint-middle btc-paddingR30 btc-paddingL30">
       <div>
          <img v-if="PopupBox.type === 'success' " src="~Img/Hint-success.png" class="btc-marginT55 btc-marginB35">
          <img v-else-if="PopupBox.type === 'warn'" src="~Img/Hint-warn.png" class="btc-marginT55 btc-marginB35">
          <img v-else src="~Img/Hint-error.png" class="btc-marginT55 btc-marginB35">
       </div>
       <div>
         {{this.PopupBox.message}}
       </div>
       <div class="btc-paddingB30">
        <a @click.stop="gopath">
          <basic-button class="btc-marginT50" :text='buttonText' :class="{'btc-hint-hidden': !this.PopupBox.buttondisplay}">
          </basic-button>
        </a>
       </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'Hint',
  methods: {
    gopath () {
      if (this.PopupBox.url) {
        this.$router.push(this.PopupBox.url, () => { this.$store.dispatch('getData') })
      }
      this.PopupBoxDisplay()
    },
    ...mapMutations(['PopupBoxDisplay'])
  },
  computed: {
    buttonText () {
      return this.PopupBox.buttonText ? this.PopupBox.buttonText : this.$t('hint.confirm')
    },
    ...mapState(['PopupBox'])
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
}
</style>
