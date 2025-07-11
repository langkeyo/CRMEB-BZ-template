<template>
	<view class="wechat-name-page">
		<view class="page-header">
			<view class="back-btn" @click="goBack">
				<svg class="back-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M15 18L9 12L15 6" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</view>
			<text class="page-title">选择地址</text>
		</view>
		<view class="step-hint">还差一步即可登录成功</view>
		<view class="input-section">
			<view class="input-box">
				<input type="text" placeholder="请填写微信名称" v-model="wechatName" class="wechat-input" />
				<text class="required-mark">*</text>
			</view>
		</view>
		<button class="submit-btn" :class="{ 'submit-btn-active': canSubmit }"
			:style="canSubmit ? { background: colorStyle || '#FF9500' } : {}"
			@click="completeRegistration">确定</button>
		<view class="hint-text">提示：请与您团购群内名称一致</view>
	</view>
</template>

<script>
export default {
	name: 'WechatNameStep',
	props: {
		colorStyle: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			wechatName: ''
		}
	},
	computed: {
		canSubmit() {
			return this.wechatName.trim() !== '';
		}
	},
	methods: {
		goBack() {
			this.$emit('goBack')
		},
		completeRegistration() {
			if (!this.wechatName.trim()) {
				this.$emit('showTip', '请填写微信名称')
				return
			}

			this.$emit('completeRegistration', {
				wechatName: this.wechatName
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.wechat-name-page {
	position: relative;
	width: 100%;
	height: 100vh;
	background-color: #FFFFFF;
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
	font-size: 24px;
	color: #1A1A1A;
	margin: 60px 0 20px 65px;
	font-family: 'PingFang SC', sans-serif;
	font-weight: 500;
}

.input-section {
	padding: 0 34px;
	margin-top: 30px;

	.input-box {
		position: relative;
		width: 100%;
		height: 45px;
		background: #F7F7F7;
		border-radius: 4px;
		padding: 0 15px;
		margin-bottom: 16px;
		display: flex;
		align-items: center;

		.wechat-input {
			flex: 1;
			height: 100%;
			font-size: 16px;
			background: transparent;
			border: none;
			outline: none;
		}

		.required-mark {
			position: absolute;
			left: 0;
			top: 50%;
			transform: translateY(-50%);
			color: #FF0000;
			font-size: 16px;
			padding-left: 5px;
		}
	}
}

.submit-btn {
	width: 307px;
	height: 45px;
	line-height: 45px;
	margin: 30px auto 0;
	background-color: #F7F7F7;
	color: #FFFFFF;
	font-size: 16px;
	text-align: center;
	border-radius: 22.5px;
	cursor: pointer;

	&.submit-btn-active {
		background-color: #FF9500; /* 默认背景色，会被内联样式覆盖 */
	}

	&::after {
		border: none;
	}
}

.hint-text {
	margin-top: 15px;
	text-align: center;
	font-size: 13px;
	color: #B3B3B3;
	font-family: 'PingFang SC', sans-serif;
}
</style> 