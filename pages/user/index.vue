<template>
	<view class="user-profile-page">
		<!-- 用户头部组件 -->
		<user-header :user-info="userInfo" :stats="stats" @notification-click="onNotificationClick"
			@settings-click="onSettingsClick" @edit-profile="onEditProfile" @stat-click="onStatClick" @login-click="onLoginClick" />

		<!-- 点赞+评论 Banner -->
		<promo-banner title="点赞+评论" subtitle="点赞+评论可享更多优惠快去看看吧！" buttonText="立即评论" @button-click="onPromoButtonClick" />

		<!-- 订单操作区域 -->
		<order-actions @action-click="onOrderActionClick" />

		<!-- 团购足迹 和 我的站点 -->
		<history-station-cards :history-item="historyItem" :station-item="stationItem" @history-click="onHistoryClick"
			@station-click="onStationClick" />

		<!-- 成长水杯 Banner -->
		<banner-cup banner-image="/static/images/user/banner_cup.png" @banner-click="onBannerClick" />

		<!-- 精选好物 -->
		<featured-products :products="featuredProducts" @product-click="onProductClick" />

		<!-- 底部导航栏 -->
		<customTabbar />
	</view>
</template>

<script>
// 导入组件
import UserHeader from './components/UserHeader.vue'
import PromoBanner from './components/PromoBanner.vue'
import OrderActions from './components/OrderActions.vue'
import HistoryStationCards from './components/HistoryStationCards.vue'
import BannerCup from './components/BannerCup.vue'
import FeaturedProducts from './components/FeaturedProducts.vue'
// 使用自定义tabbar组件
import customTabbar from '@/components/customTabbar/index.vue'
// 导入登录检查函数
import { checkLogin, toLogin } from '@/libs/login.js'
import UserManager, { userManagerMixin } from '@/utils/userManager'
import { getGoodsList } from '@/api/group.js'
import { HTTP_REQUEST_URL } from '@/config/app.js'

