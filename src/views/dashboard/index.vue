<template>
  <div class="page-container" id="boxx">
    <div class="page-content">
      <div class="invoicing-menu">
        <el-row :gutter="20">
          <div v-for="(item, index) in menuList" :key="index">
            <div
              @click="review(item.path)"
              v-if="item.path == 'reviewInvoicing'"
            >
              <el-col :span="4">
                <el-badge class="invoicing-menu-item">
                  <el-card shadow="hover" class="invoicing-menu-item">
                    <div style="display: flex">
                      <div style="width: 50%">
                        <img src="@/assets/images/management/icon_shenhe.png" />
                      </div>
                      <div style="width: 50%">
                        <p style="margin-top: 20px">审核开票</p>
                        <img
                          src="@/assets/images/management/icon_right.png"
                          style="
                            width: 3.1vh;
                            height: 3.1vh;
                            margin-left: 4.5vh;
                          "
                        />
                      </div>
                    </div>
                  </el-card>
                </el-badge>
              </el-col>
            </div>
            <div
              @click="light(item.path)"
              v-if="item.path == 'lightningInvoicing'"
            >
              <el-col :span="4">
                <el-badge class="invoicing-menu-item">
                  <el-card shadow="hover" class="invoicing-menu-item">
                    <div style="display: flex">
                      <div style="width: 50%">
                        <img
                          src="@/assets/images/management/icon_shandian.png"
                        />
                      </div>
                      <div style="width: 50%">
                        <p style="margin-top: 20px">闪电开票</p>
                        <img
                          src="@/assets/images/management/icon_right.png"
                          style="
                            width: 3.1vh;
                            height: 3.1vh;
                            margin-left: 4.5vh;
                          "
                        />
                      </div>
                    </div>
                  </el-card>
                </el-badge>
              </el-col>
            </div>
            <div @click="scan(item.path)" v-if="item.path == 'scanInvoicing'">
              <el-col :span="4">
                <el-badge class="invoicing-menu-item">
                  <el-card shadow="hover" class="invoicing-menu-item">
                    <div style="display: flex">
                      <div style="width: 50%">
                        <img src="@/assets/images/management/icon_saoma.png" />
                      </div>
                      <div style="width: 50%">
                        <p style="margin-top: 20px">扫码开票</p>
                        <img
                          src="@/assets/images/management/icon_right.png"
                          style="
                            width: 3.1vh;
                            height: 3.1vh;
                            margin-left: 4.5vh;
                          "
                        />
                      </div>
                    </div>
                  </el-card>
                </el-badge>
              </el-col>
            </div>
            <div @click="batch(item.path)" v-if="item.path == 'batchInvoicing'">
              <el-col :span="4">
                <el-badge class="invoicing-menu-item">
                  <el-card shadow="hover" class="invoicing-menu-item">
                    <div style="display: flex">
                      <div style="width: 50%">
                        <img
                          src="@/assets/images/management/icon_piliang.png"
                        />
                      </div>
                      <div style="width: 50%">
                        <p style="margin-top: 20px">批量开票</p>
                        <img
                          src="@/assets/images/management/icon_right.png"
                          style="
                            width: 3.1vh;
                            height: 3.1vh;
                            margin-left: 4.5vh;
                          "
                        />
                      </div>
                    </div>
                  </el-card>
                </el-badge>
              </el-col>
            </div>
            <div
              @click="listing(item.path)"
              v-if="item.path == 'inventoryInvoicing'"
            >
              <el-col :span="4">
                <el-badge class="invoicing-menu-item">
                  <el-card shadow="hover" class="invoicing-menu-item">
                    <div style="display: flex">
                      <div style="width: 50%">
                        <img
                          src="@/assets/images/management/icon_qingdan.png"
                        />
                      </div>
                      <div style="width: 50%">
                        <p style="margin-top: 20px">清单开票</p>
                        <img
                          src="@/assets/images/management/icon_right.png"
                          style="
                            width: 3.1vh;
                            height: 3.1vh;
                            margin-left: 4.5vh;
                          "
                        />
                      </div>
                    </div>
                  </el-card>
                </el-badge>
              </el-col>
            </div>
          </div>
          <div @click="goJdc()">
            <el-col :span="4">
              <el-badge class="invoicing-menu-item">
                <el-card shadow="hover" class="invoicing-menu-item">
                  <div style="display: flex">
                    <div style="width: 50%">
                      <img
                        src="@/assets/images/management/icon_jidongche.png"
                      />
                    </div>
                    <div style="width: 50%">
                      <p style="margin-top: 20px; font-size: 1.89vh !important">
                        机动车开票
                      </p>
                      <img
                        src="@/assets/images/management/icon_right.png"
                        style="width: 3.1vh; height: 3.1vh; margin-left: 4.5vh"
                      />
                    </div>
                  </div>
                </el-card>
              </el-badge>
            </el-col>
          </div>
        </el-row>
      </div>
      <div class="statistics-box">
        <el-card>
          <div class="choose">
            <div>
              <span>开票统计</span>
              <!-- <span style="color: #9d9d9d; font-size: 12px; margin-left: 10px">数据截止：{{ dataTime }}</span> -->
            </div>
            <div>
              <el-radio-group
                v-model="tabPosition"
                @change="handleClick"
                size="mini"
              >
                <el-radio-button label="nowMonth">本月</el-radio-button>
                <el-radio-button label="nowQuarter">本季</el-radio-button>
                <el-radio-button label="nowYear">本年</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <el-row :gutter="20" v-show="monthShow">
            <el-col :span="4">
              <div>
                <span>开票金额(元)</span>
              </div>
              <div v-if="invoiceAmount">
                <h1 style="color: #1861f2">{{ invoiceAmount }}</h1>
              </div>
              <div v-else>
                <h1 style="color: #1861f2">-</h1>
              </div>
              <div style="color: #ff5151" v-if="invoiceAmountPct > 0">
                +{{ invoiceAmountPctShow }}<span class="el-icon-top"></span>
              </div>
              <div v-if="invoiceAmountPct == 0">{{ invoiceAmountPctShow }}</div>
              <div style="color: #36b336" v-if="invoiceAmountPct < 0">
                +{{ invoiceAmountPctShow }}<span class="el-icon-bottom"></span>
              </div>
              <div v-else>
                <span>-</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <span>开票税额(元)</span>
              </div>
              <div v-if="invoiceTaxAmount">
                <h1 style="color: #1861f2">{{ invoiceTaxAmount }}</h1>
              </div>
              <div v-else>
                <h1 style="color: #1861f2">-</h1>
              </div>
              <div style="color: #ff5151" v-if="invoiceTaxAmountPct > 0">
                +{{ invoiceTaxAmountPctShow }}<span class="el-icon-top"></span>
              </div>
              <div v-if="invoiceTaxAmountPct == 0">
                {{ invoiceTaxAmountPctShow }}
              </div>
              <div style="color: #36b336" v-if="invoiceTaxAmountPct < 0">
                +{{ invoiceTaxAmountPctShow
                }}<span class="el-icon-bottom"></span>
              </div>
              <div v-else>
                <span>-</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <span>开票张数(张)</span>
              </div>
              <div v-if="invoiceNum">
                <h1 style="color: #1861f2">{{ invoiceNum }}</h1>
              </div>
              <div v-else>
                <h1 style="color: #1861f2">-</h1>
              </div>
              <div style="color: #ff5151" v-if="invoiceNumPct > 0">
                +{{ invoiceNumPctShow }}<span class="el-icon-top"></span>
              </div>
              <div v-if="invoiceNumPct == 0">{{ invoiceNumPctShow }}</div>
              <div style="color: #36b336" v-if="invoiceNumPct < 0">
                +{{ invoiceNumPctShow }}<span class="el-icon-bottom"></span>
              </div>
              <div v-else>
                <span>-</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <span>认证金额(元)</span>
              </div>
              <div>
                <h1 style="color: #1861f2">{{ certifiedAmount }}</h1>
              </div>
              <div>-</div>
            </el-col>
            <el-col :span="4">
              <div>
                <span>认证税额(元)</span>
              </div>
              <div>
                <h1 style="color: #1861f2">{{ certifiedTaxAmount }}</h1>
              </div>
              <div>-</div>
            </el-col>
            <el-col :span="4">
              <div>
                <span>认证张数(张)</span>
              </div>
              <div>
                <h1 style="color: #1861f2">{{ certifiedNum }}</h1>
              </div>
              <div>-</div>
            </el-col>
          </el-row>

          <el-row :gutter="20" v-show="quarterShow">
            <el-col :span="4">
              <div>
                <span>开票金额(元)</span>
              </div>
              <div v-if="invoiceAmount">
                <h1 style="color: #1861f2">{{ invoiceAmount }}</h1>
              </div>
              <div v-else>
                <h1 style="color: #1861f2">-</h1>
              </div>
              <div style="color: #ff5151" v-if="invoiceAmountPct > 0">
                +{{ invoiceAmountPctShow }}<span class="el-icon-top"></span>
              </div>
              <div v-if="invoiceAmountPct == 0">{{ invoiceAmountPctShow }}</div>
              <div style="color: #36b336" v-if="invoiceAmountPct < 0">
                +{{ invoiceAmountPctShow }}<span class="el-icon-bottom"></span>
              </div>
              <div v-else>
                <span>-</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <span>开票税额(元)</span>
              </div>
              <div v-if="invoiceTaxAmount">
                <h1 style="color: #1861f2">{{ invoiceTaxAmount }}</h1>
              </div>
              <div v-else>
                <h1 style="color: #1861f2">-</h1>
              </div>
              <div style="color: #ff5151" v-if="invoiceTaxAmountPct > 0">
                +{{ invoiceTaxAmountPctShow }}<span class="el-icon-top"></span>
              </div>
              <div v-if="invoiceTaxAmountPct == 0">
                {{ invoiceTaxAmountPctShow }}
              </div>
              <div style="color: #36b336" v-if="invoiceTaxAmountPct < 0">
                +{{ invoiceTaxAmountPctShow
                }}<span class="el-icon-bottom"></span>
              </div>
              <div v-else>
                <span>-</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <span>开票张数(张)</span>
              </div>
              <div v-if="invoiceNum">
                <h1 style="color: #1861f2">{{ invoiceNum }}</h1>
              </div>
              <div v-else>
                <h1 style="color: #1861f2">-</h1>
              </div>
              <div style="color: #ff5151" v-if="invoiceNumPct > 0">
                +{{ invoiceNumPctShow }}<span class="el-icon-top"></span>
              </div>
              <div v-if="invoiceNumPct == 0">{{ invoiceNumPctShow }}</div>
              <div style="color: #36b336" v-if="invoiceNumPct < 0">
                +{{ invoiceNumPctShow }}<span class="el-icon-bottom"></span>
              </div>
              <div v-else>
                <span>-</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <span>认证金额(元)</span>
              </div>
              <div>
                <h1 style="color: #1861f2">{{ certifiedAmount }}</h1>
              </div>
              <div>-</div>
            </el-col>
            <el-col :span="4">
              <div>
                <span>认证税额(元)</span>
              </div>
              <div>
                <h1 style="color: #1861f2">{{ certifiedTaxAmount }}</h1>
              </div>
              <div>-</div>
            </el-col>
            <el-col :span="4">
              <div>
                <span>认证张数(张)</span>
              </div>
              <div>
                <h1 style="color: #1861f2">{{ certifiedNum }}</h1>
              </div>
              <div>-</div>
            </el-col>
          </el-row>

          <el-row :gutter="20" v-show="yearShow">
            <el-col :span="4">
              <div>
                <span>开票金额(元)</span>
              </div>
              <div v-if="invoiceAmount">
                <h1 style="color: #1861f2">{{ invoiceAmount }}</h1>
              </div>
              <div v-else>
                <h1 style="color: #1861f2">-</h1>
              </div>
              <div style="color: #ff5151" v-if="invoiceAmountPct > 0">
                +{{ invoiceAmountPctShow }}<span class="el-icon-top"></span>
              </div>
              <div v-if="invoiceAmountPct == 0">{{ invoiceAmountPctShow }}</div>
              <div style="color: #36b336" v-if="invoiceAmountPct < 0">
                +{{ invoiceAmountPctShow }}<span class="el-icon-bottom"></span>
              </div>
              <div v-else>
                <span>-</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <span>开票税额(元)</span>
              </div>
              <div v-if="invoiceTaxAmount">
                <h1 style="color: #1861f2">{{ invoiceTaxAmount }}</h1>
              </div>
              <div v-else>
                <h1 style="color: #1861f2">-</h1>
              </div>
              <div style="color: #ff5151" v-if="invoiceTaxAmountPct > 0">
                +{{ invoiceTaxAmountPctShow }}<span class="el-icon-top"></span>
              </div>
              <div v-if="invoiceTaxAmountPct == 0">
                {{ invoiceTaxAmountPctShow }}
              </div>
              <div style="color: #36b336" v-if="invoiceTaxAmountPct < 0">
                +{{ invoiceTaxAmountPctShow
                }}<span class="el-icon-bottom"></span>
              </div>
              <div v-else>
                <span>-</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <span>开票张数(张)</span>
              </div>
              <div v-if="invoiceNum">
                <h1 style="color: #1861f2">{{ invoiceNum }}</h1>
              </div>
              <div v-else>
                <h1 style="color: #1861f2">-</h1>
              </div>
              <div style="color: #ff5151" v-if="invoiceNumPct > 0">
                +{{ invoiceNumPctShow }}<span class="el-icon-top"></span>
              </div>
              <div v-if="invoiceNumPct == 0">{{ invoiceNumPctShow }}</div>
              <div style="color: #36b336" v-if="invoiceNumPct < 0">
                +{{ invoiceNumPctShow }}<span class="el-icon-bottom"></span>
              </div>
              <div v-else>
                <span>-</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <span>认证金额(元)</span>
              </div>
              <div>
                <h1 style="color: #1861f2">{{ certifiedAmount }}</h1>
              </div>
              <div>-</div>
            </el-col>
            <el-col :span="4">
              <div>
                <span>认证税额(元)</span>
              </div>
              <div>
                <h1 style="color: #1861f2">{{ certifiedTaxAmount }}</h1>
              </div>
              <div>-</div>
            </el-col>
            <el-col :span="4">
              <div>
                <span>认证张数(张)</span>
              </div>
              <div>
                <h1 style="color: #1861f2">{{ certifiedNum }}</h1>
              </div>
              <div>-</div>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <div style="margin-top: 1vh">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card>
              <div style="font-size: 2vh">
                <span>开票金额</span>
                <!-- <span style="color: #9d9d9d; font-size: 12px; margin-left: 12px">数据截止：{{ dataNumTime }}</span> -->
              </div>
              <div id="myChart" style="width: 100%; height: 300px"></div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card>
              <div style="font-size: 2vh">
                <span>发票库存</span>
                <!-- <span style="color: #9d9d9d; font-size: 12px; margin-left: 12px" >上次查询时间：{{ dataNumTime }}</span> -->
              </div>
              <!-- <div style="width:60%"> -->
              <!--<div id="myChartA" style="width: 100%; height: 300px;"></div>-->
              <!-- </div> -->
              <div style="width: 120%; margin: 0 auto">
                <div
                  id="myChartA"
                  style="
                    width: 130%;
                    height: 300px;
                    position: relative;
                    left: -45%;
                  "
                ></div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card>
              <div style="font-size: 2vh">
                <span>开票截止时间</span>
              </div>
              <!-- <div id="myChartB" style="width: 100%; height: 300px"></div> -->
              <div style="width: 120%; margin: 0 auto">
                <div
                  id="myChartB"
                  style="
                    width: 130%;
                    height: 300px;
                    position: relative;
                    left: -25%;
                  "
                ></div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div class="premium-service">
        <p class="title">优选服务</p>
        <div class="service">
          <div @click="calculated" class="service-item">
            <img
              src="@/assets/images/management/icon_sfjs.png"
              style="width: 50px; height: 50px"
            />
            <p>税费测算</p>
          </div>
          <div shadow="hover" @click="calendar" class="service-item">
            <img
              src="@/assets/images/management/icon_bsrl.png"
              style="width: 50px; height: 50px"
            />
            <p>办税日历</p>
          </div>
          <div shadow="hover" @click="online" class="service-item">
            <img
              src="@/assets/images/management/icon_wsbs.png"
              style="width: 50px; height: 50px"
            />
            <p>网上办税</p>
          </div>
          <div style="margin-left: 20px; cursor: pointer;color:#fff;" @click="testFun">
            调开发工具
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="" :visible.sync="dialogVisible" width="300px">
      <div style="text-align: center">
        <img
          src="@/assets/images/jjsx@2x.png"
          style="width: 90px; height: 90px"
        />
      </div>
      <div class="jjqd">敬请期待</div>
      <div class="jjsx">即将上线</div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
