<template>
  <el-row class="info__wrap">
    <el-card class="btn-group__wrap" :body-style="{ padding: '10px 45px' }">
      <el-row class="btn-group" type="flex">
        <ItemButton
          type="primary"
          size="small"
          v-for="item in btnList"
          :key="item"
          @click="handleClick(item)"
        >
          {{ item }}
        </ItemButton>
      </el-row>
    </el-card>
    <el-row>
      <el-card :body-style="{ padding: '20px 0' }">
        <el-row type="flex">
          <el-col
            :span="3"
            style="width: 200px; min-width: 200px; text-align: center"
          >
            <!-- 头像 -->
            <UploadAvatar
              :file-list="fileList"
              :disabled="info === 'view'"
              @get-file-list="fileList = $event"
              @on-remove="handleRemove"
            ></UploadAvatar>
          </el-col>
          <el-col :span="21" style="width: 100%">
            <!-- 表单 -->
            <el-form
              ref="form"
              :model="formData"
              :rules="formRules"
              inline
              label-position="top"
              size="mini"
              :class="[
                'info-form',
                {
                  'is-view': info === 'view'
                }
              ]"
            >
              <el-row v-for="row in formLabel" :key="row.title">
                <el-row
                  class="title"
                  :style="{ marginTop: row.title === '账号信息' ? '20px' : '' }"
                  >{{ row.title }}</el-row
                >
                <el-row>
                  <el-form-item
                    v-for="item in row.children"
                    :key="item.model"
                    :label="item.label"
                    :prop="item.model"
                    :class="{
                      'is-required': item.required
                    }"
                  >
                    <template v-if="item.type === 'select'">
                      <el-tooltip v-if="item.tooltip && formData[item.model]" :content="formData[item.model]" :placement="item.tooltip">
                        <el-select
                          v-model="formData[item.model]"
                          :disabled="info === 'view'"
                        >
                          <el-option
                            v-for="opt in item.options"
                            :key="opt.value"
                            :label="opt.label"
                            :value="opt.value"
                          >
                          </el-option>
                        </el-select>
                      </el-tooltip>
                      <el-select
                          v-else
                          v-model="formData[item.model]"
                          :disabled="info === 'view' || item.disabled"
                        >
                          <el-option
                            v-for="opt in item.options"
                            :key="opt.value"
                            :label="opt.label"
                            :value="opt.value"
                          >
                          </el-option>
                        </el-select>
                    </template>
                    <el-date-picker
                      v-else-if="item.type === 'date'"
                      v-model="formData[item.model]"
                      :disabled="info === 'view'"
                      type="date"
                      placeholder="选择日期">
                    </el-date-picker>
                    <el-input
                      v-else
                      v-model="formData[item.model]"
                      :disabled="info === 'view' || item.disabled"
                    ></el-input>
                  </el-form-item>
                </el-row>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
    <el-row>
      <el-card
        style="margin-top: 0; height: 100%"
        :body-style="{ padding: '0' }"
      >
        <el-row>
          <el-radio-group v-model="radio" size="small">
            <el-radio-button
              v-for="item in radioList"
              :key="item"
              :label="item"
            ></el-radio-button>
          </el-radio-group>
        </el-row>
        <CommonTable
          :showTotal="false"
          :tableData="tableData"
          :tableLabel="tableLabel"
          :pageConfig="queryInfo"
          @size-change="changeLimit"
          @current-change="changePage"
          @selection-change="multipleSelection = $event"
        ></CommonTable>
      </el-card>
    </el-row>
  </el-row>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

import CommonTable from '@/components/common/CommonTable'
import UploadAvatar from '@/components/uploadAvatar'
import ItemButton from '@/components/form/button'

