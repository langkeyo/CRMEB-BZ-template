<template>
	<view class="page-container">
		<!-- 顶部导航栏 -->
		<view class="page-header">
			<view class="header-left" @click="goBack">
				<image class="back-icon" src="/static/icons/back-arrow.svg"></image>
				<text class="back-text">返回</text>
			</view>
			<view class="header-title">全部订单</view>
		</view>

		<!-- 订单列表 -->
		<view class="order-list">
			<view class="order-item" v-for="(item, index) in orderList" :key="index">
				<!-- 订单时间和状态 -->
				<view class="order-header">
					<view class="order-time">下单时间：{{ formatTime(item.create_time || item._add_time) }}</view>
					<view class="order-status">{{ item.status_text || '订单完成' }}</view>
				</view>

				<!-- 商品信息列表 -->
				<view class="products-list">
					<!-- 显示所有商品 -->
					<view class="product-info" v-for="(product, productIndex) in getOrderProducts(item)"
						:key="productIndex" @click="goOrderDetails(item.id || item.order_id)">
						<image class="product-image" :src="formatImage(product.image)"></image>
						<view class="product-detail">
							<view class="product-name">{{ product.name }}</view>
							<view class="product-spec" v-if="product.spec">{{ product.spec }}</view>
							<view class="product-quantity">x{{ product.quantity }}</view>
							<view class="product-price">¥{{ product.price }}</view>
							<!-- 单个商品退款按钮 -->
							<view class="refund-btn" @click.stop="applySingleProductRefund(item, product, productIndex)" 
								v-if="(item.status === 1 || item.status === 2) && item.goods && item.goods[productIndex]">
								申请退款
							</view>
						</view>
					</view>
				</view>

				<!-- 订单总计 -->
				<view class="order-total">
					<view class="total-left">共{{ getGoodsCount(item) }}件商品</view>
					<view class="total-right">实际支付 ¥ {{ item.pay_price || '0.00' }} (含配送费0)</view>
				</view>

				<!-- 操作按钮 -->
				<view class="order-actions">
					<view class="action-btn service-btn" @click.stop="applyAfterSales(item)"
						v-if="item.status === 1 || item.status === 2">申请售后</view>
					<view class="action-btn comment-btn" @click.stop="goComment(item)" v-if="item.status === 2">去评论
					</view>
					<view class="action-btn pay-btn" @click.stop="goPay(item)" v-if="item.status === 0">去支付</view>
				</view>
			</view>

			<!-- 加载更多 -->
			<view class="loading-more" v-if="orderList.length >= limit && (loading || loadend)">
				<text class="loading-text">{{ loading ? '加载中...' : loadTitle }}</text>
			</view>

			<!-- 空状态 -->
			<view class="empty-state" v-if="orderList.length === 0 && !loading">
				<image class="empty-image" src="/static/images/empty-order.png" mode="aspectFit"></image>
				<text class="empty-text">暂无订单</text>
			</view>
		</view>
	</view>
</template>

<script>
import { getOrderList, orderData } from '@/api/order.js'
import { getGroupOrderList, payGroupOrder } from '@/api/group.js'
import { HTTP_REQUEST_URL } from '@/config/app.js'
import emptyPage from '@/components/emptyPage.vue'
import { mapGetters } from "vuex"
import colors from '@/mixins/color.js'

