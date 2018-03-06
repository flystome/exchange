import Vue from 'vue'
import Vuex from 'vuex'
import { _post } from '../axios'
import pusher from '@/common/js/pusher'
Vue.use(Vuex)

const actions = {
  getData ({ commit, state }) {
    _post({
      url: '/settings/member_data.json',
      headers: {
        'DataType': 'application/json;charset=utf-8'
      }
    }, (d) => {
      if (/signin/.test(d.request.responseURL)) location.href = `${d.request.responseURL}?from=${location.href}`
      // var channel = pusher.subscribe(`private-${d.data.sn}`)
      // channel.bind('deposit_address', (data) => {
      //   if (!state.DepositAddress[data.attributes.account_id]) {
      //     commit('AddAddress', data)
      //   }
      // })
      commit('getData', d)
    })
  }
}

const getters = {
  loginData: state => state.loginData
}

const mutations = {
  getData (state, data) {
    state.language = 'en'
    state.language = data.headers['content-language'] === '' ? 'en' : data.headers['content-language']
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

const store = new Vuex.Store({
  state: {
    loginData: '',
    Wrapper: false,
    PopupBox: {
      type: 'success',
      status: false,
      message: '',
      url: '',
      buttonText: '',
      buttondisplay: true
    },
    language: '',
    DepositAddress: {
    }
  },
  mutations,
  actions,
  getters
})
export default store
