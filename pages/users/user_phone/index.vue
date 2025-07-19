<template>
	<view class="change-phone-page">
		<!-- 顶部导航栏 -->
		<view class="nav-bar">
			<view class="back-btn" @click="goBack">
				<view class="back-arrow"></view>
			</view>
			<view class="nav-title">{{ step === 3 ? '系统提示' : '更换手机号' }}</view>
		</view>
		<view class="divider"></view>
		<view v-if="step === 1">
			<!-- 副标题 -->
			<view class="subtitle">请输入新手机号</view>
			<!-- 手机号输入区 -->
			<view class="input-row">
				<view class="area-code" @click="showAreaCode">+{{ areaCode }}<text class="arrow-down">▼</text></view>
				<input class="phone-input" type="number" v-model="phone" placeholder="请输入新手机号" placeholder-class="input-placeholder" maxlength="11" />
			</view>
			<view class="input-divider"></view>
			<!-- 下一步按钮 -->
			<button class="next-btn" :disabled="!phone" @click="nextStep">下一步</button>
		</view>
		<view v-else-if="step === 2">
			<!-- 验证码副标题 -->
			<view class="subtitle">请输入验证码</view>
			<view class="desc">已向手机号：{{ maskedPhone }}发送验证码</view>
			<view class="code-row">
				<input class="code-input" type="number" v-model="verificationCode" maxlength="6" placeholder="" />
				<view class="countdown">{{ countdown }}s</view>
			</view>
			<view class="input-divider"></view>
			<button class="next-btn" :disabled="!verificationCode" @click="submitCode">完成</button>
		</view>
		<view v-else>
			<!-- 操作成功页面 -->
			<view class="success-content">
				<view class="success-icon">
					<svg width="80" height="80" viewBox="0 0 80 80"><circle cx="40" cy="40" r="40" fill="#8BE51A"/><path d="M25 42l12 10 18-22" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
				</view>
				<view class="success-text">操作成功</view>
			</view>
			<button class="next-btn success-btn" @click="goBack">确认</button>
		</view>
		<!-- 底部Home Indicator -->
		<view class="home-indicator"></view>
	</view>
</template>

<script>
import sendVerifyCode from "@/mixins/SendVerifyCode"
import Verify from '../components/verify/index.vue'
import {
	registerVerify,
	bindingUserPhone,
	verifyCode,
	updatePhone
} from '@/api/api.js'
import {
	toLogin
} from '@/libs/login.js'
import {
	mapGetters
} from "vuex"
// #ifdef MP
import authorize from '@/components/Authorize'
// #endif
import colors from '@/mixins/color.js'
export default {
	mixins: [sendVerifyCode, colors],
	components: {
		// #ifdef MP
		authorize,
		// #endif
		Verify
	},
	data () {
		return {
			step: 1,
			phone: '',
			areaCode: '86',
			captcha: '',
			isAuto: false, //没有授权的不会自动授权
			isShowAuth: false, //是否隐藏授权
			key: '',
			authKey: '',
			type: 0,
			verificationCode: '', // 改名避免与方法冲突
			countdown: 60,
			timer: null
		}
	},
	computed: {
		...mapGetters(['isLogin']),
		maskedPhone() {
			if (!this.phone) return '';
			return this.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
		}
	},
	onLoad (options) {
		if (this.isLogin) {
			verifyCode().then(res => {
				this.$set(this, 'key', res.data.key)
			})
			this.authKey = options.key || ''
			this.url = options.url || ''
		} else {
			toLogin()
		}
		this.type = options.type || 0
	},
	methods: {
		goBack() {
			uni.navigateBack();
		},
		showAreaCode() {
			uni.showActionSheet({
				itemList: ['+86', '+852', '+853', '+886'],
				success: (res) => {
					const codes = ['86', '852', '853', '886']
					this.areaCode = codes[res.tapIndex]
				}
			})
		},
		nextStep() {
			this.step = 2;
			this.startCountdown();
		},
		startCountdown() {
			this.countdown = 60;
			if (this.timer) clearInterval(this.timer);
			this.timer = setInterval(() => {
				if (this.countdown > 0) {
					this.countdown--;
				} else {
					clearInterval(this.timer);
				}
			}, 1000);
		},
		submitCode() {
			// 验证码提交逻辑
			this.step = 3;
			if (this.timer) clearInterval(this.timer);
		},
		onLoadFun: function () { },
		// 授权关闭
		authColse: function (e) {
			this.isShowAuth = e
		},
		editPwd: function () {
			let that = this
			if (!that.phone) return that.$util.Tips({
				title: that.$t(`请填写手机号码`)
			})
			if (!(/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.phone))) return that.$util.Tips({
				title: that.$t(`请输入正确的手机号码`)
			})
			if (!that.captcha) return that.$util.Tips({
				title: that.$t(`请填写验证码`)
			})
			if (this.type == 0) {
				bindingUserPhone({
					phone: that.phone,
					captcha: that.captcha
				}).then(res => {
					if (res.data !== undefined && res.data.is_bind) {
						uni.showModal({
							title: that.$t(`是否绑定账号`),
							content: res.msg,
							confirmText: that.$t(`绑定`),
							success (res) {
								if (res.confirm) {
									bindingUserPhone({
										phone: that.phone,
										captcha: that.captcha,
										step: 1
									}).then(res => {
										return that.$util.Tips({
											title: res.msg,
											icon: 'success'
										}, {
											tab: 5,
											url: '/pages/users/user_info/index'
										})
									}).catch(err => {
										return that.$util.Tips({
											title: err
										})
									})
								} else if (res.cancel) {
									return that.$util.Tips({
										title: that.$t(`您已取消绑定！`)
									}, {
										tab: 5,
										url: '/pages/users/user_info/index'
									})
								}
							}
						})
					} else
						return that.$util.Tips({
							title: that.$t(`绑定成功`),
							icon: 'success'
						}, {
							tab: 5,
							url: '/pages/users/user_info/index'
						})
				}).catch(err => {
					return that.$util.Tips({
						title: err
					})
				})
			} else {
				updatePhone({
					phone: that.phone,
					captcha: that.captcha,
				}).then(res => {
					return that.$util.Tips({
						title: res.msg,
						icon: 'success'
					}, {
						tab: 5,
						url: '/pages/users/user_info/index'
					})
				}).catch(error => {
					return that.$util.Tips({
						title: error,
					})
				})
			}
		},
		success (data) {
			this.$refs.verify.hide()
			let that = this
			verifyCode().then(res => {
				registerVerify(that.phone, 'reset', res.data.key, this.captchaType, data.captchaVerification)
					.then(res => {
						that.$util.Tips({
							title: res.msg
						})
						that.sendCode()
					}).catch(err => {
						return that.$util.Tips({
							title: err
						})
					})
			})

		},
		/**
		 * 发送验证码
		 *
		 */
		async code () {
			let that = this
			if (!that.phone) return that.$util.Tips({
				title: that.$t(`请填写手机号码`)
			})
			if (!(/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.phone))) return that.$util.Tips({
				title: that.$t(`请输入正确的手机号码`)
			})
			this.$refs.verify.show()
			return
		}
	},
	beforeDestroy() {
		if (this.timer) clearInterval(this.timer);
	}
}
</script>

