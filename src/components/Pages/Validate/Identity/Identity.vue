<template>
  <div class="btc-container-block btc-validateIdentity">
    <header class="title">
        <strong>
          {{$t('validate_identity.real_name_authentication')}}
        </strong>
    </header>
    <div class=" btc-marginL0">
      <div>
        <div>
          <div>
            <select class="btc-basicselect" v-model="selectedCountry">
              <option></option>
              <option v-for="country in countries" :key="country.name">{{country.name}}</option>
            </select>
            <!--<div class="btc-fl btc-marginR25">-->
              <!--<input type="radio" id="country-china" value="1" v-model="user.country">-->
              <!--<label for="country-china">韩国</label>-->
              <!--<img class="btc-marginL5" src="~Img/validate-china.jpg">-->
            <!--</div>-->
            <!--<div>-->
              <!--<input type="radio" id="country-others" value="2" v-model="user.country">-->
              <!--<label for="country-others">其他国家或者地区</label>-->
              <!--<img class="btc-marginL5" src="~Img/validate-country.jpg">-->
            <!--</div>-->
          </div>
          <div class=" btc-marginT15">
              {{$t('validate_identity.using_true_identity')}}
          </div>
        </div>
        <div class=" btc-marginT25">
          <news-prompt :prompt="prompt"></news-prompt>
            <basic-input :placeholder='$t("validate_identity.surname")' :type='"email"' v-model="user.name"></basic-input>
          <!--<div class=" btc-marginT20">-->
            <!--<span class="btc-marginR20 btc-marginL40 btc-fl">名字</span>-->
            <!--<basic-input  v-model="user.name"></basic-input>-->
          <!--</div>-->
            <basic-input  :placeholder='$t("validate_identity.name")' :type='"ip"'  v-model="user.IdCard"></basic-input>
            <basic-input  :placeholder='$t("validate_identity.valid_id_card")' :type='"ip"'  v-model="user.IdCard"></basic-input>
        </div>
      </div>
    </div>
        <upload-img class="btc-validateIdentity-uploadimg" ref="id_document_front_file_attributes" :Upload='{
            UploadExplain: $t("validate_identity.positive_identity_card_photo"),
            ImgExplain: $t("validate_identity.only_support_jpg_photo"),
            ImgModel: "validate-indentity1.png"
          }'></upload-img>
        <upload-img ref="id_document_back_file_attributes" :Upload='{
            UploadExplain: $t("validate_identity.id_card_back_photo"),
            ImgExplain: $t("validate_identity.only_support_jpg_photo"),
            ImgModel: "validate-indentity2.png"
          }'></upload-img>
        <upload-img ref="id_document_selfie_holding_file_attributes" :Upload='{
            UploadExplain: $t("validate_identity.held_ID_card"),
            ImgExplain: $t("validate_identity.only_support_jpg_photo"),
            ImgModel: "validate-indentity3.png"
          }'></upload-img>
          <upload-img ref="id_bill_file_attributes" :Upload='{
            UploadExplain: $t("validate_identity.utilities_credit_card_bills"),
            ImgExplain: $t("validate_identity.three_months_bill"),
            ImgModel: "validate-indentity4.png"
          }'></upload-img>
      <footer class="btc-b-t btc-marginT25">
        <basic-button @click.native="uploadImg" class="btc-fr col-xs-12 col-md-1 pull-right" :text='$t("validate_identity.submissions")'>
        </basic-button>
      </footer>
  </div>
</template>

<script>
import countries from '@/common/js/countries'
import {mapMutations} from 'vuex'
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
        IdCard: '',
        country: ''
      },
      countries: countries,
      selectedCountry: 'South Korea',
      identity_hint: '实名认证信息上传成功'
    }
  },
  methods: {
    objectToFormData (obj, form, namespace) {
      var fd = form || new FormData()
      var formKey
      for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
          if (namespace) {
            formKey = namespace + '[' + property + ']'
          } else {
            formKey = property
          }
          // if the property is an object, but not a File,
          // use recursivity.
          if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
            this.objectToFormData(obj[property], fd, formKey)
          } else {
            // if it's a string or a File object
            fd.append(formKey, obj[property])
          }
        }
      }
      return fd
    },
    ...mapMutations(['PopupBoxDisplay']),
    uploadImg () {
      var formData = new FormData()
      var z = this.objectToFormData({
        name: this.user.name,
        id_document_number: this.user.IdCard,
        country: this.selectedCountry,
        id_document_front_file_attributes: {
          file: this.$refs['id_document_front_file_attributes'].$refs['input'].files[0]
        },
        id_document_back_file_attributes: {
          file: this.$refs['id_document_back_file_attributes'].$refs['input'].files[0]
        },
        id_document_selfie_holding_file_attributes: {
          file: this.$refs['id_document_selfie_holding_file_attributes'].$refs['input'].files[0]
        },
        id_bill_file_attributes: {
          file: this.$refs['id_bill_file_attributes'].$refs['input'].files[0]
        }
      }, formData, 'id_document')
      this._post({
        url: '/id_document/upload_pics.json',
        data: z,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }, d => {
        if (d.data.status_code === '0') {
          this.prompt = d.data.errors
        } else {
          this.PopupBoxDisplay(this.identity_hint)
        }
      })
    }
  }
}
</script>

<style lang='scss'>
@import './Identity.scss'
</style>
