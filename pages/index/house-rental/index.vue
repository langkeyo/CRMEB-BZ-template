<template>
  <view class="house-rental">
    <!-- 遮罩层 -->
    <view class="mask-layer" v-if="showAreaFilter || showPriceFilter || showSizeFilter || showTypeFilter" @click="closeAllFilters"></view>

    <!-- header-section 按照Figma规范 -->
    <view class="header-section">
      <!-- Rectangle 1282 白色背景 -->
      <view class="header-background"></view>



      <!-- seach-section 搜索区域 -->
      <view class="search-section">
        <!-- back-icon 返回按钮 -->
        <view class="back-icon" @click="goBack">
          <view class="back-arrow"></view>
        </view>

        <!-- Rectangle 44 搜索框 -->
        <view class="search-box">
          <!-- search-icon -->
          <view class="search-icon"></view>
          <!-- 朝阳区 -->
          <input type="text" v-model="keyword" placeholder="朝阳区" placeholder-class="search-placeholder" />
        </view>
      </view>

      <!-- nav-btns 导航按钮 -->
      <view class="nav-btns">
        <!-- Group 23 区域 -->
        <view class="nav-item" @click="toggleFilter('area')">
          <text class="nav-text">{{ selectedArea || '区域' }}</text>
          <view class="nav-arrow" :class="{ 'arrow-up': showAreaFilter }"></view>
        </view>

        <!-- Group 24 均价 -->
        <view class="nav-item" @click="toggleFilter('price')">
          <text class="nav-text">{{ selectedPrice || '均价' }}</text>
          <view class="nav-arrow" :class="{ 'arrow-up': showPriceFilter }"></view>
        </view>

        <!-- Group 25 面积 -->
        <view class="nav-item" @click="toggleFilter('size')">
          <text class="nav-text">{{ selectedSize || '面积' }}</text>
          <view class="nav-arrow" :class="{ 'arrow-up': showSizeFilter }"></view>
        </view>

        <!-- Group 26 更多 -->
        <view class="nav-item" @click="toggleFilter('type')">
          <text class="nav-text">更多</text>
          <view class="nav-arrow" :class="{ 'arrow-up': showTypeFilter }"></view>
        </view>
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

    <view class="filter-dropdown" v-if="showSizeFilter">
      <view
        class="dropdown-item"
        v-for="(item, index) in sizeOptions"
        :key="index"
        @click="selectFilter('size', item)"
      >
        <text>{{ item }}</text>
      </view>
    </view>

    <view class="filter-dropdown type-filter" v-if="showTypeFilter">
      <view
        class="dropdown-item"
        v-for="(item, index) in typeOptions"
        :key="index"
        @click="selectFilter('type', item)"
      >
        <text>{{ item }}</text>
      </view>
    </view>

    <!-- 房源列表 -->
    <scroll-view scroll-y class="house-list">
      <view class="house-grid">
        <view class="house-card" v-for="item in houseList" :key="item.id" @click="viewDetail(item.id)">
          <view class="house-img">
            <image :src="setDomain(item.image)" mode="aspectFill"></image>
          </view>
          <view class="house-info">
            <view class="house-title">{{ item.title }}</view>
            <view class="house-bottom-row">
              <view class="house-address">{{ item.district }}{{ item.business_district ? ' ' + item.business_district : '' }}</view>
              <view class="house-detail-link">
                <text>查看详情</text>
                <image src="/static/icons/arrow-right.svg" class="arrow-icon"></image>
              </view>
            </view>
          </view>
        </view>
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
      showSizeFilter: false,
      showTypeFilter: false,
      selectedArea: '',
      selectedPrice: '',
      selectedSize: '',
      selectedType: '租商铺',
      areaOptions: ['朝阳区', '海淀区', '丰台区', '西城区', '东城区', '通州区', '昌平区', '顺义区'],
      priceOptions: ['2000以下', '2000-3000', '3000-4000', '4000-5000', '5000以上'],
      sizeOptions: ['50㎡以下', '50-70㎡', '70-90㎡', '90-110㎡', '110㎡以上'],
      typeOptions: ['租商铺', '租房屋', '出售'],

      // 查询参数
      queryParams: {
        search: '',
        type: '',
        district: '',
        system_sort: '',
        acreage_nin: '',
        acreage_max: '',
        price_min: '',
        price_max: '',
        page: 1,
        limit: 10
      },
      
      // 房屋租售列表
      houseList: [],
      total: 0,
      loading: false,
      finished: false
    }
  },
  onLoad() {
    this.getHouseList();
  },
  onReachBottom() {
    if (!this.finished && !this.loading) {
      this.queryParams.page++;
      this.getHouseList(true);
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },

    closeAllFilters() {
      this.showAreaFilter = false;
      this.showPriceFilter = false;
      this.showSizeFilter = false;
      this.showTypeFilter = false;
    },
    
    search() {
      this.queryParams.search = this.keyword;
      this.queryParams.page = 1;
      this.getHouseList();
    },

    toggleFilter(type) {
      // 关闭其他筛选
      if (type !== 'area') this.showAreaFilter = false;
      if (type !== 'price') this.showPriceFilter = false;
      if (type !== 'size') this.showSizeFilter = false;
      if (type !== 'type') this.showTypeFilter = false;

      // 切换当前筛选
      switch(type) {
        case 'area':
          this.showAreaFilter = !this.showAreaFilter;
          break;
        case 'price':
          this.showPriceFilter = !this.showPriceFilter;
          break;
        case 'size':
          this.showSizeFilter = !this.showSizeFilter;
          break;
        case 'type':
          this.showTypeFilter = !this.showTypeFilter;
          break;
      }
    },
    
    selectFilter(type, value) {
      switch(type) {
        case 'area':
          this.selectedArea = value;
          this.queryParams.district = value === '全部区域' ? '' : value;
          this.showAreaFilter = false;
          break;
        case 'price':
          this.selectedPrice = value;
          this.showPriceFilter = false;
          // 处理价格范围
          if (value === '2000以下') {
            this.queryParams.price_max = '2000';
            this.queryParams.price_min = '';
          } else if (value === '2000-3000') {
            this.queryParams.price_min = '2000';
            this.queryParams.price_max = '3000';
          } else if (value === '3000-4000') {
            this.queryParams.price_min = '3000';
            this.queryParams.price_max = '4000';
          } else if (value === '4000-5000') {
            this.queryParams.price_min = '4000';
            this.queryParams.price_max = '5000';
          } else if (value === '5000以上') {
            this.queryParams.price_min = '5000';
            this.queryParams.price_max = '';
          } else {
            this.queryParams.price_min = '';
            this.queryParams.price_max = '';
          }
          break;
        case 'size':
          this.selectedSize = value;
          this.showSizeFilter = false;
          // 处理面积范围
          if (value === '50㎡以下') {
            this.queryParams.acreage_max = '50';
            this.queryParams.acreage_nin = '';
          } else if (value === '50-70㎡') {
            this.queryParams.acreage_nin = '50';
            this.queryParams.acreage_max = '70';
          } else if (value === '70-90㎡') {
            this.queryParams.acreage_nin = '70';
            this.queryParams.acreage_max = '90';
          } else if (value === '90-110㎡') {
            this.queryParams.acreage_nin = '90';
            this.queryParams.acreage_max = '110';
          } else if (value === '110㎡以上') {
            this.queryParams.acreage_nin = '110';
            this.queryParams.acreage_max = '';
          } else {
            this.queryParams.acreage_nin = '';
            this.queryParams.acreage_max = '';
          }
          break;
        case 'type':
          this.selectedType = value;
          this.showTypeFilter = false;
          // 处理类型
          if (value === '租商铺') {
            this.queryParams.type = '1';
          } else if (value === '租房屋') {
            this.queryParams.type = '2';
          } else if (value === '出售') {
            this.queryParams.type = '0';
          } else {
            this.queryParams.type = '';
          }
          break;
      }

      // 应用筛选
      this.queryParams.page = 1;
      this.getHouseList();
    },
    
    // 获取房屋租售列表
    getHouseList(isLoadMore = false) {
      if (this.loading) return;
      this.loading = true;
      
      uni.showLoading({
        title: '加载中...'
      });
      
      getHouseRentalList(this.queryParams).then(res => {
        uni.hideLoading();
        this.loading = false;
        
        if (res.status === 200 && res.data) {
          if (isLoadMore) {
            this.houseList = [...this.houseList, ...res.data.list];
          } else {
            this.houseList = res.data.list || [];
          }

          this.total = res.data.count || 0;
          this.finished = this.houseList.length >= this.total;
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
          title: err || '加载失败',
          icon: 'none'
        });
      });
    },
    
    viewDetail(id) {
      uni.navigateTo({
        url: '/pages/index/house-rental/detail?id=' + id
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
    }
  }
};
</script>

