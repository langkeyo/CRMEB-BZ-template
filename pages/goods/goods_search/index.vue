<template>
	<view class="wrapper" :style="colorStyle">
		<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scroll="scroll"
			@scrolltolower="scrollLower">
			<view class='searchGood'>
				<view class='search acea-row row-between-wrapper'>
					<view class='back-btn' style="width: 34rpx;
						height: 34rpx;" @tap='goBack'>
						<image src='../../../static/icons/back-arrow.svg' class='back-icon' style="width: 34rpx;
						height: 34rpx;background-color: #fff;backdrop-filter: blur(10rpx);"></image>
					</view>
					<view class='input acea-row row-between-wrapper'>
						<text class='iconfont icon-sousuo'></text>
						<input type='text' v-model='searchValue' @confirm="inputConfirm" focus
							:placeholder='$t(`搜索商品名称`)' placeholder-class='placeholder' @input="setValue"></input>
					</view>
					<view class='bnt' @tap='searchBut'>{{ $t(`搜索`) }}</view>
				</view>
				<template v-if="history.length">
					<view class='title acea-row row-between-wrapper'>
						<view>{{ $t(`搜索历史`) }}</view>
						<view class="iconfont icon-shanchu" @click="clear"></view>
					</view>
					<view class='list acea-row'>
						<block v-for="(item, index) in history" :key="index">
							<view class='item history-item line1' @tap='setHotSearchValue(item.keyword)'
								v-if="item.keyword">{{ item.keyword }}</view>
						</block>
					</view>
				</template>
				<view class='title'>{{ $t(`热门搜索`) }}</view>
				<view class='list acea-row'>
					<block v-for="(item, index) in hotSearchList" :key="index">
						<view class='item line1' @tap='setHotSearchValue(item.val)' v-if="item.val">{{ item.val }}
						</view>
					</block>
				</view>
				<view class='line' v-if='bastList.length'></view>
				<goodList :bastList="bastList" v-if="bastList.length > 0"></goodList>
				<view class='loadingicon acea-row row-center-wrapper' v-if="bastList.length > 0">
					<text class='loading iconfont icon-jiazai' :hidden='loading == false'></text>{{ loadTitle }}
				</view>
			</view>
			<view class='noCommodity'>
				<view class='pictrue' v-if="bastList.length == 0">
					<image :src="imgHost + '/statics/images/noSearch.png'"></image>
				</view>
				<recommend :hostProduct='hostProduct' v-if="bastList.length == 0 && page > 1"></recommend>
			</view>
		</scroll-view>

		<view v-if="scrollTopShow" class="back-top" @click="goTop">
			<text class="iconfont icon-xiangshang"></text>
		</view>
	</view>
</template>

<script>
import {
	getSearchKeyword,
	getProductslist,
	getProductHot
} from '@/api/store.js';
import {
	clearSearch
} from '@/api/api.js';
import { getGoodsList } from '@/api/group.js';
import goodList from '@/components/goodList';
import recommend from '@/components/recommend';

