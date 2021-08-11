<template>
  <div>
    <div class="page-container borderBottom">
      <!-- <span class="title"
        ><i class="el-icon-arrow-left" style="font-weight: 800"></i
        >客户管理</span
      > -->
      <breadnav textTitle="客户管理" @leftEvent="clickLeft" />
      <div class="rightNavBox">
        <div class="rightNav" @click="customerImport">
          <img
            src="@/assets/goods/import_slices/import@2x.png"
            alt="图片"
            class="navImg"
          />
          <span class="navTex">导入</span>
        </div>
        <div class="rightNav" @click="customerExport">
          <img
            src="@/assets/goods/export_slices/export@2x.png"
            alt="图片"
            class="navImg"
          />
          <span class="navTex">导出</span>
        </div>
        <div class="rightNav" @click="customerDelete">
          <img
            src="@/assets/goods/delete_slices/delete@2x.png"
            alt="图片"
            class="navImg"
          />
          <span class="navTex">删除</span>
        </div>
        <div class="rightNav" @click="customerTemplate">
          <img
            src="@/assets/goods/download_slices/download@2x.png"
            alt="图片"
            class="navImg"
          />
          <span class="navTex">模板下载</span>
        </div>
        <el-button type="primary" @click="addCustomer">新增</el-button>
      </div>

      <!-- <div class="title-right">
        <el-row>
          <el-col :span="2" :offset="14">
            <img src="@/assets/goods/export_slices/export.png" />
            <el-button type="text" size="mini" @click="dialogVisible = true"
              >导入</el-button
            >
          </el-col>
          <el-col :span="2">
            <img src="@/assets/goods/import_slices/import.png" />
            <el-button type="text" size="mini" @click="customerExport">导出</el-button>
          </el-col>
          <el-col :span="2">
            <img src="@/assets/goods/delete_slices/delete.png" />
            <el-button type="text" size="mini" @click="customerDelete">删除</el-button>
          </el-col>
          <el-col :span="2">
            <img src="@/assets/goods/download_slices/download.png" />
            <el-button type="text" size="mini" @click="customerTemplate">模板下载</el-button>
          </el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              size="mini"
              @click="addCustomer"
              >新增</el-button
            >
          </el-col>
        </el-row>
      </div> -->
    </div>
    <div class="clearfix">
      <div class="page-left">
        <el-row class="page-content">
          <el-col :span="24" class="left">
            <el-row>
              <el-col :span="8">
                <el-button type="text" @click="addCategoryDialog"
                  >新增</el-button
                >
              </el-col>
              <el-col :span="8">
                <el-button type="text" @click="editCategoryDialog"
                  >修改</el-button
                >
              </el-col>
              <el-col :span="8">
                <el-button type="text" @click="deleteCategory">删除</el-button>
              </el-col>
            </el-row>
            <el-row>
              <!-- <el-scrollbar style="height: 100%"> -->
                <el-tree
                  class="flow-tree"
                  ref="customerTree"
                  :data="data"
                  :props="defaultProps"
                  :default-expanded-keys="['1']"
                  node-key="id"
                  @node-click="handleNodeClick"
                  :highlight-current="true"
                  :render-content="renderContent"
                ></el-tree>
              <!-- </el-scrollbar> -->
            </el-row>
          </el-col>
        </el-row>
      </div>
      <div class="page-right">
        <div>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form
                ref="searchOne"
                :rules="searchrules"
                :model="searchForm"
                class="pr24"
              >
                <el-form-item prop="searchText">
                  <el-input
                    placeholder="请输入关键字"
                    v-model.trim="queryParams.keyword"
                  >
                    <el-button
                      slot="append"
                      icon="el-icon-search"
                      @click="clickSerch"
                    ></el-button>
                  </el-input>
                </el-form-item>
              </el-form>

              <!-- <el-input
 
    </div>
    <div class="page-right">
      <div >
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form ref="searchOne" :rules="searchrules" :model="searchForm" class="pr24">
              <el-form-item prop="searchText">
                <el-input placeholder="请输入内容" v-model.trim="searchForm.searchText">
                  <el-button slot="append" icon="el-icon-search" @click="clickSerch"></el-button>
                </el-input>
              </el-form-item>
            </el-form>
 
             <el-input
              size="medium"
              placeholder="请输入"
              v-model="queryParams.keyword"
              class="input-with-select"
            >
              <el-button slot="append" @click="clickSerch">搜索</el-button>
            </el-input> -->
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-row>
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
                  <el-table-column type="selection"> </el-table-column>
                  <el-table-column
                    prop="customerName"
                    label="客户名称"
                    width="100"
                  >
                  </el-table-column>
                  <el-table-column prop="taxId" label="税号"> </el-table-column>
                  <el-table-column
                    prop="addressAndPhone"
                    label="地址电话"
                    width="180"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="bankAndAccount"
                    label="开户行及账号"
                    width="180"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="invoicePhone"
                    label="收票手机号"
                    width="120"
                  >
                  </el-table-column>
                  <el-table-column prop="invoiceEmail" label="收票邮箱">
                  </el-table-column>
                  <el-table-column prop="remarks" label="备注">
                  </el-table-column>
                  <el-table-column label="操作" width="100" fixed="right">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="text"
                        @click="handleEdit(scope.$index, scope.row)"
                        >修改</el-button
                      >
                      <el-button
                        size="mini"
                        type="text"
                        @click="handleCopy(scope.$index, scope.row)"
                        >复制</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div class="paginBox">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[10, 20, 50, 100, 200]"
            :page-size="10"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- 新增/修改分类 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="updateVisibility"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        :model="category"
        :rules="rulesSortForm"
        ref="editCustomerCategory"
        label-width="150px"
        width="'70%'"
      >
        <el-form-item label="客户类别名称" prop="categoryName">
          <el-input
            v-model.trim="category.categoryName"
            autocomplete="off"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属类别">
          {{ this.categoryName }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="updateCategory">保存</el-button>
      </div>
    </el-dialog>

    <!-- 导入按钮对话框 -->
    <el-dialog
      title="客户导入"
      :visible.sync="importDialogVisibility"
      width="width"
      :close-on-click-modal="false"
      :before-close="cancelUploadFun"
    >
      <el-form :model="uploadForm" label-suffix=":">
        <el-form-item label="文件类型">
          <el-select v-model="uploadForm.fileType" placeholder="请选择">
            <el-option
              v-for="item in fileTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择文件">
          <el-upload
            class="upload-demo"
            action=""
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :http-request="importFileFun"
            :auto-upload="false"
            accept=".xls,.txt,.xml,.xlsx"
            :on-change="handleChange"
            :show-file-list="showFileList"
            ref="upload"
          >
            <el-button size="small" plain>上传文件</el-button>
            <!-- <div slot="tip" class="el-upload__tip">
                  支持扩展名：.rar .zip .doc .docx .pdf .jpg...
                </div> -->
          </el-upload>
          <div class="tipsImport">
            {{ this.fileList.length == 0 ? "未选择任何文件" : "" }}
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancelUploadFun">取 消</el-button>
        <el-button type="primary" @click="importFileFun">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 导入结果弹窗 -->
    <el-dialog :visible.sync="importResultVisible">
      <el-row>
        <el-col :span="4"><i class="el-icon-success resultIcon"></i></el-col>
        <el-col :span="20"><span class="resultText">导入成功</span></el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="importResultVisible = false"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <!-- 新增/修改商品分类 -->
    <!-- <update-client-category :visible.sync="goodsVisibility" /> -->

    <!-- 新增/修改商品 -->
    <update-client
      :visible.sync="goodsVisibility"
      @getForm="getForm"
      :editform="JSON.parse(JSON.stringify(editform))"
      :categoryData="data"
      :categoryName="categoryName"
   
      :status="status"
    />
  </div>
</template>
 
<script>
import Vue from 'vue'
import Breadnav from "@/components/Breadnav";
import UpdateClientCategory from "./components/UpdateClientCategory";
import UpdateClient from "./components/UpdateClient.vue";
import Listnodate from "@/components/ListNoDate";
import request from "@/utils/request";
import { downloadFile } from "@/utils/function.js";
import { validStrCheckLength } from "@/utils/validate";
import { mapState } from "vuex";
import preventClick from "@/utils/controlClickState";
import {
  getCustomerManagementCategory,
  getCustomerManagementCategoryAll,
  getCustomerList,
  addCustomerCategory,
  deleteCustomerCategory,
  editCustomerCategory,
  customerTemplate,
  addCustomer,
  deleteCustomer,
  updateCustomer,
  serchCustomer,
} from "@/api/customerManagementCategory";
  Vue.use(preventClick);
export default {
  name: "ProductManagement",
  components: {
    UpdateClientCategory,
    UpdateClient,
    Listnodate,
    Breadnav,
  },
  data() {
    const validateSearchText = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入客户类别"));
      } else if (!validStrCheckLength(value, 41)) {
        console.log("ssss");
        callback(new Error("最多输入40个汉字或字符"));
      } else {
        callback();
      }
    };
    return {
      categoryData: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则",
              children: [
                {
                  value: "yizhi",
                  label: "一致",
                },
                {
                  value: "fankui",
                  label: "反馈",
                },
                {
                  value: "xiaolv",
                  label: "效率",
                },
                {
                  value: "kekong",
                  label: "可控",
                },
              ],
            },
            {
              value: "daohang",
              label: "导航",
              children: [
                {
                  value: "cexiangdaohang",
                  label: "侧向导航",
                },
                {
                  value: "dingbudaohang",
                  label: "顶部导航",
                },
              ],
            },
          ],
        },
      ],
     
      data: [],
      treeData: [],
      dialogTitle: "",
      searchrules: {
        searchText: [
          {
            required: false,
            trigger: "blur",
            // validator: validateSearchText,
          },
        ],
      },
      searchForm: {
        searchText: "",
      },
      category: {
        categoryName: "",
        id: "",
        parentId: "",
        childCategory: [],
        companyId: 1,
      },
      checked: {
        id: "1",
        categoryName: "客户类别",
        parentId: "1",
        level: 1,
      },
      categoryName: "",
      rulesSortForm: {
        categoryName: [
          { required: true, trigger: "change", validator: validateSearchText },
        ],
      },

      defaultProps: {
        children: "children",
        label: "label",
      },
      queryParams: {
        keyword: "",
        codeStatus: "",
      },
      keyword: "",
      tableData: [],
      noDateFlag: "successNoDate",
      currentPage4: 0,
      updateVisibility: false,
      goodsVisibility: false,
      pageNum: 1,
      pageSize: 10,
      total: 1,
      editform: {},
      multipleSelection: "",
      status: "add",
      importDialogVisibility: false,
      fileTypeOptions: [
        {
          value: "0",
          label: "xls",
        },
        {
          value: "1",
          label: "txt",
        },
        {
          value: "2",
          label: "xml",
        },
        {
          value: "3",
          label: "xlsx",
        },
      ],
      fileList: [],
      file: null,
      uploadForm: {
        fileType: "0",
      },
      importResultVisible: false,
      importResult: true,
      showFileList: false,
    };
  },
  created() {
    this.getCustomerManagementCategory();
    this.getCustomerManagementCategoryAll();
    this.getCustomerList(this.pageSize, this.pageNum);
  },
  computed: {
    ...mapState("user", ["loginInfo", "taxDiskInfo"]),
  },
  mounted() {
    console.log(this.loginInfo);
    console.log(this.taxDiskInfo);
    console.log(this.$store.state.user);
    // this.companyId = this.$store.state.user.loginInfo.companyId
    
  },
  methods: {
    //树节点内容渲染
    renderContent(h, { node, data, store }) {
        return (
          <span class="span-ellipsis">
            <span>{node.label}</span>      
          </span>);
      },
    clickLeft() {
      this.$router.push({ name: "managementIndex" });
    },
    //获取客户列表数据
    async getCustomerManagementCategoryAll() {
      const res = await getCustomerManagementCategoryAll();
      if (res.code == 200) {
        this.dataAll = res.data
      }
    },
    //获取客户列表数据
    async getCustomerManagementCategory() {
      const res = await getCustomerManagementCategory();
      if (res.code == 200) {
        this.data = res.data;
        this.treeData = this.getTreeData(res.data)
        this.$nextTick(()=>{
          this.$refs.customerTree.setCurrentKey('1')
        })
      }
    },
    //查找选中的ID对应的label
    getTreeData(data, path=[]) {
      for(let item of data){
        if(item.hasOwnProperty('children')){
          path.push({id: item.id, label: item.label})
          this.getTreeData(item.children, path)
        }
        else{
          path.push({id: item.id, label: item.label})
        }
      }
      return path;
    },

    //查找选中的ID在树中对应的位置
    // findPathByLeafId(leafId, nodes, path) {
    //   if (path === undefined) {
    //     path = [];
    //   }
    //   for (var i = 0; i < nodes.length; i++) {
    //     var tmpPath = path.concat();
    //     tmpPath.push(nodes[i].id);
    //     if (leafId == nodes[i].id) {
    //       return tmpPath;
    //     }
    //     if (nodes[i].children) {
    //       var findResult = this.findPathByLeafId(
    //         leafId,
    //         nodes[i].children,
    //         tmpPath
    //       );
    //       if (findResult) {
    //         return findResult;
    //       }
    //     }
    //   }
    // },

    //获取表格列表数据
    async getCustomerList(pageSize, pageNum, categoryId = "") {
      var params = {
        companyId: this.taxDiskInfo.companyId,
        categoryId,
        pageSize: pageSize,
        pageNum: pageNum,
        keyword: this.keyword,
      };
      if (params.categoryId == "1") {
        params.categoryId = "";
      }
      const res = await getCustomerList(params);
      if (res.code == 200) {
        console.log(res.data);
        this.tableData = res.data.records;
        this.pageSize = res.data.size;
        this.total = res.data.total;
        this.pageNum = res.data.current;
      }
    },

    //节点被点击时候的回调（展开）
    handleNodeClick(data) {
      console.log("id", data);
      this.checked.id = data.id;
      this.checked.categoryName = data.label;
      this.checked.parentId = data.id;
      this.checked.level = data.level;

      this.getCustomerList(this.pageSize, 1, data.id == "1" ? "" : data.id);
      this.categoryName = data.label;
    },
    //节点改变时候的回调（设置单选作用）
    // selectTreeNode(data, checked, tree) {
    //   //传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点
    //   if (checked) {
    //     this.checkedId = data.id;
    //     this.$refs.customerTree.setCheckedKeys([data.id]);
    //   } else {
    //     if (this.checkedId == data.id) {
    //       this.$refs.customerTree.setCheckedKeys([data.id]);
    //     }
    //   }
    // },
    //节点被选中时候的回调
    //传递给 data 属性的数组中该节点所对应的对象、树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性
    // checktree(data, checked) {
    //   console.log('id',data.id)
    //   this.checked.id = data.id;
    //   this.checked.categoryName = data.label;
    //   this.checked.parentId = data.id;
    //   this.checked.level = data.level;

    //   this.getCustomerList(this.pageSize, this.pageNum, data.id);
    //   this.categoryName = data.label;
    // },

    //点击新增类别按钮
    addCategoryDialog(value) {
      

      this.dialogTitle = "新增客户类别";
      if (this.checked.id == "") {
        this.categoryName = "客户类别";
      }
      else{
        let findParentResult = this.dataAll.find(item => {
          return item.id == this.checked.id
        })
        this.categoryName = findParentResult.categoryName
      }
      this.updateVisibility = true;
      console.log(this.checked.id);
    },
    //点击修改类别按钮
    editCategoryDialog() {
     
      
      if (this.checked.id == "") {
        this.$message({
          type: "info",
          message: "未选中任何数据",
        });
        return;
      } else if (this.checked.id == "1") {
        this.$message({
          type: "info",
          message: "不能修改此类",
        });
        return;
      }else{
        let findResult = this.dataAll.find(item => {
        return item.id == this.dataAll.find(item => {
          return item.id == this.checked.id
        }).parentId
      })
      console.log(findResult)
      this.category.categoryName = this.checked.categoryName
      this.categoryName = findResult.categoryName
      }
      this.dialogTitle = "修改客户类别";
      this.updateVisibility = true;
    },
    //取消新增类别
    handleClose() {
      this.updateVisibility = false;
      this.$refs["editCustomerCategory"].resetFields();
    },
    //确认新增类别
    updateCategory() {
      if (this.category.categoryName == "") {
        this.$message({
          type: "info",
          message: "请输入名称",
        });
        return;
      }
      this.$refs["editCustomerCategory"].validate(async (valid) => {
        if (valid) {
          if (this.dialogTitle == "新增客户类别") {
            if (this.checked.level + 1 > 3) {
              this.$message({
                type: "info",
                message: "子类别不能超过三级！",
              });
              return;
            } else {
              let data = {
                parentId: this.checked.parentId,
                categoryName: this.category.categoryName,
                companyId: this.taxDiskInfo.companyId,
                level: this.checked.level + 1,
              };
              if (this.checked.id == "") {
                data.parentId = 1;
              }
              const res = await addCustomerCategory(data);
              if (res.code == 200) {
                this.checked.id = "";
                this.checked.categoryName = "";
                this.checked.level = 1;

                this.getCustomerManagementCategory();
                this.getCustomerManagementCategoryAll();
                this.updateVisibility = false;
                this.categoryName = "客户类别";

                this.$message({
                  type: "success",
                  message: "新增成功",
                });

                this.$refs["editCustomerCategory"].resetFields();
              }
            }
          } else {
            let data = {
              id: this.checked.id,
              categoryName: this.category.categoryName,
              companyId: this.taxDiskInfo.companyId,
            };
            const res = await editCustomerCategory(data);
            if (res.code == 200) {
              this.checked.id = "";
              this.checked.categoryName = "";
              this.checked.level = 1;

              this.$message({
                type: "success",
                message: "修改成功",
              });

              this.getCustomerManagementCategory();
              this.getCustomerManagementCategoryAll();
              this.$refs["editCustomerCategory"].resetFields();
              this.updateVisibility = false;
              this.categoryName = "客户类别";
              console.log(this.checked);
            }
          }
        } else {
          return false;
        }
      });
    },
    //确定删除类别
    deleteCategory() {
      if (this.checked.id == 1) {
        this.$message({
          type: "info",
          message: "不能删除客户类别！",
        });
        return;
      } else if (this.checked.id == "") {
        this.$message({
          type: "info",
          message: "未选择任何数据",
        });
        return;
      } else {
        this.$confirm("一旦删除，该类别下的所有子类别和客户都将删除，你确定删除吗？", "提示", {
          type: "warning",
        })
          .then(async () => {
            const res = await deleteCustomerCategory(this.checked.id);
            if (res.code == 200) {
              console.log(res);
              this.checked.id = "";
              this.checked.categoryName = "";
              this.checked.parentId = "";
              this.checked.level = 1;
              this.getCustomerManagementCategory();
              this.getCustomerManagementCategoryAll();
              this.getCustomerList(this.pageSize, 1);
              this.$message({
                type: "success",
                message: "删除成功",
              });
            }
          })
          .catch(() => {});
      }
    },

    handleSelectionChange(val) {
      console.log(val);
      var deleteArr = [];
      for (let i = 0; i < val.length; i++) {
        deleteArr.push(val[i].id);
      }
      this.multipleSelection = deleteArr;
    },

    //点击修改客户信息
    handleEdit(index, row) {
      console.log(row);
      // this.categoryNameArray = this.findPathByLeafId(row.categoryId, this.data);  

      this.treeData.find(val => {
        if(val.id == row.categoryId){
          this.categoryName = val.label || ''
        }
      })
      this.status = "edit";
      this.goodsVisibility = true;
      this.editform = row;
    },
    //点击复制客户信息
    handleCopy(index, row) {
      this.treeData.find(val => {
        if(val.id == row.categoryId){
          console.log(val.label || '')
          this.categoryName = val.label || ''
        }
      })
      this.status = "copy";
      this.goodsVisibility = true;
      this.editform = row;
    },

    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);

      this.getCustomerList(val, this.pageNum, this.checked.id);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      console.log(this.pageSize);
      this.getCustomerList(this.pageSize, val, this.checked.id);
    },

    //点击导入按钮
    customerImport() {
      this.importDialogVisibility = true;
    },
    //点击取消导入
    cancelUploadFun() {
      this.$refs["upload"].clearFiles();
      this.fileList = [];
      this.importDialogVisibility = false;
    },
    //导入文件
    importFileFun() {
      if (this.fileList.length == 0 || this.showFileList == false) {
        this.$message({
          type: "info",
          message: "请先选择文件！",
        });
        return;
      }
      let reg = this.fileList[0].name.split(".").pop();
      if (this.fileTypeOptions[this.uploadForm.fileType].label !== reg) {
        this.$message({
          type: "warning",
          message: "文件与类型不一致",
        });
        fileList.splice(0, 1);
      }
      for (let i = 0; i < this.fileList.length; i++) {
        var form = new FormData();
        form.append("file", this.fileList[i].raw);
        form.append("companyId ", this.taxDiskInfo.companyId);
        form.append(
          "categoryId ",
          this.checked.id == "" ? this.data[0].id : this.checked.id
        );
        console.log(i);
        request({
          url: "/customer/customerManagement/importExcel",
          method: "post",
          data: form,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
          .then((res) => {
            if (res.code == 200) {
              this.$refs["upload"].clearFiles();
              this.importDialogVisibility = false;
              this.fileList = [];
              this.$alert(`本次导入${res.data}`, "导入成功！", {
                confirmButtonText: "确定",
                type: "success",
                center: true,
              });
              this.getCustomerList(this.pageSize, this.pageNum, this.checked.id);
            } else {
              
            }
          })
          .catch((error) => (this.importResultVisible = true));
      }
      
    },
    handleError() {
      this.$notify.error({
        title: "上传失败",
        message: "文件上传失败",
      });
    },
    // handleExceed(files, fileList) {
    //   this.$message.warning(
    //     `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
    //       files.length + fileList.length
    //     } 个文件`
    //   );
    // },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    handleChange(file, fileList) {
      console.log(file);
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
      let reg = file.name.split(".").pop();
      if (this.fileTypeOptions[this.uploadForm.fileType].label !== reg) {
        this.$message({
          type: "warning",
          message: `请选择${
            this.fileTypeOptions[this.uploadForm.fileType].label
          }格式文件`,
        });
        fileList.splice(0, 1);
        this.showFileList = false;
        return;
      } else {
        this.fileList = fileList;
        this.showFileList = true;
        console.log(fileList);
      }
    },
    handleRemove(file, fileList) {
      console.log("handleRemove", file, fileList);
      // this.$emit("videoRemove");
    },
    handlePreview(file) {
      console.log(file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    //导出
    async customerExport() {
      var data = {
        selectType: 2,
        file: "",
        categoryId: this.checked.id,
        companyId: this.taxDiskInfo.companyId,
      };
      const res = await customerTemplate(data);
      downloadFile(res, "发票测试");
      console.log(res);
    },
    //模板下载
    async customerTemplate() {
      var data = {
        selectType: 1,
        file: "",
        categoryId: this.checked.id,
        companyId: this.taxDiskInfo.companyId,
      };
      console.log("下载模板");
      const res = await customerTemplate(data);
      downloadFile(res, "发票测试");
      console.log(res);
    },
    //删除客户
    customerDelete() {
      console.log(this.multipleSelection);
      console.log(this.tableData.length !== 0);
      if (this.multipleSelection.length == 0 ) {
        this.$message({
          type: "info",
          message: "未选中任何数据",
        });
        return;
      } 
      this.$confirm("你确定要删除吗?", "提示", {
        type: "warning",
      })
        .then(async () => {
          const res = await deleteCustomer(this.multipleSelection);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功",
            });

            this.getCustomerList(this.pageSize, 1, this.checked.id);
          } else {
            
          }
        })
        .catch(() => {});
    },
    //点击增加客户
    addCustomer() {
      if (this.checked.id == "") {
        this.$message({
          type: "info",
          message: "请选择具体类别",
        });
        return;
      }
      this.categoryName = this.checked.categoryName;
      console.log(this.checked.categoryName);
      this.status = "add";
      this.editform = {};
      this.goodsVisibility = true;
    },

    //新增修改客户信息
    async getForm(val) {
      console.log(val);

      if (this.status == "edit") {
        var data = val;
        const res = await updateCustomer(data);
        if (res.code == 200) {
          console.log(res);
          this.getCustomerList(this.pageSize, this.pageNum, this.checked.id);
          this.goodsVisibility = false;
          this.$message({
            type: "success",
            message: "修改成功",
          });
        }
      } else if (this.status == "add") {
        var data = val;
        data.categoryId = this.checked.id;
        data.companyId = this.taxDiskInfo.companyId;
        const res = await addCustomer(data);
        if (res.code == 200) {
          console.log(res);
          this.getCustomerList(this.pageSize, this.pageNum, this.checked.id);
          this.goodsVisibility = false;
          this.$message({
            type: "success",
            message: "新增成功",
          });
        }
      } else if (this.status == "copy") {
        var data = val;
        data.id = "";
        const res = await addCustomer(data);
        if (res.code == 200) {
          console.log(res);
          this.getCustomerList(this.pageSize, this.pageNum, this.checked.id);
          this.goodsVisibility = false;
          this.$message({
            type: "success",
            message: "复制成功",
          });
        }
      }
    },
    //抬头信息查询客户
    clickSerch() {
      console.log(this.$store.state);
      this.$refs["searchOne"].validate(async (valid) => {
        if (valid) {
          // var data = {
          //   companyId: this.taxDiskInfo.companyId,
          //   customerName: this.queryParams.keyword,
          // };
          this.keyword = this.queryParams.keyword;
          this.getCustomerList(this.pageSize, 1, this.checked.id);
        }
      });
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

.clearfix {
  box-sizing: border-box;
  min-height: 800px;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  // height: 1000px;
}

.page-left {
  float: left;
  width: 15%;
  // height: 1000px;
  // max-width: 300px;
  // height: 500px;
  // min-height: 800px;
  background-color: #fff;
  // margin: 2px 0;
  // overflow: hidden;
  padding-left: 25px;
  overflow-x: auto;
  overflow-y: auto;
}
.page-content {
  // width: 240px;
}

.page-right {
  float: right;
  width: 85%;
  // height: 1000px;
  // min-height: 200px;
  background-color: #fff;
  // margin-right: 22px;
  // overflow: hidden;
  // overflow-x: hidden;
  // overflow-y: auto;
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

.tipsImport {
  margin-left: 30px;
  font-size: 16px;
  color: rgb(81, 143, 143);
}

.rightNavBox {
  float: right;
  height: 61px;
  line-height: 61px;
}
.rightNav {
  display: inline-block;
  cursor: pointer;
  margin-right: 15px;
}
.navImg {
  width: 30px;
  vertical-align: sub;
  position: relative;
  top: 7px;
}
.navTex {
  font-size: 14px;
  color: #000000;
}

.title-right {
  justify-content: space-between;
  align-items: center;
  margin-top: -20px;
  img {
    vertical-align: middle;
    width: 25px;
    height: 25px;
    line-height: 30px;
    margin-right: 1px;
  }
}

.right {
  height: 100%;
}

.paginBox {
  padding-bottom: 20px;
  padding-right: 25px;
  margin-top: 100px;
  text-align: right;
}
.resultIcon {
  font-size: 32px;
  color: green;
}
.resultText {
  font-size: 14px;
  font-weight: 800;
}
.span-ellipsis {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
  }
</style>