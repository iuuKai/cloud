import api from '@/utils/api'
// import router from '@/router'
// import Cookie from 'js-cookie'

export default {
  namespaced: true,
  state: () => ({
    // 加入企业成功（用于触发 UserInfo.vue 的刷新）
    joinRefresh: false,
    // 加载中
    isLoading: false,
    isCollapse: true,
    // 跟菜单 Id
    rootMenuId: 0,
    // 所有菜单（包括根）
    allMenuTree: [],
    // 固定页签
    fixedTabs: [
      { name: '首页', component: 'Home' },
      { name: '应用', component: 'Console' }
    ],
    // 浮动页签
    floatTabs: [],
    // 侧边栏
    asideMenuList: []
  }),
  getters: {
    menuTree (state) {
      return state.allMenuTree[0].children
    }
  },
  mutations: {
    changeJoinRefresh (state, val) {
      state.joinRefresh = val
    },
    collapseAsideMenu (state) {
      state.isCollapse = !state.isCollapse
    },
    // 一级页签添加
    addTab (state, item) {
      const isFind = state.floatTabs.findIndex(({ name }) => name === item.name) > -1
      if (isFind) return
      state.floatTabs.push(item)
    },
    // 一级页签移除
    removeTab (state, item) {
      const index = state.floatTabs.findIndex(({ name }) => name === item)
      state.floatTabs.splice(index, 1)
    },
    // 二级页签添加
    addSubTab (state, { pTabName, item }) {
      const parent = state.floatTabs.find(({ name }) => name === pTabName)
      const isFind = parent.tabs.findIndex(({ name }) => name === item.name) > -1
      if (isFind) return
      parent.tabs.push(item)
    },
    // 二级页签移除
    removeSubTab (state, { pTabName, item }) {
      const parent = state.floatTabs.find(({ name }) => name === pTabName)
      const index = parent.tabs.findIndex(({ name }) => name === item)
      parent.tabs.splice(index, 1)
    },
    // 更新当前二级页签
    updateSubTab (state, { pTabName, tagName }) {
      const parent = state.floatTabs.find(({ name }) => name === pTabName)
      parent.currSubTab = tagName
    },
    // 总的树节点
    setAllMenuTree (state, list) {
      state.allMenuTree = list
    },
    // 开启加载中
    openLoading (state) {
      state.isLoading = true
    },
    // 关闭加载中
    closeLoading (state) {
      state.isLoading = false
    }
  },
  actions: {
    getMenuTree ({ state, getters, commit, dispatch, rootState }) {
      if (!rootState.user.user) return
      const params = {
        userId: rootState.user.user.id
      }
      return api.menu.getMenuTree(params).then(res => {
        console.log('%c [ 应用菜单树 ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
        state.rootMenuId = res[0].id
        commit('setAllMenuTree', res)
      })
    }
  }
}
