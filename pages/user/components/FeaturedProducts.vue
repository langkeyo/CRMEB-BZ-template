<template>
  <view class="featured-products-section">
    <view class="section-header">
      <text class="section-title">精选好物</text>
    </view>
    <view class="products-grid">
      <view 
        class="product-item" 
        v-for="(product, index) in products" 
        :key="index"
        @click="onProductClick(product)"
      >
        <image class="product-image" :src="product.image" mode="aspectFill" />
        <view class="product-info">
          <text class="product-title">{{ product.title }}</text>
          <view class="price-container">
            <text class="price-symbol">￥</text>
            <text class="product-price">{{ product.price }}</text>
            <text class="price-label">秒杀价</text>
          </view>
          <text class="sales-count">已售365单</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'FeaturedProducts',
  props: {
    products: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    onProductClick(product) {
      this.$emit('product-click', product);
    }
  }
}
</script>

<style lang="scss" scoped>
.featured-products-section {
background-color: #FFFFFF;
  padding: 30rpx 30rpx 40rpx 30rpx;
  box-sizing: border-box;
  width: 100%;
}

.section-header {
  margin-bottom: 20rpx;
}

.section-title {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 30rpx;
  line-height: 40rpx;
  color: #1A1A1A;
}

.products-grid {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
}

.product-item {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 330rpx;
  height: 480rpx;
  background-color: #FFFFFF;
  border-radius: 12rpx;
}

.product-image {
  width: 330rpx;
  height: 330rpx;
  background-color: #f5f5f5;
  border-radius: 12rpx 12rpx 0 0;
}

.product-info {
  padding: 0;
  background-color: #fff;
  border-radius: 0 0 12rpx 12rpx;
  height: 150rpx;
  position: relative;
  width: 100%;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.05);
}

.product-title {
  position: absolute;
  top: 20rpx;
  left: 16rpx;
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 32rpx;
  color: #1A1A1A;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 160rpx;
}

.price-container {
  position: absolute;
  bottom: 30rpx;
  left: 16rpx;
  display: flex;
  align-items: baseline;
}

.price-symbol {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
  line-height: 40rpx;
}

.product-price {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
  margin-right: 8rpx;
  line-height: 40rpx;
}

.price-label {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #333333;
  line-height: 34rpx;
}

.sales-count {
  position: absolute;
  bottom: 30rpx;
  right: 16rpx;
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #B3B3B3;
  line-height: 34rpx;
}
</style>
