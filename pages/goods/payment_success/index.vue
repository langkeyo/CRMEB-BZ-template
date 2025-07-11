<template>
	<view class="payment-success-container">
		<!-- 顶部状态栏 -->
		<view class="status-bar">
			<view class="title">支付成功</view>
			<view class="complete-btn" @tap="goComplete">完成</view>
		</view>

		<!-- 操作按钮 -->
		<view class="action-buttons">
			<view class="action-btn" @tap="goHome">
				<text>返回首页</text>
			</view>
			<view class="action-btn" @tap="goOrderDetails">
				<text>查看订单</text>
			</view>
		</view>

		<!-- 最近热卖商品 -->
		<view class="recent-products">
			<!-- 热门标签 -->
			<view class="hot-tag">
				<text>最近热品</text>
			</view>
			
			<!-- 卡片列表区域 -->
			<view class="product-grid">
				<!-- Nike运动鞋卡片 -->
				<view class="product-card featured-card" @tap="goDetail(featuredProduct)">
					<view class="product-image">
						<image :src="featuredProduct.image" mode="aspectFill"></image>
					</view>
					<view class="product-bottom">
						<view class="product-title">{{ featuredProduct.title }}</view>
						<view class="product-meta">
							<view class="user-avatars">
								<view class="avatar-item" v-for="(avatar, index) in avatars" :key="index">
									<image :src="avatar" mode="aspectFill"></image>
								</view>
							</view>
							<view class="product-likes">
								<text class="iconfont icon-dianzan1"></text>
								<text class="likes-count">{{ featuredProduct.likes }}</text>
							</view>
						</view>
					</view>
				</view>

				<!-- 右侧商品卡片列表 -->
				<view class="right-column">
					<view 
						class="product-card small-card" 
						v-for="(product, index) in products" 
						:key="index"
						@tap="goDetail(product)"
					>
						<view class="product-image">
							<image :src="product.image" mode="aspectFill"></image>
						</view>
						<view class="product-bottom">
							<view class="product-title">{{ product.title }}</view>
							<view class="product-price">
								<text class="price">{{ product.price }}</text>
								<text class="sales">{{ product.sales }}</text>
							</view>
						</view>
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
import { navigateToHome, navigateToOrderDetails } from '@/utils/orderNavigation.js';

export default {
	data() {
		return {
			orderId: '',
			isIphoneX: false,
			avatars: [
				'/static/images/avatars/avatar1.png',
				'/static/images/avatars/avatar2.png',
				'/static/images/avatars/avatar3.png'
			],
			featuredProduct: {
				id: 1,
				title: 'Nike耐克男鞋网面运动慢跑步鞋',
				image: '/static/images/products/nike-shoes.jpg',
				likes: '9995'
			},
			products: [
				{
					id: 2,
					title: '精品白条鸡',
					image: '/static/images/products/chicken.jpg',
					price: '￥88',
					sales: '已售365单',
					tag: '秒杀价'
				},
				{
					id: 3,
					title: '蚕丝鸭绒床上四件...',
					image: '/static/images/products/bedding.jpg',
					price: '￥188',
					sales: '已售112单',
					tag: '秒杀价'
				},
				{
					id: 4,
					title: '超值海鲜礼盒',
					image: '/static/images/products/seafood.jpg',
					price: '￥218',
					sales: '已售103单',
					tag: '秒杀价'
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
		// 返回首页
		goHome() {
			navigateToHome();
		},
		// 查看订单详情
		goOrderDetails() {
			if (this.orderId) {
				navigateToOrderDetails(this.orderId);
			} else {
				uni.showToast({
					title: '订单ID不存在',
					icon: 'none'
				});
			}
		},
		// 完成按钮
		goComplete() {
			uni.navigateBack();
		},
		// 跳转到商品详情
		goDetail(product) {
			uni.navigateTo({
				url: `/pages/goods_details/index?id=${product.id}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.payment-success-container {
	min-height: 100vh;
	background: linear-gradient(to bottom, #f7f7f7 0%, #f7f7f7 100%);
	position: relative;
	
	.status-bar {
		height: 88rpx;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20rpx 30rpx;
		
		.title {
			font-size: 36rpx;
			font-weight: 400;
			color: #1A1A1A;
		}
		
		.complete-btn {
			position: absolute;
			right: 30rpx;
			top: 50%;
			transform: translateY(-50%);
			font-size: 28rpx;
			color: #1A1A1A;
		}
	}
	
	.action-buttons {
		margin: 30rpx auto;
		width: 484rpx;
		height: 60rpx;
		display: flex;
		justify-content: space-between;
		
		.action-btn {
			width: 234rpx;
			height: 60rpx;
			border: 1rpx solid #CCCCCC;
			border-radius: 16rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 32rpx;
			color: #1A1A1A;
			background-color: #fff;
		}
	}
	
	.recent-products {
		margin: 20rpx;
		position: relative;
		
		.hot-tag {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 10;
			width: 124rpx;
			height: 52rpx;
			background: linear-gradient(90deg, #F69F75 0%, #EC6732 100%);
			border-radius: 8rpx 0 8rpx 0;
			display: flex;
			align-items: center;
			justify-content: center;
			
			text {
				color: #fff;
				font-size: 24rpx;
			}
		}
		
		.product-grid {
			display: flex;
			justify-content: space-between;
			
			.featured-card {
				width: 340rpx;
				height: 588rpx;
				margin-right: 20rpx;
				
				.product-image {
					height: 480rpx;
				}
				
				.product-bottom {
					.product-title {
						margin-bottom: 20rpx;
					}
					
					.product-meta {
						display: flex;
						justify-content: space-between;
						align-items: center;
						
						.user-avatars {
							display: flex;
							
							.avatar-item {
								width: 44rpx;
								height: 44rpx;
								border-radius: 50%;
								overflow: hidden;
								margin-right: -10rpx;
								border: 2rpx solid #fff;
								
								image {
									width: 100%;
									height: 100%;
								}
							}
						}
						
						.product-likes {
							display: flex;
							align-items: center;
							font-size: 26rpx;
							color: #999;
							
							.iconfont {
								font-size: 30rpx;
								margin-right: 6rpx;
							}
						}
					}
				}
			}
			
			.right-column {
				width: 340rpx;
				
				.small-card {
					height: 184rpx;
					margin-bottom: 18rpx;
					
					&:last-child {
						margin-bottom: 0;
					}
					
					.product-image {
						height: 90rpx;
					}
					
					.product-bottom {
						.product-price {
							display: flex;
							justify-content: space-between;
							
							.price {
								color: #1A1A1A;
								font-size: 28rpx;
								font-weight: 500;
							}
							
							.sales {
								color: #B3B3B3;
								font-size: 24rpx;
							}
						}
					}
				}
			}
		}
		
		.product-card {
			background-color: #fff;
			border-radius: 8rpx;
			overflow: hidden;
			display: flex;
			flex-direction: column;
			
			.product-image {
				width: 100%;
				overflow: hidden;
				
				image {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
			
			.product-bottom {
				flex: 1;
				padding: 20rpx;
				
				.product-title {
					font-size: 32rpx;
					color: #1A1A1A;
					line-height: 1.4;
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