<template>
    <view class="function-entry">
        <view class="function-item" @click="navigateTo('/pages/index/community-group/index')">
            <view class="icon-wrapper icon-community">
                <image src="/static/images/index/modules/community_group.png" class="function-icon"></image>
            </view>
            <text class="function-text">社区团购</text>
        </view>
        <view class="function-item" @click="navigateTo('/pages/index/house-rental/index')">
            <view class="icon-wrapper icon-rental">
                <image src="/static/images/index/modules/rental_info.png" class="function-icon"></image>
            </view>
            <text class="function-text">租售信息</text>
        </view>
        <view class="function-item" @click="navigateTo('/pages/intermediary_service/index')">
            <view class="icon-wrapper icon-agency">
                <image src="/static/images/index/modules/intermediary_service.png" class="function-icon"></image>
            </view>
            <text class="function-text">居间服务</text>
        </view>
        <view class="function-item" @click="navigateTo('/pages/index/business-info/index')">
            <view class="icon-wrapper icon-business">
                <image src="/static/images/index/modules/business_info.png" class="function-icon"></image>
            </view>
            <text class="function-text">商业信息</text>
        </view>
    </view>
</template>

<script>
export default {
    name: 'FunctionEntry',
    methods: {
        navigateTo (url) {
            // 检查页面是否存在，如果不存在则显示提示
            try {
                uni.navigateTo({
                    url: url,
                    fail: (err) => {
                        uni.showToast({
                            title: '该功能正在开发中',
                            icon: 'none',
                            duration: 2000
                        })
                        console.log('导航失败:', err)
                    }
                })
            } catch (e) {
                uni.showToast({
                    title: '该功能正在开发中',
                    icon: 'none',
                    duration: 2000
                })
                console.log('导航异常:', e)
            }
        }
    }
}
</script>

<style scoped lang="scss">
.function-entry {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0rpx;
    margin: 0;
    margin-top: 0;  /* 确保没有上边距 */
    background-color: #FFFFFF;

    .function-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 25%;
        padding: 0;

        .icon-wrapper {
            width: 132rpx;
            height: 90rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 20rpx;

            .function-icon {
                width: 96rpx;
                height: 90rpx;
                object-fit: contain;
            }
        }

        .function-text {
            font-size: 28rpx;
            color: #333333;
            font-weight: 400;
            text-align: center;
            font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'miui', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
            line-height: 40rpx;
        }
    }
}
</style>