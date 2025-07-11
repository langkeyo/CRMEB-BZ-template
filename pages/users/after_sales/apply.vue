<template>
	<view :style="colorStyle">
		<view class="after-sales-apply">
			<!-- 商品信息 -->
			<view class="goods-box">
				<view class="store-name">
					<text>{{ orderInfo.store_name || '' }}</text>
				</view>
				<view class="goods-item" v-for="(item, index) in goodsList" :key="index">
					<view class="goods-img">
						<image
							:src="item.productInfo.attrInfo ? item.productInfo.attrInfo.image : item.productInfo.image">
						</image>
					</view>
					<view class="goods-info">
						<view class="goods-name">{{ item.productInfo.store_name }}</view>
						<view class="goods-attr" v-if="item.productInfo.attrInfo">{{ item.productInfo.attrInfo.suk }}
						</view>
						<view class="goods-price">
							<text>{{ $t(`￥`) }}{{ item.productInfo.attrInfo ? item.productInfo.attrInfo.price :
								item.productInfo.price }}</text>
							<text class="goods-num">x{{ item.cart_num }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 申请表单 -->
			<view class="form-box">
				<!-- 退款原因 -->
				<view class="form-item">
					<view class="form-label">{{ $t(`退款原因`) }} <text class="required">*</text></view>
					<view class="form-input">
						<picker @change="bindReasonChange" :value="reasonIndex" :range="reasonList"
							range-key="reason_name">
							<view class="picker-view">
								<text v-if="reasonIndex === -1" class="placeholder">{{ $t(`请选择退款原因`) }}</text>
								<text v-else>{{ reasonList[reasonIndex].reason_name }}</text>
								<text class="arrow">></text>
							</view>
						</picker>
					</view>
				</view>

				<!-- 退款说明 -->
				<view class="form-item">
					<view class="form-label">{{ $t(`退款说明`) }}</view>
					<view class="form-input">
						<textarea v-model="formData.refund_explain" :placeholder="$t(`请填写退款说明（选填）`)" maxlength="200"
							class="textarea"></textarea>
						<view class="word-count">{{ formData.refund_explain.length }}/200</view>
					</view>
				</view>

				<!-- 上传凭证 -->
				<view class="form-item">
					<view class="form-label">{{ $t(`上传凭证`) }}</view>
					<view class="upload-box">
						<view class="upload-list">
							<view class="upload-item" v-for="(item, index) in formData.refund_img" :key="index">
								<image :src="item" class="upload-img" @click="previewImage(item)"></image>
								<view class="delete-icon" @click="deleteImage(index)">×</view>
							</view>
							<view class="upload-btn" @click="uploadImage" v-if="formData.refund_img.length < 3">
								<text class="icon">+</text>
								<text class="text">{{ $t(`上传图片`) }}</text>
							</view>
						</view>
						<view class="upload-tip">{{ $t(`最多上传3张图片`) }}</view>
					</view>
				</view>
			</view>

			<!-- 提交按钮 -->
			<view class="submit-btn" @click="submitApply" :class="{ 'disabled': loading }">
				<text v-if="!loading">{{ $t(`提交申请`) }}</text>
				<text v-else>{{ $t(`提交中...`) }}</text>
			</view>
		</view>

		<!-- #ifndef MP -->
		<home></home>
		<!-- #endif -->
	</view>
</template>

<script>
import home from '@/components/home'
import { refundGoodsList, ordeRefundReason, returnGoodsSubmit } from '@/api/order.js'
import { toLogin } from '@/libs/login.js'
import { mapGetters } from "vuex"
import colors from '@/mixins/color.js'

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
			reasonList: [],
			reasonIndex: -1,
			formData: {
				refund_reason: '',
				refund_explain: '',
				refund_img: []
			},
			loading: false
		}
	},
	computed: mapGetters(['isLogin']),
	onLoad (options) {
		if (options.order_id) {
			this.order_id = options.order_id
			if (this.isLogin) {
				this.getOrderGoods()
				this.getRefundReasons()
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
		// 获取订单商品信息
		getOrderGoods () {
			// 显示加载提示
			uni.showLoading({
				title: this.$t(`加载中`)
			})

			refundGoodsList(this.order_id).then(res => {
				this.goodsList = res.data.cart_info || []
				this.orderInfo = res.data || {}

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
		// 获取退款原因列表
		getRefundReasons () {
			ordeRefundReason().then(res => {
				this.reasonList = res.data || []
			}).catch(err => {
				this.$util.Tips({
					title: err || this.$t(`获取退款原因失败，请稍后重试`),
					icon: 'none'
				})
			})
		},
		// 选择退款原因
		bindReasonChange (e) {
			this.reasonIndex = e.detail.value
			this.formData.refund_reason = this.reasonList[this.reasonIndex].reason_name
		},
		// 上传图片
		uploadImage () {
			uni.chooseImage({
				count: 3 - this.formData.refund_img.length,
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
				uni.uploadFile({
					url: this.$util.apiUrl('upload/image'),
					filePath: tempFilePaths[i],
					name: 'file',
					header: {
						Authorization: this.$store.state.app.token
					},
					success: (uploadRes) => {
						const data = JSON.parse(uploadRes.data)
						if (data.status === 200) {
							this.formData.refund_img.push(data.data.url)
						} else {
							this.$util.Tips({
								title: data.msg || this.$t(`图片上传失败`),
								icon: 'none'
							})
						}
					},
					fail: (err) => {
						this.$util.Tips({
							title: this.$t(`图片上传失败`),
							icon: 'none'
						})
					},
					complete: () => {
						uploadCount++
						if (uploadCount === totalCount) {
							// 所有图片上传完成后隐藏加载提示
							uni.hideLoading()
						}
					}
				})
			}
		},
		// 删除图片
		deleteImage (index) {
			this.formData.refund_img.splice(index, 1)
		},
		// 预览图片
		previewImage (current) {
			uni.previewImage({
				current: current,
				urls: this.formData.refund_img
			})
		},
		// 表单验证
		validateForm () {
			if (!this.formData.refund_reason) {
				this.$util.Tips({
					title: this.$t(`请选择退款原因`)
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
				...this.formData,
				refund_img: this.formData.refund_img.join(',')
			}

			returnGoodsSubmit(this.order_id, data).then(res => {
				// 隐藏加载提示
				uni.hideLoading()

				this.loading = false
				this.$util.Tips({
					title: this.$t(`申请提交成功`),
					icon: 'success'
				})
				setTimeout(() => {
					uni.redirectTo({
						url: '/pages/users/after_sales/index'
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
		}
	}
}
</script>

<style lang="scss" scoped>
.after-sales-apply {
	padding-bottom: 120rpx;
}

.goods-box {
	background-color: #fff;
	padding: 30rpx;
	margin-bottom: 20rpx;

	.store-name {
		font-size: 30rpx;
		color: #333;
		margin-bottom: 20rpx;
	}

	.goods-item {
		display: flex;
		margin-bottom: 20rpx;

		.goods-img {
			width: 160rpx;
			height: 160rpx;
			margin-right: 20rpx;

			image {
				width: 100%;
				height: 100%;
				border-radius: 10rpx;
			}
		}

		.goods-info {
			flex: 1;

			.goods-name {
				font-size: 28rpx;
				color: #333;
				margin-bottom: 10rpx;
			}

			.goods-attr {
				font-size: 24rpx;
				color: #999;
				margin-bottom: 10rpx;
			}

			.goods-price {
				font-size: 28rpx;
				color: #333;
				display: flex;
				justify-content: space-between;

				.goods-num {
					color: #999;
				}
			}
		}
	}
}

.form-box {
	background-color: #fff;
	padding: 30rpx;
	margin-bottom: 20rpx;

	.form-item {
		margin-bottom: 30rpx;

		&:last-child {
			margin-bottom: 0;
		}

		.form-label {
			font-size: 28rpx;
			color: #333;
			margin-bottom: 20rpx;

			.required {
				color: var(--view-theme);
			}
		}

		.form-input {
			position: relative;

			.picker-view {
				height: 80rpx;
				border: 1px solid #eee;
				border-radius: 10rpx;
				padding: 0 30rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 28rpx;
				color: #333;

				.placeholder {
					color: #999;
				}

				.arrow {
					color: #999;
					font-size: 24rpx;
				}
			}

			.textarea {
				width: 100%;
				height: 200rpx;
				border: 1px solid #eee;
				border-radius: 10rpx;
				padding: 20rpx;
				font-size: 28rpx;
				color: #333;
			}

			.word-count {
				position: absolute;
				right: 20rpx;
				bottom: 20rpx;
				font-size: 24rpx;
				color: #999;
			}
		}
	}
}

.upload-box {
	.upload-list {
		display: flex;
		flex-wrap: wrap;

		.upload-item {
			width: 160rpx;
			height: 160rpx;
			margin-right: 20rpx;
			margin-bottom: 20rpx;
			position: relative;

			.upload-img {
				width: 100%;
				height: 100%;
				border-radius: 10rpx;
			}

			.delete-icon {
				position: absolute;
				top: -20rpx;
				right: -20rpx;
				width: 40rpx;
				height: 40rpx;
				background-color: rgba(0, 0, 0, 0.5);
				color: #fff;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 24rpx;
			}
		}

		.upload-btn {
			width: 160rpx;
			height: 160rpx;
			border: 1px dashed #ddd;
			border-radius: 10rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.icon {
				font-size: 40rpx;
				color: #999;
				margin-bottom: 10rpx;
			}

			.text {
				font-size: 24rpx;
				color: #999;
			}
		}
	}

	.upload-tip {
		font-size: 24rpx;
		color: #999;
		margin-top: 10rpx;
	}
}

.submit-btn {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	height: 100rpx;
	background-color: var(--view-theme);
	color: #fff;
	font-size: 30rpx;
	display: flex;
	align-items: center;
	justify-content: center;

	&.disabled {
		background-color: #ccc;
	}
}
</style>
