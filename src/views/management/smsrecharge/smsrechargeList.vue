<template>
  <div class="smsList">
    <div class="borderBottom navBox">
      <breadnav :textTitle="title" @leftEvent='clickLeft'/>
      <div class="rightNavBox" @click="searchFun">
        <span class="smsNum">短信余量：{{smsStock}}</span>
         <div class="smsBtn" @click="smsFun">短信充值</div>
      </div>
    </div>
    <div class="listContent pl25">
      <div class="tableBox">
        <el-table
          v-loading="loading"
          :data="tableData"
          tooltip-effect="dark"
          :default-sort = "{prop: 'date', order: 'descending'}"
          style="width: 100%">
          <div slot="empty" >
            <listnodate :tableFlag="noDateFlag" />
          </div>
          <el-table-column
            prop="num"
            label="充值数量">
          </el-table-column>
          <el-table-column
            prop="paymentAmount"
            label="金额">
          </el-table-column>
          <el-table-column
            sortable
            prop="paymentDate"
            label="充值时间">
          </el-table-column>
          <el-table-column
            prop="paymentStatus"
            label="充值状态">
            <template slot-scope="scope">
              {{scope.row.paymentStatus == 1 ? '充值成功' : '充值失败'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="invoiceStatus"
            label="发票状态">
            <template slot-scope="scope">
              {{scope.row.invoiceStatus == 1 ? '开票成功' : '开票失败'}}
            </template>
          </el-table-column>
          <el-table-column

            label="操作">
            <template slot-scope="scope">
              <!--<el-tag-->
                <!--:type="scope.row.tag === '家' ? 'primary' : 'success'"-->
                <!--disable-transitions>{{scope.row.tag}}-->
              <!--</el-tag>-->
              <span class="checkText"
              v-if="scope.row.invoiceStatus == 1"
              @click="showPreviewDialog(scope.row.pdfPath)">下载发票</span>
            </template>
          </el-table-column>

        </el-table>

      </div>
      <div class="paginBox">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 20, 50, 100, 200]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <!--弹窗-->
    <el-dialog title="短信充值" :visible.sync="smsOuterVisible" width="30%" :close-on-click-modal='false'>
     <ul class="outBox">
       <li class="outItem" v-for="(item,key) in pricLlist" :key="key" :class = "isactive == key ? 'activeSms' : '' " 
        @click="checkSmsFun(key)">
         <p class="ft16 blackc">{{item.num}}</p>
         <p class="ft14 grayc">售价：{{item.totalAmount}}</p>
       </li>

     </ul>
      <el-dialog
        width="30%"
        height="30%"
        title="扫码支付"
        :close-on-click-modal='false'
        :visible.sync="smsInnerVisible"
        :before-close="updateOnce"
        append-to-body>
          <div class="imgCode">
            <img :src="this.codePic" alt = "" style="width:240px;height:240px;" />
          </div>
          <p class="codeDesc">请使用微信/支付宝扫码支付</p>
        <div slot="footer" class="dialog-footer">
          <!-- <div class="cancleBtn" @click="smsInnerVisible = false">取消</div> -->
          <div class="confirmBtn" @click="updateOnce">关闭</div>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <div class="cancleBtn" @click="smsOuterVisible = false">取消</div>
        <div class="confirmBtn" @click="clickOrder">确定</div>
        <!--<el-button @click="smsOuterVisible = false" size="small">取 消</el-button>-->
        <!--<el-button type="primary" @click="smsInnerVisible = true" size="small">打开内层 Dialog</el-button>-->
      </div>
    </el-dialog>

    <!-- <el-dialog title="短信充值发票" :visible.sync="invoicePreviewVisibility">
      <invoice-preview :isElectronic = "isElectronic" :taxPic = 'taxPic' />
    </el-dialog> -->
    <invoice-preview :isElectronic = "isElectronic" :taxPic = 'taxPic' :visible.sync="invoicePreviewVisibility"/>

    <!-- <pdf :src="pdfUrl" v-for="i in numPages" :key="i" :page="i"> </pdf> -->
  </div>
</template>


<script type="text/ecmascript-6">
  import Breadnav from '@/components/Breadnav';
  import InvoicePreview from '@/views/home/components/InvoicePreview.vue';
  import Listnodate from '@/components/ListNoDate';
  import qs from 'qs'
  import { getRechargeList, smsCharge, getCompanyInfoById, getSpecifications } from '@/api/billType';
//  import PayCode from '@/components/payCode.vue';
  import pdf from "vue-pdf";
  import CMapReaderFactory from "vue-pdf/src/CMapReaderFactory.js";

  export default {
    name: "smsrechargeList",
    components: {
      Breadnav,
      InvoicePreview,
      Listnodate,
      pdf
//      PayCode
    },
    data(){

      return {
        numPages: 1,
        pdfUrl: "",
        contractUrl: "",

        title: '短信充值',
        loading: false,
        currentPage4: 4,
        noDateFlag:'successNoDate',
        tableData: [],
        smsOuterVisible:false,
        smsInnerVisible:false,
        pricLlist:[
          
        ],
        isactive:'0',
        invoicePreviewVisibility: false,
        isElectronic: true,
        taxPic: '',
        codePic: '',
        pageNum: 1,
        pageSize: 10,
        total: 0,
        smsStock: 0,
        companyId: '',
        selectId: '1' 
      }
    },
    created () {
      console.log(this.$store.state)
      this.getList()
      this.getSpecifications()
    },
    mounted(){
      this.companyId = this.$store.state.user.loginInfo.companyId
      this.getCompanyInfoById()

     

    },
    methods:{
      //获取短信充值规格列表
      async getSpecifications(){
        try{
          const res = await getSpecifications()
          if(res.code == 200){
            this.pricLlist = res.data
          }
        }
        catch{

        }
      },

      //获取短信余量
      async getCompanyInfoById(){
        const res = await getCompanyInfoById({
          companyId: this.companyId
        })
        this.smsStock = res.data.smsStock
      },
      //获取充值列表
      async getList(){
        var data = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          timeDesc: '',
          keyword: ''
        }
        const res = await getRechargeList(data)
        if(res.code == 200){
          this.tableData = res.data.records
          this.pageNum = res.data.current
          this.pageSize = res.data.size
          this.total = res.data.total
        }
      },

      updateOnce(){
        this.getList()
        this.getCompanyInfoById()
        this.smsInnerVisible = false
      },

      //分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.getList()
        console.log(`当前页: ${val}`);
      },

      clickLeft(){
        this.$router.push({ name: "managementIndex" });
      },
      searchFun(){
        // let _this=this
        // this.loading=true
        // setTimeout(function(){
        //   _this.loading=false
        // },1000)
      },
      smsFun(){
        this.smsOuterVisible=true;
      },
      checkSmsFun(key){
        console.log(key)
        console.log(this.pricLlist[key])
        this.isactive=key
        this.selectId = this.pricLlist[key].id
      },
      showPreviewDialog(val) {
        // this.invoicePreviewVisibility = true
        // this.taxPic = val


        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = val
        link.setAttribute('download', '查看发票')
        document.body.appendChild(link)
        link.click()
      },

      //打开二维码弹窗
      async clickOrder(){
        // var data = {
        //   "caId": this.companyId,
        //   "num": this.pricLlist[this.isactive].num,
        //   "price": this.pricLlist[this.isactive].price/this.pricLlist[this.isactive].num,
        //   "money": this.pricLlist[this.isactive].price
        // }
        // var newdata = qs.stringify(data, {arrayFormat: 'indices', allowDots: true})
        // console.log(newdata)
        var data = {
          rechargeId: this.selectId,
          skinType: '',
          source: ''
        }   
        const res = await smsCharge(data)
        if(res.code == 200){
          this.codePic = res.data
        }
        this.smsInnerVisible = true
      },

    }
  }
