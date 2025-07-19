<template>
    <view class="module-entry">
        <view class="module-row">
            <view class="module-item" @click="navigateTo('/pages/index/today-group-buying/index')">
                <image src="/static/images/index/modules/today_group.png" class="module-img"></image>
                <view class="module-overlay"></view>
                <view class="module-label">
                    <view class="tag-content">
                        <text class="tag-text">今日开团</text>
                        <image class="arrow-icon" src="/static/common/icons/navigation/arrow_right.svg" mode="aspectFit"></image>
                    </view>
                </view>
            </view>
            <view class="module-item" @click="navigateTo('/pages/index/join/index')">
                <image src="/static/images/index/modules/join_group.png" class="module-img"></image>
                <view class="module-overlay"></view>
                <view class="module-label">
                    <view class="tag-content">
                        <text class="tag-text">我要加入</text>
                        <image class="arrow-icon" src="/static/common/icons/navigation/arrow_right.svg" mode="aspectFit"></image>
                    </view>
                </view>
            </view>
        </view>
        <view class="module-row">
            <view class="module-item" @click="navigateTo('/pages/index/product-provide/join-process/index')">
                <image src="/static/images/index/modules/product_supply.png" class="module-img"></image>
                <view class="module-overlay"></view>
                <view class="module-label">
                    <view class="tag-content">
                        <text class="tag-text">提供产品</text>
                        <image class="arrow-icon" src="/static/common/icons/navigation/arrow_right.svg" mode="aspectFit"></image>
                    </view>
                </view>
            </view>
            <view class="module-item" @click="navigateTo('/pages/users/online_chat/index')">
                <image src="/static/images/index/modules/online_consult.png" class="module-img"></image>
                <view class="module-overlay"></view>
                <view class="module-label">
                    <view class="tag-content">
                        <text class="tag-text">在线咨询</text>
                        <image class="arrow-icon" src="/static/common/icons/navigation/arrow_right.svg" mode="aspectFit"></image>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'ModuleEntry',
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
.module-entry {
    display: flex;
    flex-direction: column;
    margin: 20rpx 14rpx 0;
    box-sizing: border-box;

    .module-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20rpx;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .module-item {
        width: 350rpx;
        height: 180rpx;
        border-radius: 8rpx;
        overflow: hidden;
        position: relative;

        .module-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .module-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, rgba(102, 102, 102, 0) 0%, rgba(0, 0, 0, 0.4) 58.17%);
        }

        .module-label {
            position: absolute;
            top: 0;
            right: 0;
            border-radius: 0 8rpx 0 8rpx;
            padding: 6rpx 24rpx;

            .tag-content {
                display: flex;
                align-items: center;
                position: relative;
                z-index: 10;  /* 确保内容在同一层级 */

                .tag-text {
                    color: #FCFCFC;
                    font-size: 24rpx;
                    font-family: 'PingFang SC', sans-serif;
                    font-weight: 400;
                    line-height: 34rpx;
                    position: relative;
                    z-index: 11;  /* 确保文字在正确层级 */
                }

                .arrow-icon {
                    width: 10rpx;
                    height: 18rpx;
                    margin-left: 8rpx;
                    position: relative;
                    z-index: 11;  /* 确保箭头图标在正确层级 */
                    flex-shrink: 0;  /* 防止图标被压缩 */
                    filter: brightness(5);
                    transform: translate(6rpx);
                }
            }
        }
    }
}
</style>