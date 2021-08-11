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
      <div class="refresh">同步</div>
    </div>
    <div class="listContent pl25">
      <ul class="listBox">
        <li class="listItem">
          <span class="itemTitle">开票截止时间：</span>
          <span class="itemDesc">2021-03-15</span>
        </li>
        <li class="listItem">
          <span class="itemTitle">数据报送起始日期：</span>
          <span class="itemDesc">2021-03-15</span>
        </li>
        <li class="listItem">
          <span class="itemTitle">数据报送终止日期：</span>
          <span class="itemDesc">2021-03-15</span>
        </li>
        <li class="listItem">
          <span class="itemTitle">单张票开票金额限制（元）：</span>
          <span class="itemDesc">100000000.00</span>
        </li>
        <li class="listItem">
          <span class="itemTitle">正数发票累计金额限制（元）</span>
          <span class="itemDesc">100000000.00</span>
        </li>
        <li class="listItem">
          <span class="itemTitle">负数发票累计金额限制（元）</span>
          <span class="itemDesc">100000000.00</span>
        </li>
      </ul>
    </div>

  </div>
</template>


<script type="text/ecmascript-6">
  import Breadnav from '@/components/Breadnav';
  import { validStrCheckLength } from "@/utils/validate";
  export default {
    name: "monitoringInformationList",
    components: {
      Breadnav
    },
    data(){
      return {
        title: '监控信息',
        serchForm:{
          type:'1'
        },
        typeList:[
          {label:'专用票',value:'1'},
          {label:'普通票',value:'2'},
          {label:'电子专用票',value:'3'},
          {label:'电子普通票',value:'4'},
          {label:'复印票',value:'5'},
        ],
      }
    },
    created () {

    },
    methods:{
      clickLeft(){
        alert('点击')
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
    float: right;
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
    margin-top: 16px;
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

