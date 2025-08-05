<template>
	<view class="product-con">
		<!-- Banner区域 - 按照Figma设计 -->
		<view class="banner-section">
			<!-- 背景轮播图 -->
			<swiper class="banner-swiper" autoplay="true" interval="3000" duration="500" circular
				@change="swiperChange">
				<swiper-item v-for="(image, index) in goodsInfo.images" :key="index">
					<image :src="image" mode="aspectFill" class="banner-image"></image>
				</swiper-item>
			</swiper>

			<!-- 返回按钮 -->
			<view class="back-icon" @tap="goBack">
				<image src="/static/common/icons/navigation/back_arrow.svg" class="back-icon-img"></image>
			</view>

			<!-- 分享按钮 - 保持现有资源 -->
			<view class="share-button" @tap="shareGoods">
				<image src="/static/images/goods_details/share_icon.svg" class="share-icon-img"></image>
			</view>

			<!-- 图片计数器 -->
			<view class="image-counter">{{ currentIndex + 1 }}/{{ goodsInfo.images.length }}</view>

			<!-- 图片/视频标签 -->
			<view class="media-label">图片/视频</view>
		</view>

		<!-- 商品卡片区域 - 按照Figma设计 -->
		<view class="goods-card-section">
			<!-- 卡片背景 -->
			<view class="card-background"></view>

			<!-- 价格信息 -->
			<view class="price-container">
				<text class="price-text">￥{{ goodsInfo.price }}</text>
				<!-- 客户要求不显示原价 -->
				<!-- <text class="original-price-text" v-if="goodsInfo.original_price && goodsInfo.original_price != goodsInfo.price">￥{{ goodsInfo.original_price }}</text> -->
				<text class="save-price-text" v-if="goodsInfo.save_price && goodsInfo.save_price != '0.00'">省￥{{ goodsInfo.save_price }}</text>
			</view>

			<!-- 销量信息 -->
			<text class="sold-text">已售{{ goodsInfo.sales }}+</text>

			<!-- 商品标题 -->
			<text class="goods-title-text">{{ goodsInfo.title }}</text>

			<!-- 产地信息 -->
			<view class="origin-container">
				<view class="origin-border"></view>
				<text class="origin-text">产地丨{{ goodsInfo.origin }}</text>
			</view>

			<!-- 活动时间信息 -->
			<view class="activity-info" v-if="goodsInfo.time_left_text">
				<text class="activity-status">{{ goodsInfo.status_text || '进行中' }}</text>
				<text class="time-left">剩余{{ goodsInfo.time_left_text }}</text>
			</view>
		</view>

		<!-- 团购用户区域 - 不可购买时显示（分类/热门团购） -->
		<view v-if="!canBuy" class="goods-group-buyers-section">
			<!-- 标题 -->
			<text class="group-buyers-title">共{{ groupBuyersData.length }}人团购了此商品</text>

			<!-- 轮播容器 -->
			<view class="buyers-carousel-container">
				<view class="buyers-carousel" :style="{ transform: `translateY(${carouselOffset}px)` }">
					<!-- 重复用户数据以实现无缝轮播 -->
					<view v-for="(user, index) in extendedBuyersData" :key="index" class="user-item"
						:class="{ 'user-center': index === centerIndex }">
						<image :class="index === centerIndex ? 'user-avatar-large' : 'user-avatar-small'"
							:src="user.avatar"></image>
						<text :class="index === centerIndex ? 'user-name-large' : 'user-name-small'">
							{{ user.name }}
						</text>
						<text :class="index === centerIndex ? 'purchase-status-large' : 'purchase-status-small'">
							{{ user.status }}
						</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 物流信息区域 - 可购买时显示 -->
		<view v-if="canBuy" class="delivery-info-section">
			<!-- 自提点信息 -->
			<view class="pickup-info">
				<text class="pickup-text">自提点：{{ deliveryInfo.pickupLocation }}丨免运费</text>
			</view>

			<!-- 预计送达时间 -->
			<view class="predict-time">
				<view class="time-icon-wrapper">
					<image class="time-icon" src="/static/images/goods_details/time_icon.svg"></image>
					<text class="colon">：</text>
				</view>
				<text class="time-text">{{ deliveryInfo.deliveryTime }}</text>
			</view>

			<!-- 送达地址 -->
			<view class="destination">
				<view class="time-icon-wrapper">
					<image class="location-icon" src="/static/images/goods_details/location_icon.svg"></image>
					<text class="colon">：</text>
				</view>
				<text class="destination-text">送至 {{ deliveryInfo.deliveryAddress }}</text>
			</view>

			<!-- 保障信息 -->
			<view class="guarantee-footer">
				<text class="guarantee-text">保障 品质保证，无忧售后</text>
			</view>
		</view>

		<!-- 评价区域 - 按照Figma设计 -->
		<view class="goods-review-section">
			<!-- 评价头部 -->
			<view class="review-header">
				<!-- 左侧 -->
				<view class="review-left">
					<text class="review-title">评价（{{ commentStats.total > 99 ? '99+' : commentStats.total }}）</text>
					<text class="review-rate" v-if="commentStats.total > 0">好评{{ commentStats.goodRate }}%</text>
				</view>

				<!-- 右侧 -->
				<view class="review-right" @tap="viewAllReviews">
					<text class="view-all-text">全部</text>
					<image class="right-arrow-icon" src="/static/images/goods/right-icon.svg"></image>
				</view>
			</view>

			<!-- 评价卡片 - 动态显示 -->
			<view v-if="commentList.length > 0">
				<view
					v-for="(comment, index) in commentList.slice(0, 2)"
					:key="comment.id"
					:class="index === 0 ? 'review-card1' : 'review-card2'"
				>
					<image
						class="review-avatar"
						:src="comment.avatar || '/static/images/avatar.png'"
					></image>
					<view class="review-content">
						<text class="reviewer-name">{{ comment.nickname || '匿名买家' }}</text>
						<text class="review-text">{{ comment.comment || comment.content }}</text>
					</view>
				</view>
			</view>

			<!-- 无评论提示 -->
			<view v-else-if="!commentLoading" class="no-comments">
				<text class="no-comments-text">暂无评价，快来抢沙发吧~</text>
			</view>

			<!-- 加载中提示 -->
			<view v-else class="loading-comments">
				<text class="loading-text">评论加载中...</text>
			</view>
		</view>

		<!-- 买家秀区域 - 按照Figma设计 -->
		<view class="goods-buyer-show-section">
			<!-- 买家秀图片 -->
			<view class="buyer-show-image-wrapper">
				<image class="buyer-show-image" src="/static/images/goods_details/buyer_show1.png"></image>
			</view>
			<view class="buyer-show-image-wrapper">
				<image class="buyer-show-image" src="/static/images/goods_details/buyer_show2.png"></image>
			</view>
			<view class="buyer-show-image-wrapper">
				<image class="buyer-show-image" src="/static/images/goods_details/buyer_show3.png"></image>
			</view>
			<view class="buyer-show-image-wrapper">
				<image class="buyer-show-image" src="/static/images/goods_details/buyer_show4.png"></image>
			</view>

			<!-- 买家秀标签 -->
			<view class="buyer-show-label">
				<text class="buyer-show-text">买家秀</text>
			</view>
		</view>

		<!-- 问大家区域 - 按照Figma设计 -->
		<view class="goods-qa-section">
			<!-- 头部 -->
			<view class="qa-header">
				<text class="qa-title">问大家（{{ qaQuestions.length }}+）</text>
				<view class="qa-header-right" @click="viewAllQuestions">
					<text class="qa-all-text">全部</text>
					<text class="qa-arrow">></text>
				</view>
			</view>

			<!-- 问题列表 -->
			<view class="qa-questions" v-if="qaQuestions.length > 0">
				<view class="qa-question-item"
					  v-for="question in qaQuestions.slice(0, 2)"
					  :key="question.id"
					  @click="viewQuestionDetail(question)">
					<text class="qa-question-text">{{ question.content }}</text>
					<text class="qa-answer-count">{{ question.answer_count }}个回答</text>
				</view>
			</view>

			<!-- 空状态 -->
			<view class="qa-empty" v-else>
				<text class="empty-text">暂无问答，快来提问吧~</text>
			</view>

			<!-- 提问按钮 -->
			<view class="qa-ask-btn" @click="askQuestion">
				<text class="ask-text">我要提问</text>
			</view>
		</view>

		<!-- 产品介绍区域 - 按照Figma设计 -->
		<view class="goods-intro-section">
			<!-- 标题 -->
			<view class="intro-title">
				<text class="intro-title-text">产品介绍</text>
			</view>

			<!-- 内容 -->
			<view class="intro-content">
				<text class="intro-content-text">{{ goodsInfo.description || '暂无产品介绍' }}</text>
			</view>
		</view>

		<!-- 购买意向区域 - 所有商品都只能看不能买，只收集意向 -->
		<view class="purchase-intent-section" v-if="!canBuy">
			<!-- 不想买按钮 -->
			<view class="no-want-buy-btn" @tap="toggleNoWant">
				<image class="btn-icon" src="/static/images/goods_details/thumbs_down.svg"></image>
				<text class="btn-text">不想买({{ noWantCount }})</text>
			</view>

			<!-- 想买按钮 -->
			<view class="want-buy-btn" @tap="toggleWant">
				<image class="btn-icon" src="/static/images/goods_details/thumbs_up.svg"></image>
				<text class="btn-text">想买({{ wantCount }})</text>
			</view>
		</view>
		<!-- 购物操作区域 - 只在可购买时显示 -->
		<view class="purchase-intent-section" v-if="canBuy">
			<!-- 加入购物车按钮 -->
			<view class="no-want-buy-btn" @tap="addToCart">
				<text class="btn-text">加入购物车</text>
			</view>

			<!-- 立即购买按钮 -->
			<view class="want-buy-btn" @tap="buyNow">
				<text class="btn-text">立即购买</text>
			</view>
		</view>

	</view>
