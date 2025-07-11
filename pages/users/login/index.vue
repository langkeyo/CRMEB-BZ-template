<template>
	<view class="login-wrapper">
		<!-- 手机号输入页 -->
		<PhoneInputStep 
			v-if="step === 1" 
			:logoUrl="logoUrl"
			:colorStyle="colorStyle"
			:disabled="disabled"
			@nextStep="handleNextStep"
			@passwordLogin="handlePasswordLogin"
			@getCode="handleGetCode"
			@showTip="showTip"
			@forgotPassword="forgotPassword"
			@skipLogin="skipLogin"
			@switchMode="handleSwitchMode"
		/>

		<!-- 密码设置页 -->
		<PasswordSetupStep 
			v-if="step === 2" 
			:colorStyle="colorStyle"
			@nextStep="handlePasswordSet"
			@goBack="step = 1"
			@showTip="showTip"
		/>

		<!-- 微信名称输入页 -->
		<WechatNameStep 
			v-if="step === 3" 
			:colorStyle="colorStyle"
			@completeRegistration="handleWechatNameSet"
			@goBack="step = 2"
			@showTip="showTip"
		/>

		<!-- 地址选择页 -->
		<AddressSelectStep 
			v-if="step === 4" 
			:colorStyle="colorStyle"
			:areas="areas"
			:communities="communities"
			:locations="locations"
			@completeRegistration="handleCompleteRegistration"
			@goBack="step = 3"
			@showTip="showTip"
		/>
		
		<!-- 找回密码页 -->
		<ForgotPasswordStep
			v-if="step === 5"
			:colorStyle="colorStyle"
			:disabled="disabled"
			@resetPassword="handleResetPassword"
			@getCode="handleGetCode"
			@goBack="step = 1"
			@showTip="showTip"
		/>

		<Verify @success="success" :captchaType="captchaType" :imgSize="{ width: '330px', height: '155px' }"
			ref="verify"></Verify>
	</view>
</template>
<script>
import dayjs from '@/plugin/dayjs/dayjs.min.js'
import sendVerifyCode from '@/mixins/SendVerifyCode'
import { loginH5, loginMobile, registerVerify, register, getCodeApi, getUserInfo, appleLogin, resetPassword } from '@/api/user'
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
import PhoneInputStep from '../components/login/PhoneInputStep.vue'
import PasswordSetupStep from '../components/login/PasswordSetupStep.vue'
import WechatNameStep from '../components/login/WechatNameStep.vue'
import AddressSelectStep from '../components/login/AddressSelectStep.vue'
import ForgotPasswordStep from '../components/login/ForgotPasswordStep.vue'

export default {
	name: 'Login',
	components: {
		Verify,
		PhoneInputStep,
		PasswordSetupStep,
		WechatNameStep,
		AddressSelectStep,
		ForgotPasswordStep
	},
	mixins: [sendVerifyCode, colors],
	data: function () {
		return {
			copyRight: '',
			step: 1, // 1: 手机号验证码, 2: 设置密码, 3: 微信名称, 4: 选择地址, 5: 找回密码
			loginMode: 'sms', // 登录模式：'sms'验证码登录, 'password'密码登录
			// 注册信息
			registerInfo: {
				account: '',
				captcha: '',
				password: '',
				wechatName: '',
				area: '',
				community: '',
				location: ''
			},
			// 地址选择相关
			areas: ['区域A', '区域B', '区域C'],
			communities: ['社区A', '社区B', '社区C'],
			locations: ['地点A', '地点B', '地点C'],
			// 以下保留原有数据
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
		// 处理模式切换
		handleSwitchMode(mode) {
			this.loginMode = mode
		},
		
		// 处理下一步
		handleNextStep(data) {
			this.registerInfo.account = data.account
			this.registerInfo.captcha = data.captcha
			this.step = 2
		},
		
		// 处理密码登录
		handlePasswordLogin(data) {
			if (this.keyLock) {
				this.keyLock = !this.keyLock
			} else {
				return this.$util.Tips({
					title: this.$t(`请勿重复点击`)
				})
			}
			
			loginH5({
				account: data.account,
				password: data.password,
				spread: this.$Cache.get('spread')
			})
				.then(({ data }) => {
					this.$store.commit('LOGIN', {
						token: data.token,
						time: data.expires_time - this.$Cache.time()
					})
					let backUrl = this.$Cache.get(BACK_URL) || '/pages/index/index'
					this.$Cache.clear(BACK_URL)
					getUserInfo()
						.then((res) => {
							this.keyLock = true
							this.$store.commit('SETUID', res.data.uid)
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
					this.$util.Tips({
						title: e
					})
				})
		},
		
		// 处理密码设置
		handlePasswordSet(data) {
			this.registerInfo.password = data.password
			this.step = 3 // 进入微信名称设置步骤
		},
		
		// 处理微信名称设置
		handleWechatNameSet(data) {
			this.registerInfo.wechatName = data.wechatName
			this.step = 4 // 进入地址选择步骤
		},
		
		// 处理注册完成
		handleCompleteRegistration(data) {
			this.registerInfo.area = data.area
			this.registerInfo.community = data.community
			this.registerInfo.location = data.location
			
			// 调用注册API
			register({
				account: this.registerInfo.account,
				captcha: this.registerInfo.captcha,
				password: this.registerInfo.password,
				wechatName: this.registerInfo.wechatName,
				spread: this.$Cache.get('spread'),
				area: this.registerInfo.area,
				community: this.registerInfo.community,
				location: this.registerInfo.location
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
		
		// 注册后登录
		loginAfterRegistration() {
			// 注册成功后自动登录
			loginMobile({
				phone: this.registerInfo.account,
				captcha: this.registerInfo.captcha,
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
		
		// 处理获取验证码
		handleGetCode(account) {
			this.account = account
			this.$refs.verify.show()
		},
		
		// 显示提示
		showTip(message) {
			this.$util.Tips({
				title: message
			})
		},

		success(data) {
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
		
		async getCode(data) {
			await registerVerify({
				phone: this.account,
				type: 'register',
				key: this.keyCode,
				captchaType: this.captchaType,
				captchaVerification: data.captchaVerification
			})
				.then((res) => {
					this.sendCode()
					this.$util.Tips({
						title: res.msg
					})
				})
				.catch((res) => {
					this.$util.Tips({
						title: res
					})
				})
		},
		
		async getLogoImage() {
			let that = this
			getLogo(2).then((res) => {
				that.logoUrl = res.data.logo_url
			})
		},
		
		// IOS 版本号判断
		getSystem(system) {
			let str
			system.toLowerCase().indexOf('ios') === -1 ? (str = system) : (str = system.split(' ')[1])
			if (str.indexOf('.')) return str.split('.')[0] >= 13
			return str >= 13
		},
		
		forgotPassword() {
			// 切换到找回密码页面
			this.step = 5; // 修改为步骤5
		},
		
		skipLogin() {
			// 跳过登录，返回首页
			let backUrl = this.$Cache.get(BACK_URL) || '/pages/index/index'
			this.$Cache.clear(BACK_URL)
			uni.reLaunch({
				url: backUrl
			})
		},
		
		handleResetPassword(data) {
			// 重置密码逻辑
			resetPassword({
				account: data.account,
				captcha: data.captcha,
				password: data.password
			})
				.then((res) => {
					this.$util.Tips({
						title: '密码重置成功'
					})
					// 重置成功后返回登录页
					setTimeout(() => {
						this.step = 1
						this.loginMode = 'password' // 切换到密码登录模式
					}, 1500)
				})
				.catch((res) => {
					this.$util.Tips({
						title: res
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
