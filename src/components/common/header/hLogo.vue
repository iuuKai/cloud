<template>
  <el-row class="header-logo__wrap">
    <!-- logo -->
    <el-image fit="contain" class="header-logo" :src="logo"></el-image>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      logo: 'https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/login/logo2_v2.png'
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.header-logo__wrap {
  height : 100%;
  // logo
  .header-logo {
    height : 100%;
  }
}

</style>
