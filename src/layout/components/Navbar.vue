<template>
  <div class="navbar">
    <div class="navBox">
      <!--<div @mousedown="cefSharpStartMoveFun">444</div>-->

      <div class="ss" @mousedown="cefSharpStartMoveFun">
        <img src="@/assets/images/icon_box@2x.png" alt="" class="sildLoag" />
      </div>
      <div class="left">
        <!-- <hamburger
          :is-active="sidebar.opened"
          class="hamburger-container"
          @toggleClick="toggleSideBar"
        /> -->

        <!-- <breadcrumb class="breadcrumb-container" /> -->

        <div class="left-menu">
          <div v-if="!this.$store.state.user.loginInfo" style="line-height: 55px;cursor:pointer;" @click="goLogin">
            未登录
          </div>
          <div v-else>
            <p>{{ this.$store.state.user.loginInfo.companyName||'--' }}</p>
            <!--<p>{{ currentTaxDisk }}</p>-->
            <div id="panBox">
              <span class="dot" :style="{ background:diskIsOnline=='1'? '#73d13d':'red'}"></span>
              <el-select
                v-model="region"
                placeholder="请选择"
                style="minWidth:164px"
                ref="mySelect"
              >
                <el-option
                  v-for="item in regionType"
                  :key="item.id"
                  :label="item.el_label"
                  :value="item.taxDiskNum"
                >
                </el-option>
              </el-select>
            </div>
          </div>

        </div>

      </div>
      <div class="right">
        <div class="right-menu">
          <div class="right-menu-item service" @click.stop.prevent="openServiceFun">
            <img src="@/assets/images/customerservice@2x.png" class="boxX" />
          </div>
          <div class="right-menu-item assit">
            <el-dropdown @command="handleCommand" trigger="hover">
                <span>
                  <img src="@/assets/images/question-circle@2x.png" />
                </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="操作手册"
                >操作手册</el-dropdown-item
                >
                <el-dropdown-item command="更新日志">
                  更新日志
                  <!-- <router-link to="/settings/updateLog">更新日志</router-link> -->
                </el-dropdown-item>
                <el-dropdown-item command="反馈建议"
                >反馈建议</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="right-menu-item assit">
            <el-badge class="item" :value="allNum" :hidden="allNum==0" >
              <el-popover placement="bottom" width="350" trigger="hover">
                <i slot="reference"><img src="@/assets/images/icon_message@2x.png" class="boxX" /></i>
                <div v-show="!showDetail">
                  <div class="textHandle">
                    <div
                      style="margin-left: 20px; cursor: pointer"
                      :class="noticeActive ? 'fontBlue' : ''"
                      @click="noticeClick"
                    >
                      通知
                      <span>({{ noticeNum }})</span>
                    </div>
                    <div
                      style="margin-right: 20px; cursor: pointer"
                      :class="messageActive ? 'fontBlue' : ''"
                      @click="messageClick"
                    >
                      消息
                      <span >({{ messageNum }})</span>
                    </div>
                  </div>

                  <div
                    style="height: 45vh; overflow: auto"
                    v-show="noticeActive"
                  >
                    <div v-for="(item,index) in noticeList" :key="index">
                      <div
                        class="textAll"
                        @click="noticeDetails1(item)"
                        v-if="item.userId"
                        style="color: rgb(200, 200, 200)"
                      >
                        <div class="textLeft">
                          <img
                            src="@/assets/images/icon_tongzhi.png"
                            alt=""
                            class="textImg"
                          />
                        </div>
                        <div class="textRight">
                          <!-- <div>上线通知</div> -->
                          <div>
                              <span v-if="item.notificationType == '0'"
                              >更新通知</span
                              >
                              <span v-if="item.notificationType == '1'"
                              >停服通知</span
                              >
                              <span v-if="item.notificationType == '2'"
                              >其他通知</span
                              >
                          </div>
                          <div class="textCenter">
                            {{ item.content }}
                          </div>
                          <div class="textTime">
                            {{ item.createTime }}
                          </div>
                        </div>
                      </div>
                      <div
                        class="textAll"
                        @click="noticeDetails(item)"
                        v-else
                        style="color: black"
                      >
                        <div class="textLeft">
                          <img
                            src="@/assets/images/icon_tongzhi.png"
                            alt=""
                            class="textImg"
                          />
                        </div>
                        <div class="textRight">
                          <!-- <div>上线通知</div> -->
                          <div>
                              <span v-if="item.notificationType == '0'"
                              >更新通知</span
                              >
                              <span v-if="item.notificationType == '1'"
                              >停服通知</span
                              >
                              <span v-if="item.notificationType == '2'"
                              >其他通知</span
                              >
                          </div>
                          <div class="textCenter">
                            {{ item.content }}
                          </div>
                          <div class="textTime">
                            {{ item.createTime }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style="height: 45vh; overflow: auto"
                    v-show="messageActive"
                  >
                    <div v-for="(item,index) in messageList" :key="index">
                      <div
                        class="textAll"
                        @click="messageDetails1(item)"
                        v-if="item.userId"
                        style="color: rgb(200, 200, 200)"
                      >
                        <div class="textLeft">
                          <img
                            src="@/assets/images/icon_xiaoxi.png"
                            alt=""
                            class="textImg"
                          />
                        </div>
                        <div class="textRight">
                          <div class="textCenter" style="margin-top: 0">
                            {{ item.title }}
                          </div>
                          <div class="textTime">2{{ item.createTime }}</div>
                        </div>
                      </div>
                      <div
                        class="textAll"
                        @click="messageDetails(item)"
                        v-else
                        style="color: black"
                      >
                        <div class="textLeft">
                          <img
                            src="@/assets/images/icon_xiaoxi.png"
                            alt=""
                            class="textImg"
                          />
                        </div>
                        <div class="textRight">
                          <div class="textCenter" style="margin-top: 0">
                            {{ item.title }}
                          </div>
                          <div class="textTime">2{{ item.createTime }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style="
                        height: 3vh;
                        font-size: 13px;
                        border-top: 1px #e8e8e8 solid;
                        width: 100%;
                        margin-top: 5px;
                        text-align: center;
                        line-height: 3vh;
                        padding-top: 5px;
                        cursor: pointer;
                      "
                  >
                    <div @click="clearMessage">
                      <img
                        src="@/assets/images/icon_clearX2.png"
                        alt=""
                        class="textImg1"
                      />清除{{ messageTitle }}
                    </div>
                  </div>
                </div>
                <div v-show="showDetail">
                  <div class="textBack">
                    <div style="cursor: pointer" @click="backLeft()">
                      <i class="el-icon-arrow-left"></i>
                      <span>返回</span>
                    </div>
                  </div>
                  <div style="height: 48vh; overflow: auto">
                    <div style="width: 90%; margin-left: 5%">
                      <div
                        style="
                            font-size: 13px;
                            color: #333333;
                            margin-top: 10px;
                            font-weight: 600;
                          "
                      >
                        {{ showDetailTitle }}
                      </div>
                      <div
                        style="
                            font-size: 13px;
                            color: #595959;
                            margin-top: 8px;
                          "
                      >
                        {{ showDetailCreateTime }}
                      </div>
                      <div
                        style="
                            font-size: 13px;
                            color: #666666;
                            margin-top: 8px;
                          "
                      >
                        {{ showDetailContent }}
                      </div>
                    </div>
                  </div>
                </div>
              </el-popover>
            </el-badge>
            <!-- </div> -->
          </div>
          <el-dropdown class="avatar-container" trigger="hover" >
            <div class="avatar-wrapper">
              <img src="https://dzgc-files.oss-cn-hangzhou.aliyuncs.com/comm/avatar.png" alt="" class="user-avatar">
              <span>{{this.$store.state.user.loginInfo?this.$store.state.user.loginInfo.companyUser.nickName:''}}</span>
              <i class="el-icon-arrow-down" />
            </div>
            <el-dropdown-menu slot="dropdown" class="user-dropdown" v-if="this.$store.state.user.loginInfo">
              <el-dropdown-item @click.native="showModifyDialog">
                <span>修改密码</span>
              </el-dropdown-item>
              <el-dropdown-item divided @click.native="logout">
                <span style="display: block">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>

             <el-dropdown-menu slot="dropdown" class="user-dropdown" v-else>
              <el-dropdown-item @click.native="goLogin">
                <span>登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>

          </el-dropdown>
        </div>
      </div>

      <div class="final">
        <!--<i class="el-icon-minus" @click.stop="cefSharpMinimizeFun"></i>-->
        <div @click.stop="cefSharpMinimizeFun">
          <img class="minimiIcon" src="@/assets/images/minimiIcon.png" alt="">
        </div>
        <div @click.stop="cefSharpMaximizeFun" v-if="!maxFlag">
          <img class="maxmiIcon" src="@/assets/images/maxmiIcon.png" alt="">
        </div>
        <div @click.stop="cefSharpNormalIconFun" v-if="maxFlag">
          <img class="normalIcon" src="@/assets/images/normalIcon.png" alt="">
        </div>
        <div @click.stop="cefSharpcloseFun">
          <img class="closeIcon" src="@/assets/images/closeIcon.png" alt="">
        </div>
        <!--<div @click.stop="cefSharpMaximizeFun"></div>-->
        <!--<i class="el-icon-close" @click.stop="cefSharpcloseFun"></i>-->
      </div>
    </div>

    <!-- 退出后弹窗 -->
    <el-dialog title="提示" :visible.sync="dialogTableVisible" :before-close="handleClose" class="loginOut">
      <el-table :data="gridData">
        <el-table-column
          property="invoiceTypeText"
          label="发票类型"
          width="150"
        ></el-table-column>
        <el-table-column
          property="notUploadedNum"
          label="未上传发票"
          width="150"
        ></el-table-column>
        <el-table-column
          property="copyStatus"
          label="抄报状态"
        >
          <template slot-scope="scope">
            {{scope.row.copyResults == 1 ? '成功' : '失败'}}
          </template>
        </el-table-column>
        <el-table-column
          property="rewriteStatus"
          label="返写状态"
        >
          <template slot-scope="scope">
            {{scope.row.reverseWritingResults == 1 ? '成功' : '失败'}}
          </template></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="handleUpload(scope.row)" type="text" size="small"
                       :disabled='scope.row.notUploadedNum == 0'
            >上传</el-button
            >
            <el-button
              :disabled='scope.row.copyResults == 1'
              @click="copyAndReport(scope.row)"
              type="text"
              size="small"
            >抄报</el-button
            >
            <el-button
              :disabled='scope.row.reverseWritingResults == 1'
              @click="reverseWriting(scope.row)"
              type="text"
              size="small"
            >返写</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-row style="margin-top: 20px">
        <el-col :span="4" :offset="6">
          <el-button @click="dialogTableVisible = false;exitSourceFlag=false">取消</el-button>
        </el-col>
        <el-col :span="4" :offset="4">
          <el-button type="primary" @click="exit">继续退出</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 状态弹窗 -->
    <status-dialog
      :status="statusDialogStatus"
      :visible.sync="statusDialogVisible"
    />

    <!-- 修改密码 -->
    <modify-password :visible.sync="modifyPasswordVisibility" />

    <!-- 登录弹框 -->
    <login-win  v-if="this.$store.state.user.showLoginWin"/>
  </div>
</template>

<script>
  import { mapGetters,mapState } from "vuex";
  // import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from "@/components/Hamburger";
  import StatusDialog from "./StatusDialog.vue";
  import ModifyPassword from "./PasswordDialog.vue";
  import LoginWin from "./LoginWin.vue";
  import { getToken, setToken, removeToken } from "@/utils/auth";
  import { downloadFile, UtilsGetTicketType } from "@/utils/function";
  import { invoiceNotUploaded } from "@/api/invoicesearch";
  import { getRedisList } from "@/api/taxStock";
  import {request,simpleRequest} from "@/utils/requestClient";
  import x2js from "x2js";
  const X2JS = new x2js();
  import {
    showFullScreenLoading,
    tryHideFullScreenLoading,
  } from "@/utils/loadingX";

  import {
    cefSharpNormal,
    cefSharpMaximize,
    cefSharpMinimize,
    cefSharpclose,
    cefSharpStartMove,
    cefSharpShowDevTool,
    cefSharpMinimizeToNotifyIcon,
  } from "@/utils/cefSharp";
  import {
    getSummaryUploadList,
    invoiceUpload,
    invoiceCopyAndReport,
    invoiceReverseWriting,
  } from "@/api/invoiceStatistics";
  import {
    downOptBook,
    getMessage,
    readSingleMessage,
    readMoreMessage,
  } from "@/api/commonAPI.js";
import {
  checkTaxDiskIsOnline,
  invoiceInquiryInit,
  companyDiskRegistrationCodeInit,
} from "@/api/loginprocessApi.js";
import {
  listXiaoApi,
} from "@/api/setpan.js";
  import Config from "@/settings";

  export default {
    components: {
      // Breadcrumb,
      Hamburger,
      StatusDialog,
      ModifyPassword,
      LoginWin
    },
    inject: ["reload"],
    computed: {
      region:{
        get:function () {
          return  this.$store.state.user.taxDiskNum
        },
        set:function(newVal){
          this.regionType.map((item)=>{
             if(newVal==item.taxDiskNum){
               this.$store.commit("user/SET_TAXDISK", item);
                this.confirmDisk(item)
                return
             }
          })
         
          this.$store.commit("user/SET_TAXDISKNUM", newVal);
        }
      },
      regionType:function(){
      
        this.$store.state.user.taxDiskList.forEach((item)=>{
          item.el_label=item.taxDiskName +'  '+ item.taxDiskNum
      })
        return this.$store.state.user.taxDiskList
      },
      diskIsOnline:function () {
        return  this.$store.state.user.diskIsOnline
      },
      ...mapGetters(["sidebar", "avatar"]),
    taxDiskNumChange() {
      return this.$store.state.user.loginInfo.token;
    },
    ...mapState("user", ["loginInfo", "taxDiskInfo", "showLoginWin"]),
  },
  data() {
    return {
      gridData: [
        {
          invoiceType: "专用发票",
          notUpload: 11,
          copyStatus: "已抄报",
          rewriteStatus: "已返写",
        },
      ],
      dialogTableVisible: false,
      statusDialogVisible: false,
      statusDialogStatus: "success",
      modifyPasswordVisibility: false,

      // 用户登入信息
      userLoginInfo: "",
      //--------------------------消息中心字段
      noticeActive: true, //通知显示
      messageActive: false, //消息显示
      noticeList: [], //通知list

      messageList: [], //消息list

      allNum: 0, //总数目
      messageNum: 0, //消息数目
      noticeNum: 0, //通知数目
      showDetail: false, //展示详情
      messageType: "tongzhi",
      messageTitle: "通知",
      showDetailTitle: null, //消息中展示
      showDetailCreateTime: null,
      showDetailContent: null,
      loading: false,
      maxFlag:false,//窗口最大放大
      status: '',
      exitSourceFlag:false,//是否是客户端任务栏菜单关闭退出
    };
  },
  watch: {
    taxDiskNumChange: {
      handler: function (newval, oldval) {
        if (newval !== oldval) {
          this.taxDiskNum = newval;
        }
      },
      deep: true,
    },

  },
  created(){
   this.maxFlag=sessionStorage.getItem('maxFlag')? Boolean(sessionStorage.getItem('maxFlag')):false
  },
  mounted() {
    if (getToken()) {
      this.getClientMessage();
    }
    var t = setInterval(() => {
        if (getToken()) {
      this.getClientMessage();
    } else {
      clearInterval(t);
    }
  }, 1800000);
    this.client(getToken())
  },
  methods: {
    goLogin(){
      this.$store.commit("user/showLoginWin", true);
    },
    handleClose(done){
      this.exitSourceFlag=false;
      done();
    },
    //客户端菜单 托盘退出方法
    async client(token){
      let _this=this;
      try{
        await window.CefSharp.BindObjectAsync('cefWindow');//绑定对象并等待异步完成
        window.cefWindow.init(() => {
          _this.exitSourceFlag=true;
          _this.logout()
      })
      }catch(err) {
        console.log('异常')
      }
    },
    getClientMessage() {
      let applyParams = {
        clientCode: Config.clientCode, //客户端代码
        taxpayerNature: this.$store.state.user.loginInfo.taxpayerNature, //纳税人性质
        userId: this.$store.state.user.loginInfo.companyUser.id, //用户id
      };
      var that = this;
      getMessage(applyParams)
        .then((res) => {
        if (res && res.code == "200") {
        // console.log(res)
        that.messageList = res.data.messages;
        that.noticeList = res.data.notices;
        var a = [];
        var b = [];
        res.data.messages.forEach((item) => {
          if (item.userId) {
          // console.log('123')
        } else {
          a.push(item);
        }
      });
        res.data.notices.forEach((item) => {
          if (item.userId) {
          // console.log('123')
        } else {
          b.push(item);
        }
      });
        that.messageNum = a.length;
        that.noticeNum = b.length;
        that.allNum = a.length + b.length;
      }
    })
    .catch((error) => {});
    },
    setInterX(s, fn) {},
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {

      simpleRequest({ url: "http://localhost:13769/TaxDisk/StopIncomeModule",method: "get"})
      if(getToken()){
        if(this.diskIsOnline!='1'){
          this.$store.commit("user/SET_LOGININFO", '');
          clearInterval(localStorage.getItem('setIntervalId'))
          removeToken();
          this.reload()
          if(this.exitSourceFlag){
            cefSharpclose()
          }
        simpleRequest({ url: "http://localhost:13769/TaxDisk/StopServer",method: "get"})
          return
        }
        getSummaryUploadList({ taxDiskNum: this.region}).then(
          (res) => {
            if (res.code == 200) {
            //   res.data.forEach((item) => {
            //     item.invoiceTypeText = UtilsGetTicketType(item.invoiceType)[0].label;
            // });
              let newArr = res.data.filter(item => {
                return item.notUploadedNum != 0 || item.copyResults ==0 || item.reverseWritingResults == 0
              })
              newArr.forEach((item) => {
                  item.invoiceTypeText = UtilsGetTicketType(item.invoiceType)[0].label;
              });
              if(newArr.length == 0){
                this.exit()
              }
            else{
              this.dialogTableVisible = true;
              this.gridData = newArr
            } 
          } else{
            this.exit()
          }  
      }
      );
      }else{

      simpleRequest({ url: "http://localhost:13769/TaxDisk/StopServer",method: "get"})
       if(this.exitSourceFlag){
        clearInterval(localStorage.getItem('setIntervalId'))
         this.$store.commit("user/SET_LOGININFO", '');
         cefSharpclose()
       }else{
         this.$store.commit("user/showLoginWin", true);
       }
      }
    },
    connectCoreApi(res) {
      let count = 0;
      let intervalId = setInterval(() => {
        count = count + 1;
      getRedisList(res.data).then((redisres) => {
        if (redisres.code == 200) {

        if (redisres.data.code == 1) {
          this.loading = false
          this.$globals.closeContent();
          // tryHideFullScreenLoading()
          clearInterval(intervalId);
          if (redisres.data.msgCode == 200 && this.status !== '上传') {
            //弹出成功提示框，并刷新页面列表
            // this.statusDialogVisible = true;
            // this.statusDialogStatus = "success";
            this.$alert(`${this.status}成功`, '', {
              confirmButtonText: '确定',
              type: "success",
              center: true,
            });

          }
          else if (redisres.data.msgCode == 200 && this.status == '上传'){
            this.$message({
            type: "success",
            message: "上传成功",
           });
            this.invoiceNotUploaded()
          }
           else if (redisres.data.msgCode != 200 && this.status == '上传') {
             this.$message({
              type: "error",
              message: redisres.data.message,
            });
           this.invoiceNotUploaded();
          }else{
             //错误提示弹窗
            // this.statusDialogVisible = true;
            // this.statusDialogStatus = "error";
            this.$alert(redisres.data.message, `${this.status}失败`, {
              confirmButtonText: '确定',
              type: "error",
              center: true,
            });
          }
        } else {
          if(count > 60){
            this.loading = false;
            clearInterval(intervalId);
            this.$globals.closeContent()
            this.$message({
              type: 'error',
              message: '税局服务不稳定，请稍后再试'
            })
          }
          // if (count > 60) {
          //   this.loading = false
          //   this.$globals.closeContent();
          //   clearInterval(intervalId);
          // }
        }
      }
    });
    }, 3000);
    this.timer = intervalId
    },
    handleUpload(row) {
      this.loading = true
      this.status = '上传'
      this.currentInvoiceType = row.invoiceType
      this.$alert("", "上传中,请稍候", {
        confirmButtonText: "停止上传",
        iconClass: "el-icon-loading",
        center: true,
        showClose: false,
        callback: (action) => {
          clearInterval(this.timer);
          this.loading = false;
        },
      });
      invoiceUpload({
        invoiceType: row.invoiceType,
        taxDiskNum: this.region,
      }).then((res) => {
        if (res.code == 200) {
        // showFullScreenLoading()

        this.connectCoreApi(res);
      } else {
        this.$globals.closeContent();
        this.loading = false
      }
    });
    },
    copyAndReport(row) {
      this.loading = true
      this.status = '抄报'
      this.$alert("", "抄报中,请稍候", {
        confirmButtonText: "停止抄报",
        iconClass: "el-icon-loading",
        center: true,
        showClose: false,
        callback: (action) => {
          clearInterval(this.timer);
          this.loading = false;
        },
      });
      invoiceCopyAndReport({
        invoiceType: row.invoiceType,
        taxDiskNum: this.region,
      }).then((res) => {
        if (res.code == 200) {
        this.connectCoreApi(res);
      }
    else{
        this.$globals.closeContent();
        this.loading = false
      }
    });
    },
    reverseWriting(row) {
      this.loading = true
      this.status = '返写'
      this.$alert("", "返写中,请稍候", {
        confirmButtonText: "停止返写",
        iconClass: "el-icon-loading",
        center: true,
        showClose: false,
        callback: (action) => {
          clearInterval(this.timer);
          this.loading = false;
        },
      });
      invoiceReverseWriting({
        invoiceType: row.invoiceType,
        taxDiskNum: this.region,
      }).then((res) => {
        if (res.code == 200) {
        this.connectCoreApi(res);
      }
    else{
        this.$globals.closeContent();
        this.loading = false
      }
    });
    },
    //上传后的同步
    async invoiceNotUploaded() {
      this.$alert("", "同步中,请稍候", {
        confirmButtonText: "停止同步",
        iconClass: "el-icon-loading",
        center: true,
        showClose: false,
        callback: (action) => {
          clearInterval(this.timer2);
          this.loading = false;
        },
      });
      const res = await invoiceNotUploaded({
        invoiceType: this.currentInvoiceType,
        taxDiskNum: this.region,
      });
      if (res.code == 200) {
        if (res.data.length > 0) {
          this.keyX = res.data;
          this.loading = true;
          // this.getRedisX();
          this.setInterX(3000, this.getRedisX);
        } else {
          this.$globals.closeContent();
          this.loading = false;
        }
      } else {
        this.loading = false;
        // this.$message({
        //   type: "warning",
        //   message: res.msg,
        // });
      }
    },

    //创建180秒定时任务，每3秒查询一次
    //每5秒执行一次查询
    setInterX(s, fn) {
      let count = 0;
      let timeOut = (s, fn) => {
        var time1 = setTimeout(() => {
          count++;
          if (count < 60 && this.loading == true) {
            fn.call(this);
            timeOut(s, fn);
          }
          else if(count >=60 && this.loading == true){
            this.loading = false;
            clearTimeout(this.timer2);
            this.$globals.closeContent()
            this.$message({
              type: 'error',
              message: '税局服务不稳定，请稍后再试'
            })
          }
          // else if (count >= 60) {
          //   this.$globals.closeContent();
          //   clearTimeout(this.timer2);
          //   this.loading = false;
          // }
          else {
            this.$globals.closeContent();
            clearTimeout(this.timer2);
            this.loading = false;
          }
        }, s);
        this.timer2 = time1;
      };
      timeOut(s, fn);
    },
    //查询请求
    async getRedisX() {
      const res = await getRedisList(this.keyX);
      if (res.data.code == 1) {
        this.$globals.closeContent();
        clearTimeout(this.timer2);
        if (res.data.msgCode == 200) {
          this.loading = false;
          this.$message({
            type: "success",
            message: "同步成功",
          });
        } else {
          this.loading = false;
          this.$message({
            type: "error",
            message: res.data.message,
          });
        }
      } else {
        this.loading = true;
      }
    },


    showModifyDialog() {
      if(getToken()){
        this.modifyPasswordVisibility = true;
      }else{
        this.$store.commit("user/showLoginWin", true);
      }
    },

    exit() {
      clearInterval(localStorage.getItem('setIntervalId'))
      this.$store.commit("user/SET_diskIsOnline", '0');
      this.$store.commit("user/SET_LOGININFO", '');
      this.$store.commit("user/SET_TAXDISKNUM", '');
      removeToken(); //这行代码应该写在退出的那个接口
      this.dialogTableVisible = false
      this.allNum=0;
      this.messageList = [];
      this.noticeList = [];
      this.messageNum=0;
      this.noticeNum=0;
      this.$router.push({ name: "dashboard" });
      this.reload()
      simpleRequest({ url: "http://localhost:13769/TaxDisk/StopServer",method: "get"})
      // window.location.reload();
      if(this.exitSourceFlag){
        this.$store.commit("user/SET_LOGININFO", '');
        cefSharpclose()//如果是客户端任务栏菜单点击退出 直接调用客户端退出方法
      }else{
        // this.$store.commit("user/showLoginWin", true);
      }

    },

    // 下拉菜单选中事件
    handleCommand(command) {
      if (command == "操作手册") {
        if(getToken()){
          this.downOptBookAjax();
        }else{
          this.$store.commit("user/showLoginWin", true);
        }
      }else if(command == "更新日志"){
        if(getToken()){
          this.$router.push({name:'updateLog'})
        }else{
          this.$store.commit("user/showLoginWin", true);
        }
      } else if (command == "反馈建议") {
        if(getToken()){
          window.open("_blank").location.href =
            "https://support.qq.com/products/311422/";
        }else{
          this.$store.commit("user/showLoginWin", true);
        }

      }
    },
    //    联系客服
    openServiceFun(){
      if(getToken()){
        console.log('2')
        window.open("_blank").location.href =
          "https://url.cn/ZyyOJs8C?_type=wpa&qidian=true";
      }else{
        this.$store.commit("user/showLoginWin", true);
      }

    },
    //下载操作手册
    downOptBookAjax() {
      console.log("OPTajaxsss");
      let params = "";
      downOptBook(params)
        .then((response) => {
        downloadFile(response);
    })
    .catch((error) => {});
    },
  
    //客户端方法---s
    cefSharpNormalIconFun(){
      cefSharpNormal()
      this.maxFlag=false
      sessionStorage.setItem('maxFlag',false)
    },
    //放大
    cefSharpMaximizeFun() {
      cefSharpMaximize();
      this.maxFlag=true
      sessionStorage.setItem('maxFlag',true)
    },
    //最小化 调用此方法后，窗口将最小化到任务栏
    cefSharpMinimizeFun() {
      console.log("最小化");
      this.exitSourceFlag=false
      cefSharpMinimize();

    },
    //关闭窗口(程序将退出)
    cefSharpcloseFun() {
      simpleRequest({ url: "http://localhost:13769/TaxDisk/StopIncomeModule",method: "get"})
      simpleRequest({ url: "http://localhost:13769/TaxDisk/StopServer",method: "get"})
      let closFlag=localStorage.getItem("initSetBase")?JSON.parse(localStorage.getItem("initSetBase")):{panel:"02"};
      //最小化到系统托盘 01  退出电专工厂 02
      if(closFlag.panel=='02'){
        this.exitSourceFlag=true
        this.logout()
      }else{
        cefSharpMinimizeToNotifyIcon()
      }
      //closFlag.panel=='02'?this.logout():cefSharpMinimizeToNotifyIcon()
    },
    cefSharpStartMoveFun() {
      cefSharpStartMove();
      if(this.$refs.mySelect){
        this.$refs.mySelect.handleClose()
      }
    },
    //客户端测试显示开发工具
    testFun() {
      cefSharpShowDevTool();
    },
    //客户端方法---e
  
    // 通知点击
    noticeClick() {
      this.noticeActive = true; //通知显示
      this.messageActive = false; //消息显示
      this.messageType = "tongzhi";
      this.messageTitle = "通知";
    },
    //消息点击
    messageClick() {
      this.noticeActive = false; //通知显示
      this.messageActive = true; //消息显示
      this.messageType = "xiaoxi";
      this.messageTitle = "消息";
    },

    // 清除通知或清除消息
    clearMessage() {
      // console.log(this.messageType);
      if (this.messageType == "xiaoxi") {
        var applyParams = {
          promptType: 1,
          clientCode: Config.clientCode, //客户端代码
          taxpayerNature: this.$store.state.user.loginInfo.taxpayerNature, //纳税人性质
          userId: this.$store.state.user.loginInfo.companyUser.id, //用户id
        };
        var that = this;
        readMoreMessage(applyParams)
          .then((res) => {
          if (res && res.code == "200") {
          that.getClientMessage();
        }
      })
      .catch((error) => {});
      } else if (this.messageType == "tongzhi") {
        var applyParams = {
          promptType: 0,
          clientCode: Config.clientCode, //客户端代码
          taxpayerNature: this.$store.state.user.loginInfo.taxpayerNature, //纳税人性质
          userId: this.$store.state.user.loginInfo.companyUser.id, //用户id
        };
        var that = this;
        readMoreMessage(applyParams)
          .then((res) => {
          if (res && res.code == "200") {
          that.getClientMessage();
        }
      })
      .catch((error) => {});
      }
    },

    //通知详情
    noticeDetails(item) {
      let applyParams = {
        messageId: item.id, //消息id
        userId: this.$store.state.user.loginInfo.companyUser.id, //用户id
      };
      var that = this;
      readSingleMessage(applyParams)
        .then((res) => {
        if (res && res.code == "200") {
        that.showDetail = true;
        that.showDetailTitle = item.title; //消息中展示
        that.showDetailCreateTime = item.createTime;
        that.showDetailContent = item.content;
        that.getClientMessage();
      }
    })
    .catch((error) => {});
    },
    noticeDetails1(item){
      this.showDetail = true;
      this.showDetailTitle = item.title; //消息中展示
      this.showDetailCreateTime = item.createTime;
      this.showDetailContent = item.content;
    },

    // 消息详情
    messageDetails(item) {
      let applyParams = {
        messageId: item.id, //消息id
        userId: this.$store.state.user.loginInfo.companyUser.id, //用户id
      };
      var that = this;
      readSingleMessage(applyParams)
        .then((res) => {
        if (res && res.code == "200") {
        that.showDetail = true;
        that.showDetailTitle = item.title; //消息中展示
        that.showDetailCreateTime = item.createTime;
        that.showDetailContent = item.content;
        that.getClientMessage();
      }
    })
    .catch((error) => {});
    },
    messageDetails1(item){
      this.showDetail = true;
      this.showDetailTitle = item.title; //消息中展示
      this.showDetailCreateTime = item.createTime;
      this.showDetailContent = item.content;
    },

    // 消息详情返回
    backLeft() {
      this.showDetail = false;
    },










    //切换盘登陆逻辑，太繁琐懒得封装了

      closeLoginWin() {
       this.$store.commit("user/showLoginWin", false);
    },
     //同时用于获取ukey盘信息和税盘密码的参数
    getXmlParam1(key) {
      return {
        xml: `<?xml version=\"1.0\" encoding=\"utf-8\"?>
          <business comment=\"税控设备信息查询\" id=\"SKSBXXCX\">
          <body yylxdm=\"1\">
          <input>
          <sksbkl>${key}</sksbkl>
          </input>
          </body>
          </business>`,
      };
    },
    //税务u-key验证数字证书密码参数
    getXmlParam2(digitalCertificatePassword, taxDiskPassword) {
      return {
        xml: `<?xml version=\"1.0\" encoding=\"utf-8\"?><business comment=\"证书口令验证\" id=\"ZSKLYZ\">
                    <body yylxdm=\"1\">
                    <input>
                    <zskl>${digitalCertificatePassword}</zskl>
                    <sksbkl>${taxDiskPassword}</sksbkl>
                    </input>
                    </body>
                    </business>`,
      };
    },

    //导入税控盘注册码参数
    getXmlParam3(zcmxx) {
      return {
        xml: `<?xml version=\"1.0\" encoding=\"gbk\"?><business comment=\"注册码信息导入\" id=\"ZCMDR\">
  <body yylxdm=\"1\">
    <input>
      <zcmxx>${zcmxx}</zcmxx>
    </input>
  </body>
</business>`,
rand:new Date().getTime()
      };
    },

    //税控盘查询盘信息和检验税盘密码参数
    getXmlParam4(skpkl) {
      return {
        xml: `<?xml version=\"1.0\" encoding=\"gbk\"?>
<business comment=\"税控盘信息查询\" id=\"SKPXXCX\">
    <body yylxdm=\"1\">
        <input>
            <skpkl>${skpkl}</skpkl>
        </input>
    </body>
</business>`,
      };
    },
    //税控盘验证数字证书密码参数
    getXmlParam5(skpInfo,taxDiskPassword,digitalCertificatePassword) {
      return {
        xml: `<?xml version=\"1.0\" encoding=\"gbk\"?><business comment=\"监控数据查询\" id=\"JKSJCX\">
  <body yylxdm=\"1\">
    <input>
      <nsrsbh>${skpInfo.nsrsbh}</nsrsbh>
      <skpbh>${skpInfo.skpbh}</skpbh>
      <skpkl>${taxDiskPassword}</skpkl>
      <keypwd>${digitalCertificatePassword}</keypwd>
      <fplxdm>${skpInfo.fplxdm?skpInfo.fplxdm.substr(0,3):''}</fplxdm>
    </input>
  </body>
</business>`,
      };
    },

    //金税盘获取盘信息和验证数字证书密码参数
    getXmlParam6(keypwd) {
      return {
        xml: `<?xml version=\"1.0\" encoding=\"utf-8\"?>
<business comment=\"打开金税卡\" id=\"OpenCard\">
    <body yylxdm=\"1\">
        <input>
            <keypwd>${keypwd}</keypwd>
        </input>
    </body>
</business>`,
      };
    },

    //检查本地是否插盘方法
    GetTaxDeviceStates() {
      return simpleRequest({
        url: "http://localhost:13769/TaxDisk/GetTaxDeviceStates",
        method: "get",
      });
    },
    //登录成功后台初始化调用以及设置监听是否拔盘（A3）

    completeLogin(diskId,vsersion) {
      this.reload();
      this.closeLoginWin();
      this.selectDiskVisible = false;
      this.$store.commit("user/SET_diskIsOnline", "1");
      let GetTaxDeviceStates = this.GetTaxDeviceStates;

                    let timeFunc=()=>{
                          let timer= setTimeout(()=>{
                            this.GetTaxDeviceStates().then((res) => {
                            if (res.code != "0") {
                                 //变更盘状态为断开
                            this.$alert( "盘已断开", {
                            confirmButtonText: "知道了",
                            title: "提示",
                            type: "warning",
                             });
                            this.$store.commit("user/SET_diskIsOnline", "0");
                             let judgeOnFunc=()=>{
                               let timer2 = setTimeout(() => {
                                   GetTaxDeviceStates().then((res) => {
                                  if (res.code == "0") {
                                   //变更状态为在线
                                   this.hasDiskInsert(res);
                                   }else{
                                     judgeOnFunc()
                                   }
                                 });
                                  clearTimeout(timer2)
                               }, 2000);
                              localStorage.setItem("setIntervalId", timer2);
                             }
                              judgeOnFunc()
                             }else{
                              timeFunc()
                             }
                            });
                            clearTimeout(timer)
                        },2000)
                           localStorage.setItem("setIntervalId", timer);
                        }
                        timeFunc()

      invoiceInquiryInit({taxDiskNum:diskId,version:vsersion});
    },
    //确定本地插入盘后流程(A1)
    hasDiskInsert(res) {
      //插盘连接盘
      request({
        url: "http://localhost:13769/TaxDisk/ConnectTaxDisk",
        method: "get",
      }).then((connectres) => {
        if (connectres.code == "0") {
          //当前登录账号选择的盘号与插入盘号是否一致
          let istheSame = res.data.diskId == this.taxDiskInfo.taxDiskNum;
          if (istheSame) {
            //验证数字证书密码
            let judgeDigitPassword = (url, param) => {
              request({
                url: url,
                method: "post",
                data: param,
              }).then((res2) => {
                let isRight = X2JS.xml2js(res2.data).business.body.output;
                if (isRight.returncode == "0"||judgeDigitPassword==isRight.returncode == "00000000") {
                  request({
                    url: "http://localhost:13769/TaxDisk/StartServer",
                    method: "post",
                    data: {
                      taxId:
                        isRight.nsrsbh || isRight.qysh || this.loginInfo.taxId,
                      diskId: this.taxDiskInfo.taxDiskNum,
                    },
                  }).then(() => {
                    //流程结束
                    // this.$router.push({ path: "/dashboard" });
                    this.completeLogin(this.taxDiskInfo.taxDiskNum,res.data.jspSoftVersion);
                  });
                } else {
                   this.$alert( isRight.returnmsg +
                      "请至税盘设置模块检查税盘密码和口令是否正确", {
                            confirmButtonText: "知道了",
                            title: "错误提示",
                            type: "warning",
                            showClose:false,
                            callback:this.closeLoginWin
                    });
                }
              });
            };
            if (res.data.type == "Skp") {
              //税控盘需导入注册码
             companyDiskRegistrationCodeInit({
                                  digitalCertificatePassword:this.taxDiskInfo.digitalCertificatePassword,
                                  diskType:this.taxDiskInfo.diskType,
                                  onlineLocation:this.taxDiskInfo.onlineLocation,
                                  taxDiskNum:this.taxDiskInfo.taxDiskNum,
                                  taxDiskPassword:this.taxDiskInfo.taxDiskPassword
                                }).then((coderes) => {
                  if (coderes.code == 200) {
                   let registrationCode = coderes.data.registrationCode;
                    request({
                      url: "http://localhost:13769/TaxDisk/SkpOperate  ",
                      method: "post",
                      data: this.getXmlParam3(registrationCode),
                    }).then(() => {
                      request({
                        url: "http://localhost:13769/TaxDisk/SkpOperate  ",
                        method: "post",
                        data: this.getXmlParam4(
                          this.taxDiskInfo.taxDiskPassword
                        ),
                      }).then((skpres) => {
                        let skpInfo = X2JS.xml2js(skpres.data).business.body.output;
                        if (skpInfo.returncode == "00000000") {
                          judgeDigitPassword(
                            "http://localhost:13769/TaxDisk/SkpOperate",
                            this.getXmlParam5(skpInfo,this.taxDiskInfo.taxDiskPassword,this.taxDiskInfo.digitalCertificatePassword)
                          );
                        }else {
                                  this.$alert(skpInfo.returnmsg, {
                                  confirmButtonText: "知道了",
                                  title: "错误提示",
                                  type: "error",
                                  });
                                }
                      });
                    });
                  }else{
                     this.$alert(coderes.msg, {
                            confirmButtonText: "知道了",
                            title: "错误提示",
                            type: "error",
                            showClose:false,
                            callback:this.closeLoginWin
                          });
                  }
                }
              );
            } else if (res.data.type == "SWUKey") {
                //先获取税盘信息
                request({
                          url: "http://localhost:13769/TaxDisk/SWUKeyOperate",
                          method: "post",
                          data: this.getXmlParam1(
                            this.taxDiskInfo.taxDiskPassword
                          ),
                        }).then((info)=>{
                          let isRight = X2JS.xml2js(info.data).business.body.output;
                        if (isRight.returncode == "0") {
                              judgeDigitPassword(
                          "http://localhost:13769/TaxDisk/SWUKeyOperate",
                           this.getXmlParam2(
                          this.taxDiskInfo.digitalCertificatePassword,
                          this.taxDiskInfo.taxDiskPassword
                          )
                          );
                        } else {
                          this.$alert(isRight.returnmsg, {
                            confirmButtonText: "知道了",
                            title: "错误提示",
                            type: "error",
                            showClose:false,
                            callback:this.closeLoginWin
                          });
                        }

                        })


            } else if (res.data.type == "Jsp") {
                 judgeDigitPassword(
                          "http://localhost:13769/TaxDisk/JspOperate",
                           this.getXmlParam6(this.taxDiskInfo.digitalCertificatePassword)
                            );
            }
          } else {
            //当前登录账号选择的盘与当前插入的盘号不同(A2)
              let timeFunc=()=>{
                          let timer= setTimeout(()=>{
                            this.GetTaxDeviceStates().then((res) => {
                            if (res.code != "0") {
                             let judgeOnFunc=()=>{
                               let timer2=setTimeout(() => {
                                   this.GetTaxDeviceStates().then((res) => {
                                  if (res.code == "0") {
                                   //变更状态为在线
                                   this.hasDiskInsert(res);
                                   return
                                   }else{
                                     judgeOnFunc()
                                   }
                                 });
                                  clearTimeout(timer2)
                               }, 2000);
                                 localStorage.setItem("setIntervalId", timer2);
                             }
                              judgeOnFunc()
                             }else{
                              timeFunc()
                             }
                            });
                            clearTimeout(timer)
                        },2000)
                           localStorage.setItem("setIntervalId", timer);
                        }
                        timeFunc()
            this.$alert(
              "插入盘与登录时选择的税盘盘号不同，请检查税盘是否正确",
              {
                confirmButtonText: "知道了",
                title: "税盘信息不一致",
                iconClass: "el-icon-warning",
                showClose:false,
                callback:()=>{
                             this.$store.commit("user/showLoginWin", false);
                             this.reload()
                          }
              }
            );
          }
        }else{
              this.$alert(connectres.message, {
                            confirmButtonText: "知道了",
                            title: "错误提示",
                            type: "error",
                            showClose:false,
                            callback:this.closeLoginWin
                        });
          
        }
      });
    },

    //确定税盘之后流程
    confirmDisk(currentdisk) {
      this.$store.commit("user/SET_TAXDISKNUM", currentdisk.taxDiskNum);
      //检查盘是否在线
      checkTaxDiskIsOnline(currentdisk.taxDiskNum).then((res) => {
        if (res.code == 200) {
          //在线
          if (res.data) {
            this.$store.commit("user/SET_diskIsOnline", "1");
            //不是托管 流程结束
            if (currentdisk.onlineLocation == 1) {
               this.reload();
               this.closeLoginWin();
               this.selectDiskVisible = false;
            } else {
              //是托管 检查企业销方是否完整
              listXiaoApi(currentdisk.taxDiskNum).then((res) => {
                if (res.code == 200) {
                  if (res.data.length > 0) {
                    //完整调用后台初始化数据接口 流程结束
                    this.closeLoginWin();
                    this.reload();
                    this.selectDiskVisible = false;
                    invoiceInquiryInit({taxDiskNum:currentdisk.taxDiskNum,version:''});
                  } else {
                    //否则引导初始设置（同意协议、设置盘、企业信息、完成）
                    const loginInfo = this.$store.state.user.loginInfo;
                    this.setTemplateVisible = true;
                     let body=document.getElementsByTagName('body')[0]
                         body.style.overflow='hidden'
                    this.diskInfoForm=currentdisk
                    this.isOnlineLocation=true
                    this.getProvinceList();
                    this.companyInfo.companyName = loginInfo.companyName;
                    this.companyInfo.taxId = loginInfo.taxId;
                  }
                }
              });
            }
          } else {
            this.$store.commit("user/SET_diskIsOnline", "0");
            //不在线
            if (currentdisk.onlineLocation == "1") {
              //不是托管 检查企业销方是否完整
              listXiaoApi(currentdisk.taxDiskNum).then((res) => {
                if (res.code == 200) {
                  if (res.data.length > 0) {
                    //完整检查是否插盘
                    request({url: "http://localhost:13769/TaxDisk/GetTaxDeviceStates",
                            method: "get"}).then((res) => {
                      if (res.code == "0") {
                        //本地有插盘 (需要封装公共方法，轮询有相同逻辑)
                        this.hasDiskInsert(res);
                      } else {
                        //没盘提示插盘 并启动网页轮询(A1)
                        let timeFunc=()=>{
                          let timeID= setTimeout(()=>{
                            this.GetTaxDeviceStates().then((res) => {
                            if (res.code == "0") {
                              this.hasDiskInsert(res);
                             }else{
                              timeFunc()
                             }
                            });
                            clearTimeout(timeID)
                        },2000)
                          localStorage.setItem("setIntervalId", timeID);
                        }
                        timeFunc()
                      
                        this.$alert('未找到税盘，请插入税盘', {
                          confirmButtonText: "知道了",
                          title: "没有插盘",
                          type: "warning",
                          showClose:false,
                          callback:()=>{
                             this.$store.commit("user/showLoginWin", false);
                             this.reload()
                          }
                        });
                      }
                    });
                  } else {
                    //否则引导设置企业信息
                    this.$confirm(
                      "企业销方信息不完整，请进行初始设置",
                      "温馨提示",
                      {
                        confirmButtonText: "确定",
                        cancelButtonText: "",
                        type: "warning",
                      }
                    ).then(() => {
                      this.companyInfo.companyName = this.loginInfo.companyName;
                      this.companyInfo.taxId = this.loginInfo.taxId;
                      this.companyInfoSetting = true;
                      this.getProvinceList();
                    });
                  }
                }
              });
            } else {
              //是托管 提示联系客服
              this.$alert("请联系客服人员解决", {
                confirmButtonText: "知道了",
                title: "税盘不在线",
                iconClass: "el-icon-warning",
                showClose:false,
                callback:this.closeLoginWin
              });
            }
          }
        } else {
           this.$alert(res.msg, {
                      confirmButtonText: "知道了",
                      title: "错误提示",
                      type: "warning",
                      showClose:false,
                      callback:this.closeLoginWin
              });
        }
      });
    },





  },
  };
</script>

<style lang="scss" scoped>

  .right {
    /*display: flex;*/
    /*justify-content: end;*/
    /*align-items: center;*/
    /*margin-right: 65px;*/
    cursor: pointer;
  position: fixed;
  right: 100px;
  top: 16px;
  z-index: 6;
  img {
    width: 18px;
    height: 18px;
  }
  // margin-right: -100px;
  .right-menu {
    display: flex;
    justify-content: end;
    align-items: center;
  // height: 100%;
  &:focus {
     outline: none;
   }

  .right-menu-item {
    padding: 0 20px;
    border-right: 1px solid #d7d7d7;
  // height: 100%;
    font-size: 18px;
    color: #5a5e66;
  // vertical-align: text-bottom;
  .boxX{
    padding: 5px;
    width: 30px;
    height: 28px;
    display: inline-block;
  }

  ::v-deep  .el-badge  .el-icon-bell{
    padding: 5px;
    width: 30px;
    height: 30px;
    display: inline-block;
  }
  ::v-deep  .el-dropdown  .el-dropdown-selfdefine{
    padding: 5px;
    width: 30px;
    height: 30px;
    display: inline-block;
  }

  &.hover-effect {
     cursor: pointer;
     transition: background 0.3s;

  &:hover {
     background: rgba(0, 0, 0, 0.025);
   }
  }
  }

  .avatar-container {
    margin-left: 30px;

  .avatar-wrapper {
    display: flex;
    align-items: center;

  .user-avatar {
    cursor: pointer;
    width: 24px;
    height: 24px;
    margin-right: 15px;
    border-radius: 10px;
  }

  .el-icon-arrow-down {
    cursor: pointer;
    margin-left: 5px;
    font-size: 12px;
    margin-right: 20px;
  }
  }
  }
  }
  }



  .left {
    /*display: flex;*/
    cursor: default;
    position: fixed;
    left: 83px;
    z-index: 6;
  ::v-deep .el-input__inner {
    padding-left: 0;
    border: none;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
  }

  #panBox {
    position: relative;
    top: -8px;
  ::v-deep .el-input {
    width: 127%;
  }
  ::v-deep .el-input .el-input__suffix {
    right: 6px;
    top: -7px;
  }
  }
  .dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    background: red;
    border-radius: 50%;
    margin-right: 7px;
  }
  ::v-deep .el-input__icon {
    line-height: 0;
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

  &:hover {
     background: rgba(0, 0, 0, 0.025);
   }
  }

  .breadcrumb-container {
    float: left;
  }

  .left-menu {
    float: left;
    height: 100%;
  p {
    line-height: 50%;
    font-size: 12px;
  &:first-of-type {
     font-size: 14px;
     font-weight: bold;
   }
  }
  }

  .msg {
    margin-top: 10px;
    margin-left: 10px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #222222;
  }
  }



  .sildLoag {
    position: absolute;
    left: 0;
    width: 55px;
  }

  .navbar {
    width: 100%;
    height: 50px;
    overflow: hidden;
  // position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .navBox {
    width: 100%;
    height: 55px;
    position: relative;
  }
  .final {
    /*display: flex;*/
    position: fixed;
    right: 32px;
    top: 23px;
    align-items: center;
    font-style: 16px;
    z-index: 6;
    cursor: pointer;
  i {
    color: #000;
    margin-left: 12px;
  }
  div {
    width: 13px;
    height: 13px;
    /*border: 2px solid #000;*/
    margin-left: 12px;
    display: inline-block;
  img{
    width: 100%;
  }
  .minimiIcon{
    position: relative;
    top:-5px
  }
  }
  }

  .ss {
    position: fixed;
    top: 0;
    z-index: 5;
    background: #fff;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-left: 66px;
    padding-right: 20px;
    height:55px;
  }
  }

  .textLeft {
    width: 10%;
  }

  .textRight {
    width: 88%;
    border-bottom: 1px #e8e8e8 solid;
    padding-bottom: 8px;
  }

  .textImg {
    width: 25px;
    height: 25px;
  }

  .textImg1 {
    width: 16px;
    height: 16px;
    position: relative;
    top: 3px;
  }

  .textCenter {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; // 控制多行的行数
  -webkit-box-orient: vertical;
    margin-top: 5px;
  }
  .textTime {
    font-size: 10px;
    margin-top: 5px;
  }

  .textAll {
    display: flex;
    width: 100%;
    font-size: 13px;
    color: #595959;
    margin-top: 10px;
    cursor: pointer;
  }

  .textHandle {
    height: 4.5vh;
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    line-height: 4.5vh;
    border-bottom: 1px #e8e8e8 solid;
    width: 100%;
  }

  .textBack {
    height: 3.5vh;
    font-size: 13px;
    border-bottom: 1px #e8e8e8 solid;
    width: 100%;
  }

  .fontBlue {
    color: #5e8cf9;
  }

</style>
