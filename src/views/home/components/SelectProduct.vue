<template>
    <div id="SelectProduct">
        <el-container>
            <el-aside width="17%" style="height:490px">
                <!-- 商品类别 -->
                <!-- <el-tree
                    :data="productCategory"
                    :props="defaultProps"
                    @node-click="handleNodeClick"
                    ></el-tree> -->
                <el-tree ref="tree" class="tree" :props="defaultProps" node-key="id" :default-expanded-keys="['1']" :data="treelist" @node-click="handleNodeClick" :highlight-current='true'>
                    <span class="span-ellipsis" slot-scope="{node}">
  		              <span :title="node.label">{{ node.label }}</span>
                </span>
                </el-tree>
            </el-aside>
            <el-container>
                <el-main>
                    <div class="sp-nav">
                        <el-input placeholder="请输入" v-model.trim="searchForm.keyword">
                            <el-button slot="append" @click="searchFun">搜 索</el-button>
                        </el-input>
                        <div style="display: none">
                            <el-select size="medium" v-model="codeStatus" placeholder="请选择">
                                <el-option v-for="item in codeOptions" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button type="primary" size="medium" @click="searchTypeFun">查询</el-button>
                        </div>
                        <el-button type="primary" @click="addGoods">新 增</el-button>
                    </div>
                    <!-- <el-table ref="multipleTable" :data="tableData" style="width: 100%" height="430" @selection-change="handleSelectionChange">
                            <div slot="empty" >
                                <listnodate :tableFlag="noDateFlag" />
                            </div>
                            <el-table-column type="selection" width="55"> </el-table-column>
                            <el-table-column prop="goodsName" label="商品名称" min-width="130"> </el-table-column>
                            <el-table-column prop="taxClassificationShortName" label="税收分类简称" min-width="110"> </el-table-column>
                            <el-table-column prop="taxClassificationCode" label="税收分类编码" min-width="110"> </el-table-column>
                            <el-table-column prop="taxRate" label="税率" > </el-table-column>
                            <el-table-column prop="specifications" label="规格型号" min-width="110"> </el-table-column>
                            <el-table-column prop="unit" label="计量单位" > </el-table-column>
                            <el-table-column prop="goodsPrice" label="单价" > </el-table-column>
                            <el-table-column label="是否含税" >
                                <template slot-scope="scope">
                                    <span v-if="scope.row.taxLogo == '0'">否</span>
                                    <span v-else>是</span>
</template>
                        </el-table-column>
                        <el-table-column label="免税类型" >
<template slot-scope="scope">
    <span v-if="scope.row.zeroTaxMarks == ''"></span>
    <span v-if="scope.row.zeroTaxMarks == '1'">出口免税和其他免税优惠政策(免税)</span>
    <span v-if="scope.row.zeroTaxMarks == '2'">不征增值税(不征税)</span>
    <span v-if="scope.row.zeroTaxMarks == '2'">普通零税率(0%)</span>
</template>
                        </el-table-column>
                        <el-table-column prop="incentivesLabel" label="优惠政策类型" min-width="110"> </el-table-column>
                        <el-table-column label="操作" width="80">
<template slot-scope="scope">
    <el-button type="text" size="small" @click="selectClick(scope.row)">
        选择</el-button>
