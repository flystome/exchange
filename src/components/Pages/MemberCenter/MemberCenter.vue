<template>
  <div>
    <div class="btc-member-center container">
      <div class="btc-container-block btc-membercenter-header">
        <div class="col-md-6">
          <div class="btc-member-info">
            <span class="btc-member-infoEmail">{{ loginData.email }}</span>
            <a :href="`${HOST_URL}/identity/edit`">
              {{$t("member_center.change_password")}}
            </a>
            <div class="btc-member-assetCount">
              {{$t('member_center.total_assets')}} : 0 BTC
            </div>
          </div>
        </div>
        <div class="btc-member-bt">
          <span @click="account" :class="{'btc-link': step === 1 }">{{$t("member_center.account")}}</span>
          <span>|</span>
          <span @click="referrals" :class="{'btc-link': step === 2 }">
            {{$t('member_center.recommended_statistics')}}
          </span>
          <span>|</span>
          <span>
            <a style="color:#fff" :href="`${HOST_URL}/documents/api_v2`">{{$t("member_center.api")}}</a>
          </span>
        </div>
      </div>
      <div class="btc-member-ver">
        <div class="media">
          <div>
            <div class="media-left">
              <a href="#">
                <img class="media-object" data-src="holder.js/64x64" alt="64x64" src="~Img/member-email.png" data-holder-rendered="true">
              </a>
            </div>
            <div class="media-body">
              <!-- <h5 class="media-heading">{{ loginData.email }}</h5> -->
              <h5 class="media-heading">{{ loginData.email }}</h5>
              <span class="btc-member-validata btc-link" :class="{'btc-active': !loginData.activated}">
                <span v-if='loginData.activated'>{{$t("auth.email")}}</span>
                <span v-else @click="sendEmail">
                  {{$t("auth.send_email")}}
                </span>
                <img v-if='loginData.activated' src="~Img/validate-true.png" alt="已认证">
              </span>
            </div>
            <div class="media-right">
              <a href="#">
                <img class="media-object" data-src="holder.js/64x64" alt="64x64" src="~Img/right.png" v-if='loginData.activated' data-holder-rendered="true" >
                <img class="media-object" data-src="holder.js/64x64" alt="64x64" src="~Img/false.png" v-else data-holder-rendered="true" >
              </a>
            </div>
          </div>
        </div>
        <div class="media">
          <div>
            <div class="media-left">
              <a href="#">
                <img class="media-object" data-src="holder.js/64x64" alt="64x64" src="~Img/member-google.png" data-holder-rendered="true">
              </a>
            </div>
            <div class="media-body">
              <h5 class="media-heading">{{$t("member_center.korean_user_use_twice_verification")}}</h5>
              <span class="btc-member-validata btc-link btc-marginR10" @click="validatephone" :class="{'btc-active': !loginData.sms_activated}">
                  <span>{{ $t("auth.phone") }}</span>
                  <img v-if='loginData.sms_activated' src="~Img/validate-true.png" alt="已认证">
                </span>
                <span class="btc-member-validata btc-link btc-marginT10" :class="{'btc-active': !loginData.app_activated}" @click="validateAuth">
                  <span>{{$t("auth.google")}}</span>
                  <img v-if='loginData.app_activated' src="~Img/validate-true.png" alt="已认证">
                </span>
            </div>
            <div class="media-right">
              <a href="#">
                <img class="media-object" data-src="holder.js/64x64" alt="64x64" src="~Img/right.png" v-if='loginData.sms_activated && loginData.app_activated' data-holder-rendered="true" >
                <img class="media-object" data-src="holder.js/64x64" alt="64x64" src="~Img/false.png" v-else data-holder-rendered="true" >
              </a>
            </div>
          </div>
        </div>
        <div class="media">
          <div>
            <div class="media-left">
              <a href="#">
                <img class="media-object" data-src="holder.js/64x64" alt="64x64" src="~Img/member-identity.png" data-holder-rendered="true">
              </a>
            </div>
            <div class="media-body ">
              <h5 class="media-heading">{{$t("member_center.completion_of_real_name_authentication")}}</h5>
              <div class="btc-verifying-prompt">
                <span class="btc-member-validata btc-link"
                  @click="validateAll"
                  :class="{'btc-active': (loginData.id_document && loginData.id_document.aasm_state)==='unverified',
                  'btc-verifying':(loginData.id_document && loginData.id_document.aasm_state)==='verifying'}">
                  <span>{{$t("auth.real_name")}}</span>
                  <img v-if='(loginData.id_document && loginData.id_document.aasm_state)==="verified"' src="~Img/validate-true.png" alt="已认证">
                  <img v-else-if='(loginData.id_document && loginData.id_document.aasm_state)==="verifying"' src="~Img/verifying.png" alt="认证中">
                  <img v-else-if='(loginData.id_document && loginData.id_document.aasm_state)==="unverified"' src="~Img/unverified.png" alt="认证失败">
                  <span class="verifying-prompt">认证中</span>
                </span>
              </div>
            </div>
            <div class="media-right">
              <a href="#">
                <img class="media-object" data-src="holder.js/64x64" alt="64x64" src="~Img/right.png" v-if='(loginData.id_document && loginData.id_document.aasm_state)==="verified"' data-holder-rendered="true" >
                <img class="media-object" data-src="holder.js/64x64" alt="64x64" src="~Img/false.png" v-else data-holder-rendered="true" >
              </a>
            </div>
          </div>
        </div>


        <!-- <div class="btc-member-stepsblock col-md-4 col-xs-12">
          <div class="col-md-2 col-xs-1">
            <img src="~Img/member-email.png" class="btc-paddingR20 btc-paddingT5" alt="">
          </div>
          <div class="col-md-8 col-xs-10">
            <div class="btc-member-steps">
              <div class="btc-marginB5">
              {{ loginData.email }}
              </div>
              <span class="btc-member-validata btc-link" :class="{'btc-active': !loginData.activated}">
                  <span v-if='loginData.activated'>{{$t("auth.email")}}</span>
                  <span v-else @click="sendEmail">
                    {{$t("auth.send_email")}}
                  </span>
                <img v-if='loginData.activated' src="~Img/validate-true.png" alt="已认证">
              </span>
            </div>
          </div>
          <div class="col-md-1 col-xs-1 pull-right">
            <div class="pull-right btc-paddingT15">
              <img src="~Img/right.png" v-if='loginData.activated'>
              <img src="~Img/false.png" alt="" v-else>
            </div>
          </div>
        </div> -->
        <!-- <div class="btc-member-stepsblock btc-marginL10 btc-marginR10 col-md-4 col-xs-12">
          <div class="col-md-2 col-xs-1">
            <img src="~Img/member-google.png" alt="">
          </div>
          <div class="col-md-8 col-xs-10">
            <div class="btc-marginB5">
              {{$t("member_center.korean_user_use_twice_verification")}}
            </div>
            <div class="btc-member-steps">
              <p class="btc-member-validata btc-link btc-marginR10" @click="goPath('/validate/sms', loginData.sms_activated,false)" :class="{'btc-active': !loginData.sms_activated}">
              <p class="btc-member-validata btc-link btc-marginR10" @click="validatephone" :class="{'btc-active': !loginData.sms_activated}">
                <span>{{ $t("auth.phone") }}</span>
                <img v-if='loginData.sms_activated' src="~Img/validate-true.png" alt="已认证">
              </p>
              <span class="btc-member-validata btc-link btc-marginT10" :class="{'btc-active': !loginData.app_activated}" @click="goPath('/validate/google',loginData && loginData.app_activated,false)">
              <span class="btc-member-validata btc-link btc-marginT10" :class="{'btc-active': !loginData.app_activated}" @click="validateAuth">
                <span>{{$t("auth.google")}}</span>
                <img v-if='loginData.app_activated' src="~Img/validate-true.png" alt="已认证">
              </span>
            </div>
          </div>
          <div class="col-md-1 col-xs-1 pull-right">
            <div class="pull-right btc-paddingT15">
              <img src="~Img/right.png" v-if='loginData.sms_activated && loginData.app_activated'>
              <img src="~Img/false.png" alt="" v-else>
            </div>
          </div>
        </div> -->
        <!-- <div class="btc-member-stepsblock col-md-4 col-xs-12">
          <div class="col-md-2 col-xs-1">
            <img src="~Img/member-identity.png" alt="">
          </div>
          <div class="col-md-8 col-xs-10">
            <div class="btc-marginB5">
              {{$t("member_center.completion_of_real_name_authentication")}}
            </div>
            <div class="btc-member-steps btc-verifying-prompt">
              <span class="btc-member-validata btc-link"
              @click="validateAll"
              :class="{'btc-active': (loginData.id_document && loginData.id_document.aasm_state)==='unverified',
              'btc-verifying':(loginData.id_document && loginData.id_document.aasm_state)==='verifying'}">
                <span>{{$t("auth.real_name")}}</span>
                <img v-if='(loginData.id_document && loginData.id_document.aasm_state)==="verified"' src="~Img/validate-true.png" alt="已认证">
                <img v-else-if='(loginData.id_document && loginData.id_document.aasm_state)==="verifying"' src="~Img/verifying.png" alt="认证中">
                <img v-else-if='(loginData.id_document && loginData.id_document.aasm_state)==="unverified"' src="~Img/unverified.png" alt="认证失败">
                <span class="verifying-prompt">认证中</span>
              </span>
            </div>
          </div>
          <div class="col-md-1 col-xs-1 pull-right">
            <div class="pull-right btc-paddingT15">
              <img src="~Img/right.png" v-if='(loginData.id_document && loginData.id_document.aasm_state)==="verified"'>
              <img src="~Img/false.png" alt="" v-else>
            </div>
          </div>

        </div> -->
      </div>
    </div>
    <template v-if="step === 1">
      <div class="container">
      <basic-table :captionTitle='getLoginRecord.captionTitle' :item='getLoginRecord.Item'>
      <span slot="remark" class="btc-tableRemark">{{$t('member_center.have_questions_to_contact_us')}}</span>
      </basic-table>
      <div class="btc-member-handleRecord  btc-container-block">
        <header class="btc-member-blockHeader">
          <span class="btc-member-handleCount"><strong>{{$t('member_center.customer_service_record')}}</strong></span>
          <a class="btc-member-handleServer btc-link" :href="`${HOST_URL}/tickets?closed=true`">{{$t('member_center.view_the_end_service_list')}}</a>
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
                <div class="btc-marginT15 btc-font12 btc-color999">{{$t('member_center.no_record')}}</div>
            </div>
        </div>
        <template v-else>
          <div class="text-center btc-table-more col-md-6">
            <a :href="`${HOST_URL}/tickets`" class="btc-link ">{{$t('member_center.show_more')}}</a>
          </div>
          <div class="text-center btc-table-more btc-b-l col-md-6">
            <a :href="`${HOST_URL}/tickets/new`" class="btc-link ">{{$t('member_center.new_questions')}}</a>
          </div>
        </template>
      </div>
      </div>
    </template>
    <template v-if="step === 2">
      <div class="container">
      <basic-table :captionTitle='getRecommendCount.captionTitle' :item='getRecommendCount.Item'>
      <div slot="more" class="text-center btc-b-t btc-table-more">
        <a :href="`${HOST_URL}/member/referral`" class="btc-link ">{{$t('member_center.show_more')}}</a>
      </div>
      </basic-table>
      <basic-table :captionTitle='getRecommendUser.captionTitle' :item='getRecommendUser.Item'>
         <div slot="more" class="text-center btc-b-t btc-table-more">
          <a :href="`${HOST_URL}/member/referral`" class="btc-link ">{{$t('member_center.show_more')}}</a>
        </div>
      </basic-table>
      </div>
    </template>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import moment from 'moment'
