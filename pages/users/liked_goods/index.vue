<template>
  <view class="liked-goods-page">
    <!-- 使用通用头部导航组件 -->
    <CommonHeader title="已赞商品" @back="goBack"></CommonHeader>

    <!-- 搜索框 -->
    <view class="search-section">
      <view class="search-box">
        <text class="iconfont icon-search search-icon"></text>
        <input
          class="search-input"
          placeholder="搜索点赞订单"
          v-model="searchKeyword"
          @input="onSearchInput"
          @confirm="searchGoods"
        />
        <text class="clear-btn" v-if="searchKeyword" @click="clearSearch">×</text>
      </view>
    </view>
    
    <!-- 商品列表 -->
    <view class="goods-list" v-if="goodsList.length > 0">
      <view 
        class="goods-item" 
        v-for="(item, index) in goodsList" 
        :key="index"
        @click="goToDetail(item)">
        <image class="goods-image" :src="item.image" mode="aspectFill"></image>
        <view class="goods-info">
          <view class="store-name">{{item.storeName}}</view>
          <view class="goods-name">{{item.name}}</view>
          <view class="goods-desc">{{item.description}}</view>
          <view class="goods-price">¥ {{item.price}}</view>
        </view>
        <view class="like-action" @click.stop="toggleLike(index)">
          <text class="iconfont" :class="item.liked ? 'icon-yidianzan' : 'icon-dianzan1'"></text>
        </view>
      </view>
    </view>
    
    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <image class="empty-image" src="/static/images/empty-box.png" mode="aspectFit"></image>
      <view class="empty-text">暂无已赞商品</view>
      <view class="goto-shop-btn" @click="gotoShop">去逛逛</view>
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
      searchKeyword: '',
      originalGoodsList: [], // 原始商品列表
      goodsList: [
        {
          id: 1,
          storeName: '卡卡甜品店（上地店）',
          name: '酒心巧克力',
          description: '单份酒心巧克力/40g',
          price: '105',
          image: '/static/images/liked/product_1.jpg',
          liked: true,
          likeCount: 156
        },
        {
          id: 2,
          storeName: '鲜果便利店（朝阳店）',
          name: '新鲜水蜜桃',
          description: '当季水蜜桃 5斤装 香甜多汁',
          price: '39.90',
          image: '/static/images/liked/product_2.jpg',
          liked: true,
          likeCount: 89
        },
        {
          id: 3,
          storeName: '小家电专营店',
          name: '便携榨汁机',
          description: '家用电动小型果汁机 USB充电',
          price: '99.00',
          image: '/static/images/liked/product_3.jpg',
          liked: true,
          likeCount: 212
        },
        {
          id: 4,
          storeName: '数码3C专卖店',
          name: '无线蓝牙耳机',
          description: '新款降噪长续航 高音质立体声',
          price: '199.00',
          image: '/static/images/liked/product_4.jpg',
          liked: true,
          likeCount: 176
        },
        {
          id: 5,
          storeName: '生活用品旗舰店',
          name: '不锈钢保温杯',
          description: '真空保温水杯 500ml 24小时保温',
          price: '49.90',
          image: '/static/images/liked/product_5.jpg',
          liked: true,
          likeCount: 98
        },
        {
          id: 6,
          name: '智能手环 防水运动计步器',
          price: '129.00',
          image: '/static/images/liked/product_6.jpg',
          liked: true,
          likeCount: 145
        }
      ]
    }
  },
  onLoad() {
    // 页面加载时的逻辑
    this.originalGoodsList = [...this.goodsList]; // 保存原始数据
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    toggleLike(index) {
      // 切换点赞状态
      const item = this.goodsList[index];
      item.liked = !item.liked;
      
      if (item.liked) {
        item.likeCount++;
      } else {
        item.likeCount--;
        
        // 如果取消点赞，移除该商品
        setTimeout(() => {
          this.goodsList.splice(index, 1);
        }, 300);
      }
      
      // 调用API更新点赞状态
      uni.showToast({
        title: item.liked ? '已点赞' : '已取消点赞',
        icon: 'none'
      });
    },
    goToDetail(item) {
      // 跳转到商品详情页
      uni.navigateTo({
        url: '/pages/goods_details/index?id=' + item.id
      });
    },
    buyNow(item) {
      // 立即购买商品
      uni.navigateTo({
        url: '/pages/order_addcart/order_addcart?goods_id=' + item.id + '&cartNum=1&type=buy'
      });
    },
    gotoShop() {
      // 跳转到商城首页
      uni.switchTab({
        url: '/pages/index/index'
      });
    },
    onSearchInput() {
      // 实时搜索
      this.searchGoods();
    },
    searchGoods() {
      if (!this.searchKeyword.trim()) {
        // 如果搜索关键词为空，显示所有商品
        this.goodsList = [...this.originalGoodsList];
        return;
      }

      // 根据商品名称搜索
      this.goodsList = this.originalGoodsList.filter(item =>
        item.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
    },
    clearSearch() {
      this.searchKeyword = '';
      this.goodsList = [...this.originalGoodsList];
    }
  }
}
</script>

