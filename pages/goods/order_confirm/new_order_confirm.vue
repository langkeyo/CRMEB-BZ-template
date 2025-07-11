<template>
	<view class="order-confirm">
		<!-- 支付方式选择弹窗 -->
		<view class="payment-mask" v-if="showPaymentModal" @click.stop="closePaymentModal"></view>
		<view class="payment-modal" v-if="showPaymentModal">
			<view class="payment-options">
				<view class="payment-option" @click="selectPayment('alipay')">
					<view class="payment-icon alipay-icon">
						<image src="/static/images/payment/alipay_icon.png" mode="widthFix"></image>
					</view>
					<view class="payment-name">支付宝支付</view>
					<view class="payment-check" :class="{ active: selectedPayment === 'alipay' }"></view>
				</view>
				<view class="payment-option" @click="selectPayment('wechat')">
					<view class="payment-icon wechat-icon">
						<image src="/static/images/payment/wechat_icon.png" mode="widthFix"></image>
					</view>
					<view class="payment-name">微信支付</view>
					<view class="payment-check" :class="{ active: selectedPayment === 'wechat' }"></view>
				</view>
				<view class="more-payment" @click="toggleMorePayment">
					<text>更多支付方式</text>
					<image :class="{ 'arrow-rotated': morePaymentExpanded }" src="/static/images/payment/arrow_down.png" mode="widthFix"></image>
				</view>
				<view v-if="morePaymentExpanded" class="more-payment-list">
					<view class="payment-option" @click="selectPayment('unionpay')">
						<view class="payment-icon">
							<image src="/static/images/payment/unionpay_icon.png" mode="widthFix"></image>
						</view>
						<view class="payment-name">银联支付</view>
						<view class="payment-check" :class="{ active: selectedPayment === 'unionpay' }"></view>
					</view>
					<!-- 可继续添加更多支付方式 -->
				</view>
			</view>
			<view class="payment-btn" @click="confirmPayment">
				<text>立即支付 ¥{{ goods.price }}</text>
			</view>
		</view>
		<!-- 导航栏 -->
		<view class="nav-bar">
			<view class="back-icon" @tap="goBack">
				<image src="/static/images/back_icon.svg" mode="aspectFit"></image>
			</view>
			<view class="title">确认订单</view>
		</view>

		<!-- 收货地址区域 -->
		<view class="address-box">
			<view class="address-tag">站点自提</view>
			<view class="address-content">
				<view class="user-info"><text class="user-name">收货人：</text>Eetin</view>
				<view class="address-detail"><text class="address-text">收货地址：</text>北京尚德井小区菜鸟驿站</view>
				<view class="delivery-time"><text class="time-text">送货时间：</text>今日8：00前送达</view>
			</view>
		</view>
		<view class="goods-card">
			<!-- 商品信息 -->
			<view class="goods-box">
				<view class="goods-image">
					<image src="/static/images/today-group-buying/order_confirm/lemon.png" mode="aspectFill"></image>
				</view>
				<view class="goods-info">
					<view class="goods-name">{{ goods.name }}</view>
					<view class="price-change">比加入时降价￥{{ goods.oldPrice - goods.price }}元</view>
					<!-- 坏果包赔 -->
					<view class="guarantee-tag">
						<text>坏果包赔</text>
					</view>
					<view class="price-row">
						<view class="price">￥{{ (goods.price * goods.quantity).toFixed(2) }}</view>

						<!-- 数量加减 -->
						<view class="quantity-box">
							<view class="minus" :class="{ disabled: goods.quantity <= 1 }" @tap="minusQuantity">
								<text>-</text>
							</view>
							<view class="quantity">{{ goods.quantity }}</view>
							<view class="plus" @tap="addQuantity">
								<text>+</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 费用信息 -->
			<view class="fee-box">
				<view class="fee-item">
					<text>打包费</text>
					<text>￥0</text>
				</view>
				<view class="fee-item">
					<text>配送费</text>
					<text>￥0</text>
				</view>
				<view class="fee-item">
					<text>商家代金券</text>
					<view class="coupon-info">
						<text>暂无可用</text>
						<text class="arrow">></text>
					</view>
				</view>
			</view>
		</view>

		<!-- 推荐商品 -->
		<view class="recommend-box">
			<view class="recommend-header">
				<text class="recommend-title">顺手买一件</text>
				<view class="recommend-more" @tap="goToMore">
					<text>去看看</text>
					<text class="arrow">></text>
				</view>
			</view>
			<scroll-view class="recommend-list" scroll-y>
				<view class="recommend-item" v-for="item in recommendProducts" :key="item.id">
					<image :src="item.image" mode="aspectFill" class="recommend-image"></image>
					<view class="recommend-name">{{ item.name }}</view>
					<view class="recommend-price">￥{{ item.price }}</view>
				</view>
			</scroll-view>
		</view>
		<!-- 底部支付栏 -->
		<view class="bottom-bar">
			<view class="payment-info">
				<text class="payment-label">待支付：</text>
				<text class="payment-price">￥{{ (goods.price * goods.quantity).toFixed(2) }}</text>
			</view>

			<view class="payment-buttons">
				<view class="order-first-btn" @tap="orderFirst">先下单</view>
				<view class="pay-now-btn" @tap="payNow">立即支付</view>
			</view>
		</view>
		<view class="confirm-modal" v-if="showOrderConfirm">
			<view class="modal-content">
				<view class="modal-title">您确定要先下单后付款？</view>
				<view class="modal-btns">
					<view class="btn-cancel" @click="showOrderConfirm = false">取消</view>
					<view class="divider-vertical"></view>
					<view class="btn-confirm" @click="confirmOrderFirst">确定</view>
				</view>
			</view>
			<view class="modal-mask" @click="showOrderConfirm = false"></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showPaymentModal: false, // 支付弹窗显示状态
			selectedPayment: 'wechat', // 默认选择微信支付
			showOrderConfirm: false, // 下单确认弹窗显示状态
			goods: {
				name: '香水柠檬50g/个',
				price: 15,
				oldPrice: 17,
				quantity: 1,
				image: '/static/images/today-group-buying/order_confirm/lemon.png'
			},
			address: {
				name: 'Eetin',
				location: '北京尚德井小区菜鸟驿站',
				deliveryTime: '今日8：00前送达',
				type: '站点自提'
			},
			recommendProducts: [
				{
					id: 1,
					name: '刺小野新款菠萝口味果干',
					price: 19.8,
					image: '/static/images/today-group-buying/order_confirm/conveniently/goods1.png'
				},
				{
					id: 2,
					name: '双重软毛电动牙刷新款',
					price: 29.8,
					image: '/static/images/today-group-buying/order_confirm/conveniently/goods2.png'
				},
				{
					id: 3,
					name: '高级感时尚百搭单肩包',
					price: 156,
					image: '/static/images/today-group-buying/order_confirm/conveniently/goods3.png'
				}
			],
			morePaymentExpanded: false
		}
	},
	methods: {
		goBack() {
			console.log('hello')
			if (getCurrentPages().length > 1) {
				uni.navigateBack();
			} else {
				uni.switchTab({
					url: '/pages/index/index' // 或你想要的首页路径
				});
			}
		},
		minusQuantity() {
			if (this.goods.quantity > 1) {
				this.goods.quantity--
			}
		},
		addQuantity() {
			this.goods.quantity++
		},
		payNow() {
			// 显示支付方式选择弹窗
			this.showPaymentModal = true
		},
		orderFirst() {
			this.showOrderConfirm = true
			// uni.showModal({
			// 	title: '',
			// 	content: '您确定要先下单后付款？',
			// 	cancelText: '取消',
			// 	confirmText: '确定',
			// 	success: (res) => {
			// 		if (res.confirm) {
			// 			// 用户点击了确定，执行下单逻辑
			// 		uni.showToast({
			// 			title: '创建订单成功',
			// 			icon: 'success'
			// 		})
			// 		}
			// 		// 用户点击了取消，不执行任何操作
			// 	}
			// })
		},
		confirmOrderFirst() {
			this.showOrderConfirm = false
			uni.navigateTo({
			    url: `/pages/goods/pending_payment/index`
			})
			// uni.showToast({
			// 	title: '创建订单成功',
			// 	icon: 'success'
			// })
		},

		// 选择支付方式
		selectPayment(type) {
			this.selectedPayment = type
		},

		// 关闭支付弹窗
		closePaymentModal() {
			this.showPaymentModal = false
		},

		// 确认支付
		confirmPayment() {
			// 储存选择的支付方式
			uni.setStorageSync('selectedPaymentMethod', this.selectedPayment)

			// 根据选择的支付方式调用支付接口
			uni.showLoading({
				title: '正在支付...'
			})

			// 模拟支付流程
			setTimeout(() => {
				uni.hideLoading()
				uni.showToast({
					title: '支付成功',
					icon: 'success'
				})

				// 跳转到支付成功页面
				setTimeout(() => {
					uni.redirectTo({
						url: '/pages/goods/order_pay_status/index?status=success'
					})
				}, 1500)
			}, 2000)

			// 关闭弹窗
			this.showPaymentModal = false
		},
		toggleMorePayment() {
			this.morePaymentExpanded = !this.morePaymentExpanded
		}
	},
	mounted() {
		this.$nextTick(() => {
			const contentEl = document.querySelector('.uni-scroll-view-content')
			if (contentEl) {
				console.log(contentEl)
				contentEl.style.display = 'flex'
				contentEl.style.justifyContent = 'space-evenly'
			} else {
				console.log('contentEl is null')
			}
		})
	}
}
</script>

