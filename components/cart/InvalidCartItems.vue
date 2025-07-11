<template>
  <view class="invalidGoods" v-if="invalidItems.length > 0">
    <view class="goodsNav acea-row row-between-wrapper">
      <view @click="onToggleOpen">
        <text
          class="iconfont"
          :class="isHidden ? 'icon-xiangxia' : 'icon-xiangshang'"
        ></text>
        {{ $t(`失效商品`) }}
      </view>
      <view class="del" @click="onClear">
        <text class="iconfont icon-shanchu1"></text>
        {{ $t(`清空`) }}
      </view>
    </view>
    <view class="goodsList" :hidden="isHidden">
      <block v-for="(item, index) in invalidItems" :key="index">
        <view class="item acea-row row-between-wrapper">
          <view class="invalid">{{ $t(`失效`) }}</view>
          <view class="pictrue">
            <image
              v-if="item.productInfo.attrInfo"
              :src="item.productInfo.attrInfo.image"
            ></image>
            <image v-else :src="item.productInfo.image"></image>
          </view>
          <view class="text acea-row row-column-between">
            <view class="line1 name">{{
              item.productInfo.store_name
            }}</view>
            <view class="infor line1" v-if="item.productInfo.attrInfo"
              >{{ $t(`属性`) }}：{{ item.productInfo.attrInfo.suk }}</view
            >
            <view class="acea-row row-between-wrapper">
              <view class="end">{{ $t(`该商品已失效`) }}</view>
            </view>
          </view>
        </view>
      </block>
    </view>
    <view
      class="loadingicon acea-row row-center-wrapper"
      v-if="invalidItems.length && loadend"
    >
      <text
        class="loading iconfont icon-jiazai"
        :hidden="!isLoading"
      ></text>
      {{ loadTitle }}
    </view>
  </view>
</template>

<script>
export default {
  name: 'InvalidCartItems',
  props: {
    invalidItems: {
      type: Array,
      default: () => []
    },
    isHidden: {
      type: Boolean,
      default: true
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    loadend: {
      type: Boolean,
      default: false
    },
    loadTitle: {
      type: String,
      default: ''
    }
  },
  methods: {
    onToggleOpen() {
      this.$emit('toggle-open');
    },
    onClear() {
      this.$emit('clear');
    }
  }
}
</script>

<style scoped lang="scss">
.invalidGoods {
  background-color: #fff;
  margin-bottom: 20rpx;
  
  .goodsNav {
    height: 86rpx;
    padding: 0 30rpx;
    font-size: 28rpx;
    color: #282828;
    border-bottom: 1px solid #f5f5f5;
    
    .iconfont {
      font-size: 28rpx;
      margin-right: 10rpx;
    }
    
    .del {
      color: #999;
      
      .iconfont {
        color: #999;
        font-size: 28rpx;
        margin-right: 10rpx;
      }
    }
  }
  
  .goodsList {
    .item {
      padding: 25rpx 30rpx;
      border-bottom: 1px solid #f5f5f5;
      
      &:last-child {
        border-bottom: none;
      }
      
      .invalid {
        width: 70rpx;
        height: 40rpx;
        background-color: #999;
        text-align: center;
        line-height: 40rpx;
        color: #fff;
        font-size: 22rpx;
        border-radius: 4rpx;
        margin-right: 15rpx;
      }
      
      .pictrue {
        width: 160rpx;
        height: 160rpx;
        
        image {
          width: 100%;
          height: 100%;
          border-radius: 10rpx;
        }
      }
      
      .text {
        flex: 1;
        margin-left: 20rpx;
        
        .name {
          font-size: 28rpx;
          color: #999;
        }
        
        .infor {
          font-size: 24rpx;
          color: #999;
          margin: 10rpx 0;
        }
        
        .end {
          font-size: 26rpx;
          color: #999;
        }
      }
    }
  }
  
  .loadingicon {
    font-size: 24rpx;
    color: #999;
    padding: 20rpx 0;
    
    .loading {
      animation: loading 3s infinite;
      font-size: 32rpx;
      margin-right: 10rpx;
    }
  }
}
</style>
