<template>
  <el-dialog
    :title="status === 1 ? '正在打印' : '暂停打印'"
    :visible.sync="visible"
    width="30%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
      <el-progress :percentage="percentage"></el-progress>
      <span v-if="status === 1">打印成功{{ num }}张，大约剩余10s</span>
      <span v-if="status === 0">打印成功{{ num }}张</span>
      <span v-if="status === 1" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="status = 0">暂停打印</el-button>
      </span>
      <span v-if="status === 0" slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="status = 1">继续打印</el-button>
      </span>

  </el-dialog>
</template>

<script>
export default {
  name: 'PrintDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    percentage: {
      type: Number,
      default: 0
    },
    num: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      status: 1, // 1: 正在打印， 0： 暂停
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    }
  },
}
</script>

<style lang="scss" scoped>

</style>