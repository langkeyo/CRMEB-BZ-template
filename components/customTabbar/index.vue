<template>
	<view class="custom-tabbar">
		<view class="tabbar-container">
			<view 
				v-for="(item, index) in tabList" 
				:key="index"
				class="tab-item"
				:class="{ active: currentTab === index }"
				@click="switchTab(item, index)"
			>
				<!-- 图标 -->
				<view class="tab-icon">
					<image
						:src="currentTab === index ? item.activeIcon : item.icon"
						class="icon-img"
					/>
				</view>
				<!-- 文字 -->
				<view class="tab-text" :class="{ active: currentTab === index }">
					{{ item.text }}
				</view>
				<!-- 购物车角标 -->
				<view v-if="item.pagePath === '/pages/order_addcart/order_addcart' && cartNum > 0" class="cart-badge">
					{{ cartNum > 99 ? '99+' : cartNum }}
				</view>
			</view>
		</view>
		<!-- 安全区域 -->
		<view class="safe-area"></view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import tabbarState from '@/utils/tabbarState.js';

export default {
	name: 'CustomTabbar',
	computed: {
		...mapGetters(['cartNum']),
	},

	data() {
		return {
			currentTab: tabbarState.getCurrentTab(),
			tabList: [
				{
					pagePath: '/pages/index/index',
					icon: '/static/tabs/home.svg',
					activeIcon: '/static/tabs/home-active.svg',
					text: '首页'
				},
				{
					pagePath: '/pages/goods_category/index',
					icon: '/static/tabs/categories.svg',
					activeIcon: '/static/tabs/categories-active.svg',
					text: '分类'
				},
				{
					pagePath: '/pages/order_addcart/order_addcart',
					icon: '/static/tabs/cart.svg',
					activeIcon: '/static/tabs/cart-active.svg',
					text: '购物车'
				},
				{
					pagePath: '/pages/user/index',
					icon: '/static/tabs/mine.svg',
					activeIcon: '/static/tabs/mine-active.svg',
					text: '我的'
				}
			]
		}
	},
	created() {
		this.updateCurrentTab();
		// 添加状态监听器
		this.stateListener = (index) => {
			this.currentTab = index;
		};
		tabbarState.addListener(this.stateListener);
	},
	beforeDestroy() {
		// 移除状态监听器
		if (this.stateListener) {
			tabbarState.removeListener(this.stateListener);
		}
	},
	methods: {
		updateCurrentTab() {
			// 获取当前页面路径，设置对应的tab为激活状态
			let routes = getCurrentPages();
			if (routes.length === 0) return;

			let curRoute = routes[routes.length - 1].route;
			let activeRouter = '/' + curRoute;

			// 处理路径映射
			if (activeRouter === '/pages/goods_cate/goods_cate') {
				activeRouter = '/pages/goods_category/index';
			}

			// 查找匹配的tab
			let foundIndex = -1;
			this.tabList.forEach((item, index) => {
				if (item.pagePath === activeRouter) {
					foundIndex = index;
				}
			});

			// 只有找到匹配的tab才更新状态
			if (foundIndex !== -1) {
				// 使用全局状态管理
				tabbarState.setCurrentTab(foundIndex);
			}
		},
		switchTab(item, index) {
			if (this.currentTab === index) return;

			// 立即更新全局状态
			tabbarState.setCurrentTab(index);

			// 跳转页面
			uni.switchTab({
				url: item.pagePath,
				fail() {
					uni.redirectTo({
						url: item.pagePath
					});
				}
			});
		}
	}
}
</script>

<style scoped lang="scss">
.custom-tabbar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 1000;
	background: #fff;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.tabbar-container {
	display: flex;
	height: 100rpx;
	background: #fff;
}

.tab-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
	padding: 10rpx 0;
	transition: all 0.2s ease;

	&.active {
		transform: scale(1.05);
	}
}

.tab-icon {
	position: relative;
	margin-bottom: 6rpx;
}

.icon-img {
	width: 48rpx;
	height: 48rpx;
	display: block;
}

.tab-text {
	font-size: 20rpx;
	color: #999;
	line-height: 28rpx;
	transition: all 0.2s ease;

	&.active {
		color: #FF840B;
		font-weight: 600;
		font-size: 22rpx;
	}
}

.cart-badge {
	position: absolute;
	top: 0;
	right: 60rpx;
	background: #FF840B;
	color: #fff;
	font-size: 18rpx;
	padding: 2rpx 8rpx;
	border-radius: 20rpx;
	min-width: 32rpx;
	height: 32rpx;
	line-height: 28rpx;
	text-align: center;
	transform: scale(0.8);
}

.safe-area {
	height: 0;
	height: constant(safe-area-inset-bottom);
	height: env(safe-area-inset-bottom);
	background: #fff;
}
</style>
