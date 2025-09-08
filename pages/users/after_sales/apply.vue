<template>
	<view class="after-sales-apply-pixel">
		<view class="header">
			<view class="back" @click="goBack">
				<text class="iconfont icon-fanhui"></text>
				<text class="back-text">返回</text>
			</view>
			<view class="title">申请售后</view>
		</view>
		<view class="main-card">
			<view class="section-title">商品详情</view>
			<view class="row">
				<view class="label">收货站点：</view>
				<view class="value">{{ orderInfo.station || '北京尚德井小区菜鸟驿站' }}</view>
				<text class="iconfont icon-more"></text>
			</view>
			<view class="goods-card-item" v-for="(goods, index) in getSelectedGoodsList()" :key="index">
				<image class="goods-img" :src="formatImage(goods.image)" mode="aspectFill" />
				<view class="goods-content">
					<view class="goods-title">{{ goods.title || '' }}</view>
					<view class="goods-desc" v-if="goods.spec">{{ goods.spec }}</view>
					<view class="goods-count">x{{ goods.quantity || 1 }}</view>
				</view>
			</view>
			<view class="row gray">
				<view class="label-text">配送费</view>
				<view class="price-text">免配送费</view>
			</view>
			<view class="row gray goods-total-row">
				<view style="display: flex; align-items: center;">
					<text class="label-text">商品总价</text>
					<text style="margin-left: 8rpx; color: #bcbcbc;">共{{ getSelectedGoodsCount() }}件商品</text>
				</view>
				<view class="price">￥{{ getSelectedGoodsTotalPrice() }}</view>
			</view>
			<view class="row total">
				<view>合计</view>
				<view class="price">￥{{ getTotalPrice() }}</view>
			</view>
		</view>
		<view class="main-card">
			<view class="section-title">补充描述</view>
			<view class="desc-upload">
				<view class="upload-box">
					<view class="upload-btn" @click="uploadImage">
						<text class="iconfont icon-add"></text>
						<text class="upload-text">上传凭证</text>
					</view>
					<!-- 显示已上传图片 -->
					<view class="image-preview" v-for="(img, index) in formData.images" :key="index">
						<image class="preview-img" :src="img" mode="aspectFill" @click="previewImage(img)"></image>
						<text class="delete-icon" @click="deleteImage(index)">×</text>
					</view>
				</view>
				<textarea class="desc-textarea" placeholder="请在下方上传售后商品图片和相关说明，给商家更详细的参考信息，需要上传至少2张图片，最多可上传3张图片" maxlength="300" v-model="formData.problem_description"></textarea>
				<view class="word-count">{{ formData.problem_description.length }}/300</view>
			</view>
		</view>
		<view class="footer-bar">
			<button class="cancel-btn" @click="goBack">取消</button>
			<button class="submit-btn" @click="submitApply">提交</button>
		</view>
	</view>
</template>

<script>
import home from '@/components/home'
import { createAfterSales } from '@/api/group.js'
import { toLogin } from '@/libs/login.js'
import { mapGetters } from "vuex"
import colors from '@/mixins/color.js'
import { getGroupOrderDetail } from '@/api/group.js'
import { HTTP_REQUEST_URL } from '@/config/app.js'

