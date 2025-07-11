<template>
	<view class="order-cancelled-container">
		<!-- 顶部状态栏 -->
		<view class="header">
			<view class="status-bar">
				<!-- 返回按钮 -->
				<view class="back-btn" @tap="goBack">
					<text class="iconfont icon-fanhui"></text>
				</view>
				<!-- 标题 -->
				<view class="title">
					<text class="cancel-title">交易取消</text>
				</view>
			</view>
		</view>

		<!-- 用户信息卡片 -->
		<view class="user-info-card">
			<view class="user-icon">
				<text class="iconfont icon-dingwei1"></text>
			</view>
			<view class="user-details">
				<view class="user-name">
					<text>王小明 185****3662</text>
				</view>
				<view class="user-address">
					<text>地址：北京尚德井小区菜鸟驿站</text>
				</view>
			</view>
		</view>

		<!-- 商品详情 -->
		<view class="goods-details-card">
			<view class="section-title">商品详情</view>
			<view class="address-label">收货地址：北京尚德井小区菜鸟驿站</view>
			<view class="location-icon">
				<text class="iconfont icon-dingwei1"></text>
			</view>

			<!-- 商品卡片 -->
			<view class="goods-card">
				<view class="goods-image">
					<image src="/static/images/goods/default-product.png" mode="aspectFill"></image>
				</view>
				<view class="goods-info">
					<view class="goods-title">百草味坚果</view>
					<view class="goods-specs">一盒15包随机...</view>
				</view>
				<view class="goods-quantity">X1</view>
				<view class="goods-price">
					<text class="currency">￥</text>
					<text class="price">35</text>
				</view>
			</view>

			<!-- 价格信息 -->
			<view class="price-info">
				<view class="divider"></view>
				<view class="price-item">
					<text>配送费</text>
					<text class="free-delivery">免配送费</text>
				</view>
				<view class="price-item">
					<text>商品总价</text>
					<text class="total-goods">共一件商品</text>
					<text class="price-value">￥35</text>
				</view>
				<view class="price-item total">
					<text>合计</text>
					<text class="price-value">￥35</text>
				</view>
			</view>
		</view>

		<!-- 猜你喜欢 -->
		<view class="guess-you-like">
			<view class="like-title">你可能还会喜欢</view>
			<!-- 商品列表 -->
			<view class="like-list">
				<!-- 商品项 -->
				<view class="like-item" v-for="(item, index) in likeList" :key="index" @tap="goToProduct(item)">
					<image :src="item.image" mode="aspectFill" class="like-image"></image>
					<view class="like-bottom">
						<view class="like-name">{{ item.name }}</view>
						<view class="like-price">{{ item.price }}</view>
					</view>
				</view>
			</view>
		</view>

		<!-- Home Indicator -->
		<view class="home-indicator" v-if="isIphoneX"></view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import { getOrderDetail } from '@/api/order.js';
import { toLogin } from '@/libs/login.js';
import { navigateToHome } from '@/utils/orderNavigation.js';

