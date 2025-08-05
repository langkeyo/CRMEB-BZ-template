<template>
	<view class="debug-page">
		<view class="header">
			<text class="title">登录状态调试</text>
		</view>
		
		<view class="content">
			<view class="section">
				<text class="section-title">Store状态</text>
				<view class="info-item">
					<text class="label">Token:</text>
					<text class="value">{{ storeToken || '无' }}</text>
				</view>
				<view class="info-item">
					<text class="label">UID:</text>
					<text class="value">{{ storeUid || '无' }}</text>
				</view>
				<view class="info-item">
					<text class="label">用户信息:</text>
					<text class="value">{{ storeUserInfo ? '存在' : '无' }}</text>
				</view>
			</view>
			
			<view class="section">
				<text class="section-title">缓存状态</text>
				<view class="info-item">
					<text class="label">Token缓存:</text>
					<text class="value">{{ cacheToken || '无' }}</text>
				</view>
				<view class="info-item">
					<text class="label">UID缓存:</text>
					<text class="value">{{ cacheUid || '无' }}</text>
				</view>
				<view class="info-item">
					<text class="label">用户信息缓存:</text>
					<text class="value">{{ cacheUserInfo ? '存在' : '无' }}</text>
				</view>
			</view>
			
			<view class="section">
				<text class="section-title">登录检查结果</text>
				<view class="info-item">
					<text class="label">登录状态:</text>
					<text class="value" :class="loginStatus ? 'success' : 'error'">
						{{ loginStatus ? '已登录' : '未登录' }}
					</text>
				</view>
			</view>
			
			<view class="section">
				<text class="section-title">操作</text>
				<button @click="refreshStatus" class="btn">刷新状态</button>
				<button @click="testChat" class="btn">测试聊天</button>
				<button @click="goLogin" class="btn">去登录</button>
			</view>
			
			<view class="section">
				<text class="section-title">详细信息</text>
				<view class="detail-box">
					<text class="detail-text">{{ detailInfo }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { checkLoginStatus, getUserInfo, getUserToken, getUserUid } from '@/utils/loginCheck.js'
import { LOGIN_STATUS, UID, USER_INFO } from '@/config/cache.js'
import { mapGetters } from 'vuex'

export default {
	computed: {
		...mapGetters(['token', 'uid', 'userInfo']),
		storeToken() {
			return this.$store.state.app.token
		},
		storeUid() {
			return this.$store.state.app.uid
		},
		storeUserInfo() {
			return this.$store.state.app.userInfo
		}
	},
	data() {
		return {
			cacheToken: '',
			cacheUid: '',
			cacheUserInfo: null,
			loginStatus: false,
			detailInfo: ''
		}
	},
	onLoad() {
		this.refreshStatus()
	},
	methods: {
		refreshStatus() {
			// 获取缓存信息
			this.cacheToken = getUserToken()
			this.cacheUid = getUserUid()
			this.cacheUserInfo = getUserInfo()

			// 检查登录状态
			this.loginStatus = checkLoginStatus()

			// 生成详细信息
			this.generateDetailInfo()
		},
		
		generateDetailInfo() {
			const info = {
				'Store Token': this.storeToken || 'null',
				'Store UID': this.storeUid || 'null',
				'Store UserInfo': this.storeUserInfo ? JSON.stringify(this.storeUserInfo) : 'null',
				'Cache Token': this.cacheToken || 'null',
				'Cache UID': this.cacheUid || 'null',
				'Cache UserInfo': this.cacheUserInfo ? JSON.stringify(this.cacheUserInfo) : 'null',
				'Login Status': this.loginStatus ? 'true' : 'false',
				'Timestamp': new Date().toLocaleString()
			}
			
			this.detailInfo = Object.entries(info)
				.map(([key, value]) => `${key}: ${value}`)
				.join('\n\n')
		},
		
		testChat() {
			if (this.loginStatus) {
				uni.navigateTo({
					url: '/pages/users/online_chat/index'
				})
			} else {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				})
			}
		},
		
		goLogin() {
			uni.navigateTo({
				url: '/pages/users/login/index'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.debug-page {
	padding: 20rpx;
	background-color: #f5f5f5;
	min-height: 100vh;
}

.header {
	background-color: #fff;
	padding: 30rpx;
	border-radius: 10rpx;
	margin-bottom: 20rpx;
	
	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}
}

.content {
	.section {
		background-color: #fff;
		padding: 30rpx;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
		
		.section-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 20rpx;
			display: block;
		}
		
		.info-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 15rpx 0;
			border-bottom: 1rpx solid #eee;
			
			&:last-child {
				border-bottom: none;
			}
			
			.label {
				font-size: 28rpx;
				color: #666;
			}
			
			.value {
				font-size: 28rpx;
				color: #333;
				max-width: 400rpx;
				text-align: right;
				word-break: break-all;
				
				&.success {
					color: #52c41a;
				}
				
				&.error {
					color: #ff4d4f;
				}
			}
		}
		
		.btn {
			background-color: #1890ff;
			color: #fff;
			border: none;
			border-radius: 8rpx;
			padding: 20rpx 40rpx;
			font-size: 28rpx;
			margin: 10rpx;
			
			&:active {
				background-color: #096dd9;
			}
		}
		
		.detail-box {
			background-color: #f8f8f8;
			padding: 20rpx;
			border-radius: 8rpx;
			
			.detail-text {
				font-size: 24rpx;
				color: #666;
				line-height: 1.5;
				word-break: break-all;
			}
		}
	}
}
</style>
