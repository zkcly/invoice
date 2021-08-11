<template>
  <div id="LightningInvoicing">
    <el-card class="box-card-title" shadow="never">
      <div class="nav-flex">
        <div class="nav-left">
          <span class="el-icon-arrow-left" @click="goToPages('dashboard')">
            {{ title }}</span
          >

          <!-- 发票类型 -->
          <el-select
            class="invoice-type"
            v-model.trim="invoiceTypeVal"
            placeholder="请选择发票类型"
            @change="invoiceTypeChange()"
          >
            <el-option
              v-for="item in invoiceType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <!-- 征税方式 -->
          <el-select
            v-model.trim="taxMethodVal"
            placeholder="请选择征税方式"
            @change="taxMethodChange()"
          >
            <el-option
              v-for="item in taxMethod"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>

        <div class="nav-right">
          <div @click="billingCode()">
            <img src="../../assets/imgs/QRcode.png" alt="" />
            <div>开票码</div>
          </div>
          <div @click="toJumpCopy()">
            <img src="../../assets/imgs/copy.png" alt="" />
            <div>复制</div>
          </div>
          <div @click="toJumpCopyOrRed()">
            <img src="../../assets/imgs/reduce.png" alt="" />
            <div>负数</div>
          </div>

          <!-- <template v-if="this.routeList.type != 'fapiaochaxun-fushu' "> -->
          <div
            style="color: #ddd"
            v-if="
              this.routeList.type == 'fapiaochaxun-fushu' ||
              this.routeList.type == 'fapiaochaxun-hongchong' ||
              this.taxMethodVal == 2 ||
              this.taxMethodVal == 1 ||
              (this.routeList.type == 'daikai' &&
                parseFloat(this.totalPrice.totalAmount) < 0) ||
              this.routeList.type == 'hongzixinxi'
            "
          >
            <img src="../../assets/imgs/deposit.png" alt="" />
            <div>折扣</div>
          </div>
          <div @click="discountVisible = true" v-else>
            <img src="../../assets/imgs/deposit.png" alt="" />
            <div>折扣</div>
          </div>
          <!-- </template> -->

          <div @click="toSave()">
            <img src="../../assets/imgs/save.png" alt="" />
            <div>保存</div>
          </div>
          <div @click="toEmpty()">
            <img src="../../assets/imgs/delete.png" alt="" />
            <div>清空</div>
          </div>
          <el-button type="primary" disabled v-if="isOpenInvoicing"
            >开 票</el-button
          >
          <el-button type="primary" @click="invoicing()" v-else
            >开 票</el-button
          >
        </div>
      </div>
    </el-card>

    <el-card class="box-card-content" shadow="never">
      <div class="container">
        <div class="content-left">
          <ul class="content-side">
            <li v-for="i in 12" :key="i"></li>
          </ul>
        </div>
        <!-- 发票主体内容 -->
        <div class="content">
          <div class="content-nav">
            <div class="content-nav-left">
              <span
                >发票代码: <i class="invoice-code">{{ invoiceCode }}</i></span
              >
              <span
                >发票号码: <i class="invoice-num">{{ invoiceNum }}</i></span
              >
              <span
                >剩余份数: <i class="invoice-count">{{ invoiceCount }}</i></span
              >
              <!-- <span>开票日期: <i class="invoice-date">{{invoiceDate}}</i></span> -->
            </div>
            <div class="content-nav-right">
              <span
                >开票日期: <i class="invoice-date">{{ invoiceDate }}</i></span
              >
              <!-- <span>清 空</span> -->
            </div>
          </div>

          <div class="content-main">
            <!-- 购买方 -->
            <div class="content-main-purchaser">
              <div class="purchaser">购<br />买<br />方</div>
              <div class="purchaser-info">
                <div class="purchaser-name">
                  <span>客户名称:</span>
                  <div @dblclick="selectCustomer">
                    <el-input
                      placeholder="请输入或双击选择"
                      v-model.trim="purchaserForm.name"
                      v-on:input="watchCusName('客户名称')"
                      @focus="inputCusName($event)"
                    ></el-input>
                  </div>
                  <el-button type="primary" @click="customerImport()"
                    >客户导入</el-button
                  >
                </div>
                <div class="purchaser-identifier">
                  <span>纳税人识别号:</span>
                  <el-input
                    placeholder="请输入"
                    v-model.trim="purchaserForm.identifier"
                    @blur="identifierBlur()"
                  ></el-input>
                </div>
                <div class="purchaser-address-tel">
                  <span>地址、电话:</span>
                  <el-input
                    placeholder="请输入"
                    v-model.trim="purchaserForm.addressOrTel"
                    v-on:input="watchPurchaser('地址电话')"
                  ></el-input>
                </div>
                <div class="purchaser-account">
                  <span>开户行及账号:</span>
                  <el-input
                    placeholder="请输入"
                    v-model.trim="purchaserForm.account"
                    v-on:input="watchPurchaser('开户行及账号')"
                  ></el-input>
                </div>
              </div>
              <div class="recipient-info">
                <div class="recipient-tel">
                  <span>收票人手机号:</span>
                  <el-input
                    placeholder="请输入收票人手机号"
                    v-model.trim="recipientInfo.tel"
                    @blur="checkTel()"
                    v-on:input="watchTel()"
                  ></el-input>
                </div>
                <div class="recipient-email">
                  <span>收票人邮箱:</span>
                  <el-input
                    placeholder="请输入收票人邮箱"
                    v-model.trim="recipientInfo.email"
                    @blur="checkEmail()"
                  ></el-input>
                </div>
                <div class="password-area">
                  <span>密 码 区</span>
                  <div></div>
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
                  <!-- <div class="price" v-if="isTaxIncluded">单价 (含税)</div>
                                <div class="price" v-else>单价 (不含税)</div>
                                <div class="amount" v-if="isTaxIncluded">金额 (含税)</div>
                                <div class="amount" v-else>金额 (不含税)</div> -->
                  <div class="price">单价</div>
                  <div class="amount">
                    <!-- <span  v-if="isTaxIncluded">金额(含税)</span>
                                    <span  v-else>金额(不含税)</span>
                                    <el-switch v-model.trim="isTaxIncluded" @change="TaxIncluded()" :disabled="taxMethodVal == 1"></el-switch> -->
                    <span>金额 </span>
                    <el-switch
                      class="ELswitch"
                      :width="65"
                      v-model="isTaxIncluded"
                      @change="TaxIncluded()"
                      :disabled="taxMethodVal != 0"
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

                <!-- 差额征税 -->
                <!-- <div class="tbody" v-if="taxMethodVal == 2">
                                <div class="tbody-tr" v-for="(item, index) in tableData" :key="index">

                                    <div class="name"  @dblclick="selectProduct(item,index)" v-if="index == 0">
                                        <el-input placeholder="双击选择商品" v-model.trim="item.name" v-on:input="watchName(item, index)" @focus="inputName($event, index)"></el-input>
                                    </div>
                                    <div class="name" v-else>
                                        <el-input  v-model.trim="item.name" disabled ></el-input>
                                    </div>

                                    <div class="model" >
                                        <el-input v-model.trim="item.model" v-on:input="watchModel(item, index)" v-if="index == 0"></el-input>
                                        <el-input v-model.trim="item.model" disabled v-else></el-input>
                                    </div>

                                    <div class="unit" >
                                        <el-input v-model.trim="item.unit" v-on:input="watchUnit(item, index)" v-if="index == 0"></el-input>
                                        <el-input v-model.trim="item.unit" disabled v-else></el-input>
                                    </div>

                                    <div class="count" >
                                        <el-input v-model.trim.trim="item.count" v-on:input="watchCount(item, index)"  onkeyup="value=value.replace(/[^\d\.]/g,'')" onchange="value=value.replace(/[^\d\.]/g,'')" v-if="index == 0"></el-input>
                                        <el-input v-model.trim.trim="item.count" disabled v-else></el-input>
                                    </div>

                                    <div class="price" >
                                        <el-input v-model.trim.trim="item.priceView"  v-on:input="watchPrice(item, index)"  onkeyup="value=value.replace(/[^\d\.]/g,'')" onchange="value=value.replace(/[^\d\.]/g,'')" readonly v-if="index == 0"></el-input>
                                        <el-input v-model.trim.trim="item.priceView" disabled v-else></el-input>
                                    </div>

                                    <div class="amount" >
                                        <el-input v-model.trim.trim="item.amountView" v-on:input="watchAmount(item, index)" readonly @focus="changeDifference(index)"  @blur="blurAmount(item, index)" v-if="index == 0"></el-input>
                                        <el-input v-model.trim.trim="item.amountView" disabled v-else></el-input>
                                    </div>

                                    <div class="taxRate">
                                        <el-select v-model.trim="item.taxRate" placeholder="请选择" @change="computerTaxs( index)" v-if="index == 0">
                                            <el-option
                                            v-for="item in taxRateSelect"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                            </el-option>
                                        </el-select>
                                        <el-input v-model.trim="item.taxRate" disabled v-else ></el-input>
                                    </div>
                                    <div class="tax">
                                        <el-input v-model.trim="item.tax" readonly v-if="index == 0"></el-input>
                                        <el-input v-model.trim="item.tax" disabled v-else ></el-input>
                                    </div>

                                    <div class="opt" v-if="index == 0">
                                        <template v-if="item.name">
                                            <el-button type="text" size="small" v-if="item.isPermanent" @click="toPermanent(item, index)">取消常驻</el-button>
                                            <el-button type="text" size="small" v-else @click="toPermanent(item, index)">常驻</el-button>
                                            <el-button type="text" size="small" disabled>复制</el-button>
                                            <el-button type="text" size="small" disabled>增行</el-button>
                                            <el-button type="text" size="small" @click="toRemove(item, index)" >删除</el-button>
                                        </template>
                                    </div>
                                    <div class="opt" style="background-color: #F5F7FA;" v-else>
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
                  <div
                    class="tbody-tr"
                    v-for="(item, index) in tableData"
                    :key="index"
                  >
                    <!-- 折扣行 -->
                    <div class="name" v-if="item.isDiscount">
                      <el-input v-model.trim="item.name" readonly></el-input>
                    </div>
                    <!-- 正常行 -->
                    <div
                      class="name"
                      @dblclick="selectProduct(item, index)"
                      v-else
                    >
                      <el-input
                        placeholder="双击选择商品"
                        v-model.trim="item.name"
                        v-on:input="watchName(item, index)"
                        @focus="inputName($event, index)"
                      ></el-input>
                    </div>

                    <div class="model" v-if="item.isDiscount">
                      <el-input v-model.trim="item.model" readonly></el-input>
                    </div>
                    <div class="model" v-else>
                      <el-input
                        v-model.trim="item.model"
                        v-on:input="watchModel(item, index)"
                      ></el-input>
                    </div>

                    <div class="unit" v-if="item.isDiscount">
                      <el-input v-model.trim="item.unit" readonly></el-input>
                    </div>
                    <div class="unit" v-else>
                      <el-input
                        v-model.trim="item.unit"
                        v-on:input="watchUnit(item, index)"
                      ></el-input>
                    </div>

                    <div class="count" v-if="item.isDiscount">
                      <el-input
                        v-model.trim.trim="item.count"
                        readonly
                      ></el-input>
                    </div>
                    <div class="count" v-else>
                      <el-input
                        :readonly="taxMethodVal == 2 && item.amountView === ''"
                        v-model.trim.trim="item.count"
                        v-on:input="watchCount(item, index)"
                        @focus="foucsCount(item, index)"
                        @blur="blurCount(item, index)"
                      ></el-input>
                    </div>

                    <div class="price" v-if="item.isDiscount">
                      <el-input
                        v-model.trim.trim="item.priceView"
                        readonly
                      ></el-input>
                    </div>
                    <div class="price" v-else>
                      <el-input
                        :readonly="taxMethodVal == 2"
                        v-model.trim.trim="item.priceView"
                        v-on:input="watchPrice(item, index)"
                      ></el-input>
                    </div>

                    <div class="amount" v-if="item.isDiscount">
                      <el-input
                        v-model.trim.trim="item.amountView"
                        readonly
                      ></el-input>
                    </div>
                    <div class="amount" v-else>
                      <el-input
                        :readonly="taxMethodVal == 2"
                        v-model.trim.trim="item.amountView"
                        v-on:input="watchAmount(item, index)"
                        @focus="changeDifference(item, index)"
                        @blur="blurAmount(item, index)"
                      ></el-input>
                    </div>

                    <div class="taxRate">
                      <el-select
                        v-model.trim="item.taxRate"
                        placeholder="请选择"
                        @change="computerTaxs(index)"
                        @focus="taxSelect(index)"
                        v-if="item.disSelectFlag"
                        disabled
                      >
                        <el-option
                          v-for="item3 in taxRateSelect"
                          :key="item3.value"
                          :label="item3.label"
                          :value="item3.value"
                        >
                        </el-option>
                      </el-select>
                      <el-select
                        v-model.trim="item.taxRate"
                        placeholder="请选择"
                        @change="computerTaxs(index)"
                        @focus="taxSelect(index)"
                        v-else
                      >
                        <el-option
                          v-for="item4 in taxRateSelect"
                          :key="item4.value"
                          :label="item4.label"
                          :value="item4.value"
                        >
                        </el-option>
                      </el-select>
                    </div>
                    <div class="tax">
                      <el-input v-model.trim="item.tax" readonly></el-input>
                    </div>
                    <template v-if="taxMethodVal == 2">
                      <div class="opt">
                        <template v-if="item.name">
                          <el-button
                            type="text"
                            size="small"
                            v-if="item.isPermanent"
                            @click="toPermanent(item, index)"
                            >取消常驻</el-button
                          >
                          <el-button
                            type="text"
                            size="small"
                            v-else
                            @click="toPermanent(item, index)"
                            >常驻</el-button
                          >
                          <el-button type="text" size="small" disabled
                            >复制</el-button
                          >
                          <el-button type="text" size="small" disabled
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
                    </template>
                    <template v-else>
                      <div class="opt" v-if="item.isDiscount">
                        <template v-if="item.name">
                          <template v-if="item.isDiscountLine">
                            <el-button type="text" size="small" disabled
                              >常驻</el-button
                            >
                            <el-button type="text" size="small" disabled
                              >复制</el-button
                            >
                            <el-button type="text" size="small" disabled
                              >增行</el-button
                            >
                          </template>
                          <template v-else>
                            <el-button
                              type="text"
                              size="small"
                              v-if="item.isPermanent"
                              @click="toPermanent(item, index)"
                              >取消常驻</el-button
                            >
                            <el-button
                              type="text"
                              size="small"
                              v-else
                              @click="toPermanent(item, index)"
                              >常驻</el-button
                            >
                            <el-button
                              type="text"
                              size="small"
                              @click="toCopy(item, index)"
                              >复制</el-button
                            >
                            <el-button
                              type="text"
                              size="small"
                              @click="toAdd(item, index)"
                              >增行</el-button
                            >
                          </template>

                          <el-button
                            type="text"
                            size="small"
                            @click="toRemove(item, index)"
                            >删除</el-button
                          >
                        </template>
                      </div>
                      <div class="opt" v-else>
                        <template v-if="item.name">
                          <el-button
                            type="text"
                            size="small"
                            v-if="item.isPermanent"
                            @click="toPermanent(item, index)"
                            >取消常驻</el-button
                          >
                          <el-button
                            type="text"
                            size="small"
                            v-else
                            @click="toPermanent(item, index)"
                            >常驻</el-button
                          >
                          <el-button
                            type="text"
                            size="small"
                            @click="toCopy(item, index)"
                            >复制</el-button
                          >
                          <el-button
                            type="text"
                            size="small"
                            @click="toAdd(item, index)"
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
                    </template>
                  </div>
                </div>
              </div>

              <div class="tfoot">
                <div class="tfoot-left">
                  <span><i class="tfoot-total">i</i> 合计</span>
                  <span
                    >金额: <i>{{ totalPrice.totalAmount }}</i></span
                  >
                  <span
                    >税额: <i>{{ totalPrice.totalTax }}</i></span
                  >
                </div>

                <div class="tfoot-right">
                  <span
                    >价税合计(大写): <i>{{ totalPrice.priceTaxBig }}</i></span
                  >
                  <span
                    >价税合计(小写): <i>{{ totalPrice.priceTaxSmall }}</i></span
                  >
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
                  <el-input v-model.trim="sellerForm.name" readonly></el-input>
                </div>
                <div class="seller-identifier">
                  <span>纳税人识别号:</span>
                  <el-input
                    v-model.trim="sellerForm.identifier"
                    readonly
                  ></el-input>
                </div>
                <div class="seller-address-tel">
                  <span>地址、电话:</span>
                  <el-select
                    v-model.trim="sellerForm.addressOrTel"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in sellerAddressOrTel"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="seller-account">
                  <span>开户行及账号:</span>
                  <el-select
                    v-model.trim="sellerForm.account"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in sellerAccount"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="seller-remarks">
                <div>备<br />注</div>
                <textarea
                  class="tarea"
                  name="message"
                  maxlength="180"
                  v-on:input="watchRemarks()"
                  v-model.trim="sellerForm.remarks"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="content-footer">
            <div class="content-footer-left">
              <span>收款人: </span>
              <el-input
                maxlength="20"
                v-model.trim="payee"
                placeholder="请输入"
                v-on:input="tableTail('收款人')"
              ></el-input>
              <!-- <input v-model.trim="payee" placeholder="请输入" /> -->
            </div>
            <div class="content-footer-left">
              <span>复核人: </span>
              <el-input
                maxlength="20"
                v-model.trim="issuer"
                placeholder="请输入"
                v-on:input="tableTail('复核人')"
              ></el-input>
              <!-- <input v-model.trim="issuer" placeholder="请输入"/> -->
            </div>
            <div class="content-footer-left">
              <span>开票人: </span>
              <el-input
                maxlength="20"
                v-model.trim="reviewer"
                placeholder="请输入"
                v-on:input="tableTail('开票人')"
              ></el-input>
              <!-- <input v-model.trim="reviewer" placeholder="请输入"/> -->
            </div>
          </div>
        </div>
        <div class="content-right">
          <ul class="content-side">
            <li v-for="i in 12" :key="i"></li>
          </ul>
        </div>
      </div>
    </el-card>

    <!-- 折扣弹框 -->
    <div v-if="discountVisible">
      <el-dialog
        title="设置折扣"
        width="25%"
        :visible.sync="discountVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        destroy-on-close
      >
        <SetDiscount
          :productInfos="tableData"
          @setDiscountClose="setDiscountCancel"
          @setDiscountDetermine="setDiscountDetermine"
        ></SetDiscount>
      </el-dialog>
    </div>

    <!-- 开票码组件 -->
    <div v-if="billingCodeVisible">
      <el-dialog
        id="billingCode"
        width="380px"
        :visible.sync="billingCodeVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        destroy-on-close
      >
        <BillingCode @closeCircle="billingCodeVisible = false"></BillingCode>
      </el-dialog>
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

    <!-- 客户导入组件 -->
    <div v-if="customerImportVisible">
      <el-dialog
        title="客户导入"
        width="55%"
        :visible.sync="customerImportVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        destroy-on-close
      >
        <CustomerImport
          :taxDiskNum="taxDiskNum"
          @importCustomerDetermine="importCustomerDetermine"
        ></CustomerImport>
      </el-dialog>
    </div>

    <!-- 客户联想框 -->
    <div class="customLenovo" ref="customLenovo" v-show="customLenovoVisible">
      <CustomLenovo
        :dataList="customdataList"
        @lenovoDetermine="customLenovolenovoDetermine"
      ></CustomLenovo>
    </div>

    <!-- 选择商品组件 -->
    <div v-if="selectProductVisible">
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
          :index="index"
          :taxMethodVal="taxMethodVal"
          @selectProductClose="selectProductCancel"
          @selectProductDetermine="selectProductDetermine"
        ></SelectProduct>
      </el-dialog>
    </div>

    <!-- 商品联想框 -->
    <div class="LenovoBox" ref="LenovoBox" v-show="LenovoBoxVisible">
      <LenovoBox
        :dataList="dataList"
        :indexBox="indexBox"
        @lenovoDetermine="lenovoDetermine"
      ></LenovoBox>
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

    <!-- 发票展示组件 -->
    <div id="invoicePre">
      <InvoicePreview
        :isElectronic="isElectronic"
        :visible="invoicePreviewVisible"
        @update:visible="(val) => (invoicePreviewVisible = val)"
        :taxDetail="taxDetail"
      ></InvoicePreview>
    </div>
    <!-- <div v-if="invoicePreviewVisible">
    <el-dialog :title="invoicePreviewTitle" width="70%" :visible.sync="invoicePreviewVisible" :close-on-click-modal="false" :close-on-press-escape="false" destroy-on-close>
        <InvoicePreview :isElectronic="isElectronic" :visible="invoicePreviewVisible" :taxDetail="taxDetail"></InvoicePreview>
    </el-dialog>
    </div> -->
  </div>
