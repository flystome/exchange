import Vue from 'vue'
import Router from 'vue-router'
const MemberCenter = () => import('Pages/MemberCenter/MemberCenter')
const ValidateEmail = () => import('Pages/Validate/Email/Email')
const ValidateGoogle = () => import('Pages/Validate/Google/Google')
const ValidateIdentity = () => import('Pages/Validate/Identity/Identity')
const ExtractCurrency = () => import('Pages/ExtractCurrency/ExtractCurrency')

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: MemberCenter
    },
    {
      path: '/:version',
      name: 'version',
      component: MemberCenter
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
    },
    {
      path: '/validate/identity',
      name: 'ValidateIdentity',
      component: ValidateIdentity
    },
    {
      path: '/currency/extract',
      name: 'ExtractCurrency',
      component: ExtractCurrency
    }
  ]
})

export default router
