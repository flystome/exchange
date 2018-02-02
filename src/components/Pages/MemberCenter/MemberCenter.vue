<template>
  <div class="container">
    <div class="row btc-member-container">
      <div class="col-md-6">
          <img src="static/img/avatar.jpg" class="img-circle btc-member-avatar">
          <div class="btc-member-info">
            <span class="btc-member-infoEmail">{{ user.email }}</span>
            <span class="label label-default">未认证</span>
              <div class="btc-member-assetCount">
                资产总量 : 0.69845550 BTC
              </div>
          </div>

      </div>
      <div class="col-md-6">
        <button class="btc-member-bt">修改密码</button>
      </div>
    </div>
    <div class="row btc-member-container btc-textCenter btc-marginT10">
        <div class="row">
          <div class="col-md-3">
            <div class="btc-r-border">
              <div class="row">
                <img src="static/img/letter.jpg">
              </div>
              <div class="row btc-member-padding btc-link">
              邮箱验证
              </div>
              <div class="row">
                {{ user.email }}
              </div>
            </div>
            <div class="col-md-12">
              <div class="row">
                等级1
              </div>
              <div class="row btc-marginT10">
                <img src="static/img/right.jpg">
              </div>
            </div>
          </div>
          <div class="col-md-3 btc-img">
            <div class="btc-r-border">
            <div class="raw">
              <img src="static/img/phone.jpg" alt="">
              <div class="raw font-w btc-member-L btc-link">
                手机验证
              </div>
              <div class="raw btc-member-L">
                提现，修改密码等短信验证
              </div>
            </div>
            <div class="raw btc-marginT20">
              <img src="static/img/google.jpg" alt="">
              <div class="raw font-w btc-member-L btc-link">
                谷歌认证
              </div>
              <div class="raw btc-member-L">
                提现，修改密码等可谷歌二次验证
              </div>
            </div>
            </div>
             <div class="col-md-12 btc-textCenter">
              <div class="row">
                等级1
              </div>
              <div class="row btc-marginT10">
                <img src="static/img/right.jpg">
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="btc-r-border">
              <div class="row">
                <img src="static/img/authentication.jpg">
              </div>
              <div class="row btc-member-padding btc-link">
              实名认证
              </div>
              <div class="row">
                用于KRW提现的银行账户认证
              </div>
            </div>
             <div class="col-md-12">
              <div class="row">
                等级1
              </div>
              <div class="row btc-marginT10">
                <img src="static/img/right.jpg">
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="btc-r-border">
              <div class="row">
                <img src="static/img/wechat.jpg">
              </div>
            <div class="row btc-member-padding btc-link">
              双渠道追加认证（可选）
            </div>
            <div class="row">
              请用kakaopay认证保障交易安全
            </div>
            </div>
             <div class="col-md-12">
            <div class="row">
              等级1
            </div>
            <div class="row btc-marginT10">
              <img src="static/img/right.jpg">
            </div>
          </div>
          </div>
        </div>

    </div>
    <basic-table :table='LoginRecord'>
      <span slot="remark" class="btc-tableRemark">如有问题请及时联系我们</span>
    </basic-table>
    <div class="row btc-member-handleRecord btc-member-container">
      <header class="btc-member-blockHeader">
        <span class="btc-member-handleCount font-w">客服处理记录</span>
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
const url = 'http://192.168.1.114:3000'
export default {
  name: 'MemberCenter',
  created () {
    let that = this
    this.$ajax({
      method: 'post',
      url: `${url}/settinggs/user_data`,
      data: {
        member_id: that.$route.query.member_id
      }
    }).then(d => d)
  },
  data () {
    return {
      user: {
        email: '80834004@qq.com'
      },
      LoginRecord: {
        captionTitle: '登录记录（最近5条）',
        Item: [{content: ['登录时间', 'ip', '登陆所在地']}].concat(new Array(5).fill({
          content: ['2018-01-23 18:04:57', '192.168.1.110', 'Shenzhen China']
        }))
      },
      RecommendCount: {
        captionTitle: '推荐统计',
        Item: new Array(5).fill({
          content: ['2018-01-23', '123456465', '1', '1.2H', '32%']
        })
      },
      RecommendUser: {
        captionTitle: '推荐的用户数',
        Item: new Array(5).fill({
          content: ['2018-01-23', '192.168.1.110', 'Shenzhen China', '谷歌浏览器', '2018-01-23 18:04:57', '是']
        })
      },
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
