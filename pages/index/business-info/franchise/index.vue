<template>
    <view class="franchise-detail-page">
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
                    <view class="favorites-btn" @click="toggleFavorite">
                        <!-- <text class="star-icon">☆</text>  -->
                    </view>
                    <view class="share-btn" @click="shareInfo">
                        <image class="share-icon" src="/static/images/index/business-info/share.svg" mode="aspectFit" />
                    </view>
                </view>
            </view>

            <!-- controller-section 媒体控制器 -->
            <view class="controller-section">
                <view class="controller-background">
                    <view class="controller-active-bg"
                        :style="{ transform: `translateX(${getActiveTabPosition()}rpx)` }"></view>
                    <view class="media-tab" :class="{ 'active': mediaType === 'vr' }" @click="switchMediaType('vr')">
                        <text class="tab-text">VR</text>
                    </view>
                    <view class="media-tab" :class="{ 'active': mediaType === 'photo' }"
                        @click="switchMediaType('photo')">
                        <text class="tab-text">照片</text>
                    </view>
                    <view class="media-tab" :class="{ 'active': mediaType === 'video' }"
                        @click="switchMediaType('video')">
                        <text class="tab-text">视频</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- business-brand-profile-section -->
        <view class="business-brand-profile-section">
            <!-- top-section -->
            <view class="top-section">
                <!-- logo -->
                <view class="logo">
                    <image class="brand-logo" :src="detail.logo" mode="aspectFill" />
                </view>

                <!-- 品牌信息 -->
                <view class="brand-info-frame">
                    <view class="brand-name">{{ detail.name }}</view>
                    <view class="brand-category">{{ detail.category }}</view>
                    <view class="brand-company">{{ detail.company }}</view>
                </view>

                <!-- follow-button -->
                <view class="follow-button" :class="{ 'followed': isFollowed }" @click="toggleFollow">
                    <text class="follow-text">{{ isFollowed ? '已关注' : '关注' }}</text>
                </view>
            </view>

            <!-- bottom-section -->
            <view class="bottom-section">
                <view class="metrics-container">
                    <view class="metric-group">
                        <view class="metric-value">{{ detail.storeCount }}</view>
                        <view class="metric-label">已有门店</view>
                    </view>
                    <view class="metric-group">
                        <view class="metric-value">{{ detail.years }}</view>
                        <view class="metric-label">成立时间</view>
                    </view>
                    <view class="metric-group">
                        <view class="metric-value">{{ detail.avgCost }}</view>
                        <view class="metric-label">人均消费</view>
                    </view>
                    <view class="metric-group">
                        <view class="metric-value">{{ detail.satisfaction }}</view>
                        <view class="metric-label">品牌热度</view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 品牌数据 -->
        <view class="data-section">
            <view class="section-title">品牌数据</view>
            <view class="data-grid">
                <view class="data-item">
                    <view class="data-value">{{ detail.storeCount }}</view>
                    <view class="data-label">现有门店</view>
                </view>
                <view class="data-item">
                    <view class="data-value">{{ detail.provinceCount }}</view>
                    <view class="data-label">覆盖省份</view>
                </view>
                <view class="data-item">
                    <view class="data-value">{{ detail.cityCount }}</view>
                    <view class="data-label">覆盖城市</view>
                </view>
                <view class="data-item">
                    <view class="data-value">{{ detail.provinceCoverage }}%</view>
                    <view class="data-label">省份覆盖率</view>
                </view>
                <view class="data-item">
                    <view class="data-value">{{ detail.cityCoverage }}%</view>
                    <view class="data-label">城市覆盖率</view>
                </view>
                <view class="data-item">
                    <view class="data-value">{{ detail.popularity }}</view>
                    <view class="data-label">品牌热度</view>
                </view>
            </view>
        </view>

        <!-- franchise-conditions-section -->
        <view class="franchise-conditions-section">
            <!-- header -->
            <view class="header">
                <!-- title -->
                <view class="title">加盟条件</view>
            </view>

            <!-- content-wrapper -->
            <view class="content-wrapper">
                <!-- left -->
                <view class="left">
                    <!-- initial-investment -->
                    <view class="condition-card">
                        <view class="card-label">前期投入</view>
                        <view class="card-value investment-value">{{ detail.initialInvestment }}</view>
                    </view>

                    <!-- area -->
                    <view class="condition-card">
                        <view class="card-label">店铺面积</view>
                        <view class="card-value">{{ detail.storeArea }}</view>
                    </view>

                    <!-- required-workers -->
                    <view class="condition-card">
                        <view class="card-label">所需人工</view>
                        <view class="card-value">{{ detail.staffCount }}</view>
                    </view>
                </view>

                <!-- right -->
                <view class="right">
                    <!-- chart-pane -->
                    <view class="chart-pane">
                        <!-- Canvas 环形图 -->
                        <canvas class="doughnut-canvas" canvas-id="doughnutChart"
                            @touchstart="handleCanvasTouch"></canvas>
                    </view>
                </view>
            </view>
        </view>

        <!-- 品牌介绍 -->
        <view class="intro-section">
            <view class="section-title">品牌介绍</view>
            <view class="intro-content" v-html="formattedIntroduction"></view>
        </view>

        <!-- 底部按钮 -->
        <view class="bottom-btn" @click="getJoinPlan">获取加盟方案</view>

        <!-- 底部安全区 -->
        <view class="safe-area-bottom"></view>
        <!-- 加盟申请表单弹窗 -->
        <view v-if="showJoinModal" class="join-modal-overlay" @click="closeJoinModal">
            <view class="join-modal-content" @click.stop>
                <view class="modal-header">
                    <text class="modal-title">申请加盟方案</text>
                    <view class="close-btn" @click="closeJoinModal">
                        <text class="close-icon">×</text>
                    </view>
                </view>

                <view class="modal-body">
                    <view class="form-item">
                        <text class="form-label">姓名</text>
                        <input class="form-input" v-model="joinForm.name" placeholder="请输入您的姓名"
                            placeholder-style="color: #C0C0C0;" />
                    </view>

                    <view class="form-item">
                        <text class="form-label">手机号</text>
                        <input class="form-input" v-model="joinForm.phone" placeholder="请输入您的手机号"
                            placeholder-style="color: #C0C0C0;" type="number" maxlength="11" />
                    </view>
                </view>

                <view class="modal-footer">
                    <button class="cancel-btn" @click="closeJoinModal">取消</button>
                    <button class="submit-btn" @click="submitJoinForm">提交申请</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { deleteCollect, getCollectStatus, getFranchiseInfo } from '@/api/group.js'
