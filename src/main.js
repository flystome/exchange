// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// css dependencies
// import 'bootstrap/dist/css/bootstrap.min.css'
import '../static/style/common.css'
// template dependencies
import BasicButton from 'Components/BasicButton/BasicButton'
import BasicInput from 'Components/BasicInput/BasicInput'
import BasicTable from 'Components/BasicTable/BasicTable'
import BasicSelect from 'Components/BasicSelect/BasicSelect'
import UploadImg from 'Components/UploadImg/UploadImg'
import QrCode from 'Components/QrCode/QrCode'
import NewsPrompt from 'Components/NewsPrompt/NewsPrompt'
import DivContenteditable from 'Components/DivContenteditable/DivContenteditable'
import Title from 'Pages/Title/Title'
import App from './App'

// js dependencies
import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import store from './store'
import router from './router'
import moment from 'moment'
import dictionary from '@/common/js/validation'
import VeeValidate, { Validator } from 'vee-validate'
import i18n from '@/common/js/i18n/i18n.js'
import axios from 'axios'
import { _post, _get, _delete } from './axios'
import 'bootstrap/js/dropdown.js'
import 'bootstrap/js/collapse.js'
import Pusher from 'pusher-js'
import 'bootstrap/js/carousel.js'
// css dependencies
import '@/common/css/bootstrap.css'
import '@/common/css/reset.css'

Vue.use(VeeValidate, {
  i18n,
  i18nRootKey: 'validation',
  dictionary: dictionary
})
Validator.localize(dictionary)

moment.locale('zh-cn')
Vue.config.productionTip = false
Vue.prototype._post = _post
Vue.prototype._get = _get
Vue.prototype._delete = _delete
Vue.prototype.$http = axios
Vue.prototype.$moment = moment

const components = [
  BasicButton,
  BasicInput,
  BasicTable,
  BasicSelect,
  QrCode,
  UploadImg,
  NewsPrompt,
  DivContenteditable
]
components.forEach(component => {
  Vue.component(component.name, component)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  template: '<App/>',
  components: { App }
})

sync(store, router)

new Vue({
  router,
  i18n,
  store,
  template: `<Title></Title>`,
  components: { Title }
}).$mount('#title')

Pusher.Runtime.createXHR = function () {
  var xhr = new XMLHttpRequest()
  xhr.withCredentials = true
  return xhr
}

// const pusher = new Pusher('11227a46061409170fd5', {
//   cluster: 'ap1',
//   authEndpoint: '192.168.1.120:3000/pusher/auth',
//   encrypted: true
// })

// const globalChannel = pusher.subscribe('market-global')
