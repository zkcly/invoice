<template>
  <div class="statistics-list">
    <el-row>
      <el-col :span="5">
        <p class="word">开票金额(元)</p>
        <p class="num">79</p>
      </el-col>
      <el-col :span="4">
        <div class="line"></div>
      </el-col>
      <el-col :span="5">
        <p class="word">开票税额(元)</p>
        <p class="num">3286</p>
      </el-col>
      <el-col :span="4">
        <div class="line"></div>
      </el-col>
      <el-col :span="5">
        <p class="word">开票张数(张)</p>
        <p class="num">2141</p>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="5">
        <p class="word">认证金额(元)</p>
        <p class="num">21515</p>
      </el-col>
      <el-col :span="4">
        <div class="line"></div>
      </el-col>
      <el-col :span="5">
        <p class="word">认证税额(元)</p>
        <p class="num">12312</p>
      </el-col>
      <el-col :span="4">
        <div class="line"></div>
      </el-col>
      <el-col :span="5">
        <p class="word">认证张数(张)</p>
        <p class="num">23521</p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "StatisticsList",
  props: {
    statisticsData: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style lang="scss" scoped>
.word {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  text-align: left;
}
.num {
  font-size: 30px;
  font-family: HelveticaNeue;
  color: rgba(0, 0, 0, 0.85);
  text-align: left;
}
.line {
  margin-top: 15px;
  margin-left: 20px;
  height: 70px;
  border-left: 1px solid rgba($color: #000, $alpha: 0.06);
}
</style>