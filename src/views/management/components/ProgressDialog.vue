<template>
  <el-dialog
    :title="status === 1 ? '正在开票' : '暂停开票'"
    :visible.sync="visible"
    width="30%"
    :before-close="handleClose"
  >
      <el-progress :percentage="percentage"></el-progress>
      <span v-if="status === 1">开具成功{{ num }}张，大约剩余10s</span>
      <span v-if="status === 0">开具成功{{ num }}张</span>
      <span v-if="status === 1" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="status = 0">暂停开票</el-button>
      </span>
      <span v-if="status === 0" slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="status = 1">继续开票</el-button>
      </span>

  </el-dialog>
</template>

<script>
export default {
  name: 'ProgressDialog',
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
      status: 1, // 1: 正在开票， 0： 暂停
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