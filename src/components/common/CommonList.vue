<template>
  <!-- 公用的，每个列表信息组件 -->
  <el-row>
    <CommonSearch
      :title="searchTitle"
      :search.sync="searchInput"
      :search-placeholder="searchPlaceholder"
      :search-data="searchData"
      :search-label="searchLabel"
      :button-group="searchButtonGroup"
      @on-button-click="$emit('on-button-click', $event)"
      @on-open-more="$emit('on-open-more')"
    ></CommonSearch>
    <el-card style="margin: 10px; height: 100%" :body-style="{ padding: '0' }">
      <CommonTable
        :row-key="tableRowKey"
        :table-data="tableData"
        :table-label="tableLabel"
        :page-config="tablePageConfig"
        @link-click="$emit('link-click', $event)"
        @size-change="$emit('size-change', $event)"
        @current-change="$emit('current-change', $event)"
        @selection-change="$emit('selection-change', $event)"
      ></CommonTable>
    </el-card>
    <CommonMore
      :visible.sync="visible"
      :title="moreTitle"
      :width="moreWidth"
      :search.sync="moreSearchInput"
      :search-placeholder="moreSearchPlaceholder"
      :selection.sync="moreSelection"
      :default-selection="moreDefaultSelection"
      :page-config="morePageConfig"
      :tableData="moreTableData"
      :tableLabel="moreTableLabel"
      @size-change="$emit('more-size-change', $event)"
      @current-change="$emit('more-current-change', $event)"
      @selection-change="$emit('more-selection-change', $event)"
      @on-submit="$emit('more-submit')"
    ></CommonMore>
  </el-row>
</template>

<script>
import CommonSearch from '@/components/common/CommonSearch'
import CommonTable from '@/components/common/CommonTable'
import CommonMore from '@/components/common/CommonMore'

export default {
  props: {
    // 筛选盒子
    menuItem: Object,
    searchTitle: String,
    search: String,
    searchPlaceholder: String,
    searchData: Object,
    searchLabel: Array,
    searchButtonGroup: Array,
    // 表格
    tableRowKey: {
      type: String,
      default: 'id'
    },
    tablePageConfig: Object,
    tableData: Array,
    tableLabel: Array,
    // 更多弹窗
    moreVisible: {
      type: Boolean,
      default: false
    },
    moreTitle: String,
    moreWidth: String,
    moreSearch: String,
    moreSearchPlaceholder: String,
    moreSelection: Array,
    moreDefaultSelection: Array,
    morePageConfig: Object,
    moreTableData: Array,
    moreTableLabel: Array
  },
  computed: {
    searchInput: {
      get () {
        return this.search
      },
      set (val) {
        this.$emit('update:search', val)
      }
    },
    moreSearchInput: {
      get () {
        return this.moreSearch
      },
      set (val) {
        this.$emit('update:moreSearch', val)
      }
    },
    visible: {
      get () {
        return this.moreVisible
      },
      set (val) {
        this.$emit('update:moreVisible', val)
      }
    }
  },
  components: {
    CommonSearch,
    CommonTable,
    CommonMore
  }
}
</script>

<style lang="scss" scoped>
</style>
