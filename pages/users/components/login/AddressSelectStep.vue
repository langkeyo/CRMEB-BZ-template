<template>
	<view class="address-page">
		<view class="page-header">
			<view class="back-btn" @click="goBack">
				<svg class="back-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M15 18L9 12L15 6" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</view>
			<text class="page-title">选择地址</text>
		</view>
		<view class="step-hint">还差一步即可登录成功</view>
		<view class="address-section">
			<view class="address-item" @click="showAreaPicker">
				<text class="address-label">*选择区域</text>
				<view class="address-value">
					<text class="address-text">{{ selectedArea || '' }}</text>
					<text class="address-arrow">
						<text class="iconfont icon-arrow-down">▼</text>
					</text>
				</view>
			</view>
			<view class="address-item" @click="showCommunityPicker">
				<text class="address-label">*选择社区</text>
				<view class="address-value">
					<text class="address-text">{{ selectedCommunity || '' }}</text>
					<text class="address-arrow">
						<text class="iconfont icon-arrow-down">▼</text>
					</text>
				</view>
			</view>
			<view class="address-item" @click="showLocationPicker">
				<text class="address-label">*选择站点</text>
				<view class="address-value">
					<text class="address-text">{{ selectedLocation || '' }}</text>
					<text class="address-arrow">
						<text class="iconfont icon-arrow-down">▼</text>
					</text>
				</view>
			</view>
		</view>
		<button class="submit-btn" :class="{ 'submit-btn-active': canCompleteRegistration }"
			:style="canCompleteRegistration ? { background: colorStyle || '#FE8D00' } : {}"
			@click="completeRegistration">确定</button>
		<view class="address-hint">地址选择后将默认为您的团购收货点</view>
	</view>
</template>

<script>
export default {
	name: 'AddressSelectStep',
	props: {
		colorStyle: {
			type: String,
			default: ''
		},
		areas: {
			type: Array,
			default: () => ['区域A', '区域B', '区域C']
		},
		communities: {
			type: Array,
			default: () => ['社区A', '社区B', '社区C']
		},
		locations: {
			type: Array,
			default: () => ['地点A', '地点B', '地点C']
		}
	},
	data() {
		return {
			selectedArea: '',
			selectedCommunity: '',
			selectedLocation: ''
		}
	},
	computed: {
		canCompleteRegistration() {
			return this.selectedArea && this.selectedCommunity && this.selectedLocation
		}
	},
	methods: {
		goBack() {
			this.$emit('goBack')
		},
		showAreaPicker() {
			uni.showActionSheet({
				itemList: this.areas,
				success: (res) => {
					this.selectedArea = this.areas[res.tapIndex]
					// 清空下级选择
					this.selectedCommunity = ''
					this.selectedLocation = ''
				}
			})
		},
		showCommunityPicker() {
			if (!this.selectedArea) {
				this.$emit('showTip', '请先选择区域')
				return
			}
			uni.showActionSheet({
				itemList: this.communities,
				success: (res) => {
					this.selectedCommunity = this.communities[res.tapIndex]
					// 清空下级选择
					this.selectedLocation = ''
				}
			})
		},
		showLocationPicker() {
			if (!this.selectedCommunity) {
				this.$emit('showTip', '请先选择社区')
				return
			}
			uni.showActionSheet({
				itemList: this.locations,
				success: (res) => {
					this.selectedLocation = this.locations[res.tapIndex]
				}
			})
		},
		completeRegistration() {
			if (!this.selectedArea || !this.selectedCommunity || !this.selectedLocation) {
				this.$emit('showTip', '请完成地址选择')
				return
			}

			this.$emit('completeRegistration', {
				area: this.selectedArea,
				community: this.selectedCommunity,
				location: this.selectedLocation
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.address-page {
	position: relative;
	width: 100%;
	height: 100vh;
}

.page-header {
	display: flex;
	align-items: center;
	height: 44px;
	padding: 0 15px;
	position: relative;
	border-bottom: 1px solid #f5f5f5;
	margin-top: 44px;

	.back-btn {
		position: absolute;
		left: 15px;
		top: 10px;
		cursor: pointer;
		z-index: 10;
		height: 24px;
		width: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		
		.back-icon {
			width: 20px;
			height: 20px;
		}
	}

	.page-title {
		width: 100%;
		text-align: center;
		font-size: 18px;
		color: #1A1A1A;
		font-family: 'PingFang SC', sans-serif;
	}
}

.step-hint {
	font-size: 18px;
	color: #1A1A1A;
	text-align: center;
	margin: 20px 0;
	font-family: 'PingFang SC', sans-serif;
}

.address-section {
	padding: 0 34px;

	.address-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 45px;
		background-color: #F7F7F7;
		border-radius: 4px;
		margin-bottom: 16px;
		padding: 0 15px;
		cursor: pointer;

		.address-label {
			font-size: 16px;
			color: #CCCCCC;
			font-family: 'PingFang SC', sans-serif;
		}

		.address-value {
			display: flex;
			align-items: center;

			.address-text {
				font-size: 16px;
				color: #1A1A1A;
				margin-right: 10px;
			}

			.address-arrow {
				font-size: 12px;
				color: #333333;

				.iconfont {
					font-size: 12px;
				}
			}
		}
	}
}

.submit-btn {
	width: 307px;
	height: 45px;
	line-height: 45px;
	margin: 30px auto 0;
	background-color: #F7F7F7;
	color: #CCCCCC;
	font-size: 16px;
	text-align: center;
	border-radius: 22.5px;
	cursor: pointer;

	&.submit-btn-active {
		background-color: #FE8D00; /* 默认背景色，会被内联样式覆盖 */
		color: #FCFCFC;
	}

	&::after {
		border: none;
	}
}

.address-hint {
	margin-top: 15px;
	text-align: center;
	font-size: 13px;
	color: #B3B3B3;
	font-family: 'PingFang SC', sans-serif;
}
</style> 