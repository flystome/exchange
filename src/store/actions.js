import { _get } from '../axios'
import Cookies from 'js-cookie'
const unLogin = ['HomePage', 'Markets', 'MarketDetail', 'Trades']

const actions = {
  getData ({ commit, state }) {
    _get({
      url: '/settings/member.json',
      headers: {
        'DataType': 'application/json;charset=utf-8'
      }
    }, (d) => {
      console.log(state.route)
      if (state.marketData === '') {
        if (d.data.error) {
          if (!localStorage.getItem('marketData')) {
            this.dispatch('GetMarketData', 'local')
          } else {
            commit('GetMarketData', JSON.parse(localStorage.getItem('marketData')))
          }
        } else {
          this.dispatch('GetMarketData')
        }
      }
      if (unLogin.includes(state.route.name)) {
        if (!d.data.error) commit('getData', d)
        commit('redirect')
        return
      }
      if (d.data.error) {
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
  GetMarketData ({ commit, state }, type) {
    _get({
      url: '/home.json'
    }, (d) => {
      if (type) {
        var data = d.data.success
        delete data.current_user
        delete data.code
        localStorage.setItem('marketData', JSON.stringify(data))
      }
      commit('GetMarketData', d.data.success)
    })
  }
}

export default actions
