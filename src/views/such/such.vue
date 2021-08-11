<template>
    <div>

    </div>
</template>


<script type="text/ecmascript-6">
  export default {
    name: 'such',
    data() {
      return {}
    },
    methods: {
      //时间格式化的用法
       moment(){
         console.log(this.$moment().toDate())// 获取当前时间输出
         this.$moment('2019/06/17 14:00:00').startOf('hour').fromNow(); //1小时前
         this.$moment().format('YYYY年MM月DD日 HH时mm分ss秒');  //2019年08月01日 19时50分20秒
         this.$moment(new Date()).format('YYYY年MM月DD日 HH时mm分ss秒');  //2019年08月01日 19时50分20秒
        //计算两个日期的天数
         let days = this.$moment('2019/06/17 14:00:00').diff(this.$moment('2019/06/20 14:00:00'), 'days');
        //比较两个日期的大小
         let flag = this.$moment('2019/06/17 14:00:00').isBefore('2019/06/17 14:00:00');
       },
       //成功弹窗
        success(){
          this.$globals.alertSuccess()
        },
      //失败弹窗
      error(){
        this.$globals.alertError()
      }
    }
  }
</script>


<style>

</style>