<style lang="scss" scoped>
.house-rental {
  height: 100vh;
  background-color: #F5F5F5;
  position: relative;
}

/* 遮罩层样式 */
.mask-layer {
  position: fixed;
  top: 188rpx; /* header-section高度 94px * 2 */
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 5;
}

/* header-section 使用Flex布局 */
.header-section {
  width: 100%;
  height: 188rpx; /* 94px * 2 (去掉状态栏44px后的高度) */
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  padding-top: 20rpx; /* 10px * 2 顶部间距 */

  /* search-section 搜索区域 */
  .search-section {
    height: 72rpx; /* 36px * 2 */
    display: flex;
    align-items: center;
    padding: 0 24rpx; /* 12px * 2 */
    margin-top: 16rpx; /* 8px * 2 */

    /* back-icon 返回按钮 */
    .back-icon {
      width: 64rpx; /* 32px * 2 */
      height: 64rpx; /* 32px * 2 */
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20rpx; /* 10px * 2 */
      cursor: pointer;

      .back-arrow {
        width: 25rpx; /* 12.5px * 2 */
        height: 25rpx; /* 12.5px * 2 */
        border-left: 3rpx solid #333333;
        border-bottom: 3rpx solid #333333;
        transform: rotate(45deg);
      }
    }

    /* Rectangle 44 搜索框 */
    .search-box {
      flex: 1;
      height: 72rpx; /* 36px * 2 */
      background: #F8F8F8;
      border-radius: 36rpx; /* 18px * 2 */
      display: flex;
      align-items: center;
      padding: 0 24rpx; /* 12px * 2 */

      /* search-icon */
      .search-icon {
        width: 30rpx; /* 15px * 2 */
        height: 30rpx; /* 15px * 2 */
        margin-right: 16rpx; /* 8px * 2 */
        position: relative;

        &::before {
          content: '';
          position: absolute;
          width: 16rpx;
          height: 16rpx;
          border: 3rpx solid #BABABA;
          border-radius: 50%;
          left: 2rpx;
          top: 2rpx;
        }

        &::after {
          content: '';
          position: absolute;
          width: 10rpx;
          height: 3rpx;
          background: #BABABA;
          right: 2rpx;
          bottom: 2rpx;
          transform: rotate(45deg);
          border-radius: 2rpx;
        }
      }

      /* 朝阳区 输入框 */
      input {
        flex: 1;
        height: 72rpx; /* 36px * 2 */
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 30rpx; /* 15px * 2 */
        line-height: 42rpx; /* 21px * 2 */
        color: #000000;
        background: transparent;
        border: none;
        outline: none;
      }

      .search-placeholder {
        color: #BABABA;
      }
    }
  }

  /* nav-btns 导航按钮 */
  .nav-btns {
    height: 68rpx; /* 34px * 2 */
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0 24rpx; /* 12px * 2 */
    margin-top: 16rpx; /* 8px * 2 */
    position: relative;

    /* Group 23, 24, 25, 26 导航项 */
    .nav-item {
      display: flex;
      align-items: center;
      cursor: pointer;

      .nav-text {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 28rpx; /* 14px * 2 */
        line-height: 40rpx; /* 20px * 2 */
        color: #000000;
        margin-right: 8rpx; /* 4px * 2 */
      }

      /* Polygon 箭头 */
      .nav-arrow {
        width: 0;
        height: 0;
        border-left: 9rpx solid transparent;
        border-right: 9rpx solid transparent;
        border-top: 9rpx solid #333333;
        transition: transform 0.3s;

        &.arrow-up {
          transform: rotate(180deg);
        }
      }
    }
  }
}



