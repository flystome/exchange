import { BigNumber } from 'bignumber.js'
import i18n from '@/common/js/i18n/i18n.js'
import { constructArgumentList } from 'node-notifier/lib/utils';
var Validator = VeeValidate.Validator
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

var getMessage = (field, params, data) => {

  return `${field.replace('required|', '')}_fail`
}

var empty = ['empty_password', 'cellphone', 'google_verify_code', 'first_name', 'withdraw_address', 'last_name', 'IdCard', 'verify_code', 'sms_verification_code']
empty.forEach(d => {
  Validator.extend(d, {
    getMessage,
    validate: value => {
      return /\S+/.test(value)
    }
  })
})

var validation = {
  email (value) {
    var regex = /^\s*[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+\s*$/
    return new Promise(resolve => {
      resolve({
        valid: regex.test(value),
      })
    })
  },
  password (value) {
    return new Promise(resolve => {
      if (!(/.{8,}/.test(value) && /[a-zA-Z]/.test(value) && /\d/.test(value))) {
        resolve({
          valid: false
        })
      } else {
        resolve({
          valid: true
        })
      }
      // resolve({
      //   valid: /.{8,}/.test(value)
      // })
    })
  }
}

Object.keys(validation).forEach((key) => {
  Validator.extend(key, {
    ...{ getMessage: getMessage },
    ...{ validate: validation[key] }
  })
})

Validator.extend('withdraw_amount', {
  getMessage (field, params, data) {
    return data
  },
  validate (value) {
    return new Promise(resolve => {
      try {
        new BigNumber(value.toString())
        resolve({
          valid: true
        })
      } catch (e) {
        resolve({
          data: 'withdraw_amount_NaN',
          valid: false
        })
      }
      // if (num.isNaN()) {
      //   resolve({
      //     messages: 'withdraw_amount_NaN',
      //     valid: false
      //   })
      // }
    })
  }
})

export default dictionary
