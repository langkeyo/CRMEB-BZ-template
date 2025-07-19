<template>
  <view class="pending-delivery-container" :style="colorStyle">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="nav-bar">
        <view class="left" @click="goBack">
          <image class="back-icon" src="/static/images/order/back_arrow.svg" mode="widthFix"></image>
          <text>返回</text>
        </view>
        <view class="title">待收货</view>
      </view>
    </view>

    <!-- 订单卡片 -->
    <view class="order-card">
      <view class="order-info">
        <view class="order-no">订单号: 6546846541821654</view>
        <view class="order-status">待收货</view>
      </view>
      <view class="product-info">
        <view class="product-image">
          <image :src="order.image" mode="aspectFill"></image>
        </view>
        <view class="product-details">
          <view class="product-name">{{ order.name }}</view>
          <view class="product-spec">
            <view class="spec-tag">{{ order.spec }}</view>
            <view class="product-quantity">×{{ order.quantity }}</view>
          </view>
          <view class="product-price">￥{{ order.price }}</view>
        </view>
      </view>
      <view class="divider"></view>
      <view class="logistics-status">
        <image src="/static/images/pending_delivery/road-haul-cargo.svg" mode="aspectFit"></image>
        <text>司机正在路上~ 预计{{ estimatedTime }}送达</text>
      </view>
      <view class="button-group">
        <view class="not-found-btn" @click="showNotFoundNotice">未找到商品</view>
        <view class="confirm-btn" @click="confirmDelivery">确认收货</view>
      </view>
    </view>

    <!-- 弹窗 -->
    <view v-if="showPopup" class="popup-text" @click="handlePopupConfirm">{{ popupText }}</view>

    <!-- 查找订单提示 -->
    <view class="find-order-tip">
      没有找到订单？试试查看
      <text class="link" @click="gotoOrderComplete">全部订单</text>
    </view>

    <!-- 猜你喜欢 -->
    <view class="guess-like">
      <view class="title">你可能还会喜欢</view>
      <view class="like-list">
        <view class="like-item" v-for="(item, idx) in likeList" :key="idx">
          <image :src="item.image" mode="aspectFill"></image>
          <view class="like-card">
            <view class="like-name">{{ item.name }}</view>
            <view class="like-info">
              <text class="price">{{ item.price }}</text>
              <view class="sales">
                <text class="sales-text">已售</text>
                <text class="sales-number">{{ item.sales }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>


  </view>
</template>

<script>
import colors from '@/mixins/color.js'
import { navigateToOrderComplete } from '@/utils/orderNavigation.js'

export default {
  mixins: [colors],
  data () {
    return {
      status: 'onway', // 订单状态：在路上
      showPopup: false,
      popupText: '',
      order: {
        id: '123456', // 添加订单ID
        image: '/static/common/shared/chicken_feet.png',
        name: '柠檬无骨鸡爪',
        spec: '一斤装/500g',
        quantity: 1,
        price: '25.50',
      },
      estimatedTime: '今日11:30',
      likeList: [
        {
          image: '/static/common/shared/coffee.png',
          name: '瑞幸咖啡5选1',
          price: '12.5',
          sales: '99+单'
        },
        {
          image: '/static/common/shared/bbq.png',
          name: '滩羊烤串21串套餐',
          price: '49',
          sales: '754件'
        },
        {
          image: '/static/common/shared/wings.png',
          name: '精美黄金烤鸡翅',
          price: '22',
          sales: '99+份'
        },
        {
          image: '/static/common/shared/octopus.png',
          name: '超值章鱼丸子1份',
          price: '7.5',
          sales: '1122件'
        }
      ]
    }
  },
  methods: {
    goBack () {
      uni.navigateBack()
    },
    confirmDelivery () {
      // 确认收货前先显示商品在路上提示弹窗
      this.showProductOnWayPopup()
    },
    showProductOnWayPopup () {
      this.popupText = '商品还在路上请您耐心等候哦~'
      this.showPopup = true
      setTimeout(() => {
        this.showPopup = false
      }, 2000)
    },
    showNotFoundNotice () {
      this.popupText = '未找到商品？已反馈平台管理员'
      this.showPopup = true
      setTimeout(() => {
        this.showPopup = false
      }, 2000)
    },
    gotoOrderComplete () {
      navigateToOrderComplete(this.order.id)
    },
    handlePopupConfirm () {
      this.showPopup = false
    }
  }
}
</script>

<style lang="scss" scoped>
.pending-delivery-container {
  min-height: 100vh;
  background-color: #F0F0F0;

  .header {
    background-color: #FFFFFF;

    .nav-bar {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 88rpx; /* 44px * 2 */

      .left {
        position: absolute;
        left: 30rpx; /* 15px * 2 */
        display: flex;
        align-items: center;

        .back-icon {
          width: 20rpx; /* 10px * 2 */
          height: 36rpx; /* 18px * 2 */
          margin-right: 10rpx; /* 5px * 2 */
        }

        text {
          color: #333333;
          font-size: 36rpx; /* 18px * 2 */
          margin-left: 10rpx;
        }
      }

      .title {
        font-size: 36rpx; /* 18px * 2 */
        font-weight: 400;
        color: #1A1A1A;
      }
    }
  }







  // 订单卡片
  .order-card {
    background: #FFFFFF;
    border-radius: 8rpx; /* 4px * 2 */
    margin: 20rpx 30rpx; /* 10px 15px * 2 */
    padding: 30rpx; /* 15px * 2 */

    .order-info {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .order-no {
        color: #B3B3B3;
        font-size: 26rpx; /* 13px * 2 */
      }

      .order-status {
        color: #DA3232;
        font-size: 30rpx; /* 15px * 2 */
      }
    }

    .product-info {
      display: flex;
      margin: 30rpx 0; /* 15px * 2 */

      .product-image {
        width: 190rpx; /* Make it square */
        height: 190rpx; /* Keep the same height */
        border-radius: 8rpx; /* 4px * 2 */
        overflow: hidden;
        margin-right: 30rpx; /* 15px * 2 */

        image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .product-details {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .product-name {
          font-size: 30rpx; /* 15px * 2 */
          color: #1A1A1A;
          margin-bottom: 10rpx; /* 5px * 2 */
        }

        .product-spec {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10rpx; /* 5px * 2 */

          .spec-tag {
            background: #F7F7F7;
            color: #999999;
            font-size: 28rpx; /* 14px * 2 */
            padding: 4rpx 16rpx; /* 2px 8px * 2 */
            border-radius: 12rpx; /* 6px * 2 */
          }

          .product-quantity {
            color: #999999;
            font-size: 28rpx; /* 14px * 2 */
          }
        }

        .product-price {
          font-size: 30rpx; /* 15px * 2 */
          color: #1A1A1A;
        }
      }
    }

    .divider {
      height: 1rpx; /* 0.5px * 2 */
      background: #F0F0F0;
      margin-bottom: 30rpx; /* 15px * 2 */
    }

    .logistics-status {
      padding: 20rpx 30rpx; /* 10px 15px * 2 */
      color: #000000;
      font-size: 30rpx; /* 15px * 2 */
      margin-bottom: 30rpx; /* 15px * 2 */
      background-color: #F8F8F8;
      border-radius: 8rpx; /* 4px * 2 */
      display: flex;
      align-items: center;

      image {
        width: 40rpx; /* 20px * 2 */
        height: 40rpx; /* 20px * 2 */
        margin-right: 16rpx; /* 8px * 2 */
      }

      &.delivered {
        font-weight: 500;

        .delivered-icon {
          width: 40rpx; /* 20px * 2 */
          height: 40rpx; /* 20px * 2 */
          border-radius: 50%;
          background-color: #4CD964;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 10rpx; /* 5px * 2 */

          .iconfont {
            color: #FFFFFF;
            font-size: 24rpx; /* 12px * 2 */
          }
        }
      }
    }

    .button-group {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .not-found-btn {
        height: 60rpx; /* 30px * 2 */
        padding: 0 30rpx; /* 0 15px * 2 */
        border-radius: 30rpx; /* 15px * 2 */
        background: #FFFFFF;
        color: #4D4D4D;
        font-size: 30rpx; /* 15px * 2 */
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20rpx; /* 10px * 2 */

        &.active {
          background: #4D4D4D;
          color: #FFFFFF;
        }
      }

      .confirm-btn {
        height: 60rpx; /* 30px * 2 */
        padding: 0 30rpx; /* 0 15px * 2 */
        border-radius: 30rpx; /* 15px * 2 */
        background: #FF840B;
        color: #FFFFFF;
        font-size: 30rpx; /* 15px * 2 */
        display: flex;
        align-items: center;
        justify-content: center;

        &.received {
          background: #4D4D4D;
        }
      }
    }
  }

  // 查找订单提示
  .find-order-tip {
    text-align: center;
    font-size: 26rpx; /* 13px * 2 */
    color: #999999;
    margin: 30rpx 0;
    margin-top: 60rpx;
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    line-height: 36rpx; /* 18px * 2 */

    .link {
      color: #47B9FB;
      text-decoration: none;
      cursor: pointer;
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 26rpx;
      line-height: 36rpx;
    }
  }

  // 猜你喜欢
  .guess-like {
    padding: 30rpx; /* 15px * 2 */
    margin-top: 20rpx; /* 10px * 2 */

    .title {
      font-size: 36rpx; /* 18px * 2 */
      color: #000000;
      margin-bottom: 30rpx; /* 15px * 2 */
    }

    .like-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .like-item {
        display: flex;
        flex-direction: column;
        gap: 12rpx;
        width: 48%;
        margin-bottom: 30rpx; /* 15px * 2 */
        overflow: hidden;

        image {
          width: 100%;
          height: 320rpx; /* Increased to match Figma design (approximately 161px) */
          display: block;
          object-fit: cover;
          border-radius: 8rpx 8rpx 0 0;
        }

        .like-card {
          background-color: #FFFFFF;
          border-radius: 0 0 8rpx 8rpx;
          padding: 16rpx;
          box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

          .like-name {
            font-size: 28rpx;
            color: #1A1A1A;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 8rpx;
          }

          .like-info {
            display: flex;
            align-items: baseline;

            .price {
              font-size: 28rpx;
              color: #333333;
              font-weight: 550;
              
              &::before {
                content: '￥';
                font-size: 26rpx;
                font-weight: normal;
              }
            }

            .sales {
              display: flex;
              align-items: baseline;
              margin-left: 8rpx;
              
              .sales-text {
                font-size: 22rpx;
                color: #CCCCCC;
              }
              
              .sales-number {
                font-size: 20rpx;
                color: #CCCCCC;
              }
            }
          }
        }
      }
    }
  }

  // 弹窗
  .popup-text {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 32rpx; /* 16px * 2 */
    line-height: 44rpx; /* 22px * 2 */
    text-align: center;
    color: #FFFFFF;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 20rpx; /* 10px * 2 */
    padding: 24rpx 40rpx; /* 12px 20px * 2 */
    z-index: 1000;
    white-space: nowrap; /* 强制单行显示 */
    max-width: 90%; /* 最大宽度90%，避免超出屏幕 */
    box-sizing: border-box;
  }


}
</style>