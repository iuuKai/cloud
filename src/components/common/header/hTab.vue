<template>
  <el-row type="flex" align="middle">
    <el-tabs
      v-model="currTab"
      type="card"
      @tab-remove="$emit('tab-remove', $event)"
      @tab-click="$emit('tab-click', $event.name)"
    >
      <el-tab-pane
        v-for="item in fixedTabs"
        :key="item.name"
        :label="item.name"
        :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>
    <template v-if="floatTabs.length > 0">
      <el-divider direction="vertical"></el-divider>
      <el-tabs
        v-model="currTab"
        type="card"
        @tab-remove="$emit('tab-remove', $event)"
        @tab-click="$emit('tab-click', $event.name)"
      >
        <el-tab-pane
          v-for="item in floatTabs"
          :key="item.name"
          :label="item.name"
          :name="item.name"
          :closable="!item.isLock"
        ></el-tab-pane>
      </el-tabs>
    </template>
  </el-row>
</template>

<script>
export default {
  props: {
    value: String,
    fixedTabs: Array,
    floatTabs: Array
  },
  computed: {
    currTab: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    // 点击标签
    clickTab (tab) {
      // console.log('%c [ 一级页签 ]', 'font-size:13px; background:pink; color:#bf2c9f;', tab.name)
      this.$emit('on-click-tab', tab.name)
    }
  }
}
</script>

<style lang="scss" scoped>
// 标签页
::v-deep.el-tabs {
  user-select : none;
  .el-tabs__header {
    margin-bottom : 0;
    border-bottom : 0 none;
    .el-tabs__nav {
      display : flex;
      border : 0 none;
      .el-tabs__item {
        padding : 0 25px;
        height : 52px;
        line-height : 52px;
        font-size : 16px;
        border : 0 none;
        // 关闭过度
        // transition: none;
        &.is-active {
          color : #FFFFFF;
          border-bottom : 0 none;
          background-color : #1E73BA;
          user-select : none;
          span.el-icon-close:hover {
            color : #FFFFFF;
          }
        }
        &:hover:not(.is-active) {
          color : #000000;
        }
        &.is-closable:hover {
          padding : 0 25px;
          span.el-icon-close {
            width : 16px;
          }
        }
        span.el-icon-close {
          margin-left : 0;
          position : absolute;
          top : 4px;
          right : 7px;
          width : 0;
          height : 16px;
          font-size : 16px;
          &:hover {
            color : #000000;
            font-weight : bold;
            background-color : transparent;
          }
        }
      }
    }
  }
}
.el-divider {
  margin : 0 1px;
  height : 26px;
  background-color : #CCCCCC;
}

</style>
