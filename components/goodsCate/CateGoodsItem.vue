<template>
    <view class="cate-goods-item">
        <image :src="img" class="goods-img" mode="aspectFill" />
        <view class="goods-info">
            <view class="goods-title">{{ title }}</view>
            <view class="goods-price">￥{{ price }}</view>
            <slot></slot>
        </view>
    </view>
</template>
<script>
export default {
    name: 'CateGoodsItem',
    props: {
        img: String,
        title: String,
        price: [String, Number]
    }
}
</script>
<style scoped>
.cate-goods-item {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    padding: 20rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.goods-img {
    width: 100rpx;
    height: 100rpx;
    border-radius: 12rpx;
    margin-right: 20rpx;
}

.goods-info {
    flex: 1;
}

.goods-title {
    font-size: 28rpx;
    color: #222;
    margin-bottom: 8rpx;
}

.goods-price {
    font-size: 26rpx;
    color: #ff9900;
}
</style>