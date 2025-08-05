<template>
	<view class="qa-detail-container">
		<!-- 状态栏 -->
		<view class="status-bar" :style="'height:' + statusBarHeight + 'px'"></view>
		
		<!-- 导航栏 -->
		<view class="navbar">
			<view class="back-btn" @tap="goBack">
				<image src="/static/common/icons/navigation/back_arrow.svg" class="back-icon"></image>
			</view>
			<view class="page-title">问答详情</view>
		</view>
		
		<!-- 问题详情 -->
		<scroll-view class="qa-content" scroll-y @scrolltolower="loadMore">
			<!-- 问题区域 -->
			<view class="question-section">
				<view class="qa-user">
					<image class="user-avatar" :src="questionDetail.avatar || '/static/images/avatar.png'"></image>
					<text class="user-name">{{ questionDetail.nickname || '匿名用户' }}</text>
					<text class="qa-time">{{ questionDetail.create_time }}</text>
				</view>
				<view class="question-content">
					<text class="question-text">{{ questionDetail.content }}</text>
				</view>
			</view>
			
			<!-- 回答数量标题 -->
			<view class="answer-title">
				<text class="title-text">{{ answerList.length }}个回答</text>
			</view>
			
			<!-- 回答列表 -->
			<view class="answer-list">
				<view class="answer-item" v-for="(item, index) in answerList" :key="index">
					<view class="qa-user">
						<image class="user-avatar" :src="item.avatar || '/static/images/avatar.png'"></image>
						<text class="user-name">{{ item.nickname || '匿名用户' }}</text>
						<text class="qa-time">{{ item.create_time }}</text>
					</view>
					<view class="answer-content">
						<text class="answer-text">{{ item.content }}</text>
					</view>
				</view>
			</view>
			
			<!-- 加载状态 -->
			<view class="loading-more" v-if="isLoading">
				<text class="loading-text">加载中...</text>
			</view>
			
			<!-- 无回答状态 -->
			<view class="empty-state" v-if="answerList.length === 0 && !isLoading">
				<text class="empty-text">暂无回答，快来回答吧~</text>
			</view>
		</scroll-view>
		
		<!-- 底部回答区域 -->
		<view class="answer-input-area">
			<input class="answer-input" 
				type="text" 
				v-model="answerContent" 
				placeholder="写下你的回答..." 
				confirm-type="send"
				@confirm="submitAnswer" />
			<view class="submit-btn" @tap="submitAnswer">
				<text class="submit-text">回答</text>
			</view>
		</view>
	</view>
</template>

<script>
import { getGoodsAnswerList, createGoodsQA } from '@/api/group.js';

export default {
	data() {
		return {
			statusBarHeight: 20,
			questionId: null,
			questionDetail: {
				id: 0,
				content: '',
				nickname: '',
				avatar: '',
				create_time: ''
			},
			answerList: [],
			answerContent: '',
			page: 1,
			limit: 10,
			isLoading: false,
			hasMore: true
		}
	},
	onLoad(options) {
		// 获取状态栏高度
		this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
		
		// 获取问题ID
		if (options.questionId) {
			this.questionId = options.questionId;
			this.loadQuestionDetail();
			this.loadAnswers();
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
		
		// 加载问题详情
		async loadQuestionDetail() {
			try {
				const response = await getGoodsAnswerList(this.questionId, {
					page: 1,
					limit: 1,
					getQuestion: true // 假设API支持获取问题详情
				});
				
				if (response.status === 200 && response.data && response.data.question) {
					this.questionDetail = response.data.question;
				}
			} catch (error) {
				console.error('加载问题详情失败:', error);
				uni.showToast({
					title: '加载问题详情失败',
					icon: 'none'
				});
			}
		},
		
		// 加载回答列表
		async loadAnswers() {
			if (this.isLoading || !this.hasMore) return;
			
			this.isLoading = true;
			try {
				const response = await getGoodsAnswerList(this.questionId, {
					page: this.page,
					limit: this.limit
				});
				
				if (response.status === 200 && response.data) {
					const newAnswers = response.data.list || [];
					
					// 追加数据
					this.answerList = [...this.answerList, ...newAnswers];
					
					// 判断是否还有更多数据
					this.hasMore = newAnswers.length === this.limit;
					
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
				console.error('加载回答列表失败:', error);
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
			this.loadAnswers();
		},
		
		// 提交回答
		async submitAnswer() {
			if (!this.answerContent.trim()) {
				uni.showToast({
					title: '请输入回答内容',
					icon: 'none'
				});
				return;
			}
			
			try {
				const data = {
					goods_id: this.questionDetail.goods_id,
					qid: this.questionId,
					content: this.answerContent
				};
				
				const response = await createGoodsQA(data);
				
				if (response.status === 200) {
					uni.showToast({
						title: '回答成功',
						icon: 'success'
					});
					
					// 清空输入框
					this.answerContent = '';
					
					// 重新加载回答列表
					this.page = 1;
					this.answerList = [];
					this.hasMore = true;
					this.loadAnswers();
				} else {
					uni.showToast({
						title: response.msg || '回答失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('提交回答失败:', error);
				uni.showToast({
					title: '回答失败',
					icon: 'none'
				});
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.qa-detail-container {
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

/* 问题内容区域 */
.qa-content {
	flex: 1;
	padding: 16px;
}

.question-section {
	padding: 16px;
	background-color: #FFFFFF;
	border-radius: 8px;
	margin-bottom: 16px;
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

.question-content {
	padding-bottom: 8px;
}

.question-text {
	font-size: 16px;
	color: #333333;
	line-height: 1.5;
	font-weight: 500;
}

/* 回答标题 */
.answer-title {
	padding: 16px 0 8px 0;
}

.title-text {
	font-size: 14px;
	color: #666666;
	font-weight: 500;
}

/* 回答列表 */
.answer-list {
	margin-bottom: 16px;
}

.answer-item {
	padding: 16px;
	background-color: #FFFFFF;
	border-radius: 8px;
	margin-bottom: 16px;
}

.answer-content {
	padding-bottom: 8px;
}

.answer-text {
	font-size: 14px;
	color: #333333;
	line-height: 1.5;
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
	padding: 40px 0;
}

.empty-text {
	font-size: 14px;
	color: #999999;
}

/* 底部回答区域 */
.answer-input-area {
	height: 56px;
	background-color: #FFFFFF;
	border-top: 1px solid #EEEEEE;
	display: flex;
	align-items: center;
	padding: 0 16px;
}

.answer-input {
	flex: 1;
	height: 36px;
	background-color: #F5F5F5;
	border-radius: 18px;
	padding: 0 16px;
	font-size: 14px;
	color: #333333;
}

.submit-btn {
	width: 60px;
	height: 36px;
	background-color: #FF840B;
	border-radius: 18px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: 12px;
}

.submit-text {
	font-size: 14px;
	color: #FFFFFF;
}
</style> 