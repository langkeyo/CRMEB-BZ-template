<template>
	<view class="order-details-container" :style="colorStyle">
		<!-- 使用通用头部导航组件 -->
		<CommonHeader
			:title="orderInfo.status === 'completed' ? '订单已完成' : '商品详情'"
			@back="goBack">
		</CommonHeader>

		<!-- 加载中状态 -->
		<view v-if="loading" class="loading-container">
			<view class="loading-spinner"></view>
			<view class="loading-text">加载中...</view>
		</view>

		<!-- 订单已完成视图 -->
		<view v-else-if="orderInfo.status === 'completed'" class="order-completed-container">
			<!-- 订单已完成卡片 -->
			<view class="completed-card">
				<view class="completed-title">{{orderInfo.status_text || '订单已完成'}}</view>
				<view class="completed-message">感谢您对本平台的支持与信任，期待您再此光临!请厉行节约,拒绝浪费</view>
				<view class="action-buttons">
					<view class="after-sale-btn" @click="goToAfterSale" v-if="orderInfo.is_after_sale === 0">申请售后</view>
				</view>
			</view>
			
			<!-- 评价卡片 -->
			<view class="review-card" @click="goToReview" v-if="orderInfo.is_after_sale === 0">
				<view class="review-text">您对本单还满意么?</view>
				<view class="go-review">
					<text>去评价</text>
					<text class="arrow-right"></text>
				</view>
			</view>
			
			<!-- 售后信息卡片，当订单处于售后状态时显示 -->
			<view class="after-sale-info" v-if="orderInfo.is_after_sale === 1">
				<view class="after-sale-title">售后信息</view>
				<view class="after-sale-row">
					<text class="after-sale-label">申请原因</text>
					<text class="after-sale-value">{{orderInfo.refund_reason || '未提供原因'}}</text>
				</view>
				<view class="after-sale-row" v-if="orderInfo.refund_amount">
					<text class="after-sale-label">退款金额</text>
					<text class="after-sale-value">￥{{orderInfo.refund_amount}}</text>
				</view>
				<view class="after-sale-row" v-if="orderInfo.admin_refund_reason">
					<text class="after-sale-label">处理结果</text>
					<text class="after-sale-value">{{orderInfo.admin_refund_reason}}</text>
				</view>
			</view>

			<!-- 商品详情卡片 -->
			<view class="product-card">
				<view class="card-header">
					<text class="card-title">商品详情</text>
				</view>

				<view class="address-section">
					<view class="address-label">收货地址：</view>
					<view class="address-content">{{addressInfo.address}}</view>
					<image class="location-icon" src="/static/icons/location.svg"></image>
				</view>

				<!-- 使用多商品显示逻辑 -->
				<view class="product-info" v-for="(item, index) in visibleGoods" :key="index">
					<view class="product-image">
						<image :src="item.image" mode="aspectFill"></image>
					</view>
					<view class="product-details">
						<view class="product-name">{{item.title}}</view>
						<view class="product-spec">
							<text>{{item.description || ''}}</text>
							<text class="product-quantity">X{{item.quantity}}</text>
						</view>
						<view class="product-price">￥{{item.price}}</view>
					</view>
				</view>

				<!-- 展开收起按钮，当商品多于2个时显示 -->
				<view class="expand-row" v-if="allGoods.length > 2" @click="toggleExpand">
					<text>{{isExpanded ? '收起' : `展开全部商品(${allGoods.length})`}}</text>
				</view>

				<view class="price-info">
					<view class="price-row">
						<text class="price-label">配送费</text>
						<text class="price-value">{{orderInfo.delivery_fee}}</text>
					</view>
					<view class="price-row">
						<text class="price-label">支付金额</text>
						<text class="price-value">￥{{orderInfo.pay_price}}</text>
					</view>
					<view class="price-row">
						<text class="price-label">合计</text>
						<text class="price-value">￥{{orderInfo.pay_price}}</text>
					</view>
				</view>
			</view>

			<!-- 订单信息卡片 -->
			<view class="order-info-card">
				<view class="card-header">
					<text class="card-title">订单信息</text>
				</view>
				
				<view class="info-row">
					<text class="info-label">订单号</text>
					<text class="info-value">{{orderInfo.order_number}}</text>
				</view>
				
				<view class="info-row">
					<text class="info-label">支付方式</text>
					<text class="info-value">{{orderInfo.pay_type_text}}</text>
				</view>
				
				<view class="info-row">
					<text class="info-label">下单时间</text>
					<text class="info-value">{{orderInfo.create_time}}</text>
				</view>
				
				<view class="info-row">
					<text class="info-label">付款时间</text>
					<text class="info-value">{{orderInfo.pay_time}}</text>
				</view>
				
				<view class="info-row">
					<text class="info-label">备注</text>
					<text class="info-value">{{orderInfo.remark}}</text>
				</view>
			</view>

		</view>

		<!-- 备货中状态 -->
		<view v-else>
			<view class="preparing-status-card">
				<view class="timeline">
					<view class="timeline-dot active"></view>
					<view class="timeline-line"></view>
					<view class="timeline-dot"></view>
				</view>
				<view class="status-info">
					<view class="preparing-text">{{orderInfo.status_text || '备货中，预计明天送达'}}</view>
					<view class="address-text">{{addressInfo.address}}</view>
					<view class="user-info">{{addressInfo.name}} {{addressInfo.phone}}</view>
				</view>
			</view>

			<!-- 商品详情卡片 -->
			<view class="product-card">
				<view class="card-header">
					<text class="card-title">商品详情</text>
				</view>

				<view class="address-section">
					<view class="address-label">收货地址：</view>
					<view class="address-content">{{addressInfo.address}}</view>
					<image class="location-icon" src="/static/icons/location.svg"></image>
				</view>

				<!-- 多商品显示 -->
				<view class="product-info" v-for="(item, index) in visibleGoods" :key="index">
					<view class="product-image">
						<image :src="item.image" mode="aspectFill"></image>
					</view>
					<view class="product-details">
						<view class="product-name">{{item.title}}</view>
						<view class="product-spec">
							<text>{{item.description || ''}}</text>
							<text class="product-quantity">X{{item.quantity}}</text>
						</view>
						<view class="product-price">￥{{item.price}}</view>
					</view>
				</view>

				<!-- 展开收起按钮，当商品多于2个时显示 -->
				<view class="expand-row" v-if="allGoods.length > 2" @click="toggleExpand">
					<text>{{isExpanded ? '收起' : `展开全部商品(${allGoods.length})`}}</text>
				</view>

				<view class="price-info">
					<view class="price-row">
						<text class="price-label">配送费</text>
						<text class="price-value">免配送费</text>
					</view>
					<view class="price-row">
						<text class="price-label">商品总价</text>
						<text class="price-sub">共{{totalQuantity}}件商品</text>
						<text class="price-value">￥{{orderInfo.total_price}}</text>
					</view>
					<view class="price-row">
						<text class="price-label">合计</text>
						<text class="price-value">￥{{orderInfo.pay_price}}</text>
					</view>
				</view>
			</view>

			<!-- 订单信息卡片 -->
			<view class="order-info-card">
				<view class="card-header">
					<text class="card-title">订单信息</text>
				</view>
				
				<view class="info-row">
					<text class="info-label">订单号</text>
					<text class="info-value">{{orderInfo.order_number}}</text>
				</view>
				
				<view class="info-row">
					<text class="info-label">支付方式</text>
					<text class="info-value">{{orderInfo.pay_type_text}}</text>
				</view>
				
				<view class="info-row">
					<text class="info-label">下单时间</text>
					<text class="info-value">{{orderInfo.create_time}}</text>
				</view>
				
				<view class="info-row">
					<text class="info-label">付款时间</text>
					<text class="info-value">{{orderInfo.pay_time}}</text>
				</view>
				
				<view class="info-row">
					<text class="info-label">备注</text>
					<text class="info-value">{{orderInfo.remark}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import CommonHeader from '@/components/CommonHeader/index.vue';
import { HTTP_REQUEST_URL, TOKENNAME } from '@/config/app.js';
import colors from '@/mixins/color.js';

export default {
	components: {
		CommonHeader
	},
	mixins: [colors],
	data() {
		return {
			orderInfo: {
				status: 'preparing', // 默认为备货中状态
				id: 0,
				order_number: '',
				pay_type: '',
				pay_type_text: '',
				create_time: '',
				pay_time: '',
				remark: '-',
				total_price: 0,
				pay_price: 0,
				delivery_fee: '免配送费'
			},

			addressInfo: {
				address: '',
				name: '',
				phone: ''
			},
			loading: true,
			order_id: 0,
			allGoods: [], // 存储所有商品信息
			totalQuantity: 0, // 总商品数量
			isExpanded: false, // 控制商品是否展开
			visibleGoods: [], // 控制显示的商品数量
			HTTP_REQUEST_URL: HTTP_REQUEST_URL // 添加HTTP_REQUEST_URL
		}
	},
	onLoad(options) {
		if (options.order_id) {
			this.order_id = options.order_id;
			this.getOrderDetails();
		}
	},
	methods: {
		goBack() {
			uni.navigateBack();
		},
		
		// 获取订单详情
		getOrderDetails() {
			this.loading = true;
			
			uni.showLoading({
				title: '加载中...'
			});
			
			// 调用订单详情API
			uni.request({
				url: HTTP_REQUEST_URL + '/api/group/order/order_info/' + this.order_id,
				method: 'GET',
				header: {
					'content-type': 'application/json',
					[TOKENNAME]: 'Bearer ' + this.$store.state.app.token
				},
				success: (res) => {
					uni.hideLoading();
					this.loading = false;
					
					if (res.data && res.data.status === 200) {
						const data = res.data.data;
						
						// 更新订单信息
						this.orderInfo = {
							status: this.getStatusType(data.status), // 状态转换
							id: data.id,
							order_number: data.order_number || '',
							pay_type: data.pay_type || 0,
							pay_type_text: data.pay_type_text || '未支付',
							create_time: this.formatTime(data.create_time),
							pay_time: this.formatTime(data.pay_time),
							remark: data.admin_remark || '-',
							total_price: data.total_price || 0,
							pay_price: data.pay_price || data.price || 0,
							delivery_fee: '免配送费', // 假设免配送费
							status_text: data.status_text || '',
							is_after_sale: data.is_after_sale || 0,
							refund_reason: data.refund_reason || '',
							refund_amount: data.refund_amount || '0.00',
							admin_refund_reason: data.admin_refund_reason || '',
							community_id: data.community_id || 0
						};
						
						// 处理商品信息（支持多个商品）
						if (data.goods && data.goods.length > 0) {
							// 保存所有商品信息
							this.allGoods = data.goods.map(item => {
								return {
									id: item.product_id || 0,
									goods_id: item.goods_id || 0,
									title: item.title || '',
									// 确保图片路径正确拼接域名
									image: item.image ? (item.image.startsWith('http') ? item.image : HTTP_REQUEST_URL + item.image) : '/static/images/goods/default.png',
									price: item.price || '0.00',
									quantity: item.quantity || 1,
									subtotal: item.subtotal || '0.00',
									receiving_time: item.receiving_time ? this.formatTime(item.receiving_time) : '-'
								};
							});
							
							// 默认显示前两个商品，其余收起
							this.visibleGoods = this.isExpanded ? this.allGoods : this.allGoods.slice(0, 2);
							
							// 计算总商品数量
							this.totalQuantity = data.goods.reduce((total, item) => {
								return total + (parseInt(item.quantity) || 0);
							}, 0);
						}
						
						// 更新地址信息（接口中没有地址信息，需要补充）
						this.addressInfo = {
							address: data.address || '社区自提点',
							name: data.user_name || '',
							phone: data.user_phone || ''
						};
					} else {
						uni.showToast({
							title: res.data?.msg || '获取订单详情失败',
							icon: 'none'
						});
					}
				},
				fail: (err) => {
					uni.hideLoading();
					this.loading = false;
					uni.showToast({
						title: '网络错误，请稍后重试',
						icon: 'none'
					});
				}
			});
		},
		
		// 跳转到售后申请页面
		goToAfterSale() {
			uni.navigateTo({
				url: '/pages/users/after_sales/apply?order_id=' + this.order_id
			});
		},
		
		// 跳转到评价页面
		goToReview() {
			uni.navigateTo({
				url: '/pages/users/after_sales/evaluate?order_id=' + this.order_id
			});
		},

		// 格式化时间戳
		formatTime(timestamp) {
			if (!timestamp) return '-';
			
			try {
				const date = new Date(timestamp * 1000);
				return date.toLocaleString();
			} catch (e) {
				return '-';
			}
		},

		// 获取状态类型
		getStatusType(status) {
			// 订单状态: 0-待支付, 1-待收货, 2-已完成, 3-退款中, 4-售后中, 5-已退款
			switch(parseInt(status)) {
				case 0: // 待支付
				case 1: // 待收货
				case 3: // 退款中
				case 4: // 售后中
					return 'preparing';
				case 2: // 已完成
				case 5: // 已退款
					return 'completed';
				default:
					return 'preparing';
			}
		},

		// 展开/收起商品列表
		toggleExpand() {
			this.isExpanded = !this.isExpanded;
			this.visibleGoods = this.isExpanded ? this.allGoods : this.allGoods.slice(0, 2);
		}
	}
}
</script>

<style lang="scss" scoped>
.order-details-container {
	background-color: #F0F0F0;
	min-height: 100vh;
	padding-bottom: 32px;
}



/* 订单已完成样式 */
.order-completed-container {
	.completed-card {
		background-color: #FFFFFF;
		padding: 15px;
		margin-bottom: 10px;
		
		.completed-title {
			font-size: 28px;
			font-weight: 400;
			color: #000000;
			margin-bottom: 8px;
		}
		
		.completed-message {
			font-size: 14px;
			line-height: 20px;
			color: #999999;
			margin-bottom: 15px;
		}
		
		.action-buttons {
			display: flex;
			justify-content: flex-end;
			
			.after-sale-btn {
				border: 1px solid #E5E5E5;
				border-radius: 16.5px;
				padding: 3px 12px;
				font-size: 14px;
				color: #000000;
				display: inline-block;
			}
		}
	}
	
	.review-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #FFFFFF;
		padding: 12px 15px;
		margin-bottom: 10px;
		
		.review-text {
			font-size: 14px;
			color: #000000;
		}
		
		.go-review {
			display: flex;
			align-items: center;
			font-size: 15px;
			color: #999999;
			
			.arrow-right {
				display: inline-block;
				width: 5px;
				height: 9px;
				margin-left: 5px;
				border: 1.5px solid #999999;
				border-top: none;
				border-left: none;
				transform: rotate(-45deg);
			}
		}
	}
}

