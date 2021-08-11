<template>
  <div class="noDate" >
    <div v-if="tableFlag=='successNoDate'">
      <img src="@/assets/images/serachNodate.png" alt="" class="noDateImg">
      <p class="noDateText">无数据</p>
    </div>
    <div v-if="tableFlag=='err'">
      <img src="@/assets/images/searchError.png" alt="" class="noDateImg">
      <p class="noDateText">查找失败</p>
    </div>
  </div>
</template>


<script type="text/ecmascript-6">
  export default {
    name: "Listnodate",
    props:{
      tableFlag:{
        type:String,
        default: 'successNoDate'
      },
    },
    data() {
      return {

      }
    },
    methods:{

    }


  }
</script>


<style scoped>
  .noDate{
    padding-top: 27px;
    text-align: center;
  }
  .noDateImg{
    width: 180px;
  }
  .noDateText{
    position: relative;
    top:-20px;
    color:#909399;
  }
</style>
