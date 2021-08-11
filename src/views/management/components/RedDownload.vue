<template>
  <el-dialog
    title="红字信息表下载"
    :visible.sync="visible"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form :model="form">
      <div class="redLine">
        <div class="line"></div>
        <div class="redTitle"><h3>填开日期</h3></div>
      </div>

      <el-form-item label="填开日期起:" :label-width="formLabelWidth">
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
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="填开日期止:" :label-width="formLabelWidth">
        <el-date-picker
           @change="changeDate"
            size="small"
            v-model="form.datetime"
            type="date"
            :editable="false"
            prefix-icon="el-icon-caret-bottom"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :clearable="false"
        >
        </el-date-picker>
      </el-form-item>

      <div class="redLine">
        <div class="line"></div>
        <div class="redTitle"><h3>信息表信息</h3></div>
      </div>

      <el-form-item label="购买方税号" :label-width="formLabelWidth">
        <el-input
          v-model="form.consumerTaxNo"
          autocomplete="off"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="销售方税号" :label-width="formLabelWidth">
        <el-input
          v-model="form.saleTaxNo"
          autocomplete="off"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="信息表编号" :label-width="formLabelWidth">
        <el-input
          v-model="form.infoNo"
          autocomplete="off"
          placeholder="请输入"
        ></el-input>
      </el-form-item>

      <div class="redLine">
        <div class="line"></div>
        <div class="redTitle"><h3>下载范围</h3></div>
      </div>

      <div class="info-box">
        <el-checkbox v-model="form.redType1">本企业填写的红字信息表</el-checkbox>
      </div>
      <div class="info-box">
        <el-checkbox v-model="form.redType2"
          >其他企业作为购买方填写的红字信息表</el-checkbox
        >
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleRight">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "RedDownload",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formLabelWidth: "120px",
      form: {
        startTime:'',
        datetime:'',
        consumerTaxNo:'',
        saleTaxNo:'',
        infoNo:'',
        redType1: true,
        redType2: true,
      },
      
    };
  },
  created() {
    this.getCurrentMonthFirst();
    this.getCurrentMonthNow();
  },
  methods: {
    changeDate() {
      console.log(this.form)
      var sDate1 = this.form.startTime;
      var sDate2 = this.form.datetime;
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
        this.form.datetime = new Date();
        return;
      } else if (oDate1 > oDate2) {
        this.$message({
          type: "error",
          message: "开始时间不能大于结束时间！",
        });
        this.form.startTime = this.form.datetime;
        return;
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
      this.form.datetime = date.getFullYear() + "-" + month + "-" + day;
    },
    handleClose() {
      this.form={
       startTime:'',
        datetime:'',
        consumerTaxNo:'',
        saleTaxNo:'',
        infoNo:'',
        redType1: true,
        redType2: true,
      },
      this.getCurrentMonthFirst();
      this.getCurrentMonthNow();
      this.$emit("update:visible", false);
    },
    handleRight(){
      if(this.form.redType1==false&&this.form.redType2==false){
        this.$message({
          type:'warning',
          message:'请选择下载范围'
        })
        return;
      }
      this.$emit("getForm",this.form);
      this.$emit("update:visible", false);
      this.form={
        startTime:'',
        datetime:'',
        consumerTaxNo:'',
        saleTaxNo:'',
        infoNo:'',
        redType1: true,
        redType2: true,
      },
      this.getCurrentMonthFirst();
      this.getCurrentMonthNow();
      }
   
  },
};
</script>

<style lang="scss" scoped>
.line {
  width: 4px;
  height: 15px;
  background: #759cf9;
}
.redLine {
  display: flex;
}
.redTitle {
  margin-top: -18px;
  margin-left: 10px;
}

.info-box {
  padding: 20px 0;
  margin: 0 auto;
}
</style>