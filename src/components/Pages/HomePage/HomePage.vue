<template>
  <div id="home">
    <div class="dialog" v-if='showDia'>
      <div class="mask"></div>
      <div class="dia_confirm">
        <a href="###" class="close" @click='closeDia'><i class="fa fa-times"></i></a>
        <joinMin :joinData = 'joinData' @modRemain='modRemain'></joinMin>
      </div>
    </div>
    <div class="homepage-header">
      <swiper class="carousel" :options="swiperOption">
        <div v-if="Notice.length === 0" style="min-height:480px">
            <vue-simple-spinner  style="position: absolute;left: 50%;margin-left: -75px;margin-top: -75px;top:50%;" class="notice-loading" size="150"></vue-simple-spinner>
        </div>
        <swiper-slide v-for="data in Notice" :key="data.id">
          <!-- 'background': 'url('+ data.thumb + ') 50% 50%', -->
          <div :style="{ 'background-repeat': 'no-repeat'}" class=" img-container">
            <div class="container notice">
                <div>
                  <a :href="data.url">
                    <p>{{ data.the_title }}</p>
                  </a>
                  <a v-if="data.the_content" :href="data.url">
                    <span>{{ data.the_content }}</span>
                  </a>
                </div>
            </div>
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
        <div class="swiper-button-prev-div" slot="button-prev">
          <div class='swiper-button-prev'></div>
        </div>
        <div class="swiper-button-next-div" slot="button-next">
          <div class='swiper-button-next'></div>
        </div>
      </swiper>
      <div class="from-container">
        <div class="homepage-login">
          <div class="nologin" v-if="loginData === 'none' || loginData.errors">
            <div class="form" @keyup.enter="login">
              <span>{{ $t('homepage.login') }}</span>
              <basic-input :delay='1000' ref="email" :validate='"required|email"' v-model="email" :placeholder="this.$t('homepage.enter_the_mailbox')" class="input"></basic-input>
              <basic-input :delay='1000' ref="password" type='password' :validate='"required|empty_password"' v-model="password" :placeholder="this.$t('homepage.enter_the_password')" class="input"></basic-input>
              <basic-button :disabled='disabled' @click.native="login" class="btn button" :text="this.$t('homepage.login')"></basic-button>
              <div>
                <router-link class='link' :to="`${ROUTER_VERSION}/register`">{{ $t('homepage.free_registration') }}</router-link>
                <router-link :to="`${ROUTER_VERSION}/forgot_password`" :class='{"pull-right": language !=="en", "homepage-block": language!=="zh-TW"}' class="pointer link">{{ $t('homepage.forget_the_password') }}</router-link>
              </div>
            </div>
          </div>
          <div class="logining" v-else>
            <span>{{ $t('homepage.welcome_to_use') }}
              <span>
                <router-link class="link" :to="`${ROUTER_VERSION}/my_account`">
                  {{loginData.show_name}}
                </router-link>
              </span>
            </span>
            <div class="discount">
              <span style="color:#999999">{{ $t('homepage.discounts_of_transaction_costs') }}</span>
              <span>
                <router-link class="link" :to="`${ROUTER_VERSION}/referral`">
                  {{ factor }} {{ $t('homepage.off') }}
                </router-link>
              </span>
            </div>
            <div class="marginT20">
              <span style="color:#999999">{{ $t('homepage.total_asset_estimation') }}</span>
              <span v-if="open"><i class="fa fa-btc"/> {{ TotalAssets | toLocaleString }}
                <i class="pull-right pointer home-open" @click="displaystate"/>
              </span>
              <span v-else>
                *******
                <i class="pull-right pointer home-hide" @click="displaystate"/>
              </span>
            </div>
            <div class="marginT25">
              <router-link :to="`${ROUTER_VERSION}/funds/deposit`">
                <basic-button class="button" :text="$t('homepage.deposit')">
                </basic-button>
              </router-link>
              <router-link :to="`${ROUTER_VERSION}/funds/withdraw`">
                <basic-button class="button pull-right" :text="$t('homepage.withdraw')"></basic-button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="home_mining" v-if='false'>
      <div class="mining_h">
        <h3>{{$t('homepage.mining.head')}}</h3>
        <p>{{$t('homepage.mining.des')}}</p>
      </div>
      <div class="mining_list" v-if='miningList.length !== 0'>
        <miningTab :miningList='miningList' @participate='participate'></miningTab>
      </div>
      <div v-else style="position: absolute;top: 50%;left: 50%;margin-left: -44px">
        <vue-simple-spinner size="88"></vue-simple-spinner>
      </div>
    </div>
    <div class="homepage-main marginT15">
      <div class="homepage-markets">
        <basic-button v-for="(item,index) in currency" :data-id="item" :key="item" class="button pull-left" :class="{'active':!(currencyindex == index)}"
        @click.native="changemarket(index,item)" :text="item === 'my_optional' ? $t('homepage.my_optional') : `${item.toUpperCase()} ${$t('homepage.trading_area')}`"></basic-button>
        <div @keyup.esc="search = ''" class="homepage-search fr b">
          <input v-model="search" class="search" :placeholder='$t("homepage.search")' />
          <i v-if='!search' class="home-search"></i>
          <i @click="search = ''" v-else class="home-search-delete"></i>
        </div>
        <keep-alive>
          <HomeMarket ref="market" v-if="curData" v-on:marketChange="marketChange" :trend='trend' :search='search' :currency='currency[currencyindex]' :curData = "curData[currencyindex]">
          </HomeMarket>
          <div v-else style="position: absolute;top: 40%;left: 50%;margin-left: -44px">
            <vue-simple-spinner size="88"></vue-simple-spinner>
          </div>
        </keep-alive>
      </div>
      <div class="homepage-logo text-center">
        <i class="home-log"></i>
      </div>
      <div class="homepage-introduce">
        <div id='homepage-introduce'>
          <div>
            <a href="mailto:support@hotex.com">
              <section :class="{'homepage-transition': transition}" class="margin0">
                <div class="text-center">
                  <i class="home-contact"/>
                  <div>{{ $t('homepage.contact_us') }}</div>
                </div>
                <div class="font12 color999">
                  {{ $t('homepage.introduce_1') }}
                </div>
              </section>
            </a>
            <a :href="`${HOST_URL}/documents/api_v2`">
              <section :class="{'homepage-transition': transition}">
                <div class="text-center">
                  <i class="home-api"/>
                  <div>{{ $t('homepage.api_interface') }}</div>
                </div>
                <div class="font12 color999">
                  {{ $t('homepage.introduce_2') }}
                </div>
              </section>
            </a>
            <a :href="`${CmsUrl.rate_details}`">
              <section :class="{'homepage-transition': transition}">
                <div class="text-center">
                  <i class="home-apply"/>
                  <div>{{ $t('footer.rate_details') }}</div>
                </div>
                <div class="font12 color999">
                  {{ $t('homepage.introduce_3') }}
                </div>
              </section>
            </a>
          </div>
          <div>
            <a :href="CmsUrl.application">
              <section :class="{'homepage-transition': transition}" class="margin0">
                <div class="text-center">
                  <i class="home-application"/>
                  <div>{{ $t('footer.application') }}</div>
                </div>
                <div class="font12 color999">
                  {{ $t('homepage.introduce_4') }}
                </div>
              </section>
            </a>
            <a :href="CmsUrl.privacy_policy">
              <section :class="{'homepage-transition': transition}">
                <div class="text-center">
                  <i class="home-privacy"/>
                  <div>{{ $t('footer.privacy_policy') }}</div>
                </div>
                <div class="font12 color999">
                  {{ $t('homepage.introduce_5') }}
                </div>
              </section>
            </a>
            <a :href="CmsUrl.about_us">
              <section :class="{'homepage-transition': transition}">
                <div class="text-center">
                  <i class="home-aboutus"/>
                  <div>{{ $t('footer.about_us') }}</div>
                </div>
                <div class="font12 color999">
                  {{ $t('homepage.introduce_6') }}
                </div>
              </section>
            </a>
          </div>
          <div class="color999 introduce-describe">
            <span>{{ $t('homepage.introduce_7') }}</span>
          </div>
        </div>
      </div>
      <div class="homepage-end">
        <div class="fl home-end-img">
          <img class="home-end" src="~Img/large/home-pc.png" />
          <img class="home-end" src="~Img/large/home-iphone.png" />
          <img class="home-end" src="~Img/large/home-android.png" />

        </div>
        <div id='home-end-font'>
          <div>
            <strong>
              {{ $t('homepage.trading_platform') }}
            </strong>
          </div>
          <div>
            {{ $t('homepage.cross_platform') }}
          </div>
          <div>
            <strong>{{ $t('homepage.coming_soon') }}</strong>
          </div>
        </div>
        <div class="clearfix">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState, mapMutations } from 'vuex'
