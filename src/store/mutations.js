import router from '@/router'
import i18n from '@/common/js/i18n/i18n.js'
import Cookies from 'js-cookie'
const ROUTER_VERSION = process.env.ROUTER_VERSION

const redirect = (state, action) => {
  var route = state.route.name
  i18n.locale = Cookies.get('locale')
  switch (route) {
    case 'ValidateGoogle':
    console.log(1)
      if (!state.loginData.activated) {
        action.commit('PopupBoxDisplay', {message: i18n.t('member_center.1001_hint'), type: 'warn', url: `${ROUTER_VERSION}/`})
      } else if (state.loginData.app_activated) {
        router.push({path: `${ROUTER_VERSION}/`})
      }
      break
    case 'ValidateSms':
      if (!state.loginData.activated) {
        action.commit('PopupBoxDisplay', {message: i18n.t('member_center.1001_hint'), type: 'warn', url: `${ROUTER_VERSION}/`})
      } else if (state.loginData.sms_activated) {
        router.push({path: `${ROUTER_VERSION}/`})
      }
      break
    case 'ValidateIdentity':
      if (!state.loginData.activated) {
        action.commit('PopupBoxDisplay', {message: i18n.t('member_center.1001_hint'), type: 'warn', url: `${ROUTER_VERSION}/`})
        return
      } else if (!(state.loginData.sms_activated || state.loginData.app_activated)) {
        action.commit('PopupBoxDisplay', {message: i18n.t('member_center.1002_hint'), type: 'warn', url: `${ROUTER_VERSION}/`})
      } else if (state.loginData.id_document.aasm_state !== 'unverified') {
        router.push({path: `${ROUTER_VERSION}/`})
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
        action.commit('PopupBoxDisplay', {message: i18n.t(`member_center.${code}_hint`) , type: 'warn' ,url: `${ROUTER_VERSION}/`})
      }
    } else if (/deposit/.test(state.route.path)) {
      if (!state.loginData.activated) {
        action.commit('PopupBoxDisplay', {message: i18n.t('member_center.1001_hint') , type: 'warn' ,url: `${ROUTER_VERSION}/`})
        return
      }
    }
    break
  }
}


const mutations = {
  redirect (state) {
    redirect(state, this)
  },
  getData (state, data) {
    state.language = Cookies.get('locale') === '' ? 'en' : Cookies.get('locale')
    data.data.referrals.map((d, index) => {
      d['referrals_account_name'] = data.data.referrals_account_name[index]
    })
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
      message: state.PopupBox.message,
      buttondisplay: state.PopupBox.buttondisplay
    } = {
      type: obj.type ? obj.type : state.PopupBox.type,
      message: obj.message ? obj.message : state.PopupBox.message,
      buttondisplay: Object.keys(obj).includes('buttondisplay') ? obj.buttondisplay : state.PopupBox.buttondisplay
    })
  }
}

export default mutations
