<template>
  <!-- 用户名登录表单 -->
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
        userName: '',
        password: ''
      },
      formLabel: [
        { model: 'userName', placeholder: '请输入用户名', type: 'user', showIcon: true },
        { model: 'password', placeholder: '请输入登录密码', type: 'password', showIcon: true }
      ],
      formRules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'change' }
          /** 格式待定 */
          // { pattern: /^\d{11,11}$/, message: '用户名格式不正确', trigger: 'blur' }
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
          type: 'loginWithUserName',
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
