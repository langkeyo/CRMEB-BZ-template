<template>
	<view class="password-page">
		<view class="page-header">
			<view class="back-btn" @click="goBack">
				<svg class="back-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M15 18L9 12L15 6" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</view>
			<text class="page-title">设置密码</text>
		</view>
		<view class="step-hint">还差一步即可登录成功</view>
		<view class="input-section">
			<view class="input-group password-input">
				<input :type="showPwd ? 'text' : 'password'" placeholder="设置密码" v-model="password"
					class="password-input-field" />
				<view class="pwd-toggle" @click="togglePwdVisibility">
					<image :src="showPwd ? '/static/icons/show-pwd.svg' : '/static/icons/show-pwd.svg'" class="pwd-icon"></image>
				</view>
			</view>
			<view class="input-group password-input">
				<input :type="showPwd ? 'text' : 'password'" placeholder="再次输入密码" v-model="confirmPassword"
					class="password-input-field" />
				<view class="pwd-toggle" @click="togglePwdVisibility">
					<image :src="showPwd ? '/static/icons/show-pwd.svg' : '/static/icons/show-pwd.svg'" class="pwd-icon"></image>
				</view>
			</view>
		</view>
		<button class="submit-btn" :class="{ 'submit-btn-active': canGoToStep3 }" 
			:style="canGoToStep3 ? { background: colorStyle || '#FE8D00' } : {}"
			@click="setPassword">登录/注册</button>
		<view class="password-hint">密码为8-18位字母数字组合</view>
	</view>
</template>

<script>
export default {
	name: 'PasswordSetupStep',
	props: {
		colorStyle: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			password: '',
			confirmPassword: '',
			showPwd: false
		}
	},
	computed: {
		canGoToStep3() {
			return this.password && this.password.length >= 8 && this.password === this.confirmPassword
		}
	},
	methods: {
		togglePwdVisibility() {
			this.showPwd = !this.showPwd
		},
		goBack() {
			this.$emit('goBack')
		},
		setPassword() {
			if (!this.password) {
				this.$emit('showTip', '请填写密码')
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

			// 密码验证通过，进入地址选择步骤
			this.$emit('nextStep', {
				password: this.password
			})
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

.password-page {
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

.input-section {
	padding: 0 34px;
	margin-bottom: 30px;

	.input-group {
		display: flex;
		align-items: center;
		height: 45px;
		background-color: #F7F7F7;
		border-radius: 22.5px;
		margin-bottom: 16px;
		padding: 0 20px;

		&.password-input {
			position: relative;

			.password-input-field {
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

.password-hint {
	margin-top: 15px;
	text-align: center;
	font-size: 13px;
	color: #B3B3B3;
	font-family: 'PingFang SC', sans-serif;
}
</style> 