<template>
	<view :style="colorStyle">
		<view class="after-sales-detail">
			<!-- 售后进度 -->
			<view class="progress-box">
				<view class="progress-item"
					:class="{ 'active': orderInfo.refund_type >= 1, 'current': orderInfo.refund_type == 1 }">
					<view class="dot"></view>
					<view class="text">申请售后</view>
				</view>
				<view class="progress-line" :class="{ 'active': orderInfo.refund_type >= 2 }"></view>
				<view class="progress-item"
					:class="{ 'active': orderInfo.refund_type >= 2, 'current': orderInfo.refund_type == 2 }">
					<view class="dot"></view>
					<view class="text">
						<view>等待团长处理</view>
						<view class="time" v-if="orderInfo.refund_type == 2">
							还剩{{ orderInfo.remaining_time || '23小时56分28秒' }}
						</view>
					</view>
				</view>
				<view class="progress-line" :class="{ 'active': orderInfo.refund_type >= 6 }"></view>
				<view class="progress-item"
					:class="{ 'active': orderInfo.refund_type >= 6, 'current': orderInfo.refund_type == 6 }">
					<view class="dot"></view>
					<view class="text">售后已完成</view>
				</view>
			</view>

			<!-- 售后商品信息 -->
			<view class="goods-box">
				<view class="store-name">
					<text>{{ orderInfo.store_name }}</text>
				</view>
				<view class="goods-item" v-for="(item, index) in orderInfo.cart_info" :key="index">
					<view class="goods-img">
						<image
							:src="item.productInfo.attrInfo ? item.productInfo.attrInfo.image : item.productInfo.image">
						</image>
					</view>
					<view class="goods-info">
						<view class="goods-name">{{ item.productInfo.store_name }}</view>
						<view class="goods-attr" v-if="item.productInfo.attrInfo">{{ item.productInfo.attrInfo.suk }}
						</view>
						<view class="goods-price">
							<text>{{ $t(`￥`) }}{{ item.productInfo.attrInfo ? item.productInfo.attrInfo.price :
								item.productInfo.price }}</text>
							<text class="goods-num">x{{ item.cart_num }}</text>
						</view>
					</view>
				</view>
				<view class="goods-total">
					<text>{{ $t(`共`) }} {{ orderInfo.refund_num || 1 }} {{ $t(`件商品，退款`) }}：</text>
					<text class="price">{{ $t(`￥`) }}{{ orderInfo.refund_price }}</text>
				</view>
			</view>

			<!-- 售后信息 -->
			<view class="info-box" v-if="orderInfo.refund_reason || orderInfo.refund_explain">
				<view class="info-item" v-if="orderInfo.refund_reason">
					<view class="info-label">{{ $t(`申请理由`) }}</view>
					<view class="info-value">{{ orderInfo.refund_reason }}</view>
				</view>
				<view class="info-item" v-if="orderInfo.refund_explain">
					<view class="info-label">{{ $t(`用户备注`) }}</view>
					<view class="info-value">{{ orderInfo.refund_explain }}</view>
				</view>
				<view class="info-item" v-if="orderInfo.refund_img && orderInfo.refund_img.length">
					<view class="info-label">{{ $t(`申请图片`) }}</view>
					<view class="info-images">
						<image v-for="(img, imgIndex) in orderInfo.refund_img" :key="imgIndex" :src="img"
							@click="previewImage(img, orderInfo.refund_img)"></image>
					</view>
				</view>
			</view>

			<!-- 订单信息 -->
			<view class="order-box">
				<view class="order-title">{{ $t(`订单信息`) }}</view>
				<view class="order-item">
					<view class="order-label">{{ $t(`订单编号`) }}</view>
					<view class="order-value">
						<text>{{ orderInfo.order_id }}</text>
						<text class="copy-btn" @click="copyOrderId">{{ $t(`复制`) }}</text>
					</view>
				</view>
				<view class="order-item">
					<view class="order-label">{{ $t(`申请时间`) }}</view>
					<view class="order-value">{{ orderInfo.add_time }}</view>
				</view>
				<view class="order-item" v-if="orderInfo.refund_type >= 6">
					<view class="order-label">{{ $t(`退款时间`) }}</view>
					<view class="order-value">{{ orderInfo.refund_time }}</view>
				</view>
			</view>

			<!-- 底部按钮 -->
			<view class="bottom-btns" v-if="orderInfo.refund_type == 1 || orderInfo.refund_type == 2">
				<view class="btn cancel-btn" @click="cancelRefund">{{ $t(`取消申请`) }}</view>
			</view>

			<!-- 评价按钮 -->
			<view class="bottom-btns" v-if="orderInfo.refund_type == 6 && !orderInfo.is_evaluate">
				<view class="btn evaluate-btn" @click="goEvaluate">{{ $t(`评价售后服务`) }}</view>
			</view>
		</view>

		<!-- #ifndef MP -->
		<home></home>
		<!-- #endif -->
	</view>
