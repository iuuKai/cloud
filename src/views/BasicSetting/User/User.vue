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
    :more-search.sync="moreInfo.search"
    :more-search-placeholder="moreInfo.placeholder"
    :more-default-selection="moreInfo.selection"
    :more-pageConfig="moreInfo.pageConfig"
    :more-table-data="moreInfo.data"
    :more-table-label="moreInfo.label"
    @on-button-click="handleClick"
    @on-open-more="moreInfo.visible = true"
    @link-click="handleInfo('view', $event)"
    @size-change="$emit('size-change', $event)"
    @current-change="$emit('current-change', $event)"
    @selection-change="tableInfo.selection = $event"
    @more-size-change="$emit('size-change', $event)"
    @more-current-change="$emit('current-change', $event)"
    @more-selection-change="moreInfo.selection = $event"
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
      subTab: '用户列表',
      companyList: [],
      searchInfo: {
        title: '用户',
        search: '',
        placeholder: '请输入姓名/手机号',
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
        buttonGroup: ['刷新', '更多', '退出']
      },
      tableInfo: {
        rowKey: 'companyNo',
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
          { label: '#', type: 'index', width: '50px', align: 'center' },
          { model: 'userImgUrl', label: '头像', slotType: 'avatar', width: '50px', align: 'center' },
          { model: 'employName', label: '姓名', slotType: 'link', width: '200px' },
          { model: 'userPhone', label: '手机号', slotType: 'link', width: '150px' },
          { model: 'sex', label: '性别', width: '50px', align: 'center' },
          { model: 'companyNo', label: '高睿云企业号', minWidth: '180px' },
          { model: 'depart', label: '部门' },
          { model: 'roleName', label: '角色', width: '110px' },
          { model: 'companyName', label: '企业名称', minWidth: '180px' },
          { model: 'status', label: '使用状态', filter: [{ from: '0', to: '禁用' }, { from: '1', to: '可用' }] }
        ]
      },
      moreInfo: {
        visible: false,
        title: '企业资料列表',
        width: '1000px',
        search: '',
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
          { model: 'creditCode', label: '统一社会信用代码' },
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
      const parent = this.floatTabs.find(({ currSubTab }) => currSubTab === '用户列表')
      const child = parent.children.find(({ menuName }) => menuName.indexOf('用户') > -1)
      return child.children.filter(({ remark, isShow }) => !remark && isShow === '1').map(({ menuName }) => menuName)
    },
    moreSearch () {
      return this.moreInfo.search
    },
    moreSelection () {
      return this.moreInfo.selection
    },
    dialogMore () {
      return this.moreInfo.visible
    }
  },
  watch: {
    search (newValue, oldValue) {
      this.getUserList(newValue)
    },
    filterData: {
      handler (newValue, oldValue) {
        this.init()
      },
      deep: true
    },
    moreSearch (newValue, oldValue) {
      this.getCompanyListByUserIdToMore(newValue)
    },
    moreSelection (newValue, oldValue) {
      console.log(newValue)
    },
    dialogMore (newValue, oldValue) {
      if (newValue) {
        this.getCompanyListByUserIdToMore()
      } else {
        // 还不知道是否重置
      }
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
        this.getUserList()
      })
    },
    // 获取更多弹窗里的公司列表
    getCompanyListByUserIdToMore (key) {
      const params = {
        userId: this.$store.state.user.user.id,
        key: key || '',
        pages: this.moreInfo.pageConfig.currPage,
        size: this.moreInfo.pageConfig.limit
      }
      this.$api.company.companyListByUserId(params).then(res => {
        console.log('%c [ 更多的公司列表 ]', 'font-size:13px; background:pink; color:#bf2c9f;', res.list)
        this.moreInfo.data = res.list
        this.moreInfo.pageConfig.startRow = res.startRow
        this.moreInfo.pageConfig.total = res.total
      }).catch(err => {
        this.$message.error(err)
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
    // 获取用户列表
    getUserList (key) {
      this.openLoading()
      // 过滤出状态
      const str = this.filterData.row2[0].label
      const status = str === '禁用' ? 0 : str === '可用' ? 1 : ''

      // 过滤出公司
      const list = this.filterData.row1.filter(({ label }) => label !== '不限')
      const filterA = list.length > 0 ? list : this.companyList
      const filterB = this.moreSelection.map(({ companyNo }) => {
        return { value: companyNo }
      })

      const params = (filterB.length > 0 ? filterB : filterA).map(({ value: companyNo }) => {
        return {
          companyNo,
          key: key || '',
          status,
          pages: this.tableInfo.pageConfig.currPage,
          size: this.tableInfo.pageConfig.limit
        }
      })
      console.log('%c [ 用户列表参数 ]', 'font-size:13px; background:pink; color:#bf2c9f;', params)
      if (params.length === 0) return
      this.$api.user.userList(params).then(res => {
        console.log('%c [ 用户列表 ]', 'font-size:13px; background:pink; color:#bf2c9f;', res.list)
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
        case '刷新': {
          this.init()
          this.$message.success('刷新成功')
          break
        }
        case '禁用': console.log(item)
          break
        // 这个更多是按钮的，不是筛选的更多
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

      // 前往个人中心（用户明细）
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
          const query = this.$store.state.info.queryList.find(({ subTab }) => subTab === currSubTab)
          query.props.type = type
          query.props.params = {
            userId: item ? item.id : ''
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
              type,
              // 请求参数为当前用户 id
              params: {
                userId: item ? item.id : ''
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
            type,
            // 请求参数为当前用户 id
            params: {
              userId: item ? item.id : ''
            }
          }
        })
      }
    },
    // 更改每页条数
    changeLimit (limit) {
      this.queryInfo.limit = limit
      this.getUserList()
    },
    // 更改当前页
    changePage (page) {
      this.queryInfo.currPage = page
      this.getUserList()
    },
    // 更多企业
    companyChangeLimit (limit) {
      this.companyQueryInfo.limit = limit
      this.getCompanyListByUserIdFilter()
    },
    // 更多企业
    companyChangePage (page) {
      this.companyQueryInfo.currPage = page
      this.getCompanyListByUserIdFilter()
    },
    // 勾选更多企业并确定后触发查询
    handleMoreSearch () {
      this.moreInfo.visible = false
      this.init()
    }
  },
  components: {
    CommomList
  }
}
</script>

<style lang="scss">
</style>
