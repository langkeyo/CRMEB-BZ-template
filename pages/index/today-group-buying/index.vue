<template>
  <view class="today-group-buying-page">
    <!-- banner-header-section -->
    <view class="banner-header-section">
      <!-- bg-banner -->
      <view class="bg-banner">
        <!-- banner轮播图 -->
        <swiper class="banner-swiper" circular autoplay interval="3000" @change="swiperChange">
          <swiper-item v-for="(item, index) in bannerList" :key="index">
            <image :src="item.image" mode="aspectFill" class="banner-image"></image>
          </swiper-item>
        </swiper>

        <!-- 自定义指示器 -->
        <view class="custom-dots">
          <view class="dot-container">
            <view
              class="dot-item"
              v-for="(item, index) in bannerList"
              :key="index"
              :class="{ 'active': currentBanner === index }"
            ></view>
          </view>
        </view>
      </view>



      <!-- header导航栏 -->
      <view class="header">
        <!-- Left (左) 返回按钮 -->
        <view class="back-icon" @click="goBack">
          <image src="/static/common/icons/navigation/back_arrow.svg" class="back-arrow-icon" mode="aspectFit" />
        </view>

        <!-- search-section 搜索区域 -->
        <view class="search-section">
          <view class="search-input-wrap">
            <image src="/static/common/icons/action/search.svg" class="search-icon" mode="aspectFit" />
            <input type="text" placeholder="搜索" class="search-input" placeholder-class="placeholder" />
          </view>
          <view class="search-btn">搜索</view>
        </view>

        <!-- notification-icon 通知图标 -->
        <view class="notification-icon">
          <image src="/static/images/index/icons/notification_icon_white.svg" class="notification-bell-icon" mode="aspectFit" />
        </view>
      </view>
    </view>

    <!-- site-nav-section 站点导航区域 -->
    <view class="site-nav-section">
      <!-- location-data-icon-section 位置数据图标区域 -->
      <view class="location-data-icon-section">
        <image src="/static/images/house-rental/location_icon.svg" class="location-icon" mode="aspectFit"></image>
        <text class="distance-text">100m</text>
      </view>

      <!-- 站点信息区域 -->
      <view class="site-info-area">
        <!-- 站点logo -->
        <image src="/static/images/today-group-buying/site-logo.png" class="site-logo" mode="aspectFit"></image>
        <!-- 站点名称 -->
        <text class="site-name">北京尚德井小区菜鸟驿站</text>
      </view>

      <!-- look-another-site-section 查看其他站点区域 -->
      <view class="look-another-site-section">
        <text class="other-sites-text">其他站点看看</text>
        <image src="/static/images/arrow_right_small.svg" class="site-arrow-icon" mode="aspectFit"></image>
      </view>
    </view>

    <!-- store-category-section 商店分类区域 -->
    <view class="store-category-section">
      <view class="category-item" v-for="(item, index) in categoryList" :key="index">
        <view class="category-icon-container">
          <view class="category-circle">
            <image :src="item.icon" class="category-icon" mode="aspectFit"></image>
          </view>
          <view class="hot-tag" v-if="item.isHot">爆款推荐</view>
        </view>
        <text class="category-name">{{item.name}}</text>
      </view>
    </view>

    <!-- flash-sale-section 限时秒杀区域 -->
    <view class="flash-sale-section">
      <!-- 头部区域 -->
      <view class="flash-sale-header">
        <text class="flash-sale-title">限时秒杀</text>
        <view class="countdown-group">
          <view class="countdown-prefix">距结束</view>
          <view class="countdown-time">05：30：03</view>
        </view>
        <view class="more-section">
          <text class="more-text">更多</text>
          <image src="/static/common/icons/navigation/arrow_right.svg" class="more-arrow" mode="aspectFit"></image>
        </view>
      </view>

      <!-- 商品列表 -->
      <view class="flash-sale-products">
        <view class="flash-sale-item" v-for="(item, index) in flashSaleList" :key="index">
          <view class="flash-image-container">
            <view class="flash-discount-tag">{{item.discount}}折</view>
            <image :src="item.image" mode="aspectFill" class="flash-product-image"></image>
          </view>
          <view class="flash-product-info">
            <text class="flash-product-name">{{item.name}}</text>
            <text class="flash-product-desc">{{item.desc}}</text>
            <view class="flash-price-row">
              <text class="flash-current-price">¥{{item.currentPrice}}</text>
              <text class="flash-original-price">¥{{item.originalPrice}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 团购商品卡片区域 -->
    <view class="group-buying-card-section">
      <view class="product-card" v-for="(product, index) in groupBuyingProducts" :key="index">
        <!-- 左侧商品图片 -->
        <view class="product-image-container">
          <image :src="product.image" class="product-image" mode="aspectFill"></image>
        </view>

        <!-- 右侧商品信息 -->
        <view class="product-info">
          <!-- 商品名称 -->
          <text class="product-name">{{ product.name }}</text>

          <!-- 团购时间 -->
          <text class="group-time">{{ product.groupTime }}</text>

          <!-- order-section 价格区域 - 251px × 44.25px -->
          <view class="order-section">
            <!-- Rectangle 561 价格背景容器 - 251px × 39px -->
            <view class="price-background">
              <!-- Group 1138 价格内容组 - 242px × 44.25px -->
              <view class="price-content-group">
                <!-- 第一行：价格信息 -->
                <view class="price-row">
                  <!-- ￥65 当前价格 - 41px × 25px -->
                  <text class="current-price">¥{{ product.currentPrice }}</text>

                  <!-- Group 1136 折扣标签组 - 20.4px × 15px -->
                  <view class="discount-group">
                    <!-- Rectangle 562 折扣边框 -->
                    <view class="discount-border">
                      <!-- 5折 折扣文字 -->
                      <text class="discount-text">{{ product.discount }}折</text>
                    </view>
                  </view>

                  <!-- Group 1137 原价组 - 24.49px × 14px -->
                  <view class="original-price-group">
                    <!-- ￥11 原价文字 -->
                    <text class="original-price-text">¥{{ product.originalPrice }}</text>
                    <!-- Line 136 删除线 -->
                  </view>
                </view>

                <!-- 第二行：热卖信息 -->
                <text class="hot-info-inline">{{ product.hotInfo }}</text>
              </view>

              <!-- 按钮容器 -->
              <view class="btn-container" @click="joinGroupBuy(product)">
                <!-- 闪电装饰图标 -->
                <image src="/static/icons/flash-icon.svg" class="flash-icon" mode="aspectFit"></image>
                <!-- 团购按钮 -->
                <view class="group-buy-btn">
                  <text class="btn-text">立即团购</text>
                  <!-- 箭头图标 -->
                  <image src="/static/images/arrow_right_small.svg" class="arrow-icon" mode="aspectFit"></image>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>



    <!-- 非此取货站点用户无法下单弹窗 -->
    <view class="pickup-station-dialog" v-if="showPickupStationDialog">
      <view class="dialog-mask" @click="closePickupDialog"></view>
      <view class="dialog-container">
        <view class="dialog-content">
          <text class="dialog-text">您非此取货站点用户无法下单</text>
        </view>
        <view class="dialog-footer">
          <view class="dialog-btn" @click="closePickupDialog">好的</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  getGroupGoodsList,
  getGroupGoodsCategory
} from '@/api/group.js';

