<template>
  <div class="reviewInvoicing">
    <div class="borderBottom">
      <breadnav :textTitle="title" @leftEvent="clickLeft" />
    </div>
    <div class="reviewContent clearfix">
      <!--//左边列表 +搜索-->
      <div class="contentLeft">
        <el-form
          ref="searchOne"
          :rules="searchOneRules"
          :model="searchFormOne"
          class="pr24"
        >
          <el-form-item prop="searchText">
            <el-input
              placeholder="请输入内容"
              v-model.trim="searchFormOne.searchText"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="searchFun"
              ></el-button>
            </el-input>
          </el-form-item>
        </el-form>
        <div class="secondForm pr24">
          <el-form ref="searchTwo" :model="searchFormTwo" label-width="76px">
            <el-form-item label="申请状态:">
              <el-select
                v-model="searchFormTwo.status"
                placeholder="请选择申请状态"
                @change="statusChangeFun"
              >
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="(item, key) in statusList"
                  :key="key"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申请时间" class="applyTime">
              <i
                :class="{
                  'el-icon-caret-top': true,
                  timeTop: true,
                  activeIcon: searchFormTwo.timeDescFlag == 'false',
                }"
                @click="tiemSearchFun('false')"
              ></i>
              <i
                :class="{
                  'el-icon-caret-bottom': true,
                  timeBottom: true,
                  activeIcon: searchFormTwo.timeDescFlag == 'true',
                }"
                @click="tiemSearchFun('true')"
              ></i>
            </el-form-item>
          </el-form>
        </div>
        <div class="listBox">
          <el-scrollbar style="height: 100%">
            <ul
              class="ulBox"
              v-if="invoiceList !== undefined && invoiceList.length > 0"
            >
              <li
                :class="{
                  listItme: true,
                  listTtmeAxtive: listActiveFlag == key,
                }"
                v-for="(item, key) in invoiceList"
                :key="key"
                @click="listHandelDetail(item, key)"
              >
                <div class="itemLeft">
                  <div class="textTop">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.buyerName"
                      placement="top-start"
                    >
                      <span class="twoLine">{{ item.buyerName }}</span>
                    </el-tooltip>
                  </div>
                  <div class="textBottom whiteSpace flex">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.mainProductName"
                      placement="top-start"
                    >
                      <div
                        v-html="ToBreak(item.mainProductName)"
                        slot="content"
                      ></div>
                      <div class="oneLine">{{ item.mainProductName }}</div>
                    </el-tooltip>
                    <div class="mal21">￥{{ item.totalPriceWithTax }}</div>
                  </div>
                </div>
                <div class="itemRightTwo textBottom">
                  <div class="textBottom whiteSpace">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.applicantName"
                      placement="top-end"
                    >
                      <div class="textRight">{{ item.applicantName }}</div>
                    </el-tooltip>
                  </div>
                  <!-- <div class="textTop">{{ item.applicantName }}</div> -->
                  <div class="textBottom">
                    <span>{{ item.createTime }}</span>
                  </div>
                </div>
              </li>
            </ul>
            <listnodate :tableFlag="noDateFlag" v-else />
          </el-scrollbar>
        </div>
        <div class="paginBox">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            background
            :page-size="10"
            :pager-count="5"
            layout="total, prev, pager, next"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>

      <div class="contentRight">
        <!--右边导航-->
        <div class="rightHeader">
          <span class="applyDetai">申请详情</span>
          <!--0-待审核，1-待开票，2-已开票，3-已驳回，4-已撤销-->
          <span
            :class="[
              detailData.status == '3'
                ? 'red'
                : detailData.status == '2'
                ? 'green'
                : 'blue',
            ]"
            >{{ detailData.status | statusType }}</span
          >
          <div class="rightNavBox">
            <div class="rightNav" @click="goToPage('0')">
              <img
                src="../../assets/images/erweima.png"
                alt="图片"
                class="navImg"
              />
              <span class="navTex">开票码</span>
            </div>
            <div
              class="rightNav"
              @click="goToPage('1')"
              v-if="detailData.status == '0'"
            >
              <img
                src="../../assets/images/date.png"
                alt="图片"
                class="navImg"
              />
              <span class="navTex">加入待开</span>
            </div>
            <div
              class="rightNav"
              v-if="detailData.status == '1'"
              @click="goToPage('2')"
            >
              <img
                src="../../assets/images/date.png"
                alt="图片"
                class="navImg"
              />
              <span class="navTex">查看待开</span>
            </div>
            <div class="rightNav" @click="goToPage('3')">
              <img
                src="../../assets/images/print.png"
                alt="图片"
                class="navImg"
              />
              <span class="navTex">打印</span>
            </div>
            <div class="rightNav" @click="goToPage('4')">
              <img
                src="../../assets/images/beishang.png"
                alt="图片"
                class="navImg"
              />
              <span class="navTex">黑名单</span>
            </div>
            <el-button
              type="primary"
              @click="goToPage('5')"
              v-if="detailData.status == '0'"
              >开票</el-button
            >
            <el-button
              type="primary"
              @click="goToPage('6')"
              v-if="detailData.status == '2'"
              >查看发票</el-button
            >
            <el-button
              type="danger"
              @click="goToPage('7')"
              v-if="detailData.status == '0'"
              >驳回</el-button
            >
          </div>
        </div>
        <!--右边详情-->
        <div class="rightBody clearfix">
          <div class="rightleftBody">
            <ul class="bodyUL">
              <li class="applyPerson">申请人</li>
              <li class="mab16">
                <span class="bodyTitle">姓名:</span>
                <span class="bodyContent">{{
                  detailData.applicantName || "-"
                }}</span>
                <el-button type="primary" size="mini" @click="insertAjax"
                  >拉黑</el-button
                >
              </li>
              <li>
                <span class="bodyTitle">手机号:</span>
                <span class="bodyContent">{{
                  detailData.applicantPhone || "-"
                }}</span>
              </li>
            </ul>
            <ul class="bodyUL">
              <li class="applyPerson">购方信息</li>
              <li class="mab16">
                <span class="bodyTitle">开票类型:</span>
                <span class="bodyContent">{{
                  detailData.invoiceType | invoiceTypeFilter
                }}</span>
              </li>
              <li class="mab16">
                <span class="bodyTitle">购方名称:</span>
                <span class="bodyContent">{{
                  detailData.buyerName || "-"
                }}</span>
              </li>
              <li class="mab16">
                <span class="bodyTitle">企业税号:</span>
                <span class="bodyContent">{{
                  detailData.buyerTaxId || "-"
                }}</span>
              </li>
              <li class="mab16">
                <span class="bodyTitle">地址电话:</span>
                <span class="bodyContent">{{
                  detailData.buyerAddrTel || "-"
                }}</span>
              </li>
              <li class="mab16">
                <span class="bodyTitle">开户行及账号:</span>
                <span class="bodyContent">{{
                  detailData.buyerBankAccount || "-"
                }}</span>
              </li>
              <li
                class="mab16"
                v-if="
                  detailData.invoiceType == '026' ||
                  detailData.invoiceType == '028'
                "
              >
                <span class="bodyTitle">收票人手机号:</span>
                <span class="bodyContent">{{ detailData.phone || "-" }}</span>
              </li>
              <li
                class="mab16"
                v-if="
                  detailData.invoiceType == '026' ||
                  detailData.invoiceType == '028'
                "
              >
                <span class="bodyTitle">收票人邮箱:</span>
                <span class="bodyContent">{{ detailData.email || "-" }}</span>
              </li>
            </ul>
            <ul class="bodyUL">
              <li class="applyPerson">商品信息</li>
              <li class="goodsBox goodsScrollOther">
                <div class="goodsScrollInner">
                  <el-scrollbar style="height: 100%">
                    <div
                      v-if="
                        detailData.goodsList !== undefined &&
                        detailData.goodsList.length > 0
                      "
                    >
                      <ul
                        class="goodsItem"
                        v-for="(item, key) in detailData.goodsList"
                        :key="key"
                      >
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="item.goodsName"
                          placement="top-end"
                        >
                          <li class="mab4 whiteSpace">
                            <span class="bodyTitle">商品名称:</span>
                            <span class="bodyContent">{{
                              item.goodsName
                            }}</span>
                          </li>
                        </el-tooltip>
                        <li class="mab4">
                          <span class="bodyTitle">商品数量:</span>
                          <span class="bodyContent">{{
                            item.goodsNumber !== null
                              ? item.goodsNumber.toFixed(2)
                              : ""
                          }}</span>
                        </li>
                        <li class="mab4">
                          <span class="bodyTitle">商品金额:</span>
                          <span class="bodyContent">{{
                            item.goodsAmount !== null
                              ? item.goodsAmount.toFixed(2)
                              : ""
                          }}</span>
                        </li>
                      </ul>
                    </div>
                    <listnodate :tableFlag="noGoodsFlag" v-else />
                  </el-scrollbar>
                </div>
              </li>
            </ul>
          </div>
          <div class="rightrightBody">
            <div>
              <div class="applyPerson">审批凭证文件</div>

              <div
                class="demo-image__preview"
                v-if="
                  detailData.attachmentList !== undefined &&
                  detailData.attachmentList.length >= 1
                "
              >
                <el-image
                  style="width: 104px; height: 104px; borderradius: 2px"
                  :src="item"
                  v-for="(item, index) in detailData.attachmentList"
                  :preview-src-list="detailData.attachmentList"
                  :key="index"
                >
                </el-image>
              </div>
              <div v-else>-</div>
            </div>
            <div class="bodyUL">
              <div class="applyPerson">备注信息</div>
              <div class="bodyContent">{{ detailData.remark || "-" }}</div>
            </div>
            <div class="bodyUL" v-if="detailData.status == '3'">
              <div class="applyPerson">驳回原因</div>
              <div class="bodyContent">{{ detailData.rebutCause || "-" }}</div>
            </div>
            <div
              class="bodyUL"
              v-if="
                detailData.status == '2' &&
                detailData.invoiceType != '026' &&
                detailData.invoiceType != '028'
              "
            >
              <div class="applyPerson">物流信息</div>
              <div class="expressBox expressFlexBox">
                <div class="expressFlex">
                  <div style="min-width:70px" 
                    ><span class="expressText">快递公司：</span></div
                  >
                  <div
                    ><span class="expressText">{{
                      this.express.expressCompany
                    }}</span></div
                  >
                </div>
                <div style="margintop: 10px" class="expressFlex">
                  <div style="min-width:70px" 
                    ><span class="expressText">快递单号：</span></div
                  >
                  <div
                    ><span class="expressText">{{
                      this.express.expressSeries
                    }}</span></div
                  >
                </div>
                <div>
                  <div class="fixBox" @click="showExpressDialog">修改</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改物流弹窗 -->
    <el-dialog
      title="修改物流信息"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="expressDialogFlag"
    >
      <div class="expressBox">
        <el-form ref="expressForm" :model="updateExpress" label-width="12%" :rules="rule">
          <el-form-item label="快递公司：" prop="expressCompany" label-width="120px">
            <el-input v-model="updateExpress.expressCompany"></el-input>
          </el-form-item>
          <el-form-item label="快递单号：" prop="expressSeries" label-width="120px">
            <el-input v-model="updateExpress.expressSeries"></el-input>
          </el-form-item> 
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="cancelExpress">取 消</el-button>
        <el-button type="primary" @click="expressFun">确 定</el-button>
      </div>
    </el-dialog>

    <!--打印弹窗-->
    <!-- <el-dialog title="开票申请" :visible.sync="pintDialogFlag" center class="pint" width='100%'>
        <div ref="pintContent">
          <div class="pintHeader">
            <span class="pintStatus">申请状态</span>
            <span class="blue">{{detailData.status|statusType}}</span>
          </div>
          <div class="printBody">
            <ul class="bodyUL">
              <li class="applyPerson">申请人</li>
              <li class="mab16">
                <span class="bodyTitle">姓名:</span>
                <span class="bodyContent">{{detailData.applicantName||'-'}}</span>
              </li>
              <li>
                <span class="bodyTitle">手机号:</span>
                <span class="bodyContent">{{detailData.applicantPhone||'-'}}</span>
              </li>
            </ul>
            <ul class="bodyUL">
              <li class="applyPerson">购方信息</li>
              <li class="mab16">
                <span class="bodyTitle">开票类型:</span>
                <span class="bodyContent">{{detailData.invoiceType|invoiceTypeFilter}}</span>
              </li>
              <li class="mab16">
                <span class="bodyTitle">购方名称:</span>
                <span class="bodyContent">{{detailData.buyerName||'-'}}</span>
              </li>
              <li class="mab16">
                <span class="bodyTitle">企业税号:</span>
                <span class="bodyContent">{{detailData.buyerTaxId||'-'}}</span>
              </li>
              <li class="mab16">
                <span class="bodyTitle">地址电话:</span>
                <span class="bodyContent">{{detailData.buyerAddrTel||'-'}}</span>
              </li>
              <li class="mab16">
                <span class="bodyTitle">开户行及账号:</span>
                <span class="bodyContent">{{detailData.buyerBankAccount||'-'}}</span>
              </li>
            </ul>
            <ul class="bodyUL">
              <li class="applyPerson">商品信息</li>
              <li class="goodsBox" >
                <ul class="goodsItem" v-for="(item,key) in detailData.goodsList" :key="key">
                  <el-tooltip class="item" effect="dark" :content="item.goodsName" placement="top-end">
                    <li class="mab4 whiteSpace">
                      <span class="bodyTitle">商品名称:</span>
                      <span class="bodyContent">{{item.goodsName}}</span>
                    </li>
                  </el-tooltip>
                  <li class="mab4">
                    <span class="bodyTitle">商品数量:</span>
                    <span class="bodyContent">{{item.goodsNumber}}</span>
                  </li>
                  <li class="mab4">
                    <span class="bodyTitle">商品金额:</span>
                    <span class="bodyContent">{{item.goodsAmount}}</span>
                  </li>
                </ul>

              </li>
            </ul>
            <div class="bodyUL">
              <div class="applyPerson">审批及凭证文件</div>
              <ul class="pintImgBox clearfix" v-if="(detailData.attachmentList)!==undefined && (detailData.attachmentList).length>0">
                <li class="pintimgItem" v-for="(imgitem,key) in detailData.attachmentList " :key="key">
                  <img :src="imgitem" alt="" class="pintImgDetail">
                </li>
              </ul>
              <div v-else>无</div>

            </div>
            <div class="bodyUL">
              <div class="applyPerson">备注信息</div>
              <div class="bodyContent">{{detailData.remark||'-'}}</div>
            </div>

          </div>
        </div>
        <div slot="footer" class="password-footer">
          <el-button @click="pintDialogFlag = false">取 消</el-button>
          <el-button type="primary" @click="printFun">确 定</el-button>
        </div>
      </el-dialog> -->

    <el-dialog
      title="请输入驳回原因"
      :visible.sync="rejectDialogFlag"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="rejectCancelFun"
    >
      <el-form ref="rejectForm" :rules="rejectFormRules" :model="rejectForm">
        <el-form-item label="" prop="reason">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入驳回原因"
            v-model="rejectForm.reason"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rejectCancelFun" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="rejectConfimFun"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 开票码组件 -->
    <div v-if="billingCodeVisible">
      <el-dialog
        id="billingCode"
        width="380px"
        :visible.sync="billingCodeVisible"
        :close-on-press-escape="false"
        destroy-on-close
      >
        <WxBillingCode
          @closeCircle="billingCodeVisible = false"
        ></WxBillingCode>
      </el-dialog>
    </div>

    <!--发票展示-->
    <!-- <el-dialog :title="invoicePreviewTitle" width="70%" :visible.sync="invoicePreviewVisible" :close-on-click-modal="false" :close-on-press-escape="false" destroy-on-close>
        <InvoicePreview :isElectronic="isElectronicFlag" :taxPic="taxPic"></InvoicePreview>
      </el-dialog> -->
    <InvoicePreview
      :isElectronic="isElectronicFlag"
      :taxDetail="taxDetail"
      :visible.sync="invoicePreviewVisible"
    ></InvoicePreview>

    <PrintSetting :visible.sync="printVisible" :printType="printType">
    </PrintSetting>
  </div>
