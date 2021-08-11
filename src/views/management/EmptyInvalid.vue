<template>
  <div id="emptyInvalid">
    <div class="borderBottom navBox">
      <breadnav :textTitle="title" @leftEvent="clickLeft" />
    </div>
    <div class="pageContent">
      <div class="formBox">
        <el-form ref="form" :model="form" label-width="90px" :rules="rules">
          <el-form-item label="发票类型：">
            <el-select
              v-model="form.invoiceType"
              placeholder="请选择发票类型"
              @change="changeInvoiceType"
            >
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="(item, key) in typeList"
                :key="key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发票代码：">
            <el-input v-model="tableData.invoiceCode" disabled></el-input>
          </el-form-item>
          <el-form-item label="当前号码：">
            <el-input v-model="tableData.startInvoiceNo" disabled></el-input>
          </el-form-item>
          <el-form-item label="终止号码：">
            <el-input v-model="tableData.endInvoiceNo" disabled></el-input>
          </el-form-item>
          <el-form-item label="剩余份数：">
            <el-input v-model="tableData.num" disabled></el-input>
          </el-form-item>
          <el-form-item label="作废份数：" prop="invalidNum">
            <!-- <el-input v-model="form.invalidNum" onchange="value=value.replace(/[^\d\.]/g, '')" onkeyup="value=value.replace(/[^\d\.]/g, '')"></el-input> -->
             <el-input v-model="form.invalidNum" :disabled='true'></el-input>
          </el-form-item>
        </el-form>
        <div class="cancelBtn" @click="sureInvalid">作废</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Breadnav from "@/components/Breadnav";
import { getRedisY, getRedis } from "@/api/taxStock";
import {
  getBlankInvoice,
  getDiskTicketType,
  invalidBlankInvoice,
  getBlankRedisList,
} from "@/api/invoiceStatistics";
import { UtilsGetTicketType } from "@/utils/function";
import {
  showFullScreenLoading,
  tryHideFullScreenLoading,
} from "@/utils/loadingX";

