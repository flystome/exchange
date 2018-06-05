<template>
  <div>
    <div class="btc-member-center container">
      <div v-if="!(step === 1 && fromApp) " class="btc-container-block btc-membercenter-header" :class="{'btc-member-padding' : step === 1}">
        <div style='overflow: hidden;'>
          <div class="col-md-6">
            <div class="btc-member-info">
              <span class="btc-member-infoEmail">{{ loginData.show_name }}</span>
              <router-link :to="`${ROUTER_VERSION}/change_password`">
                {{$t("my_account.change_password")}}
              </router-link>
            </div>
          </div>
          <div class="btc-member-bt">
            <!-- <span @click="account" :class="{'btc-link': step === 1 }">{{$t("my_account.account")}}</span>
            <span>|</span>
            <span @click="referrals" :class="{'btc-link': step === 2 }">
              {{$t('my_account.recommended_statistics')}}
            </span> -->
            <menu-underline
            ref="menu"
            :route="'my_account'"
            v-model='step'
            :menu-index='step'
            :underline-margin="'5px'"
            :menu-margin="'24px'"
            :menu-list="[$t('my_account.account'), $t('my_account.recommended_statistics')]">
            </menu-underline>
          </div>
        </div>
        <div class="btc-memeber-platformCoin btc-paddingL15 btc-paddingT10">
          <a>{{$t('my_account.use_platform_currency')}}</a>
          <span @click='ChangePlatformCoin' class='btc-marginL15' :disabled='disabled'>
            <a :class="{'active': PlatformState}">ON</a><a :class="{'active': !PlatformState}">OFF</a>
          </span>
        </div>
      </div>
      <div class="btc-member-ver" v-if="step === 0">
        <div class="media">
          <div>
            <div class="media-left sprite-member-email">
              <i class="media-object account-email" />
            </div>
            <div class="media-body">
              <h5 class="media-heading">{{$t("my_account.tier_1")}}</h5>
              <span class="btc-member-validata btc-link" @click="sendEmail" :class="{'btc-active': !loginData.activated}">
                <span v-if='loginData.activated'>{{$t("auth.email")}}</span>
                <button type="button" id="myButton" data-text="Loading..." class="btn sendbutton" autocomplete="off" :disabled="disabled" v-else >
                  {{$t("auth.send_email")}}
                </button>
                <i v-if='loginData.activated' class='account-validate-true' />
              </span>
            </div>
            <div class="media-right">
              <i class="media-object account-right" v-if='loginData.activated' />
              <i class="media-object account-false" v-else />
            </div>
          </div>
        </div>
        <div class="media">
          <div>
            <div class="media-left">
              <i class="media-object img-padding account-phone" />
            </div>
            <div class="media-body">
              <h5 class="media-heading">{{$t("my_account.korean_user_use_twice_verification")}}</h5>
              <span class="btc-member-validata btc-link" @click="validatephone" :class="{'btc-active': !loginData.sms_activated}">
                  <span>{{ $t("auth.phone") }}</span>
                  <i v-if='loginData.sms_activated' class='account-validate-true' />
                </span>
                <span class="btc-member-validata btc-link" :class="{'btc-active': !loginData.app_activated}" @click="validateAuth">
                  <span>{{$t("auth.google")}}</span>
                  <i v-if='loginData.app_activated' class='account-validate-true' />
                </span>
            </div>
            <div class="media-right">
              <i class="media-object account-right" v-if='loginData.sms_activated || loginData.app_activated' />
              <i class="media-object account-false"  v-else data-holder-rendered="true" />
            </div>
          </div>
        </div>
        <div class="media">
          <div>
            <div class="media-left">
              <i class="media-object account-identity" />
            </div>
            <div class="media-body">
              <h5 class="media-heading">{{$t("my_account.completion_of_real_name_authentication")}}</h5>
              <div class="btc-verifying-prompt">
                <span class="btc-member-validata btc-link"
                  :class="{'btc-active': loginData.id_document && loginData.id_document.aasm_state==='unverified',
                  'btc-verifying':(loginData.id_document && loginData.id_document.aasm_state)==='verifying'}" @click="validateAll">
                  <span>{{$t("auth.real_name")}}</span>
                  <i class='account-validate-true' v-if='(loginData.id_document && loginData.id_document.aasm_state)==="verified"'/>
                  <i class='account-verifying' v-else-if='(loginData.id_document && loginData.id_document.aasm_state)==="verifying"'></i>
                  <div v-if="loginData.sms_activated && loginData.activated">
                    <i class='account-unverified' v-if='(loginData.id_document && loginData.id_document.aasm_state)==="unverified"'></i>
                  </div>
                  <span class="verifying-prompt">{{$t('my_account.verifying')}}</span>
                </span>
              </div>
            </div>
            <div class="media-right">
              <i class="media-object account-right" v-if='(loginData.id_document && loginData.id_document.aasm_state)==="verified"' />
              <i class="media-object account-false" v-else data-holder-rendered="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <template v-if="step === 0">
      <div class="container table">
      <basic-table :captionTitle='getLoginRecord.captionTitle' :item='getLoginRecord.Item'>
      <router-link :to="`${ROUTER_VERSION}/ticket/new`" slot="remark" class="btc-tableRemark">{{$t('my_account.have_questions_to_contact_us')}}</router-link>
      </basic-table>
      <div class="btc-member-handleRecord  btc-container-block">
        <header class="btc-member-blockHeader">
          <span class="btc-member-handleCount"><strong>{{$t('my_account.customer_service_record')}}</strong></span>
          <router-link :to='`${ROUTER_VERSION}/ticket/closed`' class="btc-member-handleServer btc-link">
            {{$t('my_account.view_the_end_service_list')}}
          </router-link>
        </header>
        <div @click='goTicket(data.id)' class="btc-member-qContainer" v-for="(data, index) in tickets" :key="index" v-if="index < 5" :class="{'btc-border-none': index === tickets.length - 1 }">
          <div class="btc-member-question" :class="{'is-dispose':data.aasm_state === 'closed' }">
            {{data.content}}
            <span class="btc-member-qTime">{{ moment(data.created_at) }}</span>
          </div>
          <div class="btc-member-qTitle btc-marginB5" :class="{'is-dispose':data.aasm_state === 'closed' }">
            {{data.title}}
          </div>
        </div>
        <div class="text-center btc-table-record" v-if="this.tickets.length === 0">
          <div>
              <div class="btc-marginT70 btc-marginB70 btc-font12 btc-color999">{{$t('my_account.no_record')}}</div>
          </div>
          <div class="text-center btc-table-more btc-b-t" style="margin-bottom:0px;">
            <a :href="`${HOST_URL}/tickets/new`" class="btc-link ">{{$t('my_account.new_questions')}}</a>
          </div>
        </div>
        <template v-else>
          <div class="text-center btc-table-more btc-b-t col-md-6">
            <router-link :to="`${ROUTER_VERSION}/ticket/open`" class='btc-link '>
              {{$t('my_account.show_more')}}
            </router-link>
          </div>
          <div class="text-center btc-table-more btc-b-l btc-b-t col-md-6">
            <router-link :to="`${ROUTER_VERSION}/ticket/new`" class='btc-link '>
              {{$t('my_account.new_questions')}}
            </router-link>
          </div>
        </template>
      </div>
      </div>
    </template>
    <template v-if="step === 1">
      <div class="container">
        <div class="btc-container-block btc-member-handleRecord btc-referral">
          <div class="btc-member-blockHeader">
            <strong>{{ $t('my_account.referrals_title') }}</strong>
          </div>
          <div class="btc-referral-container">
            <div class="btc-referral-qrcode btc-fl">
              <qr-code v-if="loginData !== 'none'" :length='"200px"' :dateUrl="qrcode(`${HOST_URL}?r=${loginData.promotion_id}`)"></qr-code>
            </div>
            <div class="btc-fl btc-referral-data">
              <div>
                <strong>{{ $t('my_account.recommended_links') }}</strong>
                <news-prompt :text='prompt'></news-prompt>
              </div>
              <div class="btc-referrals-address">
                <span v-if="loginData !== 'none'" id="copy1" class="btc-b">{{ `${BASE_URL}/register?r=${loginData.promotion_id}` }}</span>
                <basic-button class='btn-copy1' data-clipboard-target="#copy1" :text="$t('my_account.copy')"></basic-button>
              </div>
              <div class="btc-marginB20 btc-bottom">
                {{ $t('my_account.effective_recommended') }}: <strong>{{ loginData.promotion_amount }}</strong>
              </div>
              <div>
                {{ $t('my_account.my_trade_discount') }}: <strong>{{ `${(10 - Number(loginData.commission_factor * 10)) * 10}%` }} {{$t('homepage.off')}}</strong>
              </div>
            </div>
          </div>
        </div>
      <basic-table :loading='referral_loading' :captionTitle='getRecommendCount.captionTitle' :item='getRecommendCount.Item'>
      <div slot="more" class="text-center btc-b-t btc-table-more">
        <router-link :to="`${ROUTER_VERSION}/form/referral`" class="btc-link ">{{$t('my_account.show_more')}}</router-link>
      </div>
      </basic-table>
      <basic-table :loading='referral_loading' :captionTitle='getRecommendUser.captionTitle' :item='getRecommendUser.Item'>
         <div slot="more" class="text-center btc-b-t btc-table-more">
          <router-link :to="`${ROUTER_VERSION}/form/registered_referral`" class="btc-link ">{{$t('my_account.show_more')}}</router-link>
        </div>
      </basic-table>
      </div>
    </template>
    </div>
