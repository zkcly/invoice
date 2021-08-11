<template>
  <div>
    <el-dialog
      title="税收编码"
      :visible.sync="visible"
      :before-close="handleSureSelect"
      :close-on-click-modal="false"
      width="96%"
      append-to-body
      
    >
      <div>
        <div class="page-left">
          <div class="content">
            <h3>税收编码分类（{{ this.version }}）</h3>
            <el-row>
              <el-tree
                ref="tree"
                :data="treelist"
                :node-key="'id'"
                @node-click="handleNodeClick"
                :highlight-current="true"
              >
                <span class="span-ellipsis" slot-scope="{ node }">
                  <span :title="node.label">{{ node.label }}</span>
                </span>
              </el-tree>
            </el-row>
          </div>
        </div>
        <div class="page-right">
          <div style="margin: -12px 0 5px 20px">
            <el-row>
              <el-col :span="20">
                <el-input
                  size="medium"
                  placeholder="请输入税收编码分类、名称、简称、说明等信息"
                  v-model="queryText"
                  class="input-with-select"
                  onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
                >
                  <el-button slot="append" @click="serch">搜索</el-button>
                </el-input>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-table :data="tableData" style="width: 100%">
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
                  <el-table-column prop="description" label="说明">
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    label="操作"
                    width="100"
                    v-if="this.ifShow"
                  >
                    <template slot-scope="scope">
                      <el-button @click="handleClick(scope.row)" type="text"
                        >选择</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </div>
          <div class="paginBox">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="this.pageInfo.currentPage"
              :page-sizes="[10, 20, 50, 100, 200]"
              :page-size="10"
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="this.pageInfo.total"
            >
            </el-pagination>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleSureSelect" >完成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import Listnodate from "@/components/ListNoDate";
