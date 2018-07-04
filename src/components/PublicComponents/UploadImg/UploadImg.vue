<template>
  <div @click="promptEmpty" class="UploadImg">
    <div class="Upload-block">
      <div>
      </div>
      <div class="UploadExplain marginR20 marginT25">
        <strong>{{ Upload.UploadExplain }}</strong>
      </div>
      <div class="marginT20 marginB20">
        {{ Upload.ImgExplain }}
      </div>
      <div class="validate-uploadImg" style="overflow: hidden;">
        <div class="col-xs-6 UploadImg-model">
          <img :src="requireImg(Upload.ImgModel)" ref="height"  >
          <span>{{$t('validate_identity.example')}}</span>
        </div>
        <div class="uploading col-xs-6">
          <span v-if="UploadImg === ''">{{$t('validate_identity.click_upload')}}</span>
          <img src="~Img/large/validate-uploading.png" v-if="UploadImg === ''" width="100%">
          <img width="100%" height="100%" class="alredy-img" style="z-index:10" :src="UploadImg" v-else>
          <input type="file" ref="input" style="z-index:10" @change='ShowImg' accept="image/jpeg,image/jpg" slot="file">
        </div>
        <news-prompt class="Upload-prompt" :text='verifyImg'></news-prompt>
        <news-prompt class="Upload-prompt" :text='prompt'></news-prompt>
      </div>
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
