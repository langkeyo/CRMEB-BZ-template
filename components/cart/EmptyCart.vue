<template>
  <view class="noCart">
    <view class="emptyBox">
      <image :src="imgHost + '/statics/images/no-thing.png'"></image>
      <view class="tips">{{ $t(`暂无商品`) }}</view>
    </view>

    <!-- 猜你喜欢部分 -->
    <view class="guess-like" v-if="hostProduct.length">
      <view class="title guess-like-title">
        <view class="line"></view>
        <view class="text">{{ $t(`—猜你喜欢—`) }}</view>
        <view class="line"></view>
      </view>
      <recommend :hostProduct="hostProduct"></recommend>
    </view>
  </view>
</template>

<script>
export default {
  name: 'EmptyCart',
  props: {
    imgHost: {
      type: String,
      default: ''
    },
    hostProduct: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped lang="scss">
.noCart {
  background-color: #fff;
  padding: 30rpx;
  
  .emptyBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100rpx 0;
    
    image {
      width: 240rpx;
      height: 240rpx;
      margin-bottom: 30rpx;
    }
    
    .tips {
      font-size: 28rpx;
      color: #999;
    }
  }
  
  .guess-like {
    margin-top: 50rpx;
    
    .guess-like-title {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 30rpx;
      
      .line {
        width: 100rpx;
        height: 1px;
        background-color: #ddd;
      }
      
      .text {
        font-size: 28rpx;
        color: #666;
        margin: 0 20rpx;
      }
    }
  }
}
</style>