<style lang="scss" scoped>
.change-phone-page {
	width: 100vw;
	min-height: 100vh;
	background: #fff;
	position: relative;
	box-sizing: border-box;
}
.nav-bar {
	display: flex;
	align-items: center;
	height: 88rpx;
	position: relative;
	padding: 0 0 0 30rpx;
	background: #fff;
}
.back-btn {
	width: 44rpx;
	height: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
.back-arrow {
	width: 18rpx;
	height: 18rpx;
	border-left: 3rpx solid #1A1A1A;
	border-bottom: 3rpx solid #1A1A1A;
	transform: rotate(45deg);
	margin-left: 6rpx;
}
.nav-title {
	flex: 1;
	text-align: center;
	font-size: 32rpx;
	color: #1A1A1A;
	font-weight: 400;
	position: absolute;
	left: 0;
	right: 0;
	margin: auto;
	width: 180rpx;
	height: 88rpx;
	line-height: 88rpx;
}
.divider {
	width: 100%;
	height: 1rpx;
	background: #F2F2F2;
}
.subtitle {
	margin-top: 60rpx;
	margin-left: 34rpx;
	font-size: 36rpx;
	color: #1A1A1A;
	font-weight: 400;
	line-height: 50rpx;
}
.input-row {
	display: flex;
	align-items: center;
	margin: 60rpx 34rpx 0;
	width: calc(100% - 68rpx);
	height: 80rpx;
	background: #fff;
	box-shadow: 0 1rpx 0 0 #F5F5F5;
	border-radius: 0;
	position: relative;
}
.area-code {
	font-size: 32rpx;
	color: #1A1A1A;
	font-weight: 400;
	margin-right: 16rpx;
	display: flex;
	align-items: center;
	height: 80rpx;
}
.arrow-down {
	font-size: 24rpx;
	color: #1A1A1A;
	margin-left: 4rpx;
}
.phone-input {
	flex: 1;
	font-size: 32rpx;
	color: #1A1A1A;
	border: none;
	outline: none;
	background: transparent;
	height: 80rpx;
	line-height: 80rpx;
}
.input-placeholder {
	color: #CCCCCC;
	font-size: 32rpx;
}
.input-divider {
	width: calc(100% - 68rpx);
	height: 1rpx;
	background: #F5F5F5;
	margin: 0 34rpx;
}
.next-btn {
	width: calc(100% - 68rpx);
	max-width: 600rpx;
	height: 80rpx;
	background: #FE8D00;
	border-radius: 40rpx;
	color: #fff;
	font-size: 30rpx;
	font-weight: 400;
	margin: 60rpx auto 0;
	display: flex;
	align-items: center;
	justify-content: center;
	border: none;
	box-shadow: none;
}
.next-btn:disabled {
	background: #FFE0B2;
	color: #fff;
}
.home-indicator {
	position: fixed;
	left: 50%;
	bottom: 8rpx;
	transform: translateX(-50%);
	width: 134rpx;
	height: 5rpx;
	background: #000;
	border-radius: 100rpx;
	opacity: 0.8;
}
.desc {
	margin-left: 34rpx;
	margin-top: 12rpx;
	font-size: 26rpx;
	color: #CCCCCC;
	line-height: 36rpx;
}
.code-row {
	display: flex;
	align-items: center;
	margin: 80rpx 34rpx 0 34rpx;
	width: calc(100% - 68rpx);
	height: 80rpx;
	position: relative;
}
.code-input {
	flex: 1;
	font-size: 36rpx;
	color: #1A1A1A;
	border: none;
	outline: none;
	background: transparent;
	height: 80rpx;
	line-height: 80rpx;
}
.countdown {
	font-size: 28rpx;
	color: #CCCCCC;
	margin-left: 12rpx;
}
.success-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-top: 180rpx;
	margin-bottom: 120rpx;
}
.success-icon {
	width: 120rpx;
	height: 120rpx;
	margin-bottom: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
.success-text {
	font-size: 36rpx;
	color: #1A1A1A;
	font-weight: 400;
	margin-top: 10rpx;
}
.success-btn {
	margin-top: 120rpx;
	background: #FE8D00;
}
</style>
