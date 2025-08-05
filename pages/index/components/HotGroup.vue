<template>
    <view class="hot-group">
        <!-- 标题区域 -->
        <view class="title-section">
            <view class="left">
                <text class="title-text">热门团购</text>
            </view>
            <view class="right" @click="onMoreClick">
                <text class="more-text">更多</text>
                <image class="right-icon" src="/static/images/index/hot_group/right-icon.svg" mode="aspectFit"></image>
            </view>
        </view>

        <!-- 主容器 -->
        <view class="hot-group-container">
            <!-- 轮播背景图片 -->
            <view class="banner-section">
                <swiper
                    class="background-swiper"
                    :current="currentIndex"
                    :autoplay="true"
                    :interval="3000"
                    :duration="500"
                    @change="onSwiperChange"
                    :circular="true"
                    :vertical="false"
                    :touchable="true"
                    :disable-touch="false"
                >
                    <swiper-item v-for="(item, index) in groupProducts" :key="item.id">
                        <image :src="setDomain(item.image)" class="background-img" mode="aspectFill"></image>
                    </swiper-item>
                </swiper>
                
                <!-- 橙色标签 -->
                <view class="orange-tag">
                    <text class="tag-text">{{ currentTitle }}</text>
                </view>
                
                <!-- 进度指示器 -->
                <view class="progress-indicator">
                    <view class="progress-bg"></view>
                    <view class="progress-active" :style="{ left: progressLeft + 'rpx' }"></view>
                </view>
            </view>

            <!-- 商品列表容器 -->
            <view class="products-section">
                <view class="products-container">
                    <view class="product-item" v-for="(item, index) in currentProducts" :key="`product-${index}`" @click="navigateToDetail(item)">
                        <!-- 商品图片 -->
                        <view class="product-img-wrapper">
                            <image :src="setDomain(item.image)" class="product-img" mode="aspectFill"></image>
                        </view>
                        <!-- 商品信息 -->
                        <view class="product-info">
                            <text class="product-name">{{item.title}}</text>
                            <view class="price-container">
                                <text class="price-text">¥{{item.group_price}}</text>
                                <text class="original-price" v-if="item.original_price">原价¥{{item.original_price}}</text>
                            </view>
                            <view class="time-left" v-if="item.time_left_text">
                                <text class="time-left-text">剩余{{item.time_left_text}}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import SectionTitle from '@/components/SectionTitle/index.vue';
import { HTTP_REQUEST_URL } from '@/config/app.js';
import { getRecommendCombinations } from '@/api/group.js';

