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
    <view class="order-card" v-for="(order, index) in orderList" :key="index">
      <view class="order-info">
        <view class="order-no">订单号: {{ order.order_number }}</view>
        <view class="order-status">{{ order.status_text }}</view>
      </view>
      <view class="product-info" v-if="order.goods && order.goods.length > 0">
        <view class="product-image">
          <image :src="formatImage(order.goods[0].image)" mode="aspectFill"></image>
        </view>
        <view class="product-details">
          <view class="product-name">{{ order.goods[0].title }}</view>
          <view class="product-spec">
            <view class="spec-tag">{{ order.goods[0].spec || '默认规格' }}</view>
            <view class="product-quantity">×{{ order.goods[0].quantity }}</view>
          </view>
          <view class="product-price">￥{{ order.goods[0].price }}</view>
        </view>
      </view>
      <view class="divider"></view>
      <view class="logistics-status">
        <image src="/static/images/pending_delivery/road-haul-cargo.svg" mode="aspectFit"></image>
        <text>司机正在路上~ 预计{{ formatDeliveryTime(order.create_time) }}送达</text>
      </view>
      <view class="button-group">
        <view class="not-found-btn" @click="showNotFoundNotice">未找到商品</view>
        <view class="confirm-btn" @click="confirmDelivery(order)">确认收货</view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="orderList.length === 0" class="empty-state">
      <image class="empty-image" src="/static/images/empty_order.png"></image>
      <text class="empty-text">暂无待收货订单</text>
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
        <view class="like-item" v-for="(item, idx) in likeList" :key="idx" @click="goToProductDetail(item)">
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
      <!-- 无推荐商品时显示 -->
      <view v-if="likeList.length === 0" class="no-recommend">
        <text>暂无推荐商品</text>
      </view>
    </view>


  </view>
</template>

<script>
import colors from '@/mixins/color.js'
import { navigateToOrderComplete } from '@/utils/orderNavigation.js'
import { getGroupOrderList, confirmReceipt, getGoodsList } from '@/api/group.js'
import { HTTP_REQUEST_URL } from '@/config/app.js'

export default {
  mixins: [colors],
  data () {
    return {
      status: 'onway', // 订单状态：在路上
      showPopup: false,
      popupText: '',
      orderList: [],
      page: 1,
      limit: 10,
      loading: false,
      likeList: []
    }
  },
  onLoad() {
    this.getOrderList()
    this.getRecommendProducts()
  },
  methods: {
    goBack () {
      uni.navigateBack()
    },
    formatImage(url) {
      if (!url) return '/static/images/empty_product.png';
      if (url.startsWith('http')) return url;
      return HTTP_REQUEST_URL + url;
    },
    formatDeliveryTime(createTime) {
      if (!createTime) return '今日';
      
      const orderDate = new Date(createTime * 1000);
      const now = new Date();
      
      // 如果是今天的订单
      if (orderDate.toDateString() === now.toDateString()) {
        // 预计2小时内送达
        const deliveryTime = new Date(orderDate.getTime() + 2 * 60 * 60 * 1000);
        const hours = deliveryTime.getHours();
        const minutes = deliveryTime.getMinutes();
        return `今日${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
      } else {
        // 如果不是今天的订单，显示日期
        return `${orderDate.getMonth() + 1}月${orderDate.getDate()}日`;
      }
    },
    getOrderList() {
      this.loading = true;
      getGroupOrderList({
        page: this.page,
        limit: this.limit,
        status: 1 // 1=待收货
      }).then(res => {
        this.loading = false;
        if (res.status === 200 && res.data) {
          this.orderList = res.data.list || [];
          console.log('待收货订单列表:', this.orderList);
        } else {
          this.orderList = [];
        }
      }).catch((err) => {
        console.error('获取订单列表失败:', err);
        this.loading = false;
        this.orderList = [];
      });
    },
    confirmDelivery (order) {
      // 显示确认弹窗
      uni.showModal({
        title: '确认收货',
        content: '确定已收到商品了吗？',
        success: (res) => {
          if (res.confirm) {
            confirmReceipt({ 
              order_id: order.id || order.order_id || order.order_number 
            }).then(resp => {
              if (resp.status === 200) {
                this.popupText = '收货成功！'
                this.showPopup = true
                setTimeout(() => {
                  this.showPopup = false
                  this.getOrderList() // 刷新列表
                }, 2000)
              } else {
                this.popupText = resp.msg || '确认收货失败'
                this.showPopup = true
                setTimeout(() => {
                  this.showPopup = false
                }, 2000)
              }
            }).catch(err => {
              console.error('确认收货失败:', err)
              this.popupText = '确认收货失败，请稍后再试'
              this.showPopup = true
              setTimeout(() => {
                this.showPopup = false
              }, 2000)
            })
          }
        }
      })
    },
    showNotFoundNotice () {
      this.popupText = '未找到商品？已反馈平台管理员'
      this.showPopup = true
      setTimeout(() => {
        this.showPopup = false
      }, 2000)
    },
    gotoOrderComplete () {
      uni.navigateTo({
        url: '/pages/goods/order_list/all_orders'
      })
    },
    handlePopupConfirm () {
      this.showPopup = false
    },
    getRecommendProducts() {
      getGoodsList({
        is_recommend: '1',
        limit: 4
      }).then(res => {
        if (res.status === 200 && res.data) {
          // 处理推荐商品数据
          this.likeList = (res.data.goodsList || []).map(item => {
            return {
              id: item.id,
              image: this.formatImage(item.image),
              name: item.title,
              price: item.min_price,
              sales: item.fake_sales + '件'
            };
          }).slice(0, 4); // 只显示前4个商品
        }
      }).catch(err => {
        console.error('获取推荐商品失败:', err);
      });
    },
    // 跳转到商品详情页
    goToProductDetail(item) {
      if (item && item.id) {
        uni.navigateTo({
          url: `/pages/goods_details/index?id=${item.id}`
        });
      }
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
  
  .no-recommend {
    text-align: center;
    padding: 40rpx 0;
    color: #999;
    font-size: 28rpx;
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

  // 空状态样式
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100rpx 0;
    .empty-image {
      width: 200rpx;
      height: 200rpx;
      margin-bottom: 20rpx;
    }
    .empty-text {
      font-size: 28rpx;
      color: #999;
    }
  }
}
</style>