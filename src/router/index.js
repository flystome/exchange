import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
const MemberCenter = () => import('Pages/MemberCenter/MemberCenter')
const ValidateEmail = () => import('Pages/Validate/Email/Email')
const ValidateGoogle = () => import('Pages/Validate/Google/Google')
const ValidateIdentity = () => import('Pages/Validate/Identity/Identity')
const WithdrawCurrency = () => import('Pages/WithdrawCurrency/WithdrawCurrency')
const ValidateSms = () => import('Pages/Validate/Sms/Sms')
const Markets = () => import('Pages/market/mList/mlist')
const MarketDetail = () => import('Pages/market/mList/marketDetail/market')
const Trades = () => import('Pages/market/mList/trades/trades')
// import MarketList from './components/Pages/market/mList'
const HomePage = () => import('Pages/HomePage/HomePage')
const Prompt = () => import('Pages/Prompt/Prompt')
const Page404 = () => import('Pages/Page404/Page404')

// Mobile pages
const Mobile = () => import('Pages/Mobile')
const MobilePersonal = () => import('Pages/Mobile/Personal/Personal.vue')
const AboutUs = () => import('Pages/Instructions/AboutUs/AboutUs')
const Instructions = () => import('Pages/Instructions')
const Fee = () => import('Pages/Instructions/Fee/Fee')
const Help = () => import('Pages/Instructions/Help/Help')

Vue.use(Router)

const version = process.env.ROUTER_VERSION

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: MemberCenter
    },
    {
      path: `${version}/markets`,
      name: 'Markets',
      component: Markets
    },
    {
      path: `${version}/markets/:id`,
      name: 'MarketDetail',
      component: MarketDetail
    },
    {
      path: `${version}/markets/:id/trades`,
      name: 'Trades',
      component: Trades
    },
    {
      path: `${version}/homepage`,
      name: 'HomePage',
      component: HomePage
    },
    {
      path: `${version}/prompt`,
      name: 'Prompt',
      component: Prompt
    },
    {
      path: `${version}/my_account`,
      name: 'my_account',
      component: MemberCenter
    },
    {
      path: `${version}/validate/email`,
      name: 'ValidateEmail',
      component: ValidateEmail
    },
    {
      path: `${version}/validate/google`,
      name: 'ValidateGoogle',
      component: ValidateGoogle
    },
    {
      path: `${version}/validate/identity`,
      name: 'ValidateIdentity',
      component: ValidateIdentity
    },
    {
      path: `${version}/currency/withdraw`,
      alias: `${version}/currency/deposit`,
      name: 'WithdrawCurrency',
      component: WithdrawCurrency
    },
    {
      path: `${version}/validate/sms`,
      name: 'ValidateSms',
      component: ValidateSms
    },
    {
      path: `${version}/404`,
      name: 'notFound',
      component: Page404
    },
    {
      path: `${version}/instructions`,
      component: Instructions,
      children: [
        {
          path: ``,
          name: 'defalut',
          component: AboutUs
        },
        {
          path: `aboutus`,
          name: 'AboutUs',
          component: AboutUs
        },
        {
          path: `fee`,
          name: 'Fee',
          component: Fee
        },
        {
          path: `help`,
          name: 'Help',
          component: Help
        }
      ]
    },
    {
      path: '/:version',
      name: '/:version',
      component: MemberCenter
    },
    {
      path: `${version}/mobile`,
      name: 'mobile',
      component: Mobile,
      children: [
        {
          path: 'personal',
          name: 'MobilePersonal',
          component: MobilePersonal
        }
      ]
    },
    {
      path: '*',
      name: '*',
      redirect: `${version}/404`
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (store.state.loginData === 'none') {
    store.dispatch('getData')
  } else {
    store.commit('redirect', 1)
  }
  next()
})

export default router