// import { invoiceInventoryApi } from "@/api/invoice.js";
import { listRouterApi } from "@/api/invoice.js";
import {
  getInvoiceStaticApi,
  invoiceInventoryApi,
  invoiceMonitorDataApi,
} from "@/api/dashboardApi.js";
import Config from "@/settings";
import { getToken } from "@/utils/auth";
import { cefSharpShowDevTool } from "@/utils/cefSharp";

export default {
  name: "Dashboard",
  components: {},
  inject: ["reload"],
  data() {
    return {
      dialogVisible: false,
      menuList: [
        {
          icon: "",
          id: 14,
          label: "审核开票",
          parentId: 12,
          path: "reviewInvoicing",
          children: [],
        },
        {
          icon: "",
          id: 15,
          label: "闪电开票",
          parentId: 12,
          path: "lightningInvoicing",
          children: [],
        },
        {
          icon: "",
          id: 16,
          label: "扫码开票",
          parentId: 12,
          path: "scanInvoicing",
          children: [],
        },
        {
          icon: "",
          id: 19,
          label: "批量开票",
          parentId: 12,
          path: "batchInvoicing",
          children: [],
        },
        {
          icon: "",
          id: 20,
          label: "清单开票",
          parentId: 12,
          path: "inventoryInvoicing",
          children: [],
        },
      ], //路由菜单
      taxDiskNum: null, //税盘号
      taxDiskCreateTime: null, //税盘创建时间
      tabPosition: "nowMonth",
      monthShow: true,
      quarterShow: false,
      yearShow: false,
      certifiedAmount: "-", //认证金额
      certifiedNum: "-", //认证张数
      certifiedTaxAmount: "-", //认证税额
      invoiceAmount: null, //开票金额
      invoiceAmountPct: null, //开票金额百分比
      invoiceAmountPctShow: null, //开票金额百分比页面展示
      invoiceNum: null, //开票张数
      invoiceNumPct: null, //开票张数百分比
      invoiceNumPctShow: null, //开票张数百分比页面展示
      invoiceTaxAmount: null, //开票税额
      invoiceTaxAmountPct: null, //开票税额百分比
      invoiceTaxAmountPctShow: null, //开票税额百分比

      // ---------开票金额
      invoiceMoneyList: [],

      //-----------发票库存
      invoiceTotal: 0,
      invoiceTableData: [],

      //开票截止时间
      showInvoiceDay: null,
      openableDeadlineDate: null,
      invoiceMonitorList: [],
      allMenuList: [],

      screenWidth: null,
      screenHeight: null,
    };
  },
  created() {
    if (getToken()) {
      this.listRouter();
    }
  },

  mounted() {
    this.taxDiskNum = this.$store.state.user.taxDiskNum;
    this.taxDiskCreateTime = this.$store.state.user.taxDiskInfo.createTime;
    if (getToken()) {
      this.invoiceInventory();
      this.invoiceMonitor();
      // this.getInvoiceInventory();
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      // month = month < 10 ? "0" + month : month;
      let applyParams = {
        dateType: 0,
        month: month,
        year: year,
        taxDiskCreateTime: this.getLocalTime(this.taxDiskCreateTime),
        taxDiskNum: this.taxDiskNum,
      };
      this.getStatic(applyParams);
    }
    var that = this;
    window.onresize = () => {
      return (() => {
        that.screenWidth = document.body.clientWidth;
        that.screenHeight = document.body.clientHeight;
      })();
    };

    // this.drawLine();
    // this.drawAnnular();
    // this.drawAnnularB();
  },

  computed: {
    taxDiskNumChange() {
      return this.$store.state.user.taxDiskNum;
    },
    ...mapState("user", ["diskIsOnline"]),
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
    screenWidth: {
      // immediate: true,
      deep: true,
      handler(oldValue, newValue) {
        // console.log(newValue)
        if (oldValue != newValue) {
          // this.reload()
          setTimeout(() => {
            var echarts = require("echarts");
            let myChart = echarts.init(document.getElementById("myChart"));
            // console.log(myChart)
            myChart.resize();
            let myChartA = echarts.init(document.getElementById("myChartA"));
            myChartA.resize();
            let myChartB = echarts.init(document.getElementById("myChartB"));
            myChartB.resize();
          });
        }
      },
    },
    screenHeight: {
      deep: true,
      handler(oldValue, newValue) {
        // console.log(newValue)
        if (oldValue != newValue) {
          // this.reload()
          setTimeout(() => {
            var echarts = require("echarts");
            let myChart = echarts.init(document.getElementById("myChart"));
            myChart.resize();
            let myChartA = echarts.init(document.getElementById("myChartA"));
            myChartA.resize();
            let myChartB = echarts.init(document.getElementById("myChartB"));
            myChartB.resize();
          });
        }
      },
    },
  },
  methods: {
    //客户端测试显示开发工具
    testFun() {
      cefSharpShowDevTool();
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
            // console.log(res);
            // that.menuList = response.data[0].children;
            if (res.data.length > 0) {
              that.allMenuList = res.data;
              if (
                res.data.some((item) => {
                  return item.path == "dashboard";
                }) == true
              ) {
                res.data.forEach((item) => {
                  if (item.path == "dashboard") {
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
    goJdc() {
      // dialogVisible = true
      if (getToken()) {
        this.dialogVisible = true;
      } else {
        this.$store.commit("user/showLoginWin", true);
      }
    },
    goToPage(val) {
      this.$router.push({ name: val });
    },
    // 路由跳转
    review(url) {
      this.token = getToken();
      if (this.token) {
        if (this.diskIsOnline) {
          if (this.diskIsOnline == "1") {
            // this.listRouter();
            // this.$router.push({ name: url });
            var a;
            this.allMenuList.forEach((item) => {
              if (item.path == "dashboard") {
                a = item;
              }
            });
            if (a.status == "0") {
              var b;
              this.menuList.forEach((item) => {
                if (item.path == "reviewInvoicing") {
                  // that.$router.push({ name: url });
                  b = item;
                }
              });
              console.log(b);
              if (b.status == "0") {
                // ----------------------判断 是否后台开通
                this.$router.push({ name: "reviewInvoicing" });
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
    light(url) {
      this.token = getToken();
      if (this.token) {
        if (this.diskIsOnline) {
          if (this.diskIsOnline == "1") {
            // this.listRouter();
            // this.$router.push({ name: "LightningInvoicing" });
            var a;
            this.allMenuList.forEach((item) => {
              if (item.path == "dashboard") {
                a = item;
              }
            });
            if (a.status == "0") {
              var b;
              this.menuList.forEach((item) => {
                if (item.path == "lightningInvoicing") {
                  // that.$router.push({ name: url });
                  b = item;
                }
              });
              console.log(b);
              if (b.status == "0") {
                // ----------------------判断 是否后台开通
                this.$router.push({ name: "LightningInvoicing" });
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
    scan(url) {
      this.token = getToken();
      if (this.token) {
        if (this.diskIsOnline) {
          if (this.diskIsOnline == "1") {
            // this.listRouter();
            // this.$router.push({ name: "ScanInvoicing" });
            var a;
            this.allMenuList.forEach((item) => {
              if (item.path == "dashboard") {
                a = item;
              }
            });
            if (a.status == "0") {
              var b;
              this.menuList.forEach((item) => {
                if (item.path == "scanInvoicing") {
                  // that.$router.push({ name: url });
                  b = item;
                }
              });
              if (b.status == "0") {
                // ----------------------判断 是否后台开通
                this.$router.push({ name: "ScanInvoicing" });
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
    batch(url) {
      this.token = getToken();
      if (this.token) {
        if (this.diskIsOnline) {
          if (this.diskIsOnline == "1") {
            // this.listRouter();
            // let applyParams = {
            //   clientCode: Config.clientCode,
            // };
            // var that = this;
            // listRouterApi(applyParams)
            //   .then((res) => {
            //     if (res && res.code == "200") {
            // console.log(res);
            // that.menuList = response.data[0].children;
            var a;
            this.allMenuList.forEach((item) => {
              if (item.path == "dashboard") {
                a = item;
              }
            });
            if (a.status == "0") {
              var b;
              this.menuList.forEach((item) => {
                if (item.path == "batchInvoicing") {
                  // that.$router.push({ name: url });
                  b = item;
                }
              });
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
            //   }
            // })
            // .catch((error) => {});
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
    listing(url) {
      this.token = getToken();
      if (this.token) {
        if (this.diskIsOnline) {
          if (this.diskIsOnline == "1") {
            // this.listRouter();
            // let applyParams = {
            //   clientCode: Config.clientCode,
            // };
            // var that = this;
            // listRouterApi(applyParams)
            //   .then((res) => {
            //     if (res && res.code == "200") {
            // console.log(res);
            // that.menuList = response.data[0].children;
            var a;
            this.allMenuList.forEach((item) => {
              if (item.path == "dashboard") {
                a = item;
              }
            });
            if (a.status == "0") {
              var b;
              this.menuList.forEach((item) => {
                if (item.path == "inventoryInvoicing") {
                  // that.$router.push({ name: url });
                  b = item;
                }
              });
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
            //   }
            // })
            // .catch((error) => {});
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
    //开票金额 ---------------折线图
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      var echarts = require("echarts");
      var myChart = echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        // title: { text: '在Vue中使用echarts' },
        tooltip: { trigger: "axis" },
        color: ["#608DFA", "#9999ae"], //设置折线图的文字颜色
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLabel: {
            interval: 1, //横轴信息全部显示 -----------可以隔一个标签显示一个标签
            rotate: 0, //-30度角倾斜显示
            inside: false,
          },
          axisLine: {
            onZero: false,
          },
          data: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月",
          ],
        },
        yAxis: {
          type: "value",
          // show: false,
          axisLabel: {
            //设置刻度值
            show: false, //不显示刻度值，如果不显示，下面的刻度值设置就可以不用写了
          },
          axisLine: {
            //设置轴线的配置
            show: false,
            lineStyle: {
              //轴线的线条颜色
              color: "#9999ae",
            },
          },
        },
        series: [
          {
            // symbol: "none",
            data: this.invoiceMoneyList,
            type: "line",
            itemStyle: {
              //折线的样式设置
              normal: {
                lineStyle: {
                  //折线线条的设置
                  color: "#608DFA",
                  width: 1,
                },
              },
            },
          },
        ],
      });
    },
    //发票库存 ---------------环状图
    drawAnnular() {
      // 基于准备好的dom，初始化echarts实例
      var _dataList = this.invoiceTableData; //----------
      console.log(_dataList);
      var that = this;
      var echarts = require("echarts");
      var myChart = echarts.init(document.getElementById("myChartA"));
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "item",
          //  position: function (point, params, dom, rect, size) {
          //   // 提示框位置
          //   var x = 0; // x坐标位置
          //   var y = 0; // y坐标位置

          //   // 当前鼠标位置
          //   var pointX = point[0];
          //   var pointY = point[1];

          //   // 提示框大小
          //   var boxWidth = size.contentSize[0];
          //   var boxHeight = size.contentSize[1];

          //   // boxWidth > pointX 说明鼠标左边放不下提示框
          //   if (boxWidth > pointX) {
          //     x = 5;
          //   } else {
          //     // 左边放的下
          //     x = pointX - boxWidth;
          //   }

          //   // boxHeight > pointY 说明鼠标上边放不下提示框
          //   if (boxHeight > pointY) {
          //     y = 5;
          //   } else {
          //     // 上边放得下
          //     y = pointY - boxHeight;
          //   }

          //   return [x, y];
          // },
          position: ["50%", "60%"],
        },
        title: {
          show: false,
          // text: "\niphone销量",
        },
        legend: {
          // show:false,
          orient: "vertical", //设置图例的方向
          left: "68%", //图例距离左的距离
          y: "center",
          // itemGap:30//设置图例的间距
          selectedMode: false,
          icon: "circle", //设置图例小图标的样式，这里控制
          // right: "0%",
          textStyle: {
            // color: "#999",
            fontSize: 12,
            // color:()=>{

            // }

            // color: ["#608DFA", "#1861F2", "#36B336", "#FF8C19", "#FF5151"],
            rich: {
              textColor: {
                color: "#999",
                // fontSize: 12,
              },
              a: {
                color: "#608DFA",
                // fontSize: 12,
              },
              b: {
                color: "#1861F2",
                // fontSize: 12,
              },

              c: {
                color: "#36B336",
                // fontSize: 12,
              },
              d: {
                color: "#FF8C19",
                // fontSize: 12,
              },
              e: {
                color: "#FF5151",
                // fontSize: 12,
              },
              f: {
                color: "orange",
                // fontSize: 12,
              },
            },
          },
          // data:this.invoiceTableData,

          formatter: function (name) {
            var res = "";
            var html;
            _dataList.forEach((item) => {
              if (item.name == name) {
                res = that.thousandBitSeparator(item.value);
                if (item.name == "专票(张)") {
                  html = `{textColor|${name + "    "}}{a|${res}}`;
                } else if (
                  item.name == "普票(张)" ||
                  item.name == "发票总数(张)"
                ) {
                  html = `{textColor|${name + "    "}}{b|${res}}`;
                } else if (item.name == "电子普票(张)") {
                  html = `{textColor|${name + "    "}}{c|${res}}`;
                } else if (item.name == "电子专票(张)") {
                  html = `{textColor|${name + "    "}}{d|${res}}`;
                } else if (item.name == "机动车(张)") {
                  html = `{textColor|${name + "    "}}{e|${res}}`;
                } else if (item.name == "卷式发票(张)") {
                  html = `{textColor|${name + "    "}}{f|${res}}`;
                }
              }
            });
            return html;
          },
        },
        graphic: [
          {
            //环形图中间添加文字
            type: "text", //通过不同top值可以设置上下显示
            left: "center",
            top: "45%",
            style: {
              text: this.thousandBitSeparator(this.invoiceTotal),
              textAlign: "center",
              fill: "#000", //文字的颜色
              width: 100,
              height: 30,
              fontSize: 25,
              color: "#4d4f5c",
              fontFamily: "Microsoft YaHei",
            },
          },
          {
            type: "text",
            left: "center",
            top: "60%",
            style: {
              text: "发票总数(张)",
              textAlign: "center",
              fill: "#9D9D9D",
              width: 30,
              height: 30,
              fontSize: 12,
            },
          },
        ], //-------------环形中间添加文字
        series: [
          {
            name: "",
            type: "pie",
            radius: ["55%", "44%"],
            // avoidLabelOverlap: false,
            avoidLabelOverlap: false, //避免标注重叠
            hoverAnimation: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: false,
                fontSize: "18",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: _dataList,
          },
        ],
      });
    },
    //开票截止时间 ---------------环状图
    drawAnnularB() {
      // 基于准备好的dom，初始化echarts实例
      var echarts = require("echarts");
      var myChart = echarts.init(document.getElementById("myChartB"));
      // 绘制图表
      myChart.setOption({
        color: ["#F7F7F7", "#608DFA"],
        // hoverAnimation:false,
        tooltip: {
          trigger: "item",
          show: false,
          // position: ['80%', '100%']
          // position: function (point, params, dom, rect, size) {
          //   // 提示框位置
          //   var x = 0; // x坐标位置
          //   var y = 0; // y坐标位置

          //   // 当前鼠标位置
          //   var pointX = point[0];
          //   var pointY = point[1];

          //   // 提示框大小
          //   var boxWidth = size.contentSize[0];
          //   var boxHeight = size.contentSize[1];

          //   // boxWidth > pointX 说明鼠标左边放不下提示框
          //   if (boxWidth > pointX) {
          //     x = 5;
          //   } else {
          //     // 左边放的下
          //     x = pointX - boxWidth;
          //   }

          //   // boxHeight > pointY 说明鼠标上边放不下提示框
          //   if (boxHeight > pointY) {
          //     y = 5;
          //   } else {
          //     // 上边放得下
          //     y = pointY - boxHeight;
          //   }

          //   return [x, y];
          // },
        },
        title: {
          show: false,
          // text: "\niphone销量",
        },
        legend: {
          show: false,
          orient: "vertical", //设置图例的方向
          left: "70%", //图例距离左的距离
          y: "center",
          // itemGap:30//设置图例的间距
          icon: "circle", //设置图例小图标的样式，这里控制
          // right: "0%",
          textStyle: {
            color: "#999",
            fontSize: 12,
            rich: {
              white: {
                color: "white",
                fontSize: 12,
              },
            },
          },
        },
        graphic: [
          {
            //环形图中间添加文字
            type: "text", //通过不同top值可以设置上下显示
            left: "center",
            top: "45%",
            style: {
              text: this.openableDeadlineDate,
              textAlign: "center",
              fill: "#000", //文字的颜色
              width: 100,
              height: 30,
              fontSize: 15,
              color: "#4d4f5c",
              fontFamily: "Microsoft YaHei",
            },
          },
          {
            type: "text",
            left: "center",
            top: "55%",
            style: {
              text: this.showInvoiceDay,
              textAlign: "center",
              fill: "#608DFA",
              width: 30,
              height: 30,
              fontSize: 18,
            },
          },
        ], //-------------环形中间添加文字
        series: [
          {
            name: "",
            type: "pie",
            radius: ["55%", "44%"],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: false,
                fontSize: "18",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: this.invoiceMonitorList,
          },
        ],
      });
    },
    // 开票统计接口
    getStatic(applyParams) {
      var that = this;
      getInvoiceStaticApi(applyParams)
        .then((res) => {
          if (res && res.code == "200") {
            console.log(res);
            // that.certifiedAmount = that.thousandBitSeparator(
            //   res.data.certifiedAmount
            // ); //认证金额
            // that.certifiedNum = that.thousandBitSeparator(
            //   res.data.certifiedNum
            // ); //认证张数
            // that.certifiedTaxAmount = that.thousandBitSeparator(
            //   res.data.certifiedTaxAmount
            // ); //认证税额
            if (res.data.invoiceAmount) {
              that.invoiceAmount = that.thousandBitSeparator(
                res.data.invoiceAmount
              ); //开票金额
            } else {
              that.invoiceAmount = null;
            }
            that.invoiceAmountPct = res.data.invoiceAmountPct; //开票税额百分比
            if (that.invoiceAmountPct) {
              that.invoiceAmountPctShow =
                (Math.abs(parseFloat(res.data.invoiceAmountPct)) * 100).toFixed(
                  2
                ) + "%";
            } else {
              that.invoiceAmountPctShow = null;
            }
            // that.invoiceNum = that.thousandBitSeparator(res.data.invoiceNum); //开票张数

            if (res.data.invoiceNum) {
              that.invoiceNum = that.thousandBitSeparator(res.data.invoiceNum); //开票张数
            } else {
              that.invoiceNum = null;
            }
            that.invoiceNumPct = res.data.invoiceNumPct; //开票张数百分比
            if (that.invoiceNumPct) {
              that.invoiceNumPctShow =
                (Math.abs(parseFloat(res.data.invoiceNumPct)) * 100).toFixed(
                  2
                ) + "%";
            } else {
              that.invoiceNumPctShow = null;
            }
            // that.invoiceTaxAmount = that.thousandBitSeparator(
            //   res.data.invoiceTaxAmount
            // ); //开票税额

            if (res.data.invoiceTaxAmount) {
              that.invoiceTaxAmount = that.thousandBitSeparator(
                res.data.invoiceTaxAmount
              ); //开票税额
            } else {
              that.invoiceTaxAmount = null;
            }
            that.invoiceTaxAmountPct = res.data.invoiceTaxAmountPct; //开票税额百分比
            if (that.invoiceTaxAmountPct) {
              that.invoiceTaxAmountPctShow =
                (
                  Math.abs(parseFloat(res.data.invoiceTaxAmountPct)) * 100
                ).toFixed(2) + "%";
            } else {
              that.invoiceTaxAmountPctShow = null;
            }

            that.invoiceMoneyList = [
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
            ];
            res.data.invoiceBill.forEach((item) => {
              if (item.invoiceMonth == "1") {
                that.invoiceMoneyList[0] = item.invoiceAmount;
              } else if (item.invoiceMonth == "2") {
                that.invoiceMoneyList[1] = item.invoiceAmount;
              } else if (item.invoiceMonth == "3") {
                that.invoiceMoneyList[2] = item.invoiceAmount;
              } else if (item.invoiceMonth == "4") {
                that.invoiceMoneyList[3] = item.invoiceAmount;
              } else if (item.invoiceMonth == "5") {
                that.invoiceMoneyList[4] = item.invoiceAmount;
              } else if (item.invoiceMonth == "6") {
                that.invoiceMoneyList[5] = item.invoiceAmount;
              } else if (item.invoiceMonth == "7") {
                that.invoiceMoneyList[6] = item.invoiceAmount;
              } else if (item.invoiceMonth == "8") {
                that.invoiceMoneyList[7] = item.invoiceAmount;
              } else if (item.invoiceMonth == "9") {
                that.invoiceMoneyList[8] = item.invoiceAmount;
              } else if (item.invoiceMonth == "10") {
                that.invoiceMoneyList[9] = item.invoiceAmount;
              } else if (item.invoiceMonth == "11") {
                that.invoiceMoneyList[10] = item.invoiceAmount;
              } else if (item.invoiceMonth == "12") {
                that.invoiceMoneyList[11] = item.invoiceAmount;
              }
            });
            that.drawLine();
          }
        })
        .catch((error) => {});
    },
    // 日期转化
    getLocalTime(nS) {
      let date = new Date(nS);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;
      date = year + "-" + month + "-" + day;
      return date;
    },
    // 千分位  隔开
    thousandBitSeparator(num) {
      let box = Math.abs(num);
      let [integer, decimal] = String.prototype.split.call(num, ".");
      integer = (integer || 0).toString();
      let result = "";
      while (integer.length > 3 && box >= 1000) {
        result = "," + integer.slice(-3) + result;
        integer = integer.slice(0, integer.length - 3);
      }
      if (integer) {
        result = integer + result;
      }
      return `${result}${decimal ? "." + decimal : ""}`;
    },
    // 开票统计  切换
    handleClick() {
      if (this.tabPosition == "nowMonth") {
        this.monthShow = true;
        this.quarterShow = false;
        this.yearShow = false;
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        // month = month < 10 ? "0" + month : month;
        let applyParams = {
          dateType: 0,
          month: month,
          year: year,
          taxDiskCreateTime: this.getLocalTime(this.taxDiskCreateTime),
          taxDiskNum: this.taxDiskNum,
        };
        this.getStatic(applyParams);
      } else if (this.tabPosition == "nowQuarter") {
        this.monthShow = false;
        this.quarterShow = true;
        this.yearShow = false;
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let applyParams = {
          dateType: 1,
          season: this.getQuarterSeasonStartMonth(month),
          year: year,
          taxDiskCreateTime: this.getLocalTime(this.taxDiskCreateTime),
          taxDiskNum: this.taxDiskNum,
        };
        this.getStatic(applyParams);
      } else if (this.tabPosition == "nowYear") {
        this.monthShow = false;
        this.quarterShow = false;
        this.yearShow = true;
        let date = new Date();
        let year = date.getFullYear();
        let applyParams = {
          dateType: 2,
          year: year,
          taxDiskCreateTime: this.getLocalTime(this.taxDiskCreateTime),
          taxDiskNum: this.taxDiskNum,
        };
        this.getStatic(applyParams);
      }
    },
    // 判断是哪一季度
    getQuarterSeasonStartMonth(month) {
      if (month < 4) {
        return 1;
      } else if (month < 7) {
        return 2;
      } else if (month < 10) {
        return 3;
      } else {
        return 4;
      }
    },

    //发票监控数据
    invoiceMonitor() {
      let applyParams = {
        taxDiskNum: this.taxDiskNum,
        invoiceType: "",
        selectType: "2", //0:默认查询,1:同步查询 需要做判断 什么时候传0/1？？？？
      };
      var that = this;
      invoiceMonitorDataApi(applyParams).then((res) => {
        // console.log("监控信息", res);
        if (res && res.code == "200") {
          that.openableDeadlineDate = res.data.openableDeadlineDate.replace(
            /-/g,
            "."
          );
          console.log(that.openableDeadlineDate);
          // console.log(that.dateDiff(res.data.openableDeadlineDate))
          that.showInvoiceDay =
            that.dateDiff(res.data.openableDeadlineDate) + "天";
          that.invoiceMonitorList.push({
            value: 60 - that.dateDiff(res.data.openableDeadlineDate),
            name: "",
          });
          that.invoiceMonitorList.push({
            value: that.dateDiff(res.data.openableDeadlineDate),
            name: "",
          });

          that.drawAnnularB();
        }
      });
    },
    dateDiff(sDate2) {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;
      var sDate1 = year + "-" + month + "-" + day;
      // var sDate1=new Date().pattern("yyyy-MM-dd");

      // sDate2=LEx.util.Format.formatDate(sDate2,"yyyy-MM-dd");
      var aDate, oDate1, oDate2, iDays;
      aDate = sDate1.split("-");
      oDate1 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]); //转换为yyyy-MM-dd格式
      aDate = sDate2.split("-");
      oDate2 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]);
      iDays = parseInt((oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
      return Math.abs(iDays); //返回相差天数
    },

    //发票库存
    invoiceInventory() {
      let applyParams = {
        taxDiskNum: this.taxDiskNum,
        // selectType: "0", //0:默认查询,1:同步查询 需要做判断
      };
      var that = this;
      invoiceInventoryApi(applyParams).then((res) => {
        //
        if (res && res.code == "200") {
          if (res.data.length > 0) {
            res.data.forEach((item) => {
              if (item.balances) {
                that.invoiceTotal += item.balances;
                if (item.invoiceType == "004") {
                  // 增值税专用发票
                  that.invoiceTableData.push({
                    value: item.balances,
                    // name: "增值税专用发票(张)",
                    name: "专票(张)",
                    itemStyle: {
                      color: "#608DFA",
                    },
                  });
                } else if (item.invoiceType == "007") {
                  // 增值税普通发票
                  that.invoiceTableData.push({
                    value: item.balances,
                    // name: "增值税普通发票(张)",
                    name: "普票(张)",
                    itemStyle: {
                      color: "#1861F2",
                    },
                  });
                } else if (item.invoiceType == "025") {
                  // 卷式发票
                  that.invoiceTableData.push({
                    value: item.balances,
                    name: "卷式发票(张)",
                    itemStyle: {
                      color: "orange",
                    },
                  });
                } else if (item.invoiceType == "026") {
                  // 电子普通发票
                  that.invoiceTableData.push({
                    value: item.balances,
                    // name: "电子普通发票(张)",
                    name: "电子普票(张)",
                    itemStyle: {
                      color: "#36B336",
                    },
                  });
                } else if (item.invoiceType == "028") {
                  // 电子专用发票
                  that.invoiceTableData.push({
                    value: item.balances,
                    // name: "电子专用发票(张)",
                    name: "电子专票(张)",
                    itemStyle: {
                      color: "#FF8C19",
                    },
                  });
                } else if (item.invoiceType == "005") {
                  // 机动车销售统一发票
                  that.invoiceTableData.push({
                    value: item.balances,
                    // name: "机动车销售统一发票(张)",
                    name: "机动车(张)",
                    itemStyle: {
                      color: "#FF5151",
                    },
                  });
                }
              }
            });
          } else {
            that.invoiceTableData = [
              {
                name: "发票总数(张)",
                value: 0,
                itemStyle: {
                  color: "#1861F2",
                },
              },
            ];
          }
          that.drawAnnular();
        }
      });
    },
    calculated() {
      this.$message({
        message: "敬请期待",
        center: true,
      });
    },
    calendar() {
      window.open("https://12366.chinatax.gov.cn/bsfw/calendar/main", "_blank");
    },
    online() {
      window.open(
        "https://12366.chinatax.gov.cn/bsfw/onlinetaxation/main",
        "_blank"
      );
      // this.$alert(
      //   "点击跳转到注册地所属的网上税务局，注册地来源：初始设置-企业信息模块的注册地",
      //   "各地税务局地址待补充",
      //   {
      //     dangerouslyUseHTMLString: true,
      //   }
      // ).catch((err) => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.page-container {
  background: #f1f3f7;
  margin-top: -30px;
  margin-left: -40px;
  width: auto;
  padding: 15px 0px 5px 40px;
}

.invoicing-menu-item {
  text-align: center;
  cursor: pointer;
  width: 100%;
  height: 14vh;
  ::v-deep.el-card__body {
    width: 100%;
    padding: 10px;
  }
  img {
    display: inline-block;
    width: 100%;
    height: 12vh;
  }
  p {
    font-size: 2vh;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #262626;
    margin-top: 5px;
  }
}
.statistics-box {
  margin-top: 1vh;
  text-align: center;
  .title {
    margin-top: 20px;
    margin-bottom: 32px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #474747;
    text-align: left;
  }
  h1 {
    // font-size: 2vh;
    margin-top: 1vh;
    margin-bottom: 1vh;
  }
  .right {
    .el-col p:nth-child(1) {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      text-align: left;
    }
    .el-col p:nth-child(2) {
      font-size: 30px;
      font-family: HelveticaNeue;
      color: rgba(0, 0, 0, 0.85);
      text-align: left;
    }
    .line {
      margin-top: 15px;
      margin-left: 20px;
      height: 70px;
      border-left: 1px solid rgba($color: #000, $alpha: 0.06);
    }
  }
}
.choose {
  height: 5vh;
  font-size: 2vh;
  color: #474747;
  display: flex;
  justify-content: space-between;
}
.premium-service {
  background: #fff;
  width: 100%;
  border: 1px solid #ebeef5;
  margin-top: 1vh;
  padding: 1vh 2vh;
  .title {
    font-size: 2vh;
    font-family: PingFangSC-Medium, PingFang SC;
    color: #474747;
    // font-weight: bold;
  }
  .service {
    display: flex;
    margin-top: 1.5vh;
    .service-item {
      font-size: 1.5vh;
      font-family: SourceHanSansSC-Medium;
      cursor: pointer;
      margin-right: 20px;
      padding-left: 15px;
      text-align: center;
    }
  }
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

#boxx ::v-deep .el-card {
  box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.01) !important;
}

#boxx ::v-deep .el-card__body {
  padding: 10px;
}
</style>
