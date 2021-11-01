<template>
  <!-- 忘记密码弹窗 -->
  <el-dialog
    :visible.sync="vmodel"
    :close-on-click-modal="false"
    width="1024px"
    height="620px"
  >
    <h1 class="forget-title">重置密码</h1>
    <el-steps :active="active" finish-status="wait">
      <el-step title="账号验证"></el-step>
      <el-step title="重置密码"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <el-row class="tips-info" v-if="active === 0">
      <div>
        请输入与您的账号关联的{{
          currWayIndex === 0 ? '电话号码' : '邮箱'
        }}，我们会给您发送验证码来重置密码。
      </div>
      <el-link type="primary" @click="switchWay"
        >切换{{ currWayIndex === 0 ? '邮箱验证' : '手机验证' }}</el-link
      >
    </el-row>
    <el-result v-if="isResultSuccess">
      <h1 slot="title">重置密码成功</h1>
      <el-row slot="subTitle">{{ countReg }}秒后，将自动登录</el-row>
      <el-image
        slot="icon"
        src="https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/login/if-check-circled.svg"
      ></el-image>
      <ItemButton slot="extra" type="primary" @click="handleLogin"
        >立即登录</ItemButton
      >
    </el-result>
    <!-- 动态组件 -->
    <component
      v-else
      class="forget-form"
      ref="form"
      :is="forgetWays[currWayIndex].component"
      :visible="vmodel"
      :active="active"
      @on-login="timerToLogin"
      @on-next-step="next"
    ></component>
  </el-dialog>
</template>

<script>
import ForgetWithPhone from './forgetWithPhone'
import ForgetWithEmail from './forgetWithEmail'
import ItemButton from '@/components/form/button'

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      active: 0,
      isResultSuccess: false,
      // 7 秒登录
      timerReg: null,
      countReg: 7,
      // 当前验证方式
      currWayIndex: 0,
      forgetWays: [
        { way: '手机验证', component: 'ForgetWithPhone' },
        { way: '邮箱验证', component: 'ForgetWithEmail' }
      ],
      // 由子传递过来
      params: {}
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
  watch: {
    vmodel (newValue, oldValue) {
      // 关闭后重置
      if (!newValue) {
        this.active = 0
        this.isResultSuccess = false
        this.currWayIndex = 0
      }
    },
    countReg (newValue, oldValue) {
      if (newValue === 0) {
        this.handleLogin()
      }
    }
  },
  methods: {
    // 切换验证方式
    switchWay () {
      this.currWayIndex = this.currWayIndex === 0 ? 1 : 0
      this.active = 0
    },
    next () {
      if (this.active++ > 2) this.active = 0
    },
    // 登录
    handleLogin () {
      // 邮箱验证请求还没好
      if (this.currWayIndex === 1) return this.$message.warning('邮箱验证, 尽情期待...')
      // api 请求（都是同一个请求）
      // this.$store.dispatch('user/userLogin', this.params).then(res => {
      //   console.log('%c [ 登录 ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
      //   // 路由跳转
      //   this.$router.push({ name: 'Transition' })
      //   this.$message.success(`${res.userName}, 登录成功!`)
      // }).catch(err => {
      //   this.$message.error(err)
      // })
      this.$api.user.login(this.params).then(res => {
        console.log('%c [ 登录 ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
        this.$store.commit('user/setUser', res)
        // 无 token
        this.$store.commit('user/setToken', res.id)
        // 路由跳转
        this.$router.push('/transition')
        this.$message.success(`${res.userName}, 登录成功!`)
      }).catch(err => {
        this.$message.error(err)
      })
    },
    // 登录倒计时(子传参)
    timerToLogin (params) {
      this.params = params
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
    }
  },
  components: {
    // 忘记密码
    ForgetWithPhone,
    ForgetWithEmail,
    // 其它组件
    ItemButton
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  .el-dialog__body {
    .forget-title {
      padding: 40px 0;
      font-size: 28px;
      text-align: center;
      color: #101010;
    }
    .tips-info {
      margin: 15px auto 6px;
      // width: 450px;
      width: max-content;
      text-align: right;
      .el-link {
        margin-top: 10px;
        margin-right: 36px;
      }
    }
    // 步骤
    .el-steps {
      width: 320px;
      margin: 0 auto;
      .is-process {
        .el-step__icon {
          color: #fff;
          border-color: #1e73ba;
          background-color: #1e73ba;
        }
      }
      .is-wait {
        .el-step__icon {
          color: #fff;
          border-color: #c9d0e1;
          background-color: #c9d0e1;
        }
      }
    }
    // 表单
    .forget-form {
      margin: 0 auto 88px;
      width: 336px;
    }
    // 结果
    .el-result {
      padding: 0;
      margin: 0 auto;
      width: 336px;
      .el-result__title {
        margin-top: 0;
      }
      .el-image {
        width: 140px;
        height: 140px;
      }
      .el-result__extra {
        margin-top: 10px;
        width: 100%;
      }
    }
  }
}
</style>
