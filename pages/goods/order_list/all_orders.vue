<template>
	<view class="page-container">
		<!-- 顶部导航栏 -->
		<view class="page-header">
			<view class="header-left" @click="goBack">
				<image class="back-icon" src="/static/images/order/back_arrow.svg"></image>
				<text class="back-text">返回</text>
			</view>
			<view class="header-title">全部订单</view>
		</view>
		
		<!-- 订单列表 -->
		<view class="order-list">
			<view class="order-item" v-for="(item, index) in orderList" :key="index" @click="goOrderDetails(item.order_id)">
				<!-- 订单时间和状态 -->
				<view class="order-header">
					<view class="order-time">下单时间：{{item.order_time || item._add_time}}</view>
					<view class="order-status">订单完成</view>
				</view>
				
				<!-- 商品信息 -->
				<view class="product-info">
					<image class="product-image" :src="item.cartInfo && item.cartInfo[0] && item.cartInfo[0].productInfo.image"></image>
					<view class="product-detail">
						<view class="product-name">{{item.cartInfo && item.cartInfo[0] && item.cartInfo[0].productInfo.store_name}}</view>
						<view class="product-spec">{{item.cartInfo && item.cartInfo[0] && item.cartInfo[0].productInfo.attrInfo ? item.cartInfo[0].productInfo.attrInfo.suk : ''}}</view>
						<view class="product-price">¥ {{item.cartInfo && item.cartInfo[0] && (item.cartInfo[0].productInfo.attrInfo ? item.cartInfo[0].productInfo.attrInfo.price : item.cartInfo[0].productInfo.price)}}</view>
					</view>
				</view>
				
				<!-- 订单总计 -->
				<view class="order-total">
					<view class="total-left">共一件商品</view>
					<view class="total-right">实际支付 ¥ {{item.pay_price}} (含配送费0)</view>
				</view>
				
				<!-- 操作按钮 -->
				<view class="order-actions">
					<view class="action-btn service-btn" @click.stop="applyAfterSales(item)">申请售后</view>
					<view class="action-btn comment-btn" @click.stop="goComment(item)">去评论</view>
				</view>
			</view>
			
			<!-- 加载更多 -->
			<view class="loading-more" v-if="orderList.length > 0">
				<text class="loading-text" v-if="loading">加载中...</text>
				<text class="loading-text" v-else-if="loadend">我也是有底线的</text>
				<text class="loading-text" v-else>加载更多</text>
			</view>
			
			<!-- 空状态 -->
			<view v-if="orderList.length === 0 && !loading" class="empty-state">
				<emptyPage v-if="!loading" :title="$t(`暂无订单`)"></emptyPage>
			</view>
		</view>
	</view>
</template>

<script>
import { getOrderList, orderData } from '@/api/order.js';
import emptyPage from '@/components/emptyPage.vue';
import { mapGetters } from "vuex";
import colors from '@/mixins/color.js';

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
			}
		}
	},
	computed: mapGetters(['isLogin']),
	onLoad() {
		this.getOrderData();
		this.getOrderList();
	},
	onReachBottom() {
		this.getOrderList();
	},
	methods: {
		// 返回上一页
		goBack() {
			uni.navigateBack({
				delta: 1
			});
		},
		
		// 获取订单列表
		getOrderList() {
			if (this.loading || this.loadend) return;
			this.loading = true;
			getOrderList({
				page: this.page,
				limit: this.limit,
				type: 9 // 全部订单
			}).then(res => {
				this.loading = false;
				let list = res.data;
				let loadend = list.length < this.limit;
				this.orderList = this.orderList.concat(list);
				this.loadend = loadend;
				this.loadTitle = loadend ? '我也是有底线的' : '加载更多';
				this.page = this.page + 1;
			}).catch(err => {
				this.loading = false;
				this.$util.Tips({
					title: err
				});
			});
		},
		
		// 获取订单数据
		getOrderData() {
			orderData().then(res => {
				this.orderData = res.data;
			});
		},
		
		// 跳转到订单详情
		goOrderDetails(orderId) {
			uni.navigateTo({
				url: `/pages/goods/order_details/index?order_id=${orderId}`
			});
		},
		
		// 申请售后
		applyAfterSales(item) {
			uni.navigateTo({
				url: `/pages/goods/goods_return/index?order_id=${item.order_id}`
			});
		},
		
		// 去评论
		goComment(item) {
			if (!item.cartInfo || item.cartInfo.length === 0) return;
			uni.navigateTo({
				url: `/pages/users/after_sales/evaluate?unique=${item.cartInfo[0].unique}&order_id=${item.order_id}`
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.page-container {
	background-color: #f5f5f5;
	min-height: 100vh;
}

.page-header {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 44px;
	background-color: #fff;
	position: relative;
	padding: 0 15px;
	
	.header-left {
		display: flex;
		align-items: center;
		position: absolute;
		left: 15px;
		
		.back-icon {
			width: 20px;
			height: 20px;
			margin-right: 5px;
		}
		
		.back-text {
			font-size: 16px;
			color: #333;
		}
	}
	
	.header-title {
		font-size: 18px;
		font-weight: 500;
		color: #333;
	}
}

.order-list {
	padding: 10px 15px;
	
	.order-item {
		background-color: #fff;
		border-radius: 8px;
		margin-bottom: 15px;
		padding: 15px;
		
		.order-header {
			display: flex;
			justify-content: space-between;
			margin-bottom: 15px;
			
			.order-time {
				font-size: 14px;
				color: #666;
			}
			
			.order-status {
				font-size: 14px;
				color: #333;
				font-weight: 500;
			}
		}
		
		.product-info {
			display: flex;
			margin-bottom: 15px;
			
			.product-image {
				width: 80px;
				height: 80px;
				border-radius: 4px;
				flex-shrink: 0;
			}
			
			.product-detail {
				flex: 1;
				margin-left: 10px;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				
				.product-name {
					font-size: 15px;
					color: #333;
					line-height: 1.4;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				
				.product-spec {
					font-size: 13px;
					color: #999;
					margin-top: 5px;
				}
				
				.product-price {
					font-size: 15px;
					color: #333;
					font-weight: 500;
					margin-top: 5px;
				}
			}
		}
		
		.order-total {
			display: flex;
			justify-content: space-between;
			padding: 10px 0;
			border-top: 1px solid #f5f5f5;
			border-bottom: 1px solid #f5f5f5;
			margin-bottom: 15px;
			
			.total-left {
				font-size: 14px;
				color: #666;
			}
			
			.total-right {
				font-size: 14px;
				color: #333;
				font-weight: 500;
			}
		}
		
		.order-actions {
			display: flex;
			justify-content: flex-end;
			
			.action-btn {
				padding: 8px 20px;
				border-radius: 20px;
				font-size: 14px;
				margin-left: 10px;
			}
			
			.service-btn {
				border: 1px solid #ddd;
				color: #666;
			}
			
			.comment-btn {
				background-color: #ff8c1b;
				color: #fff;
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
		padding-top: 30px;
	}
}
</style>
