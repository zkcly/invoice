<template>
  <el-dialog
    :title="status === 'success' ? '开票成功' : `${num}开票失败`"
    :visible.sync="visible"
    width="30%"
    :before-close="handleClose"
  >
    <p v-if="status === 'success'">本次共开具{{ num }}张发票，可至发票查询中查看发票</p>
    <p v-if="status === 'error'">请根据错误提示修改信息后，再次操作</p>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleClose">{{ status === 'success' ? '确定' : '知道了' }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ResultDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      validators: val => {
        if (val === 'success' || val === 'error') {
          return true
        } else {
          throw new Error('wrong prop for status')
        }
      },
      default: 'success',
      required: true
    },
    num: {
      type: Number,
      default: 1
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