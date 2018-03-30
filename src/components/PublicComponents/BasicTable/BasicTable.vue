<template>
  <div class="btc-table-container">
    <div class="bs-example btc-table" data-example-id="simple-table">
      <table class="table table-condensed">
        <caption class="font-w"><strong>{{ perfix ? perfix : '' }} {{$t(captionTitle)}}</strong>
          <slot name='remark'></slot>
        </caption>
        <tbody v-if="item.length > 1">
          <tr v-for="(item, length) in item" :key='length' v-if="length < 6">
            <td v-for="(data, index) in item.content"
            :key="index" :style="{width: toPercent()}"
            :class="{
            'btc-tableTextright':index === 0,
            'btc-tableTextleft': index === item.content.length-1,
            'btc-tablehover':  Object.prototype.toString.call(data) === '[object Object]' ? data.hover : false
            }">
            {{ Object.prototype.toString.call(data) !== '[object Object]' ? data : (data.hover ? '' : $t(`withdraw_currency.${data.context}`)) }}
            <slot v-if='data.hover' name="href"
            :data='data'>
            </slot>
            <slot v-if="(Object.prototype.toString.call(data) === '[object Object]' && data.type && data.type['aasm_state'] && ((data.type['aasm_state'] === 'submitting') || (data.type['aasm_state'] === 'submitted') || (data.type['aasm_state'] === 'accepted') || (data.type['aasm_state'] === 'email_expired') )) "
            name="cancel"
            :data='data'
            :id='data.id'>
            </slot>
            </td>
          </tr>
        </tbody>
        <div class="text-center btc-table-record" v-else>
          <div>
            <div class="btc-marginT15 btc-font12 btc-color999">{{$t('my_account.no_record')}}</div>
          </div>
        </div>
      </table>
      <slot name='more'></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BasicTable',
  props: ['captionTitle', 'item', 'perfix'],
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
