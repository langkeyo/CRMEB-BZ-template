<template>
	<view class="coupon-products" :style="colorStyle">
		<view class='productList'>
			<view class='search-container'>
				<view class='search-box'>
					<image class='search-icon' src='/static/images/coupon/search_icon.png'></image>
					<input :placeholder='$t(`搜索商品名称`)' placeholder-class='placeholder' confirm-type='search'
						name="search" :value='where.keyword' @confirm="searchSubmit"></input>
				</view>
			</view>

			<view class='coupon-time-bar'>
				<view class='time-text'>{{$t(`优惠券生效时间`)}}: 2025.05.18-2025.06.18</view>
			</view>
			
			<view class='nav acea-row row-middle'>
				<view class='item line1' :class='title ? "font-num":""' @click='set_where(1)'>
					{{title ? $t(title) : $t(`综合`)}}
				</view>
				<view class='item' :class="price ? 'active' : ''" @click='set_where(2)'>
					{{$t(`价格`)}}
					<view class="sort-arrows">
						<view class="arrow up" :class="{active: price==1}"></view>
						<view class="arrow down" :class="{active: price==2}"></view>
					</view>
				</view>
				<view class='item' :class="stock ? 'active' : ''" @click='set_where(3)'>
					{{$t(`销量`)}}
					<view class="sort-arrows">
						<view class="arrow up" :class="{active: stock==1}"></view>
						<view class="arrow down" :class="{active: stock==2}"></view>
					</view>
				</view>
				<view class='item' :class='nows ? "active":""' @click='set_where(4)'>{{$t(`新品`)}}</view>
			</view>
			<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scroll="scroll"
				@scrolltolower="scrolltolower">
				<view class='product-grid'>
					<view class='product-item' v-for="(item,index) in productList" :key="index" @click="godDetail(item)">
						<view class='product-image-container'>
							<image class='product-image' :src='item.image'></image>
							<view class="discount-tag" v-if="item.activity">
								<image class="tag-bg" src="/static/images/coupon/coupon_product_tag.png"></image>
								<text class="tag-text">{{item.activity && item.activity.type === '1' ? '秒杀' : item.activity.type === '2' ? '砍价' : '拼团'}}</text>
							</view>
						</view>
						<view class='product-info'>
							<view class='product-name'>{{item.store_name}}</view>
							<view class='price-container'>
								<view class='regular-price'>{{$t(`￥`)}}{{item.price}}</view>
								<view class='vip-price' v-if="item.vip_price && item.vip_price > 0">
									<text>{{$t(`￥`)}}{{item.vip_price}}</text>
									<image class="vip-icon" src='../../../static/images/vip.png'></image>
								</view>
							</view>
							<view class='sales-info'>{{$t(`已售`)}} {{item.sales}}{{$t(item.unit_name) || $t(`件`)}}</view>
						</view>
					</view>
				</view>
				<view class='loadingicon acea-row row-center-wrapper' v-if='productList.length > 0'>
					<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
				</view>

			</scroll-view>

		</view>
		<view class='noCommodity' v-if="productList.length==0 && where.page > 1">
			<view class='emptyBox'>
				<image :src="imgHost + '/statics/images/no-thing.png'"></image>
				<view class="tips">{{$t(`暂无可用优惠券商品`)}}</view>
			</view>
			<recommend :hostProduct="hostProduct"></recommend>
		</view>

		<view v-if="scrollTopShow" class="back-top" @click="goTop">
			<text class="iconfont icon-xiangshang"></text>
		</view>
	</view>
</template>

