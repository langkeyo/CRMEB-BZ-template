<template>
  <view class="category-content">
    <!-- 热门分类首页 -->
    <block v-if="categoryType === 'hot'">
      <!-- 为您推荐区域 -->
      <view class="for-you-recommend">
        <!-- 标题区域 -->
        <view class="title-section">
          <text class="recommend-title">为您推荐</text>
        </view>

        <!-- 商品卡片区域 -->
        <view class="shop-card" :class="{'two-rows': recommendProducts.slice(0, 6).length >= 4}">
          <view
            v-for="(item, index) in recommendProducts.slice(0, 6)"
            :key="index"
            class="product-item"
            @tap="viewProduct(item)"
          >
            <image :src="item.image" mode="aspectFit" class="product-image"></image>
            <view class="product-text">{{item.name}}</view>
          </view>
        </view>
      </view>

      <!-- 热门水果区域 -->
      <view class="hot-category-section">
        <!-- 标题区域 -->
        <view class="title-section">
          <view class="section-header">
            <text class="recommend-title">热门水果</text>
            <text class="more-link" @tap="viewMore({id: 'fruit', name: '水果'})">更多 ></text>
          </view>
        </view>

        <!-- 商品卡片区域 -->
        <view class="shop-card" :class="{'two-rows': hotFruits.slice(0, 6).length >= 4}">
          <view
            v-for="(item, index) in hotFruits.slice(0, 6)"
            :key="index"
            class="product-item"
            @tap="viewProduct(item)"
          >
            <image :src="item.image" mode="aspectFit" class="product-image"></image>
            <view class="product-text">{{item.name}}</view>
          </view>
        </view>
      </view>

      <!-- 热门蔬菜区域 -->
      <view class="hot-category-section">
        <!-- 标题区域 -->
        <view class="title-section">
          <view class="section-header">
            <text class="recommend-title">热门蔬菜</text>
            <text class="more-link" @tap="viewMore({id: 'vegetable', name: '蔬菜'})">更多 ></text>
          </view>
        </view>

        <!-- 商品卡片区域 -->
        <view class="shop-card" :class="{'two-rows': hotVegetables.slice(0, 6).length >= 4}">
          <view
            v-for="(item, index) in hotVegetables.slice(0, 6)"
            :key="index"
            class="product-item"
            @tap="viewProduct(item)"
          >
            <image :src="item.image" mode="aspectFit" class="product-image"></image>
            <view class="product-text">{{item.name}}</view>
          </view>
        </view>
      </view>
    </block>

    <!-- 其他分类页面（类似snacks页面的布局） -->
    <block v-else>
      <!-- 百草味坚果卡片（仅零食分类显示） -->
      <view v-if="categoryType === 'snacks'" class="baicao-nuts-card">
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
          v-for="(item, index) in categoryProducts"
          :key="index"
          class="product-card"
          @tap="viewProduct(item)"
        >
          <image :src="item.image" mode="aspectFill" class="product-list-image"></image>
          <view class="product-info">
            <text class="product-title">{{item.name}}</text>
            <text v-if="item.rating" class="product-rating">{{item.rating ? '好评' + item.rating : ''}}</text>
            <text v-if="item.replies" class="product-replies">{{item.replies}}</text>
            <text class="product-price">¥{{item.price}}元</text>
          </view>
        </view>
      </view>
    </block>
  </view>
</template>

