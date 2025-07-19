<template>
  <view class="order-actions-section">
    <view class="action-item" v-for="(item, index) in actions" :key="index" @click="onActionClick(item.type)">
      <image class="action-icon" :src="item.icon" />
      <text class="action-label">{{ item.label }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'OrderActions',
  data() {
    return {
      actions: [
        {
          type: 'pending_payment',
          label: '待支付',
          icon: '/static/images/user/wallet_icon.svg'
        },
        {
          type: 'pending_delivery',
          label: '待收货',
          icon: '/static/images/user/truck_icon.svg'
        },
        {
          type: 'pending_review',
          label: '待评价',
          icon: '/static/images/user/chat_icon.svg'
        },
        {
          type: 'after_sale',
          label: '售后',
          icon: '/static/images/user/exchange_icon.svg'
        },
        {
          type: 'all_orders',
          label: '全部订单',
          icon: '/static/images/user/document_icon.svg'
        }
      ]
    };
  },
  methods: {
    onActionClick(type) {
      this.$emit('action-click', type);
    }
  }
}
</script>

<style lang="scss" scoped>
.order-actions-section {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  margin: 20rpx 22rpx 20rpx 30rpx;
  padding: 30rpx 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  z-index: 1;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 10rpx;
}

.action-icon {
  width: 40rpx;
  height: 40rpx;
  margin-bottom: 20rpx;
}

.action-label {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 22rpx;
  line-height: 31rpx;
  color: #4D4D4D;
}
</style>
