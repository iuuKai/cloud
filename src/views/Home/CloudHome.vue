<template>
  <!--  首页页面-->
  <div class="index">
    <div class="index-top">
      <div class="index_advertising">
        <img
          src="https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/index/banner.jpg"
        />
      </div>
      <div class="index_Information">
        <div class="index_title">
          <div class="index_titleText">高睿云 订阅号</div>
          <div class="index_titleIcon">
            <img
              src="https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/index/index_zxxx.svg"
            />
          </div>
        </div>
        <div class="index_compontList">
          <div class="index_compontTitle">深圳市高睿咨询有限公司新闻</div>
          <div class="index_compontText">9月10日 瑞捷签约...</div>
        </div>
        <div class="index_compontList">
          <div class="index_compontTitle">深圳市高睿咨询有限公司新闻</div>
          <div class="index_compontText">9月10日 瑞捷签约...</div>
        </div>
      </div>
    </div>
    <div class="index_ConvenientButton">
      <div class="index_convenLeft">
        <div class="index_ButtonTitle">快速<br />发起</div>
        <div class="index_ButtionIcon">
          <div class="index_icon">
            <img
              src="https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/index/index_icon_jcsz.png"
            />
          </div>
          <div class="index_liconTitle">基础设置</div>
        </div>
        <div class="index_ButtionIcon">
          <div class="index_icon">
            <img
              src="https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/index/index_icon_jcsz.png"
            />
          </div>
          <div class="index_liconTitle">基础设置</div>
        </div>
      </div>
    </div>
    <div class="index_bottom">
      <div class="index_processed">
        <div class="index_processedTitle">
          <div class="index_titleIcon">
            <img
              src="https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/index/index_dbsx.svg"
            />
          </div>
          <div class="index_processedText">待办事项</div>
        </div>
        <div class="index_Matters">
          <div class="index_MattersNo">
            <div class="index_mattersTitle">暂无事项</div>
          </div>
          <div class="index_mattersIcon">
            <img
              src="https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/index/index-box.svg"
            />
          </div>
        </div>
      </div>
      <div class="index_processed">
        <div class="index_processedTitle">
          <div class="index_titleIcon">
            <img
              src="https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/index/index_tzsx.svg"
            />
          </div>
          <div class="index_processedText">通知事项</div>
        </div>
        <div class="index_Matters">
          <div class="index_MattersNo">
            <div class="index_mattersTitle">暂无事项</div>
          </div>
          <div class="index_mattersIcon">
            <img
              src="https://gaoruiyun-wechat.oss-cn-shenzhen.aliyuncs.com/portal.apps/index/index-box.svg"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
.index {
  width : 100%;
  overflow : hidden;
}
.index-top {
  padding : 10px;
  width : 100%;
  display : flex;
  flex-wrap : wrap;
  border-bottom : 1px solid #E7E7E7;
}
.index_advertising {
  margin-right : 6px;
  flex : 1;
  height : 300px;
  overflow : hidden;
}
.index_advertising img {
  width : 100%;
  display : inline-block;
  object-fit : cover;
}
.index_Information {
  flex : 0 0 450px;
  height : 300px;
  background-color : #FFFFFF;
}
.index_title {
  width : 100%;
  height : 43px;
  border-bottom : 1px solid #BBBBBB;
  display : flex;
  flex-wrap : wrap;
}
.index_titleText {
  line-height : 43px;
  text-indent : 10px;
  color : #333333;
  font-size : 16px;
}
.index_titleIcon {
  width : 24px;
  height : 24px;
  margin : 9.5px 0 0 25px;
}
.index_compontTitle {
  text-indent : 10px;
  margin-top : 10px;
  font-size : 16px;
  color : #333333;
}
.index_compontText {
  text-indent : 10px;
  font-size : 14px;
  line-height : 28px;
  color : #1E73BA;
}
.index_ConvenientButton {
  padding : 0 10px;
  width : 100%;
  height : 88px;
  display : flex;
  overflow : hidden;
  flex-wrap : wrap;
}
.index_convenLeft {
  flex : 1;
  display : flex;
  background-color : #FFFFFF;
}
.index_convenRight {
  flex : 0 0 450px;
  height : 58px;
  border-left : 1px solid #999999;
  margin : 15px 0 0 0;
  display : flex;
}
.index_convenImg {
  width : 44px;
  height : 44px;
  margin : 7px 0 0 7px;
}
.index_ButtonTitle {
  width : 88px;
  height : 88px;
  background-color : #1E73BA;
  color : #FFFFFF;
  font-size : 20px;
  line-height : 30px;
  padding-left : 20px;
  padding-right : 24px;
  padding-top : 10px;
}
.index_icon {
  width : 48px;
  height : 48px;
  margin : 9px 20px 0 20px;
}
.index_liconTitle {
  text-align : center;
  line-height : 26px;
}
.index_bottom {
  padding : 10px;
  width : 100%;
  display : flex;
  flex-wrap : wrap;
}
.index_processed {
  width : 50%;
  height : 540px;
  background-color : #FFFFFF;
  &:first-child {
    border-right : 3px solid #E3E6EE;
  }
  &:last-child {
    border-left : 3px solid #E3E6EE;
  }
}
.index_processed:last-child {
  border-right : 0;
}
.index_processedTitle {
  width : 100%;
  height : 42px;
  display : flex;
  margin : 10px 0 0 20px;
}
.index_processedText {
  font-size : 18px;
  line-height : 42px;
  margin : 0 0 0 5px;
}
.index_Matters {
  width : 100%;
}
.index_MattersNo {
  width : 104px;
  margin : auto;
  margin-top : 105px;
}
.index_mattersTitle {
  width : 100%;
  font-size : 16px;
  color : #C1C1C1;
  text-align : center;
}
.index_mattersIcon {
  width : 104px;
  height : 104px;
  margin : auto;
}

</style>