</template>


<script type="text/ecmascript-6">
import Breadnav from "@/components/Breadnav";
import Listnodate from "@/components/ListNoDate";
import WxBillingCode from "@/views/home/components/WxBillingCode.vue";
import { validStrCheckLength1 } from "@/utils/validate";
import { getBase64 } from "@/utils/function";
import {
  applyListApi,
  applyDetailApi,
  applyaddTodoApi,
  updataStatusApi,
  insertApi,
  updataExpress,
  printApplyInvoice,
} from "@/api/review.js";
import InvoicePreview from "./components/InvoicePreview.vue";
import PrintSetting from "../home/components/PrintSetting";
export default {
  name: "ReviewInvoicing",
  inject: ["change"],
  components: {
    Breadnav,
    WxBillingCode,
    InvoicePreview,
    Listnodate,
    PrintSetting,
  },
  data() {
    const validateExpress = (rule, value, callback) => {
      if (!validStrCheckLength1(value, 51)) {
        console.log("ssss");
        callback(new Error("最多输入50个汉字或字符"));
      } else {
        callback();
      }
    };
    const validateReject = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入驳回原因"));
      } else if (!validStrCheckLength1(value, 201)) {
        console.log("ssss");
        callback(new Error("最多输入200个汉字或字符"));
      } else {
        callback();
      }
    };
    return {
      title: "审核开票",
      //发票展示-s
      invoicePreviewTitle: "发票展示",
      invoicePreviewVisible: false,
      isElectronicFlag: false,
      //发票展示-e
      // pintDialogFlag:false,//打印弹窗
      rejectDialogFlag: false,
      billingCodeVisible: false, //开票码
      listActiveFlag: 0, //list列表被选中的标识
      invoiceList: [{ aa: "" }], //票列表
      noDateFlag: "successNoDate", //是否有列表数据ui组件
      noGoodsFlag: "successNoDate", //是否有商品数据ui组件
      detailData: {}, //详情数据
      express: {
        expressCompany: "顺丰", //快递公司
        expressSeries: "7382174274021809482428", //快递单号
      },
      updateExpress: {
        expressCompany: "", //快递公司
        expressSeries: "", //快递单号
      },

      searchFormOne: {
        searchText: "",
      },
      searchOneRules: {
        searchText: [
          // { required: false, trigger: "blur", validator: validateSearchText },
        ],
      },
      searchFormTwo: {
        status: "null",
        timeDescFlag: "true",
      },
      //驳回原因
      rejectForm: {
        reason: "",
      },
      rejectFormRules: {
        reason: [
          { required: true, message: "请输入驳回原因", trigger: "blur" },
          { required: true, trigger: "blur", validator: validateReject },
        ],
      },
      statusList: [
        // 0-待审核，1-待开票，2-已开票，3-已驳回，4-已撤销
        { label: "全部", value: "null" }, //全部用哪个null
        { label: "待审核", value: "0" },
        { label: "待开票", value: "1" },
        { label: "已开票", value: "2" },
        { label: "已驳回", value: "3" },
        { label: "已撤销", value: "4" },
      ],
      url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      //          srcList: [
      //            'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
      //            'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
      //          ],
      //分页
      currentPage: 0, //当前第几页
      total: 0, //合计多少条
      // 盘号
      taxDiskNum: "",
      expressDialogFlag: false,
      currentId: "",
      taxDetail: {},
      printVisible: false,
      printType: "",
      rule: {
          expressCompany: [{
            required: true,
            message: "请填写快递公司", 
          },{ required: true, trigger: "blur", validator: validateExpress },],
          expressSeries: [{
            required: true,
            message: "请填写快递单号", 
          },{ required: true, trigger: "blur", validator: validateExpress },]
      }
    };
  },
  created() {},
  mounted() {
    this.taxDiskNum = this.$store.state.user.taxDiskInfo.taxDiskNum
      ? this.$store.state.user.taxDiskInfo.taxDiskNum
      : "";
    //关键字 当前页码 是否按创建时间降序(字符串) 筛选状态值
    this.applyListAjax(null, 1, "true", null);
  },
  filters: {
    invoiceTypeFilter(msg) {
      let typeObj = {
        "004": "增值税专用发票",
        "007": "增值税普通发票",
        "025": "卷式发票",
        "026": "电子普通发票",
        "028": "电子专用发票",
        "005": "机动车销售统一发票",
      };
      return typeObj[msg] || "-";
    },
    statusType(type) {
      let statusObj = {
        0: "待审核",
        1: "待开票",
        2: "已开票",
        3: "已驳回",
        4: "已撤销",
      };
      return statusObj[type];
    },
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
        }
      },
      deep: true,
    },
  },
  methods: {
    ToBreak(val) {
      if (val) {
        return val.split("、").join("<br/>");
      }
    },
    invoiceTypeFilter(msg) {
      let typeObj = {
        "004": "增值税专用发票",
        "007": "增值税普通发票",
        "025": "卷式发票",
        "026": "电子普通发票",
        "028": "电子专用发票",
        "005": "机动车销售统一发票",
      };
      return typeObj[msg] || "-";
    },
    //打开物流修改弹窗
    showExpressDialog() {
      this.expressDialogFlag = true;
      this.updateExpress.expressCompany = this.express.expressCompany;
      this.updateExpress.expressSeries = this.express.expressSeries;
    },
    cancelExpress(){
      this.expressDialogFlag = false;
      this.$refs["expressForm"].resetFields()
    },
    expressFun() {
      console.log(this.express);
      var data = this.updateExpress;
      data.applyId = this.detailData.id;
      this.$refs["expressForm"].validate((valid) => {
        if (valid) {
          updataExpress(data)
            .then((response) => {
              if (response && response.code == "200") {
                this.$message({
                  type: "success",
                  message: "修改物流成功",
                });
                this.expressDialogFlag = false;
                this.applyDetailAjax(this.currentId);
              } else {
                // this.$message.error(response.msg);
              }
            })
            .catch((error) => {});
        } else {
          return;
        }
      });
    },
    clickLeft() {
      this.$router.push("dashboard");
    },
    //点击右上角的导航
    goToPage(val) {
      if (val == "0") {
        //开票码
        this.billingCodeVisible = true;
      } else if (val == "1") {
        this.applyaddTodoAjax(this.detailData.id);
        //加入待开
        // if(this.detailData.financeFlag=='0'){

        //   this.applyaddTodoAjax(this.detailData.id)
        //   //财务人员填写
        //   // this.$alert('信息不完整，请填写完整后再开票', '提醒', {
        //   //   confirmButtonText: '确定',
        //   //   callback: action => {
        //   //     this.applyaddTodoAjax(this.detailData.id)
        //   //   }
        //   // });
        // }else{
        //   this.applyaddTodoAjax(this.detailData.id)
        // }
      } else if (val == "2") {
        //查看待开 跳转待开列表
        // this.$nextTick(() => {
        //   sessionStorage.setItem("activeMenu", '销项管理');
        // })
        this.change();
        this.$router.push({
          path: "/management/invoicingManagement/awaitList",
          query: {
            type: "reviewInvoice",
          },
          // List: JSON.stringify({

          //     type: "awaitList",
          //   }),
        });
      } else if (val == "3") {
        //点击打印

        if (JSON.parse(localStorage.getItem("cefSharpinit_other")) == null) {
          this.$confirm("找不到打印机,请先进行打印机设置", "提示", {
            confirmButtonText: "去设置",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.printVisible = true;
              this.printType = "cefSharpinit_other";
            })
            .catch(() => {});
        } 
        else if(JSON.parse(localStorage.getItem("cefSharpinit_other")) && JSON.parse(localStorage.getItem("cefSharpinit_other")).printName == ''){
        this.$confirm("找不到打印机,请先进行打印机设置", "提示", {
          confirmButtonText: "去设置",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.printVisible = true;
            this.printType = "cefSharpinit_other";
          })
          .catch(() => {});
      }
        else {
          this.printFun("cefSharpinit_other");
        }
      } else if (val == "4") {
        //黑名单
        this.$router.push({ name: "blacklistIndex" });
      } else if (val == "5") {
        //开票 跳转到闪电开票
        //this.detailData 这条数据存起来带到闪电页面
        // this.$router.push({name:'LightningInvoicing'});
        this.$router.push({
          path: "/lightningInvoicing",
          query: {
            List: JSON.stringify({
              data: this.detailData,
              type: "reviewInvoice",
            }),
          },
        });
      } else if (val == "6") {
        //查看发票
        console.log(this.detailData);
        // getPdf({invoiceSeries: this.detailData.invoiceSeries})
        //   .then((res) => {
        //     if(res.code == 200){
        //       console.log(res)
        //       this.taxPic = res.data.jpg_url
        //     }
        //   })
        this.taxDetail = this.detailData;
        this.taxDetail.isReview = true
        this.isElectronicFlag =
          this.detailData.invoiceType == "026" ||
          this.detailData.invoiceType == "028"; //电子发票  026：电子普通发票 028：电子专用发票
        this.invoicePreviewVisible = true;
      } else if (val == "7") {
        //驳回
        this.rejectDialogFlag = true;
      }
    },

    //点击列表查看详情
    listHandelDetail(item, key) {
      this.listActiveFlag = key;
      this.currentId = item.applyId;
      this.applyDetailAjax(item.applyId);
    },
    //搜索查询数据列表
    searchFun() {
      this.$refs["searchOne"].validate((valid) => {
        if (valid) {
          this.searchFormTwo.status = "null"; //状态值清空
          this.searchFormTwo.timeDescFlag = "true"; //降序排列
          this.currentPage = 1; //第一页
          this.detailData = {};
          this.applyListAjax(
            this.searchFormOne.searchText,
            this.currentPage,
            this.searchFormTwo.timeDescFlag,
            null
          ); //关键字, 当前页码, 是否按创建时间降序(字符串), 筛选状态值
        } else {
          return false;
        }
      });
    },
    //状态值查询数据列表
    statusChangeFun() {
      this.searchFormOne.searchText = ""; //关键字清空
      this.currentPage = 1; //第一页
      this.detailData = {};
      this.$refs["searchOne"].resetFields();
      this.applyListAjax(
        null,
        1,
        this.searchFormTwo.timeDescFlag,
        this.searchFormTwo.status
      );
    },
    //申请时间查询数据列表
    tiemSearchFun(time) {
      this.searchFormTwo.timeDescFlag = time;
      this.applyListAjax(
        this.searchFormOne.searchText,
        this.currentPage,
        time,
        this.searchFormTwo.status
      ); //关键字, 当前页码, 是否按创建时间降序(字符串), 筛选状态值
    },
    rejectFun() {
      this.rejectDialogFlag = true;
    },
    //驳回原因点击确定
    rejectConfimFun() {
      this.$refs["rejectForm"].validate((valid) => {
        if (valid) {
          this.updataStatusAjax();
        } else {
          console.log("error 11111111");
          return false;
        }
      });
    },
    rejectCancelFun() {
      this.rejectDialogFlag = false;
      this.$refs["rejectForm"].resetFields();
    },

    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.applyListAjax(
        this.searchFormOne.searchText,
        this.currentPage,
        this.searchFormTwo.timeDescFlag,
        this.searchFormTwo.status
      ); //关键字, 当前页码, 是否按创建时间降序(字符串), 筛选状态值
    },

    //打印
    printFun(val) {
      console.log(1);
      let printObj = JSON.parse(localStorage.getItem(val));
      let goodsDetail = [];
      let images = [];
      this.detailData.goodsList.forEach((item) => {
        goodsDetail.push({
          name: item.goodsName,
          count: item.goodsNumber,
          money: item.goodsAmount,
        });
      });
      if (this.detailData.attachmentList.length !== 0) {
        let readySend = new Promise((reslove, reject) => {
          this.detailData.attachmentList.forEach((item) => {
            getBase64(item, (URL) => {
              console.log(item); //最后才执行
              let noPrefix = URL.replace(/^data:image\/\w+;base64,/, "");
              images.push(noPrefix);
              if (images.length == this.detailData.attachmentList.length) {
                reslove(images);
              }
            });
          });
        });
        readySend.then(async (images) => {
          let data = {
            printer: {
              printName: printObj.printName,
              offsetX: printObj.offsetX,
              offsetY: printObj.offsetY,
            },
            applyInvoiceInfo: {
              state:
                this.detailData.status == 0
                  ? "待审核"
                  : this.detailData.status == 1
                  ? "待开票"
                  : this.detailData.status == 2
                  ? "已开票"
                  : this.detailData.status == 3
                  ? "已驳回"
                  : "已撤销",
              // 状态：0-待审核，1-待开票，2-已开票，3-已驳回，4-已撤销  null 全部 00
              name: this.detailData.applicantName,
              phone: this.detailData.applicantPhone,
              invoiceType: this.invoiceTypeFilter(this.detailData.invoiceType),
              buyerName: this.detailData.buyerName,
              buyerTaxId: this.detailData.buyerTaxId,
              buyerAddressTel: this.detailData.buyerAddrTel,
              buyerBank: this.detailData.buyerBankAccount,
              remark: this.detailData.remark,
              expressCompany: this.detailData.expressCompany,
              expressNo: this.detailData.expressSeries,
              images,
              goodsDetail,
            },
          };
          console.log(data);
          const res = await printApplyInvoice(data);
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
      } else {
        let data = {
          printer: {
            printName: printObj.printName,
            offsetX: printObj.offsetX,
            offsetY: printObj.offsetY,
          },
          applyInvoiceInfo: {
            state:
              this.detailData.status == 0
                ? "待审核"
                : this.detailData.status == 1
                ? "待开票"
                : this.detailData.status == 2
                ? "已开票"
                : this.detailData.status == 3
                ? "已驳回"
                : "已撤销",
            // 状态：0-待审核，1-待开票，2-已开票，3-已驳回，4-已撤销  null 全部 00
            name: this.detailData.applicantName,
            phone: this.detailData.applicantPhone,
            invoiceType: this.invoiceTypeFilter(this.detailData.invoiceType),
            buyerName: this.detailData.buyerName,
            buyerTaxId: this.detailData.buyerTaxId,
            buyerAddressTel: this.detailData.buyerAddrTel,
            buyerBank: this.detailData.buyerBankAccount,
            remark: this.detailData.remark,
            expressCompany: this.detailData.expressCompany,
            expressNo: this.detailData.expressSeries,
            images,
            goodsDetail,
          },
        };
        console.log(data);
        printApplyInvoice(data).then((res) => {
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
    },
    //获取发票列表ajax 关键字 当前页码 是否按创建时间降序(字符串) 筛选状态值
    applyListAjax(keyword, pageNum, timeDesc, status) {
      this.invoiceList = [];
      let applyParams = {
        keyword: keyword ? keyword : null, //关键字（模糊搜索
        pageNum: pageNum, //当前页码 第一页是1
        pageSize: 10, //每页几条
        status: status == "null" ? null : status, // 状态：0-待审核，1-待开票，2-已开票，3-已驳回，4-已撤销  null 全部 00
        taxDiskNum: this.taxDiskNum, //所属税盘???
        timeDesc: timeDesc, //是否按创建时间降序(字符串) true 和 false 的  字符串
      };
      applyListApi(applyParams)
        .then((response) => {
          if (response && response.code == "200") {
            console.log("金山嘎嘎");
            //从接口中获取数据--s
            let inRes = response.data;
            this.invoiceList = inRes.records;
            this.total = inRes.total;
            //从接口中获取数据--e
            //本地测试数据--s
            //this.invoiceList=this.testJsonList()
            //            this.total=2;
            //本地测试数据--s
            if (this.invoiceList.length > 0) {
              this.applyDetailAjax(this.invoiceList[0].applyId);
              this.currentId = this.invoiceList[0].applyId
            }
          }
          console.log("数据", this.noDateFlag);
        })
        .catch((error) => {
          this.noDateFlag = "err";
        });
    },
    //获取详情ajax
    applyDetailAjax(countId) {
      applyDetailApi({ applyId: countId })
        .then((response) => {
          if (response && response.code == "200") {
            this.detailData = response.data; //
            this.express.expressCompany = this.detailData.expressCompany;
            this.express.expressSeries = this.detailData.expressSeries;
          }
        })
        .catch((error) => {
          this.noDateFlag = "err";
        });
    },
    //加入待开ajax
    applyaddTodoAjax(countId) {
      applyaddTodoApi(countId)
        .then((response) => {
          if (response && response.code == "200") {
            //              this.$message.success('加入待开成功');
            this.$alert("可在待开列表中查看该张发票信息", "加入待开成功", {
              callback: (action) => {
                // this.applyListAjax(this.searchFormOne.searchText,this.currentPage,this.searchFormTwo.timeDescFlag,this.searchFormTwo.status)//关键字, 当前页码, 是否按创建时间降序(字符串), 筛选状态值
              },
            });
            this.applyDetailAjax(countId);
          } else {
            // this.$message.error(response.msg);
          }
        })
        .catch((error) => {});
    },
    //修改审核状态-驳回
    updataStatusAjax() {
      let upaSp = {
        applyId: this.detailData.id,
        rebutCause: this.rejectForm.reason,
        status: "3",
      };
      updataStatusApi(upaSp)
        .then((response) => {
          if (response && response.code == "200") {
            this.$message.success(response.msg);
            this.applyListAjax(
              this.searchFormOne.searchText,
              this.currentPage,
              this.searchFormTwo.timeDescFlag,
              this.searchFormTwo.status
            ); //关键字, 当前页码, 是否按创建时间降序(字符串), 筛选状态值
            this.rejectDialogFlag = false;
          }
        })
        .catch((error) => {});
    },
    //拉黑ajax
    insertAjax() {
      if (!this.detailData.applicantPhone) {
        return;
      }
      insertApi({
        phone: this.detailData.applicantPhone,
        taxDiskNum: this.taxDiskNum,
      })
        .then((response) => {
          if (response && response.code == "200") {
            this.$message.success("拉黑成功");
            // this.applyListAjax(this.searchFormOne.searchText,this.currentPage,this.searchFormTwo.timeDescFlag,this.searchFormTwo.status)
          } else {
          }
        })
        .catch((error) => {});
    },
    //test数据 列表
    testJsonList() {
      //1-待开票，2-已开票，3-已驳回，4-已撤销
      return [
        {
          applicantName: "name",
          applyId: 0,
          applyTime: "04-29 15:31:09",
          buyerName: "0-待审核",
          mainProductName: "产品名",
          status: 0,
          totalPriceWithTax: 0,
          countId: 0,
        },
        {
          applicantName: "name2",
          applyId: 1,
          applyTime: "04-29 15:31:10",
          buyerName: "1-待开票",
          mainProductName: "产品名2",
          status: 1,
          totalPriceWithTax: 0,
        },
        {
          applicantName: "name2",
          applyId: 2,
          applyTime: "04-29 15:31:10",
          buyerName: "2-已开票",
          mainProductName: "产品名2",
          status: 1,
          totalPriceWithTax: 0,
        },
        {
          applicantName: "name2",
          applyId: 2,
          applyTime: "04-29 15:31:10",
          buyerName: "3-已驳回",
          mainProductName: "产品名2",
          status: 1,
          totalPriceWithTax: 0,
        },
        {
          applicantName: "name2",
          applyId: 2,
          applyTime: "04-29 15:31:10",
          buyerName: "4-已撤销",
          mainProductName: "产品名2",
          status: 1,
          totalPriceWithTax: 0,
        },
        {
          applicantName: "name2",
          applyId: 1,
          applyTime: "04-29 15:31:10",
          buyerName: "1-待开票",
          mainProductName: "产品名2",
          status: 1,
          totalPriceWithTax: 0,
        },
        {
          applicantName: "name2",
          applyId: 2,
          applyTime: "04-29 15:31:10",
          buyerName: "2-已开票",
          mainProductName: "产品名2",
          status: 1,
          totalPriceWithTax: 0,
        },
        {
          applicantName: "name2",
          applyId: 2,
          applyTime: "04-29 15:31:10",
          buyerName: "3-已驳回",
          mainProductName: "产品名2",
          status: 1,
          totalPriceWithTax: 0,
        },
        {
          applicantName: "name2",
          applyId: 2,
          applyTime: "04-29 15:31:10",
          buyerName: "4-已撤销",
          mainProductName: "产品名2",
          status: 1,
          totalPriceWithTax: 0,
        },
        {
          applicantName: "name2",
          applyId: 1,
          applyTime: "04-29 15:31:10",
          buyerName: "1-待开票",
          mainProductName: "产品名2",
          status: 1,
          totalPriceWithTax: 0,
        },
        {
          applicantName: "name2",
          applyId: 2,
          applyTime: "04-29 15:31:10",
          buyerName: "2-已开票",
          mainProductName: "产品名2",
          status: 1,
          totalPriceWithTax: 0,
        },
        {
          applicantName: "name2",
          applyId: 2,
          applyTime: "04-29 15:31:10",
          buyerName: "3-已驳回",
          mainProductName: "产品名2",
          status: 1,
          totalPriceWithTax: 0,
        },
        {
          applicantName: "name2",
          applyId: 2,
          applyTime: "04-29 15:31:10",
          buyerName: "4-已撤销",
          mainProductName: "产品名2",
          status: 1,
          totalPriceWithTax: 0,
        },
      ];
    },
    //test详情数据
    testJsonDetail() {
      return {
        applicantName: "string",
        applicantPhone: "string",
        attachmentList: ["string"],
        buyerAddrTel: "string",
        buyerBankAccount: "string",
        buyerName: "string",
        buyerTaxId: "string",
        createTime: "2021-04-19T04:36:56.198Z",
        email: "string",
        expressCompany: "快递公司",
        expressSeries: "快递单号",
        financeFlag: 0,
        goodsList: [
          {
            createTime: "2021-04-19T04:36:56.198Z",
            dutyFreeType: 0,
            goodsAmount: 0,
            goodsCode: "string",
            goodsName: "1",
            goodsNumber: 0,
            goodsPrice: 0,
            goodsSubName: "string",
            id: 0,
            incentivesLabel: "string",
            invoiceSeries: 0,
            isTax: 0,
            lineNature: 0,
            specifications: "string",
            taxAmount: 0,
            taxRate: 0,
            unit: "string",
            zeroTaxMarks: "string",
          },
          {
            createTime: "2021-04-19T04:36:56.198Z",
            dutyFreeType: 0,
            goodsAmount: 0,
            goodsCode: "string",
            goodsName: "2",
            goodsNumber: 0,
            goodsPrice: 0,
            goodsSubName: "string",
            id: 0,
            incentivesLabel: "string",
            invoiceSeries: 0,
            isTax: 0,
            lineNature: 0,
            specifications: "string",
            taxAmount: 0,
            taxRate: 0,
            unit: "string",
            zeroTaxMarks: "string",
          },
          {
            createTime: "2021-04-19T04:36:56.198Z",
            dutyFreeType: 0,
            goodsAmount: 0,
            goodsCode: "string",
            goodsName: "3",
            goodsNumber: 0,
            goodsPrice: 0,
            goodsSubName: "string",
            id: 0,
            incentivesLabel: "string",
            invoiceSeries: 0,
            isTax: 0,
            lineNature: 0,
            specifications: "string",
            taxAmount: 0,
            taxRate: 0,
            unit: "string",
            zeroTaxMarks: "string",
          },
          {
            createTime: "2021-04-19T04:36:56.198Z",
            dutyFreeType: 0,
            goodsAmount: 0,
            goodsCode: "string",
            goodsName: "4",
            goodsNumber: 0,
            goodsPrice: 0,
            goodsSubName: "string",
            id: 0,
            incentivesLabel: "string",
            invoiceSeries: 0,
            isTax: 0,
            lineNature: 0,
            specifications: "string",
            taxAmount: 0,
            taxRate: 0,
            unit: "string",
            zeroTaxMarks: "string",
          },
          {
            createTime: "2021-04-19T04:36:56.198Z",
            dutyFreeType: 0,
            goodsAmount: 0,
            goodsCode: "string",
            goodsName: "5",
            goodsNumber: 0,
            goodsPrice: 0,
            goodsSubName: "string",
            id: 0,
            incentivesLabel: "string",
            invoiceSeries: 0,
            isTax: 0,
            lineNature: 0,
            specifications: "string",
            taxAmount: 0,
            taxRate: 0,
            unit: "string",
            zeroTaxMarks: "string",
          },
          {
            createTime: "2021-04-19T04:36:56.198Z",
            dutyFreeType: 0,
            goodsAmount: 0,
            goodsCode: "string",
            goodsName: "6",
            goodsNumber: 0,
            goodsPrice: 0,
            goodsSubName: "string",
            id: 0,
            incentivesLabel: "string",
            invoiceSeries: 0,
            isTax: 0,
            lineNature: 0,
            specifications: "string",
            taxAmount: 0,
            taxRate: 0,
            unit: "string",
            zeroTaxMarks: "string",
          },
        ],
        id: 0,
        invoiceSeries: 0,
        invoiceType: "004", //发票类型 004：增值税专用发票 007：增值税普通发票025：卷式发票 026：电子普通发票 028：电子专用发票 005: 机动车销售统一发票
        listingLabel: 0,
        mainProductName: "string",
        rebutCause: "驳回原因",
        remark: "string",
        sellerAddrTel: "string",
        sellerBankAccount: "string",
        sellerName: "string",
        sellerTaxId: "string",
        status: "0", //0-待审核 1-待开票，2-已开票，3-已驳回，4-已撤销
        taxDiskNum: "string",
        totalPriceWithTax: 0,
      };
    },
  },
};
</script>


<style scoped>
.reviewInvoicing >>> .el-scrollbar__wrap {
  overflow: visible;
  overflow-x: hidden;
}
.reviewInvoicing >>> .el-pagination.is-background .btn-prev,
.reviewInvoicing >>> .el-pagination.is-background .el-pager li {
  margin: 0 2px;
}
.reviewInvoicing >>> .el-input-group__append {
  padding: 0 12px;
}
.reviewInvoicing >>> .el-input__inner,
.reviewInvoicing >>> .el-input__icon {
  height: 32px;
  line-height: 32px;
}
.reviewInvoicing >>> .el-icon-caret-top,
.reviewInvoicing >>> .el-icon-caret-bottom {
  position: absolute;
  left: 0;
  font-size: 12px;
  cursor: pointer;
}
.reviewInvoicing >>> .el-icon-caret-top {
  top: 4px;
  color: #bfbfbf;
}
.reviewInvoicing >>> .el-icon-caret-bottom {
  bottom: 0;
  color: #bfbfbf;
}
.applyTime >>> .el-form-item__content .activeIcon {
  color: #5e8cf9;
}

.reviewInvoicing >>> .el-form-item {
  margin-bottom: 13px;
}
.secondForm >>> .el-form-item {
  width: 67%;
  display: inline-block;
}
.secondForm >>> .el-form {
  position: relative;
}
.secondForm .applyTime {
  position: absolute;
  width: 26%;
  margin-left: 30px;
}
.applyTime >>> .el-form-item__content {
  position: relative;
  width: 15px;
  height: 23px;
  top: 7px;
}

.reviewInvoicing {
  box-sizing: border-box;
  background-color: #ffffff;
}
.reviewContent {
  /*padding: 16px 0 0 25px;*/
  padding-left: 25px;
  padding-right: 25px;
  box-sizing: border-box;
}
.contentLeft {
  display: inline-block;
  float: left;
  width: 35%;
  /*padding-right: 24px;*/
  box-sizing: border-box;
  border-right: 1px solid #ececec;
  padding-top: 12px;
}

.listBox {
  /*width: 100%;*/
  /*height: 592px;*/
  /*position: relative;*/
  /*overflow: hidden;*/
  /*top: -13px;*/

  width: 100%;
  height: 576px;
  /*position: relative;*/
  /*overflow: hidden;*/
  /*top: -13px;*/
}
.ulBox {
  /*position: absolute;*/
  /*left: 0;*/
  /*top: 0;*/
  /*right: -17px;*/
  /*bottom: 0;*/
  /*overflow-x: hidden;*/
  /*overflow-y: scroll;*/
  /*padding: 0;*/
  /*padding-right: 24px;*/

  padding: 0;
  padding-right: 24px;
  margin-bottom: 35px;
}
.listItme {
  /*width: 100%;*/
  /*height: 78px;*/
  /*border: 1px solid #F0F0F0;*/
  /*padding: 10px;*/
  /*box-sizing: border-box;*/
  /*margin-bottom: 16px;*/
  /*cursor: pointer;*/

  width: 100%;
  height: 78px;
  border: 1px solid #f0f0f0;
  padding: 10px 5px 10px 10px;
  box-sizing: border-box;
  margin-bottom: 16px;
  cursor: pointer;
}
.listTtmeAxtive {
  background: #e6f7ff;
}
.itemLeft {
  display: inline-block;
  height: 53px;
  width: 61%;
  border-right: 1px solid #d6d6d6;
}
.textTop {
  margin-bottom: 11px;
  color: #000000;
  height: 25px;
  padding-right: 4px;
}
.textRight {
  margin-bottom: 11px;
  color: #000000;
  height: 25px;
  padding: 0 0 0 5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.textBottom {
  color: #505659;
}
.itemRight {
  display: inline-block;
  width: 38%;
  text-align: right;
}
.itemRightTwo {
  display: inline-block;
  width: 38%;
  text-align: right;
}
.contentRight {
  display: inline-block;
  width: 65%;
  float: right;
}

.rightHeader {
  height: 64px;
  line-height: 64px;
  border-bottom: 1px solid #ececec;
  font-size: 16px;
  color: #000000;
}
.applyDetai {
  margin: 0 31px 0 24px;
  font-weight: 700;
}
.rightNavBox {
  float: right;
}
.rightNav {
  display: inline-block;
  cursor: pointer;
  margin-right: 15px;
}
.navImg {
  width: 30px;
  vertical-align: sub;
  position: relative;
  top: 6px;
}
.navTex {
  font-size: 14px;
  color: #000000;
}
.btnNav {
  width: 93px;
  height: 38px;
  line-height: 38px;
  text-align: center;
  border-radius: 2px;
  cursor: pointer;
  font-size: 14px;
  color: #ffffff;
}
.open {
  background: #5e8cf9;
}
.reject {
  background: #ff4d4f;
}
.rightleftBody {
  padding-left: 24px;
  /*padding-right: 20px;*/
  width: 53%;
  /*background: red;*/
  border-right: 1px solid #ececec;
  float: left;
  height: 692px;
}
.applyPerson {
  font-size: 16px;
  color: #000000;
  margin-bottom: 20px;
  font-weight: 700;
}
.bodyUL {
  padding: 0;
  margin-top: 35px;
}
.block {
  display: inline-block;
  width: 48px;
  height: 22px;
  line-height: 22px;
  text-align: center;
  background: #5e8cf9;
  border-radius: 2px;
  font-size: 12px;
  font-weight: 400;
  color: #ffffff;
  margin-left: 15px;
  cursor: pointer;
}

.bodyTitle {
  color: rgba(0, 0, 0, 0.85);
  margin-right: 5px;
}
.bodyContent {
  color: rgba(0, 0, 0, 0.65);
  margin-right: 15px;
}
.goodsScrollOther {
  position: relative;
  display: block;
  height: 192px;
  width: 100%;
  overflow: hidden;
}
.goodsScrollInner {
  /*overflow-x: hidden;*/
  /*overflow-y: scroll;*/
  /*position: absolute;*/
  /*left: 0;*/
  /*top: 0;*/
  /*right: -17px;*/
  /*bottom: 0;*/
  width: 100%;
  height: 200px;
}
.goodsScrollInner .noDate {
  padding-top: 0;
}
.reviewInvoicing .noDateImg {
  width: 170px;
}
.goodsItem {
  background: #f1f3f7;
  padding: 10px;
  width: 44%;
  /*float: left;*/
  margin-right: 20px;
  margin-bottom: 17px;
  display: inline-block;
}
.rightrightBody {
  float: right;
  padding: 35px 0 0 24px;
  width: 45%;
}

/*弹窗*/
.reviewInvoicing >>> .el-dialog__title {
  font-size: 23px;
}
/*.reviewInvoicing >>> .el-dialog__wrapper{*/
/*bottom:65px*/
/*}*/
.reviewInvoicing >>> .el-dialog--center .el-dialog__body {
  padding: 25px 50px 85px;
}
.pintHeader .pintStatus {
  font-size: 16px;
  color: #000000;
  margin-bottom: 20px;
  margin-right: 20px;
  font-weight: 700;
}
.pintImgBox {
  width: 100%;
}
.pintimgItem {
  float: left;
  width: 31%;
  overflow: hidden;
  margin-right: 10px;
}
.pintImgDetail {
  width: 100%;
}
.paginBox {
  padding-bottom: 30px;
}

.mal21 {
  margin-left: 21px;
}
.mab16 {
  margin-bottom: 16px;
}
.mab4 {
  margin-bottom: 4px;
}
.pr24 {
  padding-right: 24px;
}
.blue {
  color: #5e8cf9;
}
.red {
  color: #ff4d4f;
}
.green {
  color: #52c41a;
}
.expressBox >>> .el-form-item__label {
  color: #ababab;
}

.expressFlexBox {
  display: flex;
  flex-direction: column;
}
.expressFlex{
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.expressText {
  height: 20px;
  line-height: 20px;
  word-break: normal;

  white-space: pre-wrap;
  word-wrap: break-word;
}

.fixBox {
  text-align: right;
  cursor: pointer;
  color: #5e8cf7;
}

.whiteSpace {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.flex {
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
}
.oneLine {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.twoLine {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -moz-box;
  -moz-line-clamp: 2;
  -moz-box-orient: vertical;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
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
</style>

