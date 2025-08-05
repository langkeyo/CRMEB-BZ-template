<template>
  <view class="map-location-page">
    <view class="custom-header">
      <view class="back-btn" @click="goBack"></view>
      <view class="header-title">站点位置</view>
    </view>
    <map
      class="location-map"
      :latitude="latitude"
      :longitude="longitude"
      :markers="markers"
      :scale="16"
      show-location
    ></map>
    <view class="location-info">
      <view class="location-name">{{ locationName }}</view>
      <view class="location-address">{{ locationAddress }}</view>
      <view class="location-distance">距离 {{ distance }}m</view>
      <view class="navigation-button" @click="openNavigation">导航</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      latitude: 40.032866,
      longitude: 116.385768,
      locationName: '北京尚德井小区菜鸟驿站',
      locationAddress: '海淀区上地农大南路',
      distance: 100,
      markers: [{
        id: 1,
        latitude: 40.032866,
        longitude: 116.385768,
        iconPath: '/static/images/marker_icon.png',
        width: 30,
        height: 30
      }]
    };
  },
  onLoad(options) {
    if (options.name) {
      this.locationName = decodeURIComponent(options.name);
    }
    if (options.address) {
      this.locationAddress = decodeURIComponent(options.address);
    }
    if (options.latitude && options.longitude) {
      this.latitude = parseFloat(options.latitude);
      this.longitude = parseFloat(options.longitude);
      this.markers[0].latitude = this.latitude;
      this.markers[0].longitude = this.longitude;
    }
    if (options.distance) {
      this.distance = parseInt(options.distance);
    }
  },
  methods: {
    openNavigation() {
      uni.openLocation({
        latitude: this.latitude,
        longitude: this.longitude,
        name: this.locationName,
        address: this.locationAddress,
        success: function() {
          console.log('导航打开成功');
        }
      });
    },
    goBack() {
      uni.navigateBack();
    }
  }
};
</script>

<style lang="scss" scoped>
.map-location-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  background: #f5f5f5;
}
.custom-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  border-bottom: 1rpx solid #ededed;
  .back-btn {
    position: absolute;
    left: 24rpx;
    width: 40rpx;
    height: 40rpx;
    border-left: 4rpx solid #222;
    border-bottom: 4rpx solid #222;
    transform: rotate(45deg);
    top: 50%;
    margin-top: -20rpx;
    background: transparent;
  }
  .header-title {
    font-size: 36rpx;
    color: #222;
    font-weight: bold;
    text-align: center;
  }
}
.location-map {
  width: 100%;
  height: calc(100vh - 220rpx);
  margin-top: 100rpx;
}
.location-info {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  padding: 32rpx 32rpx 24rpx 32rpx;
  border-radius: 32rpx 32rpx 0 0;
  box-shadow: 0 -8rpx 32rpx rgba(0,0,0,0.10);
  z-index: 101;
}
.location-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #222;
  margin-bottom: 8rpx;
}
.location-address {
  font-size: 26rpx;
  color: #888;
  margin-bottom: 12rpx;
}
.location-distance {
  font-size: 24rpx;
  color: #ff840b;
  margin-bottom: 24rpx;
}
.navigation-button {
  width: 100%;
  height: 80rpx;
  background: #ff840b;
  color: #fff;
  font-size: 30rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 40rpx;
  box-shadow: 0 8rpx 24rpx rgba(255,132,11,0.10);
  margin-top: 8rpx;
}
</style> 