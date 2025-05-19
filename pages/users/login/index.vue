<template>
	<view class="login-wrapper">
		<!-- 手机号输入页 -->
		<view v-if="step === 1" class="login-page">
			<!-- 顶部装饰元素 -->
			<view class="top-decoration">
				<view class="gradient-bg"></view>
				<view class="circle-left"></view>
				<view class="circle-right-lg"></view>
				<view class="circle-right-sm"></view>
			</view>

			<!-- 状态栏 -->
			<view class="status-bar"></view>

			<!-- Logo -->
			<view class="logo-container">
				<view class="logo-box">
					<image :src="logoUrl" class="logo-img" />
				</view>
			</view>

			<!-- 欢迎文本 -->
			<view class="welcome-text">欢迎登录</view>

			<!-- 手机号输入 -->
			<view class="input-container">
				<view class="phone-input-box">
					<view class="area-code">
						<text>+</text>
						<text>86</text>
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
						<text class="get-code-text" :class="disabled ? 'disabled' : ''" @click="code">{{ text }}</text>
					</view>
				</view>

				<!-- 登录选项 -->
				<view class="login-options">
					<text class="pwd-login" @click="switchToPasswordLogin">密码登录</text>
					<text class="forgot-pwd">忘记密码？</text>
				</view>
			</view>

			<!-- 登录按钮 -->
			<view class="login-btn" @click="nextStep">
				<text class="login-btn-text">登录/注册</text>
			</view>

			<!-- 协议勾选 -->
			<view class="protocol-area">
				<checkbox-group @change="ChangeIsDefault">
					<view class="protocol-check">
						<checkbox :class="inAnimation ? 'trembling' : ''" @animationend="inAnimation = false"
							:checked="protocol ? true : false" style="transform: scale(0.7);" />
						<text class="protocol-text">同意《服务条款》《隐私政策》《张罗认证服务协议》</text>
					</view>
				</checkbox-group>
			</view>

			<!-- 跳过选项 -->
			<view class="skip-option">
				<text class="skip-text">暂时跳过</text>
			</view>

			<!-- 底部指示器 -->
			<view class="home-indicator"></view>
		</view>

		<!-- 密码设置页 -->
		<view v-if="step === 2">
			<view class="page-header">
				<text class="back-btn" @click="step = 1">⟨</text>
				<text class="page-title">设置密码</text>
			</view>
			<view class="step-hint">还差一步即可登录成功</view>
			<view class="input-section">
				<view class="input-group password-input">
					<input :type="showPwd ? 'text' : 'password'" placeholder="设置密码" v-model="password"
						class="password-input-field" />
					<text class="pwd-toggle" @click="togglePwdVisibility">👁</text>
				</view>
				<view class="input-group password-input">
					<input :type="showPwd ? 'text' : 'password'" placeholder="再次输入密码" v-model="confirmPassword"
						class="password-input-field" />
					<text class="pwd-toggle" @click="togglePwdVisibility">👁</text>
				</view>
			</view>
			<button class="submit-btn" :class="{ 'submit-btn-active': canGoToStep3 }"
				@click="setPassword">登录/注册</button>
			<view class="password-hint">密码为8-18位字母数字组合</view>
		</view>

		<!-- 地址选择页 -->
		<view v-if="step === 3">
			<view class="page-header">
				<text class="back-btn" @click="step = 2">⟨</text>
				<text class="page-title">选择地址</text>
			</view>
			<view class="step-hint">还差一步即可登录成功</view>
			<view class="address-section">
				<view class="address-item" @click="showAreaPicker">
					<text class="address-label">选择区域</text>
					<view class="address-value">
						<text class="address-text">{{ selectedArea || '' }}</text>
						<text class="address-arrow">▼</text>
					</view>
				</view>
				<view class="address-item" @click="showCommunityPicker">
					<text class="address-label">选择社区</text>
					<view class="address-value">
						<text class="address-text">{{ selectedCommunity || '' }}</text>
						<text class="address-arrow">▼</text>
					</view>
				</view>
				<view class="address-item" @click="showLocationPicker">
					<text class="address-label">选择地点</text>
					<view class="address-value">
						<text class="address-text">{{ selectedLocation || '' }}</text>
						<text class="address-arrow">▼</text>
					</view>
				</view>
			</view>
			<button class="submit-btn" :class="{ 'submit-btn-active': canCompleteRegistration }"
				@click="completeRegistration">确定</button>
			<view class="address-hint">地址选择后将默认为您的团购收货点</view>
		</view>

		<Verify @success="success" :captchaType="captchaType" :imgSize="{ width: '330px', height: '155px' }"
			ref="verify"></Verify>
	</view>
