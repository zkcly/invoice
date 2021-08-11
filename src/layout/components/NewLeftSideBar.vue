<template>
  <div id="appAside">
    <div class="leftSide">
      <!-- <img src="@/assets/images/logo@2x.png" alt="" class="sildLoag"> -->
      <ul>
        <li class="leftSideItem" v-for="item in menuList" :key="item.id">
          <!-- <el-tooltip class="item" effect="dark" content="首页" placement="right-start">
            <img src="@/assets/images/audit.png" alt="" class="leftSideItemImg">
          </el-tooltip> -->
          <div
            @click="goToPage('dashboard', '首页')"
            v-if="item.path == 'dashboard'"
          >
            <div class="active" v-if="active == '首页'">
              <img
                src="@/assets/imgs/icon_activeHome.png"
                alt=""
                class="leftSideItemImg"
              />
              <div>首页</div>
            </div>
            <div v-else>
              <img
                src="@/assets/imgs/icon_home.png"
                alt=""
                class="leftSideItemImg"
              />
              <div>首页</div>
            </div>
          </div>

          <div
            @click="goToPage('managementIndex', '销项管理')"
            v-if="item.path == '/management'"
          >
            <div class="active" v-if="active == '销项管理'">
              <img
                src="@/assets/imgs/icon_acitveOutput.png"
                alt=""
                class="leftSideItemImg"
              />
              <div>销项管理</div>
            </div>
            <div v-else>
              <img
                src="@/assets/imgs/icon_output.png"
                alt=""
                class="leftSideItemImg"
              />
              <div>销项管理</div>
            </div>
          </div>

          <div @click="goToPage('incomeModule', '进项管理')" v-if="item.path == 'incomeModule'">
            <div class="active" v-if="active == '进项管理'">
              <img
                src="@/assets/imgs/icon_activeIncome.png"
                alt=""
                class="leftSideItemImg"
              />
              <div>进项管理</div>
            </div>
            <div v-else>
              <img
                src="@/assets/imgs/icon_income.png"
                alt=""
                class="leftSideItemImg"
              />
              <div>进项管理</div>
            </div>
          </div>

          <div
            @click="goToPage('SmartreimburIndex', '智能财税')"
            v-if="item.path == '/smartreimbur/open'"
          >
            <div class="active" v-if="active == '智能财税'">
              <img
                src="@/assets/imgs/icon_actvieAI.png"
                alt=""
                class="leftSideItemImg"
              />
              <div>智能财税</div>
            </div>
            <div v-else>
              <img
                src="@/assets/imgs/icon_AI.png"
                alt=""
                class="leftSideItemImg"
              />
              <div>智能财税</div>
            </div>
          </div>

          <div
            @click="goToPage('settingIndex', '系统设置')"
            v-if="item.path == '/settings'"
          >
            <div class="active" v-if="active == '系统设置'">
              <img
                src="@/assets/imgs/icon_acitveSetting.png"
                alt=""
                class="leftSideItemImg"
              />
              <div>设置</div>
            </div>
            <div v-else>
              <img
                src="@/assets/imgs/icon_setting.png"
                alt=""
                class="leftSideItemImg"
              />
              <div>设置</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import { getToken } from "@/utils/auth";
