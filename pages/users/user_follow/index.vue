<template>
  <view class="user-follow-page">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="back-icon" @click="goBack">
        <text class="iconfont icon-left"></text>
      </view>
      <view class="page-title">我的关注</view>
    </view>
    
    <!-- Tab切换 -->
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
      <view class="tab-slider" :style="{transform: `translateX(${currentTab * 375}rpx)`}"></view>
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
            <view class="store-desc">{{item.description}}</view>
          </view>
          <view class="follow-btn" @click.stop="toggleFollow(item, 'rental')">
            <text class="iconfont" :class="item.followed ? 'icon-xuanze' : 'icon-add'"></text>
            <text>{{item.followed ? '已关注' : '关注'}}</text>
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
            <view class="store-desc">{{item.description}}</view>
          </view>
          <view class="follow-btn" @click.stop="toggleFollow(item, 'business')">
            <text class="iconfont" :class="item.followed ? 'icon-xuanze' : 'icon-add'"></text>
            <text>{{item.followed ? '已关注' : '关注'}}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 0,
      rentalList: [
        {
          id: 1,
          name: '城西小区租赁中心',
          description: '专业的城西租房代理，服务更贴心',
          logo: '/static/images/follows/store_rental_1.jpg',
          followed: true
        },
        {
          id: 2,
          name: '房产直租中心',
          description: '小区直租，省去中介费用',
          logo: '/static/images/follows/store_rental_2.jpg',
          followed: true
        },
        {
          id: 3,
          name: '优品房屋代理',
          description: '首月免租金，多种户型优惠',
          logo: '/static/images/follows/store_rental_3.jpg',
          followed: true
        },
        {
          id: 4,
          name: '安心租房',
          description: '精选靠谱房源，安全有保障',
          logo: '/static/images/follows/store_rental_4.jpg',
          followed: true
        }
      ],
      businessList: [
        {
          id: 1,
          name: '优选咖啡',
          description: '手冲咖啡，现磨现煮',
          logo: '/static/images/follows/store_business_1.jpg',
          followed: true
        },
        {
          id: 2,
          name: '鲜果便利店',
          description: '新鲜水果，24小时营业',
          logo: '/static/images/follows/store_business_2.jpg',
          followed: true
        },
        {
          id: 3,
          name: '健身工作室',
          description: '科学健身，塑造完美身材',
          logo: '/static/images/follows/store_business_3.jpg',
          followed: true
        },
        {
          id: 4,
          name: '阅读书店',
          description: '安静的独立书店，提供阅读空间',
          logo: '/static/images/follows/store_business_4.jpg',
          followed: true
        }
      ]
    }
  },
  onLoad(options) {
    // 如果有传入默认选中的tab
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
  
  .header {
    height: 84rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding-top: 44px;
    background: linear-gradient(to bottom, rgba(254, 141, 0, 0.2), rgba(254, 141, 1, 0));
    
    .back-icon {
      position: absolute;
      left: 30rpx;
      font-size: 36rpx;
      color: #4d4d4d;
    }
    
    .page-title {
      font-size: 36rpx;
      font-weight: 400;
      color: #000;
    }
  }
  
  .tab-container {
    display: flex;
    position: relative;
    background-color: #fff;
    
    .tab-item {
      flex: 1;
      height: 90rpx;
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
      left: 0;
      width: 375rpx;
      height: 4rpx;
      background-color: #fe8d00;
      transition: transform 0.3s;
    }
  }
  
  .follow-list-container {
    flex: 1;
    overflow: hidden;
    
    .follow-list {
      padding: 0 20rpx;
      
      .follow-item {
        display: flex;
        align-items: center;
        padding: 30rpx 20rpx;
        margin-top: 20rpx;
        background-color: #fff;
        border-radius: 20rpx;
        
        .store-logo {
          width: 88rpx;
          height: 88rpx;
          border-radius: 50%;
          margin-right: 20rpx;
        }
        
        .store-info {
          flex: 1;
          overflow: hidden;
          
          .store-name {
            font-size: 30rpx;
            color: #333;
            margin-bottom: 10rpx;
            font-weight: 500;
          }
          
          .store-desc {
            font-size: 24rpx;
            color: #999;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        
        .follow-btn {
          width: 160rpx;
          height: 64rpx;
          border-radius: 32rpx;
          background-color: #f5f5f5;
          color: #333;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28rpx;
          
          .iconfont {
            margin-right: 8rpx;
            font-size: 28rpx;
          }
          
          &.followed {
            background-color: #f0f0f0;
            color: #888;
          }
        }
      }
    }
  }
}
</style> 