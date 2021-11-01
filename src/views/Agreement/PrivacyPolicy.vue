<template>
  <!-- 隐私政策 -->
  <el-row>
    <h1 class="title">隐私政策</h1>
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
          <p class="list-title fontBold">引言</p>
          <p class="list-text fontBold">
            您的信任对高睿咨询及或其关联公司（以下简称“我们”）非常重要，我们深知用户信息安全的重要性，我们将按法律法规要求，采取相应安全保护措施，尽力保护您的用户信息安全可控。鉴此，高睿咨询制定《高睿咨询隐私政策》（下称“本隐私政策”）并提醒您：
          </p>
          <p class="list-text">
            本隐私政策适用于高睿咨询及或其关联公司的产品及或服务。<span
              class="fontBold"
              >如高睿咨询关联公司（范围详见定义部分）的产品及或服务中使用了高睿咨询提供的产品及或服务（例如使用高睿咨询账号登录）但未设置独立的隐私政策的，或者高睿咨询关联公司的产品及或服务未设置单独的隐私政策的，则本隐私政策同样适用于该部分产品及或服务。</span
            >
          </p>
          <p class="list-text">
            需要特别说明的是，<span class="fontBold textUnderline"
              >本隐私政策不适用于其他第三方向您提供的产品及服务，第三方向您提供的产品及服务适用其向您说明的隐私政策。</span
            >
          </p>
          <p class="list-text">
            ><span class="fontBold textUnderline"
              >在使用高睿咨询及或其关联公司的各项产品及或服务前，请您务必仔细阅读并透彻理解本隐私政策，特别是以粗体粗体下划线标识的条款，您应重点阅读，请在确认充分理解并同意后使用高睿咨询及或其关联公司的产品及或服务。一旦您开始使用高睿咨询及或其关联公司的各项产品及或服务，即表示您已充分理解并同意本隐私政策。</span
            >如对本隐私政策内容有任何疑问、意见或建议，您可通过本隐私政策“九、如何联系我们”中披露的联系方式与我们联系。
          </p>
        </li>
        <li>
          <p class="list-title fontBold">第一部分 定义</p>
          <p class="list-text">
            <span class="fontBold">用户：</span
            >指成功注册激活高睿咨询账号的自然人、法人或其他组织，和签署了本协议并使用高睿咨询关联公司账号登录高睿云平台的自然人、法人或其他组织。
          </p>
          <p class="list-text">
            <span class="fontBold">高睿咨询：</span>指深圳市高睿咨询有限公司。
          </p>
          <p class="list-text">
            <span class="fontBold">关联公司：</span
            >指深圳市高睿咨询有限公司在本隐私政策中披露的关联公司。
          </p>
          <p class="list-text">
            <span class="fontBold">高睿云平台：</span
            >指高睿咨询及或其关联公司运营的，为您提供各项产品及或服务的网站、客户端、移动应用程序、微信公众号、微信小程序等渠道（包括未来技术发展出现的新的形态）。
          </p>
          <p class="list-text">
            <span class="fontBold">产品及或服务：</span
            >指高睿咨询及或其关联公司通过高睿云平台为您提供的各项产品及或服务。
          </p>
          <p class="list-text">
            <span class="fontBold">平台规则：</span
            >指在高睿云平台上已经发布的及未来根据需要不定期更新的或新发布的所有服务规则、公告及各项产品及或服务的流程说明、使用方法规则介绍等。
          </p>
          <p class="list-text">
            <span class="fontBold">个人信息：</span
            >指以电子或者其他方式记录的能够单独或者与其他信息结合识别特定自然人身份或者反映特定自然人活动情况的各种信息。我们将在本隐私权政策中对所涉及的个人信息以粗体方式进行显著标识。
          </p>
          <p class="list-text">
            <span class="fontBold">个人敏感信息：</span
            >指一旦泄露、非法提供或滥用可能危害人身和财产安全，极易导致个人名誉、身心健康受到损害或歧视性待遇等的个人信息。人敏感信息包括身份证件号码、个人生物识别信息、银行账号、通信记录和内容、财产信息、征信信息、行踪轨迹、住宿信息、健康生理信息、交易信息、14岁以下（含）儿童的个人信息（我们将在本隐私政策中对所涉及的个人敏感信息以粗体和加*号方式进行显著标识）。
          </p>
          <p class="list-text">
            <span class="fontBold">企业信息：</span
            >指企业从事生产经营活动过程中形成的信息，以及高睿咨询及或其关联公司在为企业提供产品及或服务过程中产生的能够反映企业状况的信息。
          </p>
          <p class="list-text">
            除另有约定外，本隐私政策所用定义与《高睿咨询用户使用协议》中的定义具有相同的涵义。
          </p>
        </li>
        <li>
          <p class="list-title fontBold">第二部分 隐私政策</p>
          <p class="list-text fontBold">本隐私政策部分将帮助您了解以下内容：</p>
          <p class="list-text">一、我们如何收集和使用用户信息</p>
          <p class="list-text">二、我们如何使用Cookie和同类技术</p>
          <p class="list-text">三、我们如何共享、转让、公开披露用户信息</p>
          <p class="list-text">四、我们如何保护用户信息</p>
          <p class="list-text">五、您如何管理用户信息</p>
          <p class="list-text">六、我们如何处理儿童的个人信息</p>
          <p class="list-text">七、用户信息如何在全球范围转移</p>
          <p class="list-text">八、本隐私政策如何更新</p>
          <p class="list-text">九、如何联系我们</p>
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
