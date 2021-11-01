<template>
  <el-row class="admin-sidebar" type="flex" justify="space-between">
    <el-menu
      class="sidebar-menu"
      :default-active="currItem"
      :collapse="isCollapse"
      background-color="#343848"
      text-color="#c1cadc"
      active-text-color="#5582F3"
      :collapse-transition="false"
    >
      <!-- 未折叠用这个 -->
      <template v-if="!isCollapse">
        <el-popover
          v-for="item in menuList"
          :key="item.id"
          placement="right-start"
          width="auto"
          trigger="hover"
          popper-class="aside-menu__popover"
        >
          <template v-if="item.children && item.children.length > 0">
            <el-submenu
              slot="reference"
              :index="item.menuName"
              @click.native="handleClick(item)"
            >
              <template slot="title">
                <el-image
                  style="width: 24px; height: 24px"
                  :src="item.imgUrl"
                ></el-image>
                <span
                  :class="{
                    'is-hide': isCollapse
                  }"
                  style="margin-left: 10px"
                  >{{ item.menuName }}</span
                >
              </template>
            </el-submenu>
            <template v-for="subItem in item.children">
              <el-menu-item
                v-if="subItem.remark === '1'"
                :key="subItem.id"
                :index="subItem.menuName"
                @click="handleClick(subItem)"
              >
                <span>{{ subItem.menuName }}</span>
              </el-menu-item>
            </template>
          </template>
          <el-menu-item
              v-else
              slot="reference"
              :index="item.menuName"
              @click.native="handleClick(item)"
            >
              <template slot="title">
                <el-image
                  style="width: 24px; height: 24px"
                  :src="item.imgUrl"
                ></el-image>
                <span
                  :class="{
                    'is-hide': isCollapse
                  }"
                  style="margin-left: 10px"
                  >{{ item.menuName }}</span
                >
              </template>
            </el-menu-item>
        </el-popover>
      </template>
      <!-- 折叠后用这个 -->
      <template v-else>
        <template v-for="item in menuList">
          <el-submenu
            :key="item.id"
            :index="item.menuName"
            popper-class="aside-menu__popup"
            @click.native="handleClick(item)"
          >
            <template slot="title">
              <el-image
                style="width: 24px; height: 24px"
                :src="item.imgUrl"
              ></el-image>
              <span
                :class="{
                  'is-hide': isCollapse
                }"
                >{{ item.menuName }}</span
              >
            </template>
            <template v-for="subItem in item.children">
              <el-menu-item
                v-if="subItem.remark === '1'"
                :key="subItem.id"
                :index="subItem.menuName"
                @click="handleClick(subItem)"
              >
                <span>{{ subItem.menuName }}</span>
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
      </template>
    </el-menu>
    <el-row class="admin-aside-footer">
      <el-button
        type="text"
        class="footer-tool-item"
        @click="collapseAsideMenu"
      >
        <i :class="`el-icon-s-${isCollapse ? 'unfold' : 'fold'}`"></i>
      </el-button>
    </el-row>
  </el-row>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  props: {
    value: Array
  },
  mounted () {
    this.removeEmtyChild()
  },
  data () {
    return {
      currItem: '首页'
    }
  },
  computed: {
    ...mapState({
      isCollapse: state => state.menu.isCollapse
    }),
    menuList: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    iconURL () {
      return (path) => `https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/icons/asideIcons/${path}`
    }
  },
  watch: {
    isCollapse (newValue, oldValue) {
      if (newValue) {
        this.removeEmtyChild()
      }
    }
  },
  methods: {
    ...mapMutations('menu', [
      'collapseAsideMenu'
    ]),
    handleClick (item) {
      this.currItem = item.menuName
      // 有子项则不触发
      if (item.children && item.children.length > 0) return
      this.$emit('menu-click', item)
    },
    removeEmtyChild () {
      // 存在延迟
      setTimeout(_ => {
        const popup = document.querySelectorAll('.aside-menu__popup .el-menu--popup')
        popup.forEach(item => {
          // 无子则隐藏
          if (item.children.length === 0) {
            item.style.display = 'none'
          }
        })
      }, 500)
    }
  }
}
</script>

<style lang="scss">
.el-menu--collapse .el-menu .el-submenu,
.el-menu--popup {
  min-width: 125px;
}
.el-popover {
  min-width: 125px;
  .el-menu-item {
    height: 50px;
    line-height: 50px;
  }
}
.el-menu--vertical {
  .el-menu {
    padding: 0;
    i[class*='fa-'] {
      margin-right: 5px;
      width: 24px;
      text-align: center;
      font-size: 18px;
      vertical-align: middle;
    }
  }
  &.aside-menu__popup {
    .el-menu {
      margin: 0;
      .el-menu-item {
        height: 50px;
        line-height: 50px;
        &.is-active {
          color: $cloudColor !important;
        }
      }
    }
  }
}
.el-popper[x-placement^='right'] {
  &.aside-menu__popover {
    padding: 0;
    margin-left: 0px;
    border-radius: 0;
    border: 0 none;
    color: #c1cadc;
    background-color: #343848;
    user-select: none;
    .popper__arrow {
      display: none;
    }
    .el-submenu,
    .el-menu-item {
      &:hover {
        color: #a1a5b1 !important;
      }
      &.is-active {
        color: $cloudColor !important;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.admin-sidebar {
  height: 100%;
  background-color: #343848;
  flex-flow: column;
  .el-menu {
    width: 50px;
    height: 100%;
    border: none;
    user-select: none;
    overflow-x: hidden;
    overflow-y: auto;
    user-select: none;
    .el-menu-item,
    .el-submenu {
      i,
      span {
        color: #c1cadc;
      }
    }
    .el-menu-item,
    ::v-deep .el-submenu__title {
      padding: 0 10px !important;
    }
    .is-hide {
      display: none;
    }
    ::v-deep .el-submenu__icon-arrow {
      display: none;
    }
    &.sidebar-menu:not(.el-menu--collapse) {
      width: 135px;
      min-height: 400px;
    }
    i[class*='fa-'] {
      margin-right: 5px;
      width: 24px;
      text-align: center;
      font-size: 18px;
      vertical-align: middle;
    }
  }
  .admin-aside-footer {
    height: 50px;
    border-top: 1px solid rgba(218, 222, 237, 0.1);
    .footer-tool-item {
      width: 50px;
      height: 50px;
      font-size: 20px;
      color: #c1cadc;
      &:hover {
        color: $cloudColor;
      }
    }
  }
}
// 滚动条样式
.el-menu {
  &::-webkit-scrollbar {
    width: 8px !important;
    height: 8px !important;
    overflow: visible;
  }
  &::-webkit-scrollbar-button {
    width: 0;
    height: 0;
  }
  &::-webkit-scrollbar-corner {
    background: 0 0;
  }
  &::-webkit-scrollbar-thumb {
    background-clip: content-box;
    border: 4px solid #42526e;
  }
  &::-webkit-scrollbar-thumb {
    min-height: 28px;
    height: 5px;
    min-width: 2px;
    width: 5px;
    border-radius: 4px;
    border: dashed transparent;
    padding: 100px 0 0;
    border-width: 1px;
    background-color: #b2b2b2;
    background-clip: padding-box;
  }
  &::-webkit-scrollbar-track {
    border-radius: 10px;
  }
}
</style>
