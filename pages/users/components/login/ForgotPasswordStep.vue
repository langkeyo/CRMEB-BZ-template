<template>
	<view class="forgot-password-page">
		<view class="page-header">
			<view class="back-btn" @click="goBack">
				<svg class="back-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M15 18L9 12L15 6" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</view>
			<text class="page-title">找回密码</text>
		</view>
		
		<!-- 第一步：手机号验证 -->
		<view class="input-section" v-if="step === 1">
			<view class="phone-input-box">
				<view class="area-code" @click="showAreaCode">
					<text>+</text>
					<text>{{areaCode}}</text>
					<text class="arrow">▼</text>
				</view>
				<view class="phone-divider"></view>
				<input type="number" placeholder="请输入手机号" v-model="account" :maxlength="11" class="phone-input" />
			</view>
			
			<!-- 验证码输入 -->
			<view class="code-input-area">
				<view class="code-input-box">
					<input type="number" placeholder="请输入验证码" :maxlength="6" v-model="captcha" class="code-input" />
				</view>
				<view class="get-code-box">
					<text class="get-code-text" :class="disabled ? 'disabled' : ''" @click="getCode">获取验证码</text>
				</view>
			</view>
		</view>
		
		<!-- 第二步：设置新密码 -->
		<view class="input-section" v-if="step === 2">
			<!-- 新密码输入 -->
			<view class="password-input-box">
				<input :type="showPwd ? 'text' : 'password'" placeholder="请输入新密码" v-model="password" class="password-input" />
				<view class="pwd-toggle" @click="togglePwdVisibility">
					<image :src="showPwd ? '/static/icons/show-pwd.svg' : '/static/icons/show-pwd.svg'" class="pwd-icon"></image>
				</view>
			</view>
			
			<!-- 确认密码输入 -->
			<view class="password-input-box">
				<input :type="showPwd ? 'text' : 'password'" placeholder="请确认新密码" v-model="confirmPassword" class="password-input" />
				<view class="pwd-toggle" @click="togglePwdVisibility">
					<image :src="showPwd ? '/static/icons/show-pwd.svg' : '/static/icons/show-pwd.svg'" class="pwd-icon"></image>
				</view>
			</view>
			
			<view class="password-hint">密码为8-18位字母数字组合</view>
		</view>
		
		<!-- 提交按钮 -->
		<button class="submit-btn" :class="{ 'submit-btn-active': canSubmit }" 
			:style="canSubmit ? { background: colorStyle || '#FE8D00' } : {}"
			@click="nextStep">{{ step === 1 ? '确认' : '重置密码' }}</button>
	</view>
</template>

<script>
export default {
	name: 'ForgotPasswordStep',
	props: {
		colorStyle: {
			type: String,
			default: ''
		},
		text: {
			type: String,
			default: '获取验证码'
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			step: 1, // 1: 手机号验证, 2: 设置新密码
			areaCode: '86',
			account: '',
			captcha: '',
			password: '',
			confirmPassword: '',
			showPwd: false
		}
	},
	computed: {
		canSubmit() {
			if (this.step === 1) {
				return this.account && this.captcha;
			} else {
				return this.password && 
					   this.confirmPassword && 
					   this.password === this.confirmPassword &&
					   this.password.length >= 8 &&
					   /^(?=.*[a-zA-Z])(?=.*\d).+$/.test(this.password);
			}
		}
	},
	methods: {
		showAreaCode() {
			uni.showActionSheet({
				itemList: ['+86', '+852', '+853', '+886'],
				success: (res) => {
					const codes = ['86', '852', '853', '886']
					this.areaCode = codes[res.tapIndex]
				}
			})
		},
		togglePwdVisibility() {
			this.showPwd = !this.showPwd
		},
		goBack() {
			if (this.step === 2) {
				// 如果在第二步，返回第一步
				this.step = 1
			} else {
				// 如果在第一步，返回上一页
				this.$emit('goBack')
			}
		},
		getCode() {
			if (this.disabled) return
			
			if (!this.account) {
				this.$emit('showTip', '请填写手机号码')
				return
			}
			
			if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(this.account)) {
				this.$emit('showTip', '请输入正确的手机号码')
				return
			}
			
			this.$emit('getCode', this.account)
		},
		nextStep() {
			if (this.step === 1) {
				// 第一步：验证手机号和验证码
				if (!this.account) {
					this.$emit('showTip', '请填写手机号码')
					return
				}
				
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(this.account)) {
					this.$emit('showTip', '请输入正确的手机号码')
					return
				}
				
				if (!this.captcha) {
					this.$emit('showTip', '请填写验证码')
					return
				}
				
				// 验证通过，进入第二步
				this.step = 2
			} else {
				// 第二步：验证密码并提交
				if (!this.password) {
					this.$emit('showTip', '请填写新密码')
					return
				}
				
				if (this.password.length < 8 || this.password.length > 18) {
					this.$emit('showTip', '密码长度应为8-18位')
					return
				}
				
				if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(this.password)) {
					this.$emit('showTip', '密码应包含字母和数字')
					return
				}
				
				if (this.password !== this.confirmPassword) {
					this.$emit('showTip', '两次输入的密码不一致')
					return
				}
				
				// 提交重置密码请求
				this.$emit('resetPassword', {
					account: this.account,
					captcha: this.captcha,
					password: this.password
				})
			}
		},
		resetPassword() {
			// 此方法保留兼容性，但实际功能已移至nextStep
			this.nextStep()
		}
	}
}
</script>

