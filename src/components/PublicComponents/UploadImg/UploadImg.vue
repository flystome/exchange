<template>
  <div @click="promptEmpty" class="btc-UploadImg">
    <div class="btc-Upload-block">
      <div>
        <!-- <basic-button :text='"点击上传"'>

        </basic-button> -->

      </div>
      <div class="btc-UploadExplain btc-marginR20 btc-marginT50">
        <strong>{{ Upload.UploadExplain }}</strong>
          <news-prompt class="btc-marginT25 btc-marginL25" :text='prompt'></news-prompt>
      </div>
      <div class=" btc-marginT20 btc-marginB20">
        {{ Upload.ImgExplain }}
      </div>
      <div class="validate-uploadImg">
        <img class="btc-UploadImg-model col-xs-6" :src="requireImg(Upload.ImgModel)">
        <div class="uploading col-xs-6">
          <img src="~Img/validate-uploading.png" v-if="UploadImg === ''" width="100%">
          <img width="100%" height="100%" :src="UploadImg" v-else>
          <input type="file" ref="input"  @change='ShowImg'  accept="image/jpeg,image/jpg" slot="file">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UploadImg',
  props: ['Upload'],
  data () {
    return {
      UploadImg: '',
      prompt: ''
    }
  },
  methods: {
    promptEmpty () {
      this.prompt = ''
    },
    ShowImg (el) {
      if (el.target.files[0].size > 2 * 1024 * 1024) {
        this.prompt = '图片不允许超过2m'
      } else {
        var FileRead = new FileReader()
        FileRead.readAsDataURL(el.target.files[0])
        FileRead.onload = (d) => {
          this.UploadImg = d.srcElement.result
        }
      }
    },
    requireImg (img) {
      return require(`../../../../static/img/${img}`)
    }
  }
}
</script>

<style lang="scss">
  @import './UploadImg.scss'
</style>
