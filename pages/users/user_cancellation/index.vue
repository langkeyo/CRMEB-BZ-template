<template>
	<view class="cancellation-page" :style="colorStyle">
		<view class="header">
			<view class="back-icon" @click="navigateBack">
				<image src="/static/icons/back-arrow.svg" class="back-icon" />
			</view>
			<view class="page-title">账号注销</view>
		</view>
		
		<!-- 验证部分 -->
		<view class="verification-section" v-if="currentStep === 1">
			<view class="section-title">请完成身份验证</view>
			
			<!-- 手机号验证提示 -->
			<view class="phone-tip">请输入{{ maskPhone(phone) }}收到的短信验证码</view>
			
			<!-- 验证码输入区 -->
			<view class="input-label">短信验证码</view>
			<view class="input-box-row">
				<input type="number" v-model="smsCode" placeholder="请输入验证码" class="sms-input" />
				<view class="get-code-btn" @click="sendSmsCode" :class="{ disabled: codeSending }">{{ codeText }}</view>
			</view>
			<view class="divider"></view>
			<!-- 下一步按钮 -->
			<view class="submit-btn" @click="nextStep">下一步</view>
		</view>
		
		<!-- 警告确认部分 -->
		<view class="verification-section" v-if="currentStep === 2">
			<!-- 顶部警告提示 -->
			<view class="warning-box">
				<view class="warning-text">账户注销后，您将在一个月内无法再登录进行团购，您确定要注销么？</view>
			</view>
			
			<view class="confirm-actions">
				<view class="back-btn" @click="currentStep = 1">返回修改</view>
				<view class="confirm-btn" @click="submitCancellation">确定注销</view>
			</view>
		</view>
	</view>
</template>

<script>
	import colors from '@/mixins/color.js';
	import sendVerifyCode from "@/mixins/SendVerifyCode";
	import {
		getUserAgreement,
		cancelUser,
		getUserInfo,
		sendVerificationCode
	} from '@/api/user.js'
	const app = getApp();
	export default {
		mixins: [colors, sendVerifyCode],
		data() {
			return {
				phone: '', // 用户手机号
				smsCode: '', // 短信验证码
				codeSending: false, // 是否正在发送验证码
				codeText: '获取验证码',
				currentStep: 1 // 当前步骤：1=验证码输入, 2=确认警告
			}
		},
		onLoad() {
			this.getUserPhone();
		},
		methods: {
			// 获取用户手机号
			getUserPhone() {
				getUserInfo().then(res => {
					if (res.data && res.data.phone) {
						this.phone = res.data.phone || '';
					}
				}).catch(err => {
					this.$util.Tips({
						title: err || '获取手机号失败'
					});
				});
			},
			
			// 手机号脱敏处理
			maskPhone(phone) {
				if (!phone) return '';
				return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
			},
			
			// 发送短信验证码
			sendSmsCode() {
				if (this.codeSending) return;
				
				this.codeSending = true;
				this.codeText = '发送中...';
				
				// 调用发送验证码的接口
				sendVerificationCode(this.phone, 'cancellation').then(res => {
					this.$util.Tips({
						title: '验证码已发送'
					});
					this.startCodeTimer();
				}).catch(err => {
					this.codeSending = false;
					this.codeText = '获取验证码';
					this.$util.Tips({
						title: err || '验证码发送失败'
					});
				});
			},
			
			// 开始倒计时
			startCodeTimer() {
				let count = 60;
				this.codeText = `${count}s`;
				
				const timer = setInterval(() => {
					count--;
					if (count > 0) {
						this.codeText = `${count}s`;
					} else {
						clearInterval(timer);
						this.codeSending = false;
						this.codeText = '获取验证码';
					}
				}, 1000);
			},
			
			// 进入下一步
			nextStep() {
				if (!this.smsCode) {
					return this.$util.Tips({
						title: '请输入验证码'
					});
				}
				
				// 验证验证码是否正确
				this.currentStep = 2;
			},
			
			// 提交注销申请
			submitCancellation() {
				// 调用注销接口
				cancelUser({
					code: this.smsCode
				}).then(res => {
					app.globalData.spid = '';
					app.globalData.pid = '';
					this.$store.commit("LOGOUT");
					
					uni.showToast({
						title: '注销成功',
						icon: 'success',
						duration: 2000,
						success: () => {
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/index/index'
								});
							}, 2000);
						}
					});
				}).catch(msg => {
					return this.$util.Tips({
						title: msg || '注销失败'
					});
				});
			},
			
			// 返回上一页
			navigateBack() {
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cancellation-page {
		background-color: #fff;
		min-height: 100vh;
	}

	.header {
		position: relative;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-bottom: 1rpx solid #f5f5f5;
		
		.back-icon {
			position: absolute;
			left: 20rpx;
			width: 32rpx;
			height: 32rpx;
			display: flex;
			align-items: center;
		}
		
		.page-title {
			font-size: 36rpx;
			font-weight: 400;
			color: #1A1A1A;
		}
	}

	.warning-box {
		background-color: #FFF9F2;
		padding: 24rpx 30rpx;
		margin-bottom: 40rpx;
		border-radius: 8rpx;
		
		.warning-text {
			color: #FF9500;
			font-size: 28rpx;
			line-height: 40rpx;
		}
	}

	.verification-section {
		margin-top: 40rpx;
		padding: 0 30rpx;
		
		.section-title {
			font-size: 36rpx;
			color: #1A1A1A;
			font-weight: 500;
			margin-bottom: 12rpx;
		}
		
		.phone-tip {
			font-size: 26rpx;
			color: #CCCCCC;
			margin-bottom: 40rpx;
		}
		
		.input-label {
			font-size: 28rpx;
			color: #1A1A1A;
			margin-bottom: 12rpx;
		}
		
		.input-box-row {
			display: flex;
			align-items: center;
			margin-bottom: 24rpx;
			
			.sms-input {
				flex: 1;
				font-size: 32rpx;
				color: #1A1A1A;
				border: none;
				outline: none;
				background: transparent;
				height: 80rpx;
				line-height: 80rpx;
			}
			
			.get-code-btn {
				color: #1890FF;
				font-size: 28rpx;
				margin-left: 24rpx;
				
				&.disabled {
					color: #CCCCCC;
				}
			}
		}
		
		.divider {
			width: 100%;
			height: 1rpx;
			background: #F2F2F2;
			margin-bottom: 60rpx;
		}
		
		.submit-btn {
			width: 90%;
			height: 96rpx;
			background: #FE8D00;
			color: #FFFFFF;
			font-size: 32rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 60rpx auto;
			border-radius: 48rpx;
		}
		
		.confirm-actions {
			display: flex;
			justify-content: space-between;
			margin-top: 60rpx;
			
			.back-btn, .confirm-btn {
				width: 45%;
				height: 96rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 32rpx;
				border-radius: 48rpx;
			}
			
			.back-btn {
				background: #F5F5F5;
				color: #999999;
			}
			
			.confirm-btn {
				background: #FE8D00;
				color: #FFFFFF;
			}
		}
	}
</style>