import Breadnav from "@/components/Breadnav";
export default {
  name: "ProductManagement",
  components: {
    Listnodate,
    Breadnav,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    ids: {
      type: Array,
      default() {
        return [];
      },
    },
    ifShow: {
      type: Boolean,
      default: false,
    },
    ifGoodsController: {
      type: Boolean,
      default: false,
    },
    ifGetData: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      noDateFlag: "successNoDate",
      treelist: [
        {
          id: 1,
          label: "商品类别一级",
          children: [],
        },
      ],
      queryParams: "",
      queryText: '',
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
        // {
        //   code: "123123123",
        //   name: "",
        //   abbreviation: "",
        //   edition: "",
        //   explain: "",
        // },
      ],
      pageInfo: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      currentPage4: 0,
      updateVisibility: true,
      code: "",
      version: "",
    };
  },
  watch: {
    visible: {
      handler: function (newval, oldval) {
        if (newval == true) {
          this.getGoodsList(
            this.pageInfo.pageSize,
            this.pageInfo.currentPage,
            this.queryParams,
            ""
          );
        }
        if (newval == false) {
          this.changeTreeNodeStatus(this.$refs.tree.store.root)
        }
      },
      deep: true,
    },
  },
  created() {
    console.log(this.$route);
    request({
      url: "company/goodsCode/treeList",
      method: "get",
    }).then((res) => {
      console.log(res);
      // this.treelist = [
      //   {
      //     id: 1,
      //     label: "商品类别一级",
      //     children: res.data,
      //   },
      // ];
      this.treelist = res.data;
    });
    this.getVersion();
  },
  mounted() {},
  methods: {
    changeTreeNodeStatus (node) {
        node.expanded = this.expandAll
        for (let i = 0; i < node.childNodes.length; i++) {
          // 改变节点的自身expanded状态
          node.childNodes[i].expanded = this.expandAll
          // 遍历子节点
          if (node.childNodes[i].childNodes.length > 0) {
            this.changeTreeNodeStatus(node.childNodes[i])
          }
        }
      },
    clickLeft() {
      this.$router.push({ name: "managementIndex" });
    },
    getVersion() {
      request({
        url: "company/goodsCode/getVersion",
        method: "get",
      }).then((res) => {
        this.version = res.data;
      });
    },

    serch() {
      this.pageInfo.currentPage = 1;
      this.queryParams = this.queryText
      this.getGoodsList(
        this.pageInfo.pageSize,
        this.pageInfo.currentPage,
        this.queryParams,
        ''
      );
    },
    getGoodsList(pageSize, pageNum, keyword, code) {
      // this.$refs.tree.setCheckedKeys([1]);
      request({
        url: "company/goodsCode/listByCondition",
        method: "post",
        data: { pageSize, pageNum, keyword, code },
        headers: {
          showLoading: true,
        },
      }).then((res) => {
        this.tableData = res.data.records;
        this.pageInfo.currentPage = res.data.current;
        this.pageInfo.pageSize = res.data.size;
        this.pageInfo.total = res.data.total;
      });
    },

    //分页
    handleSizeChange(val) {
      this.pageInfo.pageSize = val;
      this.getGoodsList(
        val,
        1,
        this.queryParams,
        this.code
      );
    },
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val;
      this.getGoodsList(
        this.pageInfo.pageSize,
        val,
        this.queryParams,
        this.code
      );
    },

    handleNodeClick(val) {
      this.queryParams = "";
      this.queryText = ''
      this.code = val.code;
      console.log(val);
      if (val.id == 1) {
        return;
      }
      this.getGoodsList(
        this.pageInfo.pageSize,
        1,
        '',
        val.code
      );
      // request({
      //   url: "company/goodsCode/listByCondition",
      //   method: "post",
      //   data: { code: val.code, pageSize: this.pageInfo.pageSize, pageNum: this.pageInfo.currentPage },
      //   headers: {
      //     showLoading: true,
      //   },
      // }).then((res) => {
      //   this.tableData = res.data.records;
      //   this.pageInfo.currentPage = res.data.current
      //   this.pageInfo.pageSize = res.data.size
      //   this.pageInfo.total = res.data.total
      // });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleClick(row) {
      if (this.ifGoodsController == false && this.ifGetData == false) {
        request({
          url: "server/todo/batchAssignCode",
          method: "post",
          data: {
            goodIds: this.ids,
            goodsCode: row.goodsCode,
            goodsShortName: row.goodsShortName,
          },
          headers: {
            showLoading: true,
          },
        })
          .then((res) => {
            this.$emit("update:visible", false);
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "操作成功!",
              });
              this.$emit("updateGoods");
              this.$emit("update:visible", false);
            }
          })
          .catch((error) => {
            // this.$message({
            //   type: "error",
            //   message: error,
            // });
          });
      } else if (this.ifGoodsController == true && this.ifGetData == false) {
        request({
          url: "company/companyGoods/batchCode",
          method: "post",
          data: {
            goodsIds: this.ids,
            goodsCode: row.goodsCode,
            goodsShortName: row.goodsShortName,
            goodsName: row.goodsName,
            // taxRate:Number(row.taxRate)/100,
            taxRate: row.taxRateNum,
          },

          headers: {
            showLoading: true,
          },
        })
          .then((res) => {
            this.$emit("update:visible", false);
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "操作成功!",
              });
              this.$emit("updateGoods");
              this.$emit("update:visible", false);
            }
          })
          .catch((error) => {
            // this.$message({
            //   type: "error",
            //   message: error,
            // });
          });
      } else if (this.ifGoodsController == true && this.ifGetData == true) {
        this.$emit("getDetail", row);
        this.$emit("update:visible", false);
      }
    },

    //确认选择税收编码
    handleSureSelect() {
      this.queryParams = "";
      this.queryText = ''
      this.pageInfo.pageSize = 10
        this.pageInfo.currentPage = 1
        this.code = ''
        this.$emit("update:visible", false);
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
  width: 15%;
  height: 500px;
  background-color: #fff;
  margin: 2px 0;
  overflow-x: auto;
  overflow-y: auto;
}
.content {
  width: 300px;
}

.page-right {
  float: right;
  width: 85%;
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
  text-align: right;
}
.span-ellipsis {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
}
</style>
