<template>
	<!-- 底部导航 -->
	<view v-if="showTabBar">
		<view class="fixed-lb w-full pb-safe z-999" :style="[bgColor]">
			<view class="page-footer-wrapper">
				<view
					class="page-footer"
					:class="{
						'page-footer2': newData.navStyleConfig.tabVal == 1,
						'page-footer3': newData.navStyleConfig.tabVal == 2
					}"
					id="target"
					:style="[componentStyle]"
				>
					<view class="foot-item flex-1 flex-col flex-center h-96 relative" v-for="(item, index) in newData.menuList" :key="index" @click="goRouter(item)">
						<template v-if="isActiveTab(item)">
							<image v-if="newData.navStyleConfig.tabVal != 1" :src="item.imgList[0]" class="active-icon"></image>
							<view v-if="newData.navStyleConfig.tabVal != 2" class="txt active" :style="[txtActiveColor]">{{ item.name }}</view>
						</template>
						<template v-else>
							<image v-if="newData.navStyleConfig.tabVal != 1" :src="item.imgList[1]"></image>
							<view v-if="newData.navStyleConfig.tabVal != 2" class="txt" :style="[txtColor]">{{ item.name }}</view>
						</template>
						<BaseBadge v-if="item.link === '/pages/order_addcart/order_addcart' && cartNum > 0" 
							class="uni-badge-left-margin" 
							:text="cartNum" 
							absolute="rightTop"
							:offset="[0, 0]"
							type="error"
							size="small">
						</BaseBadge>
					</view>
				</view>
			</view>
		</view>
		<view :style="{ height: `${footerHeight}px` }"></view>
		<view class="safe-area-inset-bottom"></view>
	</view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { getNavigation } from '@/api/public.js';
// import {getCartCounts} from '@/api/order.js';
import { getDiyVersion } from '@/api/api.js';
import BaseBadge from '@/components/BaseBadge/index.vue';
import { GroupCartManager, getGroupCartCount } from '@/api/groupCart.js';

