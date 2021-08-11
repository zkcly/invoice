<template>
  <div>
    <el-dialog
      title="发票修复"
      :visible.sync="visible"
      :before-close="handleCancel"
      :close-on-click-modal="false"
    >
      <el-form :model="form" ref="invoiceRepair">
        <el-form-item
          label="发票类型："
          :label-width="formLabelWidth"
          prop="type"
          style="margin-bottom: 20px"
        >
          <el-select
            size="small"
            v-model="copyRepairData.invoiceType"
            placeholder="请选择"
          >
            <!-- <el-option label="全部发票" :value="null"></el-option> -->
            <el-option
              v-for="status in copyRepairData.invoiceTypeList"
              :key="status.id"
              :label="status.label"
              :value="status.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="修复方式："
          :label-width="formLabelWidth"
          prop="radio"
          style="margin-bottom: 20px"
        >
          <el-radio v-model="form.radio" label="1" @change="radioChange()"
            >按时间修复</el-radio
          >
          <el-radio
            v-model="form.radio"
            label="0"
            @change="radioChange()"
            :disabled="isOnlineGolden"
            >按号段修复</el-radio
          >
        </el-form-item>

        <el-form-item
          label="修复时间："
          :label-width="formLabelWidth"
          style="margin-bottom: 20px"
          v-if="!isOnlineGolden"
        >
          <el-date-picker
            @change="changeDate"
            size="small"
            v-model="form.startTime"
            type="date"
            :editable="false"
            prefix-icon="el-icon-caret-bottom"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :clearable="false"
            :disabled="timeDisabled"
          >
          </el-date-picker>
          <span style="padding: 0 3px">---</span>
          <el-date-picker
            @change="changeDate"
            size="small"
            v-model="form.dateTime"
            type="date"
            placeholder="选择日期"
            :editable="false"
            prefix-icon="el-icon-caret-bottom"
            value-format="yyyy-MM-dd"
            :clearable="false"
            :disabled="timeDisabled"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="修复时间："
          :label-width="formLabelWidth"
          style="margin-bottom: 20px"
          v-if="isOnlineGolden"
        >
          <el-date-picker
            size="small"
            v-model="form.monthTime"
            type="month"
            :editable="false"
            prefix-icon="el-icon-caret-bottom"
            value-format="yyyy-MM"
            placeholder="选择日期"
            :clearable="false"
            :disabled="timeDisabled"
          >
          </el-date-picker>
        </el-form-item>
        <span class="notice" v-if="this.notice == true"
          >修复时间不能超过365天</span
        >

        <div class="flex" style="margin-bottom: 20px">
          <div
            style="
              font-size: 14px;
              color: #606266;
              line-height: 32px;
              font-weight: 700;
            "
          >
            修复号段：
          </div>
          <el-input
            style="width: 18%; margin-left: 12px"
            v-model="form.number"
            size="small"
            placeholder="发票代码"
            :disabled="numDisabled"
          ></el-input>
          <el-input
            size="small"
            style="width: 18%; margin-left: 10%"
            v-model="form.beginNumber"
            placeholder="发票起号"
            :disabled="numDisabled"
          ></el-input>
          <div>___</div>
          <el-input
            size="small"
            style="width: 18%"
            v-model="form.endNumber"
            placeholder="发票止号"
            :disabled="numDisabled"
          ></el-input>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel()">取 消</el-button>
        <el-button type="primary" @click.native="handleUpdate()"
          >修复
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "InvoiceRepair",
  props: {
    visible: Boolean,
    repairData: {
      type: Object,
      default: () => {},
    },
    // typeList: {
    //   type: Array,
    //   default: function() {
    //     return []
    //   }
    // },
    // invoiceType: {
    //   type: String,
    //   default: ''
    // }
  },
  data() {
    return {
      form: {
        number: "",
        beginNumber: "",
        endNumber: "",
        startTime: "",
        radio: "1", //单选
        dateTime: "",
        monthTime: "",
      },
      isOnlineGolden: false,
      formLabelWidth: "120px",
      notice: false, //超过365天无法修复
      copyRepairData: {
        invoiceTypeList: [],
        invoiceType: "",
      },

      timeDisabled: false, //时间禁用
      numDisabled: true, //号码禁用
    };
  },
  created() {
    this.getCurrentMonthFirst();
    this.getCurrentMonthNow();
  },
  mounted() {
    if (
      this.$store.state.user.taxDiskInfo.onlineLocation == 1 &&
      this.$store.state.user.taxDiskInfo.diskType == 1
    ) {
      this.isOnlineGolden = true;
    } else {
      this.isOnlineGolden = false;
    }
    // console.log(JSON.parse(JSON.stringify(this.repairData)))
    // this.copyRepairData = this.repairData
  },
  watch: {
    visible: {
      handler: function (newval, oldval) {
        if (newval == true) {
          this.copyRepairData = JSON.parse(JSON.stringify(this.repairData));
        }
      },
      deep: true,
    },
  },
  methods: {
    radioChange() {
      if (this.form.radio == "1") {
        this.timeDisabled = false;
        this.numDisabled = true;
      } else if (this.form.radio == "0") {
        this.timeDisabled = true;
        this.numDisabled = false;
      }
    },
    //当月第一天
    getCurrentMonthFirst() {
      var date = new Date();
      date.setDate(1);
      var month = parseInt(date.getMonth() + 1);
      var day = date.getDate();
      if (month < 10) month = "0" + month;
      if (day < 10) day = "0" + day;
      this.form.startTime = date.getFullYear() + "-" + month + "-" + day;
    },
    getCurrentMonthNow() {
      var date = new Date();
      var month = parseInt(date.getMonth() + 1);
      var day = date.getDate();
      if (month < 10) month = "0" + month;
      if (day < 10) day = "0" + day;
      this.form.dateTime = date.getFullYear() + "-" + month + "-" + day;
      this.form.monthTime = date.getFullYear() + "-" + month + "-" + day;
    },

    changeDate() {
      var sDate1 = this.form.startTime;
      var sDate2 = this.form.dateTime;
      var aDate, aDate1, oDate1, oDate2, oDate3;
      aDate = sDate1.split("-");
      oDate1 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]);
      aDate1 = sDate2.split("-");
      oDate2 = new Date(aDate1[1] + "-" + aDate1[2] + "-" + aDate1[0]);

      oDate3 = Date.parse(new Date());

      if (oDate2 > oDate3) {
        this.$message({
          type: "error",
          message: "结束时间不允许大于当前时间！",
        });
        this.form.dateTime = new Date();
        return;
      } else if (oDate1 > oDate2) {
        this.$message({
          type: "error",
          message: "开始时间不能大于结束时间！",
        });
        this.form.startTime = this.form.dateTime;
        return;
      } else {
        var diffday = this.DateDiff(this.form.startTime, this.form.dateTime);
        this.notice = false;
        // console.log(diffday);
        if (
          diffday >= 90 * 1000 * 60 * 60 * 24 &&
          diffday < 365 * 1000 * 60 * 60 * 24
        ) {
          this.open1();
          return;
        } else if (diffday >= 365 * 1000 * 60 * 60 * 24) {
          this.notice = true;

          return;
        }
      }
    },
    //计算两个日期相隔的天数
    DateDiff(sDate1, sDate2) {
      //sDate1和sDate2是2017-9-25格式
      var aDate, oDate1, oDate2, iDays;
      aDate = sDate1.split("-");
      oDate1 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]); //转换为9-25-2017格式
      aDate = sDate2.split("-");
      oDate2 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]);
      // iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数
      iDays = Math.abs(oDate1 - oDate2);
      return iDays;
    },
    //日期超过90天自动通知
    open1() {
      const h = this.$createElement;
      this.$message({
        type: "info",
        message:
          "修复期间过长有可能导致修复时间过长或修复失败，建议不超过90天！",
      });
      // this.$notify({
      //   title: "提醒",
      //   message: h(
      //     "i",
      //     {
      //       style: "color: teal",
      //     },
      //     "修复期间过长有可能导致修复时间过长或修复失败，建议不超过90天！"
      //   ),
      // });
    },

    //取消
    handleCancel() {
      this.form = {
        number: "",
        beginNumber: "",
        endNumber: "",
        startTime: "",
        radio: "1", //单选
        dateTime: "",
        monthTime: "",
      };
      this.timeDisabled = false;
      this.numDisabled = true;
      this.notice = false;
      this.getCurrentMonthFirst();
      this.getCurrentMonthNow();
      this.$emit("update:visible", false);
      console.log(this.repairData.invoiceType);
      console.log(this.copyRepairData.invoiceType);
      this.copyRepairData.invoiceType = this.repairData.invoiceType;
    },
    //修复
    handleUpdate() {
      if (this.notice == true) {
        return;
      } else {
        console.log(this.repairData);
        if (
          this.copyRepairData.invoiceType == null ||
          this.copyRepairData.invoiceType == ""
        ) {
          this.$message({
            type: "error",
            message: "请选择发票类型",
          });
          return;
        }

        if (this.form.radio == "0") {
          if (this.form.number == null || this.form.number == "") {
            this.$message({
              type: "error",
              message: "请填写发票代码",
            });
            return;
          }

          if (this.form.beginNumber == null || this.form.beginNumber == "") {
            this.$message({
              type: "error",
              message: "请填写发票起号",
            });
            return;
          }

          if (this.form.endNumber == null || this.form.endNumber == "") {
            this.$message({
              type: "error",
              message: "请填写发票止号",
            });
            return;
          }
        }
        var box = {
          type: this.copyRepairData.invoiceType,
          form: this.form,
          isOnlineGolden: this.isOnlineGolden,
        };
        this.$emit("getForm", box);
        this.form = {
          number: "",
          beginNumber: "",
          endNumber: "",
          startTime: "",
          radio: "1", //单选
          dateTime: "",
          monthTime: "",
        };
        this.timeDisabled = false;
        this.numDisabled = true;
        this.getCurrentMonthFirst();
        this.getCurrentMonthNow();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  // flex:1;
  // flex-direction: row;
  margin-left: 38px;
}
.notice {
  color: red;
  position: relative;
  top: -10px;
  left: 40px;
}
</style>