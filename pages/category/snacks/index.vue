<template>
  <view class="snacks-category-page">
    <!-- 状态栏 -->
    <view class="status-bar" :style="'height:' + statusBarHeight + 'px'"></view>
    
    <!-- 搜索区域 -->
    <view class="search-box">
      <view class="search-input">
        <text class="search-icon iconfont icon-search"></text>
        <input type="text" v-model="keyword" placeholder="芒果" confirm-type="search" @confirm="search" />
      </view>
    </view>
    
    <!-- 主要内容区 -->
    <view class="main-content">
      <!-- 左侧分类导航 -->
      <scroll-view class="category-nav" scroll-y>
        <view 
          v-for="(item, index) in categories" 
          :key="index"
          class="nav-item"
          :class="{active: currentCategoryIndex === index}"
          @tap="selectCategory(index)"
        >
          <text>{{item.name}}</text>
        </view>
      </scroll-view>
      
      <!-- 右侧内容区 -->
      <scroll-view class="content-area" scroll-y>
        <!-- 百草味坚果区域 -->
        <view class="baicao-nuts-card">
          <view class="baicao-text-content">
            <text class="baicao-title">百草味坚果</text>
            <text class="baicao-subtitle">一盒15包随机...</text>
            <view class="baicao-view-btn">
              <text class="baicao-view-text">立即查看</text>
            </view>
          </view>
          <image src="/static/images/category/baicao_nuts.png" class="baicao-image" mode="aspectFit"></image>
        </view>
        
        <!-- 子分类标签栏 -->
        <view class="series-tabs">
          <view 
            v-for="(item, index) in subCategories" 
            :key="index"
            class="series-tab-item"
            :class="{active: currentSubCategoryIndex === index}"
            @tap="selectSubCategory(index)"
          >
            {{item.name}}
          </view>
        </view>
        
        <!-- 商品列表 -->
        <view class="product-list">
          <view 
            v-for="(item, index) in snackProducts" 
            :key="index"
            class="product-card"
            @tap="viewProduct(item)"
          >
            <image :src="item.image" mode="aspectFill" class="product-image"></image>
            <view class="product-info">
              <text class="product-title">{{item.name}}</text>
              <text v-if="item.rating" class="product-rating">{{item.rating ? '好评' + item.rating : ''}}</text>
              <text v-if="item.replies" class="product-replies">{{item.replies}}</text>
              <text class="product-price">¥{{item.price}}元</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    
    <!-- 底部导航栏 -->
    <customTabbar></customTabbar>
  </view>
</template>

