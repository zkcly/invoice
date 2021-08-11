<template>
  <div class="blacklist">
    <div class="nav-flex borderBottom">
      <!-- <div class="nav-left" >
        <span class="el-icon-arrow-left"> {{ title }}</span>
      </div> -->
      <div class="nav-left">
        <breadnav textTitle="清单开票" @leftEvent="clickLeft" />

        <div style="display: inline-block; margin-left: 40px; width: 248px">
          <el-form>
            <el-form-item>
              <el-input placeholder="请输入" v-model.trim="queryWord">
                <el-button slot="append" icon="el-icon-search" @click="searchBykeyword"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="nav-right">
        <!-- <span
          @click="$router.push('/management/invoicingManagement/taxEncode')"
        >
          <img src="../../assets/imgs/QRcode.png" alt="" />批量赋码
        </span> -->
        <span @click="deleteInvoice">
          <img src="../../assets/images/delete.png" alt="" />删除
        </span>
        <span>
          <!-- <el-upload action 
              :show-file-list="false"
              :on-change="handleChange"
              :http-request="uploadFile"> -->
          <div @click="importDialog">
            <img src="../../assets/goods/import_slices/import.png" alt="" />导入
          </div>

          <!-- </el-upload> -->
        </span>
        <!-- <span> <img src="../../assets/imgs/copy.png" alt="" />拆分 </span>
        <span> <img src="../../assets/imgs/reduce.png" alt="" />合并 </span> -->
        <span @click="$router.push('/inventoryInvoicing/templateSetting')">
          <img src="../../assets/imgs/setting.png" alt="" />模版设置
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
          <el-table-column type="selection" width="55"> </el-table-column>
          <!-- <el-table-column prop="sellerName" label="销方名称">
          </el-table-column> -->
          <el-table-column prop="docCode" label="单据号">
            <template slot-scope="scope">
              <span :class="scope.row.infoFlag == 1? 'red' : ''">{{scope.row.docCode}}</span>
            </template>  
          </el-table-column>
          <el-table-column prop="createTime" sortable='custom' label="单据日期" width="160">
            <template slot-scope="scope">
              <span :class="scope.row.infoFlag == 1? 'red' : ''">{{scope.row.createTime}}</span>
            </template>  
          </el-table-column>
          
          <el-table-column prop="invoiceTypeText" label="发票类型">
            <template slot-scope="scope">
              <span :class="scope.row.infoFlag == 1? 'red' : ''">{{scope.row.invoiceTypeText}}</span>
            </template>  
          </el-table-column>
          <!-- <el-table-column prop="invoiceTypeText" label="开票类型">
            <template slot-scope="scope">
              {{
                scope.row.invoiceCategory == 0
                  ? "正数发票"
                  : scope.row.invoiceCategory == 1
                  ? "负数发票"
                  : "空白作废发票"
              }}
            </template>
          </el-table-column> -->
          <el-table-column prop="buyerName" label="购方名称"> 
            <template slot-scope="scope">
              <span :class="scope.row.infoFlag == 1? 'red' : ''">{{scope.row.buyerName}}</span>
            </template>  
          </el-table-column>
          <el-table-column prop="buyerTaxId" label="购方税号">
            <template slot-scope="scope">
              <span :class="scope.row.infoFlag == 1? 'red' : ''">{{scope.row.buyerTaxId}}</span>
            </template>  
          </el-table-column>
          <el-table-column
            prop="totalAmount"
            label="合计金额"
          >
          <template slot-scope="scope">
              <span :class="scope.row.infoFlag == 1? 'red' : ''">{{scope.row.totalAmount}}</span>
            </template>  </el-table-column>
          <el-table-column prop="totalTaxAmount" label="合计税额">
            <template slot-scope="scope">
              <span :class="scope.row.infoFlag == 1? 'red' : ''">{{scope.row.totalTaxAmount}}</span>
            </template>  
          </el-table-column>
          <el-table-column prop="totalPriceWithTax" label="价税合计">
            <template slot-scope="scope">
              <span :class="scope.row.infoFlag == 1? 'red' : ''">{{scope.row.totalPriceWithTax}}</span>
            </template>  
          </el-table-column>
          <!-- <el-table-column prop="date" label="是否含税"></el-table-column> -->
          <el-table-column prop="status" label="开票状态"> 
            <template slot-scope="scope">
              <span :class="scope.row.infoFlag == 1? 'red' : ''">{{
                scope.row.status == 0
                  ? "未开票"
                  : scope.row.status == 1 ? '开票失败' 
                  : scope.row.status == 2 ? '开票成功'
                  : scope.row.status == 3 ? '开票中'
                  : '准备开票'
              }}</span>
              
            </template>
          </el-table-column>
          <el-table-column prop="failCause" label="失败原因">
            <template slot-scope="scope">
              <span :class="scope.row.infoFlag == 1? 'red' : ''">{{scope.row.failCause}}</span>
            </template>  </el-table-column>
          <!-- <el-table-column prop="date" label="抄报状态"></el-table-column> -->
          <el-table-column prop="address" label="操作" width="120" fixed="right">
            <template slot-scope="scope">
              <span class="moverBlack" @click="editInvoice(scope.row)">修改</span>
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
              {{scope.row.goodsShortName == '' ? '请手动赋码' : scope.row.goodsShortName}}
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
        <el-table-column
          prop="goodsAmount"
          label="金额"
        ></el-table-column>
        <el-table-column prop="taxRate" label="税率">
          <template slot-scope="scope">
            {{parseFloat(scope.row.taxRate * 100) + '%'}}
          </template> </el-table-column>
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
    <el-dialog
      title="模板下载"
      :visible.sync="dialogFormVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item label="模板名称">
          <el-select placeholder="请选择活动区域" v-model="templateId">
            <el-option
              v-for="item in invoiceListTemplate"
              :key="item.id"
              :label="item.templateName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureDownloadTemplate"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 导入按钮对话框 -->
    <el-dialog
      title="开票文件导入"
      :visible.sync="importDialogVisible"
      width="width"
      :close-on-click-modal="false"
    >
      <el-form label-suffix=":">
        <el-form-item label="模板类型">
          <el-select v-model="templateId" placeholder="请选择">
            <el-option
              v-for="item in invoiceListTemplate"
              :key="item.id"
              :label="item.templateName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择文件">
          <el-upload
            ref="upload"
            :file-list="fileList"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :http-request="uploadFile"
            :auto-upload="false"
            action=""
          >
            <el-button size="small" plain>上传文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancelUploadFun">取 消</el-button>
        <el-button type="primary" @click="uploadFile">确 定</el-button>
      </div>
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
      :ifShow='true'
      @updateGoods="updateGoods"
    />
  </div>
