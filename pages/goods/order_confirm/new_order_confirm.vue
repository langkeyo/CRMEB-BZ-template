<template>
	<view class="order-confirm">
		<!-- 支付方式选择弹窗 -->
		<view class="payment-mask" v-if="showPaymentModal" @click.stop="closePaymentModal"></view>
		<view class="payment-modal" v-if="showPaymentModal">
			<view class="payment-options">
				<view class="payment-option" @click="selectPayment('wechat')">
					<view class="payment-icon wechat-icon">
						<image src="/static/images/payment/wechat_icon.png" mode="widthFix"></image>
					</view>
					<view class="payment-name">微信支付</view>
					<view class="payment-check" :class="{ active: selectedPayment === 'wechat' }"></view>
				</view>
			</view>
			<view class="payment-btn" @click="confirmPayment">
				<text>立即支付 ¥{{ goods.price }}</text>
			</view>
		</view>

		<!-- 优惠券选择弹窗 -->
		<view class="payment-mask" v-if="showCouponModal" @click.stop="closeCouponModal"></view>
		<view class="coupon-modal" v-if="showCouponModal">
			<view class="coupon-header">
				<text>选择优惠券</text>
				<text class="close-icon" @click="closeCouponModal">×</text>
			</view>
			<view class="coupon-list">
				<view v-if="availableCoupons.length === 0" class="no-coupon">
					<text>暂无可用优惠券</text>
				</view>
				<view v-for="(coupon, index) in availableCoupons" :key="index" class="coupon-item"
					:class="{ active: selectedCoupons.includes(coupon.id) }" @click="toggleCoupon(coupon.id)">
					<view class="coupon-left">
						<text class="coupon-amount">¥{{ coupon.discount_amount }}</text>
					</view>
					<view class="coupon-right">
						<text class="coupon-name">{{ coupon.name }}</text>
						<text class="coupon-limit">满{{ coupon.min_amount }}元可用</text>
						<text class="coupon-expire">有效期至{{ formatDate(coupon.expire_time) }}</text>
					</view>
					<view class="coupon-check" :class="{ active: selectedCoupons.includes(coupon.id) }"></view>
				</view>
			</view>
			<view class="coupon-btn" @click="confirmCoupon">
				<text>确认使用</text>
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
			<view class="address-tag">{{ siteInfo.type || '站点自提' }}</view>
			<view class="address-content">
				<view class="user-info"><text class="user-name">收货人：</text>{{ userInfo.nickname || '未登录' }}</view>
				<view class="address-detail"><text class="address-text">收货地址：</text>{{ siteInfo.location ||
					'北京尚德井小区菜鸟驿站' }}</view>
				<view class="delivery-time"><text class="time-text">送货时间：</text>{{ siteInfo.deliveryTime || '今日8：00前送达'
				}}</view>
			</view>
		</view>
		<view class="goods-card">
			<!-- 商品信息 -->
			<view class="goods-box">
				<view class="goods-image">
					<image :src="goods.image" mode="aspectFill"></image>
				</view>
				<view class="goods-info">
					<view class="goods-name">{{ goods.name }}</view>
					<view class="price-change" v-if="goods.oldPrice > goods.price">比加入时降价￥{{ goods.oldPrice -
						goods.price }}元</view>
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
				<view class="fee-item" @click="openCouponModal">
					<text>商家代金券</text>
					<view class="coupon-info">
						<text v-if="selectedCoupons.length === 0">暂无可用</text>
						<text v-else>已选择{{ selectedCoupons.length }}张券</text>
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
				<view class="recommend-item" v-for="item in recommendProducts" :key="item.id"
					@click="goToProductDetail(item.id)">
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
				<text class="payment-price">￥{{ calculateTotalPrice() }}</text>
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
import { createGroupOrder, payOrder, getOrderCoupons, getCombinationDetail, setOrderCoupon, getRecommendCombinations } from '@/api/group'
import { mapGetters } from 'vuex'

