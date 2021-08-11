<template>
  <el-dialog :title="`${status === 'add' ? '新增' : '修改'}客户类别`" :visible.sync="visible" :before-close="handleClose">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px" width="'70%'">
      <el-form-item label="客户类别名称" prop="name">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="所属类别">
        上海市
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleClose">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'UpdateGoodsCategory',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      validators: val => {
        return val === 'add' || val === 'edit'
      },
      default: 'add'
    }
  },
  data() {
    return {
      form: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
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