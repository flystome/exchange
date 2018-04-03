<template>
  <section id="exchange">
    <header>
      <img src="">
      <lastPrice></lastPrice>
      <account></account>
    </header>

    <section class="content">
      <div class="top_content">
        <div class="market">
          <marketList></marketList>
        </div>
        <div class="chart">
          <ul class="chart_hd">

          </ul>
          <div class="chart_bd">
            <div class="candle" id="candle">

            </div>
            <div class="depth">

            </div>
          </div>
        </div>
      </div>
      <div class="my_order">

      </div>
    </section>
    <section class="list">
      <div class="list_lt">
        <div class="list_box"></div>
        <div class="order "></div>
      </div>
      <div class="list_rt">
        <div class="list_box buy"></div>
        <div class="order sell"></div>
      </div>
    </section>
  </section>
</template>

<script>
  export default {
    name: 'ExChange',
    data () {
      return {

      }
    }
  }
</script>
<style lang="scss">
  @import './exchange.scss'
</style>
