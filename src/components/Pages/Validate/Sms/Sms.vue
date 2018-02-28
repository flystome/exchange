<template>
  <div class="btc-validate-sms btc-container-block">
    <header class="btc-color666">
      {{$t('validate_sms.binding_cell_phone_authentication')}}
    </header>
    <div class="btc-sms-container">
      <news-prompt :text='prompt'></news-prompt>
      <div class="btc-sms-phone">
        <basic-option v-model="phoneNumber" :data='phoneData'></basic-option>
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
      <basic-button style='width:100%' :text='$t("validate_sms.confirm")'>
      </basic-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ValidateSms',
  data () {
    return {
      prompt: '',
      phoneNumber: '+86',
      phoneData: [{
        value: '+86',
        name: '+86'
      }]
    }
  }
}
</script>

<style lang='scss'>
@import './Sms.scss'
</style>
