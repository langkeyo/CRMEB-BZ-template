<template>
  <view class="pending-payment-container" :style="colorStyle">
    <!-- 支付方式选择弹窗 -->
    <view class="payment-mask" v-if="showPaymentModal" @click.stop="closePaymentModal"></view>
    <view class="payment-modal" v-if="showPaymentModal">
      <!-- 右上角关闭按钮（纯文字X） -->
      <view class="close-btn" @click="closePaymentModal">
        <text class="close-x">×</text>
      </view>
      <view class="payment-options">
        <view class="payment-option" @click="selectPayment('alipay')">
          <view class="payment-icon alipay-icon">
            <image src="/static/images/payment/alipay_icon.png" mode="widthFix"></image>
          </view>
          <view class="payment-name">支付宝支付</view>
          <view class="payment-check" :class="{ active: selectedPayment === 'alipay' }"></view>
        </view>
        <view class="payment-option" @click="selectPayment('wechat')">
          <view class="payment-icon wechat-icon">
            <image src="/static/images/payment/wechat_icon.png" mode="widthFix"></image>
          </view>
          <view class="payment-name">微信支付</view>
          <view class="payment-check" :class="{ active: selectedPayment === 'wechat' }"></view>
        </view>
        <view class="more-payment" @click="toggleMorePayment">
          <text>更多支付方式</text>
          <image :class="[morePaymentExpanded ? 'arrow-rotated' : '', 'arrow-icon']" src="/static/images/payment/arrow_down.png" mode="widthFix"></image>
        </view>
        <view v-if="morePaymentExpanded" class="more-payment-list">
          <view class="payment-option" @click="selectPayment('unionpay')">
            <view class="payment-icon">
              <image src="/static/images/payment/unionpay_icon.png" mode="widthFix"></image>
            </view>
            <view class="payment-name">银联支付</view>
            <view class="payment-check" :class="{ active: selectedPayment === 'unionpay' }"></view>
          </view>
        </view>
      </view>
      <view class="payment-btn" @click="confirmPayment">
        <text class="pay-btn-text">立即支付 ¥{{ priceInfo.totalPrice }}</text>
      </view>
    </view>

    <!-- 精简flex头部 -->
    <view class="pending-header">
      <view class="pending-header-row">
        <view class="back-icon" @click="goBack">
          <image src="/static/images/pending_payment/icon_back_arrow.svg" mode="widthFix"></image>
        </view>
        <view class="main-title">等待付款</view>
      </view>
      <view class="sub-title">您已选择先下单后付款</view>
      <view class="pay-btn" @click="goToPay">去支付</view>
    </view>

    <!-- 主内容区域 -->
    <view class="content-wrapper">
      <!-- 地址信息 -->
      <view class="address-info">
        <view class="user-address">
          <view class="user-info">
            <image class="location-icon" src="/static/images/goods_details/location_icon.svg"></image>
            <text class="username">{{ addressInfo.name }}</text>
            <text class="phone">{{ addressInfo.phone }}</text>
          </view>
          <view class="address-detail">
            <text>地址：{{ addressInfo.address }}</text>
          </view>
        </view>
      </view>

      <!-- 商品信息区域 -->
      <view class="goods-section">
        <view class="section-title">商品详情</view>
        <view class="address-row">
          <text class="address-label">收货地址：</text>
          <text class="address-value">{{ addressInfo.address }}</text>
          <image class="address-icon" src="/static/images/goods_details/location_icon.svg"></image>
        </view>
        <view class="goods-card-row">
          <image class="goods-img" :src="goodsInfo.image" mode="aspectFill"></image>
          <view class="goods-info-col">
            <view class="goods-title-row">
              <text class="goods-title">{{ goodsInfo.title }}</text>
              <text class="goods-quantity">x{{ goodsInfo.quantity }}</text>
            </view>
            <view class="goods-spec">{{ goodsInfo.spec }}</view>
            <view class="goods-price">¥{{ goodsInfo.price }}</view>
          </view>
        </view>
        <view class="price-list">
          <view class="price-row">
            <text>配送费</text>
            <text>{{ priceInfo.deliveryFee > 0 ? '¥' + priceInfo.deliveryFee : '免配送费' }}</text>
          </view>
          <view class="price-row">
            <view class="price-label-group">
              <text>商品总价</text>
              <text class="goods-count">共{{ goodsInfo.quantity }}件商品</text>
            </view>
            <text class="price-value">¥{{ priceInfo.goodsTotal }}</text>
          </view>
          <view class="price-row total">
            <text>合计</text>
            <text>¥{{ priceInfo.totalPrice }}</text>
          </view>
        </view>
      </view>

      <!-- 订单信息 -->
      <view class="order-info">
        <view class="order-title">订单信息</view>
        <view class="order-detail">
          <view class="item">
            <text class="label">订单号</text>
            <text class="value">{{ orderInfo.orderNo }}</text>
          </view>
          <view class="item">
            <text class="label">支付方式</text>
            <text class="value">{{ orderInfo.payType }}</text>
          </view>
          <view class="item">
            <text class="label">下单时间</text>
            <text class="value">{{ orderInfo.orderTime }}</text>
          </view>
          <view class="item">
            <text class="label">付款时间</text>
            <text class="value">{{ orderInfo.payTime }}</text>
          </view>
          <view class="item">
            <text class="label">备注</text>
            <text class="value">{{ orderInfo.remark || '-' }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-buttons">
      <view class="cancel-btn" @click="cancelOrder">取消订单</view>
      <view class="pay-btn" @click="goToPay">去支付</view>
    </view>
  </view>
</template>

<script>
import { orderCancel, orderPay } from '@/api/order.js'
import colors from '@/mixins/color.js'
import { navigateToCashier, navigateToPayStatus } from '@/utils/orderNavigation.js'

export default {
  mixins: [colors],
  data() {
    return {
      loading: false,
      orderId: '', // 订单ID
      // 地址信息
      addressInfo: {
        name: '王小明',
        phone: '185****3662',
        address: '北京尚德井小区菜鸟驿站'
      },
      // 商品信息
      goodsInfo: {
        id: '1',
        title: '百草味坚果',
        spec: '一盒15包随机口味',
        price: '35',
        quantity: 1,
        image: '/static/images/pending_payment/product_image.png'
      },
      // 价格信息
      priceInfo: {
        deliveryFee: 0, // 配送费用
        goodsTotal: 35, // 商品总价
        totalPrice: 35 // 合计
      },
      // 订单信息
      orderInfo: {
        orderNo: '6546846541821654',
        payType: '微信支付',
        orderTime: '2025-03-28 9:35',
        payTime: '2025-03-28 9:36',
        remark: '-' // 备注，如果没有就显示'-'
      },
      // 倒计时
      countdownTime: 30 * 60, // 初始30分钟，以秒为单位
      countdownInterval: null,
      countdownDisplay: '30:00',
      // 支付方式弹窗
      showPaymentModal: false,
      selectedPayment: 'wechat',
      morePaymentExpanded: false,
    }
  },
  computed: {
    // 可以添加计算属性
  },
  onLoad(options) {
    // 获取订单ID
    if (options && options.id) {
      this.orderId = options.id
      this.getOrderDetail()
    }

    // 启动倒计时
    this.startCountdown()
  },
  onUnload() {
    // 清除倒计时
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval)
    }
  },
  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack()
    },

    // 获取订单详情
    getOrderDetail() {
      // 这里应该调用API获取订单详情
      // 示例代码：
      /*
      orderDetail(this.orderId).then(res => {
        if (res.code === 200) {
          // 更新数据
          const data = res.data;
          this.addressInfo = {...};
          this.goodsInfo = {...};
          this.priceInfo = {...};
          this.orderInfo = {...};
          // 设置倒计时
          this.countdownTime = data.remainPayTime || 30 * 60;
          this.startCountdown();
        }
      }).catch(err => {
        uni.showToast({
          title: '获取订单信息失败',
          icon: 'none'
        });
      });
      */
    },

    // 开始倒计时
    startCountdown() {
      // 清除可能存在的定时器
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval)
      }

      // 更新显示
      this.updateCountdownDisplay()

      // 设置定时器
      this.countdownInterval = setInterval(() => {
        if (this.countdownTime > 0) {
          this.countdownTime--
          this.updateCountdownDisplay()
        } else {
          clearInterval(this.countdownInterval)
          uni.showToast({
            title: '支付时间已过',
            icon: 'none'
          })
          // 可能需要其他处理，如返回订单列表等
        }
      }, 1000)
    },

    // 更新倒计时显示
    updateCountdownDisplay() {
      const minutes = Math.floor(this.countdownTime / 60)
      const seconds = this.countdownTime % 60
      this.countdownDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    },

    // 取消订单
    cancelOrder() {
      uni.showModal({
        title: '提示',
        content: '确定要取消订单吗？',
        success: res => {
          if (res.confirm) {
            // 这里应该调用取消订单API
            orderCancel(this.orderId)
              .then(res => {
                if (res.code === 200) {
                  uni.showToast({
                    title: '取消成功',
                    icon: 'success'
                  })
                  // 返回订单列表或首页
                  setTimeout(() => {
                    uni.navigateBack()
                  }, 1500)
                } else {
                  uni.showToast({
                    title: res.message || '取消失败',
                    icon: 'none'
                  })
                }
              })
              .catch(err => {
                uni.showToast({
                  title: '取消失败',
                  icon: 'none'
                })
              })
          }
        }
      })
    },

    // 去支付
    goToPay() {
      this.showPaymentModal = true
    },
    selectPayment(type) {
      this.selectedPayment = type
    },
    closePaymentModal() {
      this.showPaymentModal = false
    },
    confirmPayment() {
      uni.setStorageSync('selectedPaymentMethod', this.selectedPayment)
      uni.showLoading({ title: '正在支付...' })
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({ title: '支付成功', icon: 'success' })
        setTimeout(() => {
          uni.redirectTo({
            url: '/pages/goods/order_pay_status/index?status=success'
          })
        }, 1500)
      }, 2000)
      this.showPaymentModal = false
    },
    toggleMorePayment() {
      this.morePaymentExpanded = !this.morePaymentExpanded
    },

    // 领取优惠券
    getCoupon() {
      uni.navigateTo({
        url: '/pages/users/user_coupon/index'
      })
    },

  }
}
</script>

