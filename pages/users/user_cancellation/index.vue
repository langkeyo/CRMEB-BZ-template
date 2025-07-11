<template>
	<view class="cancellation-page" :style="colorStyle">
		<view class="header">
			<view class="back-icon" @click="navigateBack">
				<text class="iconfont icon-left"></text>
			</view>
			<view class="page-title">更换手机号</view>
		</view>
		
		<!-- 顶部警告提示 -->
		<view class="warning-box">
			<view class="warning-text">账户注销后，您将在一个月内无法再登录进行团购，您确定要注销么？</view>
		</view>
		
		<!-- 验证部分 -->
		<view class="verification-section">
			<view class="section-title">请完成以下验证</view>
			
			<!-- 手机号验证提示 -->
			<view class="phone-tip">
				请输入{{ maskPhone(phone) }}收到的短信验证码
			</view>
			
			<!-- 验证码输入区 -->
			<view class="verification-code-input">
				<view class="input-label">短信验证码</view>
				<view class="input-box">
					<input type="number" v-model="smsCode" placeholder="请输入验证码" />
					<view class="get-code" @click="sendSmsCode" :class="{ disabled: codeSending }">{{ codeText }}</view>
				</view>
			</view>
			
			<!-- 提交按钮 -->
			<view class="submit-button" @click="submitCancellation">确定注销</view>
		</view>
	</view>
</template>

<script>
	import colors from '@/mixins/color.js';
	import sendVerifyCode from "@/mixins/SendVerifyCode";
	import {
		getUserAgreement,
		cancelUser,
		getPhoneNumber,
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
				codeText: '获取验证码'
			}
		},
		onLoad() {
			this.getUserPhone();
		},
		methods: {
			// 获取用户手机号
			getUserPhone() {
				getPhoneNumber().then(res => {
					this.phone = res.data || '';
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
			
			// 提交注销申请
			submitCancellation() {
				if (!this.smsCode) {
					return this.$util.Tips({
						title: '请输入验证码'
					});
				}
				
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
		height: 88rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-bottom: 1rpx solid #f5f5f5;
		
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

	.warning-box {
		background-color: #FFF9F2;
		padding: 20rpx 30rpx;
		margin-bottom: 30rpx;
		
		.warning-text {
			color: #FF9500;
			font-size: 28rpx;
			line-height: 40rpx;
		}
	}

	.verification-section {
		padding: 30rpx;
		
		.section-title {
			font-size: 40rpx;
			font-weight: 500;
			margin-bottom: 40rpx;
		}
		
		.phone-tip {
			color: #999;
			font-size: 28rpx;
			margin-bottom: 60rpx;
		}
		
		.verification-code-input {
			margin-bottom: 60rpx;
			
			.input-label {
				font-size: 30rpx;
				margin-bottom: 20rpx;
			}
			
			.input-box {
				display: flex;
				align-items: center;
				border-bottom: 1rpx solid #f0f0f0;
				padding-bottom: 20rpx;
				
				input {
					flex: 1;
					height: 80rpx;
					font-size: 32rpx;
				}
				
				.get-code {
					color: #1989fa;
					font-size: 28rpx;
					padding: 0 20rpx;
					
					&.disabled {
						color: #999;
					}
				}
			}
		}
		
		.submit-button {
			width: 100%;
			height: 90rpx;
			background: linear-gradient(90deg, #FF9500 0%, #FF5E00 100%);
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
