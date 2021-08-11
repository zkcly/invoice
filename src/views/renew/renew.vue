<template>
  <div class="page-container">
    <div class="title">版本更新</div>
    <div class="box">
      <div class="out" @click="notifyDialogVisible = true">
        <div class="up"></div>
        <div>更新通知</div>
      </div>
      <div class="out" @click="renewDialogVisible = true">
        <div class="up"></div>
        <div>立即更新</div>
      </div>
      <div class="out" @click="newsDialogVisible = true">
        <div class="up"></div>
        <div>消息通知</div>
      </div>
      <div class="out" @click="openDialogVisible = true">
        <div class="up"></div>
        <div>立即开通</div>
      </div>
    </div>
    <!-- 更新通知对话框 -->
    <el-dialog title="" :visible.sync="notifyDialogVisible" width="30%" center>
      <span>
        <h3>更新通知</h3>
        <div class="dc">1.增加了发票查验更能发票查验更能发票查验更能</div>
        <div class="dx">
          2.增加了发票查验更能发票查验更能发票查验更能查验更能查验更能
        </div>
        <div class="dx">
          2.增加了发票查验更能发票查验更能发票查验更能查验更能查验更能
        </div>
        <div class="dx">
          2.增加了发票查验更能发票查验更能发票查验更能查验更能查验更能
        </div>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="renewDialogVisible = true"
          >立即更新</el-button
        >
        <el-button @click="notifyDialogVisible = false">暂不更新</el-button>
      </span>
    </el-dialog>

    <!-- 立即更新对话框 -->
    <el-dialog title="" :visible.sync="renewDialogVisible" width="30%" center>
      <div style="text-align: center">
        <img src="@/assets/4366688_slices/4366688.png" />
      </div>
      <div class="dm">电专工厂版本更新</div>
      <div class="dn"><el-progress :percentage="50"></el-progress></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="renewDialogVisible = false">立即更新</el-button>
      </span>
    </el-dialog>

    <!-- 消息通知对话框 -->
    <el-dialog title="" :visible.sync="newsDialogVisible" width="30%" center>
      <span>
        <h3>消息通知</h3>
        <div class="dc">1.增加了发票查验更能发票查验更能发票查验更能</div>
        <div class="dx">
          2.增加了发票查验更能发票查验更能发票查验更能查验更能查验更能
        </div>
        <div class="dx">
          2.增加了发票查验更能发票查验更能发票查验更能查验更能查验更能
        </div>
        <div class="dx">
          2.增加了发票查验更能发票查验更能发票查验更能查验更能查验更能
        </div>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="renewDialogVisible = true"
          >立即更新</el-button
        >
        <el-button @click="newsDialogVisible = false">暂不更新</el-button>
      </span>
    </el-dialog>

    <!-- 立即开通对话框 -->
    <el-dialog title="确认开通" :visible.sync="openDialogVisible" width="35%">
      <div class="df">您有15天的试用期，超出试用期请联系客服购买</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="openDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="openDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notifyDialogVisible: false,
      renewDialogVisible: false,
      newsDialogVisible: false,
      openDialogVisible: false,
    };
  },
  methods: {
    format(percentage) {
      return percentage === 100 ? "满" : `${percentage}%`;
    },
  },
};
</script>

<style lang="scss" scoped>
.page-container {
  background: #fff;
  height: 500px;
  margin: 0;
  padding: 0;
  .title {
    height: 64px;
    line-height: 64px;
    margin-left: 31px;
    background: #ffffff;
    border-radius: 2px 2px 0px 0px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #252525;
    border-bottom: 1px solid #f0f0f0;
  }
  .box {
    display: flex;
    text-align: center;
    margin-top: 43px;
    margin-left: 108px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
    .out {
      margin-right: 150px;
      .up {
        width: 60px;
        height: 60px;
        border-radius: 10px;
        background: #f1f5ff;
        margin-bottom: 8px;
      }
    }
  }
}

.dx {
  width: 350px;
  height: 40px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #3c3c3c;
  line-height: 15px;
}
.dc {
  width: 350px;
  height: 40px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #3c3c3c;
  line-height: 30px;
}

.dm {
  margin: 0 auto;
  margin-top: 12px;
  width: 144px;
  height: 25px;
  font-size: 18px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.8);
  line-height: 25px;
}
.dn {
  margin-top: 30px;
}

.df {
  width: 432px;
  height: 22px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  line-height: 22px;
}
</style>