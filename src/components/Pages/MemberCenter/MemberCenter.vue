<template>
  <div class="container btc-member-center" v-cloak>
    <div class="btc-container-block btc-member-p12">
      <div class="col-md-6">
          <a :href="`${HOST_URL}/member/edit`">
             <img src="~Img/avatar.jpg" class="img-circle btc-member-avatar">
          </a>
          <div class="btc-member-info">
            <span class="btc-member-infoEmail">{{ data.email }}</span>
              <div class="btc-member-assetCount">
                资产总量 : 0 BTC
              </div>
          </div>
      </div>
      <a class="col-md-6" :href="`${HOST_URL}/identity/edit`">
        <basic-button :text='"修改密码"' class="btc-member-bt"></basic-button>
      </a>
    </div>
    <div class=" btc-member-vc btc-paddingB40 btc-paddingT40 btc-container-block  btc-textCenter btc-marginT10">
        <div >
          <div class="col-sm-6 col-md-4 btc-b-r">
            <div class="btc-r-border">
              <div >
                <img class='btc-marginT5' src="~Img/letter.jpg">
              </div>
              <div class=" ">
                <span class="btc-member-validata btc-link" :class="{'btc-active': !data.activated}">
                    <span v-if='this.data.activated'>{{$t("auth.email")}}</span>
                    <span v-else @click="sendEmail">
                      {{$t("auth.send_email")}}
                    </span>
                  <img v-if='this.data.activated' src="~Img/validate-true.jpg" alt="已认证">
                </span>
              </div>
              <div >
                {{ data.email }}
              </div>
            </div>
            <div class="col-md-12">
              <div >
                <strong>{{$t("auth.level.level_1")}}</strong>
              </div>
              <div class=" btc-marginT20">
                <img src="~Img/right.jpg" v-if='this.data.activated'>
                <span class='btc-member-step' v-else>
                    1
                </span>
              </div>

            </div>
          </div>
        <div class="col-sm-6 col-md-4 btc-b-r btc-membercenter-google">
            <div class="btc-r-border">
              <div >
                <img src="~Img/phone.jpg">
              </div>
              <div >
                <span class="btc-member-validata btc-link btc-marginR10" :class="{'btc-active': !data.sms_activated}">
                    <span>{{ $t("auth.phone") }}</span>
                    <img v-if='this.data.sms_activated' src="~Img/validate-true.jpg" alt="已认证">
                  </span>
                <span class="btc-member-validata btc-link btc-marginL10"
                :class="{'btc-active': !data.app_activated}"
                @click="goPath('/validate/google',data && data.app_activated,false)">
                    <span>{{$t("auth.google")}}</span>
                    <img v-if='this.data.app_activated' src="~Img/validate-true.jpg" alt="已认证">
                </span>
              </div>
              <div >
                韩国用户实名认证，提现，改密等二次验证
              </div>
            </div>
            <div class="col-md-12">
              <div >
                <strong>{{$t("auth.level.level_2")}}</strong>
              </div>
              <div class=" btc-marginT20">
                <img src="~Img/right.jpg" v-if='this.data.sms_activated && this.data.app_activated'>
                <span class='btc-member-step' v-else>
                    2
                </span>
              </div>
            </div>
        </div>
          <div class="col-sm-12 col-md-4 btc-b-r btc-membercenter-identity">
            <div class="btc-r-border">
              <div >
                <img src="~Img/authentication.jpg">
              </div>
              <div >
                <span class="btc-member-validata btc-link" @click="goPath('/validate/identity', name_activated,false)" :class="{'btc-active': !this.name_activated}">
                  {{$t("auth.real_name")}}
                </span>
              </div>
              <div >
                非韩国国籍用户完成实名认证方式。
              </div>
            </div>
             <div class="col-md-12">
              <div >
                <strong>{{$t("auth.level.level_3")}}</strong>
              </div>
              <div class=" btc-marginT20">
                <img src="~Img/right.jpg" v-if='this.name_activated'>
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
                <img src="~Img/right.jpg" v-if='this.wexin_activated'>
                <span class='btc-member-step' v-else>
                    4
                </span>
            </div>
          </div>
          </div> -->
        </div>
    </div>
    <basic-table :table='LoginRecord'>
      <span slot="remark" class="btc-tableRemark">如有问题请及时联系我们</span>
    </basic-table>
    <div class="btc-member-handleRecord  btc-container-block">
      <header class="btc-member-blockHeader">
        <span class="btc-member-handleCount"><strong>客服处理记录</strong></span>
        <a class="btc-member-handleServer btc-link" :href="`${HOST_URL}/tickets?closed=true`">查看已结束服务单</a>
      </header>
       <div class="btc-member-qContainer" v-for="(data, index) in tickets" :key="index" @click="toTickets(data.id)">
          <div class="btc-member-question">
            {{data.content}}
            <span class="btc-member-qTime">{{ data.created_at | moment }}</span>
          </div>
          <div class="btc-member-qTitle btc-marginB5">
            {{data.title}}
          </div>
        </div>
        <div class="text-center btc-table-record" v-if="this.tickets.length === 0">
            <div>
                <div class="btc-marginT15 btc-font12 btc-color999">暂无记录</div>
            </div>
        </div>
      <div slot="more" class="text-center btc-table-more col-md-6">
        <a :href="`${HOST_URL}/tickets`" class="btc-link ">显示更多</a>
      </div>
      <div slot="more" class="text-center btc-table-more btc-b-l col-md-6">
        <a :href="`${HOST_URL}/tickets/new`" class="btc-link ">新建我的问题</a>
      </div>
    </div>
    <basic-table :table='RecommendCount'>
      <div slot="more" class="text-center btc-b-t btc-table-more">
        <a :href="`${HOST_URL}/member/referral`" class="btc-link ">查看更多</a>
      </div>
    </basic-table>
    <basic-table :table='RecommendUser'>
      <div slot="more" class="text-center btc-b-t btc-table-more">
        <a :href="`${HOST_URL}/member/referral`" class="btc-link ">查看更多</a>
      </div>
    </basic-table>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import moment from 'moment'
