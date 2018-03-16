<template>
  <footer class="btc-footer hidden-xs">
    <nav class="container">
      <!-- <div class="col-sm-9">
        <h4>{{$t("concepts.btc_family")}}</h4>
        <div class="row">
          <ul>
            <li><a href="/coin/btc">{{$t("coins.btc")}}</a></li>
            <li><a href="/coin/bch">{{$t("coins.bch")}}</a></li>
            <li><a href="/coin/btg">{{$t("coins.bch")}}</a></li>
            <li><a href="/coin/bcd">{{$t("coins.bcd")}}</a></li>
            <li><a href="/coin/sbtc">{{$t("coins.sbtc")}}</a></li>
            <li><a href="/coin/lbtc">{{$t("coins.lbtc")}}</a></li>
            <li><a href="/coin/btp">{{$t("coins.btp")}}</a></li>
            <li><a href="/coin/god">{{$t("coins.god")}}</a></li>
            <li><a href="/coin/bcx">{{$t("coins.bcx")}}</a></li>
            <li><a href="/coin/bck">{{$t("coins.bck")}}</a></li>
            <li><a href="/coin/bth">{{$t("coins.bth")}}</a></li>
            <li><a href="/coin/bta">{{$t("coins.bta")}}</a></li>
            <li><a href="/coin/btw">{{$t("coins.btw")}}</a></li>
            <li><a href="/coin/bpa">{{$t("coins.bpa")}}</a></li>
            <li><a href="/coin/btf">{{$t("coins.bch")}}</a></li>
            <li><a href="/coin/btn">{{$t("coins.btf")}}</a></li>
            <li><a href="/coin/bti">{{$t("coins.bti")}}</a></li>
            <li><a href="/coin/fbtc">{{$t("coins.fbtc")}}</a></li>
            <li><a href="/coin/bifi">{{$t("coins.bifi")}}</a></li>
          </ul>
        </div>
        <h4>{{$t("concepts.eth_family")}}</h4>
        <div class="row">
          <ul>
            <li><a href="/coin/eth">{{$t("coins.eth")}}</a></li>
            <li><a href="/coin/etc">{{$t("coins.etc")}}</a></li>
            <li><a href="/coin/etf">{{$t("coins.etf")}}</a></li>
            <li><a href="/coin/qtum">{{$t("coins.qtum")}}</a></li>
            <li><a href="/coin/eos">{{$t("coins.eos")}}</a></li>
            <li><a href="/coin/rep">{{$t("coins.rep")}}</a></li>
            <li><a href="/coin/omg">{{$t("coins.omg")}}</a></li>
          </ul>
        </div>
        <h4>{{$t("concepts.storage")}}</h4>
        <div class="row">
          <ul>
            <li><a href="/coin/wkc">{{$t("coins.wkc")}}</a></li>
            <li><a href="/coin/llt">{{$t("coins.llt")}}</a></li>
          </ul>
        </div>
        <h4>{{$t("concepts.others")}}</h4>
        <div class="row">
          <ul>
            <li><a href="/coin/ltc">{{$t("coins.ltc")}}</a></li>
            <li><a href="/coin/lch">{{$t("coins.lch")}}</a></li>
            <li><a href="/coin/xmr">{{$t("coins.xmr")}}</a></li>
            <li><a href="/coin/dash">{{$t("coins.dash")}}</a></li>
            <li><a href="/coin/xrp">{{$t("coins.xrp")}}</a></li>
            <li><a href="/coin/hsr">{{$t("coins.hsr")}}</a></li>
            <li><a href="/coin/doge">{{$t("coins.doge")}}</a></li>
            <li><a href="/coin/xem">{{$t("coins.xem")}}</a></li>
            <li><a href="/coin/nxt">{{$t("coins.nxt")}}</a></li>
          </ul>
        </div>
      </div>
      <div class="col-sm-3">
        <h4>网站导航</h4>
        <ul class="list-unstyled">
          <li><a href="/yellow_page">酷站</a></li>
          <li><a href="/quote">行情</a></li>
        </ul><br>
        <h4>联系我们</h4><a class="btn btn-wide btn-danger" href="/tickets/new">意见反馈</a>
      </div> -->
      <div class="btc-footer-logo col-md-5">
        <img src="~Img/logo.png" alt="">
        <p class="btc-marginB15">{{ $t("footer.introduction") }}</p>
        <p>{{ $t("footer.copyright") }}</p>
      </div>
      <ul class="btc-info col-md-1 col-sm-2 btc-marginL40">
        <li class="">{{ $t("footer.support") }}</li>
        <li><a :href="`${HOST_URL}/documents/api_v2`">{{ $t("footer.api") }}</a></li>
        <li><a>{{ $t("footer.help") }}</a></li>
        <li><a>{{ $t("footer.announcements") }}</a></li>
      </ul>
      <ul class="btc-info col-md-1 col-sm-2 btc-marginL40">
        <li class="">{{ $t("footer.service") }}</li>
        <li><a>{{ $t("footer.application") }}</a></li>
        <li><a>{{ $t("footer.rate_details") }}</a></li>
      </ul>
      <ul class="btc-info col-md-1 col-sm-2 btc-marginL40">
        <li class="">{{ $t("footer.about") }}</li>
        <li><a>{{ $t("footer.about_us") }}</a></li>
        <li><a>{{ $t("footer.user_agreement") }}</a></li>
        <li><a>{{ $t("footer.privacy_policy") }}</a></li>
      </ul>
      <ul class="btc-info pull-right btc-marginT30 btc-marginR30 dropup">
        <li class="btc-marginB30">{{ $t("footer.contact_us") }}</li>
        <li class="btc-marginB15"><a href="mailto:support@hotex.com">support@hotex.com</a></li>
        <li role="presentation" class="dropdown btc-country btc-img-position">
          <a class="dropdown-toggle btc-paddingL0" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
            <span>{{getLanguage.name}}</span><span class="caret">
            </span>
          </a>
          <ul class="dropdown-menu text-center">
            <li v-for="(locale,index) in locale" :key="locale.language">
              <a @click="changeLang(locale.language, index + 1)">{{locale.name}}</a>
            </li>
          </ul>
        </li>
      </ul>

    </nav>
  </footer>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      HOST_URL: process.env.HOST_URL,
      locale: [{
        language: 'zh-TW',
        name: '正體中文'
      },
      {
        language: 'en',
        name: 'English'
      }]
    }
  },
  methods: {
    localed () {
      // this.$i18n.locale = this.language
    },
    changeLang (str) {
      this.ChangeLanguage(str)
      this.$i18n.locale = str
      this._post({
        url: '/settings/get_language.json',
        headers: {
          'DataType': 'application/json;charset=utf-8'
        },
        data: {
          'content_language': str
        }
      })
    },
    ...mapMutations(['ChangeLanguage'])
  },
  computed: {
    getLanguage () {
      this.localed()
      var lang = ''
      this.locale.map((d, index) => {
        if (d.language === this.language) {
          lang = d
        }
      })
      return lang
    },
    ...mapState(['language'])
  }
}
</script>

<style scoped lang='scss'>
@import './Footer.scss'
</style>
