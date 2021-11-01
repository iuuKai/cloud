<template>
  <!-- 注册表单 -->
  <AunthForm
    ref="form"
    :formData="formData"
    :formLabel="formLabel"
    :formRules="formRules"
  >
    <!-- 中间层，连接父插槽与子组件 -->
    <!-- 本身是插槽填充也是插槽位置 -->
    <slot name="msgCodeButton" slot="msgCodeButton"></slot>
  </AunthForm>
</template>

<script>
import AunthForm from '@/components/form/form'

export default {
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
      } else {
        callback()
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
    return {
      formData: {
        countryCode: 86,
        phone: '',
        msgCode: '',
        password: '',
        passwordComfirm: ''
      },
      formLabel: [
        { model: 'phone', placeholder: '请输入手机号码', type: 'phone', subModel: 'countryCode', showIcon: true },
        { model: 'msgCode', placeholder: '请输入短信验证码', type: 'msgCode', showIcon: true },
        { model: 'password', placeholder: '请输入8~18位密码', type: 'password', showIcon: true },
        { model: 'passwordComfirm', placeholder: '请再次输入设置的密码', type: 'passwordComfirm', showIcon: true }
      ],
      formRules: {
        phone: [
          { required: true, message: '当前手机号码为空', trigger: 'change' },
          { pattern: /^\d{11,11}$/, message: '手机号码格式不正确', trigger: 'blur' }
        ],
        msgCode: [
          { required: true, message: '请输入短信验证码', trigger: 'change' },
          { pattern: /^\d{6,6}$/, message: '验证码长度不正确', trigger: 'blur' }
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
      }
    }
  },
  methods: {
    // 检验表单，暴露给父级
    submit (callback) {
      this.$refs.form.validate(valid => {
        if (!valid) return
        const data = {
          // type 最好与组件名一致
          type: 'regForm',
          data: this.formData
        }
        callback(data)
      })
    },
    // 检验手机号，暴露给父级
    validatePhone (callback) {
      this.$refs.form.validateField('phone', errMsg => {
        if (errMsg) return
        // 将检测字段的数据，返回给父层
        const phone = this.formData.phone
        callback(phone)
      })
    }
  },
  components: {
    AunthForm
  }
}
</script>

<style lang="scss" scoped>
</style>
