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
    // state.language = data.headers['content-language'] === '' ? 'en' : data.headers['content-language']
    state.language = 'en'
    state.language = data.headers['content-language'] === '' ? 'en' : data.headers['content-language']
    data.data.referrals.map((d, index) => {
      d['referrals_account_name'] = data.data.referrals_account_name[index]
    })
    state.loginData = data.data
  },
  PopupBoxDisplay (state, obj) {
    state.PopupBox.status = !state.PopupBox.status
    state.PopupBox.message = obj && obj.message
    obj && obj.url ? state.PopupBox.url = obj.url : state.PopupBox.url = ''
  },
  ChangeLanguage (state, lang) {
    state.language = lang
  }
}

const store = new Vuex.Store({
  state: {
    loginData: '',
    Wrapper: false,
    PopupBox: {
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
