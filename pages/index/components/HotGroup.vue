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
                <swiper-item v-for="(item, index) in bannerList" :key="item.id">
                    <image :src="item.backgroundImage" class="background-img" mode="aspectFill"></image>
                </swiper-item>
            </swiper>

            <!-- 模糊遮罩层 -->
            <view class="blur-overlay"></view>

            <!-- 渐变遮罩层 -->
            <view class="gradient-overlay"></view>

            <!-- 橙色标签 -->
            <view class="orange-tag">
                <text class="tag-text">{{ currentTitle }}</text>
            </view>

            <!-- 商品列表容器 -->
            <view class="products-container">
                <view class="product-item" v-for="(item, index) in currentProducts" :key="`product-${index}`" @click="navigateToDetail(item)">
                    <!-- 商品图片 -->
                    <view class="product-img-wrapper">
                        <image :src="setDomain(item.image)" class="product-img" mode="aspectFill"></image>
                    </view>
                    <!-- 商品信息 -->
                    <view class="product-info">
                        <text class="product-name">{{item.name}}</text>
                        <view class="price-container">
                            <text class="price-text">团购价{{item.price}}元起</text>
                            <image class="price-arrow" src="/static/images/index/icons/price_arrow_right.svg" mode="aspectFit"></image>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 进度指示器 -->
            <view class="progress-indicator">
                <view class="progress-bg"></view>
                <view class="progress-active" :style="{ left: progressLeft + 'rpx' }"></view>
            </view>
        </view>
    </view>
</template>

<script>
import SectionTitle from '@/components/SectionTitle/index.vue';
import { HTTP_REQUEST_URL } from '@/config/app.js';

export default {
    name: 'HotGroup',
    components: {
        SectionTitle
    },
    data() {
        return {
            currentIndex: 0,
            // 基础数据模板
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
            },
            // 轮播数量
            bannerCount: 3
        }
    },
    computed: {
        // 生成轮播数据列表（循环使用基础数据）
        bannerList() {
            return Array.from({ length: this.bannerCount }, (_, index) => ({
                ...this.baseData,
                id: index
            }));
        },
        currentProducts() {
            return this.baseData.products;
        },
        currentTitle() {
            return this.baseData.title;
        },
        progressLeft() {
            // 简单的一一对应：1个轮播页面 = 1段进度条宽度
            const totalWidth = 390; // 进度条总宽度 390rpx
            const indicatorWidth = 38; // 指示器宽度 38rpx

            if (this.bannerCount <= 1) return 0;

            // 每段进度条的宽度
            const stepWidth = (totalWidth - indicatorWidth) / (this.bannerCount - 1);

            // 当前位置 = 当前索引 * 每段宽度
            return this.currentIndex * stepWidth;
        }
    },
    methods: {
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
        }
    }
}
</script>

<style scoped lang="scss">
.hot-group {
    margin: 40rpx 0;
    padding: 0 30rpx;
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
        font-weight: 400;
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
    width: 712rpx; /* 356px * 2 */
    height: 572rpx; /* 286px * 2 */
    border-radius: 8rpx;
    overflow: hidden;
}

.background-swiper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.background-img {
    width: 100%;
    height: 100%;
}

.blur-overlay {
    position: absolute;
    top: 308rpx; /* 154px * 2 */
    left: 8rpx; /* 4px * 2 */
    width: 696rpx; /* 348px * 2 */
    height: 256rpx; /* 128px * 2 */
    background: radial-gradient(ellipse at 51.69% -87.88%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.4) 100%);
    backdrop-filter: blur(132.6rpx); /* 66.3px * 2 */
    border-radius: 8rpx;
    z-index: 2;
    pointer-events: none; /* 允许触摸事件穿透 */
}

.gradient-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    z-index: 3;
    pointer-events: none; /* 允许触摸事件穿透 */
}

.orange-tag {
    position: absolute;
    top: 0;
    left: 0;
    width: 244rpx; /* 122px * 2 */
    height: 56rpx; /* 28px * 2 */
    background: linear-gradient(90deg, #EF803D 0%, #EB6431 100%);
    border-radius: 8rpx 0 16rpx 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 4;

    .tag-text {
        font-family: 'PingFang SC', sans-serif;
        font-size: 28rpx; /* 14px * 2 */
        font-weight: 400;
        color: #FFFFFF;
        text-align: center;
        line-height: 1.4;
    }
}

.products-container {
    position: absolute;
    bottom: 32rpx; /* 16px * 2 */
    left: 72rpx; /* 36px * 2 */
    display: flex;
    align-items: flex-end;
    gap: 70rpx; /* 35px * 2 */
    z-index: 5;
}

.product-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    // width: 142rpx; /* 71px * 2 */

    .product-img-wrapper {
        width: 66rpx; /* 33px * 2 */
        height: 146rpx; /* 73px * 2 */
        margin-bottom: 4rpx;

        .product-img {
            width: 100%;
            height: 100%;
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
            font-weight: 400;
            color: #333333;
            text-align: center;
            line-height: 1.4;
            margin-bottom: 8rpx;
        }

        .price-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;

            .price-text {
                font-family: 'PingFang SC', sans-serif;
                font-size: 20rpx; /* 10px * 2 */
                font-weight: 400;
                color: #FFFFFF;
                text-align: center;
                line-height: 1.4;
            }

            .price-arrow {
                width: 8rpx; /* 4px * 2 */
                height: 16rpx; /* 8px * 2 */
                margin-left: 10rpx; /* 5px * 2 */
            }
        }
    }
}

.progress-indicator {
    position: absolute;
    top: 288rpx; /* 144px * 2 */
    left: 162rpx; /* 81px * 2 */
    width: 390rpx; /* 195px * 2 */
    height: 8rpx; /* 4px * 2 */
    z-index: 4;
    pointer-events: none; /* 允许触摸事件穿透 */

    .progress-bg {
        width: 100%;
        height: 100%;
        background-color: rgba(242, 242, 242, 0.2);
        border-radius: 2rpx; /* 1px * 2 */
    }

    .progress-active {
        position: absolute;
        top: 0;
        width: 38rpx; /* 19px * 2 */
        height: 100%;
        background-color: #FFFFFF;
        border-radius: 2rpx; /* 1px * 2 */
        transition: left 0.3s ease;
    }
}
</style>