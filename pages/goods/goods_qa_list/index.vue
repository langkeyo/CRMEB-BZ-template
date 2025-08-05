<template>
	<view class="qa-list-container">
		<!-- 状态栏 -->
		<view class="status-bar" :style="'height:' + statusBarHeight + 'px'"></view>
		
		<!-- 导航栏 -->
		<view class="navbar">
			<view class="back-btn" @tap="goBack">
				<image src="/static/common/icons/navigation/back_arrow.svg" class="back-icon"></image>
			</view>
			<view class="page-title">问大家</view>
		</view>
		
		<!-- 问题列表 -->
		<scroll-view class="qa-list" scroll-y @scrolltolower="loadMore">
			<!-- 问题项 -->
			<view class="qa-item" v-for="(item, index) in questionList" :key="index" @tap="viewDetail(item)">
				<view class="qa-user">
					<image class="user-avatar" :src="item.avatar || '/static/images/avatar.png'"></image>
					<text class="user-name">{{ item.nickname || '匿名用户' }}</text>
					<text class="qa-time">{{ item.create_time }}</text>
				</view>
				<view class="qa-content">
					<text class="qa-question">{{ item.content }}</text>
				</view>
				<view class="qa-footer">
					<text class="answer-count">{{ item.answer_count }}个回答</text>
				</view>
			</view>
			
			<!-- 加载状态 -->
			<view class="loading-more" v-if="isLoading">
				<text class="loading-text">加载中...</text>
			</view>
			
			<!-- 无数据状态 -->
			<view class="empty-state" v-if="questionList.length === 0 && !isLoading">
				<image class="empty-image" src="/static/images/no-orders.png" mode="aspectFit"></image>
				<text class="empty-text">暂无问答内容</text>
			</view>
		</scroll-view>
		
		<!-- 底部提问按钮 -->
		<view class="ask-button" @tap="askQuestion">
			<text class="ask-text">我要提问</text>
		</view>
	</view>
</template>

<script>
import { getGoodsQuestionList } from '@/api/group.js';

export default {
	data() {
		return {
			statusBarHeight: 20,
			goodsId: null,
			questionList: [],
			page: 1,
			limit: 10,
			isLoading: false,
			hasMore: true
		}
	},
	onLoad(options) {
		// 获取状态栏高度
		this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
		
		// 获取商品ID
		if (options.goodsId) {
			this.goodsId = options.goodsId;
			this.loadQuestions();
		} else {
			uni.showToast({
				title: '参数错误',
				icon: 'none'
			});
			setTimeout(() => {
				uni.navigateBack();
			}, 1500);
		}
	},
	methods: {
		// 返回上一页
		goBack() {
			uni.navigateBack();
		},
		
		// 加载问题列表
		async loadQuestions() {
			if (this.isLoading || !this.hasMore) return;
			
			this.isLoading = true;
			try {
				const response = await getGoodsQuestionList(this.goodsId, {
					page: this.page,
					limit: this.limit
				});
				
				if (response.status === 200 && response.data) {
					const newQuestions = response.data.list || [];
					
					// 追加数据
					this.questionList = [...this.questionList, ...newQuestions];
					
					// 判断是否还有更多数据
					this.hasMore = newQuestions.length === this.limit;
					
					// 页码加1
					if (this.hasMore) {
						this.page++;
					}
				} else {
					uni.showToast({
						title: response.msg || '加载失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('加载问题列表失败:', error);
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				});
			} finally {
				this.isLoading = false;
			}
		},
		
		// 加载更多
		loadMore() {
			this.loadQuestions();
		},
		
		// 查看问题详情
		viewDetail(item) {
			uni.navigateTo({
				url: `/pages/goods/goods_qa_detail/index?questionId=${item.id}`
			});
		},
		
		// 我要提问
		askQuestion() {
			uni.navigateTo({
				url: `/pages/goods/goods_ask_question/index?goodsId=${this.goodsId}`
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.qa-list-container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #F5F5F5;
}

/* 导航栏 */
.navbar {
	position: relative;
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #FFFFFF;
}

.back-btn {
	position: absolute;
	left: 16px;
	width: 24px;
	height: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.back-icon {
	width: 20px;
	height: 20px;
}

.page-title {
	font-size: 16px;
	font-weight: 500;
	color: #333333;
}

/* 问题列表 */
.qa-list {
	flex: 1;
	padding: 16px;
}

.qa-item {
	margin-bottom: 16px;
	padding: 16px;
	background-color: #FFFFFF;
	border-radius: 8px;
}

.qa-user {
	display: flex;
	align-items: center;
	margin-bottom: 12px;
}

.user-avatar {
	width: 32px;
	height: 32px;
	border-radius: 50%;
	margin-right: 8px;
}

.user-name {
	font-size: 14px;
	color: #333333;
	flex: 1;
}

.qa-time {
	font-size: 12px;
	color: #999999;
}

.qa-content {
	margin-bottom: 12px;
}

.qa-question {
	font-size: 14px;
	color: #333333;
	line-height: 1.5;
}

.qa-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.answer-count {
	font-size: 12px;
	color: #FF840B;
}

/* 加载状态 */
.loading-more {
	text-align: center;
	padding: 16px 0;
}

.loading-text {
	font-size: 14px;
	color: #999999;
}

/* 空状态 */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60px 0;
}

.empty-image {
	width: 120px;
	height: 120px;
	margin-bottom: 16px;
}

.empty-text {
	font-size: 14px;
	color: #999999;
}

/* 底部提问按钮 */
.ask-button {
	height: 50px;
	background-color: #FF840B;
	display: flex;
	align-items: center;
	justify-content: center;
}

.ask-text {
	font-size: 16px;
	color: #FFFFFF;
	font-weight: 500;
}
</style> 