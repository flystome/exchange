<template>
  <div class="row btc-table-container">
    <div class="bs-example btc-table" data-example-id="simple-table">
      <table class="table">
        <caption class="font-w">{{table.captionTitle}}<slot name='remark'></slot></caption>
        <tbody>
          <tr v-for="(item, length) in table.Item" :key='length'>
            <td v-for="(data,index)  in item.content" :key="index"
            :class="{'btc-tableTextright':index === 0,'btc-tableTextleft': index === item.content.length-1}">
              {{data}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BasicTable',
  props: ['table']
}
</script>

<style>
@import './BasicTable.css'
</style>
