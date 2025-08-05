<template>
    <view class="cooperation-detail-page">
        <!-- header-section -->
        <view class="header-section">
            <!-- 背景图片 -->
            <view class="header-image-container">
                <swiper class="header-swiper" circular autoplay interval="3000" duration="500">
                    <swiper-item v-for="(item, index) in detail.images" :key="index">
                        <image class="header-image" :src="item" mode="aspectFill" />
                    </swiper-item>
                </swiper>

                <!-- 预览控制按钮 -->
                <view class="preview-controller-button" @click="showPreview">
                    <view class="controller-outer-circle">
                        <view class="controller-inner-circle"></view>
                    </view>
                </view>
            </view>

            <!-- 顶部导航栏 -->
            <view class="header-navbar">
                <view class="back-btn" @click="goBack">
                    <image class="back-icon" src="/static/images/index/business-info/back_arrow.svg" mode="aspectFit" />
                </view>
                <view class="action-btns">
                    <view class="share-btn" @click="shareInfo">
                        <image class="share-icon" src="/static/images/index/business-info/share.svg" mode="aspectFit" />
                    </view>
                </view>
            </view>
            <!-- controller-section 媒体控制器 -->
            <view class="controller-section">
                <view class="controller-background">
                    <view class="controller-active-bg" :style="{ transform: `translateX(${getActiveTabPosition()}rpx)` }"></view>
                    <view class="media-tab" :class="{ 'active': mediaType === 'vr' }" @click="switchMediaType('vr')">
                        <text class="tab-text">VR</text>
                    </view>
                    <view class="media-tab" :class="{ 'active': mediaType === 'photo' }" @click="switchMediaType('photo')">
                        <text class="tab-text">照片</text>
                    </view>
                    <view class="media-tab" :class="{ 'active': mediaType === 'video' }" @click="switchMediaType('video')">
                        <text class="tab-text">视频</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 项目信息区域 -->
        <view class="project-info-section">
            <!-- 标题行 -->
            <view class="title-row">
                <view class="project-title">{{ detail.name }}</view>
                <view class="follow-btn" :class="{ 'followed': isFollowed }" @click="toggleFollow">
                    {{ isFollowed ? '已关注' : '关注' }}
                </view>
            </view>

            <!-- 基本信息 -->
            <view class="basic-info">
                <view class="info-item">对接费用：{{ detail.contactFee }}</view>
                <view class="info-item">招商类别：{{ detail.category }}</view>
                <view class="info-item">产业细分：{{ detail.industry }}</view>
            </view>

            <!-- 联系人信息 -->
            <view class="contact-info">
                <view class="contact-avatar">
                    <image :src="detail.contactAvatar" mode="aspectFill"></image>
                </view>
                <view class="contact-details">
                    <view class="contact-name">{{ detail.contactName }}</view>
                    <view class="contact-tag">{{ detail.contactTag }}</view>
                </view>
            </view>
        </view>

        <!-- 项目介绍区域 -->
        <view class="project-intro-section">
            <!-- 招商区域 -->
            <view class="investment-promotion">
                <view class="region-title">招商区域</view>
                <view class="region-value">{{ detail.region }}</view>
            </view>

            <!-- 项目介绍 -->
            <view class="project-intro">
                <view class="intro-title">项目介绍</view>
                <view class="intro-content" :class="{ 'expanded': isExpanded }">
                    <text class="intro-text">一、项目概况\n{{ detail.projectSituation }}\n\n二、区位价值优势\n\n1. 黄金区位辐射\n{{ detail.locationAdvantages.join('\n') }}\n\n2. 立体消费场景\n{{ detail.consumptionScenarios.join('\n') }}</text>
                </view>
            </view>

            <!-- 展开控制器 -->
            <view class="expand-controller-section" @click="toggleExpand">
                <view class="expand-text">{{ isExpanded ? '收起全部' : '展开全部' }}</view>
                <image class="expand-arrow" :class="{ 'arrow-up': isExpanded }" src="/static/images/index/business-info/arrow_down.svg" mode="aspectFit" />
            </view>
        </view>

        <!-- 底部按钮 -->
        <view class="bottom-btn" @click="bookConsultation">立即预约咨询</view>

        <!-- 底部安全区 -->
        <view class="safe-area-bottom"></view>
    </view>
