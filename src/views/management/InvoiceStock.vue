<template>
  <div class="invoiceStock">
    <div class="borderBottom navBox">
      <breadnav :textTitle="title" @leftEvent="clickLeft" />
      <div class="rightNavBox" @click="searchFun">查询</div>
    </div>
    <div class="listContent pl25">
      <div class="tableBox">
        <el-table
          element-loading-text="查询中请稍后"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <div slot="empty">
            <listnodate :tableFlag="noDateFlag" />
          </div>
          <el-table-column prop="invoiceType" label="发票类型">
          </el-table-column>
          <el-table-column prop="invoiceCode" label="发票代码">
          </el-table-column>
          <el-table-column prop="invoiceBeginNum" label="起始号码">
          </el-table-column>
          <el-table-column prop="invoiceEndNum" label="终止号码">
          </el-table-column>
          <el-table-column prop="amount" label="发票份数"> </el-table-column>
          <el-table-column prop="balances" label="剩余份数"> </el-table-column>
          <el-table-column prop="applicationDate" label="领购日期">
          </el-table-column>
          <el-table-column prop="taker" label="领购人员"> </el-table-column>
        </el-table>
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
import Listnodate from "@/components/ListNoDate";
import { getRedisList, getInvoiceInventoryList } from "@/api/taxStock";
import { UtilsGetTicketType } from "@/utils/function";
import {
  showFullScreenLoading,
  tryHideFullScreenLoading,
} from "@/utils/loadingX";
export default {
  name: "InvoiceStock",
  components: {
    Breadnav,
    Listnodate,
  },
  data() {
    return {
      title: "发票库存",
      loading: false,
      currentPage4: 4,
      noDateFlag: "successNoDate",
      tableData: [],
      timer: "",
      keys: "",
      continue: true,
      taxDiskNum: "",
      source: ''
    };
  },
  created(){
    this.source = this.$route.query.List ? JSON.parse(this.$route.query.List).type:''
  },
  mounted() {
    this.taxDiskNum = this.$store.state.user.taxDiskInfo.taxDiskNum
      ? this.$store.state.user.taxDiskInfo.taxDiskNum
      : "";
    this.getInvoiceInventoryList(0);
  },
  computed: {
    taxDiskNumChange() {
      return this.$store.state.user.taxDiskInfo.taxDiskNum;
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
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },

    clickLeft() {
      if(this.source == "applyDistribution"){
        this.$router.push({ name: "applyDistribution" });
      }
      else{
        this.$router.push({ name: "managementIndex" });
      }
      
    },
    searchFun() {
      // let _this = this
      //  this.loading = true
      //   setTimeout(function(){
      //     _this.loading=false
      //   },1000)
      this.loading = true;
      this.continue = true;

      clearTimeout(this.timer);
      this.getInvoiceInventoryList(1);
      

      this.$alert("", "查询中,请稍候", {
        confirmButtonText: "停止查询",
        iconClass: "el-icon-loading",
        center: true,
        showClose: false,
        callback: (action) => {
          clearTimeout(this.timer);
          this.continue = false
        },
      });
    },

    //创建180秒定时任务，每5秒查询一次
    //每5秒执行一次查询
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
            this.loading = false;
            clearTimeout(this.timer);
            this.$globals.closeContent()
            this.$message({
              type: 'error',
              message: '税局服务不稳定，请稍后再试'
            })
          }
          else {
            this.loading = false;
            console.log("已结束");
            clearTimeout(this.timer);
            this.$globals.closeContent()
          }
        }, s);
        this.timer = time1;
      };
      timeOut(s, fn);
    },

    //查询请求
    async getRedis(a) {
      const res = await getRedisList(this.keys);
      if(res.code == 500){
          this.continue = false
          this.$globals.closeContent()
            // this.$message({
            //   type: 'error',
            //   message: res.msg
            // })
            return 
        }
      if (res.data.code == 1) {
        this.continue = false;
        if (res.data.msgCode == 200) {
          this.getInvoiceInventoryList(0);
          this.$message({
            type: "success",
            message: "查询成功！",
          });
          this.$globals.closeContent()
          
        } else {
          this.loading = false;
          this.$globals.closeContent()
          this.$message({
            type: "error",
            message: res.data.message,
          });
    
        }
      } 
      
      else {
        this.continue = true;
        console.log(this.continue);
      }
    },

    //查询发票库存列表
    async getInvoiceInventoryList(selectType) {
      const res = await getInvoiceInventoryList({
        selectType,
        taxDiskNum: this.taxDiskNum,
      });
      if (res.code == 200 && selectType == 0) {
        console.log(res);
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].invoiceType = UtilsGetTicketType(
            res.data[i].invoiceType
          )[0].label;
        }
        this.tableData = res.data;
        console.log(this.tableData);
      } else if (res.code == 200 && selectType == 1) {
        this.keys = res.data;
        this.setInter(3000, this.getRedis);
        // this.getRedis();
      }
      else{
        this.$globals.closeContent()
      }
    },
  },
};
</script>


<style scoped>
.invoiceStock {
  box-sizing: border-box;
  background-color: #ffffff;
}
.navBox {
  position: relative;
}
.rightNavBox {
  position: absolute;
  right: 25px;
  top: 50%;
  transform: translatey(-50%);
  width: 74px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: #5e8cf9;
  border-radius: 2px;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  cursor: pointer;
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
.pl25 {
  padding-left: 25px;
  padding-top: 20px;
}
</style>

