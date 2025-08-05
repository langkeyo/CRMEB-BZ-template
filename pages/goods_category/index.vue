<template>
  <view class="category-page">
    <!-- 状态栏 -->
    <view class="status-bar" :style="'height:' + statusBarHeight + 'px'"></view>

    <!-- 搜索区域 -->
    <view class="search-box">
      <view class="search-input">
        <text class="search-icon" @click="search"></text>
        <input type="text" v-model="keyword" placeholder="搜索想要商品关键词" confirm-type="search" @confirm="search" />
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
        <!-- 动态组件切换 -->
        <CategoryContent :categoryType="currentCategory.id" @switchToHot="switchToHot" />
      </scroll-view>
    </view>

    <!-- 底部导航栏 -->
    <customTabbar></customTabbar>
  </view>
</template>

<script>
import customTabbar from '@/components/customTabbar/index.vue';
import CategoryContent from './components/CategoryContent.vue';

export default {
  components: {
    customTabbar,
    CategoryContent
  },
  data() {
    return {
      statusBarHeight: 20, // 默认状态栏高度，会在onLoad中获取真实值
      keyword: '',
      currentCategoryIndex: 0,
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
      ]
    }
  },
  computed: {
    currentCategory() {
      return this.categories[this.currentCategoryIndex];
    }
  },
  onLoad(options) {
    // 获取状态栏高度
    this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;

    // 处理从其他页面传递的分类参数
    if (options.categoryType) {
      this.handleCategoryFromParams(options.categoryType, options.categoryName);
    }
  },
  methods: {
    // 搜索商品
    search() {
      if (!this.keyword.trim()) return;
      uni.navigateTo({
        url: `/pages/goods/goods_list/index?searchValue=${encodeURIComponent(this.keyword)}`
      });
    },

    // 选择分类
    selectCategory(index) {
      this.currentCategoryIndex = index;
      // 现在使用组件切换，不需要跳转页面
    },

    // 切换到热门分类
    switchToHot() {
      this.currentCategoryIndex = 0; // 热门分类是第一个
    },

    // 处理从其他页面传递的分类参数
    handleCategoryFromParams(categoryType, categoryName) {
      console.log('接收到分类参数:', categoryType, categoryName);

      // 根据categoryType找到对应的分类索引
      const categoryIndex = this.categories.findIndex(cat => cat.id === categoryType);

      if (categoryIndex !== -1) {
        // 设置当前分类
        this.currentCategoryIndex = categoryIndex;

        // 显示提示信息
        if (categoryName) {
          uni.showToast({
            title: `已切换到${decodeURIComponent(categoryName)}分类`,
            icon: 'none',
            duration: 2000
          });
        }

        console.log(`已切换到分类: ${this.categories[categoryIndex].name}`);
      } else {
        // 如果没找到对应分类，默认显示热门分类
        this.currentCategoryIndex = 0;
        console.log('未找到对应分类，显示热门分类');
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.category-page {
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  background-color: #F0F0F0;
}

/* 状态栏 */
.status-bar {
  background-color: #FFFFFF;
}

/* 搜索框 */
.search-box {
  background-color: #FFFFFF;
  padding: 10px 16px;
}

.search-input {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #F7F7F7;
  border-radius: 4px;
  height: 36px;
  padding: 0 15px;
}

.search-icon {
  width: 15px;
  height: 15px;
  margin-right: 14px;
  position: relative;
  z-index: 2;
  flex-shrink: 0;
}

.search-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #666666;
  -webkit-mask: url('/static/common/icons/action/search.svg') no-repeat center;
  mask: url('/static/common/icons/action/search.svg') no-repeat center;
  -webkit-mask-size: contain;
  mask-size: contain;
}

.search-input input {
  flex: 1;
  height: 36px;
  font-size: 12px;
  color: #333333;
  font-family: 'PingFang SC';
  font-weight: 400;
  line-height: 17px;
}

.search-input input::placeholder {
  color: #CCCCCC;
}

/* 主要内容区 */
.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 左侧分类导航 */
.category-nav {
  width: 160rpx;
  background-color: #F7F7F7;
}

.nav-item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100rpx;
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 26rpx;
  color: #666666;
  position: relative;
  text-align: center;
  padding: 0 10rpx;
}

.nav-item.active {
  background-color: #FFFFFF;
  color: #1A1A1A;
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
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

/* 热门分类特殊样式 */
.nav-item:first-child {
  color: #333333;
}

/* 右侧内容区 */
.content-area {
  flex: 1;
}







/* 导航栏文字样式 - 防止价格显示 */
.category-nav .nav-item text {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

/* 导航栏文字样式 */
.nav-item-text {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}



/* 底部导航栏由pageFooter组件提供 */
</style>