<style lang="scss">
.order-confirm {
	background-color: #F7F7F7;
	min-height: 100vh;
	position: relative;
	padding-bottom: 120rpx;
}

.nav-bar {
	display: flex;
	align-items: center;
	height: 44px;
	position: relative;
	background-color: #FFFFFF;
	padding: 0 15px;

	.back-icon {
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1001;

		image {
			width: 20px;
			height: 20px;
		}
	}

	.title {
		position: absolute;
		left: 0;
		right: 0;
		text-align: center;
		font-size: 18px;
		color: #333;
		font-weight: 400;
		z-index: 1000;
	}
}

.address-box {
	display: flex;
	flex-direction: column;
	background: #e7eaf4;
	border-radius: 32rpx;
	margin: 20rpx;
	box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.05);
	overflow: hidden; // 保证圆角
	height: 328rpx;

	.address-tag {
		display: flex;
		width: 50%;
		background: #fff;
		color: #000000;
		border-radius: 32rpx 32rpx 0 0;
		font-size: 32rpx;
		font-weight: 400;
		text-align: center;
		height: 30%;
		align-items: center;
		justify-content: center;
	}

	.address-content {
		height: 70%;
		padding: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		background-color: #fff;
		font-size: 28rpx;
		border-top-right-radius: 32rpx;
		font-family: "PingFang SC";

		text {
			color: #333;
			font-weight: 550;
		}
	}
}

