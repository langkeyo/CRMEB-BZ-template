<template>
    <view class="convenient-service-page">
        <!-- 导航栏 -->
        <view class="nav-bar">
            <view class="nav-left" @click="goBack">
                <image class="back-icon" src="/static/icons/back-arrow.svg" mode="aspectFit"></image>
                <text class="back-text">返回</text>
            </view>
            <text class="nav-title">便民服务</text>
            <view class="nav-right"></view>
        </view>
        
        <!-- 搜索栏 -->
        <view class="search-section">
            <view class="search-box">
                <image class="search-icon" src="/static/icons/search.png" mode="aspectFit"></image>
                <input class="search-input" 
                       placeholder="搜索服务" 
                       v-model="searchKeyword"
                       @confirm="searchServices" />
            </view>
        </view>
        
        <!-- 服务列表 -->
        <scroll-view scroll-y class="service-list" @scrolltolower="loadMore">
            <view class="service-item" 
                  v-for="service in serviceList" 
                  :key="service.id"
                  @click="viewServiceDetail(service)">
                <view class="service-image">
                    <image :src="setDomain(service.image)" mode="aspectFill"></image>
                </view>
                <view class="service-info">
                    <text class="service-title">{{ service.title }}</text>
                    <view class="service-meta">
                        <view class="service-rating">
                            <text class="rating-text">{{ service.star }}分</text>
                            <view class="stars">
                                <text class="star" 
                                      v-for="n in 5" 
                                      :key="n"
                                      :class="{ 'active': n <= Math.floor(service.star) }">★</text>
                            </view>
                        </view>
                        <text class="service-time">{{ service.service_time }}</text>
                    </view>
                    <view class="service-tags" v-if="service.tags">
                        <text class="tag" v-for="tag in service.tags.split(',')" :key="tag">{{ tag }}</text>
                    </view>
                </view>
            </view>
            
            <!-- 加载状态 -->
            <view class="loading-more" v-if="loading">
                <text class="loading-text">加载中...</text>
            </view>
            
            <!-- 没有更多 -->
            <view class="no-more" v-if="!loading && loadEnd">
                <text class="no-more-text">没有更多了</text>
            </view>
            
            <!-- 空状态 -->
            <view class="empty-state" v-if="!loading && serviceList.length === 0">
                <image class="empty-icon" src="/static/images/empty.png" mode="aspectFit"></image>
                <text class="empty-text">暂无便民服务</text>
            </view>
        </scroll-view>
    </view>
</template>

<script>
import {
    getConvenientServiceList
} from '@/api/group.js'
import { HTTP_REQUEST_URL } from '@/config/app.js'

export default {
    name: 'ConvenientServiceList',
    data() {
        return {
            searchKeyword: '',
            serviceList: [],
            loading: false,
            loadEnd: false,
            page: 1,
            limit: 10
        }
    },
    onLoad() {
        this.loadServiceList();
    },
    methods: {
        // 加载服务列表
        async loadServiceList(isRefresh = false) {
            if (this.loading) return;
            
            if (isRefresh) {
                this.page = 1;
                this.loadEnd = false;
                this.serviceList = [];
            }
            
            this.loading = true;
            try {
                const response = await getConvenientServiceList({
                    page: this.page,
                    limit: this.limit,
                    keyword: this.searchKeyword
                });
                
                if (response.status === 200 && response.data) {
                    const newList = response.data.list || [];
                    
                    if (isRefresh) {
                        this.serviceList = newList;
                    } else {
                        this.serviceList = [...this.serviceList, ...newList];
                    }
                    
                    // 判断是否还有更多数据
                    if (newList.length < this.limit) {
                        this.loadEnd = true;
                    } else {
                        this.page++;
                    }
                    
                    console.log('便民服务列表加载成功:', this.serviceList);
                } else {
                    uni.showToast({
                        title: '加载失败',
                        icon: 'none'
                    });
                }
            } catch (error) {
                console.error('加载便民服务列表失败:', error);
                uni.showToast({
                    title: '网络错误',
                    icon: 'none'
                });
            } finally {
                this.loading = false;
            }
        },
        
        // 搜索服务
        searchServices() {
            this.loadServiceList(true);
        },
        
        // 加载更多
        loadMore() {
            if (!this.loadEnd && !this.loading) {
                this.loadServiceList();
            }
        },
        
        // 查看服务详情
        viewServiceDetail(service) {
            uni.navigateTo({
                url: `/pages/convenient-service/detail/index?id=${service.id}`
            });
        },
        
        // 返回
        goBack() {
            uni.navigateBack();
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

<style lang="scss" scoped>
.convenient-service-page {
    min-height: 100vh;
    background: #F5F5F5;
    
    .nav-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 44px;
        padding: 0 16px;
        background: #FFFFFF;
        border-bottom: 1px solid #E5E5E5;
        
        .nav-left {
            display: flex;
            align-items: center;
            
            .back-icon {
                width: 20px;
                height: 20px;
                margin-right: 4px;
            }
            
            .back-text {
                font-size: 16px;
                color: #007AFF;
            }
        }
        
        .nav-title {
            font-size: 17px;
            font-weight: 600;
            color: #000000;
        }
        
        .nav-right {
            width: 60px;
        }
    }
    
    .search-section {
        padding: 12px 16px;
        background: #FFFFFF;
        
        .search-box {
            display: flex;
            align-items: center;
            height: 36px;
            padding: 0 12px;
            background: #F7F7F7;
            border-radius: 18px;
            
            .search-icon {
                width: 16px;
                height: 16px;
                margin-right: 8px;
            }
            
            .search-input {
                flex: 1;
                font-size: 14px;
                color: #333333;
            }
        }
    }
    
    .service-list {
        flex: 1;
        padding: 0 16px;
        
        .service-item {
            display: flex;
            padding: 16px;
            margin-bottom: 12px;
            background: #FFFFFF;
            border-radius: 8px;
            
            .service-image {
                width: 80px;
                height: 80px;
                margin-right: 12px;
                border-radius: 6px;
                overflow: hidden;
                
                image {
                    width: 100%;
                    height: 100%;
                }
            }
            
            .service-info {
                flex: 1;
                
                .service-title {
                    display: block;
                    font-size: 16px;
                    font-weight: 500;
                    color: #333333;
                    margin-bottom: 8px;
                }
                
                .service-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                    
                    .service-rating {
                        display: flex;
                        align-items: center;
                        
                        .rating-text {
                            font-size: 12px;
                            color: #FF6B35;
                            margin-right: 4px;
                        }
                        
                        .stars {
                            display: flex;
                            
                            .star {
                                font-size: 12px;
                                color: #E0E0E0;
                                
                                &.active {
                                    color: #FF6B35;
                                }
                            }
                        }
                    }
                    
                    .service-time {
                        font-size: 12px;
                        color: #999999;
                    }
                }
                
                .service-tags {
                    display: flex;
                    flex-wrap: wrap;
                    
                    .tag {
                        padding: 2px 6px;
                        margin-right: 6px;
                        margin-bottom: 4px;
                        font-size: 10px;
                        color: #666666;
                        background: #F0F0F0;
                        border-radius: 2px;
                    }
                }
            }
        }
        
        .loading-more, .no-more {
            text-align: center;
            padding: 20px;
            
            .loading-text, .no-more-text {
                font-size: 14px;
                color: #999999;
            }
        }
        
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            
            .empty-icon {
                width: 80px;
                height: 80px;
                margin-bottom: 16px;
            }
            
            .empty-text {
                font-size: 14px;
                color: #999999;
            }
        }
    }
}
</style>
