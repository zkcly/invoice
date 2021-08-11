<template>
  <el-dialog
    title="打印机设置"
    :visible.sync="visible"
    :before-close="handleClose"
    :close-on-click-modal="false"
    width="65%"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane
        :label="item.label"
        :name="item.value"
        v-for="(item, key) in PrintList"
        :key="key"
      >
        <el-form
          :model="form"
          :rules="rules"
          ref="ruleForm"
          label-width="90px"
          width="'80%'"
        >
          <el-form-item label="打印机名称" prop="printNum">
            <el-select v-model="form.printNum" placeholder="请选择">
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="(item, key) in printOption"
                :key="key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="打印边距" v-if="activeName != 'cefSharpinit_xp'">
            <el-row>
              <el-col :span="12"
                ><span class="text">左边距</span>
                <el-input-number
                  class="inputNum"
                  v-model="form.numzp"
                  controls-position="right"
                ></el-input-number
              ></el-col>
              <el-col :span="12"
                ><span class="text">上边距</span>
                <el-input-number
                  class="inputNum"
                  v-model="form.zpnum"
                  controls-position="right"
                ></el-input-number
              ></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="边距宽度" v-else>
            <el-row>
              <el-col :span="24">
                <el-input-number
                  class="inputNum"
                  v-model="form.numzp"
                  controls-position="right"
                ></el-input-number>
                <span class="text leftMargin">单位：mm</span></el-col
              >
            </el-row>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="sureSetting">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getInstalledPrintersApi } from "@/api/cefSharp";