</template>
                        </el-table-column>
                    </el-table> -->

                    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" height="350" @selection-change="handleSelectionChange" @row-dblclick='selectDbClick'>
                        <!-- <div slot="empty">
                            <listnodate :tableFlag="noDateFlag" />
                        </div> -->
                        <el-table-column type="selection" width="55" :selectable="selectable" ></el-table-column>
                        <el-table-column prop="goodsName" label="商品名称"></el-table-column>
                        <el-table-column prop="taxClassificationShortName" width="110" label="税收分类简称"></el-table-column>
                        <el-table-column prop="taxClassificationCode" width="110" label="税收分类编码" show-overflow-tooltip></el-table-column>
                        <el-table-column label="税率" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.taxRate*100}}%
                        </template>
                        </el-table-column>
                        <el-table-column prop="specifications" label="规格型号" show-overflow-tooltip ></el-table-column>
                        <el-table-column prop="unit" label="计量单位" show-overflow-tooltip ></el-table-column>
                        <el-table-column prop="goodsPrice" label="单价" show-overflow-tooltip ></el-table-column>
                        <el-table-column prop="taxLogo"  label="是否含税" show-overflow-tooltip>
                            <template slot-scope="scope">
                                {{scope.row.taxLogo|taxlogtype}}
                            </template>
                        </el-table-column>
                        <el-table-column  label="免税类型" show-overflow-tooltip>
                        <template slot-scope="scope">
                          {{scope.row.zeroTaxMarks|trans}}
                        </template>
                        </el-table-column>
                        <el-table-column  label="优惠政策类型" width="110" show-overflow-tooltip  prop="incentivesLabel">
                            <template slot-scope="scope">
                              {{scope.row.incentivesLabel|incent}}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="80">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="selectClick(scope.row)" v-if="scope.row.taxClassificationShortName">
                                选择</el-button>
                            <el-button type="text" size="small" disabled v-else>选择</el-button>
                        </template>
                   </el-table-column>
                    </el-table>

                </el-main>

                <div class="paginBox">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[10, 20, 50, 100, 200]"
                        layout="total, sizes, prev, pager, next, jumper"
                        background
                        :total="total"
                        :pager-count="5"
                    >
                    </el-pagination>
                </div>
                <el-footer>
                    <div class="dialog-footer">
                        <el-button type="primary" @click="onDetermine()">确 定</el-button>
                        <el-button @click="onCancel">取 消</el-button>
                    </div>
                </el-footer>
            </el-container>
        </el-container>

        <!-- 新增/修改商品信息对弹窗append-to-body -->
    <el-dialog
      :title="addOrUpdateTitle"
      :visible.sync="goodsVisibility"
      :close-on-click-modal="false"
      :before-close="addOrUpdatehandleClose"
       width="730px" 
       append-to-body  
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
            <el-form-item prop="typeIdName" label="商品类别">
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
                  v-for="item in taxRateOptions"
                  :key="item.value"
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
                 onkeyup="value=value.replace(/[^\d\.]/g,'')" 
                 onchange="value=value.replace(/[^\d\.]/g,'')"
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
              <el-select v-model="form.incentivesLabel" placeholder="请选择"  prop="incentivesLabel">
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
            <el-button type="primary" @click="save('form')">保存</el-button>
        <el-button type="primary" plain @click="intelligenceCodeFun">智能赋码</el-button
        >
      </div>
    </el-dialog>
    <!-- 手动赋码 -->
    <select-tax-encode
        :visible.sync="TaxEncodeVisibility"
        :ids="ids"
        :ifShow='true'
        :ifGoodsController='true'
        :ifGetData='true'
        @updateGoods="updateGoods"
        @getDetail='getDetail'
    />

    <!-- 税收编码组件 -->
    <select-tax-encode
        :visible.sync="TaxEncodeVisibility"
        :ids="ids"
        :ifShow='true'
        :ifGoodsController='true'
        :ifGetData='ifGetData'
        @updateGoods="updateGoods"
        @getDetail='getDetail'
    />

    </div>
</template>

