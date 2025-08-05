<template>
	<view class="coupon-container" :style="colorStyle">
		<view class="custom-header">
			<view class="back-btn" @click="goBack"></view>
			<view class="header-title">我的优惠券</view>
		</view>
		<view class="navbar">
			<view class="item" :class="{ on: navOn === 0 }" @click="onNav(0)">未使用({{statusCounts.unused_count}})</view>
			<view class="item" :class="{ on: navOn === 1 }" @click="onNav(1)">已使用({{statusCounts.used_count}})</view>
			<view class="item" :class="{ on: navOn === 2 }" @click="onNav(2)">已失效({{statusCounts.expired_count}})</view>
		</view>
		<view class='coupon-list' v-if="couponsList.length">
			<view class='item' v-for='(item,index) in couponsList' :key="index">
				<view class="left-area">
					<view class="tag">{{item.usage_rules && item.usage_rules[0] ? item.usage_rules[0] : (item.type === 1 ? '满减券' : '折扣券')}}</view>
					<view class="money-row">
						<text class="money-symbol">￥</text><text class="money-num">{{item.discount_amount}}</text>
					</view>
					<view class="condition">满{{item.min_amount}}可用</view>
				</view>
				<view class="right-area">
					<view class="coupon-title">{{item.name}}</view>
					<view class="date-btn-row">
						<view class="coupon-date">有效期至{{item.expire_time}}</view>
						<view class="use-btn" v-if="navOn === 0 && item.can_use" @click.stop="useCoupon(item)">去使用</view>
						<view class="use-btn disabled" v-else-if="navOn === 1">已使用</view>
						<view class="use-btn disabled" v-else-if="navOn === 2">已失效</view>
					</view>
					<view class="bottom-row">
						<view class="desc" @click="toggleInfo(index)">
							使用说明
							<text class="arrow" :class="{ up: showInfoIndex === index }"></text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="showInfoIndex >= 0 && couponsList[showInfoIndex]" class="usage-rules-card">
			<view v-for="(rule, i) in (couponsList[showInfoIndex].usage_rules || (couponsList[showInfoIndex].description ? couponsList[showInfoIndex].description.split('\n') : []))" :key="i" class="desc-line">
				{{ i + 1 }}.{{ rule }}
			</view>
		</view>
		<view class='noCommodity' v-if="!couponsList.length && !loading">
			<view class='pictrue'>
				<image :src="imgHost + '/statics/images/noCoupon.png'"></image>
			</view>
			<view class="no-data-text">暂无优惠券数据</view>
		</view>
		<!-- #ifdef MP -->
		<!-- <authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize> -->
		<!-- #endif -->
		<!-- #ifndef MP -->
		<!-- <home></home> -->
		<!-- #endif -->
		
		<!-- 加载更多 -->
		<view class="loading-more" v-if="loadingStatus === 1 && couponsList.length > 0">
			<text>正在加载更多...</text>
		</view>
		<view class="loading-more" v-else-if="loadingStatus === 2 && couponsList.length >= limit">
			<text>已经到底了~</text>
		</view>
	</view>
</template>

