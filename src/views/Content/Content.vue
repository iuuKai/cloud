<template>
  <el-container>
    <!--  侧边栏  -->
    <el-aside width="auto">
      <CommonAside v-model="currTabMenuList" @menu-click="menuClick"></CommonAside>
    </el-aside>
    <!--  主内容  -->
    <el-main v-loading="isLoading">
      <el-tabs
        v-model="currSubTab"
        @tab-remove="subTabRemove"
        @tab-click="subTabClick"
      >
        <template v-for="item in currTabSubTabs">
          <el-tab-pane v-if="item.name === '首页'" :key="item.tabId || item.name" :name="item.tabId || item.name"></el-tab-pane>
          <el-tab-pane
            v-else
            :key="item.tabId || item.name"
            :label="item.name"
            :name="item.tabId || item.name"
            :closable="item.name !== '首页'"
          >
            <!-- <keep-alive> -->
              <component
                v-if="currSubTabComponent"
                class="sub-main__wrap"
                :is="currSubTabComponent"
                :menu-id="currSubTabId"
                @open-join-company="$emit('open-join-company')"
                @tab-remove="subTabRemove"
              ></component>
            <!-- </keep-alive> -->
          </el-tab-pane>
        </template>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import { mapState } from 'vuex'

import CommonAside from '@/components/common/CommonAside'

/** ==================== 所有模块下的菜单组件页都在这里了 ==================== **/

/**
 * 基础设置
 */
// 企业列表
import Company from '@/views/BasicSetting/Company/Company'
// 企业表单
import CompanyInfo from '@/views/BasicSetting/Company/CompanyInfo'
// 用户列表
import User from '@/views/BasicSetting/User/User'
// 用户表单
import UserInfo from '@/views/BasicSetting/User/UserInfo'
// 角色
import Role from '@/views/BasicSetting/Role/Role'
// 角色表达那
import RoleInfo from '@/views/BasicSetting/Role/RoleInfo'

export default {
  props: {
    currTab: String
  },
  data () {
    return {
      currSubTabId: 0
    }
  },
  computed: {
    ...mapState({
      queryList: state => state.info.queryList,
      // 固定页签
      fixedTabs: state => state.menu.fixedTabs,
      // 浮动页签
      floatTabs: state => state.menu.floatTabs,
      // 加载中
      isLoading: state => state.menu.isLoading
    }),
    // 当前页签
    currTabItem () {
      return this.floatTabs.find(({ name }) => name === this.currTab)
    },
    // 当前页签的侧边栏菜单
    currTabMenuList () {
      return this.currTabItem ? this.currTabItem.children : []
    },
    // 二级页签
    currTabSubTabs () {
      return this.currTabItem ? this.currTabItem.tabs : []
    },
    // 当前二级页签
    currSubTab: {
      get () {
        return this.currTabItem ? this.currTabItem.currSubTab : ''
      },
      set (val) {
        if (!this.currTabItem) return
        this.$store.commit('menu/updateSubTab', {
          pTabName: this.currTab,
          tagName: val
        })
      }
    },
    // 切换组件
    currSubTabComponent () {
      const subTab = this.currSubTab.replace(/^\s*|\s*$/, '')
      let component = ''
      switch (subTab) {
        case '企业列表':
          component = 'Company'
          break
        case '企业表单':
          component = 'CompanyInfo'
          break
        case '用户列表':
          component = 'User'
          break
        case '用户表单':
          component = 'UserInfo'
          break
        case '角色列表':
          component = 'Role'
          break
        case '角色表单':
          component = 'RoleInfo'
          break
        default:
          component = ''
          break
      }
      return component
    },
    // 拿到每个组件的参数
    params () {
      const isFind = this.queryList.find(({ subTab }) => subTab === this.currSubTab)
      return isFind ? isFind.props : {}
    }
  },
  methods: {
    menuClick (item) {
      console.log('%c [ 侧栏菜单 ]', 'font-size:13px; background:pink; color:#bf2c9f;', item.id)
      const { id, menuName, isShow, children } = item
      const name = menuName.replace(/^\s*|\s*$/g, '')
      this.currSubTab = name
      this.currSubTabId = id
      this.$store.commit('menu/addSubTab', {
        pTabName: this.currTab,
        item: {
          id,
          name,
          isShow,
          children
        }
      })
    },
    subTabClick (tab) {
    },
    subTabRemove (tag) {
      const tabs = this.currTabSubTabs
      let activeTab = this.currSubTab
      console.log('%c [ 移除二级标签 ]', 'font-size:13px; background:pink; color:#bf2c9f;', tag, activeTab)
      // 删除自己
      if (activeTab === tag) {
        tabs.forEach((tab, index) => {
          if (tab.name === tag) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            // 下一个页签转为前面或后面的
            if (nextTab) {
              activeTab = nextTab.name
            }
          }
        })
      }
      this.$store.commit('menu/removeSubTab', {
        pTabName: this.currTab,
        item: tag
      })
      this.currSubTab = activeTab
    }
  },
  components: {
    CommonAside,
    Company,
    CompanyInfo,
    User,
    UserInfo,
    Role,
    RoleInfo
  }
}
</script>

<style lang="scss" scoped>
// @import '~@/assets/scss/commonMain';

.el-container {
  height : calc(100vh - 52px);
  .el-aside {
    overflow : hidden;
  }
  .el-main {
    padding : 0;
    ::v-deep .el-tabs {
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
                color: #1E73BA;
                .el-icon-close {
                  opacity : 1;
                }
              }
              // 因为第一个是下划线
              &:nth-child(2) {
                padding : 0;
                width : 16px;
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
      .sub-main__wrap {
        .btn-group {
          .el-button {
            width : auto;
          }
        }
        .el-input {
          .el-input__inner {
            border : 0 none;
            border-bottom : 1px solid #BBBBBB;
            border-radius : 0;
            background-color: transparent;
          }
        }
      }
    }
  }
}

</style>
