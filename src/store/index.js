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
    state.language = data.headers['content-language'] === '' ? 'en' : data.headers['content-language'] 
    state.loginData = data.data
  },
  PopupBoxDisplay (state, message) {
    state.PopupBox.status = !state.PopupBox.status
    state.PopupBox.message = message
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
      message: ''
    },
    language: ''
  },
  mutations,
  actions,
  getters
})

export default store
