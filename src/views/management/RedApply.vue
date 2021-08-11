<template>
  <div class="page-container">
    <div class="page-header">
      <div class="breadNav" @click="clickLeft">
        <i class="el-icon-arrow-left"></i>
        <span class="navText">{{ boxTitle }}</span>
      </div>
      <!-- <div>
        <breadnav :textTitle="boxTitle" @leftEvent='clickLeft'/>
      </div> -->
    </div>
    <div v-if="!invoiceVisibility" class="page-content">
      <div class="box">
        <h3>开具红字发票信息选择</h3>
        <div class="info-box">
          <el-radio
            v-model="applyType"
            :label="1"
            @change="applyTypeChange"
            :disabled="type == 'fapiaochaxun'"
            ><span style="margin-left: 15px">一、购买方申请</span></el-radio
          >
          <p
            style="
              height: 18px;
              font-size: 14px;
              color: #787878;
              margin-left: 35px;
            "
          >
            对应蓝字专用发票抵扣增值税销项税额情况
          </p>
          <el-radio-group
            v-model="radio"
            style="margin-left: 35px"
            :disabled="radioDisabled"
          >
            <el-radio :label="0" @change="radioChange">已抵扣</el-radio>
            <el-radio :label="1" @change="radioChange">未抵扣</el-radio>
          </el-radio-group>
        </div>
        <div class="info-box">
          <el-radio :label="2" v-model="applyType" @change="applyTypeChange"
            ><span style="margin-left: 15px">二、销售方申请</span></el-radio
          >
        </div>
        <h3>对应蓝字发票信息</h3>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
          size="mini"
          style="padding-bottom: 20px"
        >
          <el-form-item
            label="发票类型"
            prop="invoiceType"
            :rules="{
              required: true,
              message: '发票类型不能为空',
              trigger: 'change',
            }"
          >
            <el-select
              v-model="ruleForm.invoiceType"
              placeholder="请选择发票类型"
              @change='invoiceChange'
            >
              <el-option
                v-for="status in invoiceTypeList"
                :key="status.id"
                :label="status.label"
                :value="status.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="发票代码"
            prop="code"
            :rules="{
              required: radio === 1 || applyType === 2,
              message: '请输入正确的发票代码',
              trigger: 'blur',
              pattern: /^(\d{10}|\d{12})$/,
            }"
          >
            <el-input
              v-model.trim="ruleForm.code"
              :disabled="radio === 0 && applyType === 1"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="发票号码"
            prop="invoiceNo"
            :rules="{
              required: radio === 1 || applyType === 2,
              message: '请输入正确的发票号码',
              trigger: 'blur',
              pattern: /^(\d{8})$/,
            }"
          >
            <el-input
              v-model.trim="ruleForm.invoiceNo"
              :disabled="radio === 0 && applyType === 1"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="开票时间"
            prop="datetime"
            :rules="{
              required: radio === 1 || applyType === 2,
              message: '开票时间不能空',
              trigger: 'blur',
            }"
          >
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="ruleForm.datetime"
              style="width: 100%"
              :disabled="radio === 0 && applyType === 1"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="clickLeft">取 消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >下一步</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="page-content">
      <red-invoice v-if="invoiceVisibility" />
    </div>
  </div>
</template>

<script>
import RedInvoice from "./components/RedInvoice.vue";
import { getDiskTicketType } from "@/api/billType.js";
import { UtilsGetTicketType } from "@/utils/function";
import Breadnav from "@/components/Breadnav";
import { getInvoiceInfo } from "@/api/redLetterListApi.js";

