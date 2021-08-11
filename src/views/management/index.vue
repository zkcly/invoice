<template>
  <div class="page-container" id="boxx">
    <div>
      <div class="invoicingManagement">
        <p class="title">开票管理</p>
        <div class="white">
          <!-- 开票管理第一行 -->
          <el-row :gutter="10">
            <!-- @click="awaitList(item)" -->
            <div v-for="(item, key) in menuListMO" :key="key">
              <el-col
                :xs="4"
                :sm="4"
                :md="4"
                :lg="4"
                :xl="4"
                @click.native="lookDetail(item.path)"
                style="cursor: pointer"
              >
                <!-- <router-link :to="{ name: item.path }"> -->
                <el-card shadow="hover" class="invoicing-menu-item">
                  <img
                    src="@/assets/images/management/dklb@2x.png"
                    v-if="item.path == 'awaitList'"
                  />

                  <img
                    src="@/assets/images/management/hzxx@2x.png"
                    v-if="item.path == 'redLetters'"
                  />

                  <img
                    src="@/assets/images/management/kbzf@2x.png"
                    v-if="item.path == 'emptyInvalid'"
                  />

                  <img
                    src="@/assets/images/management/fpkc@2x.png"
                    v-if="item.path == 'invoiceStock'"
                  />

                  <img
                    src="@/assets/images/management/slff@2x.png"
                    v-if="item.path == 'applyDistribution'"
                  />

                  <img
                    src="@/assets/images/management/spgl@2x.png"
                    v-if="item.path == 'goodsManagement'"
                  />

                  <img
                    src="@/assets/images/management/khgl@2x.png"
                    v-if="item.path == 'clientManagement'"
                  />

                  <img
                    src="@/assets/images/management/dxcz@2x.png"
                    v-if="item.path == 'smsrechargeList'"
                  />

                  <img
                    src="@/assets/images/management/dxcz@2x.png"
                    v-if="item.path == 'taxEncode'"
                  />
                  <p>{{ item.label }}</p>
                </el-card>
                <!-- </router-link> -->
              </el-col>
            </div>
          </el-row>
        </div>
      </div>
      <div class="summaryManagement" style="margin-top: 20px">
        <p class="title">汇总处理</p>
        <div class="white">
          <!-- 汇总处理 -->
          <!-- @click="awaitList(item)" -->
          <el-row :gutter="20">
            <div v-for="(item, key) in menuList" :key="key">
              <el-col
                :span="4"
                @click.native="lookDetail1(item.path)"
                style="cursor: pointer"
              >
                <!-- <router-link :to="{ name: item.path }"> -->
                <el-card shadow="hover" class="invoicing-menu-item">
                  <img
                    src="@/assets/images/management/hzsc@2x.png"
                    v-if="item.path == 'uploadList'"
                  />
                  <img
                    src="@/assets/images/management/jkxx@2x.png"
                    v-if="item.path == 'monitoringInformationList'"
                  />
                  <img
                    src="@/assets/images/management/fpcx@2x.png"
                    v-if="item.path == 'InvoiceInquiry'"
                  />
                  <img
                    src="@/assets/images/management/kptj@2x.png"
                    v-if="item.path == 'invoiceTotal'"
                  />
                  <p>{{ item.label }}</p>
                </el-card>
                <!-- </router-link> -->
              </el-col>
            </div>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Config from "@/settings";