export default {
	components: {
		home
	},
	mixins: [colors],
	data () {
		return {
			order_id: '',
			orderInfo: {},
			goodsList: [],
			formData: {
				goods_id: '',
				problem_description: '',
				user_phone: '',
				images: []
			},
			loading: false
		}
	},
	computed: mapGetters(['isLogin']),
	onLoad (options) {
		if (options.order_id) {
			this.order_id = options.order_id
			// 如果有goods_id参数，保存到formData中
			if (options.goods_id) {
				this.formData.goods_id = options.goods_id
			}
			if (this.isLogin) {
				this.getOrderDetail()
			} else {
				toLogin()
			}
		} else {
			this.$util.Tips({
				title: this.$t(`缺少订单号无法申请售后`)
			})
			setTimeout(() => {
				uni.navigateBack()
			}, 1500)
		}
	},
	methods: {
		goBack() {
			uni.navigateBack();
		},
		// 获取选中的商品列表
		getSelectedGoodsList() {
			// 如果有goods_id，只显示对应的单个商品
			if (this.formData.goods_id && this.goodsList.length > 0) {
				const selectedGoods = this.goodsList.filter(goods => {
					// 确保goods_id匹配
					return goods.goods_id == this.formData.goods_id;
				});
				return selectedGoods.length > 0 ? selectedGoods : this.goodsList.slice(0, 1);
			}
			// 如果没有goods_id，显示所有商品
			return this.goodsList.length > 0 ? this.goodsList : [];
		},
		// 获取选中商品的数量
		getSelectedGoodsCount() {
			const selectedGoodsList = this.getSelectedGoodsList();
			return selectedGoodsList.reduce((total, goods) => {
				const quantity = parseInt(goods.quantity);
				return total + (isNaN(quantity) ? 1 : quantity);
			}, 0);
		},
		// 获取选中商品的总价
		getSelectedGoodsTotalPrice() {
			const selectedGoodsList = this.getSelectedGoodsList();
			const totalPrice = selectedGoodsList.reduce((total, goods) => {
				// 优先使用subtotal字段，如果没有则计算 price * quantity
				if (goods.subtotal !== undefined) {
					const subtotal = parseFloat(goods.subtotal);
					if (!isNaN(subtotal)) {
						return total + subtotal;
					}
				} else {
					// 确保价格和数量是有效数字
					const price = parseFloat(goods.price);
					const quantity = parseInt(goods.quantity);
					
					// 只有当价格和数量都有效时才计算
					if (!isNaN(price) && !isNaN(quantity) && quantity > 0) {
						return total + (price * quantity);
					}
				}
				return total;
			}, 0);
			return totalPrice.toFixed(2);
		},
		// 获取总价（单商品退款时显示商品总价，完整订单退款时显示订单总价）
		getTotalPrice() {
			// 如果是单商品退款（有goods_id），显示选中商品的总价
			if (this.formData.goods_id) {
				return this.getSelectedGoodsTotalPrice();
			}
			// 如果是完整订单退款（没有goods_id），显示订单总价
			return (this.orderInfo.pay_price || 0).toFixed(2);
		},
		// 获取订单商品信息
		getOrderDetail() {
			// 显示加载提示
			uni.showLoading({
				title: this.$t(`加载中`)
			})

			getGroupOrderDetail(this.order_id).then(res => {
				if (res.status === 200 && res.data) {
					this.orderInfo = res.data
					this.goodsList = res.data.goods || []
					
					// 如果有传入goods_id，保持原值；如果没有传入goods_id，则不设置默认值，显示所有商品
					
					// 获取用户手机号
					if (this.orderInfo.user && this.orderInfo.user.phone) {
						this.formData.user_phone = this.orderInfo.user.phone
					} else {
						// 从本地存储获取用户信息
						const userInfo = uni.getStorageSync('userInfo')
						if (userInfo && userInfo.phone) {
							this.formData.user_phone = userInfo.phone
						}
					}
				}

				// 隐藏加载提示
				uni.hideLoading()
			}).catch(err => {
				// 隐藏加载提示
				uni.hideLoading()

				this.$util.Tips({
					title: err || this.$t(`加载失败，请稍后重试`),
					icon: 'none'
				})

				// 加载失败后返回上一页
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
			})
		},
		// 上传图片
		uploadImage () {
			// 如果已经上传了3张图片，不允许再上传
			if (this.formData.images.length >= 3) {
				this.$util.Tips({
					title: this.$t(`最多只能上传3张图片`)
				})
				return
			}
			
			uni.chooseImage({
				count: 3 - this.formData.images.length,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					this.uploadImageToServer(res.tempFilePaths)
				}
			})
		},
		// 上传图片到服务器
		uploadImageToServer (tempFilePaths) {
			// 显示加载提示
			uni.showLoading({
				title: this.$t(`上传中`)
			})

			let uploadCount = 0
			const totalCount = tempFilePaths.length

			for (let i = 0; i < tempFilePaths.length; i++) {
				// 使用全局工具方法上传图片
				this.$util.uploadImgs(
					'upload/image', 
					tempFilePaths[i], 
					(data) => {
						// 上传成功回调
						this.formData.images.push(data.data.url)
						uploadCount++
						if (uploadCount === totalCount) {
							// 所有图片上传完成后隐藏加载提示
							uni.hideLoading()
						}
					}, 
					(error) => {
						// 上传失败回调
						uploadCount++
						if (uploadCount === totalCount) {
							// 所有图片上传完成后隐藏加载提示
							uni.hideLoading()
						}
					}
				)
			}
		},
		// 删除图片
		deleteImage (index) {
			this.formData.images.splice(index, 1)
		},
		// 预览图片
		previewImage (current) {
			uni.previewImage({
				current: current,
				urls: this.formData.images
			})
		},
		// 表单验证
		validateForm () {
			if (!this.formData.goods_id) {
				this.$util.Tips({
					title: this.$t(`请选择商品`)
				})
				return false
			}
			
			if (!this.formData.problem_description) {
				this.$util.Tips({
					title: this.$t(`请填写问题描述`)
				})
				return false
			}
			
			// 验证图片数量，确保至少上传2张图片
			if (this.formData.images.length < 2) {
				this.$util.Tips({
					title: this.$t(`请至少上传2张图片`)
				})
				return false
			}
			
			return true
		},
		// 提交申请
		submitApply () {
			if (this.loading) return
			if (!this.validateForm()) return

			this.loading = true

			// 显示加载提示
			uni.showLoading({
				title: this.$t(`提交中`)
			})

			const data = {
				order_id: this.order_id,
				goods_id: this.formData.goods_id,
				problem_description: this.formData.problem_description,
				user_phone: this.formData.user_phone,
				images: this.formData.images.join(',')
			}

			createAfterSales(data).then(res => {
				// 隐藏加载提示
				uni.hideLoading()

				this.loading = false
				this.$util.Tips({
					title: this.$t(`申请提交成功`),
					icon: 'success'
				})
				setTimeout(() => {
					// 跳转到售后详情页
					uni.redirectTo({
						url: `/pages/users/after_sales/detail?id=${res.data.id}`
					})
				}, 1500)
			}).catch(err => {
				// 隐藏加载提示
				uni.hideLoading()

				this.loading = false
				this.$util.Tips({
					title: err || this.$t(`提交失败，请稍后重试`),
					icon: 'none'
				})
			})
		},
		formatImage(url) {
			if (!url) return '/static/images/order/coffee.png';
			if (url.startsWith('http')) return url;
			return HTTP_REQUEST_URL + url;
		}
	}
}
</script>

