<template>
  <div>
    <div class="btc-member-center container">
      <div class="btc-container-block btc-membercenter-header">
        <div class="col-md-6">
          <div class="btc-member-info">
            <span class="btc-member-infoEmail">{{ loginData.show_name }}</span>
            <a :href="`${HOST_URL}/identity/edit`">
              {{$t("my_account.change_password")}}
            </a>
            <!-- <div class="btc-member-assetCount">
              {{$t('my_account.total_assets')}} : 0 BTC
            </div> -->
          </div>
        </div>
        <div class="btc-member-bt">
          <span @click="account" :class="{'btc-link': step === 1 }">{{$t("my_account.account")}}</span>
          <span>|</span>
          <span @click="referrals" :class="{'btc-link': step === 2 }">
            {{$t('my_account.recommended_statistics')}}
          </span>
          <span>|</span>
          <span>
            <a target="_blank" style="color:#fff" :href="`${HOST_URL}/api_tokens`">{{$t("my_account.api")}}</a>
          </span>
        </div>
      </div>
      <div class="btc-member-ver">
        <div class="media">
          <div>
            <div class="media-left">
              <img class="media-object" data-src="holder.js/64x64" alt="64x64" src="~Img/member-email.png" data-holder-rendered="true">
            </div>
            <div class="media-body">
              <h5 class="media-heading">{{$t("my_account.tier_1")}}</h5>
              <span class="btc-member-validata btc-link" @click="sendEmail" :class="{'btc-active': !loginData.activated}">
                <span v-if='loginData.activated'>{{$t("auth.email")}}</span>
                <button type="button" id="myButton" data-text="Loading..." class="btn sendbutton" autocomplete="off" :disabled="disabled" v-else >
                  {{$t("auth.send_email")}}
                </button>
                <img v-if='loginData.activated' src="~Img/validate-true.png" alt="已认证">
              </span>
            </div>
            <div class="media-right">
              <img class="media-object" data-src="holder.js/64x64" alt="64x64" src="~Img/right.png" v-if='loginData.activated' data-holder-rendered="true" >
              <img class="media-object" data-src="holder.js/64x64" alt="64x64" src="~Img/false.png" v-else data-holder-rendered="true" >
            </div>
          </div>
        </div>
        <div class="media">
          <div>
            <div class="media-left">
              <img class="media-object img-padding" data-src="holder.js/64x64" alt="64x64" src="~Img/member-google.png" data-holder-rendered="true">
            </div>
            <div class="media-body">
              <h5 class="media-heading">{{$t("my_account.korean_user_use_twice_verification")}}</h5>
              <span class="btc-member-validata btc-link" @click="validatephone" :class="{'btc-active': !loginData.sms_activated}">
                  <span>{{ $t("auth.phone") }}</span>
                  <img v-if='loginData.sms_activated' src="~Img/validate-true.png" alt="已认证">
                </span>
                <span class="btc-member-validata btc-link" :class="{'btc-active': !loginData.app_activated}" @click="validateAuth">
                  <span>{{$t("auth.google")}}</span>
                  <img v-if='loginData.app_activated' src="~Img/validate-true.png" alt="已认证">
                </span>
            </div>
            <div class="media-right">
              <img class="media-object" data-src="holder.js/64x64" alt="64x64" src="~Img/right.png" v-if='loginData.sms_activated || loginData.app_activated' data-holder-rendered="true" >
              <img class="media-object" data-src="holder.js/64x64" alt="64x64" src="~Img/false.png" v-else data-holder-rendered="true" >
            </div>
          </div>
        </div>
        <div class="media">
          <div>
            <div class="media-left">
              <img class="media-object" data-src="holder.js/64x64" alt="64x64" src="~Img/member-identity.png" data-holder-rendered="true">
            </div>
            <div class="media-body">
              <h5 class="media-heading">{{$t("my_account.completion_of_real_name_authentication")}}</h5>
              <div class="btc-verifying-prompt">
                <span class="btc-member-validata btc-link"
                  :class="{'btc-active': loginData.id_document && loginData.id_document.aasm_state==='unverified',
                  'btc-verifying':(loginData.id_document && loginData.id_document.aasm_state)==='verifying'}" @click="validateAll">
                  <span>{{$t("auth.real_name")}}</span>
                  <img v-if='(loginData.id_document && loginData.id_document.aasm_state)==="verified"' src="~Img/validate-true.png" alt="已认证">
                  <img v-else-if='(loginData.id_document && loginData.id_document.aasm_state)==="verifying"' src="~Img/verifying.png" alt="认证中">
                  <div v-if="loginData.sms_activated && loginData.activated">
                    <img style="background: #fff;" v-if='(loginData.id_document && loginData.id_document.aasm_state)==="unverified"' src="~Img/unverified.png" alt="认证失败">
                  </div>
                  <span class="verifying-prompt">{{$t('my_account.verifying')}}</span>
                </span>
              </div>
            </div>
            <div class="media-right">
              <img class="media-object" data-src="holder.js/64x64" alt="64x64" src="~Img/right.png" v-if='(loginData.id_document && loginData.id_document.aasm_state)==="verified"' data-holder-rendered="true" >
              <img class="media-object" data-src="holder.js/64x64" alt="64x64" src="~Img/false.png" v-else data-holder-rendered="true" >
            </div>
          </div>
        </div>
      </div>
    </div>
    <template v-if="step === 1">
      <div class="container table">
      <basic-table :captionTitle='getLoginRecord.captionTitle' :item='getLoginRecord.Item'>
      <a :href="`${HOST_URL}/tickets/new`" slot="remark" class="btc-tableRemark">{{$t('my_account.have_questions_to_contact_us')}}</a>
      </basic-table>
      <div class="btc-member-handleRecord  btc-container-block">
        <header class="btc-member-blockHeader">
          <span class="btc-member-handleCount"><strong>{{$t('my_account.customer_service_record')}}</strong></span>
          <a class="btc-member-handleServer btc-link" :href="`${HOST_URL}/tickets?closed=true`">{{$t('my_account.view_the_end_service_list')}}</a>
        </header>
        <div class="btc-member-qContainer" v-for="(data, index) in tickets" :key="index" @click="toTickets(data.id)" v-if="data.aasm_state === 'open'">
          <div class="btc-member-question" :class="{'is-dispose':data.aasm_state === 'closed' }">
            {{data.content}}
            <span class="btc-member-qTime">{{ data.created_at | moment }}</span>
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
          <div class="text-center btc-table-more col-md-6">
            <a :href="`${HOST_URL}/tickets`" class="btc-link ">{{$t('my_account.show_more')}}</a>
          </div>
          <div class="text-center btc-table-more btc-b-l col-md-6">
            <a :href="`${HOST_URL}/tickets/new`" class="btc-link ">{{$t('my_account.new_questions')}}</a>
          </div>
        </template>
      </div>
      </div>
    </template>
    <template v-if="step === 2">
      <div class="container">
      <basic-table :captionTitle='getRecommendCount.captionTitle' :item='getRecommendCount.Item'>
      <div slot="more" class="text-center btc-b-t btc-table-more">
        <a :href="`${HOST_URL}/member/referral`" class="btc-link ">{{$t('my_account.show_more')}}</a>
      </div>
      </basic-table>
      <basic-table :captionTitle='getRecommendUser.captionTitle' :item='getRecommendUser.Item'>
         <div slot="more" class="text-center btc-b-t btc-table-more">
          <a :href="`${HOST_URL}/member/referral`" class="btc-link ">{{$t('my_account.show_more')}}</a>
        </div>
      </basic-table>
      </div>
    </template>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import moment from 'moment'
