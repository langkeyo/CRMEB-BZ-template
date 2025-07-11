<template>
	<view class="container">
		<!-- 顶部导航栏 -->
		<view class="page-header">
			<view class="header-left" @click="goBack">
				<image class="back-icon" src="/static/images/order/back_arrow.svg"></image>
				<text class="back-text">返回</text>
			</view>
			<view class="tab-container">
				<view 
					class="tab-item" 
					:class="{active: activeTab === 0}" 
					@click="changeTab(0)"
				>浏览</view>
				<view 
					class="tab-item" 
					:class="{active: activeTab === 1}" 
					@click="changeTab(1)"
				>收藏</view>
			</view>
			<view class="header-right" @click="showManage">
				{{ isManage ? '完成' : '管理' }}
			</view>
		</view>
		
		<!-- 浏览记录标签页 -->
		<swiper 
			class="swiper-content" 
			:current="activeTab"
			@change="swiperChange"
		>
			<!-- 浏览记录列表 -->
			<swiper-item class="swiper-item">
				<scroll-view
					scroll-y
					class="scroll-view"
					@scrolltolower="loadMore(0)"
				>
					<view class="goods-list" v-if="browseList.length > 0">
						<view class="goods-item" v-for="(item, index) in browseList" :key="index">
							<view class="checkbox-container" v-if="isManage">
								<checkbox :checked="item.checked" @click="checkItem(0, index)" />
							</view>
							<view class="goods-image" @click="goProductDetail(item)">
								<image :src="item.image" mode="aspectFill"></image>
								<view class="invalid-mask" v-if="!item.is_show">已下架</view>
							</view>
							<view class="goods-info" @click="goProductDetail(item)">
								<view class="goods-name">{{ item.store_name }}</view>
								<view class="goods-price">¥{{ item.price }}</view>
								<view class="browse-time">{{ item.add_time }}</view>
							</view>
						</view>
						
						<!-- 加载更多 -->
						<view class="loading-more">
							<text v-if="browseLoading">加载中...</text>
							<text v-else-if="browseLoadEnd">我也是有底线的~</text>
							<text v-else>上拉加载更多</text>
						</view>
					</view>
					
					<!-- 空状态 -->
					<view v-else class="empty-state">
						<image class="empty-image" src="/static/images/empty_browse.png"></image>
						<view class="empty-text">暂无浏览记录</view>
					</view>
				</scroll-view>
			</swiper-item>
			
			<!-- 收藏列表标签页 -->
			<swiper-item class="swiper-item">
				<scroll-view
					scroll-y
					class="scroll-view"
					@scrolltolower="loadMore(1)"
				>
					<view class="goods-list" v-if="collectList.length > 0">
						<view class="goods-item" v-for="(item, index) in collectList" :key="index">
							<view class="checkbox-container" v-if="isManage">
								<checkbox :checked="item.checked" @click="checkItem(1, index)" />
							</view>
							<view class="goods-image" @click="goProductDetail(item)">
								<image :src="item.image" mode="aspectFill"></image>
								<view class="invalid-mask" v-if="!item.is_show">已下架</view>
							</view>
							<view class="goods-info" @click="goProductDetail(item)">
								<view class="goods-name">{{ item.store_name }}</view>
								<view class="goods-price">¥{{ item.price }}</view>
								<view class="collect-time">{{ item.add_time }}</view>
							</view>
						</view>
						
						<!-- 加载更多 -->
						<view class="loading-more">
							<text v-if="collectLoading">加载中...</text>
							<text v-else-if="collectLoadEnd">我也是有底线的~</text>
							<text v-else>上拉加载更多</text>
						</view>
					</view>
					
					<!-- 空状态 -->
					<view v-else class="empty-state">
						<image class="empty-image" src="/static/images/empty_collection.png"></image>
						<view class="empty-text">暂无收藏商品</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		
		<!-- 底部操作栏 - 管理状态下显示 -->
		<view class="footer" v-if="isManage">
			<view class="check-all">
				<checkbox 
					:checked="activeTab === 0 ? isBrowseAllChecked : isCollectAllChecked" 
					@click="checkAll()" 
				/>
				<text>全选</text>
			</view>
			<view class="delete-btn" @click="deleteSelected()">
				{{ activeTab === 0 ? '删除' : '取消收藏' }}
			</view>
		</view>
	</view>
</template>

<script>
import { getCollectUserList, collectDel } from '@/api/store.js';
import { getBrowseList, delBrowse } from '@/api/user.js';
import { mapGetters } from "vuex";
import colors from '@/mixins/color.js';

