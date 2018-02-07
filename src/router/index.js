import Vue from 'vue'
import Router from 'vue-router'
const Login = () => import('Pages/Login/Login')
const Register = () => import('Pages/Register/Register')
const MemberCenter = () => import('Pages/MemberCenter/MemberCenter')
const ValidateEmail = () => import('Pages/Validate/Email/Email')
const ValidateGoogle = () => import('Pages/Validate/Google/Google')

Vue.use(Router)

const router = new Router({
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
      path: '/member_center',
      name: 'member_center',
      component: MemberCenter
    },
    {
      path: '/validate/email',
      name: 'ValidateEmail',
      component: ValidateEmail
    },
    {
      path: '/validate/google',
      name: 'ValidateGoogle',
      component: ValidateGoogle
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   console.log(to.path)
//   if (to.fullPath === '/') {
//     next({path: '/menmbercenter'})
//   }
// })

export default router
