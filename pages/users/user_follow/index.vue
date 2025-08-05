<template>
  <view class="user-follow-page">
    <view class="header-gradient"></view>
    <view class="header-bar">
      <view class="back-area" @click="goBack">
        <view class="back-arrow"></view>
        <text class="back-text">返回</text>
      </view>
      <view class="header-title">我的关注</view>
    </view>
    <view class="tab-section">
      <view class="tab-container">
        <view class="tab-item" :class="{'active': currentTab === 0}" @click="switchTab(0)">租售信息</view>
        <view class="tab-item" :class="{'active': currentTab === 1}" @click="switchTab(1)">商业信息</view>
      </view>
      <view class="tab-slider" :style="sliderStyle"></view>
    </view>
    <view class="search-bar">
      <image class="search-icon" src="/static/icons/search.svg" />
      <input class="search-input" placeholder="搜索" />
    </view>
    <view class="follow-list-container">
      <view class="follow-list" v-show="currentTab === 0">
        <view class="follow-item" v-for="(item, index) in rentalList" :key="index">
          <image class="store-logo" :src="item.logo" mode="aspectFill"></image>
          <view class="store-info">
            <view class="store-name">{{item.name}}</view>
            <view class="follow-time">{{item.followTime}}</view>
          </view>
          <view class="follow-btn" @click.stop="toggleFollow(item, 'rental')">
            <text class="check-icon">✓</text>
            <text>已关注</text>
          </view>
        </view>
      </view>
      <view class="follow-list" v-show="currentTab === 1">
        <view class="follow-item" v-for="(item, index) in businessList" :key="index">
          <image class="store-logo" :src="item.logo" mode="aspectFill"></image>
          <view class="store-info">
            <view class="store-name">{{item.name}}</view>
            <view class="follow-time">{{item.followTime}}</view>
          </view>
          <view class="follow-btn" @click.stop="toggleFollow(item, 'business')">
            <text class="check-icon">✓</text>
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
      sliderStyle: {
        left: 'calc(25% - 40rpx)',
        width: '80rpx'
      },
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
      const lefts = ['calc(25% - 40rpx)', 'calc(75% - 40rpx)'];
      this.sliderStyle = {
        left: lefts[index],
        width: '80rpx'
      };
    },
    async toggleFollow(item, listType) {
      try {
        // 调用关注/取消关注API
        const action = item.followed ? 'unfollow' : 'follow';
        const type = listType === 'rental' ? '1' : '0'; // 1表示租赁，0表示商品/店铺

        // 这里需要根据实际的关注API来调用
        // 暂时使用收藏API作为示例，实际应该是关注API
        if (item.followed) {
          // 取消关注
          await this.unfollowItem(item.id, type);
        } else {
          // 添加关注
          await this.followItem(item.id, type);
        }

        // 更新本地状态
        item.followed = !item.followed;

        uni.showToast({
          title: item.followed ? '已关注' : '已取消关注',
          icon: 'success'
        });

        // 如果取消关注，从列表中移除
        if (!item.followed) {
          setTimeout(() => {
            if (listType === 'rental') {
              this.rentalList = this.rentalList.filter(store => store.id !== item.id);
            } else {
              this.businessList = this.businessList.filter(store => store.id !== item.id);
            }
          }, 500);
        }
      } catch (error) {
        console.error('关注操作失败:', error);
        uni.showToast({
          title: '操作失败，请重试',
          icon: 'none'
        });
      }
    },

    // 关注项目
    async followItem(id, type) {
      // 这里应该调用真正的关注API
      // 暂时返回成功
      return Promise.resolve({ status: 200 });
    },

    // 取消关注项目
    async unfollowItem(id, type) {
      // 这里应该调用真正的取消关注API
      // 暂时返回成功
      return Promise.resolve({ status: 200 });
    },
    goToStore(item) {
      // 跳转到店铺详情页
      uni.navigateTo({
        url: '/pages/store/detail?id=' + item.id
      });
    }
  },
  mounted() {
    // 初始化下划线位置
    const lefts = ['calc(25% - 40rpx)', 'calc(75% - 40rpx)'];
    this.sliderStyle = {
      left: lefts[this.currentTab],
      width: '80rpx'
    };
  }
}
</script>