.goods-card {
	background: #fff;
	border-radius: 16rpx;
	margin: 20rpx;
	box-shadow: 0 2rpx 12rpx 0 rgba(0, 0, 0, 0.04);
	overflow: hidden;

	.goods-box {
		margin: 20rpx;
		background-color: #FFFFFF;
		border-radius: 8rpx;
		padding: 20rpx;
		display: flex;

		.goods-image {
			width: 214rpx;
			height: 214rpx;
			margin-right: 20rpx;

			image {
				width: 100%;
				height: 100%;
				border-radius: 14rpx;
			}
		}

		.goods-info {
			flex: 1;
			position: relative;

			.goods-name {
				font-size: 16px;
				color: #333;
				margin-bottom: 10rpx;
				font-weight: 550;
			}

			.price-change {
				font-size: 12px;
				color: #333;
				margin-top: 10rpx;
			}

			.guarantee-tag {
				display: inline-block;
				border: 0.5px solid #FF840B;
				border-radius: 8rpx;
				padding: 2rpx 8rpx;
				margin-top: 20rpx;

				text {
					font-size: 10px;
					color: #FF840B;
				}
			}

			.price-row {
				display: flex;
				align-items: center;
				justify-content: space-between; // 让价格和计数器分居两端
				margin-top: 20rpx;

				.price {
					font-size: 20px;
					color: #333;
				}

				.quantity-box {
					display: flex;
					align-items: center;
					border: 1px solid #ededed;
					border-radius: 94rpx;
					overflow: hidden;
					background-color: transparent;
					height: 60rpx;

					.minus,
					.plus {
						width: 60rpx;
						height: 60rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						color: #333;
						font-size: 32rpx;
						background: transparent;
					}

					.quantity {
						width: 60rpx;
						text-align: center;
						font-size: 28rpx;
						color: #333;
						background-color: transparent;

					}
				}

				.minus {
					border-right: 1px solid #ededed;
					color: #ededed !important;
				}

				.plus {
					border-left: 1px solid #ededed;
				}


			}
		}
	}

	.fee-box {
		margin: 20rpx;
		background-color: #FFFFFF;
		border-radius: 8rpx;
		padding: 20rpx;
		color: #000000;
		font-weight: 550 !important;

		.fee-item {
			display: flex;
			justify-content: space-between;
			margin-bottom: 20rpx;

			text {
				font-size: 14px;
				color: #333;
			}

			.coupon-info {
				display: flex;
				align-items: center;

				text {
					font-size: 12px;
					color: #999;
				}

				.arrow {
					margin-left: 5rpx;
				}
			}
		}
	}
}