.preparing-status-card {
	display: flex;
	background-color: #FFFFFF;
	border-radius: 4px;
	margin: 10px 12px;
	padding: 10px 20px;
	
	.timeline {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-right: 17px;
		
		.timeline-dot {
			width: 10px;
			height: 10px;
			border-radius: 50%;
			border: 1px solid #FE8D00;
			
			&.active {
				background-color: #FF8C1B;
			}
		}
		
		.timeline-line {
			width: 1px;
			height: 28px;
			background-color: #FF8C1B;
			margin: 2px 0;
		}
	}
	
	.status-info {
		display: flex;
		flex-direction: column;
		
		.preparing-text {
			font-size: 14px;
			color: #333333;
			line-height: 20px;
			margin-bottom: 18px;
		}
		
		.address-text {
			font-size: 14px;
			color: #333333;
			line-height: 20px;
		}
		
		.user-info {
			font-size: 10px;
			color: #808080;
			line-height: 14px;
		}
	}
}

.product-card, .order-info-card {
	background-color: #FFFFFF;
	border-radius: 4px;
	margin: 10px 12px;
	padding: 10px;
	
	.card-header {
		padding-bottom: 10px;
		
		.card-title {
			font-size: 16px;
			color: #000000;
			line-height: 22px;
		}
	}
}