import { addCollect } from '@/api/group'

export default {
    name: 'FranchiseDetailPage',
    computed: {
        // 格式化品牌介绍，将 \n 转换为 <br>
        formattedIntroduction() {
            return this.detail.introduction.replace(/\n/g, '<br>')
        }
    },
    data() {
        return {
            id: 0,
            mediaType: 'vr', // 媒体类型：vr, photo, video
            isFollowed: false, // 是否已关注
            isFavorited: false, // 是否已收藏
            canvasContext: null, // Canvas 上下文
            showJoinModal: false, // 是否显示加盟申请表单弹窗
            detail: {
                name: '瑞幸咖啡',
                logo: '/static/images/index/business-info/luckin_coffee.png',
                category: '甜点饮品 | 咖啡',
                company: '瑞幸咖啡（中国）有限公司',
                fee: '12万~18万',
                storeCount: '22563',
                years: '9',
                avgCost: '19.0',
                satisfaction: '3.0',
                provinceCount: '32',
                cityCount: '328',
                provinceCoverage: '14.9',
                cityCoverage: '5.9',
                popularity: '6.6',
                initialInvestment: '30~100万',
                storeArea: '80~150㎡',
                staffCount: '8~12',
                costBreakdown: [
                    { name: '开店费', color: '#93A0FE' },
                    { name: '装修费', color: '#6CD8AB' },
                    { name: '设备费', color: '#57E4F5' },
                    { name: '原料费', color: '#0072E3' },
                    { name: '保证金', color: '#FBA36E' },
                    { name: '管理费', color: '#79BCFF' }
                ],
                images: [
                    '/static/images/index/business-info/banner.png',
                    '/static/images/index/business-info/banner.png',
                    '/static/images/index/business-info/banner.png'
                ],
                introduction: 'luckin coffee（瑞幸咖啡）总部位于厦门，是中国最大的连锁咖啡品牌。\n瑞幸咖啡以"让每个人都能轻松享受一杯好咖啡到、喝得值的好咖啡"为品牌愿景，以"创造一个源自中国的世界级咖啡品牌"为品牌使命。'
            }
        }
    },
    onLoad(options) {
        // 获取传递的参数
        if (options.id) {
            this.id = parseInt(options.id)
            // 根据ID获取详情数据
            this.getDetailById(this.id)
            this.checkFollowedStatus(this.id)
        }
    },
    onReady() {
        // 页面渲染完成后初始化图表
        this.$nextTick(() => {
            this.initDoughnutChart()
        })
    },
    methods: {
        // 初始化环形图
        initDoughnutChart() {
            try {
                // 获取 Canvas 上下文
                this.canvasContext = uni.createCanvasContext('doughnutChart', this)

                // 画布尺寸
                const canvasWidth = 213 // 426rpx / 2
                const canvasHeight = 149 // 298rpx / 2
                const centerX = canvasWidth / 2
                const centerY = canvasHeight / 2
                const outerRadius = 45 // 减小外半径，为文字留更多空间
                const innerRadius = 22 // 减小内半径，保持比例

                // 数据配置
                const data = [
                    { name: '开店费', value: 16.7, color: '#93A0FE' },
                    { name: '装修费', value: 16.7, color: '#6CD8AB' },
                    { name: '设备费', value: 16.7, color: '#57E4F5' },
                    { name: '原料费', value: 16.7, color: '#0072E3' },
                    { name: '保证金', value: 16.7, color: '#FBA36E' },
                    { name: '管理费', value: 16.5, color: '#79BCFF' }
                ]

                // 计算总值
                const total = data.reduce((sum, item) => sum + item.value, 0)

                // 绘制环形图
                let currentAngle = -Math.PI / 2 // 从顶部开始

                data.forEach((item) => {
                    const angle = (item.value / total) * 2 * Math.PI

                    // 绘制扇形
                    this.canvasContext.beginPath()
                    this.canvasContext.setFillStyle(item.color)
                    this.canvasContext.moveTo(centerX, centerY)
                    this.canvasContext.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + angle)
                    this.canvasContext.fill()

                    // 绘制内圆（创建环形效果）
                    this.canvasContext.beginPath()
                    this.canvasContext.setFillStyle('#FFFFFF')
                    this.canvasContext.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI)
                    this.canvasContext.fill()

                    // 绘制标签和连接线
                    const labelAngle = currentAngle + angle / 2

                    // 绘制折线连接线 - 减少线长度
                    const startX = centerX + Math.cos(labelAngle) * outerRadius
                    const startY = centerY + Math.sin(labelAngle) * outerRadius
                    const midX = centerX + Math.cos(labelAngle) * (outerRadius + 8) // 减少第一段长度
                    const midY = centerY + Math.sin(labelAngle) * (outerRadius + 8)

                    // 根据角度决定标签位置和折线方向 - 减少水平线长度
                    let labelX, labelY
                    if (Math.cos(labelAngle) > 0) {
                        // 右侧
                        labelX = midX + 12 // 减少水平线长度
                        labelY = midY
                    } else {
                        // 左侧
                        labelX = midX - 12 // 减少水平线长度
                        labelY = midY
                    }

                    this.canvasContext.beginPath()
                    this.canvasContext.setStrokeStyle(item.color)
                    this.canvasContext.setLineWidth(1)
                    // 第一段：从圆形到中间点
                    this.canvasContext.moveTo(startX, startY)
                    this.canvasContext.lineTo(midX, midY)
                    // 第二段：水平线到标签
                    this.canvasContext.lineTo(labelX, labelY)
                    this.canvasContext.stroke()

                    // 绘制标签文字 - 优化文字位置和大小
                    this.canvasContext.setFillStyle('#000000')
                    this.canvasContext.setFontSize(9) // 稍微减小字体

                    // 根据位置调整文字对齐，确保文字在画布范围内
                    const textWidth = item.name.length * 9 // 估算文字宽度

                    if (Math.cos(labelAngle) > 0) {
                        // 右侧标签
                        const textX = Math.min(labelX + 3, canvasWidth - textWidth - 5) // 确保不超出右边界
                        this.canvasContext.fillText(item.name, textX, labelY + 2)
                    } else {
                        // 左侧标签
                        const textX = Math.max(labelX - textWidth + 5, 5) // 确保不超出左边界
                        this.canvasContext.fillText(item.name, textX, labelY + 2)
                    }

                    currentAngle += angle
                })

                // 执行绘制
                this.canvasContext.draw()

            } catch (error) {
                console.error('初始化图表失败:', error)
            }
        },

        // 处理 Canvas 触摸事件
        handleCanvasTouch(e) {
            console.log('Canvas touched', e)
        },

        // 返回上一页
        goBack() {
            uni.navigateBack()
        },

        // 根据ID获取详情数据
        async getDetailById(id) {
            try {
                console.log('获取ID为', id, '的加盟详情')

                const response = await getFranchiseInfo(id)

                if (response.status === 200 && response.data) {
                    const data = response.data

                    // 解析JSON字符串字段
                    let enterpriseInfo = {}
                    let brandData = {}
                    let joinCondition = {}

                    try {
                        enterpriseInfo = data.enterprise_info ? JSON.parse(data.enterprise_info) : {}
                        brandData = data.brand_data ? JSON.parse(data.brand_data) : {}
                        joinCondition = data.join_condition ? JSON.parse(data.join_condition) : {}
                    } catch (e) {
                        console.error('解析JSON数据失败:', e)
                    }

                    // 映射API数据到页面数据结构
                    this.detail = {
                        ...this.detail,
                        name: data.title || this.detail.name,
                        logo: data.image || this.detail.logo,
                        category: data.tags || this.detail.category,
                        company: data.join_enterprises || this.detail.company,
                        images: data.images ? data.images.split(',') : this.detail.images,
                        franchiseFee: data.franchise_fee || this.detail.franchiseFee,
                        introduction: data.intro || this.detail.introduction,
                        detail: data.detail || this.detail.detail,
                        multipleType: data.multiple_type || this.detail.multipleType,
                        video: data.video || this.detail.video,
                        vr: data.vr || this.detail.vr,

                        // 解析后的企业信息（匹配模板字段名）
                        storeCount: enterpriseInfo['已有门店'] || brandData['现有门店'] || this.detail.storeCount,
                        years: enterpriseInfo['成立时间'] || this.detail.years,
                        avgCost: enterpriseInfo['平均消费'] || this.detail.avgCost,
                        satisfaction: enterpriseInfo['品牌热度'] || brandData['品牌热度'] || this.detail.satisfaction,

                        // 解析后的品牌数据（匹配模板字段名）
                        provinceCount: brandData['覆盖省份'] || this.detail.provinceCount,
                        cityCount: brandData['覆盖城市'] || this.detail.cityCount,
                        provinceCoverage: brandData['省份覆盖率'] || this.detail.provinceCoverage,
                        cityCoverage: brandData['城市覆盖率'] || this.detail.cityCoverage,
                        popularity: brandData['品牌热度'] || enterpriseInfo['品牌热度'] || this.detail.popularity,

                        // 解析后的加盟条件（匹配模板字段名）
                        initialInvestment: joinCondition['前期投入'] || this.detail.initialInvestment,
                        storeArea: joinCondition['店铺面积'] || this.detail.storeArea,
                        staffCount: joinCondition['所需人工'] || this.detail.staffCount,

                        // 区域信息
                        districtName: data.district_name || this.detail.districtName,
                        communityName: data.community_name || this.detail.communityName,
                        siteName: data.site_name || this.detail.siteName
                    }

                    console.log('加盟详情加载成功:', this.detail)
                } else {
                    console.error('获取加盟详情失败:', response.msg)
                    uni.showToast({
                        title: response.msg || '获取详情失败',
                        icon: 'none'
                    })
                }
            } catch (error) {
                console.error('获取加盟详情异常:', error)
                uni.showToast({
                    title: '网络错误，请稍后重试',
                    icon: 'none'
                })
            }
        },

        // 切换媒体类型
        switchMediaType(type) {
            this.mediaType = type
        },

        // 获取活动标签位置
        getActiveTabPosition() {
            // controller-section总宽度：336rpx
            // 每个tab宽度：336rpx / 3 = 112rpx
            // controller-active-bg宽度：112rpx
            if (this.mediaType === 'vr') return 0
            if (this.mediaType === 'photo') return 112 // 第二个位置
            if (this.mediaType === 'video') return 224 // 第三个位置 112 * 2
            return 0
        },

        // 显示预览
        showPreview() {
            uni.showToast({
                title: '预览功能开发中',
                icon: 'none'
            })
        },

        // 切换收藏状态
        toggleFavorite() {
            this.isFavorited = !this.isFavorited
            uni.showToast({
                title: this.isFavorited ? '已收藏' : '已取消收藏',
                icon: 'success'
            })
        },

        // 分享信息
        shareInfo() {
            uni.showActionSheet({
                itemList: ['分享到微信', '分享到朋友圈', '分享到QQ'],
                success: function (res) {
                    uni.showToast({
                        title: '已选择' + (res.tapIndex + 1) + '分享方式',
                        icon: 'none'
                    })
                }
            })
        },

        // 显示更多选项
        showMoreOptions() {
            uni.showActionSheet({
                itemList: ['举报', '不感兴趣'],
                success: function (res) {
                    console.log('选择了第' + (res.tapIndex + 1) + '个选项')
                }
            })
        },

        // 切换关注状态
        async toggleFollow() {
            this.isFollowed = !this.isFollowed
            if (!this.isFollowed) {
                // 取消关注
                await deleteCollect({
                    type: 2,
                    sub_type: 1,
                    fav_id: this.id
                })
                await this.$store.dispatch('REFRESH_USERINFO')
                uni.showToast({
                    title: '已取消关注',
                    icon: 'none'
                })
            } else {
                // 添加关注
                await addCollect({
                    type: 2,
                    sub_type: 1,
                    fav_id: this.id
                })
                console.log(this.$store)

                await this.$store.dispatch('REFRESH_USERINFO')
                uni.showToast({
                    title: this.isFollowed ? '已关注' : '已取消关注',
                    icon: 'none'
                })
            }
        },

        // 获取加盟方案
        getJoinPlan() {
            uni.showModal({
                title: '获取加盟方案',
                content: '我们将联系您提供详细的加盟方案',
                success: (res) => {
                    if (res.confirm) {
                        uni.showToast({
                            title: '申请已提交，我们会尽快联系您',
                            icon: 'none'
                        })
                    }
                }
            })
        },
        async checkFollowedStatus(id) {
            const res = await getCollectStatus({
                type: 2,
                sub_type: 1,
                fav_id: id
            })
            this.isFollowed = !!res.data.is_collected

        }
    }
}
</script>

