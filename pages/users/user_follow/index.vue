<template>
  <view class="user-follow-page">
    <!-- 使用通用头部导航组件 -->
    <CommonHeader title="我的关注" @back="goBack"></CommonHeader>

    <!-- Tab切换区域 -->
    <view class="tab-section">
      <view class="tab-container">
        <view
          class="tab-item"
          :class="{'active': currentTab === 0}"
          @click="switchTab(0)">
          租售信息
        </view>
        <view
          class="tab-item"
          :class="{'active': currentTab === 1}"
          @click="switchTab(1)">
          商业信息
        </view>
        <view class="tab-slider" :style="{left: currentTab === 0 ? 'calc(25% - 40rpx)' : 'calc(75% - 40rpx)'}" />
      </view>
    </view>
    <!-- 搜索框 -->
    <view class="search-bar">
      <image class="search-icon" src="@/static/icons/search.svg" />
      <input class="search-input" placeholder="搜索" />
    </view>
    <view class="follow-list-container">
      <!-- 租售信息列表 -->
      <view class="follow-list" v-show="currentTab === 0">
        <view 
          class="follow-item" 
          v-for="(item, index) in rentalList" 
          :key="index"
          @click="goToStore(item)">
          <image class="store-logo" :src="item.logo" mode="aspectFill"></image>
          <view class="store-info">
            <view class="store-name">{{item.name}}</view>
            <view class="follow-time">{{item.followTime}}</view>
          </view>
          <view class="follow-btn" @click.stop="toggleFollow(item, 'rental')">
            <text class="iconfont icon-xuanze"></text>
            <text>已关注</text>
          </view>
        </view>
      </view>
      <!-- 商业信息列表 -->
      <view class="follow-list" v-show="currentTab === 1">
        <view 
          class="follow-item" 
          v-for="(item, index) in businessList" 
          :key="index"
          @click="goToStore(item)">
          <image class="store-logo" :src="item.logo" mode="aspectFill"></image>
          <view class="store-info">
            <view class="store-name">{{item.name}}</view>
            <view class="follow-time">{{item.followTime}}</view>
          </view>
          <view class="follow-btn" @click.stop="toggleFollow(item, 'business')">
            <text class="iconfont icon-xuanze"></text>
            <text>已关注</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import CommonHeader from '@/components/CommonHeader/index.vue';

