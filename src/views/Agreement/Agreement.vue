<template>
  <!-- 协议政策 -->
  <el-container style="height: 100vh" class="agreement__wrap">
    <el-aside width="322px" class="agreement__aside">
      <el-button type="text" icon="el-icon-back" @click="goBack"
        >返回</el-button
      >
      <el-collapse v-model="activeNames">
        <el-collapse-item
          v-for="item in collapseList"
          :key="item.title"
          :title="item.title"
          :name="item.title"
        >
          <el-row
            :class="[
              'sub-item',
              {
                active: $route.path === sub.path
              }
            ]"
            v-for="sub in item.children"
            :key="sub.subTitle"
            @click.native="$router.push(sub.path)"
          >
            {{ sub.subTitle }}
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-aside>
    <el-main class="agreement__main">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  created () {
    this.initActive()
  },
  data () {
    return {
      activeNames: [],
      collapseList: [
        {
          title: '使用协议',
          children: [
            {
              subTitle: '用户使用协议',
              path: '/agreement/clientPolicy'
            },
            {
              subTitle: '账号授权协议',
              path: '/agreement'
            }
          ]
        },
        {
          title: '隐私政策',
          children: [
            {
              subTitle: '高睿咨询隐私政策',
              path: '/agreement/privacyPolicy'
            }
          ]
        }
      ]
    }
  },
  methods: {
    // 默认展开所有
    initActive () {
      this.activeNames = this.collapseList.map(({ title }) => title)
    },
    goBack () {
      this.$router.push({ name: 'Login' })
    }
  }
}
</script>

<style lang="scss" scoped>
.agreement__wrap {
  .agreement__aside {
    padding: 65px 0;
    background-color: #404a65;
    .el-button--text {
      padding-left: 52px;
      font-size: 24px;
      color: #ffffff;
    }
    ::v-deep .el-collapse {
      border: 0 none;
      .el-collapse-item__header {
        padding-left: 52px;
        padding-right: 150px;
        font-size: 18px;
        color: #ffffff;
        background-color: inherit;
        border: 0 none;
      }
      .el-collapse-item__wrap {
        background-color: inherit;
        border: 0 none;
        .el-collapse-item__content {
          color: #ffffff;
          .sub-item {
            padding-left: 87px;
            height: 50px;
            font-size: 18px;
            line-height: 50px;
            cursor: pointer;
            &:hover,
            &.active {
              background-color: #4d5773;
            }
          }
        }
      }
    }
  }
  .agreement__main {
    padding-left: 56px;
    padding-right: 280px;
  }
}
</style>