<script>
export default {
  name: 'CategoryContent',
  props: {
    categoryType: {
      type: String,
      default: 'hot'
    }
  },
  data() {
    return {
      currentSubCategoryIndex: 0,
      recommendProducts: [
        { id: 1, name: '橙子', image: '/static/images/category/hot-categories/orange.png' },
        { id: 2, name: '葡萄', image: '/static/images/category/hot-categories/grape.png' },
        { id: 3, name: '芒果', image: '/static/images/category/hot-categories/mango.png' },
        { id: 4, name: '牛肉', image: '/static/images/category/hot-categories/beef.png' },
        { id: 5, name: '猪肉', image: '/static/images/category/hot-categories/pork.png' },
        { id: 6, name: '鸡蛋', image: '/static/images/category/hot-categories/egg.png' },
        { id: 7, name: '榴莲', image: '/static/images/category/hot-categories/durian.png' },
        { id: 8, name: '草莓', image: '/static/images/category/hot-categories/strawberry.png' },
        { id: 9, name: '香蕉', image: '/static/images/category/hot-categories/banana.png' },
        { id: 10, name: '苹果', image: '/static/images/category/hot-categories/apple.png' },
        { id: 11, name: '火龙果', image: '/static/images/category/hot-categories/pitaya.png' },
        { id: 12, name: '山竹', image: '/static/images/category/hot-categories/mangosteen.png' },
        { id: 13, name: '西兰花', image: '/static/images/category/hot-categories/broccoli.png' },
        { id: 14, name: '白菜', image: '/static/images/category/hot-categories/cabbage.png' },
        { id: 15, name: '黄瓜', image: '/static/images/category/hot-categories/cucumber.png' }
      ],
      hotFruits: [
        { id: 10, name: '苹果', image: '/static/images/category/hot-categories/apple.png' },
        { id: 11, name: '火龙果', image: '/static/images/category/hot-categories/pitaya.png' },
        { id: 12, name: '山竹', image: '/static/images/category/hot-categories/mangosteen.png' }
      ],
      hotVegetables: [
        { id: 13, name: '西兰花', image: '/static/images/category/hot-categories/broccoli.png' },
        { id: 14, name: '白菜', image: '/static/images/category/hot-categories/cabbage.png' },
        { id: 15, name: '黄瓜', image: '/static/images/category/hot-categories/cucumber.png' }
      ],
      subCategories: [],
      categoryProducts: []
    }
  },
  watch: {
    categoryType: {
      handler(newType) {
        this.loadCategoryData(newType);
      },
      immediate: true
    }
  },
  mounted() {
    // 初始化激活背景位置
    this.updateActiveTabBackground(this.currentSubCategoryIndex);
  },
  methods: {
    loadCategoryData(categoryType) {
      // 根据分类类型加载不同的数据
      switch(categoryType) {
        case 'snacks':
          this.loadSnacksData();
          break;
        case 'fruit':
          this.loadFruitData();
          break;
        case 'vegetable':
          this.loadVegetableData();
          break;
        case 'meat':
          this.loadMeatData();
          break;
        default:
          // 热门分类或其他，使用默认数据
          break;
      }
    },

    loadSnacksData() {
      this.subCategories = [
        { name: '薯片系列', id: 'chips' },
        { name: '糖果系列', id: 'candy' },
        { name: '饼干系列', id: 'biscuit' },
        { name: '辣条系列', id: 'spicy' }
      ];
      this.categoryProducts = [
        {
          id: 1,
          name: '乐事薯片（黄瓜味）',
          price: '5.00',
          rating: '99.8%',
          image: '/static/images/category/snacks/leshi_shupian_huanggua_5yuan.png'
        },
        {
          id: 2,
          name: '乐事薯片（龙虾味）',
          price: '5.00',
          rating: '99.8%',
          replies: '5个回答',
          image: '/static/images/category/snacks/leshi_shupian_longxia_5yuan.png'
        },
        {
          id: 3,
          name: 'Doritos薯片（麻辣味）',
          price: '10.00',
          rating: '98.5%',
          image: '/static/images/category/snacks/doritos_shupian_mala_10yuan.png'
        },
        {
          id: 4,
          name: '可比克薯片（烧烤味）',
          price: '6.00',
          rating: '99.2%',
          image: '/static/images/category/snacks/kebike_shupian_shaokao_6yuan.png'
        },
        {
          id: 5,
          name: 'FINUT趣菜福（海鲜味）',
          price: '12.00',
          rating: '97.6%',
          image: '/static/images/category/snacks/finut_qucaifu_haixian_12yuan.png'
        },
        {
          id: 6,
          name: '上好佳虾片（原味）',
          price: '5.00',
          rating: '99.5%',
          image: '/static/images/category/snacks/shanghaojia_xiapian_yuanwei_5yuan.png'
        }
      ];
    },

    loadFruitData() {
      this.subCategories = [
        { name: '热带水果', id: 'tropical' },
        { name: '温带水果', id: 'temperate' },
        { name: '进口水果', id: 'imported' },
        { name: '有机水果', id: 'organic' }
      ];
      this.categoryProducts = [
        { id: 101, name: '新鲜芒果', price: '15.00', rating: '99.5%', image: '/static/images/category/hot-categories/mango.png' },
        { id: 102, name: '进口橙子', price: '12.00', rating: '98.8%', image: '/static/images/category/hot-categories/orange.png' },
        { id: 103, name: '有机苹果', price: '18.00', rating: '99.2%', image: '/static/images/category/hot-categories/apple.png' }
      ];
    },

    loadVegetableData() {
      this.subCategories = [
        { name: '叶菜类', id: 'leafy' },
        { name: '根茎类', id: 'root' },
        { name: '瓜果类', id: 'gourd' },
        { name: '有机蔬菜', id: 'organic' }
      ];
      this.categoryProducts = [
        { id: 201, name: '新鲜西兰花', price: '8.00', rating: '99.1%', image: '/static/images/category/hot-categories/broccoli.png' },
        { id: 202, name: '有机白菜', price: '6.00', rating: '98.5%', image: '/static/images/category/hot-categories/cabbage.png' },
        { id: 203, name: '新鲜黄瓜', price: '7.00', rating: '99.0%', image: '/static/images/category/hot-categories/cucumber.png' }
      ];
    },

    loadMeatData() {
      this.subCategories = [
        { name: '牛肉类', id: 'beef' },
        { name: '猪肉类', id: 'pork' },
        { name: '鸡肉类', id: 'chicken' },
        { name: '海鲜类', id: 'seafood' }
      ];
      this.categoryProducts = [
        { id: 301, name: '优质牛肉', price: '45.00', rating: '99.3%', image: '/static/images/category/hot-categories/beef.png' },
        { id: 302, name: '新鲜猪肉', price: '25.00', rating: '98.9%', image: '/static/images/category/hot-categories/pork.png' },
        { id: 303, name: '土鸡蛋', price: '15.00', rating: '99.6%', image: '/static/images/category/hot-categories/egg.png' }
      ];
    },

    selectSubCategory(index) {
      this.currentSubCategoryIndex = index;
      // 更新激活背景位置
      this.updateActiveTabBackground(index);
      // 这里可以根据子分类加载对应的商品
    },

    updateActiveTabBackground(index) {
      // 完全按照Figma规格的绝对定位
      // 激活背景要居中覆盖对应的文字
      // 文字位置: [5px, 73px, 143px, 213px]
      // 激活背景宽58px，文字宽48px，所以背景要向左偏移5px来居中
      const textPositions = [5, 73, 143, 213]; // 文字的left位置
      const backgroundLeft = textPositions[index] - 5; // 背景向左偏移5px居中

      this.$nextTick(() => {
        const tabsElement = this.$el.querySelector('.series-tabs');
        if (tabsElement) {
          tabsElement.style.setProperty('--active-left', backgroundLeft + 'px');
        }
      });
    },

    viewProduct(item) {
      uni.navigateTo({
        url: `/pages/goods_details/index?id=${item.id}`
      });
    },

    viewMore(category) {
      uni.navigateTo({
        url: `/pages/goods/goods_list/index?cid=${category.id}`
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.category-content {
  padding: 16px; /* 统一的padding */
  background-color: #FFFFFF;
}

/* 为您推荐区域 - 按照Figma设计 */
.for-you-recommend {
  margin-bottom: 20px;
}

.title-section {
  margin-bottom: 16px;
}

.recommend-title {
  font-family: 'PingFang SC';
  font-weight: 400;
  font-size: 18px;
  line-height: 1.4em;
  color: #333333;
  text-align: left;
}

/* 按照Figma设计的shopcard样式 - 自适应高度和宽度 */
.shop-card {
  position: relative;
  width: 100%; /* 自适应容器宽度 */
  min-height: 132px; /* 最小高度：一行商品 (30px + 72px + 30px) */
  background: #F8F8F8;
  border-radius: 4px;
}

/* 当商品数量 >= 4 时，增加高度以容纳第二行 */
.shop-card.two-rows {
  min-height: 238px; /* 两行商品的高度 */
}

/* 商品项目组 - 使用绝对定位 */
.product-item {
  position: absolute;
  width: 52.65px;
  height: 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 第一行商品定位 - 使用百分比实现响应式 */
.product-item:nth-child(1) { left: 8%; top: 30px; }
.product-item:nth-child(2) { left: 50%; top: 30px; transform: translateX(-50%); }
.product-item:nth-child(3) { right: 8%; top: 30px; }

/* 第二行商品定位 - 使用百分比实现响应式 */
.product-item:nth-child(4) { left: 8%; top: 136px; }
.product-item:nth-child(5) { left: 50%; top: 136px; transform: translateX(-50%); }
.product-item:nth-child(6) { right: 8%; top: 136px; }

/* 商品图片样式 - 按照Figma规格 */
.product-image {
  width: 52.65px;
  height: 52.65px;
  border-radius: 26.325px; /* 圆形图片 */
  margin-bottom: 8px;
  object-fit: cover;
}

/* 最后一个商品图片添加阴影效果 - 按照Figma设计（第6个商品：鸡蛋） */
.product-item:nth-child(6) .product-image {
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}

/* 商品文字样式 - 按照Figma规格 */
.product-text {
  position: absolute;
  width: 45px;
  height: 12px;
  top: 60px;
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: #333333;
}

/* 热门分类区域 */
.hot-category-section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.more-link {
  font-family: 'PingFang SC';
  font-weight: 400;
  font-size: 12px;
  color: #999999;
}

/* 百草味坚果卡片样式 */
.baicao-nuts-card {
  width: 514rpx;
  height: 144rpx;
  background-color: #FFFFFF;
  border-radius: 8rpx;
  position: relative;
  display: flex;
  margin: 20rpx 0;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.baicao-text-content {
  display: flex;
  flex-direction: column;
  padding-left: 40rpx;
}

.baicao-title {
  font-family: 'PingFang SC';
  font-weight: 400;
  font-size: 32rpx;
  color: #000000;
  margin-top: 12rpx;
  line-height: 1.4em;
}

.baicao-subtitle {
  font-family: 'PingFang SC';
  font-weight: 400;
  font-size: 24rpx;
  color: #2B2B2B;
  margin-top: 6rpx;
  line-height: 1.4em;
}

.baicao-view-btn {
  width: 106rpx;
  height: 32rpx;
  border: 1rpx solid #2B2B2B;
  border-radius: 4rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10rpx;
}

.baicao-view-text {
  font-family: 'PingFang SC';
  font-weight: 400;
  font-size: 20rpx;
  color: #2B2B2B;
  line-height: 1.4em;
}

.baicao-image {
  width: 122rpx;
  height: 116rpx;
  position: absolute;
  right: 38rpx;
  top: 14rpx;
}

/* 子分类标签栏 - 完全按照Figma绝对定位 */
.series-tabs {
  position: relative;
  width: 261px;
  height: 21px;
  margin: 20px 0;
  --active-left: 0px;
}

/* 激活背景 - 按照Figma规格 */
.series-tabs::before {
  content: '';
  position: absolute;
  width: 58px;
  height: 21px;
  left: var(--active-left, 0px);
  top: 0px;
  background: #EEEEEE;
  border-radius: 2px;
  transition: left 0.3s ease;
  z-index: 1;
}

/* 标签项绝对定位 */
.series-tab-item {
  position: absolute;
  width: 48px;
  height: 17px;
  top: 2px; /* 相对容器偏移2px，对应Figma中207-205=2 */
  font-family: 'PingFang SC';
  font-weight: 400;
  font-size: 12px;
  line-height: 17px;
  color: #666666;
  text-align: center;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* 按照Figma精确定位每个标签 */
.series-tab-item:nth-child(1) { left: 5px; }   /* 薯片系列: 111-106=5px */
.series-tab-item:nth-child(2) { left: 73px; }  /* 糖果系列: 179-106=73px */
.series-tab-item:nth-child(3) { left: 143px; } /* 饼干系列: 249-106=143px */
.series-tab-item:nth-child(4) { left: 213px; } /* 辣条系列: 319-106=213px */

.series-tab-item.active {
  color: #333333;
}

/* 商品列表 */
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

.product-list-image {
  width: 88rpx;
  height: 120rpx;
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
</style>