export default {
  name: "PrintSetting",
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    printType: {
      type: String,
      default: "cefSharpinit_zp",
    },
  },
  data() {
    return {
      PrintList: [
        { label: "专票打印机", value: "cefSharpinit_zp" },
        { label: "普票打印机", value: "cefSharpinit_pp" },
        { label: "清单打印机", value: "cefSharpinit_qd" },
        // { label: "机动车打印机", value: "cefSharpinit_jdc" },
        { label: "小票打印机", value: "cefSharpinit_xp" },
        { label: "其他打印机", value: "cefSharpinit_other" },
      ],
      form: {
        printNum: "",
        printValue: "",
        numzp: undefined,
        zpnum: undefined,
      },
      rules: {},
      printOption: [],
      activeName: "",
    };
  },
  created() {
    this.getInstalledPrintersAjax();
  },
  updated() {
    // this.activeName = this.printType;
  },
  watch: {
    activeName: {
      handler: function (newval, oldval) {
        if (newval == "cefSharpinit_zp") {
            console.log("1222222");
            if (JSON.parse(localStorage.getItem("cefSharpinit_zp")) !== null) {
              let zp = JSON.parse(localStorage.getItem("cefSharpinit_zp"));

              this.form.numzp = zp.offsetX;
              this.form.zpnum = zp.offsetY;
              this.form.printNum = zp.printValue;
            } else {
              this.form.numzp = undefined;
          this.form.zpnum = undefined;
          this.form.printNum = '';
            }
          } else if (newval == "cefSharpinit_pp") {
            console.log("hello");
            if (JSON.parse(localStorage.getItem("cefSharpinit_pp")) !== null) {
              let zp = JSON.parse(localStorage.getItem("cefSharpinit_pp"));
              console.log(zp);
              this.form.numzp = zp.offsetX;
              this.form.zpnum = zp.offsetY;
              this.form.printNum = zp.printValue;
            } else {
              this.form.numzp = undefined;
          this.form.zpnum = undefined;
          this.form.printNum = '';
            }
          } else if (newval == "cefSharpinit_jdc") {
            if (JSON.parse(localStorage.getItem("cefSharpinit_jdc")) !== null) {
              let zp = JSON.parse(localStorage.getItem("cefSharpinit_jdc"));
              this.form.numzp = zp.offsetX;
              this.form.zpnum = zp.offsetY;
              this.form.printNum = zp.printValue;
            } else {
              this.form.numzp = undefined;
          this.form.zpnum = undefined;
          this.form.printNum = '';
            }
          } else if (newval == "cefSharpinit_qd") {
            if (JSON.parse(localStorage.getItem("cefSharpinit_qd")) !== null) {
              let zp = JSON.parse(localStorage.getItem("cefSharpinit_qd"));
              this.form.numzp = zp.offsetX;
              this.form.zpnum = zp.offsetY;
              this.form.printNum = zp.printValue;
            } else {
              this.form.numzp = undefined;
          this.form.zpnum = undefined;
          this.form.printNum = '';
            }
          } else if (newval == "cefSharpinit_xp") {
            if (JSON.parse(localStorage.getItem("cefSharpinit_xp")) !== null) {
              let zp = JSON.parse(localStorage.getItem("cefSharpinit_xp"));
              this.form.numzp = zp.offsetX;
              this.form.printNum = zp.printValue;
            } else {
              this.form.numzp = undefined;
          this.form.zpnum = undefined;
          this.form.printNum = '';
            }
          } else if (newval == "cefSharpinit_other") {
            if (
              JSON.parse(localStorage.getItem("cefSharpinit_other")) !== null
            ) {
              let zp = JSON.parse(localStorage.getItem("cefSharpinit_other"));
              this.form.numzp = zp.offsetX;
              this.form.zpnum = zp.offsetY;
              this.form.printNum = zp.printValue;
            } else {
              this.form.numzp = undefined;
          this.form.zpnum = undefined;
          this.form.printNum = '';
            }
          }
      }
    },
    visible: {
      handler: function (newval, oldval) {
        if (newval == true) {
          console.log(this.printType)
          this.activeName = this.printType;
          if (this.printType == "cefSharpinit_zp") {
            console.log("1222222");
            if (JSON.parse(localStorage.getItem("cefSharpinit_zp")) !== null) {
              let zp = JSON.parse(localStorage.getItem("cefSharpinit_zp"));

              this.form.numzp = zp.offsetX;
              this.form.zpnum = zp.offsetY;
              this.form.printNum = zp.printValue;
            } else {
            }
          } else if (this.printType == "cefSharpinit_pp") {
            console.log("hello");
            if (JSON.parse(localStorage.getItem("cefSharpinit_pp")) !== null) {
              let zp = JSON.parse(localStorage.getItem("cefSharpinit_pp"));
              console.log(zp);
              this.form.numzp = zp.offsetX;
              this.form.zpnum = zp.offsetY;
              this.form.printNum = zp.printValue;
            } else {
            }
          } else if (this.printType == "cefSharpinit_jdc") {
            if (JSON.parse(localStorage.getItem("cefSharpinit_jdc")) !== null) {
              let zp = JSON.parse(localStorage.getItem("cefSharpinit_jdc"));
              this.form.numzp = zp.offsetX;
              this.form.zpnum = zp.offsetY;
              this.form.printNum = zp.printValue;
            } else {
            }
          } else if (this.printType == "cefSharpinit_qd") {
            if (JSON.parse(localStorage.getItem("cefSharpinit_qd")) !== null) {
              let zp = JSON.parse(localStorage.getItem("cefSharpinit_qd"));
              this.form.numzp = zp.offsetX;
              this.form.zpnum = zp.offsetY;
              this.form.printNum = zp.printValue;
            } else {
            }
          } else if (this.printType == "cefSharpinit_xp") {
            if (JSON.parse(localStorage.getItem("cefSharpinit_xp")) !== null) {
              let zp = JSON.parse(localStorage.getItem("cefSharpinit_xp"));
              this.form.numzp = zp.offsetX;
              this.form.printNum = zp.printValue;
            } else {
            }
          } else if (this.printType == "cefSharpinit_other") {
            if (
              JSON.parse(localStorage.getItem("cefSharpinit_other")) !== null
            ) {
              let zp = JSON.parse(localStorage.getItem("cefSharpinit_other"));
              this.form.numzp = zp.offsetX;
              this.form.zpnum = zp.offsetY;
              this.form.printNum = zp.printValue;
            } else {
            }
          }
        }
      },
      deep: true,
    },
  },
  mounted() {},
  methods: {
    //获取打印机列表
    getInstalledPrintersAjax() {
      getInstalledPrintersApi()
        .then((response) => {
          if (response && response.code == "0") {
            let newArr = [];
            response.data.forEach((item, index) => {
              newArr.push({
                value: index,
                label: item,
              });
            });
            this.printOption = newArr;
            console.log("打印机列表");
            this.$emit("getPrintOption", newArr);
            console.log("response", response);
            // localStorage.setItem("cefSharpinitList", JSON.stringify(printList));
          }
        })
        .catch((error) => {});
    },
    async getInstalledPrinters() {
      const res = await getInstalledPrintersApi();
      if (res.code == 0) {
        // this.printOption = res.data;
        let arr = res.data;
        for (let i = 0; i < arr.length; i++) {
          let obj = { value: arr[i], label: arr[i] };
          this.printOption.push(obj);
        }
      }
    },
    handleClose() {
      if(this.printType == 'cefSharpinit_zp'){
        if (JSON.parse(localStorage.getItem("cefSharpinit_zp")) !== null) {
          let zp = JSON.parse(localStorage.getItem("cefSharpinit_zp"));
          this.form.numzp = zp.offsetX;
          this.form.zpnum = zp.offsetY;
          this.form.printNum = zp.printValue;
        }
        else{
          this.form.numzp = undefined;
          this.form.zpnum = undefined;
          this.form.printNum = '';
        }
      }
      else if(this.printType == 'cefSharpinit_pp'){
        if (JSON.parse(localStorage.getItem("cefSharpinit_pp")) !== null) {
          let zp = JSON.parse(localStorage.getItem("cefSharpinit_pp"));
          this.form.numzp = zp.offsetX;
          this.form.zpnum = zp.offsetY;
          this.form.printNum = zp.printValue;
        }
        else{
          this.form.numzp = undefined;
          this.form.zpnum = undefined;
          this.form.printNum = '';
        }
      }
      else if(this.printType == 'cefSharpinit_qd'){
        if (JSON.parse(localStorage.getItem("cefSharpinit_qd")) !== null) {
          let zp = JSON.parse(localStorage.getItem("cefSharpinit_qd"));
          this.form.numzp = zp.offsetX;
          this.form.zpnum = zp.offsetY;
          this.form.printNum = zp.printValue;
        }
        else{
          this.form.numzp = undefined;
          this.form.zpnum = undefined;
          this.form.printNum = '';
        }
      }
      else if(this.printType == 'cefSharpinit_jdc'){
        if (JSON.parse(localStorage.getItem("cefSharpinit_jdc")) !== null) {
          let zp = JSON.parse(localStorage.getItem("cefSharpinit_jdc"));
          this.form.numzp = zp.offsetX;
          this.form.zpnum = zp.offsetY;
          this.form.printNum = zp.printValue;
        }
        else{
          this.form.numzp = undefined;
          this.form.zpnum = undefined;
          this.form.printNum = '';
        }
      }
      else if(this.printType == 'cefSharpinit_xp'){
        if (JSON.parse(localStorage.getItem("cefSharpinit_xp")) !== null) {
          let zp = JSON.parse(localStorage.getItem("cefSharpinit_xp"));
          this.form.numzp = zp.offsetX;
          this.form.printNum = zp.printValue;
        }
        else{
          this.form.numzp = undefined;
          this.form.zpnum = undefined;
          this.form.printNum = '';
        }
      }
      else if(this.printType == 'cefSharpinit_other'){
        if (JSON.parse(localStorage.getItem("cefSharpinit_other")) !== null) {
          let zp = JSON.parse(localStorage.getItem("cefSharpinit_other"));
          this.form.numzp = zp.offsetX;
          this.form.zpnum = zp.offsetY;
          this.form.printNum = zp.printValue;
        }
        else{
          this.form.numzp = undefined;
          this.form.zpnum = undefined;
          this.form.printNum = '';
        }
      }

      this.$emit("update:visible", false);
      console.log(this.printType);
    },
    sureSetting() {
      console.log(31);
      if (this.activeName == "cefSharpinit_zp") {
        console.log(1);
        localStorage.setItem(
          "cefSharpinit_zp",
          JSON.stringify({
            offsetX: this.form.numzp,
            offsetY: this.form.zpnum,
            printName:
              this.form.printNum !== "" && this.printOption.length !== 0
                ? this.printOption[this.form.printNum].label
                : "",
            printValue: this.form.printNum,
          })
        );
      } else if (this.activeName == "cefSharpinit_pp") {
        console.log(2);
        localStorage.setItem(
          "cefSharpinit_pp",
          JSON.stringify({
            offsetX: this.form.numzp,
            offsetY: this.form.zpnum,
            printName:
              this.form.printNum !== "" && this.printOption.length !== 0
                ? this.printOption[this.form.printNum].label
                : "",
            printValue: this.form.printNum,
          })
        );
      } else if (this.activeName == "cefSharpinit_qd") {
        console.log(3);
        localStorage.setItem(
          "cefSharpinit_qd",
          JSON.stringify({
            offsetX: this.form.numzp,
            offsetY: this.form.zpnum,
            printName:
              this.form.printNum !== "" && this.printOption.length !== 0
                ? this.printOption[this.form.printNum].label
                : "",
            printValue: this.form.printNum,
          })
        );
      }
      // else if(this.activeName == 'cefSharpinit_jdc'){
      //   console.log(3)
      //   localStorage.setItem('cefSharpinit_jdc',JSON.stringify({
      //     offsetX: this.form.numzp,
      //     offsetY: this.form.zpnum,
      //     printName: this.form.printNum !== '' && this.printOption.length !== 0 ? this.printOption[this.form.printNum].label : '',
      //      printValue: this.form.printNum,
      //   }))
      // }
      else if (this.activeName == "cefSharpinit_xp") {
        console.log(3);
        localStorage.setItem(
          "cefSharpinit_xp",
          JSON.stringify({
            offsetX: this.form.numzp,
            offsetY: this.form.zpnum,
            printName:
              this.form.printNum !== "" && this.printOption.length !== 0
                ? this.printOption[this.form.printNum].label
                : "",
            printValue: this.form.printNum,
          })
        );
      } else if (this.activeName == "cefSharpinit_other") {
        console.log(3);
        localStorage.setItem(
          "cefSharpinit_other",
          JSON.stringify({
            offsetX: this.form.numzp,
            offsetY: this.form.zpnum,
            printName:
              this.form.printNum !== "" && this.printOption.length !== 0
                ? this.printOption[this.form.printNum].label
                : "",
            printValue: this.form.printNum,
          })
        );
      }
      this.$message({
        type: "success",
        message: "保存成功",
      });
      this.form.numzp = undefined;
      this.form.zpnum = undefined;
      this.form.printNum = '';

      this.$emit("update:visible", false);
      this.$emit("getForm", this.form);
    },
  },
};
</script>

<style scoped>
.leftMargin {
  margin-left: 20px;
}
.inputNum {
  position: relative;
  left: 12px;
}
</style>
