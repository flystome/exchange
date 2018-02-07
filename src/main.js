// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// template dependencies
import BasicButton from 'Components/BasicButton/BasicButton'
import BasicInput from 'Components/BasicInput/BasicInput'
import UploadImg from 'Components/UploadImg/UploadImg'
import QrCode from 'Components/QrCode/QrCode'
import App from './App'

// js dependencies
import Vue from 'vue'
import router from './router'
import moment from 'moment'
import VueI18n from 'vue-i18n'
import message from './common/js/i18n'

// import store from './store'
import { _post } from './axios'

// css dependencies
import 'bootstrap/dist/css/bootstrap.min.css'

moment.locale('zh-cn')
Vue.config.productionTip = false
Vue.prototype._post = _post
Vue.prototype.$moment = moment
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh',
  message: message
})

const components = [
  BasicButton,
  BasicInput,
  QrCode,
  UploadImg
]
components.forEach(component => {
  Vue.component(component.name, component)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  i18n
})
