<template>
  <el-dialog
    :title="`${
      status === 'add' ? '新增' : status === 'edit' ? '修改' : '复制'
    }客户`"
    :visible.sync="visible"
    :before-close="handleClose"
    :close-on-click-modal="false"
    width="50%"
    append-to-body
  >
    <el-form
      :model="form"
      label-suffix=":"
      :rules="rules"
      label-width="120px"
      ref="editform"
    >
      <el-row>
        <el-col :span="14" >
          <el-form-item
            label="客户名称"
            :label-width="formLabelWidth"
            prop="customerName"
          >
            <el-input
              v-model.trim="editform.customerName"
              autocomplete="off"
              placeholder="请填写客户名称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :pull="2">
          <el-form-item label="客户类别" :label-width="formLabelWidth">
            <!-- <el-input v-model="form.name" autocomplete="off"></el-input> -->
            <span>{{
              categoryName
            }}</span>

            <!-- <el-cascader
              v-else
              disabled
              :props="defaultParams"
              v-model="categoryName"
              :show-all-levels="false"
              :options="categoryData"
              @change="handleChange"
            ></el-cascader> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item label="税号" :label-width="formLabelWidth" prop="taxId">
            <el-input
              v-model.trim="editform.taxId"
              autocomplete="off"
              placeholder="请填写纳税人识别号"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item
            label="地址电话"
            :label-width="formLabelWidth"
            prop="addressAndPhone"
          >
            <el-input
              v-model="editform.addressAndPhone"
              autocomplete="off"
              placeholder="请填写地址电话"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item
            label="开户行及账号"
            :label-width="formLabelWidth"
            prop="bankAndAccount"
          >
            <el-input
              v-model="editform.bankAndAccount"
              autocomplete="off"
              placeholder="请填写开户行及银行账号"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item
            label="收票手机号"
            :label-width="formLabelWidth"
            prop="invoicePhone"
          >
            <el-input
              @mousewheel.native.prevent  
              @DOMMouseScroll.native.prevent  
              v-model.trim="editform.invoicePhone"
              type="number"
              autocomplete="off"
              placeholder="请填写接收电子发票的手机号"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item
            label="收票邮箱"
            :label-width="formLabelWidth"
            prop="invoiceEmail"
          >
            <el-input
              v-model.trim="editform.invoiceEmail"
              autocomplete="off"
              placeholder="请填写接收电子发票的邮箱"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="24">
          <el-form-item label="收票人手机号" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="收票人邮箱" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="18">
          <el-form-item
            label="备注"
            :label-width="formLabelWidth"
            prop="remarks"
          >
            <el-input v-model="editform.remarks" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSure">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { validStrCheckLength1 } from "@/utils/validate";
export default {
  name: "UpdateGoods",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      validators: (val) => {
        return val === "add" || val === "edit";
      },
      default: "add",
    },
    categoryName: {
      type: String,
      default: '',
    },
    
    editform: {
      type: Object,
      default: () => {},
    },
    categoryData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    const validateUserName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入关键字"));
      } else if (!validStrCheckLength1(value, 101)) {
        console.log("ssss");
        callback(new Error("最多输入100个汉字或字符"));
      } else {
        callback();
      }
    };
    const validateRemark = (rule, value, callback) => {
      if(value === ''){
        console.log(value.length)
        callback();
      }
      else{
        if (!validStrCheckLength1(value, 81)) {
          console.log("ssss");
          callback(new Error("最多输入80个汉字或字符"));
        } else {
          callback();
        }
      }
    };

    return {
      formLabelWidth: "150px",
      form: {},

      defaultParams: {
        label: "label",
        value: "id",
        children: "children",
        checkStrictly: true,
      },
      // form: {
      //   name: "",
      // },
      rules: {
        customerName: [
          { required: true, message: "请输入客户名称", trigger: "blur" },
          { required: true, trigger: "blur", validator: validateUserName },
        ],
        taxId: [
          { required: false, message: "请输入税号", trigger: "blur" },
          {
            pattern: /^[A-Z0-9]{15}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/,
            message: "请输入正确的税号格式",
            trigger: "blur",
          },
        ],
        addressAndPhone: [
          { required: false, message: "请输入地址电话", trigger: "blur" },
          { max: 100, message: "长度不能超过100", trigger: "blur" },
        ],
        bankAndAccount: [
          {
            required: false,
            message: "请输入开户行及银行账号",
            trigger: "blur",
          },
          { max: 100, message: "长度不能超过100", trigger: "blur" },
        ],
        invoicePhone: [
          { required: false, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^(1)\d{10}$/,
            message: "请输入正确的手机号格式",
            trigger: "blur",
          },
        ],
        invoiceEmail: [
          { required: false, message: "请输入邮箱账号", trigger: "blur" },
          // { required: false, trigger: "blur",validator: validateSearchEmail},
          { max: 30, message: "长度不能超过30", trigger: "blur" },
          {
            pattern: /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/,
            message: "请输入正确的邮箱格式",
            trigger: "blur",
          },
        ],
        remarks: [
          // { required: false, message: "请输入客户名称", trigger: "blur" },
          { required: false, trigger: "blur",validator: validateRemark},
          // {
          //   max: 40,
          //   message: "最多可以输入80个字符（40个汉字）",
          //   trigger: "blur",
          // },
        ],
      },
    };
  },
  updated() {
    this.form = this.editform;
  },
  methods: {
    handleClose() {
      this.form.customerName = "";
      this.form.taxId = "";
      this.form.addressAndPhone = "";
      this.form.bankAndAccount = "";
      this.form.invoicePhone = "";
      this.form.invoiceEmail = "";
      this.form.remarks = "";
      this.$refs["editform"].resetFields();
      this.$emit("update:visible", false);
    },
    handleSure() {
      this.$refs["editform"].validate((valid) => {
        console.log(123)
        if (valid) {
          console.log(456)
          this.$emit("getForm", this.form);
          // this.$refs["editform"].resetFields();
        } else {
          return false;
        }
      });
    },
    handleChange() {},
  },
};
</script>

<style lang="scss" scoped>
</style>