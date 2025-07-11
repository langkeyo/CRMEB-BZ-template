<template>
  <view class="promotion-bar">
    <view class="tag">{{ $t(`参与满减`) }}</view>
    <view class="info">{{ promotionInfo }}</view>
    <view class="more-btn" @click="onMoreClick">{{ $t(`再逛逛~`) }}</view>
  </view>
</template>

<script>
export default {
  name: 'PromotionBar',
  props: {
    promotionInfo: {
      type: String,
      default: ''
    }
  },
  methods: {
    onMoreClick() {
      this.$emit('more');
    }
  }
}
</script>

<style scoped lang="scss">
.promotion-bar {
  display: flex;
  align-items: center;
  padding: 16rpx 30rpx;
  background-color: #FFF7F0;
  margin: 2rpx 0;
  
  .tag {
    font-size: 24rpx;
    color: #fff;
    background-color: #FF840B;
    padding: 4rpx 12rpx;
    border-radius: 4rpx;
    margin-right: 15rpx;
  }
  
  .info {
    flex: 1;
    font-size: 26rpx;
    color: #666;
  }
  
  .more-btn {
    font-size: 26rpx;
    color: #FF840B;
  }
}
</style>
