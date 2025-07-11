<template>
	<view class="set-password-page" :style="colorStyle">
		<!-- 头部 -->
		<view class="header">
			<view class="back-icon" @click="navigateBack">
				<text class="iconfont icon-left"></text>
			</view>
			<view class="page-title">找回密码</view>
		</view>
		
		<!-- 设置密码部分 -->
		<view class="password-section">
			<!-- 标题 -->
			<view class="section-title">设置新密码</view>
			
			<!-- 密码输入 -->
			<view class="password-input-box">
				<input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="请输入新密码" class="password-input" />
				<view class="toggle-eye" @click="togglePasswordVisible">
					<text class="iconfont" :class="showPassword ? 'icon-eye-open' : 'icon-eye-close'"></text>
				</view>
			</view>
			
			<!-- 确认密码 -->
			<view class="password-input-box">
				<input :type="showConfirmPwd ? 'text' : 'password'" v-model="confirmPassword" placeholder="请再次输入密码" class="password-input" />
				<view class="toggle-eye" @click="toggleConfirmVisible">
					<text class="iconfont" :class="showConfirmPwd ? 'icon-eye-open' : 'icon-eye-close'"></text>
				</view>
			</view>
			
			<!-- 错误提示 -->
			<view class="error-tip" v-if="errorMsg">
				{{ errorMsg }}
			</view>
			
			<!-- 提交按钮 -->
			<view class="confirm-btn" @click="submitNewPassword">确认</view>
		</view>
	</view>
</template>

<script>
import colors from '@/mixins/color.js';
import {
	registerReset
} from "@/api/user";

export default {
	name: "SetPassword",
	mixins: [colors],
	data() {
		return {
			password: "",
			confirmPassword: "",
			showPassword: false,
			showConfirmPwd: false,
			errorMsg: "",
			phone: "",
			captcha: ""
		};
	},
	onLoad(options) {
		// 接收上一页传来的手机号和验证码
		if (options.phone) {
			this.phone = options.phone;
		}
		
		if (options.captcha) {
			this.captcha = options.captcha;
		}
		
		if (!this.phone || !this.captcha) {
			uni.showToast({
				title: '参数错误，请重新验证',
				icon: 'none'
			});
			setTimeout(() => {
				uni.navigateBack();
			}, 1500);
		}
	},
	methods: {
		// 切换密码可见性
		togglePasswordVisible() {
			this.showPassword = !this.showPassword;
		},
		
		// 切换确认密码可见性
		toggleConfirmVisible() {
			this.showConfirmPwd = !this.showConfirmPwd;
		},
		
		// 提交新密码
		submitNewPassword() {
			if (!this.password) {
				this.errorMsg = "请输入新密码";
				return;
			}
			
			if (this.password.length < 6) {
				this.errorMsg = "密码长度不能少于6位";
				return;
			}
			
			if (this.password !== this.confirmPassword) {
				this.errorMsg = "两次输入的密码不一致";
				return;
			}
			
			this.errorMsg = "";
			
			// 提交新密码
			registerReset({
				account: this.phone,
				captcha: this.captcha,
				password: this.password
			}).then(res => {
				uni.showToast({
					title: '密码重置成功',
					icon: 'success',
					duration: 2000
				});
				
				setTimeout(() => {
					// 跳转到登录页
					uni.navigateTo({
						url: '../login/index'
					});
				}, 2000);
			}).catch(error => {
				this.errorMsg = error || "密码重置失败，请重试";
			});
		},
		
		// 返回上一页
		navigateBack() {
			uni.navigateBack();
		}
	}
};
</script>

<style lang="scss" scoped>
.set-password-page {
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

.password-section {
	padding: 50rpx 30rpx;
	
	.section-title {
		font-size: 40rpx;
		font-weight: 600;
		margin-bottom: 60rpx;
	}
	
	.password-input-box {
		display: flex;
		align-items: center;
		background-color: #f5f5f5;
		border-radius: 45rpx;
		padding: 0 30rpx;
		margin-bottom: 30rpx;
		height: 90rpx;
		
		.password-input {
			flex: 1;
			height: 90rpx;
			font-size: 30rpx;
		}
		
		.toggle-eye {
			padding: 0 10rpx;
			font-size: 40rpx;
			color: #999;
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