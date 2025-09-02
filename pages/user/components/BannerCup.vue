<template>
  <view class="banner-cup-section">
    <swiper class="banner-swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500" indicator-active-color="#FF840B" indicator-color="rgba(255, 132, 11, 0.3)">
      <swiper-item v-for="(product, index) in products" :key="index" @click="onProductClick(product)">
        <view class="swiper-product-item">
          <image class="banner-cup-image" :src="product.image" mode="aspectFill" />
          <view class="product-info">
            <text class="product-title">{{ product.title }}</text>
            <view class="price-tag">
              <text class="price-symbol">￥</text>
              <text class="product-price">{{ product.price }}</text>
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import { getGoodsList } from '@/api/group.js'
import { HTTP_REQUEST_URL } from '@/config/app.js'

export default {
  name: 'BannerCup',
  props: {
    bannerImage: {
      type: String,
      default: '/static/images/user/banner.png'
    }
  },
  data() {
    return {
      products: []
    }
  },
  mounted() {
    this.loadRecommendedProducts()
  },
  methods: {
    // 加载推荐商品
    loadRecommendedProducts() {
      // 从API获取推荐商品数据
      getGoodsList({
        is_recommend: '1',
        limit: 3
      }).then(res => {
        if (res.status === 200 && res.data && res.data.goodsList) {
          // 处理推荐商品数据
          this.products = res.data.goodsList.map(item => {
            return {
              id: item.id,
              title: item.title,
              price: item.min_price,
              image: this.formatImage(item.image)
            };
          }).slice(0, 3); // 只显示前3个商品
        }
      }).catch(err => {
        console.error('获取推荐商品失败:', err);
        // 加载失败时使用默认数据
        this.products = [
          {
            id: 1,
            title: '有机蔬菜套餐',
            price: '88',
            image: '/static/images/user/banner_cup.png'
          },
          {
            id: 2,
            title: '新鲜水果礼盒',
            price: '128',
            image: '/static/images/user/featured_product1.png'
          },
          {
            id: 3,
            title: '精选坚果零食',
            price: '99',
            image: '/static/images/user/featured_product2.png'
          }
        ];
      });
    },
    
    // 格式化图片URL
    formatImage(url) {
      if (!url) return '/static/images/user/banner_cup.png';
      if (url.startsWith('http')) return url;
      return HTTP_REQUEST_URL + url;
    },
    
    onProductClick(product) {
      this.$emit('banner-click', product);
      // 跳转到商品详情页，添加type=category参数确保调用接口
      uni.navigateTo({
        url: `/pages/goods_details/index?id=${product.id}&type=category`
      });
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

.swiper-product-item {
  position: relative;
  width: 100%;
  height: 100%;
}

.banner-cup-image {
  width: 100%;
  height: 228rpx; /* 114px * 2 */
  display: block;
  border-radius: 8rpx;
}

.product-info {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  padding: 16rpx;
  box-sizing: border-box;
}

.product-title {
  color: #FFFFFF;
  font-size: 28rpx;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  margin-bottom: 4rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.price-tag {
  display: flex;
  align-items: baseline;
}

.price-symbol {
  color: #FFFFFF;
  font-size: 22rpx;
  margin-right: 2rpx;
}

.product-price {
  color: #FFFFFF;
  font-size: 26rpx;
  font-weight: bold;
}
</style>
