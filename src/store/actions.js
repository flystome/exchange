import { _get } from '../axios'
import Cookies from 'js-cookie'

const unLogin = ['HomePage', 'Markets', 'MarketDetail', 'Trades', 'home', 'Orders', 'notFound', 'Exchanage']

const actions = {
  getData ({ commit, state }, route) {
    Cookies.get('validate_token') && Cookies.set('php_session', Cookies.get('validate_token'))
    _get({
      url: '/settings/member.json',
      headers: {
        'DataType': 'application/json;charset=utf-8'
      }
    }, (d) => {
      var lang = Cookies.get('locale')
      if (lang) {
        this.commit('ChangeLanguage', lang)
      } else {
        Cookies.set('locale', 'en')
      } // setCookie
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
      } // getMaretData
      if (route === undefined) route = state.route
      if (unLogin.includes(route.name)) {
        if (!d.data.error) commit('getData', d)
        commit('redirect', route)
        commit('GetCmsUrl')
        return
      } // unredirct pages
      if (d.data.error) {
        Cookies.set('status', 'nologin')
        location.href = `${process.env.HOST_URL}/signin?from=${location.href}`
      }
      commit('GetCmsUrl')
      commit('getData', d)
      commit('redirect', route)
    })
  },
  redirect ({ commit, state }, route) {
    commit('redirect', route)
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
