<template>
  <div class="upload">
    <div class="wraingBox">
      <p>
        <i class="el-icon-warning-outline waringIcon"></i>
        <span class="waringTitle">提示：上报汇总前请确认该设备是否一直在同一设备上开票</span>
      </p>
      <p class="mal41 warinBottom">如果在多台设备上开过票，请单击“发票修复”按钮，将票务同步到本地设备，以确保统计的准确性</p>
      <div class="fixBtn" @click="showRepairDialog">发票修复</div>
    </div>
    <div class="borderBottom navBox">
      <breadnav :textTitle="title" @leftEvent='clickLeft'/>
      <div class="rightNavBox">
        <div class="rightNav">上传</div>
        <div class="rightNav">上报汇总</div>
        <div class="rightNav">监控返写</div>
      </div>
    </div>
    <div class="listContent pl25">
      <div class="tableBox">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="name"
            label="门票类型">
          </el-table-column>
          <el-table-column
            prop="name"
            label="开票截止时间">
          </el-table-column>
          <el-table-column
            prop="name"
            label="未上传份数">
          </el-table-column>
          <el-table-column
            prop="name"
            label="数据报送起始日期">
          </el-table-column>
          <el-table-column
            prop="name"
            label="数据报送终止日期">
          </el-table-column>
          <el-table-column
            prop="name"
            label="抄报状态">
          </el-table-column>
          <el-table-column
            prop="name"
            label="返写状态">
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
      Breadnav,
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
        title: '汇总上传',
        currentPage4: 4,
        serchForm: {
          type: '1',
          table: '1',
          ymj: '1',
          date: '1',
        },
        typeList:[
          {label:'专用发票',value:'1'},
          {label:'专用发票(电子)',value:'2'},
        ],
        tableList:[
          {label:'票务汇总表',value:'1'},
          {label:'正数票证',value:'2'},
          {label:'负数票证清单',value:'3'},
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
        }],
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
  .upload{
    box-sizing: border-box;
    background-color: #ffffff;
  }
  .wraingBox{
    width: 100%;
    height: 89px;
    background: #FFFBE6;
    border-radius: 2px;
    border: 1px solid #FFE58F;
    padding-left: 26px;
    box-sizing: border-box;
    position: relative;
  }
  .waringIcon{
    color: #FAAD14;
    font-size: 21px;
    position: relative;
    top: 3px;
    margin-right: 17px;
  }
  .waringTitle{
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }
  .warinBottom{
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
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
    width: 88px;
    height: 32px;
    text-align: center;
    background: #5E8CF9;
    border-radius: 2px;
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 32px;
  }

  .fixBtn{
    height: 89px;
    line-height: 89px;
    font-size: 16px;
    font-weight: 500;
    color: #5E8CF9;
    cursor: pointer;
    position: absolute;
    right: 25px;
    top:0;
  }
  .tableBox{
    padding-bottom: 100px;
  }
  .paginBox{
    padding-bottom: 20px;
    padding-right: 25px;
    text-align: right;
  }
  .mal41{
    margin-left: 41px;
  }
</style>

