<template>
  <div class="smartreimburIndex" id="boxx">
    <div id="iframe" v-if="iframeVisible" style="height:100%">
      <span
        @click="closeIframe"
        style="
          position: absolute;
          right: 0;
          margin-right: 1%;
          font-size: 20px;
          cursor: pointer;
        "
        class="el-icon-close"
      ></span>
      <object
        :data="iframeSrc"
        frameborder="0"
        class="abc"
        width="100%"
      ></object>

      <!-- <iframe
        :src="iframeSrc"
        frameborder="0"
        height="750px"
        width="100%"
      ></iframe> -->
    </div>

    <div v-else style="display: flex">
      <div v-for="(item, index) in menuList" :key="index" style="width: 50%">
        <div
          class="left"
          @click="reimbursement()"
          v-if="item.path == 'sement'"
          style="cursor: pointer"
        >
          <el-card class="cardBox">
            <div class="cardImg">
              <img src="@/assets/images/baoxiao@2x.png" alt="" />
            </div>
            <div class="cardText">
              <div class="textTitle linheig">智能报销</div>
              <div class="textSecond linheig">
                智能识票、智能报销、智能入账、智能归档
              </div>
              <div class="textCommon linheig">让报销更自由</div>
              <div class="textCommon linheig">
                大数据连接人与票，智能生成报销单
              </div>
            </div>
            <div class="cardButton">
              <el-button type="primary" size="small">立即进入</el-button>
            </div>
          </el-card>
        </div>
        <div
          class="right"
          v-if="item.path == 'smartreimburIndex'"
          style="cursor: pointer"
          @click="goSmart()"
        >
          <el-card class="cardBox">
            <div class="cardImg">
              <img src="@/assets/images/jizhang@2x.png" alt="" />
            </div>
            <div class="cardText">
              <div class="textTitle linheig">智能记账</div>
              <div class="textSecond linheig">
                智能财务、智能税务、智能报表、电子档案
              </div>
              <div class="textCommon linheig">懂财 懂税 更懂你</div>
              <div class="textCommon linheig">
                提升做帐准确率，帮助企业享受税收优惠，规避税收风险
              </div>
            </div>
            <div class="cardButton">
              <el-button type="primary" size="small" 
                >立即进入</el-button
              >
            </div>
          </el-card>
        </div>
      </div>
    </div>
     <div class="smartloading">
    <el-dialog
  :visible.sync="smartloading"
  width="25%"
  :close-on-click-modal="false"
   top='38vh'
  >
  <div style="font-size:24px;text-align:center"> 
  <span class="el-icon-loading" ></span>
  <span>智能记账启动中</span>
  </div>
</el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getSmartUUID,
  verification,
  checkActivated,
  caishui,
  StartoverBookkeeping
} from "@/api/smartReimbursement.js";
import { getToken } from "@/utils/auth";
import Config from "@/settings";
import { listRouterApi } from "@/api/invoice.js";

