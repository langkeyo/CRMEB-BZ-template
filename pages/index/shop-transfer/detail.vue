<template>
  <view class="shop-detail">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-back" @click="goBack">
        <text class="iconfont icon-arrow-left"></text>
      </view>
      <view class="nav-title">商铺详情</view>
      <view class="nav-right"></view>
    </view>
    
    <!-- 商铺图片轮播 -->
    <swiper class="shop-swiper" indicator-dots circular autoplay indicator-color="rgba(255,255,255,0.6)" indicator-active-color="#FFFFFF">
      <swiper-item v-for="(img, index) in shopInfo.images" :key="index">
        <image :src="img" mode="aspectFill" class="swiper-img"></image>
      </swiper-item>
    </swiper>
    
    <!-- 商铺基本信息 -->
    <view class="shop-info">
      <view class="shop-title">{{ shopInfo.title }}</view>
      <view class="shop-location">
        <text class="iconfont icon-location"></text>
        <text>{{ shopInfo.address }}</text>
        <text class="distance">距离地铁站约{{ shopInfo.distance }}</text>
      </view>
      
      <!-- 价格信息 -->
      <view class="price-info">
        <view class="price-item">
          <view class="price-value">{{ shopInfo.monthlyRent }}</view>
          <view class="price-label">月租</view>
        </view>
        <view class="price-item">
          <view class="price-value">{{ shopInfo.transferFee }}</view>
          <view class="price-label">转让费</view>
        </view>
        <view class="price-item">
          <view class="price-value">{{ shopInfo.leaseTime }}</view>
          <view class="price-label">租期</view>
        </view>
        <view class="price-item">
          <view class="price-value">{{ shopInfo.area }}</view>
          <view class="price-label">面积</view>
        </view>
      </view>
      
      <!-- 商铺类型标签 -->
      <view class="shop-type-info">
        <view class="type-row">
          <view class="type-label">租赁类型：</view>
          <view class="type-value">{{ shopInfo.leaseType }}</view>
        </view>
        <view class="type-row">
          <view class="type-label">商铺类型：</view>
          <view class="type-value">{{ shopInfo.shopType }}</view>
        </view>
        <view class="type-row">
          <view class="type-label">经营状态：</view>
          <view class="type-value">{{ shopInfo.operationStatus }}</view>
        </view>
      </view>
      
      <!-- 标签列表 -->
      <view class="tag-list">
        <view class="tag-item" v-for="(tag, index) in shopInfo.tags" :key="index">{{ tag }}</view>
      </view>
    </view>
    
    <!-- 店内设备 -->
    <view class="shop-section">
      <view class="section-header">
        <view class="section-title">店内设备</view>
        <view class="section-more" @click="viewMoreEquipments">查看全部</view>
      </view>
      <view class="equipment-list">
        <view class="equipment-item" v-for="(item, index) in shopInfo.equipments" :key="index" @click="previewImage(item.image)">
          <image :src="item.image" mode="aspectFill" class="equipment-image"></image>
          <view class="equipment-name">{{ item.name }}</view>
        </view>
      </view>
      <view class="dot-indicator">
        <view class="dot active"></view>
        <view class="dot"></view>
        <view class="dot"></view>
      </view>
    </view>
    
    <!-- 周边环境 -->
    <view class="shop-section">
      <view class="section-header">
        <view class="section-title">周边环境</view>
        <view class="section-more" @click="viewMoreEnvironment">查看全部</view>
      </view>
      <view class="environment-list">
        <view class="environment-item" v-for="(item, index) in shopInfo.environment" :key="index" @click="playVideo(item)">
          <image :src="item.cover" mode="aspectFill" class="environment-image"></image>
          <view class="play-icon" v-if="item.type === 'video'"><text class="iconfont icon-play"></text></view>
        </view>
      </view>
      <view class="dot-indicator">
        <view class="dot active"></view>
        <view class="dot"></view>
        <view class="dot"></view>
      </view>
    </view>
    
    <!-- 同商圈店铺 -->
    <view class="shop-section">
      <view class="section-header">
        <view class="section-title">同商圈店铺</view>
        <view class="section-more" @click="viewMoreShops">查看更多</view>
      </view>
      <view class="similar-shops">
        <view class="similar-shop-item" v-for="(item, index) in shopInfo.similarShops" :key="index" @click="viewShopDetail(item.id)">
          <image :src="item.image" mode="aspectFill" class="similar-shop-image"></image>
          <view class="similar-shop-name">{{ item.name }}</view>
          <view class="similar-shop-info">
            <text>{{ item.brand }}</text>
            <text class="shop-divider">|</text>
            <text>{{ item.location }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部联系按钮 -->
    <view class="contact-bar">
      <view class="contact-btn collect" @click="toggleCollect">
        <text>预约看房</text>
      </view>
      <view class="contact-btn consult" @click="makePhoneCall">
        <text>在线咨询</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      shopId: null,
      isCollected: false,
      shopInfo: {
        title: '北京朝阳区三里屯3.3大厦店',
        address: '距离地铁三里屯站约500m',
        distance: '500m',
        images: [
          '/static/images/index/business-info/shop_transfer_bg.jpg',
          '/static/images/index/business-info/shop_transfer_bg.jpg',
          '/static/images/index/business-info/shop_transfer_bg.jpg'
        ],
        monthlyRent: '1.5万/月',
        transferFee: '20万',
        leaseTime: '1个月',
        area: '150㎡',
        leaseType: '商铺转让',
        shopType: '品牌咖啡',
        operationStatus: '营业中',
        tags: ['临街铺面', '带设备', '人流早餐', '咖啡茶饮', '餐饮美食'],
        
        // 店内设备
        equipments: [
          {
            name: '咖啡厅',
            image: '/static/images/index/business-info/equipment1.jpg'
          },
          {
            name: '咖啡机',
            image: '/static/images/index/business-info/equipment2.jpg'
          }
        ],
        
        // 周边环境
        environment: [
          {
            type: 'video',
            cover: '/static/images/index/business-info/environment1.jpg',
            url: 'https://example.com/video1.mp4'
          },
          {
            type: 'image',
            cover: '/static/images/index/business-info/environment2.jpg'
          },
          {
            type: 'image',
            cover: '/static/images/index/business-info/environment3.jpg'
          }
        ],
        
        // 同商圈店铺
        similarShops: [
          {
            id: 1,
            name: '肯德基',
            brand: '炸鸡 三里屯',
            location: '朝阳',
            image: '/static/images/index/business-info/shop1.jpg'
          },
          {
            id: 2,
            name: '雪雪冰城',
            brand: '咖啡 三里屯',
            location: '朝阳',
            image: '/static/images/index/business-info/shop2.jpg'
          }
        ],
        
        contactPhone: '13800138000'
      }
    }
  },
  onLoad(options) {
    if (options.id) {
      this.shopId = options.id;
      // 这里应该根据ID从后端获取商铺详情
      // this.getShopDetail(this.shopId);
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    getShopDetail(id) {
      // 模拟从后端获取数据
      // uni.request({
      //   url: 'api/shop/detail',
      //   data: { id },
      //   success: (res) => {
      //     this.shopInfo = res.data;
      //   }
      // });
    },
    // 查看更多店内设备
    viewMoreEquipments() {
      uni.navigateTo({
        url: `/pages/index/shop-transfer/equipment?id=${this.shopId}`
      });
    },
    // 查看更多周边环境
    viewMoreEnvironment() {
      uni.navigateTo({
        url: `/pages/index/shop-transfer/environment?id=${this.shopId}`
      });
    },
    // 查看更多同商圈店铺
    viewMoreShops() {
      uni.navigateTo({
        url: `/pages/index/shop-transfer/similar-shops?id=${this.shopId}`
      });
    },
    // 预览图片
    previewImage(url) {
      uni.previewImage({
        urls: [url],
        current: url
      });
    },
    // 播放视频
    playVideo(item) {
      if (item.type === 'video') {
        // 播放视频
        uni.navigateTo({
          url: `/pages/index/shop-transfer/video-player?url=${encodeURIComponent(item.url)}`
        });
      } else {
        // 预览图片
        this.previewImage(item.cover);
      }
    },
    // 查看店铺详情
    viewShopDetail(id) {
      uni.navigateTo({
        url: `/pages/index/shop-transfer/detail?id=${id}`
      });
    },
    // 收藏/预约看房
    toggleCollect() {
      uni.showToast({
        title: '预约成功，商家将尽快联系您',
        icon: 'none'
      });
    },
    // 联系商家/在线咨询
    makePhoneCall() {
      uni.navigateTo({
        url: '/pages/users/online_chat/index'
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.shop-detail {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 120rpx;
}

/* 导航栏样式 */
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  background-color: transparent;
  padding: 0 30rpx;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  
  .nav-back {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    
    .iconfont {
      font-size: 36rpx;
      color: #FFFFFF;
    }
  }
  
  .nav-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #FFFFFF;
  }
  
  .nav-right {
    width: 60rpx;
  }
}

/* 商铺图片轮播 */
.shop-swiper {
  width: 100%;
  height: 500rpx;
  
  .swiper-img {
    width: 100%;
    height: 100%;
  }
}

/* 商铺基本信息 */
.shop-info {
  background-color: #FFFFFF;
  padding: 30rpx;
  margin-bottom: 20rpx;
  
  .shop-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333333;
    margin-bottom: 16rpx;
  }
  
  .shop-location {
    display: flex;
    align-items: center;
    font-size: 28rpx;
    color: #666666;
    margin-bottom: 30rpx;
    flex-wrap: wrap;
    
    .iconfont {
      font-size: 28rpx;
      margin-right: 8rpx;
      color: #999999;
    }
    
    .distance {
      margin-left: 20rpx;
      color: #999999;
    }
  }
  
  /* 价格信息 */
  .price-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30rpx;
    
    .price-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .price-value {
        font-size: 32rpx;
        color: #FF5722;
        font-weight: 500;
        margin-bottom: 8rpx;
      }
      
      .price-label {
        font-size: 24rpx;
        color: #999999;
      }
    }
  }
  
  /* 商铺类型信息 */
  .shop-type-info {
    margin-bottom: 30rpx;
    
    .type-row {
      display: flex;
      margin-bottom: 10rpx;
      
      .type-label {
        font-size: 28rpx;
        color: #999999;
        width: 160rpx;
      }
      
      .type-value {
        font-size: 28rpx;
        color: #333333;
        flex: 1;
      }
    }
  }
  
  /* 标签列表 */
  .tag-list {
    display: flex;
    flex-wrap: wrap;
    
    .tag-item {
      font-size: 24rpx;
      color: #666666;
      background-color: #F5F5F5;
      padding: 6rpx 20rpx;
      border-radius: 6rpx;
      margin-right: 16rpx;
      margin-bottom: 16rpx;
    }
  }
}

