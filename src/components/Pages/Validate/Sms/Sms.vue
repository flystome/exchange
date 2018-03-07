<template>
  <div class="btc-validate-sms btc-container-block">
    <header class="btc-color666">
      {{$t('validate_sms.binding_cell_phone_authentication')}}
    </header>
    <div class="btc-sms-container">
      <news-prompt :text='prompt'></news-prompt>
      <div class="btc-sms-phone">
        <!-- <basic-select v-model="phoneNumber" :data='phoneData'></basic-select> -->
        <div class="btc-sms-choice btc-b-def">
          +
          <div class="" contenteditable="true" ></div>
        </div>
        <basic-input :type='"CellPhone"' :placeholder='$t("placeholder.cell_phone_number")'>
        </basic-input>
      </div>
      <div class="btc-sms-code">
        <basic-input :type='"phone"' :placeholder='$t("placeholder.cell_phone_number")'>
        </basic-input>
        <button class="btc-white-btn">
          {{$t('validate_sms.send_identify_code')}}
        </button>
      </div>
      <basic-button @click="ValidateSms" style='width:100%' :text='$t("validate_sms.confirm")'>
      </basic-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ValidateSms',
  data () {
    return {
      HOST_URL: process.env.HOST_URL,
      prompt: '',
      phoneNumber: '+86',
      phoneData: Array(7).fill('+86')
    }
  },
  methods: {
    ValidateSms () {
      this._post({
        url: `${this.HOST_URL}/fefe`,
        data: {
        }
      }, (d) => {
        console.log(d.data)
      })
    }
  }
}
</script>

<style lang='scss'>
@import './Sms.scss'
</style>
