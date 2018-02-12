<template>
  <div class="row btc-table-container hidden-xs">
    <div class="bs-example btc-table" data-example-id="simple-table">
      <table class="table">
        <caption class="font-w"><strong>{{table.captionTitle}}</strong><slot name='remark'></slot></caption>
        <tbody>
          <tr v-for="(item, length) in table.Item" :key='length'>
            <td v-for="(data,index)  in item.content" :key="index" :style="{width: toPercent()}"
            :class="{'btc-tableTextright':index === 0,'btc-tableTextleft': index === item.content.length-1}">
              {{data}}
            </td>
          </tr>
        </tbody>
        <div class="text-center btc-table-record" v-if="table.Item.length === 0">
            <div>
                <div class="btc-marginT15 btc-font12 btc-color999">暂无记录</div>
            </div>
        </div>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BasicTable',
  props: ['table'],
  methods: {
    toPercent () {
      var str = Number(1 / this.table.Item[0].content.length * 100)
      str += '%'
      return str
    }
  }
}
</script>

<style>
@import './BasicTable.css'
</style>
