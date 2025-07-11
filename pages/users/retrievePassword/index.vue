<template>
	<view class="retrieve-password-page" :style="colorStyle">
		<!-- 头部 -->
		<view class="header">
			<view class="back-icon" @click="navigateBack">
				<text class="iconfont icon-left"></text>
			</view>
			<view class="page-title">找回密码</view>
		</view>
		
		<!-- 验证部分 -->
		<view class="verification-section">
			<!-- 验证标题 -->
			<view class="section-title">手机号验证</view>
			
			<!-- 手机号输入区 -->
			<view class="phone-input-box">
				<view class="country-code">
					<text>+86</text>
					<text class="arrow-icon">▼</text>
				</view>
				<input type="number" v-model="phone" placeholder="请输入手机号" class="phone-input" />
			</view>
			
			<!-- 验证码输入区 -->
			<view class="code-input-box">
				<input type="number" v-model="captcha" placeholder="请输入验证码" class="code-input" />
				<view class="get-code" @click="sendCode" :class="{ disabled: disabled }">
					{{ text }}
				</view>
			</view>
			
			<!-- 错误提示 -->
			<view class="error-tip" v-if="errorMsg">
				{{ errorMsg }}
			</view>
			
			<!-- 提交按钮 -->
			<view class="confirm-btn" @click="verifyAndNext">确认</view>
		</view>
	</view>
</template>

<script>
	import sendVerifyCode from "@/mixins/SendVerifyCode";
	import colors from '@/mixins/color.js';
	import {
		registerVerify,
		registerReset,
		getCodeApi
	} from "@/api/user";
	// import { validatorDefaultCatch } from "@/utils/dialog";
	// import attrs, { required, alpha_num, chs_phone } from "@utils/validate";
	// import { VUE_APP_API_URL } from "@utils";

	export default {
		name: "RetrievePassword",
		mixins: [sendVerifyCode, colors],
		data() {
			return {
				phone: "",
				captcha: "",
				errorMsg: "",
				step: 1,  // 1:验证手机号 2:设置新密码
			};
		},
		mounted: function() {
			this.getCode();
		},
		methods: {
			navigateBack() {
				uni.navigateBack();
			},
			again() {
				this.codeUrl =
					VUE_APP_API_URL + "/captcha?" + this.keyCode + Date.parse(new Date());
			},
			getCode() {
				getCodeApi()
					.then(res => {
						this.keyCode = res.data.key;
					})
					.catch(res => {
						this.$util.Tips({
							title: res.msg.msg || this.$t(`加载失败`)
						})
					});
			},
			async sendCode() {
				let that = this;
				if (this.disabled) return;
				
				if (!that.phone) {
					that.errorMsg = "请填写手机号码";
					return;
				}
				
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.phone)) {
					that.errorMsg = "请输入正确的手机号码";
					return;
				}
				
				that.errorMsg = "";
				
				try {
					await registerVerify({
						phone: that.phone,
						type: 'retrieve'
					});
					
					that.sendCodeTimer(); // 启动倒计时
					uni.showToast({
						title: '验证码已发送',
						icon: 'none'
					});
				} catch (error) {
					that.errorMsg = error || "验证码发送失败，请重试";
				}
			},
			sendCodeTimer() {
				this.disabled = true;
				let time = 60;
				this.text = time + 's';
				
				const timer = setInterval(() => {
					time--;
					if (time > 0) {
						this.text = time + 's';
					} else {
						clearInterval(timer);
						this.disabled = false;
						this.text = '获取验证码';
					}
				}, 1000);
			},
			async verifyAndNext() {
				if (!this.phone) {
					this.errorMsg = "请填写手机号码";
					return;
				}
				
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(this.phone)) {
					this.errorMsg = "请输入正确的手机号码";
					return;
				}
				
				if (!this.captcha) {
					this.errorMsg = "请填写验证码";
					return;
				}
				
				// 验证验证码
				registerVerify({
					phone: this.phone,
					captcha: this.captcha,
					type: 'retrieve'
				}).then(res => {
					// 验证通过，进入设置新密码页面
					uni.navigateTo({
						url: `../retrievePassword/setPassword?phone=${this.phone}&captcha=${this.captcha}`
					});
				}).catch(error => {
					this.errorMsg = `验证码错误，请重试[${error.code || ''}]`;
				});
			},
		}
	};
</script>

<style lang="scss" scoped>
.retrieve-password-page {
	background-color: #fff;
	min-height: 100vh;
}

.header {
	position: relative;
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-bottom: 1rpx solid #f5f5f5;
	padding: 0 30rpx;
	
	.back-icon {
		position: absolute;
		left: 30rpx;
		font-size: 36rpx;
	}
	
	.page-title {
		font-size: 36rpx;
		font-weight: 500;
	}
}

.verification-section {
	padding: 50rpx 30rpx;
	
	.section-title {
		font-size: 40rpx;
		font-weight: 600;
		margin-bottom: 60rpx;
	}
	
	.phone-input-box {
		display: flex;
		align-items: center;
		background-color: #f5f5f5;
		border-radius: 45rpx;
		padding: 0 30rpx;
		margin-bottom: 30rpx;
		height: 90rpx;
		
		.country-code {
			display: flex;
			align-items: center;
			color: #333;
			font-size: 30rpx;
			margin-right: 15rpx;
			
			.arrow-icon {
				font-size: 20rpx;
				margin-left: 8rpx;
			}
		}
		
		.phone-input {
			flex: 1;
			height: 90rpx;
			font-size: 30rpx;
		}
	}
	
	.code-input-box {
		display: flex;
		align-items: center;
		background-color: #f5f5f5;
		border-radius: 45rpx;
		padding: 0 30rpx;
		margin-bottom: 30rpx;
		height: 90rpx;
		
		.code-input {
			flex: 1;
			height: 90rpx;
			font-size: 30rpx;
		}
		
		.get-code {
			color: #FF9500;
			font-size: 28rpx;
			white-space: nowrap;
			
			&.disabled {
				color: #999;
			}
		}
	}
	
	.error-tip {
		color: #ff4d4f;
		font-size: 26rpx;
		padding: 10rpx 30rpx;
		background-color: rgba(255, 77, 79, 0.1);
		border-radius: 8rpx;
		margin-bottom: 30rpx;
	}
	
	.confirm-btn {
		background: linear-gradient(90deg, #FF9500 0%, #FF5E00 100%);
		height: 90rpx;
		border-radius: 45rpx;
		color: #fff;
		font-size: 32rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 60rpx;
	}
}
</style>
