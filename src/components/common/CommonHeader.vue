<template>
  <!-- 公共头 -->
  <el-row class="cloud-header__wrap" type="flex">
    <!-- 左侧 -->
    <el-col class="header-left">
      <HeaderLogo></HeaderLogo>
    </el-col>
    <!-- 中间 -->
    <el-col class="header-center">
      <el-row>
        <HeaderTabNav
          v-model="currTab"
          :fixedTabs="fixedTabs"
          :floatTabs="floatTabs"
          @tab-click="$emit('tab-click', $event)"
          @tab-remove="$emit('tab-remove', $event)"
        ></HeaderTabNav>
      </el-row>
    </el-col>
    <!-- 右侧 -->
    <el-col class="header-right">
      <el-row
        class="header-right__box"
        type="flex"
        justify="end"
        align="middle"
      >
        <!-- 服务 -->
        <HeaderService></HeaderService>
        <!-- 头像 -->
        <HeaderAtatar @on-opend-dialog="openDialog"></HeaderAtatar>
      </el-row>
    </el-col>
    <UpdatePhone v-model="dialogPhone"></UpdatePhone>
    <UpdatePassword v-model="dialogPwd"></UpdatePassword>
  </el-row>
</template>

<script>
import HeaderLogo from './header/hLogo.vue'
import HeaderTabNav from './header/hTab'
import HeaderService from './header/hService'
import HeaderAtatar from './header/hAvatar'
import UpdatePhone from './header/updatePhone'
import UpdatePassword from './header/updatePassword'

import { mapState } from 'vuex'

export default {
  props: {
    value: String,
    fixedTabs: Array,
    floatTabs: Array
  },
  data () {
    return {
      dialogPhone: false,
      dialogPwd: false
    }
  },
  computed: {
    ...mapState({
      id: state => state.user.user.id,
      phone: state => state.user.user.phone
    }),
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
    openDialog (item) {
      const { model } = item
      switch (model) {
        case 'phone': this.dialogPhone = true
          break
        case 'pwd': this.dialogPwd = true
          break
        case 'user': this.$emit('on-to-user')
          break
      }
    }
  },
  components: {
    HeaderLogo,
    HeaderTabNav,
    HeaderService,
    HeaderAtatar,
    UpdatePhone,
    UpdatePassword
  }
}
</script>

<style lang="scss" scoped>
::v-deep.cloud-header__wrap {
  height : 100%;
  // 头部左侧
  .header-left {
    padding : 5px 20px;
    width : 200px;
    flex : none;
  }
  // 头部中间

  // 头部右侧
  .header-right {
    .header-right__box {
      padding : 0 20px;
      height : 100%;
    }
  }
}

</style>
