<template>
  <div id="ScanInvoicing">

    <el-card class="box-card-title" shadow="never">
      <div class="nav-flex">
        <div class="nav-left">
          <span class="el-icon-arrow-left"
                @click="goToPages('dashboard')"> {{title}}</span>
          <!-- <breadnav :textTitle="title" /> -->

          <!-- 发票类型 -->
          <el-select class="invoice-type"
                     v-model.trim="invoiceTypeVal"
                     placeholder="请选择发票类型"
                     @change="invoiceTypeChange()">
            <el-option v-for="item in invoiceType"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <!-- 征税方式 -->
          <el-select v-model.trim="taxMethodVal"
                     placeholder="请选择征税方式"
                     @change="taxMethodChange()">
            <el-option v-for="item in taxMethod"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </div>

        <div class="nav-right">
          <div @click="toSetInvoicing()">
            <img src="../../assets/imgs/setting.png"
                 alt="" />
            <div>设置</div>
          </div>

          <!-- <span @click="discountVisible = true" v-if="this.taxMethodVal != 2">
                    <img src="../../assets/imgs/deposit.png" alt="" />折扣
                </span> -->
          <div style="color:#ddd"
                v-if="this.taxMethodVal == 2 || this.taxMethodVal == 1">
            <img src="../../assets/imgs/deposit.png"
                 alt="" />
            <div>折扣</div>
          </div>
          <div @click="discountVisible = true"
                v-else>
            <img src="../../assets/imgs/deposit.png"
                 alt="" />
            <div>折扣</div>
          </div>

          <div @click="goToPages('historyInvoicing')">
            <img src="../../assets/imgs/history.png"
                 alt="" />
            <div>历史</div>
          </div>

          <!-- <span v-if="sendOrPrint">
                    <img src="../../assets/imgs/share.png" alt="" />发送
                </span>
                <span @click="toSend()" v-else>
                    <img src="../../assets/imgs/share.png" alt="" />发送
                </span> -->
          <div @click="toSend()">
            <img src="../../assets/imgs/share.png"
                 alt="" />
            <div>发送</div>
          </div>

          <div @click="toEmpty()">
            <img src="../../assets/imgs/delete.png"
                 alt="" />
            <div>清空</div>
          </div>
          <!-- <el-button type="primary" disabled  v-if="sendOrPrint">打 印</el-button>
                <el-button type="primary" @click="invoicing()" v-else>打 印</el-button> -->
          <el-button type="primary"
                     @click="invoicing()">打 印</el-button>
        </div>
      </div>
    </el-card>

    <el-card class="box-card-content" shadow="never">
      <div class="container">
        <div class="content-left">
          <ul class="content-side">
            <li v-for="i in 12"
                :key="i"></li>
          </ul>
        </div>
        <!-- 发票主体内容 -->
        <div class="content">
          <div class="content-nav">
            <div class="content-nav-left">
              <span>发票代码: <i class="invoice-code">{{invoiceCode}}</i></span>
              <span>发票号码: <i class="invoice-num">{{invoiceNum}}</i></span>
              <span>剩余份数: <i class="invoice-count">{{invoiceCount}}</i></span>
              <!-- <span>开票日期: <i class="invoice-date">{{invoiceDate}}</i></span> -->
            </div>
            <div class="content-nav-right">
              <span>开票日期: <i class="invoice-date">{{invoiceDate}}</i></span>
              <!-- <span>清 空</span> -->
            </div>
          </div>

          <div class="content-main">
            <!-- 收票人 -->
            <div class="content-main-purchaser">
              <div class="recipient-info">
                <div class="recipient-tel">
                  <span>收票人手机号:</span>
                  <el-input placeholder="请输入收票人手机号"
                            v-model.trim="recipientInfo.tel"
                            @blur="checkTel()"
                            v-on:input="watchTel()"></el-input>
                </div>
                <div class="recipient-email">
                  <span>收票人邮箱:</span>
                  <el-input placeholder="请输入收票人邮箱"
                            v-model.trim="recipientInfo.email"
                            @blur="checkEmail()"></el-input>
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
                  <!-- <div class="price" v-if="isTaxIncluded">单价 (含税)</div> -->
                  <!-- <div class="price" v-else>单价 (不含税)</div> -->
                  <!-- <div class="amount" v-if="isTaxIncluded">金额 (含税)</div>
                                <div class="amount" v-else>金额 (不含税)</div> -->
                  <div class="price">单价</div>
                  <div class="amount">
                    <!-- <span  v-if="isTaxIncluded">金额(含税)</span>
                                    <span  v-else>金额(不含税)</span>
                                    <el-switch v-model.trim="isTaxIncluded" @change="TaxIncluded()" :disabled="taxMethodVal == 1"></el-switch> -->
                    <span>金额 </span>
                    <el-switch class="ELswitch"
                               :width="65"
                               v-model="isTaxIncluded"
                               @change="TaxIncluded()"
                               :disabled="taxMethodVal != 0"
                               :active-value="true"
                               :inactive-value="false"
                               active-text="含 税"
                               inactive-text="不含税"></el-switch>
                  </div>
                  <div class="taxRate">税率</div>
                  <div class="tax">税额</div>
                  <div class="opt">操作</div>
                </div>

                <!-- 差额征税 -->
                <!-- <div class="tbody"
                     v-if="taxMethodVal == 2">
                  <div class="tbody-tr"
                       v-for="(item, index) in tableData"
                       :key="index">

                    <div class="name"
                         @dblclick="selectProduct(item,index)"
                         v-if="index == 0">
                      <el-input placeholder="双击选择商品"
                                v-model.trim="item.name"
                                v-on:input="watchName(item, index)"
                                @focus="inputName($event,index)"></el-input>
                    </div>
                    <div class="name"
                         v-else>
                      <el-input v-model.trim="item.name"
                                disabled></el-input>
                    </div>

                    <div class="model">
                      <el-input v-model.trim="item.model"
                                v-on:input="watchModel(item, index)"
                                v-if="index == 0"></el-input>
                      <el-input v-model.trim="item.model"
                                disabled
                                v-else></el-input>
                    </div>

                    <div class="unit">
                      <el-input v-model.trim="item.unit"
                                v-on:input="watchUnit(item, index)"
                                v-if="index == 0"></el-input>
                      <el-input v-model.trim="item.unit"
                                disabled
                                v-else></el-input>
                    </div>

                    <div class="count">
                      <el-input v-model.trim.trim="item.count"
                                v-on:input="watchCount(item, index)"
                                onkeyup="value=value.replace(/[^\d\.]/g,'')"
                                onchange="value=value.replace(/[^\d\.]/g,'')"
                                v-if="index == 0"></el-input>
                      <el-input v-model.trim.trim="item.count"
                                disabled
                                v-else></el-input>
                    </div>

                    <div class="price">
                      <el-input v-model.trim.trim="item.priceView"
                                v-on:input="watchPrice(item, index)"
                                onkeyup="value=value.replace(/[^\d\.]/g,'')"
                                onchange="value=value.replace(/[^\d\.]/g,'')"
                                readonly
                                v-if="index == 0"></el-input>
                      <el-input v-model.trim.trim="item.priceView"
                                disabled
                                v-else></el-input>
                    </div>

                    <div class="amount">
                      <el-input v-model.trim.trim="item.amountView"
                                v-on:input="watchAmount(item, index)"
                                @blur="blurAmount(item, index)"
                                onkeyup="value=value.replace(/[^\d\.]/g,'')"
                                onchange="value=value.replace(/[^\d\.]/g,'')"
                                readonly
                                v-if="index == 0"></el-input>
                      <el-input v-model.trim.trim="item.amountView"
                                disabled
                                v-else></el-input>
                    </div>

                    <div class="taxRate">
                      <el-select v-model.trim="item.taxRate"
                                 placeholder="请选择"
                                 @change="computerTaxs( index)"
                                 v-if="index == 0">
                        <el-option v-for="item in taxRateSelect"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                      <el-input v-model.trim="item.taxRate"
                                disabled
                                v-else></el-input>
                    </div>
                    <div class="tax">
                      <el-input v-model.trim="item.tax"
                                readonly
                                v-if="index == 0"></el-input>
                      <el-input v-model.trim="item.tax"
                                disabled
                                v-else></el-input>
                    </div>

                    <div class="opt"
                         v-if="index == 0">
                      <template v-if="item.name">
                        <el-button type="text"
                                   size="small"
                                   v-if="item.isPermanent"
                                   @click="toPermanent(item, index)">取消常驻</el-button>
                        <el-button type="text"
                                   size="small"
                                   v-else
                                   @click="toPermanent(item, index)">常驻</el-button>
                        <el-button type="text"
                                   size="small"
                                   disabled>复制</el-button>
                        <el-button type="text"
                                   size="small"
                                   disabled>增行</el-button>
                        <el-button type="text"
                                   size="small"
                                   @click="toRemove(item, index)">删除</el-button>
                      </template>
                    </div>
                    <div class="opt"
                         style="background-color: #F5F7FA;"
                         v-else>
                      <template v-if="item.name && index == 0">
                                            <el-button type="text" size="small" v-if="item.isPermanent" @click="toPermanent(item, index)">取消常驻</el-button>
                                            <el-button type="text" size="small" v-else @click="toPermanent(item, index)">常驻</el-button>
                                            <el-button type="text" size="small" >复制</el-button>
                                            <el-button type="text" size="small" >增行</el-button>
                                            <el-button type="text" size="small" @click="toRemove(item, index)" >删除</el-button>
                                        </template>
                    </div>
                  </div>
                </div> -->

                <!-- 非差额征税 -->
                <div class="tbody">
                  <div class="tbody-tr"
                       v-for="(item, index) in tableData"
                       :key="index">

                    <!-- 折扣行 -->
                    <div class="name"
                         v-if="item.isDiscount">
                      <el-input v-model.trim="item.name"
                                readonly></el-input>
                    </div>
                    <!-- 正常行 -->
                    <div class="name"
                         @dblclick="selectProduct(item,index)"
                         v-else>
                      <el-input placeholder="双击选择商品"
                                v-model.trim="item.name"
                                v-on:input="watchName(item, index)"
                                @focus="inputName($event,index)"></el-input>
                    </div>

                    <div class="model"
                         v-if="item.isDiscount">
                      <el-input v-model.trim="item.model"
                                readonly></el-input>
                    </div>
                    <div class="model"
                         v-else>
                      <el-input v-model.trim="item.model"
                                v-on:input="watchModel(item, index)"></el-input>
                    </div>

                    <div class="unit"
                         v-if="item.isDiscount">
                      <el-input v-model.trim="item.unit"
                                readonly></el-input>
                    </div>
                    <div class="unit"
                         v-else>
                      <el-input v-model.trim="item.unit"
                                v-on:input="watchUnit(item, index)"></el-input>
                    </div>

                    <div class="count"
                         v-if="item.isDiscount">
                      <el-input v-model.trim.trim="item.count"
                                readonly></el-input>
                    </div>
                    <div class="count"
                         v-else>
                      <el-input v-model.trim.trim="item.count"
                                v-on:input="watchCount(item, index)"
                                onkeyup="value=value.replace(/[^\d\.]/g,'')"
                                onchange="value=value.replace(/[^\d\.]/g,'')"></el-input>
                    </div>

                    <div class="price"
                         v-if="item.isDiscount">
                      <el-input v-model.trim.trim="item.priceView"
                                readonly></el-input>
                    </div>
                    <div class="price"
                         v-else>
                      <el-input v-model.trim.trim="item.priceView"
                                v-on:input="watchPrice(item, index)"
                                onkeyup="value=value.replace(/[^\d\.]/g,'')"
                                onchange="value=value.replace(/[^\d\.]/g,'')"></el-input>
                    </div>

                    <div class="amount"
                         v-if="item.isDiscount">
                      <el-input v-model.trim.trim="item.amountView"
                                readonly></el-input>
                    </div>
                    <div class="amount"
                         v-else>
                      <el-input v-model.trim.trim="item.amountView"
                                v-on:input="watchAmount(item, index)"
                                @blur="blurAmount(item, index)"
                                onkeyup="value=value.replace(/[^\d\.]/g,'')"
                                onchange="value=value.replace(/[^\d\.]/g,'')"></el-input>
                    </div>

                    <div class="taxRate">
                      <el-select v-model.trim="item.taxRate" placeholder="请选择" @change="computerTaxs( index)" @focus="taxSelect(index)" v-if="item.disSelectFlag" disabled>
                          <el-option
                          v-for="item2 in taxRateSelect"
                          :key="item2.value"
                          :label="item2.label"
                          :value="item2.value">
                          </el-option>
                      </el-select>
                      <el-select v-model.trim="item.taxRate" placeholder="请选择" @change="computerTaxs( index)" @focus="taxSelect(index)" v-else>
                          <el-option
                          v-for="item1 in taxRateSelect"
                          :key="item1.value"
                          :label="item1.label"
                          :value="item1.value">
                          </el-option>
                      </el-select>
                    </div>
                    <div class="tax">
                      <el-input v-model.trim="item.tax"
                                readonly></el-input>
                    </div>
                    <template v-if="taxMethodVal == 2">
                        <div class="opt">
                            <template v-if="item.name">
                                <el-button type="text" size="small" v-if="item.isPermanent" @click="toPermanent(item, index)">取消常驻</el-button>
                                <el-button type="text" size="small" v-else @click="toPermanent(item, index)">常驻</el-button>
                                <el-button type="text" size="small" disabled>复制</el-button>
                                <el-button type="text" size="small" disabled>增行</el-button>
                                <el-button type="text" size="small" @click="toRemove(item, index)" >删除</el-button>
                            </template>
                        </div>
                    </template>
                    <template v-else>
                        <div class="opt" v-if="item.isDiscount">
                            <template v-if="item.name">
                                <template v-if="item.isDiscountLine">
                                    <el-button type="text" size="small" disabled >常驻</el-button>
                                    <el-button type="text" size="small" disabled>复制</el-button>
                                    <el-button type="text" size="small" disabled>增行</el-button>
                                </template>
                                <template v-else>
                                    <el-button type="text" size="small" v-if="item.isPermanent" @click="toPermanent(item, index)">取消常驻</el-button>
                                    <el-button type="text" size="small" v-else @click="toPermanent(item, index)">常驻</el-button>
                                    <el-button type="text" size="small" @click="toCopy(item, index)">复制</el-button>
                                    <el-button type="text" size="small" @click="toAdd(item, index)">增行</el-button>
                                </template>

                                <el-button type="text" size="small" @click="toRemove(item, index)" >删除</el-button>
                            </template>
                        </div>
                        <div class="opt" v-else>
                            <template v-if="item.name">
                                <el-button type="text" size="small" v-if="item.isPermanent" @click="toPermanent(item, index)">取消常驻</el-button>
                                <el-button type="text" size="small" v-else @click="toPermanent(item, index)">常驻</el-button>
                                <el-button type="text" size="small" @click="toCopy(item, index)">复制</el-button>
                                <el-button type="text" size="small" @click="toAdd(item, index)">增行</el-button>
                                <el-button type="text" size="small" @click="toRemove(item, index)" >删除</el-button>
                            </template>
                        </div>
                    </template>
                  </div>

                </div>
              </div>

              <div class="tfoot">
                <div class="tfoot-left">
                  <span><i class="tfoot-total">i</i> 合计</span>
                  <span>金额: <i>{{totalPrice.totalAmount}}</i></span>
                  <span>税额: <i>{{totalPrice.totalTax}}</i></span>
                </div>

                <div class="tfoot-right">
                  <span>价税合计(大写): <i>{{totalPrice.priceTaxBig}}</i></span>
                  <span>价税合计(小写): <i>{{totalPrice.priceTaxSmall}}</i></span>
                </div>
              </div>

            </div>

            <!-- 销售方 -->
            <div class="content-main-seller">
              <div class="seller">销<br />售<br />方</div>
              <div class="seller-info">
                <div class="seller-name">
                  <span>客户名称:</span>
                  <!-- <input type="text" disabled /> -->
                  <el-input v-model.trim="sellerForm.name"
                            readonly></el-input>
                </div>
                <div class="seller-identifier">
                  <span>纳税人识别号:</span>
                  <el-input v-model.trim="sellerForm.identifier"
                            readonly></el-input>
                </div>
                <div class="seller-address-tel">
                  <span>地址、电话:</span>
                  <el-select v-model.trim="sellerForm.addressOrTel"
                             placeholder="请选择">
                    <el-option v-for="(item,index) in sellerAddressOrTel"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </div>
                <div class="seller-account">
                  <span>开户行及账号:</span>
                  <el-select v-model.trim="sellerForm.account"
                             placeholder="请选择">
                    <el-option v-for="(item,index) in sellerAccount"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="seller-remarks">
                <div>备<br />注</div>
                <textarea class="tarea"
                          v-on:input="watchRemarks()"
                          maxlength="180"
                          v-model.trim="sellerForm.remarks"></textarea>
              </div>
            </div>
          </div>

          <div class="content-footer">
            <div class="content-footer-left">
              <span>收款人: </span>
              <el-input v-model.trim="payee"
                        placeholder="请输入"
                        maxlength="20"
                        v-on:input="tableTail('收款人')"></el-input>
              <!-- <input v-model.trim="payee" placeholder="请输入" /> -->
            </div>
            <div class="content-footer-left">
              <span>复核人: </span>
              <el-input v-model.trim="issuer"
                        placeholder="请输入"
                        maxlength="20"
                        v-on:input="tableTail('复核人')"></el-input>
              <!-- <input v-model.trim="issuer" placeholder="请输入"/> -->
            </div>
            <div class="content-footer-left">
              <span>开票人: </span>
              <el-input v-model.trim="reviewer"
                        placeholder="请输入"
                        maxlength="20"
                        v-on:input="tableTail('开票人')"></el-input>
              <!-- <input v-model.trim="reviewer" placeholder="请输入"/> -->
            </div>
          </div>

        </div>
        <div class="content-right">
          <ul class="content-side">
            <li v-for="i in 12"
                :key="i"></li>
          </ul>
        </div>
      </div>
    </el-card>

    <!-- 折扣弹框 -->
    <div v-if="discountVisible">
      <el-dialog title="设置折扣"
                 width="25%"
                 :visible.sync="discountVisible"
                 :close-on-click-modal="false"
                 :close-on-press-escape="false"
                 destroy-on-close>
        <SetDiscount :productInfos="tableData"
                     @setDiscountClose="setDiscountCancel"
                     @setDiscountDetermine="setDiscountDetermine"></SetDiscount>
      </el-dialog>
    </div>

    <!-- 商品联想框 -->
    <div class="LenovoBox"
         ref="LenovoBox"
         v-show="LenovoBoxVisible">
      <LenovoBox :dataList="dataList"
                 :indexBox="indexBox"
                 @lenovoDetermine="lenovoDetermine"></LenovoBox>
    </div>

    <!-- 选择商品组件 -->
    <div v-if="selectProductVisible">
      <el-dialog title="选择商品"
                 width="70%"
                 :visible.sync="selectProductVisible"
                 :close-on-click-modal="false"
                 :close-on-press-escape="false"
                 destroy-on-close>
        <SelectProduct :taxDiskNum="taxDiskNum"
                       :index="index"
                       :taxMethodVal="taxMethodVal"
                       @selectProductClose="selectProductCancel"
                       @selectProductDetermine="selectProductDetermine"></SelectProduct>
      </el-dialog>
    </div>

    <!-- 差额设置弹框 -->
    <div v-if="differenceVisible">
      <el-dialog title="差额设置"
                 width="25%"
                 :visible.sync="differenceVisible"
                 :close-on-click-modal="false"
                 :close-on-press-escape="false"
                 destroy-on-close
                 :before-close="setDifferenceCancel">
        <SetDifference :productInfos="tableData"
                       @setDifferenceClose="setDifferenceCancel"
                       @setDifferenceDetermine="setDifferenceDetermine"></SetDifference>
      </el-dialog>
    </div>

    <!-- 打印设置弹框 -->
    <PrintSetting :visible.sync="printVisible" :printType="printType">
    </PrintSetting>

  </div>
