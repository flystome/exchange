import Vue from 'vue'
import Vuex from 'vuex'
import { _post } from '../axios'
Vue.use(Vuex)

const actions = {
  getData ({commit}) {
    _post({
      url: '/settings/member_data.json'
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
  }
}

const store = new Vuex.Store({
  state: {
    loginData: ''
  },
  mutations,
  actions,
  getters
})

export default store
