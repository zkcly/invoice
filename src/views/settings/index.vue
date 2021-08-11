<template>
  <!-- <el-container>
    <el-main> -->
  <div class="page-container" id="boxx">
    <div>
      <div class="title">系统管理</div>
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
                @click.native="goDetail(item.path)"
              >
                <img
                  src="@/assets/images/cssz@2x.png"
                  v-if="item.path == 'initial'"
                />
                <img
                  src="@/assets/images/yhgl@2x.png"
                  v-if="item.path == 'userList'"
                />
                <img
                  src="@/assets/images/jsgl@2x.png"
                  v-if="item.path == 'role'"
                />
                <img
                  src="@/assets/images/gzpz@2x.png"
                  v-if="item.path == 'rule'"
                />
                <img
                  src="@/assets/images/gzpz@2x.png"
                  v-if="item.path == 'updateLog'"
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
import Config from "@/settings";
import { getToken } from "@/utils/auth";
import { listRouterApi } from "@/api/invoice.js";

export default {
  name: "SettingsIndex",
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
          label: "初始设置",
          parentId: 41,
          path: "initial",
        },
        {
          icon: "",
          id: 44,
          label: "用户管理",
          parentId: 41,
          path: "userList",
        },
        {
          icon: "",
          id: 45,
          label: "角色管理",
          parentId: 41,
          path: "role",
        },
        // {
        //   icon: "",
        //   id: 46,
        //   label: "规则管理",
        //   parentId: 41,
        //   path: "rule",
        // },
        {
          icon: "",
          id: 47,
          label: "规则配置",
          parentId: 41,
          path: "updateLog",
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
    goDetail(url) {
      if (getToken()) {
        // this.listRouter();
        // let applyParams = {
        //   clientCode: Config.clientCode,
        // };
        var that = this;
        // listRouterApi(applyParams)
        //   .then((res) => {
        //     if (res && res.code == "200") {
        //       if (res.data.length > 0) {
        // that.allMenuList = res.data;
        if (
          that.allMenuList.some((item) => {
            return item.path == "/settings";
          }) == true
        ) {
          that.allMenuList.forEach((item) => {
            if (item.path == "/settings") {
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
        // } else {
        //   that.menuList2 = [];
        // }

        var a;
        that.allMenuList.forEach((item) => {
          if (item.path == "/settings") {
            a = item;
          }
        });
        if (a.status == "0") {
          var b;
          that.menuList2.forEach((item) => {
            if (item.path == url) {
              // that.$router.push({ name: url });
              b = item;
            }
          });
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
        //   }
        // })
        // .catch((error) => {});
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
                  return item.path == "/settings";
                }) == true
              ) {
                res.data.forEach((item) => {
                  if (item.path == "/settings") {
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