</template>

<script>
import {
  validStrCheckLengthTextarea,
  validPhone,
  validEamil,
} from "@/utils/validate.js";
import {
  convertCurrency,
  UtilsGetTicketType,
  deteleObject,
  createComprisonFunction,
} from "@/utils/function.js";
import {
  showFullScreenLoading,
  tryHideFullScreenLoading,
} from "@/utils/loadingX";
import BillingCode from "./components/BillingCode.vue";
import SetDiscount from "./components/SetDiscount.vue";
import SelectCustomer from "./components/SelectCustomer.vue";
import CustomerImport from "./components/CustomerImport.vue";
import SelectProduct from "./components/SelectProduct.vue";
import LenovoBox from "./components/LenovoBox.vue";
import SetDifference from "./components/SetDifference.vue";
import InvoicePreview from "./components/InvoicePreview.vue";
import CustomLenovo from "../home/components/customLenovo.vue";
import {
  customLenovo,
  getRedis,
  getInvoicingType,
  getInvoicingTypeDetail,
  lightInvoiceSubmit,
  lightInvoiceSave,
  getLoginData,
  residentDefault,
  setResident,
  getSellerData,
  getSellerDefaultData,
  autoCode,
  lenovo,
} from "@/api/lightInvoicing.js";
import { selectTaxRate } from "@/api/commonAPI.js";
import { taxDiskNumDetailsApi } from "@/api/setpan.js";

