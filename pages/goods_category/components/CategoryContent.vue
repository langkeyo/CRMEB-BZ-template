<template>
  <view class="category-content">
    <!-- 热门分类首页 -->
    <block v-if="categoryType === 'hot'">
      <!-- 为您推荐区域 -->
      <view class="for-you-recommend" v-if="recommendProducts.length > 0">
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
            <image :src="item.image" mode="aspectFill" class="product-image"></image>
            <view class="product-text">{{item.name}}</view>
          </view>
        </view>
      </view>

      <!-- 热门分类空状态 -->
      <view class="empty-state" v-if="recommendProducts.length === 0 && hotFruits.length === 0 && hotVegetables.length === 0">
        <view class="empty-content">
          <image src="/static/images/no-orders.png" class="empty-image" mode="aspectFit"></image>
          <text class="empty-title">暂无推荐商品</text>
          <text class="empty-desc">系统正在为您准备精选商品，请稍后再来看看</text>
        </view>
      </view>

      <!-- 热门水果区域 -->
      <view class="hot-category-section" v-if="hotFruits.length > 0">
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
            <image :src="item.image" mode="aspectFill" class="product-image"></image>
            <view class="product-text">{{item.name}}</view>
          </view>
        </view>
      </view>

      <!-- 热门蔬菜区域 -->
      <view class="hot-category-section" v-if="hotVegetables.length > 0">
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
            <image :src="item.image" mode="aspectFill" class="product-image"></image>
            <view class="product-text">{{item.name}}</view>
          </view>
        </view>
      </view>
    </block>

    <!-- 其他分类页面（类似snacks页面的布局） -->
    <block v-else>
      <!-- 百草味坚果卡片（仅零食分类显示） -->
      <!-- <view v-if="categoryType === 'snacks'" class="baicao-nuts-card">
        <view class="baicao-text-content">
          <text class="baicao-title">百草味坚果</text>
          <text class="baicao-subtitle">一盒15包随机...</text>
          <view class="baicao-view-btn">
            <text class="baicao-view-text">立即查看</text>
          </view>
        </view>
        <image src="/static/images/category/baicao_nuts.png" class="baicao-image" mode="aspectFit"></image>
      </view> -->

      <!-- 子分类标签栏 -->
      <view class="series-tabs" v-if="subCategories.length > 0">
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
      <view class="product-list" v-if="categoryProducts.length > 0">
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

      <!-- 空状态展示 -->
      <view class="empty-state" v-else>
        <view class="empty-content">
          <image src="/static/images/no-orders.png" class="empty-image" mode="aspectFit"></image>
          <text class="empty-title">暂无商品</text>
          <text class="empty-desc">该分类下暂时没有商品，请选择其他分类查看</text>
          <view class="empty-action">
            <view class="back-btn" @tap="goBackToHot">
              <text class="back-btn-text">返回热门</text>
            </view>
          </view>
        </view>
      </view>
    </block>

    <!-- 底部安全区域 -->
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script>
import { getGroupGoodsCategory } from '@/api/group.js'
import { HTTP_REQUEST_URL } from '@/config/app.js'

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
      hotFruits: [], // 改为空数组，从API获取
      hotVegetables: [], // 改为空数组，从API获取
      subCategories: [],
      categoryProducts: [],
      allCategoryProducts: [] // 保存所有商品数据，用于筛选
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
    // 加载分类数据（对接真实API）
    async loadCategoryData(categoryType) {
      try {
        console.log('开始加载分类数据:', categoryType);

        // 调用分类API获取真实数据
        const response = await getGroupGoodsCategory();
        if (response.status === 200 && response.data) {
          console.log('分类API返回数据:', response.data);

          // 处理API数据
          await this.processCategoryData(response.data, categoryType);
        } else {
          console.log('分类API数据格式异常，使用默认数据');
          this.loadDefaultCategoryData(categoryType);
        }
      } catch (error) {
        console.error('加载分类数据失败:', error);
        // API失败时使用默认数据
        this.loadDefaultCategoryData(categoryType);
      }
    },

    // 处理API返回的分类数据
    async processCategoryData(apiData, categoryType) {
      console.log('处理分类API数据:', apiData);

      // 处理推荐商品数据（热门分类显示）
      if (apiData.goods) {
        const allProducts = [];
        Object.keys(apiData.goods).forEach(key => {
          const category = apiData.goods[key];
          if (category.goods && category.goods.length > 0) {
            category.goods.forEach(item => {
              allProducts.push({
                id: item.id,
                name: item.title,
                image: this.setDomain(item.image),
                price: '15.00', // 使用默认价格
                categoryName: category.cate_name,
                categoryId: category.cate_id
              });
            });
          }
        });

        // 更新推荐商品数据
        if (allProducts.length > 0) {
          this.recommendProducts = allProducts.slice(0, 15); // 取前15个作为推荐商品

          // 提取水果类商品
          this.hotFruits = allProducts.filter(item =>
            item.categoryName && (item.categoryName.includes('水果') || item.categoryName.includes('果'))
          ).slice(0, 6);

          // 提取蔬菜类商品
          this.hotVegetables = allProducts.filter(item =>
            item.categoryName && (item.categoryName.includes('蔬菜') || item.categoryName.includes('菜'))
          ).slice(0, 6);

          console.log('推荐商品数据:', {
            total: this.recommendProducts.length,
            fruits: this.hotFruits.length,
            vegetables: this.hotVegetables.length
          });
        }
      }

      // 根据分类类型加载对应的商品数据
      this.loadCategorySpecificData(apiData, categoryType);
    },

    // 加载特定分类的商品数据
    loadCategorySpecificData(apiData, categoryType) {
      if (!apiData.goods || !apiData.cate) return;

      console.log('加载特定分类数据:', categoryType);

      // 根据分类类型筛选商品
      const categoryMapping = {
        'fruit': ['水果', '果'],
        'vegetable': ['蔬菜', '菜'],
        'meat': ['肉', '禽畜'],
        'snacks': ['零食', '休闲'],
        'seafood': ['海鲜'],
        'oil': ['粮油'],
        'grain': ['谷物']
      };

      const keywords = categoryMapping[categoryType] || [];
      const categoryProducts = [];
      const subCategories = [];

      // 1. 从goods中筛选匹配的分类和商品
      Object.keys(apiData.goods).forEach(key => {
        const category = apiData.goods[key];
        const categoryName = category.cate_name;

        // 检查分类名称是否匹配
        const isMatch = keywords.some(keyword => categoryName.includes(keyword));

        if (isMatch && category.goods && category.goods.length > 0) {
          // 添加子分类
          subCategories.push({
            name: categoryName,
            id: category.cate_id,
            count: category.goods.length
          });

          // 添加商品
          category.goods.forEach(item => {
            categoryProducts.push({
              id: item.id,
              name: item.title,
              image: this.setDomain(item.image),
              price: '15.00', // 使用默认价格
              rating: '99.5%', // 默认好评率
              categoryName: categoryName,
              categoryId: category.cate_id
            });
          });
        }
      });

      // 2. 如果没有找到匹配的商品，从cate层级结构中查找相关分类
      if (categoryProducts.length === 0) {
        const level1Categories = apiData.cate.filter(item => item.level === 1);
        level1Categories.forEach(level1Cat => {
          const isMatch = keywords.some(keyword => level1Cat.name.includes(keyword));
          if (isMatch) {
            // 找到匹配的一级分类，获取其子分类
            const level2Categories = apiData.cate.filter(item =>
              item.level === 2 && item.pid === level1Cat.id
            );

            level2Categories.forEach(level2Cat => {
              subCategories.push({
                name: level2Cat.name,
                id: level2Cat.id,
                count: 0 // 层级数据中没有商品数量
              });
            });
          }
        });
      }

      // 更新组件数据
      // 只有当有商品时才显示子分类
      if (categoryProducts.length > 0) {
        this.subCategories = subCategories.slice(0, 6); // 最多6个子分类
        this.allCategoryProducts = categoryProducts; // 保存所有商品数据
        this.categoryProducts = categoryProducts.slice(0, 20); // 最多20个商品
      } else {
        this.subCategories = []; // 没有商品时清空子分类
        this.allCategoryProducts = [];
        this.categoryProducts = [];
      }

      console.log(`${categoryType}分类数据加载完成:`, {
        subCategories: this.subCategories.length,
        products: this.categoryProducts.length,
        subCategoriesData: this.subCategories
      });
    },

    // 使用默认数据（API失败时的备用方案）
    loadDefaultCategoryData(categoryType) {
      console.log('使用默认分类数据:', categoryType);

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
          // 热门分类或其他，保持现有数据
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

      // 根据选中的子分类筛选商品
      this.filterProductsBySubCategory(index);
    },

    // 根据子分类筛选商品
    filterProductsBySubCategory(index) {
      if (index < 0 || index >= this.subCategories.length) {
        return;
      }

      const selectedSubCategory = this.subCategories[index];
      console.log('筛选子分类:', selectedSubCategory);

      if (index === 0) {
        // 第一个标签显示所有商品
        this.categoryProducts = this.allCategoryProducts.slice(0, 20);
      } else {
        // 根据子分类名称筛选商品
        const filteredProducts = this.allCategoryProducts.filter(product => {
          // 精确匹配分类名称
          if (product.categoryName === selectedSubCategory.name) {
            return true;
          }

          // 模糊匹配（去掉"类"字进行匹配）
          const subCategoryKeyword = selectedSubCategory.name.replace('类', '');
          return product.categoryName.includes(subCategoryKeyword) ||
                 product.name.includes(subCategoryKeyword);
        });

        this.categoryProducts = filteredProducts.slice(0, 20);
      }

      console.log('筛选后的商品数量:', this.categoryProducts.length);
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

    // 处理图片URL
    setDomain(url) {
      if (!url) return '';
      url = url.toString();

      // 如果是相对路径，拼接域名
      if (url.indexOf('/') === 0) {
        return HTTP_REQUEST_URL + url;
      }

      // 如果已经是完整URL，直接返回
      if (url.indexOf("http") === 0) {
        return url;
      }

      // 其他情况拼接域名
      return HTTP_REQUEST_URL + '/' + url;
    },

    viewProduct(item) {
      console.log('查看商品:', item);
      // 分类页面跳转到普通商品详情页，只显示"想不想买"，不能实际购买
      uni.navigateTo({
        url: `/pages/goods_details/index?id=${item.id}&type=category`
      });
    },

    viewMore(category) {
      uni.navigateTo({
        url: `/pages/goods/goods_list/index?cid=${category.id}`
      });
    },

    // 返回热门分类
    goBackToHot() {
      // 通知父组件切换到热门分类
      this.$emit('switchToHot');
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
  border-radius: 4px; /* 改为方形图片，添加小圆角 */
  margin-bottom: 8px;
  object-fit: cover; /* 保持cover以确保图片填满区域 */
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
  // margin: 20px 0;
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
}

.product-card {
  display: flex;
  padding: 24rpx;
  margin-bottom: 16rpx;
  background-color: #F8F8F8;
  border-radius: 8rpx;
}

.product-list-image {
  width: 120rpx;
  height: 120rpx;
  object-fit: cover;
  margin-right: 24rpx;
  border-radius: 4rpx; /* 添加小圆角 */
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

/* 空状态样式 */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400rpx;
  padding: 60rpx 40rpx;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.empty-image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 30rpx;
  opacity: 0.6;
}

.empty-title {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 500;
  font-size: 32rpx;
  color: #666666;
  margin-bottom: 16rpx;
}

.empty-desc {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 26rpx;
  color: #999999;
  line-height: 1.5;
  margin-bottom: 40rpx;
  max-width: 400rpx;
}

.empty-action {
  display: flex;
  justify-content: center;
}

.back-btn {
  background: #FF840B;
  border-radius: 24rpx;
  padding: 16rpx 32rpx;
  min-width: 160rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.back-btn-text {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 28rpx;
  color: #FFFFFF;
}

/* 底部安全区域 */
.safe-area-bottom {
  height: 200rpx; /* 100px * 2 - 增加高度避免被tabbar挡住 */
  width: 100%;
}
</style>