</script>


<style scoped>
  .smsList >>> .el-dialog__body{
    padding: 0 20px !important;
  }

  .smsList{
    box-sizing: border-box;
    background-color: #ffffff;
  }
  .navBox{
    position: relative;
  }
  .rightNavBox{
    position: absolute;
    right: 25px;
    top: 50%;
    transform: translatey(-50%);
  }
  .smsNum{
    display: inline-block;
    font-size: 14px;
    font-weight: 400;
    color: #5E8CF9;
    margin-right: 20px;
  }
  .smsBtn{
    width: 88px;
    height: 32px;
    line-height: 32px;
    background: #5E8CF9;
    border-radius: 2px;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    cursor: pointer;
    display: inline-block;
  }
  .checkText{
    display: inline-block;
    font-size: 14px;
    font-weight: 400;
    color: #5E8CF9;
    line-height: 14px;
    cursor: pointer;
  }


  .tableBox{
    padding-bottom: 100px;
  }
  .paginBox{
    padding-bottom: 20px;
    padding-right: 25px;
    text-align: right;
  }
  .outBox{
    width: 100%;
    /*display: flex;*/
    /*justify-content: space-between;*/
  }
  .outItem{
    display: inline-block;
    border: 1px solid #EBEEF5;
    text-align: center;
    cursor: pointer;
    width: 29.3%;
    margin-right: 2%;
    margin-left: 2%;
    margin-bottom: 25px;
  }
  /*.outItem:hover{*/
    /*background: #5E8CF9;*/
    /*border: 1px solid #EBEEF5;*/
  /*}*/
  /*.outItem:hover p{*/
    /*color: #ffffff;*/
  /*}*/
  .smsList .activeSms{
    background: #5E8CF9;
    border: 1px solid #EBEEF5
  }
  .smsList .activeSms p{
    color: #ffffff;
  }
  .cancleBtn,.confirmBtn{
    display: inline-block;
    width: 65px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius: 2px;
    font-size: 14px;
    cursor: pointer;
  }

  .cancleBtn{
    border: 1px solid rgba(0, 0, 0, 0.15);
    background: #FFFFFF;
    color: #000000;
    margin-right: 8px;
  }
  .confirmBtn{
    background: #5E8CF9;
    border: 1px solid #5E8CF9;
    color: #FFFFFF;
  }
  .imgCode{
    width: 250px;
    height: 250px;
    margin: 0 auto;
  }
  .codeDesc{
    margin-top: 5px;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }


  .ft16{
    font-size: 16px;
  }
  .ft14{
    font-size: 14px;
  }
  .blackc{
    color: #262626;
  }
  .grayc{
    color: rgba(120, 120, 120, 0.85);
  }
  .el-row{
    margin-bottom: 25px
  }

</style>

