<template>
	<view class="index-page">
		<BannerSection />
		<FunctionEntry />
		<ModuleEntry />
		<HotGroup />
		<RecommendSection />
		<Topping />	
		<pageFooter @newDataStatus="newDataStatus"></pageFooter>
	</view>
</template>

<script>
import BannerSection from './components/BannerSection.vue'
import FunctionEntry from './components/FunctionEntry.vue'
import ModuleEntry from './components/ModuleEntry.vue'
import HotGroup from './components/HotGroup.vue'
import RecommendSection from './components/RecommendSection.vue'
import Topping from './components/Topping.vue'
import pageFooter from '@/components/pageFooter/index.vue'

export default {
	name: 'IndexStatic',
	components: {
		BannerSection,
		FunctionEntry,
		ModuleEntry,
		HotGroup,
		RecommendSection,
		Topping,
		pageFooter,
	},
	methods: {
		newDataStatus(val, pdHeight) {
			// 处理底部导航状态变化
		}
	}
}
</script>

<style lang="scss">
.index-page{
	padding-bottom: 50px;
	overflow-y: scroll;
	overflow-x: hidden;
	background-color: #FFFFFF;  /* 改为白色背景，避免灰色透出 */
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
