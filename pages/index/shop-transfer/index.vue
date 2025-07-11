<template>
  <view class="shop-transfer">
    <!-- 顶部搜索区域 -->
    <view class="search-container">
      <view class="search-box">
        <text class="iconfont icon-search"></text>
        <input type="text" v-model="keyword" placeholder="搜索商铺名称" placeholder-class="placeholder" />
      </view>
      <view class="search-btn" @click="search">搜索</view>
    </view>
    
    <!-- 筛选条件 -->
    <view class="filter-container">
      <view class="filter-item" @click="toggleFilter('area')">
        <text>{{ selectedArea || '区域' }}</text>
        <view class="arrow-down" :class="{ 'arrow-up': showAreaFilter }"></view>
      </view>
      <view class="filter-item" @click="toggleFilter('price')">
        <text>{{ selectedPrice || '均价' }}</text>
        <view class="arrow-down" :class="{ 'arrow-up': showPriceFilter }"></view>
      </view>
      <view class="filter-item" @click="toggleFilter('type')">
        <text>{{ selectedType || '类型' }}</text>
        <view class="arrow-down" :class="{ 'arrow-up': showTypeFilter }"></view>
      </view>
      <view class="filter-item" @click="toggleFilter('more')">
        <text>{{ selectedMore || '更多' }}</text>
        <view class="arrow-down" :class="{ 'arrow-up': showMoreFilter }"></view>
      </view>
    </view>
    
    <!-- 筛选下拉菜单 -->
    <view class="filter-dropdown" v-if="showAreaFilter">
      <view 
        class="dropdown-item" 
        v-for="(item, index) in areaOptions" 
        :key="index" 
        @click="selectFilter('area', item)"
      >
        <text>{{ item }}</text>
      </view>
    </view>
    
    <view class="filter-dropdown" v-if="showPriceFilter">
      <view 
        class="dropdown-item" 
        v-for="(item, index) in priceOptions" 
        :key="index" 
        @click="selectFilter('price', item)"
      >
        <text>{{ item }}</text>
      </view>
    </view>
    
    <view class="filter-dropdown" v-if="showTypeFilter">
      <view 
        class="dropdown-item" 
        v-for="(item, index) in typeOptions" 
        :key="index" 
        @click="selectFilter('type', item)"
      >
        <text>{{ item }}</text>
      </view>
    </view>
    
    <view class="filter-dropdown" v-if="showMoreFilter">
      <view 
        class="dropdown-item" 
        v-for="(item, index) in moreOptions" 
        :key="index" 
        @click="selectFilter('more', item)"
      >
        <text>{{ item }}</text>
      </view>
    </view>
    
    <!-- 商铺列表 -->
    <scroll-view scroll-y class="shop-list">
      <view class="shop-card" v-for="item in shopList" :key="item.id" @click="viewDetail(item.id)">
        <view class="shop-img">
          <image :src="item.image" mode="aspectFill"></image>
        </view>
        <view class="shop-info">
          <view class="shop-title">{{ item.title }}</view>
          <view class="shop-price">{{ item.price }}</view>
          <view class="shop-address">{{ item.address }}</view>
          <view class="shop-tags">
            <view class="shop-tag" v-for="(tag, tagIndex) in item.tags" :key="tagIndex">{{ tag }}</view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      keyword: '',
      // 筛选相关
      showAreaFilter: false,
      showPriceFilter: false,
      showTypeFilter: false,
      showMoreFilter: false,
      selectedArea: '',
      selectedPrice: '',
      selectedType: '',
      selectedMore: '',
      areaOptions: ['朝阳区', '海淀区', '丰台区', '西城区', '东城区', '通州区', '昌平区'],
      priceOptions: ['1万以下', '1-3万', '3-5万', '5-10万', '10万以上'],
      typeOptions: ['餐饮', '零售', '服装', '美容', '教育', '娱乐'],
      moreOptions: ['面积', '装修', '转让费', '租金'],
      
      // 商铺列表
      shopList: [
        {
          id: 1,
          title: '朝阳区餐饮店转让',
          price: '转让费：5万',
          address: '朝阳区建国路88号',
          image: '/static/images/index/business-info/shop_transfer_bg.jpg',
          tags: ['餐饮', '临街', '可明火']
        },
        {
          id: 2,
          title: '海淀区服装店转让',
          price: '转让费：3万',
          address: '海淀区中关村大街1号',
          image: '/static/images/index/business-info/shop_transfer_bg.jpg',
          tags: ['服装', '商场内', '客流大']
        },
        {
          id: 3,
          title: '西城区美容院转让',
          price: '转让费：8万',
          address: '西城区西单商场附近',
          image: '/static/images/index/business-info/shop_transfer_bg.jpg',
          tags: ['美容', '小区门口', '精装修']
        },
        {
          id: 4,
          title: '丰台区奶茶店转让',
          price: '转让费：2万',
          address: '丰台区丰台科技园',
          image: '/static/images/index/business-info/shop_transfer_bg.jpg',
          tags: ['餐饮', '写字楼', '客流稳定']
        }
      ]
    }
  },
  methods: {
    search() {
      console.log('搜索关键词：', this.keyword);
      // 实现搜索功能
    },
    toggleFilter(type) {
      // 关闭其他筛选
      if (type !== 'area') this.showAreaFilter = false;
      if (type !== 'price') this.showPriceFilter = false;
      if (type !== 'type') this.showTypeFilter = false;
      if (type !== 'more') this.showMoreFilter = false;
      
      // 切换当前筛选
      switch(type) {
        case 'area':
          this.showAreaFilter = !this.showAreaFilter;
          break;
        case 'price':
          this.showPriceFilter = !this.showPriceFilter;
          break;
        case 'type':
          this.showTypeFilter = !this.showTypeFilter;
          break;
        case 'more':
          this.showMoreFilter = !this.showMoreFilter;
          break;
      }
    },
    selectFilter(type, value) {
      switch(type) {
        case 'area':
          this.selectedArea = value;
          this.showAreaFilter = false;
          break;
        case 'price':
          this.selectedPrice = value;
          this.showPriceFilter = false;
          break;
        case 'type':
          this.selectedType = value;
          this.showTypeFilter = false;
          break;
        case 'more':
          this.selectedMore = value;
          this.showMoreFilter = false;
          break;
      }
      
      // 应用筛选
      this.applyFilters();
    },
    applyFilters() {
      console.log('应用筛选：', {
        area: this.selectedArea,
        price: this.selectedPrice,
        type: this.selectedType,
        more: this.selectedMore
      });
      // 实现筛选逻辑
    },
    viewDetail(id) {
      uni.navigateTo({
        url: `/pages/index/shop-transfer/detail?id=${id}`
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.shop-transfer {
  min-height: 100vh;
  background-color: #F5F5F5;
}

/* 搜索区域样式 */
.search-container {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #FFFFFF;
  
  .search-box {
    flex: 1;
    height: 70rpx;
    background-color: #F5F5F5;
    border-radius: 35rpx;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    
    .iconfont {
      font-size: 32rpx;
      color: #999999;
      margin-right: 10rpx;
    }
    
    input {
      flex: 1;
      height: 70rpx;
      font-size: 28rpx;
    }
    
    .placeholder {
      color: #999999;
    }
  }
  
  .search-btn {
    width: 120rpx;
    height: 70rpx;
    line-height: 70rpx;
    text-align: center;
    font-size: 28rpx;
    color: #333333;
    margin-left: 20rpx;
  }
}

/* 筛选条件样式 */
.filter-container {
  display: flex;
  height: 80rpx;
  background-color: #FFFFFF;
  border-bottom: 1rpx solid #EEEEEE;
  
  .filter-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: #333333;
    position: relative;
    
    .arrow-down {
      width: 0;
      height: 0;
      border-left: 10rpx solid transparent;
      border-right: 10rpx solid transparent;
      border-top: 10rpx solid #333333;
      margin-left: 10rpx;
      transition: transform 0.3s;
    }
    
    .arrow-up {
      transform: rotate(180deg);
    }
  }
}

/* 筛选下拉菜单样式 */
.filter-dropdown {
  position: absolute;
  left: 0;
  right: 0;
  background-color: #FFFFFF;
  z-index: 10;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
  max-height: 400rpx;
  overflow-y: auto;
  
  .dropdown-item {
    height: 80rpx;
    line-height: 80rpx;
    padding: 0 30rpx;
    font-size: 28rpx;
    color: #333333;
    border-bottom: 1rpx solid #F5F5F5;
    
    &:active {
      background-color: #F5F5F5;
    }
  }
}

/* 商铺列表样式 */
.shop-list {
  padding: 20rpx;
  height: calc(100vh - 170rpx);
}

.shop-card {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  
  .shop-img {
    width: 100%;
    height: 300rpx;
    
    image {
      width: 100%;
      height: 100%;
    }
  }
  
  .shop-info {
    padding: 20rpx;
    
    .shop-title {
      font-size: 32rpx;
      color: #333333;
      font-weight: 500;
      margin-bottom: 10rpx;
    }
    
    .shop-price {
      font-size: 30rpx;
      color: #FF7E00;
      font-weight: 500;
      margin-bottom: 10rpx;
    }
    
    .shop-address {
      font-size: 26rpx;
      color: #666666;
      margin-bottom: 16rpx;
    }
    
    .shop-tags {
      display: flex;
      flex-wrap: wrap;
      
      .shop-tag {
        font-size: 24rpx;
        color: #666666;
        background-color: #F5F5F5;
        padding: 4rpx 16rpx;
        border-radius: 20rpx;
        margin-right: 16rpx;
        margin-bottom: 10rpx;
      }
    }
  }
}
</style>
