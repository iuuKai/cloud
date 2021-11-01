<template>
  <el-row type="flex" :gutter="20">
    <el-col :span="8" class="left-tree">
      <el-input
        v-model="filterTextLeft"
        placeholder="请搜索业务对象"
        prefix-icon="el-icon-search"
      >
      </el-input>
      <el-tree
        class="filter-tree"
        :data="roleListLeft"
        :props="defaultPropsLeft"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="checkedKeysLeft"
        :filter-node-method="filterNodeLeft"
        ref="treeLeft"
      >
      </el-tree>
    </el-col>
    <el-col :span="16" class="right-tree">
      <el-input
        v-model="filterTextRight"
        placeholder="请搜索业务对象"
        prefix-icon="el-icon-search"
      >
      </el-input>
      <el-tree
        class="filter-tree"
        :data="roleListRight"
        :props="defaultPropsRight"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="checkedKeysRight"
        :filter-node-method="filterNodeRight"
        ref="treeRight"
      >
      </el-tree>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      // 左树
      roleListLeft: [],
      filterTextLeft: '',
      checkedKeysLeft: [],
      defaultPropsLeft: {
        children: 'children',
        label: 'menuName'
      },
      // 右树
      roleListRight: [],
      filterTextRight: '',
      checkedKeysRight: [],
      defaultPropsRight: {
        children: 'children',
        label: 'menuName'
      }
    }
  },
  watch: {
    filterTextLeft (newValue, oldValue) {
      this.$refs.treeLeft.filter(newValue)
    },
    filterTextRight (newValue, oldValue) {
      this.$refs.treeRight.filter(newValue)
    }
  },
  methods: {
    // 过滤树节点
    filterNodeLeft (value, data) {
      if (!value) return true
      return data[this.defaultPropsLeft.label].indexOf(value) !== -1
    },
    // 过滤树节点
    filterNodeRight (value, data) {
      if (!value) return true
      return data[this.defaultPropsRight.label].indexOf(value) !== -1
    }
  }
}
</script>

<style lang="scss" scoped>
.left-tree,
.right-tree {
  ::v-deep .el-input {
    margin-bottom: 10px;
    .el-input__inner {
      border: 0 none;
      border-bottom: 1px solid #bbbbbb;
      border-radius: 0;
    }
  }
  ::v-deep .el-tree {
    .el-tree-node__expand-icon:not(.is-leaf) {
      font-size: 24px;
      color: #1e73ba;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      background-color: #1e73ba;
      border-color: #1e73ba;
    }
  }
}
</style>