</template>

<script>
import home from '@/components/home'
import { refundOrderDetail, cancelRefundOrder } from '@/api/order.js'
import { toLogin } from '@/libs/login.js'
import { mapGetters } from "vuex"
import colors from '@/mixins/color.js'

export default {
	components: {
		home
	},
	mixins: [colors],
	data () {
		return {
			order_id: '',
			orderInfo: {
				refund_type: 2, // 1: 申请中, 2: 等待团长处理, 6: 已完成
				store_name: '暖心宠物店（雪云路店）',
				refund_price: '58.78',
				refund_num: 1,
				cart_info: [],
				refund_reason: '商品质量问题',
				refund_explain: '狗粮有异味，狗狗不爱吃',
				refund_img: [],
				order_id: '165418216541',
				add_time: '2023-05-20 15:30:45',
				refund_time: '2023-05-21 10:15:30',
				remaining_time: '23小时56分28秒',
				is_evaluate: false
			}
		}
	},
	computed: mapGetters(['isLogin']),
	onLoad (options) {
		if (options.order_id) {
			this.order_id = options.order_id
			if (this.isLogin) {
				this.getOrderDetail()
			} else {
				toLogin()
			}
		}
	},
	methods: {
		// 获取订单详情
		getOrderDetail () {
			// 显示加载提示
			uni.showLoading({
				title: this.$t(`加载中`)
			})

			refundOrderDetail(this.order_id).then(res => {
				this.orderInfo = res.data

				// 隐藏加载提示
				uni.hideLoading()
			}).catch(err => {
				// 隐藏加载提示
				uni.hideLoading()

				this.$util.Tips({
					title: err || this.$t(`加载失败，请稍后重试`),
					icon: 'none'
				})

				// 加载失败后返回上一页
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
			})
		},
		// 复制订单号
		copyOrderId () {
			uni.setClipboardData({
				data: this.orderInfo.order_id,
				success: () => {
					this.$util.Tips({
						title: this.$t(`复制成功`)
					})
				}
			})
		},
		// 预览图片
		previewImage (current, urls) {
			uni.previewImage({
				current: current,
				urls: urls
			})
		},
		// 取消申请
		cancelRefund () {
			uni.showModal({
				title: this.$t(`提示`),
				content: this.$t(`确定要取消售后申请吗？`),
				success: res => {
					if (res.confirm) {
						// 显示加载提示
						uni.showLoading({
							title: this.$t(`处理中`)
						})

						cancelRefundOrder(this.order_id).then(res => {
							// 隐藏加载提示
							uni.hideLoading()

							this.$util.Tips({
								title: this.$t(`取消成功`),
								icon: 'success'
							})
							setTimeout(() => {
								uni.navigateBack()
							}, 1500)
						}).catch(err => {
							// 隐藏加载提示
							uni.hideLoading()

							this.$util.Tips({
								title: err || this.$t(`操作失败，请稍后重试`),
								icon: 'none'
							})
						})
					}
				}
			})
		},
		// 去评价
		goEvaluate () {
			uni.navigateTo({
				url: `/pages/users/after_sales/evaluate?order_id=${this.order_id}`
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.after-sales-detail {
	padding-bottom: 120rpx;
}

.progress-box {
	background-color: #fff;
	padding: 40rpx 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	position: relative;

	.progress-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		z-index: 2;

		.dot {
			width: 20rpx;
			height: 20rpx;
			border-radius: 50%;
			background-color: #ddd;
			margin-bottom: 20rpx;
		}

		.text {
			font-size: 24rpx;
			color: #999;
			text-align: center;

			.time {
				font-size: 22rpx;
				color: #999;
				margin-top: 6rpx;
			}
		}

		&.active {
			.dot {
				background-color: var(--view-theme);
			}

			.text {
				color: var(--view-theme);
			}
		}

		&.current {
			.dot {
				width: 30rpx;
				height: 30rpx;
				margin-top: -5rpx;
				margin-bottom: 15rpx;
			}
		}
	}

	.progress-line {
		flex: 1;
		height: 2rpx;
		background-color: #ddd;
		position: relative;
		z-index: 1;

		&.active {
			background-color: var(--view-theme);
		}
	}
}

.goods-box {
	background-color: #fff;
	margin-top: 20rpx;
	padding: 30rpx;

	.store-name {
		font-size: 30rpx;
		color: #333;
		margin-bottom: 20rpx;
	}

	.goods-item {
		display: flex;
		margin-bottom: 20rpx;

		.goods-img {
			width: 160rpx;
			height: 160rpx;
			margin-right: 20rpx;

			image {
				width: 100%;
				height: 100%;
				border-radius: 10rpx;
			}
		}

		.goods-info {
			flex: 1;

			.goods-name {
				font-size: 28rpx;
				color: #333;
				margin-bottom: 10rpx;
			}

			.goods-attr {
				font-size: 24rpx;
				color: #999;
				margin-bottom: 10rpx;
			}

			.goods-price {
				font-size: 28rpx;
				color: #333;
				display: flex;
				justify-content: space-between;

				.goods-num {
					color: #999;
				}
			}
		}
	}

	.goods-total {
		text-align: right;
		font-size: 28rpx;
		color: #333;

		.price {
			font-weight: bold;
			color: var(--view-theme);
		}
	}
}

.info-box {
	background-color: #fff;
	margin-top: 20rpx;
	padding: 30rpx;

	.info-item {
		margin-bottom: 20rpx;

		&:last-child {
			margin-bottom: 0;
		}

		.info-label {
			font-size: 28rpx;
			color: #333;
			margin-bottom: 10rpx;
		}

		.info-value {
			font-size: 26rpx;
			color: #666;
			line-height: 1.5;
		}

		.info-images {
			display: flex;
			flex-wrap: wrap;

			image {
				width: 160rpx;
				height: 160rpx;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				border-radius: 10rpx;
			}
		}
	}
}

.order-box {
	background-color: #fff;
	margin-top: 20rpx;
	padding: 30rpx;

	.order-title {
		font-size: 30rpx;
		color: #333;
		margin-bottom: 20rpx;
	}

	.order-item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;

		&:last-child {
			margin-bottom: 0;
		}

		.order-label {
			font-size: 26rpx;
			color: #666;
		}

		.order-value {
			font-size: 26rpx;
			color: #333;
			display: flex;
			align-items: center;

			.copy-btn {
				margin-left: 20rpx;
				color: var(--view-theme);
			}
		}
	}
}

.bottom-btns {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #fff;
	padding: 20rpx 30rpx;
	display: flex;
	justify-content: flex-end;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

	.btn {
		padding: 20rpx 40rpx;
		border-radius: 40rpx;
		font-size: 28rpx;
	}

	.cancel-btn {
		background-color: #f7f7f7;
		color: #666;
	}

	.evaluate-btn {
		background-color: var(--view-theme);
		color: #fff;
	}
}
</style>
