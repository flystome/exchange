import { Validator } from 'vee-validate'
import i18n from '@/common/js/i18n/i18n.js'
const $t = i18n.t.bind(i18n)
const dictionary = {
  en: {
    messages: {
      required: (field) => {
        return `${field.replace('required|', '')}$validation.no_empty`
      }
    }
  }
}
Validator.localize(dictionary)
// var empty = ['First Name', 'Verify Code', 'Last Name', 'IdCard', 'CellPhone', 'Google Verify Code']

// empty.forEach(d => {
//   Validator.extend(d, {
//     getMessage () {
//       console.log(123)
//       return (data && data.validation) || 'Something went wrong'
//     },
//     validate: value => {
//       return /\S+/.test(value)
//     }
//   })
// })
var empty = ['cellphone', 'google_verify_code', 'first_name', 'last_name', 'IdCard']
empty.forEach(d => {
  Validator.extend(d, {
    getMessage (field) {
      return `${field.replace('required|', '')}$validation.no_empty`
    },
    validate: value => {
      return /\S+/.test(value)
    }
  })
})

var validation = {
  email (value) {
    var regex = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    return new Promise(resolve => {
      resolve({
        valid: regex.test(value),
      })
    })
  },
  password (value) {
    return new Promise(resolve => {
      resolve({
        valid: /.{8,}/.test(value)
      })
    })
  }
}

Object.keys(validation).forEach((key) => {
  Validator.extend(key, {
    ...{ getMessage: (field, params, data) => { return `${field.replace('required|', '')}_fail` } },
    ...{ validate: validation[key] }
  })
})

export default dictionary
