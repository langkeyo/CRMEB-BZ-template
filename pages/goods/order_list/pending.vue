<template>
  <view class="page-container">
    <!-- 顶部导航栏 -->
    <view class="page-header">
      <view class="header-left" @click="goBack">
        <image class="back-icon" src="/static/icons/back-arrow.svg"></image>
        <text class="back-text" @click="goBack">返回</text>
      </view>
      <view class="header-title">待支付</view>
      <view class="header-right">领券</view>
    </view>

    <!-- 订单列表 -->
    <view class="order-list">
      <view class="order-item" v-for="(item, index) in orderList" :key="index">
        <!-- 订单剩余时间和状态 -->
        <view class="order-top">
          <text class="order-timer">剩余时间 {{ formatCountdown(item) }}</text>
          <text class="order-status">{{ item.status_text || '待付款' }}</text>
        </view>
        <!-- 商品信息 -->
        <view class="product-info" v-if="item.goods && item.goods.length > 0">
          <image class="product-img" :src="formatImage(item.goods[0].image)" mode="aspectFill"></image>
          <view class="product-detail">
            <view class="product-title">{{ item.goods[0].title }}</view>
            <view class="product-spec" v-if="item.goods[0].spec">{{ item.goods[0].spec }}</view>
            <view class="product-price">￥{{ item.goods[0].price }}</view>
          </view>
          <view class="product-count">×{{ item.goods[0].quantity }}</view>
        </view>
        <!-- 需付款 -->
        <view class="order-bottom">
          <view class="order-amount">需付款：<text class="amount">￥{{ item.pay_price }}</text></view>
          <view class="order-actions">
            <button class="cancel-btn" @click="cancelOrder(item)">取消订单</button>
            <button class="pay-btn" @click="goPay(item)">立即付款</button>
          </view>
        </view>
      </view>
      <!-- 空状态 -->
      <view v-if="orderList.length === 0" class="empty-state">
        <image class="empty-image" src="/static/images/empty_order.png"></image>
        <text class="empty-text">暂无待支付订单</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getGroupOrderList, payGroupOrder, cancelOrder } from '@/api/group.js'
import { HTTP_REQUEST_URL } from '@/config/app.js'

