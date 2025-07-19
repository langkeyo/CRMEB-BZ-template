<template>
	<view class="order-complete-container">
		<!-- 顶部导航栏 -->
		<view class="header">
			<view class="nav-bar">
				<!-- 返回按钮 -->
				<view class="left" @click="goBack">
					<image src="/static/images/order-complete/back-arrow.svg" mode="aspectFit"></image>
					<text>返回</text>
				</view>
				<view class="title">订单详情</view>
			</view>
		</view>

		<view v-if="loading" class="loading-box">
			<view class="loading-spinner"></view>
			<text class="loading-text">加载中...</text>
		</view>

		<view v-else>
			<!-- 订单完成状态 -->
			<view class="order-complete-status">
				<view class="complete-title">订单已完成</view>
				<view class="complete-message">感谢您对本平台的支持与信任，期待您再此光临!</view>
			</view>

			<!-- 商品详情 -->
			<view class="goods-details">
				<view class="section-title">商品详情</view>
				<view class="address-label">收货地址：北京尚德井小区菜鸟驿站</view>

				<!-- 商品卡片 -->
				<view class="goods-card">
					<view class="goods-image">
						<image src="/static/images/order-complete/product-image.png" mode="aspectFill"></image>
					</view>
					<view class="goods-info">
						<view class="goods-title">百草味坚果</view>
						<view class="goods-specs">一盒15包随机...</view>
						<view class="goods-quantity">X1</view>
					</view>
					<view class="goods-price">
						<text class="currency">￥</text>
						<text class="price">35</text>
					</view>
				</view>

				<!-- 价格信息 -->
				<view class="price-info">
					<view class="price-item">
						<text>共一件商品</text>
						<text class="more-details">点击展开</text>
					</view>
					<view class="price-item">
						<text>配送费</text>
						<text class="free-delivery">免配送费</text>
					</view>
					<view class="price-item">
						<text>商品总价</text>
						<text class="price-value">￥35</text>
					</view>
					<view class="price-item total">
						<text>合计</text>
						<text class="price-value">￥35</text>
					</view>
				</view>
			</view>

			<!-- 订单信息 -->
			<view class="order-info">
				<view class="section-title">订单信息</view>
				<view class="info-item">
					<text class="label">订单号</text>
					<view class="value-box">
						<text class="value">6546846541821654</text>
						<text class="copy-btn" @click="copyOrderId">复制</text>
					</view>
				</view>
				<view class="info-item">
					<text class="label">支付方式</text>
					<text class="value">微信支付</text>
				</view>
				<view class="info-item">
					<text class="label">下单时间</text>
					<text class="value">2025-03-28 9:35</text>
				</view>
				<view class="info-item">
					<text class="label">付款时间</text>
					<text class="value">2025-03-28 9:36</text>
				</view>
				<view class="info-item">
					<text class="label">备注</text>
					<text class="value">-</text>
				</view>
			</view>

			<!-- 猜你喜欢 -->
			<view class="guess-you-like">
				<view class="like-title">你可能还喜欢</view>
				<view class="like-items">
					<view class="like-item" v-for="(item, index) in likeList" :key="index"
						@click="goToProductDetail(item)">
						<image :src="item.image" mode="aspectFill"></image>
						<view class="like-name">{{ item.name }}</view>
						<view class="like-info">{{ item.info }}</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部安全区域 -->
		<view class="safe-area">
			<image src="/static/images/order/home_indicator.png" mode="aspectFit"></image>
		</view>
	</view>
</template>

