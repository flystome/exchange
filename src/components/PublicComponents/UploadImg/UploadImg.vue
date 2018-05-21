<template>
  <div @click="promptEmpty" class="btc-UploadImg">
    <div class="btc-Upload-block">
      <div>
      </div>
      <div class="btc-UploadExplain btc-marginR20 btc-marginT25">
        <strong>{{ Upload.UploadExplain }}</strong>
          <news-prompt class="btc-marginL25" :text='prompt'></news-prompt>
      </div>
      <div class=" btc-marginT20 btc-marginB20">
        {{ Upload.ImgExplain }}
      </div>
      <div class="validate-uploadImg">
        <div class="col-xs-6 btc-UploadImg-model">
          <img :src="requireImg(Upload.ImgModel)" ref="height"  >
          <span>{{$t('validate_identity.example')}}</span>
        </div>
        <div class="uploading col-xs-6 ">
          <span v-if="UploadImg === ''">{{$t('validate_identity.click_upload')}}</span>
          <img src="~Img/large/validate-uploading.png" v-if="UploadImg === ''" width="100%">
          <img width="100%" height="100%" class="alredy-img" style="z-index:10" :src="UploadImg" v-else>
          <input type="file" ref="input" style="z-index:10" @change='ShowImg'  accept="image/jpeg,image/jpg" slot="file">
        </div>
      </div>
      <news-prompt class="btc-marginL25" :text='verifyImg'></news-prompt>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UploadImg',
  props: ['Upload', 'verifyImg'],
  data () {
    return {
      UploadImg: '',
      prompt: '',
      height: ''
    }
  },
  methods: {
    promptEmpty () {
      this.prompt = ''
    },
    ShowImg (el) {
      this.$emit('prompt')
      if (el.target.files.length === 0) {
        this.UploadImg = ''
        return
      }
      if (el.target.files[0].size > 0.7 * 1024 * 1024) {
        this.prompt = `${this.$t('validate_identity.img_to_big')}700k`
        this.$refs.input.value = ''
        this.UploadImg = ''
      } else {
        var FileRead = new FileReader()
        FileRead.readAsDataURL(el.target.files[0])
        FileRead.onload = (d) => {
          var target = d.srcElement ? d.srcElement : d.target
          this.UploadImg = target.result
        }
      }
    },
    requireImg (img) {
      return require(`../../../../static/img/large/${img}`)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import './UploadImg.scss'
</style>