</template>

<script>
import { getCooperationInfo } from '@/api/group.js'

export default {
    name: 'BusinessCooperationDetailPage',
    data() {
        return {
            id: 0,
            mediaType: 'vr', // 媒体类型：vr, photo, video
            isFollowed: false, // 是否已关注
            isExpanded: false, // 是否展开全部内容
            detail: {
                name: '万霖大厦B1楼餐饮项目',
                contactFee: '10000元',
                category: '餐饮',
                industry: '餐饮服务行业',
                contactName: '张强-招商经理',
                contactAvatar: '/static/images/index/business-info/contact_avatar.png',
                contactTag: '产业经理',
                region: '海淀区',
                status: '已经提交申请后续会电话联系您',
                projectSituation: 'xx大厦位于[城市/区域核心位置]，总建筑面积[XX万m²]，是集商务办公、商业配套、休闲体验于一体的城市综合体。项目面向优质餐饮品牌开放招商，现划归运营区域名称[餐饮新地标]，构建全时段、多场景美食消费生态圈。',
                locationAdvantages: [
                    '地处[商圈/交通枢纽名称]，3公里范围内覆盖[XX万]常住人口、[XX栋]写字楼、[XX所]高校',
                    '地铁[XX号线]直达，周边[XX条]公交线路，日均客流量超[XX万人/次]'
                ],
                consumptionScenarios: [
                    '大厦内入驻[XX家]世界500强/行业头部企业，白领客群超[XX人]',
                    '周边[购物中心/商圈/住宅区名称]，形成"商务+休闲"双重消费场景'
                ],
                images: [
                    '/static/images/index/business-info/cooperation_banner.jpg',
                    '/static/images/index/business-info/cooperation_banner.jpg',
                    '/static/images/index/business-info/cooperation_banner.jpg'
                ]
            }
        };
    },
    onLoad(options) {
        // 获取传递的参数
        if (options.id) {
            this.id = parseInt(options.id);
            // 根据ID获取详情数据
            this.getDetailById(this.id);
        }
    },
    methods: {
        // 返回上一页
        goBack() {
            uni.navigateBack();
        },

        // 根据ID获取详情数据
        async getDetailById(id) {
            try {
                console.log('获取ID为', id, '的招商合作详情');

                const response = await getCooperationInfo(id);

                if (response.status === 200 && response.data) {
                    const data = response.data;

                    // 映射API数据到页面数据结构
                    this.detail = {
                        ...this.detail,
                        name: data.title || this.detail.name,
                        contactFee: data.connection_fee || this.detail.contactFee,
                        category: data.categroy || this.detail.category,
                        industry: data.industry_cate || this.detail.industry,
                        contactName: data.contacts || this.detail.contactName,
                        contactPhone: data.contacts_phone || '',
                        contactPosition: data.contacts_position || this.detail.contactTag,
                        region: data.district?.name || data.district_name || this.detail.region,
                        images: data.images ? data.images.split(',') : this.detail.images,
                        projectSituation: data.intro || this.detail.projectSituation,
                        video: data.video || this.detail.video,
                        vr: data.vr || this.detail.vr
                    };

                    console.log('招商合作详情加载成功:', this.detail);
                } else {
                    console.error('获取招商合作详情失败:', response.msg);
                    uni.showToast({
                        title: response.msg || '获取详情失败',
                        icon: 'none'
                    });
                }
            } catch (error) {
                console.error('获取招商合作详情异常:', error);
                uni.showToast({
                    title: '网络错误，请稍后重试',
                    icon: 'none'
                });
            }
        },

        // 切换媒体类型
        switchMediaType(type) {
            this.mediaType = type;
        },

        // 分享信息
        shareInfo() {
            uni.showActionSheet({
                itemList: ['分享到微信', '分享到朋友圈', '分享到QQ'],
                success: function (res) {
                    uni.showToast({
                        title: '已选择' + (res.tapIndex + 1) + '分享方式',
                        icon: 'none'
                    });
                }
            });
        },

        // 显示更多选项
        showMoreOptions() {
            uni.showActionSheet({
                itemList: ['举报', '不感兴趣'],
                success: function (res) {
                    console.log('选择了第' + (res.tapIndex + 1) + '个选项');
                }
            });
        },

        // 切换关注状态
        toggleFollow() {
            this.isFollowed = !this.isFollowed;
            uni.showToast({
                title: this.isFollowed ? '已关注' : '已取消关注',
                icon: 'none'
            });
        },

        // 切换展开/收起状态
        toggleExpand() {
            this.isExpanded = !this.isExpanded;
        },

        // 预约咨询
        bookConsultation() {
            uni.showModal({
                title: '预约咨询',
                content: '确定要预约咨询此项目吗？',
                success: (res) => {
                    if (res.confirm) {
                        uni.showToast({
                            title: '预约成功，我们会尽快联系您',
                            icon: 'none'
                        });
                    }
                }
            });
        },

        // 显示预览
        showPreview() {
            uni.showToast({
                title: '预览功能开发中',
                icon: 'none'
            });
        },

        // 获取活动标签位置
        getActiveTabPosition() {
            // controller-section总宽度：336rpx
            // 每个tab宽度：336rpx / 3 = 112rpx
            // controller-active-bg宽度：112rpx
            if (this.mediaType === 'vr') return 0;
            if (this.mediaType === 'photo') return 112; // 第二个位置
            if (this.mediaType === 'video') return 224; // 第三个位置 112 * 2
            return 0;
        }
    }
};
</script>

