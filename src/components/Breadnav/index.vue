<template>
  <div class="breadNav" @click="onClickLeft">
    <i class="el-icon-arrow-left breadArrow"></i>
    <span class="navText">{{textTitle}}</span>
  </div>
</template>


<script type="text/ecmascript-6">
    export default {
      name: "Breadnav",
      props:{
        textTitle:{
          type:String,
          default: '首页'
        },
      },
      data() {
        return {

        }
      },
      methods:{
        onClickLeft(){
          this.$emit('leftEvent')
        },
      }


    }
</script>


<style scoped>
  .breadNav{
    display: inline-block;
    width: 160px;
    height: 62px;
    line-height: 62px;
    line-height: 62px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 400;
    color: #252525;
  }
  .breadArrow{
    margin-left: 25px;
  }
  .navText{
    margin-left: 6px;
  }
</style>
