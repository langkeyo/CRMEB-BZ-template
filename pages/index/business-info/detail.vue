<template>
    <view class="business-detail-page">
        <!-- 顶部图片区域 -->
        <view class="banner-container">
            <swiper class="banner-swiper" circular indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" 
                indicator-active-color="#FFFFFF" autoplay interval="3000">
                <swiper-item v-for="(item, index) in bannerList" :key="index">
                    <image class="banner-img" :src="item" mode="aspectFill" />
                </swiper-item>
            </swiper>
            
            <!-- 顶部操作按钮 -->
            <view class="top-actions">
                <view class="back-btn" @click="goBack">
                    <image class="icon" src="/static/images/index/business-info/back_white.svg" />
                </view>
                <view class="right-actions">
                    <view class="share-btn" @click="share">
                        <image class="icon" src="/static/images/index/business-info/share.svg" />
                    </view>
                    <view class="more-btn" @click="showMore">
                        <image class="icon" src="/static/images/index/business-info/more.svg" />
                    </view>
                </view>
            </view>
            
            <!-- 页码指示器 -->
            <view class="page-indicator">
                <text>3/5</text>
            </view>
        </view>

        <!-- 商家信息区域 -->
        <view class="business-info">
            <view class="business-header">
                <view class="business-logo">
                    <image :src="businessInfo.logo" mode="aspectFill" />
                </view>
                <view class="business-title-box">
                    <view class="business-title">{{ businessInfo.name }}</view>
                    <view class="business-subtitle">{{ businessInfo.slogan }}</view>
                </view>
            </view>
            
            <view class="business-stats">
                <view class="stat-item">
                    <text class="stat-value">{{ businessInfo.storeCount }}</text>
                    <text class="stat-label">门店数量</text>
                </view>
                <view class="stat-item">
                    <text class="stat-value">{{ businessInfo.foundYear }}</text>
                    <text class="stat-label">成立年份</text>
                </view>
                <view class="stat-item">
                    <text class="stat-value">{{ businessInfo.franchiseCount }}</text>
                    <text class="stat-label">加盟数量</text>
                </view>
            </view>
        </view>

        <!-- 加盟信息区域 -->
        <view class="franchise-info">
            <view class="info-title">加盟信息</view>
            
            <view class="info-item">
                <view class="info-label">加盟费用</view>
                <view class="info-value">{{ businessInfo.franchiseFee }}</view>
            </view>
            <view class="info-item">
                <view class="info-label">保证金</view>
                <view class="info-value">{{ businessInfo.deposit }}</view>
            </view>
            <view class="info-item">
                <view class="info-label">管理费</view>
                <view class="info-value">{{ businessInfo.managementFee }}</view>
            </view>
            <view class="info-item">
                <view class="info-label">品牌使用费</view>
                <view class="info-value">{{ businessInfo.brandFee }}</view>
            </view>
        </view>

        <!-- 加盟流程 -->
        <view class="franchise-process">
            <view class="info-title">加盟流程</view>
            <view class="process-steps">
                <view class="process-step" v-for="(step, index) in franchiseProcess" :key="index">
                    <view class="step-number">{{ index + 1 }}</view>
                    <view class="step-content">
                        <view class="step-title">{{ step.title }}</view>
                        <view class="step-desc">{{ step.desc }}</view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 底部操作区域 -->
        <view class="bottom-actions">
            <view class="action-btn contact-btn" @click="contact">
                <image class="btn-icon" src="/static/images/index/business-info/contact.svg" />
                <text>联系客服</text>
            </view>
            <view class="action-btn apply-btn" @click="applyFranchise">立即申请加盟</view>
        </view>

        <!-- 底部安全区 -->
        <view class="safe-area-bottom"></view>
    </view>
</template>

<script>
import {
    getFranchiseInfo,
    applyFranchise
} from '@/api/group.js'