<style lang="scss">
.cooperation-detail-page {
    min-height: 100vh;
    background-color: #F5F5F5;

    /* header-section */
    .header-section {
        width: 750rpx; /* 375px * 2 */
        height: 500rpx; /* 去掉状态栏高度 */
        position: relative;
        background: #D9D9D9;
        overflow: hidden;
    }

    .header-image-container {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .header-swiper {
        width: 100%;
        height: 100%;
    }

    .header-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    /* 顶部导航栏 */
    .header-navbar {
        position: absolute;
        top: 44rpx; /* 状态栏高度 */
        left: 0;
        right: 0;
        height: 96rpx; /* 48px * 2 */
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24rpx; /* 12px * 2 */
        z-index: 15;

        .back-btn {
            width: 42rpx; /* 21px * 2 */
            height: 42rpx; /* 21px * 2 */
            display: flex;
            align-items: center;
            justify-content: center;

            .back-icon {
                width: 22.6rpx; /* 11.3px * 2 */
                height: 42rpx; /* 21px * 2 */
                filter: brightness(0) invert(1); /* 将图标变为白色 */
            }
        }

        .action-btns {
            display: flex;
            align-items: center;
            gap: 24rpx; /* 12px * 2 */

            .share-btn {
                width: 42rpx; /* 21px * 2 */
                height: 42rpx; /* 21px * 2 */
                display: flex;
                align-items: center;
                justify-content: center;

                .share-icon {
                    width: 42rpx; /* 21px * 2 */
                    height: 42rpx; /* 21px * 2 */
                    filter: brightness(0) invert(1); /* 将图标变为白色 */
                }
            }
        }
    }

    /* 预览控制按钮 */
    .preview-controller-button {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 78rpx; /* 39px * 2 */
        height: 78rpx; /* 39px * 2 */
        z-index: 5;
        cursor: pointer;
    }

    .controller-outer-circle {
        width: 78rpx; /* 39px * 2 */
        height: 78rpx; /* 39px * 2 */
        background: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .controller-inner-circle {
        width: 38rpx; /* 19px * 2 */
        height: 38rpx; /* 19px * 2 */
        border: 2rpx solid #FFFFFF; /* 1px * 2 */
        border-radius: 50%;
        box-sizing: border-box;
    }

    /* controller-section */
    .controller-section {
        position: absolute;
        bottom: 46rpx; /* 23px * 2 */
        left: 50%;
        transform: translateX(-50%);
        width: 336rpx; /* 168px * 2 */
        height: 42rpx; /* 21px * 2 */
        z-index: 10;
    }

    .controller-background {
        position: relative;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.85);
        border-radius: 21rpx; /* 10.5px * 2 */
        display: flex;
        align-items: center;
    }

    .controller-active-bg {
        position: absolute;
        width: 112rpx; /* 56px * 2 */
        height: 42rpx; /* 21px * 2 */
        background: #FE9227;
        border-radius: 21rpx; /* 10.5px * 2 */
        transition: transform 0.3s ease;
        z-index: 1;
    }

    .media-tab {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        position: relative;
        z-index: 2;
        cursor: pointer;

        .tab-text {
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 20rpx; /* 10px * 2 */
            line-height: 28rpx; /* 14px * 2 */
            color: #666666;
            transition: color 0.3s ease;
        }

        &.active .tab-text {
            color: #FFFFFF;
        }
    }

    /* project-info-section */
    .project-info-section {
        background: #FFFFFF;
        border-radius: 8rpx; /* 4px * 2 */
        margin: 24rpx; /* 12px * 2 */
        padding: 40rpx 44rpx; /* 20px * 2, 22px * 2 */

        /* 标题行 */
        .title-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30rpx; /* 15px * 2 */

            .project-title {
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 36rpx; /* 18px * 2 */
                line-height: 50rpx; /* 25px * 2 */
                color: #000000;
                flex: 1;
            }

            .follow-btn {
                width: 136rpx; /* 68px * 2 */
                height: 52rpx; /* 26px * 2 */
                background: linear-gradient(90deg, #FF7E00 0%, #FDA44D 100%);
                border-radius: 44rpx; /* 22px * 2 */

                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 36rpx; /* 18px * 2 */
                line-height: 50rpx; /* 25px * 2 */
                text-align: center;
                color: #FFFFFF;

                display: flex;
                align-items: center;
                justify-content: center;

                &.followed {
                    /* 已关注状态保持相同的橙色渐变背景 */
                    background: linear-gradient(90deg, #FF7E00 0%, #FDA44D 100%);
                    color: #FFFFFF;
                }
            }
        }

        /* 基本信息 */
        .basic-info {
            margin-bottom: 30rpx; /* 15px * 2 */

            .info-item {
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 32rpx; /* 16px * 2 */
                line-height: 44rpx; /* 22px * 2 */
                color: #AAAAAA;
                margin-bottom: 16rpx; /* 8px * 2 */

                &:last-child {
                    margin-bottom: 0;
                }
            }
        }

        /* 联系人信息 */
        .contact-info {
            display: flex;
            align-items: center;

            .contact-avatar {
                width: 66rpx; /* 33px * 2 */
                height: 66rpx; /* 33px * 2 */
                border-radius: 50%;
                overflow: hidden;
                margin-right: 26rpx; /* 13px * 2 */

                image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }

            .contact-details {
                flex: 1;
                display: flex;
                align-items: center;
                gap: 30rpx; /* 15px * 2 */

                .contact-name {
                    font-family: 'PingFang SC';
                    font-style: normal;
                    font-weight: 400;
                    font-size: 24rpx; /* 12px * 2 */
                    line-height: 34rpx; /* 17px * 2 */
                    color: #000000;
                }

                .contact-tag {
                    display: inline-block;
                    padding: 6rpx 14rpx; /* 3px * 2, 7px * 2 */
                    border: 2rpx solid #FF840B; /* 1px * 2 */
                    border-radius: 8rpx; /* 4px * 2 */

                    font-family: 'PingFang SC';
                    font-style: normal;
                    font-weight: 400;
                    font-size: 24rpx; /* 12px * 2 */
                    line-height: 22rpx; /* 11px * 2 */
                    color: #FF7E00;
                    text-align: center;
                }
            }
        }
    }

    /* project-intro-section */
    .project-intro-section {
        width: 750rpx; /* 375px * 2 */
        background: #FFFFFF;
        position: relative;
        padding: 44rpx; /* 22px * 2 */

        /* investment-promotion 招商区域 */
        .investment-promotion {
            width: 112rpx; /* 56px * 2 */
            height: 94rpx; /* 47px * 2 */
            margin-bottom: 30rpx; /* 15px * 2 */

            .region-title {
                /* 招商区域 */
                width: 112rpx; /* 56px * 2 */
                height: 40rpx; /* 20px * 2 */

                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 28rpx; /* 14px * 2 */
                line-height: 40rpx; /* 20px * 2 */
                color: #FF830B;
                margin-bottom: 14rpx; /* 7px * 2 */
            }

            .region-value {
                /* 海淀区 */
                width: 84rpx; /* 42px * 2 */
                height: 40rpx; /* 20px * 2 */

                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 28rpx; /* 14px * 2 */
                line-height: 40rpx; /* 20px * 2 */
                color: #333333;
            }
        }

        /* project-intro 项目介绍 */
        .project-intro {
            margin-bottom: 60rpx; /* 30px * 2 */

            .intro-title {
                /* 项目介绍 */
                width: 112rpx; /* 56px * 2 */
                height: 40rpx; /* 20px * 2 */

                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 28rpx; /* 14px * 2 */
                line-height: 40rpx; /* 20px * 2 */
                color: #FF830B;
                margin-bottom: 20rpx; /* 10px * 2 */
            }

            .intro-content {
                width: 686rpx; /* 343px * 2 */
                max-height: 740rpx; /* 370px * 2 */
                overflow: hidden;
                transition: max-height 0.3s ease;

                &.expanded {
                    max-height: none;
                }

                .intro-text {
                    width: 682rpx; /* 341px * 2 */

                    font-family: 'PingFang SC';
                    font-style: normal;
                    font-weight: 400;
                    font-size: 28rpx; /* 14px * 2 */
                    line-height: 40rpx; /* 20px * 2 */
                    color: #333333;
                }
            }
        }

        /* expand-controller-section */
        .expand-controller-section {
            width: 100%;
            height: 136rpx; /* 68px * 2 */
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, #FFFFFF 44.36%);
            border-radius: 8rpx; /* 4px * 2 */
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            margin-top: -60rpx; /* 向上重叠一部分 */

            .expand-text {
                /* 展开全部 */
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 24rpx; /* 12px * 2 */
                line-height: 34rpx; /* 17px * 2 */
                color: #999999;
                text-align: center;
            }

            .expand-arrow {
                /* expand-icon */
                width: 32rpx; /* 16px * 2 */
                height: 32rpx; /* 16px * 2 */
                margin-left: 10rpx;
                transition: transform 0.3s ease;

                &.arrow-up {
                    transform: rotate(180deg);
                }
            }
        }
    }

    /* appointment-btn */
    .bottom-btn {
        position: fixed;
        width: 752rpx; /* 376px * 2 */
        height: 92rpx; /* 46px * 2 */
        left: -2rpx; /* -1px * 2 */
        bottom: 0;

        /* Rectangle 1381 */
        background: #FE8D00;

        display: flex;
        align-items: center;
        justify-content: center;

        /* 立即预约咨询 */
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 32rpx; /* 16px * 2 */
        line-height: 44rpx; /* 22px * 2 */
        color: #FFFFFF;
    }

    .safe-area-bottom {
        height: 34rpx;
        background-color: #FFFFFF;
    }
}
</style>
