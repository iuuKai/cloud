<template>
  <!-- 公共筛选查询 -->
  <el-card :body-style="{ padding: '10px 45px' }">
    <el-row type="flex" align="middle" class="search__wrap">
      <el-col :span="2" style="white-space: nowrap">
        <span class="title">{{ title }}</span>
      </el-col>
      <el-col :span="14">
        <el-row
          v-if="tags.length > 0"
          type="flex"
          align="middle"
          style="flex: none"
        >
          <el-row class="filter">筛选条件</el-row>
          <el-row type="flex" style="flex-flow: row wrap">
            <el-tag
              v-for="tag in tags"
              :key="tag"
              closable
              effect="plain"
              size="mini"
              @close="handleClose(tag)"
            >
              {{ tag }}
            </el-tag>
          </el-row>
        </el-row>
      </el-col>
      <el-col :span="5">
        <el-row type="flex" justify="end">
          <el-input
            v-model="searchModel"
            ref="searchInput"
            class="search-input"
            prefix-icon="el-icon-search"
            :placeholder="searchPlaceholder"
            size="mini"
            @focus="searchEvent"
            @blur="searchEvent"
          ></el-input>
        </el-row>
      </el-col>
      <el-col :span="3" style="text-align: right">
        <el-link
          v-if="searchLabel"
          :class="[
            'collapse-btn',
            {
              'is-collapse': !activeName
            }
          ]"
          :underline="false"
          @click="changeCollapse"
        >
          <span v-if="activeName">收起过滤</span>
          <span v-else>展开过滤</span>
          <i class="el-icon-arrow-up"></i>
        </el-link>
      </el-col>
    </el-row>
    <!-- 折叠-过滤盒子 -->
    <template v-if="searchLabel">
      <el-collapse
        v-show="!isHide"
        ref="collapse"
        v-model="activeName"
        accordion
        class="filter-box"
      >
        <el-collapse-item name="1">
          <!-- 头部标签 -->
          <el-row type="flex" align="middle" class="filter-box__title">
            <el-link
              :underline="false"
              :class="{
                'is-active': currTab === '常用条件'
              }"
              @click="currTab = '常用条件'"
              >常用条件</el-link
            >
            <el-divider direction="vertical"></el-divider>
            <el-link
              disabled
              :underline="false"
              :class="{
                'is-active': currTab === '自定义查询'
              }"
              @click="currTab = '自定义查询'"
              >自定义查询</el-link
            >
          </el-row>
          <!-- 行 -->
          <template v-for="item in searchLabel">
            <template v-if="item.tabName === currTab">
              <template v-for="row in item.rowList">
                <el-row
                  :key="row.label"
                  type="flex"
                  align="middle"
                  justify="space-between"
                  class="filter-box__row"
                >
                  <el-row class="filter-box__left" type="flex" align="middle">
                    <!-- 标题 -->
                    <el-row class="filter-box__label">
                      {{ row.label + ':' }}
                    </el-row>
                    <!-- 日期 -->
                    <el-row
                      v-if="row.type === 'date'"
                      class="filter-box__date"
                      type="flex"
                      align="middle"
                    >
                      <el-row class="date-left">
                        <el-checkbox-group
                          v-model="dateChecked"
                          size="mini"
                          @change="handleDateCheckedChange"
                        >
                          <el-checkbox-button
                            v-for="opt in dateOptions"
                            :label="opt"
                            :key="opt"
                          >
                            {{ opt }}
                          </el-checkbox-button>
                        </el-checkbox-group>
                      </el-row>
                      <el-row class="date-right" style="margin-left: 20px">
                        <el-date-picker
                          v-model="dateStart"
                          type="date"
                          placeholder="开始日期"
                          size="mini"
                          class="start"
                          @change="handleDateChange('start', $event)"
                        >
                        </el-date-picker>
                        <span style="margin: 0 10px">至</span>
                        <el-date-picker
                          v-model="dateEnd"
                          type="date"
                          placeholder="结束日期"
                          size="mini"
                          class="end"
                          @change="handleDateChange('end', $event)"
                        >
                        </el-date-picker>
                      </el-row>
                    </el-row>
                    <!-- 普通文本框 -->
                    <el-row v-else-if="row.type === 'text'">
                      <el-input class="filter-box__search" size="mini" v-model="searchData[row.model]"></el-input>
                    </el-row>
                    <!-- 选项 -->
                    <el-row v-else class="filter-box__item">
                      <!-- <el-checkbox-group
                        v-model="searchData[row.model]"
                        size="mini"
                        @change="handleCheckedChange(row.model, $event)"
                      >
                        <el-checkbox-button
                          v-for="opt in row.options"
                          :label="opt.label ? opt.label : opt"
                          :key="opt.value ? opt.value : opt"
                          :disabled="row.multiple && multipleRow.indexOf(row.model) > -1 && opt.label === row.noLimit"
                        >
                          {{ opt.label ? opt.label : opt }}
                        </el-checkbox-button>
                      </el-checkbox-group> -->
                      <template v-for="(opt, i) in row.options">
                        <el-button
                          v-if="row.more ? row.more && i < row.max : true"
                          size="mini"
                          :class="{
                            'is-active': searchData[row.model].findIndex(({ label }) => label === opt.label) > -1
                          }"
                          :key="opt.value"
                          @click="handleClick(row.model, opt, row.noLimit)"
                        >
                          {{ opt.label }}
                        </el-button>
                      </template>
                    </el-row>
                  </el-row>
                  <!-- 开启多选 -->
                  <el-row
                    class="filter-box__right"
                    type="flex"
                    justify="space-between"
                  >
                    <el-button
                      v-if="row.multiple"
                      size="mini"
                      :class="[
                        'is-multiple',
                        {
                          'is-active': multipleRow.indexOf(row.model) > -1
                        }
                      ]"
                      @click="handleChange(row.model, row.noLimit)"
                    >
                      多选
                    </el-button>
                    <el-link v-if="row.more" type="primary" :underline="false" @click="$emit('on-open-more')">
                      更多 <i class="el-icon-arrow-down"></i>
                    </el-link>
                  </el-row>
                </el-row>
              </template>
            </template>
          </template>
        </el-collapse-item>
      </el-collapse>
    </template>
    <el-row class="btn-group" type="flex">
      <ItemButton
        type="primary"
        size="mini"
        v-for="item in buttonGroup"
        :key="item"
        @click="$emit('on-button-click', item)"
      >
        {{ item }}
      </ItemButton>
    </el-row>
  </el-card>
