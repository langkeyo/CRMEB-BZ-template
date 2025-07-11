<template>
	<view>
		<form :style="colorStyle">
			<view class="payment-top acea-row row-column row-center-wrapper">
				<span class="name">{{$t(`团购支付`)}}</span>
				<view class="pic">
					<span class="pic-font"><span class="num"> {{$t(`￥`)}}</span>{{ totalAmount || 0 }}</span>
				</view>
			</view>
			<view class="payment">
				<view class="group-info">
					<view class="group-title">{{$t(`团购信息`)}}</view>
					<view class="group-item">
						<view class="label">{{$t(`商品名称`)}}</view>
						<view class="value">{{ goodsInfo.store_name || '' }}</view>
					</view>
					<view class="group-item">
						<view class="label">{{$t(`团购价格`)}}</view>
						<view class="value price">{{$t(`￥`)}}{{ goodsInfo.group_price || 0 }}</view>
					</view>
					<view class="group-item">
						<view class="label">{{$t(`参团人数`)}}</view>
						<view class="value">{{ groupMembers || 1 }}人</view>
					</view>
					<view class="group-item">
						<view class="label">{{$t(`剩余时间`)}}</view>
						<view class="value countdown">{{ countdownTime.hours }}:{{ countdownTime.minutes }}:{{ countdownTime.seconds }}</view>
					</view>
				</view>

				<view class="tip">
					<view class="tips-box">
						<view class="tips mt-30">{{$t(`支付说明`)}}：</view>
						<view class="tips-samll">
							{{ $t(`1. 开团后，请在24小时内完成支付`) }}
						</view>
						<view class="tips-samll">
							{{ $t(`2. 团购商品不支持使用优惠券和积分抵扣`) }}
						</view>
						<view class="tips-samll">
							{{ $t(`3. 支付成功后，系统将自动为您创建团购`) }}
						</view>
					</view>
				</view>
				<button class='but bg-color' @click="pay">{{$t(`立即支付`)}}</button>
			</view>
		</form>
		<payment :payMode="payMode" :pay_close="pay_close" :is-call="true" @onChangeFun="onChangeFun"
			:totalPrice="totalAmount"></payment>
		<payment-confirm-popup
			:show="showPaymentConfirm"
			:amount="totalAmount"
			:payment-method="selectedPaymentMethod"
			@confirm="confirmPayment"
			@cancel="cancelPayment">
		</payment-confirm-popup>
		<view v-show="false" v-html="formContent"></view>
		<!-- #ifndef MP -->
		<home></home>
		<!-- #endif -->
	</view>
</template>

<script>
	import {
		getUserInfo,
		recharge
	} from '@/api/user.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	import home from '@/components/home';
	import colors from "@/mixins/color";
	import payment from '@/components/payment';
		import paymentConfirmPopup from '@/components/paymentConfirmPopup';
	import {
		basicConfig
	} from '@/api/public.js';
