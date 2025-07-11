<template>
    <view class="hot-group-detail">
        <!-- 顶部图片和返回/分享按钮 -->
        <view class="top-image-box">
            <swiper class="swiper-box" :indicator-dots="productInfo.images && productInfo.images.length > 1" :autoplay="false" circular>
                <swiper-item v-for="(item, index) in productInfo.images || []" :key="index">
                    <image class="main-image" :src="item" mode="aspectFill" />
                </swiper-item>
                <swiper-item v-if="!productInfo.images || productInfo.images.length === 0">
                    <image class="main-image" src="/static/images/index/hot_group/detail/product_image.png" mode="aspectFill" />
                </swiper-item>
            </swiper>
            <view class="nav-btns">
                <image class="back-btn" src="/static/common/icons/navigation/back_arrow.svg" @click="goBack" />
                <image class="share-btn" src="/static/images/index/hot_group/detail/share_icon.svg" @click="shareProduct" />
            </view>
        </view>

        <!-- 商品信息区 -->
        <view class="info-section" v-if="productInfo.id">
            <view class="price-row">
                <text class="price-symbol">￥</text>
                <text class="price-main">{{ productInfo.group_price }}</text>
                <text class="price-range" v-if="productInfo.original_price">￥{{ productInfo.original_price }}</text>
            </view>
            <view class="product-title">{{ productInfo.title }}</view>
            <view class="tags-row">
                <view class="tag-item">{{ productInfo.people }}人团</view>
                <view class="tag-item" v-if="productInfo.effective_time">{{ productInfo.effective_time_text }}内成团</view>
            </view>
            <view class="sales-row">
                <text class="sales-info">已售{{ productInfo.sales || 0 }}+</text>
            </view>
            <view class="group-buyers-row" v-if="productInfo.sales">
                <text class="group-text">共{{ productInfo.sales }}人团购了此商品</text>
                <view class="avatars">
                    <image class="avatar" src="/static/images/index/hot_group/detail/user_avatar3.png" />
                    <image class="avatar" src="/static/images/index/hot_group/detail/user_avatar4.png" />
                    <image class="avatar" src="/static/images/index/hot_group/detail/user_avatar5.png" />
                </view>
            </view>
        </view>

        <!-- 活动规则 -->
        <view class="rule-section" v-if="productInfo.rule_desc">
            <view class="section-header">
                <text class="title">活动规则</text>
            </view>
            <view class="rule-content">
                <text class="rule-text">{{ productInfo.rule_desc }}</text>
            </view>
        </view>

        <!-- 商品描述 -->
        <view class="product-detail-section">
            <view class="section-header">
                <text class="title">产品介绍</text>
            </view>
            <view class="detail-content">
                <text class="detail-text">{{ productInfo.description || '暂无描述' }}</text>
            </view>
        </view>

        <!-- 推荐商品 -->
        <view class="recommend-section" v-if="recommendList.length > 0">
            <view class="section-header">
                <text class="title">推荐商品</text>
            </view>
            <scroll-view class="recommend-scroll" scroll-x>
                <view class="recommend-items">
                    <view class="recommend-item" v-for="(item, index) in recommendList" :key="index" @click="navigateToDetail(item)">
                        <image class="item-image" :src="item.image" mode="aspectFill" />
                        <view class="item-info">
                            <text class="item-title">{{ item.title }}</text>
                            <view class="item-price">
                                <text class="price-symbol">￥</text>
                                <text class="price-value">{{ item.group_price }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </scroll-view>
        </view>

        <!-- 底部操作栏 -->
        <view class="bottom-bar">
            <view class="bar-btns">
                <button class="action-btn buy-now-btn" @click="buyNow">立即购买</button>
                <button class="action-btn group-btn" @click="joinGroup">{{ productInfo.people }}人团购</button>
            </view>
        </view>

        <!-- 加载指示器 -->
        <view class="loading-container" v-if="isLoading">
            <view class="loading-spinner"></view>
        </view>
    </view>
</template>

<script>
import { getCombinationDetail, getCombinationRecommend } from '@/api/group.js';

export default {
    name: 'HotGroupDetail',
    data () {
        return {
            statusBarHeight: 20, // 默认状态栏高度
            productId: 0,
            productInfo: {},
            recommendList: [],
            isLoading: true
        }
    },
    onLoad (options) {
        // 获取状态栏高度
        const systemInfo = uni.getSystemInfoSync()
        this.statusBarHeight = systemInfo.statusBarHeight || 20

        // 获取商品ID，从服务器获取商品详情
        if (options.id) {
            this.productId = options.id
            this.loadProductDetail()
        } else {
            uni.showToast({
                title: '商品信息不存在',
                icon: 'none'
            })
            setTimeout(() => {
                uni.navigateBack()
            }, 1500)
        }
    },
    methods: {
        // 加载商品详情
        loadProductDetail() {
            this.isLoading = true
            
            getCombinationDetail(this.productId).then(res => {
                if (res.code === 200) {
                    this.productInfo = res.data || {}
                    
                    // 获取推荐商品
                    this.loadRecommendProducts()
                } else {
                    uni.showToast({
                        title: res.msg || '获取商品详情失败',
                        icon: 'none'
                    })
                }
            }).catch(err => {
                console.error('获取商品详情失败:', err)
                uni.showToast({
                    title: '网络错误，请稍后重试',
                    icon: 'none'
                })
            }).finally(() => {
                this.isLoading = false
            })
        },
        
        // 加载推荐商品
        loadRecommendProducts() {
            getCombinationRecommend().then(res => {
                if (res.code === 200) {
                    // 过滤掉当前商品
                    this.recommendList = (res.data || []).filter(item => item.id !== this.productId).slice(0, 6)
                }
            }).catch(err => {
                console.error('获取推荐商品失败:', err)
            })
        },
        
        goBack () {
            uni.navigateBack()
        },
        
        shareProduct () {
            uni.showToast({
                title: '分享功能开发中',
                icon: 'none',
                duration: 2000
            })
        },
        
        navigateToDetail(item) {
            uni.navigateTo({
                url: `/pages/index/hot-group/detail?id=${item.id}`
            })
        },
        
        buyNow() {
            if (!this.productInfo.id) return
            
            uni.showToast({
                title: '正在准备下单...',
                icon: 'loading',
                duration: 1000
            })
            
            setTimeout(() => {
                // 这里应该跳转到下单页面，传递必要的参数
                uni.navigateTo({
                    url: `/pages/order/submit_order?productId=${this.productId}&type=combination`
                })
            }, 1000)
        },
        
        joinGroup() {
            if (!this.productInfo.id) return
            
            uni.showToast({
                title: '正在准备开团...',
                icon: 'loading',
                duration: 1000
            })
            
            setTimeout(() => {
                // 这里应该跳转到开团页面，传递必要的参数
                uni.navigateTo({
                    url: `/pages/order/submit_group?productId=${this.productId}&people=${this.productInfo.people}`
                })
            }, 1000)
        }
    }
}
</script>

<style scoped lang="scss">
.hot-group-detail {
    background: #f7f7f7;
    min-height: 100vh;
    font-family: 'PingFang SC', Arial, sans-serif;
    padding-bottom: 100px;

    .top-image-box {
        position: relative;
        width: 100%;
        height: 375px;
        
        .swiper-box {
            width: 100%;
            height: 100%;
        }

        .main-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .nav-btns {
            position: absolute;
            top: 44px;
            left: 0;
            right: 0;
            display: flex;
            justify-content: space-between;
            padding: 0 15px;
            z-index: 10;

            .back-btn, .share-btn {
                width: 32px;
                height: 32px;
                background: rgba(0, 0, 0, 0.4);
                border-radius: 50%;
                padding: 8px;
                box-sizing: border-box;
            }
        }
    }

    .info-section {
        background: #fff;
        padding: 16px;
        margin-bottom: 10px;

        .price-row {
            margin-bottom: 10px;
            display: flex;
            align-items: baseline;

            .price-symbol {
                color: #FF5000;
                font-size: 16px;
            }

            .price-main {
                color: #FF5000;
                font-size: 24px;
                font-weight: bold;
            }

            .price-range {
                color: #999;
                font-size: 14px;
                margin-left: 10px;
                text-decoration: line-through;
            }
        }

        .product-title {
            font-size: 16px;
            color: #333;
            line-height: 1.4;
            margin-bottom: 12px;
            font-weight: bold;
        }

        .tags-row {
            display: flex;
            margin-bottom: 10px;
            
            .tag-item {
                background: rgba(255, 80, 0, 0.1);
                color: #FF5000;
                font-size: 12px;
                padding: 2px 6px;
                border-radius: 4px;
                margin-right: 8px;
            }
        }

        .sales-row {
            margin-bottom: 10px;

            .sales-info {
                font-size: 13px;
                color: #999;
            }
        }

        .group-buyers-row {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .group-text {
                font-size: 13px;
                color: #666;
            }

            .avatars {
                display: flex;

                .avatar {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    margin-left: -8px;
                    border: 1px solid #fff;
                    
                    &:first-child {
                        margin-left: 0;
                    }
                }
            }
        }
    }

    .rule-section, .product-detail-section, .recommend-section {
        background: #fff;
        padding: 16px;
        margin-bottom: 10px;

        .section-header {
            border-left: 3px solid #FF5000;
            padding-left: 8px;
            margin-bottom: 16px;

            .title {
                font-size: 16px;
                color: #333;
                font-weight: bold;
            }
        }

        .rule-content, .detail-content {
            .rule-text, .detail-text {
                font-size: 14px;
                color: #666;
                line-height: 1.6;
            }
        }
    }

    .recommend-section {
        .recommend-scroll {
            white-space: nowrap;
            
            .recommend-items {
                display: inline-flex;
                
                .recommend-item {
                    width: 120px;
                    margin-right: 10px;
                    
                    .item-image {
                        width: 120px;
                        height: 120px;
                        border-radius: 4px;
                    }
                    
                    .item-info {
                        padding: 6px 0;
                        
                        .item-title {
                            font-size: 13px;
                            color: #333;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            margin-bottom: 4px;
                            display: block;
                        }
                        
                        .item-price {
                            .price-symbol {
                                font-size: 12px;
                                color: #FF5000;
                            }
                            
                            .price-value {
                                font-size: 14px;
                                color: #FF5000;
                                font-weight: bold;
                            }
                        }
                    }
                }
            }
        }
    }

    .bottom-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: #fff;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
        z-index: 100;
        display: flex;
        align-items: center;
        padding: 0 15px;
        
        .bar-btns {
            flex: 1;
            display: flex;
            justify-content: space-between;
            
            .action-btn {
                width: 48%;
                height: 40px;
                border-radius: 20px;
                font-size: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
            }
            
            .buy-now-btn {
                background: rgba(255, 80, 0, 0.1);
                color: #FF5000;
                border: 1px solid #FF5000;
            }
            
            .group-btn {
                background: #FF5000;
                color: #fff;
            }
        }
    }

    .loading-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
        
        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255, 80, 0, 0.2);
            border-top-color: #FF5000;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
