<template>
  <div class="page-container">
    <div class="page-header">
      <!-- <div class="nav-flex"> -->
      <!-- <breadnav :textTitle="title" @leftEvent='clickLeft'/> -->
      <!-- </div> -->
      <div class="breadNav" @click="clickLeft">
        <i class="el-icon-arrow-left"></i>
        <span class="navText">{{ title }}</span>
      </div>
    </div>

    <div class="box-card-content">
      <div
        style="
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        "
      >
        <div>&nbsp;</div>
        <div>
          <span>申请方经办人:{{ applyName }}</span>
          <span style="margin-left: 15px"> 申请日期:{{ applyTime }} </span>
        </div>
      </div>
      <div class="container">
        <!-- <div class="content-left">
                <ul class="content-side">
                    <li v-for="i in 12" :key="i"></li>
                </ul>
            </div> -->
        <!-- 发票主体内容 -->
        <div class="content">
          <div class="content-main">
            <!-- 购买方 -->
            <div class="content-main-purchaser">
              <div class="purchaser">销<br />售<br />方</div>
              <div class="purchaser-info">
                <div>
                  <span>客户名称:</span>
                  <div @dblclick="selectCustomer" style="width: 75%">
                    <el-input
                      placeholder="请输入客户名称或双击选择"
                      v-model.trim="salerName"
                      style="width: 100%"
                      v-on:input="watchCustomName()"
                      @focus="inputCustomName($event)"
                    ></el-input>
                    <!-- :readonly="boxReadonly" -->
                  </div>
                </div>
                <div>
                  <span>纳税人识别号:</span>
                  <el-input
                    placeholder="请输入纳税人识别号"
                    v-model.trim="salerAccount"
                    style="width: 75%"
                  ></el-input>
                  <!-- :readonly="boxReadonly" -->
                </div>
              </div>
              <div class="purchaser">购<br />买<br />方</div>
              <div class="purchaser-info">
                <div>
                  <span>客户名称:</span>
                  <!-- @dblclick="selectCustomer" -->
                  <div style="width: 75%">
                    <el-input
                      placeholder="请输入客户名称"
                      v-model.trim="buyerName"
                      style="width: 100%"
                      readonly
                    ></el-input>
                  </div>
                  <!-- v-on:input="watchCustomName()"
                      @focus="inputCustomName($event)" -->
                  <!-- <el-input placeholder="请输入" v-model.trim="buyerName"  style="width:40%"></el-input> -->
                </div>
                <div>
                  <span>纳税人识别号:</span>
                  <el-input
                    placeholder="请输入纳税人识别号"
                    v-model.trim="buyerAccount"
                    style="width: 75%"
                    readonly
                  ></el-input>
                </div>
              </div>
            </div>

            <!-- 商品 -->
            <div class="content-main-commodity-item">
              <div class="table">
                <div class="thead">
                  <div class="name">商品名称</div>
                  <div class="model">规格型号</div>
                  <div class="unit">单位</div>
                  <div class="count">数量</div>
                  <div class="price">单价</div>
                  <div class="amount">
                    <!-- <span v-if="isTaxIncluded">金额(含税)</span>
                    <span v-else>金额(不含税)</span>
                    <el-switch
                      v-model.trim="isTaxIncluded"
                      @change="TaxIncluded()"
                      :disabled="collectionType != 0"
                    ></el-switch> -->
                    <span>金额</span>
                    <el-switch
                      class="ELswitch"
                      :width="65"
                      v-model="isTaxIncluded"
                      @change="TaxIncluded()"
                      :disabled="collectionType != 0"
                      :active-value="true"
                      :inactive-value="false"
                      active-text="含 税"
                      inactive-text="不含税"
                    ></el-switch>
                  </div>

                  <div class="taxRate">税率</div>
                  <div class="tax">税额</div>
                  <div class="opt">操作</div>
                </div>

                <div class="tbody">
                  <div
                    class="tbody-tr"
                    v-for="(item, index) in tableData"
                    :key="index"
                  >
                    <div class="name" @dblclick="selectProduct(item, index)">
                      <el-input
                        placeholder="双击选择商品"
                        v-model.trim="item.name"
                        v-on:input="watchName(item, index)"
                        @focus="inputName($event, index)"
                      ></el-input>
                    </div>
                    <div class="model">
                      <el-input
                        v-model.trim="item.specifications"
                        v-on:input="watchSpecifications(item, index)"
                      ></el-input>
                    </div>
                    <div class="unit">
                      <el-input
                        v-model.trim="item.unit"
                        v-on:input="watchUnit(item, index)"
                      ></el-input>
                    </div>
                    <div class="count">
                      <el-input
                        v-model.trim="item.goodsNumber"
                        v-on:input="watchCount(item, index)"
                        :readonly="collectionType == 2 && item.amount === ''"
                        onkeyup="value=value.replace(/[^\d\.]/g, '')"
                        onchange="value=value.replace(/[^\d\.]/g, '')"
                      >
                        <i
                          slot="prefix"
                          style="
                            display: inline-block;
                            margin-top: 10px;
                            color: black;
                          "
                          >-
                        </i>
                      </el-input>
                    </div>
                    <div class="price">
                      <el-input
                        v-model.trim="item.goodsPrice"
                        v-on:input="watchPrice(item, index)"
                        :readonly="collectionType == 2"
                        onkeyup="value=value.replace(/[^\d\.]/g,'')"
                        onchange="value=value.replace(/[^\d\.]/g,'')"
                      ></el-input>
                    </div>
                    <div class="amount">
                      <el-input
                        v-model.trim="item.goodsAmount"
                        v-on:input="watchAmount(item, index)"
                        @blur="blurAmount(item, index)"
                        :readonly="collectionType == 2"
                        @focus="changeDifference(item, index)"
                        onkeyup="value=value.replace(/[^\d\.]/g, '')"
                        onchange="value=value.replace(/[^\d\.]/g, '')"
                      >
                        <i
                          slot="prefix"
                          style="
                            display: inline-block;
                            margin-top: 10px;
                            color: black;
                          "
                          >-
                        </i>
                      </el-input>
                    </div>
                    <div class="taxRate">
                      <el-select
                        v-model.trim="item.taxRate"
                        placeholder="请选择"
                        @change="computerTaxs(index)"
                        @focus="taxSelect(index)"
                      >
                        <el-option
                          v-for="item in taxRateSelect"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </div>
                    <div class="tax">
                      <el-input v-model.trim="item.taxAmount" readonly>
                        <i
                          slot="prefix"
                          style="
                            display: inline-block;
                            margin-top: 10px;
                            color: black;
                          "
                          >-
                        </i>
                      </el-input>
                    </div>
                    <div class="opt">
                      <template v-if="item.name">
                        <el-button
                          type="text"
                          size="small"
                          @click="toCopy(item, index)"
                          :disabled="collectionType == 2"
                          >复制</el-button
                        >
                        <el-button
                          type="text"
                          size="small"
                          @click="toAdd(item, index)"
                          :disabled="collectionType == 2"
                          >增行</el-button
                        >
                        <el-button
                          type="text"
                          size="small"
                          @click="toRemove(item, index)"
                          >删除</el-button
                        >
                      </template>
                    </div>
                  </div>
                </div>
              </div>

              <div class="tfoot">
                <div class="tfoot-left">
                  <span><i class="tfoot-total">i</i> 合计</span>
                  <span
                    >金额: <i>-{{ totalPrice.totalAmount }}</i></span
                  >
                  <span
                    >税额: <i>-{{ totalPrice.totalTax }}</i></span
                  >
                </div>
                <div class="tfoot-right">
                  <span
                    >价税合计(大写):
                    <i>（负数）{{ totalPrice.priceTaxBig }}</i></span
                  >
                  <span
                    >价税合计(小写):
                    <i>-{{ totalPrice.priceTaxSmall }}</i></span
                  >
                </div>
              </div>
            </div>

            <!-- 销售方 -->
            <div class="content-main-seller">
              <div class="seller">说<br /><br />明</div>
              <div class="seller-info">
                <div style="padding: 20px">
                  <!-- <h3>开具红字发票信息选择</h3> -->
                  <div>
                    <el-radio v-model.trim="applyType" :label="1" disabled
                      ><span style="margin-left: 15px"
                        >一、购买方申请</span
                      ></el-radio
                    >
                    <p
                      style="
                        height: 18px;
                        font-size: 14px;
                        color: #787878;
                        margin-left: 35px;
                      "
                    >
                      对应蓝字专用发票抵扣增值税销项税额情况
                    </p>
                    <el-radio-group
                      v-model.trim="radio"
                      style="margin-left: 35px"
                      disabled
                    >
                      <el-radio :label="0">已抵扣</el-radio>
                      <el-radio :label="1">未抵扣</el-radio>
                    </el-radio-group>
                  </div>
                  <div style="margin-top: 20px">
                    <el-radio :label="2" v-model.trim="applyType" disabled
                      ><span style="margin-left: 15px"
                        >二、销售方申请</span
                      ></el-radio
                    >
                  </div>
                  <div style="margin-left: 35px">
                    <p style="color: #5e8cf9; height: 18px; font-size: 14px">
                      对应蓝字发票信息
                    </p>
                    <p style="height: 18px; font-size: 14px">
                      发票类型：{{ billType }}
                    </p>
                    <p style="height: 18px; font-size: 14px">
                      发票代码：{{ billAccount }}
                    </p>
                    <p style="height: 18px; font-size: 14px">
                      发票号码：{{ billNum }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="seller-remarks">
                <div>
                  <span for="" style="margin-right: 30px">联系电话:</span
                  ><el-input
                    type="text"
                    size="small"
                    style="width: 70%"
                    v-model.trim="telephone"
                    maxlength="11"
                  ></el-input>
                </div>

                <div style="margin-top: 20px">
                  <span for="" style="margin-right: 30px; line-height: 200px"
                    >申请理由:</span
                  ><el-input
                    type="textarea"
                    :rows="8"
                    style="width: 70%"
                    v-model.trim="applyTitle"
                    maxlength="200"
                  ></el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="text-align: center; margin-top: 20px">
        <el-button style="margin-right: 20px" size="small" @click="cancel()"
          >取&nbsp;&nbsp;消</el-button
        >
        <el-button type="primary" size="small" @click="upload()"
          >上&nbsp;&nbsp;传</el-button
        >
      </div>
    </div>

    <!-- 选择商品组件 -->
    <el-dialog
      title="选择商品"
      width="70%"
      :visible.sync="selectProductVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
    >
      <SelectProduct
        :taxDiskNum="taxDiskNum"
        :index="selectIndex"
        :taxMethodVal="parseInt(collectionType)"
        @selectProductClose="selectProductCancel"
        @selectProductDetermine="selectProductDetermine"
      ></SelectProduct>
    </el-dialog>

    <!-- 商品联想框 -->
    <div class="LenovoBox" ref="LenovoBox" v-show="LenovoBoxVisible">
      <LenovoBox
        :dataList="dataList"
        :indexBox="indexBox"
        @lenovoDetermine="lenovoDetermine"
      ></LenovoBox>
    </div>

    <!-- 选择客户组件 -->
    <div v-if="selectCustomerVisible">
      <el-dialog
        title="选择客户"
        width="70%"
        :visible.sync="selectCustomerVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        destroy-on-close
      >
        <SelectCustomer
          @selectCustomerDetermine="selectCustomerDetermine"
        ></SelectCustomer>
      </el-dialog>
    </div>

    <!-- 客户联想框 -->
    <div class="customLenovo" ref="customLenovo" v-show="customLenovoVisible">
      <CustomLenovo
        :dataList="customdataList"
        @lenovoDetermine="customLenovolenovoDetermine"
      ></CustomLenovo>
    </div>

    <!-- 差额设置弹框 -->
    <div v-if="differenceVisible">
      <el-dialog
        title="差额设置"
        width="25%"
        :visible.sync="differenceVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        destroy-on-close
        :before-close="setDifferenceCancel"
      >
        <SetDifference
          :productInfos="tableData"
          @setDifferenceClose="setDifferenceCancel"
          @setDifferenceDetermine="setDifferenceDetermine"
        ></SetDifference>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  validStrCheckLengthTextarea,
  validPhone,
  validEamil,
} from "@/utils/validate.js";
import {
  redLetterUpload,
  getDetailsById,
  getTaxRateList,
  getInvoiceInfo,
  getInvoiceInfo1,
} from "@/api/redLetterListApi.js";
import { createComprisonFunction } from "@/utils/function.js";
import SelectProduct from "../home/components/SelectProduct.vue";
import LenovoBox from "../home/components/LenovoBox.vue";
import CustomLenovo from "../home/components/customLenovo.vue";
import { convertCurrency } from "@/utils/function.js";
import SetDifference from "../home/components/SetDifference.vue";
// import { getRedisList } from "@/api/taxStock";
import Breadnav from "@/components/Breadnav";
import SelectCustomer from "../home/components/SelectCustomer.vue";
import {
  customLenovo,
  lenovo,
  autoCode,
  getSellerDefaultData,
  getLoginData,
} from "@/api/lightInvoicing.js";
import {
  showFullScreenLoading,
  tryHideFullScreenLoading,
} from "@/utils/loadingX";
import { getRedis } from "@/api/taxStock";
export default {
  name: "RedSaleApply",
  components: {
    SelectProduct,
    Breadnav,
    LenovoBox,
    SelectCustomer,
    CustomLenovo,
    SetDifference,
  },
  data() {
    return {
      boxReadonly: false,
      boxRow: "",
      valueType: "", //判断从哪里传过来的
      title: "", //标题
      applyReason: "", //申请类型
      applyName: "", //申请方经办人
      applyTime: "", //申请日期
      buyerName: "", //购买方 ----名称
      buyerAccount: "", //  ----纳税人识别号
      salerName: "", //销售方   ----名称
      salerAccount: "", //  ----纳税人识别号
      taxRateSelect: [],
      tableData: [
        // {
        //   createTime: "",
        //   incentivesLabel:'',
        //   goodsShortName:'',
        //   goodsName: "*水果*杏",
        //   specifications: "X1111111",
        //   unit: "只",
        //   goodsNumber: "",
        //   price: "3",
        //   goodsPrice: "3",
        //   amount: "",
        //   goodsAmount: "",
        //   taxRate: "1%",
        //   taxAmount: "",
        //   goodsSelfCode: "",
        //   zeroTaxMarks:'',
        //   isTax:1,
        // },
      ],
      // 减按征税条件下
      taxRateSelect_jianan: [{ value: 0.015, label: "1.5%" }],
      // 价格合计
      totalPrice: {
        totalAmount: "",
        totalAmountC: "",
        totalTax: "",
        totalTaxC: "",

        priceTaxBig: "",
        priceTaxSmall: "",
        priceTaxSmallC: "",
      },
      applyType: 1, //购买方申请
      radio: 0, //已抵扣
      billType: "", // 发票类型
      billTypeCode: "", // 发票类型code
      billAccount: "", //发票代码
      billNum: "", //发票号码
      telephone: "", //联系电话
      applyTitle: "", //申请理由

      selectProductVisible: false,
      // 是否含税
      isTaxIncluded: true,
      // 商品表格基本格式
      tableData_el: {
        name: "", //展示名字
        createTime: "", //创建时间
        incentivesLabel: "", //优惠政策
        goodsShortName: "", //税收分类简称
        goodsName: "", //商品名称
        specifications: "", //规格型号
        unit: "", //单位
        goodsNumber: "", //商品数量
        price: "",
        goodsPrice: "", //商品单价
        amount: "",
        goodsAmount: "", //商品金额
        taxRate: "", //税率
        taxAmount: "", //税额
        goodsSelfCode: "", //商品自行编码
        zeroTaxMarks: "", //标识零税率
        goodsCode: "", //商品编码
      },
      taxDiskNum: "", //税盘号
      selectIndex: 0,
      invoiceDate: "", //开票日期
      invoiceId: "", //对应蓝字发票id

      collectionType: 0, //征收方式
      ke1: [],
      loading: false,
      taxRateSelect_const: [],

      // 联想框
      LenovoBoxVisible: false,
      dataList: [],
      indexBox: 0,

      // 选择客户
      selectCustomerVisible: false,

      // 客户联想框
      customLenovoVisible: false,
      customdataList: [],
      // customLenovoIndexBox:0,

      differenceVisible: false,

      // 差额征税含税销售额（弹框）
      sales: "",
      // 差额备注
      remarkNote: "",
      // 差额征税扣除额
      differentialTaxationAmount: "",

      editDifference: false,
    };
  },
  computed: {
    taxDiskNumChange() {
      return this.$store.state.user.taxDiskNum;
    },
  },
  watch: {
    taxDiskNumChange: {
      handler: function (newval, oldval) {
        if (newval !== oldval) {
          this.taxDiskNum = newval;
        }
      },
      deep: true,
    },
  },
  created() {
    console.log("this.$store", this.$store.state);
    this.getParams();
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    this.applyTime = year + "-" + month + "-" + day;
    // this.applyName = this.$store.state.user.loginInfo.companyUser.nickName;
  },
  mounted() {
    this.taxDiskNum = this.$store.state.user.taxDiskNum;
    this.togetSellerDefaultData();
  },
  methods: {
    // 差额征税 点击金额改变差额
    changeDifference(item, index) {
      if (this.tableData[0].name && this.collectionType == 2) {
        this.differenceVisible = true;
        this.editDifference = true;
      } else {
        this.tableData[index].goodsAmount = item.goodsAmount
          ? Math.abs(item.goodsAmount)
          : "";
        this.tableData[index].amount = item.amount ? Math.abs(item.amount) : "";
      }
    },
    // 企业用户登入信息
    togetLoginData() {
      let params = "";
      getLoginData(params)
        .then((response) => {
          if (response && response.code == "200") {
            let res = response.data;
            this.buyerName = res.companyName ? res.companyName : "空";
            this.buyerAccount = res.taxId;
          }
        })
        .catch((error) => {});
    },
    // 获取申请方经办人
    togetSellerDefaultData() {
      let params = this.taxDiskNum;
      var that = this;
      getSellerDefaultData(params)
        .then((response) => {
          if (response && response.code == "200") {
            let res = response.data;
            console.log(res);
            that.applyName = res.kpr;
          }
        })
        .catch((error) => {});
    },
    // 返回
    clickLeft() {
      if (this.valueType == "shenqing") {
        this.$router.push({
          path: "/management/invoicingManagement/redApply",
          query: {
            data: JSON.stringify({
              row: this.boxRow,
            }),
          },
        });
      } else {
        this.$router.push("/management/invoicingManagement/redLetters");
      }
      //  else if (this.valueType == "fapiaochaxun") {
      //   this.$router.push("/management/summaryManagement/InvoiceInquiry");
      // }
    },
    getParams() {
      var box = this.$route.query.data;
      var data = JSON.parse(box);
      console.log(data);
      if (data.row) {
        this.boxRow = data.row;
      }
      this.valueType = data.type;

      if (data.type == "shenqing") {
        this.applyType = data.applyType;
        this.radio = data.radio;
        this.billTypeCode = data.ruleForm.invoiceType;
        // let params = {
        //   invoiceType: data.ruleForm.invoiceType,
        //   taxDiskNum: this.$store.state.user.taxDiskNum,
        // };
        // let str = JSON.stringify(this.tableData_el);
        // this.tableData.push(JSON.parse(str));

        var that = this;

        if (data.ruleForm.invoiceType == "004") {
          this.billType = "增值税专用发票";
        } else if (data.ruleForm.invoiceType == "007") {
          this.billType = "增值税普通发票";
        } else if (data.ruleForm.invoiceType == "025") {
          this.billType = "卷式发票";
        } else if (data.ruleForm.invoiceType == "026") {
          this.billType = "电子普通发票";
        } else if (data.ruleForm.invoiceType == "028") {
          this.billType = "电子专用发票";
        } else if (data.ruleForm.invoiceType == "005") {
          this.billType = "机动车销售统一发票";
        }
        this.billAccount = data.ruleForm.code;
        this.billNum = data.ruleForm.invoiceNo;
        if (data.applyType == "1") {
          if (data.radio == "0") {
            this.boxReadonly = false;
            this.title = "购买方已抵扣";
            this.applyReason = "0";
            this.invoiceDate = data.ruleForm.datetime;
            this.togetSellerDefaultData();
            this.togetLoginData();
            let str = JSON.stringify(this.tableData_el);
            this.tableData.push(JSON.parse(str));

            getTaxRateList({
              invoiceType: data.ruleForm.invoiceType,
              taxDiskNum: this.$store.state.user.taxDiskNum,
            })
              .then((res) => {
                if (res && res.code == "200") {
                  if (res.data.length > 0) {
                    res.data.forEach((item) => {
                      that.taxRateSelect.push({
                        value: item.taxRate,
                        label: Number(item.taxRate) * 100 + "%",
                      });
                      that.taxRateSelect_const.push({
                        value: item.taxRate,
                        label: Number(item.taxRate) * 100 + "%",
                      });
                    });
                  } else {
                    that.taxRateSelect = [
                      { value: 0, label: "0%" },
                      { value: 0.01, label: "1%" },
                      { value: 0.03, label: "3%" },
                      { value: 0.04, label: "4%" },
                      { value: 0.06, label: "6%" },
                      { value: 0.09, label: "9%" },
                      { value: 0.1, label: "10%" },
                      { value: 0.11, label: "11%" },
                      { value: 0.13, label: "13%" },
                      { value: 0.16, label: "16%" },
                      { value: 0.17, label: "17%" },
                    ];
                  }
                }
              })
              .catch((error) => {});

            // let date = new Date();
            // let year = date.getFullYear();
            // let month = date.getMonth() + 1;
            // let day = date.getDate();
            // month = month < 10 ? "0" + month : month;
            // day = day < 10 ? "0" + day : day;
            // this.invoiceDate = year + "-" + month + "-" + day;
          } else if (data.radio == "1") {
            this.boxReadonly = true;
            this.title = "购买方未抵扣";
            this.applyReason = "1";
            // console.log(data.ruleForm);

            getTaxRateList({
              invoiceType: data.ruleForm.invoiceType,
              taxDiskNum: this.$store.state.user.taxDiskNum,
            })
              .then((res) => {
                if (res && res.code == "200") {
                  if (res.data.length > 0) {
                    res.data.forEach((item) => {
                      that.taxRateSelect.push({
                        value: item.taxRate,
                        label: Number(item.taxRate) * 100 + "%",
                      });
                      that.taxRateSelect_const.push({
                        value: item.taxRate,
                        label: Number(item.taxRate) * 100 + "%",
                      });
                    });
                  } else {
                    that.taxRateSelect = [
                      { value: 0, label: "0%" },
                      { value: 0.01, label: "1%" },
                      { value: 0.03, label: "3%" },
                      { value: 0.04, label: "4%" },
                      { value: 0.06, label: "6%" },
                      { value: 0.09, label: "9%" },
                      { value: 0.1, label: "10%" },
                      { value: 0.11, label: "11%" },
                      { value: 0.13, label: "13%" },
                      { value: 0.16, label: "16%" },
                      { value: 0.17, label: "17%" },
                    ];
                  }
                }
              })
              .catch((error) => {});

            let applyParams1 = {
              invoiceCode: data.ruleForm.code,
              invoiceNo: data.ruleForm.invoiceNo,
              invoiceType: data.ruleForm.invoiceType,
              invoiceDate: this.getLocalTime(data.ruleForm.datetime),
            };
            // this.getInvoiceDetails(applyParams1);
            var that = this;
            getInvoiceInfo1(applyParams1)
              .then((res) => {
                if (res.code == "200") {
                  // console.log(res)
                  that.applyName = res.data.kpr; //申请人
                  that.invoiceId = res.data.invoiceId; //蓝字发票id
                  // that.isTaxIncluded = true;

                  that.collectionType = res.data.taxationType; //征收方式

                  if (that.collectionType == 1) {
                    that.taxRateSelect = [{ value: 0.015, label: "1.5%" }];
                  }
                  // that.invoiceDate = res.data.invoiceDate; //开票日期
                  let date = new Date(res.data.invoiceDate);
                  let year = date.getFullYear();
                  let month = date.getMonth() + 1;
                  let day = date.getDate();
                  month = month < 10 ? "0" + month : month;
                  day = day < 10 ? "0" + day : day;
                  that.invoiceDate = year + "-" + month + "-" + day;
                  // that.collectionType = res.data.collectionType; //征收方式

                  if (that.collectionType == 2) {
                    // that.collectionType = 2;
                    that.differentialTaxationAmount =
                      res.data.differentialTaxationAmount;
                    // that.tableData[0].amount = res.data.differentialTaxationAmount
                    // that.tableData[0].goodsAmount = res.data.differentialTaxationAmount

                    that.tableData[0].amount = res.data
                      .differentialTaxationAmount
                      ? res.data.differentialTaxationAmount
                      : "";
                    that.tableData[0].goodsAmount = res.data
                      .differentialTaxationAmount
                      ? res.data.differentialTaxationAmount
                      : "";
                  }
                  that.buyerName = res.data.buyerName; //购方名称
                  that.buyerAccount = res.data.buyerTaxId; //购方税号
                  that.salerName = res.data.sellerName; //销方名称
                  that.salerAccount = res.data.sellerTaxId; //销方税号
                  that.billTypeCode = res.data.invoiceType; //发票类型code
                  if (res.data.invoiceType == "004") {
                    that.billType = "增值税专用发票";
                  } else if (res.data.invoiceType == "007") {
                    that.billType = "增值税普通发票";
                  } else if (res.data.invoiceType == "025") {
                    that.billType = "卷式发票";
                  } else if (res.data.invoiceType == "026") {
                    that.billType = "电子普通发票";
                  } else if (res.data.invoiceType == "028") {
                    that.billType = "电子专用发票";
                  } else if (res.data.invoiceType == "005") {
                    that.billType = "机动车销售统一发票";
                  }
                  that.billAccount = res.data.invoiceCode; //发票代码
                  that.billNum = res.data.invoiceNo; //发票号码
                  // that.invoiceDate = res.data.invoiceDate; //开票日期
                  that.invoiceId = res.data.invoiceId; //对应蓝字发票id
                  if (res.data.invoiceInfoDetailsList) {
                    if (res.data.invoiceInfoDetailsList[0].isTax == "0") {
                      that.isTaxIncluded = false;
                    } else if (
                      res.data.invoiceInfoDetailsList[0].isTax == "1"
                    ) {
                      that.isTaxIncluded = true;
                    }
                    that.tableData = res.data.invoiceInfoDetailsList; //商品详情
                    that.tableData.forEach((item) => {
                      // item.goodsNumber = Math.abs(parseFloat(item.goodsNumber));
                      // item.goodsAmount = Math.abs(parseFloat(item.goodsAmount));
                      // item.taxAmount = Math.abs(parseFloat(item.taxAmount));
                      // item.isTax = "1";
                      // if(item.isTax=='0'){
                      //   item.isTax = "1";
                      // }
                      if (item.goodsNumber) {
                        item.goodsNumber = Math.abs(
                          parseFloat(item.goodsNumber)
                        );
                      } else {
                        item.goodsNumber = "";
                      }
                      if (item.goodsAmount) {
                        item.goodsAmount = Math.abs(
                          parseFloat(item.goodsAmount)
                        );
                      } else {
                        item.goodsAmount = "";
                      }

                      if (item.taxAmount) {
                        item.taxAmount = Math.abs(parseFloat(item.taxAmount));
                      } else {
                        item.taxAmount = "";
                      }
                      item.price = item.goodsPrice;
                      item.amount = item.goodsAmount;
                      let shortName = item.taxClassificationShortName
                        ? item.taxClassificationShortName
                        : item.goodsShortName;
                      if (shortName) {
                        item.name = "*" + shortName + "*" + item.goodsName;
                      } else {
                        item.name = "**" + item.goodsName;
                      }
                      if (that.collectionType == 1) {
                        item.taxRate = 0.015;
                      } else {
                        item.taxRate = parseFloat(item.taxRate);
                        that.taxRateSelect.forEach((item1) => {
                          if (item.taxRate !== item1.value) {
                            that.taxRateSelect.push({
                              value: item.taxRate,
                              label: Number(item.taxRate) * 100 + "%",
                            });
                          }
                        });
                        that.taxRateSelect = that.unique(that.taxRateSelect);
                      }
                    });
                    if (res.data.totalAmount) {
                      that.totalPrice.totalAmount = parseFloat(
                        res.data.totalAmount
                      );
                    } //合计金额

                    if (res.data.totalTaxAmount) {
                      that.totalPrice.totalTax = parseFloat(
                        res.data.totalTaxAmount
                      );
                    }
                    //合计税额
                    if (res.data.totalAmount && res.data.totalTaxAmount) {
                      that.totalPrice.priceTaxSmall = Math.abs(
                        parseFloat(res.data.totalAmount) +
                          parseFloat(res.data.totalTaxAmount)
                      ).toFixed(2);
                    } //价税合计小写
                    that.totalPrice.priceTaxBig = convertCurrency(
                      that.totalPrice.priceTaxSmall
                    ); //价税合计大写
                    // that.TaxIncluded();
                    // that.computerTotalPrice();
                  } else {
                    // that.isTaxIncluded = true;
                    let str = JSON.stringify(this.tableData_el);
                    that.tableData.push(JSON.parse(str));
                  }
                } else {
                  // that.$message({
                  //   type: "warning",
                  //   message: res.msg,
                  // });
                  that.invoiceDate = data.ruleForm.datetime;
                  that.togetSellerDefaultData();
                  that.togetLoginData();
                  let str = JSON.stringify(this.tableData_el);
                  that.tableData.push(JSON.parse(str));
                }
              })
              .catch((error) => {});
          }
        } else if (data.applyType == "2") {
          this.boxReadonly = true;
          this.title = "销售方申请";
          this.applyReason = "2";
          // this.getInvoiceDetails(data.ruleForm);

          getTaxRateList({
            invoiceType: data.ruleForm.invoiceType,
            taxDiskNum: this.$store.state.user.taxDiskNum,
          })
            .then((res) => {
              if (res && res.code == "200") {
                if (res.data.length > 0) {
                  res.data.forEach((item) => {
                    that.taxRateSelect.push({
                      value: item.taxRate,
                      label: Number(item.taxRate) * 100 + "%",
                    });
                    that.taxRateSelect_const.push({
                      value: item.taxRate,
                      label: Number(item.taxRate) * 100 + "%",
                    });
                  });
                } else {
                  that.taxRateSelect = [
                    { value: 0, label: "0%" },
                    { value: 0.01, label: "1%" },
                    { value: 0.03, label: "3%" },
                    { value: 0.04, label: "4%" },
                    { value: 0.06, label: "6%" },
                    { value: 0.09, label: "9%" },
                    { value: 0.1, label: "10%" },
                    { value: 0.11, label: "11%" },
                    { value: 0.13, label: "13%" },
                    { value: 0.16, label: "16%" },
                    { value: 0.17, label: "17%" },
                  ];
                }

                let applyParams2 = {
                  invoiceCode: data.ruleForm.code,
                  invoiceNo: data.ruleForm.invoiceNo,
                  invoiceType: data.ruleForm.invoiceType,
                  invoiceDate: this.getLocalTime(data.ruleForm.datetime),
                };
                this.getInvoiceDetails(applyParams2);
              }
            })
            .catch((error) => {});
        }

        // ----------------------------说明  ------------------------
      } else if (data.type == "xiugai") {
        this.boxReadonly = true;

        var that = this;
        // let params1 = {
        //   invoiceType: data.formData.invoiceType,
        //   taxDiskNum: that.$store.state.user.taxDiskNum,
        // };
        // let str = JSON.stringify(that.tableData_el);
        // that.tableData.push(JSON.parse(str));
        // var that = this;
        getTaxRateList({
          invoiceType: data.formData.invoiceType,
          taxDiskNum: that.$store.state.user.taxDiskNum,
        })
          .then((res) => {
            if (res && res.code == "200") {
              // console.log(res);
              // if (that.collectionType == 1) {
              //   that.taxRateSelect = [{ value: 0.015, label: "1.5%" }];
              // } else {
              if (res.data.length > 0) {
                res.data.forEach((item) => {
                  that.taxRateSelect.push({
                    value: item.taxRate,
                    label: Number(item.taxRate) * 100 + "%",
                  });
                  that.taxRateSelect_const.push({
                    value: item.taxRate,
                    label: Number(item.taxRate) * 100 + "%",
                  });
                });
              } else {
                that.taxRateSelect = [
                  { value: 0, label: "0%" },
                  { value: 0.01, label: "1%" },
                  { value: 0.03, label: "3%" },
                  { value: 0.04, label: "4%" },
                  { value: 0.06, label: "6%" },
                  { value: 0.09, label: "9%" },
                  { value: 0.1, label: "10%" },
                  { value: 0.11, label: "11%" },
                  { value: 0.13, label: "13%" },
                  { value: 0.16, label: "16%" },
                  { value: 0.17, label: "17%" },
                ];
              }

              let applyParams = {
                id: data.formData.id,
              };

              getDetailsById(applyParams)
                .then((res) => {
                  if (res && res.code == "200") {
                    if (res.data.goodsCommonDetail) {
                      that.tableData = res.data.goodsCommonDetail; //商品详情
                      // that.isTaxIncluded = true;
                      that.collectionType = res.data.collectionType; //征收方式
                      if (that.collectionType == 1) {
                        that.taxRateSelect = [{ value: 0.015, label: "1.5%" }];
                      }
                      if (that.tableData[0].isTax == 0) {
                        that.isTaxIncluded = false;
                      } else if (that.tableData[0].isTax == 1) {
                        that.isTaxIncluded = true;
                      }
                      // that.isTaxIncluded = true;
                      that.tableData.forEach((item) => {
                        // item.isTax = "1";

                        if (item.goodsNumber) {
                          item.goodsNumber = Math.abs(
                            parseFloat(item.goodsNumber)
                          );
                        } else {
                          item.goodsNumber = "";
                        }
                        if (item.goodsAmount) {
                          item.goodsAmount = Math.abs(
                            parseFloat(item.goodsAmount)
                          );
                        } else {
                          item.goodsAmount = "";
                        }

                        if (item.taxAmount) {
                          item.taxAmount = Math.abs(parseFloat(item.taxAmount));
                        } else {
                          item.taxAmount = "";
                        }
                        item.price = item.goodsPrice;
                        item.amount = item.goodsAmount;
                        var shortName = item.taxClassificationShortName
                          ? item.taxClassificationShortName
                          : item.goodsShortName;
                        if (shortName) {
                          item.name = "*" + shortName + "*" + item.goodsName;
                        } else {
                          item.name = "**" + item.goodsName;
                        }
                        if (res.data.collectionType == 1) {
                          item.taxRate = 0.015;
                        } else {
                          // if (
                          //   that.taxRateSelect.some((item1) => {
                          //     return item1.value == item.taxRate;
                          //   }) == true
                          // ) {
                          //   item.taxRate = item.taxRate;
                          // } else {
                          //   item.taxRate = null;
                          //   item.taxAmount = null;
                          // }
                          item.taxRate = parseFloat(item.taxRate);
                          that.taxRateSelect.forEach((item1) => {
                            if (item.taxRate !== item1.value) {
                              that.taxRateSelect.push({
                                value: item.taxRate,
                                label: Number(item.taxRate) * 100 + "%",
                              });
                            }
                          });
                          that.taxRateSelect = that.unique(that.taxRateSelect);
                        }
                      });
                      // that.TaxIncluded();
                    } else {
                      that.isTaxIncluded = true;
                      let str = JSON.stringify(that.tableData_el);
                      that.tableData.push(JSON.parse(str));
                    }

                    if (res.data.applyReason == "0") {
                      that.title = "购买方已抵扣";
                      that.applyReason = "0";
                    } else if (res.data.applyReason == "1") {
                      that.title = "购买方未抵扣";
                      that.applyReason = "1";
                    } else if (res.data.applyReason == "2") {
                      that.title = "销售方申请";
                      that.applyReason = "2";
                    }

                    if (res.data.collectionType == 2) {
                      that.collectionType = 2;
                      that.differentialTaxationAmount =
                        res.data.differentialTaxationAmount;

                      // that.tableData[0].amount = res.data.differentialTaxationAmount
                      // that.tableData[0].goodsAmount = res.data.differentialTaxationAmount

                      that.tableData[0].amount = res.data
                        .differentialTaxationAmount
                        ? res.data.differentialTaxationAmount
                        : "";
                      that.tableData[0].goodsAmount = res.data
                        .differentialTaxationAmount
                        ? res.data.differentialTaxationAmount
                        : "";
                    }

                    that.applyName = res.data.applyPerson; //申请人
                    // that.applyTime= res.data.uploadDate; //申请日期
                    that.buyerName = res.data.buyerName; //购方名称
                    that.buyerAccount = res.data.buyerTaxId; //购方税号
                    that.salerName = res.data.sellerName; //销方名称
                    that.salerAccount = res.data.sellerTaxId; //销方税号
                    that.telephone = res.data.phone; //联系电话
                    that.applyTitle = res.data.reason; //申请理由
                    if (res.data.priceAmount) {
                      that.totalPrice.totalAmount =
                        parseFloat(res.data.priceAmount) * -1;
                    } //合计金额

                    if (res.data.taxAmount) {
                      that.totalPrice.totalTax =
                        parseFloat(res.data.taxAmount) * -1;
                    }
                    //合计税额
                    if (res.data.priceAmount && res.data.taxAmount) {
                      that.totalPrice.priceTaxSmall = (
                        parseFloat(res.data.priceAmount) * -1 +
                        parseFloat(res.data.taxAmount) * -1
                      ).toFixed(2);
                    } //价税合计小写
                    that.totalPrice.priceTaxBig = convertCurrency(
                      that.totalPrice.priceTaxSmall
                    ); //价税合计大写
                    // that.computerTotalPrice();

                    that.billTypeCode = res.data.invoiceType; //发票类型code
                    if (res.data.invoiceType == "004") {
                      that.billType = "增值税专用发票";
                    } else if (res.data.invoiceType == "007") {
                      that.billType = "增值税普通发票";
                    } else if (res.data.invoiceType == "025") {
                      that.billType = "卷式发票";
                    } else if (res.data.invoiceType == "026") {
                      that.billType = "电子普通发票";
                    } else if (res.data.invoiceType == "028") {
                      that.billType = "电子专用发票";
                    } else if (res.data.invoiceType == "005") {
                      that.billType = "机动车销售统一发票";
                    }
                    // that.deviceNo=res.data.deviceNo;//税盘号
                    that.billAccount = res.data.invoiceCode; //发票代码
                    that.billNum = res.data.invoiceNo; //发票号码

                    that.invoiceDate = this.getLocalTime(res.data.invoiceDate) //开票日期
                    that.invoiceId = res.data.invoiceId; //对应蓝字发票id
                  }
                })
                .catch((error) => {});
            }
            // }
          })
          .catch((error) => {});
      }
    },
    unique(arr) {
      for (var i = 0, len = arr.length; i < len; i++) {
        for (var j = i + 1, len = arr.length; j < len; j++) {
          if (arr[i].value === arr[j].value) {
            arr.splice(j, 1);
            j--; // 每删除一个数j的值就减1
            len--; // j值减小时len也要相应减1（减少循环次数，节省性能）
            // console.log(j,len)
          }
        }
      }
      return arr;
    },
    // 获取蓝字发票详情
    getInvoiceDetails(applyParams) {
      var that = this;
      getInvoiceInfo(applyParams)
        .then((res) => {
          if (res && res.code == "200") {
            // console.log(res)
            that.applyName = res.data.kpr; //申请人
            that.invoiceId = res.data.invoiceId; //蓝字发票id
            // that.isTaxIncluded = true;

            that.collectionType = res.data.taxationType; //征收方式

            if (that.collectionType == 1) {
              that.taxRateSelect = [{ value: 0.015, label: "1.5%" }];
            }
            // that.invoiceDate = res.data.invoiceDate; //开票日期
            let date = new Date(res.data.invoiceDate);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            month = month < 10 ? "0" + month : month;
            day = day < 10 ? "0" + day : day;
            that.invoiceDate = year + "-" + month + "-" + day;
            // that.collectionType = res.data.collectionType; //征收方式

            if (that.collectionType == 2) {
              // that.collectionType = 2;
              that.differentialTaxationAmount =
                res.data.differentialTaxationAmount;
              // that.tableData[0].amount = res.data.differentialTaxationAmount
              // that.tableData[0].goodsAmount = res.data.differentialTaxationAmount

              that.tableData[0].amount = res.data.differentialTaxationAmount
                ? res.data.differentialTaxationAmount
                : "";
              that.tableData[0].goodsAmount = res.data
                .differentialTaxationAmount
                ? res.data.differentialTaxationAmount
                : "";
            }
            that.buyerName = res.data.buyerName; //购方名称
            that.buyerAccount = res.data.buyerTaxId; //购方税号
            that.salerName = res.data.sellerName; //销方名称
            that.salerAccount = res.data.sellerTaxId; //销方税号
            that.billTypeCode = res.data.invoiceType; //发票类型code
            if (res.data.invoiceType == "004") {
              that.billType = "增值税专用发票";
            } else if (res.data.invoiceType == "007") {
              that.billType = "增值税普通发票";
            } else if (res.data.invoiceType == "025") {
              that.billType = "卷式发票";
            } else if (res.data.invoiceType == "026") {
              that.billType = "电子普通发票";
            } else if (res.data.invoiceType == "028") {
              that.billType = "电子专用发票";
            } else if (res.data.invoiceType == "005") {
              that.billType = "机动车销售统一发票";
            }
            that.billAccount = res.data.invoiceCode; //发票代码
            that.billNum = res.data.invoiceNo; //发票号码
            that.invoiceDate = res.data.invoiceDate; //开票日期
            that.invoiceId = res.data.invoiceId; //对应蓝字发票id
            if (res.data.invoiceInfoDetailsList) {
              if (res.data.invoiceInfoDetailsList[0].isTax == "0") {
                that.isTaxIncluded = false;
              } else if (res.data.invoiceInfoDetailsList[0].isTax == "1") {
                that.isTaxIncluded = true;
              }
              that.tableData = res.data.invoiceInfoDetailsList; //商品详情
              that.tableData.forEach((item) => {
                // item.goodsNumber = Math.abs(parseFloat(item.goodsNumber));
                // item.goodsAmount = Math.abs(parseFloat(item.goodsAmount));
                // item.taxAmount = Math.abs(parseFloat(item.taxAmount));
                // item.isTax = "1";
                // if(item.isTax=='0'){
                //   item.isTax = "1";
                // }
                if (item.goodsNumber) {
                  item.goodsNumber = Math.abs(parseFloat(item.goodsNumber));
                } else {
                  item.goodsNumber = "";
                }
                if (item.goodsAmount) {
                  item.goodsAmount = Math.abs(parseFloat(item.goodsAmount));
                } else {
                  item.goodsAmount = "";
                }

                if (item.taxAmount) {
                  item.taxAmount = Math.abs(parseFloat(item.taxAmount));
                } else {
                  item.taxAmount = "";
                }
                item.price = item.goodsPrice;
                item.amount = item.goodsAmount;
                let shortName = item.taxClassificationShortName
                  ? item.taxClassificationShortName
                  : item.goodsShortName;
                if (shortName) {
                  item.name = "*" + shortName + "*" + item.goodsName;
                } else {
                  item.name = "**" + item.goodsName;
                }
                if (that.collectionType == 1) {
                  item.taxRate = 0.015;
                } else {
                  // if (
                  //   that.taxRateSelect.some((item1) => {
                  //     return item1.value == item.taxRate;
                  //   }) == true
                  // ) {
                  //   item.taxRate = item.taxRate;
                  // } else {
                  //   item.taxRate = null;
                  //   // item.amount = null;
                  //   // item.goodsAmount = null;
                  //   item.taxAmount = null;
                  //   // item.goodsNumber = null;
                  // }
                  item.taxRate = parseFloat(item.taxRate);
                  that.taxRateSelect.forEach((item1) => {
                    if (item.taxRate !== item1.value) {
                      that.taxRateSelect.push({
                        value: item.taxRate,
                        label: Number(item.taxRate) * 100 + "%",
                      });
                    }
                  });
                  that.taxRateSelect = that.unique(that.taxRateSelect);
                }
              });
              if (res.data.totalAmount) {
                that.totalPrice.totalAmount = parseFloat(res.data.totalAmount);
              } //合计金额

              if (res.data.totalTaxAmount) {
                that.totalPrice.totalTax = parseFloat(res.data.totalTaxAmount);
              }
              //合计税额
              if (res.data.totalAmount && res.data.totalTaxAmount) {
                that.totalPrice.priceTaxSmall = Math.abs(
                  parseFloat(res.data.totalAmount) +
                    parseFloat(res.data.totalTaxAmount)
                ).toFixed(2);
              } //价税合计小写
              that.totalPrice.priceTaxBig = convertCurrency(
                that.totalPrice.priceTaxSmall
              ); //价税合计大写
              // that.TaxIncluded();
              // that.computerTotalPrice();
            } else {
              // that.isTaxIncluded = true;
              let str = JSON.stringify(this.tableData_el);
              that.tableData.push(JSON.parse(str));
            }
          } else {
            // that.$message({
            //   type: "warning",
            //   message: res.msg,
            // });
          }
        })
        .catch((error) => {});
    },
    // 日期转化
    getLocalTime(nS) {
      let date = new Date(nS);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;
      date = year + "-" + month + "-" + day;
      return date;
    },
    taxSelect(index) {
      this.taxRateSelect = [];
      if (this.taxMethodVal == 1) {
        this.taxRateSelect = this.taxRateSelect_jianan;
      } else {
        this.taxRateSelect = this.taxRateSelect_const;
      }
      console.log("taxSelect...", this.taxRateSelect_const);
    },

    // 复制
    toCopy(item, index) {
      let str = JSON.stringify(item);
      this.tableData.splice(index + 1, 0, JSON.parse(str));
      this.computerTotalPrice();
    },

    // 增行
    toAdd(item, index) {
      console.log("item", item, index);
      let str = JSON.stringify(this.tableData_el);
      this.tableData.push(JSON.parse(str));
    },

    // 删除
    toRemove(item, index) {
      this.tableData.splice(index, 1);
      // if (this.tableData.length == 0) {
      //   let str = JSON.stringify(this.tableData_el);
      //   this.tableData.push(JSON.parse(str));
      // }
      // this.computerTotalPrice();
      this.fillUp();
    },

    fillUp() {
      // if (this.tableData.length < 5) {
      //     let count = 5-this.tableData.length
      //     for (let i = 0; i < count; i++) {
      //         let str = JSON.stringify(this.tableData_el)
      //         this.tableData.push(JSON.parse(str))
      //     }
      // }
      if (this.tableData.length == 0) {
        let str = JSON.stringify(this.tableData_el);
        this.tableData.push(JSON.parse(str));
        for (let key in this.totalPrice) {
          this.totalPrice[key] = "";
        }
      }
      this.computerTotalPrice();
    },
    //取消
    cancel() {
      if (this.valueType == "shenqing") {
        this.$router.push({
          path: "/management/invoicingManagement/redApply",
          query: {
            data: JSON.stringify({
              row: this.boxRow,
            }),
          },
        });
      } else {
        this.$router.push("/management/invoicingManagement/redLetters");
      }
      // else if (this.valueType == "fapiaochaxun") {
      //   this.$router.push("/management/summaryManagement/InvoiceInquiry");
      // }
    },

    // 日期转化
    getLocalTime1(nS) {
      let date = new Date(nS);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;
      date = year + "" + month + "" + day;
      return date;
    },

    //上传
    upload() {
      if (this.buyerName) {
      } else {
        this.$alert("购货方名称不能为空，请填写完整后重试", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        });
        return;
      }

      if (this.buyerAccount) {
      } else {
        this.$alert("购货方纳税人识别号不能为空，请填写完整后重试", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        });
        return;
      }

      if (this.salerName) {
      } else {
        this.$alert("销货方名称不能为空，请填写完整后重试", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        });
        return;
      }

      if (this.salerAccount) {
      } else {
        this.$alert("销货方纳税人识别号不能为空，请填写完整后重试", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        });
        return;
      }

      var box = JSON.parse(JSON.stringify(this.tableData));

      if (box.length > 1) {
        for (let i = 0; i < box.length; i++) {
          if (
            box[i].name == "" &&
            box[i].goodsAmount == "" &&
            box[i].taxRate == ""
          ) {
            box.splice(i, 1);
          }
        }
      }

      for (let i = 0; i < box.length; i++) {
        if (box[i].name) {
        } else {
          this.$alert("商品名称不能为空，请填写完整后重试", "提示", {
            confirmButtonText: "确定",
            type: "warning",
          });
          return;
        }

        if (box[i].goodsAmount == null) {
          this.$alert("商品金额不能为空，请填写完整后重试", "提示", {
            confirmButtonText: "确定",
            type: "warning",
          });
          return;
        }

        if (box[i].goodsAmount.toString() && box[i].goodsAmount != null) {
        } else {
          this.$alert("商品金额不能为空，请填写完整后重试", "提示", {
            confirmButtonText: "确定",
            type: "warning",
          });
          return;
        }
        if (box[i].taxRate == null) {
          this.$alert("商品税率不能为空，请填写完整后重试", "提示", {
            confirmButtonText: "确定",
            type: "warning",
          });
          return;
        }

        if (box[i].taxRate.toString() && box[i].taxRate != null) {
        } else {
          this.$alert("商品税率不能为空，请填写完整后重试", "提示", {
            confirmButtonText: "确定",
            type: "warning",
          });
          return;
        }

        if (box[i].taxAmount == null) {
          this.$alert("商品税额不能为空，请填写完整后重试", "提示", {
            confirmButtonText: "确定",
            type: "warning",
          });
          return;
        }

        if (box[i].taxAmount.toString() && box[i].taxAmount != null) {
        } else {
          this.$alert("商品税额不能为空，请填写完整后重试", "提示", {
            confirmButtonText: "确定",
            type: "warning",
          });
          return;
        }
      }

      if (this.telephone) {
      } else {
        this.$alert("联系电话不能为空，请填写完整后重试", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        });
        return;
      }
      if (this.applyTitle) {
      } else {
        this.$alert("申请理由不能为空，请填写完整后重试", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        });
        return;
      }

      if (this.isTaxIncluded == true) {
        for (let i = 0; i < box.length; i++) {
          box[i].isTax = 1;
        }
      } else {
        for (let i = 0; i < box.length; i++) {
          box[i].isTax = 0;
        }
      }
      // var b = JSON.parse(JSON.stringify(this.tableData));
      box.forEach((item) => {
        item.goodsNumber = parseFloat(item.goodsNumber) * -1;
        item.goodsAmount = parseFloat(item.goodsAmount) * -1;
        item.taxAmount = parseFloat(item.taxAmount) * -1;
        item.amount = parseFloat(item.amount) * -1;
        item.goodsPrice = parseFloat(item.goodsPrice);
        // // if(item.goodsName)
        // item.goodsName=item.goodsName?item.name:item.goodsName;
      });

      let applyParams = {
        goodsCommonDetail: box, //商品通用明细
        applyReason: this.applyReason, //申请类型 申请状态类型: 0：购方发起已抵扣 1：购方发起未抵扣 2：销方发起开票有误
        buyerName: this.buyerName, //购方名称
        buyerTaxId: this.buyerAccount, //购方税号
        sellerName: this.salerName, //销方名称
        sellerTaxId: this.salerAccount, //销方名称
        priceAmount: parseFloat(this.totalPrice.totalAmount) * -1, //合计金额
        taxAmount: parseFloat(this.totalPrice.totalTax) * -1, //合计税额
        invoiceType: this.billTypeCode, //发票类型
        invoiceNo: this.billNum, //发票号码
        invoiceCode: this.billAccount, //发票代码
        invoiceDate: null, //开票日期
        // invoiceDate:'20210329',
        invoiceId: this.invoiceId, //对应发票id
        applyPerson: this.applyName, //申请人
        reason: this.applyTitle, //申请理由
        phone: this.telephone, //联系电话
        collectionType: this.collectionType, //征收方式   0：普通征税 2：差额征税
        deviceNo: this.taxDiskNum,
        // applyType: "0", //申请类型 0 正常 1 逾期
        // taxRateFlag:'1',//多税率标志
        // uploadDate:'',//填开日期
      };
      if (this.invoiceDate) {
        applyParams.invoiceDate = this.getLocalTime1(this.invoiceDate);
      }

      this.loading = true;
      // showFullScreenLoading("上传中,请稍候");
      clearTimeout(this.timer);
      this.$alert("", "上传中,请稍候", {
        confirmButtonText: "停止上传",
        iconClass: "el-icon-loading",
        center: true,
        showClose: false,
        callback: (action) => {
          clearTimeout(this.timer);
          this.loading = false;
        },
      });
      this.redUpload(applyParams);
    },

    //上传 接口调用
    async redUpload(row) {
      const res = await redLetterUpload(row);
      if (res.code == 200) {
        if (res.data.length > 0) {
          this.key1 = res.data;
          // this.getRedis1();
          this.setInter1(3000, this.getRedis1);
        } else {
          this.loading = false;
          // tryHideFullScreenLoading();
          this.$globals.closeContent();
          this.$message({
            type: "error",
            message: res.msg,
          });
        }
      } else {
        this.loading = false;
        this.$globals.closeContent();
        // tryHideFullScreenLoading();
        // this.$message({
        //   type: "error",
        //   message: "上传失败," + res.msg,
        // });
      }
    },
    setInter1(s, fn) {
      let count = 0;
      let timeOut = (s, fn) => {
        var time1 = setTimeout(() => {
          count++;
          if (count < 60 && this.loading == true) {
            fn.call(this);
            timeOut(s, fn);
          } else if (count >= 60) {
            clearTimeout(this.timer);
            this.$globals.closeContent();
            this.$message({
              type: "error",
              message: "税局服务不稳定，请稍后再试",
            });
          } else {
            clearTimeout(this.timer);
            this.$globals.closeContent();
          }
        }, s);
        this.timer = time1;
      };
      timeOut(s, fn);
    },
    //查询请求
    async getRedis1() {
      const res = await getRedis({ key: this.key1 });
      if (res.data) {
        if (res.data.code == 1) {
          clearTimeout(this.timer);
          if (res.data.msgCode == 200) {
            // tryHideFullScreenLoading();
            this.$globals.closeContent();
            this.loading = false;
            this.$message({
              type: "success",
              message: "提交成功",
            });
            this.$router.push("/management/invoicingManagement/redLetters");
          } else {
            // tryHideFullScreenLoading();
            this.$globals.closeContent();
            this.loading = false;
            this.$message({
              type: "error",
              message: res.data.message,
            });
          }
        } else {
          this.loading = true;
        }
      } else {
        this.loading = true;
      }
    },

    // 价格
    TaxIncluded() {
      if (this.collectionType == 2) {
        // let sales = parseFloat(this.tableData[0].goodsAmount)
        let sales = parseFloat(this.sales);
        let deduction = parseFloat(this.differentialTaxationAmount);
        let taxRate = parseFloat(this.tableData[0].taxRate);
        let el = this.tableData[0];
        let taxRateStr = taxRate + "";
        if (!taxRateStr) {
          this.tableData[0].price = "";
          this.tableData[0].goodsPrice = "";
          this.tableData[0].amount = "";
          this.tableData[0].goodsAmount = "";
          return;
        }
        if (this.isTaxIncluded) {
          // 含税
          // let salesYes = (sales-deduction) * (taxRate + 1 ) + deduction
          // this.tableData[0].amount = sales ? salesYes:''
          // this.tableData[0].goodsAmount = sales ? parseFloat(salesYes.toFixed(2)):''
          let salesYes = this.sales ? this.sales : "";
          salesYes = Math.abs(salesYes);
          this.tableData[0].amount = this.sales ? salesYes : "";
          this.tableData[0].goodsAmount = this.sales
            ? parseFloat(parseFloat(salesYes).toFixed(2))
            : "";

          if (el.count && sales) {
            this.tableData[0].price = salesYes / el.count;
            this.tableData[0].goodsPrice = this.toNonExponential(
              parseFloat(this.tableData[0].price).toFixed(8)
            );
          }
        } else {
          // 不含税
          let salesNo = (sales - deduction) / (taxRate + 1) + deduction;
          salesNo = Math.abs(salesNo.toFixed(2));
          this.tableData[0].amount = sales ? salesNo : "";
          this.tableData[0].goodsAmount = sales
            ? parseFloat(parseFloat(salesNo).toFixed(2))
            : "";

          if (el.count && sales) {
            this.tableData[0].price = salesNo / el.count;
            this.tableData[0].goodsPrice = this.toNonExponential(
              parseFloat(this.tableData[0].price).toFixed(8)
            );
          }
        }
        this.computerTotalPrice();
        return;
      }

      if (this.isTaxIncluded) {
        // 含税
        for (let i = 0; i < this.tableData.length; i++) {
          const el = this.tableData[i];
          if (el.goodsPrice || el.goodsAmount) {
            if (el.goodsPrice && el.taxRate) {
              let prices = parseFloat(el.price);
              let taxRates = parseFloat(el.taxRate);
              let resPrice = prices * (taxRates + 1);
              this.tableData[i].price = resPrice;
              // this.tableData[i].goodsPrice = this.checkNum(resPrice, 9, 8);
              this.tableData[i].goodsPrice = this.toNonExponential(
                parseFloat(resPrice.toFixed(8))
              );
            }
            if (el.goodsAmount && el.taxRate) {
              let amounts = parseFloat(el.amount);
              let taxRates = parseFloat(el.taxRate);
              let resAmount = amounts * (taxRates + 1);
              this.tableData[i].amount = resAmount;
              // this.tableData[i].goodsAmount = this.checkNum(resAmount, 9, 2);
              this.tableData[i].goodsAmount = resAmount.toFixed(2);
            }
          }
        }
        this.computerTotalPrice();
      } else {
        // 不含税
        for (let i = 0; i < this.tableData.length; i++) {
          const el = this.tableData[i];
          if (el.goodsPrice || el.goodsAmount) {
            if (el.goodsPrice && el.taxRate) {
              let taxRates = parseFloat(el.taxRate);
              let resPrice = parseFloat(el.price) / (taxRates + 1);
              this.tableData[i].price = resPrice;
              // this.tableData[i].goodsPrice = this.checkNum(resPrice, 9, 8);
              this.tableData[i].goodsPrice = this.toNonExponential(
                parseFloat(resPrice.toFixed(8))
              );
            }
            if (el.goodsAmount && el.taxRate) {
              let taxRates = parseFloat(el.taxRate);
              let resAmount = parseFloat(el.amount) / (taxRates + 1);
              this.tableData[i].amount = resAmount;
              // this.tableData[i].goodsAmount = this.checkNum(resAmount, 9, 2);
              this.tableData[i].goodsAmount = resAmount.toFixed(2);
            }
          }
        }
        this.computerTotalPrice();
      }
      console.log("...", this.tableData);
    },

    // 差额征收
    setDifferenceCancel() {
      if (!this.editDifference) {
        this.tableData[0] = JSON.parse(JSON.stringify(this.tableData_el));
      }
      this.differenceVisible = false;
    },
    setDifferenceDetermine(val) {
      console.log("差额", val);
      if (this.editDifference === true) {
        this.editDifference = false;
      }
      let sales = parseFloat(val.sales);
      let deduction = parseFloat(val.deduction);
      let taxRate = this.tableData[0].taxRate
        ? parseFloat(this.tableData[0].taxRate)
        : "";
      if (this.isTaxIncluded) {
        // 含税
        this.tableData[0].amount = sales;
        this.tableData[0].goodsAmount = sales.toFixed(2);
        let res = ((sales - deduction) * taxRate) / (taxRate + 1);
        this.tableData[0].taxRate = taxRate ? res.toFixed(2) : "";
        // this.tableData[0].taxRate = taxRate ? res : "";
        if (this.tableData[0].amount && this.tableData[0].goodsPrice) {
          if (this.tableData[0].count === "") {
            //没有数量 根据金额和单价计算数量
            let resCount =
              Number(this.tableData[0].amount) /
              Number(this.tableData[0].goodsPrice);
            this.tableData[0].count = parseFloat(resCount.toFixed(6));
          } else {
            //存在数量 根据金额重新计算单价
            let counts = parseFloat(this.tableData[0].count);
            let amounts = parseFloat(this.tableData[0].amount);
            let resPrice = amounts / counts;
            this.tableData[0].price = resPrice;
            this.tableData[0].goodsPrice = this.toNonExponential(
              parseFloat(resPrice.toFixed(8))
            );
          }
        }
      } else {
        // 不含税
        let salesNo = (sales - deduction) / (taxRate + 1) + deduction;
        this.tableData[0].amount = salesNo;
        this.tableData[0].goodsAmount = salesNo.toFixed(2);
        let res = ((sales - deduction) * taxRate) / (taxRate + 1);
        this.tableData[0].taxRate = taxRate ? res.toFixed(2) : "";
        // this.tableData[0].taxRate = taxRate ? res : "";
        if (this.tableData[0].amount && this.tableData[0].goodsPrice) {
          if (this.tableData[0].count === "") {
            //没有数量 根据金额和单价计算数量
            let resCount =
              Number(this.tableData[0].amount) /
              Number(this.tableData[0].goodsPrice);
            this.tableData[0].count = parseFloat(resCount.toFixed(6));
          } else {
            //存在数量 根据金额重新计算单价
            let counts = parseFloat(this.tableData[0].count);
            let amounts = parseFloat(this.tableData[0].amount);
            let resPrice = amounts / counts;
            this.tableData[0].price = resPrice;
            this.tableData[0].goodsPrice = this.toNonExponential(
              parseFloat(resPrice.toFixed(8))
            );
          }
        }
      }
      // 差额征收扣除额
      this.differentialTaxationAmount = deduction;
      // this.sellerForm.remarks = "差额征税：" + deduction + "。";
      // this.remarkNote = this.sellerForm.remarks;
      this.sales = sales ? sales : "";

      // this.computerTaxs(0)
      this.computerTotalPrice();
      this.differenceVisible = false;
    },
    // 客户联想框
    inputCustomName(event) {
      // this.customLenovoIndexBox = index;
      this.customLenovoVisible = false;
      let dom = this.$refs["customLenovo"];
      let parHeight = event.currentTarget.getBoundingClientRect().y - 10;
      dom.style.top = parHeight + "px";
    },
    watchCustomName() {
      let _this = this;
      if (_this.salerName.length > 3) {
        _this.customdataList = [];
        clearTimeout(_this.timer);
        _this.timer = setTimeout(function () {
          _this.customLenovoAjax();
        }, 2000);

        // _this.customLenovoVisible = true;
      } else {
        _this.customLenovoVisible = false;
      }
    },
    customLenovolenovoDetermine(item) {
      // console.log(item);
      this.customLenovoVisible = false;
      this.salerName = item.customerName ? item.customerName : "";
      this.salerAccount = item.taxId ? item.taxId : "";
    },
    customLenovoAjax() {
      let params = {
        customerName: this.salerName,
        companyId: this.$store.state.user.loginInfo.companyId, //公司id
      };
      var that = this;

      customLenovo(params)
        .then((response) => {
          if (response && response.code == "200") {
            let res = response.data;
            if (res.length > 0) {
              that.customdataList = res;
              that.customLenovoVisible = true;
              // that.LenovoBoxVisible = true;
            } else {
              that.customLenovoVisible = false;
            }
          }
        })
        .catch((error) => {});
    },

    // 商品参数处理
    toDealGoods(val) {
      let obj = { ...this.tableData_el, ...val };
      let shortName = val.taxClassificationShortName
        ? val.taxClassificationShortName
        : val.goodsShortName;
      obj.name = "*" + shortName + "*" + val.goodsName;
      obj.model = val.specifications;
      obj.goodsCode = item.taxClassificationCode;

      // obj.unit = ''
      // obj.count = ''
      obj.price = val.goodsPrice;
      obj.goodsPrice = val.goodsPrice;
      obj.taxRate = item.taxRate;
      this.taxRateSelect.forEach((item1) => {
        if (obj.taxRate !== item1.value) {
          this.taxRateSelect.push({
            value: obj.taxRate,
            label: Number(obj.taxRate) * 100 + "%",
          });
        }
      });
      this.taxRateSelect = this.unique(
        this.taxRateSelect.sort(createComprisonFunction("value"))
      );

      // if (
      //     this.taxRateSelect.some((item1) => {
      //       return item1.value == item.taxRate;
      //     }) == true
      //   ) {
      //     obj.taxRate = this.toDealTaxRate(obj.taxRate);
      //   } else {
      //     obj.taxRate = null;
      //   }
      // obj.amount = ''
      // obj.goodsAmount = ''

      // obj.tax = ''
      // if (obj.taxRate == 0 && obj.zeroTaxMarks) {
      //   obj.disSelectFlag = true;
      // } else {
      //   obj.disSelectFlag = false;
      // }

      // if (!obj.taxRate && this.collectionType != 1) {
      //   obj.taxRate = 0;
      // }

      // if (val.fastFlag == 1 || val.fastFlag == 2 || val.fastFlag == 3) {
      //   obj.isPermanent = true;
      // } else {
      //   obj.isPermanent = false;
      // }

      // if (obj.taxRate == 0) {
      //     obj.taxRate = ''
      // }

      if (this.isTaxIncluded) {
        // 页面为含税
        if (val.isTax == 1) {
          // 数据为含税
          if (obj.goodsPrice && obj.taxRate) {
            let prices = parseFloat(obj.price);
            let taxRates = parseFloat(obj.taxRate);
            // let resPrice = prices * (taxRates + 1)
            let resPrice = prices;
            obj.price = resPrice;
            obj.goodsPrice = this.toNonExponential(
              parseFloat(resPrice.toFixed(8))
            );
            // obj.goodsPrice = this.checkNum(resPrice, 9, 8)
          }
        } else {
          // 数据为不含税
          if (obj.goodsPrice && obj.taxRate) {
            let taxRates = parseFloat(obj.taxRate);
            let resPrice = parseFloat(obj.price) * (taxRates + 1);
            obj.price = resPrice;
            obj.goodsPrice = this.toNonExponential(
              parseFloat(resPrice.toFixed(8))
            );
            // obj.goodsPrice = this.checkNum(resPrice, 9, 8)
          }
        }
      } else {
        // 页面为不含税
        if (val.isTax == 1) {
          // 数据为含税
          if (obj.goodsPrice && obj.taxRate) {
            let prices = parseFloat(obj.price);
            let taxRates = parseFloat(obj.taxRate);
            let resPrice = prices / (taxRates + 1);
            obj.price = resPrice;
            obj.goodsPrice = this.toNonExponential(
              parseFloat(resPrice.toFixed(8))
            );
            // obj.goodsPrice = this.checkNum(resPrice, 9, 8)
          }
        } else {
          // 数据为不含税
          if (obj.goodsPrice && obj.taxRate) {
            let taxRates = parseFloat(obj.taxRate);
            // let resPrice = parseFloat(val.price) / (taxRates + 1)
            let resPrice = parseFloat(obj.price);
            obj.price = resPrice;
            obj.goodsPrice = this.toNonExponential(
              parseFloat(resPrice.toFixed(8))
            );
            // obj.goodsPrice = this.checkNum(resPrice, 9, 8)
          }
        }
      }
      return JSON.parse(JSON.stringify(obj));
    },
    // 税率判断-商品数据处理
    toDealTaxRate(taxRate) {
      //this.taxRateSelect
      //this.taxRateSelect_el
      let res = "";
      for (let i = 0; i < this.taxRateSelect.length; i++) {
        const el = this.taxRateSelect[i];
        if (el.value == taxRate) {
          res = parseFloat(taxRate);
          break;
        }
      }
      if (this.taxMethodVal == 1) {
        res = 0.015;
      }
      return res;
    },
    // 商品联想框
    inputName(event, index) {
      this.indexBox = index;
      this.LenovoBoxVisible = false;
      let dom = this.$refs["LenovoBox"];
      let parHeight = event.currentTarget.getBoundingClientRect().y - 10;
      dom.style.top = parHeight + "px";
    },
    watchName(item, index) {
      let _this = this;
      if (_this.tableData[index].name) {
        _this.dataList = [];
        clearTimeout(_this.timer);
        _this.timer = setTimeout(function () {
          _this.lenovoAjax(index);
        }, 2000);

        // _this.LenovoBoxVisible = true;
      } else {
        _this.LenovoBoxVisible = false;
      }
    },
    lenovoDetermine(item) {
      console.log("lenovo", item, this.indexBox);
      // let obj = this.toDealGoods(item)
      // this.tableData.splice(this.indexBox, 1, obj);

      if (this.collectionType == 2) {
        let objs = item;
        objs.fastFlag = 0;
        let obj = this.toDealGoods(objs);
        obj.price = "";
        obj.goodsPrice = "";
        obj.amount = "";
        obj.goodsAmount = "";
        obj.tax = "";
        obj.taxRate = "";
        this.tableData.splice(this.indexBox, 1, obj);
        this.differenceVisible = true;
        this.LenovoBoxVisible = false;
      } else {
        let obj = {
          createTime: "", //创建时间
          incentivesLabel: "", //优惠政策
          goodsShortName: "", //税收分类简称
          name: "", //展示名字
          goodsName: "", //商品名称
          specifications: "", //规格型号
          unit: "", //单位
          goodsNumber: "", //商品数量
          price: "",
          goodsPrice: "", //商品单价
          amount: "",
          goodsAmount: "", //商品金额
          taxRate: "", //税率
          taxAmount: "", //税额
          goodsSelfCode: "", //商品自行编码
          zeroTaxMarks: "", //标识零税率
          goodsCode: "", //商品编码
        };
        var shortName = item.taxClassificationShortName
          ? item.taxClassificationShortName
          : item.goodsShortName;
        if (shortName) {
          obj.name = "*" + shortName + "*" + item.goodsName;
        } else {
          obj.name = "**" + item.goodsName;
        }
        obj.goodsName = item.goodsName;
        obj.specifications = item.specifications;
        obj.goodsPrice = item.goodsPrice;
        obj.price = item.goodsPrice;
        obj.unit = item.unit;
        obj.createTime = item.createTime;
        obj.goodsSelfCode = item.goodsSelfCode;
        obj.goodsShortName = item.taxClassificationShortName;
        obj.incentivesLabel = item.incentivesLabel;
        obj.zeroTaxMarks = item.zeroTaxMarks;

        // if (
        //   this.taxRateSelect.some((item1) => {
        //     return item1.value == item.taxRate;
        //   }) == true
        // ) {
        //   obj.taxRate = item.taxRate;
        // } else {
        //   obj.taxRate = null;
        // }
        obj.taxRate = item.taxRate;
        this.taxRateSelect.forEach((item1) => {
          if (obj.taxRate !== item1.value) {
            this.taxRateSelect.push({
              value: obj.taxRate,
              label: Number(obj.taxRate) * 100 + "%",
            });
          }
        });
        this.taxRateSelect = this.unique(
          this.taxRateSelect.sort(createComprisonFunction("value"))
        );

        // console.log()
        // this.taxRateSelect.forEach((item1)=>{})
        this.tableData.splice(this.indexBox, 1, obj);
        this.LenovoBoxVisible = false;
      }
    },
    lenovoAjax(index) {
      let params = {
        goodsName: this.tableData[index].name,
        taxDiskNumber: this.taxDiskNum, //税控盘编号
      };
      var that = this;

      lenovo(params)
        .then((response) => {
          if (response && response.code == "200") {
            let res = response.data;
            if (res.length > 0) {
              that.dataList = res;
              that.LenovoBoxVisible = true;
            } else {
              that
                .$confirm(
                  "未查询到符合条件的商品, 点击“确定”快速新增商品。",
                  "提示",
                  {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                  }
                )
                .then(() => {
                  this.selectProduct("", index);
                  // that.autoCodeAjax(index);
                  // that.LenovoBoxVisible = true;
                  // that.LenovoBoxVisible = false;
                  // that.tableData[index].name = "";
                })
                .catch(() => {
                  that.$message({
                    type: "info",
                    message: "已取消新增商品",
                  });
                  that.LenovoBoxVisible = false;
                  that.tableData[index].name = "";
                });
            }
          }
        })
        .catch((error) => {});
    },
    // autoCodeAjax(index) {
    //   let params = {
    //     goodsName: this.tableData[index].name,
    //   };
    //   var that = this;
    //   autoCode(params)
    //     .then((response) => {
    //       if (response && response.code == "200") {
    //         let res = response.data;
    //         if (res.length > 0) {
    //           that.dataList = res;
    //           // const el = res[0]
    //           // this.tableData[index].name = '*' + el.goodsShortName + '*' + el.goodsName
    //         } else {
    //           that.$message({
    //             type: "info",
    //             message: "智能赋码失败，请手动选择税收编码!",
    //           });
    //           that.tableData[index].name = "";
    //           that.LenovoBoxVisible = false;
    //         }
    //       } else {
    //         that.$message({
    //           type: "info",
    //           message: "新增商品失败!",
    //         });
    //         that.tableData[index].name = "";
    //         that.LenovoBoxVisible = false;
    //       }
    //     })
    //     .catch((error) => {});
    // },

    // 双击选择商品
    selectProduct(item, index) {
      this.selectProductVisible = true;
      this.selectIndex = index;
    },
    // 商品组件Cancel
    selectProductCancel() {
      this.selectProductVisible = false;
    },
    // 商品组件Determine
    selectProductDetermine(val, index) {
      console.log("val", val);
      this.selectProductVisible = false;

      // 差额征税--弹框
      if (this.collectionType == 2) {
        // ---------------------需商品页面限制只能选一条数据
        let objs = val[0];
        objs.fastFlag = 0;
        let obj = this.toDealGoods(objs);
        obj.price = "";
        obj.goodsPrice = "";
        obj.amount = "";
        obj.goodsAmount = "";
        obj.tax = "";
        obj.taxRate = "";
        this.tableData.splice(index, 1, obj);
        this.differenceVisible = true;
        return;
      }

      // console.log(this.tableData[this.selectIndex]);
      val.forEach((item, index1) => {
        let obj = {
          createTime: "", //创建时间
          incentivesLabel: "", //优惠政策
          goodsShortName: "", //税收分类简称
          name: "", //展示名字
          goodsName: "", //商品名称
          specifications: "", //规格型号
          unit: "", //单位
          goodsNumber: "", //商品数量
          price: "",
          goodsPrice: "", //商品单价
          amount: "",
          goodsAmount: "", //商品金额
          taxRate: "", //税率
          taxAmount: "", //税额
          goodsSelfCode: "", //商品自行编码
          zeroTaxMarks: "", //标识零税率
          goodsCode: "", //商品编码
        };
        var shortName = item.taxClassificationShortName
          ? item.taxClassificationShortName
          : item.goodsShortName;
        if (shortName) {
          obj.name = "*" + shortName + "*" + item.goodsName;
        } else {
          obj.name = "**" + item.goodsName;
        }
        obj.goodsName = item.goodsName;
        obj.goodsCode = item.taxClassificationCode;
        obj.specifications = item.specifications;
        obj.goodsPrice = item.goodsPrice;
        obj.price = item.goodsPrice;
        obj.unit = item.unit;
        obj.createTime = item.createTime;
        obj.goodsSelfCode = item.goodsSelfCode;
        obj.goodsShortName = item.taxClassificationShortName;
        obj.incentivesLabel = item.incentivesLabel;
        obj.zeroTaxMarks = item.zeroTaxMarks;
        obj.taxRate = item.taxRate;
        this.taxRateSelect.forEach((item1) => {
          if (obj.taxRate !== item1.value) {
            this.taxRateSelect.push({
              value: obj.taxRate,
              label: Number(obj.taxRate) * 100 + "%",
            });
          }
        });
        this.taxRateSelect = this.unique(
          this.taxRateSelect.sort(createComprisonFunction("value"))
        );
        // if (
        //   this.taxRateSelect.some((item1) => {
        //     return item1.value == item.taxRate;
        //   }) == true
        // ) {
        //   obj.taxRate = item.taxRate;
        // } else {
        //   obj.taxRate = null;
        //   obj.taxAmount = null;
        // }
        // console.log()
        // this.taxRateSelect.forEach((item1)=>{})
        this.tableData.splice(index + index1, 1, obj);
      });
    },

    // 商品表单数据字符长度校验----规格型号
    watchSpecifications(item, index) {
      let obj = validStrCheckLengthTextarea(
        this.tableData[index].specifications,
        40
      );
      console.log(
        "specifications",
        this.tableData[index].specifications.length,
        obj
      );
      if (!obj.flag) {
        if (obj.len) {
          this.tableData[index].specifications = this.tableData[
            index
          ].specifications.substring(0, obj.len);
        }
      }
    },

    watchUnit(item, index) {
      let obj = validStrCheckLengthTextarea(this.tableData[index].unit, 30);
      console.log("unit", this.tableData[index].unit.length, obj);
      if (!obj.flag) {
        if (obj.len) {
          this.tableData[index].unit = this.tableData[index].unit.substring(
            0,
            obj.len
          );
        }
      }
    },

    // 商品表单计算--------------------------------------
    watchCount(item, index) {
      //格式校验
      let num = this.checkNum(this.tableData[index].goodsNumber, 9, 6);
      this.tableData[index].goodsNumber = num;
      console.log("格式count", num);

      let counts = parseFloat(this.tableData[index].goodsNumber);
      let prices = parseFloat(this.tableData[index].price);
      let amounts = parseFloat(this.tableData[index].amount);
      if (counts && prices && amounts) {
        if (this.collectionType == 2) {
          let resPrice = amounts / counts;
          this.tableData[index].price = resPrice;
          this.tableData[index].goodsPrice = this.toNonExponential(
            parseFloat(resPrice.toFixed(8))
          );
          return;
        }
        this.computerAmounts(index, counts, prices);
        if (this.tableData[index].taxRate) {
          this.computerTaxs(index);
        }
        // this.computerTaxs(index);
      } else {
        if (counts && prices) {
          // 数量、单价
          let resAmount = counts * prices;
          this.tableData[index].amount = resAmount;
          this.tableData[index].goodsAmount = this.checkNum(resAmount, 9, 2);
          // this.computerTaxs(index);
          // if (this.tableData[index].taxRate) {
          this.computerTaxs(index);
          // }
        } else if (counts && amounts) {
          // 数量、金额
          let resPrice = amounts / counts;
          this.tableData[index].price = resPrice;
          this.tableData[index].goodsPrice = this.toNonExponential(
            parseFloat(resPrice.toFixed(8))
          );
          // this.computerTaxs(index);
          // if (this.tableData[index].taxRate) {
          this.computerTaxs(index);
          // }
        } else if (!counts) {
          // this.tableData[index].amount = "";
          // this.tableData[index].goodsAmount = this.tableData[index].amount;
          // this.computerTaxs(index);

          if (this.collectionType == 2) {
            this.tableData[index].price = "";
            this.tableData[index].goodsPrice = this.tableData[index].price;
            // this.computerTaxs(index)
          } else {
            this.tableData[index].amount = "";
            this.tableData[index].goodsPrice = this.tableData[index].amount;
            // this.computerTaxs(index);
            // if (this.tableData[index].taxRate) {
            this.computerTaxs(index);
            // }
          }
        }
      }
      // this.computerTaxs(index)
    },
    watchPrice(item, index) {
      //格式校验
      let num = this.checkNum(this.tableData[index].goodsPrice, 9, 8);
      this.tableData[index].goodsPrice = num;
      console.log("格式price", num);

      this.tableData[index].price = this.tableData[index].goodsPrice;
      this.tableData[index].amount = this.tableData[index].goodsAmount;

      let counts = parseFloat(this.tableData[index].goodsNumber);
      let prices = parseFloat(this.tableData[index].price);
      let amounts = parseFloat(this.tableData[index].amount);
      if (counts && prices && amounts) {
        this.computerAmounts(index, counts, prices);
        // this.computerTaxs(index);
      } else {
        if (prices && counts) {
          // 单价、数量
          let resAmount = counts * prices;
          this.tableData[index].amount = resAmount;
          this.tableData[index].goodsAmount = this.checkNum(resAmount, 9, 2);
          // this.computerTaxs(index);
        } else if (prices && amounts) {
          // 单价、金额(数量不存在)
          this.tableData[index].amount = "";
          this.tableData[index].goodsAmount = this.tableData[index].amount;
          // this.computerTaxs(index);
        } else if (!prices) {
          this.tableData[index].amount = "";
          this.tableData[index].goodsAmount = this.tableData[index].amount;
          // this.computerTaxs(index);
        }
      }
      // if (this.tableData[index].taxRate) {
      this.computerTaxs(index);
      // }
    },
    watchAmount(item, index) {
      //格式校验
      let num = this.checkNum(this.tableData[index].goodsAmount, 9, 2);
      this.tableData[index].goodsAmount = num;

      this.tableData[index].price = this.tableData[index].goodsPrice;
      this.tableData[index].amount = this.tableData[index].goodsAmount;

      let counts = parseFloat(this.tableData[index].goodsNumber);
      let prices = parseFloat(this.tableData[index].price);
      let amounts = parseFloat(this.tableData[index].amount);
      if (counts && prices && amounts) {
        if (this.tableData[index].isBlur) {
          //已失焦，算price
          let resPrice = amounts / counts;
          this.tableData[index].price = resPrice;
          this.tableData[index].goodsPrice = this.toNonExponential(
            parseFloat(resPrice.toFixed(8))
          );
        } else {
          //默认未失焦，算count
          let resCount = amounts / prices;
          this.tableData[index].goodsNumber = this.checkNum(resCount, 9, 6);
        }
        // this.computerTaxs(index)
      } else {
        if (amounts && counts) {
          // 金额、数量
          let resPrice = amounts / counts;
          this.tableData[index].price = resPrice;
          this.tableData[index].goodsPrice = this.toNonExponential(
            parseFloat(resPrice.toFixed(8))
          );
          // this.computerTaxs(index)
        } else if (amounts && prices) {
          // 金额、单价(数量不存在)
          let resCount = amounts / prices;
          this.tableData[index].goodsNumber = this.toNonExponential(
            parseFloat(resCount.toFixed(8))
          );
          this.tableData[index].goodsPrice = this.tableData[index].price;
          // this.computerTaxs(index)
        } else if (!amounts) {
          this.tableData[index].goodsNumber = "";
          this.tableData[index].goodsPrice = this.tableData[index].price;
          // this.computerTaxs(index)
        }
      }

      // if (this.tableData[index].taxRate.toString()) {
      this.computerTaxs(index);
      // }
    },

    // 金额栏-失焦事件
    blurAmount(item, index) {
      if (this.tableData[index].goodsNumber) {
        this.tableData[index].isBlur = true;
      }
    },

    // 计算金额方法
    computerAmounts(index, counts, prices) {
      let amounts = counts * prices;
      this.tableData[index].amount = amounts;
      this.tableData[index].goodsAmount = this.checkNum(amounts, 9, 2);
    },
    // 计算税额方法
    computerTaxs(index) {
      // 差额征收
      console.log(this.tableData);
      if (this.collectionType == 2) {
        let el = this.tableData[index];
        let taxRateStr = el.taxRate + "";
        if (!taxRateStr || !el.goodsAmount) return;
        let taxRate = parseFloat(el.taxRate);
        let deduction = this.differentialTaxationAmount
          ? parseFloat(this.differentialTaxationAmount)
          : 0;

        if (this.isTaxIncluded) {
          // 含税
          let sales = parseFloat(el.goodsAmount);
          let res = ((sales - deduction) * taxRate) / (taxRate + 1);
          // this.tableData[index].taxAmount = res;
          this.tableData[index].taxAmount = res.toFixed(2);
        } else {
          // 不含税
          // let amounts = parseFloat(el.amount)
          // let sales = (amounts-deduction) * (taxRate + 1 ) + deduction
          // let res = (sales-deduction) * taxRate / (taxRate + 1 )
          // this.tableData[index].taxC = res
          // this.tableData[index].tax = res.toFixed(2)

          let sales = this.sales;
          let salesNo = (sales - deduction) / (taxRate + 1) + deduction;
          this.tableData[0].amount = sales ? salesNo : "";
          this.tableData[0].goodsAmount = sales
            ? parseFloat(salesNo.toFixed(2))
            : "";
          if (el.count && sales) {
            this.tableData[0].price = salesNo / el.count;
            this.tableData[0].goodsPrice = this.toNonExponential(
              parseFloat(this.tableData[0].price.toFixed(8))
            );
          }
          let res = ((sales - deduction) * taxRate) / (taxRate + 1);
          // this.tableData[index].taxAmount = res;
          this.tableData[index].taxAmount = res.toFixed(2);
        }
      } else if (this.collectionType == 1) {
        // 减按征收
        let el = this.tableData[index];
        let taxs = "";
        let taxRateStr = el.taxRate + "";
        if (!taxRateStr || !el.goodsAmount) return;
        let taxRates = parseFloat(el.taxRate);
        let amounts = parseFloat(el.amount);

        if (this.isTaxIncluded) {
          // 含税
          taxs = (amounts * taxRates) / (0.05 + 1);
          // this.tableData[index].taxAmount = taxs;
          this.tableData[index].taxAmount = taxs.toFixed(2);
        } else {
          // 不含税
          taxs = amounts * taxRates;
          // this.tableData[index].taxAmount = taxs;
          this.tableData[index].taxAmount = taxs.toFixed(2);
        }
      } else {
        let taxs = "";
        let taxRateStr = this.tableData[index].taxRate + "";
        if (taxRateStr && this.tableData[index].amount) {
          let taxRates = parseFloat(this.tableData[index].taxRate);
          let amounts = parseFloat(this.tableData[index].amount);
          if (this.isTaxIncluded) {
            // 含税
            taxs = (amounts * taxRates) / (taxRates + 1);
            this.tableData[index].taxAmount = taxs.toFixed(2);
            console.log("含税", taxs);
          } else {
            // 不含税
            taxs = amounts * taxRates;
            this.tableData[index].taxAmount = taxs.toFixed(2);
            console.log("不含税");
          }
        } else {
          this.tableData[index].taxAmount = "";
        }
      }
      this.computerTotalPrice();
    },
    // 科学计数法---转化
    toNonExponential(num) {
      var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
      return num.toFixed(Math.max(0, (m[1] || "").length - m[2]));
    },

    // 商品价格合计
    computerTotalPrice() {
      // let arr = this.tableData;
      // let totalAmount = 0;
      // let totalTax = 0;
      // if (this.isTaxIncluded) {
      //   // 含税
      //   for (let i = 0; i < arr.length; i++) {
      //     const el = arr[i];
      //     if (el.amount && el.taxRate) {
      //       let amounts = parseFloat(el.amount);
      //       let taxRates = parseFloat(el.taxRate);
      //       let resAmount = (amounts / (taxRates + 1)).toFixed(2);
      //       totalAmount = parseFloat(resAmount) + parseFloat(totalAmount);
      //     } else if (el.goodsAmount && !el.taxAmount) {
      //       this.totalPrice.totalTax = "";
      //       this.totalPrice.totalAmount = "";
      //       return;
      //     }
      //   }
      // } else {
      //   // 不含税
      //   for (let i = 0; i < arr.length; i++) {
      //     const el = arr[i];
      //     if (el.goodsAmount) {
      //       let resAmount =
      //         parseFloat(el.goodsAmount) + parseFloat(totalAmount);
      //       totalAmount = parseFloat(resAmount).toFixed(2);
      //     }
      //   }
      // }
      // // 不含税金额合计
      // if (totalAmount == 0) {
      //   this.totalPrice.totalAmount = "";
      // } else {
      //   this.totalPrice.totalAmount = parseFloat(totalAmount).toFixed(2);
      // }

      // for (let i = 0; i < arr.length; i++) {
      //   const el = arr[i];
      //   if (el.amount && el.taxAmount) {
      //     totalTax = parseFloat(el.taxAmount) + parseFloat(totalTax);
      //   } else if (el.goodsAmount && !el.taxAmount) {
      //     this.totalPrice.totalTax = "";
      //     this.totalPrice.totalAmount = "";
      //     return;
      //   }
      // }
      // // 税额合计
      // this.totalPrice.totalTax = totalTax.toFixed(2);

      // // 价税合计（大小写）
      // let int = Math.abs(this.totalPrice.totalAmount);
      // let resTotal = parseFloat(int) + parseFloat(this.totalPrice.totalTax);
      // this.totalPrice.priceTaxSmall =
      //   totalAmount == 0 ? "" : parseFloat(resTotal).toFixed(2);
      // this.totalPrice.priceTaxBig = convertCurrency(
      //   this.totalPrice.priceTaxSmall
      // );
      // this.totalPrice.totalAmount='-'+this.totalPrice.totalAmount

      let arr = this.tableData;
      let totalAmount = 0;
      let totalTax = 0;

      for (let i = 0; i < arr.length; i++) {
        const el = arr[i];
        let taxStr = el.taxAmount + "";
        if (el.goodsAmount && taxStr) {
          let taxs = parseFloat(el.taxAmount);
          totalTax = taxs + parseFloat(totalTax);
        } else if (el.goodsAmount && !taxStr) {
          this.totalPrice.totalTaxC = "";
          this.totalPrice.totalTax = "";
          this.totalPrice.totalAmountC = "";
          this.totalPrice.totalAmount = "";
          return;
        }
      }
      // 税额合计
      this.totalPrice.totalTaxC = totalTax;
      this.totalPrice.totalTax = totalTax.toFixed(2);
      // this.totalPrice.totalTax = this.routeList.type == "fapiaochaxun-fushu" ? '-'+totalTax.toFixed(2):totalTax.toFixed(2)

      // 差额征收
      if (this.collectionType == 2) {
        let el = this.tableData[0];
        let taxRateStr = el.taxRate + "";
        if (!taxRateStr) return;
        if (!el.goodsAmount) return;
        let taxRate = parseFloat(el.taxRate);
        let deduction = this.differentialTaxationAmount
          ? parseFloat(this.differentialTaxationAmount)
          : 0;
        deduction = deduction;
        if (this.isTaxIncluded) {
          // 含税
          let sales = parseFloat(el.goodsAmount);
          let res = (sales - deduction) / (taxRate + 1) + deduction;
          totalAmount = res;
        } else {
          // 不含税
          totalAmount = parseFloat(el.goodsAmount);
        }
      } else if (this.collectionType == 1) {
        if (this.isTaxIncluded) {
          // 含税
          for (let i = 0; i < arr.length; i++) {
            const el = arr[i];
            let taxRateStr = el.taxRate + "";
            if (el.amount && taxRateStr) {
              let amounts = parseFloat(el.goodsAmount);
              let resAmount = amounts.toFixed(2);
              totalAmount = parseFloat(resAmount) + parseFloat(totalAmount);
            } else if (el.goodsAmount && !el.taxRate) {
              this.totalPrice.totalTaxC = "";
              this.totalPrice.totalTax = "";
              this.totalPrice.totalAmountC = "";
              this.totalPrice.totalAmount = "";
              return;
            }
          }
        } else {
          // 不含税
          for (let i = 0; i < arr.length; i++) {
            const el = arr[i];
            if (el.goodsAmount) {
              let amounts = parseFloat(el.goodsAmount);
              let resAmount = amounts + parseFloat(totalAmount);
              console.log(el, el.goodsAmount, resAmount);
              totalAmount = parseFloat(resAmount);
            }
          }
        }
      } else {
        if (this.isTaxIncluded) {
          // 含税
          for (let i = 0; i < arr.length; i++) {
            const el = arr[i];
            let taxRateStr = el.taxRate + "";
            if (el.amount && taxRateStr) {
              let amounts = parseFloat(el.goodsAmount);
              let taxRates = parseFloat(el.taxRate);
              let resAmount = (amounts / (taxRates + 1)).toFixed(2);
              console.log(el, amounts, taxRates, resAmount);
              totalAmount = parseFloat(resAmount) + parseFloat(totalAmount);
            } else if (el.goodsAmount && !el.taxRate) {
              this.totalPrice.totalTaxC = "";
              this.totalPrice.totalTax = "";
              this.totalPrice.totalAmountC = "";
              this.totalPrice.totalAmount = "";
              return;
            }
          }
        } else {
          // 不含税
          for (let i = 0; i < arr.length; i++) {
            const el = arr[i];
            if (el.goodsAmount) {
              let amounts = parseFloat(el.goodsAmount);
              let resAmount = amounts + parseFloat(totalAmount);
              console.log(el, el.goodsAmount, resAmount);
              totalAmount = parseFloat(resAmount);
            }
          }
        }
      }
      // 不含税金额合计
      if (totalAmount == 0) {
        this.totalPrice.totalAmountC = "";
        this.totalPrice.totalAmount = "";
        this.totalPrice.totalTaxC = "";
        this.totalPrice.totalTax = "";
      } else {
        if (this.collectionType == 1) {
          let resTotalJA = parseFloat(totalAmount) - parseFloat(totalTax);
          this.totalPrice.totalAmountC = parseFloat(resTotalJA);
          this.totalPrice.totalAmount = parseFloat(resTotalJA).toFixed(2);
        } else {
          this.totalPrice.totalAmountC = parseFloat(totalAmount);
          this.totalPrice.totalAmount = parseFloat(totalAmount).toFixed(2);
        }
      }

      // 价税合计（大小写）
      if (this.collectionType == 1) {
        this.totalPrice.priceTaxSmallC =
          totalAmount == 0 ? "" : parseFloat(totalAmount);
        this.totalPrice.priceTaxSmall =
          totalAmount == 0 ? "" : parseFloat(totalAmount).toFixed(2);
      } else {
        let resTotal = parseFloat(totalAmount) + parseFloat(totalTax);
        this.totalPrice.priceTaxSmallC =
          totalAmount == 0 ? "" : parseFloat(resTotal);
        this.totalPrice.priceTaxSmall =
          totalAmount == 0 ? "" : parseFloat(resTotal).toFixed(2);
      }

      this.totalPrice.priceTaxBig = convertCurrency(
        Math.abs(this.totalPrice.priceTaxSmall)
      );

      console.log(
        this.totalPrice.totalAmount,
        this.totalPrice.totalTax,
        this.totalPrice.priceTaxSmall
      );
    },

    // 校验数字长度-- data待校验数据 / len1整数最大长度 / len2小数长度 --返回符合长度要求的字符串
    checkNum(data, len1, len2) {
      let str = data + "";
      if (str) {
        let num = this.validDotNum(str);
        if (num > 1) {
          return "";
        }
        if (num == 1) {
          if (str.indexOf(".") != 0 && str.indexOf(".") != str.length - 1) {
            let res = this.validFloatDate(str, len1, len2);
            console.log("res", res);
            return res;
          } else if (str.indexOf(".") == str.length - 1) {
            return str;
          } else {
            return "";
          }
        }
        if (num == 0) {
          //整数首位为0
          if (str.length > 1 && str.charAt(0) == 0) {
            return "";
          }
          //整数
          if (str.length > len1) {
            return str.substring(0, len1);
          } else {
            return str;
          }
        }
      } else {
        return "";
      }
    },

    // 校验小数点出现次数
    validDotNum(str) {
      let index = str.indexOf("."); // 字符出现的位置
      let num = 0; // 这个字符出现的次数
      while (index !== -1) {
        num++;
        index = str.indexOf(".", index + 1); // 从字符串出现的位置的下一位置开始继续查找
      }
      return num;
    },
    // 校验小数并限制长度
    validFloatDate(str, len1, len2) {
      if (str.indexOf(".") > -1) {
        let arr = str.split(".");
        let beg = arr[0];
        let end = arr[1];
        if (beg && end) {
          if (beg.length > 1) {
            if (beg.charAt(0) == 0) {
              return "";
            } else {
              if (beg.length > len1) {
                beg = beg.substring(0, len1);
              }
            }
          }
          if (end.length > len2) {
            end = end.substring(0, len2);
          }
          return beg + "." + end;
        } else {
          return "";
        }
      }
    },
    // 双击选择客户
    selectCustomer() {
      this.selectCustomerVisible = true;
    },
    selectCustomerDetermine(val) {
      this.selectCustomerVisible = false;
      this.salerName = val.customerName ? val.customerName : "";
      this.salerAccount = val.taxId ? val.taxId : "";
      // this.purchaserForm.addressOrTel = val.addressAndPhone ? val.addressAndPhone:''
      // this.purchaserForm.account = val.bankAndAccount ? val.bankAndAccount:''

      // this.recipientInfo.tel = val.invoicePhone ? val.invoicePhone:''
      // this.recipientInfo.email = val.invoiceEmail ? val.invoiceEmail:''
    },
  },
};
</script>

