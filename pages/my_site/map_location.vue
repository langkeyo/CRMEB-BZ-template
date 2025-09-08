<template>
  <view class="map-location-page">
    <view class="custom-header">
      <view class="back-btn" @click="goBack"></view>
      <view class="header-title">站点位置</view>
    </view>
    <view class="map-container">
      <map
        class="location-map"
        :latitude="latitude"
        :longitude="longitude"
        :markers="markers"
        :scale="16"
        show-location
        @markertap="onMarkerTap"
      ></map>
    </view>
    <view class="location-info">
      <view class="location-name">{{ locationName }}</view>
      <view class="location-address">{{ locationAddress }}</view>
      <view class="location-distance">距离 {{ distance }}m</view>
      <view class="navigation-button" @click="openNavigation">导航</view>
      <view class="search-button" @click="searchLocation">搜索周边</view>
    </view>
  </view>
</template>

<script>
import tencentMapConfig from '@/config/tencent-map'

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
      }],
      mapKey: tencentMapConfig.MAP_KEY
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
    
    // 如果没有传入位置信息，则尝试获取当前位置
    if (!options.latitude || !options.longitude) {
      this.getCurrentLocation();
    }
  },
  methods: {
    // 获取当前位置
    getCurrentLocation() {
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          this.latitude = res.latitude;
          this.longitude = res.longitude;
          this.markers[0].latitude = res.latitude;
          this.markers[0].longitude = res.longitude;
          
          // 使用默认地址（暂时不使用腾讯地图API地址解析，避免签名问题）
          this.locationAddress = '当前位置';
          this.locationName = '当前位置';
        },
        fail: (err) => {
          console.error('获取位置失败:', err);
          // 使用默认地址
          this.locationAddress = '位置获取失败';
        }
      });
    },
    
    // 使用腾讯地图API获取地址信息 - 已禁用以避免网络请求问题
    getAddressByCoordinate(latitude, longitude) {
      // 为避免网络请求被阻止，使用默认位置信息
      this.locationAddress = '当前位置';
      this.locationName = '当前位置';
    },
    
    // 腾讯地图导航 - 已禁用以避免网络请求问题
    openNavigation() {
      // 使用微信小程序原生导航（不依赖腾讯地图API）
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
    
    // 搜索周边地点 - 已禁用以避免网络请求问题
    searchLocation() {
      uni.showToast({
        title: '搜索周边功能已禁用',
        icon: 'none'
      });
      // 原腾讯地图API搜索功能已禁用，避免网络请求问题
      console.warn('腾讯地图周边搜索功能已禁用');
    },
    
    // 标记点击事件
    onMarkerTap(e) {
      console.log('标记被点击:', e);
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
.map-container {
  width: 100%;
  height: calc(100vh - 220rpx);
  margin-top: 100rpx;
}
.location-map {
  width: 100%;
  height: 100%;
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
.search-button {
  width: 100%;
  height: 80rpx;
  background: #4A6BFE;
  color: #fff;
  font-size: 30rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 40rpx;
  box-shadow: 0 8rpx 24rpx rgba(74,107,254,0.10);
  margin-top: 16rpx;
}
</style> 