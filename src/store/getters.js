import { BigNumber } from 'bignumber.js'
const getters = {
  loginData: state => {
    return state.loginData
  },
  marketData: state => {
    var arr = []
    if (state.marketData.length !== 0) {
      Object.keys(state.marketData).forEach((d) => {
        state.marketData[d].forEach(data => {
          arr.push(data)
        })
      })
    }
    return arr
  },
  LockAssets: state => () => {
    return state.assets === '' ? '' : Object.keys(state.assets).reduce((num, index) => {
      var reg = /.*\..*/
      var assets = state.assets[index]
      var locked = new BigNumber(assets.locked.toString())
      var LockedBtc = locked.multipliedBy(assets.price.toString())
      var result = LockedBtc.plus(num)
      return Number(result).toFixed(Math.min((!reg.test(result) ? 0 : String(result).split('.')[1]).length, 8))
    }, 0)
  },
  TotalAssets: state => () => {
    return state.assets === '' ? '' : Object.keys(state.assets).reduce((num, index) => {
      var reg = /.*\..*/
      var assets = state.assets[index]
      var total = new BigNumber(assets.balance.toString()).plus(assets.locked.toString()).multipliedBy(assets.price.toString())
      var result = total.plus(num)
      return Number(result).toFixed(Math.min((!reg.test(result) ? 0 : String(result).split('.')[1]).length, 8))
    }, 0)
  },
  objectToFormData: (state, getters) => (obj, form, namespace) => {
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
          getters.objectToFormData(obj[property], fd, formKey)
        } else {
          // if it's a string or a File object
          fd.append(formKey, obj[property])
        }
      }
    }
    return fd
  }
}
export default getters
