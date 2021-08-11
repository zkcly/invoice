<template>
  <div>
    <div id="iframe" v-if="iframeVisible">
      <object
        :data="iframeSrc"
        frameborder="0"
        class="abc"
        width="100%"
      ></object>

      <!-- <iframe
        :src="iframeSrc"
        frameborder="0"
        class="abc"
        width="100%"
      ></iframe> -->
    </div>

    <div class="sement" v-else>
    <p class="bxlctext">智能报销</p>
    <div class="grid-content bg-purple">
      <div class="znsp">
        <div class="znspimg">
          <img :src="imgurl" />
        </div>
        <div class="znsptext">
          <p class="text1">智能识票</p>
          <p class="text2">
            票据智能分类、电子发票自动采集识别、费用票智能识别、智能价税分离
          </p>
        </div>
      </div>
    </div>
    <div class="grid-content bg-purple-light">
      <div class="znsp">
        <div class="znspimg">
          <img :src="imgurl2" />
        </div>
        <div class="znsptext">
          <p class="text1">智能报销</p>
          <p class="text2">
            发票自动生成报销单、合规监控降低报销风险、发票查验真伪、防止重复报销
          </p>
        </div>
      </div>
    </div>
    <div class="grid-content bg-purple">
      <div class="znsp">
        <div class="znspimg">
          <img :src="imgurl3" />
        </div>
        <div class="znsptext">
          <p class="text1">智能入账</p>
          <p class="text2">
            与智能财务协同使用、费用支付银企互联、发票集中管理、享受智能财税服务
          </p>
        </div>
      </div>
    </div>
    <div class="grid-content bg-purple-light">
      <div class="znsp">
        <div class="znspimg">
          <img :src="imgurl4" />
        </div>
        <div class="znsptext">
          <p class="text1">智能归档</p>
          <p class="text2">电子发票智能归档，合规备查</p>
        </div>
      </div>
    </div>

    <p class="bxlctext">报销流程</p>
    <div class="bxlc">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="4">
          <div>
            <img :src="imgurl5" />
            <p class="text3">1.客户端开通智能报销</p>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <img :src="imgurl6" />
            <p class="text3">
              2.打开微信扫描审核开票二维码，进入智能报销，一键生成报销单
            </p>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <img :src="imgurl7" />
            <p class="text3">3.领导通过小程序或PC端 在线审批</p>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <img :src="imgurl8" />
            <p class="text3">4.电子发票智能归档</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="toolip">
      <el-tooltip
        content="提醒：开票员手机号即为智能报销管理员手机号，开通前请确认开票员手机号是否正确"
        placement="top"
      >
        <el-button @click="handelOpen">立即开通</el-button>
      </el-tooltip>
    </div>
    </div>

    
  </div>
</template>

<script>
import {
  getSmartUUID,
  verification,
  checkActivated,
} from "@/api/smartReimbursement.js";

export default {
  name: "Sement",
  data() {
    return {
      imgurl: require("@/assets/images/filesearch.png"),
      imgurl2: require("@/assets/images/redenvelope.png"),
      imgurl3: require("@/assets/images/redenelope2.png"),
      imgurl4: require("@/assets/images/audit.png"),
      imgurl5: require("@/assets/images/zn01.png"),
      imgurl6: require("@/assets/images/zn02.png"),
      imgurl7: require("@/assets/images/zn03.png"),
      imgurl8: require("@/assets/images/zn04.png"),

      dialogVisible: false,
      // 税盘信息
      taxDiskInfo: {},
      // 登录用户信息
      userLoginInfo: {},
      // 嵌套地址
      iframeSrc: "",
      iframeVisible: false,
      
    };
  },
  mounted() {
    this.userLoginInfo = this.$store.state.user.loginInfo;
    this.taxDiskInfo = this.$store.state.user.taxDiskInfo;
  },
  methods: {
    //立即开通
    handelOpen() {
      this.$confirm(
        "是否确定开通? 您有15天的试用期，超出试用期请联系客服购买",
        "确认开通",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          // type:'info'
        }
      ).then(() => {
        this.getSmartUUIDAjax()
        
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消开通'
        });  
      });
    },



    // 获取uuid
    getSmartUUIDAjax() {
      let params = {
        taxDiskNum: this.taxDiskInfo.taxDiskNum, //税盘号
        taxPayerId: this.userLoginInfo.taxId, //税号
      };
      getSmartUUID(params)
        .then((response) => {
          if (response && response.code == "200") {
            let uuid = response.data;
            // let url = "https://mcp.chanjet.com/v2/cooper/xwdzgc?code="+uuid+"&productId=4434&timeStamp="+new Date().getTime();//生产地址
            let url ="https://mcp3.inte.chanjet.com/v2/cooper/xwdzgc?code="+uuid+"&productId=4434&timeStamp="+new Date().getTime(); //测试地址
            this.iframeVisible = uuid ? true : false;
            this.iframeSrc = url;
          }
        })
        .catch((error) => {});
    },


    
  },
};
</script>

<style lang="scss" scoped>

@media screen and (max-width: 1919px)  {
  .abc{
    min-height:710px;
    overflow:auto
  }
}
@media screen and (min-width: 1920px)  {
  .abc{
    min-height:995px;
    overflow:auto
  }
}
.sement {
  background-color: #ffffff;
  padding: 26px 40px;
}
.grid-content {
  display: inline-block;
  width: 48%;
  height: 134px;
  background: #e6f7ff;
  border: 1px solid #bae7ff;
  margin-right: 2%;
  margin-bottom: 20px;
}

.znsp {
  display: flex;
}
.znspimg {
  margin-top: 30px;
  margin-left: 20px;
}
.znsptext {
  margin-top: 14px;
  margin-left: 20px;
  margin-right: 20px;
}
.text1 {
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  color: #141414;
  line-height: 22px;
}
.text2 {
  width: 100%;
  font-size: 14px;
  font-weight: 400;
  color: #505050;
  line-height: 20px;
}
.text3 {
  width: 100%;
  font-size: 12px;
  font-weight: 400;
  color: #141414;
  line-height: 17px;
  text-align: center;
}
.bxlc {
  margin-left: 20px;
}
.el-button {
  width: 120px;
  height: 38px;
  background: #d8d8d8 linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 26px;
  color: #fff;
}
.toolip {
  width: 100%;
  text-align: center;
  margin: 0 auto;
  margin-top: 54px;
  margin-bottom: 36px;
}
.bxlctext {
  font-size: 16px;
  font-weight: bold;
  color: #141414;
}
.el-col-5 {
  width: 20.83333%;
  margin-top: 40px;
}
</style>
