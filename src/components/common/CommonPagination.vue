<template>
  <!-- 分页器 -->
  <el-row v-if="pageConfig.total > 0" type="flex" :justify="showTotal ? 'space-between' : 'end'" align="middle">
    <el-row
      v-if="showTotal"
      style="
        padding-left: 10px;
        font-size: 12px;
        font-weight: 400;
        color: #606266;
      "
      >已选{{ selected }}条, 共{{ pageConfig.total }}条</el-row
    >
    <el-row class="c-pagination" type="flex" align="middle">
      <span class="c-pagination__total-pages">共{{ maxPages }}页</span>
      <span class="c-pagination__jump"
        >第<el-input-number
          v-model="pageConfig.currPage"
          size="mini"
          :controls="false"
          :min="1"
          @change="handleChange"
        ></el-input-number
        >页</span
      >
      <el-button
        type="text"
        v-for="item in paginationBtns"
        :class="`c-pagination__${item.title}`"
        :key="item.title"
        :disabled="item.disabled"
        @click="handleClick(item.title)"
      >
      </el-button>
      <span class="c-pagination__sizes">
        <el-select
          size="mini"
          v-model="pageConfig.limit"
          @change="$emit('size-change', $event)"
        >
          <el-option
            v-for="item in paginationSizes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </span>
    </el-row>
  </el-row>
</template>

<script>
export default {
  props: {
    showTotal: {
      type: Boolean,
      default: true
    },
    selected: Number,
    pageConfig: Object
  },
  created () {
    this.initPaginationBtns()
  },
  data () {
    return {
      paginationBtns: [{ title: 'first', disabled: false }, { title: 'prev', disabled: false }, { title: 'next', disabled: false }, { title: 'last', disabled: false }],
      paginationSizes: [
        { value: 10, label: '10条/页' },
        { value: 20, label: '20条/页' },
        { value: 30, label: '30条/页' },
        { value: 50, label: '50条/页' },
        { value: 100, label: '100条/页' }
      ]
    }
  },
  computed: {
    maxPages () {
      return Math.ceil(this.pageConfig.total / this.pageConfig.limit)
    }
  },
  watch: {
    pageConfig: {
      handler (newValue, oldValue) {
        this.initPaginationBtns()
      },
      deep: true
    }
  },
  methods: {
    // 初始化按钮状态
    initPaginationBtns () {
      // 如果当前页数为最后一夜或者第一页则禁用
      if (this.pageConfig.currPage === 1 && this.pageConfig.currPage === this.maxPages) {
        this.paginationBtns.forEach(item => {
          item.disabled = true
        })
      } else {
        if (this.pageConfig.currPage === 1) {
          this.paginationBtns.forEach(item => {
            if (item.title === 'first' || item.title === 'prev') {
              item.disabled = true
            } else {
              item.disabled = false
            }
          })
        } else if (this.pageConfig.currPage === this.maxPages) {
          this.paginationBtns.forEach(item => {
            if (item.title === 'last' || item.title === 'next') {
              item.disabled = true
            } else {
              item.disabled = false
            }
          })
        } else {
          this.paginationBtns.forEach(item => {
            item.disabled = false
          })
        }
      }
    },
    // 跳转页
    handleChange (val) {
      let newVal = 1
      if (this.maxPages > 0) {
        if (val > this.maxPages) {
          newVal = this.maxPages
        } else if (val < 1) {
          newVal = 1
        } else {
          newVal = val
        }
      }
      this.$nextTick(_ => {
        this.pageConfig.currPage = newVal
        this.$emit('current-change', newVal)
      })
    },
    // 按钮点击
    handleClick (btn) {
      let newVal = 1
      switch (btn) {
        case 'first': newVal = 1
          break
        case 'prev': newVal = this.pageConfig.currPage - 1
          break
        case 'next': newVal = this.pageConfig.currPage + 1
          break
        case 'last': newVal = this.maxPages
          break
      }
      this.$nextTick(_ => {
        this.pageConfig.currPage = newVal
        this.$emit('current-change', newVal)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.c-pagination {
  padding: 5px 10px;
  font-size: 12px;
  ::v-deep .el-input {
    .el-input__inner {
      padding: 0;
      height: 24px;
      line-height: 24px;
      text-align: center;
      border: 1px solid #DCDFE6 !important;
      border-radius: 4px !important;
    }
  }
  .c-pagination__total-pages {
  }
  .c-pagination__jump {
    margin-left: 15px;
    .el-input-number {
      margin: 0 3px;
      width: 30px;
    }
  }
  .c-pagination__sizes {
    ::v-deep .el-select {
      width: 80px;
      .el-input__inner {
        padding-right: 20px;
      }
      .el-input__icon {
        height: auto;
      }
    }
  }
  .el-button {
    margin: 0;
    padding: 0 6px;
    width: 30px;
    height: 20px;
    // 普通状态图标
    &.c-pagination__ {
      &first {
        background: url(https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/icons/asideIcons/first.png)
          no-repeat center;
        background-size: 16px;
      }
      &prev {
        background: url(https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/icons/asideIcons/prev.png)
          no-repeat center;
        background-size: 16px;
      }
      &next {
        background: url(https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/icons/asideIcons/next.png)
          no-repeat center;
        background-size: 16px;
      }
      &last {
        background: url(https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/icons/asideIcons/last.png)
          no-repeat center;
        background-size: 16px;
      }
    }
    // 鼠标经过状态图标
    &:hover.c-pagination__ {
      &first {
        background: url(https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/icons/asideIcons/firstHover.png)
          no-repeat center;
        background-size: 16px;
      }
      &prev {
        background: url(https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/icons/asideIcons/prevHover.png)
          no-repeat center;
        background-size: 16px;
      }
      &next {
        background: url(https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/icons/asideIcons/nextHover.png)
          no-repeat center;
        background-size: 16px;
      }
      &last {
        background: url(https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/icons/asideIcons/lastHover.png)
          no-repeat center;
        background-size: 16px;
      }
    }
    // 禁用状态图标
    &:disabled.c-pagination__ {
      &first {
        background: url(https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/icons/asideIcons/firstBan.png)
          no-repeat center;
        background-size: 16px;
      }
      &prev {
        background: url(https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/icons/asideIcons/prevBan.png)
          no-repeat center;
        background-size: 16px;
      }
      &next {
        background: url(https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/icons/asideIcons/nextBan.png)
          no-repeat center;
        background-size: 16px;
      }
      &last {
        background: url(https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/icons/asideIcons/lastBan.png)
          no-repeat center;
        background-size: 16px;
      }
    }
  }
}
</style>
