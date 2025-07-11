<template>
	<view class="coupon-container" :style="colorStyle">
		<view class="navbar acea-row row-around">
			<view class="item acea-row row-center-wrapper" :class="{ on: navOn === 0 }" @click="onNav(0)">{{$t(`未使用`)}}
			</view>
			<view class="item acea-row row-center-wrapper" :class="{ on: navOn === 1 }" @click="onNav(1)">
				{{$t(`已使用`)}}
			</view>
			<view class="item acea-row row-center-wrapper" :class="{ on: navOn === 2 }" @click="onNav(2)">
				{{$t(`已过期`)}}
			</view>
		</view>
		<view class='coupon-list' v-if="couponsList.length">
			<view class='item' v-for='(item,index) in couponsList' :key="index"
				:class="{svip: item.receive_type === 4, expired: item.status == 2}" @click="useCoupon(item)">
				<image class="coupon-bg" :src="item.status == 2 ? '/static/common/backgrounds/cards/coupon_bg.png' : '/static/common/backgrounds/cards/coupon_bg.png'"></image>
				<view class="coupon-content">
					<view class="moneyCon">
						<view class='money' :class='item.status == 2 ? "moneyGray" : ""'>
							<view class="price-box" v-if="item.type === 1">{{$t(`￥`)}}<text class='num'>{{item.discount_amount}}</text></view>
							<view class="price-box" v-else-if="item.type === 2"><text class='num'>{{item.discount_rate * 10}}</text>{{$t(`折`)}}</view>
							<view class="pic-num" v-if="item.min_amount > 0">
								{{$t(`满`)}}{{item.min_amount}}{{$t(`元可用`)}}
							</view>
							<view class="pic-num" v-else>{{$t(`无门槛券`)}}</view>
						</view>
					</view>
					<view class='text'>
						<view class='condition'>
							<view class="name line2">
								<view class="line-title" :class="item.status === 2 ? 'bg-color-huic' : 'bg-color-check'"
									v-if="item.type === 1">{{$t(`满减券`)}}</view>
								<view class="line-title" :class="item.status === 2 ? 'bg-color-huic' : 'bg-color-check'"
									v-else>{{$t(`折扣券`)}}</view>
								<text class="coupon-title">{{$t(item.name)}}</text>
							</view>
						</view>
						<view class='data'>
							<view class="date-info">{{item.start_time}} ~ {{item.end_time}}</view>
							<view class='bnt gray' v-if="item.status == 2">{{$t('已过期')}}</view>
							<view class='bnt gray' v-else-if="item.status == 1">{{$t('已使用')}}</view>
							<view class='bnt bg-color' v-else>{{$t('立即使用')}}</view>
						</view>
						<view class="coupon-info" v-if="showInfoIndex === index">
							<image class="info-bg" src="/static/common/backgrounds/cards/coupon_bg.png"></image>
							<view class="info-content">
								<view class="info-title">使用说明</view>
								<view class="info-text">
									<view v-if="item.type === 1">满{{item.min_amount}}元减{{item.discount_amount}}元</view>
									<view v-else-if="item.type === 2">满{{item.min_amount}}元打{{item.discount_rate * 10}}折</view>
									<view>有效期：{{item.start_time}} ~ {{item.end_time}}</view>
								</view>
							</view>
							<view class="info-close" @click.stop="hideInfo">×</view>
						</view>
						<view class="show-info-btn" @click.stop="showInfo(index)">使用说明</view>
					</view>
				</view>
			</view>
		</view>
		<view class='noCommodity' v-if="!couponsList.length && page > 1">
			<view class='pictrue'>
				<image :src="imgHost + '/statics/images/noCoupon.png'"></image>
			</view>
			<view class="no-data-text">暂无优惠券数据</view>
		</view>
		<!-- #ifdef MP -->
		<!-- <authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize> -->
		<!-- #endif -->
		<!-- #ifndef MP -->
		<home></home>
		<!-- #endif -->
		
		<!-- 加载更多 -->
		<view class="loading-more" v-if="loadingStatus === 1">
			<text>正在加载更多...</text>
		</view>
		<view class="loading-more" v-else-if="loadingStatus === 2">
			<text>已经到底了~</text>
		</view>
	</view>
</template>

