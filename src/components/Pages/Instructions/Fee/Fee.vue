<template>
  <div>
    <BasicInstructions :title='"交易费率"'></BasicInstructions>
    <div class="btc-marginT60 btc-fee-table">
      <p><strong>交易费率：</strong>0.1% 交易手续费。（扣除收取到的资产）;<strong> 充值费率：</strong>免费 ;<strong> 提现费率：</strong>提现手续费将会根据区块实际情况定期调整。</p>
      <table class="table table-bordered text-center">
        <thead>
          <tr>
            <th>排序</th>
            <th>名称</th>
            <th>简称</th>
            <th>交易</th>
            <th>提币</th>
            <th>充值</th>
            <th>最小提币量</th>
            <th>提币单笔限额</th>
            <th>提币单日限额</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td scope="row">1</td>
            <td>比特币 -Bitcoin</td>
            <td>BTC</td>
            <td>0.10%</td>
            <td>0.10%</td>
            <td>0%</td>
            <td>0.00001</td>
            <td>0.00001</td>
            <td>0.00001</td>
          </tr>
          <tr>
            <td scope="row">2</td>
            <td>泰达币 -Teher</td>
            <td>USDT</td>
            <td>0.10%</td>
            <td>0.10%</td>
            <td>0%</td>
            <td>0.00001</td>
            <td>0.00001</td>
            <td>0.00001</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  body{
    background-color: #fff;
  }
  .btc-fee-table{
    >p{
      font-size: 14px;
      color: #666666;
      >strong{
        color: #333333;
      }
    }
    >table{
      font-size: 14px;
      color: #666666;
      >thead{
        >tr{
          >th{
            background-color: #f2f2f2;
            text-align: center;
            font-weight: normal;
            border-bottom-width: 0;
          }
        }
      }
    }
  }
</style>
