<template>
  <view class="message-private-page">
    <!-- 状态栏 -->
    <view class="status-bar">
      <!-- iPhone状态栏 -->
      <view class="status-content">
        <view class="left-side">
          <text class="time">9:41</text>
        </view>
        <view class="right-side">
          <view class="signal-icons">
            <!-- 信号强度 -->
            <view class="mobile-signal">
              <view class="signal-bar bar1"></view>
              <view class="signal-bar bar2"></view>
              <view class="signal-bar bar3"></view>
              <view class="signal-bar bar4"></view>
            </view>
            <!-- WiFi -->
            <view class="wifi-icon">
              <view class="wifi-arc arc1"></view>
              <view class="wifi-arc arc2"></view>
              <view class="wifi-arc arc3"></view>
            </view>
            <!-- 电池 -->
            <view class="battery">
              <view class="battery-body"></view>
              <view class="battery-tip"></view>
              <view class="battery-level"></view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="back-section" @click="goBack">
        <view class="back-arrow"></view>
        <text class="back-text">返回</text>
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
        @click="goToChat(item)">
        <image class="avatar" :src="item.avatar" mode="aspectFill"></image>
        <view class="message-content">
          <view class="message-title">{{item.title}}</view>
          <view class="message-preview">{{item.lastMessage}}</view>
        </view>
        <view class="message-time">{{item.time}}</view>
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
    this.setStatusBarStyle();
  },
  methods: {
    setStatusBarStyle() {
      // 设置状态栏样式
      // #ifdef APP-PLUS
      plus.navigator.setStatusBarStyle('dark');
      // #endif
    },
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
  width: 100vw;
  min-height: 100vh;
  background: #F8F8F8;
  font-family: 'PingFang SC', sans-serif;

  // 状态栏样式
  .status-bar {
    position: fixed;
    width: 100%;
    height: 44px;
    left: 0;
    top: 0;
    z-index: 1000;

    .status-content {
      position: relative;
      width: 100%;
      height: 100%;

      .left-side {
        position: absolute;
        width: 54px;
        height: 21px;
        left: 21px;
        top: 12px;

        .time {
          position: absolute;
          width: 28.43px;
          height: 11.09px;
          left: 12.45px;
          top: 5.17px;
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 400;
          font-size: 18px;
          line-height: 25px;
          color: #000000;
        }
      }

      .right-side {
        position: absolute;
        width: 66.66px;
        height: 11.34px;
        left: 293.67px;
        top: 17.33px;

        .signal-icons {
          display: flex;
          align-items: center;
          gap: 5px;

          .mobile-signal {
            display: flex;
            align-items: flex-end;
            gap: 1px;

            .signal-bar {
              background: #000000;
              width: 3px;

              &.bar1 { height: 4px; }
              &.bar2 { height: 6px; }
              &.bar3 { height: 8.33px; }
              &.bar4 { height: 10.67px; }
            }
          }

          .wifi-icon {
            position: relative;
            width: 15.27px;
            height: 4.74px;

            .wifi-arc {
              position: absolute;
              background: #000000;
              border-radius: 50%;

              &.arc1 {
                width: 15.27px;
                height: 4.74px;
                left: 0;
                top: 0;
              }
              &.arc2 {
                width: 9.95px;
                height: 3.63px;
                left: 2.66px;
                top: 1.11px;
              }
              &.arc3 {
                width: 4.63px;
                height: 3.37px;
                left: 5.32px;
                top: 1.37px;
              }
            }
          }

          .battery {
            position: relative;
            width: 24.33px;
            height: 11.33px;

            .battery-body {
              position: absolute;
              width: 22px;
              height: 11.33px;
              right: 2.33px;
              top: 0;
              border: 1px solid #000000;
              border-radius: 2.67px;
              opacity: 0.35;
            }

            .battery-tip {
              position: absolute;
              width: 1.33px;
              height: 4px;
              right: 0;
              top: 3.67px;
              background: #000000;
              opacity: 0.4;
            }

            .battery-level {
              position: absolute;
              width: 18px;
              height: 7.33px;
              right: 4.33px;
              top: 2px;
              background: #000000;
              border-radius: 1.33px;
            }
          }
        }
      }
    }
  }

  // 顶部导航栏背景渐变
  .header {
    position: fixed;
    width: 100%;
    height: 130px;
    left: 0;
    top: 0;
    background: linear-gradient(180deg, rgba(254, 141, 0, 0.2) 0%, rgba(254, 141, 1, 0) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 44px;
    z-index: 999;

    .back-section {
      position: absolute;
      left: 13px;
      top: 51px;
      display: flex;
      align-items: center;
      cursor: pointer;

      .back-arrow {
        width: 7px;
        height: 13px;
        border: 1.5px solid #4D4D4D;
        border-right: none;
        border-top: none;
        transform: rotate(45deg);
        margin-right: 8px;
      }

      .back-text {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 25px;
        color: #4D4D4D;
      }
    }

    .page-title {
      position: absolute;
      width: 72px;
      height: 25px;
      left: calc(50% - 72px/2 - 3.5px);
      top: 52px;
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 18px;
      line-height: 25px;
      color: #000000;
      text-align: center;
    }
  }

  // 推送通知提示栏
  .notification-bar {
    position: fixed;
    width: 100%;
    height: 43px;
    left: 0;
    top: 98px;
    background: rgba(255, 206, 144, 0.3);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    z-index: 998;

    .notification-left {
      display: flex;
      align-items: center;

      .notification-close {
        width: 10px;
        height: 22px;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 22px;
        color: #808080;
        margin-right: 14px;
        cursor: pointer;
      }

      .notification-text {
        width: 225px;
        height: 21px;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 15px;
        line-height: 21px;
        color: #808080;
      }
    }

    .notification-btn {
      width: 74px;
      height: 30px;
      background: #FE8D00;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 22px;
      text-align: center;
      color: #FFFFFF;
    }
  }

  // 消息列表
  .message-list {
    margin-top: 150px;
    padding: 0 12px;
    padding-bottom: 50px;

    .message-item {
      position: relative;
      width: 100%;
      min-height: 44px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      padding: 10px 0;

      &.service-notice {
        .avatar-container {
          position: relative;

          .service-avatar {
            width: 44px;
            height: 44px;
            background: #FF9B1F;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;

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
                background: linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%);
                box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.25);
                border-radius: 12.5px 12.5px 0px 0px;
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
            width: 12px;
            height: 12px;
            right: -3px;
            top: -3px;
            background: #FB5B17;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;

            text {
              font-family: 'PingFang SC';
              font-style: normal;
              font-weight: 400;
              font-size: 10px;
              line-height: 14px;
              color: #FFFFFF;
            }
          }
        }
      }

      .avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        margin-right: 11px;
      }

      .message-content {
        flex: 1;
        overflow: hidden;

        .message-title {
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 400;
          font-size: 16px;
          line-height: 22px;
          color: #1A1A1A;
          margin-bottom: 5px;
        }

        .message-preview {
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 400;
          font-size: 13px;
          line-height: 18px;
          color: #808080;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .message-time {
        position: absolute;
        right: 0;
        top: 14px;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 17px;
        color: #808080;
      }
    }
  }

  // 底部Home指示器
  .home-indicator {
    position: fixed;
    width: 100%;
    height: 32px;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.1);
    opacity: 0.9;

    &::after {
      content: '';
      position: absolute;
      width: 134px;
      height: 5px;
      left: calc(50% - 67px);
      top: calc(50% - 2.5px);
      background: #000000;
      border-radius: 2.5px;
    }
  }
}
</style>