<template>
    <view class="review-page">
        <!-- 使用通用头部导航组件 -->
        <CommonHeader title="资料审核" @back="goBack"></CommonHeader>

        <!-- 审核状态内容 -->
        <view class="review-content">
            <!-- 已申请过的状态 -->
            <view v-if="isAlreadyApplied" class="already-applied-content">
                <image 
                    src="/static/common/icons/info/cute-bun-on-sofa-icon.svg" 
                    class="bun-icon"
                    @tap="goToHome"
                ></image>
                <view class="already-applied-text">您的信息已经提交了稍后会有专业人员与您联系，请耐心等待哦~</view>
            </view>
            
            <!-- 正常审核流程内容 -->
            <block v-else>
                <!-- 进度指示器 -->
                <view class="steps">
                    <view class="progress-bg"></view>
                    <view class="progress" :style="{ width: currentStatus === 0 ? '39rpx' : currentStatus === 1 ? '50%' : '100%' }"></view>
                    
                    <view class="step step1" :class="{ active: currentStatus >= 0 }">
                        <view class="step-dot"></view>
                        <view class="step-text">信息提交</view>
                    </view>
                    
                    <view class="step step2" :class="{ active: currentStatus >= 1 }">
                        <view class="step-dot"></view>
                        <view class="step-text">审核中</view>
                    </view>
                    
                    <view class="step step3" :class="{ active: currentStatus >= 2 }">
                        <view class="step-dot"></view>
                        <view class="step-text" v-if="currentStatus >= 2">审核通过</view>
                    </view>
                </view>

                <!-- 状态信息 -->
                <view class="content">
                    <!-- 信息提交成功状态 -->
                    <block v-if="currentStatus === 0">
                        <image src="/static/common/icons/info/folder-search-symbol.svg" class="status-icon"></image>
                        <view class="status-title">信息提交成功</view>
                        <view class="status-desc">工作人员将在3个工作日内处理</view>
                    </block>

                    <!-- 正在审核状态 -->
                    <block v-if="currentStatus === 1">
                        <image src="/static/common/icons/info/time-clock-icon.svg" class="status-icon"></image>
                        <view class="status-title">正在审核</view>
                        <view class="status-desc">请耐心等待</view>
                    </block>

                    <!-- 审核通过状态 -->
                    <block v-if="currentStatus === 2">
                        <image src="/static/common/icons/info/check-mark-icon.svg" class="status-icon"></image>
                        <view class="status-title">审核通过</view>
                        <view class="status-desc">恭喜您审核通过，可以开始准备产品了</view>
                    </block>
                </view>

                <!-- 按钮区域 -->
                <view class="button-area">
                    <!-- 信息提交成功状态显示下一步按钮 -->
                    <view
                        v-if="currentStatus === 0"
                        class="next-btn"
                        @tap="toNextStep"
                    >下一步</view>
                    <!-- 正在审核状态显示刷新按钮 -->
                    <view v-if="currentStatus === 1" class="refresh-btn" @tap="refreshStatus">刷新</view>
                    <!-- 审核通过状态显示返回首页按钮 -->
                    <view v-if="currentStatus === 2" class="next-btn" @tap="goToCompleted">返回首页</view>
                </view>
            </block>
        </view>
    </view>
</template>

<script>
export default {
    data () {
        return {
            currentStatus: 0,
            isAlreadyApplied: false
        }
    },
    onLoad (options) {
        // 检查是否已申请过
        if (options && options.alreadyApplied === '1') {
            this.isAlreadyApplied = true
        } else if (options && options.status) {
            this.currentStatus = parseInt(options.status)
        } else {
            this.currentStatus = 0
        }
    },
    methods: {
        goBack () {
            uni.navigateBack()
        },
        goToHome () {
            // 返回首页
            uni.switchTab({
                url: '/pages/index/index'
            })
        },
        refreshStatus () {
            uni.showLoading({
                title: '刷新中...'
            })
            setTimeout(() => {
                uni.hideLoading()
                if (Math.random() > 0.5) {
                    this.currentStatus = 2
                } else {
                    uni.showToast({
                        title: '暂无更新',
                        icon: 'none'
                    })
                }
            }, 1500)
        },
        goToCompleted () {
            // 直接返回首页，不再跳转到completed页面
            uni.switchTab({
                url: '/pages/index/index'
            })
        },
        toNextStep () {
            // 进入审核中
            this.currentStatus = 1
        }
    }
}
</script>