export default {
	components: {
		UserHeader,
		PromoBanner,
		OrderActions,
		HistoryStationCards,
		BannerCup,
		FeaturedProducts,
		customTabbar
	},
	mixins: [userManagerMixin],
	data () {
		return {
			// 用户信息（默认未登录状态）
			userInfo: {
				avatar: '', // 空值会触发默认头像
				nickname: '登录/注册'
			},
			// 统计数据（默认为0，登录后更新）
			stats: {
				order: 0,
				coupon: 0,
				follow: 0,
				like: 0
			},
			// 团购足迹数据
			historyItem: {
				title: '好品分享',
				subtitle: '3688人加入了购物车',
				image: '/static/images/user/food_item.png'
			},
			// 站点数据
			stationItem: {
				title: '【我的站点】距我100m',
				subtitle: '北京尚德井小区菜鸟\n驿站',
				image: '/static/images/user/map_site_icon.png'
			},
			// 精选商品
			featuredProducts: [],
			// 是否已登录
			isLoggedIn: false
		}
	},
	onLoad () {
		// 检查登录状态并加载用户数据
		this.initUserData()
		// 加载推荐商品
		this.loadFeaturedProducts()

		// 监听用户信息更新事件
		uni.$on('userInfoUpdated', this.onUserInfoUpdated);
		uni.$on('userInfoCleared', this.onUserInfoCleared);
		uni.$on('loginSuccess', this.onLoginSuccess);
	},

	onUnload() {
		// 移除事件监听
		uni.$off('userInfoUpdated', this.onUserInfoUpdated);
		uni.$off('userInfoCleared', this.onUserInfoCleared);
		uni.$off('loginSuccess', this.onLoginSuccess);
	},
	methods: {
		// 初始化用户数据
		async initUserData() {
			this.isLoggedIn = UserManager.isLoggedIn();

			if (this.isLoggedIn) {
				try {
					// 获取用户信息
					const userInfo = await this.getCurrentUserInfo(true);
					this.updateUserDisplay(userInfo);
				} catch (error) {
					console.error('获取用户信息失败:', error);
					this.setDefaultUserData();
				}
			} else {
				this.setDefaultUserData();
			}
		},

		// 设置默认用户数据（未登录状态）
		setDefaultUserData() {
			this.userInfo = {
				avatar: '', // 空值会触发默认头像
				nickname: '登录/注册'
			};
			this.stats = {
				order: 0,
				coupon: 0,
				follow: 0,
				like: 0
			};
		},

		// 更新用户显示数据
		updateUserDisplay(userInfo) {
			if (userInfo && Object.keys(userInfo).length > 0) {
				this.userInfo = {
					avatar: userInfo.avatar || '/static/images/user/avatar.png',
					nickname: userInfo.nickname || userInfo.real_name || '团购用户'
				};

				// 更新统计数据（从API获取的真实数据）
				this.stats = {
					order: userInfo.orderStatusNum?.unpaid_count || 0,
					coupon: userInfo.couponCount || 0,
					follow: userInfo.like || 0,
					like: userInfo.like || 0
				};
			} else {
				this.setDefaultUserData();
			}
		},

		// 用户信息更新事件处理
		onUserInfoUpdated(userInfo) {
			console.log('用户页面收到用户信息更新事件:', userInfo);
			this.isLoggedIn = true;
			this.updateUserDisplay(userInfo);
		},

		// 用户信息清空事件处理
		onUserInfoCleared() {
			console.log('用户页面收到用户信息清空事件');
			this.isLoggedIn = false;
			this.setDefaultUserData();
		},

		// 登录成功事件处理
		onLoginSuccess(result) {
			console.log('用户页面收到登录成功事件:', result);
			this.isLoggedIn = true;
			if (result.userInfo) {
				this.updateUserDisplay(result.userInfo);
			}
		},

		// 加载推荐商品
		loadFeaturedProducts () {
			// 从API获取推荐商品数据
			getGoodsList({
				is_recommend: '1',
				limit: 10
			}).then(res => {
				if (res.status === 200 && res.data && res.data.goodsList) {
					// 处理推荐商品数据
					this.featuredProducts = res.data.goodsList.map(item => {
						return {
							id: item.id,
							title: item.title,
							price: item.min_price,
							image: this.formatImage(item.image)
						};
					}).slice(0, 2); // 只显示前2个商品
				}
			}).catch(err => {
				console.error('获取推荐商品失败:', err);
				// 加载失败时使用默认数据
				this.featuredProducts = [
					{
						id: 1,
						title: '某某某商品',
						price: '88',
						image: '/static/images/user/featured_product1.png'
					},
					{
						id: 2,
						title: '某某某商品',
						price: '88',
						image: '/static/images/user/featured_product2.png'
					}
				];
			});
		},

		// 格式化图片URL
		formatImage(url) {
			if (!url) return '/static/images/user/featured_product1.png';
			if (url.startsWith('http')) return url;
			return HTTP_REQUEST_URL + url;
		},

		// 通知点击
		onNotificationClick () {
			// 如果未登录，先跳转到登录页
			if (!this.isLoggedIn) {
				toLogin()
				return
			}
			
			uni.navigateTo({
				url: '/pages/users/message_private/index'
			})
		},

		// 设置点击
		onSettingsClick () {
			// 如果未登录，先跳转到登录页
			if (!this.isLoggedIn) {
				toLogin()
				return
			}
			
			uni.navigateTo({
				url: '/pages/users/user_settings/index'
			})
		},

		// 编辑资料
		onEditProfile () {
			// 如果未登录，跳转到登录页面
			if (!this.isLoggedIn) {
				toLogin()
				return
			}

			uni.navigateTo({
				url: '/pages/users/user_info/index'
			})
		},

		// 点击登录
		onLoginClick() {
			toLogin()
		},

		// 统计项点击
		onStatClick (type) {
			// 如果未登录，先跳转到登录页
			if (!this.isLoggedIn) {
				toLogin()
				return
			}

			const routes = {
				coupon: '/pages/users/user_coupon/index',
				follow: '/pages/users/user_follow/index',
				like: '/pages/users/liked_goods/index'
			}

			if (routes[type]) {
				uni.navigateTo({
					url: routes[type]
				})
			}
		},

		// 促销横幅按钮点击
		onPromoButtonClick () {
			// 如果未登录，先跳转到登录页
			if (!this.isLoggedIn) {
				toLogin()
				return
			}
			
			uni.navigateTo({
				url: '/pages/goods_details/index'
			})
		},

		// 订单操作点击
		onOrderActionClick (type) {
			// 如果未登录，先跳转到登录页
			if (!this.isLoggedIn) {
				toLogin()
				return
			}

			const routes = {
				pending_payment: '/pages/goods/order_list/pending',
				pending_delivery: '/pages/goods/pending_delivery/index',
				pending_review: '/pages/users/after_sales/evaluate',
				after_sale: '/pages/users/after_sales/index',
				all_orders: '/pages/goods/order_list/all_orders'
			}

			if (routes[type]) {
				uni.navigateTo({
					url: routes[type]
				})
			}
		},

		// 团购足迹点击
		onHistoryClick () {
			// 如果未登录，先跳转到登录页
			if (!this.isLoggedIn) {
				toLogin()
				return
			}

			uni.navigateTo({
				url: '/pages/users/user_goods_collection/index'
			})
		},

		// 我的站点点击
		onStationClick () {
			// 如果未登录，先跳转到登录页
			if (!this.isLoggedIn) {
				toLogin()
				return
			}

			uni.navigateTo({
				url: '/pages/my_site/index'
			})
		},

		// 横幅点击
		onBannerClick () {
			// 如果未登录，先跳转到登录页
			if (!this.isLoggedIn) {
				toLogin()
				return
			}
			
			uni.navigateTo({
				url: '/pages/goods_details/index'
			})
		},

		// 商品点击
		onProductClick (product) {
			// 商品详情页不需要登录检查，直接跳转
			uni.navigateTo({
				url: `/pages/goods_details/index?id=${product.id}`
			})
		},


	}
}
</script>

<style lang="scss" scoped>
.user-profile-page {
	background-color: #F0F0F0;
	min-height: 100vh;
	position: relative;
	padding-bottom: 120rpx; // 为底部导航预留空间
}
</style>
