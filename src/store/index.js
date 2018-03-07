import Vue from 'vue'
import Vuex from 'vuex'
import { _post } from '../axios'
Vue.use(Vuex)

const actions = {
  getData ({ commit, state }) {
    _post({
      url: '/settings/member_data.json',
      headers: {
        'DataType': 'application/json;charset=utf-8'
      }
    }, (d) => {
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
    state.PopupBox.message = obj.message
    state.PopupBox.url = obj.url ? obj.url : ''
  },
  ChangeLanguage (state, lang) {
    state.language = lang
  },
  ChangePopupBox (state, { from, to }) {
    state.PopupBox[from] = to
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
      url: ''
    },
    language: ''
  },
  mutations,
  actions,
  getters
})
export default store