export default {
	components: {
		emptyPage
	},
	mixins: [colors],
	data() {
		return {
			orderList: [],
			page: 1,
			limit: 10,
			loading: false,
			loadend: false,
			loadTitle: '加载更多',
			orderData: {
				order_count: 0,
				sum_price: 0,
				unpaid_count: 0,
				unshipped_count: 0,
				received_count: 0,
				evaluated_count: 0
			},
			HTTP_REQUEST_URL: HTTP_REQUEST_URL
		}
	},
	computed: mapGetters(['isLogin']),
	onLoad() {
		this.getOrderData()
		this.getOrderList()
	},
	onReachBottom() {
		this.getOrderList()
	},
	methods: {
		// 返回上一页
		goBack() {
			uni.navigateBack({
				delta: 1
			})
		},

		// 获取订单列表
		getOrderList() {
			if (this.loading || this.loadend) return
			this.loading = true

			// 优先获取团购订单，失败则获取普通订单
			this.getGroupOrderList().catch(() => {
				getOrderList({
					page: this.page,
					limit: this.limit,
					type: 9 // 全部订单
				}).then(res => {
					this.loading = false
					let list = res.data
					let loadend = list.length < this.limit
					this.orderList = this.orderList.concat(list)
					this.loadend = loadend
					this.loadTitle = loadend ? '我也是有底线的' : '加载更多'
					this.page = this.page + 1
				}).catch(err => {
					this.loading = false
					this.$util.Tips({
						title: err
					})
				})
			})
		},

		// 获取团购订单列表
		getGroupOrderList() {
			return new Promise((resolve, reject) => {
				getGroupOrderList({
					page: this.page,
					limit: this.limit,
					status: '' // 全部状态
				}).then(res => {
					this.loading = false
					if (res.status === 200 && res.data) {
						let list = res.data.list || res.data
						let loadend = list.length < this.limit

						// 转换团购订单数据格式以适配页面显示
						const formattedList = list.map(item => ({
							id: item.id || item.order_id,
							order_id: item.id || item.order_id,
							order_number: item.order_number,
							create_time: item.create_time,
							status: item.status,
							status_text: item.status_text || '订单完成',
							pay_price: item.pay_price,
							total_price: item.total_price,
							goods: item.goods || [],
							// 其他必要字段的映射
							...item
						}))

						this.orderList = this.page === 1 ? formattedList : this.orderList.concat(formattedList)
						this.loadend = loadend
						this.loadTitle = loadend ? '我也是有底线的' : '加载更多'
						this.page = this.page + 1
						resolve(res)
					} else {
						reject(new Error('团购订单数据格式错误'))
					}
				}).catch(err => {
					this.loading = false
					reject(err)
				})
			})
		},

		// 获取订单数据
		getOrderData() {
			orderData().then(res => {
				this.orderData = res.data
			})
		},

		// 跳转到订单详情
		goOrderDetails(orderId) {
			uni.navigateTo({
				url: `/pages/goods/order_details/index?order_id=${orderId}`
			})
		},

		// 申请售后
		applyAfterSales(item) {
			uni.navigateTo({
				url: `/pages/users/after_sales/apply?order_id=${item.id || item.order_id}`
			})
		},

		// 单个商品申请退款
		applySingleProductRefund(item, product, productIndex) {
			// 获取商品ID
			const goodsId = item.goods && item.goods[productIndex] ? item.goods[productIndex].goods_id : '';
			
			// 跳转到售后申请页面，传递订单ID和商品ID
			uni.navigateTo({
				url: `/pages/users/after_sales/apply?order_id=${item.id || item.order_id}&goods_id=${goodsId}`
			})
		},

		// 去评论
		goComment(item) {
			if (!item.goods || item.goods.length === 0) {
				if (!item.cartInfo || item.cartInfo.length === 0) return
				uni.navigateTo({
					url: `/pages/users/after_sales/evaluate?unique=${item.cartInfo[0].unique}&order_id=${item.order_id}`
				})
			} else {
				uni.navigateTo({
					url: `/pages/users/after_sales/evaluate?goods_id=${item.goods[0].goods_id}&order_id=${item.id}`
				})
			}
		},

		// 去支付
		goPay(item) {
			payGroupOrder(item.id || item.order_id).then(res => {
				if (res.status === 200) {
					// 处理支付逻辑
					uni.navigateTo({
						url: `/pages/goods/pending_payment/index?order_id=${item.id || item.order_id}`
					})
				} else {
					uni.showToast({
						title: res.msg || '支付失败',
						icon: 'none'
					})
				}
			}).catch(err => {
				uni.showToast({
					title: '支付失败',
					icon: 'none'
				})
			})
		},

		// 格式化时间戳
		formatTime(timestamp) {
			if (!timestamp) return ''

			// 如果是字符串日期，直接返回
			if (typeof timestamp === 'string' && timestamp.includes('-')) {
				return timestamp
			}

			// 转换为数字
			const ts = parseInt(timestamp)
			if (isNaN(ts)) return ''

			const date = new Date(ts * 1000)
			const year = date.getFullYear()
			const month = String(date.getMonth() + 1).padStart(2, '0')
			const day = String(date.getDate()).padStart(2, '0')

			return `${year}-${month}-${day}`
		},

		// 格式化图片URL
		formatImage(url) {
			if (!url) return ''

			// 如果已经是完整URL，直接返回
			if (url.startsWith('http')) {
				return url
			}

			// 拼接域名
			return HTTP_REQUEST_URL + url
		},

		// 获取商品总数
		getGoodsCount(item) {
			if (item.goods && item.goods.length > 0) {
				return item.goods.reduce((total, good) => total + (parseInt(good.quantity) || 1), 0)
			}

			if (item.cartInfo && item.cartInfo.length > 0) {
				return item.cartInfo.reduce((total, cart) => total + (parseInt(cart.cart_num) || 1), 0)
			}

			return item.total_num || 1
		},

		// 安全获取商品图片
		getProductImage(item) {
			if (item.goods && item.goods[0] && item.goods[0].image) {
				return this.formatImage(item.goods[0].image)
			}

			if (item.cartInfo && item.cartInfo[0] && item.cartInfo[0].productInfo && item.cartInfo[0].productInfo.image) {
				return this.formatImage(item.cartInfo[0].productInfo.image)
			}

			return '/static/images/default-product.png'
		},

		// 安全获取商品名称
		getProductName(item) {
			if (item.goods && item.goods[0] && item.goods[0].title) {
				return item.goods[0].title
			}

			if (item.cartInfo && item.cartInfo[0] && item.cartInfo[0].productInfo && item.cartInfo[0].productInfo.store_name) {
				return item.cartInfo[0].productInfo.store_name
			}

			return '未知商品'
		},

		// 安全获取商品价格
		getProductPrice(item) {
			if (item.goods && item.goods[0] && item.goods[0].price) {
				return item.goods[0].price
			}

			if (item.cartInfo && item.cartInfo[0] && item.cartInfo[0].productInfo) {
				const productInfo = item.cartInfo[0].productInfo
				if (productInfo.attrInfo && productInfo.attrInfo.price) {
					return productInfo.attrInfo.price
				}
				if (productInfo.price) {
					return productInfo.price
				}
			}

			return '0.00'
		},

		// 安全获取商品规格
		getProductSpec(item) {
			if (item.cartInfo && item.cartInfo[0] && item.cartInfo[0].productInfo && item.cartInfo[0].productInfo.attrInfo && item.cartInfo[0].productInfo.attrInfo.suk) {
				return item.cartInfo[0].productInfo.attrInfo.suk
			}

			return ''
		},

		// 获取订单中的所有商品
		getOrderProducts(item) {
			const products = []

			// 处理 goods 格式的数据
			if (item.goods && Array.isArray(item.goods)) {
				item.goods.forEach(good => {
					products.push({
						name: good.title || good.store_name || '未知商品',
						image: good.image || '/static/images/default-product.png',
						price: good.price || '0.00',
						quantity: good.quantity || 1,
						spec: good.spec || good.sku || ''
					})
				})
			}
			// 处理 cartInfo 格式的数据
			else if (item.cartInfo && Array.isArray(item.cartInfo)) {
				item.cartInfo.forEach(cart => {
					const productInfo = cart.productInfo || {}
					const attrInfo = productInfo.attrInfo || {}

					products.push({
						name: productInfo.store_name || productInfo.title || '未知商品',
						image: productInfo.image || '/static/images/default-product.png',
						price: attrInfo.price || productInfo.price || '0.00',
						quantity: cart.cart_num || cart.quantity || 1,
						spec: attrInfo.suk || attrInfo.spec || ''
					})
				})
			}
			// 如果没有商品数据，返回一个默认商品
			else {
				products.push({
					name: '未知商品',
					image: '/static/images/default-product.png',
					price: item.pay_price || '0.00',
					quantity: 1,
					spec: ''
				})
			}

			return products
		}
	}
}
</script>

