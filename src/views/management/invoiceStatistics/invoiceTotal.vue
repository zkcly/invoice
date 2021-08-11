<template>
  <div class="invoiceTotal">
    <div class="borderBottom navBox">
      <breadnav :textTitle="title" @leftEvent='clickLeft'/>
      <div class="rightNavBox">
        <div class="rightNav">
          <img src="../../../assets/images/export.png" alt="图片" class="navImg">
          <span class="navTex">导出</span>
        </div>
        <div class="rightNav" >
          <img src="../../../assets/images/fix.png" alt="图片" class="navImg" >
          <span class="navTex">修复</span>
        </div>
        <div class="rightNav" >
          <img src="../../../assets/images/print.png" alt="图片" class="navImg">
          <span class="navTex">打印</span>
        </div>
      </div>
    </div>
    <div class="listContent pl25">
      <div class="serchBox">
        <el-form :inline="true" :model="serchForm" class="demo-form-inline">
          <el-form-item label="" >
            <el-select v-model="serchForm.type" placeholder="">
              <el-option :label="item.label" :value="item.value" v-for="(item,key) in typeList" :key="key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="serchForm.table" placeholder="">
              <el-option :label="item.label" :value="item.value" v-for="(item,key) in tableList" :key="key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="serchForm.ymj" placeholder="">
              <el-option :label="item.label" :value="item.value" v-for="(item,key) in ymjList" :key="key"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="">
            <el-select v-model="serchForm.ymj" placeholder="">
              <el-option :label="item.label" :value="item.value" v-for="(item,key) in ymjList" :key="key"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="" >
            <el-date-picker
              v-model="serchForm.date"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div class="serchBtn">查询</div>
      </div>
      <ul class="tottalDeati clearfix">
        <li class="detailItem">正数发票份数：1</li>
        <li class="detailItem">正数废票份数：0</li>
        <li class="detailItem">负数发票份数：0</li>
        <li class="detailItem">负数废票份数：0</li>
        <li class="detailItem">合计发票份数：0</li>
      </ul>
      <div class="tableBox">
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="date"
            label="项目名称">
          </el-table-column>
          <el-table-column
            prop="name"
            label="合计">
          </el-table-column>
          <el-table-column
            prop="name"
            label="16%">
          </el-table-column>
          <el-table-column
            prop="name"
            label="13%">
          </el-table-column>
          <el-table-column
            prop="name"
            label="10%">
          </el-table-column>
          <el-table-column
            prop="name"
            label="9%">
          </el-table-column>
          <el-table-column
            prop="name"
            label="其他">
          </el-table-column>
        </el-table>
      </div>
      <div class="paginBox">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[10, 20]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400">
        </el-pagination>
      </div>
    </div>

  </div>
</template>


<script type="text/ecmascript-6">
  import Breadnav from '@/components/Breadnav';
  import { validStrCheckLength } from "@/utils/validate";
  export default {
    name: "invoiceTotal",
    components: {
      Breadnav
    },
    data(){
      const validateSearchText = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入关键字'));
        }
        else if (!validStrCheckLength(value,40)) {
          console.log('ssss')
          callback(new Error("最多可以输入40个字符（20个汉字）"));
        } else {
          callback();
        }
      };
      return {
        title: '开票统计',
        currentPage4: 4,
        serchForm: {
          type: '1',
          table: '1',
          ymj: '1',
          date: '1',
          time: '1'
        },
        typeList:[
          {label:'全部发票',value:'1'},
          {label:'专用发票',value:'2'},
          {label:'普通发票',value:'3'},
          {label:'电子专用发票',value:'4'},
          {label:'电子普通发票',value:'5'},
          {label:'机动车发票',value:'6'},
        ],
        tableList:[
          {label:'票务汇总表',value:'1'},
          {label:'正数发票清单',value:'2'},
          {label:'负数发票清单',value:'3'},
          {label:'正数废票清单',value:'4'},
          {label:'负数废票清单',value:'5'},
        ],
        ymjList:[
          {label:'月度',value:'1'},
          {label:'季度',value:'2'},
          {label:'年度',value:'3'},
        ],
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]

      }
    },
    created () {

    },
    methods:{
      //分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },

      //多选
      handleSelectionChange(val) {
        console.log('选中',val)
        this.multipleSelection = val;
      },
      clickLeft(){
        alert('点击')
      },
      moveOneFun(){
        this.$message({
          message: '移除成功',
          type: 'success'
        });
      },
      moveMoreFun(){
        if(this.multipleSelection.length==0){
          this.$message({
            message: '请选择要移除的数据',
            type: 'warning'
          });
        }
      },

      searchFun(){
        this.$refs['searchOne'].validate((valid) => {
          if (valid) {

          } else {
            console.log('error 11111111');
            return false;
          }
        });
      },
    }
  }
</script>


<style scoped>
  .navBox{
    position: relative;
  }
  .invoiceTotal{
    box-sizing: border-box;
    background-color: #ffffff;
  }

  .rightNavBox{
    float: right;
    height: 62px;
    line-height: 62px;
  }
  .rightNav{
    display: inline-block;
    cursor: pointer;
    margin-right: 15px;
  }
  .navImg{
    width: 24px;
    vertical-align: sub;
    position: relative;
    top:2px;
  }
  .navTex{
    font-size: 14px;
    color: #000000;
  }
  .serchBox{
    position: relative;
    padding-top: 13px;
  }
  .serchBtn{
    width: 74px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    background: #5E8CF9;
    border-radius: 2px;
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    position: absolute;
    left:64%;
    top:17px;
    /*transform: translateY(-50%);*/
    cursor: pointer;

  }

  .serchBox >>> .el-form-item{
    width: 12%;
  }

  .serchBox >>> .el-date-editor--daterange.el-input__inner{
    width: 200%;
    position: relative;
    top: 4px;
  }
  .serchBox >>> .el-date-editor .el-range-input{
    width: 100%;
  }
  .serchBox >>> .el-icon-date{
    position: relative;
    top: -3px;
  }
  .serchBox >>> .el-date-editor .el-range-separator{
    position: relative;
    top:-3px;
  }

  .serchBox >>> .el-input__inner,  .reviewInvoicing >>>.el-input__icon{
    height: 32px;
    line-height: 32px;
  }
  .detailItem{
    float: left;
    margin-right: 20px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }
  .tottalDeati{
    position: relative;
    top:-20px;
  }
  .tableBox{
    padding-bottom: 100px;
  }
  .paginBox{
    padding-bottom: 20px;
    padding-right: 25px;
    text-align: right;
  }
</style>

