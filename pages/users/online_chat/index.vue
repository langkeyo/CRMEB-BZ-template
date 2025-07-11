<template>
	<view class="chat-box" :style="colorStyle">
		<!-- 头部导航 -->
		<view class="header-section">
			<view class="header-bg"></view>
			<view class="header-content">
				<view class="left-section" @click="goBack">
					<image class="back-icon" src="/static/icons/back-arrow.svg" mode="aspectFit"></image>
					<text class="back-text">返回</text>
				</view>
				<view class="title-section">
					<text class="title-text">在线咨询</text>
				</view>
			</view>
		</view>
		<view class="broadcast-details_order">
			<!-- 商品信息 -->
			<view class="broadcast-details_box" v-if="productId && productInfo.id">
				<view class="broadcast_details_img">
					<image class="goods-img" :src="productInfo.image" />
				</view>
				<view class="broadcast_details_picBox">
					<view class="broadcast_details_tit" v-text="productInfo.store_name"></view>
					<view class="acea-row row-between">
						<view class="broadcast_details_pic">
							{{$t(`￥`)}}{{ productInfo.price }}
							<text class="broadcast_details_pic_num"
								v-if="productInfo.ot_price">{{$t(`￥`)}}{{ productInfo.ot_price }}</text>
						</view>
						<view class="broadcast_details_btn" @click="sendProduct">{{$t(`发送客服`)}}</view>
					</view>
				</view>
			</view>
			<!-- 订单信息 -->
			<view class="broadcast_box" v-if="orderId && orderInfo.id">
				<view class="broadcast-details_num broadcast_num">
					<text>{{$t(`订单号`)}}：{{ orderInfo.order_id }}</text>
					<text>{{ orderInfo.add_time_y }} {{ orderInfo.add_time_h }}</text>
				</view>
				<view class="broadcast-details_box">
					<view class="broadcast_details_img">
						<image class="goods-img" :src="orderInfo.cartInfo[0].productInfo.image" />
						<view class="broadcast_details_model">
							{{ orderInfo.cartInfo ? orderInfo.cartInfo.length : 0 }}{{$t(`件商品`)}}
						</view>
					</view>
					<view class="broadcast_details_picBox">
						<view class="broadcast_details_tit">{{ orderInfo.cartInfo[0].productInfo.store_name }}</view>
						<view class="acea-row row-between">
							<view class="broadcast_details_pic">
								{{$t(`￥`)}}{{ orderInfo.cartInfo[0].productInfo.price }}
								<text
									class="broadcast_details_pic_num">{{$t(`￥`)}}{{ orderInfo.cartInfo[0].costPrice }}</text>
							</view>
							<view class="broadcast_details_btn" @click="sendOrder">{{$t(`发送客服`)}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="chat-scroll-box">
			<scroll-view scroll-y="true" style="height: 100%;" :scroll-top="scrollTop" @scrolltoupper="scrollToTop">
				<Loading :loaded="status" :loading="loading"></Loading>
				<view id="box" class="chat" ref="chat">
					<view v-for="(item, index) in records" :key="index" :id="`msg-${item.id}`">
						<view class="day-box" v-if="item.show">{{item._add_time}}</view>
						<view class="chat-item" :class="{ 'right-box': item.uid == myUid }">
							<image class="avatar" :src="getValidAvatar(item.avatar)" mode="" @error="handleAvatarError"></image>
							<!-- 消息 -->
							<view class="msg-box" v-if="item.msn_type <= 2" v-html="item.msn"></view>
							<!-- 图片 -->
							<view class="img-box" v-if="item.msn_type == 3">
								<image :src="item.msn" mode="widthFix" @tap="previewImage(item.msn)"></image>
							</view>
							<!-- 商品 -->
							<view class="product-box" v-if="item.msn_type == 5" @click="goProduct(item)">
								<image :src="item.productInfo.image" mode="widthFix"></image>
								<view class="info">
									<view class="price">
										<text>{{$t(`￥`)}}</text>
										{{ item.productInfo.price }}
									</view>
									<view class="name line2">{{ item.productInfo.store_name }}</view>
								</view>
							</view>
							<!-- 订单 -->
							<view class="order-box" v-if="item.msn_type == 6 && item.orderInfo" @click="goOrder(item)">
								<view class="title">{{$t(`订单号`)}}: {{ item.orderInfo.order_id }}</view>
								<view class="info">
									<image :src="item.orderInfo.cartInfo[0].productInfo.image"></image>
									<view class="product-info">
										<view class="name line2">{{ item.orderInfo.cartInfo[0].productInfo.store_name }}
										</view>
										<view class="price">
											{{$t(`￥`)}}{{ item.orderInfo.cartInfo[0].productInfo.price }}
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="chat-section">
			<view class="chat-bg"></view>
			<view class="input-container">
				<input
					class="input-field"
					type="text"
					:placeholder="$t(`请输入你想要咨询的问题`)"
					v-model="con"
					confirm-type="send"
					@confirm="sendText"
				/>
				<image class="emoji-btn" src="/static/icons/emoji.svg" mode="aspectFit" @click="isSwiper = !isSwiper"></image>
				<image class="more-btn" src="/static/icons/more-btn.svg" mode="aspectFit" @click="uploadImg"></image>
			</view>
		</view>
		<!-- 表情 -->
		<view class="banner slider-banner" v-if="isSwiper">
			<swiper class="swiper-wrapper" :autoplay="autoplay" :circular="circular" :interval="interval"
				:duration="duration" v-if="emojiGroup.length > 0">
				<block v-for="(emojiList, index) in emojiGroup" :key="index">
					<swiper-item><i class="em" :class="emoji" :style="'background-image:url('+ httpUrl +')'"
							v-for="emoji in emojiList" :key="emoji" @click="addEmoji(emoji)"></i></swiper-item>
				</block>
			</swiper>
		</view>
		<canvas canvas-id="canvas" v-if="canvasStatus"
			:style="{width: canvasWidth + 'px', height: canvasHeight + 'px',position: 'absolute',left:'-100000px',top:'-100000px'}"></canvas>
	</view>
</template>

<script>
	const app = getApp();
	import {
		getChatRecord
	} from '@/api/user';
	import {
		getProductDetail
	} from '@/api/store';
	import {
		getOrderDetail
	} from '@/api/order';
	let statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	import Socket from '@/libs/new_chat';
	const chunk = function(arr, num) {
		num = num * 1 || 1;
		var ret = [];
		arr.forEach(function(item, i) {
			if (i % num === 0) {
				ret.push([]);
			}
			ret[ret.length - 1].push(item);
		});
		return ret;
	};
	import emojiList from '@/utils/emoji';
	import Loading from '@/components/Loading';
	import colors from "@/mixins/color";
	import {
		HTTP_REQUEST_URL
	} from "@/config/app.js";
	export default {
		name: 'adminChat_index',
		data() {
			return {
				status: false,
				loading: false,
				sysHead: statusBarHeight,
				isTool: false,
				isSwiper: false,
				isWords: false,
				autoplay: false,
				circular: true,
				interval: 3000,
				duration: 500,
				emojiGroup: chunk(emojiList, 21),
				wordsList: [],
				con: '',
				toUid: 0,
				limit: 15,
				upperId: 0,
				chatList: [],
				kefuInfo: {},
				scrollTop: 0,
				active: true,
				isScroll: true,
				oldHeight: 0,
				myUid: 0,
				productId: 0,
				productInfo: {},
				orderId: 0,
				page: 1,
				orderInfo: {},
				uidTo: 0,
				titleName: '',
				chatStatus: false,
				userType: 0,
				canvasWidth: "",
				canvasHeight: "",
				canvasStatus: false,
				httpUrl: '',
				// 头像检查缓存
				avatarCheckCache: new Map(),
			};
		},
		mixins: [colors],
		components: {
			Loading
		},
		computed: {
			isSend() {
				if (this.con.length == 0) {
					return false;
				} else {
					return true;
				}
			},
			records() {
				return this.chatList.map((item, index) => {
					if (index) {
						if (item.add_time - this.chatList[index - 1].add_time >= 300) {
							item.show = true;
						} else {
							item.show = false;
						}
					} else {
						item.show = true;
					}
					return item;
				});
			}
		},
		onLoad(options) {
			uni.showLoading({
				title: this.$t(`客服连接中`)
			});
			this.myUid = this.$store.state.app.uid;
			this.toUid = options.to_uid
			this.productId = parseInt(options.productId) || 0;
			this.orderId = options.orderId || 0;
			this.userType = options.type
			this.getproductInfo();
			this.getOrderInfo();
		},
		onUnload() {
			this.$socket.onClose();
			uni.$off()
		},
		onReady() {
			this.httpUrl = `${HTTP_REQUEST_URL}/statics/images/look.png`;
			// #ifdef H5
			let dom = document.querySelector(".chat-box");
			dom.style.height = window.innerHeight + 'px'
			// #endif
			let initSocket = () => {
				if (app.globalData.isWsOpen) {
					this.$socket.send({
						data: {
							token: this.$store.state.app.token,
							//#ifdef MP || APP-PLUS
							form_type: 2,
							//#endif
							//#ifdef H5
							form_type: this.$wechat.isWeixin() ? 1 : 3
							//#endif
						},
						type: 'login'
					});
					this.getChatList();
				} else {
					let form_type
					//#ifdef MP || APP-PLUS
					form_type = 2
					//#endif
					//#ifdef H5
					form_type = this.$wechat.isWeixin() ? 1 : 3
					//#endif
					this.$socket.onStart(this.$store.state.app.token, form_type);
				}
				uni.$once('socketOpen', () => {
					// 登录
					this.$socket.send({
						data: this.$store.state.app.token,
						//#ifdef MP || APP-PLUS
						form_type: 2,
						//#endif
						//#ifdef H5
						form_type: this.$wechat.isWeixin() ? 1 : 3,
						//#endif
						type: 'login'
					});
					this.$nextTick(e => {
						this.getChatList();
					})
				});
			}
			initSocket()
			// 初始化


			// 监听客服转接
			uni.$on('to_transfer', data => {
				this.toUid = data.toUid;
				this.$socket.send({

					data: {
						id: this.toUid
					},
					type: 'to_chat'
				});
				this.chatList.forEach(el => {
					console.log(el)
					if (el.uid != this.myUid) {
						el.avatar = this.getValidAvatar(data.avatar)
					}
				})
			});
			// 超时了
			uni.$once('timeout', () => {
				uni.showLoading({
					title: '重连中',
					mask: true
				})
				this.chatList = []
				initSocket()
			});
			// 链接成功
			uni.$once('success', () => {
				this.$socket.init();
			});
			// 消息接收
			uni.$on(['reply', 'chat'], data => {
				if (data.msn_type == 1) {
					data.msn = this.replace_em(data.msn);
				}
				data._add_time = data._add_time.substring(0, data._add_time.length - 3);
				this.chatList.push(data);
				this.$nextTick(() => {
					this.height();
				});
			});
			uni.$on('socket_error', () => {
				this.$util.Tips({
					title: this.$t(`连接失败`)
				});
			});
			uni.$on('err_tip', (e) => {
				this.$util.Tips({
					title: e.msg
				});
			});
			uni.$on('online', data => {
				if (data.online == 0) {
					uni.showModal({
						title: this.$t(`提示`),
						content: this.$t(`客服已下线，是否需要反馈？`),
						success: function(res) {
							if (res.confirm) {
								uni.redirectTo({
									url: '/pages/columnGoods/HotNewGoods/feedback'
								});
							} else if (res.cancel) {}
						}
					});
				}
			});
			this.$nextTick(() => {
				this.height();
			});
		},
		methods: {
			previewImage(n) {
				uni.previewImage({
					urls: [n]
				});
			},
			// 返回
			goBack() {
				uni.navigateBack();
			},
			// 商品信息
			getproductInfo() {
				let that = this;
				if (!this.productId) return;
				getProductDetail(this.productId).then(res => {
					that.productInfo = res.data.storeInfo;
				});
			},
			// 商品信息
			goProduct(item) {
				uni.navigateTo({
					url: `/pages/goods_details/index?id=${item.msn}`
				});
			},
			// 订单详情
			goOrder(item) {
				if (this.userType) {
					uni.navigateTo({
						url: `/pages/admin/orderDetail/index?id=${item.msn}`
					});
				} else {
					uni.navigateTo({
						url: `/pages/goods/order_details/index?order_id=${item.msn}`
					});
				}

			},
			// 订单消息
			getOrderInfo() {
				if (!this.orderId) return;
				getOrderDetail(this.orderId).then(res => {
					this.orderInfo = res.data;
					if (this.orderInfo.add_time_h) {
						this.orderInfo.add_time_h = this.orderInfo.add_time_h.substring(0, this.orderInfo
							.add_time_h.lastIndexOf(':'));
					}
					if (this.orderInfo.cartInfo.length) {
						this.cartInfo = this.orderInfo.cartInfo[0];
					}
				});

			},
			// 表情点击
			addEmoji(item) {
				let val = `[${item}]`;
				this.con += val;
			},
			// 聊天表情转换
			replace_em(str) {
				str = str.replace(/\[([^\[\]]+)\]/g, "<span class='em $1' style='background-image:url(" + this
					.httpUrl + ")'></span>");
				return str;
			},
			// 获取聊天列表
			getChatList() {
				let self = this;
				getChatRecord({
						limit: this.limit,
						uidTo: this.uidTo,
						toUid: this.toUid
					})
					.then(res => {
						let selector = '';
						if (res.data.serviceList.length) {
							if (this.uidTo == 0) {
								selector = `#msg-${res.data.serviceList[res.data.serviceList.length - 1].id}`;
							} else {
								selector = `#msg-${this.chatList.length ? this.chatList[0].id : 0}`;
							}
						}
						let arr = [];
						var sH = 0;
						uni.hideLoading();
						uni.setNavigationBarTitle({
							title: res.data.nickname
						});
						this.titleName = res.data.nickname;
						this.toUid = res.data.uid;
						res.data.serviceList.forEach(el => {
							el._add_time = el._add_time.substring(0, el._add_time.length - 3);
							if (el.msn_type == 1 || el.msn_type == 2) {
								el.msn = this.replace_em(el.msn);
							}
						});
						this.loading = false;
						this.chatList = [...res.data.serviceList, ...this.chatList];

						this.$nextTick(() => {
							if (this.chatList.length) {
								this.setPageScrollTo(selector);
								this.isScroll = res.data.serviceList.length >= this.limit;
							}

						});
						this.$socket.send({
							data: {
								id: this.toUid
							},
							type: 'to_chat'
						});
					})
					.catch(error => {
						uni.hideLoading();
						this.$util.Tips({
							title: error
						});
						this.loading = false;
						this.isScroll = false
						uni.redirectTo({
							url: '/pages/columnGoods/HotNewGoods/feedback'
						});
					});
			},

			// 设置页面滚动位置
			setPageScrollTo(selector) {
				let view = uni
					.createSelectorQuery()
					.in(this)
					.select(selector);
				view.boundingClientRect(res => {
					this.scrollTop = res ? parseFloat(res.top) - 60 : 0;
				}).exec();
			},

			// 发送消息
			sendText() {
				if (!this.isSend) {
					return this.$util.Tips({
						title: this.$t(`请输入内容`)
					});
				}
				this.sendMsg(this.con, 1);
				this.con = '';
			},
			// ws发送
			sendMsg(msn, type) {
				this.$socket.send({
					data: {
						msn,
						type,
						to_uid: this.toUid
					},
					//#ifdef MP || APP-PLUS
					form_type: 2,
					//#endif
					//#ifdef H5
					form_type: this.$wechat.isWeixin() ? 1 : 3,
					//#endif
					type: 'chat'
				});
			},
			uploadImg() {
				let self = this;
				self.canvasStatus = true
				self.$util.uploadImageChange('upload/image', function(res) {
					if (res.status == 200) {
						self.sendMsg(res.data.url, 3);
					}
				}, (res) => {
					this.canvasStatus = false
				}, (res) => {
					this.canvasWidth = res.w
					this.canvasHeight = res.h
				});
			},
			// 发送商品
			sendProduct() {
				this.sendMsg(this.productId, 5);
				this.productId = 0;
				this.productInfo = {};
			},
			// 发送订单
			sendOrder() {
				this.sendMsg(this.orderId, 6);
				this.orderId = 0;
				this.orderInfo = {};
			},
			// 滚动到底部
			height() {
				let self = this;
				var scrollTop = 0;
				let info = uni.createSelectorQuery().select('.chat');
				setTimeout(res => {
					info.boundingClientRect(function(data) {
						//data - 各种参数
						scrollTop = data.height;
						if (self.active) {
							self.scrollTop = parseInt(scrollTop) + 500;
						} else {
							self.scrollTop = parseInt(scrollTop) + 100;
						}
					}).exec();
				}, 200);
			},
			// 滚动到顶部
			scrollToTop() {
				let self = this;
				if (this.isScroll) {
					this.loading = true;
					this.uidTo = this.chatList.length ? this.chatList[0].id : 0;
					this.isScroll = false;
					setTimeout(res => {
						this.getChatList();
					}, 800);
				}
			},
			// 获取有效的头像URL
			getValidAvatar(avatar) {
				// 检查头像是否为空或无效
				if (!avatar || typeof avatar !== 'string' || avatar.trim() === '') {
					console.log('头像为空或无效，使用默认头像');
					return '/static/images/f.png';
				}

				// 清理URL
				const cleanAvatar = avatar.trim();

				// 检查缓存
				if (this.avatarCheckCache.has(cleanAvatar)) {
					const cacheResult = this.avatarCheckCache.get(cleanAvatar);
					if (!cacheResult.exists) {
						console.log('头像缓存显示文件不存在:', cleanAvatar);
						return '/static/images/f.png';
					}
					return cleanAvatar;
				}

				// 对于HTTP/HTTPS的远程URL，直接返回让image组件处理
				// 如果加载失败会触发@error事件
				if (cleanAvatar.startsWith('http://') || cleanAvatar.startsWith('https://')) {
					// 缓存远程URL为有效（让image组件处理加载失败）
					this.avatarCheckCache.set(cleanAvatar, { exists: true, checked: true });
					return cleanAvatar;
				}

				// 对于本地路径，进行文件存在性检查
				if (cleanAvatar.startsWith('/')) {
					// 异步检查文件是否存在
					this.checkImageExists(cleanAvatar).then(exists => {
						// 更新缓存
						this.avatarCheckCache.set(cleanAvatar, { exists: exists, checked: true });

						if (!exists) {
							console.log('本地头像文件不存在:', cleanAvatar);
							// 如果文件不存在，更新为默认头像
							this.updateAvatarToDefault(cleanAvatar);
						}
					});

					// 先返回原URL，让image组件尝试加载
					return cleanAvatar;
				}

				// 如果不符合任何有效格式，返回默认头像
				console.log('头像URL格式无效:', cleanAvatar);
				this.avatarCheckCache.set(cleanAvatar, { exists: false, checked: true });
				return '/static/images/f.png';
			},

			// 检查图片是否存在
			async checkImageExists(imagePath) {
				return new Promise((resolve) => {
					// 创建一个临时的image元素来检查文件是否存在
					// 注意：在uni-app中，我们使用uni.getImageInfo来检查
					uni.getImageInfo({
						src: imagePath,
						success: () => {
							resolve(true);
						},
						fail: () => {
							resolve(false);
						}
					});
				});
			},

			// 更新头像为默认头像
			updateAvatarToDefault(originalAvatar) {
				// 更新聊天列表中所有使用该头像的消息
				this.chatList.forEach(item => {
					if (item.avatar === originalAvatar) {
						item.avatar = '/static/images/f.png';
					}
				});

				// 强制更新视图
				this.$forceUpdate();
			},
			// 头像加载失败处理
			handleAvatarError(e) {
				console.log('头像加载失败，使用默认头像');
				// 设置默认头像
				e.target.src = '/static/images/f.png';
			}
		}
	};
</script>
<style>
	/* #ifdef MP || APP-PLUS || H5 */
	page,
	uni-page-body,
	html,
	body {
		height: 100%;
	}

	/* #endif */
</style>
<style lang="scss">
	.chat-box {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: #f0f1f2;
		/* #ifdef H5 */
		height: 100vh;

		/* #endif */

		/* 头部样式 - 按设计规范 */
		.header-section {
			position: relative;
			width: 100%;
			height: 100rpx; /* 实际头部高度，不包含状态栏 */
			flex-shrink: 0;
		}

		.header-bg {
			position: absolute;
			width: 100%;
			height: 100rpx;
			left: 0;
			top: 0;
			background: #FFFFFF;
		}

		.header-content {
			position: relative;
			width: 100%;
			height: 100rpx;
			display: flex;
			align-items: center;
			padding: 0 20rpx;
		}

		.left-section {
			display: flex;
			align-items: center;
			height: 50rpx; /* 25px * 2 */
			cursor: pointer;
		}

		.back-icon {
			width: 30rpx; /* 24px * 2 */
			height: 30rpx; /* 24px * 2 */
			margin-right: 16rpx;
		}

		.back-text {
			font-family: 'PingFang SC';
			font-style: normal;
			font-weight: 400;
			font-size: 36rpx; /* 18px * 2 */
			line-height: 50rpx; /* 25px * 2 */
			color: #333333;
		}

		.title-section {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			height: 50rpx;
			display: flex;
			align-items: center;
		}

		.title-text {
			font-family: 'PingFang SC';
			font-style: normal;
			font-weight: 550;
			font-size: 36rpx; /* 18px * 2 */
			line-height: 50rpx; /* 25px * 2 */
			color: #1A1A1A;
		}

		/* 聊天输入区域样式 - 按设计规范 */
		.chat-section {
			position: relative;
			width: 100%;
			height: 90rpx; /* 45px * 2 */
			flex-shrink: 0;
		}

		.chat-bg {
			position: absolute;
			width: 100%;
			height: 90rpx;
			left: 0;
			top: 0;
			background: #FFFFFF;
		}

		.input-container {
			position: relative;
			width: 100%;
			height: 90rpx;
			display: flex;
			align-items: center;
			padding: 0 24rpx; /* 12px * 2 */
		}

		.input-field {
			width: 632rpx; /* 316px * 2 */
			height: 60rpx; /* 30px * 2 */
			background: #F7F7F7;
			border-radius: 8rpx; /* 4px * 2 */
			padding: 0 14rpx; /* 7px * 2 */
			font-family: 'PingFang SC';
			font-style: normal;
			font-weight: 400;
			font-size: 24rpx; /* 12px * 2 */
			line-height: 34rpx; /* 17px * 2 */
			color: #333333;
			border: none;
			outline: none;
		}

		.input-field::placeholder {
			color: #999999;
		}

		.emoji-btn {
			width: 46rpx; /* 23px * 2 */
			height: 46rpx; /* 23px * 2 */
			margin-left: 20rpx;
		}

		.more-btn {
			width: 48rpx; /* 24px * 2 */
			height: 70rpx; /* 35px * 2 */
			margin-left: 20rpx;
		}

		.head-box {
			/* #ifdef H5 */
			height: 86rpx;
			/* #endif */
			background: linear-gradient(85deg, $kf-star 0%, $kf-end 100%);

			.title-hd {
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;
				height: 43px;
				padding: 0 30rpx;
				color: #fff;

				.icon-fanhui {
					position: absolute;
					left: 30rpx;
					top: 50%;
					transform: translateY(-50%);
				}

				.icon-gengduo2 {
					/* #ifdef MP */
					position: absolute;
					right: 210rpx;
					top: 50%;
					transform: translateY(-50%);
					/* #endif */
				}
			}
		}

		.scroll-box {
			flex: 1;
		}

		/* 旧的footer-box样式 - 已替换为chat-section */
		/*
		.footer-box {
			display: flex;
			align-items: center;
			color: rgba(0, 0, 0, 0.8);
			background: #f7f7f7;
			padding: 0 30rpx;
			height: 70rpx;

			.words .icon-tupian {
				font-size: 50rpx;
			}

			.input-box {
				display: flex;
				align-items: center;
				flex: 1;
				height: 64rpx;
				padding-right: 5rpx;
				margin-left: 18rpx;
				background-color: #fff;
				border-radius: 32rpx;

				input {
					flex: 1;
					padding-left: 20rpx;
					height: 100%;
					font-size: 28rpx;
					font-weight: normal;
				}

				.icon-fasong {
					font-size: 50rpx;
					color: #ccc;
					font-weight: normal;
				}

				.isSend {
					color: $kf-theme;
				}
			}

			.emoji .icon-biaoqing {
				margin-left: 18rpx;
				font-size: 50rpx;
			}
		}
		*/
	}

	.tool-wrapper {
		display: flex;
		justify-content: space-between;
		padding: 45rpx 60rpx;
		background: #fff;
		font-size: 24rpx;

		.tool-item {
			text-align: center;

			image {
				width: 104rpx;
				height: 104rpx;
			}
		}
	}

	.slider-banner {
		background: #fff;
		padding-bottom: 0rpx;
		padding-bottom: calc(constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		padding-bottom: calc(env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}

	.words-mask {
		z-index: 50;
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);

		.content {
			position: absolute;
			left: 0;
			right: 0;
			top: 114rpx;
			bottom: 0;
			display: flex;
			flex-direction: column;
			padding: 0 30rpx;
			background: #fff;
			border-radius: 6rpx 6rpx 0px 0px;

			.title-box {
				position: relative;
				height: 125rpx;
				line-height: 125rpx;
				text-align: center;
				font-size: 32rpx;

				.icon-cha1 {
					position: absolute;
					right: 0;
					top: 50%;
					transform: translateY(-50%);
				}
			}

			.scroll-box {
				flex: 1;
				overflow: hidden;

				.msg-item {
					padding: 25rpx 0;
					border-bottom: 1px solid #eceff8;
				}
			}
		}
	}

	.chat-scroll-box {
		flex: 1;
		padding: 30rpx 30rpx 0;
		overflow: hidden;

		.chat-item {
			display: flex;
			margin-bottom: 36rpx;
			-webkit-user-select: auto;
			align-items: flex-start;

			.avatar {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				flex-shrink: 0;
			}

			.msg-box {
				display: inline-block;
				max-width: 452rpx;
				margin-left: 22rpx;
				padding: 16rpx 24rpx;
				background: #fff;
				border-radius: 12rpx;
				word-break: break-all;
				-webkit-user-select: auto;
				position: relative;
				box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
				font-size: 30rpx;
				line-height: 1.4;
				color: #333;
				z-index: 1;

				/* 左侧气泡尖角 */
				&::before {
					content: '';
					position: absolute;
					left: -8rpx;
					top: 50%;
					transform: translateY(-50%) rotate(45deg);
					width: 16rpx;
					height: 16rpx;
					background: #fff;
					z-index: 0;
				}
			}

			.img-box {
				width: 270rpx;
				margin-left: 22rpx;

				image {
					width: 270rpx;
				}
			}

			.product-box {
				width: 452rpx;
				margin-left: 22rpx;
				background-color: #fff;
				border-radius: 14rpx;
				overflow: hidden;

				image {
					width: 452rpx;
				}

				.info {
					padding: 16rpx 26rpx;

					.price {
						font-size: 36rpx;
						color: var(--view-priceColor);

						text {
							font-size: 28rpx;
						}
					}
				}
			}

			.order-box {
				width: 452rpx;
				margin-left: 22rpx;
				background-color: #fff;
				border-radius: 14rpx;

				.title {
					padding: 15rpx 20rpx;
					font-size: 26rpx;
					color: #282828;
					border-bottom: 1px solid #eceff8;
				}

				.info {
					display: flex;
					padding: 20rpx;

					image {
						width: 124rpx;
						height: 124rpx;
						border-radius: 6rpx;
					}

					.product-info {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						margin-left: 16rpx;

						.name {
							font-size: 26rpx;
						}

						.price {
							font-size: 30rpx;
							color: var(--view-priceColor);
						}
					}
				}
			}

			&.right-box {
				flex-direction: row-reverse;

				.msg-box {
					margin-left: 0;
					margin-right: 22rpx;
					background-color: #007AFF;
					color: #fff;

					/* 右侧气泡尖角 */
					&::before {
						left: auto;
						right: -8rpx;
						top: 50%;
						transform: translateY(-50%) rotate(45deg);
						width: 16rpx;
						height: 16rpx;
						background: #007AFF;
						z-index: 0;
					}
				}

				.img-box {
					margin-left: 0;
					margin-right: 22rpx;
				}

				.product-box {
					margin-left: 0;
					margin-right: 22rpx;
				}

				.order-box {
					margin-left: 0;
					margin-right: 22rpx;
				}
			}

			.em {
				margin: 0;
			}
		}
	}

	.broadcast-details_box {
		display: flex;
		background: #fff;
		border-radius: 6px;
		padding: 24rpx;
	}

	.broadcast_details_img {
		width: 140rpx;
		height: 140rpx;
		border-radius: 8px;
		overflow: hidden;
		position: relative;
	}

	.broadcast_details_img .goods-img {
		width: 100%;
		height: 100%;
	}

	.broadcast_details_picBox {
		width: 75%;
		margin-left: 24rpx;
	}

	.broadcast_details_tit {
		font-size: 28rpx;
		color: #333333;
		height: 85rpx;
		font-weight: 800;
		line-height: 40rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		text-align: left !important;
	}

	.broadcast_details_pic {
		font-size: 36rpx;
		color: var(--view-priceColor);
		text-align: left;
	}

	.broadcast_details_pic_num {
		text-decoration: line-through;
		font-size: 28rpx;
		color: rgba(0, 0, 0, 0.5);
		margin-left: 0.1rem;
	}

	.broadcast_details_btn {
		width: 130rpx;
		height: 50rpx;
		background: var(--view-theme);
		opacity: 1;
		border-radius: 125rpx;
		color: #fff;
		font-size: 24rpx;
		text-align: center;
		line-height: 50rpx;
	}

	.broadcast-details_num {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		color: #000000;
		font-size: 26rpx;
		display: flex;
		justify-content: space-between;
		background: #fff;
		border-bottom: 1px dashed rgba(0, 0, 0, 0.2);
		padding: 0 24rpx;
	}

	.day-box {
		font-size: 24rpx;
		color: #999;
		text-align: center;
		margin-bottom: 36rpx;
	}
</style>
<style>
	.em {
		display: inline-block;
		width: 50rpx;
		height: 50rpx;
		margin: 40rpx 0 0 50rpx;
	}

	.emoji-outer {
		position: absolute;
		right: 50rpx;
		bottom: 30rpx;
		width: 50rpx;
		height: 50rpx;
	}
</style>
