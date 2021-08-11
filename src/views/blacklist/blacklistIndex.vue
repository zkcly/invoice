<template>
  <div class="blacklist">
    <div class="navBox">
      <breadnav :textTitle="title" @leftEvent='clickLeft' />
      <div class="searchBox">
        <el-form ref="searchOne" :rules="searchrules" :model="searchForm" class="pr24">
          <el-form-item prop="searchText">
            <el-input placeholder="请输入内容" v-model.trim="searchForm.searchText">
              <el-button slot="append" icon="el-icon-search" @click="searchFun"></el-button>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="btnBox">
        <el-button type="primary" size="medium" @click="moveMoreFun" :disabled="!moveDiasbledFlag">批量移除</el-button>
      </div>
    </div>
    <div class="listContent pl25" style="marginTop: 20px">
      <div class="tableBox">
        <el-table v-loading="loading" ref="multipleTable" tooltip-effect="dark" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :default-sort="{prop: 'createTime', order: 'descending'}">
          <div slot="empty">
            <listnodate :tableFlag="noDateFlag" />
          </div>
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="name" label="姓名">
          </el-table-column>
          <el-table-column prop="phone" label="手机号">
          </el-table-column>
          <el-table-column prop="createTime" label="屏蔽时间" sortable>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="moverBlack" @click="moveOneFun(scope.row)">移除黑名单</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="paginBox">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          background
          :total="total">
        </el-pagination>
      </div>
    </div>

  </div>
</template>


<script type="text/ecmascript-6">
  import Breadnav from '@/components/Breadnav';
  import Listnodate from '@/components/ListNoDate';

  // import {
  //   blackListApi,
  //   deleteBlackApi
  // } from "@/api/blacklistIndex.js";
  // import {
  //   validStrCheckLength
  // } from "@/utils/validate";

  import { blackListApi,deleteBlackApi} from "@/api/blacklistIndex.js";
  import { validStrCheckLength } from "@/utils/validate";


  export default {
    name: "blacklistIndex",
    components: {
      Breadnav,
      Listnodate
    },
    data() {
      const validateSearchText = (rule, value, callback) => {
        if (!validStrCheckLength(value, 40)) {
          console.log('ssss')
          callback(new Error("最多可以输入40个字符（20个汉字）"));
        } else {
          callback();
        }
      };
      return {
        title: '黑名单',
        moveDiasbledFlag: true, //批量移除黑名单按钮是否可以点击
        loading: false,
        searchForm: {
          searchText: '',
        },
        searchrules: {
          searchText: [{
            required: true,
            trigger: "blur",
            validator: validateSearchText
          }, ],
        },
        multipleSelection: [],
        tableData: [],
        noDateFlag: 'successNoDate',
        //分页
        currentPage: 1, //当前是第几页
        total: 0, //总条目数
        pageSizeNum: 10, //一页显示多少条
        // 盘号
        taxDiskNum: '',
      }
    },

   
    // mounted() {
    //   this.taxDiskNum = this.$store.state.user.taxDiskNum;
    //   this.blackListAjax(null, 1, 'true')

    created () {
      // int()
      // console.log(this.$store.state.user)
      // this.taxDiskNum=this.$store.state.user.taxDiskNum;
    },
    mounted(){
      console.log(this.$store.state.user)
      this.taxDiskNum=this.$store.state.user.taxDiskNum;
      this.blackListAjax(null,1,'true')

    },
    computed: {
      taxDiskNumChange() {
        return this.$store.state.user.taxDiskNum;
      }
    },
    watch: {
      taxDiskNumChange: {
        handler: function(newval, oldval) {
          if (newval !== oldval) {
            this.taxDiskNum = newval
          }
        },
        deep: true
      }
    },
    methods: {
      //分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSizeNum = val;
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        this.blackListAjax(this.searchForm.searchText, this.currentPage, 'true')
      },
      //多选
      handleSelectionChange(val) {
        console.log('选中', val)
        this.multipleSelection = val;
      },
      //面包屑
      clickLeft() {
        this.$router.push({
          name: 'reviewInvoicing'
        }) 
      },
      //移除单个黑名单
      moveOneFun(data) {
        this.$confirm('确定要移除黑名单吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.deleteBlackAjax(data.id)
        }).catch(() => {});
      },
      //移除多个黑名单
      moveMoreFun() {
        if (this.tableData.length == 0) {
          return
        }
        if (this.multipleSelection.length == 0) {
          this.$message({
            message: '请选择要移除的数据',
            type: 'warning'
          });
        } else {
          let ids = ''
          for (let i = 0; i < this.multipleSelection.length; i++) {
            ids += this.multipleSelection[i].id + ','
          }
          ids = ids.slice(0, ids.length - 1)
          this.$confirm('确定要移除所选择黑名单数据吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteBlackAjax(ids)
          }).catch(() => {});
        }
      },
      //搜索
      searchFun() {
        this.$refs['searchOne'].validate((valid) => {
          if (valid) {
            this.currentPage = 1;
            this.blackListAjax(this.searchForm.searchText, this.currentPage, 'true')
          } else {
            console.log('error 11111111');
            return false;
          }
        });
      },
      //分页查询 关键字，第几页，是否按照创建时间降序
      blackListAjax(keyword, pageNum, timeDesc) {
        this.loading = true
        // this.tableData = []
        let listParams = {
          "blackFlag": '1', //黑名单标识 0-正常 1-拉黑
          "keyword": keyword, ////关键字（模糊搜索
          "pageNum": pageNum, //当前页码 第一页是1
          "pageSize": this.pageSizeNum, //每页几条
          "taxDiskNum": this.taxDiskNum, //所属税盘
          "timeDesc": timeDesc //是否按创建时间降序(字符串) true 和 false 的  字符串
        }
        blackListApi(listParams).then(response => {
          if (response && response.code == '200') {
            this.loading = false
            //从接口中获取数据--s
            let inRes = response.data;
            this.tableData = inRes.records;
            this.total = inRes.total;
            //从接口中获取数据--e
            //本地测试数据--s
            //            this.tableData=this.testJsonList()
            //            this.total=25;
            //本地测试数据--s
            this.moveDiasbledFlag = this.tableData.length > 0
          }
        }).catch(error => {
          this.loading = false
          this.noDateFlag = 'err'
        })
      },
      //删除黑名单
      deleteBlackAjax(id) {
        let idParams = {
          "blacklistIds": id, //黑名单ID（多个逗号隔开）
        }
        deleteBlackApi(idParams).then(response => {
          if (response && response.code == '200') {
            this.$message({
              message: '移除黑名单成功',
              type: 'success'
            });
            this.blackListAjax(this.searchForm.searchText, this.currentPage, 'true')
          }
        }).catch(error => {})
      },
      testJsonList() {
        return [{
            "blackFlag": 0,
            "companyId": 0,
            "createTime": "04-23 17:37:48",
            "id": 0,
            "img": "string",
            "name": "姓名1",
            "openId": "string",
            "phone": "手机号1",
            "taxDiskNum": "string"
          },
          {
            "blackFlag": 0,
            "companyId": 0,
            "createTime": "04-23 17:40:48",
            "id": 1,
            "img": "string",
            "name": "姓名2",
            "openId": "string",
            "phone": "手机号2",
            "taxDiskNum": "string"
          },
          {
            "blackFlag": 0,
            "companyId": 0,
            "createTime": "04-26 17:37:48",
            "id": 2,
            "img": "string",
            "name": "姓名3",
            "openId": "string",
            "phone": "手机号2",
            "taxDiskNum": "string"
          },
          {
            "blackFlag": 0,
            "companyId": 0,
            "createTime": "05-23 17:37:48",
            "id": 3,
            "img": "string",
            "name": "姓名4",
            "openId": "string",
            "phone": "手机号2",
            "taxDiskNum": "string"
          },
        ]
      }
    }
  }
