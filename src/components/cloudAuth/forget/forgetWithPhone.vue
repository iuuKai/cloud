<template>
  <!-- 忘记密码 · 手机号验证表单 -->
  <AunthForm
    v-if="visible"
    ref="form"
    :active="active"
    :formData="formData"
    :formLabel="formLabel"
    :formRules="formRules"
  >
    <ItemButton
      v-if="active === 0"
      slot="msgCodeButton"
      type="primary"
      :disabled="isDisabled"
      @click="sendMsgCode"
    >
      {{ btnText }}
    </ItemButton>
    <ItemButton slot="footer" type="primary" @click="next">下一步</ItemButton>
  </AunthForm>
</template>

<script>
import AunthForm from '@/components/form/form'
import ItemButton from '@/components/form/button'

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
      btnText: '获取验证码',
      isDisabled: false,
      // 验证码
      timerMsg: null,
      countMsg: 60,
      formData: {
        countryCode: 86,
        phone: '',
        msgCode: '',
        password: '',
        passwordComfirm: ''
      },
      formLabel: [
        { model: 'phone', placeholder: '请输入手机号码', type: 'phone', subModel: 'countryCode', showIcon: true, active: 0 },
        { model: 'msgCode', placeholder: '请输入短信验证码', type: 'msgCode', showIcon: true, active: 0 },
        { model: 'password', placeholder: '请输入8~18位密码', type: 'password', showIcon: true, active: 1 },
        { model: 'passwordComfirm', placeholder: '请再次输入设置的密码', type: 'passwordComfirm', showIcon: true, active: 1 }
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
      },
      data: {
        userPhone: '',
        newPwd: '',
        verifyPwd: '',
        vcode: '',
        vmark: ''
      }
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
        // 重置为初始值
        clearInterval(this.timerMsg)
        this.countMsg = 60
        this.timerMsg = null
        this.isDisabled = false
        this.btnText = '获取验证码'
      }
    }
  },
  methods: {
    // checkCurPhone () {
    //   this.data.userPhone = this.formData.phone
    //   this.data.vcode = this.formData.msgCode
    //   // return this.$store.dispatch('user/userLogin', this.params)
    //   return this.$api.user.login(this.data)
    // },
    next () {
      if (this.active < 2) {
        this.$refs.form.validate(valid => {
          if (!valid) return
          if (this.active === 1) {
            this.data.vcode = this.formData.msgCode
            this.data.newPwd = this.formData.password
            this.data.verifyPwd = this.formData.passwordComfirm
            console.log(123)
            this.$api.user.forgetPwd(this.data).then(res => {
              console.log(res)
              const { phone, userPwd } = res
              // this.$emit('on-next-step')
              this.$emit('on-login', {
                phone,
                userPwd
              })
            }).catch(err => {
              this.$message.error(err)
            })
          } else {
          }
          this.$emit('on-next-step')
          // this.data.userPhone = this.formData.phone
          // this.data.newPwd = this.formData.password
          // this.data.verifyPwd = this.formData.verifyPwd
          // this.$api.user.forgetPwd(this.data).then(res => {
          //   console.log(res)
          // })
        //   this.checkCurPhone().then(res => {
        //     console.log(res)
        //     this.data.userName = res.userName
        //     // 避免由于api请求而记录token，所以要清除
        //     this.$store.commit('user/clearUser')
        //     this.$store.commit('user/clearToken')
        //     if (this.active === 1) {
        //       // this.data.userPwd = this.formData.password
        //       // 新参
        //       // const params = {
        //       //   userPhone: this.data.userPhone
        //       //   formerPwd,
        //       //   newPwd,
        //       //   verifyPwd
        //       // }
        //       // // 新接口
        //       // this.$api.user.changePassword(params).then(res => {
        //       //   this.$emit('on-login', this.params)
        //       // }).catch(err => {
        //       //   this.$message.error(err)
        //       // })
        //     }
        //     this.$emit('on-next-step')
        //   })
        //   // this.checkCurPhone().then(res => {
        //   //   this.params.phone = res.phone
        //   //   this.params.userName = res.userName
        //   //   // 避免由于api请求而记录token，所以要清除
        //   //   this.$store.commit('user/clearUser')
        //   //   this.$store.commit('user/clearToken')
        //   //   if (this.active === 1) {
        //   //     this.params.userPwd = this.formData.password
        //   //     this.$store.dispatch('user/updatePassword', this.params).then(res => {
        //   //       this.$emit('on-login', this.params)
        //   //     }).catch(err => {
        //   //       this.$message.error(err)
        //   //     })
        //   //   }
        //   //   this.$emit('on-next-step')
        //   // })
        })
      }
    },
    // 发送验证码
    sendMsgCode () {
      this.$refs.form.validateField('phone', valid => {
        if (this.timerMsg || valid) return
        // 按钮开关
        this.timerSendCode()
        // api 请求
        this.$api.user.sendCode({
          phone: this.formData.phone
        }).then(res => {
          const { vcode, vmark, phone } = res
          this.data.userPhone = phone
          this.data.vmark = vmark
          this.$message.success('已发送验证码, 请前往手机查看')
          console.log('%c [ 验证码 ]', 'font-size:13px; background:pink; color:#bf2c9f;', vcode)
        }).catch(err => {
          this.$message.error(err)
        })
      })
    },
    // 验证码倒计时
    timerSendCode () {
      // 存储初始值
      const initCount = this.countMsg
      const initBtnText = this.btnText
      this.timerMsg = setInterval(_ => {
        if (this.countMsg > 0) {
          this.btnText = `${this.countMsg}后重新获取`
          this.isDisabled = true
          this.countMsg--
        } else {
          // 重置为初始值
          clearInterval(this.timerMsg)
          this.countMsg = initCount
          this.timerMsg = null
          this.isDisabled = false
          this.btnText = initBtnText
        }
      }, 1000)
    }
  },
  components: {
    AunthForm,
    ItemButton
  }
}
</script>

<style lang="scss" scoped>
</style>
