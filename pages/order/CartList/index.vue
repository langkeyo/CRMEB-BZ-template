<template>
	<view>
		<view class="cart-header">
			<view class="cart-header-left">
				<view class="cart-header-title">购物车</view>
				<view class="cart-header-num">共{{ cartNum }}件</view>
			</view>
			<view class="cart-header-right">
				<view class="cart-header-price">合计：¥{{ totalPrice }}</view>
				<view class="cart-header-btn">结算</view>
			</view>
		</view>
		<view class="cart-list">
			<view class="cart-item" v-for="(item, index) in cartList" :key="index">
				<view class="cart-item-left">
					<view class="cart-item-checkbox">
						<checkbox :checked="item.checked" @change="toggleCheck(item, index)"></checkbox>
					</view>
					<view class="cart-item-img">
						<image :src="item.product_image" mode="aspectFill"></image>
					</view>
					<view class="cart-item-info">
						<view class="cart-item-name">{{ item.product_name }}</view>
						<view class="cart-item-price">¥{{ item.product_price }}</view>
						<view class="cart-item-spec">{{ item.product_spec }}</view>
					</view>
				</view>
				<view class="cart-item-right">
					<view class="cart-item-num">
						<button class="cart-item-num-btn" @click="changeCartNum(item, index, -1)">-</button>
						<input type="number" class="cart-item-num-input" v-model="item.cart_num" @blur="checkNum(item, index)">
						<button class="cart-item-num-btn" @click="changeCartNum(item, index, 1)">+</button>
					</view>
					<view class="cart-item-del" @click="delCart(item, index)">删除</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getCartInfo, updateCart, removeCartItem } from '@/api/store.js';

export default {
	data() {
		return {
			cartList: [],
			valid: [],
			invalid: [],
			cartNum: 0,
			totalPrice: 0,
			loading: false,
			allChecked: false,
			selectAll: false,
			selectCartList: []
		};
	},
	onLoad() {
		this.getCartList();
	},
	methods: {
		getCartList() {
			this.loading = true;
			getCartInfo().then(res => {
				this.loading = false;
				this.cartList = res.data.list || [];
				this.valid = res.data.valid || [];
				this.invalid = res.data.invalid || [];
				this.cartNum = res.data.total_num || 0;
				this.totalPrice = res.data.total_price || 0;
				this.selectCartList();
			}).catch(err => {
				this.loading = false;
				this.$util.Tips({
					title: err.msg || '获取购物车失败'
				});
			});
		},
		toggleCheck(item, index) {
			this.cartList[index].checked = !this.cartList[index].checked;
			this.selectCartList();
		},
		selectAllItems() {
			this.cartList.forEach(item => {
				item.checked = this.selectAll;
			});
			this.selectCartList();
		},
		selectCartList() {
			this.selectCartList = this.cartList.filter(item => item.checked);
			this.allChecked = this.cartList.length > 0 && this.cartList.every(item => item.checked);
		},
		checkNum(item, index) {
			if (item.cart_num <= 0) {
				item.cart_num = 1;
			}
		},
		changeCartNum(item, index, num) {
			if (item.cart_num + num <= 0) return;
			updateCart({
				goods_id: item.product_id,
				quantity: num
			}).then(res => {
				this.cartList[index].cart_num += num;
				this.selectCartList();
			}).catch(err => {
				this.$util.Tips({
					title: err.msg || '修改数量失败'
				});
			});
		},
		delCart(item, index) {
			removeCartItem({
				goods_id: item.product_id
			}).then(res => {
				this.cartList.splice(index, 1);
				this.selectCartList();
				this.$util.Tips({
					title: '删除成功'
				});
			}).catch(err => {
				this.$util.Tips({
					title: err.msg || '删除失败'
				});
			});
		}
	}
};
</script>

<style scoped>
.cart-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 30rpx;
	background-color: #fff;
	border-bottom: 1rpx solid #eee;
}

.cart-header-left {
	display: flex;
	align-items: center;
}

.cart-header-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.cart-header-num {
	font-size: 24rpx;
	color: #999;
	margin-left: 10rpx;
}

.cart-header-right {
	display: flex;
	align-items: center;
}

.cart-header-price {
	font-size: 36rpx;
	font-weight: bold;
	color: #f00;
	margin-right: 20rpx;
}

.cart-header-btn {
	background-color: #ff6b6b;
	color: #fff;
	padding: 10rpx 20rpx;
	border-radius: 8rpx;
	font-size: 28rpx;
}

.cart-list {
	padding: 20rpx 30rpx;
	background-color: #fff;
}

.cart-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #eee;
}

.cart-item-left {
	display: flex;
	align-items: center;
}

.cart-item-checkbox {
	margin-right: 20rpx;
}

.cart-item-img {
	width: 120rpx;
	height: 120rpx;
	border-radius: 8rpx;
	overflow: hidden;
	margin-right: 20rpx;
}

.cart-item-img image {
	width: 100%;
	height: 100%;
}

.cart-item-info {
	flex: 1;
}

.cart-item-name {
	font-size: 32rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 8rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.cart-item-price {
	font-size: 28rpx;
	color: #f00;
	font-weight: bold;
	margin-bottom: 8rpx;
}

.cart-item-spec {
	font-size: 24rpx;
	color: #999;
}

.cart-item-right {
	display: flex;
	align-items: center;
}

.cart-item-num {
	display: flex;
	align-items: center;
	margin-right: 20rpx;
}

.cart-item-num-btn {
	width: 50rpx;
	height: 50rpx;
	line-height: 50rpx;
	text-align: center;
	font-size: 36rpx;
	color: #333;
	border: 1rpx solid #eee;
	border-radius: 4rpx;
	background-color: #f5f5f5;
}

.cart-item-num-input {
	width: 80rpx;
	height: 50rpx;
	line-height: 50rpx;
	text-align: center;
	font-size: 28rpx;
	color: #333;
	border: 1rpx solid #eee;
	border-radius: 4rpx;
	background-color: #f5f5f5;
}

.cart-item-del {
	font-size: 24rpx;
	color: #ff6b6b;
}
</style> 