import Cookies from 'js-cookie'
moment.locale('zh-cn')

export default {
  name: 'MemberCenter',
  created () {
    var code = Cookies.get('code')
    this.$i18n.locale = Cookies.get('locale')
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
  data () {
    return {
      HOST_URL: process.env.HOST_URL,
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      name_activated: false,
      wexin_activated: false,
      email_sent_message: this.$t('my_account.email_sent_message'),
      tickets: [],
      step: 1,
      disabled: false,
      getRecommendCount: {
        captionTitle: this.$t('my_account.recommended_statistics'),
        Item: []
      },
      getRecommendUser: {
        captionTitle: this.$t('my_account.recommended_users'),
        Item: []
      },
      httplock: false
    }
  },
  methods: {
    account () {
      this.step = 1
    },
    async referrals () {
      this.step = 2
      if (this.httplock) return
      this._get({
        url: '/settings/referrals.json'
      }, (d) => {
        this.httplock = true
        var data = d.data

        var obj = {
          captionTitle: this.$t('my_account.recommended_statistics'),
          Item: ''
        }
        if (data.referral_datas) {
          data.referral_datas.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime()
          })
          data.referral_datas.length === 0 ? obj.Item = '' : obj.Item = [{content: [this.$t('my_account.date'), this.$t('my_account.number_of_users'), this.$t('my_account.new_user'), this.$t('my_account.page_browsing'), this.$t('my_account.bounce_rate')]}].concat(data.referral_datas.map(d => {
            return {
              content: [
                this.$moment(d.date).format('L'),
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
          captionTitle: this.$t('my_account.recommended_users'),
          Item: ''
        }
        if (data.referral_datas) {
          data.referral_signup_history.sort((a, b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          })
          data.referrals.sort((a, b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          })
          data.referral_signup_history.length === 0 ? obj1.Item = '' : obj1.Item = [{content: [this.$t('my_account.account'), this.$t('my_account.ip_adress'), this.$t('my_account.login_location'), this.$t('my_account.browser'), this.$t('my_account.login_time'), this.$t('my_account.activated')]}].concat(data.referral_signup_history.map((_, index) => {
            return {
              content: [
                data.referrals_account_name[index],
                data.referral_signup_history[index].ip,
                data.referral_signup_history[index].location ? data.referral_signup_history[index].location : '占无',
                this.bser(data.referral_signup_history[index].ua),
                this.$moment(data.referrals[index].created_at).format('L H:mm:ss'),
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
    toTickets (id) {
      location.href = `${this.HOST_URL}/tickets/${id}`
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
    }
  },
  computed: {
    ...mapGetters(['loginData']),
    getLoginRecord () {
      var data = this.loginData.recent_signin_histories
      var obj = {
        captionTitle: this.$t('my_account.login_record'),
        Item: ''
      }
      if (data) {
        data.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
        data.length === 0 ? obj.Item = '' : obj.Item = [{content: [this.$t('my_account.login_time'), this.$t('my_account.ip_adress'), this.$t('my_account.login_location')]}].concat(data.map(d => {
          return {
            content: [
              this.$moment(d.created_at).format('L H:mm:ss'),
              d.ip,
              d.location === null ? 'Null' : d.location
            ]
          }
        }))
      }
      return obj
    }
  },
  filters: {
    moment (date) {
      return moment(date).format('L H:mm:ss')
    }
  },
  watch: {
    loginData () {
      this.getTicket()
    },
    ReferralsData () {

    }
  }
}
</script>

<style scoped lang='scss'>
@import './MemberCenter.scss'
</style>