<style scoped>
.page-container {
  background: white;
  padding: 10px 30px 10px 30px;
}
.box-card-title {
  margin: 0px 0 5px;
}
.page-header {
  width: 100%;
  height: 50px;
  padding-top: 10px;
  /* border-bottom: 2px solid #ececec; */
}

.nav-left > span {
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #252525;
}
.nav-left >>> .el-select {
  width: 33%;
}
.invoice-type {
  margin: 0 10px 0 15px;
}

.container {
  height: 650px;
  display: flex;
}
.container > div {
  height: 100%;
}

/* 购买方  销售方 */
.content-main {
  height: 595px;
  width: 100%;
  /* border: 1px solid #ddd; */
}
.content-main-purchaser {
  height: 81px;
  border: 1px solid #e8e8e8;
  display: flex;
}
.purchaser {
  width: 5%;
  height: 100%;
  font-size: 14px;
  padding: 16px 0 0 25px;
  border-right: 1px solid #e8e8e8;
}
.purchaser-info {
  /* width: 736px; */
  width: 45%;
  flex-grow: 1;
  height: 100%;
  border-right: 1px solid #e8e8e8;
}
.purchaser-info > div {
  height: 40px;
  line-height: 40px;
  display: flex;
  border-bottom: 1px solid #e8e8e8;
}
.purchaser-info > div > span {
  display: block;
  width: 25% !important;
  border-right: 1px solid #e8e8e8;
  padding-left: 8px;
}
.purchaser-info > div >>> .el-input {
  flex-grow: 1;
  width: 0;
}
.purchaser-info > div >>> .el-input__inner {
  height: 37px;
  line-height: 37px;
  border: none;
  padding-left: 8px;
}
.purchaser-name > div {
  flex-grow: 1;
}
.purchaser-name > div >>> .el-input {
  width: 100%;
}

