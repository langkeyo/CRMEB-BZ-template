<template>
  <view class="promo-banner-container">
    <view class="promo-banner">
      <!-- 添加浪条背景图 -->
      <image class="wave-strip-bg" src="/static/images/user/eclipse-strip.png" mode="aspectFill" />
      
      <view class="promo-banner-content">
        <image class="promo-icon" src="/static/icons/thumb_up_icon.svg" />
        <view class="promo-text">
          <text class="promo-title">{{ title }}</text>
          <text class="promo-subtitle">{{ subtitle }}</text>
        </view>
      </view>
      <button class="promo-button" @click="onButtonClick">{{ buttonText }}</button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'PromoBanner',
  props: {
    title: {
      type: String,
      default: '点赞+评论'
    },
    subtitle: {
      type: String,
      default: '点赞+评论可享更多优惠快去看看吧！'
    },
    buttonText: {
      type: String,
      default: '立即评论'
    }
  },
  methods: {
    onButtonClick () {
      this.$emit('button-click')
    }
  }
}
</script>

<style lang="scss" scoped>
.promo-banner-container {
  padding: 0 22rpx 0 30rpx;
  margin-top: 20rpx;
  position: relative;
  z-index: 1;
}

.promo-banner {
  background: linear-gradient(to right, #232A43, #494E65);
  border-radius: 20rpx;
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  position: relative;
  overflow: hidden;
  height: 148rpx; /* 74px * 2 */
}

/* 浪条背景图 */
.wave-strip-bg {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 60%;
  z-index: 1;
}

.promo-banner-content {
  display: flex;
  align-items: center;
  z-index: 2;
}

.promo-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 16rpx;
}

.promo-text {
  display: flex;
  flex-direction: column;
}

.promo-title {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 32rpx;
  line-height: 45rpx;
  color: #FFFFFF;
}

.promo-subtitle {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 20rpx;
  line-height: 27rpx;
  color: #E5E5E5;
  margin-top: 8rpx;
}

.promo-button {
  background-color: #FFFFFF;
  color: #30374F;
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 25rpx;
  line-height: 36rpx;
  padding: 20rpx 40rpx;
  border-radius: 30rpx;
  border: none;
  height: auto;
  line-height: normal;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

button::after {
  border: none;
}
</style>