export default {
	data() {
		return {
			showPaymentModal: false, // 支付弹窗显示状态
			selectedPayment: 'wechat', // 默认选择微信支付
			showOrderConfirm: false, // 下单确认弹窗显示状态
			showCouponModal: false, // 优惠券弹窗显示状态
			availableCoupons: [], // 可用优惠券列表
			selectedCoupons: [], // 已选优惠券ID数组
			couponDiscount: 0, // 优惠券抵扣金额
			goods: {
				name: '香水柠檬50g/个',
				price: 15,
				oldPrice: 17,
				quantity: 1,
				image: '/static/images/today-group-buying/order_confirm/lemon.png'
			},
			recommendProducts: [],
			combination_id: 0, // 拼团商品配置ID
			orderData: null, // 订单数据
			user_coupon_ids: [], // 用户优惠券ID数组
			orderId: 0, // 创建的订单ID
			remark: '', // 订单备注
			loading: false, // 加载状态
			loadingProduct: false // 商品加载状态
		}
	},
	computed: {
		...mapGetters(['userInfo', 'siteInfo'])
	},
	methods: {
		goBack() {
			if (getCurrentPages().length > 1) {
				uni.navigateBack()
			} else {
				uni.switchTab({
					url: '/pages/index/index' // 或你想要的首页路径
				})
			}
		},
		minusQuantity() {
			if (this.goods.quantity > (this.goods.minBuyNum || 1)) {
				this.goods.quantity--
			} else {
				uni.showToast({
					title: `最少购买${this.goods.minBuyNum || 1}件`,
					icon: 'none'
				})
			}
		},
		addQuantity() {
			// 检查是否达到最大购买数量限制
			if (this.goods.maxBuyNum > 0 && this.goods.quantity >= this.goods.maxBuyNum) {
				uni.showToast({
					title: `最多购买${this.goods.maxBuyNum}件`,
					icon: 'none'
				})
				return
			}

			// 检查是否超过库存
			if (this.goods.stock > 0 && this.goods.quantity >= this.goods.stock) {
				uni.showToast({
					title: '库存不足',
					icon: 'none'
				})
				return
			}

			this.goods.quantity++
		},
		payNow() {
			// 创建订单
			this.createOrder().then(() => {
				// 显示支付方式选择弹窗
				this.showPaymentModal = true
			}).catch(err => {
				uni.showToast({
					title: err.message || '创建订单失败',
					icon: 'none'
				})
			})
		},
		// 创建订单
		async createOrder() {
			if (this.loading) return

			// 检查站点信息
			if (!this.checkSiteInfo()) {
				uni.showToast({
					title: '请先绑定社区',
					icon: 'none'
				})
				return
			}

			this.loading = true
			uni.showLoading({ title: '创建订单中...' })

			try {
				// 构建订单数据
				const orderData = {
					combination_id: this.combination_id,
					quantity: this.goods.quantity,
					user_coupon_ids: this.selectedCoupons.join(','),
					remark: this.remark
				}

				// 如果有社区信息，添加社区ID
				if (this.siteInfo.community && this.siteInfo.community.id) {
					orderData.community_id = this.siteInfo.community.id
				}

				// 调用创建订单API
				const response = await createGroupOrder(orderData)

				// 处理登录状态错误
				if (response.status === 110002) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					})
					// 延迟跳转到登录页
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/index'
						})
					}, 1500)
					return
				}

				if (response.status === 200) {
					this.orderId = response.data.order_id
					this.orderData = response.data
					uni.hideLoading()
					return response.data
				} else if (response.msg && response.msg.includes("您有订单未结清")) {
					// 处理订单未结清错误
					uni.showModal({
						title: '提示',
						content: '您有订单未结清，请结清后再次下单',
						showCancel: true,
						cancelText: '取消',
						confirmText: '查看未结清订单',
						success: (res) => {
							if (res.confirm) {
								// 跳转到待支付订单页面
								uni.navigateTo({
									url: '/pages/goods/order_list/pending'
								})
							}
						}
					})
					throw new Error(response.msg)
				} else {
					throw new Error(response.msg || '创建订单失败')
				}
			} catch (error) {
				console.error('创建订单失败', error)
				throw error
			} finally {
				this.loading = false
				uni.hideLoading()
			}
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
			this.createOrder().then(() => {
				uni.navigateTo({
					url: `/pages/goods/pending_payment/index?order_id=${this.orderId}`
				})
			}).catch(err => {
				uni.showToast({
					title: err.message || '创建订单失败',
					icon: 'none'
				})
			})
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
			if (!this.orderId) {
				uni.showToast({
					title: '订单信息无效',
					icon: 'none'
				})
				return
			}

			// 调用支付接口
			uni.showLoading({
				title: '正在支付...'
			})

			// 根据选择的支付方式设置pay_type
			const payTypeMap = {
				'wechat': 1
			}

			// 调用支付API
			payOrder(this.orderId, { pay_type: payTypeMap[this.selectedPayment] || 1 })
				.then(res => {
					uni.hideLoading()

					// 处理登录状态错误
					if (res.status === 110002) {
						uni.showToast({
							title: '请先登录',
							icon: 'none'
						})
						// 延迟跳转到登录页
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/login/index'
							})
						}, 1500)
						return
					}

					if (res.status === 200) {
						uni.showToast({
							title: '支付成功',
							icon: 'success'
						})

						// 跳转到支付成功页面
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/goods/payment_success/index?order_id=' + this.orderId
							})
						}, 1500)
					} else {
						throw new Error(res.msg || '支付失败')
					}
				})
				.catch(err => {
					uni.hideLoading()
					uni.showToast({
						title: err.message || '支付失败',
						icon: 'none'
					})
				})

			// 关闭弹窗
			this.showPaymentModal = false
		},
		// 获取订单可用优惠券
		async fetchAvailableCoupons() {
			if (!this.orderId) return

			uni.showLoading({ title: '加载中...' })
			try {
				const res = await getOrderCoupons({ order_id: this.orderId })
				if (res.status === 200 && res.data.available_coupons) {
					this.availableCoupons = res.data.available_coupons
					return res.data.available_coupons
				} else {
					this.availableCoupons = []
				}
			} catch (error) {
				console.error('获取可用优惠券失败', error)
				this.availableCoupons = []
				uni.showToast({
					title: '获取优惠券失败',
					icon: 'none'
				})
			} finally {
				uni.hideLoading()
			}
		},
		// 打开优惠券弹窗
		openCouponModal() {
			if (!this.orderId) {
				// 如果没有订单ID，需要先创建订单
				this.createOrder().then(() => {
					this.fetchAvailableCoupons()
					this.showCouponModal = true
				}).catch(err => {
					uni.showToast({
						title: err.message || '请先创建订单',
						icon: 'none'
					})
				})
			} else {
				this.fetchAvailableCoupons()
				this.showCouponModal = true
			}
		},
		// 关闭优惠券弹窗
		closeCouponModal() {
			this.showCouponModal = false
		},
		// 切换选择优惠券
		toggleCoupon(couponId) {
			const index = this.selectedCoupons.indexOf(couponId)
			if (index > -1) {
				// 已选中，取消选择
				this.selectedCoupons.splice(index, 1)
			} else {
				// 未选中，添加选择
				this.selectedCoupons.push(couponId)
			}
		},
		// 确认使用优惠券
		async confirmCoupon() {
			if (!this.orderId || this.loading) return

			this.loading = true
			uni.showLoading({ title: '应用优惠券中...' })

			try {
				const res = await setOrderCoupon({
					order_id: this.orderId,
					user_coupon_ids: this.selectedCoupons.join(',')
				})

				if (res.status === 200) {
					this.couponDiscount = res.data.total_discount || 0

					uni.showToast({
						title: '优惠券应用成功',
						icon: 'success'
					})

					this.closeCouponModal()
				} else {
					throw new Error(res.msg || '应用优惠券失败')
				}
			} catch (error) {
				console.error('应用优惠券失败', error)
				uni.showToast({
					title: error.message || '应用优惠券失败',
					icon: 'none'
				})
			} finally {
				this.loading = false
				uni.hideLoading()
			}
		},
		// 格式化日期
		formatDate(timestamp) {
			if (!timestamp) return ''
			const date = new Date(timestamp * 1000)
			return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
		},
		// 计算总价
		calculateTotalPrice() {
			const goodsTotal = this.goods.price * this.goods.quantity
			return (goodsTotal - this.couponDiscount).toFixed(2)
		},
		// 去更多商品页面
		goToMore() {
			uni.navigateTo({
				url: '/pages/goods/goods_list/index'
			})
		},
		// 加载商品详情
		async loadProductDetails() {
			if (!this.combination_id || this.loadingProduct) return

			this.loadingProduct = true
			uni.showLoading({ title: '加载中...' })

			try {
				const res = await getCombinationDetail(this.combination_id)

				// 处理登录状态错误
				if (res.status === 110002) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					})
					// 延迟跳转到登录页
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/index'
						})
					}, 1500)
					return
				}

				if (res.status === 200 && res.data) {

					const productData = res.data
					// 更新商品信息
					this.goods = {
						name: productData.title || '商品名称',
						price: parseFloat(productData.group_price) || 0,
						oldPrice: parseFloat(productData.original_price) || 0,
						quantity: 1,
						image: productData.image ? (productData.image.startsWith('http') ? productData.image : this.$util.getImageUrl(productData.image)) : this.goods.image,
						stock: productData.stock || 0,
						description: productData.description || '',
						minBuyNum: productData.min_buy_num || 1,
						maxBuyNum: productData.max_buy_num || 0
					}

					// 如果有最小购买数量限制，设置初始数量
					if (this.goods.minBuyNum > 1) {
						this.goods.quantity = this.goods.minBuyNum
					}

					// 处理商品图片
					if (productData.images && productData.images.length > 0) {
						// 处理图片路径
						const processedImages = productData.images.map(img =>
							img.startsWith('http') ? img : this.$util.getImageUrl(img)
						)

						// 可以在这里存储商品的多张图片，如果需要展示的话
						this.goods.imageList = processedImages
					}

					// 更新收货时间信息到全局站点信息
					if (productData.receiving_time_text || productData.receiving_time) {
						let deliveryTime = ''

						// 优先使用已格式化的文本
						if (productData.receiving_time_text) {
							deliveryTime = productData.receiving_time_text + ' 前送达'
						}
						// 如果没有格式化文本但有时间戳，则格式化时间戳
						else if (productData.receiving_time) {
							const date = new Date(productData.receiving_time * 1000)
							deliveryTime = this.formatDate(date) + ' 前送达'
						}

						if (deliveryTime) {
							// 更新全局站点信息中的配送时间
							const updatedSiteInfo = { ...this.siteInfo, deliveryTime }
							this.$store.dispatch('SET_SITEINFO', updatedSiteInfo)
						}
					}
				} else {
					throw new Error(res.msg || '获取商品信息失败')
				}
			} catch (error) {
				console.error('获取商品详情失败', error)
				uni.showToast({
					title: error.message || '获取商品信息失败',
					icon: 'none'
				})
			} finally {
				this.loadingProduct = false
				uni.hideLoading()
			}
		},
		// 获取推荐商品
		async fetchRecommendProducts() {
			if (this.loading) return

			this.loading = true
			uni.showLoading({ title: '加载中...' })

			try {
				const res = await getRecommendCombinations()

				// 处理登录状态错误
				if (res.status === 110002) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					})
					// 延迟跳转到登录页
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/index'
						})
					}, 1500)
					return
				}

				if (res.status === 200 && res.data) {
					this.recommendProducts = res.data.map(item => ({
						id: item.id,
						name: item.title || '商品名称',
						price: parseFloat(item.group_price) || 0,
						image: item.image ? (item.image.startsWith('http') ? item.image : this.$util.getImageUrl(item.image)) : '/static/images/today-group-buying/order_confirm/lemon.png'
					}))
				} else {
					throw new Error(res.msg || '获取推荐商品失败')
				}
			} catch (error) {
				console.error('获取推荐商品失败', error)
				uni.showToast({
					title: error.message || '获取推荐商品失败',
					icon: 'none'
				})
			} finally {
				this.loading = false
				uni.hideLoading()
			}
		},
		// 跳转到商品详情页
		goToProductDetail(productId) {
			uni.navigateTo({
				url: `/pages/goods/order_confirm/new_order_confirm?id=${productId}`
			})
		},
		// 初始化站点信息，如果全局没有则设置默认值
		initSiteInfo() {
			// 如果全局站点信息为空，则设置默认站点信息
			if (!this.siteInfo.name || !this.siteInfo.location) {
				const defaultSiteInfo = {
					name: this.userInfo.nickname || 'Eetin',
					location: '北京尚德井小区菜鸟驿站',
					deliveryTime: '今日8：00前送达',
					type: '站点自提'
				}

				// 存储到全局
				this.$store.dispatch('SET_SITEINFO', defaultSiteInfo)
			}
		},

		// 创建订单前检查站点信息
		checkSiteInfo() {
			// 检查是否有社区信息
			if (this.siteInfo.community && this.siteInfo.community.id) {
				// 这里可以将社区ID添加到订单数据中
				return true
			} else {
				// 如果没有社区信息，可以提示用户或使用默认值
				return true
			}
		}
	},
	onLoad(options) {
		// 获取URL参数
		if (options.id) {
			this.combination_id = parseInt(options.id) || 0
			// 加载商品详情
			this.loadProductDetails()
			// 获取推荐商品
			this.fetchRecommendProducts()
		}

		// 初始化站点信息
		this.initSiteInfo()
	},
	mounted() {
		this.$nextTick(() => {
			// 使用setTimeout确保DOM已完全渲染
			setTimeout(() => {
				const contentEl = document.querySelector('.uni-scroll-view-content')
				if (contentEl) {
					contentEl.style.display = 'flex'
					contentEl.style.justifyContent = 'space-evenly'
					contentEl.style.alignItems = 'flex-start'
					contentEl.style.width = '100%'
					contentEl.style.padding = '10rpx 0'
				}
			}, 500)
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

		:deep(.uni-scroll-view-content) {
			display: flex !important;
			justify-content: space-evenly !important;
			align-items: flex-start !important;
			flex-wrap: nowrap !important;
			width: 100% !important;
			padding: 10rpx 0 !important;
		}

		.recommend-item {
			width: 30%;
			display: inline-block;
			vertical-align: top;
			// text-align: center;
			margin: 0 10rpx;

			.recommend-image {
				width: 180rpx;
				height: 180rpx;
				border-radius: 8rpx;
				background: #f5f5f5;
				margin: 0 auto;
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
				text-align: left;
			}

			.recommend-price {
				font-size: 30rpx;
				color: #1A1A1A;
				margin-top: 10rpx;
				font-weight: 550;
				text-align: left;
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

/* 优惠券弹窗样式 */
.coupon-modal {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #FFFFFF;
	border-radius: 16rpx 16rpx 0 0;
	z-index: 1000;
	overflow: hidden;

	.coupon-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1rpx solid #EEEEEE;

		text {
			font-size: 32rpx;
			color: #333;
			font-weight: 500;
		}

		.close-icon {
			font-size: 48rpx;
			color: #999;
			line-height: 1;
		}
	}

	.coupon-list {
		max-height: 60vh;
		overflow-y: auto;
		padding: 20rpx 0;

		.no-coupon {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 200rpx;
			color: #999;
			font-size: 28rpx;
		}

		.coupon-item {
			display: flex;
			margin: 20rpx;
			border-radius: 12rpx;
			background: linear-gradient(to right, #F8F8F8, #FFFFFF);
			position: relative;
			border: 1rpx solid #EEEEEE;
			overflow: hidden;

			&.active {
				border: 1rpx solid #FF7E00;
				background: linear-gradient(to right, #FFF8F0, #FFFFFF);
			}

			.coupon-left {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30%;
				background-color: #F2F2F2;
				padding: 20rpx;

				.coupon-amount {
					font-size: 44rpx;
					color: #FF7E00;
					font-weight: bold;
				}
			}

			.coupon-right {
				flex: 1;
				padding: 20rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;

				.coupon-name {
					font-size: 28rpx;
					color: #333;
					margin-bottom: 8rpx;
				}

				.coupon-limit,
				.coupon-expire {
					font-size: 24rpx;
					color: #999;
					margin-top: 8rpx;
				}
			}

			.coupon-check {
				position: absolute;
				right: 20rpx;
				top: 50%;
				transform: translateY(-50%);
				width: 40rpx;
				height: 40rpx;
				border-radius: 50%;
				border: 1rpx solid #DDDDDD;

				&.active {
					border-color: #FF7E00;
					background-color: #FF7E00;

					&::after {
						content: '';
						position: absolute;
						width: 20rpx;
						height: 10rpx;
						border-left: 3rpx solid #FFFFFF;
						border-bottom: 3rpx solid #FFFFFF;
						top: 40%;
						left: 50%;
						transform: translate(-50%, -50%) rotate(-45deg);
					}
				}
			}
		}
	}

	.coupon-btn {
		height: 90rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(to right, #FF7E00, #FDA44D);

		text {
			color: #FFFFFF;
			font-size: 32rpx;
			font-weight: 500;
		}
	}

}

/* 修改 uni.showModal 的样式 */
:deep(.uni-modal) {
	border-radius: 10rpx !important;
}

:deep(.uni-modal__ft) {
	font-size: 28rpx !important;
}
</style>