<template>
    <view class="icon-nav">
        <view class="nav-item" v-for="(item, index) in navItems" :key="index" @click="handleNavClick(item)">
            <image class="nav-icon" :src="item.icon" mode="aspectFit"></image>
            <text class="nav-text">{{ item.text }}</text>
        </view>
    </view>
</template>

<script>
export default {
    name: 'IconNav',
    data() {
        return {
            navItems: [
                {
                    text: '热门团购',
                    icon: '/static/images/index/modules/community_group.png',
                    url: '/pages/index/hot-group/index'
                },
                {
                    text: '租售信息',
                    icon: '/static/images/index/modules/rental_info.png',
                    url: '/pages/rent/index'
                },
                {
                    text: '居间服务',
                    icon: '/static/images/index/modules/intermediary_service.png',
                    url: '/pages/service/index'
                },
                {
                    text: '商业信息',
                    icon: '/static/images/index/modules/business_info.png',
                    url: '/pages/business/index'
                }
            ]
        };
    },
    methods: {
        handleNavClick(item) {
            uni.navigateTo({
                url: item.url
            });
        }
    }
}
</script>

<style scoped lang="scss">
.icon-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx 20rpx;
    background-color: #FFFFFF;
    border-radius: 16rpx;
    margin: 20rpx;
    
    .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 25%;
        
        .nav-icon {
            width: 80rpx;
            height: 80rpx;
            margin-bottom: 10rpx;
        }
        
        .nav-text {
            font-size: 24rpx;
            color: #333333;
            font-weight: 400;
        }
    }
}
</style>
