<template>
    <view class="recommend-section">
        <SectionTitle title="精选推荐" :showMore="true" @more-click="onMoreClick" />
        <view class="recommend-list">
            <view class="recommend-item" v-for="(item, index) in recommendGoods" :key="index" @click="navigateToDetail(item)">
                <view class="item-container">
                    <image :src="item.image" class="product-img" mode="aspectFill"></image>
                    <view class="recommend-info">
                        <text class="recommend-name">{{item.name}}</text>
                        <view class="price-box">
                            <view class="price-info">
                                <text class="price-symbol">￥</text>
                                <text class="price">{{item.price}}</text>
                                <text class="price-label">秒杀价</text>
                            </view>
                            <text class="sold">已售{{item.sold}}单</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import SectionTitle from '@/components/SectionTitle/index.vue'

export default {
    name: 'RecommendSection',
    components: {
        SectionTitle
    },
    methods: {
        onMoreClick() {
            uni.navigateTo({
                url: '/pages/index/recommend-more',
                fail: () => {
                    uni.showToast({
                        title: '该功能正在开发中',
                        icon: 'none',
                        duration: 2000
                    });
                }
            });
        },
        
        navigateToDetail(item) {
            uni.navigateTo({
                url: `/pages/goods_details/index?id=${item.id || 1}`,
                fail: () => {
                    uni.showToast({
                        title: '商品详情正在开发中',
                        icon: 'none',
                        duration: 2000
                    });
                }
            });
        }
    },
    data() {
        return {
            recommendGoods: []
        }
    },
    created() {
        this.initRecommendGoods();
    },
    methods: {
        // 初始化推荐商品数据（模拟数据，以后替换为API调用）
        initRecommendGoods() {
            // 生成4个重复的商品卡片
            const mockProduct = {
                name: '某某某商品',
                price: '88',
                sold: '365',
                image: '/static/images/index/products/recommend_card_complete.png'
            };

            this.recommendGoods = Array.from({ length: 4 }, (_, index) => ({
                id: index + 1,
                ...mockProduct
            }));
        },

        onMoreClick() {
            uni.navigateTo({
                url: '/pages/index/recommend-more',
                fail: () => {
                    uni.showToast({
                        title: '该功能正在开发中',
                        icon: 'none',
                        duration: 2000
                    });
                }
            });
        },

        navigateToDetail(item) {
            uni.navigateTo({
                url: `/pages/goods_details/index?id=${item.id || 1}`,
                fail: () => {
                    uni.showToast({
                        title: '商品详情正在开发中',
                        icon: 'none',
                        duration: 2000
                    });
                }
            });
        }
    }
}
</script>

<style scoped lang="scss">
.recommend-section {
    margin-top: 30rpx;
    padding: 0 14rpx;
    
    // 使用SectionTitle组件替代
    
    .recommend-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 20rpx;

        .recommend-item {
            width: 340rpx;
            margin-bottom: 20rpx;
            border-radius: 12rpx;
            overflow: hidden;
            box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

            /* 瀑布流错开效果 */
            &:nth-child(even) {
                margin-top: 40rpx;  /* 偶数项向下偏移，创建错开效果 */
            }

            .item-container {
                width: 100%;
                border-radius: 12rpx;
                position: relative;
                display: flex;
                flex-direction: column;
                background-color: #FFFFFF;

                .product-img {
                    width: 100%;
                    height: 506rpx;
                    border-radius: 12rpx 12rpx 0 0;
                    object-fit: cover;
                }
            }
            
            .recommend-info {
                padding: 20rpx 16rpx;
                background-color: #FFFFFF;
                border-radius: 0 0 12rpx 12rpx;

                .recommend-name {
                    font-size: 32rpx;
                    color: #1A1A1A;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    margin-bottom: 14rpx;
                    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    font-weight: 400;
                    line-height: 1.4;
                }

                .price-box {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .price-info {
                        display: flex;
                        align-items: baseline;
                        gap: 4rpx;

                        .price-symbol {
                            font-size: 28rpx;
                            color: #333333;
                            font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                            font-weight: 400;
                            line-height: 1.4;
                        }

                        .price {
                            font-size: 28rpx;
                            color: #333333;
                            font-weight: 400;
                            font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                            line-height: 1.4;
                        }

                        .price-label {
                            font-size: 24rpx;
                            color: #333333;
                            font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                            font-weight: 400;
                            line-height: 1.4;
                            margin-left: 8rpx;
                        }
                    }

                    .sold {
                        font-size: 24rpx;
                        color: #B3B3B3;
                        font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        font-weight: 400;
                        line-height: 1.4;
                    }
                }
            }
        }
    }
}
</style>