/* 店内设备、周边环境、同商圈店铺公共样式 */
.shop-section {
  background-color: #FFFFFF;
  padding: 30rpx;
  margin-bottom: 20rpx;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
      position: relative;
      padding-left: 20rpx;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 6rpx;
        height: 30rpx;
        background-color: #FF5722;
        border-radius: 3rpx;
      }
    }
    
    .section-more {
      font-size: 26rpx;
      color: #999999;
    }
  }
  
  /* 店内设备 */
  .equipment-list {
    display: flex;
    overflow-x: auto;
    margin-bottom: 20rpx;
    
    .equipment-item {
      margin-right: 20rpx;
      width: 240rpx;
      flex-shrink: 0;
      
      .equipment-image {
        width: 240rpx;
        height: 180rpx;
        border-radius: 8rpx;
        margin-bottom: 10rpx;
      }
      
      .equipment-name {
        font-size: 26rpx;
        color: #333333;
        text-align: center;
      }
    }
  }
  
  /* 周边环境 */
  .environment-list {
    display: flex;
    overflow-x: auto;
    margin-bottom: 20rpx;
    
    .environment-item {
      margin-right: 20rpx;
      width: 240rpx;
      height: 180rpx;
      position: relative;
      flex-shrink: 0;
      
      .environment-image {
        width: 100%;
        height: 100%;
        border-radius: 8rpx;
      }
      
      .play-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60rpx;
        height: 60rpx;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        
        .iconfont {
          font-size: 30rpx;
          color: #FFFFFF;
        }
      }
    }
  }
  
  /* 同商圈店铺 */
  .similar-shops {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    
    .similar-shop-item {
      width: 48%;
      margin-bottom: 20rpx;
      
      .similar-shop-image {
        width: 100%;
        height: 180rpx;
        border-radius: 8rpx;
        margin-bottom: 10rpx;
      }
      
      .similar-shop-name {
        font-size: 28rpx;
        color: #333333;
        margin-bottom: 6rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .similar-shop-info {
        font-size: 24rpx;
        color: #999999;
        
        .shop-divider {
          margin: 0 10rpx;
        }
      }
    }
  }
  
  /* 分页指示器 */
  .dot-indicator {
    display: flex;
    justify-content: center;
    align-items: center;
    
    .dot {
      width: 16rpx;
      height: 16rpx;
      border-radius: 50%;
      background-color: #DDDDDD;
      margin: 0 8rpx;
      
      &.active {
        background-color: #FF5722;
      }
    }
  }
}

/* 底部联系按钮 */
.contact-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 110rpx;
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  
  .contact-btn {
    flex: 1;
    height: 80rpx;
    border-radius: 40rpx;
    font-size: 30rpx;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 10rpx;
    
    &.collect {
      background-color: #FFF4E8;
      color: #FF5722;
      border: 2rpx solid #FF5722;
    }
    
    &.consult {
      background-color: #FF5722;
      color: #FFFFFF;
    }
  }
}
</style>