import { getToken } from "@/utils/auth";
import { listRouterApi } from "@/api/invoice.js";
export default {
  name: "ManagementIndex",
  components: {},
  data() {
    return {
      token: "",
      clientCode: "",
      menuListMO: [
        {
          icon: "",
          id: 25,
          label: "待开列表",
          parentId: 24,
          path: "awaitList",
          children: [],
        },
        {
          icon: "",
          id: 26,
          label: "红字信息",
          parentId: 24,
          path: "redLetters",
          children: [],
        },
        {
          icon: "",
          id: 28,
          label: "空白作废",
          parentId: 24,
          path: "emptyInvalid",
          children: [],
        },
        {
          icon: "",
          id: 29,
          label: "发票库存",
          parentId: 24,
          path: "invoiceStock",
          children: [],
        },
        {
          icon: "",
          id: 30,
          label: "申领分发",
          parentId: 24,
          path: "applyDistribution",
          children: [],
        },
        {
          icon: "",
          id: 33,
          label: "商品管理",
          parentId: 24,
          path: "goodsManagement",
          children: [],
        },
        {
          icon: "",
          id: 35,
          label: "客户管理",
          parentId: 24,
          path: "clientManagement",
          children: [],
        },
        {
          icon: "",
          id: 36,
          label: "短信充值",
          parentId: 24,
          path: "smsrechargeList",
          children: [],
        },
      ], //--------------没有登录
      menuList: [
        {
          icon: "",
          id: 38,
          label: "监控信息",
          parentId: 37,
          path: "monitoringInformationList",
          children: [],
        },
        {
          icon: "",
          id: 39,
          label: "发票查询",
          parentId: 37,
          path: "InvoiceInquiry",
          children: [],
        },
        {
          icon: "",
          id: 40,
          label: "开票统计",
          parentId: 37,
          path: "invoiceTotal",
          children: [],
        },
        {
          icon: "",
          id: 41,
          label: "汇总上传",
          parentId: 37,
          path: "uploadList",
          children: [],
        },
      ],
      allMenuList: [],
    };
  },
  created() {
    // this.listRouter();
    // let h =
    //   window.innerHeight ||
    //   document.documentElement.clientHeight ||
    //   document.body.clientHeight;
    if (getToken()) {
      this.listRouter();
    }
  },
  methods: {
    lookDetail(url) {
      this.token = getToken();
      if (
        url == "goodsManagement" ||
        url == "clientManagement" ||
        url == "smsrechargeList"
      ) {
        if (this.token) {
          // this.listRouter();
          let applyParams = {
            clientCode: Config.clientCode,
          };
          var that = this;
          // listRouterApi(applyParams)
          //   .then((res) => {
          //     console.log(res);
          //     // console.log("获取菜单路由列表", response.data[7]);
          //     if (res && res.code == "200") {
          // if (res.data.length > 0) {
          //   that.allMenuList = res.data;
          if (
            that.allMenuList.some((item) => {
              return item.path == "/management";
            }) == true
          ) {
            that.allMenuList.forEach((item) => {
              if (item.path == "/management") {
                if (item.children.length > 0) {
                  console.log(item.children);
                  if (item.children.length == 1) {
                    if (item.children[0].path == "invoicingManagement") {
                      that.menuListMO = item.children[0].children;
                      that.menuList = [];
                    } else if (item.children[0].path == "summaryManagement") {
                      that.menuListMO = [];
                      that.menuList = item.children[0].children;
                    }
                  } else {
                    console.log(item.children);
                    item.children.forEach((item1) => {
                      if (item1.path == "invoicingManagement") {
                        that.menuListMO = item1.children;
                      } else if (item1.path == "summaryManagement") {
                        that.menuList = item1.children;
                      } else {
                        that.menuList = [];
                        that.menuListMO = [];
                      }
                    });
                  }
                } else {
                  that.menuList = [];
                  that.menuListMO = [];
                }
              }
            });
          } else {
            that.menuList = [];
            that.menuListMO = [];
          }
          // }
          //  else {
          //   that.menuList = [];
          //   that.menuListMO = [];
          // }

          var a;
          that.allMenuList.forEach((item) => {
            if (item.path == "/management") {
              a = item;
            }
          });
          if (a.status == "0") {
            var c;
            a.children.forEach((item) => {
              if (item.path == "invoicingManagement") {
                c = item;
              }
            });
            if (c.status == "0") {
              var b;
              that.menuListMO.forEach((item) => {
                if (item.path == url) {
                  // that.$router.push({ name: url });
                  b = item;
                }
              });
              console.log(b);
              if (b.status == "0") {
                // ----------------------判断 是否后台开通
                that.$router.push({ name: url });
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
          // }
          // })
          // .catch((error) => {});
        } else {
          this.$store.commit("user/showLoginWin", true);
        }
      } else {
        if (this.token) {
          if (this.$store.state.user.diskIsOnline) {
            if (this.$store.state.user.diskIsOnline == "1") {
              // this.$router.push({ name: url });
              this.listRouter();
              var a;
              this.allMenuList.forEach((item) => {
                if (item.path == "/management") {
                  a = item;
                }
              });
              if (a.status == "0") {
                var c;
                a.children.forEach((item) => {
                  if (item.path == "invoicingManagement") {
                    c = item;
                  }
                });
                if (c.status == "0") {
                  var b;
                  this.menuListMO.forEach((item) => {
                    if (item.path == url) {
                      // that.$router.push({ name: url });
                      b = item;
                    }
                  });
                  console.log(b);
                  if (b.status == "0") {
                    // ----------------------判断 是否后台开通
                    this.$router.push({ name: url });
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
          this.$store.commit("user/showLoginWin", true);
        }
      }
    },

    lookDetail1(url) {
      this.token = getToken();
      if (this.token) {
        if (this.$store.state.user.diskIsOnline) {
          if (this.$store.state.user.diskIsOnline == "1") {
            // this.$router.push({ name: url });
            this.listRouter();
            var a;
            this.allMenuList.forEach((item) => {
              if (item.path == "/management") {
                a = item;
              }
            });
            if (a.status == "0") {
              var c;
              a.children.forEach((item) => {
                if (item.path == "summaryManagement") {
                  c = item;
                }
              });
              if (c.status == "0") {
                var b;
                this.menuList.forEach((item) => {
                  if (item.path == url) {
                    // that.$router.push({ name: url });
                    b = item;
                  }
                });
                console.log(b);
                if (b.status == "0") {
                  // ----------------------判断 是否后台开通
                  this.$router.push({ name: url });
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
          console.log(res);
          // console.log("获取菜单路由列表", response.data[7]);
          if (res && res.code == "200") {
            if (res.data.length > 0) {
              that.allMenuList = res.data;
              if (
                res.data.some((item) => {
                  return item.path == "/management";
                }) == true
              ) {
                res.data.forEach((item) => {
                  if (item.path == "/management") {
                    if (item.children.length > 0) {
                      console.log(item.children);
                      if (item.children.length == 1) {
                        if (item.children[0].path == "invoicingManagement") {
                          that.menuListMO = item.children[0].children;
                          that.menuList = [];
                        } else if (
                          item.children[0].path == "summaryManagement"
                        ) {
                          that.menuListMO = [];
                          that.menuList = item.children[0].children;
                        }
                      } else {
                        console.log(item.children);
                        item.children.forEach((item1) => {
                          if (item1.path == "invoicingManagement") {
                            that.menuListMO = item1.children;
                          } else if (item1.path == "summaryManagement") {
                            that.menuList = item1.children;
                          } else {
                            that.menuList = [];
                            that.menuListMO = [];
                          }
                        });
                      }
                    } else {
                      that.menuList = [];
                      that.menuListMO = [];
                    }
                  }
                });
              } else {
                that.menuList = [];
                that.menuListMO = [];
              }
            } else {
              that.menuList = [];
              that.menuListMO = [];
            }
          }
        })
        .catch((error) => {});
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
* {
  border: none;
}
.page-container {
  background: #f1f3f7;
  padding: 20px 0px 5px 45px;
}

.invoicingManagement,
.summaryManagement {
  background: #fff;
  margin-top: -30px;
  margin-left: -40px;
  .title {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #262626;
    font-weight: bold;
    border-bottom: 1px solid #f0f0f0;
    padding-top: 22px;
    padding-left: 30px;
    padding-bottom: 22px;
  }
  .white {
    background: #fff;
    padding: 10px 10px;
  }
}
.invoicing-menu-item {
  text-align: center;
  margin-bottom: 5px;
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

#boxx ::v-deep .el-card {
  box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.01) !important;
}
</style>
