<template>
  <view class="coupon-goods-page">
    <!-- 顶部搜索栏 -->
    <view class="search-bar">
      <view class="back-btn" @click="goBack"></view>
      <input class="search-input" placeholder="搜索你想要的商品" v-model="search" />
      <image class="search-icon" src="/static/icons/search.svg" />
    </view>
    <!-- 优惠券信息 -->
    <view class="coupon-info">
      <view class="coupon-title">
        以下商品即可享用<text class="highlight">优惠券</text>
      </view>
      <view class="coupon-date">有效时间{{couponStart}}-{{couponEnd}}</view>
    </view>
    <!-- 商品列表 -->
    <view class="goods-list">
      <view class="goods-item" v-for="(item, idx) in goods" :key="item.id">
        <image class="goods-img" :src="item.img" mode="aspectFill" />
        <view class="goods-info">
          <view class="goods-name">{{item.name}}</view>
          <view class="goods-meta">
            <text class="goods-price">￥{{item.price}}</text>
            <text class="goods-sale">已售{{item.sale}}{{item.unit}}</text>
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
      search: '',
      couponStart: '2025-04-01',
      couponEnd: '2025-04-30',
      goods: [
        { id: 1, img: '/static/images/goods1.png', name: '瑞幸咖啡5选1', price: '12.5', sale: '99+', unit: '单' },
        { id: 2, img: '/static/images/goods2.png', name: '精美黄金烤鸡翅', price: '22', sale: '99+', unit: '份' },
        { id: 3, img: '/static/images/goods3.png', name: '巧克力曲奇饼干', price: '25', sale: '99+', unit: '单' },
        { id: 4, img: '/static/images/goods4.png', name: '鸡蛋培根三明治', price: '18', sale: '99+', unit: '份' },
        { id: 5, img: '/static/images/goods1.png', name: '瑞幸咖啡5选1', price: '12.5', sale: '99+', unit: '单' },
        { id: 6, img: '/static/images/goods2.png', name: '精美黄金烤鸡翅', price: '22', sale: '99+', unit: '份' },
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
.coupon-goods-page {
  min-height: 100vh;
  background: #F7F7F7;
  padding-bottom: 32rpx;
}
.search-bar {
  display: flex;
  align-items: center;
  background: #fff;
  height: 88rpx;
  padding: 0 24rpx;
  border-bottom: 1rpx solid #f0f0f0;
  .back-btn {
    width: 40rpx;
    height: 40rpx;
    border-left: 3rpx solid #333;
    border-bottom: 3rpx solid #333;
    transform: rotate(45deg);
    margin-right: 16rpx;
  }
  .search-input {
    flex: 1;
    height: 56rpx;
    border: none;
    background: #F8F8F8;
    border-radius: 16rpx;
    padding: 0 24rpx;
    font-size: 28rpx;
    color: #333;
    outline: none;
  }
  .search-icon {
    width: 32rpx;
    height: 32rpx;
    margin-left: 12rpx;
  }
}
.coupon-info {
  background: #fff;
  border-radius: 8rpx;
  margin: 24rpx 24rpx 0 24rpx;
  padding: 24rpx 24rpx 12rpx 24rpx;
  .coupon-title {
    font-size: 30rpx;
    color: #000;
    .highlight {
      color: #FF7A00;
    }
  }
  .coupon-date {
    font-size: 26rpx;
    color: #999;
    margin-top: 8rpx;
  }
}
.goods-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx 12rpx;
  margin: 24rpx 12rpx 0 12rpx;
}
.goods-item {
  background: #fff;
  border-radius: 4rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
}
.goods-img {
  width: 100%;
  height: 180rpx;
  object-fit: cover;
  border-radius: 4rpx 4rpx 0 0;
}
.goods-info {
  padding: 16rpx 12rpx 12rpx 12rpx;
}
.goods-name {
  font-size: 28rpx;
  color: #1A1A1A;
  margin-bottom: 8rpx;
  font-weight: 400;
}
.goods-meta {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #333;
  .goods-price {
    font-weight: bold;
    margin-right: 16rpx;
  }
  .goods-sale {
    color: #999;
    font-size: 22rpx;
  }
}
</style> 