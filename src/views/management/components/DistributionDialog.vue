<template>
  <el-dialog
    title="发票分发"
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
      <el-form-item label="发票类型">
        <span>{{intevociType}}</span>
      </el-form-item>
      <el-form-item label="发票代码">
        <span>{{data.invoiceCode}}</span>
      </el-form-item>
      <el-form-item label="剩余份数">
        <!-- <span>{{Number(data.startNo)+Number(ruleForm.amount)-1-Number(data.startNo)+1}}</span> -->
        <span>{{data.count}}</span>
      </el-form-item>
      <el-form-item label="起始号码">
        <span>{{data.startNo}}</span>
      </el-form-item>
      <el-form-item label="分发份数" prop="amount">
        <el-input
          v-model="ruleForm.amount"
          @keydown.native="channelInputLimit"
          type="number"
          placeholder="请输入"
          maxlength="6"
        ></el-input>
        <!-- <el-input-number v-model="ruleForm.amount" :step="1" step-strictly></el-input-number> -->
      </el-form-item>
      <el-form-item label="终止号码" style="margin-top:10px">
        <!-- 终止号码=起始号码+分发份数-1 -->
        <span>{{this.defaultEndNo}}</span>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="distribution('ruleForm')"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import {
  onlineApplyInvoiceApi,
  getDiskTicketTypeApi
} from "@/api/invoice.js"
import { getRedis } from "@/api/taxStock";
export default {
  name: "DistributionDialog",
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
      ruleForm: {
        type: "",
        amount: "",
      },
      rules: {amount: [{
            required: true,
            message: "请输入分发份数",
            trigger: "blur",
          }],},
      deviceNo:"", 
      taxDiskNum: "", //税盘号  
      defaultEndNo: '',
      key: ''
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
    
    
   
  },
  watch: {
    visible: {
      handler: function (newval, oldval) {
        if (newval == true) {
          this.getDiskTicketType();//税盘号
          this.defaultEndNo = this.data.endNo
        }
        if (newval == false) {
        }
      },
      deep: true,
    },
    ruleForm: {
      handler: function (newval, oldval) {
        if(this.data.startNo.indexOf('0') == 0 && newval.amount != 0 && newval.amount !== ''){
          console.log('zai')
          let differ = this.data.startNo.length - ((Number(this.data.startNo).toString().length))
          let changeEndNo = (Number(this.data.startNo) + Number(newval.amount) - 1)
          let zeroArr = ''
          for(let i = 0; i < differ; i++){
            zeroArr = zeroArr + '0'
          }
          this.defaultEndNo = zeroArr + changeEndNo
        }
        else if(this.data.startNo.indexOf('0') !== 0 && newval.amount != 0 && newval.amount !== ''){
          this.defaultEndNo = (Number(this.data.startNo) + Number(newval.amount) - 1) + ''
        }
        else if(newval.amount == 0 || newval.amount == ''){
          console.log(this.defaultEndNo)
          this.defaultEndNo = this.data.endNo
        }
        if(newval.amount < 0){
          this.defaultEndNo = this.data.endNo
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
      this.ruleForm.amount = ''
      this.$emit("update:visible", false);
    },
    
    distribution(ruleForm) {
      // 分发份数必须为整数且0＜分发份数≤剩余份数
      console.log(this.ruleForm)
      console.log(this.data)
      console.log(this.ruleForm.amount > 0 )
      console.log(this.ruleForm.amount <= this.data.count)
      this.$refs["ruleForm"].validate((valid) => {
        if(valid){
          if (parseInt(this.ruleForm.amount) > 0 && parseInt(this.ruleForm.amount) <= parseInt(this.data.count)) {
            this.onlineApplyInvoice();
            // this.$alert(
            //   // "本次共分发" + this.ruleForm.amount + "份发票,",
            //   "操作已提交，请稍后再查询",
            //   "分发成功",
            //   {
            //     confirmButtonText: "确定",
            //     callback: (action) => {
            //       this.$emit("update:visible", false);
            //       this.onlineApplyInvoice();
            //     },
            //   }
            // );
          } 
          else if (parseInt(this.ruleForm.amount) <= 0 ){
            this.$message({
              type: 'info',
              message: '请输入正整数'
            })
            this.ruleForm.amount = ''
          }
          else {
            // this.$alert("分发份数不能超过剩余份数", "提交失败", {
            //   confirmButtonText: "确定",
            //   callback: (action) => {
            //     this.ruleForm.amount = ''
            //   },
            // });
            this.$message({
              type: 'info',
              message: '分发份数不能超过剩余份数'
            })
            this.ruleForm.amount = ''
          }
        }
        else{
          return
        }
      })
      
    },

     // 网上购票分发，将申领发票分发到盘
    onlineApplyInvoice() {
      let applyParams = {
        callbackUrl: "",
        companyName: "",
        deviceNo:this.taxDiskNum,
        invoiceSerial: [
          {
        
            count:this.ruleForm.amount,
            endNo:this.defaultEndNo,
            invoiceCode:this.data.invoiceCode,
            invoiceStatus:this.data.invoiceStatus,
            invoiceType:this.data.invoiceType,
            serialNumber:'2',//需要改取值？暂时写死
            startNo: this.data.startNo,
          },
        ],
        invoiceType:this.data.invoiceType,
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
      console.log(applyParams);
      this.$alert("", "分发中,请稍候", {
              confirmButtonText: "停止分发",
              iconClass: "el-icon-loading",
              center: true,
              showClose: false,
              callback: (action) => {
                clearTimeout(this.timer);
                this.continue = false;
              },
            });
      onlineApplyInvoiceApi(applyParams)
        .then((response) => {
          if (response && response.code == "200") {
            //     this.$alert(
            //   "操作已提交，请稍后再查询",
            //   "提交成功",
            //   {
            //     confirmButtonText: "确定",
            //     callback: (action) => {
            //       this.ruleForm.amount = ''
            //       this.$emit("update:visible", false);
            //     },
            //   }
            // );
            this.key = response.data;
            this.setInter(3000, this.getRedis);
            
          }
        })
        .catch((error) => {});
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
      const res = await getRedis({key: this.key});
      if (res.code == 500) {
        this.continue = false;
        return;
      }
      if (res.data.code == 1) {
        this.continue = false;
        clearTimeout(this.timer);
        if (res.data.msgCode == 200) {
          this.$globals.closeContent();
          this.$message({
            type: "success",
            message: "提交成功",
          });
          this.$emit("update:visible", false);
          this.$parent.queryDistributed()
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

<style scoped>
.el-form{
  margin-top: -20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  }
  
.el-form-item {
  margin-top: 0px;
  margin-bottom: 0px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #262626;
}
</style>