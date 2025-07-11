<template>
	<view :style="colorStyle">
		<!-- 添加链接到新的订单确认页面 -->
		<view class="new-design-link" @tap="goToNewDesign">
			<text>查看新设计</text>
		</view>
		<view class='order-submission'>
			<view class="allAddress" :style="store_self_mention && is_shipping ? '' : 'padding-top:10rpx'"
				v-if="!virtual_type && (!is_gift || is_gift == 2)">
				<view class="nav acea-row">
					<view class="item font-num" :class="shippingType == 0 ? 'on' : 'on2'" @tap="addressType(0)"
						v-if='store_self_mention && is_shipping'>
						<view class="before">
							{{ $t(`快递配送`) }}
						</view>
					</view>
					<view class="item font-num" :class="shippingType == 1 ? 'on' : 'on2'" @tap="addressType(1)"
						v-if='store_self_mention && is_shipping'>
						<view class="before">
							{{ $t(`站点自提`) }}
						</view>
					</view>
				</view>
				<view class="add-title acea-row row-between-wrapper" v-if="!store_self_mention || !is_shipping"
					@click.prevent="openList">
					<view class="acea-row row-middle">
						<view class="icon" :class="shippingType == 1 ? 'orange' : 'orange'">
							{{ shippingType == 0 ? '商城配送' : '站点自提' }}
						</view>
						<view class="text add-text line1" v-if="shippingType == 0">{{ $t(`由平台为您提供配送服务`) }}</view>
						<view class="text add-text line1" v-if="shippingType == 1">{{ $t(`线上下单，站点自提`) }}</view>
					</view>

					<view class="text">{{ shippingType == 0 ? $t('切换地址') : $t('切换站点') }} <text
							class='iconfont icon-jiantou'></text>
					</view>
				</view>
				<view class='address acea-row row-between-wrapper' @tap='onAddress' v-if='shippingType == 0'>
					<view class='addressCon' v-if="addressInfo.real_name || ''">
						<view class='name'>{{ addressInfo.real_name || '' }}
							<text class='phone'>{{ addressInfo.phone || '' }}</text>
						</view>
						<view class="line1">
							<text class='default font-num'
								v-if="addressInfo.is_default">[{{ $t(`默认`) }}]</text>{{ addressInfo.province }}{{ addressInfo.city }}{{ addressInfo.district }}{{ addressInfo.detail }}
						</view>
						<!-- <view class='setaddress'>设置收货地址</view> -->
					</view>
					<view class='addressCon' v-else>
						<view class='setaddress'>{{ $t(`设置收货地址`) }}</view>
					</view>
					<view v-if="store_self_mention && is_shipping" class='iconfont icon-jiantou'></view>
				</view>
				<view class='address acea-row row-between-wrapper' v-else @tap="showStoreList">
					<block v-if="storeList.length > 0">
						<view class='addressCon'>
							<view class='name'>{{ system_store.name || '' }}
								<text class='phone'>{{ system_store.phone || '' }}</text>
							</view>
							<view class="line1"> {{ system_store.address }}{{ ", " + system_store.detailed_address }}</view>
						</view>
						<!-- <view class='iconfont icon-jiantou'></view> -->
					</block>
					<block v-else>
						<view>{{ $t(`暂无站点信息`) }}</view>
					</block>
					<view class="icon acea-row row-middle" v-if="storeList.length > 0">
						<view class="iconfont icon-dianhua" @click.stop="call(system_store.phone)"></view>
						<view class="iconfont icon-dingwei2" @click.stop="showMaoLocation(system_store)"></view>
					</view>
				</view>
				<view class='line'>
					<image src='/static/images/line.jpg'></image>
				</view>
			</view>
			<view v-if="giftData" class="gift-box">
				<view class="acea-row row-middle user-msg">
					<image class="avatar mr-12" :src="giftData.avatar" mode=""></image>
					<text class="nickname">{{ giftData.nickname }} 赠您一份礼物，请查收！</text>
				</view>
				<view class="line"></view>
				<view class="gift-mark" v-if="giftData.gift_mark">
					{{ giftData.gift_mark }}
				</view>
			</view>
			<orderGoods :cartInfo="cartInfo" :is_confirm='true' :is_gift='is_gift' :shipping_type="shippingType">
			</orderGoods>
			<view v-if="is_gift == 1" class="gift-msg acea-row row-between-wrapper">
				<view>{{ $t(`好友留言`) }}</view>
				<view class="discount">
					<input style="text-align: right;" v-model="gift_mark" type="text" :placeholder="$t(`填写好友留言，最多40字`)"
						placeholder-class="placeholder"></input>
				</view>
			</view>
			<view class='wrapper' v-if="(!is_gift && is_gift == 2) && shippingType == 1">
				<view class="item acea-row row-between-wrapper">
					<view>{{ $t(`用户姓名`) }}</view>
					<view class="discount">
						<input style="text-align: right;" v-model="contacts" type="text" :placeholder="$t(`请输入姓名`)"
							placeholder-class="placeholder"></input>
					</view>
				</view>
				<view class="item acea-row row-between-wrapper">
					<view>{{ $t(`联系电话`) }}</view>
					<view class="discount">
						<input style="text-align: right;" v-model="contactsTel" type="text" :placeholder="$t(`请输入手机号`)"
							placeholder-class="placeholder"></input>
					</view>
				</view>
			</view>
			<view v-if="is_gift == 2" class="receive-btn" @click="receiveGift">
				立即领取
			</view>
			<!-- 团购信息区域 -->
			<view class='wrapper group-buy-info' v-if="groupBuy">
				<view class='item acea-row row-between-wrapper'>
					<view>{{ $t(`团购信息`) }}</view>
					<view class='discount'>
						<text class="group-status">{{ $t(`正在进行中`) }}</text>
					</view>
				</view>
				<view class='item acea-row row-between-wrapper'>
					<view>{{ $t(`参团人数`) }}</view>
					<view class='discount'>
						<text class="group-members">{{ groupMembers || 1 }}人</text>
					</view>
				</view>
				<view class='item acea-row row-between-wrapper'>
					<view>{{ $t(`剩余时间`) }}</view>
					<view class='discount'>
						<text
							class="group-countdown">{{ countdownTime.hours }}:{{ countdownTime.minutes }}:{{ countdownTime.seconds }}</text>
					</view>
				</view>
			</view>

			<view class='wrapper' v-if="!is_gift || is_gift == 1">
				<view class='item acea-row row-between-wrapper' @tap='couponTap'
					v-if="!pinkId && !BargainId && !combinationId && !seckillId && !noCoupon && !discountId && !advanceId && !groupBuy">
					<view>{{ $t(`优惠券`) }}</view>
					<view class='discount'>
						{{ couponTitle }}
						<text class='iconfont icon-jiantou'></text>
					</view>
				</view>
				<view class='item acea-row row-between-wrapper'
					v-if="!pinkId && !BargainId && !combinationId && !seckillId && !advanceId && integral_open && !groupBuy">
					<view>{{ $t(`积分抵扣`) }}</view>
					<view class='discount acea-row row-middle'>
						<view> {{ useIntegral ? $t(`剩余积分`) : $t(`当前积分`) }}
							<text class='num font-color'>{{ integral || 0 }}</text>
						</view>
						<checkbox-group @change="ChangeIntegral">
							<checkbox :disabled="integral <= 0 && !useIntegral" :checked='useIntegral ? true : false' />
						</checkbox-group>
					</view>
				</view>
				<view v-if="invoice_func || special_invoice" class='item acea-row row-between-wrapper' @tap="goInvoice">
					<view>{{ $t(`开具发票`) }}</view>
					<view class='discount'>
						{{ invTitle }}
						<text class='iconfont icon-jiantou'></text>
					</view>
				</view>
				<view v-if="shippingType == 1">
					<view class="item acea-row row-between-wrapper">
						<view>{{ $t(`用户姓名`) }}</view>
						<view class="discount">
							<input style="text-align: right;" v-model="contacts" type="text" :placeholder="$t(`请输入姓名`)"
								placeholder-class="placeholder"></input>
						</view>
					</view>
					<view class="item acea-row row-between-wrapper">
						<view>{{ $t(`联系电话`) }}</view>
						<view class="discount">
							<input style="text-align: right;" v-model="contactsTel" type="text"
								:placeholder="$t(`请输入手机号`)" placeholder-class="placeholder"></input>
						</view>
					</view>
				</view>
				<view class='item' v-if="textareaStatus">
					<view>{{ $t(`备注说明`) }}</view>
					<view class="mark" v-if="!coupon.coupon && !inputTrip" @click="inputTripClick">
						<view :class="{ 'mark-msg': mark }" v-text="mark || $t(`填写备注信息，100字以内`)"></view>
					</view>
					<textarea placeholder-class='placeholder' :placeholder="$t(`填写备注信息，100字以内`)"
						v-if="!coupon.coupon && inputTrip" @input='bindHideKeyboard' :focus="focus"
						@blur="inputTrip = false" :value="mark" :maxlength="150" name="mark">
						</textarea>
				</view>
			</view>
			<view class='wrapper' v-if="confirm.length && (!is_gift || is_gift == 1)">
				<view class='item acea-row row-between-wrapper' v-for="(item, index) in confirm" :key="index">
					<view>
						<span v-if="item.status" style="color: red;">*</span>
						<span v-else style="marginLeft: 8px;"></span>
						{{ item.title }}
					</view>
					<!-- text -->
					<view v-if="item.label == 'text'" class="confirm">
						<input type="text" :placeholder="$t(`请填写${item.title}`)" v-model="item.value" />
					</view>
					<!-- number -->
					<view v-if="item.label == 'number'" class="confirm">
						<input type="number" :placeholder="$t(`请填写${item.title}`)" v-model="item.value" />
					</view>
					<!-- email -->
					<view v-if="item.label == 'email'" class="confirm">
						<input type="text" :placeholder="$t(`请填写${item.title}`)" v-model="item.value" />
					</view>
					<!-- data -->
					<view v-if="item.label == 'data'" class="uni-list">
						<view class="uni-list-cell">
							<view class="uni-list-cell-db">
								<picker mode="date" :value="item.value" @change="bindDateChange($event, index)">
									<view v-if="item.value == ''" class="fontC">{{ date + item.title }}<text
											class='iconfont icon-jiantou'></text></view>
									<view v-else class="uni-input">{{ item.value }}</view>
								</picker>
							</view>
						</view>
					</view>
					<!-- time -->
					<view v-if="item.label == 'time'">
						<view>
							<view>
								<picker mode="time" :value="item.value" start="00:00" end="23:59"
									@change="bindTimeChange($event, index)">
									<view v-if="item.value == ''" class="fontC">{{ time + item.title }}<text
											class='iconfont icon-jiantou'></text></view>
									<view>{{ item.value }}</view>
								</picker>
							</view>
						</view>
					</view>
					<!-- id -->
					<view v-if="item.label == 'id'" class="confirm">
						<input type="idcard" :placeholder="$t(`请填写`) + item.title" v-model="item.value" />
					</view>
					<!-- phone -->
					<view v-if="item.label == 'phone'" class="confirm">
						<input type="tel" :placeholder="$t(`请填写`) + item.title" v-model="item.value" />
					</view>
					<!-- img -->
					<view v-if="item.label == 'img'" class="confirmImg">
						<view class='list acea-row row-middle'>
							<view class='pictrue' v-for="(items, indexs) in item.value" :key="indexs">
								<image :src='items' class="img"></image>
								<text class='iconfont icon-guanbi1 font-num del' @click='DelPic(index, indexs)'></text>
							</view>
							<view class='pictrue acea-row row-center-wrapper row-column bor'
								@click='uploadpic(index, item)' v-if="item.value.length < 8">
								<text class='iconfont icon-icon25201'></text>
								<view>{{ $t(`上传图片`) }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class='moneyList' v-if="!is_gift || is_gift == 1">
				<view class='item acea-row row-between-wrapper'>
					<view>{{ $t(`商品总价`) }}：</view>
					<view class='money'>
						{{ $t(`￥`) }}{{ allPrice || 0 }}
					</view>
				</view>
				<!-- 团购优惠 -->
				<view v-if="groupBuy" class='item acea-row row-between-wrapper'>
					<view>{{ $t(`团购优惠`) }}：</view>
					<view class='money group-discount'>
						-{{ $t(`￥`) }}{{ parseFloat(groupDiscount || 0).toFixed(2) }}
					</view>
				</view>
				<view v-if="is_gift && priceGroup.giftPrice > 0" class='item acea-row row-between-wrapper'>
					<view>{{ $t(`礼品附加费`) }}：</view>
					<view class='money'>
						{{ $t(`￥`) }}{{ parseFloat(priceGroup.giftPrice) }}
					</view>
				</view>
				<view class='item acea-row row-between-wrapper'
					v-if="priceGroup.storePostage > 0 || priceGroup.storePostageDiscount > 0">
					<view>{{ $t(`配送运费`) }}：</view>
					<view class='money'>
						{{ $t(`￥`) }}{{ (parseFloat(priceGroup.storePostage) + parseFloat(priceGroup.storePostageDiscount)).toFixed(2) }}
					</view>
				</view>
				<view class='item acea-row row-between-wrapper'
					v-if="priceGroup.levelPrice > 0 && userInfo.vip && !pinkId && !BargainId && !combinationId && !seckillId && !discountId && !groupBuy">
					<view>{{ $t(`用户等级优惠`) }}：</view>
					<view class='money'>-{{ $t(`￥`) }}{{ parseFloat(priceGroup.levelPrice).toFixed(2) }}</view>
				</view>
				<view class='item acea-row row-between-wrapper'
					v-if="priceGroup.memberPrice > 0 && userInfo.vip && !pinkId && !BargainId && !combinationId && !seckillId && !discountId && !groupBuy">
					<view>{{ $t(`付费会员优惠`) }}：</view>
					<view class='money'>-{{ $t(`￥`) }}{{ parseFloat(priceGroup.memberPrice).toFixed(2) }}</view>
				</view>
				<view class='item acea-row row-between-wrapper' v-if="priceGroup.storePostageDiscount > 0 && !groupBuy">
					<view>{{ $t(`会员运费优惠`) }}：</view>
					<view class='money'>-{{ $t(`￥`) }}{{ parseFloat(priceGroup.storePostageDiscount).toFixed(2) }}</view>
				</view>
				<view class='item acea-row row-between-wrapper' v-if="coupon_price > 0 && !groupBuy">
					<view>{{ $t(`优惠券抵扣`) }}：</view>
					<view class='money'>-{{ $t(`￥`) }}{{ parseFloat(coupon_price).toFixed(2) }}</view>
				</view>
				<view class='item acea-row row-between-wrapper' v-if="integral_price > 0 && !groupBuy">
					<view>{{ $t(`积分抵扣`) }}：</view>
					<view class='money'>-{{ $t(`￥`) }}{{ parseFloat(integral_price).toFixed(2) }}</view>
				</view>
			</view>
			<view style='height:120rpx;'></view>
			<view class='footer acea-row row-between-wrapper' v-if="!is_gift || is_gift == 1">
				<view>{{ $t(`合计`) }}:
					<text class='font-color' style="color: #FF840B; font-weight: bold;">{{ $t(`￥`) }}{{ totalPrice ||
						0}}</text>
				</view>
				<view class='settlement' :class="{ 'group-buy-btn': groupBuy }" style='z-index:100'
					@tap.stop="Debounce(SubOrder())"
					v-if="(valid_count > 0 && !discount_id) || (valid_count == cartInfo.length && discount_id)">
					{{ groupBuy ? $t(`确认开团`) : $t(`提交订单`) }}
				</view>
				<view class='settlement bg-color-hui' style='z-index:100' v-else>{{ groupBuy ? $t(`确认开团`) : $t(`提交订单`) }}
				</view>
			</view>
		</view>
		<view class="alipaysubmit" v-html="formContent"></view>
		<couponListWindow :coupon='coupon' @ChangCouponsClone="ChangCouponsClone" :openType='openType' :cartId='cartId'
			@ChangCoupons="ChangCoupons"></couponListWindow>
		<addressWindow ref="addressWindow" @changeTextareaStatus="changeTextareaStatus" :news='news' :address='address'
			:pagesUrl="pagesUrl" @OnChangeAddress="OnChangeAddress" @changeClose="changeClose"
			@onHaveAddressList="onHaveAddressList"></addressWindow>
		<!-- #ifdef MP -->
		<!-- <authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize> -->
		<!-- #endif -->
		<home v-show="!invShow"></home>
		<invoice-picker :inv-show="invShow" :inv-list="invList" :inv-checked="invChecked" :is-special="special_invoice"
			:url-query="urlQuery" @inv-close="invClose" @inv-change="invChange" @inv-cancel="invCancel">
		</invoice-picker>
		<canvas canvas-id="canvas" v-if="canvasStatus"
			:style="{ width: canvasWidth + 'px', height: canvasHeight + 'px', position: 'absolute', left: '-100000px', top: '-100000px' }"></canvas>
	</view>
</template>

<script>
import {
	orderConfirm,
	getCouponsOrderPrice,
	orderCreate,
	postOrderComputed,
	checkShipping,
	getGiftOrderDetail,
	orderReceiveGift
} from '@/api/order.js'
import { purchaseFlowNavigation } from '@/utils/navigationConfig.js'
import {
	getAddressDefault,
	getAddressDetail,
	invoiceList,
	invoiceOrder
} from '@/api/user.js'
import {
	openPaySubscribe
} from '@/utils/SubscribeMessage.js'
import {
	storeListApi
} from '@/api/store.js'
import {
	CACHE_LONGITUDE,
	CACHE_LATITUDE
} from '@/config/cache.js'
import couponListWindow from '@/components/couponListWindow'
import addressWindow from '@/components/addressWindow'
import orderGoods from '@/components/orderGoods'
import home from '@/components/home'
import invoicePicker from '../components/invoicePicker/index.vue'
import {
	toLogin
} from '@/libs/login.js'
import {
	mapGetters
} from "vuex"
// #ifdef MP
import authorize from '@/components/Authorize'
// #endif
import payment from '@/components/payment'
import colors from "@/mixins/color"
import Debounce from "@/mixins/debounce"
export default {
	components: {
		payment,
		invoicePicker,
		couponListWindow,
		addressWindow,
		orderGoods,
		home,
		// #ifdef MP
		authorize
		// #endif
	},
	mixins: [colors, Debounce],
	data () {
		return {
			confirm: '', //自定义留言
			date: this.$t(`请选择`),
			time: this.$t(`请选择`),

			canvasWidth: "",
			canvasHeight: "",
			canvasStatus: false,
			newImg: [],


			textareaStatus: true,
			//支付方式
			cartArr: [{
				"name": this.$t(`微信支付`),
				"icon": "icon-weixin2",
				value: 'weixin',
				title: this.$t(`使用微信快捷支付`),
				payStatus: 1,
			},
			{
				"name": this.$t(`支付宝支付`),
				"icon": "icon-zhifubao",
				value: 'alipay',
				title: this.$t(`使用支付宝支付`),
				payStatus: 1,
			},
			{
				"name": this.$t(`余额支付`),
				"icon": "icon-yuezhifu",
				value: 'yue',
				title: this.$t(`可用余额`),
				payStatus: 1,
			},
			{
				"name": this.$t(`线下支付`),
				"icon": "icon-yuezhifu1",
				value: 'offline',
				title: this.$t(`使用线下付款`),
				payStatus: 2,
			}, {
				"name": this.$t(`好友代付`),
				"icon": "icon-haoyoudaizhifu",
				value: 'friend',
				title: this.$t(`找微信好友支付`),
				payStatus: 1,
			}

			],
			virtual_type: 0,
			allPrice: 0,
			formContent: '',
			payType: '', //支付方式
			openType: 1, //优惠券打开方式 1=使用
			active: 0, //支付方式切换
			coupon: {
				coupon: false,
				list: [],
				statusTile: this.$t(`立即使用`)
			}, //优惠券组件
			address: {
				address: false
			}, //地址组件
			addressInfo: {}, //地址信息
			pinkId: 0, //拼团id
			addressId: 0, //地址id
			couponId: 0, //优惠券id
			cartId: '', //购物车id
			orderId: '', // 订单id, 领取礼物页面传参
			BargainId: 0,
			combinationId: 0,
			seckillId: 0,
			discountId: 0,
			userInfo: {}, //用户信息
			mark: '', //备注信息
			couponTitle: this.$t(`请选择`), //优惠券
			coupon_price: 0, //优惠券抵扣金额
			useIntegral: false, //是否使用积分
			integral_price: 0, //积分抵扣金额
			integral: 0,
			usable_integral: 0,
			ChangePrice: 0, //使用积分抵扣变动后的金额
			formIds: [], //收集formid
			status: 0,
			is_address: false,
			toPay: false, //修复进入支付时页面隐藏从新刷新页面
			shippingType: 0,
			system_store: {},
			storePostage: 0,
			advanceId: 0,
			gift_mark: '这是送您的一份礼物~', // 礼物留言
			contacts: '',
			contactsTel: '',
			mydata: {},
			storeList: [],
			store_self_mention: 0,
			cartInfo: [],
			priceGroup: {},
			animated: false,
			totalPrice: 0,
			integralRatio: "0",
			pagesUrl: "",
			orderKey: "",
			// usableCoupon: {},
			offlinePostage: "",
			isAuto: false, //没有授权的不会自动授权
			isShowAuth: false, //是否隐藏授权
			from: '',
			news: 1,

			// invTitle: '不开发票',
			invTitle: this.$t(`不开发票`),
			special_invoice: false,
			invoice_func: false,
			header_type: '',
			invShow: false,
			invList: [],
			invChecked: '',
			urlQuery: '',
			pay_close: false,
			noCoupon: 0,
			valid_count: 0,
			discount_id: 0,
			is_shipping: true,
			inputTrip: false,
			focus: true,
			integral_open: false,
			jumpData: {},
			is_gift: 0, // 1 购买的礼品 2领取礼品
			giftData: null,
			groupBuy: false, // 是否是团购
			groupMembers: 1, // 团购人数
			groupDiscount: 0, // 团购优惠金额
			countdownTime: {
				hours: '00',
				minutes: '00',
				seconds: '00'
			},
			countdownTimer: null
		}
	},
	computed: mapGetters(['isLogin']),
	// watch: {
	// 	startDate() {
	// 		return this.getDate('start');
	// 	},
	// 	endDate() {
	// 		return this.getDate('end');
	// 	}
	// },
	onLoad (options) {
		// #ifdef H5
		this.from = this.$wechat.isWeixin() ? 'weixin' : 'weixinh5'
		// #endif
		// #ifdef MP
		this.from = 'routine'
		// #endif
		// #ifdef APP-PLUS
		this.from = 'app'
		// #endif
		if (!options.cartId && !options.order_id) return this.$util.Tips({
			title: this.$t(`请选择要购买的商品`)
		}, {
			tab: 3,
			url: 1
		})
		if (options.is_gift) {
			this.is_gift = Number(options.is_gift)
		}
		// 处理团购参数
		if (options.groupBuy) {
			this.groupBuy = options.groupBuy === '1'
			if (this.groupBuy) {
				this.groupMembers = Number(options.groupMembers || 1)
				this.groupDiscount = Number(options.groupDiscount || 0)
				// 启动倒计时
				this.startCountdown()
			}
		}
		this.couponId = options.couponId || 0
		this.noCoupon = Number(options.noCoupon) || 0
		this.pinkId = options.pinkId ? parseInt(options.pinkId) : 0
		this.addressId = options.addressId || 0
		this.cartId = options.cartId
		this.orderId = options.order_id || 0
		this.is_address = options.is_address ? true : false
		this.news = !options.new || options.new === '0' ? 0 : 1
		this.invChecked = options.invoice_id || ''
		this.header_type = options.header_type || '1'
		this.couponTitle = options.couponTitle || this.$t(`请选择`)
		if (options.invoice_id) {
			let name = ''
			name += options.header_type == 1 ? this.$t(`个人`) : this.$t(`企业`)
			name += options.invoice_type == 1 ? this.$t(`普通`) : this.$t(`专用`)
			name += this.$t(`发票`)
			this.invTitle = name
		}
		// #ifndef APP-PLUS
		this.textareaStatus = true
		// #endif
		if (this.isLogin && this.toPay == false && (this.is_gift == 0 || this.is_gift == 1)) {
			console.log('11')
			this.checkShipping()
		} else if (this.is_gift && this.isLogin) {
			this.getOrderDetail()
		} else {
			toLogin()
		}
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		let _this = this

		uni.$on("handClick", res => {
			if (res) {
				_this.system_store = res.address
			}
			// 清除监听
			uni.$off('handClick')
		})

	},

	onUnload () {
		// 清除倒计时
		if (this.countdownTimer) {
			clearInterval(this.countdownTimer)
			this.countdownTimer = null
		}
	},
	methods: {
		// 开始倒计时
		startCountdown () {
			// 清除之前的倒计时
			if (this.countdownTimer) {
				clearInterval(this.countdownTimer)
			}

			// 设置结束时间（示例：24小时后）
			const endTime = new Date().getTime() + 24 * 60 * 60 * 1000

			// 更新倒计时
			const updateCountdown = () => {
				const now = new Date().getTime()
				const distance = endTime - now

				if (distance <= 0) {
					// 倒计时结束
					clearInterval(this.countdownTimer)
					this.countdownTime = {
						hours: '00',
						minutes: '00',
						seconds: '00'
					}
					return
				}

				// 计算时分秒
				const hours = Math.floor(distance / (1000 * 60 * 60))
				const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
				const seconds = Math.floor((distance % (1000 * 60)) / 1000)

				// 更新数据
				this.countdownTime = {
					hours: hours < 10 ? '0' + hours : hours.toString(),
					minutes: minutes < 10 ? '0' + minutes : minutes.toString(),
					seconds: seconds < 10 ? '0' + seconds : seconds.toString()
				}
			}

			// 立即执行一次
			updateCountdown()

			// 设置定时器，每秒更新一次
			this.countdownTimer = setInterval(updateCountdown, 1000)
		},

		/**
		 * 提交订单
		 */
		SubOrder () {
			let that = this

			// 验证收货地址
			if (this.shippingType === 0 && !this.addressInfo.id && !this.virtual_type && (!this.is_gift || this.is_gift == 2)) {
				return that.$util.Tips({
					title: that.$t(`请选择收货地址`)
				})
			}

			// 验证自提信息
			if (this.shippingType === 1 && !this.virtual_type && (!this.is_gift || this.is_gift == 2)) {
				if (!this.contacts) {
					return that.$util.Tips({
						title: that.$t(`请填写姓名`)
					})
				}
				if (!this.contactsTel) {
					return that.$util.Tips({
						title: that.$t(`请填写联系电话`)
					})
				}
				if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.contactsTel)) {
					return that.$util.Tips({
						title: that.$t(`请填写正确的手机号`)
					})
				}
			}

			// 验证必填表单
			if (this.confirm.length && (!this.is_gift || this.is_gift == 1)) {
				for (let i = 0; i < this.confirm.length; i++) {
					if (this.confirm[i].status && !this.confirm[i].value) {
						return that.$util.Tips({
							title: that.$t(`请填写`) + that.confirm[i].title
						})
					}
				}
			}

			// 显示加载中
			uni.showLoading({
				title: that.$t(`正在提交订单`)
			})

			// 准备订单数据
			let data = {}
			if (this.shippingType === 1) {
				data = {
					addressId: 0,
					shipping_type: 1,
					store_id: this.system_store.id || 0,
					real_name: this.contacts,
					phone: this.contactsTel,
					mark: this.mark,
					couponId: this.couponId,
					useIntegral: this.useIntegral ? 1 : 0,
					bargainId: this.BargainId,
					combinationId: this.combinationId,
					pinkId: this.pinkId,
					seckill_id: this.seckillId,
					discount_id: this.discount_id,
					advance_id: this.advanceId,
					is_gift: this.is_gift,
					gift_mark: this.gift_mark,
					from: this.from
				}
			} else {
				data = {
					addressId: this.addressInfo.id || 0,
					shipping_type: 0,
					mark: this.mark,
					couponId: this.couponId,
					useIntegral: this.useIntegral ? 1 : 0,
					bargainId: this.BargainId,
					combinationId: this.combinationId,
					pinkId: this.pinkId,
					seckill_id: this.seckillId,
					discount_id: this.discount_id,
					advance_id: this.advanceId,
					is_gift: this.is_gift,
					gift_mark: this.gift_mark,
					from: this.from
				}
			}

			// 添加自定义表单数据
			if (this.confirm.length && (!this.is_gift || this.is_gift == 1)) {
				data.custom_form = {}
				this.confirm.forEach(item => {
					data.custom_form[item.title] = item.value
				})
			}

			// 添加发票信息
			if (this.invChecked) {
				data.invoice_id = this.invChecked
			}

			// 添加团购信息
			if (this.groupBuy) {
				data.groupBuy = 1
				data.groupMembers = this.groupMembers
			}

			// 创建订单
			orderCreate(this.orderKey, data).then(res => {
				uni.hideLoading()

				// 使用导航配置跳转到支付页面
				purchaseFlowNavigation.fromOrderConfirmToPayment({
					orderId: res.data.result.orderId,
					totalAmount: this.totalPrice,
					isGroupBuy: this.groupBuy,
					goodsInfo: this.cartInfo.length > 0 ? this.cartInfo[0] : null,
					groupMembers: this.groupMembers
				})
			}).catch(err => {
				uni.hideLoading()
				return that.$util.Tips({
					title: err || that.$t(`创建订单失败`)
				})
			})
		},
		// 添加跳转方法
		goToNewDesign () {
			uni.navigateTo({
				url: '/pages/goods/order_confirm/new_order_confirm'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.order-submission .moneyList .item .money {
	color: #666666;
	font-weight: 500;
}

.order-submission .footer .settlement.bg-color-hui {
	background: #cccccc;
	box-shadow: none;
}

.order-submission .footer {
	width: 100%;
	background-color: #fff;
	font-size: 28rpx;
	color: #333;
	box-sizing: border-box;
	position: fixed;
	left: 0;
	bottom: 0;
	padding: 20rpx 30rpx;
	padding-bottom: calc(20rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	z-index: 9;
	border-top: 1rpx solid #f5f5f5;
}

.order-submission .footer .settlement {
	font-size: 30rpx;
	color: #fff;
	width: 240rpx;
	height: 70rpx;
	background: linear-gradient(90deg, #FF7E00 0%, #FDA44D 100%);
	border-radius: 35rpx;
	text-align: center;
	line-height: 70rpx;
	box-shadow: 0 4rpx 8rpx rgba(255, 132, 11, 0.2);
}

.order-submission .footer .settlement.group-buy-btn {
	background: linear-gradient(90deg, #FF6B6B 0%, #FF3636 100%);
	box-shadow: 0 4rpx 8rpx rgba(255, 54, 54, 0.2);
}

.footer .transparent {
	opacity: 0
}

.confirm {
	text-align: right;
	font-size: 22rpx;
}

.confirmImg {
	width: 100%;

	.img {
		width: 136rpx;
		height: 136rpx;
	}

	.pictrue {
		width: 136rpx;
		height: 136rpx;
		box-sizing: border-box;
		margin: 18rpx;
		margin-bottom: 35rpx;
		position: relative;
		font-size: 22rpx;
		color: #bbb;

		.del {
			position: absolute;
			top: 0;
			right: 0;
		}
	}

	.bor {
		border: 1rpx solid #ddd;
	}

}

.fontC {
	color: grey;
}

.group-buy-info {
	background-color: #FFF5F5;
	border-radius: 12rpx;
	margin-bottom: 20rpx;
}

.group-status {
	color: #FF3636;
	font-weight: bold;
}

.group-members {
	color: #FF3636;
	font-weight: bold;
}

.group-countdown {
	color: #FF3636;
	font-weight: bold;
}

.group-discount {
	color: #FF3636 !important;
	font-weight: bold;
}

.new-design-link {
	position: fixed;
	right: 20rpx;
	top: 140rpx;
	z-index: 999;
	background: linear-gradient(to right, #FF7E00, #FDA44D);
	color: #fff;
	padding: 10rpx 20rpx;
	border-radius: 30rpx;
	font-size: 24rpx;
}
</style>