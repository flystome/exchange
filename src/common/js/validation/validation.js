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
    return /\S+/.test(value)
  }
})

Validator.extend('first_name', {
  getMessage (field, params, data) {
    return (data && data.validation) || 'Something went wrong'
  },
  validate: value => {
    return /\S+/.test(value)
  }
})

Validator.extend('last_name', {
  getMessage (field, params, data) {
    return (data && data.validation) || 'Something went wrong'
  },
  validate: value => {
    return /\S+/.test(value)
  }
})
Validator.extend('IdCard', {
  getMessage (field, params, data) {
    return (data && data.validation) || 'Something went wrong'
  },
  validate: value => {
    return /[a-zA-z\d]{5,}/.test(value)
  }
})

export default dictionary
