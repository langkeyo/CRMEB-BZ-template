<template>
	<view class="user-profile-page">
		<!-- 用户头部组件 -->
		<user-header :user-info="userInfo" :stats="stats" @notification-click="onNotificationClick"
			@settings-click="onSettingsClick" @edit-profile="onEditProfile" @stat-click="onStatClick" />

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
		<page-footer />
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
// 使用系统自带的pageFooter组件
import pageFooter from '@/components/pageFooter/index.vue'

export default {
	components: {
		UserHeader,
		PromoBanner,
		OrderActions,
		HistoryStationCards,
		BannerCup,
		FeaturedProducts,
		pageFooter
	},
	data () {
		return {
			// 用户信息
			userInfo: {
				avatar: '/static/images/user/avatar.png',
				nickname: '加载中...'
			},
			// 统计数据
			stats: {
				coupon: 3,
				follow: 10,
				like: 10
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
			featuredProducts: [
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
			]
		}
	},
	onLoad () {
		// 加载用户数据
		this.loadUserData()
		// 加载推荐商品
		this.loadFeaturedProducts()
	},
	methods: {
		// 加载用户数据
		loadUserData () {
			// 模拟API请求
			setTimeout(() => {
				this.userInfo = {
					avatar: '/static/images/user/avatar.png',
					nickname: '团购用户'
				}
			}, 1000)
		},

		// 加载推荐商品
		loadFeaturedProducts () {
			// 实际项目中应该从API获取数据
			// 这里使用模拟数据
		},

		// 通知点击
		onNotificationClick () {
			uni.navigateTo({
				url: '/pages/users/message_private/index'
			})
		},

		// 设置点击
		onSettingsClick () {
			uni.navigateTo({
				url: '/pages/users/user_settings/index'
			})
		},

		// 编辑资料
		onEditProfile () {
			uni.navigateTo({
				url: '/pages/users/user_info/index'
			})
		},

		// 统计项点击
		onStatClick (type) {
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
			uni.navigateTo({
				url: '/pages/goods_details/index'
			})
		},

		// 订单操作点击
		onOrderActionClick (type) {
			const routes = {
				pending_payment: '/pages/goods/pending_payment/index',
				pending_delivery: '/pages/goods/pending_delivery/index',
				pending_review: '/pages/users/after_sales/evaluate',
				after_sale: '/pages/users/after_sales/index',
				all_orders: '/pages/goods/order_list/index'
			}

			if (routes[type]) {
				uni.navigateTo({
					url: routes[type]
				})
			}
		},

		// 团购足迹点击
		onHistoryClick () {
			uni.navigateTo({
				url: '/pages/users/user_goods_collection/index'
			})
		},

		// 站点点击
		onStationClick () {
			uni.navigateTo({
				url: '/pages/my_site/index'
			})
		},

		// 横幅点击
		onBannerClick () {
			uni.navigateTo({
				url: '/pages/goods_details/index'
			})
		},

		// 商品点击
		onProductClick (product) {
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
