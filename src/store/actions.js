import { _post } from '../axios'
import Cookies from 'js-cookie'

const actions = {
  getData ({ commit, state }) {
    _post({
      url: '/settings/member_data.json',
      headers: {
        'DataType': 'application/json;charset=utf-8'
      }
    }, (d) => {
      if (d.error) {
        Cookies.set('status', 'nologin')
        location.href = `${process.env.HOST_URL}/signin?from=${location.href}`
      }
      commit('getData', d)
    })
  },
  redirect ({ commit, state }) {
    commit('redirect')
  }
}

export default actions
