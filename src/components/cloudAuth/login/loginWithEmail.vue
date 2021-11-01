<template>
  <!-- 邮箱登录表单 -->
  <AunthForm
    ref="form"
    :formData="formData"
    :formLabel="formLabel"
    :formRules="formRules"
  >
  </AunthForm>
</template>

<script>
import AunthForm from '@/components/form/form'

export default {
  data () {
    return {
      formData: {
        email: '',
        password: ''
      },
      formLabel: [
        { model: 'email', placeholder: '请输入邮箱地址', type: 'msg', subModel: 'countryCode', showIcon: true },
        { model: 'password', placeholder: '请输入登陆密码', type: 'password', showIcon: true }
      ],
      formRules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'change' },
          { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '邮箱地址格式不正确', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'change' },
          { pattern: /^[^\s]*$/, message: '请勿输入空格', trigger: 'blur' },
          { pattern: /^[^\s]{8,18}$/, message: '密码长度不正确', trigger: 'blur' }
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
          type: 'loginWithEmail',
          data: this.formData
        }
        callback(data)
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
