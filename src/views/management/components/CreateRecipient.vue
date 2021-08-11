<template>
  <el-dialog
    title="新增收件人"
    :visible.sync="visible"
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
      <el-form-item label="收件人姓名：" prop="recipients">
        <el-input
          v-model="form.recipients"
          maxlength="50"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="移动电话：" prop="mobile">
        <el-input
          v-model="form.mobile"
          placeholder="请输入"
          maxlength="11"
        ></el-input>
      </el-form-item>
      <el-form-item label="收件地址：" prop="address">
        <el-input v-model="form.address" maxlength="100" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="固定电话：" prop="tel">
        <el-input v-model="form.tel" maxlength="20" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="邮编：" prop="zip">
        <el-input v-model="form.zip" oninput="value=value.replace(/[^\d]/g,'')" maxlength="10" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="备注：" prop="note">
        <el-input v-model="form.note" maxlength="200" placeholder="请输入"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit('form')">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { invoicePurchaseApi } from "@/api/invoice.js";
import { validPhone } from "@/utils/validate";
export default {
  name: "CreateRecipient",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const validateSearchText = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写移动电话"));
      } else if (!validPhone(value,11)) {
        callback(new Error("请填写正确的电话"));
      } else {
        callback();
      }
    };
    return {
      form: {
        recipients: "",
        mobile: "",
        address: "",
        tel: "",
        zip: "",
        note: "",
      },
      rules: {
        recipients: [
          { required: true, message: "请填写收件人姓名", trigger: "blur" },
        ],
        mobile: [
          {required: true, trigger: "blur", validator: validateSearchText},
        ],
        address: [
          { required: true, message: "请填写收件地址", trigger: "blur" },
        ],
        zip: [{ required: true, message: "请填写邮编", trigger: "blur" }],
      },
    };
  },
  methods: {
    applyPeopleAjax() {
      let applyParams = {
        mailDetails: {
          address: this.form.address,
          addressee: this.form.recipients,
          mobilePhone: this.form.mobile,
          remark: this.form.note,
          tel: this.form.tel,
          zipcode: this.form.zip,
        },
      };
      invoicePurchaseApi(applyParams)
        .then((response) => {
          this.$emit('addUSerClick', this.form);
          if (response && response.code == "200") {
            
          }
        })
        .catch((error) => {});
    },
    handleClose() {
      this.$emit("update:visible", false);
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$emit("update:visible", false);
          this.applyPeopleAjax();
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