<script>

	import {
		getProductslist,
		getProductHot
	} from '@/api/store.js';
	import {
		getGroupGoodsList,
		getGroupGoodsCategory
	} from '@/api/group.js';
	import recommend from '@/components/recommend';
	import {
		mapGetters
	} from "vuex";
	import {
		goShopDetail
	} from '@/libs/order.js'
	import {
		HTTP_REQUEST_URL
	} from '@/config/app';
	import colors from '@/mixins/color.js';
	export default {
		computed: mapGetters(['uid']),
		components: {
			recommend
		},
		mixins: [colors],
		data() {
			return {
				imgHost: HTTP_REQUEST_URL,
				productList: [],
				is_switch: true,
				where: {
					sid: 0,
					keyword: '',
					priceOrder: '',
					salesOrder: '',
					news: 0,
					page: 1,
					limit: 20,
					cid: 0,
				},
				price: 0,
				stock: 0,
				nows: false,
				loadend: false,
				loading: false,
				loadTitle: this.$t(`加载更多`),
				title: '',
				hostProduct: [],
				hotPage: 1,
				hotLimit: 10,
				hotScroll: false,
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				scrollTopShow: false
			};
		},
		onLoad: function(options) {
			this.where.cid = options.cid || 0;
			this.where.coupon_category_id = options.coupon_category_id || '';
			this.$set(this.where, 'sid', options.sid || 0);
			this.title = options.title || '';
			this.$set(this.where, 'keyword', options.searchValue || '');
			this.$set(this.where, 'productId', options.productId || '');
			this.get_product_list();
		},
		methods: {
			scroll(e) {
				this.scrollTopShow = e.detail.scrollTop > 150
				this.old.scrollTop = e.detail.scrollTop
			},
			goTop(e) {
				// 解决view层不同步的问题
				this.scrollTop = this.old.scrollTop
				this.$nextTick(() => {
					this.scrollTop = 0
				});
			},
			// 去详情页
			godDetail(item) {
				goShopDetail(item, this.uid).then(res => {
					uni.navigateTo({
						url: `/pages/goods_details/index?id=${item.id}`
					})
				})
			},
			Changswitch: function() {
				let that = this;
				that.is_switch = !that.is_switch
			},
			searchSubmit: function(e) {
				let that = this;
				that.$set(that.where, 'keyword', e.detail.value);
				that.loadend = false;
				that.$set(that.where, 'page', 1)
				this.get_product_list(true);
			},
			/**
			 * 获取我的推荐
			 */
			get_host_product: function() {
				let that = this;
				if (that.hotScroll) return
				getProductHot(
					that.hotPage,
					that.hotLimit,
				).then(res => {
					that.hotPage++
					that.hotScroll = res.data.length < that.hotLimit
					that.hostProduct = that.hostProduct.concat(res.data)
					// that.$set(that, 'hostProduct', res.data)
				});
			},
			//点击事件处理
			set_where: function(e) {
				switch (e) {
					case 1:
						// #ifdef H5
						return history.back();
						// #endif
						// #ifndef H5
						return uni.navigateBack({
							delta: 1,
						})
						// #endif
						break;
					case 2:
						if (this.price == 0) this.price = 1;
						else if (this.price == 1) this.price = 2;
						else if (this.price == 2) this.price = 0;
						this.stock = 0;
						break;
					case 3:
						if (this.stock == 0) this.stock = 1;
						else if (this.stock == 1) this.stock = 2;
						else if (this.stock == 2) this.stock = 0;
						this.price = 0
						break;
					case 4:
						this.nows = !this.nows;
						break;
				}
				this.loadend = false;
				this.$set(this.where, 'page', 1);
				this.get_product_list(true);
			},
			//设置where条件
			setWhere: function() {
				if (this.price == 0) this.where.priceOrder = '';
				else if (this.price == 1) this.where.priceOrder = 'asc';
				else if (this.price == 2) this.where.priceOrder = 'desc';
				if (this.stock == 0) this.where.salesOrder = '';
				else if (this.stock == 1) this.where.salesOrder = 'asc';
				else if (this.stock == 2) this.where.salesOrder = 'desc';
				this.where.news = this.nows ? 1 : 0;
			},
			//查找产品
			get_product_list: function(isPage) {
				let that = this;
				that.setWhere();
				if (that.loadend) return;
				if (that.loading) return;
				if (isPage === true) that.$set(that, 'productList', []);
				that.loading = true;
				that.loadTitle = '';

				// 优先使用团购商品接口
				this.getGroupProductList(isPage).catch(() => {
					// 如果团购接口失败，回退到原有接口
					getProductslist(that.where).then(res => {
						let list = res.data;
						let productList = that.$util.SplitArray(list, that.productList);
						let loadend = list.length < that.where.limit;
						that.loadend = loadend;
						that.loading = false;
						that.loadTitle = loadend ? that.$t(`没有更多内容啦~`) : that.$t(`加载更多`);
						that.$set(that, 'productList', productList);
						that.$set(that.where, 'page', that.where.page + 1);
						if (!that.productList.length) this.get_host_product();
					}).catch(err => {
						that.loading = false;
						that.loadTitle = that.$t(`加载更多`);
					});
				});
			},

			// 获取团购商品列表
			getGroupProductList: function(isPage) {
				let that = this;
				return new Promise((resolve, reject) => {
					// 构建团购接口参数
					let groupParams = {
						page: that.where.page,
						limit: that.where.limit,
						cate_id: that.where.cid || '',
						search: that.where.keyword || '',
						sort: that.where.priceOrder ? 'price' : (that.where.salesOrder ? 'sales' : ''),
						sort_order: that.where.priceOrder || that.where.salesOrder || '',
						is_new: that.where.news ? '1' : '0'
					};

					getGroupGoodsList(groupParams).then(res => {
						if (res.status === 200 && res.data && res.data.goodsList) {
							let list = res.data.goodsList;
							let productList = that.$util.SplitArray(list, that.productList);
							let loadend = list.length < that.where.limit;
							that.loadend = loadend;
							that.loading = false;
							that.loadTitle = loadend ? that.$t(`没有更多内容啦~`) : that.$t(`加载更多`);
							that.$set(that, 'productList', productList);
							that.$set(that.where, 'page', that.where.page + 1);
							if (!that.productList.length) this.get_host_product();
							resolve(res);
						} else {
							reject(new Error('团购商品数据格式错误'));
						}
					}).catch(err => {
						console.log('团购商品接口调用失败:', err);
						reject(err);
					});
				});
			},
			scrolltolower() {
				if (this.productList.length > 0) {
					this.get_product_list();
					uni.$emit('scroll');
				} else {
					this.get_host_product();
					uni.$emit('scroll');
				}
			}
		},
		onPullDownRefresh() {},
		onReachBottom() {},
		// 滚动监听
		onPageScroll(e) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			uni.$emit('scroll');
		},
	}