<script>
    import "@/utils/global.js";
    import Listnodate from '@/components/ListNoDate';
    import {
        downloadFile,
        checkNum
    } from "@/utils/function.js";
    import {
        validStrCheckLength,
        validZXNumber6,
        validStrCheckLengthGoods
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
    } from "@/api/GoodsManagement.js";
    import request from "@/utils/request";
    export default {
        name: "SelectProduct",
        components: {
            Listnodate,
            SelectTaxEncode
        },
        props: {
            //税盘号
            taxDiskNum: {
                type: String,
                default: '',
            },
            index: {
                type: Number,
                default: 0,
            },
            //征税方式
            taxMethodVal: {
                type: Number,
                default: 0,
            },
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
                //分页
                currentPage: 1, //当前是第几页
                total: 0, //总条目数
                pageSizeNum: 10, //一页显示多少条
                // 搜索-商品名称、编码
                searchForm: {
                    keyword: "",
                },
                keyword: '',
                // 选择树-商品类别
                treelist: [],
                defaultProps: {
                    children: "children",
                    label: "label",
                },
                outerDefaultId: '', //最外层的默认id
                goodsTypeSelectDate: {
                    id: null,
                    label: "商品类别",
                    parentId: 1,
                    children: [],
                }, //勾选的商品类别数据
                checkedId: "", //实现单选
                // 商品查询下拉框
                // queryParams: {
                //   codeStatus: "00", //全部商品
                // },
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
                data: [],
                intellList: [], //智能赋码返回数据
                checked: {
                    id: "1",
                    name: "商品类别",
                    parentId: "",
                    level: 1,
                },
                importResultVisible: false,
                importResult: true,
                dialogImageUrl: "",
                // 商品数据列表
                tableData: [
                    // { 
                    //     goodsName: '金针菇',                   //商品名称
                    //     taxClassificationShortName: '蔬菜',    //税收分类简称
                    //     taxClassificationCode: '3123123',       //税收分类编码
                    //     taxRate:'0.03',                           //税率
                    //     specifications: 'XAX3123123',           //规格型号
                    //     unit: '只',                             //单位
                    //     goodsPrice: '1.5',                      //单价
                    //     taxLogo: 1,                             //含税标志，0：不含税、1：含税
                    //     zeroTaxMarks: '',                       //零税率标识，空代表正常税率 1 出口免税和其他免税优惠政策（免税） 2 不征增值税（不征税） 3 普通零税率（0%）
                    //     incentivesLabel:'',                     //优惠政策标识
                    //     id:	111,
                    //     createTime:	'',       //数据创建时间
                    //     fastFlag: 0,                            //闪电开票商品常驻标识 0-默认 1-常驻
                    //     scanFlag: 0,                            //扫码开票商品常驻标识 0-默认 1-常驻
                    //     goodsSelfCode: '',                //商品自行编码
                    //     taxClassificationName: '',        //税收分类名称
                    //     taxDiskNumber: this.taxDiskNum,         //*所属盘编号
                    //     typeId:	11,                             //所属分类id
                    // },
                ],
                loading: false,
                // 列表是否有数据
                noDateFlag: 'successNoDate',
                // 被选中的列表数据
                multipleSelection: [],
                selectedTableData: [], //选择表格中的多选框的数据
                // 商品信息弹出框--
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
                        },
                        {
                            trigger: "blur",
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
                        label: "1%",
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
                dutyFreeOptions: [
                    //空代表正常税率
                    {
                        value: "",
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
                name: "",
                TaxEncodeVisibility: false,
                ids: [],
                ifShow: false,
                ifGoodsController: false,
                lookkTaxEncodeVisibility: false,
                ifGetData: false,
            };
        },
            created() {},
             mounted() {
            this.getGoodsList(null, 1, null); //商品信息分页查询 关键字，当前页，是否赋码，分类id
            this.getTreeList();
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
            
            // 勾选框
            selectable(row, index) {
                if (row.taxClassificationShortName) {
                    return true;
                } else {
                    return false;
                }
            },
            playbackFormat(row, column) {
                if (row.playback === 0) {
                    return '不含税'
                } else {
                    return '含税'
                }
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
            //点击搜索按钮
            searchFun() {
                this.keyword = this.searchForm.keyword
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
            //节点被点击时候的回调（展开）
            handleNodeClick(data) {
                console.log(data);
                this.checked.id = data.id;
                this.checked.name = data.label;
                this.checked.parentId = data.id;
                this.checked.level = data.level;
                this.name = data.label;
                //关键字，当前页，是否赋码
                this.getGoodsList(this.keyword, 1, this.codeStatus, data.id == '1' ? '' : data.id);
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
                this.pageSizeNum = val;
                this.getGoodsList(
                    this.keyword,
                    this.currentPage,
                    this.codeStatus
                );
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getGoodsList(
                    this.keyword,
                    this.currentPage,
                    this.codeStatus
                ); //关键字，当前页，是否赋码
            },
            // 商品信息分页查询 关键字，当前页，是否赋码
            getGoodsList(keyword, pageNum, isCoding) {
                this.tableData = []; //
                let goodsParams = {
                    isCoding: isCoding == "00" ? null : isCoding, //是否赋码:0.未赋码 1.已赋码
                    keyword: keyword, //关键字
                    pageNum: pageNum, //当前页码 第一页是1
                    pageSize: this.pageSizeNum, //每页几条
                    taxDiskNumber: this.taxDiskNum,
                    timeDesc: true,
                    typeId: this.checked.id == this.outerDefaultId ? '' : this.checked.id, //所属分类id
                };
                getGoodslistPage(goodsParams).then((response) => {
                    if (response && response.code == "200") {
                        this.tableData = response.data.records;
                        this.total = response.data.total;
                    }
                });
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
                    // this.selectTaxEncodeVisibility = true;
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
                this.form.incentivesLabel = "";  ////优惠政策标识 优惠政策标识
                this.form.taxClassificationShortName = ""; //税收分类简称
                this.form.taxClassificationCode = ""; //税收分类编码
                this.form.taxRate = "" //税率
            },
            // 点击修改商品信息按钮
            // editHandle(val) {
            //     this.goodlistAddOrEditFlag = "1";
            //     this.addOrUpdateTitle = "修改商品信息";
            //     this.goodsVisibility = true;
            //     let middle = JSON.parse(JSON.stringify(val))
            //     this.form = middle;
            //     this.form.typeIdName = this.checked.name;
            //     this.form.typeId = this.checked.id;
            //     this.form.taxRate = (val.taxRate - 0) * 100 + '%';
            //     this.form.taxLogo = val.taxLogo == '1' ? '是' : '否'
            // },
            // 点击复制商品信息按钮
            // copyHandle(val) {
            //     this.goodlistAddOrEditFlag = "2";
            //     this.addOrUpdateTitle = "复制商品信息";
            //     this.goodsVisibility = true;
            //     let middle = JSON.parse(JSON.stringify(val))
            //     this.form = middle;
            //     this.form.typeIdName = this.checked.name;
            //     this.form.typeId = this.checked.id;
            //     this.form.taxRate = (val.taxRate - 0) * 100 + '%';
            //     this.form.taxLogo = val.taxLogo == '1' ? '是' : '否'
            // },
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
                    this.form.taxRate = 0.0;
                }
                addListApi(addGoodListPa).then((response) => {
                    if (response && response.code == "200") {
                        this.$message({
                            message: "新增成功",
                            type: "success",
                        });
                        this.getGoodsList(
                            this.keyword,
                            this.currentPage,
                            this.codeStatus,
                        ); //关键字，当前页，是否赋码，分类id
                    }
                });
            },
            // 复制商品信息
            addHandleForm() {
                var list = {
                    goodsName: this.form.goodsName,
                    taxClassificationCode: this.form.taxClassificationCode,
                    taxClassificationShortName: this.form.taxClassificationShortName,
                    taxRate: this.form.taxRate,
                    taxLogo: this.form.taxLogo == '是' ? '1' : '0', //复制税率需要转换成文字
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
                            this.keyword,
                            this.currentPage,
                            this.codeStatus,
                        ); //关键字，当前页，是否赋码，分类id
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
                    taxRate: this.form.taxRate,
                    taxLogo: this.form.taxLogo == '是' ? '1' : '0', ////含税标志，0：不含税、1：含税 不需要转换
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
                        this.goodsVisibility = false;
                        this.getGoodsList(
                            this.keyword,
                            this.currentPage,
                            this.codeStatus
                        ); //关键字，当前页，是否赋码，分类id
                    }
                });
            },
            //新增 修改商品弹窗 保存报案
            // 保存按钮
            save(form) {
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
            addOrUpdatehandleClose() {
                this.goodsVisibility = false;
                this.$refs["form"].resetFields();
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
                        this.form.taxRate = Number(this.intellList[0].taxRateNum);
                        this.form.taxClassificationShortName = this.intellList[0].goodsShortName;
                        this.form.taxClassificationCode = this.intellList[0].goodsCode;
                        this.taxType(this.form.taxRate, 'active');
                        this.getGoodsList();
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
                    this.getGoodsList(null, 1, null, null);
                } else {
                    this.$message({
                        type: "error",
                        message: res.msg,
                    });
                }
            },
            testjSON() {
                return {
                    goodsCode: "6040000000000000000",
                    goodsName: "代收印花税",
                    goodsShortName: "代收印花税",
                    id: 1,
                    isSpecial: "不征税",
                    keywords: "代收印花税",
                    parentGoodsCode: "6000000000000000000",
                    prov: "宁波市",
                    taxRate: "0%",
                    version: "32.0",
                };
            },
            // 选择
            selectClick(item) {
                console.log(this.taxMethodVal)
                // 优惠政策类型incentivesLabel==14 ---即减按1.5%征收
                if (this.taxMethodVal == 1) {
                    if (item.incentivesLabel != '按5%简易征收减按1.5%计征') {
                        this.$alert('减按征税只允许选择优惠政策类型为“按5%简易征收减按1.5%计征”的商品！', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning'
                        });
                        return
                    }
                }
                let arr = []
                let i = this.index
                arr.push(item)
                this.$emit('selectProductDetermine', arr, i)
            },
            //双击
            selectDbClick(row, event, column){
              console.log(row)
              if(row.taxClassificationShortName){
                if (this.taxMethodVal == 1) {
                    if (row.incentivesLabel != '按5%简易征收减按1.5%计征') {
                        this.$alert('减按征税只允许选择优惠政策类型为“按5%简易征收减按1.5%计征”的商品！', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning'
                        });
                        return
                    }
                }
                let arr = []
                let i = this.index
                arr.push(row)
                this.$emit('selectProductDetermine', arr, i)
              }else{
                return
              }
              
            },
            // 确定
            onDetermine() {
                if (this.selectedTableData.length == 0) {
                    this.$alert('未选中任何数据！', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning'
                    });
                    return
                }

                // 优惠政策类型incentivesLabel==14 ---即减按1.5%征收
                if (this.taxMethodVal == 1) {
                    for (let i = 0; i < this.selectedTableData.length; i++) {
                        const el = this.selectedTableData[i];
                        if (el.incentivesLabel != '按5%简易征收减按1.5%计征') {
                            this.$alert('减按征税只允许选择优惠政策类型为“按5%简易征收减按1.5%计征”的商品！', '提示', {
                                confirmButtonText: '确定',
                                type: 'warning'
                            });
                            return
                        }
                    }
                }
                let arr = this.selectedTableData
                let i = this.index
                console.log('确定', arr, i);
                this.$emit('selectProductDetermine', arr, i)
            },
            // 取消
            onCancel() {
                this.$emit('selectProductClose')
            },
        },
    };
</script>

<style scoped>
    /* #SelectProduct {
        height: 600px;
    } */
    #SelectProduct>>>.el-main {
        padding: 0 20px;
    }
    .sp-nav {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }
    .sp-nav>>>.el-input-group {
        width: 35%;
    }
    #SelectProduct>>>.cell {
        padding-left: 14px;
        cursor: pointer;
    }
    .dialog-footer {
        display: flex;
        flex-direction: row-reverse;
        padding-top: 20px;
    }
    .dialog-footer>>>.el-button {
        margin-left: 20px;
    }
    .paginBox {
        padding-right: 25px;
        text-align: right;
        margin-top: 20px;
    }
    .span-ellipsis {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
  }
</style>