export default {
  name: "SmartreimburIndex",
  components: {},
  data() {
    return {
      token: "",
      // 税盘信息
      taxDiskInfo: {},
      // 登录用户信息
      userLoginInfo: {},
      // 嵌套地址
      iframeSrc: "",
      iframeVisible: false,
      menuList: [
        {
          children: [],
          icon: null,
          id: "76",
          label: "智能报销",
          parentId: "48",
          path: "sement",
          status: 1,
        },
        {
          children: [],
          icon: null,
          id: "77",
          label: "智能财税",
          parentId: "48",
          path: "smartreimburIndex",
          status: 1,
        },
      ],
      allMenuList: [],
      smartloading:false
    };
  },
  mounted() {
    this.userLoginInfo = this.$store.state.user.loginInfo;
    this.taxDiskInfo = this.$store.state.user.taxDiskInfo;
    console.log("税盘信息", this.userLoginInfo);
    if (getToken()) {
      this.listRouter();
    }
  },
  methods: {
    closeIframe() {
      this.iframeVisible = false;
    },
    //判断是否登录
    goSmart() {
      this.token = getToken();
      if (this.token) {
        var that = this;
        if (
          that.allMenuList.some((item) => {
            return item.path == "/smartreimbur/open";
          }) == true
        ) {
          that.allMenuList.forEach((item) => {
            if (item.path == "/smartreimbur/open") {
              if (item.children.length > 0) {
                that.menuList = item.children;
              } else {
                that.menuList = [];
              }
            }
          });
        } else {
          that.menuList = [];
        }

        var a;
        that.allMenuList.forEach((item) => {
          if (item.path == "/smartreimbur/open") {
            a = item;
          }
        });
        if (a.status == "0") {
          that.menuList.forEach((item) => {
            if (item.path == "/smartreimbur/open") {
              if (item.children.length > 0) {
                that.menuList = item.children;
              } else {
                that.menuList = [];
              }
            }
          });
          var b;
          that.menuList.forEach((item) => {
            if (item.path == "smartreimburIndex") {
              b = item;
            }
          });
          if (b.status == "0") {
            // ----------------------判断 是否后台开通
            that.smartPage();
          } else {
            that
              .$confirm("请联系客服开通！", "未开通此功能", {
                confirmButtonText: "知道了",
                showCancelButton: false,
                type: "warning",
              })
              .then(() => {
                return;
              })
              .catch(() => {});
          }
        } else {
          that
            .$confirm("请联系客服开通！", "未开通此功能", {
              confirmButtonText: "知道了",
              showCancelButton: false,
              type: "warning",
            })
            .then(() => {
              return;
            })
            .catch(() => {});
        }
      } else {
        this.$store.commit("user/showLoginWin", true);
      }

    },
    smartPage(){
      caishui().then((res)=>{
        if(res.code==200){
          this.smartloading=true
          let param=res.data
            let maxFlag = sessionStorage.getItem("maxFlag");
                    let position = {};
                    if (maxFlag == "true") {
                      position = {
                        xPoint: 0,
                        yPoint: 0,
                        width: window.screen.width,
                        height: window.screen.height,
                      };
                    } else {
                      position = {
                        xPoint: (window.screen.width - 1184) / 2,
                        yPoint: (window.screen.height - 750) / 2,
                        width: 1184,
                        height: 750,
                      };
                    }
         
          StartoverBookkeeping({
            isHidden:true,
            ...position,
            ...param
          }).then((openres)=>{
             this.smartloading=false
             if(openres.code!='0'){
                this.$alert(openres.message, {
                                  confirmButtonText: "知道了",
                                  title: "提示",
                                  type: "warning",
                                });
             }
          })
        }else if(code !='500'){
           this.$alert(res.msg, {
                                  confirmButtonText: "知道了",
                                  title: "提示",
                                  type: "warning",
                                });
        }
      })
    },
    goToPage(val) {
      this.$router.push({ name: val });
    },

    // 智能报销
    reimbursement() {
      this.token = getToken();
      if (this.token) {
        var that = this;
        if (
          that.allMenuList.some((item) => {
            return item.path == "/smartreimbur/open";
          }) == true
        ) {
          that.allMenuList.forEach((item) => {
            if (item.path == "/smartreimbur/open") {
              if (item.children.length > 0) {
                that.menuList = item.children;
              } else {
                that.menuList = [];
              }
            }
          });
        } else {
          that.menuList = [];
        }
        var a;
        that.allMenuList.forEach((item) => {
          if (item.path == "/smartreimbur/open") {
            a = item;
          }
        });
        if (a.status == "0") {
          that.menuList.forEach((item) => {
            if (item.path == "/smartreimbur/open") {
              if (item.children.length > 0) {
                that.menuList = item.children;
              } else {
                that.menuList = [];
              }
            }
          });
          var b;
          that.menuList.forEach((item) => {
            if (item.path == "sement") {
              b = item;
            }
          });
          if (b.status == "0") {
            // ----------------------判断 是否后台开通
            that.verificationAjax();
          } else {
            that
              .$confirm("请联系客服开通！", "未开通此功能", {
                confirmButtonText: "知道了",
                showCancelButton: false,
                type: "warning",
              })
              .then(() => {
                return;
              })
              .catch(() => {});
          }
        } else {
          that
            .$confirm("请联系客服开通！", "未开通此功能", {
              confirmButtonText: "知道了",
              showCancelButton: false,
              type: "warning",
            })
            .then(() => {
              return;
            })
            .catch(() => {});
        }
      } else {
        this.$store.commit("user/showLoginWin", true);
      }
    },
    listRouter() {
      let applyParams = {
        clientCode: Config.clientCode,
      };
      var that = this;
      listRouterApi(applyParams)
        .then((res) => {
          if (res && res.code == "200") {
            if (res.data.length > 0) {
              that.allMenuList = res.data;
              if (
                res.data.some((item) => {
                  return item.path == "/smartreimbur/open";
                }) == true
              ) {
                res.data.forEach((item) => {
                  if (item.path == "/smartreimbur/open") {
                    if (item.children.length > 0) {
                      that.menuList = item.children;
                    } else {
                      that.menuList = [];
                    }
                  }
                });
              } else {
                that.menuList = [];
              }
            } else {
              that.menuList = [];
            }
          }
        })
        .catch((error) => {});
    },

    // 查询智能报销是否开通
    verificationAjax() {
      let params = {
        taxPayerId: this.userLoginInfo.taxId, //税号
      };
      verification(params)
        .then((response) => {
          if (response && response.code == "200") {
            let res = response.data;
            this.checkActivatedAjax(res);
          }
        })
        .catch((error) => {});
    },

    // 查询是否已验证激活该功能------------------
    checkActivatedAjax(val) {
      let params = {
        taxPayerId: this.userLoginInfo.taxId, //税号
      };
      checkActivated(params)
        .then((response) => {
          if (response && response.code == "200") {
            let res = response.data;

            if (val) {
              // 后台已开通
              if (res) {
                // 已激活
                // 带token访问中台URL
                this.getSmartUUIDAjax();
              } else {
                // 未激活
                // PC端：引导开通智能报销
                this.toOpen();
              }
            } else {
              // 后台未开通
              if (res) {
                // 已激活
                // 判断激活时间是否超过试用期
                // if (激活时间未超过试用期) {
                //   // 带token访问中台URL
                //   // this.getSmartUUIDAjax()
                // }else {
                //   this.$alert('您还未开通此服务，请联系客服开通!', '提示', {
                //       confirmButtonText: '确定',
                //       type: 'warning',
                //   });
                // }
              } else {
                // 未激活
                // PC端：引导开通智能报销
                this.toOpen();
              }
            }
          }
        })
        .catch((error) => {});
    },
    // PC端：引导开通智能报销
    toOpen() {
      this.goToPage("Sement");
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
            // let url ="https://mcp.chanjet.com/v2/cooper/xwdzgc?code=" +uuid +"&productId=4434&timeStamp=" + new Date().getTime(); //生产地址
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

<style  scoped>
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
.smartreimburIndex {
  width: 100%;
}
.left,
.right {
  /* display: inline-block; */
  width: 99%;
}
.left {
  margin-right: 1%;
}
.cardBox {
  position: relative;
}
.cardImg {
  display: inline-block;
  width: 106px;
  height: 106px;
  background: #5397f4;
  border-radius: 12px;
  margin-right: 15px;
}
.cardImg > img {
  width: 100%;
}
.cardText {
  display: inline-block;
  font-size: 1.8vh;
}
.textTitle {
  font-size: 21px;
  font-weight: 600;
  color: #292b2c;
}
.textSecond {
  font-weight: 500;
  color: #949494;
}
.cardButton {
  position: absolute;
  right: 26px;
  top: 26px;
}
.linheig {
  padding: 0 0 11px 0;
}
.jjqd {
  margin: 0 auto;
  width: 56px;
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #8c8c8c;
  line-height: 30px;
}
.jjsx {
  margin: 0 auto;
  width: 80px;
  height: 28px;
  font-size: 20px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #469be6;
  line-height: 60px;
  margin-bottom: 30px;
}

#boxx ::v-deep .el-dialog__wrapper .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.smartloading >>> .el-dialog__header{
  padding: 0;
}
.smartloading >>> .el-dialog__body{
  padding: 60px 20px;
}
.smartloading >>> .el-dialog{
  border-radius: 8px;
}
</style>
