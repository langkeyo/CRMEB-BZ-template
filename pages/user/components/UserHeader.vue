<template>
  <view class="user-header">
    <!-- 背景 -->
    <view class="background-header"></view>

    <!-- 用户信息和导航栏组合 -->
    <view class="user-nav-container">
      <!-- 用户信息 -->
      <view class="user-info-section" @click="handleUserInfoClick">
        <image class="avatar" :src="computedAvatar" />
        <view class="user-details">
          <view class="login-register" v-if="!isLoggedIn">
            <text class="login-text">{{ userInfo.nickname }}</text>
            <image class="arrow-icon" src="/static/common/icons/navigation/arrow_right.svg" />
          </view>
          <template v-else>
            <text class="user-name">{{ userInfo.nickname || '加载中....' }}</text>
            <view class="edit-profile">
              <text class="edit-profile-text">{{ isLoginText }}</text>
              <image class="arrow-right" src="/static/common/icons/navigation/arrow_right.svg" />
            </view>
          </template>
        </view>
      </view>

      <!-- 导航图标 -->
      <view class="nav-icons">
        <view class="icon-notification" @click="onNotificationClick">
          <!-- 通知图标 -->
          <image class="icon-bell" src="/static/images/user/bell_icon.svg" />
          <view class="notification-badge">2</view>
        </view>
        <view class="icon-settings" @click="onSettingsClick">
          <!-- 设置图标 -->
          <image class="icon-gear" src="/static/images/user/settings_icon.svg" />
        </view>
      </view>
    </view>

    <!-- 统计信息：商品券、关注、点赞 -->
    <view class="stats-section">
      <view class="stat-item" @click="onStatClick('coupon')">
        <text class="stat-value">{{ stats.coupon }}</text>
        <text class="stat-label">商品券</text>
      </view>
      <view class="stat-item" @click="onStatClick('follow')">
        <text class="stat-value">{{ stats.follow }}</text>
        <text class="stat-label">关注</text>
      </view>
      <view class="stat-item" @click="onStatClick('like')">
        <text class="stat-value">{{ stats.like }}</text>
        <text class="stat-label">点赞</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'UserHeader',
  props: {
    userInfo: {
      type: Object,
      default: () => ({
        avatar: '',
        nickname: ''
      })
    },
    stats: {
      type: Object,
      default: () => ({
        coupon: 3,
        follow: 10,
        like: 10
      })
    }
  },
  computed: {
    computedAvatar() {
      // Use default_avatar.png if not logged in
      if (!this.userInfo.avatar || this.userInfo.nickname === '登录/注册') {
        return '/static/images/user/default_avatar.png';
      }
      return this.userInfo.avatar;
    },
    isLoginText() {
      return this.userInfo.nickname === '登录/注册' ? '点击登录' : '编辑资料';
    },
    isLoggedIn() {
      return this.userInfo.nickname !== '登录/注册';
    }
  },
  methods: {
    handleUserInfoClick() {
      if (!this.isLoggedIn) {
        this.$emit('login-click');
      } else {
        this.$emit('edit-profile');
      }
    },
    onNotificationClick() {
      this.$emit('notification-click');
    },
    onSettingsClick() {
      this.$emit('settings-click');
    },
    onStatClick(type) {
      this.$emit('stat-click', type);
    }
  }
}
</script>

<style lang="scss" scoped>
.user-header {
  position: relative;
}

.background-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 400rpx;
  background: linear-gradient(to bottom, #FEF3DF, #F0F0F0);
  z-index: 0;
}

.user-nav-container {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 22rpx 0 30rpx;
}

.nav-icons {
  display: flex;
  align-items: center;
}

.icon-settings {
  width: 40rpx;
  height: 50rpx;
}

.icon-notification {
  width: 48rpx;
  height: 54rpx;
  margin-right: 40rpx;
  position: relative;
}

.icon-bell {
  width: 36rpx;
  height: 42rpx;
  filter: brightness(0) invert(1) drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.5));
}

.icon-gear {
  width: 40rpx;
  height: 40rpx;
  filter: brightness(0) invert(1) drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.5));
}

.notification-badge {
  position: absolute;
  top: -16rpx;
  right: -16rpx;
  background-color: #E10000;
  color: white;
  border-radius: 50%;
  min-width: 28rpx;
  height: 28rpx;
  font-size: 20rpx;
  line-height: 28rpx;
  padding: 0 10rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1rpx solid white;
}

.user-info-section {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
}

.avatar {
  width: 132rpx;
  height: 132rpx;
  border-radius: 50%;
}

.user-details {
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
}

.login-register {
  display: flex;
  align-items: center;
  margin-top: 10rpx;
}

.login-text {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 36rpx;
  line-height: 50rpx;
  color: #000000;
}

.arrow-icon {
  width: 16rpx;
  height: 28rpx;
  margin-left: 8rpx;
}

.user-name {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 36rpx;
  line-height: 50rpx;
  color: #000000;
}

.edit-profile {
  display: flex;
  align-items: center;
  margin-top: 8rpx;
}

.edit-profile-text {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 25rpx;
  line-height: 36rpx;
  color: #666666;
}

.arrow-right {
  width: 16rpx;
  height: 28rpx;
  margin-left: 8rpx;
}

.stats-section {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-around;
  padding: 0 60rpx;
  margin-top: 48rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-value {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 36rpx;
  line-height: 50rpx;
  color: #1A1A1A;
}

.stat-label {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 22rpx;
  line-height: 31rpx;
  color: #808080;
  margin-top: 8rpx;
}
</style>
