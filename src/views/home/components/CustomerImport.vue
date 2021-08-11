<template>
  <div id="CustomerImport">
    <div class="toClear" v-if="activeName == 'history'">
      <img src="@/assets/imgs/clear.png" alt="清除"  @click="toClearClick()">
    </div>

    <el-tabs v-model="activeName">

      <el-tab-pane label="待开" name="tobeOpened">
        <el-table :data="customerData" height="500" style="width: 100%" :default-sort="{prop:'createTime', order:'descending'}">
          <div slot="empty" >
              <listnodate :tableFlag="noDateFlag" />
          </div>
          <el-table-column prop="createTime" label="时间" width="180"> </el-table-column>
          <el-table-column prop="buyerName" label="企业名称" > </el-table-column>
          <el-table-column prop="buyerTaxId" label="税号" width="180"> </el-table-column>
          <el-table-column label="操作" width="130">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="chioceClick(scope.row)">选中</el-button>
              <el-button type="text" size="small" @click="deleteClick1(scope.row)" >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="历史" name="history">
        <el-table :data="historyData" height="500" style="width: 100%" :default-sort="{prop:'createTime', order:'descending'}">
          <div slot="empty" >
              <listnodate :tableFlag="noDateFlag" />
          </div>
          <el-table-column prop="createTime" label="时间" width="180"> </el-table-column>
          <el-table-column prop="buyerName" label="企业名称" > </el-table-column>
          <el-table-column prop="buyerTaxId" label="税号" width="180"> </el-table-column>
          <el-table-column label="操作" width="130">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="deleteClick2(scope.row)" >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

    </el-tabs>

    <div class="paginBox">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100, 200]"
            layout="total, sizes, prev, pager, next"
            background
            :total="total"
            :pager-count="5"
        >
        </el-pagination>
    </div>

  </div>
</template>

<script>
import '@/utils/global.js';
import Listnodate from '@/components/ListNoDate';
import { importCustomer, clearHistory, toDelete } from "@/api/lightInvoicing.js";

export default {
  name: "CustomerImport",
  components: {Listnodate, },
  props: {
      //税盘号
      taxDiskNum:{
          type: String,
          default: '',
      },

  },
  data() {
    return {
      activeName: 'tobeOpened',

      // 客户信息-待开
      customerData: [
      //   {time: '2021-02-01 12:21:02', name: '*水果*杏', taxNum: '3123123', },
      //   {time: '2019-11-22', name: '*蔬菜*金针菇', taxNum: '', },
      //   {time: '2019-11-22', name: '*蔬菜*金针菇', taxNum: '', },
      //   {time: '2019-11-22', name: '*蔬菜*金针菇', taxNum: '', },
      ],

      // 客户信息-历史
      historyData: [
        // {time: '2021-02-01 22:23:08', name: '*水果*杏', taxNum: '', },
        // {time: '2019-11-22', name: '*蔬菜', taxNum: '3123123', },
        // {time: '2019-11-22', name: '*蔬菜', taxNum: '3123123', },
      ],

      loading:false,

      // 列表是否有数据
      noDateFlag:'successNoDate',

      //分页
      currentPage: 1, //当前是第几页
      total: 0, //总条目数
      pageSizeNum: 10, //一页显示多少条


    };
  },
  created() {},
  mounted() {
    this.toInitList1()
  },
  watch: {
      'activeName': {
          handler: function(newval, oldval) {
              this.currentPage = 1;
              if (newval == 'tobeOpened') {
                this.toInitList1()
              }
              if (newval == 'history') {
                this.toInitList2()
              }
          },
          deep: true
      }
  },
  methods: {
    // 分页
    handleSizeChange(val) {
        this.pageSizeNum = val;
        if(this.activeName == 'tobeOpened'){
          this.toInitList1();
        }else {
          this.toInitList2();
        }
    },
    handleCurrentChange(val) {
        this.currentPage = val;
        if(this.activeName == 'tobeOpened'){
          this.toInitList1();
        }else {
          this.toInitList2();
        }
    },

    //初始化列表
    toInitList1() {
      // 待开列表
      let params = {
        buyerStatus: 0,
        taxDiskNum: this.taxDiskNum,
        pageNum: this.currentPage,
        pageSize: this.pageSizeNum,
        timeDesc: 'true',
      }
      importCustomer(params).then(response => {
        if(response&&response.code=='200'){
            let res = response.data
            this.customerData = []
            this.customerData = res.records
            this.total = res.total
            // this.invoiceType = UtilsGetTicketType(res)
        }
      }).catch(error => {})
    },
    toInitList2() {
      // 历史列表
      let params = {
        buyerStatus: 1,
        taxDiskNum: this.taxDiskNum,
        pageNum: this.currentPage,
        pageSize: this.pageSizeNum,
        timeDesc: 'true',
      }
      importCustomer(params).then(response => {
        if(response&&response.code=='200'){
            let res = response.data
            this.historyData = []
            this.historyData = res.records
            this.total = res.total
            // this.invoiceType = UtilsGetTicketType(res)
        }
      }).catch(error => {})
    },


    // Tab-待开
    chioceClick(item) {
      this.$emit('importCustomerDetermine', item)
    },
    deleteClick1(item) {
      this.$confirm('你确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          this.deleteClick1Ajax(item)
      }).catch((error) => {
          this.$message({
              type: 'info',
              message: '已取消删除'
          });
          // console.log(error)
      });
    },
    deleteClick1Ajax(item) {
      let params = {
        id: item.id
      }
      toDelete(params).then(response => {
        if(response&&response.code=='200'){
            this.$message({
                type: 'success',
                message: '删除成功'
            });
            this.toInitList1()
        }
      }).catch(error => {})
    },




    // Tab-历史
    toClearClick() {
      this.$confirm('该操作将清除历史数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          this.toClearClickAjax()
      }).catch((error) => {
          this.$message({
              type: 'info',
              message: '已取消清除'
          });
          // console.log(error)
      });
      
    },
    toClearClickAjax() {
      // 历史列表
      let params = {
        taxDiskNum: this.taxDiskNum
      }
      clearHistory(params).then(response => {
        if(response&&response.code=='200'){
            let res = response.data
            if (res) {
              this.$alert('历史记录清除成功!', '提示', {
                  confirmButtonText: '确定',
                  type: 'success'
              });
              this.toInitList2();
              return
            }
        }
        this.$message('历史记录清除失败!', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
        });
      }).catch(error => {})
    },

    deleteClick2(item) {
      this.$confirm('你确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          this.deleteClick2Ajax(item)
      }).catch((error) => {
          this.$message({
              type: 'info',
              message: '已取消删除'
          });
          // console.log(error)
      });
    },
    deleteClick2Ajax(item) {
      let params = {
        id: item.id
      }
      toDelete(params).then(response => {
        if(response&&response.code=='200'){
            this.$message({
                type: 'success',
                message: '删除成功'
            });
            this.toInitList2()
        }
      }).catch(error => {})
    },


  },
};
</script>

<style scoped>
#CustomerImport {
  position: relative;
}

#CustomerImport .toClear {
  position: absolute;
  right: 5px;
  z-index: 10;
  width: 30px;
  height: 30px;
  cursor: pointer;
  /* background: url('../../../assets/imgs/clear.png') no-repeat;
  background-size: 100% 100%; */
}

#CustomerImport .toClear>img {
  width: 100%;
  height: 100%;
 
}

.paginBox {
  padding-right: 25px; 
  text-align: right;
  margin-top: 20px;
}
</style>
