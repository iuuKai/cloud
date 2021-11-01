<template>
  <el-row>
    <CommonTable
      :type="info"
      :tableData="tableData"
      :tableLabel="tableLabel"
      :pageConfig="queryInfo"
      highlight-current-row
      @size-change="changeLimit"
      @current-change="changePage"
      @current-row-change="handleCurrentChange"
      @row-click="handleRowClick"
    ></CommonTable>
    <el-dialog
      title="新增用户"
      width="450px"
      :visible.sync="dialogVisible"
      @close="resetForm"
    >
      <el-form
        ref="form"
        :model="formData"
        :rules="formRules"
        inline
        size="mini"
        label-width="100px"
      >
        <el-form-item
          v-for="item in formLabel"
          :key="item.model"
          :label="item.label"
          :prop="item.model"
          :class="{
            'is-required': item.required
          }"
        >
          <el-select
            v-if="item.type === 'select'"
            v-model="formData[item.model]"
          >
            <el-option
              v-for="opt in item.options"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            >
            </el-option>
          </el-select>
          <el-input
            v-else
            v-model="formData[item.model]"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <ItemButton size="mini" @click="dialogVisible = false">取 消</ItemButton>
        <ItemButton size="mini" type="primary" @click="submitForm">确 定</ItemButton>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import CommonTable from '@/components/common/CommonTable'
import ItemButton from '@/components/form/button'

export default {
  props: {
    info: String,
    companyNo: String
  },
  created () {
    this.init()
  },
  data () {
    return {
      dialogVisible: false,
      // 当前选中行
      currentRow: {},
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
      // 企业可用角色
      companyRoleList: [],
      formData: {},
      formLabel: [
        { model: 'employName', label: '姓名' },
        { model: 'userPhone', label: '手机号码', required: true },
        { model: '1', label: 'ERP账号' },
        { model: 'depart', label: '部门' },
        { model: 'roleId', label: '角色', type: 'select', options: [], required: true }
      ],
      formRules: {},
      tableData: [],
      tableLabel: [
        { label: '#', type: 'index', align: 'center' },
        { model: 'employName', label: '姓名', width: '120px', allowEdit: true },
        { model: 'userPhone', label: '手机号码', minWidth: '100px', required: true, allowEdit: true },
        { model: '1', label: 'ERP账号', allowEdit: true },
        { model: 'depart', label: '部门', width: '180px', allowEdit: true },
        { model: 'roleName', label: '角色', required: true },
        { model: 'status', label: '状态', filter: [{ from: '0', to: '禁用' }, { from: '1', to: '可用' }, { from: '2', to: '邀请中' }, { from: '3', to: '验证中' }] },
        // { model: '3', label: '邀请状态', minWidth: '100px' },
        { model: 'creater', label: '创建人', minWidth: '100px' },
        { model: 'createDateTime', label: '创建日期', minWidth: '150px' }
      ],
      // 用于存储原table数据，因为需要对比筛选出哪些有变更
      list: []
    }
  },
  watch: {
    companyNo (newValue, oldValue) {
      if (newValue) {
        this.getPersonByCompany(newValue)
      }
    },
    currentRow (newValue, oldValue) {
      console.log('改变', newValue)
    }
  },
  methods: {
    init () {
      this.getCompanyRoleList()
      this.getPersonByCompany()
    },
    // 获取企业可用角色
    getCompanyRoleList () {
      const params = {
        companyNo: this.companyNo
      }
      this.$api.company.companyRoleList(params).then(res => {
        console.log(res)
        const role = this.formLabel.find(({ model }) => model === 'roleId')
        role.options = res.map(({ id: value, roleName: label }) => {
          return { value, label }
        })
      })
    },
    // 获取企业所有员工
    getPersonByCompany () {
      const params = {
        companyNo: this.companyNo
      }
      console.log('%c [ 企业所有员工参数 ]', 'font-size:13px; background:pink; color:#bf2c9f;', params)
      this.$api.company.personByCompany(params).then(res => {
        console.log('%c [ 企业所有员工 ]', 'font-size:13px; background:pink; color:#bf2c9f;', res.list)
        this.list = res.list
        this.tableData = res.list
        this.queryInfo.total = res.total
        this.queryInfo.startRow = res.startRow
      })
    },
    // 选中当前行
    handleCurrentChange (val) {
      this.currentRow = val
      console.log(val)
    },
    // 点击当前行
    handleRowClick (row, column) {
      console.log(row, column)
    },
    // 新增用户
    addCompanyUser () {
      this.dialogVisible = true
    },
    // 删除用户
    delCompanyUser () {
      if (!this.currentRow.id) return this.$message.error('当前无选中')
      const params = [{
        id: this.currentRow.webUserId,
        companyNo: this.companyNo,
        userId: this.$store.state.user.user.id
      }]
      console.log(params)
      this.$api.company.delCompanyUser(params).then(res => {
        this.getPersonByCompany()
        this.$message.success('用户删除成功')
      }).catch(err => {
        this.$message.error(err)
      })
    },
    // 启用用户
    enableCompanyUser () {
      if (!this.currentRow.id) return this.$message.error('当前无选中')
      const params = {
        id: this.currentRow.id
      }
      this.$api.company.enableCompanyUser(params).then(res => {
        this.getPersonByCompany()
        // res.employName
        this.$message.success(`用户 ${res.userPhone} 启用成功`)
      }).catch(err => {
        this.$message.error(err)
      })
    },
    // 禁用用户
    disableCompanyUser () {
      if (!this.currentRow.id) return this.$message.error('当前无选中')
      const params = {
        id: this.currentRow.id
      }
      this.$api.company.disableCompanyUser(params).then(res => {
        this.getPersonByCompany()
        // res.employName
        this.$message.success(`用户 ${res.userPhone} 禁用成功`)
      }).catch(err => {
        this.$message.error(err)
      })
    },
    submitForm () {
      // const updateTableList = this.
      // const params = [{
      //   ...this.formData,
      //   companyNo: this.companyNo,
      //   userId: this.$store.state.user.user.id
      // }]
      // this.$api.company.addCompanyUser(params).then(res => {
      //   this.dialogVisible = false
      //   this.getPersonByCompany()
      //   this.$message.success('用户新增成功')
      // }).catch(err => {
      //   this.$message.error(err)
      // })
    },
    resetForm () {
      this.$refs.form.resetFields()
    },
    // 更改每页条数
    changeLimit (limit) {
      this.queryInfo.limit = limit
      this.getPersonByCompany()
    },
    // 更改当前页
    changePage (page) {
      this.queryInfo.currPage = page
      this.getPersonByCompany()
    }
  },
  components: {
    CommonTable,
    ItemButton
  }
}
</script>

<style lang="scss">
.dialog-footer {
  .el-button {
    width: auto;
  }
}
</style>
