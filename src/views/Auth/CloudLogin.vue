<template>
  <el-row class="cloud-login__wrap">
    <!-- 头部标题 -->
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      class="header-title__wrap"
    >
      <span class="name">{{ title }}</span>
      <el-link type="primary" class="reg" @click="$router.push({ name: 'Reg' })"
        >立即注册</el-link
      >
    </el-row>
    <!-- 动态组件 -->
    <component :is="currItem.component" ref="form">
      <!-- 只是想着一起引入 button 就放这里了 -->
      <ItemButton
        v-if="currItem.component === 'LoginWithMsg'"
        slot="msgCodeButton"
        type="primary"
        :disabled="isDisabled"
        @click="sendMsgCode"
      >
        {{ btnText }}
      </ItemButton>
    </component>
    <!-- 权限、协议 -->
    <el-row class="inform-text__wrap">
      <el-row class="inform-text" type="flex" align="middle">
        登录后<el-link type="primary">高睿云官网</el-link>将获得以下权限<i
          class="el-icon-caret-bottom"
          @click="handleCollapse"
        ></i>
      </el-row>
      <!-- 复选框 -->
      <el-collapse ref="collapse" v-model="informCoolapse" accordion>
        <el-collapse-item name="1">
          <div>您的个人资料(昵称、头像)</div>
          <div>您的组织、团队信息</div>
        </el-collapse-item>
      </el-collapse>
      <!-- 协议 -->
      <OauthAgree v-model="isAgree"></OauthAgree>
    </el-row>
    <!-- 忘记密码 -->
    <el-row class="forget-pwd__wrap">
      <el-link class="forget-pwd" @click="handleForget">忘记密码</el-link>
    </el-row>
    <!-- 登录 -->
    <el-row class="login-btn__wrap">
      <ItemButton type="primary" :disabled="!isAgree" @click="handleLogin"
        >登录</ItemButton
      >
    </el-row>
    <!-- 登录方式 -->
    <el-row class="login-ways__wrap">
      <template v-for="(item, i) in loginWays">
        <el-divider
          v-if="i >= 1"
          direction="vertical"
          :key="item.way"
        ></el-divider>
        <el-link :key="item.way" @click="selectedWay(item)">
          {{ item.way }}
        </el-link>
      </template>
    </el-row>
    <ForgetDialog v-model="forgetDialog"></ForgetDialog>
  </el-row>
</template>

<script>
// 忘记密码组件
import ForgetDialog from '@/components/cloudAuth/forget/forgetDialog'

// 登录组件
import LoginWithPhone from '@/components/cloudAuth/login/loginWithPhone'
import LoginWithMsg from '@/components/cloudAuth/login/loginWithMsg'
import LoginWithEmail from '@/components/cloudAuth/login/loginWithEmail'
import LoginWithUserName from '@/components/cloudAuth/login/loginWithUserName'

// 其它组件
import OauthAgree from '@/components/cloudAuth/oauthAgree'
import ItemButton from '@/components/form/button'

