<template>
  <div>
    <div class="btc-homepage-header">
      <div id="carousel-example-generic" class="carousel slide" data-ride="carousel" data-interval="3500">
          <ol class="carousel-indicators">
            <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
            <li data-target="#carousel-example-generic" data-slide-to="1"></li>
          </ol>
          <div class="carousel-inner" role="listbox">
            <div class="item active" :style="{background:`url('${requireImg('silde1')}') 50% 50% no-repeat`}">
              <div class="container">
                <div class="btc-slide-info">
                  <p class="btc-marginB40" style="font-size: 36px">Online quality block chain project</p>
                  <p style="font-size: 24px">To provide the best investment channel</p>
                </div>
              </div>
            </div>
            <div class="item" :style="{background:`url('${requireImg('silde2')}') 50% 50% no-repeat`}">
              <div class="carousel-caption">
              </div>
            </div>
          </div>
        </div>
      <div class="container">
        <div class="btc-homepage-login">
          <div class="btc-nologin" v-if="loginData === 'none' || loginData.errors">
          <!-- <div class="btc-nologin"> -->
            <form>
              <span>登录HOTEX</span>
              <basic-input :validate='"email"' placeholder="输入邮箱" class="btc-input"></basic-input>
              <basic-input type="password" placeholder="输入密码" class="btc-input"></basic-input>
              <basic-button class="btc-button" :text='"登录"'></basic-button>
              <div>
                <a :href="`${HOST_URL}/signup`">免费注册</a>
                <a target="_blank" class="pull-right">忘记密码</a>
              </div>
            </form>
          </div>
          <div class="btc-logining" v-else>
            <span>欢迎使用HotEx</span>
            <div class="btc-discount">
              <span style="color:#999999">交易费折扣</span>
              <span>9折</span>
            </div>
            <div class="btc-marginT20">
              <span style="color:#999999">资产总估</span>
              <span v-if="open">BTC=4.7361
                <img class="pull-right" src="~Img/open.png" @click="displaystate" alt="" >
              </span>
              <span v-else>
                *******
                <img class="pull-right" @click="displaystate" src="~Img/hide.png" alt="" >
              </span>
            </div>
            <div class="btc-marginT25">
              <basic-button class="btc-button" :text='"充值"'></basic-button>
              <basic-button class="btc-button pull-right" :text='"提币"'></basic-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container btc-homepage-main">
      <div class="btc-homepage-markets btc-marginT30">
        <basic-button v-for="(item,index) in currency" :data-id="item" :key="item" class="btc-button pull-left" :class="{'btc-active':!(currencyindex == index)}"
        @click.native="changemarket(index,item)" :text='item.toUpperCase()+"交易区"'></basic-button>
        <div class="btc-homepage-search btc-fr btc-b">
          <input v-model="search" class="btc-search" placeholder='搜索' />
          <img src="~Img/search.png" alt="">
        </div>
        <HomeMarket :search='search' :currency='currency[currencyindex]' :curData = "curData[currencyindex]"></HomeMarket>
      </div>
      <div class="btc-homepage-logo text-center">
        <img src="~Img/logo.png" alt="">
      </div>
      <div class="btc-homepage-intr btc-marginT15 btc-marginB100">
        <span class="col-xs-4 btc-marginT10"></span>
        <div class="col-xs-4 text-center">
          <span>权威化透明化的数字资产交易平台</span>
        </div>
        <span class="col-xs-4 pull-right btc-marginT10"></span>
      </div>
      <div class="btc-homepage-info btc-marginT25 text-center">
        <a class="col-xs-2 col-xs-offset-1">
          <img src="~Img/homepage-us.png" alt="">
          <span class="btc-marginT15">联系我们</span>
        </a>
        <a class="col-xs-2">
          <img src="~Img/homepage-api.png" alt="">
          <span class="btc-marginT15">API</span>
        </a>
        <a class="col-xs-2">
          <img src="~Img/homepage-rate.png" alt="">
          <span class="btc-marginT15">汇率详情</span>
        </a>
        <a class="col-xs-2">
          <img src="~Img/homepage-apply.png" alt="">
          <span class="btc-marginT15">上币申请</span>
        </a>
        <a class="col-xs-2">
          <img src="~Img/homepage-clause.png" alt="">
          <span class="btc-marginT15">隐私条款</span>
        </a>
      </div>
      <div class="btc-homepage-prompt text-left">
        <div class="col-xs-8 col-xs-offset-2 btc-paddingT80">
          数字密码币的交易存在风险，在全球范围内一周7天，一天24小时，一年365天无休止交易，没有每日涨停跌停限制， 价格受各国政策，市场，等都在因素影响。我们强烈建议您事先调查了解在自身所能承受的风险范围内参与交易
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import HomeMarket from './HomeMarket/HomeMarket'
export default {
  name: 'homepage',
  data () {
    return {
      HOST_URL: process.env.HOST_URL,
      currencyindex: 0,
      search: '',
      open: true,
      currency: ['usdt', 'btc', 'eth'],
      getetc: '',
      change: 'no',
      curData: []
    }
  },
  components: {
    HomeMarket
  },
  mounted: function () {
    this.getdata()
  },
  methods: {
    displaystate () {
      this.open = !this.open
    },
    requireImg (img) {
      return require(`../../../../static/img/${img}.png`)
    },
    getdata (type) {
      var self = this
      this._get({ url: '/home.json',
        headers: {
          'DataType': 'application/json;charset=utf-8'
        }}, (data) => {
        var getdata = JSON.parse(data.request.response)
        self.getCurData(getdata.success)
      })
    },
    getCurData: function (data) {
      this.curData = []
      this.curData.push(this.getItem(data['usdt']))
      this.curData.push(this.getItem(data['btc']))
      this.curData.push(this.getItem(data['eth']))
    },
    getItem: function (data) {
      var arr = []
      for (var i in data) {
        for (var item in data[i]) {
          arr.push(data[i][item])
        }
      }
      return arr
    },
    changemarket: function (index, item) {
      this.currencyindex = index
    },
    changedate () {
      if (this.change) {
        this.getetc.sort((q, a) => {
          return a[Object.keys(a)].percent - q[Object.keys(q)].percent
        })
      } else {
        this.getetc.sort((q, a) => {
          return q[Object.keys(q)].percent - a[Object.keys(a)].percent
        })
      }
    }
  },
  computed: {
    ...mapGetters(['loginData'])
  }
}
</script>
<style scoped lang="scss">
@import "./HomePage.scss"
</style>
