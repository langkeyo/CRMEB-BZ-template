<template>
	<view>
		<view class="title">{{agreement.title || ''}}</view>
		<view class="cont" v-html="agreement.content"></view>
	</view>
</template>

<script>
	import {
		memberCard
	} from '@/api/user.js';

	export default {
		data() {
			return {
				agreement: ''
			}
		},
		onLoad() {
			this.memberCard();
		},
		methods: {
			memberCard() {
				uni.showLoading({
					title: this.$t(`正在加载中`)
				});
				memberCard().then(res => {
					uni.hideLoading();
					const {
						member_explain
					} = res.data;
					this.agreement = member_explain;
				}).catch(err => {
					uni.hideLoading();
				});
			}
		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}
</style>

<style scoped lang="scss">
	.title {
		padding-top: 10rpx;
		font-size: 30rpx;
		text-align: center;
		font-weight: bold;
	}

	.cont {
		padding: 50rpx 30rpx;
		font-size: 28rpx;
		line-height: 1.6;
		color: #333333;

		/deep/ img {
			max-width: 100% !important;
		}

		/deep/ p {
			font-size: 28rpx !important;
			line-height: 1.6 !important;
			margin: 16rpx 0 !important;
			color: #333333 !important;
		}

		/deep/ div {
			font-size: 28rpx !important;
			line-height: 1.6 !important;
			color: #333333 !important;
		}

		/deep/ h1, /deep/ h2, /deep/ h3, /deep/ h4, /deep/ h5, /deep/ h6 {
			font-size: 32rpx !important;
			font-weight: 600 !important;
			margin: 24rpx 0 12rpx 0 !important;
			color: #222222 !important;
		}
	}
</style>