<style lang="scss" scoped>
.page-container {
	background-color: #F0F0F0;
	min-height: 100vh;
}

.page-header {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 44px;
	background-color: #fff;
	position: relative;

	.header-left {
		display: flex;
		align-items: center;
		position: absolute;
		left: 13px;
		top: 50%;
		transform: translateY(-50%);

		.back-icon {
			width: 7px;
			height: 13px;
			margin-right: 9px;
		}

		.back-text {
			font-size: 18px;
			font-weight: 400;
			color: #333333;
			font-family: 'PingFang SC';
		}
	}

	.header-title {
		font-size: 18px;
		font-weight: 400;
		color: #1A1A1A;
		font-family: 'PingFang SC';
	}
}

.order-list {
	padding: 10px 12px;

	.order-item {
		background-color: #fff;
		border-radius: 4px;
		margin-bottom: 10px;
		padding: 0;

		.order-header {
			display: flex;
			justify-content: space-between;
			padding: 8px 7px;
			border-bottom: 0.5px solid #F0F0F0;

			.order-time {
				font-size: 13px;
				color: #B3B3B3;
				font-family: 'PingFang SC';
				font-weight: 400;
			}

			.order-status {
				font-size: 15px;
				color: #333333;
				font-family: 'PingFang SC';
				font-weight: 400;
			}
		}

		.products-list {
			.product-info {
				display: flex;
				padding: 12px 7px;

				/* 多个商品时添加分隔线 */
				&:not(:last-child) {
					border-bottom: 0.5px solid #F0F0F0;
				}

				.product-image {
					width: 99px;
					height: 95px;
					border-radius: 4px;
					margin-right: 10px;
					background-color: #f7f7f7;
				}

				.product-detail {
					flex: 1;
					position: relative;

					.product-name {
						font-size: 18px;
						color: #000000;
						font-family: 'PingFang SC';
						font-weight: 400;
						margin-bottom: 8px;
						line-height: 25px;
					}

					.product-spec {
						display: inline-block;
						background-color: #F7F7F7;
						padding: 1.5px 7px;
						border-radius: 6px;
						font-size: 14px;
						color: #999999;
						font-family: 'PingFang SC';
						font-weight: 400;
						margin-bottom: 8px;
						line-height: 20px;
					}

					/* 只添加商品数量的样式，保持你原有的设计风格 */
					.product-quantity {
						font-size: 14px;
						color: #666666;
						font-family: 'PingFang SC';
						font-weight: 400;
						margin-bottom: 8px;
					}

					.product-price {
						font-size: 15px;
						color: #1A1A1A;
						font-family: 'PingFang SC';
						font-weight: 400;
						line-height: 21px;
					}

					/* 单个商品退款按钮样式 */
					.refund-btn {
						position: absolute;
						right: 0;
						bottom: 0;
						border: 1px solid #E5E5E5;
						border-radius: 15px;
						padding: 2px 10px;
						font-size: 13px;
						color: #000000;
						font-family: 'PingFang SC';
						font-weight: 400;
						background-color: #FFFFFF;
					}
				}
			}
		}

		.order-total {
			display: flex;
			justify-content: space-between;
			padding: 8px 7px;
			border-top: 0.5px solid #F0F0F0;

			.total-left {
				font-size: 15px;
				color: #999999;
				font-family: 'PingFang SC';
				font-weight: 400;
				line-height: 21px;
			}

			.total-right {
				font-size: 15px;
				color: #1A1A1A;
				font-family: 'PingFang SC';
				font-weight: 400;
				line-height: 21px;
			}
		}

		.order-actions {
			display: flex;
			justify-content: flex-end;
			padding: 8px 7px;

			.action-btn {
				height: 30px;
				border-radius: 15px;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0 15px;
				margin-left: 10px;
				font-size: 15px;
				font-family: 'PingFang SC';
				font-weight: 400;
				line-height: 21px;
			}

			.service-btn {
				border: 1px solid #E5E5E5;
				color: #000000;
			}

			.comment-btn {
				background-color: #FE8D00;
				color: #FFFFFF;
			}

			.pay-btn {
				background-color: #FF4400;
				color: #FFFFFF;
			}
		}
	}

	.loading-more {
		text-align: center;
		padding: 15px 0;

		.loading-text {
			font-size: 14px;
			color: #999;
		}
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 100rpx 0;

		.empty-image {
			width: 200rpx;
			height: 200rpx;
			margin-bottom: 20rpx;
		}

		.empty-text {
			font-size: 28rpx;
			color: #999;
		}
	}
}
</style>
