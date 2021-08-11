<template>
  <div>
    <el-dialog
      title="修改密码"
      :visible.sync="visible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form
        :model="form"
        
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="password"
      >
        <el-form-item prop="originPassword" label="原密码:" label-width="30%">
          <el-input
            style="width: 350px"
            type="text"
            placeholder="请输入原密码"
            v-model.trim="form.originPassword"
            onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
          ></el-input>
        </el-form-item>
        <el-form-item prop="newPassword" label="新密码:" label-width="30%">
          <el-input
            style="width: 350px"
            onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
            
            maxlength="20"
            
            placeholder="请设置6至20位登录密码"
            v-model.trim="form.newPassword"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="confirmPassword"
          label="确认新密码:"
          label-width="30%"
        >
          <el-input
            style="width: 350px"
            onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
            
            maxlength="20"
            placeholder="请再次输入登录密码"
            v-model.trim="form.confirmPassword"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" style="margin-left:80px;">确定</el-button>
        </el-form-item> -->
      </el-form>

      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="visible = false">取 消</el-button> -->
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { updatePassword } from "@/api/billType";
export default {
  name: "ModifyPassword",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    // userName: {
    //   type: String,
    //   default: ''
    // }
  },
  data() {
    const validateSearchText = (rule, value, callback) => {
      if (/[^\w\.\/]/gi.test(value)) {
        callback(new Error("不能输入汉字"));
      } else {
        callback();
      }
    };
    return {
      form: {
        originPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      rules: {
        originPassword: [
          { required: true, message: "请输入原密码", trigger: "blur" },
          { required: true, trigger: "blur", validator: validateSearchText },
          {
            min: 6,
            max: 20,
            message: "原密码输入错误",
            trigger: "blur",
          },
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { required: true, trigger: "blur", validator: validateSearchText },
          {
            min: 6,
            max: 20,
            message: "请设置6至20位登录密码",
            trigger: "blur",
          },
        ],
        confirmPassword: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          { required: true, trigger: "blur", validator: validateSearchText },
          {
            min: 6,
            max: 20,
            message: "请设置6至20位登录密码",
            trigger: "blur",
          },
        ],
      },
      userName: "",
    };
  },

  methods: {
    handleClose() {
      this.$refs["ruleForm"].resetFields();
      this.$emit("update:visible", false);
    },
    submitForm() {
      console.log(this.$store.state.user);
      var data = {
        newPassword: this.form.newPassword,
        oldPassword: this.form.originPassword,
        userName: this.$store.state.user.loginInfo.username,
      };
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          if (this.form.newPassword != this.form.confirmPassword) {
            this.$message({
              type: "error",
              message: "两次输入密码不一致",
            });
            return;
          }
          updatePassword(data).then((res) => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "修改成功",
              });
              this.$refs["ruleForm"].resetFields();
              this.$emit("update:visible", false);
            } else {
              // this.$message({
              //   type: "error",
              //   message: res.msg,
              // });
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.password {
  margin-right: 120px;
}
</style>