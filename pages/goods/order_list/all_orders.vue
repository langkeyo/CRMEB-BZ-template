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
			<view class="order-item" v-for="(item, index) in orderList" :key="index">
				<!-- 订单时间和状态 -->
				<view class="order-header">
					<view class="order-time">下单时间：{{item.order_time || item._add_time}}</view>
					<view class="order-status">订单完成</view>
				</view>
				
				<!-- 商品信息 -->
				<view class="product-info" @click="goOrderDetails(item.order_id)">
					<image class="product-image" :src="item.cartInfo && item.cartInfo[0] && item.cartInfo[0].productInfo.image"></image>
					<view class="product-detail">
						<view class="product-name">{{item.cartInfo && item.cartInfo[0] && item.cartInfo[0].productInfo.store_name}}</view>
						<view class="product-spec">{{item.cartInfo && item.cartInfo[0] && item.cartInfo[0].productInfo.attrInfo ? item.cartInfo[0].productInfo.attrInfo.suk : ''}}</view>
						<view class="product-price">¥ {{item.cartInfo && item.cartInfo[0] && (item.cartInfo[0].productInfo.attrInfo ? item.cartInfo[0].productInfo.attrInfo.price : item.cartInfo[0].productInfo.price)}}</view>
					</view>
				</view>
				
				<!-- 订单总计 -->
				<view class="order-total">
					<view class="total-left">共{{item.total_num || 1}}件商品</view>
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
import { getGroupOrderList } from '@/api/group.js';
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
			orderList: [
				// 模拟数据 - 巧克力蛋糕订单
				{
					order_id: '202503081234567',
					order_time: '2025-03-15',
					_add_time: '2025-03-15',
					pay_price: '105',
					status_name: '订单完成',
					cartInfo: [
						{
							productInfo: {
								store_name: '巧克力-提拉米苏券',
								image: '/static/images/order/coffee.png',
								price: '105',
								attrInfo: {
									suk: '单份巧克力蛋糕/40g',
									price: '105'
								}
							},
							cart_num: 1,
							unique: 'choc123456'
						}
					],
					total_num: 1
				}
			],
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

			// 优先获取团购订单，失败则获取普通订单
			this.getGroupOrderList().catch(() => {
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
			});
		},

		// 获取团购订单列表
		getGroupOrderList() {
			return new Promise((resolve, reject) => {
				getGroupOrderList({
					page: this.page,
					limit: this.limit,
					status: '' // 全部状态
				}).then(res => {
					this.loading = false;
					if (res.status === 200 && res.data) {
						let list = res.data.list || res.data;
						let loadend = list.length < this.limit;

						// 转换团购订单数据格式以适配页面显示
						const formattedList = list.map(item => ({
							order_id: item.id || item.order_id,
							order_time: item.created_at || item.order_time,
							_add_time: item.created_at || item._add_time,
							total_price: item.total_amount || item.total_price,
							status_name: item.status_text || '订单完成',
							cart_info: item.goods || item.cart_info || [],
							// 其他必要字段的映射
							...item
						}));

						this.orderList = this.orderList.concat(formattedList);
						this.loadend = loadend;
						this.loadTitle = loadend ? '我也是有底线的' : '加载更多';
						this.page = this.page + 1;
						resolve(res);
					} else {
						reject(new Error('团购订单数据格式错误'));
					}
				}).catch(err => {
					this.loading = false;
					console.log('获取团购订单失败:', err);
					reject(err);
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
		
		.product-info {
			display: flex;
			padding: 12px 7px;
			
			.product-image {
				width: 99px;
				height: 95px;
				border-radius: 4px;
				margin-right: 10px;
				background-color: #f7f7f7;
			}
			
			.product-detail {
				flex: 1;
				
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
				
				.product-price {
					font-size: 15px;
					color: #1A1A1A;
					font-family: 'PingFang SC';
					font-weight: 400;
					line-height: 21px;
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
}
</style>
