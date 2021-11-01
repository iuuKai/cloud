<template>
  <!-- 采购订单信息：增、改、查 -->
  <PurchaseOrderInfo v-if="info"></PurchaseOrderInfo>
  <el-row v-else class="purchase-order-wrap">
    <CommonSearch
      title="采购订单列表"
      search-placeholder="请输入单据编号"
      :filterData="filterData"
      :filterLabel="filterLabel"
      :button-group="btnList"
      @on-button-click="handleClick"
    ></CommonSearch>
    <el-card style="margin: 10px; height: 100%" :body-style="{ padding: '0' }">
      <CommonTable
        :tableData="tableData"
        :tableLabel="tableLabel"
        :pageConfig="queryInfo"
        @link-click="handleInfoView"
        @size-change="changeLimit"
        @current-change="changePage"
        @selection-change="multipleSelection = $event"
      ></CommonTable>
    </el-card>
  </el-row>
</template>

<script>
import PurchaseOrderInfo from './PurchaseOrderInfo'
import CommonSearch from '@/components/common/CommonSearch'
import CommonTable from '@/components/common/CommonTable'
// import ItemButton from '@/components/form/button'

export default {
  created () {
    this.initInfo()
    this.getPODetailList()
  },
  data () {
    return {
      // 控制详情页是什么类型：add、view、add
      info: '',
      // // 控制折叠
      // activeName: '1',
      // // 日期默认值
      // radio: '',
      // // 日期可选值
      // radioList: ['今天', '本周', '本月', '过去三个月'],
      // // 未交货数
      // value: '大',
      // // 未交货数选择
      // options: [
      //   { value: '大', label: '大' },
      //   { value: '中', label: '中' },
      //   { value: '小', label: '小' }
      // ],
      // // 是否多选
      // isMultiple: '',
      // // 按角色搜索
      // filterItem: '',
      // // 按钮组
      // btnList: ['生成送货单', '下载', '打印', '刷新', '退出'],
      filterData: {
        row1: [],
        row2: ''
      },
      filterLabel: [
        // 常用条件
        {
          tabName: '常用条件',
          rowList: [
            {
              model: 'row1',
              label: '日期',
              type: 'date'
              // options: ['深圳高睿咨询有限公司', '华为技术有限公司', '腾讯科技（深圳）有限公司'],
              // 这个是首项
              // noLimit: '不限',
              // 允许多选
              // multiple: true,
              // 更多
              // more: true
            },
            {
              model: 'row2',
              label: '未交货数',
              type: 'text',
              slotType: 'select',
              slotOptions: ['大于', '等于', '小于'],
              // 这个是首项
              noLimit: '不限',
              // 允许多选
              multiple: true
            }
          ]
        },
        // 自定义查询
        {
          tabName: '自定义查询'
        }
      ],
      btnList: ['新增', '删除', '禁用', '更多', '刷新', '退出'],
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
        { model: 'billNo', label: '采购单号', slotType: 'link', minWidth: '130px' },
        { model: 'billDate', label: '日期', minWidth: '180px' },
        { model: 'supplier', label: '供应商名称', minWidth: '250px' },
        { model: '4', label: '需方名称', minWidth: '250px' },
        { model: '5', label: '币别' },
        { model: '6', label: '汇率' },
        { model: 'dNo', label: '采购单行号', minWidth: '100px', align: 'center' },
        { model: 'productNo', label: '物料代码', minWidth: '150px' },
        { model: 'itemName', label: '物料名称', minWidth: '150px' },
        { model: 'SPEC', label: '规格型号', align: 'center' },
        { model: 'unit', label: '单位', align: 'center' },
        { model: 'orderNum', label: '订单数量', align: 'center' },
        { model: 'resideNum', label: '剩余未交货数量', minWidth: '120px', align: 'center' },
        { model: 'takeNum', label: '收货数量', align: 'center' },
        { model: 'putNum', label: '入库数量', align: 'center' },
        { model: 'returnNum', label: '验退数量', align: 'center' },
        { model: 'auxPrice', label: '不含税单价', minWidth: '120px', align: 'center' },
        { model: 'auxTaxPrice', label: '含税单价', align: 'center' },
        { model: 'cess', label: '税率', align: 'center' },
        { model: 'amount', label: '不含税金额', minWidth: '120px', align: 'center' },
        { model: 'allAmount', label: '含税金额', align: 'center' },
        { model: 'taxAmount', label: '税额', align: 'center' },
        { model: 'checkSign', label: '审核标志', align: 'center' },
        { model: 'closeSign', label: '关闭标志', align: 'center' },
        { model: '25', label: '企业号', align: 'center' },
        { model: '26', label: '制单人', align: 'center' }
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
    getPODetailList () {
      const params = {
        pages: this.queryInfo.currPage,
        size: this.queryInfo.limit
      }
      this.$api.po.PODetailList(params).then(res => {
        console.log(res)
        this.tableData = res.list
        this.queryInfo.startRow = res.startRow
        this.queryInfo.total = res.total
      }).catch(err => {
        this.$message.error(err)
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
        case '更多': console.log(item)
          break
        case '刷新': this.getPODetailList()
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
        this.$router.push({ query: { info: 'view', id, companyNo } })
      }
    },
    // 更改每页条数
    changeLimit (limit) {
      this.queryInfo.limit = limit
      this.getPODetailList()
    },
    // 更改当前页
    changePage (page) {
      this.queryInfo.currPage = page
      this.getPODetailList()
    }
  },
  components: {
    PurchaseOrderInfo,
    CommonSearch,
    CommonTable
    // ItemButton
  }
}
</script>

<style lang="scss" scoped>
</style>
