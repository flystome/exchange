import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import { redirect } from '../store/mutations'

var route = ''
const MemberCenter = () => import(/* webpackChunkName: "MemberCenter" */ 'Pages/MemberCenter/MemberCenter')
// validate
const ValidateEmail = () => import(/* webpackChunkName: "ValidateEmail" */'Pages/Validate/Email/Email')
const ValidateGoogle = () => import(/* webpackChunkName: "ValidateGoogle" */'Pages/Validate/Google/Google')
const ValidateIdentity = () => import(/* webpackChunkName: "ValidateIdentity" */'Pages/Validate/Identity/Identity')
const WithdrawCurrency = () => import(/* webpackChunkName: "WithdrawCurrency" */'Pages/WithdrawCurrency/WithdrawCurrency')
const ValidateSms = () => import(/* webpackChunkName: "ValidateSms" */'Pages/Validate/Sms/Sms')

const MexchangeMarkets = () => import(/* webpackChunkName: "Mexchange" */'Pages/market/mList/mlist')
const MexchangeDetail = () => import(/* webpackChunkName: "Mexchange" */'Pages/market/mList/marketDetail/market')
const MexchangeTrades = () => import(/* webpackChunkName: "Mexchange" */'Pages/market/mList/trades/trades')
const MexchangeOrders = () => import(/* webpackChunkName: "Mexchange" */'Pages/market/mList/orders/orders')
const Exchanage = () => import('Pages/Exchange/exchange')
// import MarketList from './components/Pages/market/mList'
const HomePage = () => import(/* webpackChunkName: "HomePage" */'Pages/HomePage/HomePage')
const Prompt = () => import('Pages/Prompt/Prompt')
const Page404 = () => import(/* webpackChunkName: "Page404" */'Pages/Page404/Page404')

// Mobile pages
const Mobile = () => import('Pages/Mobile')
const MobilePersonal = () => import('Pages/Mobile/Personal/Personal.vue')
// const AboutUs = () => import('Pages/Instructions/AboutUs/AboutUs')
// const Instructions = () => import('Pages/Instructions')
// const Fee = () => import('Pages/Instructions/Fee/Fee')
// const Help = () => import('Pages/Instructions/Help/Help')

// Form
const Form = () => import('Pages/Form')
const FormOrder = () => import(/* webpackChunkName: "FormOrder" */ 'Pages/Form/Order/Order.vue')
const WithdrawCancel = () => import(/* webpackChunkName: "FormOrder" */ 'Pages/Form/WithdrawCancel/WithdrawCancel.vue')
const FormNews = () => import(/* webpackChunkName: "FormOrder" */'Pages/Form/News/News.vue')
const FormTrade = () => import(/* webpackChunkName: "FormOrder" */'Pages/Form/Trade/Trade.vue')
// const FormAccount = () => import(/* webpackChunkName: "FormOrder" */'Pages/Form/Account/Account.vue')
const FormDeposit = () => import(/* webpackChunkName: "FormOrder" */'Pages/Form/Deposit/Deposit.vue')
const FormWithdraw = () => import(/* webpackChunkName: "FormOrder" */'Pages/Form/Withdraw/Withdraw.vue')
const RegisteredReferral = () => import(/* webpackChunkName: "FormOrder" */'Pages/Form/RegisteredReferral/RegisteredReferral.vue')
const Referral = () => import(/* webpackChunkName: "FormOrder" */'Pages/Form/Referral/Referral.vue')

// Api
const Api = () => import(/* webpackChunkName: "Api" */ 'Pages/Api/RouterView')
const ApiIndex = () => import(/* webpackChunkName: "Api" */ 'Pages/Api')
const ApiEdit = () => import(/* webpackChunkName: "Api" */ 'Pages/Api/ApiEdit/ApiEdit')
const ApiNew = () => import(/* webpackChunkName: "Api" */ 'Pages/Api/ApiNew/ApiNew')

