<template>
  <div class="page-container">
    <div class="page-header">
      <div>
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
                :validate-event="false"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="fuzzySearch()"
                  >搜索</el-button
                >
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="rightNavBox">
        <div class="rightNav" @click="handelExport()">
          <img
            src="../../assets/images/exportX2.png"
            alt="图片"
            class="navImg"
          />
          <span class="navTex">导出</span>
        </div>

        <div class="rightNav" @click="handelDelete()">
          <img
            src="../../assets/images/deleteX2.png"
            alt="图片"
            class="navImg"
          />
          <span class="navTex">删除</span>
        </div>

        <el-button size="mini" type="primary" @click="handlekp()"
          >开票</el-button
        >
      </div>
    </div>
    <div class="page-filters">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="发票类型：">
          <el-select size="small" v-model="invoiceType" placeholder="请选择">
            <el-option label="全部发票" :value="null"></el-option>
            <el-option
              v-for="status in invoiceTypeList"
              :key="status.id"
              :label="status.label"
              :value="status.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请来源：">
          <el-select size="small" v-model="applySource" placeholder="请选择">
            <el-option
              v-for="status in applySourceList"
              :key="status.id"
              :label="status.label"
              :value="status.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开票状态：">
          <el-select size="small" v-model="billStatus" placeholder="请选择">
            <el-option
              v-for="status in billStatusList"
              :key="status.id"
              :label="status.label"
              :value="status.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="handleSearch()"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div style="color: #5e8cf9; margin-left: 25px">
      <!-- <span>待开增值税专用发票号码：111111</span> -->
      <span v-show="num1" style="margin-bottom: 15px"
        >待开增值税专用发票号码：{{ num1 }}</span
      >
      <span v-show="num2" style="margin-left: 50px; margin-bottom: 15px"
        >待开增值税普通发票号码：{{ num2 }}</span
      >
      <span v-show="num3" style="margin-left: 50px; margin-bottom: 15px"
        >待开卷式发票号码：{{ num3 }}</span
      >
      <span v-show="num4" style="margin-left: 50px; margin-bottom: 15px"
        >待开电子普通发票号码：{{ num4 }}</span
      >
      <span v-show="num5" style="margin-left: 50px; margin-bottom: 15px"
        >待开电子专用发票号码：{{ num5 }}</span
      >
      <span v-show="num6" style="margin-left: 50px; margin-bottom: 15px"
        >待开机动车销售统一发票号码：{{ num6 }}</span
      >
    </div>

    <div class="listContent">
      <div class="tableBox" style="padding-bottom: 50px">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%; margin: 15px 0"
          @selection-change="handleSelectionChange"
          :default-sort="{ prop: 'createTime', order: null }"
          @sort-change="handleSortChange"
        >
          <div slot="empty">
            <listnodate :tableFlag="noDateFlag" />
          </div>
          <el-table-column
            type="selection"
            width="55"
            align="center"
            :selectable="checkSelectable"
          >
          </el-table-column>
          <el-table-column
            v-for="col in columns"
            :prop="col.value"
            :label="col.label"
            :width="col.width"
            :key="col.key"
            :fixed="col.fixed"
            :sortable="col.sortable"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="col.value == 'invoiceSeries'">
                <span
                  :class="
                    scope.row.financeFlag == '1' || scope.row.infoFlag == '1'
                      ? 'fontRed'
                      : ''
                  "
                  >{{ scope.row.invoiceSeries }}</span
                ></span
              >
              <span v-if="col.value == 'invoiceType'">
                <span
                  :class="
                    scope.row.financeFlag == '1' || scope.row.infoFlag == '1'
                      ? 'fontRed'
                      : ''
                  "
                >
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
              </span>
              <span v-if="col.value == 'buyerName'"
                ><span
                  :class="
                    scope.row.financeFlag == '1' || scope.row.infoFlag == '1'
                      ? 'fontRed'
                      : ''
                  "
                  >{{ scope.row.buyerName }}</span
                ></span
              >
              <span v-if="col.value == 'mainProductName'">
                <span
                  :class="
                    scope.row.financeFlag == '1' || scope.row.infoFlag == '1'
                      ? 'fontRed'
                      : ''
                  "
                >
                  {{ scope.row.mainProductName }}
                </span>
              </span>
              <span v-if="col.value == 'totalPriceWithTax'"
                ><span
                  :class="
                    scope.row.financeFlag == '1' || scope.row.infoFlag == '1'
                      ? 'fontRed'
                      : ''
                  "
                  >{{ scope.row.totalPriceWithTax }}</span
                ></span
              >
              <span v-if="col.value == 'createTime'"
                ><span
                  :class="
                    scope.row.financeFlag == '1' || scope.row.infoFlag == '1'
                      ? 'fontRed'
                      : ''
                  "
                  >{{ scope.row.createTime }}</span
                ></span
              >
              <span v-if="col.value == 'source'">
                <span
                  :class="
                    scope.row.financeFlag == '1' || scope.row.infoFlag == '1'
                      ? 'fontRed'
                      : ''
                  "
                >
                  <span v-if="scope.row.source == '0'"> 审核开票 </span>
                  <span v-if="scope.row.source == '1'"> 闪电开票 </span>
                  <span v-if="scope.row.source == '2'"> 批量开票 </span>
                  <span v-if="scope.row.source == '3'"> 清单开票 </span>
                </span>
              </span>
              <span v-if="col.value == 'status'">
                <span
                  :class="
                    scope.row.financeFlag == '1' || scope.row.infoFlag == '1'
                      ? 'fontRed'
                      : ''
                  "
                >
                  <span v-if="scope.row.status == '0'"> 未开票 </span>
                  <span v-if="scope.row.status == '1'"> 开票失败 </span>
                  <span v-if="scope.row.status == '2'"> 开票成功 </span>
                  <span v-if="scope.row.status == '3'"> 开票中 </span>
                  <span v-if="scope.row.status == '4'"> 准备开票 </span>
                </span>
              </span>
              <span v-if="col.value == 'failCause'">
                <span
                  :class="
                    scope.row.financeFlag == '1' || scope.row.infoFlag == '1'
                      ? 'fontRed'
                      : ''
                  "
                >
                  <span
                    v-if="
                      scope.row.financeFlag == '1' || scope.row.infoFlag == '1'
                    "
                  >
                    信息不完整，请填写完整后再开票
                  </span>
                  <span v-else>
                    {{ scope.row.failCause }}
                  </span>
                </span>
              </span>
              <span v-if="col.value == 'operationGod'">
                <el-button
                  @click="handleSingleBill(scope.$index, scope.row)"
                  v-if="
                    scope.row.financeFlag == '1' || scope.row.infoFlag == '1'
                  "
                  disabled
                  type="text"
                  size="small"
                  >开票</el-button
                >
                <el-button
                  @click="handleSingleBill(scope.$index, scope.row)"
                  v-else
                  type="text"
                  size="small"
                  >开票</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  @click="handleSingleEdit(scope.$index, scope.row)"
                  >修改</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  itemprop=""
                  @click="handleSingleDelete(scope.$index, scope.row)"
                  >删除</el-button
                >
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
        layout="total, prev, pager, next, sizes, jumper"
        :current-page="query.pageIndex"
        :page-size="query.pageSize"
        :page-sizes="[10, 20, 50, 100, 200]"
        :total="pageTotal"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>

    <!-- 开票弹窗 -->
    <el-dialog
      title="正在开票"
      :visible.sync="executeVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
      :before-close="beforeClose"
    >
      <div>
        <el-progress :percentage="percentage" color="#409eff"></el-progress>
        <div class="executeText">
          <span
            >开具成功{{ totalSuccessCount }}张，大约剩余{{
              surplusCount * 3
            }}秒</span
          >
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="quitExecute">暂停开票</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { Message } from "element-ui";
import {
  awaitListSearch,
  awaitListExport,
  awaitListDelete,
  awaitListExecute,
  awaitListDetail,
  getInvoiceStatic,
} from "@/api/awaitListApi.js";
import { getRedis, getRedisList } from "@/api/taxStock";
import { getDiskTicketType } from "@/api/billType.js";
import { UtilsGetTicketType } from "@/utils/function";
import { downloadFile } from "@/utils/function.js";
import Listnodate from "@/components/ListNoDate";
import Breadnav from "@/components/Breadnav";
import { getInvoicingTypeDetail } from "@/api/lightInvoicing.js";
import {
  showFullScreenLoading,
  tryHideFullScreenLoading,
} from "@/utils/loadingX";
import {
  getTaskConfig,
  addTaskConfig,
  updateRead,
  updateStatus,
} from "@/api/awaitListApi.js";
export default {
  name: "AwaitList",
  inject: ["changeB"],
  components: {
    // ProgressDialog,
    // ResultDialog,
    Listnodate,
    Breadnav,
  },
  data() {
    return {
      title: "待开列表",
      num1: null, //待开发票号码
      num2: null,
      num3: null,
      num4: null,
      num5: null,
      num6: null,
      kpDisabled: true,
      loading: false,
      noDateFlag: "successNoDate",
      // deleteDisabled:true,//删除按钮禁用
      // exportDisabled:true,//导出按钮禁用
      ruleForm: {
        inputValue: null,
      },
      rules: {},
      // inputValue: null, //输入框输入的值
      invoiceType: null, //发票类型
      invoiceTypeList: [],
      applySource: null, //申请来源
      applySourceList: [
        { value: null, label: "全部" },
        { value: 0, label: "审核开票" },
        { value: 1, label: "闪电开票" },
        // { value: 2, label: "批量开票" },
        // { value: 3, label: "清单开票" },
      ],
      billStatus: null, //开票状态
      billStatusList: [
        { value: null, label: "全部" },
        { value: 0, label: "未开票" },
        { value: 1, label: "开票失败" },
        // { value: 2, label: "开票成功" },
        { value: 3, label: "开票中" },
        { value: 4, label: "准备开票" },
      ],
      tableData: [], //表格data
      columns: [
        {
          id: 1,
          value: "invoiceSeries",
          label: "开票流水号",
          key: "invoiceSeries",
          sortable: false,
          fixed: false,
          width: "180",
        },
        {
          id: 2,
          value: "invoiceType",
          label: "发票类型",
          key: "invoiceType",
          sortable: false,
          fixed: false,
          width: "180",
        },
        {
          id: 3,
          value: "buyerName",
          label: "购方名称",
          key: "buyerName",
          sortable: false,
          fixed: false,
          width: "180",
        },
        {
          id: 4,
          value: "mainProductName",
          label: "主要商品名称",
          key: "mainProductName",
          sortable: false,
          fixed: false,
          width: "180",
        },
        {
          id: 5,
          value: "totalPriceWithTax",
          label: "价税合计",
          key: "totalPriceWithTax",
          sortable: false,
          fixed: false,
          width: "180",
        },
        {
          id: 6,
          value: "createTime",
          label: "加入时间",
          key: "createTime",
          sortable: "custom",
          fixed: false,
          width: "180",
        },
        {
          id: 7,
          value: "source",
          label: "申请来源",
          key: "source",
          sortable: false,
          fixed: false,
          width: "180",
        },
        {
          id: 8,
          value: "status",
          label: "开票状态",
          key: "status",
          sortable: false,
          fixed: false,
          width: "180",
        },
        {
          id: 9,
          value: "failCause",
          label: "失败原因",
          key: "failCause",
          sortable: false,
          fixed: false,
          width: "180",
        },
        {
          id: 10,
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
      multipleSelection: [], //表格选择的数据
      taxDiskNum: "", //税盘号
      key: null,
      timeDesc: null,
      continue: true,
      loading: false,
      executeVisible: false,
      taskId: "",
      percentage: 0,
      surplusCount: 0,
      totalSuccessCount: 0,
      totalFailCount: 0,
      invoiceTypeSurplus: [],
      invoiceTypeArr: [],
      ticketType: "",

      // 缓存查询条件

      cacheInvoiceType: "",
      cacheInvoiceStaus: "",
      cacheInputValue: "",
      cacheApplySource: "",
    };
  },
  created() {},
  mounted() {
    this.taxDiskNum = this.$store.state.user.taxDiskNum;
    this.getData();
    this.getBillType();
    this.getAwaitNum();
    this.ifExecute();
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
    //设置表格是否可选
    checkSelectable(row, index) {
      // return true;
      if (row.financeFlag == "1" || row.infoFlag == "1") {
        return false; //-----不可选
      } else {
        return true; //----------可选
      }
    },
    // 返回
    clickLeft() {
      if (this.$route.query.type == "reviewInvoice") {
        this.changeB();
        this.$router.push({ name: "reviewInvoicing" });
      } else {
        this.$router.push({ name: "managementIndex" });
      }
    },
    getAwaitNum() {
      let applyParams = {
        taxDiskNum: this.taxDiskNum,
      };
      var that = this;
      getInvoiceStatic(applyParams)
        .then((res) => {
          if (res && res.code == "200") {
            // console.log(res.data)
            for (let x in res.data) {
              // console.log(x,res.data[x])
              if (x == "004") {
                that.num1 = res.data[x];
              } else if (x == "007") {
                that.num2 = res.data[x];
              } else if (x == "025") {
                that.num3 = res.data[x];
              } else if (x == "026") {
                that.num4 = res.data[x];
              } else if (x == "028") {
                that.num5 = res.data[x];
              } else if (x == "005") {
                that.num6 = res.data[x];
              }
            }
          }
        })
        .catch((error) => {});
    },
    getBillType() {
      let applyParams = {
        taxDiskNum: this.taxDiskNum,
      };
      var that = this;
      getDiskTicketType(applyParams)
        .then((res) => {
          if (res && res.code == "200") {
            that.invoiceTypeList = UtilsGetTicketType(res.data.ticketType);
            that.getInvoiceSurplus(res.data.ticketType);
          }
        })
        .catch((error) => {});
    },

    // 接口查询
    getData() {
      let applyParams = {
        invoiceType: this.invoiceType,
        keyword: this.ruleForm.inputValue,
        pageNum: this.query.pageIndex,
        pageSize: this.query.pageSize,
        source: this.applySource,
        status: this.billStatus,
        taxDiskNum: this.taxDiskNum,
        timeDesc: this.timeDesc,
      };
      var that = this;
      this.loading = true;
      awaitListSearch(applyParams)
        .then((res) => {
          if (res && res.code == "200") {
            that.loading = false;
            that.tableData = res.data.records;
            that.query.pageIndex = res.data.current;
            that.pageTotal = res.data.total;
            that.query.pageSize = res.data.size;
            // 缓存查询条件
            that.cacheInvoiceType = that.invoiceType;
            that.cacheInvoiceStaus = that.billStatus;
            that.cacheInputValue = that.ruleForm.inputValue;
            that.cacheApplySource = that.applySource;
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
        keyword: this.cacheInputValue,
        pageNum: this.query.pageIndex,
        pageSize: this.query.pageSize,
        source: this.cacheApplySource,
        status: this.cacheInvoiceStaus,
        taxDiskNum: this.taxDiskNum,
        timeDesc: this.timeDesc,
      };
      var that = this;
      this.loading = true;
      awaitListSearch(applyParams)
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
    // 模糊查询
    fuzzySearch() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.query.pageIndex = 1;
          this.query.pageSize = 10;
          this.invoiceType = null;
          this.applySource = null;
          this.billStatus = null;
          this.getData();
        }
      });
    },
    //开票
    // handlekp() {
    //   this.loading = true;
    //   // this.kpDisabled=true;
    //   showFullScreenLoading("开票中,请稍候");
    //   this.awaitExecute(this.multipleSelection[0]);
    // },

    //导出
    handelExport() {
      if (this.multipleSelection.length > 0) {
        var list = [];
        this.multipleSelection.forEach(function (item, index) {
          list.push(item.id);
        });
        awaitListExport(list)
          .then((res) => {
            downloadFile(res);
          })
          .catch((error) => {});
      } else {
        this.$message({
          type: "warning",
          message: "未选中任何数据",
        });
      }
    },

    // 删除
    handelDelete() {
      if (this.multipleSelection.length > 0) {
        var idList = [];
        this.multipleSelection.forEach(function (item) {
          idList.push(item.id);
        });
        var box = "";
        idList.forEach(function (item, index) {
          if (index == idList.length - 1) {
            box += item;
          } else {
            box += item + ",";
          }
        });
        let applyParams = {
          todoIds: box,
        };
        var that = this;

        this.$confirm("一旦删除无法恢复，你确认删除吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            awaitListDelete(applyParams)
              .then((res) => {
                if (res && res.code == "200") {
                  that.getData();
                  that.$message({
                    type: "success",
                    message: "删除成功",
                  });
                }
              })
              .catch((error) => {});
          })
          .catch(() => {
            // this.$message.info("已取消删除");
          });
      } else {
        this.$message({
          type: "warning",
          message: "未选中任何数据",
        });
      }
    },
    // 查询
    handleSearch() {
      this.query.pageIndex = 1;
      this.query.pageSize = 10;
      this.$refs.ruleForm.resetFields();
      this.inputValue = null;
      this.getData();
    },

    // 表格选择的数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (this.multipleSelection.length > 0) {
        if (this.multipleSelection.length == 1) {
          this.kpDisabled = false;
        } else {
          this.kpDisabled = true;
        }
      } else {
        this.kpDisabled = true;
      }
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

    //列表中的开票
    handleSingleBill(index, row) {
      this.loading = true;
      // showFullScreenLoading("开票中,请稍候");
      clearTimeout(this.timer);
      this.$alert("", "开票中,请稍候", {
        confirmButtonText: "停止开票",
        iconClass: "el-icon-loading",
        center: true,
        showClose: false,
        callback: (action) => {
          clearTimeout(this.timer);
          this.loading = false;
        },
      });
      this.awaitExecute(row);
    },
    //开票
    async awaitExecute(row) {
      const res = await awaitListExecute({
        todoId: row.id,
      });
      if (res.code == 200) {
        if (res.data) {
          this.key = res.data;
          // this.getRedis();
          this.setInter(3000, this.getRedis);
        } else {
          this.loading = false;
          // tryHideFullScreenLoading();
          this.$globals.closeContent();
          this.$message({
            type: "error",
            message: "开票失败",
          });
        }
      } else {
        this.loading = false;
        // tryHideFullScreenLoading();
        this.$globals.closeContent();
        // this.$message({
        //   type: "error",
        //   message: "开票失败",
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
    async getRedis() {
      const res = await getRedis({ key: this.key });
      if (res.data.code == 1) {
        clearTimeout(this.timer);
        if (res.data.msgCode == 200) {
          // tryHideFullScreenLoading();
          this.$globals.closeContent();
          this.loading = false;
          this.getData();
          this.getAwaitNum()
          this.$message({
            type: "success",
            message: "开票成功",
          });
        } else {
          // tryHideFullScreenLoading();
          this.$globals.closeContent();
          this.loading = false;
          this.$message({
            type: "error",
            message: res.data.message,
          });
          this.getData();
        }
      } else {
        this.loading = true;
      }
    },
    //列表中的编辑
    handleSingleEdit(index, row) {
      // var data;
      let applyParams = {
        todoId: row.id,
      };
      var that = this;
      awaitListDetail(applyParams)
        .then((res) => {
          if (res && res.code == "200") {
            that.$router.push({
              path: "/lightningInvoicing",
              query: {
                List: JSON.stringify({
                  data: res.data,
                  type: "daikai",
                }),
              },
            });
          }
        })
        .catch((error) => {});
      // console.log(data)
    },
    //列表中的删除
    handleSingleDelete(index, row) {
      var idList;
      idList = row.id;
      let applyParams = {
        todoIds: idList,
      };
      var that = this;
      // this.todoIds = row.id;
      this.$confirm("一旦删除无法恢复，你确认删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          awaitListDelete(applyParams)
            .then((res) => {
              if (res && res.code == "200") {
                that.getData();
                that.$message({
                  type: "success",
                  message: "删除成功",
                });
              }
            })
            .catch((error) => {});
        })
        .catch(() => {
          // this.$message.info("已取消删除");
        });
    },

    //定时任务 每1秒请求获取一次任务状态
    setTime(s, fn) {
      let timeOut = (s, fn) => {
        var time1 = setTimeout(() => {
          if ((this.continue = true)) {
            fn.call(this);
            timeOut(s, fn);
          }
        }, s);
        this.timer = time1;
      };
      timeOut(s, fn);
    },
    //获取任务详情
    async getTaskConfig() {
      try {
        const res = await getTaskConfig({
          taxDiskNum: this.taxDiskNum,
        });
        if (res.code == 200) {
          this.executeVisible = true;
          this.taskId = res.data.id;
          this.executeStatus = res.data.status;
          if (res.data.status == 0) {
            this.continue = true;
            this.percentage = parseInt(
              ((res.data.totalSuccessCount + res.data.totalFailCount) /
                res.data.totalCount) *
                100
            );
            this.totalSuccessCount = res.data.totalSuccessCount;
            this.surplusCount =
              res.data.totalCount -
              res.data.totalSuccessCount -
              res.data.totalFailCount;
          } else if (res.data.status == 1) {
            this.continue = false;
            this.executeVisible = false;
            this.percentage = 0;
            clearTimeout(this.timer);
            if (res.data.totalFailCount !== 0) {
              this.executeFailResultVisible = true;
              this.totalFailCount = res.data.totalFailCount;
              this.$alert(
                // `本次共开具${res.data.totalCount}张发票，可至发票查询中查看发票`,
                '请根据错误提示修改信息后，再次操作',
                `${res.data.totalFailCount}张发票开具失败`,
                {
                  confirmButtonText: "确定",
                  type: "warning",
                  center: true,
                }
              );
            } else {
              this.executeSuccessResultVisible = true;
              this.totalSuccessCount = res.data.totalSuccessCount;
              this.$alert(
                `本次共开具${res.data.totalCount}张发票，可至发票查询中查看发票`,
                "开票成功！",
                {
                  confirmButtonText: "确定",
                  type: "success",
                  center: true,
                }
              );
            }
            this.updateRead(res.data.id);
            this.getAwaitNum()
            this.getData();
          }
        }
      } catch {
        (error) => console.log(error);
      }
    },
    //查询发票余量
    async getInvoicingTypeDetail(invoiceType) {
      const res = await getInvoicingTypeDetail({
        invoiceType,
        taxDiskNum: this.taxDiskNum,
      });
      if (res.code == 200) {
        this.invoiceTypeSurplus.push({
          invoiceType: invoiceType,
          surplus: res.data.balances,
        });
      }
    },
    getInvoiceSurplus(val) {
      let newVal = val.split(",");
      newVal.forEach((item) => {
        this.getInvoicingTypeDetail(item);
      });
    },
    //新增开票任务
    async handlekp() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "请选择待开票据",
          type: "warning",
        });
        return;
      }
      let c = this.multipleSelection;
      c.forEach((item) => {
        this.invoiceTypeSurplus.forEach((item2) => {
          if (item2.invoiceType == item.invoiceType) {
            item.sur = item2.surplus;
          }
        });
      });

      if (
        c.some((item) => {
          return item.sur == "0";
        }) == true
      ) {
        this.$message({
          message: "发票已用完，无法开具发票!",
          type: "warning",
        });
        return;
      }
      if (
        c.some((item) => {
          return item.infoFlag == "1";
        }) == true
      ) {
        this.$message({
          message: "包含信息不完整的数据，无法开具发票!",
          type: "warning",
        });
        return;
      }
      this.executeVisible = true;
      let todoIds = [];
      for (let item of this.multipleSelection) {
        todoIds.push(item.id);
      }
      try {
        const res = await addTaskConfig({
          todoIds,
          taxDiskNum: this.taxDiskNum,
        });
        if (res.code == 200 || res.msg == "开票中，请等待结果") {
          this.getTaskConfig();
          this.setTime(2000, this.getTaskConfig);
        }
      } catch {
        (error) => console.log(error);
      }
    },
    //停止开票
    async quitExecute() {
      try {
        const res = await updateStatus({
          status: 2,
          taskId: this.taskId,
        });
        if (res.code == 200) {
          this.executeVisible = false;
          this.continue = false;
          clearTimeout(this.timer);
        }
      } catch {
        (error) => console.log(error);
      }
    },
    //更新已读状态
    async updateRead(taskId) {
      try {
        await updateRead({
          read: 1,
          taskId,
        });
      } catch {
        (error) => console.log(error);
      }
    },
    beforeClose() {
      this.continue = false;
      this.executeVisible = false;
      clearTimeout(this.timer);
    },
    async ifExecute() {
      const res = await getTaskConfig({
        taxDiskNum: this.taxDiskNum,
      });
      if (res.data !== null && res.data.status == 1) {
        if (res.data.totalFailCount !== 0) {
          this.$alert(
            // `本次共开具${res.data.totalCount}张发票，可至发票查询中查看发票`,
            '请根据错误提示修改信息后，再次操作',
            `${res.data.totalFailCount}张发票开具失败`,
            {
              confirmButtonText: "确定",
              type: "warning",
              center: true,
            }
          );
        } else if (res.data.totalFailCount == 0) {
          this.$alert(
            `本次共开具${res.data.totalCount}张发票，可至发票查询中查看发票`,
            "开票成功！",
            {
              confirmButtonText: "确定",
              type: "success",
              center: true,
            }
          );
          this.getAwaitNum()
        }
        this.updateRead(res.data.id);
      } else if (res.data !== null && res.data.status == 0) {
        this.taskId = res.data.id;
        this.executeVisible = true;
        this.setTime(2000, this.getTaskConfig);
      } else {
        return;
      }
    },
  },
};
</script>


<style  scoped>
.el-form-item {
  margin-bottom: 15px;
}
.fontRed {
  color: red;
}
.page-container {
  background: white;
  padding: 0;
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
.page-header {
  padding: 15px 25px 25px 25px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 64px;
  border-bottom: 1px solid #ececec;
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
</style>
