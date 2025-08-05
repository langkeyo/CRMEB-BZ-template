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
            <input type="text" placeholder="搜索" class="search-input" placeholder-class="placeholder"
                   v-model="searchKeyword" @confirm="handleSearch" confirm-type="search" />
          </view>
          <view class="search-btn" @click="handleSearch">搜索</view>
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
        <text class="site-name">{{ currentStation.name || '北京尚德井小区菜鸟驿站' }}</text>
      </view>

      <!-- look-another-site-section 查看其他站点区域 -->
      <view class="look-another-site-section" @click="goToStationSelector">
        <text class="other-sites-text">其他站点看看</text>
        <image src="/static/images/arrow_right_small.svg" class="site-arrow-icon" mode="aspectFit"></image>
      </view>
    </view>

    <!-- store-category-section 商店分类区域 -->
    <view class="store-category-section">
      <view class="category-item" v-for="(item, index) in categoryList" :key="index" @click="selectCategory(item)">
        <view class="category-icon-container">
          <view class="category-circle">
            <image :src="item.icon" class="category-icon" mode="aspectFit"></image>
          </view>
          <view class="hot-tag" v-if="item.isHot">爆款推荐</view>
          <view class="goods-count-tag" v-if="item.goodsCount > 0">{{item.goodsCount}}</view>
        </view>
        <text class="category-name">{{item.name}}</text>
      </view>
    </view>

    <!-- 分类提示 -->
    <view class="category-tip">
      <text class="tip-text">💡 点击分类图标查看更多商品</text>
    </view>
      <!-- flash-sale-section 限时秒杀区域 -->
    <view class="flash-sale-section" v-if="flashSaleList.length > 0">
      <!-- 头部区域 -->
      <view class="flash-sale-header">
        <text class="flash-sale-title">限时秒杀</text>
        <view class="countdown-group">
          <view class="countdown-prefix">距结束</view>
          <view class="countdown-time">05：30：03</view>
        </view>
        <view class="more-section" @click="goToSeckillList">
          <text class="more-text">更多</text>
          <image src="/static/common/icons/navigation/arrow_right.svg" class="more-arrow" mode="aspectFit"></image>
        </view>
      </view>

      <!-- 商品列表 -->
      <view class="flash-sale-products">
        <view class="flash-sale-item" v-for="(item, index) in flashSaleList" :key="index">
          <view class="flash-image-container">
            <view class="flash-discount-tag">{{item.discount}}折</view>
            <image :src="setDomain(item.image)" mode="aspectFill" class="flash-product-image"></image>
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
          <image :src="setDomain(product.image)" class="product-image" mode="aspectFill"></image>
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

      <!-- 底部安全区域 -->
      <view class="safe-area-bottom"></view>
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
  getUserCombinationList,
  getRecommendCombinations,
  getMyCommunityInfo
} from '@/api/group.js';
import { HTTP_REQUEST_URL } from '@/config/app.js';

