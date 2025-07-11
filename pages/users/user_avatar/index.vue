<template>
	<view class="avatar-page" :style="colorStyle">
		<!-- 头部导航栏 -->
		<view class="header">
			<view class="back-icon" @click="navigateBack">
				<text class="iconfont icon-left"></text>
			</view>
			<view class="page-title">头像设置</view>
			<view class="more-icon">
				<text class="iconfont icon-more-dot"></text>
			</view>
		</view>
		
		<!-- 头像预览 -->
		<view class="avatar-preview">
			<image :src="userInfo.avatar" mode="aspectFill"></image>
		</view>
		
		<!-- 操作按钮 -->
		<view class="action-buttons">
			<view class="action-btn" @click="takePhoto">拍照</view>
			<view class="action-btn" @click="chooseFromAlbum">从相册里选择</view>
			<view class="action-btn cancel" @click="navigateBack">取消</view>
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
			userInfo: {}
		};
	},
	onLoad() {
		this.getUserInfo();
	},
	methods: {
		// 获取用户信息
		getUserInfo() {
			getUserInfo().then(res => {
				this.userInfo = res.data;
			}).catch(err => {
				this.$util.Tips({
					title: err || '获取用户信息失败'
				});
			});
		},
		
		// 拍照
		takePhoto() {
			// #ifdef APP-PLUS || MP
			uni.chooseImage({
				count: 1,
				sourceType: ['camera'],
				success: (res) => {
					this.uploadAvatar(res.tempFilePaths[0]);
				}
			});
			// #endif
			
			// #ifdef H5
			uni.chooseImage({
				count: 1,
				sourceType: ['camera'],
				success: (res) => {
					this.uploadAvatar(res.tempFilePaths[0]);
				},
				fail: () => {
					this.$util.Tips({
						title: '请允许使用摄像头权限'
					});
				}
			});
			// #endif
		},
		
		// 从相册选择
		chooseFromAlbum() {
			uni.chooseImage({
				count: 1,
				sourceType: ['album'],
				success: (res) => {
					this.uploadAvatar(res.tempFilePaths[0]);
				}
			});
		},
		
		// 上传头像
		uploadAvatar(filePath) {
			uni.showLoading({
				title: '上传中...'
			});
			
			// 模拟上传过程
			setTimeout(() => {
				// 更新头像
				userEdit({
					avatar: filePath
				}).then(res => {
					uni.hideLoading();
					this.$util.Tips({
						title: '头像更新成功',
						icon: 'success'
					});
					
					// 更新用户信息
					this.getUserInfo();
					
					// 通知父页面刷新
					uni.$emit('updateUserInfo');
					
					// 延迟返回
					setTimeout(() => {
						this.navigateBack();
					}, 1500);
				}).catch(err => {
					uni.hideLoading();
					this.$util.Tips({
						title: err || '头像上传失败'
					});
				});
			}, 1000);
		},
		
		// 返回上一页
		navigateBack() {
			uni.navigateBack();
		}
	}
};
</script>

<style lang="scss" scoped>
.avatar-page {
	background-color: #000;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

.header {
	position: relative;
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	
	.back-icon {
		position: absolute;
		left: 30rpx;
		font-size: 36rpx;
	}
	
	.page-title {
		font-size: 36rpx;
		font-weight: 500;
	}
	
	.more-icon {
		position: absolute;
		right: 30rpx;
		font-size: 36rpx;
	}
}

.avatar-preview {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 40rpx;
	
	image {
		width: 100%;
		max-height: 800rpx;
		border-radius: 8rpx;
	}
}

.action-buttons {
	padding-bottom: env(safe-area-inset-bottom);
	
	.action-btn {
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		color: #fff;
		font-size: 32rpx;
		border-top: 1rpx solid rgba(255, 255, 255, 0.1);
		
		&.cancel {
			margin-top: 16rpx;
			border-top: none;
		}
	}
}
</style> 