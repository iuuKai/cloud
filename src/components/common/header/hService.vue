<template>
  <el-row class="service-bar__wrap" type="flex">
    <el-link
      type="info"
      :underline="false"
      v-for="item in rightList"
      :key="item.title"
      class="service-item"
      @click="handleClick(item)"
    >
      <el-image class="service-item-icon" :src="imgURL(item.icon)"></el-image>
      <span class="service-item-text">{{ item.title }}</span>
    </el-link>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      rightList: [
        { icon: 'top_search.svg', title: '', path: '' },
        { icon: 'top_lxwm.svg', title: '联系我们', path: '' },
        { icon: 'top_user.svg', title: '售后服务', path: '' },
        { icon: 'top_bzzx.svg', title: '帮助中心', path: '' }
      ]
    }
  },
  computed: {
    imgURL () {
      return (path) => `https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/index/${path}`
    }
  },
  methods: {
    handleClick (item) {
      const { title } = item
      console.log(title)
    }
  }
}
</script>

<style lang="scss" scoped>
.service-item {
  padding: 0 6px;
  white-space: nowrap;
  .service-item-icon {
    margin-right: 4px;
    width: 20px;
    height: 20px;
  }
  // 行内元素垂直对齐
  .service-item-icon,
  .service-item-text {
    vertical-align: middle;
  }
}
</style>
