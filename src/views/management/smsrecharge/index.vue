<template>
  <div class="page-container">
    <div class="page-header"> 
     <p class="title"><i class="el-icon-arrow-left" ></i>短信充值</p>  
      <!-- <el-button size="mini" type="primary" style="float:right;" @click="cheak">充值</el-button> -->
              <el-button type="primary"  style="float:right;" @click="cheak">充值</el-button>
         <p class="title" size="mini" type="primary" style="float: right;" >短信余量:100</p> 
    </div>
    <div class="page-content">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="number"
          label="充值数量"
          width="180">
        </el-table-column>
        <el-table-column
          prop="money"
          label="金额"
          width="180">
        </el-table-column>
        <el-table-column
          prop="rechargeTime"
          label="充值时间">
        </el-table-column>
        <el-table-column
          prop="rechargeTpye"
          label="充值状态 ">
      <template slot-scope="scope"> 
         <el-tag type="" size="small" v-if="scope.row.rechargeTpye=='0'">充值中</el-tag> 
         <el-tag  type="" size="small" v-else-if="scope.row.rechargeTpye=='1'">充值成功</el-tag> 
         <el-tag  type="" size="small" v-else-if="scope.row.rechargeTpye=='2'">充值成功</el-tag>  
      </template>
        </el-table-column>
        <el-table-column
          prop="billTpye"
          label="开票状态">
      <template slot-scope="scope"> 
         <el-tag type="" size="small" v-if="scope.row.billTpye=='0'">未开票</el-tag> 
         <el-tag  type="danger" size="small" v-else-if="scope.row.billTpye=='1'">开票成功</el-tag> 
         <el-tag  type="info" size="small" v-else-if="scope.row.billTpye=='2'">开票失败</el-tag>  
      </template>
        </el-table-column>
        <el-table-column prop="left" label="操作">
       <template slot-scope="scope" style="width：300px;">
          <el-button @click="handleClick(scope.row, 1)" type="text" size="small"  >查看发票</el-button  >  
        </template>
        </el-table-column> 
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="pageInfo.currentPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total">
      </el-pagination>
    </div>

       <!-- 充值模态框 -->
   <!-- 模态框 -->
    <el-dialog :title="title"    :visible.sync="dialogFormVisible" center=""> 
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
  </div>
</el-dialog>

  </div>
</template>

<script>
export default {
  name: 'InvocieStock',
  data() {
    return {
     title:"短信余量:80",
    dialogFormVisible: false, 
      //写的假数据
      tableData: [
        {   
            number: '51512',
            money: '50',
            rechargeTime:"2021-4-6",
            rechargeTpye:"0",
            billTpye:"0", 
          }, 
        {   
            number: '74151',
            money: '50',
            rechargeTime:"2021-4-6",
            rechargeTpye:"1",
            billTpye:"1", 
          },
        {   
            number: '1012300',
            money: '50',
            rechargeTime:"2021-4-6",
            rechargeTpye:"2",
            billTpye:"2", 
          }
      ],
      pageInfo: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },     
     //充值按钮
      cheak(){
        this.dialogFormVisible=true;
        this.title="短信余量: 80";
        this.form={
            username:"",
            realname: "",
            telephone: "",
            password:"",
            status:""
        }
      },
  }
}
</script>

<style lang="scss" scoped>

</style>