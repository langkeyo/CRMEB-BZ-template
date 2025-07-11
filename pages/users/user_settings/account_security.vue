<template>
  <view class="account-security-page">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="title">账号与安全</view>
    </view>
    
    <!-- 分割线 -->
    <view class="divider"></view>
    
    <!-- 账号安全设置项 -->
    <view class="settings-list">
      <!-- 手机号 -->
      <view class="settings-item">
        <view class="item-icon">
          <image src="/static/images/user/phone_icon.svg" mode="aspectFit"></image>
        </view>
        <view class="item-content">
          <view class="item-text">手机号</view>
          <view class="item-value">{{ maskPhone }}</view>
        </view>
        <view class="arrow-icon">
          <image src="/static/common/icons/navigation/arrow_right.svg" mode="aspectFit"></image>
        </view>
      </view>
      
      <!-- 修改密码 -->
      <view class="settings-item" @click="goToChangePassword">
        <view class="item-icon">
          <image src="/static/images/user/lock_icon.svg" mode="aspectFit"></image>
        </view>
        <view class="item-content">
          <view class="item-text">修改密码</view>
        </view>
        <view class="arrow-icon">
          <image src="/static/common/icons/navigation/arrow_right.svg" mode="aspectFit"></image>
        </view>
      </view>
    </view>
    
    <!-- 底部安全区域 -->
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        phone: '18512343652'
      }
    }
  },
  computed: {
    maskPhone() {
      if (!this.userInfo.phone) return '';
      return this.userInfo.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    }
  },
  methods: {
    goToChangePassword() {
      uni.navigateTo({
        url: '/pages/users/user_settings/change_password'
      });
    }
  }
}
</script>

<style lang="scss">
.account-security-page {
  min-height: 100vh;
  background-color: #FFFFFF;
  
  .header {
    padding: 44px 15px 15px;
    position: relative;
    
    .title {
      font-size: 18px;
      color: #1A1A1A;
      font-weight: 400;
      text-align: center;
    }
  }
  
  .divider {
    height: 0.5px;
    background-color: #F2F2F2;
    width: 100%;
  }
  
  .settings-list {
    padding: 0 15px;
    
    .settings-item {
      display: flex;
      align-items: center;
      padding: 15px 0;
      position: relative;
      box-shadow: 0px 0.5px 0px 0px rgba(245, 245, 245, 1);
      
      .item-icon {
        width: 20px;
        height: 20px;
        margin-right: 10px;
        
        image {
          width: 100%;
          height: 100%;
        }
      }
      
      .item-content {
        flex: 1;
        
        .item-text {
          font-size: 16px;
          color: #4D4D4D;
          font-weight: 400;
          line-height: 1.4;
        }
        
        .item-value {
          font-size: 14px;
          color: #B3B3B3;
          font-weight: 400;
          line-height: 1.4;
        }
      }
      
      .arrow-icon {
        width: 16px;
        height: 16px;
        
        image {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  
  .safe-area-bottom {
    height: 34px;
  }
}
</style> 