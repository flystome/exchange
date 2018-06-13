// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// css dependencies
import '@/common/css/bootstrap.css'
import 'font-awesome/css/font-awesome.min.css'
import '@/common/css/style.scss'

/* eslint no-unused-vars: "error" */
import pusher from '@/common/js/pusher'
// template dependencies
import BasicButton from 'Components/BasicButton/BasicButton'
import BasicInput from 'Components/BasicInput/BasicInput'
import BasicTable from 'Components/BasicTable/BasicTable'
import MenuUnderline from 'Components/MenuUnderline/MenuUnderline'
import BasicSelect from 'Components/BasicSelect/BasicSelect'
import UploadImg from 'Components/UploadImg/UploadImg'
import QrCode from 'Components/QrCode/QrCode'
import NewsPrompt from 'Components/NewsPrompt/NewsPrompt'
import DivContenteditable from 'Components/DivContenteditable/DivContenteditable'
import Title from 'Pages/Title/Title'
import App from './App'
import BasicInstructions from 'Components/BasicInstructions/BasicInstructions'
import Trend from '@/common/js/trend/vue-trend.esm.js'
import Paginate from 'Components/Paginate'
import Spinner from 'vue-simple-spinner'

// js dependencies

import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import store from './store'
import router from './router'
import '@/common/js/validation'
import i18n from '@/common/js/i18n/i18n.js'
import { _post, _get, _delete, _put, _request } from './axios'
import 'bootstrap/js/dropdown.js'
import 'bootstrap/js/collapse.js'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import * as Filters from '@/common/filters/filters.js'

// require styles
import 'swiper/dist/css/swiper.css'

Vue.use(VueAwesomeSwiper)
Vue.use(window.VeeValidate)

// Vue.use(VeeValidate)

Vue.use(Trend)

window.QRCode = window.qrcode

Vue.config.productionTip = false
Vue.prototype._post = _post
Vue.prototype._get = _get
Vue.prototype._delete = _delete
Vue.prototype._put = _put
Vue.prototype._request = _request
Vue.prototype.$http = window.axios
Vue.prototype.$moment = window.dayjs

Paginate.name = 'Paginate'

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
  Spinner,
  Paginate,
  MenuUnderline
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
  render: h => h(App)
})

new Vue({
  router,
  i18n,
  // filetrs: Filters,
  render: h => h(Title)

}).$mount('#title')

Object.keys(Filters).forEach(key => {
  Vue.filter(key, Filters[key])
})
