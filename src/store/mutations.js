import router from '@/router'
import axios from 'axios'
import i18n, { CookieLocale } from '@/common/js/i18n/i18n.js'
import Cookies from 'js-cookie'

const ROUTER_VERSION = process.env.ROUTER_VERSION
const HOST_URL = process.env.HOST_URL

export const redirect = (state, action, route) => {
  // var route = type ? state.route.from.name : state.route.name
  // var path = type ? state.route.from.path : state.route.path
  // i18n.locale = CookieLocale
  var flag = true
  // if (state.two_factors) {
  //    router.push({path: `${ROUTER_VERSION}/login/verify`})
  //   return false
  // }
  switch (route.name) {
    case 'ValidateGoogle':
      if (!state.loginData.activated) {
        action.commit('PopupBoxDisplay', {message: i18n.t('my_account.1001_hint'), type: 'warn', url: '/my_account'})
        flag = false
        return
      } else if (state.loginData.app_activated) {
        router.replace(`${ROUTER_VERSION}/my_account`)
      }
      break
    case 'ValidateSms':
      if (!state.loginData.activated) {
        action.commit('PopupBoxDisplay', {message: i18n.t('my_account.1001_hint'), type: 'warn', url: '/my_account'})
        flag = false
      } else if (state.loginData.sms_activated) {
        router.replace({path: `${ROUTER_VERSION}/my_account`})
      }
      break
    case 'ValidateIdentity':
      if (!state.loginData.activated) {
        action.commit('PopupBoxDisplay', {message: i18n.t('my_account.1001_hint'), type: 'warn', url: '/my_account'})
        flag = false
        return
      } else if (!(state.loginData.sms_activated || state.loginData.app_activated)) {
        action.commit('PopupBoxDisplay', {message: i18n.t('my_account.1002_hint'), type: 'warn', url: '/my_account'})
        flag = false
      } else if (state.loginData.id_document.aasm_state !== 'unverified') {
        router.replace({path: `${ROUTER_VERSION}/my_account`})
      }
      break
    case 'WithdrawCurrency':
    if (/withdraw/.test(route.path)) {
      var code = ''
      if (!state.loginData.activated) {
        code = 1001
      } else if (!(state.loginData.app_activated || state.loginData.sms_activated))  {
        if (typeof(hotex_android) != 'undefined') {
          router.push(`${ROUTER_VERSION}/funds/deposit`)
          hotex_android.toRedirect('/my_account')
          return
        } else if (window.webkit) {
          window.webkit.messageHandlers.nativeToHome.postMessage({
            href: '/my_account',
            event: 'redirect'
          })
          return
        }
        code = 1002
      }
      if (code) {
        flag = false
        action.commit('PopupBoxDisplay', {message: i18n.t(`my_account.${code}_hint`) , type: 'warn' ,url: '/my_account'})
      }
    } else if (/deposit/.test(route.path)) {
      if (!state.loginData.activated) {
        flag = false
        action.commit('PopupBoxDisplay', {message: i18n.t('my_account.1001_hint') , type: 'warn' ,url: '/my_account'})
        return
      }
    }
    break
    case 'ApiIndex':
    case 'ApiNew':
    case 'ApiEdit':
    if (!state.loginData.app_activated) {
      flag = false
      action.commit('PopupBoxDisplay', {message: i18n.t(`my_account.1004_hint`) , type: 'warn' ,url: '/my_account'})
      return
    }
    if (state.loginData.id_document.aasm_state !== 'verified') {
      flag = false
      action.commit('PopupBoxDisplay', {message: i18n.t(`my_account.1003_hint`) , type: 'warn' ,url: '/my_account'})
    }
    break
    case 'SignUp':
    case 'SignIn':
    case 'ForgotPassword':
    if (state.loginData !== 'none') {
      router.replace({path: `/`})
    }
    break
  }
  return flag
}

const mutations = {
  redirect (state, route) {
    redirect(state, this, route)
  },
  gotoPc (state) {
    state.Pc = true
  },
  getData (state, data) {
    // data.data.profit = data.data.profit.concat(new Array(200).fill('').map((b, index) => {
    //   return {
    //     usdt_gains: 2.54645445 + index * 1000000000,
    //     btc_gains: 3.54645445 + index * 10000000000,
    //     timestamp: (new Date().getTime()) + ((index + 1) * 86400000)
    //   }
    // }))
    state.loginData = data.data
    state.assets = data.data.assets
  },
  AddAddress (state, data) {
    var address = state.DepositAddress
    address[data.attributes.account_id] = data.attributes.deposit_address
  },
  PopupBoxDisplay (state, obj) {
    if (!obj) {
      obj = {
        type: 'success',
        url: '',
        message: ''
      }
    }
    state.PopupBox.largeWidth = obj.largeWidth
    state.PopupBox.confirm = obj.confirm
    state.PopupBox.type = obj.type
    state.PopupBox.status = !state.PopupBox.status
    state.PopupBox.message = obj && obj.message
    // if (!obj.buttondisplay)  state.PopupBox.buttondisplay = true
    obj && obj.url ? state.PopupBox.url = obj.url : state.PopupBox.url = ''
  },
  ChangeLanguage (state, lang) {
    state.language = lang
    i18n.locale = lang
    Cookies.set('locale', lang)
  },
  ChangePopupBox (state, obj) {
    ({
      type: state.PopupBox.type,
      status: state.PopupBox.status,
      message: state.PopupBox.message,
      buttondisplay: state.PopupBox.buttondisplay,
      buttonText: state.PopupBox.buttonText,
      url: state.PopupBox.url,
      href: state.PopupBox.href,
      confirm: state.PopupBox.confirm,
      largeWidth: state.PopupBox.largeWidth
    } = {
      type: obj.type ? obj.type : state.PopupBox.type,
      url: obj.url ? obj.url : state.PopupBox.url,
      status: obj.hasOwnProperty('status') ? obj.status : state.PopupBox.status,
      message: obj.message ? obj.message : state.PopupBox.message,
      href: obj.href ? obj.href : state.PopupBox.href,
      buttonText: obj.buttonText !== undefined ? obj.buttonText : state.PopupBox.buttonText,
      confirm: obj.hasOwnProperty('confirm') ? obj.confirm : state.PopupBox.confirm,
      buttondisplay: Object.keys(obj).includes('buttondisplay') ? obj.buttondisplay : state.PopupBox.buttondisplay,
      largeWidth: obj.hasOwnProperty('largeWidth') ? obj.largeWidth : state.PopupBox.largeWidth
    })
  },
  SideSlipMenuDisplay (state, type) {
    state.SideSlipMenu = type
  },
  GetMarketData (state, data) {
    // data.geographic_location = {
    //   "request": "127.0.0.1",
    //   "ip": "173.194.112.35",
    //   "country_code2": "US",
    //   "country_code3": "USA",
    //   "country_name": "United States",
    //   "continent_code": "NA",
    //   "region_name": "CA",
    //   "city_name": "Mountain View",
    //   "postal_code": "94043",
    //   "latitude": 37.41919999999999,
    //   "longitude": -122.0574,
    //   "dma_code": 807,
    //   "area_code": 650,
    //   "timezone": "America/Los_Angeles",
    //   "real_region_name": "California"
    //   }
    state.Location = data.geographic_location && { ...data.geographic_location }
    delete data.current_user
    delete data.geographic_location
    delete data.code
    state.marketData = data
  },
  GetCmsUrl (state) {
    axios.get(`${HOST_URL}/cms/api/url_mapping`).then(d => {
      state.CmsUrl = d.data
    })
  }
}

export default mutations
