<template>
    <div class="btc-qrcode">
      <img :src="dateUrl" :width='length' :height='length'/>
    </div>
</template>

<script>

export default {
  name: 'QrCode',
  props: ['dateUrl', 'length']
}
</script>
