<template>
  <el-container class="cloud-auth__wrap">
    <el-main>
      <el-row class="banner"></el-row>
    </el-main>
    <!-- 手机国际区号下拉宽度在当前 scss 样式设置 -->
    <el-aside width="440px">
      <el-row class="right-content__wrap">
        <!-- logo -->
        <el-row class="auth-logo__wrap">
          <el-image fit="contain" class="auth-logo" :src="logo"></el-image>
        </el-row>
        <!-- 子路由：[登录]、[注册]切换 -->
        <router-view></router-view>
      </el-row>
      <template>
        <el-row class="right-footer__wrap">
          <!-- 登录页：其他登录方式 -->
          <el-row
            v-if="isLogin"
            type="flex"
            justify="center"
            align="middle"
            class="other-ways__wrap"
          >
            <span class="other-text">其他登录方式：</span>
            <el-button
              v-for="item in otherWays"
              :key="item.way"
              type="success"
              size="small"
              circle
              plain
            >
              <i :class="item.icon" aria-hidden="true"></i>
            </el-button>
          </el-row>
          <!-- 注册页：前往登录 -->
          <el-row
            v-if="!isLogin && !isRegSuccess"
            type="flex"
            justify="center"
            align="middle"
            class="to-login__wrap"
          >
            <span class="">已有账号，</span>
            <el-link type="primary" @click="$router.push({ path: 'login' })"
              >立即登录</el-link
            >
          </el-row>
        </el-row>
      </template>
      <!-- 工商备案 -->
      <el-row class="records__wrap">
        <el-row type="flex" justify="center" align="middle">
          <span class="icon-gs"></span>
          <el-link type="info" :underline="false">粤ICP备05061721号</el-link>
        </el-row>
      </el-row>
    </el-aside>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      logo: 'https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/login/logo2_v2.png',
      otherWays: [
        { way: '微信登陆', icon: 'fa fa-weixin' }
      ]
    }
  },
  computed: {
    isLogin () {
      return this.$route.path.indexOf('login') > -1
    },
    isRegSuccess () {
      return this.$route.query.result === 'success'
    }
  }
}
</script>

<style lang="scss" scoped>
.cloud-auth__wrap {
  height: 100%;
  .el-main {
    padding: 0;
    .banner {
      height: 100%;
      background: url(https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/login/banner.png)
        no-repeat;
      background-size: cover;
    }
  }
  .el-aside {
    position: relative;
    .right-content__wrap {
      padding: 10px 50px;
      ::v-deep .auth-logo__wrap {
        margin: 45px 0 0;
        text-align: center;
        .auth-logo {
          img {
            width: 130px;
            height: 50px;
          }
        }
      }
      ::v-deep .flag-list-box.scroll-bar {
        // 440 - 50 * 2
        width: 340px;
      }
    }
    .right-footer__wrap {
      padding: 10px 20px;
      position: absolute;
      left: 0;
      bottom: 40px;
      width: 100%;
      // 其他登录方式
      .other-ways__wrap {
        .other-text {
          font-size: 12px;
          color: #333;
        }
        .el-button {
          margin-left: 6px;
        }
      }
      .to-login__wrap {
        margin-bottom: 30px;
        font-size: 14px;
      }
    }
    // 工商备案
    .records__wrap {
      padding: 20px 10px;
      position: absolute;
      bottom: 0;
      width: 100%;
      .icon-gs {
        display: inline-block;
        width: 16px;
        height: 16px;
        background: transparent
          url(https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/login/bqiocn.png)
          no-repeat center center/contain;
      }
      .el-link {
        margin-left: 10px;
        &:hover {
          color: #409eff;
        }
      }
    }
  }
}
</style>
