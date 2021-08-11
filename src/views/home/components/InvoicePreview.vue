<template>
  <div id="invoicePreview" v-if="visible">
    <el-dialog
      :visible="pdfVisible"
      :close-on-click-modal="false"
      :before-close="closeTax"
      width="850px"
    >
      <div class="nav-right">
        <span v-if="isElectronic" @click="downLoadQr">
          <img src="@/assets/imgs/QRcode.png" alt="" />扫码下载
        </span>
        <span v-if="isElectronic" @click="download">
          <img src="@/assets/imgs/download.png" alt="" />下载
        </span>
        <span v-if="isElectronic == false" @click="prints">
          <img src="@/assets/imgs/print.png" alt="" />打印
        </span>
        <span v-if="isElectronic" @click="sendDialog">
          <img src="@/assets/imgs/nav.png" alt="" />发送
        </span>
      </div>
      <!-- <div class="preview-area" v-if="ifPdf == true">
        <pdf :src="pdfUrl" v-for="i in numPages" :key="i" :page="i"> </pdf>
      </div> -->
      <div class="preview-img-area">
        <img :src="taxPic" alt="" />
      </div>
    </el-dialog>

    <!-- 扫码下载 -->
    <div class="visible" v-if="codeVisible">
      <el-dialog
        width="380px"
        :visible.sync="codeVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        destroy-on-close
        append-to-body
      >
        <div class="codeVisible">
          <h3>扫一扫下载发票版式文件</h3>
          <div class="QRcode">
            <!-- 二维码 -->
            <img :src="Qrsrc" alt="" />
          </div>
        </div>
      </el-dialog>
    </div>

    <!-- 发送弹框 -->
    <div class="visible" v-if="sendVisible">
      <el-dialog
        width="380px"
        :visible.sync="sendVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :before-close="closeSend"
        destroy-on-close
        append-to-body
      >
        <div class="sendVisible">
          <h3>收票人信息</h3>
          <el-form ref="form" :model="form" label-width="120px" :rules="rules">
            <el-form-item label="收票人手机号：" prop="tel">
              <el-input v-model.trim="form.tel" type="number"></el-input>
            </el-form-item>
            <el-form-item label="收票人邮箱：" prop="email">
              <el-input v-model.trim="form.email"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeSend">取 消</el-button>
          <el-button type="primary" @click="send">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <PrintSetting
      :visible.sync="pintVisible"
      :printType="printType"
      @getForm="getForm"
      @getPrintOption="getPrintOption"
    ></PrintSetting>
  </div>
</template>

<script>
import "@/utils/global.js";
import pdf from "vue-pdf";

