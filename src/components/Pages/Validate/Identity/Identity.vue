<template>
  <div
  v-if="!(loginData.id_document && loginData.id_document.aasm_state !=='unverified') && (loginData.sms_activated || loginData.app_activated) &&  loginData.activated"
  class="btc-container-block btc-validateIdentity"
  @keyup.enter="uploadImg">
    <header class="title">
        <router-link :to="`${ROUTER_VERSION}/my_account`" class="btc-link">
          {{$t('title.my_account')}}
        </router-link>
        >
        <span>
          {{$t('title.validate_identity')}}
        </span>
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
            <basic-input style="min-height:66px"  ref='first_name' :placeholder='$t("validate_identity.surname")' :validate='"First Name"' v-model="user.first_name"></basic-input>
          <!--<div class=" btc-marginT20">-->
            <!--<span class="btc-marginR20 btc-marginL40 btc-fl">名字</span>-->
            <!--<basic-input  v-model="user.name"></basic-input>-->
          <!--</div>-->
            <basic-input style="min-height:66px"  ref='last_name' :placeholder='$t("validate_identity.name")' :validate='"Last Name"'  v-model="user.last_name"></basic-input>
            <basic-input style="min-height:66px"  ref="IdCard"  :placeholder='$t("validate_identity.valid_id_card")' :validate='"IdCard"'  v-model="user.IdCard"></basic-input>
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
      <basic-button id="myButton" data-loading-text="Loading..." autocomplete="off" @click.native.enter="uploadImg" class="btn btc-fr col-xs-12 col-md-1 pull-right" :disabled="disabled" :text='$t("validate_identity.submissions")'>
      </basic-button>
    </footer>
  </div>
</template>

<script>
import { countries } from '@/common/js/countries'
import { mapMutations, mapGetters } from 'vuex'
export default {
  name: 'ValidateIdentity',
  // updated () {
  //   if (this.redirectLock) return
  //   if (this.$store.state.loginData) {
  //     this.redirectLock = true
  //     this.$store.dispatch('redirect')
  //   }
  // },
  data () {
    return {
      prompt: {
        display: false,
        text: '密码错误'
      },
      disabled: false,
      redirectLock: false,
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
      ROUTER_VERSION: process.env.ROUTER_VERSION,
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
    ...mapMutations(['PopupBoxDisplay', 'ChangePopupBox']),
    async uploadImg () {
      const first = await this.$refs['first_name'].$validator.validateAll()
      const last = await this.$refs['last_name'].$validator.validateAll()
      const IdCard = await this.$refs['IdCard'].$validator.validateAll()
       if (!first || !last || !IdCard) {
        this.$refs['first_name'].$el.scrollIntoView(true)
        return
      }
      const bill = this.$refs['id_bill_file_attributes']
      const billFile = bill.$refs['input'].files[0]
      const holding = this.$refs['id_document_selfie_holding_file_attributes']
      const holdingFile = holding.$refs['input'].files[0]
      const back = this.$refs['id_document_back_file_attributes']
      const backF = back.$refs['input'].files[0]
      const front = this.$refs['id_document_front_file_attributes']
      const frontF = front.$refs['input'].files[0]
      bill.promptEmpty()
      holding.promptEmpty()
      back.promptEmpty()
      front.promptEmpty()
      if (!billFile) {
        document.getElementById('indentity4').scrollIntoView(true)
        this.verifymsg.indentity4 = this.$t('validate_identity.please_upload_file')
      }
      if (!holdingFile) {
        document.getElementById('indentity3').scrollIntoView(true)
        this.verifymsg.indentity3 = this.$t('validate_identity.please_upload_file')
      }
      if (!backF) {
        document.getElementById('indentity2').scrollIntoView(true)
        this.verifymsg.indentity2 = this.$t('validate_identity.please_upload_file')
      }
      if (!frontF) {
        document.getElementById('indentity1').scrollIntoView(true)
        this.verifymsg.indentity1 = this.$t('validate_identity.please_upload_file')
      }

      if (!first || !last || !IdCard || !billFile || !holdingFile || !backF || !frontF) {
        return
      }
      this.disabled = true

      var timer = ''
      this.PopupBoxDisplay({type: 'loading', message: this.$t('validate_identity.uploading_photos')})
      this.ChangePopupBox({buttondisplay: false})
      timer = setTimeout(() => {
        this.ChangePopupBox({
          message: this.$t('hint.go_tickets'),
          type: 'error',
          confirm: true,
          buttonText: this.$t('hint.no'),
          buttondisplay: true
        })
        // setTimeout(() => {
        //   this.PopupBoxDisplay()
        //   this.ChangePopupBox({
        //     buttondisplay: true
        //   })
        // }, 1000)
        this.disabled = false
      }, 10000)
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
        this.disabled = false
        if (d.data.success) {
          clearTimeout(timer)
          this.ChangePopupBox({message: this.$t('api_server.validate_identity.success_200'), url: '/my_account', type: 'success', buttondisplay: true})
          this.$store.dispatch('getData')
        } else {
          clearTimeout(timer)
          this.ChangePopupBox({message: this.$t('api_server.validate_identity.error_1001'), type: 'error', buttondisplay: true})
        }
      })
    }
  },
  computed: {
    ...mapGetters(['loginData'])
  },
  filters: {
    maxlen (str) {
      return str.match(/.{8}/)
    }
  },
  watch: {
    // $route (to) {
    //   if (/identity/.test(this.$route.path)) {
    //      this.$store.dispatch('redirect')
    //   }
    // }
  }
}
</script>

<style lang='scss' scoped>
@import './Identity.scss'
</style>
