<template>
  <CommomList
    :search-title="searchInfo.title"
    :search.sync="searchInfo.search"
    :search-placeholder="searchInfo.placeholder"
    :search-data="searchInfo.data"
    :search-label="searchInfo.label"
    :search-button-group="searchInfo.buttonGroup"
    :table-row-key="tableInfo.rowKey"
    :table-page-config="tableInfo.pageConfig"
    :table-data="tableInfo.data"
    :table-label="tableInfo.label"
    :more-visible.sync="moreInfo.visible"
    :more-title="moreInfo.title"
    :more-width="moreInfo.width"
    :more-search-placeholder="moreInfo.placeholder"
    :more-selection="moreInfo.selection"
    :more-pageConfig="moreInfo.pageConfig"
    :more-table-data="moreInfo.data"
    :more-table-label="moreInfo.label"
    @on-button-click="handleClick"
    @link-click="handleInfo('view', $event)"
    @size-change="$emit('size-change', $event)"
    @current-change="$emit('current-change', $event)"
    @selection-change="tableInfo.selection = $event"
    @more-submit="handleMoreSearch"
  ></CommomList>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

import CommomList from '@/components/common/CommonList'

export default {
  created () {
    this.init()
  },
  mounted () {
  },
  data () {
    return {
      subTab: '角色列表',
      companyList: [],
      searchInfo: {
        title: '角色',
        search: '',
        placeholder: '请输入角色名称',
        data: {
          row1: [],
          row2: []
        },
        label: [
          // 常用条件
          {
            tabName: '常用条件',
            rowList: [
              {
                model: 'row1',
                label: '企业名称',
                // 如果首项是 noLimit 则 value, label 一致
                options: [{ value: '不限', label: '不限' }],
                noLimit: '不限',
                // 允许多选
                multiple: true,
                // 限制长度出现更多
                max: 4,
                // 更多
                more: true
              },
              {
                model: 'row2',
                label: '使用状态',
                options: [
                  { value: '不限', label: '不限' },
                  { value: '0', label: '禁用' },
                  { value: '1', label: '可用' }
                ],
                noLimit: '不限'
              }
            ]
          },
          // 自定义查询
          {
            tabName: '自定义查询'
          }
        ],
        buttonGroup: ['新增', '删除', '禁用', '更多', '刷新', '退出']
      },
      tableInfo: {
        // 多选
        selection: [],
        pageConfig: {
          // 默认每页条数
          limit: 10,
          // 跳过条数
          skip: 0,
          // 默认当前页数
          currPage: 1,
          // 条目总数，需至少请求一次才能获取
          total: 0,
          // 开始序号
          startRow: 1
        },
        data: [],
        label: [
          { label: '多选', type: 'selection' },
          { label: '#', type: 'index', align: 'center' },
          { model: 'roleName', label: '角色名称', width: '200px', slotType: 'link' },
          // { model: 'roleType', label: '角色类型' },
          { model: 'companyNo', label: '高睿云企业号', width: '150px' },
          { model: 'companyName', label: '企业名称', minWidth: '200px' },
          { model: 'remark', label: '备注', minWidth: '200px' },
          { model: 'creater', label: '创建人', width: '100px' },
          { model: 'createDateTime', label: '创建日期', width: '150px' },
          { model: 'status', label: '使用状态', width: '80px', filter: [{ from: '0', to: '禁用' }, { from: '1', to: '可用' }] }
        ]
      },
      moreInfo: {
        visible: false,
        title: '企业资料列表',
        width: '1000px',
        placeholder: '请输入高睿云企业号/企业名称',
        selection: [],
        pageConfig: {
          // 默认每页条数
          limit: 10,
          // 跳过条数
          skip: 0,
          // 默认当前页数
          currPage: 1,
          // 条目总数，需至少请求一次才能获取
          total: 0,
          // 开始序号
          startRow: 1
        },
        data: [],
        label: [
          { label: '多选', type: 'selection' },
          { label: '#', type: 'index', width: '50px', align: 'center' },
          { model: 'companyNo', label: '高睿云企业号', width: '150px' },
          { model: 'companyName', label: '企业名称' },
          { model: 'creditCode', label: '统一信用码' },
          { model: 'status', label: '使用状态', width: '100px', align: 'center', filter: [{ from: '0', to: '禁用' }, { from: '1', to: '可用' }] }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      menuTree: state => state.menu.menuTree,
      // 固定页签
      fixedTabs: state => state.menu.fixedTabs,
      // 浮动页签
      floatTabs: state => state.menu.floatTabs
    }),
    ...mapGetters('menu', ['menuTree']),
    // 筛选搜索值
    search () {
      return this.searchInfo.search
    },
    // 筛选条件
    filterData () {
      return this.searchInfo.data
    },
    // 表格多选
    tableSelection () {
      return this.tableInfo.selection
    },
    // 有权限的按钮
    authorityBtn () {
      const parent = this.floatTabs.find(({ currSubTab }) => currSubTab === '角色列表')
      const child = parent.children.find(({ menuName }) => menuName.indexOf('角色') > -1)
      return child.children.filter(({ remark, isShow }) => !remark && isShow === '1').map(({ menuName }) => menuName)
    }
  },
  watch: {
    search (newValue, oldValue) {
      this.getRoleList(newValue)
    },
    filterData: {
      handler (newValue, oldValue) {
        this.init()
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations('menu', [
      'openLoading',
      'closeLoading'
    ]),
    init () {
      // 异步加载顺序
      this.getCompanyListByUserId().then(res => {
        this.getRoleList()
      })
    },
    // 获取选中用户绑定所有公司
    getCompanyListByUserId () {
      return new Promise((resolve, reject) => {
        const params = {
          userId: this.$store.state.user.user.id,
          pages: 1,
          size: 10
        }
        this.$api.company.companyListByUserId(params).then(res => {
          console.log('%c [ 企业列表 ]', 'font-size:13px; background:pink; color:#bf2c9f;', res.list)
          const list = res.list.map(item => {
            const { companyNo: value, companyName: label } = item
            return { value, label }
          })
          // 过滤第一行的 label
          const row1 = this.searchInfo.label[0].rowList[0]
          if (row1.options.length === 1) {
            row1.options = row1.options.concat(list)
            this.companyList = list
          }
          resolve()
        }).catch(err => {
          this.$message.error(err)
        })
      })
    },
    // 获取角色列表
    getRoleList (roleName) {
      this.openLoading()
      // 过滤出状态
      const row2 = this.searchInfo.data.row2[0].label
      const status = row2 === '禁用' ? 0 : row2 === '可用' ? 1 : ''
      console.log(status)
      const list = this.searchInfo.data.row1.filter(({ label }) => label !== '不限')
      const filterA = list.length > 0 ? list : this.companyList
      const filterB = this.moreInfo.selection.map(({ companyNo }) => {
        return { value: companyNo }
      })
      // console.log(filterA, this.moreInfo.selection)

      const params = (filterB.length > 0 ? filterB : filterA).map(({ value: companyNo }) => {
        return {
          companyNo,
          roleName: roleName || '',
          status,
          pages: this.tableInfo.pageConfig.currPage,
          size: this.tableInfo.pageConfig.limit
        }
      })
      console.log('%c [ 角色列表参数 ]', 'font-size:13px; background:pink; color:#bf2c9f;', params)
      if (params.length === 0) return
      this.$api.role.roleCompanyList(params).then(res => {
        console.log('%c [ 角色列表 ]', 'font-size:13px; background:pink; color:#bf2c9f;', res.list)
        this.tableInfo.data = res.list
        this.tableInfo.pageConfig.total = res.total
        this.tableInfo.pageConfig.startRow = res.startRow
        setTimeout(_ => {
          this.closeLoading()
        }, 500)
      }).catch(err => {
        this.$message.error(err)
        setTimeout(_ => {
          this.closeLoading()
        }, 500)
      })
    },
    // 按钮
    handleClick (item) {
      item = item.replace(/^\s*|\s*$/, '')
      // if (!/刷新|更多|退出/.test(item)) {
      //   if (this.authorityBtn.indexOf(item) === -1) return this.$message.error('无权操作此项')
      // }
      switch (item) {
        case '新增': {
          this.handleInfo('add')
          break
        }
        case '删除': this.delRole()
          break
        case '刷新': {
          this.init()
          this.$message.success('刷新成功')
          break
        }
        case '禁用': console.log(item)
          break
        case '更多': console.log(item)
          break
        case '退出': this.$emit('tab-remove', this.subTab)
          break
      }
    },
    // 前往表单
    handleInfo (type, item) {
      console.log('item', item)
      /**
       * 留了个坑，待优化
       */

      const currTab = '基础设置'
      const currSubTab = '角色表单'
      // 找一级页签
      const isFindParent = this.floatTabs.find(({ name }) => name === currTab)
      // 如果能找到
      if (isFindParent) {
        const isFindChild = isFindParent.tabs.find(({ name }) => name === currSubTab)
        // 如果能够找到二级页签就直接前往
        if (isFindChild) {
          isFindParent.currSubTab = currSubTab
          const query = this.$store.state.info.queryList.find(({ subTab }) => subTab === currSubTab)
          query.props.type = type
          query.props.params = {
            id: item ? item.id : ''
          }
        } else {
          isFindParent.currSubTab = currSubTab
          // 找不到就直接新增
          const parent = this.menuTree[0].children.find(({ menuName }) => menuName === currTab)
          // const { id, menuName, isShow, children } = parent
          // const name = menuName.replace(/^\s*|\s*$/g, '')
          // 这里写死的，反正看后端了
          this.currTab = currTab
          const child = parent.children.map(item => {
            if (item.menuName === '角色') {
              const { id, menuName: name, isShow, children } = item.children.find(({ menuName }) => menuName === currSubTab)
              return { id, name, isShow, children }
            }
          }).filter(Boolean)
          this.$store.commit('menu/addSubTab', {
            pTabName: currTab,
            item: child[0]
          })
          // 参数，啥都不用
          this.$store.commit('updateUser', {
            subTab: child[0].name,
            props: {
              type,
              // 请求参数为当前用户 id
              params: {
                id: item ? item.id : ''
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
        const child = parent.children.map(item => {
          if (item.menuName === '角色') {
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
            type,
            // 请求参数为当前用户 id
            params: {
              id: item ? item.id : ''
            }
          }
        })
      }
    },
    // 删除角色
    delRole () {
      if (this.tableSelection.length === 0) {
        return this.$message.error('请至少选中一个角色')
      }
      this.$confirm('此操作将永久删除选中角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = this.tableSelection.map(({ id, companyNo }) => {
          return {
            id,
            companyNo,
            userId: this.$store.state.user.user.id
          }
        })
        this.$api.role.delRole(params).then(res => {
          this.getRoleList()
          this.$message.success('删除成功!')
        }).catch(err => {
          this.$message.error(err)
        })
      }).catch(() => {
        this.$message.error('已取消删除')
      })
    },
    handleMoreSearch () {
      this.moreInfo.visible = false
    }
  },
  components: {
    CommomList
  }
}
</script>

<style lang="scss">
</style>
