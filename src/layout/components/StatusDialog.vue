<template>
  <div>
    <el-dialog
      title="提示"
      :visible.sync="visible"
      width="30%"
      :before-close="handleClose"
    >
      <span>
        <i v-if="status === 'success'" class="el-icon-success"></i>
        <i v-if="status === 'error'" class="el-icon-error"></i>
      </span>
      <p v-if="status === 'success'">
        成功
      </p>
      <p v-if="status === 'error'">
        失败
        ...原因，请稍后再试
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'StatusDialog',
  props: {
    visible: {
      type: Boolean,
      default: false 
    },
    status: {
      type: String,
      validator: val => {
        if (val === 'success' || val === 'error') {
          return true
        } else {
          throw new Error('wrong props value for status')
        }
      }
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