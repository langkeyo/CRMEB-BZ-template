<template>
    <view class="join-page">
        <!-- 状态栏占位 -->
        <view class="status-bar" :style="'height:' + statusBarHeight + 'px'"></view>

        <!-- 顶部导航 -->
        <view class="header">
            <view class="back-icon" @tap="goBack">
                <image src="/static/common/icons/navigation/back_arrow.svg" class="icon-image"></image>
            </view>
            <text class="page-title">产品提供</text>
            <view class="right-placeholder"></view>
        </view>

        <view class="divider"></view>

        <!-- 流程内容 -->
        <scroll-view scroll-y class="join-content">
            <!-- 头部图片 -->
            <image src="/static/images/join-process/process_header.jpg" mode="widthFix" class="header-image"></image>

            <!-- 流程步骤 -->
            <view class="process-container">
                <!-- 步骤1 -->
                <view class="step-item">
                    <view class="step-content">
                        <view class="step-title">1.提交申请</view>
                        <view class="step-desc">
                            提交入驻申请表单，说明产品信息，上传产品照片，商家需上传资质信息（如营业执照、营业品类、规格、质检明等）平台收到申请后，将通过电话或系统通知确认接收。</view>
                    </view>
                    <image src="/static/images/join-process/step1.png" mode="aspectFill" class="step-image">
                    </image>
                </view>

                <!-- 步骤2 -->
                <view class="step-item">
                    <view class="step-content">
                        <view class="step-title">2.审核沟通</view>
                        <view class="step-desc">平台团队对商家资质、产品合规性进行审核。若有疑问，将通过电话或在线沟通工具与商家确认细节（如生产许可证、产品安全性等）确保信息真实有效。
                        </view>
                    </view>
                    <image src="/static/images/join-process/step2.png" mode="aspectFill" class="step-image">
                    </image>
                </view>

                <!-- 步骤3 -->
                <view class="step-item">
                    <view class="step-content">
                        <view class="step-title">3.试吃试用</view>
                        <view class="step-desc">食品类：平台或第三方机构进行试吃，评估口感、包装、保质期等。
                            非食品类：寄送样品试用，检测功能、安全性及用户体验。通过测试的产品进入下一环节。</view>
                    </view>
                    <image src="/static/images/join-process/step3.png" mode="aspectFill" class="step-image">
                    </image>
                </view>

                <!-- 步骤4 - 签订合同 -->
                <view class="step-item">
                    <view class="step-content">
                        <view class="step-title">4.签订合同</view>
                        <view class="step-desc">双方确认合作条款（如分成比例、售后服务规则等），签署电子合同。商家需提供企业资质文件（如营业执照），确保法律合规性。</view>
                    </view>
                    <image src="/static/images/join-process/step4.png" mode="aspectFill" class="step-image">
                    </image>
                </view>

                <!-- 步骤5 - 上线销售 -->
                <view class="step-item">
                    <view class="step-content">
                        <view class="step-title">5.上线销售</view>
                        <view class="step-desc">平台为产品创建专属页面，配置详情介绍、价格及物流信息。商家同步备货至指定仓库，产品正式开放销售，并进入平台推广计划</view>
                    </view>
                    <image src="/static/images/join-process/step5.png" mode="aspectFill" class="step-image">
                    </image>
                </view>
            </view>
        </scroll-view>

        <!-- 底部按钮 -->
        <view class="next-btn" @tap="goToNext">下一步</view>

        <!-- 底部安全区占位 -->
        <view class="safe-area"></view>
        
        <!-- 客服图标 -->
        <kefuIcon></kefuIcon>
    </view>
</template>

<script>
import kefuIcon from '@/components/kefuIcon/index.vue';

export default {
    components: {
        kefuIcon
    },
    data () {
        return {
            statusBarHeight: 20 // 默认值，会在onLoad中获取真实值
        }
    },
    onLoad () {
        // 获取状态栏高度
        this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight
    },
    methods: {
        goBack () {
            uni.navigateBack()
        },
        goToNext () {
            // 跳转到基本信息填写页面
            uni.navigateTo({
                url: '/pages/index/product-provide/form/index'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.join-page {
    min-height: 100vh;
    background-color: #FFFFFF;
    position: relative;
    display: flex;
    flex-direction: column;
}

/* 状态栏 */
.status-bar {
    background-color: #FFFFFF;
}

/* 顶部导航 */
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 44px;
    padding: 0 16px;
    background-color: #FFFFFF;

    .back-icon {
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;

        .icon-image {
            width: 18px;
            height: 18px;
        }
    }

    .page-title {
        font-size: 18px;
        font-weight: 400;
        color: #1A1A1A;
    }

    .right-placeholder {
        width: 28px;
    }
}

.divider {
    height: 0.5px;
    background-color: #F2F2F2;
    width: 100%;
}

/* 流程内容 */
.join-content {
    flex: 1;
    padding-bottom: 80px;

    .header-image {
        width: 100%;
        display: block;
    }

    .process-container {
        padding: 20px;

        .step-item {
            margin-bottom: 30px;
            width: 363px;
            margin-left: auto;
            margin-right: auto;

            .step-content {
                margin-bottom: 15px;
                width: 363px;

                .step-title {
                    font-family: 'PingFang SC';
                    font-style: normal;
                    font-weight: 400;
                    font-size: 20px;
                    line-height: 28px;
                    text-align: center;
                    color: #333333;
                    margin-bottom: 8px;
                }

                .step-desc {
                    font-family: 'PingFang SC';
                    font-style: normal;
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 20px;
                    text-align: center;
                    color: #333333;
                }
            }

            .step-image {
                width: 351px;
                height: 262px;
                display: block;
                margin: 0 auto;
                border-radius: 5px;
            }
        }
    }
}

/* 底部按钮 */
.next-btn {
    position: fixed;
    bottom: 34px;
    left: 50%;
    transform: translateX(-50%);
    width: 271px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    background-color: #FE8D00;
    color: #FFFFFF;
    font-size: 16px;
    font-weight: 400;
    border-radius: 71px;
}

.safe-area {
    height: 34px;
}
</style>