<style lang="scss" scoped>
.user-follow-page {
  min-height: 100vh;
  background: #f8f8f8;
  position: relative;
}
.header-gradient {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 120rpx; /* 减少高度 */
  background: linear-gradient(180deg, #F9E4CA 0%, rgba(249, 227, 200, 0.2) 100%);
  z-index: 0;
}
.header-bar {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx; /* 减少高度 */
  background: transparent;
  .back-area {
    position: absolute;
    left: 24rpx;
    display: flex;
    align-items: center;
    .back-arrow {
      width: 28rpx;
      height: 28rpx;
      border-left: 3rpx solid #4D4D4D;
      border-bottom: 3rpx solid #4D4D4D;
      transform: rotate(45deg);
      margin-right: 8rpx;
    }
    .back-text {
      font-size: 32rpx;
      color: #4D4D4D;
    }
  }
  .header-title {
    font-size: 36rpx;
    color: #000;
    font-weight: 400;
    text-align: center;
  }
}
.tab-section {
  margin-top: 30rpx; /* 减少顶部间距 */
  background: transparent;
  position: relative; /* 确保相对定位 */
  z-index: 2; /* 确保在渐变层上方 */
  .tab-container {
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    height: 80rpx;
    position: relative; /* 确保相对定位 */
    .tab-item {
      flex: 1;
      text-align: center;
      font-size: 32rpx;
      color: #B3B3B3;
      font-weight: 400;
      padding-bottom: 12rpx;
      transition: color 0.2s;
      position: relative;
      &.active {
        color: #000;
        font-weight: bold;
      }
    }
  }
  .tab-slider {
    position: absolute;
    bottom: 0;
    height: 4rpx;
    background: #FE8D00;
    border-radius: 2rpx;
    transition: left 0.3s, width 0.3s;
    z-index: 3; /* 确保可见 */
    width: 80rpx;
    left: calc(25% - 40rpx + (currentTab * 50%));
    // 80rpx为tab文字宽度，40rpx为一半
  }
}
.search-bar {
  margin: 16rpx 24rpx 0 24rpx; /* 减少顶部间距 */
  height: 64rpx;
  background: #fff;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  box-shadow: 0 2rpx 8rpx 0 rgba(0,0,0,0.04);
  .search-icon {
    width: 30rpx;
    height: 30rpx;
    margin-right: 12rpx;
  }
  .search-input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 28rpx;
    color: #333;
    outline: none;
    &::placeholder {
      color: #CCCCCC;
    }
  }
}
.follow-list-container {
  margin-top: 16rpx;
  .follow-list {
    padding: 0 24rpx; /* 添加左右内边距，与返回箭头对齐 */
    .follow-item {
      display: flex;
      align-items: center;
      padding: 18rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      background: #fff;
      width: 100%; /* 确保宽度不超出父容器 */
      box-sizing: border-box; /* 确保padding不会增加宽度 */
      .store-logo {
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
        margin-right: 16rpx;
        flex-shrink: 0; /* 防止图片被压缩 */
      }
      .store-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-width: 0; /* 允许内容在必要时被截断 */
        .store-name {
          font-size: 32rpx;
          color: #000;
          font-weight: bold;
          margin-bottom: 4rpx;
          white-space: nowrap; /* 防止换行 */
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 显示省略号 */
        }
        .follow-time {
          font-size: 22rpx;
          color: #B3B3B3;
          font-weight: 400;
        }
      }
      .follow-btn {
        min-width: 120rpx; /* 增加宽度 */
        height: 48rpx; /* 增加高度 */
        border-radius: 24rpx; /* 增加圆角 */
        border: 1rpx solid #CCCCCC; /* 更浅的边框颜色 */
        background: #fff;
        color: #999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        font-weight: 400;
        flex-shrink: 0;
        margin-left: 12rpx;
        padding: 0 16rpx; /* 增加内边距 */
        .check-icon {
          margin-right: 6rpx; /* 增加图标与文字间距 */
          font-size: 24rpx; /* 增大图标尺寸 */
          color: #999;
        }
      }
    }
  }
}

/* 可选：添加点击态样式 */
.follow-btn:active {
  opacity: 0.8;
}
</style> 