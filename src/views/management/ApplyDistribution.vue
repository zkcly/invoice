<template>
  <div class="page-containerapply">
    <div class="page-header">
      <breadnav :textTitle="navTitle" @leftEvent="clickLeft" />
      <div class="title-right">
        <div class="title-right-middle">
          <img src="@/assets/ApplyDistribution/warehouse.png" />
          <span style="cursor: pointer" @click="goStock"
            >库存</span
          >
          <img src="@/assets/ApplyDistribution/Set.png" style="margin-left: 7px"/>
          <span
            style="cursor: pointer"
            @click="
              $router.push('/management/invoicingManagement/recipientSetting')
            "
            >设置</span
          >
        </div>
        <el-button type="primary" @click="apply" class="applybtn"
          >申领</el-button
        >
      </div>
    </div>
    <div class="page-content-apply">
      <div class="small-header">
        <div class="title-small">发票申领</div>
        <div class="small-title">发票类型：</div>
        <div class="choose">
          <el-select
            size="small"
            v-model="invoiceType"
            placeholder="请选择"
            style="width: 160px"
          >
            <el-option label="全部发票" value=""></el-option>
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="choose">
          <el-select
            size="small"
            v-model="queryParams.year"
            placeholder="请选择年份"
            style="width: 160px"
            @change="changeyear"
          >
            <el-option
              v-for="item in yearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            size="small"
            v-model="queryParams.month"
            placeholder="请选择月份"
            style="width: 160px"
          >
            <el-option
              v-for="item in monthOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <el-button type="primary" @click="searchInvoiceApply">查询</el-button>
      </div>
      <div class="up-table">
        <el-table :data="applyData" tooltip-effect="dark" style="width: 100%">
          <div slot="empty">
            <listnodate :tableFlag="noDateFlag" />
          </div>
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="发票类型" width="180">
            <template slot-scope="scope">
              {{ scope.row.invoiceType | trans }}
            </template>
          </el-table-column>
          <el-table-column
            prop="invoiceClassification"
            label="发票种类"
            width="180"
          ></el-table-column>
          <!-- <el-table-column
            prop="invoiceCode"
            label="发票代码"
            width="180"
          ></el-table-column> -->
          <el-table-column
            prop="purchaseNum"
            label="申领数量"
            width="180"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="purchaseDate"
            label="申领时间"
            width="180"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop=" purchaseStatus"
            label="申领状态"
            width="150"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.purchaseStatus | Pstatus }}
            </template>
          </el-table-column>
          <el-table-column
            prop=" resultConfirmFlag"
            label="确认结果"
            width="150"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.resultConfirmFlag == 0 ? '无需确认' : scope.row.resultConfirmFlag == 1 ? '未确认' :
              scope.row.resultConfirmFlag == 2 ? '已确认' : '确认失败' }}
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="失败原因"
            min-width="150"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作" fixed="right" width="120">
            <template slot-scope="scope">
              <el-button
                @click="undo(scope.row, scope.$index)"
                v-if="scope.row.purchaseStatus == '5' || scope.row.purchaseStatus == '0'"
                type="text"
                size="small"
              >
                撤销</el-button
              >
              <el-button
                v-else
                @click="undo(scope.row, scope.$index)"
                type="text"
                size="small"
                disabled
                >撤销</el-button
              >

              <el-button
                @click="ParperConfirm(scope.row, scope.$index)"
                v-if="
                  ( scope.row.resultConfirmFlag == '1' || scope.row.resultConfirmFlag == '3') 
                    && 
                  (scope.row.purchaseStatus == '0' || scope.row.purchaseStatus == '1' || scope.row.purchaseStatus == '5')
                    &&
                  (scope.row.invoiceType == '004' || scope.row.invoiceType == '007')
                "
                type="text"
                size="small"
              >
                确认</el-button
              >
              <el-button
                v-else
                @click="ParperConfirm(scope.row, scope.$index)"
                type="text"
                size="small"
                disabled
                >确认</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="paging">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 50, 100, 200]"
          :page-size="pageSizeNum"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
      <paperinvoice-dialog
        :visible.sync="paperdialogVisible"
        :data="paperconfirm"
        width="30%"
        :close-on-click-modal="false"
      />
    </div>
    <!-- 分发列表 -->
    <div class="page-content-apply">
      <div class="small-header">
        <div class="title-small">发票分发</div>
        <div class="small-title">发票类型：</div>
        <div class="choose">
          <el-select
            size="small"
            v-model="invoiceTypeTwo"
            placeholder="请选择"
            style="width: 160px"
          >
            <el-option label="全部发票" value=""></el-option>
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <el-button type="primary" @click="queryDistributed">查询</el-button>
      </div>
      <div class="down-table">
        <el-table
          :data="distributionData"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <div slot="empty">
            <listnodate :tableFlag="noDateFlag" />
          </div>
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="invoiceType" label="发票类型" width="180">
            <template slot-scope="scope">
              {{ scope.row.invoiceType | trans }}
            </template>
          </el-table-column>
          <el-table-column
            prop="invoiceCode"
            label="发票代码"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="startNo"
            label="起始号码"
            width="180"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="endNo"
            label="终止号码"
            width="180"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="count"
            label="发票份数"
            width="150"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="分发状态" width="150" show-overflow-tooltip>
            <template slot-scope="scope">
              {{
                scope.row.applyInvoiceStatus == 0
                  ? "待分发"
                  : scope.row.applyInvoiceStatus == 1
                  ? "分发中"
                  : "已分发"
              }}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="120">
            <template slot-scope="scope">
              <el-button
                @click="distribute(scope.row, scope.$index)"
                :disabled="scope.row.applyInvoiceStatus != 0"
                type="text"
                size="small"
                >分发</el-button
              >
              <!-- <el-button
                v-else
                @click="distribute(scope.row, scope.$index)"
                type="text"
                size="small"
                >分发</el-button
              > -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <distribution-dialog
        :visible.sync="dialogVisible"
        :data="selectruleform"
      />
      <!-- 是否申领弹窗 -->
      <el-dialog
        :visible.sync="importResultVisible"
        width="30%"
        :close-on-click-modal="false"
      >
        <el-row style="margin-top: -20px">
          <el-col :span="4"><i class="el-icon-error resultIcon"></i></el-col>
          <el-col :span="20"><span class="resultText">无法申领</span></el-col>
          <el-col :span="20" style="margin-top: 20px"
            ><span class="resultText2">功能维护中，暂无法使用</span></el-col
          >
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="importResultVisible = false"
            >确定</el-button
          >
        </div>
      </el-dialog>
      <!-- 是否分发弹窗 -->
      <el-dialog
        :visible.sync="destributiontResultVisible"
        width="30%"
        :close-on-click-modal="false"
      >
        <el-row style="margin-top: -20px">
          <el-col :span="4"><i class="el-icon-error resultIcon"></i></el-col>
          <el-col :span="20"><span class="resultText">无法分发</span></el-col>
          <el-col :span="20" style="margin-top: 20px"
            ><span class="resultText2">功能维护中，暂无法使用</span></el-col
          >
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="destributiontResultVisible = false"
            >确定</el-button
          >
        </div>
      </el-dialog>
      <!-- 分发成功结果弹窗 -->
      <el-dialog :visible.sync="DistributeResultVisible">
        <el-row>
          <el-col :span="4"><i class="el-icon-success resultIcon"></i></el-col>
          <el-col :span="20"><span class="resultText">分发成功</span></el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="DistributeResultVisible = false"
            >确定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { UtilsGetTicketType } from "@/utils/function";
