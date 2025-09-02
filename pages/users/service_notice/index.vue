<template>
  <view class="service-notice-page">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="back-section" @click="goBack">
        <view class="back-arrow"></view>
        <text class="back-text">返回</text>
      </view>
      <view class="page-title">通知</view>
    </view>
    <view class="page-content">
      <view class="notice-card">
        <view class="notice-title-row">
          <view class="notice-title">系统通知</view>
          <view class="notice-date">25/08/04</view>
        </view>
        <view class="notice-list">
          <view class="notice-item" v-for="(item, idx) in noticeList" :key="idx">
            <text>{{item}}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      noticeList: [
        '尊敬的用户您好：您邀请的好友已成果注册，我们将会进行后台审核，后台审核通过以后我们将会给您发放分享好友专属礼品请您耐心等待！',
        '尊敬的用户您好：您邀请的好友已成果注册，我们将会进行后台审核，后台审核通过以后我们将会给您发放分享好友专属礼品请您耐心等待！',
        '尊敬的用户您好：您邀请的好友已成果注册，我们将会进行后台审核，后台审核通过以后我们将会给您发放分享好友专属礼品请您耐心等待！'
      ]
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    }
  }
}
</script>

<style lang="scss" scoped>
.service-notice-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #F8F8F8;
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
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
  .page-content {
    padding-top: 66px;
    padding-bottom: 30px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    .notice-card {
      width: 92%;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      padding: 20px 18px 18px 18px;
      margin-top: 10px;
      .notice-title-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .notice-title {
          font-weight: bold;
          font-size: 16px;
        }
        .notice-date {
          color: #ababab;
          font-size: 13px;
        }
      }
      .notice-list {
        margin-top: 10px;
        .notice-item {
          background: #f7f7f7;
          border-radius: 6px;
          padding: 12px 10px;
          font-size: 15px;
          color: #333;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style> 