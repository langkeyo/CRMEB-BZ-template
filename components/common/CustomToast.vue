<template>
  <view class="custom-toast-overlay" v-if="visible" @click="hide">
    <view class="custom-toast" :class="{ 'show': visible, 'compact-mode': isCompactMode }">
      <!-- 图标区域 -->
      <view class="toast-icon" :class="{ 'compact-icon': isCompactMode }">
        <view class="success-icon" v-if="type === 'success'" :class="{ 'small-icon': isCompactMode }" :style="iconSizeStyle">
          <view class="checkmark">
            <view class="checkmark-stem"></view>
            <view class="checkmark-kick"></view>
          </view>
        </view>
        <view class="error-icon" v-else-if="type === 'error'" :class="{ 'small-icon': isCompactMode }" :style="iconSizeStyle">
          <view class="error-cross">
            <view class="error-line error-line-1"></view>
            <view class="error-line error-line-2"></view>
          </view>
        </view>
        <view class="info-icon" v-else-if="type === 'info'" :class="{ 'small-icon': isCompactMode }" :style="iconSizeStyle">
          <text class="info-text">i</text>
        </view>
      </view>
      
      <!-- 消息文本 -->
      <view class="toast-message" :class="{ 'compact-message': isCompactMode }">
        <text class="message-text" :class="{ 'small-text': isCompactMode }">{{ message }}</text>
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
      timer: null,
      isCompactMode: false, // 紧凑模式标记
      iconSize: null // 自定义图标大小
    }
  },
  computed: {
    // 计算图标大小样式
    iconSizeStyle() {
      if (this.iconSize) {
        return {
          width: this.iconSize,
          height: this.iconSize
        };
      }
      return {};
    }
  },
  methods: {
    show(options = {}) {
      const { message = '操作成功', type = 'success', duration = 2000, style = {} } = options;
      
      this.message = message;
      this.type = type;
      this.visible = true;
      // 检查是否应该使用紧凑模式
      this.isCompactMode = style.compactMode === true;
      // 设置自定义图标大小
      this.iconSize = style.iconSize || null;
      
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
  min-width: 180rpx;
  max-width: 280rpx;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 10rpx;
  padding: 18rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
  transform: scale(0.8);
  opacity: 0;
  transition: all 0.2s ease-out;
  pointer-events: auto;
  
  &.show {
    transform: scale(1);
    opacity: 1;
  }
}

.toast-icon {
  margin-bottom: 8rpx;
}

/* 成功图标 */
.success-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.checkmark {
  width: 28rpx;
  height: 28rpx;
  position: relative;
}

.checkmark-stem {
  position: absolute;
  width: 3rpx;
  height: 16rpx;
  background: #333333;
  left: 16rpx;
  top: 8rpx;
  border-radius: 1rpx;
  transform: rotate(45deg);
}

.checkmark-kick {
  position: absolute;
  width: 8rpx;
  height: 3rpx;
  background: #333333;
  left: 10rpx;
  top: 18rpx;
  border-radius: 1rpx;
  transform: rotate(-45deg);
}

/* 错误图标 */
.error-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: #F44336;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.error-cross {
  width: 25rpx;
  height: 25rpx;
  position: relative;
}

.error-line {
  position: absolute;
  width: 20rpx;
  height: 3rpx;
  background: #fff;
  border-radius: 2rpx;
  top: 11rpx;
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
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: #2196F3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-text {
  color: #fff;
  font-size: 28rpx;
  font-weight: bold;
  font-family: 'PingFang SC', sans-serif;
}

.toast-message {
  text-align: center;
}

.message-text {
  color: #fff;
  font-size: 22rpx;
  line-height: 1.3;
  font-family: 'PingFang SC', sans-serif;
  font-weight: normal;
}

// 紧凑模式样式
.custom-toast.compact-mode {
  flex-direction: column;
  align-items: center;
  padding: 18rpx 20rpx;
  min-width: 160rpx;
  max-width: 280rpx;
}

.compact-icon {
  margin-bottom: 8rpx;
}

.small-icon {
  width: 42rpx !important;
  height: 42rpx !important;
}

.compact-message {
  margin-top: 2rpx;
}

.small-text {
  font-size: 22rpx;
  line-height: 1.3;
}
</style>