import colors from "@/mixins/color";
import {
	HTTP_REQUEST_URL
} from '@/config/app';
export default {
	components: {
		goodList,
		recommend
	},
	mixins: [colors],
	data() {
		return {
			imgHost: HTTP_REQUEST_URL,
			hostProduct: [],
			searchValue: '',
			focus: true,
			bastList: [],
			hotSearchList: [],
			first: 0,
			limit: 8,
			page: 1,
			loading: false,
			loadend: false,
			loadTitle: this.$t(`加载更多`),
			hotPage: 1,
			isScroll: true,
			history: [],
			scrollTop: 0,
			old: {
				scrollTop: 0
			},
			scrollTopShow: false
		};
	},
	onLoad(options) {
		// If keyword is passed in URL, set it as search value
		if (options && options.keyword) {
			this.searchValue = options.keyword;
			this.searchBut(); // Trigger search immediately
		}
	},
	onShow: function () {
		// this.getRoutineHotSearch();
		this.getHostProduct();
		// 移除searchList API调用
		try {
			this.hotSearchList = uni.getStorageSync('hotList');
		} catch (err) { }
	},
	// 滚动监听
	onPageScroll(e) {
		// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
		uni.$emit('scroll');
	},
	methods: {
		goBack: function () {
			uni.navigateBack({
				delta: 1
			});
		},
		scrollLower() {
			if (this.bastList.length > 0) {
				this.getProductList();
			} else {
				this.getHostProduct();
			}
		},
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
		// 移除searchList方法
		clear() {
			this.history = [];
			uni.showToast({
				title: this.$t('清除成功'),
				icon: 'success',
				duration: 2000
			});
		},
		inputConfirm: function (event) {
			if (event.detail.value) {
				uni.hideKeyboard();
				this.setHotSearchValue(event.detail.value);
			}
		},
		getRoutineHotSearch: function () {
			let that = this;
			getSearchKeyword().then(res => {
				that.$set(that, 'hotSearchList', res.data);
			});
		},
		getProductList: function () {
			let that = this;
			if (that.loadend) return;
			if (that.loading) return;
			that.loading = true;
			that.loadTitle = '';

			// 使用group.js中的getGoodsList函数进行搜索
			getGoodsList({
				search: that.searchValue.trim(),
				page: that.page,
				limit: that.limit
			}).then(res => {
				if (res.status === 200 && res.data) {
					let list = res.data.goodsList || [],
						loadend = list.length < that.limit;

					// 处理商品数据格式，确保与原有格式兼容
					const formattedList = list.map(item => ({
						id: item.id,
						image: that.setDomain(item.image), // 确保图片URL正确拼接域名
						price: item.min_price || item.price || '0.00',
						sales: item.total_sales || item.sales || item.fake_sales || 0,
						store_name: item.title || item.store_name,
						activity: item.activity || {}
					}));

					that.bastList = that.$util.SplitArray(formattedList, that.bastList);
					that.$set(that, 'bastList', that.bastList);
					that.loading = false;
					that.loadend = loadend;
					that.loadTitle = loadend ? that.$t(`没有更多内容啦~`) : that.$t(`加载更多`);
					that.page = that.page + 1;
				} else {
					that.loading = false;
					that.loadTitle = that.$t(`加载更多`);
				}
			}).catch(err => {
				that.loading = false;
				that.loadTitle = that.$t(`加载更多`);
			});
		},
		getHostProduct: function () {
			let that = this;
			if (!this.isScroll) return
			getProductHot(that.hotPage, that.limit).then(res => {
				that.isScroll = res.data.length >= that.limit
				that.hostProduct = that.hostProduct.concat(res.data)
				that.hotPage += 1;
			});
		},
		setHotSearchValue: function (event) {
			this.$set(this, 'searchValue', event);
			this.page = 1;
			this.loadend = false;
			this.$set(this, 'bastList', []);
			this.getProductList();
		},
		setValue: function (event) {
			this.$set(this, 'searchValue', event.detail.value);
		},
		searchBut: function () {
			let that = this;
			if (!that.searchValue.trim()) return this.$util.Tips({
				title: that.$t(`请输入要搜索的商品`)
			});
			that.focus = false;
			that.page = 1;
			that.loadend = false;
			that.$set(that, 'bastList', []);
			uni.showLoading({
				title: that.$t(`正在搜索中`)
			});
			that.getProductList();
			uni.hideLoading();
		},
		// 添加处理图片URL的方法
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

<style lang="scss">
page {
	background-color: #fff !important;
}

.scroll-Y {
	height: 100vh;
}

.wrapper {
	position: relative;
	max-height: 100vh;
	overflow: hidden;

	.back-top {
		position: absolute;
		right: 40rpx;
		bottom: 60rpx;
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1rpx solid #ccc;
		background-color: #fff;

		.icon-xiangshang {
			color: #ccc;
			font-weight: bold;
		}
	}
}

.noCommodity {
	border-top-width: 0;
}

.searchGood .search {
	padding-left: 20rpx;
	padding-top: 20rpx;

}

.searchGood .search .input {
	// width: 598rpx;
	width: 500rpx;
	background-color: #f7f7f7;
	border-radius: 33rpx;
	padding: 0 35rpx;
	box-sizing: border-box;
	height: 66rpx;
}

.searchGood .search .input input {
	// width: 472rpx;
	width: 374rpx;
	font-size: 28rpx;
}

.searchGood .search .input .placeholder {
	color: #999;
}

.searchGood .search .input .iconfont {
	color: #555;
	font-size: 35rpx;
}

.searchGood .search .bnt {
	width: 120rpx;
	text-align: center;
	height: 66rpx;
	line-height: 66rpx;
	font-size: 30rpx;
	color: #282828;
}

.searchGood .title {
	font-size: 28rpx;
	color: #999;
	margin: 50rpx 30rpx 25rpx 30rpx;
	display: none;
}

.searchGood .title .iconfont {
	font-size: 28rpx;
}

.searchGood .list {
	padding-left: 10rpx;
}

.searchGood .list .item {
	font-size: 26rpx;
	color: #454545;
	padding: 0 21rpx;
	height: 60rpx;
	border-radius: 3rpx;
	line-height: 60rpx;
	border: 1rpx solid #aaa;
	margin: 0 0 20rpx 20rpx;
}

.searchGood .list .item.history-item {
	height: 50rpx;
	border: none;
	border-radius: 25rpx;
	background-color: #F7F7F7;
	line-height: 50rpx;
}

.searchGood .line {
	border-bottom: 1rpx solid #eee;
	margin: 20rpx 30rpx 0 30rpx;
}
</style>
