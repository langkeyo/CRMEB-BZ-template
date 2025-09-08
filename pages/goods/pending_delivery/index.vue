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
      <!-- 商品列表 -->
      <view class="product-list" v-if="order.goods && order.goods.length > 0">
        <view class="product-item" v-for="(product, idx) in order.goods" :key="idx">
          <view class="product-image">
            <image :src="formatImage(product.image)" mode="aspectFill"></image>
          </view>
          <view class="product-details">
            <view class="product-name">{{ product.title }}</view>
            <view class="product-spec">
              <view class="spec-tag">{{ product.spec || '默认规格' }}</view>
              <view class="product-quantity">×{{ product.quantity }}</view>
            </view>
            <view class="product-price">￥{{ product.price }}</view>
          </view>
        </view>
      </view>
      <view class="divider"></view>
      <view class="logistics-status" :class="{ delivered: isOrderDelivered(order) || order.status !== 1 }">
        <image :src="isOrderDelivered(order) && order.status !== 1
          ? '/static/images/common/delivered-status.svg'
          : '/static/images/pending_delivery/road-haul-cargo.svg'" mode="aspectFit"></image>
        <text>{{ getLogisticsStatusText(order) }}</text>
      </view>
      <view class="button-group">
        <view class="not-found-btn" @click="showNotFoundNotice">未找到商品</view>
        <view class="confirm-btn" :class="{ received: isOrderDelivered(order) && order.status !== 1 }"
          @click="confirmDelivery(order)">
          {{ isOrderDelivered(order) && order.status !== 1 ? '已收货' : '确认收货' }}
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="orderList.length === 0" class="empty-state">
      <image class="empty-image" src="/static/images/common/empty-image.png" mode="aspectFit"></image>
      <text class="empty-text">暂无待收货订单</text>
    </view>

    <!-- 弹窗 -->
    <!-- <view v-if="showPopup" class="popup-text" @click="handlePopupConfirm">{{ popupText }}</view> -->

    <!-- 自定义输入框弹窗 -->
    <view v-if="showCustomInput" class="custom-input-overlay" @click="closeCustomInput">
      <view class="custom-input-popup" @click.stop>
        <view class="popup-header">
          <text>反馈商品缺失</text>
          <text class="close-icon" @click="closeCustomInput">×</text>
        </view>
        <view class="popup-content">
          <view class="input-container">
            <CustomInput v-model="feedbackContent" placeholder="请输入您遇到的问题描述..." class="feedback-input" />
          </view>
        </view>
        <view class="popup-footer">
          <view class="cancel-btn" @click="closeCustomInput">取消</view>
          <view class="submit-btn" @click="submitFeedbackFromInput">提交</view>
        </view>
      </view>
    </view>

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
import { submitOrderFeedback } from '@/api/group.js'
import { HTTP_REQUEST_URL } from '@/config/app.js'
import CustomInput from '@/components/CustomInput.vue'

