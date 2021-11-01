<template>
  <!-- 协议 -->
  <el-row :class="['oauth-agree__wrap', customClass]" type="flex">
    <el-checkbox class="oauth-agree" v-model="vmodel"></el-checkbox>
    <el-row type="flex" align="middle" class="agree-text">
      <span>我同意</span>
      <el-link type="primary" @click="toClientPolicy"
        >《高睿云用户使用协议》</el-link
      >
      <span>和</span>
      <el-link type="primary" @click="toPrivacyPolicy"
        >《高睿云隐私政策》</el-link
      >
    </el-row>
  </el-row>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    customClass: String
  },
  computed: {
    vmodel: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    // 用户使用协议
    toClientPolicy () {
      this.$router.push('/agreement/clientPolicy')
    },
    // 隐私政策
    toPrivacyPolicy () {
      this.$router.push('/agreement/privacyPolicy')
    }
  }
}
</script>

<style lang="scss" scoped>
.oauth-agree__wrap {
  padding: 10px 0 5px;
  border-top: 1px dashed #7d7d7d;
  .oauth-agree {
    margin-right: 6px;
    font-size: 0;
  }
  .agree-text {
    font-size: 13px;
    .el-link {
      font-size: 13px;
    }
  }
}
</style>
