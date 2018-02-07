<template>
    <div class="btc-qrcode">
      <img :src="dateUrl"/>
    </div>
</template>

<script>

export default {
  name: 'QrCode',
  props: ['dateUrl']
}
</script>
