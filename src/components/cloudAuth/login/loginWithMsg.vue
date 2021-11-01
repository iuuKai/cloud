<template>
  <!-- 短息登录表单 -->
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
    return {
      formData: {
        countryCode: 86,
        phone: '',
        msgCode: ''
      },
      formLabel: [
        { model: 'phone', placeholder: '请输入手机号码', type: 'phone', subModel: 'countryCode', showIcon: true },
        { model: 'msgCode', placeholder: '请输入短信验证码', type: 'msgCode', showIcon: true }
      ],
      formRules: {
        phone: [
          { required: true, message: '当前手机号码为空', trigger: 'change' },
          { pattern: /^\d{11,11}$/, message: '手机号码格式不正确', trigger: 'blur' }
        ],
        msgCode: [
          { required: true, message: '请输入短信验证码', trigger: 'change' },
          { pattern: /^\d{6,6}$/, message: '验证码长度不正确', trigger: 'blur' }
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
          type: 'loginWithMsg',
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
