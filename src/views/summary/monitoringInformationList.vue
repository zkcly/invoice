<template>
  <div class="monitor">
    <div class="borderBottom navBox">
      <breadnav :textTitle="title" @leftEvent='clickLeft'/>
      <div class="serchBox">
        <el-form  :model="serchForm" class="demo-form-inline">
          <el-form-item label="发票类型:">
            <el-select v-model="serchForm.type" placeholder="">
              <el-option :label="item.label" :value="item.value" v-for="(item,key) in typeList" :key="key"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <el-button @click="searchFun" type="primary" class="refresh">查询</el-button>
      <!-- <div class="refresh" @click="searchFun">查询</div> -->


    </div>
    <div class="listContent pl25" >
      <ul class="listBox">
        <li class="listItem">
          <span class="itemTitle">开票截止时间：</span>
          <span class="itemDesc">{{this.tableData.openableDeadlineDate}}</span>
        </li>
        <li class="listItem">
          <span class="itemTitle">数据报送起始日期：</span>
          <span class="itemDesc">{{this.tableData.reportStartDate}}</span>
        </li>
        <li class="listItem">
          <span class="itemTitle">数据报送终止日期：</span>
          <span class="itemDesc">{{this.tableData.reportEndDate}}</span>
        </li>
        <li class="listItem">
          <span class="itemTitle">单张发票开票金额限额（元）：</span>
          <span class="itemDesc">{{this.tableData.amountLimit}}</span>
        </li>
        <li class="listItem">
          <span class="itemTitle">正数发票累计金额限额（元）：</span>
          <span class="itemDesc">{{this.tableData.positiveAmountLimit}}</span>
        </li>
        <li class="listItem">
          <span class="itemTitle">负数发票累计金额限额（元）：</span>
          <span class="itemDesc">{{this.tableData.minusAmountLimit}}</span>
        </li>
        <li class="listItem">
          <span class="itemTitle">最新报税日期：</span>
          <span class="itemDesc">{{this.tableData.latestReportDate}}</span>
        </li>
        <li class="listItem">
          <span class="itemTitle">离线开票限定时长：</span>
          <span class="itemDesc">{{this.tableData.offlineInvoiceMaxTime}}</span>
        </li>
        <li class="listItem">
          <span class="itemTitle">离线开票限定张数：</span>
          <span class="itemDesc">{{this.tableData.offlineNumLimit}}</span>
        </li>
        <li class="listItem">
          <span class="itemTitle">离线开票限额：</span>
          <span class="itemDesc">{{(this.tableData.offlineInvoiceAmountLimit !== null && this.tableData.offlineInvoiceAmountLimit !== '')? parseInt(this.tableData.offlineInvoiceAmountLimit).toFixed(2) : ''}}</span>
        </li>
      </ul>
    </div>

  </div>
</template>