export default {
    name: 'HotGroup',
    components: {
        SectionTitle
    },
    data() {
        return {
            currentIndex: 0,
            groupProducts: [],
            loading: false,
            // 基础数据模板（用作备用）
            baseData: {
                title: '精品挑选食用油',
                backgroundImage: '/static/images/index/products/oil_banner.jpg',
                products: [
                    {
                        name: '美味鲜酱油',
                        price: '15',
                        image: '/static/common/placeholders/products/sauce_oil.png'
                    },
                    {
                        name: '薄盐生抽',
                        price: '17',
                        image: '/static/images/index/products/salt_oil.jpg'
                    },
                    {
                        name: '得尔乐橄榄油',
                        price: '20',
                        image: '/static/images/index/products/olive_oil.jpg'
                    }
                ]
            }
        }
    },
    computed: {
        // 轮播数量
        bannerCount() {
            return this.groupProducts.length > 0 ? this.groupProducts.length : 1;
        },
        currentProducts() {
            // 如果有API数据，则使用API数据，否则使用备用数据
            if (this.groupProducts.length > 0) {
                // 取前3个推荐商品
                return this.groupProducts.slice(0, 3);
            }
            return this.baseData.products;
        },
        currentTitle() {
            if (this.groupProducts.length > 0 && this.currentIndex < this.groupProducts.length) {
                const currentProduct = this.groupProducts[this.currentIndex];
                // 显示商品标题和状态，例如：榴莲 (进行中)
                return `${currentProduct.title} (${currentProduct.status_text || '热卖中'})`;
            }
            return this.baseData.title;
        },
        progressLeft() {
            // 适应新的进度条样式
            const totalWidth = 200; // 进度条总宽度 200rpx
            const indicatorWidth = 40; // 指示器宽度 40rpx

            if (this.bannerCount <= 1) return 0;

            // 每段进度条的宽度
            const stepWidth = (totalWidth - indicatorWidth) / (this.bannerCount - 1);

            // 当前位置 = 当前索引 * 每段宽度
            return this.currentIndex * stepWidth;
        }
    },
    created() {
        // 组件创建时加载数据
        this.loadRecommendProducts();
    },
    methods: {
        // 加载推荐团购商品
        async loadRecommendProducts() {
            if (this.loading) return;
            
            this.loading = true;
            try {
                const res = await getRecommendCombinations();
                if (res.status === 200 && res.data && res.data.length > 0) {
                    this.groupProducts = res.data.map(item => ({
                        ...item,
                        id: item.id || 0,
                        save_amount: item.save_price || '0.00' // 适配save_price字段
                    }));
                    console.log('获取推荐团购商品成功', this.groupProducts);
                } else {
                    console.log('获取推荐团购商品失败', res);
                    // 使用备用数据
                    this.useBackupData();
                }
            } catch (error) {
                console.error('获取推荐团购商品失败', error);
                // 使用备用数据
                this.useBackupData();
            } finally {
                this.loading = false;
            }
        },
        
        // 使用备用数据
        useBackupData() {
            this.groupProducts = [
                {
                    id: 1,
                    title: '精品挑选食用油',
                    image: '/static/images/index/products/oil_banner.jpg',
                    group_price: '15.00',
                    original_price: '20.00',
                    save_amount: '5.00'
                },
                {
                    id: 2,
                    title: '新鲜水果',
                    image: '/static/images/index/products/salt_oil.jpg',
                    group_price: '17.00',
                    original_price: '25.00',
                    save_amount: '8.00'
                },
                {
                    id: 3,
                    title: '有机蔬菜',
                    image: '/static/images/index/products/olive_oil.jpg',
                    group_price: '20.00',
                    original_price: '30.00',
                    save_amount: '10.00'
                }
            ];
        },
        
        onSwiperChange(e) {
            this.currentIndex = e.detail.current;
        },

        onMoreClick() {
            uni.navigateTo({
                url: '/pages/index/hot-group/index',
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
                url: `/pages/goods_details/index?id=${item.id || 1}&type=combination`,
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
        }
    }
}
</script>

<style scoped lang="scss">
.hot-group {
    margin: 40rpx 0;
    padding: 0 20rpx;
}

.title-section {
    position: relative;
    width: 710rpx; /* 355px * 2 */
    height: 50rpx; /* 25px * 2 */
    margin-bottom: 16rpx; /* 8px * 2 */
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.left {
    .title-text {
        font-family: 'PingFang SC', sans-serif;
        font-size: 32rpx; /* 16px * 2 */
        font-weight: 500;
        line-height: 44rpx; /* 22px * 2 */
        color: #000000;
        text-align: center;
    }
}

.right {
    display: flex;
    align-items: center;
    gap: 6rpx; /* 3px * 2 */

    .more-text {
        font-family: 'PingFang SC', sans-serif;
        font-size: 24rpx; /* 12px * 2 */
        font-weight: 400;
        line-height: 34rpx; /* 17px * 2 */
        color: #999999;
    }

    .right-icon {
        width: 10rpx; /* 5px * 2 */
        height: 18rpx; /* 9px * 2 */
    }
}

.hot-group-container {
    position: relative;
    width: 710rpx; /* 355px * 2 */
    height: 500rpx; /* 调整高度，适应手机屏幕 */
    border-radius: 12rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
}

.banner-section {
    position: relative;
    width: 100%;
    height: 300rpx; /* 轮播图区域高度 */
    overflow: hidden;
}

.background-swiper {
    width: 100%;
    height: 100%;
    z-index: 1;
}

.background-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.orange-tag {
    position: absolute;
    top: 0;
    left: 0;
    min-width: 200rpx;
    max-width: 360rpx;
    height: 56rpx; /* 28px * 2 */
    background: linear-gradient(90deg, #EF803D 0%, #EB6431 100%);
    border-radius: 12rpx 0 16rpx 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 4;
    padding: 0 20rpx;

    .tag-text {
        font-family: 'PingFang SC', sans-serif;
        font-size: 28rpx; /* 14px * 2 */
        font-weight: 500;
        color: #FFFFFF;
        text-align: center;
        line-height: 1.4;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}

.progress-indicator {
    position: absolute;
    bottom: 20rpx; /* 调整位置 */
    left: 50%;
    transform: translateX(-50%);
    width: 200rpx; /* 调整宽度 */
    height: 6rpx; /* 调整高度 */
    z-index: 4;
    pointer-events: none; /* 允许触摸事件穿透 */

    .progress-bg {
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.5);
        border-radius: 3rpx;
    }

    .progress-active {
        position: absolute;
        top: 0;
        width: 40rpx; /* 调整宽度 */
        height: 100%;
        background-color: #FFFFFF;
        border-radius: 3rpx;
        transition: left 0.3s ease;
    }
}

.products-section {
    flex: 1;
    width: 100%;
    background-color: #FFFFFF;
    position: relative;
    z-index: 5;
}

.products-container {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 20rpx 30rpx;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
}

.product-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 30%; /* 平均分配空间 */

    .product-img-wrapper {
        width: 80rpx; /* 调整大小 */
        height: 120rpx; /* 调整大小 */
        margin-bottom: 10rpx;

        .product-img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }

    .product-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;

        .product-name {
            font-family: 'PingFang SC', sans-serif;
            font-size: 24rpx; /* 12px * 2 */
            font-weight: 500;
            color: #333333;
            text-align: center;
            line-height: 1.4;
            margin-bottom: 6rpx;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .price-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            flex-wrap: wrap;

            .price-text {
                font-family: 'PingFang SC', sans-serif;
                font-size: 24rpx; /* 增大字体 */
                font-weight: 600;
                color: #FF5722;
                text-align: center;
                line-height: 1.4;
            }

            .original-price {
                font-family: 'PingFang SC', sans-serif;
                font-size: 20rpx; /* 增大字体 */
                font-weight: 400;
                color: #999999;
                text-decoration: line-through;
                margin-left: 10rpx; /* 5px * 2 */
            }
        }

        .time-left {
            margin-top: 6rpx;
            width: 100%;
            text-align: center;
            
            .time-left-text {
                font-family: 'PingFang SC', sans-serif;
                font-size: 20rpx; /* 增大字体 */
                font-weight: 500;
                color: #FF9800;
                text-align: center;
                line-height: 1.4;
                padding: 2rpx 8rpx;
                background-color: rgba(255, 152, 0, 0.1);
                border-radius: 10rpx;
            }
        }
    }
}
</style>