export default {
	name: 'pageFooter',
	components: { BaseBadge },
	props: {
		isTabBar: {
			type: Boolean,
			default: true
		},
		configData: {
			type: Object,
			default: () => {}
		}
	},
	computed: {
		...mapGetters(['isLogin', 'cartNum']),
		txtActiveColor() {
			let styleObject = {};
			if (this.newData.toneConfig && this.newData.toneConfig.tabVal) {
				styleObject['color'] = this.newData.activeTxtColor.color[0].item;
			} else {
				// 默认使用活力橙作为激活色
				styleObject['color'] = '#FF840B';
			}
			return styleObject;
		},
		txtColor() {
			let styleObject = {};
			if (this.newData.toneConfig && this.newData.toneConfig.tabVal) {
				styleObject['color'] = this.newData.txtColor.color[0].item;
			}
			return styleObject;
		},
		bgColor() {
			let styleObject = {};
			if (!this.newData.name) {
				return styleObject;
			}
			if (!this.newData.navConfig.tabVal) {
				styleObject['background'] = this.newData.bgColor.color[0].item;
			}
			return styleObject;
		},
		componentStyle() {
			let styleObject = {};
			let borderRadius = ``;
			if (!this.newData.name) {
				return styleObject;
			}
			if (this.newData.navConfig.tabVal) {
				borderRadius = `${this.newData.fillet.val * 2}rpx`;
				if (this.newData.fillet.type) {
					borderRadius = `${this.newData.fillet.valList[0].val * 2}rpx ${this.newData.fillet.valList[1].val * 2}rpx ${this.newData.fillet.valList[3].val * 2}rpx ${
						this.newData.fillet.valList[2].val * 2
					}rpx`;
				}
				styleObject['right'] = `${this.newData.prConfig.val * 2}rpx`;
				styleObject['bottom'] = `${this.newData.mbConfig.val * 2}rpx`;
				styleObject['left'] = `${this.newData.prConfig.val * 2}rpx`;
				styleObject['padding-top'] = `${this.newData.topConfig.val * 2}rpx`;
				styleObject['padding-bottom'] = `${this.newData.bottomConfig.val * 2}rpx`;
				styleObject['border-radius'] = borderRadius;
				styleObject['background'] = this.newData.bgColor2.color[0].item;
			} else {
				styleObject['padding-top'] = `${this.newData.topConfig.val * 2}rpx`;
				styleObject['padding-bottom'] = `${this.newData.bottomConfig.val * 2}rpx`;
				styleObject['background'] = this.newData.bgColor.color[0].item;
			}
			return styleObject;
		}
	},
	watch: {
		configData(newVal) {
			if (!this.showTabBar && newVal) {
				let configData = newVal;
				// 强制设置激活颜色为活力橙
				if (configData.activeTxtColor && configData.activeTxtColor.color && configData.activeTxtColor.color[0]) {
					configData.activeTxtColor.color[0].item = '#FF840B';
				}
				this.newData = configData;
				this.showTabBar = configData.effectConfig.tabVal;
			}
		},
		isLogin: {
			handler(newVal) {
				if (newVal) {
					// 用户登录后更新购物车数量
					this.updateCartNum();
				} else {
					this.$store.commit('indexData/setCartNum', '');
				}
			},
			immediate: true
		}
	},
	created() {
		let routes = getCurrentPages(); //获取当前打开过的页面路由数组
		let curRoute = routes[routes.length - 1].route; //获取当前页面路由
		this.activeRouter = '/' + curRoute;
	},
	mounted() {
		// 清除tabbar相关缓存，确保新颜色配置生效
		uni.removeStorageSync('footerNavigation');
		uni.removeStorageSync('diyVersionNav');
		this.navigationInfo();
		// 组件挂载时获取购物车数量
		if (this.isLogin) {
			this.updateCartNum();
		}
	},
	data() {
		return {
			newData: {},
			activeRouter: '',
			showTabBar: false,
			footerHeight: 0
		};
	},
	methods: {
		// 判断是否为当前激活的tab，处理路径映射
		isActiveTab(item) {
			let itemLink = item.link.split('?')[0];
			// 处理路径映射
			if (itemLink == '/pages/goods_cate/goods_cate') {
				itemLink = '/pages/goods_category/index';
			}
			return itemLink == this.activeRouter;
		},
		setNavigationInfo(data) {
			if (this.isTabBar) {
				this.newData = data;
				this.showTabBar = data.effectConfig.tabVal;
				let pdHeight = data.topConfig.val + data.bottomConfig.val;
				this.$emit('newDataStatus', data.effectConfig.tabVal, pdHeight);
				if (data.effectConfig.tabVal) {
					uni.hideTabBar();
				} else {
					uni.showTabBar();
				}
			}
		},
		getNavigationInfo() {
			getNavigation().then((res) => {
				// 强制设置激活颜色为活力橙
				if (res.data.activeTxtColor && res.data.activeTxtColor.color && res.data.activeTxtColor.color[0]) {
					res.data.activeTxtColor.color[0].item = '#FF840B';
				}
				uni.setStorageSync('diyVersionNav', res.data);
				this.setNavigationInfo(res.data);
			}).catch((err) => {
				console.log('获取导航配置失败，使用原生tabBar:', err);
				// 接口调用失败时，显示原生tabBar
				uni.showTabBar();
				this.showTabBar = false;
			});
		},
		navigationInfo() {
			let footerNavigation = uni.getStorageSync('footerNavigation');
			if (footerNavigation) {
				getDiyVersion(0).then((res) => {
					let diyVersion = uni.getStorageSync('diyVersionNav');
					if (res.data.version + '0' === diyVersion) {
						// 强制设置激活颜色为活力橙
						if (footerNavigation.activeTxtColor && footerNavigation.activeTxtColor.color && footerNavigation.activeTxtColor.color[0]) {
							footerNavigation.activeTxtColor.color[0].item = '#FF840B';
						}
						this.setNavigationInfo(footerNavigation);
					} else {
						uni.setStorageSync('diyVersionNav', res.data.version + '0');
						this.getNavigationInfo();
					}
				}).catch((err) => {
					console.log('获取DIY版本失败，使用原生tabBar:', err);
					// 接口调用失败时，显示原生tabBar
					uni.showTabBar();
					this.showTabBar = false;
				});
			} else {
				this.getNavigationInfo();
			}
		},
		goRouter(item) {
			var pages = getCurrentPages();
			var page = pages[pages.length - 1].$page.fullPath;
			if (item.link == page) return;

			// 路径映射 - 将错误的路径映射到正确的路径
			if (item.link == '/pages/goods_cate/goods_cate') {
				item.link = '/pages/goods_category/index';
			}

			if (item.link == '/pages/short_video/appSwiper/index' || item.link == '/pages/short_video/nvueSwiper/index') {
				//#ifdef APP
				item.link = '/pages/short_video/appSwiper/index';
				//#endif
				//#ifndef APP
				item.link = '/pages/short_video/nvueSwiper/index';
				//#endif
			}
			uni.switchTab({
				url: item.link,
				fail(err) {
					uni.redirectTo({
						url: item.link
					});
				}
			});
		},
		// 更新购物车数量
		async updateCartNum() {
			try {
				// 使用团购购物车API获取数量
				const count = await getGroupCartCount();
				if (count > 0) {
					this.$store.dispatch("indexData/setCartnumber", count);
				}
			} catch (error) {
				console.error('获取购物车数量失败:', error);
				// 静默失败，不显示错误提示
			}
		},
		
		// getCartNum: function() {
		// 	getCartCounts().then(res => {
		// 		this.$store.commit('indexData/setCartNum', res.data.count + '')
		// 	}).catch(err=>{
		// 		return this.$util.Tips({
		// 			title: err.msg
		// 		});
		// 	})
		// },
	}
};
</script>

