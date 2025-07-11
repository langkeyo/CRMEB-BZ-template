<template>
    <view class="async-error">
        <view class="error-container">
            <image class="error-icon" src="/static/common/icons/error.png" mode="aspectFit"></image>
            <text class="error-title">加载失败</text>
            <text class="error-desc">页面加载出错，请重新尝试</text>
            <view class="retry-btn" @tap="handleRetry">重新加载</view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'AsyncError',
    methods: {
        handleRetry() {
            // 刷新当前页面
            const pages = getCurrentPages();
            const currentPage = pages[pages.length - 1];
            const route = currentPage.route;
            const options = currentPage.options || {};
            
            let url = '/' + route;
            const queryArr = [];
            
            for (const key in options) {
                queryArr.push(`${key}=${options[key]}`);
            }
            
            if (queryArr.length > 0) {
                url += '?' + queryArr.join('&');
            }
            
            // 重新加载当前页面
            uni.redirectTo({
                url
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.async-error {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100%;
    background-color: #fff;
    
    .error-container {
        text-align: center;
        padding: 0 30px;
        
        .error-icon {
            width: 80px;
            height: 80px;
            margin-bottom: 15px;
        }
        
        .error-title {
            font-size: 18px;
            color: #333;
            font-weight: 500;
            margin-bottom: 10px;
        }
        
        .error-desc {
            font-size: 14px;
            color: #999;
            margin-bottom: 25px;
        }
        
        .retry-btn {
            width: 200px;
            height: 44px;
            line-height: 44px;
            background-color: #FE8D00;
            color: #fff;
            font-size: 16px;
            border-radius: 22px;
            margin: 0 auto;
        }
    }
}
</style> 