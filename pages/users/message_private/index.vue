<template>
  <view class="message-private-page">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="back-section" @click="goBack">
        <view class="back-arrow"></view>
        <text class="back-text">返回</text>
      </view>
      <view class="page-title">信息私信</view>
    </view>

    <!-- 页面内容区域 -->
    <view class="page-content">
      <!-- 消息列表 -->
      <view class="message-list">
        <!-- 服务通知 -->
        <view class="message-item service-notice" @click="goToServiceNotice">
          <view class="avatar-container">
            <view class="service-avatar">
              <view class="notification-icon">
                <view class="bell-body"></view>
                <view class="bell-handle"></view>
              </view>
            </view>
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
          @click="goToServiceNotice">
          <image class="avatar" :src="item.avatar" mode="aspectFill"></image>
          <view class="message-content">
            <view class="message-title">{{item.title}}</view>
            <view class="message-preview">{{item.lastMessage}}</view>
          </view>
          <view class="message-time">{{item.time}}</view>
        </view>
      </view>
    </view>

    <!-- 底部Home指示器 -->
    <view class="home-indicator"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showNotificationBar: false, // 默认不显示通知栏
      unreadCount: 3,
      messageList: [
        {
          id: 1,
          title: '系统通知',
          lastMessage: '亲还需要其他帮忙的，随时告诉我哦，我在...',
          time: '16:48',
          avatar: '/static/images/avatar.png'
        }
      ]
    }
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
    goToServiceNotice() {
      // 跳转到服务通知页面
      uni.navigateTo({
        url: '/pages/users/service_notice/index'
      });
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
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #F8F8F8;
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;

  // 顶部导航栏背景渐变
  .header {
    position: fixed;
    width: 100%;
    height: 56px;
    left: 0;
    top: 0;
    background: linear-gradient(180deg, rgba(254, 141, 0, 0.15) 0%, rgba(254, 141, 1, 0) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

    .back-section {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 10px;
      border-radius: 50%;
      transition: background-color 0.2s;

      &:active {
        background-color: rgba(0, 0, 0, 0.05);
      }

      .back-arrow {
        width: 10px;
        height: 10px;
        border: 2px solid #4D4D4D;
        border-right: none;
        border-top: none;
        transform: rotate(45deg);
        margin-right: 5px;
      }

      .back-text {
        font-weight: 400;
        font-size: 16px;
        color: #4D4D4D;
      }
    }

    .page-title {
      font-weight: 500;
      font-size: 18px;
      color: #000000;
      text-align: center;
    }
  }

  // 推送通知提示栏
  .notification-bar {
    position: fixed;
    width: 100%;
    height: auto;
    left: 0;
    top: 56px;
    background: rgba(255, 206, 144, 0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    z-index: 998;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

    .notification-left {
      display: flex;
      align-items: center;
      flex: 1;

      .notification-close {
        width: 20px;
        height: 20px;
        font-size: 20px;
        line-height: 20px;
        color: #808080;
        margin-right: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .notification-text {
        font-size: 14px;
        line-height: 20px;
        color: #666;
        flex: 1;
      }
    }

    .notification-btn {
      min-width: 74px;
      height: 32px;
      background: #FE8D00;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #FFFFFF;
      padding: 0 15px;
      margin-left: 10px;
      box-shadow: 0 2px 4px rgba(254, 141, 0, 0.2);
      transition: background 0.2s;

      &:active {
        background: #E07D00;
      }
    }
  }

  // 页面内容区域
  .page-content {
    padding-top: 56px;
    padding-bottom: 50px;
    width: 100%;
    box-sizing: border-box;
    transition: padding-top 0.3s ease;
  }

  // 当通知栏显示时，增加页面内容的顶部内边距
  .notification-bar + .page-content {
    padding-top: 112px;
  }

  // 消息列表
  .message-list {
    padding: 15px;

    .message-item {
      position: relative;
      width: 100%;
      min-height: 60px;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      padding: 10px 15px;
      background: #FFFFFF;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s, box-shadow 0.2s;

      &:active {
        transform: scale(0.98);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
      }

      &.service-notice {
        .avatar-container {
          position: relative;
          margin-right: 12px;

          .service-avatar {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #FF9B1F, #FE8D00);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(254, 141, 0, 0.25);

            .notification-icon {
              position: relative;
              width: 22px;
              height: 20px;

              .bell-body {
                position: absolute;
                width: 16px;
                height: 16px;
                left: 3px;
                top: 2px;
                background: #FFFFFF;
                border-radius: 12.5px 12.5px 0px 0px;
                box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.15) inset;
              }

              .bell-handle {
                position: absolute;
                width: 22px;
                height: 2px;
                left: 0px;
                top: 18px;
                background: #FFFFFF;
                border-radius: 1px;
              }

              &::before {
                content: '';
                position: absolute;
                width: 2px;
                height: 3px;
                left: 10px;
                top: 0px;
                background: #FFFFFF;
                border-radius: 1px 1px 0px 0px;
              }
            }
          }

          .badge {
            position: absolute;
            width: 18px;
            height: 18px;
            right: -5px;
            top: -5px;
            background: #FB5B17;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 1px 3px rgba(251, 91, 23, 0.3);
            border: 1.5px solid #FFFFFF;

            text {
              font-size: 12px;
              color: #FFFFFF;
              font-weight: 500;
            }
          }
        }
      }

      .avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        margin-right: 12px;
        border: 1px solid rgba(0, 0, 0, 0.05);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      }

      .message-content {
        flex: 1;
        overflow: hidden;
        padding-right: 30px;

        .message-title {
          font-weight: 500;
          font-size: 16px;
          line-height: 22px;
          color: #1A1A1A;
          margin-bottom: 6px;
        }

        .message-preview {
          font-size: 14px;
          line-height: 18px;
          color: #808080;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .message-time {
        position: absolute;
        right: 15px;
        top: 12px;
        font-size: 12px;
        color: #999;
      }
    }
  }

  // 底部Home指示器
  .home-indicator {
    position: fixed;
    width: 100%;
    height: 34px;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;

    &::after {
      content: '';
      width: 134px;
      height: 5px;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 2.5px;
    }
  }
}
</style>