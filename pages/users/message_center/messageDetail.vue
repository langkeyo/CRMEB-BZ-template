<template>
	<view class="msg-det">
		<!-- 返回按钮 -->
		<view class="back-button" @click="goBack">
			<!-- <text class="back-icon">←</text> -->
			<text class="back-text">返回</text>
		</view>

		<view class="title">
			{{ $t(msgData.title) }}
		</view>

		<view class="content">
			{{ msgData.content }}
		</view>
		<view class="add-time">
			{{ $t(`通知于`) }}{{ msgData.add_time }}
		</view>

	</view>
</template>

<script>
import {
	getMsgDetails
} from '@/api/user.js'

export default {
	components: {
	},
	data() {
		return {
			msgData: {}
		}
	},
	onLoad(option) {
		this.getMsgDetails(option.id)
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		getMsgDetails(id) {
			uni.showLoading({
				title: this.$t(`加载中`)
			})
			getMsgDetails(id).then(res => {
				uni.hideLoading()
				this.msgData = res.data
			}).catch(err => {
				uni.hideLoading()
				return this.$util.Tips({
					title: err
				})
			})
		}
	}
}
</script>

<style scoped lang="scss">
.msg-det {
	background-color: #fff;
	padding: 20rpx;

	.back-button {
		display: flex;
		align-items: center;
		padding: 20rpx 0;
		margin-bottom: 20rpx;

		.back-icon {
			font-size: 36rpx;
			margin-right: 10rpx;
		}

		.back-text {
			font-size: 28rpx;
			color: #666;
		}
	}

	.title {
		padding: 20rpx;
		font-size: 32rpx;
		font-weight: bold;
		padding-bottom: 20rpx;
		border-bottom: 1px solid #f2f2f2;
	}

	.add-time {
		color: #ababab;
		text-align: right;
		padding-right: 30rpx;
		margin-top: 30rpx;
	}

	.content {
		padding: 20rpx;
		color: #333;
	}
}
</style>