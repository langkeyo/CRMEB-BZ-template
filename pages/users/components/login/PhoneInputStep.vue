<template>
	<view class="login-page">
		<!-- 顶部装饰元素 -->
		<view class="top-decoration">
			<view class="gradient-bg"></view>
			<view class="circle-left"></view>
			<view class="circle-right-lg"></view>
			<view class="circle-right-sm"></view>
		</view>



		<!-- Logo -->
		<view class="logo-container">
			<view class="logo-box">
				<image :src="logoUrl" class="logo-img" />
			</view>
		</view>

		<!-- 欢迎文本 -->
		<view class="welcome-text">欢迎登陆</view>

		<!-- 手机号输入 -->
		<view class="input-container">
			<view class="phone-input-box">
				<view class="area-code" @click="showAreaCode">
					<text>+</text>
					<text>{{areaCode}}</text>
					<text class="arrow">▼</text>
				</view>
				<view class="phone-divider"></view>
				<input type="number" placeholder="请输入手机号" v-model="account" :maxlength="11" class="phone-input" />
			</view>

			<!-- 验证码输入（验证码登录模式） -->
			<view v-if="loginMode === 'sms'" class="code-input-area">
				<view class="code-input-box">
					<input type="number" placeholder="请输入验证码" :maxlength="6" v-model="captcha" class="code-input" />
				</view>
				<view class="get-code-box">
					<text class="get-code-text" :class="disabled ? 'disabled' : ''" @click="getCode">{{ text }}</text>
				</view>
			</view>
			
			<!-- 密码输入（密码登录模式） -->
			<view v-if="loginMode === 'password'" class="password-input-box">
				<input :type="showPwd ? 'text' : 'password'" placeholder="请输入密码" v-model="password" class="password-input" />
				<view class="pwd-toggle" @click="togglePwdVisibility">
					<image :src="showPwd ? '/static/icons/show-pwd.svg' : '/static/icons/show-pwd.svg'" class="pwd-icon"></image>
				</view>
			</view>

			<!-- 登录选项 -->
			<view class="login-options">
				<text class="pwd-login" @click="switchLoginMode">
					{{ loginMode === 'sms' ? '密码登录' : '验证码登录' }}
				</text>
				<text class="forgot-pwd" @click="forgotPassword">忘记密码？</text>
			</view>
		</view>

		<!-- 登录按钮 -->
		<view class="login-btn" :class="{ 'login-btn-active': canLogin }" 
			:style="canLogin ? { background: colorStyle || '#FE8D00' } : {}"
			@click="handleLogin">
			<text class="login-btn-text">{{ loginMode === 'sms' ? '登录/注册' : '登录' }}</text>
		</view>

		<!-- 协议勾选 -->
		<view class="protocol-area">
			<view class="protocol-check">
				<label @click.prevent="toggleProtocol">
					<view class="custom-checkbox" :class="{'checked': protocol, 'trembling': inAnimation}" @animationend="inAnimation = false">
						<text v-if="protocol" class="check-mark">✓</text>
					</view>
					<text class="protocol-text">同意<text class="bold-text">《服务条款》《隐私政策》《来张罗认证服务协议》</text></text>
				</label>
			</view>
		</view>

		<!-- 跳过选项 -->
		<view class="skip-option">
			<text class="skip-text" @click="skipLogin">暂时跳过</text>
		</view>

		<!-- 底部指示器 -->
		<view class="home-indicator"></view>
	</view>
</template>

<script>
export default {
	name: 'PhoneInputStep',
	props: {
		logoUrl: {
			type: String,
			default: ''
		},
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
			areaCode: '86',
			account: '',
			captcha: '',
			password: '',
			showPwd: false,
			protocol: false,
			inAnimation: false,
			loginMode: 'sms'
		}
	},
	computed: {
		canLogin() {
			if (!this.protocol || !this.account) return false;
			
			if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(this.account)) return false;
			
			if (this.loginMode === 'sms') {
				return this.captcha && /^[\w\d]+$/i.test(this.captcha);
			} else {
				return this.password && this.password.length >= 6;
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
		switchLoginMode() {
			this.loginMode = this.loginMode === 'sms' ? 'password' : 'sms'
			// 清空相关输入
			this.captcha = ''
			this.password = ''
			this.$emit('switchMode', this.loginMode)
		},
		handleLogin() {
			if (!this.protocol) {
				this.inAnimation = true
				this.$emit('showTip', '请先阅读并同意协议')
				return
			}

			if (!this.account) {
				this.$emit('showTip', '请填写手机号码')
				return
			}

			if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(this.account)) {
				this.$emit('showTip', '请输入正确的手机号码')
				return
			}

			if (this.loginMode === 'sms') {
				if (!this.captcha) {
					this.$emit('showTip', '请填写验证码')
					return
				}

				if (!/^[\w\d]+$/i.test(this.captcha)) {
					this.$emit('showTip', '请输入正确的验证码')
					return
				}
				
				// 验证码登录/注册
				this.$emit('nextStep', {
					account: this.account,
					captcha: this.captcha
				})
			} else {
				if (!this.password) {
					this.$emit('showTip', '请填写密码')
					return
				}

				if (this.password.length < 6) {
					this.$emit('showTip', '密码长度不能少于6位')
					return
				}
				
				// 密码登录
				this.$emit('passwordLogin', {
					account: this.account,
					password: this.password
				})
			}
		},
		getCode() {
			if (this.disabled) return
			
			if (!this.protocol) {
				this.inAnimation = true
				this.$emit('showTip', '请先阅读并同意协议')
				return
			}
			
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
		forgotPassword() {
			this.$emit('forgotPassword')
		},
		skipLogin() {
			this.$emit('skipLogin')
		},
		toggleProtocol() {
			this.protocol = !this.protocol;
			this.$emit('update:protocol', this.protocol);
		}
	}
}
</script>

