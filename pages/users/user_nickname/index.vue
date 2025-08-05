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
				if (res.status === 200 || res.code === 200) {
					// 确保昵称不为空，如果为空则不设置
					this.nickname = res.data.nickname || '用户';
					this.originalNickname = res.data.nickname || '用户';
				} else {
					this.$util.Tips({
						title: res.msg || '获取用户信息失败'
					});
				}
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
			
			uni.showLoading({
				title: '保存中...'
			});
			
			// 获取当前用户信息，确保其他字段不会丢失
			getUserInfo().then(userRes => {
				if (userRes.status === 200 || userRes.code === 200) {
					const userInfo = userRes.data;
					
					// 构建完整的用户数据，只更新昵称
					const userData = {
						nickname: this.nickname,
						// 保留其他关键信息
						avatar: userInfo.avatar || '',
						sex: typeof userInfo.sex !== 'undefined' ? userInfo.sex : 0,
						birthday: userInfo.birthday || 0
					};
					
					// 提交修改 - 继续使用userEdit接口，因为昵称不在API文档的性别和生日接口中
					userEdit(userData).then(res => {
						uni.hideLoading();
						if (res.status === 200 || res.code === 200) {
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
						} else {
							this.$util.Tips({
								title: res.msg || '昵称修改失败'
							});
						}
					}).catch(err => {
						uni.hideLoading();
						this.$util.Tips({
							title: err || '昵称修改失败'
						});
					});
				} else {
					uni.hideLoading();
					this.$util.Tips({
						title: userRes.msg || '获取用户信息失败'
					});
				}
			}).catch(err => {
				uni.hideLoading();
				this.$util.Tips({
					title: err || '获取用户信息失败'
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