export default {
	mixins: [colors],
	data() {
		return {
			activeTab: 0, // 当前活动标签: 0-浏览, 1-收藏
			isManage: false, // 是否处于管理模式
			
			// 浏览记录数据
			browseList: [],
			browsePage: 1,
			browseLimit: 10,
			browseLoading: false,
			browseLoadEnd: false,
			
			// 收藏数据
			collectList: [],
			collectPage: 1,
			collectLimit: 10,
			collectLoading: false,
			collectLoadEnd: false,
			
			// 选中状态
			isBrowseAllChecked: false,
			isCollectAllChecked: false,
		}
	},
	computed: {
		...mapGetters(['isLogin']),
		
		// 选中的浏览记录ID
		checkedBrowseIds() {
			return this.browseList
				.filter(item => item.checked)
				.map(item => item.id);
		},
		
		// 选中的收藏ID
		checkedCollectIds() {
			return this.collectList
				.filter(item => item.checked)
				.map(item => item.pid);
		}
	},
	onLoad() {
		// 加载数据
		this.loadBrowseList();
		this.loadCollectList();
	},
	methods: {
		// 返回上一页
		goBack() {
			uni.navigateBack({
				delta: 1
			});
		},
		
		// 切换标签
		changeTab(index) {
			this.activeTab = index;
		},
		
		// 滑动切换标签
		swiperChange(e) {
			this.activeTab = e.detail.current;
		},
		
		// 显示/隐藏管理模式
		showManage() {
			this.isManage = !this.isManage;
			
			// 退出管理模式时，清除所有选中状态
			if (!this.isManage) {
				this.resetCheckStatus();
			}
		},
		
		// 重置选中状态
		resetCheckStatus() {
			// 重置浏览记录选中状态
			this.browseList.forEach(item => {
				item.checked = false;
			});
			this.isBrowseAllChecked = false;
			
			// 重置收藏选中状态
			this.collectList.forEach(item => {
				item.checked = false;
			});
			this.isCollectAllChecked = false;
		},
		
		// 选中/取消选中单个项目
		checkItem(tabIndex, itemIndex) {
			if (tabIndex === 0) {
				// 浏览记录
				this.browseList[itemIndex].checked = !this.browseList[itemIndex].checked;
				
				// 更新全选状态
				this.isBrowseAllChecked = this.browseList.every(item => item.checked);
			} else {
				// 收藏
				this.collectList[itemIndex].checked = !this.collectList[itemIndex].checked;
				
				// 更新全选状态
				this.isCollectAllChecked = this.collectList.every(item => item.checked);
			}
		},
		
		// 全选/取消全选
		checkAll() {
			if (this.activeTab === 0) {
				// 浏览记录
				const newStatus = !this.isBrowseAllChecked;
				this.isBrowseAllChecked = newStatus;
				
				// 更新所有项的选中状态
				this.browseList.forEach(item => {
					item.checked = newStatus;
				});
			} else {
				// 收藏
				const newStatus = !this.isCollectAllChecked;
				this.isCollectAllChecked = newStatus;
				
				// 更新所有项的选中状态
				this.collectList.forEach(item => {
					item.checked = newStatus;
				});
			}
		},
		
		// 删除选中项
		deleteSelected() {
			if (this.activeTab === 0) {
				// 删除浏览记录
				const ids = this.checkedBrowseIds;
				if (ids.length === 0) {
					this.$util.Tips({
						title: '请选择要删除的记录'
					});
					return;
				}
				
				uni.showModal({
					title: '提示',
					content: '确定要删除选中的浏览记录吗？',
					success: res => {
						if (res.confirm) {
							delBrowse(ids).then(res => {
								this.$util.Tips({
									title: res.msg
								});
								
								// 重新加载浏览记录
								this.browseList = [];
								this.browsePage = 1;
								this.browseLoadEnd = false;
								this.loadBrowseList();
							});
						}
					}
				});
			} else {
				// 取消收藏
				const ids = this.checkedCollectIds;
				if (ids.length === 0) {
					this.$util.Tips({
						title: '请选择要取消收藏的商品'
					});
					return;
				}
				
				uni.showModal({
					title: '提示',
					content: '确定要取消收藏选中的商品吗？',
					success: res => {
						if (res.confirm) {
							collectDel(ids).then(res => {
								this.$util.Tips({
									title: res.msg
								});
								
								// 重新加载收藏列表
								this.collectList = [];
								this.collectPage = 1;
								this.collectLoadEnd = false;
								this.loadCollectList();
							});
						}
					}
				});
			}
		},
		
		// 加载更多
		loadMore(tabIndex) {
			if (tabIndex === 0) {
				// 加载更多浏览记录
				this.loadBrowseList();
			} else {
				// 加载更多收藏
				this.loadCollectList();
			}
		},
		
		// 加载浏览记录
		loadBrowseList() {
			if (this.browseLoading || this.browseLoadEnd) return;
			
			this.browseLoading = true;
			
			getBrowseList({
				page: this.browsePage,
				limit: this.browseLimit
			}).then(res => {
				this.browseLoading = false;
				
				const list = res.data.list;
				
				// 初始化选中状态
				list.forEach(item => {
					item.checked = false;
				});
				
				// 添加到列表
				this.browseList = [...this.browseList, ...list];
				
				// 判断是否加载完毕
				this.browseLoadEnd = list.length < this.browseLimit;
				
				// 页码自增
				this.browsePage++;
			}).catch(err => {
				this.browseLoading = false;
				this.$util.Tips({
					title: err.message || '加载失败'
				});
			});
		},
		
		// 加载收藏列表
		loadCollectList() {
			if (this.collectLoading || this.collectLoadEnd) return;
			
			this.collectLoading = true;
			
			getCollectUserList({
				page: this.collectPage,
				limit: this.collectLimit
			}).then(res => {
				this.collectLoading = false;
				
				const list = res.data.list;
				
				// 初始化选中状态
				list.forEach(item => {
					item.checked = false;
				});
				
				// 添加到列表
				this.collectList = [...this.collectList, ...list];
				
				// 判断是否加载完毕
				this.collectLoadEnd = list.length < this.collectLimit;
				
				// 页码自增
				this.collectPage++;
			}).catch(err => {
				this.collectLoading = false;
				this.$util.Tips({
					title: err.message || '加载失败'
				});
			});
		},
		
		// 跳转到商品详情
		goProductDetail(item) {
			if (!item.is_show) {
				this.$util.Tips({
					title: '该商品已下架'
				});
				return;
			}
			
			uni.navigateTo({
				url: `/pages/goods_details/index?id=${item.pid || item.product_id}`
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	background-color: #f5f5f5;
	min-height: 100vh;
	position: relative;
	padding-bottom: 50px;
}

.page-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 44px;
	background-color: #fff;
	padding: 0 15px;
	position: relative;
	
	.header-left {
		display: flex;
		align-items: center;
		
		.back-icon {
			width: 20px;
			height: 20px;
			margin-right: 5px;
		}
		
		.back-text {
			font-size: 16px;
			color: #333;
		}
	}
	
	.tab-container {
		display: flex;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		
		.tab-item {
			position: relative;
			padding: 0 15px;
			height: 44px;
			line-height: 44px;
			font-size: 16px;
			color: #666;
			
			&.active {
				color: #ff8c1b;
				font-weight: 500;
				
				&::after {
					content: '';
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
					width: 20px;
					height: 3px;
					background-color: #ff8c1b;
					border-radius: 2px;
				}
			}
		}
	}
	
	.header-right {
		font-size: 14px;
		color: #666;
	}
}

.swiper-content {
	height: calc(100vh - 44px - 50px); // 减去header和footer高度
	
	.swiper-item {
		height: 100%;
		
		.scroll-view {
			height: 100%;
		}
	}
}

.goods-list {
	padding: 10px;
	
	.goods-item {
		display: flex;
		background-color: #fff;
		border-radius: 8px;
		margin-bottom: 10px;
		padding: 10px;
		
		.checkbox-container {
			display: flex;
			align-items: center;
			margin-right: 10px;
		}
		
		.goods-image {
			position: relative;
			width: 80px;
			height: 80px;
			margin-right: 10px;
			flex-shrink: 0;
			
			image {
				width: 100%;
				height: 100%;
				border-radius: 4px;
			}
			
			.invalid-mask {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: rgba(0, 0, 0, 0.5);
				color: #fff;
				font-size: 14px;
				border-radius: 4px;
			}
		}
		
		.goods-info {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			
			.goods-name {
				font-size: 14px;
				color: #333;
				line-height: 1.4;
				margin-bottom: 5px;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
			
			.goods-price {
				font-size: 16px;
				color: #ff0000;
				font-weight: bold;
				margin-bottom: 5px;
			}
			
			.browse-time,
			.collect-time {
				font-size: 12px;
				color: #999;
			}
		}
	}
	
	.loading-more {
		text-align: center;
		padding: 15px 0;
		color: #999;
		font-size: 14px;
	}
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-top: 100px;
	
	.empty-image {
		width: 120px;
		height: 120px;
		margin-bottom: 20px;
	}
	
	.empty-text {
		font-size: 16px;
		color: #999;
	}
}

.footer {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 50px;
	background-color: #fff;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 15px;
	box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.05);
	
	.check-all {
		display: flex;
		align-items: center;
		
		text {
			margin-left: 5px;
			font-size: 14px;
			color: #333;
		}
	}
	
	.delete-btn {
		background-color: #ff8c1b;
		color: #fff;
		height: 34px;
		line-height: 34px;
		padding: 0 20px;
		border-radius: 17px;
		font-size: 14px;
	}
}
</style>
