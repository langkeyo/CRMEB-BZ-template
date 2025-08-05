<template>
  <view class="common-header">
    <!-- 头部导航 -->
    <view class="header-nav" :style="{ backgroundColor: backgroundColor }">
      <!-- 左侧返回按钮 -->
      <view class="left-section">
        <view v-if="showBack" class="back-btn" @click="handleBack">
          <image src="/static/common/icons/navigation/back_arrow.svg" class="back-icon" mode="aspectFit"></image>
          <text class="back-text">返回</text>
        </view>
        <view v-else class="back-placeholder"></view>
      </view>
      
      <!-- 中间标题 -->
      <view class="title-section">
        <text class="page-title">{{ title }}</text>
      </view>
      
      <!-- 右侧内容 -->
      <view class="right-section">
        <view v-if="rightText" class="right-text" @click="handleRightClick">{{ rightText }}</view>
        <view v-else-if="rightIcon" class="right-icon" @click="handleRightClick">
          <image :src="rightIcon" class="icon-image" mode="aspectFit"></image>
        </view>
        <view v-else class="right-placeholder"></view>
      </view>
    </view>
    
    <!-- 分割线 -->
    <view v-if="showBorder" class="divider"></view>
  </view>
</template>

<script>
export default {
  name: 'CommonHeader',
  props: {
    // 页面标题
    title: {
      type: String,
      default: ''
    },
    // 是否显示返回按钮
    showBack: {
      type: Boolean,
      default: true
    },
    // 右侧文字
    rightText: {
      type: String,
      default: ''
    },
    // 右侧图标
    rightIcon: {
      type: String,
      default: ''
    },
    // 背景色
    backgroundColor: {
      type: String,
      default: '#FFFFFF'
    },
    // 是否显示底部边框
    showBorder: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleBack() {
      this.$emit('back');
      // 如果没有监听back事件，默认执行返回操作
      if (!this.$listeners.back) {
        uni.navigateBack();
      }
    },
    handleRightClick() {
      this.$emit('rightClick');
    }
  }
}
</script>

<style lang="scss" scoped>
.common-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #FFFFFF;
}

/* 头部导航 */
.header-nav {
  display: flex;
  align-items: center;
  height: 88rpx;
  padding: 0 24rpx; /* 左右内边距统一为24rpx，确保对称 */
  position: relative;
}

/* 左侧区域 */
.left-section {
  width: 120rpx; /* 固定宽度，确保与右侧对称 */
  display: flex;
  align-items: center;
  justify-content: flex-start;

  .back-btn {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .back-icon {
      width: 32rpx;
      height: 32rpx;
      margin-right: 8rpx; /* 图标和文字间距 */
    }

    .back-text {
      font-size: 32rpx;
      color: #333333;
      font-weight: 400;
    }
  }

  .back-placeholder {
    width: 64rpx;
    height: 64rpx;
  }
}

/* 中间标题区域 */
.title-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .page-title {
    font-size: 36rpx;
    font-weight: 400;
    color: #000000;
    text-align: center;
  }
}

/* 右侧区域 */
.right-section {
  width: 120rpx; /* 固定宽度，与左侧保持一致 */
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  
  .right-text {
    font-size: 36rpx;
    font-weight: 400;
    color: #1A1A1A;
    text-align: center;
  }
  
  .right-icon {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .icon-image {
      width: 32rpx;
      height: 32rpx;
    }
  }
  
  .right-placeholder {
    width: 64rpx;
    height: 64rpx;
  }
}

/* 分割线 */
.divider {
  height: 1rpx;
  background-color: #F2F2F2;
  width: 100%;
}
</style>
