<script>
export default {
  data() {
    return {
      isVisible: false
    };
  },
  methods: {
    scrollToTop() {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    }
  },
  // uni-app页面生命周期函数
  onPageScroll(e) {
    // 滚动超过200px时显示按钮
    this.isVisible = e.scrollTop > 200;
  }
}
</script>

<template>
  <view class="topping-button" v-show="isVisible" @tap="scrollToTop">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0H20V2.33333H0V0ZM15.7367 9.58333L11.1403 4.736C10.8552 4.44417 10.4525 4.2545 10 4.2545C9.5475 4.2545 9.145 4.44417 8.8645 4.739L4.2585 9.57983C4.01817 9.84083 3.865 10.178 3.865 10.5518C3.865 11.3543 4.552 12.005 5.39883 12.005C5.41067 12.005 5.42217 12.0035 5.43383 12.0032V12.0123H7.5V20H12.5V12.0123H14.5102V12.0007C14.5405 12.0023 14.5703 12.0053 14.6013 12.0053C15.4483 12.0053 16.1352 11.3545 16.1352 10.5518C16.1352 10.178 15.9818 9.841 15.7367 9.58333Z" fill="#FF840B"/>
    </svg>
  </view>
</template>

<style lang="scss" scoped>
.topping-button {
  position: fixed;
  right: 20rpx;
  bottom: 360rpx;
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(203.79% 203.79% at 51.69% -87.88%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.4) 100%);
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(33.15px);
  border-radius: 4px;
  z-index: 999;
  
  svg {
    width: 40rpx;
    height: 40rpx;
  }
}
</style>