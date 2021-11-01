<template>
  <el-row type="flex" align="middle">
    <!-- 头部标签 -->
    <el-tabs
      v-model="currTab"
      type="card"
      @tab-remove="removeTab"
      @tab-click="clickTab"
    >
      <el-tab-pane
        v-for="item in fixedMenuList"
        :key="item.title"
        :label="item.title"
        :name="item.name"
        :closable="item.title !== '首页' && item.title !== '应用'"
      >
      </el-tab-pane>
    </el-tabs>
    <el-divider direction="vertical" v-if="menuList.length > 0"></el-divider>
    <el-tabs
      v-if="menuList.length > 0"
      v-model="currTab"
      type="card"
      @tab-remove="removeTab"
      @tab-click="clickTab"
    >
      <el-tab-pane
        v-for="item in menuList"
        :key="item.title"
        :label="item.title"
        :name="item.name"
        :closable="item.title !== '首页' && item.title !== '应用'"
      >
      </el-tab-pane>
    </el-tabs>
  </el-row>
</template>

<script>
// import { mapState } from 'vuex'

export default {
  created () {
    // this.initCurrPath()
  },
  data () {
    /**
     * 注意，此处 name，是 route 的 path
     */
    return {
      // fixedMenuList: [
      //   {
      //     title: '首页',
      //     name: '/'
      //   },
      //   {
      //     title: '应用',
      //     name: '/console'
      //   }
      // ],
      // currTab: ''
    }
  },
  computed: {
    // ...mapState({
    //   menuList: state => state.menu.menuList
    // })
  },
  watch: {
    $route (newValue, oldValue) {
      // const reg1 = /^(\/[^]*)\/[^]*$/
      // // 针对当前菜单首页
      // const reg2 = /^(\/[^]*)\/?[^]*$/
      // if (!reg1.exec(newValue.path) && reg2.exec(newValue.path)) {
      //   this.currTab = reg2.exec(newValue.path)[1]
      // } else {
      //   this.currTab = reg1.exec(newValue.path)[1]
      // }
    }
  },
  methods: {
    // 初始化当前标签，防止刷新重置
    initCurrPath () {
      // const reg1 = /^(\/[^]*)\/[^]*$/
      // // 针对当前菜单首页
      // const reg2 = /^(\/[^]*)\/?[^]*$/
      // if (!reg1.exec(this.$route.path) && reg2.exec(this.$route.path)) {
      //   this.currTab = reg2.exec(this.$route.path)[1]
      // } else {
      //   this.currTab = reg1.exec(this.$route.path)[1]
      // }
    },
    // 点击标签
    clickTab (tab) {
      // const { name: path } = tab
      // console.log('===', path)
      // // 然后通过 this.$router.push(path) 进行页面跳转
      // if (this.$route.path !== path) {
      //   this.$router.push(path)
      // }
    },
    // 移除标签
    removeTab (targetName) {
      // const tabs = this.menuList
      // let activeTab = this.currTab
      // // 删除自己
      // if (activeTab.path === targetName) {
      //   tabs.forEach((tab, index) => {
      //     if (tab.path === targetName) {
      //       const nextTab = tabs[index + 1] || tabs[index - 1]
      //       if (nextTab) {
      //         activeTab = nextTab
      //       }
      //     }
      //   })
      // }
      // this.currTab = activeTab
      // this.$store.commit('menu/removeMenu', targetName)
      // // 如果动态tabs没了，那就直接前往首页
      // if (tabs.length > 0) {
      //   // 不等于当前路径就跳转
      //   if (this.$route.path !== activeTab) {
      //     this.$router.push(activeTab)
      //   }
      // } else {
      //   // 非首页、应用则重置到首页
      //   const isNotFixed = this.fixedMenuList.findIndex(({ name }) => name === this.$route.path) === -1
      //   if (isNotFixed) {
      //     this.$router.push({ name: 'Home' })
      //   }
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
// 标签页
::v-deep.el-tabs {
  user-select : none;
  .el-tabs__header {
    margin-bottom : 0;
    border-bottom : 0 none;
    .el-tabs__nav {
      display : flex;
      border : 0 none;
      .el-tabs__item {
        padding : 0 25px;
        height : 52px;
        line-height : 52px;
        font-size : 16px;
        border : 0 none;
        // 关闭过度
        // transition: none;
        &.is-active {
          color : #FFFFFF;
          border-bottom : 0 none;
          background-color : #1E73BA;
          user-select : none;
          span.el-icon-close:hover {
            color : #FFFFFF;
          }
        }
        &:hover:not(.is-active) {
          color : #000000;
        }
        &.is-closable:hover {
          padding : 0 25px;
          span.el-icon-close {
            width : 16px;
          }
        }
        span.el-icon-close {
          margin-left : 0;
          position : absolute;
          top : 4px;
          right : 7px;
          width : 0;
          height : 16px;
          font-size : 16px;
          &:hover {
            color : #000000;
            font-weight : bold;
            background-color : transparent;
          }
        }
      }
    }
  }
}
.el-divider {
  margin : 0 1px;
  height : 26px;
  background-color : #CCCCCC;
}

</style>