export default {
	data() {
		return {
			orderId: '',
			orderInfo: null,
			isIphoneX: false,
			likeList: [
				{
					id: 1,
					image: '/static/images/goods/detail/coffee.png',
					name: '瑞幸咖啡5选1',
					price: '￥12.5 已售99+单'
				},
				{
					id: 2,
					image: '/static/images/goods/detail/wings.png',
					name: '精美黄金烤鸡翅',
					price: '￥22 已售99+份'
				},
				{
					id: 3,
					image: '/static/images/goods/detail/seafood.png',
					name: '超值海鲜礼盒',
					price: '￥218 已售103单'
				},
				{
					id: 4,
					image: '/static/images/goods/detail/fruit.png',
					name: '新鲜水果礼盒',
					price: '￥88 已售99+单'
				}
			]
		};
	},
	computed: {
		...mapGetters(['isLogin'])
	},
	onLoad(options) {
		// 检测是否为iPhone X以上机型
		this.isIphoneX = this.isIphoneXModel();
		
		if (options.order_id) {
			this.orderId = options.order_id;
			// 如果已登录就获取订单详情
			if (this.isLogin) {
				this.getOrderDetail();
			} else {
				// 未登录跳转登录
				toLogin();
			}
		}
	},
	onShow() {
		if (this.isLogin && this.orderId) {
			this.getOrderDetail();
		}
	},
	methods: {
		// 检测是否为iPhone X以上机型
		isIphoneXModel() {
			// #ifdef APP-PLUS || MP
			const res = uni.getSystemInfoSync();
			const modelmes = res.model;
			return /iPhone X|iPhone 11|iPhone 12|iPhone 13|iPhone 14|iPhone 15/.test(modelmes);
			// #endif
			return false;
		},
		// 获取订单详情
		getOrderDetail() {
			uni.showLoading({
				title: '加载中'
			});
			getOrderDetail(this.orderId)
				.then(res => {
					this.orderInfo = res.data;
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: err.msg || '获取订单详情失败',
						icon: 'none'
					});
				});
		},
		// 返回按钮点击事件
		goBack() {
			uni.navigateBack();
		},
		// 跳转到首页
		goHome() {
			navigateToHome();
		},
		// 跳转到商品详情
		goToProduct(item) {
			uni.navigateTo({
				url: `/pages/goods_details/index?id=${item.id}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.order-cancelled-container {
	min-height: 100vh;
	background-color: #f7f7f7;
	position: relative;
	
	.header {
		height: 88rpx;
		position: relative;
		
		.status-bar {
			display: flex;
			align-items: center;
			height: 88rpx;
			position: relative;
			
			.back-btn {
				position: absolute;
				left: 30rpx;
				top: 50%;
				transform: translateY(-50%);
				width: 64rpx;
				height: 64rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				z-index: 10;
				
				.iconfont {
					font-size: 32rpx;
					color: #333;
				}
			}
			
			.title {
				flex: 1;
				text-align: center;
				
				.cancel-title {
					font-size: 40rpx;
					font-weight: 400;
					color: #E34330;
				}
			}
		}
	}
	
	.user-info-card {
		width: 702rpx;
		height: 144rpx;
		background-color: #fff;
		border-radius: 8rpx;
		margin: 30rpx auto;
		padding: 30rpx 20rpx;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		
		.user-icon {
			margin-right: 20rpx;
			
			.iconfont {
				font-size: 48rpx;
				color: #333;
			}
		}
		
		.user-details {
			flex: 1;
			
			.user-name {
				font-size: 28rpx;
				color: #333;
				margin-bottom: 10rpx;
			}
			
			.user-address {
				font-size: 28rpx;
				color: #999;
			}
		}
	}
	
	.goods-details-card {
		width: 702rpx;
		background-color: #fff;
		border-radius: 8rpx;
		margin: 0 auto 30rpx;
		padding: 20rpx;
		position: relative;
		box-sizing: border-box;
		
		.section-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #000;
			margin-bottom: 20rpx;
		}
		
		.address-label {
			font-size: 36rpx;
			color: #000;
			margin-bottom: 20rpx;
		}
		
		.location-icon {
			position: absolute;
			right: 20rpx;
			top: 50rpx;
			
			.iconfont {
				font-size: 36rpx;
				color: #808080;
			}
		}
		
		.goods-card {
			display: flex;
			align-items: center;
			margin-top: 30rpx;
			margin-bottom: 20rpx;
			
			.goods-image {
				width: 128rpx;
				height: 128rpx;
				background-color: #f8f8f8;
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
				
				.goods-title {
					font-size: 24rpx;
					color: #000;
					margin-bottom: 6rpx;
				}
				
				.goods-specs {
					font-size: 24rpx;
					color: #666;
				}
			}
			
			.goods-quantity {
				font-size: 24rpx;
				color: #666;
				margin-right: 20rpx;
			}
			
			.goods-price {
				font-size: 28rpx;
				color: #333;
				font-weight: bold;
				
				.currency {
					font-size: 24rpx;
				}
			}
		}
		
		.price-info {
			margin-top: 30rpx;
			
			.divider {
				height: 1rpx;
				background-color: #f2f2f2;
				margin: 10rpx 0 20rpx;
			}
			
			.price-item {
				display: flex;
				justify-content: space-between;
				margin-bottom: 20rpx;
				font-size: 28rpx;
				color: #333;
				
				.free-delivery {
					color: #333;
				}
				
				.total-goods {
					flex: 1;
					margin-left: 20rpx;
					color: #999;
				}
				
				.price-value {
					color: #333;
				}
				
				&.total {
					margin-top: 10rpx;
					font-weight: bold;
				}
			}
		}
	}
	
	.guess-you-like {
		padding: 20rpx;
		
		.like-title {
			font-size: 36rpx;
			color: #000;
			font-weight: bold;
			margin-bottom: 20rpx;
		}
		
		.like-list {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			
			.like-item {
				width: 340rpx;
				margin-bottom: 20rpx;
				background-color: #fff;
				border-radius: 8rpx;
				overflow: hidden;
				
				.like-image {
					width: 100%;
					height: 322rpx;
					border-top-left-radius: 8rpx;
					border-top-right-radius: 8rpx;
				}
				
				.like-bottom {
					padding: 20rpx;
					
					.like-name {
						font-size: 32rpx;
						color: #000;
						margin-bottom: 10rpx;
					}
					
					.like-price {
						font-size: 28rpx;
						color: #EB3C3C;
					}
				}
			}
		}
	}
	
	.home-indicator {
		width: 100%;
		height: 64rpx;
		background-color: rgba(0, 0, 0, 0.9);
		position: fixed;
		bottom: 0;
		left: 0;
	}
}
</style> 