</template>

<script>
import {
	getUserCombinationDetail,
	getGoodsDetail,
	likeGoods,
	getGoodsQuestionList,
	getGoodsAnswerList,
	createGoodsQA,
	getGoodsCommentList,
	getMyCommunityInfo,
	updateGroupCart
} from '@/api/group.js';
import {
	getAddressDefault
} from '@/api/user.js';
import {
	storeListApi
} from '@/api/store.js';
import {
	GroupCartManager
} from '@/api/groupCart.js';
import { handleActionApi } from '@/utils/apiHelper.js';
import { HTTP_REQUEST_URL } from '@/config/app.js';

export default {
	data() {
		return {
			pageType: 'category', // 页面类型：'category'(分类页面进来) 或 'group'(今日开团页面进来)
			canBuy: false, // 是否可以购买，默认false确保安全
			currentIndex: 0,
			// 购买意向计数
			wantCount: 66, // 想买的人数
			noWantCount: 2, // 不想买的人数
			userWantStatus: null, // 用户的选择状态：'want', 'noWant', null
			// 轮播相关数据
			carouselOffset: 0,
			centerIndex: 1, // 中间显示的用户索引
			carouselTimer: null,
			// 团购用户数据
			groupBuyersData: [
				{ name: '开心鸭', avatar: '/static/images/avatar.png', status: '已购买此商品' },
				{ name: '加载中...', avatar: '/static/images/avatar.png', status: '已购买此商品' },
				{ name: 'Raychan', avatar: '/static/images/avatar.png', status: '已购买此商品' },
				{ name: '小明', avatar: '/static/images/avatar.png', status: '已购买此商品' },
				{ name: '小红', avatar: '/static/images/avatar.png', status: '已购买此商品' },
				{ name: '小李', avatar: '/static/images/avatar.png', status: '已购买此商品' }
			],

			// 问答数据
			qaQuestions: [],
			qaLoading: false,
			goodsInfo: {
				id: 1,
				price: '45',
				sales: '200',
				title: '山东青苹果/一盒300g-450g',
				origin: '山东',
				pickupLocation: '北京尚德井小区菜鸟驿站',
				deliveryTime: '16：30前',
				deliveryAddress: '北京尚德井小区菜鸟驿站',
				guarantee: '品质保证，无忧售后',
				evaluationCount: '99',
				goodRate: '99.8%',
				// 轮播图片数组 - 使用同一张图片重复，方便以后对接API
				images: [
					'/static/images/goods_details/banner.png',
					'/static/images/goods_details/banner.png',
					'/static/images/goods_details/banner.png',
					'/static/images/goods_details/banner.png',
					'/static/images/goods_details/banner.png'
				],
				content: `
				<p>【果园直供·脆甜青苹果】新鲜采摘的青苹果来啦！果皮翠绿透亮，果肉脆爽多汁，酸甜比例完美融合，入口先尝到清新酸意，细品回甘绵长，夏日冰镇更添凉爽！每颗苹果坚持自然成熟，富含维生素C和膳食纤维，低热量高营养，无论是直接鲜食、制作果切沙拉、还是榨汁烘焙都风味俱佳！</p>
				<p>✓ 现摘现发，严选包装，坏果包赔，点击切沙拉单，让这份天然酸甜点亮你的味蕾，解锁健康轻生活！</p>
				`
			},
			// 评论相关数据
			commentList: [], // 评论列表
			commentStats: {
				total: 0, // 评论总数
				goodRate: 0 // 好评率
			},
			commentLoading: false, // 评论加载状态
			qaList: [
				{
					question: '口感咋样啊?',
					answerCount: 5
				},
				{
					question: '会不会很酸啊?',
					answerCount: 10
				}
			],
			// 地址和自提点信息
			userDefaultAddress: null, // 用户默认地址
			storeList: [], // 自提点列表
			communityInfo: null, // 社区信息
			deliveryInfo: {
				pickupLocation: '北京尚德井小区菜鸟驿站', // 默认自提点
				deliveryTime: '预计明日16：30前送达',
				deliveryAddress: '北京尚德井小区菜鸟驿站'
			}
		}
	},
	computed: {
		// 扩展用户数据以实现无缝轮播
		extendedBuyersData() {
			const data = this.groupBuyersData;
			// 前后各添加一份数据实现无缝轮播
			return [...data, ...data, ...data];
		}
	},
	methods: {
		// 获取商品详情
		async getGoodsDetails(id) {
			try {
				// 根据页面类型调用不同的API
				let res;
				if (this.pageType === 'group') {
					// 拼团商品详情
					res = await getUserCombinationDetail(id);
				} else {
					// 普通商品详情
					res = await getGoodsDetail(id);
				}
				if ((res.code === 200 || res.status === 200) && res.data) {
					const data = res.data;

					// 根据页面类型处理不同的数据结构
					if (this.pageType === 'group') {
						// 拼团商品数据结构
						this.goodsInfo = {
							...this.goodsInfo,
							id: data.id,
							title: data.title || data.name || data.store_name,
							price: data.group_price || data.price || '0',
							sales: data.sales || '0',
							origin: data.origin || '未知',
							images: data.images ? data.images.map(img => this.setDomain(img)) : [this.setDomain(data.image)],
							description: data.description || '',
							original_price: data.original_price || data.ot_price,
							people: data.people || 2,
							effective_time: data.effective_time,
							effective_time_text: data.effective_time_text,
							// 拼团特有字段
							save_price: data.save_price || '0.00',
							start_time: data.start_time,
							end_time: data.end_time,
							start_time_text: data.start_time_text,
							stop_time_text: data.stop_time_text,
							time_left_text: data.time_left_text,
							time_left_seconds: data.time_left_seconds,
							status_text: data.status_text,
							product_id: data.product_id,
							group_id: data.group_id,
							min_buy_num: data.min_buy_num,
						max_buy_num: data.max_buy_num,
						quota: data.quota,
						limit_buy: data.limit_buy,
						stock: data.stock,
						rule_desc: data.rule_desc,
						receiving_time: data.receiving_time,
						receiving_time_text: data.receiving_time_text,
						is_host: data.is_host
					};
				} else {
					// 普通商品数据结构
					this.goodsInfo = {
						...this.goodsInfo,
						id: data.id,
						title: data.title || data.name,
						price: data.min_price || '0',
						sales: data.sales || '0',
						origin: '未知', // 普通商品API可能没有产地信息
						images: data.images ? data.images.split(',').map(img => this.setDomain(img.trim())) : [this.setDomain(data.image)],
						description: data.description || '',
						original_price: data.max_price || data.min_price,
						// 普通商品特有字段
						like: data.like || 0,
						dislike: data.dislike || 0,
						is_like: data.is_like || -1,
						buy_list: data.buy_list || []
					};

					// 更新购买意向数据（使用API返回的真实数据）
					this.wantCount = data.like || 0;
					this.noWantCount = data.dislike || 0;
				}

				// 加载商品评论（不论拼团商品还是普通商品，评论接口都一致）
				this.loadGoodsComments(this.goodsInfo.id);

				// 加载配送信息
				this.loadDeliveryInfo();
				} else {
					// 特殊处理：商品不存在或不在社区范围内的情况
					if ((res.status === 400 || res.code === 400) && res.msg && res.msg.includes('拼团商品不存在或不在您的社区范围内')) {
						this.handleProductNotAvailable(res.msg);
					} else if (res.msg && res.msg.includes('拼团商品不存在或不在您的社区范围内')) {
						this.handleProductNotAvailable(res.msg);
					} else {
						uni.showToast({
							title: res.msg || '获取商品详情失败',
							icon: 'none'
						});
					}
				}
			} catch (err) {
				console.error('获取商品详情失败:', err);

				// 检查是否是业务逻辑错误（400状态码）
				if (err && (err.status === 400 || err.code === 400)) {
					// 检查是否是商品不存在或不在社区范围内的错误
					const errorMessage = err.msg || err.message || '';
					if (errorMessage.includes('拼团商品不存在或不在您的社区范围内')) {
						this.handleProductNotAvailable(errorMessage);
						return;
					}

					// 其他400错误，显示具体错误信息
					uni.showToast({
						title: errorMessage || '商品信息获取失败',
						icon: 'none'
					});
					return;
				}

				// 检查是否是登录相关错误
				if (err && err.isLoginError) {
					// 登录相关错误已经由request.js自动处理
					console.log('商品详情获取失败：用户未登录');
					return;
				}

				// 检查错误信息是否包含商品不存在的提示（兼容处理）
				const errorMessage = err.message || err.msg || '';
				if (errorMessage.includes('拼团商品不存在或不在您的社区范围内')) {
					this.handleProductNotAvailable(errorMessage);
				} else {
					// 网络错误或其他未知错误
					uni.showToast({
						title: '网络错误，请稍后重试',
						icon: 'none'
					});
				}
			}
		},

		// 处理商品不可用的情况
		handleProductNotAvailable(message) {
			console.log('商品不可用:', message);

			uni.showModal({
				title: '商品不可用',
				content: '很抱歉，该商品不存在或不在您的社区范围内。\n\n您可以：\n• 查看其他商品\n• 切换到您的社区范围内\n• 联系客服了解详情',
				showCancel: true,
				cancelText: '查看其他',
				confirmText: '返回上页',
				success: (res) => {
					if (res.confirm) {
						// 用户选择返回上页
						this.goBackToList();
					} else if (res.cancel) {
						// 用户选择查看其他商品，跳转到今日团购页面
						uni.redirectTo({
							url: '/pages/index/today-group-buying/index'
						});
					}
				},
				fail: () => {
					// 如果弹窗失败，直接返回
					this.goBackToList();
				}
			});
		},

		// 返回到商品列表
		goBackToList() {
			// 延迟一下再返回，让用户看到提示
			setTimeout(() => {
				uni.navigateBack({
					fail: () => {
						// 如果返回失败，跳转到今日团购页面
						uni.redirectTo({
							url: '/pages/index/today-group-buying/index'
						});
					}
				});
			}, 300);
		},

		// 处理图片URL
		setDomain(url) {
			if (!url) return '';
			url = url.toString();

			// 如果是相对路径，拼接域名
			if (url.indexOf('/') === 0) {
				return HTTP_REQUEST_URL + url;
			}

			// 如果已经是完整URL，直接返回
			if (url.indexOf("http") === 0) {
				return url;
			}

			// 其他情况拼接域名
			return HTTP_REQUEST_URL + '/' + url;
		},

		// 返回上一页
		goBack() {
			uni.navigateBack()
		},

		// 分享商品
		shareGoods() {
			uni.showToast({
				title: '分享功能开发中',
				icon: 'none'
			})
		},

		// 滑动轮播图
		swiperChange(e) {
			this.currentIndex = e.detail.current
		},

		// 查看全部评价
		viewAllEvaluations() {
			uni.navigateTo({
				url: '/pages/goods_details/evaluate_list'
			})
		},

		// 查看全部问答
		viewAllQA() {
			uni.navigateTo({
				url: '/pages/goods_details/qa_list'
			})
		},

		// 加入购物车
		async addToCart() {
			try {
				console.log('开始添加商品到购物车...', this.goodsInfo.id);

				// 显示加载状态
				uni.showLoading({
					title: '添加中...'
				});

				// 直接调用API，避免可能的中间层问题
				const response = await updateGroupCart({
					goods_id: this.goodsInfo.id.toString(),
					quantity: '1'
				});

				uni.hideLoading();

				// 详细记录API响应结构，帮助调试
				console.log('购物车API直接响应:', response);
				console.log('响应结构:', {
					hasData: !!response.data,
					dataType: response.data ? typeof response.data : 'undefined',
					hasStatus: response.data && response.data.status !== undefined,
					status: response.data && response.data.status !== undefined ? response.data.status : 'undefined',
					msg: response.data && response.data.msg ? response.data.msg : 'undefined',
					topStatus: response.status,
					topMsg: response.msg
				});

				// 处理API响应
				if (response && response.data && response.data.status === 200) {
					// 显示API返回的提示信息
					console.log('显示嵌套状态提示:', response.data.msg || '已加入购物车');
					uni.showToast({
						title: response.data.msg || '已加入购物车',
						icon: 'success',
						duration: 2000
					});
					
					// 更新购物车数量（可选）
					try {
						// 可以在这里触发购物车数量更新
						uni.$emit('update-cart-count');
					} catch (e) {
						console.error('更新购物车数量失败:', e);
					}
				} else if (response && response.status === 200) {
					// 处理顶层status为200的情况
					console.log('显示顶层状态提示:', response.msg || '已加入购物车');
					uni.showToast({
						title: response.msg || '已加入购物车',
						icon: 'success',
						duration: 2000
					});
				} else {
					// 使用API处理工具，避免显示技术性的"success"信息
					console.log('使用handleActionApi处理其他情况');
					const result = handleActionApi(response, {
						successMsg: '已加入购物车',
						errorMsg: '添加失败'
					});
				}

			} catch (error) {
				uni.hideLoading();
				console.error('添加购物车异常:', error);

				// 处理异常情况，尝试从错误对象中提取错误信息
				let errorMsg = '网络错误，请重试';
				
				// 检查错误对象中是否有API返回的错误信息
				if (error && error.data && error.data.msg) {
					errorMsg = error.data.msg;
				} else if (error && error.msg) {
					errorMsg = error.msg;
				} else if (typeof error === 'string') {
					errorMsg = error;
				}
				
				console.log('显示错误提示:', errorMsg);
				uni.showToast({
					title: errorMsg,
					icon: 'none'
				});
			}
		},

		// 立即购买
		buyNow() {
			console.log('立即购买商品:', this.goodsInfo.id);

			// 直接跳转到订单确认页面，让订单页面处理登录检查
			uni.navigateTo({
				url: '/pages/goods/order_confirm/new_order_confirm?id=' + this.goodsInfo.id,
				fail: (err) => {
					console.error('跳转订单页面失败:', err);
					uni.showToast({
						title: '页面跳转失败',
						icon: 'none'
					});
				}
			});
		},

		// 启动轮播
		startCarousel() {
			this.carouselTimer = setInterval(() => {
				this.nextUser();
			}, 2000); // 每2秒切换一次
		},

		// 停止轮播
		stopCarousel() {
			if (this.carouselTimer) {
				clearInterval(this.carouselTimer);
				this.carouselTimer = null;
			}
		},

		// 切换到下一个用户
		nextUser() {
			this.centerIndex++;
			if (this.centerIndex >= this.extendedBuyersData.length - 1) {
				// 重置到开始位置实现无缝轮播
				this.centerIndex = this.groupBuyersData.length;
			}
			this.updateCarouselOffset();
		},

		// 更新轮播偏移量
		updateCarouselOffset() {
			// 每个用户项高度约22px，居中显示
			this.carouselOffset = -(this.centerIndex - 1) * 22;
		},

		// 查看全部评价
		viewAllReviews() {
			uni.navigateTo({
				url: `/pages/goods/goods_comment_list/index?product_id=${this.goodsInfo.id}`
			})
		},

		// 切换"不想买"状态
		async toggleNoWant() {
			// 普通商品调用API
			if (this.pageType === 'category') {
				try {
					// 由于API没有直接的dislike接口，我们使用like接口并传入-1表示不想买
					const res = await likeGoods(this.goodsInfo.id, -1);
					
					if (res.status === 200) {
						// 更新本地状态
						if (this.goodsInfo.is_like === -1) {
							// 已经是不想买，再次点击取消
							this.goodsInfo.is_like = 0;
							this.noWantCount--;
						} else {
							// 设为不想买
							if (this.goodsInfo.is_like === 1) {
								// 如果之前是想买，先减少想买数
								this.wantCount--;
							}
							this.goodsInfo.is_like = -1;
							this.noWantCount++;
						}
						
						uni.showToast({
							title: this.goodsInfo.is_like === -1 ? '已标记为不想买' : '已取消标记',
							icon: 'success'
						});
					}
				} catch (error) {
					console.error('操作失败:', error);
					uni.showToast({
						title: '操作失败',
						icon: 'none'
					});
				}
			} else {
				// 拼团商品使用原来的本地逻辑
				if (this.userWantStatus === 'noWant') {
					this.noWantCount--;
					this.userWantStatus = null;
				} else {
					if (this.userWantStatus === 'want') {
						this.wantCount--;
					}
					this.noWantCount++;
					this.userWantStatus = 'noWant';
				}
				
				this.saveUserChoice();
			}
		},

		// 切换"想买"状态
		async toggleWant() {
			// 只有普通商品才调用API
			if (this.pageType === 'category') {
				try {
					// 根据当前状态决定是点赞还是取消点赞
					const type = this.goodsInfo.is_like === 1 ? 0 : 1;
					const res = await likeGoods(this.goodsInfo.id, type);

					if (res.status === 200) {
						// 更新本地状态
						if (type === 1) {
							this.goodsInfo.is_like = 1;
							this.wantCount++;
						} else {
							this.goodsInfo.is_like = -1;
							this.wantCount--;
						}

						uni.showToast({
							title: type === 1 ? '已点赞' : '已取消点赞',
							icon: 'success'
						});
					}
				} catch (error) {
					console.error('点赞操作失败:', error);
					uni.showToast({
						title: '操作失败',
						icon: 'none'
					});
				}
			} else {
				// 拼团商品使用原来的本地逻辑
				if (this.userWantStatus === 'want') {
					this.wantCount--;
					this.userWantStatus = null;
				} else {
					if (this.userWantStatus === 'noWant') {
						this.noWantCount--;
					}
					this.wantCount++;
					this.userWantStatus = 'want';
				}
				this.saveUserChoice();
			}
		},

		// 保存用户选择到本地存储
		saveUserChoice() {
			// 使用商品ID作为key，保存用户选择
			const key = `goods_intent_${this.goodsInfo.id}`;
			uni.setStorageSync(key, this.userWantStatus);

			// 这里可以添加向后端发送数据的逻辑
			// 实际项目中应该将用户选择同步到服务器
		},

		// 加载用户之前的选择
		loadUserChoice() {
			const key = `goods_intent_${this.goodsInfo.id}`;
			const savedChoice = uni.getStorageSync(key);
			if (savedChoice) {
				this.userWantStatus = savedChoice;
			}
		},

		// 加载问答列表
		async loadQAQuestions(goodsId) {
			if (this.qaLoading) return;

			this.qaLoading = true;
			try {
				const response = await getGoodsQuestionList(goodsId, {
					page: 1,
					limit: 10
				});

				if (response.status === 200 && response.data) {
					this.qaQuestions = response.data.list || [];
					console.log('问答列表加载成功:', this.qaQuestions);
				}
			} catch (error) {
				console.error('加载问答列表失败:', error);
			} finally {
				this.qaLoading = false;
			}
		},

		// 查看所有问题
		viewAllQuestions() {
			// 跳转到问答列表页面
			uni.navigateTo({
				url: `/pages/goods/goods_qa_list/index?goodsId=${this.goodsInfo.id}`
			});
		},

		// 查看问题详情
		viewQuestionDetail(question) {
			// 跳转到问题详情页面
			uni.navigateTo({
				url: `/pages/goods/goods_qa_detail/index?questionId=${question.id}`
			});
		},

		// 我要提问
		askQuestion() {
			// 跳转到提问页面
			uni.navigateTo({
				url: `/pages/goods/goods_ask_question/index?goodsId=${this.goodsInfo.id}`
			});
		},

		// 加载商品评论
		async loadGoodsComments(goodsId) {
			if (this.commentLoading) return;

			this.commentLoading = true;
			try {
				const response = await getGoodsCommentList(goodsId, {
					page: 1,
					limit: 2 // 详情页只显示前2条评论
				});

				if (response.status === 200 && response.data) {
					this.commentList = response.data.list || [];
					this.commentStats.total = response.data.count || 0;

					// 计算好评率（假设评分4-5星为好评）
					if (this.commentList.length > 0) {
						const goodComments = this.commentList.filter(comment =>
							comment.star_grade >= 4
						).length;
						this.commentStats.goodRate = this.commentStats.total > 0
							? Math.round((goodComments / this.commentStats.total) * 100)
							: 0;
					}

					console.log('评论列表加载成功:', this.commentList);
				}
			} catch (error) {
				console.error('加载评论列表失败:', error);
				// 不显示错误提示，静默失败
			} finally {
				this.commentLoading = false;
			}
		},

		// 加载配送信息
		async loadDeliveryInfo() {
			// 优先获取我的社区信息
			try {
				const communityRes = await getMyCommunityInfo();
				if (communityRes.status === 200 && communityRes.data && communityRes.data.is_bind && communityRes.data.community) {
					this.communityInfo = communityRes.data;
					const community = communityRes.data.community;
					console.log('获取社区信息成功:', this.communityInfo);

					// 使用社区信息更新配送信息
					// 自提点使用社区名称，但要控制长度保持显示效果一致
					let pickupName = community.name;
					// 参考原来的静态数据"北京尚德井小区菜鸟驿站"(11个字符)，控制在相似长度
					if (pickupName.length > 10) {
						pickupName = pickupName.substring(0, 10) + '...';
					}
					// 如果社区名称太短，可以添加"自提点"后缀保持一致性
					if (pickupName.length < 6 && !pickupName.includes('自提点')) {
						pickupName = pickupName + '自提点';
					}
					this.deliveryInfo.pickupLocation = pickupName;

					// 配送地址使用社区的完整地址（模板中已有"送至"，这里不需要重复）
					// 控制配送地址长度，避免换行影响布局
					let deliveryAddress = community.full_address;
					if (deliveryAddress.length > 20) {
						deliveryAddress = deliveryAddress.substring(0, 20) + '...';
					}
					this.deliveryInfo.deliveryAddress = deliveryAddress;

					// 更新预计送达时间（使用接口返回的真实数据）
					if (this.goodsInfo.receiving_time_text) {
						this.deliveryInfo.deliveryTime = `预计${this.goodsInfo.receiving_time_text}送达`;
					}

					// 如果社区信息获取成功，就不需要再获取其他信息了
					return;
				} else if (communityRes.status === 200 && communityRes.data && !communityRes.data.is_bind) {
					console.log('用户未绑定社区，使用默认配送信息');
				}
			} catch (error) {
				console.log('获取社区信息失败，尝试其他方式:', error);
			}

			// 如果社区信息获取失败，尝试获取用户默认地址
			try {
				const addressRes = await getAddressDefault();
				if (addressRes.status === 200 && addressRes.data && addressRes.data.length > 0) {
					this.userDefaultAddress = addressRes.data;
					// 使用用户默认地址更新配送信息（模板中已有"送至"，这里不需要重复）
					const address = addressRes.data;
					this.deliveryInfo.deliveryAddress = `${address.province}${address.city}${address.district}${address.detail}`;
				}
			} catch (error) {
				console.log('获取用户地址失败，使用默认配送信息:', error);
			}

			// 尝试获取自提点列表
			try {
				const storeRes = await storeListApi({
					page: 1,
					limit: 10
				});
				if (storeRes.status === 200 && storeRes.data && storeRes.data.list && storeRes.data.list.length > 0) {
					this.storeList = storeRes.data.list;
					// 使用第一个自提点作为默认自提点
					const firstStore = storeRes.data.list[0];
					this.deliveryInfo.pickupLocation = `${firstStore.name || firstStore.address}`;
				}
			} catch (error) {
				console.log('获取自提点列表失败，使用默认自提点:', error);
			}

			// 根据接口返回的 receiving_time_text 更新预计送达时间
			if (this.goodsInfo.receiving_time_text) {
				this.deliveryInfo.deliveryTime = `预计${this.goodsInfo.receiving_time_text}送达`;
			}
		}
	},
	onLoad(options) {
		// 获取页面类型参数
		if (options.type) {
			this.pageType = options.type; // 'category' 或 'group'
		} else {
			this.pageType = 'category'; // 默认为分类页面类型
		}

		// 安全机制：只有明确传入canBuy=true时才允许购买
		if (options.canBuy === 'true') {
			this.canBuy = true;
		} else {
			this.canBuy = false; // 默认不可购买，确保安全
		}

		// 获取商品详情数据
		if (options.id) {
			this.getGoodsDetails(options.id);
			this.loadQAQuestions(options.id);
		}

		// 只有不可购买时（显示团购用户区域）才启动轮播
		if (!this.canBuy) {
			this.startCarousel();
		}

		// 加载用户之前的选择
		this.loadUserChoice();
	},
	onUnload() {
		// 页面卸载时停止轮播
		this.stopCarousel();
	}
}
</script>

