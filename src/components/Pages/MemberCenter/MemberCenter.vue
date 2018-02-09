<template>
  <div class="container btc-member-center">
    <div class="row btc-container-block btc-member-p12">
      <div class="col-md-6">
          <img src="static/img/avatar.jpg" class="img-circle btc-member-avatar">
          <div class="btc-member-info">
            <span class="btc-member-infoEmail">{{ data.email }}</span>
              <div class="btc-member-assetCount">
                资产总量 : 0.69845550 BTC
              </div>
          </div>
      </div>
      <div class="col-md-6">
        <basic-button :text='"修改密码"' class="btc-member-bt"></basic-button>
      </div>
    </div>
    <div class="row btc-member-vc btc-container-block btc-member-p12 btc-textCenter btc-marginT10">
        <div class="row btc-paddingT25">
          <div class="col-sm-6 col-md-4 btc-b-r">
            <div class="btc-r-border">
              <div class="row">
                <img class='btc-marginT5' src="static/img/letter.jpg">
              </div>
              <div class="row ">
                <span class="btc-member-validata btc-link">
                    <span>{{$t("auth.email")}}</span>
                  <img v-if='this.data.activated' src="~Img/validate-true.jpg" alt="已认证">
                </span>
              </div>
              <div class="row">
                {{ data.email }}
              </div>
            </div>
            <div class="col-md-12">
              <div class="row">
                {{$t("auth.level.level_1")}}
              </div>
              <div class="row btc-marginT20">
                <img src="static/img/right.jpg" v-if='this.data.activated'>
                <span class='btc-member-step' v-else>
                    1
                </span>
              </div>

            </div>
          </div>
        <div class="col-sm-6 col-md-4 btc-b-r">
            <div class="btc-r-border">
              <div class="row">
                <img src="static/img/phone.jpg">
              </div>
              <div class="row">
                <span class="btc-member-validata btc-link btc-marginR10">
                    <span>手机验证</span>
                    <img v-if='this.data.sms_activated' src="~Img/validate-true.jpg" alt="已认证">
                  </span>
                <span class="btc-member-validata btc-link btc-marginL10">
                    <span>谷歌验证</span>
                    <img v-if='this.data.app_activated' src="~Img/validate-true.jpg" alt="已认证">
                </span>
              </div>
              <div class="">
                韩国用户实名认证，提现，改密等二次验证
              </div>
            </div>
            <div class="col-md-12">
              <div class="row">
                {{$t("auth.level.level_2")}}
              </div>
              <div class="row btc-marginT20">
                <img src="static/img/right.jpg" v-if='this.data.sms_activated && this.data.app_activated'>
                <span class='btc-member-step' v-else>
                    2
                </span>
              </div>
            </div>
        </div>
          <div class="col-sm-12 col-md-4 btc-b-r">
            <div class="btc-r-border">
              <div class="row">
                <img src="static/img/authentication.jpg">
              </div>
              <div class="row">
                <span class="btc-member-validata btc-link">
                  实名认证
                </span>
              </div>
              <div class="">
                非韩国国籍用户完成实名认证方式。
              </div>
            </div>
             <div class="col-md-12">
              <div class="row">
                {{$t("auth.level.level_3")}}
              </div>
              <div class="row btc-marginT20">
                <img src="static/img/right.jpg" v-if='this.name_activated'>
                <span class='btc-member-step' v-else>
                    3
                </span>
              </div>
            </div>
          </div>
          <!-- <div class="col-sm-6 col-md-3 btc-b-r">
            <div class="btc-r-border">
              <div class="row">
                <img src="static/img/wechat.jpg">
              </div>
            <div class="row">
              <span class="btc-member-validata btc-link">
                双渠道追加认证（可选）
              </span>
            </div>
            <div class="row">
              请用kakaopay认证保障交易安全
            </div>
            </div>
             <div class="col-md-12">
            <div class="row">
              等级4
            </div>
            <div class="row btc-marginT20">
                <img src="static/img/right.jpg" v-if='this.wexin_activated'>
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
    <div class="row btc-member-handleRecord btc-member-p12 btc-container-block">
      <header class="btc-member-blockHeader">
        <span class="btc-member-handleCount"><strong>客服处理记录</strong></span>
        <a class="btc-member-handleServer btc-link">查看已结束服务单</a>
        <a class="btc-member-handleNew btc-link"><img src="static/img/center_new.png" alt="新建问题">新建我的问题</a>
      </header>
       <div class="btc-member-qContainer" v-for="(data, index) in tickets" :key="index">
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
                <img src="~Img/norecord.png" >
                <div class="btc-marginT15">占无记录</div>
            </div>
        </div>
    </div>
    <basic-table :table='RecommendCount'></basic-table>
    <basic-table :table='RecommendUser'></basic-table>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import BasicTable from 'Components/BasicTable/BasicTable'
moment.locale('zh-cn')

var browser = (explorer) => {
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
  created () {
    this.$store.dispatch('getData')
  },
  data () {
    return {
      name_activated: false,
      wexin_activated: false,
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
  computed: {
    ...mapGetters(['loginData'])
  },
  filters: {
    moment (date) {
      return moment(date).format('L h:mm:ss')
    }
  },
  components: {
    BasicTable
  },
  watch: {
    loginData (d) {
      if (d.errors) {
        // this.$router.push({
        //   path: '/login'
        // })
      } else {
        var data = d
        this.data = data
        this.data.recent_signin_histories.length === 0 ? this.LoginRecord.Item = '' : this.LoginRecord.Item = [{content: ['登录时间', 'ip', '登陆所在地']}].concat(this.data.recent_signin_histories.map(d => {
          return {
            content: [
              this.$moment(d.created_at).format('L h:mm:ss'),
              d.ip,
              d.location
            ]
          }
        }))
        this.data.referral_datas.length === 0 ? this.RecommendCount.Item = '' : this.RecommendCount.Item = [{content: ['日期', '用户数', '新用户', '页面浏览', '跳出率']}].concat(this.data.referral_datas.map(d => {
          return {
            content: [
              this.$moment(d.created_at).format('L h:mm:ss'),
              d.users,
              d.new_users,
              d.page_views,
              d.bounce_rate
            ]
          }
        }))
        this.data.referral_signup_history.length === 0 ? this.RecommendUser.Item = '' : this.RecommendUser.Item = [{content: ['账户', 'ip 地址', '登录所在地', '浏览器', '注册时间', '是否激活']}].concat(this.data.referral_signup_history.map((_, index) => {
          return {
            content: [
              data.referral_signup_history[index].member_id,
              data.referral_signup_history[index].ip,
              data.referral_signup_history[index].location ? data.referral_signup_history[index].location : '占无',
              browser(data.recent_signin_histories[index].ua),
              this.$moment(data.referrals[index].created_at).format('L h:mm:ss'),
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

<style>
@import './MemberCenter.css'
</style>
