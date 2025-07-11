<!--
FacilitiesSection 房内设备组件
用于显示房内设备列表，支持横向滚动和指示器

Props:
- facilities: Array - 设备列表数组 (必需)
- title: String - 标题 (默认: '房内设备')
-->

<template>
  <view class="section facilities-section">
    <view class="section-header">
      <text class="section-title">{{ title }}</text>
    </view>
    <view class="facilities-list">
      <view class="facility-item" v-for="(item, index) in facilities" :key="index">
        <image :src="item.image" class="facility-image"></image>
        <text class="facility-name">{{ item.name }}</text>
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
  name: 'FacilitiesSection',
  props: {
    facilities: {
      type: Array,
      required: true,
      default: () => []
    },
    title: {
      type: String,
      default: '房内设备'
    }
  }
}
</script>

<style lang="scss" scoped>
/* 房内设备 */
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

  .facilities-list {
    display: flex;
    overflow-x: auto;
    margin-bottom: 20rpx;

    &::-webkit-scrollbar {
      display: none;
    }

    .facility-item {
      flex-shrink: 0;
      width: 220rpx;
      margin-right: 20rpx;

      .facility-image {
        width: 220rpx;
        height: 160rpx;
        border-radius: 10rpx;
        margin-bottom: 10rpx;
      }

      .facility-name {
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
