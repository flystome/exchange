<template>
  <div id="orders">
    <ul class="order_hd clearfix">
      <li v-for="(hd,index) in hds" :key="hd" :class="{'check': currencyindex == index}"
       @click="goPath(index)">{{hd}}</li>
    </ul>
    <div class="orderBd">
      <div class="operate">
        <div class="cancel_all" @click="cancelAll()">{{$t("orders.cancel_all")}}</div>
        <div class="choose">
          <div :class="{'selected': index === curfilter}"  v-for="(item, index) in filterButtons" :key="item" @click="fiterList(index)">
            <i class="fa fa-check-circle-o"></i>
            <i class="fa fa-circle-thin"></i>
            {{item}}
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
              <div class="num">{{item.price}}</div>
              <div class="des">{{$t("orders.price")}}</div>
            </div>
            <div class="list-volume">
              <div class="num">{{item.volume}}</div>
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
      hds: [this.$t('markets.quotes'), this.$t('markets.trade'), this.$t('markets.currency')],
      filterButtons: [this.$t('orders.all'), this.$t('orders.buy'), this.$t('orders.sell')],
      currencyindex: 2,
      marketData: null,
      curMarket: '',
      curData: [],
      curListData: [],
      curfilter: 0
    }
  },
  mounted: function () {
    this.fetchData()
    this.curMarket = this.$route.params.id
  },
  computed: {
    ...mapState([
      'loginData'
    ])
  },
  watch: {
    loginData (val) {
      this.getRefresh(val.sn)
      return val
    }
  },
  filters: {
    upper: function (params) {
      if (!params || params === '/' || params === 'undefined/undefined') return '--'
      return params.toUpperCase()
    },
    time: function (params) {
      var d = new Date(params * 1000)
      var y = d.getFullYear()
      var m = d.getMonth() > 10 ? d.getMonth() : '0' + d.getMonth()
      var day = d.getDate() > 10 ? d.getDate() : '0' + d.getDate()
      var h = d.getHours() > 10 ? d.getHours() : '0' + d.getHours()
      var min = d.getMinutes() > 10 ? d.getMinutes() : '0' + d.getMinutes()
      var s = d.getSeconds() > 10 ? d.getSeconds() : '0' + d.getSeconds()
      return y + '-' + m + '-' + day + ' ' + h + ':' + min + ':' + s
    }
  },
  methods: {
    fetchData: function () {
      var self = this
      this._get({
        url: '/markets/pending_orders.json',
        data: {}
      }, function (data) {
        var initdata = JSON.parse(data.request.response)
        self.curData = initdata.success.orders
        self.curListData = self.curData
      })
    },
    getRefresh: function (sn) {
      var privateAccount = pusher.subscribe('private-' + sn)
      var self = this
      privateAccount.bind('order', (data) => {
        if (data.state === 'wait') {
          self.curData.unshift(data)
        } else if (data.state === 'cancel' || data.state === 'done') {
          for (var i in this.curData) {
            if (self.curData[i].id === data.id) {
              self.curData.splice(i, 1)
            }
          }
        }
        self.fiterList(self.curfilter)
      })
    },
    goPath: function (index) {
      if (index === 0) {
        console.log(`${this.ROUTER_VERSION}/markets/${this.curMarket}`)
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
    cancel: function (id) {
      this._delete({
        url: '/markets/' + this.curMarket + '/orders/' + id
      })
    },
    cancelAll: function () {
      if (this.curData.length === 0) {
        return ''
      }
      this._delete({
        url: '/markets/' + this.curMarket + '/orders/' + 0,
        data: {
          cancel_all: 'TRUE'
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
  @import './orders.scss'
</style>
