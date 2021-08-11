<template>
  <el-dialog
    title="纸质发票确认"
    :visible.sync="visible"
    width="30%"
    font-weight="900"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
       ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="发票类型"  prop="intevociType">
        <span>{{intevociType}}</span>
      </el-form-item>
      <el-form-item label="发票代码"  prop="invoiceCode">
         <!-- <el-input
          v-model="ruleForm.invoiceCode"
          oninput="value=value.replace(/[^\d]/g,'')"
          placeholder="请输入"
          maxlength="12"
        ></el-input> -->
        <el-input
          v-model="ruleForm.invoiceCode"
          type="number"
          placeholder="请输入"
          @keydown.native="channelInputLimit"
          maxlength="12"
        ></el-input>
      </el-form-item>
      <el-form-item label="起始号码"  prop="startNo">
        <!-- <el-input
          v-model="ruleForm.startNo"
          oninput="value=value.replace(/[^\d]/g,'')"
          placeholder="请输入"
          maxlength="8"
        ></el-input> -->
        <el-input
          v-model="ruleForm.startNo"
          type="number"
          placeholder="请输入"
          @keydown.native="channelInputLimit"
          maxlength="8"
        ></el-input>
      </el-form-item>
      <el-form-item label="发票份数" prop="count">
        <!-- <el-input
          v-model="ruleForm.count"
          oninput="value=value.replace(/[^\d]/g,'')"
          placeholder="请输入"
          maxlength="6"
        ></el-input> -->
        <el-input
          v-model="ruleForm.count"
          type="number"
          placeholder="请输入"
          @keydown.native="channelInputLimit"
          maxlength="6"
        ></el-input>
      </el-form-item>
      <el-form-item label="终止号码" prop="endNo">
       <span >{{this.defaultEndNo}}</span>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="distribution('ruleForm')"
        >确定</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import {
  PaperConfirm,
  getDiskTicketTypeApi
} from "@/api/invoice.js"
export default {
  name: "PaperinvoiceDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data:{
      type:Object,
      default:()=>{
      }
    }
  },

  data() {
    return {
       //表单校验
       rules: {
          invoiceCode: [{
            required: true,
            trigger: "blur",
            message: "请输入发票代码",
          },{
            pattern: /^[A-Z0-9]{10}$|^[A-Z0-9]{12}$/,
            message: "请输入正确的发票代码格式",
            trigger: "blur",
          },],
           startNo: [{
            required: true,
            message: "请输入起始号码",
            trigger: "blur",
          },{
            pattern: /^[A-Z0-9]{8}$/,
            message: "请输入正确的起始号码格式",
            trigger: "blur",
          },],
           count: [{
            required: true,
            message: "请输入发票份数",
            trigger: "blur",
          }],
        },
      ruleForm: {
        type: "",
        count: "",
        invoiceCode:"",
        startNo:"",
      },
      deviceNo:"", 
      taxDiskNum: "", //税盘号  
      defaultEndNo: ''
    };
  },
  computed: {
    intevociType () {
      if(this.data && this.data.invoiceType) {
        return {
          '004': '增值税专用发票',
          '007': '增值税普通发票',
          '025':'卷式发票',
          '026':'电子普通发票',
          '028':'电子专用发票',
          '005':'机动车销售统一发票'
        }[this.data.invoiceType]
      }
      return ''
    }
  },
  created() {
    this.taxDiskNum = this.$store.state.user.taxDiskNum;
    // this.getDiskTicketType();//税盘号
  },
  mounted(){
  
  },
  watch: {
    visible: {
      handler: function (newval, oldval) {
        if (newval == true) {
          console.log(this.data)
          this.ruleForm.invoiceCode = this.data.invoiceCode
          this.ruleForm.startNo = this.data.startInvoiceNo
          this.defaultEndNo = this.data.endInvoiceNo
          this.getDiskTicketType();//税盘号
        }
        if (newval == false) {
        }
      },
      deep: true,
    },
    ruleForm: {
      handler: function (newval, oldval) {
        if(this.ruleForm.startNo){
          console.log(newval.count < 0)
          if(this.ruleForm.startNo.indexOf('0') == 0 && newval.count != 0 && newval.count !== ''){
            console.log('zai')
            this.defaultEndNo = '0' + (Number(this.ruleForm.startNo) + Number(newval.count) - 1)
          }
          else if(this.ruleForm.startNo.indexOf('0') !== 0 && newval.count != 0 && newval.count !== ''){
            this.defaultEndNo = (Number(this.ruleForm.startNo) + Number(newval.count) - 1) + ''
          }
          else if(newval.count == 0 || newval.count == ''){
            console.log(this.defaultEndNo)
            
            this.defaultEndNo = this.data.endInvoiceNo
            // this.defaultEndNo = this.ruleForm.startNo
          }
          if(newval.count < 0){
            this.defaultEndNo = this.data.endInvoiceNo
          }
        }
        
      },
      deep: true,
    }
  },
  methods: {
    channelInputLimit (e) {
      let key = e.key
      // 不允许输入'e'和'.'
      if (key === 'e' || key === '.' || key === '-') {
        e.returnValue = false
        return false
      }
      return true
    },
    //获取发票类型
    getDiskTicketType() {
      let applyParams = {
        taxDiskNum: this.taxDiskNum,
      };
      var that = this;
      getDiskTicketTypeApi(applyParams)
        .then((res) => {
          if (res && res.code == "200") {
            that.typeOptions = UtilsGetTicketType(res.data.ticketType);
          }
        })
        .catch((error) => {});
    },
   
    handleClose() {
      
      this.$emit("update:visible", false);
      this.$refs["ruleForm"].resetFields();
     },

   distribution(ruleForm){
      this.$refs["ruleForm"].validate((valid) => {
          if (valid) {
            if (this.ruleForm.count > 0 && this.ruleForm.count <= 100) {
            this.$emit("update:visible", false);
            this.ParperInvioceConfirm();
            }
            else{
              this.$message({
                type: 'info',
                message: '请输入正整数'
              })
              this.ruleForm.count = ''
            }
          } else {
            
            return false;
          }
        });
    },

      //发票确认
      ParperInvioceConfirm() {
        let applyParams = {
         applySerialNumber: this.data.serialNumber,
         deviceNo:this.taxDiskNum,
         invoiceType:this.data.invoiceType,
         taxId: this.$store.state.user.loginInfo.taxId,
          info: [
            {
            count: this.ruleForm.count,
            // endNo: this.ruleForm.endNo,
            invoiceCode: this.ruleForm.invoiceCode,
            startNo:this.ruleForm.startNo,
            endNo:this.defaultEndNo
             } ] 
        }
        // console.info(applyParams)
        // this.$refs["ruleForm"].resetFields();

         PaperConfirm(applyParams)
          .then((response) => {
            if (response && response.code == "200") {
              // this.getApplyList();
              this.$globals.alertSuccess();
              this.$refs["ruleForm"].resetFields();
            }
          })
          .catch((error) => {});
      },
  },
};
</script>
<style scoped>
.el-form{
  margin-top: -20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  }
  
.el-form-item {
  margin-top: 0px;
  /* margin-bottom: 0px; */
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #262626;
}
</style>