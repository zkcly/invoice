<template>
  <!-- <el-container>
    <el-main> -->
  <div class="page-container" id="boxx">
    <div>
      <div class="title">进项管理</div>
      <div class="box">
        <el-row :gutter="10">
          <div v-for="(item, key) in menuList2" :key="key">
            <el-col
              :xs="4"
              :sm="4"
              :md="4"
              :lg="4"
              :xl="4"
              style="cursor: pointer"
            >
              <el-card
                shadow="hover"
                class="invoicing-menu-item"
                @click.native="goDetail()"
              >
                <img
                  src="@/assets/images/income@2x.png"
                  v-if="item.path == 'incomeModule'"
                />
                <p>{{ item.label }}</p>
              </el-card>
            </el-col>
          </div>
        </el-row>
      </div>
    </div>
  </div>
  <!-- </el-main>
  </el-container> -->
</template>

<script>
import request from "@/utils/request";
import Config from "@/settings";
import { getToken } from "@/utils/auth";
import { listRouterApi } from "@/api/invoice.js";

export default {
  name: "incomeModuleIndex",
  components: {},
  data() {
    return {
      dialogVisible: true,
      clientCode: "",
      menuList: [], //---登录
      menuList2: [
        {
          icon: "",
          id: 43,
          label: "进项认证",
          parentId: 41,
          path: "incomeModule",
        },
      ], //---没有登录
      allMenuList: [],
    };
  },
  created() {
    // if()
    // let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    // console.log(h)
    if (getToken()) {
      this.listRouter();
    }
  },
  methods: {
    goDetail() {
      if (getToken()) {
        var a;
        this.allMenuList.forEach((item) => {
          if (item.label == "进项管理") {
            a = item;
          }
        });
        if (a.status == "0") {
          if (this.menuList2[0].status == "0") {
            if (this.$store.state.user.diskIsOnline) {
              if (this.$store.state.user.diskIsOnline == "1") {
                request({
                  url: "http://localhost:13769/TaxDisk/StartIncomeModule",
                  method: "post",
                  data: {
                    taxId: this.$store.state.user.loginInfo.taxId,
                    certPassword:
                      this.$store.state.user.taxDiskInfo
                        .digitalCertificatePassword,
                  },
                }).then((res) => {
                  if (res.code == "0") {
                    let maxFlag = sessionStorage.getItem("maxFlag");
                    let param = {};
                    if (maxFlag == "true") {
                      param = {
                        x: 0,
                        y: 0,
                        width: window.screen.width,
                        height: window.screen.height,
                      };
                    } else {
                      param = {
                        x: (window.screen.width - 1184) / 2,
                        y: (window.screen.height - 750) / 2,
                        width: 1184,
                        height: 750,
                      };
                    }
                    request({
                      url: "http://localhost:13769/TaxDisk/ShowIncomeWindow",
                      method: "post",
                      data: param,
                    });
                  } else {
                    this.$alert(
                      "服务未启动，进项功能需要插入税盘并启动服务后才可使用",
                      {
                        confirmButtonText: "知道了",
                        title: "提示",
                        iconClass: "el-icon-warning",
                      }
                    );
                  }
                });
              } else {
                this.$confirm("请插入税盘后重试", "税盘不在线", {
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
              this.$confirm("请插入税盘后重试", "税盘不在线", {
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
            this.$confirm("请联系客服开通！", "未开通此功能", {
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
          this.$confirm("请联系客服开通！", "未开通此功能", {
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
    // 获取菜单路由列表
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
                  return item.path == "incomeModule";
                }) == true
              ) {
                res.data.forEach((item) => {
                  if (item.path == "incomeModule") {
                    if (item.children.length > 0) {
                      that.menuList2 = item.children;
                    } else {
                      that.menuList2 = [];
                    }
                  }
                });
              } else {
                that.menuList2 = [];
              }
            } else {
              that.menuList2 = [];
            }
          }
        })
        .catch((error) => {});
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  border: none;
}
html {
  height: 100%;
  display: table;
}

body {
  display: table-cell;
  height: 100%;
}
.page-container {
  background: #fff;
  // height: 100%;
  height: 730px;
  margin: 0;
  padding: 0;
  .title {
    height: 64px;
    line-height: 64px;
    margin-left: 31px;
    background: #ffffff;
    border-radius: 2px 2px 0px 0px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #252525;
    border-bottom: 1px solid #f0f0f0;
  }
  .box {
    margin-top: 42px;
    margin-left: 40px;
    margin-right: 40px;
    .el-row {
      text-align: center;
      img {
        width: 60px;
        height: 60px;
        background: #f1f5ff;
        border-radius: 5px;
        text-align: center;
      }
      p {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.6);
      }
    }
  }
}

#boxx ::v-deep .el-card {
  box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.01) !important;
}
</style>