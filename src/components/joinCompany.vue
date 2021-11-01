<template>
  <!-- 刚注册即加入企业 -->
  <el-dialog :visible.sync="vmodel" width="615px" :close-on-click-modal="false">
    <el-steps :active="active" finish-status="wait" process-status="finish">
      <el-step v-for="item in stepList" :key="item.title" :title="item.title">
        <i slot="icon" :class="item.icon"></i>
      </el-step>
    </el-steps>
    <!-- 成功结果 -->
    <el-result v-if="isResultSuccess">
      <el-row slot="subTitle" style="subtitle">加入企业成功!</el-row>
      <el-image
        slot="icon"
        src="https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/login/if-check-circled.svg"
      ></el-image>
    </el-result>
    <el-row v-else type="flex" class="content__wrap">
      <el-col :span="11">
        <el-form v-if="active === 1" size="small" ref="form" :model="formData">
          <el-form-item
            v-for="item in formLabel"
            :key="item.model"
            :label="item.label"
            :prop="item.model"
          >
            <ItemInput
              v-model="formData[item.model]"
              :placeholder="item.placeholder"
            ></ItemInput>
          </el-form-item>
        </el-form>
        <template v-else-if="active === 2">
          <el-row class="info__wrap" type="flex" justify="space-around">
            <el-row
              class="info-row"
              v-for="item in succUserLabel"
              :key="item.model"
            >
              <span class="info-label">{{ item.label }}</span>
              <span class="info-value">{{ succUserData[item.model] }}</span>
            </el-row>
          </el-row>
        </template>
      </el-col>
      <el-col :span="2">
        <div v-if="active === 1" class="text-or">or</div>
      </el-col>
      <el-col v-if="formData.inviteCode.length === 6" :span="11">
        <ItemInput
          type="textarea"
          disabled
          :rows="3"
          placeholder="广东瑞捷光电股份有限公司       邀约人：13925269795"
        ></ItemInput>
      </el-col>
    </el-row>
    <el-row
      type="flex"
      :justify="isResultSuccess ? 'center' : 'normal'"
      :gutter="70"
    >
      <el-col :span="active < 2 ? 6 : 12">
        <ItemButton type="primary" size="small" @click="handleClick">
          {{ active === 2 ? '开始使用' : '确定' }}
        </ItemButton>
      </el-col>
      <el-col :span="6" v-if="active < 2">
        <ItemButton size="small" @click="vmodel = false">取消</ItemButton>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import ItemInput from '@/components/form/input'
import ItemButton from '@/components/form/button'

import { mapState } from 'vuex'

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      active: 1,
      isResultSuccess: false,
      stepList: [
        { title: '用户注册', icon: '' },
        { title: '加入企业', icon: '' },
        { title: '完成', icon: '' }
      ],
      formData: {
        companyCode: '',
        inviteCode: ''
      },
      formLabel: [
        { model: 'companyCode', placeholder: '请输入企业名称或者信用代码' },
        { model: 'inviteCode', placeholder: '请输入6位邀请码' }
      ],
      succUserData: {
        // 员工姓名
        employName: '',
        // 部门
        depart: '',
        // 岗位权限
        authority: ''
      },
      succUserLabel: [
        { model: 'employName', label: '姓名' },
        { model: 'depart', label: '部门' },
        { model: 'authority', label: '岗位权限' }
      ]
    }
  },
  computed: {
    ...mapState({
      id: state => state.user.user.id,
      phone: state => state.user.user.phone,
      joinRefresh: state => state.menu.joinRefresh
    }),
    vmodel: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    vmodel (newValue, oldValue) {
      // 关闭后重置
      if (!newValue) {
        this.formData = {
          companyCode: '',
          inviteCode: ''
        }
        this.active = 1
        this.isResultSuccess = false
        // 关闭窗口，立即更新状态，然后监听该值触发刷新
        this.$store.commit('menu/changeJoinRefresh', true)
      }
    }
  },
  methods: {
    handleClick () {
      if (this.active === 1) {
        this.next()
      } else if (this.active === 2) {
        this.submit()
      }
    },
    submit () {
      this.vmodel = false
    },
    next () {
      const { companyCode, inviteCode } = this.formData
      if (companyCode === '' && inviteCode === '') {
        return this.$message.error('请选择其中一种方式加入企业')
      }
      const params = {
        key: companyCode,
        userPhone: this.phone
      }
      this.$api.company.joinCompany(params).then(res => {
        this.isResultSuccess = true
        this.$emit('on-success')
        if (this.active++ > 2) this.active = 1
      }).catch(err => {
        this.$message.error(err)
      })
    }
  },
  components: {
    ItemInput,
    ItemButton
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  height : 360px;
  .el-dialog__body {
    padding-left : 40px;
    padding-right : 40px;
    .el-steps {
      .is-finish {
        color : #1E73BA;
        border-color : #1E73BA;
      }
      .el-step__title {
        font-size : 14px;
      }
      .el-step__icon {
        width : 20px;
        height : 20px;
        box-shadow : 0 0 0 10px #FFFFFF;
      }
      .el-step {
        &:not(:last-child) {
          .el-step__title {
            margin-left : -17px;
          }
        }
        &:last-child {
          .el-step__title {
            margin-left : -3px;
          }
        }
      }
    }
    .content__wrap {
      margin-top : 70px;
      .text-or {
        margin-top : 30px;
      }
      .el-textarea {
        textarea {
          resize : none;
        }
      }
      .info__wrap {
        height : 100%;
        font-size : 14px;
        color : #333333;
        flex-flow : column;
        .info-row {
          .info-label::after {
            content : '：';
          }
        }
      }
    }
    // 成功
    .el-result {
      margin : 15px 0 25px;
      padding : 0;
      .subtitle {
        color : #333333;
      }
      .el-result__icon {
        width : 100px;
        height : 100px;
        font-size : 0;
      }
    }
  }
}

</style>
