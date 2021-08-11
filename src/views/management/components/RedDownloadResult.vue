<template>
  <el-dialog
    title="提示"
    :visible.sync="visible"
    width="30%"
    :before-close="handleClose"
    :close-on-click-modal="false"
    >
    <div v-if="status === 'downloading'">下载中</div>
    <div v-if="status === 'finish'">
      <i class="el-icon-success"></i>
      <h2>下载完成</h2>
      <p>本次共下载XX份红字信息表</p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleClose">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'RedDownloadResult',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      validator: val => {
        return val === 'downloading' || val === 'finish'
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>