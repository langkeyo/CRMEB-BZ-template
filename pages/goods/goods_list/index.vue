<template>
	<view class="hot-group-more">
		<!-- 使用通用头部导航组件 -->
		<!-- <CommonHeader title="" @back="goBack"></CommonHeader> -->

		<!-- 搜索框 -->
		<view class="search-container">
			<view class="back-btn" @click="handleBack">
				<image src="/static/common/icons/navigation/back_arrow.svg" class="back-icon" mode="aspectFit"></image>
			</view>
			<view class="search-box">
				<view class="search-input" @click="focusSearch">
					<text class="search-icon"></text>
					<input v-if="isSearchFocused" v-model="keyword" class="search-input-field" placeholder="搜索想要商品关键词"
						@confirm="searchProducts" @blur="blurSearch" />
					<text v-else class="search-placeholder">搜索想要商品关键词</text>
				</view>
			</view>
		</view>

		<!-- 商品列表 -->
		<view class="goods-list">
			<!-- 调试信息 -->
			<view v-if="goodsList.length === 0" style="text-align: center;margin: 0 auto; padding: 40rpx; color: #999;">
				{{ isLoading ? '加载中...' : '暂无商品数据' }}
			</view>
			<view class="goods-item" v-for="(item, index) in goodsList" :key="index" @click="navigateToDetail(item)">
				<view class="item-container">
					<image class="product-image" :src="setDomain(item.image)" mode="aspectFill"></image>
					<view class="goods-info">
						<text class="goods-name">{{ item.title }}</text>
						<view class="price-box">
							<view class="price-info">
								<text class="price-symbol">¥</text>
								<text class="price">{{ item.group_price }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 加载中/无更多数据 -->
		<view class="loading-more" v-if="loadingStatus !== 0">
			<text v-if="loadingStatus === 1">加载中...</text>
			<text v-else-if="loadingStatus === 2 && page > 1">已经到底了~</text>
		</view>
	</view>
</template>

<script>
import { getUserCombinationList } from '@/api/group.js'
import errorHandler from '@/utils/errorHandler.js';
import CommonHeader from '@/components/CommonHeader/index.vue';
import { HTTP_REQUEST_URL } from '@/config/app.js';

export default {
	components: {
		CommonHeader
	},
	name: 'HotGroupMore',
	data() {
		return {
			goodsList: [],
			keyword: '',
			isSearchFocused: false,
			page: 1,
			limit: 10,
			loadingStatus: 0, // 0: 不显示, 1: 加载中, 2: 已全部加载
			isLoading: false,
			hasMore: true
		}
	},
	onLoad(options) {
		// 检查是否有搜索参数
		if (options.searchValue) {
			// 解码URL编码的搜索词
			this.keyword = decodeURIComponent(options.searchValue);
			// 设置搜索框为聚焦状态
			this.isSearchFocused = true;
		}
		// 加载商品数据
		this.loadProducts()
	},
	onReachBottom() {
		if (this.hasMore && !this.isLoading) {
			this.loadMoreProducts()
		}
	},
	methods: {
		handleBack() {
			this.$emit('back');
			// 如果没有监听back事件，默认执行返回操作
			if (!this.$listeners.back) {
				uni.navigateBack();
			}
		},
		// 加载商品列表
		loadProducts() {
			this.isLoading = true
			this.loadingStatus = 1

			getUserCombinationList({
				page: this.page,
				limit: this.limit,
				keyword: this.keyword
			}).then(res => {
				if ((res.code === 200 || res.status === 200) && res.data) {
					// 处理返回的数据，确保字段正确
					const list = res.data.list || res.data || []
					this.goodsList = list.map(item => ({
						id: item.id,
						title: item.title || item.name || item.store_name,
						image: item.image || item.images?.[0] || '',
						group_price: item.group_price || item.price || 0,
						original_price: item.original_price || item.ot_price || null
					}))

					// 判断是否有更多数据
					this.hasMore = this.goodsList.length >= this.limit
					this.loadingStatus = this.hasMore ? 0 : 2
				} else {
					uni.showToast({
						title: res.msg || '获取商品失败',
						icon: 'none'
					})
				}
			}).catch(err => {
				console.error('获取商品列表失败:', err)
				// 使用统一的错误处理
				errorHandler.handleApiError(err, {
					defaultMsg: '获取商品列表失败，请稍后重试'
				})
			}).finally(() => {
				this.isLoading = false
			})
		},

		// 加载更多商品
		loadMoreProducts() {
			if (!this.hasMore || this.isLoading) return

			this.page++
			this.isLoading = true
			this.loadingStatus = 1

			getUserCombinationList({
				page: this.page,
				limit: this.limit,
				keyword: this.keyword
			}).then(res => {
				if ((res.code === 200 || res.status === 200) && res.data) {
					// 处理返回的数据，确保字段正确
					const list = res.data.list || res.data || []
					const newList = list.map(item => ({
						id: item.id,
						title: item.title || item.name || item.store_name,
						image: item.image || item.images?.[0] || '',
						group_price: item.group_price || item.price || 0,
						original_price: item.original_price || item.ot_price || null
					}))

					// 判断是否有更多数据
					this.hasMore = newList.length >= this.limit
					this.loadingStatus = this.hasMore ? 0 : 2

					// 将新数据添加到列表
					if (newList.length > 0) {
						this.goodsList = [...this.goodsList, ...newList]
					}
				} else {
					uni.showToast({
						title: res.msg || '获取更多商品失败',
						icon: 'none'
					})
				}
			}).catch(err => {
				console.error('加载更多商品失败:', err)
				uni.showToast({
					title: '网络错误，请稍后重试',
					icon: 'none'
				})
			}).finally(() => {
				this.isLoading = false
			})
		},

		// 搜索商品
		searchProducts() {
			this.page = 1
			this.goodsList = []
			this.hasMore = true
			this.loadProducts()
			this.blurSearch()
		},

		// 聚焦搜索框
		focusSearch() {
			this.isSearchFocused = true
		},

		// 失去焦点
		blurSearch() {
			if (!this.keyword) {
				this.isSearchFocused = false
			}
		},

		goBack() {
			uni.navigateBack()
		},

		navigateToDetail(item) {
			// 跳转到商品详情页面
			uni.navigateTo({
				url: `/pages/goods_details/index?id=${item.id}&type=combination`
			})
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
		}
	}
}
</script>

<style scoped lang="scss">
.hot-group-more {
	min-height: 100vh;
	background-color: #F8F8F8;

	.search-container {
		background-color: #FFFFFF;
		padding: 24rpx 20rpx;
		/* 与商品列表保持一致的左右边距 */
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
		display: flex;

		.back-btn {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			width: 60rpx;

			.back-icon {
				width: 32rpx;
				height: 32rpx;
				margin-right: 8rpx;
				/* 图标和文字间距 */
			}

			.back-text {
				font-size: 32rpx;
				color: #333333;
				font-weight: 400;
				flex: 1;
			}
		}

		.back-placeholder {
			width: 64rpx;
			height: 64rpx;
		}
	}

	.search-box {
		width: 100%;

		.search-input {
			display: flex;
			align-items: center;
			background-color: #F5F5F5;
			border-radius: 16rpx;
			height: 64rpx;
			padding: 0 24rpx;

			.search-icon {
				width: 32rpx;
				height: 32rpx;
				background-image: url("/static/images/index/hot_group/search-icon.svg");
				background-size: contain;
				background-repeat: no-repeat;
				margin-right: 16rpx;
			}

			.search-placeholder,
			.search-input-field {
				font-size: 28rpx;
				color: #999999;
			}

			.search-input-field {
				flex: 1;
				color: #333333;
				height: 100%;
			}
		}
	}

	.goods-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 24rpx;
		position: relative;

		.goods-item {
			width: 228rpx;
			/* 114px * 2 */
			height: 346rpx;
			/* 173px * 2 */
			margin-bottom: 30rpx;
			background-color: #FFFFFF;
			border-radius: 8rpx;
			/* 4px * 2 */
			overflow: hidden;
			box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
			padding: 16rpx;
			/* 统一的内边距，类似父级padding效果 */
			display: flex;
			flex-direction: column;

			.item-container {
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: column;

				.product-image {
					width: 196rpx;
					/* 98px * 2 */
					height: 206rpx;
					/* 103px * 2 */
					border-radius: 8rpx;
					/* 4px * 2 */
					object-fit: cover;
					margin-bottom: 16rpx;
					/* 图片和文字间距 */
				}

				.goods-info {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.goods-name {
						font-family: 'PingFang SC';
						font-style: normal;
						font-weight: 400;
						font-size: 28rpx;
						/* 14px * 2 */
						line-height: 40rpx;
						/* 20px * 2 */
						color: #333333;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
						margin-bottom: 8rpx;
						/* 名称和价格间距 */
					}

					.price-box {

						.price-info {
							font-family: 'PingFang SC';
							font-style: normal;
							font-weight: 400;
							font-size: 32rpx;
							/* 16px * 2 */
							line-height: 44rpx;
							/* 22px * 2 */
							color: #333333;
							display: flex;
							align-items: baseline;

							.price-symbol {
								font-size: 32rpx;
								color: #333333;
								font-weight: 400;
							}

							.price {
								font-size: 32rpx;
								color: #333333;
								font-weight: 400;
								margin-left: 4rpx;
								/* ￥符号和数字的间距 */
							}

							.original-price {
								font-size: 24rpx;
								color: #999999;
								text-decoration: line-through;
								margin-left: 10rpx;
								font-weight: 400;
							}
						}
					}
				}
			}
		}
	}

	.loading-more {
		text-align: center;
		padding: 32rpx 0;
		color: #999999;
		font-size: 28rpx;
	}
}
</style>