export default {
  data() {
    return {
      orderList: [],
      page: 1,
      limit: 10,
      loading: false,
      timer: null
    }
  },
  onLoad() {
    this.startTimer()
  },
  onShow() {
    this.getOrderList()
  },
  onUnload() {
    this.clearTimer()
  },
  methods: {
    goBack() {
      uni.navigateBack({ delta: 1 })
    },
    getOrderList() {
      this.loading = true
      getGroupOrderList({
        page: this.page,
        limit: this.limit,
        status: 0 // 0=待支付
      }).then(res => {
        this.loading = false
        if (res.status === 200 && res.data) {
          this.orderList = res.data.list || []
          console.log('待支付订单列表:', this.orderList)
        } else {
          this.orderList = []
        }
      }).catch((err) => {
        console.error('获取订单列表失败:', err)
        this.loading = false
        this.orderList = []
      })
    },
    formatImage(url) {
      if (!url) return ''
      return this.$util.getImageUrl(url)
    },
    // 倒计时格式化
    formatCountdown(item) {
      // 假设后端返回 create_time（秒），支付有效期30分钟
      const expire = 30 * 60 // 30分钟
      const now = Math.floor(Date.now() / 1000)
      const left = Math.max(expire - (now - (parseInt(item.create_time) || 0)), 0)
      const h = String(Math.floor(left / 3600)).padStart(2, '0')
      const m = String(Math.floor((left % 3600) / 60)).padStart(2, '0')
      const s = String(left % 60).padStart(2, '0')
      return `${h}:${m}:${s}`
    },
    startTimer() {
      this.timer = setInterval(() => {
        this.$forceUpdate()
      }, 1000)
    },
    clearTimer() {
      if (this.timer) clearInterval(this.timer)
    },
    goPay(item) {
      payGroupOrder(item.id || item.order_id || item.order_number).then(res => {
        if (res.status === 200) {
          uni.navigateTo({
            url: `/pages/goods/pending_payment/index?id=${item.id || item.order_id || item.order_number}`
          })
        } else {
          uni.showToast({ title: res.msg || '支付失败', icon: 'none' })
        }
      }).catch((err) => {
        console.error('支付失败:', err)
        uni.showToast({ title: '支付失败', icon: 'none' })
      })
    },
    cancelOrder(item) {
      uni.showModal({
        title: '提示',
        content: '确定要取消该订单吗？',
        success: (res) => {
          if (res.confirm) {
            cancelOrder({ order_id: item.id || item.order_id || item.order_number }).then(resp => {
              if (resp.status === 200) {
                uni.showToast({ title: '已取消', icon: 'success' })
                this.getOrderList()
              } else {
                uni.showToast({ title: resp.msg || '取消失败', icon: 'none' })
              }
            }).catch((err) => {
              console.error('取消订单失败:', err)
              uni.showToast({ title: '取消失败', icon: 'none' })
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  background: #fff;
  min-height: 100vh;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 32rpx;
  background: #fff;
  border-bottom: 2rpx solid #F2F2F2;
  box-sizing: border-box;

  .header-left {
    display: flex;
    align-items: center;
    height: 100%;
    width: 17%;

    .back-icon {
      width: 28rpx;
      height: 28rpx;
      margin-right: 8rpx;
    }

    .back-text {
      font-size: 28rpx;
      color: #222;
      font-family: 'PingFang SC', sans-serif;
      font-weight: 400;
    }
  }

  .header-title {
    font-size: 32rpx;
    font-weight: 400;
    color: #222;
    font-family: 'PingFang SC', sans-serif;
    text-align: center;
    flex: 1;
    margin-left: -32rpx; // 视觉居中
  }

  .header-right {
    font-size: 28rpx;
    color: #4D4D4D;
    font-family: 'PingFang SC', sans-serif;
    font-weight: 400;
  }
}

.order-list {
  padding: 24rpx 12rpx 0 12rpx;
}

.order-item {
  background: #fff;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  margin-bottom: 24rpx;
  padding: 0 0 0 0;
  position: relative;
  width: 702rpx;
  min-height: 416rpx;
}

.order-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18rpx 19rpx 0 19rpx;

  .order-timer {
    font-size: 26rpx;
    color: #B3B3B3;
    font-family: 'PingFang SC', sans-serif;
    font-weight: 400;
  }

  .order-status {
    font-size: 30rpx;
    color: #DA3232;
    font-family: 'PingFang SC', sans-serif;
    font-weight: 400;
  }
}

.product-info {
  display: flex;
  align-items: center;
  padding: 0 0 0 19rpx;
  margin-top: 24rpx;

  .product-img {
    width: 108rpx;
    height: 108rpx;
    border-radius: 8rpx;
    object-fit: cover;
    background: #eee;
  }

  .product-detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 20rpx;

    .product-title {
      font-size: 36rpx;
      color: #000;
      font-family: 'PingFang SC', sans-serif;
      font-weight: 400;
      margin-bottom: 8rpx;
    }

    .product-spec {
      background: #F7F7F7;
      border-radius: 12rpx;
      display: inline-block;
      padding: 0 16rpx;
      font-size: 28rpx;
      color: #999;
      font-family: 'PingFang SC', sans-serif;
      font-weight: 400;
      margin-bottom: 8rpx;
      height: 40rpx;
      line-height: 40rpx;
    }

    .product-price {
      font-size: 30rpx;
      color: #1A1A1A;
      font-family: 'PingFang SC', sans-serif;
      font-weight: 400;
    }
  }

  .product-count {
    font-size: 30rpx;
    color: #999;
    font-family: 'PingFang SC', sans-serif;
    font-weight: 400;
    margin-left: 12rpx;
  }
}

.order-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 32rpx;
  padding: 0 19rpx 24rpx 19rpx;

  .order-amount {
    font-size: 30rpx;
    color: #999;
    font-family: 'PingFang SC', sans-serif;
    font-weight: 400;

    .amount {
      color: #1A1A1A;
      font-weight: 400;
      font-size: 30rpx;
      margin-left: 8rpx;
    }
  }

  .order-actions {
    display: flex;
    align-items: center;

    .cancel-btn {
      background: #F0F0F0;
      color: #4D4D4D;
      border: none;
      border-radius: 30rpx;
      font-size: 30rpx;
      font-family: 'PingFang SC', sans-serif;
      font-weight: 400;
      padding: 0 32rpx;
      height: 60rpx;
      margin-right: 16rpx;
      line-height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pay-btn {
      background: #FF840B;
      color: #fff;
      border: none;
      border-radius: 30rpx;
      font-size: 30rpx;
      font-family: 'PingFang SC', sans-serif;
      font-weight: 400;
      padding: 0 32rpx;
      height: 60rpx;
      line-height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

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
</style>