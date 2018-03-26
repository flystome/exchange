import { _get } from '../axios'
import Cookies from 'js-cookie'
const unLogin = ['HomePage']

const actions = {
  getData ({ commit, state }) {
    _get({
      url: '/settings/member.json',
      headers: {
        'DataType': 'application/json;charset=utf-8'
      }
    }, (d) => {
      if (unLogin.includes(state.route.name)) {
        if (!d.error) commit('getData', d)
        commit('redirect')
        return
      }
      if (d.error) {
        Cookies.set('status', 'nologin')
        location.href = `${process.env.HOST_URL}/signin?from=${location.href}`
      }
      commit('getData', d)
      commit('redirect')
    })
  },
  redirect ({ commit, state }) {
    commit('redirect')
  },
  GetMarketData ({ commit, state }) {
    _get({
      url: '/home.json'
    }, (d) => {
      commit('GetMarketData', d.data.success)
    })
  }
}

export default actions
