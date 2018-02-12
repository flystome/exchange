<template>
  <div>
    <div class="btc-hint">
      <div class="text-center btc-hint-middle btc-paddingR30 btc-paddingL30">
       <div>
          <img src="~Img/Hint-success.png" class="btc-marginT55 btc-marginB35">
       </div>
       <div>
        成功开启谷歌验证
       </div>
       <div class="btc-paddingB30">
        <basic-button @click.native="PopupBoxDisplay" class="btc-marginT50" :text='"确定"'></basic-button>
       </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  methods: {
    ...mapMutations(['PopupBoxDisplay'])
  },
  computed: {
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
  }
  button{
    width: 100%;
  }
}
</style>
