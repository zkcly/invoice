<template>
  <div id="historyInvoicing">
    <el-card class="box-card-title">
        <div class="nav-flex">
            <div class="nav-left" @click="goToPages('ScanInvoicing')">
                <span class="el-icon-arrow-left"> {{title}}</span>
            </div>

        </div>
    </el-card>

    <el-card class="box-card-content">
        
        <el-container>  
            <el-aside width="69%">
                <div class="con-left">
                    <div class="con-title">小票设置</div>
                    <el-form :rules="rules" ref="setRel" :model="setForm" label-width="100px" size="medium ">
                        <el-form-item label="店铺名称: " prop="name">
                            <el-input onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;" v-model="setForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="品牌官网: " prop="website">
                            <el-input onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;" v-model="setForm.website"></el-input>
                        </el-form-item>
                        <el-form-item label="公司名称: ">
                            <el-input onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;" v-model="setForm.company" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="营业地址: " prop="address">
                            <el-input onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;" v-model="setForm.address"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话: " prop="tel">
                            <el-input v-model="setForm.tel" onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
                            onKeyUp="value=value.replace(-/\D/g,'')" onchange="value=value.replace(-/\D/g,'')"></el-input>
                        </el-form-item>

                        <el-form-item label="小票有效期: " prop="invoiceDate">
                            <el-select v-model="setForm.invoiceDate" placeholder="请选择">
                                <el-option
                                    v-for="item in invoiceDate"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            天
                        </el-form-item>
                        <!-- <el-form-item label="打印机: ">
                            <el-select v-model="setForm.print" placeholder="请选择">
                                <el-option
                                    v-for="item in printData"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item> -->
                        <!-- <el-form-item class="testPrint">
                            <el-button type="text" @click="testPrint()">测试打印机</el-button>
                        </el-form-item> -->

                        <el-button class="saveBtn" type="primary" @click="onSubmit">保存</el-button>
                    </el-form>
                </div>
            </el-aside>


            <el-main >
                <div class="con-right">
                    <div class="con-title">小票预览</div>
                    <div class="con-preview" ref="taxPic">
                        <div class="preview-tit">
                            <h5>{{setForm.name}}</h5>
                            <span>{{setForm.website}}</span>
                        </div>
                        <div class="preview-infos">
                            <p>公司名称：{{setForm.company}}</p>
                            <p>营业地址：{{setForm.address}}</p>
                            <p>联系电话：{{setForm.tel}}</p>
                            <p>生成时间：{{setForm.createTime}}</p>
                        </div>
                        <div class="preview-tb">
                            <div class="t-head">
                                <span class="name">商品名</span>
                                <span class="count">数量</span>
                                <span class="amount">金额</span>
                            </div>
                            <div class="t-body">
                                <span class="name">----</span>
                                <span class="count">----</span>
                                <span class="amount">----</span>
                            </div>
                            <p>总计: ----</p>
                        </div>
                        <div class="preview-foot">
                            <p>扫一扫开票</p>
                            <div class="QRcode">
                                <img src="@/assets/imgs/newTest.jpg" alt="二维码">
                            </div>
                            <p>二维码有效期至 {{invoiceDate_preview}}</p>
                            <p>再次扫码可以领取电子发票</p>
                        </div>
                    </div>
                </div>

            </el-main>
        </el-container>

    </el-card>

  </div>
</template>

<script>
import { getScanSet, setInfo, saveScanSet} from "@/api/scanInvoicing.js";
import { getLoginData } from "@/api/lightInvoicing.js";
import { getInstalledPrintersApi } from "@/api/cefSharp.js";

