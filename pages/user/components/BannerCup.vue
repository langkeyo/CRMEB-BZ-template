<template>
  <view class="banner-cup-section">
    <swiper class="banner-swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500" indicator-active-color="#FF840B" indicator-color="rgba(255, 132, 11, 0.3)">
      <swiper-item>
        <image class="banner-cup-image" :src="bannerImage" mode="aspectFill" @click="onBannerClick" />
      </swiper-item>
      <!-- 可以添加更多轮播项 -->
    </swiper>
  </view>
</template>

<script>
export default {
  name: 'BannerCup',
  props: {
    bannerImage: {
      type: String,
      default: '/static/images/user/banner.png'
    }
  },
  methods: {
    onBannerClick() {
      this.$emit('banner-click');
    }
  }
}
</script>

<style lang="scss" scoped>
.banner-cup-section {
  margin: 20rpx 22rpx 20rpx 30rpx;
  border-radius: 8rpx;
  overflow: hidden;
  position: relative;
  z-index: 1;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  width: calc(100% - 52rpx);
}

.banner-swiper {
  width: 100%;
  height: 228rpx; /* 114px * 2 */
}

.banner-cup-image {
  width: 100%;
  height: 228rpx; /* 114px * 2 */
  display: block;
  border-radius: 8rpx;
}
</style>
