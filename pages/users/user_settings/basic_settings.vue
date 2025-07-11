<template>
  <view class="settings-page">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="title">设置</view>
    </view>
    
    <!-- 分割线 -->
    <view class="divider"></view>
    
    <!-- 设置选项列表 -->
    <view class="settings-list">
      <!-- 账号与安全 -->
      <view class="settings-item" @click="navigateTo('/pages/users/user_settings/version_account_security')">
        <image class="item-icon" src="/static/images/user/document_icon.svg" mode="aspectFit"></image>
        <view class="item-text">账号与安全</view>
        <image class="arrow-icon" src="/static/common/icons/navigation/arrow_right.svg" mode="aspectFit"></image>
      </view>
      
      <!-- 编辑资料 -->
      <view class="settings-item" @click="navigateTo('/pages/users/user_info/index')">
        <image class="item-icon" src="/static/images/user/document_icon.svg" mode="aspectFit"></image>
        <view class="item-text">编辑资料</view>
        <image class="arrow-icon" src="/static/common/icons/navigation/arrow_right.svg" mode="aspectFit"></image>
      </view>
      
      <!-- 我的站点 -->
      <view class="settings-item" @click="navigateTo('/pages/my_site/index')">
        <image class="item-icon" src="/static/images/user/document_icon.svg" mode="aspectFit"></image>
        <view class="item-text">我的站点</view>
        <image class="arrow-icon" src="/static/common/icons/navigation/arrow_right.svg" mode="aspectFit"></image>
      </view>
      
      <!-- 信息推送 -->
      <view class="settings-item">
        <view class="item-text">信息推送</view>
        <switch class="switch-btn" color="#04D44D" @change="switchChange" />
      </view>
      
      <!-- 关于张罗 -->
      <view class="settings-item" @click="navigateTo('/pages/users/privacy/index?type=4')">
        <image class="item-icon" src="/static/images/user/document_icon.svg" mode="aspectFit"></image>
        <view class="item-text">关于张罗</view>
        <image class="arrow-icon" src="/static/common/icons/navigation/arrow_right.svg" mode="aspectFit"></image>
      </view>
    </view>
    
    <!-- 退出登录按钮 -->
    <view class="logout-btn" @click="logout">退出登录</view>
  </view>
</template>

<script>
import { getLogout } from '@/api/user.js';
import { mapGetters } from "vuex";

export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['isLogin'])
  },
  onShow() {
    if (!this.isLogin) {
      this.toLogin();
    }
  },
  methods: {
    // 页面跳转
    navigateTo(url) {
      uni.navigateTo({
        url: url
      });
    },
    
    // 推送开关切换
    switchChange(e) {
      console.log('信息推送开关状态：', e.detail.value);
      // TODO: 保存推送设置
    },
    
    // 退出登录（直接退出，无确认弹窗）
    logout() {
      getLogout().then(res => {
        this.$store.commit("LOGOUT");
        uni.reLaunch({
          url: '/pages/index/index'
        });
      }).catch(err => {
        uni.showToast({
          title: '退出失败，请重试',
          icon: 'none'
        });
      });
    },
    
    // 跳转到登录页
    toLogin() {
      uni.navigateTo({
        url: '/pages/users/login/index'
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.settings-page {
  min-height: 100vh;
  background-color: #FFFFFF;
  position: relative;
}

/* 顶部标题 */
.header {
  padding: 30rpx;
  background-color: #EEEEEE;
}
.title {
  font-size: 36rpx;
  font-weight: 400;
  color: #1A1A1A;
  text-align: left;
}

/* 分割线 */
.divider {
  height: 1rpx;
  background-color: #F2F2F2;
}

/* 设置列表 */
.settings-list {
  margin-top: 20rpx;
}
.settings-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  position: relative;
  box-shadow: 0 1rpx 0 0 rgba(245, 245, 245, 1);
}
.item-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 20rpx;
}
.item-text {
  flex: 1;
  font-size: 32rpx;
  color: #4D4D4D;
}
.arrow-icon {
  width: 30rpx;
  height: 30rpx;
}
.switch-btn {
  transform: scale(0.8);
}

/* 退出登录按钮 */
.logout-btn {
  width: 80%;
  height: 96rpx;
  background: linear-gradient(90deg, #FE8D00, #FE8D00);
  color: #FFFFFF;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 60rpx auto;
  border-radius: 96rpx;
}
</style> 