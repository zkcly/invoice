<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <!-- <breadnav :textTitle="title" @leftEvent='clickLeft'/> -->
        <div class="breadNav" @click="clickLeft">
          <i class="el-icon-arrow-left"></i>
          <span class="navText">{{ title }}</span>
        </div>
        <div class="serachBox">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-form-item
              prop="inputValue"
              :rules="{
                required: false,
                message: '请输入',
                trigger: 'blur',
              }"
            >
              <el-input
                placeholder="请输入"
                size="small"
                v-model.trim="ruleForm.inputValue"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="handleSearch()"
                  >搜索</el-button
                >
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <span
          style="margin-left: 50px"
          v-show="
            routeList.type != 'shandian-fuzhi' &&
            routeList.type != 'shandian-fushu'
          "
          >未上传：{{ notUploadNum }}</span
        >
      </div>

      <div class="rightNavBox">
        <template
          v-if="
            routeList.type == 'shandian-fuzhi' ||
            routeList.type == 'shandian-fushu'
          "
        >
          <el-button size="mini" type="primary" @click="handleRepair()"
            >修复</el-button
          >
        </template>
        <template v-else>
          <div class="rightNav" @click="handleExport">
            <img
              src="../../assets/images/exportX2.png"
              alt="图片"
              class="navImg"
            />
            <span class="navTex">导出</span>
          </div>
          <div class="rightNav" @click="orderPrint">
            <img
              src="../../assets/images/printX2.png"
              alt="图片"
              class="navImg"
            />
            <span class="navTex">清单打印</span>
          </div>

          <div class="rightNav" @click="handlePrint">
            <img
              src="../../assets/images/printX2.png"
              alt="图片"
              class="navImg"
            />
            <span class="navTex">打印</span>
          </div>
          <div class="rightNav" @click="handleDownload">
            <img
              src="../../assets/images/downloadX2.png"
              alt="图片"
              class="navImg"
            />
            <span class="navTex">下载</span>
          </div>
          <el-button
            size="mini"
            type="primary"
            @click="handleUpload"
            :disabled="notUploadNum == 0"
            >上传</el-button
          >
          <el-button size="mini" type="primary" @click="handleRepair()"
            >修复</el-button
          >
        </template>
      </div>
    </div>

    <div class="page-filters">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="发票类型：">
          <el-select size="small" v-model="invoiceType" placeholder="请选择">
            <el-option
              label="全部发票"
              :value="null"
              v-show="
                routeList.type != 'shandian-fuzhi' &&
                routeList.type != 'shandian-fushu'
              "
            ></el-option>
            <el-option
              v-for="status in invoiceTypeList"
              :key="status.id"
              :label="status.label"
              :value="status.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发票状态：">
          <el-select size="small" v-model="invoiceStaus" placeholder="请选择">
            <el-option label="全部状态" :value="null"></el-option>
            <el-option
              v-for="status in invoiceStausList"
              :key="status.id"
              :label="status.label"
              :value="status.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="销货清单："
          v-show="
            routeList.type != 'shandian-fuzhi' &&
            routeList.type != 'shandian-fushu'
          "
        >
          <el-select size="small" v-model="saleSingle" placeholder="请选择">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              v-for="status in saleSingleList"
              :key="status.id"
              :label="status.label"
              :value="status.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开票时间：">
          <el-date-picker
            v-model="applyTime"
            unlink-panels
            size="small"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 250px"
            :clearable="false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="handleQuery()"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <div class="listContent">
      <div class="tableBox" style="padding-bottom: 50px">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%; margin: 15px 0"
          @selection-change="handleSelectionChange"
          :default-sort="{ prop: 'invoiceDate', order: 'descending' }"
          @sort-change="handleSortChange"
          @row-dblclick="selectDbClick"
        >
          <div slot="empty">
            <listnodate :tableFlag="noDateFlag" />
          </div>
          <!-- <template
            v-if="
              routeList.type == 'shandian-fuzhi' ||
              routeList.type == 'shandian-fushu'
            "
          ></template> -->
          <el-table-column type="selection" width="50" align="center">
          </el-table-column>
          <el-table-column
            v-for="col in columns"
            :prop="col.value"
            :label="col.label"
            :key="col.key"
            :width="col.width"
            :fixed="col.fixed"
            align="center"
            :sortable="col.sortable"
          >
            <!--  -->
            <template slot-scope="scope">
              <span v-if="col.value == 'invoiceType'">
                <span v-if="scope.row.invoiceType == '004'">
                  增值税专用发票
                </span>
                <span v-if="scope.row.invoiceType == '007'">
                  增值税普通发票
                </span>
                <span v-if="scope.row.invoiceType == '025'"> 卷式发票 </span>
                <span v-if="scope.row.invoiceType == '026'">
                  电子普通发票
                </span>
                <span v-if="scope.row.invoiceType == '028'">
                  电子专用发票
                </span>
                <span v-if="scope.row.invoiceType == '005'">
                  机动车销售统一发票
                </span>
              </span>
              <span v-if="col.value == 'invoiceDate'">{{
                scope.row.invoiceDate.split(" ")[0]
              }}</span>
              <span v-if="col.value == 'invoiceCode'">{{
                scope.row.invoiceCode
              }}</span>
              <span v-if="col.value == 'invoiceNo'">{{
                scope.row.invoiceNo
              }}</span>
              <span v-if="col.value == 'buyerName'">{{
                scope.row.buyerName
              }}</span>
              <span v-if="col.value == 'mainProductName'">{{
                scope.row.mainProductName
              }}</span>
              <span v-if="col.value == 'totalPriceWithTax'">
                <span v-if="scope.row.invoiceCategory == '2'"> </span>
                <span v-else>
                  {{ scope.row.totalPriceWithTax }}
                </span>
              </span>
              <span v-if="col.value == 'kpr'">{{ scope.row.kpr }}</span>
              <span v-if="col.value == 'invoiceInvalidCategory'">
                <span
                  v-if="
                    scope.row.invoiceCategory == '0' &&
                    scope.row.invoiceInvalidType == '0'
                  "
                >
                  正数正常
                </span>
                <span
                  v-if="
                    scope.row.invoiceCategory == '1' &&
                    scope.row.invoiceInvalidType == '0'
                  "
                >
                  负数正常
                </span>
                <span
                  v-if="
                    scope.row.invoiceCategory == '0' &&
                    scope.row.invoiceInvalidType == '1'
                  "
                >
                  正数作废
                </span>
                <span
                  v-if="
                    scope.row.invoiceCategory == '1' &&
                    scope.row.invoiceInvalidType == '1'
                  "
                >
                  负数作废
                </span>
                <span v-if="scope.row.invoiceCategory == '2'"> 空白作废 </span>
              </span>
              <!-- <span v-if="col.value == 'uploadMarks'">
                <span v-if="scope.row.uploadMarks == '0'"> 未上传 </span>
                <span v-if="scope.row.uploadMarks == '1'"> 已上传 </span>
              </span> -->
              <span v-if="col.value == 'listingLabel'">
                <span v-if="scope.row.listingLabel == '1'"> 有 </span>
                <span v-if="scope.row.listingLabel == '0'"> 无 </span>
              </span>
              <span v-if="col.value == 'operationGod'">
                <template
                  v-if="
                    routeList.type == 'shandian-fuzhi' ||
                    routeList.type == 'shandian-fushu'
                  "
                >
                  <el-button
                    type="text"
                    size="small"
                    v-if="
                      (scope.row.invoiceCategory == '1' &&
                        scope.row.invoiceInvalidType == '1') ||
                      (scope.row.invoiceCategory == '1' &&
                        scope.row.invoiceInvalidType == '0') ||
                      scope.row.invoiceCategory == '2' ||
                      (routeList.type == 'shandian-fushu' &&
                        (scope.row.invoiceType == '004' ||
                          scope.row.invoiceType == '028')) ||
                      (routeList.type == 'shandian-fushu' &&
                        scope.row.invoiceCategory == '0' &&
                        scope.row.invoiceInvalidType == '1') ||
                      (routeList.type == 'shandian-fushu' &&
                        scope.row.invoiceRedStatus == '1')
                    "
                    disabled
                    @click="handelSingleRevoke(scope.$index, scope.row)"
                    >选择</el-button
                  >
                  <el-button
                    type="text"
                    size="small"
                    v-else
                    @click="handelSingleRevoke(scope.$index, scope.row)"
                    >选择</el-button
                  >
                </template>
                <template v-else>
                  <el-button
                    @click="handleSingleLook(scope.$index, scope.row)"
                    v-if="scope.row.invoiceCategory == '2'"
                    disabled
                    type="text"
                    size="small"
                    >查看</el-button
                  >
                  <el-button
                    @click="handleSingleLook(scope.$index, scope.row)"
                    type="text"
                    v-else
                    size="small"
                    >查看</el-button
                  >
                  <el-button
                    type="text"
                    v-if="
                      (scope.row.invoiceCategory == '0' ||
                        scope.row.invoiceCategory == '1') &&
                      scope.row.invoiceInvalidType == '0'&&
                      scope.row.invoiceRedStatus == '0' &&
                      (scope.row.invoiceType == '004' ||
                        scope.row.invoiceType == '007') &&
                      isExtendMonth(scope.row.invoiceDate) == true
                    "
                    size="small"
                    @click="handleSingleVoid(scope.$index, scope.row)"
                    >作废</el-button
                  >
                  <el-button
                    type="text"
                    v-else
                    size="small"
                    disabled
                    @click="handleSingleVoid(scope.$index, scope.row)"
                    >作废</el-button
                  >
                  <el-button
                    type="text"
                    size="small"
                    v-if="
                      scope.row.invoiceCategory == '0' &&
                      scope.row.invoiceInvalidType == '0' &&
                      (scope.row.invoiceRedStatus == '0' ||
                        scope.row.invoiceRedStatus == '2')
                    "
                    @click="handelSingleRevoke(scope.$index, scope.row)"
                    >红冲</el-button
                  >
                  <el-button v-else type="text" disabled size="small"
                    >红冲</el-button
                  >
                </template>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="paginBox">
      <el-pagination
        @size-change="handleSizeChange"
        background
        layout="total,  prev, pager, next, sizes,jumper"
        :current-page="query.pageIndex"
        :page-size="query.pageSize"
        :page-sizes="[10, 20, 50, 100, 200]"
        :total="pageTotal"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>

    <!-- 发票修复组件 -->
    <invoice-repair
      :visible.sync="invoiceRepairVisibility"
      @getForm="getForm"
      :repairData="repairData"
    />

    <!-- 发票预览组件 -->
    <InvoicePreview
      :isElectronic="isElectronic"
      :visible.sync="invoicePreviewVisible"
      :taxDetail="taxDetail"
    ></InvoicePreview>

    <!-- 打印机设置组件 -->
    <PrintSetting :visible.sync="printVisible" :printType="printType">
    </PrintSetting>

    <!--  准备打印弹框 -->
    <el-dialog
      title="提示"
      :visible.sync="readyPrintVisable"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
      :before-close="readyPrintCancel"
    >
      <!-- <span>这是一段信息</span> -->
      <p>您本次共打印{{ printTotalNum }}份发票</p>
      <p>发票代码：{{ printInvoiceCode }}</p>
      <p>发票号码：{{ printInvoiceStartNum }}-{{ printInvoiceEndNum }}</p>

      <span slot="footer" class="dialog-footer">
        <el-button @click="readyPrintCancel()">取 消</el-button>
        <el-button type="primary" @click="readyPrintConfirm()"
          >开始打印</el-button
        >
      </span>
    </el-dialog>

    <!-- 打印弹框 -->
    <el-dialog
      title="正在打印"
      :visible.sync="nowPrintVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
      :showClose="false"
    >
      <div>
        <el-progress :percentage="percentage" color="#409eff"></el-progress>
        <div class="executeText">
          <span>打印成功{{ nowSuccessPrintNum }}张</span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="quitPrint">停止打印</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  InvoiceList,
  invoiceRepair,
  invoiceAbolish,
  invoiceUploaded,
  invoiceExport,
  invoiceDetail,
  invoiceZipDownload,
  invoicePrint,
  invoiceOrderPrint,
  createPdfAndImg,
  getNotUploadNum,
  invoiceNotUploaded,
  getPrintInfo,
  getListingPrintInfo,
} from "@/api/invoicesearch";
import { taxDiskNumDetailsApi } from "@/api/setpan.js";
import { getRedis, getRedisList, getRedisList2 } from "@/api/taxStock";
import { convertCurrency } from "@/utils/function.js";
import { getDiskTicketType } from "@/api/billType.js";
import { UtilsGetTicketType } from "@/utils/function";
import { downloadFile,downloadFile1 } from "@/utils/function.js";
import Listnodate from "@/components/ListNoDate";
import InvoiceRepair from "@/views/management/components/InvoiceRepair.vue";
import InvoicePreview from "../home/components/InvoicePreview";
import {
  showFullScreenLoading,
  tryHideFullScreenLoading,
} from "@/utils/loadingX";
import PrintSetting from "../home/components/PrintSetting";
import Breadnav from "@/components/Breadnav";
export default {
  name: "InvoiceInquiry",
  components: {
    InvoiceRepair,
    Listnodate,
    InvoicePreview,
    Breadnav,
    PrintSetting,
  },
  data() {
    return {
      taxDetail: {}, //发票预览传对象
      notUploadNum: 0, //未上传数目
      printType: null,
      printVisible: false, //发票弹框
      title: "发票查询",
      invoicePreviewVisible: false,
      invoicePreviewTitle: "查看发票",
      isElectronic: false,
      // taxPic: "",
      repairData: {
        invoiceTypeList: [],
        invoiceType: null,
      },
      formX: null,
      noDateFlag: "successNoDate",
      invoiceRepairVisibility: false, //发票修复弹框
      // inputValue: null, //传值
      ruleForm: {
        inputValue: null,
      },
      rules: {},
      invoiceType: null, //发票类型
      invoiceTypeList: [],
      invoiceStaus: null, //发票状态
      invoiceStausList: [
        { value: 0, label: "正数正常" },
        { value: 2, label: "正数作废" },
        { value: 1, label: "负数正常" },
        { value: 3, label: "负数作废" },
        { value: 4, label: "空白作废" },
      ],
      saleSingle: null, //销货清单
      saleSingleList: [
        { value: 1, label: "有销货清单" },
        { value: 0, label: "无销货清单" },
      ],
      applyTime: [], //开票时间
      tableData: [], //表格data
      multipleSelection: [], //选择的数据
      columns: [
        {
          id: 1,
          value: "invoiceType",
          label: "发票类型",
          key: "invoiceType",
          sortable: false,
          width: "180",
          fixed: false,
        },
        {
          id: 2,
          value: "invoiceDate",
          label: "开票时间",
          key: "invoiceDate",
          sortable: "custom",
          width: "180",
          fixed: false,
        },
        {
          id: 3,
          value: "invoiceCode",
          label: "发票代码",
          key: "invoiceCode",
          sortable: false,
          width: "180",
          fixed: false,
        },
        {
          id: 4,
          value: "invoiceNo",
          label: "发票号码",
          key: "invoiceNo",
          sortable: false,
          width: "180",
          fixed: false,
        },
        {
          id: 5,
          value: "buyerName",
          label: "购方名称",
          key: "buyerName",
          sortable: false,
          width: "180",
          fixed: false,
        },
        {
          id: 6,
          value: "mainProductName",
          label: "主要商品名称",
          key: "mainProductName",
          sortable: false,
          width: "180",
          fixed: false,
        },
        {
          id: 7,
          value: "totalPriceWithTax",
          label: "价税合计",
          key: "totalPriceWithTax",
          sortable: false,
          width: "180",
          fixed: false,
        },
        {
          id: 8,
          value: "kpr",
          label: "开票人",
          key: "kpr",
          sortable: false,
          width: "180",
          fixed: false,
        },
        {
          id: 9,
          value: "invoiceInvalidCategory",
          label: "发票状态",
          key: "invoiceInvalidCategory",
          sortable: false,
          width: "180",
          fixed: false,
        },
        // {
        //   id: 10,
        //   value: "uploadMarks",
        //   label: "上传状态",
        //   key: "uploadMarks",
        //   width: "120",
        //   sortable: false,
        // },
        {
          id: 10,
          value: "listingLabel",
          label: "销货清单",
          key: "listingLabel",
          sortable: false,
          width: "180",
          fixed: false,
        },
        {
          id: 11,
          value: "operationGod",
          label: "操作",
          key: "operationGod",
          sortable: false,
          width: "180",
          fixed: "right",
        },
      ],
      pageTotal: 0,
      query: {
        pageIndex: 1,
        pageSize: 10,
      },
      loading: false,
      taxDiskNum: "", //税盘号
      key1: [],
      key2: null,
      key3: [],
      keyX: [],

      printBOxList: [],
      printList: [], //打印list
      readyPrintVisable: false, //准备打印弹框
      readyPrintType: null,
      printTotalNum: 0, //打印的总数
      printInvoiceCode: null, //打印的发票代码
      printInvoiceStartNum: null, //打印的发票号码 开始
      printInvoiceEndNum: null, //打印的发票号码 结束
      percentage: 0, //正在打印百分比
      nowSuccessPrintNum: 0, //目前打印成功的数量
      nowPrintVisible: false, //打印进度
      // quitPrintVisible: false, //判断是否停止打印了

      continuePrint: true, //判断是否可以继续专票/普票打印打印
      continueOrderPrint: true, //判断是否可以继续清单打印

      printMode: true, //清单开票打印方式

      // continueBasePrintPp: true, //判断是否可以继续原生打印--电子普通发票
      // continueBasePrint: true, //判断是否可以继续原生打印--电子专用发票

      // 路由跳转数据
      routeList: "",
      timeDesc: "true",
      previewMode: "",
      taxDiskChannel: "",

      // 缓存 查询条件
      cacheInvoiceType: "",
      cacheInvoiceStaus: "",
      cacheInputValue: "",
      cacheSaleSingle: "",
      cacheApplyTime: [],
    };
  },
  created() {
    this.setApplyStartTime();
    this.setApplyEndTime();
  },
  mounted() {
    // 路由跳转数据
    // 闪电开票-复制 type='shandian-fuzhi'
    // 闪电开票-负数 type='shandian-fushu'
    // console.log(JSON.parse('777777',this.$route.query.List))
    this.routeList = this.$route.query.List
      ? JSON.parse(this.$route.query.List)
      : "";
    console.log(this.routeList);
    this.title = this.routeList.type ? "选择发票" : "发票查询";
    this.invoiceType = this.routeList.type
      ? this.routeList.data
      : this.invoiceType;

    this.taxDiskNum = this.$store.state.user.taxDiskNum;

    this.taxDiskChannel = this.$store.state.user.taxDiskInfo.taxDiskChannel;
    this.getBillType();
    this.getNotUploadNum();
    this.getData();
    this.getTaxDiskNumDatils();
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
        }
      },
      deep: true,
    },
  },
  methods: {
    getTaxDiskNumDatils() {
      var that = this;
      taxDiskNumDetailsApi(this.taxDiskNum)
        .then((res) => {
          if (res && res.code == "200") {
            that.previewMode = res.data.previewMode;
            if (res.data.printMode == "1") {
              that.printMode = true;
            } else if (res.data.printMode == "2") {
              that.printMode = false;
            }

            //  previewMode  ---发票预览code  1开具后预览发票2打印时预览发票
            // printMode ----清单开票打印 1全打模式2套打模式
          }
        })
        .catch((error) => {});
    },
    //发票查询 查看未上传的发票数目
    getNotUploadNum() {
      let applyParams = {
        taxDiskNum: this.taxDiskNum,
      };
      var that = this;
      getNotUploadNum(applyParams)
        .then((res) => {
          if (res && res.code == "200") {
            that.notUploadNum = res.data;
            // that.invoiceTypeList = UtilsGetTicketType(res.data.ticketType);
            // if (this.routeList.data) {
            //   this.invoiceType = this.routeList.data;
            // }
            // this.getData();
          }
        })
        .catch((error) => {});
    },
    // 返回
    clickLeft() {
      if (
        this.routeList.type == "shandian-fuzhi" ||
        this.routeList.type == "shandian-fushu"
      ) {
        this.$router.push({ name: "LightningInvoicing" });
      } else {
        this.$router.push({ name: "managementIndex" });
      }
    },
    // 判断是不是跨月
    isExtendMonth(val) {
      let date = new Date(val);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      // let day = date.getDate();

      let date2 = new Date();
      let year2 = date2.getFullYear();
      let month2 = date2.getMonth() + 1;

      if (year == year2) {
        if (month == month2) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    // 判断是不是次月
    isExtendMonth1(val) {
      let date = new Date(val);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      // let day = date.getDate();

      let date2 = new Date();
      let year2 = date2.getFullYear();
      let month2 = date2.getMonth() + 1;

      if (year == year2) {
        if (month == month2 - 1) {
          return true;
        } else {
          return false;
        }
      } else if (year < year2) {
        // return false;
        if (month == 12 && month2 == 1) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    //获取发票类型
    getBillType() {
      let applyParams = {
        taxDiskNum: this.taxDiskNum,
      };
      var that = this;
      getDiskTicketType(applyParams)
        .then((res) => {
          if (res && res.code == "200") {
            that.invoiceTypeList = UtilsGetTicketType(res.data.ticketType);
            if (that.routeList.type == "shandian-fushu") {
              that.invoiceTypeList.forEach((item, index) => {
                if (item.value == "004" || item.value == "028") {
                  that.invoiceTypeList.splice(index, 1);
                }
              });
            }
            if (that.routeList.data) {
              that.invoiceType = that.routeList.data;
            }
          }
        })
        .catch((error) => {});
    },
    //发票查询
    getData() {
      let applyParams = {
        invoiceType: this.invoiceType,
        invoiceInvalidCategory: this.invoiceStaus,
        keyword: this.ruleForm.inputValue,
        listingLabel: this.saleSingle,
        endDate: null,
        startDate: null,
        pageNum: this.query.pageIndex,
        pageSize: this.query.pageSize,
        taxDiskNum: this.taxDiskNum,
        timeDesc: this.timeDesc,
      };
      if (this.applyTime) {
        if (this.applyTime.length > 0) {
          applyParams.startDate = this.getLocalTime(this.applyTime[0]);
          applyParams.endDate = this.getLocalTime(this.applyTime[1]);
        }
      }
      var that = this;
      this.loading = true;
      InvoiceList(applyParams)
        .then((res) => {
          if (res && res.code == "200") {
            that.loading = false;
            that.tableData = res.data.records;
            that.query.pageIndex = res.data.current;
            that.pageTotal = res.data.total;
            that.query.pageSize = res.data.size;
            //缓存查询条件
            that.cacheInvoiceType = that.invoiceType;
            that.cacheInvoiceStaus = that.invoiceStaus;
            that.cacheInputValue = that.ruleForm.inputValue;
            that.cacheSaleSingle = that.saleSingle;
            that.cacheApplyTime = that.applyTime;
          }
        })
        .catch((error) => {
          that.loading = false;
          that.noDateFlag = "err";
        });
    },

    getDataX() {
      let applyParams = {
        invoiceType: this.cacheInvoiceType,
        invoiceInvalidCategory: this.cacheInvoiceStaus,
        keyword: this.cacheInputValue,
        listingLabel: this.cacheSaleSingle,
        endDate: null,
        startDate: null,
        pageNum: this.query.pageIndex,
        pageSize: this.query.pageSize,
        taxDiskNum: this.taxDiskNum,
        timeDesc: this.timeDesc,
      };
      if (this.cacheApplyTime) {
        if (this.cacheApplyTime.length > 0) {
          applyParams.startDate = this.getLocalTime(this.cacheApplyTime[0]);
          applyParams.endDate = this.getLocalTime(this.cacheApplyTime[1]);
        }
      }
      var that = this;
      this.loading = true;
      InvoiceList(applyParams)
        .then((res) => {
          if (res && res.code == "200") {
            that.loading = false;
            that.tableData = res.data.records;
            that.query.pageIndex = res.data.current;
            that.pageTotal = res.data.total;
            that.query.pageSize = res.data.size;
          }
        })
        .catch((error) => {
          that.loading = false;
          that.noDateFlag = "err";
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 导出
    handleExport() {
      if (this.multipleSelection.length > 0) {
        var list = [];
        this.multipleSelection.forEach((item) => {
          list.push(item.id);
        });
        let applyParams = {
          endDate: null,
          startDate: null,
          ids: list,
        };
        if (this.applyTime) {
          applyParams.startDate = this.getLocalTime(this.applyTime[0]);
          applyParams.endDate = this.getLocalTime(this.applyTime[1]);
        }
        var that = this;
        // this.loading = true;
        invoiceExport(applyParams)
          .then((res) => {
            if (res) {
              console.log("res", res);
              downloadFile(res);
              // that.loading = false;
            }
          })
          .catch((error) => {
            // that.loading = false;
            // that.noDateFlag = "err";
          });
      } else {
        this.$message({
          type: "warning",
          message: "未选中任何数据",
        });
      }
    },
    // 下载
    handleDownload() {
      if (this.multipleSelection.length > 0) {
        if (
          this.multipleSelection.every((item) => {
            return item.invoiceType == "026" || item.invoiceType == "028";
          }) == true
        ) {
          var list = [];
          this.multipleSelection.forEach((item) => {
            if(item.pdfUrl){
              list.push({
              buyerName: item.buyerName,
              invoiceSeries:item.invoiceSeries,
              url:"http://dzgc-files.oss-cn-hangzhou.aliyuncs.com/" + item.pdfUrl,
            });
            }else{
              list.push({
              buyerName: item.buyerName,
              invoiceSeries:item.invoiceSeries,
              url: item.pdfUrl,
            });
            }
          });
          var that = this;
          invoiceZipDownload(list)
            .then((res) => {
              if (res) {
                downloadFile1(res);
              }
            })
            .catch((error) => {
              // that.loading = false;
              // that.noDateFlag = "err";
            });
        } else {
          this.$message({
            type: "warning",
            message: "纸质发票不允许下载",
          });
        }
      } else {
        this.$message({
          type: "warning",
          message: "未选中任何数据",
        });
      }
    },
    // 上传
    handleUpload() {
      this.loading = true;
      // showFullScreenLoading("上传中,请稍候");
      clearTimeout(this.timer);
      this.$alert("", "上传中,请稍侯", {
        confirmButtonText: "停止上传",
        iconClass: "el-icon-loading",
        center: true,
        showClose: false,
        callback: (action) => {
          clearTimeout(this.timer);
          this.loading = false;
        },
      });
      this.invoiceUpload();
    },
    //上传
    async invoiceUpload() {
      var applyParams;
      if (this.invoiceType) {
        applyParams = {
          invoiceType: this.invoiceType,
          taxDiskNum: this.taxDiskNum,
        };
      } else {
        applyParams = {
          invoiceType: "",
          taxDiskNum: this.taxDiskNum,
        };
      }
      const res = await invoiceUploaded(applyParams);
      if (res.code == 200) {
        if (res.data.length > 0) {
          this.key1 = res.data;
          // this.getRedis1();
          this.setInter(3000, this.getRedis1);
        } else {
          this.loading = false;
          // tryHideFullScreenLoading();
          this.$globals.closeContent();
          this.$message({
            type: "error",
            message: "上传失败",
          });
        }
      } else {
        this.loading = false;
        // tryHideFullScreenLoading();
        this.$globals.closeContent();
        // this.$message({
        //   type: "warning",
        //   message: res.msg,
        // });
      }
    },

    //创建180秒定时任务，每3秒查询一次
    //每5秒执行一次查询
    setInter(s, fn) {
      let count = 0;
      let timeOut = (s, fn) => {
        var time1 = setTimeout(() => {
          count++;
          if (count < 60 && this.loading == true) {
            fn.call(this);
            timeOut(s, fn);
          } else if (count >= 60) {
            clearTimeout(this.timer);
            // tryHideFullScreenLoading();
            this.$globals.closeContent();
            // this.loading = false;
            this.$message({
              type: "error",
              message: "税局服务不稳定，请稍后再试",
            });
          } else {
            clearTimeout(this.timer);
            // tryHideFullScreenLoading();
            this.$globals.closeContent();
            // this.loading = false;
          }
        }, s);
        this.timer = time1;
      };
      timeOut(s, fn);
    },
    //查询请求
    async getRedis1() {
      const res = await getRedisList(this.key1);
      if (res.data) {
        if (res.data.code == 1) {
          clearTimeout(this.timer);
          if (res.data.msgCode == 200) {
            this.loading = false;
            // tryHideFullScreenLoading();
            // this.getData();
            this.$message({
              type: "success",
              message: "上传成功",
            });
            this.$globals.closeContent();
            this.$alert("", "同步中,请稍侯", {
              confirmButtonText: "停止同步",
              iconClass: "el-icon-loading",
              center: true,
              showClose: false,
              callback: (action) => {
                clearTimeout(this.timer);
                this.loading = false;
              },
            });
            this.invoiceNotUploaded();
          } else {
            this.loading = false;
            this.$globals.closeContent();
            this.$alert("", "同步中,请稍侯", {
              confirmButtonText: "停止同步",
              iconClass: "el-icon-loading",
              center: true,
              showClose: false,
              callback: (action) => {
                clearTimeout(this.timer);
                this.loading = false;
              },
            });
            this.invoiceNotUploaded();
            // tryHideFullScreenLoading();
            // this.getData();
            this.$message({
              type: "error",
              message: res.data.message,
            });
          }
        } else {
          this.loading = true;
        }
      } else {
        this.loading = true;
      }
    },

    //未上传  同步
    async invoiceNotUploaded() {
      var applyParams;
      if (this.invoiceType) {
        applyParams = {
          invoiceType: this.invoiceType,
          taxDiskNum: this.taxDiskNum,
        };
      } else {
        applyParams = {
          invoiceType: "",
          taxDiskNum: this.taxDiskNum,
        };
      }
      
      const res = await invoiceNotUploaded(applyParams);
      if (res.code == 200) {
        if (res.data.length > 0) {
          this.keyX = res.data;
          // this.getRedisX();
          this.loading=true;
          this.setInterX(3000, this.getRedisX);
        } else {
          this.loading = false;
          // tryHideFullScreenLoading();
          this.$globals.closeContent();
          // this.$message({
          //   type: "error",
          //   message: "上传失败",
          // });
        }
      } else {
        this.loading = false;
        // tryHideFullScreenLoading();
        this.$globals.closeContent();
        // this.$message({
        //   type: "error",
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
          } else if (count >= 60) {
            clearTimeout(this.timer);
            // tryHideFullScreenLoading();
            this.$globals.closeContent();
            // this.loading = false;
            this.$message({
              type: "error",
              message: "税局服务不稳定，请稍后再试",
            });
          } else {
            clearTimeout(this.timer);
            // tryHideFullScreenLoading();
            this.$globals.closeContent();
            // this.loading = false;
          }
        }, s);
        this.timer = time1;
      };
      timeOut(s, fn);
    },
    //查询请求
    async getRedisX() {
      const res = await getRedisList2(this.keyX);
      if (res.data) {
        if (res.data.code == 1) {
          clearTimeout(this.timer);
          if (res.data.msgCode == 200) {
            this.loading = false;
            // tryHideFullScreenLoading();
            this.getData();
            this.getNotUploadNum();
            this.$globals.closeContent();
            this.$message({
              type: "success",
              message: "同步成功",
            });
          } else {
            this.loading = false;
            this.getData();
            this.getNotUploadNum();
            // tryHideFullScreenLoading();
            this.$globals.closeContent();
            this.$message({
              type: "error",
              message: res.data.message,
            });
          }
        } else {
          this.loading = true;
        }
      } else {
        this.loading = true;
      }
    },

    // 模糊查询
    handleSearch() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.query.pageIndex = 1;
          this.query.pageSize = 10;
          this.invoiceType = null;
          this.invoiceStaus = null;
          this.saleSingle = null;
          this.getData();
        }
      });
    },
    //精确查询
    handleQuery() {
      this.$refs.ruleForm.resetFields();
      this.query.pageIndex = 1;
      this.query.pageSize = 10;
      this.ruleForm.inputValue = null;
      this.getData();
    },
    // 表格选择的数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.query.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.query.pageIndex = val;
      this.getDataX();
    },
    // 排序
    handleSortChange(val) {
      if (val.order == "descending") {
        this.timeDesc = true;
      } else if (val.order == "ascending") {
        this.timeDesc = false;
      } else {
        this.timeDesc = null;
      }
      this.getData();
    },
    //列表中查看
    handleSingleLook(index, row) {
      console.log(row);
      this.invoicePreviewVisible = true;
      this.taxDetail = row;
    },
    //列表中的作废
    handleSingleVoid(index, row) {
      this.$confirm("一旦作废无法恢复，你确认作废吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading = true;
          // showFullScreenLoading("作废中,请稍候");
          clearTimeout(this.timer);
          this.$alert("", "作废中,请稍候", {
            confirmButtonText: "停止作废",
            iconClass: "el-icon-loading",
            center: true,
            showClose: false,
            callback: (action) => {
              clearTimeout(this.timer);
              this.loading = false;
            },
          });
          this.invoiceVoid(row);
        })
        .catch(() => {
          // this.$message.info("已取消删除");
        });
    },
    async invoiceVoid(row) {
      // console.log('this.$store',this.$store.state.user)
      const res = await invoiceAbolish({
        invalidPerson: this.$store.state.user.loginInfo.companyUser.nickName, //作废人
        invalidType: "1", //作废类型
        invoiceCode: row.invoiceCode,
        invoiceNo: row.invoiceNo,
        invoiceType: row.invoiceType,
        taxDiskNum: this.taxDiskNum,
        priceAmount: row.totalAmount, // 合计金额
      });
      if (res.code == 200) {
        if (res.data) {
          this.key2 = res.data;
          // this.getRedis2();
          this.setInter2(3000, this.getRedis2);
        } else {
          this.loading = false;
          // tryHideFullScreenLoading();
          this.$globals.closeContent();
          this.$message({
            type: "error",
            message: "作废失败",
          });
        }
      } else {
        this.loading = false;
        // tryHideFullScreenLoading();
        this.$globals.closeContent();
        // this.$message({
        //   type: "warning",
        //   message: res.msg,
        // });
      }
    },
    setInter2(s, fn) {
      let count = 0;
      let timeOut = (s, fn) => {
        var time1 = setTimeout(() => {
          count++;
          if (count < 60 && this.loading == true) {
            fn.call(this);
            timeOut(s, fn);
          } else if (count >= 60) {
            clearTimeout(this.timer);
            // tryHideFullScreenLoading();
            this.$globals.closeContent();
            // this.loading = false;
            this.$message({
              type: "error",
              message: "税局服务不稳定，请稍后再试",
            });
          } else {
            clearTimeout(this.timer);
            // tryHideFullScreenLoading();
            this.$globals.closeContent();
            // this.loading = false;
          }
        }, s);
        this.timer = time1;
      };
      timeOut(s, fn);
    },
    //查询请求
    async getRedis2() {
      // console.log(this.key2);
      const res = await getRedis({ key: this.key2 });
      if (res.data) {
        if (res.data.code == 1) {
          clearTimeout(this.timer);
          if (res.data.msgCode == 200) {
            // tryHideFullScreenLoading();
            this.$globals.closeContent();
            this.loading = false;
            this.getData();
            this.$message({
              type: "success",
              message: "作废成功",
            });
          } else {
            // tryHideFullScreenLoading();
            this.$globals.closeContent();
            this.loading = false;
            this.getData();
            this.$message({
              type: "error",
              message: res.data.message,
            });
          }
        } else {
          this.loading = true;
        }
      } else {
        this.loading = true;
      }
    },
    // 双击选择
    selectDbClick(row) {
      console.log(row);
      if (
        (row.invoiceCategory == "1" && row.invoiceInvalidType == "1") ||
        (row.invoiceCategory == "1" && row.invoiceInvalidType == "0") ||
        row.invoiceCategory == "2" ||
        (this.routeList.type == "shandian-fushu" &&
          (row.invoiceType == "004" || row.invoiceType == "028")) ||
        (this.routeList.type == "shandian-fushu" &&
          row.invoiceCategory == "0" &&
          row.invoiceInvalidType == "1") ||
        (this.routeList.type == "shandian-fushu" && row.invoiceRedStatus == "1")
      ) {
        return;
      } else {
        if (this.routeList.type == "shandian-fuzhi") {
          this.$router.push({
            path: "/lightningInvoicing",
            query: {
              List: JSON.stringify({
                data: row,
                type: "fapiaochaxun-fuzhi",
              }),
            },
          });
        } else if (this.routeList.type == "shandian-fushu") {
          this.$router.push({
            path: "/lightningInvoicing",
            query: {
              List: JSON.stringify({
                data: row,
                type: "fapiaochaxun-fushu",
              }),
            },
          });
        } else {
          return;
        }
      }
    },
    //列表中的红冲
    handelSingleRevoke(index, row) {
      console.log(row);
      if (this.routeList.type == "shandian-fuzhi") {
        this.$router.push({
          path: "/lightningInvoicing",
          query: {
            List: JSON.stringify({
              data: row,
              type: "fapiaochaxun-fuzhi",
            }),
          },
        });
      } else if (this.routeList.type == "shandian-fushu") {
        this.$router.push({
          path: "/lightningInvoicing",
          query: {
            List: JSON.stringify({
              data: row,
              type: "fapiaochaxun-fushu",
            }),
          },
        });
      } else {
        if (row.invoiceType == "004" || row.invoiceType == "028") {
          // 专票 跳 红字信息表
          let data = {
            // applyType: this.applyType,
            // radio: this.radio,
            // ruleForm: this.ruleForm,
            row: row,
            type: "fapiaochaxun",
          };
          this.$router.push({
            path: "/management/invoicingManagement/redApply",
            query: {
              data: JSON.stringify(data),
            },
          });
        } else {
          this.$router.push({
            path: "/lightningInvoicing",
            query: {
              List: JSON.stringify({
                data: row,
                type: "fapiaochaxun-hongchong",
              }),
            },
          });
        }
      }
    },
    //修复
    handleRepair() {
      this.invoiceRepairVisibility = true;
      this.repairData.invoiceTypeList = this.invoiceTypeList;
      this.repairData.invoiceType = this.invoiceType;
    },
    getForm(formData) {
      if (formData) {
        this.invoiceRepairVisibility = false;
        this.loading = true;
        // showFullScreenLoading("修复中,请稍后");
        clearTimeout(this.timer);
        this.$alert("", "修复中,请稍候", {
          confirmButtonText: "停止修复",
          iconClass: "el-icon-loading",
          center: true,
          showClose: false,
          callback: (action) => {
            clearTimeout(this.timer);
            this.loading = false;
          },
        });
        this.invoiceRepaired(
          formData.form,
          formData.type,
          formData.isOnlineGolden
        );
      }
    },
    async invoiceRepaired(form, type, isOnlineGolden) {
      let applyParams = {
        queryType: form.radio,
        queryConditions: "", //queryType为0：发票代码+发票起始号码+发票终止号码;queryType为1：起始日期+终止日期 yyyyMMddyyyyMMdd
        invoiceType: type,
        taxDiskNum: this.taxDiskNum,
        taxDiskChannel: this.taxDiskChannel,
      };
      if (form.radio == "1" && isOnlineGolden == false) {
        let date = new Date(form.startTime);
        let year1 = date.getFullYear();
        let month1 = date.getMonth() + 1;
        let day1 = date.getDate();
        month1 = month1 < 10 ? "0" + month1 : month1;
        day1 = day1 < 10 ? "0" + day1 : day1;
        let date2 = new Date(form.dateTime);
        let year2 = date2.getFullYear();
        let month2 = date2.getMonth() + 1;
        let day2 = date2.getDate();
        month2 = month2 < 10 ? "0" + month2 : month2;
        day2 = day2 < 10 ? "0" + day2 : day2;
        applyParams.queryConditions =
          year1.toString() +
          month1.toString() +
          day1.toString() +
          year2.toString() +
          month2.toString() +
          day2.toString();
      } else if (form.radio == "1" && isOnlineGolden == true) {
        let date = new Date(form.monthTime);
        let year1 = date.getFullYear();
        let month1 = date.getMonth() + 1;
        month1 = month1 < 10 ? "0" + month1 : month1;
        applyParams.queryConditions = year1.toString() + month1.toString();
      } else if (form.radio == "0") {
        applyParams.queryConditions =
          form.number.toString() +
          form.beginNumber.toString() +
          form.endNumber.toString();
      }
      const res = await invoiceRepair(applyParams);
      if (res.code == 200) {
        if (res.data) {
          this.key3 = res.data;
          // this.getRedis3();
          this.setInter3(3000, this.getRedis3);
        } else {
          this.loading = false;
          // tryHideFullScreenLoading();
          this.$globals.closeContent();
          this.$message({
            type: "error",
            message: "修复失败",
          });
        }
      } else {
        this.loading = false;
        // tryHideFullScreenLoading();
        this.$globals.closeContent();
        // this.$message({
        //   type: "warning",
        //   message: res.msg,
        // });
      }
    },
    setInter3(s, fn) {
      let count = 0;
      let timeOut = (s, fn) => {
        var time1 = setTimeout(() => {
          count++;
          if (count < 60 && this.loading == true) {
            fn.call(this);
            timeOut(s, fn);
          } else if (count >= 60) {
            clearTimeout(this.timer);
            // tryHideFullScreenLoading();
            this.$globals.closeContent();
            // this.loading = false;
            this.$message({
              type: "error",
              message: "税局服务不稳定，请稍后再试",
            });
          } else {
            clearTimeout(this.timer);
            // tryHideFullScreenLoading();
            this.$globals.closeContent();
            // this.loading = false;
          }
        }, s);
        this.timer = time1;
      };
      timeOut(s, fn);
    },
    //查询请求
    async getRedis3() {
      const res = await getRedisList(this.key3);
      if (res.data) {
        if (res.data.code == 1) {
          clearTimeout(this.timer);
          if (res.data.msgCode == 200) {
            // tryHideFullScreenLoading();
            this.$globals.closeContent();
            this.loading = false;
            this.getData();
            this.$message({
              type: "success",
              message: "修复成功",
            });
          } else {
            // tryHideFullScreenLoading();
            this.$globals.closeContent();
            this.loading = false;
            this.getData();
            this.$message({
              type: "error",
              message: res.data.message,
            });
          }
        } else {
          this.loading = true;
        }
      } else {
        this.loading = true;
      }
    },
    //设置日期 默认选中当月1号-当日
    setApplyStartTime() {
      var date = new Date();
      date.setDate(1);
      var month = parseInt(date.getMonth() + 1);
      var day = date.getDate();
      if (month < 10) month = "0" + month;
      if (day < 10) day = "0" + day;
      var a = date.getFullYear() + "-" + month + "-" + day;
      this.applyTime.push(a);
    },
    setApplyEndTime() {
      var date = new Date();
      var month = parseInt(date.getMonth() + 1);
      var day = date.getDate();
      if (month < 10) month = "0" + month;
      if (day < 10) day = "0" + day;
      var b = date.getFullYear() + "-" + month + "-" + day;
      this.applyTime.push(b);
    },

    //日期超过90天自动通知
    open1() {
      const h = this.$createElement;
      this.$notify({
        title: "提醒",
        message: h(
          "i",
          {
            style: "color: teal",
          },
          "修复期间过长有可能导致修复时间过长或修复失败，建议不超过90天！"
        ),
      });
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

    // 专票/普票打印  -接口调用
    invoiceOrdinaryPrint(data, type) {
      // console.log(data, type);
      var that = this;
      console.log(12);
      if (type == "cefSharpinit_zp") {
        console.log(data);
        if (data.length > 0) {
          console.log(34);
          //  let cefSharpinit_zpData=localStorage.getItem("cefSharpinit_zp")?JSON.parse(localStorage.getItem("cefSharpinit_zp")):{printName:'',offsetX:'',offsetY}
          //  let cefSharpinit_zpData={printName:'',offsetX:'',offsetY}
          let applyParams = {
            printer: {
              printName: JSON.parse(localStorage.getItem("cefSharpinit_zp"))
                .printName, //打印机名称
              offsetX: JSON.parse(localStorage.getItem("cefSharpinit_zp"))
                .offsetX, //x轴偏移量
              offsetY: JSON.parse(localStorage.getItem("cefSharpinit_zp"))
                .offsetY, //y轴偏移量
            }, //打印机
            invoice: data[0],
            timeout: 180000, //超时时间
          };
          console.log(34);
          invoicePrint(applyParams)
            .then((res) => {
              if (res && res.code == "0") {
                // that.continuePrint = true;
                that.nowSuccessPrintNum += 1;
                that.percentage = parseInt(
                  (that.nowSuccessPrintNum / that.printTotalNum) * 100
                );
                if (that.continuePrint == true) {
                  data.splice(0, 1);
                  that.invoiceOrdinaryPrint(
                    that.printBOxList,
                    "cefSharpinit_zp"
                  );
                  if (that.nowSuccessPrintNum == that.printTotalNum) {
                    // that.continuePrint = false;
                    that.nowPrintVisible = false;
                    that.$alert(
                      `本次共打印${that.printTotalNum}张发票`,
                      "打印成功",
                      {
                        confirmButtonText: "确定",
                        type: "success",
                        center: true,
                      }
                    );
                    // --------------打印成功
                  }
                } else {
                  // that.continuePrint = false;
                  that.nowPrintVisible = false;
                  that.$alert(
                    `本次共开具${that.nowSuccessPrintNum}张发票，可至发票查询中查看发票`,
                    "开票成功！",
                    {
                      confirmButtonText: "确定",
                      type: "success",
                      center: true,
                    }
                  );
                }
              } else {
                that.continuePrint = false;
                that.nowPrintVisible = false;
                this.$message({
                  type: "error",
                  message: res.message,
                });
                return;
              }
            })
            .catch((error) => {});
        } else {
          return;
        }
      } else if (type == "cefSharpinit_pp") {
        if (data.length !== 0) {
          //let cefSharpinit_ppData=localStorage.getItem("cefSharpinit_pp")?JSON.parse(localStorage.getItem("cefSharpinit_pp")):{printName:'',offsetX:'',offsetY:''}
          // let cefSharpinit_ppData={printName:'',offsetX:'',offsetY:''}
          let applyParams = {
            printer: {
              printName: JSON.parse(localStorage.getItem("cefSharpinit_pp"))
                .printName, //打印机名称
              offsetX: JSON.parse(localStorage.getItem("cefSharpinit_pp"))
                .offsetX, //x轴偏移量
              offsetY: JSON.parse(localStorage.getItem("cefSharpinit_pp"))
                .offsetY, //y轴偏移量
            }, //打印机
            invoice: data[0],
            timeout: 180000, //超时时间
          };
          invoicePrint(applyParams)
            .then((res) => {
              if (res && res.code == "0") {
                // that.continuePrint = true;
                that.nowSuccessPrintNum += 1;
                that.percentage = parseInt(
                  (that.nowSuccessPrintNum / that.printTotalNum) * 100
                );
                if (that.continuePrint == true) {
                  data.splice(0, 1);
                  that.invoiceOrdinaryPrint(
                    that.printBOxList,
                    "cefSharpinit_pp"
                  );
                  if (that.nowSuccessPrintNum == that.printTotalNum) {
                    // that.continuePrint = false;
                    that.nowPrintVisible = false;
                    that.$alert(
                      `本次共打印${that.printTotalNum}张发票`,
                      "打印成功",
                      {
                        confirmButtonText: "确定",
                        type: "success",
                        center: true,
                      }
                    );
                    // --------------打印成功
                  }
                } else {
                  // that.continuePrint = false;
                  that.nowPrintVisible = false;
                  that.$alert(
                    `本次共开具${that.nowSuccessPrintNum}张发票，可至发票查询中查看发票`,
                    "开票成功！",
                    {
                      confirmButtonText: "确定",
                      type: "success",
                      center: true,
                    }
                  );
                }
              } else {
                that.continuePrint = false;
                that.nowPrintVisible = false;
                this.$message({
                  type: "error",
                  message: res.message,
                });
                return;
              }
            })
            .catch((error) => {});
        } else {
          return;
        }
      }
    },
    // 通过发票号码进行排序
    compare(property) {
      return function (a, b) {
        return parseFloat(a[property]) - parseFloat(b[property]);
      };
    },

    // beforeClose() {
    //   // this.continuePrint = false;
    //   // this.nowPrintVisible = false;
    // },

    // 停止打印
    quitPrint() {
      // this.quitPrintVisible = true; //---判断是否停止打印了
      this.continuePrint = false;
      this.nowPrintVisible = false;
    },

    //准备打印取消
    readyPrintCancel() {
      this.readyPrintVisable = false;
      this.continuePrint = false;
      this.printList = [];
      this.printTotalNum = 0;
      this.printInvoiceCode = null;
      this.printInvoiceStartNum = null;
      this.printInvoiceEndNum = null;
      this.percentage = 0;
      this.nowSuccessPrintNum = 0;
    },

    //准备打印确认
    readyPrintConfirm() {
      this.readyPrintVisable = false;
      if (this.readyPrintType == "cefSharpinit_zp") {
        if (localStorage.getItem("cefSharpinit_zp") && JSON.parse(localStorage.getItem("cefSharpinit_zp")).printName == '') {
          var idList = [];
          var that = this;
          this.printList.forEach((item) => {
            idList.push(item.id);
          });
          getPrintInfo(idList)
            .then((res) => {
              if (res && res.code == "200") {
                that.nowPrintVisible = true;
                that.continuePrint = true;
                that.printBOxList = res.data;
                that.nowSuccessPrintNum = 0;
                that.percentage = 0;
                that.invoiceOrdinaryPrint(that.printBOxList, "cefSharpinit_zp");
              } else {
                that.continuePrint = false;
                // that.$message({
                //   type: "warning",
                //   message: res.msg,
                // });
              }
            })
            .catch((error) => {});
        } else {
          this.$confirm("找不到打印机,请先进行打印机设置", "提示", {
            confirmButtonText: "去设置",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.printVisible = true;
              this.printType = "cefSharpinit_zp";
            })
            .catch(() => {});
        }
      } else if (this.readyPrintType == "cefSharpinit_pp") {
        if (localStorage.getItem("cefSharpinit_pp") && JSON.parse(localStorage.getItem("cefSharpinit_pp")).printName == '') {
          var idList = [];
          var that = this;
          this.printList.forEach((item) => {
            idList.push(item.id);
          });
          getPrintInfo(idList)
            .then((res) => {
              if (res && res.code == "200") {
                that.nowPrintVisible = true;
                that.continuePrint = true;
                that.printBOxList = res.data;
                that.nowSuccessPrintNum = 0;
                that.percentage = 0;
                that.invoiceOrdinaryPrint(that.printBOxList, "cefSharpinit_pp");
              } else {
                that.continuePrint = false;
                // that.$message({
                //   type: "warning",
                //   message: res.msg,
                // });
              }
            })
            .catch((error) => {});
          // }
        } else {
          this.$confirm("找不到打印机,请先进行打印机设置", "提示", {
            confirmButtonText: "去设置",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.printVisible = true;
              this.printType = "cefSharpinit_pp";
            })
            .catch(() => {});
        }
      }
    },

    // 批量打印
    handlePrint() {
      // 004 增值税专用票     007 增值税普通发票   需要判断打印机   客户段打印---调接口 就可以            028  电子专用发票  026   电子普通发票   原生打印-----这里数据里面有pdf地址   不需要判断打印机              025  卷式发票    005 机动车销售统一发票

      // cefSharpinit_zp  专票打印机
      // cefSharpinit_pp  普票打印机
      // cefSharpinit_qd  清单打印机

      // cefSharpinit_jdc  机动车打印机

      // console.log(this.multipleSelection.sort(this.compare("invoiceNo"))); //--------按照发票号码  进行排序

      if (this.multipleSelection.length > 0) {
        if (
          this.multipleSelection.every((item) => {
            return item.invoiceType == "004";
          }) == true // --------------判断是不是相同类型  -----增值税专用票
        ) {
          var a = this.multipleSelection[0].invoiceCode;
          if (
            this.multipleSelection.every((item) => {
              return item.invoiceCode == a;
            }) == true // --------------判断发票代码是不是相同
          ) {
            if (this.multipleSelection.length > 1) {
              var b = this.multipleSelection.sort(this.compare("invoiceNo")); //--排序
              var c;
              for (var i = 0; i < b.length - 1; i++) {
                //----------判断发票号码是不是连续
                if (
                  Math.abs(
                    parseFloat(b[i].invoiceNo) - parseFloat(b[i + 1].invoiceNo)
                  ) == 1
                ) {
                  c = 1;
                } else {
                  c = 0;
                  this.$message({
                    type: "warning",
                    message: "发票号码不连续，请检查后重试！",
                  });
                  return;
                }
              }
              if (c == 1) {
                this.printList = this.multipleSelection.sort(
                  this.compare("invoiceNo")
                );
                this.printTotalNum = this.printList.length;
                this.printInvoiceCode = this.printList[0].invoiceCode;
                this.printInvoiceStartNum = this.printList[0].invoiceNo;
                this.printInvoiceEndNum =
                  this.printList[this.printList.length - 1].invoiceNo;
                this.readyPrintVisable = true;
                this.readyPrintType = "cefSharpinit_zp";
              }
            } else {
              if (this.previewMode == "2") {
                this.invoicePreviewVisible = true;
                this.taxDetail = this.multipleSelection[0];
              } else {
                this.printList = this.multipleSelection.sort(
                  this.compare("invoiceNo")
                );
                this.printTotalNum = this.printList.length;
                this.printInvoiceCode = this.printList[0].invoiceCode;
                this.printInvoiceStartNum = this.printList[0].invoiceNo;
                this.printInvoiceEndNum =
                  this.printList[this.printList.length - 1].invoiceNo;
                this.readyPrintVisable = true;
                this.readyPrintType = "cefSharpinit_zp";
              }
            }
          } else {
            this.$message({
              type: "warning",
              message: "发票代码不同，请选择同一发票代码后重试！",
            });
          }
        } else if (
          this.multipleSelection.every((item) => {
            return item.invoiceType == "007";
          }) == true
        ) {
          var d = this.multipleSelection[0].invoiceCode;
          if (
            this.multipleSelection.every((item) => {
              return item.invoiceCode == d;
            }) == true // --------------判断发票代码是不是相同
          ) {
            if (this.multipleSelection.length > 1) {
              var e = this.multipleSelection.sort(this.compare("invoiceNo")); //--排序
              var f;
              for (var i = 0; i < e.length - 1; i++) {
                //----------判断发票号码是不是连续
                if (
                  Math.abs(
                    parseFloat(e[i].invoiceNo) - parseFloat(e[i + 1].invoiceNo)
                  ) == 1
                ) {
                  f = 1;
                } else {
                  f = 0;
                  this.$message({
                    type: "warning",
                    message: "发票号码不连续，请检查后重试！",
                  });
                  return;
                }
              }
              if (f == 1) {
                this.printList = this.multipleSelection.sort(
                  this.compare("invoiceNo")
                );
                this.printTotalNum = this.printList.length;
                this.printInvoiceCode = this.printList[0].invoiceCode;
                this.printInvoiceStartNum = this.printList[0].invoiceNo;
                this.printInvoiceEndNum =
                  this.printList[this.printList.length - 1].invoiceNo;
                this.readyPrintVisable = true;
                this.readyPrintType = "cefSharpinit_pp";
              }
            } else {
              if (this.previewMode == "2") {
                this.invoicePreviewVisible = true;
                this.taxDetail = this.multipleSelection[0];
              } else {
                this.printList = this.multipleSelection.sort(
                  this.compare("invoiceNo")
                );
                this.printTotalNum = this.printList.length;
                this.printInvoiceCode = this.printList[0].invoiceCode;
                this.printInvoiceStartNum = this.printList[0].invoiceNo;
                this.printInvoiceEndNum =
                  this.printList[this.printList.length - 1].invoiceNo;
                this.readyPrintVisable = true;
                this.readyPrintType = "cefSharpinit_pp";
              }
            }
          } else {
            this.$message({
              type: "warning",
              message: "发票代码不同，请选择同一发票代码后重试！",
            });
          }
        } else if (
          this.multipleSelection.every((item) => {
            return item.invoiceType == "028";
          }) == true
        ) {
          this.$message({
            type: "warning",
            message: "电子发票不支持打印，请下载后自行打印！",
          });
        } else if (
          this.multipleSelection.every((item) => {
            return item.invoiceType == "026";
          }) == true
        ) {
          this.$message({
            type: "warning",
            message: "电子发票不支持打印，请下载后自行打印！",
          });
        } else if (
          this.multipleSelection.every((item) => {
            return item.invoiceType == "025";
          }) == true
        ) {
          this.$message({
            type: "warning",
            message: "暂时不支持打印该类型的发票",
          });
        } else if (
          this.multipleSelection.every((item) => {
            return item.invoiceType == "005";
          }) == true
        ) {
          this.$message({
            type: "warning",
            message: "暂时不支持打印该类型的发票",
          });
        } else {
          this.$message({
            type: "warning",
            message: "不支持同时打印多种类型的发票，请选择同一发票类型后重试",
          });
        }
      } else {
        this.$message({
          type: "warning",
          message: "未选中任何数据",
        });
      }
    },

    // 清单打印
    orderPrint() {
      //必须选择 所有都是有销货清单的数据 进行打印  否则 提示
      // ------判断有没有设置打印机
      //  客户端打印  ---调接口

      if (this.multipleSelection.length > 0) {
        if (
          this.multipleSelection.every((item) => {
            return item.listingLabel == "1";
          }) == true
        ) {
          if (localStorage.getItem("cefSharpinit_qd") && JSON.parse(localStorage.getItem("cefSharpinit_qd")).printName !== '') {
            var idList = [];
            var that = this;
            this.multipleSelection.forEach((item) => {
              idList.push(item.id);
            });
            // let applyParams={
            //   invoiceIds:idList,
            // }
            getListingPrintInfo(idList)
              .then((res) => {
                if (res && res.code == "200") {
                  that.invoiceOrderPrint(res.data);
                } else {
                  // that.$message({
                  //   type: "warning",
                  //   message: res.msg,
                  // });
                }
              })
              .catch((error) => {});
          } else {
            this.$confirm("找不到打印机,请先进行打印机设置", "提示", {
              confirmButtonText: "去设置",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.printVisible = true;
                this.printType = "cefSharpinit_qd";
              })
              .catch(() => {});
          }
        } else {
          this.$message({
            type: "warning",
            message: "请选择有销货清单的数据进行打印",
          });
        }
      } else {
        this.$message({
          type: "warning",
          message: "未选中任何数据",
        });
      }
    },

    // 清单打印---接口调用
    invoiceOrderPrint(data) {
      let applyParams = {
        printer: {
          printName: JSON.parse(localStorage.getItem("cefSharpinit_qd"))
            .printName, //打印机名称
          offsetX: JSON.parse(localStorage.getItem("cefSharpinit_qd")).offsetX, //x轴偏移量
          offsetY: JSON.parse(localStorage.getItem("cefSharpinit_qd")).offsetY, //y轴偏移量
        }, //打印机
        goodsDetailArray: data,
        printTable: this.printMode, //是否打印表格（true表示打印表格，即全打；false表示不打印表格，即套打）
      };
      invoiceOrderPrint(applyParams)
        .then((res) => {
          if (res && res.code == "0") {
            console.log(res);
            that.$message({
              type: "success",
              message: "清单打印成功",
            });
          } else {
            this.$message({
              type: "error",
              message: res.message,
            });
          }
        })
        .catch((error) => {});
    },
  },
};
</script>

