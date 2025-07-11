<!--
HouseBasicInfo 房源基本信息组件
用于显示房源的基本信息，包括标题、位置、价格、面积、楼层、标签等

Props:
- houseInfo: Object - 房源信息对象 (必需)
- houseTags: Array - 房源标签数组 (必需)
-->

<template>
  <view class="house-info">
    <view class="house-title">{{ houseInfo.title }}</view>
    <view class="house-location">
      <image src="/static/images/common/icons/location_pin.svg" class="location-icon"></image>
      <text>{{ houseInfo.address }}</text>
    </view>

    <view class="price-info">
      <view class="price-box">
        <text class="price">{{ houseInfo.price }}</text>
        <text class="unit">{{ houseInfo.unit }}</text>
      </view>

      <view class="house-attributes">
        <view class="attribute">
          <text class="attribute-value">{{ houseInfo.size }}</text>
          <text class="attribute-label">面积</text>
        </view>
        <view class="attribute">
          <text class="attribute-value">{{ houseInfo.floor }}</text>
          <text class="attribute-label">楼层</text>
        </view>
      </view>
    </view>

    <view class="house-tags">
      <view class="tag" v-for="(tag, index) in houseTags" :key="index">{{ tag }}</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'HouseBasicInfo',
  props: {
    houseInfo: {
      type: Object,
      required: true,
      default: () => ({
        title: '',
        address: '',
        price: '',
        unit: '',
        size: '',
        floor: ''
      })
    },
    houseTags: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
/* 房源基本信息 */
.house-info {
  background-color: #FFFFFF;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .house-title {
    font-size: 36rpx;
    font-weight: 500;
    color: #333333;
    margin-bottom: 16rpx;
  }

  .house-location {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    .location-icon {
      width: 24rpx;
      height: 24rpx;
      margin-right: 8rpx;
    }

    text {
      font-size: 26rpx;
      color: #666666;
    }
  }

  .price-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .price-box {
      display: flex;
      align-items: baseline;

      .price {
        font-size: 48rpx;
        font-weight: 600;
        color: #FF6B35;
        margin-right: 8rpx;
      }

      .unit {
        font-size: 28rpx;
        color: #666666;
      }
    }

    .house-attributes {
      display: flex;
      gap: 40rpx;

      .attribute {
        display: flex;
        flex-direction: column;
        align-items: center;

        .attribute-value {
          font-size: 32rpx;
          font-weight: 500;
          color: #FF6B35;
          margin-bottom: 4rpx;
        }

        .attribute-label {
          font-size: 24rpx;
          color: #999999;
        }
      }
    }
  }

  .house-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;

    .tag {
      padding: 8rpx 16rpx;
      background-color: #F5F5F5;
      border-radius: 20rpx;
      font-size: 24rpx;
      color: #666666;
    }
  }
}
</style>