import { unsupportedRegionNames, unsupportedCountryCodes } from '@/common/js/bus/public'
import Cookies from 'js-cookie'
import pusher from '@/common/js/pusher'
import HomeMarket from './HomeMarket/HomeMarket'
import miningTab from './miningTab/miningTab'
import joinMin from './joinMin/joinMin'
const _debounce = require('lodash.debounce')
export default {
  name: 'homepage',
  data () {
    return {
      channelTime: 0,
      currency: ['btc', 'eth', 'usdt', 'my_optional'],
      new_coin: '',
      transition: false,
      email: '',
      password: '',
      trend: '',
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      HOST_URL: process.env.HOST_URL,
      currencyindex: 0,
      search: '',
      open: !Cookies.get('total_hide'),
      joinData: {},
      getetc: '',
      change: 'no',
      curData: '',
      disabled: false,
      miningList: [],
      Notice: [],
      showDia: false,
      swiperOption: {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next-div',
          prevEl: '.swiper-button-prev-div'
        }
      }
    }
  },
  created () {
    this.RegionHint()
    this.BindChannel()
    this.getMining()
    ;(() => {
      var code = Cookies.get('code')
      if (code) {
        if (code.match(/\d+/g)[0] === '200') {
          this.PopupBoxDisplay({message: this.$t(`my_account.200_hint`), type: 'success'})
          Cookies.remove('code')
          return
        }
        this.PopupBoxDisplay({message: this.$t(`my_account.${code.match(/\d+/g)[0]}_hint`), type: 'warn'})
        Cookies.remove('code')
      } // rails flash
    })()

    this._get({
      url: '/k/trends.json'
    }, (d) => {
      this.trend = d && d.data
    }) // trend

    this.GetNewCoin()

    var channel = pusher.subscribe('market-global')
    channel.bind('tickers', _debounce((data) => {
      if (!this.$store.state.marketData) return
      if (Object.keys(this.$store.state.assets).length === 0) return
      var BtcMarket = this.$store.state.marketData['btc'].reduce((a, b) => {
        return a.concat(Object.keys(b)[0])
      }, [])
      data && Object.keys(data).forEach((key) => {
        if (data[key].base_currency === 'usdt') {
          if (key === 'btcusdt') {
            if (!this.$store.state.assets['usdt']) return
            this.$store.state.assets['usdt'].price = 1 / Number(data[key].last)
          }
          return
        }
        if (data[key].base_currency === 'btc') {
          if (!this.$store.state.assets[data[key].quote_currency]) return
          this.$store.state.assets[data[key].quote_currency].price = data[key].last
          return
        }
        if (data[key].base_currency === 'eth') {
          if (!BtcMarket.includes(`${data[key].quote_currency}/btc`)) {
            if (!this.$store.state.assets[data[key].quote_currency] && !this.$store.state.assets['eth']) return
            this.$store.state.assets[data[key].quote_currency].price = data[key].last * (this.$store.state.assets['eth'] ? this.$store.state.assets['eth'].price : 1)
          }
        }
      })
    }, 5000)) // market pusher

    channel.bind('tickers', (data) => {
      if (this.curData === '') return
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

    if (this.marketData) this.GetmarketData()
  },
  mounted () {
    var time = 0
    var self = this
    /* global ScrollReveal */
    var sr = ScrollReveal({
      axis: 'y',
      duration: 1000,
      origin: 'left',
      distance: '60px',
      delay: 150,
      viewportFactor: 0.33,
      easing: 'cubic-bezier(0.3, 0.2, 0.1, 0.5)'
    })
    sr.reveal('.home-end', {
      origin: 'left',
      distance: '80px'
    }, 300)
    sr.reveal('#home-end-font', {
      origin: 'right'
    })
    sr.reveal('#homepage-introduce section', {
      origin: 'top',
      distance: '20px',
      afterReveal () {
        time++
        if (time === 6) {
          self.transition = true
        }
      }
    }, 100)
    sr.reveal('.introduce-describe', {
      origin: 'bottom',
      distance: '40px'
    }, 100)
  },
  components: {
    HomeMarket,
    miningTab,
    joinMin
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
          'auth_key': this.$store.getters.Trim(this.email),
          'password': this.password
        }
      }, (d) => {
        this.disabled = false
        if (d.data.success) {
          // var loginData = JSON.parse(d.data.success.user_info)
          var loginData = d.data.success.user_info
          if (d.data.success.login_2fa_required) {
            Object.assign(this.$store.state, {
              two_factors: true,
              app_activated: loginData.app_activated,
              sms_activated: loginData.sms_activated
            })
            localStorage.setItem('UserInfo', JSON.stringify(loginData))
            this.$router.push(`${this.ROUTER_VERSION}/login/verify`)
          }
          Object.assign(this.$store.state, {
            loginData: loginData,
            assets: loginData.assets
          })
          this.curData = ''
          this.$store.dispatch('GetMarketData')
        } else {
          if (d.data.error.code === 1002) {
            this.$router.push(`${this.ROUTER_VERSION}/login?captcha=error`)
          } else if (d.data.error.code === 1003) {
            if (d.data.error.captcha_required) {
              this.$router.push(`${this.ROUTER_VERSION}/login?password=error`)
              return
            }
            this.password = ''
            this.PopupBoxDisplay({type: 'error', message: this.$t(`api_server.homepage.error_${d.data.error.code}`)})
          }
        }
      })
    },
    async getMining () {
      this._get({
        url: '/fixed_term_deposits.json'
      }, res => {
        var data = res.data.success.fixed_term_products
        this.miningList = data.slice(0, 5)
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
        // localStorage.setItem('marketData', JSON.stringify(markData))
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
      return require(`../../../../static/${img}.png`)
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
        this.curData.push(this.getItem(this.marketData['btc']))
        this.curData.push(this.getItem(this.marketData['eth']))
        this.curData.push(this.getItem(this.marketData['usdt']))
        if (this.loginData === 'none') {
          this.curData.push(this.getLocal(this.marketData))
        } else {
          this.curData.push(this.getItem(Object.keys(this.marketData).map((d) => {
            return this.marketData[d].map((data) => {
              return data[Object.keys(data)[0]]
            }).filter((d) => {
              return d.is_portfolios
            })
          })))
        }
      }
    },
    getLocal: function (data) {
      var localList = localStorage.getItem('markets')
      if (!localList || localList.length === 0) {
        return []
      }
      var arr = []
      for (var key in data) {
        var list = data[key]
        var len = list.length
        for (var i = 0; i < len; i++) {
          for (var item in list[i]) {
            if (localList.indexOf(item) !== -1) {
              list[i][item]['is_portfolios'] = true
              arr.push(list[i][item])
            }
          }
        }
      }
      return arr
    },
    GetNewCoin () {
      var self = this
      this.Notice = []
      this.$http.get(`${this.HOST_URL}/cms/api/announcements.json`, {
        params: {
          category: 'official-announcement',
          locale: self.language
          // per_page: '8'
        }
      }).then(d => {
        self.Notice = d.data
      }) // new_coin
    },
    RegionHint () {
      if (!this.Location) return
      if (unsupportedCountryCodes.includes(this.Location.country_code2) || unsupportedRegionNames.includes(this.Location.region_name)) {
        if (Cookies.get('LocationHint')) return
        Cookies.set('LocationHint', 'true', { expires: 1 })
        this.PopupBoxDisplay({message: this.$t('unsupported_countries_and_regions'), type: 'warn', largeWidth: true})
      }
    },
    BindChannel () {
      if (this.loginData === 'none') return
      if (this.channelTime > 0) return
      this.channelTime++
      var PersonalChannel = pusher.subscribe(`private-${this.loginData.sn}`)
      PersonalChannel.bind('account', (data) => {
        if (!this.$store.state.assets[data.currency]) return
        this.$store.state.assets[data.currency].balance && (this.$store.state.assets[data.currency].balance = Number(data.balance))
        this.$store.state.assets[data.currency].locked && (this.$store.state.assets[data.currency].locked = Number(data.locked))
      }) // account pusher
    },
    participate (item) {
      this.showDia = true
      this.joinData = item
    },
    modRemain (remain, id) {
      if (remain && id) {
        this.miningList.map(ele => {
          if (ele.id === id) {
            ele.volume = remain
          }
        })
      }
      this.showDia = false
    },
    closeDia () {
      this.showDia = false
      this.joinData = {}
    },
    ...mapMutations(['PopupBoxDisplay'])
  },
  watch: {
    loginData () {
      this.BindChannel()
    },
    marketData () {
      this.GetmarketData()
    },
    $route (to) {
      this.GetmarketData()
      if (to.name === 'home') {
        this.RegionHint()
        this.BindChannel()
      }
    },
    Location () {
      this.RegionHint()
    },
    language () {
      this.GetNewCoin()
    }
  },
  computed: {
    TotalAssets () {
      return this.$store.getters.TotalAssets()
    },
    factor () {
      return this.loginData === 'none' ? '' : `${(10 - Number(this.loginData.commission_factor * 10)) * 10}%`
    },
    ...mapGetters(['loginData']),
    ...mapState(['marketData', 'language', 'CmsUrl', 'Location'])
  },
  filters: {
    toLocaleString (n) {
      if (!n) return 0
      var re = /\d{1,3}(?=(\d{3})+$)/g
      var n1 = String(n).replace(/^(\d+)((\.\d+)?)$/, function (s, s1, s2) { return s1.replace(re, '$&,') + s2 })
      return n1
    }
  }
}
</script>

<style scoped lang="scss">
  @import "./HomePage.scss";
</style>