.address-section {
	display: flex;
	align-items: center;
	padding: 10px 0;
	border-bottom: 1px solid #F5F5F5;
	
	.address-label {
		font-size: 16px;
		color: #000000;
		line-height: 22px;
	}
	
	.address-content {
		flex: 1;
		font-size: 16px;
		color: #000000;
		line-height: 22px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.location-icon {
		width: 12px;
		height: 14px;
		margin-left: 10px;
	}
}

.product-info {
	display: flex;
	padding: 10px 0;
	
	.product-image {
		width: 64px;
		height: 64px;
		background-color: #F8F8F8;
		border-radius: 4px;
		margin-right: 10px;
		overflow: hidden;
		
		image {
			width: 100%;
			height: 100%;
			object-fit: contain;
		}
	}
	
	.product-details {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		
		.product-name {
			font-size: 12px;
			color: #000000;
			line-height: 17px;
		}
		
		.product-spec {
			display: flex;
			justify-content: space-between;
			font-size: 12px;
			color: #666666;
			line-height: 17px;
			margin: 5px 0;
		}
		
		.product-price {
			font-size: 14px;
			color: #333333;
			line-height: 20px;
			text-align: right;
		}
	}
}

.expand-row {
	text-align: center;
	padding: 10px 0;
	font-size: 14px;
	color: #999999;
	border-bottom: 1px solid #F5F5F5;
}

.price-info {
	padding-top: 10px;
	
	.price-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;

		.price-label {
			font-size: 14px;
			color: #333333;
			line-height: 20px;
			flex-shrink: 0;
		}

		.price-sub {
			font-size: 14px;
			color: #999999;
			line-height: 20px;
			margin-left: 10px;
			flex-shrink: 0;
		}

		.price-value {
			font-size: 14px;
			margin-left: auto;
			color: #333333;
			line-height: 20px;
		}
	}
}

.info-row {
	display: flex;
	justify-content: space-between;
	padding: 10px 0;
	
	.info-label {
		font-size: 14px;
		color: #333333;
		line-height: 20px;
	}
	
	.info-value {
		font-size: 13px;
		color: #B3B3B3;
		line-height: 18px;
	}
}

/* 添加加载状态样式 */
.loading-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 300rpx;
	
	.loading-spinner {
		width: 40rpx;
		height: 40rpx;
		border: 4rpx solid #f3f3f3;
		border-top: 4rpx solid #FF8C1B;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 20rpx;
	}
	
	.loading-text {
		font-size: 28rpx;
		color: #666;
	}
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

/* 售后信息样式 */
.after-sale-info {
    background-color: #FFFFFF;
    padding: 15px;
    margin-bottom: 10px;
    
    .after-sale-title {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        margin-bottom: 12px;
    }
    
    .after-sale-row {
        display: flex;
        margin-bottom: 8px;
        
        .after-sale-label {
            width: 80px;
            font-size: 14px;
            color: #666;
        }
        
        .after-sale-value {
            flex: 1;
            font-size: 14px;
            color: #333;
        }
    }
}
</style>
