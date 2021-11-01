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
                    <template v-else>
                      <el-tooltip v-if="item.tooltip && formData[item.model]" :content="formData[item.model]" :placement="item.tooltip">
                        <el-input
                          :value="filterForm(formData[item.model], item.filter)"
                          :disabled="info === 'view' || item.disabled"
                          @input="handleInput($event, item)"
                        ></el-input>
                      </el-tooltip>
                      <el-input
                        v-else
                        :value="filterForm(formData[item.model], item.filter)"
                        :disabled="info === 'view' || item.disabled"
                        @input="handleInput($event, item)"
                      ></el-input>
                    </template>
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
        <el-row type="flex" justify="space-between">
          <el-radio-group v-model="radio" size="small">
            <el-radio-button
              v-for="item in radioList"
              :key="item"
              :label="item"
            ></el-radio-button>
          </el-radio-group>
          <el-row class="card-btn-bar" type="flex" align="middle">
            <template v-for="(item, i) in btnGroup">
              <el-divider v-if="i !== 0" :key="i" direction="vertical"></el-divider>
              <el-link
                :key="item.title"
                type="primary"
                :underline="false"
                :disabled="item.disabled"
                @click="handleClickComponent(item.text)"
              >
                {{ item.text }}
              </el-link>
            </template>
          </el-row>
        </el-row>
        <component
          ref="component"
          :is="currComponent"
          :companyNo="this.params.companyNo"
          :info="info"
        ></component>
      </el-card>
    </el-row>
  </el-row>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

import UploadAvatar from '@/components/uploadAvatar'
import ItemButton from '@/components/form/button'
import Uinfo from './userInfo'
import Hshake from './handShake'
import Capi from './cloudAPI'

export default {
  props: {
    // 暂时废弃
    menuId: [String, Number]
  },
  created () {
    this.getComponentInfo()
  },
  data () {
    return {
      // 当前页签名
      subTab: '企业表单',
      // 企业列表
      companyList: [],
      // 头像
      fileList: [],
      // dialogJoin: false,
      radio: '用户信息',
      radioList: ['用户信息', '握手企业', '接口信息'],
      // 表格卡片右上角的按钮
      cardBar: [
        {
          model: '用户信息',
          list: [
            { text: '增加', disabled: false },
            { text: '邀请', disabled: true },
            { text: '禁用', disabled: false },
            { text: '启用', disabled: false },
            { text: '删除', disabled: false }
          ]
        }
      ],
      // 根据当前编辑、查看、新增改变按钮
      // addBtn: ['保存', '加入企业', '退出'],
      viewBtn: ['编辑', '停止交易', '注销', '刷新', '退出'],
      eidtBtn: ['保存', '刷新', '退出'],
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
        companyNo: '',
        companyName: '',
        a: '',
        creditCode: '',
        companyAdd: '',
        linkMan: '',
        aa: '',
        aaa: '',
        creater: '',
        createDateTime: '',
        status: ''
      },
      formLabel: [
        {
          title: '企业信息',
          children: [
            { model: 'companyNo', label: '高睿云企业号', required: true },
            { model: 'companyName', label: '企业名称', tooltip: 'top' },
            { model: 'a', label: '企业简称' },
            { model: 'creditCode', label: '统一社会信用代码', required: true },
            { model: 'companyAdd', label: '企业地址', tooltip: 'top' },
            { model: 'linkMan', label: '联系人' },
            { model: 'aa', label: '联系电话' },
            { model: 'aaa', label: '邮箱' },
            { model: 'creater', label: '加入者' },
            { model: 'createDateTime', label: '加入日期' },
            { model: 'status', label: '状态', filter: [{ from: '0', to: '禁用' }, { from: '1', to: '可用' }] }
          ]
        },
        {
          title: '账户信息',
          children: [
            { model: 'a1', label: '开户银行' },
            { model: 'a2', label: '开户名', disabled: true },
            { model: 'a3', label: '银行账户' }
          ]
        }
      ],
      formRules: {
        // mail: [
        //   { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '邮箱地址格式不正确', trigger: 'blur' }
        // ]
      }
    }
  },
  computed: {
    ...mapState({
      userId: state => state.user.user.id,
      userPhone: state => state.user.user.phone,
      rootMenuId: state => state.menu.rootMenuId,
      queryList: state => state.info.queryList
      // joinRefresh: state => state.menu.joinRefresh
    }),
    currComponent () {
      let component = ''
      switch (this.radio) {
        case '用户信息': component = 'Uinfo'
          break
        case '握手企业': component = 'Hshake'
          break
        case '接口信息': component = 'Capi'
          break
      }
      return component
    },
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
      // 请务必保证每次进来，都能拿到 userId，非当前用户，就是任意一个人员
      return this.props.params
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
    },
    btnGroup () {
      const curItem = this.cardBar.find(({ model, list }) => model === this.radio)
      return curItem ? curItem.list : []
    },
    companyNo () {
      return this.params.companyNo
    }
  },
  watch: {
    formData: {
      handler (newValue, oldValue) {
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
    // 获取企业明细
    getComponentInfo () {
      const params = {
        ...this.params
      }
      console.log('%c [ 企业明细参数 ]', 'font-size:13px; background:pink; color:#bf2c9f;', params)
      this.$api.company.componentInfo(params).then(res => {
        console.log('%c [ 企业明细 ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
        this.formData = res
      }).catch(err => {
        this.$message.error(err)
      })
    },
    // 过滤转换
    filterForm (model, filter) {
      if (filter) {
        const isFind = filter.find(({ from }) => from === model)
        // 如果找得到就过滤替换，如果找不到就原始值
        return isFind ? isFind.to : model
      } else {
        return model
      }
    },
    handleInput (val, item) {
      // if (item.filter)
      if (item.filter) {
      } else {
        this.formData[item.model] = val
      }
    },
    // 按钮
    handleClick (item) {
      console.log('%c [ item ]', 'font-size:13px; background:pink; color:#bf2c9f;', item)
      switch (item) {
        case '编辑': this.info = 'edit'
          break
        case '禁用': console.log(item)
          break
        case '注销': console.log(item)
          break
        case '刷新': {
          // this.init()
          this.$refs.component.init()
          this.$message.success('刷新成功')
          break
        }
        // case '保存': this.saveForm()
        case '保存': this.info = 'view'
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
    handleClickComponent (btn) {
      if (this.radio === '用户信息') {
        switch (btn) {
          case '增加': this.$refs.component.addCompanyUser()
            break
          case '删除': this.$refs.component.delCompanyUser()
            break
          case '启用': this.$refs.component.enableCompanyUser()
            break
          case '禁用': this.$refs.component.disableCompanyUser()
            break
        }
      }
    }
  },
  components: {
    // CommonTable,
    UploadAvatar,
    ItemButton,
    Uinfo,
    Hshake,
    Capi
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
  ::v-deep .el-upload {
    border-radius : 0;
  }
  ::v-deep .el-upload-list {
    .el-upload-list__item {
      border-radius: 0;
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
  .card-btn-bar {
    padding: 0 10px;
    user-select: none;
  }
}

</style>
