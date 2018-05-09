<template>
  <div class="btc-table-container">
    <div class="bs-example btc-table" data-example-id="simple-table">
      <table class="table table-condensed">
        <caption class="font-w"><strong>{{ perfix ? perfix : '' }} {{$t(captionTitle)}}</strong>
          <slot name='remark'></slot>
        </caption>
        <tbody v-if="item.length > 1">
          <tr v-for="(item, length) in item" :key='length' v-if="length <= len">
            <td v-for="(data, index) in item.content"
            :key="index"
            :style="Object.assign({}, data.style, style)"
            :class="{
            'btc-tableTextright':index === 0,
            'btc-tableTextleft': index === item.content.length-1,
            'btc-tablehover':  Object.prototype.toString.call(data) === '[object Object]' ? data.hover : false
            }">
            {{ Object.prototype.toString.call(data) !== '[object Object]' ? data : (data.hover ? '' : data.context) }}
            <slot v-if='data.hover' name="href"
            :data='data'>
            </slot>
            <slot v-if="(Object.prototype.toString.call(data) === '[object Object]' && data.type && data.type['aasm_state'] && ((data.type['aasm_state'] === 'submitting') || (data.type['aasm_state'] === 'submitted') || (data.type['aasm_state'] === 'email_expired') )) "
            name="cancel"
            :data='data'
            :id='data.id'>
            </slot>
            </td>
          </tr>
        </tbody>
        <vue-simple-spinner class="btc-table-spinner" :size="SpinnerSize" v-if="loading" style="margin: 34.5px 0;">
        </vue-simple-spinner>
        <div class="text-center btc-table-record" v-if="!loading && !(item.length > 1)">
          <div>
            <div class="btc-marginT15 btc-font12 btc-color999">{{$t('my_account.no_record')}}</div>
          </div>
        </div>
      </table>
    </div>
    <slot name='more'></slot>
  </div>
</template>

<script>
export default {
  name: 'BasicTable',
  props: {
    captionTitle: {
      type: String
    },
    item: {
      type: Array
    },
    perfix: {
      type: String
    },
    loading: {
      type: Boolean,
      default: false
    },
    SpinnerSize: {
      type: Number,
      default: 88
    },
    len: {
      type: Number,
      default: () => {
        return 5
      }
    }
  },
  computed: {
    style () {
      return {width: this.toPercent()}
    }
  },
  methods: {
    toPercent () {
      var str = Number(1 / this.item[0].content.length * 100)
      str += '%'
      return str
    }
  }
}
</script>

<style scoped lang='scss'>
  @import './BasicTable.scss'
</style>
