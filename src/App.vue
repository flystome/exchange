<template>
  <div id="app">
    <header is='Header' />
    <div class="btc-container">
      <div class="container">
        <router-view/>
      </div>
    </div>
    <footer is='Footer' />
  </div>
</template>

<script>
import Header from '@/components/Pages/Header/Header'
import Footer from '@/components/Pages/Footer/Footer'
export default {
  name: 'App',
  components: {
    Header,
    Footer
  }
}
</script>

<style>
body{
  font-family: '微软雅黑';
}

.btc-container{
  min-height: 610px;
  background: #f2f2f2;
  padding-bottom: 13px;
}

</style>