import { listRouterApi } from "@/api/invoice.js";
import Config from "@/settings";
export default {
  name: "Newleftsidebar",

  data() {
    return {
      // 左侧菜单激活项
      active: "",
      menuList: [
        {
          id: 1,
          label: "首页",
          path: "dashboard",
        },
        {
          id: 2,
          label: "销项管理",
          path: "/management",
        },
        {
          id: 3,
          label: "进项管理",
          path: "incomeModule",
        },
        {
          id: 4,
          label: "智能财税",
          path: "/smartreimbur/open",
        },
        {
          id: 5,
          label: "系统设置",
          path: "/settings",
        },
      ],
    };
  },
  created() {
    if (getToken()) {
      this.listRouter();
    }else{
      this.active = sessionStorage.getItem("activeMenu")? sessionStorage.getItem("activeMenu"): "首页";
      if (sessionStorage.getItem("activeMenu")) {
      if (sessionStorage.getItem("activeMenu") == "首页") {
        this.$router.push({ name: "dashboard" });
      } else if (sessionStorage.getItem("activeMenu") == "销项管理") {
        this.$router.push({ name: "managementIndex" });
      } else if (sessionStorage.getItem("activeMenu") == "智能财税") {
        this.$router.push({ name: "SmartreimburIndex" });
      } else if (sessionStorage.getItem("activeMenu") == "系统设置") {
        this.$router.push({ name: "settingIndex" });
      } else if (sessionStorage.getItem("activeMenu") == "进项管理") {
        this.$router.push({ name: "incomeModule" });
      } else {
        this.$router.push({ name: "dashboard" });
      }
    } else {
      this.$router.push({ name: "dashboard" });
    }
    }
  },
  mounted() {
    
  },
  methods: {
    listRouter() {
      let applyParams = {
        clientCode: Config.clientCode,
      };
      var that = this;
      listRouterApi(applyParams)
        .then((res) => {
          if (res && res.code == "200") {
            if (res.data.length > 0) {
              that.menuList = res.data;
              that.active = sessionStorage.getItem("activeMenu")
                ? sessionStorage.getItem("activeMenu")
                : "首页";
              console.log(sessionStorage.getItem("activeMenu"))
              if (sessionStorage.getItem("activeMenu")) {
                if (sessionStorage.getItem("activeMenu") == "首页") {
                  if(res.data.some(function(item){return item.label=='首页'})==true){
                    that.$router.push({ name: "dashboard" });
                  }else{
                    // that.$router.push({ name: "dashboard" });
                     if(res.data[0].label=='首页'){
                      that.$router.push({ name: "dashboard" });
                    }else if(res.data[0].label=='销项管理'){
                      that.$router.push({ name: "managementIndex" });
                    }else if(res.data[0].label=='智能财税'){
                      that.$router.push({ name: "SmartreimburIndex" });
                    }else if(res.data[0].label=='系统设置'){
                      that.$router.push({ name: "settingIndex" });
                    }else if(res.data[0].label=='进项管理'){
                      that.$router.push({ name: "incomeModule" });
                    }
                  }
                } else if (sessionStorage.getItem("activeMenu") == "销项管理") {
                  if(res.data.some(function(item){return item.label=='销项管理'})==true){
                    that.$router.push({ name: "managementIndex" });
                  }else{
                    // that.$router.push({ name: "dashboard" });
                     if(res.data[0].label=='首页'){
                      that.$router.push({ name: "dashboard" });
                    }else if(res.data[0].label=='销项管理'){
                      that.$router.push({ name: "managementIndex" });
                    }else if(res.data[0].label=='智能财税'){
                      that.$router.push({ name: "SmartreimburIndex" });
                    }else if(res.data[0].label=='系统设置'){
                      that.$router.push({ name: "settingIndex" });
                    }else if(res.data[0].label=='进项管理'){
                      that.$router.push({ name: "incomeModule" });
                    }
                  }
                } else if (sessionStorage.getItem("activeMenu") == "智能财税") {
                  if(res.data.some(function(item){return item.label=='智能财税'})==true){
                    that.$router.push({ name: "SmartreimburIndex" });
                  }else{
                    // that.$router.push({ name: "dashboard" });
                     if(res.data[0].label=='首页'){
                      that.$router.push({ name: "dashboard" });
                    }else if(res.data[0].label=='销项管理'){
                      that.$router.push({ name: "managementIndex" });
                    }else if(res.data[0].label=='智能财税'){
                      that.$router.push({ name: "SmartreimburIndex" });
                    }else if(res.data[0].label=='系统设置'){
                      that.$router.push({ name: "settingIndex" });
                    }else if(res.data[0].label=='进项管理'){
                      that.$router.push({ name: "incomeModule" });
                    }
                  }
                } else if (sessionStorage.getItem("activeMenu") == "系统设置") {
                  // this.$router.push({ name: "settingIndex" });
                  console.log('8888888888888888888888888')
                  if(res.data.some(function(item){return item.label=='系统设置'})==true){
                    that.$router.push({ name: "settingIndex" });
                    console.log('111111111111111111111111111111111111111111111111')
                  }else{
                    // that.$router.push({ name: "dashboard" });
                     if(res.data[0].label=='首页'){
                      that.$router.push({ name: "dashboard" });
                    }else if(res.data[0].label=='销项管理'){
                      that.$router.push({ name: "managementIndex" });
                    }else if(res.data[0].label=='智能财税'){
                      that.$router.push({ name: "SmartreimburIndex" });
                    }else if(res.data[0].label=='系统设置'){
                      that.$router.push({ name: "settingIndex" });
                    }else if(res.data[0].label=='进项管理'){
                      that.$router.push({ name: "incomeModule" });
                    }
                  }
                } else if (sessionStorage.getItem("activeMenu") == "进项管理") {
                  // this.$router.push({ name: "settingIndex" });
                  if(res.data.some(function(item){return item.label=='进项管理'})==true){
                    that.$router.push({ name: "incomeModule" });
                  }else{
                    // that.$router.push({ name: "dashboard" });
                    if(res.data[0].label=='首页'){
                      that.$router.push({ name: "dashboard" });
                    }else if(res.data[0].label=='销项管理'){
                      that.$router.push({ name: "managementIndex" });
                    }else if(res.data[0].label=='智能财税'){
                      that.$router.push({ name: "SmartreimburIndex" });
                    }else if(res.data[0].label=='系统设置'){
                      that.$router.push({ name: "settingIndex" });
                    }else if(res.data[0].label=='进项管理'){
                      that.$router.push({ name: "incomeModule" });
                    }
                  }
                }else {
                  this.$router.push({ name: "dashboard" });
                }
              } else {
                this.$router.push({ name: "dashboard" });
              }
            } else {
              that.menuList = [];
            }
          }
        })
        .catch((error) => {});
    },
    goToPage(val, item) {
      this.active = item;
      sessionStorage.setItem("activeMenu", item);
      this.$router.push({ name: val });
    },
    changeA() {
      this.$nextTick(() => {
        this.active = "销项管理";
      });
      sessionStorage.setItem("activeMenu", "销项管理");
    },
    changeB() {
      this.$nextTick(() => {
        this.active = "首页";
      });
      sessionStorage.setItem("activeMenu", "首页");
    },
    startIncomeModule() {
      this.$router.push({ name: "incomeModule" });
      // request({
      //   url: "http://localhost:13769/TaxDisk/StartIncomeModule",
      //   method: "post",
      //   data: {
      //     taxId: this.$store.state.user.loginInfo.taxId,
      //     certPassword:
      //       this.$store.state.user.taxDiskInfo.digitalCertificatePassword,
      //   },
      // }).then((res) => {
      //   if (res.code == "0") {
      //     let maxFlag = sessionStorage.getItem("maxFlag");
      //     let param = {};
      //     if (maxFlag == "true") {
      //       param = {
      //         x: 0,
      //         y: 0,
      //         width: window.screen.width,
      //         height: window.screen.height,
      //       };
      //     } else {
      //       param = {
      //         x: (window.screen.width - 1184) / 2,
      //         y: (window.screen.height - 750) / 2,
      //         width: 1184,
      //         height: 750,
      //       };
      //     }
      //     request({
      //       url: "http://localhost:13769/TaxDisk/ShowIncomeWindow",
      //       method: "post",
      //       data: param,
      //     });
      //   } else {
      //     this.$alert("服务未启动，进项功能需要插入税盘并启动服务后才可使用", {
      //       confirmButtonText: "知道了",
      //       title: "提示",
      //       iconClass: "el-icon-warning",
      //     });
      //   }
      // });
    },
  },
};
</script>

<style  scoped>
.leftSide {
  position: fixed;
  left: 0;
  width: 66px;
  top: 50px;
}
.sildLoag {
  width: 50px;
}
.leftSideItem {
  text-align: center;
  width: 100%;
  overflow: hidden;
  margin-top: 39px;
  cursor: pointer;
  font-size: 12px;
}
.active {
  color: #608dfa;
}
.leftSideItemImg {
  width: 32px;
  margin-bottom: 8px;
}
</style>
