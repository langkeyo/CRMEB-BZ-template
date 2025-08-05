<template>
    <view class="recommend-section">
        <SectionTitle title="精选推荐" :showMore="false" />
        <view class="recommend-list">
            <view class="recommend-item" v-for="(item, index) in recommendGoods" :key="index" @click="navigateToDetail(item)">
                <view class="item-container">
                    <image :src="setDomain(item.image)" class="product-img" mode="aspectFill"></image>
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
import {
    getRecommendCombinations
} from '@/api/group.js'
import {
    getProductHot
} from '@/api/store.js'
import { HTTP_REQUEST_URL } from '@/config/app.js'

export default {
    name: 'RecommendSection',
    components: {
        SectionTitle
    },
    data() {
        return {
            recommendGoods: []
        }
    },
    created() {
        // 先加载默认数据确保有内容显示
        this.loadDefaultData();
        // 然后尝试加载API数据
        this.initRecommendGoods();
    },
    methods: {
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
        },

        // 处理图片URL
        setDomain(url) {
            if (!url) return '';
            url = url.toString();

            // 如果是相对路径，拼接域名
            if (url.indexOf('/') === 0) {
                return HTTP_REQUEST_URL + url;
            }

            // 如果已经是完整URL，直接返回
            if (url.indexOf("http") === 0) {
                return url;
            }

            // 其他情况拼接域名
            return HTTP_REQUEST_URL + '/' + url;
        },
        // 初始化推荐商品数据
        async initRecommendGoods() {
            try {
                // 调用推荐商品API（普通商品，不是拼团商品）
                const response = await getProductHot(1, 4);

                if (response.status === 200 && response.data) {
                    // 转换API数据格式
                    const dataList = response.data.list || response.data;
                    this.recommendGoods = dataList.map(item => ({
                        id: item.id,
                        name: item.title || item.store_name,
                        price: item.price || item.min_price,
                        image: item.image,
                        sold: item.sales || item.fake_sales || 0
                    }));

                } else {
                    // API失败时使用默认数据
                    this.loadDefaultData();
                }
            } catch (error) {
                // API失败时使用默认数据
                this.loadDefaultData();
            }
        },

        // 加载默认数据（API失败时的备用方案）
        loadDefaultData() {
            const mockProduct = {
                name: '精选商品',
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
        }
    }
}
</script>

<style scoped lang="scss">
.recommend-section {
    margin-top: 30rpx;
    padding: 0 20rpx;
    
    // 使用SectionTitle组件替代
    
    .recommend-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 20rpx;

        .recommend-item {
            width: 350rpx;
            margin-bottom: 20rpx;
            border-radius: 12rpx;
            overflow: hidden;
            box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

            /* 瀑布流错开效果 - 使用flex控制高度 */
            &:nth-child(odd) {
                height: 680rpx;  /* 奇数项总高度增加，让价格区域对齐到底部 */
            }

            &:nth-child(even) {
                margin-top: 40rpx;  /* 偶数项向下偏移，创建错开效果 */
                height: 640rpx;  /* 偶数项总高度 */
            }

            .item-container {
                width: 100%;
                height: 100%;  /* 占满父容器 */
                border-radius: 12rpx;
                position: relative;
                display: flex;
                flex-direction: column;
                background-color: #FFFFFF;

                .product-img {
                    width: 100%;
                    flex: 1;  /* 使用flex自动填充剩余空间 */
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