<template>
  <div id="payCode">
    <div class="QRcode-container">
      <div class="company-name">浙江旋极共创科技有限责任公司</div>
      <div class="QRcode">

      </div>
      <div class="company-info">
        <div>
          <span class="dzgc">电专工厂</span>
          <span>一站式数字化财税平台</span>
        </div>
        <p>客服电话: 400-672-8066</p>
      </div>
    </div>

    <div class="QRcode-footer">
      <div class="QRcode-type">
        <div class="QRcode-type-img">
          <img src="@/assets/imgs/weixin.png" alt="微信">
          <img src="@/assets/imgs/zhifubao.png" alt="支付宝">
        </div>
        <div>支持微信/支付宝扫码</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "PayCode",
    components: {},
    data() {
      return {
        // 发票类型
      };
    },
    created() {},
    mounted() {},

    computed: {},
    methods: {
      // 二维码
    },
  };
</script>

<style scoped>
  /*#payCode >>> .el-dialog__body{*/
    /*padding: 0 20px !important;*/
  /*}*/
  #payCode {
    width: 100%;
    height: 527px;
    background-color: #5e8cf9;
    position: relative;
    top: -30px;
  }
  .eventBtn>span {
    cursor: pointer;
  }
  .QRcode-container {
    height: 450px;
    padding-top: 40px;
    text-align: center;
  }
  .company-name {
    margin-bottom: 30px;
    font-size: 22px;
    color: #fff;
  }
  .QRcode {
    width: 251px;
    height: 251px;
    border-radius: 10px;
    background-color: #fff;
    margin: 0 auto;
  }
  .company-info {
    margin-top: 25px;
    color: #fff;
  }
  .company-info>div {
    font-size: 16px;
    margin-bottom: 20px;
  }
  .company-info>div .dzgc {
    margin-right: 20px;
  }


  .QRcode-footer {
    height: 77px;
    font-size: 12px;
    background-color: #fff;
  }
  .QRcode-type {
    width: 113px;
    margin: 0 auto;
    padding-top: 10px;
  }
  .QRcode-type-img {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }
  .QRcode-type-img>img {
    width: 40px;
    height: 40px;
    border-radius: 9px;
  }
</style>
