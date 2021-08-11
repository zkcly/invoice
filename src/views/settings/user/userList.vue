<template>
  <div class="user">
    <div class="borderBottom navHearder">
      <breadnav :textTitle="pagetitle" @leftEvent='clickLeft'/>
      <div class="serachBox">
        <el-form ref="searchForm" :rules="searchrules" :model="searchForm" class="pr24">
          <el-form-item prop="searchText">
            <el-input placeholder="请输入手机号或姓名"  v-model.trim="searchForm.searchText" >
              <el-button slot="append" icon="el-icon-search" @click="searchFun"></el-button>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-button size="mini" type="primary" class="addUser" @click='addUserFun'>新增用户</el-button>
    </div>
    <div class="body">
       <div class="roleBox">
         <el-form  :inline="true" ref="searchTwo" :model="searchFormTwo" :rules="searchTwoRules" label-width="85px">
           <el-form-item label="角色类型:"  prop="type">
             <el-select v-model="searchFormTwo.type" placeholder="请选择">
               <el-option :label="item.roleName" :value="item.id" v-for="(item,key) in pageRoleList" :key="key"></el-option>
             </el-select>
           </el-form-item>
           <el-form-item><el-button size="mini" type="primary" class="typeSearch" @click="roleFun" >查询</el-button></el-form-item>

         </el-form>
       </div>
       <div class="tableBox">
        <el-table
          :data="tableData"
          style="width: 100%">
          <div slot="empty" >
            <listnodate :tableFlag="noDateFlag" />
          </div>
          <el-table-column
            prop="nickName"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="userName"
            label="用户名">
          </el-table-column>
          <el-table-column
            prop="companyRoleName"
            label="角色">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button :disabled="scope.row.companyRoleId=='0'" type="text" size="small" @click="editUser(scope.row)">编辑</el-button>
              <el-button :disabled="scope.row.companyRoleId == '0'" type="text" size="small" @click="resetpassword(scope.row)">重置密码</el-button>
              <el-button :disabled="scope.row.companyRoleId == '0'" @click="detalFun(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
       <div class="paginBox">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="companyUserCond.pageNum"
          :page-sizes="[10, 20, 50, 100, 200]"
          :page-size="10"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total='total'>
        </el-pagination>
      </div>
    </div>


    <!-- 添加/修改模态框 -->
    <el-dialog :title="userAddOrEditTitle" :visible.sync="dialogFormVisibleUser" :close-on-click-modal='false'
    :before-close="cancelEdit"
    width="40%" id="addOrEdit">
      <el-form :model="userAddOrEditForm" :rules="userAddOrEditRules" ref='userAddOrEditform'>
        <el-form-item label="姓名" label-width="120px" prop='nickName'>
          <el-input v-model.trim="userAddOrEditForm.nickName" autocomplete="off" placeholder="请填写用户姓名"></el-input>
        </el-form-item>
        <el-form-item label="用户名" label-width="120px" prop='userName'>
          <el-input v-model.trim="userAddOrEditForm.userName" autocomplete="off" placeholder="请填写用户名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="120px" prop='phone'>
          <el-input v-model.trim="userAddOrEditForm.phone" @mousewheel.native.prevent  
              @DOMMouseScroll.native.prevent  autocomplete="off" type="number" placeholder="请填写手机号"></el-input>
        </el-form-item>
        <el-form-item label="初始密码" label-width="120px" prop='password' v-if="this.userAddOrEditTitle == '新增用户'">
          <el-input v-model.trim="userAddOrEditForm.password" onkeyup="this.value=this.value.replace(/[\u4E00-\u9FA5]/g,'')"
          onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
          @blur="inspectChange" @change="handleChange" autocomplete="off" placeholder="请设置密码" ></el-input>
        </el-form-item>
        <el-form-item label="角色" label-width="120px" prop="companyRoleId">
          <el-select v-model="userAddOrEditForm.companyRoleId" placeholder="请选择角色">
            <el-option :label="item.roleName" :value="item.id" v-for="(item,key) in roleList" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="可用税盘" label-width="120px" prop='havetaxDiskNums'>
          <!-- <el-radio-group v-model="userAddOrEditForm.taxDiskNums">
            <el-radio :label="item.value" v-for="(item,key) in radioList" :key="key">{{item.label}}</el-radio>
          </el-radio-group> -->
          <!-- 单选框 -->
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="userAddOrEditForm.havetaxDiskNums" @change="handleCheckedRadioChange">
            <el-checkbox v-for="item in ListNumByToken" :label="item.taxDiskNum" :key="item.taxDiskNum">{{item.taxDiskName}}</el-checkbox>
          </el-checkbox-group>
          <!-- 多选框 -->
        </el-form-item>

        <el-form-item label="邮箱" label-width="120px" prop="email">
          <el-input v-model.trim="userAddOrEditForm.email" onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;" autocomplete="off" placeholder="请填写电子邮箱"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelEdit">取 消</el-button>
        <el-button size="small" type="primary" @click="userAddOrEditFun">确 定</el-button>
      </div>
    </el-dialog>


    <!-- 密码模态框 -->
    <el-dialog title="重置密码" :visible.sync="dialogFormVisiblePassword" width="35%" 
    :before-close="cancelChangePassword"
    :close-on-click-modal='false'>
      <el-form :model="passwordform" :rules="passwordrules" ref='passwordform'>
        <!-- <el-form-item label="原密码" label-width="18%" prop="oldpassword">
          <el-input v-model.number="passwordform.oldpassword" autocomplete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="用户名" label-width="120px" prop="userName">
          <el-input v-model.trim="passwordform.userName" onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="新密码" label-width="120px" prop="newpassword">
          <el-input v-model.trim="passwordform.newpassword" onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;" autocomplete="off" maxlength="21" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" label-width="120px" prop="password">
          <el-input v-model.trim="passwordform.password" onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;" autocomplete="off" maxlength="21" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="password-footer">
        <el-button size="small" @click="cancelChangePassword">取 消</el-button>
        <el-button size="small" type="primary" @click="passwordFormFun">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { getList, getUserList, insertUser, updateUser, updatePassword, getListNumById, getListNumByToken, deleteUser} from "@/api/table";
  import { roleList } from '@/api/roleApi'
  import Breadnav from '@/components/Breadnav';
  import Listnodate from '@/components/ListNoDate';
  import { validStrCheckLength1 } from "@/utils/validate";

  
  export default {
    name: 'userList',
    components: {
      Breadnav,
      Listnodate
    },
    data() {
      const validateSearchText = (rule, value, callback) => {
        if (value.toString() !== this.passwordform.newpassword.toString()) {
          callback(new Error('两次新密码输入不一致'));
        }  else {
          callback();
        }
      }
      const validateLong = (rule, value, callback) => {
        if (value.toString().length < 6) {
          callback(new Error('最少输入6位密码'));
        }  
        else if (value.toString().length >= 21) {
          callback(new Error('最多输入20位密码'));
        }  
        else {
          callback();
        }
        // if (value === "") {
        //   callback(new Error("请填写新密码"));
        // } else if (!validStrCheckLength(value, 21)) {
        //   callback(new Error("最多可以输入20位密码"));
        // } else {
        //   callback();
        // }
      }
      const validateUserName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写姓名"));
      } else if (!validStrCheckLength1(value, 11)) {
        console.log("ssss");
        callback(new Error("最多输入10个汉字或字符"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (/[^\w\.\/]/gi.test(value)) {
        callback(new Error("不能输入汉字"));
      } else {
        callback();
      }
    };
    
    
      return {
        pagetitle: '用户管理',
        searchForm: {
          searchText: '',
        },
        searchrules: {
          searchText: [{
            required: false,
            trigger: "blur",
            // validator: validateSearchText
          }, ],
        },
        searchFormTwo: {
          type: '0',
        },
        searchTwoRules: {
          type: [
            {required: false, message: '不能为空', trigger: 'change'}
          ],
        },
        roleList: [
          
        ],
        pageRoleList: [{roleName: '全部', id: '0'}],
        // radioList: [
        //   {label: '税盘一 NO.3566777777', value: '1'},
        //   {label: '税盘二 NO.3566777777', value: '2'},
        //   {label: '税盘三 NO.3566777777', value: '3'},
        //   {label: '税盘四 NO.3566777777', value: '4'},
        //   {label: '税盘五 NO.3566777777', value: '5'},
        //   {label: '税盘六 NO.3566777777', value: '6'},
        // ],
        //分页
        currentPage4: 1,
        //新增编辑弹窗
        userAddOrEditTitle: "",
        dialogFormVisibleUser: false,
        noDateFlag:'successNoDate',
        userAddOrEditForm: {
          companyId:'',
          nickName: '',
          userName: '',
          password: '',
          phone: '',
          companyRoleId: '',
          havetaxDiskNums: [],
          email: '',
        },
        userAddOrEditRules: {
          userName: [
            {required: true, message: '请填写用户名', trigger: 'blur'},
            
            { min: 6, max: 20, message: '用户名长度需在 6 到 20 个字符之间', trigger: 'blur' }
          ],
          nickName: [
            {required: true, message: '请填写姓名', trigger: 'blur'},
            { required: true, trigger: "blur",validator: validateUserName},
          ],
          phone: [
            {required: true, message: '请填写手机号', trigger: 'blur'},
            {pattern: /^(1)\d{10}$/, required: true, message: '请输入正确的号码格式', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请设置密码', trigger: 'blur'},
            // { required: true, trigger: "blur", validator: validatePassword },
            { min: 6, max: 20, message: '密码长度需在 6 到 20 个字符之间', trigger: 'blur' }
          ],
          companyRoleId: [
            {required: true, message: '请选择角色', trigger: 'blur'}
          ],
          havetaxDiskNums: [
            {required: true, message: '请选择税盘', trigger: 'blur'}
          ],
         email:[
           {required: false, message: '请填写电子邮箱', trigger: 'blur'},
            { max: 30, message: '邮箱长度需要在30个字符之内', trigger: 'blur' },
           {pattern: /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/, required: false, message: '请输入正确的邮箱格式', trigger: 'blur'},
           
         ],
        },
        //密码弹窗
        dialogFormVisiblePassword: false,
        passwordform: {
          password: '',
          newpassword: '',
          userName: ''
        },
        passwordrules: {
          // oldpassword: [
          //   {required: true, message: '不能为空', trigger: 'change'},
          // ],
          newpassword: [
            {required: true, message: '新密码不能为空', trigger: 'blur'},
            { required: true, trigger: "blur",validator: validateLong},
          ],
          password: [
            {required: true, message: '确认新密码不能为空', trigger: 'blur'},
          
            { required: true, trigger: "blur",validator: validateSearchText},
          ],
        },

        //写的假数据
        tableData: [{
          userName: '王小虎',
          nickName: '12412415',
          companyRoleName: "管理员",
          phone: "15232142213",
          email: '1326120215@qq.com',
          id: 123
        }, {
          name: '拉嘎',
          id: '12412415',
          role: "超级管理员",
          movephone: "19832142213",
          email: '92352526@qq.com',
        }, {
          name: '阿哈湖',
          id: '12412415',
          role: "管理员",
          movephone: "13252625421",
          email: '3632462@qq.com',
        },],
        //请求用户列表的参数
        companyUserCond: {
          companyId: '',
          companyRoleId: '',
          keyword: '',
          pageNum: 1,
          pageSize: 10,
          timeDesc: false
        },
        total: 10,

        //多选框
        checkAll: false,
        tax: [],
        isIndeterminate: false,

        ListNumById: [],
        ListNumByToken: [],
        ListTaxNumByToken: [],
        companyUserId: '',
        companyId: ''
      }
    },

    created() {
    },
    mounted() {
      console.log(this.$store.state.user)
      this.companyUserId = this.$store.state.user.loginInfo.companyUserId ? this.$store.state.user.loginInfo.companyUserId:''
      this.companyId = this.$store.state.user.loginInfo.companyId
      this.companyUserCond.companyId = this.$store.state.user.loginInfo.companyId
      console.log(this.companyId)
      this.getUserListData(this.companyUserCond)
      this.getListNumByToken()
      this.getRoleList()
    },

    methods: {
      clickLeft(){
        this.$router.push({ name: "settingIndex" });
      },
      //获取角色列表
      async getRoleList() {
        console.log('获取角色列表')
        const res = await roleList({companyId: this.companyId, clientCode: 'dzgc'})
        if(res.code == 200){
          console.log(res.data)
          this.roleList = res.data
          this.pageRoleList = this.pageRoleList.concat(res.data)
        }

      },

      //模糊搜索事件
      searchFun(){
        this.$refs['searchForm'].validate((valid) => {
          if (valid) {
            var data = this.companyUserCond
            data.keyword = this.searchForm.searchText
            data.pageNum = 1
            this.getUserListData(data)
          } else {
            console.log('error submit!!');
        return false;
        }});
      },
      //角色类型筛选事件
      roleFun(){
        this.$refs['searchTwo'].validate((valid) => {
          if (valid) {
            var data = this.companyUserCond
            console.log(this.searchForm.searchText)
            if(this.searchFormTwo.type == 0){
              data.companyRoleId = ''
              data.keyword = this.searchForm.searchText
              this.getUserListData(data)
            }
            else{
              data.keyword = this.searchForm.searchText
              data.companyRoleId = this.searchFormTwo.type
              this.getUserListData(data)
            }
            
            
          } else {
            console.log('error submit!!');
        return false;
      }});
      },


      //分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.companyUserCond.pageSize = val
        this.companyUserCond.pageNum = 1
        
        this.getUserListData(this.companyUserCond)
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
        this.companyUserCond.pageNum = val
        this.getUserListData(this.companyUserCond)
      },

      //点击新增按钮
      addUserFun(){
        this.dialogFormVisibleUser = true;
        this.userAddOrEditTitle = "新增用户";
        console.log(this.userAddOrEditForm)
        // this.userAddOrEditForm.havetaxDiskNums = this.ListNumByToken
      },
      //点击编辑按钮
      editUser(row){
        console.log(this.roleList)
        let index = this.roleList.findIndex(val => {
          return val.id == row.companyRoleId
        })
        if(index == -1){
          this.userAddOrEditForm.companyRoleId = row.companyRoleName
        }
        else{
          this.userAddOrEditForm.companyRoleId = row.companyRoleId
        }

        console.log(row)
        this.dialogFormVisibleUser = true;
        this.userAddOrEditTitle = "编辑用户";
        this.userAddOrEditForm.userName = row.userName
        this.userAddOrEditForm.nickName = row.nickName
        this.userAddOrEditForm.phone = row.phone
        this.userAddOrEditForm.email = row.email
        this.userAddOrEditForm.companyRoleName = row.companyRoleName
        
        this.userAddOrEditForm.id = row.id
        this.getListNumById(row.id)   //获取该用户税盘信息
         
        // this.userAddOrEditform = {
        //   name: row.name,
        //   movephone: row.movephone,
        //   role: row.role,
        //   taxDiskNums: row.taxDiskNums,
        //   telephone: row.telephone,
        //   email: row.email,
        // }
      },

      inspectChange(){
        if (/[^\w\.\/]/gi.test(this.userAddOrEditForm.password)){
          this.userAddOrEditForm.password = this.userAddOrEditForm.password.replace(/[\u4E00-\u9FA5]/g,'')        
        }
      },
      handleChange(val){
        console.log(val)
        if (/[^\w\.\/]/gi.test(val)){
          this.userAddOrEditForm.password = val.replace(/[\u4E00-\u9FA5]/g,'') 
          console.log(this.userAddOrEditForm.password)
        } 
      },
      //新增/编辑用户弹窗确定按钮
      userAddOrEditFun(){
        
        if(this.userAddOrEditTitle == '编辑用户'){
          this.$refs['userAddOrEditform'].validate(async (valid) => {
          if (valid) {
            var data = {
              phone: this.userAddOrEditForm.phone,
              userName: this.userAddOrEditForm.userName,
              password: null,
              nickName: this.userAddOrEditForm.nickName,
              email: this.userAddOrEditForm.email,
              companyId: this.companyId,
              id: this.userAddOrEditForm.id,
              lineCode: 'A',
              companyRoleId: this.userAddOrEditForm.companyRoleId,
              taxDiskNums: this.userAddOrEditForm.havetaxDiskNums
            }
            const res = await updateUser(data)
            if(res.code == 200){
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
              this.getUserListData(this.companyUserCond)
              this.dialogFormVisibleUser = false
              
              this.userAddOrEditForm.userName = ''
              this.userAddOrEditForm.nickName = ''
              this.userAddOrEditForm.phone = ''
              this.userAddOrEditForm.email = ''
              this.userAddOrEditForm.companyRoleName = ''
              this.userAddOrEditForm.companyRoleId = ''
              this.userAddOrEditForm.id = ''
              this.userAddOrEditForm.havetaxDiskNums = []
            }
            else{
              // this.$message({
              //   type: 'error',
              //   message: res.msg
              // })
            }
          } else {
              console.log('error submit!!');
              return false;
          }});
        }
        else{
          console.log('新增')
          
          this.$refs['userAddOrEditform'].validate(async (valid) => {
            
          if (valid) {
            
            var data = {
              phone: this.userAddOrEditForm.phone,
              userName: this.userAddOrEditForm.userName,
              password: this.userAddOrEditForm.password,
              nickName: this.userAddOrEditForm.nickName,
              email: this.userAddOrEditForm.email,
              companyId: this.companyId,
              lineCode: 'A',
              companyRoleId: this.userAddOrEditForm.companyRoleId,
              taxDiskNums: this.userAddOrEditForm.havetaxDiskNums
            }
            const res = await insertUser(data)
            if(res.code == 200){
              this.$message({
                type: 'success',
                message: '新增成功!'
              });
              this.getUserListData(this.companyUserCond)
              this.dialogFormVisibleUser = false
              
              this.userAddOrEditForm.userName = ''
              this.userAddOrEditForm.nickName = ''
              this.userAddOrEditForm.phone = ''
              this.userAddOrEditForm.email = ''
              this.userAddOrEditForm.companyRoleName = ''
              this.userAddOrEditForm.companyRoleId = ''
              this.userAddOrEditForm.id = ''
              this.userAddOrEditForm.password = ''
              this.userAddOrEditForm.havetaxDiskNums = []
              this.checkAll = false
            }
            else{
              // this.$message({
              //   type: 'error',
              //   message: res.msg
              // })
            }
          } else {
            console.log('error submit!!');
              return false;
          }});
        }
        
      },
      //取消新增/编辑用户弹窗
      cancelEdit(){
        
        this.$refs['userAddOrEditform'].resetFields()
        this.userAddOrEditForm.userName = ''
        this.userAddOrEditForm.nickName = ''
        this.userAddOrEditForm.phone = ''
        this.userAddOrEditForm.email = ''
        this.userAddOrEditForm.companyRoleName = ''
        this.userAddOrEditForm.companyRoleId = ''
        this.userAddOrEditForm.id = ''
        this.userAddOrEditForm.havetaxDiskNums = []
        this.userAddOrEditForm.password = ''
        this.isIndeterminate = false
        this.checkAll = false
        
        console.log(this.userAddOrEditForm)
        this.dialogFormVisibleUser = false
      },

      //点击修改密码按钮
      resetpassword(row){
        this.dialogFormVisiblePassword = true;
        this.passwordform.userName = row.userName
        this.userId = row.id
        console.log(row)
      },
      //修改密码弹窗确认按钮
      passwordFormFun(){
        console.log(this.userAddOrEditForm)
        this.$refs['passwordform'].validate(async (valid) => {
          if (valid) {
            var data = {
              companyUserId: this.userId,
              password: this.passwordform.password
            }
            const res = await updatePassword(data)
            if(res.code == 200){
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.$refs['passwordform'].resetFields()
              this.dialogFormVisiblePassword = false
            }
            else{
              // this.$message({
              //   type: 'error',
              //   message: res.msg
              // })
            }
          } else {
            console.log('error submit!!');
        return false;
      }});
      },
      //取消密码弹窗
      cancelChangePassword(){
        this.dialogFormVisiblePassword = false
        this.$refs['passwordform'].resetFields()
      },

      //点击删除按事件
      detalFun(row){
        this.$confirm('你确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await deleteUser({companyUserId: row.id})
          if(res.code == 200){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.companyUserCond.pageNum = 1
            this.getUserListData(this.companyUserCond)
          }  
          else{
            // this.$message({
            //   type: 'error',
            //   message: res.msg
            // });
          }
      }).catch(() => {})
      },

      //全选
      handleCheckAllChange(val) {
        console.log(val)
        this.userAddOrEditForm.havetaxDiskNums = val ? this.ListTaxNumByToken : [];
        this.isIndeterminate = false;
      },
      handleCheckedRadioChange(value) {
        console.log(value)
        console.log(this.userAddOrEditForm.havetaxDiskNums)
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.ListNumByToken.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.ListNumByToken.length;
      },

      //请求用户列表
      async getUserListData(companyUserCond){
        const res = await getUserList(companyUserCond)
        console.log(res)
        if(res.code == 200){
          this.tableData = res.data.records
          this.companyUserCond.pageSize = res.data.size
          this.companyUserCond.pageNum = res.data.current
          this.total = res.data.total
          console.log(this.tableData)
        }
      },

      //根据企业用户ID获取税盘号列表
      async getListNumById(id) {
        const res = await getListNumById({companyUserId:id})
        if(res.code == 200){
          let arr = []
          res.data.forEach(item => {
            if(this.ListTaxNumByToken.indexOf(item) !== -1){
              arr.push(item)
            }
          });
          console.log(arr)
          this.userAddOrEditForm.havetaxDiskNums = arr
          this.checkAll = arr.sort().toString() == this.ListTaxNumByToken.sort().toString();
          this.isIndeterminate = arr.length > 0 && arr.length < this.ListNumByToken.length;
        }      
      },
      //根据登录用户获取税盘号列表
      async getListNumByToken() {
        const res = await getListNumByToken()
        if(res.code == 200){
          this.ListNumByToken = res.data
          for(let i = 0; i < res.data.length; i++){
            this.ListTaxNumByToken.push(res.data[i].taxDiskNum)
          }
        }   
      }
    }
  }
</script>

<style scoped>
  .user{
    box-sizing: border-box;
    background-color: #ffffff;
  }
  .navHearder{
    position: relative;
  }
  .serachBox{
    display: inline-block;
    width: 20%;
    position: relative;
    top: 2px;
  }
  .user >>> .el-input__inner,  .user >>>.el-input__icon{
    height: 32px;
    line-height: 32px;
  }
  .serachBox >>> .el-form-item{
    margin-bottom: 0;
  }
  .serachBox >>> .el-form-item__error{
    top:77%
  }
  .addUser{
    position: absolute;
    right: 25px;
    top:50%;
    transform: translatey(-50%);
  }
  .body{
    padding-left: 25px;
  }
  .roleBox{
    margin-top: 15px;
  }

  .tableBox{
    padding-bottom: 100px;
  }
  .paginBox{
    padding-bottom: 20px;
    padding-right: 25px;
    text-align: right;
  }
  .user >>> .el-radio{
    margin-bottom: 10px;
  }
  #addOrEdit >>> .el-select{
    width: 100%;
  }
</style>