import Listnodate from "@/components/ListNoDate";
import Breadnav from "@/components/Breadnav";
import DistributionDialog from "./components/DistributionDialog.vue";
import PaperinvoiceDialog from "./components/PaperInvoiceDialog";
import { getRedis } from "@/api/taxStock";
import {
  getDiskTicketTypeApi,
  cancelReceiveApi,
  searchByCondition,
  Invoicequery,
} from "@/api/invoice.js";
export default {
  name: "ApplyDistribution",
  components: {
    DistributionDialog,
    Listnodate,
    Breadnav,
    PaperinvoiceDialog,
  },
  data() {
    return {
      navTitle: "申领分发",
      noDateFlag: "successNoDate",
      invoiceType: "",
      invoiceTypeTwo: "",
      taxDiskNum: "", //税盘号
      queryParams: {
        year: "",
        month: "",
      },

      //分页
      currentPage: 1, //当前是第几页
      total: 0, //总条目数
      pageSizeNum: 10, //一页显示多少条
      pageNum: 1,
      id: "",
      // 发票类型
      typeOptions: [],
      applyData: [
        // {"address": "string",
        // "addressee": "string",
        // "agentName": "string",
        // "applyDescription": "string",
        // "companyUserId": 0,
        // "endInvoiceNo": "",
        // "id": 0,
        // "idNo": "string",
        // "idType": "string",
        // "invoiceClassification": "string",
        // "invoiceClassificationCode": "string",
        // "invoiceCode": "",
        // "invoiceType": "004",
        // "mobilePhone": "string",
        // "originalApplyNumber": "string",
        // "processInformation": "string",
        // "processingTime": "2021-07-06T03:08:17.792Z",
        // "purchaseDate": "2021-07-06T03:08:17.792Z",
        // "purchaseMode": 0,
        // "purchaseNum": 0,
        // "purchaseStatus": 0,
        // "purchaseType": 0,
        // "registrationTime": "2021-07-06T03:08:17.792Z",
        // "remark": "string",
        // "resultConfirmFlag": "string",
        // "serialNumber": "string",
        // "startInvoiceNo": "",
        // "taxDiskNum": "string",
        // "tel": "string",
        // "zipcode": "string"}
      ],
      selectruleform: {},
      paperconfirm: {},
      deviceNo: "",
      monthOptions: "",
      DistributeResultVisible: false, //分发成功弹窗
      destributiontResultVisible: false,
      distributionData: [
        //                 {
        //                     "invoiceType": "004",
        //                     "invoiceCode": "3302211130",
        //                     "startNo": "13491998",
        //                     "endNo": "13491999",
        //                     "count": "2",
        //                     "applyInvoiceStatus": "0"
        //                 },
        //                 {
        //                     "invoiceType": "026",
        //                     "invoiceCode": "033021800111",
        //                     "startNo": "69511943",
        //                     "endNo": "69511943",
        //                     "count": "1",
        //                     "applyInvoiceStatus": "0"
        //                 },
        //                 {
        //                     "invoiceType": "026",
        //                     "invoiceCode": "033021800111",
        //                     "startNo": "69511583",
        //                     "endNo": "69511583",
        //                     "count": "1",
        //                     "applyInvoiceStatus": "1"
        //                 }
      ],
      yearOptions: [
        {
          label: 2021,
          value: "2021",
        },
        {
          label: 2020,
          value: "2020",
        },
        {
          label: 2019,
          value: "2019",
        },
      ],
      monthOptions: [
        {
          label: "1月",
          value: "1",
        },
        {
          label: "2月",
          value: "2",
        },
        {
          label: "3月",
          value: "3",
        },
        {
          label: "4月",
          value: "4",
        },
        {
          label: "5月",
          value: "5",
        },
        {
          label: "6月",
          value: "6",
        },
        {
          label: "7月",
          value: "7",
        },
        {
          label: "8月",
          value: "8",
        },
        {
          label: "9月",
          value: "9",
        },
        {
          label: "10月",
          value: "10",
        },
        {
          label: "11月",
          value: "11",
        },
        {
          label: "12月",
          value: "12",
        },
      ],
      key: "",
      importResultVisible: false,
      undoFlag: false, //申领撤销按钮置灰
      submissionFlag: false, //分发按钮置灰
      dialogVisible: false, //分发弹窗
      paperdialogVisible: false, //纸质发票确认弹窗
    };
  },
  created() {
    this.taxDiskInfo = this.$store.state.user.taxDiskInfo;
    this.taxDiskNum = this.$store.state.user.taxDiskNum;
    console.log(this.$store.state.user);
    console.log(this.taxDiskNum);
    this.diskType = this.taxDiskInfo.diskType;
    this.onlineLocation = this.taxDiskInfo.onlineLocation;
    this.getDiskTicketType();
  },
  mounted() {
    // this.queryParams.type = this.typeOptions[0].label;
    this.queryParams.year = this.yearOptions[0].label; //select中初始化默认选中选项
    var date = new Date();
    this.queryParams.month = date.getMonth() + 1 + ""; //当前月份
    this.changeyear(this.queryParams.year); //月份限制
    if (
      this.onlineLocation == "2" &&
      (this.diskType == "2" || this.diskType == "3")
    ) {
      this.getApplyList(); //申领查询
    }
    // this.searchInvoiceApply(); //查询
    // this.getDistributeList(); //分发列表
  },
  computed: {
    taxDiskNumChange() {
      return this.$store.state.user.taxDiskNum;
    },
  },
  watch: {
    taxDiskNumChange: {
      handler: function (newval, oldval) {
        if (newval !== oldval) {
          this.taxDiskNum = newval;
          this.getDiskTicketType();
        }
      },
      deep: true,
    },
  },
  filters: {
    trans(row) {
      let typeObj = {
        "004": "增值税专用发票",
        "007": "增值税普通发票",
        "025": "卷式发票",
        "026": "电子普通发票",
        "028": "电子专用发票",
        "005": "机动车销售统一发票",
      };
      return typeObj[row] || "-";
    },
    Pstatus(row) {
      let typeObj = {
        0: "申领中",
        1: "申领成功",
        2: "申领失败",
        3: "撤销中",
        4: "已撤销",
        5: "撤销失败",
      };
      return typeObj[row] || "-";
    },
  },
  methods: {
    //跳转至发票库存
    goStock() {
      this.$router.push({
        path: "/management/invoicingManagement/invoiceStock",
        query: {
          List: JSON.stringify({
            type: "applyDistribution",
          }),
        },
      });
    },
    //判断申领入口路径
    apply() {
      // this.$router.push('/management/invoicingManagement/invoiceApply')
      if (
        this.onlineLocation == "2" &&
        (this.diskType == "2" || this.diskType == "3")
      ) {
        // if (
        //   this.onlineLocation == "1" ||
        //   (this.diskType == "2" || this.diskType == "3" || this.diskType == "1")
        // ) {
        this.$router.push("/management/invoicingManagement/invoiceApply");
      } else {
        this.importResultVisible = true;
      }
    },
    clickLeft() {
      this.$router.push({
        name: "managementIndex",
      });
    },
    changeyear(value) {
      if (String(value) === "2021") {
        this.monthOptions = this.monthOptions.filter(
          (item) => item.value <= new Date().getMonth() + 1
        );
        this.queryParams.month =
          this.queryParams.month >= new Date().getMonth() + 1
            ? new Date().getMonth() + 1 + ""
            : this.queryParams.month;
      } else {
        this.monthOptions = [
          {
            label: "1月",
            value: "1",
          },
          {
            label: "2月",
            value: "2",
          },
          {
            label: "3月",
            value: "3",
          },
          {
            label: "4月",
            value: "4",
          },
          {
            label: "5月",
            value: "5",
          },
          {
            label: "6月",
            value: "6",
          },
          {
            label: "7月",
            value: "7",
          },
          {
            label: "8月",
            value: "8",
          },
          {
            label: "9月",
            value: "9",
          },
          {
            label: "10月",
            value: "10",
          },
          {
            label: "11月",
            value: "11",
          },
          {
            label: "12月",
            value: "12",
          },
        ];
      }
    },
    //获取发票类型
    getDiskTicketType() {
      let applyParams = {
        taxDiskNum: this.taxDiskNum,
      };
      // var that = this;
      getDiskTicketTypeApi(applyParams)
        .then((res) => {
          if (res && res.code == "200") {
            this.typeOptions = UtilsGetTicketType(res.data.ticketType);
          }
        })
        .catch((error) => {});
    },
    // 申领列表查询
    getApplyList() {
      var date = this.queryParams.year + "-" + "0" + this.queryParams.month;
      let params = {
        deviceNo: this.taxDiskNum,
        invoiceType: this.invoiceType,
        keyword: "",
        pageSize: this.pageSizeNum, //每页几条
        pageNum: this.currentPage, //当前页
        taxId: this.$store.state.user.loginInfo.taxId,
        timeDesc: true,
        startDate: date,
        taxDiskNum: this.taxDiskNum,
      };
      searchByCondition(params).then((response) => {
        if (response && response.code == "200") {
          this.applyData = response.data.records;
          this.total = response.data.total;
        }
      });
    },
    //确认
    ParperConfirm(data) {
      this.paperdialogVisible = true;
      this.paperconfirm = data;
      // this.getApplyList();
    },
    // 撤销操作
    undo(row, index) {
      this.$confirm("你确认撤销吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let applyParams = {
            applySerialNumber: row.serialNumber,
            callbackUrl: "",
            companyName: "",
            deviceNo: this.taxDiskNum,
            invoiceType: row.invoiceType, //发票类型
            invoiceUploadingAddress: "",
            invoiceUploadingPort: "",
            platformType: "",
            requestModel: "",
            taxControlPlateOrder: "",
            taxDigitalCertificatePassword: "",
            taxId: this.$store.state.user.loginInfo.taxId,
            version: "",
            wqyCompanyCode: "",
            wqyPassword: "",
            wqyPhone: "",
            wqyProvinceCode: "",
            wqyTenantId: "",
            wqyUserId: "",
            wqyUserName: "",
          };
          // console.log("撤销",applyParams);
          cancelReceiveApi(applyParams)
            .then((response) => {
              if (response && response.code == "200") {
                
                this.$message({
                  type: "success",
                  message: '撤销成功',
                });
                this.getApplyList();
              }
            })
            .catch((error) => {});
        })
        .catch(() => {});
    },
    //申领领取条件查询
    searchInvoiceApply() {
      if (
        this.onlineLocation == "2" &&
        (this.diskType == "2" || this.diskType == "3")
      ) {
        this.getApplyList();
      } else {
        this.$message({
          type: "info",
          message: "本地盘不支持申领查询",
        });
      }
    },
    //分发
    distribute(data) {
      if (
        (this.onlineLocation == "1" || this.onlineLocation == "2") &&
        (this.diskType == "2" || this.diskType == "3")
        // this.onlineLocation == "1" &&
        // (this.diskType == "1" ||
        // this.diskType == "2")
      ) {
        this.dialogVisible = true;
        this.selectruleform = data;
      } else {
        this.destributiontResultVisible = true;
      }
    },
    // 分发列表查询
    getDistributeList() {
      let params = {
        deviceNo: this.taxDiskNum, //盘号
        invoiceType: this.invoiceTypeTwo,
        taxId: this.$store.state.user.loginInfo.taxId, //纳税人
      };
      Invoicequery(params).then((response) => {
        if (response && response.code == "200") {
          // this.distributionData = response.data.invoiceSerial;
          this.key = response.data;
          this.setInter(3000, this.getRedis);
        } else {
          this.$globals.closeContent();
        }
      });
    },
    // 分发条件查询
    queryDistributed() {
      if (
        (this.onlineLocation == "1" || this.onlineLocation == "2") &&
        (this.diskType == "2" || this.diskType == "3")
        // this.onlineLocation == "1" &&
        // (this.diskType == "1" ||
        // this.diskType == "2")
      ) {
        this.$alert("", "查询中,请稍候", {
          confirmButtonText: "停止查询",
          iconClass: "el-icon-loading",
          center: true,
          showClose: false,
          callback: (action) => {
            clearTimeout(this.timer);
            this.continue = false;
          },
        });
        this.getDistributeList(this.invoiceType);
      } else {
        this.destributiontResultVisible = true;
        return;
      }
    },
    handleApplySelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSizeNum = val;
      this.getApplyList(val, this.pageNum);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getApplyList(this.pageSizeNum, this.currentPage, val);
    },

    //创建30秒定时任务，每3秒查询一次
    //每3秒执行一次查询
    setInter(s, fn) {
      let count = 0;
      let timeOut = (s, fn) => {
        var time1 = setTimeout(() => {
          count++;
          if (count < 60 && this.continue == true) {
            fn.call(this);
            timeOut(s, fn);
          } else if (count >= 60 && this.continue == true) {
            this.continue = false;
            clearTimeout(this.timer);
            this.$globals.closeContent();
            this.$message({
              type: "error",
              message: "税局服务不稳定，请稍后再试",
            });
          } else {
            console.log("结束计时器");
            clearTimeout(this.timer);
            // tryHideFullScreenLoading()
            this.$globals.closeContent();
            this.continue = false;
          }
        }, s);
        this.timer = time1;
      };
      if ((this.continue = true)) {
        timeOut(s, fn);
      }
    },
    //查询请求
    async getRedis(a) {
      const res = await getRedis({ key: this.key });
      if (res.code == 500) {
        this.continue = false;
        return;
      }
      if (res.data.code == 1) {
        this.continue = false;
        clearTimeout(this.timer);
        if (res.data.msgCode == 200) {
          if (this.invoiceTypeTwo != "") {
            let newArr = res.data.data.invoiceSerial.filter((item) => {
              return (
                item.invoiceType == this.invoiceTypeTwo &&
                item.applyInvoiceStatus == 0
              );
            });
            this.distributionData = newArr;
          } else {
            let newArr = res.data.data.invoiceSerial.filter((item) => {
              return item.applyInvoiceStatus == 0;
            });
            this.distributionData = newArr;
            // this.distributionData = res.data.data.invoiceSerial
          }

          this.$globals.closeContent();
          this.$message({
            type: "success",
            message: "成功",
          });
        } else {
          this.$globals.closeContent();
          this.$message({
            type: "error",
            message: res.data.message,
          });
        }
      } else {
        this.continue = true;
        console.log(this.continue);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
body {
  background: #f1f3f7;
}
.page-containerapply {
  background: #ffff;
  // margin: 15px;
}
.page-content-apply {
  margin-left: 30px;
}
.page-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ebeef5;
  align-items: center;
  padding-bottom: 10px;
  .title {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #252525;
    justify-content: end;
    span {
      margin-left: 5px;
    }
  }
  .title-right {
    display: flex;
  }
  .title-right-middle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    right: 30px;
    img {
      width: 30px;
      height: 30px;
      line-height: 30px;
      margin-right: 1px;
    }
    span {
      display: inline-block;
      width: 30px;
      height: 30px;
      line-height: 30px;
      margin-right: 1px;
    }
  }
}
.small-header {
  display: flex;
  align-items: center;
  margin: 15px 0;
  .title-small {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #000;
    margin-right: 40px;
  }
  .small-title {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #000;
  }
  .choose {
    .el-select {
      margin-right: 20px;
    }
  }
  .btn {
    border: none;
    width: 74px;
    height: 32px;
    border-radius: 2px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #fff;
    background: #5e8cf9;
    cursor: pointer;
  }
}
.up-table {
  padding-bottom: 25px;
}
.paging {
  margin-top: 0px;
  text-align: right;
}
.resultIcon {
  font-size: 32px;
  color: red;
}
.resultText {
  font-size: 16px;
  font-weight: 600;
}
.resultText2 {
  font-size: 16px;
  color: #787878;
}
.applybtn {
  margin-right: 30px;
}
</style>