<script>
	import { getMyCoupons, getOrderAvailableCoupons, receiveCoupon } from '@/api/group.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	// #ifdef MP
	import authorize from '@/components/Authorize';
	// #endif
	// import home from '@/components/home';
	import colors from '@/mixins/color.js';
	import {
		HTTP_REQUEST_URL
	} from '@/config/app';
	export default {
		components: {
			// #ifdef MP
			authorize,
			// #endif
			// home
		},
		mixins: [colors],
		data() {
			return {
				imgHost: HTTP_REQUEST_URL,
				couponsList: [
					{
						type: 1, // 满减券
						discount_amount: 10,
						discount_rate: 1,
						min_amount: 50,
						name: '新人10元优惠券',
						expire_time: '2025.05.01',
						can_use: true,
						status: 0,
						usage_rules: ['全品类通用', '使用期限2025.04.01-2025.04.30', '仅限于下单支付时使用', '优惠券不可兑换现金'],
						description: '全品类通用\n使用期限2025.04.01-2025.04.30\n仅限于下单支付时使用\n优惠券不可兑换现金',
						receive_time: '2024.05.01',
					}
				],
				loading: false,
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				navOn: 0,
				page: 1,
				limit: 15,
				finished: false,
				showInfoIndex: -1, // 显示使用说明的优惠券索引，-1表示不显示
				loadingStatus: 0, // 0: 不显示, 1: 加载中, 2: 已全部加载
				statusCounts: { // 各状态优惠券数量
					unused_count: 0,
					used_count: 0,
					expired_count: 0
				}
			};
		},
		computed: mapGetters(['isLogin']),
		watch: {
			isLogin: {
				handler: function(newV, oldV) {
					if (newV) {
						this.getMyCouponList();
					}
				},
				deep: true
			}
		},
		onLoad() {
			if (this.isLogin) {
				this.getMyCouponList();
			} else {
				toLogin();
			}
		},
		onReachBottom() {
			this.loadMoreCoupons();
		},
		methods: {
			showInfo(index) {
				this.showInfoIndex = index;
			},
			hideInfo() {
				this.showInfoIndex = -1;
			},
			onNav: function(type) {
				this.navOn = type;
				this.couponsList = [];
				this.page = 1;
				this.finished = false;
				this.loadingStatus = 0;
				this.getMyCouponList();
			},
			useCoupon(item) {
				if (item.status != 0) return;
				
				// 跳转到商品列表页面，可以使用该优惠券
				uni.switchTab({
					url: '/pages/goods/goods_list/index'
				});
			},
			/**
			 * 授权回调
			 */
			onLoadFun: function() {
				this.getMyCouponList();
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			/**
			 * 获取优惠券列表
			 */
			getMyCouponList: function() {
				let that = this;
				if (that.loading || that.finished) {
					return;
				}
				that.loading = true;
				that.loadingStatus = 1;
				uni.showLoading({
					title: that.$t(`正在加载…`)
				});
				
				// 使用API文档中的接口
				getMyCoupons({
					status: this.navOn, // 0-未使用，1-已使用，2-已过期
					page: this.page,
					limit: this.limit
				}).then(res => {
					that.loading = false;
					uni.hideLoading();
					
					if (res.status === 200) {
						const list = res.data.list || [];
						that.couponsList = that.couponsList.concat(list);
						that.finished = list.length < that.limit;
						that.loadingStatus = that.finished ? 2 : 0;
						that.page += 1;
						
						// 更新各状态优惠券数量
						if (res.data.unused_count !== undefined) {
							that.statusCounts = {
								unused_count: res.data.unused_count || 0,
								used_count: res.data.used_count || 0,
								expired_count: res.data.expired_count || 0
							};
						}
					} else {
						uni.showToast({
							title: res.msg || that.$t(`获取优惠券失败`),
							icon: 'none'
						});
						that.loadingStatus = 0;
					}
				}).catch(err => {
					that.loading = false;
					that.loadingStatus = 0;
					uni.hideLoading();
					uni.showToast({
						title: that.$t(`获取优惠券失败`),
						icon: 'none'
					});
				});
			},
			
			/**
			 * 加载更多优惠券
			 */
			loadMoreCoupons: function() {
				if (!this.finished && !this.loading) {
					this.getMyCouponList();
				}
			},
			goBack() {
				uni.navigateBack();
			},
			toggleInfo(index) {
				this.showInfoIndex = this.showInfoIndex === index ? -1 : index;
			}
		}
	};
</script>

<style lang="scss" scoped>
.coupon-container {
	min-height: 100vh;
	background: #f5f5f5;
	.custom-header {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100rpx;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		border-bottom: 1rpx solid #ededed;
		.back-btn {
			position: absolute;
			left: 30rpx;
			width: 26rpx;
			height: 26rpx;
			border-left: 4rpx solid #222;
			border-bottom: 4rpx solid #222;
			transform: rotate(45deg);
			top: 58%;
			margin-top: -20rpx;
			background: transparent;
		}
		.header-title {
			font-size: 36rpx;
			color: #222;
			font-weight: bold;
			text-align: center;
		}
	}
	.navbar {
		margin-top: 100rpx;
		display: flex;
		align-items: center;
		height: 90rpx;
		background: #fff;
		border-bottom: 1rpx solid #ededed;
		.item {
			flex: 1;
			text-align: center;
			font-size: 32rpx;
			color: #bdbdbd;
			font-weight: 500;
			position: relative;
			padding: 0 0 18rpx 0;
			&.on {
				color: #222;
				font-weight: bold;
				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 48rpx;
					height: 6rpx;
					background: #222;
					border-radius: 3rpx;
				}
			}
		}
	}
	.coupon-list {
		padding: 32rpx 0 0 0;
		.item {
			display: flex;
			background: #fff;
			border-radius: 16rpx;
			box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.06);
			margin: 0 24rpx 24rpx 24rpx;
			min-height: 240rpx; /* 进一步增加最小高度 */
			.left-area {
				width: 180rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between; /* 改为空间分布 */
				background: linear-gradient(180deg, #fff6f0 80%, #fff 100%);
				border-radius: 16rpx 0 0 16rpx;
				padding: 30rpx 0; /* 增加上下内边距 */
				box-sizing: border-box;
				height: 100%; /* 确保高度100% */
				.tag {
					width: 100%;
					background: #fff0ee;
					color: #ff3a30;
					font-size: 26rpx; /* 调整字体大小 */
					font-weight: bold;
					border-radius: 16rpx 0 0 0;
					padding: 16rpx 10rpx;
					text-align: center;
					box-sizing: border-box;
					margin-bottom: 0; /* 移除底部边距 */
					margin-top: 0;
				}
				.money-row {
					display: flex;
					align-items: flex-end;
					justify-content: center;
					width: 100%;
					margin: 0; /* 移除边距 */
					.money-symbol {
						color: #ff3a30;
						font-size: 40rpx;
						font-weight: bold;
						line-height: 1;
						margin-right: 2rpx;
					}
					.money-num {
						color: #ff3a30;
						font-size: 60rpx;
						font-weight: bold;
						line-height: 1;
					}
				}
				.condition {
					color: #ff3a30;
					font-size: 26rpx; /* 调整字体大小 */
					margin-top: 0; /* 移除顶部边距 */
					text-align: center;
					font-weight: 500;
					width: 100%;
					padding: 0 10rpx; /* 添加左右内边距 */
					box-sizing: border-box;
					white-space: nowrap; /* 防止换行 */
				}
			}
			.right-area {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				padding: 30rpx 24rpx;
				min-width: 0;
				.coupon-title {
					font-size: 28rpx;
					color: #222;
					font-weight: bold;
					margin-bottom: 16rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.date-btn-row {
					display: flex;
					align-items: center;
					margin-bottom: 16rpx;
					position: relative;
					.use-btn {
					transform: translateX(-15px);
					}
				}
				.coupon-date {
					font-size: 22rpx;
					color: #999;
					margin-bottom: 0;
				}
				.use-btn {
					position: absolute;
					right: 0;
					background: #ff3a30;
					color: #fff;
					border-radius: 32rpx;
					font-size: 24rpx;
					font-weight: 500;
					padding: 0 24rpx;
					height: 52rpx;
					line-height: 52rpx;
					margin-left: 40rpx; /* 20px右偏移 */
				}
				.bottom-row {
					display: flex;
					align-items: center;
					margin-top: auto;
					.desc {
						color: #bdbdbd;
						font-size: 22rpx;
						display: flex;
						align-items: center;
						cursor: pointer;
						.arrow {
							margin-left: 6rpx;
							display: inline-block;
							width: 16rpx;
							height: 16rpx;
							border: solid #bdbdbd;
							border-width: 0 3rpx 3rpx 0;
							transform: rotate(45deg);
							transition: transform 0.2s;
							&.up {
								transform: rotate(-135deg);
							}
						}
					}
				}
				.use-btn {
					background: #ff3a30;
					color: #fff;
					border-radius: 32rpx;
					font-size: 24rpx;
					font-weight: 500;
					padding: 0 24rpx;
					height: 52rpx;
					line-height: 52rpx;
					margin-left: 0;
				}
			}
		}
		
		.coupon-desc-detail {
			background: #fff;
			border-radius: 0 0 16rpx 16rpx;
			margin: 0 24rpx 24rpx 24rpx;
			box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.06);
			padding: 20rpx 24rpx;
			font-size: 22rpx;
			color: #999;
			line-height: 1.8;
			.desc-line {
				margin-bottom: 8rpx;
			}
		}
		
		.usage-rules-card {
			background: #fff;
			border-radius: 16rpx;
			margin: 0 24rpx 24rpx 24rpx;
			box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.02);
			padding: 24rpx;
			font-size: 22rpx;
			color: #cccccc;
			line-height: 1.7;
			text-align: left;
			
			/deep/ .desc-line,
			::v-deep .desc-line,
			>>> .desc-line {
				margin-bottom: 0;
				text-align: left;
				word-break: break-all;
			}
		}
	}
	.noCommodity {
		padding-top: 100rpx;
		text-align: center;
		
		.pictrue {
			width: 300rpx;
			height: 300rpx;
			margin: 0 auto;
			
			image {
				width: 100%;
				height: 100%;
			}
		}
		
		.no-data-text {
			padding: 30rpx 0;
			font-size: 28rpx;
			color: #999;
		}
	}
	
	.loading-more {
		text-align: center;
		padding: 20rpx 0;
		font-size: 28rpx;
		color: #999;
	}

	/* 移除优惠券使用说明弹窗样式 */
	
	/* 添加已禁用按钮样式 */
	.use-btn.disabled {
		background: #ccc;
		cursor: not-allowed;
	}
}

/* 使用说明卡片样式 - 重写 */
::v-deep .usage-rules-card {
  background-color: #ffffff !important;
  border-radius: 16rpx !important;
  margin: 0 24rpx 24rpx 24rpx !important;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.02) !important;
  padding: 24rpx !important;
}

::v-deep .usage-rules-card .desc-line {
  font-size: 22rpx !important;
  color: #cccccc !important;
  line-height: 1.7 !important;
  text-align: left !important;
  margin-bottom: 0 !important;
  word-break: break-all !important;
}
</style>