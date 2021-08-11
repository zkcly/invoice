<template>
  <div class="page-container">
    <div class="page-header">
        <breadnav :textTitle="navTitle" @leftEvent="clickLeft" />
    </div>
    <div class="page-content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm" label-suffix=":">
        <div class="up">
          <div class="up-left">
            <el-form-item label="发票类型" prop="type">
              <el-select v-model="ruleForm.type" placeholder="请选择发票类型" @change="typechange">
                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申领数量" prop="amount">
              <el-input v-model="ruleForm.amount" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入申领数量" />
            </el-form-item>
            <el-form-item label="证件类型" prop="license">
              <el-select v-model="ruleForm.license" placeholder="请选择证件类型" @change="licenseChange">
                <el-option v-for="item in liceseoption" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申领说明" prop="memo">
              <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 4 }" v-model="ruleForm.memo" placeholder="请输入申领说明" />
            </el-form-item>
            <el-form-item label="领票方式" prop="way" >
              <el-radio-group v-model="ruleForm.way" >
                <el-radio :label="1">自行领取</el-radio>
                <el-radio :label="2" :disabled="ruleForm.type==='026'||ruleForm.type==='028'">快递邮寄</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="up-right">
            <el-form-item label="发票种类" prop="category">
              <el-select v-model="ruleForm.category" placeholder="请选择发票种类">
              <el-option v-for="item in typeOptionsChildren" :key="item.invoiceSpeciesCode" :label="item.invoiceSpeciesName" :value="item.invoiceSpeciesCode">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申领人" prop="applicant">
              <!-- <el-input v-model="ruleForm.applicant" placeholder="请输入申领人" /> -->
              <el-select v-model="ruleForm.applicant" placeholder="请选择申领人" @change="poepleChange">
              <el-option v-for="item in applicantOption" :key="item.name" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="证件号码" prop="licenseNo">
              <el-input v-model="ruleForm.licenseNo" oninput="value=value.replace(/[^\w_]/g,'')" maxlength="30" placeholder="请输入证件号码" />
            </el-form-item>
          
          </div>
        </div>
        <div class="mid" v-if="ruleForm.way === 2">
          <el-row>
            <el-col>
              <div class="one">
                <el-form-item label="收件人" prop="addressee">
                  <el-select v-model="ruleForm.addressee" placeholder="请选择收件人" @change="selectaddress">
                    <el-option v-for="item in reoptions" :key="item.id" :label="item.addressee" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-button type="text" @click="recipientAdd">新增收件人</el-button>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <div class="two">
                <el-form-item label="邮寄信息">
                  <div class="box">
                    <div>收件人：{{receList.addressee}}</div>
                    <div>收件地址：{{receList.address}}</div>
                    <div>移动电话：{{receList.mobilePhone}} </div>
                    <div>固定电话：{{receList.tel}}</div>
                    <div>邮编：{{receList.zipCode}}</div>
                    <div>备注：{{receList.remarks}} </div>
                  </div>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="down">
          <el-form-item prop="protocol" >
              <el-checkbox  v-model="ruleForm.protocol">
                本纳税人同意按
                <el-button type="text" @click="introDialogVisible = true">《网上发票申领快递邮寄说明》</el-button>
                执行
              </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button @click="$router.push('/management/invoicingManagement/applyDistribution')">取消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')"> 申领</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 新增收件人信息 -->
    <el-dialog :title="editOrAddRecipient" :visible.sync="recipientPop" :before-close="handleClose" :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="form" label-width="110px" size="mini" style="width: 70%; margin: 0 auto">
        <el-form-item label="收件人姓名：" prop="addressee">
          <el-input v-model="form.addressee" maxlength="50" placeholder="请输入" onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"></el-input>
        </el-form-item>
        <el-form-item label="移动电话：" prop="mobilePhone">
          <el-input v-model="form.mobilePhone" placeholder="请输入" maxlength="11" onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"></el-input>
        </el-form-item>
        <el-form-item label="邮编：" prop="zipCode">
          <el-input v-model="form.zipCode" oninput="value=value.replace(/[^\d]/g,'')" maxlength="10" placeholder="请输入" onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"></el-input>
        </el-form-item>
        <el-form-item label="收件地址：" prop="address">
          <el-input v-model="form.address" maxlength="100" placeholder="请输入" onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"></el-input>
        </el-form-item>
        <el-form-item label="固定电话：" prop="tel">
          <el-input v-model="form.tel" maxlength="20" placeholder="请输入" onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"></el-input>
        </el-form-item>
        
        <el-form-item label="备注：" prop="remarks">
          <el-input v-model="form.remarks" maxlength="200" placeholder="请输入" onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submit('form')">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="网上发票申领快递邮寄说明" :visible.sync="introDialogVisible" width="30%" :before-close="handleClose" :close-on-click-modal="false">
      <div v-once>
        <div style="font-size: 16px;font-family: PingFangSC-Medium, PingFang SC;font-weight: 500;color: rgba(0, 0, 0, 0.85); ">
          本纳税人声明
        </div>
        <div style=" font-size: 14px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(0, 0, 0, 0.85);">
          <p style="text-indent: 2em; margin-top: 11px">
            自愿选择使用税务机关提供的发票网上申领服务，已清楚了解该服务所产生的纸质发票寄送费用(具体费用计算方法可在省级税务机关互联网站查询)，自愿按照税务机关的要求完成发票网上申领相关事项，并向税务机关确定的发票寄送单位支付全部寄送费用。
          </p>
          <div>本纳税人违反上述声明将承担相关法律责任</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="introDialogVisible = false">确 定</el-button>
       </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    UtilsGetTicketType
  } from "@/utils/function";
   import Breadnav from "@/components/Breadnav";
  import {
    validPhone,
    validStrCheckLength
  } from "@/utils/validate";
  import {
    getDiskTicketTypeApi,
    invoicePurchaseApi,
    insertApi,
    prepareInformationQueriesApi,
    receivingListApi,
    getReceiveById,
    EditInvoicePurchase,
    getMessageId,
    getRedis
  } from "@/api/invoice.js";
  import {
    login
  } from '@/api/user';
  import {
  showFullScreenLoading,
  tryHideFullScreenLoading,
} from "@/utils/loadingX";
  export default {
    name: "InvoiceApply",
    components: {
     Breadnav

    },
    data() {
      const validateSearchText = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请填写正确的电话"));
        } else if (!validPhone(value, 11)) {
          callback(new Error("请填写正确的电话"));
        } else {
          callback();
        }
      };
      const validateSearchText2 = (rule, value, callback) => {
        if (!validStrCheckLength(value, 201)) {
          callback(new Error("最多输入200个汉字或字符"));
        } else {
          callback();
        }
      };
       const validateSearchText3 = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请填写移动电话"));
        } else if (!validPhone(value, 11)) {
          callback(new Error("请填写正确的电话"));
        } else {
          callback();
        }
      };
      const validateSearchText4 = (rule, value, callback) => {
         if (value === "") {
          callback(new Error("请填写收件人姓名"));
        } 
        else if (!validStrCheckLength(value, 51)) {
          callback(new Error("最多可以输入50个字符(25个汉字)"));
        } else {
          callback();
        }
      };
      return {
       navTitle: "发票申领",
        taxDiskNum: "", //税盘号
        index: "",
        typeOptions: [],
        typeOptionsChildren: [],
        applicantOption: [],
        categoryOption:[],
        reoptions: [],
        receList: {},
        invoiceType: null,
        ruleForm: {
          way: 1,
          type: "",
          category: "",
          amount: "",
          applicant: "",
          license: "201",
          licenseNo: "",
          memo: "",
          receiver: "",
          deliveryInfo: "",
          protocol:true,
          addressee: "",
        },
         form: {
          addressee: "",
          mobilePhone: "",
          address: "",
          tel: "",
          zipCode: "",
          remarks: "",
        },
        defaults: '', //选中的name
        defaultscode: '', //选中的code
        liceseoption: [{
            value: "201",
            label: "居民身份证",
          },
          {
            value: "101",
            label: "组织机构代码证",
          },
          {
            value: "208",
            label: "外国护照",
          },
          {
            value: "210",
            label: "港澳居民来往内地通行证",
          },
          {
            value: "212",
            label: "中华人民共和国往来港澳通行证",
          },
        ],
        rules: {
          type: [{
            required: true,
            message: "请选择发票类型",
            trigger: "change"
          }, ],
          amount: [{
            required: true,
            message: "请输入申领数量",
            trigger: "change"
          }, ],
          license: [{
            required: true,
            message: "请选择证件类型",
            trigger: "change"
          }, ],
          memo: [{
            required: true,
            message: "请填写申领说明",
            trigger: "blur",
          },{
           validator: validateSearchText2 
          }
          ],
          category: [{
            required: true,
            message: "请选择发票种类",
            trigger: "change"
          }, ],
          applicant: [{
            required: true,
            message: "请填写申领人",
            trigger: "blur"
          }, ],
          licenseNo: [{
            required: true,
            message: "请填写证件号码",
            trigger: "blur"
          }, ],
          receiver: [{
            required: true,
            message: "请选择收件人",
            trigger: "change"
          }, ],
          addressee: [{
            required: true,
            message: "请填写收件人姓名", 
          }, {
                trigger: "blur",
               validator: validateSearchText4
          }],
          mobilePhone: [{
            required: true,
            trigger: "blur",
            message: "请填写移动电话",
            validator: validateSearchText3
          }, ],
          tel:[{
            required: false,
            trigger: "change",
            // message: "请填写固定电话",
            // validator: validateSearchText

          }],
          address: [{
            required: true,
            message: "请填写收件地址",
            trigger: "blur"
          }, ],
          zipCode: [{
            required: true,
            message: "请填写邮编",
            trigger: "blur"
          }],
        },
       
        options: [],
        introDialogVisible: false, //邮寄说明弹窗
        editOrAddRecipient: "新增收件人", //0新增 1修改
        recipientPop: false, //收件人弹窗隐藏
        info: "",
        key: '',
        key1: ''
      };
    },
    created: function() {
      this.taxDiskNum = this.$store.state.user.taxDiskNum;
      return this.receivingList();
    },
    mounted() {
      console.log(this.$store.state.user.taxDiskNum)
      
      this.getDiskTicketType();
      this.prepareInformationQueries();
      
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
    methods: {
      // 电子发票判断
      typechange(val){
        console.log(val)
        this.$nextTick(()=>{
          if(val=='026'||val=="028")
          {
            this.ruleForm.way = 1
          }
          this.typeOptions.forEach(item => {
          if(item.value == val){
             this.typeOptionsChildren = item.children
             this.ruleForm.category = item.children[0].invoiceSpeciesCode
          }
        })
        })
        
       
      },
      //修改申领人
      poepleChange(val){
        console.log(val)
        this.$nextTick(()=>{
          this.applicantOption.forEach(item => {
            if(item.name == val){
              let flag = 1
              item.children.forEach(item2 => {
                if(item2.certificateId !== ''){
                  flag++
                  this.ruleForm.license = item2.certificateType
                  this.ruleForm.licenseNo = item2.certificateId
                }
              })   
              if(flag == 1){
                this.ruleForm.license = ''
                this.ruleForm.licenseNo = ''
              }    
            }
          })
        })
      },
      //修改证件类型
      licenseChange(val){
        console.log(this.ruleForm.applicant)
        console.log(val)
        this.applicantOption.forEach(item => {
          if(item.name == this.ruleForm.applicant){
            console.log(item.children)
            item.children.forEach(item2 => {
              if(item2.certificateType == val){
                console.log(item2.certificateId)
                this.$nextTick(()=> {
                  this.ruleForm.licenseNo = item2.certificateId
                })
              }
              else{
                this.ruleForm.licenseNo = ''
              }
            })
          }
        })
      },
       clickLeft() {
        this.$router.push({
          name: "applyDistribution"
        });
      },
      // 根据税盘信息获取票种类型
      getDiskTicketType() {
        let applyParams = {
          taxDiskNum: this.taxDiskNum,
        };
        getDiskTicketTypeApi(applyParams)
          .then((response) => {
            this.typeOptions = UtilsGetTicketType(response.data.ticketType); 
            this.typeOptions.forEach(item => {
              item.children = []
            })
          })
          .catch((error) => {});
      },
      // 申领前需先进行发票申领准备信息查询得到messageid
      prepareInformationQueries() {
        
        let applyParams = {
          deviceNo: this.taxDiskNum,
          invoiceType: this.invoiceType,
          taxId: this.$store.state.user.loginInfo.taxId,
        };
        prepareInformationQueriesApi(applyParams)
          .then((response) => {
            if(response.code == 200){
              showFullScreenLoading("加载中，请稍后");
              this.key1 = response.data;
              this.getRedis1();
              this.setInter(3000, this.getRedis1);  
            }
            
            // let res = 
            // {
            //     code:200,
            //     msg: null,
            //     data: {
            //         code: 1,
            //         msgCode: "200",
            //         message: "申领准备信息查询成功",
            //         taxDiskNum: null,
            //         invoiceType: null,
            //         taxId: null,
            //         sum: 0,
            //         tableId: null,
            //         invoiceSeries: null,
            //         source: null,
            //         kpr: null,
            //         data: {
            //             // 所属征管系统
            //             systemName: "1",
            //             // 票种核定信息集合
            //             invoices: [
            //                 {
            //                     // 发票种类代码
            //                     invoiceSpeciesCode: "04",
            //                     // 发票种类名称
            //                     invoiceSpeciesName: "2016版增值税普通发票（二联折叠票）",
            //                     // 发票类型代码
            //                     invoiceType: "007",
            //                     // 每次购票限额
            //                     maxAmountEach: "25",
            //                     // 每月购票限额
            //                     maxAmountMonth: "25",
            //                     // 最高持票量
            //                     maxCount: "25",
            //                     // 序号
            //                     serialNumber: "1"
            //                 },
            //                 {
            //                     // 发票种类代码
            //                     invoiceSpeciesCode: "11",
            //                     // 发票种类名称
            //                     invoiceSpeciesName: "2016版增值税专用",
            //                     // 发票类型代码
            //                     invoiceType: "004",
            //                     // 每次购票限额
            //                     maxAmountEach: "25",
            //                     // 每月购票限额
            //                     maxAmountMonth: "25",
            //                     // 最高持票量
            //                     maxCount: "25",
            //                     // 序号
            //                     serialNumber: "2"
            //                 },
            //                 {
            //                     // 发票种类代码
            //                     invoiceSpeciesCode: "1103",
            //                     // 发票种类名称
            //                     invoiceSpeciesName: "电子",
            //                     // 发票类型代码
            //                     invoiceType: "026",
            //                     // 每次购票限额
            //                     maxAmountEach: "25",
            //                     // 每月购票限额
            //                     maxAmountMonth: "25",
            //                     // 最高持票量
            //                     maxCount: "25",
            //                     // 序号
            //                     serialNumber: "3"
            //                 },
            //             ],
            //             // 纳税人识别号
            //             taxId: "91330211MA2GWDC28T",
            //             // 机器编号
            //             deviceNo: "667900051360",
            //             // 收件人信息集合
            //             inbox: [],
            //             // 经办人信息集合
            //             agents: [
            //                 {
            //                     // 经办人姓名
            //                     name: "李彬夷",
            //                     // 证件类型
            //                     certificateType: "201",
            //                     // 证件号码
            //                     certificateId: "310101197911101256",
            //                     // 序号
            //                     serialNumber: "1"
            //                 },
            //                 {
            //                     // 经办人姓名
            //                     name: "李彬夷",
            //                     // 证件类型
            //                     certificateType: "101",
            //                     // 证件号码
            //                     certificateId: "1234566",
            //                     // 序号
            //                     serialNumber: "2"
            //                 },
            //                 {
            //                     // 经办人姓名
            //                     name: "alan",
            //                     // 证件类型
            //                     certificateType: "",
            //                     // 证件号码
            //                     certificateId: "",
            //                     // 序号
            //                     serialNumber: "3"
            //                 },
            //                 {
            //                     // 经办人姓名
            //                     name: "alanarmstrong",
            //                     // 证件类型
            //                     certificateType: "",
            //                     // 证件号码
            //                     certificateId: "",
            //                     // 序号
            //                     serialNumber: "4"
            //                 },
            //                 {
            //                     // 经办人姓名
            //                     name: "李彬夷",
            //                     // 证件类型
            //                     certificateType: "212",
            //                     // 证件号码
            //                     certificateId: "9876",
            //                     // 序号
            //                     serialNumber: "5"
            //                 },
            //                 {
            //                     // 经办人姓名
            //                     name: "alan",
            //                     // 证件类型
            //                     certificateType: "212",
            //                     // 证件号码
            //                     certificateId: "98762255",
            //                     // 序号
            //                     serialNumber: "6"
            //                 },
            //             ]
            //         },
            //         applySerialNumber: null,
            //         buyerId: null,
            //         noticeNo: null
            //     }
            // }
            // this.handleTax(res.data.data.invoices)
            // this.handlePeople(res.data.data.agents)

            
            console.log(response);
          })
          .catch((error) => {});
      },
         //查询请求
      async getRedis1() {
      const res = await getRedis({ key:this.key1 });
       if (res.data) {
        if (res.data.code == 1) {
          tryHideFullScreenLoading();
          clearTimeout(this.timer);
          if (res.data.msgCode == 200) {
           console.log(res,"准备信息")

          //发票类型和种类联动
           this.handleTax(res.data.data.invoices)
           
          //申领人证件类型和号码联动
           this.handlePeople(res.data.data.agents)
          } 
          else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
        } else {
          this.loading = true;
        }
      } else {
        this.loading = true;
      }
    },

    //创建180秒定时任务，每3秒查询一次
    //每5秒执行一次查询
    setInter(s, fn) {
      let count = 0;
      let timeOut = (s, fn) => {
        var time1 = setTimeout(() => {
          count++;
          if (count < 60 && this.loading == true) {
            fn.call(this);
            timeOut(s, fn);
          } else if (count >=60 && this.loading == true) {
            tryHideFullScreenLoading();
            clearTimeout(this.timer);
            this.$message({
              type: 'error',
              message: '税局服务不稳定，请稍后再试'
            })

          } else {
            tryHideFullScreenLoading();
            clearTimeout(this.timer);
            // this.$globals.closeContent();
          }
        }, s);
        this.timer = time1;
      };
      timeOut(s, fn);
      
    },

      //发票类型和种类联动
      handleTax(data){
        // console.log(this.typeOptions)
        data.forEach(item1 => {
          this.typeOptions.forEach(item2 => {
            if(item2.value == item1.invoiceType){
              item2.children.push({
                invoiceSpeciesCode: item1.invoiceSpeciesCode,
                invoiceSpeciesName: item1.invoiceSpeciesName
              })
            }
          })
        });
        console.log(this.typeOptions)
        this.ruleForm.type = this.typeOptions[0].value
        this.ruleForm.category = this.typeOptions[0].children[0].invoiceSpeciesCode
        this.typeOptionsChildren = this.typeOptions[0].children
      },
      //申领人证件类型和号码联动
      handle(data, newArr){
        if(newArr.length == 0){
          newArr.push({name: data[0].name, children: []})
          newArr[0].children.push({certificateType: data[0].certificateType,
              certificateId: data[0].certificateId})
        }
        else{
          if(data.length !== 0){
            let flag = 0
            newArr.forEach((item) => {
              if(item.name == data[0].name){
                flag++
                item.children.push({certificateType: data[0].certificateType,
                certificateId: data[0].certificateId})
              }      
            })
            console.log(flag)
            if(flag == 0){
              newArr.push({name: data[0].name, children: []})  
              newArr[newArr.length-1].children.push({certificateType: data[0].certificateType,
               certificateId: data[0].certificateId})
            }
          } 
          else{
            console.log(newArr)  
            this.applicantOption = newArr
            this.ruleForm.applicant = newArr[0].name
            this.ruleForm.license = newArr[0].children[0].certificateType
            this.ruleForm.licenseNo = newArr[0].children[0].certificateId
            return 
          }        
        }     
        this.handle(data.slice(1), newArr)     
      },
      handlePeople(data){
        this.handle(data,[])
        
        // this.applicantOption = data
        // this.ruleForm.applicant = data[0].serialNumber
        // this.ruleForm.license = data[0].certificateType
        // this.ruleForm.licenseNo = data[0].certificateId
      },

      // 点击新增收件人按钮
      recipientAdd() {
        this.editOrAddRecipient = "新增收件人";
        this.recipientPop = true; 
      //  this.$refs["form"].resetFields();
      },
      // 新增收件人
      insert() {
        let applyParams = {
          address: this.form.address,
          addressee: this.form.addressee,
          id: this.id,
          mobilePhone: this.form.mobilePhone,
          remarks: this.form.remarks,
          taxDiskNum: this.taxDiskNum,
          tel: this.form.tel,
          zipCode: this.form.zipCode,
        };
        insertApi(applyParams)
          .then((response) => {
            if (response && response.code == "200") {

              receivingListApi({taxDiskNum: this.taxDiskNum})
                .then((response) => {
                  this.$message({
                    type: 'success',
                    message: '新增成功'
                  })
                  this.$refs["form"].resetFields();
                  this.reoptions = response.data;
                  // this.ruleForm.addressee = this.reoptions[this.reoptions.length - 1].id;
                  this.ruleForm.addressee = this.reoptions[0].id;
                  this.selectaddress(this.ruleForm.addressee);
                })
                .catch((error) => {});
            }
          })
      },
      // 查询收件人信息列表
      receivingList() {
        receivingListApi({taxDiskNum: this.taxDiskNum})
          .then((response) => {
            this.reoptions = response.data;
          })
          .catch((error) => {});
      },
      //选中收件人获取对应的收件人信息
      selectaddress(id) {
        getReceiveById({
          id
        }).then((response) => {
          this.receList = response.data;
        })
      },
      // 弹窗提交按钮
      submit(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            if (this.editOrAddRecipient == "新增收件人") {
              this.insert();
              this.recipientPop = false;
              this.$refs["form"].resetFields();
            }
          } else {
            return false;
          }
        });
      },
      // 提交申领
      invoicePurchase() {
        // console.info(this.typeOptionsChildren)
        this.$alert("", "申领中,请稍候", {
          confirmButtonText: "停止申领",
          iconClass: "el-icon-loading",
          center: true,
          showClose: false,
          callback: (action) => {
            clearTimeout(this.timer2);
            this.continue = false;
          },
        });
        let applyParams = {
        
          address: this.receList.address,
          addressee: this.receList.addressee,
          agentName: this.ruleForm.applicant,
          applyDescription: this.ruleForm.memo,
          idNo: this.ruleForm.licenseNo,
          idType: this.ruleForm.license,
          invoiceClassificationCode: this.ruleForm.category,
          invoiceClassification: this.typeOptionsChildren[0].invoiceSpeciesName,
          invoiceType: this.ruleForm.type,
          mobilePhone: this.receList.mobilePhone,
          purchaseMode: this.ruleForm.way,
          purchaseNum:Number(this.ruleForm.amount),
          remark: this.receList.remark,
          taxDiskNum: this.taxDiskNum,
          tel: this.receList.tel,
          zipcode: this.receList.zipcode
         
        };
        
        invoicePurchaseApi(applyParams)
          .then((response) => {
            if (response && response.code == "200") {
              this.key = response.data;
              this.setInter2(3000, this.getRedis);
              // this.$globals.alertSuccess();
            }
            else{
              clearTimeout(this.timer2);
              this.$globals.closeContent();
            }
          })
          .catch((error) => {});
      },

      //创建30秒定时任务，每3秒查询一次
    //每3秒执行一次查询
    setInter2(s, fn) {
      let count = 0;
      let timeOut = (s, fn) => {
        var time1 = setTimeout(() => {
          count++;
          if (count < 60 && this.continue == true) {
            fn.call(this);
            timeOut(s, fn);
          } else if (count >= 60 && this.continue == true) {
            this.continue = false;
            clearTimeout(this.timer2);
            this.$globals.closeContent();
            this.$message({
              type: "error",
              message: "税局服务不稳定，请稍后再试",
            });
          } else {
            console.log("结束计时器");
            clearTimeout(this.timer2);
            // tryHideFullScreenLoading()
            this.$globals.closeContent();
            this.continue = false;
          }
        }, s);
        this.timer2 = time1;
      };
      if ((this.continue = true)) {
        timeOut(s, fn);
      }
    },
    //申领请求
    async getRedis(a) {
      const res = await getRedis({ key: this.key });
      if (res.code == 500) {
        this.continue = false;
        return;
      }
      if (res.data.code == 1) {
        this.continue = false;
        clearTimeout(this.timer2);
        if (res.data.msgCode == 200) {
          this.$globals.closeContent();
          this.$message({
            type: "success",
            message: res.data.message,
          });
        } else {
          this.$globals.closeContent();
          this.$message({
            type: "error",
            message: res.data.message,
          });
        }
      } else {
        this.continue = true;
        console.log(this.continue);
      }
    },
     
      // 邮寄说明关闭弹窗
      handleClose() {
        this.introDialogVisible = false;
         this.recipientPop = false;
         this.$refs["form"].resetFields();
      },
     
      // 申请按钮
      submitForm(ruleForm) {
        if(!this.ruleForm.protocol)
        {
          return  this.$message.error("请勾选网上发票申领快递邮寄说明")
        }
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            
              this.invoicePurchase(); //新增
          }
           else {
            return false;
          }
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .page-container {
    background: #fff;
    padding: 0 0 20px 0;
    .page-header {
      display: flex;
      align-items: center;
      padding-bottom: 10px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #252525;
      border-bottom: 1px solid #ebeef5;
      i {
        font-weight: 800;
      }
      span {
        margin-left: 10px;
      }
    }
    .page-content {
      margin-left: 90px;
      .up {
        display: flex; // justify-content: center;
        .up-right {
          margin-left: 70px;
        }
      }
      .mid {
        .one {
          display: flex;
          .el-button {
            margin-left: 10px;
            margin-top: -20px;
          }
        }
        .box {
          width: 575px;
          padding-top: 10px;
          padding-left: 20px;
          padding-right: 10px;
          background: #f1f3f7;
          div {
            margin-bottom: -15px;
          }
        }
      }
      .two{
        word-wrap:break-word;
      }
      .down {
        // text-align: center;
        // margin-left: 100px;
        .button {
          border: none;
          width: 74px;
          height: 32px;
          border-radius: 2px;
          margin-right: 20px;
          margin-left: 90px;
        }
        .button1 {
          border: none;
          width: 74px;
          height: 32px;
          border-radius: 2px;
          background: #5e8cf9;
          color: #fff;
        }
      }
    }
    .ruleForm {
      // width: 1000px;
      margin: 0 auto;
    }
  }
  .el-form-item__label {
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px !important;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .page-container .page-header {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding-bottom: 10px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #252525;
    justify-content: end !important;
  }
  .el-form-item {
    margin-top: 20px !important;
    margin-bottom: 0px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #262626;
  }
  .el-form {
    border: none !important;
  }
  .page-container .page-content {
       display: flex;
       align-items: center;
  }
  .page-container .page-content .mid .one .el-button {
    margin-left: 10px;
    margin-top: 8px;
  }
  .page-container .page-header i {
    cursor: pointer;
  }
</style>

