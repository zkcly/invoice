<template>
  <div id="boxShow">
    <div class="page-container">
      <div class="box">
        <div class="breadNav" @click="clickLeft">
          <i class="el-icon-arrow-left"></i>
          <span class="navText">{{ title }}</span>
        </div>
      </div>
    </div>
    <div style="background-color: #fff">
      <div style="display: flex">
        <div class="page-header">
          <div>
            <el-form>
              <el-form-item style="margin-bottom: 5px; margin-left: 10px">
                <el-input
                  placeholder="请输入"
                  size="small"
                  v-model.trim="inputValue"
                  onkeyup="value=value.replace(/\s+/g,'')"
                  style="width: 80%"
                >
                  <el-button
                    slot="append"
                    icon="el-icon-search"
                    @click="handleSearch()"
                  ></el-button>
                </el-input>
                <!-- <el-button
                  type="text"
                  @click="addDialogVisible = true"
                  style="margin-left: 5px"
                  >新增</el-button
                > -->
                <span
                  class="el-icon-circle-plus-outline"
                  style="margin-left: 10px; cursor: pointer"
                  @click="addDialogVisible = true"
                ></span>
              </el-form-item>
            </el-form>
          </div>
          <div style="height:550px;overflow-y:auto;margin: 0;">
            <ul style="margin: 0;">
            <li
              v-for="(col, index) in columns"
              :key="col.id + ''"
              @click="handleClick(col, index)"
              :class="{ selectedColor: selectIndex === index }"
              style="width: 100%; height: auto; cursor: pointer; padding: 0px"
            >
              <p style="margin-left: 10px; display: inline-block; width: 45%">
                {{ col.roleName }}
              </p>
              <span v-if="col.show" style="float:right;margin-right:10px">
                <el-button
                  type="text"
                  @click.stop="
                    editDialogVisible = true;
                    editForm.editRoleName = col.roleName;
                  "
                  :disabled="col.defFlag == 0"
                  >修改</el-button
                >
                <el-button
                  type="text"
                  @click.stop="handleDelete"
                  :disabled="col.defFlag == 0"
                  >删除</el-button
                >
                <el-button type="text" @click.stop="copyDialogVisible = true"
                  >复制</el-button
                >
              </span>
            </li>
          </ul>
          </div>
        </div>
        <div
          style="margin-left: 40px; min-height: 600px"
          v-show="jurisdictionShow"
        >
          <h2 class="title">权限设置</h2>
          <div>
            <!-- style="margin-top: 0px; overflow-y: auto; height: 450px" -->
            <el-tree
              ref="loveTree"
              :data="treeData"
              :props="defaultProps"
              show-checkbox
              class="filter-tree"
              node-key="id"
              highlight-current
              check-on-click-node
              :check-strictly="true"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              @check="check"
            >
              <span class="span-ellipsis" slot-scope="{ node }">
                <span :title="node.label">{{ node.label }}</span>
              </span>
            </el-tree>
          </div>
          <el-button
            size="small"
            @click="handleSave"
            :disabled="defFlag == 0"
            style="
              margin-left: 30px;
              width: 88px;
              height: 32px;
              margin-top: 30px;
            "
            type="primary"
            >保存</el-button
          >
        </div>
      </div>
    </div>

    <!-- 新增角色对话框 -->
    <el-dialog
      title="新增角色"
      :visible.sync="addDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
      @close="
        addDialogVisible = false;
        addForm.addRoleName = null;
        $refs.addFormX.resetFields();
      "
      width="50%"
    >
      <div class="dm">
        <el-form
          :model="addForm"
          :rules="rules"
          ref="addFormX"
          label-width="20%"
          size="mini"
        >
          <el-form-item
            label="角色名称："
            prop="addRoleName"
            :rules="{
              required: true,
              message: '角色名称不能为空,最多输入10个汉字或字符',
              trigger: 'blur',
              pattern: /^[\u4E00-\u9FA5A-Za-z0-9]{0,10}$/,
            }"
          >
            <el-input
              v-model.trim="addForm.addRoleName"
              placeholder="请输入"
              style="width: 50%"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button
          @click="
            addDialogVisible = false;
            addForm.addRoleName = null;
            $refs.addFormX.resetFields();
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="handleAdd()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改角色对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
      @close="
        editDialogVisible = false;
        editForm.editRoleName = null;
        $refs.editFormX.resetFields();
      "
      width="50%"
    >
      <div class="dm">
        <el-form
          :model="editForm"
          :rules="rules"
          ref="editFormX"
          label-width="20%"
          size="mini"
        >
          <el-form-item
            label="角色名称："
            prop="editRoleName"
            :rules="{
              required: true,
              message: '角色名称不能为空,最多输入10个汉字或字符',
              trigger: 'blur',
              pattern: /^[\u4E00-\u9FA5A-Za-z0-9]{0,10}$/,
            }"
          >
            <el-input
              v-model.trim="editForm.editRoleName"
              placeholder="请输入"
              style="width: 50%"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button
          @click="
            editDialogVisible = false;
            editForm.editRoleName = null;
            $refs.editFormX.resetFields();
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="handleEdit()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 复制角色对话框 -->
    <el-dialog
      title="复制角色"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
      :visible.sync="copyDialogVisible"
      @close="
        copyDialogVisible = false;
        copyForm.copyRoleName = null;
        $refs.copyFormX.resetFields();
      "
      width="50%"
    >
      <div style="color: #5e8cf9; margin-left: 130px">
        复制的新角色将有此角色相同的权限
      </div>
      <div class="dm" style="margin-top: 20px">
        <el-form
          :model="copyForm"
          :rules="rules"
          ref="copyFormX"
          label-width="25%"
          size="mini"
        >
          <el-form-item
            label="角色名称："
            prop="copyRoleName"
            :rules="{
              required: true,
              message: '角色名称不能为空,最多输入10个汉字或字符',
              trigger: 'blur',
              pattern: /^[\u4E00-\u9FA5A-Za-z0-9]{0,10}$/,
            }"
          >
            <el-input
              v-model.trim="copyForm.copyRoleName"
              placeholder="请输入"
              style="width: 50%"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button
          @click="
            copyDialogVisible = false;
            copyForm.copyRoleName = null;
            $refs.copyFormX.resetFields();
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="handleCopy">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  roleList,
  insertRole,
  updateRole,
  deleteRole,
  roleListMenuIdByRoleId,
  listTreeByClientCode,
  updateCustomRoleMenu,
} from "@/api/roleApi.js";
import Config from "@/settings";
import Breadnav from "@/components/Breadnav";

