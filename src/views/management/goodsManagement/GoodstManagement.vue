<template>
  <div class="goodsManager">
    <div class="borderBottom navBox">
      <breadnav :textTitle="navTitle" @leftEvent="clickLeft" />
      <div class="rightNavBox">
        <div class="rightNav" @click="goToPage('1')">
          <img src="@/assets/goods/plfm_slices/plfm.png" alt="图片" class="navImg" />
          <span class="navTex">批量赋码</span>
        </div>
        <div class="rightNav" @click="goToPage('2')">
          <img src="@/assets/goods/import_slices/import.png" alt="图片" class="navImg" />
          <span class="navTex">导入</span>
        </div>
        <div class="rightNav" @click="goToPage('3')">
          <img src="@/assets/goods/export_slices/export.png" alt="图片" class="navImg" />
          
          <span class="navTex">导出</span>
        </div>
        <div class="rightNav" @click="goToPage('4')">
          <img src="@/assets/goods/taxCode_slices/taxCode.png" alt="图片" class="navImg" />
          <span class="navTex">税收编码</span>
        </div>
        <div class="rightNav" @click="goToPage('5')">
          <img src="@/assets/goods/delete_slices/delete.png" alt="图片" class="navImg" />
          <span class="navTex">删除</span>
        </div>
        <div class="rightNav" @click="goToPage('6')">
          <img src="@/assets/goods/download_slices/download.png" alt="图片" class="navImg" />
          <span class="navTex">模板下载</span>
        </div>
        <el-button type="primary" @click="addGoods">新增</el-button>
      </div>
    </div>
    <div class="clearfix">
      <div class="page-left">
        <el-row class="page-content">
          <el-col :span="24" class="left">
            <el-row>
              <el-col :span="8">
                <el-button type="text" @click="addGoodsTypeFun">新增</el-button>
              </el-col>
              <el-col :span="8">
                <el-button type="text" @click="editGoodsTypeFun">修改</el-button>
              </el-col>
              <el-col :span="8">
                <el-button type="text" @click="detailGoodsTypeFun">删除</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-tree ref="tree" class="tree" :props="defaultProps" node-key="id" :default-expanded-keys="['1']" :data="treelist" @node-click="handleNodeClick" :highlight-current='true'>
                <span class="span-ellipsis" slot-scope="{node}">
  		              <span :title="node.label">{{ node.label }}</span>
                </span>
              </el-tree>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <div class="page-right">
        <div>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form ref="searchone" :model="searchForm" class="pr24">
                <el-form-item prop="keyword">
                  <el-input size="medium" placeholder="请输入" v-model.trim="searchForm.keyword" class="input-with-select">
                    <el-button slot="append" @click="searchFun">搜索</el-button>
                  </el-input>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="4">
              <el-select size="medium" v-model="codeStatus" placeholder="请选择">
                <el-option v-for="item in codeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" @click="searchTypeFun">查询</el-button>
            </el-col>
          </el-row>
          <el-row style="margin-top: 17px">
            <el-col>
              <el-row>
                <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                  <div slot="empty">
                    <listnodate :tableFlag="noDateFlag" />
                  </div>
                  <el-table-column type="selection" width="55">
                  </el-table-column>
                  <el-table-column prop="goodsName" label="商品名称" width="180"></el-table-column>
                  <el-table-column prop="taxClassificationShortName" label="税收分类简称" width="180"></el-table-column>
                  <el-table-column prop="taxClassificationCode" label="税收分类编码" width="180" show-overflow-tooltip></el-table-column>
                  <el-table-column label="税率" width="180" show-overflow-tooltip>
                    <template slot-scope="scope">{{parseFloat((scope.row.taxRate*100).toPrecision(12))}}%
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="specifications"
                    label="规格型号"
                    width="180"
                    show-overflow-tooltip
                  ></el-table-column>
                  <el-table-column
                    prop="unit"
                    label="计量单位"
                    width="150"
                    show-overflow-tooltip
                  ></el-table-column>
                  <el-table-column
                    prop="goodsPrice"
                    label="单价"
                    width="150"
                    show-overflow-tooltip
                  ></el-table-column>
                   <el-table-column prop="taxLogo"  label="是否含税" width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                      {{scope.row.taxLogo|taxlogtype}}
                    </template>
                  </el-table-column>
                  <el-table-column  label="免税类型"  width="180" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.zeroTaxMarks|trans}}
                  </template>
                  </el-table-column>
                  <el-table-column  label="优惠政策类型"  width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                      {{scope.row.incentivesLabel|incent}}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="100" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="editHandle(scope.row, '1')">
                      修改</el-button>
                    <el-button size="mini" type="text" @click="copyHandle(scope.row, '1')">复制</el-button>
                  </template>
                   </el-table-column>
                </el-table>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div class="paginBox">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100, 200]"
            layout="total, sizes, prev, pager, next, jumper"
            background
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 新增/修改商品分类弹窗 -->
    <el-dialog
      :title="goodsTypeTitle"
      :visible.sync="updateVisibility"
      :before-close="goodTypeCancelFun"
      :close-on-click-modal="false"
    >
      <el-form
        :model="sortForm"
        :rules="rulesSortForm"
         ref="sortForm"
        label-width="150px"
        width="'70%'"
      >
        <el-form-item label="商品类别名称" prop="name">
        <el-input  v-model.trim="sortForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属类别:">
          {{ this.name }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="goodTypeCancelFun">取 消</el-button>
        <el-button type="primary" @click="goodTypeSaveFun">保存</el-button>
      </div>
    </el-dialog>

    <!-- 新增/修改商品信息对弹窗 -->
    <el-dialog
      :title="addOrUpdateTitle"
      :visible.sync="goodsVisibility"
      :before-close="addOrUpdatehandleClose"
      :close-on-click-modal="false"
       width="730px"   
    >
      <el-form
        :model="form"
        label-suffix=":"
        ref="form"
        :rules="newform"
        label-width="120px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品名称" prop="goodsName">
              <el-input
                v-model="form.goodsName"
                placeholder="请填写商品名称"
                @keydown.native="keydown($event)" 
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  label="商品类别"  prop="typeIdName">
                <!-- {{ this.name }} -->
              <el-input v-model="form.typeIdName" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税收分类编码" prop="taxClassificationCode">
              <el-input
                v-model="form.taxClassificationCode"
                :disabled="true"
                placeholder="请选择税收分类编码"
              >
                <el-button
                  slot="append"
                  icon="el-icon-folder-opened"
                  @click="goToCodeFun"
                ></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="税收分类简称"
               prop="taxClassificationShortName"
            >
              <el-input
                v-model="form.taxClassificationShortName"
                autocomplete="off"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="税率" prop="taxRate">
              <el-select v-model="form.taxRate" :disabled="!!this.form.zeroTaxMarks" placeholder="请选择税率">
                <el-option
                  v-for="(item,index) in taxRateOptions" :key="index"  
                  :label="item.label"
                  :value="item.value" 
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否含税" prop="taxLogo">
              
              <el-select v-model="form.taxLogo" placeholder="请选择是否含税">
                <el-option
                  v-for="item in taxOptions" 
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单价" prop="goodsPrice">
              <el-input
                v-model.trim="form.goodsPrice"
                autocomplete="off"
                placeholder="请填写单价"
                type="number"
                @keydown.native="channelInputLimit"
                v-on:input="watchprice()"
                >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格型号" prop="specifications">
              <el-input
                v-model.trim="form.specifications"
                autocomplete="off"
                placeholder="请填写规格型号"
               @keydown.native="keydown($event)"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="计量单位" prop="unit">
              <el-input
                v-model.trim="form.unit"
                autocomplete="off"
                placeholder="请填写计量单位"
                @keydown.native="keydown($event)"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="免税类型">
              <el-select v-model="form.zeroTaxMarks" @change="taxType" placeholder="请选择免税类型">
                <el-option
                  v-for="item in dutyFreeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="优惠政策类型"> 
              <el-select v-model="form.incentivesLabel" placeholder="请选择" >
                <el-option
                  v-for="item in favouredPolicyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="intelligenceCodeFun">智能赋码</el-button
        >
        <el-button type="primary"  @click="save('form')">保存</el-button>
      </div>
    </el-dialog>

    <!-- 导入按钮对话框 -->
    <el-dialog
       title="商品导入"
       :visible.sync="importDialogVisibility"
       width="width"
    >
      <el-form :model="uploadForm" label-suffix=":">
        <el-form-item label="文件类型">
          <el-select v-model="uploadForm.fileType" placeholder="请选择">
            <el-option
              v-for="item in fileTypeOptions"
             :key="item.value"
             :label="item.label"
             :value="item.value"
            >
            </el-option>
          </el-select>
          </el-form-item>
            <el-form-item label="选择文件">
              <el-upload
                class="upload-demo"
                action=""
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :http-request="importFileFun"
                :auto-upload="false"
                accept=".xls,.txt,.xml,.xlsx"
                :on-change="handleChange"
                :show-file-list="showFileList"
                ref="upload"
          >
           <el-button size="small" plain>上传文件</el-button>
          </el-upload>
           <span class="tipsImport">{{this.fileList.length == 0 ? '未选择任何文件' : ''}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancelUploadFun">取 消</el-button>
        <el-button type="primary" @click="importFileFun">确 定</el-button>
      </div>
     </el-dialog>
     <!-- 导入结果弹窗 -->
        <el-dialog :visible.sync="importResultVisible">
          <el-row>
            <el-col :span="4"
              ><i class="el-icon-success resultIcon"></i
            ></el-col>
            <el-col :span="20"><span class="resultText">导入成功</span></el-col>
          </el-row>

          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="importResultVisible = false"
              >确定</el-button
            >
          </div>
        </el-dialog>
        <!-- 手动赋码 -->
        <select-tax-encode
        :visible.sync="TaxEncodeVisibility"
        :ids="ids"
        :ifShow='ifShow'
        :ifGoodsController='true'
        :ifGetData='ifGetData'
        @updateGoods="updateGoods"
        @getDetail='getDetail'
    />
  
  </div>
</template>

<script>
  import Vue from 'vue'
  import Breadnav from "@/components/Breadnav";
  import Listnodate from "@/components/ListNoDate";
  import {
    downloadFile,
    checkNum
  } from "@/utils/function.js";
  import {
    validStrCheckLengthGoods,
    validStrCheckLength,
  } from "@/utils/validate";
  
  import SelectTaxEncode from "@/views/home/components/SelectTaxEncode";

  import {
    getGoodslistPage,
    addListApi,
    delGoodsApi,
    updateListApi,
    getTreelistApi,
    addTreeListApi,
    updateTreeListApi,
    delTreeListApi,
    exportGoods,
    SmartCode,
    getDiskTicketTypeApi,
    getTreelistAllApi
  } from "@/api/GoodsManagement.js";

  import request from "@/utils/request";

  import preventClick from "@/utils/controlClickState";

   Vue.use(preventClick);
  import {
    number
  } from 'echarts';

  export default {
    name: "ProductManagement",
    components: {
      Listnodate,
      Breadnav,
      SelectTaxEncode,
     
    },
    data() {
      const validateSearchText = (rule, value, callback) => {
        if (value&&!validStrCheckLengthGoods(value, 41)) {
          callback(new Error("最多可以输入40位汉字或字符"));
        } else {
          callback();
        }
      };
      const validateSearchText1 = (rule, value, callback) => {
        if (value&&!validStrCheckLength(value, 31)) {
          callback(new Error("最多可以输入30位汉字或字符"));
        } else {
          callback();
        }
      };
     
      const validateSearchText3 = (rule, value, callback) => {
        if (value&&!validStrCheckLength(value, 41)) {
          callback(new Error("最多输入40位汉字或字符"));
        } else {
          callback();
        }
      };
      return {
        navTitle: "商品管理",
        //分页
        currentPage: 1, //当前是第几页
        total: 0, //总条目数
        pageSizeNum: 10, //一页显示多少条
        //搜索
        searchForm: {
          keyword: "",
        },
        multipleSelection: [], //多选的数据
        importDialogVisibility: false,
        //商品分类弹出框
        addOrEidtGoodsTypeFlag: 0, //0是新增，1是编辑
        goodsTypeTitle: "新增商品类别",
        updateVisibility: false,
        sortForm: {
          name: "",
        },
        name:"",
        //新增类别name校验
        rulesSortForm: {
          name: [{
            required: true,
            message: "最多可以输入40位汉字或字符",
            trigger: "blur",
            validator: validateSearchText3
          }],
        },
        GoodsExport: "", //商品导出
        // 选择树
        treelist: [],
        defaultProps: {
          children: "children",
          label: "label",
        },
        goodsTypeSelectDate: {
          id: null,
          label: "商品类别",
          parentId: 1,
          children: [],
        },
        checkedId: "", //实现单选
        codeStatus: '00',
        codeOptions: [{
            value: "00",
            label: "全部商品",
          },
          {
            value: "0",
            label: "未赋码",
          },
          {
            value: "1",
            label: "已赋码",
          },
        ],
        fileList: [],
        taxDiskNum: "", // 盘号
        data: [],
        intellList: [], //智能赋码返回数据
        checked: {
          id: "1",
          name: "商品类别",
          parentId:1,
          level: 1,
        },
        importResultVisible: false,
        importResult: true,
        dialogImageUrl: "",
        //表格数据
        tableData: [],
        noDateFlag: "successNoDate",
        selectedTableData: [], //选择表格中的多选框的数据
        // 商品信息弹出框
        goodsVisibility: false,
        addOrUpdateTitle: "新增商品信息",
        goodlistAddOrEditFlag: "0", //0新增商品弹窗 1修改商品弹窗  ,2是复制
        // 弹窗表单参数
        form: {},
        // 表单验证
        newform: {
          goodsName: [{
              required: true,
              message: "商品名称不能为空",
              trigger: "blur",
            },
            {
              validator: validateSearchText
            },
          ],
          taxClassificationCode: [{
            required: true,
            message: '税收分类编码不能为空',
            trigger: 'change'
          }],
          taxClassificationShortName: [{
            required: true,
            message: '税收编码简称不能为空',
            trigger: 'change'
          }],
          taxRate: [{
            required: true,
            message: "税率不能为空",
            trigger: 'change'
          }],
          taxLogo: [{
            required: true,
            message: "请选择",
            trigger: "blur"
          }],
          goodsPrice: [{
            required: false,
            trigger: "blur",
            message: "最多可以输入20位数字(包含小数点)且最多输入8位小数",
          }, ],
          specifications: [{
            required: false,
            trigger: "blur",
            message: "最多可以输入40个汉字或字符",
            validator: validateSearchText3
          }, ],
          unit: [{
            required: false,
            trigger: "blur",
            message: "最多只能输入30位汉字或字符",
            validator: validateSearchText1
          }, ],
        },
        taxRateOptions: [{
            value: 0.0,
            label: "0%",
          },
          {
            value: 0.01,
            label: '1% ',
          },
          {
            value: 0.02,
            label: "2%",
          },
          {
            value: 0.03,
            label: "3%",
          },
          {
            value: 0.05,
            label: "5%",
          },
          {
            value: 0.06,
            label: "6%",
          },
          {
            value: 0.09,
            label: "9%",
          },
          {
            value: 0.13,
            label: "13%",
          },
        ],
        //零税率标识，空代表正常税率 1 出口免税和其他免税优惠政策（免税） 2 不征增值税（不征税） 3 普通零税率（0%）
        dutyFreeOptions: [{
            value: "", //空代表正常税率
            label: "正常税率",
          },
          {
            value: "1",
            label: "出口免税和其他免税优惠政策",
          },
          {
            value: "2",
            label: "不征增值税",
          },
          {
            value: "3",
            label: "普通零税率",
          },
        ],
        taxOptions: [{
            value: "0",
            label: "否",
          },
          {
            value: "1",
            label: "是",
          },
        ],
        favouredPolicyOptions: [{
            value: "",
            label: "不使用优惠政策",
          },
          {
            value: "不征税",
            label: "不征税",
          },
          {
            value: "免税",
            label: "免税",
          },
          {
            value: "先征后退",
            label: "先征后退",
          },
          {
            value: "100%先征后退",
            label: "100%先征后退",
          },
          {
            value: "50%先征后退",
            label: "50%先征后退",
          },
          {
            value: "简易征收",
            label: "简易征收",
          },
          {
            value: "即征即退30%",
            label: "即征即退30%",
          },
          {
            value: "即征即退50%",
            label: "即征即退50%",
          },
          {
            value: "即征即退70%",
            label: "即征即退70%",
          },
          {
            value: "即征即退100%",
            label: "即征即退100%",
          },
          {
            value: "超税负3%即征即退",
            label: "超税负3%即征即退",
          },
          {
            value: "稀土产品",
            label: "稀土产品",
          },
          {
            value: "超税负8%即征即退",
            label: "超税负8%即征即退",
          },
          {
            value: "按5%简易征收减按1.5%计征",
            label: "按5%简易征收减按1.5%计征",
          },
          {
            value: "按5%简易征收",
            label: "按5%简易征收",
          },
          {
            value: "按3%简易征收",
            label: "按3%简易征收",
          },
          {
            value: "超税负12%即征即退",
            label: "超税负12%即征即退",
          },
        ],
        improtDialogVisible: false, //打开导入弹窗
        importResult: true,
        showFileList: false, //导入
        fileList: [],
        file: null,
        uploadForm: {
          fileType: "0",
        },
        fileTypeOptions: [{
            value: "0",
            label: "xls",
          },
          {
            value: "1",
            label: "txt",
          },
          {
            value: "2",
            label: "xml",
          },
          {
            value: "3",
            label: "xlsx",
          },
        ],
        // 盘号
        taxDiskNum: "",
        intellList: [], //智能赋码返回数据
        outerDefaultId: '', //最外层的默认id
        name: "",
        TaxEncodeVisibility: false,
        FileProgress:false,
        ids: [],
        ifShow: false,
        ifGoodsController: false,
        ifGetData: false
      };
    },
    created() {},
    mounted() {
      this.taxDiskNum = this.$store.state.user.taxDiskInfo.taxDiskNum ? this.$store.state.user.taxDiskInfo.taxDiskNum : '';
      this.getGoodsList(null, 1, null); //商品信息分页查询 关键字，当前页，是否赋码，分类id
      this.getTreeList();
      this.getTreeAllList();
    },
    computed: {
      taxDiskNumChange() {
        return this.$store.state.user.taxDiskNum;
      },
    },
    watch: {
      taxDiskNumChange: {
        handler: function(newval, oldval) {
          if (newval !== oldval) {
            this.taxDiskNum = newval;
            this.getDiskTicketType();
          }
        },
        deep: true,
      },
    },
    filters: {
      trans(row) {
        let typeObj = {
          'null': '正常税率',
          '1': '出口免税和其他免税优惠政策（免税）',
          '2': '不征增值税',
          '3': '普通零税率（0%）',
        }
        return typeObj[row] || '正常税率'
      },
      incent(row) {
        let typeObj = {
          'null': '不使用优惠政策',
          "不征税": '不征税',
          "免税": "免税",
          '先征后退': '先征后退',
          '100%先征后退': '100%先征后退',
          '50%先征后退': '50%先征后退',
          '简易征收': '简易征收',
          '即征即退30%': '即征即退30%',
          '即征即退50%': '即征即退50%',
          '即征即退70%': '即征即退70%',
          '即征即退100%': '即征即退100%',
          '超税负3%即征即退': '超税负3%即征即退',
          '稀土产品': '稀土产品',
          '超税负8%即征即退': '超税负8%即征即退',
          '按5%简易征收减按1.5%计征': '按5%简易征收减按1.5%计征',
          '按5%简易征收': '按5%简易征收',
          '按3%简易征收': '按3%简易征收',
          '超税负12%即征即退': '超税负12%即征即退'
        }
        return typeObj[row] || '不使用优惠政策'
      },
      taxlogtype(row) {
        let typeObj = {
          '0': '不含税',
          '1': '含税'
        }
        return typeObj[row] || '不含税'
      },
    },
    methods: {
channelInputLimit (e) {
  console.log(e)
      let key = e.key
      // 不允许输入'e'和'.'
      if (key === 'e' || key === '-') {
        e.returnValue = false
        return false
      }
      return true
    },
        //查找选中的ID对应的label
    getTreeData(data, path=[]) {
      for(let item of data){
        if(item.hasOwnProperty('children')){
          path.push({id: item.id, label: item.label})
          this.getTreeData(item.children, path)
        }
        else{
          path.push({id: item.id, label: item.label})
        }
      }
      return path;
    },


      //商品名称-单价校验
      watchprice() {
        let str = checkNum(this.form.goodsPrice, 9, 8);
        this.form.goodsPrice = str
      },
      // 禁止输入空格
      keydown(e) {
        if (e.keyCode == 32) {
          e.returnValue = false
        }
      },
      //判断税率
      taxType(val, flag) {
        //非正常税率情况下
        if (val!= "" && flag) {
          if (!this.form.zeroTaxMarks) {
            this.form.taxRate = val 
          } else {
            this.form.taxRate = 0.0
          }
        } else {
          this.form.taxRate = 0.0
        }
      },
      //手动赋码
      getDetail(val) {
        this.form.taxClassificationCode = val.goodsCode
        this.form.taxClassificationShortName = val.goodsShortName
        if (val.taxRateNum) {
          var strrate = String(val.taxRateNum)
          if (strrate.indexOf('、') > -1) {
            this.form.taxRate = Number(strrate.split('、')[0])
          } else {
            this.form.taxRate = Number(val.taxRateNum)
          }
        } else {
          this.form.taxRate = Number('0.0')
        }
      },
      //含税判断
      playbackFormat(row, column) {
        if (row.playback === 1) {
          return '含税'
        } else {
          return '不含税'
        }
      },
      clickLeft() {
        this.$router.push({
          name: "managementIndex"
        });
      },
      //赋码后查询列表
      updateGoods() {
        this.getGoodsList();
      },
      // 根据税盘信息获取票种类型
      getDiskTicketType() {
        let applyParams = {
          taxDiskNum: this.taxDiskNum,
        };
        getDiskTicketTypeApi(applyParams)
          .then((response) => {
            this.typeOptions = UtilsGetTicketType(response.data.ticketType);
          })
          .catch((error) => {});
      },
      //右上角的导航
        goToPage(val) {
        if (val == "1") {
          if (this.selectedTableData.length == 0 && this.tableData.length > 0) {
            this.$message({
              message: "请选择要批量赋码的商品",
              type: "warning",
            });
          } else if (this.tableData.length == 0) {
            this.$message({
              message: "没有找到要批量赋码的商品",
              type: "warning",
            });
          } else if (this.selectedTableData.length > 0 && this.tableData.length > 0) {
            this.TaxEncodeVisibility = true; //打卡弹窗
            this.ifShow = true; //是否有选择
            this.ifGetData = false; //是否调接口
          }
        } else if (val == "2") {
          //导入
          this.importDialogVisibility = true;
        } else if (val == "3") {
          //导出
          var data = {
            selectType: 2,
            file: "",
            taxDiskNum: this.taxDiskNum,
            typeId: this.checked.id,
          };
          exportGoods(data).then((response) => {
            downloadFile(response);
          });
        } else if (val == "4") {
          //税收编码
          this.TaxEncodeVisibility = true;
          this.ifShow = false;
        } else if (val == "5") {
          //删除
          if (this.selectedTableData.length == 0 && this.tableData.length == 0) {
            return
          } else if (this.selectedTableData.length == 0 && this.tableData.length !== 0) {
            this.$message({
              type: "info",
              message: "请选择数据",
            });
            return
          }
          this.$confirm("你确定要删除吗?", "提示", {
              type: "warning",
            })
            .then(() => {
              this.handelDelete().then(() => {
                this.$refs.multipleTable.clearSelection();
              });
            })
            .catch(() => {});
        } else if (val == "6") {
          //模板下载
          var data = {
            selectType: 1,
            file: "",
            taxDiskNum: this.taxDiskNum,
            typeId: this.checked.id,
          };
          exportGoods(data).then((response) => {
            downloadFile(response);
          });
        }
      },
      handleChange(file, fileList) {
        if (fileList.length > 1) {
          fileList.splice(0, 1)
        }
        let reg = file.name.split('.').pop();
        if (this.fileTypeOptions[this.uploadForm.fileType].label !== reg) {
          this.$message({
            type: 'warning',
            message: `请选择${this.fileTypeOptions[this.uploadForm.fileType].label}格式文件`
          })
          fileList.splice(0, 1)
          this.showFileList = false
          return
        } else {
          this.fileList = fileList
          this.showFileList = true
          console.log(fileList)
        }
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      //点击搜索按钮
      searchFun() {
        this.codeStatus = '00'
        this.getGoodsList(this.searchForm.keyword, 1, null); //关键字，当前页，是否赋码
      },
      //查询按钮事件
      searchTypeFun() {
         this.searchForm.keyword = "";
         this.getGoodsList(null, 1, this.codeStatus);
      },
      
      //左侧树数据获取数据
      getTreeList() {
        let params = {
          taxDiskNumber: this.taxDiskNum,
        };
        getTreelistApi(params).then((response) => {
          if (response && response.code == "200") {
            this.treelist = response.data;
            this.$nextTick(()=>{
              this.$refs.tree.setCurrentKey('1')
            })
            //         this.checked.id =this.treelist.id;
            //  el       this.checked.name =this.treelist[0].lab
          }
        });
      },

     //左侧树数据所有获取数据
      getTreeAllList() {
        let params = {
          taxDiskNumber: this.taxDiskNum,
        };
        getTreelistAllApi(params).then((response) => {
          if (response && response.code == "200") {
            this.dataAll = response.data;
            console.log( this.dataAll);
            //         this.checked.id =this.treelist.id;
            //  el       this.checked.name =this.treelist[0].lab
          }
        });
      },

      //节点被点击时候的回调（展开）
      handleNodeClick(data) {
        console.log(data);
        this.checked.id = data.id;
        this.checked.name = data.label;
        this.checked.parentId = data.id;
        this.checked.level = data.level;
        this.name = data.label;
        this.getGoodsList(
          this.searchForm.keyword,
          1,
          this.codeStatus,
          data.id == '1' ? '' : data.id
        ); //关键字，当前页，是否赋码
      },
      //表格选择框
      handleSelectionChange(data) {
        this.selectedTableData = data;
        var arr = [];
        for (let i = 0; i < data.length; i++) {
          arr.push(data[i].id);
        }
        this.ids = arr;
      },
      // 分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSizeNum = val;
        this.getGoodsList(
          this.searchForm.keyword, 1, this.codeStatus
        );
        // this.getGoodsList(
        //   null,null,null,
        //   val,
        //   this.codeStatus
        // );
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getGoodsList(this.searchForm.keyword, val, this.codeStatus,this.checked.id);
      },
      // 商品信息分页查询 关键字，当前页，是否赋码
      getGoodsList(keyword, pageNum, isCoding) {
        this.currentPage = pageNum || 1
        // this.tableData = []; //
        let goodsParams = {
          isCoding: isCoding == "00" ? null : isCoding, //是否赋码:0.未赋码 1.已赋码
          keyword: keyword, //关键字
          pageNum: pageNum, //当前页码 第一页是1
          pageSize: this.pageSizeNum, //每页几条
          taxDiskNumber: this.taxDiskNum,
          timeDesc: true,
          typeId: this.checked.id == this.outerDefaultId ? '' : this.checked.id, //所属分类id
        };
          getGoodslistPage(goodsParams) .then((response) => {
          if (response && response.code == "200") {
              response.data.records.forEach(item => {
                if(item.goodsPrice!==null){
                  item.goodsPrice = this.toNonExponential(item.goodsPrice)
                }    
              })
              this.tableData = response.data.records;
              this.total = response.data.total;
           }
        })
        .catch((error) => {
          this.loading = false;
          this.noDateFlag = "err";
        }); 
      },
      //商品类型新增按钮
      addGoodsTypeFun(value) {
  
        this.addOrEidtGoodsTypeFlag = 0; //新增
        this.goodsTypeTitle = "新增商品类别";
         if (this.checked.id == "") {
          this.name = '商品类别'
        }
        else{
              let findParentResult = this.dataAll.find(item => {
               return item.id == this.checked.id
              })
           this.name = findParentResult.typeName
        }
        this.sortForm.name = ''
        this.updateVisibility = true;
      },
      goodTypeSaveFun() {
        this.$refs["sortForm"].validate((valid) => {
          if (valid) {
            this.addOrEidtGoodsTypeFlag == 0 ?
              this.addTreeListAjax() :
              this.updateTreeListAjax();
          } else {
            return false;
          }
        });
      },
      //取消新增类别
      goodTypeCancelFun(value) {
        this.updateVisibility = false;
        this.$refs["sortForm"].resetFields();
      },
      //商品类型修改按钮
      editGoodsTypeFun() {

        if (this.checked.id === "") {
          this.$message({
            type: "info",
            message: "未选择任何数据",
          });
          return
        } else if (this.checked.id == "1") {
          this.$message({
            type: 'info',
            message: '不能修改一级商品类别'
          })
          return
        }
        else{
          let findResult = this.dataAll.find(item => {
           return item.id == this.dataAll.find(item => {
          return item.id == this.checked.id
          }).parentId
         })
          this.name = findResult.typeName
          this.sortForm.name = this.checked.name
        }
        this.addOrEidtGoodsTypeFlag = 1; //修改
        this.goodsTypeTitle = "修改商品类别";
        this.updateVisibility = true;
      },
      //商品类型删除按钮
      detailGoodsTypeFun() {
       
        if (this.checked.id == "") {
          this.$message({
            type: "info",
            message: "未选择任何数据",
          });
          return;
        } else if (this.checked.id === "1") {
          this.$message({
            type: "info",
            message: "不能删除一级商品类别",
          });
          return;
        } else {
          this.$confirm("一旦删除，该类别下的所有子类别和商品都将删除，你确定删除吗？", "提示", {
            type: "warning",
          }).then(() => {
            this.delTreeListAjax();
          });
        }
      },
      //新增商品类型ajax
      addTreeListAjax() {
        if (this.sortForm.name == "") {
          this.$message({
            type: "info",
            message: "请输入名称",
          });
          return;
        }
        if (this.goodsTypeTitle == "新增商品类别") {
          if (this.checked.level + 1 > 3) {
            this.$message({
              type: "info",
              message: "子类别不能超过三级！",
            });
            return;
          } else {
            let addGoodsType = {
              parentId: this.checked.parentId,//父分类id
              taxDiskNumber: this.taxDiskNum,
              typeName: this.sortForm.name, //分类名称(新增必传)
              level: this.checked.level + 1,
            };
            addTreeListApi(addGoodsType).then((response) => {
              if (response && response.code == "200") {
                this.checked.id = "";
                this.checked.name = "";
                this.checked.level = 1;
                this.checked.parentId=1;
                this.updateVisibility = false;
                this.getTreeList();
                this.getTreeAllList();
               
                this.name = "商品类别";
                this.$refs["sortForm"].resetFields();
                this.$message({
                  message: "新增成功",
                  type: "success",
                });
              }
            });
          };
        }
      },
      //取消新增类别
      addOrUpdatehandleClose() {
        this.goodsVisibility = false;
        // this.$refs["form"].resetFields();
      },
      //修改商品类型ajax
      updateTreeListAjax() {
        let editGoodsType = {
          id: this.checked.id, //分类id,新增不用传，更新必传
          taxDiskNumber: this.taxDiskNum,
          typeName: this.sortForm.name, //分类名称(新增必传)
        };
        if (this.sortForm.name == "") {
          this.$message({
            message: "商品类型不能为空",
            type: "warning",
          });
        } else {
          updateTreeListApi(editGoodsType).then((response) => {
            if (response && response.code == "200") {
              this.checked.id = "";
              this.checked.name = "";
              this.checked.level = 1;
              this.checked.parentId = 1
                this.$message({
                message: "修改成功",
                type: "success",
              });
             
              this.getTreeList();
              this.getTreeAllList();
              this.$refs["sortForm"].resetFields();
              this.updateVisibility = false;
              this.name = "商品类别";
            }
          });
        }
      },
      //删除商品类型ajax
      delTreeListAjax() {
        delTreeListApi(this.checked.id).then((response) => {
          if (response && response.code == "200") {
            this.checked.id = '1';
            this.checked.name = '商品类别';
            this.checked.parentId = '1';
            this.checked.level = 1;
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getTreeList();
            this.getTreeAllList();
            this.getGoodsList(null, 1, null);
            this.updateVisibility = false;
          }
        });
      },
      //点击取消导入
      cancelUploadFun() {
        this.$refs["upload"].clearFiles();
        this.fileList = []
        this.importDialogVisibility = false;
      },
      //导入文件
      importFileFun() {
        if (this.fileList.length == 0 || this.showFileList == false) {
          this.$message({
            type: 'info',
            message: '请先选择文件！'
          })
          return
        }
        let reg = this.fileList[0].name.split('.').pop();
        if (this.fileTypeOptions[this.uploadForm.fileType].label !== reg) {
          this.$message({
            type: 'warning',
            message: '文件与类型不一致'
          })
          fileList.splice(0, 1)
        }
        for (let i = 0; i < this.fileList.length; i++) {
          var form = new FormData();
          form.append("file", this.fileList[i].raw);
          form.append("taxDiskNum", this.taxDiskNum);
          form.append("typeId", this.checked.id);
          request({
              url: "/company/companyGoods/importExcel",
              method: "post",
              data: form,
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              if (res.code == 200) {
                this.$refs["upload"].clearFiles();
                this.importDialogVisibility = false;
                this.fileList = []
                this.$alert(`本次共导入${res.data}商品`, "导入成功！", {
                  confirmButtonText: "确定",
                  type: "success",
                  center: true,
                });
               
                this.getGoodsList(null, 1, null, null);
                this.$refs["upload"].clearFiles();
              } else {
                
              }
              this.$refs["upload"].clearFiles();
            })
            .catch((error) => (this.importResultVisible = true));
        }
      },
      handleError() {
        this.$notify.error({
          title: "上传失败",
          message: "文件上传失败",
        });
      },
      handleChange(file, fileList) {
        console.log(file)
        if (fileList.length > 1) {
          fileList.splice(0, 1)
        }
        let reg = file.name.split('.').pop();
        if (this.fileTypeOptions[this.uploadForm.fileType].label !== reg) {
          this.$message({
            type: 'warning',
            message: `请选择${this.fileTypeOptions[this.uploadForm.fileType].label}格式文件`
          })
          fileList.splice(0, 1)
          this.showFileList = false
          return
        } else {
          this.fileList = fileList
          this.showFileList = true
          console.log(fileList)
        }
      },
      handleRemove(file, fileList) {
        console.log("handleRemove", file, fileList);
      },
      handlePreview(file) {
        console.log(file);
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      //新增 修改弹窗中调转到税收编码 需要添加保存数据-
      goToCodeFun() {
        if (this.form.goodsName == "") {
          this.$message({
            type: "info",
            message: "商品名称不能为空",
          });
          return;
        } else {
          this.ifShow = true
          this.ifGetData = true
          this.TaxEncodeVisibility = true
        }
      },
      // 点击新增商品信息按钮
      addGoods() {
        if (this.checked.id == "") {
          this.$message({
            type: "info",
            message: "请选择具体类别",
          });
          return;
        }
        
        this.goodlistAddOrEditFlag = "0";
        this.addOrUpdateTitle = "新增商品信息";
        this.goodsVisibility = true;
        this.form = {
          goodsName: "", //商品名称
          typeId: "", //所属分类id
          typeIdName: "", //商品列别id对应的名字
          taxClassificationCode: "", //税收分类编码
          taxClassificationShortName: "", //税收分类简称
          taxRate: "", //税率 number
          taxLogo: "1", //含税标志，0：不含税、1：含税 默认
          goodsPrice: "", //goodsPrice单价 number
          specifications: "", //规格型号
          unit: "", //单位
          zeroTaxMarks: "", //零税率标识，空代表正常税率 1 出口免税和其他免税优惠政策（免税） 2 不征增值税（不征税） 3 普通零税率（0%）
          incentivesLabel: "", //优惠政策标识 对应弹窗中的优惠政策类型
          id: 0,
        };
        this.form.typeIdName = this.checked.name;
        this.form.typeId = this.checked.id;
        this.form.taxLogo = "1"; ////含税标志，0：不含税、1：含税
        this.form.zeroTaxMarks = ""; ////零税率标识，空代表正常税taxRate率 1 出口免税和其他免税优惠政策（免税） 2 不征增值税（不征税） 3 普通零税率（0%）
        this.form.incentivesLabel = ""; ////优惠政策标识 优惠政策标识
        this.form.taxClassificationShortName = ""; //税收分类简称
        this.form.taxClassificationCode = ""; //税收分类编码
        this.form.taxRate = "" //税率
        this.$refs["form"].resetFields();
      },
      // 点击修改商品信息按钮
      editHandle(val) {
        console.log(val, "修改商品");
        this.goodlistAddOrEditFlag = "1";
        this.addOrUpdateTitle = "修改商品信息";
        this.goodsVisibility = true;
        let middle = JSON.parse(JSON.stringify(val))
        this.form = middle;
        let findResult = this.dataAll.find(item => item.id == val.typeId)
        this.form.typeIdName = findResult.typeName
        //  if(this.checked.id == ''){
        //  this.form.typeIdName='商品类别' 
        // }
        // else{
       
        // this.form.typeIdName = this.checked.name;
        // }
        console.log(this.form.goodsPrice)
        // var num = new Number(this.form.goodsPrice);
        if(this.form.goodsPrice!==null){
          var sBalance = this.toNonExponential(this.form.goodsPrice)
          this.form.goodsPrice = sBalance
        }
        
        
        this.taxRateOptions.filter(item => {return item.value == val.taxRate})
        this.form.typeId = this.checked.id;
        this.form.taxRate = this.taxRateOptions.filter(item => {return item.value == val.taxRate}).length == 0 ?
        parseFloat((val.taxRate*100).toPrecision(12)) + '%' : val.taxRate;
        this.form.taxLogo = val.taxLogo == '1' ? '是' : '否'
        this.form.zeroTaxMarks = val.zeroTaxMarks;
      },
      // 点击复制商品信息按钮
      copyHandle(val) {
        this.goodlistAddOrEditFlag = "2";
        this.addOrUpdateTitle = "复制商品信息";
        this.goodsVisibility = true;
        let middle = JSON.parse(JSON.stringify(val))
        this.form = middle;
        let findResult = this.dataAll.find(item => item.id == val.typeId)
        this.form.typeIdName = findResult.typeName
        // if(this.checked.id == ''){
        //  this.form.typeIdName='商品类别' 
        // }
        // else{
       
        // this.form.typeIdName = this.checked.name;
        // }
        // this.form.typeIdName = this.checked.name;
        if(this.form.goodsPrice!==null){
          var sBalance = this.toNonExponential(this.form.goodsPrice)
          this.form.goodsPrice = sBalance
        }

        this.form.typeId = this.checked.id;
        this.form.taxRate = val.taxRate;
        this.form.taxLogo = val.taxLogo == '1' ? '是' : '否'
        this.form.zeroTaxMarks = val.zeroTaxMarks;
      },
      //新增商品ajax
      addHandle() {
        let addGoodListPa = {
          goodsName: this.form.goodsName, //商品名称
          typeId: this.form.typeId, //所属分类id 
          taxClassificationCode: this.form.taxClassificationCode, //税收分类编码
          taxClassificationShortName: this.form.taxClassificationShortName, //税收分类简
          taxRate: this.form.taxRate,
          taxLogo: this.form.taxLogo, //含税标志，0：不含税、1：含税
          // taxLogo: this.form.taxLogo == '是' ? '1' : '0',  
          goodsPrice: this.form.goodsPrice, //goodsPrice单价 number
          specifications: this.form.specifications, //规格型号
          unit: this.form.unit, //单位
          zeroTaxMarks: this.form.zeroTaxMarks ? this.form.zeroTaxMarks : "", //零税率标识，空代表正常税率 1 出口免税和其他免税优惠政策（免税） 2 不征增值税（不征税） 3 普通零税率（0%）
          incentivesLabel: this.form.incentivesLabel,
          taxDiskNumber: this.taxDiskNum,
          fastFlag: 0,
          goodsSelfCode: "",
          scanFlag: 0,
          taxClassificationName: "",
        };
        if (this.form.taxRate) {
          let strrate = String(this.form.taxRate)
          if (strrate.indexOf('、') > -1) {
            this.form.taxRate = Number(strrate.split('、')[0])
          } else {
            this.form.taxRate = Number(this.form.taxRate)
          }
        } else {
          this.form.taxRate = Number('0.0')
        }
        addListApi(addGoodListPa).then((response) => {
          if (response && response.code == "200") {
            this.$message({
              message: "新增成功",
              type: "success",
            });
            this.getGoodsList(
              null,
              this.currentPage,
              this.codeStatus,
            ); //关键字，当前页，是否赋码，分类id
            this.$refs["form"].resetFields();
          }
        });
      },
      // 复制商品信息
      addHandleForm() {
        var list = {
          goodsName: this.form.goodsName,
          taxClassificationCode: this.form.taxClassificationCode,
          taxClassificationShortName: this.form.taxClassificationShortName,
          // taxRate: this.form.taxRate,
          taxRate: typeof(this.form.taxRate) == 'string' ? this.form.taxRate.split('%')[0] / 100 : this.form.taxRate,
          // taxLogo: this.form.taxLogo,
          typeId: this.form.typeId, //所属分类id
          taxLogo: this.form.taxLogo == '是' ? '1' : '0', //复制税率需要转换成文字
          // taxLogo: this.form.taxLogo == '是' || this.form.taxLogo == "1" ? '1' : '0',
          goodsPrice: this.form.goodsPrice,
          specifications: this.form.specifications,
          unit: this.form.unit,
          zeroTaxMarks: this.form.zeroTaxMarks ? this.form.zeroTaxMarks : "",
          incentivesLabel: this.form.incentivesLabel,
          taxDiskNumber: this.taxDiskNum,
        };
        if (this.form.taxRate) {
          let strrate = String(this.form.taxRate)
          if (strrate.indexOf('、') > -1) {
            this.form.taxRate = Number(strrate.split('、')[0])
          } else {
            this.form.taxRate = Number(this.form.taxRate)
          }
        } else {
          this.form.taxRate = Number('0.0')
        }
        addListApi(list).then((response) => {
          if (response && response.code == "200") {
            this.$message({
              message: "复制成功",
              type: "success",
            });
            this.getGoodsList(
              null,
              this.currentPage,
              this.codeStatus,
            ); //关键字，当前页，是否赋码，分类id
            this.$refs["form"].resetFields();
          }
        });
      },
      //修改商品ajax
      editGoods() {
       
        let editGoodListPa = {
          goodsName: this.form.goodsName, //商品名称
          typeId: this.form.typeId, //所属分类id
          taxClassificationCode: this.form.taxClassificationCode, //税收分类编码
          taxClassificationShortName: this.form.taxClassificationShortName, //税收分类简称
          taxRate: typeof(this.form.taxRate) == 'string' ? this.form.taxRate.split('%')[0] / 100 : this.form.taxRate,
          taxLogo: this.form.taxLogo == '是' || this.form.taxLogo == "1" ? '1' : '0', ////含税标志，0：不含税、1：含税 不需要转换
          goodsPrice: this.form.goodsPrice, //goodsPrice单价 number
          specifications: this.form.specifications, //规格型号
          unit: this.form.unit, //单位
          zeroTaxMarks: this.form.zeroTaxMarks ? this.form.zeroTaxMarks : "", //零税率标识，空代表正常税率 1 出口免税和其他免税优惠政策（免税） 2 不征增值税（不征税） 3 普通零税率（0%）
          incentivesLabel: this.form.incentivesLabel, //优惠政策标识
          taxDiskNumber: this.taxDiskNum,
          id: this.form.id,
          goodsSelfCode: "",
          scanFlag: 0,
          taxClassificationName: null,
          createTime: this.tableData.createTime,
        };
  
        if (this.form.taxRate) {
          let strrate = String(this.form.taxRate)
          if (strrate.indexOf('、') > -1) {
            this.form.taxRate = Number(strrate.split('、')[0])
          } else {
            this.form.taxRate = Number(this.form.taxRate)
          }
        } else {
          this.form.taxRate = Number('0.0')
        }
        updateListApi(editGoodListPa).then((response) => {
          if (response && response.code == "200") {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.$refs["form"].resetFields();
            this.goodsVisibility = false;
            this.getGoodsList(
              null,
              this.currentPage,
              this.codeStatus
            ); //关键字，当前页，是否赋码，分类id
            this.$refs["form"].resetFields();
          }
        });
      },
      //新增 修改商品弹窗 保存报案
      // 保存按钮
      save(form) {
        console.log(this.form.goodsPrice < 0)
        if(this.form.goodsPrice < 0){
          this.$message({
            type: 'warning',
            message: '商品单价不能为负数'
          })
          return
        }
        this.$refs[form].validate((valid) => {
          if (valid) {
            if (this.addOrUpdateTitle == "新增商品信息") {
              this.addHandle();
              this.goodsVisibility = false;
            } else if (this.addOrUpdateTitle == "修改商品信息") {
              this.editGoods();
              this.goodsVisibility = false;
            } else if (this.addOrUpdateTitle == "复制商品信息") {
              this.addHandleForm();
              this.goodsVisibility = false;
            } else {
              return false;
            }
          }
        });
      },
      //科学计数法转小数
      toNonExponential(num) {
        if((num+'').indexOf('e')!=-1){
          var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
          return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
        }
        else{
          return num
        }
      },
      //智能编码
      async intelligenceCodeFun() {
       
        if (this.form.goodsName == "") {
          this.$message({
            type: "info",
            message: "商品名称不能为空",
          });
          return;
        } else {
          let param = {
            goodsName: this.form.goodsName,
          };
          const res = await SmartCode(param);
          this.intellList = res.data;
          if (res.data.length > 0) {
            this.form.taxRate = this.intellList[0].taxRateNum;
            this.form.taxClassificationShortName = this.intellList[0].goodsShortName;
            this.form.taxClassificationCode = this.intellList[0].goodsCode;
            this.taxType(this.form.taxRate, 'active');
          } else {
            this.$confirm('智能赋码匹配不成功, 是否手动赋码?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              callback: action => {
                if (action === 'confirm') {
                  this.TaxEncodeVisibility = true;
                  this.ifShow = true;
                  this.ifGetData = true;
                }
              }
            })
          }
        }
      },
      //删除商品信息
      async handelDelete() {

        let _this = this;
        let detalids = "";
        const length = this.selectedTableData.length;
        for (let i = 0; i < length; i++) {
          detalids = detalids.concat(this.selectedTableData[i].id + ",");
        }
        const res = await delGoodsApi(detalids);
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "删除成功",
          });
         this.getGoodsList(this.searchForm.keyword, 1, this.codeStatus)
        } else {
          
        }
      },
    },
  };
