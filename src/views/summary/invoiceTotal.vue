<template>
  <div class="invoiceTotal">
    <div class="borderBottom navBox">
      <breadnav :textTitle="title" @leftEvent="clickLeft" />
      <div class="rightNavBox">
        <div class="rightNav" @click="sureExport">
          <img src="../../assets/images/export.png" alt="图片" class="navImg" />
          <span class="navTex">导出</span>
        </div>
        <div class="rightNav" @click="showRepairDialog">
          <img src="../../assets/images/fix.png" alt="图片" class="navImg" />
          <span class="navTex">修复</span>
        </div>
        <div class="rightNav" @click="prints">
          <img src="../../assets/images/print.png" alt="图片" class="navImg" />
          <span class="navTex">打印</span>
        </div>
      </div>
    </div>
    <div class="listContent pl25">
      <div class="serchBox">
        <el-form :inline="true" :model="serchForm" class="demo-form-inline">
          <el-form-item label="">
            <el-select
              v-model="serchForm.type"
              placeholder="请选择"
              @change="hanleChangeType"
            >
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="(item, key) in typeList"
                :key="key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select
              v-model="serchForm.table"
              placeholder="请选择"
              @change="handleChangeTable"
            >
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="(item, key) in tableList"
                :key="key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select
              v-model="serchForm.ymj"
              placeholder=""
              @change="handleChangeFun"
            >
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="(item, key) in ymjList"
                :key="key"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-select
              v-model="serchForm.year"
              placeholder=""
              @change="handleChangeSelectYear"
              ref="yearList"
            >
              <el-option
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
                v-for="(item, key) in yearList"
                :key="key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" v-show="this.selectMonth">
            <el-select
              v-model="serchForm.month"
              placeholder=""
              @change="handleChangeSelectMonth"
              ref="monthList"
            >
              <el-option
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
                v-for="(item, key) in monthList"
                :key="key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" v-show="this.selectQuarter">
            <el-select
              v-model="serchForm.quarter"
              placeholder=""
              @change="handleChangeSelectQuarter"
              ref="quarterList"
            >
              <el-option
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
                v-for="(item, key) in quarterList"
                :key="key"
              ></el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item label="" >
            <el-date-picker
              v-model="serchForm.date"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item> -->
        </el-form>
        <div class="serchBtn" @click="queryList">查询</div>
      </div>
      <div ref="statisticsTable">
        <div class="maintitle">
          {{ Maintitle }}
        </div>
        <ul class="tottalDeati clearfix" v-if="tableOption">
          <li class="detailItem">
            正数发票份数：{{ this.positiveInvoiceCount }}
          </li>
          <li class="detailItem">
            正数废票份数：{{ this.positiveInvalidInvoiceCount }}
          </li>
          <li class="detailItem">
            负数发票份数：{{ this.negativeInvoiceCount }}
          </li>
          <li class="detailItem">
            负数废票份数：{{ this.negativeInvalidInvoiceCount }}
          </li>
          <li class="detailItem">
            合计发票份数：{{
              this.negativeInvalidInvoiceCount +
              this.negativeInvoiceCount +
              this.positiveInvalidInvoiceCount +
              this.positiveInvoiceCount
            }}
          </li>
        </ul>
        <div class="tableBox">
          <el-table
            v-if="tableOption"
            :data="tableData"
            :row-class-name="tableRowClassName"
            style="width: 100%"
          >
            <div slot="empty">
              <listnodate :tableFlag="noDateFlag" />
            </div>
            <el-table-column prop="name" label="项目名称"> </el-table-column>
            <el-table-column prop="amountTotal" label="合计"> </el-table-column>
            <el-table-column prop="amount13" label="13%"> </el-table-column>
            <el-table-column prop="amount9" label="9%"> </el-table-column>
            <el-table-column prop="amount6" label="6%"> </el-table-column>
            <el-table-column prop="amount5" label="5%"> </el-table-column>
            <el-table-column prop="amount3" label="3%"> </el-table-column>
            <el-table-column prop="amount1" label="1%"> </el-table-column>
            <el-table-column prop="amountOther" label="其他"> </el-table-column>
          </el-table>

          <el-table
            v-else
            :data="tableData2"
            style="width: 100%"
            v-loading="loading"
          >
            <div slot="empty">
              <listnodate :tableFlag="noDateFlag" />
            </div>
            <el-table-column prop="invoiceType" label="发票类型">
            </el-table-column>
            <el-table-column prop="invoiceCode" label="发票代码">
            </el-table-column>
            <el-table-column prop="invoiceNo" label="发票号码">
            </el-table-column>
            <el-table-column prop="invoiceDate" label="开票时间">
              <!-- <template slot-scope="scope">
                {{scope.row.invoiceDate.split(' ')[0]}}
              </template> -->
            </el-table-column>
            <el-table-column prop="buyerName" label="购方名称">
            </el-table-column>
            <el-table-column prop="buyerTaxId" label="购方税号">
            </el-table-column>
            <el-table-column prop="totalAmount" label="合计金额">
            </el-table-column>
            <el-table-column prop="totalTaxAmount" label="合计税额">
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- <div class="paginBox">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[10, 20]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
        >
        </el-pagination>
      </div> -->
    </div>
    <invoice-repair
      :visible.sync="invoiceRepairVisibility"
      @getForm="getForm"
      :repairData="repairData"
    />
    <print-setting :visible.sync="printVisible" :printType="printType" />
  </div>
</template>


