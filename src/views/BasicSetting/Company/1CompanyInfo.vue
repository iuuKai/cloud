<template>
  <el-row class="enterprise-info__wrap">
    <el-row class="title">{{ data.companyName }}</el-row>
    <el-row
      class="enterprise-info__box"
      :gutter="10"
      type="flex"
      justify="space-between"
    >
      <!-- 1 -->
      <el-col :span="10">
        <el-row type="flex" class="box-item">
          <el-image style="width: 100px; height: 100px">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture"></i>
            </div>
          </el-image>
          <el-row>
            <el-row class="box-title">高睿云企业账号信息</el-row>
            <el-row v-for="(item, i) in box1" :key="item.model + i">
              <span class="box-label">{{ item.label }}</span>
              <span>{{ data[item.model] }}</span>
            </el-row>
          </el-row>
        </el-row>
      </el-col>
      <!-- 2 -->
      <el-col :span="7">
        <el-row class="box-item">
          <el-row class="box-title">企业号主页</el-row>
          <el-row><el-link type="primary" href="">{{}}</el-link></el-row>
        </el-row>
      </el-col>
      <!-- 3 -->
      <el-col :span="7">
        <el-row class="box-item">
          <el-row class="box-title">服务产品</el-row>
          <el-row
            ><span class="box-label">平台应用</span><span>付费版</span></el-row
          >
          <el-row
            ><span class="box-label">签章认证</span><span>{{}}</span></el-row
          >
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-radio-group v-model="radio">
        <el-radio-button v-for="item in radioList" :key="item" :label="item">
        </el-radio-button>
      </el-radio-group>
    </el-row>
    <el-row type="flex" class="foot-info">
      <el-col :span="8">
        <el-row v-for="(item, i) in footLabel" :key="item.model + i">
          <span class="box-label">{{ item.label }}</span>
          <span>{{ data[item.model] }}</span>
        </el-row>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
export default {
  created () {
    this.getComponentInfo()
  },
  data () {
    return {
      data: {
        id: '',
        // 企业平台号
        companyNo: '',
        // 企业名称
        companyName: '',
        // 社会信用号
        creditCode: '',
        // 是否关联公司
        isRelCom: '',
        // 公司类型
        companyType: '',
        // 公司地址
        companyAdd: '',
        // 负责人编号
        wheelNo: '',
        // 负责人名称
        wheelName: '',
        // 座机号码
        phoneNo: '',
        // 手机号码
        cellPhoneNo: '',
        // 是否有效
        isValid: ''
      },
      box1: [
        { model: 'companyName', label: '企业名称' },
        { model: 'companyName', label: '企业名称' },
        { model: 'companyName', label: '企业名称（打印用）' },
        { model: 'companyNo', label: '企业号' }
      ],
      radio: '企业信息',
      radioList: ['企业信息', '开票资料', '企业微信'],
      footLabel: [
        { model: 'creditCode', label: '统一社会信用代码' },
        { model: '?', label: '行业' },
        { model: '??', label: '企业规模' },
        { model: 'wheelName', label: '法人' },
        { model: '???', label: '开户银行' },
        { model: '????', label: '银行账户' },
        { model: 'wheelName', label: '联系人' },
        { model: 'phoneNo', label: '联系电话' },
        { model: 'cellPhoneNo', label: '手机号码' },
        { model: 'companyAdd', label: '企业地址' }
      ]
    }
  },
  methods: {
    // 企业详情
    getComponentInfo () {
      const params = {
        id: this.$route.query.id
      }
      this.$api.company.componentInfo(params).then(res => {
        console.log('%c [ 企业详情 ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
        this.data = res
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.enterprise-info__wrap {
  .title {
    font-weight: 700;
  }
  .box-label {
    margin-right: 6px;
    &::after {
      content: ':';
    }
  }
  .enterprise-info__box {
    margin: 15px 0 65px;
    .box-title {
      font-size: 14px;
      font-weight: 700;
    }
    .box-item {
      padding: 25px;
      height: 100%;
      border: 1px solid #bbb;
      .el-row {
        margin-bottom: 15px;
      }
      ::v-deep .el-image {
        .image-slot {
          font-size: 24px;
          color: #6f7e1d;
        }
      }
    }
  }
  ::v-deep .el-radio-group {
    margin-bottom: 36px;
    .el-radio-button__inner {
      width: 170px;
    }
  }
  .foot-info {
    .el-row {
      height: 22px;
      line-height: 22px;
      font-size: 14px;
      transition: 0.2s;
      &:nth-child(even) {
        background-color: #f7f7f7;
        border: 1px solid #bbb;
      }
      &:hover {
        background-color: #cedbde;
      }
    }
  }
}
</style>
