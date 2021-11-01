<template>
  <!-- 企业信息：增、改、查 -->
  <!-- <EnterpriseInfo v-if="info"></EnterpriseInfo> -->
  <el-row class="enterprise-wrap">
    <CommonSearch
      title="企业"
      search-placeholder="请输入高睿云企业号/企业名称"
      :filterData="filterData"
      :filterLabel="filterLabel"
      :button-group="btnList"
      @on-button-click="handleClick"
    ></CommonSearch>
    <CommonTable
      :tableData="tableData"
      :tableLabel="tableLabel"
      :pageConfig="queryInfo"
      @link-click="handleInfoView"
      @size-change="changeLimit"
      @current-change="changePage"
      @selection-change="multipleSelection = $event"
    ></CommonTable>
  </el-row>
</template>

<script>
// import Company from './EnterpriseInfo'
import CommonSearch from '@/components/common/CommonSearch'
import CommonTable from '@/components/common/CommonTable'

export default {
  created () {
    this.initInfo()
    this.getCompanyList()
  },
  data () {
    return {
      // 控制详情页是什么类型：add、view、add
      info: '',
      filterData: {
        row1: ['不限'],
        row2: ''
      },
      filterLabel: [
        // 常用条件
        {
          tabName: '常用条件',
          rowList: [
            {
              model: 'row1',
              label: '使用状态',
              options: ['禁用', '可用'],
              // 这个是首项
              noLimit: '不限',
              // 允许多选
              multiple: true,
              // 更多
              more: true
            },
            {
              model: 'row2',
              label: '高睿云企业号'
            }
          ]
        },
        // 自定义查询
        {
          tabName: '自定义查询'
        }
      ],
      // 按钮组
      btnList: ['新增', '删除', '禁用', '刷新', '退出'],
      // 查询配置
      queryInfo: {
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
      // 表格多选
      multipleSelection: [],
      tableData: [],
      tableLabel: [
        { label: '多选', type: 'selection' },
        { label: '#', type: 'index', align: 'center' },
        { model: 'companyNo', label: '企业号' },
        { model: 'companyName', label: '企业名称', slotType: 'link' },
        { model: 'wheelName', label: '联系人' },
        { model: 'phoneNo', label: '联系电话' }
      ]
    }
  },
  watch: {
    $route (newValue, oldValue) {
      console.log(newValue.query)
      if (newValue.query && newValue.query.info) {
        this.info = newValue.query.info
      } else {
        this.info = ''
      }
    }
  },
  methods: {
    initInfo () {
      this.info = this.$route.query.info
    },
    // 获取用户列表
    getCompanyList () {
      const params = {
        pages: this.queryInfo.currPage,
        size: this.queryInfo.limit,
        companyNo: this.$store.state.user.user.companyNo
      }
      this.$api.company.companyList(params).then(res => {
        console.log('%c [ 企业列表 ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
        this.tableData = res.list
        this.queryInfo.total = res.total
        this.queryInfo.startRow = res.startRow
      })
    },
    // 折叠
    changeCollapse () {
      if (this.activeName) {
        this.$refs.collapse.handleItemClick('1')
      } else {
        this.$refs.collapse.setActiveNames('1')
      }
    },
    // 按钮
    handleClick (item) {
      switch (item) {
        case '新增': this.$router.push({ query: { info: 'add' } })
          break
        case '删除': console.log(item)
          break
        case '禁用': console.log(item)
          break
        case '刷新': this.getCompanyList()
          break
        case '退出': this.$emit('on-exit', this.$route.path)
          break
      }
    },
    // 新增
    handleAddView () { },
    // 查看
    handleInfoView ({ id, companyNo }) {
      if (!this.$route.query || this.$route.query.info !== 'view') {
        this.$router.push({ query: { info: 'view', id } })
      }
    },
    // 更改每页条数
    changeLimit (limit) {
      this.queryInfo.limit = limit
      this.getCompanyList()
    },
    // 更改当前页
    changePage (page) {
      this.queryInfo.currPage = page
      this.getCompanyList()
    }
  },
  components: {
    // EnterpriseInfo,
    CommonSearch,
    CommonTable
    // ItemButton
  }
}
</script>

<style lang="scss" scoped>
</style>