<style lang="scss">
page {
    background: #F5F5F5;
}

.franchise-detail-page {
    min-height: 100vh;
    background: #F5F5F5;
    position: relative;
    display: flex;
    flex-direction: column;
}

/* header-section */
.header-section {
    width: 750rpx;
    /* 375px * 2 */
    height: 500rpx;
    /* 调整高度，移除状态栏高度 */
    position: relative;
    background: #D9D9D9;
    overflow: hidden;
    flex-shrink: 0;
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
    top: 20rpx;
    /* 调整顶部按钮位置 */
    left: 0;
    right: 0;
    height: 96rpx;
    /* 48px * 2 */
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24rpx;
    /* 12px * 2 */
    z-index: 15;

    .back-btn {
        width: 42rpx;
        /* 21px * 2 */
        height: 42rpx;
        /* 21px * 2 */
        display: flex;
        align-items: center;
        justify-content: center;

        .back-icon {
            width: 22.6rpx;
            /* 11.3px * 2 */
            height: 42rpx;
            /* 21px * 2 */
            filter: brightness(0) invert(1);
            /* 将图标变为白色 */
        }
    }

    .action-btns {
        display: flex;
        align-items: center;
        gap: 20rpx;
        /* 10px * 2 */

        .favorites-btn {
            width: 42rpx;
            /* 21px * 2 */
            height: 42rpx;
            /* 21px * 2 */
            display: flex;
            align-items: center;
            justify-content: center;

            .star-icon {
                font-size: 54rpx;
                /* 18px * 2 - 调整为与其他图标相似大小 */
                color: #FFFFFF;
                line-height: 1;
                text-align: center;
                margin-bottom: 6rpx;
                margin-right: 16rpx;
            }
        }

        .share-btn {
            width: 42rpx;
            /* 21px * 2 */
            height: 42rpx;
            /* 21px * 2 */
            display: flex;
            align-items: center;
            justify-content: center;

            .share-icon {
                width: 42rpx;
                /* 21px * 2 */
                height: 42rpx;
                /* 21px * 2 */
            }
        }
    }
}

