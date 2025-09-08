<template>
	<view :style="colorStyle">
		<view class="after-sales-detail">
			<!-- 顶部栏 -->
			<view class="header">
				<view class="back" @click="goBack">
					<text class="iconfont icon-fanhui"></text>
					<text class="back-text">返回</text>
				</view>
				<view class="title-container">
					<text class="title">售后详情</text>
				</view>
				<view class="header-right-space"></view>
			</view>

			<!-- 加载状态 -->
			<view class="loading-container" v-if="loading">
				<text class="loading-text">加载中...</text>
			</view>

			<!-- 售后进度竖向步骤条 -->
			<view class="step-card" v-if="detail">
				<view class="step-line-container">
					<view class="step-line" :style="{ background: stepLineStyle }"></view>
				</view>
				<view class="step-list">
					<!-- 步骤1：申请售后 -->
					<view class="step-item">
						<view class="step-dot">
							<view class="dot orange"></view>
						</view>
						<view class="step-content">
							<view class="step-title orange">申请售后</view>
							<view class="desc gray">申请时间: {{ detail.create_time_text || '-' }}</view>
						</view>
					</view>

					<!-- 步骤2：处理中 -->
					<view class="step-item">
						<view class="step-dot">
							<view class="dot" :class="step2DotClass"></view>
						</view>
						<view class="step-content">
							<view class="step-title" :class="step2TitleClass">处理中</view>

							<view class="countdown" v-if="showStep2Countdown">{{ countdown }}</view>

							<view class="desc orange" v-if="step <= 2">{{ step2Desc }}</view>

							<view class="desc gray" v-if="detail.processed_at_text">
								处理时间: {{ detail.processed_at_text }}
							</view>
						</view>
					</view>

					<!-- 步骤3：最终状态 -->
					<view class="step-item">
						<view class="step-dot">
							<view class="dot" :class="step3DotClass"></view>
						</view>
						<view class="step-content">
							<view class="step-title" :class="step3TitleClass">
								{{ step3Title }}
							</view>

							<view class="desc gray" v-if="step === 3">{{ step3Desc }}</view>

							<view class="desc gray" v-if="detail.completed_at_text">
								完成时间: {{ detail.completed_at_text }}
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 商品卡片 -->
			<view class="goods-box" v-if="detail">
				<view class="goods-title-row">售后商品</view>

				<view class="site-row">
					<text class="site-label">收货站点：</text>
					<text class="site-value">{{ detail.community_name || '-' }}</text>
					<view class="site-row-spacer"></view>
					<text class="iconfont icon-dingwei"></text>
				</view>

				<view class="site-row">
					<text class="site-label">售后单号：</text>
					<text class="site-value">{{ detail.after_sales_no || '-' }}</text>
				</view>

				<view class="goods-item">
					<image class="goods-img"
						:src="detail.problem_images && detail.problem_images.length > 0 ? detail.problem_images[0] : '/static/images/default-goods.png'"
						mode="aspectFill"></image>
					<view class="goods-info">
						<view class="goods-info-top">
							<text class="goods-name">{{ detail.product_title || '-' }}</text>
							<text class="goods-qty">x1</text>
						</view>
						<view class="goods-desc">问题描述：{{ detail.problem_description || '无' }}</view>
						<view class="goods-info-bottom">
							<text class="goods-price">￥{{ detail.price || 35 }}</text>
						</view>
					</view>
				</view>

				<!-- 问题图片展示 -->
				<view class="images-container" v-if="detail.problem_images && detail.problem_images.length > 0">
					<view class="images-title">问题图片：</view>
					<view class="images-list">
						<image v-for="(img, index) in detail.problem_images" :key="index" :src="img"
							class="problem-image" mode="aspectFill" @click="previewImage(img, detail.problem_images)">
						</image>
					</view>
				</view>
			</view>

			<view class="submit-tip-btn" v-if="step === 1 && showTip">
				已经提交申请
			</view>
		</view>
	</view>
</template>

<script>
import home from '@/components/home'
import { getAfterSalesDetail } from '@/api/group.js'
import { toLogin } from '@/libs/login.js'
import { mapGetters } from "vuex"
import colors from '@/mixins/color.js'

