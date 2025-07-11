<template>
  <view class="promo-banner-container">
    <view class="promo-banner">
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
  padding: 0 40rpx;
  margin-top: 26rpx;
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

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 200rpx;
    height: 200rpx;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
    border-radius: 50%;
    transform: translate(50%, -50%);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 150rpx;
    height: 150rpx;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
    border-radius: 50%;
    transform: translate(-30%, 30%);
  }
}

.promo-banner-content {
  display: flex;
  align-items: center;
  z-index: 1;
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
  z-index: 1;
}

button::after {
  border: none;
}
</style>