export default {
  components: {
    CommonHeader
  },
  data() {
    return {
      currentTab: 0,
      rentalList: [
        {
          id: 1,
          name: '瑞幸咖啡.三里屯店',
          logo: '/static/images/follows/store_rental_1.jpg',
          followed: true,
          followTime: '5天前关注'
        },
        {
          id: 2,
          name: '天天食品专卖店',
          logo: '/static/images/follows/store_rental_2.jpg',
          followed: true,
          followTime: '5天前关注'
        },
        {
          id: 3,
          name: '德芙专卖店',
          logo: '/static/images/follows/store_rental_3.jpg',
          followed: true,
          followTime: '1个月前关注'
        },
        {
          id: 4,
          name: '时刻生鲜专卖店',
          logo: '/static/images/follows/store_rental_4.jpg',
          followed: true,
          followTime: '1个月前关注'
        }
      ],
      businessList: [
        {
          id: 1,
          name: '优选咖啡',
          logo: '/static/images/follows/store_business_1.jpg',
          followed: true,
          followTime: '2天前关注'
        },
        {
          id: 2,
          name: '鲜果便利店',
          logo: '/static/images/follows/store_business_2.jpg',
          followed: true,
          followTime: '3天前关注'
        },
        {
          id: 3,
          name: '健身工作室',
          logo: '/static/images/follows/store_business_3.jpg',
          followed: true,
          followTime: '1周前关注'
        },
        {
          id: 4,
          name: '阅读书店',
          logo: '/static/images/follows/store_business_4.jpg',
          followed: true,
          followTime: '2周前关注'
        }
      ]
    }
  },
  onLoad(options) {
    if (options.tab) {
      this.currentTab = parseInt(options.tab) || 0;
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    switchTab(index) {
      this.currentTab = index;
    },
    toggleFollow(item, listType) {
      // 更新关注状态
      item.followed = !item.followed;
      
      // 这里应该调用API更新关注状态
      uni.showToast({
        title: item.followed ? '已关注' : '已取消关注',
        icon: 'none'
      });
      
      // 如果取消关注，可以从列表中移除
      if (!item.followed) {
        setTimeout(() => {
          if (listType === 'rental') {
            this.rentalList = this.rentalList.filter(store => store.id !== item.id);
          } else {
            this.businessList = this.businessList.filter(store => store.id !== item.id);
          }
        }, 500);
      }
    },
    goToStore(item) {
      // 跳转到店铺详情页
      uni.navigateTo({
        url: '/pages/store/detail?id=' + item.id
      });
    }
  }
}
</script>

<style lang="scss">
.user-follow-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  position: relative;

  .header-section {
    position: relative;

    .header-gradient {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%; // 覆盖整个头部区域
      z-index: 0;
      background: linear-gradient(180deg, #fef3df 0%, #fff 100%);
    }

    .header {
      height: 88rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background: transparent;
      z-index: 1;
      .back-btn {
        position: absolute;
        left: 30rpx;
        display: flex;
        align-items: center;

        .iconfont {
          font-size: 36rpx;
          color: #333;
          margin-right: 16rpx;
        }

        .back-text {
          font-size: 32rpx;
          color: #333;
        }
      }
      .page-title {
        font-size: 36rpx;
        font-weight: 500;
        color: #333;
      }
    }

    .tab-container {
      display: flex;
      position: relative;
      background: transparent;
      z-index: 1;
      padding: 0 20rpx;
      .tab-item {
        flex: 1;
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
        color: #333;
        position: relative;
        &.active {
          color: #fe8d00;
          font-weight: 500;
        }
      }
      .tab-slider {
        position: absolute;
        bottom: 0;
        width: 80rpx;
        height: 4rpx;
        background-color: #fe8d00;
        transition: left 0.3s ease;
      }
    }
  }
  .search-bar {
    margin: 0 24rpx 0 24rpx;
    margin-top: 16rpx;
    height: 64rpx;
    background: #fff;
    border-radius: 32rpx;
    display: flex;
    align-items: center;
    padding: 0 24rpx;
    box-shadow: 0 2rpx 8rpx 0 rgba(0,0,0,0.04);
    border: none;
    .search-icon {
      width: 36rpx;
      height: 36rpx;
      margin-right: 12rpx;
      filter: grayscale(1) brightness(1.6); // 让icon更浅
    }
    .search-input {
      flex: 1;
      border: none;
      background: transparent;
      font-size: 28rpx;
      color: #e5e5e5;
      outline: none;
      &::placeholder {
        color: #e5e5e5;
      }
    }
  }
  .follow-list-container {
    flex: 1;
    overflow: hidden;
    margin-top: 8rpx;
    .follow-list {
      padding: 0 20rpx;
      .follow-item {
        display: flex;
        align-items: center;
        padding: 30rpx 0 30rpx 0;
        border-bottom: 1px solid #f0f0f0;
        background-color: #fff;
        .store-logo {
          width: 72rpx;
          height: 72rpx;
          border-radius: 50%;
          margin-right: 20rpx;
        }
        .store-info {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .store-name {
            font-size: 30rpx;
            color: #222;
            font-weight: 500;
            margin-bottom: 6rpx;
          }
          .follow-time {
            font-size: 22rpx;
            color: #b3b3b3;
          }
        }
        .follow-btn {
          width: 120rpx;
          height: 48rpx;
          border-radius: 24rpx;
          border: 1px solid #d9d9d9;
          background: #fff;
          color: #b3b3b3;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26rpx;
          .iconfont {
            margin-right: 6rpx;
            font-size: 24rpx;
            color: #b3b3b3;
          }
        }
      }
    }
  }
}
</style> 