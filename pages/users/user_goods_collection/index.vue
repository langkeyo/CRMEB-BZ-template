<template>
	<view :style="colorStyle">
		<!-- 顶部导航栏 -->
		<view class="page-header">
			<view class="header-left" @click="goBack">
				<image class="back-icon" src="/static/images/order/back_arrow.svg"></image>
				<text class="back-text">返回</text>
			</view>
			<view class="header-title">足迹/收藏</view>
			<view class="header-right" @click="showRadio">
				<text>{{checkbox_show ? '取消' : '编辑'}}</text>
			</view>
		</view>
		
		<!-- 选项卡 -->
		<view class="tabs">
			<view class="tab" :class="{active: activeTab === 'browse'}" @click="switchTab('browse')">
				<text>浏览</text>
				<view class="tab-line" v-if="activeTab === 'browse'"></view>
			</view>
			<view class="tab" :class="{active: activeTab === 'collect'}" @click="switchTab('collect')">
				<text>收藏</text>
				<view class="tab-line" v-if="activeTab === 'collect'"></view>
			</view>
		</view>
		
		<!-- 浏览记录内容 -->
		<view class="browse-content" v-if="activeTab === 'browse'">
			<!-- 按日期分组 -->
			<view class="date-group" v-for="(group, groupIndex) in groupedBrowseList" :key="groupIndex">
				<!-- 日期标题 -->
				<view class="date-title">
					<view class="date-dot" :style="{backgroundColor: '#e93323'}"></view>
					<text style="color: #FE8D00">{{group.date}}</text>
				</view>
				
				<!-- 商品列表 -->
				<view class="product-list">
					<view class="product-item" v-for="(item, index) in group.items" :key="index" @click="jump(item)">
						<image class="product-image" :src="item.image"></image>
						<view class="product-info">
							<view class="product-name">{{item.store_name}}</view>
							<view class="product-spec">{{item.spec || '单份' + item.store_name + '/40g'}}</view>
							<view class="product-price">¥ {{item.price}}</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 加载更多 -->
			<view class='loadingicon acea-row row-center-wrapper'>
				<text class='loading iconfont icon-jiazai' :hidden='browseLoading==false'></text>{{loadTitle}}
			</view>
		</view>
		
		<!-- 收藏内容 -->
		<view class="collect-content" v-if="activeTab === 'collect'">
			<!-- 广告区域已隐藏 -->
			
			<view class='collectionGoods' v-if="collectProductList.length">
				<checkbox-group @change.stop="checkboxChange">
					<view class='item acea-row' v-for="(item,index) in collectProductList" :key="index">
						<view class="left">
							<checkbox v-show="checkbox_show" :value="item.pid.toString()" :checked="item.checked" />
							<view class='pictrue' @click="jump(item)">
								<image :src="item.image"></image>
								<view class="invalid acea-row row-center-wrapper" v-if="!item.is_show">
									已下架
								</view>
							</view>
						</view>
						<view class='text acea-row row-column-between' @click="jump(item)">
							<view class='name line2'>{{item.store_name}}</view>
							<view class='acea-row row-between-wrapper'>
								<view class='money font-color'>{{$t(`￥`)}}{{item.price}}</view>
							</view>
						</view>
					</view>
				</checkbox-group>
				
				<!-- 加载更多 -->
				<view class='loadingicon acea-row row-center-wrapper'>
					<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
				</view>
			</view>
			
			<view class='noCommodity' v-if="!collectProductList.length && !loading && loadend">
				<view class='pictrue'>
					<image :src="imgHost + '/statics/images/noCollection.png'"></image>
				</view>
				<view class="empty-text">暂无收藏商品</view>
				<recommend :hostProduct="hostProduct"></recommend>
			</view>
		</view>
		
		<!-- 底部操作栏 -->
		<view class='footer acea-row row-between-wrapper' v-if="checkbox_show && collectProductList.length && activeTab === 'collect'">
			<view>
				<checkbox-group @change="checkboxAllChange">
					<checkbox value="all" :checked="!!isAllSelect" />
					<text class='checkAll'>{{$t(`全选`)}}({{ids.length}})</text>
				</checkbox-group>
			</view>
			<view class='button acea-row row-middle'>
				<button class='bnt' formType="submit" @click="subDel">{{$t(`取关`)}}</button>
			</view>
		</view>
		
		<!-- #ifndef MP -->
		<!-- 移除home组件 -->
		<!-- #endif -->
	</view>
