<template>
  <div class="btc-member-center">
    <div class="btc-container-block btc-member-p12">
      <div class="col-md-6">
        <ul class="nav navbar-nav">
          <li class="btc-img-position">
            <img src="~Img/asset-total.png"  class="btc-header-asset">
            {{$t('extract_currency.total_assets')}} <span>0.95287320</span> BTC
          </li>
          <li class="btc-img-position btc-marginL50">
            <img src="~Img/asset-freeze.png"  class="btc-header-asset">
            冻结资产 <span>0.03687320</span> BTC
          </li>
        </ul>
      </div>
      <div class="pull-right">
        <ul class="nav navbar-nav pull-right">
          <li class="btc-img-position">
            充值
          </li>
          <li class="btc-img-position">
            <span>|</span>
          </li>
          <li class="btc-img-position">
            提币
          </li>
        </ul>
      </div>
    </div>
    <basic-table></basic-table>
  </div>
</template>



<style scoped lang='scss'>
@import './ExtractCurrency.scss'
</style>