// Ticket
const TicketRouter = () => import(/* webpackChunkName: "Ticket" */'Pages/Ticket/RouterView')
const TicketIndex = () => import(/* webpackChunkName: "Ticket" */'Pages/Ticket/TicketIndex/TicketIndex')
const TicketNew = () => import(/* webpackChunkName: "Ticket" */'Pages/Ticket/TicketNew/TicketNew')
const Ticket = () => import(/* webpackChunkName: "Ticket" */'Pages/Ticket/Ticket/Ticket')

// MarketMaker
const MarketMaker = () => import(/* webpackChunkName: "MarketMaker" */'Pages/MarketMaker/MarketMaker')
const MarketApply = () => import(/* webpackChunkName: "MarketMaker" */'Pages/MarketMaker/MarketApply/MarketApply')

// signin and signup
const SignIn = () => import(/* webpackChunkName: "sign" */'Pages/Sign/SignIn.vue')
const SignUp = () => import(/* webpackChunkName: "sign" */'Pages/Sign/SignUp.vue')
const ForgotPassword = () => import(/* webpackChunkName: "sign" */'Pages/Sign/ForgotPassword.vue')

const ChangePassword = () => import(/* webpackChunkName: "ChangePassword" */'Pages/Sign/ChangePassword.vue')

// const AssetPie = () => import(/* webpackChunkName: "Dashboard" */'Pages/Dashboard/AssetPie/AssetPie.vue')
const DashboardIndex = () => import(/* webpackChunkName: "Dashboard" */'Pages/Dashboard/DashboardIndex')

Vue.use(Router)

