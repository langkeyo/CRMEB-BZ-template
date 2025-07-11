<template>
    <view class="category-grid-item" @click="onClick">
        <image :src="category.pic || defaultImage" mode="aspectFill"></image>
        <text>{{ $t(category.cate_name) }}</text>
    </view>
</template>

<script>
export default {
    name: 'CategoryGridItem',
    props: {
        category: {
            type: Object,
            required: true
        },
        defaultImage: {
            type: String,
            default: '/static/images/all_cat.png'
        }
    },
    methods: {
        onClick () {
            this.$emit('click', this.category)
        }
    }
}
</script>

<style lang="scss" scoped>
.category-grid-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20rpx;

    image {
        width: 120rpx;
        height: 120rpx;
        border-radius: 60rpx;
        margin-bottom: 10rpx;
    }

    text {
        font-size: 24rpx;
        color: #333;
        text-align: center;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>