export default {
  name: "LightningInvoicing",
  components: {
    BillingCode,
    SetDiscount,
    SelectCustomer,
    CustomerImport,
    SelectProduct,
    LenovoBox,
    CustomLenovo,
    SetDifference,
    InvoicePreview,
  },
  data() {
    return {
      editDifference: false, //修改差额
      title: "闪电开票",
      loading: false,

      // 发票类型
      invoiceType: [
        // {value: '004', label: '增值税专用发票'},
        // {value: '007', label: '增值税普通发票'},
        // {value: '025', label: '卷式发票'},
        // {value: '026', label: '普通发票(电子)'},
        // {value: '028', label: '专用发票(电子)'},
        // {value: '005', label: '机动车销售统一发票'},
      ],
      invoiceTypeVal: "",

      // 征税方式
      taxMethod: [
        { value: 0, label: "普通征税" },
        { value: 1, label: "减按征税" },
        { value: 2, label: "差额征税" },
      ],
      taxMethodVal: 0,

      // 是否含税
      isTaxIncluded: true,

      // 是否开票中
      isOpenInvoicing: false,

      // 折扣
      discountVisible: false,
      // 开票码
      billingCodeVisible: false,
      // 选择客户
      selectCustomerVisible: false,
      // 客户导入
      customerImportVisible: false,
      // 客户联想框
      customLenovoVisible: false,
      customdataList: [],
      // 选择商品
      selectProductVisible: false,
      index: "",
      // 联想框
      LenovoBoxVisible: false,
      dataList: [],
      indexBox: "",
      // 差额征收弹框
      differenceVisible: false,
      // 发票展示
      invoicePreviewVisible: false,
      isElectronic: false,
      invoicePreviewTitle: "发票展示", // isElectronic ? '发票展示':'电子发票展示',

      // 发票模块信息 ==================================================

      // 票头
      invoiceCode: "",
      invoiceNum: "",
      invoiceCount: "",
      invoiceDate: "",
      // 票尾
      payee: "",
      issuer: "",
      reviewer: "",

      // 购买方
      purchaserForm: {
        name: "",
        identifier: "",
        addressOrTel: "",
        account: "",
      },
      // 收票人
      recipientInfo: {
        tel: "",
        email: "",
      },

      // 销售方
      sellerForm: {
        name: "",
        identifier: "",
        addressOrTel: "",
        account: "",
        remarks: "",
      },
      // 销售方-地址电话
      sellerAddressOrTel: [
        // {value: '0', label: '地址电话1'},
        // {value: '01', label: '地址电话2'}
      ],
      // 销售方-开户行及账号
      sellerAccount: [
        // {value: '0', label: '开户行及账号1'},
        // {value: '01', label: '开户行及账号2'}
      ],

      //商品表格(初始长度5)
      tableData: [
        {
          name: "",
          model: "",
          unit: "",
          count: "",
          price: "",
          priceView: "",
          amount: "",
          amountView: "",
          taxRate: "",
          tax: "",
          taxC: "",
          isPermanent: false,
          isDiscount: false,
          isDiscountLine: false,
          isBlur: false,
          disSelectFlag: false,
        },
        // {name: '', model: '', unit: '', count: '', price: '', priceView: '', amount: '', amountView: '', taxRate: '', tax: '', taxC: '', isPermanent: false, isDiscount: false, isDiscountLine: false, isBlur: false, disSelectFlag: false, },
      ],
      // 商品表格基本格式
      tableData_el: {
        name: "", //商品名称
        model: "", //规格型号
        unit: "", //单位
        count: "", //数量
        price: "", //单价（价格切换计算）
        priceView: "", //单价（页面展示）
        amount: "", //金额（价格切换计算）
        amountView: "", //金额（页面展示）
        taxRate: "", //税率
        tax: "", //税额（页面展示）
        taxC: "", //税额
        isPermanent: false, //是否常驻
        isDiscount: false, //是否有折扣
        isDiscountLine: false, //是否为折扣行
        isBlur: false, //是否失去过焦点
        disSelectFlag: false, //是否禁止税率下拉框选择
      },

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
      taxRateSelect_jianan: [{ value: 0.015, label: "1.5%" }],
      // 默认写死的税率
      taxRateSelect_default: [
        { value: 0, label: "0%" },
        { value: 0.01, label: "1%" },
        { value: 0.02, label: "2%" },
        { value: 0.03, label: "3%" },
        { value: 0.04, label: "4%" },
        { value: 0.05, label: "5%" },
        { value: 0.06, label: "6%" },
        { value: 0.09, label: "9%" },
        { value: 0.1, label: "10%" },
        { value: 0.11, label: "11%" },
        { value: 0.13, label: "13%" },
        { value: 0.16, label: "16%" },
        { value: 0.17, label: "17%" },
      ],
      // 备用不变的税率
      taxRateSelect_const: [],
      // 预处理税率
      taxRateSelect_PRE: [],

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

      // 开票接口所属商品字段
      goodsDetail: [],
      goodsDetail_el: [
        {
          createTime: "", //创建时间
          goodsAmount: "", //number //商品金额----（tableData）
          goodsCode: "", //string //商品编码---  taxClassificationCode
          goodsName: "", //string //商品名称---- goodsName/（tableData）
          goodsNumber: "", //number //商品数量----（tableData）
          goodsPrice: "", //number //商品单价----（tableData）
          goodsSelfCode: "", //string //商品自行编码--- goodsSelfCode
          goodsShortName: "", //string //商品简称（税收分类简称）--- 从goodsName中分割*获取
          goodsSubName: "", //string //税目名称(又叫商品分类编码简称)--- taxClassificationName

          id: "", //integer($int64) //ID
          incentivesLabel: "", //string //优惠政策标识 无免税100%先征后退50%先征后退不征税先征后退即征即退100%即征即退30% 即征即退50% 即征即退70% 按3%简易征收,按5%简易征收,稀土产品/简易征收/超税负12%即征即退超税负3%即征即退,超税负8%即征即退----incentivesLabel
          invoiceSeries: "", //integer($int64) //流水号---   ???
          isTax: "", //integer($int32) //含税状态 0：否 1：是----（tableData）
          lineNature: "", //integer($int32) //发票行性质0：无折扣行商品 1.折扣行2.有折扣行商品 3.（详见清单列表）4.折扣行总和--- ???
          specifications: "", //string //规格型号----（tableData）
          taxAmount: "", //number //税额----（tableData）
          taxRate: "", //number //税率----（tableData）
          unit: "", //string //单位----（tableData）
          zeroTaxMarks: "", //string //零税率标识，空代表正常税率1 出口免税和其他免税优惠政策（免税）2 不征增值税（不征税）3 普通零税率（0%）---- zeroTaxMarks
        },
      ],

      // 盘号
      taxDiskNum: "",
      // 购买方导入客户ID
      buyerId: "",
      // 企业开票人ID
      companyUserId: "",
      // 差额征税含税销售额（弹框）
      sales: "",
      // 差额备注
      remarkNote: "",
      // 差额征税扣除额
      differentialTaxationAmount: "",
      //*发票类别 0：正数发票 1：负数发票 2：空白作废发票(专普票时存在)
      invoiceCategory: 0,
      //integer($int64) //流水号（扫码开票/待开列表/清单开票/批量开票必填）
      invoiceSeries: "",
      //integer($int32) //财务填写标识：0-默认，1-包含财务人员填写商品
      financeFlag: "",
      // 来源 0.审核开票 1.闪电开票 2.批量开票 3.清单开票 4.扫码开票 5.待开列表
      source: "",

      blueInvoiceCode: "", //string  //原发票代码（为负数发票时存在）
      blueInvoiceNo: "", //string  //原发票号码（为负数发票时存在）
      originalInvoiceDate: "", // string //原开票日期 格式：YYYYMMDDHHMMSS

      noticeNo: "", // string //红字通知单编号(增值税电子专用发票冲红，增值税专用发票冲红，该字段必填)

      // 发票清单标志 (商品行数大于8, 即为有清单1)
      listingLabel: "",
      // 主要商品名称     ????----不用传
      mainProductName: "",
      //*特殊票种标识 00：不是 01：农产品销售 02：农产品收购 03：是
      specialLabel: "00",

      //发票行性质 0：无折扣行商品 1.折扣行 2.有折扣行商品 3.（详见清单列表） 4.折扣行总和    ???/--- 商品信息
      lineNature: 0,

      // 开票-定时器
      timer: null,
      continue: true,
      // 开票返回数据-轮询所需入参
      pollingData: "",

      // 企业用户登入信息
      companyUserInfos: "",
      // 销售方信息
      sellerInfos: "",
      // 销售方下拉框信息
      sellerSelectInfos: "",

      // 税盘信息
      taxDiskInfo: {},
      // 登录用户信息
      userLoginInfo: {},

      // 路由跳转数据
      routeList: "",
      // 是否第一次渲染路由数据
      firstFlagRoute: true,
      //发票展示prop
      taxDetail: {},
      //打印 发票流水号
      pdfSeies: "",
      //赋码信息完整性
      complete: true,
      fuma: true,
    };
  },
  computed: {
    taxDiskNumChange() {
      return this.$store.state.user.taxDiskInfo.taxDiskNum;
    },
  },
  watch: {
    taxDiskNumChange: {
      handler: function (newval, oldval) {
        if (newval !== oldval) {
          this.taxDiskNum = newval;

          this.invoiceTypeInit();
          this.invoiceTypeChange();
          console.log("watch");
        }
      },
      deep: true,
    },
    invoiceCount: {
      handler: function (newval, oldval) {
        if (newval == "0") {
          this.$alert(
            "当前发票类型剩余份数为零，请选择其他类型发票！",
            "提示",
            {
              confirmButtonText: "确定",
              type: "warning",
            }
          );
        }
      },
      deep: true,
    },
  },
  created() {},
  mounted() {
    this.userLoginInfo = this.$store.state.user.loginInfo;
    this.taxDiskInfo = this.$store.state.user.taxDiskInfo;
    this.companyUserId = this.$store.state.user.loginInfo.companyUserId
      ? this.$store.state.user.loginInfo.companyUserId
      : "";
    this.taxDiskNum = this.$store.state.user.taxDiskInfo.taxDiskNum
      ? this.$store.state.user.taxDiskInfo.taxDiskNum
      : "";

    // this.$router.push({
    //     path: 'lightningInvoicing',
    //     query: {
    //         List: JSON.stringify({
    //             data: '要传输的数据data',
    //             type: '数据来源标志',
    //         })
    //     }
    // })

    // 路由跳转数据
    // 待开列表 type='daikai'
    // 发票查询 type='fapiaochaxun-hongchong'(fapiaochaxun-fuzhi; fapiaochaxun-fushu)
    // 红字信息 type='hongzixinxi'(hongzixinxi-fushu)
    // 批量开票 type='BatchInvoicing'
    // 清单开票 type='inventoryInvoicing'
    // 审核开票 type='reviewInvoice'
    this.routeList = this.$route.query.List
      ? JSON.parse(this.$route.query.List)
      : "";
    console.log("路由跳转数据k", this.routeList);

    this.invoiceTypeInit();
    this.togetLoginData();
    this.togetSellerDefaultData();

    // this.invoiceDate = this.$moment().format("YYYY-MM-DD")
  },
  methods: {
    // 差额征税 点击金额改变差额
    changeDifference(item, index) {
      if (this.tableData[0].name && this.taxMethodVal == 2) {
        this.differenceVisible = true;
        this.editDifference = true;
      } else {
        if (this.invoiceCategory == 1) {
          this.tableData[index].amount = item.amount
            ? Math.abs(item.amount)
            : "";
          this.tableData[index].amountView = item.amountView
            ? Math.abs(item.amountView)
            : "";
        }
      }
    },
    // 路由跳转
    goToPages(item) {
      if (this.routeList.type == "daikai") {
        this.$router.push({ name: "awaitList" });
      } else if (this.routeList.type == "BatchInvoicing") {
        this.$router.push({ name: "batchInvoicing" });
      } else if (this.routeList.type == "inventoryInvoicing") {
        this.$router.push({ name: "inventoryInvoicing" });
      } else if (this.routeList.type == "fapiaochaxun-hongchong") {
        this.$router.push({ name: "InvoiceInquiry" });
      } else if (this.routeList.type == "hongzixinxi") {
        this.$router.push({ name: "redLetters" });
      } else if (this.routeList.type == "reviewInvoice") {
        this.$router.push({ name: "reviewInvoicing" });
      } else if (item) {
        this.$router.push(item);
      }
      // this.$router.push({name: item})
    },

    // 展示路由跳转数据
    toShowRouteData() {
      // 审核开票数据
      if (this.routeList.type == "reviewInvoice") {
        const el = this.routeList.data;
        // 发票类型
        this.invoiceTypeVal = el.invoiceType;
        // 征税方式
        // if (el.taxationType == 2) {
        //     this.taxMethodVal = 2
        //     this.tableData[0].amount = el.differentialTaxationAmount
        //     this.tableData[0].amountView = el.differentialTaxationAmount
        // }
        // this.taxMethodVal = el.taxationType
        // 是否含税
        // this.isTaxIncluded = el.isTaxIncluded

        // 购买方
        this.purchaserForm.name = el.buyerName;
        this.purchaserForm.identifier = el.buyerTaxId;
        this.purchaserForm.addressOrTel = el.buyerAddrTel;
        this.purchaserForm.account = el.buyerBankAccount;

        this.recipientInfo.tel = el.phone;
        this.recipientInfo.email = el.email;
        this.invoiceTypeChange();

        // 商品数据
        // this.tableData = []
        this.toPreDealTaxRate(el.goodsList);
        for (let i = 0; i < el.goodsList.length; i++) {
          let obj = this.toDealGoodsDetail(el.goodsList[i]);
          this.tableData.splice(i, 1, obj);
        }

        // 合计
        this.totalPrice.totalAmountC = el.totalAmount;
        this.totalPrice.totalAmount = el.totalAmount.toFixed(2);
        this.totalPrice.totalTaxC = el.totalTaxAmount;
        this.totalPrice.totalTax = el.totalTaxAmount.toFixed(2);
        if (el.totalPriceWithTax) {
          this.totalPrice.priceTaxSmallC = el.totalPriceWithTax;
          this.totalPrice.priceTaxSmall = el.totalPriceWithTax.toFixed(2);
          if (this.totalPrice.priceTaxSmall < 0) {
            this.totalPrice.priceTaxBig =
              "(负数)" +
              convertCurrency(Math.abs(this.totalPrice.priceTaxSmall));
          } else {
            this.totalPrice.priceTaxBig = convertCurrency(
              Math.abs(this.totalPrice.priceTaxSmall)
            );
          }
        } else {
          if (el.totalAmount && el.totalTaxAmount) {
            this.totalPrice.priceTaxSmallC =
              parseFloat(el.totalAmount) + parseFloat(el.totalTaxAmount);
            this.totalPrice.priceTaxSmall = (
              parseFloat(el.totalAmount) + parseFloat(el.totalTaxAmount)
            ).toFixed(2);
            if (this.totalPrice.priceTaxSmall < 0) {
              this.totalPrice.priceTaxBig =
                "(负数)" +
                convertCurrency(Math.abs(this.totalPrice.priceTaxSmall));
            } else {
              this.totalPrice.priceTaxBig = convertCurrency(
                Math.abs(this.totalPrice.priceTaxSmall)
              );
            }
          } else {
            this.totalPrice.priceTaxSmallC = "";
            this.totalPrice.priceTaxSmall = "";
          }
        }

        // 销售方
        // this.sellerForm.name = el.sellerName
        // this.sellerForm.identifier = el.sellerTaxId
        // this.sellerForm.addressOrTel = el.sellerAddrTel
        // this.sellerForm.account = el.sellerBankAccount
        this.sellerForm.remarks = el.remark;

        // 票尾
        // this.payee = el.skr
        // this.issuer = el.fhr
        // this.reviewer = el.kpr

        // 企业开票人ID
        // this.companyUserId = el.companyUserId
        // 差额征税扣除额
        // this.differentialTaxationAmount = el.differentialTaxationAmount
        //*发票类别 0：正数发票 1：负数发票 2：空白作废发票(专普票时存在)   ?????
        // this.invoiceCategory = el.invoiceCategory
        //integer($int64) //流水号（扫码开票/待开列表/清单开票/批量开票必填）
        this.invoiceSeries = el.invoiceSeries;
        //integer($int32) //财务填写标识：0-默认，1-包含财务人员填写商品
        this.financeFlag = el.financeFlag ? el.financeFlag : "";
        // 来源 0.审核开票 1.闪电开票 2.批量开票 3.清单开票 4.扫码开票 5.待开列表
        this.source = el.source ? el.source : "";
        // 发票清单标志
        this.listingLabel = el.listingLabel;
        // 主要商品名称
        this.mainProductName = el.mainProductName;
        //*特殊票种标识 00：不是 01：农产品销售 02：农产品收购 03：是
        // this.specialLabel = el.specialLabel

        this.computerTotalPrice()
        // this.invoiceTypeChange();
        return;
      }

      // 待开列表数据
      if (
        this.routeList.type == "daikai" ||
        this.routeList.type == "BatchInvoicing" ||
        this.routeList.type == "inventoryInvoicing"
      ) {
        const el = this.routeList.data;
        this.fuma =
          this.routeList.data.goodsList.length != 0
            ? this.routeList.data.goodsList[0].goodsShortName != ""
            : true;
        console.log(this.fuma);
        this.complete = this.routeList.complete;
        // 发票类型
        this.invoiceTypeVal = el.invoiceType;
        // 征税方式
        if (el.taxationType == 2) {
          this.taxMethodVal = 2;
          this.differentialTaxationAmount = el.differentialTaxationAmount;
          this.tableData[0].amount = el.differentialTaxationAmount;
          this.tableData[0].amountView = el.differentialTaxationAmount;
        }
        this.taxMethodVal = el.taxationType;
        // 是否含税
        // this.isTaxIncluded = el.isTaxIncluded

        // 购买方
        this.purchaserForm.name = el.buyerName;
        this.purchaserForm.identifier = el.buyerTaxId;
        this.purchaserForm.addressOrTel = el.buyerAddrTel;
        this.purchaserForm.account = el.buyerBankAccount;

        this.recipientInfo.tel = el.phone;
        this.recipientInfo.email = el.email;

        // 商品数据
        // this.tableData = []
        this.invoiceTypeChange();
        this.toPreDealTaxRate(el.goodsList);
        for (let i = 0; i < el.goodsList.length; i++) {
          let obj = this.toDealGoodsDetail(el.goodsList[i]);
          this.tableData.splice(i, 1, obj);
        }
        // this.toPreDealTaxRate(el.goodsList);
        // 合计
        this.totalPrice.totalAmountC = el.totalAmount ? el.totalAmount : "";
        this.totalPrice.totalAmount = el.totalAmount
          ? el.totalAmount.toFixed(2)
          : "";
        this.totalPrice.totalTaxC = el.totalTaxAmount.toString()
          ? el.totalTaxAmount
          : "";
        this.totalPrice.totalTax = el.totalTaxAmount.toString()
          ? el.totalTaxAmount.toFixed(2)
          : "";
        if (el.totalPriceWithTax) {
          this.totalPrice.priceTaxSmallC = el.totalPriceWithTax;
          this.totalPrice.priceTaxSmall = el.totalPriceWithTax.toFixed(2);
          if (this.totalPrice.priceTaxSmall < 0) {
            this.totalPrice.priceTaxBig =
              "(负数)" +
              convertCurrency(Math.abs(this.totalPrice.priceTaxSmall));
          } else {
            this.totalPrice.priceTaxBig = convertCurrency(
              Math.abs(this.totalPrice.priceTaxSmall)
            );
          }
        } else {
          if (el.totalAmount && el.totalTaxAmount) {
            this.totalPrice.priceTaxSmallC =
              parseFloat(el.totalAmount) + parseFloat(el.totalTaxAmount);
            this.totalPrice.priceTaxSmall = (
              parseFloat(el.totalAmount) + parseFloat(el.totalTaxAmount)
            ).toFixed(2);
            if (this.totalPrice.priceTaxSmall < 0) {
              this.totalPrice.priceTaxBig =
                "(负数)" +
                convertCurrency(Math.abs(this.totalPrice.priceTaxSmall));
            } else {
              this.totalPrice.priceTaxBig = convertCurrency(
                Math.abs(this.totalPrice.priceTaxSmall)
              );
            }
          } else {
            this.totalPrice.priceTaxSmallC = "";
            this.totalPrice.priceTaxSmall = "";
          }
        }

        // 销售方
        if (this.routeList.type == "daikai") {
          this.sellerForm.name = el.sellerName;
          this.sellerForm.identifier = el.sellerTaxId;
          this.sellerForm.addressOrTel = el.sellerAddrTel;
          this.sellerForm.account = el.sellerBankAccount;
          // 票尾
          this.payee = el.skr;
          this.issuer = el.fhr;
          this.reviewer = el.kpr;
        }
        if (
          this.routeList.type == "BatchInvoicing" ||
          this.routeList.type == "inventoryInvoicing"
        ) {
          this.sellerForm.addressOrTel = el.sellerAddrTel;
          this.sellerForm.account = el.sellerBankAccount;

          this.payee = el.skr;
          this.issuer = el.fhr;
          this.reviewer = el.kpr;
          this.box(el.goodsList);
        }
        this.sellerForm.remarks = el.remark;

        // 企业开票人ID
        // this.companyUserId = el.companyUserId
        // 差额征税扣除额
        this.differentialTaxationAmount = el.differentialTaxationAmount;
        //*发票类别 0：正数发票 1：负数发票 2：空白作废发票(专普票时存在)   ?????
        this.invoiceCategory = el.invoiceCategory;
        if (this.invoiceCategory == 1) {
          this.blueInvoiceCode = el.blueInvoiceCode ? el.blueInvoiceCode : ""; //string  //原发票代码（为负数发票时存在）
          this.blueInvoiceNo = el.blueInvoiceNo ? el.blueInvoiceNo : ""; //string  //原发票号码（为负数发票时存在）
          this.originalInvoiceDate = el.originalInvoiceDate
            ? el.originalInvoiceDate
            : ""; // string //原开票日期 格式：YYYYMMDDHHMMSS
        }
        //integer($int64) //流水号（扫码开票/待开列表/清单开票/批量开票必填）
        this.invoiceSeries = el.invoiceSeries;
        //integer($int32) //财务填写标识：0-默认，1-包含财务人员填写商品
        this.financeFlag = el.financeFlag ? el.financeFlag : "";
        // 来源 0.审核开票 1.闪电开票 2.批量开票 3.清单开票 4.扫码开票 5.待开列表
        this.source = el.source ? el.source : "";
        // 发票清单标志
        this.listingLabel = el.listingLabel;
        // 主要商品名称
        this.mainProductName = el.mainProductName;
        //*特殊票种标识 00：不是 01：农产品销售 02：农产品收购 03：是
        // this.specialLabel = el.specialLabel
        // this.fuma = el.infoFlag
        this.computerTotalPrice()
        // this.invoiceTypeChange();
        return;
      }

      // 发票查询冲红数据
      if (
        this.routeList.type == "fapiaochaxun-hongchong" ||
        this.routeList.type == "fapiaochaxun-fuzhi" ||
        this.routeList.type == "fapiaochaxun-fushu"
      ) {
        const el = this.routeList.data;
        // 发票类型
        console.log(el);
        this.invoiceTypeVal = el.invoiceType;
        // 征税方式
        if (el.taxationType == 2) {
          this.taxMethodVal = 2;
          this.differentialTaxationAmount = el.differentialTaxationAmount;
          this.tableData[0].amount = el.differentialTaxationAmount;
          this.tableData[0].amountView = el.differentialTaxationAmount;
        }
        this.taxMethodVal = el.taxationType;
        // 是否含税
        // this.isTaxIncluded = el.isTaxIncluded

        // 购买方
        this.purchaserForm.name = el.buyerName;
        this.purchaserForm.identifier = el.buyerTaxId;
        this.purchaserForm.addressOrTel = el.buyerAddrTel;
        this.purchaserForm.account = el.buyerBankAccount;

        this.recipientInfo.tel = el.pushPhone;
        this.recipientInfo.email = el.pushMail;
        // 商品数据
        // this.tableData = []
        this.invoiceTypeChange();
        this.toDealTaxIncluded(el.invoiceInfoDetailsList);
        this.toPreDealTaxRate(el.invoiceInfoDetailsList);
        for (let i = 0; i < el.invoiceInfoDetailsList.length; i++) {
          let obj = this.toDealGoodsDetail(el.invoiceInfoDetailsList[i]);
          if (
            this.routeList.type == "fapiaochaxun-hongchong" ||
            this.routeList.type == "fapiaochaxun-fushu"
          ) {
            let a=1;
            if (obj.isDiscount && obj.isDiscountLine) {
              let objPre = el.invoiceInfoDetailsList[i - 1];
              let goodsAmount = objPre.goodsAmount;
              let taxAmount = objPre.taxAmount;
              objPre.goodsAmount =
                goodsAmount.toFixed(2) - Math.abs(obj.goodsAmount).toFixed(2);
              objPre.taxAmount =
                taxAmount.toFixed(2) - Math.abs(obj.taxAmount).toFixed(2);
              objPre.goodsPrice = objPre.goodsAmount / objPre.goodsNumber;
              objPre.lineNature = 0;
              let objNew = this.toDealGoodsDetail(objPre);
              console.log(objNew,'88888888888888888888');
              if(i==1){
                this.tableData.splice(i - 1, 1, objNew);
              }else{
                this.tableData.splice(i - 1-a, 1, objNew);
                a++;
              }
              continue;
            }
          }
          this.tableData.splice(i, 1, obj);
        }

        // 合计
        this.totalPrice.totalAmountC = el.totalAmount;
        this.totalPrice.totalAmount = el.totalAmount.toFixed(2);
        this.totalPrice.totalTaxC = el.totalTaxAmount;
        this.totalPrice.totalTax = el.totalTaxAmount.toFixed(2);
        if (el.totalPriceWithTax) {
          this.totalPrice.priceTaxSmallC = el.totalPriceWithTax;
          this.totalPrice.priceTaxSmall = el.totalPriceWithTax.toFixed(2);
          if (this.totalPrice.priceTaxSmall < 0) {
            this.totalPrice.priceTaxBig =
              "(负数)" +
              convertCurrency(Math.abs(this.totalPrice.priceTaxSmall));
          } else {
            this.totalPrice.priceTaxBig = convertCurrency(
              Math.abs(this.totalPrice.priceTaxSmall)
            );
          }
        } else {
          if (el.totalAmount && el.totalTaxAmount) {
            this.totalPrice.priceTaxSmallC =
              parseFloat(el.totalAmount) + parseFloat(el.totalTaxAmount);
            this.totalPrice.priceTaxSmall = (
              parseFloat(el.totalAmount) + parseFloat(el.totalTaxAmount)
            ).toFixed(2);
            if (this.totalPrice.priceTaxSmall < 0) {
              this.totalPrice.priceTaxBig =
                "(负数)" +
                convertCurrency(Math.abs(this.totalPrice.priceTaxSmall));
            } else {
              this.totalPrice.priceTaxBig = convertCurrency(
                Math.abs(this.totalPrice.priceTaxSmall)
              );
            }
          } else {
            this.totalPrice.priceTaxSmallC = "";
            this.totalPrice.priceTaxSmall = "";
          }
        }

        console.log(this.tableData.map((el) => el.tax));
        // 销售方
        // this.sellerForm.name = el.sellerName
        // this.sellerForm.identifier = el.sellerTaxId
        // this.sellerForm.addressOrTel = el.sellerAddrTel
        this.sellerForm.account = el.sellerBankAccount;
        this.sellerForm.remarks = el.remark;

        // 票尾
        // this.payee = el.skr
        // this.issuer = el.fhr
        // this.reviewer = el.kpr

        // 企业开票人ID
        this.companyUserId = el.companyUserId;
        // 差额征税扣除额
        this.differentialTaxationAmount = el.differentialTaxationAmount;
        //*发票类别 0：正数发票 1：负数发票 2：空白作废发票(专普票时存在)   ?????
        this.invoiceCategory = el.invoiceCategory;
        //integer($int64) //流水号（扫码开票/待开列表/清单开票/批量开票必填）
        // this.invoiceSeries = el.invoiceSeries
        // 发票清单标志
        this.listingLabel = el.listingLabel;
        // 主要商品名称
        this.mainProductName = el.mainProductName;
        //*特殊票种标识 00：不是 01：农产品销售 02：农产品收购 03：是
        this.specialLabel = el.specialLabel;

        if (
          this.routeList.type == "fapiaochaxun-fushu" ||
          this.routeList.type == "fapiaochaxun-hongchong"
        ) {
          console.log("123");
          this.invoiceCategory = 1;
          this.blueInvoiceCode = el.invoiceCode ? el.invoiceCode : ""; //string  //原发票代码（为负数发票时存在）
          this.blueInvoiceNo = el.invoiceNo ? el.invoiceNo : ""; //string  //原发票号码（为负数发票时存在）
          this.originalInvoiceDate = el.invoiceDate ? el.invoiceDate : ""; // string //原开票日期 格式：YYYYMMDDHHMMSS

          //负数 跳发票查询返回
          for (let i = 0; i < this.tableData.length; i++) {
            let els = this.tableData[i];
            if (els.count) {
              if (els.count < 0) {
                this.tableData[i].count = els.count;
              } else {
                this.tableData[i].count = "-" + els.count;
              }
            } else {
              this.tableData[i].count = "";
            }

            if (els.amountView) {
              if (els.amountView < 0) {
                this.tableData[i].amount = els.amount;
                this.tableData[i].amountView = els.amountView;
              } else {
                this.tableData[i].amount = "-" + els.amount;
                this.tableData[i].amountView = "-" + els.amountView;
              }
            } else {
              this.tableData[i].amount = "";
              this.tableData[i].amountView = "";
            }
            if (els.taxAmount || els.taxAmount === 0) {
              if (els.taxAmount <= 0) {
                this.tableData[i].tax = els.taxAmount.toFixed(2);
                this.tableData[i].taxC = els.taxAmount.toFixed(2);
              } else {
                this.tableData[i].tax = "-" + els.taxAmount.toFixed(2);
                this.tableData[i].taxC = "-" + els.taxAmount.toFixed(2);
              }
            } else {
              this.tableData[i].tax = "";
              this.tableData[i].taxC = "";
            }

            this.totalPrice.totalAmountC = el.totalAmount
              ? "-" + el.totalAmount
              : "";
            this.totalPrice.totalAmount = el.totalAmount
              ? "-" + el.totalAmount.toFixed(2)
              : "";
            let resTotal =
              parseFloat(el.totalAmount) + parseFloat(el.totalTaxAmount);
            this.totalPrice.priceTaxSmallC = resTotal ? "-" + resTotal : "";
            this.totalPrice.priceTaxSmall = resTotal
              ? "-" + resTotal.toFixed(2)
              : "";
            this.totalPrice.priceTaxBig =
              "(负数)" +
              convertCurrency(Math.abs(this.totalPrice.priceTaxSmall));
            if (el.totalTaxAmount === 0) {
              this.totalPrice.totalTaxC = 0;
              this.totalPrice.totalTax = 0;
            } else {
              this.totalPrice.totalTaxC = el.totalTaxAmount
                ? "-" + el.totalTaxAmount
                : "";
              this.totalPrice.totalTax = el.totalTaxAmount
                ? "-" + el.totalTaxAmount.toFixed(2)
                : "";
            }
          }
          let remarks =
            "对应正数发票代码：" + el.invoiceCode + "  号码：" + el.invoiceNo;
          this.sellerForm.remarks =
            el.invoiceCode && el.invoiceNo ? remarks : "";
        }
        this.computerTotalPrice()
        // this.invoiceTypeChange();
        console.log(this.tableData.map((el) => el.tax));
        return;
      }

      // 红字信息表数据
      if (
        this.routeList.type == "hongzixinxi" ||
        this.routeList.type == "hongzixinxi-fushu"
      ) {
        const el = this.routeList.data;
        const item = this.routeList.item;
        this.invoiceCategory = 1;
        // if (this.invoiceCategory == 1) {
          this.blueInvoiceCode = el.invoiceCode ? el.invoiceCode : ""; //string  //原发票代码（为负数发票时存在）
          this.blueInvoiceNo = el.invoiceNo ? el.invoiceNo : ""; //string  //原发票号码（为负数发票时存在）
          this.originalInvoiceDate = el.invoiceDate? el.invoiceDate
            : ""; // string //原开票日期 格式：YYYYMMDDHHMMSS
          this.noticeNo = item.infoTabNo ? item.infoTabNo : ""; // string //红字通知单编号(增值税电子专用发票冲红，增值税专用发票冲红，该字段必填)
        // }

        // const el = this.routeList.data
        // const item = this.routeList.item
        // 发票类型
        this.invoiceTypeVal = el.invoiceType;
        // 征税方式
        if (el.collectionType == 2) {
          this.taxMethodVal = 2;
          this.differentialTaxationAmount = el.differentialTaxationAmount;
          this.tableData[0].amount = el.differentialTaxationAmount
            ? el.differentialTaxationAmount
            : "";
          this.tableData[0].amountView = el.differentialTaxationAmount
            ? el.differentialTaxationAmount
            : "";
        }
        this.taxMethodVal = Number(el.collectionType);
        // 是否含税
        // this.isTaxIncluded = el.isTaxIncluded

        // 购买方
        this.purchaserForm.name = el.buyerName;
        this.purchaserForm.identifier = el.buyerTaxId;
        this.purchaserForm.addressOrTel = el.buyerAddrTel;
        this.purchaserForm.account = el.buyerBankAccount;

        this.recipientInfo.tel = el.phone;
        // this.recipientInfo.email = el.pushMail

        // 商品数据
        // this.tableData = []
        this.invoiceTypeChange();
        this.toDealTaxIncluded(el.goodsCommonDetail);
        this.toPreDealTaxRate(el.goodsCommonDetail);
        for (let i = 0; i < el.goodsCommonDetail.length; i++) {
          let obj = this.toDealGoodsDetail(el.goodsCommonDetail[i]);
          this.tableData.splice(i, 1, obj);
        }

        // 合计
        this.totalPrice.totalAmountC = parseFloat(el.priceAmount);
        this.totalPrice.totalAmount = parseFloat(el.priceAmount).toFixed(2);
        this.totalPrice.totalTaxC = parseFloat(el.taxAmount);
        this.totalPrice.totalTax = parseFloat(el.taxAmount).toFixed(2);
        if (el.totalPriceWithTax) {
          this.totalPrice.priceTaxSmallC = el.totalPriceWithTax;
          this.totalPrice.priceTaxSmall = el.totalPriceWithTax.toFixed(2);
          if (this.totalPrice.priceTaxSmall < 0) {
            this.totalPrice.priceTaxBig =
              "(负数)" +
              convertCurrency(Math.abs(this.totalPrice.priceTaxSmall));
          } else {
            this.totalPrice.priceTaxBig = convertCurrency(
              Math.abs(this.totalPrice.priceTaxSmall)
            );
          }
        } else {
          if (el.priceAmount && el.taxAmount) {
            this.totalPrice.priceTaxSmallC =
              parseFloat(el.priceAmount) + parseFloat(el.taxAmount);
            this.totalPrice.priceTaxSmall = (
              parseFloat(el.priceAmount) + parseFloat(el.taxAmount)
            ).toFixed(2);
            if (this.totalPrice.priceTaxSmall < 0) {
              this.totalPrice.priceTaxBig =
                "(负数)" +
                convertCurrency(Math.abs(this.totalPrice.priceTaxSmall));
            } else {
              this.totalPrice.priceTaxBig = convertCurrency(
                Math.abs(this.totalPrice.priceTaxSmall)
              );
            }
          } else {
            this.totalPrice.priceTaxSmallC = "";
            this.totalPrice.priceTaxSmall = "";
          }
        }

        // 销售方
        // this.sellerForm.name = el.sellerName
        // this.sellerForm.identifier = el.sellerTaxId
        // this.sellerForm.addressOrTel = el.sellerAddrTel
        this.sellerForm.account = el.sellerBankAccount;
        let remarks =
          "原发票代码" +
          el.invoiceCode +
          ", 原发票号码" +
          el.invoiceNo +
          ", 红字通知单编号" +
          item.infoTabNo;
        this.sellerForm.remarks = el.invoiceCode && el.invoiceNo ? remarks : "";
        // 票尾
        // this.payee = el.skr
        // this.issuer = el.fhr
        // this.reviewer = el.kpr

        this.computerTotalPrice()
        // this.invoiceTypeChange();
        return;
      }
      // 没有路由数据--就展示页面默认数据
      // 常驻商品
      // this.toPermanentInit()
    },
    // 商品含税状态预处理
    toDealTaxIncluded(arr) {
      let TaxIncluded = "";
      for (let i = 0; i < arr.length; i++) {
        const el = arr[i];
        if (el.isTax == 0) {
          TaxIncluded = false;
        } else {
          TaxIncluded = true;
        }
      }
      if (this.taxMethodVal != 0) {
        TaxIncluded = true;
      }
      this.isTaxIncluded = TaxIncluded;
    },
    // 路由跳转-商品详情处理
    toDealGoodsDetail(val) {
      let obj = { ...this.tableData_el, ...val };
      if (val.goodsName == "财务人员填写") {
        obj.name = val.goodsName;
      } else if (val.goodsName != "财务人员填写" && val.goodsShortName) {
        obj.name = "*" + val.goodsShortName + "*" + val.goodsName;
      } else {
        obj.name = val.goodsName;
      }
      obj.model = val.specifications;
      // obj.unit = val.unit
      obj.count = val.goodsNumber;
      obj.price = val.goodsPrice;
      obj.priceView = val.goodsPrice;
      if (val.goodsNumber && val.goodsPrice) {
        obj.amount = parseFloat(val.goodsNumber * val.goodsPrice).toFixed(8);
      } else {
        obj.amount = val.goodsAmount;
      }
      obj.amountView = val.goodsAmount;
      obj.taxRate = this.toDealTaxRate(obj.taxRate);
     if(val.taxAmount != null){
        obj.tax=parseFloat(val.goodsAmount*val.taxRate).toFixed(2);
        obj.taxC =parseFloat(val.goodsAmount*val.taxRate).toFixed(2);
     }else{
       obj.tax ='';
       obj.taxC ='';
     }
      obj.isDiscount =
        val.lineNature == 1 || val.lineNature == 2 ? true : false;
      obj.isDiscountLine = val.lineNature == 1 ? true : false;
      // obj.isPermanent = val.scanFlag == 1 ? true:false
      if (this.taxMethodVal == 2) {
        let resSales = "";
        if (val.isTax == 0) {
          // 数据为不含税
          if (val.goodsAmount && obj.taxRate) {
            let taxRates = parseFloat(obj.taxRate);
            let amounts = parseFloat(val.goodsAmount);
            let deduction = parseFloat(this.differentialTaxationAmount);
            resSales = (amounts - deduction) * (taxRates + 1) + deduction;
            this.sales = parseFloat(resSales.toFixed(2));
          }
        } else {
          if (val.goodsAmount) {
            this.sales = parseFloat(val.goodsAmount.toFixed(2));
          }
        }
      }

      if (this.taxMethodVal == 1) {
        if (val.isTax == 0) {
          // 数据为不含税
          if (obj.amountView && obj.tax) {
            let resAmount = parseFloat(obj.amountView) + parseFloat(obj.tax);
            obj.amount = resAmount;
            obj.amountView = parseFloat(resAmount.toFixed(2));
            if (obj.count) {
              obj.price = obj.amount / obj.count;
              let resPrices = obj.amountView / obj.count;
              obj.priceView = this.toNonExponential(
                parseFloat(resPrices.toFixed(8))
              );
            }
          }
        } else {
        }
      } else {
        if (this.isTaxIncluded) {
          // 页面为含税
          if (val.isTax == 0) {
            // 数据为不含税
            if (obj.priceView && obj.taxRate) {
              let prices = parseFloat(obj.price);
              let taxRates = parseFloat(obj.taxRate);
              let resPrice = prices * (taxRates + 1);
              obj.price = resPrice;
              obj.priceView = this.toNonExponential(
                parseFloat(resPrice.toFixed(8))
              );
            }
            if (obj.amountView && obj.taxRate) {
              let amounts = parseFloat(obj.amount);
              let taxRates = parseFloat(obj.taxRate);
              let resAmount = "";
              if (this.taxMethodVal == 2) {
                let differentialTaxationAmount = parseFloat(
                  this.differentialTaxationAmount
                );
                resAmount =
                  (amounts - differentialTaxationAmount) * (taxRates + 1) +
                  differentialTaxationAmount;
              } else {
                resAmount = amounts * (taxRates + 1);
              }
              obj.amount = resAmount;
              obj.amountView = parseFloat(resAmount.toFixed(2));
              console.log(amounts, taxRates, resAmount);
              if (obj.count) {
                obj.price = obj.amount / obj.count;
                let resPrices = obj.amountView / obj.count;
                obj.priceView = this.toNonExponential(
                  parseFloat(resPrices.toFixed(8))
                );
              }
            }
          } else {
            // 数据为含税
            if (obj.priceView && obj.taxRate) {
              let taxRates = parseFloat(obj.taxRate);
              let resPrice = parseFloat(obj.price);
              obj.price = resPrice;
              obj.priceView = this.toNonExponential(
                parseFloat(resPrice.toFixed(8))
              );
            }
            if (obj.amountView && obj.taxRate) {
              let amounts = parseFloat(obj.amount);
              let taxRates = parseFloat(obj.taxRate);
              let resAmount = amounts;
              obj.amount = resAmount;
              obj.amountView = parseFloat(resAmount.toFixed(2));
            }
          }
        } else {
          // 页面为不含税
          if (val.isTax == 1) {
            // 数据为含税
            if (obj.priceView && obj.taxRate) {
              let prices = parseFloat(obj.price);
              let taxRates = parseFloat(obj.taxRate);
              let resPrice = prices / (taxRates + 1);
              obj.price = resPrice;
              obj.priceView = this.toNonExponential(
                parseFloat(resPrice.toFixed(8))
              );
            }
            if (obj.amountView && obj.taxRate) {
              let amounts = parseFloat(obj.amount);
              let taxRates = parseFloat(obj.taxRate);
              let resAmount = "";
              if (this.taxMethodVal == 2) {
                let differentialTaxationAmount = parseFloat(
                  this.differentialTaxationAmount
                );
                resAmount =
                  (amounts - differentialTaxationAmount) / (taxRates + 1) +
                  differentialTaxationAmount;
              } else {
                resAmount = amounts / (taxRates + 1);
              }
              obj.amount = resAmount;
              obj.amountView = parseFloat(resAmount.toFixed(2));
              if (obj.count) {
                obj.price = obj.amount / obj.count;
                let resPrices = obj.amountView / obj.count;
                obj.priceView = this.toNonExponential(
                  parseFloat(resPrices.toFixed(8))
                );
              }
            }
          } else {
            // 数据为不含税
            if (obj.priceView && obj.taxRate) {
              let taxRates = parseFloat(obj.taxRate);
              let resPrice = parseFloat(obj.price);
              obj.price = resPrice;
              obj.priceView = this.toNonExponential(
                parseFloat(resPrice.toFixed(8))
              );
            }
            if (obj.amountView && obj.taxRate) {
              let amounts = parseFloat(obj.amount);
              let taxRates = parseFloat(obj.taxRate);
              let resAmount = amounts;
              obj.amount = resAmount;
              obj.amountView = parseFloat(resAmount.toFixed(2));
            }
          }
        }
      }
      console.log(obj);
      return JSON.parse(JSON.stringify(obj));
    },

    // 获取销售方默认信息
    togetSellerDefaultData() {
      console.log("获取销售方默认信息");
      let params = this.taxDiskNum;
      getSellerDefaultData(params)
        .then((response) => {
          if (response && response.code == "200") {
            let res = response.data;
            this.sellerInfos = res;
            // 销方
            this.sellerForm.addressOrTel = res.sellerAddrTel;
            this.sellerForm.account = res.sellerBankAccount;
            this.togetSellerData();

            // 销方票尾
            this.payee = res.skr;
            this.issuer = res.fhr;
            this.reviewer = res.kpr;
          }
        })
        .catch((error) => {});
    },
    togetSellerData() {
      let params = this.taxDiskNum;
      getSellerData(params)
        .then((response) => {
          if (response && response.code == "200") {
            let res = response.data;
            this.sellerSelectInfos = res;
            let sel1 = [];
            let sel2 = [];
            for (let i = 0; i < res.length; i++) {
              const el = res[i];
              if (el.sellerAddrTel) {
                sel1.push({ value: el.sellerAddrTel, label: el.sellerAddrTel });
              }
              if (el.sellerBankAccount) {
                sel2.push({
                  value: el.sellerBankAccount,
                  label: el.sellerBankAccount,
                });
              }
            }
            this.sellerAddressOrTel = this.unique(sel1);
            this.sellerAccount = this.unique(sel2.filter((el) => el.value));
          }
        })
        .catch((error) => {});
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
      let params = "";
      getLoginData(params)
        .then((response) => {
          if (response && response.code == "200") {
            let res = response.data;
            this.companyUserInfos = res;
            this.sellerForm.name = res.companyName ? res.companyName : "空";
            this.sellerForm.identifier = res.taxId;
          }
        })
        .catch((error) => {});
    },

    // 发票类型
    invoiceTypeInit() {
      let params = {
        taxDiskNum: this.taxDiskNum,
      };
      getInvoicingType(params)
        .then((response) => {
          if (response && response.code == "200") {
            let res = response.data;
            this.invoiceType = UtilsGetTicketType(res.ticketType);
            this.invoiceTypeVal = this.invoiceType[0].value;
            if (!this.routeList) {
              this.toPermanentInit1();
              // this.invoiceTypeChange()
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
        })
        .catch((error) => {});
    },
    // 科学计数法---转化
    toNonExponential(num) {
      var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
      return num.toFixed(Math.max(0, (m[1] || "").length - m[2]));
    },

    invoiceTypeChange() {
      this.invoiceCode = "";
      this.invoiceNum = "";
      this.invoiceCount = "";

      let params = {
        invoiceType: this.invoiceTypeVal,
        taxDiskNum: this.taxDiskNum,
      };
      getInvoicingTypeDetail(params)
        .then((response) => {
          if (response && response.code == "200") {
            let res = response.data;
            this.invoiceCode = res.invoiceCode;
            this.invoiceNum = res.invoiceNo;
            this.invoiceCount = res.balances;
            this.invoiceDate = res.invoiceDate;
          }
        })
        .catch((error) => {});
      if (this.taxMethodVal != 1) {
        this.selectTaxRateAjax();
      }
    },
    // 税盘税率信息
    selectTaxRateAjax() {
      this.taxRateSelect = [];
      this.taxRateSelect_el = [];
      this.taxRateSelect_const = [];
      let params = {
        invoiceType: this.invoiceTypeVal,
        taxDiskNum: this.taxDiskNum,
      };
      selectTaxRate(params)
        .then((response) => {
          if (response && response.code == "200") {
            let res = response.data;
            if (this.firstFlagRoute && this.routeList) {
              this.toShowRouteData();
              this.firstFlagRoute = false;
              return;
            }
            if (this.routeList) {
              let taxMethodVal = this.routeList.data.collectionType
                ? this.routeList.data.collectionType
                : this.routeList.data.taxationType;
              if (taxMethodVal == 1) {
                this.taxRateSelect = this.taxRateSelect_jianan;
                return;
              }
            }
            console.log(res.length);
            if (res.length > 0) {
              for (let i = 0; i < res.length; i++) {
                const el = res[i];
                let obj = { value: el.taxRate, label: el.taxRate * 100 + "%" };
                this.taxRateSelect.push(obj);
                this.taxRateSelect_el.push(obj);
                this.taxRateSelect_const.push(obj);
              }
            } else {
              console.log(this.taxMethodVal);
              if (this.taxMethodVal != 1) {
                this.taxRateSelect = this.taxRateSelect_default;
                this.taxRateSelect_el = this.taxRateSelect_default;
                this.taxRateSelect_const = this.taxRateSelect_default;
              }
            }
          }
        })
        .catch((error) => {});
    },
    // 税率判断-商品数据处理
    toDealTaxRate(taxRate) {
      //this.taxRateSelect
      //this.taxRateSelect_el
      console.log(taxRate);
      console.log(this.taxRateSelect);
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
      console.log(res);
      return res;
    },
    // 先筛选一遍商品信息， 添加税率项
    toPreDealTaxRate(arr) {
      for (let i = 0; i < arr.length; i++) {
        const el = arr[i];
        if (el.taxRate == 0 && el.zeroTaxMarks) {
          let obj = { value: 0, label: "0%" };
          this.taxRateSelect_PRE.push(JSON.parse(JSON.stringify(obj)));
        } else {
          let obj = { value: el.taxRate, label: el.taxRate * 100 + "%" };
          this.taxRateSelect_PRE.push(JSON.parse(JSON.stringify(obj)));
        }
      }
      console.log("预处理", this.taxRateSelect);
      let array = this.taxRateSelect_PRE.concat(this.taxRateSelect);
      let arrSort = array.sort(createComprisonFunction("value"));
      let res = deteleObject(arrSort);
      this.taxRateSelect = [];
      this.taxRateSelect = res;
      this.taxRateSelect_el = res;
    },
    toPreDealTaxRate1(arr) {
      for (let i = 0; i < arr.length; i++) {
        const el = arr[i];
        if (el.taxRate == null && el.zeroTaxMarks) {
          let obj = { value: 0, label: "0%" };
          this.taxRateSelect_PRE.push(JSON.parse(JSON.stringify(obj)));
        } else {
          let res = "";
          for (let i = 0; i < this.taxRateSelect.length; i++) {
            const ele = this.taxRateSelect[i];
            if (ele.value == el.taxRate) {
              res = parseFloat(el.taxRate) + "";
            }
          }
          if (!res) {
            let obj = { value: 0, label: "0%" };
            this.taxRateSelect_PRE.push(JSON.parse(JSON.stringify(obj)));
          }
        }
      }
      let array = this.taxRateSelect_PRE.concat(this.taxRateSelect);
      let arrSort = array.sort(createComprisonFunction("value"));
      let res = deteleObject(arrSort);
      this.taxRateSelect = [];
      this.taxRateSelect = res;
      this.taxRateSelect_el = res;
    },

    // 征税方式
    taxMethodChange() {
      this.tableData = [];
      this.fillUp();
      //默认含税状态
      this.isTaxIncluded = true;
      //差额
      if (this.taxMethodVal == 2) {
        this.tableData = [];
        this.fillUp();
      } else {
        this.differentialTaxationAmount = "";
      }
      //减按
      if (this.taxMethodVal == 1) {
        this.taxRateSelect = this.taxRateSelect_jianan;
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].taxRate = "";
          this.tableData[i].tax = "";
          this.tableData[i].taxC = "";
        }
      } else {
        this.taxRateSelect = this.taxRateSelect_el;
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].taxRate = "";
          this.tableData[i].tax = "";
          this.tableData[i].taxC = "";
        }
      }

      this.totalPrice = {
        totalAmount: "",
        totalTax: "",
        priceTaxBig: "",
        priceTaxSmall: "",
      };

      this.toPermanentInit();
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
        this.tableData[0].amount =
          this.invoiceCategory == 1 ? 0 - sales : sales;
        this.tableData[0].amountView = parseFloat(
          this.tableData[0].amount.toFixed(2)
        );
        let res = ((sales - deduction) * taxRate) / (taxRate + 1);
        res = this.invoiceCategory == 1 ? 0 - res : res;
        this.tableData[0].tax = taxRate ? res.toFixed(2) : "";
        this.tableData[0].taxC = taxRate ? res : "";
        if (this.tableData[0].amount && this.tableData[0].priceView) {
          if (this.tableData[0].count === "") {
            //没有数量 根据金额和单价计算数量
            let resCount =
              Number(this.tableData[0].amount) /
              Number(this.tableData[0].priceView);
            this.tableData[0].count = parseFloat(resCount.toFixed(6));
          } else {
            //存在数量 根据金额重新计算单价
            let counts = parseFloat(this.tableData[0].count);
            let amounts = parseFloat(this.tableData[0].amount);
            let resPrice = amounts / counts;
            this.tableData[0].price = resPrice;
            this.tableData[0].priceView = this.toNonExponential(
              parseFloat(resPrice.toFixed(8))
            );
          }
        }
      } else {
        // 不含税
        let salesNo = (sales - deduction) / (taxRate + 1) + deduction;
        this.tableData[0].amount = salesNo;
        this.tableData[0].amountView = salesNo.toFixed(2);
        let res = ((sales - deduction) * taxRate) / (taxRate + 1);
        this.tableData[0].tax = taxRate ? res.toFixed(2) : "";
        this.tableData[0].taxC = taxRate ? res : "";
        if (this.tableData[0].amount && this.tableData[0].priceView) {
          if (this.tableData[0].count === "") {
            //没有数量 根据金额和单价计算数量
            let resCount =
              Number(this.tableData[0].amount) /
              Number(this.tableData[0].priceView);
            this.tableData[0].count = parseFloat(resCount.toFixed(6));
          } else {
            //存在数量 根据金额重新计算单价
            let counts = parseFloat(this.tableData[0].count);
            let amounts = parseFloat(this.tableData[0].amount);
            let resPrice = amounts / counts;
            this.tableData[0].price = resPrice;
            this.tableData[0].priceView = this.toNonExponential(
              parseFloat(resPrice.toFixed(8))
            );
          }
        }
      }
      // 差额征收扣除额
      this.differentialTaxationAmount = deduction;
      this.sellerForm.remarks = "差额征税：" + deduction + "。";
      this.remarkNote = this.sellerForm.remarks;
      this.sales = sales ? sales : "";

      // this.computerTaxs(0)
      this.computerTotalPrice();
      this.differenceVisible = false;
    },

    // 开票码
    billingCode() {
      this.billingCodeVisible = true;
    },

    // 复制
    toJumpCopy() {
      // 跳发票查询页(选择发票)
      this.$router.push({
        // name: 'InvoiceInquiry',
        path: "/management/summaryManagement/InvoiceInquiry",
        query: {
          List: JSON.stringify({
            data: this.invoiceTypeVal,
            type: "shandian-fuzhi",
          }),
        },
      });
    },

    // 负数
    toJumpCopyOrRed() {
      if (this.invoiceTypeVal == "004" || this.invoiceTypeVal == "028") {
        // 跳红字信息页
        this.$router.push({
          // name: 'redLetters',
          path: "/management/invoicingManagement/redLetters",
          query: {
            List: JSON.stringify({
              data: this.invoiceTypeVal,
              type: "shandian-fushu",
            }),
          },
        });
      } else {
        // 跳发票查询页(选择发票)
        this.$router.push({
          // name: 'InvoiceInquiry',
          path: "/management/summaryManagement/InvoiceInquiry",
          query: {
            List: JSON.stringify({
              data: this.invoiceTypeVal,
              type: "shandian-fushu",
            }),
          },
        });
      }
    },

    // 折扣
    setDiscountCancel() {
      this.discountVisible = false;
    },
    setDiscountDetermine(val) {
      this.discountVisible = false;
      let index = val.index;
      let disAmount = val.discountAmount;
      this.tableData[index].isDiscount = true;
      let str = JSON.stringify(this.tableData[index]);
      let obj = JSON.parse(str);
      let taxRate = parseFloat(obj.taxRate);
      // let disTax = parseFloat(disAmount) * parseFloat(obj.taxRate)
      let disTax = "";
      if (this.isTaxIncluded) {
        // 含税
        disTax = (parseFloat(disAmount) * taxRate) / (taxRate + 1);
      } else {
        // 不含税
        disTax = parseFloat(disAmount) * taxRate;
      }
      obj.model = "";
      obj.unit = "";
      obj.count = "";
      obj.price = "";
      obj.priceView = "";
      obj.amount = "-" + disAmount;
      obj.amountView = "-" + disAmount;
      obj.tax = "-" + disTax.toFixed(2);
      obj.taxC = "-" + disTax;
      obj.isDiscountLine = true;
      (obj.isPermanent = false), // 改为默认非常驻????
        this.tableData.splice(index + 1, 0, obj);

      this.computerTotalPrice();
    },

    // 价格
    TaxIncluded() {
      console.log("价格", this.isTaxIncluded);
      // 差额征收模式下
      if (this.taxMethodVal == 2) {
        // let sales = parseFloat(this.tableData[0].amountView)
        let sales = parseFloat(this.sales);
        let deduction = parseFloat(this.differentialTaxationAmount);
        let taxRate = parseFloat(this.tableData[0].taxRate);
        let el = this.tableData[0];
        let taxRateStr = taxRate + "";
        if (!taxRateStr) {
          this.tableData[0].price = "";
          this.tableData[0].priceView = "";
          this.tableData[0].amount = "";
          this.tableData[0].amountView = "";
          return;
        }
        if (this.isTaxIncluded) {
          // 含税
          // let salesYes = (sales-deduction) * (taxRate + 1 ) + deduction
          // this.tableData[0].amount = sales ? salesYes:''
          // this.tableData[0].amountView = sales ? parseFloat(salesYes.toFixed(2)):''
          let salesYes = this.sales ? this.sales : "";
          salesYes =
            this.invoiceCategory == 1 ? 0 - Math.abs(salesYes) : salesYes;
          this.tableData[0].amount = this.sales ? salesYes : "";
          this.tableData[0].amountView = this.sales
            ? parseFloat(parseFloat(salesYes).toFixed(2))
            : "";

          if (el.count && sales) {
            this.tableData[0].price = salesYes / el.count;
            this.tableData[0].priceView = this.toNonExponential(
              parseFloat(this.tableData[0].price.toFixed(8))
            );
          }
        } else {
          // 不含税
          let salesNo = (sales - deduction) / (taxRate + 1) + deduction;
          salesNo =
            this.invoiceCategory == 1
              ? 0 - Math.abs(salesNo.toFixed(2))
              : salesNo.toFixed(2);
          this.tableData[0].amount = sales ? salesNo : "";
          this.tableData[0].amountView = sales
            ? parseFloat(parseFloat(salesNo).toFixed(2))
            : "";

          if (el.count && sales) {
            this.tableData[0].price = salesNo / el.count;
            this.tableData[0].priceView = this.toNonExponential(
              parseFloat(this.tableData[0].price.toFixed(8))
            );
          }
        }
        this.computerTotalPrice();
        return;
      }

      // 非差额征收模式下
      if (this.isTaxIncluded) {
        // 含税
        for (let i = 0; i < this.tableData.length; i++) {
          const el = this.tableData[i];
          let taxRateStr = el.taxRate + "";
          if (!taxRateStr) {
            // this.tableData[i].price = ''
            // this.tableData[i].priceView = ''
            // this.tableData[i].amount = ''
            // this.tableData[i].amountView = ''
            continue;
          } else {
            if (el.priceView || el.amountView) {
              if (el.priceView && taxRateStr) {
                let prices = parseFloat(el.priceView);
                let taxRates = parseFloat(el.taxRate);
                let resPrice = prices * (taxRates + 1);
                this.tableData[i].price = resPrice;
                // this.tableData[i].priceView = this.checkNum(resPrice, 9, 8)
                this.tableData[i].priceView = this.toNonExponential(
                  parseFloat(resPrice.toFixed(8))
                );
              }
              if (el.amountView && taxRateStr) {
                let amounts = parseFloat(el.amount);
                let taxRates = parseFloat(el.taxRate);
                let resAmount = amounts * (taxRates + 1);
                this.tableData[i].amount = resAmount;
                // this.tableData[i].amountView = this.checkNum(resAmount, 9, 2)
                this.tableData[i].amountView = parseFloat(resAmount.toFixed(2));
                this.tableData[i].taxC =(amounts *taxRates).toFixed(2)
                this.tableData[i].tax =(amounts *taxRates).toFixed(2)
              }
            }
          }
        }
      } else {
        // 不含税
        for (let i = 0; i < this.tableData.length; i++) {
          const el = this.tableData[i];
          let taxRateStr = el.taxRate + "";
          if (!taxRateStr) {
            // this.tableData[i].price = ''
            // this.tableData[i].priceView = ''
            // this.tableData[i].amount = ''
            // this.tableData[i].amountView = ''
            continue;
          } else {
            if (el.priceView || el.amountView) {
              if (el.priceView && taxRateStr) {
                let taxRates = parseFloat(el.taxRate);
                let resPrice = parseFloat(el.priceView) / (taxRates + 1);
                this.tableData[i].price = resPrice;
                // this.tableData[i].priceView = this.checkNum(resPrice, 9, 8)
                this.tableData[i].priceView = this.toNonExponential(
                  parseFloat(resPrice.toFixed(8))
                );
              }
              if (el.amountView && taxRateStr) {
                let taxRates = parseFloat(el.taxRate);
                let resAmount = parseFloat(el.amount) / (taxRates + 1);
                this.tableData[i].amount = resAmount;
                // this.tableData[i].amountView = this.checkNum(resAmount, 9, 2)
                this.tableData[i].amountView = parseFloat(resAmount.toFixed(2));
                this.tableData[i].taxC =(resAmount *taxRates).toFixed(2)
                this.tableData[i].tax =(resAmount *taxRates).toFixed(2)
              }
            }
          }
        }
      }
      this.computerTotalPrice();
    },

    // 保存
    toSave() {
      console.log(this.complete);

      this.goodsDetail = [];

      // 校验信息
      let checkFlag = true;

      let checkBox = false;
      if (
        this.routeList.type == "BatchInvoicing" ||
        this.routeList.type == "inventoryInvoicing"
      ) {
        //检验有没有选择商品
        console.log(this.tableData);
        if (this.tableData[0].name != "") {
          this.complete = true;
        }
        //检验赋码
        checkFlag = this.fuma && this.complete;
      }
      // 购买方
      if (this.invoiceTypeVal) {
        if (this.invoiceTypeVal == "004" || this.invoiceTypeVal === "028") {
          // 专用发票
          if (
            !this.purchaserForm.name ||
            !this.purchaserForm.identifier ||
            !this.purchaserForm.addressOrTel ||
            !this.purchaserForm.account ||
            !this.sellerForm.account
          ) {
            checkFlag = false;
          }
        } else {
          // 普通发票
          if (!this.purchaserForm.name) {
            checkFlag = false;
          }
        }
      } else {
        this.$alert("请选择发票类型！", "提示", {
          confirmButtonText: "确定",
        });
        return;
      }

      // 商品信息
      if (!this.totalPrice.totalAmount) {
        checkFlag = false;
        console.log(this.fuma);
      } else if (checkFlag) {
        for (let i = 0; i < this.tableData.length; i++) {
          const el = this.tableData[i];
          console.log(el);
          if (
            el.name ||
            el.model ||
            el.unit ||
            el.count ||
            el.priceView ||
            el.amountView ||
            el.taxRate ||
            el.tax
          ) {
            if (
              el.name == null ||
              el.taxRate == null ||
              el.amountView == null ||
              el.tax == null
            ) {
              checkFlag = false;
            } else {
              if (
                !el.name ||
                !el.taxRate.toString() ||
                !el.amountView.toString() ||
                !el.tax.toString()
              ) {
                checkFlag = false;
                // checkBox=false;
              } else {
                // checkBox=true;
                // this.toDealGoodsTable(el);
                // console.log(this.fuma)
                // console.log(el)
                // console.log(el.goodsCode,el.taxClassificationCode)
                if (
                  this.routeList.type == "BatchInvoicing" ||
                  this.routeList.type == "inventoryInvoicing"
                ) {
                  if (
                    (el.goodsCode && el.goodsCode !== "") ||
                    (el.taxClassificationCode &&
                      el.taxClassificationCode !== "")
                  ) {
                    this.fuma = true;
                  } else {
                    this.fuma = false;
                  }
                  console.log(this.fuma);

                  if (this.fuma == false) {
                    checkFlag = false;
                  }
                  // else {
                  //   this.toDealGoodsTable(el);
                  // }
                }
                //  else {
                //   this.toDealGoodsTable(el);
                // }
              }
            }
          }
        }
      }

      console.log("商品字段结果", this.goodsDetail);

      if(this.routeList.type == "BatchInvoicing" ||this.routeList.type == "inventoryInvoicing"){
        if (
          !this.sellerForm.name ||
          !this.sellerForm.identifier ||
          !this.sellerForm.addressOrTel ||
          !this.sellerForm.account
        ) {
          checkFlag = false;
          // checkbox=false;
        }
      }else{
        // 销售方
      if (this.invoiceTypeVal == "004" || this.invoiceTypeVal == "028") {
        if (
          !this.sellerForm.name ||
          !this.sellerForm.identifier ||
          !this.sellerForm.addressOrTel ||
          !this.sellerForm.account
        ) {
          checkFlag = false;
          // checkbox=false;
        }
      } else if (this.invoiceTypeVal == "007" || this.invoiceTypeVal == "026") {
        if (
          !this.sellerForm.name ||
          !this.sellerForm.identifier ||
          !this.sellerForm.addressOrTel
        ) {
          checkFlag = false;
          // checkbox=false;
        }
      }
      }

      // 票尾
      if (!this.reviewer) {
        checkFlag = false;
        // checkbox=false;
      }

      // //赋码
      // if (this.complete == false){
      //     checkFlag = false
      // }

      // 校验是否通过
      if (checkFlag) {
        for (let i = 0; i < this.tableData.length; i++) {
          const el = this.tableData[i];
          if (el.goodsName) {
            this.toDealGoodsTable(el);
          }
        }
        this.toSaveAjax("0");
      } else {
        console.log(this.tableData);
        // if(checkBox==false){
        for (let i = 0; i < this.tableData.length; i++) {
          const el = this.tableData[i];
          if (el.name) {
            this.toDealGoodsTable(el);
          }
        }
        // }

        this.$confirm("校验失败,发票信息不完善, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.toSaveAjax("1");
          })
          .catch((error) => {
            this.$message({
              type: "info",
              message: "取消成功",
            });
            console.log(error);
          });
      }
    },
    toSaveAjax(val) {
      let infoFlag = parseInt(val);
      this.listingLabel = this.goodsDetail.length > 8 ? 1 : 0;
      if (this.goodsDetail[0]) {
        let el = this.goodsDetail[0];
        if (el.goodsName == "财务人员填写") {
          this.mainProductName = el.goodsName;
        } else {
          this.mainProductName = "*" + el.goodsShortName + "*" + el.goodsName;
        }
      } else {
        this.mainProductName = "";
      }

      let params = {
        blueInvoiceCode: this.blueInvoiceCode ? this.blueInvoiceCode : "", //string  //原发票代码（为负数发票时存在）
        blueInvoiceNo: this.blueInvoiceNo ? this.blueInvoiceNo : "", //string  //原发票号码（为负数发票时存在）
        buyerAddrTel: this.purchaserForm.addressOrTel,
        buyerBankAccount: this.purchaserForm.account,
        buyerName: this.purchaserForm.name, // *
        buyerTaxId: this.purchaserForm.identifier,
        buyerId: this.buyerId,
        companyUserId: this.companyUserId, // 国企开票人ID
        differentialTaxationAmount:
          this.taxMethodVal == 2 ? this.differentialTaxationAmount : "", // 差额征税扣除额
        goodsCommonDetail: this.goodsDetail,
        financeFlag: this.financeFlag, //integer($int32) //财务填写标识：0-默认，1-包含财务人员填写商品
        infoFlag: infoFlag, // 信息完整标志，保存到待开需填：0.信息不完整 1.信息完整
        invoiceSeries: this.invoiceSeries, //integer($int64)   //流水号（扫码开票/待开列表/清单开票/批量开票必填）
        invoiceCategory: this.invoiceCategory, //*发票类别 0：正数发票 1：负数发票 2：空白作废发票(专普票时存在)
        invoiceType: this.invoiceTypeVal, //*发票类型 004：增值税专用发票 007：增值税普通发票 025：卷式发票 026：电子普通发票 028：电子专用发票 005: 机动车销售统一发票
        listingLabel: this.listingLabel, //*发票清单标志 0：无清单 1：有清单
        mainProductName: this.mainProductName, // 主要商品名称
        noticeNo: this.noticeNo, // string //红字通知单编号(增值税电子专用发票冲红，增值税专用发票冲红，该字段必填)
        originalInvoiceDate: this.originalInvoiceDate, // string //原开票日期 格式：YYYYMMDDHHMMSS
        pushMail: this.recipientInfo.email,
        pushPhone: this.recipientInfo.tel,
        remark: this.sellerForm.remarks,
        // requestModel: '',                                   // ????
        sellerAddrTel: this.sellerForm.addressOrTel,
        sellerBankAccount: this.sellerForm.account,
        sellerName: this.sellerForm.name, //*
        sellerTaxId: this.sellerForm.identifier, //*
        skr: this.payee,
        fhr: this.issuer,
        kpr: this.reviewer, //*
        source: this.source ? this.source : 1, // 来源 0.审核开票 1.闪电开票 2.批量开票 3.清单开票 4.扫码开票 5.待开列表
        specialLabel: this.specialLabel, //*特殊票种标识 00：不是 01：农产品销售 02：农产品收购 03：是
        taxDiskNum: this.taxDiskNum, //*税盘号
        taxId: this.userLoginInfo.taxId, //纳税号
        // taxIncludedFlag: this.isTaxIncluded ? 1 : 0,
        taxationType: this.taxMethodVal, // 征税方式 0：普通征税 1：减按计征 2：差额征税
        totalAmount: this.totalPrice.totalAmount, // 总金额(不含税金额)
        totalPriceWithTax: this.totalPrice.priceTaxSmall, // 价税合计(含税金额)
        totalTaxAmount: this.totalPrice.totalTax, // 总税额
      };
      lightInvoiceSave(params)
        .then((response) => {
          if (response && response.code == "200") {
            // let res = response.data
            if (
              this.routeList.type == "BatchInvoicing" ||
              this.routeList.type == "inventoryInvoicing"
            ) {
              this.$alert("保存成功，可在原列表中查看该张发票信息", "提示", {
                confirmButtonText: "确定",
                type: "success",
                callback: (action) => {
                  this.toEmpty();
                  this.invoiceSeries = "";
                  this.goToPages();
                },
              });
            } else {
              this.$alert("保存成功，可在待开列表中查看该张发票信息", "提示", {
                confirmButtonText: "确定",
                type: "success",
                callback: (action) => {
                  this.toEmpty();
                  this.invoiceSeries = "";
                  this.goToPages();
                },
              });
            }
          }
        })
        .catch((error) => {});
    },

    // 清空
    toEmpty() {
      for (let key in this.purchaserForm) {
        this.purchaserForm[key] = "";
      }

      for (let key in this.recipientInfo) {
        this.recipientInfo[key] = "";
      }

      let str = JSON.stringify(this.tableData_el);
      this.tableData = [];
      // for (let i=0; i<5; i++) {
      //     this.tableData.push(JSON.parse(str))
      // }
      this.fillUp();

      // 价格合计
      for (let key in this.totalPrice) {
        this.totalPrice[key] = "";
      }
      // this.computerTotalPrice()
      // this.totalPrice.totalAmount = ''
      // this.totalPrice.totalTax = ''
      // this.totalPrice.priceTaxBig = ''
      // this.totalPrice.priceTaxSmall = ''

      this.sellerForm.remarks = "";

      // 购买方导入客户ID
      this.buyerId = "";
      // 企业开票人ID
      this.companyUserId = "";
      // 差额征税扣除额
      this.differentialTaxationAmount = "";
      //*发票类别 0：正数发票 1：负数发票 2：空白作废发票(专普票时存在)
      this.invoiceCategory = 0;
      //integer($int64) //流水号（扫码开票/待开列表/清单开票/批量开票必填）
      this.invoiceSeries = "";

      this.blueInvoiceCode = ""; //string  //原发票代码（为负数发票时存 在）
      this.blueInvoiceNo = ""; //string  //原发票号码（为负数发票时存 在）

      // 发票清单标志 (商品行数大于8, 即为有清单1)
      this.listingLabel = "";
      // 主要商品名称     ????----不用传
      this.mainProductName = "";
      //*特殊票种标识 00：不是 01：农产品销售 02：农产品收购 03：是
      this.specialLabel = "";
      //发票行性质 0：无折扣行商品 1.折扣行 2.有折扣行商品 3.（详见清单列表） 4.折扣行总和    ???/--- 商品信息
      this.lineNature = 0;
    },

    // 开票按钮
    invoicing() {
      //test
      // this.invoiceTypeChange()
      // this.toEmpty()
      // this.invoicePrievw({invoiceType: '026'})
      // 发票剩余份数
      if (this.invoiceCount == "0") {
        this.$alert("发票已用完，无法开具发票！", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        });
        return;
      }

      this.goodsDetail = [];

      // 校验信息
      let check = this.checkInfo();
      if (!check) return;

      this.invoicingAjax("0");

      console.log("商品表格--", this.tableData);
      console.log("销售方", this.sellerForm);
    },
    invoicingAjax(val) {
      let infoFlag = parseInt(val);
      this.listingLabel = this.goodsDetail.length > 8 ? 1 : 0;
      if (this.invoiceTypeVal == "026" || this.invoiceTypeVal == "028") {
        this.listingLabel = 0;
      }

      // this.mainProductName = '*' + this.goodsDetail[0].goodsShortName + '*' + this.goodsDetail[0].goodsName
      let el = this.goodsDetail[0];
      if (el.goodsName == "财务人员填写") {
        this.mainProductName = el.goodsName;
      } else {
        this.mainProductName = "*" + el.goodsShortName + "*" + el.goodsName;
      }

      let params = {
        blueInvoiceCode: this.blueInvoiceCode ? this.blueInvoiceCode : "", //string  //原发票代码（为负数发票时存在）
        blueInvoiceNo: this.blueInvoiceNo ? this.blueInvoiceNo : "", //string  //原发票号码（为负数发票时存在）
        buyerAddrTel: this.purchaserForm.addressOrTel,
        buyerBankAccount: this.purchaserForm.account,
        buyerName: this.purchaserForm.name, // *
        buyerTaxId: this.purchaserForm.identifier,
        buyerId: this.buyerId,
        companyUserId: this.companyUserId, // 国企开票人ID
        differentialTaxationAmount:
          this.taxMethodVal == 2 ? this.differentialTaxationAmount : "", // 差额征税扣除额
        goodsCommonDetail: this.goodsDetail,
        financeFlag: this.financeFlag, //integer($int32) //财务填写标识：0-默认，1-包含财务人员填写商品
        infoFlag: infoFlag, // 信息完整标志，保存到待开需填：0.信息不完整 1.信息完整
        invoiceSeries: this.invoiceSeries, //integer($int64)   //流水号（扫码开票/待开列表/清单开票/批量开票必填）
        invoiceCategory: this.invoiceCategory, //*发票类别 0：正数发票 1：负数发票 2：空白作废发票(专普票时存在)
        invoiceType: this.invoiceTypeVal, //*发票类型 004：增值税专用发票 007：增值税普通发票 025：卷式发票 026：电子普通发票 028：电子专用发票 005: 机动车销售统一发票
        listingLabel: this.listingLabel, //*发票清单标志 0：无清单 1：有清单
        mainProductName: this.mainProductName, // 主要商品名称
        noticeNo: this.noticeNo, // string //红字通知单编号(增值税电子专用发票冲红，增值税专用发票冲红，该字段必填)
        originalInvoiceDate: this.originalInvoiceDate, // string //原开票日期 格式：YYYYMMDDHHMMSS
        pushMail: this.recipientInfo.email,
        pushPhone: this.recipientInfo.tel,
        remark:
          this.taxMethodVal == 2
            ? this.sellerForm.remarks.split(this.remarkNote).join("")
            : this.sellerForm.remarks,
        // requestModel: '',                                   // ????
        sellerAddrTel: this.sellerForm.addressOrTel,
        sellerBankAccount: this.sellerForm.account,
        sellerName: this.sellerForm.name, //*
        sellerTaxId: this.sellerForm.identifier, //*
        skr: this.payee,
        fhr: this.issuer,
        kpr: this.reviewer, //*
        source: this.source ? this.source : 1, // 来源 0.审核开票 1.闪电开票 2.批量开票 3.清单开票 4.扫码开票 5.待开列表
        specialLabel: this.specialLabel, //*特殊票种标识 00：不是 01：农产品销售 02：农产品收购 03：是
        taxDiskNum: this.taxDiskNum, //*税盘号
        taxId: this.userLoginInfo.taxId, //纳税号
        // taxIncludedFlag: this.isTaxIncluded ? 1 : 0,
        taxationType: this.taxMethodVal, // 征税方式 0：普通征税 1：减按计征 2：差额征税
        totalAmount: this.totalPrice.totalAmount, // 总金额(不含税金额)
        totalPriceWithTax: this.totalPrice.priceTaxSmall, // 价税合计(含税金额)
        totalTaxAmount: this.totalPrice.totalTax, // 总税额
      };
      this.loading = true;
      clearTimeout(this.timer);
      showFullScreenLoading("开票中，请稍候");
      lightInvoiceSubmit(params)
        .then((response) => {
          if (response.code == "200") {
            if (response.data) {
              let res = response.data;
              this.pollingData = res ? res : "";
              this.isOpenInvoicing = true;
              this.getRedis();
              this.setInter(2000, this.getRedis);
            } else {
              this.loading = false;
              tryHideFullScreenLoading();
            }

            // return
          } else {
            this.loading = false;
            tryHideFullScreenLoading();
          }
          // this.$alert(`${response.msg}`, '提示', {
          //     confirmButtonText: '确定',
          //     type: 'warning',
          //     callback: action => {}
          // });
        })
        .catch((error) => {});
    },
    //创建60秒定时任务，每3秒执行一次
    setInter(s, fn) {
      let count = 0;
      let timeOut = (s, fn) => {
        var time1 = setTimeout(() => {
          count++;
          if (count < 30 && this.loading == true) {
            console.log("轮询继续", count);
            fn.call(this);
            timeOut(s, fn);
          } else {
            tryHideFullScreenLoading();
            console.log("已结束");
            clearTimeout(this.timer);
            this.loading = false;
            this.isOpenInvoicing = false;
            this.$alert("请求超时，开票失败！", "提示", {
              confirmButtonText: "确定",
              type: "warning",
            });
          }
        }, s);
        this.timer = time1;
      };
      timeOut(s, fn);
    },
    //核心通信请求~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`
    async getRedis() {
      // let val = this.pollingData
      const res = await getRedis({ key: this.pollingData });
      if (res.data.code == 1) {
        // this.continue = false
        clearTimeout(this.timer);

        tryHideFullScreenLoading();
        if (res.data.msgCode == 200) {
          //记录打印流水号
          this.pdfSeies = res.data.data.invoiceSeries;
          this.tableId = res.data.tableId;
          this.invoiceTypeChange();
          let parameterSet = localStorage.getItem("initSetParameter")
            ? JSON.parse(localStorage.getItem("initSetParameter"))
            : "";
          this.$alert(res.data.message, "提示", {
            confirmButtonText: "确定",
            type: "success",
            callback: (action) => {
              this.toEmpty();
              // 发票预览判断
              taxDiskNumDetailsApi(this.$store.state.user.taxDiskNum)
                .then((response) => {
                  if (response && response.code == "200") {
                    console.log(response);
                    if (response.data.previewMode === 1) {
                      this.invoicePrievw(res.data);
                    } else {
                      this.goToPages();
                    }
                  }
                })
                .catch((error) => {});
            },
          });
          this.invoiceSeries = "";
        } else {
          this.$alert(`${res.data.message}`, "提示", {
            confirmButtonText: "确定",
            type: "warning",
          });
        }
        this.isOpenInvoicing = false;
      } else {
        this.continue = true;
        console.log(this.continue);
      }
    },
    // 发票预览
    invoicePrievw(val) {
      this.taxDetail = {
        invoiceType: this.invoiceTypeVal,
        invoiceSeries: this.pdfSeies,
        applicantPhone: this.sendTel,
        email: this.sendEmail,
        id: this.tableId,
      };
      // this.taxDetail={
      //     'invoiceType':'026',
      //     'invoiceSeries':'2295390503459095151',
      //     'applicantPhone':this.recipientInfo.tel,
      //     'email':this.recipientInfo.email,
      //     'id':this.tableId
      // }
      console.log(this.recipientInfo);
      if (val.invoiceType == "026" || val.invoiceType == "028") {
        this.isElectronic = true;
      } else {
        this.isElectronic = false;
      }
      this.invoicePreviewTitle = this.isElectronic
        ? "发票展示"
        : "电子发票展示";
      this.invoicePreviewVisible = true;
    },

    // 商品列表数据处理
    toDealGoodsTable(el) {
      console.log("商品列表数据处理", el);
      if (
        (el.goodsCode && el.goodsCode !== "") ||
        (el.taxClassificationCode && el.taxClassificationCode !== "")
      ) {
        this.fuma = true;
      } else {
        this.fuma = false;
      }
      console.log(this.fuma);
      let gName = "";
      let shortName = "";
      if (el.name == "财务人员填写") {
        shortName = "";
        gName = el.name;
      } else {
        if (el.name && el.name.indexOf("*") != "-1") {
          let arr = el.name.split("*");
          shortName = arr[1];
          gName = arr[2];
        } else {
          gName = el.name;
        }
      }
      // 处理请求接口所需商品字段
      let obj = {
        createTime: el.createTime, //创建时间
        goodsAmount: el.amountView, //number //商品金额----（tableData）
        goodsCode: el.taxClassificationCode
          ? el.taxClassificationCode
          : el.goodsCode, //string //商品编码---  taxClassificationCode
        goodsName: gName, //string //商品名称---- goodsName/（tableData）
        goodsNumber: el.count, //number //商品数量----（tableData）
        goodsPrice: el.priceView, //number //商品单价----（tableData）
        goodsSelfCode: el.goodsSelfCode, //string //商品自行编码--- goodsSelfCode
        goodsShortName: shortName, //string //商品简称（税收分类简称）--- 从goodsName中分割*获取
        goodsSubName: el.taxClassificationName
          ? el.taxClassificationName
          : el.goodsSubName, //string //税目名称(又叫商品分类编码简称)--- taxClassificationName
        id: el.id, //integer($int64) //ID
        incentivesLabel: el.incentivesLabel, //string //优惠政策标识 无免税100%先征后退50%先征后退不征税先征后退即征即退100%即征即退30% 即征即退50% 即征即退70% 按3%简易征收,按5%简易征收,稀土产品/简易征收/超税负12%即征即退超税负3%即征即退,超税负8%即征即退----incentivesLabel
        // invoiceSeries: '',	            //integer($int64) //流水号---   ???
        isTax: this.isTaxIncluded ? 1 : 0, //integer($int32) //含税状态 0：否 1：是----（tableData）
        lineNature: 0, //integer($int32) //发票行性质 0：无折扣行商品 1.折扣行2.有折扣行商品 3.（详见清单列表）4.折扣行总和--- ???
        specifications: el.model, //string //规格型号----（tableData）
        taxAmount: el.tax, //number //税额----（tableData）
        taxRate: el.taxRate, //number //税率----（tableData）
        unit: el.unit, //string //单位----（tableData）
        zeroTaxMarks: el.zeroTaxMarks, //string //零税率标识，空代表正常税率1 出口免税和其他免税优惠政策（免税）2 不征增值税（不征税）3 普通零税率（0%）---- zeroTaxMarks
      };
      console.log(el);
      if (el.isDiscount) {
        if (el.isDiscountLine) {
          obj.lineNature = 1;
        } else {
          obj.lineNature = 2;
        }
      }

      if (
        this.routeList.type == "BatchInvoicing" ||
        this.routeList.type == "inventoryInvoicing"
      ) {
        if (el.name) {
          this.goodsDetail.push(obj);
        }
      } else {
        this.goodsDetail.push(obj);
      }
    },

    // 发票信息校验
    checkInfo() {
      // 购买方
      if (this.invoiceTypeVal) {
        if (this.invoiceTypeVal == "004" || this.invoiceTypeVal === "028") {
          // 专用发票
          if (
            !this.purchaserForm.name ||
            !this.purchaserForm.identifier ||
            !this.purchaserForm.addressOrTel ||
            !this.purchaserForm.account
          ) {
            this.$alert("购买方信息不完善，请填写！", "提示", {
              confirmButtonText: "确定",
              type: "warning",
            });
            return false;
          }

          if (!this.sellerForm.account) {
            this.$alert("销售方信息不完善，请填写！", "提示", {
              confirmButtonText: "确定",
              type: "warning",
            });
            return false;
          }
        } else {
          // 普通发票
          if (!this.purchaserForm.name) {
            this.$alert("请填写客户名称！", "提示", {
              confirmButtonText: "确定",
              type: "warning",
            });
            return false;
          }
        }
      } else {
        this.$alert("请选择发票类型！", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        });
        return false;
      }

      // 商品信息
      if (!this.totalPrice.totalAmount) {
        this.$alert("发票金额与开票类型不符(发票金额为负或零)", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        });
        return false;
      } else {
        for (let i = 0; i < this.tableData.length; i++) {
          const el = this.tableData[i];
          let taxStr = el.tax + "";
          if (
            el.name ||
            el.model ||
            el.unit ||
            el.count ||
            el.priceView ||
            el.amountView ||
            el.taxRate ||
            el.tax
          ) {
            if (!el.name) {
              this.$alert(`第${i + 1}行商品信息不完善，请重新输入！`, "提示", {
                confirmButtonText: "确定",
                type: "warning",
              });
              return false;
            } else if (
              el.taxRate === "" ||
              el.taxRate == null ||
              el.taxRate == undefined
            ) {
              this.$alert(`第${i + 1}行，请选择税率！`, "提示", {
                confirmButtonText: "确定",
                type: "warning",
              });
              return false;
            } else if (!el.amountView) {
              this.$alert(`第${i + 1}行商品信息不完善，请重新输入！`, "提示", {
                confirmButtonText: "确定",
                type: "warning",
              });
              return false;
            } else if (!taxStr) {
              this.$alert(`第${i + 1}行商品信息有误，请重新输入！`, "提示", {
                confirmButtonText: "确定",
                type: "warning",
              });
              return false;
            } else {
              this.toDealGoodsTable(el);
            }
          }
        }
      }

      // 销售方
      if (!this.sellerForm.name || !this.sellerForm.identifier) {
        this.$alert("销售方信息不完善，请填写！", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        });
        return false;
      }

      // 票尾
      if (!this.reviewer) {
        this.$alert("开票人信息不完善，请填写！", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        });
        return false;
      }

      return true;
    },

    // 发票模块事件 ==================================================

    // 校验手机号
    watchTel() {
      let str = this.recipientInfo.tel;
      if (parseInt(str) == str) {
        this.recipientInfo.tel = str.length > 11 ? str.substring(0, 11) : str;
      }
    },
    checkTel() {
      let reg = validPhone(this.recipientInfo.tel);
      if (!reg && this.recipientInfo.tel) {
        this.$alert("手机号格式有误，请重新输入！", "提示", {
          confirmButtonText: "确定",
          type: "warning",
          callback: (action) => {
            this.recipientInfo.tel = "";
          },
        });
      } else {
        this.sendTel = this.recipientInfo.tel;
      }
    },
    // 校验邮箱
    checkEmail() {
      let reg = validEamil(this.recipientInfo.email);
      if (!reg && this.recipientInfo.email) {
        this.$alert("邮箱格式有误，请重新输入！", "提示", {
          confirmButtonText: "确定",
          type: "warning",
          callback: (action) => {
            this.recipientInfo.email = "";
          },
        });
      } else {
        this.sendEmail = this.recipientInfo.email;
      }
    },

    // 双击选择客户
    selectCustomer() {
      this.selectCustomerVisible = true;
    },
    selectCustomerDetermine(val) {
      this.selectCustomerVisible = false;
      this.purchaserForm.name = val.customerName ? val.customerName : "";
      this.purchaserForm.identifier = val.taxId ? val.taxId : "";
      this.purchaserForm.addressOrTel = val.addressAndPhone
        ? val.addressAndPhone
        : "";
      this.purchaserForm.account = val.bankAndAccount ? val.bankAndAccount : "";

      this.recipientInfo.tel = val.invoicePhone ? val.invoicePhone : "";
      this.recipientInfo.email = val.invoiceEmail ? val.invoiceEmail : "";
    },

    // 客户导入
    customerImport() {
      this.customerImportVisible = true;
    },
    importCustomerDetermine(val) {
      for (let key in this.purchaserForm) {
        this.purchaserForm[key] = "";
      }
      for (let key in this.recipientInfo) {
        this.recipientInfo[key] = "";
      }

      (this.customerImportVisible = false),
        (this.purchaserForm.name = val.buyerName ? val.buyerName : "");
      this.purchaserForm.identifier = val.buyerTaxId ? val.buyerTaxId : "";
      this.purchaserForm.addressOrTel = val.buyerAddrTel
        ? val.buyerAddrTel
        : "";
      this.purchaserForm.account = val.buyerBankAccount
        ? val.buyerBankAccount
        : "";
      this.buyerId = val.id ? val.id : "";
      this.recipientInfo.tel = val.pushPhone ? val.pushPhone : "";
      this.recipientInfo.email = val.pushMail ? val.pushMail : "";
      console.log("val", val);
    },

    // 纳税人识别号校验
    identifierBlur() {
      let id = this.purchaserForm.identifier;
      if (id == "") return;
      //纳税人识别号一律由15、17、18或20位（字符型，只能输入数字或大写字母）组成
      let reg = /^[A-Z0-9]{0,20}$/.test(id);
      console.log("正则", reg, id, id.length);
      if (reg) {
        if (
          id.length == 15 ||
          id.length == 17 ||
          id.length == 18 ||
          id.length == 20
        ) {
          return;
        }
      }
      this.$alert("纳税人识别号不合法，请修改！", "提示", {
        confirmButtonText: "确定",
        type: "warning",
        callback: (action) => {
          this.purchaserForm.identifier = "";
        },
      });
    },

    inputCusName(event) {
      this.customLenovoVisible = false;
      let dom = this.$refs["customLenovo"];
      let parHeight = event.currentTarget.getBoundingClientRect().y - 10;
      dom.style.top = parHeight + "px";
    },
    watchCusName(val) {
      let _this = this;
      if (_this.purchaserForm.name.length > 3) {
        clearTimeout(_this.timer);
        _this.timer = setTimeout(function () {
          _this.customLenovoAjax();
        }, 2000);
      } else {
        _this.customLenovoVisible = false;
      }
      this.watchPurchaser(val);
    },
    customLenovolenovoDetermine(item) {
      console.log("...", item);
      this.customLenovoVisible = false;
      this.purchaserForm.name = item.customerName ? item.customerName : "";
      this.purchaserForm.identifier = item.taxId ? item.taxId : "";
      this.purchaserForm.addressOrTel = item.addressAndPhone
        ? item.addressAndPhone
        : "";
      this.purchaserForm.account = item.bankAndAccount
        ? item.bankAndAccount
        : "";
      this.recipientInfo.tel = item.invoicePhone ? item.invoicePhone : "";
      this.recipientInfo.email = item.invoiceEmail ? item.invoiceEmail : "";
    },
    customLenovoAjax() {
      let params = {
        customerName: this.purchaserForm.name,
        companyId: this.$store.state.user.loginInfo.companyId, //公司id
      };
      customLenovo(params)
        .then((response) => {
          if (response && response.code == "200") {
            let res = response.data;
            if (res.length > 0) {
              this.customdataList = res;
              this.customLenovoVisible = true;
            } else {
              this.customLenovoVisible = false;
              // this.$confirm('未查询到符合条件的客户, 点击“确定”快速新增客户。', '提示', {
              //     confirmButtonText: '确定',
              //     cancelButtonText: '取消',
              //     type: 'warning'
              // }).then(() => {
              //     // this.autoCodeAjax(index)
              // }).catch(() => {
              //     this.$message({
              //         type: 'info',
              //         message: '已取消新增客户'
              //     });
              //     this.customLenovoVisible = false
              //     // this.purchaserForm.name = ''
              // });
            }
          }
        })
        .catch((error) => {});
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
      } else {
        _this.LenovoBoxVisible = false;
      }
    },
    lenovoDetermine(item) {
      console.log("lenovo", item, this.indexBox);
      // 差额征税--弹框
      if (this.taxMethodVal == 2) {
        // ---------------------需商品页面限制只能选一条数据
        let objs = item;
        objs.fastFlag = 0;
        let obj = this.toDealGoods(objs);
        obj.price = "";
        obj.priceView = "";
        obj.amount = "";
        obj.amountView = "";
        obj.tax = "";
        obj.taxC = "";
        this.tableData.splice(this.indexBox, 1, obj);
        this.differenceVisible = true;
        this.LenovoBoxVisible = false;
        return;
      }

      let obj = this.toDealGoods(item);
      this.tableData.splice(this.indexBox, 1, obj);
      this.LenovoBoxVisible = false;
    },
    lenovoAjax(index) {
      let params = {
        goodsName: this.tableData[index].name,
        taxDiskNumber: this.taxDiskNum, //税控盘编号
      };
      lenovo(params)
        .then((response) => {
          if (response && response.code == "200") {
            let res = response.data;
            if (res.length > 0) {
              this.dataList = res;
              this.LenovoBoxVisible = true;
            } else {
              this.$confirm(
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
                  // this.autoCodeAjax(index)
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: "已取消新增商品",
                  });
                  this.LenovoBoxVisible = false;
                  this.tableData[index].name = "";
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
        })
        .catch((error) => {});
    },
    // autoCodeAjax(index) {
    //     let params = {
    //         goodsName : this.tableData[index].name,
    //     }
    //     autoCode(params).then(response => {
    //         if(response&&response.code=='200'){
    //             let res = response.data
    //             if (res.length>0) {
    //                 this.dataList = res
    //                 this.LenovoBoxVisible = true
    //                 // const el = res[0]
    //                 // this.tableData[index].name = '*' + el.goodsShortName + '*' + el.goodsName
    //             }else {
    //                 this.$message({
    //                     type: 'info',
    //                     message: '智能赋码失败，请手动去选择税收编码!'
    //                 });
    //                 this.tableData[index].name = ''
    //                 this.LenovoBoxVisible = false
    //             }
    //         }else {
    //             this.$message({
    //                 type: 'info',
    //                 message: '新增商品失败!'
    //             });
    //             this.tableData[index].name = ''
    //             this.LenovoBoxVisible = false
    //         }
    //     }).catch(error => {})
    // },

    // 双击选择商品
    selectProduct(item, index) {
      this.index = index;
      this.selectProductVisible = true;
    },
    // 商品组件Cancel
    selectProductCancel() {
      this.selectProductVisible = false;
    },
    // 商品组件Determine
    selectProductDetermine(vals, index) {
      console.log("val", index, vals);
      let val = JSON.parse(JSON.stringify(vals));
      if (this.taxMethodVal != 1) {
        // this.toPreDealTaxRate1(val);
        this.toPreDealTaxRate(val);
      }
      this.selectProductVisible = false;
      // 差额征税--弹框
      if (this.taxMethodVal == 2) {
        // ---------------------需商品页面限制只能选一条数据
        let objs = val[0];
        objs.fastFlag = 0;
        let obj = this.toDealGoods(objs);
        obj.price = "";
        obj.priceView = "";
        obj.amount = "";
        obj.amountView = "";
        obj.tax = "";
        obj.taxC = "";
        this.tableData.splice(index, 1, obj);
        this.differenceVisible = true;
        return;
      }

      if (val.length == 1) {
        let objs = val[0];
        objs.fastFlag = 0;
        let obj = this.toDealGoods(objs);
        this.tableData.splice(index, 1, obj);
      } else {
        for (let i = 0; i < val.length; i++) {
          let objs = val[i];
          objs.fastFlag = 0;
          let obj = this.toDealGoods(objs);
          this.tableData.splice(index + i, 1, obj);
        }
      }
      this.tableData.forEach((item) => {
        if (
          (item.goodsCode && item.goodsCode !== "") ||
          (item.taxClassificationCode && item.taxClassificationCode !== "")
        ) {
          this.fuma = true;
        } else {
          this.fuma = false;
        }
      });
      console.log("最终商品结果", this.tableData);
    },
    // 商品参数处理
    toDealGoods(val) {
      console.log(val);
      let obj = { ...this.tableData_el, ...val };
      let shortName = val.taxClassificationShortName
        ? val.taxClassificationShortName
        : val.goodsShortName;
      obj.name = "*" + shortName + "*" + val.goodsName;
      obj.model = val.specifications;

      // obj.unit = ''
      // obj.count = ''
      obj.price = val.goodsPrice;
      obj.priceView = val.goodsPrice;
      // obj.amount = ''
      // obj.amountView = ''
      obj.taxRate = this.toDealTaxRate(val.taxRate);
      console.log(obj.taxRate);
      // obj.tax = ''
      if (obj.taxRate == 0 && obj.zeroTaxMarks) {
        obj.disSelectFlag = true;
      } else {
        obj.disSelectFlag = false;
      }

      if (!obj.taxRate && this.taxMethodVal != 1) {
        obj.taxRate = 0;
      }

      if (val.fastFlag == 1 || val.fastFlag == 2 || val.fastFlag == 3) {
        obj.isPermanent = true;
      } else {
        obj.isPermanent = false;
      }

      // if (obj.taxRate == 0) {
      //     obj.taxRate = ''
      // }

      if (this.isTaxIncluded) {
        // 页面为含税
        if (val.taxLogo == 1) {
          // 数据为含税
          if (obj.priceView && obj.taxRate) {
            let prices = parseFloat(obj.price);
            let taxRates = parseFloat(obj.taxRate);
            // let resPrice = prices * (taxRates + 1)
            let resPrice = prices;
            obj.price = resPrice;
            obj.priceView = this.toNonExponential(
              parseFloat(resPrice.toFixed(8))
            );
            // obj.priceView = this.checkNum(resPrice, 9, 8)
          }
        } else {
          // 数据为不含税
          if (obj.priceView && obj.taxRate) {
            let taxRates = parseFloat(obj.taxRate);
            let resPrice = parseFloat(obj.price) * (taxRates + 1);
            obj.price = resPrice;
            obj.priceView = this.toNonExponential(
              parseFloat(resPrice.toFixed(8))
            );
            // obj.priceView = this.checkNum(resPrice, 9, 8)
          }
        }
      } else {
        // 页面为不含税
        if (val.taxLogo == 1) {
          // 数据为含税
          if (obj.priceView && obj.taxRate) {
            let prices = parseFloat(obj.price);
            let taxRates = parseFloat(obj.taxRate);
            let resPrice = prices / (taxRates + 1);
            obj.price = resPrice;
            obj.priceView = this.toNonExponential(
              parseFloat(resPrice.toFixed(8))
            );
            // obj.priceView = this.checkNum(resPrice, 9, 8)
          }
        } else {
          // 数据为不含税
          if (obj.priceView && obj.taxRate) {
            let taxRates = parseFloat(obj.taxRate);
            // let resPrice = parseFloat(val.price) / (taxRates + 1)
            let resPrice = parseFloat(obj.price);
            obj.price = resPrice;
            obj.priceView = this.toNonExponential(
              parseFloat(resPrice.toFixed(8))
            );
            // obj.priceView = this.checkNum(resPrice, 9, 8)
          }
        }
      }
      return JSON.parse(JSON.stringify(obj));
    },

    // 页面初始化常驻商品
    toPermanentInit() {
      let params = {
        taxDiskNum: this.taxDiskNum,
        taxType: this.taxMethodVal + 1,
        type: 0, //类型(0:闪电开票常驻 1:扫码开票常驻)
      };
      residentDefault(params)
        .then((response) => {
          if (response && response.code == "200") {
            let res = response.data;
            if (this.taxMethodVal == 2) {
              res[0].fastFlagID = res[0].id;
              let obj = this.toDealGoods(res[0]);
              this.tableData.splice(0, 1, obj);
            } else {
              for (let i = 0; i < res.length; i++) {
                res[i].fastFlagID = res[i].id;
                let obj = this.toDealGoods(res[i]);
                this.tableData.splice(i, 1, obj);
              }
              if (res.length > 0) {
                this.toAdd();
              }
            }
            console.log("初始化常驻商品", res);
          }
        })
        .catch((error) => {});
      this.computerTotalPrice();
    },
    toPermanentInit1() {
      let params = {
        taxDiskNum: this.taxDiskNum,
        taxType: this.taxMethodVal + 1,
        type: 0, //类型(0:闪电开票常驻 1:扫码开票常驻)
      };
      residentDefault(params)
        .then((response) => {
          if (response && response.code == "200") {
            let res = response.data;
            this.invoiceTypeChange();
            if (this.taxMethodVal == 2) {
              res[0].fastFlagID = res[0].id;
              let obj = this.toDealGoods(res[0]);
              this.tableData.splice(0, 1, obj);
            } else {
              for (let i = 0; i < res.length; i++) {
                res[i].fastFlagID = res[i].id;
                let obj = this.toDealGoods(res[i]);
                this.tableData.splice(i, 1, obj);
              }
              if (res.length > 0) {
                this.toAdd();
              }
            }
            console.log("初始化常驻商品", res);
          }
        })
        .catch((error) => {});
      this.computerTotalPrice();
    },
    // 常驻or取消常驻
    toPermanent(item, index) {
      // if (!item.taxRate) {
      //     this.$alert('请选择税率！', '提示', {
      //         confirmButtonText: '确定',
      //         type: 'warning'
      //     });
      //     return
      // }
      console.log("item", item, index);
      let flag = !item.isPermanent;
      let fastFlag = 0;
      if (flag) {
        if (this.taxMethodVal == 0) fastFlag = 1;
        if (this.taxMethodVal == 1) fastFlag = 2;
        if (this.taxMethodVal == 2) fastFlag = 3;
      }
      let gName = "";
      let shortName = "";
      if (item.name && item.name.indexOf("*") != "-1") {
        let arr = item.name.split("*");
        shortName = arr[1];
        gName = arr[2];
      } else {
        gName = item.name;
      }

      let params = {
        taxClassificationShortName: shortName,
        goodsName: gName,
        specifications: item.model,
        unit: item.unit,
        goodsPrice: this.taxMethodVal == 2 ? "" : item.priceView,
        taxRate: item.taxRate,
        fastFlag: fastFlag,
        taxLogo: this.isTaxIncluded ? 1 : 0,
        scanFlag: item.scanFlag ? item.scanFlag : "",
        id: item.fastFlagID ? item.fastFlagID : "",
        createTime: item.createTime ? item.createTime : "",
        goodsSelfCode: item.goodsSelfCode ? item.goodsSelfCode : "",
        incentivesLabel: item.incentivesLabel ? item.incentivesLabel : "",
        taxClassificationCode: item.taxClassificationCode
          ? item.taxClassificationCode
          : "",
        taxClassificationName: item.taxClassificationName
          ? item.taxClassificationName
          : "",
        // taxDiskNumber: item.taxDiskNumber ? item.taxDiskNumber:'',
        taxDiskNumber: this.taxDiskNum,
        typeId: item.typeId ? item.typeId : "",
        zeroTaxMarks: item.zeroTaxMarks ? item.zeroTaxMarks : "",
      };
      setResident(params)
        .then((response) => {
          if (response && response.code == "200") {
            let res = response.data;
            this.tableData[index].isPermanent = flag;
            return;
          }
        })
        .catch((error) => {});
    },

    // 复制
    toCopy(item, index) {
      let str = JSON.stringify(item);
      let obj = JSON.parse(str);
      console.log(obj);
      obj.isPermanent = false;
      if (obj.isDiscount) {
        obj.isDiscount = false;
        this.tableData.splice(index + 2, 0, obj);
      } else {
        this.tableData.splice(index + 1, 0, obj);
      }
      this.computerTotalPrice();
    },

    // 增行
    toAdd(item, index) {
      let str = JSON.stringify(this.tableData_el);
      this.tableData.push(JSON.parse(str));
    },

    // 删除
    toRemove(item, index) {
      console.log(item);
      console.log(index);
      if (item.isDiscount) {
        console.log("0909090");
        if (item.isDiscountLine) {
          console.log("0909090");
          this.tableData.splice(index, 1);
          this.tableData[index - 1].isDiscount = false;
        } else {
          this.$alert("请先删除折扣行", "提示", {
            confirmButtonText: "确定",
          });
        }
      } else {
        this.tableData.splice(index, 1);
      }
      console.log("___________");
      this.fillUp();
    },

    // 填补商品表格
    fillUp() {
      // if (this.tableData.length < 5) {
      //     let count = 5-this.tableData.length
      //     for (let i = 0; i < count; i++) {
      //         let str = JSON.stringify(this.tableData_el)
      //         this.tableData.push(JSON.parse(str))
      //     }
      // }
      console.log(this.tableData);
      if (this.tableData.length == 0) {
        let str = JSON.stringify(this.tableData_el);
        this.tableData.push(JSON.parse(str));
        for (let key in this.totalPrice) {
          this.totalPrice[key] = "";
        }
      }
      this.computerTotalPrice();
    },

    // 商品表单计算--------------------------------------
    watchCount(item, index) {
      //格式校验
      // let num = this.checkNum(this.tableData[index].count, 9, 6)
      let num = this.tableData[index].count.replace(/[^\d\.]/g, "");
      this.tableData[index].count = this.checkNum(num, 9, 6);
      if (num == "") {
        if (this.taxMethodVal == 2) {
          this.tableData[index].price = "";
          this.tableData[index].priceView = "";
        } else {
          this.tableData[index].amount = "";
          this.tableData[index].amountView = this.tableData[index].amount;
          this.computerTaxs(index);
        }
        return;
      }

      let counts = parseFloat(this.tableData[index].count);
      let prices = parseFloat(this.tableData[index].price);
      let amounts = parseFloat(this.tableData[index].amount);
      if (this.invoiceCategory == 1) {
        counts = parseFloat(this.tableData[index].count)
          ? "-" + Math.abs(parseFloat(this.tableData[index].count))
          : "";
        prices = parseFloat(this.tableData[index].price)
          ? Math.abs(parseFloat(this.tableData[index].price))
          : "";
        amounts = parseFloat(this.tableData[index].amount)
          ? "-" + Math.abs(parseFloat(this.tableData[index].amount))
          : "";
      }
      if (counts && prices && amounts) {
        if (this.taxMethodVal == 2) {
          let resPrice = amounts / counts;
          this.tableData[index].price = resPrice;
          this.tableData[index].priceView = this.toNonExponential(
            parseFloat(resPrice.toFixed(8))
          );
          return;
        }
        this.computerAmounts(index, counts, prices);
        this.computerTaxs(index);
      } else {
        if (counts && prices) {
          // 数量、单价
          let resAmount = counts * prices;
          this.tableData[index].amount = resAmount;
          this.tableData[index].amountView = parseFloat(resAmount.toFixed(2));
          this.computerTaxs(index);
          this.tableData[index].isBlur = true;
        } else if (counts && amounts) {
          // 数量、金额
          let resPrice = amounts / counts;
          this.tableData[index].price = resPrice;
          this.tableData[index].priceView = this.toNonExponential(
            parseFloat(resPrice.toFixed(8))
          );
          if (this.invoiceCategory != 1) this.computerTaxs(index);
        } else if (!counts) {
          if (this.taxMethodVal == 2) {
            this.tableData[index].price = "";
            this.tableData[index].priceView = this.tableData[index].price;
            // this.computerTaxs(index)
          } else {
            this.tableData[index].amount = "";
            this.tableData[index].amountView = this.tableData[index].amount;
            this.computerTaxs(index);
          }
        }
      }
      // this.computerTaxs(index)
    },
    watchPrice(item, index) {
      //格式校验
      let num = this.tableData[index].priceView.replace(/[^\d\.]/g, "");
      this.tableData[index].priceView = this.checkNum(num, 9, 8);

      this.tableData[index].price = this.tableData[index].priceView;
      this.tableData[index].amount = this.tableData[index].amountView;
      if (num == "") {
        this.tableData[index].amount = "";
        this.tableData[index].amountView = this.tableData[index].amount;
        this.computerTaxs(index);
        return;
      }

      let counts = parseFloat(this.tableData[index].count);
      let prices = parseFloat(this.tableData[index].price);
      let amounts = parseFloat(this.tableData[index].amount);
      if (this.invoiceCategory == 1) {
        counts = parseFloat(this.tableData[index].count)
          ? "-" + Math.abs(parseFloat(this.tableData[index].count))
          : "";
        prices = parseFloat(this.tableData[index].price)
          ? Math.abs(parseFloat(this.tableData[index].price))
          : "";
        amounts = parseFloat(this.tableData[index].amount)
          ? "-" + Math.abs(parseFloat(this.tableData[index].amount))
          : "";
      }
      if (counts && prices && amounts) {
        this.computerAmounts(index, counts, prices);
        this.computerTaxs(index);
      } else {
        if (prices && counts) {
          // 单价、数量
          let resAmount = counts * prices;
          this.tableData[index].amount = resAmount;
          this.tableData[index].amountView = parseFloat(resAmount.toFixed(2));
          this.computerTaxs(index);
          this.tableData[index].isBlur = true;
        } else if (prices && amounts) {
          // 单价、金额(数量不存在)
          this.tableData[index].amount = "";
          this.tableData[index].amountView = this.tableData[index].amount;
          this.computerTaxs(index);
        } else if (!prices) {
          this.tableData[index].amount = "";
          this.tableData[index].amountView = this.tableData[index].amount;
          this.computerTaxs(index);
        }
      }
      // this.computerTaxs(index)
    },
    watchAmount(item, index) {
      //格式校验
      let num = this.tableData[index].amountView.replace(/[^\d\.]/g, "");
      this.tableData[index].amountView = this.checkNum(num, 9, 2);

      this.tableData[index].price = this.tableData[index].priceView;
      this.tableData[index].amount = this.tableData[index].amountView;
      if (num == "") {
        this.computerTaxs(index);
        this.taxToNegative(index);
        return;
      }

      let counts = parseFloat(this.tableData[index].count);
      let prices = parseFloat(this.tableData[index].price);
      let amounts = parseFloat(this.tableData[index].amount);
      if (this.invoiceCategory == 1) {
        counts = parseFloat(this.tableData[index].count)
          ? "-" + Math.abs(parseFloat(this.tableData[index].count))
          : "";
        prices = parseFloat(this.tableData[index].price)
          ? Math.abs(parseFloat(this.tableData[index].price))
          : "";
        amounts = parseFloat(this.tableData[index].amount)
          ? "-" + Math.abs(parseFloat(this.tableData[index].amount))
          : "";
      }
      if (counts && prices && amounts) {
        let resPrice = amounts / counts;
        this.tableData[index].price = resPrice;
        this.tableData[index].priceView = this.toNonExponential(
          parseFloat(resPrice.toFixed(8))
        );
        // if (this.tableData[index].isBlur) {
        //     //已失焦，算price
        //     let resPrice = amounts / counts
        //     this.tableData[index].price = resPrice
        //     this.tableData[index].priceView = parseFloat(resPrice.toFixed(8))
        // }else {
        //     //默认未失焦，算count
        //     let resCount = amounts / prices
        //     this.tableData[index].count = parseFloat(resCount.toFixed(6))
        // }
      } else {
        if (amounts && counts) {
          // 金额、数量
          let resPrice = amounts / counts;
          this.tableData[index].price = resPrice;
          this.tableData[index].priceView = this.toNonExponential(
            parseFloat(resPrice.toFixed(8))
          );
          this.tableData[index].isBlur = true;
        } else if (amounts && prices) {
          // 金额、单价(数量不存在)
          // let resCount = amounts / prices
          // this.tableData[index].count = parseFloat(resCount.toFixed(6))
          this.tableData[index].price = "";
          this.tableData[index].priceView = "";
        } else if (!amounts) {
          this.tableData[index].count = "";
        }
      }
      this.computerTaxs(index);
      this.taxToNegative(index);
    },
    // 金额栏-失焦事件
    blurAmount(item, index) {
      if (this.tableData[index].count) {
        this.tableData[index].isBlur = true;
      }
      if (this.invoiceCategory == 1) {
        let str = item.amountView + "";
        let num = str.replace(/[^\d\.]/g, "");
        this.tableData[index].amount = num ? "-" + Math.abs(num) : "";
        this.tableData[index].amountView = num ? "-" + Math.abs(num) : "";
      }
    },
    // 数量栏-失焦事件-负票变负数
    blurCount(item, index) {
      if (this.invoiceCategory == 1) {
        let str = item.count + "";
        let num = str.replace(/[^\d\.]/g, "");
        this.tableData[index].count = num ? "-" + Math.abs(num) : "";
      }
    },
    foucsCount(item, index) {
      if (this.invoiceCategory == 1) {
        this.tableData[index].count = item.count ? Math.abs(item.count) : "";
      }
    },
    // 税额变负数（负票）
    taxToNegative(index) {
      let item = this.tableData[index];
      if (this.invoiceCategory == 1) {
        this.tableData[index].taxC = item.taxC ? "-" + Math.abs(item.taxC) : "";
        this.tableData[index].tax = item.tax ? "-" + Math.abs(item.tax) : "";
      }
    },

    // 计算金额方法
    computerAmounts(index, counts, prices) {
      let amounts = counts * prices;
      this.tableData[index].amount = amounts;
      this.tableData[index].amountView = parseFloat(amounts.toFixed(2));
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
    // 监听税率--计算税额方法
    computerTaxs(index) {
      let taxs = "";
      // 折扣行税率框同步互联
      if (this.tableData[index].isDiscount) {
        let taxRates = parseFloat(this.tableData[index].taxRate);
        if (this.tableData[index].isDiscountLine) {
          //商品-折扣行
          if (this.tableData[index - 1].isDiscount) {
            this.tableData[index - 1].taxRate = taxRates;
            let amounts = parseFloat(this.tableData[index - 1].amount);
            if (this.isTaxIncluded) {
              // 含税
              taxs = (amounts * taxRates) / (taxRates + 1);
              this.tableData[index - 1].taxC = taxs;
              this.tableData[index - 1].tax = taxs.toFixed(2);
            } else {
              // 不含税
              taxs = amounts * taxRates;
              this.tableData[index - 1].taxC = taxs;
              this.tableData[index - 1].tax = taxs.toFixed(2);
            }
          }
        } else {
          //商品-被折扣行
          if (
            this.tableData[index + 1].isDiscount &&
            this.tableData[index + 1].isDiscountLine
          ) {
            this.tableData[index + 1].taxRate = taxRates;
            let amounts = parseFloat(this.tableData[index + 1].amount);
            if (this.isTaxIncluded) {
              // 含税
              taxs = (amounts * taxRates) / (taxRates + 1);
              this.tableData[index + 1].taxC = taxs;
              this.tableData[index + 1].tax = taxs.toFixed(2);
            } else {
              // 不含税
              taxs = amounts * taxRates;
              this.tableData[index + 1].taxC = taxs;
              this.tableData[index + 1].tax = taxs.toFixed(2);
            }
          }
        }
      }

      // 差额征收
      if (this.taxMethodVal == 2) {
        let el = this.tableData[index];
        let taxRateStr = el.taxRate + "";
        if (!taxRateStr || !el.amountView) return;
        let taxRate = parseFloat(el.taxRate);
        let deduction = this.differentialTaxationAmount
          ? parseFloat(this.differentialTaxationAmount)
          : 0;

        if (this.isTaxIncluded) {
          // 含税
          let sales = parseFloat(this.sales);
          let res = ((sales - deduction) * taxRate) / (taxRate + 1);
          this.tableData[index].taxC = res;
          this.tableData[index].tax = res.toFixed(2);
        } else {
          // 不含税
          // let amounts = parseFloat(el.amount)
          // let sales = (amounts-deduction) * (taxRate + 1 ) + deduction
          // let res = (sales-deduction) * taxRate / (taxRate + 1 )
          // this.tableData[index].taxC = res
          // this.tableData[index].tax = res.toFixed(2)

          let sales = parseFloat(this.sales);
          let salesNo = (sales - deduction) / (taxRate + 1) + deduction;
          this.tableData[0].amount = sales ? salesNo : "";
          this.tableData[0].amountView = sales
            ? parseFloat(salesNo.toFixed(2))
            : "";
          if (el.count && sales) {
            this.tableData[0].price = salesNo / el.count;
            this.tableData[0].priceView = this.toNonExponential(
              parseFloat(this.tableData[0].price.toFixed(8))
            );
          }
          let res = ((sales - deduction) * taxRate) / (taxRate + 1);
          this.tableData[index].taxC = res;
          this.tableData[index].tax = res.toFixed(2);
        }
      } else if (this.taxMethodVal == 1) {
        // 减按征收
        let el = this.tableData[index];
        let taxRateStr = el.taxRate + "";
        if (!taxRateStr || !el.amountView) return;
        let taxRates = parseFloat(el.taxRate);
        let amounts = parseFloat(el.amount);

        if (this.isTaxIncluded) {
          // 含税
          taxs = (amounts * taxRates) / (0.05 + 1);
          this.tableData[index].taxC = taxs;
          this.tableData[index].tax = taxs.toFixed(2);
        } else {
          // 不含税
          taxs = amounts * taxRates;
          this.tableData[index].taxC = taxs;
          this.tableData[index].tax = taxs.toFixed(2);
        }
      } else {
        let taxRateStr = this.tableData[index].taxRate + "";
        if (taxRateStr && this.tableData[index].amount) {
          let taxRates = parseFloat(this.tableData[index].taxRate);
          let amounts = parseFloat(this.tableData[index].amount);
          if (this.tableData[index].amount != amounts) return;

          if (this.isTaxIncluded) {
            // 含税
            taxs = (amounts * taxRates) / (taxRates + 1);
            this.tableData[index].taxC = taxs;
            this.tableData[index].tax = taxs.toFixed(2);
            console.log("含税");
          } else {
            // 不含税
            taxs = amounts * taxRates;
            this.tableData[index].taxC = taxs;
            this.tableData[index].tax = taxs.toFixed(2);
            console.log("不含税");
          }
        } else {
          this.tableData[index].taxC = "";
          this.tableData[index].tax = "";
        }
      }

      this.computerTotalPrice();
    },

    // 商品价格合计
    computerTotalPrice() {
      let arr = this.tableData;
      let totalAmount = 0;
      let totalTax = 0;

      for (let i = 0; i < arr.length; i++) {
        const el = arr[i];
        let taxStr = el.tax + "";
        if (el.amount && taxStr) {
          let taxs =
            this.invoiceCategory == 1
              ? 0 - Math.abs(el.tax)
              : parseFloat(el.tax);
          totalTax = taxs + parseFloat(totalTax);
        } else if (el.amount && !taxStr) {
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
      if (this.taxMethodVal == 2) {
        let el = this.tableData[0];
        let taxRateStr = el.taxRate + "";
        if (!taxRateStr) return;
        if (!el.amountView) return;
        let taxRate = parseFloat(el.taxRate);
        let deduction = this.differentialTaxationAmount
          ? parseFloat(this.differentialTaxationAmount)
          : 0;
        deduction =
          this.invoiceCategory == 1 ? 0 - Math.abs(deduction) : deduction;
        if (this.isTaxIncluded) {
          // 含税
          let sales =
            this.invoiceCategory == 1
              ? 0 - Math.abs(el.amountView)
              : parseFloat(el.amountView);
          let res = (sales - deduction) / (taxRate + 1) + deduction;
          totalAmount = res;
        } else {
          // 不含税
          totalAmount =
            this.invoiceCategory == 1
              ? 0 - Math.abs(el.amountView)
              : parseFloat(el.amountView);
        }
      } else if (this.taxMethodVal == 1) {
        // if (this.isTaxIncluded) {
        // 含税
        for (let i = 0; i < arr.length; i++) {
          const el = arr[i];
          let taxRateStr = el.taxRate + "";
          if (el.amount && taxRateStr) {
            let amounts =
              this.invoiceCategory == 1
                ? 0 - Math.abs(el.amountView)
                : parseFloat(el.amountView);
            let resAmount = amounts.toFixed(2);
            totalAmount = parseFloat(resAmount) + parseFloat(totalAmount);
          } else if (el.amountView && !el.tax) {
            this.totalPrice.totalTaxC = "";
            this.totalPrice.totalTax = "";
            this.totalPrice.totalAmountC = "";
            this.totalPrice.totalAmount = "";
            return;
          }
        }
        // }else {
        //     // 不含税
        //     for (let i = 0; i < arr.length; i++) {
        //         const el = arr[i];
        //         if (el.amountView) {
        //             let amounts = this.invoiceCategory == 1 ? 0-Math.abs(el.amountView):parseFloat(el.amountView)
        //             let resAmount = amounts + parseFloat(totalAmount)
        //             console.log(el,el.amountView,resAmount)
        //             totalAmount = parseFloat(resAmount)
        //         }
        //     }
        // }
      } else {
        if (this.isTaxIncluded) {
          // 含税
          for (let i = 0; i < arr.length; i++) {
            const el = arr[i];
            let taxRateStr = el.taxRate + "";
            if (el.amount && taxRateStr) {
              let amounts =
                this.invoiceCategory == 1
                  ? 0 - Math.abs(el.amountView)
                  : parseFloat(el.amountView);
              let taxRates = parseFloat(el.taxRate);
              let resAmount = (amounts / (taxRates + 1)).toFixed(2);
              console.log(el, amounts, taxRates, resAmount);
              totalAmount = parseFloat(resAmount) + parseFloat(totalAmount);
            } else if (el.amountView && !el.tax) {
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
            if (el.amountView) {
              let amounts =
                this.invoiceCategory == 1
                  ? 0 - Math.abs(el.amountView)
                  : parseFloat(el.amountView);
              let resAmount = amounts + parseFloat(totalAmount);
              console.log(el, el.amountView, resAmount);
              totalAmount = parseFloat(resAmount);
            }
          }
        }
      }
      // 不含税金额合计
      if (totalAmount == 0) {
        this.totalPrice.totalAmountC = "";
        this.totalPrice.totalAmount = "";
      } else {
        if (this.taxMethodVal == 1) {
          let resTotalJA = parseFloat(totalAmount) - parseFloat(totalTax);
          this.totalPrice.totalAmountC = parseFloat(resTotalJA);
          this.totalPrice.totalAmount = parseFloat(resTotalJA).toFixed(2);
        } else {
          this.totalPrice.totalAmountC = parseFloat(totalAmount);
          this.totalPrice.totalAmount = parseFloat(totalAmount).toFixed(2);
          // this.totalPrice.totalAmount = this.routeList.type == "fapiaochaxun-fushu" ? '-'+parseFloat(totalAmount).toFixed(2):parseFloat(totalAmount).toFixed(2)
        }
      }

      // 价税合计（大小写）
      if (this.taxMethodVal == 1) {
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

      if (this.totalPrice.priceTaxSmall && this.totalPrice.priceTaxSmall < 0) {
        this.totalPrice.priceTaxBig =
          "(负数)" + convertCurrency(Math.abs(this.totalPrice.priceTaxSmall));
      } else {
        this.totalPrice.priceTaxBig = convertCurrency(
          Math.abs(this.totalPrice.priceTaxSmall)
        );
      }

      console.log(
        this.totalPrice.totalAmount,
        this.totalPrice.totalTax,
        this.totalPrice.priceTaxSmall
      );
    },

    // 备注框信息
    watchRemarks() {
      let obj = validStrCheckLengthTextarea(this.sellerForm.remarks, 360);
      if (!obj.flag) {
        if (obj.len) {
          this.sellerForm.remarks = this.sellerForm.remarks.substring(
            0,
            obj.len
          );
        }
      }
    },

    // 购买方信息
    watchPurchaser(val) {
      if (val == "客户名称") {
        let obj = validStrCheckLengthTextarea(this.purchaserForm.name, 100);
        if (!obj.flag) {
          if (obj.len) {
            this.purchaserForm.name = this.purchaserForm.name.substring(
              0,
              obj.len
            );
          }
        }
      } else if (val == "地址电话") {
        let obj = validStrCheckLengthTextarea(
          this.purchaserForm.addressOrTel,
          100
        );
        if (!obj.flag) {
          if (obj.len) {
            this.purchaserForm.addressOrTel =
              this.purchaserForm.addressOrTel.substring(0, obj.len);
          }
        }
      } else if (val == "开户行及账号") {
        let obj = validStrCheckLengthTextarea(this.purchaserForm.account, 100);
        if (!obj.flag) {
          if (obj.len) {
            this.purchaserForm.account = this.purchaserForm.account.substring(
              0,
              obj.len
            );
          }
        }
      }
    },

    // 表尾输入验证
    tableTail(val) {
      if (val == "收款人") {
        let obj = validStrCheckLengthTextarea(this.payee, 10);
        console.log(obj);
        if (!obj.flag) {
          if (obj.len) {
            this.payee = this.payee.substring(0, obj.len);
          }
        }
      } else if (val == "复核人") {
        let obj = validStrCheckLengthTextarea(this.issuer, 10);
        if (!obj.flag) {
          if (obj.len) {
            this.issuer = this.issuer.substring(0, obj.len);
          }
        }
      } else if (val == "开票人") {
        let obj = validStrCheckLengthTextarea(this.reviewer, 10);
        if (!obj.flag) {
          if (obj.len) {
            this.reviewer = this.reviewer.substring(0, obj.len);
          }
        }
      }
    },

    // 商品表单数据校验
    watchModel(item, index) {
      let obj = validStrCheckLengthTextarea(this.tableData[index].model, 40);
      console.log("model", this.tableData[index].model.length, obj);
      if (!obj.flag) {
        if (obj.len) {
          this.tableData[index].model = this.tableData[index].model.substring(
            0,
            obj.len
          );
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

    // 校验数字长度-- str待校验数据 / len1整数最大长度 / len2小数长度
    checkNum(data, len1, len2) {
      let str = data + "";
      if (str.indexOf("-") > -1 && str.length > 2) {
        if (this.invoiceCategory == 1) {
          str = parseFloat(str) + "";
        } else {
          str = Math.abs(parseFloat(str)) + "";
        }
      }
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

    box(val) {
      console.log(val);
      console.log(this.tableData);
      let tableData = this.tableData;
      // tableData.forEach(item => {

      // })
      // let str = JSON.stringify(this.tableData_el);
      let a = 0;
      tableData.forEach((item, index, arr) => {
        if (index == 0 && item.lineNature == 1) {
          let str = JSON.stringify(this.tableData_el);
          tableData.splice(index, 0, JSON.parse(str));
          a++;
        } else if (item.lineNature == 1 && arr[index - 1].lineNature != 2) {
          let str = JSON.stringify(this.tableData_el);
          tableData.splice(index + a, 0, JSON.parse(str));
          a++;
        }
      });
      this.tableData = tableData;
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
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #252525;
  cursor: pointer;
  /* line-height: 22px; */
}
.nav-left >>> .el-select {
  width: 33%;
}
.invoice-type {
  margin: 0 10px 0 15px;
}
.nav-right {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.nav-right > div {
  margin-right: 5px;
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
.nav-right > div > div {
  min-width: 42px;
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
.content-nav i {
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
  height: 161px;
  border: 1px solid #e8e8e8;
  display: flex;
}
.purchaser {
  width: 53px;
  min-width: 53px;
  height: 100%;
  font-size: 20px;
  padding: 45px 0 0 15px;
  border-right: 1px solid #e8e8e8;
}
.purchaser-info {
  min-width: 400px;
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
  width: 110px !important;
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

.recipient-info {
  width: 549px;
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
  width: 0;
}
.recipient-info > div >>> .el-input__inner {
  height: 37px;
  line-height: 37px;
  border: none;
  padding-left: 8px;
}
.recipient-info .password-area {
  height: 80px;
}
.recipient-info .password-area > span {
  padding: 18px 0 0 11px;
}
.recipient-info .password-area > div {
  height: 80px;
  flex-grow: 1;
  overflow: auto;
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
#LightningInvoicing >>> .el-dialog__header {
  border-bottom: 1px solid #ddd;
}
#invoicePre >>> .el-dialog__header {
  border-bottom: none;
}

/* 开票码组件 */
#billingCode >>> .el-dialog__header {
  /* background-color: #5e8cf9;
    padding: 12px 20px 10px; */
  border: none;
  display: none;
}
#billingCode >>> .el-dialog__body {
  padding: 0;
  /* background-color: #5e8cf9; */
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

@media screen and (max-width: 1184px) {
  .customLenovo {
    position: absolute;
    left: 110px;
    /* top: 0; */
    z-index: 111;
    width: 550px;
    max-height: 282px;
    border: 1px solid #808080;
  }
}
@media screen and (min-width: 1185px) {
  .customLenovo {
    position: absolute;
    left: 133px;
    /* top: 0; */
    z-index: 111;
    width: 550px;
    max-height: 282px;
    border: 1px solid #808080;
  }
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
