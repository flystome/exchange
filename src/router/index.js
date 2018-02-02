import Vue from 'vue'
import Router from 'vue-router'
import Login from 'Pages/Login/Login'
import Register from 'Pages/Register/Register'
import MemberCenter from 'Pages/MemberCenter/MemberCenter'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/membercenter',
      name: 'membercenter',
      component: MemberCenter
    }
  ]
})
