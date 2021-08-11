<template>
  <div class="statistics-list-y">
    <el-row>
      <el-col :span="5">
        <p class="word">开票金额(元)</p>
        <p class="num">79y</p>
      </el-col>
      <el-col :span="4">
        <div class="line"></div>
      </el-col>
      <el-col :span="5">
        <p class="word">开票税额(元)</p>
        <p class="num">3286</p>
      </el-col>
      <el-col :span="4">
        <div class="line"></div>
      </el-col>
      <el-col :span="5">
        <p class="word">开票张数(张)</p>
        <p class="num">2141</p>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="5">
        <p class="word">认证金额(元)</p>
        <p class="num">21515</p>
      </el-col>
      <el-col :span="4">
        <div class="line"></div>
      </el-col>
      <el-col :span="5">
        <p class="word">认证税额(元)</p>
        <p class="num">12312</p>
      </el-col>
      <el-col :span="4">
        <div class="line"></div>
      </el-col>
      <el-col :span="5">
        <p class="word">认证张数(张)</p>
        <p class="num">23521</p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getInvoiceStaticApi } from "@/api/invoice.js";
export default {
  name: "StatisticsListY",
  props: {
    statisticsData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      invoiceAmount: "",
      invoiceNum: "",
      invoiceTaxAmount: "",
      certifiedAmount: "",
      certifiedNum: "",
      certifiedTaxAmount: "",
      taxDiskNum: "",
    };
  },
  created: function () {},
  mounted() {
    this.taxDiskNum = this.$store.state.user.taxDiskNum;
    this.getStatistics();
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
  methods: {
    getStatistics() {
      let applyParams = {
        taxDiskNum: this.taxDiskNum,
        startTime:"",
        endTime:"",
      };
      getInvoiceStaticApi(applyParams).then((response) => {
        console.log("开票统计--本月", response);
        // this.invoiceAmount = response.invoiceAmount;
        // this.invoiceNum = response.invoiceNum;
        // this.invoiceTaxAmount = response.invoiceTaxAmount;
        // this.certifiedAmount = response.certifiedAmount;
        // this.certifiedNum = response.certifiedNum;
        // this.certifiedTaxAmount = response.certifiedTaxAmount;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.word {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  text-align: left;
}
.num {
  font-size: 30px;
  font-family: HelveticaNeue;
  color: rgba(0, 0, 0, 0.85);
  text-align: left;
}
.line {
  margin-top: 15px;
  margin-left: 20px;
  height: 70px;
  border-left: 1px solid rgba($color: #000, $alpha: 0.06);
}
</style>