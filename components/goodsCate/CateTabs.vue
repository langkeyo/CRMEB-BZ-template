<template>
    <view class="cate-tabs">
        <view class="tab-item" v-for="(tab, idx) in tabs" :key="idx" :class="{ active: idx === activeIndex }"
            @click="$emit('change', idx)">
            {{ tab }}
        </view>
    </view>
</template>
<script>
export default {
    name: 'CateTabs',
    props: {
        tabs: {
            type: Array,
            default: () => []
        },
        activeIndex: {
            type: Number,
            default: 0
        }
    }
}
</script>
<style scoped>
.cate-tabs {
    display: flex;
    overflow-x: auto;
    /* 这里根据Figma设计图调整样式 */
}

.tab-item {
    padding: 0 16rpx;
    height: 56rpx;
    line-height: 56rpx;
    font-size: 28rpx;
    color: #666;
    border-radius: 8rpx;
    margin-right: 16rpx;
}

.tab-item.active {
    background: #f5f5f5;
    color: #ff9900;
}
</style>