<script type="text/ecmascript-6">
  import Breadnav from '@/components/Breadnav';
  import { validStrCheckLength } from "@/utils/validate";
  import { UtilsGetTicketType } from '@/utils/function';
  import { getDiskTicketType, getInvoiceMonitorData } from '@/api/invoiceStatistics' ;
  import { showFullScreenLoading, tryHideFullScreenLoading } from '@/utils/loadingX'
  import { getRedisList, getRedis } from '@/api/taxStock';
  export default {
    name: "monitoringInformationList",
    components: {
      Breadnav
    },
    data(){
      return {
        title: '监控信息',
        serchForm:{
          type:''
        },
        typeList:[

        ],
        continue: true,
        key: '',
        keys: [],
        loading: false,
        tableData: {
          openableDeadlineDate: '',
          reportStartDate: '',
          reportEndDate: '',
          amountLimit: '',
          positiveAmountLimit: '',
          minusAmountLimit: '',
          latestReportDate: '',
          offlineNumLimit: '',
          offlineNumLimit: '',
          offlineInvoiceAmountLimit: '',
          taxDiskNum: '',
        }
      }
    },
    mounted () {
      this.taxDiskNum = this.$store.state.user.taxDiskNum;
      this.getDiskTicketType()
      
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
            this.getDiskTicketType()
          }
        },
        deep: true
      }
    },
    methods:{


      //获取票种类型
      async getDiskTicketType(){
        const res = await getDiskTicketType({taxDiskNum: this.taxDiskNum})
        if(res.code == 200){
          this.typeList = UtilsGetTicketType(res.data.ticketType)
          console.log(this.typeList)
          this.serchForm.type = res.data.ticketType.split(',')[0]
          this.getInvoiceMonitorData(0)
        }
      },

      //获取发票监控数据列表
      async getInvoiceMonitorData(selectType){
        console.log(this.serchForm.type)
        const res = await getInvoiceMonitorData({
          invoiceType: this.serchForm.type,
          selectType,
          taxDiskNum: this.taxDiskNum
        })
        if(res.code == 200 && selectType == 0){
          if (res.data) {        
              this.tableData = res.data       
          }
          else{
            console.log('wu')
            this.tableData={
              openableDeadlineDate: '',
              reportStartDate: '',
              reportEndDate: '',
              amountLimit: '',
              positiveAmountLimit: '',
              minusAmountLimit: '',
              latestReportDate: '',
              offlineNumLimit: '',
              offlineNumLimit: '',
              offlineInvoiceAmountLimit: '',
              taxDiskNum: '',
            }
          }
          // this.tableData = res.data
        }
        else if(res.code == 200 && selectType == 1){
          this.key = res.data
          // this.keys.push(res.data)
          this.loading = true
          this.setInter(2000,this.getRedis)
          // this.getRedis()
        }else{
          this.tableData={
            openableDeadlineDate: '',
            reportStartDate: '',
            reportEndDate: '',
            amountLimit: '',
            positiveAmountLimit: '',
            minusAmountLimit: '',
            latestReportDate: '',
            offlineNumLimit: '',
            offlineNumLimit: '',
            offlineInvoiceAmountLimit: '',
            taxDiskNum: '',
          }
        }
      },

      //点击查询
      searchFun(){
        this.loading = true
        this.continue = true
        
        clearTimeout(this.timer)
        this.getInvoiceMonitorData(1)
        this.$alert("", "查询中,请稍候", {
          confirmButtonText: "停止查询",
          iconClass: "el-icon-loading",
          center: true,
          showClose: false,
          callback: (action) => {
            clearTimeout(this.timer);
            
            this.continue = false;
          },
        });
      },

      //创建30秒定时任务，每3秒查询一次
      //每3秒执行一次查询
      setInter(s,fn){
        let count = 0
        let timeOut = (s,fn)=>{
          var time1 = setTimeout(()=>{

            count++
            if(count < 90 && this.continue == true){
              fn.call(this)
              timeOut(s,fn);
            }
            else if(count >=90 && this.continue == true){
              this.loading = false
              clearTimeout(this.timer);
              this.$globals.closeContent()
              this.$message({
                type: 'error',
                message: '税局服务不稳定，请稍后再试'
              })
            } 
            // else if(count >= 91 && this.continue == true){
            //   // tryHideFullScreenLoading()
            //   this.$globals.closeContent();
            //   console.log('结束计时器')
            //   clearTimeout(this.timer)
            //   this.loading = false
            //   this.$message({
            //     type: 'info',
            //     message: '查询超时，请稍后再试'
            //   })
            // }
            else if(this.continue == false){
              // tryHideFullScreenLoading()
              this.$globals.closeContent();
              console.log('结束计时器')
              clearTimeout(this.timer)
              this.loading = false
            }
          },s)
          this.timer = time1
        }
        if(this.continue = true){
          timeOut(s,fn);
        }

      },
      //查询请求
      async getRedis(a){
        const res = await getRedis({key:this.key})
        if(res.code == 500){
          this.continue = false
          clearTimeout(this.timer)
            // this.$message({
            //   type: 'error',
            //   message: res.msg
            // })
            return 
        }
        if(res.data.code == 1){
          this.continue = false
          this.loading = false
          clearTimeout(this.timer)
          if(res.data.msgCode == 200){
            // tryHideFullScreenLoading()
            this.$globals.closeContent();
            this.getInvoiceMonitorData(0)
            this.$message({
              type: 'success',
              message: '成功！'
            })
          }
          else{
            this.loading = false
            this.continue = false
            // tryHideFullScreenLoading()
            this.$globals.closeContent();
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
        }
        else{
          this.continue = true

          console.log(this.continue)
        }
      },

      clickLeft(){
        this.$router.push({ name: "managementIndex" });
      },
    }
  }
</script>


<style scoped>
  .navBox{
    position: relative;
  }
  .monitor{
    box-sizing: border-box;
    background-color: #ffffff;
  }
  .refresh{
    position: absolute;
    right: 25px;
    top: 16px;
    /* float: right;
    width: 74px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    background: #5E8CF9;
    border-radius: 2px;
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    cursor: pointer;
    margin-right: 40px;
    margin-top: 16px; */
  }

  .serchBox{
    display: inline-block;
    width: 40%;
  }
  .serchBox >>> .el-input__inner,  .reviewInvoicing >>>.el-input__icon{
    height: 32px;
    line-height: 32px;
  }
  .listContent >>> .el-form{
    width: 300px;
    background: red;
    margin: 0 auto;
  }
  .listContent{
    padding-top: 40px;
    padding-bottom: 40px;
  }
  .listBox{
    width: 60%;
    margin: 0 auto;
  }
  .listItem{
    margin-bottom: 30px;
  }
  .itemTitle,.itemDesc{
    display: inline-block;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
    width: 50%;
    text-align: right;
  }
  .itemDesc{
    color: rgba(0, 0, 0, 0.65);
    text-align: left;
  }

</style>

