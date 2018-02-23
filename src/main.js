// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// template dependencies
import BasicButton from 'Components/BasicButton/BasicButton'
import BasicInput from 'Components/BasicInput/BasicInput'
import BasicTable from 'Components/BasicTable/BasicTable'
import UploadImg from 'Components/UploadImg/UploadImg'
import QrCode from 'Components/QrCode/QrCode'
import NewsPrompt from 'Components/NewsPrompt/NewsPrompt'
import App from './App'

// js dependencies
import Vue from 'vue'
import router from './router'
import moment from 'moment'
import VeeValidate from 'vee-validate'
import zh from 'vee-validate/dist/locale/zh_CN'
import i18n from '@/common/js/i18n/i18n.js'
import store from './store'
import axios from 'axios'
import { _post, _get, _httpget } from './axios'
import 'bootstrap/js/dropdown.js'
import 'bootstrap/js/collapse.js'

// css dependencies
import 'bootstrap/dist/css/bootstrap.min.css'

Vue.use(VeeValidate, {
  i18n,
  i18nRootKey: 'validation',
  dictionary: {
    zh
  }
})

moment.locale('zh-cn')
Vue.config.productionTip = false
Vue.prototype._post = _post
Vue.prototype._get = _get
Vue.prototype.$http = axios
Vue.prototype._httpget = _httpget
Vue.prototype.$moment = moment

const components = [
  BasicButton,
  BasicInput,
  BasicTable,
  QrCode,
  UploadImg,
  NewsPrompt
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
