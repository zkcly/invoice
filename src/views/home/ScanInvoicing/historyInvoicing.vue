<template>
  <div id="historyInvoicing">
    <el-card class="box-card-title">
      <div class="nav-flex">
        <div class="nav-left" @click="goToPages('ScanInvoicing')">
          <span class="el-icon-arrow-left"> {{ title }}</span>
        </div>

        <div class="nav-right">
          <el-button type="primary" @click="deleteTable()">删 除</el-button>
          <el-button type="primary" @click="printTable()">打 印</el-button>
          <el-button type="primary" @click="resendTable()">重 发</el-button>
        </div>
      </div>
    </el-card>

    <el-card class="box-card-content">
      <el-form
        ref="searchRel"
        :model="searchForm"
        label-width="80px"
        :inline="true"
      >
        <el-form-item label="小票状态: ">
          <el-select v-model="searchForm.invoiceVal" placeholder="请选择">
            <el-option
              v-for="item in invoiceStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="开票时间: ">
          <el-date-picker
            v-model="searchForm.invoiceDate"
            type="month"
            placeholder="选择月"
            :picker-options="pickerOptions0"
          >
          </el-date-picker>
        </el-form-item>

        <el-button type="primary" @click="searchData">查询</el-button>
      </el-form>

      <el-table
        :data="invoiceData"
        v-loading="loading"
        style="width: 100%"
        height="550"
        :default-sort="{ prop: 'createDate', order: 'descending' }"
        @selection-change="handleSelectionChange"
      >
        <div slot="empty">
          <listnodate :tableFlag="noDateFlag" />
        </div>
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          prop="invoiceSeries"
          label="开票流水号"
          min-width="110"
        >
        </el-table-column>
        <el-table-column label="发票类型" min-width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.invoiceType == '004'">增值税专用发票</span>
            <span v-if="scope.row.invoiceType == '005'"
              >机动车销售统一发票</span
            >
            <span v-if="scope.row.invoiceType == '007'">增值税普通发票</span>
            <span v-if="scope.row.invoiceType == '025'">卷式发票</span>
            <span v-if="scope.row.invoiceType == '026'">电子普通发票</span>
            <span v-if="scope.row.invoiceType == '028'">电子专用发票</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="totalPriceWithTax"
          label="价税合计"
          min-width="110"
        >
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="小票生成时间"
          min-width="140"
          sortable
        >
        </el-table-column>
        <el-table-column prop="endDate" label="开票截止时间" min-width="110">
        </el-table-column>
        <el-table-column label="状态" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0"
              ><i class="point-i" style="background-color: gray"></i
              >未开小票</span
            >
            <span v-if="scope.row.status == 1"
              ><i class="point-i" style="background-color: blue"></i
              >过期小票</span
            >
            <span v-if="scope.row.status == 2"
              ><i class="point-i" style="background-color: green"></i
              >开票成功</span
            >
            <span v-if="scope.row.status == 3"
              ><i class="point-i" style="background-color: red"></i
              >开票失败</span
            >
            <span v-if="scope.row.status == 4"
              ><i class="point-i" style="background-color: orange"></i
              >作废小票</span
            >
            <span v-if="scope.row.status == 5"
              ><i class="point-i" style="background-color: red"></i
              >退回小票</span
            >
          </template>
        </el-table-column>
        <el-table-column label="原因" min-width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 3 || scope.row.status == 5">{{
              scope.row.cause
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190">
          <template slot-scope="scope">
            <!-- <el-button type="text" size="small" @click="toVoid(scope.row)" v-if="scope.row.status == 0">作废</el-button>
                    <el-button type="text" size="small" @click="toRegenerate(scope.row)" v-if="scope.row.status == 1">重新生成</el-button>
                    <el-button type="text" size="small" @click="toModify(scope.row)" v-if="scope.row.status == 3 || scope.row.status == 5">修改</el-button>
                    <el-button type="text" size="small" @click="toView(scope.row)" v-if="scope.row.status == 2">查看</el-button> -->
            <template v-if="scope.row.status == 0">
              <el-button type="text" size="small" @click="toVoid(scope.row)"
                >作废</el-button
              >
              <el-button type="text" size="small" disabled>重新生成</el-button>
              <el-button type="text" size="small" disabled>修改</el-button>
              <el-button type="text" size="small" disabled>查看</el-button>
            </template>
            <template v-if="scope.row.status == 1">
              <el-button type="text" size="small" disabled>作废</el-button>
              <el-button
                type="text"
                size="small"
                @click="toRegenerate(scope.row)"
                >重新生成</el-button
              >
              <el-button type="text" size="small" disabled>修改</el-button>
              <el-button type="text" size="small" disabled>查看</el-button>
            </template>
            <template v-if="scope.row.status == 2">
              <el-button type="text" size="small" disabled>作废</el-button>
              <el-button type="text" size="small" disabled>重新生成</el-button>
              <el-button type="text" size="small" disabled>修改</el-button>
              <el-button type="text" size="small" @click="toView(scope.row)"
                >查看</el-button
              >
            </template>
            <template v-if="scope.row.status == 3 || scope.row.status == 5">
              <el-button type="text" size="small" disabled>作废</el-button>
              <el-button type="text" size="small" disabled>重新生成</el-button>
              <el-button type="text" size="small" @click="toModify(scope.row)"
                >修改</el-button
              >
              <el-button type="text" size="small" disabled>查看</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div class="pages">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.pagenum"
          :page-sizes="[10, 20, 50, 100, 200]"
          :page-size="searchForm.pagesize"
          layout="total,sizes,prev,pager,next,jumper"
          :total="total"
          background
        >
        </el-pagination>
      </div>

      <!-- 发送弹框 -->
    
      <el-dialog
        width="380px"
        :visible.sync="sendVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :before-close="closeSend"
        destroy-on-close
        append-to-body
      >
        <div class="sendVisible">
          <h3>收票人信息</h3>
          <el-form ref="form" :model="form" label-width="120px" :rules="rules">
            <el-form-item label="收票人手机号：" prop="tel">
              <el-input v-model.trim="form.tel" type="number"></el-input>
            </el-form-item>
            <el-form-item label="收票人邮箱：" prop="email">
              <el-input v-model.trim="form.email"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeSend">取 消</el-button>
          <el-button type="primary" @click="updatePush">确 定</el-button>
        </span>
      </el-dialog>
    

    </el-card>

    <!-- 发票展示组件 -->
    <!-- <el-dialog :title="invoicePreviewTitle" width="70%" :visible.sync="invoicePreviewVisible" :close-on-click-modal="false" :close-on-press-escape="false" destroy-on-close> -->
    <InvoicePreview
      :taxDetail="taxDetail"
      :visible.sync="invoicePreviewVisible"
    ></InvoicePreview>
    <!-- </el-dialog> -->

    <!-- 打印机设置组件 -->
    <PrintSetting :visible.sync="printVisible" :printType="printType">
    </PrintSetting>
  </div>