<style lang="scss">
.liked-goods-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  
  .header {
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: #fff;
    border-bottom: 1rpx solid #f0f0f0;

    .back-btn {
      position: absolute;
      left: 30rpx;
      display: flex;
      align-items: center;
      z-index: 1;

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

  .search-section {
    padding: 20rpx;
    background-color: #fff;

    .search-box {
      position: relative;
      display: flex;
      align-items: center;
      background-color: #f7f7f7;
      border-radius: 50rpx;
      padding: 0 30rpx;
      height: 80rpx;

      .search-icon {
        font-size: 32rpx;
        color: #999;
        margin-right: 20rpx;
      }

      .search-input {
        flex: 1;
        font-size: 28rpx;
        color: #333;
        background: transparent;
        border: none;
        outline: none;

        &::placeholder {
          color: #999;
        }
      }

      .clear-btn {
        font-size: 36rpx;
        color: #999;
        margin-left: 20rpx;
        width: 40rpx;
        height: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .goods-list {
    padding: 20rpx;
    
    .goods-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 20rpx;
      background-color: #fff;
      border-radius: 16rpx;
      overflow: hidden;
      padding: 30rpx 20rpx;

      .goods-image {
        width: 160rpx;
        height: 160rpx;
        border-radius: 12rpx;
        margin-right: 24rpx;
        flex-shrink: 0;
      }
      
      .goods-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        .store-name {
          font-size: 28rpx;
          font-weight: 500;
          color: #333;
          margin-bottom: 8rpx;
        }

        .goods-name {
          font-size: 32rpx;
          font-weight: 600;
          color: #333;
          margin-bottom: 8rpx;
        }

        .goods-desc {
          font-size: 26rpx;
          color: #999;
          margin-bottom: 16rpx;
          line-height: 1.4;
        }

        .goods-price {
          font-size: 36rpx;
          font-weight: 600;
          color: #333;
        }
      }

      .like-action {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80rpx;
        height: 80rpx;
        margin-left: 20rpx;
        flex-shrink: 0;

        .iconfont {
          font-size: 48rpx;
          transition: color 0.3s ease;

          &.icon-dianzan1 {
            color: #ccc; // 未点赞状态
          }

          &.icon-yidianzan {
            color: #ff8d00; // 已点赞状态
          }
        }
      }
    }
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 200rpx;
    
    .empty-image {
      width: 200rpx;
      height: 200rpx;
      margin-bottom: 40rpx;
    }
    
    .empty-text {
      font-size: 30rpx;
      color: #999;
      margin-bottom: 40rpx;
    }
    
    .goto-shop-btn {
      width: 200rpx;
      height: 80rpx;
      background: linear-gradient(to right, #ff9000, #ff5000);
      color: #fff;
      border-radius: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30rpx;
    }
  }
}
</style> 