<script>
import customTabbar from '@/components/customTabbar/index.vue';
export default {
  components: {
    customTabbar
  },
  data() {
    return {
      statusBarHeight: 20, // 默认状态栏高度，会在onLoad中获取真实值
      keyword: '',
      currentCategoryIndex: 7, // 默认选中休闲零食
      currentSubCategoryIndex: 0, // 当前选中的子分类索引
      categories: [
        { name: '热门分类', id: 'hot' },
        { name: '水果', id: 'fruit' },
        { name: '蔬菜', id: 'vegetable' },
        { name: '禽畜肉类', id: 'meat' },
        { name: '中药材', id: 'medicine' },
        { name: '油粮作物', id: 'oil' },
        { name: '海鲜', id: 'seafood' },
        { name: '休闲零食', id: 'snacks' },
        { name: '粮食谷物', id: 'grain' },
        { name: '经济作物', id: 'economic' },
        { name: '干果坚果', id: 'nuts' },
        { name: '茶叶', id: 'tea' }
      ],
      subCategories: [
        { name: '薯片系列', id: 'chips' },
        { name: '糖果系列', id: 'candy' },
        { name: '饼干系列', id: 'biscuit' },
        { name: '烤条系列', id: 'sticks' }
      ],
      snackProducts: [
        { 
          id: 1, 
          name: '乐事薯片（黄瓜味）', 
          price: '5.00',
          rating: '99.8%',
          image: '/static/images/category/snacks/snack_chips1.png'
        },
        { 
          id: 2, 
          name: '乐事薯片（龙虾味）', 
          price: '5.00',
          rating: '99.8%',
          replies: '5个回答',
          image: '/static/images/category/snacks/snack_chips2.png'
        },
        { 
          id: 3, 
          name: 'Doritos薯片（麻辣味）', 
          price: '10.00',
          rating: '98.5%',
          image: '/static/images/category/snacks/snack_chips3.png'
        },
        { 
          id: 4, 
          name: '可比克薯片（烧烤味）', 
          price: '6.00',
          rating: '99.2%',
          image: '/static/images/category/snacks/snack_chips4.png'
        },
        { 
          id: 5, 
          name: 'FINUT趣莱福（海鲜味）', 
          price: '12.00',
          rating: '97.6%',
          image: '/static/images/category/snacks/snack_chips5.png'
        },
        { 
          id: 6, 
          name: '上好佳虾片（原味）', 
          price: '5.00',
          rating: '99.5%',
          image: '/static/images/category/snacks/snack_chips6.png'
        }
      ]
    }
  },
  onLoad() {
    // 获取状态栏高度
    this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
  },
  methods: {
    // 搜索商品
    search() {
      uni.showToast({
        title: '搜索功能开发中',
        icon: 'none'
      });
    },
    
    // 选择分类
    selectCategory(index) {
      this.currentCategoryIndex = index;
      const category = this.categories[index];
      
      if (category.id !== 'snacks') {
        uni.showToast({
          title: `${category.name}分类开发中`,
          icon: 'none'
        });
      }
    },
    
    // 选择子分类
    selectSubCategory(index) {
      this.currentSubCategoryIndex = index;
      // 这里可以加载对应子分类的商品
      uni.showToast({
        title: `已选择${this.subCategories[index].name}`,
        icon: 'none'
      });
    },
    // 查看商品详情
    viewProduct(item) {
      uni.navigateTo({
        url: `/pages/goods_details/index?id=${item.id}`
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.snacks-category-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #FFFFFF;
}

.status-bar {
  width: 100%;
  background-color: #FFFFFF;
}

.search-box {
  padding: 10rpx 30rpx;
  background-color: #FFFFFF;
}

.search-input {
  display: flex;
  align-items: center;
  background-color: #F5F5F5;
  border-radius: 40rpx;
  padding: 10rpx 20rpx;
  height: 70rpx;
}

.search-icon {
  font-size: 32rpx;
  color: #999999;
  margin-right: 10rpx;
}

.search-input input {
  flex: 1;
  height: 100%;
  font-size: 28rpx;
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.category-nav {
  width: 160rpx;
  background-color: #F7F7F7;
  height: 100%;
}

.nav-item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100rpx;
  font-size: 26rpx;
  color: #333333;
  position: relative;
  text-align: center;
  padding: 0 10rpx;
}

.nav-item.active {
  background-color: #FFFFFF;
  color: #FF840B;
  font-weight: 500;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 30rpx;
  width: 6rpx;
  height: 40rpx;
  background-color: #FF840B;
}

.content-area {
  flex: 1;
  background-color: #FFFFFF;
  padding: 0 20rpx;
  height: 100%;
}

/* 百草味坚果卡片样式 */
.baicao-nuts-card {
  width: 514rpx; /* 257px * 2 */
  height: 144rpx; /* 72px * 2 */
  background-color: #FFFFFF;
  border-radius: 8rpx; /* 4px * 2 */
  position: relative;
  display: flex;
  margin: 20rpx 0;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.baicao-text-content {
  display: flex;
  flex-direction: column;
  padding-left: 40rpx; /* 20px * 2 */
}

.baicao-title {
  font-family: 'PingFang SC';
  font-weight: 400;
  font-size: 32rpx; /* 16px * 2 */
  color: #000000;
  margin-top: 12rpx; /* 6px * 2 */
  line-height: 1.4em;
}

.baicao-subtitle {
  font-family: 'PingFang SC';
  font-weight: 400;
  font-size: 24rpx; /* 12px * 2 */
  color: #2B2B2B;
  margin-top: 6rpx; /* (28px - 6px - 16px) * 2 */
  line-height: 1.4em;
}

.baicao-view-btn {
  width: 106rpx; /* 53px * 2 */
  height: 32rpx; /* 16px * 2 */
  border: 1rpx solid #2B2B2B; /* 0.5px * 2 */
  border-radius: 4rpx; /* 2px * 2 */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10rpx; /* (49px - 28px - 17px) * 2 */
}

.baicao-view-text {
  font-family: 'PingFang SC';
  font-weight: 400;
  font-size: 20rpx; /* 10px * 2 */
  color: #2B2B2B;
  line-height: 1.4em;
}

.baicao-image {
  width: 122rpx; /* 61px * 2 */
  height: 116rpx; /* 58px * 2 */
  position: absolute;
  right: 38rpx; /* (257px - 177px - 61px) * 2 */
  top: 14rpx; /* 7px * 2 */
}

/* 子分类标签栏 - 按照Figma设计精确还原 */
.series-tabs {
  display: flex;
  width: 512rpx; /* 256px * 2 */
  height: 34rpx; /* 17px * 2 */
  margin: 20rpx 0;
}

.series-tab-item {
  width: 96rpx; /* 48px * 2 */
  height: 34rpx; /* 17px * 2 */
  font-family: 'PingFang SC';
  font-weight: 400;
  font-size: 24rpx; /* 12px * 2 */
  line-height: 1.4em;
  color: #666666;
  text-align: left;
}

.series-tab-item.active {
  color: #333333;
  position: relative;
}

.series-tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -10rpx;
  left: 0;
  width: 60rpx; /* 下划线宽度 */
  height: 4rpx;
  background-color: #FF840B; /* 下划线颜色为橙色 */
  border-radius: 2rpx;
}

.product-list {
  padding: 20rpx 0;
  background-color: #F8F8F8;
}

.product-card {
  display: flex;
  padding: 24rpx;
  margin-bottom: 16rpx;
  background-color: #FFFFFF;
  border-radius: 8rpx;
}

.product-image {
  width: 88rpx; /* 44px * 2 */
  height: 120rpx; /* 60px * 2 */
  object-fit: contain;
  margin-right: 24rpx;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.product-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 8rpx;
  line-height: 1.4;
}

.product-rating {
  font-size: 24rpx;
  color: #FF5B35;
  margin-bottom: 4rpx;
}

.product-replies {
  font-size: 24rpx;
  color: #999999;
  margin-bottom: 4rpx;
}

.product-price {
  font-size: 28rpx;
  font-weight: 500;
  color: #FF5B35;
}

.tab-bar {
  display: flex;
  height: 100rpx;
  background-color: #FFFFFF;
  border-top: 1rpx solid #F5F5F5;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.tab-icon {
  font-size: 40rpx;
  color: #999999;
  margin-bottom: 6rpx;
}

.tab-text {
  font-size: 24rpx;
  color: #999999;
}

.tab-item.active .tab-icon,
.tab-item.active .tab-text {
  color: #FF840B;
}
</style>
