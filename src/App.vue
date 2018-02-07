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
  background: #f2f2f2;
  padding-bottom: 13px;
  min-height: 70vh;
}

.btc-container-block{
  background: white;
  margin-top: 10px;
}

.btc-link{
  color: #4f89f5;
}

.btc-link:hover{
  text-decoration: none;
  cursor: pointer;
  color: #4f89f5;
}

.btc-poniter{
  cursor: pointer;
}

.btc-b-r{
  border-right:1px solid #f2f2f2;
}

.btc-b-l{
  border-left:1px solid #f2f2f2;
}

.btc-b-t{
  border-top:1px solid #f2f2f2;
}

.btc-b-b{
  border-bottom:1px solid #f2f2f2;
}

.btc-fr{
  float: right;
}

.btc-fl{
  float: left;
}

.btc-color666{
  color: #666666;
}
</style>

<style lang="scss">
$margin: '5','10','15','20','25','30','35','45','50','55','60';

@each $len in $margin{
  .btc-marginT#{$len}{
    margin-top: #{$len}px
  }
  .btc-marginL#{$len}{
    margin-left: #{$len}px
  }
  .btc-marginR#{$len}{
    margin-right: #{$len}px
  }
  .btc-marginB#{$len}{
    margin-bottom: #{$len}px
  }

  .btc-paddingT#{$len}{
    margin-top: #{$len}px
  }
  .btc-paddingB#{$len}{
    margin-left: #{$len}px
  }
  .btc-paddingL#{$len}{
    margin-right: #{$len}px
  }
  .btc-paddingR#{$len}{
    margin-bottom: #{$len}px
  }
}
</style>
