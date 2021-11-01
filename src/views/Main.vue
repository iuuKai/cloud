<template>
  <!-- 这里是主要的渲染区域，所有的模板切换都是基于此的 -->
  <el-container style="height: 100vh">
    <!-- 加入企业窗口 -->
    <JoinCompany v-model="dialogJoin"></JoinCompany>
    <el-header height="52px">
      <CommonHeader
        v-model="currTab"
        :fixedTabs="fixedTabs"
        :floatTabs="floatTabs"
        @tab-click="tabClick"
        @tab-remove="tabRemove"
        @on-to-user="toUserInfo"
      ></CommonHeader>
    </el-header>
    <el-main>
      <keep-alive>
        <component
          :is="currTabComponent"
          :curr-tab="currTab"
          @open-join-company="dialogJoin = true"
          @menu-click="menuClick"
        ></component>
      </keep-alive>
    </el-main>
  </el-container>
</template>

<script>
/**
 * 前往【个人中心】逻辑在这里
 */
import { mapState, mapGetters } from 'vuex'

// 公共组件
import CommonHeader from '@/components/common/CommonHeader'
import JoinCompany from '@/components/joinCompany'

// 页面组件
import Home from '@/views/Home/CloudHome'
import Console from '@/views/Console/Console'
import Content from '@/views/Content/Content'

export default {
  created () {
    this.initToJoin()
  },
  data () {
    return {
      currTab: '首页',
      list: ['Home', 'Console', 'Content'],
      // 加入企业
      dialogJoin: false
    }
  },
  computed: {
    ...mapState({
      // 固定页签
      fixedTabs: state => state.menu.fixedTabs,
      // 浮动页签
      floatTabs: state => state.menu.floatTabs
    }),
    // menuTree () {
    //   return this.$store.getters['menu/menuTree']
    // },
    ...mapGetters('menu', ['menuTree']),
    // 切换组件
    currTabComponent () {
      let component = ''
      switch (this.currTab) {
        case '首页':
          component = 'Home'
          break
        case '应用':
          component = 'Console'
          break
        default:
          component = 'Content'
          break
      }
      return component
    }
  },
  methods: {
    // 初始化，如果是刚注册的用户，直接弹出
    initToJoin () {
      // 后继再搞
      this.dialogJoin = this.$route.params.isNewReg
      // this.$message.warning('加入企业，尽请期待...')
    },
    // 前往个人中心（用户明细）
    toUserInfo () {
      const currTab = '基础设置'
      const currSubTab = '用户表单'
      // 找一级页签
      const isFindParent = this.floatTabs.find(({ name }) => name === currTab)
      // 如果能找到
      if (isFindParent) {
        const isFindChild = isFindParent.tabs.find(({ name }) => name === currSubTab)
        // 如果能够找到二级页签就直接前往
        if (isFindChild) {
          isFindParent.currSubTab = currSubTab
          /**
           * 同时修改下 info，因为有可能之前是查看的他人的
           */
        } else {
          isFindParent.currSubTab = currSubTab
          // 找不到就直接新增
          const parent = this.menuTree[0].children.find(({ menuName }) => menuName === currTab)
          // const { id, menuName, isShow, children } = parent
          // const name = menuName.replace(/^\s*|\s*$/g, '')
          // 这里写死的，反正看后端了
          this.currTab = currTab
          const child = parent.children.map(item => {
            if (item.menuName === '用户') {
              const { id, menuName: name, isShow, children } = item.children.find(({ menuName }) => menuName === currSubTab)
              return { id, name, isShow, children }
            }
          }).filter(Boolean)
          console.log(child)
          this.$store.commit('menu/addSubTab', {
            pTabName: currTab,
            item: child[0]
          })
          // 参数，啥都不用
          this.$store.commit('updateUser', {
            subTab: child[0].name,
            props: {
              type: 'view',
              // 请求参数为当前用户 id
              params: {
                userId: this.$store.state.user.user.id
              }
            }
          })
        }
        // console.log(isFindChild)
      } else {
        // 找不到就直接新增
        const parent = this.menuTree[0].children.find(({ menuName }) => menuName === currTab)
        const { id, menuName, isShow, children } = parent
        const name = menuName.replace(/^\s*|\s*$/g, '')
        // 这里写死的，反正看后端了
        this.currTab = currTab
        // const currSubTab = '用户表单'
        const child = parent.children.map(item => {
          if (item.menuName === '用户') {
            const { id, menuName: name, isShow, children } = item.children.find(({ menuName }) => menuName === currSubTab)
            return { id, name, isShow, children }
          }
        }).filter(Boolean)
        console.log(child)
        const tabs = [{ name: '首页' }, ...child]
        this.$store.commit('menu/addTab', {
          id,
          name,
          isShow,
          currSubTab,
          // 二级页签
          tabs,
          children
        })
        // 参数，啥都不用
        this.$store.commit('updateUser', {
          subTab: child[0].name,
          props: {
            type: 'view',
            // 请求参数为当前用户 id
            params: {
              userId: this.$store.state.user.user.id
            }
          }
        })
      }
    },
    tabClick (tag) {
      console.log('%c [ 点击标签 ]', 'font-size:13px; background:pink; color:#bf2c9f;', tag)
    },
    tabRemove (tag) {
      const tabs = this.floatTabs
      let activeTab = this.currTab
      console.log('%c [ 移除标签 ]', 'font-size:13px; background:pink; color:#bf2c9f;', tag, activeTab)
      // 删除自己
      if (activeTab === tag) {
        tabs.forEach((tab, index, arr) => {
          if (tab.name === tag) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            // 下一个页签转为前面或后面的
            if (nextTab) {
              activeTab = nextTab.name
            } else {
              // 不管了，直接就返回到固定最后一项，此处是直接去 "应用"
              activeTab = this.fixedTabs[this.fixedTabs.length - 1].name
            }
          }
        })
      }
      this.currTab = activeTab
      this.$store.commit('menu/removeTab', tag)
    },
    menuClick (item) {
      console.log('%c [ 模块菜单 ]', 'font-size:13px; background:pink; color:#bf2c9f;', item)
      const { id, menuName, isShow, children } = item
      const name = menuName.replace(/^\s*|\s*$/g, '')
      this.currTab = name
      this.$store.commit('menu/addTab', {
        id,
        name,
        isShow,
        currSubTab: '首页',
        // 二级页签
        tabs: [{ name: '首页' }],
        children
      })
    }
  },
  components: {
    CommonHeader,
    JoinCompany,
    Home,
    Console,
    Content
  }
}
</script>

<style lang="scss" scoped>
.el-header {
  padding: 0;
  border-bottom: 1px solid #e7e7e7;
}
.el-main {
  padding: 0;
  background-color: #e3e6ee;
}
</style>