/* 筛选下拉菜单样式 */
.filter-dropdown {
  position: fixed;
  top: 188rpx; /* header-section高度 */
  left: 0;
  right: 0;
  background: #FFFFFF;
  z-index: 20; /* 确保比遮罩层z-index高 */

  .dropdown-item {
    height: 80rpx;
    line-height: 80rpx;
    padding: 0 24rpx; /* 12px * 2 与导航左侧对齐 */
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 28rpx; /* 14px * 2 */
    color: #333333;
    border-bottom: 1rpx solid #F5F5F5;

    &:active {
      background-color: #F5F5F5;
    }
  }
}

/* more-menu 更多菜单特殊样式 */
.filter-dropdown.type-filter {
  /* Rectangle 1427 */
  width: 750rpx; /* 375px * 2 */
  height: 302rpx; /* 151px * 2 */

  .dropdown-item {
    height: 96rpx; /* 48px * 2 */
    line-height: 40rpx; /* 20px * 2 */
    padding: 28rpx 0 28rpx 70rpx; /* 与"区域"文字左对齐 */
    display: flex;
    align-items: center;

    /* 租商铺 - 第一项有额外的顶部间距 */
    &:first-child {
      margin-top: 28rpx; /* 14px * 2 */
    }
  }
}

/* 房源列表样式 */
.house-list {
  padding: 20rpx;
  margin-top: 188rpx; /* header-section高度 94px * 2 */
  padding-bottom: 40rpx; /* 底部间距 */
}

