<template>
  <view class="custom-toast-overlay" v-if="visible" @click="hide">
    <view class="custom-toast" :class="{ 'show': visible }">
      <!-- 图标区域 -->
      <view class="toast-icon">
        <view class="success-icon" v-if="type === 'success'">
          <view class="checkmark">
            <view class="checkmark-stem"></view>
            <view class="checkmark-kick"></view>
          </view>
        </view>
        <view class="error-icon" v-else-if="type === 'error'">
          <view class="error-cross">
            <view class="error-line error-line-1"></view>
            <view class="error-line error-line-2"></view>
          </view>
        </view>
        <view class="info-icon" v-else-if="type === 'info'">
          <text class="info-text">i</text>
        </view>
      </view>
      
      <!-- 消息文本 -->
      <view class="toast-message">
        <text class="message-text">{{ message }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CustomToast',
  data() {
    return {
      visible: false,
      message: '',
      type: 'success', // success, error, info
      timer: null
    }
  },
  methods: {
    show(options = {}) {
      const { message = '操作成功', type = 'success', duration = 2000 } = options;
      
      this.message = message;
      this.type = type;
      this.visible = true;
      
      // 清除之前的定时器
      if (this.timer) {
        clearTimeout(this.timer);
      }
      
      // 自动隐藏
      this.timer = setTimeout(() => {
        this.hide();
      }, duration);
    },
    
    hide() {
      this.visible = false;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    }
  },
  
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
}
</script>

<style scoped lang="scss">
.custom-toast-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.custom-toast {
  min-width: 240rpx;
  max-width: 400rpx;
  background: rgba(0, 0, 0, 0.85);
  border-radius: 16rpx;
  padding: 40rpx 50rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10rpx);
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
  transform: scale(0.8);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  pointer-events: auto;
  
  &.show {
    transform: scale(1);
    opacity: 1;
  }
}

.toast-icon {
  margin-bottom: 16rpx;
}

/* 成功图标 */
.success-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #4CAF50;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: rgba(76, 175, 80, 0.2);
    animation: pulse 1.5s infinite;
  }
}

.checkmark {
  width: 30rpx;
  height: 30rpx;
  position: relative;
}

.checkmark-stem {
  position: absolute;
  width: 4rpx;
  height: 16rpx;
  background: #fff;
  left: 17rpx;
  top: 12rpx;
  border-radius: 2rpx;
  transform: rotate(45deg);
  animation: checkmark-stem 0.3s ease-in-out 0.1s both;
}

.checkmark-kick {
  position: absolute;
  width: 10rpx;
  height: 4rpx;
  background: #fff;
  left: 10rpx;
  top: 18rpx;
  border-radius: 2rpx;
  transform: rotate(-45deg);
  animation: checkmark-kick 0.3s ease-in-out both;
}

/* 错误图标 */
.error-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #F44336;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.error-cross {
  width: 30rpx;
  height: 30rpx;
  position: relative;
}

.error-line {
  position: absolute;
  width: 24rpx;
  height: 3rpx;
  background: #fff;
  border-radius: 2rpx;
  top: 13rpx;
  left: 3rpx;
}

.error-line-1 {
  transform: rotate(45deg);
}

.error-line-2 {
  transform: rotate(-45deg);
}

/* 信息图标 */
.info-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #2196F3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-text {
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  font-family: 'PingFang SC', sans-serif;
}

.toast-message {
  text-align: center;
}

.message-text {
  color: #fff;
  font-size: 24rpx;
  line-height: 36rpx;
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
}

/* 动画 */
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.4;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
}

@keyframes checkmark-stem {
  0% {
    height: 0;
  }
  100% {
    height: 20rpx;
  }
}

@keyframes checkmark-kick {
  0% {
    width: 0;
  }
  100% {
    width: 12rpx;
  }
}
</style>
