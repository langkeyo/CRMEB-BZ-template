<template>
    <view class="community-selector-modal" v-if="visible" @click="handleMaskClick">
        <view class="modal-content" @click.stop>
            <!-- 标题栏 -->
            <view class="modal-header">
                <text class="modal-title">选择社区</text>
                <view class="close-btn" @click="closeModal">
                    <text class="close-icon">×</text>
                </view>
            </view>
            
            <!-- 内容区域 -->
            <view class="modal-body">
                <text class="subtitle">请选择您所在的社区，绑定后可享受团购服务</text>
                
                <!-- 社区列表 -->
                <view class="community-list" v-if="communityList.length > 0">
                    <view class="community-item" 
                          v-for="community in communityList" 
                          :key="community.id"
                          @click="selectCommunity(community)">
                        <view class="community-info">
                            <text class="community-name">{{ community.name }}</text>
                            <text class="community-address">{{ community.full_address }}</text>
                        </view>
                        <view class="select-btn">选择</view>
                    </view>
                </view>
                
                <!-- 加载状态 -->
                <view class="loading-state" v-else-if="loading">
                    <text class="loading-text">正在加载社区列表...</text>
                </view>
                
                <!-- 空状态 -->
                <view class="empty-state" v-else>
                    <text class="empty-text">暂无可用社区</text>
                    <view class="retry-btn" @click="loadCommunityList">
                        <text>重新加载</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import {
    getCommunityList,
    bindCommunity
} from '@/api/group.js'

export default {
    name: 'CommunitySelector',
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            communityList: [],
            loading: false
        }
    },
    watch: {
        visible(newVal) {
            if (newVal) {
                this.loadCommunityList();
            }
        }
    },
    methods: {
        // 加载社区列表
        async loadCommunityList() {
            if (this.loading) return;
            
            this.loading = true;
            try {
                const response = await getCommunityList({
                    page: 1,
                    limit: 20
                });
                
                if (response.status === 200 && response.data) {
                    this.communityList = response.data.list || response.data;
                    console.log('社区列表加载成功:', this.communityList);
                } else {
                    console.log('社区列表数据格式异常:', response);
                    uni.showToast({
                        title: '获取社区列表失败',
                        icon: 'none'
                    });
                }
            } catch (error) {
                console.error('加载社区列表失败:', error);
                uni.showToast({
                    title: '网络错误，请重试',
                    icon: 'none'
                });
            } finally {
                this.loading = false;
            }
        },
        
        // 选择社区
        async selectCommunity(community) {
            try {
                uni.showLoading({
                    title: '绑定中...'
                });
                
                const response = await bindCommunity({
                    community_id: community.id
                });
                
                if (response.status === 200) {
                    uni.hideLoading();
                    uni.showToast({
                        title: '绑定成功',
                        icon: 'success'
                    });
                    
                    // 触发绑定成功事件
                    this.$emit('bind-success', community);
                    this.closeModal();
                } else {
                    uni.hideLoading();
                    uni.showToast({
                        title: response.msg || '绑定失败',
                        icon: 'none'
                    });
                }
            } catch (error) {
                uni.hideLoading();
                console.error('绑定社区失败:', error);
                uni.showToast({
                    title: error.message || '绑定失败，请重试',
                    icon: 'none'
                });
            }
        },
        
        // 关闭弹窗
        closeModal() {
            this.$emit('close');
        },
        
        // 点击遮罩关闭
        handleMaskClick() {
            this.closeModal();
        }
    }
}
</script>

<style lang="scss" scoped>
.community-selector-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    
    .modal-content {
        width: 90%;
        max-width: 400px;
        max-height: 80vh;
        background: #FFFFFF;
        border-radius: 12px;
        overflow: hidden;
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #F0F0F0;
            
            .modal-title {
                font-size: 18px;
                font-weight: 600;
                color: #333333;
            }
            
            .close-btn {
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                
                .close-icon {
                    font-size: 24px;
                    color: #999999;
                    line-height: 1;
                }
            }
        }
        
        .modal-body {
            padding: 20px;
            max-height: 60vh;
            overflow-y: auto;
            
            .subtitle {
                display: block;
                font-size: 14px;
                color: #666666;
                margin-bottom: 20px;
                line-height: 1.5;
            }
            
            .community-list {
                .community-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 0;
                    border-bottom: 1px solid #F5F5F5;
                    
                    &:last-child {
                        border-bottom: none;
                    }
                    
                    &:active {
                        background: #F8F9FA;
                    }
                    
                    .community-info {
                        flex: 1;
                        margin-right: 15px;
                        
                        .community-name {
                            display: block;
                            font-size: 16px;
                            font-weight: 500;
                            color: #333333;
                            margin-bottom: 4px;
                        }
                        
                        .community-address {
                            display: block;
                            font-size: 12px;
                            color: #999999;
                            line-height: 1.4;
                        }
                    }
                    
                    .select-btn {
                        padding: 8px 16px;
                        background: #FF840B;
                        color: #FFFFFF;
                        border-radius: 16px;
                        font-size: 14px;
                        font-weight: 500;
                    }
                }
            }
            
            .loading-state, .empty-state {
                text-align: center;
                padding: 40px 20px;
                
                .loading-text, .empty-text {
                    font-size: 14px;
                    color: #999999;
                    margin-bottom: 20px;
                }
                
                .retry-btn {
                    display: inline-block;
                    padding: 8px 20px;
                    background: #F0F0F0;
                    color: #666666;
                    border-radius: 20px;
                    font-size: 14px;
                }
            }
        }
    }
}
</style>