import BasicTable from 'Components/BasicTable/BasicTable'
moment.locale('zh-cn')

var bser = (explorer) => {
  if (explorer.indexOf('MSIE') >= 0) {
    return 'IE'
  } else if (explorer.indexOf('Firefox') >= 0) {
    return '火狐浏览器'
  } else if (explorer.indexOf('Chrome') >= 0) {
    return '谷歌浏览器'
  } else if (explorer.indexOf('Opera') >= 0) {
    return '欧朋浏览器'
  } else if (explorer.indexOf('Safari') >= 0) {
    return 'Safari浏览器'
  } else if (explorer.indexOf('Netscape') >= 0) {
    return 'Netscape浏览器'
  }
}
export default {
  name: 'MemberCenter',
  data () {
    return {
      HOST_URL: process.env.HOST_URL,
      name_activated: false,
      wexin_activated: false,
      email_sent_message: '邮件发送成功，请前往您的邮箱激活账号',
      data: '',
      LoginRecord: {
        captionTitle: '登录记录（最近5条）',
        Item: ''
      },
      RecommendCount: {
        captionTitle: '推荐统计',
        Item: ''
      },
      RecommendUser: {
        captionTitle: '推荐的用户数',
        Item: ''
      },
      tickets: []
    }
  },
  methods: {
    ...mapMutations(['PopupBoxDisplay']),
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
    }
  },
  computed: {
    ...mapGetters(['loginData'])
  },
  filters: {
    moment (date) {
      return moment(date).format('L H:mm:ss')
    }
  },
  components: {
    BasicTable
  },
  watch: {
    loginData (d) {
      if (d.errors) {
        document.location.href = `${this.HOST_URL}/signin`
      } else {
        var data = d
        this.data = data
        data.recent_signin_histories.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
        this.data.recent_signin_histories.length === 0 ? this.LoginRecord.Item = '' : this.LoginRecord.Item = [{content: ['登录时间', 'ip地址', '登陆所在地']}].concat(this.data.recent_signin_histories.map(d => {
          return {
            content: [
              this.$moment(d.created_at).format('L H:mm:ss'),
              d.ip,
              d.location
            ]
          }
        }))

        data.referral_datas.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
        this.data.referral_datas.length === 0 ? this.RecommendCount.Item = '' : this.RecommendCount.Item = [{content: ['日期', '用户数', '新用户', '页面浏览', '跳出率']}].concat(this.data.referral_datas.map(d => {
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

        data.referral_signup_history.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
        data.referrals.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
        this.data.referral_signup_history.length === 0 ? this.RecommendUser.Item = '' : this.RecommendUser.Item = [{content: ['账户', 'ip 地址', '登录所在地', '浏览器', '注册时间', '是否激活']}].concat(this.data.referral_signup_history.map((_, index) => {
          return {
            content: [
              data.referral_signup_history[index].member_id,
              data.referral_signup_history[index].ip,
              data.referral_signup_history[index].location ? data.referral_signup_history[index].location : '占无',
              bser(data.recent_signin_histories[index].ua),
              this.$moment(data.referrals[index].created_at).format('L H:mm:ss'),
              data.referrals[index].activated ? '是' : '否'
            ]
          }
        }))
        this.tickets = data.tickets
      }
    }
  }
}
</script>

<style scoped lang='scss'>
@import './MemberCenter.scss'
</style>
