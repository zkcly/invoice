<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <div class="breadNav" @click="clickLeft">
          <i class="el-icon-arrow-left"></i>
          <span class="navText">{{ boxTitle }}</span>
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
                  @click="fuzzySearch()"
                  >搜索</el-button
                >
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="rightNavBox">
        <div class="rightNav" @click="handleExport()">
          <img
            src="../../assets/images/exportX2.png"
            alt="图片"
            class="navImg"
          />
          <span class="navTex">导出</span>
        </div>
        <div class="rightNav" @click="handlePrint()">
          <img
            src="../../assets/images/printX2.png"
            alt="图片"
            class="navImg"
          />
          <span class="navTex">打印</span>
        </div>
        <div class="rightNav" @click="handelDelete()">
          <img
            src="../../assets/images/deleteX2.png"
            alt="图片"
            class="navImg"
          />
          <span class="navTex">删除</span>
        </div>
        <!-- <div class="rightNav" @click="handleUpload()">
          <img src="../../assets/images/uploadX2.png" alt="图片" class="navImg" />
          <span class="navTex">上传</span>
        </div>
        <div class="rightNav" @click="handelRevoke()">
          <img src="../../assets/images/revokeX2.png" alt="图片" class="navImg" />
          <span class="navTex">撤销</span>
        </div> -->
        <el-button size="mini" type="primary" @click="redDownloadVisible = true"
          >下载</el-button
        >
        <el-button size="mini" type="primary" @click="handleApply"
          >申请</el-button
        >
      </div>
      <!-- <div class="clear"></div> -->
    </div>

    <div class="page-filters">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="发票类型：">
          <el-select
            size="small"
            v-model="invoiceType"
            placeholder="请选择发票类型"
          >
            <el-option
              label="全部发票"
              :value="null"
              v-if="routeList.type != 'shandian-fushu'"
            ></el-option>
            <el-option
              v-for="status in invoiceTypeList"
              :key="status.id"
              :label="status.label"
              :value="status.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请时间:">
          <el-date-picker
            v-model="applyTime"
            unlink-panels
            size="small"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 300px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="handleSearch()"
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
          :default-sort="{ prop: 'inputTime', order: 'descending' }"
          @sort-change="handleSortChange"
          @row-dblclick="selectDbClick"
        >
          <div slot="empty">
            <listnodate :tableFlag="noDateFlag" />
          </div>
          <el-table-column
            type="selection"
            width="50"
            align="center"
          ></el-table-column>
          <el-table-column
            v-for="col in columns"
            :prop="col.value"
            :label="col.label"
            :key="col.key"
            :width="col.width"
            :sortable="col.sortable"
            align="center"
          >
            <!--  -->
            <template slot-scope="scope">
              <span v-if="col.value == 'infoTabNo'">{{
                scope.row.infoTabNo
              }}</span>
              <span v-if="col.value == 'infoTabStatusCode'">
                <span v-if="scope.row.infoTabStatusCode == '0'"> 审核中 </span>
                <span v-if="scope.row.infoTabStatusCode == '1'">
                  审核通过
                </span>
                <span v-if="scope.row.infoTabStatusCode == '2'">
                  审核失败
                </span>
                <span v-if="scope.row.infoTabStatusCode == '3'"> 未上传 </span>
                <span v-if="scope.row.infoTabStatusCode == '4'"> 其他 </span>
                <span v-if="scope.row.infoTabStatusCode == '5'"> 已撤销 </span>
                <span v-if="scope.row.infoTabStatusCode == '6'"> 已开票 </span>
                <span v-if="scope.row.infoTabStatusCode == '7'">
                  上传失败
                </span>
              </span>
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
              <span v-if="col.value == 'invoiceNo'">{{
                scope.row.invoiceNo
              }}</span>
              <span v-if="col.value == 'inputTime'">{{
                scope.row.inputTime
              }}</span>
              <span v-if="col.value == 'buyerName'">{{
                scope.row.buyerName
              }}</span>
              <span v-if="col.value == 'priceAmount'">{{
                scope.row.priceAmount
              }}</span>

              <span v-if="col.value == 'operationGod'">
                <span v-if="routeList.type == 'shandian-fushu'">
                  <el-button
                    @click="golight(scope.$index, scope.row)"
                    type="text"
                    size="small"
                    v-if="
                      scope.row.infoTabStatusCode == '1' &&
                      scope.row.infoTabNo != '' &&
                      scope.row.infoTabNo != null
                    "
                    >选择</el-button
                  >

                  <el-button
                    @click="golight(scope.$index, scope.row)"
                    type="text"
                    size="small"
                    v-else
                    disabled
                    >选择</el-button
                  >
                </span>
                <span v-else>
                  <el-button
                    @click="handleSingleEdit(scope.$index, scope.row)"
                    v-if="
                      scope.row.infoTabStatusCode == '2' ||
                      scope.row.infoTabStatusCode == '7' ||
                      scope.row.infoTabStatusCode == '4'
                    "
                    type="text"
                    size="small"
                    >修改</el-button
                  >
                  <el-button
                    v-else
                    @click="handleSingleEdit(scope.$index, scope.row)"
                    type="text"
                    size="small"
                    disabled
                    >修改</el-button
                  >
                  <el-button
                    type="text"
                    v-if="scope.row.infoTabStatusCode == '3'"
                    size="small"
                    @click="handleSingleUpload(scope.$index, scope.row)"
                    >上传</el-button
                  >
                  <el-button
                    type="text"
                    v-else
                    size="small"
                    disabled
                    @click="handleSingleUpload(scope.$index, scope.row)"
                    >上传</el-button
                  >
                  <el-button
                    type="text"
                    size="small"
                    v-if="
                      scope.row.infoTabStatusCode == '1' &&
                      scope.row.infoTabNo != '' &&
                      scope.row.infoTabNo != null
                    "
                    @click="handelSingleRevoke(scope.$index, scope.row)"
                    >撤销</el-button
                  >
                  <el-button
                    type="text"
                    size="small"
                    disabled
                    v-else
                    @click="handelSingleRevoke(scope.$index, scope.row)"
                    >撤销</el-button
                  >
                  <el-button
                    type="text"
                    v-if="
                      scope.row.infoTabStatusCode == '1' &&
                      scope.row.invoiceNo != '' &&
                      scope.row.invoiceNo != null
                    "
                    size="small"
                    itemprop=""
                    @click="handelSingleBill(scope.$index, scope.row)"
                    >开票</el-button
                  >
                </span></span
              >
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

    <!-- 下载弹窗 -->
    <red-download :visible.sync="redDownloadVisible" @getForm="getForm" />

    <!-- 打印机设置组件 -->
    <PrintSetting :visible.sync="printVisible" :printType="printType">
    </PrintSetting>
  </div>
