<!--
EnvironmentSection 周边环境组件
用于显示周边环境列表，支持横向滚动和指示器

Props:
- environments: Array - 环境列表数组 (必需)
- title: String - 标题 (默认: '周边环境')
-->

<template>
  <view class="section environment-section">
    <view class="section-header">
      <text class="section-title">{{ title }}</text>
    </view>
    <view class="environment-list">
      <view class="environment-item" v-for="(item, index) in environments" :key="index">
        <image :src="item.image" class="environment-image"></image>
        <text class="environment-name">{{ item.name }}</text>
      </view>
    </view>
    <view class="indicator">
      <view class="dot active"></view>
      <view class="dot"></view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'EnvironmentSection',
  props: {
    environments: {
      type: Array,
      required: true,
      default: () => []
    },
    title: {
      type: String,
      default: '周边环境'
    }
  }
}
</script>

<style lang="scss" scoped>
/* 周边环境 */
.section {
  background-color: #FFFFFF;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
    }
  }

  .environment-list {
    display: flex;
    overflow-x: auto;
    margin-bottom: 20rpx;

    &::-webkit-scrollbar {
      display: none;
    }

    .environment-item {
      flex-shrink: 0;
      width: 220rpx;
      margin-right: 20rpx;

      .environment-image {
        width: 220rpx;
        height: 160rpx;
        border-radius: 10rpx;
        margin-bottom: 10rpx;
      }

      .environment-name {
        font-size: 26rpx;
        color: #333333;
        text-align: center;
      }
    }
  }

  .indicator {
    display: flex;
    justify-content: center;
    gap: 8rpx;

    .dot {
      width: 12rpx;
      height: 12rpx;
      border-radius: 50%;
      background-color: #E5E5E5;

      &.active {
        background-color: #FF6B35;
      }
    }
  }
}
</style>