</script>


<style scoped>
  .navBox {
    position: relative;
  }
  .blacklist {
    box-sizing: border-box;
    background-color: #ffffff;
  }
  .searchBox {
    width: 232px;
    position: absolute;
    left: 160px;
    top: 0;
  }
  .searchBox>>>.el-form {
    position: relative;
    top: 15px;
  }
  .searchBox>>>.el-form-item__error {
    top: 100%
  }
  .btnBox {
    position: absolute;
    right: 27px;
    top: 50%;
    transform: translateY(-50%);
  }
  .blacklist>>>.el-input-group__append {
    padding: 0 12px;
  }
  .blacklist>>>.el-input__inner,
  .reviewInvoicing>>>.el-input__icon {
    height: 32px;
    line-height: 32px;
  }
  .btnMove {
    width: 87px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    background: #5E8CF9;
    border-radius: 2px;
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    float: right;
    cursor: pointer;
    position: relative;
    right: 27px;
    top: 15px;
  }
  .moverBlack {
    font-size: 14px;
    font-weight: 400;
    color: #1890FF;
    cursor: pointer;
  }
  .tableBox {
    padding-bottom: 100px;
    padding-right: 25px;
    box-sizing: border-box;
  }
  .paginBox {
    padding-bottom: 20px;
    padding-right: 25px;
    text-align: right;
  }
  .listContent{
    
  }
  .mal21 {
    margin-left: 21px;
  }
  .mab16 {
    margin-bottom: 16px;
  }
  .mab4 {
    margin-bottom: 4px;
  }
  .pr24 {
    padding-right: 24px;
  }
  .blue {
    color: #5E8CF9;
  }
  .red {
    color: #FF4D4F
  }
  .green {
    color: #52C41A
  }
</style>

