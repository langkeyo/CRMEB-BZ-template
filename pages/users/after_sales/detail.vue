<template>
	<view :style="colorStyle">
		<view class="after-sales-detail">
			<!-- 顶部栏 -->
			<view class="header">
				<!-- 修改返回按钮点击事件 -->
				<view class="back" @click="goBack">
					<text class="iconfont icon-fanhui"></text>
					<text class="back-text">返回</text>
				</view>
				<view class="title-container">
					<text class="title">售后详情</text>
				</view>
				<view class="header-right-space"></view>
			</view>

			<!-- 售后进度竖向步骤条（修复后） -->
			<view class="step-card">
				<view class="step-line-container">
					<!-- 使用computed的stepLineStyle，替代模板中的复杂三元 -->
					<view class="step-line" :style="{ background: stepLineStyle }"></view>
				</view>
				<view class="step-list">
					<!-- 步骤1：申请售后（不变） -->
					<view class="step-item">
						<view class="step-dot">
							<view class="dot orange"></view>
						</view>
						<view class="step-content">
							<view class="step-title orange">申请售后</view>
						</view>
					</view>

					<!-- 步骤2：处理中（使用computed属性） -->
					<view class="step-item">
						<view class="step-dot">
							<!-- 使用computed的step2DotClass，替代模板中的条件判断 -->
							<view class="dot" :class="step2DotClass"></view>
						</view>
						<view class="step-content">
							<view class="step-title" :class="step2TitleClass">处理中</view>

							<!-- 使用computed的showStep2Countdown，替代detail?.status判断 -->
							<view class="countdown" v-if="showStep2Countdown">{{ countdown }}</view>

							<!-- 使用computed的step2Desc，替代模板中的条件文本 -->
							<view class="desc orange" v-if="step <= 2">{{ step2Desc }}</view>
						</view>
					</view>

					<!-- 步骤3：最终状态（使用computed属性） -->
					<view class="step-item">
						<view class="step-dot">
							<!-- 使用computed的step3DotClass -->
							<view class="dot" :class="step3DotClass"></view>
						</view>
						<view class="step-content">
							<view class="step-title" :class="step3TitleClass">
								<!-- 使用computed的step3Title，替代模板中的条件文本 -->
								{{ step3Title }}
							</view>

							<!-- 使用computed的step3Desc，替代模板中的条件文本 -->
							<view class="desc gray" v-if="step === 3">{{ step3Desc }}</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 商品卡片优化版 -->
			<view class="goods-box" v-if="detail">
				<view class="goods-title-row">售后商品</view>
				<!-- 收货站点行优化，定位icon放最右 -->
				<view class="site-row">
					<text class="site-label">收货站点：</text>
					<text class="site-value">{{ detail.community_name || '-' }}</text>
					<view class="site-row-spacer"></view>
					<text class="iconfont icon-dingwei"></text>
				</view>
				<view class="goods-item">
					<image class="goods-img"
						:src="detail.problem_images && detail.problem_images.length > 0 ? detail.problem_images[0] : ''"
						mode="aspectFill"></image>
					<view class="goods-info">
						<view class="goods-info-top">
							<text class="goods-name">{{ detail.product_title }}</text>
							<text class="goods-qty">x1</text>
						</view>
						<view class="goods-desc">{{ detail.problem_description }}</view>
						<view class="goods-info-bottom">
							<text class="goods-price">￥{{ detail.price || 35 }}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 灰色提示按钮 -->
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
			countdown: '23时56分28秒', // 示例倒计时
			showTip: true, // 控制提示信息显示
			remainingTime: null // 存储剩余时间
		}
	},
	computed: {
		...mapGetters(['isLogin']),
		// 1. 步骤条线条样式（替代模板中的复杂三元）
		stepLineStyle() {
			if (this.step === 1) {
				return 'linear-gradient(to bottom, #ff9900 0%, #ff9900 30%, #cccccc 30%, #cccccc 100%)'
			} else if (this.step === 2) {
				return 'linear-gradient(to bottom, #ff9900 0%, #ff9900 65%, #cccccc 65%, #cccccc 100%)'
			} else {
				return 'linear-gradient(to bottom, #ff9900 0%, #ff9900 100%)'
			}
		},
		// 2. 步骤2的显示条件（是否显示倒计时）
		showStep2Countdown() {
			return this.detail && [1, 2].includes(this.detail.status)
		},
		// 3. 步骤2的提示文本
		step2Desc() {
			if (this.step === 1) {
				return '您已成功发起售后申请，请耐心等待团长响应'
			} else if (this.step === 2) {
				return '团长已受理，正在处理您的售后需求'
			}
			return ''
		},
		// 4. 步骤3的状态文本（已解决/已关闭）
		step3Title() {
			if (!this.detail) return '售后已完成'
			return this.detail.status === 3 ? '已解决' : this.detail.status === 4 ? '已关闭' : '售后已完成'
		},
		// 5. 步骤3的提示文本
		step3Desc() {
			if (!this.detail || this.step < 3) return ''
			return this.detail.status === 3 ? '您的售后问题已解决' : '您的售后申请已关闭'
		},
		// 6. 步骤2/3的圆点样式（橙色/灰色）
		step2DotClass() {
			return this.step >= 2 ? 'orange' : 'gray'
		},
		step3DotClass() {
			return this.step === 3 ? 'orange' : 'gray'
		},
		// 7. 步骤2/3的标题样式（橙色/灰色）
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

		getDetail() {
			this.loading = true
			uni.showLoading({ title: this.$t(`加载中`) })
			getAfterSalesDetail(this.aftersales_id).then(res => {
				this.detail = res.data
				this.loading = false
				uni.hideLoading()

				if (this.detail) {
					// 关键：按新状态规则设置 step
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

					// 优化：仅“待处理/处理中”显示倒计时，最终状态不显示
					if ([1, 2].includes(this.detail.status) && this.detail.create_time_text) {
						this.calculateCountdown(this.detail.create_time_text)
					} else {
						this.countdown = '' // 清空倒计时
						if (this.countdownTimer) clearInterval(this.countdownTimer) // 停止定时器
					}

					// 3秒后隐藏“已提交申请”提示
					setTimeout(() => { this.showTip = false }, 3000)
				}
			}).catch(() => { })
		},

		calculateCountdown(createTimeText) {
			// 额外判断：仅“待处理/处理中”计算倒计时
			if (![1, 2].includes(this.detail.status)) return

			const createTimestamp = new Date(createTimeText.replace(/-/g, '/')).getTime()
			const endTimestamp = createTimestamp + 48 * 60 * 60 * 1000 // 假设48小时时限
			const now = new Date().getTime()
			const remaining = endTimestamp - now

			if (remaining <= 0) {
				this.countdown = '0时0分0秒'
				return
			}

			// 计算时分秒（逻辑不变）
			const hours = Math.floor(remaining / (60 * 60 * 1000))
			const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))
			const seconds = Math.floor((remaining % (60 * 1000)) / 1000)
			this.countdown = `${hours}时${minutes}分${seconds}秒`
			this.remainingTime = remaining

			this.startCountdown()
		},

		startCountdown() {
			// 额外判断：仅“待处理/处理中”启动定时器
			if (![1, 2].includes(this.detail.status)) {
				if (this.countdownTimer) clearInterval(this.countdownTimer)
				return
			}

			if (this.countdownTimer) clearInterval(this.countdownTimer)
			this.countdownTimer = setInterval(() => {
				if (this.remainingTime <= 1000 || ![1, 2].includes(this.detail.status)) {
					clearInterval(this.countdownTimer)
					this.countdown = '0时0分0秒'
					return
				}

				this.remainingTime -= 1000
				const hours = Math.floor(this.remainingTime / (60 * 60 * 1000))
				const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))
				const seconds = Math.floor((remaining % (60 * 1000)) / 1000)
				this.countdown = `${hours}时${minutes}分${seconds}秒`
			}, 1000)
		},

		// 在组件销毁时清除定时器
		onUnload() {
			if (this.countdownTimer) {
				clearInterval(this.countdownTimer)
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.after-sales-detail {
	padding-bottom: 120rpx;
	padding-top: 120rpx;
	/* 添加顶部间距，避免与固定导航栏重叠 */
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
		/* 固定宽度 */

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
		/* 防止标题阻挡返回按钮点击 */

		.title {
			font-size: 36rpx;
			font-weight: bold;
			color: #222;
			text-align: center;
		}
	}

	.header-right-space {
		width: 120rpx;
		/* 与左侧返回按钮宽度相同，保持平衡 */
	}
}

// 修改步骤条样式
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
	/* 调整顶部位置，使线条与第一个圆点相切 */
	bottom: 56rpx;
	/* 调整底部位置，使线条与第三个圆点相切 */
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
	color: #bcbcbc;
	font-size: 24rpx;
	margin-top: 8rpx;
	text-align: left;
}

.desc {
	color: #ff9900;
	font-size: 24rpx;
	margin-top: 8rpx;
	max-width: 500rpx;
	line-height: 1.4;
	text-align: left;
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
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				max-width: 320rpx;
			}

			.goods-info-bottom {
				display: flex;
				justify-content: flex-end;
				align-items: center;

				.goods-price {
					font-size: 28rpx;
					color: #222;
					font-weight: bold;
				}
			}
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
