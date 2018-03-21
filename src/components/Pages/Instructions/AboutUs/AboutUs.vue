<template>
  <div class="btc-aboutus">
    <BasicInstructions :title='$t("footer.about_us")'></BasicInstructions>
    <div class="contianer btc-paddingT80">
      <div>
        <h5><strong>关于HOTEX</strong></h5>
        <h5>HOTEX平台是一群数字资产爱好者创建而成的一个专注区块链资产的交易平台。为用户提供更加安全、便捷的区块链资产兑换服务，聚合全球优质区块链资产，致力于打造世界级的区块链资产交易平台</h5>
      </div>
      <div>
        <h5 class="btc-paddingT30"><strong>安全稳定</strong></h5>
        <h5>多层、多集群系统架构</h5>
      </div>
      <div>
        <h5 class="btc-paddingT30"><strong>高流动性</strong></h5>
        <h5>丰富的资源和众多的合作伙伴为平台提供流动性</h5>
      </div>
      <div>
        <h5 class="btc-paddingT30"><strong>多平台覆盖</strong></h5>
        <h5>支持Web、iOS、Android、H5多语言支持，提供世界范围内多种主流语言支持</h5>
      </div>
      <div>
        <h5 class="btc-paddingT30"><strong>多币种支持</strong></h5>
        <h5>BTC、ETH、LTC、BNB等（不支持法定货币）</h5>
        <h5>HOTEX是全球领先的数字资产交易平台，致力于发现优质的数字资产投资机会，提供逾百对数字资产品类的交易及投资服务。权威化透明化的数字交易平台</h5>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.btc-aboutus{
  .contianer{
    padding: 60px 200px;
    >div{
      >h5{
        line-height: 28px;
        margin: 0;
        color: #666666;
        &:nth-child(1){
          color: #333333;
        }
      }
    }
  }
}
@media (max-width: 1200px) {
  .contianer{
    padding: 60px 20px !important;
  }
}
</style>
