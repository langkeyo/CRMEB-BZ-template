<!--
NearbySection 附近房源组件
用于显示附近房源推荐列表

Props:
- nearbyHouses: Array - 附近房源列表 (必需)
- title: String - 标题 (默认: '附近房源')

Events:
- @viewDetail: 查看详情事件
- @viewMore: 查看更多事件
-->

<template>
  <view class="section nearby-section">
    <view class="section-header">
      <text class="section-title">{{ title }}</text>
    </view>
    <view class="nearby-list">
      <view class="nearby-item" v-for="(item, index) in nearbyHouses" :key="index" @click="viewDetail(item)">
        <image :src="item.image" class="nearby-image"></image>
        <view class="nearby-info">
          <text class="nearby-title">{{ item.title }}</text>
          <view class="nearby-detail">
            <text class="nearby-price">{{ item.price }}</text>
            <text class="nearby-area">{{ item.area }}</text>
          </view>
          <text class="nearby-more">查看详情 ></text>
        </view>
      </view>
    </view>
    <view class="view-more" @click="viewMore">查看更多</view>
  </view>
</template>

<script>
export default {
  name: 'NearbySection',
  props: {
    nearbyHouses: {
      type: Array,
      required: true,
      default: () => []
    },
    title: {
      type: String,
      default: '附近房源'
    }
  },
  methods: {
    viewDetail(item) {
      this.$emit('viewDetail', item);
    },
    viewMore() {
      this.$emit('viewMore');
    }
  }
}
</script>

<style lang="scss" scoped>
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

  .nearby-list {
    margin-bottom: 20rpx;

    .nearby-item {
      display: flex;
      margin-bottom: 20rpx;
      cursor: pointer;

      &:last-child {
        margin-bottom: 0;
      }

      .nearby-image {
        width: 120rpx;
        height: 90rpx;
        border-radius: 8rpx;
        margin-right: 20rpx;
        flex-shrink: 0;
      }

      .nearby-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .nearby-title {
          font-size: 28rpx;
          color: #333333;
          font-weight: 500;
          margin-bottom: 8rpx;
        }

        .nearby-detail {
          display: flex;
          gap: 20rpx;
          margin-bottom: 8rpx;

          .nearby-price, .nearby-area {
            font-size: 24rpx;
            color: #666666;
          }
        }

        .nearby-more {
          font-size: 24rpx;
          color: #999999;
          align-self: flex-end;
        }
      }
    }
  }

  .view-more {
    text-align: center;
    font-size: 28rpx;
    color: #FF6B35;
    padding: 20rpx 0;
    cursor: pointer;
  }
}
</style>
