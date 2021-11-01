<template>
  <div>
    <div class="personnelList_screening">
      <div class="personnelList_title">采购订单列表</div>
      <div class="personnelList_filter">筛选条件</div>
      <div class="personnelList_input">
        <div class="personnelList_inputIcon">
          <img
            src="https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/index/top_search.svg"
          />
        </div>
        <input
          placeholder="请输入内容"
          style="border: 0; width: 150px; margin-bottom: 10px"
        />
      </div>
      <div class="personnelList_close">
        <div class="personnelList_closeText">展开过滤</div>
        <div class="personnelList_closeIcon">
          <img
            src="https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/index/logo_bottom.svg"
          />
        </div>
      </div>
    </div>
    <div class="personnelList_conditions">
      <div class="personnelList_condPub">
        <div class="personnelList_listTitle addOther">常用条件</div>
        <div class="personnelList_listText">自定义查询</div>
      </div>
      <div class="personnelList_condPub">
        <div class="personnelList_listTitle">日期：</div>
        <div class="personnelList_listText">
          <div></div>
        </div>
      </div>
      <div class="personnelList_condPub">
        <div class="personnelList_listTitle">未交货数：</div>
      </div>
    </div>
    <div class="personnelList_button">
      <el-button class="btnPb" type="primary">生成送货单</el-button>
      <el-button class="btnPb" type="primary">下载</el-button>
      <el-button class="btnPb" type="primary">打印</el-button>
      <el-button class="btnPb" type="primary">刷新</el-button>
      <el-button class="btnPb" type="primary">退出</el-button>
    </div>
    <div class="purchaseTable">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
      >
      </el-pagination>
    </div>
    <div class="purchaseTable">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="date" label="日期" width="180">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="address" label="地址"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentPage4: 4,
      tableData: []
    }
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style scoped>
.personnelList {
  width : 100%;
  margin-top : 65px;
}
.personnelList_screening {
  width : 90%;
  margin : auto;
  display : flex;
  margin-top : 30px;
  justify-content : space-between;
}
.personnelList_title {
  font-weight : bold;
}
.personnelList_filter {
  color : #999999;
}
.personnelList_input {
  color : #999999;
  width : 200px;
  border-bottom : 1px solid #EEEEEE;
  display : flex;
  justify-content : flex-start;
}
.personnelList_close {
  color : #1E73BA;
  display : flex;
  justify-content : flex-end;
}
.personnelList_closeIcon {
  width : 18px;
  height : 18px;
  margin : 3px 0 0 3px;
}
.personnelList_inputIcon {
  width : 24px;
  height : 24px;
  margin-bottom : 10px;
}
.personnelList_conditions {
  width : 95%;
  margin : auto;
  height : 137px;
  border : 1px solid #E1E1E1;
  background-color : #EEEEEE;
  margin-top : 10px;
}
.personnelList_condPub {
  width : 100%;
  height : 45px;
  border-bottom : 1px solid #E1E1E1;
  display : flex;
  justify-content : flex-start;
}
.personnelList_listTitle {
  padding : 0 10px 0 10px;
  height : 30px;
  text-align : center;
  line-height : 30px;
  margin : 7.5px;
  color : #999999;
}
.addOther {
  border-right : 1px solid #E1E1E1;
  color : #1E73BA;
}
.personnelList_listText {
  color : #333333;
  line-height : 45px;
}
.personnelList_button {
  width : 95%;
  margin : auto;
  display : flex;
  flex-wrap : wrap;
  margin-top : 10px;
  padding-bottom : 20px;
}
.btnPb {
  background-color : #1E73BA;
  border : 0;
  margin-left : 20px;
}
.purchaseTable {
  width : 100%;
  margin : auto;
  display : flex;
  justify-content : flex-end;
  border : 0;
  border-bottom : 1px solid #E1E1E1;
  border-top : 1px solid #E1E1E1;
}

</style>