export default {
  data() {
    return {
      showPickupStationDialog: false, // 是否显示弹窗

      currentBanner: 0, // 当前轮播图索引
      bannerList: [
        {
          image: '/static/images/house-rental/banner.png' // 使用蔬菜风格的banner
        },
        {
          image: '/static/images/house-rental/banner.png' // 重复使用相同图片
        },
        {
          image: '/static/images/house-rental/banner.png' // 重复使用相同图片
        },
        {
          image: '/static/images/house-rental/banner.png' // 重复使用相同图片
        }
      ],
      categoryList: [
        {
          name: '推荐',
          icon: '/static/images/index/categories/recommend_icon.png',
          isHot: true
        },
        {
          name: '水果',
          icon: '/static/images/index/categories/fruit_icon.png',
          isHot: false
        },
        {
          name: '蔬菜',
          icon: '/static/images/index/categories/vegetable_icon.png',
          isHot: false
        },
        {
          name: '生鲜',
          icon: '/static/images/index/categories/seafood_icon.png',
          isHot: false
        },
        {
          name: '熟食',
          icon: '/static/images/index/categories/cooked_icon.png',
          isHot: false
        },
        {
          name: '美食',
          icon: '/static/images/index/categories/delicious_icon.png',
          isHot: false
        }
      ],
      flashSaleList: [
        {
          id: 101,
          name: '聚点烧烤吧',
          desc: '五一劳动节特供',
          currentPrice: '99.99',
          originalPrice: '198',
          discount: '5.5',
          image: '/static/images/index/products/flash_food1.jpg' // 更新为正确的秒杀图点烧烤图片
        },
        {
          id: 102,
          name: '天天海鲜',
          desc: '五一劳动节特供',
          currentPrice: '35',
          originalPrice: '68',
          discount: '5.0',
          image: '/static/images/index/products/flash_food2.jpg' // 更新为正确的秒杀海鲜图片
        }
      ],

      groupBuyingProducts: [
        {
          id: 1,
          name: '灵山荔枝/一箱500克',
          image: '/static/images/today-group-buying/lychee.png',
          currentPrice: '65',
          originalPrice: '11',
          discount: '5',
          groupTime: '每周一到周五可团',
          hotInfo: '热卖99+单，每单省10元'
        },
        {
          id: 2,
          name: '辣卤大礼包/一箱600克',
          image: '/static/images/today-group-buying/snack.png',
          currentPrice: '45',
          originalPrice: '11',
          discount: '5',
          groupTime: '每周一到周五可团',
          hotInfo: '热卖99+单，每单省10元'
        }
      ]
    }
  },
  onLoad() {
    // 创建必要的目录结构
    this.createRequiredDirectories();
    // 加载团购商品数据
    this.loadGroupBuyingData();
  },
  methods: {
    // 创建必要的目录结构
    createRequiredDirectories() {
      const directories = [
        '/static/images/index/banners',
        '/static/images/index/categories',
        '/static/images/index/products',
        '/static/images/index'
      ];

      // 在真机上运行时会自动创建目录，这里不做实际创建
      console.log('确保目录存在:', directories);
    },

    // 加载团购数据
    loadGroupBuyingData() {
      this.loadGroupCategories();
      this.loadGroupProducts();
    },

    // 加载团购分类
    loadGroupCategories() {
      getGroupGoodsCategory().then(res => {
        if (res.status === 200 && res.data && res.data.goods) {
          // 将API返回的分类数据转换为页面需要的格式
          const categories = [];
          Object.keys(res.data.goods).forEach(key => {
            const category = res.data.goods[key];
            categories.push({
              id: category.cate_id,
              name: category.cate_name,
              icon: '/static/images/index/categories/default_icon.png', // 使用默认图标
              isHot: false
            });
          });

          // 保留推荐分类，添加API分类
          if (categories.length > 0) {
            this.categoryList = [
              {
                name: '推荐',
                icon: '/static/images/index/categories/recommend_icon.png',
                isHot: true
              },
              ...categories.slice(0, 7) // 最多显示7个分类，加上推荐总共8个
            ];
          }
        }
      }).catch(err => {
        console.log('获取团购分类失败:', err);
      });
    },

    // 加载团购商品
    loadGroupProducts() {
      const params = {
        page: 1,
        limit: 10,
        is_hot: '1', // 获取热门商品
        is_recommend: '1' // 获取推荐商品
      };

      getGroupGoodsList(params).then(res => {
        if (res.status === 200 && res.data && res.data.goodsList) {
          // 将API返回的商品数据转换为页面需要的格式
          const products = res.data.goodsList.map(item => ({
            id: item.id,
            name: item.title,
            image: item.image || '/static/images/today-group-buying/default.png',
            currentPrice: item.min_price,
            originalPrice: item.max_price,
            discount: '5', // 默认折扣
            groupTime: '每周一到周五可团',
            hotInfo: `热卖${item.fake_sales || 0}+单，每单省10元`
          }));

          if (products.length > 0) {
            this.groupBuyingProducts = products;
          }
        }
      }).catch(err => {
        console.log('获取团购商品失败:', err);
      });
    },



    goBack() {
      uni.navigateBack();
    },

    // 轮播图切换
    swiperChange(e) {
      this.currentBanner = e.detail.current;
    },

    // 显示取货站点弹窗
    showPickupDialog() {
      this.showPickupStationDialog = true;
    },

    // 关闭取货站点弹窗
    closePickupDialog() {
      this.showPickupStationDialog = false;
    },

    goToDetail(id) {
      uni.navigateTo({
        url: `/pages/promotional_items/detail?id=${id}&type=group`
      });
    },

    buyNow(item) {
      uni.showToast({
        title: `开团商品: ${item.name}`,
        icon: 'none'
      });

      // 实际项目中可能跳转到下单页面
      // uni.navigateTo({
      //   url: `/pages/order/confirm?id=${item.id}&type=group`
      // });
    },

    // 团购相关方法
    joinGroupBuy(product) {
      // uni.showToast({
      //   title: `参加${product.name}团购`,
      //   icon: 'success'
      // });
      uni.navigateTo({
        url: `/pages/goods_details/index?id=${product.id}&type=group&canBuy=true`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.today-group-buying-page {
  min-height: 100vh;
  background-color: #F5F5F5;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* banner-header-section */
.banner-header-section {
  position: relative;
  width: 100%;
  height: 460rpx; /* 230px * 2 */
  display: flex;
  flex-direction: column;
}

/* bg-banner */
.bg-banner {
  position: relative;
  width: 100%;
  height: 460rpx; /* 230px * 2 */
  display: flex;
  flex-direction: column;
}

/* banner轮播图 */
.banner-swiper {
  width: 100%;
  height: 460rpx; /* 230px * 2 */
  position: relative;

  .banner-image {
    width: 100%;
    height: 100%;
    display: block;
  }
}

/* 自定义指示器 */
.custom-dots {
  position: absolute;
  bottom: 36rpx; /* 18px * 2 */
  left: 50%;
  transform: translateX(-50%);
  z-index: 15;
}

.dot-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.24rpx; /* 0.62px * 2 */
}

.dot-item {
  width: 9.76rpx; /* 4.88px * 2 */
  height: 9.76rpx; /* 4.88px * 2 */
  background: #FFFFFF;
  border-radius: 16rpx; /* 8px * 2 */
  transition: all 0.3s ease;

  &.active {
    width: 39rpx; /* 19.5px * 2 */
    background: #EB5F2F;
  }
}



/* header导航栏 - 按照Figma设计规范 */
.header {
  position: absolute;
  width: 704.84rpx; /* 352.42px * 2 */
  height: 68rpx; /* 34px * 2 */
  left: 2rpx; /* 1px * 2 */
  top: 40rpx; /* 48px * 2 */
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Left (左) 返回按钮 - 29px × 29px */
.back-icon {
  width: 58rpx; /* 29px * 2 */
  height: 58rpx; /* 29px * 2 */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  filter: brightness(0) invert(1); /* 将图标变成白色 */
}

.back-arrow-icon {
  width: 30rpx; /* 15px * 2 */
  height: 30rpx; /* 15px * 2 */
}

/* search-section 搜索区域 - 225px × 34px */
.search-section {
  width: 450rpx; /* 225px * 2 */
  height: 68rpx; /* 34px * 2 */
  display: flex;
  align-items: center;
  position: relative;
}

.search-input-wrap {
  width: 450rpx; /* 225px * 2 */
  height: 68rpx; /* 34px * 2 */
  background: rgba(51, 51, 51, 0.4);
  opacity: 0.5;
  border-radius: 36rpx; /* 18px * 2 */
  display: flex;
  align-items: center;
  padding: 0 24rpx; /* 12px * 2 */
  box-sizing: border-box;
  position: relative;
}

.search-icon {
  width: 30rpx; /* 15px * 2 */
  height: 30rpx; /* 15px * 2 */
  margin-right: 12rpx; /* 6px * 2 */
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  height: 100%;
  background-color: transparent;
  border: none;
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 30rpx; /* 15px * 2 */
  line-height: 42rpx; /* 21px * 2 */
  color: #F4F4F4;
  padding-right: 100rpx; /* 为搜索按钮留出空间 */
}

.placeholder {
  color: #F4F4F4;
}

.search-btn {
  position: absolute;
  right: 8rpx; /* 4px * 2 */
  top: 8rpx; /* 4px * 2 */
  width: 92rpx; /* 46px * 2 */
  height: 52rpx; /* 26px * 2 */
  background: #EB5F2F;
  border-radius: 27rpx; /* 13.5px * 2 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 24rpx; /* 12px * 2 */
  line-height: 34rpx; /* 17px * 2 */
  color: #FFFFFF;
}

/* notification-icon 通知图标 - 20.84px × 22px */
.notification-icon {
  width: 41.68rpx; /* 20.84px * 2 */
  height: 44rpx; /* 22px * 2 */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-bell-icon {
  width: 30rpx; /* 15px * 2 */
  height: 30rpx; /* 15px * 2 */
}

/* site-nav-section 站点导航区域 - 351px × 30px */
.site-nav-section {
  width: 702rpx; /* 351px * 2 */
  height: 60rpx; /* 30px * 2 */
  margin: 20rpx 24rpx 16rpx; /* 上 左右 下 */
  background: #FFFFFF;
  border-radius: 8rpx; /* 4px * 2 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15rpx; /* 左右内边距 */
  box-sizing: border-box;
}

/* location-data-icon-section 位置数据图标区域 */
.location-data-icon-section {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.location-icon {
  width: 24rpx; /* 12px * 2 */
  height: 28rpx; /* 14px * 2 */
  margin-right: 8rpx; /* 4px * 2 */
  flex-shrink: 0;
}

.distance-text {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 20rpx; /* 10px * 2 */
  line-height: 28rpx; /* 14px * 2 */
  color: #696969;
  flex-shrink: 0;
}

/* 站点信息区域 */
.site-info-area {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
}

/* 站点logo */
.site-logo {
  width: 32rpx; /* 16px * 2 */
  height: 32rpx; /* 16px * 2 */
  margin-right: 8rpx; /* 4px * 2 */
  flex-shrink: 0;
}

/* 站点名称 - 132px × 17px */
.site-name {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 24rpx; /* 12px * 2 */
  line-height: 34rpx; /* 17px * 2 */
  color: #333333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* look-another-site-section 查看其他站点区域 */
.look-another-site-section {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.other-sites-text {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 20rpx; /* 10px * 2 */
  line-height: 28rpx; /* 14px * 2 */
  color: #696969;
  margin-right: 8rpx; /* 4px * 2 */
}

/* 站点区域箭头图标 */
.site-arrow-icon {
  width: 16rpx; /* 8px * 2 */
  height: 16rpx; /* 8px * 2 */
  margin-left: 6rpx; /* 3px * 2 */
  flex-shrink: 0;
}

/* store-category-section 商店分类区域 - 352.82px × 80px */
.store-category-section {
  width: 705.64rpx; /* 352.82px * 2 */
  height: 160rpx; /* 80px * 2 */
  margin: 16rpx 24rpx; /* 8px * 2, 12px * 2 */
  background-color: #FFFFFF;
  border-radius: 8rpx; /* 4px * 2 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 8rpx; /* 8px * 2, 4px * 2 */
  box-sizing: border-box;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
}

.category-icon-container {
  position: relative;
  margin-bottom: 12rpx; /* 6px * 2 */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 圆形背景 - 52px × 52px */
.category-circle {
  width: 104rpx; /* 52px * 2 */
  height: 104rpx; /* 52px * 2 */
  background: #FFFFFF;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1); /* 添加轻微阴影 */
}

.category-icon {
  width: 80rpx; /* 40px * 2 */
  height: 80rpx; /* 40px * 2 */
  display: block;
}

.hot-tag {
  position: absolute;
  top: -8rpx; /* -4px * 2 */
  right: -12rpx; /* -6px * 2 */
  background-color: #F03C3C;
  color: white;
  font-size: 16rpx; /* 8px * 2 */
  padding: 2rpx 10rpx; /* 1px * 2, 5px * 2 */
  border-radius: 16rpx; /* 8px * 2 */
  white-space: nowrap;
  z-index: 1;
}

.category-name {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 28rpx; /* 14px * 2 */
  line-height: 40rpx; /* 20px * 2 */
  text-align: center;
  color: #333333;
  white-space: nowrap;
}

/* flash-sale-section 限时秒杀区域 - 351px × 98px */
.flash-sale-section {
  width: 702rpx; /* 351px * 2 */
  height: 196rpx; /* 98px * 2 */
  margin: 16rpx 24rpx; /* 8px * 2, 12px * 2 */
  background: #FFFFFF;
  border-radius: 28rpx; /* 14px * 2 */
  padding: 16rpx; /* 8px * 2 */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* 头部区域 */
.flash-sale-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx; /* 10px * 2 */
  height: 46rpx; /* 23px * 2 */
}

.flash-sale-title {
  font-family: 'YouSheBiaoTiHei';
  font-style: normal;
  font-weight: 400;
  font-size: 36rpx; /* 18px * 2 */
  line-height: 46rpx; /* 23px * 2 */
  color: #333333;
  flex-shrink: 0;
}

.countdown-group {
  display: flex;
  align-items: center;
  height: 28rpx; /* 14px * 2 */
  margin-left: 16rpx; /* 8px * 2 */
}

.countdown-prefix {
  background: linear-gradient(97.41deg, #EA6E52 5.77%, #E74839 94.33%);
  border-radius: 4rpx 0 0 4rpx; /* 2px * 2 */
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 20rpx; /* 10px * 2 */
  line-height: 28rpx; /* 14px * 2 */
  text-align: center;
  color: #FFFFFF;
  padding: 0 8rpx; /* 4px * 2 */
  height: 28rpx;
  display: flex;
  align-items: center;
}

.countdown-time {
  background: #FBE5DF;
  border-radius: 0 4rpx 4rpx 0; /* 2px * 2 */
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 20rpx; /* 10px * 2 */
  line-height: 28rpx; /* 14px * 2 */
  text-align: center;
  color: #E05B35;
  padding: 0 12rpx; /* 6px * 2 */
  height: 28rpx;
  display: flex;
  align-items: center;
}

.more-section {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.more-text {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 24rpx; /* 12px * 2 */
  line-height: 34rpx; /* 17px * 2 */
  color: #696969;
  margin-right: 6rpx; /* 3px * 2 */
}

.more-arrow {
  width: 10rpx; /* 5px * 2 */
  height: 18rpx; /* 9px * 2 */
}

/* 商品列表 */
.flash-sale-products {
  display: flex;
  justify-content: space-between;
  flex: 1;
}

.flash-sale-item {
  display: flex;
  width: 48%;
}

/* 秒杀商品图片容器 */
.flash-image-container {
  position: relative;
  width: 140rpx; /* 70px * 2 */
  height: 104rpx; /* 52px * 2 */
  margin-right: 12rpx; /* 6px * 2 */
  flex-shrink: 0;
}

.flash-discount-tag {
  position: absolute;
  left: 0;
  top: 0;
  width: 70rpx; /* 35px * 2 */
  height: 32rpx; /* 16px * 2 */
  background: linear-gradient(180deg, #EF823E 0%, #EB6130 100%);
  border-radius: 16rpx 16rpx 16rpx 0; /* 8px * 2 */
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 20rpx; /* 10px * 2 */
  line-height: 28rpx; /* 14px * 2 */
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

/* 秒杀商品图片 */
.flash-product-image {
  width: 100%;
  height: 100%;
  border-radius: 14rpx; /* 7px * 2 */
}

/* 秒杀商品信息 */
.flash-product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

/* 秒杀商品名称 */
.flash-product-name {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 28rpx; /* 14px * 2 */
  line-height: 40rpx; /* 20px * 2 */
  color: #1A1A1A;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 秒杀商品描述 */
.flash-product-desc {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 24rpx; /* 12px * 2 */
  line-height: 34rpx; /* 17px * 2 */
  color: #999999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 秒杀价格行 */
.flash-price-row {
  display: flex;
  align-items: baseline;
  gap: 8rpx; /* 4px * 2 */
}

/* 秒杀当前价格 */
.flash-current-price {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 28rpx; /* 14px * 2 */
  line-height: 40rpx; /* 20px * 2 */
  color: #F84E45;
}

/* 秒杀原价 */
.flash-original-price {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 24rpx; /* 12px * 2 */
  line-height: 34rpx; /* 17px * 2 */
  color: #999999;
  text-decoration: line-through;
}

/* 团购商品卡片区域 - card2 (基于Figma数据) */
.group-buying-card-section {
  margin-bottom: 16rpx; /* 8px * 2 */
}

/* card2 主容器 */
.product-card {
  width: 702rpx; /* 351px * 2 */
  min-height: 184rpx; /* 92px * 2 */
  margin: 16rpx 24rpx; /* 8px * 2, 12px * 2 */
  background: #FFFFFF; /* fill_WJJSWI */
  border-radius: 16rpx; /* 8px * 2 */
  padding: 16rpx; /* 8px * 2 */
  box-sizing: border-box;
  display: flex;
  align-items: stretch; /* 改为stretch，让子元素高度一致 */
}

/* left 左侧商品图片组 */
.product-image-container {
  width: 150rpx; /* 75px * 2 */
  margin-right: 16rpx; /* 8px * 2 */
  flex-shrink: 0;
  align-self: stretch; /* 让图片容器高度和右边内容一样高 */
  display: flex; /* 确保内部图片能100%填充 */
}

.product-image {
  width: 100%;
  height: 100%;
  border-radius: 12rpx; /* 6px * 2 - 基于Figma borderRadius */
  object-fit: cover; /* 确保图片填充整个容器 */
}

/* right 右侧商品信息组 */
.product-info {
  flex: 1;
  min-height: 152rpx; /* 76px * 2 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  padding-top: 8rpx; /* 4px * 2 */
}

/* 灵山荔枝/一箱500克 - style_QZPV5E */
.product-name {
  font-family: 'PingFang SC'; /* 基于Figma fontFamily */
  font-weight: 400; /* 基于Figma fontWeight */
  font-size: 32rpx; /* 16px * 2 - 基于Figma fontSize */
  line-height: 44rpx; /* 22px * 2 - 基于Figma lineHeight */
  color: #000000; /* fill_DVGSRI */
  margin-bottom: 6rpx; /* 3px * 2 - 减少间距 */
}

/* 每周一到周五可团 - style_EK490G */
.group-time {
  font-family: 'PingFang SC'; /* 基于Figma fontFamily */
  font-weight: 400; /* 基于Figma fontWeight */
  font-size: 20rpx; /* 10px * 2 - 基于Figma fontSize */
  line-height: 28rpx; /* 14px * 2 - 基于Figma lineHeight */
  color: #7B7B7B; /* fill_UV8AKT */
  margin-bottom: 16rpx; /* 8px * 2 - 减少间距 */
}

/* order-section 价格区域 - 251px × 44.25px */
.order-section {
  width: 502rpx; /* 251px * 2 */
  height: 88.5rpx; /* 44.25px * 2 */
  margin-bottom: 8rpx; /* 4px * 2 - 减少与热卖信息的间距 */
  position: relative;
}

/* Rectangle 561 价格背景容器 - 251px × 39px */
.price-background {
  width: 502rpx; /* 251px * 2 */
  height: 78rpx; /* 39px * 2 */
  background: #FBF1EB; /* 基于Figma background */
  border-radius: 8rpx 39rpx 39rpx 8rpx; /* 4px 19.5px 19.5px 4px * 2 */
  position: relative;
  display: flex;
  align-items: center;
}

/* Group 1138 价格内容组 - 242px × 44.25px */
.price-content-group {
  display: flex;
  flex-direction: column;
  padding-left: 18rpx; /* 9px * 2 */
  flex: 1;
  justify-content: center;
}

/* 第一行：价格信息 */
.price-row {
  display: flex;
  align-items: baseline; /* 改为baseline对齐，更自然 */
  gap: 16rpx; /* 增加间距，符合商城系统习惯 */
  margin-bottom: 4rpx; /* 2px * 2 */
}

/* ￥65 当前价格 */
.current-price {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 30rpx; /* 18px * 2 */
  line-height: 1.2; /* 统一行高比例 */
  color: #E5402C;
  flex-shrink: 0;
}

/* 折扣标签组 */
.discount-group {
  flex-shrink: 0;
}

/* 折扣边框 */
.discount-border {
  padding: 2rpx 6rpx; /* 内边距代替固定宽高 */
  border: 1rpx solid #EA5C2E;
  border-radius: 2rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

/* 折扣文字 */
.discount-text {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 20rpx; /* 10px * 2 */
  line-height: 1.2; /* 统一行高比例 */
  color: #EA5C2E;
  text-align: center;
  white-space: nowrap;
}

/* 原价组 */
.original-price-group {
  flex-shrink: 0;
}

/* 原价文字 */
.original-price-text {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 20rpx; /* 10px * 2 */
  line-height: 1.2; /* 统一行高比例 */
  color: #999999;
  text-decoration: line-through;
}

/* 按钮容器 - 包裹按钮和图标 */
.btn-container {
  position: absolute;
  right: 0;
  top: 0;
  width: 240rpx; /* 比按钮宽一些，给图标留空间 */
  height: 78rpx; /* 39px * 2 */
  display: flex;
  align-items: center;
  position: relative;
}

/* 团购按钮 */
.group-buy-btn {
  width: 206rpx; /* 103px * 2 */
  height: 78rpx; /* 39px * 2 */
  background: #E5402C;
  border-radius: 0 39rpx 39rpx 0; /* 0px 19.5px 19.5px 0px * 2 */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-left: auto; /* 推到右边 */
}

/* 闪电装饰图标 - 您下载的flash-icon.svg */
.flash-icon {
  position: absolute;
  left: 20rpx; /* 在容器左侧 */
  top: 50%;
  transform: translateY(-50%);
  width: 48rpx; /* 24px * 2 */
  height: 96rpx; /* 48px * 2 */
  z-index: 3; /* 在上层 */
}

/* 按钮文字 */
.btn-text {
  font-family: 'PingFang SC';
  font-weight: 400;
  font-size: 28rpx; /* 14px * 2 */
  line-height: 40rpx; /* 20px * 2 */
  color: #FFFFFF;
  z-index: 2;
}

/* 箭头图标 - 您下载的arrow_right_small.svg */
.arrow-icon {
  position: absolute;
  right: 16rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 16rpx; /* 8px * 2 */
  height: 16rpx; /* 8px * 2 */
  z-index: 2;
  filter: brightness(0) invert(1); /* 将图标变成白色 */
}

/* 热卖99+单，每单省10元 - 内联版本 */
.hot-info-inline {
  font-family: 'PingFang SC'; /* 基于Figma fontFamily */
  font-weight: 400; /* 基于Figma fontWeight */
  font-size: 20rpx; /* 10px * 2 - 基于Figma fontSize */
  line-height: 28rpx; /* 1.4 * 10px * 2 - 基于Figma lineHeight */
  color: #EA5C2E; /* fill_T68D16 */
  max-width: 100%; /* 不超出容器宽度 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 超出显示省略号 */
  white-space: nowrap; /* 不换行 */
}



/* 取货站点弹窗 */
.pickup-station-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;

  .dialog-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .dialog-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 280px;
    background-color: #FFFFFF;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .dialog-content {
    padding: 24px 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    .dialog-text {
      font-size: 16px;
      color: #333333;
      text-align: center;
      font-weight: 400;
      line-height: 1.5;
    }
  }

  .dialog-footer {
    padding: 0 20px 20px;

    .dialog-btn {
      height: 44px;
      line-height: 44px;
      background-color: #FE8D00; /* 橙色按钮背景 */
      color: #FFFFFF;
      font-size: 16px;
      text-align: center;
      border-radius: 22px;
      font-weight: 500;
    }
  }
}
</style>
