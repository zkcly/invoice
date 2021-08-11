<template>
  <div id="blacklist">
    <div class="nav-flex borderBottom">
      <div class="nav-left">
        <!-- <span class="el-icon-arrow-left"> {{ title }}</span> -->
        <breadnav textTitle="批量开票" @leftEvent="clickLeft" />
        <div style="display: inline-block; margin-left: 40px; width: 248px">
          <el-form>
            <el-form-item>
              <el-input placeholder="请输入" v-model.trim="keyword">
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="searchBykeyword"
                ></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="nav-right">
        <span>
          <el-upload
            action
            :show-file-list="false"
            :on-change="handleChange"
            :http-request="uploadFile"
          >
            <img src="../../assets/goods/import_slices/import.png" alt="" /><el-button type="text">导入</el-button>
          </el-upload>
        </span>
        <!-- <span> <img src="../../assets/imgs/copy.png" alt="" />拆分 </span>
        <span> <img src="../../assets/imgs/reduce.png" alt="" />合并 </span> -->
        <span @click="deleteInvoice">
          <img src="../../assets/images/delete.png" alt="" />删除
        </span>
        <span @click="downloadTemplate">
          <img src="../../assets/images/download.png" alt="" />模板下载
        </span>
        <el-button type="primary" style="height: 38px" @click="execute()"
          >开 票</el-button
        >
      </div>
    </div>
    <div class="small-header">
      <div class="small-title">发票类型：</div>
      <div class="choose">
        <el-select
          size="small"
          v-model="invoiceVal"
          placeholder="请选择"
          style="width: 280px"
        >
          <el-option
            v-for="item in invoiceType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <el-button
        type="primary"
        size="small"
        style="width: 74px"
        @click="searchByinvoice"
        >查询</el-button
      >
    </div>
    <div>
      <div class="tableBox">
        <el-table
          ref="multipleTable"
          tooltip-effect="dark"
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :default-sort="{ prop: 'date', order: 'descending' }"
          @sort-change="handleSortChange"
        >
          <div slot="empty">
            <listnodate :tableFlag="noDateFlag" />
          </div>
          <el-table-column type="selection"> </el-table-column>
          <!-- <el-table-column prop="sellerName" label="销方名称">
          </el-table-column> -->

          <el-table-column prop="docCode" label="单据号">
            <template slot-scope="scope">
              <span :class="scope.row.infoFlag == 1 ? 'red' : ''">{{
                scope.row.docCode
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" sortable="custom" label="单据日期" width="160px">
            <template slot-scope="scope">
              <span :class="scope.row.infoFlag == 1 ? 'red' : ''">{{
                scope.row.createTime
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="invoiceTypeText" label="发票类型">
            <template slot-scope="scope">
              <span :class="scope.row.infoFlag == 1 ? 'red' : ''">{{
                scope.row.invoiceTypeText
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="buyerName" label="购方名称">
            <template slot-scope="scope">
              <span :class="scope.row.infoFlag == 1 ? 'red' : ''">{{
                scope.row.buyerName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="buyerTaxId" label="购方税号">
            <template slot-scope="scope">
              <span :class="scope.row.infoFlag == 1 ? 'red' : ''">{{
                scope.row.buyerTaxId
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalAmount" label="合计金额">
            <template slot-scope="scope">
              <span :class="scope.row.infoFlag == 1 ? 'red' : ''">{{
                scope.row.totalAmount
              }}</span>
            </template></el-table-column
          >
          <el-table-column prop="totalTaxAmount" label="合计税额">
            <template slot-scope="scope">
              <span :class="scope.row.infoFlag == 1 ? 'red' : ''">{{
                scope.row.totalTaxAmount
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalPriceWithTax" label="价税合计">
            <template slot-scope="scope">
              <span :class="scope.row.infoFlag == 1 ? 'red' : ''">{{
                scope.row.totalPriceWithTax
              }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="date" label="是否含税"></el-table-column> -->
          <el-table-column prop="status" label="开票状态">
            <template slot-scope="scope">
              <span :class="scope.row.infoFlag == 1 ? 'red' : ''">{{
                scope.row.status == 0
                  ? "未开票"
                  : scope.row.status == 1
                  ? "开票失败"
                  : scope.row.status == 2
                  ? "开票成功"
                  : scope.row.status == 3
                  ? "开票中"
                  : "准备开票"
              }}</span>
            </template></el-table-column
          >
          <el-table-column prop="failCause" label="失败原因">
            <template slot-scope="scope">
              <span :class="scope.row.infoFlag == 1 ? 'red' : ''">{{
                scope.row.failCause
              }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="date" label="抄报状态"></el-table-column> -->
          <el-table-column prop="address" label="操作" width="120" fixed="right">
            <template slot-scope="scope">
              <span class="moverBlack" @click="editInvoice(scope.row)"
                >修改</span
              >
              <el-divider direction="vertical"></el-divider>
              <span class="moverBlack" @click="goodsDetail(scope.row)"
                >明细</span
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="paginBox">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100, 200]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="商品明细"
      width="80%"
      :visible.sync="goodsDetailVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
      :before-close="closeGoodsDetailDialog"
    >
      <div style="text-align: right; margin-bottom: 15px">
        <el-button type="primary" size="small" @click="batchAssignCode"
          >批量赋码</el-button
        >
        <el-button size="small" @click="deleteGoods">删除</el-button>
      </div>

      <el-table
        ref="multipleTable"
        tooltip-effect="dark"
        :data="goodsDetailtableData"
        style="width: 100%"
        @selection-change="goodsSelectionChange"
        border
      >
        <el-table-column type="selection"> </el-table-column>
        <el-table-column prop="goodsName" label="商品名称"> </el-table-column>
        <el-table-column prop="goodsShortName" label="税收分类简称">
          <template slot-scope="scope">
            <span :class="scope.row.goodsShortName == '' ? 'red' : ''">
              {{
                scope.row.goodsShortName == ""
                  ? "请手动赋码"
                  : scope.row.goodsShortName
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="specifications"
          label="规格型号"
        ></el-table-column>
        <el-table-column prop="unit" label="单位"> </el-table-column>
        <el-table-column prop="goodsNumber" label="数量"> </el-table-column>
        <el-table-column prop="goodsPrice" label="单价"></el-table-column>
        <el-table-column prop="goodsAmount" label="金额"></el-table-column>
        <el-table-column prop="taxRate" label="税率">
          <template slot-scope="scope">
            {{ parseFloat(scope.row.taxRate * 100) + "%" }}
          </template>
        </el-table-column>
        <el-table-column prop="taxAmount" label="税额"> </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <span class="moverBlack" @click="showSelectTaxDialog(scope.row)"
              >修改</span
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 开票弹窗 -->
    <el-dialog
      title="正在开票"
      :visible.sync="executeVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
      :before-close="beforeClose"
    >
      <div>
        <el-progress :percentage="percentage" color="#409eff"></el-progress>
        <div class="executeText">
          <span
            >开具成功{{ totalSuccessCount }}张，大约剩余{{
              surplusCount * 3
            }}秒</span
          >
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="quitExecute">暂停开票</el-button>
      </div>
    </el-dialog>

    <select-tax-encode
      :visible.sync="selectTaxEncodeVisibility"
      :ids="ids"
      :ifShow="true"
      :ifGoodsController="false"
      @updateGoods="updateGoods"
    />


  </div>
</template>


<script type="text/ecmascript-6">
import request from "@/utils/request";
import { UtilsGetTicketType } from "@/utils/function";

import Listnodate from "@/components/ListNoDate";
import SelectTaxEncode from "@/views/home/components/SelectTaxEncode";
import { download } from "@/api/batchInvoicing.js";
import { downloadFile } from "@/utils/function.js";
import Breadnav from "@/components/Breadnav";
import {
  getTaskConfig,
  addTaskConfig,
  updateRead,
  updateStatus,
} from "@/api/awaitListApi.js";
import { getInvoicingTypeDetail } from "@/api/lightInvoicing.js";
export default {
  name: "batchInvoicing",
  components: { Listnodate, SelectTaxEncode, Breadnav },
  data() {
    return {
      title: "批量开票",
      // 发票类型
      invoiceType: [
        {
          label: "全部类型",
          value: "",
        },
      ],
      invoiceVal: "",
      searchInvoiceType: '',
      keyword: "",
      goodsDetailVisible: false,
      multipleSelection: [],
      goodsSelection: [],
      noDateFlag: "successNoDate",
      totalCount: 0,
      tableData: [],
      goodsDetailtableData: [],
      currentPage: 1,
      pageSize: 10,
      taxDiskNum: "",
      selectTaxEncodeVisibility: false,
      ids: [],
      checkedSeries: "",
      key: "",
      continue: true,
      loading: false,
      executeVisible: false,
      taskId: "",
      percentage: 0,
      surplusCount: 0,
      totalSuccessCount: 0,
      totalFailCount: 0,
      currentDetail: {},
      timeDesc: "",
      judgeTaxSurplus: 0,
      invoiceTypeSurplus: [],
      invoiceTypeArr: [],
      ticketType: ''
    };
  },
  created() {
    this.taxDiskNum = this.$store.state.user.taxDiskNum;
    console.log(this.$route.meta.keepAlive);
    request({
      url: "company/companyDiskTicketType/getDiskTicketType",
      method: "get",
      params: { taxDiskNum: this.taxDiskNum },
    }).then((res) => {
      this.invoiceType = this.invoiceType.concat(
        UtilsGetTicketType(res.data.ticketType)
      );
      this.getInvoiceSurplus(res.data.ticketType)
    });
    this.search();

    this.ifExecute();
  },
  mounted() {
    console.log(this.executeStatus);
    
  },
  methods: {
    handleSortChange(val) {
      if (val.order == "descending") {
        this.timeDesc = true;
      } else if (val.order == "ascending") {
        this.timeDesc = false;
      } else {
        this.timeDesc = null;
      }
      this.search();
    },
    async ifExecute() {
      const res = await getTaskConfig({
        taxDiskNum: this.taxDiskNum,
      });
      if (res.data !== null && res.data.status == 1) {
        if (res.data.totalFailCount !== 0) {
          this.$alert(
            "请根据错误提示修改信息后,再次操作",
            `${res.data.totalFailCount}张发票开具失败`,
            {
              confirmButtonText: "知道了",
              type: "warning",
            }
          );
        } else if (res.data.totalFailCount == 0) {
          this.$alert(
            `本次共开具${res.data.totalCount}张发票，可至发票查询中查看发票`,
            "开票成功！",
            {
              confirmButtonText: "知道了",
              type: "success",
            }
          );
        }
        this.updateRead(res.data.id);
      } else if (res.data !== null && res.data.status == 0) {
        this.taskId = res.data.id;
        this.executeVisible = true;
        this.setInter(2000, this.getTaskConfig);
      } else {
        return;
      }
    },
    clickLeft() {
      this.$router.push({ name: "dashboard" });
    },
    searchBykeyword() {
      this.invoiceVal = "";
      this.search();
    },
    searchByinvoice() {
      this.keyword = "";
      this.currentPage = 1
      this.searchInvoiceType = this.invoiceVal
      this.search();
    },

    search() {
      request({
        url: "server/todo/page",
        method: "post",
        data: {
          invoiceType: this.searchInvoiceType,
          keyword: this.keyword,
          taxDiskNum: this.taxDiskNum,
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          source: 2,
          timeDesc: this.timeDesc,
        },
      }).then((res) => {
        // let newData = []
        // res.data.records.forEach(item => {
        //   if(item.status == 0 || item.status == 1){
        //     item.invoiceTypeText = UtilsGetTicketType(item.invoiceType)[0].label
        //     newData.push(item)
        //   }
        // })
        res.data.records.forEach(
          (item) =>
            (item.invoiceTypeText = UtilsGetTicketType(
              item.invoiceType
            )[0].label)
        );

        this.tableData = res.data.records;
        this.totalCount = res.data.total;

      });
    },
    handleChange(file) {
      // 上传文件，获取文件流
      this.file = file.raw;
    },
    test(){
      console.log('test')
    },
    // 导入excel
    uploadFile() {
      let form = new FormData();
      // 后端接受参数 ，可以接受多个参数,
      form.append("file", this.file);
      form.append("taxDiskNum", this.taxDiskNum);
      request({
        url: "server/todo/batch/import",
        method: "post",
        data: form,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          if (res.code == 200) {
            this.$message({
              message: "导入成功",
              type: "success",
            });
            this.currentPage = 1;
            this.search();
            console.log(res);
            
          } else {
          }
        })
        .catch((error) => console.log({ error }));
    },
    deleteInvoice() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "请选择要删除的数据",
          type: "warning",
        });
        return;
      }
      let invoicesids = [];
      this.multipleSelection.forEach((item) => {
        invoicesids.push(item.id);
      });
      this.$confirm("确定要删除吗?", "提示", {
        type: "warning",
      })
        .then(() => {
          request({
            url: "server/todo/delete",
            method: "delete",
            params: {
              todoIds: invoicesids.join(","),
            },
          }).then((res) => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.currentPage = 1;
              this.search();
            } else {
            }
          });
        })
        .catch(() => {});
    },
    downloadTemplate() {
      download()
        .then((res) => {
          console.log(res);
          downloadFile(res, "发票测试");
        })
        .catch((error) => {});
    },

    //定时任务 每1秒请求获取一次任务状态
    setInter(s, fn) {
      let timeOut = (s, fn) => {
        var time1 = setTimeout(() => {
          if ((this.continue = true)) {
            fn.call(this);
            timeOut(s, fn);
          }
        }, s);
        this.timer = time1;
      };
      timeOut(s, fn);
    },
    //获取任务详情
    async getTaskConfig() {
      try {
        const res = await getTaskConfig({
          taxDiskNum: this.taxDiskNum,
        });
        if (res.code == 200) {
          this.executeVisible = true;
          this.taskId = res.data.id;
          this.executeStatus = res.data.status;
          if (res.data.status == 0) {
            this.continue = true;
            this.percentage = parseInt(
              ((res.data.totalSuccessCount + res.data.totalFailCount) /
                res.data.totalCount) *
                100
            );
            this.totalSuccessCount = res.data.totalSuccessCount;
            this.surplusCount =
              res.data.totalCount -
              res.data.totalSuccessCount -
              res.data.totalFailCount;
          } else if (res.data.status == 1) {
            this.continue = false;
            this.executeVisible = false;
            this.percentage = 0;
            clearTimeout(this.timer);
            if (res.data.totalFailCount !== 0) {
              this.executeFailResultVisible = true;
              this.totalFailCount = res.data.totalFailCount;
              this.$alert(
                "请根据错误提示修改信息后,再次操作",
                `${res.data.totalFailCount}张发票开具失败`,
                {
                  confirmButtonText: "知道了",
                  type: "warning",
                }
              );
            } else {
              this.executeSuccessResultVisible = true;
              this.totalSuccessCount = res.data.totalSuccessCount;
              this.$alert(
                `本次共开具${res.data.totalCount}张发票，可至发票查询中查看发票`,
                "开票成功！",
                {
                  confirmButtonText: "知道了",
                  type: "success",
                }
              );
            }
            this.updateRead(res.data.id);
            this.search();
          }
        }
      } catch {
        (error) => console.log(error);
      }
    },
  
    //查询发票余量
    async getInvoicingTypeDetail(invoiceType) {
      const res = await getInvoicingTypeDetail({
        invoiceType,
        taxDiskNum: this.taxDiskNum,
      })
      if(res.code == 200){
        this.invoiceTypeSurplus.push({
          invoiceType: invoiceType,
          surplus: res.data.balances
        })
      }
    },
    getInvoiceSurplus(val){
      let newVal = val.split(',')
      newVal.forEach(item => {
        this.getInvoicingTypeDetail(item)
      })
    },
    //新增开票任务
    async execute() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "请选择待开票据",
          type: "warning",
        });
        return;
      }
      let c= this.multipleSelection
      c.forEach(item => {
        this.invoiceTypeSurplus.forEach(item2 => {
          if(item2.invoiceType == item.invoiceType){
            item.sur=item2.surplus;
          }
        })
      })

      if(c.some((item)=>{return item.sur=='0' })==true){
        this.$message({
          message: "发票已用完，无法开具发票!",
          type: "warning",
        });
        return;
      }
      if(c.some((item)=>{return item.infoFlag=='1' })==true){
        this.$message({
          message: "包含信息不完整的数据，无法开具发票!",
          type: "warning",
        });
        return;
      }

      this.executeVisible = true;
      let todoIds = [];
      for (let item of this.multipleSelection) {
        todoIds.push(item.id);
      }
      try {
        const res = await addTaskConfig({
          todoIds,
          taxDiskNum: this.taxDiskNum,
        });
        // if(res.code == 500){
        //   this.$message({
        //     type: 'info',
        //     message: res.msg
        //   })
        // }
        if (res.code == 200 || res.msg == "开票中，请等待结果") {
          this.getTaskConfig();
          this.setInter(2000, this.getTaskConfig);
        }
      } catch {
        (error) => console.log(error);
      }
    },
    //停止开票
    async quitExecute() {
      try {
        const res = await updateStatus({
          status: 2,
          taskId: this.taskId,
        });
        if (res.code == 200) {
          this.executeVisible = false;
          this.continue = false;
          clearTimeout(this.timer);
        }
      } catch {
        (error) => console.log(error);
      }
    },
    //更新已读状态
    async updateRead(taskId) {
      try {
        await updateRead({
          read: 1,
          taskId,
        });
      } catch {
        (error) => console.log(error);
      }
    },
    beforeClose() {
      this.continue = false;
      this.executeVisible = false;
      clearTimeout(this.timer);
    },

    editInvoice(data) {
      request({
        url: "server/todo/listGoods",
        method: "get",
        params: {
          invoiceSeries: data.invoiceSeries,
        },
      }).then((res) => {
        if (res.code == 200) {
          res.data.forEach((item, index, arr) => {
            if(item.lineNature == 1){
              res.data.forEach((item2, index2, arr2) => {
                if(item.goodsName == item2.goodsName && index2 > index && item2.lineNature == 2){
                  arr2.splice(index2,1)
                  arr2.splice(index,0,item2)
                }
              })
            }
          })
          console.log(res.data)
          data.goodsList = this.count(res.data);

          this.$router.push({
            path: "/lightningInvoicing",
            query: {
              List: JSON.stringify({
                complete: data.infoFlag == 0,
                data,
                type: "BatchInvoicing",
              }),
            },
          });
        } else {
          // this.$message({
          //   type: 'error',
          //   message: res.msg
          // })
        }
      });
    },
    //根据金额/数量/单价任意两项算出剩余一项
    count(arr) {
      for (let item of arr) {
        if (
          item.goodsAmount == null &&
          item.goodsNumber !== null &&
          item.goodsPrice !== null
        ) {
          item.goodsAmount = (item.goodsNumber * item.goodsPrice).toFixed(2);
        } else if (
          item.goodsNumber == null &&
          item.goodsAmount !== null &&
          item.goodsPrice !== null
        ) {
          item.goodsNumber = (item.goodsAmount / item.goodsPrice).toFixed(2);
        } else if (
          item.goodsPrice == null &&
          item.goodsAmount !== null &&
          item.goodsNumber !== null
        ) {
          item.goodsPrice = (item.goodsAmount / item.goodsNumber).toFixed(2);
        }
      }
      return arr;
    },
    goodsDetail(list) {
      this.currentDetail = list;
      console.log(typeof list);
      if (typeof list == "object") {
        this.checkedSeries = list.invoiceSeries;
      }
      request({
        url: "server/todo/listGoods",
        method: "get",
        params: {
          invoiceSeries: typeof list == "object" ? list.invoiceSeries : list,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.goodsDetailVisible = true;
          this.goodsDetailtableData = this.count(res.data);
        } else {
          // this.$message({
          //   type: 'error',
          //   message: res.msg
          // })
        }
      });
    },
    batchAssignCode() {
      if (this.goodsSelection.length == 0) {
        this.$message({
          message: "请选择数据",
          type: "warning",
        });
        return;
      }
      this.selectTaxEncodeVisibility = true;
      // this.$refs.multipleTable.clearSelection();
      // this.$router.push({
      //   name: "TaxEncode",
      //   params: {
      //     goods: this.goodsSelection,
      //   },
      // });
    },
    deleteGoods() {
      if (this.goodsSelection.length == 0) {
        this.$message({
          message: "请选择要删除的数据",
          type: "warning",
        });
        console.log(this.checkedSeries);
        return;
      }
      let invoicesids = [];
      this.goodsSelection.forEach((item) => {
        invoicesids.push(item.id);
      });
      request({
        url: "server/todo/deleteGoods",
        method: "delete",
        // data: {
        //   goodsList: invoicesids,
        // },
        data: invoicesids,
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.goodsDetail(this.checkedSeries);
          this.search();
        })
        .catch((error) => {
          // this.$message({
          //   type: 'error',
          //   message: error
          // })
        });
    },
    closeGoodsDetailDialog() {
      this.goodsDetailVisible = false;
    },
    //分页
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.search();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.search();
    },

    //多选
    handleSelectionChange(val) {
      let arrLength = 0;
      console.log("选中", val);
      this.multipleSelection = val;
      let invoiceTypeArr = [];
      val.forEach((item) => {
        invoiceTypeArr.push(item.invoiceType);
      });
      invoiceTypeArr = [...new Set(invoiceTypeArr)];
      this.invoiceTypeArr = invoiceTypeArr;
      console.log(this.invoiceTypeArr);

      
    },

    goodsSelectionChange(val) {
      this.goodsSelection = val;
      var arr = [];
      for (let i = 0; i < val.length; i++) {
        arr.push(val[i].id);
      }
      this.ids = arr;
      console.log(this.ids);
    },

    //税收编码
    showSelectTaxDialog(val) {
      console.log(val.id);
      // this.ids.push(val.id);
      // this.selectTaxEncodeVisibility = true;
      request({
        url: "server/todo/listGoods",
        method: "get",
        params: {
          invoiceSeries: val.invoiceSeries,
        },
      }).then((res) => {
        if (res.code == 200) {
          res.data.forEach((item, index, arr) => {
            if(item.lineNature == 1){
              res.data.forEach((item2, index2, arr2) => {
                if(item.goodsName == item2.goodsName && index2 > index && item2.lineNature == 2){
                  arr2.splice(index2,1)
                  arr2.splice(index,0,item2)
                }
              })
            }
          })
          let currentDetail = this.currentDetail;
          currentDetail.goodsList = res.data;
          this.$router.push({
            path: "/lightningInvoicing",
            query: {
              List: JSON.stringify({
                complete: currentDetail.infoFlag == 0,
                data: currentDetail,
                type: "BatchInvoicing",
              }),
            },
          });
        } else {
          // this.$message({
          //   type: 'error',
          //   message: res.msg
          // })
        }
      });
    },
    haveSelected() {
      this.$refs.multipleTable.clearSelection();
    },
    updateGoods() {
      request({
        url: "server/todo/listGoods",
        method: "get",
        params: {
          invoiceSeries: this.checkedSeries,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.goodsDetailtableData = res.data;
        }
      });
    },
  },
};
</script>
<style   scoped>
.nav-flex {
  display: flex;
  justify-content: space-between;
  height: 62px;
  line-height: 62px;
}
.borderBottom {
  border-bottom: 1px solid #ececec;
  padding: 0 25px;
}

.nav-left > span {
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #252525;
}
.nav-right {
  display: flex;
  align-items: center;
}
.nav-right > span {
  margin-right: 10px;
  cursor: pointer;
}
.nav-right img {
  width: 30px;
  height: 30px;
  vertical-align: middle;
}

.small-header {
  display: flex;
  align-items: center;
  margin: 15px 0;
  padding: 0 25px;
}
.small-header .title-small {
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #000;
  margin-right: 40px;
}
.small-header .small-title {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #000;
}
.small-header .choose {
  margin-right: 20px;
}
#blacklist {
  /* padding: 0 25px; */
  box-sizing: border-box;
  background-color: #ffffff;
}
.red {
  color: red;
}

.moverBlack {
  font-size: 14px;
  font-weight: 400;
  color: #1890ff;
  cursor: pointer;
}

.tableBox {
  padding: 0 25px;
  padding-bottom: 100px;
}
.paginBox {
  padding-bottom: 20px;
  padding-right: 25px;
  text-align: right;
}
.executeText {
  margin-top: 14px;
  height: 20px;
  line-height: 20px;
}
.executeText >>> span {
  font-size: 14px;
  font-weight: 400;
}

#blacklist >>> .el-dialog__header {
  border-bottom: 1px solid #ddd;
}
.el-button--text{
  color: #000;
}
</style>

