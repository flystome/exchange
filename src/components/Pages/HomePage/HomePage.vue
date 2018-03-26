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
              <basic-input :validate='"password"' :placeholder="this.$t('homepage.enter_the_mailbox')" class="btc-input"></basic-input>
              <basic-button class="btc-button" :text="this.$t('homepage.login')"></basic-button>
              <div>
                <a :href="`${HOST_URL}/signup`">{{ $t('homepage.free_registration') }}</a>
                <a :class='{"pull-right": language !=="en", "btc-homepage-block": language!=="zh-TW"}' class="btc-pointer">{{ $t('homepage.forget_the_password') }}</a>
              </div>
            </form>
          </div>
          <div class="btc-logining" v-else>
            <span>{{ $t('homepage.welcome_to_use') }}HotEx</span>
            <div class="btc-discount">
              <span style="color:#999999">{{ $t('homepage.discounts_of_transaction_costs') }}</span>
              <span>{{ factor }}{{ $t('homepage.discount') }}</span>
            </div>
            <div class="btc-marginT20">
              <span style="color:#999999">{{ $t('homepage.total_asset_estimation') }}</span>
              <span v-if="open">BTC={{ btc_worth }}
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
        @click.native="changemarket(index,item)" :text="item === 'my_optional' ? $t('homepage.my_optional') : `${item.toUpperCase()} ${$t('homepage.trading_area')}`"></basic-button>
        <div class="btc-homepage-search btc-fr btc-b">
          <input v-model="search" class="btc-search" :placeholder='$t("homepage.search")' />
          <img src="~Img/search.png" >
        </div>
        <HomeMarket :trend='trend' :search='search' :currency='currency[currencyindex]' :curData = "curData[currencyindex]"></HomeMarket>
      </div>
      <div class="btc-homepage-logo text-center">
        <img src="~Img/logo.png" >
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
          <img src="~Img/homepage-us.png" >
          <span class="btc-marginT15">{{ $t('homepage.contact_us') }}</span>
        </a>
        <a class="col-xs-2">
          <img src="~Img/homepage-api.png" >
          <span class="btc-marginT15">API</span>
        </a>
        <a class="col-xs-2">
          <img src="~Img/homepage-rate.png" >
          <span class="btc-marginT15">{{ $t('homepage.exchange_rate_details') }}</span>
        </a>
        <a class="col-xs-2">
          <img src="~Img/homepage-apply.png" width="56" height="56">
          <span class="btc-marginT15">{{ $t('homepage.apply_to_list') }}</span>
        </a>
        <a class="col-xs-2">
          <img src="~Img/homepage-clause.png" >
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
import { mapGetters, mapState } from 'vuex'
import HomeMarket from './HomeMarket/HomeMarket'
export default {
  name: 'homepage',
  created () {
    this._get({
      url: '/home/funds.json'
    }, (d) => {
      d = d.data.success
      if (!d.commission_level) return
      this.factor = d.commission_level.factor * 10
      this.btc_worth = Number(d.total_assets.btc_worth).toFixed(2)
    })
    this._get({
      url: '/k/trends/trends.json'
    }, (d) => {
      this.trend = d.data
    })
  },
  data () {
    return {
      trend: [],
      HOST_URL: process.env.HOST_URL,
      btc_worth: '',
      factor: '',
      currencyindex: 0,
      search: '',
      open: true,
      currency: ['usdt', 'btc', 'eth', 'my_optional'],
      getetc: '',
      change: 'no',
      curData: []
    }
  },
  components: {
    HomeMarket
  },
  methods: {
    displaystate () {
      this.open = !this.open
    },
    requireImg (img) {
      return require(`../../../../static/img/${img}.png`)
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
  watch: {
    marketData () {
      if (this.marketData) {
        this.curData = []
        this.curData.push(this.getItem(this.marketData['usdt']))
        this.curData.push(this.getItem(this.marketData['btc']))
        this.curData.push(this.getItem(this.marketData['eth']))
        console.log(this.marketData)
      }
    }
  },
  computed: {
    ...mapGetters(['loginData']),
    ...mapState(['marketData', 'language'])
  }
}
</script>
<style scoped lang="scss">
@import "./HomePage.scss"
</style>