<style scoped lang="scss">
.safe-area-inset-bottom {
	height: 0;
	height: constant(safe-area-inset-bottom);
	height: env(safe-area-inset-bottom);
}

.page-footer-wrapper {
	position: relative;
}

.page-footer {
	position: absolute;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;

	.foot-item image {
		display: block;
		height: 48rpx;
		width: 48rpx;
		margin: 0 auto;

		&.active-icon {
			/* 直接用背景色覆盖，简单粗暴但有效 */
			filter: brightness(0);
			background-color: #FF840B;
			border-radius: 4rpx;
			padding: 2rpx;
		}
	}

	.foot-item .txt {
		margin-top: 4rpx;
		font-size: 20rpx;
		line-height: 28rpx;
		color: #333333;

		&.active {
			color: var(--view-theme);
		}
	}
}
.page-footer /deep/.uni-badge--x {
	position: absolute !important;
	top: 0rpx;
}
.page-footer .uni-badge-left-margin{
	position: absolute;
	/* #ifdef MP */
	margin-left: 0;
	top: -16rpx;
	right: 60rpx;
	/* #endif */
	/* #ifndef MP */
	top: -16rpx;
	right: 60rpx;
	/* #endif */
}
.page-footer /deep/ .uni-badge-left-margin .uni-badge--error {
	color: #fff !important;
	background-color: var(--view-theme) !important;
	z-index: 8;
	font-size: 20rpx;
	transform: scale(0.8);
	padding: 0 6rpx;
	min-width: 32rpx;
	height: 32rpx;
	line-height: 32rpx;
}
.page-footer /deep/ .uni-badge {
	right: unset !important;
	top: unset !important;
}
.page-footer2 .foot-item .txt {
	margin-top: 0;
	font-size: 32rpx;
	line-height: 44rpx;
	color: #333333;

	&.active {
		color: var(--view-theme);
	}
}

.page-footer2.float .foot-item::before,
.page-footer3.float .foot-item::before {
	content: '';
	position: absolute;
	top: 50%;
	left: 0;
	width: 2rpx;
	height: 32rpx;
	background: #cccccc;
	transform: translateY(-50%);
}

.page-footer2.float .foot-item:first-child::before,
.page-footer3.float .foot-item:first-child::before {
	display: none;
}
</style>
