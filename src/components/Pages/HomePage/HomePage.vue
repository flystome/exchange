<template>
  <div @keyup.enter="login">
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
      <div class="from-container">
        <div class="btc-homepage-login">
          <div class="btc-nologin" v-if="loginData === 'none' || loginData.errors">
          <!-- <div class="btc-nologin"> -->
            <div class="form">
              <span>{{ $t('homepage.login') }}</span>
              <basic-input ref="email" :validate='"email"' v-model="email" :placeholder="this.$t('homepage.enter_the_mailbox')" class="btc-input"></basic-input>
              <basic-input ref="password" type='password' :validate='"password"' v-model="password" :placeholder="this.$t('homepage.enter_the_password')" class="btc-input"></basic-input>
              <basic-button :disabled='disabled' @click.native="login" class="btn btc-button" :text="this.$t('homepage.login')"></basic-button>
              <div>
                <a :href="`${HOST_URL}/signup`">{{ $t('homepage.free_registration') }}</a>
                <a :href="`${HOST_URL}/reset_passwords/new`" :class='{"pull-right": language !=="en", "btc-homepage-block": language!=="zh-TW"}' class="btc-pointer">{{ $t('homepage.forget_the_password') }}</a>
              </div>
            </div>
          </div>
          <div class="btc-logining" v-else>
            <span>{{ $t('homepage.welcome_to_use') }}
              <span>
              <router-link class="btc-link" :to="`${ROUTER_VERSION}/my_account`">
                {{loginData.show_name}}
              </router-link>
              </span>
            </span>
            <div class="btc-discount">
              <span style="color:#999999">{{ $t('homepage.discounts_of_transaction_costs') }}</span>
              <span>
                <router-link class="btc-link" :to="`${ROUTER_VERSION}/referral`">
                  {{ `${factor}%` }} {{ $t('homepage.off') }}
                </router-link>
              </span>
            </div>
            <div class="btc-marginT20">
              <span style="color:#999999">{{ $t('homepage.total_asset_estimation') }}</span>
              <span v-if="open"><i class="fa fa-btc"/> {{ btc_worth }}
                <img class="pull-right btc-pointer" src="~Img/open.png" @click="displaystate">
              </span>
              <span v-else>
                *******
                <img class="pull-right btc-pointer" @click="displaystate" src="~Img/hide.png">
              </span>
            </div>
            <div class="btc-marginT25">
              <router-link :to="`${ROUTER_VERSION}/currency/deposit`">
                <basic-button class="btc-button" :text="$t('homepage.deposit')">
                </basic-button>
              </router-link>
              <router-link :to="`${ROUTER_VERSION}/currency/withdraw`">
                <basic-button class="btc-button pull-right" :text="$t('homepage.withdraw')"></basic-button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btc-homepage-notice">
      <ul class="btc-homepage-newCoin">
        <li v-for="data in new_coin" :key='data.id'>
          <a :href="data.url">{{ data.the_title }}</a>
        </li>

      </ul>
    </div>
    <div class="btc-homepage-main">
      <div class="btc-homepage-markets btc-marginT30">
        <basic-button v-for="(item,index) in currency" :data-id="item" :key="item" class="btc-button pull-left" :class="{'btc-active':!(currencyindex == index)}"
        @click.native="changemarket(index,item)" :text="item === 'my_optional' ? $t('homepage.my_optional') : `${item.toUpperCase()} ${$t('homepage.trading_area')}`"></basic-button>
        <div @keyup.esc="search = ''" class="btc-homepage-search btc-fr btc-b">
          <input v-model="search" class="btc-search" :placeholder='$t("homepage.search")' />
          <img v-if='!search' src="~Img/search.png" >
          <img class="btc-pointer" v-else @click="search = ''" src="~Img/search-delete.png" >
        </div>
        <keep-alive>
          <HomeMarket ref="market" v-if="curData" v-on:marketChange="marketChange" :trend='trend' :search='search' :currency='currency[currencyindex]' :curData = "curData[currencyindex]">
          </HomeMarket>
          <div v-else style="position: absolute;top: 40%;left: 48%;">
            <vue-simple-spinner size="88"></vue-simple-spinner>
          </div>
        </keep-alive>
      </div>
      <div class="btc-homepage-logo text-center">
        <img src="~Img/logo.png" >
      </div>
      <div class="btc-homepage-intr btc-marginT15 btc-marginB100">
        <span class="col-xs-3 btc-marginT10"></span>
        <div class="col-xs-6 text-center">
          <span>{{ $t('homepage.trading_platform') }}</span>
        </div>
        <span class="col-xs-3 pull-right btc-marginT10"></span>
      </div>
      <div class="btc-homepage-info btc-marginT25 text-center">
        <a class="col-xs-2 col-xs-offset-1">
          <img src="~Img/homepage-us.png" >
          <span class="btc-marginT15">
            <a href="mailto:support@hotex.com">
              {{ $t('homepage.contact_us') }}
            </a>
          </span>
        </a>
        <a class="col-xs-2">
          <img src="~Img/homepage-api.png" >
          <span class="btc-marginT15">
            <a :href="`${HOST_URL}/api_tokens`">
              {{$t("my_account.api")}}
            </a>
          </span>
        </a>
        <a class="col-xs-2">
          <img src="~Img/homepage-rate.png" >
          <span class="btc-marginT15">
            <a :href="`${CmsUrl.rate_details}`">
              {{ $t('homepage.exchange_rate_details') }}
            </a>
          </span>
        </a>
        <a class="col-xs-2">
          <img src="~Img/homepage-apply.png" width="56" height="56">
          <span class="btc-marginT15">
            <a :href="CmsUrl.application">
              {{ $t('homepage.apply_to_list') }}
            </a>
          </span>
        </a>
        <a class="col-xs-2">
          <img src="~Img/homepage-clause.png" >
          <span class="btc-marginT15">
            <a :href="CmsUrl.privacy_policy">
              {{ $t('homepage.privacy_clause') }}
            </a>
          </span>
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
import { mapGetters, mapState, mapMutations } from 'vuex'
import Cookies from 'js-cookie'
import pusher from '@/common/js/pusher'
import HomeMarket from './HomeMarket/HomeMarket'
export default {
  name: 'homepage',
  created () {
    var code = Cookies.get('code')
    this.$i18n.locale = Cookies.get('locale')
    if (code) {
      if (code.match(/\d+/g)[0] === '200') {
        this.PopupBoxDisplay({message: this.$t(`my_account.200_hint`), type: 'success'})
        Cookies.remove('code')
        return
      }
      this.PopupBoxDisplay({message: this.$t(`my_account.${code.match(/\d+/g)[0]}_hint`), type: 'warn'})
      Cookies.remove('code')
    } // rails flash

    var self = this
    this._get({
      url: '/home/funds.json'
    }, (d) => {
      d = d.data.success
      if (!d.commission_factor) return
      this.factor = (10 - d.commission_factor * 10) * 10
      this.btc_worth = Number(d.total_assets.btc_worth).toFixed(2)
    }) // markets

    this._get({
      url: '/k/trends.json'
    }, (d) => {
      this.trend = d.data
    }) // trend

    this.$http.get(`${this.HOST_URL}/cms/api/announcements.json`, {
      params: {
        category: 'new-coin',
        locale: self.language,
        per_page: '8'
      }
    }).then(d => {
      self.new_coin = d.data
    }) // new_coin

    var channel = pusher.subscribe('market-global')
    channel.bind('tickers', (data) => {
      // console.log(data)
      // var obj  = Object[Object.keys(data)[0]]
      // [this.currency.indexOf(obj.base_currency)]
      Object.keys(data).forEach((key) => {
        this.curData[this.currency.indexOf(data[key].base_currency.toLowerCase())].forEach(d => {
          if (key === d.name.toLowerCase().replace('/', '')) {
            d.last = data[key].last
            d.legal_worth = data[key].legal_worth
            d.volume = data[key].volume
            d.percent = data[key].percent
          }
        })
      })
      this.$refs['market'].$emit('market')
    }) // pusher

    if (!this.markData) this.GetmarketData()
  },
  data () {
    return {
      new_coin: '',
      email: '',
      password: '',
      trend: [0, 0],
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      HOST_URL: process.env.HOST_URL,
      btc_worth: '',
      factor: '',
      currencyindex: 0,
      search: '',
      open: !Cookies.get('total_hide'),
      currency: ['usdt', 'btc', 'eth', 'my_optional'],
      getetc: '',
      change: 'no',
      curData: '',
      disabled: false
    }
  },
  components: {
    HomeMarket
  },
  methods: {
    async login () {
      const email = await this.$refs['email'].$validator.validateAll()
      const password = await this.$refs['password'].$validator.validateAll()
      if (!email || !password) {
        return
      }
      this.disabled = true
      this._post({
        url: '/sessions/log_in.json',
        data: {
          'auth_key': this.email,
          'password': this.password
        }
      }, (d) => {
        this.disabled = false
        if (d.data.success) {
          location.href = location.href
        } else {
          if (d.data.error.code === 1002) {
            location.href = `${this.HOST_URL}/signin`
            Cookies.set('status', 'captcha_error')
          } else {
            this.password = ''
            this.PopupBoxDisplay({type: 'error', message: this.$t('api_server.homepage.error_1001')})
          }
        }
      })
    },
    marketChange ({ index, type, status }) {
      if (type === 'delete') {
        this.curData[this.curData.length - 1].forEach((d, index) => {
          if (!d.is_portfolios) {
            this.curData[this.curData.length - 1].splice(index, 1)
          }
        })
      } else {
        this.curData[this.curData.length - 1].push(this.curData[`${this.currencyindex}`][index])
      }
      if (this.loginData === 'none') {
        var markData = JSON.parse(JSON.stringify(this.marketData))
        markData[this.currency[this.currencyindex]][index][Object.keys(markData[this.currency[this.currencyindex]][index])[0]].is_portfolios = status
        localStorage.setItem('marketData', JSON.stringify(markData))
      }
    },
    displaystate () {
      this.open = !this.open
      if (!this.open) {
        Cookies.set('total_hide', 'true')
      } else {
        Cookies.remove('total_hide')
      }
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
    },
    GetmarketData () {
      if (this.marketData) {
        this.curData = []
        this.curData.push(this.getItem(this.marketData['usdt']))
        this.curData.push(this.getItem(this.marketData['btc']))
        this.curData.push(this.getItem(this.marketData['eth']))
        this.curData.push(this.getItem(Object.keys(this.marketData).map((d) => {
          return this.marketData[d].map((data) => {
            return data[Object.keys(data)[0]]
          }).filter((d) => {
            return d.is_portfolios
          })
        })))
      }
    },
    ...mapMutations(['PopupBoxDisplay'])
  },
  watch: {
    marketData () {
      this.GetmarketData()
    },
    $route () {
      this.GetmarketData()
    }
  },
  computed: {
    ...mapGetters(['loginData']),
    ...mapState(['marketData', 'language', 'CmsUrl'])
  }
}
</script>
<style scoped lang="scss">
@import "./HomePage.scss"
</style>
