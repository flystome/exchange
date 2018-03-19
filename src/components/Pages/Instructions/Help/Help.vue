<template>
  <div>
    <div class="btc-help">
      <BasicInstructions :search='"尽我所能 为您解答"'></BasicInstructions>
    </div>
    <div class="btc-questionlist btc-paddingL50 btc-paddingR30">
      <div class="btc-question">
        <p><strong>账户访问</strong><span class="pull-right">浏览4321</span></p>
        <ul class="btc-paddingL0">
          <li><a>1.如何手机认证</a></li>
          <li><a>2.如何邮箱认证</a></li>
          <li><a>3.如何实名认证</a></li>
          <li><a>4.如何设置谷歌验证码</a></li>
        </ul>
      </div>
      <div class="btc-question">
        <p><strong>充币提币</strong><span class="pull-right">浏览3652</span></p>
        <ul class="btc-paddingL0">
          <li><a>1.如何充币</a></li>
          <li><a>2.如何提币</a></li>
        </ul>
      </div>
      <div class="btc-question">
        <p><strong>币币交易</strong><span class="pull-right">浏览36587</span></p>
        <ul class="btc-paddingL0">
          <li><a>1.使用说明</a></li>
          <li><a>2.交易操作流程</a></li>
          <li><a>3.交易限额</a></li>
          <li><a>4.如何设置谷歌验证码</a></li>
        </ul>
      </div>
      <div class="more text-center btc-paddingT15">
        <a>查看更多</a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.btc-help /deep/ .btc-listheader .btc-bg h2{
  line-height: 32px;
  padding-top: 55px;
}
a{
  color: #3e81ff;
  &:hover{
    text-decoration: none;
    cursor: pointer;
  }
}
.btc-questionlist{
  background-color: #fff;
  .btc-question{
    padding: 20px 0;
    border-bottom: 1px solid #f2f2f2;
    >p{
      color: #333333;
      >span{
        font-size: 12px;
        color: #999999;
      }
    }
    >ul{
      margin: 0;
      >li{
        padding-top: 10px;
      }
    }
  }

}
</style>
