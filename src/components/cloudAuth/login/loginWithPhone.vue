<template>
  <!-- 手机号登录表单 -->
  <AunthForm
    ref="form"
    :formData="formData"
    :formLabel="formLabel"
    :formRules="formRules"
  ></AunthForm>
</template>

<script>
import AunthForm from '@/components/form/form'

export default {
  data () {
    return {
      formData: {
        countryCode: 86,
        phone: '',
        password: ''
      },
      formLabel: [
        { model: 'phone', placeholder: '请输入手机号码', type: 'phone', subModel: 'countryCode', showIcon: true },
        { model: 'password', placeholder: '请输入登录密码', type: 'password', showIcon: true }
      ],
      formRules: {
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'change' },
          { pattern: /^\d{11,11}$/, message: '手机号码格式不正确', trigger: 'blur' }
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
          type: 'loginWithPhone',
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
