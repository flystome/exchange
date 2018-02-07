import Vue from 'vue'
import Vuex from 'vuex'
import { _post } from '../axios'
Vue.use(Vuex)

const state = {}
_post({
  url: '/settings/member_data.json',
  data: {
    member_id: 326
  }
}, (d) => {
  console.log(d)
  state.data = d.data
})

const store = new Vuex.Store({
  state: state
})

export default store