.recommend-box {
	margin: 20rpx;
	background-color: #FFFFFF;
	border-radius: 8rpx;
	padding: 20rpx;

	.recommend-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;

		.recommend-title {
			font-size: 28rpx;
			font-family: 'PingFang SC';
			color: #1A1A1A;
			font-weight: bold;
			font-style: normal;
		}

		.recommend-more {
			display: flex;
			align-items: center;
			font-size: 24rpx;
			color: #999;

			.arrow {
				margin-left: 5rpx;
			}
		}
	}



	.recommend-list {
		display: flex;

		.uni-scroll-view-content::v-deep {
			display: flex;
			justify-content: space-evenly;
		}

		.recommend-item {
			width: 30%;
			display: inline-block;
			vertical-align: top;

			.recommend-image {
				width: 180rpx;
				height: 180rpx;
				border-radius: 8rpx;
				background: #f5f5f5;
			}

			.recommend-name {
				font-size: 15px;
				color: #1A1A1A;
				margin-top: 10rpx;
				font-family: 'PingFang SC';
				font-style: normal;
				line-height: 1.4;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2; // 显示2行
				overflow: hidden;
			}

			.recommend-price {
				font-size: 30rpx;
				color: #1A1A1A;
				margin-top: 10rpx;
				font-weight: 550;
			}
		}

		.recommend-item:last-child {
			margin-right: 0;
		}
	}
}

.bottom-bar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #FFFFFF;
	box-shadow: 0px 4px 21px 0px rgba(0, 0, 0, 0.25);
	padding: 20rpx;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	display: flex;
	justify-content: space-between;
	align-items: center;
	z-index: 99;

	.payment-info {
		.payment-label {
			font-family: 'Inter';
			font-size: 24rpx;
			color: #737373;
		}

		.payment-price {
			font-family: 'PingFang SC';
			font-style: normal;
			font-size: 32rpx;
			color: #333;
			font-weight: 550;
		}
	}

	.payment-buttons {
		display: flex;

		.pay-now-btn,
		.order-first-btn {
			width: 230rpx;
			height: 74rpx;
			border-radius: 44px;
			color: #FFFFFF;
			font-size: 18px;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-left: 20rpx;
		}

		.pay-now-btn {
			background: linear-gradient(to right, #FF7E00, #FDA44D);
		}

		.order-first-btn {
			/* 浅色橙色边框按钮 */
			background: linear-gradient(to right, #FF7E00, #FDA44D);
			// color: #FF7E00;
			border: 1px solid #FF7E00;
		}
	}
}

/* 支付弹窗样式 */
.payment-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.6);
	z-index: 999;
}

