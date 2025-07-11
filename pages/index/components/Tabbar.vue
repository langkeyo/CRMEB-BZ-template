<template>
    <view class="tabbar">
        <view 
            v-for="(item, index) in tabbarList" 
            :key="index" 
            class="tabbar-item" 
            :class="{ active: currentTab === index }"
            @click="switchTab(item.pagePath, index)"
        >
            <text class="iconfont" :class="item.iconName"></text>
            <text class="tabbar-text">{{ item.text }}</text>
        </view>
    </view>
</template>

<script>
export default {
    name: 'Tabbar',
    data() {
        return {
            currentTab: 0,
            tabbarList: [
                {
                    pagePath: '/pages/index/index',
                    iconName: 'icon-shouye1',
                    text: '首页'
                },
                {
                    pagePath: '/pages/goods_cate/goods_cate',
                    iconName: 'icon-caidan',
                    text: '分类'
                },
                {
                    pagePath: '/pages/order_addcart/order_addcart',
                    iconName: 'icon-gouwuche2',
                    text: '购物车'
                },
                {
                    pagePath: '/pages/user/index',
                    iconName: 'icon-yonghu1',
                    text: '我的'
                }
            ]
        }
    },
    methods: {
        switchTab(path, index) {
            if (this.currentTab === index) return;
            this.currentTab = index;
            uni.switchTab({
                url: path
            });
        }
    }
}
</script>

<style scoped lang="scss">
.tabbar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100rpx;
    background-color: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
    z-index: 100;
    
    .tabbar-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 10rpx 0;
        width: 25%;
        
        .iconfont {
            font-size: 44rpx;
            color: #999;
            margin-bottom: 4rpx;
        }
        
        .tabbar-text {
            font-size: 24rpx;
            color: #999;
        }
        
        &.active {
            .iconfont, .tabbar-text {
                color: #E93323;
            }
        }
    }
}
</style>