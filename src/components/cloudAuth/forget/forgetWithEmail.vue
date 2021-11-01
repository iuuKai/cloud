<template>
  <!-- 忘记密码 · 邮箱验证表单 -->
  <AunthForm
    v-if="visible"
    ref="form"
    :active="active"
    :formData="formData"
    :formLabel="formLabel"
    :formRules="formRules"
  >
    <el-row
      v-if="active === 0"
      slot="safetyCodePic"
      type="flex"
      justify="space-between"
      align="bottom"
      class="identify-code__wrap"
    >
      <IdentifyCode
        :isRefresh.sync="isRefresh"
        :contentWidth="110"
        :contentHeigh="40"
        @getCode="getCode"
      ></IdentifyCode>
      <el-link type="primary" @click="refreshCode">换一张</el-link>
    </el-row>
    <ItemButton slot="footer" type="primary" @click="next">下一步</ItemButton>
  </AunthForm>
</template>

<script>
import AunthForm from '@/components/form/form'
import ItemButton from '@/components/form/button'
import IdentifyCode from '@/components/identifyCode'

export default {
  props: {
    active: {
      type: Number,
      default: 0
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    // 检验密码格式
    const validatorPassword = (rule, value, callback) => {
      if (value === '') return
      // 匹配键盘上特殊字符
      const a = /((?=[\x21-\x7e]+)[^A-Za-z0-9])/
      // 匹配字符
      const b = /[a-z]/i
      // 匹配数字
      const c = /[0-9]/
      if (
        (!a.test(value) && !b.test(value)) ||
        (!b.test(value) && !c.test(value)) ||
        (!c.test(value) && !a.test(value))
      ) {
        callback(new Error('至少是两种类型组合（数字、字母、特殊符号）的密码'))
      }
    }
    // 检验第二次密码
    const validatorComfirm = (rule, value, callback) => {
      if (value !== this.formData.password) {
        callback(new Error('密码不一致'))
      } else {
        callback()
      }
    }
    // 校验验证码
    const validatorIdentifying = (rule, value, callback) => {
      if (value === '') return
      // 不区分大小写
      if (value.toLocaleLowerCase() !== this.formData.resultCode.toLocaleLowerCase()) {
        callback(new Error('图形码错误'))
      } else {
        callback()
      }
    }
    return {
      // 是否刷新验证码
      isRefresh: false,
      // 图形验证
      result: false,
      formData: {
        // 结果
        resultCode: '',
        email: '',
        // 用户输入
        identifyingCode: '',
        password: '',
        passwordComfirm: ''
      },
      formLabel: [
        { model: 'email', placeholder: '请输入邮箱地址', type: 'msg', subModel: 'countryCode', showIcon: true, active: 0 },
        { model: 'identifyingCode', placeholder: '请输入图形验证码', type: 'safetyCode', showIcon: true, active: 0 },
        { model: 'password', placeholder: '请输入8~18位密码', type: 'password', showIcon: true, active: 1 },
        { model: 'passwordComfirm', placeholder: '请再次输入设置的密码', type: 'passwordComfirm', showIcon: true, active: 1 }
      ],
      formRules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'change' },
          { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '邮箱地址格式不正确', trigger: 'blur' }
        ],
        identifyingCode: [
          { required: true, message: '请输入图形验证码', trigger: 'change' },
          { validator: validatorIdentifying, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '当前密码为空', trigger: 'change' },
          { pattern: /^[^\s]*$/, message: '请勿输入空格符', trigger: 'change' },
          { pattern: /^[^\s]{8,18}$/, message: '密码长度不正确', trigger: 'blur' },
          { validator: validatorPassword, trigger: 'blur' }
        ],
        passwordComfirm: [
          { required: true, message: '请再次输入设置的密码', trigger: 'change' },
          { validator: validatorComfirm, trigger: 'blur' }
        ]
      },
      // 请求所需参数
      data: {}
    }
  },
  watch: {
    visible (newValue, oldValue) {
      if (!newValue) {
        this.formData = {
          countryCode: 86,
          phone: '',
          msgCode: '',
          password: '',
          passwordComfirm: ''
        }
      }
    }
  },
  methods: {
    // 判断图形验证码是否正确
    checkResultCode () {
      return new Promise((resolve, reject) => {
        this.$refs.form.validateField('identifyingCode', valid => {
          resolve(valid)
        })
      })
    },
    next () {
      if (this.active < 2) {
        this.$refs.form.validate(valid => {
          if (!valid) return
          // this.data.email = this.formData.email
          // 避免由于api请求而记录token，所以要清除
          // this.$store.commit('user/clearUser')
          // this.$store.commit('user/clearToken')
          if (this.active === 1) {
            this.data.userPwd = this.formData.password
            this.$emit('on-login', this.data)
            // this.$store.dispatch('user/updatePassword', this.data).then(res => {
            //   this.timerToLogin()
            // }).catch(err => {
            //   this.$message.error(err)
            // })
          }
          this.$emit('on-next-step')
        })
      }
    },
    // 获取验证码
    getCode (value) {
      this.formData.resultCode = value
    },
    // 更新验证码
    refreshCode () {
      this.isRefresh = true
    }
  },
  components: {
    AunthForm,
    ItemButton,
    IdentifyCode
  }
}
</script>

<style lang="scss" scoped>
.identify-code__wrap {
  .el-link {
    height: 14px;
    span {
      line-height: 1;
    }
  }
}
</style>