/* preview-controller-button */
.preview-controller-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 78rpx;
    /* 39px * 2 */
    height: 78rpx;
    /* 39px * 2 */
    z-index: 5;
    cursor: pointer;
}

.controller-outer-circle {
    width: 78rpx;
    /* 39px * 2 */
    height: 78rpx;
    /* 39px * 2 */
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.controller-inner-circle {
    width: 38rpx;
    /* 19px * 2 */
    height: 38rpx;
    /* 19px * 2 */
    border: 2rpx solid #FFFFFF;
    /* 1px * 2 */
    border-radius: 50%;
    box-sizing: border-box;
}

/* controller-section */
.controller-section {
    position: absolute;
    bottom: 46rpx;
    /* 23px * 2 */
    left: 50%;
    transform: translateX(-50%);
    width: 336rpx;
    /* 168px * 2 */
    height: 42rpx;
    /* 21px * 2 */
    z-index: 10;
}

.controller-background {
    position: relative;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.85);
    border-radius: 21rpx;
    /* 10.5px * 2 */
    display: flex;
    align-items: center;
}

.controller-active-bg {
    position: absolute;
    width: 112rpx;
    /* 56px * 2 */
    height: 42rpx;
    /* 21px * 2 */
    background: #FE9227;
    border-radius: 21rpx;
    /* 10.5px * 2 */
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
        font-size: 20rpx;
        /* 10px * 2 */
        line-height: 28rpx;
        /* 14px * 2 */
        color: #666666;
        transition: color 0.3s ease;
    }

    &.active .tab-text {
        color: #FFFFFF;
    }
}