const version = process.env.ROUTER_VERSION

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: `${version}/login`,
      name: 'SignIn',
      component: SignIn
    },
    {
      path: `${version}/register`,
      name: 'SignUp',
      component: SignUp
    },
    {
      path: `${version}/forgot_password`,
      name: 'ForgotPassword',
      component: ForgotPassword
    },
    {
      path: `${version}/change_password`,
      name: 'ChangePassword',
      component: ChangePassword
    },
    {
      path: `${version}/exchange/:id`,
      name: 'Exchange',
      component: Exchanage
    },
    {
      path: `${version}/markets`,
      name: 'MexchangeMarkets',
      component: MexchangeMarkets
    },
    {
      path: `${version}/markets/:id`,
      name: 'MexchangeDetail',
      component: MexchangeDetail
    },
    {
      path: `${version}/markets/:id/trades`,
      name: 'MexchangeTrades',
      component: MexchangeTrades
    },
    {
      path: `${version}/markets/:id/orders`,
      name: 'MexchangeOrders',
      component: MexchangeOrders
    },
    {
      path: `${version}/market_maker`,
      name: 'MarketMaker',
      component: MarketMaker
    },
    {
      path: `${version}/market_apply`,
      name: 'MarketApply',
      component: MarketApply
    },
    {
      path: `${version}/`,
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
      alias: `${version}/referral`,
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
      path: `${version}/funds/withdraw`,
      alias: [`${version}/funds/deposit`, `${version}/funds/pie`, `${version}/funds/line`],
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
      alias: [`${version}/422`, `${version}/500`, `${version}/502`],
      name: 'notFound',
      component: Page404
    },
    // {
    //   path: `${version}/instructions`,
    //   component: Instructions,
    //   children: [
    //     {
    //       path: ``,
    //       name: 'defalut',
    //       component: AboutUs
    //     },
    //     {
    //       path: `aboutus`,
    //       name: 'AboutUs',
    //       component: AboutUs
    //     },
    //     {
    //       path: `fee`,
    //       name: 'Fee',
    //       component: Fee
    //     },
    //     {
    //       path: `help`,
    //       name: 'Help',
    //       component: Help
    //     }
    //   ]
    // },
    {
      path: `${version}/form`,
      component: Form,
      children: [
        {
          path: '',
          redirect: `${version}/404`
        },
        {
          path: 'order',
          name: 'FormOrder',
          component: FormOrder
        },
        {
          path: 'trade',
          name: 'FormTrade',
          component: FormTrade
        },
        {
          path: 'news',
          name: 'FormNews',
          component: FormNews
        },
        // {
        //   path: 'account',
        //   name: 'FormAccount',
        //   component: FormAccount
        // },
        {
          path: 'withdraw_cancel',
          name: 'WithdrawCancel',
          component: WithdrawCancel
        },
        {
          path: 'registered_referral',
          name: 'FormRegisteredReferral',
          component: RegisteredReferral
        },
        {
          path: 'referral',
          name: 'FormReferral',
          component: Referral
        },
        {
          path: 'withdraw',
          name: 'FormWithdraw',
          component: FormWithdraw
        },
        {
          path: 'deposit',
          name: 'FormDeposit',
          component: FormDeposit
        }
      ]
    },
    {
      path: `${version}/ticket`,
      component: TicketRouter,
      children: [
        {
          path: '',
          component: Ticket,
          name: 'Ticket',
          beforeEnter: (to, from, next) => {
            if (to.query.hasOwnProperty('id') && !!to.query.id) {
              next()
            } else {
              next(`${version}/ticket/open`)
            }
          }
        },
        {
          path: 'open',
          name: 'TicketIndex',
          alias: 'closed',
          component: TicketIndex
        },
        {
          path: 'new',
          name: 'TicketNew',
          component: TicketNew
        }
      ]
    },
    {
      path: `${version}/api`,
      component: Api,
      children: [
        {
          path: '',
          name: 'ApiIndex',
          component: ApiIndex
        },
        {
          path: 'new',
          name: 'ApiNew',
          component: ApiNew
        },
        {
          path: 'edit',
          name: 'ApiEdit',
          component: ApiEdit
        }
      ]
    },
    {
      path: `${version}/dashboard/:dashboard`,
      name: 'AssetsDashboard',
      component: DashboardIndex
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

var Time = 0

router.beforeEach(async (to, from, next) => {
  route = to
  if (to.query.from === 'app') {
    store.state.fromApp = true
  }
  var user = navigator.userAgent
  // '<meta id="meta" name=viewport content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">'
  // '<meta id="meta" name=viewport content="initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">'
  var mobile = user.toLowerCase().indexOf('android') !== -1 || user.toLowerCase().indexOf('iphone') !== -1
  if ((to.path === '/' || to.path === `${version}` || to.path === `${version}/`) && !store.state.Pc) {
    if (mobile) {
      next(`${version}/markets`)
      return
    }
  }
  if (store.state.loginData === 'none' && Time === 0) {
    var result = await store.dispatch('getData', to)
    Time = 1
    if (result) {
      next(`${version}/my_account`)
      return
    }
  } else {
    if (to.name !== 'my_account' && !redirect(store.state, store, to)) {
      next(from.path)
      return
    }
  }
  next()
})

router.afterEach(() => {
  var user = navigator.userAgent
  var mobile = user.toLowerCase().indexOf('android') !== -1 || user.toLowerCase().indexOf('iphone') !== -1
  if (mobile) {
    if (route.name === 'HomePage' || route.name === 'home' || route.path === `${version}/funds/line`) {
      var min = document.getElementById('meta').content.match(/minimum-scale=(\d\.\d+)/) && document.getElementById('meta').content.match(/minimum-scale=(\d\.\d+)/)[0]
      if (min && min.match(/(\d\.\d+)/)[0] !== '1') return
      document.getElementById('meta').content = `initial-scale=1,minimum-scale=${document.body.offsetWidth / 1200},maximum-scale=0,user-scalable=yes`
    } else {
      document.getElementById('meta').content = `width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=0,user-scalable=no`
    }
  }
})

export default router
