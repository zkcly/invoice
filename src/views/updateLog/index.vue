<template>
  <div class="updateLog">
    <div class="borderBottom">
      <breadnav textTitle="更新日志" @leftEvent="clickLeft" />
    </div>
    <div class="page-content" v-show="haveShow">
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.createTime.substr(0,10)"
          placement="top"
          type="primary"
          size="large"
        >
          <h3>{{ activity.title }}</h3>
          <span class="version">{{ activity.version }}</span>
          <p>{{ activity.content }}</p>
        </el-timeline-item>
      </el-timeline>
    </div>
    <div v-show="noShow">
      <listnodate :tableFlag="noDateFlag" />
    </div>
  </div>
</template>

<script>
  import Breadnav from "@/components/Breadnav";
  import Config from "@/settings";
  import { getCompanyInfoById, getDayDate } from "@/api/billType";
  import Listnodate from "@/components/ListNoDate";
  export default {
    name: "updateLog",
    components: {
      Breadnav,
      Listnodate,
    },
    data() {
      return {
        reverse: false,
        activities: [],
        noDateFlag: "successNoDate",
        noShow: true,
        haveShow: false,
        taxpayerNature: null,
        // dialogVisible: false,
      };
    },
    created() {
      this.getCompanyInfo();
      // this.getDate();
    },
    methods: {
      //获取企业信息
      getCompanyInfo() {
        // const res = await getCompanyInfoById({companyId: this.$store.state.user.loginInfo.companyId});
        // console.log(res)
        // this.taxpayerNature=res.data.taxpayerNature;
        var that = this;
        getCompanyInfoById({
          companyId: this.$store.state.user.loginInfo.companyId,
        })
          .then((res) => {
          if (res.code == "200") {
            getDayDate({
              clientCode: Config.clientCode,
              notificationType: 0,
              promptType: 0,
              taxpayerNature: res.data.taxpayerNature,
            })
              .then((response) => {
                if (response.code == "200") {
                  if (response.data.length > 0) {
                    that.activities = response.data;
                    that.haveShow = true;
                    that.noShow = false;
                  } else {
                    that.haveShow = false;
                    that.noShow = true;
                  }
                }
              })
              .catch((error) => {});
          }
        })
        .catch((error) => {});
        },
        
      clickLeft() {
        // this.$router.push({path:'/dashboard'});
        this.$router.back();
      },
    },
  };
</script>

<style  scoped>
  .updateLog {
    height: auto;
    min-height: 700px;
    background-color: #ffffff;
  }
  ::v-deep .el-timeline-item__timestamp.is-top {
    position: absolute;
    left: -80px;
    top: 0px;
    color: #333333;
    font-weight: bold;
  }
  ::v-deep .el-timeline-item__wrapper{
    top:6px
  }
  .page-content /deep/.el-timeline {
    padding-left: 160px;
  }
  .page-content /deep/ .el-timeline-item__tail{
    top:16px
  }
 
  .page-content /deep/ .el-timeline-item__content .version {
    display: inline-block;
    width: 100px;
    text-align: right;
    position: absolute;
    left: -117px;
    top: 20px;
    color: #5e8cf9;
  }
  .page-content /deep/ .el-timeline-item__node{
    background-color: white;
    width: 30px;
    height: 30px;
    left:-10px;
    border:1px solid #5E8CF9;
    background-color:white;
    /* background-image:url('../../assets/images/audit.png') */
  }

  .page-content /deep/ .el-timeline-item__node::after{
    content: '';
   display: inline-block;   
   width: 16px;   
   height: 16px; 
   border-radius: 8px;
   background: #5E8CF9;
  }
</style>