</template>
<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import Cookies from 'js-cookie'
import Clipboard from 'clipboard'
const _debounce = require('lodash.debounce')
var QRCode = require('qrcode')

export default {
  name: 'MemberCenter',
  created () {
    var code = Cookies.get('code')
    if (code) {
      if (code.match(/\d+/g)[0] === '200') {
        this.PopupBoxDisplay({message: this.$t(`my_account.200_hint`), type: 'success'})
        Cookies.remove('code')
        return
      }
      this.PopupBoxDisplay({message: this.$t(`my_account.${code.match(/\d+/g)[0]}_hint`), type: 'warn'})
      Cookies.remove('code')
    }
  },
  mounted () {
    /* eslint-disable no-new */
    var clipboard = new Clipboard('.btn-copy1')
    var time = () => {
      setTimeout(() => {
        this.prompt = ''
      }, 1500)
    }

    clipboard.on('success', () => {
      clearTimeout(time)
      this.prompt = this.$t('deposit_currency.copy_success')
    })
    clipboard.on('success', _debounce(time, 500))

    var to = this.$route
    if (/my_account/.test(to.path)) {
      this.step = 0
    }
    if (/referral/.test(to.path)) {
      this.step = 1
    }
  },
  data () {
    return {
      prompt: '',
      BASE_URL: location.origin,
      HOST_URL: process.env.HOST_URL,
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      name_activated: false,
      wexin_activated: false,
      email_sent_message: this.$t('my_account.email_sent_message'),
      tickets: [],
      step: 0,
      referral_loading: true,
      disabled: false,
      getRecommendCount: {
        captionTitle: 'my_account.recommended_statistics',
        Item: []
      },
      getRecommendUser: {
        captionTitle: 'my_account.recommended_users',
        Item: []
      },
      headerStatus: true,
      httplock: false
    }
  },
  methods: {
    goTicket (id) {
      this.$router.push(`${this.ROUTER_VERSION}/ticket?id=${id}`)
    },
    qrcode (str) {
      var dateUrl = ''
      QRCode.toDataURL(str, {widht: 150, height: 150}, (err, string) => {
        if (err) console.log(err)
        dateUrl = string
      })
      return dateUrl
    },
    account () {
      this.$router.push(`${this.ROUTER_VERSION}/my_account`)
    },
    async referrals () {
      this.$router.push(`${this.ROUTER_VERSION}/referral`)
      if (this.httplock) return
      this.httplock = true
      this._get({
        url: '/settings/referrals.json'
      }, (d) => {
        this.referral_loading = false
        var data = d.data

        var obj = {
          captionTitle: 'my_account.recommended_statistics',
          Item: []
        }
        if (data.referral_datas) {
          data.referral_datas.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime()
          })
          data.referral_datas.length === 0 ? obj.Item = [] : obj.Item = [{content: [this.$t('my_account.date'), this.$t('my_account.number_of_users'), this.$t('my_account.new_user'), this.$t('my_account.page_browsing'), this.$t('my_account.bounce_rate')]}].concat(data.referral_datas.map(d => {
            return {
              content: [
                this.$moment(d.date).format('YYYY-MM-DD'),
                d.users,
                d.new_users,
                d.page_views,
                Number(d.bounce_rate).toFixed(1) + '%'
              ]
            }
          }))
        }
        this.getRecommendCount = obj

        var obj1 = {
          captionTitle: 'my_account.recommended_users',
          Item: []
        }
        if (data.referrals) {
          // data.referral_signup_history.sort((a, b) => {
          //   return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          // })
          // data.referrals.sort((a, b) => {
          //   return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          // })
          data.referrals.length === 0 ? obj1.Item = [] : obj1.Item = [{content: [this.$t('my_account.account'), this.$t('my_account.ip_adress'), this.$t('my_account.login_location'), this.$t('my_account.browser'), this.$t('my_account.login_time'), this.$t('my_account.activated')]}].concat(data.referrals.map((_, index) => {
            return {
              content: [
                data.referrals[index].account_name,
                data.referrals[index].signup_history.ip,
                data.referrals[index].signup_history.location ? data.referrals[index].signup_history.location : 'N/A',
                this.bser(data.referrals[index].signup_history.ua),
                this.$moment(data.referrals[index].created_at).format('YYYY-MM-DD H:mm:ss'),
                data.referrals[index].activated ? this.$t('my_account.yes') : this.$t('my_account.no')
              ]
            }
          }))
        }
        this.getRecommendUser = obj1
      })
    },
    ...mapMutations(['PopupBoxDisplay']),
    bser (explorer) {
      if (explorer.indexOf('MSIE') >= 0) {
        return 'IE'
      } else if (explorer.indexOf('Firefox') >= 0) {
        return this.$t('browser.firefox')
      } else if (explorer.indexOf('Chrome') >= 0) {
        return this.$t('browser.chrome')
      } else if (explorer.indexOf('Opera') >= 0) {
        return this.$t('browser.opera')
      } else if (explorer.indexOf('Safari') >= 0) {
        return this.$t('browser.safari')
      } else if (explorer.indexOf('Netscape') >= 0) {
        return this.$t('browser.netscape')
      } else if (explorer.indexOf('rv:10')) {
        return 'IE 10'
      } else if (explorer.indexOf('rv:11')) {
        return 'IE 11'
      }
    },
    sendEmail () {
      if (this.loginData.activated) return
      this.disabled = true
      if (this.disabled) {
        this._get({
          url: `/activations/mobile_new`,
          headers: {
            'DataType': 'application/json;charset=utf-8'
          }
        }, (d) => {
          this.disabled = false
          if (d.data.success) {
            this.PopupBoxDisplay({message: this.$t('api_server.my_account.success_200'), type: 'success'})
          } else {
            this.PopupBoxDisplay({message: this.$t(`api_server.my_account.error_${d.data.error.code}`), type: 'warn'})
          }
        })
      }
    },
    goPath (path, status, href) {
      if (status) {
        return
      }
      if (href) {
        location.href = `${this.HOST_URL}${this.ROUTER_VERSION}${path}`
      }
      this.$router.push({
        path: `${this.ROUTER_VERSION}${path}`
      })
    },
    getTicket () {
      this.tickets = this.loginData.tickets
      this.tickets = this.tickets.filter((d) => {
        return d.aasm_state === 'open'
      })
      this.tickets.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
    },
    validatephone () {
      if (!this.loginData.activated) {
        this.PopupBoxDisplay({message: this.$t('prompt.email_not_certified')})
      } else {
        this.goPath('/validate/sms', this.loginData.sms_activated, false)
      }
    },
    validateAuth () {
      if (!this.loginData.activated) {
        this.PopupBoxDisplay({message: this.$t('prompt.email_not_certified')})
      } else {
        this.goPath('/validate/google', this.loginData && this.loginData.app_activated, false)
      }
    },
    validateAll () {
      if (this.loginData.id_document.aasm_state === 'unverified') {
        if (!this.loginData.activated) {
          this.PopupBoxDisplay({message: this.$t('prompt.email_not_certified')})
        } else if (!this.loginData.sms_activated && !this.loginData.app_activated) {
          this.PopupBoxDisplay({message: this.$t('prompt.not_certified')})
        } else {
          this.goPath('/validate/identity', (this.loginData.id_document && this.loginData.id_document.aasm_state) === 'verified' || (this.loginData.id_document && this.loginData.id_document.aasm_state) === 'verifying', false)
        }
      }
    },
    moment (date) {
      return this.$moment(date).format('YYYY-MM-DD H:mm:ss')
    },
    ChangePlatformCoin () {
      if (this.disabled) return
      this.disabled = true
      this._post({
        url: '/settings/set_platform_coin_for_fee.json',
        data: {
          operate: !this.PlatformState ? 'enable' : 'disable'
        }
      }, (d) => {
        this.disabled = false
        if (d.data.success) {
          Object.assign(this.$store.state.loginData.platform_coin, {
            use_platform_coin_for_fee: !this.PlatformState
          })
        }
      })
    }
  },
  computed: {
    ...mapGetters(['loginData']),
    ...mapState(['fromApp']),
    getLoginRecord () {
      var data = this.loginData.recent_signin_histories
      var obj = {
        captionTitle: 'my_account.login_record',
        Item: []
      }
      if (data) {
        data.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
        data.length === 0 ? obj.Item = [] : obj.Item = [{content: [this.$t('my_account.login_time'), this.$t('my_account.ip_adress'), this.$t('my_account.login_location')]}].concat(data.map(d => {
          return {
            content: [
              this.$moment(d.created_at).format('YYYY-MM-DD H:mm:ss'),
              d.ip,
              d.location === null ? 'N/A' : d.location
            ]
          }
        }))
      }
      this.getTicket()
      return obj
    },
    PlatformState () {
      return this.loginData.platform_coin && this.loginData.platform_coin.use_platform_coin_for_fee
    }
  },
  watch: {
    $route (to) {
      if (/my_account/.test(to.path)) {
        this.headerStatus = true
        this.step = 0
      }
      if (/referral/.test(to.path)) {
        if (this.Pc) {
          this.headerStatus = false
        } else {
          this.headerStatus = true
        }
        this.step = 1
      }
    },
    step () {
      if (this.step === 0) {
        this.account()
      } else {
        this.referrals()
      }
    }
  }
}
</script>

<style scoped lang='scss'>
@import './MemberCenter.scss'
</style>
