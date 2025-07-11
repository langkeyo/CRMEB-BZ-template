<template>
    <view class="category-page">
        <!-- 顶部搜索栏 -->
        <view class="search-bar">
            <view class="search-input flex-center">
                <text class="iconfont icon-sousuo"></text>
                <input type="text" placeholder="搜索商品名称" class="input" />
            </view>
        </view>
        <view class="main-content">
            <!-- 左侧分类列表 -->
            <view class="category-list">
                <scroll-view scroll-y style="height: 100%;">
                    <view class="category-item" v-for="(item, idx) in categoryList" :key="idx"
                        :class="{ active: idx === activeIndex }" @click="onCategoryClick(idx)">
                        <text>{{ item }}</text>
                    </view>
                </scroll-view>
            </view>
            <!-- 右侧内容区 -->
            <view class="content-area">
                <!-- 这里后续插入GoodsCateRightPanel等组件 -->
                <slot></slot>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    name: 'GoodsCategory',
    data () {
        return {
            categoryList: ['热门分类', '水果', '蔬菜', '禽畜肉类', '中药材', '油粮作物', '海鲜', '休闲零食', '粮食谷物', '经济作物', '干果坚果', '茶叶'],
            activeIndex: 0
        }
    },
    methods: {
        onCategoryClick (idx) {
            this.activeIndex = idx
        }
    }
}
</script>
<style scoped>
.category-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #f5f5f5;
}

.search-bar {
    padding: 20rpx 30rpx;
    background: #fff;
}

.search-input {
    height: 70rpx;
    background: #f5f5f5;
    border-radius: 35rpx;
    padding: 0 30rpx;
    display: flex;
    align-items: center;
}

.input {
    flex: 1;
    height: 100%;
    font-size: 28rpx;
    border: none;
    background: transparent;
}

.main-content {
    flex: 1;
    display: flex;
    overflow: hidden;
}

.category-list {
    width: 180rpx;
    height: 100%;
    background: #f7f7f7;
}

.category-item {
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: #333;
    position: relative;
}

.category-item.active {
    background: #fff;
    color: #ff9900;
    font-weight: bold;
}

.content-area {
    flex: 1;
    background: #fff;
    padding: 20rpx;
}

.flex-center {
    display: flex;
    align-items: center;
}
</style>