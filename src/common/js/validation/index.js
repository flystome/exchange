import zh from 'vee-validate/dist/locale/zh_CN'
import en from 'vee-validate/dist/locale/en'
import { Validator } from 'vee-validate'

const dictionary = {
  'zh-CN': zh,
  en
}

var empty = ['CellPhone', 'first_name', 'verify code', 'password', 'last_name']

Validator.extend = function extend (name, validator, options) {
  if ( options === void 0 ) options = {}
  if (Object.prototype.toString.call(name) === '[object Array]') {
    name.forEach((d) => {
      Validator._guardExtend(d, validator)
      Validator._merge(d, validator)
      if (options && options.hasTarget) {
        TARGET_RULES.push(d)
      }
    })
  }
Validator._guardExtend(name, validator)
Validator._merge(name, validator)
  if (options && options.hasTarget) {
    TARGET_RULES.push(name)
  }
}

Validator.extend(empty, {
  getMessage: (field, params, data) => {
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