/* 商品 表格 */
.content-main-commodity-item {
  height: 272px;
  border-left: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
}
.content-main-commodity-item .table {
  height: 243px;
}
.content-main-commodity-item .table .thead {
  height: 44px;
  display: flex;
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
}
.content-main-commodity-item .table .thead > div {
  height: 44px;
  line-height: 44px;
  /* padding-left: 10px; */
  text-indent: 8px;
}
.content-main-commodity-item .table .name {
  width: 24%;
  /* flex-grow: 1; */
  /* border-left: 1px solid #E8E8E8; */
}
.content-main-commodity-item .table .model {
  width: 11%;
  min-width: 77px;
  border-left: 1px solid #e8e8e8;
}
.content-main-commodity-item .table .unit {
  width: 9%;
  border-left: 1px solid #e8e8e8;
}
.content-main-commodity-item .table .count {
  width: 12%;
  border-left: 1px solid #e8e8e8;
}
.content-main-commodity-item .table .price {
  width: 13%;
  border-left: 1px solid #e8e8e8;
}
.content-main-commodity-item .table .amount {
  width: 13%;
  min-width: 108px;
  border-left: 1px solid #e8e8e8;
}
.content-main-commodity-item .table .taxRate {
  width: 9%;
  min-width: 112px;
  border-left: 1px solid #e8e8e8;
}
.content-main-commodity-item .table .tax {
  width: 7%;
  min-width: 77px;
  border-left: 1px solid #e8e8e8;
}
.content-main-commodity-item .table .opt {
  width: 14%;
  min-width: 175px;
  border-left: 1px solid #e8e8e8;
  text-align: center;
}