export default {
	components: {
		home
	},
	mixins: [colors],
	data() {
		return {
			aftersales_id: '',
			detail: null,
			loading: false,
			step: 1, // 默认高亮第一步
			countdown: '', // 倒计时显示
			showTip: true, // 控制提示信息显示
			remainingTime: null, // 存储剩余时间
			countdownTimer: null // 倒计时定时器
		}
	},
	computed: {
		...mapGetters(['isLogin']),
		// 步骤条线条样式
		stepLineStyle() {
			if (this.step === 1) {
				return 'linear-gradient(to bottom, #ff9900 0%, #ff9900 30%, #cccccc 30%, #cccccc 100%)'
			} else if (this.step === 2) {
				return 'linear-gradient(to bottom, #ff9900 0%, #ff9900 65%, #cccccc 65%, #cccccc 100%)'
			} else {
				return 'linear-gradient(to bottom, #ff9900 0%, #ff9900 100%)'
			}
		},
		// 步骤2的显示条件（是否显示倒计时）
		showStep2Countdown() {
			return this.detail && [1, 2].includes(this.detail.status)
		},
		// 步骤2的提示文本
		step2Desc() {
			if (this.step === 1) {
				return '您已成功发起售后申请，请耐心等待团长响应'
			} else if (this.step === 2) {
				return '团长已受理，正在处理您的售后需求'
			}
			return ''
		},
		// 步骤3的状态文本（已解决/已关闭）
		step3Title() {
			if (!this.detail) return '售后已完成'
			return this.detail.status === 3 ? '已解决' : this.detail.status === 4 ? '已关闭' : '售后已完成'
		},
		// 步骤3的提示文本
		step3Desc() {
			if (!this.detail || this.step < 3) return ''
			return this.detail.status === 3 ? '您的售后问题已解决' : '您的售后申请已关闭'
		},
		// 步骤2/3的圆点样式（橙色/灰色）
		step2DotClass() {
			return this.step >= 2 ? 'orange' : 'gray'
		},
		step3DotClass() {
			return this.step === 3 ? 'orange' : 'gray'
		},
		// 步骤2/3的标题样式（橙色/灰色）
		step2TitleClass() {
			return this.step >= 2 ? 'orange' : 'gray'
		},
		step3TitleClass() {
			return this.step === 3 ? 'orange' : 'gray'
		}
	},
	onLoad(options) {
		if (options.id) {
			this.aftersales_id = options.id
			// 清除旧的倒计时缓存
			this.clearCountdownCache()
			if (this.isLogin) {
				this.getDetail()
			} else {
				toLogin()
			}
		}
	},
	methods: {
		// 返回上一页
		goBack() {
			uni.navigateBack()
		},

		// 清除当前售后单的倒计时缓存
		clearCountdownCache() {
			if (this.aftersales_id) {
				const storageKey = `afterSalesCountdown_${this.aftersales_id}`
				uni.removeStorageSync(storageKey)
				console.log('已清除倒计时缓存:', storageKey)
			}
		},

		getDetail() {
			this.loading = true
			uni.showLoading({ title: this.$t(`加载中`) })
			getAfterSalesDetail(this.aftersales_id).then(res => {
				this.detail = res.data || {} // 确保 detail 不为 null
				this.loading = false
				uni.hideLoading()

				if (this.detail && this.detail.status) {
					// 设置步骤状态
					switch (this.detail.status) {
						case 1: // 待处理 → 高亮第一步
							this.step = 1
							break
						case 2: // 处理中 → 高亮第二步
							this.step = 2
							break
						case 3: // 已解决 → 高亮第三步
						case 4: // 已关闭 → 高亮第三步（最终状态）
							this.step = 3
							break
						default: // 异常状态默认回退到第一步
							this.step = 1
					}

					// 处理倒计时
					if ([1, 2].includes(this.detail.status) && this.detail.create_time_text) {
						this.initCountdown()
					} else {
						this.countdown = '' // 清空倒计时
						if (this.countdownTimer) clearInterval(this.countdownTimer)
					}

					// 3秒后隐藏"已提交申请"提示
					setTimeout(() => { this.showTip = false }, 3000)
				}
			}).catch(error => {
				this.loading = false
				uni.hideLoading()
				console.error('获取售后详情失败:', error)
				// 可以添加错误提示
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				})
			})
		},

		// 初始化倒计时（强制24小时计算）
		initCountdown() {
			// 检查必要的数据
			if (!this.detail || !this.detail.create_time_text) {
				return
			}

			// 计算24小时倒计时（不使用缓存）
			const createTimestamp = new Date(this.detail.create_time_text.replace(/-/g, '/')).getTime()
			const endTimestamp = createTimestamp + 24 * 60 * 60 * 1000 // ⚠️ 改为24小时
			const now = new Date().getTime()
			this.remainingTime = endTimestamp - now

			console.log('倒计时计算详情:', {
				申请时间: this.detail.create_time_text,
				申请时间戳: createTimestamp,
				结束时间戳: endTimestamp,
				当前时间戳: now,
				剩余毫秒: this.remainingTime,
				剩余小时: Math.floor(this.remainingTime / (60 * 60 * 1000))
			})

			if (this.remainingTime <= 0) {
				this.countdown = '0时0分0秒'
				return
			}

			this.updateCountdownDisplay()
			this.startCountdown()
		},

		// 更新倒计时显示
		updateCountdownDisplay() {
			if (this.remainingTime <= 0) {
				this.countdown = '0时0分0秒'
				return
			}

			const hours = Math.floor(this.remainingTime / (60 * 60 * 1000))
			const minutes = Math.floor((this.remainingTime % (60 * 60 * 1000)) / (60 * 1000))
			const seconds = Math.floor((this.remainingTime % (60 * 1000)) / 1000)
			this.countdown = `${hours}时${minutes}分${seconds}秒`
		},

		// 启动倒计时
		startCountdown() {
			// 清除已有定时器
			if (this.countdownTimer) clearInterval(this.countdownTimer)

			// 仅在待处理/处理中状态启动定时器
			if (!this.detail || ![1, 2].includes(this.detail.status)) return

			this.countdownTimer = setInterval(() => {
				// 检查状态是否仍有效
				if (!this.detail || ![1, 2].includes(this.detail.status)) {
					clearInterval(this.countdownTimer)
					return
				}

				// 更新剩余时间
				this.remainingTime -= 1000

				// 保存到本地存储（24小时版本）
				const storageKey = `afterSalesCountdown_${this.aftersales_id}`
				uni.setStorageSync(storageKey, {
					remainingTime: this.remainingTime,
					expireTime: Date.now() + 24 * 60 * 60 * 1000, // 24小时有效期
					version: '24h' // 添加版本标识
				})

				// 更新显示
				this.updateCountdownDisplay()

				// 倒计时结束
				if (this.remainingTime <= 0) {
					clearInterval(this.countdownTimer)
					// 可以在这里添加倒计时结束后的逻辑
				}
			}, 1000)
		},

		// 预览图片
		previewImage(current, urls) {
			uni.previewImage({
				current,
				urls
			})
		}
	},
	// 页面卸载时清除定时器
	onUnload() {
		if (this.countdownTimer) {
			clearInterval(this.countdownTimer)
		}
	}
}
</script>

