<template>
  <div class="user">
    <div class="user-top">
      <p class="title">
        <i class="el-icon-arrow-left" style="font-weight: 800"></i>用户管理
      </p>
      <el-button
        size="mini"
        type="primary"
        style="float: right"
        @click="addProduct"
        >新增用户</el-button
      >
      <br />
    </div>
    <!-- 分割线 -->
    <el-divider content-position="left"></el-divider>
    <el-form :inline="true" size="small" label-width="80px">
      <el-form-item label="快速搜索:">
        <el-input size="mini" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="角色类型:">
        <el-input size="mini" placeholder="请选择" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini"
          >查询</el-button
        >
      </el-form-item>
    </el-form>

    <div class="page-content">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="name" label="姓名" width="180" align="center">
        </el-table-column>
        <el-table-column prop="id" label="用户名" width="180" align="center">
        </el-table-column>
        <el-table-column prop="role" label="角色" align="center">
        </el-table-column>
        <el-table-column prop="movephone" label="电话" align="center">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="change(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="resetpassword(scope.row)"
              >重置密码</el-button
            >
            <el-button @click="handleClick(scope.row)" type="text" size="small"
              >删除</el-button
            >
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
        :total="pageInfo.total"
      >
      </el-pagination>
    </div>

    <!-- 添加/修改模态框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisibleUser">
      <el-form :model="form" :rules="rules" ref="myform">
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
          <el-input
            v-model="form.name"
            autocomplete="off"
            placeholder="请填写用户姓名"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="手机号"
          :label-width="formLabelWidth"
          prop="movephone"
        >
          <el-input
            v-model="form.movephone"
            autocomplete="off"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="初始密码"
          :label-width="formLabelWidth"
          prop="password"
        >
          <el-input
            v-model="form.password"
            autocomplete="off"
            placeholder="请设置密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色">
            <el-option label="普通用户" value="ptyh"></el-option>
            <el-option label="管理员" value="gly"></el-option>
            <el-option label="超级管理员" value="cjgly"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="可用税盘"
          :label-width="formLabelWidth"
          prop="taxplate"
        >
          <el-radio v-model="radio" label="1">税盘一 NO.3566777777</el-radio>
          <el-radio v-model="radio" label="2">税盘二 NO.3566777777</el-radio>
          <br />
          <el-radio v-model="radio" label="3">税盘三 NO.3566777777</el-radio>
          <el-radio v-model="radio" label="4">税盘四 NO.3566777777</el-radio>
        </el-form-item>
        <el-form-item
          label="电话"
          :label-width="formLabelWidth"
          prop="telephone"
        >
          <el-input
            v-model="form.telephone"
            autocomplete="off"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input
            v-model="form.email"
            autocomplete="off"
            placeholder="请填写电子邮箱"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleUser = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('myform')"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 密码模态框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisiblePassword">
      <el-form :model="passwordform" :rules="passwordrules" ref="ruleForm">
        <el-form-item label="账号" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="num">
          <el-input v-model.number="form.num" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth" prop="num">
          <el-input v-model.number="form.num" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="password-footer">
        <el-button @click="dialogFormVisiblePassword = false">取 消</el-button>
        <el-button type="primary" @click="passwordForm('ruleForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template> 

<script>
import { getList } from "@/api/table";
export default {
  name: "InvocieStock",
  data() {
    return {
      radio: "1",
      title: "新增/编辑用户",
      dialogFormVisiblePassword: false,
      dialogFormVisibleUser: false,
      formLabelWidth: "120px",
      //用户表单
      form: {
        name: "",
        id: "",
        role: "",
        movephone: "",
        email: "",
        password: "",
        taxplate: "",
      },

      //密码表单
      passwordform: {
        id: "",
        name: "",
        password: "",
        changepassword: "",
      },

      //写的假数据
      tableData: [
        {
          name: "王小虎",
          id: "12412415",
          role: "管理员",
          movephone: "15232142213",
          email: "1326120215@qq.com",
        },
        {
          name: "拉嘎",
          id: "12412415",
          role: "超级管理员",
          movephone: "19832142213",
          email: "92352526@qq.com",
        },
        {
          name: "阿哈湖",
          id: "12412415",
          role: "管理员",
          movephone: "13252625421",
          email: "3632462@qq.com",
        },
      ],
      pageInfo: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      //模态框用户校验规则
      input: "",
      user: [],
      currentPage1: 1,
      currentPage2: 0,
      total: 0,
      pageSize: 10,
      title: "新增/编辑用户",
      categorys: [], //素有栏目信息
      dialogFormVisible: false,
      form: {
        name: "",
        id: "",
        role: "",
        phone: "",
        email: "",
        password: "",
        taxplate: "",
      },
      formLabelWidth: "120px",

      //用户模态框规则
      rules: {
        name: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
        ],
        movephone: [
          { required: true, message: "手机号不能为空" },
          {
            type: "number",
            min: 13,
            max: 13,
            message: "请输入正确的手机号",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
        role: [
          { required: true, message: "请选择所属角色", trigger: "change" },
        ],
        taxplate: [
          { required: true, message: "请选择税盘", trigger: "change" },
        ],
        telephone: [
          { required: true, message: "电话号不能为空" },
          { type: "number", min: 3, max: 20, message: "请输入正确的电话" },
        ],
        email: [{ type: "number", message: "请输入正确的邮箱" }],
        id: [
          { required: true, message: "用户名不能为空" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符" },
        ],
      },
      //模态框密码校验规则
      passwordrules: {
        id: [
          { required: true, message: "账号不能为空", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "旧密码不能为空", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
        ],
        changepassword: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },

  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    //修改密码按钮绑定事件
    resetpassword(row) {
      this.dialogFormVisiblePassword = true;
      this.title = "重置密码";
      this.passwordform = {
        id: row.id,
        name: row.name,
        password: row.password,
        changepassword: row.changepassword,
      };
    },

    //修改密码确认按钮
    passwordForm(row) {
      console(1111);
    },

    //删除按钮绑定事件
    handleClick(row) {
      var id = row.id;
      var self = this;
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          self.$axios
            .get("/category/deleteById", { params: { id } })
            .then((response) => {
              if (response.data.status == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                self.findAll();
              } else {
                this.$message.error("删除失败");
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //添加确认点击
    submitForm(formName) {
      var self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          self.$axios
            .post("/category/saveOrUpdate", qs.stringify(self.form))
            .then((response) => {
              if (response.data.status == 200) {
                this.$message({
                  type: "success",
                  message: "保存成功!",
                });
                self.findAll();
              } else {
                this.$message.error("删除失败");
              }
              self.dialogFormVisibleUser = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //添加按钮绑定事件
    addProduct() {
      this.dialogFormVisibleUser = true;
      this.title = "新增/编辑用户";
      this.form = {
        name: "",
        id: "",
        role: "",
        movephone: "",
        email: "",
        telephone: "",
        taxplate: "",
      };
    },

    //编辑操作
    change(row) {
      this.dialogFormVisibleUser = true;
      this.title = "编辑用户";
      this.form = {
        name: row.name,
        movephone: row.movephone,
        role: row.role,
        taxplate: row.taxplate,
        telephone: row.telephone,
        email: row.email,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