</template>
<script>
import dayjs from '@/plugin/dayjs/dayjs.min.js'
import sendVerifyCode from '@/mixins/SendVerifyCode'
import { loginH5, loginMobile, registerVerify, register, getCodeApi, getUserInfo, appleLogin } from '@/api/user'
import attrs, { required, alpha_num, chs_phone } from '@/utils/validate'
import { getLogo } from '@/api/public'
// import cookie from "@/utils/store/cookie";
import { VUE_APP_API_URL } from '@/utils'
// #ifdef APP-PLUS
import { wechatAppAuth } from '@/api/api.js'
// #endif
const BACK_URL = 'login_back_url'
import colors from '@/mixins/color.js'
import Verify from '../components/verify/index.vue'
export default {
	name: 'Login',
	components: {
		Verify
	},
	mixins: [sendVerifyCode, colors],
	data: function () {
		return {
			copyRight: '',
			inAnimation: false,
			protocol: false,
			step: 1, // 1: 手机号验证码, 2: 设置密码, 3: 选择地址
			showCaptchaInput: true, // 控制验证码输入框显示，默认显示
			areaCode: '86', // 默认国家代码
			account: '',
			captcha: '',
			password: '',
			confirmPassword: '',
			showPwd: false, // 密码可见状态
			// 地址选择相关
			selectedArea: '',
			selectedCommunity: '',
			selectedLocation: '',
			areas: ['区域A', '区域B', '区域C'],
			communities: ['社区A', '社区B', '社区C'],
			locations: ['地点A', '地点B', '地点C'],
			// 以下保留原有数据
			navList: [this.$t(`快速登录`), this.$t(`账号登录`)],
			current: 1,
			formItem: 1,
			type: 'login',
			logoUrl: '',
			keyCode: '',
			codeUrl: '',
			codeVal: '',
			isShowCode: false,
			appLoginStatus: false, // 微信登录强制绑定手机号码状态
			appUserInfo: null, // 微信登录保存的用户信息
			appleLoginStatus: false, // 苹果登录强制绑定手机号码状态
			appleUserInfo: null,
			appleShow: false, // 苹果登录版本必须要求ios13以上的
			keyLock: true,
			captchaType: 'clickWord',
		}
	},
	computed: {
		canProceed () {
			return this.account && this.account.length === 11 && this.captcha && this.captcha.length === 6 && this.protocol
		},
		canGoToStep3 () {
			return this.password && this.password.length >= 8 && this.password === this.confirmPassword
		},
		canCompleteRegistration () {
			return this.selectedArea && this.selectedCommunity && this.selectedLocation
		}
	},
	watch: {
		formItem: function (nval, oVal) {
			if (nval == 1) {
				this.type = 'login'
			} else {
				this.type = 'register'
			}
		}
	},
	onLoad () {
		let self = this
		uni.getSystemInfo({
			success: (res) => {
				if (res.platform.toLowerCase() == 'ios' && this.getSystem(res.system)) {
					self.appleShow = true
				}
			}
		})
		if (uni.getStorageSync('copyRight').copyrightContext) {
			this.copyRight = uni.getStorageSync('copyRight').copyrightContext
		}
	},
	mounted () {
		this.getLogoImage()
	},
	methods: {
		// 切换到密码登录
		switchToPasswordLogin () {
			// 这里实现密码登录的逻辑
			console.log('切换到密码登录')
		},

		// 步骤控制方法
		nextStep () {
			if (!this.protocol) {
				this.inAnimation = true
				return this.$util.Tips({
					title: '请先阅读并同意协议'
				})
			}

			if (!this.account) {
				return this.$util.Tips({
					title: this.$t(`请填写手机号码`)
				})
			}

			if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(this.account)) {
				return this.$util.Tips({
					title: this.$t(`请输入正确的手机号码`)
				})
			}

			if (!this.captcha) {
				return this.$util.Tips({
					title: this.$t(`请填写验证码`)
				})
			}

			if (!/^[\w\d]+$/i.test(this.captcha)) {
				return this.$util.Tips({
					title: this.$t(`请输入正确的验证码`)
				})
			}

			// 验证手机号和验证码
			this.verifyPhoneAndCaptcha()
		},

		verifyPhoneAndCaptcha () {
			let that = this
			// 在实际场景中，这里应该调用API验证手机号和验证码是否正确
			// 简化处理，直接进入下一步
			this.step = 2
		},

		setPassword () {
			if (!this.password) {
				return this.$util.Tips({
					title: this.$t(`请填写密码`)
				})
			}

			if (this.password.length < 8 || this.password.length > 18) {
				return this.$util.Tips({
					title: this.$t(`密码长度应为8-18位`)
				})
			}

			if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(this.password)) {
				return this.$util.Tips({
					title: this.$t(`密码应包含字母和数字`)
				})
			}

			if (this.password !== this.confirmPassword) {
				return this.$util.Tips({
					title: this.$t(`两次输入的密码不一致`)
				})
			}

			// 密码验证通过，进入地址选择步骤
			this.step = 3
		},

		completeRegistration () {
			if (!this.selectedArea || !this.selectedCommunity || !this.selectedLocation) {
				return this.$util.Tips({
					title: this.$t(`请完成地址选择`)
				})
			}

			// 在实际场景中，这里应该调用API完成注册
			// 使用已有的注册方法，添加地址信息
			register({
				account: this.account,
				captcha: this.captcha,
				password: this.password,
				spread: this.$Cache.get('spread'),
				area: this.selectedArea,
				community: this.selectedCommunity,
				location: this.selectedLocation
			})
				.then((res) => {
					this.$util.Tips({
						title: res
					})
					// 注册成功后自动登录
					this.loginAfterRegistration()
				})
				.catch((res) => {
					this.$util.Tips({
						title: res
					})
				})
		},

		loginAfterRegistration () {
			// 注册成功后自动登录
			loginMobile({
				phone: this.account,
				captcha: this.captcha,
				spread: this.$Cache.get('spread')
			})
				.then((res) => {
					let data = res.data
					this.$store.commit('LOGIN', {
						token: data.token,
						time: data.expires_time - this.$Cache.time()
					})
					let backUrl = this.$Cache.get(BACK_URL) || '/pages/index/index'
					this.$Cache.clear(BACK_URL)
					getUserInfo().then((res) => {
						this.$store.commit('SETUID', res.data.uid)
						uni.reLaunch({
							url: backUrl
						})
					})
				})
				.catch((res) => {
					this.$util.Tips({
						title: res
					})
				})
		},

		// UI 交互方法
		togglePwdVisibility () {
			this.showPwd = !this.showPwd
		},

		showAreaCode () {
			uni.showActionSheet({
				itemList: ['+86', '+852', '+853', '+886'],
				success: (res) => {
					const codes = ['86', '852', '853', '886']
					this.areaCode = codes[res.tapIndex]
				}
			})
		},

		showAreaPicker () {
			uni.showActionSheet({
				itemList: this.areas,
				success: (res) => {
					this.selectedArea = this.areas[res.tapIndex]
				}
			})
		},

		showCommunityPicker () {
			if (!this.selectedArea) {
				return this.$util.Tips({
					title: this.$t(`请先选择区域`)
				})
			}
			uni.showActionSheet({
				itemList: this.communities,
				success: (res) => {
					this.selectedCommunity = this.communities[res.tapIndex]
				}
			})
		},

		showLocationPicker () {
			if (!this.selectedCommunity) {
				return this.$util.Tips({
					title: this.$t(`请先选择社区`)
				})
			}
			uni.showActionSheet({
				itemList: this.locations,
				success: (res) => {
					this.selectedLocation = this.locations[res.tapIndex]
				}
			})
		},

		// 保留原有方法
		ChangeIsDefault (e) {
			this.$set(this, 'protocol', !this.protocol)
		},
		privacy (type) {
			uni.navigateTo({
				url: '/pages/users/privacy/index?type=' + type
			})
		},
		// IOS 版本号判断
		getSystem (system) {
			let str
			system.toLowerCase().indexOf('ios') === -1 ? (str = system) : (str = system.split(' ')[1])
			if (str.indexOf('.')) return str.split('.')[0] >= 13
			return str >= 13
		},
		success (data) {
			this.$refs.verify.hide()
			getCodeApi()
				.then((res) => {
					this.keyCode = res.data.key
					this.getCode(data)
				})
				.catch((res) => {
					this.$util.Tips({
						title: res
					})
				})
		},
		code () {
			let that = this
			if (!that.protocol) {
				this.inAnimation = true
				return that.$util.Tips({
					title: '请先阅读并同意协议'
				})
			}
			if (!that.account)
				return that.$util.Tips({
					title: that.$t(`请填写手机号码`)
				})
			if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.account))
				return that.$util.Tips({
					title: that.$t(`请输入正确的手机号码`)
				})
			this.$refs.verify.show()
		},
		async getLogoImage () {
			let that = this
			getLogo(2).then((res) => {
				that.logoUrl = res.data.logo_url
			})
		},
		async getCode (data) {
			let that = this
			if (!that.protocol) {
				this.inAnimation = true
				return that.$util.Tips({
					title: '请先阅读并同意协议'
				})
			}
			if (!that.account)
				return that.$util.Tips({
					title: that.$t(`请填写手机号码`)
				})
			if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.account))
				return that.$util.Tips({
					title: that.$t(`请输入正确的手机号码`)
				})

			await registerVerify({
				phone: that.account,
				type: 'register',
				key: that.keyCode,
				captchaType: this.captchaType,
				captchaVerification: data.captchaVerification
			})
				.then((res) => {
					this.sendCode()
					that.$util.Tips({
						title: res.msg
					})
				})
				.catch((res) => {
					that.$util.Tips({
						title: res
					})
				})
		},
		navTap: function (index) {
			this.current = index
		},
		async submit () {
			let that = this
			if (!that.protocol) {
				this.inAnimation = true
				return that.$util.Tips({
					title: '请先阅读并同意协议'
				})
			}
			if (!that.account)
				return that.$util.Tips({
					title: that.$t(`请填写账号`)
				})
			if (!/^[\w\d]{5,16}$/i.test(that.account))
				return that.$util.Tips({
					title: that.$t(`请输入正确的账号`)
				})
			if (!that.password)
				return that.$util.Tips({
					title: that.$t(`请填写密码`)
				})
			if (this.keyLock) {
				this.keyLock = !this.keyLock
			} else {
				return that.$util.Tips({
					title: that.$t(`请勿重复点击`)
				})
			}
			loginH5({
				account: that.account,
				password: that.password,
				spread: that.$Cache.get('spread')
			})
				.then(({ data }) => {
					that.$store.commit('LOGIN', {
						token: data.token,
						time: data.expires_time - this.$Cache.time()
					})
					let backUrl = that.$Cache.get(BACK_URL) || '/pages/index/index'
					that.$Cache.clear(BACK_URL)
					getUserInfo()
						.then((res) => {
							this.keyLock = true
							that.$store.commit('SETUID', res.data.uid)
							uni.reLaunch({
								url: backUrl
							})
						})
						.catch((error) => {
							this.keyLock = true
						})
				})
				.catch((e) => {
					this.keyLock = true
					that.$util.Tips({
						title: e
					})
				})
		}
	}
}
</script>
<style>
page {
	background: #fff;
}
</style>
<style lang="scss">
.login-wrapper {
	position: relative;
	width: 100%;
	min-height: 100vh;
	background-color: #FFFFFF;

	.login-page {
		position: relative;
		width: 100%;
		height: 100vh;
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
			filter: blur(12.5px);
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
			filter: blur(12.5px);
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
			filter: blur(4px);
		}
	}

	/* 状态栏 */
	.status-bar {
		position: absolute;
		width: 100%;
		height: 44px;
		left: 0;
		top: 0;
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

				.arrow {
					font-size: 12px;
					margin-left: 3px;
					transform: rotate(90deg);
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

				.get-code-text {
					font-size: 16px;
					color: #999999;

					&.disabled {
						color: #CCCCCC;
					}
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
		background: #FFC082;
		border-radius: 22.5px;
		display: flex;
		align-items: center;
		justify-content: center;

		.login-btn-text {
			font-size: 16px;
			color: #FCFCFC;
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
			align-items: flex-start;

			.protocol-text {
				font-size: 13px;
				line-height: 18px;
				color: #B3B3B3;
				text-align: center;
				width: 182px;
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

	/* 第二和第三页的样式保持不变，但按需可调整 */
	.page-header {
		display: flex;
		align-items: center;
		height: 90rpx;
		padding: 0 30rpx;
		position: relative;
		border-bottom: 1rpx solid #f5f5f5;

		.back-btn {
			font-size: 36rpx;
			color: #333;
			position: absolute;
			left: 30rpx;
		}

		.page-title {
			width: 100%;
			text-align: center;
			font-size: 34rpx;
			color: #333;
		}
	}

	.step-hint {
		font-size: 28rpx;
		color: #333;
		text-align: center;
		margin: 40rpx 0;
	}

	.input-section {
		padding: 0 30rpx;
		margin-bottom: 60rpx;

		.input-group {
			display: flex;
			align-items: center;
			height: 100rpx;
			background-color: #f8f8f8;
			border-radius: 8rpx;
			margin-bottom: 30rpx;
			padding: 0 20rpx;

			&.password-input {
				position: relative;

				.password-input-field {
					flex: 1;
					height: 100%;
					font-size: 32rpx;
				}

				.pwd-toggle {
					width: 60rpx;
					text-align: center;
					color: #999;
				}
			}
		}
	}

	.address-section {
		padding: 0 30rpx;

		.address-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 100rpx;
			border-bottom: 1rpx solid #f5f5f5;

			.address-label {
				font-size: 30rpx;
				color: #333;
			}

			.address-value {
				display: flex;
				align-items: center;

				.address-text {
					font-size: 30rpx;
					color: #999;
					margin-right: 10rpx;
				}

				.address-arrow {
					font-size: 24rpx;
					color: #999;
				}
			}
		}
	}

	.submit-btn {
		width: 90%;
		height: 90rpx;
		line-height: 90rpx;
		margin: 60rpx auto 0;
		background-color: #f5f5f5;
		color: #999;
		font-size: 32rpx;
		text-align: center;
		border-radius: 45rpx;

		&.submit-btn-active {
			background-color: #ff6600;
			color: #fff;
		}

		&::after {
			border: none;
		}
	}

	.password-hint,
	.address-hint {
		margin-top: 30rpx;
		text-align: center;
		font-size: 24rpx;
		color: #999;
	}
}

.trembling {
	animation: shake 0.6s;
}

@keyframes shake {

	0%,
	100% {
		transform: translateX(0);
	}

	10%,
	30%,
	50%,
	70%,
	90% {
		transform: translateX(-5px);
	}

	20%,
	40%,
	60%,
	80% {
		transform: translateX(5px);
	}
}
</style>
