<template>
	<view class="ask-question-container">
		<!-- 状态栏 -->
		<view class="status-bar" :style="'height:' + statusBarHeight + 'px'"></view>
		
		<!-- 导航栏 -->
		<view class="navbar">
			<view class="back-btn" @tap="goBack">
				<image src="/static/common/icons/navigation/back_arrow.svg" class="back-icon"></image>
			</view>
			<view class="page-title">提问</view>
		</view>
		
		<!-- 提问内容区域 -->
		<view class="question-content">
			<!-- 商品信息 -->
			<view class="goods-info" v-if="goodsInfo.id">
				<image class="goods-image" :src="goodsInfo.image" mode="aspectFill"></image>
				<view class="goods-detail">
					<text class="goods-title">{{ goodsInfo.title }}</text>
					<text class="goods-price">¥{{ goodsInfo.price }}</text>
				</view>
			</view>
			
			<!-- 问题输入框 -->
			<view class="question-input-area">
				<textarea
					class="question-input"
					v-model="questionContent"
					placeholder="请输入您的问题，如：这个商品保质期多久？"
					maxlength="200"
					auto-height
				></textarea>
				<text class="word-count">{{ questionContent.length }}/200</text>
			</view>
			
			<!-- 提示文本 -->
			<view class="tips-area">
				<text class="tips-text">提示：您的问题将会公开显示，请勿包含个人信息和敏感内容</text>
			</view>
		</view>
		
		<!-- 底部提交按钮 -->
		<view class="submit-area">
			<view class="submit-btn" :class="{'submit-btn-disabled': !questionContent.trim()}" @tap="submitQuestion">
				<text class="submit-text">提交问题</text>
			</view>
		</view>
	</view>
</template>

<script>
import { getGoodsDetail, createGoodsQA } from '@/api/group.js';

export default {
	data() {
		return {
			statusBarHeight: 20,
			goodsId: null,
			goodsInfo: {
				id: 0,
				title: '',
				price: '0.00',
				image: ''
			},
			questionContent: ''
		}
	},
	onLoad(options) {
		// 获取状态栏高度
		this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
		
		// 获取商品ID
		if (options.goodsId) {
			this.goodsId = options.goodsId;
			this.loadGoodsInfo();
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
		
		// 加载商品信息
		async loadGoodsInfo() {
			try {
				const response = await getGoodsDetail(this.goodsId);
				
				if (response.status === 200 && response.data) {
					const data = response.data;
					this.goodsInfo = {
						id: data.id,
						title: data.title || data.name,
						price: data.min_price || '0.00',
						image: this.setDomain(data.image)
					};
				} else {
					uni.showToast({
						title: response.msg || '加载商品信息失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('加载商品信息失败:', error);
				uni.showToast({
					title: '加载商品信息失败',
					icon: 'none'
				});
			}
		},
		
		// 处理图片URL
		setDomain(url) {
			if (!url) return '';
			url = url.toString();
			
			// 如果已经是完整URL，直接返回
			if (url.indexOf('http') === 0) {
				return url;
			}
			
			// 如果是相对路径，拼接域名
			const HTTP_REQUEST_URL = uni.getStorageSync('HTTP_REQUEST_URL') || '';
			if (url.indexOf('/') === 0) {
				return HTTP_REQUEST_URL + url;
			}
			
			// 其他情况拼接域名
			return HTTP_REQUEST_URL + '/' + url;
		},
		
		// 提交问题
		async submitQuestion() {
			if (!this.questionContent.trim()) {
				uni.showToast({
					title: '请输入问题内容',
					icon: 'none'
				});
				return;
			}
			
			try {
				const data = {
					goods_id: this.goodsId,
					qid: "0", // 提问时qid为0
					content: this.questionContent
				};
				
				const response = await createGoodsQA(data);
				
				if (response.status === 200) {
					uni.showToast({
						title: '提问成功',
						icon: 'success'
					});
					
					// 延迟返回上一页
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
				} else {
					uni.showToast({
						title: response.msg || '提问失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('提交问题失败:', error);
				uni.showToast({
					title: '提问失败',
					icon: 'none'
				});
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.ask-question-container {
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

/* 提问内容区域 */
.question-content {
	flex: 1;
	padding: 16px;
}

/* 商品信息 */
.goods-info {
	display: flex;
	padding: 16px;
	background-color: #FFFFFF;
	border-radius: 8px;
	margin-bottom: 16px;
}

.goods-image {
	width: 80px;
	height: 80px;
	border-radius: 4px;
	margin-right: 12px;
}

.goods-detail {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.goods-title {
	font-size: 14px;
	color: #333333;
	line-height: 1.4;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}

.goods-price {
	font-size: 16px;
	color: #FF840B;
	font-weight: 500;
}

/* 问题输入框 */
.question-input-area {
	padding: 16px;
	background-color: #FFFFFF;
	border-radius: 8px;
	margin-bottom: 16px;
	position: relative;
}

.question-input {
	width: 100%;
	min-height: 120px;
	font-size: 14px;
	color: #333333;
	line-height: 1.5;
}

.word-count {
	position: absolute;
	right: 16px;
	bottom: 16px;
	font-size: 12px;
	color: #999999;
}

/* 提示文本 */
.tips-area {
	padding: 0 16px;
}

.tips-text {
	font-size: 12px;
	color: #999999;
	line-height: 1.4;
}

/* 底部提交按钮 */
.submit-area {
	padding: 16px;
	background-color: #FFFFFF;
}

.submit-btn {
	height: 44px;
	background-color: #FF840B;
	border-radius: 22px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.submit-btn-disabled {
	background-color: #CCCCCC;
}

.submit-text {
	font-size: 16px;
	color: #FFFFFF;
	font-weight: 500;
}
</style> 