.payment-modal {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #FFFFFF;
	border-radius: 4px 4px 0 0;
	/* 根据Figma设计稿修改圆角为4px */
	z-index: 1000;
	overflow: hidden;

	.payment-options {
		padding: 20px 16px;

		.payment-option {
			display: flex;
			align-items: center;
			height: 54px;
			margin-bottom: 15px;
			position: relative;

			.payment-icon {
				width: 23px;
				/* 根据Figma设计稿修改图标尺寸为23x23px */
				height: 23px;
				margin-right: 12px;
				display: flex;
				align-items: center;
				justify-content: center;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.payment-name {
				flex: 1;
				font-size: 14px;
				/* 根据Figma设计稿调整字体大小 */
				color: #333333;
			}

			.payment-check {
				width: 20px;
				/* 根据Figma设计稿调整单选按钮尺寸 */
				height: 20px;
				border-radius: 50%;
				border: 1px solid #DDDDDD;
				position: relative;

				&.active {
					border-color: #FF7E00;
					/* 根据Figma设计稿调整颜色 */

					&:after {
						content: '';
						position: absolute;
						width: 12px;
						height: 12px;
						background-color: #FF7E00;
						/* 根据Figma设计稿调整颜色 */
						border-radius: 50%;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					}
				}
			}
		}

		.more-payment {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 13px;
			/* 根据Figma设计稿调整字体大小 */
			color: #999999;
			padding: 15px 0;

			image {
				width: 12px;
				/* 根据Figma设计稿调整箭头图标尺寸 */
				height: 12px;
				margin-left: 5px;
			}
		}
	}

	.payment-btn {
		height: 50px;
		/* 根据Figma设计稿调整按钮高度 */
		background: linear-gradient(to right, #FF7E00, #FDA44D);
		/* 根据Figma设计稿调整为渐变背景 */
		display: flex;
		align-items: center;
		justify-content: center;

		text {
			color: #FFFFFF;
			font-size: 16px;
			font-weight: 500;
		}
	}
}

.minus.disabled {
	color: #ccc !important;
	pointer-events: none;
}

.confirm-modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1000000;
	display: flex;
	align-items: center;
	justify-content: center;


	.modal-mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
	}

	.modal-content {
		width: 600rpx;
		height: 376rpx;
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		z-index: 1000001;
		display: flex;
		flex-direction: column;

		.modal-title {
			display: flex;
			flex: none;
			padding: 60rpx 40rpx 40rpx 40rpx;
			text-align: center;
			font-size: 36rpx;
			color: #1a1a1a;
			font-family: 'PingFang SC';
			height: 70%;
			align-items: center;
			justify-content: center;
		}

		.modal-btns {
			flex: none;
			display: flex;
			height: 100rpx;
			border-top: 1rpx solid #d7d7d7;
			align-items: stretch;

			.btn-cancel,
			.btn-confirm {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 36rpx;
				background: transparent;
				font-family: 'PingFang SC';
			}

			.btn-cancel {
				color: #1a1a1a;
			}

			.btn-confirm {
				color: #333;
			}

			.divider-vertical {
				width: 1rpx;
				background-color: #d7d7d7;
				height: 100%;
			}
		}
	}
}

.more-payment {
  cursor: pointer;
  user-select: none;
  image {
    transition: transform 0.3s;
  }
  .arrow-rotated {
    transform: rotate(180deg);
    transition: transform 0.3s;
  }
}
.more-payment-list {
  padding: 0 0 10px 0;
  .payment-option {
    // 可复用已有样式
  }
}
</style>