</template>

<script>
import { validStrCheckLengthTextarea, validPhone, validEamil, generalValidEamil } from '@/utils/validate.js';
import { convertCurrency, UtilsGetTicketType, deteleObject, createComprisonFunction, getBase64, } from '@/utils/function.js';
import Breadnav from '@/components/Breadnav';
import BillingCode from './components/BillingCode.vue';
import SetDiscount from './components/SetDiscount.vue';
import CustomerImport from './components/CustomerImport.vue';
import SelectProduct from './components/SelectProduct.vue';
import LenovoBox from './components/LenovoBox.vue';
import SetDifference from './components/SetDifference.vue';
import PrintSetting from './components/PrintSetting.vue';
import { getInvoicingType, getInvoicingTypeDetail, getLoginData, lenovo, autoCode, residentDefault, setResident, getSellerData, getSellerDefaultData, } from "@/api/lightInvoicing.js";
import { addScanInvoice, setInfo, viewInvoiceDetail, resendScanHistory, ticketPrint } from "@/api/scanInvoicing.js";
import { selectTaxRate } from "@/api/commonAPI.js";
import { getInstalledPrintersApi, PrintInvoiceApi,PrintTicketArray, PrintTicket } from "@/api/cefSharp.js";

export default {
  name: "ScanInvoicing",
  components: { Breadnav, SetDiscount, BillingCode, CustomerImport, SelectProduct, LenovoBox, SetDifference, PrintSetting, },
  data() {
    return {
      title: '扫码开票',

      // 发票类型
      invoiceType: [
        // {value: '004', label: '增值税专用发票'},
        // {value: '007', label: '增值税普通发票'},
        // {value: '025', label: '卷式发票'},
        // {value: '026', label: '普通发票(电子)'},
        // {value: '028', label: '专用发票(电子)'},
        // {value: '005', label: '机动车销售统一发票'},
      ],
      invoiceTypeVal: '',
      // 征税方式
      taxMethod: [
        { value: 0, label: '普通征税' },
        { value: 1, label: '减按征税' },
        { value: 2, label: '差额征税' },
      ],
      taxMethodVal: 0,

      // 是否含税
      isTaxIncluded: true,

      // 是否在发送或打印
      sendOrPrint: false,
      // 添加开票 新增接口返参
      pollingData: '',
      // 正在发送中
      toSendFlag: false,


      // 折扣
      discountVisible: false,
      // 选择商品
      selectProductVisible: false,
      index: '',
      // 联想框
      LenovoBoxVisible: false,
      dataList: [],
      indexBox: '',
      // 差额征收弹框
      differenceVisible: false,
      // 打印设置弹框
      pintVisible: false,
      printType: '',
      printFormInfo: '',


      // 发票模块信息 ==================================================

      // 票头
      invoiceCode: '',
      invoiceNum: '',
      invoiceCount: '',
      invoiceDate: '',
      // 票尾
      payee: '',
      issuer: '',
      reviewer: '',


      // 收票人
      recipientInfo: {
        tel: '',
        email: '',
      },

      // 销售方
      sellerForm: {
        name: '',
        identifier: '',
        addressOrTel: '',
        account: '',
        remarks: '',
      },
      // 销售方-地址电话
      sellerAddressOrTel: [],
      // 销售方-开户行及账号
      sellerAccount: [],


      //商品表格(初始长度7)
      tableData: [
        { name: '', model: '', unit: '', count: '', price: '', priceView: '', amount: '', amountView: '', taxRate: '', tax: '', taxC: '', isPermanent: false, isDiscount: false, isDiscountLine: false, isBlur: false, disSelectFlag: false, },
        // { name: '', model: '', unit: '', count: '', price: '', priceView: '', amount: '', amountView: '', taxRate: '', tax: '', taxC: '', isPermanent: false, isDiscount: false, isDiscountLine: false, isBlur: false, disSelectFlag: false, },
      ],
      // 商品表格基本格式
      tableData_el: {
        name: '',               //商品名称
        model: '',              //规格型号
        unit: '',               //单位
        count: '',              //数量
        price: '',              //单价（价格切换计算）
        priceView: '',          //单价（页面展示）
        amount: '',             //金额（价格切换计算）
        amountView: '',         //金额（页面展示）
        taxRate: '',            //税率
        tax: '',                //税额（页面展示）
        taxC: '',               //税额
        isPermanent: false,     //是否常驻
        isDiscount: false,      //是否有折扣
        isDiscountLine: false,  //是否为折扣行
        isBlur: false,          //是否失去过焦点
        disSelectFlag: false,   //是否禁止税率下拉框选择
      },
      // 备用不变的税率
      taxRateSelect_const: [],
      // 税率
      taxRateSelect: [
        // {value: 0.01, label: '1%'},
        // {value: 0.03, label: '3%'},
        // {value: 0.04, label: '4%'},
        // {value: 0.06, label: '6%'},
        // {value: 0.09, label: '9%'},
        // {value: 0.10, label: '10%'},
        // {value: 0.11, label: '11%'},
        // {value: 0.13, label: '13%'},
        // {value: 0.16, label: '16%'},
        // {value: 0.17, label: '17%'},
      ],
      // 非减按征税条件下
      taxRateSelect_el: [
        // {value: 0.01, label: '1%'},
        // {value: 0.03, label: '3%'},
        // {value: 0.04, label: '4%'},
        // {value: 0.06, label: '6%'},
        // {value: 0.09, label: '9%'},
        // {value: 0.10, label: '10%'},
        // {value: 0.11, label: '11%'},
        // {value: 0.13, label: '13%'},
        // {value: 0.16, label: '16%'},
        // {value: 0.17, label: '17%'},
      ],
      // 减按征税条件下
      taxRateSelect_jianan: [
        { value: 0.015, label: '1.5%' },
      ],
      // 默认写死的税率
      taxRateSelect_default: [
        { value: 0.01, label: '1%' },
        { value: 0.03, label: '3%' },
        { value: 0.04, label: '4%' },
        { value: 0.06, label: '6%' },
        { value: 0.09, label: '9%' },
        { value: 0.10, label: '10%' },
        { value: 0.11, label: '11%' },
        { value: 0.13, label: '13%' },
        { value: 0.16, label: '16%' },
        { value: 0.17, label: '17%' },
      ],
      // 预处理税率
      taxRateSelect_PRE: [],


      // 价格合计
      totalPrice: {
        totalAmount: '',
        totalTax: '',

        priceTaxBig: '',
        priceTaxSmall: '',
      },


      // 开票接口所属商品字段
      goodsDetail: [],
      goodsDetail_el: [
        {
          createTime: '',	    //创建时间
          goodsAmount: '',	//number //商品金额----（tableData）
          goodsCode: '',	    //string //商品编码---  taxClassificationCode
          goodsName: '',	    //string //商品名称---- goodsName/（tableData）
          goodsNumber: '',	//number //商品数量----（tableData）
          goodsPrice: '',	    //number //商品单价----（tableData）
          goodsSelfCode: '',	//string //商品自行编码--- goodsSelfCode
          goodsShortName: '',	//string //商品简称（税收分类简称）--- 从goodsName中分割*获取
          goodsSubName: '',	//string //税目名称(又叫商品分类编码简称)--- taxClassificationName

          id: '',	            //integer($int64) //ID
          incentivesLabel: '',//string //优惠政策标识 无免税100%先征后退50%先征后退不征税先征后退即征即退100%即征即退30% 即征即退50% 即征即退70% 按3%简易征收,按5%简易征收,稀土产品/简易征收/超税负12%即征即退超税负3%即征即退,超税负8%即征即退----incentivesLabel
          invoiceSeries: '',	//integer($int64) //流水号---   ???
          isTax: '',	        //integer($int32) //含税状态 0：否 1：是----（tableData）
          lineNature: '',	    //integer($int32) //发票行性质0：无折扣行商品 1.折扣行2.有折扣行商品 3.（详见清单列表）4.折扣行总和--- ???
          specifications: '',	//string //规格型号----（tableData）
          taxAmount: '',	    //number //税额----（tableData）
          taxRate: '',	    //number //税率----（tableData）
          unit: '',	        //string //单位----（tableData）
          zeroTaxMarks: '',	//string //零税率标识，空代表正常税率1 出口免税和其他免税优惠政策（免税）2 不征增值税（不征税）3 普通零税率（0%）---- zeroTaxMarks
        }
      ],


      // 企业用户登入信息
      companyUserInfos: '',
      // 销售方信息
      sellerInfos: '',
      // 销售方下拉框信息
      sellerSelectInfos: '',
      // 盘号
      taxDiskNum: '',

      // 差额征税含税销售额（弹框）
      sales: '',
      // 差额备注
      remarkNote:'',
      // 差额征税扣除额
      differentialTaxationAmount: '',


      // 定时器
      timer: null,
      // 税盘信息
      taxDiskInfo: {},


      // 路由数据
      routeList: '',

      // 是否第一次渲染路由数据
      firstFlagRoute: true,

      // 表单数据是否完整
      allDataFalg: '',

      setInvoicingData:true,

      //打印设置

      printVisible:false,
      printType:null,

    };
  },
  computed: {
    taxDiskNumChange() {
      return this.$store.state.user.taxDiskInfo.taxDiskNum;
    }
  },
  watch: {
    taxDiskNumChange: {
      handler: function (newval, oldval) {
        if (newval !== oldval) {
          this.taxDiskNum = newval
          console.log('watch')
          // this.togetLoginData()
          // this.togetSellerDefaultData()

          this.invoiceTypeInit()
          this.invoiceTypeChange()
        }
      },
      deep: true
    },
    invoiceCount: {
      handler: function (newval, oldval) {
        if (newval == '0') {
          this.$alert('当前发票类型剩余份数为零,请选择其他类型发票！', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        }
      },
      deep: true
    }
  },
  created() {

  },
  mounted() {
    this.taxDiskInfo = this.$store.state.user.taxDiskInfo
    this.taxDiskNum = this.$store.state.user.taxDiskInfo.taxDiskNum;
    

    // this.toPermanentInit()

    // this.historyInvoicingData = this.$route.query.historyInvoicing ? JSON.parse(this.$route.query.historyInvoicing) : ''
    // console.log('历史小票页面数据', this.historyInvoicingData);
    // this.setInvoicingData = this.$route.query.List ? this.$route.query.List : false
    // console.log('小票设置页面数据', this.setInvoicingData,);

    // 路由跳转数据
    // 小票历史 type='historyInvoicing'
    // 小票设置 type='setInvoicing'
    this.routeList = this.$route.query.List ? JSON.parse(this.$route.query.List):''
    console.log('路由跳转数据k', this.routeList);

    this.invoiceTypeInit()
    this.togetLoginData()
    this.togetSellerDefaultData()

    // this.invoiceDate = this.$moment().format("YYYY-MM-DD")
  },
  methods: {
    // 路由跳转 - 设置/历史
    goToPages(item) {
      this.$router.push(item)
      // this.$router.push({name: item})
    },
    // 展示路由跳转数据
    toShowRouteData() {
      // 小票设置
      if (this.routeList.type == 'setInvoicing' && this.routeList.data) {
        let localData = this.routeList.data
        // 发票类型
        this.invoiceTypeVal = localData.invoiceTypeVal
        // 征税方式
        this.taxMethodVal = localData.taxMethodVal
        // 是否含税
        this.isTaxIncluded = localData.isTaxIncluded
        this.invoiceTypeChange()
        // 收票人
        this.recipientInfo = localData.recipientInfo
        // 商品数据
        // this.toPreDealTaxRate(localData.goodsData)
        this.tableData = localData.goodsData
        this.toPreDealTaxRate2(this.tableData);
        // 销售方
        // this.sellerForm = localData.sellerForm
        // 票尾
        // this.payee = localData.payee
        // this.issuer = localData.issuer
        // this.reviewer = localData.reviewer

        // 发送或打印的添加接口数据
        this.pollingData = localData.pollingData
        this.sendOrPrint = localData.sendOrPrint

        this.computerTotalPrice()
        // this.invoiceTypeChange()
        return
      }

      // 历史页数据
      if (this.routeList.type == 'historyInvoicing') {
        console.log('historyInvoicing');
        let dataAPI = ''
        const el = this.routeList.data
        this.invoiceTypeVal = el.invoiceType
        if (el.taxationType == 2) {
          this.taxMethodVal = 2
          this.tableData[0].amount = el.differentialTaxationAmount
          this.tableData[0].amountView = el.differentialTaxationAmount
        }
        this.recipientInfo.tel = el.ticketPushPhone
        this.recipientInfo.email = el.ticketPushMail
        // this.totalPrice.priceTaxSmall = el.totalPriceWithTax
        // this.sellerForm.name = el.sellerName
        // this.sellerForm.identifier = el.sellerTaxId
        // this.sellerForm.addressOrTel = el.sellerAddrTel
        // this.sellerForm.account = el.sellerBankAccount
        this.sellerForm.remarks = el.remark
        // this.payee = el.skr
        // this.issuer = el.fhr
        // this.reviewer = el.kpr

        // 合计
        this.totalPrice.totalAmount = el.totalAmount
        this.totalPrice.totalTax = el.totalTaxAmount
        this.invoiceTypeChange()
        // this.toPreDealTaxRate(this.tableData);
        this.toPreDealTaxRate(el.goodsCommonDetail)
        
        for (let i = 0; i < el.goodsCommonDetail.length; i++) {
          let val = el.goodsCommonDetail[i]
          let obj = this.toDealGoodsDetail(val)
          this.tableData.splice(i, 1, obj);
        }
        // viewInvoiceDetail(el.invoiceSeries).then(response => {
        //     if(response&&response.code=='200'){
        //         let res = response.data
        //         this.toPreDealTaxRate(res)
        //         for (let i = 0; i < res.goodsCommonDetail.length; i++) {
        //             let obj = this.toDealGoodsDetail(res[i])
        //             this.tableData.splice(i, 1, obj);
        //         }
        //     }
        // }).catch(error => {})
        
       
        
        if (el.totalPriceWithTax) {
          this.totalPrice.priceTaxSmall = el.totalPriceWithTax
          if (this.totalPrice.priceTaxSmall < 0) {
            this.totalPrice.priceTaxBig = '(负数)' + convertCurrency(Math.abs(this.totalPrice.priceTaxSmall))
          } else {
            this.totalPrice.priceTaxBig = convertCurrency(Math.abs(this.totalPrice.priceTaxSmall))
          }
        } else {
          if (el.totalAmount && el.totalTaxAmount) {
            this.totalPrice.priceTaxSmall = parseFloat(el.totalAmount) + parseFloat(el.totalTaxAmount)
            if (this.totalPrice.priceTaxSmall < 0) {
              this.totalPrice.priceTaxBig = '(负数)' + convertCurrency(Math.abs(this.totalPrice.priceTaxSmall))
            } else {
              this.totalPrice.priceTaxBig = convertCurrency(Math.abs(this.totalPrice.priceTaxSmall))
            }
          } else {
            this.totalPrice.priceTaxSmall = ''
          }
        }
        this.taxRateSelect=deteleObject(this.taxRateSelect.sort(createComprisonFunction("value")))
        // this.computerTotalPrice()
        // this.invoiceTypeChange()
        return
      }

      console.log('0')
      // 没有路由数据--就展示默认页面

      this.toPermanentInit()
    },

    // 获取销售方默认信息
    togetSellerDefaultData() {
      let params = this.taxDiskNum
      getSellerDefaultData(params).then(response => {
        if (response && response.code == '200') {
          let res = response.data
          this.sellerInfos = res
          // 销方
          this.sellerForm.addressOrTel = res.sellerAddrTel
          this.sellerForm.account = res.sellerBankAccount
          this.togetSellerData()

          // 销方票尾
          this.payee = res.skr
          this.issuer = res.fhr
          this.reviewer = res.kpr
        }
      }).catch(error => { })
    },
    togetSellerData() {
      let params = this.taxDiskNum
      getSellerData(params).then(response => {
        if (response && response.code == '200') {
          let res = response.data
          this.sellerSelectInfos = res
          let sel1 = []
          let sel2 = []
          for (let i = 0; i < res.length; i++) {
            const el = res[i]
            sel1.push({ value: el.sellerAddrTel, label: el.sellerAddrTel })
            sel2.push({ value: el.sellerBankAccount, label: el.sellerBankAccount })
          }
          // this.sellerAddressOrTel = sel1
          // this.sellerAccount = sel2.filter(el=>el.value)
          this.sellerAddressOrTel = this.unique(sel1);
            this.sellerAccount = this.unique(sel2.filter(el => el.value));
        }
      }).catch(error => { })
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
    // 企业用户登入信息
    togetLoginData() {
      let params = ''
      getLoginData(params).then(response => {
        if (response && response.code == '200') {
          let res = response.data
          this.companyUserInfos = res
          this.sellerForm.name = res.companyName ? res.companyName : '空'
          this.sellerForm.identifier = res.taxId
        }
      }).catch(error => { })
    },


    // 发票类型
    invoiceTypeInit() {
      let params = {
        taxDiskNum: this.taxDiskNum
      }
      getInvoicingType(params).then(response => {
        if (response && response.code == '200') {
          let res = response.data
          this.invoiceType = UtilsGetTicketType(res.ticketType)
          console.log(this.invoiceType);
          this.invoiceTypeVal = this.invoiceType[0].value
          if (!this.routeList) {
              // this.invoiceTypeChange();
              this.toPermanentInit1();
            } else {
              if (this.taxMethodVal != 1) {
                this.selectTaxRateAjax();
              }
            }

          // if (this.invoiceType.length > 0 && !this.invoiceTypeVal) {
          //     this.invoiceTypeVal = this.routeList ? this.routeList.data.invoiceType:this.invoiceType[0].value
          //     this.invoiceTypeChange()
          // }
        }
      }).catch(error => { })
    },

    invoiceTypeChange() {
      this.invoiceCode = ''
      this.invoiceNum = ''
      this.invoiceCount = ''

      let params = {
        invoiceType: this.invoiceTypeVal,
        taxDiskNum: this.taxDiskNum,
      }
      getInvoicingTypeDetail(params).then(response => {
        if (response && response.code == '200') {
          let res = response.data
          this.invoiceCode = res.invoiceCode
          this.invoiceNum = res.invoiceNo
          this.invoiceCount = res.balances
          this.invoiceDate = res.invoiceDate
        }
      }).catch(error => { })
      if (this.taxMethodVal != 1) {
        this.selectTaxRateAjax();
      }
    },

    // 税盘税率信息
    selectTaxRateAjax() {
      this.taxRateSelect = []
      this.taxRateSelect_el = []
      this.taxRateSelect_const = [];
      let params = {
        invoiceType: this.invoiceTypeVal,
        taxDiskNum: this.taxDiskNum,
      }
      selectTaxRate(params).then(response => {
        if (response && response.code == '200') {
          let res = response.data
          if (this.firstFlagRoute && this.routeList) {
              this.toShowRouteData();
              this.firstFlagRoute = false;
              return;
            }
          if (res.length > 0) {
            for (let i = 0; i < res.length; i++) {
              const el = res[i]
              let obj = { value: el.taxRate, label: el.taxRate * 100 + '%' }
              this.taxRateSelect.push(obj)
              this.taxRateSelect_el.push(obj)
              this.taxRateSelect_const.push(obj);
            }
          } else {
            if (this.taxMethodVal != 1) {
                
                this.taxRateSelect = this.taxRateSelect_default;
                this.taxRateSelect_el = this.taxRateSelect_default;
                this.taxRateSelect_const = this.taxRateSelect_default;
              }
            
          }

          // if (this.firstFlagRoute) {
          //   this.toShowRouteData()
          //   this.firstFlagRoute = false
          // }
        }
      }).catch(error => { })
    },
    taxSelect(index) {
      this.taxRateSelect = []
      if (this.taxMethodVal == 1) {
        this.taxRateSelect = this.taxRateSelect_jianan
      }else {
        this.taxRateSelect = this.taxRateSelect_const
      }
      console.log('taxSelect...', this.taxRateSelect_const);
    },
    // 税率判断-商品数据处理
    toDealTaxRate(taxRate) {
      //this.taxRateSelect
      //this.taxRateSelect_el
      if (this.taxRateSelect.length == 0 || this.taxRateSelect_el.length == 0) {
        this.taxRateSelect = this.taxRateSelect_default;
        this.taxRateSelect_el = this.taxRateSelect_default;
      }
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
      console.log(res)
      return res;
    },
    // 先筛选一遍商品信息， 添加税率项
    toPreDealTaxRate(arr) {
      for (let i = 0; i < arr.length; i++) {
        const el = arr[i];
        if (el.taxRate == 0 && el.zeroTaxMarks) {
            let obj = {value: 0, label: '0%'}
            this.taxRateSelect_PRE.push(JSON.parse(JSON.stringify(obj)))
        }else {
            let obj = {value: el.taxRate, label: el.taxRate * 100 + '%'}
            this.taxRateSelect_PRE.push(JSON.parse(JSON.stringify(obj)))
        }
      }
      let array = this.taxRateSelect_PRE.concat(this.taxRateSelect)
      let arrSort = array.sort(createComprisonFunction("value"))
      let res = deteleObject(arrSort)
      this.taxRateSelect = []
      this.taxRateSelect = res;
      this.taxRateSelect_el = res;
    },

    toPreDealTaxRate2(arr) {
      for (let i = 0; i < arr.length; i++) {
        const el = arr[i];
        if(el.goodsName){
          if (el.taxRate == 0 && el.zeroTaxMarks) {
            let obj = {value: 0, label: '0%'}
            this.taxRateSelect_PRE.push(JSON.parse(JSON.stringify(obj)))
        }else {
            let obj = {value: el.taxRate, label: el.taxRate * 100 + '%'}
            this.taxRateSelect_PRE.push(JSON.parse(JSON.stringify(obj)))
        }
        }
      }
      let array = this.taxRateSelect_PRE.concat(this.taxRateSelect)
      let arrSort = array.sort(createComprisonFunction("value"))
      let res = deteleObject(arrSort)
      this.taxRateSelect = []
      this.taxRateSelect = res;
      this.taxRateSelect_el = res;
    },
    toPreDealTaxRate1(arr) {
        for (let i = 0; i < arr.length; i++) {
            const el = arr[i];
            if (el.taxRate == null && el.zeroTaxMarks) {
                let obj = {value: 0, label: '0%'}
                this.taxRateSelect_PRE.push(JSON.parse(JSON.stringify(obj)))
            }
            else {
                let res = ''
                for (let i = 0; i < this.taxRateSelect.length; i++) {
                    const ele = this.taxRateSelect[i];
                    if (ele.value == el.taxRate) {
                        res = parseFloat(el.taxRate) + ''
                    }
                }
                if (!res) {
                    let obj = {value: 0, label: '0%'}
                    this.taxRateSelect_PRE.push(JSON.parse(JSON.stringify(obj)))
                }
            }
        }
        let array = this.taxRateSelect_PRE.concat(this.taxRateSelect)
        let arrSort = array.sort(createComprisonFunction("value"))
        let res = deteleObject(arrSort)
        this.taxRateSelect = []
        this.taxRateSelect = res;
        this.taxRateSelect_el = res;
    },


    // 征税方式
    taxMethodChange() {
      this.tableData = []
      this.fillUp()
      console.log('企业用户登入信息', this.companyUserInfos)
      console.log('销售方信息', this.sellerSelectInfos)
      //默认含税状态
      this.isTaxIncluded = true
      //差额
      if (this.taxMethodVal == 2) {
        this.tableData = []
        this.fillUp()
      } else {
        this.differentialTaxationAmount = ''
      }
      //减按
      if (this.taxMethodVal == 1) {
        this.taxRateSelect = this.taxRateSelect_jianan
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].taxRate = ''
          this.tableData[i].tax = ''
          this.tableData[i].taxC = ''
        }
      } else {
        this.taxRateSelect = this.taxRateSelect_el
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].taxRate = ''
          this.tableData[i].tax = ''
          this.tableData[i].taxC = ''
        }
      }

      this.totalPrice = {
        totalAmount: '',
        totalTax: '',
        priceTaxBig: '',
        priceTaxSmall: '',
      }

      this.toPermanentInit()
    },
    // 差额征收
    setDifferenceCancel() {
      this.tableData[0] = JSON.parse(JSON.stringify(this.tableData_el))
      this.differenceVisible = false
    },
    setDifferenceDetermine(val) {
        if(this.editDifference===true){
            this.editDifference = false;
        }
        let sales = parseFloat(val.sales)
        let deduction = parseFloat(val.deduction)
        let taxRate = this.tableData[0].taxRate ? parseFloat(this.tableData[0].taxRate):''
        if (this.isTaxIncluded) {
            // 含税
            this.tableData[0].amount = sales
            this.tableData[0].amountView = sales.toFixed(2)
            let res = (sales-deduction) * taxRate / (taxRate + 1 )
            this.tableData[0].tax = taxRate ? res.toFixed(2):''
            this.tableData[0].taxC = taxRate ? res:''
            if(this.tableData[0].amount && this.tableData[0].priceView){
                if(this.tableData[0].count===''){
                    //没有数量 根据金额和单价计算数量
                    let resCount = Number(this.tableData[0].amount) / Number(this.tableData[0].priceView)
                    this.tableData[0].count = parseFloat(resCount.toFixed(6))
                }else{
                    //存在数量 根据金额重新计算单价
                    let counts = parseFloat(this.tableData[0].count)
                    let amounts = parseFloat(this.tableData[0].amount)
                    let resPrice = amounts / counts
                    this.tableData[0].price = resPrice
                    this.tableData[0].priceView = parseFloat(resPrice.toFixed(8))
                }
            }
        }else {
            // 不含税
            let salesNo = (sales-deduction) / (taxRate + 1 ) + deduction
            this.tableData[0].amount = salesNo
            this.tableData[0].amountView = salesNo.toFixed(2)
            let res = (sales-deduction) * taxRate / (taxRate + 1 )
            this.tableData[0].tax = taxRate ? res.toFixed(2):''
            this.tableData[0].taxC = taxRate ? res:''
            if(this.tableData[0].amount && this.tableData[0].priceView){
                if(this.tableData[0].count===''){
                    //没有数量 根据金额和单价计算数量
                    let resCount = Number(this.tableData[0].amount) / Number(this.tableData[0].priceView)
                    this.tableData[0].count = parseFloat(resCount.toFixed(6))
                }else{
                    //存在数量 根据金额重新计算单价
                    let counts = parseFloat(this.tableData[0].count)
                    let amounts = parseFloat(this.tableData[0].amount)
                    let resPrice = amounts / counts
                    this.tableData[0].price = resPrice
                    this.tableData[0].priceView = parseFloat(resPrice.toFixed(8))
                }
            }
        }
        // 差额征收扣除额
        this.differentialTaxationAmount = deduction
        this.sellerForm.remarks = "差额征税：" + deduction + '。'
        this.remarkNote = this.sellerForm.remarks
        this.sales = sales ? sales:''
        // this.computerTaxs(0)
        this.computerTotalPrice()
        this.differenceVisible = false
    },



    // 折扣
    setDiscountCancel() {
      this.discountVisible = false
    },
    setDiscountDetermine(val) {
      this.discountVisible = false
      let index = val.index
      let disAmount = val.discountAmount
      this.tableData[index].isDiscount = true
      let str = JSON.stringify(this.tableData[index])
      let obj = JSON.parse(str)
      let taxRate = parseFloat(obj.taxRate)
      // let disTax = parseFloat(disAmount) * parseFloat(obj.taxRate)
      let disTax = ''
      if (this.isTaxIncluded) {
        // 含税
        disTax = (parseFloat(disAmount) * taxRate) / (taxRate + 1)
      } else {
        // 不含税
        disTax = parseFloat(disAmount) * taxRate
      }
      obj.model = ''
      obj.unit = ''
      obj.count = ''
      obj.price = ''
      obj.priceView = ''
      obj.amount = '-' + disAmount
      obj.amountView = '-' + disAmount
      obj.tax = '-' + disTax.toFixed(2)
      obj.taxC = '-' + disTax
      obj.isDiscountLine = true
      obj.isPermanent = false,    // 改为默认非常驻????
        this.tableData.splice(index + 1, 0, obj);

      this.computerTotalPrice()
    },


    // 价格
    TaxIncluded() {
      console.log('价格', this.isTaxIncluded);
      // 差额征收模式下
      if (this.taxMethodVal == 2) {
        let sales = parseFloat(this.tableData[0].amountView)
        let deduction = parseFloat(this.differentialTaxationAmount)
        let taxRate = parseFloat(this.tableData[0].taxRate)
        let el = this.tableData[0]
        let taxRateStr = taxRate + ''
        if (!taxRateStr) {
          this.tableData[0].price = ''
          this.tableData[0].priceView = ''
          this.tableData[0].amount = ''
          this.tableData[0].amountView = ''
          return
        }
        if (this.isTaxIncluded) {
          // 含税
          // let salesYes = (sales - deduction) * (taxRate + 1) + deduction
          // this.tableData[0].amount = sales ? salesYes : ''
          // this.tableData[0].amountView = sales ? parseFloat(salesYes.toFixed(2)) : ''
          let salesYes = this.sales ? this.sales:''
          this.tableData[0].amount = this.sales ? salesYes:''
          this.tableData[0].amountView = this.sales ? parseFloat(salesYes.toFixed(2)):''

          if (el.count && sales) {
            this.tableData[0].price = salesYes / el.count
            this.tableData[0].priceView = parseFloat(this.tableData[0].price.toFixed(8))
          }
        } else {
          // 不含税
          let salesNo = (sales - deduction) / (taxRate + 1) + deduction
          this.tableData[0].amount = sales ? salesNo : ''
          this.tableData[0].amountView = sales ? parseFloat(salesNo.toFixed(2)) : ''

          if (el.count && sales) {
            this.tableData[0].price = salesNo / el.count
            this.tableData[0].priceView = parseFloat(this.tableData[0].price.toFixed(8))
          }
        }
        this.computerTotalPrice()
        return
      }

      // 非差额征收模式下
      if (this.isTaxIncluded) {
        // 含税
        for (let i = 0; i < this.tableData.length; i++) {
          const el = this.tableData[i];
          let taxRateStr = el.taxRate + ''
          if (!taxRateStr) {
            this.tableData[i].price = ''
            this.tableData[i].priceView = ''
            this.tableData[i].amount = ''
            this.tableData[i].amountView = ''
            continue
          } else {
            if (el.priceView || el.amountView) {
              if (el.priceView && taxRateStr) {
                let prices = parseFloat(el.priceView)
                let taxRates = parseFloat(el.taxRate)
                let resPrice = prices * (taxRates + 1)
                this.tableData[i].price = resPrice
                // this.tableData[i].priceView = this.checkNum(resPrice, 9, 8)
                this.tableData[i].priceView = parseFloat(resPrice.toFixed(8))
              }
              if (el.amountView && taxRateStr) {
                let amounts = parseFloat(el.amount)
                let taxRates = parseFloat(el.taxRate)
                let resAmount = amounts * (taxRates + 1)
                this.tableData[i].amount = resAmount
                // this.tableData[i].amountView = this.checkNum(resAmount, 9, 2)
                this.tableData[i].amountView = parseFloat(resAmount.toFixed(2))
              }
            }
          }

        }
      } else {
        // 不含税
        for (let i = 0; i < this.tableData.length; i++) {
          const el = this.tableData[i];
          let taxRateStr = el.taxRate + ''
          if (!taxRateStr) {
            this.tableData[i].price = ''
            this.tableData[i].priceView = ''
            this.tableData[i].amount = ''
            this.tableData[i].amountView = ''
            continue
          } else {
            if (el.priceView || el.amountView) {
              if (el.priceView && taxRateStr) {
                let taxRates = parseFloat(el.taxRate)
                let resPrice = parseFloat(el.priceView) / (taxRates + 1)
                this.tableData[i].price = resPrice
                // this.tableData[i].priceView = this.checkNum(resPrice, 9, 8)
                this.tableData[i].priceView = parseFloat(resPrice.toFixed(8))
              }
              if (el.amountView && taxRateStr) {
                let taxRates = parseFloat(el.taxRate)
                let resAmount = parseFloat(el.amount) / (taxRates + 1)
                this.tableData[i].amount = resAmount
                // this.tableData[i].amountView = this.checkNum(resAmount, 9, 2)
                this.tableData[i].amountView = parseFloat(resAmount.toFixed(2))
              }
            }
          }
        }
      }
      this.computerTotalPrice()
    },


    // 发送
    toSend() {
      console.log('this.toSendFlag', this.toSendFlag);
      if (this.toSendFlag) {
        this.$alert('正在发送小票,请稍后再试!', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        });
        return
      }

      // 发票剩余份数
      if (this.invoiceCount == '0') {
        this.$alert('发票已用完，无法开具发票!', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        });
        return
      }

      // 收票人信息
      if (!this.recipientInfo.tel && !this.recipientInfo.email) {
        this.$alert('收票人手机号或邮箱至少填写一个!', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        });
        return
      }

      // 开户行及账号
      if (this.sellerForm.account==='' &&  (this.invoiceTypeVal == '004' || this.invoiceTypeVal == '028')) {
        this.$alert("销售方信息不完善，请填写！", "提示", {
          confirmButtonText: "确定",
          type: "warning"
        });
        return false;
      }

      this.goodsDetail = []
      // 校验信息
      let check = this.checkInfo()
      if (!check) return

      this.toSetInfoAjax()

    },
    // 验证是否小票设置
    toSetInfoAjax() {
      let params = this.taxDiskNum
      setInfo(params).then(response => {
        if (response && response.code == '200') {
          let res = response.data

          // 小票设置是否保存成功--   ??this.setInvoicingData
          console.log(res.shopShortName && res.address && res.phone && res.validityDays)
          if (res.shopShortName && res.address && res.phone && res.validityDays) {
            this.$confirm('是否确定发送小票链接？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (!this.sendOrPrint) {
                this.addInvoicingAjax('发送')
              }
              // this.sendOrPrint = true
            }).catch(() => { });
          } else {
            this.$confirm('请点击”设置“按钮，去完成小票设置后重试', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.toSetInvoicing()
            }).catch(() => { });
          }

        }
      }).catch(error => { })
    },
    toSendAjax(res) {
      let params = {
        invoiceSeries: this.pollingData
      }
      resendScanHistory(params).then(response => {
        if (response && response.code == '200') {
          let res = response.data
          this.sendOrPrint = false
          this.$message({
            type: 'success',
            message: res
          });
        }else if(response && response.code != '200'){
          // this.$message({
          //   type: 'error',
          //   message: response.msg
          // });
        }
        this.toSendFlag = false
      }).catch(error => { })
    },

    // 设置按钮
    toSetInvoicing() {
      this.$router.push({
        name: 'setInvoicing',
        query: {
          List: JSON.stringify({
            data: this.toSaveLocal(),
            type: '',
          })
        }
      })
    },
    // 存储页面数据
    toSaveLocal() {
      let obj = {
        // 发票类型
        invoiceTypeVal: this.invoiceTypeVal,
        // 征税方式
        taxMethodVal: this.taxMethodVal,
        // 是否含税
        isTaxIncluded: this.isTaxIncluded,
        // 票头
        // invoiceCode: this.invoiceCode,
        // invoiceNum: this.invoiceNum,
        // invoiceCount: this.invoiceCount,
        // invoiceDate: this.invoiceDate,
        // 票尾
        payee: this.payee,
        issuer: this.issuer,
        reviewer: this.reviewer,
        // 收票人
        recipientInfo: {
          tel: this.recipientInfo.tel,
          email: this.recipientInfo.email,
        },
        // 商品数据
        goodsData: this.tableData,
        // 销售方
        sellerForm: {
          name: this.sellerForm.name,
          identifier: this.sellerForm.identifier,
          addressOrTel: this.sellerForm.addressOrTel,
          account: this.sellerForm.account,
          remarks: this.sellerForm.remarks,
        },
        // 发送或打印的添加接口数据
        pollingData: this.pollingData,
        sendOrPrint: this.sendOrPrint,
      }
      return obj
      // sessionStorage.setItem("scanInvoicingData", JSON.stringify(obj))
      // sessionStorage.getItem("scanInvoicingData")
      // sessionStorage.removeItem("scanInvoicingData")
    },


    // 清空
    toEmpty() {
      for (let key in this.recipientInfo) {
        this.recipientInfo[key] = ''
      }

      let str = JSON.stringify(this.tableData_el)
      this.tableData = []
      // for (let i = 0; i < 7; i++) {
      //   this.tableData.push(JSON.parse(str))
      // }
      this.fillUp()

      this.sellerForm.remarks = ''

    },


    // 打印设置框数据
    getForm(val) {
      console.log('printVal', val)
      this.printFormInfo = val
      // this.pintVisible = false
    },
    // 打印按钮
    invoicing() {
      // 发票剩余份数
      if (this.invoiceCount == '0') {
        this.$alert('发票已用完，无法开具发票!', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        });
        return
      }

      this.goodsDetail = []
      // 校验信息
      let check = this.checkInfo()
      if (!check) return
      if (!localStorage.getItem("cefSharpinit_xp")){
        this.$confirm("找不到打印机,请先进行打印机设置", "提示", {
                confirmButtonText: "去设置",
                cancelButtonText: "取消",
                type: "warning",
            })
            .then(() => {
                this.printType = "cefSharpinit_xp";
                this.printVisible = true;
            })
            .catch(() => {});
            return;
      }
      if(JSON.parse(localStorage.getItem("cefSharpinit_xp")) && JSON.parse(localStorage.getItem("cefSharpinit_xp")).printName == ''){
        this.$confirm("找不到打印机,请先进行打印机设置", "提示", {
          confirmButtonText: "去设置",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.printVisible = true;
            this.printType = "cefSharpinit_xp";
          })
          .catch(() => {});
          return
      }
      if((!this.sellerForm.addressOrTel || !this.sellerForm.account) && (this.invoiceTypeVal == '004' || this.invoiceTypeVal == '028')){
        this.$alert("销售方信息不完善，请填写！", "提示", {
          confirmButtonText: "确定",
          type: "warning"
        });
        return false;
      }
     
      // // 本地存储打印机的key值
      // let cefSharpinit_zp = JSON.parse(localStorage.getItem('cefSharpinit_zp'));  //专票打印机
      // let cefSharpinit_pp = JSON.parse(localStorage.getItem('cefSharpinit_pp'));  //普票打印机
      // // cefSharpinit_jdc  //机动车打印机
      // // cefSharpinit_qd   //清单打印机
      // // cefSharpinit_js   //卷式打印机
      // if (!cefSharpinit_zp && (this.invoiceTypeVal == '004' || this.invoiceTypeVal == '028')) {
      //     this.$confirm("找不到打印机,请先进行打印机设置", "提示", {
      //       confirmButtonText: "去设置",
      //       cancelButtonText: "取消",
      //       type: "warning",
      //     })
      //     .then(() => {
      //       this.printVisible = true;
      //       this.printType = "cefSharpinit_zp";
      //     })
      //     .catch(() => {});
      //     return;
      // }
      // else if (!cefSharpinit_pp && (this.invoiceTypeVal == '007' || this.invoiceTypeVal == '026')) {
      //     this.$confirm("找不到打印机,请先进行打印机设置", "提示", {
      //       confirmButtonText: "去设置",
      //       cancelButtonText: "取消",
      //       type: "warning",
      //     })
      //     .then(() => {
      //       this.printVisible = true;
      //       this.printType = "cefSharpinit_pp";
      //     })
      //     .catch(() => {});
      //     return;
      // }
      // else if (this.invoiceTypeVal != '004' && this.invoiceTypeVal != '028' && this.invoiceTypeVal != '007' && this.invoiceTypeVal != '026') {
      //     this.$alert('当前发票类型不支持打印!', '提示', {
      //         confirmButtonText: '确定',
      //         type: 'warning'
      //     });
      //     return;
      // }
      // 小票设置是否保存成功
      let params = this.taxDiskNum
      setInfo(params).then(response => {
        if (response && response.code == '200') {
          let res = response.data
          if (res.shopShortName && res.address && res.phone && res.validityDays) {
            this.$alert('是否确定打印小票？', '提示', {
              confirmButtonText: '确定',
              // callback: action => {
              //   if (!this.sendOrPrint) {
              //     this.addInvoicingAjax('打印')
              //   }
              // }
            }).then(()=>{
              if (!this.sendOrPrint) {
                  this.addInvoicingAjax('打印')
                }
            }).catch(()=>{
              
            })
          } else {
            this.$alert('请点击”设置“按钮，去完成小票设置后重试', '提示', {
              confirmButtonText: '确定',
              type: 'warning',
              // callback: action => {
              //   this.$router.push({
              //     name: 'setInvoicing',
              //     query: {
              //       List: JSON.stringify({
              //         data: this.toSaveLocal(),
              //         type: '',
              //       })
              //     }
              //   })
              // }
            }).then(()=>{
                this.$router.push({
                  name: 'setInvoicing',
                  query: {
                    List: JSON.stringify({
                      data: this.toSaveLocal(),
                      type: '',
                    })
                  }
                })
            }).catch(()=>{
              
            });
          }
        }
      }).catch(error => { })
    },
    // 打印按钮
    invoicingPrintAjax() {
      ticketPrint([this.pollingData]).then(response =>{
        if(response.data){
          let params1 = {
              printer:{
                  printName:JSON.parse(localStorage.getItem("cefSharpinit_xp")).printName, //打印机名称,
                  pageWidth:JSON.parse(localStorage.getItem("cefSharpinit_xp")).offsetX, //打印宽度mm
              },
              ticketInfo:response.data
          };
          PrintTicket(params1).then(res =>{
              if(res.code==0){
                  this.$message.success('打印成功');
              }
          })
        }
      })
      // let printGoodsDetail = []
      // for (let i = 0; i < this.tableData.length; i++) {
      //   const el = this.tableData[i];
      //   let obj = {
      //     goodsName: el.name,   // goodsName (string, optional): 商品名称 ,
      //     spec: el.model,       // spec (string, optional): 规格型号 ,
      //     unit: el.unit,        // unit (string, optional): 计量单位 ,
      //     count: el.count,      // count (string, optional): 商品数量 ,
      //     price: el.priceView,  // price (string, optional): 单价 ,
      //     priceAmount: el.amountView,   // priceAmount (string, optional): 金额 ,
      //     taxRate: el.taxRate,  // taxRate (string, optional): 税率 ,
      //     taxAmount: el.tax     // taxAmount (string, optional): 税额
      //   }
      //   printGoodsDetail.push(obj)
      // }


      // let params = {
      //   printer: {
      //     printName: this.printFormInfo.printNum,              // printName (string): 打印机名称 ,
      //     offsetX: this.printFormInfo.numzp,                   // offsetX (number): x轴偏移量 ,
      //     offsetY: this.printFormInfo.zpnum                    // offsetY (number): y轴偏移量
      //   },
      //   invoice: {
      //     "deviceNo": "string",   // deviceNo (string, optional): 机器编码 ,
      //     invoiceType: this.invoiceTypeVal,   // invoiceType (string): 发票类型 ,
      //     invoiceCode: this.invoiceCode,      // invoiceCode (string): 发票代码 ,
      //     invoiceNo: this.invoiceNum,         // invoiceNo (string): 发票号码 ,
      //     sellerTaxId: this.sellerForm.identifier,    // sellerTaxId (string, optional): 销方税号 ,
      //     sellerName: this.sellerForm.name,           // sellerName (string, optional): 销方名称 ,
      //     sellerAddressTel: this.sellerForm.addressOrTel, // sellerAddressTel (string, optional): 销方地址电话 ,
      //     sellerBank: this.sellerForm.account,            // sellerBank (string, optional): 销方银行账号 ,
      //     "buyerTaxId": "string",     // buyerTaxId (string, optional): 购方税号 ,
      //     "buyerName": "string",      // buyerName (string, optional): 购方名称 ,
      //     "buyerAddressTel": "string",// buyerAddressTel (string, optional): 购方地址电话 ,
      //     "buyerBank": "string",      // buyerBank (string, optional): 购方银行账号 ,
      //     priceAmount: this.totalPrice.totalAmount,   // priceAmount (string, optional): 合计金额 ,
      //     taxAmount: this.totalPrice.totalTax,        // taxAmount (string, optional): 合计税额 ,
      //     totalAmount: this.totalPrice.priceTaxSmall, // totalAmount (string, optional): 价税合计 ,
      //     totalAmountCN: this.totalPrice.priceTaxBig, // totalAmountCN (string, optional): 价税合计中文 ,
      //     payee: this.payee,              // payee (string, optional): 收款人 ,
      //     reviewer: this.issuer,          // reviewer (string, optional): 复核人 ,
      //     issuer: this.reviewer,          // issuer (string, optional): 开票人 ,
      //     invoiceDate: this.invoiceDate,  // invoiceDate (string, optional): 开票日期 ,
      //     "cipher": "string",     // cipher (string, optional): 密码区 ,
      //     "verifyCode": "string", // verifyCode (string, optional): 校验码 ,
      //     "qrCode": "string",     // qrCode (string, optional): 二维码 ,
      //     remark: this.sellerForm.remarks,    // remark (string, optional): 备注 ,
      //     "specialInvoiceType": "string",     // specialInvoiceType (string, optional): 特殊票种(“00”不是 “02”农产品收购) ,
      //     goodsDetail: printGoodsDetail
      //   }
      // }
      // PrintInvoiceApi(params).then(response => {
      //   if (response && response.code == '0') {
      //     this.$message.success('打印成功');
      //     let res = response.data
      //     let parameterSet = localStorage.getItem("initSetParameter") ? JSON.parse(localStorage.getItem("initSetParameter")) : '';
      //     // 发票预览判断
      //     if (parameterSet.preview == "打印时预览发票") {
      //       // this.invoicePrievw(res.data)
      //     }

      //     // this.pintVisible =true
      //     // // this.$print(this.$refs.taxPic)
      //     // let ossUrl = this.$store.state.settings.ossURL.trim()
      //     // console.log('确定打印小票 ossurl', ossUrl)
      //     // getBase64( ossUrl, (URL) => { console.log('打印 base64', URL) } )
      //   }
      // }).catch(error => { })
    },

    // 发票信息校验
    checkInfo() {
      if (!this.invoiceTypeVal) {
        this.$alert('请选择发票类型!', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        });
        return false
      }

      // 商品信息
      if (!this.totalPrice.totalAmount) {
        this.$alert('发票金额与开票类型不符(发票金额为负或零)', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        });
        return false
      } else {
        for (let i = 0; i < this.tableData.length; i++) {
          const el = this.tableData[i];
          if (el.name || el.model || el.unit || el.count || el.priceView || el.amountView || el.taxRate || el.tax) {
            if (!el.name) {
              this.$alert(`第${i + 1}行商品信息不完善,请重新输入！`, '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              });
              return false
            }
            else if (!el.taxRate && el.taxRate!== 0) {
              console.log(el.taxRate)
              this.$alert(`第${i + 1}行,请选择税率！`, '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              });
              return false
            }
            else if (!el.amountView) {
              this.$alert(`第${i + 1}行商品信息不完善,请重新输入！`, '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              });
              return false
            }
            else if (!el.tax) {
              this.$alert(`第${i + 1}行商品信息有误,请重新输入！`, '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              });
              return false
            }
            else {
              this.toDealGoodsTable(el)
            }
          }
        }
      }

      // 销售方

      if ((!this.sellerForm.name || !this.sellerForm.identifier) && (this.invoiceTypeVal == '004' || this.invoiceTypeVal == '028')) {
        this.$alert('销售方信息不完善，请填写！', '提示', {
          confirmButtonText: '确定',
        });
        return false
      }

      // 票尾
      if (!this.reviewer) {
        this.$alert('开票人信息不完善，请填写！', '提示', {
          confirmButtonText: '确定',
        });
        return false
      }

      return true
    },


    // 添加开票逻辑
    addInvoicingAjax(val) {
      console.log(val)
      this.mainProductName = '*' + this.goodsDetail[0].goodsShortName + '*' + this.goodsDetail[0].goodsName

      let params = {
        buyerAddrTel: '',
        buyerBankAccount: '',
        buyerName: '',      // *
        buyerTaxId: '',
        pushMail: '',	    //string  //推送邮箱
        pushPhone: '',	    //string  //推送手机号
        mailAddress: '',	//string  //邮寄地址
        ticketPushMail: this.recipientInfo.email,	//string  //小票推送邮箱
        ticketPushPhone: this.recipientInfo.tel,	 //string  //小票推送手机号
        companyUserId: this.companyUserId,                              // 企业开票人员ID
        differentialTaxationAmount: this.differentialTaxationAmount,    // 差额征税扣除额
        goodsCommonDetail: this.goodsDetail,
        cause: this.historyInvoicingData ? this.historyInvoicingData.cause : '',	//string  //原因
        createDate: '',	                    //string($date)   //创建日期
        endDate: '',	                    //string($date)   //截止时间
        id: '',	                            //integer($int64) ID
        invoiceSeries: this.historyInvoicingData ? this.historyInvoicingData.invoiceSeries : '',	  //integer($int64) //开票流水号
        invoiceType: this.invoiceTypeVal,	        //string  //发票类型 004、007、026、028
        mainProductName: this.mainProductName,	    //string  //主要商品名称
        remark: this.sellerForm.remarks,	        //string  //备注
        rqCodeUrl: '',	                            //string
        sellerAddrTel: this.sellerForm.addressOrTel,    //string  //销售方地址电话
        sellerBankAccount: this.sellerForm.account,	    //string  //销售方开户银行账号
        sellerName: this.sellerForm.name,               //string  //销售方名称
        sellerTaxId: this.sellerForm.identifier,        //string  //销售方税号
        skr: this.payee,	            //string  //收款人
        fhr: this.issuer,	            //string  //复核人
        kpr: this.reviewer,	            //string  //开票人
        status: this.historyInvoicingData ? this.historyInvoicingData.status : '',	    //integer($int32) //状态 0.未开 1.过期 2.开票成功 3.开票失败 4.作废 5.退回
        taxDiskNum: this.taxDiskNum,                        //string  //所属税盘
        taxationType: this.taxMethodVal,	                //integer($int32) //征税方式 0：普通征税 1：减按计征 2：差额征税
        totalAmount: this.totalPrice.totalAmount,	        //number  //总金额(不含税金额)
        totalPriceWithTax: this.totalPrice.priceTaxSmall,   //number  //价税合计
        totalTaxAmount: this.totalPrice.totalTax,	        //number  //总税额
      }
      addScanInvoice(params).then((res) => {
        if (res && res.code == '200') {
          // console.log(8888888,response)
          let box = res.data
          this.pollingData = box ? box : ''
          if (val == '发送') {
            this.toSendFlag = true
            this.toSendAjax()
          } else if (val == '打印') {
            this.invoicingPrintAjax()

          }

        }
      }).catch(error => {
        this.sendOrPrint = false
      })

    },
    // 商品列表数据处理
    toDealGoodsTable(el) {
      console.log('商品列表数据处理', el)
      let gName = ''
      let shortName = ''
      if (el.name && el.name.indexOf('*') != '-1') {
        let arr = el.name.split('*')
        shortName = arr[1]
        gName = arr[2]
      } else {
        gName = el.name
      }
      // 处理请求接口所需商品字段
      let obj = {
        createTime: el.createTime,	                //创建时间
        goodsAmount: parseFloat(el.amountView),     //number //商品金额----（tableData）
        goodsCode: el.taxClassificationCode ? el.taxClassificationCode : el.goodsCode,	    //string //商品编码---  taxClassificationCode
        goodsName: gName,	                          //string //商品名称---- goodsName/（tableData）
        goodsNumber: parseFloat(el.count),	                    //number //商品数量----（tableData）
        goodsPrice: parseFloat(el.priceView),	                //number //商品单价----（tableData）
        goodsSelfCode: el.goodsSelfCode,	          //string //商品自行编码--- goodsSelfCode
        goodsShortName: shortName,	                //string //商品简称（税收分类简称）--- 从goodsName中分割*获取
        goodsSubName: el.taxClassificationName ? el.taxClassificationName : el.goodsSubName,	    //string //税目名称(又叫商品分类编码简称)--- taxClassificationName
        id: el.id,	                                //integer($int64) //ID
        incentivesLabel: el.incentivesLabel,        //string //优惠政策标识 无免税100%先征后退50%先征后退不征税先征后退即征即退100%即征即退30% 即征即退50% 即征即退70% 按3%简易征收,按5%简易征收,稀土产品/简易征收/超税负12%即征即退超税负3%即征即退,超税负8%即征即退----incentivesLabel
        // invoiceSeries: '',	                    //integer($int64) //流水号---   ???
        isTax: this.isTaxIncluded ? 1 : 0, 	      //integer($int32) //含税状态 0：否 1：是----（tableData）
        lineNature: 0,	              //integer($int32) //发票行性质 0：无折扣行商品 1.折扣行2.有折扣行商品 3.（详见清单列表）4.折扣行总和--- ???
        specifications: el.model,	    //string //规格型号----（tableData）
        taxAmount: parseFloat(el.tax),	            //number //税额----（tableData）
        taxRate: el.taxRate,	          //number //税率----（tableData）
        unit: el.unit,	                //string //单位----（tableData）
        zeroTaxMarks: el.zeroTaxMarks,	//string //零税率标识，空代表正常税率1 出口免税和其他免税优惠政策（免税）2 不征增值税（不征税）3 普通零税率（0%）---- zeroTaxMarks
      }
      if (el.isDiscount) {
        if (el.isDiscountLine) {
          obj.lineNature = 1
        } else {
          obj.lineNature = 2
        }
      }

      this.goodsDetail.push(obj);
    },


    // 发票模块事件 ==================================================

    // 校验手机号
    watchTel() {
      let str = this.recipientInfo.tel
      if (parseInt(str) == str) {
        this.recipientInfo.tel = str.length > 11 ? str.substring(0, 11) : str
      }
    },
    checkTel() {
      let reg = validPhone(this.recipientInfo.tel)
      if (!reg && this.recipientInfo.tel) {
        this.$alert('手机号格式有误,请重新输入！', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          callback: action => {
            this.recipientInfo.tel = ''
          }
        });
      }
    },
    // 校验邮箱
    checkEmail() {
      let reg = validEamil(this.recipientInfo.email)
      if (!reg && this.recipientInfo.email) {
        this.$alert('邮箱格式有误,请重新输入！', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          callback: action => {
            this.recipientInfo.email = ''
          }
        });
      }
    },


    // 商品联想框
    inputName(event, index) {
      this.indexBox = index
      this.LenovoBoxVisible = false
      let dom = this.$refs['LenovoBox']
      let parHeight = event.currentTarget.getBoundingClientRect().y - 10
      dom.style.top = parHeight + 'px'
    },
    watchName(item, index) {
      let _this = this
      if (_this.tableData[index].name) {
        _this.dataList = []
        clearTimeout(_this.timer)
        _this.timer = setTimeout(function () {
          _this.lenovoAjax(index)
        }, 2000)
      } else {
        _this.LenovoBoxVisible = false
      }
    },
    lenovoDetermine(item) {
      console.log('lenovo', item, this.indexBox)
      // 差额征税--弹框
      if (this.taxMethodVal == 2) {
        // ---------------------需商品页面限制只能选一条数据
        let objs = item
        objs.fastFlag = 0
        let obj = this.toDealGoods(objs)
        obj.price = ''
        obj.priceView = ''
        obj.amount = ''
        obj.amountView = ''
        obj.tax = ''
        obj.taxC = ''
        this.tableData.splice(this.indexBox, 1, obj);
        this.differenceVisible = true
        this.LenovoBoxVisible = false
        return
      }

      let obj = this.toDealGoods(item)
      this.tableData.splice(this.indexBox, 1, obj);
      this.LenovoBoxVisible = false
    },
    lenovoAjax(index) {
      let params = {
        goodsName: this.tableData[index].name,
        taxDiskNumber: this.taxDiskNum     //税控盘编号
      }
      lenovo(params).then(response => {
        if (response && response.code == '200') {
          let res = response.data
          if (res.length > 0) {
            this.dataList = res
            this.LenovoBoxVisible = true
          } else {
            this.$confirm('未查询到符合条件的商品, 点击“确定”快速新增商品。', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.selectProduct('',index)
              // this.autoCodeAjax(index)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消新增商品'
              });
              this.LenovoBoxVisible = false
              this.tableData[index].name = ''
            });
          }
        }
        // this.$alert('数据异常，请重新输入！', '提示', {
        //     confirmButtonText: '确定',
        //     type: 'warning',
        //     // callback: action => {
        //     //     this.recipientInfo.email = ''
        //     // }
        // });
      }).catch(error => { })
    },
    autoCodeAjax(index) {
      let params = {
        goodsName: this.tableData[index].name,
      }
      autoCode(params).then(response => {
        if (response && response.code == '200') {
          let res = response.data
          if (res.length > 0) {
            this.dataList = res
            this.LenovoBoxVisible = true
            // const el = res[0]
            // this.tableData[index].name = '*' + el.goodsShortName + '*' + el.goodsName
          } else {
            this.$message({
              type: 'info',
              message: '智能赋码失败，请手动去选择税收编码！'
            });
            this.tableData[index].name = ''
            this.LenovoBoxVisible = false
          }
        } else {
          this.$message({
            type: 'info',
            message: '新增商品失败！'
          });
          this.tableData[index].name = ''
          this.LenovoBoxVisible = false
        }
      }).catch(error => { })
    },



    // 双击选择商品
    selectProduct(item, index) {
      this.index = index
      this.selectProductVisible = true
    },
    // 商品组件Cancel
    selectProductCancel() {
      this.selectProductVisible = false
    },
    // 商品组件Determine
    selectProductDetermine(vals, index) {
      this.selectProductVisible = false
      let val = JSON.parse(JSON.stringify(vals))
      if (this.taxMethodVal != 1) {
        this.toPreDealTaxRate(val)
      }
      // 差额征税--弹框
      if (this.taxMethodVal == 2) {
        // ---------------------需商品页面限制只能选一条数据
        let objs = val[0]
        objs.scanFlag = 0
        let obj = this.toDealGoods(objs)
        obj.price = ''
        obj.priceView = ''
        obj.amount = ''
        obj.amountView = ''
        obj.tax = ''
        obj.taxC = ''
        this.tableData.splice(index, 1, obj);
        this.differenceVisible = true
        return
      }

      // 将商品组件选择后 带回的数据val，进行处理。
      if (val.length == 1) {
        let objs = val[0]
        objs.scanFlag = 0
        let obj = this.toDealGoods(objs)
        this.tableData.splice(index, 1, obj);
      } else {
        for (let i = 0; i < val.length; i++) {
          let objs = val[i]
          objs.scanFlag = 0
          let obj = this.toDealGoods(objs)
          this.tableData.splice(index + i, 1, obj);
        }
      }

      console.log('最终商品结果', this.tableData)
    },
    // 商品参数处理
    toDealGoods(val) {
      let obj = { ...this.tableData_el, ...val }
      let shortName = val.taxClassificationShortName ? val.taxClassificationShortName : val.goodsShortName
      obj.name = '*' + shortName + '*' + val.goodsName
      obj.model = val.specifications

      // obj.unit = ''
      // obj.count = ''
      obj.price = val.goodsPrice
      obj.priceView = val.goodsPrice
      // obj.amount = ''
      // obj.amountView = ''
      obj.taxRate = this.toDealTaxRate(obj.taxRate)
      // obj.tax = ''
      if (obj.taxRate == 0 && obj.zeroTaxMarks) {
          obj.disSelectFlag = true
      }else {
          obj.disSelectFlag = false
      }

      if (!obj.taxRate && this.taxMethodVal != 1) {
          obj.taxRate = 0
      }

      if (val.scanFlag == 1 || val.scanFlag == 2 || val.scanFlag == 3) {
        obj.isPermanent = true
      } else {
        obj.isPermanent = false
      }

      if (this.isTaxIncluded) {
        // 页面为含税
        if (val.taxLogo == 1) {
          // 数据为含税
          if (obj.priceView && obj.taxRate) {
            let prices = parseFloat(obj.price)
            let taxRates = parseFloat(obj.taxRate)
            // let resPrice = prices * (taxRates + 1)
            let resPrice = prices
            obj.price = resPrice
            obj.priceView = parseFloat(resPrice.toFixed(8))
          }
        } else {
          // 数据为不含税
          if (obj.priceView && obj.taxRate) {
            let taxRates = parseFloat(obj.taxRate)
            let resPrice = parseFloat(obj.price) * (taxRates + 1)
            obj.price = resPrice
            obj.priceView = parseFloat(resPrice.toFixed(8))
          }
        }
      } else {
        // 页面为不含税
        if (val.taxLogo == 1) {
          // 数据为含税
          if (obj.priceView && obj.taxRate) {
            let prices = parseFloat(obj.price)
            let taxRates = parseFloat(obj.taxRate)
            let resPrice = prices / (taxRates + 1)
            obj.price = resPrice
            obj.priceView = parseFloat(resPrice.toFixed(8))
          }
        } else {
          // 数据为不含税
          if (obj.priceView && obj.taxRate) {
            let taxRates = parseFloat(obj.taxRate)
            // let resPrice = parseFloat(val.price) / (taxRates + 1)
            let resPrice = parseFloat(obj.price)
            obj.price = resPrice
            obj.priceView = parseFloat(resPrice.toFixed(8))
          }
        }
      }
      return JSON.parse(JSON.stringify(obj))
    },
    // 路由跳转-商品详情处理
    toDealGoodsDetail(val) {
      let obj = { ...this.tableData_el, ...val }
      obj.name = '*' + val.goodsShortName + '*' + val.goodsName
      obj.model = val.specifications
      // obj.unit = val.unit
      obj.count = val.goodsNumber
      obj.price = val.goodsPrice
      obj.priceView = val.goodsPrice
      if(val.goodsNumber&&val.goodsPrice){
        obj.amount = parseFloat(val.goodsNumber*val.goodsPrice).toFixed(8);
      }else{
        obj.amount = val.goodsAmount;
      }
      obj.amountView = val.goodsAmount
      obj.taxRate = this.toDealTaxRate(obj.taxRate)
      obj.tax =val.taxAmount!=null? parseFloat(val.taxAmount).toFixed(2): ''
      obj.taxC =val.taxAmount!=null? parseFloat(val.taxAmount).toFixed(2): ''
      // obj.isPermanent = val.scanFlag == 1 ? true:false
      if (this.isTaxIncluded) {
        // 页面为含税
        if (val.isTax == 0) {
          // 数据为不含税
          if (obj.priceView && obj.taxRate) {
            let prices = parseFloat(obj.price)
            let taxRates = parseFloat(obj.taxRate)
            let resPrice = prices * (taxRates + 1)
            obj.price = resPrice
            obj.priceView = parseFloat(resPrice.toFixed(8))
          }
          if (obj.amountView && obj.taxRate) {
            let amounts = parseFloat(obj.amount)
            let taxRates = parseFloat(obj.taxRate)
            let resAmount = amounts * (taxRates + 1)
            obj.amount = resAmount
            obj.amountView = parseFloat(resAmount.toFixed(2))
          }
        } else {
          // 数据为含税
          if (obj.priceView && obj.taxRate) {
            let taxRates = parseFloat(obj.taxRate)
            let resPrice = parseFloat(obj.price)
            obj.price = resPrice
            obj.priceView = parseFloat(resPrice.toFixed(8))
          }
          if (obj.amountView && obj.taxRate) {
            let amounts = parseFloat(obj.amount)
            let taxRates = parseFloat(obj.taxRate)
            let resAmount = amounts
            obj.amount = resAmount
            obj.amountView = parseFloat(resAmount.toFixed(2))
          }
        }
      } else {
        // 页面为不含税
        if (val.isTax == 1) {
          // 数据为含税
          if (obj.priceView && obj.taxRate) {
            let prices = parseFloat(obj.price)
            let taxRates = parseFloat(obj.taxRate)
            let resPrice = prices / (taxRates + 1)
            obj.price = resPrice
            obj.priceView = parseFloat(resPrice.toFixed(8))
          }
          if (obj.amountView && obj.taxRate) {
            let amounts = parseFloat(obj.amount)
            let taxRates = parseFloat(obj.taxRate)
            let resAmount = amounts / (taxRates + 1)
            obj.amount = resAmount
            obj.amountView = parseFloat(resAmount.toFixed(2))
          }
        } else {
          // 数据为不含税
          if (obj.priceView && obj.taxRate) {
            let taxRates = parseFloat(obj.taxRate)
            let resPrice = parseFloat(obj.price)
            obj.price = resPrice
            obj.priceView = parseFloat(resPrice.toFixed(8))
          }
          if (obj.amountView && obj.taxRate) {
            let amounts = parseFloat(obj.amount)
            let taxRates = parseFloat(obj.taxRate)
            let resAmount = amounts
            obj.amount = resAmount
            obj.amountView = parseFloat(resAmount.toFixed(2))
          }
        }
      }
      return JSON.parse(JSON.stringify(obj))
    },


    // 页面初始化常驻商品
    toPermanentInit() {
      let params = {
        taxDiskNum: this.taxDiskNum,
        taxType: this.taxMethodVal + 1,
        type: 1     //类型(0:闪电开票常驻 1:扫码开票常驻)
      }
      residentDefault(params).then(response => {
        if (response && response.code == '200') {
          let res = response.data
          if (this.taxMethodVal == 2) {
            res[0].scanFlagID = res[0].id
            let obj = this.toDealGoods(res[0])
            this.tableData.splice(0, 1, obj);
          } else {
            for (let i = 0; i < res.length; i++) {
              res[i].scanFlagID = res[i].id
              let obj = this.toDealGoods(res[i])
              this.tableData.splice(i, 1, obj);
            }
            if (res.length>0) {
                this.toAdd()
            }
          }
          console.log('初始化常驻商品', res)
        }
      }).catch(error => { })
      this.computerTotalPrice()
    },
     // 页面初始化常驻商品
    toPermanentInit1() {
      let params = {
        taxDiskNum: this.taxDiskNum,
        taxType: this.taxMethodVal + 1,
        type: 1     //类型(0:闪电开票常驻 1:扫码开票常驻)
      }
      residentDefault(params).then(response => {
        if (response && response.code == '200') {
          let res = response.data
          this.invoiceTypeChange()
          if (this.taxMethodVal == 2) {
            res[0].scanFlagID = res[0].id
            let obj = this.toDealGoods(res[0])
            this.tableData.splice(0, 1, obj);
          } else {
            for (let i = 0; i < res.length; i++) {
              res[i].scanFlagID = res[i].id
              let obj = this.toDealGoods(res[i])
              this.tableData.splice(i, 1, obj);
            }
            if (res.length>0) {
                this.toAdd()
            }
          }
          console.log('初始化常驻商品', res)
        }
      }).catch(error => { })
      this.computerTotalPrice()
    },
    // 常驻or取消常驻
    toPermanent(item, index) {
      console.log('item', item, index);
      let flag = !item.isPermanent
      let scanFlag = 0
      if (flag) {
        if (this.taxMethodVal == 0) scanFlag = 1
        if (this.taxMethodVal == 1) scanFlag = 2
        if (this.taxMethodVal == 2) scanFlag = 3
      }
      let gName = ''
      let shortName = ''
      if (item.name && item.name.indexOf('*') != '-1') {
        let arr = item.name.split('*')
        shortName = arr[1]
        gName = arr[2]
      } else {
        gName = item.name
      }

      let params = {
        taxClassificationShortName: shortName,
        goodsName: gName,
        specifications: item.model,
        unit: item.unit,
        goodsPrice: this.taxMethodVal == 2 ? '':item.priceView,
        taxRate: item.taxRate,
        scanFlag: scanFlag,
        taxLogo: this.isTaxIncluded ? 1 : 0,
        fastFlag: item.fastFlag ? item.fastFlag : '',
        id: item.scanFlagID ? item.scanFlagID : '',
        createTime: item.createTime ? item.createTime : '',
        goodsSelfCode: item.goodsSelfCode ? item.goodsSelfCode : '',
        incentivesLabel: item.incentivesLabel ? item.incentivesLabel : '',
        taxClassificationCode: item.taxClassificationCode ? item.taxClassificationCode : '',
        taxClassificationName: item.taxClassificationName ? item.taxClassificationName : '',
        // taxDiskNumber: item.taxDiskNumber ? item.taxDiskNumber:'',
        taxDiskNumber: this.taxDiskNum,
        typeId: item.typeId ? item.typeId : '',
        zeroTaxMarks: item.zeroTaxMarks ? item.zeroTaxMarks : ''
      }
      setResident(params).then(response => {
        if (response && response.code == '200') {
          let res = response.data
          this.tableData[index].isPermanent = flag

        }
      }).catch(error => { })
    },


    // 复制
    toCopy(item, index) {
      let str = JSON.stringify(item)
      let obj = JSON.parse(str)
      obj.isPermanent = false
      if (obj.isDiscount) {
          obj.isDiscount = false
          this.tableData.splice(index+2, 0, obj);
      }else {
          this.tableData.splice(index+1, 0, obj);
      }
      this.computerTotalPrice()
    },

    // 增行
    toAdd(item, index) {
      console.log('item', item, index);
      let str = JSON.stringify(this.tableData_el)
      this.tableData.push(JSON.parse(str))
    },

    // 删除
    toRemove(item, index) {
      if (item.isDiscount) {
        if (item.isDiscountLine) {
          this.tableData.splice(index, 1)
          this.tableData[index - 1].isDiscount = false
        } else {
          this.$alert('请先删除折扣行', '提示', {
            confirmButtonText: '确定',
          });
        }
      } else {
        this.tableData.splice(index, 1);
      }
      this.fillUp()
    },

    // 填补商品表格
    fillUp() {
      // if (this.tableData.length < 7) {
      //   let count = 7 - this.tableData.length
      //   for (let i = 0; i < count; i++) {
      //     let str = JSON.stringify(this.tableData_el)
      //     this.tableData.push(JSON.parse(str))
      //   }
      // }
      if (this.tableData.length == 0) {
          let str = JSON.stringify(this.tableData_el)
          this.tableData.push(JSON.parse(str))
      }
      this.computerTotalPrice()
    },



    // 商品表单计算--------------------------------------
    watchCount(item, index) {
      //格式校验
      let num = this.tableData[index].count.replace(/[^\d\.]/g,'')
      this.tableData[index].count = this.checkNum(num, 9, 6)
      if (num == '') {
          if(this.taxMethodVal == 2){
              this.tableData[index].price = ''
              this.tableData[index].priceView = this.tableData[index].price
              // this.computerTaxs(index)
          }else{
              this.tableData[index].amount = ''
              this.tableData[index].amountView = this.tableData[index].amount
              this.computerTaxs(index)
          }
          return
      }
      console.log('格式count', num)

      let counts = parseFloat(this.tableData[index].count)
      let prices = parseFloat(this.tableData[index].price)
      let amounts = parseFloat(this.tableData[index].amount)
      if (counts && prices && amounts) {
        if (this.taxMethodVal == 2) {
          let resPrice = amounts / counts
          this.tableData[index].price = resPrice
          this.tableData[index].priceView = parseFloat(resPrice.toFixed(8))
          return
        }
        this.computerAmounts(index, counts, prices)
        this.computerTaxs(index)
      } else {
        if (counts && prices) {
          // 数量、单价
          let resAmount = counts * prices
          this.tableData[index].amount = resAmount
          this.tableData[index].amountView = parseFloat(resAmount.toFixed(2))
          this.computerTaxs(index)
          this.tableData[index].isBlur = true
        } else if (counts && amounts) {
          // 数量、金额
          let resPrice = amounts / counts
          this.tableData[index].price = resPrice
          this.tableData[index].priceView = parseFloat(resPrice.toFixed(8))
          this.computerTaxs(index)
        } else if (!counts) {
          if(this.taxMethodVal == 2){
              this.tableData[index].price = ''
              this.tableData[index].priceView = this.tableData[index].price
              // this.computerTaxs(index)
          }else{
              this.tableData[index].amount = ''
              this.tableData[index].amountView = this.tableData[index].amount
              this.computerTaxs(index)
          }
        }
      }
      // this.computerTaxs(index)
    },
    watchPrice(item, index) {
      //格式校验
      let num = this.tableData[index].priceView.replace(/[^\d\.]/g,'')
      this.tableData[index].priceView = this.checkNum(num, 9, 8)

      this.tableData[index].price = this.tableData[index].priceView
      this.tableData[index].amount = this.tableData[index].amountView
      if (num == '') {
          this.tableData[index].amount = ''
          this.tableData[index].amountView = this.tableData[index].amount
          this.computerTaxs(index)
          return
      }

      let counts = parseFloat(this.tableData[index].count)
      let prices = parseFloat(this.tableData[index].price)
      let amounts = parseFloat(this.tableData[index].amount)
      if (counts && prices && amounts) {
        this.computerAmounts(index, counts, prices)
        this.computerTaxs(index)
      } else {
        if (prices && counts) {
          // 单价、数量
          let resAmount = counts * prices
          this.tableData[index].amount = resAmount
          this.tableData[index].amountView = parseFloat(resAmount.toFixed(2))
          this.computerTaxs(index)
          this.tableData[index].isBlur = true
        } else if (prices && amounts) {
          // 单价、金额(数量不存在)
          this.tableData[index].amount = ''
          this.tableData[index].amountView = this.tableData[index].amount
          this.computerTaxs(index)
        } else if (!prices) {
          this.tableData[index].amount = ''
          this.tableData[index].amountView = this.tableData[index].amount
          this.computerTaxs(index)
        }
      }
      // this.computerTaxs(index)
    },
    watchAmount(item, index) {
      //格式校验
      let num = this.tableData[index].amountView.replace(/[^\d\.]/g,'')
      this.tableData[index].amountView = this.checkNum(num, 9, 2)
      if (num == '') {
          this.computerTaxs(index)
          return
      }

      this.tableData[index].price = this.tableData[index].priceView
      this.tableData[index].amount = this.tableData[index].amountView

      let counts = parseFloat(this.tableData[index].count)
      let prices = parseFloat(this.tableData[index].price)
      let amounts = parseFloat(this.tableData[index].amount)
      if (counts && prices && amounts) {
        let resPrice = amounts / counts
        this.tableData[index].price = resPrice
        this.tableData[index].priceView = parseFloat(resPrice.toFixed(8))
        // if (this.tableData[index].isBlur) {
        //   //已失焦，算price
        //   let resPrice = amounts / counts
        //   this.tableData[index].price = resPrice
        //   this.tableData[index].priceView = parseFloat(resPrice.toFixed(8))
        // } else {
        //   //默认未失焦，算count
        //   let resCount = amounts / prices
        //   this.tableData[index].count = parseFloat(resCount.toFixed(6))
        // }
      } else {
        if (amounts && counts) {
          // 金额、数量
          let resPrice = amounts / counts
          this.tableData[index].price = resPrice
          this.tableData[index].priceView = parseFloat(resPrice.toFixed(8))
          this.tableData[index].isBlur = true
        } else if (amounts && prices) {
          // 金额、单价(数量不存在)
          // let resCount = amounts / prices
          // this.tableData[index].count = parseFloat(resCount.toFixed(6))
          this.tableData[index].price = ''
          this.tableData[index].priceView = ''
        } else if (!amounts) {
          this.tableData[index].count = ''
        }
      }
      this.computerTaxs(index)
    },
    // 金额栏-失焦事件
    blurAmount(item, index) {
      if (this.tableData[index].count) {
        this.tableData[index].isBlur = true
      }
    },

    // 计算金额方法
    computerAmounts(index, counts, prices) {
      let amounts = counts * prices
      this.tableData[index].amount = amounts
      this.tableData[index].amountView = parseFloat(amounts.toFixed(2))
    },
    // 监听税率--计算税额方法
    computerTaxs(index) {
      let taxs = ''
      // 折扣行税率框同步互联
      if (this.tableData[index].isDiscount) {
          let taxRates = parseFloat(this.tableData[index].taxRate)
          if (this.tableData[index].isDiscountLine) {
              //商品-折扣行
              if (this.tableData[index-1].isDiscount) {
                  this.tableData[index-1].taxRate = taxRates
                  let amounts = parseFloat(this.tableData[index-1].amount)
                  if (this.isTaxIncluded) {
                      // 含税
                      taxs = (amounts * taxRates) / (taxRates + 1)
                      this.tableData[index-1].taxC = taxs
                      this.tableData[index-1].tax = taxs.toFixed(2)
                  }else {
                      // 不含税
                      taxs = amounts * taxRates
                      this.tableData[index-1].taxC = taxs
                      this.tableData[index-1].tax = taxs.toFixed(2)
                  }
              }
          }else {
              //商品-被折扣行
              if (this.tableData[index+1].isDiscount && this.tableData[index+1].isDiscountLine) {
                  this.tableData[index+1].taxRate = taxRates
                  let amounts = parseFloat(this.tableData[index+1].amount)
                  if (this.isTaxIncluded) {
                      // 含税
                      taxs = (amounts * taxRates) / (taxRates + 1)
                      this.tableData[index+1].taxC = taxs
                      this.tableData[index+1].tax = taxs.toFixed(2)
                  }else {
                      // 不含税
                      taxs = amounts * taxRates
                      this.tableData[index+1].taxC = taxs
                      this.tableData[index+1].tax = taxs.toFixed(2)
                  }
              }
          }
      }

      // 差额征收
      if (this.taxMethodVal == 2) {
        let el = this.tableData[index]
        let taxRateStr = el.taxRate + ''
        if (!taxRateStr || !el.amountView) return
        let taxRate = parseFloat(el.taxRate)
        let deduction = this.differentialTaxationAmount ? parseFloat(this.differentialTaxationAmount) : 0

        if (this.isTaxIncluded) {
          // 含税
          // let sales = parseFloat(el.amountView)
          let sales = parseFloat(this.sales)
          let res = (sales - deduction) * taxRate / (taxRate + 1)
          this.tableData[index].taxC = res
          this.tableData[index].tax = res.toFixed(2)

        } else {
          // 不含税
          // let amounts = parseFloat(el.amount)
          // let sales = (amounts - deduction) * (taxRate + 1) + deduction
          // let res = (sales - deduction) * taxRate / (taxRate + 1)
          // this.tableData[index].taxC = res
          // this.tableData[index].tax = res.toFixed(2)

          let sales = parseFloat(this.sales)
          let salesNo = (sales-deduction) / (taxRate + 1 ) + deduction
          this.tableData[0].amount = sales ? salesNo:''
          this.tableData[0].amountView = sales ? parseFloat(salesNo.toFixed(2)):''
          if (el.count && sales) {
              this.tableData[0].price = salesNo / el.count
              this.tableData[0].priceView = parseFloat(this.tableData[0].price.toFixed(8))
          }
          let res = (sales-deduction) * taxRate / (taxRate + 1 )
          this.tableData[index].taxC = res
          this.tableData[index].tax = res.toFixed(2)
        }

      }else if (this.taxMethodVal == 1) {
          // 减按征收
          let el = this.tableData[index]
          let taxRateStr = el.taxRate + ''
          if(!taxRateStr || !el.amountView) return
          let taxRates = parseFloat(el.taxRate)
          let amounts = parseFloat(el.amount)

          if (this.isTaxIncluded) {
              // 含税
              taxs = (amounts * taxRates) / (0.05 + 1)
              this.tableData[index].taxC = taxs
              this.tableData[index].tax = taxs.toFixed(2)
          }else {
              // 不含税
              taxs = amounts * taxRates
              this.tableData[index].taxC = taxs
              this.tableData[index].tax = taxs.toFixed(2)
          }

      } else {
        let taxRateStr = this.tableData[index].taxRate + ''
        if (taxRateStr && this.tableData[index].amountView) {
          let taxRates = parseFloat(this.tableData[index].taxRate)
          let amounts = parseFloat(this.tableData[index].amountView)
          if (this.tableData[index].amountView != amounts) return

          if (this.isTaxIncluded) {
            // 含税
            taxs = (amounts * taxRates) / (taxRates + 1)
            this.tableData[index].taxC = taxs
            this.tableData[index].tax = taxs.toFixed(2)
            console.log('含税')
          } else {
            // 不含税
            taxs = amounts * taxRates
            this.tableData[index].taxC = taxs
            this.tableData[index].tax = taxs.toFixed(2)
            console.log('不含税')
          }
        } else {
          this.tableData[index].tax = ''
        }
      }

      this.computerTotalPrice()
    },

    // 商品价格合计
    computerTotalPrice() {
      let arr = this.tableData
      let totalAmount = 0
      let totalTax = 0

      for (let i = 0; i < arr.length; i++) {
        const el = arr[i];
        if (el.amount && el.tax) {
          totalTax = parseFloat(el.tax) + parseFloat(totalTax)
        } else if (el.amount && !el.tax) {
          this.totalPrice.totalTax = ''
          this.totalPrice.totalAmount = ''
          return
        }
      }
      // 税额合计
      this.totalPrice.totalTax = totalTax.toFixed(2)

      // 差额征收
      if (this.taxMethodVal == 2) {
        let el = this.tableData[0]
        let taxRateStr = el.taxRate + ''
        if (!taxRateStr) return
        if (!el.amountView) return
        let taxRate = parseFloat(el.taxRate)
        let deduction = this.differentialTaxationAmount ? parseFloat(this.differentialTaxationAmount) : 0
        if (this.isTaxIncluded) {
          // 含税
          let sales = parseFloat(el.amountView)
          let res = (sales - deduction) / (taxRate + 1) + deduction
          totalAmount = res

        } else {
          // 不含税
          totalAmount = parseFloat(el.amountView)
        }

      }else if (this.taxMethodVal == 1) {
          // if (this.isTaxIncluded) {
              // 含税
              for (let i = 0; i < arr.length; i++) {
                  const el = arr[i];
                  let taxRateStr = el.taxRate + ''
                  if (el.amount && taxRateStr) {
                      let amounts = parseFloat(el.amountView)
                      let resAmount = amounts.toFixed(2)
                      totalAmount = parseFloat(resAmount) + parseFloat(totalAmount)
                  }else if (el.amountView && !el.tax) {
                      this.totalPrice.totalTaxC = ''
                      this.totalPrice.totalTax = ''
                      this.totalPrice.totalAmountC = ''
                      this.totalPrice.totalAmount = ''
                      return
                  }
              }
          // }else {
          //     // 不含税
          // }
      } else {
        if (this.isTaxIncluded) {
          // 含税
          for (let i = 0; i < arr.length; i++) {
            const el = arr[i];
            let taxRateStr = el.taxRate + ''
            if (el.amount && taxRateStr) {
              let amounts = parseFloat(el.amountView)
              let taxRates = parseFloat(el.taxRate)
              let resAmount = (amounts / (taxRates + 1)).toFixed(2)
              totalAmount = parseFloat(resAmount) + parseFloat(totalAmount)
            } else if (el.amountView && !el.tax) {
              this.totalPrice.totalTax = ''
              this.totalPrice.totalAmount = ''
              return
            }
          }
        } else {
          // 不含税
          for (let i = 0; i < arr.length; i++) {
            const el = arr[i];
            if (el.amountView) {
              let resAmount = parseFloat(el.amountView) + parseFloat(totalAmount)
              totalAmount = parseFloat(resAmount)
            }
          }
        }
      }

      // 不含税金额合计
      if (totalAmount == 0) {
        this.totalPrice.totalAmount = ''
      } else {
        if (this.taxMethodVal == 1) {
            let resTotalJA = parseFloat(totalAmount) - parseFloat(totalTax)
            this.totalPrice.totalAmount = parseFloat(resTotalJA).toFixed(2)
        }else {
          this.totalPrice.totalAmount = parseFloat(totalAmount).toFixed(2)
        }
      }


      // 价税合计（大小写）
      if (this.taxMethodVal == 1) {
          this.totalPrice.priceTaxSmall = totalAmount == 0 ? '':parseFloat(totalAmount).toFixed(2)
      }else {
        // let int = Math.abs(this.totalPrice.totalAmount)
        let resTotal = parseFloat(totalAmount) + parseFloat(totalTax)
        this.totalPrice.priceTaxSmall = totalAmount == 0 ? '' : parseFloat(resTotal).toFixed(2)
      }

      if (this.totalPrice.priceTaxSmall && this.totalPrice.priceTaxSmall < 0) {
        this.totalPrice.priceTaxBig = '(负数)' + convertCurrency(Math.abs(this.totalPrice.priceTaxSmall))
      } else {
        this.totalPrice.priceTaxBig = convertCurrency(Math.abs(this.totalPrice.priceTaxSmall))
      }

    },





    // 备注框信息
    watchRemarks() {
      let obj = validStrCheckLengthTextarea(this.sellerForm.remarks, 360)
      if (!obj.flag) {
        if (obj.len) {
          this.sellerForm.remarks = this.sellerForm.remarks.substring(0, obj.len)
        }
      }
    },

    // 表尾输入验证
    tableTail(val) {
      if (val == '收款人') {
        let obj = validStrCheckLengthTextarea(this.payee, 10)
        if (!obj.flag) {
          if (obj.len) {
            this.payee = this.payee.substring(0, obj.len)
          }
        }
      }
      else if (val == '复核人') {
        let obj = validStrCheckLengthTextarea(this.issuer, 10)
        if (!obj.flag) {
          if (obj.len) {
            this.issuer = this.issuer.substring(0, obj.len)
          }
        }
      }
      else if (val == '开票人') {
        let obj = validStrCheckLengthTextarea(this.reviewer, 10)
        if (!obj.flag) {
          if (obj.len) {
            this.reviewer = this.reviewer.substring(0, obj.len)
          }
        }
      }

    },



    // 商品表单数据字符长度校验
    watchModel(item, index) {
      let obj = validStrCheckLengthTextarea(this.tableData[index].model, 40)
      console.log('model', this.tableData[index].model.length, obj);
      if (!obj.flag) {
        if (obj.len) {
          this.tableData[index].model = this.tableData[index].model.substring(0, obj.len)
        }
      }
    },

    watchUnit(item, index) {
      let obj = validStrCheckLengthTextarea(this.tableData[index].unit, 30)
      console.log('unit', this.tableData[index].unit.length, obj);
      if (!obj.flag) {
        if (obj.len) {
          this.tableData[index].unit = this.tableData[index].unit.substring(0, obj.len)
        }
      }
    },



    // 校验数字长度-- data待校验数据 / len1整数最大长度 / len2小数长度 --返回符合长度要求的字符串
    checkNum(data, len1, len2) {
      let str = data + ''
      if (str) {
        let num = this.validDotNum(str)
        if (num > 1) {
          return ''
        }
        if (num == 1) {
          if (str.indexOf('.') != 0 && str.indexOf('.') != str.length - 1) {
            let res = this.validFloatDate(str, len1, len2)
            console.log('res', res);
            return res
          }
          else if (str.indexOf('.') == str.length - 1) {
            return str
          } else {
            return ''
          }
        }
        if (num == 0) {
          //整数首位为0
          if (str.length > 1 && str.charAt(0) == 0) {
            return ''
          }
          //整数
          if (str.length > len1) {
            return str.substring(0, len1)
          } else {
            return str
          }

        }
      } else {
        return ''
      }
    },

    // 校验小数点出现次数
    validDotNum(str) {
      let index = str.indexOf('.'); // 字符出现的位置
      let num = 0; // 这个字符出现的次数
      while (index !== -1) {
        num++;
        index = str.indexOf('.', index + 1); // 从字符串出现的位置的下一位置开始继续查找
      }
      return num
    },
    // 校验小数并限制长度
    validFloatDate(str, len1, len2) {
      if (str.indexOf('.') > -1) {
        let arr = str.split('.')
        let beg = arr[0]
        let end = arr[1]
        if (beg && end) {
          if (beg.length > 1) {
            if (beg.charAt(0) == 0) {
              return ''
            } else {
              if (beg.length > len1) {
                beg = beg.substring(0, len1)
              }
            }
          }
          if (end.length > len2) {
            end = end.substring(0, len2)
          }
          return beg + '.' + end
        }
        else {
          return ''
        }
      }
    },


  },
};
</script>

