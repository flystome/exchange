import vEn from '@/common/js/i18n/en.js'
import vZh from '@/common/js/i18n/zh-CN.js'
import { Validator } from 'vee-validate'
const dictionary = {
  en: {
    messages: vEn.en.validation
  },
  'zh-CN': {
    messages: vZh.validation
  }
}

Validator.extend('CellPhone', {
  getMessage (field, params, data) {
    return (data && data.validation) || 'Something went wrong'
  },
  validate: value => {
    return value.length === 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
  }
})

export default dictionary
