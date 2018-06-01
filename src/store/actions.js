import { _get, _post } from '../axios'
import Cookies from 'js-cookie'
import { redirect } from '../store/mutations'
import { unLogin } from '@/common/js/bus/public'
import router from '@/router'

const actions = {
  getData ({ commit, state }, route) {
    Cookies.get('validate_token') && Cookies.set('php_session', Cookies.get('validate_token'))
    return new Promise((resolve, reject) => {
      _get({
        url: '/settings/member.json',
        headers: {
          'DataType': 'application/json;charset=utf-8'
        }
      }, (d) => {
        if (state.marketData === '') {
          this.dispatch('GetMarketData')
          // if (d.data && d.data.error) {
          //   if (!localStorage.getItem('marketData')) {
          //     this.dispatch('GetMarketData', 'local')
          //   } else {
          //     commit('GetMarketData', JSON.parse(localStorage.getItem('marketData')))
          //   }
          // } else {
          //   this.dispatch('GetMarketData')
          // }
        } // getMaretData
        if (route === undefined) route = state.route
        if (unLogin.includes(route.name)) {
          if (d.data && !d.data.error) commit('getData', d)
          if (!redirect(state, arguments[0], route)) {
            resolve(true)
          } else {
            resolve(false)
          }
          commit('GetCmsUrl')
          return
        } // unredirct pages
        if (d.data.error) {
          router.replace(`${process.env.ROUTER_VERSION}/login?from=${route.path}`)
          return
        }
        commit('GetCmsUrl')
        commit('getData', d)
        if (!redirect(state, arguments[0], route)) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
    // _get({
    //   url: '/settings/member.json',
    //   headers: {
    //     'DataType': 'application/json;charset=utf-8'
    //   }
    // }, (d) => {
    //   var lang = Cookies.get('locale')
    //   if (lang) {
    //     this.commit('ChangeLanguage', lang)
    //   } else {
    //     Cookies.set('locale', 'en')
    //   } // setCookie
    //   if (state.marketData === '') {
    //     if (d.data && d.data.error) {
    //       if (!localStorage.getItem('marketData')) {
    //         this.dispatch('GetMarketData', 'local')
    //       } else {
    //         commit('GetMarketData', JSON.parse(localStorage.getItem('marketData')))
    //       }
    //     } else {
    //       this.dispatch('GetMarketData')
    //     }
    //   } // getMaretData
    //   if (route === undefined) route = state.route
    //   if (unLogin.includes(route.name)) {
    //     if (d.data && !d.data.error) commit('getData', d)
    //     if(!redirect(state, arguments[0], route)) {
    //       router.push(`${ROUTER_VERSION}/my_account`)
    //       return
    //     }
    //     commit('GetCmsUrl')
    //     return
    //   } // unredirct pages
    //   if (d.data.error) {
    //     Cookies.set('status', 'nologin')
    //     location.href = `${process.env.HOST_URL}/signin?from=${location.href}`
    //   }
    //   commit('GetCmsUrl')
    //   commit('getData', d)
    //   if(!redirect(state, arguments[0], route)) {
    //     router.push(`${ROUTER_VERSION}/my_account`)
    //     return
    //   }
    // })
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
        // localStorage.setItem('marketData', JSON.stringify(data))
      }
      commit('GetMarketData', d.data.success)
    })
  },
  ChangeLanguage ({ commit, state }, lang) {
    if (lang === state.language) return
    _post({
      url: '/settings/language.json',
      headers: {
        'DataType': 'application/json;charset=utf-8'
      },
      data: {
        'content_language': lang
      }
    }, (d) => {
      if (d.data.success) {
        commit('ChangeLanguage', lang)
      }
    })
  },
  GetCaptcha () {
    return new Promise((resolve, reject) => {
      _get({
        url: '/sessions/get_captcha.json'
      }, (d) => {
        if (d.data.success) {
          resolve(d.data.success)
        }
      })
    })
  }
}

export default actions