</template>


<script type="text/ecmascript-6">
import request from "@/utils/request";
import Listnodate from "@/components/ListNoDate";
import { downloadFile } from "@/utils/function.js";
import { UtilsGetTicketType } from "@/utils/function";
import Breadnav from "@/components/Breadnav";
import SelectTaxEncode from "@/views/home/components/SelectTaxEncode";
import {
  getTaskConfig,
  addTaskConfig,
  updateRead,
  updateStatus,
} from "@/api/awaitListApi.js";
import { getInvoicingTypeDetail } from "@/api/lightInvoicing.js";
export default {
  name: "inventoryInvoicing",
  components: { Listnodate, SelectTaxEncode, Breadnav },
  data() {
    return {
      title: "清单开票",
      invoiceType: [{
        label: '全部类型',
        value: ''
      }],
      invoiceVal: "",
      keyword: '',
      queryWord: '',
      goodsDetailVisible: false,
      multipleSelection: [],
      goodsSelection: [],
      goodsDetailtableData: [],
      tableData: [],
      dialogFormVisible: false,
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      templateType: "",
      invoiceListTemplate: [],
      searchInvoiceType: '',
      noDateFlag: "successNoDate",
      templateId: "",
      taxDiskNum: "",
      ids: [],
      selectTaxEncodeVisibility: false,
      importDialogVisible: false,
      fileList: [],
      checkedSeries: "",
      continue: true,
      executeVisible: false,
      taskId: "",
      percentage: 0,
      surplusCount: 0,
      totalSuccessCount: 0,
      totalFailCount: 0,
      timeDesc: '',
      invoiceTypeSurplus: [],
      invoiceTypeArr: [],
      ticketType: '',
      currentDetail: {}
    };
  },
  created() {
    this.taxDiskNum = this.$store.state.user.taxDiskNum;
    request({
      url: "company/companyDiskTicketType/getDiskTicketType",
      method: "get",
      params: { taxDiskNum: this.taxDiskNum },
    }).then((res) => {
      this.invoiceType = this.invoiceType.concat(UtilsGetTicketType(res.data.ticketType));
      this.getInvoiceSurplus(res.data.ticketType)
    });
    this.getPage()
    this.ifExecute();
  },
  methods: {
    handleSortChange(val){
      if (val.order == "descending") {
        this.timeDesc = true;
      } else if (val.order == "ascending") {
        this.timeDesc = false;
      } else {
        this.timeDesc = null;
      }
      this.getPage();
    },
    getPage() {
      request({
        url: "server/todo/page",
        method: "post",
        data: {
          taxDiskNum: this.taxDiskNum,
          invoiceType: this.searchInvoiceType,
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          keyword: this.keyword,
          source: 3,
          timeDesc: this.timeDesc
        },
      }).then((res) => {
       
       res.data.records.forEach(
          (item) =>
            (item.invoiceTypeText = UtilsGetTicketType(item.invoiceType)[0].label)
        );
        // let newData = []
        // res.data.records.forEach(item => {
        //   if(item.status == 0 || item.status == 1){
        //     item.invoiceTypeText = UtilsGetTicketType(item.invoiceType)[0].label
        //     newData.push(item)
        //   }
        // })
        this.tableData = res.data.records;
        this.totalCount = res.data.total;
      });
    },
    clickLeft() {
      this.$router.push({ name: "dashboard" });
    },
    searchBykeyword() {
      this.invoiceVal = "";
      this.keyword = this.queryWord
      this.getPage();
    },
    searchByinvoice() {
      this.keyword = "";
      this.currentPage = 1
      this.searchInvoiceType = this.invoiceVal
      this.getPage();
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
    },
    //删除列表数据
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
      this.$confirm('确定要删除吗?', '提示', {
          type: 'warning'
        }).then(() => {
          request({
            url: "server/todo/delete",
            method: "delete",
            params: {
              todoIds: invoicesids.join(","),
            },
          }).then((res) => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.currentPage = 1
              this.getPage();
            }
            else{
              // this.$message({
              //   type: 'error',
              //   message: res.msg
              // })
            }
          });
        }).catch(() => {});
      
    },
    //删除商品
    deleteGoods() {
      if (this.goodsSelection.length == 0) {
        this.$message({
          message: "请选择要删除的数据",
          type: "warning",
        });
        return;
      }
      let invoicesids = [];
      this.goodsSelection.forEach((item) => {
        invoicesids.push(item.id);
      });
      request({
        url: "server/todo/deleteGoods",
        method: "delete",
        data: invoicesids,
   
      }).then(res => {
        if(res.code == 200){
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.updateGoods()
          this.getPage()
        }
        else{
          // this.$message({
          //   type: 'error',
          //   message: res.msg
          // })
        }
      })
    },

    downloadTemplate() {
      request({
        url: "server/invoiceListTemplate/list",
        method: "get",
        params: {
          taxDiskNum: this.taxDiskNum,
        },
      }).then((res) => {
        this.invoiceListTemplate = res.data;
        this.templateId = res.data[0].id
      });
      this.dialogFormVisible = true;
    },

    sureDownloadTemplate() {
      request({
        url: "server/invoiceListTemplateDetailed/downloadTemplate",
        method: "get",
        responseType: "blob",
        headers: {
          showLoading: true,
        },
        params: {
          templateId: this.templateId,
        },
      }).then((res) => {
        downloadFile(res);
      });
      this.dialogFormVisible = false;
    },
    // execute() {
    //   if (this.multipleSelection.length == 0) {
    //     this.$message({
    //       message: "请选择待开票据",
    //       type: "warning",
    //     });
    //     return;
    //   }
    // },

    editInvoice(data) {
      console.log(data)
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
          data.goodsList = this.count(res.data)
          this.$router.push({
            path: "/lightningInvoicing",
            query: {
              List: JSON.stringify({
                complete: data.infoFlag == 0,
                data,
                type: "inventoryInvoicing",
              }),
            },
          });
        }
        else{
          // this.$message({
          //   type: 'error',
          //   message: res.msg
          // })
        }
      });
    },
    //根据金额/数量/单价任意两项算出剩余一项
    count(arr){
      for(let item of arr){
        if(item.goodsAmount == null && item.goodsNumber !== null && item.goodsPrice !== null){
          item.goodsAmount = (item.goodsNumber * item.goodsPrice).toFixed(2)
        }
        else if (item.goodsNumber == null && item.goodsAmount !== null && item.goodsPrice !== null){
          item.goodsNumber = (item.goodsAmount / item.goodsPrice).toFixed(2)
        }
        else if (item.goodsPrice == null && item.goodsAmount !== null && item.goodsNumber !== null){
          item.goodsPrice = (item.goodsAmount / item.goodsNumber).toFixed(2)
        }
      }
      return arr
    },
    goodsDetail(list) {
      this.currentDetail = list
      this.checkedSeries = list.invoiceSeries;
      request({
        url: "server/todo/listGoods",
        method: "get",
        params: {
          invoiceSeries: list.invoiceSeries,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.goodsDetailVisible = true;
          this.goodsDetailtableData = this.count(res.data);
        }
      });
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
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getPage()
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getPage()
    },

    //多选
    handleSelectionChange(val) {
      console.log("选中", val);
      this.multipleSelection = val;
    },

    //导入
    //打开导入弹窗
    importDialog() {
      request({
        url: "server/invoiceListTemplate/list",
        method: "get",
        params: {
          taxDiskNum: this.taxDiskNum,
        },
      }).then((res) => {
        this.invoiceListTemplate = res.data;
        this.templateId = res.data[0].id
      });
      this.importDialogVisible = true;
    },
    handleChange(file) {
      // 上传文件，获取文件流
      this.file = file.raw;
      if(this.fileList.length == 0){
        this.fileList.push(file.raw)
      }
      else{
        this.fileList.splice(0,1,file.raw)
      }
      console.log(this.file);
      console.log(this.fileList)
    },
    handleRemove(){
      this.file = ''
      this.fileList = []
    },
    // 导入excel
    uploadFile() {
      console.log(this.file);
      console.log(this.fileList)
      if (!this.file) {
        this.$message({
          type: "warning",
          message: "请选择文件",
        });
        return;
      } else if (!this.templateId) {
        this.$message({
          type: "warning",
          message: "请选择文件类型",
        });
        return;
      }
      let form = new FormData();
      // 后端接受参数 ，可以接受多个参数,
      form.append("file", this.file);
      // form.append("taxDiskNum", this.taxDiskNum);
      // form.append("templateId ", this.templateId);
      request({
        url: `/server/todo/listing/import?taxDiskNum=${this.taxDiskNum}&templateId=${this.templateId}`,
        method: "post",
        data: form,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          this.importDialogVisible = false;
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "导入成功",
            });
            this.file = ''
            this.fileList = []
            this.currentPage = 1
            this.getPage();
          } 
          else if (res.code == 413){
            this.$message({
              type: "error",
              message: '导入文件过大',
            });
          }
          else {
            // this.$message({
            //   type: "error",
            //   message: res.msg,
            // });
            this.file = ''
            this.fileList = []
          }
        })
        .catch((error) => console.log({ error }));
    },
    //点击取消导入
    cancelUploadFun() {
      this.$refs["upload"].clearFiles();
      this.file = "";
      this.templateId = "";
      this.importDialogVisible = false;
    },

    //跳转闪电开票
    showSelectTaxDialog(val) {
      console.log(val);
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
          let currentDetail = this.currentDetail
          currentDetail.goodsList = res.data
          this.$router.push({
            path: "/lightningInvoicing",
            query: {
              List: JSON.stringify({
                complete: currentDetail.infoFlag == 0,
                data: currentDetail,
                type: "inventoryInvoicing",
              }),
            },
          });
        }
        else{
          // this.$message({
          //   type: 'error',
          //   message: res.msg
          // })
        }
      });

      
      // this.ids.push(val.id);
      // this.selectTaxEncodeVisibility = true;
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
                '请根据错误提示修改信息后,再次操作',
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
            this.currentPage = 1
            this.getPage();
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
    async ifExecute() {
      const res = await getTaskConfig({
        taxDiskNum: this.taxDiskNum,
      });
      if (res.data !== null && res.data.status == 1) {
        if (res.data.totalFailCount !== 0) {
          this.$alert(
            '请根据错误提示修改信息后,再次操作',
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
        this.taskId = res.data.id
        this.executeVisible = true;
        this.setInter(2000, this.getTaskConfig);
      } else {
        return;
      }
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
.blacklist {
  /* padding: 0 25px; */
  box-sizing: border-box;
  background-color: #ffffff;
}
.borderBottom{
  padding: 0 25px;
}

.moverBlack {
  font-size: 14px;
  font-weight: 400;
  color: #1890ff;
  cursor: pointer;
}

.red{
  color: red;
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

.blacklist >>> .el-dialog__header {
  border-bottom: 1px solid #ddd;
}
</style>

