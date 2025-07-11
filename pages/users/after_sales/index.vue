<template>
	<view :style="colorStyle">
		<view class="top-tabs">
			<view class="tabs" :class="{ btborder: type === index }" v-for="(item, index) in tabsList" :key="index"
				@tap="changeTabs(index)">
				{{ item.name }}
			</view>
		</view>
		<view class='after-sales-list' v-if="orderList.length">
			<view class='goodWrapper' v-for="(item, index) in orderList" :key="index"
				@click='goOrderDetails(item.order_id)'>
				<view class='store-name'>
					<text>{{ item.store_name }}</text>
					<text class="status" :class="{ 'status-pending': item.refund_type == 1 || item.refund_type == 2 }">
						{{ item.refund_type == 1 || item.refund_type == 2 ? $t(`售后申请中`) : $t(`售后完成`) }}
					</text>
				</view>
				<view class='item acea-row row-between-wrapper' v-for="(items, index) in item.cart_info" :key="index">
					<view class='pictrue'>
						<image
							:src='items.productInfo.attrInfo ? items.productInfo.attrInfo.image : items.productInfo.image'>
						</image>
					</view>
					<view class='text'>
						<view class='acea-row row-between-wrapper'>
							<view class='name line1'>{{ items.productInfo.store_name }}</view>
							<view class='num'>x {{ items.cart_num }}</view>
						</view>
						<view class='attr line1' v-if="items.productInfo.attrInfo">{{ items.productInfo.attrInfo.suk }}
						</view>
						<view class='attr line1' v-else>{{ items.productInfo.store_name }}</view>
						<view class='money'>
							{{ $t(`共`) }} {{ item.refund_num || 1 }} {{ $t(`件商品`) }}
						</view>
					</view>
				</view>
				<view class='totalSum'>
					<text>{{ $t(`退款`) }}：</text>
					<text class='font-color price'>{{ $t(`￥`) }}{{ item.refund_price }}</text>
					<view class="detail-btn" @click.stop="goOrderDetails(item.order_id)">{{ $t(`查看详情`) }}</view>
				</view>
			</view>
		</view>
		<view class='loadingicon acea-row row-center-wrapper' v-if="orderList.length > 0">
			<text class='loading iconfont icon-jiazai' :hidden='loading == false'></text>{{ loadTitle }}
		</view>
		<view v-if="orderList.length == 0 && !loading">
			<emptyPage :title="$t(`您还没有订单哦~`)"></emptyPage>
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
import home from '@/components/home'
import emptyPage from '@/components/emptyPage'
import {
	getNewOrderList
} from '@/api/order.js'
import {
	toLogin
} from '@/libs/login.js'
import {
	mapGetters
} from "vuex"
// #ifdef MP
import authorize from '@/components/Authorize'
// #endif
import colors from '@/mixins/color.js'
export default {
	components: {
		home,
		emptyPage,
		// #ifdef MP
		authorize
		// #endif
	},
	mixins: [colors],
	data () {
		return {
			type: 0,
			loading: false,
			loadend: false,
			loadTitle: this.$t(`加载更多`), //提示语
			orderList: [], //订单数组
			orderStatus: -3, //订单状态
			page: 1,
			limit: 20,
			isAuto: false, //没有授权的不会自动授权
			isShowAuth: false, //是否隐藏授权
			tabsList: [{
				key: 0,
				name: this.$t(`全部`)
			},
			{
				key: 1,
				name: this.$t(`申请中`)
			},
			{
				key: 2,
				name: this.$t(`已完成`)
			}
			]
		}
	},
	computed: mapGetters(['isLogin']),
	watch: {
		isLogin: {
			handler: function (newV, oldV) {
				if (newV) {
					this.getOrderList()
				}
			},
			deep: true
		}
	},
	onLoad () {
		if (this.isLogin) {
			this.getOrderList()
		} else {
			toLogin()
		}
	},
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		this.getOrderList()
	},
	methods: {
		onLoadFun () {
			this.getOrderList()
		},
		// 授权关闭
		authColse: function (e) {
			this.isShowAuth = e
		},
		/**
		 * 去订单详情
		 */
		goOrderDetails: function (order_id) {
			if (!order_id) return this.$util.Tips({
				title: this.$t(`缺少订单号无法查看订单详情`)
			})
			uni.navigateTo({
				url: '/pages/users/after_sales/detail?order_id=' + order_id
			})
		},
		changeTabs (index) {
			this.type = index
			this.loadend = false
			this.page = 1
			this.limit = 20
			this.orderList = []
			this.getOrderList(index)
		},
		/**
		 * 获取订单列表
		 */
		getOrderList (type) {
			let that = this
			if (that.loading) return
			if (that.loadend) return
			that.loading = true
			that.loadTitle = that.$t(`加载中...`)

			// 显示加载提示
			uni.showLoading({
				title: that.$t(`加载中`)
			})

			getNewOrderList({
				page: that.page,
				limit: that.limit,
				refund_status: type ? type : that.type
			}).then(res => {
				let list = res.data.list || []
				let loadend = list.length < that.limit
				that.orderList = that.orderList.concat(list)
				that.$set(that, 'orderList', that.orderList)
				that.loadend = loadend
				that.loading = false
				that.loadTitle = loadend ? that.$t(`我也是有底线的`) : that.$t(`加载更多`)
				that.page = that.page + 1

				// 隐藏加载提示
				uni.hideLoading()
			}).catch(err => {
				that.loading = false
				that.loadTitle = that.$t(`加载更多`)

				// 隐藏加载提示
				uni.hideLoading()

				// 显示错误提示
				that.$util.Tips({
					title: err || that.$t(`加载失败，请稍后重试`),
					icon: 'none'
				})
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.after-sales-list .goodWrapper {
	background-color: #fff;
	margin-top: 13rpx;
	position: relative;
	padding: 30rpx;
}

.after-sales-list .goodWrapper .store-name {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 30rpx;
	color: #282828;
	margin-bottom: 20rpx;
}

.after-sales-list .goodWrapper .store-name .status {
	font-size: 26rpx;
	color: #999;
}

.after-sales-list .goodWrapper .store-name .status-pending {
	color: var(--view-theme);
}

.after-sales-list .goodWrapper .item {
	border-bottom: 0;
	padding: 0;
	margin-bottom: 20rpx;
}

.after-sales-list .goodWrapper .item .pictrue {
	width: 160rpx;
	height: 160rpx;
}

.after-sales-list .goodWrapper .item .pictrue image {
	width: 100%;
	height: 100%;
	border-radius: 6rpx;
}

.after-sales-list .goodWrapper .item .text {
	width: 460rpx;
	position: relative;
}

.after-sales-list .goodWrapper .item .text .name {
	font-size: 28rpx;
	color: #282828;
	width: 360rpx;
}

.after-sales-list .goodWrapper .item .text .num {
	font-size: 26rpx;
	color: #999;
}

.after-sales-list .goodWrapper .item .text .attr {
	font-size: 24rpx;
	color: #999;
	margin-top: 10rpx;
}

.after-sales-list .goodWrapper .item .text .money {
	font-size: 26rpx;
	color: #999;
	margin-top: 10rpx;
}

.after-sales-list .goodWrapper .totalSum {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	font-size: 26rpx;
	color: #282828;
	margin-top: 20rpx;
}

.after-sales-list .goodWrapper .totalSum .price {
	font-size: 28rpx;
	font-weight: bold;
	margin-right: 30rpx;
}

.after-sales-list .goodWrapper .totalSum .detail-btn {
	padding: 10rpx 30rpx;
	background-color: #f7f7f7;
	border-radius: 30rpx;
	font-size: 24rpx;
	color: #666;
}

.top-tabs {
	display: flex;
	justify-content: space-around;
	align-items: center;
	height: 80rpx;
	background-color: #fff;
}

.top-tabs .tabs {
	position: relative;
	height: 100%;
	padding: 12px 0;
}

.btborder {
	&::after {
		position: absolute;
		content: ' ';
		width: 39px;
		height: 2px;
		background-color: var(--view-theme);
		bottom: 2px;
		left: 50%;
		margin-left: -19px;
	}
}
</style>