export default {
  components: {
    Breadnav,
  },
  data() {
    return {
      selectIndex: null, //li--index
      title: "角色管理",
      columns: [], //角色list
      inputValue: null, //输入框搜索
      // 客户段编码:dzgc
      addDialogVisible: false, //新增角色 弹框
      addForm: {
        addRoleName: null,
      },

      editDialogVisible: false, //编辑角色 弹框
      editForm: {
        editRoleName: null,
      },
      rules: {},

      copyDialogVisible: false, //复制角色 弹框
      copyForm: { copyRoleName: null },

      nowRoleId: null, //当前操作的角色id
      loading: false,

      // -----------------树
      treeData: [], //角色菜单列表
      menuIds: [], //角色菜单列表id
      defaultProps: {
        children: "children",
        label: "label",
        // disabled:'disabled'
        disabled: this.disabledFn,
      },
      jurisdictionShow: false,

      companyId: null, //企业id
      defFlag: null,
    };
  },
  created() {},
  mounted() {
    this.companyId = this.$store.state.user.loginInfo.companyId;
    this.getRoleList();
    this.getTree();
  },
  methods: {
    disabledFn() {
      if (this.defFlag == "0") {
        return true;
      } else {
        return false;
      }
    },
    clickLeft() {
      this.$router.push({ path: "/settings/index" });
    },
    getTree() {
      let applyParams = {
        clientCode: Config.clientCode, //客户段编码
      };
      var that = this;
      // this.loading = true;
      listTreeByClientCode(applyParams)
        .then((res) => {
          if (res && res.code == "200") {
            console.log(res);
            that.treeData = res.data;
            // res.data
            // that.loading = false;
          } else {
            // that.$message({
            //   type: "warning",
            //   message: res.msg,
            // });
          }
        })
        .catch((error) => {
          // that.loading = false;
          // that.noDateFlag = "err";
        });
    },
    getRoleList() {
      let applyParams = {
        clientCode: Config.clientCode,
        companyId: this.companyId, //企业id
        roleName: this.inputValue,
      };
      var that = this;
      // this.loading = true;
      roleList(applyParams)
        .then((res) => {
          if (res && res.code == "200") {
            that.columns = res.data;
            if (that.columns) {
              that.selectIndex = 0;
              that.columns.forEach((item, index) => {
                // item.show = false;
                if (index == 0) {
                  item.show = true;
                  that.defFlag = item.defFlag;
                } else {
                  item.show = false;
                }
              });
              that.jurisdictionShow = true;
              that.getMenu();
            } else {
              that.jurisdictionShow = false;
              that.$message({
                type: "warning",
                message: "无数据",
              });
            }
          } else {
            // that.$message({
            //   type: "warning",
            //   message: res.msg,
            // });
          }
        })
        .catch((error) => {
          // that.loading = false;
          // that.noDateFlag = "err";
        });
    },
    getRoleList2() {
      let applyParams = {
        clientCode: Config.clientCode,
        companyId: this.companyId, //企业id
        roleName: this.inputValue,
      };
      var that = this;
      // this.loading = true;
      roleList(applyParams)
        .then((res) => {
          if (res && res.code == "200") {
            that.columns = res.data;
            // that.selectIndex=0;
            that.columns.forEach((item, index) => {
              // item.show = false;
              if (index == that.selectIndex) {
                item.show = true;
                that.defFlag = item.defFlag;
              } else {
                item.show = false;
              }
            });
            that.jurisdictionShow = true;
            that.getMenu();
          } else {
            // that.$message({
            //   type: "warning",
            //   message: res.msg,
            // });
          }
        })
        .catch((error) => {
          // that.loading = false;
          // that.noDateFlag = "err";
        });
    },
    getMenu() {
      // this.$refs.loveTree.setCheckedKeys([]);
      // this.jurisdictionShow = true;
      let applyParams = {
        roleId: this.columns[this.selectIndex].id,
      };
      var that = this;
      that.loading = true;
      roleListMenuIdByRoleId(applyParams)
        .then((res) => {
          if (res && res.code == "200") {
            console.log(res);
            that.menuIds = res.data;
            that.$refs.loveTree.setCheckedKeys(that.menuIds);
            that.reload(that.menuIds);
            that.loading = false;
          } else {
            // that.$message({
            //   type: "warning",
            //   message: res.msg,
            // });
          }
        })
        .catch((error) => {
          that.loading = false;
        });
    },
    //模糊查询
    handleSearch() {
      this.getRoleList();
    },
    handleClick(col, index) {
      this.selectIndex = index;
      this.defFlag = col.defFlag;
      this.columns.forEach((item) => {
        item.show = false;
      });
      this.columns[index].show = true;
      this.$refs.loveTree.setCheckedKeys([]);
      this.jurisdictionShow = true;
      let applyParams = {
        roleId: col.id, //角色id
      };
      var that = this;
      that.loading = true;
      roleListMenuIdByRoleId(applyParams)
        .then((res) => {
          if (res && res.code == "200") {
            console.log(res);
            that.menuIds = res.data;
            that.$refs.loveTree.setCheckedKeys(that.menuIds);
            that.reload(that.menuIds);
            that.loading = false;
          } else {
            // that.$message({
            //   type: "warning",
            //   message: res.msg,
            // });
          }
        })
        .catch((error) => {
          that.loading = false;
        });
    },
    // 新增角色--确定
    handleAdd() {
      var that = this;
      this.$refs.addFormX.validate((valid) => {
        if (valid) {
          let applyParams = {
            clientCode: Config.clientCode, //客户段编码
            companyId: this.companyId, //企业id
            roleName: that.addForm.addRoleName, //角色名称
          };
          insertRole(applyParams)
            .then((res) => {
              if (res && res.code == "200") {
                that.addDialogVisible = false;
                that.addForm.addRoleName = null;
                that.$refs.addFormX.resetFields();
                that.$message({
                  type: "success",
                  message: "新增成功",
                });
                that.getRoleList();
              } else {
                // that.$message({
                //   type: "warning",
                //   message: res.msg,
                // });
              }
            })
            .catch((error) => {
              that.$message({
                type: "warning",
                message: res.data.msg,
              });
            });
        }
      });
    },
    // 编辑角色--确定
    handleEdit() {
      var that = this;
      this.$refs.editFormX.validate((valid) => {
        if (valid) {
          let applyParams = {
            clientCode: Config.clientCode, //客户段编码
            roleName: that.editForm.editRoleName, //角色名称
            id: that.columns[that.selectIndex].id, //角色id
          };
          updateRole(applyParams)
            .then((res) => {
              if (res && res.code == "200") {
                that.editDialogVisible = false;
                that.editForm.editRoleName = null;
                that.$refs.editFormX.resetFields();
                that.$message({
                  type: "success",
                  message: "编辑成功",
                });
                that.getRoleList2();
              } else {
                // that.$message({
                //   type: "warning",
                //   message: res.msg,
                // });
              }
            })
            .catch((error) => {});
        }
      });
    },
    //复制角色---确定
    handleCopy() {
      var that = this;
      this.$refs.copyFormX.validate((valid) => {
        if (valid) {
          let applyParams = {
            clientCode: Config.clientCode, //客户段编码
            companyId: this.companyId, //企业id
            roleName: that.copyForm.copyRoleName, //角色名称
            menuIds: that.menuIds,
          };
          insertRole(applyParams)
            .then((res) => {
              if (res && res.code == "200") {
                that.copyDialogVisible = false;
                that.copyForm.copyRoleName = null;
                that.$refs.copyFormX.resetFields();
                that.$message({
                  type: "success",
                  message: "复制成功",
                });
                that.getRoleList();
              } else {
                // that.$message({
                //   type: "warning",
                //   message: res.msg,
                // });
              }
            })
            .catch((error) => {});
        }
      });
    },
    // 删除角色
    handleDelete() {
      this.$confirm("你确认删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let applyParams = {
            roleId: this.columns[this.selectIndex].id, //角色id
          };
          var that = this;
          deleteRole(applyParams)
            .then((res) => {
              if (res && res.code == "200") {
                that.$message({
                  type: "success",
                  message: "删除成功",
                });
                that.getRoleList();
                that.jurisdictionShow = false;
              } else {
                // that.$message({
                //   type: "warning",
                //   message: res.msg,
                // });
              }
            })
            .catch((error) => {});
        })
        .catch(() => {});
    },
    handleNodeClick(data) {
      console.log(data);
    },
    //保存
    handleSave() {
      var checkedKey = this.$refs.loveTree.getCheckedKeys();
      let halfCheckedKeys = this.$refs.loveTree.getHalfCheckedKeys();
      checkedKey = checkedKey.concat(halfCheckedKeys);

      let applyParams = {
        roleId: this.columns[this.selectIndex].id, //角色id
        menuIds: checkedKey,
      };
      var that = this;
      updateCustomRoleMenu(applyParams)
        .then((res) => {
          if (res && res.code == "200") {
            that.$message({
              type: "success",
              message: "保存成功",
            });
            that.getRoleList2();
          } else {
            // that.$message({
            //   type: "warning",
            //   message: res.msg,
            // });
          }
        })
        .catch((error) => {});
    },

    filterNode(value, menuItems) {
      if (!value) return true;
      return menuItems.label.indexOf(value) !== -1;
    },
    reload(treeIds) {
      treeIds.forEach((treeId) => {
        let node = this.$refs.loveTree.getNode(treeId);
        this.parentNodesChange(node);
      });
    },

    check(data) {
      let treeNodeKey = data.id;
      let checkNode = this.$refs.loveTree.getNode(treeNodeKey);
      this.childNodesChange(checkNode);
      this.parentNodesChange(checkNode);
    },
    childNodesChange(node) {
      let len = node.childNodes.length;
      for (let i = 0; i < len; i++) {
        node.childNodes[i].checked = node.checked;
        this.childNodesChange(node.childNodes[i]);
      }
    },
    parentNodesChange(node) {
      if (node.parent) {
        let parentNode = node.parent;
        if (parentNode.childNodes) {
          let childNodes = parentNode.childNodes;
          let checkedMap = childNodes.map((child) => {
            return child["checked"];
          });
          let indeterminateMap = childNodes.map((child) => {
            return child["indeterminate"];
          });
          if (this.allIsTrue(checkedMap)) {
            parentNode.checked = true;
            if (indeterminateMap.includes(true)) {
              parentNode.indeterminate = true;
            } else {
              parentNode.indeterminate = false;
            }
          } else {
            if (this.allIsFalse(checkedMap)) {
              parentNode.checked = false;
              parentNode.indeterminate = false;
            } else {
              parentNode.checked = true;
              parentNode.indeterminate = true;
            }
          }
        }
        this.parentNodesChange(parentNode);
      }
    },
    allIsTrue(array) {
      for (const arr of array) {
        if (!arr) {
          return false;
        }
      }
      return true;
    },
    allIsFalse(array) {
      for (const arr of array) {
        if (arr) {
          return false;
        }
      }
      return true;
    },
  },
};
</script>

