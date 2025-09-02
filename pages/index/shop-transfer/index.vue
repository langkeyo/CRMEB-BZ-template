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
    <scroll-view scroll-y class="shop-list" @scrolltolower="onLoadMore">
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
      
      <!-- 加载状态 -->
      <view class="loading-more" v-if="loading">
        <text class="loading-text">加载中...</text>
      </view>
      
      <!-- 没有更多 -->
      <view class="no-more" v-if="!loading && loadEnd && shopList.length > 0">
        <text class="no-more-text">没有更多了</text>
      </view>
      
      <!-- 空状态 -->
      <view class="empty-state" v-if="!loading && shopList.length === 0">
        <image class="empty-icon" src="/static/images/empty.png" mode="aspectFit"></image>
        <text class="empty-text">暂无商铺信息</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { getHouseRentalList } from '@/api/group.js';
import { HTTP_REQUEST_URL } from '@/config/app.js';

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
      shopList: [],
      loading: false,
      loadEnd: false,
      page: 1,
      limit: 10,
      total: 0,
      queryParams: {
        page: 1,
        limit: 10,
        keyword: '',
        type: '1' // 默认查询类型为商铺转让
      }
    }
  },
  onLoad() {
    this.loadShopList();
  },
  methods: {
    search() {
      this.queryParams.search = this.keyword;
      this.queryParams.page = 1;
      this.shopList = [];
      this.loadEnd = false;
      this.loadShopList();
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
      // 重置分页并应用筛选条件
      this.queryParams.page = 1;
      this.shopList = [];
      this.loadEnd = false;
      
      // 区域筛选
      if (this.selectedArea && this.selectedArea !== '全部区域') {
        this.queryParams.area = this.selectedArea;
      } else {
        this.queryParams.area = '';
      }
      
      // 价格筛选
      if (this.selectedPrice) {
        if (this.selectedPrice === '1万以下') {
          this.queryParams.price_max = '10000';
          this.queryParams.price_min = '0';
        } else if (this.selectedPrice === '1-3万') {
          this.queryParams.price_min = '10000';
          this.queryParams.price_max = '30000';
        } else if (this.selectedPrice === '3-5万') {
          this.queryParams.price_min = '30000';
          this.queryParams.price_max = '50000';
        } else if (this.selectedPrice === '5-10万') {
          this.queryParams.price_min = '50000';
          this.queryParams.price_max = '100000';
        } else if (this.selectedPrice === '10万以上') {
          this.queryParams.price_min = '100000';
          this.queryParams.price_max = '';
        } else {
          this.queryParams.price_min = '';
          this.queryParams.price_max = '';
        }
      }
      
      // 类型筛选
      if (this.selectedType) {
        this.queryParams.business_type = this.selectedType;
      } else {
        this.queryParams.business_type = '';
      }
      
      this.loadShopList();
    },
    // 加载商铺列表
    loadShopList() {
      if (this.loading) return;
      
      this.loading = true;
      uni.showLoading({
        title: '加载中...'
      });
      
      getHouseRentalList(this.queryParams).then(res => {
        uni.hideLoading();
        this.loading = false;
        
        if (res.status === 200 && res.data) {
          const newList = res.data.list || [];
          
          // 处理数据格式
          const formattedList = newList.map(item => ({
            id: item.id,
            title: item.title || '',
            price: item.price ? `¥${item.price}${item.unit || '/月'}` : '价格面议',
            address: item.address || '',
            image: this.setDomain(item.image),
            tags: item.tags ? item.tags.split(',') : []
          }));
          
          this.shopList = [...this.shopList, ...formattedList];
          this.total = res.data.count || 0;
          this.loadEnd = this.shopList.length >= this.total;
          
          // 更新页码
          if (!this.loadEnd) {
            this.queryParams.page++;
          }
        } else {
          uni.showToast({
            title: res.msg || '加载失败',
            icon: 'none'
          });
        }
      }).catch(err => {
        uni.hideLoading();
        this.loading = false;
        uni.showToast({
          title: '网络错误',
          icon: 'none'
        });
        console.error('加载商铺列表失败:', err);
      });
    },
    viewDetail(id) {
      uni.navigateTo({
        url: `/pages/index/shop-transfer/detail?id=${id}`
      });
    },
    // 加载更多
    onLoadMore() {
      if (!this.loadEnd && !this.loading) {
        this.loadShopList();
      }
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

/* 加载状态 */
.loading-more, .no-more {
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  
  .loading-text, .no-more-text {
    font-size: 28rpx;
    color: #999;
  }
}

/* 空状态 */
.empty-state {
  padding: 100rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  .empty-icon {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 30rpx;
  }
  
  .empty-text {
    font-size: 30rpx;
    color: #999;
  }
}
</style>
