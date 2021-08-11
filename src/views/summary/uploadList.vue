<template>
  <div class="upload">
    <div class="wraingBox">
      <p>
        <i class="el-icon-warning-outline waringIcon"></i>
        <span class="waringTitle"
          >提示：上报汇总前请确认该设备是否一直在同一设备上开票</span
        >
      </p>
      <p class="mal41 warinBottom">
        如果在多台设备上开过票，请点击“发票修复”按钮，将发票同步到本地设备，以确保统计的准确性
      </p>
      <div class="fixBtn" @click="showRepairDialog">发票修复</div>
    </div>
    <div class="borderBottom navBox">
      <breadnav :textTitle="title" @leftEvent="clickLeft" />
      <div class="rightNavBox">
        <div class="rightNav" @click="upload">上传</div>
        <div class="rightNav" @click="report">上报汇总</div>
        <div class="rightNav" @click="rewrite">监控返写</div>
      </div>
    </div>
    <div class="listContent pl25">
      <div class="tableBox">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <div slot="empty">
            <listnodate :tableFlag="noDateFlag" />
          </div>
          <!-- <el-table-column
            type="selection"
            width="55">
          </el-table-column> -->
          <el-table-column prop="invoiceType" label="发票类型">
          </el-table-column>
          <el-table-column prop="openableDeadlineDate" label="开票截止时间">
          </el-table-column>
          <el-table-column prop="notUploadedNum" label="未上传份数">
          </el-table-column>
          <el-table-column prop="reportStartDate" label="数据报送起始日期">
          </el-table-column>
          <el-table-column prop="reportEndDate" label="数据报送终止日期">
          </el-table-column>
          <el-table-column prop="name" label="抄报状态">
            <template slot-scope="scope">
              {{ scope.row.copyResults == 1 ? "抄报成功" : "抄报失败" }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="返写状态">
            <template slot-scope="scope">
              {{
                scope.row.reverseWritingResults == 1 ? "返写成功" : "返写失败"
              }}
            </template>
          </el-table-column>
        </el-table>

        <invoice-repair
          :visible.sync="invoiceRepairVisibility"
          @getForm="getForm"
          :repairData="repairData"
        />
      </div>
      <!-- <div class="paginBox">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[10, 20]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400">
        </el-pagination>
      </div> -->
    </div>
  </div>
</template>


<script type="text/ecmascript-6">
import Breadnav from "@/components/Breadnav";
import { validStrCheckLength } from "@/utils/validate";
import Listnodate from "@/components/ListNoDate";
import { getRedisList, getRedis } from "@/api/taxStock";
import { getRedisList2 } from "@/api/taxStock";
import InvoiceRepair from "@/views/management/components/InvoiceRepair.vue";
import { invoiceRepair, invoiceNotUploaded } from "@/api/invoicesearch";
import { getDiskTicketType } from "@/api/invoiceStatistics";
import { UtilsGetTicketType } from "@/utils/function";
import {
  showFullScreenLoading,
  tryHideFullScreenLoading,
} from "@/utils/loadingX";
import {
  getSummaryUploadList,
  invoiceUpload,
  invoiceCopyAndReport,
  invoiceReverseWriting,
} from "@/api/invoiceStatistics";
export default {
  name: "uploadList",
  components: {
    Breadnav,
    Listnodate,
    InvoiceRepair,
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
      title: "汇总上传",
      currentPage4: 4,
      noDateFlag: "successNoDate",
      invoiceRepairVisibility: false,
      serchForm: {
        type: "1",
        table: "1",
        ymj: "1",
        date: "1",
      },
      typeList: [
        { label: "专用发票", value: "1" },
        { label: "专用发票(电子)", value: "2" },
      ],
      tableList: [
        { label: "票务汇总表", value: "1" },
        { label: "正数票证", value: "2" },
        { label: "负数票证清单", value: "3" },
        { label: "正数废票清单", value: "4" },
        { label: "负数废票清单", value: "5" },
      ],
      ymjList: [
        { label: "月度", value: "1" },
        { label: "季度", value: "2" },
        { label: "年度", value: "3" },
      ],
      tableData: [],
      keys: [],
      taxDiskChannel: '',
      key: [],
      keyX: "",
      continue: true,
      // loading: false,
      repairData: {
        invoiceTypeList: [],
        invoiceType: "",
      },
    };
  },
  created() {
    this.taxDiskNum = this.$store.state.user.taxDiskNum;
    this.taxDiskChannel= this.$store.state.user.taxDiskInfo.taxDiskChannel;
    this.getSummaryUploadList();
    this.getDiskTicketType();
  },
  methods: {
    //分页
    // handleSizeChange(val) {
    //   console.log(`每页 ${val} 条`);
    // },
    // handleCurrentChange(val) {
    //   console.log(`当前页: ${val}`);
    // },
    //获取票种类型
    async getDiskTicketType() {
      const res = await getDiskTicketType({ taxDiskNum: this.taxDiskNum });
      if (res.code == 200) {
        this.repairData.invoiceTypeList = UtilsGetTicketType(
          res.data.ticketType
        );
        this.repairData.invoiceType = res.data.ticketType.split(",")[0];
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

    //修复
    showRepairDialog() {
      console.log("dk");
      this.invoiceRepairVisibility = true;
    },
    //获取修复发票表单数据
    getForm(formData) {
      console.log(formData);
      if (formData) {
        this.invoiceRepairVisibility = false;
        this.loading = true;
        this.invoiceRepaired(formData.form, formData.type, formData.isOnlineGolden);
        
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
      } 
      else if (form.radio == "1" && isOnlineGolden == true){
        let date = new Date(form.monthTime);
        let year1 = date.getFullYear();
        let month1 = date.getMonth() + 1;
        month1 = month1 < 10 ? "0" + month1 : month1;
        applyParams.queryConditions =
          year1.toString() +
          month1.toString() 
      }
      else if (form.radio == "0") {
        applyParams.queryConditions =
          form.number.toString() +
          form.beginNumber.toString() +
          form.endNumber.toString();
      }
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
      const res = await invoiceRepair(applyParams);
      if (res.code == 200) {
        if (res.data) {
          this.key = res.data;
          console.log(res.data);
          this.getRedis3();
          this.continue = true
          this.setInter(3000, this.getRedis3);
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
        
      }
    },

    //上传
    async upload() {
      this.$alert("", "上传中,请稍候", {
        confirmButtonText: "停止查询",
        iconClass: "el-icon-loading",
        center: true,
        showClose: false,
        callback: (action) => {
          clearTimeout(this.timer);
          this.loading = false;
          this.continue = false;
        },
      });
      const res = await invoiceUpload({
        invoiceType: "",
        taxDiskNum: this.taxDiskNum,
      });
      if (res.code == 200) {
        this.keys = res.data;
        this.loading = true;
        this.continue = true;
        this.setInter(3000, this.getRedisUpload);
      } else {
        // tryHideFullScreenLoading()
        this.$globals.closeContent();
        this.continue = false;
        this.loading = false;
        
      }
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
          } 
          else if(count >=60 && this.continue == true){
            this.continue = false;
            this.loading = false;
            clearTimeout(this.timer);
            this.$globals.closeContent();
            this.$message({
              type: 'error',
              message: '税局服务不稳定，请稍后再试'
            })
          } 
          else {
            console.log("结束计时器");
            clearTimeout(this.timer);
            // tryHideFullScreenLoading()
            this.$globals.closeContent();
            this.loading = false;
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
      const res = await getRedisList(this.keys);
      if (res.code == 500) {
        this.continue = false;
        this.loading = false;
        
        return;
      }
      if (res.data.code == 1) {
        this.continue = false;
        this.loading = false;
        if (res.data.msgCode == 200) {
          // tryHideFullScreenLoading()
          this.$globals.closeContent();
          this.$message({
            type: "success",
            message: "成功",
          });
          this.getSummaryUploadList();
        } else {
          // tryHideFullScreenLoading()
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
    //上传查询请求getredis
    async getRedisUpload(a) {
      const res = await getRedisList(this.keys);
      if (res.code == 500) {
        this.continue = false;
        this.$globals.closeContent();
        
        return;
      }
      if (res.data.code == 1) {
        this.continue = false;
        
        this.$globals.closeContent();
        if (res.data.msgCode == 200) {
          this.invoiceNotUploaded();
          clearTimeout(this.timer);
          this.$message({
            type: "success",
            message: "上传成功",
          });
        } else {
          this.invoiceNotUploaded();
          clearTimeout(this.timer);
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
    //未上传  同步
    async invoiceNotUploaded() {
      this.$alert("", "同步中,请稍候", {
        confirmButtonText: "停止查询",
        iconClass: "el-icon-loading",
        center: true,
        showClose: false,
        callback: (action) => {
          clearTimeout(this.timer2);
          this.loading = false;
        },
      });
      const res = await invoiceNotUploaded({
        invoiceType: "",
        taxDiskNum: this.taxDiskNum,
      });
      if (res.code == 200) {
        if (res.data.length > 0) {
          this.keyX = res.data;
          this.loading = true;
          this.getRedisX();
        
          this.setInterX(3000, this.getRedisX);
          
        } else {
          this.loading = false;
          // tryHideFullScreenLoading();
          this.$globals.closeContent();
          // this.$message({
          //   type: "error",
          //   message: "上传失败",
          // });
        }
      } else {
        this.loading = false;

        // tryHideFullScreenLoading();
        this.$globals.closeContent();
        
      }
    },

    //创建180秒定时任务，每3秒查询一次
    //每5秒执行一次查询
    setInterX(s, fn) {
      let count = 0;
      let timeOut = (s, fn) => {
        var time1 = setTimeout(() => {
          count++;
          console.log(count,this.loading)
          if (count < 60 && this.loading == true) {
            fn.call(this);
            timeOut(s, fn);
          } 
          else if(count >=60 && this.loading == true){
            this.loading = false;
            clearTimeout(this.timer2);
            this.$globals.closeContent();
            this.$message({
              type: 'error',
              message: '税局服务不稳定，请稍后再试'
            })
          } 
          else{
            clearTimeout(this.timer2);
            // tryHideFullScreenLoading();
            this.$globals.closeContent();
            this.loading = false;
            // this.$message({
            //   type: "error",
            //   message: "上传失败",
            // });
          } 
          // else {
          //   clearTimeout(this.timer2);
          //   // tryHideFullScreenLoading();
          //   this.$globals.closeContent();
          //   this.loading = false;
          // }
        }, s);
        this.timer2 = time1;
      };
      timeOut(s, fn);
    },
    //查询请求
    async getRedisX() {
      const res = await getRedisList2(this.keyX);

      if (res.data.code == 1) {
        clearTimeout(this.timer2);
        if (res.data.msgCode == 200) {
          this.loading = false;
          // tryHideFullScreenLoading();
          this.$globals.closeContent();
          this.getSummaryUploadList();

          this.$message({
            type: "success",
            message: "同步成功",
          });
        } else {
          this.loading = false;
          // this.getSummaryUploadList()
          // tryHideFullScreenLoading();
          this.$globals.closeContent();
          this.$message({
            type: "warning",
            message: res.data.message,
          });
        }
      } else {
        this.loading = true;
      }
    },

    //发票修复
    async getRedis3(a) {
      const res = await getRedisList( this.key );
      if (res.code == 500) {
        this.continue = false;
        
        return;
      }
      if (res.data.code == 1) {
        this.continue = false;
        this.loading = false;
        if (res.data.msgCode == 200) {
          // tryHideFullScreenLoading()
          this.$globals.closeContent();
          this.$message({
            type: "success",
            message: "成功",
          });
        } else {
          // tryHideFullScreenLoading()
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
    //上报汇总
    async report() {
      this.$alert("", "上报汇总中,请稍候", {
        confirmButtonText: "停止查询",
        iconClass: "el-icon-loading",
        center: true,
        showClose: false,
        callback: (action) => {
          clearTimeout(this.timer);
          this.loading = false;
        },
      });
      const res = await invoiceCopyAndReport({
        invoiceType: "",
        taxDiskNum: this.taxDiskNum,
      });
      if (res.code == 200) {
        this.keys = res.data;
        this.loading = true;
        this.setInter(3000, this.getRedis);
      }
    },
    //发票反写
    async rewrite() {
      this.$alert("", "监控返写中,请稍候", {
        confirmButtonText: "停止查询",
        iconClass: "el-icon-loading",
        center: true,
        showClose: false,
        callback: (action) => {
          clearTimeout(this.timer);
          this.loading = false;
        },
      });
      const res = await invoiceReverseWriting({
        invoiceType: "",
        taxDiskNum: this.taxDiskNum,
      });
      if (res.code == 200) {
        this.keys = res.data;
        this.loading = true;
        this.setInter(3000, this.getRedis);
      }
    },

    //获取上传列表数据
    async getSummaryUploadList() {
      const res = await getSummaryUploadList({
        taxDiskNum: this.taxDiskNum,
      });
      if (res.code == 200) {
        res.data.forEach((item) => {
          item.invoiceType = UtilsGetTicketType(item.invoiceType)[0].label;
        });
        this.tableData = res.data;
      }
    },
  },
};
</script>


<style scoped>
.navBox {
  position: relative;
}
.upload {
  box-sizing: border-box;
  background-color: #ffffff;
}
.wraingBox {
  width: 100%;
  height: 89px;
  background: #fffbe6;
  border-radius: 2px;
  border: 1px solid #ffe58f;
  padding-left: 26px;
  box-sizing: border-box;
  position: relative;
}
.waringIcon {
  color: #faad14;
  font-size: 21px;
  position: relative;
  top: 3px;
  margin-right: 17px;
}
.waringTitle {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}
.warinBottom {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
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
  width: 88px;
  height: 32px;
  text-align: center;
  background: #5e8cf9;
  border-radius: 2px;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  line-height: 32px;
}

.fixBtn {
  height: 89px;
  line-height: 89px;
  font-size: 16px;
  font-weight: 500;
  color: #5e8cf9;
  cursor: pointer;
  position: absolute;
  right: 25px;
  top: 0;
}
.tableBox {
  padding-bottom: 100px;
}
.paginBox {
  padding-bottom: 20px;
  padding-right: 25px;
  text-align: right;
}
.mal41 {
  margin-left: 41px;
}
</style>

