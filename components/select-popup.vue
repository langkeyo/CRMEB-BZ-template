<template>
  <view>
    <view class="popup-mask" @click="$emit('close')"></view>
    <view class="select-popup" :style="{top: top + 'px'}">
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'SelectPopup',
  props: {
    top: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>
.popup-mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5); /* 半透明黑色遮罩 */
  z-index: 998;
}
.select-popup {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  border-top-left-radius: 24rpx;
  border-top-right-radius: 24rpx;
  z-index: 999;
  box-shadow: 0 -4rpx 24rpx rgba(0,0,0,0.06);
  animation: slideUp 0.3s cubic-bezier(.25,.5,.5,.9);
  overflow: hidden;
}
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
</style> 