<style lang="scss">
.pending-payment-container {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 120rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .pending-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 96rpx 0 64rpx 0;

    .pending-header-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 100%;
      margin-bottom: 24rpx;

      .back-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 26rpx;
        height: 26rpx;
        transform: translateX(-220rpx);

        image {
          width: 26rpx;
          height: 26rpx;
        }
      }

      .main-title {
        font-size: 56rpx;
        color: #F34A2B;
        font-weight: bold;
        text-align: center;
        transform: translate(-20rpx);
      }
    }

    .sub-title {
      font-size: 32rpx;
      color: #999;
      margin-bottom: 56rpx;
      text-align: center;
    }

    .pay-btn {
      background: #F34A2B;
      color: #fff;
      border-radius: 44rpx;
      font-size: 36rpx;
      padding: 0 72rpx;
      height: 88rpx;
      line-height: 88rpx;
      border: none;
      box-shadow: none;
      margin-top: 0;
      text-align: center;
      min-width: 280rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-top: 92rpx;
    padding-bottom: 40rpx;
  }

  .address-info {
    background-color: #FFFFFF;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx;
    margin: 0 24rpx;
    margin-bottom: 20rpx;
    border-radius: 8rpx;

    .user-address {
      flex: 1;

      .user-info {
        display: flex;
        align-items: center;
        margin-bottom: 16rpx;
        gap: 24rpx;

        .location-icon {
          width: 32rpx;
          height: 32rpx;
          display: flex;
          align-items: center;
          gap: 24rpx;


          image {
            width: 100%;
            height: 100%;
          }

          .username {
            display: flex;
            font-size: 32rpx;
            font-weight: 600;
            color: #333333;
            gap: 24rpx;
          }
        }

        .phone {
          font-size: 30rpx;
          color: #666666;
        }
      }

      .address-detail {
        font-size: 28rpx;
        color: #666666;
        line-height: 1.4;
      }
    }

    .address-icon {
      width: 32rpx;
      height: 32rpx;
      margin-left: 20rpx;
      display: flex;
      align-items: center;

      image {
        width: 100%;
        height: 100%;
      }
    }
  }

  .goods-section {
    background: #fff;
    border-radius: 8rpx;
    margin: 24rpx 24rpx 0 24rpx;
    padding: 32rpx 24rpx 24rpx 24rpx;
    box-sizing: border-box;

    .section-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #111;
      margin-bottom: 24rpx;
    }

    .address-row {
      display: flex;
      align-items: center;
      margin-bottom: 32rpx;

      .address-label {
        font-size: 28rpx;
        color: #222;
        font-weight: 500;
      }
      .address-value {
        font-size: 28rpx;
        color: #333;
        font-weight: 600;
        margin: 0 8rpx;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .address-icon {
        width: 32rpx;
        height: 32rpx;
        margin-left: 8rpx;
      }
    }

    .goods-card-row {
      display: flex;
      align-items: flex-start;
      margin-bottom: 32rpx;

      .goods-img {
        width: 120rpx;
        height: 120rpx;
        border-radius: 8rpx;
        margin-right: 20rpx;
        background: #f5f5f5;
      }
      .goods-info-col {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-width: 0;

        .goods-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .goods-title {
            font-size: 30rpx;
            color: #222;
            font-weight: 600;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .goods-quantity {
            font-size: 26rpx;
            color: #999;
            margin-left: 16rpx;
            flex-shrink: 0;
          }
        }
        .goods-spec {
          font-size: 26rpx;
          color: #999;
          margin: 8rpx 0 0 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .goods-price {
          font-size: 28rpx;
          color: #333;
          margin-top: 16rpx;
          align-self: flex-end;
        }
      }
    }

    .price-list {
      .price-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 28rpx;
        color: #666;
        margin-bottom: 16rpx;

        .price-label-group {
          display: flex;
          align-items: center;

          text {
            font-size: 28rpx;
            color: #222;
            font-weight: 500;
          }
          .goods-count {
            font-size: 26rpx;
            color: #bbb;
            margin-left: 32rpx;
            font-weight: normal;
          }
        }
        .price-value {
          font-size: 28rpx;
          color: #333;
        }
      }
      .total {
        font-size: 28rpx;
        color: #333;
        margin-top: 8rpx;
      }
    }
  }

  .order-info {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    margin: 24rpx 24rpx 0 24rpx;
    padding: 32rpx 24rpx;
    box-sizing: border-box;

    .order-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #111;
      margin-bottom: 24rpx;
      text-align: left;
    }

    .order-detail {
      .item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20rpx;

        .label {
          font-size: 28rpx;
          color: #222;
          font-weight: 500;
        }
        .value {
          font-size: 28rpx;
          color: #bbb;
          text-align: right;
          flex: 1;
          margin-left: 32rpx;
          word-break: break-all;
        }
      }
      .item:last-child {
        margin-bottom: 0;
      }
    }
  }

  .countdown-box {
    background-color: #FFFFFF;
    padding: 32rpx;
    margin-bottom: 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .countdown-title {
      font-size: 30rpx;
      color: #666666;
      margin-bottom: 20rpx;
    }

    .countdown-time {
      font-size: 48rpx;
      color: #FF6630;
      font-weight: 600;
    }
  }

  .bottom-buttons {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 120rpx;
    background-color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 32rpx;
    box-sizing: border-box;
    box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
    flex-shrink: 0;

    .cancel-btn {
      height: 76rpx;
      padding: 0 48rpx;
      border-radius: 38rpx;
      background-color: #fff;
      color: #FF9900;
      font-size: 32rpx;
      font-weight: 500;
      border: 2rpx solid #FF9900;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 32rpx;
      box-sizing: border-box;
    }

    .pay-btn {
      height: 76rpx;
      padding: 0 64rpx;
      border-radius: 38rpx;
      background-color: #FF9900;
      color: #FFFFFF;
      font-size: 32rpx;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      box-sizing: border-box;
    }
  }

  .tip-popup {
    .tip-content {
      background-color: #1A1A1A;
      opacity: 0.7;
      padding: 30rpx 60rpx;
      border-radius: 20rpx;
      display: flex;
      flex-direction: column;
      align-items: center;

      text {
        color: #FFFFFF;
        font-size: 32rpx;
        line-height: 1.4;
      }
    }
  }

  .payment-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 999;
  }

  .payment-modal {
    padding-top: 0;
    padding-bottom: 0;
    min-height: 420rpx;
    .close-btn {
      position: absolute;
      top: 32rpx;
      right: 32rpx;
      width: 44rpx;
      height: 44rpx;
      z-index: 1100;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .close-x {
        font-size: 44rpx;
        color: #222;
        font-weight: 400;
        line-height: 1;
        user-select: none;
        transition: color 0.2s;
      }
      &:active .close-x {
        color: #FF9900;
      }
    }
    .payment-options {
      padding: 0 32rpx 0 32rpx;
      margin-top: 56rpx;
      margin-bottom: 32rpx;
      .payment-option {
        display: flex;
        align-items: center;
        height: 64rpx;
        margin-bottom: 32rpx;
        border-radius: 12rpx;
        padding: 0 0 0 0;
        background: transparent;
        .payment-icon {
          width: 44rpx;
          height: 44rpx;
          margin-right: 16rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          image {
            width: 100%;
            height: 100%;
          }
        }
        .payment-name {
          flex: 1;
          font-size: 30rpx;
          color: #222;
          font-weight: 500;
        }
        .payment-check {
          width: 32rpx;
          height: 32rpx;
          border-radius: 50%;
          border: 2rpx solid #DDDDDD;
          position: relative;
          background: #fff;
          &.active {
            border-color: #FF9900;
            &:after {
              content: '';
              position: absolute;
              width: 20rpx;
              height: 20rpx;
              background-color: #FF9900;
              border-radius: 50%;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
        }
      }
      .payment-option:last-child {
        margin-bottom: 0;
      }
      .more-payment {
        margin: 32rpx 0 0 0;
        font-size: 26rpx;
        color: #bbb;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 0;
        text-align: left;
        image {
          width: 24rpx;
          height: 24rpx;
          margin-left: 8rpx;
        }
      }
      .more-payment-list {
        margin-top: 16rpx;
        .payment-option {
          margin-bottom: 0;
        }
      }
    }
    .payment-btn {
      height: 96rpx;
      background: #FF9900;
      border-radius: 16rpx;
      margin: 0 32rpx 32rpx 32rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4rpx 16rpx 0 rgba(255, 158, 0, 0.10);
      text-align: center;
      .pay-btn-text {
        color: #fff;
        font-size: 36rpx;
        font-weight: 700;
        letter-spacing: 2rpx;
      }
    }
  }

  .arrow-icon {
    width: 12px;
    height: 12px;
    margin-left: 5px;
    transition: transform 0.3s;
    display: inline-block;
  }
  .arrow-rotated {
    transform: rotate(180deg) !important;
  }
}
</style>