export default {
  mixins: [colors],
  components: {
    CustomInput
  },
  data() {
    return {
      status: 'onway', // 订单状态：在路上
      showPopup: false,
      popupText: '',
      orderList: [],
      page: 1,
      limit: 10,
      loading: false,
      likeList: [],
      showCustomInput: false,
      feedbackContent: '',
      currentOrder: null,
      currentProduct: null
    }
  },
  onLoad() {
    this.getOrderList()
    this.getRecommendProducts()
  },
  methods: {
    // 判断订单是否已送达
    isOrderDelivered(order) {
      // 检查是否有商品的收货时间
      if (order.goods && order.goods.length > 0) {
        // 检查所有商品是否有收货时间
        for (let i = 0; i < order.goods.length; i++) {
          if (order.goods[i].receiving_time) {
            const receivingTime = order.goods[i].receiving_time * 1000 // 转换为毫秒
            const now = new Date().getTime() // 当前时间毫秒数
            // 如果当前时间已超过预计送达时间，认为已送达
            if (now > receivingTime) {
              return true
            }
          }
        }
      }
      return false
    },

    // 格式化预计送达时间显示
    formatDeliveryTime(receivingTime) {
      if (!receivingTime) return '今日'

      const deliveryDate = new Date(receivingTime * 1000)
      const now = new Date()
      const diffTime = deliveryDate - now
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))

      // 今天内的时间显示
      if (deliveryDate.toDateString() === now.toDateString()) {
        if (diffHours <= 0) return '刚刚'
        if (diffHours < 2) return '1小时内'
        if (diffHours < 24) return `${diffHours}小时内`
      }

      // 跨天的时间显示
      const hours = deliveryDate.getHours()
      const minutes = deliveryDate.getMinutes()
      return `${deliveryDate.getMonth() + 1}月${deliveryDate.getDate()}日 ${hours}:${minutes < 10 ? '0' + minutes : minutes}`
    },

    // 获取物流状态文本
    getLogisticsStatusText(order) {
      if (order.goods && order.goods.length > 0) {
        // 检查是否有商品的收货时间
        for (let i = 0; i < order.goods.length; i++) {
          if (order.goods[i].receiving_time) {
            const receivingTime = order.goods[i].receiving_time
            const formattedTime = this.formatDeliveryTime(receivingTime)

            if (this.isOrderDelivered(order) && order.status !== 1) {
              return `商品已送达，送达时间：${formattedTime}`
            } else {
              return `司机正在路上~ 预计${formattedTime}送达`
            }
          }
        }
      }
      return '正在配送中，请耐心等待'
    },
    goBack() {
      uni.navigateBack()
    },
    formatImage(url) {
      if (!url) return '/static/images/empty_product.png'
      if (url.startsWith('http')) return url
      return HTTP_REQUEST_URL + url
    },
    formatDeliveryTime(createTime) {
      if (!createTime) return '今日'

      const orderDate = new Date(createTime * 1000)
      const now = new Date()

      // 如果是今天的订单
      if (orderDate.toDateString() === now.toDateString()) {
        // 预计2小时内送达
        const deliveryTime = new Date(orderDate.getTime() + 2 * 60 * 60 * 1000)
        const hours = deliveryTime.getHours()
        const minutes = deliveryTime.getMinutes()
        return `今日${hours}:${minutes < 10 ? '0' + minutes : minutes}`
      } else {
        // 如果不是今天的订单，显示日期
        return `${orderDate.getMonth() + 1}月${orderDate.getDate()}日`
      }
    },
    getOrderList() {
      this.loading = true
      getGroupOrderList({
        page: this.page,
        limit: this.limit,
        status: 1 // 1=待收货
      }).then(res => {
        this.loading = false
        if (res.status === 200 && res.data) {
          this.orderList = res.data.list || []
          console.log('待收货订单列表:', this.orderList)
        } else {
          this.orderList = []
        }
      }).catch((err) => {
        console.error('获取订单列表失败:', err)
        this.loading = false
        this.orderList = []
      })
    },
    confirmDelivery(order) {
      // 如果已送达，不执行操作
      if (this.isOrderDelivered(order) && order.status !== 1) {
        return
      }
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
              // this.showPopup = true
              setTimeout(() => {
                this.showPopup = false
              }, 2000)
            })
          }
        }
      })
    },
    showNotFoundNotice() {
      // 获取当前订单信息
      const order = this.orderList[0] // 假设只处理第一个订单
      if (!order || !order.goods || order.goods.length === 0) {
        uni.showToast({
          title: '无法获取订单信息',
          icon: 'none'
        })
        return
      }

      const product = order.goods[0]

      // 设置当前订单和产品信息
      this.currentOrder = order
      this.currentProduct = product

      // 显示自定义输入框
      this.showCustomInput = true
      this.feedbackContent = ''
    },

    // 提交反馈
    async submitFeedback(data) {
      try {
        // 调用实际的订单反馈提交API
        const res = await submitOrderFeedback(data)
        if (res && res.status === 200) {
          uni.showToast({
            title: '反馈已提交',
            icon: 'success'
          })

          // 显示成功提示
          this.popupText = '反馈已提交给平台管理员'
          this.showPopup = true
          setTimeout(() => {
            this.showPopup = false
          }, 2000)
        } else {
          uni.showToast({
            title: res.msg || '反馈提交失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('提交反馈失败:', error)
        uni.showToast({
          title: '反馈提交失败',
          icon: 'none'
        })
      }
    },

    // 提交反馈从自定义输入框
    submitFeedbackFromInput() {
      if (!this.feedbackContent || this.feedbackContent.trim() === '') {
        uni.showToast({
          title: '请输入反馈内容',
          icon: 'none'
        })
        return
      }

      if (!this.currentProduct) {
        uni.showToast({
          title: '无法获取产品信息',
          icon: 'none'
        })
        return
      }

      // 调用反馈API
      this.submitFeedback({
        order_goods_id: this.currentProduct.id || this.currentProduct.order_goods_id,
        feedback_information: this.feedbackContent
      })

      // 关闭输入框
      this.closeCustomInput()
    },

    // 关闭自定义输入框
    closeCustomInput() {
      this.showCustomInput = false
      this.feedbackContent = ''
      this.currentOrder = null
      this.currentProduct = null
    },
    gotoOrderComplete() {
      uni.navigateTo({
        url: '/pages/goods/order_list/all_orders'
      })
    },
    handlePopupConfirm() {
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
            }
          }).slice(0, 4) // 只显示前4个商品
        }
      }).catch(err => {
        console.error('获取推荐商品失败:', err)
      })
    },
    // 跳转到商品详情页
    goToProductDetail(item) {
      if (item && item.id) {
        uni.navigateTo({
          url: `/pages/goods_details/index?id=${item.id}`
        })
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
      height: 88rpx;
      /* 44px * 2 */

      .left {
        position: absolute;
        left: 30rpx;
        /* 15px * 2 */
        display: flex;
        align-items: center;

        .back-icon {
          width: 20rpx;
          /* 10px * 2 */
          height: 36rpx;
          /* 18px * 2 */
          margin-right: 10rpx;
          /* 5px * 2 */
        }

        text {
          color: #333333;
          font-size: 36rpx;
          /* 18px * 2 */
          margin-left: 10rpx;
        }
      }

      .title {
        font-size: 36rpx;
        /* 18px * 2 */
        font-weight: 400;
        color: #1A1A1A;
      }
    }
  }







  // 订单卡片
  .order-card {
    background: #FFFFFF;
    border-radius: 8rpx;
    /* 4px * 2 */
    margin: 20rpx 30rpx;
    /* 10px 15px * 2 */
    padding: 30rpx;
    /* 15px * 2 */

    .order-info {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .order-no {
        color: #B3B3B3;
        font-size: 26rpx;
        /* 13px * 2 */
      }

      .order-status {
        color: #DA3232;
        font-size: 30rpx;
        /* 15px * 2 */
      }
    }

    .product-list {
      margin: 30rpx 0;
      /* 15px * 2 */

      .product-item {
        display: flex;
        margin-bottom: 30rpx;
        /* 15px * 2 */

        &:last-child {
          margin-bottom: 0;
        }

        .product-image {
          width: 190rpx;
          /* Make it square */
          height: 190rpx;
          /* Keep the same height */
          border-radius: 8rpx;
          /* 4px * 2 */
          overflow: hidden;
          margin-right: 30rpx;
          /* 15px * 2 */

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
            font-size: 30rpx;
            /* 15px * 2 */
            color: #1A1A1A;
            margin-bottom: 10rpx;
            /* 5px * 2 */
          }

          .product-spec {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10rpx;
            /* 5px * 2 */

            .spec-tag {
              background: #F7F7F7;
              color: #999999;
              font-size: 28rpx;
              /* 14px * 2 */
              padding: 4rpx 16rpx;
              /* 2px 8px * 2 */
              border-radius: 12rpx;
              /* 6px * 2 */
            }

            .product-quantity {
              color: #999999;
              font-size: 28rpx;
              /* 14px * 2 */
            }
          }

          .product-price {
            font-size: 30rpx;
            /* 15px * 2 */
            color: #1A1A1A;
          }
        }
      }
    }

    .divider {
      height: 1rpx;
      /* 0.5px * 2 */
      background: #F0F0F0;
      margin-bottom: 30rpx;
      /* 15px * 2 */
    }

    .logistics-status {
      padding: 20rpx 30rpx;
      /* 10px 15px * 2 */
      color: #000000;
      font-size: 30rpx;
      /* 15px * 2 */
      margin-bottom: 30rpx;
      /* 15px * 2 */
      background-color: #F8F8F8;
      border-radius: 8rpx;
      /* 4px * 2 */
      display: flex;
      align-items: center;

      image {
        width: 40rpx;
        /* 20px * 2 */
        height: 40rpx;
        /* 20px * 2 */
        margin-right: 16rpx;
        /* 8px * 2 */
      }

      &.delivered {
        font-weight: 500;

        .delivered-icon {
          width: 40rpx;
          /* 20px * 2 */
          height: 40rpx;
          /* 20px * 2 */
          border-radius: 50%;
          background-color: #4CD964;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 10rpx;
          /* 5px * 2 */

          .iconfont {
            color: #FFFFFF;
            font-size: 24rpx;
            /* 12px * 2 */
          }
        }
      }
    }

    .button-group {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .not-found-btn {
        height: 60rpx;
        /* 30px * 2 */
        padding: 0 30rpx;
        /* 0 15px * 2 */
        border-radius: 30rpx;
        /* 15px * 2 */
        background: #F0F0F0;
        color: #4D4D4D;
        font-size: 30rpx;
        /* 15px * 2 */
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20rpx;
        /* 10px * 2 */

        &.active {
          background: #4D4D4D;
          color: #FFFFFF;
        }
      }

      .confirm-btn {
        height: 60rpx;
        /* 30px * 2 */
        padding: 0 30rpx;
        /* 0 15px * 2 */
        border-radius: 30rpx;
        /* 15px * 2 */
        background: #FF840B;
        color: #FFFFFF;
        font-size: 30rpx;
        /* 15px * 2 */
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
    font-size: 26rpx;
    /* 13px * 2 */
    color: #999999;
    margin: 30rpx 0;
    margin-top: 60rpx;
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    line-height: 36rpx;
    /* 18px * 2 */

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
    padding: 30rpx;
    /* 15px * 2 */
    margin-top: 20rpx;
    /* 10px * 2 */

    .title {
      font-size: 36rpx;
      /* 18px * 2 */
      color: #000000;
      margin-bottom: 30rpx;
      /* 15px * 2 */
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
        margin-bottom: 30rpx;
        /* 15px * 2 */
        overflow: hidden;

        image {
          width: 100%;
          height: 320rpx;
          /* Increased to match Figma design (approximately 161px) */
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
    font-size: 32rpx;
    /* 16px * 2 */
    line-height: 44rpx;
    /* 22px * 2 */
    text-align: center;
    color: #FFFFFF;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 20rpx;
    /* 10px * 2 */
    padding: 24rpx 40rpx;
    /* 12px 20px * 2 */
    z-index: 1000;
    white-space: nowrap;
    /* 强制单行显示 */
    max-width: 90%;
    /* 最大宽度90%，避免超出屏幕 */
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

  // 自定义输入框弹窗样式
  .custom-input-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
  }

  .custom-input-popup {
    width: 80%;
    background-color: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .popup-header {
    padding: 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1rpx solid #eee;
    font-size: 32rpx;
    font-weight: bold;
  }

  .close-icon {
    font-size: 40rpx;
    color: #999;
  }

  .popup-content {
    padding: 30rpx;
    flex: 1;
  }

  .input-container {
    margin-bottom: 30rpx;
  }

  .feedback-input {
    width: 100%;
    height: 120rpx;
    padding: 20rpx;
    // border: 1rpx solid #ddd;
    border-radius: 8rpx;
    font-size: 28rpx;
  }

  .popup-footer {
    display: flex;
    border-top: 1rpx solid #eee;
  }

  .cancel-btn,
  .submit-btn {
    flex: 1;
    padding: 30rpx;
    text-align: center;
    font-size: 30rpx;
  }

  .cancel-btn {
    color: #999;
    border-right: 1rpx solid #eee;
  }

  .submit-btn {
    color: #FF840B;
    font-weight: bold;
  }
}
</style>