export default {
  data () {
    return {
      forgetDialog: false,
      isAgree: false,
      title: '高睿云 · 账号登录',
      btnText: '获取验证码',
      isDisabled: false,
      informCoolapse: '',
      // 验证码
      timerMsg: null,
      countMsg: 60,
      // 当前登录模式
      currItem: {
        way: '手机号登录',
        component: 'LoginWithPhone'
      },
      loginWays: [
        { way: '短信登录', component: 'LoginWithMsg' },
        { way: '邮箱登录', component: 'LoginWithEmail' },
        { way: '用户名登录', component: 'LoginWithUserName' }
      ],
      data: {
        phone: '',
        userPwd: '',
        vcode: '',
        vmark: ''
      }
    }
  },
  methods: {
    // 忘记密码
    handleForget () {
      this.forgetDialog = true
    },
    // 登录
    handleLogin () {
      // 回调拿到 data 数据（子组件整好了数据结构，直接判断类型，然后发送请求）
      this.$refs.form.submit(res => {
        const { type, data } = res
        if (type === 'loginWithPhone') {
          // 手机号登录
          const { phone, password } = data
          this.data.phone = phone
          this.data.userPwd = password
        } else if (type === 'loginWithMsg') {
          // 短信登录
          const { phone, msgCode } = data
          this.data.phone = phone
          this.data.vcode = msgCode
        } else if (type === 'loginWithEmail') {
          // 邮箱登录
          // const { email, password } = data
          // this.data.userPwd = password
          return this.$message.warning('邮箱登录, 尽情期待...')
        } else if (type === 'loginWithUserName') {
          // 用户名登录
          // const { userName, password } = data
          // this.data.userPwd = password
          return this.$message.warning('用户名登录, 尽情期待...')
        }
        this.$api.user.login(this.data).then(res => {
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
      })
    },
    // 触发折叠面板
    handleCollapse () {
      if (this.informCoolapse) {
        this.$refs.collapse.handleItemClick('1')
      } else {
        this.$refs.collapse.setActiveNames('1')
      }
    },
    // 选择登陆模式
    selectedWay (selected) {
      const currItem = this.currItem
      this.currItem = {
        way: selected.way,
        component: selected.component
      }
      selected.way = currItem.way
      selected.component = currItem.component
    },
    // 发送验证码
    sendMsgCode () {
      this.$refs.form.validatePhone(phone => {
        if (this.timerMsg) return
        // 按钮开关
        this.timerSendCode()
        this.params.phone = phone
        // api 请求
        this.$api.user.sendCode(this.params).then(res => {
          const { status, data: { eid, data, msg } } = res
          if (status === 200 && eid === 200) {
            const { vcode, vmark } = data
            this.params.vmark = vmark
            this.$message.success('已发送验证码, 请前往手机查看')
            console.log('%c [ 验证码 ]', 'font-size:13px; background:pink; color:#bf2c9f;', vcode)
          } else {
            this.$message.error(msg)
          }
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
    // 忘记密码
    ForgetDialog,
    // 登录
    LoginWithPhone,
    LoginWithMsg,
    LoginWithEmail,
    LoginWithUserName,
    // 其它
    OauthAgree,
    ItemButton
  }
}
</script>

<style lang="scss" scoped>
.cloud-login__wrap {
  padding-top : 45px;
  .header-title__wrap {
    height : 26px;
    .name {
      font-size : 14px;
      font-weight : 500;
      color : #7F7D7D;
    }
    .reg {
      line-height : 14px;
      font-size : 12px;
      font-weight : 400;
    }
  }
  // 权限获取
  .inform-text__wrap {
    margin-top : 15px;
    .inform-text {
      padding : 5px 0;
      font-size : 13px;
      color : #7D7F7F;
      .el-link {
        font-size : 13px;
      }
      i {
        padding : 0 4px;
        font-size : 16px;
        cursor : pointer;
      }
    }
    // 折叠面板
    ::v-deep .el-collapse {
      padding-bottom : 5px;
      border : 0 none;
      .el-collapse-item__header {
        display : none;
      }
      .el-collapse-item__wrap {
        background-color : inherit;
        border-bottom : 0 none;
        .el-collapse-item__content {
          padding-bottom : 0;
          font-size : 12px;
          color : #999999;
        }
      }
    }
  }
  // 忘记密码
  .forget-pwd__wrap {
    margin-top : 10px;
    text-align : right;
    .forget-pwd {
      line-height : 14px;
      font-size : 14px;
    }
  }
  // 登录按钮
  .login-btn__wrap {
    margin-top : 20px;
  }
  // 登录方式
  .login-ways__wrap {
    margin : 24px 0 10px;
    text-align : center;
    .el-link {
      line-height : 14px;
      font-size : 12px;
    }
    .el-divider {
      margin : 0 16px;
    }
  }
}

</style>