/* business-brand-profile-section */
.business-brand-profile-section {
    width: 750rpx;
    /* 375px * 2 */
    height: 356rpx;
    /* 178px * 2 */
    background: #FFFFFF;
    border-radius: 8rpx 8rpx 0px 0px;
    /* 4px * 2 */
    position: relative;
    padding: 20rpx 24rpx;
    /* 统一的内边距：上下10px，左右12px */
    box-sizing: border-box;
    flex-shrink: 0;
}

/* top-section */
.top-section {
    width: 100%;
    /* 使用100%宽度 */
    height: 168rpx;
    /* 84px * 2 */
    position: relative;
    display: flex;
    align-items: flex-start;
    margin-bottom: 20rpx;
    /* 与bottom-section的间距 */
}

/* logo */
.logo {
    width: 154rpx;
    /* 77px * 2 */
    height: 154rpx;
    /* 77px * 2 */
    border-radius: 8rpx;
    /* 4px * 2 */
    overflow: hidden;
    margin-right: 20rpx;
    /* 间距 */

    .brand-logo {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

/* Frame 268 - 品牌信息 */
.brand-info-frame {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16rpx;
    /* 8px * 2 */
    width: 336rpx;
    /* 168px * 2 */
    height: 168rpx;
    /* 84px * 2 */
    flex: 1;

    .brand-name {
        width: 336rpx;
        /* 168px * 2 */
        height: 56rpx;
        /* 28px * 2 */
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 40rpx;
        /* 20px * 2 */
        line-height: 56rpx;
        /* 28px * 2 */
        color: #333333;

        /* 单行显示，超出省略 */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .brand-category {
        width: 336rpx;
        /* 168px * 2 */
        height: 40rpx;
        /* 20px * 2 */
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 28rpx;
        /* 14px * 2 */
        line-height: 40rpx;
        /* 20px * 2 */
        color: #666666;

        /* 单行显示，超出省略 */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .brand-company {
        width: 336rpx;
        /* 168px * 2 */
        height: 40rpx;
        /* 20px * 2 */
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 28rpx;
        /* 14px * 2 */
        line-height: 40rpx;
        /* 20px * 2 */
        color: #666666;

        /* 单行显示，超出省略 */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}

/* follow-button */
.follow-button {
    width: 136rpx;
    /* 68px * 2 */
    height: 52rpx;
    /* 26px * 2 */
    background: linear-gradient(90deg, #FF7E00 0%, #FDA44D 100%);
    border-radius: 44rpx;
    /* 22px * 2 */
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0;
    top: 2rpx;
    /* 微调位置 */

    .follow-text {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 36rpx;
        /* 18px * 2 */
        line-height: 50rpx;
        /* 25px * 2 */
        text-align: center;
        color: #FFFFFF;
    }

    &.followed {
        background: #F5F5F5;

        .follow-text {
            color: #666666;
        }
    }
}

/* bottom-section */
.bottom-section {
    width: 100%;
    /* 使用100%宽度 */
    height: 128rpx;
    /* 64px * 2 */
    background: #F7F7F7;
    border-radius: 8rpx;
    /* 4px * 2 */
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Frame 245 - 指标容器 */
.metrics-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 76rpx;
    /* 38px * 2 */
    width: 686rpx;
    /* 343px * 2 */
    height: 86rpx;
    /* 43px * 2 */
}

.metric-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;

    .metric-value {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 32rpx;
        /* 16px * 2 */
        line-height: 40rpx;
        /* 20px * 2 */
        color: #FE9227;
        margin-bottom: 6rpx;

        /* 单行显示，超出省略 */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        display: block;
    }

    .metric-label {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 22rpx;
        /* 11px * 2 */
        line-height: 40rpx;
        /* 20px * 2 */
        color: #808080;

        /* 单行显示，超出省略 */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        display: block;
    }
}

.data-section {
    width: 750rpx;
    /* 375px * 2 */
    background: #FFFFFF;
    padding: 20rpx 24rpx;
    margin-top: 20rpx;
    flex-shrink: 0;
}

.section-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;
    margin-bottom: 20rpx;
}

.data-grid {
    display: flex;
    flex-wrap: wrap;

    .data-item {
        width: 33.33%;
        text-align: center;
        margin-bottom: 20rpx;

        .data-value {
            font-size: 32rpx;
            font-weight: bold;
            color: #333333;
            margin-bottom: 6rpx;

            /* 单行显示，超出省略 */
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            display: block;
        }

        .data-label {
            font-size: 24rpx;
            color: #999999;

            /* 单行显示，超出省略 */
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            display: block;
        }
    }
}

/* franchise-conditions-section */
.franchise-conditions-section {
    width: 750rpx;
    /* 375px * 2 */
    background: #FFFFFF;
    padding: 20rpx 24rpx;
    margin-top: 20rpx;
    flex-shrink: 0;
}

/* header */
.header {
    display: flex;
    align-items: center;
}

/* title */
.title {
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 28rpx;
    /* 14px * 2 */
    line-height: 40rpx;
    /* 20px * 2 */
    color: #333333;
}

/* content-wrapper - 左右布局 */
.content-wrapper {
    display: flex;
    gap: 30rpx;
    /* 15px * 2 */
    align-items: flex-start;
}

/* left */
.left {
    flex: 0 0 200rpx;
    /* 增加宽度 100px * 2 */
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    /* 10px * 2 */
    padding: 10rpx;
    /* 恢复适当的内边距 */
}

/* condition-card */
.condition-card {
    background: #F7F7F7;
    border-radius: 8rpx;
    /* 4px * 2 */
    padding: 12rpx 16rpx;
    /* 6px 8px * 2 */
    min-height: 86rpx;
    /* 最小高度 43px * 2 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    box-sizing: border-box;
}

/* card-label */
.card-label {
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 24rpx;
    /* 12px * 2 */
    line-height: 32rpx;
    /* 16px * 2 */
    color: #999999;
    margin-bottom: 6rpx;
    /* 3px * 2 */
    white-space: nowrap;
    width: 100%;
    text-align: center;
    overflow: hidden;
    /* 隐藏超出部分 */
    text-overflow: ellipsis;
    /* 显示省略号 */
}

/* card-value */
.card-value {
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 28rpx;
    /* 14px * 2 */
    line-height: 36rpx;
    /* 18px * 2 */
    color: #333333;
    white-space: nowrap;
    width: 100%;
    text-align: center;
    overflow: hidden;
    /* 隐藏超出部分 */
    text-overflow: ellipsis;
    /* 显示省略号 */
}

/* investment-value (特殊样式用于前期投入) */
.investment-value {
    color: #FDA046;
}

/* right */
.right {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    height: 298rpx;
    /* 与左侧高度完全一致 */
}

/* chart-pane */
.chart-pane {
    width: 426rpx;
    /* 213px * 2 */
    height: 298rpx;
    /* 与左侧高度完全一致 */
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Canvas 环形图 */
.doughnut-canvas {
    width: 426rpx;
    /* 213px * 2 */
    height: 298rpx;
    /* 149px * 2 - 与左侧高度完全一致 */
    background: transparent;
}

.intro-section {
    width: 750rpx;
    /* 375px * 2 */
    background: #FFFFFF;
    padding: 20rpx 24rpx;
    margin-top: 20rpx;
    margin-bottom: 160rpx;
    /* 为底部按钮留出空间 */
    flex: 1;
}

.section-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;
    margin-bottom: 20rpx;
}

.intro-content {
    font-size: 28rpx;
    color: #666666;
    line-height: 1.6;
    word-wrap: break-word;
    word-break: break-all;
    white-space: normal;
    text-align: justify;
}

.bottom-btn {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100rpx;
    background: linear-gradient(90deg, #FF7E00 0%, #FDA44D 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    font-size: 32rpx;
    font-weight: 500;
    padding-bottom: env(safe-area-inset-bottom);
    z-index: 100;
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