<style lang="scss" scoped>
.review-page {
    min-height: 100vh;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    position: relative;
}
.status-bar {
    background-color: #fff;
}
.header {
    display: flex;
    align-items: center;
    height: 88rpx;
    padding: 0 32rpx;
    background-color: #fff;
    position: relative;
    .back-icon {
        width: 56rpx;
        height: 56rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        .icon-image {
            width: 40rpx;
            height: 40rpx;
        }
    }
    .page-title {
        font-size: 36rpx;
        font-weight: 400;
        color: #1A1A1A;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
}
.divider {
    height: 1rpx;
    background-color: #F2F2F2;
    width: 100%;
}
.review-content {
    flex: 1;
    position: relative;
}

/* 已申请过的状态样式 */
.already-applied-content {
    position: absolute;
    width: 372rpx;
    height: 278rpx;
    left: 50%;
    transform: translateX(-50%);
    top: 291rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .bun-icon {
        width: 250rpx;
        height: 166rpx;
        margin-bottom: 40rpx;
    }
    
    .already-applied-text {
        width: 372rpx;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 24rpx;
        line-height: 34rpx;
        text-align: center;
        color: #999999;
    }
}

/* 进度指示器样式 */
.steps {
    position: absolute;
    width: 702rpx;
    height: 120rpx;
    left: 24rpx;
    top: 139rpx;
    
    .progress-bg {
        position: absolute;
        width: 100%;
        height: 14rpx;
        left: 0;
        top: 18rpx;
        background: #FFC082;
        border-radius: 10rpx;
        z-index: 1;
    }
    
    .progress {
        position: absolute;
        height: 14rpx;
        left: 0;
        top: 18rpx;
        background: #FE8D00;
        border-radius: 10rpx;
        transition: width 0.3s;
        z-index: 2;
    }
    
    .step {
        position: absolute;
        width: 112rpx;
        height: 120rpx;
        z-index: 3;
        
        .step-dot {
            position: absolute;
            width: 36rpx;
            height: 36rpx;
            border-radius: 50%;
            background: #FFC082;
            left: 50%;
            transform: translateX(-50%);
            top: 4rpx;
        }
        
        .step-text {
            position: absolute;
            width: 112rpx;
            top: 48rpx;
            left: 50%;
            transform: translateX(-50%);
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 28rpx;
            line-height: 40rpx;
            color: #000000;
            text-align: center;
            white-space: nowrap;
        }
        
        &.active .step-dot {
            background: #FE8D00;
        }
    }
    
    .step1 {
        left: 0;
        top: 0;
    }
    
    .step2 {
        left: 50%;
        top: 0;
        transform: translateX(-50%);
    }
    
    .step3 {
        right: 0;
        top: 0;
    }
}

/* 内容区域样式 */
.content {
    position: absolute;
    width: 436rpx;
    height: 356rpx;
    left: 50%;
    transform: translateX(-50%);
    top: 278rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .status-icon {
        width: 224rpx;
        height: 228rpx;
        margin-bottom: 30rpx;
    }
    
    .status-title {
        width: 216rpx;
        height: 50rpx;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 36rpx;
        line-height: 50rpx;
        color: #000000;
        text-align: center;
        margin-bottom: 16rpx;
    }
    
    .status-desc {
        width: 436rpx;
        height: 44rpx;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 32rpx;
        line-height: 44rpx;
        color: #999999;
        text-align: center;
    }
}

/* 按钮样式 */
.button-area {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 700rpx;
    
    .next-btn, .refresh-btn {
        width: 238rpx;
        height: 90rpx;
        line-height: 90rpx;
        text-align: center;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 32rpx;
        color: #FFFFFF;
    }
    
    .next-btn {
        background: #FE8D00;
        border-radius: 8rpx;
    }
    
    .refresh-btn {
        background: #F7F7F7;
        color: #666;
        border-radius: 8rpx;
    }
}
</style>