export default {
  name: "EmptyInvalid",
  components: {
    Breadnav,
  },
  data() {
    var validNum = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写作废份数"));
      } else if (value > this.tableData.num) {
        callback(new Error("不能超过剩余份数"));
      } else {
        callback();
      }
    };
    return {
      title: "空白作废",
      form: {
        invalidNum: "",
        invoiceType: "",
        endInvoiceNo: "",
        startInvoiceNo: "",
        deviceNo: "499000115575",
        invoiceCode: "",
      },
      rules: {
        invalidNum: [
          { validator: validNum, trigger: "blur" },
          { pattern: /^[1-9]\d*$/, message: "请输入正整数", trigger: "blur" },
        ],
      },
      typeList: [],
      tableData: {},
      continue: true,
      continue2: true,
      loading: false,
      taxDiskNum: "",
      noPaperTax: false
    };
  },
  created() {
    console.log(this.$store.state.user.taxDiskNum);
    this.taxDiskNum = this.$store.state.user.taxDiskNum;
    this.form.deviceNo = this.$store.state.user.taxDiskNum;
    this.getDiskTicketType();
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
  mounted() {
    
  },
  methods: {
    //获取空白页面信息
    async getBlank() {
      console.log('到了')
      this.continue2 = true;
      // showFullScreenLoading("查询中，请稍后");
      this.$alert("", "查询中,请稍候", {
            confirmButtonText: "停止查询",
            iconClass: "el-icon-loading",
            center: true,
            showClose: false,
            callback: (action) => {
              clearTimeout(this.timer2);
              this.continue2 = false;
            },
          });
      var data = {
        taxDiskNum: this.taxDiskNum,
        invoiceType: this.form.invoiceType,
      };
      const res = await getBlankInvoice(data);
      if (res.code == 200) {
        this.keys2 = res.data;
        this.setInter2(3000, this.getRedis2);
      } else {
        // tryHideFullScreenLoading();
        this.$globals.closeContent();
        this.tableData = [];
      }
    },
    //获取票种类型
    async getDiskTicketType() {
      const res = await getDiskTicketType({ taxDiskNum: this.taxDiskNum });
      if (res.code == 200) {
        let typeList = UtilsGetTicketType(res.data.ticketType);
        let arr = [];
        let newTypeList = [];
        res.data.ticketType.split(",").forEach((item, index) => {
          if (item == "004" || item == "007") {
            arr.push(index);
          }
        });

        arr.forEach((item) => {
          newTypeList.push(typeList[item]);
        });
        this.typeList = newTypeList;
        console.log(newTypeList)
        this.form.invoiceType = newTypeList.length !== 0 ? newTypeList[0].value : '';
        if(newTypeList.length !== 0){
          this.getBlank();
        }
        else{
          console.log('123')
          this.noPaperTax = true
          this.$message({
            type: 'info',
            message: '无纸质发票'
          })
        }
        
      }
    },

    //改变发票类型
    changeInvoiceType(val) {
      this.getBlank();
    },

    //点击作废按钮
    sureInvalid() {
      console.log(this.form);
      if(this.noPaperTax == true){
        this.$message({
            type: 'info',
            message: '无纸质发票'
          })
        return
      }
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          if(this.form.invalidNum == 0){
            this.$message({
              type: 'info',
              message: '没有库存'
            })
            return
          }
          else{
            this.$alert("", "作废中,请稍候", {
            confirmButtonText: "停止作废",
            iconClass: "el-icon-loading",
            center: true,
            showClose: false,
            callback: (action) => {
              clearTimeout(this.timer);
              this.continue = false;
            },
          });
          this.continue = true;
          // showFullScreenLoading("作废中，请稍候");
          const res = await invalidBlankInvoice(this.form);
          if (res.code == 200) {
            this.keys = res.data;
            this.setInter(3000, this.getRedis);
          } else {
              // tryHideFullScreenLoading();
              this.$globals.closeContent();
              // this.$message({
              //   type: "error",
              //   message: res.msg,
              // });
            }
          }      
        } else {
          return;
        }
      });
    },

    //创建180秒定时任务，每5秒查询一次
    //每5秒执行一次查询
    setInter(s, fn) {
      let count = 0;
      let timeOut = (s, fn) => {
        var time1 = setTimeout(() => {
          count++;
          console.log("lai");
          if (count < 60 && this.continue == true) {
            fn.call(this);
            timeOut(s, fn);
          } 
          else if(count >=60 && this.continue == true){
            this.loading = false;
            clearTimeout(this.timer);
            this.$globals.closeContent();
            this.$message({
              type: 'error',
              message: '税局服务不稳定，请稍后再试'
            })
          } 
          else{
            // tryHideFullScreenLoading();
            this.$globals.closeContent();
            clearTimeout(this.timer);
            this.loading = false;
            // this.$message({
            //   type: 'error',
            //   message: '超时'
            // })
          }
        }, s);
        this.timer = time1;
      };
      timeOut(s, fn);
    },
    //创建180秒定时任务，每5秒查询一次
    //每5秒执行一次查询
    setInter2(s, fn) {
      let count = 0;
      let timeOut = (s, fn) => {
        var time1 = setTimeout(() => {
          count++;
          if (count < 60 && this.continue2 == true) {
            fn.call(this);
            timeOut(s, fn);
          } 
          else if(count >=60 && this.continue2 == true){
     
            clearTimeout(this.timer2);
            // tryHideFullScreenLoading();
            this.$message({
              type: 'error',
              message: '税局服务不稳定，请稍后再试'
            })
          } 
          else {
            // tryHideFullScreenLoading();
            clearTimeout(this.timer2);
            this.loading = false;
            // this.$message({
            //   type: 'error',
            //   message: '超时'
            // })
          }
        }, s);
        this.timer2 = time1;
      };
      timeOut(s, fn);
    },

    //作废请求
    async getRedis(a) {
      const res = await getRedis({ key: this.keys });
      if (res.code == 500) {
        this.continue = false;
        this.$globals.closeContent();
        return;
      }
      if (res.data.code == 1) {
        this.continue = false;
        clearTimeout(this.timer);
        // tryHideFullScreenLoading();
        this.$globals.closeContent();
        if (res.data.msgCode == 200) {
          this.$alert(
            `本次共作废成功${res.data.data.successNum}张发票`,
            "作废成功！",
            {
              confirmButtonText: "确定",
              type: "success",
              center: true,
              showClose: false,
              
              callback: (action) => {
                this.continue = false;
                this.form.invalidNum = "";
                this.getBlank();
              },
            }
          );
        } else {
          this.continue = false;
       
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

    async getRedis2(a) {
      const res = await getRedisY({ key: this.keys2 });
      if (res.code == 500) {
        this.continue2 = false;
        this.$globals.closeContent();
        // this.$message({
        //   type: "error",
        //   message: res.msg,
        // });
        return;
      }
      if (res.data.code == 1) {
        this.continue2 = false;
        console.log('出结果了')
        this.$globals.closeContent();
        if (res.data.msgCode == 200) {
          this.tableData = res.data.data;
          this.form.invoiceCode = res.data.data.invoiceCode;
          this.form.endInvoiceNo = res.data.data.endInvoiceNo;
          this.form.startInvoiceNo = res.data.data.startInvoiceNo;
          this.form.invalidNum = res.data.data.num >= 1 ? 1 : 0
          // tryHideFullScreenLoading();
        } else {
          this.$message({
            type: "error",
            message: res.data.message,
          });
          // tryHideFullScreenLoading();
        }
      } else {
        this.continue2 = true;
        console.log(this.continue);
      }
    },

    clickLeft() {
      this.$router.push({ name: "managementIndex" });
    },
  },
};
</script>

<style scoped>
#emptyInvalid {
  box-sizing: border-box;
  background-color: #ffffff;
}
.pageContent {
  padding-top: 40px;
  padding-bottom: 40px;
}
.formBox {
  width: 40%;
  margin: 0 auto;
}
#emptyInvalid >>> .el-input__inner {
  height: 32px;
  line-height: 32px;
}
#emptyInvalid >>> .el-select {
  width: 100%;
}
.cancelBtn {
  width: 88px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: #5e8cf9;
  border-radius: 2px;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  margin: 0 auto;
  cursor: pointer;
}
</style>
