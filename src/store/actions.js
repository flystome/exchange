import { _get } from '../axios'
import Cookies from 'js-cookie'

const actions = {
  getData ({ commit, state }) {
    _get({
      url: '/settings/member.json',
      headers: {
        'DataType': 'application/json;charset=utf-8'
      }
    }, (d) => {
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
  }
}

export default actions