<style scoped>
.el-form-item {
  margin-bottom: 15px;
}
.page-container {
  background: white;
  padding: 0;
}
.page-container >>> .cell {
  cursor: pointer;
}
.page-header {
  padding: 15px 25px 25px 25px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 64px;
  border-bottom: 1px solid #ececec;
}

.page-filters {
  margin-top: 20px;
  display: flex;
  padding: 0px 25px 0px 25px;
  flex: 1;
}
.listContent {
  padding: 0px 25px 10px 25px;
}

.fpinput {
  margin-top: 30px;
}

.repair {
  position: relative;
  left: 805px;
}

.query {
  float: left;
  margin-left: 200px;
}

.el-table .cell {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
  width: 312px !important;
}

.el-col-1 {
  width: 2%;
}

.export {
  margin-left: 200px;
}

.rightNav {
  display: inline-block;
  cursor: pointer;
  margin-right: 15px;
}
.navImg {
  width: 24px;
  vertical-align: sub;
  position: relative;
  top: 4px;
}
.navTex {
  font-size: 14px;
  color: #000000;
}
.serachBox {
  display: inline-block;
  position: relative;
  top: 2px;
  left: 30px;
}

.serachBox >>> .el-form {
  position: relative;
  /* top: 15px; */
}
.serachBox >>> .el-form-item__error {
  top: 75%;
}
.paginBox {
  padding-bottom: 20px;
  padding-right: 25px;
  text-align: right;
}

.page-filters {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  flex: 1;
}

.page-container >>> .el-dialog__wrapper .el-dialog {
  margin-top: 10vh !important;
}
.breadNav {
  display: inline-block;
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  color: #252525;
}
.navText {
  margin-left: 6px;
}
/* 
@media screen and (max-width: 1185px){
  .listContent .tableBox >>> .el-table{
  font-size:1.5vh
}
} */
</style>
