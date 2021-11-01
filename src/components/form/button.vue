<template>
  <!-- 按钮封装 -->
  <el-button
    :type="type"
    :size="size"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </el-button>
</template>

<script>
export default {
  props: {
    size: String,
    type: String,
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-button {
  width: 100%;
  &.el-button--primary {
    background-color: #1e73ba;
    border-color: #1e73ba;
    &.is-disabled {
      background-color: #a0cfff;
      border-color: #a0cfff;
    }
  }
  &.el-button--default {
    &:hover {
      color: #606266;
      background-color: #fff;
      border-color: #dcdfe6;
    }
  }
}
</style>