</template>

<script>
import ItemButton from '@/components/form/button'

export default {
  props: {
    title: String,
    search: String,
    searchPlaceholder: String,
    searchData: Object,
    searchLabel: Array,
    buttonGroup: Array
  },
  created () {
    this.initData()
  },
  mounted () {
    // window.a = this.$refs.a
    // console.log(this.$refs)
  },
  data () {
    return {
      isHide: false,
      // 控制折叠
      activeName: '1',
      currTab: '常用条件',
      // 开启多选的行
      multipleRow: [],
      // 按角色搜索
      filterItem: '',
      // 筛选条件
      tags: [],
      dateOptions: ['今天', '本周', '本月', '过去三个月'],
      // 这是选择 今天、本周 ...
      dateChecked: [],
      // 这个则是 start - end
      // dateRange: [],
      dateStart: '',
      dateEnd: '',
      // 日期快捷选择
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick (picker) {
              // const end = new Date()
              // const start = new Date()
              // start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              // picker.$emit('pick', [start, end])
            }
          },
          {
            text: '本周',
            onClick (picker) {
              // const end = new Date()
              // const start = new Date()
              // start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              // picker.$emit('pick', [start, end])
            }
          },
          {
            text: '本月',
            onClick (picker) {
              // const end = new Date()
              // const start = new Date()
              // start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              // picker.$emit('pick', [start, end])
            }
          },
          {
            text: '过去三个月',
            onClick (picker) {
              // const end = new Date()
              // const start = new Date()
              // start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              // picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  computed: {
    searchModel: {
      get () {
        return this.search
      },
      set (val) {
        this.$emit('update:search', val)
      }
    }
    // dateStart: {
    //   get () {
    //     return this.dateRange[0]
    //   },
    //   set (val) {
    //     // const now = new Date()
    //     // if (val > now) {
    //     this.dateRange[0] = val
    //     // }
    //     console.log('start', val)
    //   }
    // },
    // dateEnd: {
    //   get () {
    //     return this.dateRange[1]
    //   },
    //   set (val) {
    //     const now = new Date()
    //     if (val > now) {
    //       this.dateRange[1] = now
    //     }
    //     console.log('end', val)
    //   }
    // }
  },
  watch: {
    activeName (newValue, oldValue) {
      if (!newValue) {
        setTimeout(_ => {
          this.isHide = true
        }, 250)
      } else {
        this.isHide = false
      }
    },
    // dateRange (newValue, oldValue) {
    // const start = newValue[0]
    // const end = newValue[1]
    // const now = new Date()
    // // 超过当前时间则重置为当前日期
    // if (start > now) {
    //   this.dateRange[0] = now
    // } else if (end > now) {
    //   this.dateRange[1] = now
    // }
    // }
    tags (newValue, oldValue) {
      // console.log(newValue.forEach(item => {
      //   console.log(/^[^]*:\s([^]*)$/.exec(item)[1])
      // }))
    },
    searchData: {
      handler (newValue, oldValue) {
        let newArr = []
        for (const k in newValue) {
          // 如果是数组
          if (this.typeOf(newValue[k]) === 'array') {
            const row = this.searchLabel[0].rowList.find(({ model }) => model === k)
            // console.log(row.noLimit, newValue[k])
            const filterNoLimit = newValue[k]
              .filter(({ label }) => label !== row.noLimit)
              .map(({ label }) => `${row.label}: ${label}`)
            // console.log(filterNoLimit)
            newArr = newArr.concat(filterNoLimit)
          } else if (this.typeOf(newValue[k]) === 'string') {}
        }
        this.tags = newArr
        // 每一行
        // for (const k in newValue) {
        //   // 如果是多选
        //   // const isMultip = this.multipleRow.indexOf(k)
        //   // console.log(k, ...newValue[k])
        //   // this.tags.push(k, ...newValue[k])

        //   // 如果是数组
        //   if (this.typeOf(newValue[k]) === 'array') {
        //     console.log(newValue[k], newValue[k])
        //     // 如果数组长度等于 0
        //     if (newValue[k].length === 0) {
        //       // 自动设为不限
        //       this.searchData[k] = ['不限']
        //     }
        //     const label = this.searchLabel[0].rowList.find(({ model }) => model === k).label
        //     const newArr = newValue[k].map(item => `${label}: ${item}`).filter(item => item.indexOf('不限') === -1)
        //     // console.log('||||', newArr)
        //     this.tags = Array.from(new Set(this.tags.concat(newArr)))
        //     // // const isFind = this.tags.find(item => /^[^]*\s?\:([^]*)$/.exec(item)[1] === )
        //     // newArr.forEach(item => {
        //     //   console.log(this.tags.find(tag => tag === item))
        //     //   if (!this.tags.find(tag => tag === item) && !/不限/.test(item)) {
        //     //     this.tags.push(item)
        //     //   }
        //     // })
        //   }
        //   // console.log('tags', this.tags)
        // }
      },
      deep: true
    },
    dateStart (newValue, oldValue) {
      if (newValue) {
        const now = new Date()
        if (newValue > now) {
          this.dateStart = now
        }
        if (this.dateEnd && newValue > this.dateEnd) {
          this.dateStart = this.dateEnd
        }
      }
    },
    dateEnd (newValue, oldValue) {
      if (newValue) {
        const now = new Date()
        if (newValue > now) {
          this.dateEnd = now
        }
        if (this.dateStart && newValue < this.dateStart) {
          this.dateEnd = this.dateStart
        }
      }
    }
  },
  methods: {
    // 如果有 noLimit 的，就往数组首项填充
    initData () {
      this.searchLabel.forEach(f => {
        if (f.rowList) {
          f.rowList.forEach(item => {
            if (item.noLimit) {
              this.searchData[item.model] = [{ value: item.noLimit, label: item.noLimit }]
            }
          })
        }
      })
    },
    // 检测数据类型
    typeOf (val) {
      return /\[object ([^]*)\]/.exec(({}).toString.call(val))[1].toLocaleLowerCase()
    },
    // 搜索框聚焦、失焦改变宽度
    searchEvent (e) {
      this.$refs.searchInput.$el.classList.toggle('is-expand', e.type === 'focus')
    },
    // 折叠
    changeCollapse () {
      if (this.activeName) {
        this.$refs.collapse.handleItemClick('1')
      } else {
        this.$refs.collapse.setActiveNames('1')
      }
    },
    // 选项
    handleCheckedChange (row, value) {
      // // 如果是多选
      // const isFind = this.multipleRow.indexOf(row)
      // if (isFind > -1) {
      //   this.searchData[row] = value
      // } else {
      //   const d = value.pop()
      //   this.searchData[row] = d ? [d] : []
      // }
      // console.log('%c [ 过滤条件 ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.searchData)
      // this.tags = this.searchData.row1.concat(this.searchData.row2).map(item => {
      //   if (item !== '不限') {
      //     return item
      //   }
      // }).filter(Boolean)
    },
    // 多选开关
    handleChange (row, noLimit) {
      const isMultiple = this.multipleRow.indexOf(row)
      // 如果是多选
      if (isMultiple > -1) {
        // 那就关闭多选
        this.multipleRow.splice(isMultiple, 1)
        // 并且重置只选 noLimit
        this.searchData[row] = [{ value: noLimit, label: noLimit }]
      } else {
        // 如果不是就开启
        this.multipleRow.push(row)
        const isNoLimit = this.searchData[row].findIndex(({ label }) => label === noLimit)
        // 如果能找到 noLimit 就移除
        if (isNoLimit > -1) this.searchData[row].splice(isNoLimit, 1)
      }
    },
    // 每个选项触发
    handleClick (row, item, noLimit) {
      const isMultiple = this.multipleRow.indexOf(row)
      // 如果当前选项与 noLimit 不一致
      if (item.label !== noLimit) {
        // 当前行开启了多选
        if (isMultiple > -1) {
          const isFind = this.searchData[row].findIndex(o => item === o)
          if (isFind > -1) {
            this.searchData[row].splice(isFind, 1)
            // 如果空了
            if (this.searchData[row].length === 0) {
              this.searchData[row] = [{ value: noLimit, label: noLimit }]
            }
          } else {
            this.searchData[row].push(item)
          }
        } else {
          // 单选的情况直接就是那当前就好了
          this.searchData[row] = [item]
        }
      } else {
        // 如果是 noLimit，则重置为 noLimit
        this.searchData[row] = [{ value: noLimit, label: noLimit }]
        // 并且同时移除多选
        this.multipleRow.splice(isMultiple, 1)
      }
    },
    // 关闭筛选标签
    handleClose (tag) {
      // 移除过滤的数据
      for (const k in this.searchData) {
        const isFind = this.searchData[k].findIndex(({ label }) => /^[^]*:\s([^]*)$/.exec(tag)[1] === label)
        if (isFind > -1) {
          this.searchData[k].splice(isFind, 1)
          // 如果空了
          if (this.searchData[k].length === 0) {
            const row = this.searchLabel[0].rowList.find(({ model }) => model === k)
            this.searchData[k] = [{ value: row.noLimit, label: row.noLimit }]
          }
        }
      }
      // 移除筛选标签
      this.tags.splice(tag, 1)
    },
    // 今日、本周、本月、过去三月
    handleDateCheckedChange (value) {
      const d = value.pop()
      // 回显，不用管
      this.dateChecked = d ? [d] : []
      // 这里才是处理
      console.log(d)
      let start = ''
      switch (d) {
        case '今天': start = new Date()
          break
        case '本周': start = this.$dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DDTHH:mm:ssZ[Z]')
          break
        case '本月':
          break
        case '过去三个月':
          break
      }
      this.dateStart = Date.parse(start)
      console.log(this.dateStart)
    },
    // 时间选择变化
    handleDateChange (t, value) {
      // const start = this.dateRange[0]
      // const end = this.dateRange[1]
      // console.log(t, value)
      // if (t === 'start') {
      //   // start 不能大于 end
      //   if (value > end) {
      //     this.dateRange[0] = end
      //   }
      // } else {
      //   // end 不能小于 start
      //   if (value < start) {
      //     this.dateRange[1] = start
      //   }
      // }
    }
  },
  components: {
    ItemButton
  }
}
</script>

<style lang="scss" scoped>
// .date-right {
//   flex : none;
//   border : 1px solid #DCDFE6;
//   .el-date-editor.el-input, .el-date-editor.el-input__inner {
//     width : 130px;
//   }
//   ::v-deep .el-date-editor {
//     &.end {
//       .el-input__prefix {
//         display : none;
//       }
//       .el-input__inner {
//         padding-left : 0;
//       }
//     }
//     .el-input__inner {
//       text-align : center;
//       border : 0 none;
//     }
//   }
// }

.el-card__body {
  padding : 10px;
  .search__wrap {
    .title {
      font-weight : 700;
      color : #101010;
    }
    .filter {
      font-size : 14px;
      color : #999999;
      flex : none;
    }
    .el-tag {
      margin: 2px 0 2px 10px;
      border-radius : 2px;
      &--plain {
        color : #999999;
        border-color : #999999;
        background-color : #FFFFFF;
        transition : .2s;
        &:hover {
          color : #1E73BA;
          border-color : #1E73BA;
        }
        ::v-deep .el-tag__close {
          color : #1E73BA;
          background-color : transparent;
        }
      }
    }
    ::v-deep .search-input {
      width : 180px;
      transition : .2s;
      &.is-expand {
        width : 300px;
      }
      .el-input__prefix {
        left : -5px;
      }
      .el-input__inner {
        padding-left : 20px;
        padding-right : 0;
      }
    }
    // 展开、收缩
    .collapse-btn {
      color : #1E73BA;
      font-size : 14px;
      i {
        margin-left : 6px;
        transition : .2s;
      }
      &.is-collapse {
        i {
          transform : rotate(-180deg);
        }
      }
    }
  }
}
::v-deep .el-collapse {
  padding : 0 15px;
  margin : 10px 0;
  border : 1px solid #BBBBBB;
  background-color : #FAFAFA;
  .el-collapse-item__wrap, .el-radio-button__inner, .el-checkbox-button__inner, .el-input__inner {
    background-color : inherit;
  }
  .el-collapse-item__header {
    display : none;
    border-bottom : 0 none;
  }
  .el-collapse-item__wrap {
    border-bottom : 0 none;
    .el-collapse-item__content {
      padding-bottom : 0;
      .filter-box__title, .filter-box__row {
        min-height : 40px;
      }
      .filter-box__title {
        user-select : none;
        .el-link {
          font-size : 14px;
          color : #101010;
          flex : none;
          &.is-active {
            color : #1E73BA;
          }
        }
      }
      .filter-box__row {
        font-size : 12px;
        color : #999999;
        border-top : 1px solid #BBBBBB;
        .filter-box__left {
          .filter-box__label {
            min-width : 70px;
            flex : none;
          }
          .filter-box__item {
            flex : none;
          }
          .filter-box__search {
            margin-left: 20px;
            .el-input__inner {
              padding: 0;
            }
          }
        }
        .filter-box__right {
          width : 250px;
          .el-link {
            // margin-left : 150px;
          }
        }
        .el-checkbox-group {
          .el-checkbox-button {
            margin-left : 16px;
            &:first-child {
              margin-left : 0;
            }
            &__original {
              & + .el-checkbox-button__inner {
                padding-left : 10px;
                padding-right : 10px;
                width : 100%;
                color : #999999;
                border-radius : 2px;
                border-color : transparent;
              }
              &:checked + .el-checkbox-button__inner {
                color : #1E73BA;
                background-color : #FFFFFF;
                border-color : #1E73BA;
              }
            }
          }
        }
      }
    }
    // 多选按钮
    .el-button {
      color : #999999;
      border-radius : 2px;
      background-color : transparent;
      border-color: transparent;
      transition: .2s;
      &:not(.is-multiple) {
        padding-left : 10px;
        padding-right : 10px;
      }
      &.is-multiple {
        border-color : #999999;
      }
      &.is-active {
        color : #1E73BA;
        background-color : #FFFFFF;
        border-color : #1E73BA;
      }
    }
    // 链接
    .el-link {
      color : #1E73BA;
    }
  }
}
</style>
