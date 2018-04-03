<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th>{{ $t('homepage.currency') }}</th>
          <th v-for="(item, index) in heads" :key="item" @click="sortList(index)">
            {{$t(`homepage.${item}`)}} {{ currency === 'my_optional' ? "" : index !==3 && index !==1 ? `(${currency})` : "" | toUpperCase }}
            <img v-if="times == 0 && currencyIndex == index" src="~Img/both.png">
            <img v-else-if="times == 1 && currencyIndex == index" src="~Img/up.png">
            <img v-else-if="times == 2 && currencyIndex == index" src="~Img/down.png">
          </th>
          <th>{{ $t('homepage.price_trend') }}</th>
        </tr>
      </thead>
      <tbody ref="itemlength">
        <tr v-for='(item , index) in oldData' :key='item.name' v-if="matchName(item.name, index)">
          <td>
            <a class="btc-homepage-currency" style="color: #333333;">
              <span>
                <a class="btc-homepage-market" :href="`${HOST_URL}/markets/${item.quote_currency.toLowerCase()}${item.base_currency.toLowerCase()}`">
                  {{item.quote_currency}}<span style="color:#999;min-width: initial;">/{{ item.base_currency }}</span>
                </a>
              </span>
              <i :disabled="disabled" @click="portfolios(item, index)" class="far fa fa-star mylove" :class="{'is-star': item.is_portfolios}"></i>
            </a>
          </td>
          <td>
            <span>{{ item.last }}<span style="color:#999"> / ${{ item.legal_worth }}</span></span>
          </td>
          <td>{{ item.volume }}</td>
          <td>{{ (Number(item.volume) * Number(item.last)).toFixed(2) }}</td>
          <td class="btc-percent" style="color:#fff">
            <div v-if="Number(item.percent) > 0"><span style="background:#fd4041">+{{ Number(item.percent).toFixed(2) }}%</span></div>
            <div v-else-if="Number(item.percent) < 0"><span style="background:#00c4a2">{{ Number(item.percent).toFixed(2) }}%</span></div>
            <div v-else><span style="background:#999999">+{{ Number(item.percent).toFixed(2) }}</span></div>
          </td>
          <td style="max-width: 155px;padding-right: 25px;width:220px">
            <trend
              viewBox="40 0 500 75"
              :data="trend && trend[`${item.quote_currency.toLowerCase()}${item.base_currency.toLowerCase()}`]"
              :gradient="['black']"
              :padding="'0'"
              >
            </trend>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="btc-currency-none text-center btc-marginT150" v-if="itemLength === 0">
      {{ $t('homepage.no_matching_currency') }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'home-market',
  props: ['curData', 'currency', 'search', 'trend'],
  created () {
    this.$on('market', () => {
      this.curData.splice()
    })
  },
  data () {
    return {
      oldData: null,
      HOST_URL: process.env.HOST_URL,
      heads: ['price', `volume`, 'turnover', 'day_highs_and_lows'],
      coins: ['last', 'volume', 'total', 'percent'],
      times: 0,
      currencyIndex: 0,
      itemLength: false,
      disabled: false
    }
  },
  mounted: function () {
    this.initData()
  },
  watch: {
    curData: function (val, oldVal) {
      if (!val) {
        this.oldData = []
      } else {
        this.oldData = JSON.parse(JSON.stringify(val))
      }
      this.times = 0
    },
    async search () {
      await this.$nextTick()
      this.itemLength = this.$refs['itemlength'].children.length
    },
    async oldData () {
      await this.$nextTick()
      this.itemLength = this.$refs['itemlength'].children.length
    }
  },
  filters: {
    toUpperCase (str) {
      return str.toUpperCase()
    }
  },
  methods: {
    matchName (name, index) {
      var reg = new RegExp(`${this.search}`, 'i')
      return reg.test(name.match(/[A-Z]+/ig)[0])
    },
    initData: function () {
      if (!this.curData) return ''
      this.oldData = JSON.parse(JSON.stringify(this.curData))
    },
    sortList: function (index) {
      var order = this.coins[index]
      if (this.currencyIndex !== index) {
        this.currencyIndex = index
        this.times = 0
      }
      if (this.times === 0) {
        this.oldData.sort(function (a, b) {
          if (index === 2) {
            return a['last'] * a['volume'] - b['last'] * b['volume']
          }
          if (index === 3) {
            return a[order] - b[order]
          } else {
            return String(a[order]).localeCompare(String(b[order]))
          }
        })
        this.times = 1
      } else if (this.times === 1) {
        this.oldData.sort(function (a, b) {
          if (index === 2) {
            return b['last'] * b['volume'] - a['last'] * a['volume']
          }
          if (index === 3) {
            return b[order] - a[order]
          } else {
            return String(b[order]).localeCompare(String(a[order]))
          }
        })
        this.times = 2
      } else {
        this.times = 0
        this.oldData = JSON.parse(JSON.stringify(this.curData))
      }
    },
    portfolios (data, index) {
      if (this.disabled) return
      var currency = `${data.quote_currency.toLowerCase()}${data.base_currency.toLowerCase()}`
      if (this.curData[index].is_portfolios) {
        if (this.loginData === 'none') {
          this.curData[index].is_portfolios = false
          this.$emit('marketChange', { index: index, type: 'delete', status: false })
          this.curData.splice()
          return
        }
        this.disabled = true
        this._delete({
          url: `/portfolios/${currency}.json`
        }, (d) => {
          this.disabled = false
          if (d.data.success) {
            this.curData[index].is_portfolios = false
            this.$emit('marketChange', { index: index, type: 'delete' })
            this.curData.splice()
          }
        })
      } else {
        if (this.loginData === 'none') {
          this.curData[index].is_portfolios = true
          this.$emit('marketChange', { index: index, type: 'add', status: true })
          this.curData.splice()
          return
        }
        this.disabled = true
        this._post({
          url: '/portfolios.json',
          data: {
            market: currency
          }
        }, (d) => {
          this.disabled = false
          if (d.data.success) {
            this.$emit('marketChange', { index: index, type: 'add' })
            this.curData[index].is_portfolios = true
            this.curData.splice()
            this.disabled = false
          }
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
@import "./HomeMarket.scss"
</style>
