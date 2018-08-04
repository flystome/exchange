<template>
  <div class="form">
    <div class="form-record container-block">
      <h3>{{$t('title.form_amountrecord')}}</h3>
      <div class="change-box">
        <basic-select :data='coins' :value="coin" :lang=true v-on:selected="coin = arguments[0]" class="w-per-14"></basic-select>
        <span class="marginL15">{{$t('form.record.time')}}</span>
        <date-picker v-model="value1" class="marginL10" lang="en" :not-after='new Date()' confirm></date-picker>
        <span class="marginL5 marginR5">—</span>
        <date-picker v-model="value2" lang="en" :not-after='new Date()' confirm></date-picker>
        <span class="time-btn m-hide" @click="getListTime(1, undefined, 1)">{{$t('form.record.month')}}</span>
        <span class="time-btn m-hide" @click="getListTime(1, undefined, 6)">{{$t('form.record.half-year')}}</span>
        <span class="time-btn m-hide" @click="getListTime(1, undefined, 12)">{{$t('form.record.year')}}</span>
        <span class="time-btn" @click="GetList(1, coin, value1, value2)">{{$t('form.record.filter')}}</span>
      </div>
      <ul class="record-hd clearfix">
        <li class="w-per-14">{{$t('form.record.coin')}}</li>
        <li class='w-per-20'>{{$t('form.record.time')}}</li>
        <li class='w-per-20 align_rt'>{{$t('form.record.fee')}}</li>
        <li class='w-per-20 align_rt'>{{$t('form.record.action')}}</li>
        <li class='w-per-20 align_rt'>{{$t('form.record.balance')}}</li>
        <li class='w-per-6'></li>
      </ul>
      <ul class="record-list clearfix">
        <li v-for='(item, index) in listData' :key="'history'+index" :class="{'cur': currencyIndex === index }">
          <div class="list-data">
            <span class='w-per-14'>{{item.code_text}}</span>
            <span class='w-per-20'>{{item.created_at | time}}</span>
            <span class='w-per-20 align_rt'>{{item.balance}}/{{item.fee}}</span>
            <span class='w-per-20 align_rt'>{{$t("form.record."+item.transaction_type)}}</span>
            <span class='w-per-20 align_rt'>{{item.amount}}</span>
            <span class='w-per-6' :class="{'up': currencyIndex === index && showIt}" @click='showDetail(index)' v-if="item.txid !== '--'"><i class="caret "></i></span>
          </div>
          <div class="list-detail" v-if="currencyIndex === index && item.txid !== '--' && showIt">
            <p><span>Address</span><a>{{item.address}}</a></p>
            <p><span>TXID</span><a :href="item.blockchain_url" target="_blank">{{item.txid}}</a></p>
          </div>
        </li>
      </ul>
    </div>
    <paginate
      ref="pagination"
      class="fr"
      :disabled="disabled"
      v-if="pagination !== 0"
      :page-count="pagination"
      :page-range="3"
      :margin-pages="1"
      :click-handler="(num) => { paging(num, coin) }"
      :disabled-class='"disabled"'
      :prev-text="`${$t('form.previous')}`"
      :next-text="`${$t('form.next')}`"
      :page-class="'page-item'">
    </paginate>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DatePicker from 'vue2-datepicker'
// const _debounce = require('lodash.debounce')

export default {
  name: 'AmountRecord',
  created () {
    this.paging(1)
  },
  data () {
    return {
      listData: [],
      pagination: 0,
      disabled: false,
      loading: true,
      search: '',

      currencyIndex: -1,
      coin: '',
      value1: 0,
      value2: 0,
      showIt: false
    }
  },
  components: {
    DatePicker
  },
  methods: {
    OpenWindow (url) {
      window.open(url)
    },
    paging (num, currency) {
      if (this.disabled) return
      this.GetList(num, currency, this.value1, this.value2)
    },
    GetList (num, currency, value1, value2) {
      if (value1 && value2 && new Date(value1) > new Date(value2)) {
        [value1, value2] = [value2, value1]
      }
      if (currency === 'all') {
        currency = undefined
      }
      this.disabled = true
      this.listData = []
      this.loading = true
      this._get({
        url: `/history/account.json`,
        data: {
          page: num,
          currency: currency,
          per_page: 20,
          start_time: value1 || '',
          end_time: value2 || ''
        }
      }, (d) => {
        this.loading = false
        this.disabled = false
        this.listData = d.data.transactions
        this.pagination = d.data.total_pages
      })
    },
    getListTime (num, currency, times) {
      var now = new Date().getTime()
      var value2 = new Date().toLocaleString().split(' ')[0].split('/').join('-')
      var month = 30 * 24 * 3600 * 1000
      var value1 = now - month * times
      value1 = new Date(value1).toLocaleString().split(' ')[0].split('/').join('-')
      this.GetList(1, currency, value1, value2)
    },
    showDetail (index) {
      if (this.currencyIndex === index) {
        this.showIt = false
      } else {
        this.currencyIndex = index
        this.showIt = true
      }
    }
  },
  computed: {
    coins () {
      return (this.assets()).map((item) => {
        return item.toUpperCase()
      })
    },
    ...mapGetters(['assets'])
  }
}
</script>

<style lang="scss" scoped>
  h3 {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #dce0eb;
    font-size: 14px;
    font-weight: bold;
    margin: 0;
  }
  .time-btn {
    display: inline-block;
    height: 30px;
    line-height: 29px;
    padding: 0 10px;
    border: 1px solid #dce0eb;
    vertical-align: -1px;
    margin-left: 15px;
    color: #97a5b3;
    font-weight: 500;
    cursor: pointer;
  }
  .form-record {
    background: #fff;
    padding: 8px 15px;
    min-height: 500px;
  }
  .align_rt {
    text-align: right;
  }
  .mx-datepicker {
    width: 130px;
  }
  .mx-input {
    height: 30px;
    box-shadow: none;
    border-radius: 0;
  }
  ul {
    padding: 0;
    margin: 0;
  }
  .change-box {
    margin: 10px 0;
    border-bottom: 1px solid #dce0eb;
    padding-bottom: 10px;
  }
  .up .caret {
    transform: rotate(180deg)
  }

  .account-search{
    @include sprite($home-search)
  }

  .account-delete{
    @include sprite($search-delete)
  }

  .record-hd, .list-data {
    height: 28px;
    line-height: 28px;
    color: #666;
    font-size: 12px;
  }
  .record-hd {
    color: #7b8896;
    font-weight: bold;
    li {
      display: inline-block;
      float: left;
      text-indent: 10px;
    }
  }

  .record-list {
    padding-bottom: 30px;
    li {
      &.cur {
        background: #f3f9ff;
        border-top: 1px solid #dce0eb;
        border-bottom: 1px solid #dce0eb;
        .list-detail {
          margin-top: 2px;
          font-size: 12px;
          margin-bottom: 4px;
          p {
            height: 26px;
            line-height: 26px;
            padding-left: 70px;
            margin-bottom: 0;
            span {
              float: left;
              margin-left: -60px;
              font-weight: bold;
              color: #7b8896;
            }
            a {
              color: #666;
            }
          }
        }
      }
    }
  }

  .list-data span {
    display: inline-block;
    float: left;
    text-indent: 10px;
  }

  .w-per-14 {
    width: 14% !important;
  }
  .w-per-20 {
    width: 20% !important;
  }
  .w-per-6 {
    width: 6%;
  }

  @media (max-width: 992px) {
    .m-hide {
      display: none;
    }
  }
</style>
