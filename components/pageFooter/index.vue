<template>
	<view class="pending-delivery-container" :style="colorStyle">
		<!-- 顶部导航栏 -->
		<view class="header">
			<view class="nav-bar">
				<view class="left" @click="goBack">
					<image class="back-icon" src="/static/images/order/back_arrow.svg" mode="widthFix"></image>
					<text>返回</text>
				</view>
				<view class="title">待收货</view>
			</view>
		</view>

		<!-- 订单卡片 -->
		<view class="order-card" v-for="(order, index) in orderList" :key="index">
			<view class="order-info">
				<view class="order-no">订单号: {{ order.order_number }}</view>
				<view class="order-status">{{ order.status_text }}</view>
			</view>
			<view class="product-info" v-if="order.goods && order.goods.length > 0">
				<view class="product-image">
					<image :src="formatImage(order.goods[0].image)" mode="aspectFill"></image>
				</view>
				<view class="product-details">
					<view class="product-name">{{ order.goods[0].title }}</view>
					<view class="product-spec">
						<view class="spec-tag">{{ order.goods[0].spec || '默认规格' }}</view>
						<view class="product-quantity">×{{ order.goods[0].quantity }}</view>
					</view>
					<view class="product-price">￥{{ order.goods[0].price }}</view>
				</view>
			</view>
			<view class="divider"></view>
			<view class="logistics-status" :class="{ delivered: isOrderDelivered(order) }">
				<image :src="isOrderDelivered(order)
					? '/static/images/pending_delivery/delivered.svg'
					: '/static/images/pending_delivery/road-haul-cargo.svg'" mode="aspectFit"></image>
				<text>{{ getLogisticsStatusText(order) }}</text>
			</view>
			<view class="button-group">
				<view class="not-found-btn" @click="showNotFoundNotice">未找到商品</view>
				<view class="confirm-btn" :class="{ received: isOrderDelivered(order) }"
					@click="confirmDelivery(order)">
					{{ isOrderDelivered(order) ? '已收货' : '确认收货' }}
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view v-if="orderList.length === 0" class="empty-state">
			<image class="empty-image" src="/static/images//common/no-orders.png" mode="aspectFit"></image>
			<text class="empty-text">暂无待收货订单</text>
		</view>

		<!-- 弹窗 -->
		<view v-if="showPopup" class="popup-text" @click="handlePopupConfirm">{{ popupText }}</view>

		<!-- 查找订单提示 -->
		<view class="find-order-tip">
			没有找到订单？试试查看
			<text class="link" @click="gotoOrderComplete">全部订单</text>
		</view>

		<!-- 猜你喜欢 -->
		<view class="guess-like">
			<view class="title">你可能还会喜欢</view>
			<view class="like-list">
				<view class="like-item" v-for="(item, idx) in likeList" :key="idx" @click="goToProductDetail(item)">
					<image :src="item.image" mode="aspectFill"></image>
					<view class="like-card">
						<view class="like-name">{{ item.name }}</view>
						<view class="like-info">
							<text class="price">{{ item.price }}</text>
							<view class="sales">
								<text class="sales-text">已售</text>
								<text class="sales-number">{{ item.sales }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 无推荐商品时显示 -->
			<view v-if="likeList.length === 0" class="no-recommend">
				<text>暂无推荐商品</text>
			</view>
		</view>
	</view>
</template>

<script>
import colors from '@/mixins/color.js'
import { navigateToOrderComplete } from '@/utils/orderNavigation.js'
import { getGroupOrderList, confirmReceipt, getGoodsList } from '@/api/group.js'
import { HTTP_REQUEST_URL } from '@/config/app.js'

export default {
	mixins: [colors],
	data() {
		return {
			status: 'onway', // 订单状态：在路上
			showPopup: false,
			popupText: '',
			orderList: [],
			page: 1,
			limit: 10,
			loading: false,
			likeList: []
		}
	},
	onLoad() {
		this.getOrderList()
		this.getRecommendProducts()
	},
	onShow() {
		// 页面显示时刷新订单状态
		this.getOrderList()
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		formatImage(url) {
			if (!url) return '/static/images/empty_product.png'
			if (url.startsWith('http')) return url
			return HTTP_REQUEST_URL + url
		},

		// 格式化预计送达时间
		formatDeliveryTime(receivingTime) {
			if (!receivingTime) return '今日'

			const deliveryDate = new Date(receivingTime * 1000)
			const now = new Date()

			// 计算日期差异
			const diffTime = deliveryDate - now
			const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))

			// 如果是今天
			if (deliveryDate.toDateString() === now.toDateString()) {
				if (diffHours <= 0) {
					return '刚刚'
				} else if (diffHours < 2) {
					return '1小时内'
				} else if (diffHours < 24) {
					return `${diffHours}小时内`
				}
			}

			// 格式化时间显示
			const hours = deliveryDate.getHours()
			const minutes = deliveryDate.getMinutes()
			return `${deliveryDate.getMonth() + 1}月${deliveryDate.getDate()}日 ${hours}:${minutes < 10 ? '0' + minutes : minutes}`
		},

		// 判断订单是否已送达
		isOrderDelivered(order) {
			// 检查是否有商品的收货时间
			if (order.goods && order.goods.length > 0 && order.goods[0].receiving_time) {
				const receivingTime = order.goods[0].receiving_time * 1000
				const now = new Date().getTime()
				// 如果当前时间已超过预计送达时间，认为已送达
				return now > receivingTime
			}
			return false
		},

		// 获取物流状态文本
		getLogisticsStatusText(order) {
			// 检查是否有商品的收货时间
			if (order.goods && order.goods.length > 0 && order.goods[0].receiving_time) {
				const receivingTime = order.goods[0].receiving_time
				const formattedTime = this.formatDeliveryTime(receivingTime)

				if (this.isOrderDelivered(order)) {
					return `商品已送达，送达时间：${formattedTime}`
				} else {
					return `司机正在路上~ 预计${formattedTime}送达`
				}
			}

			// 默认状态
			return '正在配送中，请耐心等待'
		},

		getOrderList() {
			this.loading = true
			getGroupOrderList({
				page: this.page,
				limit: this.limit,
				status: 1 // 1=待收货
			}).then(res => {
				this.loading = false
				if (res.status === 200 && res.data) {
					this.orderList = res.data.list || []
					console.log('待收货订单列表:', this.orderList)
				} else {
					this.orderList = []
				}
			}).catch((err) => {
				console.error('获取订单列表失败:', err)
				this.loading = false
				this.orderList = []
			})
		},

		confirmDelivery(order) {
			// 如果已送达，不执行操作
			if (this.isOrderDelivered(order)) {
				return
			}

			// 显示确认弹窗
			uni.showModal({
				title: '确认收货',
				content: '确定已收到商品了吗？',
				success: (res) => {
					if (res.confirm) {
						confirmReceipt({
							order_id: order.id || order.order_id || order.order_number
						}).then(resp => {
							if (resp.status === 200) {
								this.popupText = '收货成功！'
								this.showPopup = true
								setTimeout(() => {
									this.showPopup = false
									this.getOrderList() // 刷新列表
								}, 2000)
							} else {
								this.popupText = resp.msg || '确认收货失败'
								this.showPopup = true
								setTimeout(() => {
									this.showPopup = false
								}, 2000)
							}
						}).catch(err => {
							console.error('确认收货失败:', err)
							this.popupText = '确认收货失败，请稍后再试'
							this.showPopup = true
							setTimeout(() => {
								this.showPopup = false
							}, 2000)
						})
					}
				}
			})
		},

		showNotFoundNotice() {
			this.popupText = '未找到商品？已反馈平台管理员'
			this.showPopup = true
			setTimeout(() => {
				this.showPopup = false
			}, 2000)
		},

		gotoOrderComplete() {
			uni.navigateTo({
				url: '/pages/goods/order_list/all_orders'
			})
		},

		handlePopupConfirm() {
			this.showPopup = false
		},

		getRecommendProducts() {
			getGoodsList({
				is_recommend: '1',
				limit: 4
			}).then(res => {
				if (res.status === 200 && res.data) {
					// 处理推荐商品数据
					this.likeList = (res.data.goodsList || []).map(item => {
						return {
							id: item.id,
							image: this.formatImage(item.image),
							name: item.title,
							price: item.min_price,
							sales: item.fake_sales + '件'
						}
					}).slice(0, 4) // 只显示前4个商品
				}
			}).catch(err => {
				console.error('获取推荐商品失败:', err)
			})
		},

		// 跳转到商品详情页
		goToProductDetail(item) {
			if (item && item.id) {
				uni.navigateTo({
					url: `/pages/goods_details/index?id=${item.id}`
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
/* 样式保持不变，已包含在原代码中 */
.pending-delivery-container {
	min-height: 100vh;
	background-color: #F0F0F0;

	.header {
		background-color: #FFFFFF;

		.nav-bar {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 88rpx;

			.left {
				position: absolute;
				left: 30rpx;
				display: flex;
				align-items: center;

				.back-icon {
					width: 20rpx;
					height: 36rpx;
					margin-right: 10rpx;
				}

				text {
					color: #333333;
					font-size: 36rpx;
					margin-left: 10rpx;
				}
			}

			.title {
				font-size: 36rpx;
				font-weight: 400;
				color: #1A1A1A;
			}
		}
	}

	// 订单卡片样式省略，保持不变
	.order-card {
		background: #FFFFFF;
		border-radius: 8rpx;
		margin: 20rpx 30rpx;
		padding: 30rpx;

		.logistics-status {
			padding: 20rpx 30rpx;
			color: #000000;
			font-size: 30rpx;
			margin-bottom: 30rpx;
			background-color: #F8F8F8;
			border-radius: 8rpx;
			display: flex;
			align-items: center;

			image {
				width: 40rpx;
				height: 40rpx;
				margin-right: 16rpx;
			}

			&.delivered {
				background-color: #F0FFF4;
				color: #00B42A;

				image {
					width: 44rpx;
					height: 44rpx;
				}
			}
		}

		.button-group {
			.confirm-btn.received {
				background: #868686;
				cursor: default;
			}
		}
	}

	// 其他样式省略，保持不变
}
</style>