<style lang="scss" scoped>
/* 全局输入框样式覆盖 */
/deep/ uni-input, ::v-deep uni-input, >>> uni-input,
/deep/ uni-input-input, ::v-deep uni-input-input, >>> uni-input-input,
/deep/ .uni-input-wrapper, ::v-deep .uni-input-wrapper, >>> .uni-input-wrapper,
/deep/ .uni-input-input, ::v-deep .uni-input-input, >>> .uni-input-input,
/deep/ .uni-input-placeholder, ::v-deep .uni-input-placeholder, >>> .uni-input-placeholder {
	background-color: transparent !important;
	background: transparent !important;
	border: none !important;
	outline: none !important;
	box-shadow: none !important;
}

.forgot-password-page {
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

.input-section {
	padding: 0 34px;
	margin-top: 30px;
	
	.phone-input-box {
		display: flex;
		align-items: center;
		width: 100%;
		height: 45px;
		background: #F7F7F7;
		border-radius: 22.5px;
		padding: 0 20px;
		margin-bottom: 16px;

		.area-code {
			display: flex;
			align-items: center;
			font-size: 16px;
			color: #1A1A1A;
			cursor: pointer;

			.arrow {
				font-size: 12px;
				margin-left: 3px;
				transform: scale(0.8);
			}
		}

		.phone-divider {
			width: 1px;
			height: 20px;
			background: #CCCCCC;
			margin: 0 10px;
		}

		.phone-input {
			flex: 1;
			height: 100%;
			font-size: 16px;
			background: transparent;
			border: none;
			outline: none;
		}
		
		/deep/ input, ::v-deep input, >>> input {
			background-color: transparent !important;
			border: none !important;
			outline: none !important;
			box-shadow: none !important;
		}
	}

	.code-input-area {
		display: flex;
		justify-content: space-between;
		margin-bottom: 16px;

		.code-input-box {
			width: 184px;
			height: 45px;
			background: #F7F7F7;
			border-radius: 22.5px;
			padding: 0 15px;

			.code-input {
				width: 100%;
				height: 100%;
				font-size: 16px;
				background: transparent;
				border: none;
				outline: none;
			}
			
			/deep/ input, ::v-deep input, >>> input {
				background-color: transparent !important;
				border: none !important;
				outline: none !important;
				box-shadow: none !important;
			}
		}

		.get-code-box {
			width: 105px;
			height: 45px;
			background: #F7F7F7;
			border-radius: 22.5px;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;

			.get-code-text {
				font-size: 16px;
				color: #999999;

				&.disabled {
					color: #CCCCCC;
				}
			}
		}
	}
	
	.password-input-box {
		display: flex;
		align-items: center;
		width: 100%;
		height: 45px;
		background: #F7F7F7;
		border-radius: 22.5px;
		padding: 0 20px;
		margin-bottom: 16px;

		.password-input {
			flex: 1;
			height: 100%;
			font-size: 16px;
			background: transparent;
			border: none;
			outline: none;
		}
		
		/deep/ input, ::v-deep input, >>> input {
			background-color: transparent !important;
			border: none !important;
			outline: none !important;
			box-shadow: none !important;
		}

		.pwd-toggle {
			width: 30px;
			text-align: center;
			color: #CCCCCC;
			cursor: pointer;
			
			.pwd-icon {
				width: 20px;
				height: 20px;
			}
		}
	}
}

.submit-btn {
	width: 307px;
	height: 45px;
	line-height: 45px;
	margin: 30px auto 0;
	background-color: #FFC082;
	color: #FCFCFC;
	font-size: 16px;
	text-align: center;
	border-radius: 22.5px;
	cursor: pointer;

	&.submit-btn-active {
		background-color: #FE8D00; /* 默认背景色，会被内联样式覆盖 */
	}

	&::after {
		border: none;
	}
}

.password-hint {
	margin-top: 15px;
	text-align: center;
	font-size: 13px;
	color: #B3B3B3;
	font-family: 'PingFang SC', sans-serif;
}
</style> 