.content-main-commodity-item .table .tbody {
  height: 199px;
  overflow: overlay;
}
/* 定义滚动条样式 */
::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 0px rgba(240, 240, 240, 0.5);
  border-radius: 10px;
  background-color: rgba(240, 240, 240, 0.5);
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 0px rgba(240, 240, 240, 0.5);
  background-color: rgba(0, 0, 0, 0.2);
}
.content-main-commodity-item .table .tbody-tr {
  height: 39px;
  display: flex;
  /* border-top: 1px solid #E8E8E8; */
  border-bottom: 1px solid #e8e8e8;
}
.content-main-commodity-item .table .tbody-tr > div >>> .el-input__inner {
  height: 37px;
  line-height: 37px;
  border: none;
  padding: 0 10px;
}

.content-main-commodity-item .tfoot {
  position: relative;
  z-index: 10;
  margin-top: -3px;
  height: 33px;
  display: flex;
  justify-content: space-between;
  background: rgba(0, 191, 165, 0.1);
  border: 1px solid #00bfa5;
}
.content-main-commodity-item .tfoot > div {
  height: 29px;
  line-height: 29px;
}
.content-main-commodity-item .tfoot .tfoot-left > span {
  position: relative;
  margin-left: 40px;
}
.content-main-commodity-item .tfoot .tfoot-left .tfoot-total {
  position: absolute;
  left: -22px;
  top: -8px;
  display: inline-block;
  width: 16px;
  height: 16px;
  line-height: 15px;
  margin-top: 9px;
  font-size: 12px;
  color: #fff;
  text-align: center;
  background: #00bfa5;
  border-radius: 50%;
}
.content-main-commodity-item .tfoot .tfoot-right > span {
  margin-right: 40px;
}
.tfoot i {
  font-style: normal !important;
}

