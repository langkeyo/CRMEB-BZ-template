<template>
	<view :style="colorStyle">
		<view class='collectionGoods' v-if="collectProductList.length">
			<view class="title-admin">
				<view>{{$t(`当前共`)}} <text class="text"> {{count}} </text> {{$t(`件商品`)}}</view>
				<view class="admin" @click="showRadio">{{checkbox_show?$t(`取消`):$t(`管理`)}}</view>
			</view>
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
							<!-- <view class='delete' @click.stop='delCollection(item.pid,index)'>删除</view> -->
						</view>
					</view>
				</view>
				<view class='loadingicon acea-row row-center-wrapper'>
					<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
				</view>
			</checkbox-group>
		</view>

		<view class='noCommodity' v-else-if="!collectProductList.length && page > 1">
			<view class='pictrue'>
				<image :src="imgHost + '/statics/images/noCollection.png'"></image>
			</view>
			<recommend :hostProduct="hostProduct"></recommend>
		</view>
		<view class='footer acea-row row-between-wrapper' v-if="checkbox_show && collectProductList.length">
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
		<!-- #ifdef MP -->
		<!-- <authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize> -->
		<!-- #endif -->
		<!-- #ifndef MP -->
		<home></home>
		<!-- #endif -->
	</view>
</template>

<script>
	import {
		getCollectList,
		deleteCollect
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
	import home from '@/components/home';
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
			home
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
			};
		},
		computed: mapGetters(['isLogin']),
		onLoad() {
			if (this.isLogin) {
				this.loadend = false;
				this.page = 1;
				this.collectProductList = [];
				this.getUserCollectProduct();
			} else {
				toLogin();
			}
		},
		onShow() {
			this.loadend = false;
			this.page = 1;
			this.$set(this, 'collectProductList', []);
			this.getUserCollectProduct();
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			this.getUserCollectProduct();
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
			subDel() {
				let that = this
				if (this.ids.length) {
					// 批量取消收藏
					const deletePromises = this.ids.map(id => {
						return deleteCollect({
							fav_id: id,
							type: '0' // 假设0是商品收藏类型
						});
					});
					
					Promise.all(deletePromises).then(() => {
						that.loadend = false;
						that.$util.Tips({
							title: that.$t(`取关成功`)
						});
						that.page = 1;
						that.collectProductList = [];
						that.getUserCollectProduct();
						that.ids = [];
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
					type: '0' // 假设0是商品收藏类型
				}).then(res => {
					that.collectProductList.splice(index, 1);
					that.count = that.collectProductList.length;
					that.$util.Tips({
						title: res.msg
					})
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
					type: '0', // 假设0是商品收藏类型
					page: that.page,
					limit: that.limit
				}).then(res => {
					if (res.code === 200) {
						let list = res.data.list || [];
						let productList = list.map(item => {
							return {
								pid: item.id || item.fav_id,
								id: item.id || item.fav_id,
								store_name: item.title || item.name,
								price: item.price || '0.00',
								image: item.image,
								is_show: item.is_show !== undefined ? item.is_show : true,
								checked: false
							}
						});
						
						let collectProductList = that.$util.SplitArray(productList, that.collectProductList);
						that.$set(that, 'collectProductList', collectProductList);
						that.count = res.data.count || collectProductList.length;
						that.loadend = list.length < that.limit;
						that.loadTitle = that.loadend ? that.$t(`我也是有底线的`) : that.$t(`加载更多`);
						that.page = that.page + 1;
						that.loading = false;
						
						if (!that.collectProductList.length && res.data.count) that.getUserCollectProduct();
					} else {
						that.loading = false;
						that.loadTitle = that.$t(`加载更多`);
						that.$util.Tips({
							title: res.msg
						});
					}
				}).catch(err => {
					that.loading = false;
					that.loadTitle = that.$t(`加载更多`);
					that.$util.Tips({
						title: that.$t(`网络错误`)
					});
				});
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
			}
		}
	};
</script>

<style scoped lang="scss">
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

	.title-admin {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		border-bottom: 1px solid #f2f2f2;

		.text {
			color: var(--view-theme);
		}

		.admin {
			color: var(--view-theme);
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
