<template>
  <div class="red-invoice">
    <el-row :gutter="20" class="invoice-date">
      <el-col :span="3" :offset="14">申请方经办人: 张XX</el-col>
      <el-col :span="4">填开日期：2021年3月15日</el-col>
    </el-row>
    <el-row class="invoice-info no-bd-bottom">
      <el-col :span="1" class="bd-right flex-col">
        <p style="width: 1em;">销售方</p>
      </el-col>
      <el-col :span="3" class="bd-right">
        <el-row class="w100p h50p">名称:</el-row>
        <el-row class="w100p h50p">纳税人识别号:</el-row>
      </el-col>
      <el-col :span="8" class="bd-right">
        <el-row class="w100p h50p bd-bottom">旋极共创有限责任公司</el-row>
        <el-row class="w100p h50p">91428734673636636</el-row>
      </el-col>
      <el-col :span="1" class="bd-right flex-col">
        <p style="width: 1em;">购买方</p>
      </el-col>
      <el-col :span="3" class="bd-right">
        <el-row class="w100p h50p">名称:</el-row>
        <el-row class="w100p h50p">纳税人识别号:</el-row>
      </el-col>
      <el-col :span="8" class="no-bd-right">
        <el-row class="w100p h50p bd-bottom">浙江小望科技有限公司</el-row>
        <el-row class="w100p h50p">914873737828283673</el-row>
      </el-col>
    </el-row>
    <div class="invoice-list">
      <el-table
        :data="tableData"
        border
        show-summary
        style="width: 100%">
        <el-table-column
          prop="name"
          label="项目名称"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="type"
          align="center"
          label="规格型号">
        </el-table-column>
        <el-table-column
          prop="unit"
          align="center"
          label="单位">
        </el-table-column>
        <el-table-column
          prop="amount"
          align="center"
          label="数量">
        </el-table-column>
        <el-table-column
          prop="price"
          align="center"
          label="单价">
        </el-table-column>
        <el-table-column
          prop="total"
          align="center"
          label="金额">
        </el-table-column>
        <el-table-column
          prop="taxRate"
          align="center"
          label="税率">
        </el-table-column>
        <el-table-column
          prop="tax"
          align="center"
          label="税额">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
        </el-table-column>
      </el-table>
    </div>
    <el-row class="invoice-footer no-bd-top">
      <el-col :span="1" class="bd-right flex-col" style="flex-wrap: wrap;height: 100%;">
        <p style="width: 100%;">说</p>
        <p style="width: 100%;">明</p>
      </el-col>
      <el-col :span="13" class="bd-right" style="text-align: left;padding: 5px 10px;">
        <el-radio-group v-model="applyType">
          <div class="info-box">
            <el-radio label="buyer">一、购买方申请</el-radio>
            <p style="height: 18px;font-size: 14px;">对应蓝字专用发票抵扣增值税销项税额情况</p>
            <el-radio-group v-model="deductionType">
              <el-radio :label="0">已抵扣</el-radio>
              <el-radio :label="1">未抵扣</el-radio>
            </el-radio-group>
          </div>
          <div class="info-box">
            <el-radio label="sale">二、销售方申请</el-radio>
          </div>
        </el-radio-group>
        <div>
          <p style="font-size: 14px;font-weight: bold;">对应蓝字发票信息</p>
          <p>发票类型：增值税专用发票</p>
          <p>发票代码：233344444544</p>
          <p>发票号码：45464444</p>
        </div>
      </el-col>
      <el-col :span="10" style="padding:20px;">
        <el-row>
          <el-col :span="4">联系电话:</el-col>
          <el-col :span="20">
            <el-input size="mini" type="text"  maxlength="11" v-model="tel" />
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px;">
          <el-col :span="4">申请理由:</el-col>
          <el-col :span="20">
            <el-input size="mini"  type="textarea" v-model="tel" :rows="11"  />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <div style="display: flex; justify-content: center;margin-top: 20px;">
      <el-button size="mini" @click="$router.push('/management/invoicingManagement/RedApply')">取消</el-button>
      <el-button size="mini" type="primary">上传</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RedInvoice',
  data() {
    return {
      tableData: [
        {
          name: '*水果*苹果',
          type: '',
          unit: '',
          amount: '1',
          price: '100',
          total: '100',
          taxRate: '13%',
          tax: '13.00'
        }
      ],
       datetime: new Date(),
      applyType: '',
      deductionType: '',
      tel:"11111111111111111"
    }
  }, 
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";


.invoice-date {
  font-size: 14px;
}
.invoice-list {
  text-align: center;
  border: 2px solid $invoiceBorderColor;
}
.invoice-info {
  text-align: center;
  border: 2px solid $invoiceBorderColor;
  height: 90px;
  > .el-col {
    height: 100%;
  }
}
.invoice-footer {
  text-align: center;
  border: 2px solid $invoiceBorderColor;
  height: 300px;
  > .el-col {
    height: 100%;
  }
}
.flex-col {
  display: flex;
  justify-content: center;
}
.bd-right {
  border-right: 1px solid #797979;
}
.bd-bottom {
  border-bottom: 1px solid #797979;
}
.no-bd-right {
  border-right: none;
}
.no-bd-bottom {
  border-bottom: none;
}
.no-bd-top {
  border-top: none;
}
.w100p {
  width: 100%;
}
.h50p {
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.info-box {
  margin-bottom: 20px;
  p,.el-radio-group {
    padding-left: 20px;
  }
}
</style>