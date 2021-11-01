<template>
  <!-- 用户使用协议 -->
  <el-row>
    <h1 class="title">高睿咨询用户使用协议</h1>
    <el-row class="info" type="flex" align="middle" justify="space-between">
      <span>最近更新日期:{{ updated }}</span>
      <span>生效日期:{{ effective }}</span>
      <el-link :underline="false">
        <i class="download-icon"></i>
        下载PDF文件
      </el-link>
    </el-row>
    <!-- 内容 -->
    <el-row class="content">
      <ul class="content-list">
        <li>
          <p class="list-title"></p>
          <p class="list-text fontBold">
            欢迎您（以下或称“用户”）使用高睿咨询及或其关联公司的产品及或服务！
          </p>
          <p class="list-text fontBold">
            您与高睿咨询及或其关联公司共同签署《高睿咨询用户使用协议》（以下简称“本协议”），并使用您已有的高睿咨询及或其关联公司账号
            或您即将注册激活的高睿咨询账号登录高睿平台后，您即可按照本协议约定使用高睿咨询及或其关联公司的产品及或服务。
          </p>
          <p class="list-text fontBold">
            【审慎阅读】您在签署本协议之前，请务必审慎阅读、充分理解本协议各条款内容，特别是以粗体粗体下划线标识的条款。
          </p>
          <p class="list-text fontBold">
            【签署】当您按照高睿云平台登录注册页面提示,
            在使用您已有的高睿咨询及或其关联公司账号登录高睿平台时阅读并点击同意本协议后，
            或者在注册激活高睿咨询账号过程中阅读并点击同意本协议且完成全部账号注册激活程序后，即表示您已审慎阅读、充分理解并完全接受
            本协议的全部内容，并同意与高睿咨询签署本协议，本协议自您点击同意时生效。在阅读本协议的过程中，如果您不同意本协议或其中任何
            条款约定，您应立即停止登录并及时联系高睿咨询及或其关联公司，或者立即停止账号注册激活程序。
          </p>
          <p class="list-text fontBold">目录</p>
          <p class="list-text fontBold">一、释义</p>
          <p class="list-text fontBold">二、账号授权和账号注册激活、使用</p>
          <p class="list-text fontBold">三、服务费用</p>
          <p class="list-text fontBold">四、服务内容及规范</p>
          <p class="list-text fontBold">五、用户信息的保护及授权</p>
          <p class="list-text fontBold">六、责任限制</p>
          <p class="list-text fontBold">七、用户的违约及处理</p>
          <p class="list-text fontBold">八、所有权及知识产权</p>
          <p class="list-text fontBold">九、协议范围与关联协议</p>
          <p class="list-text fontBold">十、协议的变更及终止</p>
          <p class="list-text fontBold">十一、通知</p>
          <p class="list-text fontBold">十二、法律适用、管辖与其他</p>
        </li>
      </ul>
    </el-row>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      // 最近更新日期
      updated: '2021年7月7日',
      // 生效日期
      effective: '2021年7月7日'
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
