<template>
  <!-- 修改手机号弹窗 -->
  <el-dialog :visible.sync="vmodel" width="460px" :close-on-click-modal="false">
    <el-row slot="title" class="dialog-title">修改手机号</el-row>
    <!-- 成功结果 -->
    <el-result v-if="isResultSuccess">
      <el-row slot="subTitle">修改成功，下次请使用新手机号码登录。</el-row>
      <el-image
        slot="icon"
        src="https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/login/if-check-circled.svg"
      ></el-image>
      <ItemButton slot="extra" size="small" type="primary" @click="handleClose"
        >关闭</ItemButton
      >
    </el-result>
    <!-- 修手机号表单 -->
    <el-form
      v-else
      ref="form"
      :model="formData"
      :rules="formRules"
      size="small"
    >
      <template v-for="item in formLabel">
        <el-form-item
          v-if="item.active === active"
          :key="item.model"
          :prop="item.model"
        >
          <template v-if="item.type === 'msgCode'">
            <el-row type="flex" justify="space-between" class="msg-code__wrap">
              <el-col :span="14">
                <ItemInput
                  type="msg"
                  v-model="formData[item.model]"
                  :placeholder="item.placeholder"
                  :showIcon="item.showIcon"
                ></ItemInput>
              </el-col>
              <el-col :span="10">
                <ItemButton
                  type="primary"
                  :disabled="isDisabled"
                  @click="sendMsgCode"
                >
                  {{ btnText }}
                </ItemButton>
              </el-col>
            </el-row>
          </template>
          <ItemInput
            v-else
            v-model="formData[item.model]"
            :type="item.type"
            :placeholder="item.placeholder"
          ></ItemInput>
        </el-form-item>
      </template>
      <el-form-item>
        <ItemButton size="small" type="primary" @click="submitForm">
          {{ active === 0 ? '下一步' : '确定' }}
        </ItemButton>
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
  destroyed () {
    // 清除计时器
    clearInterval(this.timerMsg)
  },
  data () {
    return {
      // 这个是步骤
      active: 0,
      isResultSuccess: false,
      isDisabled: false,
      // 验证码
      timerMsg: null,
      countMsg: 60,
      btnText: '获取验证码',
      formData: {
        password: '',
        phone: '',
        msgCode: ''
      },
      formLabel: [
        { model: 'password', placeholder: '请输入当前账号的登录密码', type: 'password', active: 0 },
        { model: 'phone', placeholder: '请输入新手机号码', type: 'phone', subModel: 'countryCode', active: 1 },
        { model: 'msgCode', placeholder: '请输入6位验证码', type: 'msgCode', active: 1 }
      ],
      formRules: {
        password: [
          { required: true, message: '请输入当前账号的登录密码', trigger: 'change' },
          { pattern: /^[^\s]*$/, message: '请勿输入空格', trigger: 'blur' },
          { pattern: /^[^\s]{8,18}$/, message: '密码长度不正确', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '当前手机号码为空', trigger: 'change' },
          { pattern: /^\d{11,11}$/, message: '手机号码格式不正确', trigger: 'blur' }
        ],
        msgCode: [
          { required: true, message: '请输入短信验证码', trigger: 'change' },
          { pattern: /^\d{6,6}$/, message: '验证码长度不正确', trigger: 'blur' }
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
      this.params.phone = this.$store.state.user.user.phone
      this.params.userPwd = this.formData.password
      return this.$store.dispatch('user/userLogin', this.params)
    },
    // 然后发送验证码
    sendMsgCode () {
      this.$refs.form.validateField('phone', valid => {
        if (this.timerMsg || valid) return
        // 按钮开关
        this.timerSendCode()
        this.params.phone = this.formData.phone
        // api 请求
        this.$store.dispatch('user/sendCode', this.params).then(res => {
          const { vcode, vmark } = res
          this.params.vcode = vcode
          this.params.vmark = vmark
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
    },
    // 提交注册表单
    submitForm () {
      this.$refs.form.validate(valid => {
        if (!valid) return
        this.checkCurPwd().then(res => {
          // 第一步是输入当前密码验证
          if (this.active === 0) {
            this.active++
            this.params.phone = res.phone
            const { newPhone } = this.formData
            this.params.phone = newPhone
          } else if (this.active === 1) {
            // 第二步则是新手机号修改
            const { newPhone } = this.formData
            this.params.phone = newPhone
            // 等接口
            // this.$store.dispatch('user/updatePhone', this.params)
            this.isResultSuccess = true
          }
          // this.$store.dispatch('user/updatePassword', this.params).then(res => {
          //   this.isPasswordTrue = true
          // }).catch(err => {
          //   this.$message.error(err)
          // })
        }).catch(err => {
          this.$message.error(err)
        })
      })
    },
    handleClose () {
      this.active = 0
      this.vmodel = false
      this.isResultSuccess = false
      // 重置表单
      this.formData = {
        password: '',
        newPhone: '',
        msgCode: ''
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
    text-align: center;
    // font-size: 14px;
  }
  .el-dialog__body {
    padding-top: 13px;
    padding-bottom: 4px;
    // 表单
    .el-form {
      padding: 0;
      margin: 0 auto;
      width: 244px;
      .msg-code__wrap {
        .el-input,
        .el-input__inner {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
        .el-button {
          height: 100%;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
      }
      .flag-list-box.scroll-bar {
        width: 244px;
      }
    }
    // 成功
    .el-result {
      padding: 0;
      .el-result__icon {
        width: 71px;
        height: 71px;
        font-size: 0;
      }
    }
  }
}
</style>