</script>

<style scoped>
  .navBox {
    position: relative;
    padding-right: 32px;
  }
  .goodsManager {
    box-sizing: border-box;
    background-color: #ffffff;
  }
  .rightNavBox {
    float: right;
    height: 63px;
    line-height: 63px;
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
    top: 7px;
  }
  .navTex {
    font-size: 14px;
    color: #000000;
    display: inline-block;
    height: 40px;
    line-height: 40px;
  }
  .page-left {
    float: left;
    width: 15%;
    min-height: 800px;
    background-color: #fff;
    /*margin: 2px 0;*/
    /* overflow: hidden; */
    padding-left: 25px;
    overflow-x: auto;
    overflow-y: auto;
  }
  .page-right {
    float: right;
    width: 85%;
    min-height: 200px;
    background-color: #fff;
    overflow: hidden;
    border-left: 1px solid #ececec;
    padding-top: 21px;
    padding-left: 25px;
    padding-right: 25px;
    box-sizing: border-box;
  }
  .paginBox {
    padding-bottom: 20px;
    padding-right: 25px;
    text-align: right;
    margin-top: 100px;
  }
  .resultIcon {
    font-size: 32px;
    color: green;
  }
  .resultText {
    font-size: 14px;
    font-weight: 800;
  }
  .tipsImport {
    margin-left: 30px;
    font-size: 16px;
    color: rgb(81, 143, 143);
  }
  .span-ellipsis {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
  }
</style>