<script>
export default {
	name: 'OrderComplete',
	data () {
		return {
			orderInfo: null,
			orderId: '',
			loading: true,
			likeList: [
				{
					image: '/static/images/goods/detail/coffee.png',
					name: '瑞幸咖啡5选1',
					info: '￥12.5 已售99+单'
				},
				{
					image: '/static/images/goods/detail/skewers.png',
					name: '滩羊烤串21串套餐',
					info: '￥49 已售754件'
				},
				{
					image: '/static/images/goods/detail/wings.png',
					name: '精美黄金烤鸡翅',
					info: '￥22 已售99+份'
				},
				{
					image: '/static/images/goods/detail/octopus.png',
					name: '超值章鱼丸子1份',
					info: '￥7.5 已售1122件'
				}
			]
		}
	},
	onLoad (options) {
		if (options.order_id) {
			this.orderId = options.order_id
			this.getOrderDetail(options.order_id)
		} else {
			// 模拟订单数据用于UI展示
			this.orderInfo = {
				status: 4,
				_status: {
					_msg: '订单已完成'
				}
			}
			this.loading = false
		}
	},
	methods: {
		getOrderDetail (orderId) {
			this.loading = true
			// 使用uni.request或已有的API方法
			uni.request({
				url: '/api/order/detail',
				data: { orderId },
				success: (res) => {
					if (res.data.status === 200) {
						this.orderInfo = res.data.data
					} else {
						uni.showToast({
							title: res.data.msg || '获取订单详情失败',
							icon: 'none'
						})
					}
					this.loading = false
				},
				fail: () => {
					uni.showToast({
						title: '网络请求失败',
						icon: 'none'
					})
					this.loading = false
				}
			})
		},
		goBack () {
			uni.navigateBack()
		},
		// 格式化价格
		formatPrice (price) {
			return parseFloat(price).toFixed(2)
		},
		// 复制订单号
		copyOrderId () {
			uni.setClipboardData({
				data: '6546846541821654',
				success: () => {
					uni.showToast({
						title: '复制成功',
						icon: 'none'
					})
				}
			})
		},
		// 申请售后
		goToAfterSale () {
			uni.navigateTo({
				url: '/pages/goods/goods_return/index?orderId=' + this.orderId
			})
		},
		// 去评价
		goToReview () {
			uni.navigateTo({
				url: '/pages/goods/goods_comment_con/index?orderId=' + this.orderId
			})
		},
		// 进入商品详情
		goToProductDetail () {
			uni.navigateTo({
				url: '/pages/goods/goods_details_store/index?id=1'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.order-complete-container {
	background-color: #F0F0F0;
	min-height: 100vh;

	.header {
		background-color: #FFFFFF;

		.nav-bar {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 44px;

			.left {
				position: absolute;
				left: 15px;
				display: flex;
				align-items: center;

				image {
					width: 30rpx;
					height: 30rpx;
					margin-right: 8rpx;
				}

				text {
					color: #333333;
					font-size: 18px;
				}
			}

			.title {
				font-size: 18px;
				font-weight: 400;
				color: #1A1A1A;
			}
		}
	}
	padding-bottom: 30rpx;

	.loading-box {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 200rpx;
		margin-top: 100rpx;
	}

	.empty-data {
		margin-top: 100rpx;
	}



	.order-complete-status {
		background-color: #FFFFFF;
		margin-top: 20rpx;
		padding: 40rpx 30rpx;
		border-radius: 8rpx;

		.complete-title {
			font-size: 28px;
			color: #000000;
			margin-bottom: 20rpx;
			font-weight: 400;
		}

		.complete-message {
			font-size: 14px;
			color: #999999;
			line-height: 1.4;
			margin-bottom: 30rpx;
		}

		.after-sale-btn {
			width: 160rpx;
			height: 66rpx;
			border: 1px solid #E5E5E5;
			border-radius: 33rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 14px;
			color: #000000;
			margin-bottom: 30rpx;
		}

		.review-section {
			background-color: #FFFFFF;
			padding: 20rpx 0;
			border-top: 1px solid #F5F5F5;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.review-text {
				font-size: 14px;
				color: #000000;
			}

			.go-review {
				display: flex;
				align-items: center;

				text {
					font-size: 15px;
					color: #999999;
					margin-right: 10rpx;
				}

				image {
					width: 24rpx;
					height: 24rpx;
				}
			}
		}
	}

	.goods-details {
		background-color: #FFFFFF;
		margin-top: 20rpx;
		padding: 30rpx;
		border-radius: 8rpx;

		.section-title {
			font-size: 16px;
			color: #000000;
			margin-bottom: 20rpx;
		}

		.address-label {
			font-size: 18px;
			color: #000000;
			margin-bottom: 20rpx;
		}

		.goods-card {
			background-color: #F8F8F8;
			border-radius: 8rpx;
			padding: 20rpx;
			display: flex;
			margin-bottom: 30rpx;
			position: relative;

			.goods-image {
				width: 160rpx;
				height: 160rpx;
				border-radius: 8rpx;
				overflow: hidden;
				margin-right: 20rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.goods-info {
				flex: 1;
				display: flex;
				flex-direction: column;

				.goods-title {
					font-size: 12px;
					color: #1A1A1A;
					margin-bottom: 10rpx;
				}

				.goods-specs {
					font-size: 12px;
					color: #666666;
				}

				.goods-quantity {
					font-size: 12px;
					color: #666666;
					margin-top: 10rpx;
				}
			}

			.goods-price {
				position: absolute;
				right: 20rpx;
				bottom: 20rpx;
				color: #333333;
				font-size: 14px;

				.currency {
					font-size: 14px;
				}

				.price {
					font-size: 14px;
				}
			}
		}

		.price-info {
			.price-item {
				display: flex;
				justify-content: space-between;
				margin-bottom: 10rpx;
				font-size: 14px;
				color: #333333;

				.more-details {
					color: #999999;
				}

				.free-delivery {
					color: #999999;
				}

				.price-value {
					color: #999999;
				}

				&.total {
					margin-top: 20rpx;
				}
			}
		}
	}

	.order-info {
		background-color: #FFFFFF;
		margin-top: 20rpx;
		padding: 30rpx;
		border-radius: 8rpx;

		.section-title {
			font-size: 16px;
			color: #000000;
			margin-bottom: 20rpx;
		}

		.info-item {
			display: flex;
			justify-content: space-between;
			margin-bottom: 20rpx;

			.label {
				font-size: 14px;
				color: #333333;
			}

			.value {
				font-size: 13px;
				color: #B3B3B3;
			}

			.value-box {
				display: flex;
				align-items: center;

				.copy-btn {
					font-size: 12px;
					color: #333333;
					margin-left: 10rpx;
					padding: 3rpx 15rpx;
					border: 1px solid #666;
					border-radius: 4rpx;
				}
			}
		}
	}

	.guess-you-like {
		background-color: #FFFFFF;
		margin-top: 20rpx;
		padding: 30rpx;
		border-radius: 8rpx;

		.like-title {
			font-size: 18px;
			color: #000000;
			margin-bottom: 30rpx;
		}

		.like-items {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.like-item {
				width: 160rpx;
				margin-bottom: 20rpx;

				image {
					width: 160rpx;
					height: 160rpx;
					border-radius: 8rpx;
				}

				.like-name {
					font-size: 14px;
					color: #1A1A1A;
					margin: 10rpx 0 4rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.like-info {
					font-size: 12px;
					color: #EB3C3C;
				}
			}
		}
	}

	.safe-area {
		height: 34px;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 20rpx;

		image {
			width: 134px;
			height: 5px;
			opacity: 0.9;
		}
	}

	// Loading样式
	.loading-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60rpx;

		.loading-spinner {
			width: 60rpx;
			height: 60rpx;
			border: 4rpx solid #f3f3f3;
			border-top: 4rpx solid #007AFF;
			border-radius: 50%;
			animation: spin 1s linear infinite;
			margin-bottom: 20rpx;
		}

		.loading-text {
			font-size: 28rpx;
			color: #999999;
		}
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
}
</style>