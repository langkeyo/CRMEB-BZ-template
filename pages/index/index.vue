<template>
	<view class="index-page">
		<BannerSection />
		<FunctionEntry />
		<ModuleEntry />
		<HotGroup />
		<RecommendSection ref="recommendSection" />
		<Topping ref="topping" />
		<customTabbar></customTabbar>

		<!-- 社区选择弹窗 -->
		<CommunitySelector :visible="showCommunitySelector" @close="showCommunitySelector = false"
			@bind-success="onCommunityBindSuccess" />
	</view>
</template>

<script>
import BannerSection from './components/BannerSection.vue'
import FunctionEntry from './components/FunctionEntry.vue'
import ModuleEntry from './components/ModuleEntry.vue'
import HotGroup from './components/HotGroup.vue'
import RecommendSection from './components/RecommendSection.vue'
import Topping from './components/Topping.vue'
import customTabbar from '@/components/customTabbar/index.vue'
import CommunitySelector from '@/components/CommunitySelector/index.vue'
import {
	getMyCommunityInfo
} from '@/api/group.js'
import { mapGetters } from 'vuex'
import { updateStoreCartNum } from '@/api/groupCart.js'

export default {
	name: 'IndexStatic',
	components: {
		BannerSection,
		FunctionEntry,
		ModuleEntry,
		HotGroup,
		RecommendSection,
		Topping,
		customTabbar,
		CommunitySelector,
	},
	options: {
		styleIsolation: 'apply-shared'
	},
	data() {
		return {
			showCommunitySelector: false,
			communityInfo: null,
			scrollTimer: null
		}
	},
	computed: {
		...mapGetters(['isLogin']),
	},
	onLoad() {
		this.checkCommunityBinding()

		// 更新购物车数量
		if (this.isLogin) {
			updateStoreCartNum().catch(err => {
				console.error('首页更新购物车数量失败:', err)
			})
		}
	},
	mounted() {
		// H5端添加滚动事件监听器作为备选方案
		// #ifdef H5
		window.addEventListener('scroll', this.handleWindowScroll)
		// #endif
	},
	beforeDestroy() {
		// H5端移除滚动事件监听器
		// #ifdef H5
		window.removeEventListener('scroll', this.handleWindowScroll)
		// #endif
	},
	onPageScroll(e) {
		console.log('页面滚动事件触发:', e)

		// 将滚动位置传递给Topping组件
		if (this.$refs.topping) {
			console.log('调用Topping组件的updateScrollPosition方法')
			this.$refs.topping.updateScrollPosition(e.scrollTop)
		} else {
			console.log('Topping组件引用不存在')
		}
	},
	onReady() {
		console.log('页面加载完成')
	},
	methods: {
		// 检查社区绑定状态
		async checkCommunityBinding() {
			try {
				const response = await getMyCommunityInfo()

				if (response.status === 200) {
					// 检查是否已绑定社区
					if (response.data && response.data.is_bind === true && response.data.community) {
						this.communityInfo = response.data.community
					} else {
						// 用户未绑定社区，显示选择弹窗
						this.showCommunityBindingTip()
					}
				} else {
					this.showCommunityBindingTip()
				}
			} catch (error) {
				this.showCommunityBindingTip()
			}
		},

		// 显示社区绑定提示
		showCommunityBindingTip() {
			uni.showModal({
				title: '提示',
				content: '您还未绑定社区，需要先绑定社区才能查看团购商品。是否选择社区？',
				confirmText: '选择社区',
				cancelText: '稍后',
				success: (res) => {
					if (res.confirm) {
						this.showCommunitySelector = true
					}
				}
			})
		},

		// 社区绑定成功回调
		onCommunityBindSuccess(community) {
			this.communityInfo = community

			// 可以在这里刷新页面数据，重新加载推荐商品等
			this.$refs.recommendSection?.initRecommendGoods?.()
		},

		newDataStatus(val, pdHeight) {
			// 处理底部导航状态变化
		},
		// H5端窗口滚动事件处理
		handleWindowScroll() {
			// 使用防抖避免频繁调用
			if (this.scrollTimer) {
				clearTimeout(this.scrollTimer)
			}
			this.scrollTimer = setTimeout(() => {
				const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
				console.log('H5窗口滚动事件触发:', scrollTop)
				
				// 将滚动位置传递给Topping组件
				if (this.$refs.topping) {
					this.$refs.topping.updateScrollPosition(scrollTop)
				}
			}, 100)
		}
	}
}
</script>

<style lang="scss">
.index-page {
	min-height: 100vh;
	padding-bottom: 50px;
	overflow-y: auto;
	overflow-x: hidden;
	background-color: #FFFFFF;
	/* 改为白色背景，避免灰色透出 */
}

.myApplet {
	position: relative;

	&::after {
		position: absolute;
		right: 55px;
		top: -5px;
		content: '';
		width: 0;
		height: 0;
		border-left: 7px solid transparent;
		border-right: 7px solid transparent;
		border-bottom: 7px solid #fff;
	}
}

.pictrue_log_class {
	background-color: var(--view-theme);
}

.ysize {
	background-size: 100%;
}

.fullsize {
	background-size: 100% 100%;
}

.repeat {
	background-repeat: repeat;
}

.noRepeat {
	background-repeat: no-repeat;
}

.error-network {
	position: fixed;
	left: 0;
	top: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	height: 100%;
	padding-top: 40rpx;
	background: #fff;

	image {
		width: 414rpx;
		height: 336rpx;
	}

	.title {
		position: relative;
		top: -40rpx;
		font-size: 32rpx;
		color: #666;
	}

	.con {
		font-size: 24rpx;
		color: #999;

		.label {
			margin-bottom: 20rpx;
		}

		.item {
			margin-bottom: 20rpx;
		}
	}

	.btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 508rpx;
		height: 86rpx;
		margin-top: 100rpx;
		border: 1px solid #D74432;
		color: #E93323;
		font-size: 30rpx;
		border-radius: 120rpx;
	}
}

.sort-scroll {
	background-color: #fff;
}

.sort-product {
	margin-top: 20rpx;
}

.site-config {
	margin: 40rpx 0;
	font-size: 24rpx;
	text-align: center;
	color: #666;

	&.fixed {
		position: fixed;
		bottom: 69px;
		left: 0;
		width: 100%;
	}
}

.select {
	border: 1px solid var(--view-theme);
}
</style>
