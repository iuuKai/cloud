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
              <el-row
                v-for="row in formLabel"
                :key="row.title"
                style="padding: 0 35px"
              >
                <el-row class="title">{{ row.title }}</el-row>
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
                          :disabled="info === 'view' || (info === 'edit' &&  item.model === 'companyName')"
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
                      :value="filterForm(formData[item.model], item.filter)"
                      :disabled="info === 'view' || item.disabled"
                      @input="handleInput($event, item)"
                    ></el-input>
                  </el-form-item>
                </el-row>
              </el-row>
            </el-form>
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
        <el-row>
          <el-input
            v-model="filterText"
            placeholder="请搜索业务对象"
            prefix-icon="el-icon-search"
          >
          </el-input>
          <el-tree
            ref="tree"
            class="filter-tree"
            :data="companyMenuList"
            :props="defaultProps"
            show-checkbox
            default-expand-all
            node-key="id"
            :default-checked-keys="checkedKeys"
            :filter-node-method="filterNode"
          >
          </el-tree>
        </el-row>
      </el-card>
    </el-row>
  </el-row>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { loopChildren } from '@/utils/common'

// import CommonTable from '@/components/common/CommonTable'
// import UploadAvatar from '@/components/uploadAvatar'
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
      subTab: '角色表单',
      // 企业列表
      companyList: [],
      radio: '功能权限',
      radioList: ['功能权限'],
      // 根据当前编辑、查看、新增改变按钮
      addBtn: ['保存', '刷新', '退出'],
      viewBtn: ['编辑', '禁用', '退出'],
      eidtBtn: ['保存', '退出'],
      // 记录旧的roleId
      // oldRoleId: '',
      formData: {
        roleName: '',
        companyName: '',
        companyNo: '',
        status: '',
        creater: '',
        createDate: '',
        modifyer: '',
        modifyDate: '',
        remark: ''
      },
      formLabel: [
        {
          title: '基本信息',
          children: [
            { model: 'roleName', label: '角色名称', required: true },
            { model: 'companyName', label: '企业名称', required: true, tooltip: 'top', type: 'select', options: [] },
            { model: 'companyNo', label: '高睿云企业号', disabled: true },
            { model: 'status', label: '状态', filter: [{ from: '0', to: '禁用' }, { from: '1', to: '可用' }], disabled: true },
            { model: 'creater', label: '创建人', disabled: true },
            { model: 'createDate', label: '创建日期', disabled: true },
            { model: 'modifyer', label: '修改人', disabled: true },
            { model: 'modifyDate', label: '修改日期', disabled: true },
            { model: 'remark', label: '备注' }
          ]
        }
      ],
      formRules: {
      },
      // 树
      companyMenuList: [],
      filterText: '',
      checkedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'menuName'
      }
    }
  },
  computed: {
    ...mapState({
      // userId: state => state.user.user.id,
      // userPhone: state => state.user.user.phone,
      // allMenuTree: state => state.menu.allMenuTree,
      rootMenuId: state => state.menu.rootMenuId,
      queryList: state => state.info.queryList
      // joinRefresh: state => state.menu.joinRefresh
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
      return this.props.params
    },
    btnList () {
      let list = []
      switch (this.info) {
        case 'add': list = this.addBtn
          break
        case 'view': list = this.viewBtn
          break
        case 'edit': list = this.eidtBtn
          break
      }
      return list
    },
    companyName () {
      return this.formData.companyName
    }
  },
  watch: {
    filterText (newValue, oldValue) {
      this.$refs.tree.filter(newValue)
    },
    companyName (newValue, oldValue) {
      const isFind = this.companyList.find(({ companyName }) => companyName === newValue)
      if (isFind) {
        this.formData.companyNo = isFind.companyNo
      }
    },
    info (newValue, oldValue) {
      this.init()
    }
  },
  methods: {
    ...mapMutations('menu', [
      'openLoading',
      'closeLoading'
    ]),
    handleInput (val, item) {
      // if (item.filter)
      if (item.filter) {
      } else {
        this.formData[item.model] = val
      }
    },
    init () {
      this.openLoading()
      this.getCompanyListByUserId()
      if (this.params.id) {
        this.getRoleInfo().then(companyNo => {
          this.getRoleMenuTree(companyNo).then(ree => {
            setTimeout(_ => {
              this.closeLoading()
            }, 500)
          }).catch(_ => {
            setTimeout(_ => {
              this.closeLoading()
            }, 500)
          })
        })
      } else {
        setTimeout(_ => {
          this.closeLoading()
        }, 500)
      }
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
    // 按钮
    handleClick (item) {
      console.log('%c [ item ]', 'font-size:13px; background:pink; color:#bf2c9f;', item)
      switch (item) {
        case '编辑': {
          this.info = 'edit'
          // const isAdmin = this.formData.roleName
          // if (isAdmin === '管理员') {
          //   return this.$message.error('无权操作管理员')
          // } else {
          //   this.info = 'edit'
          // }
          break
        }
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
    // 获取角色详情
    getRoleInfo () {
      return new Promise((resolve, reject) => {
        const params = this.params
        console.log('%c [ 角色明细参数 ]', 'font-size:13px; background:pink; color:#bf2c9f;', params)
        this.$api.role.roleInfo(params).then(res => {
          console.log('%c [ 角色明细 ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
          this.formData = res
          resolve(res.companyNo)
        }).catch(err => {
          this.$message.error(err)
          setTimeout(_ => {
            this.closeLoading()
          }, 500)
        })
      })
    },
    // 获取角色已选菜单树
    getRoleMenuTree (companyNo) {
      return new Promise((resolve, reject) => {
        const params = {
          roleId: this.params.id,
          companyNo: companyNo || this.formData.companyNo
        }
        console.log('%c [ 角色菜单树参数 ]', 'font-size:13px; background:pink; color:#bf2c9f;', params)
        this.$api.role.roleMenuTree(params).then(res => {
          console.log('%c [ 角色菜单树 ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
          this.companyMenuList = res
          loopChildren(res, item => {
            const { isShow } = item
            if (isShow) {
              this.checkedKeys.push(item.id)
            }
            item.disabled = this.info === 'view'
          })
        })
        resolve()
      })
    },
    // 获取选中用户绑定所有公司
    getCompanyListByUserId () {
      const params = {
        userId: this.$store.state.user.user.id,
        pages: 1,
        size: 1000
      }
      console.log(params)
      this.$api.company.companyListByUserId(params).then(res => {
        console.log('%c [ 可选企业 ]', 'font-size:13px; background:pink; color:#bf2c9f;', res.list)
        this.companyList = res.list
        this.formLabel[0].children.forEach(item => {
          if (item.model === 'companyName') {
            item.options = res.list.map(({ companyName }) => {
              return { value: companyName, label: companyName }
            })
          }
        })
      }).catch(err => {
        this.$message.error(err)
      })
    },
    // 过滤树节点
    filterNode (value, data) {
      if (!value) return true
      return data[this.defaultProps.label].indexOf(value) !== -1
    },
    // 保存修改
    saveForm () {
      const newCheckedNodes = this.$refs.tree.getCheckedNodes()
      if (this.info === 'edit') {
        const p = newCheckedNodes.map(({ id: menuId }) => {
          return {
            menuId,
            companyNo: this.formData.companyNo,
            roleName: this.formData.roleName,
            userId: this.$store.state.user.user.id,
            roleId: this.params.id
          }
        })
        const params = p.length > 0 ? p : [{
          menuId: '',
          companyNo: this.formData.companyNo,
          roleName: this.formData.roleName,
          userId: this.$store.state.user.user.id,
          roleId: this.params.id
        }]
        console.log('%c [ 修改角色参数 ]', 'font-size:13px; background:pink; color:#bf2c9f;', params)
        this.$api.role.updateRole(params).then(res => {
          this.info = 'view'
          this.$message.success('更新成功')
          this.getRoleInfo()
        }).catch(err => {
          this.$message.error(err)
        })
      } else if (this.info === 'add') {
        const p = newCheckedNodes.map(({ id: menuId }) => {
          return {
            menuId,
            companyNo: this.formData.companyNo,
            roleName: this.formData.roleName,
            userId: this.$store.state.user.user.id
          }
        })
        const params = p.length > 0 ? p : [{
          menuId: '',
          companyNo: this.formData.companyNo,
          roleName: this.formData.roleName,
          userId: this.$store.state.user.user.id
        }]
        console.log('%c [ 新增角色参数 ]', 'font-size:13px; background:pink; color:#bf2c9f;', params)
        this.$api.role.addRole(params).then(res => {
          this.$message.success('新增角色成功')
          // 重置
          this.formData = {
            employName: '',
            employNo: '',
            sex: '',
            idCard: '',
            birthday: '',
            belongCompany: '',
            depart: '',
            userType: '',
            roleName: '',
            status: '',
            createDateTime: '',
            lastLoginTime: '',
            userName: '',
            phone: '',
            mail: ''
          }
          this.$refs.tree.setCheckedKeys([])
        }).catch(err => {
          this.$message.error(err)
        })
      }
    }
  },
  components: {
    // CommonTable,
    // UploadAvatar,
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
  ::v-deep .avatar-uploader {
    margin : 36px 33px;
    .el-upload {
      position : relative;
      border : 1px solid #D9D9D9;
      border-radius : 50%;
      cursor : pointer;
      overflow : hidden;
      .avatar-uploader-icon {
        width : 136px;
        height : 136px;
        line-height : 136px;
        font-size : 28px;
        color : #8C939D;
        text-align : center;
      }
      .avatar {
        display : block;
        width : 136px;
        height : 136px;
      }
    }
    .el-upload:hover {
      border-color : #409EFF;
    }
  }
  ::v-deep .info-form {
    width: 100%;
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
