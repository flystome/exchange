<template>
  <div class="btc-member-center" @click="ChoiceAddress(false)">
    <div class="btc-container-block">
      <div class="btc-currency-extract">
          <div class="btc-fl">
            <span>
              <img src="~Img/asset-total.png">
              {{$t('extract_currency.total_assets')}} <span>0</span> BTC
            </span>
            <img class="btc-marginL45 btc-marginR5" src="~Img/asset-freeze.png">
            {{$t('extract_currency.frozen_assets')}} 0 BTC
          </div>
          <div class="btc-fr">
          <a class="btc-poniter">
            <strong>
              {{ $t('extract_currency.deposit') }}
            </strong>
          </a>
          <span>|</span>
          <a class="btc-poniter btc-link">
            <strong>
              {{ $t('extract_currency.withdraw') }}
            </strong>
          </a>
        </div>
      </div>
    </div>
    <div class="btc-container-block">
      <div class="btc-extract-coin">
        <a v-for="(coin,index) in ['btc','eth','ltc','eos','usdt','can','mco','bits','bot','tv','qtum','ink','qash','mona','etc','cfun','btm','chat','hsr','bcc']"
        :class="{'is-chioce': index === length}"
        @click='ChoiceCoin(index)'
        class="btc-b"
        :key="coin">
          <img :src="requireImg(`market-${coin}`)">
          <span>
            {{ coin }}
          </span>
        </a>
      </div>
      <div class="btc-b">
        <div class="btc-extract-form">
          <!-- <basic-option :data='[{
            name: "extract_currency_address",
            value: this.$t("extract_currency.extract_currency_address")
          }]' v-model="this.ExtractAddress"></basic-option> -->
          <div class="btc-extract-address btc-b-l" :style="{background:`url('${requireImg('select')}') 100% 100%`}">
            {{ $t('extract_currency.extract_currency_address') }}
          </div>
          <div v-if="choice" @click.stop="ChoiceAddress(true)">
            <div class="btc-address-contain">
              <div>
                <span class="text-center">bch钱包btc地址A</span>
                <span>1Bv9EYCrCKjtusatU1LiwcAnKRHVSsGjpr1Bv9EYCrCKjtusatU1Liw......</span>
                <span>设为默认丨删除</span>
              </div>
            </div>
          </div>
          <template v-else>
            <div class="btc-extract-explain"><span>{{ $t('extract_currency.available_balance') }}</span> 0.93587458 BTC <span class="btc-marginL15">{{ $t('extract_currency.remaining_withdraw') }}</span> 0.93587458 BTC</div>
              <basic-input class="btc-extract-all" style="display: flex;" :placeholder="$t('extract_currency.Amount_to_withdraw')">
                <basic-button class="btc-link" slot="button" :text="$t('extract_currency.extract_all')"></basic-button>
              </basic-input>
            <div class="btc-extract-explain"><span>{{ $t('extract_currency.minimum_withdraw_amount_of_money') }}</span> 0.001 <span class="btc-fr btc-link"><img src="~Img/tariff-description.png">{{$t('extract_currency.tariff_description')}}</span></div>
            <basic-input  class="btc-marginB10"  :placeholder="$t('extract_currency.google_validate')">
            </basic-input>
            <basic-button style="width:100%" :text="$t('extract_currency.withdraw')">
            </basic-button>
          </template>
        </div>
        <div class="btc-extract-currency">
          <ul>
            <strong class="btc-extract-remind">{{ $t('extract_currency.reminder') }}</strong>
            <li>
              {{ $t('extract_currency.min_currency') }}
            </li>
            <li>
              {{ $t('extract_currency.make_sure_safe') }}
            </li>
            <li>
              {{ $t('extract_currency.withdraw') }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <basic-table :table='ExtractRecord'>
      <div slot="more" class="text-center btc-b-t btc-table-more">
        <a class="btc-link ">{{$t('member_center.show_more')}}</a>
      </div>
    </basic-table>
  </div>
</template>

<script>
export default {
  name: 'ExtractCurrency',
  data () {
    return {
      length: '',
      choice: false,
      ExtractAddress: 'extract_currency_address'
    }
  },
  methods: {
    requireImg (img) {
      return require(`../../../../static/img/${img}.png`)
    },
    ChoiceCoin (index) {
      this.length = index
    },
    ChoiceAddress (boolean) {
      this.choice = boolean
    }
  },
  computed: {
    ExtractRecord () {
      return {
        captionTitle: this.$t('extract_currency.btc_extract_currency_record'),
        Item: [{
          content: [
            this.$t('extract_currency.number'),
            this.$t('extract_currency.extract_time'),
            this.$t('extract_currency.extract_currency_address'),
            this.$t('extract_currency.actual_account'),
            this.$t('extract_currency.absenteeism_expenses'),
            this.$t('extract_currency.statu_and_operation')
          ]
        }]
      }
    }
  }
}
</script>

<style scoped lang='scss'>
@import './ExtractCurrency.scss'
</style>