<style lang="scss" scoped>
.after-sales-detail {
	padding-bottom: 120rpx;
	padding-top: 120rpx;
}

.header {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	background-color: #fff;
	padding: 40rpx 30rpx 20rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	z-index: 10;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

	.back {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #333;
		width: 120rpx;

		.iconfont {
			font-size: 36rpx;
			margin-right: 10rpx;
		}

		.back-text {
			font-size: 30rpx;
			color: #333;
		}
	}

	.title-container {
		position: absolute;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		pointer-events: none;

		.title {
			font-size: 36rpx;
			font-weight: bold;
			color: #222;
			text-align: center;
		}
	}

	.header-right-space {
		width: 120rpx;
	}
}

.loading-container {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 100rpx 0;

	.loading-text {
		font-size: 28rpx;
		color: #999;
	}
}

.step-card {
	background: #fff;
	border-radius: 16rpx;
	margin: 24rpx 16rpx 0 16rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
	padding: 40rpx 30rpx;
	position: relative;
}

.step-line-container {
	position: absolute;
	left: 40rpx;
	top: 56rpx;
	bottom: 56rpx;
	width: 2rpx;
	z-index: 1;
}

.step-line {
	width: 2rpx;
	height: 100%;
	background: linear-gradient(to bottom, #ff9900 0%, #ff9900 50%, #cccccc 50%, #cccccc 100%);
}

.step-list {
	position: relative;
	z-index: 2;
}

.step-item {
	display: flex;
	align-items: flex-start;
	margin-bottom: 32rpx;
	position: relative;
}

.step-item:last-child {
	margin-bottom: 0;
}

.step-dot {
	width: 20rpx;
	height: 20rpx;
	margin-right: 20rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.dot {
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
	background: #cccccc;
	z-index: 3;
}

.dot.hollow {
	background: #fff;
	border: 2rpx solid #ff9900;
	box-sizing: border-box;
}

.dot.orange {
	background: #ff9900;
}

.dot.gray {
	background: #cccccc;
}

.step-content {
	flex: 1;
	padding-top: 0;
}

.step-title {
	font-size: 28rpx;
	color: #222;
	font-weight: bold;
	text-align: left;
}

.step-title.orange {
	color: #ff9900;
}

.step-title.gray {
	color: #bcbcbc;
}

.countdown {
	color: #ff6600;
	font-size: 24rpx;
	margin-top: 8rpx;
	text-align: left;
}

.desc {
	font-size: 24rpx;
	margin-top: 8rpx;
	max-width: 500rpx;
	line-height: 1.4;
	text-align: left;
}

.desc.orange {
	color: #ff9900;
}

.desc.gray {
	color: #999;
}

.goods-box {
	background: #fff;
	border-radius: 16rpx;
	margin: 24rpx 16rpx 0 16rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
	padding: 24rpx 20rpx 20rpx 20rpx;

	.goods-title-row {
		font-size: 30rpx;
		font-weight: bold;
		color: #222;
		margin-bottom: 18rpx;
		text-align: left;
	}

	.site-row {
		display: flex;
		align-items: center;
		margin-bottom: 18rpx;

		.site-label {
			color: #999;
			font-size: 26rpx;
			margin-right: 4rpx;
		}

		.site-value {
			color: #666;
			font-size: 26rpx;
			margin-right: 8rpx;
		}

		.site-row-spacer {
			flex: 1;
		}

		.iconfont {
			font-size: 24rpx;
			color: #bcbcbc;
		}
	}

	.goods-item {
		display: flex;
		align-items: flex-start;
		margin-bottom: 20rpx;

		.goods-img {
			width: 100rpx;
			height: 100rpx;
			border-radius: 8rpx;
			margin-right: 16rpx;
			background: #f7f7f7;
		}

		.goods-info {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.goods-info-top {
				display: flex;
				align-items: flex-start;
				justify-content: space-between;

				.goods-name {
					font-size: 28rpx;
					color: #222;
					font-weight: bold;
					flex: 1;
					margin-right: 8rpx;
					line-height: 1.2;
				}

				.goods-qty {
					font-size: 24rpx;
					color: #bcbcbc;
					font-weight: normal;
				}
			}

			.goods-desc {
				font-size: 24rpx;
				color: #999;
				margin: 8rpx 0 0 0;
				line-height: 1.4;
				text-align: left;
			}

			.goods-info-bottom {
				display: flex;
				justify-content: flex-end;
				align-items: center;

				.goods-price {
					font-size: 28rpx;
					color: #ff6600;
					font-weight: bold;
				}
			}
		}
	}

	.images-container {
		margin-top: 20rpx;

		.images-title {
			font-size: 26rpx;
			color: #999;
			margin-bottom: 10rpx;
			text-align: left;
		}

		.images-list {
			display: flex;
			flex-wrap: wrap;
			gap: 10rpx;
		}

		.problem-image {
			width: 120rpx;
			height: 120rpx;
			border-radius: 8rpx;
			background: #f7f7f7;
		}
	}
}

.submit-tip-btn {
	margin: 24rpx auto;
	background: #666666;
	color: #fff;
	border-radius: 16rpx;
	font-size: 28rpx;
	padding: 16rpx 48rpx;
	text-align: center;
	width: fit-content;
	min-width: 240rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}
</style>