import { orderPay } from '@/api/order.js';
import { purchaseFlowNavigation } from '@/utils/navigationConfig.js';
	export default {
		components: {
			payment,
			paymentConfirmPopup,
			home
		},
		mixins: [colors],
		data() {
			return {
				formContent: '',
				userinfo: {},
				goodsInfo: {},
				groupMembers: 1,
				totalAmount: 0,
				orderId: '',
				pay_close: false,
				countdownTime: {
					hours: '00',
					minutes: '00',
					seconds: '00'
				},
				countdownTimer: null,
				payMode: [{
						name: this.$t(`微信支付`),
						icon: 'icon-weixinzhifu',
						value: 'weixin',
						title: this.$t(`微信支付`),
						payStatus: true
					},
					// #ifdef H5 ||APP-PLUS
					{
						name: this.$t(`支付宝支付`),
						icon: 'icon-zhifubao',
						value: 'alipay',
						title: this.$t(`支付宝支付`),
						payStatus: true
					},
					// #endif
				],
				showPaymentConfirm: false,
				selectedPaymentMethod: {
					name: this.$t(`微信支付`),
					icon: 'icon-weixinzhifu'
				},
			};
		},
		computed: mapGetters(['isLogin']),
		watch: {
			isLogin: {
				handler: function(newV, oldV) {
					if (newV) {
						this.getUserInfo();
					}
				},
				deep: true
			}
		},
		onLoad(options) {
			// #ifdef H5
			this.from = this.$wechat.isWeixin() ? "weixin" : "weixinh5"
			// #endif

			if (this.isLogin) {
				this.getBasicConfig();
				this.getUserInfo();

				// 获取参数
				if(options.orderId) {
					this.orderId = options.orderId;
				}
				if(options.totalAmount) {
					this.totalAmount = options.totalAmount;
				}
				if(options.groupMembers) {
					this.groupMembers = options.groupMembers;
				}
				if(options.goodsInfo) {
					try {
						this.goodsInfo = JSON.parse(decodeURIComponent(options.goodsInfo));
					} catch(e) {
						console.error('解析商品信息失败', e);
					}
				}

				// 启动倒计时
				this.startCountdown();
			} else {
				toLogin();
			}
		},
		onUnload() {
			// 清除倒计时
			if (this.countdownTimer) {
				clearInterval(this.countdownTimer);
				this.countdownTimer = null;
			}
		},
		methods: {
			getBasicConfig() {
				basicConfig().then(res => {
					const {
						ali_pay_status,
						pay_weixin_open
					} = res.data;
					this.payMode[0].payStatus = pay_weixin_open;
					// #ifdef APP-PLUS || H5
					this.payMode[1].payStatus = ali_pay_status;
					// #endif
					//#ifdef MP
					this.payMode[1].payStatus = false;
					//#endif
				}).catch(err => {
					uni.showToast({
						title: err,
						icon: 'none'
					});
				});
			},

			// 开始倒计时
			startCountdown() {
				// 清除之前的倒计时
				if (this.countdownTimer) {
					clearInterval(this.countdownTimer);
				}

				// 设置结束时间（示例：24小时后）
				const endTime = new Date().getTime() + 24 * 60 * 60 * 1000;

				// 更新倒计时
				const updateCountdown = () => {
					const now = new Date().getTime();
					const distance = endTime - now;

					if (distance <= 0) {
						// 倒计时结束
						clearInterval(this.countdownTimer);
						this.countdownTime = {
							hours: '00',
							minutes: '00',
							seconds: '00'
						};
						return;
					}

					// 计算时分秒
					const hours = Math.floor(distance / (1000 * 60 * 60));
					const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
					const seconds = Math.floor((distance % (1000 * 60)) / 1000);

					// 更新数据
					this.countdownTime = {
						hours: hours < 10 ? '0' + hours : hours.toString(),
						minutes: minutes < 10 ? '0' + minutes : minutes.toString(),
						seconds: seconds < 10 ? '0' + seconds : seconds.toString()
					};
				};

				// 立即执行一次
				updateCountdown();

				// 设置定时器，每秒更新一次
				this.countdownTimer = setInterval(updateCountdown, 1000);
			},

			getUserInfo: function() {
				let that = this;
				getUserInfo().then(res => {
					that.$set(that, 'userinfo', res.data);
				})
			},

			onChangeFun: function(e) {
				let opt = e;
				let action = opt.action || null;
				let value = opt.value != undefined ? opt.value : null;
				this.pay_close = false
				action && this[action] && this[action](value);
			},

			pay() {
				this.pay_close = true;
			},

			payCheck(type) {
				// 设置选中的支付方式
				const payMethod = this.payMode.find(item => item.value === type);
				if (payMethod) {
					this.selectedPaymentMethod = {
						name: payMethod.name,
						icon: payMethod.icon
					};
				}

				// 显示支付确认弹窗
				this.showPaymentConfirm = true;
			},

			// 确认支付
			confirmPayment() {
				// 这里调用支付接口
				// 实际项目中需要根据具体的支付接口进行调整
				let that = this
				uni.showLoading({
					title: that.$t(`正在支付`),
				})

				// 调用支付API
				orderPay({
					uni: that.orderId,
					paytype: that.selectedPaymentMethod.value || 'weixin',
					type: 0
				}).then(res => {
					uni.hideLoading();

					// 支付成功，跳转到支付状态页面
					purchaseFlowNavigation.fromPaymentToPayStatus({
						orderId: that.orderId,
						msg: that.$t(`支付成功`),
						status: 0
					});
				}).catch(err => {
					uni.hideLoading();

					// 支付失败，跳转到未结清订单提示页面
					purchaseFlowNavigation.fromPaymentToUnpaidOrderTip({
						orderId: that.orderId
					});
				});
			},

			// 取消支付
			cancelPayment() {
				// 关闭支付确认弹窗
				this.showPaymentConfirm = false;

				uni.showToast({
					title: this.$t(`已取消支付`),
					icon: 'none'
				});
			}
		},
	}
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
		height: 100%;
		background-color: #fff;
	}

	.bgcolor {
		background-color: var(--view-theme)
	}

	.payment {
		position: relative;
		top: -60rpx;
		width: 100%;
		background-color: #fff;
		border-radius: 10rpx;
		padding-top: 1rpx;
		border-top-right-radius: 39rpx;
		border-top-left-radius: 39rpx;
	}

	.payment .but {
		color: #fff;
		font-size: 30rpx;
		width: 700rpx;
		height: 86rpx;
		border-radius: 50rpx;
		margin: 46rpx auto 0 auto;
		line-height: 86rpx;
		background: linear-gradient(90deg, #FF6B6B 0%, #FF3636 100%);
	}

	.payment-top {
		width: 100%;
		height: 350rpx;
		background: linear-gradient(90deg, #FF6B6B 0%, #FF3636 100%);

		.name {
			font-size: 26rpx;
			color: rgba(255, 255, 255, 0.8);
			margin-top: -38rpx;
			margin-bottom: 30rpx;
		}

		.pic {
			font-size: 32rpx;
			color: #fff;

			.num {
				font-size: 56rpx;
			}
		}

		.pic-font {
			font-size: 78rpx;
			color: #fff;
		}
	}

	.group-info {
		margin: 30rpx;
		padding: 20rpx;
		background-color: #FFF5F5;
		border-radius: 12rpx;

		.group-title {
			font-size: 28rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 20rpx;
		}

		.group-item {
			display: flex;
			justify-content: space-between;
			margin-bottom: 15rpx;

			.label {
				font-size: 26rpx;
				color: #666;
			}

			.value {
				font-size: 26rpx;
				color: #333;
				font-weight: 500;

				&.price {
					color: #FF3636;
					font-weight: bold;
				}

				&.countdown {
					color: #FF3636;
					font-weight: bold;
				}
			}
		}
	}

	.tips-box {
		padding: 0 30rpx;

		.tips {
			font-size: 28rpx;
			color: #333333;
			font-weight: 800;
			margin-bottom: 14rpx;
			margin-top: 20rpx;
		}

		.tips-samll {
			font-size: 24rpx;
			color: #333333;
			margin-bottom: 14rpx;
		}
	}
</style>
