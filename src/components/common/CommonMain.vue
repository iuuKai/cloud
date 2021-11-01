<template>
  <!-- 每个模块都需要的。侧边栏 + 主内容 -->
  <el-container>
    <!--  侧边栏  -->
    <el-aside width="auto">
      <CommonAside v-model="menuList" @on-active-item="addTab"></CommonAside>
    </el-aside>
    <!--  主内容  -->
    <el-main>
      <el-tabs
        v-model="currTab"
        @tab-remove="removeTab"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="item in tabList"
          :key="item.name"
          :label="item.title"
          :name="item.name"
          :closable="!item.fixation"
        >
          <router-view
            class="main-page__wrap"
            @on-exit="removeTab"
          ></router-view>
        </el-tab-pane>
      </el-tabs>
      <!-- <el-main>
        <router-view class="main-page__wrap" @on-exit="removeTab"></router-view>
      </el-main> -->
    </el-main>
  </el-container>
</template>

<script>
import CommonAside from './CommonAside'

export default {
  props: {
    value: Array
  },
  created () {
    this.initCurrPath()
  },
  data () {
    return {
      currTab: '',
      tabList: []
    }
  },
  computed: {
    menuList: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    // 初始化当前标签，防止刷新重置
    initCurrPath () {
      console.log('%c [ this.$route.path ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.$route.path)
      const home = /(\/[^/\r\n]+)(\/[^\r\n]*)?/.exec(this.$route.path)[1]
      console.log('%c [ home ]', 'font-size:13px; background:pink; color:#bf2c9f;', home)
      this.tabList.push({
        name: home,
        fixation: true
      })
      this.currTab = this.$route.path
      const pTabs = []
      const cTabs = []
      this.menuList.forEach(item => {
        if (item.children && item.children.length > 0) {
          cTabs.push(...item.children)
        } else {
          pTabs.push(item)
        }
      })
      const tabs = pTabs.concat(cTabs)
      const tab = tabs.find(({ name }) => name === this.currTab)
      console.log(tabs, '========', this.currTab)
      if (tab) {
        this.tabList.push(tab)
      }
    },
    handleClick (tab) {
      const { name: path } = tab
      if (this.$route.path !== path) {
        this.$router.push(path)
      }
    },
    addTab (tab) {
      const isExist = this.tabList.findIndex(item => item === tab) > -1
      // 如果存在，则切换，否则添加
      if (isExist) {
        this.handleClick(tab)
      } else {
        this.tabList.push(tab)
        this.$router.push(tab.name)
      }
      this.currTab = tab.name
    },
    // 移除不用理，通用
    removeTab (targetName) {
      const tabs = this.tabList
      let activeTab = this.currTab
      if (activeTab === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeTab = nextTab.name
            }
          }
        })
      }
      this.currTab = activeTab
      this.tabList = tabs.filter(tab => tab.name !== targetName)
      if (this.$route.path !== activeTab) {
        this.$router.push(activeTab)
      }
    }
  },
  components: {
    CommonAside
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/commonMain';

.el-container {
  height : calc(100vh - 52px);
  .el-aside {
    overflow : hidden;
  }
  .el-main {
    padding : 0;
    .el-tabs {
      height : 100%;
      .el-tabs__header {
        margin-bottom : 0px;
        background-color : #F6F7F9;
        .el-tabs__nav-wrap {
          padding : 0 10px;
          &::after {
            height : 1px;
          }
          .el-tabs__nav {
            height : 40px;
            display : flex;
            .el-tabs__active-bar {
              background-color : #1E73BA;
            }
            .el-tabs__item {
              &.is-active {
                color : #1E73BA;
              }
              .el-icon-close {
                opacity : 0;
                &:hover {
                  color : #1E73BA;
                  background-color : transparent;
                }
              }
              &:hover {
                .el-icon-close {
                  opacity : 1;
                }
              }
              // 因为第一个是下划线
              &:nth-child(2) {
                padding : 0;
                width : 20px;
                background : url('https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/index/home.svg')
                no-repeat center;
                background-size : 100%;
              }
            }
          }
        }
      }
      .el-tabs__content {
        // height : calc(100% - 50px);
      }
      .el-tab-pane {
        height : 100%;
      }
    }
  }
}

</style>
