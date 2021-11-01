<template>
  <!-- 修改密码弹窗 -->
  <el-dialog :visible.sync="vmodel" width="460px" :close-on-click-modal="false">
    <el-row slot="title" class="dialog-title">修改密码</el-row>
    <!-- 成功结果 -->
    <el-result v-if="isResultSuccess">
      <el-row slot="subTitle">修改成功，下次请使用新密码登录。</el-row>
      <el-image
        slot="icon"
        src="https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/login/if-check-circled.svg"
      ></el-image>
      <ItemButton slot="extra" size="small" type="primary" @click="handleClose"
        >关闭</ItemButton
      >
    </el-result>
    <!-- 修改密码表单 -->
    <el-form v-else ref="form" :model="formData" :rules="formRules">
      <el-form-item
        v-for="item in formLabel"
        :key="item.model"
        :prop="item.model"
        size="small"
      >
        <ItemInput
          v-model="formData[item.model]"
          :type="item.type"
          :placeholder="item.placeholder"
        ></ItemInput>
      </el-form-item>
      <el-form-item>
        <ItemButton size="small" type="primary" @click="submitForm"
          >确定</ItemButton
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import ItemInput from '@/components/form/input'
import ItemButton from '@/components/form/button'

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    // 检验第二次密码
    const validatorComfirm = (rule, value, callback) => {
      if (value !== this.formData.newPassword) {
        callback(new Error('密码不一致'))
      } else {
        callback()
      }
    }
    return {
      isResultSuccess: false,
      formData: {
        curPassword: '',
        newPassword: '',
        newPasswordComfirm: ''
      },
      formLabel: [
        { model: 'curPassword', placeholder: '请输入当前账号的登录密码', type: 'password' },
        { model: 'newPassword', placeholder: '请输入新密码', type: 'password' },
        { model: 'newPasswordComfirm', placeholder: '请再次输入新密码', type: 'password' }
      ],
      formRules: {
        curPassword: [
          { required: true, message: '请输入当前账号的登录密码', trigger: 'change' },
          { pattern: /^[^\s]*$/, message: '请勿输入空格', trigger: 'blur' },
          { pattern: /^[^\s]{8,18}$/, message: '密码长度不正确', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '当前密码为空', trigger: 'change' },
          { pattern: /^[^\s]*$/, message: '请勿输入空格', trigger: 'blur' },
          { pattern: /^[^\s]{8,18}$/, message: '密码长度不正确', trigger: 'blur' },
          { pattern: /^(?=.*\d)(?=.*[A-Za-z])[\x20-\x7e]{8,18}$/i, message: '请输入8~18位含字母、数字和特殊字符的密码', trigger: 'blur' }
        ],
        newPasswordComfirm: [
          { required: true, message: '请再次输入新密码', trigger: 'change' },
          { validator: validatorComfirm, trigger: 'blur' }
        ]
      },
      // 请求所需参数
      params: {
        apiAccount: 'api_web',
        apiToken: '9B66E5B6-05B0-472C-B955-2B897FE730B9',
        timestamp: '1559192325',
        sign: '4abbcdb5dd6a6cf7c1a353b2f17b5edc',
        reqMsg: 'myflag',
        userAccount: '',
        userName: '',
        userPwd: '',
        phone: '',
        vcode: '',
        vmark: ''
      }
    }
  },
  computed: {
    vmodel: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    // 先登录判断旧密码是否正确
    checkCurPwd () {
      // this.params.phone = this.$store.state.user.user.phone
      // this.params.userPwd = this.$store.state.user.user.userPwd
      // return this.$store.dispatch('user/userLogin', this.params)
    },
    // 提交注册表单
    submitForm () {
      this.$refs.form.validate(valid => {
        if (!valid) return
        const { curPassword: formerPwd, newPassword: newPwd, newPasswordComfirm: verifyPwd } = this.formData
        const params = {
          formerPwd,
          newPwd,
          verifyPwd,
          userPhone: this.$store.state.user.user.phone
        }
        this.$api.user.changePassword(params).then(res => {
          this.isResultSuccess = true
          this.$store.commit('user/clearToken')
          this.$store.commit('user/clearUser')
          location.reload()
        }).catch(err => {
          this.$message.error(err)
        })
        // this.checkCurPwd()
        // this.checkCurPwd().then(res => {
        //   this.params.phone = res.phone
        //   const { newPassword } = this.formData
        //   this.params.userPwd = newPassword
        // this.$store.dispatch('user/updatePassword', this.params).then(res => {
        //   this.isResultSuccess = true
        // }).catch(err => {
        //   this.$message.error(err)
        // })
        // }).catch(err => {
        //   this.$message.error(err)
        // })
      })
    },
    handleClose () {
      this.vmodel = false
      this.isResultSuccess = false
      // 重置表单
      this.formData = {
        curPassword: '',
        newPassword: '',
        newPasswordComfirm: ''
      }
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
  .dialog-title {
    padding-right : 16px;
    text-align : center;
    // font-size: 14px;
  }
  .el-dialog__body {
    padding-top : 13px;
    padding-bottom : 4px;
    // 表单
    .el-form {
      padding : 0;
      margin : 0 auto;
      width : 244px;
    }
    // 成功
    .el-result {
      padding : 0;
      .el-result__icon {
        width : 71px;
        height : 71px;
        font-size : 0;
      }
    }
  }
}

</style>
