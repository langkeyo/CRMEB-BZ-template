<template>
  <view class="user-follow-static">
    <!-- 顶部渐变背景 -->
    <view class="top-gradient"></view>
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="back-icon">
        <text class="iconfont icon-left"></text>
      </view>
      <view class="nav-title">我的关注</view>
    </view>
    <!-- Tab切换 -->
    <view class="tab-bar">
      <view class="tab active">租售信息</view>
      <view class="tab">商业信息</view>
    </view>
    <!-- 搜索框 -->
    <view class="search-bar">
      <text class="search-icon">🔍</text>
      <text class="search-placeholder">搜索</text>
    </view>
    <!-- 关注列表 -->
    <view class="follow-list">
      <view class="follow-item">
        <image class="avatar" src="/static/images/follows/store_rental_1.jpg" />
        <view class="info">
          <view class="name">瑞幸咖啡.三里屯店</view>
          <view class="desc">5天前关注</view>
        </view>
        <view class="follow-btn followed">
          <text class="iconfont icon-xuanze"></text>
          <text>已关注</text>
        </view>
      </view>
      <view class="follow-item">
        <image class="avatar" src="/static/images/follows/store_rental_2.jpg" />
        <view class="info">
          <view class="name">天天食品专卖店</view>
          <view class="desc">5天前关注</view>
        </view>
        <view class="follow-btn followed">
          <text class="iconfont icon-xuanze"></text>
          <text>已关注</text>
        </view>
      </view>
      <view class="follow-item">
        <image class="avatar" src="/static/images/follows/store_rental_3.jpg" />
        <view class="info">
          <view class="name">德芙专卖店</view>
          <view class="desc">1个月前关注</view>
        </view>
        <view class="follow-btn followed">
          <text class="iconfont icon-xuanze"></text>
          <text>已关注</text>
        </view>
      </view>
      <view class="follow-item">
        <image class="avatar" src="/static/images/follows/store_rental_4.jpg" />
        <view class="info">
          <view class="name">时刻生鲜专卖店</view>
          <view class="desc">1个月前关注</view>
        </view>
        <view class="follow-btn followed">
          <text class="iconfont icon-xuanze"></text>
          <text>已关注</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'UserFollowStatic'
}
</script>

<style scoped>
.user-follow-static {
  position: relative;
  width: 375px;
  min-height: 812px;
  background: #F8F8F8;
  font-family: 'PingFang SC', sans-serif;
}
.top-gradient {
  position: absolute;
  width: 375px;
  height: 130px;
  left: 0;
  top: 0;
  background: linear-gradient(180deg, #F9E4CA 0%, rgba(249, 227, 200, 0) 100%);
  z-index: 0;
}
.nav-bar {
  position: relative;
  display: flex;
  align-items: center;
  height: 44px;
  padding-top: 44px;
  background: transparent;
  z-index: 1;
}
.back-icon {
  width: 36px;
  height: 25px;
  margin-left: 13px;
  display: flex;
  align-items: center;
  color: #4D4D4D;
  font-size: 18px;
}
.nav-title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  color: #000;
  font-weight: 400;
}
.tab-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  background: transparent;
}
.tab {
  width: 90px;
  text-align: center;
  font-size: 16px;
  color: #999;
  padding-bottom: 6px;
  margin: 0 20px;
  position: relative;
}
.tab.active {
  color: #000;
  font-weight: 400;
}
.tab.active::after {
  content: '';
  display: block;
  width: 30px;
  height: 2px;
  background: #FE8D00;
  border-radius: 1px;
  margin: 0 auto;
  margin-top: 4px;
}
.search-bar {
  margin: 20px 12px 0 12px;
  height: 36px;
  background: #fff;
  border-radius: 16.5px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  font-size: 15px;
  color: #E5E5E5;
}
.search-icon {
  margin-right: 8px;
}
.search-placeholder {
  color: #E5E5E5;
}
.follow-list {
  margin-top: 16px;
}
.follow-item {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 20px;
  margin: 0 12px 16px 12px;
  padding: 16px 20px;
}
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 16px;
}
.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.name {
  font-size: 16px;
  color: #000;
  font-weight: 400;
  margin-bottom: 4px;
}
.desc {
  font-size: 13px;
  color: #B3B3B3;
}
.follow-btn {
  width: 90px;
  height: 30px;
  border: 0.5px solid #999;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
  background: #fff;
}
.follow-btn .iconfont {
  font-size: 16px;
  margin-right: 4px;
}
.follow-btn.followed {
  color: #999;
  background: #fff;
}
</style> 