/* 销售方 */
.content-main-seller {
  height: 290px;
  border: 1px solid #e8e8e8;
  display: flex;
}
.seller {
  width: 53px;
  height: 100%;
  font-size: 20px;
  padding: 100px 0 0 15px;
  border-right: 1px solid #e8e8e8;
}
.seller-info {
  /* width: 736px; */
  flex-grow: 1;
  height: 100%;
  border-right: 1px solid #e8e8e8;
}

.seller-remarks {
  width: 549px;
  /* flex-grow: 1; */
  height: 100%;
  padding: 20px;
  /* display: flex; */
}

.content-footer {
  display: flex;
  justify-content: space-between;
  margin: 19px 0;
}

/* el-dialog组件 */
#LightningInvoicing >>> .el-dialog__header {
  border-bottom: 1px solid #ddd;
}

/* 开票码组件 */
#billingCode >>> .el-dialog__header {
  background-color: #5e8cf9;
  padding: 12px 20px 10px;
  border: none;
}
#billingCode >>> .el-dialog__body {
  padding: 0;
}
#billingCode >>> .el-icon-close:before {
  color: #fff;
}
.breadNav {
  display: inline-block;
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  color: #252525;
}
.navText {
  margin-left: 6px;
}
/* .el-radio__input.is-disabled+span.el-radio__label {
    color: #409EFF;
    cursor: not-allowed;
} */