export default {
    name: "setInvoicing",
    components: { },
    data() {
        return {
            title: '设置',
            setForm: {
                name: '',
                website: '',
                company: '',    //需打开页面自动获取
                address: '',
                tel: '',
                invoiceDate: '',
                print: '',
                createTime: '',
            },
            rules: {
                name: [
                    { required: true, message: '请输入店铺名称', trigger: 'blur' },
                    { min: 0, max: 15, message: '长度不超过 15 个字符', trigger: 'change' }
                ],
                website: [
                    { min: 0, max: 80, message: '长度不超过 80 个字符', trigger: 'change' },
                ],
                address: [
                    { required: true, message: '请输入营业地址', trigger: 'blur' },
                    { min: 0, max: 50, message: '长度不超过 50 个字符', trigger: 'change' }
                ],
                tel: [
                    { required: true, message: '请输入联系电话', trigger: 'blur' },
                    { min: 0, max: 20, message: '长度不超过 20 个字符', trigger: 'change' },
                    // {pattern: /^(1)\d{2,19}$/, required: true, message: '请输入正确的电话号码格式', trigger: 'blur'}
                ],
                invoiceDate: [{ required: true, message: '请选择小票有效期', trigger: 'blur' }],
            },
            
            // 小票有效期
            invoiceDate: [
                {value: '0', label: '请选择小票码的有效天数'},
                {value: '1', label: '1'},
                {value: '3', label: '3'},
                {value: '30', label: '30'},
                {value: '60', label: '60'}
            ],
            // 打印机
            printData: [
                // {value: '', label: '请选择打印机'},
            ],

            // 预览-默认表格
            tableData: [{name: '---', count: '---', amont: '---'}, {name: '---', count: '---', amont: '---'} ],
            // 预览-有效期
            invoiceDate_preview: '',

            // 小票是否保存成功
            isSaveSuccess: false,

            // 盘号
            taxDiskNum: '',
            // 用户信息
            loginInfo: '',

            // 路由跳转数据
            routeList: '',

            // 小票id
            id: '',

        };
    },
    computed: {
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
        'setForm.invoiceDate': {
            handler: function(newval, oldval) {
                if (newval !== oldval) {
                    this.invoiceDate_p(newval)
                }
            },
            deep: true
        },
      
    },
    created() { },
    mounted() {
        this.routeList = this.$route.query.List ? JSON.parse(this.$route.query.List):''
        console.log(this.routeList)
        this.taxDiskNum = this.$store.state.user.taxDiskNum;
        // this.loginInfo = this.$store.state.user.loginInfo;
        this.getPrintAjax()
        this.toSetInfoAjax()

        this.togetLoginData()
    },
    methods: {
        // 路由跳转 - 返回
        goToPages(item){
            this.$router.push({
                name: item,
                query: {
                    List: JSON.stringify({
                        data: this.routeList.data ? this.routeList.data:'',
                        type: 'setInvoicing',
                    })
                }
            })
        },

        // 获取企业用户信息
        togetLoginData() {
            let params = ''
            getLoginData(params).then(response => {
                if(response&&response.code=='200'){
                    let res = response.data
                    this.loginInfo = res
                    this.setForm.company = res.companyName
                }
            }).catch(error => {})
        },

        // 获取小票设置数据
        toSetInfoAjax() {
            let params = this.taxDiskNum 
            setInfo(params).then(response => {
                if(response&&response.code=='200'){
                    let res = response.data
                    if (res) {
                        this.setForm.name = res.shopShortName
                        this.setForm.website = res.websiteUrl

                        this.setForm.address = res.address
                        this.setForm.tel = res.phone
                        this.setForm.invoiceDate = res.validityDays
                        this.setForm.createTime = res.createTime

                        this.id = res.id
                    }else {
                        this.getSetInit()
                    }

                }
            }).catch(error => {})
        },

        // 小票初始设置
        getSetInit() {
            let params = this.taxDiskNum //根据所属税盘获取小票设置信息
            getScanSet(params).then(response => {
                if(response&&response.code=='200'){
                    let res = response.data
                    this.setForm.name = res.shopShortName
                    this.setForm.website = res.websiteUrl
                    // this.setForm.company = res.
                    this.setForm.address = res.address
                    this.setForm.tel = res.phone
                    this.setForm.invoiceDate = res.validityDays
                    this.setForm.createTime = res.createTime

                    this.id = res.id
                }
            }).catch(error => {})
        },

        // 保存按钮
        onSubmit() {
            this.$refs['setRel'].validate((valid) => {
                if (valid) {
                    if (this.setForm.invoiceDate == '0') {
                        this.$alert('保存失败,小票有效期选择有误!', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning'
                        });
                        return
                    }
                    let params = {
                        shopShortName: this.setForm.name,
                        websiteUrl: this.setForm.website,
                        address: this.setForm.address,
                        phone: this.setForm.tel,
                        validityDays: this.setForm.invoiceDate,
                        createTime: this.setForm.createTime,
                        companyId: this.loginInfo.companyId,          //所属id
                        id: this.id ? this.id:'',                //ID
                        taxDiskNum: this.taxDiskNum,    //所属税盘  
                    }
                    saveScanSet(params).then(response => {
                        if(response&&response.code=='200'){
                            let res = response.data
                            // if (res == false) {
                            //     this.$alert('保存失败!', '提示', {
                            //         confirmButtonText: '确定',
                            //         type: 'warning'
                            //     });
                            //     return
                            // }

                            this.isSaveSuccess = true
                            let obj = {...this.setForm, isSaveSuccess:this.isSaveSuccess}
                            localStorage.setItem('setInvoicing', JSON.stringify(obj))
                            this.$alert('保存成功!', '提示', {
                                confirmButtonText: '确定',
                                type: 'success'
                            });
                            return
                        }
                        this.$alert('保存失败!', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning'
                        });
                    }).catch(error => {})
                    console.log('保存按钮', params);
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 测试打印机
        testPrint() {
            console.log('打印机--', this.setForm.print)
            // if (!this.setForm.print || this.setForm.print == '0') {
            //     this.$alert('请选择打印机', '提示', {
            //         confirmButtonText: '确定',
            //     });
            //     return
            // }
            this.$refs['setRel'].validate((valid) => {
                if (valid) {
                    // this.testPrintAjax()

                    // this.$print(this.$refs.taxPic)
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // testPrintAjax() {
        //     let params = {
        //         shopShortName: this.setForm.name,
        //         websiteUrl: this.setForm.website,
        //         address: this.setForm.address,
        //         phone: this.setForm.tel,
        //         validityDays: this.setForm.invoiceDate,
        //         createTime: this.setForm.createTime ,
        //         companyId: '',          //所属id
        //         id: '',                 //ID
        //         taxDiskNum: this.taxDiskNum,         //所属税盘  
        //     }
        //     saveScanSet(params).then(response => {
        //         if(response&&response.code=='200'){
        //             let res = response.data
        //         }
        //     }).catch(error => {})
        //     console.log('保存按钮', params);
        // },
        // 获取打印机列表
        getPrintAjax() {
            let params = ''
            getInstalledPrintersApi(params).then(response => {
                if(response&&response.code=='0'){
                    let res = response.data
                    for(let i=0; i<res.length; i++){
                        let obj = {value: res[i], label: res[i] }
                        this.printData.push(obj)
                    }
                }
            }).catch(error => {})
        },


        // 小票预览-有效日期
        invoiceDate_p(newval) {
            this.setForm.createTime = this.$moment().format("YYYY-MM-DD HH:mm:ss")
            const totle_s = 1*24*60*60*1000*newval + Date.now()
            this.invoiceDate_preview = this.$moment(totle_s).format("YYYY-MM-DD HH:mm:ss")
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
.nav-left {
    height: 40px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #252525;
    line-height: 40px;
    cursor: pointer;
}


.box-card-content {
    height: 750px;
}
.box-card-content >>> .el-container {
    margin: -20px 0;
}
.box-card-content >>> .el-main {
    height: 750px;
    padding: 0;
    border-left: 1px solid #ddd;
}

.con-title {
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    font-weight: 600;
    padding-left: 10px;
    margin-bottom: 40px;
}

.con-left,
.con-right {
    /* flex-grow: 1; */
    padding-left: 50px;
}
.con-left >>> .el-form-item__content>.el-input, 
.con-left >>> .el-form-item__content>.el-select {
    width: 60%;
}
.con-left .testPrint {
    margin-top: -20px;
}
.saveBtn {
    margin-left: 30%;
}




.con-right {
    width: 100%;
    min-width: 245px;
    padding-right: 40px;
}
.con-preview {
    width: 90%;
    height: 100%;
    margin: 0 auto;
    padding: 20px 20px 30px;
    box-shadow: 0px 1px 6px 0px rgba(94, 140, 249, 0.2);
    font-size: 14px;
}
.con-preview h5 {
    margin: 5px 0;
}
.con-preview p {
    margin-bottom: -5px;
}
.preview-tit,
.preview-foot {
    text-align: center;
    word-wrap:break-word;
    width: 100%;
}

.preview-infos {
    margin: 25px 0 15px;
}
.preview-infos >>> p{
    width: 100%;
    word-wrap:break-word;
}
.preview-tb {
    width: 100%;
    padding: 0 15px;
    margin-bottom: 30px;
}
.preview-tb .t-head {
    font-weight: bold;
}
.preview-tb>div {
    display: flex;
    justify-content: space-between;
    height: 30px;
    line-height: 30px;
}
.preview-tb>p {
    display: flex;
    flex-direction: row-reverse;
}

.preview-foot .QRcode {
    width: 151px;
    height: 151px;
    margin: 20px auto;
    background-color: #ddd;
}
.preview-foot .QRcode>img {
    width: 100%;
    height: 100%;
}
</style>
