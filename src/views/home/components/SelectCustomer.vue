<template>
    <div id="SelectCustomer">
        <el-container>
            <el-aside width="17%" style="height:560px">
                <!-- 客户类别 -->
                <!-- <el-tree
                :data="productCategory"
                :props="defaultProps"
                @node-click="handleNodeClick"
                ></el-tree> -->
                <el-tree
                    class="flow-tree"
                    ref="customerTree"
                    :data="data"
                    :props="defaultProps"
                    :default-expanded-keys="['1']"
                    node-key="id"
                    @node-click="handleNodeClick"
                    :highlight-current='true'
                >
                
                 <span class="span-ellipsis" slot-scope="{node}">
  		              <span :title="node.label">{{ node.label }}</span>
                </span>
                </el-tree>
            </el-aside>

            <el-container>
                <el-main>
                    <div class="sp-nav">
                        <el-input placeholder="请输入" v-model.trim="queryParams.keyword">
                            <el-button slot="append" @click="clickSerch">搜 索</el-button>
                        </el-input>
                        <el-button type="primary" @click="addCustomer">新 增</el-button>
                    </div>

                    <!-- <el-table :data="tableData" style="width: 100%" height="500" @selection-change="handleSelectionChange">
                        <div slot="empty" >
                            <listnodate :tableFlag="noDateFlag" />
                        </div>
                        <el-table-column prop="customerName" label="客户名称" > </el-table-column>
                        <el-table-column prop="taxId" label="税号" > </el-table-column>
                        <el-table-column prop="addressAndPhone" label="地址、电话" min-width="110"> </el-table-column>
                        <el-table-column prop="bankAndAccount" label="开户行及账号" min-width="110"> </el-table-column>
                        <el-table-column prop="invoicePhone" label="收票手机号" min-width="110"> </el-table-column>
                        <el-table-column prop="invoiceEmail" label="收票邮箱" > </el-table-column>
                        <el-table-column prop="remarks" label="备注" min-width="100"> </el-table-column>
                        <el-table-column  label="操作" width="80">
                            <template slot-scope="scope">
                            <el-button type="text" size="small" @click="selectClick(scope.row)">选择</el-button>
                            </template>
                        </el-table-column>
                    </el-table> -->

                    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" height="500" @selection-change="handleSelectionChange" @row-dblclick='selectDbClick'>
                        <div slot="empty">
                            <listnodate :tableFlag="noDateFlag" />
                        </div>
                        <el-table-column prop="customerName" label="客户名称" width="100"></el-table-column>
                        <el-table-column prop="taxId" label="税号"></el-table-column>
                        <el-table-column prop="addressAndPhone" label="地址电话" width="200"></el-table-column>
                        <el-table-column prop="bankAndAccount" label="开户行及账号" width="200"></el-table-column>
                        <el-table-column prop="invoicePhone" label="收票手机号" width="120"></el-table-column>
                        <el-table-column prop="invoiceEmail" label="收票邮箱"></el-table-column>
                        <el-table-column prop="remarks" label="备注"></el-table-column>
                        <el-table-column  label="操作" width="80">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="selectClick(scope.row)">选择</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                </el-main>

                <el-footer>
                    <!-- 分页区域 -->
                    <div class="pages">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage4"
                            :page-sizes="[10, 20, 50, 100, 200]"
                            :page-size="10"
                            background
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total"
                            :page-count="5"
                        >
                        </el-pagination>
                    </div>
                    <!-- <div class="dialog-footer">
                        <el-button type="primary" @click="onDetermine()">确 定</el-button>
                        <el-button @click="onCancel">取 消</el-button>
                    </div> -->
                </el-footer>

            </el-container>
        </el-container>

        <!-- 新增/修改商品 -->
        <update-client :visible.sync="goodsVisibility" @getForm="getForm" :categoryName="currentTreeLabel" :editform="JSON.parse(JSON.stringify(editform))" :categoryData="categoryData" :categoryId="categoryId" :status="status" />


    </div>
</template>

