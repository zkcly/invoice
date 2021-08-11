<template >
    <div class="main">
      <div class="form">
         <button class="el-dialog__headerbtn" @click="closeLoginWin">
            <i class="el-dialog__close el-icon el-icon-close"></i>
          </button>
        <el-form ref="ruleForm" :model="resetPassword" :rules="rules">
          <h2 class="title" >重置密码</h2>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="userName">
                <el-input
                  v-model.trim="resetPassword.userName"
                  placeholder="请输入用户名称"
                >
                  <!-- <svg-icon
                    slot="prefix"
                    icon-class="user"
                    class="input-icon"
                  /> -->
                  <i slot="prefix" class="el-icon-user"></i>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="phone">
                <el-input
                  v-model.trim="resetPassword.phone"
                  placeholder="请输入手机号"
                >
                  <!-- <svg-icon
                    slot="prefix"
                    icon-class="phone"
                    class="input-icon"
                  /> -->
                   <i slot="prefix" class="el-icon-mobile-phone"></i>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="code">
                <el-input
                  v-model.trim="resetPassword.code"
                  placeholder="请输入验证码"
                >
                  <!-- <svg-icon
                    slot="prefix"
                    icon-class="tree"
                    class="el-input__icon input-icon"
                  /> -->
                  
                  <i slot="prefix" class="el-icon-key"></i>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-button
                :type="getCodeType"
                @click="getCode"
                :disabled="getCodeDisabled"
                style="margin-left: 20px;width:100%"
                >{{getCodeName}}</el-button
              >
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="password">
                <el-input
                  maxlength="21"
                  v-model.trim="resetPassword.password"
                  placeholder="请输入新密码"
                  :type="ifShow == true ? 'text': 'password'"
                  id="task-edit"
                >
                  <i slot="prefix" class="el-icon-lock"></i>
                  <i slot="suffix" class="el-icon-view" @click="changeShow"></i>
                  <!-- <svg-icon
                    slot="prefix"
                    icon-class="password"
                    class="input-icon"
                  /> -->
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer">
          <el-button
            type="primary"
            @click="sureReset"
            style="width: 270px"
            >确 定</el-button
          >
        </div>
      </div>
    </div>
</template>

<script>
  import { getResetPwdSmsCode ,resetPwdByUser} from "@/api/user.js";
export default {
  data() {
    return {
      getCodeName:"获取验证码",
      getCodeType:"primary",
      getCodeDisabled:false,
      ifShow: false,
      resetPassword: {
        userName: "",
        phone: "",
        code: "",
        password: "",
      },
        rules: {
          userName: [
            { required: true, message: "请输入账号", trigger: "blur" },
          ],
          phone: [
            { required: true, message: "请输入手机号", trigger: "blur" },
          ],
          code: [
            { required: true, message: "请输入验证码", trigger: "blur" },
          ],
          password: [
            { required: true, message: "请输入新密码", trigger: "blur" },
            { min: 6, max: 20, message: "密码需介于6-20位之间", trigger: "blur" },
          ],
        },
    };
  },
  props:['closeResetPasswordBox'],
  methods:{
    changeShow(){
      this.ifShow = !this.ifShow
      this.$nextTick(() => {
      const length = this.resetPassword.password.length;
      const editTask = document.getElementById("task-edit");
      editTask.focus();
      editTask.selectionStart = length;
      editTask.selectionEnd = length;
    });
    },
     closeLoginWin(){
       this.closeResetPasswordBox()
     },
    getCode(){
      let count=60
      this.$refs["ruleForm"].validateField('phone',(valid)=>{
          if(!valid){
       
      let countTime=()=>{
        setTimeout(()=>{
          count-=1;
          this.getCodeName=count+'s'
          if(count>0){
          countTime()
        }else{
          this.getCodeType='primary'
          this.getCodeDisabled=false
          this.getCodeName='获取验证码'
         }
        },1000)
      }
    
          getResetPwdSmsCode(this.resetPassword.phone).then((res)=>{
           if(res.code=='200'){
              this.getCodeType='info'
              this.getCodeDisabled=true
              this.getCodeName=count+'s'
              countTime()
              this.$message({
             message:'验证码发送成功，请查收',
             type: "success",
             });
           }
           })
        }
      })
     
    },
    sureReset(){

       this.$refs["ruleForm"].validate((valid) => {
         if(valid){
            resetPwdByUser(this.resetPassword).then((res)=>{
                if(res.code=='200'){
                 this.$alert('密码修改成功', {
                      confirmButtonText: "知道了",
                      title: "温馨提示",
                      type: "success",
                      showClose:false,
                      callback: this.closeLoginWin
                  });
                }
            })
         }
       })
    },
  }
};
</script>

<style  scoped>
.main {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
}

.main_U > img {
  width: 270px;
  height: 270px;
}

.form {
  border-radius: 6px;
  background: #ffffff;
  width: 350px;
  height: 450px;
  padding: 58px 40px 33px 40px;
}

.title {
  font-size: 20px;
  text-align: center;
  color: #000;
}

.el-icon-view{
  cursor: pointer;
  font-size: 14px;
}
</style>
