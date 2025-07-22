<template>
	<view class="order-details-container" :style="colorStyle">
		<!-- 使用通用头部导航组件 -->
		<CommonHeader
			:title="orderInfo.status === 'completed' ? '订单已完成' : '商品详情'"
			@back="goBack">
		</CommonHeader>

		<!-- 订单已完成视图 -->
		<view v-if="orderInfo.status === 'completed'" class="order-completed-container">
			<!-- 订单已完成卡片 -->
			<view class="completed-card">
				<view class="completed-title">订单已完成</view>
				<view class="completed-message">感谢您对本平台的支持与信任，期待您再此光临!请厉行节约,拒绝浪费</view>
				<view class="action-buttons">
					<view class="after-sale-btn">申请售后</view>
				</view>
			</view>
			
			<!-- 评价卡片 -->
			<view class="review-card">
				<view class="review-text">您对本单还满意么?</view>
				<view class="go-review">
					<text>去评价</text>
					<text class="arrow-right"></text>
				</view>
			</view>
			
			<!-- 订单信息卡片 -->
			<view class="order-info-card">
				<view class="card-header">
					<text class="card-title">订单信息</text>
				</view>
				
				<view class="info-row">
					<text class="info-label">订单号</text>
					<text class="info-value">6546846541821654</text>
				</view>
				
				<view class="info-row">
					<text class="info-label">支付方式</text>
					<text class="info-value">微信支付</text>
				</view>
				
				<view class="info-row">
					<text class="info-label">下单时间</text>
					<text class="info-value">2025-03-28 9:35</text>
				</view>
				
				<view class="info-row">
					<text class="info-label">付款时间</text>
					<text class="info-value">2025-03-28 9:36</text>
				</view>
				
				<view class="info-row">
					<text class="info-label">备注</text>
					<text class="info-value">-</text>
				</view>
			</view>
			
			<!-- 商品详情卡片 -->
			<view class="product-card">
				<view class="card-header">
					<text class="card-title">商品详情</text>
				</view>
				
				<view class="address-section">
					<view class="address-label">收货地址：</view>
					<view class="address-content">北京尚德井小区菜鸟驿站</view>
					<image class="location-icon" src="/static/icons/location.svg"></image>
				</view>
				
				<view class="product-info">
					<view class="product-image">
						<image src="/static/images/goods/detail/chicken_feet.png" mode="aspectFill"></image>
					</view>
					<view class="product-details">
						<view class="product-name">百草味坚果</view>
						<view class="product-spec">
							<text>一盒15包随机...</text>
							<text class="product-quantity">X1</text>
						</view>
						<view class="product-price">￥35</view>
					</view>
				</view>
				
				<view class="expand-row">
					<text>点击展开</text>
				</view>
				
				<view class="price-info">
					<view class="price-row">
						<text class="price-label">配送费</text>
						<text class="price-value">免配送费</text>
					</view>
					<view class="price-row">
						<text class="price-label">商品总价</text>
						<text class="price-sub">共一件商品</text>
						<text class="price-value">￥35</text>
					</view>
					<view class="price-row">
						<text class="price-label">合计</text>
						<text class="price-value">￥35</text>
					</view>
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
					<view class="preparing-text">备货中，预计明天送达</view>
					<view class="address-text">农大南路88号万霖大厦A座</view>
					<view class="user-info">王小明 186****3662</view>
				</view>
			</view>

			<!-- 商品详情卡片 -->
			<view class="product-card">
				<view class="card-header">
					<text class="card-title">商品详情</text>
				</view>
				
				<view class="address-section">
					<view class="address-label">收货地址：</view>
					<view class="address-content">农大南路88号万霖大厦...</view>
					<image class="location-icon" src="/static/icons/location.svg"></image>
				</view>
				
				<view class="product-info">
					<view class="product-image">
						<image src="/static/images/goods/detail/chicken_feet.png" mode="aspectFill"></image>
					</view>
					<view class="product-details">
						<view class="product-name">百草味坚果</view>
						<view class="product-spec">
							<text>一盒15包随机...</text>
							<text class="product-quantity">X1</text>
						</view>
						<view class="product-price">￥35</view>
					</view>
				</view>
				
				<view class="price-info">
					<view class="price-row">
						<text class="price-label">配送费</text>
						<text class="price-value">免配送费</text>
					</view>
					<view class="price-row">
						<text class="price-label">支付金额</text>
						<text class="price-value">￥35</text>
					</view>
					<view class="price-row">
						<text class="price-label">合计</text>
						<text class="price-value">￥35</text>
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
					<text class="info-value">6546846541821654</text>
				</view>
				
				<view class="info-row">
					<text class="info-label">支付方式</text>
					<text class="info-value">微信支付</text>
				</view>
				
				<view class="info-row">
					<text class="info-label">下单时间</text>
					<text class="info-value">2025-03-28 9:35</text>
				</view>
				
				<view class="info-row">
					<text class="info-label">付款时间</text>
					<text class="info-value">2025-03-28 9:36</text>
				</view>
				
				<view class="info-row">
					<text class="info-label">备注</text>
					<text class="info-value">-</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import CommonHeader from '@/components/CommonHeader/index.vue';

export default {
	components: {
		CommonHeader
	},
	data() {
		return {
			orderInfo: {
				status: 'completed' // 默认为已完成状态
			}
		}
	},
	methods: {
		goBack() {
			uni.navigateBack();
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
		margin-bottom: 10px;
		
		.price-label {
			font-size: 14px;
			color: #333333;
			line-height: 20px;
		}
		
		.price-sub {
			font-size: 14px;
			color: #999999;
			line-height: 20px;
			margin-left: 10px;
		}
		
		.price-value {
			font-size: 14px;
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
</style>
