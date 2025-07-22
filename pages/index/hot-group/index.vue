<template>
    <view class="hot-group-more">
        <!-- 使用通用头部导航组件 -->
        <CommonHeader title="热门团购" @back="goBack"></CommonHeader>

        <!-- 搜索框 -->
        <view class="search-container">
            <view class="search-box">
                <view class="search-input" @click="focusSearch">
                    <text class="search-icon"></text>
                    <input v-if="isSearchFocused" v-model="keyword" class="search-input-field"
                           placeholder="搜索想要商品关键词" @confirm="searchProducts" @blur="blurSearch" />
                    <text v-else class="search-placeholder">搜索想要商品关键词</text>
                </view>
            </view>
        </view>

        <!-- 商品列表 -->
        <view class="goods-list">
            <view class="goods-item" v-for="(item, index) in goodsList" :key="index" @click="navigateToDetail(item)">
                <view class="item-container" :style="{ backgroundImage: 'url(' + item.image + ')' }">
                </view>
                <view class="goods-info">
                    <text class="goods-name">{{ item.title }}</text>
                    <view class="price-box">
                        <view class="price-info">
                            <text class="price-symbol">¥</text>
                            <text class="price">{{ item.group_price }}</text>
                            <text v-if="item.original_price" class="original-price">¥{{ item.original_price }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        
        <!-- 加载中/无更多数据 -->
        <view class="loading-more" v-if="loadingStatus !== 0">
            <text v-if="loadingStatus === 1">加载中...</text>
            <text v-else-if="loadingStatus === 2">已经到底了~</text>
        </view>
    </view>
</template>

<script>
import { getCombinationList } from '@/api/group.js';
import CommonHeader from '@/components/CommonHeader/index.vue';

export default {
    components: {
        CommonHeader
    },
    name: 'HotGroupMore',
    data () {
        return {
            goodsList: [],
            keyword: '',
            isSearchFocused: false,
            page: 1,
            limit: 10,
            loadingStatus: 0, // 0: 不显示, 1: 加载中, 2: 已全部加载
            isLoading: false,
            hasMore: true
        }
    },
    onLoad () {
        // 加载商品数据
        this.loadProducts()
    },
    onReachBottom() {
        if (this.hasMore && !this.isLoading) {
            this.loadMoreProducts()
        }
    },
    methods: {
        // 加载商品列表
        loadProducts() {
            this.isLoading = true
            this.loadingStatus = 1
            
            getCombinationList({
                page: this.page,
                limit: this.limit,
                keyword: this.keyword
            }).then(res => {
                if (res.code === 200) {
                    this.goodsList = res.data.list || []
                    
                    // 判断是否有更多数据
                    this.hasMore = this.goodsList.length >= this.limit
                    this.loadingStatus = this.hasMore ? 0 : 2
                } else {
                    uni.showToast({
                        title: res.msg || '获取商品失败',
                        icon: 'none'
                    })
                }
            }).catch(err => {
                console.error('获取商品列表失败:', err)
                uni.showToast({
                    title: '网络错误，请稍后重试',
                    icon: 'none'
                })
            }).finally(() => {
                this.isLoading = false
            })
        },
        
        // 加载更多商品
        loadMoreProducts() {
            if (!this.hasMore || this.isLoading) return
            
            this.page++
            this.isLoading = true
            this.loadingStatus = 1
            
            getCombinationList({
                page: this.page,
                limit: this.limit,
                keyword: this.keyword
            }).then(res => {
                if (res.code === 200) {
                    const newList = res.data.list || []
                    
                    // 判断是否有更多数据
                    this.hasMore = newList.length >= this.limit
                    this.loadingStatus = this.hasMore ? 0 : 2
                    
                    // 将新数据添加到列表
                    if (newList.length > 0) {
                        this.goodsList = [...this.goodsList, ...newList]
                    }
                } else {
                    uni.showToast({
                        title: res.msg || '获取更多商品失败',
                        icon: 'none'
                    })
                }
            }).catch(err => {
                console.error('加载更多商品失败:', err)
                uni.showToast({
                    title: '网络错误，请稍后重试',
                    icon: 'none'
                })
            }).finally(() => {
                this.isLoading = false
            })
        },
        
        // 搜索商品
        searchProducts() {
            this.page = 1
            this.goodsList = []
            this.hasMore = true
            this.loadProducts()
            this.blurSearch()
        },
        
        // 聚焦搜索框
        focusSearch() {
            this.isSearchFocused = true
        },
        
        // 失去焦点
        blurSearch() {
            if (!this.keyword) {
                this.isSearchFocused = false
            }
        },
        
        goBack() {
            uni.navigateBack()
        },
        
        navigateToDetail(item) {
            // 跳转到商品详情页面
            uni.navigateTo({
                url: `/pages/index/hot-group/detail?id=${item.id}`
            })
        }
    }
}
</script>

<style scoped lang="scss">
.hot-group-more {
    min-height: 100vh;
    background-color: #F8F8F8;

    .search-container {
        position: sticky;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 138px;
        background-color: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        z-index: 100;
        box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
        position: relative;

        .back-btn {
            position: absolute;
            left: 13px;
            top: 52px;
            height: 25px;
            display: flex;
            align-items: center;

            .back-icon {
                width: 7px;
                height: 13px;
                background-image: url("/static/images/index/hot_group/back-icon.svg");
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                margin-right: 8px;
            }

            .back-text {
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 18px;
                line-height: 25px;
                color: #333333;
            }
        }

        .title {
            position: absolute;
            width: 72px;
            height: 25px;
            left: 50%;
            top: 52px;
            transform: translateX(-50%);
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 18px;
            line-height: 25px;
            color: #1A1A1A;
        }
    }

    .search-box {
        position: absolute;
        left: 50%;
        top: 92px;
        width: 351px;
        transform: translateX(-50%);
        
        .search-input {
            display: flex;
            align-items: center;
            background-color: #F5F5F5;
            border-radius: 8px;
            height: 32px;
            padding: 0 12px;
            
            .search-icon {
                width: 16px;
                height: 16px;
                background-image: url("/static/images/index/hot_group/search-icon.svg");
                background-size: contain;
                background-repeat: no-repeat;
                margin-right: 8px;
            }
            
            .search-placeholder, .search-input-field {
                font-size: 14px;
                color: #999999;
            }
            
            .search-input-field {
                flex: 1;
                color: #333333;
                height: 100%;
            }
        }
    }
    
    .goods-list {
        display: flex;
        flex-wrap: wrap;
        padding: 12px;
        padding-top: 138px;
        
        .goods-item {
            width: 48%;
            margin: 1%;
            margin-bottom: 15px;
            background-color: #FFFFFF;
            border-radius: 8px;
            overflow: hidden;
            
            .item-container {
                width: 100%;
                height: 0;
                padding-bottom: 100%;
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
            }
            
            .goods-info {
                padding: 8px;
                
                .goods-name {
                    font-size: 14px;
                    color: #333333;
                    line-height: 20px;
                    height: 40px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
                
                .price-box {
                    margin-top: 8px;
                    
                    .price-info {
                        display: flex;
                        align-items: baseline;
                        
                        .price-symbol {
                            font-size: 12px;
                            color: #FF5000;
                        }
                        
                        .price {
                            font-size: 16px;
                            color: #FF5000;
                            font-weight: bold;
                        }
                        
                        .original-price {
                            font-size: 12px;
                            color: #999999;
                            text-decoration: line-through;
                            margin-left: 8px;
                        }
                    }
                }
            }
        }
    }
    
    .loading-more {
        text-align: center;
        padding: 16px 0;
        color: #999999;
        font-size: 14px;
    }
}
</style>
