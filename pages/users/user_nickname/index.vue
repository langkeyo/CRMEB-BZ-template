<template>
	<view class="nickname-page" :style="colorStyle">
		<!-- 头部导航栏 -->
		<view class="header">
			<view class="back-btn" @click="navigateBack">
				<image src="/static/icons/back-arrow.svg" class="back-icon" />
			</view>
			<view class="page-title">修改昵称</view>
			<view class="complete-btn" @click="saveNickname">完成</view>
		</view>
		
		<!-- 输入框 -->
		<view class="input-container">
			<input 
				type="text" 
				v-model="nickname" 
				placeholder="加载中..." 
				:maxlength="16"
				focus
				class="nickname-input"
			/>
		</view>
		
		<!-- 提示文本 -->
		<view class="tip-text">
			请和群内微信名称保持一致
		</view>
	</view>
</template>

<script>
import colors from '@/mixins/color.js';
import { getUserInfo, userEdit } from '@/api/user.js';

export default {
	mixins: [colors],
	data() {
		return {
			nickname: '',
			originalNickname: ''
		};
	},
	onLoad() {
		this.getUserInfo();
	},
	methods: {
		// 获取用户信息
		getUserInfo() {
			getUserInfo().then(res => {
				this.nickname = res.data.nickname || '';
				this.originalNickname = res.data.nickname || '';
			}).catch(err => {
				this.$util.Tips({
					title: err || '获取用户信息失败'
				});
			});
		},
		
		// 保存昵称
		saveNickname() {
			if (!this.nickname.trim()) {
				return this.$util.Tips({
					title: '昵称不能为空'
				});
			}
			
			if (this.nickname === this.originalNickname) {
				return this.navigateBack();
			}
			
			// 提交修改
			userEdit({
				nickname: this.nickname
			}).then(res => {
				this.$util.Tips({
					title: '昵称修改成功',
					icon: 'success'
				});
				
				// 通知父页面刷新
				uni.$emit('updateUserInfo');
				
				// 延迟返回
				setTimeout(() => {
					this.navigateBack();
				}, 1500);
			}).catch(err => {
				this.$util.Tips({
					title: err || '昵称修改失败'
				});
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
.nickname-page {
	background-color: #f5f5f5;
	min-height: 100vh;
	position: relative;
}

.header {
	position: relative;
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #fff;
	border-bottom: 1rpx solid #f0f0f0;
	
	.back-btn {
		position: absolute;
		left: 30rpx;
		height: 100%;
		display: flex;
		align-items: center;
	}
	
	.back-icon {
		width: 32rpx;
		height: 32rpx;
	}
	
	.page-title {
		font-size: 36rpx;
		font-weight: 500;
	}
	
	.complete-btn {
		position: absolute;
		right: 30rpx;
		font-size: 32rpx;
		color: #333;
	}
}

.input-container {
	background-color: #fff;
	padding: 0 30rpx;
	margin: 30rpx;
	height: 90rpx;
	display: flex;
	align-items: center;

	.nickname-input {
		width: 100%;
		height: 90rpx;
		font-size: 32rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
	}
}

.tip-text {
	position: absolute;
	left: 0;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
	padding: 0 30rpx;
	font-size: 28rpx;
	color: #999;
	text-align: center;
	margin-top: 0;
}
</style> 