<script>
import Listnodate from '@/components/ListNoDate';
import { queryCustomerList, addCustomerList, } from "@/api/lightInvoicing.js";
import UpdateClientCategory from "@/views/management/clientManagement/components/UpdateClientCategory";
import UpdateClient from "@/views/management/clientManagement/components/UpdateClient.vue";
import request from "@/utils/request";
import { downloadFile } from "@/utils/function.js";
import { validStrCheckLength } from "@/utils/validate";
import { mapState } from 'vuex'
import {
  getCustomerManagementCategory,
  getCustomerList,
  addCustomerCategory,
  deleteCustomerCategory,
  editCustomerCategory,
  customerTemplate,
  addCustomer,
  deleteCustomer,
  updateCustomer,
  serchCustomer,
} from "@/api/customerManagementCategory";

import "@/utils/global.js";
export default {
    name: "SelectCustomer",
    components: {Listnodate, UpdateClientCategory, UpdateClient, },
    props: {},
    data() {
        const validateSearchText = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入关键字"));
            } else if (!validStrCheckLength(value, 41)) {
                console.log("ssss");
                callback(new Error("最多可以输入40个字符（20个汉字）"));
            } else {
                callback();
            }
        };
        return {
            categoryData: [
                {label: 'a',id: '11'},
                {label: 'b',id: '12'}
            ],
            categoryId: '11',

            currentTreeLabel:"客户类别",


            checked: {
                id: "1",
                categoryName: "客户类别",
                parentId: "",
                level: 1,
            },
            categoryName: "",
            rulesSortForm: {
                categoryName: [{ required: true, trigger: "change",validator: validateSearchText},
                ],
            },

            
            // 客户类别
            data: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },


            // 客户数据列表
            tableData: [],
            loading:false,
            // 列表是否有数据
            noDateFlag:'successNoDate',

            currentPage4: 0,
            updateVisibility: false,
            goodsVisibility: false,
            editform: {},
            status: "add",

            // 客户名称、编码
            queryParams: {
                keyword: "",
                codeStatus: "",
            },
            keyword: '',
            
            // 分页
            pageNum: 1,
            pageSize: 10,
            // 总数据条数
            total: 0,

            // 被选中的列表数据
            multipleSelection: [],


            // 盘号
            taxDiskNum: '',


        };
    },
    created() {
        this.getCustomerManagementCategory();
        this.getCustomerList(this.pageSize,this.pageNum)
    },
    mounted() {
        this.taxDiskNum = this.$store.state.user.taxDiskNum;
        // this.companyId = this.$store.state.user.loginInfo.companyId
        
    },
    computed: {
        ...mapState('user', [
        'loginInfo','taxDiskInfo'
        ]),

		taxDiskNumChange() {
			return this.$store.state.user.taxDiskNum;
		}
	},
    watch: {
        taxDiskNumChange: {
            handler: function(newval, oldval) {
                if (newval !== oldval) {
                    this.taxDiskNum = newval
                }
            },
            deep: true
        },
    },
    methods: {

        //获取客户列表数据
        async getCustomerManagementCategory() {
            const res = await getCustomerManagementCategory();
            if (res.code == 200) {
                this.data = res.data;
                this.$nextTick(()=>{
                            this.$refs.customerTree.setCurrentKey('1')
                            })
            }
        },

        //获取表格列表数据
        async getCustomerList(pageSize, pageNum, categoryId='') {
            var params = {
                companyId: this.taxDiskInfo.companyId,
                categoryId,
                pageSize: pageSize,
                pageNum: pageNum,
                keyword: this.keyword
            };
            if(params.categoryId == '1'){
                params.categoryId = ''
            }
            const res = await getCustomerList(params);
            if (res.code == 200) {
                console.log(res.data);
                this.tableData = res.data.records;
                this.pageSize = res.data.size;
                this.total = res.data.total;
                this.pageNum = res.data.current;
            }
        },

        //节点被点击时候的回调（展开）
        handleNodeClick(data) {
            console.log('id',data.id,data)
            this.currentTreeLabel = data.label;
            this.checked.id = data.id;
            this.checked.categoryName = data.label;
            this.checked.parentId = data.id;
            this.checked.level = data.level;
        
            this.getCustomerList(this.pageSize, 1, data.id == '1' ? '' : data.id);
            this.categoryName = data.label;
        },
        // //节点改变时候的回调（设置单选作用）
        // selectTreeNode(data, checked, tree) {
        //     //传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点
        //     if (checked) {
        //         this.checkedId = data.id;
        //         this.$refs.customerTree.setCheckedKeys([data.id]);
        //     } else {
        //         if (this.checkedId == data.id) {
        //         this.$refs.customerTree.setCheckedKeys([data.id]);
        //         }
        //     }
        // },
        // //节点被选中时候的回调
        // //传递给 data 属性的数组中该节点所对应的对象、树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性
        // checktree(data, checked) {
        //     console.log('id',data.id)
        //     this.checked.id = data.id;
        //     this.checked.categoryName = data.label;
        //     this.checked.parentId = data.id;
        //     this.checked.level = data.level;

        //     this.getCustomerList(this.pageSize, this.pageNum);
        //     this.categoryName = data.label;
        // },


        // 列表中的勾选事件
        handleSelectionChange(val) {
            console.log(val);
            var deleteArr = [];
            for (let i = 0; i < val.length; i++) {
                deleteArr.push(val[i].id);
            }
            this.multipleSelection = deleteArr;
        },


        //分页
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        
            this.getCustomerList(val, this.pageNum, this.checked.id);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            console.log(this.pageSize);
            this.getCustomerList(this.pageSize, val, this.checked.id);
        },

        //点击增加客户
        addCustomer() {
            if(this.checked.id == ''){
                this.$message({
                    type: 'info',
                    message: '请选择具体类别'
                })
                return
            }
            this.status = "add";
            this.editform = {}
            this.goodsVisibility = true;
        },

        //新增修改客户信息
        async getForm(val) {
            console.log(val);
        
            if (this.status == "edit") {
                var data = val;
                const res = await updateCustomer(data);
                if (res.code == 200) {
                    console.log(res);
                    this.getCustomerList(this.pageSize, this.pageNum, this.checked.id);
                    this.goodsVisibility = false;
                    this.$message({
                        type: "success",
                        message: "修改成功",
                    });
                }
            } else if (this.status == "add") {
                var data = val;
                data.categoryId = this.checked.id
                data.companyId = this.taxDiskInfo.companyId
                const res = await addCustomer(data);
                if (res.code == 200) {
                    console.log(res);
                    this.getCustomerList(this.pageSize, this.pageNum, this.checked.id);
                    this.goodsVisibility = false;
                    this.$message({
                        type: "success",
                        message: "新增成功",
                    });
                }
            } else if (this.status == "copy") {
                var data = val;
                data.id = "";
                const res = await addCustomer(data);
                if (res.code == 200) {
                    console.log(res);
                    this.getCustomerList(this.pageSize, this.pageNum, this.checked.id);
                    this.goodsVisibility = false;
                    this.$message({
                        type: "success",
                        message: "复制成功",
                    });
                }
            }
        },
        //抬头信息查询客户
        clickSerch() {
            console.log(this.$store.state);
            // this.$refs["searchOne"].validate(async (valid) => {
            //     if (valid) {
                    // var data = {
                    //   companyId: this.taxDiskInfo.companyId,
                    //   customerName: this.queryParams.keyword,
                    // };
                    this.keyword = this.queryParams.keyword
                    this.getCustomerList(this.pageSize, 1, this.checked.id)
            //     }
            // });
        },

        // 搜索
        // search() {
        //     let params = {
        //         buyerName: '',
        //         buyerStatus: 0, //购买方开票状态（0：未开票 1：已开票 ）
        //         keyword: this.productInfo,
        //         pageNum: this.pagenum,
        //         pageSize: this.pagesize,
        //         taxDiskNum: this.taxDiskNum,
        //         timeDesc: ''
        //     }
        //     console.log('jkparams', params);
        //     queryCustomerList(params).then(response => {
        //         if(response&&response.code=='200'){
        //             let res = response.data

        //         }
        //     }).catch(error => {})
        // },




        // 选择按钮
        selectClick(item) {
            this.$emit('selectCustomerDetermine', item)
        },

        //双击
            selectDbClick(row, event, column){
              this.$emit('selectCustomerDetermine', row)
            }


    },
};
</script>

<style scoped>
#SelectCustomer {
  height: 600px;
}

#SelectCustomer >>> .el-main {
  padding: 0 20px;
}


.sp-nav {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}
.sp-nav >>> .el-input-group {
    width: 35%;
}


#SelectCustomer >>> .cell {
    padding-left: 14px;
    cursor: pointer;
}

.dialog-footer {
    display: flex;
    flex-direction: row-reverse;
    padding-top: 20px;
}
.dialog-footer >>> .el-button {
    margin-left: 20px;
}


.pages {
    display: flex;
    flex-direction: row-reverse;
    margin-top: 15px;
}
.span-ellipsis {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
  }
</style>
