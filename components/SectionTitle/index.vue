<template>
    <view class="section-header">
        <view class="title-box">
            <text class="title">{{ title }}</text>
        </view>
        <view class="more" v-if="showMore" @click="onMoreClick">
            <text>更多</text>
            <view class="arrow-right"></view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'SectionTitle',
    props: {
        title: {
            type: String,
            default: ''
        },
        showMore: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        onMoreClick() {
            this.$emit('more-click');
        }
    }
}
</script>

<style scoped lang="scss">
.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    padding: 0 10rpx;
    
    .title-box {
        display: flex;
        align-items: center;
        
        .title {
            font-size: 32rpx;
            font-weight: 400;
            color: #000000;
            font-family: 'PingFang SC';
            line-height: 44rpx;
            text-align: left;
        }
    }
    
    .more {
        font-size: 24rpx;
        color: #999999;
        display: flex;
        align-items: center;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        line-height: 34rpx;
        
        .arrow-right {
            width: 12rpx;
            height: 12rpx;
            border-top: 2rpx solid #999999;
            border-right: 2rpx solid #999999;
            transform: rotate(45deg);
            margin-left: 8rpx;
            margin-top: -2rpx;
        }
    }
}
</style>
