<template>
    <view class="async-loading">
        <view class="loading-container">
            <image class="loading-icon" src="/static/common/loading.gif" mode="aspectFit"></image>
            <text class="loading-text">页面加载中...</text>
        </view>
    </view>
</template>

<script>
export default {
    name: 'AsyncLoading',
}
</script>

<style lang="scss" scoped>
.async-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100%;
    background-color: #fff;
    
    .loading-container {
        text-align: center;
        
        .loading-icon {
            width: 40px;
            height: 40px;
            margin-bottom: 10px;
        }
        
        .loading-text {
            font-size: 14px;
            color: #666;
        }
    }
}
</style> 