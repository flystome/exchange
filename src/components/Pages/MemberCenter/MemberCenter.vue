<template>
  <div class="container btc-member-center">
    <div class="row btc-container-block btc-member-p12">
      <div class="col-md-6">
          <img src="static/img/avatar.jpg" class="img-circle btc-member-avatar">
          <div class="btc-member-info">
            <span class="btc-member-infoEmail">{{ data.email }}</span>
            <span class="label label-default">未认证</span>
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
          <div class="col-md-3 btc-b-r">
            <div class="btc-r-border">
              <div class="row">
                <img class='btc-marginT5' src="static/img/letter.jpg">
              </div>
              <div class="row ">
                <span class="btc-member-validata btc-link">
                  邮箱验证
                </span>
              </div>
              <div class="row">
                {{ data.email }}
              </div>
            </div>
            <div class="col-md-12">
              <div class="row">
                等级1
              </div>
              <div class="row btc-marginT20">
                <img src="static/img/right.jpg">
              </div>
            </div>
          </div>
        <div class="col-md-3 btc-b-r">
            <div class="btc-r-border">
              <div class="row">
                <img src="static/img/phone.jpg">
              </div>
              <div class="row">
                <span class="btc-member-validata btc-link btc-marginR10">
                    手机验证
                  </span>
                <span class="btc-member-validata btc-link btc-marginL10">
                    谷歌验证
                </span>
              </div>
              <div class="row">
                用于KRW提现的银行账户认证
              </div>
            </div>
            <div class="col-md-12">
              <div class="row">
                等级1
              </div>
              <div class="row btc-marginT20">
                <img src="static/img/right.jpg">
              </div>
            </div>
        </div>
          <div class="col-md-3 btc-b-r">
            <div class="btc-r-border">
              <div class="row">
                <img src="static/img/authentication.jpg">
              </div>
              <div class="row">
                <span class="btc-member-validata btc-link">
                  实名认证
                </span>
              </div>
              <div class="row">
                用于KRW提现的银行账户认证
              </div>
            </div>
             <div class="col-md-12">
              <div class="row">
                等级1
              </div>
              <div class="row btc-marginT20">
                <img src="static/img/right.jpg">
              </div>
            </div>
          </div>
          <div class="col-md-3 btc-b-r">
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
              等级1
            </div>
            <div class="row btc-marginT20">
              <img src="static/img/right.jpg">
            </div>
          </div>
          </div>
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
       <div class="btc-member-qContainer" v-for="(data, index) in handleRecord" :key="index">
          <div class="btc-member-question">
            {{data.question}}
            <span class="btc-member-qTime">{{data.qTime}}</span>
          </div>
          <div class="btc-member-qTitle">
            {{data.qTitle}}
          </div>
          <div class="btc-member-qContext" v-html="data.qContext">
          </div>
        </div>
    </div>
    <basic-table :table='RecommendCount'></basic-table>
    <basic-table :table='RecommendUser'></basic-table>
  </div>
</template>
<script>
import BasicTable from 'Components/BasicTable/BasicTable'
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
    this._post({
      url: '/settings/member_data.json',
      data: {
        member_id: 326
      }
    }, (d) => {
      var data = d.data
      this.data = data
      this.LoginRecord = {
        captionTitle: '登录记录（最近5条）',
        Item: [{content: ['登录时间', 'ip', '登陆所在地']}].concat(this.data.recent_signin_histories.map(d => {
          return {
            content: [
              this.$moment(d.created_at).format('L h:mm:ss'),
              d.ip,
              d.location
            ]
          }
        }))
      }
      this.RecommendCount = {
        captionTitle: '推荐统计',
        Item: [{content: ['日期', '用户数', '新用户', '页面浏览', '跳出率']}].concat(this.data.referral_datas.map(d => {
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
      }
      this.RecommendUser = {
        captionTitle: '推荐的用户数',
        Item: [{content: ['账户', 'ip 地址', '登录所在地', '浏览器', '注册时间', '是否激活']}].concat(this.data.referral_signup_history.map((_, index) => {
          return {
            content: [
              data.referral_signup_history[index].member_id,
              data.referral_signup_history[index].location,
              data.referral_signup_history[index].ip,
              browser(data.recent_signin_histories[index].ua),
              this.$moment(data.referrals[index].created_at).format('L h:mm:ss'),
              data.referrals[index].activated ? '是' : '否'
            ]
          }
        }))
      }
      this.tickets = []
    })
  },
  data () {
    return {
      data: '',
      LoginRecord: '',
      RecommendCount: '',
      RecommendUser: '',
      handleRecord: [{
        question: '提币问题',
        qTime: '2018-01-15 22:25:49',
        qTitle: '提币一般多长时间完成？貌似等了很久了。',
        qContext: '如果您的提币申请被审核但未收到，则是区块确认问题：区块确认时间一般为10分钟-1小时不等，因区块链网络原因还有可能时间更长，请您耐心等待'
      },
      {
        question: '提币问题',
        qTime: '2018-01-15 22:25:49',
        qTitle: '提币一般多长时间完成？貌似等了很久了。',
        qContext: '如果您的提币申请被审核但未收到，则是区块确认问题：<br>区块确认时间一般为10分钟-1小时不等，因区块链网络原因还有可能时间更长，请您耐心等待'
      }]
    }
  },
  components: {
    BasicTable
  }
}
</script>

<style>
@import './MemberCenter.css'
</style>
