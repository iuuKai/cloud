<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :width="width"
    :close-on-click-modal="false"
    :destroy-on-close="destroyOnClose"
  >
    <el-row slot="title" type="flex" justify="space-between" style="margin-right: 40px">
      <h1>{{ title }}</h1>
      <el-input
        v-model="searchVal"
        ref="searchInput"
        class="search-input"
        prefix-icon="el-icon-search"
        :placeholder="searchPlaceholder"
        size="mini"
        @focus="searchEvent"
        @blur="searchEvent"
      ></el-input>
    </el-row>
      <!-- @selection-change="$emit('selection-change', $event)" -->
    <CommonTable
      ref="table"
      :tableData="tableData"
      :tableLabel="tableLabel"
      :pageConfig="pageConfig"
      :defaultSelection="defaultSelection"
      @link-click="$emit('link-click', $event)"
      @size-change="$emit('size-change', $event)"
      @current-change="$emit('current-change', $event)"
      @selection-change="$emit('selection-change', $event)"
    ></CommonTable>
    <el-row slot="footer" type="flex" justify="center">
      <ItemButton type="primary" size="mini" @click="$emit('on-submit')">确定</ItemButton>
      <ItemButton size="mini" @click="dialogVisible = false">取消</ItemButton>
    </el-row>
  </el-dialog>
</template>

<script>
import CommonTable from '@/components/common/CommonTable'
import ItemButton from '@/components/form/button'

export default {
  props: {
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    title: String,
    search: String,
    searchPlaceholder: String,
    width: {
      type: String,
      default: '500px'
    },
    visible: {
      type: Boolean,
      default: false
    },
    highlight: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    defaultSelection: Array,
    selection: Array,
    tableData: Array,
    tableLabel: Array,
    pageConfig: Object
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    },
    searchVal: {
      get () {
        return this.search
      },
      set (val) {
        this.$emit('update:search', val)
      }
    }
  },
  watch: {
    dialogVisible (newValue, oldValue) {
      if (newValue) {
        // this.$nextTick(_ => {
        //   this.defaultSelection.forEach(row => {
        //     this.$refs.table.toggleRowSelection(row)
        //   })
        // })
      }
    }
  },
  methods: {
    // 搜索框聚焦、失焦改变宽度
    searchEvent (e) {
      this.$refs.searchInput.$el.classList.toggle('is-expand', e.type === 'focus')
    }
  },
  components: {
    CommonTable,
    ItemButton
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  .el-dialog__header {
    .el-dialog__headerbtn {
      font-size : 25px;
    }
    .search-input {
      width : 220px;
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
        border : 0 none;
        border-bottom : 1px solid #BBBBBB;
        border-radius : 0;
      }
    }
  }
  .el-dialog__body {
    padding: 0 20px;
  }
  .el-dialog__footer {
    .el-button {
      width : auto;
      & + & {
        margin-left : 45px;
      }
    }
  }
}

</style>