</template>

<script>
	import {
		getCollectList,
		deleteCollect,
		batchCollect
	} from '@/api/group.js';
	import {
		getProductHot
	} from '@/api/store.js';
	import {
		mapGetters
	} from "vuex";
	import {
		toLogin
	} from '@/libs/login.js';
	import recommend from '@/components/recommend';
	// #ifdef MP
	import authorize from '@/components/Authorize';
	// #endif
	// 移除home组件导入
	import colors from '@/mixins/color.js';
	import {
		HTTP_REQUEST_URL
	} from '@/config/app';
	export default {
		components: {
			recommend,
			// #ifdef MP
			authorize,
			// #endif
			// 移除home组件注册
		},
		mixins: [colors],
		data() {
			return {
				imgHost: HTTP_REQUEST_URL,
				ids: [],
				hostProduct: [],
				checkbox_show: false,
				loadTitle: this.$t(`加载更多`),
				loading: false,
				loadend: false,
				collectProductList: [],
				count: 0,
				limit: 15,
				page: 1,
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				hotScroll: false,
				hotPage: 1,
				hotLimit: 10,
				isAllSelect: false, //全选
				activeTab: 'browse', // 当前激活的选项卡，默认显示浏览记录
				groupedBrowseList: [], // 按日期分组的浏览记录
				browseProductList: [], // 原始浏览记录
				browseLoading: false, // 浏览记录加载状态
				browseLoadend: false, // 浏览记录是否加载完毕
			};
		},
		computed: mapGetters(['isLogin']),
		created() {
			// 页面创建时初始化数据
			if (this.activeTab === 'browse') {
				this.getBrowseHistory();
			}
		},
		onLoad() {
			if (this.isLogin) {
				this.loadend = false;
				this.page = 1;
				
				// 默认显示收藏选项卡
				this.activeTab = 'collect';
				this.collectProductList = [];
				this.getUserCollectProduct();
			} else {
				toLogin();
			}
		},
		onShow() {
			this.loadend = false;
			this.page = 1;
			
			// 默认显示收藏选项卡
			this.activeTab = 'collect';
			this.$set(this, 'collectProductList', []);
			this.getUserCollectProduct();
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			if (this.activeTab === 'collect') {
				this.getUserCollectProduct();
			} else {
				// 浏览记录加载更多逻辑，这里暂时不实现
				// 实际项目中可以在这里添加分页加载浏览记录的逻辑
			}
		},
		methods: {
			showRadio() {
				this.checkbox_show = !this.checkbox_show
			},
			checkboxChange(e) {
				if (e.detail.value.length < this.ids.length) {
					this.$set(this, 'isAllSelect', false);
				} else if (e.detail.value.length === this.collectProductList.length) {
					this.$set(this, 'isAllSelect', true);
				}
				this.$set(this, 'ids', e.detail.value);
			},
			/**
			 * 批量取消收藏
			 */
			subDel() {
				let that = this;
				if (this.ids.length) {
					// 使用批量操作API
					batchCollect({
						action: 'del',
						items: this.ids.map(id => ({
							fav_id: id.toString(),
							type: '0' // 0表示商品收藏类型
						}))
					}).then(res => {
						if (res.status === 200) {
							that.loadend = false;
							that.$util.Tips({
								title: that.$t(`取关成功`)
							});
							that.page = 1;
							that.collectProductList = [];
							that.getUserCollectProduct();
							that.ids = [];
						} else {
							that.$util.Tips({
								title: res.msg || '操作失败'
							});
						}
					}).catch(err => {
						that.$util.Tips({
							title: that.$t(`操作失败`)
						});
					});
				} else {
					return that.$util.Tips({
						title: that.$t(`请选择商品`)
					});
				}
			},
			checkboxAllChange(event) {
				let value = event.detail.value;
				if (value.length > 0) {
					this.setAllSelectValue(1)
				} else {
					this.setAllSelectValue(0)
				}
			},
			setAllSelectValue(status) {
				let that = this;
				let selectValue = [];
				let valid = that.collectProductList;
				if (valid.length > 0) {
					let newValid = valid.map(item => {
						if (status) {
							item.checked = true;
							selectValue.push(item.pid || item.id);
							that.isAllSelect = true;
						} else {
							item.checked = false;
							that.isAllSelect = false;
						}
						return item;
					});
					that.$set(that, 'collectProductList', newValid);
					that.$set(that, 'ids', selectValue);
				}
			},
			jump(item) {
				if (item.is_show) {
					uni.navigateTo({
						url: "/pages/goods_details/index?id=" + (item.pid || item.id)
					})
				} else {
					this.$util.Tips({
						title: this.$t(`该商品已下架`)
					});
				}
			},
			/**
			 * 删除收藏
			 */
			delCollection(pid, index) {
				let that = this;
				deleteCollect({
					fav_id: pid.toString(),
					type: '0' // 0表示商品收藏类型
				}).then(res => {
					if (res.status === 200) {
						that.collectProductList.splice(index, 1);
						that.count = that.collectProductList.length;
						that.$util.Tips({
							title: res.msg || '取消收藏成功'
						});
					} else {
						that.$util.Tips({
							title: res.msg || '取消收藏失败'
						});
					}
				}).catch(err => {
					that.$util.Tips({
						title: '操作失败，请稍后重试'
					});
				});
			},
			/**
			 * 获取收藏产品
			 */
			getUserCollectProduct: function() {
				let that = this;
				if (that.loading) return;
				if (that.loadend) return;
				that.loading = true;
				that.loadTitle = '';
				
				getCollectList({
					type: '0', // 0表示商品收藏类型
					page: that.page,
					limit: that.limit
				}).then(res => {
					that.loading = false;
					
					// 处理成功响应
					if (res.status === 200) {
						// 检查是否有数据
						if (!res.data || !res.data.list || res.data.list.length === 0) {
							// 没有数据，显示空状态
							if (that.page === 1) {
								that.collectProductList = [];
								that.get_host_product();
							}
							that.loadend = true;
							that.loadTitle = that.$t(`我也是有底线的`);
							return;
						}
						
						// 处理商品数据
						let list = res.data.list;
						let productList = list.map(item => {
							return {
								pid: item.fav_id,
								id: item.fav_id,
								store_name: item.item_info?.title || item.item_info?.name || '未知商品',
								price: item.item_info?.price || '0.00',
								image: item.item_info?.image || '',
								is_show: item.item_info?.is_available !== undefined ? item.item_info.is_available : true,
								checked: false
							};
						});
						
						let collectProductList = that.$util.SplitArray(productList, that.collectProductList);
						that.$set(that, 'collectProductList', collectProductList);
						that.count = res.data.count || collectProductList.length;
						that.loadend = list.length < that.limit;
						that.loadTitle = that.loadend ? that.$t(`我也是有底线的`) : that.$t(`加载更多`);
						that.page = that.page + 1;
					} else {
						// 处理错误响应
						that.handleErrorResponse(res);
					}
				}).catch(err => {
					that.loading = false;

					// 处理复杂的嵌套错误响应格式
					let errorStatus = null;
					let errorMsg = '';

					if (err && typeof err === 'object') {
						// 优先检查 data 对象中的状态码和消息（这是实际的业务错误信息）
						if (err.data && typeof err.data === 'object') {
							if (err.data.status !== undefined) {
								errorStatus = err.data.status;
								errorMsg = err.data.msg || err.data.message || '';
							}
						}

						// 如果 data 中没有找到，再检查顶层的状态码
						if (errorStatus === null && err.status !== undefined) {
							errorStatus = err.status;
							errorMsg = err.msg || err.message || '';
						}

						// 如果都没有状态码，但有错误消息，使用错误消息
						if (errorStatus === null && (err.msg || err.message)) {
							errorMsg = err.msg || err.message;
						}
					}

					// 处理特定的错误状态码
					if (errorStatus === 400) {
						// 处理"暂无收藏数据"的情况 - 这是正常的业务状态，不是真正的错误
						that.handleEmptyData(errorMsg || '暂无收藏数据');
						return;
					} else if (errorStatus === 110002) {
						// 处理登录失效的情况
						setTimeout(() => {
							toLogin();
						}, 1500);
						return;
					}

					// 其他错误的处理
					that.loadTitle = that.$t(`加载更多`);
					that.$util.Tips({
						title: errorMsg || that.$t(`网络错误`)
					});

					// 在网络错误时，如果是第一页，显示空状态
					if (that.page === 1) {
						that.collectProductList = [];
						that.get_host_product();
					}
				});
			},

			// 处理错误响应
			handleErrorResponse(res) {
				if (res.status === 400 || (res.data && res.data.status === 400)) {
					const errorMsg = res.msg || (res.data && res.data.msg) || '暂无收藏数据';
					this.handleEmptyData(errorMsg);
				} else {
					this.loadTitle = this.$t(`加载更多`);
					this.$util.Tips({
						title: res.msg || '获取收藏列表失败'
					});
				}
			},

			// 处理空数据
			handleEmptyData(msg) {
				this.loadend = true;
				this.loadTitle = this.$t(`我也是有底线的`);

				if (this.page === 1) {
					this.collectProductList = [];
					// 对于"暂无收藏数据"这种正常的业务状态，不显示错误提示
					// 页面会自然显示空状态和推荐商品
					this.get_host_product();
				}
			},
			/**
			 * 获取我的推荐
			 */
			get_host_product: function() {
				let that = this;
				if (that.hotScroll) return;
				getProductHot(
					that.hotPage,
					that.hotLimit,
				).then(res => {
					that.hotPage++
					that.hotScroll = res.data.length < that.hotLimit
					that.hostProduct = that.hostProduct.concat(res.data)
				});
			},
			/**
			 * 授权回调
			 */
			onLoadFun: function() {
				this.getUserCollectProduct();
				this.get_host_product();
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			goBack() {
				uni.navigateBack();
			},
			switchTab(tab) {
				this.activeTab = tab;
				this.page = 1; // 切换选项卡时重置页码
				
				if (tab === 'browse') {
					// 切换到浏览记录时获取浏览记录
					this.getBrowseHistory();
				} else {
					// 切换到收藏时获取收藏列表
					this.collectProductList = []; // 切换选项卡时清空收藏列表
					this.getUserCollectProduct();
				}
			},
			// 获取真实的浏览历史记录
			getBrowseHistory() {
				// 浏览历史功能暂未实现，显示空状态
				this.groupedBrowseList = [];
				this.browseLoading = false;
				this.browseLoadend = true;
				this.loadTitle = this.$t(`我也是有底线的`);
			}
		}
	};
</script>

<style scoped lang="scss">
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 30rpx;
		background-color: #fff;
		border-bottom: none;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 99;
	}

	.header-left, .header-right {
		display: flex;
		align-items: center;
	}

	.back-icon {
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
	}

	.back-text {
		font-size: 32rpx;
		color: #333;
	}

	.header-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}

	.tabs {
		display: flex;
		justify-content: space-around;
		background-color: #fff;
		border-bottom: 1px solid #ededed;
		position: fixed;
		top: 96rpx;
		left: 0;
		width: 100%;
		z-index: 98;
	}

	.tab {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		padding: 20rpx 0 10rpx 0;
	}

	.tab.active .tab-line {
		width: 40rpx;
		height: 4rpx;
		background-color: #FE8D00;
		border-radius: 2rpx;
		margin-top: 10rpx;
	}

	.tab text {
		font-size: 32rpx;
		color: #222;
	}

	.tab.active text {
		color: #222;
		font-weight: bold;
	}

	/* 页面背景色 */
	.browse-content, .collect-content {
		padding-top: 184rpx;
		padding-bottom: 100rpx;
		background-color: #f7f8fa;
	}

	/* 广告区域样式 */
	.ad-container {
		padding: 20rpx 30rpx;
	}

	.ad-card {
		display: flex;
		align-items: center;
		background-color: #fff;
		padding: 20rpx;
	}

	.ad-left {
		margin-right: 20rpx;
	}

	.ad-logo {
		width: 100rpx;
		height: 100rpx;
		border-radius: 10rpx;
	}

	.ad-info {
		flex: 1;
	}

	.ad-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 5rpx;
	}

	.ad-subtitle, .ad-desc, .ad-status {
		font-size: 24rpx;
		color: #999;
		margin-bottom: 5rpx;
	}

	.ad-action {
		display: flex;
		align-items: center;
	}

	.ad-button {
		background-color: #ff7900;
		color: #fff;
		font-size: 28rpx;
		padding: 10rpx 30rpx;
		border-radius: 30rpx;
	}

	/* 日期分组 */
	.date-group {
		margin-bottom: 0;
		background-color: transparent;
	}
	.date-title {
		display: flex;
		align-items: center;
		padding: 0 0 0 16rpx;
		height: 50rpx;
		background-color: transparent;
		font-size: 24rpx;
		color: #FE8D00;
		line-height: 50rpx;
		margin-top: 10rpx;
	}
	.date-dot {
		width: 8rpx;
		height: 8rpx;
		background-color: #FE8D00;
		border-radius: 50%;
		margin-right: 8rpx;
	}
	.date-title text {
		font-size: 24rpx;
		font-weight: 400;
		color: #FE8D00;
	}

	/* 商品卡片 */
	.product-list {
		padding: 0;
	}
	.product-item {
		display: flex;
		align-items: center;
		margin: 0 16rpx 16rpx 16rpx;
		// background: #fff;
		border-radius: 16rpx;
		// border: 1px solid #f0f0f0;
		box-shadow: none;
		padding: 16rpx;
	}
	.product-image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 8rpx;
		margin-right: 16rpx;
		object-fit: cover;
		background: #f5f5f5;
	}
	.product-info {
		flex: 1;
		padding: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 136rpx;
	}
	.product-name {
		font-size: 28rpx;
		color: #222;
		font-weight: 600;
		margin-bottom: 6rpx;
		line-height: 1.3;
	}
	.product-spec {
		font-size: 22rpx;
		color: #b2b2b2;
		margin-bottom: 6rpx;
		line-height: 1.3;
	}
	.product-price {
		font-size: 30rpx;
		color: #222;
		font-weight: bold;
		margin-top: 6rpx;
	}

	.collectionGoods {
		background-color: #fff;
		border-top: 1rpx solid #eee;
	}

	.collectionGoods .item {
		margin-left: 30rpx;
		border-bottom: 1rpx solid #eee;
		height: 180rpx;
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
	}

	.left {
		display: flex;
		align-items: center;
		margin-right: 20rpx;
	}

	.collectionGoods .item .pictrue {
		width: 130rpx;
		height: 130rpx;
		margin-left: 20rpx;
		position: relative;

		.invalid {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			background-color: rgba(0, 0, 0, 0.4);
			backdrop-filter: blur(3px);
			color: #fff;
		}

	}

	.collectionGoods .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 6rpx;
	}

	.collectionGoods .item .text {
		height: 130rpx;
		flex: 1;
		font-size: 28rpx;
		color: #282828;
		padding-right: 20rpx;
	}

	.collectionGoods .item .text .name {
		width: max-contnet;
	}

	.collectionGoods .item .text .money {
		font-size: 26rpx;
	}

	.collectionGoods .item .text .delete {
		font-size: 26rpx;
		color: #282828;
		width: 144rpx;
		height: 46rpx;
		border: 1px solid #bbb;
		border-radius: 4rpx;
		text-align: center;
		line-height: 46rpx;
	}

	.noCommodity {
		background-color: #fff;
		padding-top: 1rpx;
		border-top: 0;
	}

	.noCommodity {
		background-color: #fff;
		padding-top: 1rpx;
		border-top: 0;
		
		.pictrue {
			width: 414rpx;
			height: 336rpx;
			margin: 30rpx auto 50rpx auto;
			
			image {
				width: 100%;
				height: 100%;
			}
		}
		
		.empty-text {
			text-align: center;
			font-size: 28rpx;
			color: #999;
			margin-bottom: 50rpx;
		}
	}

	.footer {
		z-index: 999;
		width: 100%;
		height: 96rpx;
		background-color: #fafafa;
		position: fixed;
		padding: 0 30rpx;
		box-sizing: border-box;
		border-top: 1rpx solid #eee;
		bottom: 0;
	}

	.footer.on {
		// #ifndef H5
		bottom: 0rpx;
		// #endif
		// #ifdef MP || APP-PLUS
		bottom: 100rpx;
		bottom: calc(100rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		bottom: calc(100rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		// #endif
	}

	.footer .checkAll {
		font-size: 28rpx;
		color: #282828;
		margin-left: 16rpx;
	}

	// .shoppingCart .footer checkbox .wx-checkbox-input{background-color:#fafafa;}
	.footer .money {
		font-size: 30rpx;
	}

	.footer .placeOrder {
		color: #fff;
		font-size: 30rpx;
		width: 226rpx;
		height: 70rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 70rpx;
		margin-left: 22rpx;
	}

	.footer .button .bnt {
		font-size: 28rpx;
		color: #999;
		border-radius: 50rpx;
		border: 1px solid #999;
		width: 160rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
	}

	.footer .button form~form {
		margin-left: 17rpx;
	}
</style>
