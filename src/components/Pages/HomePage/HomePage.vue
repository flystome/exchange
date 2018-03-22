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
                  <p class="btc-marginB40" style="font-size: 36px">{{ $t('homepage.banner_describe1') }}</p>
                  <p style="font-size: 24px">{{ $t('homepage.banner_describe2') }}</p>
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
              <span>{{ $t('homepage.login') }}HotEx</span>
              <basic-input :validate='"email"' :placeholder="this.$t('homepage.enter_the_mailbox')" class="btc-input"></basic-input>
              <basic-input type="password" :placeholder="this.$t('homepage.enter_the_password')" class="btc-input"></basic-input>
              <basic-button class="btc-button" :text="this.$t('homepage.login')"></basic-button>
              <div>
                <a :href="`${HOST_URL}/signup`">{{ $t('homepage.free_registration') }}</a>
                <a target="_blank" class="pull-right">{{ $t('homepage.forget_the_password') }}</a>
              </div>
            </form>
          </div>
          <div class="btc-logining" v-else>
            <span>{{ $t('homepage.welcome_to_use') }}HotEx</span>
            <div class="btc-discount">
              <span style="color:#999999">{{ $t('homepage.discounts_of_transaction_costs') }}</span>
              <span>9{{ $t('homepage.discount') }}</span>
            </div>
            <div class="btc-marginT20">
              <span style="color:#999999">{{ $t('homepage.total_asset_estimation') }}</span>
              <span v-if="open">BTC=4.7361
                <img class="pull-right" src="~Img/open.png" @click="displaystate">
              </span>
              <span v-else>
                *******
                <img class="pull-right" @click="displaystate" src="~Img/hide.png">
              </span>
            </div>
            <div class="btc-marginT25">
              <basic-button class="btc-button" :text="$t('homepage.deposit')"></basic-button>
              <basic-button class="btc-button pull-right" :text="$t('homepage.withdraw')"></basic-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container btc-homepage-main">
      <div class="btc-homepage-markets btc-marginT30">
        <basic-button v-for="(item,index) in currency" :data-id="item" :key="item" class="btc-button pull-left" :class="{'btc-active':!(currencyindex == index)}"
        @click.native="changemarket(index,item)" :text="`${item.toUpperCase()} ${$t('homepage.trading_area')}`"></basic-button>
        <div class="btc-homepage-search btc-fr btc-b">
          <input v-model="search" class="btc-search" :placeholder='$t("homepage.search")' />
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
          <span>{{ $t('homepage.trading_platform') }}</span>
        </div>
        <span class="col-xs-4 pull-right btc-marginT10"></span>
      </div>
      <div class="btc-homepage-info btc-marginT25 text-center">
        <a class="col-xs-2 col-xs-offset-1">
          <img src="~Img/homepage-us.png" alt="">
          <span class="btc-marginT15">{{ $t('homepage.contact_us') }}</span>
        </a>
        <a class="col-xs-2">
          <img src="~Img/homepage-api.png" alt="">
          <span class="btc-marginT15">API</span>
        </a>
        <a class="col-xs-2">
          <img src="~Img/homepage-rate.png" alt="">
          <span class="btc-marginT15">{{ $t('homepage.exchange_rate_details') }}</span>
        </a>
        <a class="col-xs-2">
          <img src="~Img/homepage-apply.png" alt="">
          <span class="btc-marginT15">{{ $t('homepage.apply_to_list') }}</span>
        </a>
        <a class="col-xs-2">
          <img src="~Img/homepage-clause.png" alt="">
          <span class="btc-marginT15">{{ $t('homepage.privacy_clause') }}</span>
        </a>
      </div>
      <div class="btc-homepage-prompt text-left">
        <div class="col-xs-8 col-xs-offset-2 btc-paddingT80">
          {{ $t('homepage.transaction_describe') }}
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
