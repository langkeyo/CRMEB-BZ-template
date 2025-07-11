<template>
  <view class="message-private-page">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="back-icon" @click="goBack">
        <text class="iconfont icon-left"></text>
      </view>
      <view class="page-title">信息私信</view>
    </view>
    
    <!-- 推送通知提示栏 -->
    <view class="notification-bar" v-if="showNotificationBar">
      <view class="notification-left">
        <text class="notification-close" @click="closeNotificationBar">×</text>
        <text class="notification-text">开启推送通知，及时获取互动消息</text>
      </view>
      <view class="notification-btn" @click="enableNotification">去开启</view>
    </view>
    
    <!-- 消息列表 -->
    <view class="message-list">
      <!-- 服务通知 -->
      <view class="message-item service-notice">
        <view class="avatar-container">
          <image class="avatar" src="/static/images/message/notification_icon.png" mode="aspectFill"></image>
          <view class="badge" v-if="unreadCount > 0">
            <text>{{unreadCount}}</text>
          </view>
        </view>
        <view class="message-content">
          <view class="message-title">服务通知</view>
          <view class="message-preview">欢迎来到张罗~</view>
        </view>
        <view class="message-time">16:58</view>
      </view>
      
      <!-- 商家消息列表 -->
      <view 
        class="message-item"
        v-for="(item, index) in messageList" 
        :key="index"
        @click="goToChat(item)">
        <image class="avatar" :src="item.avatar" mode="aspectFill"></image>
        <view class="message-content">
          <view class="message-title">{{item.title}}</view>
          <view class="message-preview">{{item.lastMessage}}</view>
        </view>
        <view class="message-time">{{item.time}}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showNotificationBar: true,
      unreadCount: 3,
      messageList: [
        {
          id: 1,
          title: '面包计划旗舰店',
          lastMessage: '亲还需要其他帮忙的，随时告诉我哦，我在...',
          time: '16:48',
          avatar: '/static/images/message/store_1.jpg'
        },
        {
          id: 2,
          title: '天天食品专营店',
          lastMessage: '请问有什么可以帮到您的？',
          time: '16:20',
          avatar: '/static/images/message/store_2.jpg'
        },
        {
          id: 3,
          title: '德芙专营店',
          lastMessage: '好的，亲',
          time: '15:58',
          avatar: '/static/images/message/store_3.jpg'
        },
        {
          id: 4,
          title: '时刻生鲜专卖店',
          lastMessage: '好的，立刻给您发货',
          time: '15:30',
          avatar: '/static/images/message/store_4.jpg'
        }
      ]
    }
  },
  onLoad() {
    // 页面加载时的逻辑
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    closeNotificationBar() {
      this.showNotificationBar = false;
    },
    enableNotification() {
      // 跳转到通知设置或者开启通知的逻辑
      uni.showToast({
        title: '已开启通知',
        icon: 'success'
      });
      this.showNotificationBar = false;
    },
    goToChat(item) {
      // 跳转到聊天详情页
      uni.navigateTo({
        url: '/pages/users/online_chat/index?id=' + item.id + '&title=' + item.title
      });
    }
  }
}
</script>

<style lang="scss">
.message-private-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  
  .header {
    height: 84rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding-top: 44px;
    background: linear-gradient(to bottom, rgba(254, 141, 0, 0.2), rgba(254, 141, 1, 0));
    
    .back-icon {
      position: absolute;
      left: 30rpx;
      font-size: 36rpx;
      color: #4d4d4d;
    }
    
    .page-title {
      font-size: 36rpx;
      font-weight: 400;
      color: #000;
    }
  }
  
  .notification-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30rpx;
    height: 86rpx;
    background-color: rgba(255, 206, 144, 0.3);
    
    .notification-left {
      display: flex;
      align-items: center;
      
      .notification-close {
        font-size: 30rpx;
        color: #808080;
        margin-right: 28rpx;
      }
      
      .notification-text {
        font-size: 30rpx;
        color: #808080;
      }
    }
    
    .notification-btn {
      width: 148rpx;
      height: 60rpx;
      background-color: #fe8d00;
      color: #fff;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
    }
  }
  
  .message-list {
    padding: 0 24rpx;
    
    .message-item {
      display: flex;
      padding: 30rpx 0;
      border-bottom: 1px solid #f5f5f5;
      position: relative;
      
      &.service-notice {
        .avatar-container {
          position: relative;
          
          .badge {
            position: absolute;
            top: 0;
            right: 0;
            width: 24rpx;
            height: 24rpx;
            background-color: #fb5b17;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            
            text {
              color: #fff;
              font-size: 20rpx;
              transform: scale(0.8);
            }
          }
        }
      }
      
      .avatar {
        width: 88rpx;
        height: 88rpx;
        border-radius: 50%;
        margin-right: 22rpx;
      }
      
      .message-content {
        flex: 1;
        overflow: hidden;
        
        .message-title {
          font-size: 32rpx;
          color: #1a1a1a;
          margin-bottom: 14rpx;
        }
        
        .message-preview {
          font-size: 26rpx;
          color: #808080;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      
      .message-time {
        font-size: 24rpx;
        color: #808080;
        position: absolute;
        right: 0;
        top: 30rpx;
      }
    }
  }
}
</style> 