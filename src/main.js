// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// css dependencies
import '@/common/css/bootstrap.css'
import 'font-awesome/css/font-awesome.min.css'
import '@/common/css/style.scss'

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
import BasicInstructions from 'Components/BasicInstructions/BasicInstructions'
import Trend from '@/common/js/trend/vue-trend.esm.js'
import Spinner from 'vue-simple-spinner'

// js dependencies
import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import store from './store'
import router from './router'
import moment from 'moment'
import dictionary from '@/common/js/validation'
import VeeValidate from 'vee-validate'
import i18n from '@/common/js/i18n/i18n.js'
import axios from 'axios'
import { _post, _get, _delete } from './axios'
import 'bootstrap/js/dropdown.js'
import 'bootstrap/js/collapse.js'
import Pusher from 'pusher-js'
import 'bootstrap/js/carousel.js'

Vue.use(VeeValidate, {
  i18n,
  i18nRootKey: 'validation',
  dictionary: dictionary
})

Vue.use(Trend)

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
  DivContenteditable,
  BasicInstructions,
  Spinner
]
components.forEach(component => {
  Vue.component(component.name, component)
})

sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  template: '<App/>',
  components: { App }
})

new Vue({
  router,
  i18n,
  template: `<Title></Title>`,
  components: { Title }
}).$mount('#title')

Pusher.Runtime.createXHR = function () {
  var xhr = new XMLHttpRequest()
  xhr.withCredentials = true
  return xhr
}
