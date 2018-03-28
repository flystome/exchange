import router from '@/router'
import i18n from '@/common/js/i18n/i18n.js'
import Cookies from 'js-cookie'
const ROUTER_VERSION = process.env.ROUTER_VERSION

const redirect = (state, action, type) => {
  var route = type ? state.route.from.name : state.route.name
  var path = type ? state.route.from.path : state.route.path
  i18n.locale = Cookies.get('locale') ? Cookies.get('locale') : 'en'
  switch (route) {
    case 'ValidateGoogle':
      if (!state.loginData.activated) {
        action.commit('PopupBoxDisplay', {message: i18n.t('my_account.1001_hint'), type: 'warn', url: '/my_account'})
      } else if (state.loginData.app_activated) {
        router.replace(`${ROUTER_VERSION}/`)
      }
      break
    case 'ValidateSms':
      if (!state.loginData.activated) {
        action.commit('PopupBoxDisplay', {message: i18n.t('my_account.1001_hint'), type: 'warn', url: '/my_account'})
      } else if (state.loginData.sms_activated) {
        router.replace({path: `${ROUTER_VERSION}/`})
      }
      break
    case 'ValidateIdentity':
      if (!state.loginData.activated) {
        action.commit('PopupBoxDisplay', {message: i18n.t('my_account.1001_hint'), type: 'warn', url: '/my_account'})
        return
      } else if (!(state.loginData.sms_activated || state.loginData.app_activated)) {
        action.commit('PopupBoxDisplay', {message: i18n.t('my_account.1002_hint'), type: 'warn', url: '/my_account'})
      } else if (state.loginData.id_document.aasm_state !== 'unverified') {
        router.replace({path: `${ROUTER_VERSION}/`})
      }
      break
    case 'WithdrawCurrency':
    if (/withdraw/.test(state.route.path)) {
      var code = ''
      if (!state.loginData.activated) {
        code = 1001
      } else if (!(state.loginData.app_activated || state.loginData.sms_activated))  {
        code = 1002
      }
      if (code) {
        action.commit('PopupBoxDisplay', {message: i18n.t(`my_account.${code}_hint`) , type: 'warn' ,url: '/my_account'})
      }
    } else if (/deposit/.test(state.route.path)) {
      if (!state.loginData.activated) {
        action.commit('PopupBoxDisplay', {message: i18n.t('my_account.1001_hint') , type: 'warn' ,url: '/my_account'})
        return
      }
    }
    break
  }
}

const mutations = {
  redirect (state, type) {
    redirect(state, this, type)
  },
  // changeMarket (state, { index, currency }) {
  //   state.
  // },
  getData (state, data) {
    // data.data.referrals.map((d, index) => {
    //   d['referrals_account_name'] = data.data.referrals_account_name[index]
    // })
    state.loginData = data.data
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
    state.PopupBox.type = obj.type
    state.PopupBox.status = !state.PopupBox.status
    state.PopupBox.message = obj && obj.message
    // if (!obj.buttondisplay)  state.PopupBox.buttondisplay = true
    obj && obj.url ? state.PopupBox.url = obj.url : state.PopupBox.url = ''
  },
  ChangeLanguage (state, lang) {
    state.language = lang
  },
  ChangePopupBox (state, obj) {
    ({
      type: state.PopupBox.type,
      status: state.PopupBox.status,
      message: state.PopupBox.message,
      buttondisplay: state.PopupBox.buttondisplay,
      url: state.PopupBox.url
    } = {
      type: obj.type ? obj.type : state.PopupBox.type,
      url: obj.url ? obj.url : state.PopupBox.url,
      status: obj.hasOwnProperty('status') ? obj.status : state.PopupBox.status,
      message: obj.message ? obj.message : state.PopupBox.message,
      buttondisplay: Object.keys(obj).includes('buttondisplay') ? obj.buttondisplay : state.PopupBox.buttondisplay
    })
  },
  SideSlipMenuDisplay (state, type) {
    state.SideSlipMenu = type
  },
  GetMarketData (state, data) {
    delete data.current_user
    delete data.code
    state.marketData = data
  }
}

export default mutations
