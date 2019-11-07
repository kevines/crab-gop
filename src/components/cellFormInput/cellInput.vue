<template>
  <section class="_add">
    <el-form ref="cellInput" :model="cellForm" :rules="rules" label-width="0">
      <el-form-item label="" prop="price">
        <el-input :maxlength="maxlength || 20" v-model="cellForm.price" :placeholder="placeholder || '请输入'" @blur="tableInputBlur"/>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
export default {
  // props: ['value', 'maxlength', 'placeholder', 'pattern', 'message', 'title'],
  props: {
    value: {
      type: String,
      required: false,
      default: ''
    },
    maxlength: {
      type: Number,
      required: false,
      default: 20
    },
    placeholder: {
      type: String,
      required: false,
      default: '请输入'
    },
    pattern: {
      type: RegExp,
      required: false,
      default: false
    },
    message: {
      type: String,
      required: false,
      default: '必填'
    },
    title: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      cellForm: {
        price: ''
      },
      rules: {
        price: [
          { required: true, message: '必填', trigger: 'blur' },
          { pattern: this.pattern, message: this.message, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'value': 'setValue'
  },
  mounted() {
    this.cellForm.price = this.value ? this.value + '' : ''
  },
  created() {
  },
  methods: {
    // 校验
    validate() {
      this.$refs.cellInput.validate()
    },
    tableClearvalidate() {
      this.$refs.cellInput.clearValidate()
    },
    // 失去焦点事件
    tableInputBlur(e) {
      this.$emit('blur', e)
    },
    // 编辑赋值
    setValue(val, oldVal) {
      if (val !== oldVal) {
        this.cellForm.price = val + ''
      }
    }
  }

}

</script>

<style scoped>

</style>
