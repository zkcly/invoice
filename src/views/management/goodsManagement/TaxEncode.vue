<template>
  <div>
    <div class="page-container">
      <!-- <span class="title"
        ><i class="el-icon-arrow-left" style="font-weight: 800"></i
        >税收编码</span
      > -->
      <breadnav textTitle="税收编码" @leftEvent="clickLeft" />
    </div>
    <div class="page-left">
      <div style="position: fixed;z-index: 2;width: 17.3%;background: white;"><h3 style="margin-left: 30px;">税收编码分类（版本号）</h3></div>
      <div style="margin-left: 30px;width:350px;overflow:auto;margin-top: 50px;">
        <el-row>
          <el-tree
            ref="tree"
            :data="treelist"
            :node-key="'id'"
            @node-click="handleNodeClick"  
            :highlight-current='true'
          ></el-tree>
        </el-row>
      </div>
    </div>
    <div class="page-right">
      <div style="margin: 24px 0 0 20px">
        <el-row>
          <el-col :span="20">
            <el-input
              size="medium"
              placeholder="请输入关键字"
              v-model="queryParams"
              class="input-with-select"
            >
              <el-button slot="append" @click="getTaxlist">搜索</el-button>
            </el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-table :data="tableData" style="width: 100%;margin-top:20px;">
              <div slot="empty">
                <listnodate :tableFlag="noDateFlag" />
              </div>
              <el-table-column prop="goodsCode" label="税收分类编码">
              </el-table-column>
              <el-table-column prop="goodsName" label="税收分类名称">
              </el-table-column>
              <el-table-column prop="goodsShortName" label="税收分类简称">
              </el-table-column>
              <el-table-column prop="taxRate" label="税率"> </el-table-column>
              <el-table-column prop="explain" label="说明"> </el-table-column>
              <!-- <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                  <el-button
                    @click="handleClick(scope.row)"
                    type="text"
                    >选择</el-button
                  >
                </template>
              </el-table-column> -->
            </el-table>
          </el-col>
        </el-row>
      </div>
      <div class="paginBox">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageInfo.currentPage"
          :page-sizes="[10, 20, 50, 100,200]"
          :page-size="pageInfo.pageSize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageInfo.total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import Listnodate from "@/components/ListNoDate";
import Breadnav from "@/components/Breadnav";
import {
  getTaxListInfo,
  getTreelistInfo
} from "@/api/taxcode";
export default {
  name: "ProductManagement",
  components: {
    Listnodate,
    Breadnav
  },
  data() {
    return {
        noDateFlag: "successNoDate",
      
        pageNum: 1, //当前页码 第一页是1
        pageSize: 10,
        treelist: [
        {
          id: 1,
          label: "商品类别一级",
          children:[]
        },
      ],
      queryParams: "",
      codeOptions: [
        {
          value: "0",
          label: "全部商品",
        },
        {
          value: "1",
          label: "未赋码",
        },
        {
          value: "2",
          label: "已赋码",
        },
      ],
      tableData: [
       
      ],
      pageInfo: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      currentPage4: 0,
      updateVisibility: true,
    };
  },
  created() {
  },
  mounted(){
  this.getTaxlist(this.pageInfo.pageSize, this.pageInfo.pageNum);
  this.gettreeList();
  },
  methods: {
    clickLeft(){
      this.$router.back(-1);
     
      },

    //获取表格列表数据
     async getTaxlist(pageSize, pageNum) {
      var params = {
        keyword:this.queryParams,
        pageSize,
        pageNum,
        code: this.code,//商品编码
      };
      console.log(params)
      const res = await getTaxListInfo(params);
      if (res.code == 200) {
        this.tableData=res.data.records;
        this.pageInfo.currentPage = res.data.current;
        this.pageInfo.total = res.data.total;
        this.pageInfo.pageSize = res.data.size; 
      }
    },
    //获取左侧树菜单
     async gettreeList(){
      const res = await getTreelistInfo();
       if (res.code == 200) {
         this.treelist=res.data;
       }
    },
   
    // selectTreeNode(data, checked, tree) {
    //   //传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点
    //   // console.log("data", data);
    //   // console.log("checked", checked);
    //   // console.log("tree", tree);
    //   if (checked) {
    //     this.checkedId = data.id;
    //     this.$refs.tree.setCheckedKeys([data.id]);
    //   } else {
    //     if (this.checkedId == data.id) {
    //       this.$refs.tree.setCheckedKeys([data.id]);
    //     }
    //   }
    // },
    //传递给 data 属性的数组中该节点所对应的对象、树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性
    // checktree(data, checked) {
    //   this.queryParams = "";
    //   request({
    //     url: "company/goodsCode/listByCode",
    //     method: "get",
    //     params: { code: data.id },
    //     headers: {
    //       showLoading: true,
    //     },
    //   }).then((res)=>{
    //      this.tableData=res.data
    //   });
    // },


    //点左侧树查询
    async handleNodeClick(data) {
      this.queryParams = "";
      this.code = data.code
      var params = {
        keyword:this.queryParams,
        pageSize:this.pageInfo.pageSize,
        pageNum: this.pageInfo.currentPage,
        code:data.code,//商品编码
      };
       const res = await getTaxListInfo(params);
      if (res.code == 200) {
        this.tableData=res.data.records;
        this.pageInfo.currentPage = res.data.current;
        this.pageInfo.total = res.data.total;
        this.pageInfo.pageSize = res.data.size; 
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleClick(row) {
        request({
        url: "server/todo/batchAssignCode",
        method: "post",
        data: { goodIds: [] ,goodsCode:'',goodsShortName:''},
        headers: {
          showLoading: true,
        },
      })
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val;
      this.getTaxlist(val, this.pageInfo.pageNum);
    },
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val;
      console.log(`当前页: ${val}`);
      this.getTaxlist(this.pageSize, val);
    },
  },
};
</script>

<style lang="scss" scoped>
.page-container {
  background-color: #fff;
  padding: 0 40px 0 0;
  height: 61px;
  line-height: 61px;
}

.page-left {
  float: left;
  width: 20%;
  height: 500px;
  background-color: #fff;
  margin: 2px 0;
  // overflow: hidden;
  overflow: auto;
  
}

.page-right {
  float: right;
  width: 80%;
  height: 500px;
  background-color: #fff;
  margin-top: 2px;
  // margin-right: 22px;
  // overflow: hidden;
  overflow-x: hidden;
  overflow-y: auto;
  border-left: 1px solid #ececec;
  padding-top: 21px;
  padding-left: 25px;
  padding-right: 25px;
  box-sizing: border-box;
}

.title {
  font-size: 16px;
  line-height: 10px;
}

.right {
  border-left: 1px solid #000;
  height: 100%;
}

.paginBox {
  padding-bottom: 20px;
  padding-right: 25px;
  margin-top:20px;
  text-align: right;
}
.input-with-select{

  width:30%;
}
</style>