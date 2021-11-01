<template>
  <!-- 头像与下拉 -->
  <el-dropdown trigger="hover" @command="handleDropdown">
    <el-avatar icon="el-icon-user-solid" :src="avatar"></el-avatar>
    <el-dropdown-menu slot="dropdown" class="avatar-dropdown">
      <el-dropdown-item
        :class="item.className"
        v-for="item in dropdownList"
        :key="item.title"
        :command="item"
      >
        <el-row type="flex" justify="space-between" align="middle">
          <span class="userbar-text">{{ item.title }}</span>
          <el-image
            style="width: 16px; height: 16px"
            v-if="item.icon"
            :src="iconURL(item.icon)"
          ></el-image>
        </el-row>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  data () {
    return {
      dropdownList: [
        { icon: 'user.png', title: '个人资料', model: 'user' },
        { icon: 'setting.png', title: '消息设置', model: 'msg' },
        { icon: 'phone.png', title: '修改手机号', model: 'phone' },
        { icon: 'lock1.png', title: '修改密码', model: 'pwd' },
        { icon: '', title: '退出登录', model: 'logout', className: 'logout' }
      ]
    }
  },
  computed: {
    avatar () {
      return this.$store.state.user.user.userImgUrl || ''
    },
    iconURL () {
      return (path) => `https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/icons/${path}`
    }
  },
  methods: {
    handleDropdown (item) {
      const { title } = item
      switch (title) {
        case '退出登录': this.handleLogout()
          break
        default: this.$emit('on-opend-dialog', item)
          break
      }
    },
    // 退出登录
    handleLogout () {
      this.$store.commit('user/clearToken')
      this.$store.commit('user/clearUser')
      location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dropdown {
  margin-left : 10px;
  font-size : 0;
  cursor : pointer;
}
// 头像下拉
::v-deep.avatar-dropdown {
  padding : 0;
  width : 180px;
  .el-dropdown-menu__item {
    &:focus, &:not(.is-disabled):hover {
      background-color : #F5F5F5;
      color : #101010;
    }
    &.logout {
      border-top : 1px solid #939EB9;
    }
  }
  // 箭头
  .popper__arrow {
    display : none;
  }
}

</style>