<style scoped>
/* .box-card-title {
    margin: 0px 0 5px;
} */
.nav-flex {
  display: flex;
  justify-content: space-between;
}

.nav-left > span {
  /* width: 64px; */
  /* height: 22px; */
  /* line-height: 22px; */
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #252525;
  cursor: pointer;
}
.nav-left >>> .el-select {
  width: 33%;
}
.invoice-type {
  margin: 0 10px 0 15px;
}
.nav-right{
  display: flex;
  flex-direction: row;
  align-items: center;
}
.nav-right > div {
  margin-right: 9px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.nav-right > div > img {
  width: 30px;
  height: 30px;
  vertical-align: middle;
}

.container {
  height: 704px;
  display: flex;
}
.container > div {
  height: 100%;
}

.content-left,
.content-right {
  width: 45px;
}
.content {
  width: 100%;
  /* border: 1px solid #ddd; */
}
.content-side {
  width: 100%;
  height: 100%;
}
.content-side > li {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #f1f3f7;
  /* margin-top: 40px; */
  margin: 40px auto 0;
  list-style: none;
}

.content-nav {
  display: flex;
  justify-content: space-between;
  margin: 10px 0 20px;
  /* width: 136px; */
  height: 17px;
  /* font-size: 12px; */
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
  line-height: 17px;
}
.content-nav i{
    font-style: normal !important;
}
.content-nav-left > span {
  margin-right: 70px;
}
.content-nav-right > span {
  /* font-size: 20px; */
  margin-right: 30px;
  /* cursor: pointer; */
}

/* 购买方 */
.content-main {
  height: 595px;
  /* border: 1px solid #ddd; */
}
.content-main-purchaser {
  height: 81px;
  border: 1px solid #e8e8e8;
  display: flex;
}

.recipient-info {
  width: 100%;
  /* flex-grow: 1; */
  height: 100%;
}
.recipient-info > div {
  height: 40px;
  line-height: 40px;
  display: flex;
  border-bottom: 1px solid #e8e8e8;
}
.recipient-info > div > span {
  display: block;
  width: 135px;
  border-right: 1px solid #e8e8e8;
  padding-left: 11px;
}
.recipient-info > div >>> .el-input {
  flex-grow: 1;
  /* width: 0; */
}
.recipient-info > div >>> .el-input__inner {
  height: 37px;
  line-height: 37px;
  border: none;
  padding-left: 8px;
}

/* 商品 表格 */
.content-main-commodity-item {
  height: 352px;
  border-left: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
}
.content-main-commodity-item .table {
  height: 323px;
}
.content-main-commodity-item .table .thead {
  height: 44px;
  display: flex;
  background: #fafafa;
  border-bottom: 1px solid #E8E8E8;
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
  position: relative;
  height: 279px;
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
  /* border-top: 1px solid #e8e8e8; */
  border-bottom: 1px solid #E8E8E8;
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
.tfoot i{
    font-style: normal !important;
}

/* 销售方 */
.content-main-seller {
  height: 161px;
  border: 1px solid #e8e8e8;
  display: flex;
}
.seller {
  width: 53px;
  min-width: 53px;
  height: 100%;
  font-size: 20px;
  padding: 45px 0 0 15px;
  border-right: 1px solid #e8e8e8;
}
.seller-info {
  min-width: 450px;
  flex-grow: 1;
  height: 100%;
  border-right: 1px solid #e8e8e8;
}
.seller-info > div {
  height: 40px;
  line-height: 40px;
  display: flex;
  border-bottom: 1px solid #e8e8e8;
}
.seller-info > div > span {
  display: block;
  width: 125px;
  border-right: 1px solid #e8e8e8;
  padding-left: 8px;
}
.seller-info .seller-name >>> .el-input,
.seller-info .seller-identifier >>> .el-input {
  width: 0;
  flex-grow: 1;
}
.seller-info .seller-name >>> .el-input__inner,
.seller-info .seller-identifier >>> .el-input__inner {
  height: 37px;
  line-height: 37px;
  border: none;
  padding-left: 8px;
}
.seller-info > div >>> .el-select {
  flex-grow: 1;
}
.seller-info > div >>> .invoice-type {
  margin: 0;
}
.seller-info .seller-address-tel >>> .el-input__inner,
.seller-info .seller-account >>> .el-input__inner {
  border: none;
  padding: 0 10px;
  height: 35px;
  line-height: 35px;
}
.seller-remarks {
  width: 549px;
  /* flex-grow: 1; */
  height: 100%;
  display: flex;
}
.seller-remarks > div {
  width: 53px;
  height: 100%;
  font-size: 20px;
  padding: 55px 0 0 15px;
  border-right: 1px solid #e8e8e8;
}
.seller-remarks > textarea {
  flex-grow: 1;
  height: 100%;
  padding: 10px;
  border: none;
  outline: none;
  resize: none;
}

.content-footer {
  display: flex;
  justify-content: space-between;
  margin: 19px 0;
}
.content-footer .content-footer-left {
  display: flex;
}
.content-footer .content-footer-left span {
  width: 65px;
  height: 40px;
  line-height: 30px;
  display: inline-block;
}

/* el-dialog组件 */
#ScanInvoicing >>> .el-dialog__header {
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

/* 联想提示框 */
.LenovoBox {
  position: absolute;
  left: 80px;
  /* top: 0; */
  z-index: 111;
  width: 490px;
  max-height: 199px;
  border: 1px solid #808080;
}

.ELswitch {
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
