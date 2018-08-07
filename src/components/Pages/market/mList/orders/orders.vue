<template>
  <div id="orders">
    <div class="dialog" v-show='showDialog'>
      <div class="mask"></div>
      <div class="dia_content">
        <div class="text">
          <p class="cancel_one" v-if="cancelNum === 'one'">{{$t('orders.dialog.cancel')}}</p>
          <p class="cancel_all" v-if="cancelNum === 'all'">{{$t('orders.dialog.cancel_all')}}</p>
        </div>
        <div class="confirm_box">
          <span class="confirm" @click="confirmOrder(true)">{{$t('markets.confirm')}}</span>
          <span class="cancel" @click="confirmOrder(false)">{{$t('markets.cancel')}}</span>
        </div>
      </div>
    </div>
    <ul class="order_hd clearfix">
      <li v-for="(hd,index) in hds" :key="hd" :class="{'check': currencyindex == index}"
       @click="goPath(index)">{{$t(hd)}}</li>
    </ul>
    <div class="tip_box" v-if="!sn">
      <div class="loginBox">
        <a class="signin" :href="`${ROUTER_VERSION}/login?from=${ROUTER_VERSION}/markets/${curMarket}/orders`">{{$t('orders.login')}}</a>
        <a class="signup" :href="`${ROUTER_VERSION}/register?from=${ROUTER_VERSION}/markets/${curMarket}/orders`">{{$t('orders.register')}}</a>
      </div>
    </div>
    <vue-simple-spinner v-if='loading && loginData !== "none"' size="66" class="loading"></vue-simple-spinner>
    <div class="orderBd" v-if="sn">
      <div class="operate">
        <div class="cancel_all" @click="cancelAll()">{{$t("orders.cancel_all")}}</div>
        <div class="choose">
          <div :class="{'selected': index === curfilter}" v-for="(item, index) in filterButtons" :key="item" @click="fiterList(index)">
            <i class="fa fa-check-circle-o"></i>
            <i class="fa fa-circle-thin"></i>
            {{$t(item)}}
          </div>
        </div>
      </div>
      <ul class="order_list">
        <li class="list" v-for="item in curListData" :key="item.id">
          <div class="list_top">
            <div class="cancel" @click="cancel(item.id)">{{$t('cancel')}}</div>
            <div class="list_lt">
              <div class="list_type" :class="{'sell': item.kind === 'ask', 'buy': item.kind === 'bid'}"><span>{{$t('orders.'+item.kind)}}</span></div>
              <div class="market">{{item.quote_currency | upper}}/{{item.base_currency | upper}}</div>
              <div class="time">{{item.at | time}}</div>
            </div>
          </div>
          <div class="list_bottom">
            <div class="list-price">
              <div class="num">{{item.price | fixedNum(item.price_fixed)}}</div>
              <div class="des">{{$t("orders.price")}}</div>
            </div>
            <div class="list-volume">
              <div class="num">{{item.volume | fixedNum(item.volume_fixed)}}</div>
              <div class="des">{{$t("orders.volume")}}</div>
            </div>
            <div class="list-percent">
              <div class="num">{{item.close_rate}}</div>
              <div class="des">{{$t("orders.ordered")}}</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import pusher from '@/common/js/pusher'

export default {
  name: 'Orders',
  data () {
    return {
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      hds: ['markets.quotes', 'markets.trade', 'markets.pending'],
      filterButtons: ['orders.all', 'orders.buy', 'orders.sell'],
      currencyindex: 2,
      loading: true,
      marketData: null,
      curMarket: '',
      curData: [],
      curListData: [],
      showDialog: false,
      curfilter: 0,
      cancelNum: 'one',
      id: 0,
      sn: ''
    }
  },
  mounted: function () {
    this.curMarket = this.$route.params.id
    if (this.loginData) {
      this.sn = this.loginData.sn
      this.getRefresh(this.sn)
      this.fetchData()
    }
    window.onpageshow = function (e) {
      if (e.persisted) {
        window.location.reload()
      }
    }
  },
  computed: {
    ...mapState([
      'loginData'
    ])
  },
  watch: {
    loginData (val) {
      this.getRefresh(val.sn)
      this.sn = val.sn
      this.fetchData()
      return val
    }
  },
  methods: {
    fetchData: function () {
      this._get({
        url: '/markets/pending_orders.json',
        data: {}
      }, (data) => {
        this.loading = false
        var initdata = JSON.parse(data.request.response)
        if (!initdata.success) {
          this.curData = []
        } else {
          this.curData = initdata.success.orders
        }
        this.curListData = this.curData
        document.title = `Markets - ${this.$t('brand')}`
      })
    },
    getRefresh: function (sn) {
      var privateAccount = pusher.subscribe('private-' + sn)
      privateAccount.bind('order', (data) => {
        if (data.state === 'wait') {
          this.curData.unshift(data)
        } else if (data.state === 'cancel' || data.state === 'done') {
          for (var i in this.curData) {
            if (this.curData[i].id === data.id) {
              this.curData.splice(i, 1)
            }
          }
        }
        this.fiterList(this.curfilter)
      })
    },
    goPath: function (index) {
      if (index === 0) {
        this.$router.push({path: `${this.ROUTER_VERSION}/markets/${this.curMarket}`})
      } else if (index === 1) {
        this.$router.push({path: `${this.ROUTER_VERSION}/markets/${this.curMarket}/trades`})
      } else if (index === 2) {
        return ''
      }
    },
    fiterList: function (index) {
      this.curfilter = index
      if (index === 1) {
        this.curListData = this.curData.filter((value, index) => {
          return value.kind === 'bid'
        })
      } else if (index === 2) {
        this.curListData = this.curData.filter((value, index) => {
          return value.kind === 'ask'
        })
      } else {
        this.curListData = this.curData
      }
    },
    confirmOrder: function (bool) {
      this.showDialog = false
      if (bool) {
        if (this.cancelNum === 'one') {
          this._delete({
            url: '/markets/' + this.curMarket + '/orders/' + this.id
          })
        } else if (this.cancelNum === 'all') {
          this._delete({
            url: '/markets/' + this.curMarket + '/orders/' + 0,
            data: {
              cancel_all: 'TRUE'
            }
          })
        }
      }
    },
    cancel: function (id) {
      this.cancelNum = 'one'
      this.showDialog = true
      this.id = id
    },
    cancelAll: function () {
      if (this.curData.length === 0) {
        return ''
      }
      this.cancelNum = 'all'
      this.showDialog = true
    }
  }
}
</script>
<style scoped lang="scss">
  @import './orders.scss'
</style>