</script>

<style scoped lang="scss">
	.scroll-Y {
		margin-top: 170rpx;
		height: calc(100vh - 170rpx);
		padding: 0 20rpx;
	}

	.coupon-products {
		position: relative;
		max-height: 100vh;
		overflow: hidden;
		background-color: #F7F7F7;

		.back-top {
			position: fixed;
			right: 40rpx;
			bottom: 60rpx;
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #fff;
			box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);

			.icon-xiangshang {
				color: #FC1F03;
				font-weight: bold;
				font-size: 28rpx;
			}
		}
	}

	.search-container {
		width: 100%;
		height: 90rpx;
		padding: 0 20rpx;
		background-color: #ffffff;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 10;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
	}

	.search-box {
		width: 100%;
		height: 70rpx;
		background-color: #F8F8F8;
		border-radius: 35rpx;
		padding: 0 30rpx;
		display: flex;
		align-items: center;
	}

	.search-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 20rpx;
	}

	.search-box input {
		flex: 1;
		height: 100%;
		font-size: 28rpx;
		color: #333;
	}

	.search-box .placeholder {
		color: #999;
		font-size: 28rpx;
	}

	.coupon-time-bar {
		position: fixed;
		top: 90rpx;
		left: 0;
		width: 100%;
		height: 60rpx;
		background-color: #FFFBEF;
		z-index: 9;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.time-text {
		font-size: 24rpx;
		color: #EB3C3C;
	}

	.nav {
		height: 80rpx;
		color: #333333;
		position: fixed;
		left: 0;
		width: 100%;
		font-size: 28rpx;
		background-color: #fff;
		top: 150rpx;
		z-index: 9;
		border-bottom: 1rpx solid #F5F5F5;
	}

	.nav .item {
		width: 25%;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.nav .item.active {
		color: #EB3C3C;
		font-weight: bold;
	}

	.sort-arrows {
		display: flex;
		flex-direction: column;
		margin-left: 10rpx;
		height: 20rpx;
	}

	.arrow {
		width: 0;
		height: 0;
		border-left: 8rpx solid transparent;
		border-right: 8rpx solid transparent;
	}

	.arrow.up {
		border-bottom: 10rpx solid #ccc;
		margin-bottom: 3rpx;
	}

	.arrow.down {
		border-top: 10rpx solid #ccc;
	}

	.arrow.active.up {
		border-bottom-color: #EB3C3C;
	}

	.arrow.active.down {
		border-top-color: #EB3C3C;
	}

	.product-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 20rpx 0;
	}

	.product-item {
		width: 48%;
		min-width: 320rpx;
		margin-bottom: 20rpx;
		background-color: #FFFFFF;
		border-radius: 12rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
	}

	.product-image-container {
		position: relative;
		width: 100%;
		height: 0;
		padding-bottom: 100%;
		overflow: hidden;
	}

	.product-image {
		position: absolute;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.discount-tag {
		position: absolute;
		top: 10rpx;
		left: 10rpx;
		width: 90rpx;
		height: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tag-bg {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}

	.tag-text {
		font-size: 20rpx;
		color: white;
		font-weight: bold;
		z-index: 1;
	}

	.product-info {
		padding: 20rpx;
	}

	.product-name {
		font-size: 28rpx;
		color: #333333;
		line-height: 1.4;
		height: 78rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.price-container {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		margin-top: 15rpx;
	}

	.regular-price {
		font-size: 30rpx;
		color: #EB3C3C;
		font-weight: bold;
	}

	.vip-price {
		display: flex;
		align-items: center;
		margin-left: 20rpx;
		font-size: 24rpx;
		color: #333333;
	}

	.vip-icon {
		width: 30rpx;
		height: 30rpx;
		margin-left: 6rpx;
	}

	.sales-info {
		font-size: 22rpx;
		color: #999999;
		margin-top: 10rpx;
	}

	.noCommodity {
		background-color: #F7F7F7;
		padding: 100rpx 0;

		.emptyBox {
			text-align: center;
			display: flex;
			flex-direction: column;
			align-items: center;

			.tips {
				color: #999999;
				font-size: 28rpx;
				margin-top: 30rpx;
			}

			image {
				width: 240rpx;
				height: 240rpx;
			}
		}
	}

	.loadingicon {
		height: 80rpx;
		padding: 20rpx 0;
		font-size: 26rpx;
		color: #999;
	}
</style>