<style lang="scss" scoped>
.product-con {
	width: 100%;
	background-color: #f5f5f5;
	padding-bottom: 80px;

	/* Banner区域 - 填满屏幕 */
	.banner-section {
		position: relative;
		width: 100vw;
		height: 254px;
		left: 0;
		top: 0;
	}



	/* 背景轮播图 */
	.banner-swiper {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
	}

	.banner-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	/* 返回按钮 */
	.back-icon {
		position: absolute;
		width: 48rpx;
		height: 48rpx;
		left: 24rpx;
		top: 30rpx;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;

		.back-icon-img {
			width: 32rpx; /* 统一图标大小 */
			height: 32rpx;
			filter: brightness(0) invert(1) drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.5));
		}
	}

	/* 分享按钮 */
	.share-button {
		position: absolute;
		width: 48rpx;
		height: 48rpx;
		right: 24rpx;
		top: 30rpx;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;

		.share-icon-img {
			width: 32rpx; /* 统一图标大小 */
			height: 32rpx;
			filter: brightness(0) invert(1) drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.5));
		}
	}

	/* 图片计数器 */
	.image-counter {
		position: absolute;
		width: 48rpx;
		height: 40rpx;
		right: 32rpx;
		top: 94rpx;
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 28rpx;
		line-height: 40rpx;
		color: #FFFFFF;
		z-index: 10;
	}

	/* 图片/视频标签 */
	.media-label {
		position: absolute;
		width: 126rpx;
		height: 40rpx;
		left: 600rpx;
		top: 420rpx;
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 28rpx;
		line-height: 40rpx;	
		color: #FFFFFF;
		z-index: 10;
	}

	/* 商品卡片区域 - 使用相对布局 */
	.goods-card-section {
		background: #FFFFFF;
		border-radius: 8rpx;
		margin: 16rpx 24rpx 0;
		height: 220rpx;
		position: relative;
	}

	/* 价格容器 */
	.price-container {
		position: absolute;
		left: 6rpx;
		top: 16rpx;
		display: flex;
		align-items: baseline;
		gap: 8rpx;
	}

	/* 价格文字 */
	.price-text {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 48rpx;
		line-height: 68rpx;
		color: #1A1A1A;
	}

	/* 原价文字 */
	.original-price-text {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 24rpx;
		line-height: 34rpx;
		color: #999999;
		text-decoration: line-through;
	}

	/* 节省金额文字 */
	.save-price-text {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 24rpx;
		line-height: 34rpx;
		color: #FF6B35;
	}

	/* 销量文字 */
	.sold-text {
		position: absolute;
		right: 16rpx;
		top: 38rpx;
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 28rpx;
		line-height: 40rpx;
		color: #999999;
	}

	/* 商品标题 */
	.goods-title-text {
		position: absolute;
		left: 16rpx;
		top: 92rpx;
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 32rpx;
		line-height: 44rpx;
		color: #333333;
	}

	/* 产地容器 */
	.origin-container {
		position: absolute;
		bottom: 28rpx;
		left: 16rpx;
		width: 136rpx;
		height: 40rpx;
	}

	/* 产地边框 */
	.origin-border {
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		border: 1rpx solid #999999;
		border-radius: 2rpx;
		position: absolute;
	}

	/* 产地文字 */
	.origin-text {
		position: absolute;
		left: 8rpx;
		top: 3rpx;
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 24rpx;
		line-height: 34rpx;
		color: #999999;
	}

	/* 活动信息 */
	.activity-info {
		position: absolute;
		right: 16rpx;
		bottom: 16rpx;
		display: flex;
		align-items: center;
		gap: 12rpx;
	}

	.activity-status {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 24rpx;
		line-height: 34rpx;
		color: #FF6B35;
		background: rgba(255, 107, 53, 0.1);
		padding: 2rpx 8rpx;
		border-radius: 4rpx;
	}

	.time-left {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 24rpx;
		line-height: 34rpx;
		color: #666666;
	}

	/* 团购用户区域 */
	.goods-group-buyers-section {
		background: #FFFFFF;
		border-radius: 4px;
		margin: 10px 12px 0;
		height: 121px;
		position: relative;
		overflow: hidden;
	}

	/* 团购标题 */
	.group-buyers-title {
		position: absolute;
		left: 8px;
		top: 11px;
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 14px;
		line-height: 20px;
		color: #000000;
		z-index: 2;
	}

	/* 轮播容器 */
	.buyers-carousel-container {
		position: absolute;
		left: 8px;
		top: 40px;
		width: 335px;
		height: 70px;
		overflow: hidden;
	}

	/* 轮播内容 */
	.buyers-carousel {
		transition: transform 0.5s ease-in-out;
	}

	/* 用户项 */
	.user-item {
		position: relative;
		width: 100%;
		height: 22px;
		margin-bottom: 2px;
		display: flex;
		align-items: center;
	}

	/* 小头像 */
	.user-avatar-small {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		margin-right: 18px;
		transition: all 0.3s ease;
	}

	/* 大头像 (中心位置) */
	.user-avatar-large {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		margin-right: 15px;
		transition: all 0.3s ease;
	}

	/* 小用户名 */
	.user-name-small {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 10px;
		line-height: 14px;
		color: #666666;
		flex: 1;
		transition: all 0.3s ease;
	}

	/* 大用户名 (中心位置) */
	.user-name-large {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 14px;
		line-height: 20px;
		color: #1A1A1A;
		flex: 1;
		transition: all 0.3s ease;
	}

	/* 小购买状态 */
	.purchase-status-small {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 10px;
		line-height: 14px;
		color: #999999;
		transition: all 0.3s ease;
	}

	/* 大购买状态 (中心位置) */
	.purchase-status-large {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 12px;
		line-height: 17px;
		color: #333333;
		transition: all 0.3s ease;
	}

	/* 评价区域 */
	.goods-review-section {
		background: #FFFFFF;
		border-radius: 4px;
		margin: 10px 12px 0;
		height: 180px;
		position: relative;
	}

	/* 评价头部 */
	.review-header {
		position: absolute;
		left: 0;
		top: 10px;
		width: 100%;
		height: 22px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 8px;
		box-sizing: border-box;
	}

	/* 评价左侧 */
	.review-left {
		display: flex;
		align-items: center;
	}

	/* 评价标题 */
	.review-title {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 22px;
		color: #1A1A1A;
		margin-right: 6px;
	}

	/* 好评率 */
	.review-rate {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 12px;
		line-height: 17px;
		color: #E75E34;
	}

	/* 评价右侧 */
	.review-right {
		display: flex;
		align-items: center;
	}

	/* 全部文字 */
	.view-all-text {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 14px;
		line-height: 20px;
		color: #999999;
		margin-right: 6px;
	}

	/* 右箭头图标 */
	.right-arrow-icon {
		width: 5px;
		height: 9px;
		margin-left: 6px;
	}

	/* 评价卡片1 */
	.review-card1 {
		position: absolute;
		left: 8px;
		top: 52px;
		width: 327px;
		height: 49px;
		display: flex;
		align-items: flex-start;
	}

	/* 评价卡片2 */
	.review-card2 {
		position: absolute;
		left: 8px;
		top: 121px;
		width: 247px;
		height: 49px;
		display: flex;
		align-items: flex-start;
	}

	/* 评价头像 */
	.review-avatar {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		margin-right: 11px;
		margin-top: 3px;
	}

	/* 评价内容容器 */
	.review-content {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	/* 评价者姓名 */
	.reviewer-name {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 22px;
		color: #999999;
		margin-bottom: 5px;
	}

	/* 评价文字 */
	.review-text {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 22px;
		color: #1A1A1A;
	}

	/* 无评论提示 */
	.no-comments {
		position: absolute;
		left: 8px;
		top: 52px;
		width: 327px;
		height: 49px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.no-comments-text {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 14px;
		line-height: 20px;
		color: #999999;
	}

	/* 加载中提示 */
	.loading-comments {
		position: absolute;
		left: 8px;
		top: 52px;
		width: 327px;
		height: 49px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.loading-text {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 14px;
		line-height: 20px;
		color: #999999;
	}

	/* 买家秀区域 */
	.goods-buyer-show-section {
		margin: 6px 12px 0;
		height: 82px;
		position: relative;
		display: flex;
	}

	/* 买家秀图片容器 */
	.buyer-show-image-wrapper {
		flex: 1;
		display: flex;
		justify-content: center;
	}

	.buyer-show-image-wrapper:first-child {
		justify-content: flex-start;
	}

	.buyer-show-image-wrapper:last-child {
		justify-content: flex-end;
	}

	/* 买家秀图片 */
	.buyer-show-image {
		width: 82px;
		height: 82px;
		border-radius: 4px;
		object-fit: cover;
	}

	/* 买家秀标签 */
	.buyer-show-label {
		position: absolute;
		left: 0;
		top: 0;
		width: 43px;
		height: 14px;
		background: rgba(0, 0, 0, 0.35);
		border-radius: 4px 2px 2px 2px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* 买家秀文字 */
	.buyer-show-text {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 10px;
		line-height: 21px;
		color: #FFFFFF;
	}

	/* 问大家区域 */
	.goods-qa-section {
		background: #FFFFFF;
		border-radius: 4px;
		margin: 10px 12px 0;
		height: 100px;
		padding: 10px 7px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}

	/* 问大家头部 */
	.qa-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 22px;
		margin-bottom: 12px;
	}

	/* 问大家标题 */
	.qa-title {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 22px;
		color: #1A1A1A;
	}

	/* 右侧全部链接 */
	.qa-header-right {
		display: flex;
		align-items: center;
	}

	.qa-all-text {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 14px;
		line-height: 20px;
		color: #999999;
		margin-right: 6px;
	}

	.qa-arrow {
		font-size: 12px;
		color: #999999;
	}

	/* 问题列表 */
	.qa-questions {
		flex: 1;
	}

	/* 问题项 */
	.qa-question-item {
		margin-bottom: 8px;
		display: flex;
		align-items: center;
		gap: 25px;
	}

	/* 问题文字 */
	.qa-question-text {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 14px;
		line-height: 20px;
		color: #1A1A1A;
	}

	/* 回答数量 */
	.qa-answer-count {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 12px;
		line-height: 17px;
		color: #999999;
	}

	/* 产品介绍区域 */
	.goods-intro-section {
		background: #FFFFFF;
		border-radius: 4px;
		margin: 10px 12px 0;
		height: 242px;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 9px 0;
		box-sizing: border-box;
	}

	/* 产品介绍标题 */
	.intro-title {
		width: 64px;
		height: 22px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 14px;
	}

	.intro-title-text {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 21px;
		color: #393D48;
	}

	/* 产品介绍内容 */
	.intro-content {
		width: 338px;
		height: 171px;
		padding: 0 8px;
		box-sizing: border-box;
	}

	.intro-content-text {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 21px;
		color: #808080;
		display: block;
	}

	/* 购买意向区域 */
	.purchase-intent-section {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 61px;
		background: #FFFFFF;
		display: flex;
		align-items: center;
		padding: 10px 12px;
		box-sizing: border-box;
		gap: 10px;
		z-index: 100;
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
	}

	/* 不想买按钮 */
	.no-want-buy-btn {
		flex: 168;
		height: 40px;
		background: #FFC082;
		border-radius: 26px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}

	/* 想买按钮 */
	.want-buy-btn {
		flex: 173;
		height: 40px;
		background: #FF840B;
		border-radius: 26px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}

	/* 按钮文字 */
	.btn-text {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 14px;
		line-height: 18px;
		color: #FFFFFF;
	}

	/* 按钮图标 */
	.btn-icon {
		width: 13.45px;
		height: 13.41px;
	}

	/* 物流信息区域 */
	.delivery-info-section {
		background: #FFFFFF;
		border-radius: 4px;
		margin: 10px 12px 0;
		height: 152px;
		padding: 10px 7px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}

	/* 自提点信息 */
	.pickup-info {
		margin-bottom: 22px;
	}

	.pickup-text {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 22px;
		color: #999999;
		/* 确保文本不会换行，保持布局一致 */
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
	}

	/* 预计送达时间 */
	.predict-time {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
		margin-left: 60rpx;
	}

	.time-icon-wrapper {
		display: flex;
		align-items: center;
		margin-right: 5px;
	}

	.time-icon {
		width: 16px;
		height: 16px;
		margin-right: 2px;
	}

	.colon {
		font-family: 'Inter';
		font-style: normal;
		font-weight: 400;
		font-size: 12px;
		line-height: 15px;
		color: #999999;
	}

	.time-text {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 22px;
		color: #4D4D4D;
	}

	/* 送达地址 */
	.destination {
		display: flex;
		align-items: center;
		margin-bottom: 22px;
		margin-left: 60rpx;
	}

	.location-icon {
		width: 13.42px;
		height: 16px;
		margin-right: 5px;
	}

	.destination-text {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 22px;
		color: #4D4D4D;
		/* 确保配送地址不会换行，保持布局一致 */
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
	}

	/* 保障信息 */
	.guarantee-footer {
		margin-top: auto;
	}

	.guarantee-text {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 22px;
		color: #999999;
	}

	/* 购物车操作区域 */
	.cart-action-section {
		background: #FFFFFF;
		margin-top: 10px;
		height: 61px;
		width: 100%;
		display: flex;
		align-items: center;
		padding: 10px 12px;
		box-sizing: border-box;
		gap: 10px;
	}

	/* 加入购物车按钮 */
	.add-cart-btn {
		flex: 168;
		height: 40px;
		background: #FFC082;
		border-radius: 26px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* 立即购买按钮 */
	.buy-now-btn {
		flex: 173;
		height: 40px;
		background: #FF840B;
		border-radius: 26px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.delivery-info {
		background-color: #fff;
		padding: 20rpx 30rpx;
		margin-top: 20rpx;

		.delivery-item {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;

			.iconfont {
				width: 40rpx;
				text-align: center;
				margin-right: 10rpx;
				color: #999;
			}

			.delivery-text {
				flex: 1;
				font-size: 28rpx;
				color: #333;
			}

			.delivery-tag {
				padding: 4rpx 10rpx;
				background-color: #f2f2f2;
				color: #e93323;
				font-size: 24rpx;
				border-radius: 4rpx;
			}
		}
	}

	.guarantee-info {
		display: flex;
		align-items: center;
		background-color: #fff;
		padding: 20rpx 30rpx;
		margin-top: 2rpx;

		.guarantee-text {
			font-size: 28rpx;
			color: #333;
			margin-right: 15rpx;
		}

		.guarantee-value {
			font-size: 28rpx;
			color: #999;
		}
	}

	.evaluate-box {
		margin-top: 20rpx;
		background-color: #fff;
		padding: 30rpx;

		.evaluate-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 20rpx;

			.evaluate-title {
				font-size: 30rpx;
				color: #333;
				font-weight: bold;
			}

			.evaluate-rate {
				font-size: 24rpx;
				color: #e93323;
			}

			.view-all {
				font-size: 26rpx;
				color: #999;
				display: flex;
				align-items: center;

				.iconfont {
					margin-left: 5rpx;
				}
			}
		}

		.evaluate-list {
			.evaluate-item {
				margin-bottom: 20rpx;

				.user-info {
					display: flex;
					align-items: center;
					margin-bottom: 10rpx;

					.user-avatar {
						width: 60rpx;
						height: 60rpx;
						border-radius: 50%;
						margin-right: 10rpx;
					}

					.user-name {
						font-size: 28rpx;
						color: #333;
					}
				}

				.evaluate-content {
					font-size: 28rpx;
					color: #333;
					line-height: 1.5;
				}
			}
		}
	}

	.qa-box {
		margin-top: 20rpx;
		background-color: #fff;
		padding: 30rpx;

		.qa-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 20rpx;

			.qa-title {
				font-size: 30rpx;
				color: #333;
				font-weight: bold;
			}

			.view-all {
				font-size: 26rpx;
				color: #999;
				display: flex;
				align-items: center;

				.iconfont {
					margin-left: 5rpx;
				}
			}
		}

		.qa-list {
			.qa-item {
				margin-bottom: 20rpx;

				.qa-question {
					font-size: 28rpx;
					color: #333;
					margin-bottom: 10rpx;
				}

				.qa-answer-count {
					font-size: 24rpx;
					color: #999;
				}
			}
		}
	}

	.product-images {
		margin-top: 20rpx;
		background-color: #fff;
		padding: 30rpx;

		.product-images-header {
			font-size: 30rpx;
			color: #333;
			font-weight: bold;
			margin-bottom: 20rpx;
		}
	}

	.buyer-show {
		margin-top: 20rpx;
		background-color: #fff;
		padding: 30rpx;

		.buyer-show-header {
			font-size: 30rpx;
			color: #333;
			font-weight: bold;
			margin-bottom: 20rpx;
		}

		.buyer-show-list {
			display: flex;
			flex-wrap: wrap;
			margin: 0 -5rpx;

			.buyer-show-item {
				width: 25%;
				padding: 5rpx;
				box-sizing: border-box;

				.buyer-show-image {
					width: 100%;
					height: 170rpx;
					border-radius: 8rpx;
				}
			}
		}
	}

	.footer-action {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		z-index: 99;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);

		.cart-btn {
			flex: 1;
			height: 80rpx;
			background-color: #ffeee9;
			color: #e93323;
			font-size: 30rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0 20rpx;
			border-radius: 40rpx;
		}

		.buy-btn {
			flex: 1;
			height: 80rpx;
			background-color: #e93323;
			color: #fff;
			font-size: 30rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 20rpx;
			border-radius: 40rpx;
		}
	}
}

/* 图标字体 */
@font-face {
	font-family: "iconfont";
	src: url('data:font/woff2;charset=utf-8;base64,d09GMgABAAAAAAM8AAsAAAAAB0gAAALvAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDDAqCFIIFATYCJAMQCwoABCAFhGcHRhuqBhEVlKdkf4TjGLbBkpTOrLUhIxvZyMbyIx7o833b59x7X5JqkSSaRNMkiUQoJFqlQYlMJ5FCpxOm96+1dgthUUqD1KzZO/NXip0q3UnqJJVSmJCmKR3Km9Muad/djYECmR+pVFLJnAP+X8e8NC8sPxvIieoPeJYuDdRFXVSHdQINg5HkNuW6BbSF0VMgXjO5BrTzrKoE09BCrRlbxCcwtKcP6T3Ax+j78Q9shE2SkoGx9/QsEij88vOZQA7/H3LmAtLDOWBHkTEDKMS71tZLtMXMoG3qYoku1IEfr9T4mf//F9UlU0P/eCSRVYnG0rkwg5dfDkVIvo4i+Loh8QIzSdukw8s2jojQqGVjz4LGr+uzPJPL9S8vEnxVrAq9cle403OWNbiv1cKdrdspY+cy765WhutaJdzdPsqYuu2Wqf+2V+6u6xXjk5P98/HdF9vn7ngIb8luLu0/Wru/snyruzQ6Pn7SW8rQt/a5W3/stfSUrBsZOd5h2Xa3o2x85E+vLdMjvgsOmh9golTdx1seiIrOPH0IJrL/aRUU5N86/9m/5v/8uHzr9F9pv9H/MfQ94Dd3V/x1bW7qu7bWu8m+rN3Wux21Zv2uprkD9so2TZzOUJhWyqD8B+rfywAo/MzKP/X/3jn9v/6TmP7OP9LV4q9fjnUD+En8b71K0NHf0YGQ+g+OszLJqFszaTJow4YqGRpSTIPbdJuG7HRFQtsYkhYjkLWMoQpmBjpdC9BrWYKhae3NQw4RI2KOwJRnAMK2XUg2fYNs2wWqYF6gs+8betuuYehaeNvBcJmoQTRoTFwNHJkK7YYaU3wTzOXJGFPMCismMRdvMJcDWdesYsEk5lg9tid/EwsYlRQ8Qo+QSvFdCUolxYgmiiwbZKea3E7CMCZU0ECjiasGHDIp0M6gihk/vwnM5RFjuAc2/YqJMi7cwOzyANobrJQWfEp1latbfbR7lx9HsACGihT4IxB6CKniLoXAUvl4TIhCJdbBeEhN2SrH9eX295cBQ2O3RIocJYM41xxO11mSAAAA') format('woff2');
}

.iconfont {
	font-family: "iconfont" !important;
	font-size: 32rpx;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.icon-location:before {
	content: "\e602";
}

.icon-time:before {
	content: "\e63f";
}

.icon-address:before {
	content: "\e606";
}

.icon-right:before {
	content: "\e650";
}
</style>