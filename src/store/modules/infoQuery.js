/**
 * 管理每个明细组件页面的参数（太复杂了只能这样了）
 */
export default {
  state: () => ({
    /**
     * subTab: '人员列表' 啥的，二级页签
     * props: 一些 props 数据
     * type: 'view' || 'add' || 'edit' 查、增、编
     */
    queryList: [
      // 多个相同页签还不考虑，太复杂
      // { subTab: '', props: { type: '', ... } }
    ]
  }),
  mutations: {
    updateUser (state, obj) {
      const index = state.queryList.findIndex(({ subTab }) => subTab === obj.subTab)
      // 如果存在，则修改
      if (index > -1) {
        state.queryList.splice(index, 1, obj)
      } else {
        state.queryList.push(obj)
      }
    }
  },
  actions: {
  }
}