<style lang="scss" scoped>
.after-sales-apply-pixel {
	background: #f7f7f7;
	min-height: 100vh;
	padding-bottom: 120rpx;
	.header {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 90rpx;
		background: #fff;
		position: relative;
		.back {
			position: absolute;
			left: 30rpx;
			top: 0;
			height: 100%;
			display: flex;
			align-items: center;
			.iconfont {
				font-size: 36rpx;
				color: #333;
				margin-right: 4rpx;
			}
			.back-text {
				font-size: 30rpx;
				color: #333;
			}
		}
		.title {
			font-size: 36rpx;
			font-weight: bold;
			color: #222;
		}
	}
	.main-card {
		background: #fff;
		border-radius: 16rpx;
		margin: 24rpx 16rpx 0 16rpx;
		box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.03);
		padding: 24rpx;
		.section-title {
			font-size: 30rpx;
			font-weight: bold;
			color: #222;
			margin-bottom: 18rpx;
		}
		.row {
			display: flex;
			align-items: center;
			font-size: 28rpx;
			color: #222;
			margin-bottom: 12rpx;
			&.gray {
				justify-content: space-between;
			}
			&.goods-total-row {
				justify-content: space-between;
			}
			&.total {
				font-weight: bold;
				color: #222;
				font-size: 30rpx;
				border-top: 1px solid #f5f5f5;
				padding-top: 12rpx;
				margin-top: 4rpx;
				justify-content: space-between;
			}
			.label {
				color: #222;
				font-weight: bold;
				margin-right: 8rpx;
			}
			.label-text {
				color: #999;  // 更深的灰色
			}
			.value {
				color: #666;
				flex: 1;
			}
			.flex-1 {
				flex: 1;
			}
			.price {
				color: #222;
				font-weight: 500;
				text-align: right;
				min-width: 80rpx;
			}
			.product-count {
				margin-right: 8rpx;
			}
			.iconfont {
				font-size: 28rpx;
				color: #bcbcbc;
				margin-left: 8rpx;
			}
		}
		.goods-card-item {
			display: flex;
			background: #f7f7f7;
			border-radius: 12rpx;
			padding: 16rpx;
			margin: 20rpx 0;
			position: relative;
			.goods-img {
				width: 120rpx;
				height: 120rpx;
				border-radius: 8rpx;
				margin-right: 18rpx;
			}
			.goods-content {
				flex: 1;
				.goods-title {
					font-size: 28rpx;
					color: #222;
					font-weight: 500;
					margin-bottom: 8rpx;
				}
				.goods-desc {
					font-size: 26rpx;
					color: #bcbcbc;
				}
			}
			.goods-count {
				position: absolute;
				right: 16rpx;
				top: 16rpx;
				font-size: 28rpx;
				color: #bcbcbc;
			}
		}
		.desc-upload {
			display: flex;
			flex-direction: column;
			.upload-box {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				margin-bottom: 18rpx;
				.upload-btn {
					width: 120rpx;
					height: 120rpx;
					border: 1rpx dashed #ddd;
					border-radius: 10rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					background: #fafafa;
					margin-right: 20rpx;
					margin-bottom: 20rpx;
					.iconfont {
						font-size: 40rpx;
						color: #bcbcbc;
						margin-bottom: 8rpx;
					}
					.upload-text {
						font-size: 24rpx;
						color: #bcbcbc;
					}
				}
				.image-preview {
					position: relative;
					margin-right: 20rpx;
					margin-bottom: 20rpx;
					.preview-img {
						width: 120rpx;
						height: 120rpx;
						border-radius: 8rpx;
					}
					.delete-icon {
						position: absolute;
						top: -10rpx;
						right: -10rpx;
						background: #ff4d4f;
						color: #fff;
						font-size: 24rpx;
						width: 36rpx;
						height: 36rpx;
						line-height: 32rpx;
						text-align: center;
						border-radius: 50%;
						border: 1rpx solid #fff;
					}
				}
			}
			.desc-textarea {
				width: 100%;
				min-height: 120rpx;
				border: 1px solid #eee;
				border-radius: 10rpx;
				padding: 20rpx;
				font-size: 28rpx;
				color: #333;
				background: #fafafa;
				margin-bottom: 8rpx;
			}
			.word-count {
				align-self: flex-end;
				font-size: 24rpx;
				color: #bcbcbc;
			}
		}
	}
	.footer-bar {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100rpx;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0 -2rpx 8rpx rgba(0,0,0,0.03);
		padding: 0 32rpx;
		.cancel-btn {
			flex: 1;
			margin-right: 24rpx;
			height: 72rpx;
			border-radius: 36rpx;
			background: #fff3e6;
			color: #ff9900;
			font-size: 30rpx;
			font-weight: bold;
			border: none;
			display: flex;
			align-items: center;
			justify-content: center;
			line-height: 1;
		}
		.submit-btn {
			flex: 1;
			height: 72rpx;
			border-radius: 36rpx;
			background: #ff9900;
			color: #fff;
			font-size: 30rpx;
			font-weight: bold;
			border: none;
			display: flex;
			align-items: center;
			justify-content: center;
			line-height: 1;
		}
	}
}
.price-text {
	color: #222;
}
</style>