<style scoped>
.el-form-item {
  margin-bottom: 0px;
}
.page-container {
  background-color: #fff;
  padding: 0;
  border-bottom: 1px solid #ececec;
  /* width: 98%; */
  /* height: 40px; */
}

.page-header {
  background-color: #fff;
  width: 23%;
  height: auto;
  min-height: 600px;
  /* width: 260px; */
  border-right: 1px solid #ececec;
  /* margin: 2px 0; */
  overflow: hidden;
}
.dm {
  margin-left: 50px;
}
/* .el-input {
  width: 200px;
  background: #f1f3f7;
  border-radius: 2px;
} */
.breadNav {
  display: inline-block;
  cursor: pointer;
  margin-left: 25px;
  font-size: 16px;
  font-weight: 400;
  color: #252525;
}
.navText {
  margin-left: 6px;
}
.box {
  width: 100%;
  height: 50px;
  line-height: 30px;
  padding-top: 10px;
  /* border-bottom: 2px solid #ececec; */
}
.selectedColor {
  background-color: #e6f7ff;
}
#boxShow >>> .el-dialog__wrapper .el-dialog .el-dialog__header {
  border-bottom: 1px solid #ececec;
}
#boxShow >>> .el-dialog__wrapper .el-dialog .el-dialog__footer {
  border-top: 1px solid #ececec;
}

/* .el-tree {
  width: 100%;
  height: 100%;
  overflow-x: scroll;
  overflow-y: scroll;
}

.el-tree>.el-tree-node {
  display: inline-block !important;
  width:100%;
} */
</style>
