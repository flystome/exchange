import zh_TW from 'vee-validate/dist/locale/zh_TW'
import en from 'vee-validate/dist/locale/en'
import { Validator } from 'vee-validate'
import i18n from '@/common/js/i18n/i18n.js'

const dictionary = {
  'zh-TW': zh_TW,
  en: en
}
Validator.localize(dictionary)

var empty = ['First Name', 'verify_code', 'password', 'Last Name', 'IdCard', 'CellPhone', 'google_verify_code']

empty.forEach(d => {
  Validator.extend(d, {
    getMessage: (field, params, data) => {
      return (data && data.validation) || 'Something went wrong'
    },
    validate: value => {
      return /\S+/.test(value)
    }
  })
})

Validator.extend('aa', {
  getMessage: (field, params, data) => {
    return (data && data.validation) || 'Something went wrong'
  },
  validate: value => false
})


Validator.extend('bb', {
  getMessage: (field, params, data) => {
    return (data && data.validation) || 'Something went wrong'
  },
  validate: value => false
})

// Validator.extend('IdCard', {
//   getMessage (field, params, data) {
//     // return (data && data.validation) || 'Something went wrong'
//   },
//   validate: value => {
//     return /[a-zA-z\d]{5,}/.test(value)
//   }
// })

export default dictionary
