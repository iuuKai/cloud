<template>
  <CommonTable
    :showTotal="false"
    :tableData="tableData"
    :tableLabel="tableLabel"
    :pageConfig="queryInfo"
    @size-change="changeLimit"
    @current-change="changePage"
  ></CommonTable>
</template>

<script>
import CommonTable from '@/components/common/CommonTable'

export default {
  data () {
    return {
      // 查询配置
      queryInfo: {
        // 默认每页条数
        limit: 10,
        // 默认当前页数
        currPage: 1,
        // 条目总数，需至少请求一次才能获取
        total: 0,
        // 开始序号
        startRow: 1
      },
      tableData: [],
      tableLabel: [
        { label: '#', type: 'index', align: 'center' },
        { model: '1', label: '系统名称', width: '120px' },
        { model: '2', label: '版本号', minWidth: '250px' },
        { model: '3', label: 'API地址', width: '180px' },
        { model: '4', label: 'API Key' },
        // { model: '5', label: '联系电话' },
        { model: '6', label: '数据地址', minWidth: '100px' },
        { model: '7', label: '账号', minWidth: '100px' },
        { model: '8', label: '密码', minWidth: '100px' },
        { model: '9', label: '创建人' },
        { model: 'createDateTime', label: '创建日期', minWidth: '150px' }
      ]
    }
  },
  methods: {
    // 更改每页条数
    changeLimit (limit) {
      this.queryInfo.limit = limit
      // this.getUserDetailList()
    },
    // 更改当前页
    changePage (page) {
      this.queryInfo.currPage = page
      // this.getUserDetailList()
    }
  },
  components: {
    CommonTable
  }
}
</script>

<style lang="scss">
</style>
