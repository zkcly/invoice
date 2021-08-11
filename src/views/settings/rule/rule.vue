<template>
<div id="rule">
    <el-card class="box-card-title"  shadow="never">
      <div @click="clickLeft" style="cursor:pointer;">
        <span class="title el-icon-arrow-left"> 规则配置</span>
      </div>
      
    </el-card>

    <el-card class="box-card-content"  shadow="never">
      <div class="page-header">
        <el-tabs :tab-position="tabPosition" style="height: 500px">
          <el-tab-pane label="开票规则">
            <div style="margin: 10px 0 0 60px">
              <h2 class="title">开票限额</h2>
              <div class="dx dm">
                单张开票限额
                <el-input v-model="input" size="mini"></el-input>
                万元
              </div>
            </div>
            <div style="margin: 20px 0 0 60px">
              <h2 class="title">拆分规则</h2>
              <div>
                <el-checkbox v-model="checked" class="dm"
                  >一、限金额拆分</el-checkbox
                >
                <div class="dc dm">
                  <el-radio v-model="radio" label="1">按金额平均拆分</el-radio>
                  <el-radio v-model="radio" label="2">按限额整体拆分</el-radio>
                </div>
              </div>
              <div style="margin-top: 20px">
                <el-checkbox v-model="checked1" class="dm"
                  >二、限行数拆分</el-checkbox
                >
                <div class="dx dm" style="margin: 10px 0 0 20px">
                  单张发票
                  <el-input v-model="input1" size="mini"></el-input>
                  万元
                </div>
              </div>
            </div>
            <div style="margin: 20px 0 0 60px">
              <h2 class="title">拆分规则</h2>
              <div>
                <el-checkbox v-model="checked2" class="dm"
                  >一、限金额拆分</el-checkbox
                >
                <div class="dc dm">
                  <el-radio v-model="radio1" label="1">规格型号相同</el-radio>
                  <el-radio v-model="radio1" label="2">单价相同</el-radio>
                  <el-radio v-model="radio1" label="3">规格型号单价相同</el-radio>
                </div>
              </div>
              <div style="margin-top: 20px">
                <el-checkbox v-model="checked3" class="dm"
                  >二、相同购方合并</el-checkbox
                >
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="用户管理规则">
            <div style="margin: 10px 0 0 60px">
              <h2 class="title">自动添加商品</h2>
              <el-checkbox v-model="checked4" class="dm"
                  >进项发票商品自动维护到商品库中</el-checkbox
                >
            </div>
          </el-tab-pane>
          <el-tab-pane label="客户管理规则">
            <div style="margin: 10px 0 0 60px">
              <h2 class="title">自动维护客户</h2>
              <el-checkbox v-model="checked5" class="dm"
                  >进项发票开票方自动维护到客户管理中</el-checkbox
                >
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      
    </el-card>
  </div>

  <!-- <div>
    <div class="page-container">
      <span class="title"
        ><i class="el-icon-arrow-left" style="font-weight: 800"></i
        >规则配置</span
      >
    </div>
    <div class="page-header">
      <el-tabs :tab-position="tabPosition" style="height: 500px">
        <el-tab-pane label="开票规则">
          <div style="margin: 10px 0 0 60px">
            <h2 class="title">开票限额</h2>
            <div class="dx dm">
              单张开票限额
              <el-input v-model="input" size="mini"></el-input>
              万元
            </div>
          </div>
          <div style="margin: 20px 0 0 60px">
            <h2 class="title">拆分规则</h2>
            <div>
              <el-checkbox v-model="checked" class="dm"
                >一、限金额拆分</el-checkbox
              >
              <div class="dc dm">
                <el-radio v-model="radio" label="1">按金额平均拆分</el-radio>
                <el-radio v-model="radio" label="2">按限额整体拆分</el-radio>
              </div>
            </div>
            <div style="margin-top: 20px">
              <el-checkbox v-model="checked1" class="dm"
                >二、限行数拆分</el-checkbox
              >
              <div class="dx dm" style="margin: 10px 0 0 20px">
                单张发票
                <el-input v-model="input1" size="mini"></el-input>
                万元
              </div>
            </div>
          </div>
          <div style="margin: 20px 0 0 60px">
            <h2 class="title">拆分规则</h2>
            <div>
              <el-checkbox v-model="checked2" class="dm"
                >一、限金额拆分</el-checkbox
              >
              <div class="dc dm">
                <el-radio v-model="radio1" label="1">规格型号相同</el-radio>
                <el-radio v-model="radio1" label="2">单价相同</el-radio>
                <el-radio v-model="radio1" label="3">规格型号单价相同</el-radio>
              </div>
            </div>
            <div style="margin-top: 20px">
              <el-checkbox v-model="checked3" class="dm"
                >二、相同购方合并</el-checkbox
              >
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="用户管理规则">
          <div style="margin: 10px 0 0 60px">
            <h2 class="title">自动添加商品</h2>
            <el-checkbox v-model="checked4" class="dm"
                >进项发票商品自动维护到商品库中</el-checkbox
              >
          </div>
        </el-tab-pane>
        <el-tab-pane label="客户管理规则">
          <div style="margin: 10px 0 0 60px">
            <h2 class="title">自动维护客户</h2>
            <el-checkbox v-model="checked5" class="dm"
                >进项发票开票方自动维护到客户管理中</el-checkbox
              >
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div> -->
</template>

<script>
export default {
  data() {
    return {
      tabPosition: "left",
      input: "",
      input1: "",
      checked: "",
      checked1: "",
      checked2: "",
      checked3: "",
      checked4: "",
      checked5: "",
      radio: "1",
      radio1: "1",
    };
  },
  methods:{
    clickLeft() {
      this.$router.push({ path: "/settings/index" });
    },
  },
};
</script>

<style lang="scss" scoped>
.box-card-content {
  height: 690px;
}

.title {
  font-size: 20px;
}

.page-header {
  background-color: #fff;
  width: 98%;
  height: 500px;
  margin: 2px 0;
  overflow: hidden;
}

.dx {
  display: flex;
  align-items: center;
  .el-input {
    width: 66px;
    height: 28px;
    background: #f1f3f7;
    border-radius: 2px;
    margin: 0 20px 0 20px;
  }
}

.dm {
  font-size: 14px;
  color: #141414;
}

.dc {
  margin: 10px 0 0 21px;
}
</style>