<script>
	import { getMyCoupons } from '@/api/group.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
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
			// #ifdef MP
			authorize,
			// #endif
			home
		},
		mixins: [colors],
		data() {
			return {
				imgHost: HTTP_REQUEST_URL,
				couponsList: [],
				loading: false,
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				navOn: 0,
				page: 1,
				limit: 15,
				finished: false,
				showInfoIndex: -1, // 显示使用说明的优惠券索引，-1表示不显示
				loadingStatus: 0 // 0: 不显示, 1: 加载中, 2: 已全部加载
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
				getMyCoupons({
					status: this.navOn,
					page: this.page,
					limit: this.limit
				}).then(res => {
					that.loading = false;
					uni.hideLoading();
					
					if (res.code === 200) {
						const list = res.data.list || [];
						that.couponsList = that.couponsList.concat(list);
						that.finished = list.length < that.limit;
						that.loadingStatus = that.finished ? 2 : 0;
						that.page += 1;
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
			}
		}
	};
</script>

<style lang="scss" scoped>
.coupon-container {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 20rpx;
	
	.navbar {
		height: 90rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #f5f5f5;
		
		.item {
			flex: 1;
			font-size: 28rpx;
			color: #282828;
			position: relative;
			
			&.on {
				color: var(--view-theme);
				
				&:before {
					content: '';
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
					width: 30rpx;
					height: 6rpx;
					background-color: var(--view-theme);
					border-radius: 3rpx;
				}
			}
		}
	}
	
	.coupon-list {
		padding: 20rpx;
		
		.item {
			position: relative;
			margin-bottom: 20rpx;
			height: 200rpx;
			
			&.expired {
				opacity: 0.6;
			}
			
			.coupon-bg {
				position: absolute;
				width: 100%;
				height: 100%;
				left: 0;
				top: 0;
				z-index: 1;
				border-radius: 10rpx;
			}
			
			.coupon-content {
				position: relative;
				z-index: 2;
				display: flex;
				height: 100%;
				
				.moneyCon {
					width: 210rpx;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					
					.money {
						color: var(--view-theme);
						
						&.moneyGray {
							color: #909399;
						}
						
						.price-box {
							font-size: 28rpx;
							display: flex;
							align-items: baseline;
							justify-content: center;
							
							.num {
								font-size: 44rpx;
								font-weight: bold;
							}
						}
						
						.pic-num {
							font-size: 24rpx;
							text-align: center;
							margin-top: 10rpx;
						}
					}
				}
				
				.text {
					flex: 1;
					padding: 20rpx 20rpx 20rpx 0;
					position: relative;
					
					.condition {
						.name {
							font-size: 28rpx;
							color: #282828;
							margin-bottom: 10rpx;
							display: flex;
							align-items: center;
							
							.line-title {
								padding: 0 10rpx;
								font-size: 20rpx;
								color: #fff;
								border-radius: 4rpx;
								margin-right: 10rpx;
								
								&.bg-color-check {
									background-color: var(--view-theme);
								}
								
								&.bg-color-huic {
									background-color: #909399;
								}
							}
							
							.coupon-title {
								flex: 1;
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 1;
								-webkit-box-orient: vertical;
							}
						}
					}
					
					.data {
						display: flex;
						align-items: center;
						justify-content: space-between;
						font-size: 24rpx;
						color: #999;
						margin-top: 10rpx;
						
						.date-info {
							flex: 1;
						}
						
						.bnt {
							padding: 4rpx 12rpx;
							border-radius: 24rpx;
							font-size: 20rpx;
							
							&.bg-color {
								background-color: var(--view-theme);
								color: #fff;
							}
							
							&.gray {
								background-color: #909399;
								color: #fff;
							}
						}
					}
					
					.coupon-info {
						position: absolute;
						left: 0;
						top: 0;
						right: 0;
						bottom: 0;
						background: rgba(255, 255, 255, 0.95);
						border-radius: 10rpx;
						z-index: 10;
						padding: 20rpx;
						
						.info-bg {
							position: absolute;
							width: 100%;
							height: 100%;
							left: 0;
							top: 0;
							z-index: 1;
							border-radius: 10rpx;
						}
						
						.info-content {
							position: relative;
							z-index: 2;
							
							.info-title {
								font-size: 28rpx;
								font-weight: bold;
								margin-bottom: 10rpx;
							}
							
							.info-text {
								font-size: 24rpx;
								color: #666;
								line-height: 1.5;
							}
						}
						
						.info-close {
							position: absolute;
							right: 20rpx;
							top: 20rpx;
							font-size: 40rpx;
							z-index: 3;
							color: #999;
						}
					}
					
					.show-info-btn {
						position: absolute;
						right: 20rpx;
						bottom: 20rpx;
						font-size: 22rpx;
						color: var(--view-theme);
						z-index: 3;
						text-decoration: underline;
					}
				}
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
}
</style>
