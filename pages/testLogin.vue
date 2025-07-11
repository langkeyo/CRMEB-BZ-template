<template>
	<view class="login-mock">
		<view class="title-bar">
			<text class="back-btn" @click="goBack">返回</text>
			<view class="title">模拟登录工具</view>
			<text class="home-btn" @click="goHome">首页</text>
		</view>
		<view class="description">用于静态开发阶段，自动填充登录信息</view>
		
		<view class="form-item">
			<text class="label">用户ID：</text>
			<input type="number" v-model="userInfo.uid" class="input" placeholder="输入用户ID"/>
		</view>
		
		<view class="form-item">
			<text class="label">用户名：</text>
			<input type="text" v-model="userInfo.nickname" class="input" placeholder="输入用户名"/>
		</view>
		
		<view class="form-item">
			<text class="label">手机号：</text>
			<input type="text" v-model="userInfo.phone" class="input" placeholder="输入手机号"/>
		</view>
		
		<view class="form-item">
			<text class="label">头像：</text>
			<input type="text" v-model="userInfo.avatar" class="input" placeholder="输入头像URL"/>
		</view>
		
		<view class="form-item">
			<text class="label">Token：</text>
			<input type="text" v-model="tokenValue" class="input" placeholder="输入Token"/>
		</view>
		
		<view class="buttons">
			<button @click="mockLogin" class="login-btn">模拟登录</button>
			<button @click="mockLogout" class="logout-btn">模拟登出</button>
		</view>
		
		<view class="status">
			<text>当前状态: {{ isLogin ? '已登录' : '未登录' }}</text>
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import Cache from '@/utils/cache';
import { LOGIN_STATUS, USER_INFO, EXPIRES_TIME, UID } from '@/config/cache';

export default {
	data() {
		return {
			userInfo: {
				uid: 10001,
				avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJia6ibjvqgVkLyXgUPpx9icbYDoZfTianqibKazChUAG6Qic9JoJGnkDQ8QjZQJdVXDyKzWXkmPKTVeDFw/132',
				nickname: '测试用户',
				phone: '13800138000',
				level: 1,
				integral: 500,
				now_money: 1000.00,
				is_promoter: 1,
				spread_uid: 0,
				spread_time: 0,
				spread_count: 0,
				sex: 1,
				birthday: '2000-01-01',
				addres: '北京市海淀区',
				add_time: Math.floor(Date.now() / 1000),
				status: 1
			},
			tokenValue: 'mock_token_' + Math.random().toString(36).substr(2),
			isLogin: false
		}
	},
	computed: {
		...mapGetters(['token'])
	},
	onLoad() {
		// 检查是否已登录
		this.checkLoginStatus();
	},
	methods: {
		// 检查登录状态
		checkLoginStatus() {
			const token = Cache.get(LOGIN_STATUS);
			if (token) {
				this.isLogin = true;
				// 更新UI显示的用户信息
				const userInfo = Cache.get(USER_INFO, true);
				if (userInfo) {
					this.userInfo = userInfo;
				}
				// 不要直接给计算属性赋值，应通过Vuex状态管理
				// this.token = token; // 这行代码导致了警告
				this.tokenValue = token; // 更新本地token值
			} else {
				this.isLogin = false;
			}
		},
		
		// 返回上一页
		goBack() {
			uni.navigateBack();
		},
		
		// 返回首页
		goHome() {
			uni.switchTab({
				url: '/pages/index/index'
			});
		},
		
		// 模拟登录
		mockLogin() {
			// 设置过期时间为30天后
			const expiresTime = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
			
			// 保存Token
			Cache.set(LOGIN_STATUS, this.tokenValue);
			
			// 保存用户ID
			Cache.set(UID, this.userInfo.uid);
			
			// 保存过期时间
			Cache.set(EXPIRES_TIME, expiresTime);
			
			// 保存用户信息
			Cache.set(USER_INFO, this.userInfo);
			
			// 更新Vuex状态
			this.$store.commit('LOGIN', {token: this.tokenValue, time: expiresTime});
			this.$store.commit('UPDATE_USERINFO', this.userInfo);
			
			// 更新状态
			this.isLogin = true;
			
			uni.showToast({
				title: '模拟登录成功',
				icon: 'success',
				duration: 2000
			});
		},
		
		// 模拟登出
		mockLogout() {
			// 清除缓存
			Cache.clear(LOGIN_STATUS);
			Cache.clear(UID);
			Cache.clear(EXPIRES_TIME);
			Cache.clear(USER_INFO);
			
			// 更新Vuex状态
			this.$store.commit('LOGOUT');
			
			// 更新状态
			this.isLogin = false;
			
			uni.showToast({
				title: '已退出登录',
				icon: 'none',
				duration: 2000
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.login-mock {
	padding: 20px;
	background-color: #fff;
	
	.title-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 15px;
		
		.back-btn, .home-btn {
			font-size: 16px;
			padding: 5px 10px;
			color: #FF7E00;
		}
		
		.title {
			font-size: 20px;
			font-weight: bold;
			text-align: center;
		}
	}
	
	.description {
		font-size: 14px;
		color: #666;
		margin-bottom: 20px;
		text-align: center;
	}
	
	.form-item {
		display: flex;
		margin-bottom: 15px;
		align-items: center;
		
		.label {
			width: 80px;
			flex-shrink: 0;
			font-size: 14px;
		}
		
		.input {
			flex: 1;
			height: 40px;
			border: 1px solid #eee;
			border-radius: 4px;
			padding: 0 10px;
			font-size: 14px;
		}
	}
	
	.buttons {
		display: flex;
		justify-content: space-between;
		margin-top: 20px;
		
		button {
			width: 45%;
			height: 40px;
			line-height: 40px;
			text-align: center;
			border-radius: 20px;
			font-size: 14px;
			
			&.login-btn {
				background: linear-gradient(to right, #FF7E00, #FDA44D);
				color: #fff;
			}
			
			&.logout-btn {
				background-color: #f5f5f5;
				color: #333;
			}
		}
	}
	
	.status {
		margin-top: 20px;
		text-align: center;
		font-size: 14px;
		color: #666;
	}
}
</style>