.house-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

/* card 房源卡片 - 按照新Figma规范 */
.house-card {
  width: 340rpx; /* 170px * 2 */
  height: 544rpx; /* 272px * 2 */
  margin-bottom: 20rpx;
  position: relative;

  /* bg-image 背景图片 */
  .house-img {
    width: 340rpx; /* 170px * 2 */
    height: 544rpx; /* 272px * 2 */
    border-radius: 12rpx; /* 6px * 2 */
    overflow: hidden;
    position: relative;

    image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  /* Rectangle 245 底部信息区域 */
  .house-info {
    position: absolute;
    width: 340rpx; /* 170px * 2 */
    height: 130rpx; /* 65px * 2 */
    bottom: 0;
    left: 0;
    background: #FFFFFF;
    border-radius: 0 0 8rpx 8rpx; /* 0 0 4px 4px */

    /* shop-name 商铺名称 */
    .house-title {
      position: absolute;
      width: 272rpx; /* 64px * 2 */
      height: 44rpx; /* 22px * 2 */
      left: 16rpx; /* 8px * 2 */
      top: 22rpx; /* 11px * 2 */
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 32rpx; /* 16px * 2 */
      line-height: 44rpx; /* 22px * 2 */
      color: #1A1A1A;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* 底部行 */
    .house-bottom-row {
      position: absolute;
      left: 16rpx; /* 8px * 2 */
      top: 74rpx; /* 37px * 2 */
      width: 308rpx; /* 154px * 2 */
      height: 34rpx; /* 17px * 2 */
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* location 位置信息 - 朝阳 三里屯 */
    .house-address {
      width: 136rpx; /* 68px * 2 */
      height: 34rpx; /* 17px * 2 */
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

    /* view-detail-btn 查看详情按钮 */
    .house-detail-link {
      // width: 118rpx; /* 59px * 2 */
      height: 34rpx; /* 17px * 2 */
      display: flex;
      align-items: center;

      /* 查看详情文字 */
      text {
        width: 96rpx; /* 48px * 2 */
        height: 34rpx; /* 17px * 2 */
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 24rpx; /* 12px * 2 */
        line-height: 34rpx; /* 17px * 2 */
        color: #B3B3B3;
      }

      /* Vector 16 箭头 */
      .arrow-icon {
        width: 18rpx; /* 9px * 2 */
        height: 18rpx; /* 9px * 2 */
        margin-left: 8rpx; /* 4px * 2 */
      }
    }
  }
}


</style>
