<template>
  <div class="btc-container-block btc-validateIdentity">
    <header class="btc-marginB40">
        <strong>
          身份认证
        </strong>
    </header>
    <div class="row btc-marginL0 btc-marginB30">
      <div class="btc-fl">
        选择类型
      </div>
      <div class="btc-marginL100">
        <div class="btc-marginL70">
          <div class="row">
            <div class="btc-fl btc-marginR25">
              <input type="radio">
              <span>全国大陆</span>
              <img class="btc-marginL5" src="~Img/validate-china.jpg">
            </div>
            <div>
              <input type="radio">
              <span>其他国家或地区</span>
              <img class="btc-marginL5" src="~Img/validate-country.jpg">
            </div>
          </div>
            <div class="row btc-marginT15">
              请确保您使用本人的真实身份进行验证，我们会保护您的个人信息安全。
            </div>
        </div>
        <div class="row btc-marginT25">
          <news-prompt :prompt="prompt"></news-prompt>
          <div class="row">
            <span class="btc-marginR20 btc-marginL40">姓氏</span>
            <basic-input v-model="user.surname"></basic-input>
          </div>
          <div class="row btc-marginT20">
            <span class="btc-marginR20 btc-marginL40">名字</span>
            <basic-input v-model="user.name"></basic-input>
          </div>
          <div class="row btc-marginT20">
            <span class="btc-marginR20">有效身份证</span>
            <basic-input v-model="user.IdCard"></basic-input>
          </div>
        </div>
      </div>
    </div>
    <upload-img :Upload='{
        UploadExplain: "本人有效身份证正面照",
        ImgExplain: "请确保照片的内容完整并清晰可见，仅支持jpg图片格式。",
        ImgModel: "validate-indentity1.jpg"
      }'></upload-img>
    <upload-img :Upload='{
        UploadExplain: "本人身份证背面照片  ",
        ImgExplain: "请确保照片的内容完整并清晰可见，身份证必须在有效期内，仅支持jpg格式",
        ImgModel: "validate-indentity2.jpg"
      }'></upload-img>
    <upload-img :Upload='{
        UploadExplain: "手持本人身份证正面照",
        ImgExplain: "请确保照片的内容完整并清晰可见，身份证必须在有效期内，仅支持jpg格式",
        ImgModel: "validate-indentity3.jpg"
      }'></upload-img>
      <footer class="btc-b-t btc-marginT25">
        <basic-button class="btc-fr" :text='"全部提交"'>
        </basic-button>
      </footer>
  </div>
</template>

<script>
export default {
  name: 'ValidateIdentity',
  data () {
    return {
      prompt: {
        display: false,
        text: '密码错误'
      },
      user: {
        surname: '',
        name: '',
        IdCard: ''
      },
      Upload: {
        UploadExplain: '本人有效身份证正面照',
        ImgExplain: '请确保照片的内容完整并清晰可见，仅支持jpg图片格式。',
        ImgModel: 'validate-indentity1.jpg'
      }
    }
  }
}
</script>

<style lang='scss'>
@import './Identity.scss'
</style>