import CMapReaderFactory from "vue-pdf/src/CMapReaderFactory.js";
import { getPdf, getOfd } from "@/api/review.js";
import {
  getPrintInfo,
  getApplyPrintInfo,
  downloadRqCode,
  sendSmsAndEmail,
  getCompanyInfoById,
  getTaxInfoById,
} from "@/api/billType";
import { invoicePrint } from "@/api/invoicesearch";
import PrintSetting from "@/views/home/components/PrintSetting";
export default {
  name: "InvoicePreview",
  components: { pdf, PrintSetting },
  props: {
    //是否为电子版
    // isElectronic: {
    //   type: Boolean,
    //   default: false,
    // },
    visible: {
      type: Boolean,
      default: false,
    },
    taxDetail: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // 扫码下载
      codeVisible: false,
      src: "",

      // 发送弹框
      sendVisible: false,
      companyId: "",
      smsStock: 0,
      form: {
        tel: "",
        email: "",
      },
      taxPic: "",
      taxPdf: "",
      taxName: "",
      taxOfd: "",
      printOption: [],
      diskType: "",

      isElectronic: false,

      numPages: 1,
      pdfUrl: "",
      contractUrl: "",
      pdfVisible: false,
      ifPdf: false,
      ifOfd: false,

      pintVisible: false,
      printType: "",
      rules: {
        tel: [
          { required: false, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^(1)\d{10}$/,
            message: "请输入正确的手机号格式",
            trigger: "blur",
          },
        ],
        email: [
          { required: false, message: "请输入邮箱账号", trigger: "blur" },
          { max: 30, message: "长度不能超过30", trigger: "blur" },
          {
            pattern:
              /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/,
            message: "请输入正确的邮箱格式",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    console.log(JSON.parse(localStorage.getItem("initSetParameter")));
    // this.invoiceFileType = JSON.parse(location.getItem('initSetParameter'))
  },
  mounted() {
    console.log(this.$store.state.user);
    this.diskType = this.$store.state.user.taxDiskInfo.diskType;
    this.companyId = this.$store.state.user.loginInfo.companyId;
    this.taxDiskNum = this.$store.state.user.taxDiskInfo.taxDiskNum;

    this.getTaxInfoById();
  },

  watch: {
    visible: {
      handler: function (newval, oldval) {
        if (newval == true) {
          console.log(this.taxDetail);
          this.getPdf();
          if (
            this.taxDetail.invoiceType == "004" ||
            this.taxDetail.invoiceType == "007"
          ) {
            this.isElectronic = false;
          } else {
            this.isElectronic = true;
          }
        }
        if (newval == false) {
          this.taxPdf = "";
          this.taxOfd = "";
        }
      },
      deep: true,
    },
  },

  computed: {},
  methods: {
    //获取短信余量
    async getCompanyInfoById() {
      const res = await getCompanyInfoById({
        companyId: this.companyId,
      });
      this.smsStock = res.data.smsStock;
    },
    //获取pdf or ofd类型
    async getTaxInfoById() {
      const res = await getTaxInfoById(this.taxDiskNum);
      if (res && res.code == 200) {
        this.invoiceFileType =
          res.data.invoiceFileType != null ? res.data.invoiceFileType : 0;
      }
    },
    //获取图片信息
    getPdf() {
      getPdf({ invoiceSeries: this.taxDetail.invoiceSeries }).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.pdfVisible = true;
          this.push_email = res.data.push_email;
          this.push_phone = res.data.push_phone;
          // if(res.data.pdf_url == null && this.diskType == 3 && this.invoiceFileType == 1 && this.isElectronic == true){
          //   this.taxPic =
          //   "http://dzgc-files.oss-cn-hangzhou.aliyuncs.com/" + res.data.jpg_url
          //   this.ifPdf = false;
          //   // this.getOfdurl()
          //   console.log('zou')
          // }
          // else{
          this.taxPic =
            "http://dzgc-files.oss-cn-hangzhou.aliyuncs.com/" +
            res.data.jpg_url;
          if (res.data.pdf_url !== null) {
            this.ifPdf = true;
            let suffix = res.data.pdf_url.split(".")[1];
            if (suffix == "pdf") {
              this.taxPdf =
                "http://dzgc-files.oss-cn-hangzhou.aliyuncs.com/" +
                res.data.pdf_url;
              this.ifOfd = false;

              this.taxName = res.data.pdf_url.split(".")[0].split("/")[2];
            } else {
              this.taxOfd =
                "http://dzgc-files.oss-cn-hangzhou.aliyuncs.com/" +
                res.data.pdf_url;
              this.ifOfd = true;

              this.taxName = res.data.pdf_url.split(".")[0].split("/")[2];
            }
          } else {
            this.ifPdf = false;
          }

          // }
          // if (res.data.jpg_url !== "") {
          //   this.taxPic =
          //     "http://dzgc-files.oss-cn-hangzhou.aliyuncs.com/" +
          //     res.data.jpg_url;
          //   this.taxPdf =
          //     "http://dzgc-files.oss-cn-hangzhou.aliyuncs.com/" +
          //     res.data.pdf_url;

          //   this.ifPdf = false;
          // } else if (res.data.jpg_url == "") {
          //   this.taxPdf =
          //     "http://dzgc-files.oss-cn-hangzhou.aliyuncs.com/" +
          //     res.data.pdf_url;
          //   this.pdfTask(
          //     "http://dzgc-files.oss-cn-hangzhou.aliyuncs.com/" +
          //       res.data.pdf_url
          //   );
          //   this.ifPdf = true;
          // }
          //如果没有pdf地址，并且是ukey，选择了ofd文件，则调取ofd接口
          // if(this.diskType == 3 && this.invoiceFileType == 1 && this.taxPdf == ''){
          //
          // }
        } else if (res.code !== 200) {
          this.pdfVisible = false;
          this.$emit("update:visible", false);
          this.$alert(res.msg, "温馨提示", {
            confirmButtonText: "确定",
            type: "warning",
            center: true,
          });
        }
      });
    },
    //初始化PDF文字信息
    pdfTask(pdfUrl) {
      this.pdfUrl = pdf.createLoadingTask({ url: pdfUrl, CMapReaderFactory });
    },

    //获取ofd地址
    async getOfdurl() {
      const res = await getOfd({ invoiceSeries: this.taxDetail.invoiceSeries });
      if (res && res.code == 200) {
        this.taxOfd =
          "http://dzgc-files.oss-cn-hangzhou.aliyuncs.com/" + res.data;
        this.ifOfd = true;
        this.taxName = res.data.split(".")[0].split("/")[2];
      } else {
        this.ifOfd = false;
        this.taxName = "";
      }
      return res.code;
    },

    //扫码下载
    async downLoadQr() {
      if (
        this.diskType == 3 &&
        this.invoiceFileType == 1 &&
        this.isElectronic == true &&
        this.ifPdf == false
      ) {
        this.getOfdurl()
          .then(async (res) => {
            console.log(res);
            if (res == 200) {
              const res = await downloadRqCode({
                pdfUrl: this.taxPdf || this.taxOfd,
              });
              this.Qrsrc = "data:image/png;base64," + res.data;
              this.codeVisible = true;
            }
          })
          .catch(() => console.log("error"));
      } else {
        const res = await downloadRqCode({
          pdfUrl: this.taxPdf || this.taxOfd,
        });
        this.Qrsrc = "data:image/png;base64," + res.data;
        this.codeVisible = true;
      }
    },
    //发送
    sendDialog() {
      console.log(this.invoiceFileType);
      console.log(this.taxDetail);
      if (
        this.taxDetail.invoiceInvalidType == 1 &&
        this.invoiceFileType == 1 &&
        this.taxPdf == ""
      ) {
        this.$message({
          type: "error",
          message: "作废发票不支持下载OFD文件",
        });
        return;
      }
      this.sendVisible = true;
      if((this.taxDetail.pushPhone && this.taxDetail.pushPhone !== '') || (this.taxDetail.pushMail && this.taxDetail.pushMail !== '')){
        this.form.tel = this.taxDetail.pushPhone
        this.form.email = this.taxDetail.pushMail
      }
      else{
        this.form.tel =
        this.push_phone ||
        this.taxDetail.applicantPhone ||   
        this.taxDetail.ticketPushPhone;
        this.form.email =
        this.push_email ||
        this.taxDetail.email ||      
        this.taxDetail.ticketPushMail;
      }
      
    },
    send() {
      console.log(this.form.tel || this.form.email == true);
      console.log(this.form.email);
      if (
        (this.form.tel == "" && this.form.email == "") ||
        (this.form.tel == undefined && this.form.email == undefined)
      ) {
        this.$message({
          type: "info",
          message: "手机号与邮箱必须填一项",
        });
        return;
      }
      // if(this.smsStock == 0 && this.form.tel !== ''){
      //   this.$message({
      //     type: 'info',
      //     message: '短信余额为零，请充值后重试'
      //   })
      //   return
      // }
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          const res = await sendSmsAndEmail({
            invoiceSeries: this.taxDetail.invoiceSeries,
            pushMail: this.form.email || null,
            pushPhone: this.form.tel || null,
          });
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: res.msg,
            });
          } else {
            // this.$message({
            //   type: "error",
            //   message: res.msg,
            // });
          }
          this.sendVisible = false;
        } else {
          return false;
        }
      });
    },
    closeSend() {
      this.$refs["form"].resetFields();
      this.sendVisible = false;
    },
    //下载
    /**
     * 文件链接转文件流下载--主要针对pdf 解决谷歌浏览器a标签下载pdf直接打开的问题
     */
    fileLinkToStreamDownload(url, fileName, type) {
      let xhr = new XMLHttpRequest();
      console.log(xhr);
      xhr.open("get", url, true);
      xhr.setRequestHeader("Content-Type", `application/${type}`);
      xhr.responseType = "blob";
      console.log(this);
      let that = this;
      xhr.onload = function () {
        // let that = this
        if (this.status == 200) {
          //接受二进制文件流
          var blob = this.response;
          console.log(that);
          that.downloadExportFile(blob, fileName, type);
        }
      };
      xhr.send();
    },
    /**
     *下载导出文件
     */
    downloadExportFile(blob, tagFileName, fileType) {
      console.log(123);
      let downloadElement = document.createElement("a");
      let href = blob;
      console.log(href);
      if (typeof blob == "string") {
        downloadElement.target = "_blank";
      } else {
        href = window.URL.createObjectURL(blob); //创建下载的链接
      }
      downloadElement.href = href;
      downloadElement.download =
        tagFileName +
        // moment(new Date().getTime()).format("YYYYMMDDhhmmss") +
        "." +
        fileType; //下载后文件名
      document.body.appendChild(downloadElement);
      downloadElement.click(); //点击下载
      document.body.removeChild(downloadElement); //下载完成移除元素
      if (typeof blob != "string") {
        window.URL.revokeObjectURL(href); //释放掉blob对象
      }
    },
    async download() {
      if (
        this.diskType == 3 &&
        this.invoiceFileType == 1 &&
        this.isElectronic == true &&
        this.ifPdf == false
      ) {
        this.getOfdurl()
          .then(async (res) => {
            if (res == 200) {
              this.fileLinkToStreamDownload(this.taxOfd, this.taxName, "ofd");
            }
          })
          .catch((error) => console.log(error));
      } else {
        if (this.ifOfd) {
          this.fileLinkToStreamDownload(this.taxOfd, this.taxName, "ofd");
        } else {
          this.fileLinkToStreamDownload(this.taxPdf, this.taxName, "pdf");
        }
      }
    },
    //打印
    async prints() {
      console.log(this.taxDetail);
      if (this.taxDetail.invoiceType == "004") {
        if (JSON.parse(localStorage.getItem("cefSharpinit_zp")) == null) {
          this.$confirm("找不到打印机,请先进行打印机设置", "提示", {
            confirmButtonText: "去设置",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.printType = "cefSharpinit_zp";
              this.pintVisible = true;
            })
            .catch(() => {});
        } else if (
          JSON.parse(localStorage.getItem("cefSharpinit_zp")) !== null
        ) {
          let a = JSON.parse(localStorage.getItem("cefSharpinit_zp")).printName;
          let s = this.printOption.findIndex((item) => {
            return item.label == a;
          });
          if (s == -1) {
            this.$confirm("找不到打印机,请先进行打印机设置", "提示", {
              confirmButtonText: "去设置",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.printType = "cefSharpinit_zp";
                this.pintVisible = true;
              })
              .catch(() => {});
          } else {
            let arr = [];
            
            if (this.taxDetail.isReview && this.taxDetail.isReview == true) {
              arr.push(this.taxDetail.invoiceSeries);
              const res = await getApplyPrintInfo(arr);
              if (res.code == 200) {
                let data = {
                  printer: {
                    printName: JSON.parse(
                      localStorage.getItem("cefSharpinit_zp")
                    ).printName, //打印机名称
                    offsetX: JSON.parse(localStorage.getItem("cefSharpinit_zp"))
                      .offsetX, //x轴偏移量
                    offsetY: JSON.parse(localStorage.getItem("cefSharpinit_zp"))
                      .offsetY, //y轴偏移量
                  }, //打印机
                  invoice: res.data[0],
                  timeout: 180000, //超时时间
                };
                invoicePrint(data).then((res) => {
                  if (res.code == 0) {
                    this.$message({
                      type: "success",
                      message: "打印成功",
                    });
                  } else {
                    this.$message({
                      type: "error",
                      message: res.message,
                    });
                  }
                });
              }
            } else {
              arr.push(this.taxDetail.id);
              const res = await getPrintInfo(arr);
              if (res.code == 200) {
                let data = {
                  printer: {
                    printName: JSON.parse(
                      localStorage.getItem("cefSharpinit_zp")
                    ).printName, //打印机名称
                    offsetX: JSON.parse(localStorage.getItem("cefSharpinit_zp"))
                      .offsetX, //x轴偏移量
                    offsetY: JSON.parse(localStorage.getItem("cefSharpinit_zp"))
                      .offsetY, //y轴偏移量
                  }, //打印机
                  invoice: res.data[0],
                  timeout: 180000, //超时时间
                };
                invoicePrint(data).then((res) => {
                  if (res.code == 0) {
                    this.$message({
                      type: "success",
                      message: "打印成功",
                    });
                  } else {
                    this.$message({
                      type: "error",
                      message: res.message,
                    });
                  }
                });
              }
            }
          }
        }
      } else if (this.taxDetail.invoiceType == "007") {
        if (JSON.parse(localStorage.getItem("cefSharpinit_pp")) == null) {
          this.$confirm("找不到打印机,请先进行打印机设置", "提示", {
            confirmButtonText: "去设置",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.printType = "cefSharpinit_pp";
              this.pintVisible = true;
            })
            .catch(() => {});
        } else if (
          JSON.parse(localStorage.getItem("cefSharpinit_pp")) !== null
        ) {
          let a = JSON.parse(localStorage.getItem("cefSharpinit_pp")).printName;
          let s = this.printOption.findIndex((item) => {
            return item.label == a;
          });
          if (s == -1) {
            this.$confirm("找不到打印机,请先进行打印机设置", "提示", {
              confirmButtonText: "去设置",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.printType = "cefSharpinit_pp";
                this.pintVisible = true;
              })
              .catch(() => {});
          } else {
            let arr = [];
            
            if (this.taxDetail.isReview && this.taxDetail.isReview == true) {
              arr.push(this.taxDetail.invoiceSeries);
              const res = await getApplyPrintInfo(arr);
              if (res.code == 200) {
                let data = {
                  printer: {
                    printName: JSON.parse(
                      localStorage.getItem("cefSharpinit_pp")
                    ).printName, //打印机名称
                    offsetX: JSON.parse(localStorage.getItem("cefSharpinit_pp"))
                      .offsetX, //x轴偏移量
                    offsetY: JSON.parse(localStorage.getItem("cefSharpinit_pp"))
                      .offsetY, //y轴偏移量
                  }, //打印机
                  invoice: res.data[0],
                  timeout: 180000, //超时时间
                };
                invoicePrint(data).then((res) => {
                  if (res.code == 0) {
                    this.$message({
                      type: "success",
                      message: "打印成功",
                    });
                  } else {
                    this.$message({
                      type: "error",
                      message: res.message,
                    });
                  }
                });
              }
            } else {
              arr.push(this.taxDetail.id);
              const res = await getPrintInfo(arr);
              if (res.code == 200) {
                let data = {
                  printer: {
                    printName: JSON.parse(
                      localStorage.getItem("cefSharpinit_pp")
                    ).printName, //打印机名称
                    offsetX: JSON.parse(localStorage.getItem("cefSharpinit_pp"))
                      .offsetX, //x轴偏移量
                    offsetY: JSON.parse(localStorage.getItem("cefSharpinit_pp"))
                      .offsetY, //y轴偏移量
                  }, //打印机
                  invoice: res.data[0],
                  timeout: 180000, //超时时间
                };
                invoicePrint(data).then((res) => {
                  if (res.code == 0) {
                    this.$message({
                      type: "success",
                      message: "打印成功",
                    });
                  } else {
                    this.$message({
                      type: "error",
                      message: res.message,
                    });
                  }
                });
              }
            }
          }
        }
      }
    },
    getForm() {},
    getPrintOption(val) {
      console.log(val);
      this.printOption = val;
    },

    // 删除按钮
    // deleteClick(item) {
    //     this.$confirm("你确定删除吗？", "提示", {
    //         confirmButtonText: "确定",
    //         cancelButtonText: "取消",
    //         type: "warning",
    //     })
    //     .then(() => {
    //     // this.$message({
    //     //   type: 'success',
    //     //   message: '删除成功!'
    //     // });
    //     this.$globals.alertSuccessContent("删除成功");
    //     })
    //     .catch(() => {
    //     // this.$message({
    //     //   type: 'info',
    //     //   message: '已取消删除'
    //     // });
    //     });
    // // this.$globals.alertError()
    // // this.$globals.alertSuccess()
    // },
    handleClose() {
      this.$emit("update:visible", false);
    },
    closeTax() {
      this.pdfVisible = false;
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style scoped>
.nav-right {
  position: absolute;
  top: 17px;
  right: 55px;
}
.nav-right > span {
  margin-right: 15px;
  cursor: pointer;
}
.nav-right > span > img {
  width: 30px;
  height: 30px;
  vertical-align: middle;
}

.preview-area {
  width: 100%;

  margin: 0 auto;
  background: #ddd;
}
.preview-img-area {
  /* height: 50%; */
  width: 100%;
  /* height: 550px; */
  margin: 0 auto;
  /* background: #ddd; */
}
.preview-img-area >>> img {
  /* width: 100%; */
  /* height: 100%; */
  width: 800px;
  display: block;
  margin: 0 auto;
  image-rendering: -moz-crisp-edges; /* Firefox */
  image-rendering: -o-crisp-edges; /* Opera */
  image-rendering: -webkit-optimize-contrast; /*Webkit (non-standard naming) */
  image-rendering: crisp-edges;
  -ms-interpolation-mode: nearest-neighbor; /* IE (non-standard property) */
}

.visible {
  position: absolute;
  top: 100px;
}
.codeVisible,
.sendVisible {
  text-align: center;
}

.sendVisible h3 {
  margin-bottom: 55px;
}

.QRcode {
  width: 251px;
  height: 251px;
  border-radius: 10px;
  background-color: #fff;
  margin: 0 auto;
  padding: 5px;
}
.QRcode > img {
  width: 100%;
  height: 100%;
}
</style>
