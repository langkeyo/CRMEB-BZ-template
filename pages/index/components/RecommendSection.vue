<template>
    <view class="recommend-section">
        <SectionTitle title="精选推荐" :showMore="false" />
        <view class="recommend-container">
            <!-- 左列 -->
            <view class="recommend-column left-column">
                <view class="recommend-item" v-for="(item, index) in leftColumnItems" :key="'left-'+index" @click="navigateToDetail(item)">
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
            
            <!-- 右列 -->
            <view class="recommend-column right-column">
                <view class="recommend-item" v-for="(item, index) in rightColumnItems" :key="'right-'+index" @click="navigateToDetail(item)">
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
    </view>
</template>

<script>
import SectionTitle from '@/components/SectionTitle/index.vue'
import {
    getRecommendCombinations,
    getGoodsList
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
            recommendGoods: [],
            leftColumnItems: [],
            rightColumnItems: []
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
                // 调用推荐商品API，使用getGoodsList并传递is_recommend=1参数
                const response = await getGoodsList({
                    is_recommend: '1',
                    limit: 4
                });

                if (response.status === 200 && response.data) {
                    // 转换API数据格式，处理正确的数据结构
                    const dataList = response.data.goodsList || [];
                    this.recommendGoods = dataList.map(item => ({
                        id: item.id,
                        name: item.title || item.store_name,
                        price: item.min_price || item.price || '0.00',
                        image: item.image,
                        sold: item.total_sales || item.sales || item.fake_sales || 0
                    }));
                    
                    // 分配数据到左右两列
                    this.distributeItemsToColumns();

                } else {
                    // API失败时使用默认数据
                    this.loadDefaultData();
                }
            } catch (error) {
                console.error('获取推荐商品失败:', error);
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
            
            // 分配数据到左右两列
            this.distributeItemsToColumns();
        },
        
        // 将数据分配到左右两列
        distributeItemsToColumns() {
            this.leftColumnItems = [];
            this.rightColumnItems = [];
            
            this.recommendGoods.forEach((item, index) => {
                if (index % 2 === 0) {
                    // 奇数项放左列
                    this.leftColumnItems.push(item);
                } else {
                    // 偶数项放右列
                    this.rightColumnItems.push(item);
                }
            });
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
    
    .recommend-container {
        display: flex;
        justify-content: space-between;
        margin-top: 20rpx;
        
        .recommend-column {
            width: 49%; // 两列各占49%宽度，中间留小间距
            
            .recommend-item {
                width: 100%;
                border-radius: 12rpx;
                overflow: hidden;
                box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
                margin-bottom: 10rpx;
                
                .item-container {
                    width: 100%;
                    border-radius: 12rpx;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    background-color: #FFFFFF;

                    .product-img {
                        width: 100%;
                        border-radius: 12rpx 12rpx 0 0;
                        object-fit: cover;
                    }
                }
            }
        }
        
        .left-column {
            .recommend-item {
                height: 620rpx; // 保持卡片总高度
                
                .product-img {
                    height: 490rpx; // 从520rpx减少到490rpx，给文字区域多留空间
                }
            }
        }
        
        .right-column {
            .recommend-item {
                height: 580rpx; // 保持卡片总高度
                
                .product-img {
                    height: 450rpx; // 从480rpx减少到450rpx，给文字区域多留空间
                }
            }
        }
    }
}

// 商品信息样式
.recommend-info {
    padding: 16rpx 14rpx;
    background-color: #FFFFFF;
    border-radius: 0 0 12rpx 12rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 120rpx; // 更合理的高度

    .recommend-name {
        font-size: 28rpx;
        color: #1A1A1A;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 14rpx; // 更合理的间距
        font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-weight: 550;
        line-height: 1.2;
    }

    .price-box {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .price-info {
            display: flex;
            align-items: baseline;
            gap: 2rpx; // 适当增加间距

            .price-symbol {
                font-size: 24rpx; // 增加字体大小
                color: #333333;
                font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                font-weight: 550;
                line-height: 1.2; // 适当增加行高
            }

            .price {
                font-size: 26rpx; // 增加字体大小
                color: #333333;
                font-weight: 550;
                font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                line-height: 1.2; // 适当增加行高
            }

            .price-label {
                font-size: 22rpx; // 增加字体大小
                color: #333333;
                font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                font-weight: 550;
                line-height: 1.2; // 适当增加行高
                margin-left: 8rpx; // 适当增加左边距
            }
        }

        .sold {
            font-size: 22rpx; // 增加字体大小
            color: #B3B3B3;
            font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-weight: 400;
            line-height: 1.2; // 适当增加行高
        }
    }
}
</style>