<template>
  <el-row class="cloud-reg__wrap">
    <!-- 头部标题 -->
    <el-row
      type="flex"
      justify="center"
      align="middle"
      class="header-title__wrap"
    >
      <span class="name">{{ title }}</span>
    </el-row>
    <!-- 注册结果 -->
    <el-result v-if="isResultSuccess && $route.query.result === 'success'">
      <h1 slot="title">恭喜您已注册成功</h1>
      <el-row slot="subTitle">{{ countReg }}秒后，将自动登录</el-row>
      <el-image
        slot="icon"
        src="https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/login/if-check-circled.svg"
      ></el-image>
      <ItemButton slot="extra" type="primary" @click="handleLogin"
        >立即登录</ItemButton
      >
    </el-result>
    <template v-else>
      <!-- 注册表单 -->
      <RegForm ref="form">
        <!-- 只是想着一起引入 button 就放这里了 -->
        <ItemButton
          slot="msgCodeButton"
          type="primary"
          :disabled="isDisabled"
          @click="sendMsgCode"
        >
          {{ btnText }}
        </ItemButton>
      </RegForm>
      <!-- 协议 -->
      <OauthAgree v-model="isAgree" custom-class="reg-oauth"></OauthAgree>
      <!-- 注册 -->
      <el-row class="reg-btn__wrap">
        <ItemButton type="primary" :disabled="!isAgree" @click="handleRegister"
          >注册高睿云账号</ItemButton
        >
      </el-row>
    </template>
  </el-row>
</template>

<script>
import RegForm from '@/components/cloudAuth/reg/regForm'
import OauthAgree from '@/components/cloudAuth/oauthAgree'
import ItemButton from '@/components/form/button'

export default {
  created () {
    // 后期再看看删不删除吧，因为注册成功后就添加 query 然后给父组件拿参就行了的
    this.setQuery()
  },
  destroyed () {
    // 清除计时器
    clearInterval(this.timerMsg)
    clearInterval(this.timerReg)
  },
  data () {
    return {
      isAgree: false,
      isResultSuccess: false,
      title: '注册高睿云 · 账号',
      btnText: '获取验证码',
      isDisabled: false,
      // 验证码
      timerMsg: null,
      countMsg: 60,
      // 5 秒登录
      timerReg: null,
      countReg: 5,
      data: {
        phone: '',
        userPwd: '',
        vcode: '',
        vmark: ''
      }
    }
  },
  watch: {
    isResultSuccess (newValue, oldValue) {
      this.setQuery()
    },
    countReg (newValue, oldValue) {
      if (newValue === 0) {
        this.handleLogin()
      }
    }
  },
  methods: {
    // 登录
    handleLogin () {
      this.$api.user.login(this.data).then(res => {
        console.log('%c [ 登录 ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
        this.$store.commit('user/setUser', res)
        // 无 token
        this.$store.commit('user/setToken', res.id)
        // 路由跳转
        this.$router.push({ name: 'Transition', params: { isNewReg: true } })
        this.$message.success(`${res.userName}, 登录成功!`)
      }).catch(err => {
        this.$message.error(err)
      })
    },
    // 注册
    handleRegister () {
      // 回调拿到 data 数据（子组件整好了数据结构，直接判断类型，然后发送请求）
      this.$refs.form.submit(res => {
        const { type, data } = res
        // 注册（其实注册只有一种，所以并不需要判断区分）
        if (type === 'regForm') {
          const { phone, password, msgCode } = data
          this.data.phone = phone
          this.data.userPwd = password
          this.data.vcode = msgCode
          this.$api.user.register(this.data).then(res => {
            console.log('%c [ 注册成功 ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
            this.timerToLogin()
          }).catch(err => {
            this.$message.error(err)
          })
        }
      })
    },
    // 发送验证码
    sendMsgCode () {
      this.$refs.form.validatePhone(phone => {
        if (this.timerMsg) return
        // 按钮开关
        this.timerSendCode()
        this.data.phone = phone
        this.$api.user.sendCode(this.data).then(res => {
          const { vcode, vmark } = res
          this.data.vmark = vmark
          this.$message.success('已发送验证码, 请前往手机查看')
          console.log('%c [ 验证码 ]', 'font-size:13px; background:pink; color:#bf2c9f;', vcode)
        }).catch(err => {
          this.$message.error(err)
        })
      })
    },
    // 登录倒计时
    timerToLogin () {
      const initCount = this.countReg
      this.isResultSuccess = true
      this.timerReg = setInterval(_ => {
        if (this.countReg > 0) {
          this.countReg--
        } else {
          // 重置为初始值
          clearInterval(this.timerReg)
          this.countReg = initCount
          this.timerReg = null
        }
      }, 1000)
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
    // 设置 query
    setQuery () {
      if (this.isResultSuccess && !this.$route.query.result) {
        this.$router.push({ path: '', query: { result: 'success' } })
      }
      if (!this.isResultSuccess && this.$route.query.result) {
        this.$router.push({ query: {} })
      }
    }
  },
  components: {
    RegForm,
    OauthAgree,
    ItemButton
  }
}
</script>

<style lang="scss" scoped>
.cloud-reg__wrap {
  padding-top : 10px;
  .header-title__wrap {
    height : 50px;
    font-size : 18px;
    font-weight : 500;
  }
  .reg-oauth {
    margin-top : 15px;
  }
  .reg-btn__wrap {
    margin-top : 20px;
  }
  // 注册结果
  ::v-deep .el-result {
    padding : 23px 0 0 0;
    .el-result__title {
      font-size : 24px;
    }
    .el-result__subtitle {
      color : #909399;
    }
    .el-result__extra {
      width : 100%;
    }
  }
}

</style>