<script type="text/ecmascript-6">
import Breadnav from "@/components/Breadnav";
import Listnodate from "@/components/ListNoDate";
import { validStrCheckLength } from "@/utils/validate";
import { UtilsGetTicketType } from "@/utils/function";
import { downloadFile } from "@/utils/function.js";
import { getRedis, getRedisList } from "@/api/taxStock";
import InvoiceRepair from "@/views/management/components/InvoiceRepair.vue";
import PrintSetting from "@/views/home/components/PrintSetting";
import {
  showFullScreenLoading,
  tryHideFullScreenLoading,
} from "@/utils/loadingX";
import { invoiceRepair } from "@/api/invoicesearch";
import {
  getDiskTicketType,
  getStatistics,
  getStatisticsList,
  exportStatistics,
  exportStatisticsPdf,
  printInvoiceStatistical,
  PrintStatistical
} from "@/api/invoiceStatistics";
export default {
  name: "invoiceTotal",
  components: {
    Breadnav,
    InvoiceRepair,
    Listnodate,
    PrintSetting,
  },
  data() {
    const validateSearchText = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入关键字"));
      } else if (!validStrCheckLength(value, 40)) {
        console.log("ssss");
        callback(new Error("最多可以输入40个字符（20个汉字）"));
      } else {
        callback();
      }
    };
    return {
      printVisible: false,
      printType: "cefSharpinit_pp",

      title: "开票统计",
      Maintitle: "",
      noDateFlag: "successNoDate",
      currentPage4: 4,
      selectMonth: true,
      selectQuarter: false,
      invoiceRepairVisibility: false,
      tableOption: true, //表格形式
      key3: [],
      taxDiskChannel: "",
      loading: false,
      taxDiskNum: "",
      serchForm: {
        type: "",
        table: "0",
        ymj: "0",
        month: "1",
        quarter: "1",
        year: "1",
      },
      typeList: [],
      typeValue: "",
      monthValue: "",
      yearValue: "",
      quarterValue: "",
      tableValue: "",
      positiveInvoiceCount: "",
      negativeInvalidInvoiceCount: "",
      negativeInvoiceCount: "",
      positiveInvalidInvoiceCount: "",
      tableList: [
        { label: "发票汇总表", value: "0" },
        { label: "正数发票清单", value: "1" },
        { label: "负数发票清单", value: "2" },
        { label: "正数废票清单", value: "3" },
        { label: "负数废票清单", value: "4" },
      ],
      ymjList: [
        { label: "月度", value: "0" },
        { label: "季度", value: "1" },
        { label: "年度", value: "2" },
      ],
      monthList: [
        { label: "一月", value: "1" },
        { label: "二月", value: "2" },
        { label: "三月", value: "3" },
        { label: "四月", value: "4" },
        { label: "五月", value: "5" },
        { label: "六月", value: "6" },
        { label: "七月", value: "7" },
        { label: "八月", value: "8" },
        { label: "九月", value: "9" },
        { label: "十月", value: "10" },
        { label: "十一月", value: "11" },
        { label: "十二月", value: "12" },
      ],
      quarterList: [
        { label: "第一季度", value: "1" },
        { label: "第二季度", value: "2" },
        { label: "第三季度", value: "3" },
        { label: "第四季度", value: "4" },
      ],
      yearList: [
        { label: 2021, value: "1" },
        { label: 2020, value: "2" },
        { label: 2019, value: "3" },
      ],

      tableAmount: {},

      tableData: [],

      tableData2: [],
      repairData: {
        invoiceTypeList: [],
        invoiceType: "",
      },
      taxId: "",
      companyName: "",
    };
  },
  created() {},
  watch: {
    taxDiskNumChange: {
      handler: function (newval, oldval) {
        if (newval !== oldval) {
          this.taxDiskNum = newval;
        }
      },
      deep: true,
    },
    taxIdChange: {
      handler: function (newval, oldval) {
        if (newval !== oldval) {
          this.taxId = newval;
        }
      },
      deep: true,
    },
    companyNameChange: {
      handler: function (newval, oldval) {
        if (newval !== oldval) {
          this.companyName = newval;
        }
      },
      deep: true,
    },
  },
  computed: {
    taxDiskNumChange() {
      return this.$store.state.user.taxDiskNum;
    },
    taxIdChange() {
      return this.$store.state.user.loginInfo.taxId;
    },
    companyNameChange() {
      return this.$store.state.user.loginInfo.companyName;
    },
  },
  mounted() {
    console.log(this.$store.state.user);
    this.taxDiskNum = this.taxDiskNumChange;
    this.taxId = this.taxIdChange;
    this.companyName = this.companyNameChange;
    this.taxDiskChannel = this.$store.state.user.taxDiskInfo.taxDiskChannel;
    this.getDiskTicketType();

    // this.updateMonth(this.$refs.yearList.value);

    if (JSON.parse(localStorage.getItem("invoiceTotalDefault")) == null) {
      let date = new Date();
      let month = date.getMonth() + 1;
      let quarter = month / 3 + 1;
      this.serchForm.month = "" + month;
      this.yearValue = this.findValue(this.yearList, "1");
      this.monthValue = this.findValue(this.monthList, month);
      this.quarterValue = this.findValue(this.quarterList, quarter);
      this.tableValue = this.findValue(this.tableList, "0");
      this.typeValue = UtilsGetTicketType(this.serchForm.type)[0].label;
      this.updateMonth("1", false);
      this.queryList1();
      this.makeTitle();
    } else {
      let Allobj = JSON.parse(localStorage.getItem("invoiceTotalDefault"));
      if (Allobj.hasOwnProperty(this.taxDiskNum)) {
        let obj = Allobj[this.taxDiskNum];
        if (obj.dateType == 0) {
          console.log(obj);
          this.handleChangeFun(0);
          this.serchForm.ymj = obj.dateType;
          this.serchForm.type = obj.invoiceType;
          this.repairData.invoiceType = obj.invoiceType;
          this.serchForm.month = obj.month;
          this.serchForm.table = obj.queryType;
          this.serchForm.taxDiskNum = obj.taxDiskNum;
          this.serchForm.year =
            obj.year == 2021 ? "1" : obj.year == 2020 ? "2" : "3";

          this.yearValue = obj.year;
          this.monthValue = this.monthList[obj.month - 1].label;
          this.tableValue = this.tableList[obj.queryType].label;
          this.typeValue = UtilsGetTicketType(obj.invoiceType)[0].label;
          this.makeTitle();
          this.updateMonth(
            obj.year == 2021 ? "1" : obj.year == 2020 ? "2" : "3",
            false
          );
          if (obj.queryType == 0) {
            this.queryList1();
          } else {
            this.queryList2();
            this.tableOption = false;
          }
        } else if (obj.dateType == 1) {
          // console.log(obj);
          this.handleChangeFun(1);
          this.serchForm.ymj = obj.dateType;
          this.serchForm.type = obj.invoiceType;
          this.serchForm.table = obj.queryType;
          this.serchForm.taxDiskNum = obj.taxDiskNum;
          this.serchForm.quarter = obj.season;
          this.serchForm.year =
            obj.year == 2021 ? "1" : obj.year == 2020 ? "2" : "3";

          this.yearValue = obj.year;
          this.quarterValue = this.quarterList[obj.season - 1].label;
          this.tableValue = this.tableList[obj.queryType].label;
          this.typeValue = UtilsGetTicketType(obj.invoiceType)[0].label;
          this.makeTitle();
          this.updateQuarter(
            obj.year == 2021 ? "1" : obj.year == 2020 ? "2" : "3",
            false
          );
          if (obj.queryType == 0) {
            this.queryList1();
          } else {
            this.queryList2();
            this.tableOption = false;
          }
        } else {
          console.log(obj);
          this.handleChangeFun(2);
          this.serchForm.ymj = obj.dateType;
          this.serchForm.type = obj.invoiceType;
          console.log(this.serchForm.type);
          this.serchForm.table = obj.queryType;
          this.serchForm.taxDiskNum = obj.taxDiskNum;
          this.serchForm.year =
            obj.year == 2021 ? "1" : obj.year == 2020 ? "2" : "3";

          this.yearValue = obj.year;
          this.tableValue = this.tableList[obj.queryType].label;
          this.typeValue = UtilsGetTicketType(obj.invoiceType)[0].label;
          this.makeTitle();
          if (obj.queryType == 0) {
            this.queryList1();
          } else {
            this.queryList2();
            this.tableOption = false;
          }
        }
      } else {
        let date = new Date();
        let month = date.getMonth() + 1;
        let quarter = month / 3 + 1;
        this.serchForm.month = "" + month;
        this.yearValue = this.findValue(this.yearList, "1");
        this.monthValue = this.findValue(this.monthList, month);
        this.quarterValue = this.findValue(this.quarterList, quarter);
        this.tableValue = this.findValue(this.tableList, "0");
        this.typeValue = UtilsGetTicketType(this.serchForm.type)[0].label;
        this.queryList1();
        this.makeTitle();
      }
    }
  },
  methods: {
    //获取票种类型
    async getDiskTicketType() {
      const res = await getDiskTicketType({ taxDiskNum: this.taxDiskNum });
      if (res.code == 200) {
        this.typeList = UtilsGetTicketType(res.data.ticketType);

        this.repairData.invoiceTypeList = UtilsGetTicketType(
          res.data.ticketType
        );
        // this.serchForm.type = UtilsGetTicketType(res.data.ticketType)[0].value;
        this.repairData.invoiceType =
          JSON.parse(localStorage.getItem("invoiceTotalDefault"))[
            this.taxDiskNum
          ].invoiceType || res.data.ticketType.split(",")[0];
        // this.makeTitle()
        // console.log(JSON.parse(localStorage.getItem("invoiceTotalDefault"))[this.taxDiskNum].invoiceType)
        this.serchForm.type =
          JSON.parse(localStorage.getItem("invoiceTotalDefault"))[
            this.taxDiskNum
          ].invoiceType || res.data.ticketType.split(",")[0];
        this.typeValue = UtilsGetTicketType(this.serchForm.type)[0].label;
        // console.log(this.serchForm.type)
      }
    },

    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },

    //表格变颜色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 4 || rowIndex === 9) {
        return "success-row";
      }
    },

    //拼接标题
    makeTitle() {
      if (this.selectMonth == true && this.selectQuarter == false) {
        this.Maintitle =
          this.yearValue +
          "年" +
          this.monthValue +
          (this.serchForm.type == "004" || this.serchForm.type == "007"
            ? ""
            : "增值税") +
          this.typeValue +
          (this.tableValue == "发票汇总表"
            ? this.tableValue.slice(2)
            : this.tableValue);
      } else if (this.selectMonth == false && this.selectQuarter == true) {
        this.Maintitle =
          this.yearValue +
          "年" +
          this.quarterValue +
          (this.serchForm.type == "004" || this.serchForm.type == "007"
            ? ""
            : "增值税") +
          this.typeValue +
          (this.tableValue == "发票汇总表"
            ? this.tableValue.slice(2)
            : this.tableValue);
      } else {
        this.Maintitle =
          this.yearValue +
          "全年" +
          (this.serchForm.type == "004" || this.serchForm.type == "007"
            ? ""
            : "增值税") +
          this.typeValue +
          (this.tableValue == "发票汇总表"
            ? this.tableValue.slice(2)
            : this.tableValue);
      }
    },

    //多选
    handleSelectionChange(val) {
      console.log("选中", val);
      this.multipleSelection = val;
    },
    clickLeft() {
      this.$router.push({ name: "managementIndex" });
    },
    moveOneFun() {
      this.$message({
        message: "移除成功",
        type: "success",
      });
    },
    moveMoreFun() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "请选择要移除的数据",
          type: "warning",
        });
      }
    },

    searchFun() {
      this.$refs["searchOne"].validate((valid) => {
        if (valid) {
        } else {
          console.log("error 11111111");
          return false;
        }
      });
    },

    //导出
    async sureExport() {
      if (this.serchForm.table == 0) {
        var data = {
          dateType: this.serchForm.ymj,
          invoiceType: this.serchForm.type,
          queryType: this.serchForm.table,
          taxDiskNum: this.taxDiskNum,
          year: this.yearList[this.serchForm.year - 1].label,
        };
        if (this.serchForm.ymj == 0) {
          data.month = this.serchForm.month;
        } else if (this.serchForm.ymj == 1) {
          data.season = this.serchForm.quarter;
        }
        const res = await exportStatisticsPdf(data);
        downloadFile(res, "发票测试");
      } else {
        var data = {
          dateType: this.serchForm.ymj,
          invoiceType: this.serchForm.type,
          queryType: this.serchForm.table,
          taxDiskNum: this.taxDiskNum,
          year: this.yearList[this.serchForm.year - 1].label,
        };
        if (this.serchForm.ymj == 0) {
          data.month = this.serchForm.month;
        } else if (this.serchForm.ymj == 1) {
          data.season = this.serchForm.quarter;
        }
        const res = await exportStatistics(data);
        downloadFile(res, "发票测试");
      }
    },
    showRepairDialog() {
      this.invoiceRepairVisibility = true;
    },
    //获取修复发票表单数据
    getForm(formData) {
      console.log(formData);
      if (formData) {
        this.invoiceRepairVisibility = false;
        this.loading = true;
        // showFullScreenLoading("修复中,请稍候");
        this.$alert("", "修复中,请稍候", {
          confirmButtonText: "停止修复",
          iconClass: "el-icon-loading",
          center: true,
          showClose: false,
          callback: (action) => {
            clearTimeout(this.timer);
            this.loading = false;
            this.continue = false;
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
          console.log(res.data);
          this.loading = true;
          this.getRedis3();
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
          } else if (count >= 60 && this.loading == true) {
            clearTimeout(this.timer);
            this.$globals.closeContent();
            this.$message({
              type: "error",
              message: "税局服务不稳定，请稍后再试",
            });
          } else {
            clearTimeout(this.timer);
            this.loading = false;
            // tryHideFullScreenLoading();
            this.$globals.closeContent();
          }
        }, s);
        this.timer = time1;
      };
      if ((this.loading = true)) {
        timeOut(s, fn);
      }
    },
    //查询请求
    async getRedis3() {
      const res = await getRedisList(this.key3);
      if (res.data.code == 1) {
        clearTimeout(this.timer);
        if (res.data.msgCode == 200) {
          console.log(123);
          this.loading = false;
          // tryHideFullScreenLoading();
          this.$globals.closeContent();
          this.$message({
            type: "success",
            message: "修复成功",
          });
        } else {
          this.loading = false;
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
    },

    //匹配value对应的label
    findValue(array, string) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].value == string) {
          var Value = array[i].label;
        }
      }
      return Value;
    },
    //下拉框改变状态
    hanleChangeType(val) {
      console.log(this.serchForm.type);
      this.typeValue = this.findValue(this.typeList, this.serchForm.type);
      this.repairData.invoiceType = val;
      // this.makeTitle();
    },
    handleChangeTable(val) {
      this.tableValue = this.findValue(this.tableList, this.serchForm.table);
      // this.makeTitle();
      // if (val == 0) {
      //   this.tableOption = true;
      // } else {
      //   this.tableOption = false;
      // }
    },
    handleChangeSelectYear(val) {
      console.log(val);
      this.updateMonth(val, true);
      this.updateQuarter(val, true);
      this.yearValue = this.findValue(this.yearList, this.serchForm.year);
      // this.makeTitle();
    },
    handleChangeSelectMonth(val) {
      this.monthValue = this.findValue(this.monthList, this.serchForm.month);
      // this.makeTitle();
    },
    handleChangeSelectQuarter(val) {
      this.quarterValue = this.findValue(
        this.quarterList,
        this.serchForm.quarter
      );
      // this.makeTitle();
    },
    handleChangeFun(val) {
      console.log(val);
      switch (parseInt(val)) {
        case 0:
          console.log("已选中月度");
          this.selectMonth = true;
          this.selectQuarter = false;
          this.updateMonth(this.serchForm.year, true);
          // this.makeTitle();
          break;
        case 1:
          console.log("已选中季度");
          this.selectQuarter = true;
          this.selectMonth = false;
          this.updateQuarter(this.serchForm.year, true);
          // this.makeTitle();
          break;
        case 2:
          console.log("已选中年度");
          this.selectMonth = false;
          this.selectQuarter = false;
          // this.makeTitle();
          break;
        default:
          break;
      }
    },

    //更新月度季度状态
    updateMonth(val, option) {
      var date = new Date();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      if (year == this.yearList[val - 1].label) {
        // if(JSON.parse(localStorage.getItem("invoiceTotalDefault")) == null){
        //     this.serchForm.month = '' + month
        //   }
        console.log("是今年");
        if (option == true) {
          this.serchForm.month = "" + month;
          this.monthValue = this.findValue(this.monthList, month);
        }

        for (let i = month; i < 12; i++) {
          this.monthList[i].disabled = true;
        }
      } else {
        console.log("不是今年");
        for (let i = month; i < 12; i++) {
          this.monthList[i].disabled = false;
        }
      }
    },
    updateQuarter(val, option) {
      var date = new Date();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      var newMonth =
        month % 3 == 0 ? parseInt(month / 3) : parseInt(month / 3) + 1;
      if (year == this.yearList[val - 1].label) {
        if (option == true) {
          this.serchForm.quarter = "" + newMonth;
          this.quarterValue = this.findValue(this.quarterList, newMonth);
        }
        for (let i = newMonth; i < 4; i++) {
          this.quarterList[i].disabled = true;
          // if(JSON.parse(localStorage.getItem("invoiceTotalDefault")) == null){
          //   this.serchForm.quarter =  '' + (parseInt(month / 3) + 1)
          // }
        }
      } else {
        for (let i = parseInt(month / 3) + 1; i < 4; i++) {
          this.quarterList[i].disabled = false;
        }
      }
    },

    queryList() {
      console.log("123");
      if (this.serchForm.table == 0) {
        this.queryList1();
      } else {
        this.queryList2();
      }
    },
    //点击查询发票汇总表
    async queryList1() {
      var data = {
        dateType: this.serchForm.ymj,
        invoiceType: this.serchForm.type,
        queryType: this.serchForm.table,
        taxDiskNum: this.taxDiskNum,
        year: this.yearList[this.serchForm.year - 1].label,
      };
      if (this.serchForm.ymj == 0) {
        data.month = this.serchForm.month;
      } else if (this.serchForm.ymj == 1) {
        data.season = this.serchForm.quarter;
      }
      let defaultDate = {
        [this.taxDiskNum]: data,
      };
      localStorage.setItem("invoiceTotalDefault", JSON.stringify(defaultDate));
      this.tableOption = true;
      const res = await getStatistics(data);
      if (res.code == 200) {
        // console.log(res);
        this.negativeInvalidInvoiceCount = res.data.negativeInvalidInvoiceCount;
        this.negativeInvoiceCount = res.data.negativeInvoiceCount;
        this.positiveInvalidInvoiceCount = res.data.positiveInvalidInvoiceCount;
        this.positiveInvoiceCount = res.data.positiveInvoiceCount;

        this.tableAmount.negativeAmount = res.data.negativeAmount;
        this.tableAmount.negativeInvalidAmount = res.data.negativeInvalidAmount;
        this.tableAmount.negativeInvalidTaxAmount =
          res.data.negativeInvalidTaxAmount;
        this.tableAmount.negativeTaxAmount = res.data.negativeTaxAmount;
        this.tableAmount.positiveAmount = res.data.positiveAmount;
        this.tableAmount.positiveInvalidAmount = res.data.positiveInvalidAmount;
        this.tableAmount.positiveInvalidTaxAmount =
          res.data.positiveInvalidTaxAmount;
        this.tableAmount.positiveTaxAmount = res.data.positiveTaxAmount;
      }

      let newArr = [];
      let amount1 = 0,
        amount3 = 0,
        amount5 = 0,
        amount6 = 0,
        amount9 = 0,
        amount13 = 0,
        amountOther = 0,
        amountTotal = 0;
      let Qamount1 = 0,
        Qamount3 = 0,
        Qamount5 = 0,
        Qamount6 = 0,
        Qamount9 = 0,
        Qamount13 = 0,
        QamountOther = 0,
        QamountTotal = 0;
      for (let i = 0; i < Object.keys(this.tableAmount).length; i++) {
        // console.log(Object.keys(this.tableAmount)[i]);
        let newObj = {};
        if (Object.keys(this.tableAmount)[i] == "negativeAmount") {
          newObj = {
            ...{ name: "销项负数金额" },
            ...Object.values(this.tableAmount)[i],
          };
          amount1 = amount1 + Object.values(this.tableAmount)[i].amount1;
          amount3 = amount3 + Object.values(this.tableAmount)[i].amount3;
          amount5 = amount5 + Object.values(this.tableAmount)[i].amount5;
          amount6 = amount6 + Object.values(this.tableAmount)[i].amount6;
          amount9 = amount9 + Object.values(this.tableAmount)[i].amount9;
          amount13 = amount13 + Object.values(this.tableAmount)[i].amount13;
          amountOther =
            amountOther + Object.values(this.tableAmount)[i].amountOther;
          amountTotal =
            amountTotal + Object.values(this.tableAmount)[i].amountTotal;
          newArr.push(newObj);
          console.log(newObj);
        } else if (
          Object.keys(this.tableAmount)[i] == "negativeInvalidAmount"
        ) {
          newObj = {
            ...{ name: "销项负废金额" },
            ...Object.values(this.tableAmount)[i],
          };
          newArr.push(newObj);
        } else if (
          Object.keys(this.tableAmount)[i] == "negativeInvalidTaxAmount"
        ) {
          newObj = {
            ...{ name: "销项负废税额" },
            ...Object.values(this.tableAmount)[i],
          };
          newArr.push(newObj);
        } else if (Object.keys(this.tableAmount)[i] == "negativeTaxAmount") {
          newObj = {
            ...{ name: "销项负数税额" },
            ...Object.values(this.tableAmount)[i],
          };
          Qamount1 = Qamount1 + Object.values(this.tableAmount)[i].amount1;
          Qamount3 = Qamount3 + Object.values(this.tableAmount)[i].amount3;
          Qamount5 = Qamount5 + Object.values(this.tableAmount)[i].amount5;
          Qamount6 = Qamount6 + Object.values(this.tableAmount)[i].amount6;
          Qamount9 = Qamount9 + Object.values(this.tableAmount)[i].amount9;
          Qamount13 = Qamount13 + Object.values(this.tableAmount)[i].amount13;
          QamountOther =
            QamountOther + Object.values(this.tableAmount)[i].amountOther;
          QamountTotal =
            QamountTotal + Object.values(this.tableAmount)[i].amountTotal;
          newArr.push(newObj);
        } else if (Object.keys(this.tableAmount)[i] == "positiveAmount") {
          newObj = {
            ...{ name: "销项正数金额" },
            ...Object.values(this.tableAmount)[i],
          };
          amount1 = amount1 + Object.values(this.tableAmount)[i].amount1;
          amount3 = amount3 + Object.values(this.tableAmount)[i].amount3;
          amount5 = amount5 + Object.values(this.tableAmount)[i].amount5;
          amount6 = amount6 + Object.values(this.tableAmount)[i].amount6;
          amount9 = amount9 + Object.values(this.tableAmount)[i].amount9;
          amount13 = amount13 + Object.values(this.tableAmount)[i].amount13;
          amountOther =
            amountOther + Object.values(this.tableAmount)[i].amountOther;
          amountTotal =
            amountTotal + Object.values(this.tableAmount)[i].amountTotal;
          newArr.push(newObj);
        } else if (
          Object.keys(this.tableAmount)[i] == "positiveInvalidAmount"
        ) {
          newObj = {
            ...{ name: "销项正废金额" },
            ...Object.values(this.tableAmount)[i],
          };

          newArr.push(newObj);
        } else if (
          Object.keys(this.tableAmount)[i] == "positiveInvalidTaxAmount"
        ) {
          newObj = {
            ...{ name: "销项正废税额" },
            ...Object.values(this.tableAmount)[i],
          };
          newArr.push(newObj);
        } else if (Object.keys(this.tableAmount)[i] == "positiveTaxAmount") {
          newObj = {
            ...{ name: "销项正数税额" },
            ...Object.values(this.tableAmount)[i],
          };
          Qamount1 = Qamount1 + Object.values(this.tableAmount)[i].amount1;
          Qamount3 = Qamount3 + Object.values(this.tableAmount)[i].amount3;
          Qamount5 = Qamount5 + Object.values(this.tableAmount)[i].amount5;
          Qamount6 = Qamount6 + Object.values(this.tableAmount)[i].amount6;
          Qamount9 = Qamount9 + Object.values(this.tableAmount)[i].amount9;
          Qamount13 = Qamount13 + Object.values(this.tableAmount)[i].amount13;
          QamountOther =
            QamountOther + Object.values(this.tableAmount)[i].amountOther;
          QamountTotal =
            QamountTotal + Object.values(this.tableAmount)[i].amountTotal;
          newArr.push(newObj);
        }
      }

      newArr.splice(4, 0, {
        name: "实际销项金额",
        amount1: amount1.toFixed(2),
        amount3: amount3.toFixed(2),
        amount5: amount5.toFixed(2),
        amount6: amount6.toFixed(2),
        amount9: amount9.toFixed(2),
        amount13: amount13.toFixed(2),
        amountOther: amountOther.toFixed(2),
        amountTotal: amountTotal.toFixed(2),
      });
      newArr.splice(9, 0, {
        name: "实际销项税额",
        amount1: Qamount1.toFixed(2),
        amount3: Qamount3.toFixed(2),
        amount5: Qamount5.toFixed(2),
        amount6: Qamount6.toFixed(2),
        amount9: Qamount9.toFixed(2),
        amount13: Qamount13.toFixed(2),
        amountOther: QamountOther.toFixed(2),
        amountTotal: QamountTotal.toFixed(2),
      });

      [
        newArr[0],
        newArr[1],
        newArr[2],
        newArr[3],
        newArr[5],
        newArr[6],
        newArr[7],
        newArr[8],
      ] = [
        newArr[5],
        newArr[6],
        newArr[0],
        newArr[1],
        newArr[8],
        newArr[7],
        newArr[3],
        newArr[2],
      ];
      this.tableData = newArr;
      this.makeTitle();
    },

    //点击查询发票清单
    async queryList2() {
      var data = {
        dateType: this.serchForm.ymj,
        invoiceType: this.serchForm.type,
        queryType: this.serchForm.table,
        taxDiskNum: this.taxDiskNum,
        year: this.yearList[this.serchForm.year - 1].label,
      };
      if (this.serchForm.ymj == 0) {
        data.month = this.serchForm.month;
      } else if (this.serchForm.ymj == 1) {
        data.season = this.serchForm.quarter;
      }
      let defaultDate = {
        [this.taxDiskNum]: data,
      };
      localStorage.setItem("invoiceTotalDefault", JSON.stringify(defaultDate));
      this.tableOption = false;
      const res = await getStatisticsList(data);
      if (res.code == 200) {
        console.log(res);
        res.data.forEach((item) => {
          item.invoiceType = UtilsGetTicketType(item.invoiceType)[0].label;
          item.invoiceDate = item.invoiceDate.split(" ")[0];
        });
        this.tableData2 = res.data;
        this.makeTitle();
      }
    },
    //打印
    prints() {
      if (JSON.parse(localStorage.getItem("cefSharpinit_other")) == null) {
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
      else if(JSON.parse(localStorage.getItem("cefSharpinit_other")) && JSON.parse(localStorage.getItem("cefSharpinit_other")).printName == ''){
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
      else {
        this.printFun("cefSharpinit_other");
      }
    },
    async printFun(val) {
      let printObj = JSON.parse(localStorage.getItem(val));
      let dateVal = this.serchForm;
      let startDate = "";
      let endDate = "";
      console.log(dateVal);
      if (dateVal.ymj == "0") {
        //月份
        startDate =
          this.yearList[dateVal.year - 1].label +
          "年" +
          dateVal.month +
          "月1日";
        endDate =
          this.yearList[dateVal.year - 1].label +
          "年" +
          dateVal.month +
          "月31日";
      } else if (dateVal.ymj == "1") {
        //季度
        switch (parseInt(dateVal.quarter)) {
          case 1:
            startDate = this.yearList[dateVal.year - 1].label + "年" + "1月1日";
            endDate = this.yearList[dateVal.year - 1].label + "年" + "3月31日";
            break;
          case 2:
            startDate = this.yearList[dateVal.year - 1].label + "年" + "4月1日";
            endDate = this.yearList[dateVal.year - 1].label + "年" + "6月30日";
            break;
          case 3:
            startDate = this.yearList[dateVal.year - 1].label + "年" + "7月1日";
            endDate = this.yearList[dateVal.year - 1].label + "年" + "9月30日";
            break;
          case 4:
            startDate =
              this.yearList[dateVal.year - 1].label + "年" + "10月1日";
            endDate = this.yearList[dateVal.year - 1].label + "年" + "12月31日";
            break;
          default:
            break;
        }
      } else {
        //年份
        startDate = this.yearList[dateVal.year - 1].label + "年" + "1月1日";
        endDate = this.yearList[dateVal.year - 1].label + "年" + "12月31日";
      }
      if (this.tableOption) {
        console.log(startDate);
        console.log(endDate);
        let data = {
          printer: {
            printName: printObj.printName,
            offsetX: printObj.offsetX,
            offsetY: printObj.offsetY,
          },
          invoiceStatisticalInfo: {
            title: this.Maintitle,
            taxId: this.taxId,
            diskId: this.taxDiskNum,
            businessName: this.companyName,
            startDate,
            endDate,

            positiveInvoiceCount: this.positiveInvoiceCount,
            negativeInvoiceCount: this.negativeInvoiceCount,
            positiveInvalidInvoiceCount: this.positiveInvalidInvoiceCount,
            negativeInvalidInvoiceCount: this.negativeInvalidInvoiceCount,
            //销项正数金额
            positiveAmountTotal: this.tableData[0].amountTotal,
            positiveAmount13: this.tableData[0].amount13,
            positiveAmount9: this.tableData[0].amount9,
            positiveAmount6: this.tableData[0].amount6,
            positiveAmount5: this.tableData[0].amount5,
            positiveAmount3: this.tableData[0].amount3,
            positiveAmount1: this.tableData[0].amount1,
            positiveAmountOther: this.tableData[0].amountOther,
            //销项正废金额
            positiveInvalidAmountTotal: this.tableData[1].amountTotal,
            positiveInvalidAmount13: this.tableData[1].amount13,
            positiveInvalidAmount9: this.tableData[1].amount9,
            positiveInvalidAmount6: this.tableData[1].amount6,
            positiveInvalidAmount5: this.tableData[1].amount5,
            positiveInvalidAmount3: this.tableData[1].amount3,
            positiveInvalidAmount1: this.tableData[1].amount1,
            positiveInvalidAmountOther: this.tableData[1].amountOther,
            //销项负数金额
            negativeAmountTotal: this.tableData[2].amountTotal,
            negativeAmount13: this.tableData[2].amount13,
            negativeAmount9: this.tableData[2].amount9,
            negativeAmount6: this.tableData[2].amount6,
            negativeAmount5: this.tableData[2].amount5,
            negativeAmount3: this.tableData[2].amount3,
            negativeAmount1: this.tableData[2].amount1,
            negativeAmountOther: this.tableData[2].amountOther,
            //销项负废金额
            negativeInvalidAmountTotal: this.tableData[3].amountTotal,
            negativeInvalidAmount13: this.tableData[3].amount13,
            negativeInvalidAmount9: this.tableData[3].amount9,
            negativeInvalidAmount6: this.tableData[3].amount6,
            negativeInvalidAmount5: this.tableData[3].amount5,
            negativeInvalidAmount3: this.tableData[3].amount3,
            negativeInvalidAmount1: this.tableData[3].amount1,
            negativeInvalidAmountOther: this.tableData[3].amountOther,
            //实际销项金额
            totalAmountTotal: this.tableData[4].amountTotal,
            totalAmount13: this.tableData[4].amount13,
            totalAmount9: this.tableData[4].amount9,
            totalAmount6: this.tableData[4].amount6,
            totalAmount5: this.tableData[4].amount5,
            totalAmount3: this.tableData[4].amount3,
            totalAmount1: this.tableData[4].amount1,
            totalAmountOther: this.tableData[4].amountOther,
            //销项正数税额
            positiveTaxAmountTotal: this.tableData[5].amountTotal,
            positiveTaxAmount13: this.tableData[5].amount13,
            positiveTaxAmount9: this.tableData[5].amount9,
            positiveTaxAmount6: this.tableData[5].amount6,
            positiveTaxAmount5: this.tableData[5].amount5,
            positiveTaxAmount3: this.tableData[5].amount3,
            positiveTaxAmount1: this.tableData[5].amount1,
            positiveTaxAmountOther: this.tableData[5].amountOther,
            //销项正废税额
            positiveInvalidTaxAmountTotal: this.tableData[6].amountTotal,
            positiveInvalidTaxAmount13: this.tableData[6].amount13,
            positiveInvalidTaxAmount9: this.tableData[6].amount9,
            positiveInvalidTaxAmount6: this.tableData[6].amount6,
            positiveInvalidTaxAmount5: this.tableData[6].amount5,
            positiveInvalidTaxAmount3: this.tableData[6].amount3,
            positiveInvalidTaxAmount1: this.tableData[6].amount1,
            positiveInvalidTaxAmountOther: this.tableData[6].amountOther,
            //销项负数税额
            negativeTaxAmountTotal: this.tableData[7].amountTotal,
            negativeTaxAmount13: this.tableData[7].amount13,
            negativeTaxAmount9: this.tableData[7].amount9,
            negativeTaxAmount6: this.tableData[7].amount6,
            negativeTaxAmount5: this.tableData[7].amount5,
            negativeTaxAmount3: this.tableData[7].amount3,
            negativeTaxAmount1: this.tableData[7].amount1,
            negativeTaxAmountOther: this.tableData[7].amountOther,
            //销项负废税额
            negativeInvalidTaxAmountTotal: this.tableData[8].amountTotal,
            negativeInvalidTaxAmount13: this.tableData[8].amount13,
            negativeInvalidTaxAmount9: this.tableData[8].amount9,
            negativeInvalidTaxAmount6: this.tableData[8].amount6,
            negativeInvalidTaxAmount5: this.tableData[8].amount5,
            negativeInvalidTaxAmount3: this.tableData[8].amount3,
            negativeInvalidTaxAmount1: this.tableData[8].amount1,
            negativeInvalidTaxAmountOther: this.tableData[8].amountOther,
            //实际销项税额
            totalTaxAmountTotal: this.tableData[9].amountTotal,
            totalTaxAmount13: this.tableData[9].amount13,
            totalTaxAmount9: this.tableData[9].amount9,
            totalTaxAmount6: this.tableData[9].amount6,
            totalTaxAmount5: this.tableData[9].amount5,
            totalTaxAmount3: this.tableData[9].amount3,
            totalTaxAmount1: this.tableData[9].amount1,
            totalTaxAmountOther: this.tableData[9].amountOther,
          },
        };
        const res = await printInvoiceStatistical(data);
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "打印成功",
          });
        } else {
          this.$message({
            type: "error",
            message: res.message,
          });
        }
      } else {
        console.log(this.tableData2)
        let data = {
          printer: {
            printName: printObj.printName,
            offsetX: printObj.offsetX,
            offsetY: printObj.offsetY,
          },
          data: {
            header: {
              title: this.Maintitle,
              startDate,
              endDate,
              taxId: this.taxId,
              taxName: this.companyName,
              diskId: this.taxDiskNum,
            },
            body: {
              columnInfos: [
                {
                  columnName: "发票类型",
                  columnMapField: "invoiceType",
                },
                {
                  columnName: "发票代码",
                  columnMapField: "invoiceCode",
                },
                {
                  columnName: "发票号码",
                  columnMapField: "invoiceNo",
                },
                {
                  columnName: "开票时间",
                  columnMapField: "invoiceDate",
                },
                {
                  columnName: "购方名称",
                  columnMapField: "buyerName",
                },
                {
                  columnName: "购方税号",
                  columnMapField: "buyerTaxId",
                },
                {
                  columnName: "合计金额",
                  columnMapField: "totalAmount",
                },
                {
                  columnName: "合计税额",
                  columnMapField: "totalTaxAmount",
                },
              ],
              dataInfos: this.tableData2,
            },
          },
        };
        const res = await PrintStatistical(data);
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "打印成功",
          });
        } else {
          this.$message({
            type: "error",
            message: res.message,
          });
        }
      }
    },
  },
};
</script>