export default {
  props: {
    menuId: [String, Number]
  },
  created () {
    this.init()
  },
  data () {
    return {
      // 当前页签名
      subTab: '用户表单',
      // 企业列表
      companyList: [],
      // 头像
      fileList: [],
      // dialogJoin: false,
      radio: '我有工作权限的公司',
      radioList: ['我有工作权限的公司'],
      // 根据当前编辑、查看、新增改变按钮
      // addBtn: ['保存', '加入企业', '退出'],
      viewBtn: ['编辑', '加入企业', '刷新', '退出'],
      eidtBtn: ['保存', '加入企业', '退出'],
      // 多选
      multipleSelection: [],
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
      // 记录旧的roleId
      oldRoleId: '',
      formData: {
        employName: '',
        sex: '',
        idCard: '',
        birthday: '',
        belongCompany: '',
        lastLoginTime: '',
        userName: '',
        phone: '',
        mail: ''
      },
      formLabel: [
        {
          title: '基础信息',
          children: [
            { model: 'employName', label: '姓名' },
            {
              model: 'sex',
              label: '性别',
              type: 'select',
              options: [
                { value: '保密', label: '保密' },
                { value: '男', label: '男' },
                { value: '女', label: '女' }
              ]
            },
            { model: 'idCard', label: '身份证号' },
            { model: 'birthday', label: '生日', type: 'date' },
            { model: 'belongCompany', label: '默认企业', required: true, tooltip: 'top', type: 'select', options: [] },
            { model: 'lastLoginTime', label: '最后登录日期', disabled: true }
          ]
        },
        {
          title: '账号信息',
          children: [
            { model: 'userName', label: '用户名', required: true },
            { model: 'phone', label: '手机号码', required: true, disabled: true },
            { model: 'mail', label: '邮箱' },
            { model: 'wechat', label: '微信号' }
          ]
        }
      ],
      formRules: {
        mail: [
          { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '邮箱地址格式不正确', trigger: 'blur' }
        ]
      },
      tableData: [],
      tableLabel: [
        { label: '#', type: 'index', align: 'center' },
        { model: 'companyNo', label: '高睿云企业号', width: '120px' },
        { model: 'companyName', label: '企业名称', minWidth: '250px' },
        { model: 'creditCode', label: '统一社会信用代码', width: '180px' },
        { model: '?', label: 'ERP账号' },
        { model: 'depart', label: '部门' },
        { model: 'roleName', label: '角色' },
        { model: 'status', label: '状态', filter: [{ from: '0', to: '禁用' }, { from: '1', to: '可用' }] },
        { model: 'creater', label: '创建人', minWidth: '100px' },
        { model: 'createDateTime', label: '创建日期', minWidth: '150px' }
      ]
    }
  },
  computed: {
    ...mapState({
      userId: state => state.user.user.id,
      userPhone: state => state.user.user.phone,
      rootMenuId: state => state.menu.rootMenuId,
      queryList: state => state.info.queryList,
      joinRefresh: state => state.menu.joinRefresh
    }),
    props () {
      const isFind = this.queryList.find(({ subTab }) => subTab === this.subTab)
      return isFind ? isFind.props : {}
    },
    info: {
      get () {
        // 默认就给 view
        return this.props.type ? this.props.type : 'view'
      },
      set (val) {
        // 不管了，直接修改 state，因为是同址
        this.props.type = val
      }
    },
    // 这个是请求接口所需要的参数
    params () {
      // 请务必保证每次进来，都能拿到 userId，非当前用户，就是任意一个用户
      return this.props.params ? this.props.params : {
        userId: this.$store.state.user.user.id
      }
    },
    btnList () {
      let list = []
      switch (this.info) {
        // case 'add': list = this.addBtn
        //   break
        case 'view': list = this.viewBtn
          break
        case 'edit': list = this.eidtBtn
          break
      }
      return list
    }
  },
  watch: {
    joinRefresh (newValue, oldValue) {
      if (newValue) {
        // 刷新
        this.init()
        // 然后关闭状态
        this.$store.commit('menu/changeJoinRefresh', false)
      }
    },
    formData: {
      handler (newValue, oldValue) {
        // const isFind = this.companyList.find(({ companyName }) => companyName === this.formData.belongCompany)
        // this.formData.compan
        // console.log()
        const isFind = this.companyList.find(({ companyName }) => companyName === this.formData.belongCompany)
        this.formData.companyNo = isFind ? isFind.companyNo : newValue.companyNo
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
      this.getCompanyListByUserId()
      this.getUserInfo()
      this.getUserDetailList()
    },
    // 按钮
    handleClick (item) {
      console.log('%c [ item ]', 'font-size:13px; background:pink; color:#bf2c9f;', item)
      switch (item) {
        case '编辑': this.info = 'edit'
          break
        case '刷新': {
          this.init()
          this.$message.success('刷新成功')
          break
        }
        case '保存': this.saveForm()
          break
        // case '保存并新增': console.log(item)
        //   break
        // case '新增': {
        //   this.$router.push({ query: { info: 'add' } })
        //   this.formData = {}
        //   this.fileList = []
        //   break
        // }
        case '加入企业': this.$emit('open-join-company')
          break
        case '退出': this.$emit('tab-remove', this.subTab)
          break
      }
    },
    handleRemove () {
      if (this.info === 'view') {
        this.$message.error('请点击"编辑"再进行操作')
      } else {
        this.fileList = []
      }
    },
    // 获取用户详情
    getUserInfo () {
      this.openLoading()
      /**
       * 如果是通过头像个人中心进来，那么参数在 Main.vue - toUserInfo()
       */
      const params = this.params
      console.log('%c [ 用户明细参数 ]', 'font-size:13px; background:pink; color:#bf2c9f;', params)
      this.$api.user.userInfo(params).then(res => {
        console.log('%c [ 用户明细 ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
        if (res.userImgUrl) {
          this.fileList = [{ url: res.userImgUrl }]
        }
        this.formData = res
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
    // 获取用户明细列表
    getUserDetailList () {
      this.openLoading()
      const params = {
        id: this.params.userId,
        pages: this.queryInfo.currPage,
        size: this.queryInfo.limit
      }
      console.log('%c [ 用户明细查询参数 ]', 'font-size:13px; background:pink; color:#bf2c9f;', params)
      this.$api.user.userDetailList(params).then(res => {
        console.log('%c [ 用户明细列表 ]', 'font-size:13px; background:pink; color:#bf2c9f;', res.list)
        this.tableData = res.list
        this.queryInfo.total = res.total
        this.queryInfo.startRow = res.startRow
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
    // 获取选中用户绑定所有公司
    getCompanyListByUserId () {
      const params = {
        ...this.params,
        pages: 1,
        size: 1000
      }
      this.$api.company.companyListByUserId(params).then(res => {
        console.log('%c [ 可选企业 ]', 'font-size:13px; background:pink; color:#bf2c9f;', res.list)
        this.companyList = res.list
        this.formLabel.forEach(p => {
          if (p.title === '用户信息') {
            p.children.forEach(c => {
              if (c.label === '默认企业') {
                c.options = res.list.map(({ companyName }) => {
                  return { value: companyName, label: companyName }
                })
              }
            })
          }
        })
      }).catch(err => {
        this.$message.error(err)
      })
    },
    saveForm () {
      this.$refs.form.validate(valid => {
        if (!valid) return
        const params = {
          ...this.formData,
          ...this.params
        }
        // 角色 ID 先不搞
        delete params.roleId
        console.log('%c [ 用户明细编辑参数 ]', 'font-size:13px; background:pink; color:#bf2c9f;', params)
        this.$api.user.updateUser(params).then(res => {
          this.uploadAvatar().then(res => {
            this.info = 'view'
            this.getUserInfo()
            this.$message.success('保存成功')
          })
        }).catch(err => {
          this.$message.error(err)
        })
      })
    },
    // 上传头像
    uploadAvatar () {
      return new Promise((resolve, reject) => {
        // 如果图片有更改，那就上传，否则不执行
        if (this.fileList.length > 0 && this.fileList[0].raw) {
          const params = {
            file: this.fileList[0].raw,
            userPhone: this.userPhone,
            userId: this.userId
          }
          // 头像仅能自己改自己
          this.$api.user.uploadAvatar(params).then(res => {
            this.$store.commit('user/updateUserAvatar', res.userImgUrl)
            resolve()
          }).catch(err => {
            reject(err)
          })
        } else {
          resolve()
        }
      })
    },
    // 更改每页条数
    changeLimit (limit) {
      this.queryInfo.limit = limit
      this.getUserDetailList()
    },
    // 更改当前页
    changePage (page) {
      this.queryInfo.currPage = page
      this.getUserDetailList()
    }
  },
  components: {
    CommonTable,
    UploadAvatar,
    ItemButton
  }
}
</script>

<style lang="scss" scoped>
.info__wrap {
  height : 100%;
  ::v-deep .el-card {
    border-radius : 0;
    border : 0 none;
    &:not(.btn-group__wrap) {
      margin : 10px;
    }
  }
  .btn-group {
    .el-button {
      width : auto;
    }
  }
  ::v-deep .info-form {
    .title {
      margin-bottom : 10px;
      height : 36px;
      line-height : 36px;
      font-size : 14px;
      background-color : #EEEEEE;
    }
    .el-form-item {
      margin-right : 40px;
      margin-bottom : 15px;
      width : 150px;
      &.is-required {
        .el-form-item__label {
          &::after {
            margin-left : 4px;
            content : '*';
            color : #F56C6C;
          }
          // 移除 element-ui 的
          &::before {
            content : '';
          }
        }
      }
      .el-form-item__label {
        padding-bottom : 0;
        line-height : 1;
        &::before {
          margin : 0;
        }
      }
      .el-form-item__content {
        .el-input {
          .el-input__inner {
            // padding-left : 0;
            border : 0 none;
            border-bottom : 1px solid #000000;
            border-radius : 0;
          }
          &:not(.el-date-editor) {
            .el-input__inner {
              padding-left : 0;
            }
          }
          &.el-date-editor {
            width: 100%;
            .el-input__inner {
              padding-left: 20px;
            }
            .el-input__prefix {
              left: -5px;
            }
          }
          // &.el-date-editor {
          //   .el-input__inner {
          //   padding-left : 0;
          //   border : 0 none;
          //   border-bottom : 1px solid #000000;
          //   border-radius : 0;
          //   }
          // }
        }
        .is-disabled {
          .el-input__inner {
            // color : #606266;
            background-color : transparent;
            // border-bottom-color: #cccccc;
          }
        }
      }
    }
    &.is-view {
      .el-form-item__content {
        .is-disabled {
          .el-input__inner {
            color : #606266;
            // border-bottom-color : #000000;
          }
        }
      }
    }
  }
  ::v-deep .el-radio-group {
    .el-radio-button__inner {
      width : 150px;
      border-radius : 0;
      &:hover {
        color : #1E73BA;
      }
    }
    .el-radio-button__orig-radio {
      &:checked {
        & + .el-radio-button__inner {
          border-color : #1E73BA;
          background-color : #1E73BA;
          &:hover {
            color : #FFFFFF;
          }
        }
      }
    }
  }
}

</style>
