<template>
  <div class="btc-table-container hidden-xs">
    <div class="bs-example btc-table" data-example-id="simple-table">
      <table class="table">
        <caption class="font-w"><strong>{{captionTitle}}</strong>
          <slot name='remark'></slot>
        </caption>
        <tbody>
          <tr v-for="(item, length) in item" :key='length' v-if="length < 6">
            <td v-for="(data,index)  in item.content" :key="index" :style="{width: toPercent()}" :class="{'btc-tableTextright':index === 0,'btc-tableTextleft': index === item.content.length-1}" v-html="data">

            </td>
          </tr>
        </tbody>
        <div class="text-center btc-table-record" v-if="item.length === 0">
          <div>
            <div class="btc-marginT15 btc-font12 btc-color999">{{$t('member_center.no_record')}}</div>
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
  props: ['captionTitle', 'item'],
  methods: {
    toPercent () {
      var str = Number(1 / this.item[0].content.length * 100)
      str += '%'
      return str
    }
  }
}
</script>

<style>
  @import './BasicTable.css'
</style>
