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
        <view class="payment-option" @click="selectPayment('wechat')">
          <view class="payment-icon wechat-icon">
            <image src="/static/images/payment/wechat_icon.png" mode="widthFix"></image>
          </view>
          <view class="payment-name">微信支付</view>
          <view class="payment-check" :class="{ active: selectedPayment === 'wechat' }"></view>
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
import { orderCancel, orderPay, groupOrderPay } from '@/api/order.js'
import { getGroupOrderDetail } from '@/api/group.js'
import colors from '@/mixins/color.js'
import { navigateToCashier, navigateToPayStatus } from '@/utils/orderNavigation.js'

export default {
  mixins: [colors],
  computed: {
    // 使用this.$store.getters获取全局信息
    userInfo() {
      return this.$store.getters.userInfo
    },
    siteInfo() {
      return this.$store.getters.siteInfo
    }
  },
  data() {
    return {
      loading: false,
      orderId: '', // 订单ID
      // 地址信息
      addressInfo: {
        name: '',
        phone: '',
        address: ''
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
    }
  },
  computed: {
    // 可以添加计算属性
  },
  onLoad(options) {
    console.log(options)

    // 获取订单ID
    if (options && options.id) {
      this.orderId = options.id
      this.getOrderDetail()
    }

    // 启动倒计时
    this.startCountdown()
  },
  mounted() {
    // 页面加载完成后，使用全局信息更新地址信息
    this.updateAddressFromGlobal()
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

    // 从全局信息更新地址信息
    updateAddressFromGlobal() {
      // 使用this.$store.getters获取全局信息
      const userInfo = this.$store.getters.userInfo
      const siteInfo = this.$store.getters.siteInfo
      
      console.log('userInfo:', userInfo)
      console.log('siteInfo:', siteInfo)

      // 使用全局用户信息更新地址信息
      if (userInfo && userInfo.phone) {
        console.log('使用用户信息更新地址')
        this.addressInfo.name = userInfo.nickname || userInfo.username || '用户'
        this.addressInfo.phone = userInfo.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
      }

      // 使用全局站点信息更新地址
      if (siteInfo && siteInfo.location) {
        this.addressInfo.address = siteInfo.location
      } else if (siteInfo && siteInfo.name) {
        this.addressInfo.address = siteInfo.name
      }

      // 如果还没有地址信息，使用默认值
      if (!this.addressInfo.name) {
        this.addressInfo.name = '用户'
      }
      if (!this.addressInfo.phone) {
        this.addressInfo.phone = '185****3662'
      }
      if (!this.addressInfo.address) {
        this.addressInfo.address = '北京尚德井小区菜鸟驿站'
      }
      
      console.log('最终地址信息:', this.addressInfo)
    },

    // 获取订单详情
    getOrderDetail() {
      getGroupOrderDetail(this.orderId).then(res => {
        if (res.status === 200 && res.data) {
          const data = res.data
          // 更新数据
          if (data.goods && data.goods.length > 0) {
            const good = data.goods[0]
            this.goodsInfo = {
              id: good.combination_id || good.id,
              title: good.goods_name || good.title || '商品名称',
              spec: good.spec || good.sku || '',
              price: good.price || '0',
              quantity: good.quantity || 1,
              image: this.$util.getImageUrl(good.image) || '/static/images/pending_payment/product_image.png'
            }

            // 更新价格信息
            this.priceInfo = {
              deliveryFee: 0, // 配送费用
              goodsTotal: data.total_price || good.subtotal || '0', // 商品总价
              totalPrice: data.pay_price || data.total_price || '0' // 合计
            }
          }

          // 更新订单信息
          this.orderInfo = {
            orderNo: data.order_number || '',
            payType: data.pay_type_text || '微信支付',
            orderTime: data.create_time_text || data.create_time || '',
            payTime: data.pay_time || '',
            remark: data.remark || '-' // 备注，如果没有就显示'-'
          }

          // 使用全局信息更新地址信息
          this.updateAddressFromGlobal()

          // 设置倒计时
          this.countdownTime = 30 * 60 // 默认30分钟
          this.startCountdown()
        } else {
          uni.showToast({
            title: res.msg || '获取订单信息失败',
            icon: 'none'
          })
        }
      }).catch(err => {
        console.error('获取订单详情失败:', err)
        uni.showToast({
          title: '获取订单信息失败',
          icon: 'none'
        })
      })
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
    // 确认支付
    confirmPayment() {
      // 默认使用微信支付
      const payType = 1

      uni.showLoading({ title: '正在支付...' })

      // 使用封装好的接口函数
      groupOrderPay(this.orderId, payType)
        .then(res => {
          uni.hideLoading()
          if (res.status === 200) {
            uni.showToast({
              title: '支付成功',
              icon: 'success'
            })

            // 跳转到支付成功页面
            setTimeout(() => {
              uni.redirectTo({
                url: `/pages/goods/payment_success/index?order_id=${this.orderId}`
              })
            }, 1500)
          } else {
            uni.showToast({
              title: res.msg || '支付失败',
              icon: 'none'
            })
          }
        })
        .catch(err => {
          uni.hideLoading()
          uni.showToast({
            title: '支付失败，请重试',
            icon: 'none'
          })
          console.error('支付请求失败:', err)
        })

      this.showPaymentModal = false
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
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #FFFFFF;
    border-radius: 32rpx 32rpx 0 0;
    z-index: 1000;
    padding-top: 0;
    padding-bottom: 0;
    // min-height: 420rpx;
    // max-height: 80vh;
    height: 300rpx;
    overflow-y: auto;

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
      margin-top: 90rpx;
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