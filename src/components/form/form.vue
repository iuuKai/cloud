<template>
  <!-- 表单封装 -->
  <el-form ref="form" :size="size" :model="formData" :rules="formRules">
    <template v-for="item in formLabel">
      <el-form-item
        v-if="active !== undefined ? item.active === active : true"
        :key="item.model"
        :label="item.label"
        :prop="item.model"
      >
        <!-- 验证码需要配合按钮 -->
        <template v-if="item.type === 'msgCode'">
          <el-row type="flex" justify="space-between">
            <el-col :span="14">
              <ItemInput
                type="msg"
                v-model="formData[item.model]"
                :placeholder="item.placeholder"
                :showIcon="item.showIcon"
              ></ItemInput>
            </el-col>
            <el-col :span="9">
              <!-- 插槽给父组件来填充 -->
              <slot name="msgCodeButton"></slot>
            </el-col>
          </el-row>
        </template>
        <!-- 图形验证码 -->
        <template v-else-if="item.type === 'safetyCode'">
          <el-row type="flex" justify="space-between">
            <el-col :span="12">
              <ItemInput
                type="safety"
                v-model="formData[item.model]"
                :placeholder="item.placeholder"
                :showIcon="item.showIcon"
              ></ItemInput>
            </el-col>
            <el-col :span="11">
              <!-- 插槽给父组件来填充 -->
              <slot name="safetyCodePic"></slot>
            </el-col>
          </el-row>
        </template>
        <!-- 手机号需要配合国际区号 -->
        <ItemInput
          v-else-if="item.type === 'phone'"
          :type="item.type"
          v-model="formData[item.model]"
          :placeholder="item.placeholder"
          :countryCode.sync="formData[item.subModel]"
          :showIcon="item.showIcon"
        ></ItemInput>
        <!-- 其它直接输入框 -->
        <ItemInput
          v-else
          :type="item.type"
          v-model="formData[item.model]"
          :placeholder="item.placeholder"
          :countryCode="item.countryCode"
          :showIcon="item.showIcon"
        ></ItemInput>
      </el-form-item>
    </template>
    <el-form-item>
      <slot name="footer"></slot>
    </el-form-item>
  </el-form>
</template>

<script>
import ItemInput from '@/components/form/input'

export default {
  props: {
    // 步骤显示
    active: Number,
    size: String,
    formData: Object,
    formLabel: Array,
    formRules: Object
  },
  methods: {
    // 检测某个，暴露给父级
    validateField (props, callback) {
      this.$refs.form.validateField(props, callback)
    },
    // 检测所有，暴露给父级
    validate (callback) {
      this.$refs.form.validate(callback)
    }
  },
  components: {
    ItemInput
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  ::v-deep .el-form-item {
    margin: 22px 0 0 0;
    &.is-error {
      .el-input {
        .el-input__inner:focus,
        .el-input__inner:hover {
          border-color: #f56c6c;
        }
      }
    }
    .el-form-item__error {
      top: -20px;
    }
    .el-form-item__content {
      line-height: 44px;
    }
  }
}
</style>