export default {
    name: 'BusinessDetailPage',
    data() {
        return {
            franchiseId: null,
            bannerList: [
                '/static/images/index/business-info/detail_banner1.jpg',
                '/static/images/index/business-info/detail_banner1.jpg',
                '/static/images/index/business-info/detail_banner1.jpg'
            ],
            businessInfo: {
                id: 1,
                name: '瑞幸咖啡 Luckin Coffee',
                logo: '/static/images/index/business-info/luckin_coffee.png',
                slogan: '小蓝杯，大生意',
                storeCount: '7000+',
                foundYear: '2017',
                franchiseCount: '5000+',
                franchiseFee: '12万-18万',
                deposit: '5万',
                managementFee: '销售额的3%',
                brandFee: '2万/年'
            },
            franchiseProcess: [
                {
                    title: '提交申请',
                    desc: '填写加盟申请表，提交个人基本信息'
                },
                {
                    title: '资质审核',
                    desc: '总部审核申请人资质，确认是否符合加盟条件'
                },
                {
                    title: '实地考察',
                    desc: '申请人到总部或指定门店进行实地考察'
                },
                {
                    title: '签订合同',
                    desc: '双方确认合作意向后，签订加盟合同'
                },
                {
                    title: '缴纳费用',
                    desc: '按照合同约定缴纳相关费用'
                },
                {
                    title: '开业筹备',
                    desc: '总部协助选址、装修、培训等开业筹备工作'
                },
                {
                    title: '正式营业',
                    desc: '完成所有筹备工作后，门店正式开业'
                }
            ]
        }
    },
    onLoad(options) {
        if (options.id) {
            this.franchiseId = options.id;
            this.loadFranchiseInfo();
        }
    },
    methods: {
        // 加载加盟项目详情
        async loadFranchiseInfo() {
            if (!this.franchiseId) return;

            try {
                const response = await getFranchiseInfo(this.franchiseId);
                if (response.status === 200 && response.data) {
                    // 更新业务信息
                    this.businessInfo = {
                        ...this.businessInfo,
                        ...response.data
                    };
                    console.log('加盟项目详情加载成功:', this.businessInfo);
                }
            } catch (error) {
                console.error('加载加盟项目详情失败:', error);
            }
        },

        goBack() {
            uni.navigateBack()
        },
        share() {
            uni.showToast({
                title: '分享功能开发中',
                icon: 'none'
            })
        },
        showMore() {
            uni.showActionSheet({
                itemList: ['收藏', '举报', '不感兴趣'],
                success: function(res) {
                    uni.showToast({
                        title: '操作成功',
                        icon: 'none'
                    })
                }
            })
        },
        contact() {
            uni.showModal({
                title: '联系客服',
                content: '确定要联系客服吗？',
                success: function(res) {
                    if (res.confirm) {
                        uni.makePhoneCall({
                            phoneNumber: '400-123-4567'
                        })
                    }
                }
            })
        },
        applyFranchise() {
            // 显示申请表单
            uni.showModal({
                title: '申请加盟',
                editable: true,
                placeholderText: '请输入您的姓名和联系电话',
                success: async (res) => {
                    if (res.confirm && res.content) {
                        const content = res.content.trim();
                        if (!content) {
                            uni.showToast({
                                title: '请输入有效信息',
                                icon: 'none'
                            });
                            return;
                        }

                        try {
                            // 简单解析输入内容（实际项目中应该有更完善的表单）
                            const parts = content.split(/[,，\s]+/);
                            const name = parts[0] || '用户';
                            const phone = parts[1] || '';

                            const response = await applyFranchise({
                                name: name,
                                phone: phone,
                                franchise_id: this.franchiseId || this.businessInfo.id
                            });

                            if (response.status === 200) {
                                uni.showToast({
                                    title: '申请提交成功，稍后会有专员联系您',
                                    icon: 'success',
                                    duration: 2000
                                });
                            } else {
                                uni.showToast({
                                    title: response.msg || '申请提交失败',
                                    icon: 'none'
                                });
                            }
                        } catch (error) {
                            console.error('申请加盟失败:', error);
                            uni.showToast({
                                title: '网络错误，请稍后重试',
                                icon: 'none'
                            });
                        }
                    }
                }
            });
        }
    }
}
</script>

<style lang="scss">
page {
    background: #FFFFFF;
}

.business-detail-page {
    min-height: 100vh;
    background: #FFFFFF;
    font-family: 'PingFang SC', sans-serif;
    position: relative;
    display: flex;
    flex-direction: column;
}

.banner-container {
    position: relative;
    width: 100%;
    height: 750rpx;
    overflow: hidden;
    flex-shrink: 0;
    
    .banner-swiper {
        width: 100%;
        height: 100%;
    }
    
    .banner-img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
    }
    
    .top-actions {
        position: absolute;
        top: 44rpx; /* 调整顶部按钮位置，从88rpx改为44rpx */
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
        padding: 0 30rpx;
        z-index: 10;
        
        .back-btn {
            width: 80rpx;
            height: 80rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 50%;
            
            .icon {
                width: 40rpx;
                height: 40rpx;
            }
        }
        
        .right-actions {
            display: flex;
            
            .share-btn, .more-btn {
                width: 80rpx;
                height: 80rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 50%;
                margin-left: 20rpx;
                
                .icon {
                    width: 40rpx;
                    height: 40rpx;
                }
            }
        }
    }
    
    .page-indicator {
        position: absolute;
        right: 30rpx;
        bottom: 30rpx;
        background: rgba(0, 0, 0, 0.5);
        color: #FFFFFF;
        font-size: 24rpx;
        padding: 8rpx 20rpx;
        border-radius: 30rpx;
        z-index: 10;
    }
}

