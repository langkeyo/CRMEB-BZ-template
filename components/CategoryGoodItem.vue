<template>
    <view class="category-good-item" @click="goDetail">
        <view class="good-image">
            <image :src="good.image" mode="aspectFill"></image>
            <view class="activity-tag" v-if="good.activity && good.activity.type">
                <text v-if="good.activity.type === '1' && $permission('seckill')">{{ $t(`秒杀`) }}</text>
                <text v-if="good.activity.type === '2' && $permission('bargain')">{{ $t(`砍价`) }}</text>
                <text v-if="good.activity.type === '3' && $permission('combination')">{{ $t(`拼团`) }}</text>
            </view>
        </view>
        <view class="good-info">
            <view class="good-name line2">{{ good.store_name }}</view>
            <view class="good-price">
                <text class="currency">￥</text>
                <text class="price">{{ good.price }}</text>
                <text class="original-price" v-if="good.ot_price && good.ot_price !== good.price">￥{{ good.ot_price
                    }}</text>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'CategoryGoodItem',
    props: {
        good: {
            type: Object,
            required: true
        }
    },
    methods: {
        goDetail () {
            this.$emit('click', this.good)
        }
    }
}
</script>

<style lang="scss" scoped>
.category-good-item {
    width: 100%;
    border-radius: 12rpx;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

    .good-image {
        width: 100%;
        height: 300rpx;
        position: relative;

        image {
            width: 100%;
            height: 100%;
            border-radius: 12rpx 12rpx 0 0;
        }

        .activity-tag {
            position: absolute;
            top: 16rpx;
            left: 0;
            background-color: var(--view-theme);
            color: #fff;
            font-size: 22rpx;
            padding: 4rpx 16rpx;
            border-radius: 0 16rpx 16rpx 0;
        }
    }

    .good-info {
        padding: 16rpx;

        .good-name {
            font-size: 28rpx;
            color: #333;
            line-height: 1.3;
            height: 72rpx;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .good-price {
            margin-top: 10rpx;
            display: flex;
            align-items: baseline;

            .currency {
                color: var(--view-theme);
                font-size: 24rpx;
            }

            .price {
                color: var(--view-theme);
                font-size: 32rpx;
                font-weight: bold;
            }

            .original-price {
                margin-left: 12rpx;
                color: #999;
                font-size: 24rpx;
                text-decoration: line-through;
            }
        }
    }
}
</style>