moment.locale('zh-cn')

export default {
  name: 'MemberCenter',
  data () {
    return {
      HOST_URL: process.env.HOST_URL,
      name_activated: false,
      wexin_activated: false,
      email_sent_message: this.$t('member_center.email_sent_message'),
      tickets: [],
      step: 1
    }
  },
  methods: {
    account () {
      this.step = 1
    },
    referrals () {
      this.step = 2
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
      this._get({
        url: `/activations/mobile_new`,
        headers: {
          'DataType': 'application/json;charset=utf-8'
        }
      }, (d) => {
        if (d.data.status_code === '1') {
          this.prompt = d.data.errors
          this.PopupBoxDisplay({message: prompt, type: 'success'})
        } else {
          this.PopupBoxDisplay({message: d.data.errors, type: 'error'})
        }
      })
    },
    goPath (path, status, href) {
      if (status) {
        return
      }
      if (href) {
        location.href = `${this.HOST_URL}${path}`
      }
      this.$router.push({
        path: path
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
        alert(1)
      } else {
        this.goPath('/validate/sms', this.loginData.sms_activated, false)
      }
    },
    validateAuth () {
      if (!this.loginData.activated) {
        alert(2)
      } else {
        this.goPath('/validate/google', this.loginData && this.loginData.app_activated, false)
      }
    },
    validateAll () {
      if (!this.loginData.activated && !this.loginData.sms_activated && !this.loginData.app_activated) {
        alert(2)
      } else {
        this.goPath('/validate/identity')
      }
    }
  },
  computed: {
    ...mapGetters(['loginData']),
    getLoginRecord () {
      var data = this.loginData.recent_signin_histories
      var obj = {
        captionTitle: this.$t('member_center.login_record'),
        Item: ''
      }
      if (data) {
        data.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
        data.length === 0 ? obj.Item = '' : obj.Item = [{content: [this.$t('member_center.login_time'), this.$t('member_center.ip_adress'), this.$t('member_center.login_location')]}].concat(data.map(d => {
          return {
            content: [
              this.$moment(d.created_at).format('L H:mm:ss'),
              d.ip,
              d.location
            ]
          }
        }))
      }
      return obj
    },
    getRecommendCount () {
      var data = this.loginData.referral_datas
      var obj = {
        captionTitle: this.$t('member_center.recommended_statistics'),
        Item: ''
      }
      if (data) {
        data.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
        data.length === 0 ? obj.Item = '' : obj.Item = [{content: [this.$t('member_center.date'), this.$t('member_center.number_of_users'), this.$t('member_center.new_user'), this.$t('member_center.page_browsing'), this.$t('member_center.bounce_rate')]}].concat(data.map(d => {
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
      return obj
    },
    getRecommendUser () {
      var data = this.loginData
      var obj = {
        captionTitle: this.$t('member_center.recommended_users'),
        Item: ''
      }
      if (data) {
        data.referral_signup_history.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
        data.referrals.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
        this.getTicket()
        data.referral_signup_history.length === 0 ? obj.Item = '' : obj.Item = [{content: [this.$t('member_center.account'), this.$t('member_center.ip_adress'), this.$t('member_center.login_location'), this.$t('member_center.browser'), this.$t('member_center.login_time'), this.$t('member_center.activated')]}].concat(this.loginData.referral_signup_history.map((_, index) => {
          return {
            content: [
              this.loginData.referrals[index].referrals_account_name,
              this.loginData.referral_signup_history[index].ip,
              this.loginData.referral_signup_history[index].location ? this.loginData.referral_signup_history[index].location : '占无',
              this.bser(this.loginData.recent_signin_histories[index].ua),
              this.$moment(this.loginData.referrals[index].created_at).format('L H:mm:ss'),
              this.loginData.referrals[index].activated ? this.$t('member_center.yes') : this.$t('member_center.no')
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
  }
}
</script>

<style scoped lang='scss'>
@import './MemberCenter.scss'
</style>