.business-info {
    padding: 30rpx;
    background: #FFFFFF;
    margin-top: -60rpx;
    border-radius: 30rpx 30rpx 0 0;
    position: relative;
    z-index: 5;
    box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);
    margin-bottom: 20rpx;
    flex-shrink: 0;
    
    .business-header {
        display: flex;
        align-items: center;
        
        .business-logo {
            width: 120rpx;
            height: 120rpx;
            border-radius: 20rpx;
            overflow: hidden;
            margin-right: 24rpx;
            box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
            
            image {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        
        .business-title-box {
            flex: 1;
            
            .business-title {
                font-size: 36rpx;
                color: #333333;
                font-weight: 600;
                margin-bottom: 12rpx;
                line-height: 1.3;
            }
            
            .business-subtitle {
                font-size: 28rpx;
                color: #666666;
                line-height: 1.4;
            }
        }
    }
    
    .business-stats {
        display: flex;
        justify-content: space-between;
        margin-top: 40rpx;
        padding: 0 20rpx;
        
        .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            
            .stat-value {
                font-size: 36rpx;
                color: #FF7E00;
                font-weight: 600;
                margin-bottom: 8rpx;
                line-height: 1.2;
            }
            
            .stat-label {
                font-size: 24rpx;
                color: #999999;
            }
        }
    }
}

.franchise-info {
    padding: 30rpx;
    background: #FFFFFF;
    margin-top: 20rpx;
    flex-shrink: 0;
    
    .info-title {
        font-size: 32rpx;
        color: #333333;
        font-weight: 600;
        margin-bottom: 30rpx;
        position: relative;
        padding-left: 20rpx;
        line-height: 1.4;
        
        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 8rpx;
            bottom: 8rpx;
            width: 8rpx;
            background: #FF7E00;
            border-radius: 4rpx;
        }
    }
    
    .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24rpx 0;
        border-bottom: 1rpx solid #F5F5F5;
        
        &:last-child {
            border-bottom: none;
        }
        
        .info-label {
            font-size: 28rpx;
            color: #666666;
        }
        
        .info-value {
            font-size: 28rpx;
            color: #333333;
            font-weight: 500;
        }
    }
}

.franchise-process {
    padding: 30rpx;
    background: #FFFFFF;
    margin-top: 20rpx;
    padding-bottom: 160rpx; /* 为底部操作区域留出空间 */
    flex: 1;
    
    .process-steps {
        margin-top: 30rpx;
    }
    
    .process-step {
        display: flex;
        margin-bottom: 40rpx;
        position: relative;
        
        &:last-child {
            margin-bottom: 0;
        }
        
        &::after {
            content: '';
            position: absolute;
            left: 25rpx;
            top: 50rpx;
            bottom: -30rpx;
            width: 2rpx;
            background: #EEEEEE;
        }
        
        &:last-child::after {
            display: none;
        }
        
        .step-number {
            width: 50rpx;
            height: 50rpx;
            background: linear-gradient(90deg, #FF7E00 0%, #FDA44D 100%);
            color: #FFFFFF;
            font-size: 28rpx;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            margin-right: 20rpx;
            z-index: 1;
        }
        
        .step-content {
            flex: 1;
            
            .step-title {
                font-size: 30rpx;
                color: #333333;
                font-weight: 500;
                margin-bottom: 8rpx;
            }
            
            .step-desc {
                font-size: 26rpx;
                color: #999999;
                line-height: 1.5;
            }
        }
    }
}

.bottom-actions {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding: 20rpx 30rpx;
    background: #FFFFFF;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
    z-index: 100;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    
    .action-btn {
        height: 88rpx;
        border-radius: 44rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
        
        &.contact-btn {
            width: 240rpx;
            background: #F8F8F8;
            color: #666666;
            margin-right: 20rpx;
            
            .btn-icon {
                width: 40rpx;
                height: 40rpx;
                margin-right: 10rpx;
            }
        }
        
        &.apply-btn {
            flex: 1;
            background: linear-gradient(90deg, #FF7E00 0%, #FDA44D 100%);
            color: #FFFFFF;
            font-weight: 500;
            box-shadow: 0 4rpx 8rpx rgba(255, 126, 0, 0.2);
        }
    }
}

.safe-area-bottom {
    height: env(safe-area-inset-bottom);
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    background: #FFFFFF;
    z-index: 99;
}
</style>
