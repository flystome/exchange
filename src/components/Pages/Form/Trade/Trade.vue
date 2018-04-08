<template>
  <div class="btc-container-block">
    <basic-table style="margin-top:0px" :len='xhrData.length' :captionTitle='captionTitle' :item='getRecord'>
    </basic-table>
  </div>
</template>

<script>
export default {
  name: 'FormTrade',
  data () {
    return {
      HOST_URL: process.env.HOST_URL,
      captionTitle: 'form.order.order_record',
      xhrData: []
    }
  },
  created () {
    this._get({
      url: `/history/all_trades.json`
    }, (d) => {
      this.xhrData = d.data.trades
    })
  },
  computed: {
    getRecord () {
      return [{content: [

      ]}].concat(this.xhrData.map(data => {
        return {
          content: [

          ]
        }
      }))
    }
  }
}
</script>
