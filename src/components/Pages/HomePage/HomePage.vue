<template>
  <div @keyup.enter="login">
    <div class="btc-homepage-header">
      <!-- <div id="carousel-example-generic" class="carousel slide" data-ride="carousel" data-interval="3500">
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
        </div> -->
      <swiper class="carousel" :options="swiperOption">
        <div v-if="Notice.length === 0" style="min-height:480px">
            <vue-simple-spinner  style="position: absolute;left: 50%;margin-left: -75px;margin-top: -75px;top:50%;" class="btc-notice-loading" size="150"></vue-simple-spinner>
        </div>
        <swiper-slide v-for="data in Notice" :key="data.id">
          <!-- 'background': 'url('+ data.thumb + ') 50% 50%', -->
          <div :style="{ 'background-repeat': 'no-repeat'}" class=" img-container">
            <div class="container btc-notice">
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
        <div class="btc-homepage-login">
          <div class="btc-nologin" v-if="loginData === 'none' || loginData.errors">
          <!-- <div class="btc-nologin"> -->
            <div class="form">
              <span>{{ $t('homepage.login') }}</span>
              <basic-input :delay='1000' ref="email" :validate='"required|email"' v-model="email" :placeholder="this.$t('homepage.enter_the_mailbox')" class="btc-input"></basic-input>
              <basic-input :delay='1000' ref="password" type='password' :validate='"required|empty_password"' v-model="password" :placeholder="this.$t('homepage.enter_the_password')" class="btc-input"></basic-input>
              <basic-button :disabled='disabled' @click.native="login" class="btn btc-button" :text="this.$t('homepage.login')"></basic-button>
              <div>
                <router-link class='btc-link' :to="`${ROUTER_VERSION}/register`">{{ $t('homepage.free_registration') }}</router-link>
                <a :href="`${HOST_URL}/reset_passwords/new`" :class='{"pull-right": language !=="en", "btc-homepage-block": language!=="zh-TW"}' class="btc-pointer btc-link">{{ $t('homepage.forget_the_password') }}</a>
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
                  {{ factor }} {{ $t('homepage.off') }}
                </router-link>
              </span>
            </div>
            <div class="btc-marginT20">
              <span style="color:#999999">{{ $t('homepage.total_asset_estimation') }}</span>
              <span v-if="open"><i class="fa fa-btc"/> {{ TotalAssets | toLocaleString }}
                <i class="pull-right btc-pointer home-open" @click="displaystate"/>
              </span>
              <span v-else>
                *******
                <i class="pull-right btc-pointer home-hide" @click="displaystate"/>
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
      <!-- <ul class="btc-homepage-newCoin">
        <div class="container">
          <li v-for="data in new_coin" :key='data.id'>
            <a :href="data.url">{{ data.the_title }}</a>
          </li>
        </div>
      </ul> -->
    </div>
    <div class="btc-homepage-main">
      <div class="btc-homepage-markets btc-marginT30">
        <basic-button v-for="(item,index) in currency" :data-id="item" :key="item" class="btc-button pull-left" :class="{'btc-active':!(currencyindex == index)}"
        @click.native="changemarket(index,item)" :text="item === 'my_optional' ? $t('homepage.my_optional') : `${item.toUpperCase()} ${$t('homepage.trading_area')}`"></basic-button>
        <div @keyup.esc="search = ''" class="btc-homepage-search btc-fr btc-b">
          <input v-model="search" class="btc-search" :placeholder='$t("homepage.search")' />
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
      <div class="btc-homepage-logo text-center">
        <i class="home-log"></i>
      </div>
      <!-- <div class="btc-homepage-intr btc-marginT15 btc-marginB100">
        <span class="col-xs-3 btc-marginT10"></span>
        <div class="col-xs-6 text-center">
          <span>{{ $t('homepage.trading_platform') }}</span>
        </div>
        <span class="col-xs-3 pull-right btc-marginT10"></span>
      </div>
      <div class="btc-homepage-info btc-marginT25 text-center">
        <a class="col-xs-2 col-xs-offset-1">
          <a href="mailto:support@hotex.com">
            <img src="~Img/homepage-us.png" >
          </a>
          <span class="btc-marginT15">
            <a href="mailto:support@hotex.com">
              {{ $t('homepage.contact_us') }}
            </a>
          </span>
        </a>
        <a class="col-xs-2">
          <a :href="`${HOST_URL}/documents/api_v2`">
            <img src="~Img/homepage-api.png" >
          </a>
          <span class="btc-marginT15">
            <a :href="`${HOST_URL}/documents/api_v2`">
              {{$t("my_account.api")}}
            </a>
          </span>
        </a>
        <a class="col-xs-2">
          <a :href="`${CmsUrl.rate_details}`">
            <img src="~Img/homepage-rate.png" >
          </a>
          <span class="btc-marginT15">
            <a :href="`${CmsUrl.rate_details}`">
              {{ $t('homepage.exchange_rate_details') }}
            </a>
          </span>
        </a>
        <a class="col-xs-2">
          <a :href="CmsUrl.application">
            <img src="~Img/homepage-apply.png" width="56" height="56">
          </a>
          <span class="btc-marginT15">
            <a :href="CmsUrl.application">
              {{ $t('homepage.apply_to_list') }}
            </a>
          </span>
        </a>
        <a class="col-xs-2">
          <a :href="CmsUrl.privacy_policy">
            <img src="~Img/homepage-clause.png" >
          </a>
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
      </div> -->
      <div class="btc-marginT50 btc-homepage-introduce">
        <div>
        </div>
        <div>
        </div>
        <div id='btc-homepage-introduce'>
          <div>
            <a href="mailto:support@hotex.com">
              <section :class="{'btc-homepage-transition': transition}" class="btc-margin0">
                <div class="text-center">
                  <i class="home-contact"/>
                  <div>{{ $t('homepage.contact_us') }}</div>
                </div>
                <div class="btc-font12 btc-color999">
                  {{ $t('homepage.introduce_1') }}
                </div>
              </section>
            </a>
            <a :href="`${HOST_URL}/documents/api_v2`">
              <section :class="{'btc-homepage-transition': transition}">
                <div class="text-center">
                  <i class="home-api"/>
                  <div>{{ $t('homepage.api_interface') }}</div>
                </div>
                <div class="btc-font12 btc-color999">
                  {{ $t('homepage.introduce_2') }}
                </div>
              </section>
            </a>
            <a :href="`${CmsUrl.rate_details}`">
              <section :class="{'btc-homepage-transition': transition}">
                <div class="text-center">
                  <i class="home-apply"/>
                  <div>{{ $t('footer.rate_details') }}</div>
                </div>
                <div class="btc-font12 btc-color999">
                  {{ $t('homepage.introduce_3') }}
                </div>
              </section>
            </a>
          </div>
          <div>
            <a :href="CmsUrl.application">
              <section :class="{'btc-homepage-transition': transition}" class="btc-margin0">
                <div class="text-center">
                  <i class="home-application"/>
                  <div>{{ $t('footer.application') }}</div>
                </div>
                <div class="btc-font12 btc-color999">
                  {{ $t('homepage.introduce_4') }}
                </div>
              </section>
            </a>
            <a :href="CmsUrl.privacy_policy">
              <section :class="{'btc-homepage-transition': transition}">
                <div class="text-center">
                  <i class="home-privacy"/>
                  <div>{{ $t('footer.privacy_policy') }}</div>
                </div>
                <div class="btc-font12 btc-color999">
                  {{ $t('homepage.introduce_5') }}
                </div>
              </section>
            </a>
            <a :href="CmsUrl.about_us">
              <section :class="{'btc-homepage-transition': transition}">
                <div class="text-center">
                  <i class="home-aboutus"/>
                  <div>{{ $t('footer.about_us') }}</div>
                </div>
                <div class="btc-font12 btc-color999">
                  {{ $t('homepage.introduce_6') }}
                </div>
              </section>
            </a>
          </div>
          <div class="btc-color999 btc-introduce-describe">
            <span>{{ $t('homepage.introduce_7') }}</span>
          </div>
        </div>
      </div>
      <div class="btc-homepage-end">
        <div class="btc-fl home-end-img">
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
            <!-- <a href="https://itunes.apple.com/cn/app/google-authent icator/id388497605?mt=8" target="_blank">
              <i class="home-iosapp"></i>
            </a>
            <a class="btc-marginL10" href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank">
              <i class="home-gplay"></i>
            </a> -->
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
import Cookies from 'js-cookie'
import pusher from '@/common/js/pusher'
import HomeMarket from './HomeMarket/HomeMarket'
const _debounce = require('lodash.debounce')
export default {
  name: 'homepage',
  created () {
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

    this._get({
      url: '/k/trends.json'
    }, (d) => {
      this.trend = d.data
    }) // trend

    this.GetNewCoin()

    var channel = pusher.subscribe('market-global')
    channel.bind('tickers', _debounce((data) => {
      Object.keys(data).forEach((key) => {
        this.$store.state.assets !== '' && (this.$store.state.assets[data[key].base_currency].price = Number(data[key].last))
      })
    }, 5000))

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

    if (!this.marketData) this.GetmarketData()
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
    sr.reveal('#btc-homepage-introduce section', {
      origin: 'top',
      distance: '20px',
      afterReveal () {
        time++
        if (time === 6) {
          self.transition = true
        }
      }
    }, 100)
    sr.reveal('.btc-introduce-describe', {
      origin: 'bottom',
      distance: '40px'
    }, 100)
    // sr.reveal('#home-end', {
    //   duration: 1800,
    //   origin: '',
    //   distance: '80px',
    //   opacity: 0,
    //   scale: 0.9,
    //   easing: 'cubic-bezier(0.3, 0.2, 0.1, 0.5)',
    // })
  },
  data () {
    return {
      channelTime: 0,
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
      currency: ['usdt', 'btc', 'eth', 'my_optional'],
      getetc: '',
      change: 'no',
      curData: '',
      disabled: false,
      Notice: [],
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
          var loginData = JSON.parse(d.data.success.user_info)
          Object.assign(this.$store.state, {
            loginData: loginData,
            assets: loginData.assets
          })
          this.curData = ''
          this.$store.dispatch('GetMarketData')
        } else {
          if (d.data.error.code === 1002) {
            this.$router.push(`${this.ROUTER_VERSION}/login?captcha=error`)
          } else {
            if (d.data.error.captcha_required) {
              this.$router.push(`${this.ROUTER_VERSION}/login?captcha=error`)
              return
            }
            this.password = ''
            this.PopupBoxDisplay({type: 'error', message: this.$t(`api_server.homepage.error_${d.data.error.code}`)})
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
        this.curData.push(this.getItem(this.marketData['usdt']))
        this.curData.push(this.getItem(this.marketData['btc']))
        this.curData.push(this.getItem(this.marketData['eth']))
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
    ...mapMutations(['PopupBoxDisplay'])
  },
  watch: {
    loginData () {
      if (this.channelTime > 0) return
      this.channelTime++
      var PersonalChannel = pusher.subscribe(`private-${this.loginData.sn}`)
      PersonalChannel.bind('account', _debounce((data) => {
         this.$store.state.assets[data.currency].balance && (this.$store.state.assets[data.currency].balance = Number(data.balance))
        this.$store.state.assets[data.currency].locked && (this.$store.state.assets[data.currency].locked = Number(data.locked))
      }, 500)) // account pusher
    },
    marketData () {
      this.GetmarketData()
    },
    $route () {
      this.GetmarketData()
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
    ...mapState(['marketData', 'language', 'CmsUrl'])
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
@import "./HomePage.scss"
</style>

<style lang='scss'>
.btc-homepage-header .swiper-pagination-bullet{
  background: white!important;
  opacity: .5!important;
}
.btc-homepage-header .swiper-pagination-bullet-active{
  opacity: 1!important;
}

// .btc-homepage-header .swiper-button-prev{
//   width: 30px;
//   height: 30px;
//   border-top: 1px solid #fff;
//   border-right: 1px solid #fff;
//   opacity: 0.5;
//   transform: rotate(-135deg);
//   background-image: none;
//   left:29px;
//   outline: none;
//   &:hover{
//     opacity: 1
//   }
// }

.btc-homepage-header {
  .swiper-button-prev-div{
    left: 16px !important;
    position: absolute;
    outline: none;
    top: 50%;
    width: 55px;
    height: 66px;
    margin-top: -33px;
    z-index: 10;
    cursor: pointer;
    &:hover{
      .swiper-button-prev{
        opacity: 1
      }
    }
    .swiper-button-prev{
      width: 30px;
      height: 30px;
      border-top: 1px solid #fff;
      border-right: 1px solid #fff;
      opacity: 0.5;
      -webkit-transform: rotate(-135deg);
      transform: rotate(-135deg);
      background-image: none;
      left: 20px;
      outline: none;
      margin-top: -15px;
    }
  }
}

.btc-homepage-header {
  .swiper-button-next-div{
    right: 16px !important;
    position: absolute;
    outline: none;
    top: 50%;
    width: 55px;
    height: 66px;
    margin-top: -33px;
    z-index: 10;
    cursor: pointer;
    &:hover{
      .swiper-button-next{
        opacity: 1
      }
    }
    .swiper-button-next{
      width: 30px;
      height: 30px;
      border-top: 1px solid #fff;
      border-right: 1px solid #fff;
      opacity: 0.5;
      transform: rotate(45deg);
      background-image: none;
      right: 20px !important;
      outline: none;
      margin-top: -16px;
    }
  }
}

.btc-homepage-header .btc-nologin input{
  font-size: 12px;
}
</style>
