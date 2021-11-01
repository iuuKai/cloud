<template>
  <!--
    搞错了，刚开始封装分页器，没注意过
    后来发现，@current-change 和 table 的 @current-change 重名了
    只能修改 table 的了
  -->
  <el-row>
    <!-- 分页 -->
    <CommonPagination
      v-if="pageConfig"
      :showTotal="showTotal"
      :selected="selectedLen"
      :page-config="pageConfig"
      @size-change="$emit('size-change', $event)"
      @current-change="$emit('current-change', $event)"
    ></CommonPagination>
    <!-- 表格 -->
    <el-table
      ref="table"
      :class="{
        'table-edit': type === 'edit'
      }"
      tooltip-effect="dark"
      style="width: 100%"
      border
      :row-key="rowKey"
      v-loading="loading"
      size="mini"
      :data="tableData"
      :highlight-current-row="highlightCurrentRow"
      :header-cell-style="{ backgroundColor: '#FAFAFA' }"
      @sort-change="$emit('sort-change', $event)"
      @expand-change="$emit('expand-change', arguments[0], arguments[1])"
      @selection-change="selection"
      @row-click="$emit('row-click', arguments[0], arguments[1], arguments[2])"
      @current-change="$emit('current-row-change', arguments[0], arguments[1])"
    >
      <!-- 数据 -->
      <template v-for="item in tableLabel">
        <!-- 多选 -->
        <el-table-column
          v-if="item.type === 'selection'"
          :key="item.model"
          :type="item.type"
          header-align="center"
          align="center"
        ></el-table-column>
        <!-- 行数 -->
        <el-table-column
          v-else-if="item.type === 'index'"
          :key="item.model"
          :type="item.type"
          :align="item.align"
          :label="item.label"
          :index="indexMethod"
          fixed
        ></el-table-column>
        <!-- 数据 -->
        <el-table-column
          v-else
          :key="item.model"
          :type="item.type"
          :prop="item.model"
          :label="item.label"
          :sortable="item.sortable || false"
          :header-align="item.headerAlign"
          :align="item.align"
          :fixed="item.fixed || false"
          :width="item.width || 'auto'"
          :min-width="item.minWidth || 'auto'"
          show-overflow-tooltip
        >
          <template v-if="item.required" slot="header">
            {{ item.label }}<span class="is-required">*</span>
          </template>
          <template slot-scope="scope">
            <!-- 链接 -->
            <el-link
              v-if="item.slotType === 'link'"
              type="primary"
              :underline="false"
              @click="$emit('link-click', scope.row)"
            >
              {{ scope.row[item.model] }}
            </el-link>
            <!-- 头像 -->
            <el-avatar
              v-else-if="item.slotType === 'avatar'"
              icon="el-icon-user-solid"
              size="small"
              style="cursor: pointer"
              :src="scope.row[item.model]"
              @click.native="handlePictureCardPreview(scope.row[item.model])"
            ></el-avatar>
            <!-- 按钮 -->
            <el-button
              v-else-if="item.slotType === 'button'"
              type="text"
              @click="$emit('button-click', scope.row)"
              style="padding: 0"
            >
              {{ scope.row[item.model] }}
            </el-button>
            <!-- 开关 -->
            <el-switch
              v-else-if="item.slotType === 'switch'"
              v-model="scope.row[item.model]"
              @change="$emit('switch-change', scope.row)"
            >
            </el-switch>
            <!-- 标签 -->
            <!-- <el-tag
              v-else-if="item.slotType === 'tag'"
              :type="filterTagType(scope.row, item)"
            >
              {{ filterTag(scope.row, item) }}
            </el-tag> -->
            <!-- 下拉 -->
            <el-select v-else-if="item.slotType === 'select'">
              <el-option></el-option>
            </el-select>
            <!-- 默认 -->
            <template v-else>
              <template v-if="type === 'edit'">
                <el-input size="mini" v-if="item.allowEdit" :disabled="item.disabled" v-model="scope.row[item.model]"></el-input>
                <el-input
                  v-else
                  size="mini"
                  disabled
                  :value="filterColumn(scope.row[item.model], item.filter)"></el-input>
              </template>
              <template v-else>
                {{ filterColumn(scope.row[item.model], item.filter) }}
              </template>
            </template>
          </template>
        </el-table-column>
      </template>
      <!-- 尾列设置 -->
      <el-table-column width="35px" align="center" fixed="right">
        <el-link
          slot="header"
          :underline="false"
          icon="el-icon-setting"
        ></el-link>
      </el-table-column>
      <!-- 空状态 -->
      <el-empty slot="empty" :image-size="60">
        <p slot="description" class="empty-description">暂无数据</p>
      </el-empty>
    </el-table>
    <!-- 图片预览 -->
    <el-dialog :visible.sync="dialogVisible" @closed="dialogImageUrl = ''">
      <el-image :src="dialogImageUrl"></el-image>
    </el-dialog>
  </el-row>
</template>

<script>
import CommonPagination from './CommonPagination'

export default {
  props: {
    type: {
      type: String,
      default: 'view'
    },
    showTotal: {
      type: Boolean,
      default: true
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    highlightCurrentRow: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    tableData: Array,
    tableLabel: Array,
    pageConfig: Object
  },
  data () {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      selectedLen: 0
    }
  },
  methods: {
    indexMethod (index) {
      if (this.pageConfig) {
        const { startRow } = this.pageConfig
        return startRow + index
      } else {
        return index + 1
      }
    },
    toggleRowSelection (row) {
      this.$refs.table.toggleRowSelection(row)
    },
    handlePictureCardPreview (val) {
      this.dialogVisible = true
      this.dialogImageUrl = val
    },
    // 多选，还需要传参给分页器
    selection (val) {
      this.selectedLen = val.length
      if (val.length > 0) {
        this.$emit('selection-change', val)
      }
    },
    filterColumn (model, filter) {
      if (filter) {
        const isFind = filter.find(({ from }) => from === model)
        // 如果找得到就过滤替换，如果找不到就原始值
        return isFind ? isFind.to : model
      } else {
        return model
      }
      // const arr = item.filter
      // if (arr && arr.length > 0) {
      //   const curItem = arr && arr.find(({ value }) => value === row[item.model])
      //   return curItem ? curItem.label : row[item.model]
      // } else {
      //   if (row[item.model]) {
      //     return row[item.model]
      //   } else if (!item.notNull) {
      //     return row[item.model]
      //   } else {
      //     return '空'
      //   }
      // }
    }
    // filterTagType (row, item) {
    //   if (item.slotStyle) {
    //     return item.slotStyle.find(({ label }) => {
    //       let model = ''
    //       if (item.slotModel) {
    //         model = row[item.model][item.slotModel]
    //       } else {
    //         model = row[item.model]
    //       }
    //       return label === model
    //     })
    //   }
    // },
    // filterTag (row, item) {
    //   if (item.slotModel) {
    //     return row[item.model][item.slotModel]
    //   } else {
    //     return row[item.model]
    //   }
    // }
  },
  components: {
    CommonPagination
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-table {
  .is-required {
    margin-left: 4px;
    color: #F56C6C;
  }
  .el-table__cell {
    padding: 4px 0;
    font-weight: normal;
    color: #101010;
    .el-avatar {
      vertical-align: middle;
    }
    .el-input {
      .el-input__inner {
        padding: 0;
        border : 0 none !important;
        border-radius : 0;
        background-color: transparent;
      }
    }
  }
}
.el-dialog {
  .el-image {
    width: 100%;
  }
}
</style>
