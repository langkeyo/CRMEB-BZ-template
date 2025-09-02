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
          <view class="bottom-row">
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
  padding: 30rpx 22rpx 40rpx 30rpx;
  margin-top: 20rpx;
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
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.05);
}

.product-image {
  width: 330rpx;
  height: 360rpx; /* 增加图片高度 */
  background-color: #f5f5f5;
  border-radius: 12rpx 12rpx 0 0;
  object-fit: cover; /* 确保图片填满区域 */
}

.product-info {
  padding: 12rpx 16rpx; /* 减少上下内边距 */
  background-color: #fff;
  border-radius: 0 0 12rpx 12rpx;
  height: 120rpx; /* 减少文字区域高度 */
  position: relative;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-title {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 28rpx;
  color: #1A1A1A;
  line-height: 1.3; /* 稍微减少行高 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  margin-bottom: 6rpx; /* 减少底部间距 */
  position: relative;
  top: 8rpx;
  left: 0;
}

.bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: auto; /* 确保底部行始终在底部 */
  margin-bottom: 4rpx;
}

.price-container {
  display: flex;
  align-items: baseline;
  max-width: 200rpx; /* 增加最大宽度 */
  overflow: hidden;
  position: relative;
  bottom: 0;
  left: 0;
}

.price-symbol {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 26rpx; /* 稍微减小字体 */
  color: #FF5B35;
  line-height: 34rpx; /* 减小行高 */
  flex-shrink: 0;
}

.product-price {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 500;
  font-size: 26rpx; /* 稍微减小字体 */
  color: #FF5B35;
  margin-right: 6rpx; /* 减小右侧间距 */
  line-height: 34rpx; /* 减小行高 */
  max-width: 100rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.price-label {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 20rpx; /* 再减小字体 */
  color: #FF5B35;
  line-height: 28rpx; /* 减小行高 */
  flex-shrink: 0;
}

.sales-count {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 22rpx; /* 减小字体 */
  color: #B3B3B3;
  line-height: 28rpx; /* 减小行高 */
  position: relative;
  bottom: 0;
  right: 0;
}
</style>
