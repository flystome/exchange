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
    state.loginData = data.data
  },
  PopupBoxDisplay (state, message) {
    state.PopupBox = !state.PopupBox
    console.log(message)
  }
}

const store = new Vuex.Store({
  state: {
    loginData: '',
    Wrapper: false,
    PopupBox: false
  },
  mutations,
  actions,
  getters
})

export default store
