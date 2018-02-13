<template>
  <div @click="promptEmpty" class="btc-UploadImg">
    <div class="btc-UploadExplain btc-marginR20 btc-marginT45">
      {{ Upload.UploadExplain }}
    </div>
    <div class="btc-Upload-block">
      <div class="row">
        <basic-button :text='"点击上传"'>
          <input type="file" ref="input"  @change='ShowImg'  accept="image/jpeg,image/jpg" slot="file">
        </basic-button>
        <news-prompt class="btc-marginT25 btc-marginL25" :text='prompt'></news-prompt>
      </div>
      <div class="row btc-marginT20 btc-marginB20">
        {{ Upload.ImgExplain }}
      </div>
      <div class="row">
        <img src="~Img/validate-uploading.jpg" v-if="UploadImg === ''">
        <img width="320" height="200" :src="UploadImg" v-else>
        <img class="btc-UploadImg-model btc-marginL100" :src="requireImg(Upload.ImgModel)">
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