</template>

<script>
import Listnodate from "@/components/ListNoDate";
import InvoicePreview from "../components/InvoicePreview.vue";
import {
  queryScanHistory,
  delScanHistory,
  printScanHistory,
  resendScanHistory,
  voidScanHistory,
  regenerateScanHistory,
  updatePush,
  viewScanHistory,
  historyPrint,
  viewInvoiceDetail,
} from "@/api/scanInvoicing.js";
import {
  getInstalledPrintersApi,
  PrintInvoiceApi,
  PrintTicketArray,
} from "@/api/cefSharp.js";
import PrintSetting from "../components/PrintSetting";

export default {
  name: "historyInvoicing",
  components: { Listnodate, InvoicePreview, PrintSetting },
  data() {
    return {
      title: "历史",
      printVisible: false, //发票弹框
      printType: "cefSharpinit_xp", //发票类型
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7;
        },
      },

      searchForm: {
        invoiceVal: "",
        invoiceDate: "",
        // 分页
        pagenum: 1,
        pagesize: 10,
      },
      // 总数据条数
      total: 0,

      // 小票状态
      invoiceStatus: [
        { value: "", label: "全部小票" },
        { value: "0", label: "未开小票" },
        { value: "1", label: "过期小票" },
        { value: "2", label: "开票成功" },
        { value: "3", label: "开票失败" },
        { value: "4", label: "作废小票" },
        { value: "5", label: "退回小票" },
      ],

      // 小票列表数据
      invoiceData: [
        // {id:'221', invoiceSeries: '1231231231', invoiceType: '004', totalPriceWithTax: '1231', createDate: '2019-12-12', endDate: '2020-12-12', status: '0', cause: '系统繁忙' },
        // {id:'222', invoiceSeries: '12312314132', invoiceType: '005', totalPriceWithTax: '1231.12', createDate: '2018-12-12', endDate: '2020-12-12', status: '1', cause: '系统繁忙/未知错误' },
        // {id:'223', invoiceSeries: '31231231', invoiceType: '007', totalPriceWithTax: '1231', createDate: '2020-12-12', endDate: '2020-12-12', status: '2', cause: '税率 3%' },
        // {id:'224', invoiceSeries: '1231231231', invoiceType: '025', totalPriceWithTax: '12312', createDate: '2019-11-12', endDate: '2020-12-12', status: '3', cause: '未知错误' },
        // {id:'225', invoiceSeries: '1231231', invoiceType: '026', totalPriceWithTax: '12312', createDate: '2011-12-10', endDate: '2020-12-12', status: '4', cause: '系统繁忙/未知错误' },
        // {id:'226', invoiceSeries: '1231231231', invoiceType: '028', totalPriceWithTax: '12312', createDate: '2019-08-12', endDate: '2020-12-12', status: '5', cause: '系统繁忙/未知错误' },
        // {id:'12312', cause: '原因', companyUserId: 25134324123, createDate: '', differentialTaxationAmount: -1, endDate: '', fhr: '复核人', invoiceSeries: 1231241, invoiceType: '026',	kpr: '开票人', pushMail: '推送邮箱', pushPhone: '推送手机号', remark: '备注', rqCodeUrl: '', sellerAddrTel: '销售方地址电话', sellerBankAccount: '销售方开户银行账号', sellerName: '销售方名称', sellerTaxId: '销售方税号', skr: '收款人', status: 5, taxDiskNum: '所属税盘', taxationType: 2, totalPriceWithTax: 123.2, },
      ],
      invoiceData_el: [
        {
          cause: "原因", //string  //原因 -----------------------------
          companyUserId: 25134324123, //integer($int32) //企业开票人员ID
          createDate: "", //string($date)   //创建日期 -----------------
          differentialTaxationAmount: "差额征税扣除额int", //number  //差额征税扣除额
          endDate: "", //string($date)   //截止时间 ------------------
          fhr: "复核人", //string  //复核人
          id: 12312, //integer($int64) //ID
          invoiceSeries: "开票流水号int", //integer($int64) //开票流水号 -----------------
          invoiceType: "发票类型", //string  //发票类型 004、007、026、028 ------------
          kpr: "开票人", //string  //开票人
          mailAddress: "邮寄地址", //string  //邮寄地址
          mainProductName: "主要商品名称", //string  //主要商品名称
          pushMail: "推送邮箱", //string  //推送邮箱
          pushPhone: "推送手机号", //string  //推送手机号
          remark: "备注", //string  //备注
          rqCodeUrl: "", //string
          sellerAddrTel: "销售方地址电话", //string  //销售方地址电话
          sellerBankAccount: "销售方开户银行账号", //string  //销售方开户银行账号
          sellerName: "销售方名称", //string  //销售方名称
          sellerTaxId: "销售方税号", //string  //销售方税号
          skr: "收款人", //string  //收款人
          status: "状态int", //integer($int32) //状态 0.未开 1.过期 2.开票成功 3.开票失败 4.作废 5.退回 --------
          ticketPushMail: "小票推送邮箱", //string  //小票推送邮箱
          ticketPushPhone: "小票推送手机号", //string  //小票推送手机号
          taxDiskNum: "所属税盘", //string  //所属税盘
          taxationType: "征税方式int", //integer($int32) //征税方式 0：普通征税 1：减按计征 2：差额征税
          totalPriceWithTax: "价税合计int", //number  //价税合计 -------------------
          totalAmount: "总金额(不含税金额)", //number  //总金额(不含税金额)
          totalTaxAmount: "总税额", //number  //总税额
        },
      ],
      loading: false,

      // 被选中的列表数据
      multipleSelection: [],

      // 列表是否有数据
      noDateFlag: "successNoDate",

      // 发票展示
      invoicePreviewVisible: false,
      isElectronic: false,
      invoicePreviewTitle: "发票展示", // isElectronic ? '发票展示':'电子发票展示',

      // 盘号
      taxDiskNum: "",
      //查询开票时间
      searchDate: "",
      taxDetail: {},

      sendVisible: false,
      form: {
          tel: '',
          email: ''
      },
      rules: {
        tel: [
          { required: false, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^(1)\d{10}$/,
            message: "请输入正确的手机号格式",
            trigger: "blur",
          },
        ],
        email: [
          { required: false, message: "请输入邮箱账号", trigger: "blur" },
          { max: 30, message: "长度不能超过30", trigger: "blur" },
          {
            pattern:
              /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/,
            message: "请输入正确的邮箱格式",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {},
  mounted() {
    this.taxDiskNum = this.$store.state.user.taxDiskNum;
    this.onSubmit();
  },

  computed: {},
  methods: {
    searchData() {
      this.searchForm.pagenum = 1;
      this.searchDate = this.searchForm.invoiceDate;
      this.onSubmit();
    },
    // 路由跳转 - 返回
    goToPages(item) {
      this.$router.push({ name: item });
    },

    // 查询按钮
    onSubmit() {
      this.invoiceData = [];
      let params = {
        status: this.searchForm.invoiceVal
          ? parseInt(this.searchForm.invoiceVal)
          : this.searchForm.invoiceVal,
        keyword: "",
        date: this.searchDate
          ? this.$moment(this.searchDate).format("YYYY-MM")
          : this.searchDate,
        pageNum: this.searchForm.pagenum,
        pageSize: this.searchForm.pagesize,
        timeDesc: "",
        taxDiskNum: this.taxDiskNum, //所属税盘
      };

      this.loading = true;
      queryScanHistory(params)
        .then((response) => {
          if (response && response.code == "200") {
            let res = response.data;
            this.invoiceData = res.records;
            this.total = res.total;
          }
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.noDateFlag = "err";
        });
    },

    // 列表中的勾选事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log("--勾选事件--", val);
    },
    // 删除选中的数据(可多选)
    deleteTable() {
      if (this.multipleSelection.length > 0) {
        this.$confirm("此操作将删除被选数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.deleteTableAjax();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消成功",
            });
          });
      } else {
        this.$alert("请选择要删除的数据!", "提示", {
          confirmButtonText: "确定",
        });
      }
    },
    deleteTableAjax() {
      let arr = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        const el = this.multipleSelection[i];
        arr.push(el.id);
      }
      let params = arr;
      var box = arr;
      console.log("jkparams", params);

      delScanHistory(params)
        .then((response) => {
          if (response && response.code == "200") {
            let res = response.data;

            this.$message({
              type: "success",
              message: "删除成功",
            });
            if (box.length == this.invoiceData.length) {
              this.searchForm.pagenum = 1;
            }
            this.onSubmit();
          }
        })
        .catch((error) => {});
      console.log("删除按钮", this.multipleSelection);
    },

    // 打印选中的数据
    printTable() {
      if (this.multipleSelection.length > 0) {
        this.printTableAjax();
      } else {
        this.$alert("请选择要打印的数据!", "提示", {
          confirmButtonText: "确定",
        });
      }
    },
    printTableAjax() {
      if (
        localStorage.getItem("cefSharpinit_xp") &&
        JSON.parse(localStorage.getItem("cefSharpinit_xp")).printName !== ""
      ) {
        historyPrint(this.multipleSelection.map((el) => el.id)).then(
          (response) => {
            let params1 = {
              printer: {
                printName: JSON.parse(localStorage.getItem("cefSharpinit_xp"))
                  .printName, //打印机名称,
                pageWidth: JSON.parse(localStorage.getItem("cefSharpinit_xp"))
                  .offsetX, //打印宽度mm
              },
              ticketInfoArray: response.data,
            };
            PrintTicketArray(params1).then((res) => {
              if (res.code == 0) {
                // this.$message.success('打印成功');
              }
            });
          }
        );
      } else {
        this.$confirm("找不到打印机,请先进行打印机设置", "提示", {
          confirmButtonText: "去设置",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.printVisible = true;
          })
          .catch(() => {});
      }
    },
    // 重发选中的数据
    resendTable() {
      console.log(this.multipleSelection[0]);
      
        if (this.multipleSelection.length == 1) {
            if (
                !this.multipleSelection[0].ticketPushMail &&
                !this.multipleSelection[0].ticketPushPhone
            ) { 
                this.sendVisible = true;
            } 
            else{
                this.resendTableAjax();
            }    
        } else {
          // this.$alert('请选择要重发的数据!', '提示', {
          //     confirmButtonText: '确定',
          // });
          this.$alert("请选择一条要重发的数据!", "提示", {
            confirmButtonText: "确定",
          });
        }
      
      // if (this.multipleSelection.length > 0) {
    },
    closeSend() {
      this.$refs["form"].resetFields();
      this.sendVisible = false;
    },
    updatePush(){
        if (!this.form.tel  && !this.form.email) {
        this.$message({
          type: "info",
          message: "手机号与邮箱必须填一项",
        });
        return;
      }
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          const res = await updatePush({
            invoiceSeries: this.multipleSelection[0].invoiceSeries,
            ticketPushMail: this.form.email || null,
            ticketPushPhone: this.form.tel || null,
          });
          if (res.code == 200) {
            this.$refs["form"].resetFields();
            this.resendTableAjax()
            this.sendVisible = false;
          } else {
            // this.$message({
            //   type: "error",
            //   message: res.msg,
            // });
          }
          

        } else {
          return false;
        }
      });
    },
    resendTableAjax() {
      let params = {
        invoiceSeries: this.multipleSelection[0].invoiceSeries,
      };
      console.log("jkparams", params);

      resendScanHistory(params)
        .then((response) => {
          if (response && response.code == "200") {
            this.$message.success(response.data);
            this.onSubmit()
          } else if (response.msg && response.code != "500") {
            this.$message.error(response.msg);
          }
        })
        .catch((error) => {});
      console.log("删除按钮", this.multipleSelection);
    },

    // table列表事件按钮 ---------------------------------------------

    // 作废
    toVoid(item) {
      let params = {
        id: item.id ? item.id : "",
      };
      console.log("jkparams", params);

      voidScanHistory(params)
        .then((response) => {
          if (response && response.code == "200") {
            let res = response.data;
            this.$message.success("作废成功");
            this.onSubmit();
          }
        })
        .catch((error) => {});
      console.log("作废按钮", item);
    },

    // 重新生成
    toRegenerate(item) {
      let params = {
        id: item.id ? item.id : "",
      };
      console.log("jkparams", params);

      this.loading = true;
      regenerateScanHistory(params)
        .then((response) => {
          if (response && response.code == "200") {
            this.loading = false;

            let res = response.data;
            this.onSubmit();
          }
        })
        .catch((error) => {
          this.loading = false;
        });
      console.log("重新生成按钮", item);
    },

    // 修改
    toModify(item) {
      viewInvoiceDetail(item.invoiceSeries)
        .then((response) => {
          if (response && response.code == "200") {
            let res = response.data;
            // 跳回扫码开票页面
            this.$router.push({
              // path: 'scanInvoicing',
              name: "ScanInvoicing",
              query: {
                // historyInvoicing: JSON.stringify(res)
                List: JSON.stringify({
                  data: res,
                  type: "historyInvoicing",
                }),
              },
            });
          }
        })
        .catch((error) => {});
    },

    // 查看
    toView(item) {
      this.invoicePreviewVisible = true;
      item.isReview = true
      this.taxDetail = item;
      // let params = {
      //     invoiceSeries: item.invoiceSeries     //小票流水号
      // }
      // console.log('jkparams', params);
      // viewScanHistory(params).then(response => {
      //     if(response&&response.code=='200'){
      //         this.loading=false
      //         let res = response.data

      //         this.invoicePreviewVisible = true
      //     }
      // }).catch(error => {
      //     this.loading=false
      // })
      // console.log('查看按钮', item)
      // this.invoicePreviewVisible = true
    },

    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      console.log(newSize);
      this.searchForm.pagesize = newSize;
      this.onSubmit();
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.searchForm.pagenum = newPage;
      this.onSubmit();
    },
  },
};
</script>

<style scoped>
/* .box-card-title {
    margin: 0px 0 5px;
} */

.nav-flex {
  display: flex;
  justify-content: space-between;
}
.nav-left {
  height: 40px;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #252525;
  line-height: 40px;
  cursor: pointer;
}

.box-card-content >>> .cell {
  padding-left: 14px;
}

.pages {
  display: flex;
  flex-direction: row-reverse;
  margin-top: 15px;
}

.point-i {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 5px;
}
</style>