</template>
<script>
import {
  redLetterListSearch,
  redLetterRevoke,
  redLetterUpload,
  redInfoTabDownload,
  redInfoTabDelete,
  getDetailsById,
  redLetterExport,
  redLetterPrint,
  printRedInformationTable,
} from "@/api/redLetterListApi.js";
import { getRedis, getRedisList } from "@/api/taxStock";
import { downloadFile } from "@/utils/function.js";
import { getDiskTicketType } from "@/api/billType.js";
import { UtilsGetTicketType } from "@/utils/function";
import Listnodate from "@/components/ListNoDate";
import RedDownload from "./components/RedDownload.vue";
import Breadnav from "@/components/Breadnav";
import PrintSetting from "../home/components/PrintSetting";
import {
  showFullScreenLoading,
  tryHideFullScreenLoading,
} from "@/utils/loadingX";
export default {
  name: "RedLetterList",
  components: {
    RedDownload,
    Listnodate,
    Breadnav,
    PrintSetting,
  },
  data() {
    return {
      printType: null,
      printVisible: false, //发票弹框
      boxTitle: "红字信息",
      loading: false,
      noDateFlag: "successNoDate",
      ruleForm: {
        inputValue: null,
      },
      rules: {},
      inputValue: null, //传值
      invoiceType: null, //发票类型
      invoiceTypeList: [],
      applyTime: [], //申请时间
      tableData: [], //表格data
      multipleSelection: [], //选择的数据
      columns: [
        {
          id: 1,
          value: "infoTabNo",
          label: "信息表编号",
          key: "infoTabNo",
          sortable: false,
        },
        {
          id: 2,
          value: "infoTabStatusCode",
          label: "信息表状态",
          key: "infoTabStatusCode",
          sortable: false,
        },
        {
          id: 3,
          value: "invoiceType",
          label: "发票类型",
          key: "invoiceType",
          sortable: false,
        },
        {
          id: 4,
          value: "invoiceNo",
          label: "原发票号码",
          key: "invoiceNo",
          sortable: false,
        },
        {
          id: 5,
          value: "inputTime",
          label: "申请时间",
          key: "inputTime",
          sortable: "custom",
        },
        {
          id: 6,
          value: "buyerName",
          label: "购方名称",
          key: "buyerName",
          width: "200",
          sortable: false,
        },
        {
          id: 7,
          value: "priceAmount",
          label: "开票金额",
          key: "priceAmount",
          sortable: false,
        },
        {
          id: 8,
          value: "operationGod",
          label: "操作",
          key: "operationGod",
          sortable: false,
        },
      ],
      pageTotal: 0,
      query: {
        pageIndex: 1,
        pageSize: 10,
      },
      redDownloadVisible: false,
      taxDiskNum: "", //税盘号
      key1: null,
      key2: null,
      key3: [],
      timeDesc: "true",
      routeList: "",

      // 缓存 查询条件
      cacheInvoiceType: "",
      cacheInputValue: "",
      cacheApplyTime: [],
    };
  },
  created() {
    this.setApplyStartTime();
    this.setApplyEndTime();
  },
  mounted() {
    this.taxDiskNum = this.$store.state.user.taxDiskNum;
    this.getBillType();
    // 路由跳转数据
    // 闪电开票 type='shandian-fushu'
    this.routeList = this.$route.query.List
      ? JSON.parse(this.$route.query.List)
      : "";
    this.getData();
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
    //双击选择
    selectDbClick(row) {
      let params = {
        id: row.id,
      };
      console.log(row);
      if (this.routeList) {
        if (
          row.infoTabStatusCode == "1" &&
          row.infoTabNo != "" &&
          row.infoTabNo != null
        ) {
          var that = this;
          getDetailsById(params)
            .then((res) => {
              if (res && res.code == "200") {
                if (that.routeList.type == "shandian-fushu") {
                  that.$router.push({
                    path: "/lightningInvoicing",
                    query: {
                      List: JSON.stringify({
                        data: res.data,
                        item: row,
                        type: "hongzixinxi-fushu",
                      }),
                    },
                  });
                } else {
                  return;
                }
              }
            })
            .catch((error) => {});
        } else {
          return;
        }
      } else {
        return;
      }
    },
    //选择 跳转到闪电开票页面
    golight(index, row) {
      let params = {
        id: row.id,
      };
      var that = this;
      getDetailsById(params)
        .then((res) => {
          if (res && res.code == "200") {
            if (that.routeList.type == "shandian-fushu") {
              that.$router.push({
                path: "/lightningInvoicing",
                query: {
                  List: JSON.stringify({
                    data: res.data,
                    item: row,
                    type: "hongzixinxi-fushu",
                  }),
                },
              });
            } else {
              that.$router.push({
                path: "/lightningInvoicing",
                query: {
                  List: JSON.stringify({
                    data: res.data,
                    item: row,
                    type: "hongzixinxi",
                  }),
                },
              });
            }
          }
        })
        .catch((error) => {});
    },
    // 返回
    clickLeft() {
      if (this.routeList.type == "shandian-fushu") {
        this.$router.push({ name: "LightningInvoicing" });
      } else {
        this.$router.push({ name: "managementIndex" });
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
            var b = UtilsGetTicketType(res.data.ticketType);
            console.log(b);
            b.forEach((item) => {
              if (item.value == "004" || item.value == "028") {
                that.invoiceTypeList.push(item);
              }
            });
            if (that.routeList.data) {
              that.invoiceType = that.routeList.data;
            }
          }
        })
        .catch((error) => {});
    },
    //接口查询
    getData() {
      let applyParams = {
        invoiceType: this.invoiceType,
        keyword: this.ruleForm.inputValue,
        endDate: "",
        startDate: "",
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
      redLetterListSearch(applyParams)
        .then((res) => {
          if (res && res.code == "200") {
            that.loading = false;
            that.tableData = res.data.records;
            that.query.pageIndex = res.data.current;
            that.pageTotal = res.data.total;
            that.query.pageSize = res.data.size;
            //缓存查询条件
            that.cacheInvoiceType = that.invoiceType;
            that.cacheInputValue = that.ruleForm.inputValue;
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
        keyword: this.cacheInputValue,
        endDate: "",
        startDate: "",
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
      redLetterListSearch(applyParams)
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
          this.applyTime = [];
          this.getData();
        }
      });
    },

    //查询
    handleSearch() {
      this.query.pageIndex = 1;
      this.query.pageSize = 10;
      this.ruleForm.inputValue = null;
      this.$refs.ruleForm.resetFields();
      this.getData();
    },
    //申请
    handleApply() {
      this.$router.push({
        path: "/management/invoicingManagement/redApply",
      });
    },
    // 导出
    handleExport() {
      if (this.multipleSelection.length > 0) {
        var ids = [];
        this.multipleSelection.forEach((item) => {
          ids.push(item.id);
        });
        redLetterExport(ids)
          .then((res) => {
            if (res) {
              downloadFile(res);
            }
          })
          .catch((error) => {});
      } else {
        this.$message({
          type: "warning",
          message: "未选中任何数据",
        });
      }
    },
    //删除
    handelDelete() {
      if (this.multipleSelection.length > 0) {
        var that = this;
        this.$confirm("一旦删除无法恢复，你确认删除吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            var idList = [];
            this.multipleSelection.forEach(function (item) {
              idList.push(item.id);
            });
            redInfoTabDelete(idList)
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
    //上传
    handleUpload() {
      if (this.multipleSelection.length > 0) {
        if (this.multipleSelection.length == 1) {
          if (this.multipleSelection[0].infoTabStatusCode == "3") {
            let applyParams = {
              id: this.multipleSelection[0].id,
            };
            var that = this;
            getDetailsById(applyParams)
              .then((res) => {
                if (res && res.code == "200") {
                  that.loading = true;
                  // showFullScreenLoading("上传中,请稍候");
                  clearTimeout(that.timer);
                  that.$alert("", "上传中,请稍候", {
                    confirmButtonText: "停止上传",
                    iconClass: "el-icon-loading",
                    center: true,
                    showClose: false,
                    callback: (action) => {
                      clearTimeout(this.timer);
                      this.loading = false;
                    },
                  });
                  that.redUpload(res.data);
                }
              })
              .catch((error) => {});
          } else {
            this.$message({
              type: "warning",
              message: "请选择未上传的数据进行上传",
            });
          }
        } else {
          this.$message({
            type: "warning",
            message: "只能单个上传",
          });
        }
      } else {
        this.$message({
          type: "warning",
          message: "请选择表格中的数据进行上传",
        });
      }
    },
    //撤销
    handelRevoke() {
      if (this.multipleSelection.length > 0) {
        if (this.multipleSelection.length == 1) {
          this.$confirm("你确认撤销吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.loading = true;
              // showFullScreenLoading("撤销中,请稍候");
              that.$alert("", "撤销中,请稍候", {
                confirmButtonText: "停止撤销",
                iconClass: "el-icon-loading",
                center: true,
                showClose: false,
                callback: (action) => {
                  clearTimeout(this.timer);
                  this.loading = false;
                },
              });
              this.redRevoke(this.multipleSelection[0]);
            })
            .catch(() => {
              // this.$message.info("已取消删除")
            });
        } else {
          this.$message({
            type: "warning",
            message: "只能单个撤销",
          });
        }
      } else {
        this.$message({
          type: "warning",
          message: "请选择表格中的数据进行撤销",
        });
      }
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
    //单个修改
    handleSingleEdit(index, row) {
      // var data = row;
      let applyParams = {
        id: row.id,
      };
      var that = this;

      getDetailsById(applyParams)
        .then((res) => {
          if (res && res.code == "200") {
            const data = {
              formData: row,
              type: "xiugai",
            };
            that.$router.push({
              path: "/management/invoicingManagement/redSaleApply",
              query: {
                data: JSON.stringify(data),
              },
            });
          } else {
          }
        })
        .catch((error) => {});
    },
    //单个上传
    handleSingleUpload(index, row) {
      let applyParams = {
        id: row.id,
      };
      var that = this;
      getDetailsById(applyParams)
        .then((res) => {
          if (res && res.code == "200") {
            that.loading = true;
            // showFullScreenLoading("上传中,请稍候");
            clearTimeout(that.timer);
            that.$alert("", "上传中,请稍候", {
              confirmButtonText: "停止上传",
              iconClass: "el-icon-loading",
              center: true,
              showClose: false,
              callback: (action) => {
                clearTimeout(this.timer);
                this.loading = false;
              },
            });
            that.redUpload(res.data);
          }
        })
        .catch((error) => {});
    },
    //上传 接口调用
    async redUpload(row) {
      const res = await redLetterUpload(row);
      if (res.code == 200) {
        if (res.data.length > 0) {
          this.key1 = res.data;
          // this.getRedis1();
          this.setInter1(3000, this.getRedis1);
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
        //   type: "error",
        //   message: res.msg,
        // });
      }
    },
    setInter1(s, fn) {
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
            this.$message({
              type: "error",
              message: "税局服务不稳定，请稍后再试",
            });
          } else {
            clearTimeout(this.timer);
            // tryHideFullScreenLoading();
            this.$globals.closeContent();
          }
        }, s);
        this.timer = time1;
      };
      timeOut(s, fn);
    },
    //查询请求
    async getRedis1() {
      const res = await getRedis({ key: this.key1 });
      if (res.data) {
        if (res.data.code == 1) {
          clearTimeout(this.timer);
          if (res.data.msgCode == 200) {
            this.loading = false;
            // tryHideFullScreenLoading();
            this.$globals.closeContent();
            this.getData();
            this.$message({
              type: "success",
              message: "上传成功",
            });
          } else {
            this.loading = false;
            // tryHideFullScreenLoading();
            this.$globals.closeContent();
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
    //单个撤销
    handelSingleRevoke(index, row) {
      this.$confirm("你确认撤销吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.loading = true;
          // showFullScreenLoading("撤销中,请稍候");
          clearTimeout(this.timer);
          this.$alert("", "撤销中,请稍候", {
            confirmButtonText: "停止撤销",
            iconClass: "el-icon-loading",
            center: true,
            showClose: false,
            callback: (action) => {
              clearTimeout(this.timer);
              this.loading = false;
            },
          });
          this.redRevoke(row);
        })
        .catch(() => {});
    },
    //撤销 接口调用
    async redRevoke(row) {
      const res = await redLetterRevoke({
        deviceNo: this.taxDiskNum, //机器编号（税盘号）
        invoiceType: row.invoiceType, //发票类型
        noticeNo: row.infoTabNo, //红字信息表编号
        // taxId: "", //纳税人识别号
      });
      if (res.code == 200) {
        if (res.data.length > 0) {
          this.key2 = res.data;
          // this.getRedis2();
          this.setInter2(3000, this.getRedis2);
        } else {
          this.loading = false;
          // tryHideFullScreenLoading();
          this.$globals.closeContent();
          this.$message({
            type: "error",
            message: "撤销失败",
          });
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
            this.$message({
              type: "error",
              message: "税局服务不稳定，请稍后再试",
            });
          } else {
            clearTimeout(this.timer);
            // tryHideFullScreenLoading();
            this.$globals.closeContent();
          }
        }, s);
        this.timer = time1;
      };
      timeOut(s, fn);
      // if (this.loading == true) {
      //   timeOut(s, fn);
      // } else if (this.loading == false) {
      //   clearTimeout(this.timer);
      // }
    },
    //查询请求
    async getRedis2() {
      const res = await getRedis({ key: this.key2 });
      if (res.data) {
        if (res.data.code == 1) {
          clearTimeout(this.timer);
          if (res.data.msgCode == 200) {
            this.loading = false;
            // tryHideFullScreenLoading();
            this.$globals.closeContent();
            this.getData();
            this.$message({
              type: "success",
              message: "撤销成功",
            });
          } else {
            this.loading = false;
            // tryHideFullScreenLoading();
            this.$globals.closeContent();
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
    //单个开票
    handelSingleBill(index, row) {
      // var data = row;
      let params = {
        id: row.id,
      };
      var that = this;
      getDetailsById(params)
        .then((res) => {
          if (res && res.code == "200") {
            that.$router.push({
              path: "/lightningInvoicing",
              query: {
                List: JSON.stringify({
                  data: res.data,
                  item: row,
                  type: "hongzixinxi",
                }),
              },
            });
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
    // 红字信息下载
    getForm(val) {
      console.log(val);
      if (val) {
        // this.redDownloadVisible = false;
        let applyParams = {
          buyerTaxId: val.consumerTaxNo, //购方税号
          sellerTaxId: val.saleTaxNo, //销方税号
          startInputDate: "", //开始日期
          endInputDate: "", //结束日期
          noticeNo: val.infoNo, //信息表编号
          tableScope: "", //下载范围
          deviceNo: this.taxDiskNum, //税盘号
        };
        if (val.redType1 == true && val.redType2 == true) {
          applyParams.tableScope = "0";
        } else if (val.redType1 == true && val.redType2 == false) {
          applyParams.tableScope = "1";
        } else if (val.redType1 == false && val.redType2 == true) {
          applyParams.tableScope = "2";
        }

        let date1 = new Date(val.startTime);
        let year1 = date1.getFullYear();
        let month1 = date1.getMonth() + 1;
        let day1 = date1.getDate();
        year1 = year1 < 10 ? "0" + year1 : year1;
        month1 = month1 < 10 ? "0" + month1 : month1;
        day1 = day1 < 10 ? "0" + day1 : day1;
        applyParams.startInputDate = year1 + "" + month1 + "" + day1;

        let date2 = new Date(val.datetime);
        let year2 = date2.getFullYear();
        let month2 = date2.getMonth() + 1;
        let day2 = date2.getDate();
        year2 = year2 < 10 ? "0" + year2 : year2;
        month2 = month2 < 10 ? "0" + month2 : month2;
        day2 = day2 < 10 ? "0" + day2 : day2;
        applyParams.endInputDate = year2 + "" + month2 + "" + day2;
        this.loading = true;
        // showFullScreenLoading("下载中,请稍候");
        clearTimeout(this.timer);
        this.$alert("", "下载中,请稍候", {
          confirmButtonText: "停止下载",
          iconClass: "el-icon-loading",
          center: true,
          showClose: false,
          callback: (action) => {
            clearTimeout(this.timer);
            this.loading = false;
          },
        });
        this.redLetterListDownload(applyParams);
      }
    },

    async redLetterListDownload(applyParams) {
      const res = await redInfoTabDownload(applyParams);
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
            message: "下载失败",
          });
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
            this.$message({
              type: "error",
              message: "税局服务不稳定，请稍后再试",
            });
          } else {
            clearTimeout(this.timer);
            // tryHideFullScreenLoading();
            this.$globals.closeContent();
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
            this.loading = false;
            // tryHideFullScreenLoading();
            this.$globals.closeContent();
            this.getData();
            this.$message({
              type: "success",
              message: "下载成功",
            });
          } else {
            this.loading = false;
            // tryHideFullScreenLoading();
            this.$globals.closeContent();
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

    // 批量打印
    handlePrint() {
      //     ------原生打印
      if (this.multipleSelection.length > 0) {
        if (localStorage.getItem("cefSharpinit_other") && JSON.parse(localStorage.getItem("cefSharpinit_other")).printName !== '') {
          var idList = [];
          var that = this;
          this.multipleSelection.forEach((item) => {
            idList.push(item.id);
          });
          redLetterPrint(idList)
            .then((res) => {
              if (res && res.code == "200") {
                that.printRedInformation(res.data);
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
              this.printType = "cefSharpinit_other";
            })
            .catch(() => {});
        }
      } else {
        this.$message({
          type: "warning",
          message: "未选中任何数据",
        });
      }
    },

    printRedInformation(data) {
      let applyParams = {
        printer: {
          printName: JSON.parse(localStorage.getItem("cefSharpinit_other"))
            .printName, //打印机名称
          offsetX: JSON.parse(localStorage.getItem("cefSharpinit_other"))
            .offsetX, //x轴偏移量
          offsetY: JSON.parse(localStorage.getItem("cefSharpinit_other"))
            .offsetY, //y轴偏移量
        }, //打印机
        redInformationTableInfoArray: data,
      };
      printRedInformationTable(applyParams)
        .then((res) => {
          if (res && res.code == "0") {
            console.log(res);
            that.$message({
              type: "success",
              message: "打印成功",
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

.page-container >>> .cell {
  cursor: pointer;
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
.date {
  display: flex;
  align-items: center;
}

.serachBox >>> .el-form {
  position: relative;
  /* top: 15px; */
}
.serachBox >>> .el-form-item__error {
  top: 75%;
}
.rightNav {
  display: inline-block;
  cursor: pointer;
  margin-right: 15px;
  margin-top: 2px;
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