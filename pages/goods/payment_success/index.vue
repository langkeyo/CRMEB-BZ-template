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
			<!-- 瀑布流卡片列表区域 -->
			<view class="waterfall-grid">
				<view class="waterfall-column">
					<view 
						class="product-card waterfall-card" 
						v-for="(product, index) in leftColumn" 
						:key="'left-' + index"
						@tap="goDetail(product)"
					>
						<view v-if="index === 0" class="hot-tag">
							<text>最近热品</text>
						</view>
						<view class="product-image" :class="{'hot-image': index === 0}">
							<image :src="product.image" mode="aspectFill"></image>
						</view>
						<view class="product-bottom">
							<view class="product-title">{{ product.title }}</view>
							<view v-if="index === 0" class="product-meta">
								<view class="user-avatars-scroll">
									<scroll-view scroll-x class="avatar-scroll">
										<view class="avatar-item" v-for="(avatar, idx) in avatars" :key="idx">
											<image :src="avatar" mode="aspectFill"></image>
										</view>
									</scroll-view>
								</view>
								<view class="product-likes">
									<text class="iconfont icon-dianzan1"></text>
									<text class="likes-count">{{ product.likes || '9995' }}</text>
								</view>
							</view>
							<view v-else class="product-price">
								<text class="price">{{ product.price }}</text>
								<text v-if="index !== 0" class="seckill-tag">秒杀价</text>
								<text class="sales">{{ product.sales }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="waterfall-column">
					<view 
						class="product-card waterfall-card" 
						v-for="(product, index) in rightColumn" 
						:key="'right-' + index"
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

// 引入获取推荐拼团商品的API
import { getRecommendCombinations } from '@/api/group.js';

export default {
	data() {
		return {
			orderId: '',
			isIphoneX: false,
			avatars: [
				'https://randomuser.me/api/portraits/men/32.jpg',
				'https://randomuser.me/api/portraits/women/44.jpg',
				'https://randomuser.me/api/portraits/men/65.jpg',
				'https://randomuser.me/api/portraits/women/68.jpg'
			],
			products: [],
			leftColumn: [],
			rightColumn: [],
			baseUrl: 'http://wx.laizhangluo.com' // 添加基础URL
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
		
		// 获取推荐商品
		this.getRecommendProducts();
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
		},
		splitProducts() {
			this.leftColumn = [];
			this.rightColumn = [];
			this.products.forEach((item, idx) => {
				if (idx % 2 === 0) {
					this.leftColumn.push(item);
				} else {
					this.rightColumn.push(item);
				}
			});
		},
		// 获取推荐商品
		getRecommendProducts() {
			uni.showLoading({
				title: '加载中...'
			});
			
			// 调用今日开团商品API中的推荐商品接口
			getRecommendCombinations({}).then(res => {
				uni.hideLoading();
				if (res.status === 200 && res.data && res.data.length > 0) {
					// 根据销量排序（降序）
					const sortedProducts = res.data.sort((a, b) => b.sales - a.sales);
					
					// 转换为本地数据格式
					this.products = sortedProducts.map(item => {
						// 处理图片URL，拼接域名
						const imageUrl = item.image.startsWith('http') 
							? item.image 
							: this.baseUrl + item.image;
						
						return {
							id: item.id,
							title: item.title,
							image: imageUrl,
							price: '￥' + item.group_price,
							sales: `已售${item.sales}单`,
							tag: '秒杀价',
							likes: item.sales.toString() // 用销量作为点赞数
						};
					});
					
					// 分配到左右两列
					this.splitProducts();
				} else {
					// 如果接口失败，使用默认数据
					this.useDefaultProducts();
				}
			}).catch(() => {
				uni.hideLoading();
				// 接口请求失败，使用默认数据
				this.useDefaultProducts();
			});
		},
		
		// 使用默认商品数据
		useDefaultProducts() {
			this.products = [
				{
					id: 1,
					title: 'Nike耐克男鞋网面运动慢跑步鞋',
					image: '/static/images/products/nike-shoes.jpg',
					price: '￥399',
					sales: '已售9995单',
					tag: '秒杀价',
					likes: '9995'
				},
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
			];
			
			// 分配到左右两列
			this.splitProducts();
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
			left: 12rpx;
			z-index: 10;
			width: 124rpx;
			height: 52rpx;
			background: linear-gradient(90deg, #F69F75 0%, #EC6732 100%);
			border-radius: 16rpx 0 8rpx 0;
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
	
	.waterfall-grid {
		display: flex;
		justify-content: center;
		margin-top: 80rpx;
	}
	.waterfall-column {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 32rpx;
	}
	.waterfall-card {
		background: #fff;
		border-radius: 16rpx;
		margin: 0 12rpx 32rpx 12rpx;
		box-shadow: 0 4rpx 24rpx 0 rgba(0,0,0,0.04);
		overflow: hidden;
		padding-bottom: 0;
		position: relative;
	}
	.waterfall-card .product-image {
		width: 100%;
		height: 260rpx;
		border-radius: 16rpx 16rpx 0 0;
		overflow: hidden;
	}
	.waterfall-card .product-image.hot-image {
		height: 320rpx;
	}
	.waterfall-card .product-image image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.waterfall-card .product-bottom {
		padding: 20rpx 20rpx 16rpx 20rpx;
	}
	.waterfall-card .product-title {
		font-size: 28rpx;
		color: #1A1A1A;
		font-weight: 500;
		margin-bottom: 12rpx;
		line-height: 1.3;
	}
	.waterfall-card .product-price {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		min-width: 0;
	}
	.waterfall-card .price {
		color: #1A1A1A;
		font-size: 28rpx;
		font-weight: bold;
		margin-right: 8rpx;
		white-space: nowrap;
	}
	.waterfall-card .seckill-tag {
		color: #1A1A1A;
		font-size: 28rpx;
		font-weight: normal;
		margin-right: 16rpx;
		white-space: nowrap;
	}
	.waterfall-card .sales {
		color: #D1D1D1;
		font-size: 22rpx;
		white-space: nowrap;
		margin-left: auto;
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
// 横向头像轮播紧凑重叠样式
.user-avatars-scroll {
	display: flex;
	align-items: center;
	margin-bottom: 8rpx;
}
.avatar-scroll {
	display: flex;
	flex-direction: row;
	width: 72rpx;
	height: 36rpx;
	white-space: nowrap;
	overflow-x: scroll;
	max-width: 72rpx;
}
.avatar-item {
	display: inline-block;
	width: 36rpx;
	height: 36rpx;
	border-radius: 50%;
	overflow: hidden;
	margin-right: -18rpx;
	border: 2rpx solid #fff;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}
.avatar-item:nth-child(3) {
	margin-right: 0;
}
.avatar-item image {
	width: 100%;
	height: 100%;
}
.product-meta {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.product-likes {
	display: flex;
	align-items: center;
	font-size: 26rpx;
	color: #999;
}
.product-likes .iconfont {
	font-size: 30rpx;
	margin-right: 6rpx;
}
</style> 