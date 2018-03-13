import Vue from 'vue'
import Router from 'vue-router'
const MemberCenter = () => import('Pages/MemberCenter/MemberCenter')
const ValidateEmail = () => import('Pages/Validate/Email/Email')
const ValidateGoogle = () => import('Pages/Validate/Google/Google')
const ValidateIdentity = () => import('Pages/Validate/Identity/Identity')
const WithdrawCurrency = () => import('Pages/WithdrawCurrency/WithdrawCurrency')
const ValidateSms = () => import('Pages/Validate/Sms/Sms')
const Markets = () => import('Pages/market/mList/mlist')
// import MarketList from './components/Pages/market/mList'
const HomePage = () => import('Pages/HomePage/HomePage')
const Prompt = () => import('Pages/Prompt/Prompt')
const Page404 = () => import('Pages/Page404/Page404')

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
      path: '/markets',
      name: 'Markets',
      component: Markets
    },
    {
      path: '/homepage',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/prompt',
      name: 'Prompt',
      component: Prompt
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
      path: '/currency/withdraw',
      alias: '/currency/deposit',
      name: 'WithdrawCurrency',
      component: WithdrawCurrency
    },
    {
      path: '/validate/sms',
      name: 'ValidateSms',
      component: ValidateSms
    },
    {
      path: '*',
      name: '404',
      component: Page404
    }
  ]
})

export default router
