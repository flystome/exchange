<template>
  <div>
    <div class="btc-homepage-header">
      <div id="carousel-example-generic" class="carousel slide" data-ride="carousel" data-interval="1000">
          <ol class="carousel-indicators">
            <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
            <li data-target="#carousel-example-generic" data-slide-to="1"></li>
          </ol>
          <div class="carousel-inner" role="listbox">
            <div class="item active" :style="{background:`url('${requireImg('silde1')}') 50% 50% no-repeat`}">
              <div class="container">
                <div class="btc-slide-info">
                  <p class="btc-marginB40" style="font-size: 36px">온라인 품질 블록 체인 프로젝트</p>
                  <p style="font-size: 24px">최고의 투자 채널을 제공하기 위해</p>
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
          <div class="btc-nologin" v-if="loginData === '' || loginData.errors">
          <!-- <div class="btc-nologin"> -->
            <form>
              <span>登录HOTEX</span>
              <basic-input :type='"email"' placeholder="输入邮箱" class="btc-input"></basic-input>
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
    <div class="container">
      <div class="btc-homepage-markets btc-marginT30">
        <basic-button v-for="(item,index) in currency" :data-id="item" :key="index" class="btc-button pull-left" :class="{'btc-active':!(indexs==index)}"
        @click.native="currencyTab(index,item)" :text='item+"交易区"'></basic-button>
        <basic-input class="pull-right btc-search" placeholder='搜索'>
          <img src="~Img/search.png" alt="">
        </basic-input>
        <table class="table">
          <thead>
            <tr>
              <th>币种对</th>
              <th>价格USDT</th>
              <th>交易量(USDT)</th>
              <th>总市值(USDT)</th>
              <th style="cursor:  pointer;" @click="werw" class="upordpwn">
                日涨跌
                  <img v-if="change === 'no'" src="~Img/both.png" alt="">
                  <img v-else-if="!change" src="~Img/up.png" alt="">
                  <img v-else-if="change" src="~Img/down.png" alt="">
              </th>
              <th>价格趋势</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for='(item , index) in getetc' :key='index'>
              <td>
                <a class="btc-homepage-currency">
                  <div>
                    <!-- <img :src="requireImg(`market-${item[`${Object.keys(item)[0]}`].name.split('/')[0].toLowerCase()}`)"> -->
                  </div>
                  <div>
                    <b>{{ item[`${Object.keys(item)[0]}`].name }}</b>
                  </div>
                </a>
              </td>
              <td>
                <span>{{ item[`${Object.keys(item)[0]}`].last }}<span style="color:#999">/${{ item[`${Object.keys(item)[0]}`].legal_worth }}</span></span>
              </td>
              <td>{{ item[`${Object.keys(item)[0]}`].volume }}</td>
              <td>{{ (item[`${Object.keys(item)[0]}`].volume*item[`${Object.keys(item)[0]}`].last).toFixed(2) }}</td>
              <td>
                <div style="color:#fd4041" v-if="item[`${Object.keys(item)[0]}`].percent>0">+{{ item[`${Object.keys(item)[0]}`].percent.toFixed(2) }}%</div>
                <div style="color:#00c4a2" v-else-if="item[`${Object.keys(item)[0]}`].percent<0">-{{ item[`${Object.keys(item)[0]}`].percent.toFixed(2) }}%</div>
                <div style="color:#999999" v-else>+{{ item[`${Object.keys(item)[0]}`].percent.toFixed(2) }}</div>
              </td>
              <td></td>
              <td>
                <a>交易</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="btc-homepage-logo text-center">
        <img src="~Img/logo.png" alt="">
      </div>
      <div class="btc-homepage-intr btc-marginT15 btc-marginB100">
        <span class="col-md-4 btc-marginT10"></span>
        <div class="col-md-4 text-center">
          <span>权威化透明化的数字资产交易平台</span>
        </div>
        <span class="col-md-4 pull-right btc-marginT10"></span>
      </div>
      <div class="btc-homepage-info btc-marginT25 text-center">
        <a class="col-md-2 col-md-offset-1">
          <img src="~Img/homepage-us.png" alt="">
          <span class="btc-marginT15">联系我们</span>
        </a>
        <a class="col-md-2">
          <img src="~Img/homepage-api.png" alt="">
          <span class="btc-marginT15">API</span>
        </a>
        <a class="col-md-2">
          <img src="~Img/homepage-rate.png" alt="">
          <span class="btc-marginT15">汇率详情</span>
        </a>
        <a class="col-md-2">
          <img src="~Img/homepage-apply.png" alt="">
          <span class="btc-marginT15">上币申请</span>
        </a>
        <a class="col-md-2">
          <img src="~Img/homepage-clause.png" alt="">
          <span class="btc-marginT15">隐私条款</span>
        </a>
      </div>
      <div class="btc-homepage-prompt text-left">
        <div class="col-md-8 col-md-offset-2">
          数字密码币的交易存在风险，在全球范围内一周7天，一天24小时，一年365天无休止交易，没有每日涨停跌停限制， 价格受各国政策，市场，等都在因素影响。我们强烈建议您事先调查了解在自身所能承受的风险范围内参与交易
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'homepage',
  created () {
    this.getdata('usdt')
  },
  data () {
    return {
      HOST_URL: process.env.HOST_URL,
      open: true,
      currency: ['USDT', 'BTC', 'ETH'],
      indexs: 0,
      getetc: '',
      change: 'no'
    }
  },
  methods: {
    displaystate () {
      this.open = !this.open
    },
    requireImg (img) {
      return require(`../../../../static/img/${img}.png`)
    },
    currencyTab (index, item) {
      this.indexs = index
      this.getdata(item.toLowerCase())
    },
    getdata (type) {
      this._get({ url: '/home.json',
        headers: {
          'DataType': 'application/json;charset=utf-8'
        }}, (d) => {
        this.getetc = d.data[type]
      })
    },
    werw () {
      this.change = !this.change
      console.log(this.change)
      this.changedate()
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
