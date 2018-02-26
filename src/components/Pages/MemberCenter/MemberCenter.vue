<template>
  <div class="btc-member-center" >
    <div class="btc-container-block btc-member-p12">
      <div class="col-md-6">
          <a :href="`${HOST_URL}/member/edit`">
             <img src="~Img/avatar.png" class="img-circle btc-member-avatar" v-if="!loginData.member_avatar">
             <img class="img-circle btc-member-avatar"   :src="loginData.member_avatar" v-else>
          </a>
          <div class="btc-member-info">
            <span class="btc-member-infoEmail">{{ loginData.email }}</span>
              <div class="btc-member-assetCount">
                {{$t('member_center.total_assets')}} : 0 BTC
              </div>
          </div>
      </div>
      <a class="col-md-6" :href="`${HOST_URL}/identity/edit`">
        <basic-button :text='$t("member_center.change_password")' class="btc-member-bt"></basic-button>
      </a>
    </div>
    <div class=" btc-member-vc btc-paddingB40 btc-paddingT40 btc-container-block  btc-textCenter btc-marginT10">
        <div >
          <div class="col-sm-6 col-md-4 btc-b-r">
            <div class="btc-r-border">
              <div >
                <img class='btc-marginT5' src="~Img/letter.png">
              </div>
              <div class=" ">
                <span class="btc-member-validata btc-link" :class="{'btc-active': !loginData.activated}">
                    <span v-if='loginData.activated'>{{$t("auth.email")}}</span>
                    <span v-else @click="sendEmail">
                      {{$t("auth.send_email")}}
                    </span>
                  <img v-if='loginData.activated' src="~Img/validate-true.png" alt="已认证">
                </span>
              </div>
              <div >
                {{ loginData.email }}
              </div>
            </div>
            <div class="col-md-12">
              <div >
                <strong>{{$t("auth.level.level_1")}}</strong>
              </div>
              <div class=" btc-marginT20">
                <img src="~Img/right.png" v-if='loginData.activated'>
                <span class='btc-member-step' v-else>
                    1
                </span>
              </div>

            </div>
          </div>
        <div class="col-sm-6 col-md-4 btc-b-r btc-membercenter-google">
            <div class="btc-r-border">
              <div >
                <img src="~Img/phone.png">
              </div>
              <div >
                <span class="btc-member-validata btc-link btc-marginR10" :class="{'btc-active': !loginData.sms_activated}">
                    <span>{{ $t("auth.phone") }}</span>
                    <img v-if='loginData.sms_activated' src="~Img/validate-true.png" alt="已认证">
                  </span>
                <span class="btc-member-validata btc-link btc-marginL10"
                :class="{'btc-active': !loginData.app_activated}"
                @click="goPath('/validate/google',loginData && loginData.app_activated,false)">
                    <span>{{$t("auth.google")}}</span>
                    <img v-if='loginData.app_activated' src="~Img/validate-true.png" alt="已认证">
                </span>
              </div>
              <div class="col-md-12">
                {{$t('member_center.korean_user_use_twice_verification')}}
              </div>
            </div>
            <div class="col-md-12">
              <div >
                <strong>{{$t("auth.level.level_2")}}</strong>
              </div>
              <div class=" btc-marginT20">
                <img src="~Img/right.png" v-if='loginData.sms_activated && loginData.app_activated'>
                <span class='btc-member-step' v-else>
                    2
                </span>
              </div>
            </div>
        </div>
          <div class="col-sm-12 col-md-4 btc-b-r btc-membercenter-identity">
            <div class="btc-r-border">
              <div >
                <img src="~Img/authentication.png">
              </div>
              <div >
                <span class="btc-member-validata btc-link" @click="goPath('/validate/identity', name_activated,false)" :class="{'btc-active': !this.name_activated}">
                  {{$t("auth.real_name")}}
                </span>
              </div>
              <div class="col-md-12">
                {{$t("member_center.completion_of_real_name_authentication")}}
              </div>
            </div>
             <div class="col-md-12">
              <div >
                <strong>{{$t("auth.level.level_3")}}</strong>
              </div>
              <div class=" btc-marginT20">
                <img src="~Img/right.png" v-if='this.name_activated'>
                <span class='btc-member-step' v-else>
                    3
                </span>
              </div>
            </div>
          </div>
          <!-- <div class="col-sm-6 col-md-3 btc-b-r">
            <div class="btc-r-border">
              <div >
                <img src="~Img/wechat.jpg">
              </div>
            <div >
              <span class="btc-member-validata btc-link">
                双渠道追加认证（可选）
              </span>
            </div>
            <div >
              请用kakaopay认证保障交易安全
            </div>
            </div>
             <div class="col-md-12">
            <div >
              等级4
            </div>
            <div class=" btc-marginT20">
                <img src="~Img/right.png" v-if='this.wexin_activated'>
                <span class='btc-member-step' v-else>
                    4
                </span>
            </div>
          </div>
          </div> -->
        </div>
    </div>
    <basic-table :table='getLoginRecord'>
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
    <basic-table :table='getRecommendCount'>
      <div slot="more" class="text-center btc-b-t btc-table-more">
        <a :href="`${HOST_URL}/member/referral`" class="btc-link ">{{$t('member_center.show_more')}}</a>
      </div>
    </basic-table>
    <basic-table :table='getRecommendUser'>
      <div slot="more" class="text-center btc-b-t btc-table-more">
        <a :href="`${HOST_URL}/member/referral`" class="btc-link ">{{$t('member_center.show_more')}}</a>
      </div>
    </basic-table>
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
      email_sent_message: '邮件发送成功，请前往您的邮箱激活账号',
      tickets: []
    }
  },
  methods: {
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
        if (d.data.status_code === '0') {
          this.prompt = d.data.errors
          this.PopupBoxDisplay(this.email_sent_message)
        } else {
          this.PopupBoxDisplay(this.email_sent_message)
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
        this.getTicket()
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
