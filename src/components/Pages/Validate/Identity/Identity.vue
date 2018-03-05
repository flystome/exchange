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
            <basic-select :data='countries' :value="selectedCountry"  v-on:selected="selectedCountry = arguments[0]">>
            </basic-select>
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
        <div class="btc-marginT25">
          <news-prompt :prompt="prompt"></news-prompt>
            <basic-input :placeholder='$t("validate_identity.surname")' :type='"first_name"' v-model="user.first_name"></basic-input>
          <!--<div class=" btc-marginT20">-->
            <!--<span class="btc-marginR20 btc-marginL40 btc-fl">名字</span>-->
            <!--<basic-input  v-model="user.name"></basic-input>-->
          <!--</div>-->
            <basic-input  :placeholder='$t("validate_identity.name")' :type='"last_name"'  v-model="user.last_name"></basic-input>
            <basic-input  :placeholder='$t("validate_identity.valid_id_card")' :type='"IdCard"'  v-model="user.IdCard"></basic-input>
        </div>
      </div>
    </div>
    <div class="btc-indentity-prompt">
      <upload-img id="indentity1" class="btc-validateIdentity-uploadimg" ref="id_document_front_file_attributes" :Upload='{
          UploadExplain: $t("validate_identity.positive_identity_card_photo"),
          ImgExplain: $t("validate_identity.only_support_jpg_photo"),
          ImgModel: "validate-indentity1.png"
        }'
        v-on:prompt='verifymsg.indentity1 = ""'
        :verifyImg='verifymsg.indentity1'
        ></upload-img>
    </div>
    <div class="btc-indentity-prompt">
      <upload-img id="indentity2" ref="id_document_back_file_attributes" :Upload='{
        UploadExplain: $t("validate_identity.id_card_back_photo"),
        ImgExplain: $t("validate_identity.only_support_jpg_photo"),
        ImgModel: "validate-indentity2.png"
      }'
      v-on:prompt='verifymsg.indentity2 = ""'
      :verifyImg='verifymsg.indentity2'
      ></upload-img>
    </div>
    <div class="btc-indentity-prompt">
      <upload-img id="indentity3" ref="id_document_selfie_holding_file_attributes" :Upload='{
        UploadExplain: $t("validate_identity.held_id_card"),
        ImgExplain: $t("validate_identity.only_support_jpg_photo"),
        ImgModel: "validate-indentity3.png"
      }'
      v-on:prompt='verifymsg.indentity3 = ""'
      :verifyImg='verifymsg.indentity3'
      ></upload-img>
    </div>
    <div class="btc-indentity-prompt">
      <upload-img id="indentity4" ref="id_bill_file_attributes" :Upload='{
        UploadExplain: $t("validate_identity.utilities_credit_card_bills"),
        ImgExplain: $t("validate_identity.three_months_bill"),
        ImgModel: "validate-indentity4.png",
      }'
      v-on:prompt='verifymsg.indentity4 = ""'
      :verifyImg='verifymsg.indentity4'
      ></upload-img>
    </div>
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
      img: false,
      user: {
        surname: '',
        first_name: '',
        IdCard: '',
        country: '',
        last_name: ''
      },
      verifymsg: {
        indentity1: '',
        indentity2: '',
        indentity3: '',
        indentity4: ''
      },
      countries: countries,
      selectedCountry: 'South Korea',
      identity_hint: this.$t('validate_identity.information_upload_success')
    }
  },
  methods: {
    objectToFormData (obj, form, namespace) {
      /* eslint-disable no-new */
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
      if (!this.$refs['id_bill_file_attributes'].$refs['input'].files[0]) {
        document.getElementById('indentity4').scrollIntoView(true)
        this.verifymsg.indentity4 = this.$t('validate_identity.please_upload_file')
      }
      if (!this.$refs['id_document_selfie_holding_file_attributes'].$refs['input'].files[0]) {
        document.getElementById('indentity3').scrollIntoView(true)
        this.verifymsg.indentity3 = this.$t('validate_identity.please_upload_file')
      }
      if (!this.$refs['id_document_back_file_attributes'].$refs['input'].files[0]) {
        document.getElementById('indentity2').scrollIntoView(true)
        this.verifymsg.indentity2 = this.$t('validate_identity.please_upload_file')
      }
      if (!this.$refs['id_document_front_file_attributes'].$refs['input'].files[0]) {
        document.getElementById('indentity1').scrollIntoView(true)
        this.verifymsg.indentity1 = this.$t('validate_identity.please_upload_file')
      }
      var formData = new FormData()
      var z = this.objectToFormData({
        first_name: this.user.first_name,
        last_name: this.user.last_name,
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
          this.PopupBoxDisplay({message: this.identity_hint, url: '/member_center'})
        }
      })
    }
  }
}
</script>

<style lang='scss'>
@import './Identity.scss'
</style>
