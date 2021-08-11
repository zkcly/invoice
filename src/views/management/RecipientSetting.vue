<template>
  <div class="page-container-receset">
    <div class="page-header">
      <breadnav :textTitle="navTitle" @leftEvent="clickLeft" />
      <el-button type="primary" @click="recipientAdd" size="small" class="btn"
        >新增收件人</el-button
      >
    </div>
    <div class="page-content">
      <el-table :data="tableData" tooltip-effect="dark">
        <div slot="empty">
          <listnodate :tableFlag="noDateFlag" />
        </div>
        <el-table-column prop="addressee" label="收件人姓名"> </el-table-column>
        <el-table-column prop="address" label="收件地址"> </el-table-column>
        <el-table-column prop="mobilePhone" label="移动电话"> </el-table-column>
        <el-table-column prop="tel" label="固定电话"> </el-table-column>
        <el-table-column prop="zipCode" label="邮编"> </el-table-column>
        <el-table-column prop="remarks" label="备注"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click.native.prevent="recipientDel(scope.$index, tableData)"
              >删除</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="recipientChange(scope.row, '1')"
              >修改</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paginBox">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100, 200]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    <el-dialog
      :title="editOrAddRecipient"
      :visible.sync="recipientPop"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="110px"
        size="mini"
        style="width: 70%; margin: 0 auto"
      >
        <el-form-item label="收件人姓名：" prop="addressee">
          <el-input
            v-model="form.addressee"
            placeholder="请填写收件人姓名"
            onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
          ></el-input>
        </el-form-item>
        <el-form-item label="移动电话：" prop="mobilePhone">
          <el-input
            v-model="form.mobilePhone"
            @mousewheel.native.prevent
            @DOMMouseScroll.native.prevent
            placeholder="请填写移动电话"
            type="number"
            onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮编：" prop="zipCode">
          <el-input
            type="number"
            v-model="form.zipCode"
            @mousewheel.native.prevent
            @DOMMouseScroll.native.prevent
            placeholder="请填写邮编"
            onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
          ></el-input>
        </el-form-item>
        <el-form-item label="收件地址：" prop="address">
          <el-input
            v-model="form.address"
            placeholder="请填写收件地址"
            onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
          ></el-input>
        </el-form-item>
        <el-form-item label="固定电话：" prop="tel">
          <el-input
            v-model="form.tel"
            maxlength="20"
            placeholder="请填写固定电话"
            onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
          ></el-input>
        </el-form-item>

        <el-form-item label="备注：" prop="remarks">
          <el-input
            v-model="form.remarks"
            placeholder="选填"
            onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit('form')">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="editOrAddRecipient"
      :visible.sync="recipientPop2"
      :before-close="handleClose2"
      :close-on-click-modal="false"
    >
      <el-form
        :model="form2"
        :rules="rules"
        ref="form2"
        label-width="110px"
        size="mini"
        style="width: 70%; margin: 0 auto"
      >
        <el-form-item label="收件人姓名：" prop="addressee">
          <el-input
            v-model="form2.addressee"
            placeholder="请填写收件人姓名"
            onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
          ></el-input>
        </el-form-item>
        <el-form-item label="移动电话：" prop="mobilePhone">
          <el-input
            v-model="form2.mobilePhone"
            @mousewheel.native.prevent
            @DOMMouseScroll.native.prevent
            placeholder="请填写移动电话"
            type="number"
            onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮编：" prop="zipCode">
          <el-input
            type="number"
            v-model="form2.zipCode"
            @mousewheel.native.prevent
            @DOMMouseScroll.native.prevent
            placeholder="请填写邮编"
            onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
          ></el-input>
        </el-form-item>
        <el-form-item label="收件地址：" prop="address">
          <el-input
            v-model="form2.address"
            placeholder="请填写收件地址"
            onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
          ></el-input>
        </el-form-item>
        <el-form-item label="固定电话：" prop="tel">
          <el-input
            v-model="form2.tel"
            maxlength="20"
            placeholder="请填写固定电话"
            onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
          ></el-input>
        </el-form-item>

        <el-form-item label="备注：" prop="remarks">
          <el-input
            v-model="form2.remarks"
            placeholder="选填"
            onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose2">取 消</el-button>
        <el-button type="primary" @click="submit('form2')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    validPhone
  } from "@/utils/validate";
  import Breadnav from "@/components/Breadnav";
  import Listnodate from "@/components/ListNoDate";
  import {
    validStrCheckLength,
  } from "@/utils/validate";
  import {
    receivingListApi,
    receivingList,
    receivingDeleteApi,
    receivingEditApi,
    insertApi,
    listByConditionApi,
  } from "@/api/invoice.js";
  export default {
    name: "RecipientSetting",
    components: {
      Listnodate,
      Breadnav
    },
    data() {
      const validateSearchText = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请填写移动电话"));
        } else if (!validPhone(value, 11)) {
          callback(new Error("请填写正确的电话"));
        } else {
          callback();
        }
      };
      const validateSearchText1 = (rule, value, callback) => {
         if (value === "") {
          callback(new Error("请填写收件人姓名"));
        } 
        else if (!validStrCheckLength(value, 51)) {
          callback(new Error("最多输入50个汉字或字符"));
        } else {
          callback();
        }
      };
      const validateAddress = (rule, value, callback) => {
         if (value === "") {
          callback(new Error("请填写收件地址"));
        } 
        else if (!validStrCheckLength(value, 101)) {
          callback(new Error("最多输入100个汉字或字符"));
        } else {
          callback();
        }
      };
      const validateUni = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请填写邮编"));
        } 
        else if (!validStrCheckLength(value, 11)) {
          callback(new Error("最多输入10个字符"));
        } else {
          callback();
        }
      };
      const validateRemark = (rule, value, callback) => {
         if (!validStrCheckLength(value, 201)) {
          callback(new Error("最多输入200个汉字或字符"));
        } else {
          callback();
        }
      };
      return {
        navTitle: "收件人信息设置",
        noDateFlag: "successNoDate",
        tableData: [],
        currentPage: 1,
        pageNum: 1,
        pageSize: 10,
        totalPage: 0,
        // 收件人弹窗
        editOrAddRecipient: "新增收件人",
        AddRecipientTypeFlag: '0', //0新增 1修改
        recipientPop: false, //弹窗隐藏
        recipientPop2: false,
        total: 0,
        form: {
          id: "",
          addressee: "",
          mobilePhone: "",
          address: "",
          tel: "",
          zipCode: "",
          remarks: "",
        },
        form2: {
          id: "",
          addressee: "",
          mobilePhone: "",
          address: "",
          tel: "",
          zipCode: "",
          remarks: "",
        },
        rules: {
          addressee: [{
            required: true,
            message: "请填写收件人姓名", 
          }, {
                trigger: "blur",
               validator: validateSearchText1
          }],
          mobilePhone: [{
            required: true,
            trigger: "blur",
            message: "请填写移动电话",
            // validator: validateSearchText
          }, {pattern: /^(1)\d{10}$/, required: true, message: '请输入正确的号码格式', trigger: 'blur'}
          ],
          address: [{
            required: true,
            message: "请填写收件地址",
            trigger: "blur"
          }, {
                trigger: "blur",
               validator: validateAddress
          }],
          zipCode: [{
            required: true,
            message: "请填写邮编",
            trigger: "blur"
          },{
                trigger: "blur",
               validator: validateUni
            }],
          remarks: [
            {
                trigger: "blur",
               validator: validateRemark
            }
          ]
        },
        taxDiskNum: ''
      };
    },
    created: function() {},
    mounted() {
      this.taxDiskNum = this.$store.state.user.taxDiskNum;
      this.receivingList();
      
    },
    methods: {

       clickLeft() {
        this.$router.push({
          name: "applyDistribution"
        });
      },
      // 查询收件人信息列表
      receivingList() {
        // let recestr = {
        //   keyword: "",
        //   pageNum: this.pageNum,
        //   pageSize: this.pageSize,
        //   timeDesc: "true",
        // }

        // receivingListApi({taxDiskNum: this.taxDiskNum})
        //   .then((response) => {
        //     this.tableData = response.data;
        //   })
        //   .catch((error) => {});

        receivingList({taxDiskNum: this.taxDiskNum,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        timeDesc: true,
        deviceNo: this.taxDiskNum,
        taxId: this.$store.state.user.loginInfo.taxId, //纳税人
        startDate: '2021-07',
        invoiceType: '',
        keyword: ''
        })
          .then((response) => {
            this.tableData = response.data.records;
            this.total = response.data.total
          })
          .catch((error) => {});
      },
      // 删除收件人信息
      recipientDel(index, rows) {
        this.$confirm("你确认删除吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            receivingDeleteApi(rows[index].id)
              .then((response) => {
                if (response && response.code == "200") {
                  rows.splice(index, 1);
                  this.receivingList();
                  this.$message({
                    type: "success",
                    message: "删除成功!",
                  });
                }
              })
              .catch((error) => {});
          })
          .catch(() => {});
      },
      // 点击修改按钮 获取列表数据到弹窗
      recipientChange(val) {
        this.AddRecipientTypeFlag = '1'
        this.recipientPop = true;
        this.editOrAddRecipient = "修改收件人";
        this.form.id=val.id;
        this.form.addressee=val.addressee;
        this.form.address=val.address;
        this.form.remarks=val.remarks;
        this.form.mobilePhone=val.mobilePhone;
        this.form.tel=val.tel;
        this.form.zipCode=val.zipCode;
            
      },
      // 修改收件人信息
      receivingEdit() {
        // var date = new Date();
        let editParams = {
          address: this.form.address,
          addressee: this.form.addressee,
          id:this.form.id,
          mobilePhone: this.form.mobilePhone,
          remarks: this.form.remarks,
          taxDiskNum: this.taxDiskNum,
          tel: this.form.tel,
          zipCode: this.form.zipCode,
        };
        console.log(editParams,"修改");
        receivingEditApi(editParams)
          .then((response) => {
            if (response && response.code == "200") {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.recipientPop = false;
              
              // this.form.addressee="";
              // this.form.address="";
              // this.form.remarks="";
              // this.form.mobilePhone="";
              // this.form.tel="";
              // this.form.zipCode="";
              // this.$refs["form"].clearValidate();
              this.$refs["form"].resetFields();
              this.receivingList();
            }
          })
          .catch((error) => {});
      },
      // 点击新增按钮
      recipientAdd() {
        this.AddRecipientTypeFlag = '0';
        this.editOrAddRecipient = "新增收件人";
        this.recipientPop2 = true;
        this.form.addressee="";
        this.form.address="";
        this.form.remarks="";
        this.form.mobilePhone="";
        this.form.tel="";
        this.form.zipCode="";
      },
      // 新增收件人
      insert() {
        // var date = new Date();
        
        let applyParams = {
          address: this.form2.address,
          addressee: this.form2.addressee,
          id: this.form2.id,
          mobilePhone: this.form2.mobilePhone,
          remarks: this.form2.remarks,
          taxDiskNum: this.taxDiskNum,
          tel: this.form2.tel,
          zipCode: this.form2.zipCode,
        };
        insertApi(applyParams)
          .then((response) => {
            if (response && response.code == "200") {
              this.$message({
                type: 'success',
                message: '新增成功'
              })
              this.recipientPop2 = false;
              
              this.$refs["form2"].resetFields();
              this.receivingList();
            }
          })
          .catch((error) => {});
      },
      // 新增一行收件人表单数据
      // addForm() {
      //   var list = {
      //     address: this.form.address,
      //     addressee: this.form.addressee,
      //     mobilePhone: this.form.mobilePhone,
      //     remarks: this.form.remarks,
      //     taxDiskNum: this.taxDiskNum,
      //     tel: this.form.tel,
      //     zipCode: this.form.zipCode,
      //   };
      //   this.tableData.push(list);
      // },
      // 关闭弹窗
      handleClose() {
        this.recipientPop = false;
        this.$refs["form"].resetFields();
      },
      handleClose2() {
        this.recipientPop2 = false;
        this.$refs["form2"].resetFields();
      },
      // 弹窗提交按钮
      submit(form) {  
            if (this.editOrAddRecipient == "新增收件人") {
              this.$refs[form].validate((valid) => {
                if(valid){
                  this.insert();
                }
              })       
            } else if(this.editOrAddRecipient == "修改收件人") {
              this.$refs[form].validate((valid) => {
                if(valid){
                  this.receivingEdit();
                }
              })
            }
      },
      handleSizeChange(val) {
         this.pageSize = val;
         this.receivingList();
       
      },
      handleCurrentChange(val) { 
        this.pageNum = val;
         this.receivingList();
      
      },
    },
  };
</script>

<style lang="scss" scoped>
.page-container-receset {
  background: #fff;
  padding-left: 28px;
}
.page-header {
  // display: flex;
  // justify-content: space-between;
  // font-size: 16px;
  // font-family: PingFangSC-Regular, PingFang SC;
  // font-weight: 400;
  // color: #252525;
  // border-bottom: 1px solid #ebeef5;

  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ebeef5;
  align-items: center;
  padding-bottom: 10px;
  padding-right: 20px;
  .btn {
    // height: 50px;
    // line-height: 50px;
    // border: none;
    // width: 49px;
    // height: 32px;
    // background: #5e8cf9;
    // border-radius: 2px;
    // color: #fff;
    // font-size: 14px;
    // font-family: PingFangSC-Regular, PingFang SC;
    // font-weight: 400;
  }
}
.paging {
  // margin-top: 250px;
  width: 100%;
  text-align: right;
}
.paginBox {
  margin-top: 20px;
  padding-bottom: 20px;
  padding-right: 25px;
  text-align: right;
}
.recewrap {
  cursor: pointer;
}
.page-content {
  width: 100%;
  // margin-top: 20px;
  // margin-left: 28px;
  overflow-y: auto;
}
.page-container-receset {
  // margin-left: 30px;
}
</style>