export default {
  name: "RedApply",
  components: {
    RedInvoice,
    Breadnav,
  },
  data() {
    return {
      boxTitle: "申请",
      applyType: 2, //申请类型
      radio: 0, //已抵扣
      radioDisabled: true,
      ruleForm: {
        invoiceType: "",
        code: "",
        invoiceNo: "",
        datetime: new Date(),
      },
      invoiceTypeList: [],
      rules: {},
      invoiceVisibility: false,

      taxDiskNum: "", //税盘号
      routeList: "",
      row: "",
      type: "",
      //缓存的发票类型
      cacheInvoiceType:'',
    };
  },
  created() {},
  computed: {
    taxDiskNumChange() {
      return this.$store.state.user.taxDiskNum;
    },
  },
  mounted() {
    this.taxDiskNum = this.$store.state.user.taxDiskNum;
    this.getBillType();
    this.getParams();
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
    invoiceChange(){
      this.cacheInvoiceType=this.ruleForm.invoiceType
    },
    getParams() {
      if (this.$route.query.data) {
        var box = JSON.parse(this.$route.query.data);
      }
      if (box) {
        this.routeList = box;
        this.row = this.routeList.row;
        if (this.row) {
          this.type = "fapiaochaxun";
        }
        this.ruleForm.invoiceType = this.routeList.row.invoiceType
          ? this.routeList.row.invoiceType
          : "";
        this.ruleForm.code = this.routeList.row.invoiceCode
          ? this.routeList.row.invoiceCode
          : "";
        this.ruleForm.invoiceNo = this.routeList.row.invoiceNo
          ? this.routeList.row.invoiceNo
          : "";
        this.ruleForm.datetime = this.routeList.row.invoiceDate
          ? this.routeList.row.invoiceDate
          : new Date();
      }
    },
    // 返回
    clickLeft() {
      if (this.type == "fapiaochaxun") {
        this.$router.push("/management/summaryManagement/InvoiceInquiry");
      } else {
        this.$router.push("/management/invoicingManagement/redLetters");
      }
    },
    applyTypeChange() {
      this.$refs.ruleForm.resetFields();
      this.ruleForm.invoiceType = this.cacheInvoiceType;
      if (this.applyType == "1") {
        this.radioDisabled = false;
        if (this.radio == "0") {
          this.ruleForm.datetime = null;
        } else if (this.radio == "1") {
          this.ruleForm.datetime = new Date();
        }
      } else if (this.applyType == "2") {
        this.radioDisabled = true;
      }
    },
    radioChange() {
      this.$refs.ruleForm.resetFields();
      this.ruleForm.invoiceType = this.cacheInvoiceType;
      if (this.radio == "0") {
        this.ruleForm.datetime = null;
      } else if (this.radio == "1") {
        this.ruleForm.datetime = new Date();
      }
    },
    //获取发票类型
    getBillType() {
      let applyParams = {
        taxDiskNum: this.taxDiskNum, //税盘号
      };
      var that = this;
      getDiskTicketType(applyParams)
        .then((res) => {
          if (res && res.code == "200") {
            var b = UtilsGetTicketType(res.data.ticketType);
            // that.invoiceTypeList=b;
            b.forEach((item) => {
              if (item.value == "004" || item.value == "028") {
                that.invoiceTypeList.push(item);
              }
            });
            that.ruleForm.invoiceType = that.invoiceTypeList[0].value;
            that.cacheInvoiceType= that.invoiceTypeList[0].value;
          }
        })
        .catch((error) => {});
    },
    submitForm(formName) {
      if (this.applyType == "1") {
        if (this.radio == "0") {
          var data = {
            applyType: this.applyType,
            radio: this.radio,
            ruleForm: this.ruleForm,
            type: "shenqing",
            row: this.row,
          };
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$router.push({
                path: "/management/invoicingManagement/redSaleApply",
                query: {
                  data: JSON.stringify(data),
                },
              });
              // this.$refs.ruleForm.resetFields();
            }
          });
        } else if (this.radio == "1") {
          var data = {
            applyType: this.applyType,
            radio: this.radio,
            ruleForm: this.ruleForm,
            type: "shenqing",
            row: this.row,
          };
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$router.push({
                path: "/management/invoicingManagement/redSaleApply",
                query: {
                  data: JSON.stringify(data),
                },
              });
              // this.$refs.ruleForm.resetFields();
              // let applyParams = {
              //   invoiceCode: this.ruleForm.code,
              //   invoiceNo: this.ruleForm.invoiceNo,
              //   invoiceType: this.ruleForm.invoiceType,
              //   invoiceDate: this.getLocalTime(this.ruleForm.datetime),
              // };
              // var that = this;
              // getInvoiceInfo(applyParams)
              //   .then((res) => {
              //     if (res && res.code == "200") {
              //       that.$router.push({
              //         path: "/management/invoicingManagement/redSaleApply",
              //         query: {
              //           data: JSON.stringify(data),
              //         },
              //       });
              //       that.$refs.ruleForm.resetFields();
              //     } else {
              //       // that.$message({
              //       //   type: "warning",
              //       //   message: res.msg,
              //       // });
              //     }
              //   })
              //   .catch((error) => {});
            }
          });
        }
      } else if (this.applyType == "2") {
        var data = {
          applyType: this.applyType,
          radio: this.radio,
          ruleForm: this.ruleForm,
          type: "shenqing",
          row: this.row,
        };
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // this.$router.push('/management/invoicingManagement/redSaleApply')
            let applyParams = {
              invoiceCode: this.ruleForm.code,
              invoiceNo: this.ruleForm.invoiceNo,
              invoiceType: this.ruleForm.invoiceType,
              invoiceDate: this.getLocalTime(this.ruleForm.datetime),
            };
            var that = this;
            getInvoiceInfo(applyParams)
              .then((res) => {
                if (res && res.code == "200") {
                  that.$router.push({
                    path: "/management/invoicingManagement/redSaleApply",
                    query: {
                      data: JSON.stringify(data),
                    },
                  });
                  // that.$refs.ruleForm.resetFields();
                } else {
                  // that.$message({
                  //   type: "warning",
                  //   message: res.msg,
                  // });
                }
              })
              .catch((error) => {});
          }
        });
      }
      // var data = row;
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
  },
};
</script>

<style lang="scss" scoped>
.page-container {
  background: white;
  padding: 0;
}
.page-header {
  padding: 25px 25px 25px 25px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 64px;
  border-bottom: 2px solid #ececec;
}
.box {
  width: 30%;
  margin: 0 auto;

  .info-box {
    padding: 20px;
  }
}

.page-content {
  margin-top: 40px;
  // margin-bottom: 40px;
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