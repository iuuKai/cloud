<template>
  <!-- 应用中心页面 -->
  <div class="cloud" v-loading="isLoading">
    <div class="cloud_center_pub" v-for="item in menuTree" :key="item.menuName">
      <div class="cloud_center_pub_left">
        <div class="menuTitle">{{ item.menuName }}</div>
      </div>
      <div class="cloud_center_pub_right">
        <div
          class="cloud_centet_right_pub"
          v-for="child in item.children"
          :key="child.menuName"
          @click="$emit('menu-click', child)"
        >
          <div class="cloud_pub_div">
            <div class="cloud_pub_div_icon">
              <img :src="child.imgUrl" />
            </div>
            <div class="cloud_pub_div_title">
              <div class="cloud_div_title_top">{{ child.menuName }}</div>
              <div class="cloud_div_title_bottom">{{ child.remark }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data () {
    return {
      menuTree: []
    }
  },
  created () {
    this.getMenuTree()
  },
  computed: {
    ...mapState({
      userId: state => state.user.user.id,
      isLoading: state => state.menu.isLoading
    })
  },
  methods: {
    ...mapMutations('menu', [
      'openLoading',
      'closeLoading'
    ]),
    getMenuTree () {
      this.openLoading()
      const params = {
        userId: this.userId
      }
      this.$api.menu.getMenuTree(params).then(res => {
        this.menuTree = res[0].children
        this.closeLoading()
      }).catch(_ => {
        this.$message.error('服务器开了个小差...')
        setTimeout(_ => {
          this.closeLoading()
        }, 500)
      })
    }
  }
}
</script>

<style scoped>
.cloud {
  padding: 12px;
  margin : auto;
  height: 100%;
  flex : 1;
}
.cloud_center_pub {
  width : 98%;
  /* margin : auto; */
  display : flex;
  flex-wrap : wrap;
}
.cloud_center_pub ~ .cloud_center_pub {
  margin-top : 12px;
}
.cloud_center_pub_left {
  position : relative;
  margin-right : 16px;
  margin-bottom : 4px;
  min-height : 100px;
  background-color : #1E73BA;
  color : #FFFFFF;
  line-height : 100%;
  flex : 0 0 108px;
}
.cloud_center_pub_right {
  flex : 1;
  display : flex;
  flex-wrap : wrap;
}
.menuTitle {
  width : 100%;
  font-size : 16px;
  position : absolute;
  top : 44%;
  color : #FFFFFF;
  text-align : center;
  user-select : none;
}
.cloud_centet_right_pub {
  width : 284px;
  height : 100px;
  border-radius : 4px;
  margin : 2px 8px 6px 0;
}
.cloud_pub_div {
  box-shadow : 0 2px 6px 0 rgb(0 0 0 / 40%);
  width : 284px;
  height : 100px;
  border-radius : 4px;
  background-color : #FFFFFF;
  display : flex;
  cursor : pointer;
  user-select : none;
}
.cloud_pub_div_icon {
  width : 48px;
  height : 48px;
  margin : 25px 10px 0 20px;
}
.cloud_pub_div_title {
  text-align : left;
  margin-top : 24px;
}
.cloud_div_title_top {
  color : #333333;
  font-size : 16px;
  margin-bottom : 2px;
  text-align : left;
  line-height : 30px;
}
.cloud_div_title_bottom {
  font-size : 12px;
  color : #999999;
  text-align : left;
}

</style>
