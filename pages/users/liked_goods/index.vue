<template>
  <view class="liked-goods-page">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="back-icon" @click="goBack">
        <text class="iconfont icon-left"></text>
      </view>
      <view class="page-title">已赞商品</view>
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
          <view class="goods-name">{{item.name}}</view>
          <view class="goods-price">¥ {{item.price}}</view>
          <view class="goods-actions">
            <view class="like-btn" @click.stop="toggleLike(index)">
              <text class="iconfont" :class="item.liked ? 'icon-shoucang1' : 'icon-shoucang'"></text>
              <text>{{item.likeCount}}</text>
            </view>
            <view class="buy-btn" @click.stop="buyNow(item)">立即购买</view>
          </view>
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
export default {
  data() {
    return {
      goodsList: [
        {
          id: 1,
          name: '蓝山咖啡豆 新鲜烘焙 进口咖啡豆',
          price: '69.00',
          image: '/static/images/liked/product_1.jpg',
          liked: true,
          likeCount: 156
        },
        {
          id: 2,
          name: '新鲜水果 当季水蜜桃 5斤装',
          price: '39.90',
          image: '/static/images/liked/product_2.jpg',
          liked: true,
          likeCount: 89
        },
        {
          id: 3,
          name: '家用便携榨汁机 电动小型果汁机',
          price: '99.00',
          image: '/static/images/liked/product_3.jpg',
          liked: true,
          likeCount: 212
        },
        {
          id: 4,
          name: '新款无线蓝牙耳机 降噪长续航',
          price: '199.00',
          image: '/static/images/liked/product_4.jpg',
          liked: true,
          likeCount: 176
        },
        {
          id: 5,
          name: '保温杯不锈钢真空保温水杯 500ml',
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
    }
  }
}
</script>

<style lang="scss">
.liked-goods-page {
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
  
  .goods-list {
    padding: 20rpx;
    
    .goods-item {
      display: flex;
      margin-bottom: 20rpx;
      background-color: #fff;
      border-radius: 16rpx;
      overflow: hidden;
      padding: 20rpx;
      
      .goods-image {
        width: 200rpx;
        height: 200rpx;
        border-radius: 8rpx;
        margin-right: 20rpx;
      }
      
      .goods-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        
        .goods-name {
          font-size: 28rpx;
          color: #333;
          margin-bottom: 20rpx;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        
        .goods-price {
          font-size: 32rpx;
          color: #fe8d00;
          font-weight: 500;
          margin-bottom: 30rpx;
        }
        
        .goods-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          
          .like-btn {
            display: flex;
            align-items: center;
            font-size: 24rpx;
            color: #666;
            
            .iconfont {
              font-size: 30rpx;
              margin-right: 8rpx;
              color: #fe8d00;
            }
            
            .icon-shoucang {
              color: #ccc;
            }
          }
          
          .buy-btn {
            width: 160rpx;
            height: 60rpx;
            background: linear-gradient(to right, #ff9000, #ff5000);
            color: #fff;
            border-radius: 30rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26rpx;
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