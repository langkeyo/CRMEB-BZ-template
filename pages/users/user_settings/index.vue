<template>
  <view class="settings-page">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <image src="/static/icons/back-arrow.svg" class="back-icon" />
      </view>
      <view class="title">设置</view>
    </view>
    
    <!-- 设置选项列表 -->
    <view class="settings-list">
      <!-- 账号与安全 -->
      <view class="settings-item" @click="navigateTo('/pages/users/user_settings/version_account_security')">
        <view class="item-text">账号与安全</view>
        <image class="arrow-icon" src="/static/common/icons/navigation/arrow_right.svg" mode="aspectFit"></image>
      </view>
      <view class="divider"></view>
      <!-- 编辑资料 -->
      <view class="settings-item" @click="navigateTo('/pages/users/user_info/index')">
        <view class="item-text">编辑资料</view>
        <image class="arrow-icon" src="/static/common/icons/navigation/arrow_right.svg" mode="aspectFit"></image>
      </view>
      <view class="divider"></view>
      <view class="divider"></view>
      <!-- 收货地址 -->
      <view class="settings-item" @click="navigateTo('/pages/my_site/index')">
        <view class="item-text">我的站点</view>
        <image class="arrow-icon" src="/static/common/icons/navigation/arrow_right.svg" mode="aspectFit"></image>
      </view>
      <view class="divider"></view>
      <!-- 信息推送 -->
      <view class="settings-item">
        <view class="item-text">信息推送</view>
        <switch class="switch-btn" color="#04D44D" @change="switchChange" />
      </view>
      <view class="divider"></view>
      <!-- 关于张罗 -->
      <view class="settings-item" @click="navigateTo('/pages/users/privacy/index?type=4')">
        <view class="item-text">关于张罗
          <text class="dot"></text>
        </view>
        <image class="arrow-icon" src="/static/common/icons/navigation/arrow_right.svg" mode="aspectFit"></image>
      </view>
    </view>
    
    <!-- 退出登录按钮 -->
    <view class="logout-btn" @click="showLogoutConfirm">退出登录</view>
    
    <!-- 退出登录确认弹窗 -->
    <view class="logout-popup" v-if="showLogoutModal">
      <view class="logout-modal">
        <view class="modal-content">
          <view class="modal-title">您确定要退出登陆么？</view>
        </view>
        <view class="modal-btns">
          <view class="btn-cancel" @click="cancelLogout">再想想</view>
          <view class="divider-vertical"></view>
          <view class="btn-confirm" @click="confirmLogout">确定</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getLogout } from '@/api/user.js';
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      showLogoutModal: false
    }
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
    goBack() {
      uni.navigateBack();
    },
    // 页面跳转
    navigateTo(url) {
      uni.navigateTo({
        url: url
      });
    },
    // 推送开关切换
    switchChange(e) {
      // TODO: 保存推送设置
    },
    // 显示退出登录确认弹窗
    showLogoutConfirm() {
      this.showLogoutModal = true;
    },
    // 取消退出登录
    cancelLogout() {
      this.showLogoutModal = false;
    },
    // 确认退出登录
    confirmLogout() {
      getLogout().then(res => {
        this.$store.commit("LOGOUT");
        this.showLogoutModal = false;
        uni.reLaunch({
          url: '/pages/index/index'
        });
      }).catch(err => {
        this.showLogoutModal = false;
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

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100rpx;
  background: #fff;
  position: relative;
  border-bottom: 1rpx solid #F2F2F2;
}
.back-btn {
  position: absolute;
  left: 20rpx;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
}
.back-icon {
  width: 32rpx;
  height: 32rpx;
}
.title {
  font-size: 36rpx;
  font-weight: 400;
  color: #1A1A1A;
  text-align: center;
}

.settings-list {
  margin-top: 0;
  background: #fff;
}
.settings-item {
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  height: 100rpx;
  position: relative;
  background: #fff;
}
.item-text {
  flex: 1;
  font-size: 32rpx;
  color: #232A43;
  display: flex;
  align-items: center;
}
.arrow-icon {
  width: 20rpx;
  height: 20rpx;
  position: absolute;
  right: 30rpx;
}
.switch-btn {
  position: absolute;
  right: 30rpx;
  transform: scale(0.7);
  transform-origin: right center;
}
.divider {
  height: 1rpx;
  background: #F2F2F2;
  margin-left: 30rpx;
}
.dot {
  display: inline-block;
  width: 12rpx;
  height: 12rpx;
  background: #FF4D4F;
  border-radius: 50%;
  margin-left: 8rpx;
}
.logout-btn {
  width: 90%;
  height: 96rpx;
  background: #FE8D00;
  color: #FFFFFF;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 120rpx auto 0 auto;
  border-radius: 48rpx;
  position: fixed;
  left: 5%;
  bottom: 60rpx;
  z-index: 10;
}

/* 退出登录弹窗 */
.logout-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.logout-modal {
  width: 590rpx;
  height: 376rpx;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 20rpx 0 rgba(0,0,0,0.10);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.modal-content {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-title {
  text-align: center;
  font-size: 36rpx;
  color: #1A1A1A;
  font-weight: 400;
  line-height: 50rpx;
}
.modal-btns {
  display: flex;
  width: 100%;
  border-top: 1rpx solid #D7D7D7;
  background: #fff;
  height: 100rpx;
}
.btn-cancel, .btn-confirm {
  flex: 1;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  font-weight: 400;
  line-height: 50rpx;
  cursor: pointer;
}
.btn-cancel {
  color: #1A1A1A;
}
.btn-confirm {
  color: #333333;
}
.divider-vertical {
  width: 1rpx;
  background-color: #D7D7D7;
  height: 100rpx;
}
</style> 