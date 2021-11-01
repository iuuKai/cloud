<template>
  <!-- 输入框封装 -->
  <el-input
    ref="input"
    :class="{ 'input-phone': type === 'phone', 'is-show-icon': showIcon }"
    v-model="vmodel"
    :type="
      type !== 'password' && type !== 'passwordComfirm'
        ? type
        : isPassWord
        ? 'password'
        : 'text'
    "
    :placeholder="placeholder"
    :size="size"
    :rows="rows"
    :autosize="autosize"
  >
    <!-- 电话 -->
    <template v-if="type === 'phone'" slot="prefix">
      <span v-if="showIcon" class="prefix-icon" :style="iconPhone"></span>
      <CountryCodeSelector
        ref="codeSelect"
        class="country-select"
        :countryCode.sync="vcode"
      ></CountryCodeSelector>
    </template>
    <!-- 密码 -->
    <template v-else-if="type === 'password' || type === 'passwordComfirm'">
      <span
        v-if="showIcon"
        slot="prefix"
        class="prefix-icon"
        :style="type === 'password' ? iconLock : iconLockReg"
      ></span>
      <span
        v-if="showIcon"
        slot="suffix"
        class="suffix-icon"
        :style="isPassWord ? iconBy : iconZy"
        @click="changeEye"
      ></span>
    </template>
    <!-- 其余正常的：邮箱/短信/验证码、账号 -->
    <template v-else>
      <span
        v-if="type === 'msg' && showIcon"
        slot="prefix"
        class="prefix-icon"
        :style="iconMsg"
      ></span>
      <span
        v-else-if="type === 'user' && showIcon"
        slot="prefix"
        class="prefix-icon"
        :style="iconUser"
      ></span>
      <span
        v-else-if="type === 'safety' && showIcon"
        slot="prefix"
        class="prefix-icon"
        :style="iconSafety"
      ></span>
    </template>
  </el-input>
</template>

<script>
// 国际电话区号选择
import CountryCodeSelector from 'vue-country-code-selector'

export default {
  props: {
    value: String,
    countryCode: Number,
    type: String,
    size: String,
    placeholder: String,
    rows: Number,
    autosize: {
      type: Boolean,
      default: false
    },
    showIcon: {
      type: Boolean,
      default: false
    },
    showPassword: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    // 若为手机号
    this.type === 'phone' && this.delFlag()
  },
  computed: {
    vmodel: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    vcode: {
      get () {
        return this.countryCode
      },
      set (val) {
        console.log(val)
        this.$emit('update:countryCode', val)
      }
    },
    // 手机
    iconPhone () {
      return this.icon('phone.png', '18px')
    },
    // 锁 - 圈
    iconLock () {
      return this.icon('lock1.png', '19px')
    },
    // 锁 - 钩
    iconLockReg () {
      return this.icon('lock2.png', '20px')
    },
    // 闭眼
    iconBy () {
      return this.icon('eyeClose.png', '18px')
    },
    // 开眼
    iconZy () {
      return this.icon('eyeOpen.png', '18px')
    },
    // 邮箱、短信
    iconMsg () {
      return this.icon('msg.png', '18px')
    },
    // 用户
    iconUser () {
      return this.icon('user.png', '17px')
    },
    // 护盾
    iconSafety () {
      return this.icon('shield.png', '18px')
    },
    icon () {
      return (path, size) => {
        return {
          backgroundSize: size,
          backgroundImage: `url(https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/icons/${path})`
        }
      }
    }
  },
  methods: {
    changeEye () {
      if (this.type.indexOf('password') === -1) return
      this.isPassWord = !this.isPassWord
    },
    // 移除国旗
    delFlag () {
      const codeSelect = this.$refs.codeSelect.$el.querySelector('.selected-flag')
      const flag = codeSelect.querySelector('.flag.cur-flag')
      codeSelect.removeChild(flag)
    }
  },
  data () {
    return {
      isPassWord: this.type ? this.type.indexOf('password') > -1 : false
    }
  },
  components: {
    CountryCodeSelector
  }
}
</script>

<style lang="scss" scoped>
::v-deep.el-input {
  .el-input__prefix,
  .el-input__suffix {
    padding: 0px 5px;
    font-size: 0;
    .prefix-icon {
      margin-left: -5px;
    }
    .prefix-icon,
    .suffix-icon {
      display: inline-block;
      vertical-align: middle;
      width: 25px;
      height: 20px;
      background-repeat: no-repeat;
      background-position: center;
    }
  }
  // icon 尺寸问题造成需要调整 padding
  &.el-input--prefix {
    .el-input__inner {
      padding-left: 36px;
    }
  }
  &.el-input--suffix {
    .el-input__inner {
      padding-right: 36px;
    }
  }
  // 如果是电话类型
  &.input-phone {
    &.is-show-icon {
      .el-input__inner {
        padding-left: 100px;
      }
      .selected-flag {
        padding-left: 20px;
      }
    }
    .el-input__inner {
      padding-left: 80px;
    }
    .country-select {
      position: absolute;
      left: -5px;
      top: 0;
      padding: 0;
      .selected-flag {
        .area-codeNum {
          padding: 0 10px;
          flex: none;
        }
        // 小箭头
        .tran {
          border-color: #999 transparent transparent;
        }
      }
      // 下拉
      .flag-list-box.scroll-bar {
        // 宽度应由明确给定宽度的容器去设置样式
        padding: 0 10px 5px;
        margin-top: 10px;
        height: auto;
        text-align: left;
        border-radius: 8px;
        background-color: #fff;
        // 不要自带的滚动条
        overflow: hidden;
        // 搜索框
        .search-input {
          padding-left: 35px;
          position: absolute;
          top: 10px;
          left: 50%;
          width: 95%;
          line-height: 24px;
          border-radius: 4px;
          background: url(https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/index/top_search.svg)
            no-repeat 8px center #f8f9fc;
          background-size: 16px;
          z-index: 1;
          transform: translateX(-50%);
        }
        // 改为 ul 使用滚动条
        .country-list {
          margin-top: 45px;
          height: 150px;
          overflow-y: auto;
          .list-item:first-child {
            margin-top: 0px;
          }
          &::-webkit-scrollbar {
            width: 3px;
            height: 20px;
          }
          &::-webkit-scrollbar-thumb {
            background: #979797;
          }
        }
      }
    }
  }
  // small 输入框的下拉间隙
  &.el-input--small {
    .country-select {
      .flag-list-box.scroll-bar {
        margin-top: 0;
      }
    }
  }
  .el-input__inner {
    // height: 44px;
    // line-height: 44px;
  }
  // 取消边框样式
  .el-input__inner:focus,
  .el-input__inner:hover {
    // border-color: #dcdfe6;
  }
}
</style>
