<template>
<div>
  <div class="eventBtn">
    <span class="print" @click="print()">
      <img src="../../../assets/imgs/printer.png" alt="打印" />
    </span>
    <span class="downLoad" @click="downLoad()">
      <img src="../../../assets/imgs/downloads.png" alt="下载" />
    </span>
  </div>

  <div id="BillingCode" ref="taxPic">
    <img :src="src" alt="二维码" />
    <!-- <img src="@/assets/imgs/billingCode.png" alt="">

    <div class="BillingCode-body">
      <div class="QRcode-container" >
        <div class="company-name">
          <h3>开票请扫码</h3>
          <span>微信扫一扫，提交开票申请</span>
        </div>
        <div class="QRcode" id="qrCode" ref="qrCodeDiv">
          
          <img :src="src" alt="二维码" />
        </div>
        <div class="company-info">
          {{this.userLoginInfo.companyName}}
        </div>
      </div>

      <div class="QRcode-footer">
        <div class="QRcode-type">
          <div class="QRcode-type-img">
            <img src="@/assets/imgs/weixin.png" alt="微信">
          </div>
          <div>微信扫码</div>
        </div>
      </div>
     </div> -->

  </div>

  <img id="close_circle" src="@/assets/imgs/close_circle.png" alt="关闭" @click="closeCircle()">
</div>
</template>

<script>
import QRCode from 'qrcodejs2';
import {getWeChatQrCode, } from "@/api/review.js";

export default {
  name: "BillingCode",
  components: {},
  props: {
    //税盘号
    taxDiskNum:{
        type: String,
        default: '',
    },

  },
  data() {
    return {
      // 登录用户信息
      userLoginInfo: {},

      // 税盘信息
      taxDiskInfo: {},

      // 微信二维码地址信息
      wxCode: '',

      // oss地址
      ossUrl: '',


      src: '',


    };
  },
  created() {},
  mounted() {
    console.log(this.$store.state)
    this.ossUrl = this.$store.state.settings.ossURL;
    this.taxDiskInfo = this.$store.state.user.taxDiskInfo
    this.userLoginInfo = this.$store.state.user.loginInfo

    // this.wxCode = this.$store.state.user.taxDiskInfo.wechatQrcode;
    this.src = this.ossUrl.trim() + this.taxDiskInfo.wechatQrcode.trim()
    
    
  },
  methods: {
    // 下载
    downLoad() {
      console.log('下载', this.src );
      // let a = document.createElement('a')
      // a.download = name || 'pic'
      // // 设置图片地址
      // a.href = this.src;
      this.downloadIamge(this.src, 'BillingCode')

    },
    downloadIamge(imgsrc, name) {//下载图片地址和图片名
      let image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function() {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
        let a = document.createElement("a"); // 生成一个a元素
        let event = new MouseEvent("click"); // 创建一个单击事件
        a.download = name || "photo"; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = imgsrc;
    },


    // 打印
    print() {
      console.log('打印');
      this.$print(this.$refs.taxPic)
    },


    // 关闭
    closeCircle() {
      this.$emit('closeCircle')
    },
    

    
  },
};
</script>

<style scoped>
#BillingCode {
  width: 100%;
  height: 527px;
  background-color: rgba(0, 0, 0, 0.5);
  /* background: url('../../../assets/imgs/billingCode.png') no-repeat;
  background-size: cover; */
}
#BillingCode>img {
  width: 100%;
  height: 527px;
}

.BillingCode-body {
  position: absolute;
  top: 0px;
  left: 66px;
}


.eventBtn {
  position: absolute;
  top: 15px;
  right: 5px;
  z-index: 3;
  /* display: flex;
  flex-direction: row-reverse;
  color: #fff; */
}
.eventBtn>span {
  display: inline-block;
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.eventBtn>span>img {
  width: 100%;
  height: 100%;
}
.eventBtn .print {
  margin-right: 30px;
}
.eventBtn .downLoad {
  margin-right: 30px;
}

.QRcode-container {
  height: 450px;
  padding-top: 25px;
  text-align: center;
}
.company-name {
  margin-bottom: 10px;
  font-size: 20px;
  color: #fff;
}
.company-name>span {
  font-size: 14px;
}
.QRcode {
  width: 245px;
  height: 245px;
  border-radius: 10px;
  /* background-color: #fff; */
  margin: 0 auto;
  padding: 5px 5px 5px 10px;
}
.QRcode>img {
  width: 100%;
  height: 100%;
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
  height: 56px;
  font-size: 12px;
  margin-top: 20px;
  /* background-color: #fff; */
}
.QRcode-type {
  width: 50px;
  margin: 0 auto;
  /* padding-top: 10px; */
}
/* .QRcode-type-img {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
} */
.QRcode-type-img>img {
  display: block;
  width: 40px;
  height: 40px;
  margin: 0 auto;
  border-radius: 9px;
}

#close_circle {
  width: 30px;
  height: 30px;
  position: absolute;
  bottom: -45px;
  left: 175px;
}
</style>