export default {
  data() {
    return {
      showPickupStationDialog: false, // 是否显示弹窗

      // 当前站点信息
      currentStation: {
        id: null,
        name: '',
        distance: '100m'
      },

      // 当前选中的分类
      selectedCategory: null,

      // 分类映射（从API获取的准确分类名称）
      categoryMapping: null,

      // 加载状态
      isLoading: true,

      // 所有商品数据（用于分类筛选）
      allGoodsData: {},

      // 搜索关键词
      searchKeyword: '',

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
          isHot: true,
          id: 0 // 推荐分类ID为0
        }
      ],
      flashSaleList: [], // 改为空数组，从API获取数据

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
  async onLoad() {
    // 创建必要的目录结构
    this.createRequiredDirectories();
    // 加载站点信息
    this.loadCurrentStation();
    // 先获取分类映射，再加载拼团数据
    await this.loadCategoryMapping();
    // 加载拼团商品数据
    this.loadGroupBuyingData();
    // 加载推荐拼团商品（用于限时秒杀区域）
    this.loadRecommendCombinations();
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

    // 加载分类映射（拼团商品不需要单独的分类接口，从商品数据中提取）
    async loadCategoryMapping() {
      try {
        console.log('拼团商品将从商品数据中提取分类信息...');
        // 拼团商品API不需要单独的分类接口，分类信息从商品列表中提取
        this.categoryMapping = null;
        this.useDefaultCategories();
      } catch (error) {
        console.log('初始化分类映射失败，使用默认映射:', error);
        this.categoryMapping = null;
        this.useDefaultCategories();
      }
    },

    // 使用默认分类
    useDefaultCategories() {
      this.categoryList = [
        {
          id: 0,
          name: '推荐',
          icon: '/static/images/index/categories/recommend_icon.png',
          isHot: true,
          level: 0
        },
        {
          id: 1,
          name: '水果',
          icon: '/static/images/index/categories/fruit_icon.png',
          isHot: false,
          level: 1
        },
        {
          id: 2,
          name: '蔬菜',
          icon: '/static/images/index/categories/vegetable_icon.png',
          isHot: false,
          level: 1
        }
      ];
    },

    // 加载当前站点信息
    async loadCurrentStation() {
      try {
        const response = await getMyCommunityInfo();
        if (response.status === 200 && response.data && response.data.is_bind && response.data.community) {
          this.currentStation = {
            id: response.data.community.id,
            name: response.data.community.name,
            distance: '100m'
          };
          console.log('当前站点信息:', this.currentStation);
        } else {
          console.log('用户未绑定社区');
        }
      } catch (error) {
        console.error('获取站点信息失败:', error);
      }
    },

    // 加载拼团商品数据
    async loadGroupBuyingData() {
      try {
        console.log('开始加载拼团商品数据...');

        // 调用拼团商品列表API
        const params = {
          page: 1,
          limit: 20, // 获取足够的商品
          is_host: '1' // 获取推荐商品
        };

        const res = await getUserCombinationList(params);
        if (res.status === 200 && res.data && res.data.list) {
          console.log('拼团商品API返回数据:', res.data);

          // 1. 处理拼团商品数据 - 根据拼团API返回格式
          const products = res.data.list.map(item => ({
            id: item.id,
            name: item.title,
            image: this.setDomain(item.image),
            currentPrice: item.group_price || '0.00',
            originalPrice: item.original_price || '0.00',
            discount: this.calculateDiscount(item.group_price, item.original_price),
            groupTime: item.time_left ? item.time_left.text : '拼团中',
            hotInfo: `已售${item.sales || 0}件`,
            sales: item.sales || 0,
            categoryId: item.id || 0,
            saveAmount: item.save_amount || '0.00',
            timeLeftText: item.time_left ? item.time_left.text : null,
            timeLeftSeconds: item.time_left ? item.time_left.total_seconds : 0,
            statusText: item.status_text,
            description: item.description,
            people: item.people || 2, // 成团人数
            isHost: item.is_host || 0 // 是否推荐
          }));

          // 设置拼团商品数据
          if (products.length > 0) {
            this.groupBuyingProducts = products.slice(0, 2); // 显示前2个拼团商品
            console.log('处理后的拼团商品:', this.groupBuyingProducts);

            // 3. 设置限时秒杀商品（从剩余拼团商品中选择）
            if (products.length > 2) {
              this.flashSaleList = products.slice(2, 4).map(item => ({
                id: item.id,
                name: item.name,
                desc: item.description || '拼团特价',
                currentPrice: item.currentPrice,
                originalPrice: item.originalPrice,
                discount: item.discount,
                image: item.image,
                people: item.people // 成团人数
              }));
              console.log('处理后的限时秒杀商品:', this.flashSaleList);
            } else {
              this.flashSaleList = []; // 没有足够商品时清空
            }
          } else {
            this.flashSaleList = []; // 没有商品时清空
          }

          // 2. 使用默认分类（拼团商品不需要复杂的分类逻辑）
          this.useDefaultCategories();

          console.log('拼团商品数据加载完成:', {
            products: this.groupBuyingProducts.length,
            flashSale: this.flashSaleList.length,
            categories: this.categoryList.length
          });

        } else {
          console.log('拼团商品API返回数据格式错误，使用默认数据');
          this.useDefaultProducts();
          this.useDefaultCategories();
        }

      } catch (err) {
        console.error('获取拼团商品数据失败:', err);
        this.useDefaultProducts();
        this.useDefaultCategories();
      } finally {
        // 数据加载完成
        this.isLoading = false;

        // 确保页面重新渲染后触发滚动区域重新计算
        this.$nextTick(() => {
          console.log('拼团商品数据加载完成，页面已更新');
        });
      }
    },



    // 根据分类名称获取对应图标
    getCategoryIcon(categoryName) {
      const iconMap = {
        '水果': '/static/images/index/categories/fruit_icon.png',
        '蔬菜': '/static/images/index/categories/vegetable_icon.png',
        '禽畜肉类': '/static/images/index/categories/meat_icon.png',
        '休闲零食': '/static/images/index/categories/snack_icon.png',
        '进口水果': '/static/images/index/categories/fruit_icon.png',
        '有机水果': '/static/images/index/categories/fruit_icon.png',
        '叶菜类': '/static/images/index/categories/vegetable_icon.png',
        '根茎类': '/static/images/index/categories/vegetable_icon.png',
        '瓜果类': '/static/images/index/categories/vegetable_icon.png',
        '有机蔬菜': '/static/images/index/categories/vegetable_icon.png',
        '中药材': '/static/images/index/categories/medicine_icon.png',
        '油粮作物': '/static/images/index/categories/grain_icon.png',
        '海鲜': '/static/images/index/categories/seafood_icon.png',
        '粮食谷物': '/static/images/index/categories/grain_icon.png',
        '经济作物': '/static/images/index/categories/economic_icon.png',
        '干果坚果': '/static/images/index/categories/nuts_icon.png',
        '茶叶': '/static/images/index/categories/tea_icon.png'
      };

      return iconMap[categoryName] || '/static/images/index/categories/default_icon.png';
    },

    // 根据分类ID获取分类名称（优先使用API映射）
    getCategoryNameById(cateId) {
      // 优先使用从API获取的分类映射
      if (this.categoryMapping && this.categoryMapping[cateId]) {
        return this.categoryMapping[cateId];
      }

      // 备用的静态映射
      const categoryNames = {
        1: '水果',
        2: '蔬菜',
        3: '热带水果',
        4: '温带水果',
        5: '进口水果',
        6: '有机水果',
        7: '叶菜类',
        8: '根茎类',
        9: '瓜果类',
        10: '有机蔬菜',
        11: '禽畜肉类',
        12: '牛肉类',
        13: '猪肉类',
        14: '鸡肉类',
        15: '海鲜类',
        16: '休闲零食',
        17: '薯片系列',
        18: '糖果系列',
        19: '辣条系列',
        20: '饼干系列'
      };

      return categoryNames[cateId] || `分类${cateId}`;
    },

    // 根据分类名称获取分类页面的categoryType
    getCategoryType(categoryName) {
      const categoryMapping = {
        // 水果类
        '进口水果': 'fruit',
        '有机水果': 'fruit',
        '温带水果': 'fruit',
        '热带水果': 'fruit',
        '水果': 'fruit',

        // 蔬菜类
        '叶菜类': 'vegetable',
        '根茎类': 'vegetable',
        '瓜果类': 'vegetable',
        '有机蔬菜': 'vegetable',
        '蔬菜': 'vegetable',

        // 肉类和海鲜
        '禽畜肉类': 'meat',
        '牛肉类': 'meat',
        '猪肉类': 'meat',
        '鸡肉类': 'meat',
        '肉类': 'meat',
        '海鲜类': 'seafood',
        '海鲜': 'seafood',

        // 零食类
        '休闲零食': 'snacks',
        '薯片系列': 'snacks',
        '糖果系列': 'snacks',
        '辣条系列': 'snacks',
        '饼干系列': 'snacks',
        '零食': 'snacks',

        // 其他类
        '中药材': 'medicine',
        '油粮作物': 'oil',
        '粮食谷物': 'grain',
        '经济作物': 'economic',
        '干果坚果': 'nuts',
        '茶叶': 'tea',
        '饮品': 'snacks',
        '粮油': 'oil',
        '其他': 'hot'
      };

      return categoryMapping[categoryName] || 'hot';
    },

    // 使用默认分类
    useDefaultCategories() {
      console.log('使用默认分类数据');
      this.categoryList = [
        {
          id: 0,
          name: '推荐',
          icon: '/static/images/index/categories/recommend_icon.png',
          isHot: true,
          goodsCount: 0,
          categoryType: 'hot'
        },
        {
          id: 1,
          name: '水果',
          icon: '/static/images/index/categories/fruit_icon.png',
          isHot: false,
          goodsCount: 0,
          categoryType: 'fruit'
        },
        {
          id: 2,
          name: '蔬菜',
          icon: '/static/images/index/categories/vegetable_icon.png',
          isHot: false,
          goodsCount: 0,
          categoryType: 'vegetable'
        },
        {
          id: 3,
          name: '禽畜肉类',
          icon: '/static/images/index/categories/meat_icon.png',
          isHot: false,
          goodsCount: 0,
          categoryType: 'meat'
        },
        {
          id: 4,
          name: '休闲零食',
          icon: '/static/images/index/categories/snack_icon.png',
          isHot: false,
          goodsCount: 0,
          categoryType: 'snacks'
        }
      ];
    },



    // 从拼团商品API加载
    async loadGroupProductsList() {
      try {
        const params = {
          page: 1,
          limit: 10,
          is_host: '1' // 获取推荐拼团商品
        };

        const res = await getUserCombinationList(params);
        if (res.status === 200 && res.data && res.data.list) {
          // 将拼团API返回的商品数据转换为页面需要的格式
          const products = res.data.list.map(item => ({
            id: item.id,
            name: item.title,
            image: this.setDomain(item.image) || '/static/images/today-group-buying/default.png',
            currentPrice: item.group_price,
            originalPrice: item.original_price,
            discount: this.calculateDiscount(item.group_price, item.original_price),
            groupTime: item.time_left ? item.time_left.text : '拼团中',
            hotInfo: `热卖${item.sales || this.generateRandomSales()}+单，每单省${item.save_amount || '10'}元`,
            saveAmount: item.save_amount,
            timeLeftText: item.time_left ? item.time_left.text : null,
            timeLeftSeconds: item.time_left ? item.time_left.total_seconds : 0,
            statusText: item.status_text,
            people: item.people || 2 // 成团人数
          }));

          if (products.length > 0) {
            this.groupBuyingProducts = products;
          }
        }
      } catch (err) {
        console.error('从拼团商品API获取数据失败:', err);
      }
    },

    // 加载推荐拼团商品
    async loadRecommendCombinations() {
      try {
        const res = await getRecommendCombinations({});
        if (res.status === 200 && res.data && Array.isArray(res.data)) {
          // 处理推荐拼团商品数据
          const recommendProducts = res.data.map(item => ({
            id: item.id,
            name: item.title,
            image: this.setDomain(item.image),
            currentPrice: item.group_price,
            originalPrice: item.original_price,
            discount: this.calculateDiscount(item.group_price, item.original_price),
            groupTime: item.time_left ? item.time_left.text : '拼团中',
            hotInfo: `热卖${item.sales || 0}+单`,
            people: item.people || 2,
            timeLeftText: item.time_left ? item.time_left.text : null,
            timeLeftSeconds: item.time_left ? item.time_left.total_seconds : 0
          }));

          // 可以将推荐商品设置为限时秒杀商品
          if (recommendProducts.length > 0) {
            this.flashSaleList = recommendProducts.slice(0, 2).map(item => ({
              id: item.id,
              name: item.name,
              desc: '推荐拼团',
              currentPrice: item.currentPrice,
              originalPrice: item.originalPrice,
              discount: item.discount,
              image: item.image,
              people: item.people
            }));
          }
        }
      } catch (err) {
        console.error('获取推荐拼团商品失败:', err);
      }
    },

    // 使用默认商品数据
    useDefaultProducts() {
      console.log('使用默认商品数据');
      // 保持原有的默认数据
    },

    // 生成随机价格
    generateRandomPrice(min, max) {
      return (Math.random() * (max - min) + min).toFixed(2);
    },

    // 生成随机销量
    generateRandomSales() {
      return Math.floor(Math.random() * 200) + 50; // 50-250之间的随机数
    },

    // 计算折扣
    calculateDiscount(currentPrice, originalPrice) {
      if (!currentPrice || !originalPrice || originalPrice <= currentPrice) {
        return '5.0'; // 默认5折
      }
      const discount = (currentPrice / originalPrice * 10).toFixed(1);
      return discount;
    },



    goBack() {
      uni.navigateBack();
    },

    // 跳转到站点选择页面
    goToStationSelector() {
      uni.navigateTo({
        url: '/pages/community/station-selector/index'
      });
    },

    // 处理搜索
    handleSearch() {
      if (!this.searchKeyword.trim()) {
        uni.showToast({
          title: '请输入搜索内容',
          icon: 'none'
        });
        return;
      }

      // 跳转到搜索页面
      uni.navigateTo({
        url: `/pages/goods/goods_search/index?keyword=${encodeURIComponent(this.searchKeyword)}`
      });
    },

    // 站点选择回调（从站点选择页面返回时调用）
    onStationSelected(station) {
      this.currentStation = station;
      console.log('选择了新站点:', station);

      // 可以在这里重新加载商品数据
      this.loadGroupBuyingData();

      uni.showToast({
        title: `已切换到${station.name}`,
        icon: 'success'
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

    // 分类选择 - 显示对应分类的拼团商品
    selectCategory(category) {
      console.log('选择分类:', category);

      // 显示提示信息
      uni.showToast({
        title: `正在查看${category.name}推荐`,
        icon: 'none',
        duration: 1500
      });

      // 根据分类筛选并显示拼团商品
      if (category.categoryId) {
        this.filterProductsByCategory(category.categoryId);
      } else {
        // 如果没有分类ID，显示默认的拼团商品
        this.loadGroupBuyingData();
      }
    },

    // 根据分类筛选商品
    filterProductsByCategory(categoryId) {
      if (!this.allGoodsData || Object.keys(this.allGoodsData).length === 0) {
        console.log('没有商品数据可筛选');
        return;
      }

      // 查找对应分类的商品
      const categoryData = this.allGoodsData[categoryId];
      if (categoryData && categoryData.goods && categoryData.goods.length > 0) {
        const products = categoryData.goods.map(item => ({
          id: item.id,
          name: item.title,
          image: item.image,
          currentPrice: this.generateRandomPrice(15, 80),
          originalPrice: this.generateRandomPrice(80, 150),
          discount: this.calculateDiscount(15, 80),
          groupTime: '每周一到周五可团',
          hotInfo: `热卖${this.generateRandomSales()}+单，每单省10元`,
          categoryName: categoryData.cate_name,
          categoryId: categoryData.cate_id
        }));

        this.groupBuyingProducts = products;
        console.log(`${categoryData.cate_name}分类商品:`, products);
      } else {
        // 如果该分类没有商品，显示提示
        this.groupBuyingProducts = [];
        uni.showToast({
          title: '该分类暂无商品',
          icon: 'none'
        });
      }
    },

    // 跳转到秒杀列表页面
    goToSeckillList() {
      uni.navigateTo({
        url: '/pages/activity/goods_seckill/index',
        fail: (err) => {
          console.error('跳转秒杀列表失败:', err);
          uni.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    },

    // 团购相关方法
    joinGroupBuy(product) {
      console.log('点击团购商品:', product);

      // 跳转到商品详情页面
      uni.navigateTo({
        url: `/pages/goods_details/index?id=${product.id}&type=group&canBuy=true`,
        fail: (err) => {
          console.error('跳转商品详情失败:', err);
          uni.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
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
}

.back-arrow-icon {
  width: 30rpx; /* 15px * 2 */
  height: 30rpx; /* 15px * 2 */
  filter: brightness(0) invert(1) drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.5));
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
  filter: brightness(0) invert(1) drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.5));
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

.goods-count-tag {
  position: absolute;
  top: -8rpx; /* -4px * 2 */
  right: -12rpx; /* -6px * 2 */
  background-color: #007AFF;
  color: white;
  font-size: 16rpx; /* 8px * 2 */
  padding: 2rpx 8rpx; /* 1px * 2, 4px * 2 */
  border-radius: 16rpx; /* 8px * 2 */
  white-space: nowrap;
  z-index: 1;
  min-width: 32rpx;
  text-align: center;
}

/* 分类提示样式 */
.category-tip {
  text-align: center;
  padding: 20rpx;
  margin-bottom: 20rpx;

  .tip-text {
    font-size: 24rpx;
    color: #999;
    background: #f8f8f8;
    padding: 10rpx 20rpx;
    border-radius: 20rpx;
    display: inline-block;
  }
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

/* 底部安全区域 */
.safe-area-bottom {
  height: 200rpx; /* 100px * 2 - 增加高度避免被tabbar挡住 */
  width: 100%;
}
</style>
