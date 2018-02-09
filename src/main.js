// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// template dependencies
import BasicButton from 'Components/BasicButton/BasicButton'
import BasicInput from 'Components/BasicInput/BasicInput'
import UploadImg from 'Components/UploadImg/UploadImg'
import QrCode from 'Components/QrCode/QrCode'
import NewsPrompt from 'Components/NewsPrompt/NewsPrompt'
import App from './App'

// js dependencies
import Vue from 'vue'
import router from './router'
import moment from 'moment'
import i18n from '@/common/js/i18n/i18n.js'

import store from './store'
import { _post } from './axios'
import 'bootstrap/js/dropdown.js'

// css dependencies
import 'bootstrap/dist/css/bootstrap.min.css'

moment.locale('zh-cn')
Vue.config.productionTip = false
Vue.prototype._post = _post
Vue.prototype.$moment = moment

const components = [
  BasicButton,
  BasicInput,
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
