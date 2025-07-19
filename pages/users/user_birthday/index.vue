<template>
	<view class="birthday-page" :style="colorStyle">
		<!-- 头部导航栏 -->
		<view class="header">
			<view class="back-btn" @click="navigateBack">
				<image src="/static/icons/back-arrow.svg" class="back-icon" />
			</view>
			<view class="page-title">生日</view>
		</view>
		
		<!-- 日期选择器 -->
		<view class="date-picker">
			<!-- picker-title 移除 -->
			
			<!-- 选择器 -->
			<view class="picker-container">
				<!-- 月份选择 -->
				<scroll-view 
					class="picker-column"
					scroll-y 
					:scroll-top="monthScrollTop"
					@scroll="onMonthScroll"
					@touchstart="touchstart" 
					@touchend="touchend('month')"
				>
					<view class="column-item-placeholder"></view>
					<view 
						class="column-item" 
						:class="{ active: currentMonth === index + 1 }"
						v-for="(month, index) in 12" 
						:key="'m' + index"
						:id="'month-' + (index + 1)"
					>
						{{ formatNumber(index + 1) }}月
					</view>
					<view class="column-item-placeholder"></view>
				</scroll-view>
				
				<!-- 日期选择 -->
				<scroll-view 
					class="picker-column"
					scroll-y 
					:scroll-top="dayScrollTop"
					@scroll="onDayScroll"
					@touchstart="touchstart" 
					@touchend="touchend('day')"
				>
					<view class="column-item-placeholder"></view>
					<view 
						class="column-item" 
						:class="{ active: currentDay === index + 1 }"
						v-for="(day, index) in daysInMonth" 
						:key="'d' + index"
						:id="'day-' + (index + 1)"
					>
						{{ formatNumber(index + 1) }}日
					</view>
					<view class="column-item-placeholder"></view>
				</scroll-view>
			</view>
			
			<!-- 按钮区域 -->
			<view class="button-area">
				<view class="cancel-btn" @click="navigateBack">取消</view>
				<view class="confirm-btn" @click="confirmDate">确定</view>
			</view>
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
			currentMonth: 1, // 当前选择的月份
			currentDay: 1, // 当前选择的日期
			monthScrollTop: 0,
			dayScrollTop: 0,
			startY: 0,
			itemHeight: 100,
			userInfo: {}
		};
	},
	computed: {
		// 计算当前月份的天数
		daysInMonth() {
			const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			return days[this.currentMonth - 1];
		},
		
		// 格式化生日字符串
		birthdayStr() {
			return `${this.formatNumber(this.currentMonth)}-${this.formatNumber(this.currentDay)}`;
		}
	},
	onLoad() {
		this.getUserInfo();
	},
	methods: {
		// 获取用户信息
		getUserInfo() {
			getUserInfo().then(res => {
				this.userInfo = res.data;
				
				// 如果已有生日，解析并设置
				if (this.userInfo.birthday) {
					const [month, day] = this.userInfo.birthday.split('-').map(Number);
					if (month && day) {
						this.currentMonth = month;
						this.currentDay = day;
						this.monthScrollTop = (this.currentMonth - 1) * this.itemHeight;
						this.dayScrollTop = (this.currentDay - 1) * this.itemHeight;
					}
				}
			}).catch(err => {
				this.$util.Tips({
					title: err || '获取用户信息失败'
				});
			});
		},
		
		// 数字格式化，补零
		formatNumber(n) {
			return n < 10 ? '0' + n : n;
		},
		
		// 月份滚动事件
		onMonthScroll(e) {
			const scrollTop = e.detail.scrollTop;
			const index = Math.round(scrollTop / this.itemHeight) + 1;
			if (index >= 1 && index <= 12) {
				this.currentMonth = index;
				
				// 如果日期超出当前月的最大天数，调整日期
				if (this.currentDay > this.daysInMonth) {
					this.currentDay = this.daysInMonth;
					this.dayScrollTop = (this.currentDay - 1) * this.itemHeight;
				}
			}
		},
		
		// 日期滚动事件
		onDayScroll(e) {
			const scrollTop = e.detail.scrollTop;
			const index = Math.round(scrollTop / this.itemHeight) + 1;
			if (index >= 1 && index <= this.daysInMonth) {
				this.currentDay = index;
			}
		},
		
		// 触摸开始
		touchstart(e) {
			this.startY = e.touches[0].pageY;
		},
		
		// 触摸结束
		touchend(type) {
			if (type === 'month') {
				this.monthScrollTop = (this.currentMonth - 1) * this.itemHeight;
			} else {
				this.dayScrollTop = (this.currentDay - 1) * this.itemHeight;
			}
		},
		
		// 确认日期
		confirmDate() {
			// 提交修改
			userEdit({
				birthday: this.birthdayStr
			}).then(res => {
				this.$util.Tips({
					title: '生日设置成功',
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
					title: err || '生日设置失败'
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
.birthday-page {
	background-color: #f5f5f5;
	min-height: 100vh;
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
}

.date-picker {
	background-color: #fff;
	margin-top: 20rpx;
	
	.picker-title {
		font-size: 32rpx;
		text-align: center;
		padding: 30rpx 0;
	}
	
	.picker-container {
		display: flex;
		justify-content: center;
		height: 300rpx;
		position: relative;
		
		&::before, &::after {
			content: '';
			position: absolute;
			left: 0;
			right: 0;
			height: 100rpx;
			z-index: 1;
			pointer-events: none;
		}
		
		&::before {
			top: 0;
			background: linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);
		}
		
		&::after {
			bottom: 0;
			background: linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);
		}
		
		.picker-column {
			flex: 1;
			height: 100%;
			position: relative;
			
			&::after {
				content: '';
				position: absolute;
				left: 20%;
				right: 20%;
				top: 100rpx;
				height: 100rpx;
				border-top: 1rpx solid #f0f0f0;
				border-bottom: 1rpx solid #f0f0f0;
				z-index: 2;
				pointer-events: none;
			}
		}
		
		.column-item, .column-item-placeholder {
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
			font-size: 32rpx;
			color: #999;
		}
		
		.column-item.active {
			color: #333;
			font-weight: bold;
		}
	}
	
	.button-area {
		display: flex;
		border-top: 1rpx solid #f0f0f0;
		margin-top: 30rpx;
		
		.cancel-btn, .confirm-btn {
			flex: 1;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
			font-size: 32rpx;
		}
		
		.cancel-btn {
			color: #333;
			background-color: #f5f5f5;
		}
		
		.confirm-btn {
			color: #ff9500;
		}
	}
}
</style> 