<style lang="scss" scoped>
/* 全局输入框样式覆盖 */
::v-deep uni-input,
::v-deep uni-input-input,
::v-deep .uni-input-wrapper,
::v-deep .uni-input-input,
::v-deep .uni-input-placeholder {
	background-color: transparent !important;
	background: transparent !important;
	border: none !important;
	outline: none !important;
	box-shadow: none !important;
}

/* 顶部装饰元素 */
.top-decoration {
	position: relative;
	width: 100%;
	height: 176px;

	.gradient-bg {
		position: absolute;
		width: 100%;
		height: 176px;
		left: 0;
		top: -5px;
		background: linear-gradient(180deg, rgba(254, 141, 0, 0.35) 0%, rgba(254, 141, 0, 0) 100%);
	}

	.circle-left {
		position: absolute;
		width: 107px;
		height: 107px;
		left: -26px;
		top: -28px;
		background: #FE8D00;
		opacity: 0.2;
		box-shadow: 0px 0px 4px rgba(27, 97, 209, 0.25);
		border-radius: 50%;
		filter: blur(25px);
	}

	.circle-right-lg {
		position: absolute;
		width: 72px;
		height: 72px;
		right: 48px;
		top: 3px;
		background: #FE8D00;
		opacity: 0.2;
		box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
		border-radius: 50%;
		filter: blur(25px);
	}

	.circle-right-sm {
		position: absolute;
		width: 38px;
		height: 38px;
		right: 35px;
		top: 96px;
		background: #FE8D00;
		opacity: 0.1;
		box-shadow: 0px 0px 4px rgba(45, 127, 253, 0.25);
		border-radius: 50%;
		filter: blur(8px);
	}
}

/* Logo */
.logo-container {
	position: absolute;
	left: calc(50% - 28.5px);
	top: 122px;

	.logo-box {
		width: 57px;
		height: 57px;
		background: #FE8D00;
		border-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: center;

		.logo-img {
			width: 43px;
			height: 43px;
			object-fit: contain;
		}
	}
}

/* 欢迎文本 */
.welcome-text {
	position: absolute;
	left: 33px;
	top: 205px;
	font-size: 20px;
	line-height: 28px;
	color: #FE8D00;
	font-family: 'PingFang SC', sans-serif;
	font-weight: 400;
}

/* 输入区域 */
.input-container {
	position: absolute;
	top: 249px;
	width: 100%;
	padding: 0 34px;

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
		margin-bottom: 12px;

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
		margin-bottom: 12px;

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
			font-size: 16px;

			.pwd-icon {
				width: 18px;
				height: 18px;
			}
		}
	}

	.login-options {
		display: flex;
		justify-content: space-between;
		margin-top: 12px;

		.pwd-login,
		.forgot-pwd {
			font-size: 14px;
			color: #1A1A1A;
			cursor: pointer;
		}
	}
}

/* 登录按钮 */
.login-btn {
	position: absolute;
	width: 307px;
	height: 45px;
	left: 34px;
	top: 426px;
	background: #FFC082; /* 默认背景色改为 #FFC082 */
	border-radius: 22.5px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	
	&.login-btn-active {
		background: #FE8D00; /* 激活状态背景色，会被内联样式覆盖 */
		
		.login-btn-text {
			color: #FCFCFC; /* 激活状态白色文字 */
		}
	}

	.login-btn-text {
		position: absolute;
		width: 72px;
		height: 22px;
		left: 50%;
		transform: translateX(-50%);
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 22px;
		text-align: center;
		color: #FCFCFC; /* 默认文字颜色改为白色 */
	}
}

/* 协议区域 */
.protocol-area {
	position: absolute;
	top: 489px;
	width: 100%;
	display: flex;
	justify-content: center;

	.protocol-check {
		display: flex;
		align-items: center;
		
		label {
			display: flex;
			align-items: flex-start;
			cursor: pointer;
		}
		
		.custom-checkbox {
			width: 12px;
			height: 12px;
			border: 1px solid #d1d1d1;
			border-radius: 50%;
			margin-right: 5px;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #fff;
			margin-top: 3px; /* 使其与文本第一行对齐 */
			flex-shrink: 0; /* 防止复选框被压缩 */
			
			&.checked {
				background-color: #FE8D00;
				border-color: #FE8D00;
			}
			
			.check-mark {
				color: #fff;
				font-size: 8px;
				line-height: 1;
			}
		}
		
		.protocol-text {
			font-size: 13px;
			line-height: 18px;
			color: #B3B3B3;
			text-align: left;
			width: 182px;
			font-family: 'PingFang SC', sans-serif;
			display: inline-block;
			vertical-align: middle;
			
			.bold-text {
				color: #1A1A1A;
			}
		}
	}
}

/* 跳过选项 */
.skip-option {
	position: absolute;
	width: 100%;
	text-align: center;
	bottom: 55px;

	.skip-text {
		font-size: 18px;
		color: #999999;
		font-family: 'PingFang SC', sans-serif;
		cursor: pointer;
	}
}

/* 底部指示器 */
.home-indicator {
	position: absolute;
	width: 100%;
	height: 32px;
	left: 0;
	bottom: 0;
}

.trembling {
	animation: shake 0.6s;
}

@keyframes shake {
	0%, 100% {
		transform: translateX(0);
	}
	10%, 30%, 50%, 70%, 90% {
		transform: translateX(-5px);
	}
	20%, 40%, 60%, 80% {
		transform: translateX(5px);
	}
}
</style> 