/* 联想提示框 */
.LenovoBox {
  position: absolute;
  left: 47px;
  /* top: 0; */
  z-index: 111;
  width: 490px;
  max-height: 199px;
  border: 1px solid #808080;
}

@media screen and (max-width: 1919px) {
  .customLenovo {
    position: absolute;
    left: 65.1%;
    /* top: 0; */
    z-index: 111;
    width: 490px;
    min-height: 282px;
    border: 1px solid #808080;
  }
}
@media screen and (min-width: 1920px) {
  .customLenovo {
    position: absolute;
    left: 59.6%;
    /* top: 0; */
    z-index: 111;
    width: 490px;
    min-height: 282px;
    border: 1px solid #808080;
  }
}

.content-main-commodity-item .tfoot .tfoot-left .tfoot-total {
  position: absolute;
  /* left: 30px;
  top: -3px; */
  display: inline-block;
  width: 16px;
  height: 16px;
  line-height: 15px;
  margin-top: 9px;
  font-size: 12px;
  color: #fff;
  text-align: center;
  background: #00bfa5;
  border-radius: 50%;
}

.ELswitch {
  margin-left: 5px;
  top: -1px;
  text-indent: 0;
}
.ELswitch >>> .el-switch__label {
  position: absolute;
  color: #fff !important;
  z-index: 1;
  display: none;
}
.ELswitch >>> .el-switch__label span {
  font-size: 12px;
}
.ELswitch >>> .is-active {
  display: block;
}
.ELswitch >>> .el-switch__label--left span {
  margin-left: 18px;
}
</style>