<style scoped>
.navBox {
  position: relative;
}
.invoiceTotal {
  box-sizing: border-box;
  background-color: #ffffff;
}

.rightNavBox {
  float: right;
  height: 62px;
  line-height: 62px;
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
.serchBox {
  position: relative;
  padding-top: 13px;
}
.serchBtn {
  width: 74px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: #5e8cf9;
  border-radius: 2px;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  position: absolute;
  left: 64%;
  top: 17px;
  /*transform: translateY(-50%);*/
  cursor: pointer;
}

.maintitle {
  font-size: 18px;
  font-weight: 600;
  font-family: PingFangSC-Medium, PingFang SC;
  color: rgba(0, 0, 0, 0.85);
  height: 25px;
  line-height: 25px;
}

.serchBox >>> .el-form-item {
  width: 12%;
}

.serchBox >>> .el-date-editor--daterange.el-input__inner {
  width: 200%;
  position: relative;
  top: 4px;
}
.serchBox >>> .el-date-editor .el-range-input {
  width: 100%;
}
.serchBox >>> .el-icon-date {
  position: relative;
  top: -3px;
}
.serchBox >>> .el-date-editor .el-range-separator {
  position: relative;
  top: -3px;
}

.serchBox >>> .el-input__inner,
.reviewInvoicing >>> .el-input__icon {
  height: 32px;
  line-height: 32px;
}
.detailItem {
  float: left;
  margin-right: 20px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}
/* .tottalDeati{
    position: relative;
    top:-20px;
  } */
.tableBox {
  padding-bottom: 100px;
}
.paginBox {
  padding-bottom: 20px;
  padding-right: 25px;
  text-align: right;
}

.el-table >>> .success-row {
  background: rgb(214, 233, 248);
}
</style>

